// ===== Bölüm 26: Loglar ve Temel Güvenlik =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 26,
    title: 'Loglar ve Temel Güvenlik',
    subtitle: 'Logs, Sessions & Firewall Basics',
    icon: '📋',
    description: '/var/log, tail -f, who/w/last, ufw — sistem loglarını okuma ve temel güvenlik duvarı.',
    content: `
<h2>İki Log Dünyası</h2>
<div class="info-box tip">
    <div class="info-box-title">💡 journalctl vs /var/log</div>
    <strong>Bölüm 12</strong>'de <code>journalctl</code> (systemd journal) gördünüz. Klasik dağıtımlarda ve birçok uygulamada hâlâ <code>/var/log</code> altında düz metin log dosyaları vardır. İkisini birlikte bilin.
</div>

<table>
    <tr><th>Kaynak</th><th>Ne zaman?</th></tr>
    <tr><td><code>journalctl</code></td><td>systemd servisleri, çekirdek, birleşik sorgu</td></tr>
    <tr><td><code>/var/log/*.log</code></td><td>nginx, apache, uygulama logları, eski syslog</td></tr>
</table>

<h2>/var/log — Önemli Dosyalar</h2>
<table>
    <tr><th>Dosya / dizin</th><th>İçerik</th></tr>
    <tr><td><code>/var/log/syslog</code></td><td>Genel sistem mesajları (Debian/Ubuntu)</td></tr>
    <tr><td><code>/var/log/auth.log</code></td><td>SSH giriş, sudo, kimlik doğrulama</td></tr>
    <tr><td><code>/var/log/kern.log</code></td><td>Çekirdek mesajları</td></tr>
    <tr><td><code>/var/log/nginx/</code></td><td>Web sunucusu access/error log</td></tr>
    <tr><td><code>/var/log/journal/</code></td><td>systemd journal binary dosyaları</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Dağıtıma göre fark</div>
    Debian/Ubuntu: <code>syslog</code>, <code>auth.log</code>. RHEL/CentOS/Fedora: <code>/var/log/messages</code>, <code>secure</code> (auth karşılığı). Nginx/Apache log yolları dağıtıma göre <code>/var/log/nginx/</code> veya <code>/var/log/httpd/</code> olabilir.
</div>

<h2>journalctl vs grep — ne zaman hangisi?</h2>
<table>
    <tr><th>Durum</th><th>Aracı</th></tr>
    <tr><td>systemd servis logu (nginx, ssh, docker)</td><td><code>journalctl -u servis</code></td></tr>
    <tr><td>Boot sonrası çekirdek hataları</td><td><code>journalctl -k</code> veya <code>dmesg</code></td></tr>
    <tr><td>Uygulama kendi dosyasına yazıyor</td><td><code>tail -f /var/log/uygulama.log</code></td></tr>
    <tr><td>Tüm loglarda kelime ara</td><td><code>journalctl --grep="error"</code> veya <code>grep -r error /var/log/</code></td></tr>
</table>

<h2>Log Okuma Teknikleri</h2>
<div class="code-block">
    <div class="code-block-header"><span>Canlı ve geçmiş log</span></div>
    <pre><code><span class="comment"># Son 50 satır:</span>
<span class="prompt">$</span> <span class="command">tail -n 50</span> <span class="path">/var/log/syslog</span>

<span class="comment"># Canlı izle (Ctrl+C ile çık):</span>
<span class="prompt">$</span> <span class="command">tail -f</span> <span class="path">/var/log/nginx/error.log</span>

<span class="comment"># less ile gezin + canlı mod:</span>
<span class="prompt">$</span> <span class="command">less +F</span> <span class="path">/var/log/syslog</span>
<span class="comment"># Ctrl+C duraklat, q çık</span>

<span class="comment"># Hata satırlarını filtrele (Bölüm 9-11):</span>
<span class="prompt">$</span> <span class="command">grep -i error</span> <span class="path">/var/log/syslog</span> <span class="argument">|</span> <span class="command">tail -20</span>

<span class="comment"># journalctl ile servis logu:</span>
<span class="prompt">$</span> <span class="command">journalctl</span> <span class="argument">-u nginx</span> <span class="argument">-f</span> <span class="argument">--since "1 hour ago"</span>

<span class="comment"># Bugünkü hatalar:</span>
<span class="prompt">$</span> <span class="command">journalctl</span> <span class="argument">-p err</span> <span class="argument">--since today</span>
<span class="comment"># -p err: priority error ve üzeri (emerg, alert, crit, err)</span>

<span class="comment"># İki zaman arası nginx access (dosya log):</span>
<span class="prompt">$</span> <span class="command">grep</span> <span class="string">"POST /api"</span> <span class="path">/var/log/nginx/access.log</span> <span class="argument">|</span> <span class="command">tail -50</span></code></pre>
</div>

<h3>nginx access.log satırı (örnek)</h3>
<div class="code-block">
    <div class="code-block-header"><span>Log satırını okuma</span></div>
    <pre><code>192.168.1.5 - - [21/May/2026:14:32:01 +0300] "GET /api/users HTTP/1.1" 200 1234 "-" "curl/8.5"
<span class="comment"># IP | zaman | istek | durum kodu | byte | referer | user-agent</span>
<span class="comment"># 404/500 yoğunluğu → uygulama veya routing sorunu</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Logrotate</div>
    Log dosyaları büyür; <code>logrotate</code> eski logları sıkıştırıp arşivler (<code>syslog.1.gz</code>, <code>syslog.2.gz</code>). Yapılandırma: <code>/etc/logrotate.d/</code>. Disk dolduğunda Bölüm 23'teki <code>du -sh /var/log/*</code> ile kontrol edin — bazen eski <code>.gz</code> loglar GB tutar.
</div>

<h2>Kim Giriş Yaptı? — who, w, last</h2>
<div class="code-block">
    <div class="code-block-header"><span>Oturum komutları</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">who</span>           <span class="comment"># Oturum açmış kullanıcılar</span>
<span class="prompt">$</span> <span class="command">w</span>             <span class="comment"># who + ne yapıyorlar, load average</span>
<span class="prompt">$</span> <span class="command">last</span>          <span class="comment"># Geçmiş giriş kayıtları (/var/log/wtmp)</span>
<span class="prompt">$</span> <span class="command">last -n 20</span>    <span class="comment"># Son 20 kayıt</span>
<span class="prompt">$</span> <span class="command">lastb</span>         <span class="comment"># Başarısız giriş denemeleri (Bölüm 17)</span>
<span class="prompt">$</span> <span class="command">id</span>            <span class="comment"># uid, gid, gruplar</span>
<span class="prompt">$</span> <span class="command">id username</span>   <span class="comment"># Başka kullanıcının kimliği</span></code></pre>
</div>

<h3>auth.log satırı okuma</h3>
<div class="code-block">
    <div class="code-block-header"><span>SSH brute-force izi</span></div>
    <pre><code>May 21 14:32:01 srv sshd[12345]: Failed password for invalid user admin from 203.0.113.50 port 54321 ssh2
May 21 14:32:05 srv sshd[12345]: Failed password for root from 203.0.113.50 port 54322 ssh2
<span class="comment"># Aynı IP'den çok deneme → fail2ban / ufw deny adayı</span>

May 21 14:35:00 srv sshd[12399]: Accepted publickey for deploy from 192.168.1.10 port 22 ssh2
<span class="comment"># Başarılı giriş — publickey normalde iyi işaret</span></code></pre>
</div>

<h2>ufw — Temel Güvenlik Duvarı</h2>
<div class="eng-box">
    <div class="eng-title">🔤 Terim</div>
    <div class="eng-content">
        <span class="eng-word">ufw</span> = <span class="eng-meaning">Uncomplicated Firewall</span> — iptables üzerinde basit arayüz. Ubuntu'da yaygın.<br>
        <span class="eng-word">fail2ban</span> — Brute-force SSH denemelerinde IP'yi geçici banlar (kavramsal; ayrı paket).
    </div>
</div>
<div class="code-block">
    <div class="code-block-header"><span>ufw temel komutlar</span></div>
    <pre><code><span class="comment"># Önerilen sıra — önce kurallar, sonra enable:</span>
<span class="prompt">$</span> <span class="command">sudo ufw default deny incoming</span>
<span class="prompt">$</span> <span class="command">sudo ufw default allow outgoing</span>
<span class="prompt">$</span> <span class="command">sudo ufw allow 22/tcp</span>    <span class="comment"># SSH — enable'dan ÖNCE!</span>
<span class="prompt">$</span> <span class="command">sudo ufw allow 80,443/tcp</span>
<span class="prompt">$</span> <span class="command">sudo ufw enable</span>
<span class="prompt">$</span> <span class="command">sudo ufw status numbered</span>  <span class="comment"># Numaralı kurallar — silmek için ufw delete N</span>

<span class="prompt">$</span> <span class="command">sudo ufw deny from 203.0.113.50</span>
<span class="prompt">$</span> <span class="command">sudo ufw allow from 192.168.1.0/24 to any port 3306</span>  <span class="comment"># Sadece yerel ağ DB</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ SSH'yi kilitlemeyin!</div>
    Uzak sunucuda ufw açmadan önce <strong>SSH portuna (22) izin</strong> verin. Aksi halde kendinizi dışarıda bırakırsınız. Bölüm 14 SSH hardening ile birlikte düşünün.
</div>

<div class="info-box note">
    <div class="info-box-title">📌 fail2ban — nasıl çalışır?</div>
    <code>/etc/fail2ban/jail.local</code> örneği:<br>
    <code>[sshd]</code> jail'i <code>auth.log</code>'u izler; 5 dakikada 5 başarısız deneme → IP 1 saat ban.<br>
    Kurulum: <code>sudo apt install fail2ban</code>, <code>sudo systemctl enable --now fail2ban</code>, durum: <code>sudo fail2ban-client status sshd</code>. ufw ile birlikte katmanlı savunma sağlar (Bölüm 14 SSH hardening).
</div>

<h2>Pratik: Şüpheli giriş araştırması</h2>
<div class="code-block">
    <div class="code-block-header"><span>Adımlar</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">sudo grep "Failed password"</span> <span class="path">/var/log/auth.log</span> <span class="argument">|</span> <span class="command">tail -20</span>
<span class="prompt">$</span> <span class="command">sudo lastb</span> <span class="argument">|</span> <span class="command">head</span>
<span class="prompt">$</span> <span class="command">who</span>
<span class="prompt">$</span> <span class="command">sudo ss -tulpn</span> <span class="argument">|</span> <span class="command">grep LISTEN</span>   <span class="comment"># Gereksiz açık port var mı?</span>

<span class="prompt">$</span> <span class="command">sudo journalctl</span> <span class="argument">-u ssh</span> <span class="argument">--since "24 hours ago"</span> <span class="argument">|</span> <span class="command">grep -i fail</span></code></pre>
</div>

<h2>Özet</h2>
<table>
    <tr><th>İhtiyaç</th><th>Komut</th></tr>
    <tr><td>Canlı log</td><td><code>tail -f</code>, <code>journalctl -f</code></td></tr>
    <tr><td>SSH saldırı izi</td><td><code>grep Failed /var/log/auth.log</code></td></tr>
    <tr><td>Kim bağlı?</td><td><code>w</code>, <code>who</code></td></tr>
    <tr><td>Firewall aç/kapat</td><td><code>ufw allow/deny</code></td></tr>
    <tr><td>Otomatik IP ban</td><td>fail2ban</td></tr>
</table>
`,
    quiz: [
        {
            question: "tail -f log.txt ne yapar?",
            options: [
                "Dosyanın sonuna yeni eklenen satırları canlı gösterir",
                "Dosyayı siler",
                "İlk 10 satırı gösterir",
                "Log dosyasını sıkıştırır"
            ],
            correct: 0,
            explanation: "tail -f (follow) dosya büyüdükçe yeni satırları ekrana yazar — log izlemenin klasik yolu."
        },
        {
            question: "Başarısız SSH giriş denemeleri genelde hangi logda aranır?",
            options: ["/var/log/auth.log", "/var/log/nginx/access.log", "/var/log/dpkg.log", "/etc/passwd"],
            correct: 0,
            explanation: "auth.log (veya RHEL'de secure) kimlik doğrulama olaylarını tutar."
        },
        {
            question: "ufw allow 22/tcp ne yapar?",
            options: ["TCP 22 portuna (SSH) gelen trafiğe izin verir", "22. satırı siler", "SSH servisini durdurur", "Sadece UDP 22'yi açar"],
            correct: 0,
            explanation: "ufw basit firewall kuralları tanımlar; 22/tcp SSH için standart port."
        },
        {
            question: "last komutu ne gösterir?",
            options: ["Kullanıcı giriş geçmişi", "Son kurulan paketler", "Son commit'ler", "Son açılan dosyalar"],
            correct: 0,
            explanation: "last, wtmp dosyasından oturum açma/kapama kayıtlarını listeler."
        },
        {
            question: "journalctl -p err ne gösterir?",
            options: [
                "Error ve daha ciddi öncelikli mesajları",
                "Sadece nginx loglarını",
                "Son 24 saatin tüm loglarını",
                "Sadece stderr çıktısını"
            ],
            correct: 0,
            explanation: "-p (priority) err → emerg, alert, crit, err seviyesindeki journal kayıtları."
        }
    ]
});
