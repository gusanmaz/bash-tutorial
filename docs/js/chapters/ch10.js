// ===== Bölüm 10: Grep ve Düzenli İfadeler =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 10,
    title: 'Grep ve Düzenli İfadeler',
    subtitle: 'Grep and Regular Expressions',
    icon: '🔎',
    description: 'Güçlü kalıp eşleme aracı grep ve düzenli ifadeler (regex). Metin arama sanatı.',
    content: `
<h2>grep — En Güçlü Arama Aracı</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">grep</span> = <span class="eng-meaning">Global Regular Expression Print</span> — "Genel Düzenli İfade Yazdırma". Dosyalarda belirli bir kalıba uyan satırları bulup yazdırır. 1973'ten beri Unix'in vazgeçilmez aracı.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>grep temel kullanımı</span>
        <button class="try-btn" onclick="runInTerminal('grep Linux Belgeler/rapor.txt')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># "Linux" kelimesini dosyada ara</span>
<span class="prompt">$</span> <span class="command">grep</span> <span class="string">"Linux"</span> <span class="path">Belgeler/rapor.txt</span>

<span class="comment"># Büyük/küçük harf duyarsız arama</span>
<span class="prompt">$</span> <span class="command">grep -i</span> <span class="string">"linux"</span> <span class="path">Belgeler/rapor.txt</span>

<span class="comment"># Satır numaralarıyla</span>
<span class="prompt">$</span> <span class="command">grep -n</span> <span class="string">"dosya"</span> <span class="path">Belgeler/rapor.txt</span>

<span class="comment"># Eşleşme sayısı</span>
<span class="prompt">$</span> <span class="command">grep -c</span> <span class="string">"bir"</span> <span class="path">Belgeler/rapor.txt</span></code></pre>
</div>

<h3>grep'in Önemli Seçenekleri</h3>
<table>
    <tr><th>Seçenek</th><th>İngilizce</th><th>Açıklama</th></tr>
    <tr><td><code>-i</code></td><td>Ignore case</td><td>Harf duyarsız arama</td></tr>
    <tr><td><code>-n</code></td><td>Number</td><td>Satır numaralarını göster</td></tr>
    <tr><td><code>-c</code></td><td>Count</td><td>Eşleşen satır sayısı</td></tr>
    <tr><td><code>-v</code></td><td>Invert</td><td>Eşleş<strong>meyen</strong> satırları göster</td></tr>
    <tr><td><code>-r</code></td><td>Recursive</td><td>Dizinlerde özyinelemeli ara</td></tr>
    <tr><td><code>-l</code></td><td>List files</td><td>Eşleşen dosya adlarını göster (içeriği değil)</td></tr>
    <tr><td><code>-w</code></td><td>Word</td><td>Tam kelime eşleşmesi</td></tr>
    <tr><td><code>-A n</code></td><td>After</td><td>Eşleşen satır + sonraki n satır</td></tr>
    <tr><td><code>-B n</code></td><td>Before</td><td>Eşleşen satır + önceki n satır</td></tr>
    <tr><td><code>-C n</code></td><td>Context</td><td>Eşleşen satır + önce/sonra n satır</td></tr>
    <tr><td><code>-E</code></td><td>Extended regex</td><td>Genişletilmiş regex (egrep)</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>Gelişmiş grep örnekleri</span></div>
    <pre><code><span class="comment"># Tüm .txt dosyalarında "hata" kelimesini ara:</span>
<span class="prompt">$</span> <span class="command">grep -r</span> <span class="string">"hata"</span> <span class="path">.</span> <span class="argument">--include="*.txt"</span>

<span class="comment"># "hata" geçMEYEN satırları göster (ters eşleşme):</span>
<span class="prompt">$</span> <span class="command">grep -v</span> <span class="string">"yorum"</span> <span class="path">kod.py</span>

<span class="comment"># Eşleşme + bağlam (3 satır önce ve sonra):</span>
<span class="prompt">$</span> <span class="command">grep -C 3</span> <span class="string">"ERROR"</span> <span class="path">log.txt</span>

<span class="comment"># Tam kelime eşleşmesi (alt dizeler hariç):</span>
<span class="prompt">$</span> <span class="command">grep -w</span> <span class="string">"is"</span> <span class="path">metin.txt</span>
<span class="comment"># "is" bulur ama "this" veya "island" BULMAZ</span></code></pre>
</div>

<h3>grep Varyantları: -F, -P, -o</h3>

<div class="code-block">
    <div class="code-block-header"><span>grep -F, -P ve -o kullanımı</span></div>
    <pre><code><span class="comment"># -F (Fixed strings / fgrep): regex KULLANMA, literal ara</span>
<span class="comment"># Özel karakterler içeren metni güvenle arayın:</span>
<span class="prompt">$</span> <span class="command">grep -F</span> <span class="string">"arr[0]"</span> <span class="path">kod.js</span>
<span class="comment"># Regex olarak [0] bir karakter sınıfı olurdu; -F literal arar</span>

<span class="prompt">$</span> <span class="command">grep -F</span> <span class="string">"$price"</span> <span class="path">dosya.txt</span>
<span class="comment"># $ regex'te satır sonu demek; -F ile literal $ arar</span>

<span class="comment"># -o (Only matching): sadece eşleşen kısmı göster</span>
<span class="prompt">$</span> <span class="command">grep -oE</span> <span class="string">'[0-9]+'</span> <span class="path">metin.txt</span>
<span class="comment"># Sadece sayıları çıktı olarak verir (her satırdan birini)</span>
<span class="output">42</span>
<span class="output">100</span>
<span class="output">7</span>

<span class="comment"># IP adreslerini dosyadan çıkart:</span>
<span class="prompt">$</span> <span class="command">grep -oE</span> <span class="string">'[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}'</span> <span class="path">log.txt</span>

<span class="comment"># -P (Perl regex): Perl uyumlu regex, daha güçlü özellikler</span>
<span class="prompt">$</span> <span class="command">grep -P</span> <span class="string">'\\d{3}-\\d{4}'</span> <span class="path">telefon.txt</span>
<span class="comment"># \\d = [0-9], Perl regex kısaltması</span>

<span class="comment"># Lookahead/lookbehind (Perl regex özel):</span>
<span class="prompt">$</span> <span class="command">grep -Po</span> <span class="string">'(?<=price: )\\d+'</span> <span class="path">data.txt</span>
<span class="comment"># "price: " sonrasındaki sayıyı yakalar ama "price: " kısmını dahil etmez</span></code></pre>
</div>

<h3>--color ve Çıktı Renklendirme</h3>
<div class="code-block">
    <div class="code-block-header"><span>grep --color</span></div>
    <pre><code><span class="comment"># Eşleşmeleri renkli göster (çoğu sistemde varsayılan):</span>
<span class="prompt">$</span> <span class="command">grep --color=auto</span> <span class="string">"ERROR"</span> <span class="path">log.txt</span>

<span class="comment"># Pipe içinde renk korumak için:</span>
<span class="prompt">$</span> <span class="command">grep --color=always</span> <span class="string">"ERROR"</span> <span class="path">log.txt</span> | <span class="command">head</span>

<span class="comment"># Kalıcı yapmak (~/.bashrc):</span>
<span class="prompt">$</span> <span class="command">alias</span> grep='grep --color=auto'</code></pre>
</div>

<h2>Düzenli İfadeler (Regular Expressions / Regex)</h2>
<p>Düzenli ifadeler, metin kalıplarını tanımlamak için kullanılan güçlü bir dildir. Sadece grep'te değil, neredeyse <strong>tüm programlama dillerinde</strong> kullanılır.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">Regular Expression (Regex)</span> = <span class="eng-meaning">Düzenli İfade</span> — Metin içinde kalıp eşleme yapmak için kullanılan özel söz dizimi.
    </div>
</div>

<h3>Temel Regex Karakterleri</h3>
<table>
    <tr><th>Karakter</th><th>İngilizce</th><th>Anlamı</th><th>Örnek</th></tr>
    <tr><td><code>.</code></td><td>Dot (Any)</td><td>Herhangi tek karakter</td><td><code>d.rt</code> → dart, dert, dört</td></tr>
    <tr><td><code>^</code></td><td>Caret (Start)</td><td>Satır başı</td><td><code>^Linux</code> → "Linux" ile başlayan satırlar</td></tr>
    <tr><td><code>$</code></td><td>Dollar (End)</td><td>Satır sonu</td><td><code>nokta$</code> → "nokta" ile biten satırlar</td></tr>
    <tr><td><code>*</code></td><td>Star (Zero+)</td><td>Önceki karakter 0 veya daha fazla</td><td><code>ab*c</code> → ac, abc, abbc</td></tr>
    <tr><td><code>+</code></td><td>Plus (One+)</td><td>Önceki karakter 1 veya daha fazla</td><td><code>ab+c</code> → abc, abbc (ac değil)</td></tr>
    <tr><td><code>?</code></td><td>Question (Optional)</td><td>Önceki karakter 0 veya 1</td><td><code>colou?r</code> → color, colour</td></tr>
    <tr><td><code>[ ]</code></td><td>Bracket (Class)</td><td>Karakter sınıfı</td><td><code>[aeiou]</code> → herhangi sesli harf</td></tr>
    <tr><td><code>[^ ]</code></td><td>Negated class</td><td>Olumsuz karakter sınıfı</td><td><code>[^0-9]</code> → rakam olmayan</td></tr>
    <tr><td><code>|</code></td><td>Pipe (OR)</td><td>Veya (alternation)</td><td><code>evet|hayır</code> → evet veya hayır</td></tr>
    <tr><td><code>( )</code></td><td>Group</td><td>Gruplama</td><td><code>(ab)+</code> → ab, abab, ababab</td></tr>
    <tr><td><code>{n,m}</code></td><td>Quantifier</td><td>n ile m arasında tekrar</td><td><code>a{2,4}</code> → aa, aaa, aaaa</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 grep vs grep -E (egrep)</div>
    Temel grep'te <code>+</code>, <code>?</code>, <code>|</code>, <code>()</code>, <code>{}</code> literal karakterdir. Regex anlamında kullanmak için <code>\\+</code> gibi kaçış gerekir. <code>grep -E</code> (veya <code>egrep</code>) genişletilmiş regex kullanır — kaçış gerekmez. <strong>Önerim: her zaman <code>grep -E</code> kullanın.</strong>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Regex örnekleri</span></div>
    <pre><code><span class="comment"># "komut" ile başlayan satırları bul:</span>
<span class="prompt">$</span> <span class="command">grep</span> <span class="string">'^komut'</span> <span class="path">dosya.txt</span>

<span class="comment"># Sayı içeren satırları bul:</span>
<span class="prompt">$</span> <span class="command">grep</span> <span class="string">'[0-9]'</span> <span class="path">dosya.txt</span>

<span class="comment"># Boş satırları bul:</span>
<span class="prompt">$</span> <span class="command">grep</span> <span class="string">'^$'</span> <span class="path">dosya.txt</span>

<span class="comment"># E-posta adresi kalıbı (basit):</span>
<span class="prompt">$</span> <span class="command">grep -E</span> <span class="string">'[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\\.[a-z]{2,}'</span> <span class="path">metin.txt</span>

<span class="comment"># IP adresi kalıbı (basit):</span>
<span class="prompt">$</span> <span class="command">grep -E</span> <span class="string">'[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}'</span> <span class="path">log.txt</span>

<span class="comment"># "hata" VEYA "uyarı" içeren satırlar:</span>
<span class="prompt">$</span> <span class="command">grep -E</span> <span class="string">'hata|uyarı'</span> <span class="path">log.txt</span></code></pre>
</div>

<h3>Yaygın Karakter Sınıfları</h3>
<table>
    <tr><th>Sınıf</th><th>Eşdeğer</th><th>Anlamı</th></tr>
    <tr><td><code>[[:alpha:]]</code></td><td>[a-zA-Z]</td><td>Herhangi harf</td></tr>
    <tr><td><code>[[:digit:]]</code></td><td>[0-9]</td><td>Herhangi rakam</td></tr>
    <tr><td><code>[[:alnum:]]</code></td><td>[a-zA-Z0-9]</td><td>Harf veya rakam</td></tr>
    <tr><td><code>[[:space:]]</code></td><td>[ \\t\\n]</td><td>Boşluk karakterleri</td></tr>
    <tr><td><code>[[:upper:]]</code></td><td>[A-Z]</td><td>Büyük harf</td></tr>
    <tr><td><code>[[:lower:]]</code></td><td>[a-z]</td><td>Küçük harf</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Regex Öğrenmek Yatırımdır</div>
    Regex sadece grep'te değil, Python, JavaScript, Java, VS Code, sed, awk ve daha birçok araçta kullanılır. Regex öğrenmek <strong>tüm programlama kariyeriniz boyunca</strong> işinize yarar. Online regex test araçları: <strong>regex101.com</strong> (en popüler), <strong>regexr.com</strong>
</div>

<h2>Geri Referanslar (Backreferences)</h2>
<p>Yakalanan bir grubu aynı regex içinde tekrar kullanabilirsiniz:</p>

<div class="code-block">
    <div class="code-block-header"><span>Backreference örnekleri</span></div>
    <pre><code><span class="comment"># Tekrarlanan kelimeleri bul (ör: "the the"):</span>
<span class="prompt">$</span> <span class="command">grep -E</span> <span class="string">'\\b(\\w+)\\s+\\1\\b'</span> <span class="path">metin.txt</span>
<span class="comment"># \\1 = ilk yakalama grubu (\\w+) ile aynı metin</span>

<span class="comment"># HTML tag eşleştirme (açılış-kapanış aynı):</span>
<span class="prompt">$</span> <span class="command">grep -P</span> <span class="string">'<(\\w+)>.*</\\1>'</span> <span class="path">dosya.html</span>
<span class="comment"># <div>...</div>, <span>...</span> gibi eşleşen etiketleri bulur</span>

<span class="comment"># sed ile backreference kullanımı:</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"John Smith"</span> | <span class="command">sed -E</span> <span class="string">'s/(\\w+) (\\w+)/\\2, \\1/'</span>
<span class="output">Smith, John</span></code></pre>
</div>
`,
    quiz: [
        {
            question: "'grep' komutunun açılımı nedir?",
            options: ["Get Regular Expression Pattern", "Global Regular Expression Print", "General Retrieve Expression Pattern", "Grab Regular Expression Parse"],
            correct: 1,
            explanation: "grep = Global Regular Expression Print. Dosyalarda düzenli ifade kalıplarına uyan satırları bulur ve yazdırır."
        },
        {
            question: "'grep -i linux dosya.txt' komutundaki '-i' ne yapar?",
            options: ["Sadece ilk eşleşmeyi gösterir", "Eşleşmeyi tersine çevirir", "Büyük/küçük harf farkını yok sayar", "Satır numarası gösterir"],
            correct: 2,
            explanation: "-i = ignore case (harf duyarsız). 'linux', 'Linux', 'LINUX' hepsini bulur."
        },
        {
            question: "'^Merhaba' regex'i ne anlama gelir?",
            options: ["'Merhaba' kelimesini her yerde bul", "Satır başında 'Merhaba' olan satırları bul", "'^' karakteri ve 'Merhaba' kelimesini bul", "'Merhaba' ile biten satırları bul"],
            correct: 1,
            explanation: "^ (caret) satır başını temsil eder. ^Merhaba = satırın başında 'Merhaba' olan satırlar."
        },
        {
            question: "'grep -v yorum dosya.txt' ne yapar?",
            options: ["Sadece 'yorum' geçen satırları gösterir", "'yorum' geçMEYEN satırları gösterir", "Dosyadaki yorumları siler", "Verbose mod açar"],
            correct: 1,
            explanation: "-v = invert match (ters eşleşme). Kalıba UYMAYAN satırları gösterir."
        },
        {
            question: "'grep -oE \"[0-9]+\" dosya.txt' komutundaki '-o' ne yapar?",
            options: ["Çıktıyı dosyaya yazar", "Tüm satırı değil sadece eşleşen kısmı gösterir", "Büyük/küçük harf duyarsız arar", "Eşleşme sayısını gösterir"],
            correct: 1,
            explanation: "-o (only matching) sadece regex'e eşleşen kısmı çıktı olarak verir, satırın tamamını değil. Veri çıkartma (extraction) için çok kullanışlıdır."
        }
    ]
});
