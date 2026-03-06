// ===== Bölüm 15: Kabuk Yapılandırma Dosyaları =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 15,
    title: 'Kabuk Yapılandırma Dosyaları',
    subtitle: 'Shell Configuration Files',
    icon: '⚙️',
    description: '.bashrc, .bash_profile, .profile ve diğer özel dosyalar: kabuğunuzu özelleştirin, alias tanımlayın, PATH yönetimi ve ortam değişkenleri.',
    content: `
<h2>Kabuk Başlatma Dosyaları Nedir?</h2>
<p>Bir terminal açtığınızda veya SSH ile bağlandığınızda, Bash belirli dosyaları otomatik olarak okur ve çalıştırır. Bu dosyalar ortam değişkenleri, alias'lar, fonksiyonlar, PATH ayarları ve diğer özelleştirmeleri içerir. <strong>Hangi dosyanın okunacağı, kabuğun nasıl başlatıldığına bağlıdır.</strong></p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">Login Shell</span> = <span class="eng-meaning">Giriş Kabuğu</span> — Sisteme giriş yaparken (SSH, TTY) başlatılan kabuk.<br>
        <span class="eng-word">Interactive Shell</span> = <span class="eng-meaning">Etkileşimli Kabuk</span> — Kullanıcıdan komut bekleyen (terminal) kabuk.<br>
        <span class="eng-word">Non-interactive Shell</span> = <span class="eng-meaning">Etkileşimsiz Kabuk</span> — Script çalıştırırken kullanılan kabuk.<br>
        <span class="eng-word">Alias</span> = <span class="eng-meaning">Takma Ad</span> — Bir komut için kısa ad tanımlama.<br>
        <span class="eng-word">Environment Variable</span> = <span class="eng-meaning">Ortam Değişkeni</span> — Tüm süreçlerin erişebildiği değişken.<br>
        <span class="eng-word">PATH</span> = <span class="eng-meaning">Yol</span> — Çalıştırılabilir dosyaların arandığı dizinlerin listesi.<br>
        <span class="eng-word">Dotfile</span> = <span class="eng-meaning">Nokta Dosyası</span> — Nokta (.) ile başlayan gizli yapılandırma dosyası.
    </div>
</div>

<h2>Login Shell vs Non-Login Shell</h2>
<p>Bash'in yapılandırma dosyalarını anlamak için önce iki kavramı bilmek gerekir:</p>

<table>
    <tr><th>Tür</th><th>Nasıl Başlatılır?</th><th>Okunan Dosyalar</th><th>Örnek</th></tr>
    <tr>
        <td><strong>Login Shell</strong></td>
        <td>Sisteme giriş yapıldığında</td>
        <td><code>/etc/profile</code> → <code>~/.bash_profile</code> veya <code>~/.bash_login</code> veya <code>~/.profile</code></td>
        <td>SSH bağlantısı, TTY giriş, <code>su - kullanici</code></td>
    </tr>
    <tr>
        <td><strong>Non-Login Interactive Shell</strong></td>
        <td>Terminal emülatörü açıldığında</td>
        <td><code>~/.bashrc</code></td>
        <td>GNOME Terminal, Konsole, xterm açma</td>
    </tr>
    <tr>
        <td><strong>Non-Interactive Shell</strong></td>
        <td>Script çalıştırıldığında</td>
        <td><code>$BASH_ENV</code> (tanımlıysa)</td>
        <td><code>bash script.sh</code>, cron işleri</td>
    </tr>
</table>

<img src="img/shell_startup_files.svg" alt="Shell Başlangıç Dosyaları Akış Diyagramı" style="max-width:100%; margin: 1.5rem 0; border-radius: 8px;">

<div class="info-box note">
    <div class="info-box-title">📌 Kabuğunuz Login mi?</div>
    <code>echo $0</code> — Eğer <code>-bash</code> (tire ile başlıyorsa) login shell'dir, <code>bash</code> ise non-login.<br>
    <code>shopt login_shell</code> — Doğrudan kontrol: <code>on</code> ise login shell.
</div>

<h2>Yapılandırma Dosyaları Detaylı</h2>

<h3>/etc/profile — Sistem Geneli Login Ayarları</h3>
<p>Tüm kullanıcılar için geçerli olan login shell ayarları. Sistem yöneticisi tarafından düzenlenir.</p>
<div class="code-block">
    <div class="code-block-header"><span>/etc/profile (tipik içerik)</span></div>
    <pre><code><span class="comment"># Sistem geneli ortam değişkenleri</span>
export PATH="/usr/local/bin:/usr/bin:/bin"
export EDITOR="vim"

<span class="comment"># /etc/profile.d/ altındaki tüm .sh dosyalarını çalıştır</span>
for i in /etc/profile.d/*.sh; do
    if [ -r "$i" ]; then
        . "$i"
    fi
done</code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 /etc/profile.d/ Dizini</div>
    Sistem geneli ayarlar eklemek istiyorsanız <code>/etc/profile</code> dosyasını doğrudan düzenlemek yerine <code>/etc/profile.d/</code> altına <code>.sh</code> dosyası ekleyin. Bu daha düzenli ve güvenlidir. Örneğin: <code>/etc/profile.d/custom-path.sh</code>
</div>

<h3>~/.bash_profile — Kişisel Login Ayarları</h3>
<p>Login shell açıldığında çalışır. Genellikle ortam değişkenleri burada tanımlanır ve <code>.bashrc</code>'yi source eder:</p>
<div class="code-block">
    <div class="code-block-header"><span>~/.bash_profile (tipik yapı)</span></div>
    <pre><code><span class="comment"># ~/.bash_profile</span>

<span class="comment"># Ortam değişkenleri (login'e özgü)</span>
export GOPATH="$HOME/go"
export CARGO_HOME="$HOME/.cargo"
export PATH="$HOME/.local/bin:$GOPATH/bin:$CARGO_HOME/bin:$PATH"

<span class="comment"># .bashrc'yi yükle (etkileşimli ayarlar her zaman çalışsın)</span>
if [ -f ~/.bashrc ]; then
    source ~/.bashrc     <span class="comment"># veya: . ~/.bashrc</span>
fi</code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Dosya Öncelik Sırası</div>
    Login shell'de Bash şu sırayla arar ve <strong>ilk bulduğunu çalıştırır</strong>:<br>
    <code>~/.bash_profile</code> → <code>~/.bash_login</code> → <code>~/.profile</code><br>
    Yani <code>.bash_profile</code> varsa <code>.profile</code> okunmaz! Bu yüzden <code>.bash_profile</code> içinde <code>.bashrc</code>'yi source etmek önemlidir.
</div>

<h3>~/.profile — Genel Login Ayarları</h3>
<p>Bash'e özel değildir — sh, dash gibi kabuklar da okur. <code>.bash_profile</code> yoksa Bash bunu okur. Debian/Ubuntu sistemlerde varsayılan olarak bu dosya bulunur:</p>
<div class="code-block">
    <div class="code-block-header"><span>~/.profile (Debian/Ubuntu varsayılanı)</span></div>
    <pre><code><span class="comment"># ~/.profile: login shell'ler tarafından okunur</span>

<span class="comment"># .bashrc varsa yükle</span>
if [ -n "$BASH_VERSION" ]; then
    if [ -f "$HOME/.bashrc" ]; then
        . "$HOME/.bashrc"
    fi
fi

<span class="comment"># Kullanıcı bin dizinini PATH'e ekle</span>
if [ -d "$HOME/bin" ]; then
    PATH="$HOME/bin:$PATH"
fi

if [ -d "$HOME/.local/bin" ]; then
    PATH="$HOME/.local/bin:$PATH"
fi</code></pre>
</div>

<h3>~/.bashrc — Etkileşimli Kabuk Ayarları</h3>
<p>Her etkileşimli non-login shell'de çalışır. <strong>En sık düzenlenen dosyadır.</strong> Alias'lar, fonksiyonlar, prompt özelleştirmeleri ve tamamlama ayarları burada tanımlanır.</p>
<div class="code-block">
    <div class="code-block-header"><span>~/.bashrc (kapsamlı örnek)</span></div>
    <pre><code><span class="comment">#!/bin/bash</span>
<span class="comment"># ~/.bashrc — Etkileşimli kabuk yapılandırması</span>

<span class="comment"># Etkileşimli değilse çık</span>
case $- in
    *i*) ;;
      *) return;;
esac

<span class="comment"># ========== GEÇMİŞ AYARLARI ==========</span>
HISTSIZE=10000                   <span class="comment"># Bellekteki geçmiş boyutu</span>
HISTFILESIZE=20000               <span class="comment"># Dosyadaki geçmiş boyutu</span>
HISTCONTROL=ignoreboth           <span class="comment"># Tekrar ve boşlukla başlayanları atla</span>
HISTIGNORE="ls:cd:pwd:exit:clear" <span class="comment"># Bu komutları kaydetme</span>
HISTTIMEFORMAT="%F %T "         <span class="comment"># Zaman damgası ekle</span>
shopt -s histappend              <span class="comment"># Geçmişe ekle, üzerine yazma</span>

<span class="comment"># ========== KABUK SEÇENEKLERİ ==========</span>
shopt -s checkwinsize   <span class="comment"># Pencere boyutu değişikliklerini algıla</span>
shopt -s globstar       <span class="comment"># ** ile özyinelemeli glob</span>
shopt -s cdspell        <span class="comment"># cd yazım hatalarını düzelt</span>
shopt -s autocd         <span class="comment"># Dizin adı yazınca otomatik cd</span>
shopt -s dirspell       <span class="comment"># Dizin adı tamamlamada yazım düzeltme</span>

<span class="comment"># ========== ALIAS'LAR ==========</span>
alias ll='ls -alF --color=auto'
alias la='ls -A --color=auto'
alias l='ls -CF --color=auto'
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'
alias mkdir='mkdir -pv'          <span class="comment"># Her zaman parent oluştur ve göster</span>
alias df='df -h'                 <span class="comment"># Okunabilir boyutlar</span>
alias du='du -h'
alias free='free -h'
alias ports='ss -tulanp'        <span class="comment"># Açık portları listele</span>
alias myip='curl -s ifconfig.me' <span class="comment"># Dış IP adresini göster</span>

<span class="comment"># Git alias'ları</span>
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline --graph --all'
alias gd='git diff'

<span class="comment"># Güvenlik alias'ları (tehlikeli komutlarda onay iste)</span>
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

<span class="comment"># ========== PROMPT ÖZELLEŞTIRME ==========</span>
<span class="comment"># Git dalını prompt'ta göster</span>
parse_git_branch() {
    git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \\(.*\\)/ (\\1)/'
}

<span class="comment"># Renkli ve bilgilendirici prompt</span>
PS1='\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[33m\\]$(parse_git_branch)\\[\\033[00m\\]\\$ '

<span class="comment"># ========== FONKSİYONLAR ==========</span>
<span class="comment"># Dizin oluştur ve gir</span>
mkcd() {
    mkdir -p "$1" && cd "$1"
}

<span class="comment"># Bir dosyanın yedeğini al</span>
backup() {
    cp "$1" "$1.bak.$(date +%Y%m%d_%H%M%S)"
}

<span class="comment"># Arşivi türüne göre aç</span>
extract() {
    if [ -f "$1" ]; then
        case "$1" in
            *.tar.bz2)  tar xjf "$1" ;;
            *.tar.gz)   tar xzf "$1" ;;
            *.tar.xz)   tar xJf "$1" ;;
            *.bz2)      bunzip2 "$1" ;;
            *.gz)       gunzip "$1" ;;
            *.tar)      tar xf "$1" ;;
            *.tbz2)     tar xjf "$1" ;;
            *.tgz)      tar xzf "$1" ;;
            *.zip)      unzip "$1" ;;
            *.7z)       7z x "$1" ;;
            *.rar)      unrar x "$1" ;;
            *)          echo "'$1' bilinmeyen arşiv formatı" ;;
        esac
    else
        echo "'$1' geçerli bir dosya değil"
    fi
}

<span class="comment"># ========== TAMAMLAMA ==========</span>
<span class="comment"># Bash tamamlama sistemini yükle</span>
if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
fi

<span class="comment"># ========== HARICI ARAÇLAR ==========</span>
<span class="comment"># Node Version Manager (nvm)</span>
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

<span class="comment"># fzf (fuzzy finder) entegrasyonu</span>
[ -f ~/.fzf.bash ] && source ~/.fzf.bash</code></pre>
</div>

<h3>~/.bash_logout — Çıkış Betiği</h3>
<p>Login shell sonlandırıldığında çalışır:</p>
<div class="code-block">
    <div class="code-block-header"><span>~/.bash_logout</span></div>
    <pre><code><span class="comment"># Ekranı temizle (terminal gizlilik)</span>
clear

<span class="comment"># Geçici dosyaları sil</span>
rm -rf ~/tmp/*

<span class="comment"># Veda mesajı</span>
echo "Güle güle, $(whoami)! Oturum kapatıldı: $(date)"</code></pre>
</div>

<h2>Ortam Değişkenleri (Environment Variables)</h2>
<p>Ortam değişkenleri, tüm süreçlerin erişebildiği anahtar-değer çiftleridir.</p>

<div class="code-block">
    <div class="code-block-header"><span>Ortam değişkenleri yönetimi</span></div>
    <pre><code><span class="comment"># Tüm ortam değişkenlerini göster:</span>
<span class="prompt">$</span> <span class="command">env</span>
<span class="prompt">$</span> <span class="command">printenv</span>

<span class="comment"># Belirli bir değişkeni göster:</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="argument">$HOME</span>
<span class="prompt">$</span> <span class="command">printenv</span> HOME

<span class="comment"># Değişken tanımlama (sadece mevcut shell):</span>
<span class="prompt">$</span> MESAJ="Merhaba"

<span class="comment"># Dışa aktarma (alt süreçler de görsün):</span>
<span class="prompt">$</span> <span class="command">export</span> MESAJ="Merhaba"

<span class="comment"># Kalıcı tanımlama (~/.bashrc'ye ekle):</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">'export EDITOR="vim"'</span> >> ~/.bashrc

<span class="comment"># Değişkeni silme:</span>
<span class="prompt">$</span> <span class="command">unset</span> MESAJ</code></pre>
</div>

<h3>Önemli Ortam Değişkenleri</h3>
<table>
    <tr><th>Değişken</th><th>Açıklama</th><th>Örnek Değer</th></tr>
    <tr><td><code>HOME</code></td><td>Ev dizini</td><td>/home/ali</td></tr>
    <tr><td><code>USER</code></td><td>Kullanıcı adı</td><td>ali</td></tr>
    <tr><td><code>SHELL</code></td><td>Kullanılan kabuk</td><td>/bin/bash</td></tr>
    <tr><td><code>PATH</code></td><td>Komut arama yolları</td><td>/usr/local/bin:/usr/bin:/bin</td></tr>
    <tr><td><code>EDITOR</code></td><td>Varsayılan metin editörü</td><td>vim</td></tr>
    <tr><td><code>LANG</code></td><td>Dil ve yerel ayar</td><td>tr_TR.UTF-8</td></tr>
    <tr><td><code>TERM</code></td><td>Terminal türü</td><td>xterm-256color</td></tr>
    <tr><td><code>PS1</code></td><td>Birincil prompt</td><td>\\u@\\h:\\w\\$</td></tr>
    <tr><td><code>HISTSIZE</code></td><td>Komut geçmişi boyutu</td><td>1000</td></tr>
    <tr><td><code>DISPLAY</code></td><td>X11 görüntü sunucusu</td><td>:0</td></tr>
    <tr><td><code>XDG_CONFIG_HOME</code></td><td>Kullanıcı yapılandırma dizini</td><td>~/.config</td></tr>
    <tr><td><code>XDG_DATA_HOME</code></td><td>Kullanıcı veri dizini</td><td>~/.local/share</td></tr>
</table>

<h2>PATH Yönetimi</h2>
<p><code>PATH</code>, bir komut yazdığınızda kabuğun çalıştırılabilir dosyayı aradığı dizinlerin listesidir. İki nokta üst üste (<code>:</code>) ile ayrılır.</p>

<div class="code-block">
    <div class="code-block-header"><span>PATH ile çalışma</span></div>
    <pre><code><span class="comment"># Mevcut PATH'i göster:</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="argument">$PATH</span>
/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin

<span class="comment"># PATH'e dizin ekleme (sona):</span>
<span class="prompt">$</span> <span class="command">export</span> PATH="$PATH:$HOME/.local/bin"

<span class="comment"># PATH'e dizin ekleme (başa — öncelikli):</span>
<span class="prompt">$</span> <span class="command">export</span> PATH="$HOME/bin:$PATH"

<span class="comment"># Kalıcı yapmak için ~/.bashrc'ye ekleyin:</span>
<span class="command">export</span> PATH="$HOME/.local/bin:$PATH"

<span class="comment"># Bir komutun hangi PATH dizininden geldiğini gösterme:</span>
<span class="prompt">$</span> <span class="command">which</span> python3
/usr/bin/python3

<span class="prompt">$</span> <span class="command">type</span> -a python3  <span class="comment"># Tüm eşleşmeleri göster</span>
python3 is /usr/bin/python3
python3 is /usr/local/bin/python3</code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ PATH Güvenliği</div>
    <strong>Asla</strong> PATH'e mevcut dizini (<code>.</code>) eklemeyin: <code>export PATH=".:$PATH"</code> ❌<br>
    Bu, saldırganların zararlı komutları (örn. <code>./ls</code>) çalıştırmasına yol açabilir. Linux'ta mevcut dizindeki programları <code>./program</code> ile çalıştırmak bir güvenlik özelliğidir.
</div>

<h2>Prompt Özelleştirme (PS1)</h2>
<p><code>PS1</code> değişkeni terminal prompt'unuzu belirler. Özel escape kodları kullanılır:</p>
<table>
    <tr><th>Kod</th><th>Anlam</th><th>Örnek Çıktı</th></tr>
    <tr><td><code>\\u</code></td><td>Kullanıcı adı</td><td>ali</td></tr>
    <tr><td><code>\\h</code></td><td>Kısa bilgisayar adı</td><td>sunucu</td></tr>
    <tr><td><code>\\H</code></td><td>Tam bilgisayar adı</td><td>sunucu.example.com</td></tr>
    <tr><td><code>\\w</code></td><td>Çalışma dizini (tam)</td><td>~/projeler/web</td></tr>
    <tr><td><code>\\W</code></td><td>Çalışma dizini (sadece ad)</td><td>web</td></tr>
    <tr><td><code>\\d</code></td><td>Tarih</td><td>Cum Şub 28</td></tr>
    <tr><td><code>\\t</code></td><td>Saat (24 saat)</td><td>14:30:00</td></tr>
    <tr><td><code>\\$</code></td><td>$ (normal) veya # (root)</td><td>$</td></tr>
    <tr><td><code>\\n</code></td><td>Yeni satır</td><td>(satır sonu)</td></tr>
    <tr><td><code>\\!</code></td><td>Geçmiş numarası</td><td>501</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>Prompt örnekleri</span></div>
    <pre><code><span class="comment"># Basit:</span>
PS1='\\u@\\h:\\w\\$ '         <span class="comment"># ali@sunucu:~/proje$</span>

<span class="comment"># Renkli:</span>
PS1='\\[\\033[32m\\]\\u\\[\\033[0m\\]@\\[\\033[34m\\]\\h\\[\\033[0m\\]:\\w\\$ '

<span class="comment"># İki satırlı (uzun yollar için):</span>
PS1='\\n\\[\\033[1;33m\\]\\w\\[\\033[0m\\]\\n\\u@\\h\\$ '

<span class="comment"># Çıkış kodunu göster:</span>
PS1='[\\$?] \\u@\\h:\\w\\$ '  <span class="comment"># [0] ali@sunucu:~$ (0=başarılı)</span></code></pre>
</div>

<h2>Diğer Önemli Dotfile'lar</h2>

<h3>~/.inputrc — Readline Yapılandırması</h3>
<p>Komut satırı düzenleme davranışlarını kontrol eder:</p>
<div class="code-block">
    <div class="code-block-header"><span>~/.inputrc</span></div>
    <pre><code><span class="comment"># Büyük/küçük harf duyarsız tamamlama</span>
set completion-ignore-case on

<span class="comment"># Tamamlama da renkli gösterim</span>
set colored-stats on

<span class="comment"># Tek basışla tamamlama listesi göster</span>
set show-all-if-ambiguous on

<span class="comment"># Yukarı/aşağı ok ile geçmiş arama</span>
"\\e[A": history-search-backward
"\\e[B": history-search-forward

<span class="comment"># Dosya türüne göre gösterim (/ dizin, * çalıştırılabilir)</span>
set visible-stats on

<span class="comment"># Eşleşme sayısını sor (varsayılan: 100)</span>
set completion-query-items 200</code></pre>
</div>

<h3>~/.bash_aliases — Alias Dosyası</h3>
<p>Alias'ları ayrı dosyada tutmak <code>.bashrc</code>'yi düzenli tutar:</p>
<div class="code-block">
    <div class="code-block-header"><span>~/.bashrc'de yükleme</span></div>
    <pre><code><span class="comment"># .bash_aliases dosyasını yükle (varsa)</span>
if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi</code></pre>
</div>

<h3>XDG Base Directory Specification</h3>
<p>Modern Linux uygulamaları yapılandırmayı <code>~/.config/</code> altında tutar. Bu standarttır (XDG):</p>
<table>
    <tr><th>Değişken</th><th>Varsayılan</th><th>Kullanım</th></tr>
    <tr><td><code>XDG_CONFIG_HOME</code></td><td><code>~/.config</code></td><td>Kullanıcı yapılandırma dosyaları</td></tr>
    <tr><td><code>XDG_DATA_HOME</code></td><td><code>~/.local/share</code></td><td>Kullanıcı veri dosyaları</td></tr>
    <tr><td><code>XDG_CACHE_HOME</code></td><td><code>~/.cache</code></td><td>Önbellek dosyaları</td></tr>
    <tr><td><code>XDG_STATE_HOME</code></td><td><code>~/.local/state</code></td><td>Durum dosyaları (loglar, geçmiş)</td></tr>
</table>

<h2>Zsh Yapılandırması</h2>
<p>macOS varsayılan kabuğu Zsh için yapılandırma dosyaları:</p>
<table>
    <tr><th>Dosya</th><th>Bash Karşılığı</th><th>Kısaca</th></tr>
    <tr><td><code>~/.zshenv</code></td><td>—</td><td>Her zaman okunur (env değişkenleri)</td></tr>
    <tr><td><code>~/.zprofile</code></td><td><code>~/.bash_profile</code></td><td>Login shell ayarları</td></tr>
    <tr><td><code>~/.zshrc</code></td><td><code>~/.bashrc</code></td><td>Etkileşimli kabuk ayarları</td></tr>
    <tr><td><code>~/.zlogin</code></td><td><code>~/.bash_login</code></td><td>Login sonrası (zprofile'dan sonra)</td></tr>
    <tr><td><code>~/.zlogout</code></td><td><code>~/.bash_logout</code></td><td>Çıkışta çalıştırılır</td></tr>
</table>

<h2>Değişiklikleri Uygulama</h2>
<div class="code-block">
    <div class="code-block-header"><span>Değişiklikleri yükleme</span></div>
    <pre><code><span class="comment"># Dosyayı tekrar yükle (source):</span>
<span class="prompt">$</span> <span class="command">source</span> ~/.bashrc
<span class="comment"># veya kısa hali:</span>
<span class="prompt">$</span> <span class="command">.</span> ~/.bashrc

<span class="comment"># NOT: source ile yükleme mevcut oturumu etkiler.</span>
<span class="comment"># Yeni terminal açmak da değişiklikleri uygular.</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Pratikte En İyi Yaklaşım</div>
    <strong>1.</strong> Ortam değişkenlerini ve PATH'i <code>~/.bash_profile</code> (veya <code>~/.profile</code>) dosyasına koyun.<br>
    <strong>2.</strong> Alias'ları, fonksiyonları ve prompt'u <code>~/.bashrc</code>'ye koyun.<br>
    <strong>3.</strong> <code>.bash_profile</code> içinde <code>.bashrc</code>'yi source edin.<br>
    Bu şekilde hem login hem non-login shell'lerde tüm ayarlarınız çalışır.
</div>

<h2>Dış Kaynaklar</h2>
<div class="info-box tip">
    <div class="info-box-title">📚 İleri Okuma</div>
    <ul>
        <li><a href="https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html" target="_blank" rel="noopener">GNU Bash Manual — Startup Files</a> — Resmi Bash başlangıç dosyaları belgeleri</li>
        <li><a href="https://wiki.archlinux.org/title/Bash" target="_blank" rel="noopener">Arch Wiki — Bash</a> — Bash yapılandırması hakkında kapsamlı rehber</li>
        <li><a href="https://dotfiles.github.io/" target="_blank" rel="noopener">dotfiles.github.io</a> — Topluluk dotfile koleksiyonları ve ilham kaynakları</li>
        <li><a href="https://specifications.freedesktop.org/basedir-spec/latest/" target="_blank" rel="noopener">XDG Base Directory Specification</a> — Yapılandırma dizin standardı</li>
    </ul>
</div>
`,
    quiz: [
        {
            question: "SSH ile bağlandığınızda hangi tür shell başlatılır?",
            options: ["Non-login interactive shell", "Login shell", "Non-interactive shell", "Subshell"],
            correct: 1,
            explanation: "SSH bağlantısı bir login shell başlatır. Bu yüzden /etc/profile ve ~/.bash_profile okunur."
        },
        {
            question: "~/.bash_profile varsa, ~/.profile okunur mu?",
            options: ["Evet, ikisi de okunur", "Hayır, .bash_profile önceliklidir", "Sadece root kullanıcıda okunur", "Dağıtıma bağlı"],
            correct: 1,
            explanation: "Login shell'de Bash sırayla .bash_profile → .bash_login → .profile arar ve ilk bulduğunu çalıştırır."
        },
        {
            question: "Terminal emülatörü açtığınızda hangi dosya okunur?",
            options: ["~/.bash_profile", "~/.profile", "~/.bashrc", "/etc/profile"],
            correct: 2,
            explanation: "Terminal emülatörü non-login interactive shell başlatır, bu yüzden ~/.bashrc okunur."
        },
        {
            question: "PATH'e yeni dizin eklerken hangisi doğrudur?",
            options: ["PATH=dizin", "export PATH=\".:$PATH\"", "export PATH=\"$HOME/bin:$PATH\"", "set PATH dizin"],
            correct: 2,
            explanation: "export PATH=\"$HOME/bin:$PATH\" doğru sözdizimi. PATH başına eklemek o dizine öncelik verir. '.' eklenmesi güvenlik riski oluşturur."
        },
        {
            question: "'source ~/.bashrc' komutu ne yapar?",
            options: ["bashrc dosyasını siler", "bashrc dosyasını mevcut oturumda tekrar yükler", "Yeni terminal açar", "bashrc dosyasını düzenler"],
            correct: 1,
            explanation: "source komutu, dosyayı mevcut shell oturumunda çalıştırır. Değişiklikleri yeni terminal açmadan uygulamak için kullanılır."
        },
        {
            question: "Aşağıdakilerden hangisi PS1 prompt'unda kullanıcı adını gösterir?",
            options: ["\\\\h", "\\\\w", "\\\\u", "\\\\d"],
            correct: 2,
            explanation: "\\\\u kullanıcı adını, \\\\h bilgisayar adını, \\\\w çalışma dizinini, \\\\d tarihi gösterir."
        },
        {
            question: "HISTCONTROL=ignoreboth ayarı ne yapar?",
            options: ["Geçmişi tamamen kapatır", "Tekrar eden ve boşlukla başlayan komutları geçmişe kaydetmez", "Geçmişi şifreler", "Sadece hatalı komutları kaydeder"],
            correct: 1,
            explanation: "ignoreboth = ignorespace + ignoredups. Boşlukla başlayan komutları (gizlilik) ve ardışık tekrarları geçmişe kaydetmez."
        }
    ]
});
