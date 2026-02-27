// ===== Bölüm 13: Bash Scripting =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 13,
    title: 'Bash Scripting',
    subtitle: 'Bash Scripting',
    icon: '📜',
    description: 'Shell betikleri yazma: değişkenler, koşullar, döngüler, fonksiyonlar, diziler ve hata yönetimi.',
    content: `
<h2>Bash Script Nedir?</h2>
<p>Bash script, birden fazla komutu bir dosyaya yazıp <strong>otomatik olarak çalıştırmaktır</strong>. Tekrarlayan görevleri otomatikleştirir, karmaşık işlemleri basitleştirir.</p>

<div class="eng-box">
    <div class="eng-title">🔤 Terim</div>
    <div class="eng-content">
        <span class="eng-word">Script</span> = <span class="eng-meaning">Betik / Senaryo</span> — Komutların sıralı listesi. Derlemeye gerek yoktur, satır satır yorumlanır.<br>
        <span class="eng-word">Shebang</span> = <span class="eng-meaning">#! (hash + bang)</span> — Betiğin hangi yorumlayıcı ile çalıştırılacağını belirler.
    </div>
</div>

<h3>İlk Script</h3>
<div class="code-block">
    <div class="code-block-header"><span>merhaba.sh</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>
<span class="comment"># Bu bir yorum satırıdır</span>

<span class="command">echo</span> <span class="string">"Merhaba, Dünya!"</span>
<span class="command">echo</span> <span class="string">"Bugünün tarihi:"</span> <span class="argument">$(date)</span>
<span class="command">echo</span> <span class="string">"Hoş geldin,"</span> <span class="argument">$USER</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Script oluşturma ve çalıştırma</span></div>
    <pre><code><span class="comment"># 1. Dosyayı oluştur (nano, vi, vs.):</span>
<span class="prompt">$</span> <span class="command">nano</span> <span class="path">merhaba.sh</span>

<span class="comment"># 2. Çalıştırma izni ver:</span>
<span class="prompt">$</span> <span class="command">chmod +x</span> <span class="path">merhaba.sh</span>

<span class="comment"># 3. Çalıştır:</span>
<span class="prompt">$</span> <span class="command">./merhaba.sh</span>

<span class="comment"># Alternatif: bash ile doğrudan çalıştır (izin gerekmez):</span>
<span class="prompt">$</span> <span class="command">bash</span> <span class="path">merhaba.sh</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Neden #!/bin/bash?</div>
    Shebang (<code>#!</code>) satırı, işletim sistemine "bu dosyayı <code>/bin/bash</code> programıyla çalıştır" der. Onsuz sistem hangi shell'i kullanacağını bilemez. Taşınabilirlik için <code>#!/usr/bin/env bash</code> de kullanılır — bash'in yolu farklı sistemlerde değişebileceği için <code>env</code> onu otomatik bulur.
</div>

<h2>Değişkenler (Variables)</h2>

<div class="code-block">
    <div class="code-block-header"><span>Değişken tanımlama ve kullanma</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>

<span class="comment"># Değişken tanımlama (= etrafında BOŞLUK OLMAMALI!):</span>
isim=<span class="string">"Ahmet"</span>
yas=25
dizin=<span class="string">"/home/ahmet"</span>

<span class="comment"># Değişken kullanma ($):</span>
<span class="command">echo</span> <span class="string">"Merhaba, $isim. Yaşınız: $yas"</span>
<span class="command">echo</span> <span class="string">"Ev dizininiz: \${dizin}"</span>

<span class="comment"># Komut çıktısını değişkene ata:</span>
tarih=<span class="argument">$(date +%Y-%m-%d)</span>
dosya_sayisi=<span class="argument">$(ls | wc -l)</span>
<span class="command">echo</span> <span class="string">"Tarih: $tarih, Dosya sayısı: $dosya_sayisi"</span>

<span class="comment"># Salt okunur değişken:</span>
<span class="command">readonly</span> PI=3.14159</code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Değişkenlerde En Yaygın Hata</div>
    <code>isim = "Ahmet"</code> ❌ YANLIŞ! (boşluklar var)<br>
    <code>isim="Ahmet"</code> ✅ DOĞRU! (boşluk yok)<br>
    Bash'te <code>=</code> etrafında boşluk olursa, shell bunu komut olarak yorumlamaya çalışır.
</div>

<h3>Özel Değişkenler</h3>
<table>
    <tr><th>Değişken</th><th>Anlamı</th></tr>
    <tr><td><code>$0</code></td><td>Script dosyasının adı</td></tr>
    <tr><td><code>$1, $2, ...</code></td><td>1., 2., ... konumsal parametre (argüman)</td></tr>
    <tr><td><code>$#</code></td><td>Argüman sayısı</td></tr>
    <tr><td><code>$@</code></td><td>Tüm argümanlar (ayrı ayrı)</td></tr>
    <tr><td><code>$*</code></td><td>Tüm argümanlar (tek string)</td></tr>
    <tr><td><code>$?</code></td><td>Son komutun çıkış kodu (0=başarı)</td></tr>
    <tr><td><code>$$</code></td><td>Mevcut script'in PID'si</td></tr>
    <tr><td><code>$!</code></td><td>Son arka plan sürecinin PID'si</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>Argüman örneği: selamla.sh</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>
<span class="command">echo</span> <span class="string">"Script adı: $0"</span>
<span class="command">echo</span> <span class="string">"Merhaba, $1!"</span>
<span class="command">echo</span> <span class="string">"Toplam $# argüman verildi."</span>

<span class="comment"># Kullanım: ./selamla.sh Ahmet</span>
<span class="comment"># Çıktı: Script adı: ./selamla.sh</span>
<span class="comment">#        Merhaba, Ahmet!</span>
<span class="comment">#        Toplam 1 argüman verildi.</span></code></pre>
</div>

<h2>Kullanıcıdan Girdi Alma</h2>

<div class="code-block">
    <div class="code-block-header"><span>read komutu</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>
<span class="command">read</span> -p <span class="string">"Adınız: "</span> isim
<span class="command">read</span> -p <span class="string">"Yaşınız: "</span> yas
<span class="command">read</span> -sp <span class="string">"Şifreniz: "</span> sifre  <span class="comment"># -s: sessiz (şifre gizle)</span>
<span class="command">echo</span>  <span class="comment"># -s sonrası yeni satır</span>

<span class="command">echo</span> <span class="string">"Hoş geldin $isim ($yas yaşında)"</span></code></pre>
</div>

<h2>Koşullar (if / elif / else)</h2>

<div class="code-block">
    <div class="code-block-header"><span>if yapısı</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>

<span class="comment"># Temel if/elif/else:</span>
<span class="command">read</span> -p <span class="string">"Bir sayı girin: "</span> sayi

<span class="keyword">if</span> [[ $sayi -gt 100 ]]; <span class="keyword">then</span>
    <span class="command">echo</span> <span class="string">"100'den büyük"</span>
<span class="keyword">elif</span> [[ $sayi -gt 50 ]]; <span class="keyword">then</span>
    <span class="command">echo</span> <span class="string">"50 ile 100 arasında"</span>
<span class="keyword">elif</span> [[ $sayi -gt 0 ]]; <span class="keyword">then</span>
    <span class="command">echo</span> <span class="string">"0 ile 50 arasında"</span>
<span class="keyword">else</span>
    <span class="command">echo</span> <span class="string">"0 veya negatif"</span>
<span class="keyword">fi</span></code></pre>
</div>

<h3>Karşılaştırma Operatörleri</h3>
<table>
    <tr><th colspan="2">Sayısal Karşılaştırma</th><th colspan="2">String Karşılaştırma</th></tr>
    <tr><td><code>-eq</code></td><td>Eşit (equal)</td><td><code>==</code></td><td>String eşit</td></tr>
    <tr><td><code>-ne</code></td><td>Eşit değil (not equal)</td><td><code>!=</code></td><td>String eşit değil</td></tr>
    <tr><td><code>-gt</code></td><td>Büyük (greater than)</td><td><code>-z</code></td><td>String boş mu</td></tr>
    <tr><td><code>-ge</code></td><td>Büyük-eşit (greater-equal)</td><td><code>-n</code></td><td>String boş değil mi</td></tr>
    <tr><td><code>-lt</code></td><td>Küçük (less than)</td><td><code>&lt;</code></td><td>Alfabetik önce</td></tr>
    <tr><td><code>-le</code></td><td>Küçük-eşit (less-equal)</td><td><code>&gt;</code></td><td>Alfabetik sonra</td></tr>
</table>

<h3>Dosya Test Operatörleri</h3>
<table>
    <tr><th>Test</th><th>İngilizce</th><th>Anlamı</th></tr>
    <tr><td><code>-e dosya</code></td><td>Exists</td><td>Dosya/dizin var mı</td></tr>
    <tr><td><code>-f dosya</code></td><td>File</td><td>Normal dosya mı</td></tr>
    <tr><td><code>-d dosya</code></td><td>Directory</td><td>Dizin mi</td></tr>
    <tr><td><code>-r dosya</code></td><td>Readable</td><td>Okunabilir mi</td></tr>
    <tr><td><code>-w dosya</code></td><td>Writable</td><td>Yazılabilir mi</td></tr>
    <tr><td><code>-x dosya</code></td><td>Executable</td><td>Çalıştırılabilir mi</td></tr>
    <tr><td><code>-s dosya</code></td><td>Size</td><td>Boyutu 0'dan büyük mü</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>Dosya kontrolü örneği</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>
dosya=<span class="string">"$1"</span>

<span class="keyword">if</span> [[ -z <span class="string">"$dosya"</span> ]]; <span class="keyword">then</span>
    <span class="command">echo</span> <span class="string">"Kullanım: $0 &lt;dosya_adı&gt;"</span>
    <span class="command">exit</span> 1
<span class="keyword">fi</span>

<span class="keyword">if</span> [[ -f <span class="string">"$dosya"</span> ]]; <span class="keyword">then</span>
    <span class="command">echo</span> <span class="string">"'$dosya' bir dosyadır ($(wc -l < "$dosya") satır)"</span>
<span class="keyword">elif</span> [[ -d <span class="string">"$dosya"</span> ]]; <span class="keyword">then</span>
    <span class="command">echo</span> <span class="string">"'$dosya' bir dizindir"</span>
<span class="keyword">else</span>
    <span class="command">echo</span> <span class="string">"'$dosya' bulunamadı"</span>
    <span class="command">exit</span> 1
<span class="keyword">fi</span></code></pre>
</div>

<h2>case — Çoklu Seçim</h2>

<div class="code-block">
    <div class="code-block-header"><span>case örneği</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>
<span class="command">read</span> -p <span class="string">"İşletim sisteminiz (linux/mac/windows): "</span> os

<span class="keyword">case</span> <span class="string">"$os"</span> <span class="keyword">in</span>
    linux | Linux)
        <span class="command">echo</span> <span class="string">"Harika seçim! 🐧"</span>
        ;;
    mac | Mac | macos)
        <span class="command">echo</span> <span class="string">"Darwin tabanlı, güzel. 🍎"</span>
        ;;
    windows | Windows)
        <span class="command">echo</span> <span class="string">"WSL kullanmanızı öneriyoruz."</span>
        ;;
    *)
        <span class="command">echo</span> <span class="string">"Bilinmeyen OS: $os"</span>
        ;;
<span class="keyword">esac</span></code></pre>
</div>

<h2>Döngüler (Loops)</h2>

<h3>for Döngüsü</h3>
<div class="code-block">
    <div class="code-block-header"><span>for döngüsü</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>

<span class="comment"># Liste üzerinde döngü:</span>
<span class="keyword">for</span> meyve <span class="keyword">in</span> elma armut kiraz; <span class="keyword">do</span>
    <span class="command">echo</span> <span class="string">"Meyve: $meyve"</span>
<span class="keyword">done</span>

<span class="comment"># Sayı aralığı ({başlangıç..bitiş}):</span>
<span class="keyword">for</span> i <span class="keyword">in</span> {1..10}; <span class="keyword">do</span>
    <span class="command">echo</span> <span class="string">"Sayı: $i"</span>
<span class="keyword">done</span>

<span class="comment"># C tarzı for:</span>
<span class="keyword">for</span> ((i=0; i&lt;5; i++)); <span class="keyword">do</span>
    <span class="command">echo</span> <span class="string">"İndeks: $i"</span>
<span class="keyword">done</span>

<span class="comment"># Dosyalar üzerinde döngü:</span>
<span class="keyword">for</span> dosya <span class="keyword">in</span> *.txt; <span class="keyword">do</span>
    <span class="command">echo</span> <span class="string">"İşleniyor: $dosya"</span>
    <span class="command">wc -l</span> <span class="string">"$dosya"</span>
<span class="keyword">done</span>

<span class="comment"># Komut çıktısı üzerinde döngü:</span>
<span class="keyword">for</span> user <span class="keyword">in</span> $(cut -d: -f1 /etc/passwd); <span class="keyword">do</span>
    <span class="command">echo</span> <span class="string">"Kullanıcı: $user"</span>
<span class="keyword">done</span></code></pre>
</div>

<h3>while Döngüsü</h3>
<div class="code-block">
    <div class="code-block-header"><span>while döngüsü</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>

<span class="comment"># Basit while:</span>
sayac=1
<span class="keyword">while</span> [[ $sayac -le 5 ]]; <span class="keyword">do</span>
    <span class="command">echo</span> <span class="string">"Sayaç: $sayac"</span>
    ((sayac++))
<span class="keyword">done</span>

<span class="comment"># Dosyayı satır satır oku:</span>
<span class="keyword">while</span> IFS= <span class="command">read</span> -r satir; <span class="keyword">do</span>
    <span class="command">echo</span> <span class="string">"Satır: $satir"</span>
<span class="keyword">done</span> &lt; dosya.txt

<span class="comment"># Sonsuz döngü (Ctrl+C ile çık):</span>
<span class="keyword">while</span> true; <span class="keyword">do</span>
    <span class="command">echo</span> <span class="string">"Çalışıyor... $(date)"</span>
    <span class="command">sleep</span> 5
<span class="keyword">done</span></code></pre>
</div>

<h2>Fonksiyonlar (Functions)</h2>

<div class="code-block">
    <div class="code-block-header"><span>Fonksiyon tanımlama ve kullanma</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>

<span class="comment"># Fonksiyon tanımlama:</span>
<span class="keyword">function</span> selamla() {
    <span class="command">echo</span> <span class="string">"Merhaba, $1!"</span>
    <span class="command">echo</span> <span class="string">"Bugün $(date +%A)"</span>
}

<span class="comment"># Veya kısa yazım:</span>
topla() {
    <span class="keyword">local</span> sonuc=$(( $1 + $2 ))  <span class="comment"># local: yerel değişken</span>
    <span class="command">echo</span> $sonuc
}

<span class="comment"># Fonksiyon çağırma:</span>
selamla <span class="string">"Ahmet"</span>

<span class="comment"># Dönüş değerini yakalama:</span>
toplam=$(topla 5 3)
<span class="command">echo</span> <span class="string">"5 + 3 = $toplam"</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Fonksiyonlarda return vs echo</div>
    Bash'te <code>return</code> sadece çıkış kodu (0-255) döndürür. Veri döndürmek için <code>echo</code> kullanıp <code>$(fonksiyon)</code> ile yakalayın. Veya global değişken kullanın.
</div>

<h2>Diziler (Arrays)</h2>

<div class="code-block">
    <div class="code-block-header"><span>Dizi işlemleri</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>

<span class="comment"># Dizi tanımlama:</span>
meyveler=(<span class="string">"elma"</span> <span class="string">"armut"</span> <span class="string">"kiraz"</span> <span class="string">"muz"</span>)

<span class="comment"># Elemana erişim (0-tabanlı indeks):</span>
<span class="command">echo</span> <span class="string">"İlk: \${meyveler[0]}"</span>
<span class="command">echo</span> <span class="string">"Üçüncü: \${meyveler[2]}"</span>

<span class="comment"># Tüm elemanlar:</span>
<span class="command">echo</span> <span class="string">"Hepsi: \${meyveler[@]}"</span>

<span class="comment"># Eleman sayısı:</span>
<span class="command">echo</span> <span class="string">"Toplam: \${#meyveler[@]}"</span>

<span class="comment"># Eleman ekle:</span>
meyveler+=(<span class="string">"çilek"</span>)

<span class="comment"># Dizi üzerinde döngü:</span>
<span class="keyword">for</span> m <span class="keyword">in</span> <span class="string">"\${meyveler[@]}"</span>; <span class="keyword">do</span>
    <span class="command">echo</span> <span class="string">"→ $m"</span>
<span class="keyword">done</span></code></pre>
</div>

<h2>Çıkış Kodları ve Hata Yönetimi</h2>

<div class="code-block">
    <div class="code-block-header"><span>Çıkış kodları</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>

<span class="comment"># Çıkış kodunu kontrol etme — grep ile doğru yöntem:</span>
<span class="keyword">if</span> <span class="command">grep</span> -q <span class="string">"kalıp"</span> dosya.txt; <span class="keyword">then</span>
    <span class="command">echo</span> <span class="string">"Bulundu!"</span>
<span class="keyword">else</span>
    <span class="command">echo</span> <span class="string">"Bulunamadı."</span>
<span class="keyword">fi</span>
<span class="comment"># -q = quiet (sessiz), sadece çıkış kodunu döndürür</span>
<span class="comment"># if komutu doğrudan çıkış kodunu kontrol eder — $? gerek yok!</span>

<span class="comment"># Veya kısaca && ve || ile:</span>
<span class="command">grep</span> -q <span class="string">"kalıp"</span> dosya.txt && <span class="command">echo</span> <span class="string">"Var"</span> || <span class="command">echo</span> <span class="string">"Yok"</span>

<span class="comment"># Kendi çıkış kodunuzu belirleyin:</span>
<span class="keyword">if</span> [[ ! -f <span class="string">"$1"</span> ]]; <span class="keyword">then</span>
    <span class="command">echo</span> <span class="string">"Hata: Dosya bulunamadı!"</span> >&2  <span class="comment"># stderr'e yaz</span>
    <span class="command">exit</span> 1
<span class="keyword">fi</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>set seçenekleri — güvenli scripting</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>
<span class="command">set -euo pipefail</span>
<span class="comment"># -e  = Bir komut başarısız olursa script durur</span>
<span class="comment"># -u  = Tanımsız değişken kullanımında hata verir</span>
<span class="comment"># -o pipefail = Pipe zincirinde herhangi bir komut başarısız olursa</span>
<span class="comment">#              tüm pipe başarısız sayılır</span>

<span class="comment"># ⚠️ DİKKAT: set -e ile grep birlikte kullanırken:</span>
<span class="comment"># grep eşleşme bulamazsa çıkış kodu 1 döner → set -e scripti durdurur!</span>
<span class="comment"># Çözüm 1: if içinde kullan (if set -e'den etkilenmez):</span>
<span class="keyword">if</span> <span class="command">grep</span> -q <span class="string">"kalıp"</span> dosya.txt; <span class="keyword">then</span>
    <span class="command">echo</span> <span class="string">"Bulundu"</span>
<span class="keyword">fi</span>

<span class="comment"># Çözüm 2: || true ekle (hatayı bastır):</span>
sonuc=$(<span class="command">grep</span> <span class="string">"kalıp"</span> dosya.txt || true)</code></pre>
</div>

<table>
    <tr><th>Çıkış Kodu</th><th>Anlamı</th></tr>
    <tr><td><code>0</code></td><td>Başarılı ✅</td></tr>
    <tr><td><code>1</code></td><td>Genel hata</td></tr>
    <tr><td><code>2</code></td><td>Yanlış kullanım (syntax hatası)</td></tr>
    <tr><td><code>126</code></td><td>Çalıştırma izni yok</td></tr>
    <tr><td><code>127</code></td><td>Komut bulunamadı</td></tr>
    <tr><td><code>130</code></td><td>Ctrl+C ile kesildi</td></tr>
</table>

<h2>trap — Sinyal Yakalama ve Temizlik</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">trap</span> = <span class="eng-meaning">Tuzak / Yakalama</span> — Scriptiniz bir sinyal aldığında (Ctrl+C gibi) veya çıkış yaparken belirli komutları çalıştırmanızı sağlar. Özellikle <strong>temizlik işlemleri</strong> için kritiktir.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>trap kullanımı</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>

<span class="comment"># Script çıkışında (normal veya hata) geçici dosyaları temizle:</span>
GECICI=$(mktemp)
<span class="command">trap</span> <span class="string">"rm -f $GECICI; echo 'Temizlendi!'"</span> EXIT

<span class="comment"># Veri işleme...</span>
<span class="command">echo</span> <span class="string">"veri"</span> > <span class="string">"$GECICI"</span>
<span class="comment"># Script çıktığında (exit, hata, Ctrl+C) $GECICI otomatik silinir</span>

<span class="comment"># Ctrl+C yakalamak:</span>
<span class="command">trap</span> <span class="string">"echo 'Ctrl+C basıldı, çıkılıyor...'; exit 1"</span> INT

<span class="comment"># Birden fazla sinyal:</span>
<span class="command">trap</span> temizle EXIT INT TERM

temizle() {
    <span class="command">echo</span> <span class="string">"Temizlik yapılıyor..."</span>
    rm -f /tmp/kilit_dosyam
}</code></pre>
</div>

<h2>source / . — Script'i Mevcut Shell'de Çalıştır</h2>

<div class="eng-box">
    <div class="eng-title">🔤 Komut Anlamı</div>
    <div class="eng-content">
        <span class="eng-word">source</span> = <span class="eng-meaning">Kaynak</span> — Bir script dosyasını mevcut shell içinde çalıştırır (alt kabuk açmaz). Dosyadaki değişkenler ve fonksiyonlar mevcut oturumda kalır.<br>
        <code>.</code> (nokta) = <code>source</code>'un kısa yazımıdır, aynı işi yapar.
    </div>
</div>

<div class="code-block">
    <div class="code-block-header"><span>source vs bash farkı</span></div>
    <pre><code><span class="comment"># ayarlar.sh dosyası:</span>
<span class="comment"># export DB_HOST="localhost"</span>
<span class="comment"># export DB_PORT=5432</span>

<span class="comment"># bash ile çalıştır → ALT KABUK açılır, değişkenler kaybolur:</span>
<span class="prompt">$</span> <span class="command">bash</span> <span class="path">ayarlar.sh</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="argument">$DB_HOST</span>
<span class="output"></span>  <span class="comment"># BOŞ! Alt kabukta tanımlandı, burada yok</span>

<span class="comment"># source ile çalıştır → MEVCUT SHELL'de çalışır:</span>
<span class="prompt">$</span> <span class="command">source</span> <span class="path">ayarlar.sh</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="argument">$DB_HOST</span>
<span class="output">localhost</span>  <span class="comment"># ✅ Değişkenler mevcut shell'de!</span>

<span class="comment"># Kısa yazım (nokta):</span>
<span class="prompt">$</span> <span class="command">.</span> <span class="path">ayarlar.sh</span>

<span class="comment"># Bu yüzden ~/.bashrc değişikliklerinde:</span>
<span class="prompt">$</span> <span class="command">source</span> <span class="path">~/.bashrc</span>  <span class="comment"># Terminali kapatmadan değişiklikleri uygula</span></code></pre>
</div>

<h2>Debugging — Script Hatalarını Bulma</h2>

<div class="code-block">
    <div class="code-block-header"><span>Hata ayıklama teknikleri</span></div>
    <pre><code><span class="comment"># Yöntem 1: bash -x ile çalıştır (tüm komutları gösterir):</span>
<span class="prompt">$</span> <span class="command">bash -x</span> <span class="path">script.sh</span>
<span class="output">+ echo 'Merhaba'
+ isim=Ali
+ echo 'Kullanici: Ali'</span>
<span class="comment"># Her satır '+' ile başlar ve genişletilmiş haliyle gösterilir</span>

<span class="comment"># Yöntem 2: Script içinde belirli bölümü debug et:</span>
<span class="command">set -x</span>   <span class="comment"># Debug modunu AÇ</span>
<span class="comment"># ... hatalı bölge ...</span>
<span class="command">set +x</span>   <span class="comment"># Debug modunu KAPAT</span>

<span class="comment"># Yöntem 3: Script başına ekle:</span>
<span class="comment">#!/bin/bash -x</span>
<span class="comment"># Tüm script debug modunda çalışır</span>

<span class="comment"># İpucu: Karmaşık değişkenleri kontrol etmek için:</span>
<span class="command">echo</span> <span class="string">"DEBUG: degisken='$degisken'"</span> >&2</code></pre>
</div>

<h2>Parametre Genişletme (Parameter Expansion)</h2>

<div class="code-block">
    <div class="code-block-header"><span>Gelişmiş parametre genişletme</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>
dosya=<span class="string">"rapor.2024.tar.gz"</span>

<span class="comment"># Varsayılan değer (değişken boşsa):</span>
isim=\${1:-"Misafir"}       <span class="comment"># $1 boşsa "Misafir" kullan</span>

<span class="comment"># Uzantı işlemleri:</span>
<span class="command">echo</span> \${dosya%.gz}         <span class="comment"># rapor.2024.tar (sondan .gz sil)</span>
<span class="command">echo</span> \${dosya%%.*}        <span class="comment"># rapor (sondan ilk . dahil hepsini sil)</span>
<span class="command">echo</span> \${dosya#*.}         <span class="comment"># 2024.tar.gz (baştan ilk . dahil sil)</span>
<span class="command">echo</span> \${dosya##*.}        <span class="comment"># gz (baştan son . dahil hepsini sil)</span>

<span class="comment"># Bul-değiştir:</span>
yol=<span class="string">"/home/ali/belgeler"</span>
<span class="command">echo</span> \${yol/ali/ayse}     <span class="comment"># /home/ayse/belgeler (ilk eşleşme)</span>
<span class="command">echo</span> \${yol//e/E}         <span class="comment"># /homE/ali/bElgElEr (tüm eşleşmeler)</span>

<span class="comment"># Uzunluk:</span>
<span class="command">echo</span> \${#dosya}           <span class="comment"># 18 (karakter sayısı)</span>

<span class="comment"># Alt string:</span>
<span class="command">echo</span> \${dosya:0:5}        <span class="comment"># rapor (0. pozisyondan 5 karakter)</span></code></pre>
</div>

<h2>Pratik Script Örnekleri</h2>

<div class="code-block">
    <div class="code-block-header"><span>Otomatik yedekleme scripti</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>
<span class="comment"># yedekle.sh — Basit yedekleme betiği</span>
set -euo pipefail

KAYNAK=<span class="string">"$HOME/Belgeler"</span>
HEDEF=<span class="string">"$HOME/Yedekler"</span>
TARIH=<span class="argument">$(date +%Y%m%d_%H%M%S)</span>
ARSIV=<span class="string">"yedek_\${TARIH}.tar.gz"</span>

<span class="comment"># Hedef dizini oluştur</span>
<span class="command">mkdir -p</span> <span class="string">"$HEDEF"</span>

<span class="comment"># Sıkıştır ve yedekle</span>
<span class="command">tar -czf</span> <span class="string">"\${HEDEF}/\${ARSIV}"</span> <span class="string">"$KAYNAK"</span>

<span class="comment"># 30 günden eski yedekleri sil</span>
<span class="command">find</span> <span class="string">"$HEDEF"</span> -name <span class="string">"yedek_*.tar.gz"</span> -mtime +30 -delete

<span class="command">echo</span> <span class="string">"✅ Yedekleme tamamlandı: \${ARSIV}"</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Sistem bilgi raporu</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>
<span class="comment"># sistem_rapor.sh — Sistem bilgi özeti</span>

<span class="keyword">function</span> ayirici() {
    <span class="command">echo</span> <span class="string">"================================"</span>
}

ayirici
<span class="command">echo</span> <span class="string">"  SISTEM BİLGİ RAPORU"</span>
<span class="command">echo</span> <span class="string">"  $(date)"</span>
ayirici

<span class="command">echo</span> <span class="string">"Hostname  : $(hostname)"</span>
<span class="command">echo</span> <span class="string">"Uptime    : $(uptime -p 2>/dev/null || uptime)"</span>
<span class="command">echo</span> <span class="string">"Kernel    : $(uname -r)"</span>
<span class="command">echo</span> <span class="string">"CPU Cores : $(nproc 2>/dev/null || echo 'N/A')"</span>

ayirici
<span class="command">echo</span> <span class="string">"BELLEK KULLANIMI:"</span>
<span class="command">free -h</span> 2>/dev/null || <span class="command">echo</span> <span class="string">"free komutu bulunamadı"</span>

ayirici
<span class="command">echo</span> <span class="string">"DİSK KULLANIMI:"</span>
<span class="command">df -h</span> / 2>/dev/null

ayirici
<span class="command">echo</span> <span class="string">"EN ÇOK CPU KULLANAN 5 SÜREÇ:"</span>
<span class="command">ps aux</span> --sort=-%cpu 2>/dev/null | <span class="command">head -6</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Script Yazarken Altın Kurallar</div>
    <ol>
        <li><strong>Her zaman shebang kullanın:</strong> <code>#!/bin/bash</code> veya <code>#!/usr/bin/env bash</code></li>
        <li><strong><code>set -euo pipefail</code> ekleyin:</strong> Hataları erken yakalayın</li>
        <li><strong>Değişkenleri tırnak içine alın:</strong> <code>"$degisken"</code> (boşluklu değerler için)</li>
        <li><strong>Yorum yazın:</strong> 6 ay sonra kendiniz bile ne yazdığınızı unutursunuz</li>
        <li><strong>Fonksiyon kullanın:</strong> Tekrarı azaltır, okunabilirliği artırır</li>
        <li><strong>Hataları stderr'e yazın:</strong> <code>echo "Hata" >&2</code></li>
    </ol>
</div>
`,
    quiz: [
        {
            question: "Bir bash script'in ilk satırındaki '#!/bin/bash' ne anlama gelir?",
            options: ["Yorum satırı", "Bu dosyayı /bin/bash ile çalıştır (shebang)", "Dosyanın sahibini belirtir", "Dosyanın şifrelenmiş olduğunu gösterir"],
            correct: 1,
            explanation: "#! (shebang/hashbang), işletim sistemine bu betiği hangi yorumlayıcı (interpreter) ile çalıştıracağını söyler."
        },
        {
            question: "'isim = \"Ahmet\"' ifadesindeki sorun nedir?",
            options: ["Çift tırnak kullanılmamalı", "Eşittir işareti etrafında boşluk olmamalı", "Değişken adı Türkçe olamaz", "Sorun yok, doğru yazılmış"],
            correct: 1,
            explanation: "Bash'te değişken atamasında = etrafında boşluk OLMAMALDIR. Doğrusu: isim=\"Ahmet\". Boşluk olursa shell 'isim' adlı bir komut aramaya çalışır."
        },
        {
            question: "'$?' ne döndürür?",
            options: ["Mevcut kullanıcı adı", "Son çalıştırılan komutun çıkış kodu", "Script'in dosya yolu", "Rastgele bir sayı"],
            correct: 1,
            explanation: "$? son komutun çıkış kodunu (exit code) döndürür. 0 = başarı, sıfır olmayan = hata."
        },
        {
            question: "for dosya in *.txt; do echo $dosya; done — bu ne yapar?",
            options: ["Tüm .txt dosyalarını siler", "Tüm .txt dosyalarının adlarını yazdırır", "Yeni .txt dosyası oluşturur", "Dosyaları .txt uzantısıyla yeniden adlandırır"],
            correct: 1,
            explanation: "Bu for döngüsü mevcut dizindeki tüm .txt dosyaları üzerinde dolaşır ve her birinin adını ekrana yazdırır."
        },
        {
            question: "'set -e' scriptin başına eklendiğinde ne olur?",
            options: ["Script daha hızlı çalışır", "Herhangi bir komut başarısız olursa script durur", "Tüm değişkenler export edilir", "Hata mesajları gizlenir"],
            correct: 1,
            explanation: "'set -e' (exit on error) herhangi bir komut sıfır olmayan çıkış kodu döndürdüğünde scriptin hemen durmasını sağlar. Dikkat: if içindeki komutlar bundan etkilenmez."
        },
        {
            question: "'trap komut EXIT' ne yapar?",
            options: ["Scripti hemen durdurur", "Script çıkışında (normal/hata) belirtilen komutu çalıştırır", "Çıkış kodunu değiştirir", "Hata mesajlarını yakalar"],
            correct: 1,
            explanation: "trap ... EXIT, script her çıktığında (başarılı, hata, Ctrl+C) belirtilen komutu çalıştırır. Geçici dosyaları temizlemek için idealdir."
        },
        {
            question: "'source ~/.bashrc' ile 'bash ~/.bashrc' arasındaki fark nedir?",
            options: ["Fark yoktur", "source mevcut shell'de çalışır, bash alt kabuk açar", "bash daha hızlıdır", "source sadece root için çalışır"],
            correct: 1,
            explanation: "source (veya .) dosyayı mevcut shell'de çalıştırır — değişkenler kalır. bash ise alt kabuk (subshell) açar — değişkenler alt kabukla birlikte kaybolur."
        }
    ]
});
