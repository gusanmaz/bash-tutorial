// ===== Bölüm 8: İzinler =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 8,
    title: 'İzinler',
    subtitle: 'Permissions',
    icon: '🔐',
    description: 'Dosya ve dizin izinlerini anlayın ve değiştirin. chmod, chown, umask, özel izinler (SUID/SGID/Sticky Bit) ve ACL.',
    content: `
<h2>Linux İzin Sistemi</h2>
<p>Linux çok kullanıcılı bir sistemdir. Her dosya ve dizin üç tür izne sahiptir ve bunlar üç kullanıcı grubu için ayrı ayrı tanımlanır.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">Permission</span> = <span class="eng-meaning">İzin</span> — Dosyaya kimin ne yapabileceğini belirler.<br>
        <span class="eng-word">Owner</span> = <span class="eng-meaning">Sahip</span> — Dosyanın sahibi olan kullanıcı.<br>
        <span class="eng-word">Group</span> = <span class="eng-meaning">Grup</span> — Dosyanın ait olduğu kullanıcı grubu.<br>
        <span class="eng-word">Others</span> = <span class="eng-meaning">Diğerleri</span> — Sistemdeki diğer tüm kullanıcılar.
    </div>
</div>

<h3>Üç İzin Türü — Dosya vs Dizin Farkı</h3>
<p>İzinlerin dosya ve dizinlerde <strong>çok farklı anlamları</strong> vardır. Bu fark en çok kafa karıştıran konulardan biridir:</p>
<table>
    <tr><th>İzin</th><th>Harf</th><th>İngilizce</th><th>Dosya için</th><th>Dizin için</th><th>Sayı</th></tr>
    <tr><td>Okuma</td><td><code>r</code></td><td>Read</td><td>İçeriği okuyabilir</td><td>Dizin içeriğini listeleyebilir (<code>ls</code>)</td><td>4</td></tr>
    <tr><td>Yazma</td><td><code>w</code></td><td>Write</td><td>İçeriği değiştirebilir</td><td>Dizin içinde dosya oluşturabilir/silebilir/adlandırabilir</td><td>2</td></tr>
    <tr><td>Çalıştır</td><td><code>x</code></td><td>Execute</td><td>Program olarak çalıştırabilir</td><td>Dizine <strong>erişebilir</strong> (<code>cd</code>, dosya bilgilerine ulaşma)</td><td>1</td></tr>
</table>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Dizinlerde x (Execute) İzni — Kritik Detay!</div>
    Dizinlerde <code>x</code> izni "çalıştır" değil, <strong>"erişim"</strong> anlamına gelir. Bu çok önemli nüansları içerir:
    <br><br>
    <strong>r var, x yok:</strong> Dosya <strong>adlarını</strong> listeleyebilirsiniz ama boyut, tarih, izin gibi meta bilgilerine erişemezsiniz. Dosyaların içeriğine de ulaşamazsınız.<br>
    <strong>x var, r yok:</strong> Eğer dosya adını <strong>biliyorsanız</strong> o dosyaya erişebilirsiniz ama <code>ls</code> ile dizin içeriğini listeleyemezsiniz. (Bu, gizli paylaşımlar için kullanılabilir!)<br>
    <strong>x yok:</strong> Dizine cd ile giremezsiniz ve <strong>içindeki hiçbir dosyaya</strong> dosya adını bilseniz bile erişemezsiniz.<br><br>
    Pratik olarak bir dizini kullanılabilir kılmak için <strong>hem <code>r</code> hem <code>x</code></strong> gerekir.
</div>

<h2>İzinleri Okumak</h2>

<div class="code-block">
    <div class="code-block-header">
        <span>ls -l ile izinleri görme</span>
        <button class="try-btn" onclick="runInTerminal('ls -l')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">$</span> <span class="command">ls -l</span>
<span class="output">-rw-r--r-- 1 kullanici kullanici  156 Şub 26 10:00 notlar.txt
-rwxr-xr-x 1 kullanici kullanici  128 Şub 26 10:00 merhaba.sh
drwxr-xr-x 3 kullanici kullanici 4096 Şub 26 10:00 Belgeler</span></code></pre>
</div>

<p>İzin dizisini parçalayalım: <code>-rwxr-xr-x</code></p>
<div class="code-block">
    <div class="code-block-header"><span>İzin dizisi açıklaması</span></div>
    <pre><code><span class="comment">  -    rwx    r-x    r-x</span>
<span class="comment">  │     │      │      │</span>
<span class="comment">  │     │      │      └── Others (Diğerleri): r-x = oku + çalıştır</span>
<span class="comment">  │     │      └── Group (Grup): r-x = oku + çalıştır</span>
<span class="comment">  │     └── Owner (Sahip): rwx = oku + yaz + çalıştır</span>
<span class="comment">  └── Dosya türü: - = dosya, d = dizin, l = link</span></code></pre>
</div>

<h3>İzin Değerlendirme Sırası</h3>
<p>Linux izinleri kontrol ederken şu sırayı izler ve <strong>ilk eşleşmede durur</strong>:</p>
<ol>
    <li><strong>Owner (Sahip):</strong> Dosyanın kullanıcısı mısınız? → Sahip izinleri uygulanır</li>
    <li><strong>Group (Grup):</strong> Dosyanın grubunda mısınız? → Grup izinleri uygulanır</li>
    <li><strong>Others (Diğer):</strong> Hiçbiri değilseniz → Diğerleri izinleri uygulanır</li>
</ol>

<div class="info-box note">
    <div class="info-box-title">📌 Sezgiye Aykırı Durum</div>
    Eğer sahip olarak <code>---</code> (hiçbir izin yok) izniniz varsa ama grup olarak <code>rwx</code> izniniz varsa ve siz hem sahip hem de gruptaysanız — dosyaya erişemezsiniz! Çünkü Linux <strong>sahip iznini kontrol eder ve durur</strong>. Grup iznine bakmaz bile. Bu yaygın bir kafa karışıklığı kaynağıdır.
</div>

<h2>chmod — İzinleri Değiştir</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">chmod</span> = <span class="eng-meaning">Change Mode</span> — "Modu/İzni değiştir". Dosya izinlerini düzenler.
    </div>
</div>

<h3>Sayısal (Octal) Yöntem</h3>
<p>Her izin bir sayıya karşılık gelir: <code>r=4</code>, <code>w=2</code>, <code>x=1</code>. Bunları toplayarak izin belirlersiniz.</p>

<div class="code-block">
    <div class="code-block-header">
        <span>chmod sayısal örnekleri</span>
        <button class="try-btn" onclick="runInTerminal('chmod 755 merhaba.sh && ls -l merhaba.sh')">Terminalde Dene</button>
    </div>
    <pre><code><span class="comment"># 755 = rwxr-xr-x</span>
<span class="comment"># Sahip: 7 (4+2+1) = rwx  → oku + yaz + çalıştır</span>
<span class="comment"># Grup:  5 (4+0+1) = r-x  → oku + çalıştır</span>
<span class="comment"># Diğer: 5 (4+0+1) = r-x  → oku + çalıştır</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">755</span> <span class="path">merhaba.sh</span>

<span class="comment"># 644 = rw-r--r-- (tipik dosya izni)</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">644</span> <span class="path">notlar.txt</span>

<span class="comment"># 700 = rwx------ (sadece sahip erişebilir)</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">700</span> <span class="path">gizli_script.sh</span></code></pre>
</div>

<h3>Yaygın İzin Kalıpları</h3>
<table>
    <tr><th>Sayı</th><th>İzin</th><th>Kullanım</th></tr>
    <tr><td><code>755</code></td><td>rwxr-xr-x</td><td>Scriptler, çalıştırılabilir dosyalar, dizinler</td></tr>
    <tr><td><code>644</code></td><td>rw-r--r--</td><td>Normal dosyalar (metin, yapılandırma)</td></tr>
    <tr><td><code>700</code></td><td>rwx------</td><td>Özel scriptler/dizinler (sadece sahip)</td></tr>
    <tr><td><code>600</code></td><td>rw-------</td><td>Hassas dosyalar (SSH anahtarları, .env dosyaları)</td></tr>
    <tr><td><code>750</code></td><td>rwxr-x---</td><td>Sahip ve grup erişebilir, diğerleri yok</td></tr>
    <tr><td><code>775</code></td><td>rwxrwxr-x</td><td>Takım çalışması dizinleri</td></tr>
    <tr><td><code>444</code></td><td>r--r--r--</td><td>Salt okunur dosya (herkes okuyabilir, kimse yazamaz)</td></tr>
</table>

<h3>Sembolik Yöntem</h3>
<div class="code-block">
    <div class="code-block-header"><span>chmod sembolik örnekleri</span></div>
    <pre><code><span class="comment"># Sahibe çalıştırma izni ekle</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">u+x</span> <span class="path">script.sh</span>

<span class="comment"># Gruba okuma ve çalıştırma izni ekle</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">g+rx</span> <span class="path">dosya.txt</span>

<span class="comment"># Diğerlerinden tüm izinleri kaldır</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">o-rwx</span> <span class="path">gizli.txt</span>

<span class="comment"># Herkese çalıştırma izni ekle</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">a+x</span> <span class="path">script.sh</span>
<span class="comment"># veya kısa yol: chmod +x script.sh</span>

<span class="comment"># İzinleri TÜM olarak ayarla (= operatörü)</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">u=rwx,g=rx,o=</span> <span class="path">script.sh</span>
<span class="comment"># → rwxr-x--- (o= boş = hiçbir izin yok)</span>

<span class="comment"># Özyinelemeli — dizin ve tüm içerikler</span>
<span class="prompt">$</span> <span class="command">chmod -R</span> <span class="argument">750</span> <span class="path">proje/</span>

<span class="comment"># u = user/owner (sahip)</span>
<span class="comment"># g = group (grup)</span>
<span class="comment"># o = others (diğerleri)</span>
<span class="comment"># a = all (hepsi)</span>
<span class="comment"># + = ekle, - = kaldır, = = ayarla</span></code></pre>
</div>

<h2>umask — Varsayılan İzinleri Belirle</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">umask</span> = <span class="eng-meaning">User file creation Mask</span> — "Kullanıcı dosya oluşturma maskesi". Yeni oluşturulan dosya ve dizinlerin varsayılan izinlerini belirler.
    </div>
</div>

<p>Merak ettiniz mi? Yeni bir dosya oluşturduğunuzda neden hep <code>644</code> (rw-r--r--) izni ile, dizinler ise <code>755</code> (rwxr-xr-x) izni ile oluşur? Cevap: <strong>umask</strong>.</p>

<div class="code-block">
    <div class="code-block-header"><span>umask nasıl çalışır</span></div>
    <pre><code><span class="comment"># Mevcut umask değerini göster:</span>
<span class="prompt">$</span> <span class="command">umask</span>
<span class="output">0022</span>

<span class="comment"># umask, temel izinden ÇIKARILIR:</span>
<span class="comment"># Dosyalar için temel izin :  666  (rw-rw-rw-)</span>
<span class="comment"># Dizinler için temel izin :  777  (rwxrwxrwx)</span>
<span class="comment"># umask = 022 ise:</span>
<span class="comment">#   Dosya:  666 - 022 = 644  (rw-r--r--)  ✅</span>
<span class="comment">#   Dizin:  777 - 022 = 755  (rwxr-xr-x)  ✅</span>

<span class="comment"># umask'ı geçici olarak değiştir:</span>
<span class="prompt">$</span> <span class="command">umask</span> <span class="argument">077</span>
<span class="comment"># Artık: Dosya → 600, Dizin → 700 (sadece sahip erişebilir)</span>

<span class="comment"># Sembolik gösterim:</span>
<span class="prompt">$</span> <span class="command">umask -S</span>
<span class="output">u=rwx,g=rx,o=rx</span>

<span class="comment"># Kalıcı umask: ~/.bashrc'ye ekleyin</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"umask 022"</span> >> ~/.bashrc</code></pre>
</div>

<h3>Yaygın umask Değerleri</h3>
<table>
    <tr><th>umask</th><th>Dosya İzni</th><th>Dizin İzni</th><th>Kullanım</th></tr>
    <tr><td><code>022</code></td><td>644 (rw-r--r--)</td><td>755 (rwxr-xr-x)</td><td>Varsayılan — herkes okuyabilir</td></tr>
    <tr><td><code>027</code></td><td>640 (rw-r-----)</td><td>750 (rwxr-x---)</td><td>Grup erişebilir, diğerleri yok</td></tr>
    <tr><td><code>077</code></td><td>600 (rw-------)</td><td>700 (rwx------)</td><td>Sadece sahip — en güvenli</td></tr>
    <tr><td><code>002</code></td><td>664 (rw-rw-r--)</td><td>775 (rwxrwxr-x)</td><td>Grup yazma izni dahil</td></tr>
</table>

<h2>chown — Sahipliği Değiştir</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">chown</span> = <span class="eng-meaning">Change Owner</span> — "Sahibi değiştir". Dosyanın sahibini ve/veya grubunu değiştirir. Genellikle root yetkisi gerektirir.<br>
        <span class="eng-word">chgrp</span> = <span class="eng-meaning">Change Group</span> — "Grubu değiştir". Sadece grup değiştirmek için alternatif komut.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>chown ve chgrp kullanımı</span></div>
    <pre><code><span class="comment"># Sahip değiştir</span>
<span class="prompt">$</span> <span class="command">sudo chown</span> <span class="argument">ali</span> <span class="path">dosya.txt</span>

<span class="comment"># Sahip ve grup değiştir</span>
<span class="prompt">$</span> <span class="command">sudo chown</span> <span class="argument">ali:gelistiriciler</span> <span class="path">proje/</span>

<span class="comment"># Sadece grup değiştir (chown ile)</span>
<span class="prompt">$</span> <span class="command">sudo chown</span> <span class="argument">:gelistiriciler</span> <span class="path">proje/</span>

<span class="comment"># Sadece grup değiştir (chgrp ile — aynı iş)</span>
<span class="prompt">$</span> <span class="command">sudo chgrp</span> <span class="argument">gelistiriciler</span> <span class="path">proje/</span>

<span class="comment"># Özyinelemeli (dizin ve tüm içerikleri)</span>
<span class="prompt">$</span> <span class="command">sudo chown -R</span> <span class="argument">ali:ali</span> <span class="path">proje/</span></code></pre>
</div>

<h2>stat — Detaylı İzin Bilgisi</h2>
<p><code>ls -l</code> izinlerin sembolik gösterimini verir. Daha detaylı bilgi için <code>stat</code> komutunu kullanın:</p>

<div class="code-block">
    <div class="code-block-header">
        <span>stat ile izinleri inceleme</span>
        <button class="try-btn" onclick="runInTerminal('stat notlar.txt')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">$</span> <span class="command">stat</span> <span class="path">dosya.txt</span>
<span class="output">  File: dosya.txt
  Size: 156       Blocks: 8    IO Block: 4096  regular file
Access: (0644/-rw-r--r--)  Uid: (1000/ali)  Gid: (1000/ali)
Access: 2024-01-15 10:30:00
Modify: 2024-01-14 14:22:00
Change: 2024-01-14 14:22:00</span>

<span class="comment"># (0644/-rw-r--r--) → hem sayısal hem sembolik izni gösterir</span>
<span class="comment"># Uid = User ID (sahip), Gid = Group ID (grup)</span></code></pre>
</div>

<h2>Özel İzinler: SUID, SGID ve Sticky Bit</h2>
<p>Temel <code>rwx</code> izinlerinin ötesinde üç özel izin vardır. Bunlar <strong>4 haneli octal</strong> sistemin ilk hanesiyle belirtilir:</p>

<div class="code-block">
    <div class="code-block-header"><span>4 haneli octal izin sistemi</span></div>
    <pre><code><span class="comment"># Normal 3 haneli:  chmod  755  dosya</span>
<span class="comment"># 4 haneli gösterim: chmod 0755 dosya  (aynı şey)</span>
<span class="comment">#                         │</span>
<span class="comment">#                         └── Özel izinler hanesi</span>
<span class="comment">#                             4 = SUID</span>
<span class="comment">#                             2 = SGID</span>
<span class="comment">#                             1 = Sticky Bit</span>
<span class="comment">#</span>
<span class="comment"># Örnekler:</span>
<span class="comment"># chmod 4755 dosya  → SUID + rwxr-xr-x</span>
<span class="comment"># chmod 2755 dizin  → SGID + rwxr-xr-x</span>
<span class="comment"># chmod 1777 dizin  → Sticky + rwxrwxrwx</span></code></pre>
</div>

<h3>1. SUID (Set User ID) — Sayısal: 4000</h3>
<table>
    <tr><th></th><th>Dosyalarda</th><th>Dizinlerde</th></tr>
    <tr><td><strong>Etki</strong></td><td>Dosya çalıştırıldığında, çalıştıranın değil <strong>dosya sahibinin</strong> yetkileriyle çalışır</td><td>Linux'ta dizinlerde <strong>etkisizdir</strong> (yok sayılır)</td></tr>
    <tr><td><strong>Görünüm</strong></td><td><code>rws r-xr-x</code> (owner x yerine <code>s</code>)</td><td>—</td></tr>
    <tr><td><strong>Örnek</strong></td><td><code>/usr/bin/passwd</code> — normal kullanıcı bile şifre değiştirebilir çünkü <code>passwd</code> root olarak çalışır</td><td>—</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>SUID örnekleri</span></div>
    <pre><code><span class="comment"># Gerçek dünya SUID örneği:</span>
<span class="prompt">$</span> <span class="command">ls -l</span> <span class="path">/usr/bin/passwd</span>
<span class="output">-rwsr-xr-x 1 root root 68208 ... /usr/bin/passwd</span>
<span class="comment">#  ^ 's' burada! Normal kullanıcı bu komutu çalıştırınca</span>
<span class="comment"># root izinleriyle çalışır → /etc/shadow'a yazabilir</span>

<span class="comment"># SUID ayarlama:</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">u+s</span> <span class="path">program</span>     <span class="comment"># Sembolik</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">4755</span> <span class="path">program</span>    <span class="comment"># Sayısal</span>

<span class="comment"># SUID kaldırma:</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">u-s</span> <span class="path">program</span>

<span class="comment"># 'S' (büyük) = SUID ayarlı AMA x izni YOK (anlamsız!)</span>
<span class="comment"># 's' (küçük) = SUID ayarlı VE x izni VAR (doğru kullanım)</span></code></pre>
</div>

<h3>2. SGID (Set Group ID) — Sayısal: 2000</h3>
<p>SGID en kafa karıştırıcı özel izindir çünkü dosya ve dizinde <strong>tamamen farklı</strong> davranır:</p>

<table>
    <tr><th></th><th>Dosyalarda</th><th>Dizinlerde</th></tr>
    <tr><td><strong>Etki</strong></td><td>Dosya çalıştırıldığında, çalıştıranın grubu değil <strong>dosyanın grubu</strong> ile çalışır</td><td>Dizin içinde oluşturulan yeni dosya/dizinler, oluşturanın değil <strong>dizinin grubunu miras</strong> alır</td></tr>
    <tr><td><strong>Görünüm</strong></td><td><code>rwxr-sr-x</code> (group x yerine <code>s</code>)</td><td><code>drwxrwsr-x</code></td></tr>
    <tr><td><strong>Kullanım</strong></td><td>Nadir — özel grup gerektiren programlar</td><td><strong>Çok yaygın</strong> — takım paylaşım dizinleri</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>SGID dizin örneği — takım çalışması</span></div>
    <pre><code><span class="comment"># Takım paylaşım dizini oluştur:</span>
<span class="prompt">$</span> <span class="command">sudo mkdir</span> <span class="path">/proje/paylasim</span>
<span class="prompt">$</span> <span class="command">sudo chown</span> <span class="argument">:gelistiriciler</span> <span class="path">/proje/paylasim</span>
<span class="prompt">$</span> <span class="command">sudo chmod</span> <span class="argument">2775</span> <span class="path">/proje/paylasim</span>
<span class="comment">#              ^--- SGID biti ayarlandı</span>

<span class="comment"># Şimdi "ali" bu dizinde dosya oluştursun:</span>
<span class="prompt">ali$</span> <span class="command">touch</span> <span class="path">/proje/paylasim/rapor.txt</span>

<span class="comment"># SGID olmadan: rapor.txt → ali:ali (ali'nin grubu)</span>
<span class="comment"># SGID ile:     rapor.txt → ali:gelistiriciler ✅</span>
<span class="comment"># Tüm takım dosyalara erişebilir!</span>

<span class="comment"># SGID ayarlama:</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">g+s</span> <span class="path">dizin/</span>     <span class="comment"># Sembolik</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">2775</span> <span class="path">dizin/</span>    <span class="comment"># Sayısal</span></code></pre>
</div>

<h3>3. Sticky Bit — Sayısal: 1000</h3>

<table>
    <tr><th></th><th>Dosyalarda</th><th>Dizinlerde</th></tr>
    <tr><td><strong>Etki</strong></td><td>Modern Linux'ta <strong>etkisizdir</strong> (yok sayılır). Tarihsel olarak: dosyayı swap'ta tut.</td><td>Dizin içindeki dosyalar sadece <strong>dosya sahibi</strong>, <strong>dizin sahibi</strong> veya <strong>root</strong> tarafından silinebilir/adlandırılabilir</td></tr>
    <tr><td><strong>Görünüm</strong></td><td>—</td><td><code>drwxrwxrwt</code> (others x yerine <code>t</code>)</td></tr>
    <tr><td><strong>Örnek</strong></td><td>—</td><td><code>/tmp</code> dizini</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>Sticky Bit örnekleri</span></div>
    <pre><code><span class="comment"># /tmp dizinini inceleyelim:</span>
<span class="prompt">$</span> <span class="command">ls -ld</span> <span class="path">/tmp</span>
<span class="output">drwxrwxrwt 15 root root 4096 ... /tmp</span>
<span class="comment">#         ^ 't' = sticky bit</span>
<span class="comment"># Herkes /tmp'ye dosya yazabilir (777) AMA</span>
<span class="comment"># sadece dosya sahibi, dizin sahibi (root) veya root silebilir</span>
<span class="comment"># Bu olmadan herkes başkalarının dosyalarını silebilirdi!</span>

<span class="comment"># Sticky bit ayarlama:</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">+t</span> <span class="path">paylasilan_dizin/</span>     <span class="comment"># Sembolik</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">1777</span> <span class="path">paylasilan_dizin/</span>    <span class="comment"># Sayısal</span>

<span class="comment"># 'T' (büyük) = Sticky ayarlı AMA x izni YOK</span>
<span class="comment"># 't' (küçük) = Sticky ayarlı VE x izni VAR</span></code></pre>
</div>

<h3>Özel İzin Özet Tablosu</h3>
<table>
    <tr><th>İzin</th><th>Sayı</th><th>Sembol</th><th>Dosyalarda</th><th>Dizinlerde</th><th>ls -l Görünümü</th></tr>
    <tr><td>SUID</td><td>4000</td><td><code>u+s</code></td><td>Sahibin yetkileriyle çalışır</td><td>Etkisiz</td><td><code>rwsr-xr-x</code></td></tr>
    <tr><td>SGID</td><td>2000</td><td><code>g+s</code></td><td>Dosya grubunun yetkileriyle çalışır</td><td>Yeni dosyalar dizinin grubunu miras alır</td><td><code>rwxr-sr-x</code></td></tr>
    <tr><td>Sticky</td><td>1000</td><td><code>+t</code></td><td>Modern Linux'ta etkisiz</td><td>Sadece sahip/dizin sahibi/root silebilir</td><td><code>rwxrwxrwt</code></td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 SUID Dosyalarını Bulma (Güvenlik Denetimi)</div>
    Sistemdeki tüm SUID dosyalarını bulmak güvenlik açısından önemlidir:<br>
    <code>find / -perm -4000 -type f 2>/dev/null</code><br>
    SGID dosyaları: <code>find / -perm -2000 -type f 2>/dev/null</code><br>
    Bu, güvenlik denetimlerinde (audit) sık yapılan bir kontroldür.
</div>

<h2>chmod 777 Hakkında Gerçekler</h2>

<div class="info-box warning">
    <div class="info-box-title">⚠️ chmod 777 — Genellikle Kötü Fikir, Ama Her Zaman Değil</div>
    <code>chmod 777</code> tüm kullanıcılara tüm izinleri verir (<code>rwxrwxrwx</code>). İnternette sıkça "asla kullanmayın!" denir, ancak gerçek daha nüanslıdır:
    <br><br>

    <strong>Neden genellikle kötü fikir:</strong><br>
    • Herkes dosyayı değiştirebilir, silebilir veya zararlı kod ekleyebilir<br>
    • SSH gibi bazı servisler aşırı izinli dosyaları <strong>reddeder</strong> (<code>~/.ssh/</code> 777 olursa SSH çalışmaz!)<br>
    • Web sunucusu dizinlerinde 777, exploitlara davetiye çıkarır<br>
    • <strong>Principle of Least Privilege</strong> (En Az Yetki İlkesi): Her kullanıcıya ve programa sadece görevini yapabilmesi için gereken minimum yetkiyi verin. Bu, güvenlik dünyasının temel ilkelerinden biridir.<br><br>

    <strong>Meşru (geçerli) kullanım durumları:</strong><br>
    • <code>/tmp</code> dizini zaten 1777'dir (sticky bit sayesinde güvenlidir)<br>
    • Geçici geliştirme dizinleri (yalnızca sizin eriştiğiniz kişisel makinelerde)<br>
    • Belirli paylaşılan dizinler (sticky bit ile birlikte: <code>chmod 1777</code>)<br>
    • Docker volume'ları gibi izole ortamlarda<br><br>

    <strong>Doğru yaklaşım:</strong> "Neden 777'ye ihtiyacım var?" sorusunu sorun. Cevap genellikle daha spesifik bir izindir: 755, 775 veya grup değişikliği.
</div>

<h2>ACL — Gelişmiş İzin Kontrolü</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Terim</div>
    <div class="eng-content">
        <span class="eng-word">ACL</span> = <span class="eng-meaning">Access Control List</span> — Erişim Kontrol Listesi. Temel sahip/grup/diğer modelinin ötesinde, <strong>belirli kullanıcılara veya gruplara özel izinler</strong> vermenizi sağlar.
    </div>
</div>

<p>Temel Linux izin modeli (rwx) bazen yeterli olmaz. Örneğin: "Ali okuyabilsin, Ayşe yazabilsin, geri kalanlar erişemesin" durumunu standart rwx ile yapamazsınız. ACL bunu çözer.</p>

<div class="code-block">
    <div class="code-block-header"><span>ACL komutları — getfacl ve setfacl</span></div>
    <pre><code><span class="comment"># Dosyanın ACL bilgilerini görüntüle:</span>
<span class="prompt">$</span> <span class="command">getfacl</span> <span class="path">dosya.txt</span>
<span class="output"># file: dosya.txt
# owner: ali
# group: gelistiriciler
user::rw-
group::r--
other::r--</span>

<span class="comment"># Belirli bir kullanıcıya özel izin ver:</span>
<span class="prompt">$</span> <span class="command">setfacl -m</span> <span class="argument">u:ayse:rw</span> <span class="path">dosya.txt</span>
<span class="comment"># -m = modify (değiştir)</span>
<span class="comment"># u:ayse:rw = user ayse'ye read+write ver</span>

<span class="comment"># Belirli bir gruba özel izin ver:</span>
<span class="prompt">$</span> <span class="command">setfacl -m</span> <span class="argument">g:tasarimcilar:r</span> <span class="path">dosya.txt</span>

<span class="comment"># ACL kaldır:</span>
<span class="prompt">$</span> <span class="command">setfacl -x</span> <span class="argument">u:ayse</span> <span class="path">dosya.txt</span>

<span class="comment"># Tüm ACL'leri temizle:</span>
<span class="prompt">$</span> <span class="command">setfacl -b</span> <span class="path">dosya.txt</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 ACL Olan Dosyaları Tanıma</div>
    <code>ls -l</code> çıktısında izin dizisinin sonunda <code>+</code> işareti görürseniz, o dosyanın ACL'si vardır:<br>
    <code>-rw-r--r--<strong>+</strong> 1 ali ali 156 ... dosya.txt</code><br>
    <code>getfacl dosya.txt</code> ile detayları görebilirsiniz.
</div>

<h2>İzin Hesaplayıcı</h2>
<p>Aşağıdaki etkileşimli araçla izinleri deneyimleyin — onay kutularını tıklayarak hem sayısal hem sembolik gösterimi canlı olarak görün:</p>

<div id="permission-calculator" style="background: var(--card-bg); border: 2px solid var(--border-color); border-radius: 12px; padding: 20px; margin: 20px 0;">
    <h3 style="margin-top: 0; text-align: center;">🔢 İzin Hesaplayıcı</h3>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; text-align: center; margin-bottom: 15px;">
        <div>
            <strong>Owner (Sahip)</strong><br>
            <label style="cursor:pointer;"><input type="checkbox" class="perm-cb" data-who="u" data-perm="r" checked> r (4)</label>
            <label style="cursor:pointer;"><input type="checkbox" class="perm-cb" data-who="u" data-perm="w" checked> w (2)</label>
            <label style="cursor:pointer;"><input type="checkbox" class="perm-cb" data-who="u" data-perm="x"> x (1)</label>
        </div>
        <div>
            <strong>Group (Grup)</strong><br>
            <label style="cursor:pointer;"><input type="checkbox" class="perm-cb" data-who="g" data-perm="r" checked> r (4)</label>
            <label style="cursor:pointer;"><input type="checkbox" class="perm-cb" data-who="g" data-perm="w"> w (2)</label>
            <label style="cursor:pointer;"><input type="checkbox" class="perm-cb" data-who="g" data-perm="x"> x (1)</label>
        </div>
        <div>
            <strong>Others (Diğer)</strong><br>
            <label style="cursor:pointer;"><input type="checkbox" class="perm-cb" data-who="o" data-perm="r" checked> r (4)</label>
            <label style="cursor:pointer;"><input type="checkbox" class="perm-cb" data-who="o" data-perm="w"> w (2)</label>
            <label style="cursor:pointer;"><input type="checkbox" class="perm-cb" data-who="o" data-perm="x"> x (1)</label>
        </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; text-align: center; margin-bottom: 15px; padding: 10px; background: var(--bg-color); border-radius: 8px;">
        <div>
            <strong>Özel İzinler</strong><br>
            <label style="cursor:pointer;"><input type="checkbox" class="perm-cb" data-who="sp" data-perm="suid"> SUID (4)</label>
            <label style="cursor:pointer;"><input type="checkbox" class="perm-cb" data-who="sp" data-perm="sgid"> SGID (2)</label>
            <label style="cursor:pointer;"><input type="checkbox" class="perm-cb" data-who="sp" data-perm="sticky"> Sticky (1)</label>
        </div>
        <div style="grid-column: span 2; font-size: 1.5em; font-family: 'Fira Code', monospace; display: flex; align-items: center; justify-content: center; gap: 20px;">
            <span id="perm-octal" style="color: var(--accent-color); font-weight: bold;">0644</span>
            <span id="perm-symbolic" style="color: var(--success-color);">rw-r--r--</span>
        </div>
    </div>
    <div style="text-align: center; font-family: 'Fira Code', monospace; font-size: 0.9em; color: var(--text-light);">
        <code>chmod <span id="perm-cmd-octal">644</span> dosya.txt</code> &nbsp;veya&nbsp;
        <code>chmod <span id="perm-cmd-symbolic">u=rw,g=r,o=r</span> dosya.txt</code>
    </div>
</div>
`,
    quiz: [
        {
            question: "'chmod' komutunun açılımı nedir?",
            options: ["Change Model", "Check Mode", "Change Mode", "Channel Modify"],
            correct: 2,
            explanation: "chmod = Change Mode (Modu değiştir). Dosya izinlerini değiştirmek için kullanılır."
        },
        {
            question: "rwxr-xr-- izni sayısal olarak nedir?",
            options: ["754", "644", "755", "775"],
            correct: 0,
            explanation: "rwx=4+2+1=7, r-x=4+0+1=5, r--=4+0+0=4 → 754"
        },
        {
            question: "Bir dizinde 'x' izni olmadan ama 'r' izniyle ne yapabilirsiniz?",
            options: ["Dizine cd ile girip dosyaları okuyabilirsiniz", "Sadece dosya adlarını listelersiniz, meta bilgilere ve içeriklere erişemezsiniz", "Hiçbir şey yapamazsınız", "Dizini silebilirsiniz"],
            correct: 1,
            explanation: "Dizinde r var x yok: dosya ADLARINı listeleyebilirsiniz ama boyut, tarih, izin gibi bilgilere erişemezsiniz. Dosya içeriğine de ulaşamazsınız."
        },
        {
            question: "SSH özel anahtarınız için hangi izin doğrudur?",
            options: ["777", "755", "644", "600"],
            correct: 3,
            explanation: "SSH anahtarları sadece sahibi tarafından okunmalıdır. 600 (rw-------) doğru izindir. SSH aksi halde çalışmayı reddeder!"
        },
        {
            question: "/tmp dizinindeki 't' (sticky bit) ne sağlar?",
            options: ["Herkes her dosyayı silebilir", "Sadece dosya sahibi, dizin sahibi veya root silebilir", "Sadece root silebilir", "Kimse silemez"],
            correct: 1,
            explanation: "Sticky bit sayesinde /tmp'de herkes dosya oluşturabilir ama sadece dosya sahibi, dizin sahibi veya root silebilir."
        },
        {
            question: "umask 077 ise yeni oluşturulan dosyanın izni ne olur?",
            options: ["777", "644", "600", "755"],
            correct: 2,
            explanation: "Dosyalar 666 temel izinle başlar. 666 - 077 = 600 (rw-------). Sadece sahip okuyup yazabilir."
        },
        {
            question: "SGID dizinlerde ne yapar?",
            options: ["Dizini siler", "Dizine sadece root erişir", "Yeni dosyalar dizinin grubunu miras alır", "Dosyaları şifreler"],
            correct: 2,
            explanation: "SGID ayarlı bir dizinde oluşturulan dosyalar, oluşturanın grubu yerine DİZİNİN grubunu miras alır. Takım çalışması için çok önemli."
        }
    ]
});
