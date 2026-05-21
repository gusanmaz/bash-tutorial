// ===== Bölüm 38: Kubernetes — Felsefe ve Temel Kavramlar =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 38,
    title: 'Kubernetes: Felsefe ve Temel Kavramlar',
    subtitle: 'What is Kubernetes & Why It Matters',
    icon: '☸️',
    description: 'Docker\'dan sonra neden Kubernetes? Küme, pod, node, control plane kavramları; orkestrasyon problemi ve temel mimari.',
    content: `
<h2>Docker Yetmedi — Peki Şimdi Ne Olacak?</h2>
<div class="info-box tip">
    <div class="info-box-title">💡 Bu bölümde 📌 kutuları</div>
    Pod, namespace, HPA, sidecar gibi Kubernetes terimleri ilk geçtiğinde <strong>📌 not kutularında</strong> açıklanır. Docker bölümündeki gibi adım adım gideceğiz.
</div>
<p>Docker bölümlerinde bir uygulamayı konteyner haline getirmeyi, çalıştırmayı, ağa bağlamayı ve Compose ile birkaç servisi birlikte yönetmeyi öğrendiniz. CI/CD bölümlerinde (Bölüm 33–37) imajınızı otomatik build edip test etmeyi; Bölüm 33'deki <strong>TGO haritasında</strong> bu parçanın nereye oturduğunu gördünüz. Şimdi sıradaki adım: <strong>ölçek</strong>.</p>

<blockquote><em>"Tek makinede 5 konteyner güzel. Peki 500 konteyner, 50 sunucu, biri çöktü, biri yavaşladı, trafik 10 kat arttı — ne yapacağız?"</em></blockquote>

<p>İşte bu noktada <strong>orkestrasyon (orchestration)</strong> devreye girer.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Orkestrasyon ve ölçek ne demek?</div>
    <ul>
        <li><strong>Orkestrasyon</strong>: Çok sayıda konteyneri birden fazla sunucuda <em>otomatik yönetmek</em> — hangisi çalışacak, biri ölürse ne olacak, trafik artınca kaç kopya açılacak.</li>
        <li><strong>Ölçek (scale)</strong>: Yük arttığında uygulamanın kopya sayısını artırmak — tek NGINX yerine 10 NGINX.</li>
        <li><strong>K8s</strong>: Kubernetes'in kısa yazılışı — K + 8 harf + s.</li>
    </ul>
    Orkestra şefi benzetmesi: müzisyenler = konteynerler; şef = Kubernetes; konser = uygulamanız.
</div>

<p><strong>Kubernetes</strong> tam olarak bunu yapar: konteynerleri <strong>birden fazla makinede</strong>, <strong>otomatik</strong> ve <strong>dayanıklı</strong> şekilde yönetir.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Kubernetes'in Tek Cümlelik Tanımı</div>
    Kubernetes, konteynerlerinizi <strong>istenen durumda (desired state)</strong> tutmaya çalışan bir <strong>kontrol sistemidir</strong>. Siz "3 tane NGINX çalışsın" dersiniz; biri ölürse Kubernetes üçüncüyü yeniden oluşturur. Siz "web uygulamasına CPU yetmiyor" derseniz, replica sayısını artırabilir.
</div>

<h2>Docker ile Kubernetes Arasındaki İlişki</h2>
<p>Bu ikisi rakip değil, <strong>katmanlar</strong>:</p>

<table>
    <tr><th>Katman</th><th>Ne yapar?</th><th>Benzetme</th></tr>
    <tr><td><strong>Docker</strong></td><td>Tek konteyneri paketler ve çalıştırır</td><td>Tek bir müzisyen ve enstrümanı</td></tr>
    <tr><td><strong>Docker Compose</strong></td><td>Bir makinede birkaç konteyneri birlikte yönetir</td><td>Küçük bir grup provası</td></tr>
    <tr><td><strong>Kubernetes</strong></td><td>Onlarca/sunucularca konteyneri dağıtır, izler, onarır</td><td>Tüm orkestranın şefi</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Kubernetes Konteyner Çalıştırır Ama Docker Değildir</div>
    Kubernetes, konteynerleri doğrudan "Docker engine" ile değil, genelde <strong>containerd</strong> veya <strong>CRI-O</strong> gibi daha düşük seviyeli bir <strong>Container Runtime</strong> ile çalıştırır. Siz hâlâ Docker imajı (<code>nginx:latest</code>) kullanırsınız — format aynıdır. Sadece "motor" farklı olabilir. Öğrenirken bunu bilmeniz yeterli; pratikte imajlarınız Docker Hub'dan gelmeye devam eder.
</div>

<h2>Neden Google Kubernetes'i Yarattı?</h2>
<p>2000'lerde Google, dünyanın en büyük web altyapılarından birini işletiyordu. Her gün milyarlarca istek, binlerce sunucu. Her servisi elle yönetmek imkansızdı. İçeride <strong>Borg</strong> adlı bir sistem vardı — konteyner benzeri iş yüklerini otomatik dağıtıyordu.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Container Runtime, CNCF, Borg</div>
    <ul>
        <li><strong>Container Runtime</strong>: Konteyneri gerçekten çalıştıran motor — Docker CLI kullanmasanız bile imaj formatı aynıdır.</li>
        <li><strong>CNCF</strong>: Cloud Native Computing Foundation — Kubernetes gibi bulut-native projeleri koordine eden topluluk.</li>
        <li><strong>Borg</strong>: Google'ın iç sisteminin adı — Kubernetes'in atası; halka açık sürümü K8s'tir.</li>
    </ul>
</div>

<div class="eng-box">
    <div class="eng-title">🔤 Temel Terimler</div>
    <div class="eng-content">
        <span class="eng-word">Cluster</span> = <span class="eng-meaning">Küme</span> — Kubernetes'in yönettiği tüm makinelerin oluşturduğu sistem.<br>
        <span class="eng-word">Node</span> = <span class="eng-meaning">Düğüm</span> — Kümedeki tek bir makine (fiziksel sunucu veya VM).<br>
        <span class="eng-word">Control Plane</span> = <span class="eng-meaning">Kontrol Düzlemi</span> — Kümenin "beyni"; kararları burada verilir.<br>
        <span class="eng-word">Worker Node</span> = <span class="eng-meaning">İşçi Düğüm</span> — Konteynerlerin gerçekten çalıştığı makineler.<br>
        <span class="eng-word">Pod</span> = <span class="eng-meaning">Pod</span> — Kubernetes'in en küçük çalıştırılabilir birimi; bir veya birkaç konteyneri bir arada tutar.<br>
        <span class="eng-word">Deployment</span> = <span class="eng-meaning">Dağıtım</span> — Pod'ların kaç kopya olacağını ve nasıl güncelleneceğini tanımlar.<br>
        <span class="eng-word">Service</span> = <span class="eng-meaning">Servis</span> — Pod'lara sabit bir ağ adresi ve yük dengeleme sağlar.<br>
        <span class="eng-word">Namespace</span> = <span class="eng-meaning">Ad Alanı</span> — Küme içinde mantıksal ayırma (dev, staging, prod gibi).<br>
        <span class="eng-word">kubectl</span> = <span class="eng-meaning">Kube Control</span> — Kubernetes ile konuştuğunuz komut satırı aracı.
    </div>
</div>

<h2>Kubernetes Mimarisi — Basitçe</h2>

<div class="code-block">
    <div class="code-block-header"><span>Kubernetes kümesi (basitleştirilmiş)</span></div>
    <pre><code>┌─────────────────── CONTROL PLANE ───────────────────┐
│  API Server  ←→  etcd (küme durumu / hafıza)        │
│       ↑                                              │
│  Scheduler (pod'u hangi node'a koyayım?)             │
│  Controller Manager (istenen durumu koru)            │
└────────────────────────┬────────────────────────────┘
                         │  (kubectl buraya konuşur)
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │ Worker 1 │   │ Worker 2 │   │ Worker 3 │
   │  kubelet │   │  kubelet │   │  kubelet │
   │  Pod Pod │   │  Pod     │   │  Pod Pod │
   └──────────┘   └──────────┘   └──────────┘</code></pre>
</div>

<p>Her parçanın görevi:</p>

<div class="info-box note">
    <div class="info-box-title">📌 Control plane parçaları — sade Türkçe</div>
    <ul>
        <li><strong>API Server</strong>: Kümenin "gişesi" — <code>kubectl</code> komutlarınız buraya gider.</li>
        <li><strong>etcd</strong>: Kümenin "defteri" — hangi pod nerede, kaç kopya isteniyor; tüm durum burada saklanır (basitçe: ayarların veritabanı).</li>
        <li><strong>Scheduler</strong> (<em>zamanlayıcı</em>): Yeni pod'u <em>hangi sunucuya</em> koyacağına karar veren bileşen.</li>
        <li><strong>Controller Manager</strong>: "İstenen durum = gerçek durum" diye sürekli kontrol eden beyin — 3 kopya istediniz, 2 kaldıysa 1 tane daha açar.</li>
        <li><strong>kubelet</strong>: Her worker sunucuda çalışan ajan — "bu sunucuda şu pod'u çalıştır" emrini uygular.</li>
    </ul>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Declarative (bildirimsel) ne demek?</div>
    <em>"Şu komutu çalıştır"</em> demek yerine <em>"3 tane NGINX çalışsın"</em> dersiniz — sistem farkı kendisi kapatır. Docker'da çoğunlukla <code>docker run</code> (emir); Kubernetes'te YAML dosyası (hedef durum).
</div>

<div class="info-box note">
    <div class="info-box-title">📌 İstenen Durum (Desired State) Felsefesi</div>
    Docker'da genelde <em>"şu komutu çalıştır"</em> dersiniz (imperative). Kubernetes'te <em>"şu durum olsun"</em> dersiniz (declarative). Örnek: "NGINX'ten 3 kopya çalışsın." Biri çökerse Kubernetes fark eder ve tekrar 3'e tamamlar. Siz "yeniden başlat" demezsiniz; sistem kendi kendini onarır.
</div>

<h2>Pod Nedir? Neden Konteyner Değil?</h2>
<p>Yeni başlayanların en çok şaşırdığı nokta: Kubernetes'te doğrudan "konteyner çalıştırmazsınız", <strong>pod</strong> çalıştırırsınız.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Pod = Konteyner(ler) + Ortak Ortam</div>
    <ul>
        <li>Çoğu pod'da <strong>tek bir konteyner</strong> vardır (NGINX pod'u = NGINX konteyneri).</li>
        <li>Bazen aynı pod içinde <strong>yardımcı konteyner</strong> olur — buna <strong>sidecar</strong> (<em>yan araba</em>) denir: log toplayıcı, proxy gibi ana uygulamaya yardım eden ikinci küçük konteyner.</li>
        <li>Pod içindeki konteynerler <strong>aynı IP adresini</strong> ve <strong>localhost</strong> üzerinden birbirleriyle konuşur.</li>
        <li>Pod'lar <strong>geçicidir (ephemeral)</strong>: silinir, yeniden oluşturulur; IP değişebilir. Kalıcı adres için <strong>Service</strong> kullanılır.</li>
    </ul>
</div>

<p>Docker'daki konteyner = tek tabak yemek. Kubernetes pod'u = o tabağın servis edildiği tepsi + garnitür (gerekirse). Kubernetes yönetimi pod seviyesinde yapılır.</p>

<h2>Deployment: Pod'ları Yönetmenin Pratik Yolu</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Replica, rolling update, rollback</div>
    <ul>
        <li><strong>Replica</strong> (<em>kopya</em>): Aynı uygulamanın kaç tane eşzamanlı çalışacağı — 3 replica = 3 ayrı pod.</li>
        <li><strong>Rolling update</strong> (<em>yuvarlanarak güncelleme</em>): Eski pod'lar tek tek kapanır, yenileri açılır — site kesintisiz güncellenir.</li>
        <li><strong>Rollback</strong> (<em>geri alma</em>): Yeni sürüm bozuksa bir önceki çalışan sürüme dönmek.</li>
    </ul>
</div>
<p>Tek bir pod YAML dosyası yazmak öğrenmek için iyidir; üretimde ise genelde doğrudan pod oluşturmazsınız. Bunun yerine <strong>Deployment</strong> kullanırsınız:</p>

<ul>
    <li><strong>Replica sayısı</strong>: "Bu uygulamadan 5 tane olsun."</li>
    <li><strong>Rolling update</strong>: Yeni sürümü sırayla devreye alır; site kesintisiz güncellenir.</li>
    <li><strong>Rollback</strong>: Yeni sürüm bozuksa eski sürüme geri dönersiniz.</li>
</ul>

<div class="code-block">
    <div class="code-block-header"><span>Deployment mantığı (soyut)</span></div>
    <pre><code>Deployment (nginx, replicas: 3)
        │
        ├── Pod (nginx-abc)  →  Node 1
        ├── Pod (nginx-def)  →  Node 2
        └── Pod (nginx-ghi)  →  Node 3

<span class="comment"># Pod-abc öldü → Deployment yeni pod oluşturur → yine 3 pod</span></code></pre>
</div>

<h2>Service: Pod'lar Ölür, Adres Kalır</h2>
<div class="info-box note">
    <div class="info-box-title">📌 DNS nedir? (Kubernetes bağlamında)</div>
    <strong>DNS</strong> (<em>Domain Name System</em>): İnsanların okuduğu adresleri (<code>nginx-service</code>) bilgisayarın anladığı IP numarasına çeviren "telefon rehberi". Pod IP'si her yeniden başlatmada değişir; Service adı sabit kalır — uygulamalar birbirine <code>http://redis-service</code> gibi isimle bağlanır.
</div>
<p>Pod IP'leri değişkendir. Web uygulamanızın adresi her restart'ta değişse felaket olurdu. <strong>Service</strong>, pod'lara sabit bir DNS adı ve sanal IP verir:</p>

<ul>
    <li><code>http://nginx-service</code> → arkadaki 3 NGINX pod'una trafik dağıtır.</li>
    <li>Pod yenilense bile servis adı aynı kalır.</li>
</ul>

<p>Service türlerini sonraki bölümlerde detaylı göreceğiz. Şimdilik bilmeniz gereken: <strong>Pod = geçici işçi, Service = sabit telefon hattı.</strong></p>

<h2>Namespace: Aynı Kümede Farklı Dünyalar</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Namespace = mantıksal klasör</div>
    Aynı Kubernetes kümesini paylaşan ekipler birbirinin pod'larını görmesin diye <strong>namespace</strong> (ad alanı) kullanılır — tıpkı bilgisayardaki klasör gibi. <code>dev</code>, <code>staging</code>, <code>prod</code> ayrı namespace olabilir.
</div>
<p>Bir Kubernetes kümesi paylaşılabilir. Geliştirme, test ve üretim aynı kümede ama birbirine karışmadan durabilir:</p>

<pre><code>namespace: dev      →  geliştirici denemeleri
namespace: staging →  test ortamı
namespace: prod    →  gerçek kullanıcı trafiği</code></pre>

<p><code>kubectl get pods -n dev</code> ile sadece dev pod'larını görürsünüz. Yeni başlayanlar için varsayılan namespace <code>default</code>'tur.</p>

<h2>Kubernetes Ne Zaman Gerekir, Ne Zaman Erken?</h2>

<table>
    <tr><th>Durum</th><th>Öneri</th></tr>
    <tr><td>Öğreniyorsunuz, tek uygulama deniyorsunuz</td><td>Docker / Compose yeterli</td></tr>
    <tr><td>2-3 sunucu, basit deploy</td><td>Docker Compose veya basit script</td></tr>
    <tr><td>10+ servis, otomatik ölçekleme, sıfır kesinti güncelleme</td><td>Kubernetes mantıklı</td></tr>
    <tr><td>İş ilanlarında "K8s" görüyorsunuz</td><td>Öğrenmeye değer — endüstri standardı</td></tr>
    <tr><td>Henüz Docker'ı oturtmadınız</td><td>Önce Docker'ı sağlamlaştırın, sonra K8s</td></tr>
</table>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Kubernetes Kolay Değildir — Ve Bu Normal</div>
    Kubernetes güçlüdür ama karmaşıktır. İlk hafta kafanız karışabilir. Bu, sizin beceriksiz olduğunuz anlamına gelmez — ekosistem geniş. Adım adım gideceğiz: önce kavramlar, sonra <code>kubectl</code>, sonra YAML, sonra servisler. Docker bölümlerinde olduğu gibi her adımı terminalde deneyeceksiniz.
</div>

<h2>Öğrenmek İçin Küme Kurmak: Minikube ve kind</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Minikube, kind, k3s — kısaca</div>
    Gerçek bulut kümesi kurmadan bilgisayarınızda Kubernetes denemek için:
    <ul>
        <li><strong>Minikube</strong>: Laptop'ta tek sunuculuk mini küme — en yaygın öğrenme aracı.</li>
        <li><strong>kind</strong> (<em>Kubernetes in Docker</em>): Küme node'larını Docker konteyneri olarak çalıştırır.</li>
        <li><strong>k3s</strong>: Hafif Kubernetes — düşük RAM'li makineler veya Raspberry Pi için.</li>
    </ul>
</div>
<p>Gerçek bir bulut kümesi kurmak pahalı ve karmaşık olabilir. Bilgisayarınızda <strong>tek node'luk</strong> bir Kubernetes kümesi çalıştırabilirsiniz:</p>

<table>
    <tr><th>Araç</th><th>Ne yapar?</th><th>Kimler için?</th></tr>
    <tr><td><strong>Minikube</strong></td><td>Laptop'ta tek node K8s kümesi</td><td>En popüler başlangıç aracı</td></tr>
    <tr><td><strong>kind</strong></td><td>Docker konteynerlerinin içinde K8s kümesi</td><td>Docker biliyorsanız tanıdık gelir</td></tr>
    <tr><td><strong>k3s</strong></td><td>Hafif, küçük K8s dağıtımı</td><td>Edge, Raspberry Pi, düşük RAM</td></tr>
    <tr><td><strong>Docker Desktop K8s</strong></td><td>Mac/Windows'ta tek tıkla K8s</td><td>Desktop kullanıcıları</td></tr>
</table>

<p>Bu eğitimde örnekler <strong>Minikube</strong> ve <strong>kubectl</strong> üzerinden gidecek. Sonraki bölümde kurulum adım adım anlatılacak.</p>

<h2>Managed Kubernetes: Bulutta Hazır Küme</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Managed (yönetilen) küme</div>
    <strong>Control plane</strong> (API, etcd, scheduler) bulut sağlayıcı tarafından işletilir — siz sadece uygulamalarınızı deploy edersiniz. <strong>GKE/EKS/AKS</strong> = Google/AWS/Microsoft'un yönetilen Kubernetes hizmetleri.
</div>
<p>Control plane'i siz kurmak zorunda değilsiniz. Bulut sağlayıcıları "managed Kubernetes" sunar:</p>

<ul>
    <li><strong>GKE</strong> (Google Kubernetes Engine) — Kubernetes'in doğduğu şirket</li>
    <li><strong>EKS</strong> (Amazon Elastic Kubernetes Service)</li>
    <li><strong>AKS</strong> (Azure Kubernetes Service)</li>
</ul>

<p>Onlar control plane'i yönetir; siz worker node'ları ve uygulamalarınızı yönetirsiniz. Öğrenme aşamasında Minikube yeterli; iş hayatında managed K8s çok yaygındır.</p>

<h2>Docker Compose vs Kubernetes — Hızlı Karşılaştırma</h2>
<div class="info-box note">
    <div class="info-box-title">📌 HPA ve cluster autoscaler</div>
    <ul>
        <li><strong>HPA</strong> (Horizontal Pod Autoscaler): CPU veya bellek yükselince pod sayısını otomatik artırır — "yoğunluk arttı, 3 pod yerine 10 pod çalışsın".</li>
        <li><strong>Cluster autoscaler</strong>: Kümede yeterli sunucu yoksa buluttan yeni sunucu (node) ekler — HPA pod ister, autoscaler makine sağlar.</li>
    </ul>
</div>

<table>
    <tr><th>Özellik</th><th>Docker Compose</th><th>Kubernetes</th></tr>
    <tr><td>Kapsam</td><td>Genelde tek makine</td><td>Çok makineli küme</td></tr>
    <tr><td>Ölçekleme</td><td>Manuel (<code>scale</code> sınırlı)</td><td>Otomatik (HPA, cluster autoscaler)</td></tr>
    <tr><td>Self-healing</td><td><code>restart: always</code> (sınırlı)</td><td>Pod ölürse yeniden oluşturur</td></tr>
    <tr><td>Güncelleme</td><td>Manuel yeniden deploy</td><td>Rolling update, rollback</td></tr>
    <tr><td>Öğrenme eğrisi</td><td>Düşük</td><td>Yüksek</td></tr>
    <tr><td>YAML dosyası</td><td>docker-compose.yml</td><td>deployment.yaml, service.yaml, ...</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 İyi Haber: YAML ve Konteyner Alışkanlığınız Transfer Olur</div>
    Docker Compose'da servis tanımlamayı öğrendiyseniz, Kubernetes manifestlerinde de "hangi imaj, hangi port, hangi ortam değişkeni" benzer sorular sorarsınız. Fark, Kubernetes'in <strong>daha fazla kavram</strong> (pod, service, ingress, configmap...) ve <strong>daha fazla güç</strong> sunmasıdır.
</div>

<h2>İlk Bakış: kubectl ile Merhaba Dünya</h2>
<p>Minikube kurulu olduğunu varsayarak (sonraki bölümde detaylı kuracağız) şu komutları göreceksiniz:</p>

<div class="code-block">
    <div class="code-block-header"><span>İlk Kubernetes deneyimi (önizleme)</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">cluster-info</span>
<span class="output">Kubernetes control plane is running at https://...</span>

<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">create deployment hello --image=nginx</span>
<span class="output">deployment.apps/hello created</span>

<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get pods</span>
<span class="output">NAME                    READY   STATUS    RESTARTS   AGE
hello-7d4b8c9f6-xk2m9   1/1     Running   0          12s</span>

<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">delete deployment hello</span>
<span class="output">deployment.apps "hello" deleted</span></code></pre>
</div>

<p>Burada Docker'daki <code>docker run nginx</code> yerine <strong>deployment</strong> oluşturduk. Kubernetes arka planda pod'u yarattı. Sonraki bölümde her komutu tek tek, adım adım açacağız.</p>

<h2>Özet — Bu Bölümde Öğrendikleriniz</h2>
<ul>
    <li><strong>Kubernetes</strong> konteyner orkestrasyon platformudur; Docker'ın yerine geçmez, üstüne oturur.</li>
    <li><strong>Cluster</strong> = tüm sistem; <strong>node</strong> = makine; <strong>pod</strong> = en küçük çalışma birimi.</li>
    <li><strong>Control plane</strong> karar verir; <strong>worker node</strong>'lar pod'ları çalıştırır.</li>
    <li><strong>Deployment</strong> pod sayısını ve güncellemeleri yönetir.</li>
    <li><strong>Service</strong> pod'lara sabit ağ erişimi sağlar.</li>
    <li>Öğrenmek için <strong>Minikube</strong> veya <strong>kind</strong> kullanın.</li>
</ul>

<p>Bir sonraki bölümde <code>kubectl</code> komutlarını Docker bölümündeki gibi adım adım, terminalde deneyerek öğreneceğiz.</p>
`,
    quiz: [
        {
            question: "Kubernetes temel olarak ne problemi çözer?",
            options: [
                "Konteyner imajı oluşturmayı",
                "Çok sayıda konteyneri otomatik yönetmeyi",
                "Linux kernel kaynak kodunu derlemeyi",
                "Veritabanı sorgularını hızlandırmayı"
            ],
            correct: 1,
            explanation: "Kubernetes orkestrasyon platformudur: pod'ları dağıtır, ölçekler, ölen pod'ları yeniden oluşturur, güncellemeleri yönetir. İmaj oluşturmak Docker/build işidir."
        },
        {
            question: "Kubernetes'te en küçük çalıştırılabilir birim nedir?",
            options: [
                "Node",
                "Cluster",
                "Pod",
                "Deployment"
            ],
            correct: 2,
            explanation: "Pod, bir veya daha fazla konteyneri bir arada tutan en küçük birimdir. Deployment pod'ları yönetir; node fiziksel/VM makinedir."
        },
        {
            question: "Control plane'in görevi nedir?",
            options: [
                "Pod içindeki uygulama kodunu çalıştırmak",
                "Kümenin karar merkezi olmak",
                "Sadece log dosyalarını saklamak",
                "Docker imajlarını derlemek"
            ],
            correct: 1,
            explanation: "Control plane (API server, scheduler, controller manager, etcd) kümenin beynidir. Worker node'lardaki kubelet ise pod'ları gerçekten çalıştırır."
        },
        {
            question: "Deployment kullanmamızın ana nedeni nedir?",
            options: [
                "Pod sayısını ve güncellemeleri yönetmek",
                "DNS kayıtlarını silmek",
                "Sadece tek pod oluşturmak",
                "Kubernetes'i kaldırmak"
            ],
            correct: 0,
            explanation: "Deployment, istenen replica sayısını korur, rolling update ve rollback sağlar. Üretimde pod'ları doğrudan değil Deployment ile yönetirsiniz."
        },
        {
            question: "Service neden gereklidir?",
            options: [
                "Pod IP'leri değişebileceği için sabit erişim",
                "CPU hızını iki katına çıkarmak için",
                "Imaj boyutunu küçültmek için",
                "Namespace oluşturmak için"
            ],
            correct: 0,
            explanation: "Pod'lar geçicidir ve IP'leri değişir. Service, pod grubuna sabit DNS/IP ve yük dengeleme sağlar."
        },
        {
            question: "kubectl ne işe yarar?",
            options: [
                "Kubernetes kümesiyle konuşan CLI aracı",
                "Sadece Docker imajı build eden araç",
                "Windows için paket yöneticisi",
                "Veritabanı yedekleme programı"
            ],
            correct: 0,
            explanation: "kubectl (kube control), Kubernetes API'sine istek gönderen komut satırı aracıdır. get, apply, delete, logs gibi alt komutları vardır."
        },
        {
            question: "Öğrenme için laptop'ta K8s kümesi kurmak için hangisi uygundur?",
            options: [
                "Minikube veya kind",
                "Sadece Microsoft Word",
                "Wireshark",
                "fdisk"
            ],
            correct: 0,
            explanation: "Minikube ve kind, geliştiricilerin kendi bilgisayarında tek node'luk Kubernetes kümesi çalıştırmasını sağlar."
        },
        {
            question: "Kubernetes ile Docker arasındaki ilişki doğru olan hangisidir?",
            options: [
                "Kubernetes Docker'ın yerine geçer, imaj kullanılmaz",
                "Kubernetes konteynerleri yönetir, imajlar hâlâ kullanılır",
                "Docker olmadan Kubernetes çalışamaz, aynı şeydir",
                "Kubernetes sadece Windows'ta çalışır"
            ],
            correct: 1,
            explanation: "Kubernetes konteyner orkestrasyonu yapar; imaj formatı Docker/OCI standartlarındadır. Runtime genelde containerd/CRI-O olur ama imajlar tanıdıktır."
        },
        {
            question: "Namespace'in amacı nedir?",
            options: [
                "Küme içinde kaynakları mantıksal ayırmak",
                "Pod'ların CPU hızını artırmak",
                "Imaj registry'si oluşturmak",
                "Worker node eklemek"
            ],
            correct: 0,
            explanation: "Namespace, aynı kümede dev/staging/prod gibi ortamları veya ekipleri birbirinden ayırır. kubectl -n ile hedeflenir."
        },
        {
            question: "Desired state (istenen durum) felsefesi ne demektir?",
            options: [
                "Sistemin istenen hâli tanımlanır, K8s onu korur",
                "Her komut elle pod başlatılır",
                "Sadece bir kez deploy edilir, değişmez",
                "Tüm pod'lar manuel silinir"
            ],
            correct: 0,
            explanation: "Declarative yaklaşımda '3 replica NGINX olsun' dersiniz; pod ölse bile controller manager tekrar 3'e tamamlar."
        }
    ]
});
