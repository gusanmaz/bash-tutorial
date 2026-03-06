// ===== Bölüm 20: Paket Yöneticileri =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 20,
    title: 'Paket Yöneticileri',
    subtitle: 'Package Managers',
    icon: '📦',
    description: 'Linux paket yönetim sistemleri: APT (Debian/Ubuntu), DNF (Fedora/RHEL), Pacman (Arch), Zypper (openSUSE), Snap, Flatpak ve AppImage.',
    content: `
<h2>Paket Yönetimi Nedir?</h2>
<p>Linux'ta yazılım yüklemek, güncellemek ve kaldırmak <strong>paket yöneticileri</strong> aracılığıyla yapılır. Her dağıtım ailesinin kendi paket formatı ve yöneticisi vardır. Paket yöneticisi, yazılımın bağımlılıklarını otomatik çözer, güvenli indirme sağlar (GPG imza doğrulama) ve sistem tutarlılığını korur.</p>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">Package</span> = <span class="eng-meaning">Paket</span> — Yazılımın derlenmiş dosyaları, yapılandırması ve meta verileri.<br>
        <span class="eng-word">Repository (Repo)</span> = <span class="eng-meaning">Depo</span> — Paketlerin barındırıldığı sunucu.<br>
        <span class="eng-word">Dependency</span> = <span class="eng-meaning">Bağımlılık</span> — Bir paketin çalışması için gereken diğer paketler.<br>
        <span class="eng-word">GPG Signature</span> = <span class="eng-meaning">GPG İmzası</span> — Paketin kaynağını ve bütünlüğünü doğrulayan kriptografik imza.<br>
        <span class="eng-word">PPA</span> = <span class="eng-meaning">Personal Package Archive</span> — Ubuntu'da kişisel paket deposu.<br>
        <span class="eng-word">Rolling Release</span> = <span class="eng-meaning">Sürekli Güncelleme</span> — Versiyon yerine sürekli güncellenen model (Arch).<br>
        <span class="eng-word">LTS</span> = <span class="eng-meaning">Long Term Support</span> — Uzun süreli destek versiyonu (Ubuntu LTS).
    </div>
</div>

<h2>Paket Formatları ve Araçlar</h2>
<table>
    <tr><th>Dağıtım Ailesi</th><th>Paket Formatı</th><th>Düşük Seviye</th><th>Yüksek Seviye</th><th>Dağıtımlar</th></tr>
    <tr><td>Debian</td><td>.deb</td><td>dpkg</td><td><strong>apt</strong></td><td>Debian, Ubuntu, Mint, Pop!_OS</td></tr>
    <tr><td>Red Hat</td><td>.rpm</td><td>rpm</td><td><strong>dnf</strong> (eski: yum)</td><td>Fedora, RHEL, CentOS, Rocky, Alma</td></tr>
    <tr><td>Arch</td><td>.pkg.tar.zst</td><td>—</td><td><strong>pacman</strong></td><td>Arch, Manjaro, EndeavourOS</td></tr>
    <tr><td>SUSE</td><td>.rpm</td><td>rpm</td><td><strong>zypper</strong></td><td>openSUSE, SLES</td></tr>
    <tr><td>Alpine</td><td>.apk</td><td>—</td><td><strong>apk</strong></td><td>Alpine Linux (Docker'da yaygın)</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Düşük Seviye vs Yüksek Seviye</div>
    <strong>Düşük seviye (dpkg, rpm):</strong> Tek paketi kurar/kaldırır ama <em>bağımlılıkları çözmez</em>.<br>
    <strong>Yüksek seviye (apt, dnf, pacman):</strong> Bağımlılıkları otomatik çözer, depo yönetimi yapar, güncelleme sağlar. <em>Her zaman yüksek seviye aracı kullanın.</em>
</div>

<h2>APT — Debian / Ubuntu</h2>
<p><code>apt</code> (Advanced Package Tool), Debian tabanlı dağıtımların standart paket yöneticisidir. Dünyada en yaygın kullanılan Linux paket yöneticisidir.</p>

<div class="code-block">
    <div class="code-block-header"><span>APT temel komutlar</span></div>
    <pre><code><span class="comment"># Paket listesini güncelle (kurulum yapmaz, listeyi yeniler):</span>
<span class="prompt">$</span> <span class="command">sudo apt update</span>

<span class="comment"># Kurulu paketleri güncelle:</span>
<span class="prompt">$</span> <span class="command">sudo apt upgrade</span>

<span class="comment"># Tam güncelleme (bağımlılık değişiklikleri dahil):</span>
<span class="prompt">$</span> <span class="command">sudo apt full-upgrade</span>

<span class="comment"># Paket kur:</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> <span class="argument">vim git curl</span>

<span class="comment"># Onay sormadan kur:</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> <span class="flag">-y</span> <span class="argument">nginx</span>

<span class="comment"># Paket kaldır:</span>
<span class="prompt">$</span> <span class="command">sudo apt remove</span> <span class="argument">firefox</span>

<span class="comment"># Paket + yapılandırma dosyalarını kaldır:</span>
<span class="prompt">$</span> <span class="command">sudo apt purge</span> <span class="argument">firefox</span>

<span class="comment"># Kullanılmayan bağımlılıkları temizle:</span>
<span class="prompt">$</span> <span class="command">sudo apt autoremove</span>

<span class="comment"># Paket ara:</span>
<span class="prompt">$</span> <span class="command">apt search</span> <span class="argument">web server</span>

<span class="comment"># Paket bilgisi göster:</span>
<span class="prompt">$</span> <span class="command">apt show</span> <span class="argument">nginx</span>

<span class="comment"># Kurulu paketleri listele:</span>
<span class="prompt">$</span> <span class="command">apt list</span> <span class="flag">--installed</span>

<span class="comment"># Hangi paket bu dosyayı sağlıyor?</span>
<span class="prompt">$</span> <span class="command">dpkg -S</span> <span class="path">/usr/bin/git</span>
git: /usr/bin/git

<span class="comment"># İndirme önbelleğini temizle:</span>
<span class="prompt">$</span> <span class="command">sudo apt clean</span></code></pre>
</div>

<h3>PPA Ekleme (Ubuntu)</h3>
<div class="code-block">
    <div class="code-block-header"><span>PPA yönetimi</span></div>
    <pre><code><span class="comment"># PPA ekle:</span>
<span class="prompt">$</span> <span class="command">sudo add-apt-repository</span> <span class="argument">ppa:git-core/ppa</span>
<span class="prompt">$</span> <span class="command">sudo apt update</span>

<span class="comment"># PPA kaldır:</span>
<span class="prompt">$</span> <span class="command">sudo add-apt-repository</span> <span class="flag">--remove</span> <span class="argument">ppa:git-core/ppa</span>

<span class="comment"># Üçüncü parti depo ekleme (GPG anahtarı ile):</span>
<span class="prompt">$</span> <span class="command">curl -fsSL</span> <span class="argument">https://download.docker.com/linux/ubuntu/gpg</span> | \\
  <span class="command">sudo gpg --dearmor -o</span> <span class="path">/etc/apt/keyrings/docker.gpg</span>

<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"deb [signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"</span> | \\
  <span class="command">sudo tee</span> <span class="path">/etc/apt/sources.list.d/docker.list</span>

<span class="prompt">$</span> <span class="command">sudo apt update</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> <span class="argument">docker-ce</span></code></pre>
</div>

<h2>DNF — Fedora / RHEL / Rocky</h2>
<div class="code-block">
    <div class="code-block-header"><span>DNF temel komutlar</span></div>
    <pre><code><span class="comment"># Paket listesini güncelle ve kur:</span>
<span class="prompt">$</span> <span class="command">sudo dnf check-update</span>      <span class="comment"># Güncellemeleri kontrol et</span>
<span class="prompt">$</span> <span class="command">sudo dnf upgrade</span>           <span class="comment"># Güncelle</span>

<span class="comment"># Paket kur:</span>
<span class="prompt">$</span> <span class="command">sudo dnf install</span> <span class="argument">vim git curl</span>

<span class="comment"># Paket kaldır:</span>
<span class="prompt">$</span> <span class="command">sudo dnf remove</span> <span class="argument">firefox</span>

<span class="comment"># Paket ara:</span>
<span class="prompt">$</span> <span class="command">dnf search</span> <span class="argument">web server</span>

<span class="comment"># Paket bilgisi:</span>
<span class="prompt">$</span> <span class="command">dnf info</span> <span class="argument">nginx</span>

<span class="comment"># Kurulu paketler:</span>
<span class="prompt">$</span> <span class="command">dnf list installed</span>

<span class="comment"># Hangi paket bu dosyayı sağlıyor?</span>
<span class="prompt">$</span> <span class="command">dnf provides</span> <span class="path">/usr/bin/git</span>

<span class="comment"># Grup kurulumu (geliştirme araçları):</span>
<span class="prompt">$</span> <span class="command">sudo dnf groupinstall</span> <span class="string">"Development Tools"</span>

<span class="comment"># Eklenti deposu (EPEL):</span>
<span class="prompt">$</span> <span class="command">sudo dnf install</span> <span class="argument">epel-release</span>

<span class="comment"># RPM Fusion (multimedya kodekleri vb.):</span>
<span class="prompt">$</span> <span class="command">sudo dnf install</span> <span class="argument">https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm</span>

<span class="comment"># Geçmişi göster ve geri al:</span>
<span class="prompt">$</span> <span class="command">dnf history</span>
<span class="prompt">$</span> <span class="command">sudo dnf history undo</span> <span class="argument">15</span></code></pre>
</div>

<h2>Pacman — Arch Linux</h2>
<div class="code-block">
    <div class="code-block-header"><span>Pacman temel komutlar</span></div>
    <pre><code><span class="comment"># Sistem güncelle (-Syu: Sync, refresh, upgrade):</span>
<span class="prompt">$</span> <span class="command">sudo pacman -Syu</span>

<span class="comment"># Paket kur:</span>
<span class="prompt">$</span> <span class="command">sudo pacman -S</span> <span class="argument">vim git curl</span>

<span class="comment"># Paket kaldır + bağımlılıkları:</span>
<span class="prompt">$</span> <span class="command">sudo pacman -Rns</span> <span class="argument">firefox</span>

<span class="comment"># Paket ara:</span>
<span class="prompt">$</span> <span class="command">pacman -Ss</span> <span class="argument">web server</span>

<span class="comment"># Paket bilgisi:</span>
<span class="prompt">$</span> <span class="command">pacman -Si</span> <span class="argument">nginx</span>      <span class="comment"># Depodaki</span>
<span class="prompt">$</span> <span class="command">pacman -Qi</span> <span class="argument">nginx</span>      <span class="comment"># Kurulan</span>

<span class="comment"># Kurulu paketler:</span>
<span class="prompt">$</span> <span class="command">pacman -Q</span>

<span class="comment"># Hangi paket bu dosyayı sağlıyor?</span>
<span class="prompt">$</span> <span class="command">pacman -Qo</span> <span class="path">/usr/bin/git</span>

<span class="comment"># Yetim paketleri temizle (kullanılmayan bağımlılıklar):</span>
<span class="prompt">$</span> <span class="command">sudo pacman -Rns</span> <span class="argument">$(pacman -Qdtq)</span>

<span class="comment"># Önbelleği temizle:</span>
<span class="prompt">$</span> <span class="command">sudo pacman -Sc</span></code></pre>
</div>

<h3>AUR — Arch User Repository</h3>
<div class="code-block">
    <div class="code-block-header"><span>AUR yardımcısı (yay) ile kurulum</span></div>
    <pre><code><span class="comment"># yay kurun (AUR yardımcısı):</span>
<span class="prompt">$</span> <span class="command">sudo pacman -S</span> <span class="argument">--needed git base-devel</span>
<span class="prompt">$</span> <span class="command">git clone</span> <span class="argument">https://aur.archlinux.org/yay-bin.git</span>
<span class="prompt">$</span> <span class="command">cd</span> yay-bin && <span class="command">makepkg -si</span>

<span class="comment"># AUR'dan paket kur:</span>
<span class="prompt">$</span> <span class="command">yay -S</span> <span class="argument">visual-studio-code-bin</span>
<span class="prompt">$</span> <span class="command">yay -S</span> <span class="argument">google-chrome</span>

<span class="comment"># AUR dahil arama:</span>
<span class="prompt">$</span> <span class="command">yay</span> <span class="argument">spotify</span></code></pre>
</div>

<h2>Zypper — openSUSE</h2>
<div class="code-block">
    <div class="code-block-header"><span>Zypper temel komutlar</span></div>
    <pre><code><span class="comment"># Depo yenile ve güncelle:</span>
<span class="prompt">$</span> <span class="command">sudo zypper refresh</span>
<span class="prompt">$</span> <span class="command">sudo zypper update</span>

<span class="comment"># Paket kur:</span>
<span class="prompt">$</span> <span class="command">sudo zypper install</span> <span class="argument">vim git</span>

<span class="comment"># Paket kaldır:</span>
<span class="prompt">$</span> <span class="command">sudo zypper remove</span> <span class="argument">firefox</span>

<span class="comment"># Paket ara:</span>
<span class="prompt">$</span> <span class="command">zypper search</span> <span class="argument">nginx</span></code></pre>
</div>

<h2>Evrensel Paket Formatları</h2>
<p>Dağıtımdan bağımsız paket formatları, "bir kez paketle, her yerde çalıştır" felsefesiyle geliştirilmiştir:</p>

<h3>Snap (Canonical/Ubuntu)</h3>
<div class="code-block">
    <div class="code-block-header"><span>Snap komutları</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">sudo snap install</span> <span class="argument">code --classic</span>      <span class="comment"># VS Code kur</span>
<span class="prompt">$</span> <span class="command">snap find</span> <span class="argument">video editor</span>                <span class="comment"># Ara</span>
<span class="prompt">$</span> <span class="command">snap list</span>                              <span class="comment"># Kurulu snap'ler</span>
<span class="prompt">$</span> <span class="command">sudo snap refresh</span>                      <span class="comment"># Güncelle</span>
<span class="prompt">$</span> <span class="command">sudo snap remove</span> <span class="argument">code</span>                 <span class="comment"># Kaldır</span></code></pre>
</div>

<h3>Flatpak</h3>
<div class="code-block">
    <div class="code-block-header"><span>Flatpak komutları</span></div>
    <pre><code><span class="comment"># Flatpak + Flathub deposu kurulumu:</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> <span class="argument">flatpak</span>
<span class="prompt">$</span> <span class="command">flatpak remote-add --if-not-exists</span> <span class="argument">flathub https://dl.flathub.org/repo/flathub.flatpakrepo</span>

<span class="comment"># Uygulama kur:</span>
<span class="prompt">$</span> <span class="command">flatpak install</span> <span class="argument">flathub org.gimp.GIMP</span>

<span class="comment"># Çalıştır:</span>
<span class="prompt">$</span> <span class="command">flatpak run</span> <span class="argument">org.gimp.GIMP</span>

<span class="comment"># Kurulu uygulamalar:</span>
<span class="prompt">$</span> <span class="command">flatpak list</span>

<span class="comment"># Güncelle:</span>
<span class="prompt">$</span> <span class="command">flatpak update</span>

<span class="comment"># Kaldır:</span>
<span class="prompt">$</span> <span class="command">flatpak uninstall</span> <span class="argument">org.gimp.GIMP</span></code></pre>
</div>

<h3>AppImage</h3>
<div class="code-block">
    <div class="code-block-header"><span>AppImage kullanımı</span></div>
    <pre><code><span class="comment"># AppImage dosyasını indir:</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="argument">https://example.com/Uygulama.AppImage</span>

<span class="comment"># Çalıştırma izni ver:</span>
<span class="prompt">$</span> <span class="command">chmod +x</span> <span class="path">Uygulama.AppImage</span>

<span class="comment"># Çalıştır:</span>
<span class="prompt">$</span> <span class="command">./Uygulama.AppImage</span>

<span class="comment"># Kurulum gerektirmez — tek dosyada taşınabilir uygulama!</span></code></pre>
</div>

<h3>Karşılaştırma Tablosu</h3>
<table>
    <tr><th>Özellik</th><th>Snap</th><th>Flatpak</th><th>AppImage</th></tr>
    <tr><td>Geliştirici</td><td>Canonical</td><td>Topluluk (Red Hat destekli)</td><td>Topluluk</td></tr>
    <tr><td>Sandbox</td><td>✅ AppArmor</td><td>✅ Bubblewrap</td><td>❌ İsteğe bağlı</td></tr>
    <tr><td>Mağaza</td><td>Snap Store</td><td>Flathub</td><td>appimagehub.com</td></tr>
    <tr><td>Otomatik Güncelleme</td><td>✅</td><td>✅</td><td>❌ Manuel</td></tr>
    <tr><td>Kurulum</td><td>Daemon gerekli (snapd)</td><td>Runtime gerekli</td><td>Tek dosya, kurulum yok</td></tr>
    <tr><td>CLI Uygulamaları</td><td>✅</td><td>Sınırlı</td><td>✅</td></tr>
</table>

<h2>Hızlı Referans: Dağıtımlar Arası Eşdeğerlik</h2>
<table>
    <tr><th>İşlem</th><th>APT (Debian/Ubuntu)</th><th>DNF (Fedora)</th><th>Pacman (Arch)</th></tr>
    <tr><td>Paket listesini güncelle</td><td><code>apt update</code></td><td><code>dnf check-update</code></td><td><code>pacman -Sy</code></td></tr>
    <tr><td>Sistemi güncelle</td><td><code>apt upgrade</code></td><td><code>dnf upgrade</code></td><td><code>pacman -Syu</code></td></tr>
    <tr><td>Paket kur</td><td><code>apt install pkg</code></td><td><code>dnf install pkg</code></td><td><code>pacman -S pkg</code></td></tr>
    <tr><td>Paket kaldır</td><td><code>apt remove pkg</code></td><td><code>dnf remove pkg</code></td><td><code>pacman -R pkg</code></td></tr>
    <tr><td>Paket ara</td><td><code>apt search pkg</code></td><td><code>dnf search pkg</code></td><td><code>pacman -Ss pkg</code></td></tr>
    <tr><td>Paket bilgisi</td><td><code>apt show pkg</code></td><td><code>dnf info pkg</code></td><td><code>pacman -Si pkg</code></td></tr>
    <tr><td>Kurulu listele</td><td><code>apt list --installed</code></td><td><code>dnf list installed</code></td><td><code>pacman -Q</code></td></tr>
    <tr><td>Önbellek temizle</td><td><code>apt clean</code></td><td><code>dnf clean all</code></td><td><code>pacman -Sc</code></td></tr>
</table>

<h2>Dış Kaynaklar</h2>
<div class="info-box tip">
    <div class="info-box-title">📚 İleri Okuma</div>
    <ul>
        <li><a href="https://wiki.debian.org/AptCLI" target="_blank" rel="noopener">Debian Wiki — APT</a> — APT komutlarının kapsamlı referansı</li>
        <li><a href="https://dnf.readthedocs.io/" target="_blank" rel="noopener">DNF Documentation</a> — DNF'nin resmi belgeleri</li>
        <li><a href="https://wiki.archlinux.org/title/Pacman" target="_blank" rel="noopener">Arch Wiki — Pacman</a> — Pacman'in ve AUR'un detaylı rehberi</li>
        <li><a href="https://flatpak.org/setup/" target="_blank" rel="noopener">Flatpak Setup</a> — Flatpak kurulumu dağıtımlara göre</li>
        <li><a href="https://snapcraft.io/docs" target="_blank" rel="noopener">Snapcraft Docs</a> — Snap paket yöneticisi belgeleri</li>
    </ul>
</div>
`,
    quiz: [
        {
            question: "'sudo apt update' komutu ne yapar?",
            options: ["Kurulu paketleri günceller", "Paket listesini (index) yeniler", "Yeni paket kurar", "Sistemi yeniden başlatır"],
            correct: 1,
            explanation: "'apt update' depolardan paket listesini yeniler. Kurulu paketleri güncellemez — bunun için 'apt upgrade' gerekir."
        },
        {
            question: "Fedora'da paket kurmak için hangi komut kullanılır?",
            options: ["apt install", "yum install", "dnf install", "pacman -S"],
            correct: 2,
            explanation: "Fedora, DNF (Dandified YUM) paket yöneticisini kullanır. YUM eski sürüm olup artık DNF tercih edilir."
        },
        {
            question: "Arch Linux'ta sistemi tamamen güncellemek için hangi komut kullanılır?",
            options: ["pacman -U", "pacman -Syu", "pacman -R", "pacman -Q"],
            correct: 1,
            explanation: "-Syu: S(sync) veritabanını senkronize et, y(refresh) paket listesini yenile, u(upgrade) güncelle. Arch'ın en temel komutu."
        },
        {
            question: "APT ile DNF arasındaki temel fark nedir?",
            options: ["Farklı dağıtım aileleri için geliştirilmişlerdir (deb vs rpm)", "Biri ücretsiz diğeri ücretli", "APT daha hızlıdır", "DNF sadece sunucularda çalışır"],
            correct: 0,
            explanation: "APT, Debian tabanlı dağıtımlarda (.deb paketleri), DNF ise Red Hat tabanlı dağıtımlarda (.rpm paketleri) kullanılır."
        },
        {
            question: "Flatpak, Snap ve AppImage'nin ortak özelliği nedir?",
            options: ["Hepsi Canonical tarafından geliştirilmiştir", "Hepsi .deb formatındadır", "Dağıtımdan bağımsız çalışırlar", "Hepsi terminal uygulamaları içindir"],
            correct: 2,
            explanation: "Üçü de dağıtımdan bağımsız paket formatlarıdır — uygulamayı bağımlılıklarıyla birlikte paketler."
        },
        {
            question: "'apt remove' ile 'apt purge' arasındaki fark nedir?",
            options: ["Fark yoktur", "purge yapılandırma dosyalarını da siler", "remove daha hızlıdır", "purge sadece root çalıştırabilir"],
            correct: 1,
            explanation: "'apt remove' paketi kaldırır ama yapılandırma dosyaları kalır (yeniden kurulumda eski ayarlar korunur). 'apt purge' her şeyi temizler."
        }
    ]
});
