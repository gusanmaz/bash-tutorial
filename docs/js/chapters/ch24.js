// ===== Bölüm 24: Arşiv ve Sıkıştırma =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 24,
    title: 'Arşiv ve Sıkıştırma',
    subtitle: 'tar, gzip, zip & Compression',
    icon: '📦',
    description: 'tar ile arşiv oluşturma ve açma, gzip/xz/zip sıkıştırma ve yedekleme senaryoları.',
    content: `
<h2>Arşiv vs Sıkıştırma</h2>
<div class="info-box tip">
    <div class="info-box-title">💡 İki farklı işlem</div>
    <strong>Arşiv</strong> = Birden fazla dosyayı tek pakette toplamak (<code>tar</code>).<br>
    <strong>Sıkıştırma</strong> = Veriyi küçültmek (<code>gzip</code>, <code>xz</code>, <code>zip</code>).<br>
    Genelde ikisi birlikte: <code>tar -czf yedek.tar.gz klasor/</code>
</div>

<div class="eng-box">
    <div class="eng-title">🔤 Terim</div>
    <div class="eng-content">
        <span class="eng-word">tar</span> = <span class="eng-meaning">Tape Archive</span> — Dosyaları arşivler (sıkıştırma opsiyonel).<br>
        <span class="eng-word">.tar.gz / .tgz</span> = tar arşivi + gzip sıkıştırması (en yaygın Linux formatı).
    </div>
</div>

<h2>tar — Temel Bayraklar</h2>
<table>
    <tr><th>Bayrak</th><th>Anlam</th></tr>
    <tr><td><code>-c</code></td><td><strong>C</strong>reate — arşiv oluştur</td></tr>
    <tr><td><code>-x</code></td><td>e<strong>X</strong>tract — arşiv aç</td></tr>
    <tr><td><code>-t</code></td><td>lis<strong>T</strong> — içeriği listele (açmadan)</td></tr>
    <tr><td><code>-f</code></td><td><strong>F</strong>ile — arşiv dosya adı (hemen sonra gelmeli)</td></tr>
    <tr><td><code>-z</code></td><td>gzip ile sıkıştır/aç</td></tr>
    <tr><td><code>-J</code></td><td>xz ile sıkıştır/aç</td></tr>
    <tr><td><code>-v</code></td><td>verbose — işlenen dosyaları göster</td></tr>
    <tr><td><code>-C</code></td><td>hedef dizine geç (extract sırasında)</td></tr>
    <tr><td><code>--exclude</code></td><td>Dışarıda bırak (ör. <code>node_modules</code>)</td></tr>
    <tr><td><code>--strip-components=N</code></td><td>Açarken üst N dizin seviyesini atla</td></tr>
    <tr><td><code>-p</code></td><td>İzinleri koru (root yedeklerde)</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Ezber ipucu</div>
    <strong>c</strong>reate, e<strong>x</strong>tract, lis<strong>t</strong> — üç ana işlem. <strong>f</strong>ile her zaman dosya adından hemen önce: <code>-czf dosya.tar.gz</code>
</div>

<div class="code-block">
    <div class="code-block-header"><span>tar örnekleri</span></div>
    <pre><code><span class="comment"># Arşiv oluştur + gzip sıkıştır:</span>
<span class="prompt">$</span> <span class="command">tar -czvf</span> <span class="path">yedek.tar.gz</span> <span class="path">proje/</span>

<span class="comment"># Aç (mevcut dizine):</span>
<span class="prompt">$</span> <span class="command">tar -xzvf</span> <span class="path">yedek.tar.gz</span>

<span class="comment"># Belirli dizine aç:</span>
<span class="prompt">$</span> <span class="command">tar -xzvf</span> <span class="path">yedek.tar.gz</span> <span class="argument">-C</span> <span class="path">/tmp/restore</span>

<span class="comment"># İçeriği listele (açmadan):</span>
<span class="prompt">$</span> <span class="command">tar -tzvf</span> <span class="path">yedek.tar.gz</span>

<span class="comment"># Tek dosya çıkar:</span>
<span class="prompt">$</span> <span class="command">tar -xzvf</span> <span class="path">yedek.tar.gz</span> <span class="path">proje/config.env</span>

<span class="comment"># Sıkıştırmadan arşiv (.tar):</span>
<span class="prompt">$</span> <span class="command">tar -cvf</span> <span class="path">arsiv.tar</span> <span class="path">dosyalar/</span>

<span class="comment"># Yedekten node_modules hariç:</span>
<span class="prompt">$</span> <span class="command">tar -czvf</span> <span class="path">proje.tar.gz</span> <span class="argument">--exclude='*/node_modules'</span> <span class="argument">--exclude='.git'</span> <span class="path">proje/</span>

<span class="comment"># xz ile daha iyi sıkıştırma (daha yavaş):</span>
<span class="prompt">$</span> <span class="command">tar -cJvf</span> <span class="path">yedek.tar.xz</span> <span class="path">veri/</span>

<span class="comment"># Arşiv bütünlüğünü test et (açmadan):</span>
<span class="prompt">$</span> <span class="command">tar -tzvf</span> <span class="path">yedek.tar.gz</span> <span class="argument">&gt;/dev/null</span> <span class="argument">&amp;&amp;</span> <span class="command">echo</span> <span class="string">"OK"</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Tar bomb ve güvenli açma</div>
    Güvenilmeyen <code>.tar.gz</code> dosyalarını açarken dikkat: içinde <code>../../etc/passwd</code> gibi yollar olabilir (path traversal).<br>
    • Önce <code>tar -tzvf arsiv.tar.gz | head</code> ile içeriğe bakın<br>
    • Güvenli dizinde açın: <code>mkdir tmp &amp;&amp; tar -xzf arsiv.tar.gz -C tmp --strip-components=1</code><br>
    • Kök dizine (<code>/</code>) asla körlemesine <code>tar -xzf</code> yapmayın
</div>

<div class="info-box note">
    <div class="info-box-title">📌 -f bayrağının yeri</div>
    <code>-f</code> hemen arşiv dosya adından önce gelmeli: <code>tar -czvf yedek.tar.gz klasor/</code>. Yanlış sıra (ör. <code>tar -cfz</code> eski sürümlerde) beklenmedik davranışa yol açabilir.
</div>

<h2>Sıkıştırma formatları karşılaştırması</h2>
<table>
    <tr><th>Format</th><th>tar bayrağı</th><th>Hız</th><th>Oran</th><th>Not</th></tr>
    <tr><td>gzip (.gz)</td><td><code>-z</code></td><td>Hızlı</td><td>İyi</td><td>En yaygın, günlük yedek</td></tr>
    <tr><td>bzip2 (.bz2)</td><td><code>-j</code></td><td>Orta</td><td>Daha iyi</td><td>Eski arşivlerde</td></tr>
    <tr><td>xz (.xz)</td><td><code>-J</code></td><td>Yavaş</td><td>En iyi</td><td>Uzun süreli arşiv, dağıtım</td></tr>
    <tr><td>zstd (.zst)</td><td><code>--zstd</code></td><td>Çok hızlı</td><td>İyi</td><td>Modern tar sürümlerinde</td></tr>
    <tr><td>zip</td><td>ayrı <code>zip</code></td><td>Orta</td><td>Orta</td><td>Windows uyumu</td></tr>
</table>

<h2>gzip, bzip2, xz</h2>
<div class="code-block">
    <div class="code-block-header"><span>Tek dosya sıkıştırma</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">gzip</span> <span class="path">buyuk.log</span>       <span class="comment"># → buyuk.log.gz (orijinal silinir)</span>
<span class="prompt">$</span> <span class="command">gunzip</span> <span class="path">buyuk.log.gz</span>   <span class="comment"># geri aç</span>

<span class="prompt">$</span> <span class="command">xz</span> <span class="path">rapor.csv</span>          <span class="comment"># daha iyi sıkıştırma, daha yavaş</span>
<span class="prompt">$</span> <span class="command">bzip2</span> <span class="path">veri.txt</span>       <span class="comment"># .bz2 — orta hız/sıkıştırma</span>

<span class="comment"># Orijinali koruyarak sıkıştır:</span>
<span class="prompt">$</span> <span class="command">gzip -k</span> <span class="path">dosya.txt</span></code></pre>
</div>

<h2>zip / unzip — Windows uyumluluğu</h2>
<div class="code-block">
    <div class="code-block-header"><span>zip arşivleri</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">zip -r</span> <span class="path">arsiv.zip</span> <span class="path">klasor/</span>
<span class="prompt">$</span> <span class="command">unzip</span> <span class="path">arsiv.zip</span>
<span class="prompt">$</span> <span class="command">unzip -l</span> <span class="path">arsiv.zip</span>   <span class="comment"># listele</span>

<span class="prompt">$</span> <span class="command">unzip</span> <span class="path">arsiv.zip</span> <span class="path">tek_dosya.txt</span>  <span class="comment"># tek dosya çıkar</span>

<span class="prompt">$</span> <span class="command">zip -r -9</span> <span class="path">buyuk.zip</span> <span class="path">klasor/</span>  <span class="comment"># -9 max sıkıştırma</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 tar.gz vs zip — ne zaman hangisi?</div>
    <strong>Linux sunucu yedek / deploy:</strong> <code>tar.gz</code> veya <code>tar.xz</code> — izinler, symlink korunur.<br>
    <strong>Windows/macOS paylaşım:</strong> <code>zip</code> — evrensel destek.<br>
    <strong>Tek büyük log:</strong> <code>gzip log</code> — hızlı, tek dosya.
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Bölüm 15 extract() fonksiyonu</div>
    Bölüm 15'te <code>~/.bashrc</code>'ye eklenen <code>extract</code> kısayolu bu formatları otomatik tanır. Arkada yine <code>tar</code>, <code>unzip</code>, <code>gunzip</code> çalışır — hangi komutun ne yaptığını bilmek hata ayıklamada şarttır.
</div>

<h2>Pipe ile tar</h2>
<div class="code-block">
    <div class="code-block-header"><span>Uzak yedekleme örneği</span></div>
    <pre><code><span class="comment"># Dizini stdout'a tar'la, gzip'le, dosyaya yaz:</span>
<span class="prompt">$</span> <span class="command">tar -czf -</span> <span class="path">/etc/nginx</span> <span class="argument">&gt;</span> <span class="path">nginx-yedek.tar.gz</span>

<span class="comment"># rsync alternatifi — Bölüm 19 ile birlikte düşünün</span>
<span class="prompt">$</span> <span class="command">tar -czf -</span> <span class="path">./site</span> <span class="argument">|</span> <span class="command">ssh sunucu</span> <span class="string">"cat > /yedek/site.tar.gz"</span>

<span class="comment"># Bölüm 19 rsync ile birlikte — büyük veri: rsync, tek seferlik paket: tar</span></code></pre>
</div>

<h2>Pratik yedekleme tarifleri</h2>
<div class="code-block">
    <div class="code-block-header"><span>3 senaryo</span></div>
    <pre><code><span class="comment"># 1) Ev dizini yedek (hariç tutmalarla):</span>
<span class="prompt">$</span> <span class="command">tar -czvf</span> <span class="path">home-$(date +%F).tar.gz</span> <span class="argument">--exclude='.cache'</span> <span class="argument">--exclude='.local/share/Trash'</span> <span class="argument">-C /home</span> <span class="path">kullanici</span>

<span class="comment"># 2) /etc yapılandırma yedek (sunucu):</span>
<span class="prompt">$</span> <span class="command">sudo tar -czvf</span> <span class="path">etc-yedek.tar.gz</span> <span class="path">/etc</span>

<span class="comment"># 3) Veritabanı dump + arşiv (script içinde):</span>
<span class="prompt">$</span> <span class="command">pg_dump mydb</span> <span class="argument">|</span> <span class="command">gzip</span> <span class="argument">&gt;</span> <span class="path">mydb-$(date +%F).sql.gz</span></code></pre>
</div>

<h2>Özet tablo</h2>
<table>
    <tr><th>İşlem</th><th>Komut</th></tr>
    <tr><td>Oluştur (.tar.gz)</td><td><code>tar -czvf yedek.tar.gz dizin/</code></td></tr>
    <tr><td>Aç</td><td><code>tar -xzvf yedek.tar.gz</code></td></tr>
    <tr><td>Listele</td><td><code>tar -tzvf yedek.tar.gz</code></td></tr>
    <tr><td>Zip oluştur</td><td><code>zip -r arsiv.zip dizin/</code></td></tr>
    <tr><td>Tek dosya gzip</td><td><code>gzip dosya</code></td></tr>
</table>
`,
    quiz: [
        {
            question: "tar -czvf yedek.tar.gz proje/ komutundaki -z ne yapar?",
            options: ["gzip ile sıkıştırır", "Şifreler", "Sadece listeler", "Silme onayı ister"],
            correct: 0,
            explanation: "-z gzip sıkıştırması kullanır. Sonuç .tar.gz formatıdır."
        },
        {
            question: "Arşiv içeriğini açmadan görmek için hangi bayrak kullanılır?",
            options: ["-t", "-x", "-c", "-v"],
            correct: 0,
            explanation: "tar -t (list) arşivdeki dosya listesini gösterir."
        },
        {
            question: "gzip dosya.txt çalıştırıldığında ne olur?",
            options: [
                "dosya.txt.gz oluşur, orijinal dosya.txt silinir",
                "Her iki dosya da kalır",
                "Dosya şifrelenir",
                "Sadece boyut gösterilir"
            ],
            correct: 0,
            explanation: "Varsayılan gzip orijinali siler. Korumak için gzip -k kullanın."
        },
        {
            question: "Windows kullanıcılarıyla paylaşım için en uyumlu format hangisi?",
            options: ["zip", "tar.xz", "bzip2", "cpio"],
            correct: 0,
            explanation: "zip hem Linux'ta hem Windows'ta yerleşik veya kolay açılır."
        },
        {
            question: "tar --exclude='*/node_modules' ne işe yarar?",
            options: [
                "Arşive node_modules klasörlerini dahil etmez",
                "Sadece node_modules arşivler",
                "node_modules'i siler",
                "Şifreler"
            ],
            correct: 0,
            explanation: "--exclude desenle eşleşen dosya/dizinleri arşiv dışında bırakır — yedek boyutunu küçültür."
        },
        {
            question: "Güvenilmeyen arşivi açmadan önce ne yapmalısınız?",
            options: [
                "tar -t ile içeriği listele, şüpheli ../ yollarına dikkat et",
                "Doğrudan sudo tar -xzf / ile aç",
                "chmod 777 arsiv.tar.gz",
                "unzip -o ile zorla aç"
            ],
            correct: 0,
            explanation: "Path traversal saldırılarına karşı önce listele, ayrı dizinde ve --strip-components ile açın."
        }
    ]
});
