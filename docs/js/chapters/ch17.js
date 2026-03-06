// ===== Bölüm 17: Kullanıcı Yönetimi ve Parola Güvenliği =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 17,
    title: 'Kullanıcı Yönetimi',
    subtitle: 'User Management & Password Security',
    icon: '👤',
    description: 'Linux kullanıcı ve grup yönetimi: useradd, usermod, gruplar, /etc/passwd, /etc/shadow, sudo yapılandırması ve parola güvenliği.',
    content: `
<h2>Linux Kullanıcı Modeli</h2>
<p>Linux çok kullanıcılı (multi-user) bir işletim sistemidir. Her kullanıcının benzersiz bir kimliği, ev dizini ve izinleri vardır. Kullanıcı yönetimi, sistem güvenliğinin temelini oluşturur.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">User</span> = <span class="eng-meaning">Kullanıcı</span> — Sistemde kimliği tanımlanmış bir varlık.<br>
        <span class="eng-word">UID</span> = <span class="eng-meaning">User ID</span> — Kullanıcının sayısal kimliği. root = 0.<br>
        <span class="eng-word">GID</span> = <span class="eng-meaning">Group ID</span> — Grubun sayısal kimliği.<br>
        <span class="eng-word">Root</span> = <span class="eng-meaning">Kök / Süper Kullanıcı</span> — Sınırsız yetkilere sahip yönetici (UID=0).<br>
        <span class="eng-word">Daemon</span> = <span class="eng-meaning">Arka Plan Servisi</span> — Servis kullanıcıları (www-data, mysql gibi).<br>
        <span class="eng-word">Shadow</span> = <span class="eng-meaning">Gölge</span> — Şifreli parolaların saklandığı dosya.<br>
        <span class="eng-word">PAM</span> = <span class="eng-meaning">Pluggable Authentication Modules</span> — Takılabilir kimlik doğrulama modülleri.
    </div>
</div>

<h2>Kullanıcı Türleri</h2>
<table>
    <tr><th>Tür</th><th>UID Aralığı</th><th>Açıklama</th><th>Örnekler</th></tr>
    <tr><td><strong>Root</strong></td><td>0</td><td>Süper kullanıcı — her şeyi yapabilir</td><td>root</td></tr>
    <tr><td><strong>Sistem Kullanıcıları</strong></td><td>1-999</td><td>Servisler için oluşturulan kullanıcılar (genellikle giriş yapmaz)</td><td>www-data, mysql, sshd, nobody</td></tr>
    <tr><td><strong>Normal Kullanıcılar</strong></td><td>1000+</td><td>Gerçek kişiler</td><td>ali, veli, ayse</td></tr>
</table>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Neden Root ile Çalışmamalısınız?</div>
    Root hesabı sınırsız yetkiye sahiptir: <code>rm -rf /</code> komutu tüm sistemi siler ve root bunu sormadan yapar!<br>
    <strong>En iyi uygulama:</strong> Normal kullanıcı ile çalışın, root gereken işlerde <code>sudo</code> kullanın. Bu, yanlışlıkla sistem hasar vermeyi önler ve denetim izi (audit trail) oluşturur.
</div>

<h2>Kullanıcı Bilgi Dosyaları</h2>

<h3>/etc/passwd — Kullanıcı Veritabanı</h3>
<p>Tüm kullanıcıların temel bilgilerini içerir. <strong>Herkes okuyabilir</strong> (ama parolalar burada tutulmaz).</p>
<div class="code-block">
    <div class="code-block-header"><span>/etc/passwd formatı</span></div>
    <pre><code><span class="comment"># kullanici:parola:UID:GID:GECOS:ev_dizini:kabuk</span>
root:x:0:0:root:/root:/bin/bash
ali:x:1000:1000:Ali Yılmaz,,,:/home/ali:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
mysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/false</code></pre>
</div>

<table>
    <tr><th>Alan</th><th>Açıklama</th><th>Örnek</th></tr>
    <tr><td>1. Kullanıcı adı</td><td>Giriş adı</td><td>ali</td></tr>
    <tr><td>2. Parola</td><td><code>x</code> = parola /etc/shadow'da</td><td>x</td></tr>
    <tr><td>3. UID</td><td>Kullanıcı numarası</td><td>1000</td></tr>
    <tr><td>4. GID</td><td>Birincil grup numarası</td><td>1000</td></tr>
    <tr><td>5. GECOS</td><td>Ad-soyad ve bilgi</td><td>Ali Yılmaz,,,</td></tr>
    <tr><td>6. Ev dizini</td><td>Giriş dizini</td><td>/home/ali</td></tr>
    <tr><td>7. Kabuk</td><td>Varsayılan kabuk</td><td>/bin/bash</td></tr>
</table>

<h3>/etc/shadow — Parola Gölge Dosyası</h3>
<p><strong>Sadece root okuyabilir.</strong> Şifreli parolalar ve parola politikaları burada saklanır.</p>
<div class="code-block">
    <div class="code-block-header"><span>/etc/shadow formatı</span></div>
    <pre><code><span class="comment"># kullanici:sifre_hash:son_degisiklik:min:max:uyari:pasif:son_kullanim:reserved</span>
root:$6$abc123...:19500:0:99999:7:::
ali:$y$j9T$xkZ...hash...:19500:0:90:7:30::
www-data:*:19000:0:99999:7:::
nobody:!:19000:::::</code></pre>
</div>

<table>
    <tr><th>Alan</th><th>Açıklama</th></tr>
    <tr><td>2. Şifre Hash</td><td>Şifreli parola. <code>!</code> veya <code>*</code> = giriş devre dışı. <code>!!</code> = parola belirlenmemiş.</td></tr>
    <tr><td>3. Son Değişiklik</td><td>Parolanın en son değiştirildiği gün (1 Ocak 1970'ten itibaren gün sayısı)</td></tr>
    <tr><td>4. Minimum</td><td>Parola değişikliği arasındaki minimum gün sayısı</td></tr>
    <tr><td>5. Maximum</td><td>Parola geçerlilik süresi (gün)</td></tr>
    <tr><td>6. Uyarı</td><td>Süre dolmadan kaç gün önce uyar</td></tr>
    <tr><td>7. Pasif</td><td>Süre dolduktan sonra kaç gün daha giriş izni</td></tr>
    <tr><td>8. Son Kullanım</td><td>Hesabın tamamen devre dışı olacağı tarih</td></tr>
</table>

<h3>Parola Hash Formatı</h3>
<div class="code-block">
    <div class="code-block-header"><span>Hash formatı: $id$salt$hash</span></div>
    <pre><code><span class="comment"># $id$ → Kullanılan hash algoritması:</span>
$1$  → MD5        <span class="comment">(eski, güvensiz!)</span>
$5$  → SHA-256    <span class="comment">(iyi)</span>
$6$  → SHA-512    <span class="comment">(çoğu dağıtımda varsayılan)</span>
$y$  → yescrypt   <span class="comment">(en modern, önerilen)</span>

<span class="comment"># Örnek: $6$tuzDegeri$uzunHashDegeri...</span>
<span class="comment"># $6$ = SHA-512, tuzDegeri = salt (rastgele), sonrası = hash</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Salt (Tuz) Nedir?</div>
    Salt, hash'e eklenen rastgele bir değerdir. Aynı parola bile farklı salt ile farklı hash üretir. Bu, önceden hesaplanmış hash sözlüklerini (<strong>rainbow table</strong>) kullanarak parola kırmayı son derece zorlaştırır.
</div>

<h3>/etc/group — Grup Dosyası</h3>
<div class="code-block">
    <div class="code-block-header"><span>/etc/group formatı</span></div>
    <pre><code><span class="comment"># grup_adi:parola:GID:üyeler</span>
root:x:0:
sudo:x:27:ali,veli
www-data:x:33:ali
docker:x:999:ali,veli
developers:x:1001:ali,ayse,mehmet</code></pre>
</div>

<h2>Kullanıcı Oluşturma ve Yönetme</h2>

<h3>useradd — Kullanıcı Oluşturma</h3>
<div class="code-block">
    <div class="code-block-header"><span>useradd kullanımı</span></div>
    <pre><code><span class="comment"># Temel kullanıcı oluştur:</span>
<span class="prompt">$</span> <span class="command">sudo useradd</span> <span class="argument">yeni_kullanici</span>

<span class="comment"># Ev dizini, kabuk ve bilgi ile oluştur (önerilen):</span>
<span class="prompt">$</span> <span class="command">sudo useradd</span> <span class="flag">-m -s /bin/bash -c</span> <span class="string">"Ayşe Demir"</span> <span class="argument">ayse</span>

<span class="comment"># Bayraklar:</span>
<span class="comment"># -m  → Ev dizini oluştur (/home/ayse)</span>
<span class="comment"># -s  → Varsayılan kabuk belirle</span>
<span class="comment"># -c  → Yorum alanı (GECOS — ad soyad)</span>
<span class="comment"># -G  → Ek gruplara ekle</span>
<span class="comment"># -u  → UID belirle</span>
<span class="comment"># -d  → Ev dizini yolu belirle</span>
<span class="comment"># -e  → Hesap bitiş tarihi (YYYY-MM-DD)</span>

<span class="comment"># Gruplara da ekleyerek oluştur:</span>
<span class="prompt">$</span> <span class="command">sudo useradd</span> <span class="flag">-m -s /bin/bash -G sudo,docker,developers</span> <span class="argument">mehmet</span>

<span class="comment"># Parola belirle:</span>
<span class="prompt">$</span> <span class="command">sudo passwd</span> <span class="argument">ayse</span>
New password: ********
Retype new password: ********
passwd: password updated successfully</code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 useradd vs adduser</div>
    <code>useradd</code>: Düşük seviyeli komut. Bayraklar gerekir. Tüm dağıtımlarda aynıdır.<br>
    <code>adduser</code>: Debian/Ubuntu'da bulunan etkileşimli sarmalayıcı (wrapper). Ev dizini oluşturur, parola sorar, otomatik yapılandırır. Yeni başlayanlar için daha kolaydır.
</div>

<h3>usermod — Kullanıcı Düzenleme</h3>
<div class="code-block">
    <div class="code-block-header"><span>usermod kullanımı</span></div>
    <pre><code><span class="comment"># Kullanıcıyı gruba ekle (-a: append, -G: ek gruplar):</span>
<span class="prompt">$</span> <span class="command">sudo usermod</span> <span class="flag">-aG</span> <span class="argument">docker ali</span>

<span class="comment">⚠️ -a bayrağını unutursanız, kullanıcı sadece belirtilen gruplarda kalır!</span>
<span class="comment"># -aG docker ali  → docker grubunu EKLE</span>
<span class="comment"># -G docker ali   → diğer tüm gruplardan ÇIK, sadece docker'da kal!</span>

<span class="comment"># Kabuk değiştir:</span>
<span class="prompt">$</span> <span class="command">sudo usermod</span> <span class="flag">-s</span> <span class="argument">/bin/zsh ali</span>

<span class="comment"># Kullanıcıyı kilitle (giriş engelle):</span>
<span class="prompt">$</span> <span class="command">sudo usermod</span> <span class="flag">-L</span> <span class="argument">ali</span>

<span class="comment"># Kilidi kaldır:</span>
<span class="prompt">$</span> <span class="command">sudo usermod</span> <span class="flag">-U</span> <span class="argument">ali</span>

<span class="comment"># Ev dizinini değiştir ve taşı:</span>
<span class="prompt">$</span> <span class="command">sudo usermod</span> <span class="flag">-d /yeni/dizin -m</span> <span class="argument">ali</span>

<span class="comment"># Kullanıcı adını değiştir:</span>
<span class="prompt">$</span> <span class="command">sudo usermod</span> <span class="flag">-l</span> <span class="argument">yeni_ad eski_ad</span></code></pre>
</div>

<h3>userdel — Kullanıcı Silme</h3>
<div class="code-block">
    <div class="code-block-header"><span>Kullanıcı silme</span></div>
    <pre><code><span class="comment"># Kullanıcıyı sil (ev dizini kalır):</span>
<span class="prompt">$</span> <span class="command">sudo userdel</span> <span class="argument">ayse</span>

<span class="comment"># Kullanıcıyı ve ev dizinini sil:</span>
<span class="prompt">$</span> <span class="command">sudo userdel</span> <span class="flag">-r</span> <span class="argument">ayse</span>

<span class="comment"># Kullanıcı bilgilerini sorgula:</span>
<span class="prompt">$</span> <span class="command">id</span> <span class="argument">ali</span>
uid=1000(ali) gid=1000(ali) groups=1000(ali),27(sudo),999(docker)

<span class="comment"># Kendi bilgilerini göster:</span>
<span class="prompt">$</span> <span class="command">whoami</span>
ali

<span class="comment"># Giriş yapan kullanıcıları göster:</span>
<span class="prompt">$</span> <span class="command">who</span>
ali      pts/0    2026-02-28 10:15
veli     pts/1    2026-02-28 11:30

<span class="comment"># Son giriş yapanları göster:</span>
<span class="prompt">$</span> <span class="command">last</span>

<span class="comment"># Başarısız giriş denemeleri:</span>
<span class="prompt">$</span> <span class="command">sudo lastb</span></code></pre>
</div>

<h2>Grup Yönetimi</h2>
<div class="code-block">
    <div class="code-block-header"><span>Grup işlemleri</span></div>
    <pre><code><span class="comment"># Yeni grup oluştur:</span>
<span class="prompt">$</span> <span class="command">sudo groupadd</span> <span class="argument">developers</span>

<span class="comment"># Belirli GID ile:</span>
<span class="prompt">$</span> <span class="command">sudo groupadd</span> <span class="flag">-g 2000</span> <span class="argument">proje</span>

<span class="comment"># Grubu sil:</span>
<span class="prompt">$</span> <span class="command">sudo groupdel</span> <span class="argument">eski_grup</span>

<span class="comment"># Grup adını değiştir:</span>
<span class="prompt">$</span> <span class="command">sudo groupmod</span> <span class="flag">-n</span> <span class="argument">yeni_ad eski_ad</span>

<span class="comment"># Kullanıcının gruplarını göster:</span>
<span class="prompt">$</span> <span class="command">groups</span> <span class="argument">ali</span>
ali : ali sudo docker developers

<span class="comment"># Geçici olarak gruba geç (yeni shell):</span>
<span class="prompt">$</span> <span class="command">newgrp</span> <span class="argument">developers</span></code></pre>
</div>

<h2>sudo Yapılandırması</h2>
<p><code>sudo</code> (superuser do), belirli kullanıcıların root yetkileriyle komut çalıştırmasına izin verir.</p>

<div class="code-block">
    <div class="code-block-header"><span>sudo kullanımı</span></div>
    <pre><code><span class="comment"># Root olarak komut çalıştır:</span>
<span class="prompt">$</span> <span class="command">sudo</span> <span class="argument">apt update</span>

<span class="comment"># Root shell aç:</span>
<span class="prompt">$</span> <span class="command">sudo</span> <span class="flag">-i</span>    <span class="comment"># login shell</span>
<span class="prompt">$</span> <span class="command">sudo</span> <span class="flag">-s</span>    <span class="comment"># non-login shell</span>

<span class="comment"># Başka kullanıcı olarak komut çalıştır:</span>
<span class="prompt">$</span> <span class="command">sudo</span> <span class="flag">-u www-data</span> <span class="argument">ls /var/www</span>

<span class="comment"># sudo yetkilerini göster:</span>
<span class="prompt">$</span> <span class="command">sudo</span> <span class="flag">-l</span></code></pre>
</div>

<h3>/etc/sudoers — sudo Yapılandırma Dosyası</h3>
<div class="code-block">
    <div class="code-block-header"><span>sudoers düzenleme (HER ZAMAN visudo kullanın!)</span></div>
    <pre><code><span class="comment"># ASLA doğrudan düzenlemeyin — sözdizimi hatası sizi dışarı kilitler!</span>
<span class="prompt">$</span> <span class="command">sudo visudo</span>

<span class="comment"># sudoers formatı:</span>
<span class="comment"># kullanici  makine=(kimolarak:hangiGrup)  komutlar</span>

<span class="comment"># root her şeyi yapabilir:</span>
root    ALL=(ALL:ALL) ALL

<span class="comment"># sudo grubundaki herkes her şeyi yapabilir:</span>
%sudo   ALL=(ALL:ALL) ALL

<span class="comment"># ali sadece apt komutlarını çalıştırabilir:</span>
ali     ALL=(ALL) /usr/bin/apt, /usr/bin/apt-get

<span class="comment"># veli parolasız sudo kullanabilir:</span>
veli    ALL=(ALL) NOPASSWD: ALL

<span class="comment"># deploy kullanıcısı sadece nginx'i yönetebilir:</span>
deploy  ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx, /usr/bin/systemctl status nginx</code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 sudoers.d Dizini</div>
    Doğrudan <code>/etc/sudoers</code> düzenlemek yerine <code>/etc/sudoers.d/</code> altına dosya ekleyin:<br>
    <code>sudo visudo -f /etc/sudoers.d/ali</code><br>
    Daha düzenli ve güncelleme sonrası kaybolmaz.
</div>

<h2>Parola Politikaları</h2>
<div class="code-block">
    <div class="code-block-header"><span>Parola politikası yönetimi</span></div>
    <pre><code><span class="comment"># Parola bilgilerini göster:</span>
<span class="prompt">$</span> <span class="command">sudo chage</span> <span class="flag">-l</span> <span class="argument">ali</span>
Last password change                    : Feb 28, 2026
Password expires                        : May 29, 2026
Password inactive                       : Jun 28, 2026
Account expires                         : never
Minimum number of days between password change : 0
Maximum number of days between password change : 90
Number of days of warning before password expires : 7

<span class="comment"># 90 günde parola değişimi zorunlu:</span>
<span class="prompt">$</span> <span class="command">sudo chage</span> <span class="flag">-M 90</span> <span class="argument">ali</span>

<span class="comment"># 7 gün önceden uyar:</span>
<span class="prompt">$</span> <span class="command">sudo chage</span> <span class="flag">-W 7</span> <span class="argument">ali</span>

<span class="comment"># Sonraki girişte parola değişimi zorla:</span>
<span class="prompt">$</span> <span class="command">sudo chage</span> <span class="flag">-d 0</span> <span class="argument">ali</span>

<span class="comment"># Hesap bitiş tarihi belirle:</span>
<span class="prompt">$</span> <span class="command">sudo chage</span> <span class="flag">-E 2026-12-31</span> <span class="argument">stajyer</span></code></pre>
</div>

<h3>PAM ile Parola Karmaşıklık Kuralları</h3>
<div class="code-block">
    <div class="code-block-header"><span>Parola karmaşıklık ayarları (/etc/security/pwquality.conf)</span></div>
    <pre><code><span class="comment"># Minimum uzunluk:</span>
minlen = 12

<span class="comment"># En az 1 büyük harf:</span>
ucredit = -1

<span class="comment"># En az 1 küçük harf:</span>
lcredit = -1

<span class="comment"># En az 1 rakam:</span>
dcredit = -1

<span class="comment"># En az 1 özel karakter:</span>
ocredit = -1

<span class="comment"># Son 5 parola tekrar edilemesin:</span>
remember = 5

<span class="comment"># Sözlük kontrolü:</span>
dictcheck = 1</code></pre>
</div>

<h2>su vs sudo</h2>
<table>
    <tr><th>Özellik</th><th>su</th><th>sudo</th></tr>
    <tr><td>Anlam</td><td>Switch User (Kullanıcı Değiştir)</td><td>Superuser Do</td></tr>
    <tr><td>Parola</td><td>Hedef kullanıcının parolası gerekir</td><td>Kendi parolanız yeterli</td></tr>
    <tr><td>Yetki</td><td>Tam kullanıcı değişimi</td><td>Sadece bir komut için</td></tr>
    <tr><td>Denetim</td><td>Kim ne yaptı izlenemez</td><td>Tüm komutlar loglanır (/var/log/auth.log)</td></tr>
    <tr><td>Güvenlik</td><td>Root parolasını herkes bilmeli</td><td>Root parolası paylaşılmaz</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>su kullanımı</span></div>
    <pre><code><span class="comment"># Root'a geç:</span>
<span class="prompt">$</span> <span class="command">su -</span>         <span class="comment"># Login shell (ortam değişkenleri root'un)</span>
<span class="prompt">$</span> <span class="command">su</span>           <span class="comment"># Non-login shell (bazı env miras kalır)</span>

<span class="comment"># Başka kullanıcıya geç:</span>
<span class="prompt">$</span> <span class="command">su - ali</span>

<span class="comment"># Tek komut çalıştır:</span>
<span class="prompt">$</span> <span class="command">su -c</span> <span class="string">"apt update"</span> root</code></pre>
</div>

<h2>Sistem Güvenliği İpuçları</h2>
<div class="info-box tip">
    <div class="info-box-title">💡 Güvenlik Kontrol Listesi</div>
    <ul>
        <li>✅ Root ile doğrudan giriş yapma — <code>sudo</code> kullan</li>
        <li>✅ SSH'da root girişini kapat (<code>PermitRootLogin no</code>)</li>
        <li>✅ Her servise özel kullanıcı oluştur (www-data, mysql vb.)</li>
        <li>✅ Gereksiz kullanıcıları kilitle veya sil</li>
        <li>✅ Parola karmaşıklık kurallarını uygula</li>
        <li>✅ Başarısız giriş denemelerini izle: <code>sudo lastb</code></li>
        <li>✅ sudo loglarını kontrol et: <code>sudo grep sudo /var/log/auth.log</code></li>
        <li>✅ İki faktörlü kimlik doğrulama (2FA) düşünün — <code>google-authenticator</code> PAM modülü</li>
    </ul>
</div>

<h2>Dış Kaynaklar</h2>
<div class="info-box tip">
    <div class="info-box-title">📚 İleri Okuma</div>
    <ul>
        <li><a href="https://wiki.archlinux.org/title/Users_and_groups" target="_blank" rel="noopener">Arch Wiki — Users and Groups</a> — Linux kullanıcı/grup yönetiminin kapsamlı rehberi</li>
        <li><a href="https://man7.org/linux/man-pages/man5/passwd.5.html" target="_blank" rel="noopener">passwd(5) man page</a> — /etc/passwd dosyasının resmi belgeleri</li>
        <li><a href="https://man7.org/linux/man-pages/man5/shadow.5.html" target="_blank" rel="noopener">shadow(5) man page</a> — /etc/shadow dosyasının detaylı belgeleri</li>
        <li><a href="https://www.sudo.ws/docs/man/sudoers.man/" target="_blank" rel="noopener">sudoers Manual</a> — sudo yapılandırmasının resmi referansı</li>
    </ul>
</div>
`,
    quiz: [
        {
            question: "Root kullanıcının UID'si kaçtır?",
            options: ["1", "0", "1000", "999"],
            correct: 1,
            explanation: "Root kullanıcının UID'si 0'dır. Normal kullanıcılar 1000'den, sistem kullanıcıları 1-999 arasından başlar."
        },
        {
            question: "Linux parolalarının hash'leri hangi dosyada saklanır?",
            options: ["/etc/passwd", "/etc/shadow", "/etc/login.defs", "/etc/security"],
            correct: 1,
            explanation: "Parolalar /etc/shadow dosyasında saklanır. /etc/passwd herkes tarafından okunabilir olduğu için parolalar oradan ayrılmıştır."
        },
        {
            question: "'sudo usermod -aG docker ali' komutunda -a bayrağı olmasaydı ne olurdu?",
            options: ["Hiçbir fark olmazdı", "Ali docker dışındaki tüm gruplardan çıkarılırdı", "Docker grubu silinirdi", "Komut hata verirdi"],
            correct: 1,
            explanation: "-a (append) olmadan -G kullanılırsa, kullanıcının tüm ek grupları belirtilenlerle değiştirilir. Yani ali sadece docker grubunda kalırdı!"
        },
        {
            question: "sudoers dosyasını düzenlemek için hangi komut kullanılmalıdır?",
            options: ["nano /etc/sudoers", "vim /etc/sudoers", "visudo", "sudo edit sudoers"],
            correct: 2,
            explanation: "visudo sözdizimi kontrolü yapar. Doğrudan düzenleme hatalı sudoers dosyası oluşturabilir ve sizi sistemden kilitleyebilir."
        },
        {
            question: "Parola hash'indeki 'salt' (tuz) ne işe yarar?",
            options: ["Parolayı uzatır", "Rainbow table saldırılarını önler", "Parolayı görünür yapar", "Hash türünü belirler"],
            correct: 1,
            explanation: "Salt, her parolaya rastgele veri ekler. Aynı parola bile farklı salt ile farklı hash üretir, bu da rainbow table saldırılarını etkisiz kılar."
        },
        {
            question: "su ile sudo arasındaki temel fark nedir?",
            options: ["su daha hızlıdır", "sudo hedef kullanıcının parolasını ister, su kendi parolanızı", "su hedef kullanıcının parolasını ister, sudo kendi parolanızı", "İkisi aynıdır"],
            correct: 2,
            explanation: "su hedef kullanıcının parolasını ister (root parolası paylaşılmalı). sudo kendi parolanızı ister ve her komutu loglar — daha güvenli."
        },
        {
            question: "Kullanıcının bir sonraki girişte parola değiştirmesini zorlamak için hangi komut kullanılır?",
            options: ["passwd -lock ali", "chage -d 0 ali", "usermod -p ali", "forcepwd ali"],
            correct: 1,
            explanation: "chage -d 0, parolanın son değişiklik tarihini 0'a ayarlar (1 Ocak 1970). Bu, sistem parolayı 'süresi dolmuş' olarak görür ve değişim zorlar."
        }
    ]
});
