// ===== Bölüm 29: Docker Komutları — Adım Adım Yolculuk =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 29,
    title: 'Docker Komutları — Adım Adım',
    subtitle: 'Docker CLI: Step by Step',
    icon: '⚓',
    description: 'Önce imaj indirin, sonra çalıştırın, sonra içine girin... Docker komutlarını kolaydan zora doğru, resmi dokümantasyonun izlediği yolla öğrenin.',
    content: `
<h2>Bu Bölümün Mantığı</h2>
<p>Docker'ın resmi dokümantasyonu sizi tek bir komut patlamasıyla bombardımana tutmaz. Aksine, her şey küçük adımlarla ilerler: önce bir imaj indirirsiniz, sonra onu çalıştırırsınız, sonra durumunu gözlemlersiniz, sonra içine girersiniz... Biz de aynı yolu izleyeceğiz.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Bu Bölümü Nasıl Okumalısınız?</div>
    Her adımı terminalinizde <strong>gerçekten yazın</strong>. Okuyup geçmeyin. Docker'ın sihri kendi ellerinizle yazdığınızda anlamlanır. Tüm örnekler kopyala-yapıştır yapılıp anında çalışacak şekilde hazırlandı.
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Bu Bölümün Yol Haritası</div>
    <ol>
        <li><strong>Adım 0–5</strong>: Docker'ın hayatta olduğunu doğrulayıp ilk konteyneri çalıştırma.</li>
        <li><strong>Adım 6–9</strong>: Konteynerleri arka planda çalıştırma, yönetme (start/stop/rm).</li>
        <li><strong>Adım 10–11</strong>: Konteyneri dışarıyla bağlama: portlar ve ortam değişkenleri.</li>
        <li><strong>Adım 12</strong>: <strong>Volumes</strong> — veriyi konteyner silinse de tutmak.</li>
        <li><strong>Adım 13</strong>: <strong>Networks</strong> — konteynerlerin birbiriyle konuşması (Redis + NGINX örneği).</li>
        <li><strong>Adım 14–17</strong>: İzleme, dosya transferi, kaynak sınırları, temizlik.</li>
        <li><strong>Mini Proje</strong>: Tüm bunları tek bir uygulamada birleştirme.</li>
    </ol>
    <p>"Veri" (volume) ve "ağ" (network) bölümlerine gelmeden önce yukarıdaki <strong>büyük resim</strong> kutusuna bakın — <code>-p</code> ile <code>--network</code> ayrımı orada özetlenir.</p>
</div>

<h2>Adım 0: Docker Çalışıyor mu?</h2>
<p>Kaymadan önce koşmaya çalışmayalım. Önce Docker'ın hayatta olduğundan emin olalım.</p>

<div class="code-block">
    <div class="code-block-header"><span>Sürüm ve durum kontrolü</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker</span> <span class="flag">--version</span>
<span class="output">Docker version 24.0.7, build afdd53b</span>

<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">info</span>
<span class="comment"># Uzun bir rapor: kaç konteyner çalışıyor, imaj sayısı,
# Docker'ın hangi sürücüleri kullandığı, vs.</span>

<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">run hello-world</span>
<span class="output">Hello from Docker!
This message shows that your installation appears to be working correctly.</span></code></pre>
</div>

<p><code>hello-world</code> çıktısı görebildiyseniz, Docker sağlıklı çalışıyor demektir. "Cannot connect to the Docker daemon" hatası alıyorsanız Docker servisi başlatılmamıştır:</p>

<pre><code><span class="prompt">$</span> <span class="command">sudo systemctl start docker</span>
<span class="prompt">$</span> <span class="command">sudo systemctl status docker</span></code></pre>

<h2>Adım 1: Bir İmaj İndirelim — <code>docker pull</code></h2>
<p>Docker'ın sevgili terimi: <strong>imaj</strong>. Her konteyner bir imajdan türer. İlk işimiz, kullanmak istediğimiz imajı Docker Hub'dan kendi makinemize indirmek.</p>

<p>Başlangıç olarak en küçük ve en meşhur Linux dağıtımlarından <strong>Alpine</strong>'ı seçelim (sadece ~5 MB):</p>

<div class="code-block">
    <div class="code-block-header"><span>İmaj indirme</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker pull</span> <span class="argument">alpine</span>
<span class="output">Using default tag: latest
latest: Pulling from library/alpine
c926b61bad3b: Pull complete
Digest: sha256:51b67269f354137895d43f3b3d810bfacd3945438e94dc5ac55fdac340352f48
Status: Downloaded newer image for alpine:latest
docker.io/library/alpine:latest</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Ne Oldu?</div>
    <ol>
        <li>Docker, <code>alpine</code> imajını yerelde arıyor. Bulamıyor.</li>
        <li>Varsayılan registry olan Docker Hub'a (<code>docker.io</code>) sorup soruyor.</li>
        <li>Tag vermediğimiz için varsayılan olarak <code>latest</code>'i alıyor.</li>
        <li>İmajı yerel önbelleğe indiriyor — artık sizin makinenizde.</li>
    </ol>
    Bir daha aynı imajı çağırdığınızda indirmez; önbellekten anında kullanır.
</div>

<p>Belirli bir sürüm istiyorsanız <strong>tag</strong> ekleyin:</p>
<div class="code-block">
    <div class="code-block-header"><span>Belirli sürüm ve farklı imajlar</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker pull</span> <span class="argument">alpine:3.19</span>         <span class="comment"># Belirli sürüm</span>
<span class="prompt">$</span> <span class="command">docker pull</span> <span class="argument">ubuntu:22.04</span>
<span class="prompt">$</span> <span class="command">docker pull</span> <span class="argument">python:3.12-slim</span>
<span class="prompt">$</span> <span class="command">docker pull</span> <span class="argument">nginx</span>                <span class="comment"># tag yoksa "latest"</span></code></pre>
</div>

<h2>Adım 2: İndirdiğimiz İmajları Görelim — <code>docker images</code></h2>
<p>Yerelde hangi imajlar var?</p>

<div class="code-block">
    <div class="code-block-header"><span>İmaj listesi</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker images</span>
<span class="output">REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
alpine       latest    a606584aa9aa   4 days ago     7.8MB
alpine       3.19      abc123def456   2 weeks ago    7.7MB
ubuntu       22.04     a6d7b24c3555   3 weeks ago    77.8MB
python       3.12-slim 5a2f30d9b5e1   6 days ago     127MB
nginx        latest    605c77e624dd   1 week ago     141MB</code></pre>
</div>

<p>Her satır bir imaj. Önemli sütunlar:</p>
<ul>
    <li><strong>REPOSITORY</strong>: İmajın ismi (ör. <code>alpine</code>).</li>
    <li><strong>TAG</strong>: Versiyonu (ör. <code>3.19</code>, <code>latest</code>).</li>
    <li><strong>IMAGE ID</strong>: Hash benzeri benzersiz kimlik.</li>
    <li><strong>SIZE</strong>: Diskte kapladığı yer.</li>
</ul>

<h2>Adım 3: İlk Konteynerimizi Çalıştıralım — <code>docker run</code></h2>
<p>İmaj indi. Şimdi ondan bir konteyner çıkaralım. En basit haliyle:</p>

<div class="code-block">
    <div class="code-block-header"><span>Konteyner içinde tek komut çalıştırmak</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="argument">alpine echo "Merhaba Docker!"</span>
<span class="output">Merhaba Docker!</span></code></pre>
</div>

<p>Saniyeden kısa sürede şu olaylar gerçekleşti:</p>
<ol>
    <li>Docker, <code>alpine</code> imajından yeni bir konteyner oluşturdu.</li>
    <li>Konteynerin içinde <code>echo "Merhaba Docker!"</code> komutunu çalıştırdı.</li>
    <li>Çıktı terminalinize geldi.</li>
    <li>Komut bitince konteyner durdu. (Ama silinmedi — göreceğiz.)</li>
</ol>

<div class="info-box tip">
    <div class="info-box-title">💡 Konteynerin "Ömrü" Neye Bağlı?</div>
    Konteyner, içindeki <strong>ana süreç</strong> yaşadığı sürece yaşar. <code>echo</code> hemen bittiği için konteyner de hemen durdu. <code>nginx</code> gibi sonsuza kadar dinleyen bir süreç başlatırsanız konteyner ayakta kalır.
</div>

<h2>Adım 4: Konteynerin İçine Girelim — Etkileşimli Mod</h2>
<p>Konteyneri bir Linux sisteminde gezmek ister gibi kullanmak istiyor musunuz? <code>-it</code> bayraklarıyla interaktif shell açın:</p>

<div class="code-block">
    <div class="code-block-header"><span>Alpine konteynerinin içinde shell</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-it</span> <span class="argument">alpine sh</span>

<span class="comment"># Konteynerin içindesiniz!</span>
<span class="output">/ #</span> <span class="command">cat</span> <span class="argument">/etc/os-release</span>
<span class="output">NAME="Alpine Linux"
VERSION_ID=3.19.0
...</span>

<span class="output">/ #</span> <span class="command">hostname</span>
<span class="output">a1b2c3d4e5f6</span>       <span class="comment"># Konteynerin kendi hostname'i</span>

<span class="output">/ #</span> <span class="command">ls</span>
<span class="output">bin dev etc home lib media mnt opt proc root run sbin srv sys tmp usr var</span>

<span class="output">/ #</span> <span class="command">exit</span>                 <span class="comment"># Shell'den çık — konteyner durur</span>
<span class="prompt">$</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 <code>-it</code> Ne Demek?</div>
    <ul>
        <li><strong>-i</strong> (interactive): Standart girdiyi (stdin) açık tut. Klavyeden yazdıklarımız konteynere gitsin.</li>
        <li><strong>-t</strong> (tty): Sanal bir terminal aç. Böylece prompt, cursor hareketleri, renkler düzgün çalışır.</li>
    </ul>
    İkisini <code>-it</code> olarak birleştirmek yaygın kısaltmadır.
</div>

<p>Bash seven misiniz? Ubuntu imajı <code>bash</code>'i hazır getirir:</p>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-it</span> <span class="argument">ubuntu bash</span>
<span class="output">root@b2c3d4e5f6a7:/#</span></code></pre>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Alpine'da <code>bash</code> Yoktur</div>
    Alpine minimal bir Linux'tur, varsayılan shell'i <code>sh</code>'dir. <code>docker run -it alpine bash</code> yazarsanız "executable not found" hatası alırsınız. Ya <code>sh</code> kullanın ya da <code>docker exec -it ad apk add bash</code> ile kurun.
</div>

<h2>Adım 5: Şu An Ne Var Ne Yok? — <code>docker ps</code></h2>
<p>Bir konteyner başlattık, sonra çıktık. Ne oldu ona? İki komut kritik:</p>

<div class="code-block">
    <div class="code-block-header"><span>Çalışanlar ve tümü</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker ps</span>
<span class="output">CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES</span>
<span class="comment"># Boş! Çalışan konteyner yok.</span>

<span class="prompt">$</span> <span class="command">docker ps</span> <span class="flag">-a</span>
<span class="output">CONTAINER ID   IMAGE    COMMAND                 CREATED          STATUS                     PORTS   NAMES
b2c3d4e5f6a7   ubuntu   "bash"                  2 minutes ago    Exited (0) 2 minutes ago           sharp_wiles
a1b2c3d4e5f6   alpine   "sh"                    5 minutes ago    Exited (0) 4 minutes ago           jovial_curie
f9e8d7c6b5a4   alpine   "echo 'Merhaba D...'"   8 minutes ago    Exited (0) 8 minutes ago           modest_yalow</span></code></pre>
</div>

<p>İlginç noktalar:</p>
<ul>
    <li>Oluşturduğumuz her konteyner hâlâ yaşıyor — sadece <strong>durmuş</strong> (Exited).</li>
    <li>İsim vermediysek Docker kendiliğinden eğlenceli isimler üretir (<code>sharp_wiles</code>, <code>jovial_curie</code>).</li>
    <li><strong>Exited (0)</strong>: Başarılı çıkış. 0'dan farklı sayı hata demektir.</li>
</ul>

<h2>Adım 6: İsim Verelim ve Arka Planda Çalıştıralım</h2>
<p>Gerçek senaryolarda konteynerler uzun süre ayakta durur (web sunucu, veritabanı...). Onları <strong>arka planda</strong> başlatırız. Ve terminalin ürettiği rastgele isimler yerine <strong>kendi isimlerimizi</strong> veririz.</p>

<div class="code-block">
    <div class="code-block-header"><span>NGINX'i arka planda başlat</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name</span> <span class="argument">websunucu nginx</span>
<span class="output">8f7e6d5c4b3a...(uzun ID)</span>

<span class="prompt">$</span> <span class="command">docker ps</span>
<span class="output">CONTAINER ID   IMAGE   COMMAND                  STATUS         PORTS     NAMES
8f7e6d5c4b3a   nginx   "/docker-entrypoint.…"   Up 10 seconds  80/tcp    websunucu</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Yeni Bayrakları Tanıyalım</div>
    <ul>
        <li><strong>-d</strong> (detached): Konteyner arka planda çalışsın, terminalim bloke olmasın.</li>
        <li><strong>--name</strong>: Konteynere anlamlı bir isim ver. Sonradan "websunucu" diyerek ona ulaşırız.</li>
    </ul>
</div>

<p>NGINX çalışıyor... ama web sitesine nasıl bakacağız? <code>PORTS</code> sütununda <code>80/tcp</code> yazıyor ama bunu tarayıcıdan açamayız çünkü port <em>host'a</em> açılmadı. Bir sonraki adımda çözeceğiz — önce görmek istediğimiz şeyler olsun.</p>

<h2>Adım 7: Konteynerin Logları — <code>docker logs</code></h2>
<p>NGINX arka planda çalışıyor. Ne yaptığını görmek istiyoruz. Konteynerin standart çıktısı (<code>stdout</code>/<code>stderr</code>) <code>docker logs</code> ile okunur:</p>

<div class="code-block">
    <div class="code-block-header"><span>Log okuma varyasyonları</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker logs</span> <span class="argument">websunucu</span>
<span class="output">/docker-entrypoint.sh: Configuration complete; ready for start up
...</span>

<span class="comment"># -f: follow, canlı takip (tail -f gibi)</span>
<span class="prompt">$</span> <span class="command">docker logs</span> <span class="flag">-f</span> <span class="argument">websunucu</span>
<span class="comment"># Ctrl+C ile çık</span>

<span class="comment"># Son 20 satır:</span>
<span class="prompt">$</span> <span class="command">docker logs</span> <span class="flag">--tail 20</span> <span class="argument">websunucu</span>

<span class="comment"># Son 10 dakika:</span>
<span class="prompt">$</span> <span class="command">docker logs</span> <span class="flag">--since 10m</span> <span class="argument">websunucu</span>

<span class="comment"># Sadece hata içerenleri süz:</span>
<span class="prompt">$</span> <span class="command">docker logs</span> <span class="argument">websunucu</span> <span class="operator">2&gt;&amp;1</span> <span class="operator">|</span> <span class="command">grep</span> <span class="flag">-i</span> <span class="argument">error</span></code></pre>
</div>

<h2>Adım 8: Çalışan Konteynere Girelim — <code>docker exec</code></h2>
<p>Arka planda çalışan bir konteynerin <em>içine</em> girip etrafına bakmak istiyorsak? Yeni bir konteyner başlatmıyoruz — zaten çalışan olana bir kapı açıyoruz:</p>

<div class="code-block">
    <div class="code-block-header"><span>Çalışan konteynere shell açmak</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker exec</span> <span class="flag">-it</span> <span class="argument">websunucu bash</span>
<span class="output">root@8f7e6d5c4b3a:/#</span> <span class="command">nginx</span> <span class="flag">-v</span>
<span class="output">nginx version: nginx/1.25.3</span>

<span class="output">root@8f7e6d5c4b3a:/#</span> <span class="command">cat</span> <span class="argument">/etc/nginx/nginx.conf</span>
<span class="comment"># Konfigürasyon dosyasını görürsünüz</span>

<span class="output">root@8f7e6d5c4b3a:/#</span> <span class="command">ls</span> <span class="argument">/usr/share/nginx/html</span>
<span class="output">50x.html  index.html</span>

<span class="output">root@8f7e6d5c4b3a:/#</span> <span class="command">exit</span>
<span class="prompt">$</span>           <span class="comment"># Çıktık ama websunucu hâlâ çalışıyor!</span></code></pre>
</div>

<p><code>docker run</code> ile <code>docker exec</code> farkını unutmayın:</p>
<table>
    <tr><th>Komut</th><th>Ne Yapar</th></tr>
    <tr><td><code>docker run imaj ...</code></td><td>İmajdan <strong>yeni</strong> konteyner oluşturup içinde komut çalıştırır.</td></tr>
    <tr><td><code>docker exec konteyner ...</code></td><td><strong>Zaten çalışan</strong> bir konteynerde ek komut çalıştırır.</td></tr>
</table>

<p>Konteyner içinde tek komut çalıştırmak için <code>-it</code>'ye gerek yok:</p>
<pre><code><span class="prompt">$</span> <span class="command">docker exec</span> <span class="argument">websunucu ls /etc/nginx</span>
<span class="prompt">$</span> <span class="command">docker exec</span> <span class="argument">websunucu date</span></code></pre>

<h2>Adım 9: Durdur, Yeniden Başlat, Sil</h2>
<p>Konteynerleri yönetmek — bir evcil hayvan gibi:</p>

<div class="code-block">
    <div class="code-block-header"><span>Yaşam döngüsü komutları</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker stop</span> <span class="argument">websunucu</span>
<span class="comment"># Nazikçe durdur — önce SIGTERM (kendini kapat sinyali),
# 10 saniye sonra SIGKILL (zorla öldür).</span>

<span class="prompt">$</span> <span class="command">docker ps</span>
<span class="comment"># websunucu artık listede yok</span>

<span class="prompt">$</span> <span class="command">docker ps</span> <span class="flag">-a</span>
<span class="comment"># Ama "Exited" durumda duruyor — silmedik, sadece durdurduk.</span>

<span class="prompt">$</span> <span class="command">docker start</span> <span class="argument">websunucu</span>
<span class="comment"># Yeniden canlandır (aynı konteyner, aynı ayarlar)</span>

<span class="prompt">$</span> <span class="command">docker restart</span> <span class="argument">websunucu</span>
<span class="comment"># stop + start birleşik</span>

<span class="prompt">$</span> <span class="command">docker stop</span> <span class="argument">websunucu</span>
<span class="prompt">$</span> <span class="command">docker rm</span> <span class="argument">websunucu</span>
<span class="comment"># Silindi. docker ps -a'da artık görünmez.</span>

<span class="comment"># Kısayol: çalışırken zorla sil</span>
<span class="prompt">$</span> <span class="command">docker rm</span> <span class="flag">-f</span> <span class="argument">websunucu</span>

<span class="comment"># Tüm duran konteynerleri toplu sil:</span>
<span class="prompt">$</span> <span class="command">docker container prune</span></code></pre>
</div>

<h2>Docker Ağı — Önce Büyük Resim</h2>
<div class="info-box tip">
    <div class="info-box-title">💡 Port (-p) ile network (--network) karışmasın</div>
    Docker'da ağ konusunu zorlaştıran şey genelde <strong>iki farklı sorunun birbirine karışmasıdır</strong>:
    <ol style="margin:0.5em 0;padding-left:1.2em">
        <li><strong>Dışarıdan erişim:</strong> Tarayıcı bilgisayarımdaki NGINX'e nasıl ulaşır? → <code>-p</code></li>
        <li><strong>Konteynerler arası:</strong> Web uygulaması Redis'e nasıl ulaşır? → <code>--network</code></li>
    </ol>
    Aşağıdaki şemayı aklınızda tutun; Adım 10 ve Adım 13 bu modele oturur.
</div>

<div class="code-block">
    <div class="code-block-header"><span>3 katman — apartman metaforu</span></div>
    <pre><code>  Dış dünya (internet, tarayıcı)
         │
         │  -p 8080:80  ← "Apartman kapısından 8080 numaralı daireye yönlendir"
         ▼
  ┌────────────────────────────────────── HOST (sizin bilgisayarınız)
  │  localhost:8080
  │
  │  ┌──────────── docker network (sanal site / LAN) ────────────┐
  │  │                                                           │
  │  │   ┌─────────┐      hostname "redis"      ┌─────────┐     │
  │  │   │  web    │ ────────────────────────► │  redis  │     │
  │  │   │ :80     │      --network ile        │ :6379   │     │
  │  │   └─────────┘      aynı ağda            └─────────┘     │
  │  │                                                           │
  │  └───────────────────────────────────────────────────────────┘
  └──────────────────────────────────────

<span class="comment"># Özet:</span>
<span class="comment"># -p        → Host ↔ Konteyner (dış kapı)</span>
<span class="comment"># --network → Konteyner ↔ Konteyner (iç iletişim)</span></code></pre>
</div>

<table>
    <tr><th>Soru</th><th>Çözüm</th><th>Örnek</th></tr>
    <tr><td>Tarayıcı sitesi açsın</td><td><code>-p HOST:KONTEYNER</code></td><td><code>-p 8080:80</code></td></tr>
    <tr><td>Web, Redis'e bağlansın</td><td>Aynı <code>--network</code></td><td><code>host=redis</code></td></tr>
    <tr><td>Redis internete kapalı kalsın</td><td><code>-p</code> verme</td><td>Sadece <code>--network</code></td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Terimler — kısa sözlük</div>
    <strong>Host</strong> = Docker'ın çalıştığı gerçek makine (sizin PC/sunucu).<br>
    <strong>Bridge</strong> = Konteynerleri birbirine bağlayan sanal anahtar (switch gibi düşünün).<br>
    <strong>docker0</strong> = Docker'ın kurulumla oluşturduğu varsayılan bridge — ama isimle adresleme zayıf.<br>
    <strong>User-defined network</strong> = Sizin <code>docker network create</code> ile oluşturduğunuz ağ — <strong>DNS ile isim çözümü</strong> burada devreye girer.<br>
    <strong>NAT</strong> = <code>-p</code> ile port yönlendirme; dışarıdan gelen istek host portuna, oradan konteyner portuna aktarılır.
</div>

<h2>Adım 10: Dışarıdan Erişim — Port Açma (<code>-p</code>)</h2>
<p>NGINX'i başlattık ama tarayıcıdan erişemedik. Neden? Konteyner kendi <strong>izole ağ dünyasında</strong> çalışır; 80 portu sadece o dünyada dinleniyor. Bilgisayarınızdan (host) erişmek için bir <strong>kapı</strong> açmalısınız — bu kapı <code>-p</code> bayrağıdır.</p>

<div class="code-block">
    <div class="code-block-header"><span>Port eşleme</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name</span> <span class="argument">web</span> <span class="flag">-p</span> <span class="argument">8080:80 nginx</span>
<span class="comment">#                              ↑    ↑
#                              │    └─ Konteynerin içindeki port
#                              └───── Hostunuzdaki port</span>

<span class="prompt">$</span> <span class="command">curl</span> <span class="argument">http://localhost:8080</span>
<span class="output">&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;title&gt;Welcome to nginx!&lt;/title&gt;...</span></code></pre>
</div>

<p>Tarayıcınızda <code>http://localhost:8080</code> — NGINX hoş geldin sayfası. İşte Docker'ın gücü: 3 saniyede bir web sunucusu çalıştırıp eriştiniz.</p>

<div class="info-box note">
    <div class="info-box-title">📌 <code>-p HOST:KONTEYNER</code> nasıl okunur?</div>
    <code>-p 8080:80</code> → "Bilgisayarımın (host) <strong>8080</strong> portuna gelen trafiği, konteynerin <strong>80</strong> portuna ilet."<br><br>
    Sokak adresi = IP, daire numarası = port (Bölüm 25). Aynı makinede farklı servisler farklı portlarda dinler:
    <ul style="margin:0.5em 0;padding-left:1.2em">
        <li><strong>80</strong> HTTP · <strong>443</strong> HTTPS · <strong>22</strong> SSH</li>
        <li><strong>5432</strong> PostgreSQL · <strong>6379</strong> Redis</li>
    </ul>
    Host tarafındaki portu (8080) genelde siz seçersiniz; konteyner tarafı (80) imajın nasıl yazıldığına bağlıdır.
</div>

<div class="code-block">
    <div class="code-block-header"><span>Port varyasyonları</span></div>
    <pre><code><span class="comment"># Aynı portu iki tarafta da kullan (yaygın):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">80:80 nginx</span>

<span class="comment"># Birden fazla port:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">80:80</span> <span class="flag">-p</span> <span class="argument">443:443 nginx</span>

<span class="comment"># Sadece localhost'a bağla (dışardan erişim olmasın — güvenli):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">127.0.0.1:5432:5432 postgres</span>

<span class="comment"># Docker rastgele host portu seçsin (host portunu yazmayın):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">80 nginx</span>
<span class="prompt">$</span> <span class="command">docker port</span> <span class="argument">&lt;konteyner&gt;</span>
<span class="output">80/tcp -&gt; 0.0.0.0:49153</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ "Address Already in Use"</div>
    <p><code>docker: Error ... port is already allocated</code> hatası görüyorsanız, hostta o portu başka bir şey zaten kullanıyor demektir. Çözüm:</p>
    <pre><code><span class="prompt">$</span> <span class="command">sudo lsof</span> <span class="flag">-i</span> <span class="argument">:8080</span>      <span class="comment"># Kim kullanıyor?</span>
<span class="prompt">$</span> <span class="command">sudo ss</span> <span class="flag">-tlnp</span> <span class="operator">|</span> <span class="command">grep</span> <span class="argument">:8080</span></code></pre>
    Ya o süreci durdurun ya da farklı bir host portu seçin (<code>-p 8081:80</code> gibi).
</div>

<h2>Adım 11: Ortam Değişkenleri — <code>-e</code></h2>
<p>Çoğu imaj yapılandırmasını <strong>ortam değişkenleriyle</strong> alır. Veritabanı şifresi, portu, modu... Kodda sabit yazmak yerine dışardan veriyoruz.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Ortam Değişkeni Nedir? (Kısa Hatırlatma)</div>
    <p>Programa "etrafından" verilen isim-değer çiftleridir — programa bir not bırakmak gibi: <em>"Şifre şudur"</em>, <em>"Log seviyesi info olsun"</em>. Linux'ta <code>echo $HOME</code>, <code>echo $USER</code> da birer ortam değişkeni okumadır. Aynı imajı farklı ortamlarda (geliştirme/üretim) farklı ayarlarla çalıştırmak için en temiz yoldur.</p>
</div>

<p><strong>Hangi değişkenleri ayarlamam gerek nereden bilirim?</strong> Her resmi Docker imajının Docker Hub sayfasında <em>"Environment Variables"</em> bölümü vardır. Örneğin PostgreSQL imajı <code>POSTGRES_PASSWORD</code>, <code>POSTGRES_USER</code>, <code>POSTGRES_DB</code> değişkenlerini bekler. Bu isimler imaj geliştiricileri tarafından belirlenir, biz keşfederiz. En klasik örnek: PostgreSQL.</p>

<div class="code-block">
    <div class="code-block-header"><span>PostgreSQL'i ortam değişkenleriyle başlat</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d</span> \\
    <span class="flag">--name</span> <span class="argument">pg</span> \\
    <span class="flag">-p</span> <span class="argument">5432:5432</span> \\
    <span class="flag">-e</span> <span class="argument">POSTGRES_PASSWORD=gizli</span> \\
    <span class="flag">-e</span> <span class="argument">POSTGRES_USER=admin</span> \\
    <span class="flag">-e</span> <span class="argument">POSTGRES_DB=uygulama</span> \\
    <span class="argument">postgres:16</span>

<span class="comment"># Konteyner içinden psql'e bağlan:</span>
<span class="prompt">$</span> <span class="command">docker exec</span> <span class="flag">-it</span> <span class="argument">pg psql -U admin -d uygulama</span>
<span class="output">uygulama=#</span> <span class="command">\\l</span>
<span class="output">uygulama=#</span> <span class="command">\\q</span></code></pre>
</div>

<h3>Çok Değişken Varsa: <code>--env-file</code></h3>
<p>Komuta 5-10 tane <code>-e</code> bayrağı yazmak yorucudur. Daha temizi: değişkenleri bir <strong>düz metin dosyasına</strong> koymak. Önce <code>db.env</code> adında bir dosya oluşturalım. Bunu nano, vim ya da herhangi bir metin düzenleyiciyle yapabilirsiniz — örneğin:</p>

<div class="code-block">
    <div class="code-block-header"><span>db.env dosyasını oluşturmak</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">nano</span> <span class="argument">db.env</span>
<span class="comment"># Aşağıdaki üç satırı yazıp Ctrl+O ile kaydet, Ctrl+X ile çık:</span>

POSTGRES_USER=admin
POSTGRES_PASSWORD=gizli
POSTGRES_DB=uygulama</code></pre>
</div>

<p>Format basit: her satırda <code>ANAHTAR=DEGER</code>. Boşluk yok, tırnak yok, satır başına bir tane. Yorum satırı için <code>#</code> kullanılabilir.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Alternatif: Tek Komutla Dosya Yazmak (heredoc)</div>
    <p>Editör açmadan terminalden hızlıca dosya oluşturmak için Bash'in <strong>heredoc</strong> özelliği vardır:</p>
    <pre><code><span class="prompt">$</span> <span class="command">cat</span> <span class="operator">&gt;</span> <span class="path">db.env</span> <span class="operator">&lt;&lt;</span> <span class="string">EOF</span>
POSTGRES_USER=admin
POSTGRES_PASSWORD=gizli
POSTGRES_DB=uygulama
<span class="string">EOF</span></code></pre>
    <p>Bu sözdizimi şunu der: <em>"Aşağıdaki satırları, <code>EOF</code> kelimesini gördüğüm yere kadar oku ve <code>db.env</code> dosyasına yaz."</em></p>
    <ul>
        <li><code>&gt; db.env</code>: çıktıyı bu dosyaya yönlendir (varsa üzerine yaz).</li>
        <li><code>&lt;&lt; EOF</code>: "burada başlıyor, EOF satırı geldiğinde bitir" demek. <em>End Of File</em>'ın kısaltmasıdır ama aslında herhangi bir kelime olabilir (<code>&lt;&lt; SON</code> da olur); kapanış da aynı kelime olmalı.</li>
        <li>Bu, bu eğitimin önceki bölümlerinde gördüğümüz <strong>I/O yönlendirme</strong> mantığının bir uzantısıdır. İlk gördüğünüzde yabancı gelir, ama betik yazarken çok hayat kurtarır.</li>
    </ul>
</div>

<div class="code-block">
    <div class="code-block-header"><span>.env dosyasıyla konteyner başlatmak</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">cat</span> <span class="argument">db.env</span>           <span class="comment"># Dosyayı görmek için</span>
<span class="output">POSTGRES_USER=admin
POSTGRES_PASSWORD=gizli
POSTGRES_DB=uygulama</span>

<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name</span> <span class="argument">pg</span> \\
    <span class="flag">--env-file</span> <span class="argument">db.env</span> \\
    <span class="flag">-p</span> <span class="argument">5432:5432 postgres:16</span>

<span class="comment"># Konteynerin gördüğü tüm env değişkenleri:</span>
<span class="prompt">$</span> <span class="command">docker exec</span> <span class="argument">pg env</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ .env Dosyalarını Git'e Eklemeyin!</div>
    İçinde şifre, API anahtarı gibi sırlar olur. Projenizin <code>.gitignore</code> dosyasına <code>.env</code> ve <code>*.env</code> satırlarını eklemeyi unutmayın. <code>.dockerignore</code>'a da koymanız iyi olur.
</div>

<h2>Adım 12: Veriler Uçmasın! — Volume'ler</h2>
<p>Yukarıdaki PostgreSQL konteynerine bir tablo oluşturup veri ekleyin. Sonra konteyneri silip yeniden oluşturun. Ne oldu? <strong>Her şey gitti.</strong> Çünkü konteynerin içine yazılan veri, konteyner silindiğinde yok olur.</p>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Konteyner Silindiğinde Her Şey Silinir</div>
    Docker konteynerleri varsayılan olarak "uçucu"dur (ephemeral). Veritabanı dosyaları, yüklenen dosyalar, loglar — konteyner rm'lendiğinde hepsi gider. Kalıcı tutmak için <strong>volume</strong> kullanmalısınız.
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Önce Anlamamız Gereken: Konteynerin "Yazılabilir Katmanı"</div>
    <p>İmajlar değişmez (read-only) katmanların yığınıdır. Konteyner çalışırken Docker bu yığının üstüne <strong>yazılabilir bir katman daha</strong> koyar — siz dosya oluşturdukça, veritabanına veri yazdıkça bu üst katmana yazılır.</p>
    <p>Şeffaf folyolar metaforuna dönelim: imajınız 5 sabit folyonun üst üste konulmuş hâli; en üste yenisi konuyor ve değişiklikler oraya işleniyor. Konteyner silindiğinde Docker o üst folyoyu çöpe atar — alttaki imaj sağlam kalır, ama yazdıklarınız gider.</p>
    <p>Volume'ler tam burada devreye girer: yazılabilir katmana yazmak yerine, konteyner içindeki belirli bir klasörü <strong>dışarıda, konteynerin ömründen bağımsız bir yere</strong> bağlarız. Konteyner silinse bile o klasördeki veri orada kalır.</p>
</div>

<h3>Üç Mount Tipi — Hangisi Ne İçin?</h3>
<p>Docker'da konteynere "dışarıdan" veri bağlamanın üç yolu vardır. Karıştırılmasın:</p>
<table>
    <tr><th>Tip</th><th>Yer</th><th>Tipik Kullanım</th></tr>
    <tr><td><strong>Named volume</strong></td><td>Docker'ın yönettiği özel bir alan (Linux'ta genelde <code>/var/lib/docker/volumes/</code>)</td><td>Veritabanı verileri, kalıcı uygulama verisi</td></tr>
    <tr><td><strong>Bind mount</strong></td><td>Sizin seçtiğiniz bir host klasörü (örn. <code>/home/ahmet/projem</code>)</td><td>Geliştirme sırasında kod yansıtma, config dosyası verme</td></tr>
    <tr><td><strong>tmpfs mount</strong></td><td>Sadece RAM'de, diske hiç yazılmaz</td><td>Hassas/geçici veri (örn. anahtarlar, cache)</td></tr>
</table>

<h3>Volume — Docker'ın Yönettiği Disk</h3>
<div class="code-block">
    <div class="code-block-header"><span>Named volume ile veri kalıcılığı</span></div>
    <pre><code><span class="comment"># 1) Volume oluştur:</span>
<span class="prompt">$</span> <span class="command">docker volume create</span> <span class="argument">pg-verisi</span>

<span class="comment"># 2) Konteyneri volume'e bağlayarak başlat:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name</span> <span class="argument">pg</span> \\
    <span class="flag">-v</span> <span class="argument">pg-verisi:/var/lib/postgresql/data</span> \\
    <span class="flag">-e</span> <span class="argument">POSTGRES_PASSWORD=gizli</span> \\
    <span class="flag">-p</span> <span class="argument">5432:5432 postgres:16</span>

<span class="comment"># -v KAYNAK:HEDEF
# Sol: volume adı (veya host klasörü)
# Sağ: konteyner içinde nereye bağlanacağı</span>

<span class="comment"># 3) İçine bir şey yazın (psql ile veritabanı yaratın):</span>
<span class="prompt">$</span> <span class="command">docker exec</span> <span class="flag">-it</span> <span class="argument">pg psql -U postgres -c "CREATE DATABASE test;"</span>

<span class="comment"># 4) Konteyneri silin:</span>
<span class="prompt">$</span> <span class="command">docker rm</span> <span class="flag">-f</span> <span class="argument">pg</span>

<span class="comment"># 5) Aynı volume ile yeniden başlatın:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name</span> <span class="argument">pg</span> \\
    <span class="flag">-v</span> <span class="argument">pg-verisi:/var/lib/postgresql/data</span> \\
    <span class="flag">-e</span> <span class="argument">POSTGRES_PASSWORD=gizli</span> \\
    <span class="flag">-p</span> <span class="argument">5432:5432 postgres:16</span>

<span class="prompt">$</span> <span class="command">docker exec</span> <span class="argument">pg psql -U postgres -c "\\l"</span>
<span class="comment"># "test" veritabanı hâlâ orada! Veriler kaybolmadı.</span></code></pre>
</div>

<h3>Bind Mount — Host Klasörü Bağlama</h3>
<p>Volume yerine hosttan bir klasör bağlamak da mümkün — geliştirme sırasında özellikle kullanışlı:</p>
<div class="code-block">
    <div class="code-block-header"><span>Yerel klasörü konteynere yansıt</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">mkdir</span> <span class="argument">site</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">'&lt;h1&gt;Benim sitem!&lt;/h1&gt;'</span> <span class="operator">&gt;</span> <span class="path">site/index.html</span>

<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name</span> <span class="argument">web</span> \\
    <span class="flag">-p</span> <span class="argument">8080:80</span> \\
    <span class="flag">-v</span> <span class="argument">$(pwd)/site:/usr/share/nginx/html</span> \\
    <span class="argument">nginx</span>

<span class="prompt">$</span> <span class="command">curl</span> <span class="argument">http://localhost:8080</span>
<span class="output">&lt;h1&gt;Benim sitem!&lt;/h1&gt;</span>

<span class="comment"># site/index.html'i şimdi düzenleyin — sonuç anında yansır!</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Volume mu, Bind Mount mu? — Hangisini Ne Zaman Seçeyim?</div>
    <ul>
        <li><strong>Veritabanı verisi (Postgres, MySQL, Redis)</strong> → Named volume. Docker yönetir; başka makineye taşınabilir (volume dump alıp aktarabilirsiniz).</li>
        <li><strong>Geliştirme sırasında "kodumu canlı düzenleyip konteynerde göreyim"</strong> → Bind mount. Host klasörü direk konteynere yansır.</li>
        <li><strong>Config dosyası tek dosya halinde vermek</strong> → Bind mount (tek dosya da olabilir): <code>-v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro</code>. Sondaki <code>:ro</code> = read-only.</li>
        <li><strong>Geçici / hassas veri</strong> → tmpfs mount (sadece RAM, hiç diske yazılmaz).</li>
    </ul>
</div>

<h3>Volume'üm Aslında Nerede Yaşıyor?</h3>
<p>Named volume yarattığınızda merak ediyor olabilirsiniz: "Bu dosyalar nerede?" <code>docker volume inspect</code> ile öğrenebilirsiniz:</p>

<div class="code-block">
    <div class="code-block-header"><span>Volume'ün fiziksel adresi</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker volume create</span> <span class="argument">deneme</span>
<span class="prompt">$</span> <span class="command">docker volume inspect</span> <span class="argument">deneme</span>
<span class="output">[
    {
        "CreatedAt": "2026-01-15T10:30:00Z",
        "Driver": "local",
        "Mountpoint": "/var/lib/docker/volumes/deneme/_data",
        "Name": "deneme"
    }
]</span>
<span class="comment"># Linux'ta volume verisi genelde:
# /var/lib/docker/volumes/&lt;volume-adi&gt;/_data
# altında durur. Root yetkisi gerekir görüntülemek için.</span></code></pre>
</div>

<p><strong>Önemli not:</strong> Bu yolu bilmek ilginçtir ama oraya elle dokunmayın — Docker'ın yönetimine bırakın. Volume'leri taşımak için <code>docker run --rm -v eski:/from -v yeni:/to alpine cp -a /from/. /to/</code> gibi temiz yollar var.</p>

<h3>tmpfs Mount — Sadece RAM'de Geçici Veri</h3>
<p>Bazen veriyi <strong>hiç</strong> diske yazmak istemezsiniz: hassas anahtarlar, geçici hesaplama dosyaları, performans kritik cache. <code>--tmpfs</code> ile konteyner içindeki bir klasörü tamamen RAM'de tutarsınız:</p>
<div class="code-block">
    <div class="code-block-header"><span>tmpfs örneği</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name</span> <span class="argument">cache</span> \\
    <span class="flag">--tmpfs</span> <span class="argument">/tmp:size=100m</span> \\
    <span class="argument">nginx</span>
<span class="comment"># Konteyner içindeki /tmp 100 MB'lık bir RAM diski.
# Konteyner durunca her şey buhar olur — kalıcılık YOK.</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Volume yönetim komutları</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker volume ls</span>                      <span class="comment"># Tüm volume'leri listele</span>
<span class="prompt">$</span> <span class="command">docker volume inspect pg-verisi</span>      <span class="comment"># Detay (host'taki yer dahil)</span>
<span class="prompt">$</span> <span class="command">docker volume rm pg-verisi</span>           <span class="comment"># Tek volume'ü sil</span>
<span class="prompt">$</span> <span class="command">docker volume prune</span>                   <span class="comment"># Kimseye bağlı olmayanları toplu sil</span>

<span class="comment"># Bir volume'ün boyutunu görmek (root yetkisi):</span>
<span class="prompt">$</span> <span class="command">sudo du</span> <span class="flag">-sh</span> <span class="argument">/var/lib/docker/volumes/pg-verisi/_data</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Volume Silinmeden Konteyner Silmek "Yetim Volume" Yaratır</div>
    <code>docker rm -f pg</code> dediğinizde sadece konteyner gider, volume hâlâ orada durur. Bu güvenliğiniz için iyidir (yanlışlıkla veritabanı silmezsiniz) ama unutursanız diskte sessizce birikir. Kullanılmadığından emin olduktan sonra <code>docker volume rm</code> ya da <code>docker volume prune</code> ile temizleyin.
</div>

<h2>Adım 13: Konteynerler Birbirini Nasıl Bulur? — <code>--network</code></h2>

<p>Adım 10'da <code>-p</code> ile <strong>dış dünyadan</strong> konteynere kapı açtık. Şimdi tersi senaryo: iki konteyner aynı makinede çalışıyor — web uygulaması Redis'e, API veritabanına bağlanacak. Bunlar için genelde <strong>dışarı port açmaya gerek yok</strong>; sadece aynı Docker ağına koymak yeterli.</p>

<div class="info-box warning">
    <div class="info-box-title">⚠️ En sık yapılan hata</div>
    Redis veya PostgreSQL'i <code>-p 6379:6379</code> ile internete açmak zorunda değilsiniz. Sadece aynı ağdaki web konteyneri bağlanacaksa <code>--network</code> yeterli — ve <strong>daha güvenli</strong>.
</div>

<h3>Bridge (köprü) nedir — sade Türkçe</h3>
<p><strong>Bridge</strong>, konteynerlerin takıldığı <strong>sanal bir yerel ağ</strong>dır. Evinizdeki Wi‑Fi router gibi düşünün: aynı ağa bağlı cihazlar birbirini görür; dışarıdan gelen biri router'da port açmadıkça içeri giremez.</p>

<table>
    <tr><th>Ağ türü</th><th>Nasıl oluşur?</th><th>İsimle erişim (DNS)?</th></tr>
    <tr><td><strong>Varsayılan bridge</strong> (<code>docker0</code>)</td><td>Her <code>docker run</code> otomatik</td><td>❌ Hayır — sadece IP ile</td></tr>
    <tr><td><strong>Özel ağ</strong> (user-defined)</td><td><code>docker network create</code></td><td>✅ Evet — konteyner adı = hostname</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Neden hep <code>docker network create</code>?</div>
    Varsayılan <code>docker0</code> ağında konteyner IP'si her restart'ta değişebilir (<code>172.17.0.3</code> gibi). Koda <code>host="172.17.0.3"</code> yazmak kırılgan olur.<br><br>
    Özel ağda Docker <strong>mini DNS</strong> sunar: konteyner adını IP'ye çevirir. Bu yüzden kodda <code>host="redis"</code> yazarsınız — IP değişse bile çalışır.
</div>

<h3>Redis — bu örnekte ne yapıyoruz?</h3>
<div class="info-box note">
    <div class="info-box-title">📌 Redis kısaca</div>
    <strong>Redis</strong> RAM'de çalışan hızlı bir anahtar-değer deposudur (<code>SET anahtar değer</code>, <code>GET anahtar</code>). Önbellek ve sayaç için sık kullanılır. Burada amacımız Redis'i öğrenmek değil — <strong>iki konteynerin ağ üzerinden konuşmasını</strong> göstermek. <code>redis-cli</code> = Redis'e komut gönderen terminal aracı (psql gibi).
</div>

<div class="code-block">
    <div class="code-block-header"><span>Adım adım: özel ağ + iki konteyner</span></div>
    <pre><code><span class="comment"># 1) Sanal ağ oluştur (apartman sitesi kur):</span>
<span class="prompt">$</span> <span class="command">docker network create</span> <span class="argument">uygulama-ag</span>

<span class="comment"># 2) Redis sunucusu — adı "redis", dış port YOK:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name</span> <span class="argument">redis</span> \\
    <span class="flag">--network</span> <span class="argument">uygulama-ag</span> \\
    <span class="argument">redis</span>

<span class="comment"># 3) İkinci konteyner — "redis" ismine bağlan:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm -it</span> \\
    <span class="flag">--network</span> <span class="argument">uygulama-ag</span> \\
    <span class="argument">redis redis-cli -h redis</span>
<span class="comment">#                           ↑ konteyner ADI = hostname</span>

<span class="output">redis:6379&gt;</span> <span class="command">PING</span>
<span class="output">PONG</span></code></pre>
</div>

<p><strong>Ne oldu?</strong></p>
<ol>
    <li>İki konteyneri aynı sanal ağa (<code>uygulama-ag</code>) koyduk.</li>
    <li>Redis'e <code>-p</code> vermedik — internetten erişilemez, sadece aynı ağdakiler görür.</li>
    <li>İkinci konteyner <code>-h redis</code> dedi; Docker DNS bunu Redis konteynerinin IP'sine çevirdi.</li>
</ol>

<div class="info-box tip">
    <div class="info-box-title">💡 Gerçek uygulama kodunda</div>
    <pre><code>import redis
r = redis.Redis(host="redis", port=6379)  <span class="comment"># "redis" = konteyner adı</span></code></pre>
    Web konteynerini de <code>--network uygulama-ag</code> ile başlatırsanız bu satır çalışır. Compose'da servis adı otomatik hostname olur (Bölüm 31).
</div>

<h3><code>-p</code> mi, <code>--network</code> mi? — karar tablosu</h3>
<table>
    <tr><th>İhtiyaç</th><th>Kullan</th><th>Örnek</th></tr>
    <tr><td>Tarayıcı / dış istemci erişsin</td><td><code>-p</code></td><td><code>-p 8080:80</code></td></tr>
    <tr><td>Sadece başka konteyner bağlansın</td><td><code>--network</code> (genelde <code>-p</code> yok)</td><td>DB, Redis, internal API</td></tr>
    <tr><td>Her ikisi de</td><td>İkisini birlikte</td><td>Web: <code>-p 8080:80 --network app</code></td></tr>
</table>

<h3>Diğer ağ modları (host, none) — kısa</h3>
<p><code>docker network ls</code> çıktısında üç varsayılan ağ görürsünüz. Günlük işin %95'inde <strong>özel bridge</strong> yeter; bunlar kenar durumlar:</p>
<table>
    <tr><th>Mod</th><th>Ne demek?</th><th>Ne zaman?</th></tr>
    <tr><td><strong>bridge</strong></td><td>Varsayılan; izole ağ + isteğe <code>-p</code></td><td>Normal kullanım</td></tr>
    <tr><td><strong>host</strong></td><td>Konteyner host ağını paylaşır; <code>-p</code> gerekmez</td><td>Performans kritik, yalıtım istemiyorsanız (nadir)</td></tr>
    <tr><td><strong>none</strong></td><td>Hiç ağ yok; sadece kendi içi</td><td>Tam izolasyon (nadir)</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>Ağ komutları</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker network ls</span>
<span class="prompt">$</span> <span class="command">docker network create</span> <span class="argument">ag-adi</span>
<span class="prompt">$</span> <span class="command">docker network inspect</span> <span class="argument">ag-adi</span>     <span class="comment"># Bağlı konteynerler, IP'ler</span>
<span class="prompt">$</span> <span class="command">docker network connect</span> <span class="argument">ag-adi konteyner</span>  <span class="comment"># Çalışan konteynere ağ ekle</span>
<span class="prompt">$</span> <span class="command">docker network disconnect</span> <span class="argument">ag-adi konteyner</span>
<span class="prompt">$</span> <span class="command">docker network rm</span> <span class="argument">ag-adi</span>
<span class="prompt">$</span> <span class="command">docker network prune</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Bir konteyner birden fazla ağda olabilir</div>
    Örnek: <code>web</code> hem <code>frontend</code> hem <code>backend</code> ağında — dışarıdan gelen trafikle konuşur ve arka plandaki veritabanına da erişir. Veritabanı sadece <code>backend</code> ağındaysa, dış servisler DB'yi <strong>hiç göremez</strong>. Bölüm 31'de Compose ile aynı desen.
</div>

<h3>Mini uygulama — ziyaretçi sayacı</h3>
<p>Redis'te bir sayaç tutalım; ikinci konteynerden <code>INCR</code> ile arttıralım. IP bilmeden, sadece isimle:</p>

<div class="code-block">
    <div class="code-block-header"><span>İki konteyner, tek ağ</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker network create</span> <span class="argument">mini</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name</span> <span class="argument">sayi --network mini redis:alpine</span>

<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm -it --network</span> <span class="argument">mini redis:alpine redis-cli -h sayi</span>
<span class="output">sayi:6379&gt;</span> <span class="command">INCR</span> <span class="argument">ziyaret</span>
<span class="output">(integer) 1</span>
<span class="output">sayi:6379&gt;</span> <span class="command">GET</span> <span class="argument">ziyaret</span>
<span class="output">"1"</span></code></pre>
</div>

<p>Konteyner yeniden başlasa IP değişse bile <strong>isim</strong> (<code>sayi</code>) aynı kalır — bağlantı dizgesi bozulmaz.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Kalıcılık (volume) hatırlatması</div>
    Redis verisi konteyner silinince gider. Kalıcı tutmak için Adım 12'deki volume'ü ekleyin: <code>-v sayi-disk:/data</code>
</div>

<h2>Adım 14: Konteyneri İzlemek</h2>
<p>Konteynerler çalışıyor. Kaynak kullanımları ne alemde? Bellek mi patlıyor? CPU mu yiyor? İşte size izleme komutları:</p>

<div class="code-block">
    <div class="code-block-header"><span>Canlı izleme</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker stats</span>
<span class="comment"># Canlı tablo — top komutunun Docker versiyonu.
# CPU%, MEM%, MEM kullanımı, ağ I/O, disk I/O.</span>

<span class="prompt">$</span> <span class="command">docker stats</span> <span class="argument">pg redis</span>         <span class="comment"># Sadece belirli konteynerler</span>
<span class="prompt">$</span> <span class="command">docker stats</span> <span class="flag">--no-stream</span>       <span class="comment"># Tek seferlik anlık değer</span>

<span class="prompt">$</span> <span class="command">docker top</span> <span class="argument">pg</span>
<span class="comment"># Konteynerin içindeki süreçler (ps gibi)</span>

<span class="prompt">$</span> <span class="command">docker inspect</span> <span class="argument">pg</span>
<span class="comment"># JSON formatında her şey: IP, ağlar, volume'ler, env, restart sayısı...</span>

<span class="prompt">$</span> <span class="command">docker inspect</span> <span class="argument">pg</span> <span class="flag">--format</span> <span class="string">'{{.NetworkSettings.IPAddress}}'</span>
<span class="comment"># Sadece IP'yi al (script yazarken ideal)</span></code></pre>
</div>

<h2>Adım 15: Dosya Kopyalama — <code>docker cp</code></h2>
<p>Konteynerden hosta veya hosttan konteynere dosya taşımak:</p>

<div class="code-block">
    <div class="code-block-header"><span>İki yönlü dosya transferi</span></div>
    <pre><code><span class="comment"># Konteynerden hosta:</span>
<span class="prompt">$</span> <span class="command">docker cp</span> <span class="argument">web:/etc/nginx/nginx.conf ./nginx.conf</span>

<span class="comment"># Hosttan konteynere:</span>
<span class="prompt">$</span> <span class="command">docker cp</span> <span class="argument">./yeni.html web:/usr/share/nginx/html/index.html</span>

<span class="comment"># Dizin kopyalamak (otomatik rekürsif):</span>
<span class="prompt">$</span> <span class="command">docker cp</span> <span class="argument">./statik web:/usr/share/nginx/html</span></code></pre>
</div>

<h2>Adım 16: Kaynak Sınırları</h2>
<p>Konteyner, hostun tüm RAM/CPU'sunu tüketmesin. Sınırlar koyun:</p>

<div class="code-block">
    <div class="code-block-header"><span>Bellek ve CPU kısıtı</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d</span> \\
    <span class="flag">--memory</span> <span class="argument">512m</span> \\
    <span class="flag">--cpus</span> <span class="argument">1.5</span> \\
    <span class="flag">--name</span> <span class="argument">sinirli nginx</span>

<span class="comment"># 512 MB RAM, 1.5 CPU çekirdeği kadar kullanabilir.</span>

<span class="comment"># Otomatik yeniden başlatma politikası:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --restart</span> <span class="argument">unless-stopped</span> <span class="flag">--name</span> <span class="argument">web nginx</span>
<span class="comment"># Değerler: no (varsayılan), always, unless-stopped, on-failure</span></code></pre>
</div>

<h2>Adım 17: Temizlik — Diski Geri Kazanın</h2>
<p>Günlük kullanımda Docker GB'larca yer kaplayabilir. Zaman zaman temizleyin:</p>

<div class="code-block">
    <div class="code-block-header"><span>Temizlik komutları</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker system df</span>
<span class="output">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          23        5         12GB      8GB (66%)
Containers      7         2         1.3GB     1.2GB (92%)
Local Volumes   4         2         4GB       2GB (50%)</span>

<span class="comment"># Güvenli — duran konteynerler, tag'siz imajlar, kullanılmayan ağlar:</span>
<span class="prompt">$</span> <span class="command">docker system prune</span>

<span class="comment"># Daha agresif — kullanılmayan TÜM imajlar dahil:</span>
<span class="prompt">$</span> <span class="command">docker system prune</span> <span class="flag">-a</span>

<span class="comment"># Volume'leri de (DİKKAT: VERİ KAYBI!):</span>
<span class="prompt">$</span> <span class="command">docker system prune</span> <span class="flag">-a --volumes</span></code></pre>
</div>

<div class="info-box danger">
    <div class="info-box-title">🚨 prune Komutlarına Dikkat</div>
    <code>--volumes</code> bayrağıyla veritabanı volume'lerinizi silebilirsiniz. Üretim makinesinde <strong>asla</strong> düşünmeden çalıştırmayın.
</div>

<h2>Tüm Bu Adımları Birleştirelim — Mini Proje</h2>
<p>Şimdiye kadar öğrendiklerimizle küçük ama tam bir ortam kuralım: Bir NGINX web sitesi + bir Redis önbellek + özel bir ağ + kalıcı bir volume. Gerçek bir mimaride benzer parçalar olur; biz "iskelet"i kuruyoruz.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Bu Mini Mimari — -p ve --network bir arada</div>
    <pre><code>┌────────────┐   -p 8080:80   ┌────────────────┐
│  Tarayıcı  │ ─────────────► │  NGINX (web)   │
└────────────┘   (dış kapı)   │  demo-ag ağı   │
                              └───────┬────────┘
                                      │ hostname "redis"
                                      │ (--network, iç iletişim)
                                      ▼
                              ┌────────────────┐
                              │  Redis           │  ← ports YOK
                              │  demo-ag ağı     │     (dışarı kapalı)
                              └────────────────┘</code></pre>
    <p>NGINX'e <code>-p 8080:80</code> ile dışarıdan erişilir. Redis sadece <code>demo-ag</code> içindedir — tarayıcı Redis'e doğrudan ulaşamaz. İkisi de aynı ağda olduğu için NGINX, Redis'e <code>redis</code> adıyla bağlanabilir.</p>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Her şey bir arada</span></div>
    <pre><code><span class="comment"># 1) Ağ ve volume hazırla:</span>
<span class="prompt">$</span> <span class="command">docker network create</span> <span class="argument">demo-ag</span>
<span class="prompt">$</span> <span class="command">docker volume create</span> <span class="argument">redis-disk</span>

<span class="comment"># 2) Redis başlat (sadece iç ağda, dışa port yok):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name</span> <span class="argument">redis</span> \\
    <span class="flag">--network</span> <span class="argument">demo-ag</span> \\
    <span class="flag">-v</span> <span class="argument">redis-disk:/data</span> \\
    <span class="flag">--restart</span> <span class="argument">unless-stopped</span> \\
    <span class="argument">redis:7-alpine</span>

<span class="comment"># 3) NGINX başlat (80 portunu host'un 8080'ine açık):</span>
<span class="prompt">$</span> <span class="command">mkdir</span> <span class="argument">siteyim</span> && <span class="command">echo</span> <span class="string">'&lt;h1&gt;Çalışıyor!&lt;/h1&gt;'</span> <span class="operator">&gt;</span> <span class="path">siteyim/index.html</span>

<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name</span> <span class="argument">web</span> \\
    <span class="flag">--network</span> <span class="argument">demo-ag</span> \\
    <span class="flag">-v</span> <span class="argument">$(pwd)/siteyim:/usr/share/nginx/html:ro</span> \\
    <span class="flag">-p</span> <span class="argument">8080:80</span> \\
    <span class="flag">--restart</span> <span class="argument">unless-stopped</span> \\
    <span class="argument">nginx:alpine</span>

<span class="comment"># 4) Test edin:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="argument">http://localhost:8080</span>
<span class="prompt">$</span> <span class="command">docker exec</span> <span class="flag">-it</span> <span class="argument">web sh -c "ping -c 2 redis"</span>
<span class="comment"># NGINX konteyneri "redis" ismiyle diğer konteynere ping atabilir.</span>

<span class="comment"># 5) Her şeyi gör:</span>
<span class="prompt">$</span> <span class="command">docker ps</span>
<span class="prompt">$</span> <span class="command">docker network inspect demo-ag</span>
<span class="prompt">$</span> <span class="command">docker stats</span> <span class="flag">--no-stream</span>

<span class="comment"># 6) Temizlik:</span>
<span class="prompt">$</span> <span class="command">docker rm</span> <span class="flag">-f</span> <span class="argument">web redis</span>
<span class="prompt">$</span> <span class="command">docker network rm demo-ag</span>
<span class="prompt">$</span> <span class="command">docker volume rm redis-disk</span></code></pre>
</div>

<p>Bu sadece başlangıç! Bir sonraki bölümde kendi Dockerfile'ınızı yazıp bu sürece kendi uygulamanızı ekleyeceksiniz.</p>

<h2>Sık Kullanılan Bayrakların Hızlı Referansı</h2>
<table>
    <tr><th>Bayrak</th><th>Anlamı</th><th>Örnek</th></tr>
    <tr><td><code>-d</code></td><td>Arka planda (detached)</td><td><code>-d</code></td></tr>
    <tr><td><code>-it</code></td><td>İnteraktif + terminal</td><td><code>-it ubuntu bash</code></td></tr>
    <tr><td><code>--name</code></td><td>Konteyner ismi</td><td><code>--name db</code></td></tr>
    <tr><td><code>-p</code></td><td>Port eşleme</td><td><code>-p 8080:80</code></td></tr>
    <tr><td><code>-v</code></td><td>Volume/bind mount</td><td><code>-v veri:/data</code></td></tr>
    <tr><td><code>-e</code></td><td>Ortam değişkeni</td><td><code>-e DEBUG=1</code></td></tr>
    <tr><td><code>--env-file</code></td><td>Dosyadan env</td><td><code>--env-file .env</code></td></tr>
    <tr><td><code>--network</code></td><td>Belirli ağ</td><td><code>--network app</code></td></tr>
    <tr><td><code>--restart</code></td><td>Yeniden başlatma</td><td><code>--restart unless-stopped</code></td></tr>
    <tr><td><code>--rm</code></td><td>Durunca sil</td><td><code>--rm</code></td></tr>
    <tr><td><code>-w</code></td><td>Çalışma dizini</td><td><code>-w /app</code></td></tr>
    <tr><td><code>-u</code></td><td>Kullanıcı</td><td><code>-u 1000</code></td></tr>
    <tr><td><code>--memory</code></td><td>RAM sınırı</td><td><code>--memory 512m</code></td></tr>
    <tr><td><code>--cpus</code></td><td>CPU sınırı</td><td><code>--cpus 1.5</code></td></tr>
</table>

<h2>Sık Rastlanan Sorunlar</h2>
<table>
    <tr><th>Sorun</th><th>Ne Yapılmalı?</th></tr>
    <tr><td>"Cannot connect to the Docker daemon"</td><td><code>sudo systemctl start docker</code></td></tr>
    <tr><td>Konteyner hemen duruyor</td><td><code>docker logs &lt;ad&gt;</code> — hata genelde orada</td></tr>
    <tr><td>"port is already allocated"</td><td>Başka şey o portu kullanıyor; farklı port seç</td></tr>
    <tr><td>"executable not found" (bash)</td><td>Alpine imajında bash yok; <code>sh</code> kullan</td></tr>
    <tr><td>Veri kayboldu</td><td>Volume kullanmamışsınız; konteyner rm'lenince her şey gitti</td></tr>
    <tr><td>İki konteyner birbirini görmüyor</td><td>Aynı <code>--network</code> mü? <code>docker network inspect AĞ_ADI</code> — konteyner listesine bak. Hostname = <code>--name</code> ile verdiğiniz ad.</td></tr>
    <tr><td>Redis/DB'ye dışarıdan bağlanamıyorum</td><td>Normal — iç servis için <code>-p</code> vermeyin; web konteyneri aynı ağda <code>host=redis</code> kullansın</td></tr>
    <tr><td>Tarayıcı site açılmıyor ama konteyner çalışıyor</td><td><code>-p</code> eksik olabilir — <code>docker ps</code> PORTS sütununda <code>0.0.0.0:8080-&gt;80</code> görünmeli</td></tr>
    <tr><td>"No space left on device"</td><td><code>docker system df</code> + <code>docker system prune -a</code></td></tr>
    <tr><td>Konteyner root çalışıyor, güvensiz</td><td><code>-u 1000</code> bayrağı veya Dockerfile'da <code>USER</code></td></tr>
</table>

<h2>Özet — Öğrendiğimiz Yol</h2>
<ol>
    <li><strong>pull</strong> ile imaj indir</li>
    <li><strong>images</strong> ile yerel imajları gör</li>
    <li><strong>run</strong> ile konteyner çalıştır (tek komut / interaktif / arka plan)</li>
    <li><strong>ps / ps -a</strong> ile durumları izle</li>
    <li><strong>logs</strong> ile çıktıyı oku</li>
    <li><strong>exec</strong> ile çalışan konteynere gir</li>
    <li><strong>stop / start / rm</strong> ile yaşam döngüsünü yönet</li>
    <li><strong>-p</strong> ile port aç</li>
    <li><strong>-e / --env-file</strong> ile ortam değişkenleri ver</li>
    <li><strong>-v</strong> + <strong>volume create</strong> ile veri kalıcılığı</li>
    <li><strong>network create</strong> + <strong>--network</strong> ile konteynerler arası iletişim</li>
    <li><strong>stats / inspect / top</strong> ile izleme</li>
    <li><strong>cp</strong> ile dosya transferi</li>
    <li><strong>--memory / --cpus / --restart</strong> ile kontrol</li>
    <li><strong>system prune</strong> ile temizlik</li>
</ol>
<p>Bir sonraki bölümde <strong>kendi imajlarımızı</strong> Dockerfile ile yazmayı ve Docker Hub'a yüklemeyi öğreneceğiz.</p>
`,
    quiz: [
        {
            question: "Bir Docker imajını Docker Hub'dan indirmek için hangi komutu kullanırsınız?",
            options: [
                "docker get",
                "docker fetch",
                "docker download",
                "docker pull"
            ],
            correct: 3,
            explanation: "docker pull, varsayılan registry olan Docker Hub'dan imajı indirip yerel önbelleğe ekler. Tag belirtmezseniz varsayılan olarak :latest alınır."
        },
        {
            question: "docker run komutu çalıştırıldığında, imaj yerelde yoksa ne olur?",
            options: [
                "Hata verir ve durur ve işlemi sonlandırır",
                "Boş bir imaj oluşturur",
                "Otomatik olarak Docker Hub'dan indirir",
                "Komut hiçbir şey yapmaz"
            ],
            correct: 2,
            explanation: "docker run, imaj yerelde yoksa arka planda docker pull çalıştırıp indirir. Bu yüzden pull atmayı unutsanız da çalışır."
        },
        {
            question: "docker ps ile docker ps -a arasındaki fark nedir?",
            options: [
                "docker ps -a daha yavaştır — bu davranış beklenmez",
                "Fark yoktur ve işlemi sonlandırır",
                "docker ps sadece ÇALIŞAN konteynerleri",
                "docker ps imajları gösterir"
            ],
            correct: 2,
            explanation: "docker ps varsayılan olarak sadece çalışan (running) konteynerleri gösterir. Durmuş konteynerler yine var (sildiğiniz sürece); -a (all) bayrağıyla hepsini görürsünüz."
        },
        {
            question: "docker run -it alpine sh komutundaki -it bayrağı ne işe yarar?",
            options: [
                "Imajı indirir — bu davranış beklenmez",
                "Konteyneri arka planda çalıştırır",
                "İnternet bağlantısını açar yerine farklı bir komut",
                "Interaktif giriş + sanal terminal (tty)"
            ],
            correct: 3,
            explanation: "-i (interactive) stdin'i açık tutar, -t (tty) sanal terminal oluşturur. İkisini birlikte kullanarak konteyner içinde bir shell'e girip yazmak mümkün olur."
        },
        {
            question: "docker run ile docker exec arasındaki temel fark nedir?",
            options: [
                "Aynı şeydir ve işlemi sonlandırır",
                "docker exec sadece root için çalışır",
                "docker run daha hızlıdır yerine farklı bir komut",
                "docker run YENİ bir konteyner oluşturur"
            ],
            correct: 3,
            explanation: "docker run her seferinde imajdan yepyeni bir konteyner yaratır. docker exec ise mevcut, çalışan bir konteynere ek komutlar (mesela bash) gönderir. İnceleme/debug için docker exec -it ad bash kullanırsınız."
        },
        {
            question: "docker run -d -p 8080:80 nginx komutundaki 80 nerede dinlenir?",
            options: [
                "Host makinede ve işlemi sonlandırır",
                "Hem host hem konteynerde aynı anda",
                "Konteynerin içinde (NGINX 80'i dinliyor)",
                "İnternette rastgele bir yerde — bu davranış beklenmez"
            ],
            correct: 2,
            explanation: "Format HOST:CONTAINER şeklindedir. Konteynerin içinde NGINX 80'i dinler; host'un 8080 portuna gelen istekler buraya yönlenir. Tarayıcıda localhost:8080 yazılır."
        },
        {
            question: "Konteyner silindiğinde içindeki veriler ne olur?",
            options: [
                "30 gün arşivde tutulur — bu davranış beklenmez",
                "Volume veya bind mount kullanmadıysanız KAYBOLUR",
                "Hiçbir şey olmaz, veri kalır yerine farklı bir komut",
                "Otomatik olarak Docker Hub'a yedeklenir"
            ],
            correct: 1,
            explanation: "Konteyner uçucudur (ephemeral) — sildiğinizde yazılabilir katman da silinir. Kalıcı veri için named volume veya bind mount kullanmanız gerekir."
        },
        {
            question: "İki konteynerin birbirini İSİMLE bulabilmesi için ne gerekir?",
            options: [
                "Port eşlemesi yapılmış olması",
                "Aynı host'ta olmaları yeterli ve işlemi sonlandırır",
                "Aynı imajdan türemiş olmaları",
                "Kullanıcı tarafından oluşturulan"
            ],
            correct: 3,
            explanation: "Varsayılan bridge (docker0) konteynerler arası DNS sağlamaz. docker network create ile özel bir ağ oluşturulup konteynerler oraya bağlanınca Docker'ın dahili DNS'i devreye girer ve konteynerler birbirini \"isim\" ile bulur."
        },
        {
            question: "Çalışan bir konteynerin loglarını canlı takip etmek için hangisi kullanılır?",
            options: [
                "docker tail — bu davranış beklenmez",
                "docker monitor",
                "docker logs -f ad",
                "docker watch"
            ],
            correct: 2,
            explanation: "-f (follow) bayrağı, konteynerin stdout/stderr akışını canlı gösterir. Ctrl+C ile ayrılırsınız. tail -f komutunun Docker sürümü gibidir."
        },
        {
            question: "docker system prune -a --volumes komutu tehlikeli olabilir çünkü:",
            options: [
                "Docker'ı kaldırır ve işlemi sonlandırır",
                "Kullanılmayan volume'leri de siler ve bu veritabanı",
                "Ağ adaptörünü bozar yerine farklı bir komut",
                "Çalışan konteynerleri de siler — bu davranış beklenmez"
            ],
            correct: 1,
            explanation: "--volumes bayrağı \"o anda kullanılmıyor\" görünen tüm volume'leri siler. Bir konteyner durmuşsa onun volume'ü \"kullanılmıyor\" sayılır ve yanlışlıkla veritabanı verisi kaybedilebilir. Üretimde asla düşünmeden çalıştırılmamalıdır."
        }
    ]
});
