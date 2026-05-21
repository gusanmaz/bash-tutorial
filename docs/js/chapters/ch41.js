// ===== Bölüm 41: Service, ConfigMap, Secret ve Volume =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 41,
    title: 'Service, ConfigMap, Secret ve Volume',
    subtitle: 'Networking, Config & Storage in Kubernetes',
    icon: '🔗',
    description: 'ClusterIP, NodePort, LoadBalancer; ConfigMap ve Secret ile yapılandırma; PersistentVolume ile kalıcı veri; çok katmanlı uygulama örneği.',
    content: `
<h2>Pod'lar Konuşuyor Ama Nasıl Buluyor?</h2>
<p>Deployment ile 5 NGINX pod'unuz var. Biri öldü, yenisi geldi — IP değişti. Flask uygulamanız "hangi IP'ye istek atayım?" diye sorar. Cevap: <strong>Service</strong>.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Service = Sabit Adres + Yük Dengeleme</div>
    Pod'lar gelip gider; Service adı (<code>web-service</code>) ve ClusterIP sabit kalır. Service, selector ile eşleşen pod'lara trafiği dağıtır — mini bir load balancer gibidir.
</div>

<h2>Service Türleri</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Service türleri — hangisi ne işe yarar?</div>
    <ul>
        <li><strong>ClusterIP</strong>: Sadece küme <em>içinden</em> erişim — veritabanı, arka plan servisleri.</li>
        <li><strong>NodePort</strong>: Sunucunun bir portunu dışarı açar — Minikube'ta tarayıcı testi için.</li>
        <li><strong>LoadBalancer</strong>: Bulut sağlayıcının yük dengeleyicisi — gerçek canlı site için (AWS/GCP).</li>
        <li><strong>Yük dengeleme</strong>: Gelen isteği arkadaki birden fazla pod'a dağıtmak.</li>
    </ul>
</div>
<table>
    <tr><th>Tür</th><th>Erişim</th><th>Ne zaman?</th></tr>
    <tr><td><strong>ClusterIP</strong> (varsayılan)</td><td>Sadece küme içi</td><td>Backend, veritabanı, mikroservisler arası</td></tr>
    <tr><td><strong>NodePort</strong></td><td>Her node'un bir portu (30000-32767)</td><td>Minikube'ta test, basit dış erişim</td></tr>
    <tr><td><strong>LoadBalancer</strong></td><td>Bulut sağlayıcı LB IP'si</td><td>AWS/GCP/Azure üretim</td></tr>
    <tr><td><strong>ExternalName</strong></td><td>DNS CNAME</td><td>Dış servise alias</td></tr>
</table>

<h2>ClusterIP Service — Küme İçi İletişim</h2>
<div class="code-block">
    <div class="code-block-header"><span>service.yaml</span></div>
    <pre><code>apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: ClusterIP
  selector:
    app: web
  ports:
    - port: 80          <span class="comment"># Service portu</span>
      targetPort: 80    <span class="comment"># Pod portu</span></code></pre>
</div>

<pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">apply -f service.yaml</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get svc web-service</span>
<span class="output">NAME          TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
web-service   ClusterIP   10.96.50.10   &lt;none&gt;        80/TCP    30s</span></code></pre>

<p>Küme içindeki başka bir pod, <code>http://web-service</code> veya <code>http://web-service.default.svc.cluster.local</code> adresine istek atar. Docker Compose'daki servis adı mantığıyla aynı!</p>

<div class="info-box note">
    <div class="info-box-title">📌 DNS Formatı</div>
    <code>&lt;servis-adı&gt;.&lt;namespace&gt;.svc.cluster.local</code><br>
    Aynı namespace'te sadece servis adı yeterli: <code>web-service</code>.
</div>

<h2>NodePort — Minikube'ta Dış Erişim</h2>
<div class="code-block">
    <div class="code-block-header"><span>NodePort service</span></div>
    <pre><code>apiVersion: v1
kind: Service
metadata:
  name: web-nodeport
spec:
  type: NodePort
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080   <span class="comment"># opsiyonel; yoksa otomatik atanır</span></code></pre>
</div>

<pre><code><span class="prompt">$</span> <span class="command">minikube</span> <span class="argument">service web-nodeport --url</span>
<span class="output">http://192.168.49.2:30080</span></code></pre>

<h2>Ingress — HTTP Yönlendirme (Giriş)</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Ingress, domain, path routing</div>
    <ul>
        <li><strong>Ingress</strong> (<em>giriş kapısı</em>): Dış dünyadan gelen web isteklerini doğru Service'e yönlendirir.</li>
        <li><strong>Domain</strong>: <code>web.sirketim.com</code> gibi adres — Ingress hangi domain hangi uygulamaya gidecek bilir.</li>
        <li><strong>Path routing</strong>: <code>/api</code> bir servise, <code>/</code> başka servise — tek IP, çok uygulama.</li>
        <li><strong>Ingress Controller</strong>: Ingress kurallarını uygulayan program — NGINX, Traefik gibi.</li>
    </ul>
</div>
<p>NodePort her servis için ayrı port demek. Üretimde genelde <strong>Ingress</strong> kullanılır:</p>

<div class="code-block">
    <div class="code-block-header"><span>Basit Ingress örneği</span></div>
    <pre><code>apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
    - host: web.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80</code></pre>
</div>

<p>Minikube'ta Ingress controller etkinleştirmek için:</p>
<pre><code><span class="prompt">$</span> <span class="command">minikube</span> <span class="argument">addons enable ingress</span>
<span class="comment"># /etc/hosts'a: 192.168.49.2 web.local</span></code></pre>

<div class="info-box note">
    <div class="info-box-title">📌 Ingress Controller Gerekir</div>
    Ingress tek başına çalışmaz; NGINX Ingress Controller, Traefik veya bulut LB gibi bir controller kurulu olmalıdır. Minikube addon bunu sağlar.
</div>

<h2>ConfigMap — Yapılandırmayı Koddan Ayırma</h2>
<div class="info-box note">
    <div class="info-box-title">📌 ConfigMap vs Secret</div>
    <ul>
        <li><strong>ConfigMap</strong>: <em>Hassas olmayan</em> ayarlar — debug açık mı, karşılama mesajı, veritabanı sunucu adı.</li>
        <li><strong>Secret</strong>: <em>Hassas</em> bilgiler — şifre, API anahtarı, TLS sertifikası.</li>
        <li><strong>Environment variable (ortam değişkeni)</strong>: Pod içindeki uygulamanın okuduğu ayar — <code>DATABASE_URL=...</code> gibi.</li>
    </ul>
    Ayarları imajın içine gömmeyin; pod başlarken enjekte edin — kod değişmeden ayar değişir.
</div>
<p>Veritabanı URL'si, debug modu, feature flag'ler — bunları imaja gömmeyin. <strong>ConfigMap</strong> ile pod'a enjekte edin:</p>

<div class="code-block">
    <div class="code-block-header"><span>configmap.yaml</span></div>
    <pre><code>apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "development"
  LOG_LEVEL: "debug"
  WELCOME_MSG: "Merhaba Kubernetes!"</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Deployment'ta kullanım (env)</span></div>
    <pre><code>spec:
  containers:
    - name: app
      image: myapp:1.0
      envFrom:
        - configMapRef:
            name: app-config
      <span class="comment"># veya tek tek:</span>
      env:
        - name: LOG_LEVEL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: LOG_LEVEL</code></pre>
</div>

<p>ConfigMap'i dosya olarak da mount edebilirsiniz (nginx.conf gibi).</p>

<h2>Secret — Hassas Bilgiler</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Secret, Base64, TLS</div>
    <ul>
        <li><strong>Secret</strong>: Şifre ve API anahtarı gibi gizli bilgilerin Kubernetes'te saklandığı yer.</li>
        <li><strong>Base64</strong>: Metni farklı karakter setine çevirme — <em>şifreleme değildir</em>, sadece kodlama. Gerçek güvenlik için erişim kısıtlanmalıdır.</li>
        <li><strong>TLS</strong> (<em>HTTPS sertifikası</em>): Web trafiğini şifreleyen sertifika — Secret içinde saklanabilir.</li>
    </ul>
</div>
<p>Şifre, API anahtarı, TLS sertifikası — <strong>Secret</strong> ile saklanır. Base64 ile kodlanır ama <strong>şifreleme değildir</strong>; etcd erişimi kısıtlanmalıdır.</p>

<div class="code-block">
    <div class="code-block-header"><span>secret.yaml</span></div>
    <pre><code>apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:          <span class="comment"># stringData düz metin kabul eder (K8s encode eder)</span>
  DB_USER: admin
  DB_PASSWORD: gizli-sifre-123</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Pod'da Secret kullanımı</span></div>
    <pre><code>env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-secret
        key: DB_PASSWORD</code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Secret'ları Git'e Koymayın</div>
    Gerçek şifreleri YAML'da tutmayın. Üretimde <a href="https://external-secrets.io/" target="_blank" rel="noopener">External Secrets</a>, HashiCorp Vault veya bulut secret manager kullanılır. Öğrenme aşamasında Minikube'ta stringData yeterli — ama alışkanlık olarak .gitignore'a ekleyin.
</div>

<h2>Volume — Pod Silinince Veri Kalır mı?</h2>
<div class="info-box note">
    <div class="info-box-title">📌 PV, PVC, StorageClass</div>
    Pod silinince içindeki geçici dosyalar gider. Kalıcı veri için:
    <ul>
        <li><strong>PV (PersistentVolume)</strong>: Kümede ayrılmış disk alanı — "sunucuda 10 GB ayır".</li>
        <li><strong>PVC (PersistentVolumeClaim)</strong>: Pod'un talebi — "bana 5 GB disk lazım".</li>
        <li><strong>StorageClass</strong>: Disk türü şablonu — bulut otomatik disk oluştursun.</li>
    </ul>
    Docker volume mantığının Kubernetes karşılığı — veritabanı verisi pod ölse de kalır.
</div>
<p>Pod geçicidir; konteyner diskine yazılan veri pod ölünce gider:</p>

<table>
    <tr><th>Kavram</th><th>Ne?</th></tr>
    <tr><td><strong>Volume</strong></td><td>Pod spec'inde tanımlanan depolama; pod yaşadığı sürece bağlı</td></tr>
    <tr><td><strong>PersistentVolume (PV)</strong></td><td>Kümede ayrılmış depolama kaynağı (NFS, bulut disk...)</td></tr>
    <tr><td><strong>PersistentVolumeClaim (PVC)</strong></td><td>Pod'un "bana 5GB disk lazım" talebi</td></tr>
    <tr><td><strong>StorageClass</strong></td><td>Dinamik PV oluşturma şablonu</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>PVC + Deployment</span></div>
    <pre><code><span class="comment"># pvc.yaml</span>
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
<span class="comment"># deployment'ta volumeMount</span>
spec:
  containers:
    - name: postgres
      image: postgres:16-alpine
      volumeMounts:
        - name: pgdata
          mountPath: /var/lib/postgresql/data
  volumes:
    - name: pgdata
      persistentVolumeClaim:
        claimName: postgres-pvc</code></pre>
</div>

<p>Minikube varsayılan StorageClass ile PVC oluşturduğunuzda otomatik disk ayırır.</p>

<h2>Çok Katmanlı Örnek: Web + Redis + PostgreSQL</h2>
<p>Docker Compose Flask+Redis örneğinin Kubernetes versiyonu — kavramsal akış:</p>

<div class="code-block">
    <div class="code-block-header"><span>Mimari</span></div>
    <pre><code>[Ingress] → [Service: web] → [Deployment: flask x2]
                                    ↓ env: REDIS_HOST=redis-service
                              [Service: redis] → [Deployment: redis x1]
                                    ↓
                              [Service: postgres] → [Deployment: postgres x1 + PVC]</code></pre>
</div>

<ol>
    <li>ConfigMap: <code>APP_ENV</code>, <code>REDIS_HOST=redis-service</code></li>
    <li>Secret: <code>POSTGRES_PASSWORD</code></li>
    <li>Her bileşen için Deployment + Service</li>
    <li>PostgreSQL için PVC</li>
    <li>Dış erişim için Ingress veya NodePort</li>
</ol>

<div class="info-box tip">
    <div class="info-box-title">💡 Başlangıç İpucu: Tek Tek Kurun</div>
    Hepsini bir YAML'a yığmayın. Önce postgres+pvc, sonra redis, en son web. Her adımda <code>kubectl get pods,svc</code> ile doğrulayın. Docker Compose'da <code>depends_on</code> gibi — burada readinessProbe + init container kullanılır (ileri seviye).
</div>

<h2>initContainers — Başlamadan Önce Hazırlık</h2>
<div class="info-box note">
    <div class="info-box-title">📌 initContainer ve depends_on</div>
    Web uygulaması veritabanı hazır olmadan başlamasın diye <strong>initContainer</strong> kullanılır — ana konteynerlerden <em>önce</em> çalışan kısa görev. Docker Compose'daki <code>depends_on</code> benzeri ama "gerçekten hazır mı?" kontrolü yapılabilir.
</div>
<p>Web pod'u, veritabanı hazır olmadan başlamasın:</p>

<div class="code-block">
    <div class="code-block-header"><span>initContainer örneği</span></div>
    <pre><code>spec:
  initContainers:
    - name: wait-for-db
      image: busybox:1.36
      command: ['sh', '-c', 'until nc -z postgres-service 5432; do sleep 2; done']
  containers:
    - name: web
      image: myapp:1.0
      ...</code></pre>
</div>

<h2>Namespace ile Ortam Ayırma</h2>
<pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">create namespace staging</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">apply -f deployment.yaml -n staging</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get all -n staging</span></code></pre>

<h2>Debug Araçları</h2>
<div class="code-block">
    <div class="code-block-header"><span>Ağ test pod'u</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">run tmp --rm -it --image=nicolaka/netshoot -- bash</span>
<span class="output">/ # curl http://web-service
/ # nslookup redis-service
/ # dig postgres-service.default.svc.cluster.local</span></code></pre>
</div>

<p>Docker bölümündeki <code>netshoot</code> imajı Kubernetes'te de aynı işe yarar.</p>

<h2>Özet Tablo — Docker vs Kubernetes</h2>
<table>
    <tr><th>Docker Compose</th><th>Kubernetes</th></tr>
    <tr><td><code>services.web.ports</code></td><td>Service <code>ports</code></td></tr>
    <tr><td><code>environment:</code></td><td>ConfigMap / Secret + <code>env</code></td></tr>
    <tr><td><code>volumes:</code></td><td>PVC + <code>volumeMounts</code></td></tr>
    <tr><td><code>depends_on</code></td><td>initContainers + readinessProbe</td></tr>
    <tr><td><code>networks:</code></td><td>Varsayılan pod ağı (otomatik DNS)</td></tr>
</table>

<h2>Özet</h2>
<ul>
    <li><strong>Service</strong> pod'lara sabit adres ve yük dengeleme sağlar.</li>
    <li><strong>ConfigMap</strong> yapılandırma, <strong>Secret</strong> hassas veri içindir.</li>
    <li><strong>PVC</strong> ile pod silinse bile veri kalır.</li>
    <li><strong>Ingress</strong> HTTP trafiğini domain/path ile yönlendirir.</li>
</ul>
<p>Son bölümde Helm, gerçek dünya örnekleri ve öğrenme kaynaklarını toplayacağız.</p>
`,
    quiz: [
        {
            question: "ClusterIP Service kime erişilebilir?",
            options: [
                "Sadece Kubernetes kümesi içinden",
                "Doğrudan internetten herkese",
                "Sadece Windows makinelerden",
                "Hiç kimse erişemez"
            ],
            correct: 0,
            explanation: "ClusterIP varsayılan service türüdür; sanal IP sadece küme içi pod'lar tarafından erişilebilir."
        },
        {
            question: "Service selector'ın görevi nedir?",
            options: [
                "Hangi pod'lara trafik gideceğini label ile seçmek",
                "Pod CPU limitini artırmak",
                "Node silmek",
                "Imaj build etmek"
            ],
            correct: 0,
            explanation: "Service spec.selector, eşleşen label'a sahip pod'ları endpoint listesine alır ve trafiği onlara dağıtır."
        },
        {
            question: "ConfigMap ne için kullanılır?",
            options: [
                "Yapılandırma verilerini koddan ayırmak",
                "Pod'u kalıcı silmek",
                "Node eklemek",
                "TLS şifrelemek"
            ],
            correct: 0,
            explanation: "ConfigMap, ortam değişkenleri ve config dosyalarını pod'lara env veya volume olarak enjekte etmek için kullanılır."
        },
        {
            question: "Secret ile ConfigMap arasındaki fark?",
            options: [
                "Secret hassas veri içindir",
                "Secret sadece log tutar",
                "Fark yoktur",
                "ConfigMap sadece şifre saklar"
            ],
            correct: 0,
            explanation: "Secret şifre, token, sertifika gibi hassas veriler içindir; erişim daha kısıtlı tutulmalıdır."
        },
        {
            question: "PersistentVolumeClaim (PVC) ne yapar?",
            options: [
                "Depolama talebi oluşturur",
                "Pod IP'si atar",
                "Deployment siler",
                "Ingress kurar"
            ],
            correct: 0,
            explanation: "PVC, pod'un kullanacağı kalıcı depolama miktarını ve erişim modunu talep eder; PV ile bağlanır."
        },
        {
            question: "NodePort Service ne sağlar?",
            options: [
                "Her node'da sabit bir port üzerinden dış erişim",
                "Sadece küme içi DNS",
                "Otomatik imaj build",
                "Namespace silme"
            ],
            correct: 0,
            explanation: "NodePort, 30000-32767 aralığında bir port açarak node IP + port ile dışarıdan erişim sağlar."
        },
        {
            question: "Ingress'in rolü nedir?",
            options: [
                "HTTP/HTTPS trafiğini domain ve path ile yönlendirmek",
                "Pod CPU ölçmek",
                "Veritabanı yedeklemek",
                "Docker imajı indirmek"
            ],
            correct: 0,
            explanation: "Ingress, dış HTTP trafiğini kurallara göre ilgili Service'lere yönlendirir; genelde tek giriş noktası sağlar."
        },
        {
            question: "Pod içinde redis-service adresine erişmek için?",
            options: [
                "Service DNS adını kullanmak (redis-service)",
                "Pod IP'sini hard-code etmek",
                "localhost:6379 yeterli",
                "Node adını yazmak"
            ],
            correct: 0,
            explanation: "Kubernetes DNS, service adını ClusterIP'ye çözer. Pod IP değişse bile service adı sabittir."
        },
        {
            question: "readinessProbe ile livenessProbe farkı?",
            options: [
                "readiness trafik almaya hazırlığı, liveness canlılığı kontrol eder",
                "İkisi de aynı işi yapar",
                "liveness sadece log tutar",
                "readiness pod siler"
            ],
            correct: 0,
            explanation: "readiness başarısızsa Service o pod'a trafik göndermez; liveness başarısızsa kubelet konteyneri restart eder."
        },
        {
            question: "initContainer ne zaman çalışır?",
            options: [
                "Ana konteynerlerden önce, hazırlık için",
                "Pod silindikten sonra",
                "Sadece node'da",
                "Hiç çalışmaz"
            ],
            correct: 0,
            explanation: "initContainer'lar sırayla çalışır ve başarılı olunca ana konteynerler başlar; DB bekleme gibi senaryolar için idealdir."
        }
    ]
});
