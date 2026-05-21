// ===== Bölüm 11: Piping ve Yönlendirme =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 11,
    title: 'Piping ve Yönlendirme',
    subtitle: 'Piping and Redirection',
    icon: '🔀',
    description: 'stdin/stdout/stderr, yönlendirme operatörleri, pipe zincirleri, tee, xargs ve gerçek dünya örnekleri.',
    content: `
<h2>Üç Temel Akış (Three Streams)</h2>
<div class="info-box tip">
    <div class="info-box-title">💡 Bu bölüm ne işe yarar?</div>
    Terminalde gördüğünüz yazılar aslında üç ayrı "boru"dan gelir. Yönlendirme (<code>&gt;</code>, <code>2&gt;</code>) ve pipe (<code>|</code>) ile bu boruları dosyaya, başka komuta veya çöpe (<code>/dev/null</code>) bağlarsınız. Script yazarken ve log analiz ederken her gün kullanırsınız.
</div>
<p>Linux'ta her program çalıştığında üç veri akışı otomatik olarak açılır:</p>

<div class="code-block">
    <div class="code-block-header"><span>Üç akış — basit şema</span></div>
    <pre><code>                    ┌─────────────┐
   Klavye / dosya ──►│   Program   │──► stdout (1) ──► Terminal veya dosya
        (stdin 0)    │  (ls, grep) │
                    │             │──► stderr (2) ──► Terminal (hata mesajları)
                    └─────────────┘

<span class="comment"># Pipe: stdout bir sonraki komutun stdin'ine gider</span>
   komut1  │  komut2  │  komut3
          └──►└──►└──►</code></pre>
</div>

<div class="eng-box">
    <div class="eng-title">🔤 Terim Anlamları</div>
    <div class="eng-content">
        <span class="eng-word">stdin</span> = <span class="eng-meaning">Standard Input (Standart Girdi)</span> — Programa giren veri<br>
        <span class="eng-word">stdout</span> = <span class="eng-meaning">Standard Output (Standart Çıktı)</span> — Programın normal çıktısı<br>
        <span class="eng-word">stderr</span> = <span class="eng-meaning">Standard Error (Standart Hata)</span> — Hata mesajları
    </div>
</div>

<table>
    <tr><th>Akış</th><th>Dosya Tanıtıcı (FD)</th><th>Varsayılan Hedef</th><th>Açıklama</th></tr>
    <tr><td>stdin</td><td>0</td><td>Klavye</td><td>Programa giren veri</td></tr>
    <tr><td>stdout</td><td>1</td><td>Terminal ekranı</td><td>Normal program çıktısı</td></tr>
    <tr><td>stderr</td><td>2</td><td>Terminal ekranı</td><td>Hata mesajları</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Neden stdout ve stderr Ayrı?</div>
    Normal çıktı ile hata mesajlarını <strong>farklı yerlere</strong> yönlendirebilmek için ayrı tutulurlar. Örneğin, çıktıyı dosyaya yazarken hataları yine ekranda görmek isteyebilirsiniz.
</div>

<h2>Çıktı Yönlendirme (Output Redirection)</h2>

<div class="code-block">
    <div class="code-block-header">
        <span>stdout yönlendirme: > ve >></span>
        <button class="try-btn" onclick="runInTerminal('echo Merhaba > test.txt')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># stdout'u dosyaya yaz (dosyayı SİLER ve yeniden oluşturur):</span>
<span class="prompt">$</span> <span class="command">ls -l</span> <span class="argument">&gt;</span> <span class="path">dosya_listesi.txt</span>

<span class="comment"># stdout'u dosyaya EKLE (mevcut içeriği korur):</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"Yeni satır"</span> <span class="argument">&gt;&gt;</span> <span class="path">dosya_listesi.txt</span>

<span class="comment"># stderr'i dosyaya yönlendir:</span>
<span class="prompt">$</span> <span class="command">ls /olmayan_dizin</span> <span class="argument">2&gt;</span> <span class="path">hatalar.txt</span>

<span class="comment"># stderr'i dosyaya EKLE:</span>
<span class="prompt">$</span> <span class="command">ls /yok</span> <span class="argument">2&gt;&gt;</span> <span class="path">hatalar.txt</span>

<span class="comment"># Hem stdout hem stderr'i aynı dosyaya yönlendir:</span>
<span class="prompt">$</span> <span class="command">komut</span> <span class="argument">&gt;</span> <span class="path">hepsi.txt</span> <span class="argument">2&gt;&amp;1</span>
<span class="comment"># Veya modern kısa yazım:</span>
<span class="prompt">$</span> <span class="command">komut</span> <span class="argument">&amp;&gt;</span> <span class="path">hepsi.txt</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ > Tehlikelidir!</div>
    <code>&gt;</code> operatörü dosyayı <strong>tamamen siler</strong> ve baştan yazar. Mevcut bir dosyanın sonuna eklemek istiyorsanız mutlaka <code>&gt;&gt;</code> kullanın! Yanlışlıkla <code>&gt; önemli_dosya.txt</code> yaparsanız dosyanın eski içeriği geri gelmez.<br><br>
    <strong>Koruma:</strong> <code>set -o noclobber</code> (veya <code>set -C</code>) açıkken mevcut dosyanın üzerine <code>&gt;</code> ile yazamazsınız — Bash hata verir. Kalıcı yapmak için <code>~/.bashrc</code>'ye ekleyin.
</div>

<div class="info-box note">
    <div class="info-box-title">📌 2&gt;&amp;1 ne demek? (en çok karıştırılan)</div>
    <code>2&gt;&amp;1</code> = "stderr'i (2), stdout'un (1) gittiği yere yönlendir".<br><br>
    <strong>Sıra önemli:</strong><br>
    <code>komut &gt; dosya.txt 2&gt;&amp;1</code> ✅ — Önce stdout dosyaya, sonra stderr de oraya<br>
    <code>komut 2&gt;&amp;1 &gt; dosya.txt</code> ❌ — stderr hâlâ ekrana gider (stdout henüz dosyaya bağlanmadı)<br><br>
    Kısa yol: <code>komut &amp;&gt; dosya.txt</code> (Bash) — ikisini birden dosyaya yazar.
</div>

<h3>/dev/null — Kara Delik</h3>

<div class="eng-box">
    <div class="eng-title">🔤 Terim</div>
    <div class="eng-content">
        <span class="eng-word">/dev/null</span> = <span class="eng-meaning">Null Device</span> — Kendisine yazılan her şeyi yutan, okunduğunda boş dönen özel dosya. "Bit çöplüğü" veya "kara delik" olarak bilinir.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>/dev/null kullanımı</span></div>
    <pre><code><span class="comment"># Hata mesajlarını bastır (gösterme):</span>
<span class="prompt">$</span> <span class="command">find / -name "dosya.conf"</span> <span class="argument">2&gt;</span> <span class="path">/dev/null</span>
<span class="comment"># → "Permission denied" hataları yutulur, sadece sonuçlar görünür</span>

<span class="comment"># Tüm çıktıyı bastır (sessiz çalıştır):</span>
<span class="prompt">$</span> <span class="command">komut</span> <span class="argument">&amp;&gt;</span> <span class="path">/dev/null</span>
<span class="comment"># → Hiçbir çıktı gösterilmez</span>

<span class="comment"># Bir dosyayı sıfırla (boşalt ama silme):</span>
<span class="prompt">$</span> <span class="command">cat /dev/null &gt;</span> <span class="path">log.txt</span></code></pre>
</div>

<h2>Girdi Yönlendirme (Input Redirection)</h2>

<div class="info-box note">
    <div class="info-box-title">📌 Dosya argümanı vs &lt; stdin</div>
    <code>wc -l dosya.txt</code> ve <code>wc -l &lt; dosya.txt</code> benzer sonuç verir; fark script'lerde ve pipe zincirlerinde ortaya çıkar. <code>&lt;</code> ile stdin'i açıkça bağlarsınız.
</div>

<h3>Üç yol: dosya, here document, here string</h3>
<p>Komuta metin vermenin üç pratik yolu vardır. Hepsi aynı amaca hizmet eder — <strong>stdin'e veri göndermek</strong> — ama kaynak farklıdır:</p>

<table>
    <tr><th>Operatör</th><th>Adı</th><th>Ne zaman?</th></tr>
    <tr><td><code>&lt; dosya</code></td><td>Dosya yönlendirme</td><td>Metin zaten diskte bir dosyada</td></tr>
    <tr><td><code>&lt;&lt;TAG</code></td><td>Here Document</td><td>Birden fazla satır; script içinde dosya oluşturma</td></tr>
    <tr><td><code>&lt;&lt;&lt; "metin"</code></td><td>Here String</td><td>Tek satırlık metin; hızlı test</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>&lt; — mevcut dosyadan oku</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">wc -l</span> <span class="argument">&lt;</span> <span class="path">metin.txt</span>
<span class="comment"># wc'ye dosya adı argüman olarak değil, stdin'den gider</span></code></pre>
</div>

<h3>Here Document — &lt;&lt;TAG (Burada Belge)</h3>

<div class="eng-box">
    <div class="eng-title">🔤 Terim</div>
    <div class="eng-content">
        <span class="eng-word">Here Document</span> = <span class="eng-meaning">Burada Belge</span> — Komuta girdi olarak verilen, terminalde yazılmış çok satırlı metin bloğu. Ayrı bir dosya oluşturmadan stdin'e metin "beslemek" için kullanılır.<br>
        <span class="eng-word">&lt;&lt;EOF</span> = En yaygın TAG (End Of File). <code>EOF</code> sabit değildir; <code>BITIR</code>, <code>CONFIG</code> gibi herhangi bir kelime olabilir.
    </div>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Nasıl okunur?</div>
    <code>cat &lt;&lt;EOF</code> → "cat komutuna, EOF satırına kadar olan metni stdin olarak ver."<br><br>
    Bash şunu yapar:<br>
    1. <code>&lt;&lt;TAG</code> satırını görünce "here document modu" açılır<br>
    2. Sonraki satırları biriktirir<br>
    3. Tek başına <code>TAG</code> satırını görünce metni stdin'e bağlar ve komutu çalıştırır
</div>

<div class="code-block">
    <div class="code-block-header"><span>Here document — temel sözdizimi</span></div>
    <pre><code><span class="comment"># Yapı:</span>
<span class="command">komut</span> <span class="argument">&lt;&lt;TAG</span>
satır 1
satır 2
<span class="argument">TAG</span>    <span class="comment"># ← TAG tek başına, satır başında, boşluksuz olmalı</span>

<span class="comment"># Örnek — ekrana yazdır:</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="argument">&lt;&lt;EOF</span>
Merhaba dünya
Bu ikinci satır
<span class="argument">EOF</span>

<span class="comment"># Değişkenler genişler (expand):</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="argument">&lt;&lt;EOF</span>
Ev dizinim: $HOME
Bugün: $(date +%Y-%m-%d)
<span class="argument">EOF</span>
<span class="comment"># → $HOME gerçek yol olur, $(date) bugünün tarihini yazar</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 TAG kuralları</div>
    <ul style="margin:0.5em 0;padding-left:1.2em">
        <li><strong>Kapanış TAG'i</strong> satır başında olmalı — önünde boşluk/tab olmamalı (<code> EOF</code> çalışmaz)</li>
        <li>TAG kelimesi metin içinde geçmemeli — yoksa erken kapanır</li>
        <li><code>EOF</code> yerine <code>CONFIG</code>, <code>SQL</code>, <code>BITIR</code> kullanabilirsiniz — önemli olan açılış ve kapanışın aynı olması</li>
        <li><code>&lt;&lt;-TAG</code> (tire ile): kapanış satırındaki <strong>baştaki tab</strong> karakterleri yutulur — girintili script'lerde okunaklılık için</li>
    </ul>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Değişken genişlemesini kapat: &lt;&lt;'EOF'</span></div>
    <pre><code><span class="comment"># Tırnaklı TAG → metin olduğu gibi kalır (literal):</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="argument">&lt;&lt;'EOF'</span>
Ev dizinim: $HOME
<span class="argument">EOF</span>
<span class="output">Ev dizinim: $HOME</span>   <span class="comment"># $HOME genişlemedi</span>

<span class="comment"># Ne zaman kullanılır? Shell script, SQL, YAML gibi $ içeren metinlerde</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="argument">&gt;</span> <span class="path">ornek.sh</span> <span class="argument">&lt;&lt;'SCRIPT'</span>
<span class="keyword">#!/bin/bash</span>
echo "Merhaba \$USER"   <span class="comment"># script içinde $ korunur</span>
<span class="argument">SCRIPT</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Script'te gerçek kullanım — dosya oluşturma</span></div>
    <pre><code><span class="comment"># Yapılandırma dosyası yaz:</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="argument">&gt;</span> <span class="path">config.env</span> <span class="argument">&lt;&lt;EOF</span>
DB_HOST=localhost
DB_PORT=5432
DEBUG=false
<span class="argument">EOF</span>

<span class="comment"># PostgreSQL'e çok satırlı sorgu gönder:</span>
<span class="prompt">$</span> <span class="command">psql</span> <span class="argument">-d mydb</span> <span class="argument">&lt;&lt;SQL</span>
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);
<span class="argument">SQL</span>

<span class="comment"># Heredoc + sudo — root'a metin aktarma:</span>
<span class="prompt">$</span> <span class="command">sudo tee</span> <span class="path">/etc/nginx/sites-available/site</span> <span class="argument">&lt; /dev/null</span> <span class="argument">&lt;&lt;EOF</span>
server {
    listen 80;
    server_name ornek.com;
}
<span class="argument">EOF</span></code></pre>
</div>

<h3>Here String — &lt;&lt;&lt; (Burada Dizge)</h3>

<div class="eng-box">
    <div class="eng-title">🔤 Terim</div>
    <div class="eng-content">
        <span class="eng-word">Here String</span> = <span class="eng-meaning">Burada Dizge</span> — Tek satırlık metni doğrudan komutun stdin'ine verir. Bash'e özgüdür (POSIX sh'de yok). Here document'ın "tek satırlık kısa versiyonu" gibi düşünün.
    </div>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Here string ne işe yarar?</div>
    Uzun here document açmadan, <code>echo ... | komut</code> yazmadan tek satır vermek için. Özellikle <code>grep</code>, <code>wc</code>, <code>tr</code> gibi stdin okuyan komutları hızlı test ederken kullanılır.
</div>

<div class="code-block">
    <div class="code-block-header"><span>Here string örnekleri</span></div>
    <pre><code><span class="comment"># Temel kullanım:</span>
<span class="prompt">$</span> <span class="command">grep</span> <span class="string">"kelime"</span> <span class="argument">&lt;&lt;&lt;</span> <span class="string">"Bu bir test kelime cümlesidir"</span>
<span class="output">Bu bir test kelime cümlesidir</span>

<span class="comment"># Aşağıdakiyle AYNI sonuç:</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"Bu bir test kelime cümlesidir"</span> <span class="argument">|</span> <span class="command">grep</span> <span class="string">"kelime"</span>

<span class="comment"># Satır say:</span>
<span class="prompt">$</span> <span class="command">wc -w</span> <span class="argument">&lt;&lt;&lt;</span> <span class="string">"bir iki üç dört beş"</span>
<span class="output">5</span>

<span class="comment"># Değişkenle:</span>
<span class="prompt">$</span> <span class="command">grep</span> <span class="string">"error"</span> <span class="argument">&lt;&lt;&lt;</span> <span class="string">"$log_satir"</span>

<span class="comment"># Tırnaksız — kelime bölünürse sorun çıkar, tırnak kullanın:</span>
<span class="prompt">$</span> <span class="command">grep</span> <span class="string">"a b"</span> <span class="argument">&lt;&lt;&lt;</span> <span class="string">"x a b y"</span>   <span class="comment"># ✅</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Here document vs here string — hangisi?</div>
    <table style="margin-top:0.5em">
        <tr><th>Durum</th><th>Kullan</th></tr>
        <tr><td>1 satır, hızlı test</td><td><code>&lt;&lt;&lt; "metin"</code></td></tr>
        <tr><td>5+ satır, config/script/SQL</td><td><code>&lt;&lt;EOF ... EOF</code></td></tr>
        <tr><td>Metin zaten dosyada</td><td><code>&lt; dosya.txt</code></td></tr>
        <tr><td><code>$</code> karakterleri literal kalsın</td><td><code>&lt;&lt;'EOF'</code> (tırnaklı TAG)</td></tr>
    </table>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Sık yapılan hatalar</div>
    <strong>1)</strong> Kapanış <code>EOF</code> satırında boşluk: <code> EOF</code> veya <code>EOF </code> → Bash kapanışı tanımaz, komut takılır.<br>
    <strong>2)</strong> Metin içinde yanlışlıkla <code>EOF</code> yazmak → here document erken biter.<br>
    <strong>3)</strong> Here string'te çok satır vermek → mümkün ama amacına aykırı; çok satır için <code>&lt;&lt;EOF</code> kullanın.<br>
    <strong>4)</strong> <code>&lt;&lt;</code> ile <code>&lt;&lt;&lt;</code> karıştırmak — biri çok satır (document), biri tek satır (string).
</div>

<h2>Pipe ( | ) — Boru Hattı</h2>
<div class="info-box warning">
    <div class="info-box-title">⚠️ Pipe sadece stdout'u taşır!</div>
    <code>komut1 | komut2</code> yalnızca <strong>stdout (1)</strong> akışını bağlar. <strong>stderr (2) hata mesajları ekranda kalır</strong> — pipe'a gitmez. Hataları da filtrelemek için:<br>
    <code>komut 2&gt;&amp;1 | grep "hata"</code> — stderr önce stdout'a birleştirilir, sonra pipe'a girer.
</div>
<p>Pipe, bir komutun stdout'unu doğrudan diğer komutun stdin'ine bağlar. Bu, Unix felsefesinin <strong>en temel prensibi</strong>dir: küçük araçları birleştirerek güçlü şeyler yapmak.</p>

<div class="code-block">
    <div class="code-block-header">
        <span>Pipe örnekleri</span>
        <button class="try-btn" onclick="runInTerminal('ls -l | head -5')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># ls çıktısını head'e bağla (ilk 5 satır):</span>
<span class="prompt">$</span> <span class="command">ls -l</span> <span class="argument">|</span> <span class="command">head -5</span>

<span class="comment"># Dosya sayısını say:</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">|</span> <span class="command">wc -l</span>

<span class="comment"># Belirli uzantıdaki dosyaları bul ve say:</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">|</span> <span class="command">grep</span> <span class="string">".txt"</span> <span class="argument">|</span> <span class="command">wc -l</span>

<span class="comment"># En büyük 5 dosya/dizini bul:</span>
<span class="prompt">$</span> <span class="command">du -sh *</span> <span class="argument">|</span> <span class="command">sort -rh</span> <span class="argument">|</span> <span class="command">head -5</span>

<span class="comment"># Benzersiz giriş yapan kullanıcıları say:</span>
<span class="prompt">$</span> <span class="command">who</span> <span class="argument">|</span> <span class="command">cut -d' ' -f1</span> <span class="argument">|</span> <span class="command">sort</span> <span class="argument">|</span> <span class="command">uniq</span> <span class="argument">|</span> <span class="command">wc -l</span>

<span class="comment"># Çalışan süreçlerde arama:</span>
<span class="prompt">$</span> <span class="command">ps aux</span> <span class="argument">|</span> <span class="command">grep</span> <span class="string">"firefox"</span>

<span class="comment"># Log dosyasında "ERROR" satırlarını say:</span>
<span class="prompt">$</span> <span class="command">grep</span> <span class="string">"ERROR"</span> <span class="path">/var/log/syslog</span> <span class="argument">|</span> <span class="command">wc -l</span>

<span class="comment"># Son 100 log satırını canlı izle, hata filtrele:</span>
<span class="prompt">$</span> <span class="command">journalctl</span> <span class="argument">-f</span> <span class="argument">|</span> <span class="command">grep</span> <span class="string">--line-buffered</span> <span class="string">"fail"</span>

<span class="comment"># Komut çıktısını sayfalı oku (uzun listeler):</span>
<span class="prompt">$</span> <span class="command">ls -la /usr/bin</span> <span class="argument">|</span> <span class="command">less</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Script'lerde pipe hatası: pipefail</div>
    Varsayılan Bash'te <code>cmd1 | cmd2 | cmd3</code> zincirinde sadece <strong>son komutun</strong> çıkış kodu ($?) döner — ortadaki komut hata verse bile fark edilmeyebilir. Script'lerde genelde:<br>
    <code>set -o pipefail</code> — zincirdeki <em>herhangi bir</em> komut başarısız olursa tüm pipeline başarısız sayılır.
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Pipe Zinciri — Unix Felsefesi İş Başında</div>
    Her komut tek bir iş yapar, pipe (|) ile birleştirilince karmaşık işler halledilebilir. Bu yüzden Unix araçları <strong>"bir şey yap, onu iyi yap"</strong> felsefesiyle tasarlanmıştır. 5-6 komutu | ile bağlayarak bir programlama dili yazmadan veri analizi yapabilirsiniz.
</div>

<h2>tee — Çıktıyı Hem Dosyaya Hem Ekrana Yaz</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">tee</span> = <span class="eng-meaning">Tesisatçılığın T bağlantısı</span> — Suyun iki yöne aktığı T-boru parçası gibi, veriyi hem dosyaya hem stdout'a gönderir.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>tee kullanımı</span></div>
    <pre><code><span class="comment"># Çıktıyı hem ekranda göster hem dosyaya yaz:</span>
<span class="prompt">$</span> <span class="command">ls -l</span> <span class="argument">|</span> <span class="command">tee</span> <span class="path">liste.txt</span>

<span class="comment"># Dosyaya ekleyerek yaz:</span>
<span class="prompt">$</span> <span class="command">date</span> <span class="argument">|</span> <span class="command">tee -a</span> <span class="path">log.txt</span>

<span class="comment"># Pipe zincirinin ortasında kayıt al:</span>
<span class="prompt">$</span> <span class="command">ls -l</span> <span class="argument">|</span> <span class="command">tee</span> <span class="path">ham_liste.txt</span> <span class="argument">|</span> <span class="command">grep</span> <span class="string">".txt"</span> <span class="argument">|</span> <span class="command">tee</span> <span class="path">txt_dosyalar.txt</span> <span class="argument">|</span> <span class="command">wc -l</span></code></pre>
</div>

<h2>xargs — Argüman Oluşturucu</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">xargs</span> = <span class="eng-meaning">eXtended ARGumentS</span> — stdin'den okunan verileri başka bir komuta argüman olarak geçirir. Pipe'ın yapamadığını yapar.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>xargs örnekleri</span></div>
    <pre><code><span class="comment"># find sonuçlarını rm'ye argüman olarak geçir:</span>
<span class="prompt">$</span> <span class="command">find .</span> <span class="argument">-name "*.tmp"</span> <span class="argument">|</span> <span class="command">xargs rm</span>

<span class="comment"># Her dosyaya tek tek wc uygula:</span>
<span class="prompt">$</span> <span class="command">find .</span> <span class="argument">-name "*.txt"</span> <span class="argument">|</span> <span class="command">xargs wc -l</span>

<span class="comment"># -I ile yer tutucu kullan:</span>
<span class="prompt">$</span> <span class="command">find .</span> <span class="argument">-name "*.log"</span> <span class="argument">|</span> <span class="command">xargs -I{}</span> <span class="command">mv</span> <span class="string">{}</span> <span class="path">/yedek/</span>
<span class="comment"># → Her dosya /yedek/ dizinine taşınır</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Pipe vs xargs — Fark Nedir?</div>
    <code>|</code> pipe, çıktıyı sonraki komutun <strong>stdin</strong>'ine gönderir. Ancak bazı komutlar stdin'den değil <strong>argümandan</strong> okur (rm, mv, cp gibi). <code>xargs</code>, stdin'deki satırları alıp komuta <strong>argüman</strong> olarak ekler.
    <br><br>
    <code>find . -name "*.tmp" | rm</code> → ÇALIŞMAZ ❌ (rm stdin okumaz)<br>
    <code>find . -name "*.tmp" | xargs rm</code> → ÇALIŞIR ✅ (xargs argümana çevirir)
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ xargs ile rm — dikkat!</div>
    <code>find . -name "*.tmp" | xargs rm</code> güçlü ama tehlikelidir — yanlış find deseni tüm dosyaları silebilir. Önce <code>find ... -print</code> veya <code>xargs echo rm</code> ile deneyin. Güvenli alternatif: <code>find . -name "*.tmp" -delete</code> (GNU find).
</div>

<h2>Süreç İkamesi (Process Substitution)</h2>
<p>Süreç ikamesi, bir komutun çıktısını geçici bir dosya gibi kullanmanızı sağlar. Özellikle iki komutun çıktısını karşılaştırırken çok kullanışlıdır.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">Process Substitution</span> = <span class="eng-meaning">Süreç İkamesi</span> — Bir komutun çıktısını dosya yolu gibi kullanma. Bash ve zsh'de çalışır (POSIX sh'de yok).<br>
        <span class="eng-word">&lt;(komut)</span> = Komutun çıktısı → okunabilir dosya gibi davranır<br>
        <span class="eng-word">&gt;(komut)</span> = Yazılan veri → komutun stdin'ine gider
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Process Substitution: &lt;() ve &gt;()</span></div>
    <pre><code><span class="comment"># İki dizinin sıralı içeriklerini karşılaştır:</span>
<span class="prompt">$</span> <span class="command">diff</span> <span class="argument">&lt;(ls dizin1/)</span> <span class="argument">&lt;(ls dizin2/)</span>
<span class="comment"># diff normalde dosya ister. &lt;() sayesinde komut çıktılarını dosya gibi verir</span>

<span class="comment"># İki sunucunun yapılandırmasını karşılaştır:</span>
<span class="prompt">$</span> <span class="command">diff</span> <span class="argument">&lt;(ssh sunucu1 cat /etc/nginx.conf)</span> <span class="argument">&lt;(ssh sunucu2 cat /etc/nginx.conf)</span>

<span class="comment"># Sıralı iki dosyanın birleşimini yap (geçici dosya oluşturmadan):</span>
<span class="prompt">$</span> <span class="command">comm</span> <span class="argument">&lt;(sort dosya1.txt)</span> <span class="argument">&lt;(sort dosya2.txt)</span>

<span class="comment"># Çıktıyı birden fazla komuta aynı anda gönder:</span>
<span class="prompt">$</span> <span class="command">echo "test"</span> | <span class="command">tee</span> <span class="argument">&gt;(grep -c 't')</span> <span class="argument">&gt;(wc -c)</span> > /dev/null</code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Process Substitution Ne Zaman Kullanılır?</div>
    <code>&lt;()</code> şu durumlarda hayat kurtarır:<br>
    • <code>diff</code> ile iki komut çıktısını karşılaştırmak<br>
    • Dosya argümanı bekleyen komutlara pipe çıktısı vermek<br>
    • Geçici dosya oluşturmadan birden fazla girdi kaynağını birleştirmek<br><br>
    <strong>Pipe'dan farkı:</strong> Pipe tek bir komuta stdin gönderir. Process substitution ise komut çıktısını <strong>dosya yolu</strong> olarak geçirir — bu sayede birden fazla &lt;() kullanabilirsiniz.
</div>

<h2>İsimli Borular (Named Pipes / FIFO)</h2>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">Named Pipe / FIFO</span> = <span class="eng-meaning">İsimli Boru</span> — Dosya sisteminde görünen özel bir dosya türü. First In, First Out (ilk giren ilk çıkar) prensibiyle çalışır. İki ayrı sürecin kalıcı bir boru ile iletişim kurmasını sağlar.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>mkfifo ile isimli boru</span></div>
    <pre><code><span class="comment"># İsimli boru oluştur</span>
<span class="prompt">$</span> <span class="command">mkfifo</span> <span class="path">benim_borum</span>
<span class="prompt">$</span> <span class="command">ls -l</span> <span class="path">benim_borum</span>
<span class="output">prw-r--r-- 1 user user 0 Jun 10 14:00 benim_borum</span>
<span class="comment"># 'p' = pipe (boru) türü dosya</span>

<span class="comment"># Terminal 1: Boruya yaz (yazma bitene kadar bekler)</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"Merhaba!"</span> > <span class="path">benim_borum</span>

<span class="comment"># Terminal 2: Borudan oku</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="path">benim_borum</span>
<span class="output">Merhaba!</span>

<span class="comment"># İsimli boruyu sil (normal dosya gibi)</span>
<span class="prompt">$</span> <span class="command">rm</span> <span class="path">benim_borum</span></code></pre>
</div>

<h2>Dosya Tanıtıcıları (File Descriptors)</h2>
<p>0, 1, 2 dışında kendi dosya tanıtıcılarınızı da açabilirsiniz. Bu, gelişmiş yönlendirme senaryolarında kullanılır:</p>

<div class="code-block">
    <div class="code-block-header"><span>Özel dosya tanıtıcıları</span></div>
    <pre><code><span class="comment"># FD 3'ü bir dosyaya yönlendir</span>
<span class="prompt">$</span> <span class="command">exec 3></span> <span class="path">ozel_log.txt</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"Bu FD 3'e yazılır"</span> <span class="argument">>&3</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"Bu da FD 3'e"</span> <span class="argument">>&3</span>
<span class="prompt">$</span> <span class="command">exec 3>&-</span>  <span class="comment"># FD 3'ü kapat</span>

<span class="comment"># FD 4'ü okuma için aç</span>
<span class="prompt">$</span> <span class="command">exec 4<</span> <span class="path">girdi.txt</span>
<span class="prompt">$</span> <span class="command">read satir</span> <span class="argument"><&4</span>
<span class="prompt">$</span> <span class="command">exec 4<&-</span>  <span class="comment"># FD 4'ü kapat</span>

<span class="comment"># stdout ve stderr'i ayrı dosyalara yönlendirme</span>
<span class="prompt">$</span> <span class="command">komut</span> <span class="argument">1>stdout.txt 2>stderr.txt</span>

<span class="comment"># stderr'i stdout'a yönlendirip ikisini birden pipe'a gönder</span>
<span class="prompt">$</span> <span class="command">komut</span> <span class="argument">2>&1</span> | <span class="command">grep</span> <span class="string">"hata"</span></code></pre>
</div>

<h3>Yönlendirme Özet Tablosu</h3>
<table>
    <tr><th>Operatör</th><th>İşlev</th><th>Örnek</th></tr>
    <tr><td><code>&gt;</code></td><td>stdout → dosya (üzerine yaz)</td><td><code>ls &gt; liste.txt</code></td></tr>
    <tr><td><code>&gt;&gt;</code></td><td>stdout → dosya (ekle)</td><td><code>echo "!" &gt;&gt; liste.txt</code></td></tr>
    <tr><td><code>2&gt;</code></td><td>stderr → dosya</td><td><code>cmd 2&gt; hata.txt</code></td></tr>
    <tr><td><code>&amp;&gt;</code></td><td>stdout+stderr → dosya</td><td><code>cmd &amp;&gt; hepsi.txt</code></td></tr>
    <tr><td><code>&lt;</code></td><td>dosya → stdin</td><td><code>wc -l &lt; dosya.txt</code></td></tr>
    <tr><td><code>&lt;&lt;TAG</code></td><td>Here Document — çok satırlı metin → stdin</td><td><code>cat &lt;&lt;EOF ... EOF</code></td></tr>
    <tr><td><code>&lt;&lt;&lt;</code></td><td>Here String — tek satır metin → stdin</td><td><code>grep x &lt;&lt;&lt; "text"</code></td></tr>
    <tr><td><code>|</code></td><td>stdout → sonraki stdin</td><td><code>cmd1 | cmd2</code></td></tr>
    <tr><td><code>| tee</code></td><td>stdout → dosya + ekran</td><td><code>cmd | tee out.txt</code></td></tr>
    <tr><td><code>| xargs</code></td><td>stdin → argüman</td><td><code>find . | xargs rm</code></td></tr>
</table>

<h2>Gerçek Dünya Senaryoları</h2>
<div class="info-box tip">
    <div class="info-box-title">💡 Günlük işler — kopyala-yapıştır tarifler</div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>5 pratik senaryo</span></div>
    <pre><code><span class="comment"># 1) Komut çıktısını kaydet + ekranda gör (deploy logu):</span>
<span class="prompt">$</span> <span class="command">./deploy.sh</span> <span class="argument">2>&amp;1</span> <span class="argument">|</span> <span class="command">tee</span> <span class="path">deploy-$(date +%Y%m%d).log</span>

<span class="comment"># 2) Sadece hataları dosyaya, normal çıktı ekranda:</span>
<span class="prompt">$</span> <span class="command">make</span> <span class="argument">2&gt;</span> <span class="path">build-hatalar.txt</span>

<span class="comment"># 3) Büyük logda son 50 "error" satırı:</span>
<span class="prompt">$</span> <span class="command">grep</span> <span class="argument">-i error</span> <span class="path">app.log</span> <span class="argument">|</span> <span class="command">tail</span> <span class="argument">-50</span>

<span class="comment"># 4) İki klasördeki dosya listesini karşılaştır:</span>
<span class="prompt">$</span> <span class="command">diff</span> <span class="argument">&lt;(ls -1 eski/)</span> <span class="argument">&lt;(ls -1 yeni/)</span>

<span class="comment"># 5) find + xargs: boş .tmp dosyalarını sil (önce -print ile kontrol!):</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">/tmp/proje</span> <span class="argument">-name "*.tmp" -type f</span> <span class="argument">|</span> <span class="command">xargs</span> <span class="argument">rm -v</span></code></pre>
</div>

<h2>Özet — Ne Zaman Hangisi?</h2>
<table>
    <tr><th>İhtiyacınız</th><th>Çözüm</th></tr>
    <tr><td>Çıktıyı dosyaya yaz</td><td><code>&gt;</code> veya <code>&gt;&gt;</code></td></tr>
    <tr><td>Hataları ayrı kaydet</td><td><code>2&gt; hata.log</code></td></tr>
    <tr><td>Hepsini tek dosyaya</td><td><code>&amp;&gt; hepsi.log</code></td></tr>
    <tr><td>Çıktıyı başka komuta ver</td><td><code>|</code> pipe</td></tr>
    <tr><td>Pipe + dosyaya kaydet</td><td><code>| tee log.txt</code></td></tr>
    <tr><td>find sonucunu rm/mv'ye ver</td><td><code>| xargs</code></td></tr>
    <tr><td>İki komut çıktısını diff'le</td><td><code>diff &lt;(cmd1) &lt;(cmd2)</code></td></tr>
    <tr><td>Gürültüyü sustur</td><td><code>2&gt; /dev/null</code></td></tr>
</table>
`,
    quiz: [
        {
            question: "Linux'ta her programın sahip olduğu üç standart akış nedir?",
            options: [
                "stdin, stdout, stderr",
                "pipe, redirect, tee",
                "read, write, error",
                "input, output, log"
            ],
            correct: 0,
            explanation: "Her Linux programı stdin (standart girdi, FD 0), stdout (standart çıktı, FD 1) ve stderr (standart hata, FD 2) akışlarıyla başlar."
        },
        {
            question: "'echo Merhaba > dosya.txt' ve 'echo Merhaba >> dosya.txt' arasındaki fark nedir?",
            options: [
                "> dosyayı sıfırdan yazar (üzerine), >> mevcut içeriğe ekler",
                "> ekrana yazar, >> dosyaya yazar",
                "> hızlı, >> yavaş",
                "Fark yoktur"
            ],
            correct: 0,
            explanation: "> (tek ok) dosyayı siler ve baştan yazar. >> (çift ok) dosyanın sonuna ekler, mevcut içeriği korur."
        },
        {
            question: "'find / -name dosya 2> /dev/null' komutundaki '2> /dev/null' ne yapar?",
            options: [
                "Hata mesajlarını yok eder (bastırır)",
                "Normal çıktıyı /dev/null'a yazar",
                "2 saniye sonra iptal eder",
                "Çıktıyı iki ayrı dosyaya yazar"
            ],
            correct: 0,
            explanation: "2> stderr'i yönlendirir. /dev/null kendisine yazılan her şeyi yutan özel dosyadır. Yani 'Permission denied' gibi hatalar bastırılır."
        },
        {
            question: "'ls | grep .txt | wc -l' komutu ne yapar?",
            options: [
                "ls çıktısından .txt içeren satırları filtreler ve sayısını verir",
                "Hata verir çünkü 3 pipe kullanılamaz",
                "txt dosyalarını siler ve sayar",
                "Sadece txt dosyalarını listeler"
            ],
            correct: 0,
            explanation: "ls çıktısı → grep .txt içerenleri filtreler → wc -l kalan satır sayısını verir. Bu, kaç tane .txt dosyası olduğunu gösterir."
        },
        {
            question: "xargs komutu ne işe yarar?",
            options: [
                "stdin'den gelen veriyi komuta argüman olarak geçirir",
                "Metin editörü açar",
                "Programları arka planda çalıştırır",
                "Dosyaları sıkıştırır"
            ],
            correct: 0,
            explanation: "xargs stdin'den okuduğu satırları alır ve bunları bir komuta argüman olarak ekler. rm, mv gibi stdin okumayan komutlarla pipe kullanmayı sağlar."
        },
        {
            question: "'diff <(ls dizin1/) <(ls dizin2/)' komutundaki '<()' ne anlama gelir?",
            options: [
                "Süreç ikamesi (process substitution)",
                "Alt kabuk açar",
                "Hata yönlendirme",
                "Dosya yönlendirme"
            ],
            correct: 0,
            explanation: "<() süreç ikamesi, komutun çıktısını geçici bir dosya yolu olarak sunar. diff gibi dosya argümanı bekleyen komutlarla kullanılır."
        },
        {
            question: "Pipe (|) kullanırken stderr (hata çıktısı) ne olur?",
            options: [
                "Varsayılan olarak ekranda kalır, pipe'a gitmez",
                "Otomatik olarak sonraki komuta gider",
                "Her zaman /dev/null'a gider",
                "stdout ile birleşir"
            ],
            correct: 0,
            explanation: "Pipe yalnızca stdout'u bağlar. stderr ekranda kalır; birleştirmek için 2>&1 | kullanılır."
        },
        {
            question: "set -o pipefail ne sağlar?",
            options: [
                "Pipe zincirinde herhangi bir komut hata verirse tüm pipeline başarısız sayılır",
                "Pipe kullanımını tamamen yasaklar",
                "stderr'i otomatik kapatır",
                "Sadece son komutun çıktısını gösterir"
            ],
            correct: 0,
            explanation: "Varsayılan Bash'te $? sadece son komutu yansıtır. pipefail ile ortadaki komut hata verirse script bunu fark eder."
        },
        {
            question: "cat <<'EOF' ... EOF kullanıldığında $HOME gibi değişkenler ne olur?",
            options: [
                "Genişlemez — metin olduğu gibi kalır (literal)",
                "Her zaman boş string olur",
                "Sadece root kullanıcıda genişler",
                "Hata verir ve komut durur"
            ],
            correct: 0,
            explanation: "TAG tırnak içindeyse (<<'EOF') here document'ta değişken genişlemesi kapalıdır. $HOME literal olarak kalır."
        },
        {
            question: "grep 'kelime' <<< 'test kelime' komutu ne yapar?",
            options: [
                "Tek satırlık metni stdin olarak grep'e verir",
                "Üç dosyayı birleştirir",
                "Here document açar ve EOF bekler",
                "stderr'i dosyaya yönlendirir"
            ],
            correct: 0,
            explanation: "<<< (here string) tek satırlık metni doğrudan komutun stdin'ine verir. echo ... | grep ile aynı işi daha kısa yapar."
        }
    ]
});
