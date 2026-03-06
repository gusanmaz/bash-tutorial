// ===== Bölüm 18: curl ve wget — Ağdan Veri İndirme =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 18,
    title: 'curl ve wget',
    subtitle: 'Network Transfer Tools',
    icon: '🌐',
    description: 'curl ve wget ile ağdan veri indirme, API çağrıları, dosya transferi, HTTP istekleri ve otomasyon.',
    content: `
<h2>Neden Terminal'den HTTP İstekleri?</h2>
<p>Tarayıcı dışında HTTP istekleri yapmak, modern yazılım geliştirmenin ve sistem yönetiminin önemli bir parçasıdır:</p>
<ul>
    <li><strong>API testi:</strong> REST API'leri test etmek ve hata ayıklamak</li>
    <li><strong>Otomasyon:</strong> Script'lerle dosya indirme, veri çekme</li>
    <li><strong>Sunucu yönetimi:</strong> GUI olmayan sunucularda dosya indirme, sertifika kontrolü</li>
    <li><strong>CI/CD:</strong> Sürekli entegrasyon süreçlerinde webhook, artifact indirme</li>
</ul>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">curl</span> = <span class="eng-meaning">Client URL</span> — URL ile veri transferi aracı.<br>
        <span class="eng-word">wget</span> = <span class="eng-meaning">Web Get</span> — Web'den dosya indirme aracı.<br>
        <span class="eng-word">HTTP Method</span> = <span class="eng-meaning">HTTP Yöntemi</span> — GET, POST, PUT, DELETE gibi istek türleri.<br>
        <span class="eng-word">Header</span> = <span class="eng-meaning">Başlık</span> — HTTP isteğinin meta verileri.<br>
        <span class="eng-word">Payload / Body</span> = <span class="eng-meaning">Yük / Gövde</span> — İstekle gönderilen veri.<br>
        <span class="eng-word">Status Code</span> = <span class="eng-meaning">Durum Kodu</span> — Sunucunun yanıt durumu (200, 404, 500...).<br>
        <span class="eng-word">REST API</span> = <span class="eng-meaning">Representational State Transfer</span> — Web servisleri için yaygın mimari.
    </div>
</div>

<h2>curl — Çok Amaçlı Transfer Aracı</h2>
<p><code>curl</code>, Daniel Stenberg tarafından 1998'de geliştirilen, <strong>25+ protokolü</strong> (HTTP, HTTPS, FTP, SFTP, SCP, SMTP...) destekleyen çok güçlü bir veri transfer aracıdır. API geliştirme, test ve hata ayıklama için vazgeçilmezdir.</p>

<h3>Temel GET İstekleri</h3>
<div class="code-block">
    <div class="code-block-header"><span>curl ile GET istekleri</span></div>
    <pre><code><span class="comment"># Basit GET (içerik stdout'a yazılır):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="argument">https://httpbin.org/get</span>

<span class="comment"># Dosyaya kaydet (-o: output):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-o</span> <span class="path">sayfa.html</span> <span class="argument">https://example.com</span>

<span class="comment"># Sunucunun önerdiği isimle kaydet (-O: remote name):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-O</span> <span class="argument">https://example.com/dosya.tar.gz</span>

<span class="comment"># Sadece HTTP başlıklarını göster (-I: head):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-I</span> <span class="argument">https://example.com</span>
HTTP/2 200
content-type: text/html; charset=UTF-8
content-length: 1256

<span class="comment"># Başlıklar + gövde (-i: include headers):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-i</span> <span class="argument">https://httpbin.org/get</span>

<span class="comment"># Sessiz mod (-s: silent — ilerleme çubuğunu gizle):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-s</span> <span class="argument">https://api.github.com/users/torvalds</span>

<span class="comment"># Yönlendirmeleri takip et (-L: follow redirects):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-L</span> <span class="argument">https://bit.ly/kisalink</span>

<span class="comment"># Detaylı çıktı (-v: verbose — hata ayıklama):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-v</span> <span class="argument">https://example.com</span></code></pre>
</div>

<h3>POST, PUT, DELETE İstekleri</h3>
<div class="code-block">
    <div class="code-block-header"><span>HTTP metotları ile çalışma</span></div>
    <pre><code><span class="comment"># POST — JSON veri gönder:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-X POST</span> <span class="argument">https://httpbin.org/post</span> \\
  <span class="flag">-H</span> <span class="string">"Content-Type: application/json"</span> \\
  <span class="flag">-d</span> <span class="string">'{"isim": "Ali", "yas": 25}'</span>

<span class="comment"># POST — Form verisi gönder:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-X POST</span> <span class="argument">https://httpbin.org/post</span> \\
  <span class="flag">-d</span> <span class="string">"kullanici=ali&parola=gizli"</span>

<span class="comment"># POST — Dosya yükle:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-X POST</span> <span class="argument">https://httpbin.org/post</span> \\
  <span class="flag">-F</span> <span class="string">"dosya=@rapor.pdf"</span> \\
  <span class="flag">-F</span> <span class="string">"aciklama=Aylık rapor"</span>

<span class="comment"># PUT — Kaynak güncelle:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-X PUT</span> <span class="argument">https://api.example.com/users/1</span> \\
  <span class="flag">-H</span> <span class="string">"Content-Type: application/json"</span> \\
  <span class="flag">-d</span> <span class="string">'{"isim": "Ali Yılmaz"}'</span>

<span class="comment"># PATCH — Kısmi güncelleme:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-X PATCH</span> <span class="argument">https://api.example.com/users/1</span> \\
  <span class="flag">-H</span> <span class="string">"Content-Type: application/json"</span> \\
  <span class="flag">-d</span> <span class="string">'{"email": "yeni@email.com"}'</span>

<span class="comment"># DELETE — Kaynak sil:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-X DELETE</span> <span class="argument">https://api.example.com/users/1</span></code></pre>
</div>

<h3>Kimlik Doğrulama</h3>
<div class="code-block">
    <div class="code-block-header"><span>Kimlik doğrulama yöntemleri</span></div>
    <pre><code><span class="comment"># Temel kimlik doğrulama (Basic Auth):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-u</span> <span class="argument">kullanici:parola</span> <span class="argument">https://api.example.com/data</span>

<span class="comment"># Bearer Token (OAuth, JWT):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-H</span> <span class="string">"Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."</span> \\
  <span class="argument">https://api.example.com/data</span>

<span class="comment"># API Key (başlıkta):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-H</span> <span class="string">"X-API-Key: abc123xyz"</span> \\
  <span class="argument">https://api.example.com/data</span>

<span class="comment"># API Key (parametrede):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="argument">"https://api.example.com/data?api_key=abc123xyz"</span></code></pre>
</div>

<h3>İleri curl Kullanımı</h3>
<div class="code-block">
    <div class="code-block-header"><span>İleri düzey curl</span></div>
    <pre><code><span class="comment"># Yanıt süresini ölç (-w: write-out):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-s -o /dev/null -w</span> <span class="string">"Toplam: %{time_total}s\\nDNS: %{time_namelookup}s\\nBağlantı: %{time_connect}s\\nHTTP Kodu: %{http_code}\\n"</span> <span class="argument">https://example.com</span>

<span class="comment"># Özel User-Agent:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-A</span> <span class="string">"MyApp/1.0"</span> <span class="argument">https://example.com</span>

<span class="comment"># Cookie gönder ve al:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-c cookies.txt</span> <span class="argument">https://example.com/login</span>  <span class="comment"># Cookie'leri kaydet</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-b cookies.txt</span> <span class="argument">https://example.com/dashboard</span>  <span class="comment"># Cookie'lerle istek</span>

<span class="comment"># Proxy kullan:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-x</span> <span class="argument">http://proxy:8080</span> <span class="argument">https://example.com</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">--socks5</span> <span class="argument">localhost:1080</span> <span class="argument">https://example.com</span>

<span class="comment"># Zaman aşımı ayarla:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">--connect-timeout 5 --max-time 30</span> <span class="argument">https://example.com</span>

<span class="comment"># Yarım kalan indirmeyi devam ettir (-C: continue):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-C -</span> <span class="flag">-O</span> <span class="argument">https://example.com/buyuk_dosya.iso</span>

<span class="comment"># HTTP/2 veya HTTP/3 zorla:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">--http2</span> <span class="argument">https://example.com</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">--http3</span> <span class="argument">https://example.com</span>

<span class="comment"># SSL sertifikasını doğrulama (test ortamı — üretimde KULLANMAYIN!):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-k</span> <span class="argument">https://self-signed.example.com</span>

<span class="comment"># JSON çıktıyı güzelleştir (jq ile):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-s</span> <span class="argument">https://api.github.com/users/torvalds</span> | <span class="command">jq</span> <span class="string">'.'</span></code></pre>
</div>

<h2>wget — Dosya İndirme Uzmanı</h2>
<p><code>wget</code> (Web Get), özellikle <strong>dosya indirme</strong> ve <strong>web sitesi yansılama (mirroring)</strong> için optimize edilmiş bir araçtır. curl'den farklı olarak arka planda çalışabilir, otomatik yeniden denemeler yapar ve yinelemeli indirme destekler.</p>

<h3>Temel wget Kullanımı</h3>
<div class="code-block">
    <div class="code-block-header"><span>wget ile dosya indirme</span></div>
    <pre><code><span class="comment"># Dosya indir (otomatik isim):</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="argument">https://example.com/dosya.tar.gz</span>

<span class="comment"># Farklı isimle kaydet (-O):</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="flag">-O</span> <span class="path">indirilen.tar.gz</span> <span class="argument">https://example.com/dosya.tar.gz</span>

<span class="comment"># Belirli dizine kaydet (-P: directory prefix):</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="flag">-P</span> <span class="path">~/indirmeler/</span> <span class="argument">https://example.com/dosya.tar.gz</span>

<span class="comment"># Arka planda indir (-b: background):</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="flag">-b</span> <span class="argument">https://example.com/buyuk.iso</span>
<span class="comment"># İlerleme: tail -f wget-log</span>

<span class="comment"># Sessiz mod (-q: quiet):</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="flag">-q</span> <span class="argument">https://example.com/dosya.tar.gz</span>

<span class="comment"># Yarım kalan indirmeyi devam ettir (-c: continue):</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="flag">-c</span> <span class="argument">https://example.com/buyuk.iso</span>

<span class="comment"># Bant genişliği sınırla:</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="flag">--limit-rate=500k</span> <span class="argument">https://example.com/buyuk.iso</span></code></pre>
</div>

<h3>Toplu ve Yinelemeli İndirme</h3>
<div class="code-block">
    <div class="code-block-header"><span>wget ile toplu indirme</span></div>
    <pre><code><span class="comment"># Dosya listesinden indir (-i: input file):</span>
<span class="prompt">$</span> <span class="command">cat</span> linkler.txt
https://example.com/dosya1.pdf
https://example.com/dosya2.pdf
https://example.com/dosya3.pdf

<span class="prompt">$</span> <span class="command">wget</span> <span class="flag">-i</span> <span class="path">linkler.txt</span>

<span class="comment"># Yinelemeli indirme (web sitesi yansılama):</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="flag">-r -l 2 -p -k</span> <span class="argument">https://example.com</span>
<span class="comment"># -r: recursive (yinelemeli)</span>
<span class="comment"># -l 2: 2 seviye derinlik</span>
<span class="comment"># -p: sayfa kaynakları (CSS, JS, resimler)</span>
<span class="comment"># -k: linkleri yerele çevir</span>

<span class="comment"># Tam site yansılama (mirror):</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="flag">--mirror --convert-links --adjust-extension --page-requisites --no-parent</span> <span class="argument">https://example.com/docs/</span>

<span class="comment"># Sadece belirli dosya türlerini indir:</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="flag">-r -A "*.pdf,*.doc"</span> <span class="argument">https://example.com/belgeler/</span>

<span class="comment"># Belirli dosya türlerini hariç tut:</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="flag">-r -R "*.jpg,*.png"</span> <span class="argument">https://example.com</span></code></pre>
</div>

<h3>wget ile Otomatik Yeniden Deneme</h3>
<div class="code-block">
    <div class="code-block-header"><span>Yeniden deneme ve sağlamlık</span></div>
    <pre><code><span class="comment"># Başarısızlıkta 5 kez dene (varsayılan: 20):</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="flag">--tries=5</span> <span class="argument">https://example.com/dosya.tar.gz</span>

<span class="comment"># Sonsuz deneme (kesintiye kadar):</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="flag">--tries=0 -c</span> <span class="argument">https://example.com/buyuk.iso</span>

<span class="comment"># Bekleme süresi (denemeler arası):</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="flag">--wait=10 --random-wait</span> <span class="argument">http://example.com/veri.csv</span></code></pre>
</div>

<h2>curl vs wget Karşılaştırması</h2>
<table>
    <tr><th>Özellik</th><th>curl</th><th>wget</th></tr>
    <tr><td>Temel Amacı</td><td>Veri transferi ve API iletişimi</td><td>Dosya indirme</td></tr>
    <tr><td>Protokol Desteği</td><td>25+ (HTTP, FTP, SMTP, LDAP...)</td><td>HTTP, HTTPS, FTP</td></tr>
    <tr><td>HTTP Metotları</td><td>Hepsi (GET, POST, PUT, DELETE...)</td><td>Başlıca GET ve POST</td></tr>
    <tr><td>Yinelemeli İndirme</td><td>❌ Yok</td><td>✅ Var (-r)</td></tr>
    <tr><td>Devam Ettirme</td><td>✅ (-C -)</td><td>✅ (-c)</td></tr>
    <tr><td>Arka Plan</td><td>❌ Manuel (&)</td><td>✅ (-b)</td></tr>
    <tr><td>Çıktı Yönlendirme</td><td>Varsayılan: stdout</td><td>Varsayılan: dosyaya kaydet</td></tr>
    <tr><td>Kütüphane</td><td>libcurl (programlama arayüzü)</td><td>Yok</td></tr>
    <tr><td>Script'lerde</td><td>API çağrıları, veri işleme</td><td>Toplu dosya indirme</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Hangisini Kullanmalı?</div>
    <strong>curl kullan:</strong> API test / geliştirme, HTTP header manipülasyonu, karmaşık kimlik doğrulama, pipe zincirleri.<br>
    <strong>wget kullan:</strong> Dosya indirme, web sitesi yansılama, toplu indirme, kesintiye dayanıklı indirme.<br>
    <strong>Her ikisini de öğrenin!</strong> Çoğu yazılımcı API'ler için curl, indirme için wget kullanır.
</div>

<h2>Pratik Örnekler</h2>

<h3>Hava Durumu Sorgulama</h3>
<div class="code-block">
    <div class="code-block-header"><span>wttr.in API'si ile hava durumu</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">curl</span> <span class="argument">wttr.in/Istanbul</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="argument">wttr.in/Istanbul?format=3</span>    <span class="comment"># Kısa format</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="argument">wttr.in/:help</span>               <span class="comment"># Yardım</span></code></pre>
</div>

<h3>Dış IP Adresini Öğrenme</h3>
<div class="code-block">
    <div class="code-block-header"><span>IP sorgulama</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">curl</span> <span class="argument">ifconfig.me</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="argument">icanhazip.com</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-s</span> <span class="argument">https://ipinfo.io/json</span> | <span class="command">jq</span></code></pre>
</div>

<h3>GitHub API ile Çalışma</h3>
<div class="code-block">
    <div class="code-block-header"><span>GitHub API örnekleri</span></div>
    <pre><code><span class="comment"># Kullanıcı bilgisi:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-s</span> <span class="argument">https://api.github.com/users/torvalds</span> | <span class="command">jq</span> <span class="string">'{isim: .name, takipci: .followers, repo: .public_repos}'</span>

<span class="comment"># Repo'nun son release'ini indir:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-sL</span> <span class="argument">https://api.github.com/repos/jqlang/jq/releases/latest</span> | \\
  <span class="command">jq</span> <span class="flag">-r</span> <span class="string">'.assets[] | select(.name | contains("linux-amd64")) | .browser_download_url'</span> | \\
  <span class="command">wget</span> <span class="flag">-i -</span></code></pre>
</div>

<h3>Script'lerde Kullanım</h3>
<div class="code-block">
    <div class="code-block-header"><span>Sağlık kontrolü script'i</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>
<span class="comment"># Web sitesi sağlık kontrolü</span>

SITELER=("https://google.com" "https://github.com" "https://example.com")

for site in "\${SITELER[@]}"; do
    HTTP_KOD=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$site")
    if [ "$HTTP_KOD" -eq 200 ]; then
        echo "✅ $site — Çalışıyor ($HTTP_KOD)"
    else
        echo "❌ $site — SORUN! ($HTTP_KOD)"
    fi
done</code></pre>
</div>

<h2>jq — JSON İşleme Aracı</h2>
<p>curl ile API'lerden aldığınız JSON verisini işlemek için <code>jq</code> vazgeçilmezdir:</p>
<div class="code-block">
    <div class="code-block-header"><span>jq örnekleri</span></div>
    <pre><code><span class="comment"># JSON'u güzelleştir:</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">'{"a":1,"b":[2,3]}'</span> | <span class="command">jq</span> <span class="string">'.'</span>

<span class="comment"># Belirli alanı çek:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-s</span> <span class="argument">https://api.github.com/users/torvalds</span> | <span class="command">jq</span> <span class="string">'.name'</span>
"Linus Torvalds"

<span class="comment"># Dizi elemanlarını filtrele:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-s</span> <span class="argument">https://api.github.com/users/torvalds/repos</span> | <span class="command">jq</span> <span class="string">'.[].name'</span>

<span class="comment"># Koşullu filtreleme:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-s</span> <span class="argument">https://api.github.com/users/torvalds/repos</span> | \\
  <span class="command">jq</span> <span class="string">'.[] | select(.stargazers_count > 1000) | {ad: .name, yildiz: .stargazers_count}'</span>

<span class="comment"># jq kurulumu:</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> <span class="argument">jq</span>  <span class="comment"># Debian/Ubuntu</span></code></pre>
</div>

<h2>Dış Kaynaklar</h2>
<div class="info-box tip">
    <div class="info-box-title">📚 İleri Okuma</div>
    <ul>
        <li><a href="https://curl.se/docs/manpage.html" target="_blank" rel="noopener">curl Man Page</a> — curl'ün resmi ve kapsamlı belgeleri</li>
        <li><a href="https://everything.curl.dev/" target="_blank" rel="noopener">Everything curl</a> — Daniel Stenberg'in curl kitabı (ücretsiz)</li>
        <li><a href="https://www.gnu.org/software/wget/manual/" target="_blank" rel="noopener">GNU wget Manual</a> — wget'in resmi kullanım kılavuzu</li>
        <li><a href="https://jqlang.github.io/jq/manual/" target="_blank" rel="noopener">jq Manual</a> — JSON işleme aracı jq'nun kapsamlı belgeleri</li>
        <li><a href="https://httpbin.org/" target="_blank" rel="noopener">httpbin.org</a> — HTTP istek testleri için ücretsiz servis</li>
    </ul>
</div>
`,
    quiz: [
        {
            question: "curl ile bir API'ye JSON POST isteği göndermek için hangi bayraklar kullanılır?",
            options: ["-X POST -d 'veri'", "-X POST -H 'Content-Type: application/json' -d '{...}'", "-post --json '{...}'", "-send '{...}'"],
            correct: 1,
            explanation: "JSON POST için -X POST ile metodu, -H ile Content-Type header'ını, -d ile veriyi belirtmeniz gerekir."
        },
        {
            question: "wget'in curl'den en önemli farkı nedir?",
            options: ["Daha hızlıdır", "Yinelemeli (recursive) indirme destekler", "Daha fazla protokol destekler", "Sadece HTTPS çalışır"],
            correct: 1,
            explanation: "wget yinelemeli indirme (-r) ile web sitelerini yansılayabilir ve bağlantıları takip ederek tam siteleri indirebilir."
        },
        {
            question: "'curl -I https://example.com' ne gösterir?",
            options: ["Sayfanın HTML içeriği", "Sadece HTTP yanıt başlıkları (headers)", "IP adresi", "SSL sertifikası"],
            correct: 1,
            explanation: "-I (head) bayrağı sadece HTTP yanıt başlıklarını gösterir — durum kodu, content-type, server bilgisi gibi."
        },
        {
            question: "Yarıda kalan bir wget indirmesini devam ettirmek için hangi bayrak kullanılır?",
            options: ["-r", "-O", "-c", "-b"],
            correct: 2,
            explanation: "-c (continue) bayrağı yarıda kalan indirmeyi kaldığı yerden devam ettirir. Büyük dosyalar ve kararsız bağlantılar için çok yararlı."
        },
        {
            question: "curl ile HTTP yanıt durum kodunu (200, 404...) almak için ne kullanılır?",
            options: ["-s", "-v", "-w '%{http_code}'", "-I"],
            correct: 2,
            explanation: "-w '%{http_code}' ile sadece HTTP durum kodunu alabilirsiniz. -o /dev/null ile gövdeyi de gizlerseniz sadece kod kalır."
        },
        {
            question: "curl çıktısını JSON olarak güzelleştirmek için hangi araç kullanılır?",
            options: ["jsonformat", "pretty", "jq", "jsonlint"],
            correct: 2,
            explanation: "jq, komut satırında JSON verisi işlemek için standart araçtır. Filtreleme, dönüştürme ve güzelleştirme yapabilir."
        }
    ]
});
