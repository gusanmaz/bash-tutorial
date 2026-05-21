// ===== Bölüm 36: Gerçek CI/CD Pipeline Örnekleri =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 36,
    title: 'Gerçek CI/CD Pipeline Örnekleri',
    subtitle: 'End-to-End Deploy Workflows',
    icon: '🚀',
    description: 'Lint → test → build → deploy akışı, VPS SSH deploy, staging/prod ayrımı ve branch protection.',
    content: `
<h2>Sıfırdan Uca Pipeline</h2>
<p>Artık parçaları birleştirme zamanı: kod push → test → Docker imaj → sunucuya deploy.</p>

<div class="info-box note">
    <div class="info-box-title">📌 VPS, Environment, SSH deploy</div>
    <ul>
        <li><strong>VPS</strong> (<em>Virtual Private Server</em>): Kiraladığınız küçük bir bulut sunucusu — Hetzner, DigitalOcean gibi. Kendi Linux makineniz gibi; Docker kurup uygulama çalıştırırsınız.</li>
        <li><strong>GitHub Environment</strong>: "production" gibi etiketli deploy aşaması — isteğe bağlı <em>onay bekletme</em> (patron "tamam" demeden canlıya gitmesin).</li>
        <li><strong>SSH deploy</strong>: CI, uzak sunucuya bağlanıp <code>docker pull</code> + <code>docker run</code> komutlarını sizin yerinize çalıştırır.</li>
        <li><strong>flake8</strong>: Python kod stili denetleyicisi — PEP8 kurallarına uyuyor mu bakar.</li>
        <li><strong>Semver tag (v1.0.0)</strong>: Sürüm numarası — geri dönüş ve release takibi için imaja <code>v1.2.3</code> gibi etiket.</li>
    </ul>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Mini Proje Yapısı — Çalışan kopya</div>
    Aşağıdaki yapının tamamı repoda hazır: <code>examples/flask-ci/</code> — <code>app.py</code>, testler, Dockerfile, K8s manifestleri (<code>k8s/</code>) ve üç workflow (<code>ci.yml</code>, <code>deploy-dockerhub.yml</code>, <code>deploy-k8s.yml</code>). Kopyalayıp kendi repo'nuza alabilirsiniz.
<pre><code>flask-ci/
├── .github/workflows/ci.yml
├── .github/workflows/deploy-dockerhub.yml
├── .github/workflows/deploy-k8s.yml
├── k8s/deployment.yaml
├── k8s/service.yaml
├── app.py
├── requirements.txt
├── requirements-dev.txt
├── Dockerfile
├── tests/conftest.py
├── tests/test_app.py
└── .dockerignore</code></pre>
</div>

<h2>1. Flask Uygulaması — Tam Pipeline</h2>
<div class="code-block">
    <div class="code-block-header"><span>.github/workflows/deploy-dockerhub.yml (özet)</span></div>
    <pre><code>name: Deploy Docker Hub

on:
  push:
    branches: [main]

env:
  IMAGE_NAME: flask-ci

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: pip
          cache-dependency-path: requirements-dev.txt
      - run: pip install -r requirements-dev.txt
      - run: flake8 .
      - run: pytest -v

  build-push:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            \${{ secrets.DOCKERHUB_USERNAME }}/\${{ env.IMAGE_NAME }}:latest
            \${{ secrets.DOCKERHUB_USERNAME }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}

  deploy:
    needs: build-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: appleboy/ssh-action@v1.2.0
        env:
          IMAGE: \${{ secrets.DOCKERHUB_USERNAME }}/\${{ env.IMAGE_NAME }}:latest
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_SSH_KEY }}
          envs: IMAGE
          script: |
            docker pull "\$IMAGE"
            docker stop flask-ci 2&gt;/dev/null || true
            docker rm flask-ci 2&gt;/dev/null || true
            docker run -d --name flask-ci -p 80:5000 --restart unless-stopped "\$IMAGE"
            curl -fsS http://localhost/health</code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 SSH script'te secret kullanımı</div>
    <code>appleboy/ssh-action</code> uzak sunucuda çalışır; GitHub secret'ları doğrudan script içinde genişlemez. <strong>env + envs</strong> ile runner'da <code>IMAGE</code> değişkenini oluşturup sunucuya aktarın; uzak script'te <code>\$IMAGE</code> (shell değişkeni) kullanın.
</div>

<h2>2. Job Ayrımı Mantığı</h2>
<table>
    <tr><th>Job</th><th>PR'da?</th><th>main push'ta?</th></tr>
    <tr><td>quality (lint+test)</td><td>✅</td><td>✅</td></tr>
    <tr><td>build-push</td><td>❌</td><td>✅</td></tr>
    <tr><td>deploy</td><td>❌</td><td>✅</td></tr>
</table>

<h2>3. GitHub Environments — Onaylı Deploy</h2>
<p>Repo → Settings → Environments → <code>production</code> oluşturun. "Required reviewers" ekleyin — deploy job'u onay bekler.</p>

<div class="code-block">
    <div class="code-block-header"><span>Environment kullanımı</span></div>
    <pre><code>  deploy:
    environment: production   <span class="comment"># Onay + environment secret'ları</span>
    needs: build-push
    ...</code></pre>
</div>

<h2>4. Branch Protection</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Branch protection nedir?</div>
    Ana kod dalını (<code>main</code>) korumak için GitHub ayarı:
    <ul>
        <li><strong>Status check</strong>: CI testleri yeşil olmadan birleştirme yapılamaz.</li>
        <li><strong>PR review</strong>: En az bir ekip arkadaşı kodu incelemeli.</li>
        <li><strong>Bypass yasağı</strong>: Kimse bu kuralları atlayamaz — "aceleyle bozuk kod main'e girmesin".</li>
    </ul>
</div>
<p>Settings → Branches → main için rule:</p>
<ul>
    <li>✅ Require status checks (quality job)</li>
    <li>✅ Require pull request reviews</li>
    <li>✅ Do not allow bypassing</li>
</ul>
<p>Artık main'e doğrudan push yerine PR + yeşil CI zorunlu.</p>

<h2>5. Staging + Production Ayrımı</h2>
<div class="code-block">
    <div class="code-block-header"><span>Branch bazlı deploy</span></div>
    <pre><code>on:
  push:
    branches: [main, staging]

jobs:
  deploy:
    environment: \${{ github.ref == 'refs/heads/main' &amp;&amp; 'production' || 'staging' }}
    steps:
      - run: echo "Deploy to \${{ github.ref_name }}"</code></pre>
</div>

<h2>6. Node.js Pipeline Örneği</h2>
<div class="code-block">
    <div class="code-block-header"><span>Node CI kısa örnek</span></div>
    <pre><code>      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run build</code></pre>
</div>

<h2>7. Release ile Versiyonlu Deploy</h2>
<div class="code-block">
    <div class="code-block-header"><span>Git tag → imaj v1.0.0 (tam workflow)</span></div>
    <pre><code>on:
  push:
    tags: ['v*']

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: \${{ secrets.DOCKERHUB_USERNAME }}/myapp:\${{ github.ref_name }}</code></pre>
</div>

<h2>8. Başarısız Pipeline — Ne Yapmalı?</h2>
<ol>
    <li>Actions sekmesinde kırmızı job'a tıklayın.</li>
    <li>Hata veren step'in logunu okuyun.</li>
    <li>Düzelt → commit → push — pipeline yeniden koşar.</li>
    <li><code>workflow_dispatch</code> ile manuel re-run deneyin.</li>
</ol>

<h2>9. Bildirim (Opsiyonel)</h2>
<pre><code>      - uses: slackapi/slack-github-action@v1
        if: failure()
        with:
          payload: |
            {"text": "Deploy failed: \${{ github.repository }}"}
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK }}</code></pre>

<h2>10. Kubernetes'e Deploy — CI/CD + K8s Entegrasyonu</h2>
<div class="info-box note">
    <div class="info-box-title">📌 CI → Registry → Kubernetes akışı</div>
    VPS'te <code>docker run</code> yerine imajı <strong>Kubernetes kümesine</strong> gönderirsiniz. Pipeline: test → build → push imaj → kümede imajı güncelle → rollout izle.
</div>

<p>Repoda hazır örnek: <code>examples/flask-ci/k8s/</code> manifestleri ve <code>.github/workflows/deploy-k8s.yml</code> workflow'u.</p>

<h3>Adım 1: Kubernetes manifestleri</h3>
<div class="code-block">
    <div class="code-block-header"><span>k8s/deployment.yaml (özet)</span></div>
    <pre><code>apiVersion: apps/v1
kind: Deployment
metadata:
  name: flask-ci
spec:
  replicas: 2
  selector:
    matchLabels:
      app: flask-ci
  template:
    metadata:
      labels:
        app: flask-ci
    spec:
      containers:
        - name: flask
          image: KULLANICI/flask-ci:latest   <span class="comment"># CI günceller</span>
          ports:
            - containerPort: 5000
          readinessProbe:
            httpGet:
              path: /health
              port: 5000</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>İlk kurulum (bir kez — Minikube veya bulut K8s)</span></div>
    <pre><code><span class="comment"># Minikube'ta imajı yükle (yerel build ise):</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">build -t flask-ci:local .</span>
<span class="prompt">$</span> <span class="command">minikube</span> <span class="argument">image load flask-ci:local</span>
<span class="comment"># deployment.yaml içinde image: flask-ci:local yapın</span>

<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">apply -f k8s/</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get pods</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">port-forward svc/flask-ci 8080:80</span>
<span class="comment"># http://localhost:8080</span></code></pre>
</div>

<h3>Adım 2: GitHub Actions — deploy-k8s.yml</h3>
<p>GitHub Secrets: <code>KUBE_CONFIG</code> (kubeconfig dosyası base64), <code>DOCKERHUB_USERNAME</code>, <code>DOCKERHUB_TOKEN</code></p>

<div class="code-block">
    <div class="code-block-header"><span>.github/workflows/deploy-k8s.yml (özet)</span></div>
    <pre><code>name: Deploy Kubernetes

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  IMAGE_NAME: flask-ci
  DEPLOYMENT: flask-ci

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: pip
          cache-dependency-path: requirements-dev.txt
      - run: pip install -r requirements-dev.txt
      - run: flake8 . && pytest -v

  build-push:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            \${{ secrets.DOCKERHUB_USERNAME }}/\${{ env.IMAGE_NAME }}:latest
            \${{ secrets.DOCKERHUB_USERNAME }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}

  deploy-k8s:
    needs: build-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: azure/setup-kubectl@v4
      - uses: azure/k8s-set-context@v4
        with:
          kubeconfig: \${{ secrets.KUBE_CONFIG }}
      - name: Manifestleri uygula (ilk kurulum / güncelleme)
        run: kubectl apply -f k8s/
      - name: Yeni imajı devreye al
        run: |
          kubectl set image deployment/\${{ env.DEPLOYMENT }} \\
            flask=\${{ secrets.DOCKERHUB_USERNAME }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}
          kubectl rollout status deployment/\${{ env.DEPLOYMENT }} --timeout=120s</code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 GitOps alternatifi</div>
    Manifestleri Git'te tutup <strong>Argo CD / Flux</strong> ile senkronize etmek (Bölüm 42) — CI sadece imaj push eder, K8s YAML Git'ten güncellenir. İki yaklaşım da geçerli; üniversite derslerinde genelde <code>kubectl apply</code> + pipeline görülür.
</div>

<h3>Adım 3: Rollback</h3>
<pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">rollout undo deployment/flask-ci</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">rollout history deployment/flask-ci</span></code></pre>

<h2>11. Güvenlik Kontrol Listesi</h2>
<ul>
    <li>Secret'lar GitHub Secrets'ta — YAML'da değil.</li>
    <li>PR from fork'ta secret sızdırmayın.</li>
    <li>Deploy key / SSH key sadece gerekli sunucuya.</li>
    <li>Imagen'leri mümkünse SHA tag ile pinleyin.</li>
    <li><code>if:</code> ile production deploy sadece main'de.</li>
</ul>

<h2>Mini Proje Görevi</h2>
<ol>
    <li>Basit Flask/Node app + Dockerfile yazın.</li>
    <li>2-3 unit test ekleyin.</li>
    <li>PR workflow: lint + test.</li>
    <li>main workflow: build + push Docker Hub.</li>
    <li>(Opsiyonel) Hetzner/DigitalOcean VPS'e SSH deploy.</li>
    <li>(Bölüm 38–42 sonrası) <code>deploy-k8s.yml</code> ile Kubernetes deploy.</li>
</ol>

<h2>Özet</h2>
<ul>
    <li>Job'ları ayırın: quality → build → deploy.</li>
    <li>PR'da test; main'de push + deploy.</li>
    <li>Environments ile onaylı production.</li>
    <li>Branch protection = disiplin.</li>
</ul>
`,
    quiz: [
        {
            question: "needs: quality build-push job'unda ne sağlar?",
            options: [
                "Test/lint geçmeden build başlamaz",
                "Paralel deploy zorunlu",
                "Secret siler",
                "PR oluşturur"
            ],
            correct: 0,
            explanation: "needs ile job zinciri kurulur; quality fail olursa build-push ve deploy atlanır."
        },
        {
            question: "GitHub Environment 'production' ne ekler?",
            options: [
                "Onay bekleyen deploy ve environment-specific secret",
                "Otomatik test silme",
                "Public repo zorunluluğu",
                "Docker Hub hesabı"
            ],
            correct: 0,
            explanation: "Environment'lar approval gate ve ayrı secret setleri ile kontrollü deploy sağlar."
        },
        {
            question: "Branch protection'da status check zorunluluğu ne yapar?",
            options: [
                "CI yeşil olmadan merge engellenir",
                "Push hızlanır",
                "Secret oluşturur",
                "Fork'u siler"
            ],
            correct: 0,
            explanation: "Required status checks, belirtilen job'lar başarılı olmadan PR merge edilemez."
        },
        {
            question: "VPS deploy için hangi secret tipik gerekir?",
            options: [
                "SSH private key ve host bilgisi",
                "Dockerfile içeriği",
                "README metni",
                "GitHub star sayısı"
            ],
            correct: 0,
            explanation: "SSH action host, username ve private key ile sunucuya bağlanıp docker pull/run komutları çalıştırır."
        },
        {
            question: "staging branch deploy pattern'i ne sağlar?",
            options: [
                "Production'a gitmeden önce staging'de deneme",
                "Testleri kapatma",
                "Docker'sız deploy",
                "Git'siz workflow"
            ],
            correct: 0,
            explanation: "staging branch ayrı environment'a deploy edilir; main production'a gider — risk azalır."
        },
        {
            question: "if: github.ref == 'refs/heads/main' ne filtreler?",
            options: [
                "Sadece main branch push'unda job çalışır",
                "Sadece PR'da çalışır",
                "Sadece tag'de",
                "Hiç çalışmaz"
            ],
            correct: 0,
            explanation: "if koşulu job veya step seviyesinde çalışma koşulu belirler; main-only deploy için kullanılır."
        },
        {
            question: "Release tag v1.0.0 push'unda imaj tag'i genelde?",
            options: [
                "v1.0.0 veya github.ref_name",
                "latest only",
                "pr-42",
                "main"
            ],
            correct: 0,
            explanation: "Git tag tetikleyicisi semver imaj tag'leri üretir; sürüm takibi ve rollback kolaylaşır."
        },
        {
            question: "Pipeline fail olunca ilk bakılacak yer?",
            options: [
                "Actions sekmesinde failed step logu",
                "Docker Hub ana sayfa",
                "package.json",
                "/etc/hosts"
            ],
            correct: 0,
            explanation: "GitHub Actions UI'da hangi step'in neden fail olduğu logda satır satır görünür."
        },
        {
            question: "kubectl set image CI'da ne yapar?",
            options: [
                "K8s deployment'ın imajını günceller",
                "Pod siler",
                "Minikube kurar",
                "Git push yapar"
            ],
            correct: 0,
            explanation: "CI build ettiği imaj tag'i ile deployment image referansını günceller; rollout yeni sürümü devreye alır."
        },
        {
            question: "PR'da build-push job'unu kapatmak neden iyi pratik?",
            options: [
                "Registry kirliliği ve maliyet önlenir",
                "Test çalışmaz",
                "Deploy zorunlu olur",
                "Secret'lar silinir"
            ],
            correct: 0,
            explanation: "PR'da kalite kontrolü yeterli; imaj push main merge sonrası yapılır."
        }
    ]
});
