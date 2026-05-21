// ===== Bölüm 27: Hızlı Arama ve Ek Araçlar =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 27,
    title: 'Hızlı Arama ve Ek Araçlar',
    subtitle: 'locate, less, diff & find vs locate',
    icon: '🔎',
    description: 'find vs locate/updatedb, less ile sayfalı okuma, diff ile dosya karşılaştırma.',
    content: `
<h2>find vs locate — Hangisi Ne Zaman?</h2>
<div class="info-box tip">
    <div class="info-box-title">💡 Bölüm 5 hatırlatma</div>
    Bölüm 5'te <code>find</code> derinlemesine işlendi — izin, tarih, <code>-exec</code> ile. <code>locate</code> ise <strong>hızlı isim araması</strong> için; farklı bir yaklaşım kullanır.
</div>

<table>
    <tr><th></th><th>find</th><th>locate</th></tr>
    <tr><td>Hız</td><td>Canlı tarama — büyük diskte yavaş</td><td>Önceden indekslenmiş DB — çok hızlı</td></tr>
    <tr><td>Güncellik</td><td>Anlık (diskteki gerçek durum)</td><td>DB güncel değilse eski sonuç</td></tr>
    <tr><td>Kriter</td><td>İzin, boyut, tarih, tür</td><td>Çoğunlukla dosya adı/desen</td></tr>
    <tr><td>Root</td><td><code>/</code> taramak için sudo gerekebilir</td><td>Genelde kullanıcı dizinleri hızlı</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>Aynı iş — iki yol</span></div>
    <pre><code><span class="comment"># "nginx.conf nerede?" — locate (hızlı, DB'ye bağlı):</span>
<span class="prompt">$</span> <span class="command">locate</span> <span class="argument">nginx.conf</span>

<span class="comment"># find (yavaş, güncel, kriter zengin):</span>
<span class="prompt">$</span> <span class="command">sudo find</span> <span class="path">/</span> <span class="argument">-name "nginx.conf" 2&gt;/dev/null</span>

<span class="comment"># Son 7 günde değişen .log dosyaları — sadece find:</span>
<span class="prompt">$</span> <span class="command">find</span> <span class="path">/var/log</span> <span class="argument">-name "*.log" -mtime -7</span></code></pre>
</div>

<h2>locate ve updatedb</h2>
<div class="eng-box">
    <div class="eng-title">🔤 Terim</div>
    <div class="eng-content">
        <span class="eng-word">locate</span> — <code>mlocate</code> veritabanında dosya adı arar.<br>
        <span class="eng-word">updatedb</span> — Veritabanını yeniden oluşturur (genelde günlük cron ile).
    </div>
</div>
<div class="code-block">
    <div class="code-block-header"><span>locate kullanımı</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">locate</span> <span class="argument">nginx.conf</span>
<span class="prompt">$</span> <span class="command">locate</span> <span class="argument">*.pdf</span> <span class="argument">|</span> <span class="command">head</span>

<span class="comment"># Sonuç yoksa DB güncel olmayabilir:</span>
<span class="prompt">$</span> <span class="command">sudo updatedb</span>

<span class="comment"># Büyük/küçük harf duyarsız:</span>
<span class="prompt">$</span> <span class="command">locate</span> <span class="argument">-i readme</span>

<span class="comment"># Sadece mevcut dosyalar (silinmişleri gösterme):</span>
<span class="prompt">$</span> <span class="command">locate</span> <span class="argument">-e</span> <span class="argument">proje.py</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 locate kurulum ve updatedb</div>
    Debian/Ubuntu: <code>sudo apt install plocate</code> (mlocate'in hızlı halefi). Kurulumdan sonra:<br>
    <code>sudo updatedb</code> — indeksi oluşturur/günceller.<br>
    Günlük cron genelde gece çalışır; yeni dosya hemen çıkmazsa manuel <code>updatedb</code> gerekir.<br>
    Yapılandırma: <code>/etc/updatedb.conf</code> — <code>PRUNEPATHS</code> ile <code>/tmp</code>, <code>/proc</code> gibi dizinler indeks dışı bırakılır (performans).
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ locate güvenlik notu</div>
    <code>locate</code> tüm indekslenmiş dosya yollarını gösterir — izin kontrolü yapmaz. Hassas yolların listelenmesi bilgi sızdırabilir. Production'da find + izin filtreleri tercih edilebilir.
</div>

<h2>less — Sayfalı Okuma</h2>
<p>Uzun dosyaları ve komut çıktılarını <code>cat</code> ile değil <code>less</code> ile okuyun — kaydırma, arama, geriye gitme mümkün. <code>man</code>, <code>git log</code> varsayılan olarak less (veya pager) kullanır.</p>
<div class="code-block">
    <div class="code-block-header"><span>less kısayolları</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">less</span> <span class="path">uzun_dosya.log</span>
<span class="prompt">$</span> <span class="command">less -N</span> <span class="path">script.sh</span>     <span class="comment"># satır numaraları</span>
<span class="prompt">$</span> <span class="command">less -S</span> <span class="path">genis_tablo.txt</span>  <span class="comment"># satır kırma — yatay kaydır</span>
<span class="prompt">$</span> <span class="command">man ls</span>
<span class="prompt">$</span> <span class="command">ls -la /usr/bin</span> <span class="argument">|</span> <span class="command">less</span>

<span class="comment"># less içinde:</span>
<span class="comment">#  Space / f  — sayfa aşağı</span>
<span class="comment">#  b          — sayfa yukarı</span>
<span class="comment">#  j / k      — satır aşağı / yukarı</span>
<span class="comment">#  /kelime    — ileri arama (n = sonraki, N = önceki)</span>
<span class="comment">#  ?kelime    — geri arama</span>
<span class="comment">#  g / G      — dosya başı / sonu</span>
<span class="comment">#  F          — tail -f gibi canlı takip (less +F ile başlat)</span>
<span class="comment">#  q          — çık</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 cat vs less</div>
    <code>cat</code> küçük dosyalar ve pipe için. 100+ satır veya bilinmeyen boyut → <code>less</code>. Log izleme: <code>less +F dosya.log</code> (Ctrl+C duraklat, F ile tekrar follow).
</div>

<h2>diff — Dosya Karşılaştırma</h2>
<p><code>diff</code> çıktısını okumak Git ve patch için temel beceridir:</p>
<div class="code-block">
    <div class="code-block-header"><span>diff çıktısı</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">diff</span> <span class="path">eski.txt</span> <span class="path">yeni.txt</span>
<span class="output">2c2
&lt; eski satır
---
&gt; yeni satır</span>
<span class="comment"># &lt; = sadece eski dosyada, &gt; = sadece yeni dosyada</span>
<span class="comment"># c = change, a = append, d = delete</span></code></pre>
</div>
<div class="code-block">
    <div class="code-block-header"><span>diff örnekleri</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">diff -u</span> <span class="path">eski.conf</span> <span class="path">yeni.conf</span>
<span class="comment"># unified format — patch ve Git benzeri (+ ekleme, - silme)</span>

<span class="prompt">$</span> <span class="command">diff -rq</span> <span class="path">klasor1/</span> <span class="path">klasor2/</span>
<span class="comment"># İki dizini özet karşılaştır — sadece farklı dosyaları listeler</span>

<span class="prompt">$</span> <span class="command">diff -u eski.conf yeni.conf</span> <span class="argument">&gt;</span> <span class="path">degisiklik.patch</span>
<span class="prompt">$</span> <span class="command">patch</span> <span class="path">eski.conf</span> <span class="argument">&lt;</span> <span class="path">degisiklik.patch</span>
<span class="comment"># patch ile değişikliği uygula</span>

<span class="comment"># Bölüm 11 — komut çıktılarını karşılaştır:</span>
<span class="prompt">$</span> <span class="command">diff</span> <span class="argument">&lt;(ls -1 eski/)</span> <span class="argument">&lt;(ls -1 yeni/)</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 cmp ve sdiff</div>
    <code>cmp dosya1 dosya2</code> — ikili dosyalar; ilk farklı byte'ı gösterir. <code>cmp -s</code> sessiz (exit code 0=aynı, 1=farklı).<br>
    <code>sdiff dosya1 dosya2</code> — iki dosyayı yan yana gösterir (interaktif birleştirme için).
</div>

<h2>Pratik: Config dosyası nerede?</h2>
<div class="code-block">
    <div class="code-block-header"><span>Tipik iş akışı</span></div>
    <pre><code><span class="comment"># 1) Hızlı bul:</span>
<span class="prompt">$</span> <span class="command">locate</span> <span class="argument">postgresql.conf</span>

<span class="comment"># 2) Paket hangi dosyaları kurdu (Bölüm 20):</span>
<span class="prompt">$</span> <span class="command">dpkg -L postgresql</span> <span class="argument">|</span> <span class="command">grep conf</span>

<span class="comment"># 3) Değişiklik öncesi yedek + diff:</span>
<span class="prompt">$</span> <span class="command">sudo cp</span> <span class="path">/etc/nginx/nginx.conf</span> <span class="path">/etc/nginx/nginx.conf.bak</span>
<span class="comment"># ... düzenle ...</span>
<span class="prompt">$</span> <span class="command">diff -u</span> <span class="path">/etc/nginx/nginx.conf.bak</span> <span class="path">/etc/nginx/nginx.conf</span></code></pre>
</div>

<h2>Linux CLI Yolculuğu — Sırada Ne Var?</h2>
<div class="info-box tip">
    <div class="info-box-title">💡 Bölüm 28'ten itibaren: Docker</div>
    ch0–27 ile temel Linux komut satırını tamamladınız. <strong>Bölüm 28</strong>'den itibaren konteynerler (Docker), ardından CI/CD ve Kubernetes gelir. Öğrendikleriniz (SSH, curl, tar, log, disk) production ortamında doğrudan kullanılacak.
</div>
`,
    quiz: [
        {
            question: "locate komutu neden find'den hızlı olabilir?",
            options: [
                "Önceden oluşturulmuş bir dosya adı veritabanını sorgular",
                "Sadece /tmp tarar",
                "GPU kullanır",
                "Dosyaları RAM'e kopyalar"
            ],
            correct: 0,
            explanation: "updatedb ile periyodik indekslenir; locate bu DB'de arama yapar — canlı disk taraması yapmaz."
        },
        {
            question: "Yeni oluşturulan dosya locate ile bulunmuyorsa ne yapılır?",
            options: ["sudo updatedb", "reboot", "chmod 777 /", "rm /var/lib/mlocate"],
            correct: 0,
            explanation: "Veritabanı güncellenmemiş olabilir; updatedb indeksi yeniler."
        },
        {
            question: "less içinde arama yapmak için hangi tuş kullanılır?",
            options: ["/kelime", "Ctrl+F", "Tab", "Esc"],
            correct: 0,
            explanation: "/ ile ileri yönde arama; ? ile geri yönde arama yapılır."
        },
        {
            question: "diff -u ne sağlar?",
            options: ["Unified (birleşik) fark formatı", "Sadece binary karşılaştırma", "Dosyaları birleştirir", "Siler"],
            correct: 0,
            explanation: "-u unified diff — patch dosyaları ve Git diff benzeri okunaklı çıktı verir."
        },
        {
            question: "find mtime -7 ile locate arasındaki fark hangi senaryoda ortaya çıkar?",
            options: [
                "Son 7 günde değişen dosyaları bulmak sadece find ile mümkün",
                "locate tarih filtresi her zaman daha doğrudur",
                "find sadece /tmp tarar",
                "Fark yoktur"
            ],
            correct: 0,
            explanation: "locate dosya adı indeksine bakar; tarih/boyut/izin gibi kriterler için find şarttır."
        }
    ]
});
