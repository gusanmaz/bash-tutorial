// ===== Bölüm 25: Ağ ve DNS =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 25,
    title: 'Ağ ve DNS',
    subtitle: 'Network & DNS Troubleshooting',
    icon: '📡',
    description: 'ping, ip, ss, dig, host — bağlantı ve DNS sorunlarını terminalden teşhis etme.',
    content: `
<h2>Bu Bölüm Nerede Duruyor?</h2>
<div class="info-box tip">
    <div class="info-box-title">💡 Önceki bölümlerle ilişki</div>
    <strong>Bölüm 18</strong> — HTTP ile veri indirme (<code>curl</code>, <code>wget</code>).<br>
    <strong>Bölüm 14</strong> — Uzak sunucuya bağlanma (<code>ssh</code>).<br>
    Bu bölüm — "İnternet var mı? DNS çalışıyor mu? Port dinleniyor mu?" sorularını cevaplar. curl/SSH hata vermeden önce buradan başlayın.
</div>

<h2>Sorun Giderme Akışı</h2>
<p>curl, SSH veya tarayıcı hata verdiğinde sorunu katman katman daraltın:</p>
<div class="code-block">
    <div class="code-block-header"><span>Teşhis ağacı</span></div>
    <pre><code>1. ip link          → Ağ kartı UP mı?
2. ip addr           → IP alınmış mı? (DHCP/static)
3. ip route          → Varsayılan gateway var mı?
4. ping GATEWAY      → Router'a ulaşılıyor mu?
5. ping 8.8.8.8      → İnternet (DNS'siz) var mı?
6. ping site.com     → DNS çözümlemesi çalışıyor mu?
7. dig site.com      → Hangi DNS cevap veriyor?
8. curl -I URL       → HTTP katmanı çalışıyor mu?
9. ss -tulpn         → Yerel servis dinliyor mu?</code></pre>
</div>

<h2>ping — Erişilebilirlik Testi</h2>
<div class="code-block">
    <div class="code-block-header"><span>ping</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">ping -c 4</span> <span class="argument">8.8.8.8</span>
<span class="comment"># -c 4: 4 paket gönder (Linux)</span>

<span class="prompt">$</span> <span class="command">ping -c 3</span> <span class="argument">google.com</span>
<span class="comment"># IP çözülüyorsa DNS de çalışıyor demektir</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 ping başarısız olabilir</div>
    Bazı sunucular ICMP (ping) paketlerini bilinçli engeller. Ping başarısız ≠ mutlaka internet yok. <code>curl -I https://example.com</code> ile de test edin.
</div>

<h2>ip — Modern Ağ Yapılandırması</h2>
<div class="info-box note">
    <div class="info-box-title">📌 ifconfig yerine ip</div>
    <code>ifconfig</code> eski araçtır. Güncel Linux'ta <code>ip</code> komut ailesi tercih edilir (Bölüm 2'de <code>/sbin</code> altında geçmişti).
</div>
<div class="code-block">
    <div class="code-block-header"><span>ip komutları</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">ip addr</span>          <span class="comment"># IP adresleri (kısa: ip a)</span>
<span class="prompt">$</span> <span class="command">ip route</span>         <span class="comment"># Yönlendirme tablosu, varsayılan gateway</span>
<span class="prompt">$</span> <span class="command">ip link</span>          <span class="comment"># Ağ arayüzleri (eth0, wlan0, durum up/down)</span>

<span class="comment"># Örnek çıktı yorumu:</span>
<span class="comment"># inet 192.168.1.50/24 → yerel IP (/24 = 255.255.255.0 mask)</span>
<span class="comment"># inet6 ... → IPv6 adresi</span>
<span class="comment"># state UP → arayüz aktif</span>
<span class="comment"># default via 192.168.1.1 dev wlan0 → varsayılan gateway</span>

<span class="prompt">$</span> <span class="command">ip neigh</span>         <span class="comment"># ARP tablosu — aynı ağdaki cihazlar</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 CIDR kısa not</div>
    <code>192.168.1.50/24</code> = IP + ağ maskesi. <code>/24</code> → son oktet host (256 adres, 254 kullanılabilir). <code>/32</code> = tek host. Bulut/VPS panelinde bu notasyon sık görülür.
</div>

<h3>/etc/hosts — yerel DNS geçersiz kılma</h3>
<div class="code-block">
    <div class="code-block-header"><span>hosts dosyası</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">cat</span> <span class="path">/etc/hosts</span>
127.0.0.1   localhost
127.0.1.1   benim-pc
192.168.1.10  dev-api.local   <span class="comment"># test için manuel eşleme</span>
<span class="comment"># DNS'e gitmeden önce hosts okunur — geliştirme ortamında kullanışlı</span></code></pre>
</div>

<h2>ss — Port ve Bağlantılar</h2>
<div class="eng-box">
    <div class="eng-title">🔤 Terim</div>
    <div class="eng-content">
        <span class="eng-word">ss</span> = <span class="eng-meaning">Socket Statistics</span> — <code>netstat</code>'ın modern yerine geçeni. Hangi portların dinlendiğini ve aktif bağlantıları gösterir.
    </div>
</div>
<div class="code-block">
    <div class="code-block-header"><span>ss örnekleri</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">ss -tulpn</span>
<span class="comment"># -t TCP, -u UDP, -l listening, -p process, -n sayısal port</span>

<span class="prompt">$</span> <span class="command">ss -tulpn</span> <span class="argument">|</span> <span class="command">grep</span> <span class="string">:22</span>
<span class="comment"># SSH (22) dinleniyor mu?</span>

<span class="prompt">$</span> <span class="command">ss -t state established</span>
<span class="comment"># Aktif TCP bağlantıları</span>

<span class="prompt">$</span> <span class="command">ss -tulpn</span> <span class="argument">|</span> <span class="command">grep</span> <span class="string">:8080</span>
<span class="comment"># Uygulama 8080'de dinliyor mu?</span></code></pre>
</div>

<h3>ss durumları (state)</h3>
<table>
    <tr><th>Durum</th><th>Anlam</th></tr>
    <tr><td><code>LISTEN</code></td><td>Port dinleniyor — sunucu hazır</td></tr>
    <tr><td><code>ESTAB</code></td><td>Aktif bağlantı kurulmuş</td></tr>
    <tr><td><code>TIME-WAIT</code></td><td>Bağlantı kapandı, soket bekliyor (normal)</td></tr>
    <tr><td><code>CLOSE-WAIT</code></td><td>Karşı taraf kapattı, uygulama hâlâ tutuyor (sızıntı şüphesi)</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Port testi — nc (netcat)</div>
    Uzak port açık mı: <code>nc -zv hedef 443</code> veya <code>timeout 3 bash -c 'cat &lt;/dev/tcp/hedef/443'</code> (bash built-in). curl HTTP için, nc ham TCP için.
</div>

<h2>dig ve host — DNS</h2>
<div class="code-block">
    <div class="code-block-header"><span>DNS sorguları</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">dig</span> <span class="argument">google.com</span>
<span class="comment"># A kaydı, hangi DNS sunucusu cevap verdi (SERVER satırı)</span>

<span class="prompt">$</span> <span class="command">dig</span> <span class="argument">+short google.com</span>
<span class="output">142.250.185.78</span>

<span class="prompt">$</span> <span class="command">host</span> <span class="argument">github.com</span>
<span class="output">github.com has address 140.82.121.4</span>

<span class="prompt">$</span> <span class="command">cat</span> <span class="path">/etc/resolv.conf</span>
<span class="comment"># Sistem hangi DNS sunucularını kullanıyor?</span>

<span class="prompt">$</span> <span class="command">dig</span> <span class="argument">MX</span> <span class="argument">google.com</span> <span class="argument">+short</span>
<span class="comment"># Mail sunucusu kaydı</span>

<span class="prompt">$</span> <span class="command">dig</span> <span class="argument">@8.8.8.8</span> <span class="argument">site.com</span>
<span class="comment"># Belirli DNS sunucusuna doğrudan sor (yerel DNS'i bypass)</span>

<span class="prompt">$</span> <span class="command">resolvectl status</span>
<span class="comment"># systemd-resolved kullanan sistemlerde (Ubuntu 22.04+)</span></code></pre>
</div>

<h3>DNS kayıt türleri (kısa)</h3>
<table>
    <tr><th>Tip</th><th>Ne için?</th></tr>
    <tr><td><code>A</code></td><td>Alan adı → IPv4</td></tr>
    <tr><td><code>AAAA</code></td><td>Alan adı → IPv6</td></tr>
    <tr><td><code>CNAME</code></td><td>Takma ad (başka isme yönlendir)</td></tr>
    <tr><td><code>MX</code></td><td>Mail sunucusu</td></tr>
    <tr><td><code>NS</code></td><td>Yetkili DNS sunucuları</td></tr>
    <tr><td><code>TXT</code></td><td>SPF, doğrulama metinleri</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Yaygın hata kalıpları</div>
    <table style="margin-top:0.5em">
        <tr><th>Belirti</th><th>Olası neden</th><th>Kontrol</th></tr>
        <tr><td><code>Could not resolve host</code></td><td>DNS</td><td><code>dig</code>, <code>/etc/resolv.conf</code></td></tr>
        <tr><td><code>Connection refused</code></td><td>Port kapalı / servis yok</td><td><code>ss -tulpn</code>, servis status</td></tr>
        <tr><td><code>Connection timed out</code></td><td>Firewall / routing</td><td><code>ping</code>, <code>ufw</code>, bulut security group</td></tr>
        <tr><td><code>No route to host</code></td><td>Gateway / ağ yapılandırması</td><td><code>ip route</code></td></tr>
    </table>
</div>

<h2>traceroute / tracepath / mtr</h2>
<div class="code-block">
    <div class="code-block-header"><span>Rota takibi</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">traceroute</span> <span class="argument">google.com</span>
<span class="comment"># Paketlerin geçtiği router'lar (firewall izin gerekebilir)</span>

<span class="prompt">$</span> <span class="command">tracepath</span> <span class="argument">google.com</span>
<span class="comment"># root gerektirmeyen alternatif</span>

<span class="prompt">$</span> <span class="command">mtr -rw google.com</span>
<span class="comment"># ping + traceroute birleşik; paket kaybı ve gecikme (Ctrl+C ile rapor)</span></code></pre>
</div>
`,
    quiz: [
        {
            question: "ping google.com çalışıyor ama ping 8.8.8.8 çalışmıyorsa ne düşünülür?",
            options: [
                "Genelde tersi beklenir; IP ping başarısızsa routing/firewall, isim başarısızsa DNS",
                "DNS kesin bozuk",
                "SSH kapalı",
                "Disk dolu"
            ],
            correct: 0,
            explanation: "IP ping internet/routing testi; isim ping DNS testi. IP başarısızsa DNS'e gelmeden ağ sorunu vardır."
        },
        {
            question: "Hangi komut dinlenen TCP portlarını process adıyla gösterir?",
            options: ["ss -tulpn", "ip addr", "df -h", "uname -a"],
            correct: 0,
            explanation: "ss -tulpn listening socket'leri ve -p ile hangi sürecin dinlediğini gösterir."
        },
        {
            question: "dig komutu ne için kullanılır?",
            options: ["DNS kayıtlarını sorgulamak", "Disk kullanımı", "Dosya sıkıştırma", "Süreç öldürme"],
            correct: 0,
            explanation: "dig (domain information groper) DNS sunucusuna sorgu gönderir."
        },
        {
            question: "Modern Linux'ta ifconfig yerine hangi komut önerilir?",
            options: ["ip addr", "netcat", "route print", "hostname"],
            correct: 0,
            explanation: "iproute2 paketindeki ip komutu güncel standarttır."
        },
        {
            question: "Connection refused hatası genelde ne anlama gelir?",
            options: [
                "Hedef makineye ulaşıldı ama portta dinleyen servis yok",
                "DNS çözülemedi",
                "Disk dolu",
                "SSH anahtarı geçersiz"
            ],
            correct: 0,
            explanation: "Timeout firewall/routing; refused ise ağ var ama port kapalı veya uygulama çalışmıyor."
        },
        {
            question: "dig @8.8.8.8 site.com ne yapar?",
            options: [
                "Sorguyu doğrudan 8.8.8.8 DNS sunucusuna gönderir",
                "Siteyi 8.8.8.8 IP'sine yönlendirir",
                "8 saniye bekler",
                "Sadece IPv8 döner"
            ],
            correct: 0,
            explanation: "@ ile belirtilen DNS sunucusu kullanılır — yerel DNS sorununu ayırt etmek için."
        }
    ]
});
