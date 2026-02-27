// ===== Bölüm 3: Dosyalar Hakkında =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 3,
    title: 'Dosyalar Hakkında',
    subtitle: 'More About Files',
    icon: '📄',
    description: 'Linux dosya sisteminin ilginç özellikleri: her şey bir dosyadır, uzantılar, inode kavramı, hard/symbolic linkler ve detayları.',
    content: `
<h2>Her Şey Bir Dosyadır!</h2>
<p>Linux'ta <strong>her şey bir dosyadır</strong>. Bu, Linux felsefesinin temel taşıdır:</p>
<ul>
    <li>Metin dosyaları → normal dosya</li>
    <li>Dizinler (klasörler) → özel bir dosya türü</li>
    <li>Klavye → dosya (<code>/dev/stdin</code>)</li>
    <li>Ekran → dosya (<code>/dev/stdout</code>)</li>
    <li>Sabit disk → dosya (<code>/dev/sda</code>)</li>
    <li>USB bellek → dosya (<code>/dev/sdb</code>)</li>
    <li>Ağ soketi → dosya</li>
    <li>Çalışan süreçler → dosya (<code>/proc/PID/</code>)</li>
</ul>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">Everything is a file</span> = <span class="eng-meaning">"Her şey bir dosyadır"</span> — Linux felsefesinin temel prensibi. Donanımlar bile dosya olarak temsil edilir.<br>
        <span class="eng-word">Inode</span> = <span class="eng-meaning">Index Node</span> — Her dosyanın sahip olduğu benzersiz kimlik numarası ve meta veri deposu.
    </div>
</div>

<h3>Dosya Türleri</h3>
<table>
    <tr><th>Sembol</th><th>Tür</th><th>İngilizce</th><th>Açıklama</th></tr>
    <tr><td><code>-</code></td><td>Normal dosya</td><td>Regular file</td><td>Metin, ikili dosya, resim vb.</td></tr>
    <tr><td><code>d</code></td><td>Dizin</td><td>Directory</td><td>Dosyaları organize eden klasör</td></tr>
    <tr><td><code>l</code></td><td>Sembolik link</td><td>Symbolic link</td><td>Başka bir dosyaya kısayol</td></tr>
    <tr><td><code>c</code></td><td>Karakter aygıt</td><td>Character device</td><td>Klavye, fare gibi (/dev/tty)</td></tr>
    <tr><td><code>b</code></td><td>Blok aygıt</td><td>Block device</td><td>Disk, USB (/dev/sda)</td></tr>
    <tr><td><code>p</code></td><td>Named pipe</td><td>Named pipe (FIFO)</td><td>Süreçler arası iletişim</td></tr>
    <tr><td><code>s</code></td><td>Soket</td><td>Socket</td><td>Ağ iletişimi</td></tr>
</table>

<h2>Inode Kavramı — Dosyaların Gerçek Kimliği</h2>
<p>Linux'ta dosya adları aslında bir <strong>etikettir</strong>. Gerçek dosya, <strong>inode</strong> (Index Node) ile tanımlanır. Her inode bir sayıdır ve dosya hakkındaki tüm meta verileri tutar:</p>

<ul>
    <li>Dosya sahibi ve grubu (UID, GID)</li>
    <li>İzinler (rwx)</li>
    <li>Boyut</li>
    <li>Zaman damgaları (erişim, değişiklik, inode değişikliği)</li>
    <li>Dosya verisinin diskteki konumu (blok işaretçileri)</li>
    <li><strong>Hard link sayısı</strong></li>
</ul>

<div class="info-box note">
    <div class="info-box-title">📌 İnode NEYİ Tutmaz?</div>
    Dosya adı inode'da <strong>tutulmaz</strong>! Dosya adı, <strong>dizin dosyası</strong> içinde "ad → inode numarası" eşlemesi olarak saklanır. Bu yüzden bir dosyanın birden fazla adı (hard link) olabilir.
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>ls -i ile inode numaralarını görme</span>
        <button class="try-btn" onclick="runInTerminal('ls -li')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">$</span> <span class="command">ls -i</span>
<span class="output">262150 Belgeler  262155 merhaba.sh  262152 notlar.txt</span>
<span class="comment"># Sayılar inode numaralarıdır</span>

<span class="prompt">$</span> <span class="command">ls -li</span>
<span class="output">262152 -rw-r--r-- 2 ali ali 156 Şub 26 notlar.txt</span>
<span class="comment">#                 ^ Bu sayı = hard link sayısı</span>
<span class="comment"># Bir dosyanın kaç farklı adı (hard linki) olduğunu gösterir</span></code></pre>
</div>

<p><code>ls -l</code> çıktısındaki izinlerden sonraki sayı <strong>hard link sayısıdır</strong>. Normal bir dosya için genellikle 1'dir. Dizinler için en az 2 olur (kendi adı + içindeki <code>.</code> girişi).</p>

<h2>Dosya Uzantıları — Linux'ta Farklı!</h2>
<p>Windows'tan farklı olarak, Linux dosya uzantılarına (<code>.txt</code>, <code>.jpg</code> gibi) <strong>güvenmez</strong>. Linux, dosyanın <strong>içeriğine (magic bytes)</strong> bakarak türünü belirler. Uzantılar sadece insanların kolaylığı içindir.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Magic Bytes Nedir?</div>
    Birçok dosya formatı, dosyanın ilk birkaç byte'ında kendini tanıtan bir imza bırakır. Örneğin:<br>
    • PDF dosyaları <code>%PDF</code> ile başlar<br>
    • PNG resimleri <code>\\x89PNG</code> ile başlar<br>
    • ZIP arşivleri <code>PK</code> ile başlar<br>
    • ELF çalıştırılabilir dosyaları <code>\\x7fELF</code> ile başlar<br>
    <code>file</code> komutu bu magic bytes'ları okuyarak dosya türünü belirler — uzantıya bakmaz!
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>file komutu — dosya türünü belirle</span>
        <button class="try-btn" onclick="runInTerminal('file notlar.txt')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">$</span> <span class="command">file</span> <span class="path">notlar.txt</span>
<span class="output">notlar.txt: UTF-8 Unicode text</span>

<span class="prompt">$</span> <span class="command">file</span> <span class="path">merhaba.sh</span>
<span class="output">merhaba.sh: Bourne-Again shell script, ASCII text executable</span>

<span class="comment"># Uzantıyı .txt yapsan bile gerçek tür değişmez:</span>
<span class="prompt">$</span> <span class="command">cp</span> <span class="path">/usr/bin/ls</span> <span class="path">sahte.txt</span>
<span class="prompt">$</span> <span class="command">file</span> <span class="path">sahte.txt</span>
<span class="output">sahte.txt: ELF 64-bit LSB pie executable...</span>
<span class="comment"># Uzantısı .txt ama aslında çalıştırılabilir bir program!</span></code></pre>
</div>

<h2>Büyük/Küçük Harf Duyarlılığı</h2>
<p>Linux <strong>büyük/küçük harf duyarlıdır (case-sensitive)</strong>. Bu, Windows kullanıcıları için en önemli farklardan biridir!</p>

<div class="code-block">
    <div class="code-block-header"><span>Büyük/küçük harf farkı</span></div>
    <pre><code><span class="comment"># Bunlar ÜÇ FARKLI dosyadır!</span>
dosya.txt
Dosya.txt
DOSYA.txt

<span class="comment"># Bunlar İKİ FARKLI dizindir!</span>
Belgeler/
belgeler/

<span class="comment"># Komutlar da büyük/küçük harfe duyarlıdır</span>
<span class="command">ls</span>     <span class="comment"># ✅ çalışır</span>
<span class="command">LS</span>     <span class="comment"># ❌ komut bulunamadı</span>

<span class="comment"># Seçenekler: -r ≠ -R</span>
<span class="command">ls</span> <span class="argument">-r</span>  <span class="comment"># reverse (ters sıra)</span>
<span class="command">ls</span> <span class="argument">-R</span>  <span class="comment"># recursive (özyinelemeli)</span></code></pre>
</div>

<h2>Boşluk İçeren Dosya Adları</h2>
<p>Dosya adında boşluk varsa shell bunu iki ayrı argüman olarak yorumlar. İki çözüm vardır:</p>

<div class="code-block">
    <div class="code-block-header"><span>Boşluklu dosya adları</span></div>
    <pre><code><span class="comment"># ❌ YANLIŞ — "Benim" ve "Dosyam" iki ayrı argüman olur</span>
<span class="prompt">$</span> <span class="command">cd</span> Benim Dosyam
<span class="output">bash: cd: too many arguments</span>

<span class="comment"># ✅ Yöntem 1: Tırnak işareti (Quotes)</span>
<span class="prompt">$</span> <span class="command">cd</span> <span class="string">'Benim Dosyam'</span>
<span class="prompt">$</span> <span class="command">cd</span> <span class="string">"Benim Dosyam"</span>

<span class="comment"># ✅ Yöntem 2: Kaçış karakteri (Backslash)</span>
<span class="prompt">$</span> <span class="command">cd</span> Benim\\ Dosyam

<span class="comment"># 💡 En iyi uygulama: dosya adlarında boşluk KULLANMAYIN!</span>
<span class="comment"># Bunun yerine: tire (-), alt çizgi (_) veya camelCase kullanın</span>
<span class="comment"># benim-dosyam.txt  veya  benim_dosyam.txt</span></code></pre>
</div>

<h2>Gizli Dosyalar</h2>
<p>Adı <code>.</code> ile başlayan dosyalar gizlidir. Genellikle yapılandırma dosyalarıdır (dotfiles).</p>

<div class="code-block">
    <div class="code-block-header">
        <span>Gizli dosyaları gösterme</span>
        <button class="try-btn" onclick="runInTerminal('ls -a')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">$</span> <span class="command">ls -a</span>
<span class="output">.  ..  .bashrc  .profile  .config  .ssh  Belgeler  Indirmeler  ...</span>
<span class="comment">#  .  = bu dizin (kendisi)</span>
<span class="comment"># .. = üst dizin (parent)</span>
<span class="comment"># Bunlar gerçek dizin girişleridir (directory entry), kısayol değil!</span></code></pre>
</div>

<h3>Önemli Gizli Dosyalar (Dotfiles)</h3>
<table>
    <tr><th>Dosya</th><th>Açıklama</th></tr>
    <tr><td><code>~/.bashrc</code></td><td>Bash kabuğu yapılandırması. Alias, prompt, PATH ayarları.</td></tr>
    <tr><td><code>~/.bash_profile</code></td><td>Giriş kabuğu (login shell) yapılandırması.</td></tr>
    <tr><td><code>~/.bash_history</code></td><td>Komut geçmişi. <code>history</code> komutu bunu okur.</td></tr>
    <tr><td><code>~/.ssh/</code></td><td>SSH anahtarları ve yapılandırma.</td></tr>
    <tr><td><code>~/.config/</code></td><td>Modern uygulamaların yapılandırma dizini.</td></tr>
    <tr><td><code>~/.gitconfig</code></td><td>Git sürüm kontrolü yapılandırması.</td></tr>
    <tr><td><code>~/.vimrc</code></td><td>Vim editörü yapılandırması.</td></tr>
</table>

<h2>Linkler: Hard Link ve Symbolic Link</h2>
<p>Linkler, bir dosyaya başka isimlerle veya yollarla erişim sağlar. İki temelden farklı türü vardır ve aralarındaki farkı anlamak için <strong>inode kavramını</strong> bilmek gerekir.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">Hard Link</span> = <span class="eng-meaning">Sabit Bağlantı</span> — Aynı inode'a (dosya verisine) ikinci bir isim. Orijinal ve link <strong>eşittir</strong>, biri "asıl" değildir.<br>
        <span class="eng-word">Symbolic Link (Symlink/Soft Link)</span> = <span class="eng-meaning">Sembolik Bağlantı</span> — Hedef dosyanın <strong>yolunu</strong> saklayan küçük, özel bir dosya. Windows kısayoluna benzer.
    </div>
</div>

<h3>Hard Link — Aynı Veriye İkinci Bir İsim</h3>
<p>Hard link, dizin tablosunda aynı inode'a ikinci bir giriş ekler. İki isim de <strong>aynı veriye</strong> işaret eder — birini silseniz, veri diğerinden hâlâ erişilebilir.</p>

<div class="code-block">
    <div class="code-block-header">
        <span>Hard link oluşturma ve test etme</span>
        <button class="try-btn" onclick="runInTerminal('echo merhaba > orijinal.txt && ln orijinal.txt hardlink.txt && ls -li orijinal.txt hardlink.txt')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># Bir dosya oluştur:</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"merhaba"</span> > orijinal.txt

<span class="comment"># Hard link oluştur (-s OLMADAN!):</span>
<span class="prompt">$</span> <span class="command">ln</span> <span class="path">orijinal.txt</span> <span class="path">hardlink.txt</span>

<span class="comment"># İnode numaralarına bak — AYNI!</span>
<span class="prompt">$</span> <span class="command">ls -li</span> <span class="path">orijinal.txt hardlink.txt</span>
<span class="output">262152 -rw-r--r-- 2 ali ali 8 ... hardlink.txt
262152 -rw-r--r-- 2 ali ali 8 ... orijinal.txt</span>
<span class="comment"># ^^^^^^ Aynı inode!  ^ Hard link sayısı = 2</span>

<span class="comment"># Birini değiştir → diğeri de değişir:</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"yeni veri"</span> >> orijinal.txt
<span class="prompt">$</span> <span class="command">cat</span> <span class="path">hardlink.txt</span>
<span class="output">merhaba
yeni veri</span>

<span class="comment"># Orijinali SİL — hard link hâlâ çalışır!</span>
<span class="prompt">$</span> <span class="command">rm</span> <span class="path">orijinal.txt</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="path">hardlink.txt</span>
<span class="output">merhaba
yeni veri</span>   <span class="comment"># ✅ Veri kaybolmadı!</span>
<span class="comment"># Veri ancak TÜM hard linkler silindiğinde (link sayısı = 0) gerçekten silinir</span></code></pre>
</div>

<h3>Symbolic Link — Dosya Yoluna İşaretçi</h3>
<p>Symlink, hedef dosyanın <strong>yolunu metin olarak</strong> saklayan küçük özel bir dosyadır. Kendi inode'u vardır, hedeften bağımsızdır.</p>

<div class="code-block">
    <div class="code-block-header">
        <span>Symbolic link oluşturma ve test etme</span>
        <button class="try-btn" onclick="runInTerminal('echo test > hedef.txt && ln -s hedef.txt symlink.txt && ls -li hedef.txt symlink.txt')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># Symbolic link oluştur (-s ile!):</span>
<span class="prompt">$</span> <span class="command">ln -s</span> <span class="path">hedef.txt</span> <span class="path">symlink.txt</span>

<span class="comment"># İnode numaralarına bak — FARKLI!</span>
<span class="prompt">$</span> <span class="command">ls -li</span> <span class="path">hedef.txt symlink.txt</span>
<span class="output">262152 -rw-r--r-- 1 ali ali   5 ... hedef.txt
262160 lrwxrwxrwx 1 ali ali   9 ... symlink.txt -> hedef.txt</span>
<span class="comment"># ^^^^^^ Farklı inode!</span>
<span class="comment"># 'l' = symbolic link, boyut = hedef yol uzunluğu (9 byte ≈ "hedef.txt")</span>

<span class="comment"># Symlink'in hedefini göster:</span>
<span class="prompt">$</span> <span class="command">readlink</span> <span class="path">symlink.txt</span>
<span class="output">hedef.txt</span>

<span class="comment"># Tam (mutlak) çözümlenmiş yolu göster:</span>
<span class="prompt">$</span> <span class="command">readlink -f</span> <span class="path">symlink.txt</span>
<span class="output">/home/ali/hedef.txt</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Symlink İzinleri: Her Zaman lrwxrwxrwx (777)</div>
    Symbolic linklerin izni her zaman <code>lrwxrwxrwx</code> olarak görünür. Bu yanıltıcıdır — erişim kontrolü symlink'in değil, <strong>hedef dosyanın</strong> izinleriyle yapılır. Symlink'e <code>chmod</code> uygularsanız hedef dosyanın izni değişir (Linux'ta), symlink'in kendisi değişmez.
</div>

<h3>Kırık (Dangling) Symlink</h3>
<p>Symlink'in gösterdiği hedef silinirse, symlink "kırık" (dangling/broken) olur — hiçbir yere işaret etmez:</p>

<div class="code-block">
    <div class="code-block-header"><span>Kırık symlink örneği</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">ln -s</span> <span class="path">hedef.txt</span> <span class="path">link.txt</span>
<span class="prompt">$</span> <span class="command">rm</span> <span class="path">hedef.txt</span>          <span class="comment"># Hedefi sil</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="path">link.txt</span>
<span class="output">cat: link.txt: No such file or directory</span>

<span class="comment"># ls ile kırık linkleri tespit et (genellikle kırmızı görünür):</span>
<span class="prompt">$</span> <span class="command">ls -l</span> <span class="path">link.txt</span>
<span class="output">lrwxrwxrwx 1 ali ali 9 ... link.txt -> hedef.txt</span>
<span class="comment"># Link hâlâ var ama hedefi yok</span>

<span class="comment"># Kırık linkleri bul:</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">.</span> <span class="argument">-xtype l</span>
<span class="comment"># -xtype l: çözümlenmiş türü link olan (yani hedefi olmayan) dosyalar</span></code></pre>
</div>

<h3>Mutlak vs Göreli Symlink</h3>
<div class="code-block">
    <div class="code-block-header"><span>Mutlak ve göreli yollu symlinkler</span></div>
    <pre><code><span class="comment"># Göreli yol (relative path) — bulunduğu konuma göre:</span>
<span class="prompt">$</span> <span class="command">ln -s</span> <span class="path">../config/ayarlar.conf</span> <span class="path">link_ayar</span>
<span class="comment"># Dizin taşınırsa ilişki korunabilir</span>

<span class="comment"># Mutlak yol (absolute path) — kök dizinden tam yol:</span>
<span class="prompt">$</span> <span class="command">ln -s</span> <span class="path">/etc/nginx/nginx.conf</span> <span class="path">link_nginx</span>
<span class="comment"># Dosya nereye taşınırsa taşınsın aynı hedefe işaret eder</span>

<span class="comment"># 💡 İpucu: Proje içi linkler için GÖRELİ yol tercih edin.</span>
<span class="comment"># Sistem dosyalarına linkler için MUTLAK yol tercih edin.</span></code></pre>
</div>

<h3>Hard Link vs Symbolic Link — Kapsamlı Karşılaştırma</h3>
<table>
    <tr><th>Özellik</th><th>Hard Link</th><th>Symbolic Link</th></tr>
    <tr><td>İnode</td><td>Hedefle <strong>aynı</strong> inode'u paylaşır</td><td>Kendi <strong>ayrı</strong> inode'u var</td></tr>
    <tr><td>Orijinal silinirse?</td><td>Veri korunur ✅ (link sayısı 1 azalır)</td><td>Kırık link olur ❌ (dangling symlink)</td></tr>
    <tr><td>Dizinlere link?</td><td>Hayır ❌ (döngü riski nedeniyle)</td><td>Evet ✅</td></tr>
    <tr><td>Farklı disk bölümü?</td><td>Hayır ❌ (aynı filesystem olmalı)</td><td>Evet ✅ (farklı disk, ağ paylaşımı bile olabilir)</td></tr>
    <tr><td>Boyut</td><td>Orijinalle aynıdır (aynı veri, aynı inode)</td><td>Hedef yol adının uzunluğu kadar küçük (ör: 12 byte)</td></tr>
    <tr><td>ls -l görünüm</td><td>Normal dosya gibi görünür (<code>-</code>)</td><td><code>l</code> ile başlar, <code>-> hedef</code> gösterir</td></tr>
    <tr><td>Hangisi "asıl"?</td><td>İkisi de eşittir — biri asıl değil</td><td>Symlink açıkça "işaretçi", hedef "asıl"</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Pratikte Ne Zaman Hangisi?</div>
    <strong>Symbolic link kullanın</strong> (çoğu durumda):<br>
    • Program versiyonları arasında geçiş: <code>python -> python3.11</code><br>
    • Yapılandırma dosyalarını merkezi yönetim (dotfiles)<br>
    • Dizinlere kısayol oluşturma<br>
    • Farklı disk bölümlerindeki dosyalara erişim<br><br>

    <strong>Hard link kullanın</strong> (özel durumlar):<br>
    • Dosyanın yanlışlıkla silinmesine karşı yedek isim<br>
    • Aynı veriyi birden fazla yerde gösterme (disk tasarrufu — veri kopyalanmaz)<br>
    • rsync ile verimli yedekleme (--link-dest)
</div>

<h2>stat — Detaylı Dosya Bilgisi</h2>

<div class="code-block">
    <div class="code-block-header">
        <span>stat komutu</span>
        <button class="try-btn" onclick="runInTerminal('stat notlar.txt')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">$</span> <span class="command">stat</span> <span class="path">notlar.txt</span>
<span class="output">  File: notlar.txt
  Size: 156       Blocks: 8    IO Block: 4096  regular file
Access: (0644/-rw-r--r--)  Uid: (1000/ali)  Gid: (1000/ali)
Access: 2024-01-15 10:30:00  (son erişim)
Modify: 2024-01-14 14:22:00  (içerik değişikliği)
Change: 2024-01-14 14:22:00  (inode değişikliği — izin, ad vb.)
 Birth: 2024-01-10 09:00:00  (oluşturulma)</span>

<span class="comment"># Inode numarası, boyut, izinler, erişim/değişiklik zamanları,</span>
<span class="comment"># blok sayısı gibi tüm meta verileri gösterir.</span></code></pre>
</div>
`,
    quiz: [
        {
            question: "Linux'ta 'her şey bir dosyadır' ne anlama gelir?",
            options: ["Sadece metin dosyaları vardır", "Dizinler, donanımlar ve her şey dosya olarak temsil edilir", "Linux'ta klasör yoktur", "Tüm dosyalar aynı türdedir"],
            correct: 1,
            explanation: "Linux'ta dizinler, donanım aygıtları, soketler — neredeyse her şey dosya olarak temsil edilir. Bu, Linux'un temel tasarım felsefesidir."
        },
        {
            question: "Bir dosyanın gerçek türünü öğrenmek için hangi komut kullanılır?",
            options: ["type", "file", "ext", "format"],
            correct: 1,
            explanation: "'file' komutu dosyanın uzantısına değil, magic bytes'larına bakarak gerçek türünü belirler."
        },
        {
            question: "Hard link ve symlink arasındaki temel fark nedir?",
            options: ["Hard link daha büyüktür", "Hard link aynı inode'u paylaşır, symlink kendi inode'una sahiptir", "Symlink daha hızlıdır", "Fark yoktur"],
            correct: 1,
            explanation: "Hard link hedefle AYNI inode'u paylaşır (aynı veri). Symlink kendi inode'una sahiptir ve hedef dosyanın YOL BİLGİSİNİ saklar."
        },
        {
            question: "Orijinal dosya silinirse ne olur?",
            options: ["Her iki link türü de bozulur", "Hard link çalışır, symlink kırılır", "Symlink çalışır, hard link kırılır", "İkisi de çalışmaya devam eder"],
            correct: 1,
            explanation: "Hard link aynı inode'u paylaştığı için veri korunur. Symlink ise yol bilgisine sahiptir, hedef silinince kırık (dangling) link olur."
        },
        {
            question: "ls -l çıktısında izinlerden sonraki sayı nedir?",
            options: ["Dosya boyutu", "Hard link sayısı", "İnode numarası", "Kullanıcı ID"],
            correct: 1,
            explanation: "İzinlerden sonraki sayı hard link sayısıdır. Bir dosyanın kaç farklı adı (hard linki) olduğunu gösterir."
        },
        {
            question: "'readlink' komutu ne işe yarar?",
            options: ["Dosya içeriğini okur", "Dosya izinlerini gösterir", "Symlink'in hedefini gösterir", "Dosyayı siler"],
            correct: 2,
            explanation: "readlink, symbolic link'in gösterdiği hedef yolu gösterir. readlink -f ile tam çözümlenmiş mutlak yolu görebilirsiniz."
        }
    ]
});
