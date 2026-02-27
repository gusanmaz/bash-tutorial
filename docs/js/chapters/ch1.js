// ===== Bölüm 1: Komut Satırı =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 1,
    title: 'Komut Satırı',
    subtitle: 'The Command Line',
    icon: '💻',
    description: 'Komut satırı nedir, nasıl çalışır? Terminal programları, kabuklar ve CLI\'nin GUI\'den neden daha güçlü olduğu.',
    content: `
<h2>Terminalin Tarihçesi</h2>
<p>Bugün kullandığımız "terminal" kavramını anlamak için, bilgisayarların ilk günlerine bakmamız gerekir. Çünkü <strong>bir zamanlar bilgisayarlarla etkileşim kurmanın tek yolu metin tabanlı terminallerdi</strong> — fare, pencere, ikon gibi kavramlar henüz icat edilmemişti.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">Teletype (TTY)</span> = <span class="eng-meaning">Teletip</span> — İlk bilgisayar terminalleri. Fiziksel bir yazıcı + klavye cihazı.<br>
        <span class="eng-word">Mainframe</span> = <span class="eng-meaning">Ana Bilgisayar</span> — Oda büyüklüğünde devasa bilgisayarlar.<br>
        <span class="eng-word">Terminal Emulator</span> = <span class="eng-meaning">Terminal Emülatörü</span> — Fiziksel terminalleri yazılımla taklit eden modern programlar.<br>
        <span class="eng-word">Dumb Terminal</span> = <span class="eng-meaning">Aptal Terminal</span> — Kendi işlem gücü olmayan, sadece giriş/çıkış yapan uç birim.
    </div>
</div>

<h3>📟 1950-60'lar: Delikli Kartlar ve Teletip'ler</h3>
<p>Bilgisayarların ilk döneminde <strong>ekran bile yoktu</strong>. Programlar <strong>delikli kartlara (punch cards)</strong> yazılırdı — kartlardaki delik desenleri komutları temsil ediyordu. Bir program çalıştırmak için yüzlerce kartı doğru sırayla makineye beslerdiniz ve çıktıyı kâğıt üzerinde alırdınız.</p>

<figure class="historic-photo">
    <img src="img/punch_card.jpg" alt="Delikli kart (punch card) — 1960'lar" loading="lazy">
    <figcaption>Gerçek bir delikli kart (punch card). Her sütundaki delik deseni bir karakteri temsil eder. Fotoğraf: Pete Birkinshaw, CC BY 2.0</figcaption>
</figure>

<p>Sonra <strong>teletip makineleri (teletype / TTY)</strong> geldi. Bunlar bir klavye ve bir yazıcıdan oluşuyordu — yazdığınız komutlar kâğıda basılıyor, bilgisayarın cevabı da yine kâğıda basılıyordu. Ekran yok, sadece kâğıt! Linux'ta bugün hâlâ kullanılan <code>/dev/tty</code> dosya adları bu dönemin mirasıdır.</p>

<figure class="historic-photo">
    <img src="img/teletype_asr33.jpg" alt="Teletype ASR-33 teletip makinesi" loading="lazy">
    <figcaption>Teletype ASR-33 — 1960-70'lerin en yaygın teletip makinesi. Klavye + kağıt yazici. Computer History Museum'da sergilenmektedir. Fotoğraf: ArnoldReinhold, CC BY-SA 3.0</figcaption>
</figure>

<h3>🖥️ 1970'ler: Video Terminalleri ve Unix</h3>
<p>1970'lerde kâğıt terminallerin yerini <strong>video terminalleri</strong> aldı — artık bir CRT ekran (televizyon benzeri) ve klavye vardı. <strong>VT100</strong> (1978, DEC firması) en ünlü terminal modelidir ve standart haline geldi. Bugün terminal emülatörlerinde gördüğünüz renk kodları ve kaçış dizileri (escape sequences) VT100'den miras kalmıştır.</p>

<figure class="historic-photo">
    <img src="img/vt100_terminal.png" alt="DEC VT100 video terminali" loading="lazy">
    <figcaption>DEC VT100 (1978) — tarihte en etkili video terminal. Ekrandaki yeşil yazılar ve yanıp sönen imleç, tüm terminal emülatörlerinin atasıdır. Fotoğraf: Gorthmog, CC BY-SA 4.0</figcaption>
</figure>

<p>Aynı yıllarda <strong>Unix</strong> işletim sistemi (1969-70, Bell Labs) geliştirildi. Unix'in temel felsefesi <strong>"her şey metin"</strong> ve <strong>"küçük, bir iş yapan programları birleştir"</strong> idi. Bu felsefe, Linux'un ve tüm CLI kültürünün temelini oluşturur.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Mainframe Dönemi</div>
    Bu dönemde bilgisayarlar <strong>oda büyüklüğünde</strong> ve <strong>milyonlarca dolar</strong> değerindeydi. Bir üniversite veya şirketin tek bir bilgisayarı olur, onlarca kullanıcı <strong>"aptal terminal" (dumb terminal)</strong> denilen cihazlarla bu merkezi bilgisayara bağlanırdı. Terminallerin kendi işlem gücü yoktu — sadece klavye ve ekrandan ibaretti. Tüm hesaplama ana makinede (mainframe) yapılırdı. Bugünkü bulut bilişim (cloud computing) aslında bu modelin modern versiyonudur!
</div>

<h3>💻 1980-90'lar: Kişisel Bilgisayarlar ve GUI Devrimi</h3>
<p>1981'de IBM PC, 1984'te Apple Macintosh ile <strong>kişisel bilgisayar çağı</strong> başladı. Macintosh, <strong>grafiksel kullanıcı arayüzünü (GUI)</strong> halka tanıttı: fare, pencereler, ikonlar, menüler. Ardından <strong>Windows</strong> geldi (1985) ve GUI kitlesel olarak yaygınlaştı.</p>
<p>Bu dönemde birçok kişi terminalin <strong>"öldüğünü"</strong> düşündü. Oysa arka planda sistem yöneticileri, programcılar ve bilim insanları terminal kullanmaya devam etti — çünkü <strong>güç kullanıcıları</strong> için GUI hiçbir zaman yeterli olmadı.</p>

<h3>🐧 1991-Bugün: Linux ve Terminalin Rönesansı</h3>
<p>1991'de Linus Torvalds'ın Linux'u yaratmasıyla terminal yeni bir hayat buldu. İnternet çağında web sunucularının çoğu <strong>terminal üzerinden yönetilen Linux sunucuları</strong> haline geldi. Bugün:</p>
<ul>
    <li>Dünyada web sunucularının <strong>%96'sından fazlası</strong> Linux çalıştırır</li>
    <li>Tüm süper bilgisayarların <strong>%100'ü</strong> Linux kullanır</li>
    <li>DevOps, bulut bilişim ve yapay zeka alanlarında <strong>terminal birincil araçtır</strong></li>
    <li>Modern geliştiricilerin büyük çoğunluğu günlük iş akışlarında terminal kullanır</li>
</ul>
<p>Yani terminal "eski bir teknoloji" değil — aksine bilişimin en <strong>dayanıklı ve güçlü</strong> arayüzüdür. GUI'ler gelip geçer (düşünün: Windows 3.1, Windows 8 Metro, macOS Aqua...), ama terminal 50 yıldan fazladır temelde aynı şekilde çalışır.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Geçmişten Bugüne Terminal</div>
    1970'lerde <code>ls</code> yazarak dosya listeliyordunuz. 2026'da da <code>ls</code> yazarak dosya listeliyorsunuz. 50+ yıllık komutlar hâlâ çalışıyor! Bugün öğrendiğiniz terminal bilgisi 10-20 yıl sonra da geçerli olacak. Bunu hangi GUI yapabilir?
</div>

<h2>Giriş: CLI vs GUI</h2>
<p>Bilgisayarla etkileşim kurmanın iki temel yolu vardır:</p>
<ul>
    <li><strong>GUI (Graphical User Interface — Grafiksel Kullanıcı Arayüzü):</strong> Fare ile tıkladığınız, sürükleyip bıraktığınız görsel pencereler.</li>
    <li><strong>CLI (Command Line Interface — Komut Satırı Arayüzü):</strong> Metin tabanlı komutlar yazarak bilgisayarı yönlendirdiğiniz arayüz.</li>
</ul>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">Command Line Interface (CLI)</span> = <span class="eng-meaning">Komut Satırı Arayüzü</span> — Metin tabanlı etkileşim.<br>
        <span class="eng-word">Graphical User Interface (GUI)</span> = <span class="eng-meaning">Grafiksel Kullanıcı Arayüzü</span> — Fare ve pencerelerle etkileşim.<br>
        <span class="eng-word">Terminal</span> = <span class="eng-meaning">Uçbirim</span> — CLI'ye eriştiğiniz pencere/program.<br>
        <span class="eng-word">Shell</span> = <span class="eng-meaning">Kabuk</span> — Yazdığınız komutları yorumlayan program.<br>
        <span class="eng-word">Console</span> = <span class="eng-meaning">Konsol</span> — Terminal ile eşanlamlı kullanılır, fiziksel terminali ifade edebilir.
    </div>
</div>

<h2>Neden Komut Satırı?</h2>
<p>"Fare ile tıklamak varken neden komut yazayım?" diye düşünebilirsiniz. İşte CLI'nin GUI'ye göre avantajları, <strong>gerçek örneklerle</strong>:</p>

<h3>⚡ 1. Hız ve Verimlilik</h3>
<div class="code-block">
    <div class="code-block-header">
        <span>Örnek: İç içe 8 klasör oluşturma</span>
        <button class="try-btn" onclick="runInTerminal('mkdir -p proje/src/components/ui/buttons/icons/svg/dark')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># CLI ile — TEK KOMUT, 1 saniye:</span>
<span class="prompt">$</span> <span class="command">mkdir -p</span> <span class="path">proje/src/components/ui/buttons/icons/svg/dark</span>

<span class="comment"># GUI ile — Dosya yöneticisinde:</span>
<span class="comment"># 1. Sağ tık → Yeni Klasör → "proje" yaz → Enter</span>
<span class="comment"># 2. proje'ye çift tık → Sağ tık → Yeni Klasör → "src" yaz → Enter</span>
<span class="comment"># 3. src'ye çift tık → Sağ tık → Yeni Klasör → "components" yaz → Enter</span>
<span class="comment"># ... ve böyle 8 kez tekrarla! ~30 saniye</span></code></pre>
</div>

<h3>📁 2. Toplu İşlem Gücü</h3>
<div class="code-block">
    <div class="code-block-header"><span>Örnek: 500 dosyayı yeniden adlandırma</span></div>
    <pre><code><span class="comment"># CLI ile — tüm .jpeg dosyalarını .jpg yap:</span>
<span class="prompt">$</span> <span class="command">for f in</span> *.jpeg; <span class="command">do</span> mv "$f" "\${f%.jpeg}.jpg"; <span class="command">done</span>
<span class="comment"># 500 dosya → 2 saniye</span>

<span class="comment"># GUI ile: Her dosyayı tek tek sağ tık → Yeniden Adlandır...</span>
<span class="comment"># 500 dosya × 10 saniye = ~83 dakika 😱</span></code></pre>
</div>

<h3>🔄 3. Otomatikleştirme</h3>
<div class="code-block">
    <div class="code-block-header"><span>Örnek: Her gece otomatik yedekleme</span></div>
    <pre><code><span class="comment"># Script yazıp cron ile zamanlayın:</span>
<span class="prompt">$</span> <span class="command">crontab -e</span>
<span class="comment"># Her gece saat 02:00'de yedekleme:</span>
0 2 * * * /home/kullanici/yedekleme.sh

<span class="comment"># GUI ile bunu her gece elle yapmanız gerekirdi!</span></code></pre>
</div>

<h3>🔍 4. Güçlü Arama ve Filtreleme</h3>
<div class="code-block">
    <div class="code-block-header">
        <span>Örnek: Tüm projelerde "TODO" yorumlarını bulma</span>
    </div>
    <pre><code><span class="comment"># Tüm .py dosyalarında "TODO" içeren satırları bul:</span>
<span class="prompt">$</span> <span class="command">grep -rn</span> <span class="string">"TODO"</span> <span class="path">~/projeler/</span> <span class="argument">--include="*.py"</span>

<span class="comment"># 10.000+ dosya içinde anında sonuç!</span>
<span class="comment"># GUI ile: Her dosyayı tek tek açıp Ctrl+F ile aramak... 😤</span></code></pre>
</div>

<h3>🌐 5. Uzaktan Erişim (SSH)</h3>
<div class="code-block">
    <div class="code-block-header"><span>Örnek: Uzaktaki sunucuya bağlanma</span></div>
    <pre><code><span class="comment"># Dünyanın öbür ucundaki sunucuya tek komutla bağlan:</span>
<span class="prompt">$</span> <span class="command">ssh</span> kullanici@sunucu.com

<span class="comment"># Artık o bilgisayarı sanki önünüzdeymiş gibi kullanın!</span>
<span class="comment"># GUI ile uzaktan erişim çok daha yavaş ve bant genişliği gerektirir.</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 CLI vs GUI: Hangisini Ne Zaman?</div>
    CLI her durumda "daha iyi" değildir. <strong>Fotoğraf düzenleme</strong>, <strong>web tasarımı</strong>, <strong>video izleme</strong> gibi görsel işler doğal olarak GUI gerektirir. Ancak <strong>dosya yönetimi</strong>, <strong>metin işleme</strong>, <strong>sistem yönetimi</strong> ve <strong>geliştirme</strong> görevlerinde CLI çok daha hızlı ve güçlüdür. En iyisi: <strong>ikisini de bilmek</strong>!
</div>

<h3>🧩 6. Birleştirilebilirlik (Composability)</h3>
<p>CLI programlarının en güçlü yanlarından biri, <strong>boru hattı (pipe)</strong> ile birbirlerine bağlanabilmeleridir. Unix felsefesinde her program <strong>bir işi iyi yapar</strong> ve çıktısını diğerine aktarabilir:</p>
<div class="code-block">
    <div class="code-block-header"><span>Pipe ile programları birleştirme</span></div>
    <pre><code><span class="comment"># En çok disk kullanan 10 klasörü bul:</span>
<span class="prompt">$</span> <span class="command">du -sh</span> <span class="path">/*</span> 2>/dev/null | <span class="command">sort -rh</span> | <span class="command">head -10</span>

<span class="comment"># Açıklama: du (disk kullanımı) → sort (büyükten küçüğe sırala) → head (ilk 10)</span>
<span class="comment"># 3 basit program birleşerek güçlü bir analiz aracı oldu!</span>

<span class="comment"># Web sunucusu loglarından en çok istek yapan 5 IP'yi bul:</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="path">access.log</span> | <span class="command">awk</span> <span class="string">'{print $1}'</span> | <span class="command">sort</span> | <span class="command">uniq -c</span> | <span class="command">sort -rn</span> | <span class="command">head -5</span>

<span class="comment"># GUI'de bu analizi yapmak için özel bir yazılım satın almanız gerekirdi.</span></code></pre>
</div>

<h3>📝 7. Tekrarlanabilirlik ve Dokümantasyon</h3>
<p>CLI komutları <strong>metin</strong> olduğu için:</p>
<ul>
    <li><strong>Kopyalanabilir:</strong> Bir komutu kopyalayıp başka birine gönderebilir veya bir blog yazısına ekleyebilirsiniz</li>
    <li><strong>Versiyonlanabilir:</strong> Script'lerinizi Git ile takip edebilirsiniz</li>
    <li><strong>Tekrarlanabilir:</strong> "Dosya menüsünden şuraya tıkla, sonra buraya..." yerine tam komutu paylaşırsınız</li>
    <li><strong>Denetlenebilir:</strong> Bir sunucuda ne yapıldığını komut geçmişinden görebilirsiniz</li>
</ul>


<h2>Kabuk (Shell) Nedir?</h2>
<p>Terminali açtığınızda sizi karşılayan, yazdığınız komutları yorumlayıp çekirdeğe (kernel) ileten program <strong>kabuk (shell)</strong> olarak adlandırılır. Neden "kabuk"? Çünkü işletim sisteminin çekirdeğini (kernel = iç, core) saran dış katmandır — siz kabuğa komut verirsiniz, kabuk çekirdeğe iletir.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">Shell</span> = <span class="eng-meaning">Kabuk</span> — İşletim sistemi çekirdeğini saran komut yorumlayıcı program.<br>
        <span class="eng-word">Kernel</span> = <span class="eng-meaning">Çekirdek</span> — İşletim sisteminin donanımla konuşan iç katmanı.<br>
        <span class="eng-word">Interpreter</span> = <span class="eng-meaning">Yorumlayıcı</span> — Komutları satır satır okuyup çalıştıran program.<br>
        <span class="eng-word">Prompt</span> = <span class="eng-meaning">Komut İstemi</span> — Kabuğun "komut bekliyorum" dediği satır.
    </div>
</div>

<p>Kabuğun rolünü şöyle düşünebilirsiniz:</p>
<div class="code-block">
    <div class="code-block-header"><span>Kabuk nasıl çalışır?</span></div>
    <pre><code><span class="comment"># Siz terminalde şunu yazarsınız:</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">-la</span> <span class="path">/home</span>

<span class="comment"># Perde arkasında olan:</span>
<span class="comment"># 1. Kabuk (bash) komutu okur: "ls -la /home"</span>
<span class="comment"># 2. "ls" programını bulur (/usr/bin/ls)</span>
<span class="comment"># 3. Çekirdeğe (kernel) "bu programı çalıştır" der</span>
<span class="comment"># 4. Çekirdek programı çalıştırır, diskten dosya listesini alır</span>
<span class="comment"># 5. Çıktı terminale geri döner ve siz ekranda görürsünüz</span>

<span class="comment"># Yani akış şöyledir:</span>
<span class="comment"># SİZ → Terminal → Kabuk (bash) → Çekirdek (kernel) → Donanım</span>
<span class="comment">#                                                      ↓</span>
<span class="comment"># SİZ ← Terminal ← Kabuk (bash) ← Çekirdek (kernel) ← Sonuç</span></code></pre>
</div>

<h3>Neden Birden Fazla Kabuk Var?</h3>
<p>Kabuk bir programdır ve birden fazla programcı "daha iyi bir kabuk yazabilirim" demiştir — tıpkı birden fazla web tarayıcısı (Chrome, Firefox, Safari) veya metin editörü (VS Code, Vim, Nano) olması gibi. İşte Unix/Linux tarihinin önemli kabukları:</p>

<table>
    <tr><th>Kabuk</th><th>Tam Adı</th><th>Yıl</th><th>Özellik</th></tr>
    <tr><td><strong>sh</strong></td><td>Bourne Shell</td><td>1979</td><td>Steven Bourne tarafından yazılan ilk önemli Unix kabuğu. Tüm modern kabukların atası.</td></tr>
    <tr><td><strong>csh</strong></td><td>C Shell</td><td>1979</td><td>Bill Joy (BSD Unix, vi editörünün yaratıcısı) tarafından yazıldı. C diline benzer söz dizimi.</td></tr>
    <tr><td><strong>ksh</strong></td><td>Korn Shell</td><td>1983</td><td>David Korn, Bell Labs. sh ve csh'in en iyilerini birleştirdi.</td></tr>
    <tr><td><strong>bash</strong></td><td>Bourne Again Shell</td><td>1989</td><td>Brian Fox, GNU Projesi. sh'in özgür yazılım versiyonu. "Bourne Again" = sh'in yeniden doğuşu (ayrıca "born again" = yeniden doğmak kelime oyunu).</td></tr>
    <tr><td><strong>zsh</strong></td><td>Z Shell</td><td>1990</td><td>Paul Falstad. bash uyumlu ama üstüne otomatik tamamlama, yazım düzeltme, tema desteği ekler.</td></tr>
    <tr><td><strong>fish</strong></td><td>Friendly Interactive Shell</td><td>2005</td><td>Kullanıcı dostu, renkli, akıllı öneriler. Ama bash/POSIX uyumlu <u>değildir</u>.</td></tr>
    <tr><td><strong>dash</strong></td><td>Debian Almquist Shell</td><td>2002</td><td>Çok hafif ve hızlı. Debian/Ubuntu'da sistem scriptleri için (<code>/bin/sh</code>) kullanılır.</td></tr>
    <tr><td><strong>nushell (nu)</strong></td><td>Nu Shell</td><td>2019</td><td>Modern, yapılandırılmış veri (tablo) odaklı. Rust ile yazılmış.</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Hangi Kabuğu Kullanıyorum?</div>
    Hangi kabukta olduğunuzu öğrenmek için:<br>
    <code>echo $SHELL</code> — varsayılan kabuğunuzu gösterir<br>
    <code>echo $0</code> — şu an çalışan kabuğu gösterir<br>
    Sistemdeki tüm kurulu kabukları görmek için: <code>cat /etc/shells</code>
</div>

<h3>Neden Bu Eğitimde Bash Öğreniyoruz?</h3>
<p>"Madem daha yeni ve şık kabuklar var, neden bash?" diye düşünebilirsiniz. Bash'i seçmemizin çok somut nedenleri var:</p>

<table>
    <tr><th>Neden</th><th>Açıklama</th></tr>
    <tr><td><strong>🌍 Evrensel standart</strong></td><td>Hemen hemen her Linux dağıtımında varsayılan olarak kuruludur. Ubuntu, Fedora, Debian, Pardus, CentOS, Arch... hepsinde bash var.</td></tr>
    <tr><td><strong>📚 Devasa kaynak</strong></td><td>Stack Overflow, blog yazıları, kitaplar — İnternetteki Linux komut satırı kaynaklarının ezici çoğunluğu bash örnekleri içerir.</td></tr>
    <tr><td><strong>🏢 İş dünyası</strong></td><td>Sunucuların %96'sı Linux çalıştırır ve çoğunda varsayılan kabuk bash'tir. DevOps, sistem yönetimi, bulut — hepsinde bash beklenir.</td></tr>
    <tr><td><strong>📜 Script taşınabilirliği</strong></td><td>Yazdığınız bash scripti her Linux makinesinde çalışır. fish veya nushell scripti çalışmayabilir — çoğu sunucuda kurulu değildir.</td></tr>
    <tr><td><strong>🔄 Diğerlerine geçiş kolay</strong></td><td>Bash öğrendikten sonra zsh'a geçmek çok kolaydır (komutların %95'i aynı). Tersi daha zordur — zsh'a özgü kısayollar bash'te çalışmaz.</td></tr>
    <tr><td><strong>🐳 Docker & CI/CD</strong></td><td>Dockerfile, GitHub Actions, Jenkins pipeline — hepsinde <code>#!/bin/bash</code> ile script yazılır.</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Bash mı Zsh mi?</div>
    <strong>Kısa cevap:</strong> Bash öğrenin, ileride isterseniz zsh'a geçin.<br><br>
    <strong>Uzun cevap:</strong> zsh, bash'in bir "üst kümesi" gibidir — bash'te çalışan her şey zsh'ta da çalışır, ama zsh ekstra özellikler sunar (daha iyi tab tamamlama, yazım düzeltme, Oh My Zsh temaları). macOS Catalina'dan bu yana varsayılan kabuk zsh'tır. Ama öğrenme materyalleri, sunucu ortamları ve script yazımı söz konusu olduğunda bash hâlâ kraldır. <strong>Bu eğitimdeki her şey hem bash'te hem zsh'ta çalışır.</strong>
</div>

<h2>Popüler CLI Programları</h2>
<p>Linux dünyasında GUI alternatifleri kadar güçlü, hatta daha güçlü CLI programları vardır. İşte kategorilere göre bazıları:</p>

<h3>📂 Dosya Yönetimi</h3>
<table>
    <tr><th>CLI Programı</th><th>GUI Karşılığı</th><th>Açıklama</th></tr>
    <tr><td><strong>ls, find, tree</strong></td><td>Dosya Yöneticisi</td><td>Dosya listeleme, arama, ağaç görünümü</td></tr>
    <tr><td><strong>cp, mv, rm</strong></td><td>Sürükle-Bırak</td><td>Kopyalama, taşıma, silme</td></tr>
    <tr><td><strong>ranger / lf / nnn</strong></td><td>Nautilus / Thunar</td><td>Terminal içinde çalışan dosya yöneticileri (TUI)</td></tr>
    <tr><td><strong>rsync</strong></td><td>—</td><td>Akıllı dosya senkronizasyonu, yedekleme</td></tr>
    <tr><td><strong>tar, zip, gzip</strong></td><td>Arşiv Yöneticisi</td><td>Dosya sıkıştırma ve arşivleme</td></tr>
</table>

<h3>📝 Metin İşleme</h3>
<table>
    <tr><th>CLI Programı</th><th>GUI Karşılığı</th><th>Açıklama</th></tr>
    <tr><td><strong>vim / neovim</strong></td><td>VS Code / Sublime</td><td>Güçlü metin editörü, eklenti ekosistemi</td></tr>
    <tr><td><strong>nano</strong></td><td>Notepad</td><td>Basit metin editörü, yeni başlayanlar için</td></tr>
    <tr><td><strong>grep / ripgrep (rg)</strong></td><td>Ctrl+F (arama)</td><td>Metin arama, regex desteği</td></tr>
    <tr><td><strong>sed</strong></td><td>Bul ve Değiştir</td><td>Akış editörü, toplu metin değiştirme</td></tr>
    <tr><td><strong>awk</strong></td><td>Excel (basit)</td><td>Sütun bazlı veri işleme, raporlama</td></tr>
    <tr><td><strong>cat / bat</strong></td><td>Dosya Görüntüleyici</td><td>Dosya içeriğini görüntüleme (bat: söz dizimi renklendirme)</td></tr>
</table>

<h3>🌐 Ağ ve İnternet</h3>
<table>
    <tr><th>CLI Programı</th><th>GUI Karşılığı</th><th>Açıklama</th></tr>
    <tr><td><strong>curl / wget</strong></td><td>Tarayıcı (indirme)</td><td>Web'den dosya indirme, API çağrısı</td></tr>
    <tr><td><strong>ssh</strong></td><td>PuTTY / TeamViewer</td><td>Güvenli uzaktan bağlantı</td></tr>
    <tr><td><strong>ping / traceroute</strong></td><td>—</td><td>Ağ bağlantısı test etme</td></tr>
    <tr><td><strong>nmap</strong></td><td>—</td><td>Ağ tarama, port keşfi</td></tr>
    <tr><td><strong>yt-dlp</strong></td><td>—</td><td>Video indirme (YouTube vb.)</td></tr>
</table>

<h3>📊 Sistem İzleme</h3>
<table>
    <tr><th>CLI Programı</th><th>GUI Karşılığı</th><th>Açıklama</th></tr>
    <tr><td><strong>htop / btop</strong></td><td>Görev Yöneticisi</td><td>CPU, RAM, süreç izleme (renkli, interaktif)</td></tr>
    <tr><td><strong>df / dust</strong></td><td>Disk Kullanımı</td><td>Disk alanı görüntüleme</td></tr>
    <tr><td><strong>free</strong></td><td>Sistem Monitörü</td><td>RAM kullanımı</td></tr>
    <tr><td><strong>ps / top</strong></td><td>Görev Yöneticisi</td><td>Çalışan süreçleri listeleme</td></tr>
    <tr><td><strong>neofetch / fastfetch</strong></td><td>Hakkında (About)</td><td>Sistem bilgisi özeti (logo ile)</td></tr>
</table>

<h3>🛠️ Geliştirici Araçları</h3>
<table>
    <tr><th>CLI Programı</th><th>GUI Karşılığı</th><th>Açıklama</th></tr>
    <tr><td><strong>git</strong></td><td>GitHub Desktop / GitKraken</td><td>Versiyon kontrol sistemi</td></tr>
    <tr><td><strong>docker</strong></td><td>Docker Desktop</td><td>Konteyner yönetimi</td></tr>
    <tr><td><strong>make / cmake</strong></td><td>IDE Build butonu</td><td>Derleme otomasyonu</td></tr>
    <tr><td><strong>npm / pip / cargo</strong></td><td>—</td><td>Paket yöneticileri (Node.js, Python, Rust)</td></tr>
    <tr><td><strong>jq</strong></td><td>—</td><td>JSON verisi işleme ve filtreleme</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Modern CLI Araçları: Rust Dalgası</div>
    Son yıllarda klasik Unix araçlarının <strong>modern alternatifleri</strong> çıktı (çoğu Rust dilinde yazılmış, daha hızlı ve kullanıcı dostu):<br><br>
    <code>ls</code> → <strong>eza</strong> (renkli, ikonlu)<br>
    <code>cat</code> → <strong>bat</strong> (söz dizimi renklendirme)<br>
    <code>find</code> → <strong>fd</strong> (daha basit söz dizimi)<br>
    <code>grep</code> → <strong>ripgrep (rg)</strong> (çok daha hızlı)<br>
    <code>du</code> → <strong>dust</strong> (görsel disk kullanımı)<br>
    <code>top</code> → <strong>btop</strong> (modern, güzel arayüz)<br>
    <code>cd</code> → <strong>zoxide</strong> (akıllı dizin atlama)<br>
    <code>diff</code> → <strong>delta</strong> (renkli fark gösterimi)
</div>


<h2>Terminal Programları</h2>
<p>Terminal emülatörü, komut satırına erişmenizi sağlayan programdır. Ama dikkat: <strong>her terminal programı aynı kabuğu (shell) çalıştırmaz!</strong> Bu eğitim <strong>bash</strong> öğrettiği için, hangi terminal programlarında bash çalışıp hangisinde çalışmadığını bilmek kritik öneme sahiptir.</p>

<div class="info-box danger">
    <div class="info-box-title">🚨 KRİTİK: Terminal ≠ Kabuk (Shell)</div>
    <strong>Terminal</strong> sadece bir pencere/programdır — karakter girip çıktı gösteren bir arayüz. <strong>Kabuk (shell)</strong> ise yazdığınız komutları yorumlayan programdır. Aynı terminal içinde farklı kabuklar çalışabilir.<br><br>
    Bu eğitimde öğrenilen komutlar <strong>bash</strong> (ve büyük ölçüde zsh) kabuğunda çalışır. <strong>PowerShell</strong> ve <strong>CMD</strong> tamamen farklı kabuklar olup, burada öğrendiğiniz komutların çoğu orada <u>çalışmaz</u>.<br><br>
    <strong>Kural:</strong> Terminal açtığınızda prompt'ta <code>$</code> görüyorsanız muhtemelen bash/zsh'tasınız ✅. <code>PS C:\></code> veya <code>C:\></code> görüyorsanız PowerShell/CMD'desiniz ❌ — bu eğitimdeki komutlar orada çalışmaz.
</div>

<h3>🐧 Linux Terminal Emülatörleri</h3>
<p>Linux'ta <strong>tüm terminal emülatörleri varsayılan olarak bash çalıştırır</strong>. Hangisini seçerseniz seçin, bu eğitimdeki komutlar çalışacaktır. Fark sadece hız, özellik ve görünümdedir:</p>
<table>
    <tr><th>Program</th><th>Bash Çalışır?</th><th>Özellik</th></tr>
    <tr><td><strong>GNOME Terminal</strong></td><td>✅ Evet</td><td>Ubuntu varsayılanı. Sekmeli, profilli. Çoğu kişinin başladığı yer.</td></tr>
    <tr><td><strong>Konsole</strong></td><td>✅ Evet</td><td>KDE varsayılanı. Bölünmüş ekran, çok güçlü.</td></tr>
    <tr><td><strong>XFCE Terminal</strong></td><td>✅ Evet</td><td>Hafif ve hızlı. Eski donanımlar için ideal.</td></tr>
    <tr><td><strong>Alacritty</strong></td><td>✅ Evet</td><td>GPU hızlandırmalı, çok hızlı. Yapılandırma dosyasıyla ayarlanır.</td></tr>
    <tr><td><strong>Kitty</strong></td><td>✅ Evet</td><td>GPU hızlandırmalı, zengin özellikler (resim desteği, sekmeler).</td></tr>
    <tr><td><strong>Tilix</strong></td><td>✅ Evet</td><td>Tiling (döşeme) terminal. Ekranı bölme konusunda harika.</td></tr>
    <tr><td><strong>Warp</strong></td><td>✅ Evet</td><td>Modern, AI destekli terminal. Blok tabanlı çıktı.</td></tr>
    <tr><td><strong>Terminator</strong></td><td>✅ Evet</td><td>Ekran bölme ve gruplama.</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Hangisini Seçmeliyim?</div>
    Yeni başlıyorsanız <strong>dağıtımınızla gelen varsayılan terminal</strong> ile başlayın (Ubuntu → GNOME Terminal, Kubuntu → Konsole). Hepsi bash çalıştırır, hepsi bu eğitim için uygundur. İleride ihtiyaçlarınıza göre değiştirebilirsiniz.
</div>

<h3>🍎 macOS Terminal Seçenekleri</h3>
<p>macOS bir Unix sistemidir, dolayısıyla terminal deneyimi Linux'a çok yakındır. Ancak macOS'un varsayılan kabuğu <strong>zsh</strong>'tır (bash değil). İyi haber: zsh, bash'e çok benzer ve bu eğitimdeki komutların <strong>büyük çoğunluğu zsh'ta da çalışır</strong>.</p>
<table>
    <tr><th>Program</th><th>Bash/Zsh Çalışır?</th><th>Özellik</th></tr>
    <tr><td><strong>Terminal.app</strong></td><td>✅ Evet (zsh)</td><td>macOS ile birlikte gelir. Temel kullanım için yeterli.</td></tr>
    <tr><td><strong>iTerm2</strong></td><td>✅ Evet (zsh)</td><td>En popüler 3. parti terminal. Bölünmüş paneller, hotkey pencere.</td></tr>
    <tr><td><strong>Alacritty</strong></td><td>✅ Evet (zsh)</td><td>macOS'ta da mevcut. Hız odaklı.</td></tr>
    <tr><td><strong>Kitty</strong></td><td>✅ Evet (zsh)</td><td>macOS'ta da çalışır.</td></tr>
    <tr><td><strong>Warp</strong></td><td>✅ Evet (zsh)</td><td>macOS için de mevcut. Modern arayüz.</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 macOS'ta Bash mı Zsh mi?</div>
    macOS Catalina (2019) ile varsayılan kabuk bash'ten <strong>zsh</strong>'ye değişti. Zsh, bash'in tüm temel komutlarını destekler ve üstüne ek özellikler ekler. Bu eğitimdeki komutlar (<code>ls</code>, <code>cd</code>, <code>grep</code>, <code>find</code>, pipe'lar vs.) hepsi zsh'ta da çalışır. İsterseniz <code>bash</code> yazarak bash'e de geçebilirsiniz.
</div>

<h3>🪟 Windows'ta Bash Çalıştırma</h3>
<p>Windows, kendi kabuklarını kullanır: <strong>PowerShell</strong> ve <strong>CMD (komut istemi)</strong>. Bunlar bash <strong>değildir</strong> ve bu eğitimdeki komutlar orada çalışmaz. Windows'ta bash kullanmak için özel yollar gerekir:</p>

<table>
    <tr><th>Program</th><th>Bash Çalışır?</th><th>Açıklama</th></tr>
    <tr><td><strong>WSL (Windows Terminal içinde)</strong></td><td>✅ Tam bash</td><td><strong>En iyi yol!</strong> Gerçek bir Linux ortamı. Tüm komutlar birebir çalışır. <strong>Bu eğitim için önerilen!</strong></td></tr>
    <tr><td><strong>Git Bash</strong></td><td>⚠️ Kısıtlı bash</td><td>Temel bash komutları çalışır (<code>ls</code>, <code>cd</code>, <code>grep</code>, <code>git</code>). Ancak <code>apt</code>, <code>systemctl</code>, <code>top</code> gibi Linux'a özgü komutlar çalışmaz. Acil çözüm olarak kullanılabilir.</td></tr>
    <tr><td style="color: #e74c3c;"><strong>PowerShell</strong></td><td>❌ Hayır</td><td>Tamamen farklı bir kabuk ve söz dizimi. <code>ls</code> çalışır gibi görünür ama aslında <code>Get-ChildItem</code>'in takma adıdır — davranışı farklıdır. <code>grep</code>, <code>cat</code>, pipe davranışları hep farklı.</td></tr>
    <tr><td style="color: #e74c3c;"><strong>CMD (Komut İstemi)</strong></td><td>❌ Hayır</td><td>DOS'tan kalma eski kabuk. <code>ls</code> bile çalışmaz (<code>dir</code> kullanılır). Bu eğitimle hiçbir uyumu yoktur.</td></tr>
    <tr><td style="color: #e74c3c;"><strong>Windows Terminal (tek başına)</strong></td><td>❌ / ✅</td><td>Windows Terminal sadece bir <strong>penceredir</strong>, kabuk değil. İçinde PowerShell açarsa ❌, WSL sekmesi açarsa ✅. Önemli olan hangi sekmeyi/profili açtığınızdır.</td></tr>
</table>

<div class="info-box danger">
    <div class="info-box-title">🚨 Windows Kullanıcıları İçin Kritik Uyarı</div>
    Windows'ta "terminali açtım, komutlar çalışmıyor" diyorsanız büyük ihtimalle <strong>PowerShell veya CMD</strong> açmışsınızdır. Bu eğitimdeki komutlar orada çalışmaz!<br><br>
    <strong>Çözüm (önem sırasına göre):</strong><br>
    1. <strong>WSL kurun</strong> (en iyi yol): <code>wsl --install</code> → Windows Terminal'de Ubuntu sekmesini açın<br>
    2. <strong>Git Bash</strong> kullanın (geçici çözüm): Git for Windows yükleyip Git Bash açın<br>
    3. <strong>Bu eğitimdeki tarayıcı terminalini</strong> kullanın (kurulum gerektirmez)<br><br>
    PowerShell'de <code>ls</code> yazınca çıktı alıyorsunuz diye bash öğrendiğinizi sanmayın — PowerShell'in <code>ls</code>'i aslında <code>Get-ChildItem</code> cmdlet'inin takma adıdır ve <code>-la</code>, <code>--color</code> gibi bash seçeneklerini desteklemez.
</div>

<h3>Neden PowerShell ≠ Bash?</h3>
<p>İkisi de "komut satırı" olsa da temelden farklıdır:</p>
<table>
    <tr><th></th><th>Bash</th><th>PowerShell</th></tr>
    <tr><td><strong>Veri akışı</strong></td><td>Düz metin (text stream)</td><td>.NET nesneleri (objects)</td></tr>
    <tr><td><strong>Dosya listeleme</strong></td><td><code>ls -la</code></td><td><code>Get-ChildItem -Force</code></td></tr>
    <tr><td><strong>Metin arama</strong></td><td><code>grep "kalıp" dosya</code></td><td><code>Select-String -Pattern "kalıp" dosya</code></td></tr>
    <tr><td><strong>Dosya okuma</strong></td><td><code>cat dosya.txt</code></td><td><code>Get-Content dosya.txt</code></td></tr>
    <tr><td><strong>Pipe davranışı</strong></td><td>Metin satırları aktarır</td><td>Nesne aktarır</td></tr>
    <tr><td><strong>Yaygınlık</strong></td><td>Linux, macOS, sunucular, bulut</td><td>Sadece Windows ekosistemi</td></tr>
    <tr><td><strong>Öğrenme değeri</strong></td><td>Evrensel — her yerde geçerli</td><td>Sadece Windows yönetimi için</td></tr>
</table>
<p>Bu yüzden bu eğitim bash öğretir: <strong>bir kez öğrenin, Linux'ta, macOS'ta, sunucularda, Docker'da, bulutta — her yerde kullanın.</strong></p>

<h3>Terminal Açma Kısayolları</h3>
<table>
    <tr><th>İşletim Sistemi</th><th>Kısayol</th><th>Bash Çalışır?</th></tr>
    <tr><td>Ubuntu / GNOME</td><td><code>Ctrl + Alt + T</code></td><td>✅</td></tr>
    <tr><td>KDE Plasma</td><td><code>Ctrl + Alt + T</code> veya <code>F12</code> (Yakuake)</td><td>✅</td></tr>
    <tr><td>macOS</td><td><code>CMD + Space</code> → "Terminal"</td><td>✅ (zsh, bash uyumlu)</td></tr>
    <tr><td>Windows (WSL)</td><td>Windows Terminal → Ubuntu sekmesi</td><td>✅</td></tr>
    <tr><td>Windows (Git Bash)</td><td>Başlat → "Git Bash"</td><td>⚠️ Kısıtlı</td></tr>
    <tr><td>Windows (PowerShell)</td><td><code>Win + X</code> → Terminal</td><td>❌ Bash değil!</td></tr>
</table>

<h2>Prompt: Komut İstemi</h2>
<p>Terminal açtığınızda bir <strong>prompt (komut istemi)</strong> görürsünüz. Bu, sistemin sizden komut beklediğini gösterir:</p>

<div class="code-block">
    <div class="code-block-header">
        <span>Terminal Prompt</span>
        <button class="try-btn" onclick="runInTerminal('whoami')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">kullanici@linux:~$</span> <span class="command">whoami</span>
<span class="output">kullanici</span></code></pre>
</div>

<p>Prompt parçaları:</p>
<ul>
    <li><strong>kullanici</strong> — Oturum açmış kullanıcı adı</li>
    <li><strong>@linux</strong> — Bilgisayarın adı (hostname)</li>
    <li><strong>~</strong> — Bulunduğunuz dizin (~ = home dizini)</li>
    <li><strong>$</strong> — Normal kullanıcı (<code>#</code> = root/yönetici kullanıcı)</li>
</ul>

<div class="info-box note">
    <div class="info-box-title">📌 Prompt Farklılıkları</div>
    Her dağıtım ve her terminal farklı bir prompt biçimi kullanabilir. Örneğin:<br>
    <code>user@hostname:~$</code> — Ubuntu varsayılanı<br>
    <code>[user@hostname ~]$</code> — Fedora/RHEL tarzı<br>
    <code>➜ ~ </code> — Oh My Zsh teması<br>
    <code>❯</code> — Starship prompt<br>
    Prompt'u <code>PS1</code> ortam değişkeniyle özelleştirebilirsiniz. Zsh kullanıcıları ise <strong>Oh My Zsh</strong> veya <strong>Powerlevel10k</strong> temalarıyla çok etkileyici promptlar oluşturabilir.
</div>

<h2>Shell: Kabuk Programı</h2>
<p>Shell, yazdığınız komutları işletim sistemine ileten programdır. Birçok shell türü vardır ve her birinin kendine özgü söz dizimi, özellikleri ve kullanım alanları farklıdır.</p>

<table>
    <tr><th>Shell</th><th>Açılım</th><th>Yıl</th><th>Özellik</th></tr>
    <tr><td><strong>sh</strong></td><td>Bourne Shell</td><td>1977</td><td>Orijinal Unix kabuğu. Tüm modern kabukların atası. Scriptlerde taşınabilirlik için hâlâ kullanılır.</td></tr>
    <tr><td><strong>csh</strong></td><td>C Shell</td><td>1978</td><td>C diline benzer söz dizimi. BSD Unix'te popülerdi. Bugün yerini <strong>tcsh</strong>'ye bırakmıştır.</td></tr>
    <tr><td><strong>tcsh</strong></td><td>TENEX C Shell</td><td>1983</td><td>csh'nin geliştirilmiş hali. Komut tamamlama, geçmiş düzenleme eklendi. Bazı eski BSD sistemlerde varsayılan.</td></tr>
    <tr><td><strong>ksh</strong></td><td>Korn Shell</td><td>1983</td><td>sh + csh'nin en iyi özelliklerini birleştirir. Kurumsal Unix ortamlarında (AIX, Solaris) yaygın.</td></tr>
    <tr><td><strong>bash</strong></td><td>Bourne Again Shell</td><td>1989</td><td><strong>Linux varsayılanı ve bu eğitimin odağı.</strong> sh uyumlu + diziler, fonksiyonlar, aritmetik gibi ek özellikler.</td></tr>
    <tr><td><strong>dash</strong></td><td>Debian Almquist Shell</td><td>1997</td><td>Çok hızlı, minimal. Ubuntu'da <code>/bin/sh</code> olarak kullanılır. İnteraktif kullanım için değil, script hızı için tasarlanmış.</td></tr>
    <tr><td><strong>zsh</strong></td><td>Z Shell</td><td>1990</td><td><strong>macOS varsayılanı (2019+).</strong> Bash'e çok benzer + glob desenleri, yazım düzeltme, güçlü otomatik tamamlama, temalar.</td></tr>
    <tr><td><strong>fish</strong></td><td>Friendly Interactive Shell</td><td>2005</td><td>Renkli söz dizimi, otomatik öneriler, web tabanlı ayarlar. Çok kullanıcı dostu ama <strong>bash/POSIX uyumsuz</strong>.</td></tr>
    <tr><td><strong>nushell (nu)</strong></td><td>Nu Shell</td><td>2019</td><td>Modern, Rust ile yazılmış. Yapılandırılmış veri (tablo, JSON) üzerinde çalışır. Deneysel ama çok ilgi çekici.</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header">
        <span>Hangi shell kullanıyorum?</span>
        <button class="try-btn" onclick="runInTerminal('echo $SHELL')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">$</span> <span class="command">echo</span> <span class="argument">$SHELL</span>
<span class="output">/bin/bash</span>

<span class="comment"># Sistemde yüklü tüm kabukları göster:</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="path">/etc/shells</span>
<span class="output">/bin/sh</span>
<span class="output">/bin/bash</span>
<span class="output">/usr/bin/zsh</span>
<span class="output">/usr/bin/fish</span>

<span class="comment"># Geçici olarak başka bir kabuğa geç:</span>
<span class="prompt">$</span> <span class="command">zsh</span>      <span class="comment"># zsh'ye geç (çıkmak için exit)</span>

<span class="comment"># Varsayılan kabuğu kalıcı olarak değiştir:</span>
<span class="prompt">$</span> <span class="command">chsh -s</span> <span class="path">/usr/bin/zsh</span></code></pre>
</div>

<h3>Bash vs Zsh vs Fish: Detaylı Karşılaştırma</h3>
<p>En popüler üç interaktif kabuk arasındaki farkları öğrenmek, hangisinin sizin için uygun olduğunu anlamanıza yardımcı olur:</p>

<table>
    <tr><th>Özellik</th><th>Bash</th><th>Zsh</th><th>Fish</th></tr>
    <tr><td><strong>POSIX uyumlu mu?</strong></td><td>✅ Evet</td><td>✅ Büyük ölçüde</td><td>❌ Hayır</td></tr>
    <tr><td><strong>Bash scriptleri çalışır mı?</strong></td><td>✅ Evet (doğal)</td><td>✅ %95+ çalışır</td><td>❌ Çalışmaz, kendi söz dizimi var</td></tr>
    <tr><td><strong>Otomatik tamamlama</strong></td><td>Temel düzey</td><td>Çok güçlü (menü, açıklama)</td><td>Mükemmel (kutusundan çıkar)</td></tr>
    <tr><td><strong>Otomatik öneri</strong></td><td>❌ Yok (eklenti gerek)</td><td>⚠️ Eklenti ile (zsh-autosuggestions)</td><td>✅ Kutudan çıkar</td></tr>
    <tr><td><strong>Söz dizimi renklendirme</strong></td><td>❌ Yok</td><td>⚠️ Eklenti ile (zsh-syntax-highlighting)</td><td>✅ Kutudan çıkar</td></tr>
    <tr><td><strong>Tema/eklenti ekosistemi</strong></td><td>Sınırlı</td><td>Çok zengin (Oh My Zsh, Powerlevel10k)</td><td>Web arayüzü ile ayarlanır</td></tr>
    <tr><td><strong>Glob desenleri</strong></td><td>Temel (<code>*.txt</code>)</td><td>Gelişmiş (<code>**/*.txt</code>, niteleme)</td><td>Farklı söz dizimi</td></tr>
    <tr><td><strong>Yazım düzeltme</strong></td><td>❌ Yok</td><td>✅ <code>setopt CORRECT</code></td><td>✅ Var</td></tr>
    <tr><td><strong>Varsayılan olduğu yer</strong></td><td>Çoğu Linux dağıtımı</td><td>macOS (2019+)</td><td>Hiçbiri (elle kurulur)</td></tr>
    <tr><td><strong>Öğrenme eğrisi</strong></td><td>Orta</td><td>Orta (bash bilenler kolayca geçer)</td><td>Düşük (ama bash bilgisi aktarılamaz)</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Hangisini Öğrenmeliyim?</div>
    <strong>Cevap: Önce bash.</strong> Çünkü:<br>
    1. Linux sunucularının neredeyse tamamında bash var<br>
    2. Stack Overflow/ChatGPT'deki çözümlerin çoğu bash<br>
    3. Docker, CI/CD, otomasyon scriptleri bash ile yazılır<br>
    4. Bash öğrendikten sonra zsh'ye geçmek <strong>çok kolay</strong> (söz dizimi %95 aynı)<br>
    5. Fish güzel ama bash scriptleri orada çalışmaz — öğrenme transferi düşük<br><br>
    <strong>Tavsiye yolu:</strong> Bash öğren → ihtiyaç duyarsan zsh'ye geç (Oh My Zsh ile harika deneyim) → Fish'i merak edersen dene.
</div>

<h3>Bourne Shell Ailesi vs C Shell Ailesi</h3>
<p>Unix kabukları tarihsel olarak iki büyük aileye ayrılır:</p>

<table>
    <tr><th></th><th>Bourne Ailesi (sh türevi)</th><th>C Shell Ailesi (csh türevi)</th></tr>
    <tr><td><strong>Üyeler</strong></td><td>sh → bash, zsh, ksh, dash</td><td>csh → tcsh</td></tr>
    <tr><td><strong>Söz dizimi</strong></td><td><code>if [ koşul ]; then ... fi</code></td><td><code>if (koşul) then ... endif</code></td></tr>
    <tr><td><strong>Değişken atama</strong></td><td><code>isim="değer"</code></td><td><code>set isim = değer</code></td></tr>
    <tr><td><strong>Döngü</strong></td><td><code>for i in 1 2 3; do ... done</code></td><td><code>foreach i (1 2 3) ... end</code></td></tr>
    <tr><td><strong>Bugün yaygınlık</strong></td><td>✅ Çok yaygın (Linux, macOS)</td><td>❌ Neredeyse yok (bazı eski BSD sistemler)</td></tr>
    <tr><td><strong>Script yazımı</strong></td><td>✅ Tavsiye edilir</td><td>❌ Tavsiye edilmez (<a href="https://www.grymoire.com/Unix/CshTop10.txt" target="_blank" rel="noopener">"Csh Programming Considered Harmful"</a>)</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Neden csh Öldü?</div>
    1978'de Bill Joy tarafından yaratılan C Shell, C diline benzer söz dizimi ile programcılar arasında popüler oldu. Ancak scripting açısından ciddi sorunları vardı (hatalı alıntılama, güvenilmez pipe davranışı). Tom Christiansen'in ünlü <em>"Csh Programming Considered Harmful"</em> makalesi csh'nin script yazımı için neden uygun olmadığını ortaya koydu. Bugün neredeyse hiçbir yeni projede csh/tcsh kullanılmaz — <strong>Bourne ailesi kazandı</strong>.
</div>

<h2>Komut Yapısı</h2>
<p>Her Linux komutu şu yapıdadır:</p>

<div class="syntax-box">
    <div class="syntax-title">Komut Söz Dizimi</div>
    <code>komut  [seçenekler]  [argümanlar]</code>
</div>

<ul>
    <li><strong>Komut (Command):</strong> Çalıştırılacak program — <code>ls</code>, <code>cd</code>, <code>cat</code></li>
    <li><strong>Seçenekler (Options/Flags):</strong> Davranışı değişktirir — <code>-l</code>, <code>-a</code>, <code>--help</code></li>
    <li><strong>Argümanlar (Arguments):</strong> Üzerinde çalışacağı hedef — dosya adı, dizin adı</li>
</ul>

<div class="code-block">
    <div class="code-block-header">
        <span>Komut yapısı örnekleri</span>
        <button class="try-btn" onclick="runInTerminal('ls -la Belgeler')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">$</span> <span class="command">ls</span> <span class="argument">-la</span> <span class="path">Belgeler</span>
<span class="comment"># ls     = komut (list — listele)</span>
<span class="comment"># -la    = seçenekler (-l: uzun format, -a: hepsini göster)</span>
<span class="comment"># Belgeler = argüman (hangi dizini listele)</span></code></pre>
</div>

<h3>Kısa ve Uzun Seçenekler</h3>
<div class="code-block">
    <div class="code-block-header"><span>Seçenek biçimleri</span></div>
    <pre><code><span class="comment"># Kısa seçenek: tek tire + tek harf</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">-l</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">-a</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">-la</span>       <span class="comment"># Kısa seçenekler birleştirilebilir!</span>

<span class="comment"># Uzun seçenek: çift tire + tam kelime</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">--all</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">--help</span>
<span class="prompt">$</span> <span class="command">grep</span> <span class="argument">--ignore-case</span> <span class="string">"linux"</span> <span class="path">dosya.txt</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Büyük/Küçük Harf Duyarlılığı</div>
    Linux komutları <strong>büyük/küçük harfe duyarlıdır (case-sensitive)</strong>! <code>ls</code> çalışır ama <code>LS</code> veya <code>Ls</code> "komut bulunamadı" hatası verir. Komutlar neredeyse <strong>her zaman küçük harfle</strong> yazılır.
</div>

<h2>Terminal Çoğullayıcılar: tmux ve screen</h2>
<p>Tek bir terminal penceresinde birden fazla terminal oturumu yönetmek istiyorsanız:</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">Terminal Multiplexer</span> = <span class="eng-meaning">Terminal Çoğullayıcı</span> — Tek pencerede birden fazla terminal oturumu yönetmenizi sağlayan araç.<br>
        <span class="eng-word">tmux</span> = <span class="eng-meaning">Terminal Multiplexer</span> — Modern ve güçlü çoğullayıcı.<br>
        <span class="eng-word">screen</span> = <span class="eng-meaning">GNU Screen</span> — Klasik ve yaygın, özellikle SSH oturumlarında kullanışlı.<br>
        <span class="eng-word">Session</span> = <span class="eng-meaning">Oturum</span> — Bağımsız çalışan terminal ortamı.<br>
        <span class="eng-word">Pane</span> = <span class="eng-meaning">Panel</span> — Bölünmüş ekrandaki her bir bölüm.<br>
        <span class="eng-word">Window</span> = <span class="eng-meaning">Pencere</span> — tmux içindeki sekme benzeri yapı.
    </div>
</div>

<p><strong>tmux</strong> ve <strong>screen</strong> şu durumlarda hayat kurtarır:</p>
<ul>
    <li><strong>SSH ile çalışırken</strong> — bağlantı kopsa bile programlarınız çalışmaya devam eder</li>
    <li><strong>Ekran bölme</strong> — Aynı anda kod yazarken, log izlerken, test çalıştırırken</li>
    <li><strong>Oturum yönetimi</strong> — İşinizi bırakıp sonra tam kaldığınız yerden devam etme</li>
</ul>

<h3>tmux Temel Komutları</h3>
<p>tmux'ta komutlar <strong>prefix tuşu</strong> ile başlar. Varsayılan prefix: <code>Ctrl+b</code>. Önce <code>Ctrl+b</code>'ye basarsınız, <strong>sonra</strong> komutu yazarsınız.</p>

<div class="code-block">
    <div class="code-block-header"><span>tmux oturum yönetimi</span></div>
    <pre><code><span class="comment"># Yeni oturum başlat</span>
<span class="prompt">$</span> <span class="command">tmux</span>

<span class="comment"># İsimli oturum başlat (önerilen!)</span>
<span class="prompt">$</span> <span class="command">tmux new -s</span> <span class="argument">proje</span>

<span class="comment"># Oturumdan ayrıl (detach) — programlar çalışmaya devam eder!</span>
<span class="comment"># Prefix + d  →  yani Ctrl+b, sonra d</span>

<span class="comment"># Oturumları listele</span>
<span class="prompt">$</span> <span class="command">tmux ls</span>
<span class="output">proje: 1 windows (created Mon Jun 10 14:30:00 2024)</span>

<span class="comment"># Oturuma geri bağlan (attach)</span>
<span class="prompt">$</span> <span class="command">tmux attach -t</span> <span class="argument">proje</span>

<span class="comment"># Oturumu sonlandır</span>
<span class="prompt">$</span> <span class="command">tmux kill-session -t</span> <span class="argument">proje</span></code></pre>
</div>

<h3>tmux Pencere ve Panel Bölme</h3>
<table>
    <tr><th>Kısayol (Prefix + ...)</th><th>İşlev</th><th>Açıklama</th></tr>
    <tr><td><code>Ctrl+b  %</code></td><td>Dikey böl</td><td>Ekranı sağ-sol olarak böler</td></tr>
    <tr><td><code>Ctrl+b  "</code></td><td>Yatay böl</td><td>Ekranı üst-alt olarak böler</td></tr>
    <tr><td><code>Ctrl+b  ←↑↓→</code></td><td>Panel değiştir</td><td>Ok tuşlarıyla paneller arası geçiş</td></tr>
    <tr><td><code>Ctrl+b  c</code></td><td>Yeni pencere</td><td>Yeni sekme benzeri pencere oluşturur</td></tr>
    <tr><td><code>Ctrl+b  n / p</code></td><td>Pencere değiştir</td><td>Sonraki (next) / önceki (previous) pencere</td></tr>
    <tr><td><code>Ctrl+b  0-9</code></td><td>Pencere seç</td><td>Numaraya göre pencere seçimi</td></tr>
    <tr><td><code>Ctrl+b  x</code></td><td>Panel kapat</td><td>Aktif paneli kapatır (onay ister)</td></tr>
    <tr><td><code>Ctrl+b  z</code></td><td>Panel zoom</td><td>Paneli tam ekran yap / geri al</td></tr>
    <tr><td><code>Ctrl+b  d</code></td><td>Detach</td><td>Oturumdan ayrıl</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 tmux: SSH'ta Hayat Kurtarıcı</div>
    SSH ile uzak sunucuda çalışırken internet kesilirse normalde çalışan programlar durur. Ama <code>tmux</code> kullanıyorsanız:<br>
    1. Bağlantı kopsa bile tmux oturumu sunucuda çalışmaya devam eder<br>
    2. Tekrar SSH ile bağlanıp <code>tmux attach</code> dersiniz<br>
    3. Tam kaldığınız yerden devam edersiniz! ✅
</div>

<h3>GNU Screen Temel Komutları</h3>
<p>Screen, tmux'tan daha eski ama hâlâ sunucularda yaygın olarak bulunur. Prefix tuşu: <code>Ctrl+a</code>.</p>

<div class="code-block">
    <div class="code-block-header"><span>screen kullanımı</span></div>
    <pre><code><span class="comment"># Yeni oturum başlat</span>
<span class="prompt">$</span> <span class="command">screen</span>

<span class="comment"># İsimli oturum</span>
<span class="prompt">$</span> <span class="command">screen -S</span> <span class="argument">proje</span>

<span class="comment"># Oturumdan ayrıl: Ctrl+a, sonra d</span>

<span class="comment"># Oturumları listele</span>
<span class="prompt">$</span> <span class="command">screen -ls</span>

<span class="comment"># Oturuma geri bağlan</span>
<span class="prompt">$</span> <span class="command">screen -r</span> <span class="argument">proje</span></code></pre>
</div>

<h2>Komut Geçmişi (History)</h2>
<p>Bash, yazdığınız tüm komutları <code>~/.bash_history</code> dosyasında saklar. Bu geçmişi kullanarak çok zaman kazanırsınız.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">History</span> = <span class="eng-meaning">Geçmiş</span> — Daha önce çalıştırılan komutların kaydı.<br>
        <span class="eng-word">Reverse Search</span> = <span class="eng-meaning">Ters Arama</span> — Geçmişte geriye doğru komut arama.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>history komutu</span>
        <button class="try-btn" onclick="runInTerminal('history')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># Son komutları listele</span>
<span class="prompt">$</span> <span class="command">history</span>
<span class="output">  1  cd ~/projeler</span>
<span class="output">  2  ls -la</span>
<span class="output">  3  git status</span>
<span class="output">  4  vim dosya.txt</span>

<span class="comment"># Son 20 komutu göster</span>
<span class="prompt">$</span> <span class="command">history</span> <span class="argument">20</span>

<span class="comment"># Geçmişte "git" içeren komutları ara</span>
<span class="prompt">$</span> <span class="command">history</span> | <span class="command">grep</span> <span class="string">"git"</span>

<span class="comment"># Numaraya göre komutu tekrar çalıştır</span>
<span class="prompt">$</span> <span class="command">!3</span>      <span class="comment"># 3 numaralı komutu çalıştırır → git status</span>

<span class="comment"># Son komutu tekrar çalıştır</span>
<span class="prompt">$</span> <span class="command">!!</span>

<span class="comment"># "git" ile başlayan son komutu çalıştır</span>
<span class="prompt">$</span> <span class="command">!git</span>   <span class="comment"># → son "git ..." komutunu tekrarlar</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 sudo !! — Çok Kullanışlı Kalıp</div>
    Bir komutu sudo ile çalıştırmayı unuttuysanız, tekrar yazmayın:<br><br>
    <code>$ apt update</code><br>
    <code>E: Permission denied</code><br>
    <code>$ sudo !!</code> → Bu, <code>sudo apt update</code> olarak çalışır!<br><br>
    <code>!!</code> "son komutu tekrar et" anlamına gelir. <code>sudo !!</code> onu <code>sudo</code> ile çalıştırır.
</div>

<div class="code-block">
    <div class="code-block-header"><span>Ctrl+R: Ters Arama</span></div>
    <pre><code><span class="comment"># Terminal'de Ctrl+R'ye basın, ardından aramak istediğiniz kelimeyi yazın:</span>
<span class="output">(reverse-i-search)\`git': git push origin main</span>

<span class="comment"># Enter → komutu çalıştır</span>
<span class="comment"># Ctrl+R tekrar → bir önceki eşleşme</span>
<span class="comment"># Esc veya Ctrl+G → aramayı iptal et</span>
<span class="comment"># → (sağ ok) → komutu düzenle, çalıştırma</span></code></pre>
</div>

<h2>Temel Kısayollar</h2>
<table>
    <tr><th>Kısayol</th><th>İngilizce</th><th>Açıklama</th></tr>
    <tr><td><code>Tab</code></td><td>Tab completion</td><td>Otomatik tamamlama — en önemli kısayol!</td></tr>
    <tr><td><code>↑ / ↓</code></td><td>History navigation</td><td>Komut geçmişinde gezinme</td></tr>
    <tr><td><code>Ctrl + C</code></td><td>Cancel / Interrupt</td><td>Çalışan komutu iptal et</td></tr>
    <tr><td><code>Ctrl + L</code></td><td>Clear</td><td>Ekranı temizle (clear komutu ile aynı)</td></tr>
    <tr><td><code>Ctrl + A</code></td><td>Home</td><td>İmleci satır başına taşı</td></tr>
    <tr><td><code>Ctrl + E</code></td><td>End</td><td>İmleci satır sonuna taşı</td></tr>
    <tr><td><code>Ctrl + R</code></td><td>Reverse search</td><td>Komut geçmişinde geriye doğru arama</td></tr>
    <tr><td><code>Ctrl + D</code></td><td>EOF / Logout</td><td>Kabuğu kapat veya girdi sonu gönder</td></tr>
    <tr><td><code>Ctrl + W</code></td><td>Delete word</td><td>İmleçten önceki kelimeyi sil</td></tr>
    <tr><td><code>Ctrl + U</code></td><td>Kill line</td><td>Satır başına kadar sil</td></tr>
    <tr><td><code>Ctrl + Z</code></td><td>Suspend</td><td>Çalışan programı duraklat (arka plana)</td></tr>
    <tr><td><code>!!</code></td><td>Last command</td><td>Son komutu tekrar çalıştır</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Tab Completion — En İyi Arkadaşınız</div>
    <code>Tab</code> tuşu Linux'ta en çok kullanacağınız kısayoldur. Komut adlarını, dosya yollarını, hatta bazı seçenekleri otomatik tamamlar. <strong>Her zaman Tab'a basın!</strong>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Tab Completion örnekleri</span></div>
    <pre><code><span class="comment"># Tek eşleşme varsa: Tab bir kez → otomatik tamamlanır</span>
<span class="prompt">$</span> <span class="command">cd</span> <span class="path">Belge</span><span class="comment">[Tab]</span>  →  <span class="command">cd</span> <span class="path">Belgeler/</span>

<span class="comment"># Birden fazla eşleşme varsa: Tab iki kez → tüm olasılıklar listelenir</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="path">/etc/pa</span><span class="comment">[Tab][Tab]</span>
<span class="output">pam.conf    pam.d/    passwd    passwd-</span>

<span class="comment"># Komut adlarını da tamamlar:</span>
<span class="prompt">$</span> <span class="command">sys</span><span class="comment">[Tab][Tab]</span>
<span class="output">systemctl    systemd-analyze    systemd-run    ...</span>

<span class="comment"># Yazım hatalarını önler + çok zaman kazandırır!</span></code></pre>
</div>
`,
    quiz: [
        {
            question: "Komut satırının dosya yöneticisine göre en büyük avantajı nedir?",
            options: ["Daha renkli görünür", "Toplu işlemleri çok hızlı yapar", "İnternet gerektirir", "Sadece İngilizce çalışır"],
            correct: 1,
            explanation: "CLI ile yüzlerce dosyayı tek komutla işleyebilir, otomatikleştirebilir ve tekrarlayan görevleri saniyeler içinde yapabilirsiniz."
        },
        {
            question: "'mkdir -p a/b/c/d/e' komutu ne yapar?",
            options: ["5 ayrı klasör oluşturur", "İç içe 5 klasörü tek seferde oluşturur", "Hata verir", "5 dosya oluşturur"],
            correct: 1,
            explanation: "-p (parents) seçeneği, iç içe dizinleri ve tüm ara dizinleri tek seferde oluşturur. GUI'de bunu yapmak çok zaman alırdı!"
        },
        {
            question: "macOS'un varsayılan kabuğu (shell) hangisidir?",
            options: ["bash", "fish", "zsh", "dash"],
            correct: 2,
            explanation: "macOS Catalina (2019) ile birlikte varsayılan kabuk bash'ten zsh'ye değiştirildi."
        },
        {
            question: "Terminal'de otomatik tamamlama için hangi tuş kullanılır?",
            options: ["Enter", "Space", "Tab", "Escape"],
            correct: 2,
            explanation: "Tab tuşu komutları, dosya adlarını ve dizin adlarını otomatik tamamlar. Linux'ta en sık kullanacağınız kısayoldur!"
        },
        {
            question: "Bash'in açılımı nedir?",
            options: ["Basic Application Shell", "Bourne Again Shell", "Binary Access Shell", "Batch Application Shell"],
            correct: 1,
            explanation: "Bash = Bourne Again Shell. Stephen Bourne'un orijinal 'sh' kabuğunun geliştirilmiş versiyonudur."
        },
        {
            question: "tmux'ta ekranı dikey (sağ-sol) olarak bölmek için hangi kısayol kullanılır?",
            options: ["Ctrl+b \"", "Ctrl+b %", "Ctrl+b d", "Ctrl+b c"],
            correct: 1,
            explanation: "Ctrl+b % ekranı dikey (sağ-sol) böler. Ctrl+b \" ise yatay (üst-alt) böler."
        },
        {
            question: "'sudo !!' ne yapar?",
            options: ["Tüm dosyaları listeler", "Son komutu sudo ile tekrar çalıştırır", "Terminal geçmişini siler", "Root kullanıcısına geçer"],
            correct: 1,
            explanation: "!! son komutu temsil eder. sudo !! demek 'son komutu bu sefer sudo (yönetici) yetkisiyle çalıştır' demektir."
        },
        {
            question: "TTY (Teletype) nedir?",
            options: ["Modern bir terminal emülatörü", "İlk bilgisayar terminalleri — fiziksel yazıcı ve klavye cihazı", "Bir programlama dili", "Bir Linux dağıtımı"],
            correct: 1,
            explanation: "TTY (Teletype/Teletip) bilgisayarların ilk terminalleriydi. Klavye + yazıcıdan oluşan fiziksel cihazlardı. Linux'taki /dev/tty bu ismin mirasıdır."
        },
        {
            question: "CLI programlarını birbirine bağlamak için hangi mekanizma kullanılır?",
            options: ["Bluetooth", "Pipe (boru hattı, | sembolü)", "Wi-Fi", "USB kablosu"],
            correct: 1,
            explanation: "Pipe (|) bir programın çıktısını diğerinin girdisi olarak aktarır. Bu, Unix felsefesinin temel taşıdır: küçük programları birleştirerek güçlü işlemler yapma."
        }
    ]
});
