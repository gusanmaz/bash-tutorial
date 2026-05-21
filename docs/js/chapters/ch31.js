// ===== Bölüm 31: Docker Compose, Gerçek Örnekler ve Faydalı Kaynaklar =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 31,
    title: 'Docker Compose ve Kaynaklar',
    subtitle: 'Docker Compose, Real-World Examples & Resources',
    icon: '🎼',
    description: 'Çok konteynerli uygulamaları tek YAML dosyasıyla yönetin. Gerçek örnekler, Docker için en iyi video/tutorial kaynakları ve resmi dokümantasyon linkleri.',
    content: `
<h2>Tek Bir Konteyner Yetmediğinde</h2>
<p>Çoğu gerçek uygulama <strong>tek bir konteynerden</strong> oluşmaz. Tipik bir web uygulaması şöyledir:</p>
<ul>
    <li>🌐 <strong>Web sunucusu</strong> (NGINX)</li>
    <li>🐍 <strong>Uygulama sunucusu</strong> (Python/Flask, Node, Go...)</li>
    <li>🗄️ <strong>Veritabanı</strong> (PostgreSQL)</li>
    <li>⚡ <strong>Önbellek</strong> (Redis)</li>
    <li>📬 <strong>Kuyruk sistemi</strong> (RabbitMQ)</li>
</ul>

<p>Bunları tek tek <code>docker run</code> ile başlatmak bir kabustur. Ağı, volume'leri, ortam değişkenlerini, başlatma sırasını koordine etmeniz gerekir. 5 konteynerli bir sistem 20-30 satır komut demek. Hepsini her restart'ta yazmak mı? Hayır. İşte <strong>Docker Compose</strong> bunu çözer.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Docker Compose Felsefesi</div>
    Docker Compose, <strong>tek bir YAML dosyasında</strong> tüm konteynerlerinizi, ağlarınızı ve volume'lerinizi tanımlamanıza izin verir. Sonra tek bir komutla hepsini başlatır, durdurur, yönetirsiniz.
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Bu Bölümün Yol Haritası</div>
    <ol>
        <li><strong>YAML nedir?</strong> — Compose dosyalarının dili.</li>
        <li><strong>İlk Compose dosyası</strong> — Flask + Redis sayacı.</li>
        <li><strong>YAML anatomisi</strong> — services, volumes, networks blokları.</li>
        <li><strong>Compose komutları</strong> — up, down, logs, exec.</li>
        <li><strong>Önemli özellikler</strong> — depends_on, healthcheck, env, networks.</li>
        <li><strong>Gerçek dünya örnekleri</strong> — WordPress, tam stack geliştirme ortamı.</li>
        <li><strong>İpuçları + kaynaklar</strong> — hot reload, dev/prod ayrımı, kitaplar, videolar.</li>
    </ol>
</div>

<h2>Önce: YAML Nedir?</h2>
<p>Compose dosyaları <strong>YAML</strong> (YAML Ain't Markup Language) adında bir formatta yazılır. Adı garip ama mantığı çok basit — bir nevi "girintilerle yazılmış sözlük". Şu üç şeyi bilmeniz yeterli:</p>

<div class="code-block">
    <div class="code-block-header"><span>YAML'in 3 temel yapısı</span></div>
    <pre><code><span class="comment"># 1) Anahtar-değer çiftleri (iki nokta üst üste ile):</span>
isim: ahmet
yas: 30

<span class="comment"># 2) İç içe nesneler (girinti ile, genelde 2 boşluk):</span>
kullanici:
  isim: ahmet
  yas: 30
  adres:
    sehir: istanbul
    posta: 34000

<span class="comment"># 3) Listeler (tire ile):</span>
meyveler:
  - elma
  - armut
  - portakal
<span class="comment"># Veya tek satırda: meyveler: [elma, armut, portakal]</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ YAML'de Girinti KUTSALDIR</div>
    <ul>
        <li>Girinti için <strong>sadece boşluk</strong> kullanın, asla TAB. Editörünüzü "tab → 2 boşluk" yapacak şekilde ayarlayın.</li>
        <li>Aynı seviyedeki şeyler aynı miktar girintilenmiş olmalı. 2 boşluk seçtiyseniz hep 2 olsun.</li>
        <li>İki noktadan sonra <strong>bir boşluk</strong> olmalı: <code>isim: ahmet</code> ✅, <code>isim:ahmet</code> ❌.</li>
        <li><code>#</code> ile yorum satırı yazabilirsiniz.</li>
    </ul>
    <p>YAML hataları genelde "girinti yanlış" yüzünden olur. <code>docker compose config</code> komutu yazımınızı doğrulayıp hataları gösterir.</p>
</div>

<h2>İlk Compose Dosyası</h2>
<p>Klasik örnek: Flask uygulaması + Redis önbelleği. Web sayfasını her açtığınızda Redis'te bir sayaç artar ve "Ben N. ziyaretçiyim" der.</p>

<div class="code-block">
    <div class="code-block-header"><span>Proje yapısı</span></div>
    <pre><code>compose-ornek/
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── app.py</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>app.py — ziyaretçi sayar</span></div>
    <pre><code>from flask import Flask
import redis

app = Flask(__name__)
r = redis.Redis(host='redis', port=6379)

@app.route('/')
def index():
    count = r.incr('ziyaret')
    return f'Ben {count}. ziyaretçiyim!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>requirements.txt</span></div>
    <pre><code>flask==3.0.0
redis==5.0.1</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Dockerfile</span></div>
    <pre><code>FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>docker-compose.yml — sihirli dosya</span></div>
    <pre><code>services:                          <span class="comment"># "Şu konteynerleri istiyorum"</span>
  web:                             <span class="comment"># 1. servis — adı "web"</span>
    build: .                       <span class="comment"># Bu dizindeki Dockerfile'dan imaj yarat</span>
    ports:
      - "8080:5000"                <span class="comment"># host:8080 → konteyner:5000</span>
    depends_on:
      - redis                      <span class="comment"># Önce redis servisi başlasın</span>

  redis:                           <span class="comment"># 2. servis — adı "redis"</span>
    image: redis:7-alpine          <span class="comment"># Hazır imaj kullan (build etme)</span>
    volumes:
      - redis-verisi:/data         <span class="comment"># /data'yı kalıcı volume'e bağla</span>

volumes:                           <span class="comment"># Named volume tanımı</span>
  redis-verisi:</code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Bu Dosyayı Yorumlayalım</div>
    <p>Dosyanın söylediği şey aslında basit: <em>"Bana iki konteyner çalıştır: birine 'web' de, bu dizindeki Dockerfile'dan inşa et ve 8080 portunu dışa aç. Diğerine 'redis' de, hazır redis imajını kullan ve verisini bir volume'de tut. Web, redis başlamadan başlamasın."</em></p>
    <p><strong>Önceki bölümlerde <code>docker run</code> ile yaptığımız her şey</strong> burada YAML'a dönüştü:</p>
    <ul>
        <li><code>docker run -p 8080:5000</code> → <code>ports: ["8080:5000"]</code></li>
        <li><code>docker run -v redis-verisi:/data</code> → <code>volumes: [redis-verisi:/data]</code></li>
        <li><code>docker network create ...</code> → Compose otomatik bir ağ oluşturur ve tüm servisleri ona ekler.</li>
    </ul>
    <p>Yani Compose <strong>yeni sihir değil</strong> — sadece <code>docker run</code> komutlarınızın okunabilir bir özetidir.</p>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Çalıştırma</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker compose up</span>
<span class="comment"># Hepsini başlatır, logları canlı gösterir.
# Ctrl+C ile durdurursunuz.</span>

<span class="prompt">$</span> <span class="command">docker compose up</span> <span class="flag">-d</span>
<span class="comment"># Arka planda başlat (-d = detached)</span>

<span class="prompt">$</span> <span class="command">docker compose logs</span> <span class="flag">-f</span>
<span class="comment"># Canlı log takibi</span>

<span class="prompt">$</span> <span class="command">docker compose ps</span>
<span class="comment"># Bu projenin konteynerleri</span>

<span class="prompt">$</span> <span class="command">docker compose down</span>
<span class="comment"># Hepsini durdurur ve siler. Volume'ler kalır.</span>

<span class="prompt">$</span> <span class="command">docker compose down</span> <span class="flag">-v</span>
<span class="comment"># Volume'leri de sil</span></code></pre>
</div>

<p>Tarayıcıda <code>http://localhost:8080</code>: "Ben 1. ziyaretçiyim!" Yenileyin → 2, 3... Redis'te sayıyı saklıyor. Konteyneri durdurun, yeniden başlatın — sayıyı hatırlıyor (volume sayesinde).</p>

<h2>docker-compose.yml Anatomisi</h2>

<p>Bir Compose dosyasının üç ana bloğu vardır: <code>services</code>, <code>networks</code>, <code>volumes</code>. Her servis için kullanabileceğiniz alanların hepsi aşağıda — paniğe kapılmayın, çoğunu nadiren kullanacaksınız.</p>

<div class="code-block">
    <div class="code-block-header"><span>Tam yapı</span></div>
    <pre><code>services:              <span class="comment"># Konteynerlerinizi burada tanımlarsınız</span>
  servis_ismi:
    image: ...          <span class="comment"># Hazır imaj kullan (örn: postgres:16)</span>
    build: ...          <span class="comment"># Ya da bir Dockerfile'dan build et</span>
    container_name: ... <span class="comment"># İsim ver (yoksa otomatik)</span>
    ports: [...]        <span class="comment"># Host:konteyner port eşleme</span>
    environment: {...}  <span class="comment"># Ortam değişkenleri (içeride)</span>
    env_file: [...]     <span class="comment"># Değişkenleri dış dosyadan oku</span>
    volumes: [...]      <span class="comment"># Disk bağlama (kalıcılık + bind mount)</span>
    networks: [...]     <span class="comment"># Hangi ağ(lar)da olsun</span>
    depends_on: [...]   <span class="comment"># Bundan önce şu servisler başlasın</span>
    restart: ...        <span class="comment"># Çökerse yeniden başlasın mı?</span>
    command: ...        <span class="comment"># İmajdaki CMD'nin yerine bu çalışsın</span>
    healthcheck: {...}  <span class="comment"># "Hazır mıyım?" testi</span>
    deploy: {...}       <span class="comment"># Swarm/üretim için kaynak sınırı</span>

networks:              <span class="comment"># Özel ağ tanımları</span>
  ag_adi:
    driver: bridge      <span class="comment"># Varsayılan; nadiren değiştirilir</span>

volumes:               <span class="comment"># Named volume tanımları</span>
  volume_adi:</code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Az Bilinen Üç Alan</div>
    <ul>
        <li><strong><code>command</code></strong>: Dockerfile'da <code>CMD ["python", "app.py"]</code> yazıyorsa konteyner onu çalıştırır. Ama Compose'da <code>command: ["python", "test.py"]</code> derseniz onun yerine bu çalışır. İmajı bozmadan farklı bir komut denemek için kullanışlıdır.</li>
        <li><strong><code>healthcheck</code></strong>: Konteynerin gerçekten yanıt verir halde olup olmadığını periyodik test eder (Bölüm 30'te gördük). Diğer servisler <code>depends_on</code> ile bu sağlık durumunu bekleyebilir.</li>
        <li><strong><code>deploy</code></strong>: Sadece Docker Swarm (orkestrasyon) ile çalıştırırken anlamlıdır — replica sayısı, CPU/RAM sınırı, yerleşim kuralları. Tek makinede Compose ile çalıştırıyorsanız <code>deploy</code> bloğunu çoğu zaman görmezden gelebilirsiniz (ama kaynak sınırları için bazen yine de yazılır).</li>
    </ul>
</div>

<h2>Compose Komutları — Tam Referans</h2>
<div class="code-block">
    <div class="code-block-header"><span>Yaygın komutlar</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker compose up</span>              <span class="comment"># Başlat (foreground)</span>
<span class="prompt">$</span> <span class="command">docker compose up</span> <span class="flag">-d</span>           <span class="comment"># Arka plan</span>
<span class="prompt">$</span> <span class="command">docker compose up</span> <span class="flag">--build</span>      <span class="comment"># Imajları yeniden build et</span>
<span class="prompt">$</span> <span class="command">docker compose up web</span>          <span class="comment"># Sadece belirli servis</span>

<span class="prompt">$</span> <span class="command">docker compose down</span>            <span class="comment"># Durdur + sil</span>
<span class="prompt">$</span> <span class="command">docker compose down</span> <span class="flag">-v</span>         <span class="comment"># Volume'leri de sil</span>
<span class="prompt">$</span> <span class="command">docker compose down</span> <span class="flag">--rmi all</span>   <span class="comment"># İmajları da sil</span>

<span class="prompt">$</span> <span class="command">docker compose stop</span>            <span class="comment"># Durdur (ama silme)</span>
<span class="prompt">$</span> <span class="command">docker compose start</span>           <span class="comment"># Var olanları yeniden başlat</span>
<span class="prompt">$</span> <span class="command">docker compose restart</span>         <span class="comment"># Yeniden başlat</span>

<span class="prompt">$</span> <span class="command">docker compose ps</span>              <span class="comment"># Durum</span>
<span class="prompt">$</span> <span class="command">docker compose logs</span>            <span class="comment"># Tüm servislerin logları</span>
<span class="prompt">$</span> <span class="command">docker compose logs</span> <span class="flag">-f web</span>      <span class="comment"># Sadece web'i canlı izle</span>

<span class="prompt">$</span> <span class="command">docker compose exec web bash</span>   <span class="comment"># Çalışan web konteynerine gir</span>
<span class="prompt">$</span> <span class="command">docker compose run</span> <span class="flag">--rm web bash</span>  <span class="comment"># Yeni geçici konteyner aç</span>

<span class="prompt">$</span> <span class="command">docker compose build</span>          <span class="comment"># Sadece build</span>
<span class="prompt">$</span> <span class="command">docker compose pull</span>           <span class="comment"># İmajları yeniden indir</span>
<span class="prompt">$</span> <span class="command">docker compose config</span>         <span class="comment"># YAML'i doğrula ve resolved halde göster</span>
<span class="prompt">$</span> <span class="command">docker compose top</span>            <span class="comment"># Her konteynerdeki süreçler</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 "docker compose" vs "docker-compose"</div>
    Eski sürümlerde <code>docker-compose</code> (tireli, ayrı bir Python programı) kullanılırdı. Yeni sürümlerde <code>docker compose</code> (boşluklu, Docker CLI'nin alt komutu) tavsiye edilir. İkisi de aynı iş için çalışır, syntax farkı yok. Tutorial'larda her ikisini de göreceksiniz.
</div>

<h2>Önemli Compose Özellikleri</h2>

<h3>Build İle Image — Aynı Anda</h3>
<div class="code-block">
    <div class="code-block-header"><span>Hem build edip hem isim ver</span></div>
    <pre><code>services:
  api:
    build:
      context: ./api           <span class="comment"># Dockerfile nerede?</span>
      dockerfile: Dockerfile.prod
      args:                    <span class="comment"># Build arg'ları</span>
        VERSION: "1.0"
    image: kullanici/api:1.0   <span class="comment"># Build edilen imaja bu ismi ver</span></code></pre>
</div>

<h3>environment — Ortam Değişkenleri</h3>
<div class="code-block">
    <div class="code-block-header"><span>Üç farklı yol</span></div>
    <pre><code>services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: gizli
      POSTGRES_DB: uygulama
    <span class="comment"># Alternatif liste sözdizimi:
    # environment:
    #   - POSTGRES_USER=admin
    #   - POSTGRES_PASSWORD=gizli</span>
    env_file:                      <span class="comment"># Veya dosyadan</span>
      - .env.db</code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 .env Dosyasıyla Yapılandırma</div>
    <p>YAML dosyasının içinde <code>\${DEĞİŞKEN}</code> şeklinde "yer tutucular" kullanabilirsiniz. Compose, çalıştığı dizindeki <code>.env</code> adlı dosyayı <strong>otomatik olarak okur</strong> ve bu yer tutucuları gerçek değerlerle değiştirir. Tıpkı Bash'teki <code>\$değişken</code> mantığı gibi.</p>
    <pre><code><span class="comment"># .env dosyası (proje dizininin kökünde, docker-compose.yml ile aynı yerde):</span>
DB_PASSWORD=gizli_123
WEB_PORT=8080</code></pre>
    <pre><code><span class="comment"># docker-compose.yml içinde değişken kullanımı:</span>
services:
  web:
    ports:
      - "\${WEB_PORT}:5000"        <span class="comment"># Çalıştırma anında "8080:5000" olur</span>
  db:
    environment:
      POSTGRES_PASSWORD: \${DB_PASSWORD}   <span class="comment"># "gizli_123" olur</span>
      <span class="comment"># Varsayılan değer:</span>
      LOG_LEVEL: \${LOG_LEVEL:-info}        <span class="comment"># LOG_LEVEL yoksa "info"</span></code></pre>
    <p><strong>Faydası:</strong></p>
    <ul>
        <li><strong>Sırları YAML'e yazmazsınız</strong>: <code>docker-compose.yml</code>'i git'e koyabilirsiniz; <code>.env</code> dosyasını <code>.gitignore</code>'a eklersiniz.</li>
        <li><strong>Farklı ortamlar için farklı .env</strong>: <code>.env.dev</code>, <code>.env.prod</code> dosyaları tutup <code>docker compose --env-file .env.prod up</code> ile seçersiniz.</li>
        <li><strong>Takım çalışması</strong>: <code>.env.example</code> adında "buraya bunlar gelecek" şablonu paylaşır, herkes kendi <code>.env</code>'ini doldurur.</li>
    </ul>
</div>

<h3>volumes — Kalıcı Veri</h3>
<div class="code-block">
    <div class="code-block-header"><span>Üç farklı volume türü</span></div>
    <pre><code>services:
  db:
    image: postgres:16
    volumes:
      <span class="comment"># 1) Named volume — Docker yönetir</span>
      - db-verisi:/var/lib/postgresql/data

      <span class="comment"># 2) Bind mount — hostun klasörü</span>
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro

      <span class="comment"># 3) Anonim volume — isimsiz</span>
      - /tmp

volumes:
  db-verisi:                 <span class="comment"># Named volume burada tanımlanır</span>
    <span class="comment"># driver: local   (varsayılan)</span></code></pre>
</div>

<h3>depends_on — Başlatma Sırası ve "Hazır Olma" Sorunu</h3>

<p>Şu senaryoyu düşünün: bir web uygulaması var, başlar başlamaz veritabanına bağlanmaya çalışıyor. Eğer veritabanı henüz hazır değilse uygulama "bağlantı reddedildi" hatasıyla çöker. Bunu nasıl engelleriz?</p>

<p><strong>İlk çözüm denemesi: <code>depends_on</code> kullanmak.</strong></p>

<div class="code-block">
    <div class="code-block-header"><span>Basit depends_on — yetersizdir</span></div>
    <pre><code>services:
  web:
    depends_on:
      - db                  <span class="comment"># db BAŞLATILDIKTAN sonra web başlar</span>
  db:
    image: postgres:16</code></pre>
</div>

<p>Bu yetmeyebilir. Neden? Çünkü <strong>"başlatıldı" ≠ "hazır"</strong>. <code>depends_on</code> sadece "PostgreSQL konteynerinin <em>süreci</em> başladı mı?" diye bakar. Ama PostgreSQL süreci başlasa da, içeride şu an veritabanı dosyalarını yüklüyor, schema'yı kontrol ediyor olabilir — daha bağlantı kabul etmeye <strong>hazır değil</strong>. Bu aşamada web uygulamanız bağlanmaya çalışırsa hata alır.</p>

<p><strong>Doğru çözüm: <code>healthcheck</code> + <code>condition: service_healthy</code>.</strong></p>

<div class="code-block">
    <div class="code-block-header"><span>Hazır olunca başlat</span></div>
    <pre><code>services:
  web:
    depends_on:
      db:
        condition: service_healthy   <span class="comment"># db "sağlıklı" olunca web başla</span>

  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      <span class="comment"># pg_isready: Postgres'in bağlantı kabul edip etmediğini test eden komut.
      # Her veritabanı imajının kendi "hazır mıyım?" komutu vardır.</span>
      interval: 5s              <span class="comment"># Her 5 saniyede bir test et</span>
      timeout: 3s               <span class="comment"># 3 saniyede cevap gelmezse başarısız say</span>
      retries: 5                <span class="comment"># 5 üst üste başarısız = "unhealthy"</span></code></pre>
</div>

<p>Artık akış: Compose db konteynerini başlatır → her 5 saniyede <code>pg_isready</code> ile test eder → ilk başarılı testten sonra db "healthy" işaretlenir → web servisi ancak o zaman başlatılır. Klasik bir "race condition" sorunu çözüldü.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Healthcheck Komutları — Servise Göre Değişir</div>
    <ul>
        <li><strong>PostgreSQL</strong>: <code>pg_isready -U kullanici</code></li>
        <li><strong>MySQL</strong>: <code>mysqladmin ping -h localhost</code></li>
        <li><strong>Redis</strong>: <code>redis-cli ping</code></li>
        <li><strong>HTTP servisleri</strong>: <code>curl -f http://localhost/sağlık</code> veya <code>wget --spider ...</code></li>
    </ul>
    <p>Her resmi imajın Docker Hub sayfasında genelde örnek healthcheck'i de yer alır.</p>
</div>

<h3>restart — Konteyner Çökerse</h3>
<pre><code>restart: "no"              <span class="comment"># Varsayılan. Çökerse çökmüş kalır.</span>
restart: always            <span class="comment"># Her durumda yeniden başlat (manuel stop da iptal eder)</span>
restart: on-failure        <span class="comment"># Sadece 0'dan farklı exit kodda</span>
restart: unless-stopped    <span class="comment"># always gibi ama "docker stop" saygı</span></code></pre>

<h3>networks — Özel Ağlar ve Güvenlik Bölmeleri</h3>

<p>Varsayılan olarak Compose, tüm servisleriniz için tek bir ağ oluşturur ve hepsini ona koyar. Çoğu durumda bu yeter. Ama büyük projelerde <strong>güvenlik için</strong> ağları bölmek isteyebilirsiniz: bir geminin su geçirmez bölmeleri gibi.</p>

<p>Tipik desen: bir "ön ağ" (load balancer, web sunucusu) + bir "arka ağ" (veritabanı, cache). Veritabanı sadece arka ağda olur — böylece <strong>dış dünyayla konuşan</strong> servisler kazara DB'ye düz erişemez.</p>

<div class="code-block">
    <div class="code-block-header"><span>İki katmanlı mimari</span></div>
    <pre><code>services:
  lb:                            <span class="comment"># Load balancer / NGINX (dışa açık)</span>
    image: nginx
    ports: ["80:80"]
    networks:
      - on                       <span class="comment"># Sadece ön ağda</span>

  web:                           <span class="comment"># Uygulama sunucusu</span>
    build: ./app
    networks:
      - on                       <span class="comment"># Ön ağda (lb'den istek alır)</span>
      - arka                     <span class="comment"># Arka ağda da (db'ye bağlanır)</span>

  db:                            <span class="comment"># Veritabanı</span>
    image: postgres:16
    networks:
      - arka                     <span class="comment"># SADECE arka ağda — lb göremez</span>

networks:
  on:                            <span class="comment"># Ön ağ (frontend)</span>
  arka:                          <span class="comment"># Arka ağ (backend)</span></code></pre>
</div>

<p><strong>Sonuç:</strong></p>
<ul>
    <li><code>lb</code> ve <code>web</code> birbirine "on" ağında konuşabilir.</li>
    <li><code>web</code> ve <code>db</code> birbirine "arka" ağında konuşabilir.</li>
    <li><code>lb</code> ile <code>db</code> aynı ağda olmadığı için birbirini <strong>göremez bile</strong>. Bu güvenlik açısından harika: dışa açık bir servis derinlerdeki veritabanına direkt bağlanamaz.</li>
</ul>

<p>Bu desen, OWASP gibi güvenlik kılavuzlarının önerdiği <em>"defense in depth"</em> (katmanlı savunma) prensibinin Docker'daki uygulamasıdır.</p>

<h2>Gerçek Dünya Örneği 1 — WordPress + MySQL</h2>

<div class="code-block">
    <div class="code-block-header"><span>docker-compose.yml</span></div>
    <pre><code>services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wp
      WORDPRESS_DB_PASSWORD: wp_gizli
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wp_icerik:/var/www/html
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: kok_gizli
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wp
      MYSQL_PASSWORD: wp_gizli
    volumes:
      - db_verisi:/var/lib/mysql
    restart: unless-stopped

volumes:
  wp_icerik:
  db_verisi:</code></pre>
</div>
<p><code>docker compose up -d</code> — 30 saniye sonra <code>http://localhost:8080</code> tam fonksiyonel bir WordPress.</p>

<h2>Gerçek Dünya Örneği 2 — Tam Dolu Geliştirme Ortamı</h2>

<div class="code-block">
    <div class="code-block-header"><span>Web + API + DB + Cache + Admin panel</span></div>
    <pre><code>services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - api
    networks: [on, arka]

  api:
    build: ./api
    environment:
      DATABASE_URL: postgres://app:gizli@db:5432/app
      REDIS_URL: redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    networks: [arka]

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: gizli
      POSTGRES_DB: app
    volumes:
      - db_verisi:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 5
    networks: [arka]

  redis:
    image: redis:7-alpine
    volumes:
      - redis_verisi:/data
    networks: [arka]

  <span class="comment"># Geliştirici için DB yönetim paneli:</span>
  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@local
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    networks: [arka]

volumes:
  db_verisi:
  redis_verisi:

networks:
  on:
  arka:</code></pre>
</div>

<p>Tek komut: <code>docker compose up -d</code>. Bir dakika içinde çalışan bir tam sistem. Başka bir makineye kopyalayıp aynı komutu çalıştırırsanız aynısı ayağa kalkar.</p>

<h2>Geliştirme İçin Yararlı İpuçları</h2>

<h3>Canlı Kod Yansıtma (Hot Reload)</h3>
<div class="code-block">
    <div class="code-block-header"><span>Bind mount ile anında yansıma</span></div>
    <pre><code>services:
  api:
    build: ./api
    volumes:
      - ./api:/app           <span class="comment"># Host'taki kodu konteynere bağla</span>
    command: ["python", "app.py"]
    <span class="comment"># Artık api/app.py değiştirdiğinizde konteyner aynı dosyayı görür.
    # Flask/uvicorn gibi framework'lerin reload modunu açarsanız
    # yeniden başlatma gerekmeden değişiklikler yansır.</span></code></pre>
</div>

<h3>Farklı Compose Dosyaları (dev/prod)</h3>
<div class="code-block">
    <div class="code-block-header"><span>Birden çok YAML ile katmanlı yapılandırma</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker compose</span> <span class="flag">-f</span> <span class="argument">docker-compose.yml</span> <span class="flag">-f</span> <span class="argument">docker-compose.prod.yml up</span>

<span class="comment"># İkinci dosya ilkine override eder. Örn:
# - Dev'de volumes: ./api:/app  (hot reload)
# - Prod'da volumes yok, kod imaja gömülü</span></code></pre>
</div>

<h3>Profiles — İsteğe Bağlı Servisler</h3>
<p>Bazı servisleri sadece <strong>belirli durumlarda</strong> çalıştırmak isteyebilirsiniz. Mesela bir veritabanı yönetim paneli (pgAdmin) sadece geliştirme sırasında lazım — üretime çıkarken bunu çalıştırmak hem boşa kaynak yer hem güvenlik riski. <code>profiles</code> alanı bunu yönetir.</p>

<div class="code-block">
    <div class="code-block-header"><span>Sadece istediğinizde çalışsın</span></div>
    <pre><code>services:
  api: { ... }                    <span class="comment"># Profile yok → her zaman başlar</span>
  db:  { ... }                    <span class="comment"># Profile yok → her zaman başlar</span>

  pgadmin:
    image: dpage/pgadmin4
    profiles: ["dev"]             <span class="comment"># Sadece "dev" profilindeyken başlar</span>

  loadtester:
    image: locustio/locust
    profiles: ["test"]            <span class="comment"># Sadece "test" profilindeyken başlar</span>

<span class="comment"># Varsayılan kullanım (api + db başlar, pgadmin/loadtester başlamaz):</span>
<span class="prompt">$</span> <span class="command">docker compose up</span>

<span class="comment"># Geliştirme: api + db + pgadmin başlar:</span>
<span class="prompt">$</span> <span class="command">docker compose</span> <span class="flag">--profile</span> <span class="argument">dev up</span>

<span class="comment"># Yük testi: api + db + loadtester başlar:</span>
<span class="prompt">$</span> <span class="command">docker compose</span> <span class="flag">--profile</span> <span class="argument">test up</span></code></pre>
</div>

<p>Yani aynı <code>docker-compose.yml</code> dosyası ile birden çok kullanım senaryosu yönetirsiniz — ayrı dosyalar tutmaktansa.</p>

<h2>Hazır Popüler Docker İmajları ve Tek-Komut Denemeler</h2>

<div class="code-block">
    <div class="code-block-header"><span>Hemen deneyebileceğiniz imajlar</span></div>
    <pre><code><span class="comment"># 🐬 MySQL 8:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name mysql -p 3306:3306</span> \\
    <span class="flag">-e</span> <span class="argument">MYSQL_ROOT_PASSWORD=gizli mysql:8</span>

<span class="comment"># 🐘 PostgreSQL 16:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name pg -p 5432:5432</span> \\
    <span class="flag">-e</span> <span class="argument">POSTGRES_PASSWORD=gizli postgres:16</span>

<span class="comment"># 🍃 MongoDB 7:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name mongo -p 27017:27017 mongo:7</span>

<span class="comment"># 🔴 Redis 7:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name redis -p 6379:6379 redis:7-alpine</span>

<span class="comment"># 🐰 RabbitMQ yönetim paneli ile:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management</span>
<span class="comment"># http://localhost:15672 — guest / guest</span>

<span class="comment"># 📊 Grafana (dashboard):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name grafana -p 3000:3000 grafana/grafana</span>

<span class="comment"># 🔍 Elasticsearch:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name es -p 9200:9200</span> \\
    <span class="flag">-e</span> <span class="string">"discovery.type=single-node"</span> \\
    <span class="flag">-e</span> <span class="string">"xpack.security.enabled=false"</span> \\
    <span class="argument">docker.elastic.co/elasticsearch/elasticsearch:8.11.0</span>

<span class="comment"># 📧 MailHog (geliştirme için sahte SMTP):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name mail -p 1025:1025 -p 8025:8025 mailhog/mailhog</span>

<span class="comment"># 📝 Nextcloud (kendi cloud'unuz):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name cloud -p 8080:80 -v cloud:/var/www/html nextcloud</span>

<span class="comment"># 🎬 Jellyfin (medya sunucusu):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name jellyfin -p 8096:8096</span> \\
    <span class="flag">-v</span> <span class="argument">config:/config -v medya:/media jellyfin/jellyfin</span>

<span class="comment"># 🦜 Hello World (test için):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm</span> <span class="argument">hello-world</span>

<span class="comment"># 💬 Whalesay (eğlenceli, kullandıkça öğretici):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm</span> <span class="argument">docker/whalesay cowsay Selam!</span>

<span class="comment"># 🎯 Portainer (Docker için web yönetim arayüzü):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name portainer -p 9000:9000 \\</span>
    <span class="flag">-v</span> <span class="argument">/var/run/docker.sock:/var/run/docker.sock</span> \\
    <span class="flag">-v</span> <span class="argument">portainer:/data portainer/portainer-ce</span></code></pre>
</div>

<h2>Docker Ötesine Geçiş: Kubernetes ve Ötesi</h2>
<p>Docker'ı öğrenmek serüvenin ilk adımıdır. Üretim ortamlarında (özellikle büyük ölçekte) şu araçlar ortaya çıkar:</p>
<ul>
    <li><strong>Kubernetes (k8s)</strong>: Binlerce konteyneri birden fazla makinede yönetmek için orkestrasyon. Google'ın iç deneyiminden doğmuş, endüstri standardı.</li>
    <li><strong>Docker Swarm</strong>: Docker'ın kendi basit orkestrasyonu. Küçük ekipler için yeterli olabilir.</li>
    <li><strong>Podman</strong>: Docker'ın tamamen açık kaynak, daemon'suz alternatifi. Red Hat geliştiriyor.</li>
    <li><strong>containerd, CRI-O</strong>: Düşük seviyeli konteyner çalıştırıcılar. Kubernetes bunları kullanır.</li>
    <li><strong>Nomad</strong>: HashiCorp'un orkestratörü. Daha basit, esnek.</li>
    <li><strong>Buildah, Kaniko, BuildKit</strong>: Daemon'suz imaj build araçları.</li>
</ul>

<h2>Faydalı Kaynaklar 📚</h2>

<h3>Resmi Kaynaklar</h3>
<div class="info-box tip">
    <div class="info-box-title">📖 Resmi Dokümantasyon</div>
    <ul>
        <li><a href="https://docs.docker.com/" target="_blank" rel="noopener">docs.docker.com</a> — Docker'ın resmi, en güncel dokümantasyonu. Her konuda ilk başvurulacak yer.</li>
        <li><a href="https://docs.docker.com/get-started/" target="_blank" rel="noopener">Get Started (Docker)</a> — Resmi başlangıç rehberi, tam bir walkthrough.</li>
        <li><a href="https://docs.docker.com/reference/dockerfile/" target="_blank" rel="noopener">Dockerfile Reference</a> — Her talimatın tam açıklaması.</li>
        <li><a href="https://docs.docker.com/compose/" target="_blank" rel="noopener">Docker Compose Docs</a> — Compose için resmi belgeler.</li>
        <li><a href="https://docs.docker.com/reference/compose-file/" target="_blank" rel="noopener">Compose Specification</a> — docker-compose.yml'nin tam şeması.</li>
        <li><a href="https://hub.docker.com/" target="_blank" rel="noopener">hub.docker.com</a> — İmaj deposu.</li>
        <li><a href="https://github.com/docker-library/official-images" target="_blank" rel="noopener">Official Images (GitHub)</a> — Resmi imajların Dockerfile'ları (öğrenmek için altın).</li>
        <li><a href="https://docs.docker.com/develop/develop-images/dockerfile_best-practices/" target="_blank" rel="noopener">Best Practices</a> — Dockerfile yazımı için en iyi pratikler.</li>
    </ul>
</div>

<h3>Etkileşimli / Uygulamalı Öğrenme Siteleri</h3>
<div class="info-box tip">
    <div class="info-box-title">🎓 Interaktif Tutorial'lar</div>
    <ul>
        <li><a href="https://labs.play-with-docker.com/" target="_blank" rel="noopener">Play with Docker (PWD)</a> — Tarayıcıda ücretsiz Docker terminalleri. Kurulum yapmadan denemek için mükemmel.</li>
        <li><a href="https://dockerlabs.collabnix.com/" target="_blank" rel="noopener">Docker Labs</a> — Topluluk tabanlı çok kapsamlı pratikler.</li>
        <li><a href="https://www.katacoda.com/courses/docker" target="_blank" rel="noopener">Katacoda (arşiv)</a> — Klasik interaktif dersler (arşivlenmiş ama içerik değerli).</li>
        <li><a href="https://training.play-with-docker.com/" target="_blank" rel="noopener">Docker Training — PWD</a> — Seviye seviye uygulamalı ders serisi.</li>
    </ul>
</div>

<h3>Türkçe Kaynaklar</h3>
<div class="info-box tip">
    <div class="info-box-title">🇹🇷 Türkçe İçerikler</div>
    <ul>
        <li><a href="https://devops.muhammetbaltaci.com/docker-tutorial" target="_blank" rel="noopener">DevOps Türkçe — Docker Başlangıç</a> — Türkçe Docker girişi.</li>
        <li><a href="https://buraksenyurt.com/" target="_blank" rel="noopener">Burak Selim Şenyurt Blog</a> — Docker üzerine pek çok Türkçe yazı.</li>
        <li><a href="https://www.udemy.com/topic/docker/?lang=tr" target="_blank" rel="noopener">Udemy — Türkçe Docker Kursları</a> — Çeşitli seviyelerde ücretli kurslar.</li>
        <li><a href="https://devhunt.medium.com/" target="_blank" rel="noopener">Medium Türkçe Docker Yazıları</a> — Medium platformunda pek çok blog yazısı.</li>
    </ul>
</div>

<h3>YouTube Video Önerileri</h3>
<div class="info-box tip">
    <div class="info-box-title">📺 İngilizce — Güçlü Tavsiyeler</div>
    <ul>
        <li><a href="https://www.youtube.com/watch?v=pTFZFxd4hOI" target="_blank" rel="noopener">Programming with Mosh — Docker Tutorial for Beginners (1 saat)</a> — Sıfırdan, çok anlaşılır.</li>
        <li><a href="https://www.youtube.com/watch?v=3c-iBn73dDE" target="_blank" rel="noopener">TechWorld with Nana — Docker Tutorial for Beginners (3 saat)</a> — Çok kapsamlı bir ders. Baştan sona izleyin.</li>
        <li><a href="https://www.youtube.com/watch?v=fqMOX6JJhGo" target="_blank" rel="noopener">freeCodeCamp — Docker Full Course</a> — Tamamen ücretsiz, 2+ saatlik detaylı kurs.</li>
        <li><a href="https://www.youtube.com/watch?v=Gjnup-PuquQ" target="_blank" rel="noopener">NetworkChuck — You NEED to learn Docker RIGHT NOW!!</a> — Enerjik ve motive edici giriş.</li>
        <li><a href="https://www.youtube.com/c/Bretfisher" target="_blank" rel="noopener">Bret Fisher (Docker Captain)</a> — Docker uzmanı, pek çok derin konu videosu.</li>
        <li><a href="https://www.youtube.com/watch?v=HG6yIjZapSA" target="_blank" rel="noopener">Fireship — Docker in 100 Seconds</a> — 100 saniyede Docker özeti (hızlı tekrar için).</li>
    </ul>
</div>

<div class="info-box tip">
    <div class="info-box-title">📺 Türkçe YouTube Videoları</div>
    <ul>
        <li><a href="https://www.youtube.com/results?search_query=docker+t%C3%BCrk%C3%A7e+dersler" target="_blank" rel="noopener">YouTube: "docker türkçe dersler" araması</a></li>
        <li><a href="https://www.youtube.com/@Kodluyoruz" target="_blank" rel="noopener">Kodluyoruz YouTube Kanalı</a> — Türkçe yazılım derslerinin en büyük kanallarından biri, Docker videoları da var.</li>
        <li><a href="https://www.youtube.com/@mshowto" target="_blank" rel="noopener">MShowto</a> — Sistem ve DevOps alanında Türkçe içerikler.</li>
        <li><a href="https://www.youtube.com/@TurkcellGelecegiYazanlar" target="_blank" rel="noopener">Turkcell Geleceği Yazanlar</a> — Docker ve DevOps konularında kurs içerikleri.</li>
    </ul>
</div>

<h3>Faydalı Araçlar ve Projeler</h3>
<div class="info-box tip">
    <div class="info-box-title">🛠️ Araçlar</div>
    <ul>
        <li><a href="https://www.portainer.io/" target="_blank" rel="noopener">Portainer</a> — Docker için web tabanlı yönetim paneli. Yeni başlayanlar için çok kolay.</li>
        <li><a href="https://lazydocker.dev/" target="_blank" rel="noopener">Lazydocker</a> — Terminal tabanlı, htop benzeri Docker UI.</li>
        <li><a href="https://github.com/docker-slim/docker-slim" target="_blank" rel="noopener">docker-slim</a> — İmajlarınızı 10-30x küçültür, otomatik güvenlik sıkılaştırır.</li>
        <li><a href="https://github.com/wagoodman/dive" target="_blank" rel="noopener">dive</a> — İmaj katmanlarını detaylı inceleyen araç. Büyük imajları zayıflatmak için.</li>
        <li><a href="https://github.com/aquasecurity/trivy" target="_blank" rel="noopener">Trivy</a> — Açık kaynak güvenlik tarayıcı. Bilinen CVE'leri bulur.</li>
        <li><a href="https://github.com/veggiemonk/awesome-docker" target="_blank" rel="noopener">Awesome Docker (GitHub)</a> — Docker araç, tutorial, kaynak dev listesi.</li>
    </ul>
</div>

<h3>Kitap Önerileri</h3>
<div class="info-box tip">
    <div class="info-box-title">📚 Kitaplar</div>
    <ul>
        <li><strong>Docker Deep Dive</strong> — Nigel Poulton. Sıfırdan ileri seviyeye, en popüler Docker kitabı.</li>
        <li><strong>Docker in Action</strong> — Jeff Nickoloff. Manning yayınlarından, pratik ağırlıklı.</li>
        <li><strong>Learning Docker</strong> — Pethuru Raj et al. Akademik stilde.</li>
        <li><strong>Docker in Practice</strong> — Ian Miell & Aidan Sayers. Problem/çözüm odaklı 100+ teknik.</li>
    </ul>
</div>

<h3>Cheatsheet'ler</h3>
<div class="info-box tip">
    <div class="info-box-title">📋 Hızlı Referanslar</div>
    <ul>
        <li><a href="https://dockerlabs.collabnix.com/docker/cheatsheet/" target="_blank" rel="noopener">Docker Cheatsheet (Collabnix)</a></li>
        <li><a href="https://devhints.io/docker-compose" target="_blank" rel="noopener">docker-compose Cheatsheet (devhints.io)</a></li>
        <li><a href="https://docs.docker.com/get-started/docker_cheatsheet.pdf" target="_blank" rel="noopener">Resmi Docker Cheatsheet PDF</a></li>
    </ul>
</div>

<h2>Çalışma Önerisi — Sıfırdan İleriye Bir Yol Haritası</h2>
<ol>
    <li><strong>Hello World</strong>: <code>docker run hello-world</code> ve <code>docker run -it ubuntu bash</code> ile oyna.</li>
    <li><strong>NGINX'i dene</strong>: Bir web sunucusunu çalıştır, port eşlemesiyle tarayıcıdan erişmeyi öğren.</li>
    <li><strong>Veritabanı</strong>: PostgreSQL veya MySQL konteyneri başlat, istemciden bağlan.</li>
    <li><strong>Küçük bir Dockerfile</strong>: Tek dosyalık bir Python/Node script'ini konteyner haline getir.</li>
    <li><strong>Docker Hub'a push</strong>: Kendi imajını paylaş.</li>
    <li><strong>Compose</strong>: Web + DB birlikte tutan bir compose dosyası yaz.</li>
    <li><strong>Volume + Network</strong>: Veri kalıcılığını ve konteyner isimleriyle iletişimi dene.</li>
    <li><strong>Multi-stage build</strong>: Go/Rust/Node bir projeyi inceltip en küçük imaj üret.</li>
    <li><strong>Bir gerçek proje Dockerize et</strong>: Var olan bir hobby projesini konteynerlere al.</li>
    <li><strong>Bir sunucuya deploy et</strong>: DigitalOcean/Hetzner/AWS'te bir VPS al, imajını oraya deploy et.</li>
</ol>

<div class="info-box tip">
    <div class="info-box-title">💡 Son Söz: Bol Pratik</div>
    Docker öğrenmenin en iyi yolu parmakları klavyede tutmaktır. Hataya düşün, logları okuyun, soruları <a href="https://stackoverflow.com/questions/tagged/docker" target="_blank" rel="noopener">Stack Overflow</a>'da aratın, <a href="https://hub.docker.com/search" target="_blank" rel="noopener">Docker Hub'da</a> rastgele imajlar deneyin. Kısa sürede konteynerler günlük aracınız haline gelecek.
</div>

<h2>Genel Özet — Docker Bölümleri</h2>
<ul>
    <li><strong>Bölüm 28</strong>: Docker nedir, neden var, konteyner vs VM, temel kavramlar.</li>
    <li><strong>Bölüm 29</strong>: <code>run, ps, logs, exec</code>, port eşleme, bridge ağı, volume'ler.</li>
    <li><strong>Bölüm 30</strong>: Dockerfile ile kendi imajınız, katman önbelleği, Docker Hub.</li>
    <li><strong>Bölüm 31</strong>: Docker Compose ile çok konteynerli uygulamalar, gerçek örnekler, kaynaklar.</li>
    <li><strong>Bölüm 32</strong>: Docker ile oyna — hazır imajlar, self-hosted, bulut.</li>
    <li><strong>Bölüm 33–37</strong>: CI/CD — GitHub Actions, Docker pipeline, otomatik deploy.</li>
    <li><strong>Bölüm 38–42</strong>: Kubernetes — kavramlar, kubectl, YAML, Service/ConfigMap, Helm ve kaynaklar.</li>
</ul>
<p>Tebrikler! Docker dünyasına güçlü bir girişiniz var. CI/CD ile otomasyonu, Kubernetes ile orkestrasyonu öğrenmeye devam edebilirsiniz. Mutlu konteynerlemeler! 🐳</p>
`,
    quiz: [
        {
            question: "Docker Compose ne için kullanılır?",
            options: [
                "Birden fazla konteyneri tek bir YAML dosyasında tanımlayıp",
                "Konteynerleri internete yüklemek yerine farklı bir komut",
                "Bu senaryoda docker'ı güncellemek — bu davranış beklenmez",
                "Bu senaryoda sadece tek bir konteyner başlatmak ve işlemi sonlandırır"
            ],
            correct: 0,
            explanation: "Docker Compose, birden çok konteyneri, ağları ve volume'leri tek bir docker-compose.yml dosyasında tanımlamanıza ve \"docker compose up\" gibi tek komutlarla yönetmenize izin verir."
        },
        {
            question: "docker compose up -d komutu ne yapar?",
            options: [
                "Servisleri arka planda (detached) başlatır",
                "Tüm Docker verilerini siler",
                "Sadece tek bir servisi başlatır",
                "Konteynerleri günceller — bu davranış beklenmez"
            ],
            correct: 0,
            explanation: "-d bayrağı \"detached\" anlamına gelir — servisler arka planda başlar, terminal size geri döner. Logları ayrıca docker compose logs -f ile takip edebilirsiniz."
        },
        {
            question: "docker-compose.yml içindeki depends_on ne garanti eder?",
            options: [
                "Ağların otomatik oluşmasını",
                "Bağımlı servisin yalnızca BAŞLATILMASINI",
                "Bağımlı servisin tam hazır olmasını",
                "Servisi asla durdurmamayı yerine farklı bir komut"
            ],
            correct: 1,
            explanation: "depends_on varsayılan olarak sadece \"başlatılma\" sırasını garantiler; servis gerçekten hizmet vermeye hazır mı kontrol etmez. Gerçek hazırlık için healthcheck ve \"condition: service_healthy\" kullanılır."
        },
        {
            question: "Aşağıdakilerden hangisi docker-compose.yml'de bir named volume'ün doğru tanımlanma şeklidir?",
            options: [
                "services içinde kullanılır",
                "Sadece networks bloğunda tanımlanır",
                "Sadece services bloğuna yazılmalı",
                "Volume'ler compose ile kullanılamaz"
            ],
            correct: 0,
            explanation: "Named volume'ler önce services bloğunda bir servise bağlanır (volumes: - isim:/yol), sonra YAML'in en üst seviyesindeki volumes: bloğunda bildirilir."
        },
        {
            question: "docker compose down ile docker compose stop arasındaki fark nedir?",
            options: [
                "down konteynerleri durdurup SİLER",
                "down sadece tek bir servisi siler",
                "stop kalıcıdır, down değildir",
                "Fark yoktur ve işlemi sonlandırır"
            ],
            correct: 0,
            explanation: "stop, konteynerleri durdurur ama siler. Yeniden başlatılabilir. down ise durdurup konteynerleri, ağları ve (ek -v ile) volume'leri siler — sıfırdan başlangıç."
        },
        {
            question: "Compose'da bir servis başka bir servisi hangi isimle çağırabilir?",
            options: [
                "Host adı ile mümkün değildir",
                "Sadece IP adresiyle ve işlemi sonlandırır",
                "Konteyner ID'siyle yerine farklı bir komut",
                "Compose dosyasındaki servisin adıyla"
            ],
            correct: 3,
            explanation: "Docker Compose, servisleri aynı ağa koyar ve her servisin adını DNS olarak ayarlar. Böylece \"web\" servisi, \"db\" servisine http://db:5432 gibi sadece servis ismiyle erişebilir."
        },
        {
            question: "Aşağıdakilerden hangisi Docker için alternatif orkestrasyon aracıdır?",
            options: [
                "cron",
                "Kubernetes",
                "grep",
                "SSH ve işlemi sonlandırır"
            ],
            correct: 1,
            explanation: "Kubernetes, binlerce konteyneri birden fazla makinede yönetmek için kullanılan endüstri standardı orkestrasyon platformudur. Docker Swarm ve Nomad da alternatiflerdir."
        },
        {
            question: ".env dosyasının docker compose ile ilişkisi nedir?",
            options: [
                "Sadece docker run ile çalışır yerine farklı bir komut",
                "Bu senaryoda compose ignore eder ve işlemi sonlandırır",
                "Bir dökümantasyon dosyasıdır — bu davranış beklenmez",
                "Compose çalıştırıldığı dizindeki .env'yi otomatik okur"
            ],
            correct: 3,
            explanation: "Docker Compose, çalıştığı dizindeki .env dosyasını otomatik yükler. docker-compose.yml içinde ${DB_PASSWORD} gibi referanslar bu dosyadan değerlerini alır. Sır bilgilerini YAML'e yazmaktan kaçınmak için idealdir."
        },
        {
            question: "Compose'da healthcheck neden önemlidir?",
            options: [
                "Port açar — bu davranış beklenmez",
                "Bir servisin \"başlatıldı\" değil",
                "Docker'ı hızlandırır",
                "Görsel bir rozet eklemek için"
            ],
            correct: 1,
            explanation: "healthcheck, bir konteynerin çalışıyor görünse bile gerçekten servisi verir halde olup olmadığını periyodik test eder. depends_on ile \"condition: service_healthy\" kullanınca web servisi, DB hazır olmadan başlamaz."
        }
    ]
});
