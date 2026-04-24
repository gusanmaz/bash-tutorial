// ===== Bölüm 27: Docker ile Oyna — Eğlenceli İmajlar, Deneyler ve Hosting =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 27,
    title: 'Docker ile Oyna ve Yayına Çıkar',
    subtitle: 'Play with Docker: Fun Images, Experiments & Hosting',
    icon: '🎪',
    description: 'Oyuncak/eğlenceli Docker imajlarıyla oyna, portları ve ayarları değiştir, imajları birleştir. Konteynerleri VPS, bulut ve PaaS platformlarında nasıl yayına çıkarırsın? Geniş kaynak listesi.',
    content: `
<h2>Bu Bölümün Felsefesi</h2>
<p>Önceki bölümlerde <em>nasıl</em>'ı öğrendiniz. Şimdi <em>neden olmasın?</em> zamanı. Docker'ın gücü binlerce hazır imajın yaratıcı şekillerde birleşmesinde yatıyor. Bu bölüm, oynayarak öğrenmeniz için.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Oyun Kuralları</div>
    <ul>
        <li>Her imajı gerçekten başlat. Sadece okuyup geçme.</li>
        <li>Port değiştir, env değiştir, volume ekle. Bir şey kırılırsa harika — öğreniyorsunuz.</li>
        <li>Beğenmediğini sil: <code>docker rm -f &lt;isim&gt;</code>. Makinenize zarar gelmez.</li>
        <li>Birden çok imajı aynı ağa koyup konuşturmaya çalış.</li>
    </ul>
</div>

<h2>1. Klasikler — "Selam Konteyner Dünyası"</h2>

<h3>🐳 whalesay — Konuşan Balina</h3>
<div class="code-block">
    <div class="code-block-header"><span>Cowsay'in balina kardeşi</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm</span> <span class="argument">docker/whalesay cowsay "Merhaba Docker!"</span>
<span class="output"> _________________
&lt; Merhaba Docker! &gt;
 -----------------
    \\
     \\
      \\
                    ##        .
              ## ## ##       ==
           ## ## ## ##      ===
       /""""""""""""""""___/ ===
  ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ / __/ ===</span></code></pre>
</div>

<h3>🐂 cowsay — Klasik Unix Eğlencesi</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm</span> <span class="argument">grycap/cowsay "Docker öğreniyorum"</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm</span> <span class="argument">grycap/cowsay</span> <span class="flag">-f</span> <span class="argument">tux "Tux selam gönderiyor!"</span></code></pre>

<h3>🔤 figlet — Büyük ASCII Yazılar</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm</span> <span class="argument">ellerbrock/figlet "DOCKER"</span></code></pre>

<h3>🌟 asciiquarium (Terminal'de Akvaryum!)</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm -it</span> <span class="argument">mikesplain/asciiquarium</span>
<span class="comment"># Ctrl+C ile çık. Balıkları terminalinizde izleyin.</span></code></pre>

<h3>🚂 sl — Ray Tren</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm</span> <span class="argument">tsl0922/sl</span>
<span class="comment"># "ls" yerine "sl" yazan mühendisleri cezalandıran klasik Unix şakası</span></code></pre>

<h2>2. Niche ve Spesifik İmajlar</h2>

<h3>🎵 Beets — Müzik Kütüphanesi Düzenleyicisi</h3>
<div class="code-block">
    <div class="code-block-header"><span>Müzik koleksiyonunu etiketleyip düzenleyin</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-it --rm</span> \\
    <span class="flag">-v</span> <span class="argument">$(pwd)/muzik:/music</span> \\
    <span class="argument">lscr.io/linuxserver/beets beet import /music</span></code></pre>
</div>

<h3>📸 PhotoStructure — Kişisel Fotoğraf Kütüphanesi</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">1787:1787</span> \\
    <span class="flag">-v</span> <span class="argument">$(pwd)/fotolar:/photos</span> \\
    <span class="argument">photostructure/server</span></code></pre>

<h3>📚 Calibre-web — Kişisel Kitap Kütüphanesi</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">8083:8083</span> \\
    <span class="flag">-v</span> <span class="argument">$(pwd)/kitaplar:/books</span> \\
    <span class="argument">linuxserver/calibre-web</span></code></pre>

<h3>🎮 Retropie — Retro Oyun Emülatörü (web üzerinden)</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">8080:8080</span> <span class="argument">fermentor/retropie-web</span></code></pre>

<h3>🎨 Stable Diffusion WebUI — AI ile Resim Üretimi</h3>
<p>GPU'nuz varsa resim oluşturabilirsiniz:</p>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --gpus all -p</span> <span class="argument">7860:7860</span> \\
    <span class="argument">universonic/stable-diffusion-webui</span></code></pre>

<h3>🗣️ Piper — Metin-Konuşma (TTS)</h3>
<pre><code><span class="prompt">$</span> <span class="command">echo</span> <span class="string">"Docker harika bir araç!"</span> <span class="operator">|</span> \\
    <span class="command">docker run</span> <span class="flag">--rm -i</span> <span class="argument">rhasspy/wyoming-piper</span></code></pre>

<h3>🧮 Jupyter — Pandas ve Veri Bilimi Not Defteri</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">8888:8888</span> <span class="argument">jupyter/scipy-notebook</span>
<span class="comment"># Loglarda access token var:
# docker logs &lt;ad&gt; | grep token=</span></code></pre>

<h3>📊 Uptime Kuma — Kendi Uptime Monitörünüz</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">3001:3001</span> \\
    <span class="flag">-v</span> <span class="argument">uptime-kuma:/app/data</span> <span class="argument">louislam/uptime-kuma</span>
<span class="comment"># http://localhost:3001 — sitelerinizi ücretsiz izleyin</span></code></pre>

<h3>🗒️ Trilium / Joplin Server — Kendi Notlarınız</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">8080:8080</span> \\
    <span class="flag">-v</span> <span class="argument">trilium:/root/trilium-data zadam/trilium</span></code></pre>

<h3>☁️ Nextcloud — Kendi Google Drive'ınız</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name cloud -p</span> <span class="argument">8080:80</span> \\
    <span class="flag">-v</span> <span class="argument">nc:/var/www/html nextcloud</span></code></pre>

<h3>🎬 Jellyfin — Kendi Netflix'iniz</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name jellyfin -p</span> <span class="argument">8096:8096</span> \\
    <span class="flag">-v</span> <span class="argument">jellyfin_config:/config</span> \\
    <span class="flag">-v</span> <span class="argument">$(pwd)/medya:/media</span> \\
    <span class="argument">jellyfin/jellyfin</span></code></pre>

<h3>🏠 Home Assistant — Akıllı Ev Merkezi</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name homeassistant -p</span> <span class="argument">8123:8123</span> \\
    <span class="flag">-v</span> <span class="argument">$(pwd)/ha-config:/config</span> \\
    <span class="argument">ghcr.io/home-assistant/home-assistant:stable</span></code></pre>

<h3>📝 WikiJS — Kurumsal Wiki</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">3000:3000</span> <span class="argument">requarks/wiki</span></code></pre>

<h3>🎙️ Audiobookshelf — Sesli Kitap ve Podcast Sunucusu</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">13378:80</span> \\
    <span class="flag">-v</span> <span class="argument">$(pwd)/sesli-kitaplar:/audiobooks</span> \\
    <span class="flag">-v</span> <span class="argument">abs_config:/config</span> \\
    <span class="argument">ghcr.io/advplyr/audiobookshelf</span></code></pre>

<h3>🔒 Vaultwarden — Kendi Bitwarden'ınız</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name vw -p</span> <span class="argument">8080:80</span> \\
    <span class="flag">-v</span> <span class="argument">vw-data:/data vaultwarden/server</span></code></pre>

<h3>🐘 PostgreSQL Admin Panelleri</h3>
<pre><code><span class="comment"># pgAdmin — büyük ve kapsamlı:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">5050:80</span> \\
    <span class="flag">-e</span> <span class="argument">PGADMIN_DEFAULT_EMAIL=admin@local</span> \\
    <span class="flag">-e</span> <span class="argument">PGADMIN_DEFAULT_PASSWORD=admin</span> \\
    <span class="argument">dpage/pgadmin4</span>

<span class="comment"># Adminer — tek binary, hafif ve şirin:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">8080:8080 adminer</span></code></pre>

<h3>📡 It-Tools — Geliştiricinin İsviçre Çakısı (online araçların toplamı)</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">8080:80 corentinth/it-tools</span>
<span class="comment"># JSON formatter, base64, UUID, regex tester... hepsi tek web arayüzünde.</span></code></pre>

<h3>🌐 LinkWarden / LinkAce — Kişisel Bookmark Yöneticisi</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">3000:3000 ghcr.io/linkwarden/linkwarden</span></code></pre>

<h2>3. "Biraz Garip" İmajlar 🌀</h2>

<h3>🦥 slowloris — Eski bir DoS aracı (sadece LAB için!)</h3>
<p>Kendi test sunucunuzu nasıl stres testine sokacağınızı görmek için:</p>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm</span> <span class="argument">infosecurityit/slowloris http://localhost:8080</span>
<span class="comment"># UYARI: İzniniz olmayan siteye ASLA kullanmayın!</span></code></pre>

<h3>🎲 nyancat — Terminalde nyan cat</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm -it</span> <span class="argument">ghcr.io/klange/nyancat</span></code></pre>

<h3>🌈 lolcat — Renkli terminal çıktısı</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm</span> <span class="argument">pablobarral/lolcat</span> <span class="string">"Docker renkli dünya!"</span></code></pre>

<h3>🐍 Snake oyun (terminal)</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm -it</span> <span class="argument">robertdebock/docker-snake</span></code></pre>

<h2>4. Portları ve Ayarları Değiştirerek Oyna 🎛️</h2>

<p>İmajları olduğu gibi çalıştırmak kolay. Gerçek öğrenme, onları <strong>kendinize göre ayarladığınızda</strong> başlar. Şu deneyleri yapın:</p>

<h3>Alıştırma 1: Aynı İmajın Üç Kopyasını Aynı Anda Çalıştır</h3>
<div class="code-block">
    <div class="code-block-header"><span>Üç NGINX, üç farklı port</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name n1 -p</span> <span class="argument">8081:80 nginx</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name n2 -p</span> <span class="argument">8082:80 nginx</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name n3 -p</span> <span class="argument">8083:80 nginx</span>

<span class="prompt">$</span> <span class="command">curl</span> <span class="argument">http://localhost:8081</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="argument">http://localhost:8082</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="argument">http://localhost:8083</span>
<span class="comment"># Aynı imaj — 3 bağımsız sunucu — 3 farklı port.
# Sanal makine ile bunu yapmak saatler alır.</span></code></pre>
</div>

<h3>Alıştırma 2: Kendi Anasayfanı Koy</h3>
<div class="code-block">
    <div class="code-block-header"><span>NGINX'in içindeki web sayfasını değiştir</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">mkdir</span> <span class="argument">benim-site</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="operator">&gt;</span> <span class="path">benim-site/index.html</span> <span class="operator">&lt;&lt;</span> <span class="string">EOF</span>
&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;title&gt;Benim İlk Sitem&lt;/title&gt;&lt;/head&gt;
&lt;body style="font-family:sans-serif;padding:3rem;background:#0b1020;color:#fff"&gt;
  &lt;h1&gt;🐳 Docker'dan selam!&lt;/h1&gt;
  &lt;p&gt;Bu sayfa konteyner içindeki NGINX tarafından sunuluyor.&lt;/p&gt;
&lt;/body&gt;&lt;/html&gt;
EOF

<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name site</span> \\
    <span class="flag">-v</span> <span class="argument">$(pwd)/benim-site:/usr/share/nginx/html:ro</span> \\
    <span class="flag">-p</span> <span class="argument">8080:80 nginx:alpine</span>

<span class="prompt">$</span> <span class="command">curl</span> <span class="argument">http://localhost:8080</span>
<span class="comment"># HTML'i düzenleyin — anında yansır!</span></code></pre>
</div>

<h3>Alıştırma 3: Postgres'e Farklı Port Ver</h3>
<p>Hostunuzda zaten PostgreSQL kuruluysa 5432 doludur. Konteynerinizi farklı porta açın:</p>
<div class="code-block">
    <div class="code-block-header"><span>Host portunu özgürce seç</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name pg2 \\</span>
    <span class="flag">-p</span> <span class="argument">15432:5432</span> \\
    <span class="flag">-e</span> <span class="argument">POSTGRES_PASSWORD=test postgres:16</span>

<span class="comment"># Bağlanırken 15432'yi kullan — konteyner içinde hâlâ 5432:</span>
<span class="prompt">$</span> <span class="command">psql</span> <span class="flag">-h</span> <span class="argument">localhost</span> <span class="flag">-p</span> <span class="argument">15432 -U postgres</span></code></pre>
</div>

<h3>Alıştırma 4: Environment Değişkenleriyle Davranışı Değiştir</h3>
<div class="code-block">
    <div class="code-block-header"><span>MariaDB'yi sıfırdan yapılandır</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name maria</span> \\
    <span class="flag">-e</span> <span class="argument">MARIADB_ROOT_PASSWORD=kok_gizli</span> \\
    <span class="flag">-e</span> <span class="argument">MARIADB_DATABASE=uygulama</span> \\
    <span class="flag">-e</span> <span class="argument">MARIADB_USER=dev</span> \\
    <span class="flag">-e</span> <span class="argument">MARIADB_PASSWORD=dev_gizli</span> \\
    <span class="flag">-p</span> <span class="argument">3306:3306 mariadb:11</span>

<span class="comment"># Aynı imaj, başka env değişkenleriyle tamamen farklı yapılandırılmış bir veritabanı.
# Imajın README'sini okuyup hangi env'ler desteklenmiş bakın: hub.docker.com/_/mariadb</span></code></pre>
</div>

<h3>Alıştırma 5: Bir Debug Aracını İçeri Sok</h3>
<p>Bir konteyner çalışıyor ama içinde <code>curl</code> yok mu? Başka bir konteynerden aynı ağda debug edin:</p>
<pre><code><span class="prompt">$</span> <span class="command">docker network create</span> <span class="argument">test</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name web --network</span> <span class="argument">test nginx</span>

<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm -it --network</span> <span class="argument">test nicolaka/netshoot</span>
<span class="comment"># netshoot = ağ hata ayıklama araçlarının toplamı
# İçinde curl, wget, dig, nmap, tcpdump, netstat...</span>

<span class="output">netshoot#</span> <span class="command">curl</span> <span class="argument">http://web</span>         <span class="comment"># Aynı ağda isimle</span>
<span class="output">netshoot#</span> <span class="command">dig</span> <span class="argument">web</span>                 <span class="comment"># DNS kaydı</span>
<span class="output">netshoot#</span> <span class="command">nmap</span> <span class="argument">web</span></code></pre>

<h2>5. Birkaç İmajı Birleştirerek Mini Mimariler Kur 🏗️</h2>

<h3>Proje A: Wordpress + MySQL + phpMyAdmin</h3>
<div class="code-block">
    <div class="code-block-header"><span>Tam bir CMS ortamı — 4 komut</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker network create</span> <span class="argument">wp-ag</span>

<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name db --network</span> <span class="argument">wp-ag</span> \\
    <span class="flag">-e</span> <span class="argument">MYSQL_ROOT_PASSWORD=kok</span> \\
    <span class="flag">-e</span> <span class="argument">MYSQL_DATABASE=wp</span> \\
    <span class="flag">-e</span> <span class="argument">MYSQL_USER=wp</span> \\
    <span class="flag">-e</span> <span class="argument">MYSQL_PASSWORD=wp_gizli</span> \\
    <span class="flag">-v</span> <span class="argument">wp_db:/var/lib/mysql mysql:8</span>

<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name wp --network</span> <span class="argument">wp-ag</span> \\
    <span class="flag">-e</span> <span class="argument">WORDPRESS_DB_HOST=db</span> \\
    <span class="flag">-e</span> <span class="argument">WORDPRESS_DB_USER=wp</span> \\
    <span class="flag">-e</span> <span class="argument">WORDPRESS_DB_PASSWORD=wp_gizli</span> \\
    <span class="flag">-e</span> <span class="argument">WORDPRESS_DB_NAME=wp</span> \\
    <span class="flag">-p</span> <span class="argument">8080:80 wordpress</span>

<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name pma --network</span> <span class="argument">wp-ag</span> \\
    <span class="flag">-e</span> <span class="argument">PMA_HOST=db</span> \\
    <span class="flag">-p</span> <span class="argument">8081:80 phpmyadmin</span>

<span class="comment"># localhost:8080 → WordPress
# localhost:8081 → phpMyAdmin (aynı veritabanına)</span></code></pre>
</div>

<h3>Proje B: Web + Redis + Kendi Yazdığınız Python Script</h3>
<div class="code-block">
    <div class="code-block-header"><span>Tam bir backend örneği</span></div>
    <pre><code><span class="comment"># 1) Ağ ve Redis:</span>
<span class="prompt">$</span> <span class="command">docker network create</span> <span class="argument">app</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name cache --network</span> <span class="argument">app redis:alpine</span>

<span class="comment"># 2) Python scriptinizi direkt çalıştırın:</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="operator">&gt;</span> <span class="path">app.py</span> <span class="operator">&lt;&lt;</span> <span class="string">EOF</span>
import os, time, redis
r = redis.Redis(host='cache')
for i in range(10):
    r.set(f'key_{i}', f'value_{i}')
print("Yazdı:", r.keys())
EOF

<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm --network</span> <span class="argument">app</span> \\
    <span class="flag">-v</span> <span class="argument">$(pwd):/code -w /code python:3.12-slim</span> \\
    <span class="command">bash</span> <span class="flag">-c</span> <span class="string">"pip install redis -q && python app.py"</span>
<span class="output">Yazdı: [b'key_0', b'key_1', ...]</span></code></pre>
</div>

<h3>Proje C: ELK Benzeri İzleme Stack'i (Grafana + Prometheus)</h3>
<pre><code><span class="prompt">$</span> <span class="command">docker network create</span> <span class="argument">monitor</span>

<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name prom --network</span> <span class="argument">monitor</span> \\
    <span class="flag">-p</span> <span class="argument">9090:9090 prom/prometheus</span>

<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name grafana --network</span> <span class="argument">monitor</span> \\
    <span class="flag">-p</span> <span class="argument">3000:3000 grafana/grafana</span>

<span class="comment"># localhost:3000 → Grafana (admin/admin)
# Prometheus'u veri kaynağı olarak ekle (http://prom:9090).</span></code></pre>

<h2>6. Konteynerleri Nerede Çalıştırabilirsiniz? 🌍</h2>

<p>Yerelde güzel ama başkaları nasıl ulaşacak? Konteyneri <em>yayına almak</em> için onlarca yol var. İşte haritayı tanıyalım.</p>

<h3>6.1. Kendi Sunucunuz (VPS / Dedicated)</h3>
<p>Bir VPS (Sanal Özel Sunucu) satın alın, Docker'ı kurun, konteynerlerinizi başlatın. En esnek ve en ucuz yol.</p>

<table>
    <tr><th>Sağlayıcı</th><th>Başlangıç Fiyatı</th><th>Not</th></tr>
    <tr><td><a href="https://www.hetzner.com/" target="_blank" rel="noopener">Hetzner</a></td><td>€3.79/ay</td><td>Performans/fiyat şampiyonu, Almanya/Finlandiya</td></tr>
    <tr><td><a href="https://www.digitalocean.com/" target="_blank" rel="noopener">DigitalOcean</a></td><td>$4/ay</td><td>Geliştirici dostu arayüz, bol dokümantasyon</td></tr>
    <tr><td><a href="https://www.linode.com/" target="_blank" rel="noopener">Linode (Akamai)</a></td><td>$5/ay</td><td>Eski ve güvenilir</td></tr>
    <tr><td><a href="https://www.vultr.com/" target="_blank" rel="noopener">Vultr</a></td><td>$2.50/ay</td><td>Çok bölge</td></tr>
    <tr><td><a href="https://www.oracle.com/cloud/free/" target="_blank" rel="noopener">Oracle Cloud Free</a></td><td>$0</td><td>Her zaman ücretsiz 2 ARM VM (4 vCPU, 24 GB RAM) — inanılmaz</td></tr>
    <tr><td><a href="https://cloud.google.com/free" target="_blank" rel="noopener">Google Cloud Free</a></td><td>$0 (sınırlı)</td><td>e2-micro 1 adet ücretsiz</td></tr>
    <tr><td><a href="https://aws.amazon.com/free/" target="_blank" rel="noopener">AWS Free Tier</a></td><td>$0 (12 ay)</td><td>t2.micro / t3.micro</td></tr>
    <tr><td><a href="https://www.contabo.com/" target="_blank" rel="noopener">Contabo</a></td><td>€5.5/ay</td><td>Aşırı bol RAM/disk, yavaş olabilir</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Tipik VPS Akışı</div>
    <ol>
        <li>VPS satın al (Ubuntu 22.04 seç).</li>
        <li>SSH ile bağlan (<code>ssh root@IP</code>).</li>
        <li>Docker kur: <code>curl -fsSL https://get.docker.com | sh</code></li>
        <li><code>docker run -d -p 80:80 imaj</code> — hazır! <code>http://IP</code>'ye git.</li>
        <li>Alan adı (domain) için Cloudflare veya doğrudan DNS'ten A kaydı ekle.</li>
        <li>Traefik veya Nginx Proxy Manager ile HTTPS/reverse proxy kur.</li>
    </ol>
</div>

<h3>6.2. Platform-as-a-Service (PaaS) — "Sadece Konteyneri Ver, Gerisini Biz Yaparız"</h3>
<p>Docker imajını veya Git deposunu bağlarsınız, platform kendi kendine deploy eder, SSL, load balancing, log'ları her şeyi halleder.</p>

<table>
    <tr><th>Platform</th><th>Ücretsiz?</th><th>Not</th></tr>
    <tr><td><a href="https://railway.app/" target="_blank" rel="noopener">Railway</a></td><td>Sınırlı ücretsiz</td><td>En kolay modern PaaS, bir dakikada deploy</td></tr>
    <tr><td><a href="https://render.com/" target="_blank" rel="noopener">Render</a></td><td>Ücretsiz web servisler</td><td>GitHub'dan otomatik, Docker destekler</td></tr>
    <tr><td><a href="https://fly.io/" target="_blank" rel="noopener">Fly.io</a></td><td>Cömert ücretsiz katman</td><td>Küresel edge konumlar, süper hızlı</td></tr>
    <tr><td><a href="https://www.koyeb.com/" target="_blank" rel="noopener">Koyeb</a></td><td>Ücretsiz katman</td><td>Avrupa odaklı</td></tr>
    <tr><td><a href="https://northflank.com/" target="_blank" rel="noopener">Northflank</a></td><td>Sınırlı ücretsiz</td><td>Docker-native, güçlü CI</td></tr>
    <tr><td><a href="https://www.heroku.com/" target="_blank" rel="noopener">Heroku</a></td><td>Ücretli (ücretsiz kalmadı)</td><td>Klasik; Docker imaj deploy destekler</td></tr>
    <tr><td><a href="https://www.digitalocean.com/products/app-platform" target="_blank" rel="noopener">DigitalOcean App Platform</a></td><td>Ücretli</td><td>DO ekosistemi ile entegre</td></tr>
    <tr><td><a href="https://sliplane.io/" target="_blank" rel="noopener">Sliplane</a></td><td>Ücretli ama ucuz</td><td>Docker imajları için minimalist PaaS</td></tr>
</table>

<h3>6.3. Büyük Bulut Platformlarında Konteyner Servisleri</h3>
<p>Kurumsal ölçekte Docker konteynerlerini çalıştırmanın yolu:</p>

<table>
    <tr><th>Servis</th><th>Sağlayıcı</th><th>Ne Yapar</th></tr>
    <tr><td><a href="https://aws.amazon.com/ecs/" target="_blank" rel="noopener">AWS ECS</a></td><td>Amazon</td><td>Konteyner orkestrasyon (Docker Swarm benzeri)</td></tr>
    <tr><td><a href="https://aws.amazon.com/fargate/" target="_blank" rel="noopener">AWS Fargate</a></td><td>Amazon</td><td>Sunucusuz konteyner (kendi EC2'nizi ayarlamıyorsunuz)</td></tr>
    <tr><td><a href="https://aws.amazon.com/eks/" target="_blank" rel="noopener">AWS EKS</a></td><td>Amazon</td><td>Yönetilen Kubernetes</td></tr>
    <tr><td><a href="https://cloud.google.com/run" target="_blank" rel="noopener">Google Cloud Run</a></td><td>Google</td><td>Konteyneri "fonksiyon" gibi çalıştırır, 0'a iner</td></tr>
    <tr><td><a href="https://cloud.google.com/kubernetes-engine" target="_blank" rel="noopener">Google GKE</a></td><td>Google</td><td>Kubernetes'in doğduğu yer</td></tr>
    <tr><td><a href="https://azure.microsoft.com/en-us/products/container-instances" target="_blank" rel="noopener">Azure Container Instances</a></td><td>Microsoft</td><td>Tek konteyner hızlı çalıştırma</td></tr>
    <tr><td><a href="https://azure.microsoft.com/en-us/products/kubernetes-service" target="_blank" rel="noopener">Azure AKS</a></td><td>Microsoft</td><td>Yönetilen Kubernetes</td></tr>
</table>

<h3>6.4. Kendini-Barındıran (Self-Hosted) Ev Sunucuları</h3>
<p>Evde eski bir PC, Raspberry Pi veya mini sunucu varsa?</p>
<ul>
    <li><a href="https://www.proxmox.com/en/" target="_blank" rel="noopener">Proxmox</a> — KVM/LXC ev lab'ı.</li>
    <li><a href="https://github.com/TrueCharts/charts" target="_blank" rel="noopener">TrueNAS SCALE</a> — NAS + konteyner.</li>
    <li><a href="https://unraid.net/" target="_blank" rel="noopener">Unraid</a> — popüler ev lab OS.</li>
    <li><a href="https://yunohost.org/" target="_blank" rel="noopener">YunoHost</a> — kendi bulut servisleri.</li>
    <li><a href="https://casaos.io/" target="_blank" rel="noopener">CasaOS</a> — Docker için nefis web UI, tek komutla kurulur.</li>
    <li><a href="https://umbrel.com/" target="_blank" rel="noopener">Umbrel</a> — Raspberry Pi için Docker odaklı.</li>
</ul>

<h3>6.5. Docker'ı Web Arayüzüyle Yönet</h3>
<p>SSH ile uğraşmak istemiyor musunuz? Tarayıcıdan yönetim:</p>
<ul>
    <li><a href="https://www.portainer.io/" target="_blank" rel="noopener">Portainer</a> — Docker için standart web UI.</li>
    <li><a href="https://yacht.sh/" target="_blank" rel="noopener">Yacht</a> — Portainer alternatifi.</li>
    <li><a href="https://github.com/SelfhostedPro/Yacht" target="_blank" rel="noopener">Dockge</a> — compose odaklı UI.</li>
    <li><a href="https://github.com/coollabsio/coolify" target="_blank" rel="noopener">Coolify</a> — açık kaynak Heroku/Netlify alternatifi, kendi sunucunuzda.</li>
    <li><a href="https://dokku.com/" target="_blank" rel="noopener">Dokku</a> — "küçük PaaS motoru", VPS'inize kurarsınız.</li>
</ul>

<h3>6.6. Reverse Proxy ve HTTPS</h3>
<p>Konteynerlerinizi birden fazla domain ile, otomatik HTTPS ile sunmak:</p>
<ul>
    <li><a href="https://traefik.io/" target="_blank" rel="noopener">Traefik</a> — Docker-native, otomatik Let's Encrypt.</li>
    <li><a href="https://caddyserver.com/" target="_blank" rel="noopener">Caddy</a> — varsayılan HTTPS, basit yapılandırma.</li>
    <li><a href="https://nginxproxymanager.com/" target="_blank" rel="noopener">Nginx Proxy Manager</a> — web arayüzlü.</li>
</ul>

<h2>7. Çok, Çok Daha Fazla Docker Kaynağı 📚</h2>

<h3>Resmi Dokümantasyon</h3>
<ul>
    <li><a href="https://docs.docker.com/" target="_blank" rel="noopener">docs.docker.com</a></li>
    <li><a href="https://docs.docker.com/get-started/" target="_blank" rel="noopener">Docker Get Started</a></li>
    <li><a href="https://docs.docker.com/engine/reference/commandline/cli/" target="_blank" rel="noopener">CLI Reference</a></li>
    <li><a href="https://docs.docker.com/reference/dockerfile/" target="_blank" rel="noopener">Dockerfile Reference</a></li>
    <li><a href="https://docs.docker.com/compose/" target="_blank" rel="noopener">Compose Docs</a></li>
    <li><a href="https://docs.docker.com/storage/volumes/" target="_blank" rel="noopener">Volumes</a></li>
    <li><a href="https://docs.docker.com/network/" target="_blank" rel="noopener">Networking</a></li>
    <li><a href="https://github.com/docker-library/official-images" target="_blank" rel="noopener">Official Images GitHub</a></li>
    <li><a href="https://docs.docker.com/develop/dev-best-practices/" target="_blank" rel="noopener">Best Practices</a></li>
</ul>

<h3>İnteraktif Öğrenme</h3>
<ul>
    <li><a href="https://labs.play-with-docker.com/" target="_blank" rel="noopener">Play with Docker (tarayıcıda)</a></li>
    <li><a href="https://training.play-with-docker.com/" target="_blank" rel="noopener">Docker Official Training</a></li>
    <li><a href="https://dockerlabs.collabnix.com/" target="_blank" rel="noopener">Docker Labs (Collabnix)</a></li>
    <li><a href="https://www.katacoda.com/courses/docker" target="_blank" rel="noopener">Katacoda Docker (arşiv)</a></li>
    <li><a href="https://killercoda.com/playgrounds/scenario/docker" target="_blank" rel="noopener">Killercoda Docker Playground</a></li>
</ul>

<h3>Blog, Newsletter ve Topluluk</h3>
<ul>
    <li><a href="https://www.docker.com/blog/" target="_blank" rel="noopener">Docker Blog</a></li>
    <li><a href="https://blog.docker.com/newsletter/" target="_blank" rel="noopener">Docker Weekly Newsletter</a></li>
    <li><a href="https://www.dockercaptains.com/" target="_blank" rel="noopener">Docker Captains</a> — Docker uzmanlarının listesi</li>
    <li><a href="https://www.reddit.com/r/docker/" target="_blank" rel="noopener">r/docker (Reddit)</a></li>
    <li><a href="https://www.reddit.com/r/selfhosted/" target="_blank" rel="noopener">r/selfhosted (Reddit)</a> — Docker ile neler yapıldığına dair altın</li>
    <li><a href="https://dev.to/t/docker" target="_blank" rel="noopener">dev.to — Docker tag</a></li>
    <li><a href="https://stackoverflow.com/questions/tagged/docker" target="_blank" rel="noopener">Stack Overflow — Docker</a></li>
</ul>

<h3>YouTube Kanalları (İngilizce)</h3>
<ul>
    <li><a href="https://www.youtube.com/@Bretfisher" target="_blank" rel="noopener">Bret Fisher</a> — Docker Captain, canlı yayın + derin konular</li>
    <li><a href="https://www.youtube.com/@TechWorldwithNana" target="_blank" rel="noopener">TechWorld with Nana</a> — DevOps ve Docker</li>
    <li><a href="https://www.youtube.com/@programmingwithmosh" target="_blank" rel="noopener">Programming with Mosh</a> — Başlangıç dostu</li>
    <li><a href="https://www.youtube.com/@NetworkChuck" target="_blank" rel="noopener">NetworkChuck</a> — Enerjik</li>
    <li><a href="https://www.youtube.com/@Fireship" target="_blank" rel="noopener">Fireship</a> — 100 saniye formatı</li>
    <li><a href="https://www.youtube.com/@DevOpsToolkit" target="_blank" rel="noopener">DevOps Toolkit (Viktor Farcic)</a> — derin DevOps içerikleri</li>
    <li><a href="https://www.youtube.com/@christianlempa" target="_blank" rel="noopener">Christian Lempa</a> — Self-hosted + Docker</li>
    <li><a href="https://www.youtube.com/@NetworkDirection" target="_blank" rel="noopener">Network Direction</a> — Docker ağı derinlemesine</li>
</ul>

<h3>YouTube — Türkçe</h3>
<ul>
    <li><a href="https://www.youtube.com/@Kodluyoruz" target="_blank" rel="noopener">Kodluyoruz</a></li>
    <li><a href="https://www.youtube.com/@mshowto" target="_blank" rel="noopener">MSHOWTO</a></li>
    <li><a href="https://www.youtube.com/@TurkcellGelecegiYazanlar" target="_blank" rel="noopener">Turkcell Geleceği Yazanlar</a></li>
    <li><a href="https://www.youtube.com/@mertcangokgoz" target="_blank" rel="noopener">Mertcan Gökgöz</a></li>
    <li><a href="https://www.youtube.com/@EnginDemirog" target="_blank" rel="noopener">Engin Demiroğ</a></li>
    <li><a href="https://www.youtube.com/@tayfundeger" target="_blank" rel="noopener">Tayfun Değer</a> — DevOps/bulut</li>
</ul>

<h3>Kurslar (Ücretli / Sertifikalı)</h3>
<ul>
    <li><a href="https://www.udemy.com/course/docker-mastery/" target="_blank" rel="noopener">Docker Mastery (Bret Fisher / Udemy)</a> — en popüler</li>
    <li><a href="https://training.linuxfoundation.org/training/docker-fundamentals/" target="_blank" rel="noopener">Linux Foundation Docker Fundamentals</a></li>
    <li><a href="https://www.coursera.org/courses?query=docker" target="_blank" rel="noopener">Coursera — Docker kursları</a></li>
    <li><a href="https://www.pluralsight.com/browse/software-development/docker" target="_blank" rel="noopener">Pluralsight Docker</a></li>
    <li><a href="https://docker.com/docker-certification/" target="_blank" rel="noopener">Docker Certified Associate (DCA)</a> — resmi sertifika sınavı</li>
</ul>

<h3>Kitaplar</h3>
<ul>
    <li><strong>Docker Deep Dive</strong> — Nigel Poulton (en güncel, en kapsamlı)</li>
    <li><strong>Docker in Action</strong> — Jeff Nickoloff (Manning)</li>
    <li><strong>Docker in Practice</strong> — Ian Miell & Aidan Sayers (101 teknik)</li>
    <li><strong>The Kubernetes Book</strong> — Nigel Poulton (Docker sonrası doğal adım)</li>
    <li><strong>Cloud Native Go</strong> — Matthew Titmus (Docker + Go + K8s)</li>
</ul>

<h3>Araçlar</h3>
<ul>
    <li><a href="https://www.portainer.io/" target="_blank" rel="noopener">Portainer</a> — Docker web UI</li>
    <li><a href="https://lazydocker.dev/" target="_blank" rel="noopener">lazydocker</a> — terminal UI</li>
    <li><a href="https://github.com/wagoodman/dive" target="_blank" rel="noopener">dive</a> — imajın katmanlarını incele</li>
    <li><a href="https://github.com/docker-slim/docker-slim" target="_blank" rel="noopener">docker-slim</a> — imaj sıkıştırma</li>
    <li><a href="https://github.com/aquasecurity/trivy" target="_blank" rel="noopener">Trivy</a> — güvenlik taraması</li>
    <li><a href="https://github.com/hadolint/hadolint" target="_blank" rel="noopener">Hadolint</a> — Dockerfile linter</li>
    <li><a href="https://github.com/jesseduffield/lazygit" target="_blank" rel="noopener">lazygit</a> — bonus: Git için</li>
    <li><a href="https://ctop.sh/" target="_blank" rel="noopener">ctop</a> — top ama Docker için</li>
    <li><a href="https://github.com/Jeff-Tian/mysql-client" target="_blank" rel="noopener">mycli, pgcli, redis-cli</a> — akıllı istemciler</li>
</ul>

<h3>Kataloglar ve Keşif</h3>
<ul>
    <li><a href="https://hub.docker.com/" target="_blank" rel="noopener">Docker Hub</a></li>
    <li><a href="https://hub.docker.com/search?image_filter=official&type=image" target="_blank" rel="noopener">Hub — Official Images</a></li>
    <li><a href="https://github.com/awesome-selfhosted/awesome-selfhosted" target="_blank" rel="noopener">Awesome Self-Hosted</a> — kendi sunucunuzda çalıştırabileceğiniz yüzlerce uygulama</li>
    <li><a href="https://github.com/veggiemonk/awesome-docker" target="_blank" rel="noopener">Awesome Docker</a> — kaynak devi</li>
    <li><a href="https://github.com/docker/awesome-compose" target="_blank" rel="noopener">Awesome Compose</a> — resmi compose örnek deposu</li>
    <li><a href="https://linuxserver.io/" target="_blank" rel="noopener">LinuxServer.io</a> — kaliteli self-host imajları yayınlayan ekip</li>
    <li><a href="https://www.linuxserver.io/fleet" target="_blank" rel="noopener">LinuxServer Fleet</a> — 200+ popüler imaj listesi</li>
    <li><a href="https://fly.io/docs/reference/" target="_blank" rel="noopener">Fly.io Docs</a></li>
    <li><a href="https://selfh.st/" target="_blank" rel="noopener">selfh.st</a> — self-hosted uygulamalar keşif/haber</li>
</ul>

<h3>Cheatsheet'ler</h3>
<ul>
    <li><a href="https://docs.docker.com/get-started/docker_cheatsheet.pdf" target="_blank" rel="noopener">Docker Resmi Cheatsheet (PDF)</a></li>
    <li><a href="https://dockerlabs.collabnix.com/docker/cheatsheet/" target="_blank" rel="noopener">Collabnix Docker Cheatsheet</a></li>
    <li><a href="https://devhints.io/docker" target="_blank" rel="noopener">devhints.io — Docker</a></li>
    <li><a href="https://devhints.io/docker-compose" target="_blank" rel="noopener">devhints.io — Compose</a></li>
    <li><a href="https://kapeli.com/cheat_sheets/Docker.docset/Contents/Resources/Documents/index" target="_blank" rel="noopener">Kapeli Docker Cheatsheet</a></li>
</ul>

<h3>Podcast'ler</h3>
<ul>
    <li><a href="https://kubernetespodcast.com/" target="_blank" rel="noopener">Kubernetes Podcast (Google)</a></li>
    <li><a href="https://www.devopsparadox.com/" target="_blank" rel="noopener">DevOps Paradox</a></li>
    <li><a href="https://changelog.com/podcast" target="_blank" rel="noopener">The Changelog</a> — bazen Docker konuları</li>
</ul>

<h2>8. Alıştırma Fikirleri 🧑‍🏫</h2>
<p>Başlangıç için size 10 mini proje:</p>
<ol>
    <li>3 tane NGINX'i 3 farklı porta başlat ve hepsine ayrı index.html koy.</li>
    <li>PostgreSQL + Adminer birleşimi kur, Adminer'dan veritabanı tabloları oluştur.</li>
    <li>WordPress + MySQL + phpMyAdmin — tam CMS yığını.</li>
    <li>Tek bir <code>docker run</code> ile Jupyter başlat, ilk Pandas örneğini çalıştır.</li>
    <li>Uptime Kuma kur, favori 5 sitenizin uptime'ını izleyin.</li>
    <li>Vaultwarden + Bitwarden tarayıcı eklentisi — kendi şifre deponuz.</li>
    <li>Home Assistant kurup saatin kaçta olduğunu gösteren "dashboard" yap.</li>
    <li>Redis + redis-cli ile kendiniz küçük bir "sayaç API"sı yazın.</li>
    <li>MinIO (S3-uyumlu) + mc CLI ile dosya yükleyip silin.</li>
    <li>Traefik arkasına 2 farklı web uygulaması koyun ve path'e göre routing yapın.</li>
</ol>

<h2>9. Sonuç: Konteynerler Bir Yaşam Tarzıdır 🐳</h2>
<p>Docker sadece bir araç değil; düşünme biçimidir. "Bir şeyi denemek istiyorum" dediğinizde refleksiniz <code>docker run</code> olacak. Bir servisi kurmak 10 dakika yerine 10 saniye alacak. Üretime çıkarmak, dev makinenizle aynı komut.</p>
<p>Oynayın. Kırın. Yeniden başlatın. Birkaç ay sonra konteyner düşünmeden DevOps düşüneceksiniz. Bu yolculuğa bu bölüm sizin yol haritanız olsun.</p>

<div class="info-box tip">
    <div class="info-box-title">🎯 Sıradaki Hedefler</div>
    <ul>
        <li><strong>Kubernetes</strong>: Docker'ı ölçekte yönetmek.</li>
        <li><strong>Terraform</strong>: Bulut altyapısını kod olarak yazmak.</li>
        <li><strong>Ansible</strong>: Sunucu yapılandırması otomasyonu.</li>
        <li><strong>GitHub Actions / GitLab CI</strong>: Otomatik build/deploy.</li>
        <li><strong>Prometheus + Grafana</strong>: Gözlemlenebilirlik.</li>
    </ul>
    Bunların hepsi Docker üzerine oturur. Docker'ı iyi bildiğinizde bu araçlar çok daha tanıdık gelecek.
</div>
`,
    quiz: [
        {
            question: "Aynı Docker imajından üç farklı konteyner aynı anda çalıştırmak mümkün müdür?",
            options: [
                "Hayır, her imaj sadece bir kere çalışır",
                "Evet — farklı isim ve farklı host portları vererek sorunsuz çalışır",
                "Sadece kurumsal sürümde",
                "Sadece farklı makinelerde"
            ],
            correct: 1,
            explanation: "Docker imajları salt okunurdur, onlardan istediğiniz kadar konteyner üretebilirsiniz. Her konteynerin kendi yazılabilir katmanı, kendi PID'leri, kendi ağ alanı vardır. Tek kısıt host portlarının benzersiz olmasıdır."
        },
        {
            question: "Bir hazır imajı kendi HTML'inizle özelleştirmenin en kolay yolu nedir?",
            options: [
                "İmajı yeniden yazmak",
                "Hostunuzdaki bir klasörü bind mount olarak (örn. -v $(pwd)/site:/usr/share/nginx/html) konteynere bağlamak",
                "Docker Hub'da editör açmak",
                "İmkânsızdır"
            ],
            correct: 1,
            explanation: "Bind mount ile host klasörünüzü konteynere yansıtırsınız. NGINX imajı /usr/share/nginx/html içindekileri sunduğu için bu yola kendi dosyalarınızı monte ederseniz anında yansır. Dockerfile yazmaya gerek yoktur."
        },
        {
            question: "Container konteyner ağında isimle birbirine erişmek için gerekli olan nedir?",
            options: [
                "Aynı Dockerfile'dan türemiş olmaları",
                "Kullanıcı tarafından oluşturulan bir ağda (docker network create) birlikte bulunmaları",
                "Her ikisinin de root olması",
                "Aynı porta bind edilmiş olmaları"
            ],
            correct: 1,
            explanation: "Varsayılan bridge ağı isimle DNS sağlamaz. docker network create ile özel bir ağ oluşturup konteynerleri oraya dahil edince Docker'ın dahili DNS'i konteyner isimlerini çözer."
        },
        {
            question: "Aşağıdakilerden hangisi bir PaaS (Platform as a Service) çözümüdür?",
            options: [
                "Hetzner VPS",
                "Railway, Render, Fly.io",
                "Ubuntu",
                "Wireshark"
            ],
            correct: 1,
            explanation: "Railway, Render ve Fly.io, Docker imajınızı verdiğinizde deploy, SSL, load balancing işlerini sizin için halleden PaaS platformlarıdır. VPS (Hetzner gibi) ise ham bir sanal makinedir."
        },
        {
            question: "Oracle Cloud Always Free hakkında doğru olan nedir?",
            options: [
                "İlk ay ücretsizdir",
                "4 vCPU ve 24 GB RAM'e kadar ARM sanal makineyi sürekli ücretsiz kullanabilirsiniz",
                "Sadece kurumsal hesaplar içindir",
                "Kullanımı için kredi kartı gerekmez"
            ],
            correct: 1,
            explanation: "Oracle Cloud'un Always Free katmanı, kayda değer bir ARM VM kapasitesi sunar (değişen kotaya göre 4 vCPU + 24 GB RAM'e kadar). Docker deney/üretim için inanılmaz bir ücretsiz kaynak."
        },
        {
            question: "netshoot imajı neden faydalıdır?",
            options: [
                "Eğlencelidir",
                "curl, dig, nmap, tcpdump gibi ağ hata ayıklama araçlarının hepsini içerir; diğer konteynerleri debug etmek için idealdir",
                "Web sunucusu işlevi vardır",
                "Güvenlik taraması yapar"
            ],
            correct: 1,
            explanation: "nicolaka/netshoot imajı, ağ debug araçlarının tamamını içerir. Aynı ağda başlatıp bir servisle konuşmayı, DNS'i, portu, paketleri incelemek için standarttır."
        },
        {
            question: "Google Cloud Run ne tür bir servistir?",
            options: [
                "Sanal makine",
                "Sunucusuz konteyner çalıştırma — konteyneriniz istek olmadığında 0'a iner, geldiğinde ölçeklenir",
                "Veritabanı",
                "DNS yönetimi"
            ],
            correct: 1,
            explanation: "Cloud Run, Docker imajınızı alır ve FaaS benzeri bir şekilde çalıştırır: istek yoksa 0 konteyner, istek varsa otomatik scale. Faturalandırma kullanım temellidir — bazı projeler için ücretsiz katmanda tamamen kalır."
        },
        {
            question: "Traefik ne işe yarar?",
            options: [
                "Docker imajları builder",
                "Docker-farkında reverse proxy — otomatik SSL ve birden fazla servisi domain/path'e göre yönlendirir",
                "Konteyner monitör",
                "Veri yedekleme aracı"
            ],
            correct: 1,
            explanation: "Traefik, Docker etiketleri ile yapılandırılan modern bir reverse proxy'dir. Yeni konteyner eklediğinizde otomatik kendini günceller, Let's Encrypt ile HTTPS sağlar. Üretim için çok popülerdir."
        },
        {
            question: "Self-hosted dünyasında yaygın bir başlangıç aracı hangisidir?",
            options: [
                "VisualStudio",
                "CasaOS, Umbrel veya Portainer — tarayıcıdan tıklayarak imajları yönetirler",
                "Microsoft Word",
                "VLC"
            ],
            correct: 1,
            explanation: "CasaOS, Umbrel ve Portainer, yeni başlayanlar için Docker'ı tarayıcıdan yönetmeyi çok kolay hale getirir. Kendinizi \"tıkla ve kurulacak\" dünyada bulursunuz."
        },
        {
            question: "Docker imajlarını keşfetmek için en kapsamlı topluluk listelerinden biri nedir?",
            options: [
                "awesome-selfhosted (GitHub)",
                "Microsoft Store",
                "App Store",
                "Windows Registry"
            ],
            correct: 0,
            explanation: "awesome-selfhosted GitHub deposu, kendi sunucunuzda çalıştırabileceğiniz yüzlerce Docker imajı kategorize edilmiş haldedir. awesome-docker ve docker/awesome-compose de benzer şekilde zengin kaynaklardır."
        }
    ]
});
