// ===== Bölüm 5: Dosya İşlemleri =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 5,
    title: 'Dosya İşlemleri',
    subtitle: 'File Manipulation',
    icon: '📁',
    description: 'Dosya ve dizin oluşturma, kopyalama, taşıma, silme — CLI\'nin GUI\'ye karşı ezici üstünlüğü.',
    content: `
<h2>mkdir — Dizin Oluştur</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">mkdir</span> = <span class="eng-meaning">Make Directory</span> — "Dizin oluştur". Yeni bir dizin (klasör) oluşturur.<br>
        <span class="eng-word">-p</span> = <span class="eng-meaning">Parents</span> — "Üst dizinler". Aradaki tüm dizinleri de oluşturur.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>mkdir kullanımı</span>
        <button class="try-btn" onclick="runInTerminal('mkdir yeni_dizin')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># Tek dizin oluştur</span>
<span class="prompt">$</span> <span class="command">mkdir</span> <span class="path">yeni_dizin</span>

<span class="comment"># Birden fazla dizin oluştur</span>
<span class="prompt">$</span> <span class="command">mkdir</span> <span class="path">dizin1 dizin2 dizin3</span>

<span class="comment"># İç içe dizinleri tek seferde oluştur (-p = parents)</span>
<span class="prompt">$</span> <span class="command">mkdir -p</span> <span class="path">proje/src/components/ui</span></code></pre>
</div>

<h3>⚡ CLI vs GUI: mkdir -p Süper Gücü</h3>
<p>Bu, CLI'nin GUI'ye en dramatik üstünlüğünü gösteren örneklerden biridir:</p>

<div class="code-block">
    <div class="code-block-header">
        <span>8 iç içe klasor — CLI ile 1 saniye!</span>
        <button class="try-btn" onclick="runInTerminal('mkdir -p proje/src/components/ui/buttons/icons/svg/dark && tree proje')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># CLI ile — TEK KOMUT, 1 saniye:</span>
<span class="prompt">$</span> <span class="command">mkdir -p</span> <span class="path">proje/src/components/ui/buttons/icons/svg/dark</span>

<span class="comment"># GUI ile aynı şeyi yapmak:</span>
<span class="comment"># 1. Dosya yöneticisini aç</span>
<span class="comment"># 2. Sağ tık → "Yeni Klasör" → "proje" yaz → Enter</span>
<span class="comment"># 3. "proje"ye çift tık ile gir</span>
<span class="comment"># 4. Sağ tık → "Yeni Klasör" → "src" yaz → Enter</span>
<span class="comment"># 5. "src"ye çift tık...</span>
<span class="comment"># 6. Sağ tık → "Yeni Klasör" → "components"...</span>
<span class="comment"># 7. ... ve toplam 8 kez tekrarla!</span>
<span class="comment"># Toplam: ~40 tıklama, ~30 saniye 😱</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>Proje yapısı oluşturma — tek komutla</span>
    </div>
    <pre><code><span class="comment"># Bir web projesinin tüm dizin yapısını tek seferde:</span>
<span class="prompt">$</span> <span class="command">mkdir -p</span> <span class="path">website/{css,js,img,fonts} website/js/{lib,modules} website/img/{icons,photos}</span>

<span class="comment"># Sonuç:</span>
<span class="output">website/
├── css/
├── fonts/
├── img/
│   ├── icons/
│   └── photos/
└── js/
    ├── lib/
    └── modules/</span>
<span class="comment"># GUI ile bu yapıyı oluşturmak 2 dakikadan fazla sürerdi!</span></code></pre>
</div>

<h2>touch — Dosya Oluştur</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">touch</span> = <span class="eng-meaning">Dokunmak</span> — Aslında bir dosyanın zaman damgasını (timestamp) günceller. Eğer dosya yoksa, boş bir dosya oluşturur. Adı tarihsel: "dosyaya dokunmak" = son erişim zamanını güncellemek.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>touch kullanımı</span>
        <button class="try-btn" onclick="runInTerminal('touch dosya1.txt dosya2.txt dosya3.txt && ls')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># Tek dosya oluştur</span>
<span class="prompt">$</span> <span class="command">touch</span> <span class="path">yeni_dosya.txt</span>

<span class="comment"># Birden fazla dosya tek seferde</span>
<span class="prompt">$</span> <span class="command">touch</span> <span class="path">dosya1.txt dosya2.txt dosya3.txt</span>

<span class="comment"># Brace expansion ile toplu oluşturma!</span>
<span class="prompt">$</span> <span class="command">touch</span> <span class="path">rapor_{ocak,subat,mart,nisan}.txt</span>
<span class="comment"># Sonuç: rapor_ocak.txt  rapor_subat.txt  rapor_mart.txt  rapor_nisan.txt</span></code></pre>
</div>

<h2>rmdir — Boş Dizin Sil</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">rmdir</span> = <span class="eng-meaning">Remove Directory</span> — "Dizin kaldır". Sadece <strong>boş</strong> dizinleri siler. İçinde dosya varsa hata verir.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>rmdir kullanımı</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">rmdir</span> <span class="path">bos_dizin</span>

<span class="comment"># İç içe boş dizinleri sil</span>
<span class="prompt">$</span> <span class="command">rmdir -p</span> <span class="path">a/b/c</span>   <span class="comment"># c'yi, sonra b'yi, sonra a'yı siler (hepsi boşsa)</span></code></pre>
</div>

<h2>cp — Kopyala</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">cp</span> = <span class="eng-meaning">Copy</span> — "Kopyala". Dosya ve dizinleri kopyalar.
    </div>
</div>

<div class="syntax-box">
    <div class="syntax-title">Söz Dizimi</div>
    <code>cp [seçenekler] kaynak... hedef</code>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>cp kullanımı</span>
        <button class="try-btn" onclick="runInTerminal('cp notlar.txt notlar_yedek.txt && ls')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># Dosya kopyalama</span>
<span class="prompt">$</span> <span class="command">cp</span> <span class="path">notlar.txt</span> <span class="path">notlar_yedek.txt</span>

<span class="comment"># Dosyayı başka dizine kopyalama</span>
<span class="prompt">$</span> <span class="command">cp</span> <span class="path">notlar.txt</span> <span class="path">Belgeler/</span>

<span class="comment"># Birden fazla dosyayı dizine kopyalama</span>
<span class="prompt">$</span> <span class="command">cp</span> <span class="path">dosya1.txt dosya2.txt dosya3.txt</span> <span class="path">Belgeler/</span>

<span class="comment"># Dizin kopyalama (-r = recursive, özyinelemeli)</span>
<span class="prompt">$</span> <span class="command">cp -r</span> <span class="path">Belgeler</span> <span class="path">Belgeler_yedek</span>

<span class="comment"># İzinleri ve zaman damgalarını koruyarak kopyala</span>
<span class="prompt">$</span> <span class="command">cp -a</span> <span class="path">Belgeler</span> <span class="path">Belgeler_arsiv</span>
<span class="comment"># -a = archive (arşiv). İzinler, sahiplik, linkler korunur.</span></code></pre>
</div>

<h3>cp Seçenekleri</h3>
<table>
    <tr><th>Seçenek</th><th>İngilizce</th><th>Açıklama</th></tr>
    <tr><td><code>-r</code></td><td>Recursive</td><td>Dizinleri özyinelemeli kopyala</td></tr>
    <tr><td><code>-i</code></td><td>Interactive</td><td>Üzerine yazmadan önce sor</td></tr>
    <tr><td><code>-v</code></td><td>Verbose</td><td>Ne kopyalandığını göster</td></tr>
    <tr><td><code>-a</code></td><td>Archive</td><td>Her şeyi koruyarak kopyala (-r + izinler + linkler)</td></tr>
    <tr><td><code>-u</code></td><td>Update</td><td>Sadece daha yeni olanları kopyala</td></tr>
</table>

<h2>mv — Taşı / Yeniden Adlandır</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">mv</span> = <span class="eng-meaning">Move</span> — "Taşı". Dosyaları taşır veya yeniden adlandırır. Linux'ta yeniden adlandırma ayrı bir komut değildir — <code>mv</code> her ikisini de yapar.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>mv kullanımı</span></div>
    <pre><code><span class="comment"># Yeniden adlandırma (rename)</span>
<span class="prompt">$</span> <span class="command">mv</span> <span class="path">eski_ad.txt</span> <span class="path">yeni_ad.txt</span>

<span class="comment"># Dosyayı başka dizine taşıma</span>
<span class="prompt">$</span> <span class="command">mv</span> <span class="path">dosya.txt</span> <span class="path">Belgeler/</span>

<span class="comment"># Taşı ve yeniden adlandır (aynı anda!)</span>
<span class="prompt">$</span> <span class="command">mv</span> <span class="path">dosya.txt</span> <span class="path">Belgeler/yeni_isim.txt</span>

<span class="comment"># Birden fazla dosyayı taşıma</span>
<span class="prompt">$</span> <span class="command">mv</span> <span class="path">*.txt</span> <span class="path">Belgeler/</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Dikkat: mv üzerine yazar!</div>
    <code>mv</code> ile taşıma/adlandırma yaparken hedefte aynı isimde dosya varsa, <strong>uyarı vermeden üzerine yazar!</strong> Güvenli kullanım:<br>
    <code>mv -i kaynak hedef</code> — <code>-i</code> (interactive) onay ister.<br>
    <code>mv -n kaynak hedef</code> — <code>-n</code> (no-clobber) varsa üzerine yazmaz.
</div>

<h2>rm — Sil</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">rm</span> = <span class="eng-meaning">Remove</span> — "Kaldır/Sil". Dosya ve dizinleri kalıcı olarak siler.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>rm kullanımı</span></div>
    <pre><code><span class="comment"># Dosya silme</span>
<span class="prompt">$</span> <span class="command">rm</span> <span class="path">gereksiz.txt</span>

<span class="comment"># Onay isteyerek silme (-i = interactive)</span>
<span class="prompt">$</span> <span class="command">rm -i</span> <span class="path">onemli.txt</span>
<span class="output">rm: remove regular file 'onemli.txt'?</span> y

<span class="comment"># Dizin ve içeriğini silme (-r = recursive)</span>
<span class="prompt">$</span> <span class="command">rm -r</span> <span class="path">eski_proje/</span>

<span class="comment"># Zorla silme, uyarı sormadan (-f = force)</span>
<span class="prompt">$</span> <span class="command">rm -rf</span> <span class="path">dizin/</span></code></pre>
</div>

<div class="info-box danger">
    <div class="info-box-title">🚨 Tehlike — rm Geri Alınamaz!</div>
    <code>rm</code> komutu dosyaları <strong>kalıcı olarak siler</strong> — çöp kutusuna gitmez! Özellikle <code>rm -rf</code> çok dikkatli kullanılmalıdır.<br><br>
    <strong>ASLA çalıştırmayın:</strong><br>
    <code>rm -rf /</code> — Tüm sistemi siler!<br>
    <code>rm -rf ~</code> — Tüm kişisel dosyalarınızı siler!<br>
    <code>rm -rf *</code> — Bulunduğunuz dizindeki her şeyi siler!<br><br>
    <strong>Güvenli alışkanlıklar:</strong><br>
    • <code>rm -ri dizin/</code> — Her dosya için onay iste<br>
    • Silmeden önce <code>ls</code> ile neyi sildiğinizi kontrol edin<br>
    • Önemli şeyleri silmeden önce <code>mv</code> ile başka yere taşıyın
</div>

<h2>⚡ Toplu Dosya İşlemleri — CLI'nin Gerçek Gücü</h2>

<div class="code-block">
    <div class="code-block-header"><span>Toplu dosya yeniden adlandırma</span></div>
    <pre><code><span class="comment"># Tüm .jpeg dosyalarını .jpg yap:</span>
<span class="prompt">$</span> <span class="command">for f in</span> *.jpeg; <span class="command">do</span> mv "$f" "\${f%.jpeg}.jpg"; <span class="command">done</span>
<span class="comment"># 500 dosya → 2 saniye! GUI ile: 500 × sağ tık = ~1 saat</span>

<span class="comment"># Tüm dosya adlarını küçük harfe çevir:</span>
<span class="prompt">$</span> <span class="command">for f in</span> *; <span class="command">do</span> mv "$f" "$(echo $f | tr 'A-Z' 'a-z')"; <span class="command">done</span>

<span class="comment"># Her dizine bir README.md dosyası oluştur:</span>
<span class="prompt">$</span> <span class="command">find . -type d -exec</span> sh -c 'touch "$1/README.md"' _ {} \\;</code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 find -exec: {} ve \; Kuralları</div>
    <code>-exec</code> ile bulunan her dosya için bir komut çalıştırabilirsiniz:<br><br>
    <code>find . -name "*.log" -exec rm {} \;</code> — Her dosya için ayrı ayrı <code>rm</code> çalıştırır.<br>
    <code>find . -name "*.log" -exec rm {} +</code> — Tüm dosyaları tek <code>rm</code> komutuna verir (daha hızlı!).<br><br>
    <strong>Dikkat:</strong> <code>{}</code> içine doğrudan metin ekleyemezsiniz. <code>{}/README.md</code> gibi kullanım taşınabilir (portable) değildir! Bunun yerine <code>sh -c</code> ile alt kabuk kullanın:<br>
    <code>find . -type d -exec sh -c 'touch "$1/README.md"' _ {} \;</code>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Disk kullanımı kontrol</span></div>
    <pre><code><span class="comment"># En büyük 10 dosyayı bul:</span>
<span class="prompt">$</span> <span class="command">find . -type f -exec</span> du -h {} + <span class="argument">|</span> <span class="command">sort -rh</span> <span class="argument">|</span> <span class="command">head -10</span>

<span class="comment"># 30 günden eski log dosyalarını sil:</span>
<span class="prompt">$</span> <span class="command">find /var/log -name</span> <span class="string">"*.log"</span> <span class="argument">-mtime +30 -delete</span></code></pre>
</div>

<h2>find — Dosya Bul</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">find</span> = <span class="eng-meaning">Bul</span> — Dosya sisteminde belirtilen kriterlere göre dosya ve dizin arar.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>find örnekleri</span>
        <button class="try-btn" onclick="runInTerminal('find . -name \\'*.txt\\'')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># İsme göre bul</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">.</span> <span class="argument">-name</span> <span class="string">"*.txt"</span>

<span class="comment"># Türe göre bul (-type f = dosya, d = dizin)</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">.</span> <span class="argument">-type d</span>   <span class="comment"># Sadece dizinler</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">.</span> <span class="argument">-type f</span>   <span class="comment"># Sadece dosyalar</span>

<span class="comment"># Boyuta göre bul</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">.</span> <span class="argument">-size +10M</span>   <span class="comment"># 10 MB'den büyük</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">.</span> <span class="argument">-size -1k</span>    <span class="comment"># 1 KB'den küçük</span>

<span class="comment"># Zamana göre bul</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">.</span> <span class="argument">-mtime -7</span>   <span class="comment"># Son 7 günde değiştirilen</span>

<span class="comment"># Bulduklarını bir şey yap (-exec)</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">.</span> <span class="argument">-name "*.log" -exec</span> rm {} \\;

<span class="comment"># -exec {} + ile daha hızlı: dosyaları toplu gönderir</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">.</span> <span class="argument">-name "*.tmp" -exec</span> rm {} +

<span class="comment"># Bulunan dosyalarda grep ile arama</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">.</span> <span class="argument">-name "*.py" -exec</span> grep -l <span class="string">"TODO"</span> {} +</code></pre>
</div>

<h2>xargs — Standart Girdiden Argüman Oluştur</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">xargs</span> = <span class="eng-meaning">eXtended ARGumentS</span> — Pipe'tan gelen çıktıyı başka bir komutun argümanı olarak kullanır. <code>find</code> ile çok sık birlikte kullanılır.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>xargs kullanımı</span></div>
    <pre><code><span class="comment"># find + xargs: bulunan dosyaları silme</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">.</span> <span class="argument">-name "*.log"</span> | <span class="command">xargs</span> rm

<span class="comment"># -print0 / -0: dosya adlarında boşluk varsa güvenli kullanım</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">.</span> <span class="argument">-name "*.txt" -print0</span> | <span class="command">xargs -0</span> wc -l

<span class="comment"># Onay isteyerek: -p (prompt) seçeneği</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">.</span> <span class="argument">-name "*.bak"</span> | <span class="command">xargs -p</span> rm
<span class="output">rm dosya1.bak dosya2.bak ?...</span>  <span class="comment"># y/n ile onay</span></code></pre>
</div>

<h2>rename — Toplu Yeniden Adlandırma</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">rename</span> = <span class="eng-meaning">Yeniden Adlandır</span> — Perl regex ile toplu dosya adı değiştirme. <code>for</code> döngüsüne güçlü bir alternatif.<br>
        <em>Not: Ubuntu/Debian'da <code>rename</code>, Fedora/RHEL'de <code>prename</code> olarak bulunabilir.</em>
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>rename örnekleri</span></div>
    <pre><code><span class="comment"># .jpeg → .jpg (Perl rename)</span>
<span class="prompt">$</span> <span class="command">rename</span> <span class="string">'s/\\.jpeg$/.jpg/'</span> <span class="path">*.jpeg</span>

<span class="comment"># Dosya adlarını küçük harfe çevir</span>
<span class="prompt">$</span> <span class="command">rename</span> <span class="string">'y/A-Z/a-z/'</span> <span class="path">*</span>

<span class="comment"># Boşlukları alt çizgi yap</span>
<span class="prompt">$</span> <span class="command">rename</span> <span class="string">'s/ /_/g'</span> <span class="path">*</span>

<span class="comment"># -n ile sadece ne yapacağını göster (dry run), uygulamaz</span>
<span class="prompt">$</span> <span class="command">rename -n</span> <span class="string">'s/\\.jpeg$/.jpg/'</span> <span class="path">*.jpeg</span>
<span class="output">foto1.jpeg renamed as foto1.jpg</span>
<span class="output">foto2.jpeg renamed as foto2.jpg</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 rename -n: Her Zaman Önce Test Edin</div>
    <code>-n</code> (no-act / dry run) seçeneği dosyaları değiştirmeden sadece ne yapacağını gösterir. Toplu işlemlerden önce <strong>mutlaka</strong> <code>-n</code> ile test edin!
</div>
`,
    quiz: [
        {
            question: "'mkdir -p proje/src/css' komutu ne yapar?",
            options: ["Sadece 'css' dizinini oluşturur", "Hata verir çünkü 'proje' mevcut değil", "proje, src ve css dizinlerini iç içe oluşturur", "Mevcut dizinleri siler ve yeniden oluşturur"],
            correct: 2,
            explanation: "-p (parents) seçeneği, yol üzerindeki tüm ara dizinleri otomatik oluşturur."
        },
        {
            question: "'cp' komutunun açılımı nedir?",
            options: ["Command Process", "Copy", "Change Path", "Create Page"],
            correct: 1,
            explanation: "cp = Copy (Kopyala). Dosyaları kopyalamak için kullanılır."
        },
        {
            question: "'rm -rf' komutundaki '-r' ve '-f' ne anlama gelir?",
            options: ["read ve find", "recursive ve force", "remove ve file", "run ve fast"],
            correct: 1,
            explanation: "-r = recursive (özyinelemeli, dizin içindeki her şeyi dahil et), -f = force (zorla, uyarı sormadan sil)."
        },
        {
            question: "'mv dosya.txt Belgeler/' komutu ne yapar?",
            options: ["dosya.txt'yi kopyalar", "dosya.txt'yi Belgeler dizinine taşır", "dosya.txt'yi siler", "Belgeler dizinini oluşturur"],
            correct: 1,
            explanation: "mv = Move (Taşı). Dosyayı mevcut yerinden hedef dizine taşır."
        },
        {
            question: "500 dosyayı yeniden adlandırmak için en uygun yol hangisidir?",
            options: ["GUI ile tek tek sağ tık → yeniden adlandır", "Bash for döngüsü ile toplu adlandırma", "Her dosyayı ayrı mv komutuyla", "Dosyaları silip yeniden oluşturmak"],
            correct: 1,
            explanation: "Bash for döngüsü ile 500 dosyayı saniyeler içinde yeniden adlandırabilirsiniz. CLI'nin toplu işlem gücü!"
        },
        {
            question: "'find . -name \"*.log\" -exec rm {} +' komutundaki '+' ne yapar?",
            options: ["Her dosya için ayrı rm çalıştırır", "Bulunan tüm dosyaları tek rm komutuna toplu gönderir", "Sadece 1 dosya siler", "Hata verir"],
            correct: 1,
            explanation: "'+' bulunan dosyaları toplu olarak tek komuta gönderir (daha hızlı). '\\;' ise her dosya için ayrı ayrı komut çalıştırır."
        }
    ]
});
