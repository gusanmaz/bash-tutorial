// ===== Bölüm 22: Hata Ayıklama Araçları ve IDE Mimarisi =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 22,
    title: 'Hata Ayıklama ve IDE Mimarisi',
    subtitle: 'Debugging Tools & How IDEs Work',
    icon: '🔬',
    description: 'Hata ayıklama nedir, programlar bellekte nasıl yaşar, call stack nedir? GDB, strace, ltrace, valgrind araçları ve IDE\'lerin bu araçlardan nasıl inşa edildiği.',
    content: `
<h2>Bug Nedir? Hata Ayıklama Neden Gereklidir?</h2>
<p>Bir yazılımda <strong>"bug"</strong> (böcek/hata), programın beklediğimiz gibi davranmamasına neden olan her şeydir. Bir buton tıklandığında uygulama çöküyorsa, yanlış sonuç hesaplanıyorsa veya program donuyorsa — bunların hepsi bug'dır.</p>

<div class="info-box note">
    <div class="info-box-title">📌 "Bug" Kelimesinin Kökeni</div>
    1947'de Harvard Üniversitesi'nde Grace Hopper ve ekibi, Mark II bilgisayarında bir arızanın sebebini ararken <strong>gerçek bir güve (moth)</strong> bulmuşlardı — böcek bilgisayarın rölelerine sıkışmıştı. Bunu günlüğe "First actual case of bug being found" diye yazdılar. O günden beri yazılım hatalarına <em>"bug"</em>, hata ayıklama sürecine ise <em>"debugging"</em> (böcek ayıklama) deniyor.
</div>

<p><strong>Debugging (hata ayıklama)</strong>, bir programdaki hatayı bulmak ve düzeltmek sürecidir. Bu süreç aslında <strong>bilimsel yöntem</strong>e çok benzer: gözlem yap, hipotez kur, test et, sonuca var.</p>

<img src="img/debugging_process.svg" alt="Hata Ayıklama Süreci Diyagramı" style="width: 100%; max-width: 800px; margin: 1.5rem auto; display: block; border-radius: 8px;">

<p>Debugging yaparken izlenmesi gereken adımlar:</p>
<ol>
    <li><strong>Hatayı gözlemle:</strong> "Program ne yapıyor? Ne yapması gerekiyordu?"</li>
    <li><strong>Yeniden üret:</strong> Hatayı tutarlı biçimde tekrarlayabilmelisiniz. Tekrarlanamayan hatalar en zor hatalardır.</li>
    <li><strong>Hipotez kur:</strong> "Belki bu değişken NULL geliyor?", "Belki döngü bir fazla çalışıyor?" gibi tahminlerde bulunun.</li>
    <li><strong>Test et:</strong> Hipotezinizi araçlarla (GDB, print, strace) doğrulayın veya çürütün.</li>
    <li><strong>Düzelt:</strong> Kök nedeni bulun ve düzeltin. Sadece semptomu değil, asıl sorunu çözün.</li>
</ol>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">Bug</span> = <span class="eng-meaning">Hata / Böcek</span> — Programdaki beklenmeyen davranış.<br>
        <span class="eng-word">Debugging</span> = <span class="eng-meaning">Hata Ayıklama</span> — Bug'ı bulma ve düzeltme süreci.<br>
        <span class="eng-word">Debugger</span> = <span class="eng-meaning">Hata Ayıklayıcı</span> — Programı adım adım çalıştırıp değişkenleri inceleme aracı.<br>
        <span class="eng-word">Breakpoint</span> = <span class="eng-meaning">Durma Noktası</span> — Programın duracağı satır. "Buraya gelince dur, bakmak istiyorum."<br>
        <span class="eng-word">Stack</span> = <span class="eng-meaning">Yığın</span> — Tabak istifi gibi LIFO (son giren, ilk çıkar) veri yapısı.<br>
        <span class="eng-word">Call Stack</span> = <span class="eng-meaning">Çağrı Yığını</span> — Hangi fonksiyonun hangi fonksiyonu çağırdığının kaydı.<br>
        <span class="eng-word">Stack Frame</span> = <span class="eng-meaning">Yığın Çerçevesi</span> — Bir fonksiyonun yerel değişkenleri ve dönüş adresi.<br>
        <span class="eng-word">Stack Trace / Backtrace</span> = <span class="eng-meaning">Yığın İzleme</span> — Call stack'in o anki fotoğrafı. "Buraya nasıl geldik?"<br>
        <span class="eng-word">System Call (syscall)</span> = <span class="eng-meaning">Sistem Çağrısı</span> — Programın çekirdeğe (kernel) yaptığı istek (dosya aç, ağa bağlan).<br>
        <span class="eng-word">Memory Leak</span> = <span class="eng-meaning">Bellek Sızıntısı</span> — malloc() ile alınan ama free() ile geri verilmeyen bellek.<br>
        <span class="eng-word">Segmentation Fault (Segfault)</span> = <span class="eng-meaning">Bellek İhlali</span> — Erişilmemesi gereken belleğe erişmeye çalışma.<br>
        <span class="eng-word">LSP</span> = <span class="eng-meaning">Language Server Protocol</span> — Editör ile dil analiz aracı arasındaki protokol.<br>
        <span class="eng-word">DAP</span> = <span class="eng-meaning">Debug Adapter Protocol</span> — Editör ile debugger arasındaki protokol.<br>
        <span class="eng-word">Linter</span> = <span class="eng-meaning">Statik Analiz Aracı</span> — Kodu çalıştırmadan hata/stil kontrolü yapan araç.<br>
        <span class="eng-word">Profiler</span> = <span class="eng-meaning">Performans Analizcisi</span> — Programın nerelerde zaman harcadığını ölçen araç.
    </div>
</div>

<h2>Hata Türlerini Tanıyalım</h2>
<p>Programlarda karşılaşabileceğiniz hatalar kabaca dört kategoriye ayrılır. Her kategori farklı araçlarla çözülür:</p>

<h3>1. Derleme Hatası (Compile Error) 💥</h3>
<p>Program derlenmez bile. Sözdizimi (syntax) yanlıştır. Bu en kolay hata türüdür çünkü derleyici tam olarak hatanın nerede olduğunu söyler.</p>
<div class="code-block">
    <div class="code-block-header"><span>Derleme hatası örneği</span></div>
    <pre><code><span class="comment">// hata.c — noktalı virgül eksik:</span>
int main() {
    int x = 5     <span class="comment">// ← Burada ; eksik!</span>
    return 0;
}

<span class="comment">// Derleme denemesi:</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="argument">hata.c</span>
hata.c:3:15: error: expected ';' before 'return'
    3 |     int x = 5
      |               ^
      |               ;
    4 |     return 0;
<span class="comment">// Derleyici tam satırı ve çözümü gösteriyor!</span></code></pre>
</div>

<h3>2. Çalışma Zamanı Hatası (Runtime Error) ⚡</h3>
<p>Program sorunsuz derlenir ama <em>çalışırken</em> çöker. Bir dosya bulunamadığında, sıfıra bölme yapıldığında veya geçersiz bellek erişiminde olur.</p>
<div class="code-block">
    <div class="code-block-header"><span>Çalışma zamanı hatası örneği</span></div>
    <pre><code><span class="comment">// segfault.c — NULL pointer'a erişim:</span>
#include &lt;stdio.h&gt;
int main() {
    int *ptr = NULL;         <span class="comment">// ptr hiçbir yere işaret etmiyor</span>
    printf("%d\\n", *ptr);    <span class="comment">// ← BOOM! Segmentation fault</span>
    return 0;
}

<span class="comment">// Derlenebilir ama çalışınca çöker:</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="argument">segfault.c</span> <span class="flag">-o</span> <span class="path">segfault</span>   <span class="comment"># Sorunsuz derlenir ✓</span>
<span class="prompt">$</span> <span class="command">./segfault</span>
Segmentation fault (core dumped)   <span class="comment"># Çalışınca çöker ✗</span></code></pre>
</div>

<h3>3. Mantık Hatası (Logic Error) 🧩</h3>
<p>En sinsi hata türü! Program çökmez, hata mesajı vermez ama <strong>yanlış sonuç</strong> üretir. Derleyici bunu yakalayamaz.</p>
<div class="code-block">
    <div class="code-block-header"><span>Mantık hatası örneği</span></div>
    <pre><code><span class="comment">// mantik.c — ortalama hesaplama hatası:</span>
#include &lt;stdio.h&gt;
int main() {
    int a = 10, b = 20;
    int ortalama = a + b / 2;     <span class="comment">// ← BUG! Doğrusu: (a + b) / 2</span>
    printf("Ortalama: %d\\n", ortalama);
    return 0;
}
<span class="comment">// Çıktı: Ortalama: 20  (Beklenen: 15)</span>
<span class="comment">// Program çalışıyor, çökmüyor ama yanlış sonuç veriyor!</span>
<span class="comment">// Neden: İşlem önceliği. b/2 = 10, sonra a + 10 = 20.</span>
<span class="comment">// Parantez unutulunca matematik yanlış oluyor.</span></code></pre>
</div>

<h3>4. Bellek Hatası (Memory Error) 💧</h3>
<p>C/C++ gibi dillerde bellek yönetimi programcının elindedir. Bellek doğru yönetilmezse, program belki anlık çökmez ama zamanla sorunlar birikir.</p>
<div class="code-block">
    <div class="code-block-header"><span>Bellek sızıntısı örneği</span></div>
    <pre><code><span class="comment">// leak.c — bellek sızıntısı:</span>
#include &lt;stdlib.h&gt;
void isle() {
    int *veri = malloc(1024 * sizeof(int));  <span class="comment">// 4KB bellek aldık</span>
    veri[0] = 42;
    <span class="comment">// ... bir şeyler yaptık ama free(veri) çağırmadık!</span>
    <span class="comment">// Fonksiyon bitince 'veri' pointer'ı yok olur</span>
    <span class="comment">// ama bellekteki 4KB hâlâ ayrılmış kalır → SIZINTI!</span>
}

int main() {
    for (int i = 0; i &lt; 100000; i++) {
        isle();  <span class="comment">// 100.000 × 4KB = 400MB bellek sızıntısı!</span>
    }
    return 0;
}
<span class="comment">// Program çökmez, hata vermez ama RAM'i tüketir.</span>
<span class="comment">// Valgrind bu sızıntıyı tespit eder.</span></code></pre>
</div>

<h2>Program Bellekte Nasıl Yaşar?</h2>
<p>Debugging araçlarını anlamak için, bir programın çalışırken bellekte nasıl organize edildiğini bilmemiz gerekir. Her program dört temel bellek bölgesine sahiptir:</p>

<img src="img/memory_layout.svg" alt="Program Bellek Düzeni Diyagramı" style="width: 100%; max-width: 800px; margin: 1.5rem auto; display: block; border-radius: 8px;">

<p>Bu bölgeleri tek tek açıklayalım:</p>

<h3>Stack (Yığın) — Tabak İstifi 🥞</h3>
<p>Stack'i yemek yıkama rafı gibi düşünün: <strong>tabakları üst üste koyarsınız, en üstten alırsınız</strong> (LIFO — Last In, First Out). Programda her fonksiyon çağrıldığında stack'e bir "çerçeve" (frame) eklenir. Fonksiyon bitince o çerçeve kaldırılır.</p>

<div class="code-block">
    <div class="code-block-header"><span>Stack'te neler tutulur?</span></div>
    <pre><code>void hesapla(int x) {      <span class="comment">// x parametre → stack'te</span>
    int sonuc = x * 2;     <span class="comment">// sonuc yerel değişken → stack'te</span>
    int dizi[10];           <span class="comment">// yerel dizi → stack'te</span>
    <span class="comment">// Fonksiyon bitince bunların HEPSI otomatik silinir!</span>
}
<span class="comment">//</span>
<span class="comment">// Stack'te tutulan şeyler:</span>
<span class="comment">//   • Fonksiyon parametreleri (int x)</span>
<span class="comment">//   • Yerel (local) değişkenler (int sonuc, int dizi[])</span>
<span class="comment">//   • Fonksiyon dönüş adresi ("bitince nereye geri dönecek?")</span>
<span class="comment">//</span>
<span class="comment">// Stack'in özellikleri:</span>
<span class="comment">//   ✅ Otomatik yönetilir (programcı müdahale etmez)</span>
<span class="comment">//   ✅ Çok hızlı (sadece pointer hareket eder)</span>
<span class="comment">//   ⚠️ Boyut sınırlı (~8MB) — aşarsa "Stack Overflow!" hatası</span></code></pre>
</div>

<h3>Heap (Öbek) — Depo/Ambar 🏗️</h3>
<p>Heap, programcının <code>malloc()</code> ile yer ayırıp <code>free()</code> ile geri verdiği bellek alanıdır. Stack'ten farkı: <strong>boyut sınırı çok büyüktür</strong> ama <strong>yönetim programcıya aittir</strong>.</p>

<div class="code-block">
    <div class="code-block-header"><span>Stack vs Heap — Pratik fark</span></div>
    <pre><code><span class="comment">// Stack'te — otomatik yönetilir:</span>
void stack_ornegi() {
    int x = 42;              <span class="comment">// x stack'te oluşturulur</span>
}                             <span class="comment">// fonksiyon bitince x otomatik silinir ✓</span>

<span class="comment">// Heap'te — SEN yönetirsin:</span>
void heap_ornegi() {
    int *p = malloc(sizeof(int));   <span class="comment">// heap'ten yer ayır</span>
    *p = 42;
    free(p);                         <span class="comment">// MUTLAKA geri ver!</span>
}                                    <span class="comment">// free() unutursan → Memory Leak!</span>

<span class="comment">// Neden heap kullanırız?</span>
<span class="comment">//   • Büyük veriler (stack 8MB sınırı yetmez)</span>
<span class="comment">//   • Ömrü belirsiz veriler (fonksiyon bittikten sonra da lazım)</span>
<span class="comment">//   • Çalışma zamanında boyut belirlenen veriler</span></code></pre>
</div>

<h2>Call Stack (Çağrı Yığını) Nedir?</h2>
<p>Bu kavram debugging'in en temel taşıdır. Programınız çalışırken fonksiyonlar birbirini çağırır. Her çağrıda stack'e bir <strong>"frame" (çerçeve)</strong> eklenir. Bu frame, fonksiyonun yerel değişkenlerini ve "işim bitince nereye döneceğim?" bilgisini tutar.</p>

<p>Aşağıdaki örnekte <code>main()</code> fonksiyonu <code>hesapla()</code>'yı, <code>hesapla()</code> da <code>topla()</code>'yı çağırıyor. Stack yukarıdan aşağıya büyüdüğü için en son çağrılan fonksiyon en üstte görünür:</p>

<img src="img/call_stack_diagram.svg" alt="Call Stack Diyagramı" style="width: 100%; max-width: 800px; margin: 1.5rem auto; display: block; border-radius: 8px;">

<div class="info-box note">
    <div class="info-box-title">📌 Stack Trace Neden Önemli?</div>
    Program çöktüğünde veya hata oluştuğunda, <strong>stack trace</strong> (yığın izleme) size şunu söyler: <em>"Çökme anında hangi fonksiyon hangi fonksiyonu çağırmıştı?"</em><br><br>
    Bu bilgi, hatanın <strong>nerede</strong> ve <strong>nasıl</strong> oluştuğunu bulmak için en kritik ipucudur. GDB'de <code>backtrace</code> komutu ile stack trace'i görebilirsiniz. Her satır bir "frame" ve hangi dosyanın hangi satırında olduğunuzu gösterir.<br><br>
    Stack trace'i bir <strong>iz sürme hikayesi</strong> gibi düşünün: "main() başladı → hesapla()'yı çağırdı → topla()'yı çağırdı → ve İŞTE BURADA çöktü!"
</div>

<div class="code-block">
    <div class="code-block-header"><span>Stack Trace örneği — GDB backtrace</span></div>
    <pre><code><span class="comment"># Program çöktü! GDB ile bakalım ne olmuş:</span>
(gdb) <span class="command">backtrace</span>
#0  topla (a=5, b=10) at matematik.c:2        <span class="comment">← en son buradaydık</span>
#1  hesapla (x=5) at matematik.c:6            <span class="comment">← topla()'yı bu çağırdı</span>
#2  main () at matematik.c:12                 <span class="comment">← hesapla()'yı bu çağırdı</span>

<span class="comment"># ↑ Stack trace'i AŞAĞIDAN YUKARIYA okuyun:</span>
<span class="comment"># 1. main() başladı (satır 12)</span>
<span class="comment"># 2. main() → hesapla(5) çağırdı (satır 6)</span>
<span class="comment"># 3. hesapla() → topla(5, 10) çağırdı (satır 2)</span>
<span class="comment"># 4. Program topla() içinde çöktü! ← HATANIN YERİ</span></code></pre>
</div>

<h3>Stack Overflow — Sınırı Aşmak</h3>
<p>Stack sonsuz değildir (genellikle ~8MB). Eğer bir fonksiyon kendisini sonsuza kadar çağırırsa (kötü recursion), stack taşar:</p>
<div class="code-block">
    <div class="code-block-header"><span>Stack overflow örneği</span></div>
    <pre><code>void sonsuz() {
    sonsuz();    <span class="comment">// kendini çağırıyor, hiç bitmiyor!</span>
}
<span class="comment">// Her çağrı stack'e bir frame ekler:</span>
<span class="comment">// sonsuz() → sonsuz() → sonsuz() → ... → 💥 Stack Overflow!</span>
<span class="comment">// Stack doldu, program çöküyor.</span>
<span class="comment">// (stackoverflow.com sitesi de adını buradan alır!)</span></code></pre>
</div>

<h2>Debugging Araçları Haritası</h2>
<p>Şimdi bu kavramları bilerek, hangi durumda hangi aracı kullanacağımızı anlayalım. Her araç farklı bir "mercek" sunar:</p>

<div id="ch22-tools-map" style="overflow-x: auto;">
<table>
    <tr><th>Soru</th><th>Araç</th><th>Ne Yapar?</th><th>Gerçek Hayat Benzetmesi</th></tr>
    <tr><td>"Program nerede çöktü?"</td><td><strong>GDB</strong></td><td>Programı durdurup adım adım çalıştırır</td><td>🔍 Dedektif: olay yerini inceler</td></tr>
    <tr><td>"Hangi dosyaları/ağı kullanıyor?"</td><td><strong>strace</strong></td><td>Sistem çağrılarını izler</td><td>📞 Telefon dinleme: çekirdeğe yapılan tüm "aramaları" kaydeder</td></tr>
    <tr><td>"Hangi kütüphane fonksiyonlarını çağırıyor?"</td><td><strong>ltrace</strong></td><td>Kütüphane çağrılarını izler</td><td>📋 Görevli: programın dışarıya yaptığı tüm "siparişleri" yazar</td></tr>
    <tr><td>"Bellek sızıntısı var mı?"</td><td><strong>Valgrind</strong></td><td>Her bellek erişimini simüle eder</td><td>🏥 Tam vücut taraması: yavaş ama kapsamlı</td></tr>
    <tr><td>"Program neden yavaş?"</td><td><strong>perf</strong></td><td>CPU ve performans sayaçlarını ölçer</td><td>⏱️ Kronometre: hangi fonksiyon ne kadar süre alıyor</td></tr>
</table>
</div>

<h2>IDE'ler Nasıl Çalışır?</h2>
<p>Bir IDE (Integrated Development Environment — Bütünleşik Geliştirme Ortamı), aslında birçok bağımsız komut satırı aracını güzel bir arayüz altında birleştiren bir <strong>orkestra şefi</strong>dir. VS Code'da "Debug" butonuna bastığınızda, arka planda <code>gdb</code> çalışır. "Hata" gösteren kırmızı çizgiler? Arka planda bir <em>Language Server</em> kodu analiz eder.</p>

<p>IDE'nin her özelliği bir Linux aracına dayanır:</p>

<table>
    <tr><th>IDE Özelliği</th><th>Altında Çalışan Araç</th><th>Açıklama</th></tr>
    <tr><td>Kod tamamlama, hata gösterimi</td><td><strong>Language Server (LSP)</strong></td><td>clangd, gopls, pyright, typescript-language-server</td></tr>
    <tr><td>Derleme (Build)</td><td><strong>Derleyici + Make/CMake</strong></td><td>gcc, clang, go build, cargo build, tsc</td></tr>
    <tr><td>Hata ayıklama (Debug)</td><td><strong>Debugger (DAP)</strong></td><td>gdb, lldb, delve (Go), debugpy (Python)</td></tr>
    <tr><td>Kod formatlama</td><td><strong>Formatter</strong></td><td>clang-format, black, prettier, gofmt</td></tr>
    <tr><td>Statik analiz</td><td><strong>Linter</strong></td><td>clang-tidy, pylint, eslint, shellcheck</td></tr>
    <tr><td>Versiyon kontrol</td><td><strong>Git CLI</strong></td><td>git diff, git blame, git log</td></tr>
    <tr><td>Terminal</td><td><strong>Sistem kabuğu</strong></td><td>bash, zsh — gömülü terminal emülatörü</td></tr>
    <tr><td>Dosya ağacı</td><td><strong>Dosya sistemi API'si</strong></td><td>inotify (değişiklik izleme)</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 VS Code Mimarisi</div>
    VS Code aslında <strong>Electron</strong> (Chromium + Node.js) üzerinde çalışan bir metin editörüdür. Her "akıllı" özelliği bir <em>extension</em> sağlar:<br><br>
    • C/C++ extension → arka planda <code>clangd</code> (LSP) + <code>gdb/lldb</code> (DAP) çalıştırır<br>
    • Python extension → <code>pyright</code> (LSP) + <code>debugpy</code> (DAP) çalıştırır<br>
    • Go extension → <code>gopls</code> (LSP) + <code>delve</code> (DAP) çalıştırır<br><br>
    Dolayısıyla IDE kullanmak demek, <strong>bu komut satırı araçlarını GUI üzerinden kullanmak</strong> demektir. IDE sizi bu araçların karmaşıklığından soyutlar — ama altında hep aynı araçlar çalışır.
</div>

<pre style="font-family: 'JetBrains Mono', monospace; background: var(--code-bg); padding: 1.5rem; border-radius: 8px; overflow-x: auto; font-size: 0.85rem; line-height: 1.4; color: var(--text);">
  IDE / Editör (VS Code, CLion, Neovim...)
  ┌──────────────────────────────────────────────────────┐
  │                                                      │
  │  ┌─────────┐  ┌───────────┐  ┌──────────────────┐   │
  │  │ Metin   │  │  Dosya    │  │    Gömülü        │   │
  │  │ Editörü │  │  Ağacı    │  │    Terminal      │   │
  │  └────┬────┘  └───────────┘  └──────────────────┘   │
  │       │                                              │
  │  ┌────┴──────────────────────────────────────────┐   │
  │  │           Extension / Plugin Katmanı          │   │
  │  └────┬──────────┬──────────┬──────────┬─────────┘   │
  │       │          │          │          │             │
  └───────┼──────────┼──────────┼──────────┼─────────────┘
          │          │          │          │
    ┌─────┴───┐ ┌────┴────┐ ┌──┴───┐ ┌────┴─────┐
    │   LSP   │ │   DAP   │ │ Git  │ │ Linter/  │
    │ Server  │ │Debugger │ │ CLI  │ │Formatter │
    └─────────┘ └─────────┘ └──────┘ └──────────┘
    clangd       gdb          git      eslint
    gopls        lldb                  black
    pyright      delve                 clang-format
    tsserver     debugpy               shellcheck
</pre>

<h2>GDB — GNU Debugger</h2>
<p>GDB, Linux'ta en yaygın kullanılan hata ayıklayıcıdır. IDE'deki "Debug" butonu arka planda genellikle GDB çalıştırır. GDB ile bir programı <strong>istediğiniz satırda durdurabilir</strong>, <strong>değişkenlerin değerlerini inceleyebilir</strong> ve <strong>adım adım ilerleyebilirsiniz</strong> — tıpkı bir filmi kare kare izlemek gibi.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 GDB'yi Neden Öğrenmeliyim?</div>
    <ul>
        <li><strong>printf debugging:</strong> Her şüpheli satıra <code>printf("buraya geldi, x = %d\\n", x)</code> yazmak yaygındır ama <strong>verimsizdir</strong> — her seferinde kodu değiştirip yeniden derlemeniz gerekir.</li>
        <li><strong>GDB ile:</strong> Kodu hiç değiştirmeden, programı istediğiniz satırda durdurup tüm değişkenleri inceleyebilirsiniz. Bir sorun bulduğunuzda hemen "bir adım geri gidip" bakmak mümkündür.</li>
        <li><strong>IDE kullanıyorsanız bile:</strong> GDB'yi bilmek, IDE'nin "Debug" panelinde ne olduğunu anlamanızı sağlar. Sunucuda SSH üzerinden debug yapmanız gerektiğinde de eliniz boş kalmaz.</li>
    </ul>
</div>

<h3>GDB Adım Adım Kullanım</h3>
<p>Önce programımızı <strong>debug bilgisi ile</strong> derlememiz gerekir. <code>-g</code> flag'i, derlenmiş dosyaya kaynak kod bilgilerini (satır numaraları, değişken adları) ekler. Bu olmadan GDB "hangi satırdasın" diyemez.</p>

<div class="code-block">
    <div class="code-block-header"><span>Örnek buggy program: buggy.c</span></div>
    <pre><code><span class="comment">// buggy.c — bilerek hatalı program</span>
#include &lt;stdio.h&gt;

int bolme(int a, int b) {
    return a / b;       <span class="comment">// b = 0 olursa ne olur?</span>
}

int hesapla(int x) {
    int sonuc = bolme(x, x - 5);  <span class="comment">// x=5 ise b=0 → BOOM!</span>
    return sonuc;
}

int main() {
    int degerler[] = {10, 7, 5, 3};
    for (int i = 0; i &lt; 4; i++) {
        printf("Sonuc: %d\\n", hesapla(degerler[i]));
    }
    return 0;
}</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>GDB ile hata ayıklama — tam senaryo</span></div>
    <pre><code><span class="comment"># 1) Debug bilgisi ile derle (-g flag'i ŞART!):</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="flag">-g -Wall</span> <span class="argument">buggy.c</span> <span class="flag">-o</span> <span class="path">buggy</span>

<span class="comment"># 2) GDB başlat:</span>
<span class="prompt">$</span> <span class="command">gdb</span> <span class="path">./buggy</span>
(gdb) <span class="comment"># GDB prompt'u — komut yazabilirsiniz</span>

<span class="comment"># 3) Breakpoint ekle — "bu satırda dur":</span>
(gdb) <span class="command">break</span> main              <span class="comment"># main fonksiyonunun başında dur</span>
Breakpoint 1 at 0x4005e3: file buggy.c, line 14.

(gdb) <span class="command">break</span> bolme             <span class="comment"># bolme fonksiyonunda da dur</span>
Breakpoint 2 at 0x4005a3: file buggy.c, line 5.

<span class="comment"># 4) Programı çalıştır:</span>
(gdb) <span class="command">run</span>
Breakpoint 1, main () at buggy.c:14
14      int degerler[] = {10, 7, 5, 3};

<span class="comment"># 5) Sonraki satıra ilerle (next = fonksiyona girmez):</span>
(gdb) <span class="command">next</span>
15      for (int i = 0; i &lt; 4; i++) {
(gdb) <span class="command">next</span>
16          printf("Sonuc: %d\\n", hesapla(degerler[i]));

<span class="comment"># 6) Değişkenleri incele:</span>
(gdb) <span class="command">print</span> degerler[0]
\$1 = 10
(gdb) <span class="command">print</span> i
\$2 = 0

<span class="comment"># 7) Devam et — sonraki breakpoint'e kadar:</span>
(gdb) <span class="command">continue</span>
Breakpoint 2, bolme (a=10, b=5) at buggy.c:5
<span class="comment"># → İlk çağrıda a=10, b=5 → sorun yok</span>

(gdb) <span class="command">continue</span>                <span class="comment"># bir daha devam et</span>
Sonuc: 2
Breakpoint 2, bolme (a=7, b=2) at buggy.c:5
<span class="comment"># → İkinci çağrıda a=7, b=2 → sorun yok</span>

(gdb) <span class="command">continue</span>                <span class="comment"># bir daha</span>
Sonuc: 3
Breakpoint 2, bolme (a=5, b=0) at buggy.c:5
<span class="comment"># → Üçüncü çağrıda a=5, b=0 → SIFIRA BÖLME!!</span>

<span class="comment"># 8) Stack trace ile "buraya nasıl geldik?" sorusunu cevapla:</span>
(gdb) <span class="command">backtrace</span>
#0  bolme (a=5, b=0) at buggy.c:5           <span class="comment">← buradayız</span>
#1  hesapla (x=5) at buggy.c:9              <span class="comment">← bolme'yi bu çağırdı</span>
#2  main () at buggy.c:16                   <span class="comment">← hesapla'yı bu çağırdı</span>

<span class="comment"># → Sorun bulundu: x=5 gelince b = x-5 = 0 oluyor!</span>
<span class="comment"># → Çözüm: bolme() fonksiyonuna b==0 kontrolü eklemeliyiz.</span>

(gdb) <span class="command">quit</span></code></pre>
</div>

<h3>GDB Komut Referansı</h3>
<div class="code-block">
    <div class="code-block-header"><span>GDB temel komutlar</span></div>
    <pre><code><span class="comment"># ── Breakpoint Yönetimi ──</span>
(gdb) <span class="command">break</span> main              <span class="comment"># Fonksiyon adıyla breakpoint</span>
(gdb) <span class="command">break</span> buggy.c:42        <span class="comment"># Satır numarasıyla breakpoint</span>
(gdb) <span class="command">break</span> calculate <span class="command">if</span> x>100  <span class="comment"># Koşullu: sadece x>100 ise dur</span>
(gdb) <span class="command">info breakpoints</span>       <span class="comment"># Tüm breakpoint'leri listele</span>
(gdb) <span class="command">delete</span> 2                <span class="comment"># 2 numaralı breakpoint'i sil</span>
(gdb) <span class="command">disable</span> 1               <span class="comment"># Geçici olarak kapat</span>

<span class="comment"># ── Çalıştırma ve İlerleme ──</span>
(gdb) <span class="command">run</span>                     <span class="comment"># Programı başlat</span>
(gdb) <span class="command">run</span> arg1 arg2           <span class="comment"># Argümanlarla başlat</span>
(gdb) <span class="command">next</span>                    <span class="comment"># Sonraki satır (fonksiyona GİRMEZ)</span>
(gdb) <span class="command">step</span>                    <span class="comment"># Sonraki satır (fonksiyona GİRER)</span>
(gdb) <span class="command">continue</span>                <span class="comment"># Sonraki breakpoint'e kadar devam</span>
(gdb) <span class="command">finish</span>                  <span class="comment"># Mevcut fonksiyondan çık (dönüş değerini gösterir)</span>

<span class="comment"># ── İnceleme ──</span>
(gdb) <span class="command">print</span> x                 <span class="comment"># x değişkeninin değeri</span>
(gdb) <span class="command">print</span> *ptr               <span class="comment"># Pointer'ın gösterdiği değer</span>
(gdb) <span class="command">print</span> arr[0]@10          <span class="comment"># Dizinin ilk 10 elemanı</span>
(gdb) <span class="command">print/x</span> flags            <span class="comment"># Hex formatında göster</span>
(gdb) <span class="command">info locals</span>             <span class="comment"># Tüm yerel değişkenler</span>

<span class="comment"># ── Stack Trace ──</span>
(gdb) <span class="command">backtrace</span>               <span class="comment"># Çağrı zincirini göster (bt kısaltması)</span>
(gdb) <span class="command">frame</span> 3                 <span class="comment"># 3 numaralı frame'e git (başka fonksiyona bak)</span>

<span class="comment"># ── Gelişmiş ──</span>
(gdb) <span class="command">watch</span> counter           <span class="comment"># Watchpoint: counter değişince dur</span>
(gdb) <span class="command">list</span>                    <span class="comment"># Etraftaki kaynak kodu göster</span></code></pre>
</div>

<h3>Segmentation Fault Analizi — Core Dump</h3>
<p>Program zaten çökmüşse ve GDB'de çalıştırmamışsanız, <strong>core dump</strong> dosyasından "otopsi" yapabilirsiniz:</p>

<div class="code-block">
    <div class="code-block-header"><span>Core dump ile post-mortem analiz</span></div>
    <pre><code><span class="comment"># Core dump'ı aktifleştir (varsayılan olarak kapalı olabilir):</span>
<span class="prompt">$</span> <span class="command">ulimit -c unlimited</span>

<span class="comment"># Çöken programı çalıştır:</span>
<span class="prompt">$</span> <span class="command">./buggy</span>
Segmentation fault (core dumped)   <span class="comment">← "core dumped" = bellek dökümü kaydedildi</span>

<span class="comment"># Core dump dosyasını GDB ile aç:</span>
<span class="prompt">$</span> <span class="command">gdb</span> <span class="path">./buggy</span> <span class="argument">core</span>

<span class="comment"># Çökme anının stack trace'ini göster:</span>
(gdb) <span class="command">backtrace</span>
#0  0x0000... in crash_func (ptr=0x0) at buggy.c:15
#1  0x0000... in main () at buggy.c:28
<span class="comment"># → Satır 15'te ptr=0x0 (NULL pointer) erişimi → crash!</span>
<span class="comment"># Core dump bir "kaza fotoğrafı"dır — programın son anını gösterir.</span></code></pre>
</div>

<h2>strace — Programın Çekirdeğe Konuşmasını Dinlemek</h2>
<p>Her program çalışırken, dosya açmak, ekrana yazmak, ağa bağlanmak gibi işlemler için <strong>işletim sistemi çekirdeğine (kernel)</strong> "ricada" bulunur. Bu ricalara <strong>sistem çağrısı (system call / syscall)</strong> denir.</p>

<p><code>strace</code>, programın yaptığı <strong>tüm sistem çağrılarını</strong> gösterir. Program neden çalışmıyorsa, strace genellikle ilk bakacağınız araçtır.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Sistem Çağrısı Nedir? — Günlük Hayat Benzetmesi</div>
    Programı bir <strong>mahkum</strong> gibi düşünün. Mahkum doğrudan dışarıya çıkamaz — her şeyi <strong>gardiyan (kernel)</strong> aracılığıyla yapar:<br><br>
    • "Dosyayı aç" → <code>open()</code> / <code>openat()</code> — gardiyana "şu dosyayı getir" demek<br>
    • "Dosyaya yaz" → <code>write()</code> — gardiyana "şunu yaz" demek<br>
    • "Ağa bağlan" → <code>connect()</code> — gardiyana "şu numarayı ara" demek<br>
    • "Bellek ver" → <code>mmap()</code> — gardiyana "bir oda daha lazım" demek<br><br>
    <code>strace</code>, bu konuşmaları <strong>gizlice dinler</strong> ve size raporlar.
</div>

<div class="code-block">
    <div class="code-block-header"><span>strace örnekleri</span></div>
    <pre><code><span class="comment"># Temel kullanım — ls'in tüm syscall'larını gör:</span>
<span class="prompt">$</span> <span class="command">strace</span> <span class="argument">ls /tmp</span>
execve("/usr/bin/ls", ["ls", "/tmp"], ...) = 0    <span class="comment"># programı çalıştır</span>
openat(AT_FDCWD, "/tmp", O_RDONLY|O_DIRECTORY) = 3 <span class="comment"># /tmp dizinini aç</span>
getdents64(3, ...) = 240                           <span class="comment"># dizin içeriğini oku</span>
write(1, "file1.txt  file2.log\\n", 22) = 22       <span class="comment"># ekrana yaz</span>
...

<span class="comment"># Sadece dosya işlemlerini izle:</span>
<span class="prompt">$</span> <span class="command">strace</span> <span class="flag">-e trace=open,openat,read,write</span> <span class="argument">./program</span>

<span class="comment"># Sadece ağ çağrılarını izle:</span>
<span class="prompt">$</span> <span class="command">strace</span> <span class="flag">-e trace=network</span> <span class="argument">curl example.com</span>

<span class="comment"># Her syscall'ın ne kadar sürdüğünü göster:</span>
<span class="prompt">$</span> <span class="command">strace</span> <span class="flag">-T</span> <span class="argument">./program</span>

<span class="comment"># İstatistik özet — "en çok ne yapıyor?":</span>
<span class="prompt">$</span> <span class="command">strace</span> <span class="flag">-c</span> <span class="argument">ls /tmp</span>
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- --------
 45.00    0.000089           8        11           mmap
 20.00    0.000040           6         6           openat
 ...

<span class="comment"># Çalışan bir sürece bağlan (PID ile):</span>
<span class="prompt">$</span> <span class="command">sudo strace</span> <span class="flag">-p</span> <span class="argument">\$(pgrep nginx | head -1)</span>

<span class="comment"># Çıktıyı dosyaya yaz (ekran çok kalabalık olur):</span>
<span class="prompt">$</span> <span class="command">strace</span> <span class="flag">-o</span> <span class="path">trace.log</span> <span class="argument">./program</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 strace Pratik Kullanım Senaryoları</div>
    <ul>
        <li><strong>"Permission denied" ama nerede?</strong> → <code>strace -e trace=file ./program 2>&amp;1 | grep EACCES</code></li>
        <li><strong>Program neden yavaş?</strong> → <code>strace -c ./program</code> ile en çok zaman alan syscall'ı bulun</li>
        <li><strong>Hangi dosyaları açıyor?</strong> → <code>strace -e openat ./program 2>&amp;1 | grep -v ENOENT</code></li>
        <li><strong>Hangi kütüphaneler yükleniyor?</strong> → <code>strace -e openat ./program 2>&amp;1 | grep \\.so</code></li>
        <li><strong>Yapılandırma dosyası nerede aranıyor?</strong> → <code>strace ./program 2>&amp;1 | grep "config\\|conf\\|\\.ini\\|\\.cfg"</code></li>
    </ul>
</div>

<h2>ltrace — Kütüphane Çağrılarını İzlemek</h2>
<p>strace <strong>çekirdeğe</strong> yapılan çağrıları izlerken, <code>ltrace</code> <strong>kütüphanelere</strong> yapılan çağrıları izler. Yani programın <code>printf()</code>, <code>malloc()</code>, <code>strlen()</code> gibi C kütüphane fonksiyonlarını ne zaman, hangi parametrelerle çağırdığını görürsünüz.</p>

<div class="code-block">
    <div class="code-block-header"><span>ltrace örnekleri</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">ltrace</span> <span class="argument">./program</span>
malloc(1024)                             = 0x55a8f4e3d2a0  <span class="comment"># 1KB bellek alındı</span>
strcpy(0x55a8f4e3d2a0, "Hello")          = 0x55a8f4e3d2a0  <span class="comment"># "Hello" kopyalandı</span>
strlen("Hello")                          = 5               <span class="comment"># uzunluk: 5</span>
printf("Mesaj: %s\\n", "Hello")           = 13              <span class="comment"># ekrana yazıldı</span>
free(0x55a8f4e3d2a0)                     = &lt;void&gt;          <span class="comment"># bellek geri verildi ✓</span>

<span class="comment"># Sadece malloc/free çağrılarını filtrele:</span>
<span class="prompt">$</span> <span class="command">ltrace</span> <span class="flag">-e malloc+free</span> <span class="argument">./program</span>

<span class="comment"># İstatistik — hangi fonksiyon kaç kez çağrıldı:</span>
<span class="prompt">$</span> <span class="command">ltrace</span> <span class="flag">-c</span> <span class="argument">./program</span></code></pre>
</div>

<h2>Valgrind — Bellek Dedektifi</h2>
<p>C/C++ gibi dillerde belleği programcı yönetir. <code>malloc()</code> ile alıp <code>free()</code> ile geri vermeniz gerekir. Unutursanız? <strong>Bellek sızıntısı (memory leak)</strong>. Yanlış yere erişirseniz? <strong>Segfault</strong>. İki kere free yaparsanız? <strong>Double free</strong>.</p>

<p>Valgrind, programınızın <strong>her bellek erişimini simüle ederek</strong> tüm bu hataları bulur. Programı Valgrind içinde çalıştırdığınızda, her malloc/free takip edilir ve sorunlar raporlanır.</p>

<div class="code-block">
    <div class="code-block-header"><span>Valgrind ile bellek analizi — tam senaryo</span></div>
    <pre><code><span class="comment"># 1) Debug bilgisi ile derle (Valgrind satır numarası göstersin):</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="flag">-g -O0</span> <span class="argument">leaky.c</span> <span class="flag">-o</span> <span class="path">leaky</span>

<span class="comment"># 2) Valgrind ile çalıştır:</span>
<span class="prompt">$</span> <span class="command">valgrind</span> <span class="flag">--leak-check=full --show-leak-kinds=all</span> <span class="argument">./leaky</span>

<span class="comment"># 3) Çıktıyı okuyalım (korkutucu görünür ama basittir):</span>

==12345== HEAP SUMMARY:
==12345==     in use at exit: 1,024 bytes in 1 blocks
<span class="comment">#    ↑ Program bittiğinde 1024 byte hâlâ bellekte!</span>

==12345==   total heap usage: 5 allocs, 4 frees, 5,120 bytes allocated
<span class="comment">#    ↑ 5 kere malloc yapılmış ama sadece 4 kere free → 1 eksik!</span>

==12345== 1,024 bytes in 1 blocks are definitely lost in loss record 1 of 1
==12345==    at 0x4C2BBAF: malloc (vg_replace_malloc.c:299)
==12345==    by 0x40054E: process_data (leaky.c:15)
<span class="comment">#                          ↑ leaky.c dosyasının 15. satırında</span>
==12345==    by 0x400589: main (leaky.c:28)
<span class="comment">#                          ↑ main'den çağrılmış</span>

<span class="comment"># ÇÖZÜM: leaky.c:15'teki malloc'a karşılık free() ekle!</span>

<span class="comment"># ── Başlatılmamış değişken kullanımı: ──</span>
==12345== Conditional jump or move depends on uninitialised value(s)
==12345==    at 0x400520: check_value (buggy.c:10)
<span class="comment"># → buggy.c:10'da bir değişken değer atanmadan kullanılmış!</span>
<span class="comment"># C'de int x; yaparsanız x'in değeri "çöp" olur (rastgele).</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Valgrind Performans Etkisi</div>
    Valgrind, programı 10-50x yavaşlatır çünkü <strong>her bellek erişimini simüle eder</strong>. Bu normal ve beklenen bir durumdur. Production'da (gerçek kullanımda) değil, geliştirme/test aşamasında kullanın.
</div>

<h3>Valgrind Araç Ailesi</h3>
<p>Valgrind sadece bellek sızıntısı aramaz — bir <strong>araç ailesidir</strong>. Memcheck (varsayılan) en yaygınıdır ama diğerleri de çok faydalıdır:</p>
<table>
    <tr><th>Araç</th><th>Ne Yapar?</th><th>Ne Zaman Kullanılır?</th><th>Komut</th></tr>
    <tr><td><strong>Memcheck</strong></td><td>Bellek sızıntısı, geçersiz erişim</td><td>Her zaman — varsayılan</td><td><code>valgrind ./prog</code></td></tr>
    <tr><td><strong>Callgrind</strong></td><td>Fonksiyon çağrı sayılarını profiller</td><td>Hangi fonksiyon çok çağrılıyor?</td><td><code>valgrind --tool=callgrind ./prog</code></td></tr>
    <tr><td><strong>Cachegrind</strong></td><td>CPU cache kullanımını analiz eder</td><td>Cache miss optimize etmek</td><td><code>valgrind --tool=cachegrind ./prog</code></td></tr>
    <tr><td><strong>Massif</strong></td><td>Heap bellek kullanım profili çizer</td><td>Bellek tüketimini azaltmak</td><td><code>valgrind --tool=massif ./prog</code></td></tr>
    <tr><td><strong>Helgrind</strong></td><td>Thread yarış koşullarını (race condition) bulur</td><td>Çok thread'li programlar</td><td><code>valgrind --tool=helgrind ./prog</code></td></tr>
</table>

<h2>AddressSanitizer (ASan) — Hafif Alternatif</h2>
<p>Valgrind harika ama yavaştır. <strong>AddressSanitizer (ASan)</strong>, Google tarafından geliştirilmiş bir alternatiftir. Derleyiciye <code>-fsanitize=address</code> flag'i ekleyerek programı "zırhlı" derlersiniz. Program normal hızının yaklaşık 2 katı yavaşlıkta çalışır (Valgrind'in 10-50x'ine karşı).</p>

<div class="code-block">
    <div class="code-block-header"><span>ASan kullanımı</span></div>
    <pre><code><span class="comment"># ASan ile derle:</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="flag">-fsanitize=address -g -O1</span> <span class="argument">buggy.c</span> <span class="flag">-o</span> <span class="path">buggy</span>

<span class="comment"># Çalıştır — hata olursa detaylı rapor verir:</span>
<span class="prompt">$</span> <span class="command">./buggy</span>
==12345==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x60200000...
<span class="comment">#  ↑ "heap'te bir dizinin sınırlarını aştın!"</span>
READ of size 4 at 0x60200000... thread T0
    #0 0x4005a3 in main buggy.c:12
<span class="comment">#  ↑ buggy.c satır 12'de oldu</span>
    ...

<span class="comment"># Diğer sanitizer'lar:</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="flag">-fsanitize=undefined</span> <span class="argument">prog.c</span> <span class="flag">-o</span> <span class="path">prog</span>     <span class="comment"># UBSan: tanımsız davranış (sıfıra bölme vb.)</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="flag">-fsanitize=thread</span> <span class="argument">prog.c</span> <span class="flag">-o</span> <span class="path">prog</span>        <span class="comment"># TSan: thread hataları</span></code></pre>
</div>

<h2>LLDB — LLVM Debugger</h2>
<p>LLDB, Clang/LLVM ekosistemine ait modern bir debugger'dır. macOS'ta varsayılan debugger'dır ve GDB'ye alternatiftir. Komutlar biraz farklıdır:</p>

<div class="code-block">
    <div class="code-block-header"><span>GDB vs LLDB komut karşılaştırması</span></div>
    <pre><code><span class="comment"># GDB                        LLDB</span>
break main                 → breakpoint set --name main
break file.c:42            → breakpoint set --file file.c --line 42
run                        → process launch
next                       → thread step-over
step                       → thread step-in
print x                    → frame variable x
backtrace                  → thread backtrace
info locals                → frame variable</code></pre>
</div>

<h2>perf — Performans Profilleme</h2>
<p>Program çalışıyor ama yavaş mı? <code>perf</code>, Linux çekirdeğine entegre bir performans analiz aracıdır. Hangi fonksiyonların en çok CPU zamanı harcadığını gösterir.</p>

<div class="code-block">
    <div class="code-block-header"><span>perf ile profilleme</span></div>
    <pre><code><span class="comment"># Performans verisi topla:</span>
<span class="prompt">$</span> <span class="command">sudo perf record</span> <span class="argument">./program</span>

<span class="comment"># Raporu göster (en çok zaman harcayan fonksiyonlar):</span>
<span class="prompt">$</span> <span class="command">sudo perf report</span>

<span class="comment"># Canlı istatistik:</span>
<span class="prompt">$</span> <span class="command">sudo perf stat</span> <span class="argument">./program</span>
 Performance counter stats for './program':
          3.42 msec task-clock
             5      context-switches
       1,234,567    instructions
         456,789    cycles
           2.10     insn per cycle

<span class="comment"># Hotspot fonksiyonları canlı izle:</span>
<span class="prompt">$</span> <span class="command">sudo perf top</span></code></pre>
</div>

<h2>Linter ve Formatter Araçları</h2>
<p>IDE'lerin gerçek zamanlı hata gösterimi ve "otomatik düzeltme" özellikleri bu araçlara dayanır. <strong>Linter</strong>, kodu <em>çalıştırmadan</em> analiz eder ve potansiyel hataları bulur. <strong>Formatter</strong>, kodun görünümünü otomatik düzeltir (girintileme, boşluklar gibi).</p>

<div class="code-block">
    <div class="code-block-header"><span>Popüler linter/formatter araçları</span></div>
    <pre><code><span class="comment"># === C/C++ ===</span>
<span class="prompt">$</span> <span class="command">clang-format</span> <span class="flag">-i</span> <span class="argument">main.c</span>              <span class="comment"># Formatla</span>
<span class="prompt">$</span> <span class="command">clang-tidy</span> <span class="argument">main.c</span> -- <span class="flag">-std=c11</span>      <span class="comment"># Statik analiz</span>
<span class="prompt">$</span> <span class="command">cppcheck</span> <span class="argument">main.c</span>                      <span class="comment"># Hata tarama</span>

<span class="comment"># === Python ===</span>
<span class="prompt">$</span> <span class="command">pylint</span> <span class="argument">script.py</span>                     <span class="comment"># Linting</span>
<span class="prompt">$</span> <span class="command">black</span> <span class="argument">script.py</span>                      <span class="comment"># Formatlama</span>
<span class="prompt">$</span> <span class="command">mypy</span> <span class="argument">script.py</span>                       <span class="comment"># Tip kontrolü</span>

<span class="comment"># === JavaScript/TypeScript ===</span>
<span class="prompt">$</span> <span class="command">npx eslint</span> <span class="argument">app.js</span>                    <span class="comment"># Linting</span>
<span class="prompt">$</span> <span class="command">npx prettier</span> <span class="flag">--write</span> <span class="argument">app.js</span>         <span class="comment"># Formatlama</span>

<span class="comment"># === Shell Script ===</span>
<span class="prompt">$</span> <span class="command">shellcheck</span> <span class="argument">script.sh</span>                 <span class="comment"># Bash linting (çok faydalı!)</span>

<span class="comment"># === Go ===</span>
<span class="prompt">$</span> <span class="command">gofmt</span> <span class="flag">-w</span> <span class="argument">main.go</span>                    <span class="comment"># Formatlama (Go topluluğunda zorunlu)</span>
<span class="prompt">$</span> <span class="command">go vet</span> <span class="argument">./...</span>                         <span class="comment"># Statik analiz</span>
<span class="prompt">$</span> <span class="command">staticcheck</span> <span class="argument">./...</span>                   <span class="comment"># İleri statik analiz</span></code></pre>
</div>

<h2>LSP — Editörleri "Akıllı" Yapan Protokol</h2>
<p>Eskiden her editör (Vim, Emacs, VS Code, Sublime...) her dil için <strong>kendi analiz kodunu</strong> yazardı. 5 editör × 10 dil = 50 ayrı entegrasyon! Bu M×N problemini çözmek için Microsoft 2016'da <strong>Language Server Protocol (LSP)</strong>'ı tanıttı.</p>

<p>LSP ile her dil için <strong>bir kere</strong> yazılan "language server" tüm editörlerle çalışır. Böylece M+N (5+10 = 15) entegrasyon yeterli olur:</p>

<div class="code-block">
    <div class="code-block-header"><span>LSP sunucuları kurma</span></div>
    <pre><code><span class="comment"># C/C++ — clangd:</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> <span class="argument">clangd</span>

<span class="comment"># Python — pyright:</span>
<span class="prompt">$</span> <span class="command">npm install</span> <span class="flag">-g</span> <span class="argument">pyright</span>

<span class="comment"># Go — gopls:</span>
<span class="prompt">$</span> <span class="command">go install</span> <span class="argument">golang.org/x/tools/gopls@latest</span>

<span class="comment"># TypeScript — typescript-language-server:</span>
<span class="prompt">$</span> <span class="command">npm install</span> <span class="flag">-g</span> <span class="argument">typescript-language-server typescript</span>

<span class="comment"># Rust — rust-analyzer:</span>
<span class="prompt">$</span> <span class="command">rustup component add</span> <span class="argument">rust-analyzer</span>

<span class="comment"># Bash — bash-language-server:</span>
<span class="prompt">$</span> <span class="command">npm install</span> <span class="flag">-g</span> <span class="argument">bash-language-server</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Kendi Minimal IDE'nizi Kurun</div>
    Neovim veya Helix gibi bir terminal editörüne LSP, DAP ve formatter ayarlayarak, VS Code kadar akıllı ama çok daha hafif bir geliştirme ortamı oluşturabilirsiniz. <strong>Tüm "zeka" editörde değil, bu bağımsız araçlardadır.</strong>
</div>

<h2>Hata Ayıklama Stratejileri — Özet Tablosu</h2>
<table>
    <tr><th>Sorun</th><th>Araç</th><th>Yaklaşım</th></tr>
    <tr><td>Segfault / crash</td><td>GDB, core dump</td><td>backtrace ile çöktüğü satırı bul</td></tr>
    <tr><td>Bellek sızıntısı</td><td>Valgrind, ASan</td><td>Leak check ile sızan bloğu bul</td></tr>
    <tr><td>"File not found" ama dosya var</td><td>strace</td><td>Programın hangi yola baktığını gör</td></tr>
    <tr><td>Program donuyor</td><td>GDB (attach), strace</td><td>Hangi syscall'da takıldığını bul</td></tr>
    <tr><td>Performans sorunu</td><td>perf, callgrind</td><td>Hotspot fonksiyonları tespit et</td></tr>
    <tr><td>Thread race condition</td><td>Helgrind, TSan</td><td>Eşzamanlılık hatalarını tespit et</td></tr>
    <tr><td>Mantık hatası</td><td>GDB + breakpoint</td><td>Adım adım çalıştır, değişkenleri izle</td></tr>
    <tr><td>Yetki sorunu</td><td>strace</td><td>EACCES dönen syscall'ı bul</td></tr>
    <tr><td>Kütüphane sorunu</td><td>ltrace, ldd</td><td>Hangi lib çağrılıyor, doğru versiyonda mı?</td></tr>
</table>

<h2>Dış Kaynaklar</h2>
<div class="info-box tip">
    <div class="info-box-title">📚 İleri Okuma</div>
    <ul>
        <li><a href="https://sourceware.org/gdb/current/onlinedocs/gdb/" target="_blank" rel="noopener">GDB Manual</a> — GDB resmi belgeleri</li>
        <li><a href="https://strace.io/" target="_blank" rel="noopener">strace.io</a> — strace resmi sitesi ve örnekler</li>
        <li><a href="https://valgrind.org/docs/manual/quick-start.html" target="_blank" rel="noopener">Valgrind Quick Start</a> — Valgrind başlangıç rehberi</li>
        <li><a href="https://microsoft.github.io/language-server-protocol/" target="_blank" rel="noopener">LSP Specification</a> — Language Server Protocol resmi spesifikasyonu</li>
        <li><a href="https://microsoft.github.io/debug-adapter-protocol/" target="_blank" rel="noopener">DAP Specification</a> — Debug Adapter Protocol spesifikasyonu</li>
        <li><a href="https://jvns.ca/blog/2021/04/03/what-problems-do-people-solve-with-strace/" target="_blank" rel="noopener">Julia Evans — strace</a> — strace ile çözülen gerçek dünya problemleri</li>
        <li><a href="https://beej.us/guide/bggdb/" target="_blank" rel="noopener">Beej's Guide to GDB</a> — Başlangıç dostu GDB rehberi</li>
    </ul>
</div>
`,
    quiz: [
        {
            question: "'Bug' (hata) kelimesinin yazılımda kullanımı nereden geliyor?",
            options: ["Bir programlama dili komutundan", "Grace Hopper'ın bilgisayarda gerçek bir böcek bulmasından", "UNIX'in kurucusunun soyadından", "İngilizce 'big' kelimesinin yanlış yazımından"],
            correct: 1,
            explanation: "1947'de Grace Hopper ve ekibi Harvard Mark II bilgisayarında arıza ararken gerçek bir güve (moth) buldular. O günden beri yazılım hatalarına 'bug', hata ayıklamaya 'debugging' denir."
        },
        {
            question: "Call Stack (Çağrı Yığını) ne işe yarar?",
            options: ["Dosyaları sıralar", "Fonksiyonların birbirini çağırma zincirini ve yerel değişkenleri takip eder", "Bellek sızıntılarını bulur", "Ağ bağlantılarını izler"],
            correct: 1,
            explanation: "Call Stack, 'main() → hesapla() → topla()' gibi fonksiyon çağrı zincirini tutar. Her çağrıda stack'e bir 'frame' (yerel değişkenler + dönüş adresi) eklenir. GDB'de 'backtrace' komutu ile bu zinciri görebilirsiniz."
        },
        {
            question: "Stack ile Heap arasındaki temel fark nedir?",
            options: ["Stack daha büyüktür", "Stack otomatik yönetilir, Heap'i programcı yönetir (malloc/free)", "Heap daha hızlıdır", "Fark yoktur"],
            correct: 1,
            explanation: "Stack'teki değişkenler fonksiyon bitince otomatik silinir. Heap'te ise malloc() ile aldığınız belleği free() ile geri vermeniz gerekir — unutursanız memory leak oluşur."
        },
        {
            question: "IDE'lerdeki 'kod tamamlama' özelliği arka planda hangi teknolojiyi kullanır?",
            options: ["GDB", "Language Server Protocol (LSP)", "strace", "Valgrind"],
            correct: 1,
            explanation: "LSP (Language Server Protocol), editör ile dil analiz sunucusu (clangd, pyright, gopls vb.) arasındaki iletişim protokolüdür. Kod tamamlama, hata gösterimi, tanıma gitme gibi özellikler LSP aracılığıyla sağlanır."
        },
        {
            question: "strace ne izler?",
            options: ["Kütüphane çağrılarını", "Sistem çağrılarını (syscalls) — programın çekirdeğe yaptığı istekleri", "Bellek sızıntılarını", "Ağ trafiğini"],
            correct: 1,
            explanation: "strace, programın çekirdeğe (kernel) yaptığı sistem çağrılarını (open, read, write, mmap vb.) izler. Programın hangi dosyaları açtığını, ağa nasıl bağlandığını gösterir. Kütüphane çağrıları için ltrace kullanılır."
        },
        {
            question: "Valgrind'in Memcheck aracı ne tespit eder?",
            options: ["CPU kullanımını", "Ağ hatalarını", "Bellek sızıntılarını ve hatalı bellek erişimlerini", "Disk performansını"],
            correct: 2,
            explanation: "Memcheck; bellek sızıntılarını (memory leak), başlatılmamış bellek kullanımını, serbest bırakılmış belleğe erişimi ve buffer overflow'ları tespit eder."
        },
        {
            question: "GDB'de 'backtrace' komutu ne gösterir?",
            options: ["Bellekteki tüm değişkenleri", "Program çöktüğünde hangi fonksiyonun hangi fonksiyonu çağırdığını (çağrı zinciri)", "Disk kullanımını", "Ağ bağlantılarını"],
            correct: 1,
            explanation: "backtrace (veya bt), call stack'in o anki durumunu — yani fonksiyon çağrı zincirini — gösterir. Program çöktüğünde 'buraya nasıl geldik?' sorusunu cevaplar: #0 topla() → #1 hesapla() → #2 main()."
        },
        {
            question: "Bir program 'Permission denied' hatası veriyor ama hangi dosyada olduğunu söylemiyor. Hangi aracı kullanırsınız?",
            options: ["GDB", "Valgrind", "strace", "perf"],
            correct: 2,
            explanation: "strace -e trace=file ./program 2>&1 | grep EACCES komutu ile programın hangi dosyaya erişmeye çalışıp reddedildiğini görebilirsiniz. strace, programın çekirdeğe yaptığı tüm dosya işlemlerini izler."
        },
        {
            question: "AddressSanitizer'ın Valgrind'e göre avantajı nedir?",
            options: ["Daha fazla hata türü bulur", "Kurulum gerektirmez", "Çok daha az yavaşlatır (~2x vs 10-50x)", "Sadece C için çalışır"],
            correct: 2,
            explanation: "ASan derleme zamanında eklenir (-fsanitize=address) ve programı sadece ~2x yavaşlatır. Valgrind ise simülasyon tabanlıdır ve 10-50x yavaşlatır. ASan daha hızlı ama Valgrind daha kapsamlıdır."
        }
    ]
});
