// ===== Bölüm 21: Derleyiciler, Yorumlayıcılar ve Geliştirme Araçları =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 21,
    title: 'Derleyiciler ve Geliştirme Araçları',
    subtitle: 'Compilers, Interpreters & Dev Tools',
    icon: '⚙️',
    description: 'GCC, G++, Clang, Go, Python, pip, Node.js, npm: derleme süreci, yorumlama, derleme ile yorumlama farkı ve geliştirme ortamı kurulumu.',
    content: `
<h2>Derleme vs Yorumlama</h2>
<p>Bir programlama dilinde yazdığınız kaynak kodu, makinenin anlayacağı makine koduna dönüştürülmelidir. Bu iki temel yolla yapılır:</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">Compiler</span> = <span class="eng-meaning">Derleyici</span> — Kaynak kodunu makine koduna çevirir.<br>
        <span class="eng-word">Interpreter</span> = <span class="eng-meaning">Yorumlayıcı</span> — Kaynak kodunu satır satır çalıştırır.<br>
        <span class="eng-word">Linker</span> = <span class="eng-meaning">Bağlayıcı</span> — Derlenmiş dosyaları çalıştırılabilir hale birleştirir.<br>
        <span class="eng-word">Preprocessor</span> = <span class="eng-meaning">Ön İşlemci</span> — #include, #define gibi direktifleri işler.<br>
        <span class="eng-word">Object File</span> = <span class="eng-meaning">Nesne Dosyası</span> — Derlenmiş ama henüz bağlanmamış kod (.o).<br>
        <span class="eng-word">Executable</span> = <span class="eng-meaning">Çalıştırılabilir Dosya</span> — Makine kodu, doğrudan çalışır.<br>
        <span class="eng-word">Runtime</span> = <span class="eng-meaning">Çalışma Zamanı</span> — Programın çalıştığı ortam/süre.<br>
        <span class="eng-word">Toolchain</span> = <span class="eng-meaning">Araç Zinciri</span> — Derleme sürecindeki araçların bütünü.<br>
        <span class="eng-word">Build System</span> = <span class="eng-meaning">Derleme Sistemi</span> — Derleme sürecini otomatikleştiren araç (Make, CMake).
    </div>
</div>

<table>
    <tr><th>Özellik</th><th>Derleyici (Compiler)</th><th>Yorumlayıcı (Interpreter)</th></tr>
    <tr><td>Çalışma</td><td>Tüm kodu bir seferde makine koduna çevirir</td><td>Satır satır okur ve çalıştırır</td></tr>
    <tr><td>Hız</td><td>Hızlı çalışır (makine kodu)</td><td>Daha yavaş (her seferinde çeviri)</td></tr>
    <tr><td>Hata tespiti</td><td>Derleme zamanında (compile time)</td><td>Çalışma zamanında (runtime)</td></tr>
    <tr><td>Çıktı</td><td>Çalıştırılabilir dosya (binary)</td><td>Çıktı yok — doğrudan çalışır</td></tr>
    <tr><td>Dağıtım</td><td>Sadece binary dağıtılır</td><td>Kaynak kod + yorumlayıcı gerekir</td></tr>
    <tr><td>Örnekler</td><td>C, C++, Rust, Go</td><td>Python, Ruby, Bash, JavaScript</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Hibrit Yaklaşımlar</div>
    Java ve C#, önce <strong>bytecode</strong>'a derlenir, sonra bir sanal makine (JVM, CLR) tarafından yorumlanır veya JIT (Just-In-Time) derlenir. Python da aslında .pyc bytecode'a derlenir, ama bu kullanıcıdan gizlidir.
</div>

<h2>C Derleme Süreci — Ayrıntılı</h2>
<p>C/C++ derleme süreci dört aşamadan oluşur. Bu aşamaları anlamak, IDE'lerin arka planda ne yaptığını kavramanın temelidir:</p>

<div class="code-block">
    <div class="code-block-header"><span>C derleme aşamaları</span></div>
    <pre><code><span class="comment"># 1. ÖN İŞLEME (Preprocessing)</span>
<span class="comment">#    #include dosyaları eklenir, #define makroları genişletilir</span>
<span class="prompt">$</span> <span class="command">gcc -E</span> <span class="argument">main.c</span> <span class="flag">-o</span> <span class="path">main.i</span>

<span class="comment"># 2. DERLEME (Compilation)</span>
<span class="comment">#    C kodu → assembly diline çevrilir</span>
<span class="prompt">$</span> <span class="command">gcc -S</span> <span class="argument">main.i</span> <span class="flag">-o</span> <span class="path">main.s</span>

<span class="comment"># 3. MONTAJ (Assembly)</span>
<span class="comment">#    Assembly → makine kodu (object file)</span>
<span class="prompt">$</span> <span class="command">gcc -c</span> <span class="argument">main.s</span> <span class="flag">-o</span> <span class="path">main.o</span>

<span class="comment"># 4. BAĞLAMA (Linking)</span>
<span class="comment">#    Object dosyalar + kütüphaneler → çalıştırılabilir dosya</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="argument">main.o</span> <span class="flag">-o</span> <span class="path">program</span>

<span class="comment"># Tek satırda hepsini yap:</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="argument">main.c</span> <span class="flag">-o</span> <span class="path">program</span>

<span class="comment"># Çalıştır:</span>
<span class="prompt">$</span> <span class="command">./program</span></code></pre>
</div>

<pre style="font-family: 'JetBrains Mono', monospace; background: var(--code-bg); padding: 1.5rem; border-radius: 8px; overflow-x: auto; font-size: 0.85rem; line-height: 1.4; color: var(--text);">
  main.c          math.c          utils.c         (Kaynak dosyalar)
    │               │                │
    ▼               ▼                ▼
 ┌──────┐       ┌──────┐       ┌──────┐
 │ -E   │       │ -E   │       │ -E   │         Ön İşleme
 └──┬───┘       └──┬───┘       └──┬───┘
    │               │                │
    ▼               ▼                ▼
 ┌──────┐       ┌──────┐       ┌──────┐
 │ -S   │       │ -S   │       │ -S   │         Derleme → Assembly
 └──┬───┘       └──┬───┘       └──┬───┘
    │               │                │
    ▼               ▼                ▼
 ┌──────┐       ┌──────┐       ┌──────┐
 │ -c   │       │ -c   │       │ -c   │         Montaj → Object (.o)
 └──┬───┘       └──┬───┘       └──┬───┘
    │               │                │
    └───────────────┼────────────────┘
                    │
                    ▼
              ┌───────────┐
              │  Linker   │  ← libm.so, libc.so  (Kütüphaneler)
              └─────┬─────┘
                    │
                    ▼
              ┌───────────┐
              │  program   │   Çalıştırılabilir dosya
              └───────────┘
</pre>

<h2>GCC — GNU Compiler Collection</h2>
<p>GCC, Linux'un en temel derleyicisidir. Linux çekirdeği dahil, üzerinde çalıştığınız sistemin büyük bölümü GCC ile derlenmiştir.</p>

<div class="code-block">
    <div class="code-block-header"><span>GCC / G++ temel kullanım</span></div>
    <pre><code><span class="comment"># C derle:</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="argument">main.c</span> <span class="flag">-o</span> <span class="path">program</span>

<span class="comment"># C++ derle (g++ kullan):</span>
<span class="prompt">$</span> <span class="command">g++</span> <span class="argument">main.cpp</span> <span class="flag">-o</span> <span class="path">program</span>

<span class="comment"># Warning'leri aç (HER ZAMAN kullanın):</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="flag">-Wall -Wextra -Werror</span> <span class="argument">main.c</span> <span class="flag">-o</span> <span class="path">program</span>

<span class="comment"># Optimizasyon seviyeleri:</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="flag">-O0</span> <span class="argument">main.c</span> <span class="flag">-o</span> <span class="path">prog</span>    <span class="comment"># Optimizasyon yok (debug için)</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="flag">-O2</span> <span class="argument">main.c</span> <span class="flag">-o</span> <span class="path">prog</span>    <span class="comment"># İyi optimizasyon (genel kullanım)</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="flag">-O3</span> <span class="argument">main.c</span> <span class="flag">-o</span> <span class="path">prog</span>    <span class="comment"># Agresif optimizasyon</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="flag">-Os</span> <span class="argument">main.c</span> <span class="flag">-o</span> <span class="path">prog</span>    <span class="comment"># Boyut optimizasyonu</span>

<span class="comment"># Debug bilgisi ekle (gdb için):</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="flag">-g</span> <span class="argument">main.c</span> <span class="flag">-o</span> <span class="path">program</span>

<span class="comment"># C standardını belirt:</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="flag">-std=c11</span> <span class="argument">main.c</span> <span class="flag">-o</span> <span class="path">prog</span>
<span class="prompt">$</span> <span class="command">g++</span> <span class="flag">-std=c++17</span> <span class="argument">main.cpp</span> <span class="flag">-o</span> <span class="path">prog</span>

<span class="comment"># Kütüphane bağlama (matematik kütüphanesi):</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="argument">main.c</span> <span class="flag">-lm</span> <span class="flag">-o</span> <span class="path">prog</span>          <span class="comment"># -lm = libm.so</span>

<span class="comment"># Birden fazla dosya derleme:</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="argument">main.c utils.c math.c</span> <span class="flag">-o</span> <span class="path">program</span>

<span class="comment"># Header dosyası yolu ekle:</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="flag">-I./include</span> <span class="argument">main.c</span> <span class="flag">-o</span> <span class="path">prog</span>

<span class="comment"># Makro tanımla:</span>
<span class="prompt">$</span> <span class="command">gcc</span> <span class="flag">-DDEBUG -DVERSION=2</span> <span class="argument">main.c</span> <span class="flag">-o</span> <span class="path">prog</span></code></pre>
</div>

<h2>Clang — LLVM C/C++ Derleyicisi</h2>
<p>Clang, GCC'ye alternatif modern bir derleyicidir. Daha iyi hata mesajları verir ve LLVM altyapısını kullanır. macOS'un varsayılan derleyicisidir, Linux'ta da yaygın kullanılır.</p>

<div class="code-block">
    <div class="code-block-header"><span>Clang kullanımı</span></div>
    <pre><code><span class="comment"># GCC ile aynı flagları kabul eder:</span>
<span class="prompt">$</span> <span class="command">clang</span> <span class="argument">main.c</span> <span class="flag">-o</span> <span class="path">program</span>
<span class="prompt">$</span> <span class="command">clang++</span> <span class="argument">main.cpp</span> <span class="flag">-std=c++17 -Wall -o</span> <span class="path">program</span>

<span class="comment"># Clang'ın hata mesajları çok daha okunabilir:</span>
<span class="prompt">$</span> <span class="command">clang</span> <span class="argument">error.c</span>
error.c:5:12: error: use of undeclared identifier 'prntf'
    return prntf("Hello");
           ^~~~~
           printf      <span class="comment">← Clang düzeltme önerir!</span>

<span class="comment"># Static analiz (hata tarama):</span>
<span class="prompt">$</span> <span class="command">clang</span> <span class="flag">--analyze</span> <span class="argument">main.c</span>

<span class="comment"># AddressSanitizer (bellek hataları):</span>
<span class="prompt">$</span> <span class="command">clang</span> <span class="flag">-fsanitize=address -g</span> <span class="argument">main.c</span> <span class="flag">-o</span> <span class="path">prog</span></code></pre>
</div>

<h2>Make ve CMake — Derleme Otomasyonu</h2>
<div class="code-block">
    <div class="code-block-header"><span>Basit Makefile örneği</span></div>
    <pre><code><span class="comment"># Makefile</span>
CC = gcc
CFLAGS = -Wall -Wextra -g -std=c11

SRCS = main.c utils.c math.c
OBJS = $(SRCS:.c=.o)
TARGET = program

$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)

.PHONY: clean</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Make komutları</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">make</span>                <span class="comment"># Varsayılan hedefi derle</span>
<span class="prompt">$</span> <span class="command">make</span> <span class="argument">clean</span>          <span class="comment"># Temizle</span>
<span class="prompt">$</span> <span class="command">make</span> <span class="flag">-j$(nproc)</span>     <span class="comment"># Paralel derleme (çok çekirdekli)</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Basit CMakeLists.txt</span></div>
    <pre><code>cmake_minimum_required(VERSION 3.10)
project(MyProject LANGUAGES C)

set(CMAKE_C_STANDARD 11)
add_executable(program main.c utils.c math.c)</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>CMake ile derleme</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">mkdir</span> build && <span class="command">cd</span> build
<span class="prompt">$</span> <span class="command">cmake</span> <span class="argument">..</span>
<span class="prompt">$</span> <span class="command">make</span> <span class="flag">-j$(nproc)</span></code></pre>
</div>

<h2>Go — Derlenen Modern Dil</h2>
<p>Go (Golang), Google tarafından geliştirilmiş, <strong>statik olarak bağlanmış tek binary</strong> üreten bir dildir. Derleme son derece hızlıdır.</p>

<div class="code-block">
    <div class="code-block-header"><span>Go geliştirme</span></div>
    <pre><code><span class="comment"># Go kurulumu (resmi yöntem):</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="argument">https://go.dev/dl/go1.22.0.linux-amd64.tar.gz</span>
<span class="prompt">$</span> <span class="command">sudo tar -C /usr/local -xzf</span> <span class="argument">go1.22.0.linux-amd64.tar.gz</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">'export PATH=$PATH:/usr/local/go/bin'</span> >> <span class="path">~/.bashrc</span>
<span class="prompt">$</span> <span class="command">source</span> <span class="path">~/.bashrc</span>

<span class="comment"># Versiyon kontrol:</span>
<span class="prompt">$</span> <span class="command">go version</span>
go version go1.22.0 linux/amd64

<span class="comment"># Yeni proje başlat:</span>
<span class="prompt">$</span> <span class="command">mkdir</span> myproject && <span class="command">cd</span> myproject
<span class="prompt">$</span> <span class="command">go mod init</span> <span class="argument">github.com/user/myproject</span>

<span class="comment"># Derle ve çalıştır:</span>
<span class="prompt">$</span> <span class="command">go run</span> <span class="argument">main.go</span>            <span class="comment"># Derle + çalıştır (geçici)</span>
<span class="prompt">$</span> <span class="command">go build</span> <span class="flag">-o</span> <span class="path">app</span>          <span class="comment"># Binary oluştur</span>
<span class="prompt">$</span> <span class="command">./app</span>

<span class="comment"># Çapraz derleme (cross-compile) — çok kolay:</span>
<span class="prompt">$</span> <span class="command">GOOS=windows GOARCH=amd64 go build</span> <span class="flag">-o</span> <span class="path">app.exe</span>
<span class="prompt">$</span> <span class="command">GOOS=darwin GOARCH=arm64 go build</span> <span class="flag">-o</span> <span class="path">app-mac</span>

<span class="comment"># Test:</span>
<span class="prompt">$</span> <span class="command">go test</span> <span class="argument">./...</span></code></pre>
</div>

<h2>Python ve pip</h2>
<p>Python, en yaygın kullanılan yorumlanmış dillerden biridir. Linux'ta genellikle önceden yüklüdür.</p>

<div class="code-block">
    <div class="code-block-header"><span>Python geliştirme</span></div>
    <pre><code><span class="comment"># Python versiyonları:</span>
<span class="prompt">$</span> <span class="command">python3 --version</span>
Python 3.12.1

<span class="comment"># Script çalıştır:</span>
<span class="prompt">$</span> <span class="command">python3</span> <span class="argument">script.py</span>

<span class="comment"># İnteraktif kabuk:</span>
<span class="prompt">$</span> <span class="command">python3</span>
>>> print("Merhaba!")
>>> exit()

<span class="comment"># pip ile paket yönetimi:</span>
<span class="prompt">$</span> <span class="command">pip3 install</span> <span class="argument">requests flask numpy</span>
<span class="prompt">$</span> <span class="command">pip3 list</span>                <span class="comment"># Kurulu paketler</span>
<span class="prompt">$</span> <span class="command">pip3 show</span> <span class="argument">requests</span>      <span class="comment"># Paket bilgisi</span>
<span class="prompt">$</span> <span class="command">pip3 uninstall</span> <span class="argument">flask</span>    <span class="comment"># Kaldır</span>

<span class="comment"># requirements.txt ile bağımlılık yönetimi:</span>
<span class="prompt">$</span> <span class="command">pip3 freeze</span> > <span class="path">requirements.txt</span>
<span class="prompt">$</span> <span class="command">pip3 install</span> <span class="flag">-r</span> <span class="path">requirements.txt</span></code></pre>
</div>

<h3>Virtual Environment (Sanal Ortam)</h3>
<div class="info-box warning">
    <div class="info-box-title">⚠️ Sistem Python'una Paket Kurmayın!</div>
    <code>sudo pip install</code> yapmak sistemi bozabilir. Her zaman <strong>sanal ortam</strong> (virtual environment) kullanın.
</div>

<div class="code-block">
    <div class="code-block-header"><span>Python venv</span></div>
    <pre><code><span class="comment"># Sanal ortam oluştur:</span>
<span class="prompt">$</span> <span class="command">python3 -m venv</span> <span class="path">myenv</span>

<span class="comment"># Aktive et:</span>
<span class="prompt">$</span> <span class="command">source</span> <span class="path">myenv/bin/activate</span>
<span class="prompt">(myenv) $</span> <span class="comment"># Prompt değişir — artık izole ortamdasınız</span>

<span class="comment"># Artık güvenle pip kullanabilirsiniz:</span>
<span class="prompt">(myenv) $</span> <span class="command">pip install</span> <span class="argument">django</span>

<span class="comment"># Deaktive et:</span>
<span class="prompt">(myenv) $</span> <span class="command">deactivate</span></code></pre>
</div>

<h3>pyenv — Python Versiyon Yöneticisi</h3>
<div class="code-block">
    <div class="code-block-header"><span>pyenv ile birden fazla Python versiyonu</span></div>
    <pre><code><span class="comment"># pyenv kur:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="argument">https://pyenv.run</span> | <span class="command">bash</span>

<span class="comment"># ~/.bashrc'ye ekle:</span>
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"

<span class="comment"># Kullanılabilir versiyonları listele:</span>
<span class="prompt">$</span> <span class="command">pyenv install</span> <span class="flag">--list</span> | grep <span class="string">"3\\.1[2-3]"</span>

<span class="comment"># Versiyon kur ve kullan:</span>
<span class="prompt">$</span> <span class="command">pyenv install</span> <span class="argument">3.12.1</span>
<span class="prompt">$</span> <span class="command">pyenv global</span> <span class="argument">3.12.1</span>     <span class="comment"># Sistem geneli</span>
<span class="prompt">$</span> <span class="command">pyenv local</span> <span class="argument">3.11.7</span>      <span class="comment"># Proje bazlı (.python-version dosyası oluşturur)</span></code></pre>
</div>

<h2>Node.js ve npm</h2>
<p>Node.js, JavaScript'i tarayıcı dışında çalıştıran bir runtime'dır. npm (Node Package Manager), dünyanın en büyük paket ekosistemidir.</p>

<div class="code-block">
    <div class="code-block-header"><span>Node.js geliştirme</span></div>
    <pre><code><span class="comment"># nvm (Node Version Manager) ile kurulum — ÖNERİLEN YOL:</span>
<span class="prompt">$</span> <span class="command">curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh</span> | <span class="command">bash</span>
<span class="prompt">$</span> <span class="command">source</span> <span class="path">~/.bashrc</span>

<span class="comment"># Node.js kur:</span>
<span class="prompt">$</span> <span class="command">nvm install</span> <span class="argument">--lts</span>        <span class="comment"># En son LTS versiyonunu kur</span>
<span class="prompt">$</span> <span class="command">nvm install</span> <span class="argument">20</span>           <span class="comment"># Belirli bir versiyon</span>
<span class="prompt">$</span> <span class="command">nvm use</span> <span class="argument">20</span>               <span class="comment"># Aktif versiyonu değiştir</span>
<span class="prompt">$</span> <span class="command">nvm ls</span>                   <span class="comment"># Kurulu versiyonları listele</span>

<span class="comment"># Versiyon kontrol:</span>
<span class="prompt">$</span> <span class="command">node --version</span>
v20.11.0
<span class="prompt">$</span> <span class="command">npm --version</span>
10.2.0

<span class="comment"># Script çalıştır:</span>
<span class="prompt">$</span> <span class="command">node</span> <span class="argument">app.js</span>

<span class="comment"># Proje başlat:</span>
<span class="prompt">$</span> <span class="command">npm init</span> <span class="flag">-y</span>             <span class="comment"># package.json oluştur</span>

<span class="comment"># Paket kur:</span>
<span class="prompt">$</span> <span class="command">npm install</span> <span class="argument">express</span>                <span class="comment"># Proje bağımlılığı</span>
<span class="prompt">$</span> <span class="command">npm install</span> <span class="flag">-D</span> <span class="argument">eslint</span>             <span class="comment"># Dev bağımlılığı</span>
<span class="prompt">$</span> <span class="command">npm install</span> <span class="flag">-g</span> <span class="argument">typescript</span>         <span class="comment"># Global kurulum</span>

<span class="comment"># Paket kaldır:</span>
<span class="prompt">$</span> <span class="command">npm uninstall</span> <span class="argument">express</span>

<span class="comment"># Güvenlik denetimi:</span>
<span class="prompt">$</span> <span class="command">npm audit</span>
<span class="prompt">$</span> <span class="command">npm audit fix</span></code></pre>
</div>

<h2>Rust — Cargo</h2>
<div class="code-block">
    <div class="code-block-header"><span>Rust ile geliştirme</span></div>
    <pre><code><span class="comment"># Rust kurulumu (rustup):</span>
<span class="prompt">$</span> <span class="command">curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs</span> | <span class="command">sh</span>
<span class="prompt">$</span> <span class="command">source</span> <span class="path">~/.cargo/env</span>

<span class="comment"># Proje oluştur:</span>
<span class="prompt">$</span> <span class="command">cargo new</span> <span class="argument">myproject</span>
<span class="prompt">$</span> <span class="command">cd</span> myproject

<span class="comment"># Derle ve çalıştır:</span>
<span class="prompt">$</span> <span class="command">cargo run</span>            <span class="comment"># Derle + çalıştır</span>
<span class="prompt">$</span> <span class="command">cargo build</span>          <span class="comment"># Sadece derle (debug)</span>
<span class="prompt">$</span> <span class="command">cargo build</span> <span class="flag">--release</span>  <span class="comment"># Optimize edilmiş derleme</span>
<span class="prompt">$</span> <span class="command">cargo test</span>           <span class="comment"># Testleri çalıştır</span></code></pre>
</div>

<h2>Statik vs Dinamik Bağlama</h2>
<table>
    <tr><th>Özellik</th><th>Statik (Static Linking)</th><th>Dinamik (Dynamic Linking)</th></tr>
    <tr><td>Dosya</td><td>.a (archive)</td><td>.so (shared object)</td></tr>
    <tr><td>Boyut</td><td>Büyük (kütüphaneler dahil)</td><td>Küçük (paylaşılan kütüphaneler)</td></tr>
    <tr><td>Taşınabilirlik</td><td>Yüksek (her şey içinde)</td><td>Düşük (kütüphaneler lazım)</td></tr>
    <tr><td>Güncelleme</td><td>Yeniden derleme gerekir</td><td>Kütüphane güncellenir, program güncellenmez</td></tr>
    <tr><td>Bellek</td><td>Her program kendi kopyasını taşır</td><td>Programlar kütüphaneyi paylaşır</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>Bağlama inceleme</span></div>
    <pre><code><span class="comment"># Bir programın dinamik bağımlılıklarını göster:</span>
<span class="prompt">$</span> <span class="command">ldd</span> <span class="path">/usr/bin/git</span>
	linux-vdso.so.1
	libpcre2-8.so.0 => /lib/x86_64-linux-gnu/libpcre2-8.so.0
	libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6
	...

<span class="comment"># Go binary'sine bakın — bağımlılık yok (statik):</span>
<span class="prompt">$</span> <span class="command">ldd</span> <span class="path">./go-app</span>
	not a dynamic executable    <span class="comment">← Tamamen bağımsız!</span></code></pre>
</div>

<h2>Geliştirme Araçları Kurulum Özeti</h2>
<div class="code-block">
    <div class="code-block-header"><span>Ubuntu/Debian — geliştirme ortamı hazırlığı</span></div>
    <pre><code><span class="comment"># Temel geliştirme araçları:</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> <span class="argument">build-essential</span>   <span class="comment"># gcc, g++, make, libc-dev</span>

<span class="comment"># Clang:</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> <span class="argument">clang</span>

<span class="comment"># CMake:</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> <span class="argument">cmake</span>

<span class="comment"># Python geliştirme:</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> <span class="argument">python3 python3-pip python3-venv</span>

<span class="comment"># Go: resmi siteden kurun (depo sürümü genelde eski)</span>
<span class="comment"># Node.js: nvm ile kurun (depo sürümü genelde eski)</span>
<span class="comment"># Rust: rustup ile kurun</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Fedora — geliştirme ortamı hazırlığı</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">sudo dnf groupinstall</span> <span class="string">"Development Tools"</span>
<span class="prompt">$</span> <span class="command">sudo dnf install</span> <span class="argument">clang cmake python3 python3-pip</span></code></pre>
</div>

<h2>Dış Kaynaklar</h2>
<div class="info-box tip">
    <div class="info-box-title">📚 İleri Okuma</div>
    <ul>
        <li><a href="https://gcc.gnu.org/onlinedocs/" target="_blank" rel="noopener">GCC Documentation</a> — GCC resmi belgeleri</li>
        <li><a href="https://clang.llvm.org/docs/" target="_blank" rel="noopener">Clang Documentation</a> — Clang kullanım kılavuzu</li>
        <li><a href="https://go.dev/doc/" target="_blank" rel="noopener">Go Documentation</a> — Go dili resmi belgeleri</li>
        <li><a href="https://docs.python.org/3/" target="_blank" rel="noopener">Python Documentation</a> — Python 3 resmi belgeleri</li>
        <li><a href="https://nodejs.org/en/docs" target="_blank" rel="noopener">Node.js Documentation</a> — Node.js belgeleri</li>
        <li><a href="https://makefiletutorial.com/" target="_blank" rel="noopener">Makefile Tutorial</a> — Make öğrenmek için harika kaynak</li>
    </ul>
</div>
`,
    quiz: [
        {
            question: "C derleme sürecinin doğru sırası hangisidir?",
            options: ["Derleme → Ön İşleme → Montaj → Bağlama", "Ön İşleme → Derleme → Montaj → Bağlama", "Montaj → Derleme → Bağlama → Ön İşleme", "Bağlama → Ön İşleme → Montaj → Derleme"],
            correct: 1,
            explanation: "Sıra: Ön İşleme (Preprocessing, -E) → Derleme (Compilation, -S) → Montaj (Assembly, -c) → Bağlama (Linking). Kısaca: kaynak → assembly → object → executable."
        },
        {
            question: "'gcc -Wall -Wextra' flagları ne yapar?",
            options: ["Programı duvar kağıdı yapar", "Tüm uyarıları (warnings) aktifleştirir", "Optimizasyonu artırır", "Debug bilgisi ekler"],
            correct: 1,
            explanation: "-Wall 'tüm uyarılar' (warnings all), -Wextra ise ekstra uyarılar anlamına gelir. Her zaman kullanılması önerilir."
        },
        {
            question: "Python'da 'sudo pip install' neden tehlikelidir?",
            options: ["Çok yavaştır", "Sistem Python paketlerini bozabilir", "Root şifresi gerektirir diye", "pip zaten root'tur"],
            correct: 1,
            explanation: "Sistem Python'una paket kurmak, dağıtımın kendi Python paketleriyle çakışabilir. Her zaman virtual environment (venv) kullanın."
        },
        {
            question: "Go'nun derleme açısından özel özelliği nedir?",
            options: ["Sadece Linux'ta derlenir", "Statik bağlanmış tek binary üretir", "Derleme çok yavaştır", "Sadece 64-bit destekler"],
            correct: 1,
            explanation: "Go, statik olarak bağlanmış tek bir binary üretir — hiçbir dış bağımlılığa ihtiyaç duymaz. Bu, dağıtımı çok kolaylaştırır."
        },
        {
            question: "nvm ne işe yarar?",
            options: ["Node paketlerini yönetir", "Farklı Node.js versiyonlarını yönetir", "npm'in alternatifidir", "Node uygulamalarını izler"],
            correct: 1,
            explanation: "nvm (Node Version Manager), farklı Node.js versiyonlarını kurup aralarında geçiş yapmanızı sağlar — tıpkı pyenv gibi."
        },
        {
            question: "Statik ve dinamik bağlama arasındaki temel fark nedir?",
            options: ["Statik daha hızlı derlenir", "Dinamik bağlama kütüphaneyi dosyaya gömer", "Statik bağlama kütüphaneyi dosyaya gömer", "Hiçbir fark yoktur"],
            correct: 2,
            explanation: "Statik bağlamada kütüphane kodu binary'ye gömülür (büyük dosya, bağımsız). Dinamik bağlamada çalışma zamanında paylaşılan kütüphaneler (.so) aranır."
        },
        {
            question: "'ldd /usr/bin/git' komutu ne gösterir?",
            options: ["Git'in kaynak kodunu", "Git'in dinamik kütüphane bağımlılıklarını", "Git'in versiyon geçmişini", "Git'in lisans bilgisini"],
            correct: 1,
            explanation: "ldd (List Dynamic Dependencies), bir programın çalışma zamanında ihtiyaç duyduğu paylaşılan kütüphaneleri (.so dosyaları) listeler."
        }
    ]
});
