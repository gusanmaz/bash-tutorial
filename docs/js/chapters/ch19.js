// ===== Bölüm 19: rsync — Akıllı Dosya Senkronizasyonu =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 19,
    title: 'rsync — Dosya Senkronizasyonu',
    subtitle: 'rsync — Smart File Sync',
    icon: '🔄',
    description: 'rsync ile verimli dosya senkronizasyonu, yedekleme, uzak sunucu transferi, delta algoritması ve pratik yedekleme stratejileri.',
    content: `
<h2>rsync Nedir?</h2>
<p><strong>rsync</strong> (remote sync), dosya ve dizinleri <strong>verimli bir şekilde</strong> senkronize eden güçlü bir araçtır. 1996'da Andrew Tridgell ve Paul Mackerras tarafından geliştirilmiştir. rsync'in özelliği, <strong>sadece değişen kısımları</strong> (delta) aktarmasıdır — bu da onu tekrarlayan transferlerde SCP'den çok daha hızlı yapar.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">rsync</span> = <span class="eng-meaning">Remote Sync</span> — Uzak senkronizasyon.<br>
        <span class="eng-word">Delta Transfer</span> = <span class="eng-meaning">Fark Aktarımı</span> — Sadece değişen byte'ları gönderme.<br>
        <span class="eng-word">Checksum</span> = <span class="eng-meaning">Sağlama Toplamı</span> — Dosya bütünlüğünü doğrulama değeri.<br>
        <span class="eng-word">Dry Run</span> = <span class="eng-meaning">Kuru Çalıştırma</span> — Değişiklik yapmadan simülasyon.<br>
        <span class="eng-word">Incremental Backup</span> = <span class="eng-meaning">Artımlı Yedekleme</span> — Sadece değişen dosyaları yedekleme.<br>
        <span class="eng-word">Hard Link</span> = <span class="eng-meaning">Sert Bağlantı</span> — Aynı dosyaya işaret eden birden fazla isim (disk alanı tasarrufu).
    </div>
</div>

<h2>rsync Nasıl Çalışır?</h2>
<p>rsync'in gücü <strong>delta transfer algoritmasından</strong> gelir:</p>
<ol>
    <li>Kaynak ve hedef dosyaları karşılaştırır (boyut + zaman damgası veya checksum)</li>
    <li>Sadece <strong>farklı olan dosyaları</strong> veya dosya bloklarını belirler</li>
    <li>Yalnızca bu farkları aktarır</li>
    <li>Transfer sırasında sıkıştırma uygulayabilir (-z)</li>
</ol>

<div class="info-box note">
    <div class="info-box-title">📌 rsync vs cp/scp</div>
    <strong>cp / scp:</strong> Her seferinde tüm dosyaları kopyalar. 10GB dizinde 1 dosya değişmişse bile hepsini aktarır.<br>
    <strong>rsync:</strong> Sadece değişen dosyaları (ve hatta dosyanın değişen kısımlarını) aktarır. Aynı senaryoda sadece birkaç KB aktarılır. Bu yüzden <strong>yedekleme ve senkronizasyon</strong> için vazgeçilmezdir.
</div>

<h2>Temel rsync Kullanımı</h2>

<h3>Yerel Senkronizasyon</h3>
<div class="code-block">
    <div class="code-block-header"><span>Yerel rsync</span></div>
    <pre><code><span class="comment"># Temel dizin kopyalama:</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-av</span> <span class="path">kaynak/</span> <span class="path">hedef/</span>

<span class="comment"># Bayraklar:</span>
<span class="comment"># -a (archive): izinler, sahiplik, zaman, sembolik linkler korunur</span>
<span class="comment"># -v (verbose): işlenen dosyaları göster</span>

<span class="comment">⚠️ KRİTİK: Sondaki / (slash) çok önemli!</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-av</span> <span class="path">kaynak/</span> <span class="path">hedef/</span>    <span class="comment"># kaynak İÇİNDEKİLERİ hedef'e kopyalar</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-av</span> <span class="path">kaynak</span> <span class="path">hedef/</span>     <span class="comment"># kaynak DİZİNİNİ hedef/kaynak olarak kopyalar</span>

<span class="comment"># İlerleme göster:</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-av --progress</span> <span class="path">kaynak/</span> <span class="path">hedef/</span>

<span class="comment"># İnsan okunabilir boyutlar ve toplam ilerleme:</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-avh --info=progress2</span> <span class="path">kaynak/</span> <span class="path">hedef/</span>

<span class="comment"># Kuru çalıştırma (ne olacağını gör, bir şey yapma):</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-avn</span> <span class="path">kaynak/</span> <span class="path">hedef/</span>     <span class="comment"># -n = --dry-run</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Trailing Slash Kuralı</div>
    <code>rsync kaynak/ hedef/</code> → kaynak <em>içindeki</em> dosyalar hedef'e kopyalanır<br>
    <code>rsync kaynak hedef/</code> → kaynak <em>dizini</em> hedef altına kopyalanır (hedef/kaynak/...)<br><br>
    Bu fark çok önemlidir! İlk seferde <code>--dry-run</code> ile test edin.
</div>

<h3>Uzak Sunucu ile Senkronizasyon</h3>
<div class="code-block">
    <div class="code-block-header"><span>SSH üzerinden rsync</span></div>
    <pre><code><span class="comment"># Yerel → Uzak (yükle/upload):</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-avz</span> <span class="path">proje/</span> <span class="argument">kullanici@sunucu.com:/opt/deploy/</span>

<span class="comment"># Uzak → Yerel (indir/download):</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-avz</span> <span class="argument">kullanici@sunucu.com:/var/log/</span> <span class="path">./loglar/</span>

<span class="comment"># -z: sıkıştırma ile transfer (yavaş ağlarda faydalı)</span>

<span class="comment"># Farklı SSH portu:</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-avz -e "ssh -p 2222"</span> <span class="path">proje/</span> <span class="argument">kullanici@sunucu.com:/opt/</span>

<span class="comment"># Belirli SSH anahtarı ile:</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-avz -e "ssh -i ~/.ssh/deploy_key"</span> <span class="path">proje/</span> <span class="argument">deploy@sunucu.com:/opt/</span>

<span class="comment"># Bant genişliği sınırı (KB/s):</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-avz --bwlimit=5000</span> <span class="path">buyuk/</span> <span class="argument">kullanici@sunucu.com:/yedek/</span></code></pre>
</div>

<h2>Filtreleme: Include ve Exclude</h2>
<div class="code-block">
    <div class="code-block-header"><span>Dosya filtreleme</span></div>
    <pre><code><span class="comment"># Belirli dosyaları hariç tut:</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-av --exclude='node_modules' --exclude='.git'</span> <span class="path">proje/</span> <span class="path">yedek/</span>

<span class="comment"># Kalıp ile hariç tutma:</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-av --exclude='*.log' --exclude='*.tmp'</span> <span class="path">kaynak/</span> <span class="path">hedef/</span>

<span class="comment"># Dosyadan hariç tutma listesi:</span>
<span class="prompt">$</span> <span class="command">cat</span> haric.txt
node_modules/
.git/
*.log
*.tmp
__pycache__/
.env

<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-av --exclude-from='haric.txt'</span> <span class="path">proje/</span> <span class="path">yedek/</span>

<span class="comment"># Sadece belirli dosyaları dahil et:</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-av --include='*.py' --exclude='*'</span> <span class="path">kaynak/</span> <span class="path">hedef/</span>
<span class="comment"># Sadece .py dosyalarını kopyalar</span>

<span class="comment"># .gitignore dosyasından hariç tut:</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-av --filter=':- .gitignore'</span> <span class="path">proje/</span> <span class="path">yedek/</span></code></pre>
</div>

<h2>--delete: Tam Senkronizasyon (Mirror)</h2>
<div class="code-block">
    <div class="code-block-header"><span>Silme ile tam yansılama</span></div>
    <pre><code><span class="comment"># Hedefte kaynakta olmayan dosyaları SİL (tam yansılama):</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-av --delete</span> <span class="path">kaynak/</span> <span class="path">hedef/</span>

<span class="comment">⚠️ DİKKAT: --delete hedef dizindeki "fazla" dosyaları siler!</span>
<span class="comment"># Önce dry-run ile test edin:</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-avn --delete</span> <span class="path">kaynak/</span> <span class="path">hedef/</span>

<span class="comment"># Silinen dosyaları yedekle (taşı):</span>
<span class="prompt">$</span> <span class="command">rsync</span> <span class="flag">-av --delete --backup --backup-dir=/yedek/silinenler</span> <span class="path">kaynak/</span> <span class="path">hedef/</span></code></pre>
</div>

<h2>Yaygın rsync Bayrakları</h2>
<table>
    <tr><th>Bayrak</th><th>Uzun Hali</th><th>Açıklama</th></tr>
    <tr><td><code>-a</code></td><td><code>--archive</code></td><td>Arşiv modu: -rlptgoD (izinler, sahiplik, zaman, linkler koru)</td></tr>
    <tr><td><code>-v</code></td><td><code>--verbose</code></td><td>Detaylı çıktı</td></tr>
    <tr><td><code>-z</code></td><td><code>--compress</code></td><td>Transfer sırasında sıkıştır</td></tr>
    <tr><td><code>-h</code></td><td><code>--human-readable</code></td><td>Okunabilir boyutlar (1.5M, 2G)</td></tr>
    <tr><td><code>-n</code></td><td><code>--dry-run</code></td><td>Simülasyon — gerçek değişiklik yapmaz</td></tr>
    <tr><td><code>-P</code></td><td><code>--progress + --partial</code></td><td>İlerleme göster + yarım dosyaları koru</td></tr>
    <tr><td><code>--delete</code></td><td></td><td>Hedefte kaynakta olmayan dosyaları sil</td></tr>
    <tr><td><code>-e</code></td><td><code>--rsh</code></td><td>Kullanılacak uzak kabuk (ssh -p 2222)</td></tr>
    <tr><td><code>-c</code></td><td><code>--checksum</code></td><td>Boyut+zaman yerine checksum ile karşılaştır</td></tr>
    <tr><td><code>-u</code></td><td><code>--update</code></td><td>Hedefte daha yeni dosyaları atlama</td></tr>
    <tr><td><code>--stats</code></td><td></td><td>Transfer istatistiklerini göster</td></tr>
</table>

<h2>Yedekleme Stratejileri</h2>

<h3>Basit Yedekleme Script'i</h3>
<div class="code-block">
    <div class="code-block-header"><span>backup.sh — Temel yedekleme</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>
<span class="comment"># Günlük yedekleme script'i</span>

KAYNAK="/home/ali/"
HEDEF="/mnt/yedek/ali/"
LOG="/var/log/yedekleme.log"
HARIC="--exclude='.cache' --exclude='node_modules' --exclude='.local/share/Trash'"

echo "=== Yedekleme başladı: $(date) ===" >> "$LOG"

rsync -avh --delete $HARIC --stats "$KAYNAK" "$HEDEF" >> "$LOG" 2>&1

echo "=== Yedekleme tamamlandı: $(date) ===" >> "$LOG"
echo "" >> "$LOG"</code></pre>
</div>

<h3>Hard Link ile Artımlı Yedekleme (Snapshot)</h3>
<p>rsync'in <code>--link-dest</code> özelliği ile her gün tam yedek görünümüne sahip olursunuz ama disk alanı sadece değişen dosyalar kadar kullanılır:</p>
<div class="code-block">
    <div class="code-block-header"><span>snapshot-backup.sh — Artımlı yedekleme</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>
<span class="comment"># Hard link ile artımlı yedekleme</span>
<span class="comment"># Her snapshot tam yedek gibi görünür ama değişmeyen dosyalar hard link'tir</span>

KAYNAK="/home/ali/"
YEDEK_DIZIN="/mnt/yedek/snapshots"
TARIH=$(date +%Y-%m-%d_%H%M)
HEDEF="$YEDEK_DIZIN/$TARIH"
SON_YEDEK="$YEDEK_DIZIN/latest"

mkdir -p "$HEDEF"

<span class="comment"># --link-dest: değişmeyen dosyaları hard link ile bağla</span>
rsync -avh --delete \\
    --exclude='.cache' \\
    --exclude='node_modules' \\
    --link-dest="$SON_YEDEK" \\
    "$KAYNAK" "$HEDEF"

<span class="comment"># 'latest' sembolik linkini güncelle</span>
rm -f "$SON_YEDEK"
ln -s "$HEDEF" "$SON_YEDEK"

<span class="comment"># 30 günden eski yedekleri sil</span>
find "$YEDEK_DIZIN" -maxdepth 1 -type d -mtime +30 -exec rm -rf {} \\;</code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Hard Link Nasıl Çalışır?</div>
    Hard link, aynı dosyaya birden fazla isim vermektir. 1GB'lık değişmeyen bir dosya 30 snapshot'ta da görünür ama disk'te sadece 1 kopyası bulunur. Dosya değiştiğinde yeni kopya oluşturulur. Bu yöntem <strong>Time Machine</strong> (macOS) ile aynı prensibi kullanır.
</div>

<h3>Cron ile Otomatik Yedekleme</h3>
<div class="code-block">
    <div class="code-block-header"><span>crontab -e</span></div>
    <pre><code><span class="comment"># Her gece 02:00'de yedekle:</span>
0 2 * * * /home/ali/scripts/snapshot-backup.sh

<span class="comment"># Her 6 saatte bir uzak sunucuya senkronize et:</span>
0 */6 * * * rsync -avz --delete /opt/data/ deploy@yedek-sunucu:/opt/data/ >> /var/log/rsync-sync.log 2>&1</code></pre>
</div>

<h2>Dış Kaynaklar</h2>
<div class="info-box tip">
    <div class="info-box-title">📚 İleri Okuma</div>
    <ul>
        <li><a href="https://rsync.samba.org/documentation.html" target="_blank" rel="noopener">rsync Resmi Belgeleri</a> — rsync'in kapsamlı belgeleri</li>
        <li><a href="https://man7.org/linux/man-pages/man1/rsync.1.html" target="_blank" rel="noopener">rsync(1) man page</a> — Detaylı kullanım kılavuzu</li>
        <li><a href="https://wiki.archlinux.org/title/Rsync" target="_blank" rel="noopener">Arch Wiki — rsync</a> — Pratik kullanım rehberi ve yedekleme stratejileri</li>
    </ul>
</div>
`,
    quiz: [
        {
            question: "rsync'i cp'den üstün kılan temel özellik nedir?",
            options: ["Daha hızlı kopyalar", "Sadece değişen dosya/blokları aktarır (delta transfer)", "Daha fazla dosya türü destekler", "Otomatik sıkıştırma yapar"],
            correct: 1,
            explanation: "rsync delta transfer algoritması ile sadece değişen kısımları aktarır. 10GB dizinde 1 dosya değiştiyse, cp hepsini, rsync sadece o dosyayı kopyalar."
        },
        {
            question: "'rsync kaynak/ hedef/' ile 'rsync kaynak hedef/' arasındaki fark nedir?",
            options: ["Fark yoktur", "İlki kaynak içindekileri, ikincisi kaynak dizinini hedef altına kopyalar", "İlki daha hızlıdır", "İkincisi sıkıştırma yapar"],
            correct: 1,
            explanation: "Sondaki slash (/) kritiktir: kaynak/ → içindekiler kopyalanır; kaynak → dizin hedef/kaynak olarak kopyalanır."
        },
        {
            question: "--dry-run (-n) bayrağı ne yapar?",
            options: ["Dosyaları siler", "Ne olacağını gösterir ama değişiklik yapmaz", "Sıkıştırma uygular", "Hata ayıklama modunu açar"],
            correct: 1,
            explanation: "--dry-run simülasyon yapar: hangi dosyaların kopyalanacağını, silineceğini gösterir ama hiçbir değişiklik yapmaz. Her zaman ilk seferde kullanın!"
        },
        {
            question: "'--delete' bayrağı ne yapar?",
            options: ["Kaynak dosyaları siler", "Hedef dizindeki, kaynakta olmayan dosyaları siler", "Transfer sonrası geçici dosyaları temizler", "Log dosyalarını siler"],
            correct: 1,
            explanation: "--delete, hedef dizini kaynağın tam yansıması yapar. Kaynakta olmayan dosyalar hedeften silinir. Dikkatli kullanın!"
        },
        {
            question: "rsync'in --link-dest özelliği ne sağlar?",
            options: ["Sembolik linkler oluşturur", "Değişmeyen dosyaları hard link ile bağlar (disk tasarrufu)", "Uzak sunucuya link gönderir", "FTP bağlantısı kurar"],
            correct: 1,
            explanation: "--link-dest ile değişmeyen dosyalar hard link kullanır — her snapshot tam yedek gibi görünür ama aslında sadece değişen dosyalar ek yer kaplar."
        },
        {
            question: "rsync ile uzak sunucuya senkronizasyon hangi protokolü kullanır?",
            options: ["FTP", "HTTP", "SSH (varsayılan)", "rsync daemon"],
            correct: 2,
            explanation: "rsync varsayılan olarak SSH üzerinden çalışır. Ayrıca rsync daemon protokolü de desteklenir ama SSH daha güvenlidir."
        }
    ]
});
