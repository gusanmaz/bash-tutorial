// ===== Bölüm 6: Metin Editörleri =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 6,
    title: 'Metin Editörleri',
    subtitle: 'Text Editors',
    icon: '✏️',
    description: 'Terminal tabanlı metin editörleri: Vi/Vim, Nano ve Emacs. Her birinin güçlü ve zayıf yönleri.',
    content: `
<h2>Neden Terminal Editörü Bilmek Önemli?</h2>
<p>GUI dünyasında VS Code, Sublime Text gibi editörler varken neden terminal editörlerini öğrenelim? Çünkü <strong>bazı durumlarda terminal editörü tek seçeneğinizdir</strong>:</p>

<h3>🎯 Gerçek Hayat Senaryoları</h3>
<table>
    <tr><th>Senaryo</th><th>Neden Terminal Editörü?</th></tr>
    <tr><td><strong>SSH ile sunucuya bağlanma</strong></td><td>Uzaktaki bir sunucuda GUI yoktur. AWS, DigitalOcean, karşınızdaki sadece terminal. Nginx ayarını değiştirmeniz lazım — <code>nano /etc/nginx/nginx.conf</code></td></tr>
    <tr><td><strong>Docker konteyneri</strong></td><td>Minimal imajlarda GUI olmaz, bazen sadece <code>vi</code> bile zor bulunur. <code>apt install nano</code> yapıp devam edersiniz.</td></tr>
    <tr><td><strong>Git commit mesajı</strong></td><td>Git, <code>commit</code>, <code>rebase -i</code>, <code>merge</code> sırasında varsayılan editörü açar. Editör bilmezseniz "Vi'dan nasıl çıkılır?" paniği başlar!</td></tr>
    <tr><td><strong><code>crontab -e</code></strong></td><td>Zamanlanmış görevleri düzenlerken sistem terminal editörü açar.</td></tr>
    <tr><td><strong><code>visudo</code></strong></td><td>Sudo yetkilerini düzenlemek için terminal editörü şart — syntax kontrolü yapar.</td></tr>
    <tr><td><strong>Bozulmuş sistem kurtarma</strong></td><td>GUI çökünce recovery mode'da sadece terminal. <code>/etc/fstab</code> yanlış mı? Terminal editörüyle düzeltin.</td></tr>
    <tr><td><strong>Hızlı bir satır düzenleme</strong></td><td>Bir yapılandırma dosyasında tek satır değiştirmek için VS Code açmak aşırıya kaçar. <code>nano config.yml</code> → düzenle → kaydet → bitti.</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Öğrenme Stratejisi</div>
    <strong>Minimum bilmeniz gereken:</strong> En az bir basit editörü (<code>nano</code>) rahatça kullanabilmek ve <code>vi</code>'da temel düzenleme + çıkış yapabilmek. Bu iki beceri sizi <strong>her durumda</strong> kurtarır.<br><br>
    İleri seviye için vim veya emacs birini derinlemesine öğrenin — kod editörü olarak kullanabilirsiniz.
</div>

<h2>Terminal Editörlerinin Tarihi</h2>
<p>Terminal editörleri bilgisayar tarihiyle birlikte evrilmiştir. Bu tarihi bilmek, neden bu kadar farklı editör olduğunu anlamanızı sağlar:</p>

<table>
    <tr><th>Yıl</th><th>Editör</th><th>Açıklama</th></tr>
    <tr><td><strong>1969</strong></td><td><code>ed</code></td><td>Unix'in ilk editörü. Ken Thompson yazdı. <strong>Satır editörü</strong> — ekran görmezsiniz, satır numarasıyla çalışırsınız. Bugün bile <code>sed</code>'in atası olarak yaşıyor.</td></tr>
    <tr><td><strong>1976</strong></td><td><code>ex</code> → <code>vi</code></td><td>Bill Joy, <code>ed</code>'e görsel arayüz ekledi. Artık dosyayı ekranda görebiliyordunuz! Adını "VIsual" kelimesinden alır.</td></tr>
    <tr><td><strong>1976</strong></td><td><code>Emacs</code></td><td>Richard Stallman Emacs'ı yazdı. Vi'nin rakibi. Modeless (modsuz), Lisp ile genişletilebilir. "Editor war" başladı.</td></tr>
    <tr><td><strong>1989</strong></td><td><code>pico</code></td><td>Pine e-posta istemcisinin editörü. Basit, kısayollar ekranda. Nano'nun atası.</td></tr>
    <tr><td><strong>1991</strong></td><td><code>Vim</code></td><td>Bram Moolenaar, Vi'yi geliştirdi: syntax highlighting, eklentiler, çoklu undo. "Vi IMproved".</td></tr>
    <tr><td><strong>1999</strong></td><td><code>nano</code></td><td>Pico'nun özgür yazılım karşılığı olarak doğdu. Basitlik felsefesiyle en yaygın başlangıç editörü.</td></tr>
    <tr><td><strong>2015</strong></td><td><code>Neovim</code></td><td>Vim'in modern fork'u. Lua yapılandırması, asenkron eklentiler, yerleşik LSP desteği.</td></tr>
    <tr><td><strong>2016</strong></td><td><code>micro</code></td><td>Modern, sezgisel terminal editörü. Ctrl+S, Ctrl+C, Ctrl+V — bildiğiniz kısayollar!</td></tr>
    <tr><td><strong>2021</strong></td><td><code>Helix</code></td><td>Rust ile yazılmış, yerleşik LSP ve TreeSitter, sıfır yapılandırma. "Post-modern" editör.</td></tr>
</table>

<h2>Basit Editörler — Hızlı Başlangıç</h2>
<p>Bu editörler <strong>öğrenme eğrisi düşük</strong>, hızlı düzenlemeye odaklıdır. Karmaşık mod sistemi yoktur — açarsınız, yazarsınız, kaydedersiniz.</p>

<h3>📗 nano — En Yaygın Başlangıç Editörü</h3>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">GNU nano</span> = <span class="eng-meaning">Nano's ANOther editor</span> — Basit ve kullanıcı dostu terminal editörü. "pico" editörünün serbest yazılım karşılığıdır.
    </div>
</div>

<p>Nano, terminal editörleri arasında en kolay öğrenilenidir. Ekranın alt kısmında kısayollar gösterilir.</p>

<div class="code-block">
    <div class="code-block-header"><span>Nano ile dosya açma</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">nano</span> <span class="path">dosya.txt</span>    <span class="comment"># Mevcut dosyayı aç veya yeni oluştur</span>
<span class="prompt">$</span> <span class="command">nano</span> <span class="argument">+15</span> <span class="path">dosya.txt</span> <span class="comment"># 15. satırda aç</span></code></pre>
</div>

<h3>Nano Kısayolları</h3>
<p><code>^</code> = Ctrl tuşu, <code>M-</code> = Alt tuşu</p>
<table>
    <tr><th>Kısayol</th><th>İşlev</th><th>Açıklama</th></tr>
    <tr><td><code>Ctrl+O</code></td><td>Write Out</td><td>Kaydet (dosya adı sorar)</td></tr>
    <tr><td><code>Ctrl+X</code></td><td>Exit</td><td>Çık (kaydedilmemişse sorar)</td></tr>
    <tr><td><code>Ctrl+K</code></td><td>Cut</td><td>Satırı kes</td></tr>
    <tr><td><code>Ctrl+U</code></td><td>Uncut/Paste</td><td>Yapıştır</td></tr>
    <tr><td><code>Ctrl+W</code></td><td>Where Is</td><td>Ara (search)</td></tr>
    <tr><td><code>Ctrl+\\</code></td><td>Replace</td><td>Bul ve değiştir</td></tr>
    <tr><td><code>Ctrl+G</code></td><td>Get Help</td><td>Yardım</td></tr>
    <tr><td><code>Alt+U</code></td><td>Undo</td><td>Geri al</td></tr>
    <tr><td><code>Alt+E</code></td><td>Redo</td><td>Yinele</td></tr>
    <tr><td><code>Ctrl+_</code></td><td>Go to line</td><td>Satıra git</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Nano ne zaman kullanılmalı?</div>
    <strong>Hızlı küçük düzenlemeler</strong> için idealdir: yapılandırma dosyasında bir satır değiştirmek, Git commit mesajı yazmak. Öğrenme eğrisi neredeyse sıfırdır. Başlangıçta nano kullanın, sonra Vi/Emacs öğrenin.
</div>

<h3>📦 micro — Modern nano Alternatifi</h3>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">micro</span> = Modern terminal editörü. Go dilinde yazılmış, 2016'dan beri geliştirilmektedir. Sloganı: <em>"A modern and intuitive terminal-based text editor"</em>.
    </div>
</div>

<p><code>micro</code>, <strong>bildiğiniz kısayolları kullanan</strong> modern bir terminal editörüdür. GUI editör alışkanlığınız varsa micro size çok tanıdık gelecektir:</p>

<div class="code-block">
    <div class="code-block-header"><span>micro kullanımı</span></div>
    <pre><code><span class="comment"># Kurulum (tek komut):</span>
<span class="prompt">$</span> <span class="command">curl</span> https://getmic.ro | bash

<span class="comment"># Dosya açma:</span>
<span class="prompt">$</span> <span class="command">micro</span> <span class="path">dosya.txt</span></code></pre>
</div>

<table>
    <tr><th>micro Kısayolu</th><th>İşlev</th><th>Tanıdık mı?</th></tr>
    <tr><td><code>Ctrl+S</code></td><td>Kaydet</td><td>✅ Tıpkı VS Code, Word, her yer!</td></tr>
    <tr><td><code>Ctrl+Q</code></td><td>Çık</td><td>✅ Standart çıkış</td></tr>
    <tr><td><code>Ctrl+C</code> / <code>Ctrl+V</code></td><td>Kopyala / Yapıştır</td><td>✅ Bildiğiniz gibi!</td></tr>
    <tr><td><code>Ctrl+Z</code></td><td>Geri al</td><td>✅ Standart undo</td></tr>
    <tr><td><code>Ctrl+F</code></td><td>Bul</td><td>✅ Standart arama</td></tr>
    <tr><td><code>Ctrl+E</code></td><td>Komut satırı</td><td>micro komutları çalıştırır</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 micro ne zaman kullanılmalı?</div>
    Nano bile size karmaşık geliyorsa veya <strong>GUI alışkanlıklarınızı terminal'e taşımak</strong> istiyorsanız micro en iyi seçenek. Syntax highlighting, fare desteği, eklenti sistemi ve çoklu imleç (multi-cursor) gibi modern özellikleri var. Tek dezavantaj: varsayılan olarak kurulu gelmez, kendiniz yüklemelisiniz.
</div>

<h3>📜 Diğer Terminal Editörleri</h3>
<p>Yaygın olmasa da bazı editörler hâlâ kullanılır veya tarihsel öneme sahiptir:</p>

<table>
    <tr><th>Editör</th><th>Yıl</th><th>Özellik</th><th>Nerede karşılaşırsınız?</th></tr>
    <tr><td><code>ed</code></td><td>1969</td><td><strong>Satır editörü</strong> — ekranı yenilemez! Satır numarası yazarak çalışırsınız. Ken Thompson yazdı. <code>sed</code>'in ve <code>vi</code>'nin atası.</td><td>Minimal kurtarma ortamları. Tarihi merak edenler.</td></tr>
    <tr><td><code>pico</code></td><td>1989</td><td>Pine e-posta istemcisinin editörü. Nano'nun doğrudan atası. Alt kısımda kısayollar gösterir.</td><td>Eski Unix sistemleri. (Nano pico'nun yerini aldı)</td></tr>
    <tr><td><code>joe</code></td><td>1988</td><td><strong>JOE's Own Editor.</strong> WordStar kısayolları. <code>Ctrl+K H</code> yardım. Birden fazla mod destekler (joe, jmacs, jpico, jstar).</td><td>Bazı Linux dağıtımlarında kurulu gelir.</td></tr>
    <tr><td><code>mcedit</code></td><td>1994</td><td>Midnight Commander dosya yöneticisinin yerleşik editörü. Menü tabanlı, F tuşlarıyla (F2=Kaydet, F10=Çık).</td><td><code>mc</code> (Midnight Commander) kuruluysa zaten vardır.</td></tr>
    <tr><td><code>ne</code></td><td>1993</td><td><strong>Nice Editor.</strong> Menü tabanlı, terminfo iyi kullanır. Vim kadar güçlü ama daha kolay öğrenilir.</td><td>Niş ama kaliteli, bazı minimalist kullanıcılar tercih eder.</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 ed — Tüm Editörlerin Atası</div>
    <code>ed</code> bugün neredeyse hiç doğrudan kullanılmaz ama <strong>ed'in DNA'sı her yerdedir</strong>: <code>sed</code> (stream editor) ed'in komut söz dizimini kullanır. <code>vi</code> ed'in görsel hali olarak doğdu. <code>grep</code> aslında ed komutu <code>g/re/p</code>'den gelir (global/regular-expression/print). Yani ed'i bilmek, Linux'un temellerini anlamak demek.
</div>

<h2>Güçlü Editörler — Vi/Vim ve Emacs</h2>
<p>Aşağıdaki iki editör <strong>öğrenme eğrisi yüksek</strong> ama ustalaşınca inanılmaz verimli olursunuz. Bir "editor war" bile başlattılar!</p>

<h2>📘 Vi / Vim — Güç ve Hız</h2>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">Vi</span> = <span class="eng-meaning">Visual</span> — "Görsel" editör. 1976'da Bill Joy tarafından yazıldı.<br>
        <span class="eng-word">Vim</span> = <span class="eng-meaning">Vi IMproved</span> — "Geliştirilmiş Vi". Vi'nin çok daha güçlü modern versiyonu. 1991'den beri geliştirilmektedir.
    </div>
</div>

<p>Vi/Vim neredeyse <strong>her Linux/Unix sisteminde</strong> bulunur. Genellikle sunucularda varsayılan editördür. Öğrenmesi zor ama ustalaştığınızda <strong>inanılmaz hızlı</strong> çalışırsınız.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 vimtutor — Vim Öğrenmenin En İyi Yolu</div>
    Terminalde <code>vimtutor</code> yazarak Vim'in resmi interaktif eğitimini başlatabilirsiniz. ~30 dakikalık bu eğitim, tüm temel komutları <strong>pratik yaparak</strong> öğretir. Vim öğrenmek istiyorsanız buradan başlayın!<br>
    <code>$ vimtutor</code> — İngilizce<br>
    <code>$ vimtutor tr</code> — Türkçe (varsa)
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Neovim (nvim)</div>
    <strong>Neovim</strong>, Vim'in modern bir çatallamasıdır (fork). Lua ile yapılandırma, daha iyi eklenti ekosistemi ve LSP (Language Server Protocol) desteği sunar. Komut satırında <code>nvim</code> ile çalıştırılır. Vim bilgisi Neovim'e doğrudan aktarılabilir — aynı tuş kombinasyonları ve modlar geçerlidir.
</div>

<h3>Vi'nin Modları — En Önemli Kavram</h3>
<p>Vi diğer editörlerden farklıdır çünkü <strong>modlar</strong> (modes) kullanır. Vi'yi açtığınızda <strong>Normal mod</strong>dasınız — yazdığınız harfler metin değil, <strong>komut</strong>tur!</p>

<table>
    <tr><th>Mod</th><th>İngilizce</th><th>Ne yapılır?</th><th>Geçiş</th></tr>
    <tr><td><strong>Normal Mod</strong></td><td>Normal Mode</td><td>Navigasyon, silme, kopyalama</td><td>Vi açılınca varsayılan. <code>Esc</code> ile dönülür.</td></tr>
    <tr><td><strong>Ekleme Modu</strong></td><td>Insert Mode</td><td>Metin yazma</td><td><code>i</code>, <code>a</code>, <code>o</code> tuşları</td></tr>
    <tr><td><strong>Komut Modu</strong></td><td>Command Mode</td><td>Kaydetme, çıkma, arama</td><td><code>:</code> tuşu ile girilir</td></tr>
    <tr><td><strong>Görsel Mod</strong></td><td>Visual Mode</td><td>Metin seçme</td><td><code>v</code> (karakter), <code>V</code> (satır), <code>Ctrl+v</code> (blok)</td></tr>
</table>

<h3>Ekleme Moduna Giriş Yolları</h3>
<table>
    <tr><th>Tuş</th><th>İngilizce</th><th>Açıklama</th></tr>
    <tr><td><code>i</code></td><td>Insert</td><td>İmlecin <strong>önüne</strong> ekle</td></tr>
    <tr><td><code>I</code></td><td>Insert at beginning</td><td>Satır <strong>başına</strong> ekle</td></tr>
    <tr><td><code>a</code></td><td>Append</td><td>İmlecin <strong>arkasına</strong> ekle</td></tr>
    <tr><td><code>A</code></td><td>Append at end</td><td>Satır <strong>sonuna</strong> ekle</td></tr>
    <tr><td><code>o</code></td><td>Open below</td><td>Aşağıya yeni satır aç</td></tr>
    <tr><td><code>O</code></td><td>Open above</td><td>Yukarıya yeni satır aç</td></tr>
</table>

<h3>Temel Vi/Vim Komutları</h3>
<table>
    <tr><th>Komut</th><th>İngilizce</th><th>Açıklama</th></tr>
    <tr><td><code>:w</code></td><td>Write</td><td>Kaydet</td></tr>
    <tr><td><code>:q</code></td><td>Quit</td><td>Çık</td></tr>
    <tr><td><code>:wq</code></td><td>Write+Quit</td><td>Kaydet ve çık</td></tr>
    <tr><td><code>:q!</code></td><td>Quit force</td><td>Kaydetmeden çık</td></tr>
    <tr><td><code>dd</code></td><td>Delete line</td><td>Satırı sil</td></tr>
    <tr><td><code>5dd</code></td><td></td><td>5 satır sil</td></tr>
    <tr><td><code>yy</code></td><td>Yank</td><td>Satırı kopyala</td></tr>
    <tr><td><code>p</code></td><td>Put/Paste</td><td>Yapıştır (aşağıya)</td></tr>
    <tr><td><code>P</code></td><td>Put above</td><td>Yapıştır (yukarıya)</td></tr>
    <tr><td><code>u</code></td><td>Undo</td><td>Geri al</td></tr>
    <tr><td><code>Ctrl+r</code></td><td>Redo</td><td>Yinele</td></tr>
    <tr><td><code>/kelime</code></td><td>Search forward</td><td>İleri ara</td></tr>
    <tr><td><code>?kelime</code></td><td>Search backward</td><td>Geri ara</td></tr>
    <tr><td><code>n / N</code></td><td>Next / Previous</td><td>Sonraki/önceki sonuç</td></tr>
    <tr><td><code>:%s/eski/yeni/g</code></td><td>Substitute</td><td>Tüm dosyada bul-değiştir</td></tr>
    <tr><td><code>.</code></td><td>Repeat</td><td>Son komutu tekrarla (çok güçlü!)</td></tr>
</table>

<h3>Navigasyon (Normal Mod)</h3>
<table>
    <tr><th>Tuş</th><th>Hareket</th></tr>
    <tr><td><code>h j k l</code></td><td>Sol, Aşağı, Yukarı, Sağ</td></tr>
    <tr><td><code>w / b</code></td><td>Kelime ileri / kelime geri (Word / Back)</td></tr>
    <tr><td><code>0 / $</code></td><td>Satır başı / satır sonu</td></tr>
    <tr><td><code>gg / G</code></td><td>Dosya başı / dosya sonu</td></tr>
    <tr><td><code>42G</code> veya <code>:42</code></td><td>42. satıra git</td></tr>
    <tr><td><code>Ctrl+d / Ctrl+u</code></td><td>Yarım sayfa aşağı / yukarı</td></tr>
    <tr><td><code>%</code></td><td>Eşleşen paranteze git</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Vi'den Çıkamıyorsanız...</div>
    Bu o kadar yaygın bir sorundur ki "How to exit Vim?" Stack Overflow'da en çok görüntülenen sorulardan biridir! (1 milyondan fazla kez görüntülenmiş) 😄<br><br>
    <strong>Çözüm:</strong> <code>Esc</code> → <code>:q!</code> → <code>Enter</code><br>
    Her zaman önce <code>Esc</code>'e basarak Normal moda dönün.
</div>

<h3>🚀 İlk 5 Dakikada Vi: Adım Adım Rehber</h3>
<p>Vi'ye ilk kez giriyorsanız, tam olarak ne yapmanız gerektiği:</p>

<div class="code-block">
    <div class="code-block-header"><span>Vi ile dosya düzenleme — adım adım</span></div>
    <pre><code><span class="comment"># 1. Dosyayı aç</span>
<span class="prompt">$</span> <span class="command">vi</span> <span class="path">dosya.txt</span>

<span class="comment"># 2. Şu an NORMAL moddayınız. Yazdığınız her tuş bir KOMUT'tur!</span>
<span class="comment">#    Metin yazmak için INSERT moduna geçin:</span>
<span class="comment">#    → i tuşuna basın</span>
<span class="comment">#    Alt köşede -- INSERT -- yazısı görünür</span>

<span class="comment"># 3. Artık metin yazabilirsiniz. Yazınızı yazın.</span>

<span class="comment"># 4. Yazmayı bitirdiniz. NORMAL moda dönün:</span>
<span class="comment">#    → Esc tuşuna basın</span>
<span class="comment">#    -- INSERT -- yazısı kaybolur</span>

<span class="comment"># 5. Kaydet ve çık:</span>
<span class="comment">#    → :wq yazın ve Enter'a basın</span>

<span class="comment"># ÖZET: vi dosya.txt → i → [metin yaz] → Esc → :wq → Enter</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Vi'da Paniklemeyiin!</div>
    Bir şeyler ters gittiyse, her zaman şu sırayı deneyin:<br>
    1. <code>Esc</code> — Normal moda dön<br>
    2. <code>Esc</code> — Emin olmak için bir kez daha bas<br>
    3. <code>u</code> — Geri al (undo)<br>
    4. <code>:q!</code> — Kaydetmeden çık (herşeyi geri al ve kaçış!)
</div>

<h2>📙 Emacs — Her Şeyde Bir Editör</h2>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terim</div>
    <div class="eng-content">
        <span class="eng-word">Emacs</span> = <span class="eng-meaning">Editing MACroS</span> — "Düzenleme Makroları". GNU projesi kurucusu Richard Stallman tarafından geliştirilmiş, son derece genişletilebilir editör. Aslında bir "işletim sistemi gibi çalışan editör" denilebilir.
    </div>
</div>

<p>Emacs, Vi'nin ezeli rakibidir (bu rekabet "editor war" olarak bilinir!). Emacs modlu değildir — her zaman metin yazabilirsiniz, komutlar ise Ctrl ve Alt kombinasyonlarıyla verilir.</p>

<h3>Emacs Temel Kısayolları</h3>
<p><code>C-</code> = Ctrl tuşu, <code>M-</code> = Alt (Meta) tuşu</p>
<table>
    <tr><th>Kısayol</th><th>İşlev</th><th>Açıklama</th></tr>
    <tr><td><code>C-x C-f</code></td><td>Find file</td><td>Dosya aç</td></tr>
    <tr><td><code>C-x C-s</code></td><td>Save</td><td>Kaydet</td></tr>
    <tr><td><code>C-x C-c</code></td><td>Close</td><td>Emacs'tan çık</td></tr>
    <tr><td><code>C-k</code></td><td>Kill line</td><td>Satırı kes</td></tr>
    <tr><td><code>C-y</code></td><td>Yank</td><td>Yapıştır</td></tr>
    <tr><td><code>C-space</code></td><td>Set mark</td><td>Seçim başlat</td></tr>
    <tr><td><code>C-w</code></td><td>Cut (kill region)</td><td>Seçili alanı kes</td></tr>
    <tr><td><code>C-s</code></td><td>Search forward</td><td>İleri ara</td></tr>
    <tr><td><code>C-r</code></td><td>Search reverse</td><td>Geri ara</td></tr>
    <tr><td><code>C-/</code> veya <code>C-_</code></td><td>Undo</td><td>Geri al</td></tr>
    <tr><td><code>C-g</code></td><td>Quit command</td><td>Komutu iptal et</td></tr>
    <tr><td><code>M-x</code></td><td>Execute command</td><td>Komut çalıştır (herhangi bir Emacs komutu)</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Emacs'ın "Her Şeycilik" Yönü</div>
    Emacs sadece bir editör değildir! Emacs içinde e-posta okuyabilir, web gezebilir, oyun oynayabilir, hatta Tetris oynayabilirsiniz: <code>M-x tetris</code>. "Emacs bir işletim sistemidir, sadece iyi bir editörden yoksundur" şakası bundandır. (Vi kullanıcıları bunu söyler 😄)
</div>

<h2>Karşılaştırma: Nano vs Vi vs Emacs</h2>
<table>
    <tr><th>Özellik</th><th>Nano</th><th>Vi/Vim</th><th>Emacs</th></tr>
    <tr><td>Öğrenme zorluğu</td><td>⭐ Çok kolay</td><td>⭐⭐⭐⭐ Zor</td><td>⭐⭐⭐ Orta-Zor</td></tr>
    <tr><td>Ustalaşınca hız</td><td>Normal</td><td>Çok hızlı</td><td>Hızlı</td></tr>
    <tr><td>Her sistemde var mı?</td><td>Çoğunda</td><td>Her yerde</td><td>Kurulmalı</td></tr>
    <tr><td>Genişletilebilirlik</td><td>Düşük</td><td>Yüksek (Vimscript/Lua)</td><td>Çok yüksek (Emacs Lisp)</td></tr>
    <tr><td>Mod sistemi</td><td>Hayır</td><td>Evet (Normal/Insert/Visual)</td><td>Hayır</td></tr>
    <tr><td>Hedef kitle</td><td>Başlangıç / hızlı düzenleme</td><td>Geliştiriciler / sysadmin</td><td>Power users / Lisp severler</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Hangisini Öğrenmeliyim?</div>
    <ol>
        <li><strong>Başlangıçta:</strong> <code>nano</code> — Basit düzenlemeler için yeterli.</li>
        <li><strong>Kesinlikle öğrenin:</strong> <code>vi</code> temel komutları — Her sunucuda bulunur, bazen tek seçenektir!</li>
        <li><strong>İstediğiniz birini derinlemesine öğrenin:</strong> vim veya emacs — Birini seçip uzmanlaşın. Kod editörü olarak kullanın.</li>
    </ol>
    Modern geliştiricilerin çoğu günlük işlerde <strong>VS Code</strong> veya benzeri GUI editörleri kullanır ve gerektiğinde terminalde <strong>vim</strong> veya <strong>nano</strong>'ya geçer.
</div>

<h2>🆕 Modern Terminal Editörleri</h2>
<p>2020'lerin yeni nesil editörleri, Vim'in güçlü fikirlerini alıp <strong>daha az yapılandırma</strong> ve <strong>yerleşik modern özelliklerle</strong> sunmayı hedefliyor:</p>

<table>
    <tr><th>Editör</th><th>Dil</th><th>Filozofi</th><th>Öne çıkan özellik</th></tr>
    <tr><td><strong><a href="https://helix-editor.com" target="_blank" rel="noopener">Helix</a></strong></td><td>Rust</td><td><strong>"Önce seç, sonra işle"</strong> — Vim'de <code>d3w</code> (sil 3 kelime) yazarsınız ama neyi sileceğinizi görmezsiniz. Helix'te önce seçim yapılır, ne olacağını görürsünüz, sonra eylemi uygularsınız.</td><td>Yerleşik LSP, TreeSitter syntax, <strong>sıfır yapılandırma</strong>. Kurun, açın, çalışsın.</td></tr>
    <tr><td><strong><a href="https://kakoune.org" target="_blank" rel="noopener">Kakoune</a></strong></td><td>C++</td><td>Helix'e ilham veren editör. Aynı "seç → işle" mantığı. Vim'den daha tutarlı bir komut dili.</td><td>Çoklu seçim (multi-cursor) birinci sınıf vatandaş. Unix felsefesine sadık.</td></tr>
    <tr><td><strong><a href="https://zed.dev" target="_blank" rel="noopener">Zed</a></strong></td><td>Rust</td><td>GPU hızlandırmalı, kollaboratif. Hem GUI hem (yakında) terminal modu.</td><td>VS Code alternatifi ama C yerine Rust, Electron yerine native GPU rendering.</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Yeni Başlayan İçin Yol Haritası</div>
    <ol>
        <li><strong>1. Hafta:</strong> <code>nano</code> ile rahat olun. Dosya aç → düzenle → kaydet → kapat.</li>
        <li><strong>2. Hafta:</strong> <code>vi</code> / <code>vim</code> temellerini öğrenin. En az: açma, ekleme modu, kaydetme, çıkma. <code>vimtutor</code> çalışın.</li>
        <li><strong>Sonra:</strong> Kendinize uygun birini seçin — vim, emacs, helix, micro — ve derinleşin.</li>
        <li><strong>Bonus:</strong> Ana editörünüz VS Code olsa bile, <strong>Vim eklentisi</strong> (vscodevim) kurarak Vim kısayollarını GUI içinde kullanabilirsiniz!</li>
    </ol>
</div>

<h2>⚔️ Editor War — Tarihin En Uzun Tartışması</h2>
<p>Vi vs Emacs tartışması 1980'lerden beri sürer ve hacker kültürünün en eğlenceli geleneklerinden biridir. İki kamp birbirini karikatürize eder:</p>

<table>
    <tr><th></th><th>Vi/Vim Kampı Der Ki</th><th>Emacs Kampı Der Ki</th></tr>
    <tr><td><strong>Karşı taraf hakkında</strong></td><td>"Emacs güzel bir işletim sistemi, sadece iyi bir editörden yoksun."</td><td>"Vi'ın iki modu var: bip sesi çıkaran mod ve <em>her şeyi silen</em> mod."</td></tr>
    <tr><td><strong>Kendi avantajı</strong></td><td>"Her sunucuda varım. SSH ile bağlan, hemen çalış."</td><td>"Ben bir editör değilim, bir yaşam biçimiyim. E-posta, IRC, dosya yöneticisi, hepsi bende."</td></tr>
    <tr><td><strong>Serçe parmak</strong></td><td>"Emacs kullanıcılarına 'Emacs pinky' diyorlar çünkü sürekli Ctrl basılıyor 😄"</td><td>"Vim kullanıcıları Esc tuşuna o kadar basıyor ki tuş aşınıyor."</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Gerçekte?</div>
    Günümüzde çoğu geliştirici <strong>VS Code</strong> kullanır ve "editor war" artık nostaljik bir şaka. Ama Vim ve Emacs hâlâ aktif olarak geliştirilmektedir ve sadık kullanıcı kitleleri vardır. İkisini de denemek, hangisinin <em>sizin</em> beyin yapınıza uyduğunu keşfetmenin tek yoludur.
</div>

<h2>Varsayılan Editörü Değiştirme</h2>
<div class="code-block">
    <div class="code-block-header"><span>Varsayılan editörü ayarlama</span></div>
    <pre><code><span class="comment"># Git commit editörünü nano yapma:</span>
<span class="prompt">$</span> <span class="command">git config --global</span> core.editor <span class="string">"nano"</span>

<span class="comment"># Sistem genelinde varsayılan editörü değiştirme:</span>
<span class="prompt">$</span> <span class="command">export</span> EDITOR=nano     <span class="comment"># Geçici</span>

<span class="comment"># Kalıcı olması için ~/.bashrc'ye ekleyin:</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">'export EDITOR=nano'</span> >> ~/.bashrc

<span class="comment"># Debian/Ubuntu'da sistem çapında editör seçimi (interaktif menü):</span>
<span class="prompt">$</span> <span class="command">sudo</span> update-alternatives --config editor

<span class="comment"># VISUAL vs EDITOR ortam değişkenleri:</span>
<span class="comment"># VISUAL = tam ekran editör (vim, nano), EDITOR = satır editörü (ed) fallback</span>
<span class="comment"># Çoğu program önce VISUAL'a, bulamazsa EDITOR'a bakar.</span>
<span class="prompt">$</span> <span class="command">export</span> VISUAL=vim
<span class="prompt">$</span> <span class="command">export</span> EDITOR=vim</code></pre>
</div>
`,
    quiz: [
        {
            question: "Vi'da metin yazmaya başlamak için hangi tuşa basılır?",
            options: ["w", "e", "i", "t"],
            correct: 2,
            explanation: "'i' tuşu Insert (Ekleme) moduna geçirir. Bu modda metin yazabilirsiniz."
        },
        {
            question: "Nano'da dosyayı kaydetmek için hangi kısayol kullanılır?",
            options: ["Ctrl+S", "Ctrl+O", "Ctrl+W", ":w"],
            correct: 1,
            explanation: "Nano'da Ctrl+O (Write Out) dosyayı kaydeder. Ctrl+S değil!"
        },
        {
            question: "Vi'da dosyayı kaydedip çıkmak için hangi komut kullanılır?",
            options: [":q!", ":wq", "Ctrl+X", ":save"],
            correct: 1,
            explanation: ":wq = write (kaydet) + quit (çık). Dosyayı kaydeder ve Vi'den çıkar."
        },
        {
            question: "Emacs'tan çıkmak için hangi kısayol kullanılır?",
            options: [":q!", "Ctrl+X Ctrl+C", "Ctrl+Q", "Alt+F4"],
            correct: 1,
            explanation: "Emacs'ta C-x C-c (Ctrl+X, ardından Ctrl+C) editörden çıkar."
        },
        {
            question: "Hangi editör neredeyse her Linux/Unix sisteminde varsayılan olarak bulunur?",
            options: ["Nano", "Emacs", "Vi/Vim", "VS Code"],
            correct: 2,
            explanation: "Vi (veya Vim) neredeyse her Linux/Unix sisteminde bulunur. Minimal sunucularda bile mevcuttur."
        },
        {
            question: "Vim'i interaktif olarak öğrenmek için terminalde hangi komut çalıştırılır?",
            options: ["vim --help", "vimtutor", "man vim", "vim --learn"],
            correct: 1,
            explanation: "vimtutor komutu ~30 dakikalık interaktif bir eğitim başlatır. Vim öğrenmenin en iyi yoludur."
        },
        {
            question: "GUI alışkanlıklarını (Ctrl+S, Ctrl+C, Ctrl+V) terminal'de kullanmak isteyen biri hangi editörü tercih etmeli?",
            options: ["vi", "emacs", "ed", "micro"],
            correct: 3,
            explanation: "micro editörü Ctrl+S (kaydet), Ctrl+C/Ctrl+V (kopyala/yapıştır), Ctrl+Z (geri al) gibi bilindik GUI kısayollarını terminal'de kullanmanızı sağlar."
        },
        {
            question: "Unix'in ilk metin editörü hangisidir ve hangi yılda yazılmıştır?",
            options: ["vi (1976)", "ed (1969)", "nano (1999)", "emacs (1976)"],
            correct: 1,
            explanation: "ed, Ken Thompson tarafından 1969'da yazılmıştır. Bir satır editörüdür — ekranı yenilemez, satır numarasıyla çalışırsınız. vi, sed ve grep'in atasıdır."
        },
        {
            question: "SSH ile uzak sunucuya bağlandığınızda bir yapılandırma dosyasını düzenlemeniz gerekiyor. Neden terminal editörü bilmek zorunludur?",
            options: ["GUI editörler daha yavaştır", "SSH bağlantısında GUI yoktur", "Terminal editörleri dosya izinlerini otomatik ayarlar", "Sunucularda dosya sistemi farklıdır"],
            correct: 1,
            explanation: "SSH bağlantısı sadece metin tabanlı terminal erişimi sağlar. GUI (grafik arayüz) yoktur, bu yüzden VI, nano gibi terminal editörlerini bilmeniz gerekir."
        }
    ]
});
