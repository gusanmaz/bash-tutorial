// ===== Bölüm 2: Temel Navigasyon =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 2,
    title: 'Temel Navigasyon',
    subtitle: 'Basic Navigation',
    icon: '🧭',
    description: 'Linux dizin sistemi, dosya hiyerarşisi ve içinde nasıl gezinileceği.',
    content: `
<h2>Linux Dizin Yapısı</h2>
<p>Linux'ta dosya sistemi bir <strong>ağaç (tree)</strong> yapısındadır. En üstte <code>/</code> (root — kök) dizini bulunur ve tüm dosya/dizinler bunun altında yer alır. Windows'taki <code>C:\\</code> gibi sürücü harfleri yoktur — her şey tek bir kök dizinden dallanır.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">Root ( / )</span> = <span class="eng-meaning">Kök</span> — Dosya sisteminin en üst noktası. Her şey buradan dallanır.<br>
        <span class="eng-word">Directory</span> = <span class="eng-meaning">Dizin (Klasör)</span> — Windows'taki "folder" kavramının karşılığı.<br>
        <span class="eng-word">Path</span> = <span class="eng-meaning">Yol</span> — Bir dosya veya dizinin konumunu belirten adres.<br>
        <span class="eng-word">FHS</span> = <span class="eng-meaning">Filesystem Hierarchy Standard</span> — Linux'ta dizinlerin nereye ne konulacağını belirleyen standart.
    </div>
</div>

<h3>Linux Dosya Hiyerarşisi (FHS)</h3>
<table>
    <tr><th>Dizin</th><th>İngilizce Anlamı</th><th>Açıklama</th></tr>
    <tr><td><code>/</code></td><td>Root (Kök)</td><td>Dosya sisteminin en üst dizini. Her şey burada başlar.</td></tr>
    <tr><td><code>/home</code></td><td>Home (Ev)</td><td>Kullanıcıların kişisel dizinleri. <code>/home/ali</code>, <code>/home/veli</code> gibi.</td></tr>
    <tr><td><code>/root</code></td><td>Root's Home</td><td>root (yönetici) kullanıcının ev dizini. <code>/home/root</code> DEĞİL!</td></tr>
    <tr><td><code>/etc</code></td><td>Et cetera</td><td>Sistem yapılandırma dosyaları. Ağ, kullanıcı, servis ayarları burada.</td></tr>
    <tr><td><code>/var</code></td><td>Variable (Değişken)</td><td>Log dosyaları, veritabanları, e-posta kuyrukları gibi değişen veriler.</td></tr>
    <tr><td><code>/tmp</code></td><td>Temporary (Geçici)</td><td>Geçici dosyalar. Yeniden başlatmada silinebilir.</td></tr>
    <tr><td><code>/usr</code></td><td>Unix System Resources</td><td>Kullanıcı programları, kütüphaneler, belgeler. (İlk zamanlar "User" anlamındaydı.)</td></tr>
    <tr><td><code>/usr/bin</code></td><td>User Binaries</td><td>Kullanıcı komutları. <code>ls</code>, <code>grep</code>, <code>python3</code> burada.</td></tr>
    <tr><td><code>/usr/local</code></td><td>Local</td><td>Elle kurduğunuz programlar. Paket yöneticisi dışı yazılımlar.</td></tr>
    <tr><td><code>/bin</code></td><td>Binary (İkili)</td><td>Temel sistem komutları. Modern dağıtımlarda <code>/usr/bin</code>'e sembolik link.</td></tr>
    <tr><td><code>/sbin</code></td><td>System Binary</td><td>Sistem yönetim komutları. <code>fdisk</code>, <code>ip</code>, <code>reboot</code> gibi.</td></tr>
    <tr><td><code>/dev</code></td><td>Devices (Cihazlar)</td><td>Donanım aygıt dosyaları. <code>/dev/sda</code> = disk, <code>/dev/null</code> = kara delik.</td></tr>
    <tr><td><code>/proc</code></td><td>Processes (İşlemler)</td><td><strong>Sanal dosya sistemi</strong> — diskte yer kaplamaz! Çekirdek tarafından anlık üretilir. Çalışan işlem bilgileri, CPU, bellek durumu.</td></tr>
    <tr><td><code>/sys</code></td><td>System</td><td><strong>Sanal dosya sistemi</strong> — çekirdek ve donanım bilgileri. <code>/proc</code>'a benzer, daha düzenli yapıda.</td></tr>
    <tr><td><code>/lib</code></td><td>Libraries (Kütüphaneler)</td><td>Paylaşılan kütüphane dosyaları (.so). Windows'taki .dll karşılığı.</td></tr>
    <tr><td><code>/opt</code></td><td>Optional</td><td>Üçüncü taraf yazılımlar. Steam, Google Chrome gibi.</td></tr>
    <tr><td><code>/mnt</code></td><td>Mount (Bağlama)</td><td>Geçici bağlama noktası. USB, harici disk.</td></tr>
    <tr><td><code>/media</code></td><td>Media</td><td>Otomatik bağlanan çıkarılabilir medya. USB bellek, CD-ROM.</td></tr>
    <tr><td><code>/boot</code></td><td>Boot (Önyükleme)</td><td>Linux çekirdeği ve önyükleme dosyaları.</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 /dev/null — Kara Delik</div>
    <code>/dev/null</code> özel bir "dosya"dır — içine yazılan her şey kaybolur! Gereksiz çıktıyı yok etmek için kullanılır:<br>
    <code>komut 2>/dev/null</code> — hata mesajlarını gizle<br>
    <code>komut > /dev/null 2>&1</code> — tüm çıktıyı gizle
</div>

<h2>pwd — Neredeyim?</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">pwd</span> = <span class="eng-meaning">Print Working Directory</span> — "Çalışma dizinini yazdır". Şu anda hangi dizinde olduğunuzu gösterir.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>pwd kullanımı</span>
        <button class="try-btn" onclick="runInTerminal('pwd')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">kullanici@linux:~$</span> <span class="command">pwd</span>
<span class="output">/home/kullanici</span></code></pre>
</div>

<h2>ls — Ne Var Burada?</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">ls</span> = <span class="eng-meaning">List</span> — "Listele". Bulunduğunuz dizindeki dosya ve dizinleri listeler.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>ls kullanımı</span>
        <button class="try-btn" onclick="runInTerminal('ls')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">kullanici@linux:~$</span> <span class="command">ls</span>
<span class="output">Belgeler  Indirmeler  Masaustu  Muzik  Resimler  Videolar  notlar.txt  merhaba.sh  projeler</span></code></pre>
</div>

<h3>ls'in Önemli Seçenekleri</h3>
<table>
    <tr><th>Seçenek</th><th>İngilizce</th><th>Açıklama</th></tr>
    <tr><td><code>-l</code></td><td>Long</td><td>Uzun format: izinler, sahip, boyut, tarih</td></tr>
    <tr><td><code>-a</code></td><td>All</td><td>Gizli dosyalar dahil tümünü göster (<code>.</code> ve <code>..</code> dahil)</td></tr>
    <tr><td><code>-h</code></td><td>Human-readable</td><td>Boyutları okunabilir göster (KB, MB, GB)</td></tr>
    <tr><td><code>-R</code></td><td>Recursive</td><td>Alt dizinlerin içeriğini de göster</td></tr>
    <tr><td><code>-t</code></td><td>Time</td><td>Değişiklik zamanına göre sırala (en yeni ilk)</td></tr>
    <tr><td><code>-S</code></td><td>Size</td><td>Dosya boyutuna göre sırala (en büyük ilk)</td></tr>
    <tr><td><code>-r</code></td><td>Reverse</td><td>Sıralamayı tersine çevir</td></tr>
    <tr><td><code>-d</code></td><td>Directory</td><td>Dizinin kendisini göster (içeriğini değil)</td></tr>
    <tr><td><code>--color</code></td><td>Color</td><td>Dosya türlerine göre renklendirme (dizinler mavi, çalıştırılabilirler yeşil vb.)</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 ls --color</div>
    Çoğu dağıtımda <code>ls</code> alias olarak <code>ls --color=auto</code> şeklinde ayarlanmıştır. Bu yüzden te dizinler mavi, sembolik linkler cyan, çalıştırılabilir dosyalar yeşil renkte görünür. Renklendirme yoksa <code>~/.bashrc</code>'ye ekleyebilirsiniz:<br>
    <code>alias ls='ls --color=auto'</code>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>ls -lah (en popüler kombinasyon)</span>
        <button class="try-btn" onclick="runInTerminal('ls -lah')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">kullanici@linux:~$</span> <span class="command">ls</span> <span class="argument">-lah</span>
<span class="comment"># -l: ayrıntılı,  -a: gizliler dahil,  -h: okunabilir boyut</span>
<span class="comment"># En çok kullanılan ls kombinasyonu!</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>ls -l çıktısını okuma</span>
        <button class="try-btn" onclick="runInTerminal('ls -l')">Terminalde Dene</button>
    </div>
    <pre><code><span class="output">-rw-r--r-- 1 kullanici kullanici  156 Şub 26 10:00 notlar.txt
drwxr-xr-x 3 kullanici kullanici 4096 Şub 26 10:00 Belgeler</span>
<span class="comment">#│         │ │         │          │    │             └── Dosya adı</span>
<span class="comment">#│         │ │         │          │    └── Tarih</span>
<span class="comment">#│         │ │         │          └── Boyut (bayt)</span>
<span class="comment">#│         │ │         └── Grup</span>
<span class="comment">#│         │ └── Sahip (owner)</span>
<span class="comment">#│         └── Hard link sayısı</span>
<span class="comment">#└── İzinler ve dosya türü (d=dizin, -=dosya, l=link)</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Gizli Dosyalar</div>
    Linux'ta nokta (.) ile başlayan dosyalar <strong>gizli dosyalardır</strong>. Örneğin <code>.bashrc</code>, <code>.profile</code>, <code>.config/</code>. Bu dosyalar genellikle yapılandırma ayarları içerir. Görmek için <code>ls -a</code> gerekir.
</div>

<h2>cd — Dizin Değiştir</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">cd</span> = <span class="eng-meaning">Change Directory</span> — "Dizin değiştir". Başka bir dizine gitmek için kullanılır.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>cd kullanımı</span>
        <button class="try-btn" onclick="runInTerminal('cd Belgeler && pwd')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">kullanici@linux:~$</span> <span class="command">cd</span> <span class="path">Belgeler</span>
<span class="prompt">kullanici@linux:~/Belgeler$</span> <span class="command">pwd</span>
<span class="output">/home/kullanici/Belgeler</span></code></pre>
</div>

<h3>cd Kısayolları</h3>
<table>
    <tr><th>Komut</th><th>İngilizce</th><th>Açıklama</th></tr>
    <tr><td><code>cd ..</code></td><td>Parent (üst)</td><td>Bir üst dizine git</td></tr>
    <tr><td><code>cd ~</code> veya <code>cd</code></td><td>Home (ev)</td><td>Ev dizinine git</td></tr>
    <tr><td><code>cd /</code></td><td>Root (kök)</td><td>Kök dizine git</td></tr>
    <tr><td><code>cd -</code></td><td>Previous (önceki)</td><td>Önceki dizine dön (çok kullanışlı!)</td></tr>
    <tr><td><code>cd ../../</code></td><td></td><td>İki üst dizine git</td></tr>
    <tr><td><code>cd ~/Belgeler</code></td><td></td><td>Ev dizini altındaki Belgeler'e git</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 cd - harika bir kısayol!</div>
    <code>cd -</code> sizi en son bulunduğunuz dizine geri götürür. İki dizin arasında sürekli geçiş yapıyorsanız bunu kullanın!
</div>

<h2>Mutlak ve Göreceli Yollar</h2>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">Absolute Path</span> = <span class="eng-meaning">Mutlak Yol</span> — <code>/</code> ile başlar, kök dizinden tam adres verir. Ör: <code>/home/kullanici/Belgeler</code><br>
        <span class="eng-word">Relative Path</span> = <span class="eng-meaning">Göreceli Yol</span> — Bulunduğunuz dizine göre adres verir. Ör: <code>Belgeler/rapor.txt</code>
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Mutlak vs Göreceli Yol</span></div>
    <pre><code><span class="comment"># Mutlak yol (Absolute path) — her zaman / ile başlar</span>
<span class="prompt">kullanici@linux:~$</span> <span class="command">cd</span> <span class="path">/home/kullanici/Belgeler</span>

<span class="comment"># Göreceli yol (Relative path) — bulunulan dizine göre</span>
<span class="prompt">kullanici@linux:~$</span> <span class="command">cd</span> <span class="path">Belgeler</span>

<span class="comment"># Her ikisi de aynı yere götürür! (eğer ~ = /home/kullanici ise)</span>

<span class="comment"># Ne zaman hangisini kullanmalı?</span>
<span class="comment"># Mutlak yol: Script yazarken, kesin konum gerektiğinde</span>
<span class="comment"># Göreceli yol: Günlük kullanımda, daha kısa yazmak istediğinizde</span></code></pre>
</div>

<h3>Özel Dizin Referansları</h3>
<table>
    <tr><th>Sembol</th><th>İngilizce</th><th>Anlamı</th></tr>
    <tr><td><code>.</code></td><td>Current directory</td><td>Şu anki dizin. Her dizin, kendi içinde <code>.</code> girdisine sahiptir.</td></tr>
    <tr><td><code>..</code></td><td>Parent directory</td><td>Üst dizin. Her dizin, üst dizine işaret eden <code>..</code> girdisine sahiptir.</td></tr>
    <tr><td><code>~</code></td><td>Home directory</td><td>Ev dizini (/home/kullanıcı)</td></tr>
    <tr><td><code>-</code></td><td>Previous directory</td><td>Önceki dizin (cd ile)</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 . ve .. Gerçek Dizin Girdileridir</div>
    <code>.</code> ve <code>..</code> sadece kısayol değil, dosya sisteminde gerçek <strong>dizin girdileridir</strong> (directory entries). <code>ls -a</code> çalıştırdığınızda ilk iki girdi her zaman <code>.</code> (mevcut dizin) ve <code>..</code> (üst dizin) olur. Kök dizinde (<code>/</code>) ise <code>..</code> yine <code>/</code>'nin kendisini gösterir — çünkü daha üst dizin yoktur.
</div>

<h2>tree — Dizin Ağacı</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">tree</span> = <span class="eng-meaning">Ağaç</span> — Dizin yapısını ağaç şeklinde görselleştirir. Varsayılan olarak yüklü olmayabilir: <code>sudo apt install tree</code>
    </div>
</div>

<div class="code-block">
    <div class="code-block-header">
        <span>tree komutu</span>
        <button class="try-btn" onclick="runInTerminal('tree -L 2')">Terminalde Dene</button>
    </div>
    <pre><code><span class="prompt">kullanici@linux:~$</span> <span class="command">tree</span> <span class="argument">-L 2</span>
<span class="comment"># -L 2: sadece 2 seviye derinliğe in (Level)</span>
<span class="comment"># Çok derin dizinlerde tree sonsuz çıktı verebilir!</span>

<span class="prompt">kullanici@linux:~$</span> <span class="command">tree</span> <span class="argument">-d</span>
<span class="comment"># -d: sadece dizinleri göster (directories only)</span></code></pre>
</div>

<h2>pushd & popd — Dizin Yığını</h2>
<p>İleri seviye bir teknik: dizin yığını (directory stack) ile birden fazla dizin arasında hızlıca geçiş yapabilirsiniz.</p>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">pushd</span> = <span class="eng-meaning">Push Directory</span> — Mevcut dizini yığına it ve hedef dizine git.<br>
        <span class="eng-word">popd</span> = <span class="eng-meaning">Pop Directory</span> — Yığından en üstteki dizini al ve oraya git.<br>
        <span class="eng-word">dirs</span> = <span class="eng-meaning">Directories</span> — Yığındaki dizinleri göster.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>pushd / popd kullanımı</span></div>
    <pre><code><span class="prompt">kullanici@linux:~$</span> <span class="command">pushd</span> <span class="path">/etc</span>
<span class="output">/etc ~</span>
<span class="prompt">kullanici@linux:/etc$</span> <span class="command">pushd</span> <span class="path">/var/log</span>
<span class="output">/var/log /etc ~</span>
<span class="prompt">kullanici@linux:/var/log$</span> <span class="command">popd</span>
<span class="output">/etc ~</span>
<span class="comment"># /etc'ye geri döndük!</span>
<span class="prompt">kullanici@linux:/etc$</span> <span class="command">popd</span>
<span class="output">~</span>
<span class="comment"># Eve döndük!</span></code></pre>
</div>
`,
    quiz: [
        {
            question: "'pwd' komutunun açılımı nedir?",
            options: ["Print Window Display", "Print Working Directory", "Path Working Directory", "Present Working Dir"],
            correct: 1,
            explanation: "pwd = Print Working Directory (Çalışma dizinini yazdır). Bulunduğunuz dizinin tam yolunu gösterir."
        },
        {
            question: "'/home/kullanici/Belgeler' ifadesi ne tür bir yoldur?",
            options: ["Göreceli yol (Relative path)", "Mutlak yol (Absolute path)", "Sembolik yol", "Kısa yol"],
            correct: 1,
            explanation: "/ ile başlayan yollar mutlak yoldur (absolute path). Kök dizinden itibaren tam adresi verir."
        },
        {
            question: "'cd ..' komutu ne yapar?",
            options: ["Ev dizinine gider", "Kök dizine gider", "Bir üst dizine gider", "Önceki dizine döner"],
            correct: 2,
            explanation: "'..' (parent directory) bir üst dizini temsil eder. 'cd ..' sizi bir üst dizine götürür."
        },
        {
            question: "Kullanıcı programları ve komutları hangi dizinde bulunur?",
            options: ["/etc", "/dev", "/usr/bin", "/tmp"],
            correct: 2,
            explanation: "/usr/bin (User Binaries) kullanıcı komutlarının bulunduğu dizindir. ls, grep, python3 gibi komutlar buradadır."
        },
        {
            question: "/dev/null ne işe yarar?",
            options: ["Boş dosya oluşturur", "İçine yazılan her şeyi yok eder", "Aygıtları listeler", "Sistem hatalarını kaydeder"],
            correct: 1,
            explanation: "/dev/null 'kara delik' dosyasıdır — içine yazılan her şey kaybolur. Gereksiz çıktıyı gizlemek için kullanılır."
        }
    ]
});
