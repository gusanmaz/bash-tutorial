// ===== Bölüm 37: CI/CD Araçları, Best Practices ve Kaynaklar =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 37,
    title: 'CI/CD Araçları ve Kaynaklar',
    subtitle: 'GitLab CI, Jenkins & DevOps Resources',
    icon: '📚',
    description: 'GitLab CI, Jenkins karşılaştırması, best practices, Türkçe/İngilizce kaynaklar ve alıştırma projeleri.',
    content: `
<h2>GitHub Actions Yetmez mi?</h2>
<p>Çoğu açık kaynak projesi GitHub Actions kullanır. İş hayatında <strong>GitLab CI</strong>, <strong>Jenkins</strong> de sık görülür — mantık aynı, sadece dosya formatı farklı.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Self-hosted, GitOps, idempotent</div>
    <ul>
        <li><strong>Self-hosted</strong>: Runner'ı kendi sunucunuzda çalıştırmak — veriler şirket içinde kalır.</li>
        <li><strong>GitOps</strong>: Sunucu ayarlarının Git'te tutulması — değişiklik PR ile, otomatik uygulanır (Argo CD, Flux).</li>
        <li><strong>Idempotent deploy</strong>: Deploy script'i iki kez çalışsa bile aynı sonuç — "zaten kuruluysa tekrar kurma" mantığı.</li>
        <li><strong>Anti-pattern</strong>: Kaçınılması gereken kötü alışkanlık — örn. Cuma akşam elle canlı deploy.</li>
    </ul>
</div>

<h2>GitLab CI — Tek Dosya, Güçlü Pipeline</h2>
<div class="info-box note">
    <div class="info-box-title">📌 GitLab CI terimleri</div>
    <ul>
        <li><strong>Stage</strong> (<em>aşama</em>): Pipeline'daki sıra — önce test, sonra build, en son deploy.</li>
        <li><strong>GitLab Runner</strong>: GitLab CI'ın koştuğu makine — GitHub'daki runner ile aynı rol.</li>
        <li><strong>dind</strong> (Docker in Docker): Runner içinde Docker çalıştırma — imaj build etmek için gerekir.</li>
        <li><strong>CI_REGISTRY</strong>: GitLab'ın kendi imaj deposu — Docker Hub hesabı şart değil.</li>
    </ul>
</div>
<p>GitLab repo'nuzda kök dizine <code>.gitlab-ci.yml</code> koyarsınız. CI/CD platforma gömülüdür — Bölüm 16'da kısa örnek görmüştünüz.</p>

<div class="code-block">
    <div class="code-block-header"><span>.gitlab-ci.yml — Docker build örneği</span></div>
    <pre><code>stages:
  - test
  - build
  - deploy

variables:
  IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

test:
  stage: test
  image: python:3.12-slim
  script:
    - pip install -r requirements.txt
    - pytest

build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG
  only:
    - main

deploy:
  stage: deploy
  script:
    - echo "Deploy $IMAGE_TAG to production"
  environment: production
  only:
    - main</code></pre>
</div>

<table>
    <tr><th>GitHub Actions</th><th>GitLab CI</th></tr>
    <tr><td><code>jobs</code></td><td><code>stages</code> + job adları</td></tr>
    <tr><td><code>runs-on</code></td><td><code>image:</code> (konteyner imajı)</td></tr>
    <tr><td><code>needs:</code></td><td><code>stages</code> sırası</td></tr>
    <tr><td><code>secrets.X</code></td><td>CI/CD Variables (masked)</td></tr>
    <tr><td>GitHub hosted runner</td><td>GitLab Runner (shared veya self-hosted)</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 GitLab Container Registry</div>
    GitLab projelerinde <code>$CI_REGISTRY_IMAGE</code> hazır registry adresidir — ayrı Docker Hub hesabı şart değil. Self-hosted GitLab kurum içi ekiplerde çok popüler.
</div>

<h2>Jenkins — Klasik, Esnek, Self-Hosted</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Jenkins, Jenkinsfile, plugin</div>
    <ul>
        <li><strong>Jenkins</strong>: Kendi sunucunuzda çalışan eski ama yaygın CI aracı — kurulum ve bakım sizde.</li>
        <li><strong>Jenkinsfile</strong>: Pipeline tarifinin kod dosyası — GitHub Actions'taki <code>.yml</code> workflow'un Jenkins karşılığı.</li>
        <li><strong>Plugin</strong>: Jenkins'e ek özellik ekleyen modül — Docker, Slack bildirimi, test raporu gibi.</li>
        <li><strong>On-prem</strong>: Bulutta değil, şirketin kendi sunucularında çalıştırma.</li>
    </ul>
</div>
<p>Jenkins yıllardır endüstride. Kendi sunucunuzda çalışır; plugin ekosistemi devasa.</p>

<div class="code-block">
    <div class="code-block-header"><span>Jenkinsfile (Declarative Pipeline)</span></div>
    <pre><code>pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'pip install -r requirements.txt'
                sh 'pytest'
            }
        }
        stage('Docker Build') {
            steps {
                sh 'docker build -t myapp:${BUILD_NUMBER} .'
            }
        }
        stage('Deploy') {
            when { branch 'main' }
            steps {
                sh 'docker push myapp:${BUILD_NUMBER}'
            }
        }
    }
}</code></pre>
</div>

<p>Jenkins avantajı: her şey plugin. Dezavantajı: kurulum, güncelleme ve bakım sizde. Yeni projelerde GitHub Actions / GitLab CI tercih edilir; legacy kurumsal ortamlarda Jenkins hâlâ güçlü.</p>

<h2>Platform Karşılaştırması</h2>
<table>
    <tr><th>Platform</th><th>Kimler için?</th></tr>
    <tr><td><strong>GitHub Actions</strong></td><td>GitHub projeleri, açık kaynak, startup</td></tr>
    <tr><td><strong>GitLab CI</strong></td><td>Self-hosted, tek platform (Git+CI+Registry)</td></tr>
    <tr><td><strong>Jenkins</strong></td><td>Kurumsal, özelleştirme, on-prem</td></tr>
    <tr><td><strong>CircleCI</strong></td><td>Hızlı bulut CI, Docker-first</td></tr>
    <tr><td><strong>Azure Pipelines</strong></td><td>Microsoft/Azure ekosistemi</td></tr>
</table>

<h2>CI/CD Best Practices ✅</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Artifact, fail fast, idempotent</div>
    <ul>
        <li><strong>Artifact</strong> (<em>yapıt</em>): Pipeline'ın ürettiği dosya — test raporu, log arşivi; sonradan indirip incelersiniz.</li>
        <li><strong>Fail fast</strong>: Ucuz adımlar (lint, test) önce — hata erken yakalanır, deploy'a gereksiz zaman harcanmaz.</li>
        <li><strong>Idempotent</strong> (<em>tekrarlanabilir</em>): Deploy script'i iki kez çalışsa da aynı sonucu vermeli — "zaten kuruluysa tekrar kurma, güncelle".</li>
    </ul>
</div>
<div class="info-box tip">
    <div class="info-box-title">💡 Altın Kurallar</div>
    <ol>
        <li><strong>Pipeline hızlı olsun</strong> — cache, paralel job, küçük imaj.</li>
        <li><strong>Fail fast</strong> — lint/test önce, deploy en sonda.</li>
        <li><strong>Aynı imaj her yerde</strong> — build once, deploy anywhere.</li>
        <li><strong>Secret yönetimi</strong> — asla repo'da, rotation yapın.</li>
        <li><strong>Branch protection + PR CI</strong> — main kutsaldır.</li>
        <li><strong>Rollback planı</strong> — önceki imaj tag'i hazır olsun.</li>
        <li><strong>Idempotent deploy</strong> — script tekrar koşsa sorun çıkmasın.</li>
        <li><strong>Log ve artifact</strong> — debug için saklayın.</li>
    </ol>
</div>

<h2>Anti-Pattern'ler ❌</h2>
<ul>
    <li>Production'a doğrudan push (PR'sız).</li>
    <li>Şifreleri workflow YAML'ına yazmak.</li>
    <li>CI olmadan Cuma akşam deploy.</li>
    <li>Test olmayan pipeline — sadece "build geçti" yeter sanmak.</li>
    <li>Her commit'te production deploy (staging atlamak).</li>
</ul>

<h2>Resmi Kaynaklar 📖</h2>
<div class="info-box tip">
    <div class="info-box-title">📖 Dokümantasyon</div>
    <ul>
        <li><a href="https://docs.github.com/en/actions" target="_blank" rel="noopener">GitHub Actions Docs</a></li>
        <li><a href="https://docs.github.com/en/actions/use-cases-and-examples/publishing-packages/publishing-docker-images" target="_blank" rel="noopener">GitHub — Docker imaj publish</a></li>
        <li><a href="https://docs.gitlab.com/ee/ci/" target="_blank" rel="noopener">GitLab CI Docs</a></li>
        <li><a href="https://www.jenkins.io/doc/" target="_blank" rel="noopener">Jenkins Documentation</a></li>
        <li><a href="https://docs.docker.com/build/ci/github-actions/" target="_blank" rel="noopener">Docker — GitHub Actions entegrasyonu</a></li>
    </ul>
</div>

<h2>YouTube ve Video 📺</h2>
<ul>
    <li><a href="https://www.youtube.com/watch?v=R8_veQiYBjI" target="_blank" rel="noopener">TechWorld with Nana — GitHub Actions Tutorial</a></li>
    <li><a href="https://www.youtube.com/watch?v=nyKZTKQS_EQ" target="_blank" rel="noopener">freeCodeCamp — GitHub Actions Full Course</a></li>
    <li><a href="https://www.youtube.com/c/Bretfisher" target="_blank" rel="noopener">Bret Fisher — Docker + CI/CD</a></li>
    <li><a href="https://www.youtube.com/results?search_query=gitlab+ci+t%C3%BCrk%C3%A7e" target="_blank" rel="noopener">GitLab CI Türkçe araması</a></li>
</ul>

<h2>Kitaplar 📚</h2>
<ul>
    <li><strong>The DevOps Handbook</strong> — Gene Kim et al. (kültür + CI/CD)</li>
    <li><strong>Continuous Delivery</strong> — Humble & Farley (klasik)</li>
    <li><strong>Learning GitHub Actions</strong> — Brent Laster</li>
    <li><strong>Docker Deep Dive</strong> — Nigel Poulton (CI bölümleri)</li>
</ul>

<h2>Faydalı Action'lar ve Araçlar 🛠️</h2>
<table>
    <tr><th>Araç</th><th>Ne işe yarar?</th></tr>
    <tr><td><code>actions/checkout</code></td><td>Repo klonlama</td></tr>
    <tr><td><code>docker/build-push-action</code></td><td>Build + push</td></tr>
    <tr><td><code>appleboy/ssh-action</code></td><td>SSH deploy</td></tr>
    <tr><td><a href="https://github.com/nektos/act" target="_blank" rel="noopener">act</a></td><td>Local workflow test</td></tr>
    <tr><td><a href="https://github.com/int128/docker-build-cache-action" target="_blank" rel="noopener">cache-action</a></td><td>Gelişmiş cache</td></tr>
</table>

<h2>Alıştırma Projeleri 🧑‍🏫</h2>
<ol>
    <li>Python projesine pytest + GitHub Actions CI ekleyin.</li>
    <li>Dockerfile'lı projeyi build + Docker Hub push pipeline'ına bağlayın.</li>
    <li>PR'da lint (flake8/eslint), main'de deploy ayrımı yapın.</li>
    <li>Matrix ile 2 Python sürümünde test edin.</li>
    <li>GitHub Environment ile onaylı deploy simüle edin.</li>
    <li>Compose ile entegrasyon testi job'u yazın.</li>
    <li>Aynı projeyi <code>.gitlab-ci.yml</code> ile GitLab'da deneyin.</li>
    <li>README'ye CI badge ekleyin.</li>
    <li>Release tag ile semver imaj tag'i üretin.</li>
    <li>(İleri) K8s deploy — <code>deploy-k8s.yml</code> (Bölüm 36, <code>examples/flask-ci/k8s/</code>).</li>
    <li>Trivy ile CI'da imaj güvenlik taraması ekleyin (Bölüm 42).</li>
</ol>

<h2>CI/CD + Docker + Kubernetes + TGO Yol Haritası</h2>
<ul>
    <li><strong>Bölüm 16</strong>: Git — versiyon kontrol temeli.</li>
    <li><strong>Bölüm 28–32</strong>: Docker — imaj, Compose, pratik.</li>
    <li><strong>Bölüm 33–37</strong>: CI/CD — TGO haritası, GitHub Actions, CD stratejileri, deploy.</li>
    <li><strong>Bölüm 36</strong>: VPS ve Kubernetes deploy workflow (<code>examples/flask-ci/</code>).</li>
    <li><strong>Bölüm 38–42</strong>: Kubernetes — orkestrasyon, YAML, güvenlik, Terraform IaC.</li>
</ul>

<div class="info-box tip">
    <div class="info-box-title">💡 Son Söz</div>
    CI/CD bir kere kurulunca her gün size zaman kazandırır. İlk workflow'u yazmak 1 saat sürebilir; ama yüzüncü manuel deploy'dan kurtarır. Docker imajınız hazır, pipeline'ınız yeşil — sırada Kubernetes ile ölçek var. Mutlu deploy'lar! 🔄
</div>

<h2>Sıradaki Adım: Kubernetes ☸️</h2>
<p>CI pipeline'ınız imajı registry'ye push ediyor. Peki 10 sunucu, otomatik ölçekleme, sıfır kesinti güncelleme? <strong>Bölüm 38</strong>'ten itibaren Kubernetes'e geçiyoruz — CI/CD ile birleşince tam modern DevOps hattı oluşur.</p>
`,
    quiz: [
        {
            question: "GitLab CI yapılandırma dosyası adı nedir?",
            options: [
                ".gitlab-ci.yml",
                ".github/workflows/ci.yml",
                "Jenkinsfile",
                "docker-compose.yml"
            ],
            correct: 0,
            explanation: "GitLab CI/CD .gitlab-ci.yml dosyası ile tanımlanır; repo kökünde durur."
        },
        {
            question: "GitLab CI'da stages ne belirler?",
            options: [
                "Job'ların çalışma sırasını",
                "Docker imaj adını",
                "Git branch adını",
                "Secret şifreleme"
            ],
            correct: 0,
            explanation: "stages (test, build, deploy) job gruplarının sıralı akışını tanımlar."
        },
        {
            question: "Jenkins'in tipik dezavantajı nedir?",
            options: [
                "Kurulum ve bakım yükü self-hosted sunucuda",
                "Docker desteklemez",
                "YAML kullanamaz",
                "Sadece Windows'ta çalışır"
            ],
            correct: 0,
            explanation: "Jenkins esnek ve güçlüdür ama sunucu kurulumu, plugin güncellemesi ve bakım ekibe kalır."
        },
        {
            question: "'Build once, deploy anywhere' ne demek?",
            options: [
                "Aynı imaj tüm ortamlara deploy edilir",
                "Her ortamda farklı build",
                "Sadece local build",
                "Deploy olmadan test"
            ],
            correct: 0,
            explanation: "CI'da bir kez build edilen imaj dev/staging/prod'da aynen kullanılır — tutarlılık sağlar."
        },
        {
            question: "GitLab Container Registry avantajı?",
            options: [
                "GitLab projesiyle entegre hazır registry",
                "Ücretsiz sınırsız bandwidth garantisi",
                "Kubernetes zorunlu",
                "Jenkins plugin"
            ],
            correct: 0,
            explanation: "GitLab'da CI_REGISTRY_IMAGE ile proje bazlı registry kullanılır; ayrı Docker Hub gerekmez."
        },
        {
            question: "Branch protection anti-pattern hangisi?",
            options: [
                "Main'e PR'sız doğrudan push",
                "PR'da CI zorunluluğu",
                "Code review",
                "Status check"
            ],
            correct: 0,
            explanation: "Main'e doğrudan push CI bypass ve production riski yaratır — PR + review standardıdır."
        },
        {
            question: "act aracı ne işe yarar?",
            options: [
                "GitHub Actions workflow'unu local test",
                "Docker imaj sıkıştırma",
                "K8s cluster kurma",
                "Git merge"
            ],
            correct: 0,
            explanation: "nektos/act, workflow dosyalarını push etmeden local Docker'da simüle eder."
        },
        {
            question: "Fail fast prensibi pipeline'da ne demek?",
            options: [
                "Hata erken adımda pipeline'ı durdurur",
                "Deploy her zaman önce",
                "Test en sonda",
                "Lint atlanır"
            ],
            correct: 0,
            explanation: "Ucuz test/lint adımları önce; deploy en sonda — erken hata maliyeti düşük."
        },
        {
            question: "Continuous Delivery kitabı kimin?",
            options: [
                "Humble & Farley",
                "Linus Torvalds",
                "Docker Inc.",
                "Microsoft"
            ],
            correct: 0,
            explanation: "Continuous Delivery (2010) modern CD pratiklerinin klasik referansıdır."
        },
        {
            question: "CI/CD serisinden sonra hangi bölüm grubu gelir?",
            options: [
                "Kubernetes (Bölüm 38–42)",
                "Bash Bölüm 0",
                "Git Bölüm 16 tekrar",
                "Cheatsheet only"
            ],
            correct: 0,
            explanation: "Docker → CI/CD → Kubernetes yol haritası: Bölüm 38'ten itibaren orkestrasyon başlar."
        }
    ]
});
