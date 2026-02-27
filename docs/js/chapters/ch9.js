// ===== Bölüm 9: Filtreler =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 9,
    title: 'Filtreler',
    subtitle: 'Filters',
    icon: '🔍',
    description: 'Verileri filtreleyip dönüştüren temel komutlar: cat, head, tail, sort, wc, uniq, cut, tr, sed, awk ve daha fazlası.',
    content: `
<h2>Filtre Nedir?</h2>
<p>Linux'ta <strong>filtre</strong>, standart girdiden (stdin) veri alan, işleyen ve standart çıktıya (stdout) yazan programlardır. Filtreler, pipe (<code>|</code>) ile zincirlenerek güçlü veri işleme hattları oluşturur.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">Filter</span> = <span class="eng-meaning">Filtre</span> — Veriyi alıp, işleyip çıkaran program.<br>
        <span class="eng-word">stdin</span> = <span class="eng-meaning">Standard Input (Standart Girdi)</span> — Genellikle klavye veya pipe'tan gelen veri.<br>
        <span class="eng-word">stdout</span> = <span class="eng-meaning">Standard Output (Standart Çıktı)</span> — Genellikle ekran veya pipe'a giden veri.
    </div>
</div>

<h2>cat ve tac — Birleştir, Göster, Ters Çevir</h2>
<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">cat</span> = <span class="eng-meaning">Concatenate</span> — "Birleştir". Dosya içeriğini ekrana yazdırır veya birden fazla dosyayı birleştirir.<br>
        <span class="eng-word">tac</span> = <span class="eng-meaning">cat'in tersi</span> — Dosya satırlarını ters sırada gösterir (son satır ilk olur). İsim: "cat" kelimesi tersten.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>cat ve tac kullanımı</span>
        <button class="try-btn" onclick="runInTerminal('cat notlar.txt')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">$</span> <span class="command">cat</span> <span class="path">notlar.txt</span>           <span class="comment"># Dosya içeriğini göster</span>
<span class="prompt">$</span> <span class="command">cat -n</span> <span class="path">notlar.txt</span>        <span class="comment"># -n = number, satır numaralı</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="path">dosya1.txt dosya2.txt</span>  <span class="comment"># İki dosyayı birleştirerek göster</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="path">dosya1.txt dosya2.txt</span> > <span class="path">birlesik.txt</span>  <span class="comment"># Birleştirip dosyaya yaz</span>

<span class="comment"># tac — satırları ters sırada göster:</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="path">sayilar.txt</span>
<span class="output">1
2
3</span>
<span class="prompt">$</span> <span class="command">tac</span> <span class="path">sayilar.txt</span>
<span class="output">3
2
1</span>
<span class="comment"># Log dosyalarını en son olaydan başlayarak okumak için harika!</span></code></pre>
</div>

<h2>head & tail — Baş ve Son</h2>
<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamları</div>
    <div class="eng-content">
        <span class="eng-word">head</span> = <span class="eng-meaning">Baş/Kafa</span> — Dosyanın ilk satırlarını gösterir. Varsayılan: 10 satır.<br>
        <span class="eng-word">tail</span> = <span class="eng-meaning">Kuyruk</span> — Dosyanın son satırlarını gösterir. Varsayılan: 10 satır.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>head ve tail</span>
        <button class="try-btn" onclick="runInTerminal('head -5 Belgeler/rapor.txt')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">$</span> <span class="command">head</span> <span class="path">dosya.txt</span>          <span class="comment"># İlk 10 satırı göster</span>
<span class="prompt">$</span> <span class="command">head -5</span> <span class="path">dosya.txt</span>       <span class="comment"># İlk 5 satırı göster</span>
<span class="prompt">$</span> <span class="command">head -n 20</span> <span class="path">dosya.txt</span>    <span class="comment"># İlk 20 satır</span>

<span class="prompt">$</span> <span class="command">tail</span> <span class="path">dosya.txt</span>          <span class="comment"># Son 10 satırı göster</span>
<span class="prompt">$</span> <span class="command">tail -3</span> <span class="path">dosya.txt</span>       <span class="comment"># Son 3 satır</span>
<span class="prompt">$</span> <span class="command">tail -f</span> <span class="path">/var/log/syslog</span>  <span class="comment"># -f = follow (canlı takip!)</span>
<span class="comment"># tail -f log dosyasını canlı izler — sunucu yönetiminde çok kullanışlı!</span>

<span class="comment"># İlk satır hariç tümünü göster (satır 2'den başla):</span>
<span class="prompt">$</span> <span class="command">tail -n +2</span> <span class="path">dosya.txt</span>   <span class="comment"># CSV başlığını atlamak için: +2</span></code></pre>
</div>

<h2>nl — Satır Numaralama</h2>
<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">nl</span> = <span class="eng-meaning">Number Lines</span> — "Satır Numarala". <code>cat -n</code>'e benzer ama daha esnek numaralama seçenekleri sunar.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>nl kullanımı</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">nl</span> <span class="path">dosya.txt</span>            <span class="comment"># Boş olmayan satırları numarala</span>
<span class="prompt">$</span> <span class="command">nl -ba</span> <span class="path">dosya.txt</span>         <span class="comment"># -ba = body all (boş satırlar dahil)</span>
<span class="prompt">$</span> <span class="command">nl -s'. '</span> <span class="path">dosya.txt</span>      <span class="comment"># -s = separator: "1. satır" formatı</span></code></pre>
</div>

<h2>sort — Sırala</h2>
<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">sort</span> = <span class="eng-meaning">Sırala</span> — Satırları alfabetik veya sayısal olarak sıralar.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>sort örnekleri</span>
        <button class="try-btn" onclick="runInTerminal('sort Belgeler/notlar/linux.txt')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">$</span> <span class="command">sort</span> <span class="path">isimler.txt</span>       <span class="comment"># Alfabetik sırala</span>
<span class="prompt">$</span> <span class="command">sort -r</span> <span class="path">isimler.txt</span>    <span class="comment"># -r = reverse (ters sıra)</span>
<span class="prompt">$</span> <span class="command">sort -n</span> <span class="path">sayilar.txt</span>    <span class="comment"># -n = numeric (sayısal sıra)</span>
<span class="prompt">$</span> <span class="command">sort -rn</span> <span class="path">sayilar.txt</span>   <span class="comment"># Sayısal, büyükten küçüğe</span>
<span class="prompt">$</span> <span class="command">sort -u</span> <span class="path">isimler.txt</span>    <span class="comment"># -u = unique (tekrarları ele)</span>
<span class="prompt">$</span> <span class="command">sort -t: -k3 -n</span> <span class="path">veri.csv</span> <span class="comment"># -t: ayırıcı, -k3: 3. alan</span>
<span class="prompt">$</span> <span class="command">sort -h</span> <span class="path">boyutlar.txt</span>   <span class="comment"># -h = human-numeric (2K, 1G gibi)</span></code></pre>
</div>

<h2>wc — Kelime/Satır/Byte Sayma</h2>
<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">wc</span> = <span class="eng-meaning">Word Count</span> — "Kelime Say". Satır, kelime ve byte sayar.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>wc kullanımı</span>
        <button class="try-btn" onclick="runInTerminal('wc notlar.txt')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">$</span> <span class="command">wc</span> <span class="path">notlar.txt</span>
<span class="output">     8    20   156 notlar.txt</span>
<span class="comment">#  satır kelime bayt  dosya</span>

<span class="prompt">$</span> <span class="command">wc -l</span> <span class="path">notlar.txt</span>  <span class="comment"># -l = lines (sadece satır sayısı)</span>
<span class="prompt">$</span> <span class="command">wc -w</span> <span class="path">notlar.txt</span>  <span class="comment"># -w = words (sadece kelime sayısı)</span>
<span class="prompt">$</span> <span class="command">wc -c</span> <span class="path">notlar.txt</span>  <span class="comment"># -c = bytes (BAYT sayısı)</span>
<span class="prompt">$</span> <span class="command">wc -m</span> <span class="path">notlar.txt</span>  <span class="comment"># -m = chars (KARAKTER sayısı)</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 wc -c vs wc -m: Byte ≠ Karakter!</div>
    ASCII metinde byte ve karakter sayısı aynıdır. Ama Türkçe gibi UTF-8 karakterler (ş, ç, ğ, ü, ö, ı) <strong>2 byte</strong> yer kaplar:<br>
    <code>echo "şç" | wc -c</code> → <strong>5</strong> (2+2+1 newline)<br>
    <code>echo "şç" | wc -m</code> → <strong>3</strong> (2 karakter + 1 newline)<br>
    Türkçe metin saydığınızda <code>-m</code> kullanın!
</div>

<h2>uniq — Tekrar Edenleri Eleme</h2>
<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">uniq</span> = <span class="eng-meaning">Unique (Benzersiz)</span> — Ardışık tekrar eden satırları eler.<br>
        <strong>Önemli:</strong> Yalnızca <strong>ardışık</strong> tekrarları eler. Tüm tekrarları elemek için önce <code>sort</code> kullanın!
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>sort | uniq kalıbı</span></div>
    <pre><code><span class="comment"># Tüm tekrarları ele:</span>
<span class="prompt">$</span> <span class="command">sort</span> <span class="path">isimler.txt</span> | <span class="command">uniq</span>

<span class="comment"># Tekrar sayılarını göster:</span>
<span class="prompt">$</span> <span class="command">sort</span> <span class="path">isimler.txt</span> | <span class="command">uniq -c</span>
<span class="comment"># -c = count (her satırın kaç kez tekrarladığını göst er)</span>

<span class="comment"># Sadece tekrarlananları göster:</span>
<span class="prompt">$</span> <span class="command">sort</span> <span class="path">isimler.txt</span> | <span class="command">uniq -d</span>
<span class="comment"># -d = duplicates (yalnızca tekrarlayan satırlar)</span>

<span class="comment"># En çok tekrarlayan kelimeler (güçlü kalıp!):</span>
<span class="prompt">$</span> <span class="command">sort</span> <span class="path">log.txt</span> | <span class="command">uniq -c</span> | <span class="command">sort -rn</span> | <span class="command">head</span></code></pre>
</div>

<h2>cut — Sütun Kesme</h2>
<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">cut</span> = <span class="eng-meaning">Kes</span> — Satırlardan belirtilen sütunları veya alanları keser ve gösterir.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>cut kullanımı</span></div>
    <pre><code><span class="comment"># CSV'den belirli alanları çek (virgülle ayrılmış):</span>
<span class="prompt">$</span> <span class="command">cut -d',' -f1,3</span> <span class="path">veri.csv</span>
<span class="comment"># -d = delimiter (ayırıcı): virgül</span>
<span class="comment"># -f = fields (alanlar): 1. ve 3. alan</span>

<span class="comment"># /etc/passwd'den kullanıcı adlarını çek:</span>
<span class="prompt">$</span> <span class="command">cut -d: -f1</span> <span class="path">/etc/passwd</span>

<span class="comment"># Karakter pozisyonuna göre kes:</span>
<span class="prompt">$</span> <span class="command">cut -c1-10</span> <span class="path">dosya.txt</span>
<span class="comment"># Her satırın ilk 10 karakteri</span>

<span class="comment"># Alan aralığı:</span>
<span class="prompt">$</span> <span class="command">cut -d: -f1,3-5</span> <span class="path">/etc/passwd</span>
<span class="comment"># 1. alan ve 3'ten 5'e kadar alanlar</span></code></pre>
</div>

<h2>rev ve column — Ters Çevir ve Tablo Oluştur</h2>

<div class="code-block">
    <div class="code-block-header"><span>rev ve column kullanımı</span></div>
    <pre><code><span class="comment"># rev — her satırı karakter karakter ters çevir:</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"merhaba"</span> | <span class="command">rev</span>
<span class="output">abahrem</span>

<span class="comment"># Dosya uzantısını almak için kullanışlı bir hile:</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"dosya.tar.gz"</span> | <span class="command">rev</span> | <span class="command">cut -d. -f1</span> | <span class="command">rev</span>
<span class="output">gz</span>

<span class="comment"># column — veriyi düzgün tablo formatında göster:</span>
<span class="prompt">$</span> <span class="command">mount</span> | <span class="command">column -t</span>
<span class="comment"># -t = table: sütunları hizalar</span>

<span class="comment"># CSV'yi tablo olarak göster:</span>
<span class="prompt">$</span> <span class="command">column -t -s','</span> <span class="path">veri.csv</span>
<span class="comment"># -s = separator: virgülü ayırıcı olarak kullan</span></code></pre>
</div>

<h2>paste — Dosyaları Yan Yana Birleştir</h2>
<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">paste</span> = <span class="eng-meaning">Yapıştır</span> — Birden fazla dosyanın satırlarını yan yana (sütun olarak) birleştirir. <code>cat</code>'in alt alta birleştirmesinin aksine, paste yan yana birleştirir.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>paste kullanımı</span></div>
    <pre><code><span class="comment"># İki dosyayı yan yana birleştir (tab ile):</span>
<span class="prompt">$</span> <span class="command">paste</span> <span class="path">isimler.txt notlar.txt</span>
<span class="output">Ali     85
Ayşe    92
Mehmet  78</span>

<span class="comment"># Özel ayırıcı ile:</span>
<span class="prompt">$</span> <span class="command">paste -d','</span> <span class="path">isimler.txt notlar.txt</span>
<span class="output">Ali,85
Ayşe,92
Mehmet,78</span>

<span class="comment"># Tek dosyanın satırlarını yan yana getir:</span>
<span class="prompt">$</span> <span class="command">paste -s -d','</span> <span class="path">isimler.txt</span>
<span class="output">Ali,Ayşe,Mehmet</span></code></pre>
</div>

<h2>tr — Karakter Dönüştürme</h2>
<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">tr</span> = <span class="eng-meaning">Translate/Transform</span> — Karakterleri dönüştürür veya siler. Pipe ile kullanılır (dosya argümanı almaz).
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>tr kullanımı</span></div>
    <pre><code><span class="comment"># Küçük harfleri büyük harfe çevir:</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"merhaba"</span> | <span class="command">tr</span> <span class="argument">'a-z' 'A-Z'</span>
<span class="output">MERHABA</span>

<span class="comment"># Belirli karakterleri sil (-d = delete):</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"abc123def456"</span> | <span class="command">tr -d</span> <span class="argument">'0-9'</span>
<span class="output">abcdef</span>

<span class="comment"># Tekrarlayan boşlukları tek boşluğa sıkıştır (-s = squeeze):</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"çok    fazla   boşluk"</span> | <span class="command">tr -s</span> <span class="argument">' '</span>
<span class="output">çok fazla boşluk</span>

<span class="comment"># Windows satır sonlarını (\\r\\n) Unix'e (\\n) çevir:</span>
<span class="prompt">$</span> <span class="command">tr -d</span> <span class="argument">'\\r'</span> < <span class="path">windows.txt</span> > <span class="path">unix.txt</span></code></pre>
</div>

<h2>sed — Akış Editörü</h2>
<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">sed</span> = <span class="eng-meaning">Stream Editor</span> — "Akış Editörü". Metin üzerinde otomatik bul-değiştir, silme ve ekleme yapar. Dosyayı düzenleyiciye açmadan değiştirir!
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>sed temel kullanımı</span></div>
    <pre><code><span class="comment"># Bul ve değiştir (ilk eşleşme):</span>
<span class="prompt">$</span> <span class="command">sed</span> <span class="string">'s/eski/yeni/'</span> <span class="path">dosya.txt</span>

<span class="comment"># Bul ve değiştir (tüm eşleşmeler — g = global):</span>
<span class="prompt">$</span> <span class="command">sed</span> <span class="string">'s/eski/yeni/g'</span> <span class="path">dosya.txt</span>

<span class="comment"># Dosyayı yerinde değiştir (-i = in-place):</span>
<span class="prompt">$</span> <span class="command">sed -i</span> <span class="string">'s/hata/düzeltme/g'</span> <span class="path">dosya.txt</span>

<span class="comment"># ⚡ Yerinde değiştir + YEDEK al (güvenli yol!):</span>
<span class="prompt">$</span> <span class="command">sed -i.bak</span> <span class="string">'s/hata/düzeltme/g'</span> <span class="path">dosya.txt</span>
<span class="comment"># dosya.txt değişir, dosya.txt.bak eski halidir</span>

<span class="comment"># Belirli satırları sil:</span>
<span class="prompt">$</span> <span class="command">sed</span> <span class="string">'5d'</span> <span class="path">dosya.txt</span>      <span class="comment"># 5. satırı sil</span>
<span class="prompt">$</span> <span class="command">sed</span> <span class="string">'1,3d'</span> <span class="path">dosya.txt</span>    <span class="comment"># 1-3. satırları sil</span>
<span class="prompt">$</span> <span class="command">sed</span> <span class="string">'/yorum/d'</span> <span class="path">dosya.txt</span> <span class="comment"># "yorum" geçen satırları sil</span>

<span class="comment"># Belirli satırlarda değişiklik yap:</span>
<span class="prompt">$</span> <span class="command">sed</span> <span class="string">'3s/eski/yeni/'</span> <span class="path">dosya.txt</span>    <span class="comment"># Sadece 3. satırda</span>
<span class="prompt">$</span> <span class="command">sed</span> <span class="string">'10,20s/foo/bar/g'</span> <span class="path">dosya.txt</span> <span class="comment"># 10-20 arası satırlarda</span>

<span class="comment"># Satır ekle — 'a' (after/sonra) ve 'i' (insert/önce):</span>
<span class="prompt">$</span> <span class="command">sed</span> <span class="string">'3a\\Yeni satır eklendi'</span> <span class="path">dosya.txt</span>  <span class="comment"># 3. satırdan sonra</span>
<span class="prompt">$</span> <span class="command">sed</span> <span class="string">'1i\\Başlık satırı'</span> <span class="path">dosya.txt</span>      <span class="comment"># 1. satırdan önce</span></code></pre>
</div>

<h2>awk — Güçlü Metin İşleme Dili</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">awk</span> = <span class="eng-meaning">Aho, Weinberger, Kernighan</span> — Yaratıcılarının soyadı baş harfleri. Metin işleme için tasarlanmış küçük bir programlama dilidir. Sütunsal veri işlemede <code>cut</code>'tan çok daha güçlüdür.
    </div>
</div>

<p><code>awk</code>, Linux komut satırının en güçlü filtrelerinden biridir. Her satırı otomatik olarak alanlara (sütunlara) böler ve bunlar üzerinde işlem yapmanızı sağlar.</p>

<h3>Temel awk Yapısı</h3>
<div class="code-block">
    <div class="code-block-header"><span>awk temel kullanımı</span></div>
    <pre><code><span class="comment"># Temel yapı: awk 'kalıp { eylem }' dosya</span>
<span class="comment"># Alanlar: $1 = 1. sütun, $2 = 2. sütun, ... $0 = tüm satır</span>
<span class="comment"># Varsayılan alan ayırıcı: boşluk/tab</span>

<span class="comment"># 1. sütunu yazdır (cut -d' ' -f1 gibi ama daha akıllı):</span>
<span class="prompt">$</span> <span class="command">awk</span> <span class="string">'{print $1}'</span> <span class="path">dosya.txt</span>

<span class="comment"># 1. ve 3. sütunu yazdır:</span>
<span class="prompt">$</span> <span class="command">awk</span> <span class="string">'{print $1, $3}'</span> <span class="path">dosya.txt</span>

<span class="comment"># Tüm satırı yazdır ($0):</span>
<span class="prompt">$</span> <span class="command">awk</span> <span class="string">'{print $0}'</span> <span class="path">dosya.txt</span>  <span class="comment"># cat gibi</span>

<span class="comment"># Son sütunu yazdır (NF = Number of Fields):</span>
<span class="prompt">$</span> <span class="command">awk</span> <span class="string">'{print $NF}'</span> <span class="path">dosya.txt</span></code></pre>
</div>

<h3>Alan Ayırıcı ve Biçimlendirme</h3>
<div class="code-block">
    <div class="code-block-header"><span>awk ile ayırıcı ve biçimlendirme</span></div>
    <pre><code><span class="comment"># -F ile ayırıcı belirle (CSV için virgül):</span>
<span class="prompt">$</span> <span class="command">awk -F','</span> <span class="string">'{print $1, $3}'</span> <span class="path">veri.csv</span>

<span class="comment"># /etc/passwd'den kullanıcı adı ve shell:</span>
<span class="prompt">$</span> <span class="command">awk -F:</span> <span class="string">'{print $1, $7}'</span> <span class="path">/etc/passwd</span>
<span class="output">root /bin/bash
daemon /usr/sbin/nologin
ali /bin/bash</span>

<span class="comment"># printf ile biçimlendirilmiş çıktı:</span>
<span class="prompt">$</span> <span class="command">awk -F:</span> <span class="string">'{printf "%-15s %s\\n", $1, $7}'</span> <span class="path">/etc/passwd</span>
<span class="output">root            /bin/bash
daemon          /usr/sbin/nologin</span></code></pre>
</div>

<h3>Kalıp Eşleştirme ve Koşullar</h3>
<div class="code-block">
    <div class="code-block-header"><span>awk ile filtreleme</span></div>
    <pre><code><span class="comment"># Belirli bir kalıbı içeren satırlar (grep gibi):</span>
<span class="prompt">$</span> <span class="command">awk</span> <span class="string">'/ERROR/'</span> <span class="path">log.txt</span>

<span class="comment"># 3. sütun 100'den büyük olan satırlar:</span>
<span class="prompt">$</span> <span class="command">awk</span> <span class="string">'$3 > 100'</span> <span class="path">veri.txt</span>

<span class="comment"># Disk kullanımı %80'den fazla olanlar:</span>
<span class="prompt">$</span> <span class="command">df -h</span> | <span class="command">awk</span> <span class="string">'+$5 > 80 {print $6, $5}'</span>

<span class="comment"># BEGIN ve END blokları — başlangıç ve bitiş işlemleri:</span>
<span class="prompt">$</span> <span class="command">awk</span> <span class="string">'BEGIN {print "=== RAPOR ==="} {print $0} END {print "=== BİTTİ ==="}'</span> <span class="path">veri.txt</span></code></pre>
</div>

<h3>awk ile Hesaplama</h3>
<div class="code-block">
    <div class="code-block-header"><span>awk matematiksel işlemler</span></div>
    <pre><code><span class="comment"># Bir sütunun toplamını hesapla:</span>
<span class="prompt">$</span> <span class="command">awk</span> <span class="string">'{toplam += $1} END {print "Toplam:", toplam}'</span> <span class="path">sayilar.txt</span>

<span class="comment"># Ortalama hesapla:</span>
<span class="prompt">$</span> <span class="command">awk</span> <span class="string">'{toplam += $2; sayac++} END {print "Ort:", toplam/sayac}'</span> <span class="path">notlar.txt</span>

<span class="comment"># Satır sayısı (NR = Number of Records):</span>
<span class="prompt">$</span> <span class="command">awk</span> <span class="string">'END {print NR, "satır"}'</span> <span class="path">dosya.txt</span>

<span class="comment"># En büyük değeri bul:</span>
<span class="prompt">$</span> <span class="command">awk</span> <span class="string">'$1 > max {max = $1} END {print "Max:", max}'</span> <span class="path">sayilar.txt</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 cut vs awk — Ne Zaman Hangisi?</div>
    <strong>cut kullanın:</strong> Basit, sabit ayırıcılı dosyalarda hızlı sütun seçimi için.<br>
    <strong>awk kullanın:</strong> Hesaplama gerektiğinde, koşullu filtreleme yapacağınızda, değişken sayıda boşluk/tab olduğunda, veya birden fazla işlemi tek komutta yapmak istediğinizde.<br><br>
    <code>awk</code> ayrıca ardışık boşlukları akıllıca tek ayırıcı olarak görür — <code>cut</code> bunu yapamaz.
</div>

<h2>Filtre Zinciri Örnekleri</h2>
<p>Filtrelerin gerçek gücü, pipe ile zincirlendiklerinde ortaya çıkar:</p>

<div class="code-block">
    <div class="code-block-header"><span>Güçlü filtre zincirleri</span></div>
    <pre><code><span class="comment"># En sık kullanılan 10 kelimeyi bul:</span>
<span class="prompt">$</span> <span class="command">cat</span> metin.txt | <span class="command">tr</span> ' ' '\\n' | <span class="command">sort</span> | <span class="command">uniq -c</span> | <span class="command">sort -rn</span> | <span class="command">head -10</span>

<span class="comment"># Log dosyasında en çok hata veren IP adresleri:</span>
<span class="prompt">$</span> <span class="command">grep</span> "ERROR" access.log | <span class="command">awk</span> '{print $1}' | <span class="command">sort</span> | <span class="command">uniq -c</span> | <span class="command">sort -rn</span> | <span class="command">head -5</span>

<span class="comment"># Disk kullanımını özetleme (awk ile):</span>
<span class="prompt">$</span> <span class="command">du -sh</span> * | <span class="command">sort -rh</span> | <span class="command">head -10</span>

<span class="comment"># CSV'den rapor oluştur (awk ile):</span>
<span class="prompt">$</span> <span class="command">awk -F','</span> <span class="string">'{printf "%-20s %10s TL\\n", $1, $3}'</span> <span class="path">satis.csv</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Unix Felsefesi İş Başında</div>
    "Her program tek bir şeyi iyi yapsın." Bu filtrelerden her biri basit bir iş yapar: <code>sort</code> sıralar, <code>uniq</code> tekrarları eler, <code>wc</code> sayar, <code>awk</code> hesaplar. Ama pipe ile birleştirdiğinizde, <strong>tam bir veri analizi aracı</strong> haline gelirler!
</div>
`,
    quiz: [
        {
            question: "'cat' komutunun açılımı nedir?",
            options: ["Category", "Concatenate", "Catalog", "Catch"],
            correct: 1,
            explanation: "cat = Concatenate (Birleştir). Dosya içeriğini gösterir veya birden fazla dosyayı birleştirir."
        },
        {
            question: "'wc -c' ve 'wc -m' arasındaki fark nedir?",
            options: ["Hiçbir fark yoktur", "-c byte sayar, -m karakter sayar", "-c karakter sayar, -m byte sayar", "-c satır sayar, -m kelime sayar"],
            correct: 1,
            explanation: "wc -c byte (bayt) sayar, wc -m karakter sayar. UTF-8'de Türkçe karakterler (ş,ç,ğ) 2 byte olduğundan sonuçlar farklı olabilir."
        },
        {
            question: "'tail -f log.txt' ne yapar?",
            options: ["Dosyanın ilk satırını gösterir", "Dosyayı siler", "Dosyanın sonunu canlı olarak takip eder", "Dosyayı filtreler"],
            correct: 2,
            explanation: "-f = follow (takip et). Dosyaya eklenen yeni satırları gerçek zamanlı gösterir. Log izleme için harika!"
        },
        {
            question: "awk '{print $3}' ne yapar?",
            options: ["3. satırı yazdırır", "3. karakteri yazdırır", "3. sütunu (alanı) yazdırır", "Dosyayı 3 kez yazdırır"],
            correct: 2,
            explanation: "awk'ta $1, $2, $3... alan (sütun) numaralarıdır. $3 her satırın 3. alanını yazdırır."
        },
        {
            question: "sed -i.bak 's/a/b/g' dosya.txt ne yapar?",
            options: ["Sadece ekrana yazdırır", "Dosyayı değiştirir, yedek almaz", "Dosyayı değiştirir ve .bak uzantılı yedek oluşturur", "Hata verir"],
            correct: 2,
            explanation: "-i.bak dosyayı yerinde değiştirir ve orijinalin bir kopyasını dosya.txt.bak olarak kaydeder. Güvenli düzenleme yöntemi!"
        },
        {
            question: "'tac' komutu ne yapar?",
            options: ["Dosyayı siler", "Dosyanın satırlarını ters sırada gösterir", "Karakter sayar", "Dosya türünü gösterir"],
            correct: 1,
            explanation: "tac, cat'in tersidir (isim de ters yazılmıştır). Dosyanın son satırını ilk, ilk satırını son olarak gösterir."
        }
    ]
});
