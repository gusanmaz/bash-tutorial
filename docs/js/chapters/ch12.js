// ===== Bölüm 12: Süreç Yönetimi =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 12,
    title: 'Süreç Yönetimi',
    subtitle: 'Process Management',
    icon: '⚙️',
    description: 'Çalışan programları yönetme: ps, top, kill, arka plan işleri, sinyaller, systemd/systemctl, journalctl ve zamanlama.',
    content: `
<h2>Süreç Nedir? (Process)</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Terim</div>
    <div class="eng-content">
        <span class="eng-word">Process</span> = <span class="eng-meaning">Süreç</span> — Çalışan bir programın bellekteki örneği. Her sürecin benzersiz bir PID (Process ID) numarası vardır.<br>
        <span class="eng-word">Daemon</span> = <span class="eng-meaning">Arka plan hizmeti</span> — Arka planda sessizce çalışan, terminal bağlantısı olmayan süreç. Genellikle ismi 'd' ile biter: <code>sshd</code>, <code>httpd</code>, <code>systemd</code>.
    </div>
</div>

<p>Bir program disk üzerindeki dosyadır. Çalıştırıldığında bellekte bir <strong>süreç</strong> oluşur. Aynı programın birden fazla süreci aynı anda çalışabilir (örneğin 3 tane terminal penceresi = 3 süreç).</p>

<div class="info-box note">
    <div class="info-box-title">📌 /proc — Sanal Süreç Dosya Sistemi</div>
    Linux'ta her çalışan sürecin <code>/proc/PID/</code> dizininde dosyaları vardır. Bu dosyalar gerçek disk dosyaları değil, çekirdeğin (kernel) sunduğu <strong>sanal</strong> dosyalardır:<br>
    <code>/proc/1234/status</code> — Sürecin durumu, bellek kullanımı<br>
    <code>/proc/1234/cmdline</code> — Sürecin başlatıldığı komut<br>
    <code>/proc/1234/fd/</code> — Açık dosya tanımlayıcıları<br>
    <code>/proc/1234/environ</code> — Çevre değişkenleri<br>
    <code>/proc/cpuinfo</code> — İşlemci bilgisi<br>
    <code>/proc/meminfo</code> — Bellek bilgisi
</div>

<h2>ps — Süreçleri Listele</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">ps</span> = <span class="eng-meaning">Process Status</span> — Çalışan süreçlerin anlık durumunu gösterir. <strong>Fotoğraf gibi</strong> — o anki durumu yakalar.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>ps kullanımı</span>
        <button class="try-btn" onclick="runInTerminal('ps')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># Mevcut terminaldeki süreçler:</span>
<span class="prompt">$</span> <span class="command">ps</span>

<span class="comment"># Tüm süreçler, detaylı (en yaygın kullanım):</span>
<span class="prompt">$</span> <span class="command">ps aux</span>

<span class="comment"># Ağaç görünümü (ebeveyn-çocuk ilişkisi):</span>
<span class="prompt">$</span> <span class="command">ps auxf</span>

<span class="comment"># Belirli bir süreci ara:</span>
<span class="prompt">$</span> <span class="command">ps aux</span> | <span class="command">grep</span> <span class="string">"firefox"</span></code></pre>
</div>

<h3>ps aux Çıktısını Okuma</h3>
<div class="code-block">
    <div class="code-block-header"><span>ps aux çıktı açıklaması</span></div>
    <pre><code>USER       PID  %CPU %MEM    VSZ   RSS TTY  STAT START   TIME COMMAND
root         1   0.0  0.1 169360 13284 ?    Ss   10:00   0:02 /sbin/init
ahmet     1234   2.1  1.5 345000 52000 pts/0 S+  10:05   0:15 vim dosya.txt</code></pre>
</div>

<table>
    <tr><th>Sütun</th><th>İngilizce</th><th>Açıklama</th></tr>
    <tr><td>USER</td><td>User</td><td>Sürecin sahibi</td></tr>
    <tr><td>PID</td><td>Process ID</td><td>Benzersiz süreç numarası</td></tr>
    <tr><td>%CPU</td><td>CPU Percentage</td><td>İşlemci kullanım yüzdesi</td></tr>
    <tr><td>%MEM</td><td>Memory Percentage</td><td>Bellek kullanım yüzdesi</td></tr>
    <tr><td>VSZ</td><td>Virtual Size</td><td>Sanal bellek boyutu (KB)</td></tr>
    <tr><td>RSS</td><td>Resident Set Size</td><td>Gerçek fiziksel bellek (KB)</td></tr>
    <tr><td>TTY</td><td>Terminal</td><td>Bağlı terminal (? = daemon/terminal yok)</td></tr>
    <tr><td>STAT</td><td>Status</td><td>Süreç durumu</td></tr>
    <tr><td>COMMAND</td><td>Command</td><td>Çalıştırılan komut</td></tr>
</table>

<h3>Süreç Durumları (STAT)</h3>
<table>
    <tr><th>Kod</th><th>İngilizce</th><th>Anlam</th></tr>
    <tr><td>R</td><td>Running</td><td>Çalışıyor veya çalışmaya hazır</td></tr>
    <tr><td>S</td><td>Sleeping</td><td>Bir olayı bekliyor (kesintiye uğratılabilir uyku)</td></tr>
    <tr><td>D</td><td>Disk sleep</td><td>Kesintisiz uyku (disk I/O bekliyor — kill edilemez)</td></tr>
    <tr><td>T</td><td>Stopped</td><td>Durdurulmuş (Ctrl+Z veya sinyal ile)</td></tr>
    <tr><td>Z</td><td>Zombie</td><td>Biten ama ebeveyni tarafından temizlenmeyen süreç</td></tr>
</table>

<h2>pgrep — Süreç Arama</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">pgrep</span> = <span class="eng-meaning">Process Grep</span> — Süreç adına göre PID bulur. <code>ps aux | grep</code> yerine daha temiz bir alternatif.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>pgrep kullanımı</span></div>
    <pre><code><span class="comment"># İsme göre PID bul:</span>
<span class="prompt">$</span> <span class="command">pgrep</span> <span class="argument">firefox</span>
<span class="output">4521</span>

<span class="comment"># Detaylı bilgiyle birlikte (-l = list name):</span>
<span class="prompt">$</span> <span class="command">pgrep -l</span> <span class="argument">ssh</span>
<span class="output">892 sshd
4501 ssh-agent</span>

<span class="comment"># Tam komut satırıyla eşleştir (-f = full):</span>
<span class="prompt">$</span> <span class="command">pgrep -f</span> <span class="argument">"python server.py"</span>

<span class="comment"># Belirli kullanıcının süreçleri:</span>
<span class="prompt">$</span> <span class="command">pgrep -u</span> <span class="argument">ali</span></code></pre>
</div>

<h2>top / htop — Canlı Süreç İzleme</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamları</div>
    <div class="eng-content">
        <span class="eng-word">top</span> = <span class="eng-meaning">Table of Processes</span> — Süreçlerin canlı (gerçek zamanlı) tablosu. <strong>Video gibi</strong> sürekli güncellenir.<br>
        <span class="eng-word">htop</span> = <span class="eng-meaning">Hisham's top</span> — top'un renkli, etkileşimli, modern versiyonu.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>top içinde kullanılan tuşlar</span></div>
    <pre><code><span class="comment"># top çalıştır:</span>
<span class="prompt">$</span> <span class="command">top</span>

<span class="comment"># top içindeyken:</span>
q      → Çık
M      → Bellek kullanımına göre sırala
P      → CPU kullanımına göre sırala
k      → Süreç sonlandır (PID sor)
u      → Kullanıcıya göre filtrele
1      → CPU çekirdeklerini ayrı göster
h      → Yardım</code></pre>
</div>

<h2>watch — Komutu Periyodik Olarak Çalıştır</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">watch</span> = <span class="eng-meaning">İzle</span> — Bir komutu belirli aralıklarla tekrar çalıştırır ve çıktısını ekranda günceller. Varsayılan: her 2 saniye.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>watch kullanımı</span></div>
    <pre><code><span class="comment"># Dizin içeriğini her 2 saniyede izle:</span>
<span class="prompt">$</span> <span class="command">watch</span> <span class="argument">ls -l</span>

<span class="comment"># Her 5 saniyede disk kullanımını izle:</span>
<span class="prompt">$</span> <span class="command">watch -n 5</span> <span class="argument">df -h</span>

<span class="comment"># Değişiklikleri vurgula (-d = differences):</span>
<span class="prompt">$</span> <span class="command">watch -d</span> <span class="argument">"free -m"</span>

<span class="comment"># Belirli bir sürecin durumunu izle:</span>
<span class="prompt">$</span> <span class="command">watch -n 1</span> <span class="argument">"ps aux | grep python"</span></code></pre>
</div>

<h2>lsof — Açık Dosyaları Listele</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">lsof</span> = <span class="eng-meaning">List Open Files</span> — Açık dosyaları listeler. "Her şey bir dosyadır" prensibi gereği, ağ bağlantıları da dahildir!
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>lsof kullanımı</span></div>
    <pre><code><span class="comment"># Bir sürecin açık dosyaları:</span>
<span class="prompt">$</span> <span class="command">lsof -p</span> <span class="argument">1234</span>

<span class="comment"># Bir dosyayı hangi süreç kullanıyor?</span>
<span class="prompt">$</span> <span class="command">lsof</span> <span class="path">/var/log/syslog</span>

<span class="comment"># Hangi süreç bu port'u dinliyor?</span>
<span class="prompt">$</span> <span class="command">sudo lsof -i :8080</span>
<span class="comment"># "Disk neden unmount edilemiyor?" sorusunun cevabı da burada:</span>
<span class="prompt">$</span> <span class="command">lsof +D</span> <span class="path">/mnt/usb</span></code></pre>
</div>

<h2>kill — Süreçlere Sinyal Gönder</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">kill</span> = <span class="eng-meaning">Öldür</span> — Adı çok sert olsa da aslında süreçlere <strong>sinyal gönderir</strong>. Varsayılan sinyal (SIGTERM) nazikçe "lütfen kapat" demektir.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>kill kullanımı</span></div>
    <pre><code><span class="comment"># Nazik kapatma (SIGTERM — varsayılan):</span>
<span class="prompt">$</span> <span class="command">kill</span> <span class="argument">1234</span>

<span class="comment"># Zorla öldür (SIGKILL — son çare!):</span>
<span class="prompt">$</span> <span class="command">kill -9</span> <span class="argument">1234</span>

<span class="comment"># İsimle öldür (pidof+kill yerine):</span>
<span class="prompt">$</span> <span class="command">killall</span> <span class="argument">firefox</span>

<span class="comment"># Kalıp eşleşmesiyle öldür:</span>
<span class="prompt">$</span> <span class="command">pkill</span> <span class="argument">-f "python script.py"</span></code></pre>
</div>

<h3>Önemli Sinyaller</h3>
<table>
    <tr><th>Numara</th><th>İsim</th><th>Açıklama</th><th>Kısayol</th></tr>
    <tr><td>1</td><td>SIGHUP</td><td>Hangup — Terminal kapandı, yeniden yükle</td><td>—</td></tr>
    <tr><td>2</td><td>SIGINT</td><td>Interrupt — Programı kes (nazik)</td><td>Ctrl+C</td></tr>
    <tr><td>9</td><td>SIGKILL</td><td>Kill — Anında öldür (yakalanamaz!)</td><td>—</td></tr>
    <tr><td>15</td><td>SIGTERM</td><td>Terminate — Nazik kapatma (varsayılan)</td><td>—</td></tr>
    <tr><td>18</td><td>SIGCONT</td><td>Continue — Devam ettir</td><td>—</td></tr>
    <tr><td>19</td><td>SIGSTOP</td><td>Stop — Durdur (yakalanamaz!)</td><td>—</td></tr>
    <tr><td>20</td><td>SIGTSTP</td><td>Terminal Stop — Askıya al</td><td>Ctrl+Z</td></tr>
</table>

<div class="info-box warning">
    <div class="info-box-title">⚠️ kill -9 Son Çaredir!</div>
    <code>kill -9</code> (SIGKILL) sürecin <strong>hiçbir temizlik yapmasına izin vermez</strong> — dosyaları kapatamaz, geçici dosyaları silemez, bağlantıları düzgün kapatamaz. Önce <code>kill</code> (SIGTERM) deneyin. Cevap vermezse birkaç saniye bekleyip SONRA <code>kill -9</code> kullanın.
</div>

<h2>Ön Plan ve Arka Plan İşleri</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Terimler</div>
    <div class="eng-content">
        <span class="eng-word">Foreground</span> = <span class="eng-meaning">Ön Plan</span> — Terminal ona bağlı, girdi alabilir<br>
        <span class="eng-word">Background</span> = <span class="eng-meaning">Arka Plan</span> — Terminal serbest, komut arkada çalışır<br>
        <span class="eng-word">Job</span> = <span class="eng-meaning">İş</span> — Mevcut shell'deki süreçler
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Arka plan işleri</span></div>
    <pre><code><span class="comment"># Komutu arka planda başlat (& ekle):</span>
<span class="prompt">$</span> <span class="command">sleep 100</span> <span class="argument">&</span>
[1] 5678   <span class="comment">← iş no: 1, PID: 5678</span>

<span class="comment"># Ön plandaki işi askıya al:</span>
<span class="prompt">$</span> <span class="argument">Ctrl+Z</span>
[1]+  Stopped     sleep 100

<span class="comment"># Askıdaki işleri listele:</span>
<span class="prompt">$</span> <span class="command">jobs</span>
[1]+  Stopped     sleep 100

<span class="comment"># İşi arka planda devam ettir:</span>
<span class="prompt">$</span> <span class="command">bg</span> <span class="argument">%1</span>

<span class="comment"># İşi ön plana getir:</span>
<span class="prompt">$</span> <span class="command">fg</span> <span class="argument">%1</span></code></pre>
</div>

<h3>nohup — Terminal Kapansa Bile Çalışmaya Devam Et</h3>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">nohup</span> = <span class="eng-meaning">No Hangup</span> — "Kapatma sinyalini yok say." Terminal kapansa bile sürecin çalışmaya devam etmesini sağlar.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>nohup kullanımı</span></div>
    <pre><code><span class="comment"># SSH bağlantısı kopsa bile çalışmaya devam etsin:</span>
<span class="prompt">$</span> <span class="command">nohup</span> <span class="argument">uzun_islem.sh</span> <span class="argument">&</span>
<span class="comment"># Çıktı otomatik olarak nohup.out dosyasına yazılır</span>

<span class="comment"># Çıktıyı belirli dosyaya yönlendir:</span>
<span class="prompt">$</span> <span class="command">nohup</span> <span class="argument">python betik.py</span> <span class="argument">&gt;</span> <span class="path">cikti.log</span> <span class="argument">2&gt;&amp;1 &</span></code></pre>
</div>

<h2>systemd ve systemctl — Hizmet Yönetimi</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Terimler</div>
    <div class="eng-content">
        <span class="eng-word">systemd</span> = <span class="eng-meaning">System Daemon</span> — Modern Linux'un init sistemi. Sistem başlatılmasını, hizmetleri, logları ve daha fazlasını yönetir. PID 1 olarak çalışır.<br>
        <span class="eng-word">systemctl</span> = <span class="eng-meaning">System Control</span> — systemd ile etkileşim kurmak için kullanılan komut.<br>
        <span class="eng-word">Unit</span> = <span class="eng-meaning">Birim</span> — systemd'nin yönettiği her şey (hizmet, soket, zamanlayıcı vb.).<br>
        <span class="eng-word">Service</span> = <span class="eng-meaning">Hizmet</span> — Arka planda çalışan daemon programı.
    </div>
</div>

<p>Günümüzde hemen hemen tüm büyük dağıtımlar (Ubuntu, Fedora, Debian, Arch, RHEL) <strong>systemd</strong> kullanır. Sunucu yönetimi için <code>systemctl</code> bilmek zorunludur.</p>

<div class="code-block">
    <div class="code-block-header"><span>systemctl ile hizmet yönetimi</span></div>
    <pre><code><span class="comment"># Hizmet durumunu kontrol et:</span>
<span class="prompt">$</span> <span class="command">systemctl status</span> <span class="argument">nginx</span>
<span class="output">● nginx.service - A high performance web server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
     Active: active (running) since Mon 2024-01-15 10:00:00</span>

<span class="comment"># Hizmeti başlat / durdur / yeniden başlat:</span>
<span class="prompt">$</span> <span class="command">sudo systemctl start</span> <span class="argument">nginx</span>
<span class="prompt">$</span> <span class="command">sudo systemctl stop</span> <span class="argument">nginx</span>
<span class="prompt">$</span> <span class="command">sudo systemctl restart</span> <span class="argument">nginx</span>

<span class="comment"># Yapılandırma değiştikten sonra yeniden yükle (durdurmadan):</span>
<span class="prompt">$</span> <span class="command">sudo systemctl reload</span> <span class="argument">nginx</span>

<span class="comment"># Sistem açılışında otomatik başlamasını etkinleştir/devre dışı bırak:</span>
<span class="prompt">$</span> <span class="command">sudo systemctl enable</span> <span class="argument">nginx</span>    <span class="comment"># Açılışta başlar</span>
<span class="prompt">$</span> <span class="command">sudo systemctl disable</span> <span class="argument">nginx</span>   <span class="comment"># Açılışta başlamaz</span>

<span class="comment"># Hem etkinleştir hem başlat (tek komut):</span>
<span class="prompt">$</span> <span class="command">sudo systemctl enable --now</span> <span class="argument">nginx</span>

<span class="comment"># Hizmet etkin mi? Çalışıyor mu?</span>
<span class="prompt">$</span> <span class="command">systemctl is-enabled</span> <span class="argument">nginx</span>
<span class="prompt">$</span> <span class="command">systemctl is-active</span> <span class="argument">nginx</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>systemctl listeleme ve arama</span></div>
    <pre><code><span class="comment"># Tüm çalışan hizmetleri listele:</span>
<span class="prompt">$</span> <span class="command">systemctl list-units --type=service</span>

<span class="comment"># Başarısız hizmetleri göster:</span>
<span class="prompt">$</span> <span class="command">systemctl --failed</span>

<span class="comment"># Tüm unit dosyalarını listele (etkin/devre dışı):</span>
<span class="prompt">$</span> <span class="command">systemctl list-unit-files --type=service</span></code></pre>
</div>

<h2>journalctl — Sistem Loglarını Görüntüle</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">journalctl</span> = <span class="eng-meaning">Journal Control</span> — systemd'nin journal (günlük) alt sistemine sorgu yapar. Tüm sistem loglarını tek bir yerden okuyabilirsiniz.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>journalctl kullanımı</span></div>
    <pre><code><span class="comment"># Tüm loglar (en eskiden en yeniye):</span>
<span class="prompt">$</span> <span class="command">journalctl</span>

<span class="comment"># Belirli bir hizmetin logları:</span>
<span class="prompt">$</span> <span class="command">journalctl -u</span> <span class="argument">nginx</span>

<span class="comment"># Son 50 satır:</span>
<span class="prompt">$</span> <span class="command">journalctl -n 50</span>

<span class="comment"># Canlı takip (tail -f gibi):</span>
<span class="prompt">$</span> <span class="command">journalctl -f</span>

<span class="comment"># Belirli bir hizmeti canlı takip:</span>
<span class="prompt">$</span> <span class="command">journalctl -u</span> <span class="argument">nginx</span> <span class="argument">-f</span>

<span class="comment"># Bugünkü loglar:</span>
<span class="prompt">$</span> <span class="command">journalctl --since today</span>

<span class="comment"># Belirli zaman aralığı:</span>
<span class="prompt">$</span> <span class="command">journalctl --since</span> <span class="string">"2024-01-15 10:00"</span> <span class="argument">--until</span> <span class="string">"2024-01-15 12:00"</span>

<span class="comment"># Sadece hata ve üzeri seviye:</span>
<span class="prompt">$</span> <span class="command">journalctl -p err</span>

<span class="comment"># Log disk kullanımı:</span>
<span class="prompt">$</span> <span class="command">journalctl --disk-usage</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Sorun giderme akışı</div>
    Bir hizmet çalışmıyorsa:<br>
    1. <code>systemctl status hizmet</code> — Durumu ve son hata mesajlarını gör<br>
    2. <code>journalctl -u hizmet -n 30</code> — Son 30 log satırını incele<br>
    3. Sorunu düzelt, <code>sudo systemctl restart hizmet</code><br>
    Bu üç komut Linux sistem yönetiminin temel iş akışını oluşturur.
</div>

<h2>nice ve renice — Süreç Önceliği</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">nice</span> = <span class="eng-meaning">Nazik/Kibar</span> — Sürecin ne kadar "nazik" olacağını belirler. Yüksek nice = daha nazik = daha düşük öncelik. Değer: -20 (en yüksek öncelik) ile +19 (en düşük) arası.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>nice/renice</span></div>
    <pre><code><span class="comment"># Düşük öncelikle başlat (diğer programları yavaşlatmasın):</span>
<span class="prompt">$</span> <span class="command">nice -n 10</span> <span class="argument">ağır_program</span>

<span class="comment"># Çalışan sürecin önceliğini değiştir:</span>
<span class="prompt">$</span> <span class="command">renice 15</span> <span class="argument">-p 1234</span>

<span class="comment"># Yüksek öncelik vermek (root gerekir):</span>
<span class="prompt">$</span> <span class="command">sudo nice -n -10</span> <span class="argument">önemli_program</span></code></pre>
</div>

<h2>cron — Zamanlanmış Görevler</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Terim</div>
    <div class="eng-content">
        <span class="eng-word">cron</span> = <span class="eng-meaning">Kronos (Yunan zaman tanrısı)</span> — Belirli zamanlarda otomatik olarak komut çalıştıran zamanlayıcı daemon.
        <span class="eng-word">crontab</span> = <span class="eng-meaning">Cron Table</span> — Zamanlanmış görevlerin listesi.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>crontab formatı</span></div>
    <pre><code><span class="comment"># crontab düzenle:</span>
<span class="prompt">$</span> <span class="command">crontab -e</span>

<span class="comment"># crontab formatı:</span>
<span class="comment"># dakika  saat  gün  ay  haftanın_günü  komut</span>
<span class="comment"># (0-59)  (0-23) (1-31) (1-12) (0-7, 0 ve 7=Pazar)</span>

<span class="comment"># Her gün saat 03:00'te yedekleme:</span>
0 3 * * * /home/user/yedekle.sh

<span class="comment"># Her 15 dakikada bir:</span>
*/15 * * * * /home/user/kontrol.sh

<span class="comment"># Her Pazartesi saat 09:00'da:</span>
0 9 * * 1 /home/user/haftalik_rapor.sh

<span class="comment"># Her ayın 1'i saat 00:00'da:</span>
0 0 1 * * /home/user/aylik_temizlik.sh

<span class="comment"># Mevcut crontab'ı görüntüle:</span>
<span class="prompt">$</span> <span class="command">crontab -l</span></code></pre>
</div>

<table>
    <tr><th>Alan</th><th>Değer Aralığı</th><th>Özel Karakterler</th></tr>
    <tr><td>Dakika</td><td>0-59</td><td><code>*</code> (her), <code>,</code> (liste), <code>-</code> (aralık), <code>/</code> (adım)</td></tr>
    <tr><td>Saat</td><td>0-23</td><td>Aynı</td></tr>
    <tr><td>Gün (ay)</td><td>1-31</td><td>Aynı</td></tr>
    <tr><td>Ay</td><td>1-12</td><td>Aynı</td></tr>
    <tr><td>Gün (hafta)</td><td>0-7</td><td>0 ve 7 = Pazar</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 cron İpucu</div>
    Cron ifadelerini test etmek için <strong>crontab.guru</strong> web sitesini kullanabilirsiniz — ifadeyi yazın, insan dilinde ne anlama geldiğini gösterir.
</div>
`,
    quiz: [
        {
            question: "'ps aux' komutundaki PID nedir?",
            options: ["Program Install Directory", "Process Identification Number", "Private Interface Daemon", "Parallel Input Device"],
            correct: 1,
            explanation: "PID = Process ID (Süreç Kimlik Numarası). Her çalışan sürecin benzersiz bir numarasıdır."
        },
        {
            question: "Ctrl+Z ile Ctrl+C arasındaki fark nedir?",
            options: ["İkisi de aynı şeyi yapar", "Ctrl+Z programı askıya alır, Ctrl+C keser (durdurur)", "Ctrl+Z geri al, Ctrl+C kopyala", "Ctrl+Z kapatır, Ctrl+C devam ettirir"],
            correct: 1,
            explanation: "Ctrl+Z SIGTSTP sinyali gönderir (askıya al). Program duraklar ama bellekte kalır. Ctrl+C SIGINT gönderir (kes/durdur)."
        },
        {
            question: "'systemctl enable nginx' ne yapar?",
            options: ["nginx'i hemen başlatır", "nginx'i durdurur", "Sistem açılışında nginx'i otomatik başlatmayı etkinleştirir", "nginx log dosyalarını gösterir"],
            correct: 2,
            explanation: "systemctl enable bir hizmeti sistem açılışında otomatik başlayacak şekilde yapılandırır. Hemen başlatmaz — bunun için 'start' veya '--now' bayrağı gerekir."
        },
        {
            question: "Bir hizmetin neden başarısız olduğunu görmek için hangi komutu kullanırsınız?",
            options: ["ps aux | grep hizmet", "top", "journalctl -u hizmet", "cat /var/log/hizmet"],
            correct: 2,
            explanation: "journalctl -u hizmet komutu, systemd journal'ından belirtilen hizmetin tüm loglarını gösterir. Modern Linux'ta sorun gidermenin en temel aracıdır."
        },
        {
            question: "'0 3 * * * /yedekle.sh' crontab ifadesi ne zaman çalışır?",
            options: ["3 dakikada bir", "Her gün saat 03:00'te", "Her 3 saatte bir", "Ayda 3 kez"],
            correct: 1,
            explanation: "Format: dakika(0) saat(3) gün(*) ay(*) haftaGünü(*). Yani: saat 3, dakika 0, her gün, her ay, haftanın her günü = Her gün 03:00'te."
        },
        {
            question: "Daemon nedir?",
            options: ["Bir virüs türü", "Arka planda terminal bağlantısı olmadan çalışan hizmet süreci", "root kullanıcısı", "Bir dosya sistemi türü"],
            correct: 1,
            explanation: "Daemon, arka planda sessizce çalışan, kullanıcı etkileşimi gerektirmeyen hizmet sürecidir. Genellikle ismi 'd' ile biter: sshd, httpd, cron, systemd."
        }
    ]
});
