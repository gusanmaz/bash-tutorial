// ===== Bölüm 34: GitHub Actions — Adım Adım =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 34,
    title: 'GitHub Actions — Adım Adım',
    subtitle: 'Workflows, Jobs, Steps & Triggers',
    icon: '⚡',
    description: 'İlk workflow dosyanızdan secrets ve cache\'e kadar GitHub Actions\'ı sıfırdan kurun.',
    content: `
<h2>GitHub Actions Nedir?</h2>
<div class="info-box tip">
    <div class="info-box-title">💡 Bölüm 33'deki 📌 kutuları</div>
    Staging, runner, workflow gibi terimler Bölüm 33'de açıklandı. Bu bölümde GitHub Actions'a özel terimler (job, step, cron, matrix) yine 📌 kutularında anlatılır.
</div>
<p>GitHub Actions, GitHub repository'nizin (proje klasörünüzün bulut kopyası) içinde çalışan bir <strong>CI/CD motorudur</strong>. Ayrı sunucu kurmanıza gerek yok — workflow dosyasını repo'ya push edersiniz, GitHub sizin için geçici bir bilgisayarda (runner) adımları koşturur.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Workflow, job, step, action</div>
    <ul>
        <li><strong>Workflow</strong>: Tüm otomasyon tarifi — bir <code>.yml</code> dosyası.</li>
        <li><strong>Job</strong> (<em>görev</em>): Workflow içindeki büyük blok — "test et", "docker build" gibi.</li>
        <li><strong>Step</strong> (<em>adım</em>): Job içindeki tek satırlık iş — bir komut veya hazır action.</li>
        <li><strong>Action</strong>: Başkalarının yazdığı hazır parça — checkout, docker login gibi. Tekerleği yeniden icat etmezsiniz.</li>
    </ul>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Ücretsiz Kotanız</div>
    Public repo'larda GitHub Actions <strong>sınırsız</strong> (makul kullanım). Private repo'larda ayda ~2000 dakika ücretsiz (plan değişebilir). Öğrenme ve küçük projeler için fazlasıyla yeterli.
</div>

<h2>Adım 1: İlk Workflow — Merhaba CI</h2>
<p>Projenizde şu dosyayı oluşturun. Tam çalışan Flask + test + Docker pipeline için repodaki <code>examples/flask-ci/</code> klasörüne bakın — bölümdeki parçalar orada birleştirilmiş halde.</p>

<div class="code-block">
    <div class="code-block-header"><span>.github/workflows/hello.yml</span></div>
    <pre><code>name: Merhaba CI

on:
  push:
    branches: [main]
  workflow_dispatch:    <span class="comment"># GitHub arayüzünden manuel tetikleme</span>

jobs:
  selam:
    runs-on: ubuntu-latest
    steps:
      - name: Mesaj yaz
        run: echo "Merhaba GitHub Actions!"
      - name: Sistem bilgisi
        run: uname -a</code></pre>
</div>

<pre><code><span class="prompt">$</span> <span class="command">git add</span> <span class="argument">.github/workflows/hello.yml</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="argument">-m "İlk CI workflow"</span>
<span class="prompt">$</span> <span class="command">git push</span></code></pre>

<p>GitHub → repo → <strong>Actions</strong> sekmesinde workflow'u canlı izleyin. Yeşil tik = başarılı.</p>

<h2>Adım 2: Workflow Anatomisi</h2>
<div class="code-block">
    <div class="code-block-header"><span>YAML yapısı</span></div>
    <pre><code>name: ...           <span class="comment"># Actions sekmesinde görünen isim</span>
on: ...             <span class="comment"># Ne zaman çalışsın? (tetikleyiciler)</span>
env: ...            <span class="comment"># Tüm job'lar için ortam değişkeni (opsiyonel)</span>
jobs:
  job-adi:
    runs-on: ...    <span class="comment"># ubuntu-latest, windows-latest, macos-latest</span>
    steps:
      - ...         <span class="comment"># Sırayla çalışan adımlar</span></code></pre>
</div>

<h2>Adım 3: Kodu İndirmek — checkout</h2>
<p>Runner boş bir sanal makinedir — üzerinde projeniz yoktur. Kodu indirmek için <strong>checkout</strong> action'ı kullanın:</p>

<div class="code-block">
    <div class="code-block-header"><span>Standart başlangıç adımı</span></div>
    <pre><code>steps:
  - name: Kodu indir
    uses: actions/checkout@v4</code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 uses vs run</div>
    <ul>
        <li><code>uses: actions/checkout@v4</code> — Hazır action (Marketplace'ten).</li>
        <li><code>run: pytest</code> — Shell komutu çalıştır.</li>
    </ul>
</div>

<h2>Adım 4: Python Projesi Test Etmek</h2>
<div class="code-block">
    <div class="code-block-header"><span>.github/workflows/test.yml</span></div>
    <pre><code>name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Python 3.12 kur
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'          <span class="comment"># requirements.txt önbelleği</span>

      - name: Bağımlılıkları kur
        run: pip install -r requirements-dev.txt

      - name: Testleri koş
        run: pytest -v</code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 requirements-dev.txt</div>
    Üretim bağımlılıkları (<code>requirements.txt</code>) ile geliştirme/test araçlarını (<code>pytest</code>, <code>flake8</code>) ayırın. CI'da <code>pip install -r requirements-dev.txt</code> kullanın — gerçek projelerde standart pratik.
</div>

<h2>Adım 5: Tetikleyiciler (on)</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Cron nedir?</div>
    <code>schedule</code> ile kullanılan <strong>cron</strong>, "hangi saatte çalışsın?" zamanlayıcısıdır. <code>0 3 * * *</code> = her gün gece 03:00 (UTC). Gece otomatik test veya yedek kontrol için kullanılır.
</div>
<table>
    <tr><th>Tetikleyici</th><th>Ne zaman?</th></tr>
    <tr><td><code>push</code></td><td>Belirtilen branch'e push</td></tr>
    <tr><td><code>pull_request</code></td><td>PR açıldığında / güncellendiğinde</td></tr>
    <tr><td><code>schedule</code></td><td>Cron ile (gece yedek test)</td></tr>
    <tr><td><code>workflow_dispatch</code></td><td>Manuel buton</td></tr>
    <tr><td><code>release</code></td><td>GitHub Release oluşturulunca</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>Gece cron örneği</span></div>
    <pre><code>on:
  schedule:
    - cron: '0 3 * * *'   <span class="comment"># Her gün 03:00 UTC</span></code></pre>
</div>

<h2>Adım 6: Ortam Değişkenleri</h2>
<div class="code-block">
    <div class="code-block-header"><span>env kullanımı</span></div>
    <pre><code>env:
  PYTHON_VERSION: '3.12'

jobs:
  test:
    runs-on: ubuntu-latest
    env:
      APP_ENV: test
    steps:
      - run: echo "Ortam $APP_ENV, Python $PYTHON_VERSION"</code></pre>
</div>

<h2>Adım 7: Secrets — Gizli Bilgiler</h2>
<p>API anahtarı, Docker Hub şifresi, deploy SSH key — bunları YAML'a yazmayın!</p>

<ol>
    <li>GitHub repo → <strong>Settings → Secrets and variables → Actions</strong></li>
    <li><strong>New repository secret</strong> → örn. <code>DOCKERHUB_TOKEN</code></li>
    <li>Workflow'da kullanın:</li>
</ol>

<div class="code-block">
    <div class="code-block-header"><span>Secret referansı</span></div>
    <pre><code>steps:
  - name: Gizli token kullan (logda görünmez)
    run: echo "Token uzunluğu \${#TOKEN}"
    env:
      TOKEN: \${{ secrets.DOCKERHUB_TOKEN }}</code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Secrets Güvenliği</div>
    <ul>
        <li>Secret'ları asla <code>echo</code> ile loglamayın.</li>
        <li>Fork edilen PR'larda secret'lar varsayılan olarak <strong>verilmez</strong> (güvenlik).</li>
        <li>Mümkünse <strong>OIDC</strong> ile cloud'a kısa ömürlü token kullanın (ileri seviye — aşağıdaki kutuya bakın).</li>
    </ul>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 OIDC nedir?</div>
    <strong>OIDC</strong> (<em>OpenID Connect</em>): GitHub Actions'ın AWS/Azure gibi bulut servislerine <em>geçici, kısa ömürlü</em> erişim anahtarı alması. Uzun süreli şifre (secret) saklamak yerine "şu an bu pipeline için 15 dakikalık izin" verilir — daha güvenli.
</div>

<h2>Adım 8: Birden Fazla Job — Paralel ve Sıralı</h2>
<div class="code-block">
    <div class="code-block-header"><span>Paralel job'lar</span></div>
    <pre><code>jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements-dev.txt
      - run: flake8 .

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements-dev.txt
      - run: pytest</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Sıralı job (needs) — tam iskelet</span></div>
    <pre><code>jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements-dev.txt
      - run: pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - run: echo "Deploy ediliyor..."</code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Sık Hata: Eksik checkout</div>
    Runner boş bir VM'dir. <code>run: pytest</code> yazmadan önce mutlaka <code>actions/checkout</code> ve (Python için) <code>setup-python</code> adımlarını ekleyin. Aksi halde "No module named app" veya "pytest: command not found" alırsınız.
</div>

<h2>Adım 9: Matrix — Çoklu Ortam Testi</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Matrix (matris) stratejisi</div>
    Aynı testi <strong>birden fazla koşulda paralel</strong> çalıştırır — örneğin Python 3.10, 3.11 ve 3.12. "Farklı sürümlerde de çalışıyor mu?" sorusunu tek workflow'da yanıtlarsınız.
</div>
<div class="code-block">
    <div class="code-block-header"><span>Python 3.10, 3.11, 3.12 paralel</span></div>
    <pre><code>jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.10', '3.11', '3.12']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
      - run: pip install -r requirements.txt &amp;&amp; pytest</code></pre>
</div>

<p>3 Python sürümü aynı anda test edilir — Docker'daki farklı imajlar gibi!</p>

<h2>Adım 10: Artifact — Çıktı Saklama</h2>
<div class="code-block">
    <div class="code-block-header"><span>Test raporu yükle</span></div>
    <pre><code>      - run: pip install pytest pytest-html &amp;&amp; pytest --html=report.html
      - uses: actions/upload-artifact@v4
        with:
          name: test-raporu
          path: report.html
          retention-days: 7</code></pre>
</div>

<p>Actions sekmesinden artifact indirilebilir — debug için altın değerinde.</p>

<h2>Adım 11: Job Durum Rozetleri</h2>
<p>README'nize badge ekleyin:</p>
<pre><code>![CI](https://github.com/kullanici/repo/actions/workflows/test.yml/badge.svg)</code></pre>

<h2>Adım 12: Hata Ayıklama İpuçları</h2>
<table>
    <tr><th>Sorun</th><th>Çözüm</th></tr>
    <tr><td>Workflow hiç tetiklenmiyor</td><td><code>on:</code> branch adını kontrol edin (main vs master)</td></tr>
    <tr><td>YAML syntax hatası</td><td>GitHub Actions sekmesi hata satırını gösterir</td></tr>
    <tr><td>Permission denied</td><td><code>permissions:</code> bloğu veya GITHUB_TOKEN yetkisi</td></tr>
    <tr><td>Eski action sürümü</td><td><code>@v4</code> gibi güncel tag kullanın</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 act Aracı (Opsiyonel)</div>
    <a href="https://github.com/nektos/act" target="_blank" rel="noopener">act</a>, workflow'ları kendi makinenizde Docker içinde test etmenizi sağlar. Push etmeden denemek için kullanışlıdır.
</div>

<h2>Özet</h2>
<ul>
    <li>Workflow = <code>.github/workflows/*.yml</code></li>
    <li><code>on</code> = tetikleyici; <code>jobs</code> = iş birimleri; <code>steps</code> = adımlar</li>
    <li><code>actions/checkout</code> ve <code>setup-python</code> en sık kullanılan action'lar</li>
    <li><code>secrets</code> = gizli bilgi; <code>needs</code> = job sırası</li>
    <li><code>matrix</code> = paralel çoklu ortam testi</li>
</ul>
<p>Sonraki bölümde bu workflow'a <strong>Docker build ve push</strong> ekleyeceğiz.</p>
`,
    quiz: [
        {
            question: "GitHub Actions workflow dosyası hangi klasörde olmalı?",
            options: [
                ".github/workflows/",
                "docker/",
                "src/",
                "public/"
            ],
            correct: 0,
            explanation: "Workflow YAML dosyaları .github/workflows/ altında tutulur ve repo ile birlikte versiyonlanır."
        },
        {
            question: "uses: actions/checkout@v4 ne yapar?",
            options: [
                "Repository kodunu runner'a indirir",
                "Docker imajı build eder",
                "Secret oluşturur",
                "Branch siler"
            ],
            correct: 0,
            explanation: "checkout action, workflow'un erişebilmesi için repo kodunu runner'a klonlar."
        },
        {
            question: "needs: test deploy job'ında ne sağlar?",
            options: [
                "test job'u başarılı olmadan deploy çalışmaz",
                "test job'unu siler",
                "Paralel çalışmayı zorunlu kılar",
                "Secret ekler"
            ],
            correct: 0,
            explanation: "needs ile job bağımlılığı tanımlanır; upstream job fail olursa dependent job atlanır."
        },
        {
            question: "pull_request tetikleyicisi ne zaman çalışır?",
            options: [
                "PR açıldığında veya güncellendiğinde",
                "Sadece gece yarısı",
                "Docker build sonrası otomatik",
                "Repo silindiğinde"
            ],
            correct: 0,
            explanation: "on: pull_request, PR lifecycle olaylarında workflow'u tetikler — merge öncesi CI için temel."
        },
        {
            question: "secrets.DOCKERHUB_TOKEN nasıl kullanılır?",
            options: [
                "${{ secrets.DOCKERHUB_TOKEN }} ile referans",
                "Dockerfile'a hard-code",
                "README.md'de paylaş",
                "git commit mesajında"
            ],
            correct: 0,
            explanation: "Secret'lar ${{ secrets.ISIM }} sözdizimiyle env veya action input'larına verilir; logda maskelenir."
        },
        {
            question: "strategy.matrix ne işe yarar?",
            options: [
                "Aynı job'u farklı parametrelerle paralel koşturur",
                "Git branch oluşturur",
                "Runner sayısını sıfırlar",
                "Artifact siler"
            ],
            correct: 0,
            explanation: "Matrix, örneğin birden fazla Python/OS sürümünde aynı test job'unu paralel çalıştırır."
        },
        {
            question: "runs-on: ubuntu-latest ne belirtir?",
            options: [
                "Job'un GitHub hosted Ubuntu runner'da çalışacağını",
                "Sadece Docker Desktop'ta çalışacağını",
                "Windows zorunlu olduğunu",
                "Self-hosted zorunlu olduğunu"
            ],
            correct: 0,
            explanation: "runs-on runner ortamını seçer; ubuntu-latest en yaygın GitHub hosted Linux runner'dır."
        },
        {
            question: "workflow_dispatch tetikleyicisi ne sağlar?",
            options: [
                "GitHub arayüzünden manuel çalıştırma",
                "Otomatik her saniye çalışma",
                "PR merge zorunluluğu",
                "Docker push"
            ],
            correct: 0,
            explanation: "workflow_dispatch, Actions sekmesinde 'Run workflow' butonu ile manuel tetiklemeye izin verir."
        },
        {
            question: "upload-artifact action ne yapar?",
            options: [
                "Job çıktı dosyalarını saklar ve indirilebilir yapar",
                "Git push yapar",
                "Runner'ı siler",
                "Testleri atlar"
            ],
            correct: 0,
            explanation: "Artifact'lar build çıktısı, rapor veya log arşivi olarak Actions UI'dan indirilebilir."
        },
        {
            question: "cache: 'pip' setup-python'da ne sağlar?",
            options: [
                "pip bağımlılıklarını önbelleğe alarak hızlandırır",
                "Python sürümünü siler",
                "Secret oluşturur",
                "Docker layer cache"
            ],
            correct: 0,
            explanation: "pip cache, requirements.txt değişmediyse paket indirmeyi atlayarak CI süresini kısaltır."
        }
    ]
});
