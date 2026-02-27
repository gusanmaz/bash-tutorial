// ===== Bölüm 7: Jokerler (Wildcards) =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 7,
    title: 'Jokerler (Wildcards)',
    subtitle: 'Wildcards',
    icon: '🃏',
    description: 'Birden fazla dosyayı tek seferde hedefleme yöntemleri: globbing, brace expansion ve genişletme.',
    content: `
<h2>Wildcard (Joker Karakter) Nedir?</h2>
<p>Wildcards, birden fazla dosyayı belirli bir kalıba (pattern) göre seçmenizi sağlar. <strong>Globbing</strong> olarak da adlandırılır. Shell, joker karakterleri eşleşen dosya adlarıyla değiştirir.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">Wildcard</span> = <span class="eng-meaning">Joker karakter</span> — Dosya adı kalıplarında "her şeyi" veya "bir şeyi" temsil eden özel karakterler.<br>
        <span class="eng-word">Globbing</span> = <span class="eng-meaning">Kalıp eşleme</span> — Joker karakterlerle dosya adlarını eşleme işlemi.<br>
        <span class="eng-word">Pattern</span> = <span class="eng-meaning">Kalıp/Desen</span> — Eşleşme kuralı.
    </div>
</div>

<h3>Temel Joker Karakterler</h3>
<table>
    <tr><th>Joker</th><th>İngilizce</th><th>Anlamı</th><th>Örnek</th></tr>
    <tr><td><code>*</code></td><td>Asterisk/Star</td><td>Sıfır veya daha fazla herhangi karakter</td><td><code>*.txt</code> → tüm .txt dosyaları</td></tr>
    <tr><td><code>?</code></td><td>Question mark</td><td>Tam olarak bir karakter</td><td><code>dosya?.txt</code> → dosya1.txt, dosyaA.txt</td></tr>
    <tr><td><code>[ ]</code></td><td>Brackets</td><td>Belirtilen karakterlerden biri</td><td><code>[abc].txt</code> → a.txt, b.txt, c.txt</td></tr>
    <tr><td><code>[! ]</code> veya <code>[^ ]</code></td><td>Negation</td><td>Belirtilen karakterler HARİÇ</td><td><code>[!abc].txt</code> → d.txt, e.txt (a/b/c değil)</td></tr>
    <tr><td><code>[0-9]</code></td><td>Range</td><td>Belirtilen aralık</td><td><code>dosya[0-9].txt</code> → dosya0.txt ... dosya9.txt</td></tr>
    <tr><td><code>[a-z]</code></td><td>Range</td><td>Harf aralığı</td><td><code>[a-z]*.txt</code> → küçük harfle başlayan .txt'ler</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header">
        <span>Wildcard örnekleri</span>
        <button class="try-btn" onclick="runInTerminal('ls *.txt')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># Tüm .txt dosyalarını listele</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">*.txt</span>

<span class="comment"># 'B' ile başlayan her şeyi listele</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">B*</span>

<span class="comment"># Uzantısı tam 3 harfli dosyalar</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">*.???</span>

<span class="comment"># Tüm .txt dosyalarını bir dizine kopyala</span>
<span class="prompt">$</span> <span class="command">cp</span> <span class="argument">*.txt</span> <span class="path">Belgeler/</span>

<span class="comment"># Tüm .log dosyalarını sil</span>
<span class="prompt">$</span> <span class="command">rm</span> <span class="argument">*.log</span>

<span class="comment"># Sadece a, b veya c ile başlayan .txt dosyaları</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">[abc]*.txt</span>

<span class="comment"># Rakam ile BAŞLAMAYAN dosyalar</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">[!0-9]*</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Önemli: Globbing shell tarafından yapılır!</div>
    Joker karakterler <strong>kabuk (shell) tarafından genişletilir</strong>, komut tarafından değil. <code>ls *.txt</code> yazdığınızda, shell önce <code>*.txt</code> kalıbını eşleşen dosya adlarıyla değiştirir, sonra <code>ls</code>'e bu dosya listesini gönderir. Yani <code>ls dosya1.txt dosya2.txt dosya3.txt</code> komutu çalışır aslında.
</div>

<h2>Brace Expansion — Süslü Parantez Genişletmesi</h2>
<p>Brace expansion (<code>{}</code>) wildcard'tan farklıdır: <strong>mevcut dosyalara bakmaz</strong>, sadece metin üretir.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">Brace Expansion</span> = <span class="eng-meaning">Süslü Parantez Genişletmesi</span> — Shell'in {a,b,c} kalıbını a b c olarak genişletmesi. Dosya var olmasına bakmaz.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>Brace expansion örnekleri</span>
        <button class="try-btn" onclick="runInTerminal('echo dosya{1,2,3}.txt')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># Liste genişletmesi</span>
<span class="prompt">$</span> <span class="command">echo</span> dosya{1,2,3}.txt
<span class="output">dosya1.txt dosya2.txt dosya3.txt</span>

<span class="comment"># Sıralı genişletme (range)</span>
<span class="prompt">$</span> <span class="command">echo</span> {1..10}
<span class="output">1 2 3 4 5 6 7 8 9 10</span>

<span class="prompt">$</span> <span class="command">echo</span> {a..z}
<span class="output">a b c d e f g h i j k l m n o p q r s t u v w x y z</span>

<span class="comment"># Adımlı aralık</span>
<span class="prompt">$</span> <span class="command">echo</span> {0..100..10}
<span class="output">0 10 20 30 40 50 60 70 80 90 100</span>

<span class="comment"># İç içe genişletme</span>
<span class="prompt">$</span> <span class="command">echo</span> {A,B}{1,2}
<span class="output">A1 A2 B1 B2</span></code></pre>
</div>

<h3>Brace Expansion Pratik Kullanımları</h3>
<div class="code-block">
    <div class="code-block-header"><span>Gerçek hayat örnekleri</span></div>
    <pre><code><span class="comment"># 12 aylık rapor dosyası oluştur:</span>
<span class="prompt">$</span> <span class="command">touch</span> rapor_{01..12}.txt
<span class="comment"># rapor_01.txt rapor_02.txt ... rapor_12.txt</span>

<span class="comment"># Proje yapısını tek komutla oluştur:</span>
<span class="prompt">$</span> <span class="command">mkdir -p</span> proje/{src,test,docs,build}/{css,js,img}

<span class="comment"># Dosya yedekleme (hızlı kopyalama):</span>
<span class="prompt">$</span> <span class="command">cp</span> config.json{,.bak}
<span class="comment"># Bu şu anlama gelir: cp config.json config.json.bak</span>

<span class="comment"># 100 test dosyası oluştur:</span>
<span class="prompt">$</span> <span class="command">touch</span> test_{001..100}.txt</code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Wildcard vs Brace Expansion</div>
    <strong>Wildcard (*,?,[])</strong>: Mevcut dosyalarla eşleşir. <code>*.txt</code> varolan .txt dosyalarını bulur.<br>
    <strong>Brace expansion ({})</strong>: Metin üretir, dosya var mı bakmaz. <code>dosya{1,2,3}.txt</code> her zaman üç isim üretir.<br>
    İkisinin farkını bilmek önemlidir!
</div>

<h2>Globstar: ** — Özyinelemeli Eşleşme</h2>
<p>Bash 4+ sürümünde <code>**</code> (globstar) deseni, alt dizinler dahil tüm dosyaları özyinelemeli olarak eşler. Bu özellik varsayılan olarak kapalıdır, açmak gerekir:</p>

<div class="code-block">
    <div class="code-block-header"><span>globstar kullanımı</span></div>
    <pre><code><span class="comment"># Globstar'ı aç</span>
<span class="prompt">$</span> <span class="command">shopt -s</span> <span class="argument">globstar</span>

<span class="comment"># Tüm alt dizinlerdeki .py dosyalarını listele</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">**/*.py</span>
<span class="comment"># src/main.py  src/utils/helper.py  tests/test_app.py  ...</span>

<span class="comment"># Tüm alt dizinlerdeki tüm dosyaları say</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">**</span> | <span class="command">wc -l</span>

<span class="comment"># find'a alternatif olarak kullanılabilir:</span>
<span class="prompt">$</span> <span class="command">grep -l</span> <span class="string">"TODO"</span> <span class="argument">**/*.js</span>
<span class="comment"># find . -name "*.js" -exec grep -l "TODO" {} + ile aynı</span>

<span class="comment"># Kalıcı yapmak için ~/.bashrc'ye ekleyin:</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">'shopt -s globstar'</span> >> <span class="path">~/.bashrc</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 * vs ** Farkı</div>
    <code>*.txt</code> → sadece mevcut dizindeki .txt dosyaları<br>
    <code>**/*.txt</code> → mevcut dizin ve TÜM alt dizinlerdeki .txt dosyaları<br>
    <code>**</code> = özyinelemeli (recursive) glob. Globstar açık olmalıdır.
</div>

<h2>Extended Globbing (Genişletilmiş Glob)</h2>
<p>Bash'te <code>extglob</code> seçeneği, glob kalıplarına regex benzeri güç katar:</p>

<div class="code-block">
    <div class="code-block-header"><span>extglob kalıpları</span></div>
    <pre><code><span class="comment"># Extglob'u aç</span>
<span class="prompt">$</span> <span class="command">shopt -s</span> <span class="argument">extglob</span>

<span class="comment"># !(kalıp) — kalıp HARİÇ her şey</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">!(*.log|*.tmp)</span>
<span class="comment"># .log ve .tmp dışındaki tüm dosyalar</span>

<span class="comment"># ?(kalıp) — kalıp 0 veya 1 kez</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="argument">dosya?(1|2).txt</span>
<span class="comment"># dosya.txt, dosya1.txt, dosya2.txt</span>

<span class="comment"># *(kalıp) — kalıp 0 veya daha fazla</span>
<span class="comment"># +(kalıp) — kalıp 1 veya daha fazla</span>
<span class="comment"># @(kalıp) — kalıp tam 1 kez</span>

<span class="comment"># Pratik: .jpg ve .png dışındaki dosyaları sil</span>
<span class="prompt">$</span> <span class="command">rm</span> <span class="argument">!(*.jpg|*.png)</span></code></pre>
</div>

<table>
    <tr><th>Extglob Kalıbı</th><th>Anlamı</th><th>Regex Karşılığı</th></tr>
    <tr><td><code>?(kalıp)</code></td><td>0 veya 1 kez</td><td><code>?</code></td></tr>
    <tr><td><code>*(kalıp)</code></td><td>0 veya daha fazla</td><td><code>*</code></td></tr>
    <tr><td><code>+(kalıp)</code></td><td>1 veya daha fazla</td><td><code>+</code></td></tr>
    <tr><td><code>@(kalıp)</code></td><td>Tam olarak 1 kez</td><td><code>()</code></td></tr>
    <tr><td><code>!(kalıp)</code></td><td>Kalıp HARİÇ</td><td>Olumsuz eşleşme</td></tr>
</table>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Glob Tırnak İçinde Çalışmaz!</div>
    <code>"*.txt"</code> veya <code>'*.txt'</code> yazarsanız shell glob genişletmesi yapmaz, literal <code>*.txt</code> metini olarak kalır. Glob kalıplarını <strong>tırnak içine almayın</strong> — (grep/find gibi regex bekleyen komutlar hariç!)
</div>
`,
    quiz: [
        {
            question: "'ls *.txt' komutu ne yapar?",
            options: ["Tüm dosyaları listeler", "Sadece .txt uzantılı dosyaları listeler", "'txt' içeren dosyaları listeler", "Yeni bir .txt dosyası oluşturur"],
            correct: 1,
            explanation: "* joker karakteri sıfır veya daha fazla herhangi karakteri temsil eder. *.txt kalıbı .txt ile biten tüm dosyaları eşler."
        },
        {
            question: "'dosya?.txt' kalıbı hangi dosyayla eşleşir?",
            options: ["dosya.txt", "dosya12.txt", "dosyaA.txt", "dosyalar.txt"],
            correct: 2,
            explanation: "? joker karakteri tam olarak BİR karakter temsil eder. dosya?.txt: dosya + herhangi tek karakter + .txt"
        },
        {
            question: "'{1..5}' brace expansion sonucu nedir?",
            options: ["1..5", "1 2 3 4 5", "15", "Hata verir"],
            correct: 1,
            explanation: "{1..5} brace expansion 1 2 3 4 5 şeklinde genişler. Ardışık sayı veya harf dizileri üretir."
        },
        {
            question: "'cp dosya.txt{,.bak}' komutu ne yapar?",
            options: ["Dosyayı siler", "dosya.txt'yi dosya.txt.bak olarak kopyalar", "Hata verir", "İki dosya oluşturur"],
            correct: 1,
            explanation: "Brace expansion: dosya.txt{,.bak} → dosya.txt dosya.txt.bak. Yani cp dosya.txt dosya.txt.bak çalışır."
        },
        {
            question: "'shopt -s globstar' açıldıktan sonra '**/*.py' ne yapar?",
            options: ["Sadece mevcut dizindeki .py dosyalarını eşler", "Tüm alt dizinler dahil tüm .py dosyalarını özyinelemeli eşler", "Hata verir", "py uzantılı dosyaları siler"],
            correct: 1,
            explanation: "** (globstar) özyinelemeli glob'dur. **/*.py mevcut dizin ve tüm alt dizinlerdeki .py dosyalarını eşler."
        }
    ]
});
