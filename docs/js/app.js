// ===== Main Application Logic =====
(function () {
    'use strict';

    // ---- State ----
    let currentSection = 'home';
    let completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    let quizScores = JSON.parse(localStorage.getItem('quizScores') || '{}');

    // ---- DOM Ready ----
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        buildNav();
        buildLessonGrid();
        buildLessonSections();
        buildCheatSheet();
        initMobileMenu();
        initScrollHandlers();
        initTypingDemo();
        initTerminal();
        handleHashNavigation();

        window.addEventListener('hashchange', handleHashNavigation);
    });

    // ---- Permission Calculator ----
    let permCalcInitialized = false;
    function initPermCalcIfNeeded() {
        const calc = document.getElementById('permission-calculator');
        if (!calc || permCalcInitialized) return;
        permCalcInitialized = true;

        function updatePermCalc() {
            const cbs = calc.querySelectorAll('.perm-cb');
            const perms = {u: 0, g: 0, o: 0, sp: 0};
            const symb = {u: '---', g: '---', o: '---'};
            const vals = {r: 4, w: 2, x: 1, suid: 4, sgid: 2, sticky: 1};

            cbs.forEach(function(cb) {
                if (cb.checked) {
                    perms[cb.dataset.who] += vals[cb.dataset.perm];
                }
            });

            ['u','g','o'].forEach(function(who) {
                const r = (perms[who] & 4) ? 'r' : '-';
                const w = (perms[who] & 2) ? 'w' : '-';
                const x = (perms[who] & 1) ? 'x' : '-';
                symb[who] = r + w + x;
            });

            if (perms.sp & 4) {
                symb.u = symb.u.substring(0, 2) + ((perms.u & 1) ? 's' : 'S');
            }
            if (perms.sp & 2) {
                symb.g = symb.g.substring(0, 2) + ((perms.g & 1) ? 's' : 'S');
            }
            if (perms.sp & 1) {
                symb.o = symb.o.substring(0, 2) + ((perms.o & 1) ? 't' : 'T');
            }

            const fullSymb = symb.u + symb.g + symb.o;
            const octalStr = (perms.sp > 0 ? String(perms.sp) : '0') + String(perms.u) + String(perms.g) + String(perms.o);
            const cmdOctal = perms.sp > 0 ? octalStr : String(perms.u) + String(perms.g) + String(perms.o);

            const parts = [];
            ['u','g','o'].forEach(function(who) {
                let p = '';
                if (perms[who] & 4) p += 'r';
                if (perms[who] & 2) p += 'w';
                if (perms[who] & 1) p += 'x';
                parts.push(who + '=' + p);
            });
            const cmdSymb = parts.join(',');

            const el1 = document.getElementById('perm-octal');
            const el2 = document.getElementById('perm-symbolic');
            const el3 = document.getElementById('perm-cmd-octal');
            const el4 = document.getElementById('perm-cmd-symbolic');
            if (el1) el1.textContent = octalStr;
            if (el2) el2.textContent = fullSymb;
            if (el3) el3.textContent = cmdOctal;
            if (el4) el4.textContent = cmdSymb;
        }

        calc.addEventListener('change', updatePermCalc);
        updatePermCalc();
    }

    // ---- Theme Toggle ----
    function initTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) {
            document.documentElement.setAttribute('data-theme', saved);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        }
        const btn = document.getElementById('themeToggle');
        if (btn) btn.addEventListener('click', toggleTheme);
    }

    function toggleTheme() {
        const html = document.documentElement;
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    }

    // ---- Navigation ----
    function buildNav() {
        // Desktop dropdown
        const dropdown = document.getElementById('lessonsDropdown');
        if (dropdown) {
            LESSONS.forEach(l => {
                const a = document.createElement('a');
                a.href = '#';
                a.className = 'dropdown-item';
                a.textContent = `${l.icon} ${l.id}. ${l.title}`;
                a.onclick = (e) => { e.preventDefault(); showSection('lesson-' + l.id); };
                dropdown.appendChild(a);
            });
        }

        // Mobile sidebar
        const sidebar = document.getElementById('sidebarContent');
        if (sidebar) {
            const homeLink = document.createElement('a');
            homeLink.className = 'sidebar-link';
            homeLink.href = '#';
            homeLink.textContent = '🏠 Ana Sayfa';
            homeLink.onclick = (e) => { e.preventDefault(); showSection('home'); closeMobileMenu(); };
            sidebar.appendChild(homeLink);

            LESSONS.forEach(l => {
                const a = document.createElement('a');
                a.href = '#';
                a.className = 'sidebar-link';
                a.textContent = `${l.icon} ${l.id}. ${l.title}`;
                a.onclick = (e) => { e.preventDefault(); showSection('lesson-' + l.id); closeMobileMenu(); };
                sidebar.appendChild(a);
            });

            const csLink = document.createElement('a');
            csLink.className = 'sidebar-link';
            csLink.href = '#';
            csLink.textContent = '📋 Kopya Kağıdı';
            csLink.onclick = (e) => { e.preventDefault(); showSection('cheatsheet'); closeMobileMenu(); };
            sidebar.appendChild(csLink);
        }
    }

    function buildLessonGrid() {
        const grid = document.getElementById('lessonsGrid');
        if (!grid) return;

        LESSONS.forEach(l => {
            const card = document.createElement('div');
            card.className = 'lesson-card' + (completedLessons.includes(l.id) ? ' completed' : '');
            card.innerHTML = `
                <div class="lesson-card-icon">${l.icon}</div>
                <div class="lesson-card-number">Bölüm ${l.id}</div>
                <h3 class="lesson-card-title">${l.title}</h3>
                <p class="lesson-card-subtitle">${l.subtitle}</p>
                <p class="lesson-card-desc">${l.description}</p>
                ${completedLessons.includes(l.id) ? '<span class="lesson-card-badge">✅ Tamamlandı</span>' : ''}
            `;
            card.onclick = () => showSection('lesson-' + l.id);
            grid.appendChild(card);
        });
    }

    function buildLessonSections() {
        const container = document.getElementById('lessonSections');
        if (!container) return;

        LESSONS.forEach((l, idx) => {
            const sec = document.createElement('section');
            sec.className = 'section';
            sec.id = `section-lesson-${l.id}`;
            sec.style.display = 'none';

            const prevBtn = idx > 0
                ? `<button class="btn btn-secondary" onclick="showSection('lesson-${LESSONS[idx - 1].id}')">← ${LESSONS[idx - 1].title}</button>`
                : `<button class="btn btn-secondary" onclick="showSection('home')">← Ana Sayfa</button>`;
            const nextBtn = idx < LESSONS.length - 1
                ? `<button class="btn btn-primary" onclick="showSection('lesson-${LESSONS[idx + 1].id}')">${LESSONS[idx + 1].title} →</button>`
                : `<button class="btn btn-primary" onclick="showSection('cheatsheet')">Kopya Kağıdı →</button>`;

            sec.innerHTML = `
                <div class="lesson-layout">
                    <nav class="chapter-toc" id="toc-lesson-${l.id}">
                        <div class="chapter-toc-header">
                            <span class="chapter-toc-title">📑 İçindekiler</span>
                            <button class="chapter-toc-toggle" aria-label="İçindekiler menüsünü aç/kapat">▾</button>
                        </div>
                        <ul class="chapter-toc-list"></ul>
                    </nav>
                    <div class="lesson-container">
                        <div class="lesson-header">
                            <span class="lesson-number">Bölüm ${idx + 1} / ${LESSONS.length}</span>
                            <h1 class="lesson-title">${l.icon} ${l.title} <small class="lesson-subtitle-inline">(${l.subtitle})</small></h1>
                            <p class="lesson-intro">${l.description}</p>
                        </div>
                        <div class="lesson-body">${l.content}</div>
                        ${l.quiz ? buildQuizHTML(l.id, l.quiz) : ''}
                        <div class="lesson-nav">
                            ${prevBtn}
                            ${nextBtn}
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(sec);
        });
    }

    // ---- Quiz System ----
    function buildQuizHTML(lessonId, questions) {
        let html = `<div class="quiz-section" id="quiz-${lessonId}">
            <h2 class="quiz-heading">🧠 Bilgi Testi</h2>
            <p class="quiz-intro">Bu bölümde öğrendiklerinizi test edin!</p>`;

        questions.forEach((q, qi) => {
            html += `<div class="quiz-question" data-lesson="${lessonId}" data-index="${qi}">
                <p class="quiz-question-text"><strong>${qi + 1}.</strong> ${q.question}</p>
                <div class="quiz-options">`;
            q.options.forEach((opt, oi) => {
                html += `<button class="quiz-option" data-lesson="${lessonId}" data-question="${qi}" data-option="${oi}" onclick="checkQuizAnswer(${lessonId}, ${qi}, ${oi})">${opt}</button>`;
            });
            html += `</div>
                <div class="quiz-feedback" id="feedback-${lessonId}-${qi}"></div>
            </div>`;
        });

        html += `<div class="quiz-result" id="quizResult-${lessonId}"></div></div>`;
        return html;
    }

    // Global quiz check function
    window.checkQuizAnswer = function (lessonId, questionIndex, selectedOption) {
        const lesson = LESSONS.find(l => l.id === lessonId);
        if (!lesson || !lesson.quiz) return;

        const q = lesson.quiz[questionIndex];
        const buttons = document.querySelectorAll(`.quiz-option[data-lesson="${lessonId}"][data-question="${questionIndex}"]`);
        const feedback = document.getElementById(`feedback-${lessonId}-${questionIndex}`);

        // Disable all buttons for this question
        buttons.forEach((btn, i) => {
            btn.disabled = true;
            btn.classList.remove('selected');
            if (i === q.correct) {
                btn.classList.add('correct');
            }
            if (i === selectedOption && i !== q.correct) {
                btn.classList.add('wrong');
            }
        });

        // Show feedback
        if (feedback) {
            if (selectedOption === q.correct) {
                feedback.innerHTML = `<span class="feedback-correct">✅ Doğru! ${q.explanation}</span>`;
            } else {
                feedback.innerHTML = `<span class="feedback-wrong">❌ Yanlış. ${q.explanation}</span>`;
            }
            feedback.style.display = 'block';
        }

        // Track scores
        if (!quizScores[lessonId]) quizScores[lessonId] = {};
        quizScores[lessonId][questionIndex] = selectedOption === q.correct;
        localStorage.setItem('quizScores', JSON.stringify(quizScores));

        // Check if all questions answered
        const allAnswered = lesson.quiz.every((_, i) => quizScores[lessonId] && quizScores[lessonId][i] !== undefined);
        if (allAnswered) {
            const correct = lesson.quiz.filter((_, i) => quizScores[lessonId][i]).length;
            const total = lesson.quiz.length;
            const result = document.getElementById(`quizResult-${lessonId}`);
            if (result) {
                const pct = Math.round((correct / total) * 100);
                let emoji = pct === 100 ? '🏆' : pct >= 75 ? '🎉' : pct >= 50 ? '👍' : '📖';
                result.innerHTML = `<div class="quiz-score">${emoji} Sonuç: ${correct}/${total} doğru (${pct}%)</div>`;
                result.style.display = 'block';

                if (pct >= 50 && !completedLessons.includes(lessonId)) {
                    completedLessons.push(lessonId);
                    localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
                    updateProgressBar();
                    // Update card
                    const cards = document.querySelectorAll('.lesson-card');
                    if (cards[lessonId - 1]) {
                        cards[lessonId - 1].classList.add('completed');
                    }
                }
            }
        }
    };

    // ---- Cheat Sheet ----
    function buildCheatSheet() {
        const container = document.getElementById('cheatsheetContent');
        if (!container || typeof CHEATSHEET === 'undefined') return;

        CHEATSHEET.forEach(group => {
            let html = `<div class="cheat-group">
                <h3 class="cheat-group-title">${group.title}</h3>
                <table class="cheat-table">
                    <tr><th>Komut</th><th>Açıklama</th></tr>`;
            group.items.forEach(item => {
                html += `<tr><td><code>${item.cmd}</code></td><td>${item.desc}</td></tr>`;
            });
            html += `</table></div>`;
            container.insertAdjacentHTML('beforeend', html);
        });
    }

    // ---- Chapter TOC Builder ----
    let tocObserver = null;

    function buildChapterTOC(sectionId) {
        // Clean up previous observer
        if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }

        const target = document.getElementById('section-' + sectionId);
        if (!target) return;

        const toc = target.querySelector('.chapter-toc');
        if (!toc) return;

        const tocList = toc.querySelector('.chapter-toc-list');
        const body = target.querySelector('.lesson-body');
        if (!tocList || !body) return;

        // Find all h2 and h3 inside lesson-body
        const headings = body.querySelectorAll('h2, h3');
        if (headings.length === 0) { toc.style.display = 'none'; return; }

        toc.style.display = '';
        tocList.innerHTML = '';

        headings.forEach((h, i) => {
            // Generate unique ID for anchor
            if (!h.id) {
                const slug = h.textContent
                    .replace(/[^\w\s\u00C0-\u024F-]/g, '')
                    .trim().replace(/\s+/g, '-').toLowerCase()
                    .substring(0, 50);
                h.id = `heading-${sectionId}-${i}-${slug}`;
            }

            const li = document.createElement('li');
            li.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';

            const a = document.createElement('a');
            a.href = '#' + h.id;
            a.textContent = h.textContent.replace(/^[\s\S]{0,2}(?=[A-Za-z\u00C0-\u024F])/, (m) => m.replace(/[^\w\s]/g, '').length ? m : '').trim();
            // Clean emoji prefix for cleaner display
            a.textContent = h.textContent.replace(/^\s*[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FEFF}]\s*/u, '').trim();
            a.addEventListener('click', (e) => {
                e.preventDefault();
                h.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // On mobile, collapse TOC after click
                if (window.innerWidth <= 1100) {
                    tocList.classList.remove('toc-expanded');
                }
            });

            li.appendChild(a);
            tocList.appendChild(li);
        });

        // Intersection Observer for active heading
        tocObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    tocList.querySelectorAll('a').forEach(a => a.classList.remove('toc-active'));
                    const activeLink = tocList.querySelector(`a[href="#${entry.target.id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('toc-active');
                        // Scroll active link into view within TOC
                        activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            });
        }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });

        headings.forEach(h => tocObserver.observe(h));

        // Toggle button for mobile
        const toggleBtn = toc.querySelector('.chapter-toc-toggle');
        const tocHeader = toc.querySelector('.chapter-toc-header');
        if (toggleBtn && !toggleBtn._tocBound) {
            toggleBtn._tocBound = true;
            const doToggle = () => {
                tocList.classList.toggle('toc-expanded');
                toggleBtn.textContent = tocList.classList.contains('toc-expanded') ? '▴' : '▾';
            };
            toggleBtn.addEventListener('click', (e) => { e.stopPropagation(); doToggle(); });
            tocHeader.addEventListener('click', doToggle);
        }
    }

    // ---- Section Navigation ----
    window.showSection = function (sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(s => s.style.display = 'none');

        // Show target
        const target = document.getElementById('section-' + sectionId);
        if (target) {
            target.style.display = 'block';
            currentSection = sectionId;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Initialize permission calculator if present
        initPermCalcIfNeeded();

        // Build chapter table of contents
        buildChapterTOC(sectionId);

        // Update hash
        history.pushState(null, '', '#' + sectionId);

        // Update nav active states
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        if (sectionId === 'home') {
            document.querySelector('.nav-link[data-section="home"]')?.classList.add('active');
        } else if (sectionId === 'cheatsheet') {
            document.querySelector('.nav-link[data-section="cheatsheet"]')?.classList.add('active');
        }

        updateProgressBar();
    };

    function handleHashNavigation() {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            showSection(hash);
        } else {
            showSection('home');
        }
    }

    // ---- Mobile Menu ----
    function initMobileMenu() {
        const btn = document.getElementById('mobileMenuBtn');
        const overlay = document.getElementById('mobileOverlay');
        const closeBtn = document.getElementById('closeSidebar');

        if (btn) btn.addEventListener('click', openMobileMenu);
        if (overlay) overlay.addEventListener('click', closeMobileMenu);
        if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
    }

    function openMobileMenu() {
        document.getElementById('mobileSidebar')?.classList.add('open');
        document.getElementById('mobileOverlay')?.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        document.getElementById('mobileSidebar')?.classList.remove('open');
        document.getElementById('mobileOverlay')?.classList.remove('visible');
        document.body.style.overflow = '';
    }

    // ---- Progress Bar ----
    function updateProgressBar() {
        const bar = document.getElementById('progressBar');
        if (!bar) return;

        if (currentSection === 'home' || currentSection === 'cheatsheet') {
            const pct = (completedLessons.length / LESSONS.length) * 100;
            bar.style.width = pct + '%';
        } else {
            const match = currentSection.match(/lesson-(\d+)/);
            if (match) {
                const num = parseInt(match[1]);
                const pct = (num / LESSONS.length) * 100;
                bar.style.width = pct + '%';
            }
        }
    }

    // ---- Scroll Handlers ----
    function initScrollHandlers() {
        const backToTop = document.getElementById('backToTop');
        const nav = document.getElementById('topNav');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Back to top button
            if (backToTop) {
                backToTop.classList.toggle('visible', scrollY > 400);
            }

            // Nav shadow on scroll
            if (nav) {
                nav.classList.toggle('scrolled', scrollY > 10);
            }
        });

        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // ---- Typing Demo ----
    function initTypingDemo() {
        const el = document.getElementById('typingDemo');
        if (!el) return;

        const lines = [
            { prompt: 'kullanici@linux:~$ ', text: 'ls -la', output: ['drwxr-xr-x  Belgeler/', 'drwxr-xr-x  Projeler/', '-rw-r--r--  notlar.txt', '-rwxr-xr-x  merhaba.sh'] },
            { prompt: 'kullanici@linux:~$ ', text: 'cat notlar.txt', output: ['Linux öğrenmek eğlencelidir!', 'Pratik yapmak çok önemli.'] },
            { prompt: 'kullanici@linux:~$ ', text: 'echo "Merhaba Linux!"', output: ['Merhaba Linux!'] },
            { prompt: 'kullanici@linux:~$ ', text: 'pwd', output: ['/home/kullanici'] },
            { prompt: 'kullanici@linux:~$ ', text: 'whoami', output: ['kullanici'] },
        ];

        let lineIndex = 0;

        async function typeLine() {
            if (!document.getElementById('typingDemo')) return;

            const line = lines[lineIndex % lines.length];
            el.innerHTML = '';

            // Type prompt
            const promptSpan = document.createElement('span');
            promptSpan.className = 'demo-prompt';
            promptSpan.textContent = line.prompt;
            el.appendChild(promptSpan);

            // Type command character by character
            const cmdSpan = document.createElement('span');
            cmdSpan.className = 'demo-cmd';
            el.appendChild(cmdSpan);

            for (let i = 0; i < line.text.length; i++) {
                await sleep(60 + Math.random() * 40);
                cmdSpan.textContent += line.text[i];
            }

            await sleep(500);

            // Show output
            for (const out of line.output) {
                const outDiv = document.createElement('div');
                outDiv.className = 'demo-output';
                outDiv.textContent = out;
                el.appendChild(outDiv);
                await sleep(150);
            }

            await sleep(2000);
            lineIndex++;
            typeLine();
        }

        typeLine();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

})();
