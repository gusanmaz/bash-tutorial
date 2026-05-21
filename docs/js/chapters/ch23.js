// ===== Bölüm 23: Sistem Bilgisi ve Disk =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 23,
    title: 'Sistem Bilgisi ve Disk',
    subtitle: 'System Info & Disk Management',
    icon: '💾',
    description: 'df, du, free, uptime, uname, dmesg, lsblk ve mount — makinenin sağlığını ve disk kullanımını okuma.',
    content: `
<h2>Neden Önemli?</h2>
<div class="info-box tip">
    <div class="info-box-title">💡 Sunucuda ilk sorular</div>
    "Disk doldu mu?", "RAM yetiyor mu?", "Sistem ne kadar süredir ayakta?", "USB nereye bağlandı?" — Bu bölümdeki komutlar günlük operasyonun temelidir. Bölüm 3'te dosya sisteminin <strong>kavramını</strong>, burada <strong>pratiğini</strong> görürsünüz.
</div>

<h2>df — Disk Doluluğu</h2>
<div class="eng-box">
    <div class="eng-title">🔤 Terim</div>
    <div class="eng-content">
        <span class="eng-word">df</span> = <span class="eng-meaning">Disk Free</span> — Bağlı dosya sistemlerinin kullanımını gösterir.
    </div>
</div>
<div class="code-block">
    <div class="code-block-header"><span>df komutları</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">df -h</span>
<span class="comment"># -h: human-readable (G, M)</span>
<span class="output">Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2       255G   89G  154G  37% /</span>

<span class="prompt">$</span> <span class="command">df -i</span>
<span class="comment"># inode doluluğu — çok küçük dosyada disk boş olsa bile inode bitebilir</span>

<span class="prompt">$</span> <span class="command">df -h /home</span>
<span class="comment"># Sadece /home bölümü</span>

<span class="prompt">$</span> <span class="command">df -h --type=ext4</span>
<span class="comment"># Sadece ext4 dosya sistemleri</span>

<span class="prompt">$</span> <span class="command">findmnt</span>
<span class="comment"># mount ağacını okunaklı gösterir (tree benzeri)</span></code></pre>
</div>

<h3>df çıktısını okumak</h3>
<table>
    <tr><th>Sütun</th><th>Anlam</th></tr>
    <tr><td>Filesystem</td><td>Aygıt (<code>/dev/sda2</code>) veya sanal FS (<code>tmpfs</code>)</td></tr>
    <tr><td>Size / Used / Avail</td><td>Toplam, kullanılan, kalan alan</td></tr>
    <tr><td>Use%</td><td>Doluluk yüzdesi — <strong>%90+</strong> alarm</td></tr>
    <tr><td>Mounted on</td><td>Bağlandığı dizin (<code>/</code>, <code>/home</code>)</td></tr>
</table>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Inode tükendi — disk boş görünür!</div>
    Milyonlarca küçük dosya (cache, mail kuyruğu, <code>node_modules</code>) inode'ları bitirir; <code>df -h</code> boş alan gösterse bile yazma hatası alırsınız:<br>
    <code>No space left on device</code> — bazen inode değil byte değil!<br>
    Kontrol: <code>df -i</code> — IUse% %100 ise suçlu çok sayıda küçük dosyadır. <code>find . -xdev -type f | wc -l</code> ile dosya sayısı tahmin edilir.
</div>

<h2>du — Klasör Boyutu</h2>
<div class="code-block">
    <div class="code-block-header"><span>du ile yer kaplayanları bul</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">du -sh</span> <span class="path">*</span>
<span class="comment"># Mevcut dizindeki her öğenin toplam boyutu</span>

<span class="prompt">$</span> <span class="command">du -sh /var/log/*</span> <span class="argument">|</span> <span class="command">sort -rh</span> <span class="argument">|</span> <span class="command">head -10</span>
<span class="comment"># En büyük log dosyaları</span>

<span class="prompt">$</span> <span class="command">du -xhd1 /</span> <span class="argument">2&gt;/dev/null</span> <span class="argument">|</span> <span class="command">sort -rh</span> <span class="argument">|</span> <span class="command">head</span>
<span class="comment"># Kök altında hangi dizin ne kadar yer kaplıyor (-x: aynı FS)</span>

<span class="prompt">$</span> <span class="command">du -sh --max-depth=1</span> <span class="path">/var</span>
<span class="comment"># /var altında bir seviye derinlik</span>

<span class="prompt">$</span> <span class="command">ncdu /home/kullanici</span>
<span class="comment"># İnteraktif TUI — hangi alt klasör büyük, ok tuşlarıyla gezin (apt install ncdu)</span></code></pre>
</div>

<h3>du bayrakları</h3>
<table>
    <tr><th>Bayrak</th><th>Anlam</th></tr>
    <tr><td><code>-s</code></td><td><strong>S</strong>ummary — toplam (alt dizinleri tek satır)</td></tr>
    <tr><td><code>-h</code></td><td>Human-readable (G, M, K)</td></tr>
    <tr><td><code>-x</code></td><td>Aynı dosya sisteminde kal (başka mount'a geçme)</td></tr>
    <tr><td><code>-d N</code> / <code>--max-depth=N</code></td><td>En fazla N seviye derinlik</td></tr>
    <tr><td><code>--apparent-size</code></td><td>Seyrek (sparse) dosyalarda mantıksal boyut</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 df vs du — neden fark çıkar?</div>
    <code>df</code> dosya sisteminin <strong>toplam</strong> doluluğunu gösterir. <code>du</code> belirtilen dizinlerin <strong>toplam boyutunu</strong> hesaplar. Farkın sık nedenleri:<br>
    • <strong>Silinmiş ama açık dosya:</strong> Bir süreç log dosyasını tutuyorsa, dosyayı sildiniz ama disk alanı <code>df</code>'te hâlâ "dolu" görünür. <code>lsof +L1</code> veya servisi yeniden başlatın (Bölüm 12).<br>
    • <strong>Reserved blocks:</strong> ext4 root için %5 alanı ayırır — <code>df</code> "Avail" buna göre hesaplanır.<br>
    • <strong>Snapshot / overlay:</strong> Docker/K8s ortamlarında katmanlı FS fark yaratabilir.
</div>

<h2>free ve uptime — Bellek ve Çalışma Süresi</h2>
<div class="info-box note">
    <div class="info-box-title">📌 free çıktısı — hangi sütuna bakılır?</div>
    <table style="margin-top:0.5em">
        <tr><th>Sütun</th><th>Yorum</th></tr>
        <tr><td><code>total</code></td><td>Fiziksel RAM (+ swap satırı ayrı)</td></tr>
        <tr><td><code>used</code></td><td>Şu an kullanılan (basit okuma yanıltıcı olabilir)</td></tr>
        <tr><td><code>buff/cache</code></td><td>Disk önbelleği — Linux boş RAM'i önbellek için kullanır (normal!)</td></tr>
        <tr><td><code>available</code></td><td><strong>Asıl bakılacak:</strong> yeni uygulama için tahmini boş RAM</td></tr>
    </table>
    "used yüksek, free düşük" görürseniz panik yapmayın — <code>available</code> yeterliyse sistem sağlıklıdır.
</div>
<div class="code-block">
    <div class="code-block-header"><span>RAM ve uptime</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">free -h</span>
<span class="output">               total        used        free      shared  buff/cache   available
Mem:            15Gi       4.2Gi       2.1Gi       512Mi       9.2Gi        10Gi</span>
<span class="comment"># available — gerçekten kullanılabilir RAM (buff/cache geri alınabilir)</span>

<span class="prompt">$</span> <span class="command">uptime</span>
<span class="output">14:32:01 up 12 days,  3:15,  2 users,  load average: 0.45, 0.38, 0.30</span>
<span class="comment"># load average: son 1 / 5 / 15 dk bekleyen iş sayısı (yaklaşık)</span>

<span class="prompt">$</span> <span class="command">nproc</span>
<span class="comment"># CPU çekirdek sayısı — load 4 çekirdekte 4.0 = tam dolu kabul edilir</span>

<span class="prompt">$</span> <span class="command">free -h</span> <span class="argument">|</span> <span class="command">grep Swap</span>
<span class="comment"># Swap kullanımı — sürekli yüksek swap = RAM baskısı</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Load average nasıl yorumlanır?</div>
    4 çekirdekli CPU'da load <strong>4.0</strong> civarı "tam kapasite", <strong>8.0</strong> sürekli ise işler kuyrukta bekliyor demektir. Tek çekirdekte 1.0 = %100. <code>htop</code> ile birlikte bakın (Bölüm 12).
</div>

<h2>uname ve dmesg — Sistem Kimliği ve Çekirdek Mesajları</h2>
<div class="code-block">
    <div class="code-block-header"><span>Sistem bilgisi</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">uname -a</span>
<span class="comment"># Çekirdek sürümü, mimari (x86_64, aarch64)</span>

<span class="prompt">$</span> <span class="command">hostnamectl</span>
<span class="comment"># Dağıtım, hostname, virtualization (systemd sistemlerde)</span>

<span class="prompt">$</span> <span class="command">dmesg</span> <span class="argument">|</span> <span class="command">tail -20</span>
<span class="comment"># Son çekirdek mesajları — USB takma, disk hataları</span>

<span class="prompt">$</span> <span class="command">sudo dmesg -T</span> <span class="argument">|</span> <span class="command">grep -i error</span>
<span class="comment"># -T: okunabilir zaman damgası</span>

<span class="prompt">$</span> <span class="command">cat</span> <span class="path">/etc/os-release</span>
<span class="comment"># Dağıtım adı ve sürümü (Ubuntu, Fedora, Pardus...)</span>

<span class="prompt">$</span> <span class="command">lscpu</span>
<span class="comment"># CPU modeli, çekirdek, mimari detayı</span></code></pre>
</div>

<h2>lsblk ve blkid — Disk Haritası</h2>
<div class="code-block">
    <div class="code-block-header"><span>Blok aygıtlar</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">lsblk -f</span>
<span class="comment"># Bölüm, dosya sistemi türü, UUID, mount noktası</span>

<span class="prompt">$</span> <span class="command">blkid</span>
<span class="comment"># UUID ve FS türü — /etc/fstab için</span>

<span class="prompt">$</span> <span class="command">ls -l</span> <span class="path">/dev/disk/by-uuid/</span>
<span class="comment"># Kalıcı disk tanımlama (sda1 yerine UUID tercih edilir)</span></code></pre>
</div>

<h2>mount ve /etc/fstab — Bağlama</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Mount nedir?</div>
    Bir dosya sistemini (USB, harici disk, ağ paylaşımı) mevcut ağaçta bir dizine bağlamak. Bağlanmadan önce o dizin boş bir "kapı" gibidir; bağlandıktan sonra içeriği görünür.
</div>
<div class="code-block">
    <div class="code-block-header"><span>mount / umount</span></div>
    <pre><code><span class="comment"># Bağlı dosya sistemlerini listele:</span>
<span class="prompt">$</span> <span class="command">mount</span> <span class="argument">|</span> <span class="command">column -t</span>

<span class="comment"># USB'yi okuma-yazma bağla (root gerekebilir):</span>
<span class="prompt">$</span> <span class="command">sudo mkdir -p</span> <span class="path">/mnt/usb</span>
<span class="prompt">$</span> <span class="command">sudo mount</span> <span class="path">/dev/sdb1</span> <span class="path">/mnt/usb</span>

<span class="comment"># Güvenli çıkar:</span>
<span class="prompt">$</span> <span class="command">sudo umount</span> <span class="path">/mnt/usb</span>

<span class="comment"># /etc/fstab — açılışta otomatik mount (örnek satır):</span>
<span class="comment"># UUID=abc-123  /home  ext4  defaults,noatime  0  2</span>
<span class="comment">#   ^UUID       ^nokta ^tür  ^seçenekler       ^dump ^fsck sırası</span>

<span class="comment"># Sadece okunur bağla:</span>
<span class="prompt">$</span> <span class="command">sudo mount -o remount,ro</span> <span class="path">/</span>

<span class="comment"># Dosya sistemi türünü belirterek (USB vfat):</span>
<span class="prompt">$</span> <span class="command">sudo mount -t vfat</span> <span class="path">/dev/sdb1</span> <span class="path">/mnt/usb</span>

<span class="comment"># fstab değişikliğini test:</span>
<span class="prompt">$</span> <span class="command">sudo mount -a</span></code></pre>
</div>

<h3>/etc/fstab sütunları</h3>
<table>
    <tr><th>Sütun</th><th>Açıklama</th></tr>
    <tr><td>1 — Aygıt</td><td><code>UUID=...</code> veya <code>/dev/sda2</code> (UUID tercih — disk sırası değişse bile çalışır)</td></tr>
    <tr><td>2 — Mount point</td><td>Bağlanacağı dizin (<code>/</code>, <code>/home</code>, <code>/mnt/yedek</code>)</td></tr>
    <tr><td>3 — Tür</td><td><code>ext4</code>, <code>xfs</code>, <code>vfat</code>, <code>swap</code>, <code>none</code> (tmpfs için)</td></tr>
    <tr><td>4 — Seçenekler</td><td><code>defaults</code>, <code>noatime</code>, <code>ro</code> (read-only), <code>nofail</code> (yoksa boot durmasın)</td></tr>
    <tr><td>5 — dump</td><td>Eski yedekleme aracı — genelde <code>0</code></td></tr>
    <tr><td>6 — fsck pass</td><td>Boot'ta fsck sırası: <code>/</code> için <code>1</code>, diğer ext4 için <code>2</code>, swap/tmpfs <code>0</code></td></tr>
</table>

<div class="info-box warning">
    <div class="info-box-title">⚠️ fstab hatası</div>
    Yanlış <code>/etc/fstab</code> satırı sistemi açılmaz hale getirebilir. Değişiklikten sonra <code>sudo mount -a</code> ile test edin — hata varsa düzeltmeden reboot yapmayın.
</div>

<h2>Pratik: "Disk doldu" senaryosu</h2>
<div class="code-block">
    <div class="code-block-header"><span>Adım adım</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">df -h</span>                    <span class="comment"># Hangi bölüm %100?</span>
<span class="prompt">$</span> <span class="command">df -i</span>                    <span class="comment"># Inode mu byte mı?</span>
<span class="prompt">$</span> <span class="command">sudo du -xhd1 /var</span> <span class="argument">| sort -rh | head</span>  <span class="comment"># /var içinde suçlu</span>
<span class="prompt">$</span> <span class="command">sudo du -sh /var/log/*</span> <span class="argument">| sort -rh | head</span>
<span class="prompt">$</span> <span class="command">sudo lsof +L1</span>          <span class="comment"># Silinmiş ama açık dosyalar (link count 0)</span>
<span class="prompt">$</span> <span class="command">sudo journalctl --disk-usage</span>
<span class="prompt">$</span> <span class="command">sudo journalctl --vacuum-size=500M</span>
<span class="prompt">$</span> <span class="command">docker system df</span>       <span class="comment"># Docker kullanıyorsanız (Bölüm 28+)</span></code></pre>
</div>

<h2>Özet — Hangi komut ne zaman?</h2>
<table>
    <tr><th>Soru</th><th>Komut</th></tr>
    <tr><td>Disk dolu mu?</td><td><code>df -h</code>, <code>df -i</code></td></tr>
    <tr><td>Hangisi yer kaplıyor?</td><td><code>du -sh *</code>, <code>ncdu</code></td></tr>
    <tr><td>RAM yeterli mi?</td><td><code>free -h</code> → <code>available</code></td></tr>
    <tr><td>CPU meşgul mu?</td><td><code>uptime</code>, <code>htop</code></td></tr>
    <tr><td>USB hangi aygıt?</td><td><code>lsblk</code>, <code>dmesg | tail</code></td></tr>
    <tr><td>Disk kalıcı bağlansın</td><td><code>/etc/fstab</code> + <code>mount -a</code></td></tr>
</table>
`,
    quiz: [
        {
            question: "df -h komutu ne gösterir?",
            options: [
                "Bağlı dosya sistemlerinin disk kullanımını (insan okunur)",
                "Sadece /home dizininin boyutunu",
                "RAM kullanımını",
                "Açık dosya tanıtıcılarını"
            ],
            correct: 0,
            explanation: "df (disk free) mount edilmiş dosya sistemlerinin toplam/kullanılan/boş alanını gösterir. -h GB/MB formatında yazar."
        },
        {
            question: "Bir dizinin gerçek boyutunu öğrenmek için hangi komut kullanılır?",
            options: ["du -sh dizin", "df -h dizin", "ls -lh dizin", "free -h"],
            correct: 0,
            explanation: "du (disk usage) belirtilen dizin ağacının toplam boyutunu hesaplar. df ise tüm bölümün özetini verir."
        },
        {
            question: "free -h çıktısında 'available' sütunu ne anlama gelir?",
            options: [
                "Uygulamaların kullanabileceği tahmini RAM",
                "Swap alanının boyutu",
                "Diskte boş alan",
                "CPU sayısı"
            ],
            correct: 0,
            explanation: "available, buff/cache geri alınabilir sayılarak hesaplanır — pratikte kullanılabilir bellek."
        },
        {
            question: "USB belleği güvenle çıkarmadan önce ne yapmalısınız?",
            options: ["umount mount_noktası", "rm -rf /mnt/usb", "sync && reboot", "chmod 000 /dev/sdb"],
            correct: 0,
            explanation: "umount yazma tamamlanmadan aygıtı çıkarmaz; veri kaybını önler."
        },
        {
            question: "dmesg komutu ne için kullanılır?",
            options: [
                "Çekirdek halka tampon mesajlarını görmek",
                "DNS sorgusu yapmak",
                "Süreç listesi",
                "Paket kurmak"
            ],
            correct: 0,
            explanation: "dmesg boot ve donanım olaylarını (USB, disk hataları) çekirdek logundan gösterir."
        },
        {
            question: "df -i komutu ne için kullanılır?",
            options: [
                "Inode kullanımını gösterir",
                "Sadece /boot bölümünü listeler",
                "İnternet hızını ölçer",
                "RAM inode sayısını verir"
            ],
            correct: 0,
            explanation: "Çok küçük dosyalarda byte doluluğu düşük olsa bile inode %100 olabilir; df -i bunu yakalar."
        },
        {
            question: "/etc/fstab'ta UUID kullanmanın avantajı nedir?",
            options: [
                "Disk takılı sıra değişse bile doğru bölüm bağlanır",
                "Daha hızlı mount eder",
                "Şifreleme sağlar",
                "Sadece USB için geçerlidir"
            ],
            correct: 0,
            explanation: "sda1/sdb1 sırası değişebilir; UUID diskte kalıcı benzersiz kimliktir."
        }
    ]
});
