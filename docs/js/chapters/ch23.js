// ===== Bölüm 23: Docker — Felsefe ve Temel Kavramlar =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 23,
    title: 'Docker: Felsefe ve Temel Kavramlar',
    subtitle: 'What is Docker & Why It Matters',
    icon: '🐳',
    description: 'Docker nedir, neden çıktı, hangi problemi çözüyor? Konteyner, imaj, registry kavramları; sanal makineler ile farkı ve kurulum.',
    content: `
<h2>Ama Benim Makinemde Çalışıyordu...</h2>
<p>Bir yazılımcının hayatındaki en meşhur cümlelerden biri: <em>"It works on my machine!"</em> — <strong>"Benim makinemde çalışıyordu!"</strong> Siz bir program yazarsınız, kendi bilgisayarınızda sorunsuz çalışır. Ama arkadaşınıza gönderirsiniz, onun bilgisayarında çalışmaz. Sunucuya yüklersiniz, orada başka bir hata verir. Neden?</p>

<p>Çünkü bir program tek başına yaşamaz. Çalışmak için <strong>bir sürü şeye</strong> ihtiyaç duyar:</p>
<ul>
    <li>Belirli bir işletim sistemi (Ubuntu 22.04, CentOS 8, Windows 10 vs.)</li>
    <li>Belirli sürümlerde kütüphaneler (<code>libssl 1.1</code>, <code>glibc 2.35</code>, vs.)</li>
    <li>Belirli sürümde bir programlama dili çalışma ortamı (<code>Python 3.11</code>, <code>Node 18</code>, <code>Java 17</code>...)</li>
    <li>Sistem paketleri (<code>ffmpeg</code>, <code>imagemagick</code>, <code>postgresql-client</code>...)</li>
    <li>Ortam değişkenleri (<code>DATABASE_URL</code>, <code>API_KEY</code>...)</li>
    <li>Açık portlar, dosya izinleri, çalışan arka plan servisleri...</li>
</ul>

<p>İki makine arasındaki en ufak fark — mesela biri Python 3.10, diğeri Python 3.11 — programınızın çalışmamasına neden olabilir. Bir geliştirici ekip olarak bunu herkes için tek tek ayarlamak saatler, belki günler alır. <strong>Docker</strong>, işte tam olarak bu problemi çözmek için doğdu.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Docker'ın Tek Cümlelik Tanımı</div>
    Docker, bir uygulamayı <strong>kendi tüm bağımlılıklarıyla birlikte</strong> taşınabilir bir paket haline getirmenizi ve bu paketi <strong>herhangi bir makinede aynı şekilde</strong> çalıştırmanızı sağlayan araçtır. Yani "benim makinemde çalışıyordu" derdinin sonu.
</div>

<h2>Konteyner (Container) Nedir?</h2>
<p>Docker'ın temel kavramı <strong>konteyner</strong>dır. İsim boşuna seçilmedi: gerçek dünyadaki nakliye konteynerlerinden esinleniliyor.</p>

<p>1950'lerden önce nakliyat tam bir kaostu. Her gemi, her liman, her kamyon farklı boyutlarda kutular taşıyordu. Malzemeler yüklenirken ve indirilirken saatlerce el işçiliği gerekiyordu. Sonra birisi düşündü: "Ya herkes aynı boyutta standart bir kutu kullansa?" <strong>Standart nakliye konteynerleri</strong> doğdu. Artık bir konteyneri gemiden indirip doğrudan bir trene ya da kamyona bindirmek mümkündü. İçindeki mal ne olursa olsun — muz, televizyon, kitap — dışarıdan <strong>aynı kutu</strong> görünüyordu.</p>

<p>Docker konteynerleri de aynı mantık üzerine kurulu: içinde ne olursa olsun (Python uygulaması, PostgreSQL, NGINX, Redis...) dışarıdan <strong>aynı şekilde</strong> çalıştırılır, durdurulur, taşınır.</p>

<div class="eng-box">
    <div class="eng-title">🔤 Temel Terimler</div>
    <div class="eng-content">
        <span class="eng-word">Container</span> = <span class="eng-meaning">Konteyner</span> — İçinde uygulamanın ve bağımlılıklarının çalıştığı izole edilmiş ortam. "Çalışan" bir şey.<br>
        <span class="eng-word">Image</span> = <span class="eng-meaning">İmaj / Kalıp</span> — Konteyneri oluşturmak için kullanılan şablon (template). "Durağan" bir şey.<br>
        <span class="eng-word">Registry</span> = <span class="eng-meaning">Kayıt Deposu</span> — İmajların saklandığı yer (ör. Docker Hub). "GitHub ama imajlar için."<br>
        <span class="eng-word">Engine</span> = <span class="eng-meaning">Motor</span> — Konteynerleri çalıştıran çekirdek yazılım (Docker Engine / <code>dockerd</code>).<br>
        <span class="eng-word">Dockerfile</span> = <span class="eng-meaning">Docker Tarifi</span> — İmajın nasıl oluşturulacağını adım adım anlatan metin dosyası.<br>
        <span class="eng-word">Volume</span> = <span class="eng-meaning">Hacim / Disk</span> — Konteyner silinse bile veriyi kalıcı saklayan disk alanı.<br>
        <span class="eng-word">Port Mapping</span> = <span class="eng-meaning">Port Eşleme</span> — Konteynerin içindeki portu dış dünyaya açma işlemi.<br>
        <span class="eng-word">Host</span> = <span class="eng-meaning">Ana Makine</span> — Docker'ın üzerinde çalıştığı gerçek bilgisayar/sunucu.
    </div>
</div>

<h2>İmaj (Image) ve Konteyner (Container) Farkı</h2>
<p>Yeni başlayanların en çok karıştırdığı iki kavram budur. Anlamak için bir benzetme kullanalım:</p>

<div class="info-box note">
    <div class="info-box-title">📌 Yemek Tarifi vs. Yemek</div>
    <ul>
        <li><strong>İmaj</strong> = Yemek <strong>tarifi</strong> (kağıt üzerinde, statik, değişmez)</li>
        <li><strong>Konteyner</strong> = O tarifi uyguladığınızda ortaya çıkan <strong>gerçek yemek</strong> (tabakta, yenebilir, bozulabilir)</li>
    </ul>
    Aynı tariften istediğiniz kadar tabak çıkarabilirsiniz. Aynı imajdan da istediğiniz kadar konteyner oluşturabilirsiniz. Tabaklar birbirinden bağımsızdır, biri tükense diğeri devam eder. Bir tabağı yediğinizde tarif kaybolmaz.
</div>

<p>Teknik olarak:</p>
<ul>
    <li><strong>İmaj</strong>: Salt-okunur (read-only), dondurulmuş bir dosya sistemidir. İçinde işletim sisteminin bir parçası, uygulama dosyalarınız, bağımlılıklar ve varsayılan çalıştırma komutu bulunur. Bir imaj birçok <strong>katmandan (layer)</strong> oluşur.</li>
    <li><strong>Konteyner</strong>: Bir imajdan türetilmiş <strong>çalışan</strong> bir örnek. Üzerine yazılabilir bir katman eklenmiş, kendi süreçlerine, kendi ağına ve kendi dosya sistemine sahiptir. Aynı imajdan 10 konteyner başlatabilirsiniz; her biri birbirinden bağımsızdır.</li>
</ul>

<div class="code-block">
    <div class="code-block-header"><span>Kavramlar arasındaki ilişki</span></div>
    <pre><code><span class="comment"># Bir imajdan → N tane konteyner çıkarabilirsiniz</span>

   Dockerfile  ──(docker build)──&gt;  İMAJ  ──(docker run)──&gt;  KONTEYNER 1
                                      │                        KONTEYNER 2
                                      │                        KONTEYNER 3
                                      ▼
                              Registry (Docker Hub)
                           (docker push / docker pull)

<span class="comment"># Özet: Tarif (Dockerfile) -> Şablon (Image) -> Çalışan kopya (Container)</span></code></pre>
</div>

<h2>Neden "Virtual Machine" Değil?</h2>
<p>Docker'dan önce "bir uygulamayı izole ortamda çalıştırmak" denildiğinde akla <strong>sanal makineler (VM — Virtual Machine)</strong> gelirdi. VirtualBox, VMware, Hyper-V gibi araçlarla bir bilgisayarın içinde <em>başka bir bilgisayar</em> çalıştırırdınız. Peki Docker ile farkı ne?</p>

<div class="code-block">
    <div class="code-block-header"><span>Sanal Makine vs. Konteyner mimarisi</span></div>
    <pre><code><span class="comment"># SANAL MAKİNE (VM)</span>                    <span class="comment"># KONTEYNER (Docker)</span>
┌─────────────────────┐                ┌─────────────────────┐
│  App A  │  App B    │                │  App A  │  App B    │
│─────────┼───────────│                │─────────┼───────────│
│  Libs   │  Libs     │                │  Libs   │  Libs     │
│─────────┼───────────│                │─────────┴───────────│
│ Guest OS│ Guest OS  │                │  Docker Engine      │
│─────────┴───────────│                │─────────────────────│
│      Hypervisor     │                │    Host OS (Linux)  │
│─────────────────────│                │─────────────────────│
│    Host OS          │                │     Hardware        │
│─────────────────────│                └─────────────────────┘
│     Hardware        │                <span class="comment"># İnce! Hızlı başlar, az yer kaplar</span>
└─────────────────────┘
<span class="comment"># Kalın! Her uygulama için tam bir OS</span></code></pre>
</div>

<p>Kritik fark: <strong>Konteynerler ayrı bir işletim sistemi içermez.</strong> Host makinenin çekirdeğini (Linux kernel) paylaşırlar. Bu nedenle:</p>

<table>
    <tr><th>Özellik</th><th>Sanal Makine</th><th>Konteyner</th></tr>
    <tr><td>Boyut</td><td>GB'larca (tam bir OS)</td><td>MB'lar (sadece uygulama)</td></tr>
    <tr><td>Başlatma süresi</td><td>Dakikalar</td><td>Saniyeler, hatta milisaniyeler</td></tr>
    <tr><td>Bellek kullanımı</td><td>Yüksek (her biri ayrı OS)</td><td>Düşük (kernel paylaşımı)</td></tr>
    <tr><td>İzolasyon</td><td>Tam (ayrı kernel)</td><td>Orta (kernel paylaşımı, <em>namespace</em>'ler)</td></tr>
    <tr><td>Performans kaybı</td><td>%5-15</td><td>Neredeyse 0 (native hıza yakın)</td></tr>
    <tr><td>Bir makinede kaç tane?</td><td>5-10 adet</td><td>Yüzlerce, binlerce adet</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Docker Sihir Değildir — Linux Çekirdeği Sihirli</div>
    Docker aslında Linux çekirdeğinin zaten var olan iki özelliğini kullanır:
    <ul>
        <li><strong>Namespaces</strong>: Her konteynerin kendi süreç listesi (PID namespace), kendi ağ arabirimleri (network namespace), kendi dosya sistemi görünümü (mount namespace) gibi izole kaynakları olmasını sağlar. Konteynerdeki "PID 1" süreci, hostta başka bir PID'dir ve hostu göremez.</li>
        <li><strong>Control Groups (cgroups)</strong>: Konteynerin kullanabileceği CPU, bellek, disk I/O miktarını sınırlar. "Bu konteyner en fazla 512 MB RAM kullanabilir" gibi kurallar koyar.</li>
    </ul>
    Docker bu Linux özelliklerini kolay kullanılır hale getiren bir <em>araç</em>tır. Linux olmayan sistemlerde (Windows/macOS) Docker aslında arka planda küçük bir Linux VM çalıştırır.
</div>

<h2>Docker Ne İşe Yarar? — Gerçek Dünya Senaryoları</h2>

<h3>1. Geliştirme Ortamı Kurmak</h3>
<p>Bir yeni projeye başladınız. Projede PostgreSQL 15, Redis 7 ve belirli bir Python paketi listesi gerekiyor. Normalde ne yaparsınız?</p>
<ul>
    <li>PostgreSQL kur, yapılandır, servisini başlat.</li>
    <li>Redis kur, başlat.</li>
    <li>Python ortamı hazırla, bağımlılıkları indir.</li>
    <li>Versiyon çakışmalarını çöz ("zaten makinemde başka bir Postgres vardı!").</li>
</ul>
<p>Docker ile: <code>docker compose up</code> — hepsi hazır. Kurulum bozulursa silip yeniden başlatmak 10 saniye.</p>

<h3>2. Üretim Ortamına Aynı Şekilde Taşımak</h3>
<p>Geliştirici "ben Ubuntu 22.04 kullanıyorum, her şey çalışıyor" der. Sunucu ise CentOS 7'dir. Uygulama sunucuda çalışmaz. Docker ile imajı geliştiricinin makinesinden aynen sunucuya gönderirsiniz — aradaki OS farkı önemsizleşir çünkü uygulama zaten kendi ortamını taşıyor.</p>

<h3>3. Mikroservis Mimarisi</h3>

<p>Bu konu ilk duyduğunuzda kulağa hoş gelir ama biraz açıklamadan anlaşılmaz. Önce <strong>tersini</strong> tanıyalım.</p>

<p><strong>Monolit (tek parça) uygulama:</strong> Eski yöntem. Tüm kodlar tek bir devasa projede yaşar: kullanıcı girişi, ödeme, e-posta gönderme, raporlama, arama... hepsi aynı kod tabanında, aynı süreçte. Banka uygulamanızı düşünün — her şey "Banka App" denen bir devasa kutuda.</p>

<p>Bu küçük takımlar ve küçük uygulamalar için iyi çalışır. Ama uygulama büyüdükçe sorunlar başlar:</p>
<ul>
    <li><strong>Küçük değişiklik = büyük risk</strong>: E-posta servisindeki minik bir hata, ödeme akışını da çökertebilir çünkü hepsi aynı süreçte.</li>
    <li><strong>Bir parça yavaşlatınca her şey yavaşlar</strong>: Raporlama modülü yoğunlaşınca, giriş ekranı da yavaşlar.</li>
    <li><strong>Tek dilde sıkışırsınız</strong>: Tüm uygulama Java ise, "şu kısımda Python daha iyi olur" diyemezsiniz.</li>
    <li><strong>Deploy = nükleer seviye iş</strong>: Tek satır değişse bile koca uygulamayı yeniden başlatmak zorundasınız.</li>
</ul>

<p><strong>Mikroservis yaklaşımı:</strong> Bu devasa uygulamayı <strong>küçük, bağımsız servislere</strong> bölmek. Her servis tek bir iş yapar ve diğerleriyle ağ üzerinden (HTTP API, gRPC, mesaj kuyruğu) konuşur. Tipik bir e-ticaret sitesinde:</p>

<div class="code-block">
    <div class="code-block-header"><span>Bir e-ticaret sitesindeki mikroservisler</span></div>
    <pre><code>┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ auth-service │    │ user-service │    │catalog-service│
│ (giriş/kayıt)│    │ (profil)     │    │ (ürün listesi)│
│  Python      │    │  Node.js     │    │  Go          │
└──────────────┘    └──────────────┘    └──────────────┘
       │                  │                    │
       └──────────┬───────┴────────────┬───────┘
                  │                    │
       ┌──────────▼─────────┐  ┌───────▼───────────┐
       │  payment-service   │  │  email-service    │
       │  (ödeme alma)      │  │  (bildirim atma)  │
       │  Java              │  │  Python           │
       └────────────────────┘  └───────────────────┘</code></pre>
</div>

<p>Avantajları:</p>
<ul>
    <li><strong>Bağımsız geliştirme:</strong> Ödeme ekibi bir takım, e-posta ekibi başka bir takım. Birbirinin koduna karışmazlar.</li>
    <li><strong>Bağımsız ölçekleme:</strong> Black Friday'de catalog-service'in 50 kopyası, email-service'in 2 kopyası çalışsın diyebilirsiniz. Her servisi kendine yetecek kadar büyütürsünüz.</li>
    <li><strong>Bağımsız deploy:</strong> E-posta şablonu güncelleyeceksiniz? Sadece email-service'i yeniden başlatın. Site ayakta kalır.</li>
    <li><strong>Dil özgürlüğü:</strong> Her servis kendi diline yazılabilir. Ödeme Java, arama Go, web Node.js olabilir.</li>
    <li><strong>Hatalar yayılmaz:</strong> Email-service çökse bile kullanıcı yine giriş yapıp alışveriş edebilir.</li>
</ul>

<p><strong>Docker'ın buradaki rolü:</strong> Her servisi kendi konteynerine koymak doğal bir uyum. Sonra <strong>orkestrasyon</strong> araçları (Kubernetes, Docker Swarm) bu konteynerleri yönetir: hangisi ölmüş, hangisi yeniden başlatılmalı, hangisi 5 kopyaya çıksın, vb.</p>

<p>Netflix, Spotify, Airbnb, Amazon — hepsi yüzlerce, hatta binlerce mikroservisten oluşur. Netflix'in açıklamasına göre 1000+ mikroservisi vardır ve binlerce makinede konteyner olarak çalışır.</p>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Mikroservis Her Derde Deva Değildir</div>
    Küçük bir uygulama yazıyorsanız mikroservis mimarisi <strong>aşırıdır</strong>. Ağ gecikmesi, dağıtık sistem karmaşıklığı, deployment maliyeti devreye girer. "Monolit ile başla, gerekince böl" tavsiyesi yaygındır. Mikroservis büyük ekipler ve büyük ürünler için bir araçtır, otomatik olarak "daha iyi" değildir.
</div>

<h3>4. CI/CD (Sürekli Entegrasyon / Sürekli Teslimat)</h3>

<p>Önce <strong>problemi</strong> anlayalım: bir geliştirici kodu kendi makinesinde yazar. Test eder. Çalışır. Sonra ne olur?</p>

<ol>
    <li>Başka bir geliştirici de kendi kod parçasını yazmıştır. İkisinin kodu birleştirilmelidir.</li>
    <li>Birleşen kodun bozulmadığından emin olunmalı — yani <strong>testler</strong> tekrar çalıştırılmalı.</li>
    <li>Tüm testler geçtiyse, bu kod sunucuya yüklenmeli (deploy).</li>
    <li>Yarın yeni bir değişiklik gelir; aynı süreç baştan başlar.</li>
</ol>

<p>Bu adımları her seferinde elle yapmak — testleri manuel çalıştır, FTP ile dosya yükle, sunucuyu yeniden başlat — yorucu, yavaş ve hata yapmaya açıktır. <strong>CI/CD</strong> bu süreci tamamen otomatikleştirir.</p>

<div class="info-box note">
    <div class="info-box-title">📌 İki Terim — Aynı Aile</div>
    <ul>
        <li><strong>CI — Continuous Integration (Sürekli Entegrasyon)</strong>: Her geliştirici kod yazınca, otomatik olarak testler çalışır. Hata varsa anında bildirim gelir. Amaç: "kod tabanı her an çalışır halde olsun".</li>
        <li><strong>CD — Continuous Delivery / Deployment (Sürekli Teslimat)</strong>: Testler geçince, kod otomatik olarak (tek tıkla veya hemen) üretim sunucusuna gider. Amaç: "değişiklik birkaç dakikada kullanıcının elinde olsun".</li>
    </ul>
    <p>İkisi birlikte "CI/CD pipeline" denir — kodun yazıldığı andan üretime kadar geçtiği otomatik boru hattı.</p>
</div>

<p>Popüler CI/CD platformları: <strong>GitHub Actions</strong>, <strong>GitLab CI</strong>, <strong>Jenkins</strong>, <strong>CircleCI</strong>, <strong>Bitbucket Pipelines</strong>. Hepsi benzer mantıkla çalışır: bir <code>.yml</code> dosyasında "ne olacak" yazarsınız, Git'e push'larsınız, sistem otomatik koşturur.</p>

<div class="code-block">
    <div class="code-block-header"><span>Tipik bir CI/CD akışı</span></div>
    <pre><code>1. Geliştirici "git push" yapar
        │
        ▼
2. GitHub Actions tetiklenir
        │
        ▼
3. ✨ Temiz bir Docker konteyneri başlatılır (Ubuntu + Python 3.12)
        │
        ▼
4. Kod konteynerin içine kopyalanır
        │
        ▼
5. Bağımlılıklar kurulur (pip install ...)
        │
        ▼
6. Testler çalışır (pytest ...)
        │
        ▼
7. Hepsi geçti mi?
   ├── HAYIR → 📧 Geliştiriciye bildirim, kırmızı X işareti
   └── EVET  → 🎉 Yeşil tik
        │
        ▼
8. (CD kısmı) İmaj build edilir, Docker Hub'a push'lanır
        │
        ▼
9. Üretim sunucusunda yeni imaj çekilir, konteyner yeniden başlar
        │
        ▼
10. Yeni özellik kullanıcıların elinde — push'tan ~3 dakika sonra!</code></pre>
</div>

<p><strong>Docker'ın bu süreçteki sihirli rolü:</strong> Her CI çalıştırması <strong>tertemiz</strong> bir konteynerde başlar. Bu çok kritik:</p>
<ul>
    <li><strong>Eski testler kalıntı bırakmaz</strong>: Önceki bir testin yarattığı dosya sonraki testi yanıltamaz. Konteyner her seferinde sıfırdan.</li>
    <li><strong>Geliştiricinin makinesi alakasız</strong>: Test, geliştiricinin "exotic" yapılandırmasında değil, "saf" bir ortamda koşar. "Benim makinemde çalışıyordu" sorununun tam tersi: "CI'da çalışıyorsa kesin çalışıyor".</li>
    <li><strong>Birden fazla test paralel</strong>: 10 farklı geliştirici aynı anda push yaparsa, 10 ayrı konteynerde paralel testler koşar. Birbirlerini etkilemezler — konteynerler kardeşler ama izole.</li>
    <li><strong>Farklı ortamları aynı anda test</strong>: Aynı kod Python 3.10, 3.11, 3.12'de paralel test edilebilir — 3 ayrı imaj, 3 ayrı konteyner.</li>
</ul>

<p>Bugün hemen hemen tüm modern yazılım ekipleri CI/CD kullanıyor. Kariyerinizde GitHub'da iş ararken iş ilanlarında "GitHub Actions tecrübesi" veya "CI/CD pipeline kurmuş" diye sıkça göreceksiniz — Docker bu işin temelidir.</p>

<h3>5. Eski Yazılımları Çalıştırmak</h3>
<p>10 yıl önce yazılmış, Python 2.7 ve eski bir kütüphane gerektiren bir scriptiniz var. Modern Ubuntu'da kurulumu imkansıza yakın. Docker ile Python 2.7 imajında saniyeler içinde çalıştırırsınız.</p>

<h3>6. Tek Komutla Yazılım Denemek</h3>
<p>Wordpress'i veya yeni çıkan bir veritabanını denemek istiyorsunuz. Kurulumuyla uğraşmadan: <code>docker run wordpress</code> — bir dakika içinde çalışır durumda. Beğenmediniz, konteyneri silerseniz hiçbir iz kalmaz.</p>

<h2>Docker'ın Kısa Tarihi</h2>
<p>Docker 2013'te <strong>Solomon Hykes</strong> tarafından dotCloud isimli bir platform-as-a-service şirketinde geliştirildi. Başlangıçta Linux'un <em>LXC</em> (Linux Containers) adlı özelliğinin üzerine kurulmuştu. 2013'te açık kaynak olarak yayınlandı ve o kadar popüler oldu ki şirket adını "Docker, Inc." olarak değiştirdi.</p>

<p>Docker, konteyner teknolojisini icat etmedi — Linux'ta namespaces ve cgroups çok daha eskiydi, Google gibi şirketler yıllardır iç projelerde konteyner kullanıyordu. Docker'ın başarısı bu teknolojileri <strong>herkesin kullanabileceği kadar kolay</strong> bir arayüzle birleştirmesinden geldi. Bugün konteyner standartlarını OCI (Open Container Initiative) yönetir; Docker'dan farklı çalıştırıcılar da vardır (Podman, containerd, CRI-O), ama hepsi aynı standartları izler.</p>

<h2>Docker'ın Bileşenleri</h2>

<div class="code-block">
    <div class="code-block-header"><span>Docker mimarisi</span></div>
    <pre><code>┌──────────────────────────────────────────────────────────┐
│                    SENİN MAKİNEN                          │
│                                                           │
│  [ docker CLI ]  ←→  [ Docker Engine (dockerd) ]          │
│  (senin yazdığın           │                              │
│   komutlar)                ├──→ Konteynerler çalıştırır   │
│                            ├──→ İmajları yönetir          │
│                            └──→ Ağ ve volume yönetir      │
│                                                           │
└──────────────────────────────┬────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Docker Hub /       │
                    │   Registry           │
                    │   (uzaktaki imaj     │
                    │    deposu)           │
                    └──────────────────────┘</code></pre>
</div>

<ul>
    <li><strong>Docker Daemon (<code>dockerd</code>)</strong>: Arka planda çalışan servistir. Asıl işi yapan o — konteynerleri oluşturur, başlatır, durdurur.</li>
    <li><strong>Docker CLI (<code>docker</code> komutu)</strong>: Sizin terminalde yazdığınız komutlar. Bu komutlar aslında daemon'a istek göndererek çalışır. CLI ve daemon aynı makinede olmak zorunda değildir!</li>
    <li><strong>Docker Hub</strong>: <a href="https://hub.docker.com" target="_blank" rel="noopener">hub.docker.com</a> — Docker'ın resmi genel imaj deposu. Buradan Ubuntu, Python, NGINX, MySQL gibi binlerce hazır imajı indirebilirsiniz. GitHub gibi düşünün ama kod yerine imajlar için.</li>
    <li><strong>Dockerfile</strong>: Bir imajın nasıl yapılacağını anlatan tarif dosyası (sonraki bölümde detaylı).</li>
    <li><strong>Docker Compose</strong>: Birden fazla konteyneri birlikte yönetmek için araç. Tek bir YAML dosyasıyla "10 konteynerli uygulamanı" ayağa kaldırabilirsin.</li>
</ul>

<h2>Docker'ı Kurma</h2>

<h3>Linux (Ubuntu/Debian)</h3>
<div class="code-block">
    <div class="code-block-header"><span>Ubuntu'da Docker Engine kurulumu</span></div>
    <pre><code><span class="comment"># Eski sürümleri temizle:</span>
<span class="prompt">$</span> <span class="command">sudo apt remove</span> <span class="argument">docker docker-engine docker.io containerd runc</span>

<span class="comment"># Gerekli paketleri kur:</span>
<span class="prompt">$</span> <span class="command">sudo apt update</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> <span class="argument">ca-certificates curl gnupg lsb-release</span>

<span class="comment"># Docker'ın resmi GPG anahtarını ekle:</span>
<span class="prompt">$</span> <span class="command">sudo install</span> <span class="flag">-m 0755 -d</span> <span class="argument">/etc/apt/keyrings</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-fsSL</span> <span class="argument">https://download.docker.com/linux/ubuntu/gpg</span> <span class="operator">|</span> \\
    <span class="command">sudo gpg</span> <span class="flag">--dearmor -o</span> <span class="path">/etc/apt/keyrings/docker.gpg</span>

<span class="comment"># Docker deposunu ekle:</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"</span> \\
    <span class="operator">|</span> <span class="command">sudo tee</span> <span class="path">/etc/apt/sources.list.d/docker.list</span>

<span class="comment"># Docker Engine'i kur:</span>
<span class="prompt">$</span> <span class="command">sudo apt update</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> <span class="argument">docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin</span>

<span class="comment"># Kurulumu doğrula:</span>
<span class="prompt">$</span> <span class="command">sudo docker</span> <span class="argument">run hello-world</span>
<span class="output">Hello from Docker! 🎉</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 "sudo" Yazmadan Docker Kullanmak</div>
    Docker daemon root yetkisi ile çalışır. Normal kullanıcıyı <code>docker</code> grubuna eklerseniz <code>sudo</code> yazmadan komut çalıştırabilirsiniz:
    <pre><code><span class="prompt">$</span> <span class="command">sudo usermod</span> <span class="flag">-aG</span> <span class="argument">docker $USER</span>
<span class="prompt">$</span> <span class="command">newgrp</span> <span class="argument">docker</span>   <span class="comment"># veya oturumu kapatıp açın</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">run hello-world</span>   <span class="comment"># artık sudo gerekmez</span></code></pre>
    <strong>Güvenlik notu:</strong> docker grubu aslında root yetkisine denktir (bir konteynerle hostun diskine erişmek mümkün). Dikkatli olun.
</div>

<h3>macOS ve Windows</h3>
<p>macOS ve Windows için <strong>Docker Desktop</strong> uygulamasını indirin: <a href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener">docker.com/products/docker-desktop</a>. Bu uygulama arka planda küçük bir Linux VM başlatır ve tüm araçları (CLI, Compose, Kubernetes) bir arayüzde toplar. Windows'ta WSL2 (Windows Subsystem for Linux 2) gerektirir.</p>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Docker Desktop Lisansı</div>
    Docker Desktop büyük şirketlerde (>250 çalışan veya >10M$ gelir) <strong>ücretli</strong>dir. Kişisel ve küçük ekip kullanımında ücretsizdir. Ticari bir alternatif isterseniz <a href="https://podman.io/" target="_blank" rel="noopener">Podman</a> veya <a href="https://rancherdesktop.io/" target="_blank" rel="noopener">Rancher Desktop</a> tamamen açık kaynak ve ücretsizdir. Linux kullanıyorsanız Docker Engine'i doğrudan kurarsınız, Desktop'a ihtiyacınız yoktur.
</div>

<h2>İlk Konteynerinizi Çalıştırın</h2>
<p>Teoriyi anladık. Şimdi pratikte göreceğiz. En sevdiğim ilk örnek:</p>

<div class="code-block">
    <div class="code-block-header"><span>Bir satırda NGINX web sunucusu</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker</span> <span class="argument">run -d -p 8080:80 --name websunucu nginx</span>

<span class="comment"># Ne oldu?
# 1. Docker, "nginx" imajını yerelde arıyor. Yoksa Docker Hub'dan indiriyor.
# 2. İmajdan bir konteyner oluşturuyor, adını "websunucu" koyuyor.
# 3. -d (detached) sayesinde arka planda çalıştırıyor.
# 4. -p 8080:80: Konteynerdeki 80 portunu, hostun 8080 portuna bağlıyor.
# Şimdi tarayıcıda http://localhost:8080 adresine gidin!</span>

<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">ps</span>              <span class="comment"># Çalışan konteynerleri listele</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">stop websunucu</span>  <span class="comment"># Durdur</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">rm websunucu</span>    <span class="comment"># Konteyneri sil</span></code></pre>
</div>

<p>Üç satırda bir web sunucunuz var. Bir sonraki bölümde bu komutların her birini tek tek açıklayacağız. Ama önce neden <code>8080:80</code> yazdık? Port da ne?</p>

<h2>Port Kavramı — "Otel Oda Numarası Gibi"</h2>
<p>Daha önce ağ kavramlarıyla tanışmadıysanız <strong>port</strong> kavramı kafanızı karıştırabilir. Basitçe:</p>

<div class="info-box note">
    <div class="info-box-title">📌 Port Nedir?</div>
    <p>Bir bilgisayarın IP adresi düşünün onun <strong>sokak adresi</strong>. Ama aynı adreste bir apartmanda birçok daire olabilir. <strong>Port</strong>, "hangi dairedeyim"in karşılığıdır. Bir bilgisayarda aynı anda birçok farklı servis çalışabilir:</p>
    <ul>
        <li><strong>Port 80</strong> — HTTP (web)</li>
        <li><strong>Port 443</strong> — HTTPS (güvenli web)</li>
        <li><strong>Port 22</strong> — SSH</li>
        <li><strong>Port 5432</strong> — PostgreSQL</li>
        <li><strong>Port 3306</strong> — MySQL</li>
        <li><strong>Port 6379</strong> — Redis</li>
        <li><strong>Port 27017</strong> — MongoDB</li>
    </ul>
    <p>Portlar 0-65535 arasındadır. 0-1023 arası "well-known" (bilinen) portlardır; bunları dinlemek root yetkisi ister. 1024-49151 "registered", 49152-65535 "ephemeral" (geçici) portlardır. Uygulamalarınızda genelde 8080, 3000, 5000, 8000 gibi yüksek portlar kullanırsınız — çünkü root olmadan kullanabilirsiniz.</p>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Makinenizde dinlenen portları görün</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">ss</span> <span class="flag">-tlnp</span>
<span class="comment"># -t: TCP, -l: dinleyen, -n: rakamsal, -p: süreç
# Kim hangi portu açmış hepsini görürsünüz.</span>

<span class="prompt">$</span> <span class="command">sudo lsof</span> <span class="flag">-i</span> <span class="argument">:8080</span>
<span class="comment"># 8080 portunu kim kullanıyor?</span></code></pre>
</div>

<p>Docker'da <code>-p 8080:80</code> yazdığınızda demek istediğiniz şudur: "Ey Docker, benim makinemin 8080 portuna gelen istekleri, konteynerin içindeki 80 portuna yönlendir." Sol taraf her zaman <strong>host</strong> (sizin makineniz), sağ taraf <strong>konteyner</strong>. Sonraki bölümde ağ konusunu çok daha detaylı işleyeceğiz.</p>

<h2>Docker'ın Genel Akışı</h2>
<p>İleride yapacağınız işleri bir haritada toplayalım:</p>

<div class="code-block">
    <div class="code-block-header"><span>Tipik bir Docker iş akışı</span></div>
    <pre><code><span class="comment">┌──────────┐   docker build   ┌──────┐   docker run   ┌───────────┐
│Dockerfile├─────────────────&gt;│İmaj  ├───────────────&gt;│Konteyner  │
└──────────┘                  └──┬───┘                └─────┬─────┘
                                 │                          │
                                 │ docker push              │ docker stop/rm
                                 ▼                          ▼
                           ┌───────────┐              (konteyner silinir,
                           │Docker Hub │               imaj yerinde kalır)
                           └───────────┘
</span></code></pre>
</div>

<h2>Özet ve Sonraki Bölüme Hazırlık</h2>
<ul>
    <li><strong>Konteyner</strong>: Uygulamanın ve tüm bağımlılıklarının birlikte paketlendiği izole çalışan ortam.</li>
    <li><strong>İmaj</strong>: Konteyneri oluşturmak için kullanılan durağan tarif/şablon.</li>
    <li><strong>Docker</strong>, "benim makinemde çalışıyor" problemini çözer: uygulama her yerde <em>aynı</em> çalışır.</li>
    <li>Konteynerler sanal makinelerden <strong>çok daha hafif</strong>tir çünkü host'un kernel'ini paylaşırlar.</li>
    <li><strong>Docker Hub</strong>, hazır imajları indirebileceğiniz büyük bir depodur.</li>
    <li><strong>Port</strong>, aynı makinedeki farklı servisleri ayırt etmeye yarayan "oda numarasıdır".</li>
</ul>
<p>Sonraki bölümde Docker komutlarını tek tek öğreneceğiz: <code>docker run</code>, <code>ps</code>, <code>logs</code>, <code>exec</code>, <code>volume</code>, <code>network</code>... ve ağ köprüsü (bridge) gibi kavramlara gireceğiz.</p>
`,
    quiz: [
        {
            question: "Docker'ın çözdüğü temel problem nedir?",
            options: [
                "Programlama dillerinin yavaşlığı",
                "\"Benim makinemde çalışıyor\" problemi — uygulamanın farklı ortamlarda farklı davranması",
                "İnternet bağlantısının yavaşlığı",
                "Klavye ve fare problemleri"
            ],
            correct: 1,
            explanation: "Docker, bir uygulamayı tüm bağımlılıklarıyla birlikte paketleyerek, hangi makinede çalıştırıldığından bağımsız olarak aynı şekilde çalışmasını sağlar. Böylece geliştirici, test ve üretim ortamları arasındaki farklar ortadan kalkar."
        },
        {
            question: "İmaj (image) ve konteyner (container) arasındaki fark nedir?",
            options: [
                "Aynı şeylerdir, sadece farklı isimler",
                "İmaj salt-okunur şablondur, konteyner ise o şablondan türetilmiş çalışan örnektir",
                "İmaj küçük, konteyner büyüktür",
                "Konteyner disk, imaj RAM'de yaşar"
            ],
            correct: 1,
            explanation: "İmaj tarif, konteyner tabağa konmuş yemektir. Bir imajdan N tane konteyner türetebilirsiniz. İmaj salt-okunur, konteyner ise üzerine yazılabilir kendi katmanına sahiptir."
        },
        {
            question: "Docker konteynerleri sanal makinelerden neden daha hafiftir?",
            options: [
                "Daha az kod içerirler",
                "Host makinenin çekirdeğini (kernel) paylaşırlar; her biri için ayrı bir işletim sistemi gerekmez",
                "Disk sıkıştırması kullanırlar",
                "İnternetten her seferinde indirilirler"
            ],
            correct: 1,
            explanation: "VM'ler her biri için ayrı bir Guest OS içerir (GB'larca yer). Konteynerler ise hostun kernel'ini paylaşır; içlerinde sadece uygulama ve minimal bağımlılıklar bulunur. Bu sayede saniyeler içinde başlar ve MB'larca yer kaplar."
        },
        {
            question: "\"Registry\" (kayıt deposu) ne anlama gelir?",
            options: [
                "Çalışan konteynerlerin listesi",
                "İmajların saklandığı, paylaşıldığı uzak depo (örn. Docker Hub)",
                "Bilgisayarın dosya sistemi kaydı",
                "Ağ yapılandırma dosyası"
            ],
            correct: 1,
            explanation: "Registry, imajların depolandığı ve paylaşıldığı yerdir. Docker Hub en popüler genel registry'dir. GitHub Container Registry, AWS ECR, GitLab Registry gibi özel registry'ler de vardır."
        },
        {
            question: "Bir portun (port) işlevi nedir?",
            options: [
                "Bilgisayarın fiziksel USB girişi",
                "Aynı makinedeki farklı ağ servislerini ayırt eden numara (\"oda numarası\")",
                "Disk bölümü",
                "Ekran çözünürlüğü"
            ],
            correct: 1,
            explanation: "Port, bir bilgisayardaki ağ trafiğini farklı servislere yönlendirmek için kullanılan 0-65535 arası bir numaradır. Örn. 80 HTTP, 443 HTTPS, 22 SSH. IP adresi sokak adresi ise, port daire numarasıdır."
        },
        {
            question: "docker run -p 8080:80 nginx komutunda \"-p 8080:80\" ne anlama gelir?",
            options: [
                "Konteynerin 8080 portunu hostun 80 portuna bağla",
                "Hostun 8080 portuna gelen istekleri konteynerin 80 portuna yönlendir",
                "Hem konteyner hem host 8080+80=8160 portunu kullansın",
                "Sadece 80 portu açılır, 8080 örnektir"
            ],
            correct: 1,
            explanation: "Format HOST:CONTAINER şeklindedir. Soldaki port dışarıda (host), sağdaki port içeride (konteyner) dinlenir. Tarayıcıda localhost:8080 yazdığınızda istek, konteynerin 80'ine gider."
        },
        {
            question: "Docker'ın arka planda kullandığı Linux çekirdeği özellikleri nelerdir?",
            options: [
                "Sadece systemd",
                "Namespaces ve cgroups — izolasyon ve kaynak sınırlama için",
                "Bash ve zsh",
                "X11 ve Wayland"
            ],
            correct: 1,
            explanation: "Docker sihir değildir. Namespaces, her konteynerin kendi süreç listesi / ağ / dosya sistemi görüntüsüne sahip olmasını sağlar. cgroups, konteynerin ne kadar CPU/RAM kullanabileceğini sınırlar. Docker bu Linux özelliklerini kullanımı kolay hale getirir."
        },
        {
            question: "Dockerfile nedir?",
            options: [
                "Çalışan konteynerlerin listesi",
                "Bir imajın nasıl oluşturulacağını adım adım tarif eden metin dosyası",
                "Docker kurulum dosyası",
                "Docker'ın log dosyası"
            ],
            correct: 1,
            explanation: "Dockerfile, \"önce Ubuntu imajını al, sonra Python kur, sonra kodumu kopyala, son olarak şu komutu çalıştır\" gibi adımları yazdığımız bir tarif dosyasıdır. docker build ile bu tariften imaj üretilir."
        },
        {
            question: "Aşağıdakilerden hangisi Docker'ın kullanım alanı DEĞİLDİR?",
            options: [
                "Geliştirme ortamı kurulumunu kolaylaştırmak",
                "Mikroservis mimarilerinde her servisi ayrı çalıştırmak",
                "Bilgisayarınızın tüm donanımını üzerinden fiziksel olarak değiştirmek",
                "CI/CD sistemlerinde test ortamı oluşturmak"
            ],
            correct: 2,
            explanation: "Docker bir yazılım çözümüdür; donanımı değiştiremez. Ama geliştirme, test, üretim ortamı standartlaştırma, mikroservisler, CI/CD gibi pek çok senaryoda güçlüdür."
        }
    ]
});
