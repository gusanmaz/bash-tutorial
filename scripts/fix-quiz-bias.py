#!/usr/bin/env python3
"""Shuffle quiz options and balance answer lengths to reduce test-taking bias."""
from __future__ import annotations

import hashlib
import json
import random
import re
from pathlib import Path

CHAPTERS_DIR = Path(__file__).resolve().parents[1] / "docs" / "js" / "chapters"

BLOCK_RE = re.compile(
    r"(?P<indent>[ \t]*)\{\s*\n"
    r"\s*question:\s*\"(?P<question>(?:\\.|[^\"\\])*)\"\s*,\s*"
    r"options:\s*\[(?P<opts>.*?)\]\s*,\s*"
    r"correct:\s*(?P<correct>\d+)\s*,\s*"
    r"explanation:\s*\"(?P<explanation>(?:\\.|[^\"\\])*)\"\s*\n"
    r"\s*\}",
    re.DOTALL,
)

OPT_RE = re.compile(r"\"((?:\\.|[^\"\\])*)\"")


def parse_js_string(raw: str) -> str:
    return json.loads(f'"{raw}"')


def js_quote(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def parse_options(raw: str) -> list[str]:
    return [parse_js_string(m.group(1)) for m in OPT_RE.finditer(raw)]


def trim_correct(text: str) -> str:
    t = text.strip()
    for sep in (" — ", " - ", "; ", ", sonra ", ", ardından ", ", ve "):
        if sep in t and len(t) > 40:
            head = t.split(sep)[0].strip()
            if len(head) >= 15:
                t = head
                break
    if len(t) > 50 and ", " in t:
        head = t.split(", ")[0].strip()
        if len(head) >= 15:
            t = head
    if len(t) > 55 and " (" in t:
        t = t.split(" (")[0].strip()
    return t


def pad_wrong(text: str, target: int, idx: int) -> str:
    if len(text) >= target:
        return text
    suffixes = [
        " ve işlemi sonlandırır",
        " (Docker CLI'da yoktur)",
        " yerine farklı bir komut",
        " — bu davranış beklenmez",
        " olarak tanımlanmaz",
        " ile aynı işlevi görmez",
        " (genelde tercih edilmez)",
        " — pratikte kullanılmaz",
    ]
    prefixes = [
        "Varsayılan olarak ",
        "Bu senaryoda ",
        "Genellikle ",
    ]
    out = text
    step = 0
    while len(out) < target and step < 16:
        if step % 2 == 0:
            suffix = suffixes[(idx + step) % len(suffixes)]
            if suffix.strip() not in out:
                out = out + suffix
        else:
            prefix = prefixes[(idx + step) % len(prefixes)]
            if not out.startswith(prefix.split()[0]):
                candidate = prefix + out[0].lower() + out[1:] if out else prefix.strip()
                if len(candidate) <= target + 20:
                    out = candidate
        step += 1
    return out


def is_uniquely_longest(opts: list[str], correct: int) -> bool:
    lens = [len(o) for o in opts]
    longest = max(lens)
    if len(set(lens)) == 1:
        return False
    return lens[correct] == longest and lens.count(longest) == 1


def balance_options(options: list[str], correct: int) -> list[str]:
    opts = [o.strip() for o in options]
    opts[correct] = trim_correct(opts[correct])
    original_wrong = {i: opts[i] for i in range(4) if i != correct}

    for _ in range(8):
        lens = [len(o) for o in opts]
        target = int(sum(lens) / 4)

        for i in range(4):
            if i == correct:
                continue
            if len(opts[i]) < target - 4:
                opts[i] = pad_wrong(opts[i], target, i)

        cl = len(opts[correct])
        wrong_max = max(len(opts[i]) for i in range(4) if i != correct)
        if cl > wrong_max + 6:
            shorter = trim_correct(opts[correct])
            if len(shorter) < cl:
                opts[correct] = shorter
            else:
                words = opts[correct].split()
                while len(" ".join(words)) > wrong_max + 2 and len(words) > 3:
                    words.pop()
                opts[correct] = " ".join(words)

        if not is_uniquely_longest(opts, correct):
            break

    for _ in range(8):
        if not is_uniquely_longest(opts, correct):
            break

        cl = len(opts[correct])
        wrong_i = min((i for i in range(4) if i != correct), key=lambda i: len(opts[i]))
        if len(original_wrong[wrong_i]) + 35 < cl:
            shorter = trim_correct(opts[correct])
            if len(shorter) < len(opts[correct]):
                opts[correct] = shorter
                continue
            words = opts[correct].split()
            if len(words) > 3:
                opts[correct] = " ".join(words[:-1])
                continue

        opts[wrong_i] = pad_wrong(opts[wrong_i], cl, wrong_i)

    return opts


def shuffle_options(options: list[str], correct: int, seed: str) -> tuple[list[str], int]:
    rng = random.Random(int(hashlib.sha256(seed.encode()).hexdigest(), 16) % (2**32))
    tagged = list(enumerate(options))
    rng.shuffle(tagged)
    new_options = [text for _, text in tagged]
    new_correct = next(i for i, (orig, _) in enumerate(tagged) if orig == correct)
    return new_options, new_correct


def format_question(outer_indent: str, question: str, options: list[str], correct: int, explanation: str) -> str:
    inner = outer_indent + "    "
    opt_indent = inner + "    "
    opt_lines = ",\n".join(f"{opt_indent}{js_quote(o)}" for o in options)
    q = js_quote(question)[1:-1]
    e = js_quote(explanation)[1:-1]
    return (
        f"{outer_indent}{{\n"
        f'{inner}question: "{q}",\n'
        f"{inner}options: [\n"
        f"{opt_lines}\n"
        f"{inner}],\n"
        f"{inner}correct: {correct},\n"
        f'{inner}explanation: "{e}"\n'
        f"{outer_indent}}}"
    )


def process_quiz_body(body: str, file_stem: str) -> str:
    q_index = 0

    def repl(m: re.Match) -> str:
        nonlocal q_index
        question = parse_js_string(m.group("question"))
        options = parse_options(m.group("opts"))
        correct = int(m.group("correct"))
        explanation = parse_js_string(m.group("explanation"))

        if len(options) != 4:
            q_index += 1
            return m.group(0)

        options = balance_options(options, correct)
        options, correct = shuffle_options(
            options, correct, f"{file_stem}:{q_index}:{question}"
        )
        q_index += 1

        return format_question(m.group("indent"), question, options, correct, explanation)

    return BLOCK_RE.sub(repl, body)


def process_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    m = re.search(r"(\s+quiz:\s*\[)(.*?)(\n\s+\]\s*\n\}\);)", text, re.DOTALL)
    if not m:
        return False
    new_body = process_quiz_body(m.group(2), path.stem)
    path.write_text(text[: m.start(2)] + new_body + text[m.end(2) :], encoding="utf-8")
    return True


def analyze(text: str) -> dict:
    stats = {"total": 0, "longest": 0, "idx": {}}
    for m in BLOCK_RE.finditer(text):
        opts = parse_options(m.group("opts"))
        correct = int(m.group("correct"))
        if len(opts) != 4:
            continue
        stats["total"] += 1
        lens = [len(o) for o in opts]
        if lens[correct] == max(lens) and len(set(lens)) > 1 and lens.count(max(lens)) == 1:
            stats["longest"] += 1
        stats["idx"][correct] = stats["idx"].get(correct, 0) + 1
    return stats


def merge_stats(total: dict, part: dict) -> None:
    total["total"] += part["total"]
    total["longest"] += part["longest"]
    for k, v in part["idx"].items():
        total["idx"][k] = total["idx"].get(k, 0) + v


def main() -> None:
    before = {"total": 0, "longest": 0, "idx": {}}
    after = {"total": 0, "longest": 0, "idx": {}}

    for path in sorted(CHAPTERS_DIR.glob("ch*.js")):
        text = path.read_text(encoding="utf-8")
        merge_stats(before, analyze(text))
        if process_file(path):
            merge_stats(after, analyze(path.read_text(encoding="utf-8")))

    bt, at = max(before["total"], 1), max(after["total"], 1)
    print("BEFORE:", before, f"longest={before['longest']/bt*100:.1f}%")
    print("AFTER: ", after, f"longest={after['longest']/at*100:.1f}%")


if __name__ == "__main__":
    main()
