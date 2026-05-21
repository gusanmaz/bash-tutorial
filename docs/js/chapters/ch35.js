// ===== Bölüm 35: Docker ile CI/CD Pipeline =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 35,
    title: 'Docker ile CI/CD Pipeline',
    subtitle: 'Build, Test & Push in GitHub Actions',
    icon: '🐳',
    description: 'GitHub Actions\'ta docker build, registry\'ye push, GHCR/Docker Hub, cache ve container içinde test.',
    content: `
<h2>Docker + CI = Mükemmel İkili</h2>
<p>Önceki bölümde test workflow'u kurduk. Şimdi Bölüm 30'te öğrendiğiniz <strong>Dockerfile</strong>'ı CI pipeline'a bağlayacağız.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Buildx, GHCR, smoke test</div>
    <ul>
        <li><strong>Buildx</strong>: Docker'ın gelişmiş build aracı — önbellek ve çoklu platform (amd64/arm64) desteği.</li>
        <li><strong>GHCR</strong> (GitHub Container Registry): GitHub'ın Docker imaj deposu — kod repo'nuzla aynı yerde.</li>
        <li><strong>Smoke test</strong> (<em>duman testi</em>): "En azından ayağa kalkıyor mu?" kontrolü — detaylı test değil, konteyner açılıp HTTP yanıt veriyor mu bakılır.</li>
        <li><strong>PR (Pull Request)</strong>: Birleştirme talebi — PR'da genelde imaj push edilmez, sadece build doğrulanır.</li>
    </ul>
</div>

<h2>Adım 1: Basit Docker Build Workflow</h2>
<div class="code-block">
    <div class="code-block-header"><span>.github/workflows/docker-build.yml</span></div>
    <pre><code>name: Docker Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Docker Buildx kur
        uses: docker/setup-buildx-action@v3

      - name: İmaj build et
        uses: docker/build-push-action@v6
        with:
          context: .
          push: false
          tags: myapp:\${{ github.sha }}
          load: true</code></pre>
</div>

<p>PR'da sadece build (push yok); main'de push ekleyeceğiz.</p>

<h2>Adım 2: Docker Hub'a Push</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Access Token nedir?</div>
    Docker Hub'a giriş için hesap şifreniz yerine oluşturulan <strong>özel anahtar</strong>. CI pipeline'da kullanılır — gerçek şifrenizi GitHub'a yazmazsınız; token'ı iptal edebilirsiniz.
</div>
<ol>
    <li><a href="https://hub.docker.com" target="_blank" rel="noopener">Docker Hub</a>'da hesap + Access Token oluşturun.</li>
    <li>GitHub repo Secrets: <code>DOCKERHUB_USERNAME</code>, <code>DOCKERHUB_TOKEN</code></li>
</ol>

<div class="code-block">
    <div class="code-block-header"><span>Login + push</span></div>
    <pre><code>      - name: Docker Hub'a giriş
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build ve push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: \${{ github.event_name != 'pull_request' }}
          tags: |
            \${{ secrets.DOCKERHUB_USERNAME }}/myapp:latest
            \${{ secrets.DOCKERHUB_USERNAME }}/myapp:\${{ github.sha }}</code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 PR'da Push Etmeme</div>
    <code>push: \${{ github.event_name != 'pull_request' }}</code> — PR'da sadece build doğrulanır; main merge'de registry'ye gider. Gereksiz imaj birikimini önler.
</div>

<h2>Adım 3: GitHub Container Registry (GHCR)</h2>
<p>Docker Hub alternatifi — repo ile aynı yerde:</p>

<div class="code-block">
    <div class="code-block-header"><span>GHCR push</span></div>
    <pre><code>      - name: GHCR giriş
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build ve push
        uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/\${{ github.repository }}:latest</code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ GHCR tag'leri küçük harf</div>
    <code>github.repository</code> büyük harf içerebilir; GHCR reddedebilir. Üretimde: <code>ghcr.io/\${{ github.repository_owner }}/myapp:latest</code> ve repo adını küçük harfle sabitlemek daha güvenli. <code>examples/flask-ci</code> workflow'unda tam pattern kullanıldı.
</div>

<p><code>GITHUB_TOKEN</code> otomatik verilir; package write izni için workflow'a permission ekleyin:</p>
<pre><code>permissions:
  contents: read
  packages: write</code></pre>

<h2>Adım 4: Build Cache — Hızlandırma</h2>
<div class="code-block">
    <div class="code-block-header"><span>GitHub Actions cache ile layer cache</span></div>
    <pre><code>      - name: Build ve push (cache ile)
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: myapp:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max</code></pre>
</div>

<p>İkinci build'den itibaren Dockerfile katmanları önbellekten gelir — 5 dakika → 30 saniye olabilir.</p>

<h2>Adım 5: Container İçinde Test</h2>
<p>Build sonrası imajı çalıştırıp smoke test:</p>

<div class="code-block">
    <div class="code-block-header"><span>Smoke test adımı</span></div>
    <pre><code>      - name: Smoke test
        run: |
          docker run -d --name test-app -p 8080:5000 "flask-ci:\${{ github.sha }}"
          for i in \$(seq 1 10); do
            curl -fsS http://localhost:8080/health &amp;&amp; break
            sleep 2
          done
          curl -fsS http://localhost:8080/ | grep -q Merhaba
          docker stop test-app</code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Smoke test aynı job'da olmalı</div>
    <code>load: true</code> ile build edilen imaj sadece o job'un runner'ında vardır. Smoke test'i ayrı job'a koyarsanız imajı registry'den pull etmeniz veya artifact olarak taşımanız gerekir.
</div>

<h2>Adım 6: Docker Compose ile Entegrasyon Testi</h2>
<div class="code-block">
    <div class="code-block-header"><span>Compose CI job</span></div>
    <pre><code>  integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Compose ile ayağa kaldır
        run: docker compose up -d --wait
      - name: API test
        run: curl -f http://localhost:5000/health
      - name: Temizlik
        if: always()
        run: docker compose down -v</code></pre>
</div>

<p>Bölüm 31'daki Compose bilginiz burada parlıyor — web + DB birlikte CI'da test edilir.</p>

<h2>Adım 7: Multi-Platform Build (Opsiyonel)</h2>
<div class="code-block">
    <div class="code-block-header"><span>amd64 + arm64</span></div>
    <pre><code>      - uses: docker/setup-qemu-action@v3
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v6
        with:
          platforms: linux/amd64,linux/arm64
          push: true
          tags: myapp:latest</code></pre>
</div>

<p>Apple Silicon (arm64) ve Intel (amd64) sunucularda aynı imaj — Raspberry Pi deploy için bile.</p>

<h2>Adım 8: .dockerignore CI'da Kritik</h2>
<div class="info-box warning">
    <div class="info-box-title">⚠️ CI Yavaşlığının Sık Nedeni</div>
    <code>.dockerignore</code> olmadan <code>node_modules</code>, <code>.git</code>, <code>venv</code> build context'e girer — build dakikalar sürer. Bölüm 30'teki .dockerignore alışkanlığınız CI'da para (dakika) kazandırır.
</div>

<h2>Adım 9: Tam Pipeline Örneği</h2>
<div class="code-block">
    <div class="code-block-header"><span>.github/workflows/ci-docker.yml</span></div>
    <pre><code>name: CI Docker

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: pip
          cache-dependency-path: requirements-dev.txt
      - run: pip install -r requirements-dev.txt &amp;&amp; pytest

  docker:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        if: github.ref == 'refs/heads/main'
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: \${{ github.ref == 'refs/heads/main' }}
          tags: \${{ secrets.DOCKERHUB_USERNAME }}/myapp:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max</code></pre>
</div>

<h2>Adım 10: İmaj Etiketleme Stratejisi</h2>
<table>
    <tr><th>Tag</th><th>Ne zaman?</th></tr>
    <tr><td><code>latest</code></td><td>main branch'in son hali</td></tr>
    <tr><td><code>sha-abc123</code></td><td>Her commit — rollback için</td></tr>
    <tr><td><code>v1.2.3</code></td><td>Git tag / release</td></tr>
    <tr><td><code>pr-42</code></td><td>PR preview ortamları (ileri)</td></tr>
</table>

<h2>Özet</h2>
<ul>
    <li><code>docker/build-push-action</code> = CI'da build + push standardı.</li>
    <li>Secret ile registry login; PR'da push'u kapatın.</li>
    <li>GHCR veya Docker Hub — ikisi de YAML ile.</li>
    <li>Cache + .dockerignore = hızlı pipeline.</li>
    <li>Compose ile entegrasyon testi mümkün.</li>
</ul>
<p>Sonraki bölümde bu imajı sunucuya <strong>deploy</strong> eden tam pipeline'ı kuracağız.</p>
`,
    quiz: [
        {
            question: "CI'da PR'da docker push neden genelde kapatılır?",
            options: [
                "Gereksiz imaj birikimini ve güvenlik riskini önlemek",
                "Docker Hub PR desteklemez",
                "PR'da build imkansızdır",
                "GitHub Actions PR'da çalışmaz"
            ],
            correct: 0,
            explanation: "PR'da build doğrulaması yeterli; push her PR'da registry'yi doldurur. Main merge'de push yapılır."
        },
        {
            question: "docker/login-action ne yapar?",
            options: [
                "Registry'ye kimlik doğrulama yapar",
                "Dockerfile yazar",
                "Kubernetes kurar",
                "Test çalıştırır"
            ],
            correct: 0,
            explanation: "login-action, Docker Hub/GHCR/ECR gibi registry'lere push öncesi auth sağlar."
        },
        {
            question: "GHCR için hangi registry adresi kullanılır?",
            options: [
                "ghcr.io",
                "docker.io/ghcr",
                "hub.github.com",
                "registry.k8s.io"
            ],
            correct: 0,
            explanation: "GitHub Container Registry ghcr.io adresinde; GITHUB_TOKEN veya PAT ile auth yapılır."
        },
        {
            question: "cache-from: type=gha ne sağlar?",
            options: [
                "Docker build layer'larını GitHub Actions cache'inde saklar",
                "Git branch cache'ler",
                "Secret'ları cache'ler",
                "Test sonuçlarını siler"
            ],
            correct: 0,
            explanation: "GHA cache, BuildKit layer cache'ini workflow'lar arası paylaşarak build süresini kısaltır."
        },
        {
            question: "Smoke test CI'da ne demektir?",
            options: [
                "Build sonrası imajın temel çalıştığını hızlı doğrulama",
                "Tüm unit testleri silme",
                "Production'a otomatik deploy",
                "Docker Hub hesabı silme"
            ],
            correct: 0,
            explanation: "Smoke test, konteyner ayağa kalkıyor mu, HTTP 200 dönüyor mu gibi minimal canlılık kontrolüdür."
        },
        {
            question: "docker compose up -d --wait CI'da neden kullanılır?",
            options: [
                "Çok servisli uygulamayı entegrasyon testi için ayağa kaldırmak",
                "Docker'ı kaldırmak",
                "Sadece tek konteyner",
                "Git push yapmak"
            ],
            correct: 0,
            explanation: "--wait servisler healthy olana kadar bekler; web+DB birlikte test edilebilir."
        },
        {
            question: "İmaj tag olarak github.sha kullanmak neden iyi?",
            options: [
                "Her commit'e benzersiz imaj — rollback kolay",
                "SHA imaj boyutunu küçültür",
                "Zorunlu Docker Hub kuralı",
                "PR merge engeller"
            ],
            correct: 0,
            explanation: "Commit SHA tag'i hangi kodun hangi imajda olduğunu kesin eşler; geri dönüş için idealdir."
        },
        {
            question: "permissions: packages: write ne için gerekli?",
            options: [
                "GHCR'a imaj push etmek",
                "Public repo oluşturmak",
                "Issue açmak",
                "Fork yapmak"
            ],
            correct: 0,
            explanation: "GITHUB_TOKEN varsayılan yetkileri sınırlı olabilir; GHCR push için packages: write gerekir."
        },
        {
            question: "Multi-platform build ne sağlar?",
            options: [
                "amd64 ve arm64 gibi mimariler için imaj",
                "Çoklu Git branch",
                "Paralel pytest",
                "Çoklu Dockerfile"
            ],
            correct: 0,
            explanation: "buildx ile tek pipeline'dan farklı CPU mimarilerine uygun imaj üretilir."
        },
        {
            question: "CI'da .dockerignore eksikliği neye yol açar?",
            options: [
                "Yavaş build ve gereksiz büyük context",
                "Test hatası",
                "Secret sızıntısı otomatik",
                "Push engeli"
            ],
            correct: 0,
            explanation: ".git ve node_modules gibi dosyalar context'e girerse build yavaşlar ve cache verimsiz olur."
        }
    ]
});
