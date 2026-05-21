// ===== Bölüm 40: YAML Manifestleri — Deployment ve Pod =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 40,
    title: 'YAML Manifestleri: Deployment ve Pod',
    subtitle: 'Writing Kubernetes YAML Manifests',
    icon: '📄',
    description: 'apiVersion, kind, metadata, spec yapısı; Pod ve Deployment manifestleri, label/selector, rolling update ve health probe\'lar.',
    content: `
<h2>Neden YAML Dosyası Yazıyoruz?</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Manifest, apiVersion, spec</div>
    <ul>
        <li><strong>Manifest</strong> (<em>bildirim dosyası</em>): Kubernetes'e "ne istediğinizi" anlatan YAML dosyası.</li>
        <li><strong>apiVersion / kind</strong>: Dosyanın türü — Pod mu, Deployment mı?</li>
        <li><strong>metadata</strong>: İsim, etiketler — tanımlayıcı bilgiler.</li>
        <li><strong>spec</strong> (<em>spesifikasyon</em>): İstenen durum — kaç kopya, hangi imaj, hangi port.</li>
    </ul>
</div>
<p>Önceki bölümde <code>kubectl create deployment web --image=nginx</code> ile hızlıca oluşturduk. Bu öğrenmek için harika; ama ekip çalışmasında sorun çıkar:</p>
<ul>
    <li>Yapılandırma Git'te yok — "kim ne deploy etti?" bilinmez.</li>
    <li>Ortam değişkenleri, kaynak limitleri, probe'lar eklenemez.</li>
    <li>Staging ile production farklı mı? Karşılaştıramazsınız.</li>
</ul>

<p>Çözüm: Kubernetes kaynaklarını <strong>YAML manifest</strong> dosyalarında tanımlayıp <code>kubectl apply -f</code> ile uygulamak. Docker Compose'daki <code>docker-compose.yml</code> gibi düşünün — ama daha fazla kavram ve güç.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Declarative = "Ne İstiyorum" Dersiniz</div>
    "3 replica NGINX, imaj nginx:1.25, port 80" yazarsınız. Kubernetes mevcut durumu buna uydurmaya çalışır. Dosyayı değiştirip tekrar <code>apply</code> edersiniz — sistem güncellenir.
</div>

<h2>Her Manifest'in 4 Ana Bölümü</h2>
<div class="code-block">
    <div class="code-block-header"><span>YAML iskeleti</span></div>
    <pre><code><span class="comment"># 1) Hangi API ve kaynak türü?</span>
apiVersion: apps/v1
kind: Deployment

<span class="comment"># 2) Kimlik bilgisi (isim, namespace, etiketler)</span>
metadata:
  name: web
  labels:
    app: web

<span class="comment"># 3) İstenen durum (ne çalışsın, nasıl?)</span>
spec:
  replicas: 2
  ...

<span class="comment"># 4) (status — Kubernetes doldurur, siz yazmazsınız)</span></code></pre>
</div>

<div class="eng-box">
    <div class="eng-title">🔤 Manifest Terimleri</div>
    <div class="eng-content">
        <span class="eng-word">apiVersion</span> = <span class="eng-meaning">API sürümü</span> — Kaynak türünün hangi API grubunda olduğu.<br>
        <span class="eng-word">kind</span> = <span class="eng-meaning">Tür</span> — Pod, Deployment, Service, ConfigMap...<br>
        <span class="eng-word">metadata</span> = <span class="eng-meaning">Üst veri</span> — İsim, namespace, label'lar.<br>
        <span class="eng-word">spec</span> = <span class="eng-meaning">Spesifikasyon</span> — İstenen yapılandırma.<br>
        <span class="eng-word">labels</span> = <span class="eng-meaning">Etiketler</span> — key:value çiftleri; kaynakları gruplamak için.<br>
        <span class="eng-word">selector</span> = <span class="eng-meaning">Seçici</span> — Hangi pod'ların bu deployment'a ait olduğu.
    </div>
</div>

<h2>İlk Pod Manifesti (Eğitim Amaçlı)</h2>
<p>Üretimde pod'u doğrudan oluşturmak nadir; ama yapıyı anlamak için:</p>

<div class="code-block">
    <div class="code-block-header"><span>pod.yaml</span></div>
    <pre><code>apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.25-alpine
      ports:
        - containerPort: 80</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Uygula ve kontrol et</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">apply -f pod.yaml</span>
<span class="output">pod/nginx-pod created</span>

<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get pod nginx-pod</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">delete -f pod.yaml</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Pod Silinince Geri Gelmez</div>
    Deployment olmadan pod silerseniz Kubernetes yeniden oluşturmaz. Bu yüzden gerçek uygulamalarda <strong>Deployment</strong> kullanılır.
</div>

<h2>Deployment Manifesti — Gerçek Dünya</h2>
<div class="code-block">
    <div class="code-block-header"><span>deployment.yaml</span></div>
    <pre><code>apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  labels:
    app: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: nginx
          image: nginx:1.25-alpine
          ports:
            - containerPort: 80
          resources:
            requests:
              memory: "64Mi"
              cpu: "100m"
            limits:
              memory: "128Mi"
              cpu: "200m"</code></pre>
</div>

<p>Parça parça açıklama:</p>
<ul>
    <li><code>replicas: 3</code> — Üç pod çalışsın.</li>
    <li><code>selector.matchLabels</code> — Bu deployment hangi pod'ları yönetiyor?</li>
    <li><code>template</code> — Her yeni pod'un şablonu (pod spec'i burada).</li>
    <li><code>resources</code> — CPU/bellek isteği ve üst sınır (scheduler ve stabilite için).</li>
</ul>

<div class="code-block">
    <div class="code-block-header"><span>Apply ve güncelleme</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">apply -f deployment.yaml</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get deployment web</span>

<span class="comment"># replicas: 5 yapıp tekrar apply:</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">apply -f deployment.yaml</span>
<span class="output">deployment.apps/web configured</span></code></pre>
</div>

<h2>Label ve Selector — Etiket Mantığı</h2>
<p>Label'lar post-it gibidir: pod'a <code>app: web</code>, <code>env: prod</code> yapıştırırsınız. Service ve Deployment bu etiketlerle pod'ları bulur.</p>

<div class="code-block">
    <div class="code-block-header"><span>Label ile filtreleme</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get pods -l app=web</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get pods -l 'env in (dev,staging)'</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 selector ile template.labels Eşleşmeli</div>
    Deployment'da <code>spec.selector.matchLabels</code> ile <code>spec.template.metadata.labels</code> aynı olmalıdır. Yoksa deployment pod oluşturamaz — klasik YAML hatası.
</div>

<h2>Health Probe'lar — Sağlık Kontrolü</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Probe (sağlık kontrolü) türleri</div>
    Kubernetes pod'un gerçekten sağlıklı olup olmadığını periyodik kontrol eder — Dockerfile'daki <code>HEALTHCHECK</code> gibi:
    <ul>
        <li><strong>livenessProbe</strong>: Uygulama dondu mu? Donduysa konteyneri yeniden başlat.</li>
        <li><strong>readinessProbe</strong>: Trafik almaya hazır mı? Hazır değilse Service o pod'a istek göndermez.</li>
        <li><strong>startupProbe</strong>: Yavaş açılan uygulamalarda — "henüz açılıyor, acele etme" süresi.</li>
    </ul>
</div>

<table>
    <tr><th>Probe</th><th>Ne zaman?</th><th>Amacı</th></tr>
    <tr><td><strong>livenessProbe</strong></td><td>Pod çalışırken periyodik</td><td>Donmuş uygulamayı yeniden başlat</td></tr>
    <tr><td><strong>readinessProbe</strong></td><td>Pod başlarken / çalışırken</td><td>Trafik almaya hazır mı?</td></tr>
    <tr><td><strong>startupProbe</strong></td><td>İlk açılışta (yavaş uygulamalar)</td><td>liveness'ı geç başlat</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>Probe örneği (deployment içinde)</span></div>
    <pre><code>containers:
  - name: nginx
    image: nginx:1.25-alpine
    ports:
      - containerPort: 80
    livenessProbe:
      httpGet:
        path: /
        port: 80
      initialDelaySeconds: 10
      periodSeconds: 15
    readinessProbe:
      httpGet:
        path: /
        port: 80
      initialDelaySeconds: 5
      periodSeconds: 10</code></pre>
</div>

<h2>Rolling Update Stratejisi</h2>
<div class="info-box note">
    <div class="info-box-title">📌 RollingUpdate, maxSurge, maxUnavailable</div>
    Yeni sürümü tek seferde değil, <em>kademeli</em> devreye almak:
    <ul>
        <li><strong>RollingUpdate</strong>: Eski pod kapanmadan yenisi açılır — site kesintisiz güncellenir.</li>
        <li><strong>maxSurge</strong>: Güncelleme sırasında normalden kaç <em>fazla</em> pod olabilir (ör. 3 yerine geçici 4).</li>
        <li><strong>maxUnavailable</strong>: En fazla kaç pod kapalı olabilir — 0 ise "hiçbiri kapalı kalmasın" demektir.</li>
        <li><strong>rollout undo</strong>: Güncelleme bozuksa bir önceki sürüme geri dönmek (rollback).</li>
    </ul>
</div>
<p>Deployment varsayılan olarak <strong>RollingUpdate</strong> kullanır — eski pod'lar kademeli kapanır, yenileri açılır:</p>

<div class="code-block">
    <div class="code-block-header"><span>Strateji özelleştirme</span></div>
    <pre><code>spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        <span class="comment"># Güncelleme sırasında en fazla 1 fazla pod</span>
      maxUnavailable: 0  <span class="comment"># Hiç pod kapalı kalmasın</span>
  replicas: 3
  ...</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>İmaj değiştirme ve izleme</span></div>
    <pre><code><span class="comment"># deployment.yaml içinde image: nginx:1.26-alpine yapın</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">apply -f deployment.yaml</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">rollout status deployment/web</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">rollout history deployment/web</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">rollout undo deployment/web</span></code></pre>
</div>

<h2>Pratik Proje: Flask Uygulaması</h2>
<p>Docker bölümündeki Flask örneğinin Kubernetes karşılığı:</p>

<div class="code-block">
    <div class="code-block-header"><span>app.py</span></div>
    <pre><code>from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Merhaba Kubernetes!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Dockerfile (özet)</span></div>
    <pre><code>FROM python:3.12-slim
WORKDIR /app
RUN pip install flask
COPY app.py .
EXPOSE 5000
CMD ["python", "app.py"]</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>İmaj build + Minikube'a yükle</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker</span> <span class="argument">build -t flask-k8s:1.0 .</span>
<span class="prompt">$</span> <span class="command">minikube</span> <span class="argument">image load flask-k8s:1.0</span>
<span class="comment"># Minikube kendi Docker daemon'unu kullanır; imajı içeri aktarmak gerekir</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Neden minikube image load?</div>
    Bilgisayarınızda <code>docker build</code> ile imaj oluşturursunuz; ama Minikube <strong>ayrı bir Docker ortamı</strong> kullanır — sizin build ettiğiniz imajı görmez. <code>minikube image load</code>, imajı Minikube'ın içine kopyalar. Alternatif: Minikube'ın Docker'ını kullanarak build etmek (<code>eval $(minikube docker-env)</code>).
</div>

<div class="code-block">
    <div class="code-block-header"><span>flask-deployment.yaml</span></div>
    <pre><code>apiVersion: apps/v1
kind: Deployment
metadata:
  name: flask-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: flask
  template:
    metadata:
      labels:
        app: flask
    spec:
      containers:
        - name: flask
          image: flask-k8s:1.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 5000
          readinessProbe:
            httpGet:
              path: /
              port: 5000
            initialDelaySeconds: 3</code></pre>
</div>

<pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">apply -f flask-deployment.yaml</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">port-forward deployment/flask-app 5000:5000</span>
<span class="comment"># http://localhost:5000</span></code></pre>

<h2>YAML İpuçları ve Doğrulama</h2>
<div class="info-box warning">
    <div class="info-box-title">⚠️ YAML Kuralları (Compose'dan Hatırlayın)</div>
    <ul>
        <li>Girinti = 2 boşluk (TAB kullanmayın).</li>
        <li><code>key: value</code> — iki noktadan sonra boşluk şart.</li>
        <li>Listeler tire (<code>-</code>) ile başlar.</li>
    </ul>
</div>

<pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">apply -f deployment.yaml --dry-run=client</span>
<span class="comment"># Küme değişmeden syntax kontrolü</span>

<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get deployment web -o yaml</span>
<span class="comment"># Kümedeki gerçek YAML'ı gör (öğrenmek için altın)</span></code></pre>

<h2>Klasör Yapısı Önerisi</h2>
<pre><code>k8s-projem/
├── base/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── kustomization.yaml   <span class="comment"># ileri seviye</span>
├── overlays/
│   ├── dev/
│   └── prod/
└── README.md</code></pre>

<p>Başlangıçta tek klasörde birkaç YAML yeterli. Büyüdükçe ortam bazlı ayrım yaparsınız.</p>

<h2>Özet</h2>
<ul>
    <li>Manifest = <code>apiVersion + kind + metadata + spec</code>.</li>
    <li>Pod öğrenmek için; Deployment üretim için.</li>
    <li>Label/selector eşleşmesi kritik.</li>
    <li>Probe'lar sağlıklı rolling update için şart.</li>
    <li><code>kubectl apply -f</code> ile GitOps yoluna girersiniz.</li>
</ul>
<p>Sonraki bölümde Service, ConfigMap, Secret ve kalıcı depolamayı ele alacağız.</p>
`,
    quiz: [
        {
            question: "Kubernetes manifestinde 'kind' alanı ne belirtir?",
            options: [
                "Kaynak türünü (Pod, Deployment vb.)",
                "Sadece imaj adını",
                "Kubernetes sürüm numarasını",
                "Pod IP adresini"
            ],
            correct: 0,
            explanation: "kind, oluşturulacak Kubernetes kaynağının türünü belirtir: Pod, Deployment, Service, ConfigMap..."
        },
        {
            question: "Deployment'ta selector ile template.labels neden eşleşmeli?",
            options: [
                "Deployment hangi pod'ları yöneteceğini bilsin diye",
                "Sadece görsel düzen için",
                "Docker Hub zorunluluğu",
                "Namespace silmek için"
            ],
            correct: 0,
            explanation: "selector.matchLabels, deployment'ın sahipleneceği pod'ları label ile seçer; template'teki labels bu seçiciye uymalıdır."
        },
        {
            question: "readinessProbe ne işe yarar?",
            options: [
                "Pod trafik almaya hazır mı kontrol eder",
                "Pod'u kalıcı siler",
                "Node ekler",
                "Imaj build eder"
            ],
            correct: 0,
            explanation: "readinessProbe başarısızsa pod Service yük dengelemesine alınmaz; uygulama henüz hazır değil demektir."
        },
        {
            question: "kubectl apply -f deployment.yaml ne yapar?",
            options: [
                "Manifesti kükeye uygular veya günceller",
                "Sadece pod listeler",
                "Minikube siler",
                "YAML dosyasını siler"
            ],
            correct: 0,
            explanation: "apply declarative yaklaşımdır; dosyadaki istenen durumu kümede oluşturur veya fark varsa günceller."
        },
        {
            question: "Üretimde pod yerine neden Deployment kullanılır?",
            options: [
                "Replica, güncelleme ve self-healing sağlar",
                "Pod daha hızlıdır",
                "Deployment imaj build eder",
                "Pod DNS oluşturur"
            ],
            correct: 0,
            explanation: "Deployment pod'ları yönetir; replica korur, rolling update ve rollback sunar. Tek pod silinince yeniden oluşur."
        },
        {
            question: "Minikube'ta yerel build imajını kullanmak için?",
            options: [
                "minikube image load imaj:tag",
                "kubectl delete cluster",
                "docker rmi --all",
                "Sadece Docker Hub zorunlu"
            ],
            correct: 0,
            explanation: "Minikube ayrı Docker ortamı kullanır; host'ta build ettiğiniz imajı minikube image load ile içeri aktarmanız gerekir."
        },
        {
            question: "resources.requests ne işe yarar?",
            options: [
                "Scheduler'a minimum kaynak ihtiyacını bildirir",
                "Pod'u siler",
                "Log seviyesini ayarlar",
                "Namespace oluşturur"
            ],
            correct: 0,
            explanation: "requests, pod'un ihtiyaç duyduğu minimum CPU/bellek; scheduler hangi node'a sığacağını buna göre hesaplar."
        },
        {
            question: "RollingUpdate stratejisi ne sağlar?",
            options: [
                "Kesintisiz kademeli güncelleme",
                "Tüm pod'ları anında siler",
                "Sadece tek pod çalıştırır",
                "Node'ları yeniden formatlar"
            ],
            correct: 0,
            explanation: "RollingUpdate, yeni sürüm pod'ları devreye alırken eskileri kademeli kapatır; servis kesintisini minimize eder."
        },
        {
            question: "livenessProbe başarısız olursa ne olur?",
            options: [
                "Kubernetes konteyneri yeniden başlatır",
                "Hiçbir şey olmaz",
                "Deployment silinir",
                "Service oluşturulur"
            ],
            correct: 0,
            explanation: "livenessProbe, uygulamanın canlı olup olmadığını kontrol eder; başarısızsa kubelet konteyneri restart eder."
        },
        {
            question: "kubectl get deployment web -o yaml ne yapar?",
            options: [
                "Kümedeki deployment'ın YAML'ını gösterir",
                "Deployment'ı siler",
                "Yeni node ekler",
                "Sadece pod adını yazar"
            ],
            correct: 0,
            explanation: "-o yaml çıktısı, kümedeki gerçek kaynak tanımını gösterir; öğrenme ve debug için çok faydalıdır."
        }
    ]
});
