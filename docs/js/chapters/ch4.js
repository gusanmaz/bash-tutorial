// ===== Bölüm 4: Kılavuz Sayfaları =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 4,
    title: 'Kılavuz Sayfaları',
    subtitle: 'Manual Pages',
    icon: '📖',
    description: 'Linux komutlarının kılavuz sayfalarını kullanın, --help, man, info ve modern yardım araçları.',
    content: `
<h2>man — Kılavuz Sayfaları</h2>
<p>Her Linux komutunun bir <strong>kılavuz sayfası (manual page)</strong> vardır. Bu kılavuzlar, komutun ne yaptığını, seçeneklerini ve kullanım örneklerini içerir. <code>man</code> komutu, Linux'un dahili ansiklopedisidir.</p>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">man</span> = <span class="eng-meaning">Manual</span> — "Kılavuz". Komutların resmi belgelerini (documentation) görüntüler. Linux'un dahili yardım sistemidir.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>man kullanımı</span>
        <button class="try-btn" onclick="runInTerminal('man ls')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">kullanici@linux:~$</span> <span class="command">man</span> <span class="argument">ls</span>
<span class="comment"># ls komutunun kılavuz sayfasını açar</span>

<span class="prompt">kullanici@linux:~$</span> <span class="command">man</span> <span class="argument">grep</span>
<span class="comment"># grep komutunun kılavuz sayfasını açar</span></code></pre>
</div>

<h2>Kılavuz Sayfasının Yapısı</h2>
<table>
    <tr><th>Bölüm</th><th>İngilizce</th><th>Açıklama</th></tr>
    <tr><td>İSİM</td><td>NAME</td><td>Komutun adı ve kısa açıklaması</td></tr>
    <tr><td>ÖZET</td><td>SYNOPSIS</td><td>Komutun söz dizimi (syntax). Nasıl kullanılacağını gösterir.</td></tr>
    <tr><td>AÇIKLAMA</td><td>DESCRIPTION</td><td>Detaylı açıklama ve tüm seçenekler</td></tr>
    <tr><td>SEÇENEKLER</td><td>OPTIONS</td><td>Kullanılabilecek tüm bayraklar ve açıklamaları</td></tr>
    <tr><td>ÖRNEKLER</td><td>EXAMPLES</td><td>Kullanım örnekleri (her sayfada olmayabilir)</td></tr>
    <tr><td>ÇIKIŞ KODU</td><td>EXIT STATUS</td><td>Komutun döndürdüğü hata kodları</td></tr>
    <tr><td>İLGİLİ</td><td>SEE ALSO</td><td>İlişkili komutlar ve sayfalar</td></tr>
</table>

<h3>Synopsis (Söz Dizimi) Okumak</h3>
<div class="code-block">
    <div class="code-block-header"><span>Synopsis nasıl okunur</span></div>
    <pre><code><span class="output">ls [SEÇENEK]... [DOSYA]...</span>

<span class="comment"># [ ] = isteğe bağlı (optional) — kullanılmasa da olur</span>
<span class="comment"># ... = birden fazla olabilir (ellipsis)</span>
<span class="comment"># BÜYÜK HARF = sizin değiştireceğiniz kısım (placeholder)</span>
<span class="comment"># | = veya (alternatifler)</span>
<span class="comment"># { } = birini seçmelisiniz (required choice)</span>

<span class="output">cp [SEÇENEK]... KAYNAK... HEDEF</span>
<span class="comment"># KAYNAK ve HEDEF zorunlu (köşeli parantez yok)</span>
<span class="comment"># KAYNAK... birden fazla olabilir: cp a.txt b.txt c.txt hedef/</span></code></pre>
</div>

<h2>man Sayfasında Gezinme</h2>
<table>
    <tr><th>Tuş</th><th>İşlev</th></tr>
    <tr><td><code>Space</code> veya <code>f</code></td><td>Bir sayfa ileri (forward)</td></tr>
    <tr><td><code>b</code></td><td>Bir sayfa geri (backward)</td></tr>
    <tr><td><code>↑ / ↓</code></td><td>Satır satır gezinme</td></tr>
    <tr><td><code>/kelime</code></td><td>İleri arama</td></tr>
    <tr><td><code>?kelime</code></td><td>Geriye arama</td></tr>
    <tr><td><code>n</code></td><td>Sonraki arama sonucu (next)</td></tr>
    <tr><td><code>N</code></td><td>Önceki arama sonucu</td></tr>
    <tr><td><code>g</code></td><td>Sayfanın başına git</td></tr>
    <tr><td><code>G</code></td><td>Sayfanın sonuna git</td></tr>
    <tr><td><code>q</code></td><td>Çık (quit)</td></tr>
</table>

<h2>man Sayfası Bölümleri (Sections)</h2>
<p>man sayfaları 8 numaralı bölüme ayrılmıştır:</p>
<table>
    <tr><th>Bölüm</th><th>İçerik</th></tr>
    <tr><td>1</td><td>Kullanıcı komutları (en çok kullanacağınız)</td></tr>
    <tr><td>2</td><td>Sistem çağrıları (C programcıları için)</td></tr>
    <tr><td>3</td><td>Kütüphane fonksiyonları</td></tr>
    <tr><td>4</td><td>Özel dosyalar (/dev altındakiler)</td></tr>
    <tr><td>5</td><td>Dosya biçimleri (/etc/passwd gibi)</td></tr>
    <tr><td>6</td><td>Oyunlar</td></tr>
    <tr><td>7</td><td>Çeşitli (genel bilgi)</td></tr>
    <tr><td>8</td><td>Sistem yönetim komutları (root gerektirenler)</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>Bölüm belirterek man kullanma</span></div>
    <pre><code><span class="comment"># printf hem bir komut (bölüm 1) hem bir C fonksiyonu (bölüm 3)</span>
<span class="prompt">$</span> <span class="command">man</span> <span class="argument">1</span> <span class="path">printf</span>   <span class="comment"># Bash komutu olarak</span>
<span class="prompt">$</span> <span class="command">man</span> <span class="argument">3</span> <span class="path">printf</span>   <span class="comment"># C fonksiyonu olarak</span></code></pre>
</div>

<h2>Kılavuz Sayfalarında Arama</h2>

<div class="code-block">
    <div class="code-block-header"><span>man -k ile anahtar kelime arama</span></div>
    <pre><code><span class="comment"># Anahtar kelime araması (apropos ile aynı):</span>
<span class="prompt">$</span> <span class="command">man -k</span> <span class="string">copy</span>
<span class="comment"># -k = keyword (anahtar kelime). "copy" içeren tüm man sayfalarını listeler</span>
<span class="output">cp (1)     - copy files and directories
scp (1)    - secure copy (remote file copy program)
install (1) - copy files and set attributes</span>

<span class="comment"># apropos komutu aynı işi yapar:</span>
<span class="prompt">$</span> <span class="command">apropos</span> <span class="string">"list directory"</span></code></pre>
</div>

<h2>Diğer Yardım Kaynakları</h2>

<h3>--help Seçeneği</h3>
<p>Neredeyse her komut <code>--help</code> seçeneğini destekler. man sayfasından daha kısa ve öz bilgi verir.</p>
<div class="code-block">
    <div class="code-block-header"><span>--help kullanımı</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">ls</span> <span class="argument">--help</span>
<span class="prompt">$</span> <span class="command">grep</span> <span class="argument">--help</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">--help</span>
<span class="comment"># Hızlı bir özet için idealdir</span></code></pre>
</div>

<h3>whatis — Tek Satırlık Açıklama</h3>
<div class="code-block">
    <div class="code-block-header"><span>whatis komutu</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">whatis</span> ls
<span class="output">ls (1)    - list directory contents</span>
<span class="prompt">$</span> <span class="command">whatis</span> grep
<span class="output">grep (1)  - print lines that match patterns</span>

<span class="comment"># man -f aynı işi yapar:</span>
<span class="prompt">$</span> <span class="command">man -f</span> ls
<span class="output">ls (1)    - list directory contents</span></code></pre>
</div>

<h3>info — GNU Bilgi Sayfaları</h3>
<p><code>info</code> komutu, GNU projesi yazılımları için man sayfalarından daha detaylı belgeler sunar. Hiperlink benzeri navigasyonla bölümler arası gezinebilirsiniz.</p>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">info</span> = <span class="eng-meaning">Information</span> — GNU'nun alternatif belge sistemi. man'dan daha detaylı, kitap formatında organize edilmiştir.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>info kullanımı</span></div>
    <pre><code><span class="comment"># coreutils (ls, cp, mv...) için detaylı info sayfası</span>
<span class="prompt">$</span> <span class="command">info</span> <span class="argument">coreutils</span>

<span class="comment"># Belirli bir komut</span>
<span class="prompt">$</span> <span class="command">info</span> <span class="argument">ls</span>
<span class="prompt">$</span> <span class="command">info</span> <span class="argument">grep</span>

<span class="comment"># Navigasyon:</span>
<span class="comment"># n = next node (sonraki bölüm)</span>
<span class="comment"># p = previous node (önceki bölüm)</span>
<span class="comment"># u = up (üst bölüme git)</span>
<span class="comment"># Enter = link takip et</span>
<span class="comment"># q = quit (çıkış)</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 man vs info</div>
    <code>man</code> evrenseldir — her Unix/Linux komutunda bulunur.<br>
    <code>info</code> GNU araçları için daha detaylı belgeler sunar (örnekler, öğretici içerik).<br>
    Bazı komutlarda <code>info</code> sayfası <code>man</code> sayfasından çok daha kapsamlıdır — özellikle <code>info coreutils</code>, <code>info bash</code>, <code>info grep</code>.
</div>

<h3>type — Komut Türünü Öğren</h3>
<div class="code-block">
    <div class="code-block-header"><span>type komutu</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">type</span> cd
<span class="output">cd is a shell builtin</span>   <span class="comment"># Dahili kabuk komutu</span>
<span class="prompt">$</span> <span class="command">type</span> ls
<span class="output">ls is /usr/bin/ls</span>       <span class="comment"># Harici program</span>
<span class="prompt">$</span> <span class="command">type</span> ll
<span class="output">ll is aliased to 'ls -l'</span> <span class="comment"># Alias (takma ad)</span></code></pre>
</div>

<h3>which — Komutun Konumu</h3>
<div class="code-block">
    <div class="code-block-header">
        <span>which komutu</span>
        <button class="try-btn" onclick="runInTerminal('which ls')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">$</span> <span class="command">which</span> python3
<span class="output">/usr/bin/python3</span>
<span class="prompt">$</span> <span class="command">which</span> ls
<span class="output">/usr/bin/ls</span></code></pre>
</div>

<h3>Modern Alternatif: tldr</h3>
<p><code>tldr</code> (Too Long; Didn't Read) topluluk tarafından oluşturulmuş, örneklerle dolu pratik kılavuzlar sunar.</p>
<div class="code-block">
    <div class="code-block-header"><span>tldr kurulum ve kullanım</span></div>
    <pre><code><span class="comment"># Kurulum:</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> tldr   <span class="comment"># veya npm install -g tldr</span>

<span class="comment"># Kullanım — man'dan çok daha pratik!</span>
<span class="prompt">$</span> <span class="command">tldr</span> tar
<span class="comment"># tar komutunun en yaygın kullanımlarını örneklerle gösterir</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 İpucu: Yardım Hiyerarşisi</div>
    <ol>
        <li><code>komut --help</code> — Hızlı hatırlatma</li>
        <li><code>tldr komut</code> — Örneklerle pratik kullanım</li>
        <li><code>man komut</code> — Detaylı resmi belge</li>
        <li>İnternet araması — Stack Overflow, ArchWiki</li>
    </ol>
</div>
`,
    quiz: [
        {
            question: "'man' komutunun açılımı nedir?",
            options: ["Manager", "Manual", "Mandatory", "Manipulate"],
            correct: 1,
            explanation: "man = Manual (Kılavuz). Linux'un dahili yardım sistemidir."
        },
        {
            question: "man sayfasında arama yapmak için hangi tuş kullanılır?",
            options: ["Ctrl+F", "/ (eğik çizgi)", "s tuşu", "f tuşu"],
            correct: 1,
            explanation: "man sayfasında / tuşuna basıp aranacak kelimeyi yazarsınız. n ile sonraki eşleşmeye gidersiniz."
        },
        {
            question: "ls [SEÇENEK]... [DOSYA]... söz diziminde [ ] ne anlama gelir?",
            options: ["Zorunlu", "İsteğe bağlı (optional)", "Tekrarlanamaz", "Sadece bir kez kullanılır"],
            correct: 1,
            explanation: "Köşeli parantez [ ] içindeki parametreler isteğe bağlıdır (optional). Kullanılmayabilir."
        },
        {
            question: "'man -k copy' komutu ne yapar?",
            options: ["copy komutunun kılavuzunu açar", "Tüm kılavuzlarda 'copy' kelimesini arar", "Dosya kopyalar", "man sayfasını kopyalar"],
            correct: 1,
            explanation: "-k (keyword) tüm man sayfalarının açıklamalarında anahtar kelime araması yapar."
        },
        {
            question: "Bir komutun dahili mi, harici mi olduğunu hangi komutla öğrenirsiniz?",
            options: ["which", "type", "file", "man"],
            correct: 1,
            explanation: "'type' komutu, bir komutun shell builtin (dahili), alias (takma ad) veya harici program mı olduğunu söyler."
        }
    ]
});
