// ===== Bölüm 14: SSH — Güvenli Uzak Bağlantı =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 14,
    title: 'SSH — Güvenli Uzak Bağlantı',
    subtitle: 'Secure Shell (SSH)',
    icon: '🔒',
    description: 'SSH ile uzak sunuculara güvenli bağlantı, anahtar tabanlı kimlik doğrulama, SCP/SFTP dosya transferi, tünelleme ve SSH yapılandırması.',
    content: `
<h2>SSH Nedir?</h2>
<p><strong>SSH (Secure Shell)</strong>, ağ üzerindeki bir bilgisayara <strong>şifreli (encrypted)</strong> bir kanal üzerinden güvenli bağlantı kurmanızı sağlayan bir protokoldür. 1995'te Tatu Ylönen tarafından, güvensiz olan Telnet ve rsh (remote shell) protokollerinin yerine geliştirilmiştir.</p>

<p>SSH, günümüzde Linux sistem yönetiminin <strong>en temel aracıdır</strong>. Sunucu yönetimi, uzaktan geliştirme, dosya transferi, tünelleme ve Git operasyonlarının büyük çoğunluğu SSH üzerinden gerçekleştirilir.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">SSH</span> = <span class="eng-meaning">Secure Shell</span> — Güvenli kabuk. Şifreli uzak bağlantı protokolü.<br>
        <span class="eng-word">Public Key</span> = <span class="eng-meaning">Açık Anahtar</span> — Herkesle paylaşılabilen anahtar. Kilit gibidir.<br>
        <span class="eng-word">Private Key</span> = <span class="eng-meaning">Özel Anahtar</span> — Sadece sizde kalması gereken anahtar. Anahtar gibidir.<br>
        <span class="eng-word">Fingerprint</span> = <span class="eng-meaning">Parmak İzi</span> — Bir anahtarın benzersiz özeti.<br>
        <span class="eng-word">Port Forwarding</span> = <span class="eng-meaning">Port Yönlendirme</span> — Ağ trafiğini SSH tüneli üzerinden yönlendirme.<br>
        <span class="eng-word">SCP</span> = <span class="eng-meaning">Secure Copy Protocol</span> — SSH üzerinden dosya kopyalama.<br>
        <span class="eng-word">SFTP</span> = <span class="eng-meaning">SSH File Transfer Protocol</span> — SSH üzerinden FTP benzeri dosya transferi.
    </div>
</div>

<h2>SSH Nasıl Çalışır?</h2>
<p>SSH bağlantısı üç aşamada kurulur:</p>

<div class="info-box note">
    <div class="info-box-title">📌 SSH Bağlantı Süreci</div>
    <strong>1. TCP Bağlantısı:</strong> İstemci (client), sunucunun (server) 22 numaralı portuna TCP bağlantısı kurar.<br><br>
    <strong>2. Anahtar Değişimi (Key Exchange):</strong> İstemci ve sunucu, Diffie-Hellman gibi bir algoritma ile <em>oturum anahtarı (session key)</em> üzerinde anlaşır. Bu aşamada henüz kimlik doğrulama yapılmamıştır ama iletişim şifrelenmiştir.<br><br>
    <strong>3. Kimlik Doğrulama (Authentication):</strong> Kullanıcı şifre veya SSH anahtarı ile kimliğini kanıtlar. Başarılı olursa, şifreli bir oturum (session) başlar.
</div>

<img src="img/ssh_connection_flow.svg" alt="SSH Bağlantı Akışı Diyagramı" style="max-width:100%; margin: 1.5rem 0; border-radius: 8px;">

<h3>Asimetrik ve Simetrik Şifreleme</h3>
<p>SSH, <strong>iki tür şifreleme</strong> kullanır:</p>
<table>
    <tr><th>Tür</th><th>İngilizce</th><th>Kullanım</th><th>Açıklama</th></tr>
    <tr><td>Asimetrik</td><td>Asymmetric Encryption</td><td>Anahtar değişimi ve kimlik doğrulama</td><td>İki anahtar (public + private). Biri ile şifrelenen diğeriyle açılır.</td></tr>
    <tr><td>Simetrik</td><td>Symmetric Encryption</td><td>Veri aktarımı (oturum boyunca)</td><td>Tek anahtar ile şifreleme/çözmek. Çok daha hızlı.</td></tr>
</table>
<p>Yani: asimetrik şifreleme ile güvenli bir şekilde <em>ortak anahtar</em> paylaşılır, sonra simetrik şifreleme ile veri aktarılır. Bu <strong>hybrid encryption</strong> yaklaşımıdır.</p>

<h2>Temel SSH Kullanımı</h2>

<h3>Uzak Sunucuya Bağlanma</h3>
<div class="code-block">
    <div class="code-block-header"><span>SSH ile bağlanma</span></div>
    <pre><code><span class="comment"># Temel bağlanma:</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="argument">kullanici@sunucu.com</span>

<span class="comment"># IP adresi ile:</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="argument">root@192.168.1.100</span>

<span class="comment"># Farklı port kullanma (varsayılan: 22):</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="flag">-p 2222</span> <span class="argument">kullanici@sunucu.com</span>

<span class="comment"># Belirli bir anahtar dosyası ile:</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="flag">-i ~/.ssh/ozel_anahtar</span> <span class="argument">kullanici@sunucu.com</span>

<span class="comment"># Uzak sunucuda tek komut çalıştırma:</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="argument">kullanici@sunucu.com</span> <span class="string">"uptime && df -h"</span>

<span class="comment"># Verbose (detaylı) mod — hata ayıklama için:</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="flag">-v</span> <span class="argument">kullanici@sunucu.com</span>
<span class="comment"># -vv veya -vvv daha detaylı çıktı verir</span></code></pre>
</div>

<h3>İlk Bağlantıda Parmak İzi Doğrulama</h3>
<p>Bir sunucuya ilk bağlandığınızda şu mesajı görürsünüz:</p>
<div class="code-block">
    <div class="code-block-header"><span>İlk bağlantı mesajı</span></div>
    <pre><code>The authenticity of host 'sunucu.com (93.184.216.34)' can't be established.
ED25519 key fingerprint is SHA256:xRAkZ3mOk72P...
Are you sure you want to continue connecting (yes/no/[fingerprint])?</code></pre>
</div>
<p>"yes" dediğinizde sunucunun açık anahtarı <code>~/.ssh/known_hosts</code> dosyasına kaydedilir. Sonraki bağlantılarda bu parmak izi kontrol edilir — <strong>değişmişse uyarı verilir</strong> (olası man-in-the-middle saldırısı!).</p>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Host Key Değişti Uyarısı</div>
    <code>WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!</code> mesajı alırsanız, ya sunucu yeniden kurulmuştur ya da birileri araya girmeye çalışıyor olabilir. Güvenli olduğundan eminseniz:<br>
    <code>ssh-keygen -R sunucu.com</code> — eski anahtarı siler, tekrar bağlanabilirsiniz.
</div>

<h2>SSH Anahtar Tabanlı Kimlik Doğrulama</h2>
<p>Şifre yerine <strong>SSH anahtarları</strong> kullanmak hem daha güvenli hem daha pratiktir. Şifre brute-force saldırılarına açıktır ama SSH anahtarlarını kırmak pratikte imkansızdır.</p>

<h3>Anahtar Çifti Oluşturma</h3>
<div class="code-block">
    <div class="code-block-header"><span>SSH anahtar oluşturma</span></div>
    <pre><code><span class="comment"># Ed25519 algoritması ile (önerilen, modern ve güvenli):</span>
<span class="prompt">$</span> <span class="command">ssh-keygen</span> <span class="flag">-t ed25519</span> <span class="flag">-C</span> <span class="string">"ali@email.com"</span>

<span class="comment"># Çıktı:</span>
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/ali/.ssh/id_ed25519): <span class="comment"># Enter'a bas</span>
Enter passphrase (empty for no passphrase): <span class="comment"># Parola belirle (önerilir)</span>
Enter same passphrase again:

Your identification has been saved in /home/ali/.ssh/id_ed25519       <span class="comment"># ← Özel anahtar</span>
Your public key has been saved in /home/ali/.ssh/id_ed25519.pub   <span class="comment"># ← Açık anahtar</span>

<span class="comment"># RSA ile (eski sistemler için, 4096 bit):</span>
<span class="prompt">$</span> <span class="command">ssh-keygen</span> <span class="flag">-t rsa -b 4096</span> <span class="flag">-C</span> <span class="string">"ali@email.com"</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Hangi Algoritmayı Seçmeli?</div>
    <strong>Ed25519</strong> (önerilen): Daha kısa anahtar, daha hızlı, aynı güvenlik seviyesi. Modern sistemlerde varsayılan tercih.<br>
    <strong>RSA 4096</strong>: Daha eski, ama neredeyse tüm sistemlerle uyumlu. Eski sistemlere bağlanmanız gerekiyorsa kullanın.<br>
    <strong>ECDSA</strong>: Orta yol, ama bazı güvenlik endişeleri var (NSA ile ilişkili eğri). Ed25519 tercih edin.
</div>

<h3>Açık Anahtarı Sunucuya Kopyalama</h3>
<div class="code-block">
    <div class="code-block-header"><span>Anahtarı sunucuya gönderme</span></div>
    <pre><code><span class="comment"># Kolay yol — ssh-copy-id:</span>
<span class="prompt">$</span> <span class="command">ssh-copy-id</span> <span class="argument">kullanici@sunucu.com</span>

<span class="comment"># Manuel yol (ssh-copy-id yoksa):</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="path">~/.ssh/id_ed25519.pub</span> | <span class="command">ssh</span> <span class="argument">kullanici@sunucu.com</span> <span class="string">"mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"</span>

<span class="comment"># Artık şifresiz bağlanabilirsiniz:</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="argument">kullanici@sunucu.com</span>  <span class="comment"># Parola sormaz!</span></code></pre>
</div>

<h3>SSH Anahtar Dosyaları ve İzinleri</h3>
<table>
    <tr><th>Dosya</th><th>Açıklama</th><th>İzin</th></tr>
    <tr><td><code>~/.ssh/</code></td><td>SSH yapılandırma dizini</td><td><code>700</code> (drwx------)</td></tr>
    <tr><td><code>~/.ssh/id_ed25519</code></td><td>Özel anahtar (private key)</td><td><code>600</code> (-rw-------)</td></tr>
    <tr><td><code>~/.ssh/id_ed25519.pub</code></td><td>Açık anahtar (public key)</td><td><code>644</code> (-rw-r--r--)</td></tr>
    <tr><td><code>~/.ssh/authorized_keys</code></td><td>Kabul edilen açık anahtarlar (sunucuda)</td><td><code>600</code> (-rw-------)</td></tr>
    <tr><td><code>~/.ssh/known_hosts</code></td><td>Bilinen sunucu parmak izleri</td><td><code>644</code> (-rw-r--r--)</td></tr>
    <tr><td><code>~/.ssh/config</code></td><td>İstemci yapılandırma dosyası</td><td><code>600</code> (-rw-------)</td></tr>
</table>

<div class="info-box warning">
    <div class="info-box-title">⚠️ İzinler Kritiktir!</div>
    SSH, izinleri çok sıkı kontrol eder. Özel anahtarınızın izni <code>600</code>'den farklıysa bağlantı reddedilir:<br>
    <code>Permissions 0644 for '/home/ali/.ssh/id_ed25519' are too open.</code><br>
    Düzeltme: <code>chmod 600 ~/.ssh/id_ed25519</code>
</div>

<h2>SSH Yapılandırma Dosyası (~/.ssh/config)</h2>
<p>Her bağlantıda uzun komutlar yazmak yerine, <code>~/.ssh/config</code> dosyasında takma adlar (alias) tanımlayabilirsiniz:</p>

<div class="code-block">
    <div class="code-block-header"><span>~/.ssh/config örneği</span></div>
    <pre><code><span class="comment"># Genel ayarlar</span>
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    AddKeysToAgent yes

<span class="comment"># İş sunucusu</span>
Host is-sunucu
    HostName 10.0.1.50
    User deploy
    Port 2222
    IdentityFile ~/.ssh/is_anahtari

<span class="comment"># GitHub</span>
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_ed25519

<span class="comment"># Bastion (jump host) üzerinden iç sunucuya</span>
Host ic-sunucu
    HostName 192.168.1.200
    User admin
    ProxyJump bastion

Host bastion
    HostName bastion.sirket.com
    User ali
    Port 22</code></pre>
</div>

<p>Artık <code>ssh is-sunucu</code> yazmanız yeterli — tüm parametreler otomatik uygulanır.</p>

<h2>ssh-agent — Anahtar Yöneticisi</h2>
<p>Anahtarınızda parola (passphrase) varsa, her kullanımda parola sorulur. <code>ssh-agent</code> parolayı bellekte tutar:</p>

<div class="code-block">
    <div class="code-block-header"><span>ssh-agent kullanımı</span></div>
    <pre><code><span class="comment"># Agent'ı başlat:</span>
<span class="prompt">$</span> <span class="command">eval</span> <span class="argument">"$(ssh-agent -s)"</span>
Agent pid 12345

<span class="comment"># Anahtarı agent'a ekle:</span>
<span class="prompt">$</span> <span class="command">ssh-add</span> <span class="path">~/.ssh/id_ed25519</span>
Enter passphrase for /home/ali/.ssh/id_ed25519: <span class="comment"># Bir kez girin</span>
Identity added: /home/ali/.ssh/id_ed25519

<span class="comment"># Eklenen anahtarları listele:</span>
<span class="prompt">$</span> <span class="command">ssh-add</span> <span class="flag">-l</span>

<span class="comment"># Tüm anahtarları agent'tan kaldır:</span>
<span class="prompt">$</span> <span class="command">ssh-add</span> <span class="flag">-D</span></code></pre>
</div>

<h2>SCP — Dosya Kopyalama</h2>
<div class="code-block">
    <div class="code-block-header"><span>SCP ile dosya transferi</span></div>
    <pre><code><span class="comment"># Yerel → Uzak (dosya gönder):</span>
<span class="prompt">$</span> <span class="command">scp</span> <span class="path">rapor.pdf</span> <span class="argument">kullanici@sunucu.com:/home/kullanici/belgeler/</span>

<span class="comment"># Uzak → Yerel (dosya al):</span>
<span class="prompt">$</span> <span class="command">scp</span> <span class="argument">kullanici@sunucu.com:/var/log/syslog</span> <span class="path">./loglar/</span>

<span class="comment"># Dizin kopyalama (-r: recursive):</span>
<span class="prompt">$</span> <span class="command">scp</span> <span class="flag">-r</span> <span class="path">proje/</span> <span class="argument">kullanici@sunucu.com:/opt/deploy/</span>

<span class="comment"># Farklı port:</span>
<span class="prompt">$</span> <span class="command">scp</span> <span class="flag">-P 2222</span> <span class="path">dosya.txt</span> <span class="argument">kullanici@sunucu.com:~/</span>

<span class="comment"># İlerleme gösterimi ile:</span>
<span class="prompt">$</span> <span class="command">scp</span> <span class="flag">-v</span> <span class="path">buyuk_dosya.tar.gz</span> <span class="argument">kullanici@sunucu.com:~/</span></code></pre>
</div>

<h2>SFTP — İnteraktif Dosya Transferi</h2>
<div class="code-block">
    <div class="code-block-header"><span>SFTP oturumu</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">sftp</span> <span class="argument">kullanici@sunucu.com</span>
Connected to sunucu.com.
sftp> <span class="command">ls</span>                  <span class="comment"># Uzak dizini listele</span>
sftp> <span class="command">lls</span>                 <span class="comment"># Yerel dizini listele</span>
sftp> <span class="command">cd</span> /var/www           <span class="comment"># Uzak dizin değiştir</span>
sftp> <span class="command">lcd</span> ~/projeler        <span class="comment"># Yerel dizin değiştir</span>
sftp> <span class="command">get</span> dosya.txt         <span class="comment"># Uzaktan indir</span>
sftp> <span class="command">put</span> yerel.txt         <span class="comment"># Uzağa yükle</span>
sftp> <span class="command">mget</span> *.log            <span class="comment"># Birden fazla dosya indir</span>
sftp> <span class="command">mput</span> *.conf           <span class="comment"># Birden fazla dosya yükle</span>
sftp> <span class="command">mkdir</span> yeni_dizin      <span class="comment"># Uzakta dizin oluştur</span>
sftp> <span class="command">rm</span> gereksiz.txt       <span class="comment"># Uzakta dosya sil</span>
sftp> <span class="command">bye</span>                   <span class="comment"># Oturumu kapat</span></code></pre>
</div>

<h2>SSH Tünelleme (Port Forwarding)</h2>
<p>SSH tünelleme, ağ trafiğini şifreli SSH bağlantısı üzerinden yönlendirir. Üç türü vardır:</p>

<h3>1. Yerel Port Yönlendirme (Local Port Forwarding)</h3>
<p>Yerel bir portu, uzak ağdaki bir servise bağlar. <em>"Uzaktaki servise yerelmiş gibi eriş"</em></p>
<div class="code-block">
    <div class="code-block-header"><span>Local port forwarding</span></div>
    <pre><code><span class="comment"># Uzak sunucudaki PostgreSQL'e yerel 5432'den eriş:</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="flag">-L 5432:localhost:5432</span> <span class="argument">kullanici@sunucu.com</span>

<span class="comment"># İç ağdaki web sunucusuna eriş (sunucu üzerinden):</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="flag">-L 8080:ic-web-sunucu:80</span> <span class="argument">kullanici@bastion.com</span>

<span class="comment"># Arka planda çalıştır (shell istemeden):</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="flag">-fNL 8080:localhost:80</span> <span class="argument">kullanici@sunucu.com</span>
<span class="comment"># -f: arka plan  -N: komut çalıştırma  -L: yerel yönlendirme</span></code></pre>
</div>

<h3>2. Uzak Port Yönlendirme (Remote Port Forwarding)</h3>
<p>Uzak sunucunun bir portunu yerel bir servise bağlar. <em>"Yereldeki servisi dış dünyaya aç"</em></p>
<div class="code-block">
    <div class="code-block-header"><span>Remote port forwarding</span></div>
    <pre><code><span class="comment"># Yerel 3000 portunu sunucu üzerinden dışarı aç:</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="flag">-R 8080:localhost:3000</span> <span class="argument">kullanici@sunucu.com</span>
<span class="comment"># Artık sunucu.com:8080 → yerel 3000'e yönlendirilir</span></code></pre>
</div>

<h3>3. Dinamik Port Yönlendirme (SOCKS Proxy)</h3>
<div class="code-block">
    <div class="code-block-header"><span>SOCKS proxy</span></div>
    <pre><code><span class="comment"># SOCKS5 proxy oluştur (tarayıcı trafiğini tünelle):</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="flag">-D 1080</span> <span class="argument">kullanici@sunucu.com</span>
<span class="comment"># Tarayıcı proxy ayarlarında SOCKS5 → localhost:1080 yapın</span></code></pre>
</div>

<h2>Jump Host / Bastion</h2>
<p>Doğrudan erişilemeyen sunuculara "atlama sunucusu" üzerinden bağlanma:</p>
<div class="code-block">
    <div class="code-block-header"><span>Jump host kullanımı</span></div>
    <pre><code><span class="comment"># Yeni yöntem (OpenSSH 7.3+): -J flag</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="flag">-J bastion@jump.com</span> <span class="argument">admin@192.168.1.100</span>

<span class="comment"># Birden fazla atlama:</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="flag">-J user1@jump1.com,user2@jump2.com</span> <span class="argument">admin@hedef.com</span>

<span class="comment"># SSH config ile:</span>
<span class="comment"># Host hedef</span>
<span class="comment">#     ProxyJump bastion</span></code></pre>
</div>

<h2>Sunucu Tarafı SSH Güvenliği</h2>
<p>SSH sunucusunun yapılandırma dosyası: <code>/etc/ssh/sshd_config</code></p>

<div class="code-block">
    <div class="code-block-header"><span>/etc/ssh/sshd_config — Önerilen güvenlik ayarları</span></div>
    <pre><code><span class="comment"># Root ile doğrudan SSH girişini engelle:</span>
PermitRootLogin no

<span class="comment"># Sadece anahtar ile giriş (şifreyi kapat):</span>
PasswordAuthentication no
PubkeyAuthentication yes

<span class="comment"># Varsayılan portu değiştir (güvenlik yoluyla gizleme):</span>
Port 2222

<span class="comment"># Boş şifreye izin verme:</span>
PermitEmptyPasswords no

<span class="comment"># Belirli kullanıcılara izin ver:</span>
AllowUsers ali veli deploy

<span class="comment"># Maksimum kimlik doğrulama denemesi:</span>
MaxAuthTries 3

<span class="comment"># X11 forwarding'i kapat (gerekli değilse):</span>
X11Forwarding no

<span class="comment"># Bağlantı zaman aşımı:</span>
ClientAliveInterval 300
ClientAliveCountMax 2</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Değişiklikleri uygulama</span></div>
    <pre><code><span class="comment"># Yapılandırmayı test et:</span>
<span class="prompt">$</span> <span class="command">sudo</span> sshd <span class="flag">-t</span>

<span class="comment"># SSH servisini yeniden yükle:</span>
<span class="prompt">$</span> <span class="command">sudo</span> systemctl restart sshd</code></pre>
</div>

<h2>Pratik İpuçları</h2>

<h3>Bağlantı Canlı Tutma (Keep Alive)</h3>
<div class="code-block">
    <div class="code-block-header"><span>~/.ssh/config — Keep alive</span></div>
    <pre><code>Host *
    ServerAliveInterval 60    <span class="comment"># Her 60 saniyede canlılık sinyali gönder</span>
    ServerAliveCountMax 3     <span class="comment"># 3 yanıtsız sinyal sonrası bağlantıyı kes</span></code></pre>
</div>

<h3>SSH Bağlantı Multiplexing</h3>
<p>Aynı sunucuya birden fazla bağlantıyı tek TCP bağlantısı üzerinden yönet (daha hızlı):</p>
<div class="code-block">
    <div class="code-block-header"><span>~/.ssh/config — Multiplexing</span></div>
    <pre><code>Host *
    ControlMaster auto
    ControlPath ~/.ssh/sockets/%r@%h-%p
    ControlPersist 600   <span class="comment"># 10 dakika açık tut</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Socket dizinini oluşturun</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">mkdir</span> <span class="flag">-p</span> <span class="path">~/.ssh/sockets</span></code></pre>
</div>

<h3>SSH Escape Sequences</h3>
<p>SSH oturumu içinde özel komutlar çalıştırabilirsiniz (Enter'dan sonra <code>~</code>):</p>
<table>
    <tr><th>Tuş</th><th>İşlev</th></tr>
    <tr><td><code>~.</code></td><td>Bağlantıyı kes (donmuş bağlantılar için)</td></tr>
    <tr><td><code>~^Z</code></td><td>SSH oturumunu arka plana al</td></tr>
    <tr><td><code>~#</code></td><td>Yönlendirilmiş bağlantıları listele</td></tr>
    <tr><td><code>~?</code></td><td>Tüm escape komutlarını göster</td></tr>
</table>

<h2>Dış Kaynaklar</h2>
<div class="info-box tip">
    <div class="info-box-title">📚 İleri Okuma</div>
    <ul>
        <li><a href="https://www.openssh.com/manual.html" target="_blank" rel="noopener">OpenSSH Resmi Kılavuzu</a> — Tüm SSH komutlarının resmi belgeleri</li>
        <li><a href="https://man7.org/linux/man-pages/man1/ssh.1.html" target="_blank" rel="noopener">ssh(1) man page</a> — ssh komutunun detaylı kılavuzu</li>
        <li><a href="https://www.ssh.com/academy/ssh" target="_blank" rel="noopener">SSH Academy</a> — SSH protokolünün derinlemesine anlatımı</li>
        <li><a href="https://infosec.mozilla.org/guidelines/openssh" target="_blank" rel="noopener">Mozilla SSH Güvenlik Rehberi</a> — Kurumsal SSH güvenlik yapılandırması</li>
    </ul>
</div>
`,
    quiz: [
        {
            question: "SSH varsayılan olarak hangi portu kullanır?",
            options: ["21", "22", "80", "443"],
            correct: 1,
            explanation: "SSH varsayılan portu 22'dir. FTP 21, HTTP 80, HTTPS 443 portunu kullanır."
        },
        {
            question: "SSH anahtar çifti oluştururken 'private key' ile ne yapılmalıdır?",
            options: ["Sunucuya kopyalanmalı", "Herkesle paylaşılmalı", "Sadece sizde kalmalı, kimseyle paylaşılmamalı", "GitHub'a yüklenmeli"],
            correct: 2,
            explanation: "Private key (özel anahtar) asla paylaşılmamalıdır. Sunucuya kopyalanan public key'dir (açık anahtar)."
        },
        {
            question: "~/.ssh/authorized_keys dosyasının doğru izni nedir?",
            options: ["777", "755", "644", "600"],
            correct: 3,
            explanation: "authorized_keys dosyası 600 (-rw-------) olmalıdır. SSH, izinleri sıkı kontrol eder."
        },
        {
            question: "Bir sunucuya ilk SSH bağlantısında gösterilen 'fingerprint' neyi temsil eder?",
            options: ["Kullanıcının şifresini", "Sunucunun açık anahtarının özetini", "Bağlantı hızını", "IP adresini"],
            correct: 1,
            explanation: "Fingerprint, sunucunun açık anahtarının kriptografik özetidir. Sunucunun kimliğini doğrulamak için kullanılır."
        },
        {
            question: "ssh -L 8080:localhost:3000 user@server komutu ne yapar?",
            options: ["Sunucuda 8080 portunu açar", "Yerel 8080 portunu sunucunun 3000 portuna yönlendirir", "SOCKS proxy oluşturur", "Sunucuyu yeniden başlatır"],
            correct: 1,
            explanation: "Local port forwarding (-L): Yerel 8080 portuna gelen trafik, SSH tüneli üzerinden sunucunun 3000 portuna yönlendirilir."
        },
        {
            question: "Hangi SSH anahtar algoritması günümüzde en çok önerilen modern seçenektir?",
            options: ["RSA 1024", "DSA", "Ed25519", "ECDSA"],
            correct: 2,
            explanation: "Ed25519, kısa anahtar boyutu, yüksek performans ve güçlü güvenliği ile modern sistemlerde önerilen algoritmadır."
        },
        {
            question: "ssh-agent ne işe yarar?",
            options: ["SSH sunucusu kurar", "Parolalı anahtarların parolasını bellekte tutar", "Firewall yapılandırır", "SSH bağlantılarını loglar"],
            correct: 1,
            explanation: "ssh-agent, SSH anahtarlarının parolalarını bellekte tutarak her kullanımda tekrar parola girmenizi engeller."
        },
        {
            question: "Donmuş bir SSH bağlantısını kapatmak için hangi escape sequence kullanılır?",
            options: ["Ctrl+C", "~.", "Ctrl+D", "exit"],
            correct: 1,
            explanation: "~. (tilde + nokta) escape sequence'i, donmuş SSH bağlantılarını kapatmak için kullanılır. Enter'dan sonra yazılmalıdır."
        }
    ]
});
