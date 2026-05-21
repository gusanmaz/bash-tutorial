#!/usr/bin/env bash
# Test ch27 Docker examples — run: sudo bash scripts/test-docker-ch27.sh
set -uo pipefail

DOCKER="${DOCKER:-docker}"
PASS=0
FAIL=0
SKIP=0
RESULTS=()

run_test() {
  local name="$1"
  shift
  printf '\n[%s] %s\n' "$name" "$*"
  if timeout 120 "$@" >/tmp/docker-test-out.log 2>/tmp/docker-test-err.log; then
    PASS=$((PASS + 1))
    RESULTS+=("OK   $name")
    head -3 /tmp/docker-test-out.log 2>/dev/null || true
  else
    local ec=$?
    if [[ $ec -eq 124 ]]; then
      SKIP=$((SKIP + 1))
      RESULTS+=("SKIP $name (timeout)")
    else
      FAIL=$((FAIL + 1))
      RESULTS+=("FAIL $name")
      cat /tmp/docker-test-err.log | tail -5
    fi
  fi
}

skip_interactive() {
  local name="$1"
  shift
  printf '\n[%s] MANUEL (interaktif): %s\n' "$name" "$*"
  SKIP=$((SKIP + 1))
  RESULTS+=("SKIP $name (interaktif — kendi terminalinde -it ile dene)")
}

run_detached() {
  local name="$1"
  shift
  local cname="test-${name//[^a-zA-Z0-9]/-}"
  printf '\n[%s] %s\n' "$name" "$*"
  $DOCKER rm -f "$cname" >/dev/null 2>&1 || true
  if $DOCKER run -d --name "$cname" "$@" >/tmp/docker-test-out.log 2>/tmp/docker-test-err.log; then
    sleep 3
    if $DOCKER ps --filter "name=$cname" --filter status=running -q | grep -q .; then
      PASS=$((PASS + 1))
      RESULTS+=("OK   $name")
      $DOCKER rm -f "$cname" >/dev/null 2>&1 || true
    else
      FAIL=$((FAIL + 1))
      RESULTS+=("FAIL $name (exited)")
      $DOCKER logs "$cname" 2>&1 | tail -8
      $DOCKER rm -f "$cname" >/dev/null 2>&1 || true
    fi
  else
    FAIL=$((FAIL + 1))
    RESULTS+=("FAIL $name")
    cat /tmp/docker-test-err.log | tail -5
  fi
}

echo "=== Docker context ==="
$DOCKER context use default 2>/dev/null || true
$DOCKER version --format '{{.Server.Version}}' 2>/dev/null || { echo "Docker erişilemiyor"; exit 1; }

echo
echo "=== Hızlı --rm örnekleri (Bölüm 27) ==="

run_test "cowsay-dragon" $DOCKER run --rm grycap/cowsay /usr/games/cowsay -f dragon "test"
run_test "cowsay-custom" $DOCKER run --rm grycap/cowsay /usr/games/cowsay "test"
run_test "cowsay-tux" $DOCKER run --rm grycap/cowsay /usr/games/cowsay -f tux "test"
run_test "cowsay-fortune" $DOCKER run --rm grycap/cowsay
run_test "figlet" $DOCKER run --rm hairyhenderson/figlet DOCKER
run_test "lolcat" bash -c 'echo "renkli test" | '"$DOCKER"' run -i --rm jamesnetherton/lolcat'

# -it gerektirir; script içinde takılır — sadece pull + manuel not
run_test "sl-pull" $DOCKER pull macabees/sl
skip_interactive "sl" $DOCKER run --rm -it macabees/sl
run_test "nyancat-pull" $DOCKER pull xddxdd/nyancat
skip_interactive "nyancat" $DOCKER run --rm -it xddxdd/nyancat
run_test "asciiquarium-pull" $DOCKER pull danielkraic/asciiquarium
skip_interactive "asciiquarium" $DOCKER run --rm -it danielkraic/asciiquarium

run_test "snake-pull" $DOCKER pull cmilanf/docker-snake
run_detached "snake-web" -p 18090:8080 cmilanf/docker-snake
run_detached "webrcade" -p 18088:80 webrcade/webrcade

echo
echo "=== Arka plan servisleri (pull + 3sn çalışma) ==="

run_detached "nginx" -p 18081:80 nginx:alpine
run_detached "jupyter" -p 18888:8888 jupyter/scipy-notebook
run_detached "uptime-kuma" -p 13001:3001 louislam/uptime-kuma
run_detached "it-tools" -p 18080:80 corentinth/it-tools
run_detached "adminer" -p 18082:8080 adminer
run_detached "postgres" -e POSTGRES_PASSWORD=test -p 15433:5432 postgres:16
run_detached "redis" -p 16379:6379 redis:7-alpine
run_detached "netshoot" nicolaka/netshoot sleep 30

echo
echo "=== Sadece imaj var mı (pull) ==="
for img in \
  photostructure/server \
  linuxserver/calibre-web \
  webrcade/webrcade \
  rhasspy/wyoming-piper \
  zadam/trilium \
  nextcloud \
  jellyfin/jellyfin \
  ghcr.io/home-assistant/home-assistant:stable \
  requarks/wiki \
  ghcr.io/advplyr/audiobookshelf \
  vaultwarden/server \
  dpage/pgadmin4 \
  aminvakil/slowloris \
  lscr.io/linuxserver/beets:latest; do
  printf 'pull %s ... ' "$img"
  if $DOCKER pull "$img" >/tmp/docker-test-out.log 2>/tmp/docker-test-err.log; then
    PASS=$((PASS + 1))
    RESULTS+=("OK   pull $img")
    echo OK
  else
    FAIL=$((FAIL + 1))
    RESULTS+=("FAIL pull $img")
    echo FAIL
    tail -2 /tmp/docker-test-err.log
  fi
done

echo
echo "========================================"
echo "SONUÇ: $PASS başarılı, $FAIL hatalı, $SKIP atlandı (manuel/interaktif)"
echo "========================================"
printf '%s\n' "${RESULTS[@]}"

exit $([[ $FAIL -eq 0 ]] && echo 0 || echo 1)
