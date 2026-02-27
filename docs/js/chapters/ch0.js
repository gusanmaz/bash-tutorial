// ===== Bölüm 0: Linux'a Giriş =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 0,
    title: "Linux'a Giriş",
    subtitle: 'Introduction to Linux',
    icon: '🐧',
    description: "Linux nedir, nasıl kurulur, nereden başlanır? Dağıtımlar, masaüstü ortamları ve ilk adımlar.",
    content: `
<h2>Linux Nedir?</h2>
<p><strong>Linux</strong>, 1991'de Linus Torvalds tarafından geliştirilen açık kaynaklı bir <strong>işletim sistemi çekirdeğidir (kernel)</strong>. Teknik olarak "Linux" sadece çekirdeği ifade eder; çekirdeğin etrafına araçlar, kütüphaneler ve uygulamalar eklenerek oluşturulan tamamlanmış sistemlere <strong>dağıtım (distribution / distro)</strong> denir.</p>
<div class="info-box note">
    <div class="info-box-title">📌 GNU/Linux</div>
    Tam bir Linux sistemi, Linux çekirdeğinin yanı sıra <strong>GNU projesi</strong> araçlarını da içerir (bash, coreutils, gcc, glibc vb.). Bu nedenle bazı kesimler sistemi "GNU/Linux" olarak adlandırır. Pratikte çoğu kişi kısaca "Linux" der — bu eğitimde de böyle kullanılacaktır.
</div>
<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">Kernel</span> = <span class="eng-meaning">Çekirdek</span> — İşletim sisteminin en alt katmanı, donanımı yöneten yazılım.<br>
        <span class="eng-word">Distribution (Distro)</span> = <span class="eng-meaning">Dağıtım</span> — Linux çekirdeği + araçlar + uygulamalar = kullanıma hazır işletim sistemi.<br>
        <span class="eng-word">Open Source</span> = <span class="eng-meaning">Açık Kaynak</span> — Kaynak kodu herkes tarafından görülebilir, düzenlenebilir ve dağıtılabilir.
    </div>
</div>

<h3>Linux'u Neden Öğrenmeliyim?</h3>
<ul>
    <li><strong>Web sunucularının büyük çoğunluğu</strong> Linux çalıştırır (bulut altyapısı, süper bilgisayarların %100'ü)</li>
    <li><strong>Android</strong> Linux çekirdeği üzerine inşa edilmiştir — dünyada en çok kullanılan mobil OS</li>
    <li><strong>DevOps, yazılım geliştirme, veri bilimi</strong> alanlarında standart</li>
    <li><strong>Tamamen ücretsiz</strong> ve açık kaynak</li>
    <li><strong>Güvenli, hızlı ve özelleştirilebilir</strong></li>
    <li><strong>IoT cihazlardan süper bilgisayarlara</strong> kadar her yerde</li>
</ul>

<h2>📜 Unix'ten Linux'a: Bir Tarihçe</h2>
<p>Linux'u anlamak için önce <strong>Unix'in hikayesini</strong> bilmek gerekir. Çünkü Linux, Unix'in felsefesini ve tasarım ilkelerini miras alan bir işletim sistemidir. Bu, 1960'lardan başlayan büyüleyici bir hikaye...</p>

<h3>🏛️ Unix'in Doğuşu (1969-1973)</h3>

<div class="person-card">
    <img src="img/thompson_ritchie.jpg" alt="Ken Thompson (solda) ve Dennis Ritchie (sağda), 1973" class="person-img person-img-wide">
    <div class="person-info">
        <div class="person-name">Ken Thompson & Dennis Ritchie</div>
        <div class="person-role">Unix'in yaratıcıları — Bell Labs, 1973</div>
        <div class="person-caption">Solda Ken Thompson, sağda Dennis Ritchie. Bu fotoğraf, bilgisayar tarihinin en ikonik karelerinden biridir.</div>
    </div>
</div>

<p>1960'ların sonlarında, AT&T'nin <strong>Bell Laboratuvarları</strong>'nda (Bell Labs) çalışan <strong>Ken Thompson</strong> ve <strong>Dennis Ritchie</strong>, <em>Multics</em> adlı devasa bir işletim sistemi projesinden ayrılmışlardı. Multics çok büyük ve karmaşık bir proje haline gelmişti.</p>

<p>Thompson, 1969'da artık kullanılmayan bir <strong>PDP-7</strong> bilgisayarında kendi işletim sistemini yazmaya başladı. Efsaneye göre, karısı bir ay tatile gittiyse Thompson bir haftasını çekirdeğe, bir haftasını kabuğa (shell), bir haftasını editöre, bir haftasını da assembler'a ayırmıştı. Bu küçük, zarif sistem <strong>Unix</strong> (Multics'e bir kelime oyunu) olarak adlandırıldı.</p>

<p>Unix'i gerçekten devrimci yapan şey 1973'te geldi: Dennis Ritchie, <strong>C programlama dilini</strong> icat etti ve Unix bütünüyle C ile yeniden yazıldı. Bu, bir işletim sisteminin assembly yerine yüksek seviyeli bir dette yazılması için dünya tarihinde bir ilkti — Unix artık <strong>farklı donanımlara taşınabilir (portable)</strong> hale gelmişti.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Unix Felsefesi</div>
    Unix'in tasarım felsefesi bugün hâlâ geçerlidir:<br>
    • <strong>"Her şey bir dosyadır"</strong> — Cihazlar, süreçler, soketler bile dosya olarak temsil edilir<br>
    • <strong>"Her program tek bir iş yapsın, onu iyi yapsın"</strong> — Küçük, odaklanmış araçlar<br>
    • <strong>"Programlar birlikte çalışsın"</strong> — Pipe (|) ile programları zincirleyin<br>
    • <strong>"Metin evrensel arayüzdür"</strong> — Programlar arası veri alışverişi metin ile yapılır<br><br>
    Bu ilkeleri anlamak, bu eğitimdeki her komutu <em>neden</em> öyle çalıştığını kavramanızı sağlar.
</div>

<h3>🔧 C Dili ve Brian Kernighan (1972-1978)</h3>

<div class="person-card">
    <img src="img/brian_kernighan.jpg" alt="Brian Kernighan, Bell Labs, 2012" class="person-img person-img-wide">
    <div class="person-info">
        <div class="person-name">Brian Kernighan</div>
        <div class="person-role">K&R C kitabının yazarı, Unix kültürünün mimarlarından — Bell Labs, 2012</div>
        <div class="person-caption">Kernighan "Unix" adını koyan, awk programını yazan ve C dilini dünyaya tanıtan isimdir. <em>"Hello, World!"</em> programı onun eseridir.</div>
    </div>
</div>

<p><strong>Brian Kernighan</strong>, Dennis Ritchie ile birlikte yazdığı <em>"The C Programming Language"</em> (1978, "K&R" olarak bilinir) kitabıyla C dilini ve Unix kültürünü dünyaya tanıttı. "Unix" adını veren de Kernighan'dır. Ayrıca <code>awk</code> programlama dilinin yaratıcılarından biridir (A=Aho, W=Weinberger, <strong>K=Kernighan</strong>).</p>

<h3>🌳 Unix Ağacı: BSD ve Ticari Unix'ler (1977-1990'lar)</h3>
<p>AT&T, Unix'in kaynak kodunu üniversitelerle paylaştı. <strong>Berkeley Üniversitesi</strong>, kendi değişikliklerini yaparak <strong>BSD (Berkeley Software Distribution)</strong> Unix'ini oluşturdu. Bu ağaçtan ayrılarak şu sistemler doğdu:</p>

<table>
    <tr><th>Sistem</th><th>Yıl</th><th>Açıklama</th></tr>
    <tr><td><strong>BSD Unix</strong></td><td>1977</td><td>Berkeley'den çıkan özgür Unix türevi. TCP/IP ağ protokollerinin ilk implementasyonu BSD'de yapıldı!</td></tr>
    <tr><td><strong>SunOS / Solaris</strong></td><td>1983</td><td>Sun Microsystems'ın Unix'i. Java da burada doğdu.</td></tr>
    <tr><td><strong>HP-UX, AIX, IRIX</strong></td><td>1980'ler</td><td>HP, IBM ve SGI'ın ticari Unix'leri. Büyük kurumsal sunucularda.</td></tr>
    <tr><td><strong>FreeBSD</strong></td><td>1993</td><td>BSD'nin özgür devamı. Netflix sunucuları FreeBSD çalıştırır.</td></tr>
    <tr><td><strong>macOS / Darwin</strong></td><td>2001</td><td>Apple'ın işletim sistemi, NextSTEP üzerinden <strong>BSD Unix temelidir</strong>. Evet, Mac'iniz aslında bir Unix!</td></tr>
</table>

<h3>✊ GNU Projesi ve Özgür Yazılım Hareketi (1983)</h3>

<div class="person-card">
    <img src="img/richard_stallman.jpg" alt="Richard Stallman, 2014" class="person-img">
    <div class="person-info">
        <div class="person-name">Richard Stallman (RMS)</div>
        <div class="person-role">GNU Projesi kurucusu, Özgür Yazılım Hareketi'nin babası — 2014</div>
        <div class="person-caption">Stallman, yazılım özgürlüğü kavramını tanımlayan ve GPL lisansını yaratan kişidir. GCC, Emacs ve GNU araçları onun eseridir.</div>
    </div>
</div>

<p>1980'lerde Unix giderek ticarileşip kapalı kaynak haline geldi. Bu duruma karşı MIT yapay zeka laboratuvarından <strong>Richard Stallman</strong>, 1983'te <strong>GNU Projesini</strong> başlattı. Hedef: tamamen <strong>özgür</strong> bir Unix-uyumlu işletim sistemi yaratmak.</p>

<p>GNU, "GNU's Not Unix" (özyinelemeli kısaltma) anlamına gelir. Stallman ve topluluğu Unix'in tüm parçalarını sıfırdan yazdılar: <code>gcc</code> (derleyici), <code>bash</code> (kabuk), <code>coreutils</code> (ls, cp, mv...), <code>emacs</code> (editör), <code>glibc</code> (C kütüphanesi)... Tek bir parça eksikti: <strong>çekirdek (kernel)</strong>.</p>

<h3>🐧 Linux'un Doğuşu (1991)</h3>

<div class="person-card">
    <img src="img/linus_torvalds.jpg" alt="Linus Torvalds, 2002" class="person-img">
    <div class="person-info">
        <div class="person-name">Linus Torvalds</div>
        <div class="person-role">Linux çekirdeğinin yaratıcısı — Finlandiya, 2002</div>
        <div class="person-caption">"Sadece eğlence olsun diye" başladığı proje, dünyanın en önemli yazılım projelerinden biri oldu.</div>
    </div>
</div>

<p>25 Ağustos 1991'de, Helsinki Üniversitesi'nde 21 yaşında bir öğrenci olan <strong>Linus Torvalds</strong>, Usenet'teki comp.os.minix haber grubuna şu tarihi mesajı gönderdi:</p>

<div class="code-block">
    <div class="code-block-header"><span>Linus Torvalds'ın tarihi mesajı — 25 Ağustos 1991</span></div>
    <pre><code><span class="output">Hello everybody out there using minix -

I'm doing a (free) operating system (just a hobby, won't be big and
professional like gnu) for 386(486) AT clones. This has been brewing
since april, and is starting to get ready. I'd like any feedback on
things people like/dislike in minix, as my OS resembles it somewhat
(same physical layout of the file-system (due to practical reasons)
among other things).

[...] It is NOT portable (uses 386 task switching etc), and it probably
never will support anything other than AT-harddisks, as that's all
I have :-(.

        — Linus Torvalds, 25 August 1991</span></code></pre>
</div>

<p>"Büyük ve profesyonel olmayacak", "muhtemelen sadece AT sabit diskleri destekleyecek"... Torvalds yanılıyordu! 😄 Bugün Linux:</p>
<ul>
    <li><strong>Dünyadaki en hızlı 500 süper bilgisayarın %100'ünde</strong> çalışır</li>
    <li><strong>Android</strong> telefonlardan (3+ milyar cihaz) Mars gezginine kadar her yerde</li>
    <li><strong>Bulut altyapısının ~%90+'ında</strong> (AWS, Google Cloud, Azure)</li>
    <li><strong>30+ milyondan fazla kaynak kodu satırıyla</strong> tarihin en büyük işbirlikçi yazılım projesi</li>
</ul>

<p>GNU'nun tüm araçları hazırdı ama çekirdek (Hurd) tamamlanamamıştı. Torvalds'ın çekirdeği + GNU araçları = <strong>GNU/Linux</strong> — tam bir özgür işletim sistemi doğmuştu.</p>

<h3>⏳ Zaman Çizelgesi</h3>
<table>
    <tr><th>Yıl</th><th>Olay</th><th>Önemi</th></tr>
    <tr><td><strong>1969</strong></td><td>Unix doğdu (Bell Labs)</td><td>Ken Thompson, PDP-7'de ilk Unix'i yazdı</td></tr>
    <tr><td><strong>1972</strong></td><td>C dili yaratıldı</td><td>Dennis Ritchie, Unix'i taşınabilir kıldı</td></tr>
    <tr><td><strong>1973</strong></td><td>Unix C ile yeniden yazıldı</td><td>Tarihte ilk: İşletim sistemi yüksek seviyeli dilde</td></tr>
    <tr><td><strong>1977</strong></td><td>BSD Unix (Berkeley)</td><td>TCP/IP, vi editörü, csh kabuğu</td></tr>
    <tr><td><strong>1978</strong></td><td>K&R C kitabı yayınlandı</td><td>Kernighan & Ritchie, C'yi dünyaya tanıttı</td></tr>
    <tr><td><strong>1983</strong></td><td>GNU Projesi başladı</td><td>Stallman özgür yazılım hareketini başlattı</td></tr>
    <tr><td><strong>1985</strong></td><td>Free Software Foundation kuruldu</td><td>GPL lisansı, gcc, emacs</td></tr>
    <tr><td><strong>1987</strong></td><td>MINIX yayınlandı</td><td>Andrew Tanenbaum'un eğitim amaçlı Unix klonu</td></tr>
    <tr><td><strong>1989</strong></td><td>bash kabuğu yayınlandı</td><td>GNU'nun Bourne kabuğu yerine geçeni (bu eğitimin konusu!)</td></tr>
    <tr><td><strong>1991</strong></td><td>Linux çekirdeği duyuruldu</td><td>Linus Torvalds, tarihi mesajını gönderdi</td></tr>
    <tr><td><strong>1992</strong></td><td>Linux GPL lisansına geçti</td><td>Herkesin katkıda bulunabileceği özgür yazılım</td></tr>
    <tr><td><strong>1993</strong></td><td>Debian ve Slackware</td><td>İlk büyük Linux dağıtımları</td></tr>
    <tr><td><strong>1998</strong></td><td>"Open Source" terimi ortaya çıktı</td><td>İş dünyasına yönelik daha pragmatik bir yaklaşım</td></tr>
    <tr><td><strong>2004</strong></td><td>Ubuntu yayınlandı</td><td>"Linux for Human Beings" — masaüstü Linux'u popülerleştirdi</td></tr>
    <tr><td><strong>2005</strong></td><td>Pardus ve Git</td><td>TÜBİTAK Pardus 1.0'ı yayınladı 🇹🇷 · Torvalds Git'i yazdı</td></tr>
    <tr><td><strong>2008</strong></td><td>Android yayınlandı</td><td>Linux çekirdeği ceplere girdi</td></tr>
    <tr><td><strong>2016</strong></td><td>WSL (Windows Subsystem for Linux)</td><td>Microsoft Windows'a Linux terminali getirdi!</td></tr>
    <tr><td><strong>2020</strong></td><td>Mars'ta Linux</td><td>NASA'nın Ingenuity helikopteri Linux çalıştırdı</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Bu İnsanları Tanımak Neden Önemli?</div>
    Bu eğitimde öğreneceğiniz her komutun arkasında bu insanların fikirleri var:<br>
    • <code>grep</code> — Ken Thompson'ın ed editöründeki <code>g/re/p</code> komutundan gelir<br>
    • <code>|</code> (pipe) — Doug McIlroy'un fikrini Thompson bir gecede Unix'e ekledi<br>
    • <code>bash</code> — Brian Fox, GNU projesi için Bourne Shell'in yerine yazdı<br>
    • <code>gcc</code>, <code>ls</code>, <code>cp</code>, <code>mv</code> — Hepsi GNU projesinden, Stallman'ın vizyonunun ürünü<br>
    • <code>git</code> — Torvalds, Linux çekirdeği geliştirmesi için bizzat yazdı<br><br>
    Tarihi bilmek, araçları <strong>anlamlandırarak</strong> öğrenmenizi sağlar.
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Fotoğraf Lisansları</div>
    Bu sayfadaki fotoğraflar Wikimedia Commons'tan alınmıştır:<br>
    • Thompson & Ritchie: Public Domain (Jargon File)<br>
    • Brian Kernighan: CC BY 2.0, Ben Lowe<br>
    • Richard Stallman: CC BY-SA 3.0, Thesupermat<br>
    • Linus Torvalds: CC BY-SA 3.0, GFDL
</div>

<h2>Linux'un Avantajları</h2>
<p>Linux'un neden bu kadar yaygın ve tercih edildiğini daha ayrıntılı inceleyelim:</p>

<h3>🔓 1. Tamamen Ücretsiz ve Açık Kaynak</h3>
<p>Windows lisansı yüzlerce dolar tutarken, Linux dağıtımlarının büyük çoğunluğu <strong>tamamen ücretsizdir</strong>. Sadece kullanmak değil, kaynak kodunu incelemek, değiştirmek ve dağıtmak da serbesttir. Bu, bireyler için tasarruf, şirketler için ise devasa lisans maliyetlerinden kurtulma anlamına gelir.</p>

<h3>🛡️ 2. Güvenlik</h3>
<p>Linux, güvenlik konusunda Windows'a göre önemli avantajlar sunar:</p>
<ul>
    <li><strong>Daha az hedef:</strong> Masaüstünde düşük pazar payı, virüs yazarları için daha az cazip</li>
    <li><strong>İzin sistemi:</strong> Katı dosya izinleri ve kullanıcı ayrımı (root vs normal kullanıcı)</li>
    <li><strong>Açık kaynak denetimi:</strong> Binlerce geliştirici kodu incelediği için güvenlik açıkları daha hızlı bulunup düzeltilir</li>
    <li><strong>Paket yöneticisi:</strong> Yazılımlar merkezi depolardan indirilir — internetten rastgele .exe indirme riski yok</li>
    <li><strong>Hızlı güncelleme:</strong> Güvenlik yamaları saatler içinde yayınlanır, Microsoft'taki gibi aylarca beklenmez</li>
</ul>

<h3>⚡ 3. Performans ve Hafiflik</h3>
<p>Linux, sistem kaynaklarını çok verimli kullanır:</p>
<ul>
    <li><strong>Eski donanımda bile hızlı:</strong> 15 yıllık bir bilgisayar bile hafif bir dağıtımla (Lubuntu, Puppy Linux) sorunsuz çalışabilir</li>
    <li><strong>Arka planda daha az gereksiz süreç:</strong> Windows'taki telemetri, Cortana, Defender gibi sürekli çalışan servisler yok</li>
    <li><strong>Az RAM kullanımı:</strong> Minimal bir Linux kurulumu 256 MB RAM ile çalışabilir</li>
    <li><strong>Zorla yeniden başlatma yok:</strong> Güncellemeler için bilgisayarınızı yeniden başlatmaya zorlanmazsınız</li>
    <li><strong>Sunucu ortamında:</strong> Linux sunucuları yıllarca yeniden başlatılmadan çalışabilir (uptime)</li>
</ul>

<h3>🎨 4. Özgürlük ve Özelleştirme</h3>
<p>Linux'ta <strong>her şeyi</strong> özelleştirebilirsiniz:</p>
<ul>
    <li><strong>Masaüstü ortamı:</strong> GNOME, KDE, XFCE veya tiling window manager seçin</li>
    <li><strong>Dosya yöneticisi, metin editörü, tarayıcı</strong> — her bileşeni değiştirebilirsiniz</li>
    <li><strong>Tema ve görünüm:</strong> Pencere başlıkları, ikonlar, yazı tipleri, imleçler, panel konumları...</li>
    <li><strong>Reklam ve takip yok:</strong> Windows 11'deki Başlat menüsü reklamları, telemetri vb. yok</li>
    <li><strong>Kendi işletim sisteminizi yapın:</strong> Linux From Scratch projesi ile çekirdeği bile sıfırdan derleyebilirsiniz</li>
</ul>

<h3>🏗️ 5. Geliştirici Dostu</h3>
<p>Yazılım geliştiricilerin çoğu Linux tercih eder, çünkü:</p>
<ul>
    <li><strong>Paket yöneticisi:</strong> <code>apt install python3 nodejs git</code> — tek komutla tüm araçlarınız hazır</li>
    <li><strong>Native CLI araçları:</strong> grep, sed, awk, find, curl, ssh... hepsi kutudan çıkar</li>
    <li><strong>Docker ve konteynerler:</strong> Native Linux desteği, sanal katman gerekmez</li>
    <li><strong>Sunucu ile aynı ortam:</strong> Geliştirme ve production aynı OS — "bende çalışıyor" problemi yok</li>
    <li><strong>Scripting gücü:</strong> Bash, Python, Perl ile her şeyi otomatikleştirebilirsiniz</li>
</ul>

<h2>Açık Kaynak Felsefesi</h2>
<p>Linux'u anlamak için, arkasındaki <strong>açık kaynak felsefesini</strong> de anlamak gerekir. Bu felsefe, yazılımın nasıl geliştirileceği, paylaşılacağı ve kullanılacağı konusundaki temel yaklaşımı belirler.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">Open Source</span> = <span class="eng-meaning">Açık Kaynak</span> — Kaynak kodu herkese açık yazılım.<br>
        <span class="eng-word">Free Software</span> = <span class="eng-meaning">Özgür Yazılım</span> — Kullanıcı özgürlüğünü ön planda tutan yazılım ("free" burada "özgür" anlamında, "ücretsiz" değil).<br>
        <span class="eng-word">Proprietary Software</span> = <span class="eng-meaning">Kapalı Kaynak / Tescilli Yazılım</span> — Kaynak kodu gizli olan yazılım (Windows, macOS).<br>
        <span class="eng-word">License</span> = <span class="eng-meaning">Lisans</span> — Yazılımın kullanım koşullarını belirleyen hukuki belge.
    </div>
</div>

<h3>Kapalı Kaynak vs Açık Kaynak</h3>
<table>
    <tr><th></th><th>Kapalı Kaynak (Proprietary)</th><th>Açık Kaynak (Open Source)</th></tr>
    <tr><td><strong>Kaynak kodu</strong></td><td>Gizli, sadece şirket görür</td><td>Herkes inceleyebilir, değiştirebilir</td></tr>
    <tr><td><strong>Fiyat</strong></td><td>Genellikle ücretli (lisans)</td><td>Genellikle ücretsiz</td></tr>
    <tr><td><strong>Güvenlik</strong></td><td>"Güvenlik gizlilikle" (security by obscurity)</td><td>Binlerce göz kodu denetler → daha az hata</td></tr>
    <tr><td><strong>Geliştirme</strong></td><td>Tek şirket karar verir</td><td>Topluluk katkısıyla gelişir</td></tr>
    <tr><td><strong>Ömür</strong></td><td>Şirket batarsa yazılım da ölür</td><td>Topluluk devam ettirebilir (fork)</td></tr>
    <tr><td><strong>Örnekler</strong></td><td>Windows, macOS, Adobe CC, MS Office</td><td>Linux, Firefox, VLC, LibreOffice, GIMP</td></tr>
</table>

<h3>Özgür Yazılım: Richard Stallman ve GNU Projesi</h3>
<p>1983'te <strong>Richard Stallman</strong>, özgür yazılım hareketini başlattı ve <strong>GNU Projesini</strong> kurdu. Stallman'a göre yazılım kullanıcıları dört temel özgürlüğe sahip olmalıdır:</p>
<ul>
    <li><strong>Özgürlük 0 — Çalıştırma:</strong> Programı herhangi bir amaçla çalıştırma özgürlüğü</li>
    <li><strong>Özgürlük 1 — İnceleme:</strong> Programın nasıl çalıştığını inceleme ve ihtiyaçlarınıza göre değiştirme özgürlüğü</li>
    <li><strong>Özgürlük 2 — Dağıtma:</strong> Kopyaları dağıtarak başkalarına yardım etme özgürlüğü</li>
    <li><strong>Özgürlük 3 — Geliştirip dağıtma:</strong> Değiştirilmiş sürümünüzü başkalarına dağıtma özgürlüğü</li>
</ul>

<div class="info-box note">
    <div class="info-box-title">🤓 Neden 1'den Değil 0'dan Başlıyor?</div>
    Bu bir yazım hatası değil! Stallman ilk başta yalnızca 1, 2 ve 3 numaralı üç özgürlük tanımlamıştı. Daha sonra "programı çalıştırma" özgürlüğünün de listeye eklenmesi gerektiğine karar verdi — ama bu en temel özgürlük olduğu için en başa konmalıydı. Mevcut numaralamayı bozmamak (ve insanları karıştırmamak) için yeni özgürlüğe <strong>0</strong> numarasını verdi. Bu tercih aynı zamanda programcı kültürüne de bir göndermedir: C, Python, JavaScript gibi çoğu programlama dilinde diziler (array) 1'den değil <strong>0'dan</strong> başlar. Stallman bir bilgisayar bilimci olarak bu geleneği benimsemiş oldu.
</div>

<p>Bu felsefe, <strong>GPL (GNU General Public License)</strong> lisansıyla hukuki zemine oturtuldu. Linux çekirdeği de GPL lisansıyla dağıtılır.</p>

<div class="info-box note">
    <div class="info-box-title">📌 "Free" Kelimesinin İki Anlamı</div>
    İngilizce'de "free" hem "ücretsiz" hem "özgür" anlamına gelir. Stallman'ın kastettiği <strong>özgürlüktür</strong>: <em>"Free as in freedom, not as in free beer"</em> (Bira gibi bedava değil, konuşma özgürlüğü gibi özgür). Açık kaynak yazılım ücretli de olabilir ama kaynak kodu her zaman açıktır.
</div>

<h3>Açık Kaynak Ekosistemini Kimler Destekliyor?</h3>
<p>Açık kaynak, "gönüllü hobicilerin" işi değildir. Dünyanın en büyük teknoloji şirketleri açık kaynağa milyarlarca dolar yatırır:</p>
<ul>
    <li><strong>Google:</strong> Android, Chromium, Kubernetes, TensorFlow, Go</li>
    <li><strong>Microsoft:</strong> VS Code, TypeScript, .NET, GitHub'ın sahibi</li>
    <li><strong>Meta (Facebook):</strong> React, PyTorch, Llama AI modelleri</li>
    <li><strong>Red Hat (IBM):</strong> RHEL, Fedora, Ansible, OpenShift</li>
    <li><strong>Amazon:</strong> AWS açık kaynak araçları, Linux çekirdeğine katkılar</li>
    <li><strong>Linus Torvalds:</strong> Linux Foundation tarafından desteklenir, üyeleri arasında tüm büyük teknoloji şirketleri var</li>
</ul>

<div class="info-box tip">
    <div class="info-box-title">💡 Neden Şirketler Açık Kaynağa Katkı Yapar?</div>
    Paradoks gibi görünse de şirketler açık kaynaktan <strong>kâr eder</strong>: ortak geliştirme maliyeti düşürür, standartları belirler, yetenek çeker ve ekosistem oluşturur. Red Hat yılda milyarlarca dolar gelir elde eder — tamamen açık kaynak ürünlerle.
</div>

<h2>Popüler Linux Dağıtımları</h2>
<p>Yüzlerce Linux dağıtımı mevcuttur. İşte başlıcaları:</p>

<h3>🟠 Yeni Başlayanlar İçin</h3>
<table>
    <tr><th>Dağıtım</th><th>Temel Dağıtım</th><th>Özellik</th></tr>
    <tr><td><strong>Ubuntu</strong></td><td>Debian</td><td>En popüler masaüstü dağıtımı. Büyük topluluk, kolay kurulum. Canonical tarafından desteklenir.</td></tr>
    <tr><td><strong>Linux Mint</strong></td><td>Ubuntu</td><td>Windows'tan geçenler için ideal. Geleneksel masaüstü arayüzü.</td></tr>
    <tr><td><strong>Pop!_OS</strong></td><td>Ubuntu</td><td>System76 tarafından. Geliştiriciler ve oyuncular için optimize.</td></tr>
    <tr><td><strong>Zorin OS</strong></td><td>Ubuntu</td><td>Windows/macOS görünümünü taklit edebilir. Geçiş yapanlar için harika.</td></tr>
    <tr><td><strong>Fedora</strong></td><td>Bağımsız</td><td>Red Hat sponsorluğunda. En yeni teknolojileri sunar. GNOME masaüstü ile gelir.</td></tr>
</table>

<h3>🔵 İleri Düzey</h3>
<table>
    <tr><th>Dağıtım</th><th>Özellik</th></tr>
    <tr><td><strong>Debian</strong></td><td>Ubuntu'nun temelini oluşturur. Kararlılık odaklı. Sunucularda yaygın.</td></tr>
    <tr><td><strong>Arch Linux</strong></td><td>Sıfırdan her şeyi siz yaparsınız. Öğretici ama zor. Rolling release (sürekli güncelleme).</td></tr>
    <tr><td><strong>Manjaro</strong></td><td>Arch tabanlı ama kolay kurulum. Arch'ın avantajları, daha az zorluk.</td></tr>
    <tr><td><strong>openSUSE</strong></td><td>YaST yapılandırma aracı. Kurumsal ortamlarda yaygın.</td></tr>
    <tr><td><strong>Gentoo</strong></td><td>Kaynaktan derleme. Maksimum optimizasyon ve öğrenme.</td></tr>
</table>

<h3>🔴 Sunucu / Kurumsal</h3>
<table>
    <tr><th>Dağıtım</th><th>Özellik</th></tr>
    <tr><td><strong>Ubuntu Server</strong></td><td>Bulut ortamlarında en yaygın sunucu dağıtımı.</td></tr>
    <tr><td><strong>RHEL (Red Hat)</strong></td><td>Kurumsal Linux standartı. Ücretli destek.</td></tr>
    <tr><td><strong>Rocky Linux / AlmaLinux</strong></td><td>RHEL uyumlu, ücretsiz topluluk dağıtımları. CentOS'un mirasçıları.</td></tr>
    <tr><td><strong>Alpine Linux</strong></td><td>Ultra hafif (~5 MB). Docker konteynerlerinde çok yaygın.</td></tr>
</table>

<h3>🇹🇷 Türkiye'den: Pardus</h3>
<p><strong>Pardus</strong>, <strong>TÜBİTAK ULAKBİM</strong> tarafından geliştirilen Debian tabanlı bir Linux dağıtımıdır ve Türkiye'nin en önemli milli yazılım projelerinden biridir.</p>

<table>
    <tr><th>Özellik</th><th>Detay</th></tr>
    <tr><td><strong>Geliştirici</strong></td><td>TÜBİTAK ULAKBİM (Ulusal Akademik Ağ ve Bilgi Merkezi)</td></tr>
    <tr><td><strong>Temel</strong></td><td>Debian (kararlı dal)</td></tr>
    <tr><td><strong>Masaüstü</strong></td><td>GNOME (varsayılan) ve XFCE</td></tr>
    <tr><td><strong>Dil Desteği</strong></td><td>Kutudan çıktığı haliyle tam Türkçe — arayüz, yazım denetimi, yerelleştirme</td></tr>
    <tr><td><strong>Hedef Kitle</strong></td><td>Devlet kurumları, okullar, bireysel kullanıcılar</td></tr>
    <tr><td><strong>Paket Yöneticisi</strong></td><td>APT (Debian uyumlu — <code>apt install</code> ile her şey çalışır)</td></tr>
    <tr><td><strong>Web Sitesi</strong></td><td><a href="https://www.pardus.org.tr" target="_blank" rel="noopener">pardus.org.tr</a></td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Pardus'un Kısa Tarihi</div>
    Pardus projesi <strong>2003</strong>'te TÜBİTAK bünyesinde başladı. İlk sürümler (2005-2012) bağımsız bir altyapı kullanıyordu ve PiSi adlı özgün bir paket yöneticisine sahipti. 2013'ten itibaren <strong>Debian tabanına</strong> geçilerek güvenilirlik ve geniş paket deposu avantajı kazanıldı. Bugün Pardus, Türkiye'de birçok kamu kurumu, okul ve üniversitede aktif olarak kullanılmaktadır. Milli Eğitim Bakanlığı'nın bilgisayar laboratuvarlarında Pardus tercih edilmektedir.
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Neden Pardus?</div>
    <ul style="margin:0.5em 0; padding-left:1.5em;">
        <li><strong>Tam Türkçe deneyim:</strong> Arayüz, belgeler ve destek forumları Türkçe</li>
        <li><strong>Debian uyumluluğu:</strong> Debian/Ubuntu için yazılmış tüm rehberler ve paketler Pardus'ta da çalışır</li>
        <li><strong>Devlet desteği:</strong> TÜBİTAK'ın sürekli geliştirme ve güvenlik güncellemesi garantisi</li>
        <li><strong>Kolay geçiş:</strong> Windows'tan gelenler için tanıdık bir masaüstü düzeni</li>
        <li><strong>Eğitim dostu:</strong> Okul sunucusu ve ETAP (Eğitim Teknolojileri) araçları entegre</li>
    </ul>
</div>

<h3>📸 Dağıtımlar Nasıl Görünüyor?</h3>
<div class="screenshot-gallery">
    <div class="screenshot-card">
        <img src="img/distro_ubuntu.jpg" alt="Ubuntu 24.04 LTS masaüstü" loading="lazy">
        <div class="screenshot-label">Ubuntu 24.04 LTS<small>GNOME masaüstü</small></div>
    </div>
    <div class="screenshot-card">
        <img src="img/distro_pardus.jpg" alt="Pardus 23 GNOME masaüstü" loading="lazy">
        <div class="screenshot-label">Pardus 23 🇹🇷<small>GNOME masaüstü — TÜBİTAK</small></div>
    </div>
    <div class="screenshot-card">
        <img src="img/distro_fedora.jpg" alt="Fedora 39 Workstation masaüstü" loading="lazy">
        <div class="screenshot-label">Fedora 39 Workstation<small>GNOME masaüstü</small></div>
    </div>
    <div class="screenshot-card">
        <img src="img/distro_popos.jpg" alt="Pop!_OS 22.04 LTS masaüstü" loading="lazy">
        <div class="screenshot-label">Pop!_OS 22.04 LTS<small>COSMIC masaüstü</small></div>
    </div>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Hangi Dağıtımı Seçmeliyim?</div>
    İlk kez Linux kullanıyorsanız <strong>Ubuntu</strong>, <strong>Linux Mint</strong> veya <strong>Pardus</strong> ile başlayın. Ubuntu ve Mint'in geniş uluslararası toplulukları sayesinde hemen her sorunun çözümünü bulabilirsiniz. <strong>Pardus</strong> ise Türkçe destek, yerel topluluk ve devlet destekli güvenilirlik arayanlar için mükemmel bir tercih — üstelik Debian tabanlı olduğu için Ubuntu/Debian rehberleri Pardus'ta da geçerlidir.
</div>

<h2>Masaüstü Ortamları (Desktop Environments)</h2>
<p>Windows veya macOS'tan farklı olarak, Linux'ta <strong>masaüstü ortamınızı (DE) kendiniz seçebilirsiniz</strong>. Her biri farklı görünüm ve deneyim sunar:</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">Desktop Environment (DE)</span> = <span class="eng-meaning">Masaüstü Ortamı</span> — Pencere yöneticisi, dosya yöneticisi, ayarlar paneli ve uygulamaları içeren grafiksel arayüz paketi.
    </div>
</div>

<table>
    <tr><th>DE</th><th>Stil</th><th>RAM Kullanımı</th><th>Öne Çıkan</th></tr>
    <tr><td><strong>GNOME</strong></td><td>Modern, minimal</td><td>~800 MB</td><td>Ubuntu varsayılanı. macOS benzeri iş akışı. Uzantılarla özelleştirilebilir.</td></tr>
    <tr><td><strong>KDE Plasma</strong></td><td>Zengin, özelleştirilebilir</td><td>~600 MB</td><td>Windows benzeri. Her detay ayarlanabilir. Çok güçlü.</td></tr>
    <tr><td><strong>XFCE</strong></td><td>Geleneksel, hafif</td><td>~400 MB</td><td>Eski bilgisayarlar için ideal. Basit ama etkili.</td></tr>
    <tr><td><strong>Cinnamon</strong></td><td>Geleneksel, modern</td><td>~500 MB</td><td>Linux Mint varsayılanı. Windows'a en yakın deneyim.</td></tr>
    <tr><td><strong>MATE</strong></td><td>Klasik</td><td>~400 MB</td><td>GNOME 2'nin devamı. Nostaljik ama işlevsel.</td></tr>
    <tr><td><strong>LXQt</strong></td><td>Ultra hafif</td><td>~250 MB</td><td>En hafif DE'lerden. Çok eski donanımlar için.</td></tr>
    <tr><td><strong>i3 / Sway</strong></td><td>Tiling (döşeme)</td><td>~50 MB</td><td>Fare kullanmadan, sadece klavyeyle. İleri düzey kullanıcılar.</td></tr>
</table>

<h3>📸 Masaüstü Ortamları Nasıl Görünüyor?</h3>
<div class="screenshot-gallery">
    <div class="screenshot-card">
        <img src="img/de_gnome.jpg" alt="GNOME 47 masaüstü ortamı" loading="lazy">
        <div class="screenshot-label">GNOME 47<small>Modern, minimal — Ubuntu, Fedora, Pardus varsayılanı</small></div>
    </div>
    <div class="screenshot-card">
        <img src="img/de_kde.jpg" alt="KDE Plasma 6 masaüstü ortamı" loading="lazy">
        <div class="screenshot-label">KDE Plasma 6<small>Zengin, özelleştirilebilir — Windows benzeri</small></div>
    </div>
    <div class="screenshot-card">
        <img src="img/de_xfce.jpg" alt="XFCE 4.18 masaüstü ortamı" loading="lazy">
        <div class="screenshot-label">XFCE 4.18<small>Hafif, geleneksel — eski donanımlar için ideal</small></div>
    </div>
</div>

<h2>Linux'u Denemenin Yolları</h2>
<p>Linux'u denemek için mevcut işletim sisteminizi silmenize gerek yok! İşte seçenekleriniz — güvenli olandan daha kalıcı olana doğru:</p>

<h3>1. 🌐 Tarayıcıda Deneyin</h3>
<p>Bu eğitimdeki terminal sandbox'ı gibi web tabanlı çözümler veya <a href="https://distrosea.com" target="_blank" rel="noopener">DistroSea</a> gibi siteler sayesinde kurulum yapmadan tarayıcınızda gerçek Linux dağıtımlarını deneyebilirsiniz.</p>

<h3>2. 💿 Live USB</h3>
<p>Bir USB belleğe Linux yükleyip bilgisayarınızı USB'den başlatarak Linux'u diskinizdeki hiçbir şeye dokunmadan deneyebilirsiniz:</p>
<ol>
    <li><strong>ISO dosyasını indirin</strong> (örn. ubuntu.com'dan)</li>
    <li><strong>Rufus</strong> (Windows) veya <strong>Balena Etcher</strong> (tüm platformlar) ile USB'ye yazın</li>
    <li>Bilgisayarı USB'den başlatın (genellikle F12 veya F2 ile boot menüsü)</li>
    <li>"Try Ubuntu" / "Ubuntu'yu Dene" seçeneğini kullanın</li>
</ol>

<h3>3. 🖥️ Sanal Makine (Virtual Machine)</h3>
<p>Mevcut işletim sisteminizin içinde bir pencerede Linux çalıştırabilirsiniz:</p>
<ul>
    <li><strong>VirtualBox</strong> (ücretsiz, tüm platformlar) — en yaygın seçenek</li>
    <li><strong>VMware Workstation Player</strong> (ücretsiz kişisel kullanım)</li>
    <li><strong>UTM</strong> (macOS için, Apple Silicon desteği)</li>
    <li><strong>GNOME Boxes</strong> (Linux'ta, çok basit)</li>
</ul>

<div class="info-box note">
    <div class="info-box-title">📌 Sanal Makine Ayarları</div>
    Rahat bir deneyim için: en az <strong>2 GB RAM</strong>, <strong>25 GB disk</strong>, <strong>2 CPU çekirdeği</strong> ayırın. GNOME veya KDE kullanacaksanız 4 GB RAM önerilir.
</div>

<h3>4. 🔀 Dual Boot (Çift Önyükleme)</h3>
<p>Aynı bilgisayarda hem Windows hem Linux kurabilirsiniz. Bilgisayarı açarken hangisini kullanacağınızı seçersiniz.</p>

<div class="info-box danger">
    <div class="info-box-title">🚨 Dual Boot Öncesi: VERİLERİNİZİ YEDEKLEYİN!</div>
    Disk bölümleme (partitioning) işlemi veri kaybına neden olabilir. Dual boot kurmadan önce <strong>mutlaka tüm önemli verilerinizi harici bir diske veya bulut depolamaya yedekleyin</strong>. Bu adımı asla atlamayın!
</div>

<h4>Dual Boot Adımları (Özet):</h4>
<ol>
    <li><strong>Verileri yedekleyin</strong> (harici disk, Google Drive, OneDrive vb.)</li>
    <li>Windows'ta <strong>BitLocker'ı kapatın</strong> (varsa)</li>
    <li>Windows'ta <strong>Disk Yönetimi</strong> ile mevcut bölümü küçültün (en az 50 GB boş alan)</li>
    <li>Linux ISO'sunu USB'ye yazdırın (Rufus / Etcher)</li>
    <li>BIOS/UEFI'de <strong>Secure Boot</strong> ayarını kontrol edin (Ubuntu genellikle Secure Boot ile çalışır)</li>
    <li>USB'den başlatıp "Install" (Kur) seçeneğini kullanın</li>
    <li>Kurulum sırasında "Install alongside Windows" / "Windows'un yanına kur" seçeneğini seçin</li>
    <li>GRUB önyükleyicisi yüklenir — her açılışta OS seçimi yaparsınız</li>
</ol>

<h3>5. 🪟 Windows'ta Linux: WSL (Windows Subsystem for Linux)</h3>
<p>Windows 10/11 kullanıcıları, <strong>tam bir Linux ortamını</strong> Windows'un içinde sanal makinesiz çalıştırabilir. WSL 2, gerçek bir Linux çekirdeği kullanır!</p>

<div class="code-block">
    <div class="code-block-header"><span>WSL Kurulumu (PowerShell'de - Yönetici olarak)</span></div>
    <pre><code><span class="comment"># WSL kurulumu (tek komutla!)</span>
<span class="prompt">PS C:\\></span> <span class="command">wsl --install</span>

<span class="comment"># Belirli bir dağıtım kurma</span>
<span class="prompt">PS C:\\></span> <span class="command">wsl --install -d Ubuntu-24.04</span>

<span class="comment"># Mevcut dağıtımları listeleme</span>
<span class="prompt">PS C:\\></span> <span class="command">wsl --list --online</span>

<span class="comment"># Kurulu dağıtımları gösterme</span>
<span class="prompt">PS C:\\></span> <span class="command">wsl --list --verbose</span></code></pre>
</div>

<p>WSL kurulduktan sonra:</p>
<ul>
    <li><strong>Windows Terminal</strong> uygulamasını Microsoft Store'dan yükleyin (çoklu sekme, tema desteği)</li>
    <li>Windows dosyalarınıza <code>/mnt/c/</code> altından erişebilirsiniz</li>
    <li>Linux GUI uygulamaları bile çalıştırabilirsiniz (WSLg ile)</li>
    <li>VS Code için <strong>Remote - WSL</strong> eklentisi ile Linux ortamında geliştirme yapabilirsiniz</li>
</ul>

<div class="info-box tip">
    <div class="info-box-title">💡 Windows'ta Diğer Seçenekler</div>
    <strong>Git Bash:</strong> Git for Windows ile birlikte gelir. Temel bash komutlarını çalıştırır ama tam bir Linux ortamı değildir.<br>
    <strong>Cygwin:</strong> Windows'ta POSIX uyumluluk katmanı. WSL öncesinin çözümüydü, artık WSL tercih edilir.<br>
    <strong>MSYS2:</strong> MinGW tabanlı, geliştiriciler için. Özellikle C/C++ toolchain'leri için kullanılır.
</div>

<h3>6. 🍎 macOS'ta Terminal</h3>
<p>macOS zaten bir Unix tabanlı işletim sistemidir (Darwin çekirdeği). Bu yüzden birçok Linux komutu macOS'ta da çalışır!</p>
<ul>
    <li><strong>Terminal.app</strong> — macOS ile birlikte gelir (<code>CMD + Space</code> → "Terminal")</li>
    <li><strong>iTerm2</strong> — Çok daha gelişmiş terminal emülatörü (bölünmüş ekran, profiller, arama)</li>
    <li><strong>Homebrew</strong> (<code>brew</code>) — macOS paket yöneticisi. Linux araçlarını kolayca yükler: <code>brew install coreutils</code></li>
    <li>Varsayılan kabuk <strong>zsh</strong>'tır (bash'e çok benzer, ek özellikler sunar)</li>
</ul>

<div class="code-block">
    <div class="code-block-header"><span>macOS'ta Homebrew kurulumu ve temel kullanım</span></div>
    <pre><code><span class="comment"># Homebrew kurulumu</span>
<span class="prompt">$</span> <span class="command">/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"</span>

<span class="comment"># GNU coreutils yükleme (Linux ile birebir uyumlu komutlar)</span>
<span class="prompt">$</span> <span class="command">brew install coreutils</span>

<span class="comment"># Artık gls, gcat gibi GNU versiyonları kullanılabilir</span>
<span class="comment"># veya PATH'e ekleyerek ls, cat olarak kullanılabilir</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 macOS vs Linux Farkları</div>
    macOS'ta bazı komutlar Linux versiyonlarından farklı davranabilir (özellikle <code>sed</code>, <code>grep</code>, <code>date</code>). Bunların BSD versiyonları macOS'ta gelir. <code>brew install coreutils</code> ile GNU versiyonlarını kullanabilirsiniz.
</div>

<h2>Bu Eğitim Hakkında</h2>
<p>Bu eğitim, <a href="https://ryanstutorials.net/linuxtutorial/" target="_blank" rel="noopener">Ryan's Linux Tutorial</a>'dan <strong>esinlenilmiş</strong> ancak onun birebir çevirisi <strong>değildir</strong>. Ryan Chadwick'in eğitimi İngilizce Linux öğrenicileri için harika bir kaynaktır ve bu eğitimin içerik yapısı ve akışı o eğitimden ilham almıştır.</p>

<p>Ancak bu Türkçe eğitim:</p>
<ul>
    <li>Orijinalin kapsamını <strong>aşan</strong> konular içerir (WSL, macOS, dağıtımlar, Emacs, nano, vb.)</li>
    <li>Tüm komutların <strong>İngilizce kökenlerini ve anlamlarını</strong> açıklar — hafızada kalıcılığı artırır</li>
    <li><strong>Tarayıcı içi terminal sandbox</strong> ile pratik yapma imkânı sunar</li>
    <li>Komut satırının neden GUI'den <strong>daha hızlı ve güçlü</strong> olduğunu örneklerle gösterir</li>
    <li>Her bölüm sonunda <strong>quiz soruları</strong> ile öğrenmeyi pekiştirir</li>
</ul>

<h2>📚 Öğrenme Kaynakları</h2>
<p>Bu eğitim tek başına yeterli bir başlangıç olmayı hedeflese de, farklı kaynaklardan da faydalanmak öğrenme sürecinizi hızlandırır. İşte bash ve Linux öğrenmek için <strong>gerçekten kaliteli</strong> kaynaklar:</p>

<h3>🌐 İngilizce Online Eğitimler</h3>
<table>
    <tr><th>Kaynak</th><th>Tür</th><th>Açıklama</th></tr>
    <tr><td><strong><a href="https://ryanstutorials.net/linuxtutorial/" target="_blank" rel="noopener">Ryan's Linux Tutorial</a></strong></td><td>Web sitesi</td><td>Bu eğitimin ilham kaynağı. Temiz, adım adım, başlangıç dostu. Komut satırı, dosya sistemi, izinler, scripting konularını kapsar. <strong>Mutlaka göz atın.</strong></td></tr>
    <tr><td><strong><a href="https://linuxcommand.org" target="_blank" rel="noopener">LinuxCommand.org</a></strong></td><td>Web sitesi + Kitap</td><td>William Shotts'un sitesi. <em>"The Linux Command Line"</em> kitabının <strong>ücretsiz PDF'i</strong> burada. Bash'i derinlemesine öğrenmek için en iyi kaynaklardan.</td></tr>
    <tr><td><strong><a href="https://www.gnu.org/software/bash/manual/" target="_blank" rel="noopener">GNU Bash Manual</a></strong></td><td>Resmi doküman</td><td>Bash'in resmi kılavuzu. Her şeyin kaynağı. Referans olarak kullanılır, baştan sona okunmaz.</td></tr>
    <tr><td><strong><a href="https://tldp.org/LDP/abs/html/" target="_blank" rel="noopener">Advanced Bash Scripting Guide</a></strong></td><td>Web kitabı</td><td>Mendel Cooper'ın klasik eseri. Bash scripting konusunda en kapsamlı kaynak. İleri seviye.</td></tr>
    <tr><td><strong><a href="https://explainshell.com" target="_blank" rel="noopener">ExplainShell.com</a></strong></td><td>Araç</td><td>Herhangi bir bash komutunu yapıştırın, her parçasını görsel olarak açıklar. Anlamadığınız komutlar için harika.</td></tr>
    <tr><td><strong><a href="https://www.shellcheck.net" target="_blank" rel="noopener">ShellCheck</a></strong></td><td>Araç</td><td>Bash scriptlerinizdeki hataları ve kötü alışkanlıkları tespit eden online linter. Script yazarken vazgeçilmez.</td></tr>
    <tr><td><strong><a href="https://overthewire.org/wargames/bandit/" target="_blank" rel="noopener">OverTheWire: Bandit</a></strong></td><td>Oyun/Pratik</td><td>SSH ile bağlanıp Linux komutlarını kullanarak seviye geçtiğiniz bir oyun. Eğlenceli ve çok öğretici.</td></tr>
    <tr><td><strong><a href="https://cmdchallenge.com" target="_blank" rel="noopener">CMD Challenge</a></strong></td><td>Pratik</td><td>Tarayıcıda bash problemleri çözün. Başlangıçtan ileri seviyeye.</td></tr>
</table>

<h3>🎬 YouTube Kanalları ve Video Seriler</h3>
<table>
    <tr><th>Kanal / Seri</th><th>Dil</th><th>Açıklama</th></tr>
    <tr><td><strong><a href="https://www.youtube.com/c/Coreyms" target="_blank" rel="noopener">Corey Schafer</a></strong></td><td>🇬🇧 İngilizce</td><td>Python ve Linux eğitimleriyle ünlü. Terminal ve bash komutları üzerine <strong>mükemmel video serileri</strong> var. Anlatımı çok net ve yapılandırılmış. Bash öğrenmek için YouTube'daki en iyi kaynaklardan.</td></tr>
    <tr><td><strong><a href="https://www.youtube.com/results?search_query=ken+thompson+unix+interview" target="_blank" rel="noopener">Ken Thompson & Dennis Ritchie Röportajları</a></strong></td><td>🇬🇧 İngilizce</td><td>Unix ve C'nin yaratıcılarının eski röportajları ve konuşmaları. Tarihi değeri çok yüksek — Unix felsefesini ilk ağızdan dinlemek. AT&T arşiv videoları özellikle değerli. <a href="https://www.youtube.com/watch?v=tc4ROCJYbm0" target="_blank" rel="noopener"><em>"AT&T Archives: The UNIX Operating System"</em></a> (1982) efsanevi bir belgesel.</td></tr>
    <tr><td><strong><a href="https://www.youtube.com/@NetworkChuck" target="_blank" rel="noopener">NetworkChuck</a></strong></td><td>🇬🇧 İngilizce</td><td>Linux, networking, hacking konularında enerjik ve eğlenceli videolar. Yeni başlayanlar için motivasyon kaynağı.</td></tr>
    <tr><td><strong><a href="https://www.youtube.com/@LearnLinuxTV" target="_blank" rel="noopener">LearnLinux.tv</a></strong></td><td>🇬🇧 İngilizce</td><td>Jay LaCroix'nın kanalı. Linux dağıtımları, sunucu yönetimi, bash scripting konularında detaylı ve profesyonel seriler.</td></tr>
    <tr><td><strong><a href="https://www.youtube.com/@DistroTube" target="_blank" rel="noopener">DistroTube</a></strong></td><td>🇬🇧 İngilizce</td><td>Derek Taylor'ın kanalı. Terminal araçları, window manager'lar, Linux felsefesi. İleri düzey kullanıcılar için ilham verici.</td></tr>
    <tr><td><strong><a href="https://www.youtube.com/@ThePrimeTimeagen" target="_blank" rel="noopener">ThePrimeagen</a></strong></td><td>🇬🇧 İngilizce</td><td>Vim, tmux, terminal iş akışı konusunda eğlenceli ve hızlı paced videolar. Terminal'de verimlilik için ilham kaynağı.</td></tr>
    <tr><td><strong><a href="https://www.youtube.com/results?search_query=brian+kernighan+unix" target="_blank" rel="noopener">Brian Kernighan Dersleri</a></strong></td><td>🇬🇧 İngilizce</td><td>Unix'in efsane isimlerinden Kernighan'ın (K&R C kitabının yazarı) Computerphile'daki Unix/pipe/grep videoları. Bilgisayar tarihini yaşayan birinden dinlemek paha biçilmez.</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Tarihi Videolar — Neden İzlemeli?</div>
    Ken Thompson, Dennis Ritchie ve Brian Kernighan'ın eski videolarını izlemek sadece nostalji değil — Unix'in <strong>neden</strong> böyle tasarlandığını anlamak, bugünkü Linux komutlarını çok daha iyi kavramanızı sağlar. <code>grep</code>'in neden "grep" olduğunu, pipe'ların neden <code>|</code> ile yazıldığını, "her şey bir dosyadır" felsefesinin nereden geldiğini bu röportajlarda öğrenirsiniz.<br><br>
    <strong>Özellikle izleyin:</strong><br>
    • <a href="https://www.youtube.com/watch?v=tc4ROCJYbm0" target="_blank" rel="noopener"><em>"AT&T Archives: The UNIX Operating System"</em></a> — 1982 AT&T Bell Labs<br>
    • Brian Kernighan'ın Computerphile videolar ("UNIX Pipeline", "Where GREP Came From")<br>
    • Ken Thompson'ın Google'daki konuşmaları
</div>

<h3>📖 Kitaplar</h3>
<table>
    <tr><th>Kitap</th><th>Yazar</th><th>Açıklama</th></tr>
    <tr><td><strong>The Linux Command Line</strong></td><td>William Shotts</td><td><strong>Ücretsiz PDF mevcut!</strong> Bash ve Linux komut satırı için en iyi başlangıç kitabı. <a href="https://linuxcommand.org/tlcl.php" target="_blank" rel="noopener">linuxcommand.org</a>'dan indirin.</td></tr>
    <tr><td><strong>Linux Pocket Guide</strong></td><td>Daniel J. Barrett</td><td>Cep rehberi formatında. Hızlı referans olarak masanızda bulunsun.</td></tr>
    <tr><td><strong>How Linux Works</strong></td><td>Brian Ward</td><td>Linux'un iç işleyişini (boot süreci, kernel, ağ) derinlemesine anlatan kitap. Orta-ileri seviye.</td></tr>
    <tr><td><strong>The Unix Programming Environment</strong></td><td>Kernighan & Pike</td><td>1984'ten kalma ama hâlâ geçerli Unix klasiği. Pipe, filtre ve Unix felsefesini öğreten en iyi eser.</td></tr>
    <tr><td><strong>Learning the bash Shell</strong></td><td>Cameron Newham</td><td>O'Reilly'nin bash kitabı. Scripting konusunda derinlemesine.</td></tr>
    <tr><td><strong>Unix and Linux System Administration Handbook</strong></td><td>Nemeth, Snyder vd.</td><td>"ULSAH" olarak bilinen Dev sistem yönetimi referansı. Profesyonel sistem yöneticileri için.</td></tr>
</table>

<h3>🇹🇷 Türkçe Kaynaklar</h3>
<p>Türkçe Linux kaynakları İngilizce'ye göre daha sınırlı olsa da bazı kaliteli kaynaklar mevcuttur:</p>
<table>
    <tr><th>Kaynak</th><th>Tür</th><th>Açıklama</th></tr>
    <tr><td><strong><a href="https://www.linuxdersleri.net" target="_blank" rel="noopener">Linux Dersleri (Taylan Özgür Bildik)</a></strong></td><td>Web sitesi + Video</td><td>Türkçe'deki <strong>en kapsamlı Linux eğitimi</strong>. Temel Linux, network, komut listesi, bilgi testleri. Ücretsiz, detaylı, sürekli güncelleniyor. GitHub'ında kaynak kodları da açık. <strong>Kesinlikle göz atın.</strong></td></tr>
    <tr><td><strong><a href="https://wiki.archlinux.org/title/Main_page_(T%C3%BCrk%C3%A7e)" target="_blank" rel="noopener">Arch Wiki (Türkçe sayfalar)</a></strong></td><td>Wiki</td><td>Linux hakkında dünyadaki <strong>en detaylı wiki</strong>. Arch kullanmasanız bile geçerli. Temel konularda Türkçe sayfaları mevcut. Geri kalanı İngilizce ama o da çok öğretici.</td></tr>
    <tr><td><strong><a href="https://www.youtube.com/playlist?list=PLGWmuqrfJZRscAXSYLLQEfBCa2TidEUid" target="_blank" rel="noopener">Siber Kampüs — Linux Eğitimi</a></strong></td><td>Video serisi</td><td>Türkçe <strong>"Sıfırdan İleri Seviyeye Linux"</strong> video serisi. 8 video: İşletim sistemi nedir, Kali Linux kurulumu, temel komutlar ve ileri seviye konular. Başlangıç için güzel bir Türkçe kaynak.</td></tr>
    <tr><td><strong><a href="https://forum.ubuntu-tr.net" target="_blank" rel="noopener">Ubuntu Türkiye Forumu</a></strong></td><td>Forum</td><td>540.000+ ileti, 30.000+ üyeli aktif Türkçe Linux topluluğu. Soru sorun, arşivde arayın. "Kabuk" bölümünde bash örnekleri de var.</td></tr>
    <tr><td><strong><a href="https://man7.org/linux/man-pages/" target="_blank" rel="noopener">Man Pages (man komutu)</a></strong></td><td>Referans</td><td>Her Linux komutunun yerleşik kılavuzu. Terminal'de <code>man ls</code>, <code>man grep</code> yazın. İngilizce ama <strong>en yetkili ve güncel kaynak</strong>. Alttaki web sitesinden de okunabilir.</td></tr>
    <tr><td><strong><a href="https://tldr.sh" target="_blank" rel="noopener">tldr pages</a></strong></td><td>Referans</td><td>Man sayfaları çok uzun mu? <code>tldr</code> komutu pratik örneklerle kısa açıklamalar sunar. <code>npm install -g tldr</code> veya <code>pip install tldr</code> ile kurun.</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 En İyi Öğrenme Stratejisi</div>
    Linux öğrenmenin altın kuralı: <strong>oku + uygula + tekrarla</strong>.<br><br>
    1. <strong>Bu eğitimi takip edin</strong> (terminal sandbox'ı ile pratik yapın)<br>
    2. <strong>Gerçek bir Linux ortamı kurun</strong> (WSL, sanal makine veya dual boot)<br>
    3. <strong>Günlük işlerinizi terminal'de yapmaya çalışın</strong> (dosya kopyalama, arama, Git...)<br>
    4. <strong>OverTheWire Bandit</strong> oynayarak pratik yapın<br>
    5. <strong>Basit bash scriptleri</strong> yazın (yedekleme, dosya düzenleme)<br>
    6. Takıldığınızda <code>man komut</code>, <code>komut --help</code> ve Stack Overflow kullanın<br><br>
    Video izleyerek Linux öğrenilmez — <strong>yaparak öğrenilir!</strong> Videoları ilham ve kavrayış için izleyin, ama mutlaka klavyeye dokunun.
</div>
`,
    quiz: [
        {
            question: "Linux teknik olarak nedir?",
            options: ["Bir web tarayıcısı", "Bir işletim sistemi çekirdeği (kernel)", "Bir programlama dili", "Bir masaüstü ortamı"],
            correct: 1,
            explanation: "Linux teknik olarak bir çekirdektir (kernel). Çekirdeğin etrafına araçlar eklenerek oluşturulan sistemlere 'dağıtım' (distribution) denir."
        },
        {
            question: "Yeni başlayanlar için en çok önerilen dağıtım hangisidir?",
            options: ["Arch Linux", "Gentoo", "Ubuntu veya Linux Mint", "Alpine Linux"],
            correct: 2,
            explanation: "Ubuntu ve Linux Mint, kolay kurulumları ve büyük toplulukları sayesinde yeni başlayanlar için idealdir."
        },
        {
            question: "Windows'ta tam bir Linux ortamı çalıştırmak için ne kullanılır?",
            options: ["WSL (Windows Subsystem for Linux)", "Internet Explorer", "Paint", "Task Manager"],
            correct: 0,
            explanation: "WSL (Windows Subsystem for Linux), Windows 10/11'de sanal makine gerektirmeden gerçek bir Linux ortamı sağlar."
        },
        {
            question: "Dual boot kurmadan önce en önemli adım nedir?",
            options: ["Bilgisayarı formatlama", "Verileri yedekleme", "Yeni monitör alma", "İnterneti kapatma"],
            correct: 1,
            explanation: "Dual boot disk bölümleme gerektirdiğinden, veri kaybı riski vardır. Öncesinde mutlaka yedek alınmalıdır!"
        },
        {
            question: "macOS hangi kabuk (shell) programını varsayılan olarak kullanır?",
            options: ["Bash", "Fish", "Zsh", "PowerShell"],
            correct: 2,
            explanation: "macOS Catalina (2019) ile birlikte varsayılan kabuk bash'ten zsh'ye (Z Shell) değiştirildi."
        },
        {
            question: "GPL (GNU General Public License) ne sağlar?",
            options: ["Yazılımı sadece ücretli yapar", "Kaynak kodunun açık olmasını ve özgürce dağıtılmasını garanti eder", "Yazılımı sadece Linux'ta çalıştırır", "Virüs koruması sağlar"],
            correct: 1,
            explanation: "GPL, yazılımın kaynak kodunun açık olmasını, değiştirilip dağıtılabilmesini garanti eden bir özgür yazılım lisansıdır. Linux çekirdeği GPL ile lisanslanmıştır."
        },
        {
            question: "Richard Stallman'ın 'Free Software' kavramındaki 'free' ne anlama gelir?",
            options: ["Ücretsiz", "Özgür", "Hızlı", "Kolay"],
            correct: 1,
            explanation: "Stallman'ın 'free' ile kastettiği 'özgürlük'tür, 'ücretsizlik' değil. 'Free as in freedom, not as in free beer' — yazılımı inceleme, değiştirme ve dağıtma özgürlüğü."
        },
        {
            question: "Linux'un güvenlik avantajlarından biri aşağıdakilerden hangisidir?",
            options: ["Hiçbir virüs çalışmaz", "Yazılımlar merkezi depolardan güvenle indirilir", "İnternet bağlantısı gerektirmez", "Otomatik şifreleme yapar"],
            correct: 1,
            explanation: "Linux'ta yazılımlar güvenilir merkezi depolardan (repository) paket yöneticisi aracılığıyla indirilir. İnternetten rastgele .exe indirme riski yoktur."
        },
        {
            question: "Unix'i 1969'da Bell Labs'ta kim yazmıştır?",
            options: ["Linus Torvalds", "Richard Stallman", "Ken Thompson", "Brian Kernighan"],
            correct: 2,
            explanation: "Ken Thompson, 1969'da Bell Labs'taki bir PDP-7 bilgisayarında ilk Unix'i yazdı. Dennis Ritchie ile birlikte geliştirmeye devam ettiler."
        },
        {
            question: "Unix'i devrimci yapan, 1973'te gerçekleşen olay neydi?",
            options: ["İlk GUI eklenmesi", "C dili ile yeniden yazılarak taşınabilir hale gelmesi", "İlk web tarayıcısının yazılması", "Açık kaynak lisansı alması"],
            correct: 1,
            explanation: "Dennis Ritchie'nin icat ettiği C dili ile Unix yeniden yazıldı. Bu, bir işletim sisteminin yüksek seviyeli dilde yazılması için tarihte bir ilk oldu ve Unix'i farklı donanımlara taşınabilir kıldı."
        },
        {
            question: "Linus Torvalds Linux çekirdeğini ilk duyurduğunda ne demişti?",
            options: ["Bu dünyanın en büyük projesi olacak", "Sadece bir hobi, büyük ve profesyonel olmayacak", "GNU'nun resmi çekirdeği olacak", "Windows'u yok edecek"],
            correct: 1,
            explanation: "Torvalds 1991'deki tarihi mesajında 'just a hobby, won\\'t be big and professional like gnu' demişti. Bugün Linux dünyadaki en büyük işbirlikçi yazılım projesidir — çok yanılmıştı! 😄"
        }
    ]
});
