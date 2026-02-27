// ===== Bölüm 11: Piping ve Yönlendirme =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 11,
    title: 'Piping ve Yönlendirme',
    subtitle: 'Piping and Redirection',
    icon: '🔀',
    description: 'Komut çıktılarını yönlendirme, pipe ile zincirleme, stdin/stdout/stderr akışları.',
    content: `
<h2>Üç Temel Akış (Three Streams)</h2>
<p>Linux'ta her program çalıştığında üç veri akışı otomatik olarak açılır:</p>

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
    <code>&gt;</code> operatörü dosyayı <strong>tamamen siler</strong> ve baştan yazar. Mevcut bir dosyanın sonuna eklemek istiyorsanız mutlaka <code>&gt;&gt;</code> kullanın! Yanlışlıkla <code>&gt; önemli_dosya.txt</code> yaparsanız dosyanın eski içeriği geri gelmez.
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

<div class="code-block">
    <div class="code-block-header"><span>stdin yönlendirme: &lt; ve &lt;&lt;</span></div>
    <pre><code><span class="comment"># Dosyadan stdin'e yönlendir:</span>
<span class="prompt">$</span> <span class="command">wc -l</span> <span class="argument">&lt;</span> <span class="path">metin.txt</span>
<span class="comment"># wc'ye dosya argüman olarak değil, stdin'den gider</span>

<span class="comment"># Here Document (Burada Belge):</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="argument">&lt;&lt;EOF</span>
Bu birden fazla satırlık
bir metin bloğudur.
Değişkenler de çalışır: $HOME
<span class="argument">EOF</span>

<span class="comment"># Here String (Burada Dizge) — tek satırlık girdi:</span>
<span class="prompt">$</span> <span class="command">grep</span> <span class="string">"kelime"</span> <span class="argument">&lt;&lt;&lt;</span> <span class="string">"Bu bir test kelime cümlesidir"</span></code></pre>
</div>

<h2>Pipe ( | ) — Boru Hattı</h2>
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
<span class="prompt">$</span> <span class="command">ps aux</span> <span class="argument">|</span> <span class="command">grep</span> <span class="string">"firefox"</span></code></pre>
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
    <tr><td><code>&lt;&lt;TAG</code></td><td>Here Document</td><td><code>cat &lt;&lt;EOF ... EOF</code></td></tr>
    <tr><td><code>&lt;&lt;&lt;</code></td><td>Here String</td><td><code>grep x &lt;&lt;&lt; "text"</code></td></tr>
    <tr><td><code>|</code></td><td>stdout → sonraki stdin</td><td><code>cmd1 | cmd2</code></td></tr>
    <tr><td><code>| tee</code></td><td>stdout → dosya + ekran</td><td><code>cmd | tee out.txt</code></td></tr>
    <tr><td><code>| xargs</code></td><td>stdin → argüman</td><td><code>find . | xargs rm</code></td></tr>
</table>
`,
    quiz: [
        {
            question: "Linux'ta her programın sahip olduğu üç standart akış nedir?",
            options: ["input, output, log", "stdin, stdout, stderr", "read, write, error", "pipe, redirect, tee"],
            correct: 1,
            explanation: "Her Linux programı stdin (standart girdi, FD 0), stdout (standart çıktı, FD 1) ve stderr (standart hata, FD 2) akışlarıyla başlar."
        },
        {
            question: "'echo Merhaba > dosya.txt' ve 'echo Merhaba >> dosya.txt' arasındaki fark nedir?",
            options: ["> hızlı, >> yavaş", "> ekrana yazar, >> dosyaya yazar", "> dosyayı sıfırdan yazar, >> mevcut içeriğe ekler", "Fark yoktur"],
            correct: 2,
            explanation: "> (tek ok) dosyayı siler ve baştan yazar. >> (çift ok) dosyanın sonuna ekler, mevcut içeriği korur."
        },
        {
            question: "'find / -name dosya 2> /dev/null' komutundaki '2> /dev/null' ne yapar?",
            options: ["Normal çıktıyı /dev/null'a yazar", "Hata mesajlarını yok eder (bastırır)", "2 saniye sonra iptal eder", "Çıktıyı 2 dosyaya yazar"],
            correct: 1,
            explanation: "2> stderr'i yönlendirir. /dev/null kendisine yazılan her şeyi yutan özel dosyadır. Yani 'Permission denied' gibi hatalar bastırılır."
        },
        {
            question: "'ls | grep .txt | wc -l' komutu ne yapar?",
            options: ["txt dosyalarını siler ve sayar", "txt dosyalarını listeler, sayar ve ekrana yazar", "ls çıktısından .txt içerenleri filtreler, sonra satır sayar", "Hata verir çünkü 3 pipe kullanılamaz"],
            correct: 2,
            explanation: "ls çıktısı → grep .txt içerenleri filtreler → wc -l kalan satır sayısını verir. Bu, kaç tane .txt dosyası olduğunu gösterir."
        },
        {
            question: "xargs komutu ne işe yarar?",
            options: ["Dosyaları sıkıştırır", "stdin'den gelen veriyi komuta argüman olarak geçirir", "Programları arka planda çalıştırır", "Metin editörü açar"],
            correct: 1,
            explanation: "xargs stdin'den okuduğu satırları alır ve bunları bir komuta argüman olarak ekler. rm, mv gibi stdin okumayan komutlarla pipe kullanmayı sağlar."
        },
        {
            question: "'diff <(ls dizin1/) <(ls dizin2/)' komutundaki '<()' ne anlama gelir?",
            options: ["Dosya yönlendirme", "Süreç ikamesi (process substitution) — komut çıktısını dosya gibi kullanma", "Alt kabuk açar ve kapatır", "Hata yönlendirme"],
            correct: 1,
            explanation: "<() süreç ikamesi, komutun çıktısını geçici bir dosya yolu olarak sunar. diff gibi dosya argümanı bekleyen komutlarla kullanılır."
        }
    ]
});
