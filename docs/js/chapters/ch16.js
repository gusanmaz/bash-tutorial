// ===== Bölüm 16: Git & GitHub — Versiyon Kontrol ve İşbirliği =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 16,
    title: 'Git & GitHub',
    subtitle: 'Version Control & Collaboration',
    icon: '🌿',
    description: 'Git\'in felsefesi, temel ve orta seviye kullanımı, GitHub entegrasyonu: commit, branch, merge, fork, Pull Request, Issues ve iş akışları.',
    content: `
<h2>Versiyon Kontrol Nedir ve Neden Herkesin Bilmesi Gerekir?</h2>
<p>Bir proje üzerinde çalışırken şu sorunlarla karşılaşmışsınızdır:</p>
<ul>
    <li><code>rapor_final.docx</code>, <code>rapor_final_v2.docx</code>, <code>rapor_gercekten_final.docx</code> 😩</li>
    <li>"Dün çalışan kodu bozdum, geri alamıyorum!"</li>
    <li>"Takım arkadaşım aynı dosyayı değiştirmiş, çakışma var!"</li>
    <li>"Bu değişikliği kim, ne zaman, neden yaptı?"</li>
</ul>
<p><strong>Versiyon kontrol sistemi (VCS)</strong>, dosyalarınızın her değişikliğini kaydeder, geçmişe dönmenizi sağlar ve takım çalışmasını kolaylaştırır. Dosyayı her kaydettiğinizde bir "anlık fotoğraf" (snapshot) alınır — istediğiniz zaman o ana dönebilirsiniz.</p>
<p>Düşünün ki bilgisayar oyununda "save" yapıyorsunuz. Bir hata yapınca son kayıt noktasına geri dönüyorsunuz. Git de aynen böyle çalışır — her commit bir "save point"tir.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Neden Her Yazılımcı Git Bilmeli?</div>
    <ul>
        <li><strong>İş başvurularında %99</strong> → Git bilgisi istenir</li>
        <li><strong>Açık kaynak katkısı</strong> → Git olmadan imkansız</li>
        <li><strong>Takım çalışması</strong> → 2+ kişi aynı projede çalışabilir</li>
        <li><strong>Güvenlik ağı</strong> → Ne yaparsanız yapın, geri dönebilirsiniz</li>
        <li><strong>Portfolyo</strong> → GitHub profili, CV'nizden daha çok konuşur</li>
    </ul>
</div>

<div class="eng-box">
    <div class="eng-title">🔤 İngilizce Terimler</div>
    <div class="eng-content">
        <span class="eng-word">Repository (Repo)</span> = <span class="eng-meaning">Depo</span> — Projenin Git tarafından izlenen dizini.<br>
        <span class="eng-word">Commit</span> = <span class="eng-meaning">İşleme / Kayıt</span> — Değişikliklerin kalıcı olarak kaydedilmesi.<br>
        <span class="eng-word">Branch</span> = <span class="eng-meaning">Dal</span> — Bağımsız geliştirme hattı.<br>
        <span class="eng-word">Merge</span> = <span class="eng-meaning">Birleştirme</span> — İki dalı birleştirme.<br>
        <span class="eng-word">Staging Area</span> = <span class="eng-meaning">Hazırlık Alanı</span> — Commit'e dahil edilecek değişikliklerin bekleme alanı.<br>
        <span class="eng-word">Remote</span> = <span class="eng-meaning">Uzak</span> — Uzak sunucudaki repo (GitHub, GitLab).<br>
        <span class="eng-word">Clone</span> = <span class="eng-meaning">Klonlama</span> — Uzak repoyu yerel bilgisayara kopyalama.<br>
        <span class="eng-word">Pull</span> = <span class="eng-meaning">Çekme</span> — Uzaktaki değişiklikleri yerele alma.<br>
        <span class="eng-word">Push</span> = <span class="eng-meaning">İtme</span> — Yerel değişiklikleri uzağa gönderme.<br>
        <span class="eng-word">Fork</span> = <span class="eng-meaning">Çatallanma</span> — Başkasının projesinin kendi hesabına kopyası.<br>
        <span class="eng-word">Pull Request (PR)</span> = <span class="eng-meaning">Birleştirme İsteği</span> — Değişikliklerin ana projeye alınması talebi.<br>
        <span class="eng-word">Issue</span> = <span class="eng-meaning">Sorun / Görev</span> — Hata bildirimi veya özellik isteği.<br>
        <span class="eng-word">Conflict</span> = <span class="eng-meaning">Çakışma</span> — İki dalda aynı yerin farklı değiştirilmesi.
    </div>
</div>

<h2>Git'in Felsefesi ve Tarihi</h2>
<p>Git, 2005'te <strong>Linus Torvalds</strong> tarafından Linux çekirdeğinin geliştirilmesi için yaratılmıştır. Daha önceki VCS'lerin (CVS, SVN) sorunlarından ders alarak tasarlanmıştır:</p>

<h3>Git'in Tasarım Prensipleri</h3>
<table>
    <tr><th>Prensip</th><th>Açıklama</th><th>Eski VCS'lerdeki Sorun</th></tr>
    <tr><td><strong>Dağıtık (Distributed)</strong></td><td>Her geliştirici deponun tam bir kopyasına sahiptir</td><td>SVN merkezi sunucuya bağımlıydı — sunucu çökerse çalışamazsınız</td></tr>
    <tr><td><strong>Hızlı</strong></td><td>Branch oluşturma ve geçiş milisaniyeler sürer</td><td>SVN'de branch kopyalama dakikalar alabilirdi</td></tr>
    <tr><td><strong>Veri Bütünlüğü</strong></td><td>Her şey SHA-1 hash ile doğrulanır</td><td>Dosya bozulmaları fark edilmeyebilirdi</td></tr>
    <tr><td><strong>Non-linear</strong></td><td>Binlerce paralel dal desteklenir</td><td>Branch oluşturmak "pahalı" kabul edilirdi</td></tr>
    <tr><td><strong>Snapshot, patch değil</strong></td><td>Her commit, projenin tam anlık görüntüsüdür</td><td>SVN dosya farklarını (delta) saklardı</td></tr>
</table>

<img src="img/git_distributed_vs_centralized.svg" alt="Dağıtık vs Merkezi VCS Karşılaştırması" style="max-width:100%; margin: 1.5rem 0; border-radius: 8px;">

<div class="info-box note">
    <div class="info-box-title">📌 Linus Torvalds Git Hakkında</div>
    <em>"Subversion'ın en anlamsız projesi, CVS'i doğru yapmaya çalışmasıdır. CVS'i doğru yapamazsınız çünkü tasarımı yanlıştır."</em><br>
    Linus, Git'i "aptal içerik takipçisi (stupid content tracker)" olarak adlandırır — Git'in altındaki veri yapısı basit ama güçlüdür.
</div>

<!-- ============= GITHUB NEDİR ============= -->

<h2>GitHub Nedir? Git ile Farkı Ne?</h2>
<p>Yeni başlayanların en çok karıştırdığı konu: <strong>Git ≠ GitHub</strong>. Git bir yazılım, GitHub bir web platformudur. İkisi birlikte çalışır ama aynı şey değildir.</p>

<img src="img/git_vs_github.svg" alt="Git vs GitHub Karşılaştırması" style="max-width:100%; margin: 1.5rem 0; border-radius: 8px;">

<p>Basit bir benzetme:</p>
<ul>
    <li><strong>Git</strong> = Kameranız (fotoğraf çekersiniz, bilgisayarınızda kalır)</li>
    <li><strong>GitHub</strong> = Instagram (fotoğrafları paylaşırsınız, başkaları görebilir, beğenebilir, katkıda bulunabilir)</li>
</ul>

<h3>GitHub'ın Sunduğu Özellikler</h3>
<table>
    <tr><th>Özellik</th><th>Açıklama</th></tr>
    <tr><td>📁 <strong>Repo Barındırma</strong></td><td>Git depolarınızı bulutta saklarsınız. Bilgisayarınız bozulsa bile kodunuz güvende.</td></tr>
    <tr><td>🔀 <strong>Pull Request (PR)</strong></td><td>Kod değişikliklerini gözden geçirme ve birleştirme sistemi. Takım çalışmasının temeli.</td></tr>
    <tr><td>🐛 <strong>Issues</strong></td><td>Hata bildirimleri, özellik istekleri ve görev takibi.</td></tr>
    <tr><td>🤖 <strong>GitHub Actions</strong></td><td>Otomatik test, derleme ve dağıtım (CI/CD). Kod push edildiğinde testler otomatik çalışır.</td></tr>
    <tr><td>🌐 <strong>GitHub Pages</strong></td><td>Ücretsiz statik web sitesi barındırma. Portfolio siteniz için ideal.</td></tr>
    <tr><td>📊 <strong>Projects</strong></td><td>Kanban tarzı proje yönetimi panosu.</td></tr>
    <tr><td>📝 <strong>Wiki</strong></td><td>Proje dokümantasyonu için wiki sayfaları.</td></tr>
    <tr><td>🔒 <strong>Security</strong></td><td>Bağımlılık güvenlik taraması, Dependabot ile otomatik güncelleme.</td></tr>
</table>

<p>GitHub sadece bir "repo deposu" değil, eksiksiz bir geliştirici platformudur. İşte GitHub ekosisteminin tamamı:</p>

<img src="img/github_ecosystem.svg" alt="GitHub Ekosistemi — Platform Özellikleri" style="max-width:100%; margin: 1.5rem 0; border-radius: 8px;">

<div class="info-box tip">
    <div class="info-box-title">💡 GitHub'ın Faydaları — Neden Kullanmalısınız?</div>
    <ol>
        <li><strong>Portfolyo:</strong> İş başvurularında GitHub profiliniz "canlı CV" gibidir. İşverenler kodlarınızı görür.</li>
        <li><strong>Açık Kaynak Katkısı:</strong> Dünya çapında projelere (Linux, React, VS Code...) katkıda bulunabilirsiniz.</li>
        <li><strong>Yedekleme:</strong> Kodunuz bulutta güvende. Bilgisayar çalınsa/bozulsa bile bir sorun yok.</li>
        <li><strong>İş Birliği:</strong> Takım arkadaşlarıyla aynı anda aynı projede çalışabilirsiniz.</li>
        <li><strong>Öğrenme:</strong> Başkalarının kodlarını okuyarak çok şey öğrenirsiniz.</li>
        <li><strong>Ücretsiz:</strong> Sınırsız public repo, öğrencilere özel GitHub Student Pack ile ekstra avantajlar.</li>
    </ol>
</div>

<!-- ============= ALTERNATİF PLATFORMLAR ============= -->

<h2>GitHub Alternatifleri — GitLab, Bitbucket, Codeberg</h2>
<p>GitHub en popüler platform olsa da tek seçenek değil. Hepsi Git kullanır, fark <strong>ek özellikler ve felsefedir</strong>. Projenizin ihtiyacına göre farklı platformlar daha uygun olabilir:</p>

<img src="img/git_platforms_comparison.svg" alt="Git Tabanlı Platformlar Karşılaştırması" style="max-width:100%; margin: 1.5rem 0; border-radius: 8px;">

<h3>🦊 GitLab — Entegre DevOps Platformu</h3>
<p><a href="https://gitlab.com" target="_blank" rel="noopener">gitlab.com</a></p>
<ul>
    <li><strong>En güçlü yönü:</strong> CI/CD doğrudan platformun içinde, ek yapılandırma gerektirmez</li>
    <li><strong>Self-hosted:</strong> Kendi sunucunuza ücretsiz kurabilirsiniz (Community Edition). Şirketler için ideal</li>
    <li><strong>DevOps:</strong> Planlama, kaynak kodu, CI/CD, izleme, güvenlik — tek çatı altında</li>
    <li><strong>Merge Request:</strong> GitHub'daki PR'ın karşılığı, "Merge Request (MR)" olarak adlandırılır</li>
    <li><strong>Ücretsiz:</strong> Sınırsız private repo, 5GB depolama, 400 CI/CD dakika/ay</li>
</ul>

<div class="code-block">
    <div class="code-block-header"><span>GitLab CI/CD — .gitlab-ci.yml örneği</span></div>
    <pre><code><span class="comment"># GitLab'da CI/CD dosyası .gitlab-ci.yml olarak adlandırılır</span>
<span class="comment"># (GitHub'da .github/workflows/*.yml)</span>
stages:
  - test
  - deploy

test:
  stage: test
  image: python:3.12
  script:
    - pip install -r requirements.txt
    - pytest

deploy:
  stage: deploy
  script:
    - echo "Deploying..."
  only:
    - main</code></pre>
</div>

<h3>🪣 Bitbucket — Atlassian Ekosistemi</h3>
<p><a href="https://bitbucket.org" target="_blank" rel="noopener">bitbucket.org</a></p>
<ul>
    <li><strong>En güçlü yönü:</strong> <strong>Jira</strong> ile doğal entegrasyon — Issue'lar, sprintler ve Kanban panoları</li>
    <li><strong>Şirketler için:</strong> Zaten Atlassian (Jira, Confluence, Trello) kullanan takımlar tercih eder</li>
    <li><strong>Pipelines:</strong> Dahili CI/CD sistemi</li>
    <li><strong>Pull Request:</strong> GitHub'daki terminolojiyi kullanır (PR)</li>
    <li><strong>Ücretsiz plan:</strong> 5 kullanıcıya kadar, sınırsız private repo</li>
</ul>

<h3>🏔️ Codeberg — Özgür ve Açık Kaynak</h3>
<p><a href="https://codeberg.org" target="_blank" rel="noopener">codeberg.org</a></p>
<ul>
    <li><strong>En güçlü yönü:</strong> Platform kendisi tamamen <strong>açık kaynak</strong> (Gitea/Forgejo tabanlı)</li>
    <li><strong>Felsefe:</strong> Kar amacı gütmeyen Alman derneği tarafından işletilir</li>
    <li><strong>Gizlilik:</strong> Veri toplamaz, reklam yoktur</li>
    <li><strong>Ücretsiz:</strong> Tüm özellikler tamamen ücretsiz</li>
    <li><strong>Bağımsızlık:</strong> Microsoft'a (GitHub'ın sahibi) bağımlı olmak istemeyenler için</li>
</ul>

<h3>🐙 Gitea — Kendi Git Sunucunuz</h3>
<p><a href="https://gitea.io" target="_blank" rel="noopener">gitea.io</a> — Eğer tamamen kendi sunucunuzda, kendi Git platformunuzu kurmak istiyorsanız Gitea en hafif ve kolay seçenektir. Go diliyle yazılmıştır, Raspberry Pi'de bile çalışır!</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Hangi Platformu Seçmeliyim?</div>
    <table>
        <tr><th>Durum</th><th>Önerilen Platform</th></tr>
        <tr><td>Açık kaynak proje, portfolyo, en geniş topluluk</td><td><strong>🐙 GitHub</strong></td></tr>
        <tr><td>Şirket içi self-hosted, entegre CI/CD, DevOps</td><td><strong>🦊 GitLab</strong></td></tr>
        <tr><td>Atlassian (Jira, Confluence) ekosistemi</td><td><strong>🪣 Bitbucket</strong></td></tr>
        <tr><td>Tamamen açık kaynak, gizlilik odaklı</td><td><strong>🏔️ Codeberg</strong></td></tr>
        <tr><td>Kendi sunucumda, hafif, basit</td><td><strong>🐙 Gitea</strong></td></tr>
    </table>
    <strong>Başlangıç için:</strong> GitHub ile başlayın — en büyük topluluk, en çok kaynak ve iş dünyasında en yaygın kullanılan platformdur. Ama terminal komutları (<code>git push</code>, <code>git pull</code>) hepsinde aynıdır!
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Önemli Not: Git Komutları Her Yerde Aynı!</div>
    Hangi platformu kullanırsanız kullanın, <code>git add</code>, <code>git commit</code>, <code>git push</code>, <code>git pull</code> komutları <strong>aynıdır</strong>. Sadece remote URL değişir:
    <ul>
        <li>GitHub: <code>git@github.com:ali/proje.git</code></li>
        <li>GitLab: <code>git@gitlab.com:ali/proje.git</code></li>
        <li>Bitbucket: <code>git@bitbucket.org:ali/proje.git</code></li>
        <li>Codeberg: <code>git@codeberg.org:ali/proje.git</code></li>
    </ul>
    Bu yüzden bu bölümde öğrendiğiniz her şey <strong>tüm platformlarda</strong> geçerlidir.
</div>

<!-- ============= GİT ÜÇ ALANI ============= -->

<h2>Git'in Üç Alanı — Temel Kavram</h2>
<p>Git'te dosyalar üç ana alanda bulunur. Bu kavramı anlamak Git'i anlamanın anahtarıdır:</p>

<img src="img/git_three_areas.svg" alt="Git'in Üç Alanı: Working Directory, Staging Area, Repository" style="max-width:100%; margin: 1.5rem 0; border-radius: 8px;">

<table>
    <tr><th>Alan</th><th>İngilizce</th><th>Açıklama</th></tr>
    <tr><td>🗂️ <strong>Çalışma Dizini</strong></td><td>Working Directory</td><td>Dosyalarınızın gerçek hali. Burada düzenleme yaparsınız.</td></tr>
    <tr><td>📋 <strong>Hazırlık Alanı</strong></td><td>Staging Area (Index)</td><td>Bir sonraki commit'e dahil edilecek değişiklikler. <code>git add</code> ile buraya eklenir.</td></tr>
    <tr><td>📦 <strong>Depo</strong></td><td>Repository (.git)</td><td>Kalıcı geçmiş. <code>git commit</code> ile kaydedilir.</td></tr>
</table>

<p>İş akışı: <strong>Düzenle → git add (Stage) → git commit (Kaydet)</strong></p>

<h3>Dosya Yaşam Döngüsü</h3>
<p>Git'te bir dosya 4 durumdan birinde olabilir:</p>

<img src="img/git_file_lifecycle.svg" alt="Git Dosya Yaşam Döngüsü" style="max-width:100%; margin: 1.5rem 0; border-radius: 8px;">

<table>
    <tr><th>Durum</th><th>Açıklama</th><th>Nasıl geçiş yapılır?</th></tr>
    <tr><td><strong>Untracked</strong> (İzlenmiyor)</td><td>Git bu dosyayı tanımıyor. Yeni oluşturduğunuz dosyalar.</td><td><code>git add dosya</code> ile Staged'e geçer</td></tr>
    <tr><td><strong>Staged</strong> (Hazırlanmış)</td><td>Bir sonraki commit'e dahil edilecek.</td><td><code>git commit</code> ile Committed'a geçer</td></tr>
    <tr><td><strong>Committed</strong> (Kaydedilmiş)</td><td>Git deposuna güvenle kaydedilmiş.</td><td>Dosyayı düzenleyin → Modified olur</td></tr>
    <tr><td><strong>Modified</strong> (Değiştirilmiş)</td><td>Son commit'ten beri değişmiş.</td><td><code>git add dosya</code> ile yeniden Staged'e</td></tr>
</table>

<!-- ============= KURULUM ============= -->

<h2>Git Kurulumu ve İlk Yapılandırma</h2>
<div class="code-block">
    <div class="code-block-header"><span>Git kurulumu</span></div>
    <pre><code><span class="comment"># Debian/Ubuntu:</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> <span class="argument">git</span>

<span class="comment"># Fedora:</span>
<span class="prompt">$</span> <span class="command">sudo dnf install</span> <span class="argument">git</span>

<span class="comment"># Arch:</span>
<span class="prompt">$</span> <span class="command">sudo pacman -S</span> <span class="argument">git</span>

<span class="comment"># Versiyon kontrolü:</span>
<span class="prompt">$</span> <span class="command">git</span> <span class="flag">--version</span>
git version 2.43.0</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>İlk yapılandırma (mutlaka yapın!)</span></div>
    <pre><code><span class="comment"># Kimlik bilgileri (commit'lerde görünür):</span>
<span class="prompt">$</span> <span class="command">git config</span> <span class="flag">--global</span> user.name <span class="string">"Ali Yılmaz"</span>
<span class="prompt">$</span> <span class="command">git config</span> <span class="flag">--global</span> user.email <span class="string">"ali@email.com"</span>

<span class="comment"># Varsayılan editör:</span>
<span class="prompt">$</span> <span class="command">git config</span> <span class="flag">--global</span> core.editor <span class="string">"vim"</span>

<span class="comment"># Varsayılan dal adı (main):</span>
<span class="prompt">$</span> <span class="command">git config</span> <span class="flag">--global</span> init.defaultBranch <span class="string">"main"</span>

<span class="comment"># Renkli çıktı:</span>
<span class="prompt">$</span> <span class="command">git config</span> <span class="flag">--global</span> color.ui auto

<span class="comment"># Yapılandırmayı kontrol et:</span>
<span class="prompt">$</span> <span class="command">git config</span> <span class="flag">--list</span>

<span class="comment"># Yapılandırma dosyası: ~/.gitconfig</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ E-posta Adresi Önemli!</div>
    <code>user.email</code> ayarını <strong>GitHub hesabınızdaki e-posta ile aynı</strong> yapın. Yoksa commit'leriniz GitHub profilinizle ilişkilendirilmez ve "yeşil kutucuklar" (contribution graph) görünmez.
</div>

<!-- ============= SSH ANAHTARI ============= -->

<h2>GitHub ile SSH Bağlantısı Kurma</h2>
<p>GitHub'a her push/pull yaptığınızda şifre girmek istemiyorsanız <strong>SSH anahtarı</strong> kullanın. Bu en güvenli ve pratik yöntemdir.</p>

<div class="code-block">
    <div class="code-block-header"><span>SSH anahtarı oluşturma ve GitHub'a ekleme</span></div>
    <pre><code><span class="comment"># 1. SSH anahtarı oluştur:</span>
<span class="prompt">$</span> <span class="command">ssh-keygen</span> <span class="flag">-t ed25519</span> <span class="flag">-C</span> <span class="string">"ali@email.com"</span>
<span class="comment"># Enter'a basarak varsayılan konumu kabul edin</span>
<span class="comment"># Passphrase (şifre) belirleyin veya boş bırakın</span>

<span class="comment"># 2. SSH agent'ı başlat:</span>
<span class="prompt">$</span> <span class="command">eval</span> <span class="string">"$(ssh-agent -s)"</span>
<span class="prompt">$</span> <span class="command">ssh-add</span> <span class="path">~/.ssh/id_ed25519</span>

<span class="comment"># 3. Açık anahtarı kopyala:</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="path">~/.ssh/id_ed25519.pub</span>
<span class="comment"># Çıktıyı kopyalayın (ssh-ed25519 AAAA... ile başlar)</span>

<span class="comment"># 4. GitHub'da: Settings → SSH and GPG keys → New SSH key</span>
<span class="comment">#    Title: "Ali'nin Laptopu"</span>
<span class="comment">#    Key: yapıştır → Add SSH key</span>

<span class="comment"># 5. Bağlantıyı test et:</span>
<span class="prompt">$</span> <span class="command">ssh</span> <span class="flag">-T</span> <span class="argument">git@github.com</span>
Hi ali! You've successfully authenticated.</code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 HTTPS vs SSH</div>
    <table>
        <tr><th></th><th>HTTPS</th><th>SSH</th></tr>
        <tr><td>URL format</td><td><code>https://github.com/user/repo.git</code></td><td><code>git@github.com:user/repo.git</code></td></tr>
        <tr><td>Kimlik doğrulama</td><td>Token (PAT) gerekli</td><td>SSH anahtarı (bir kez kurulur)</td></tr>
        <tr><td>Önerilen</td><td>Hızlı deneme için</td><td><strong>Günlük kullanım için ✅</strong></td></tr>
    </table>
</div>

<!-- ============= GITHUB'DA REPO OLUŞTURMA ============= -->

<h2>Sıfırdan Proje — GitHub'da Repo Oluşturma</h2>
<p>Adım adım ilk projenizi oluşturalım. Aşağıda GitHub'un web arayüzünün nasıl göründüğünü görebilirsiniz:</p>

<img src="img/github_web_ui.svg" alt="GitHub Web Arayüzü — Temel İşlemler" style="max-width:100%; margin: 1.5rem 0; border-radius: 8px;">

<div class="info-box tip">
    <div class="info-box-title">📸 Ekran Görüntülü Resmi Rehberler</div>
    GitHub kendi dokümantasyonunda her adımı ekran görüntüleriyle gösterir. Bu rehberleri mutlaka takip edin:
    <ul>
        <li><a href="https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository" target="_blank" rel="noopener">📁 Yeni repo oluşturma</a> — Adım adım ekran görüntüleriyle repo oluşturma</li>
        <li><a href="https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository" target="_blank" rel="noopener">📤 Dosya yükleme (Upload)</a> — Web arayüzünden dosya ekleme/yükleme</li>
        <li><a href="https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files" target="_blank" rel="noopener">✏️ Dosya düzenleme</a> — Web editöründe doğrudan dosya düzenleme ve commit</li>
        <li><a href="https://docs.github.com/en/repositories/working-with-files/managing-files/creating-new-files" target="_blank" rel="noopener">📄 Yeni dosya oluşturma</a> — GitHub web üzerinden yeni dosya ekleme</li>
        <li><a href="https://docs.github.com/en/get-started/start-your-journey/hello-world" target="_blank" rel="noopener">🌍 Hello World Tutorial</a> — GitHub'ın kendi başlangıç rehberi (branch, commit, PR adımları)</li>
        <li><a href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request" target="_blank" rel="noopener">🔀 Pull Request oluşturma</a> — PR açma ve inceleme süreci</li>
    </ul>
</div>

<h3>Adım 1: GitHub'da Repo Oluşturma</h3>
<ol>
    <li>GitHub.com'da <strong>sağ üst köşedeki "+"</strong> → <strong>"New repository"</strong> tıklayın.</li>
    <li><strong>Repository name:</strong> <code>ilk-projem</code> yazın (boşluk kullanmayın, tire kullanılır).</li>
    <li><strong>Description:</strong> "Benim ilk Git projemdir" (isteğe bağlı ama önerilir).</li>
    <li><strong>Public</strong> veya <strong>Private</strong> seçin. Portfolyo için Public önerilir.</li>
    <li><strong>"Add a README file"</strong> kutucuğunu işaretleyin.</li>
    <li><strong>"Add .gitignore"</strong> → Programlama dilinizi seçin (Python, Node vb.).</li>
    <li><strong>"Create repository"</strong> butonuna basın. ✅</li>
</ol>

<h3>Adım 2: Bilgisayarınıza Klonlayın</h3>
<div class="code-block">
    <div class="code-block-header"><span>Repo'yu bilgisayara indirme</span></div>
    <pre><code><span class="comment"># SSH ile klonla (önerilen):</span>
<span class="prompt">$</span> <span class="command">git clone</span> <span class="argument">git@github.com:ali/ilk-projem.git</span>
<span class="prompt">$</span> <span class="command">cd</span> <span class="path">ilk-projem</span>

<span class="comment"># HTTPS ile klonla:</span>
<span class="prompt">$</span> <span class="command">git clone</span> <span class="argument">https://github.com/ali/ilk-projem.git</span>

<span class="comment"># Farklı isimle klonla:</span>
<span class="prompt">$</span> <span class="command">git clone</span> <span class="argument">git@github.com:ali/ilk-projem.git</span> <span class="path">benim-proje</span></code></pre>
</div>

<h3>Adım 3: Dosya Ekleyin, Commit'leyin ve Push'layın</h3>
<div class="code-block">
    <div class="code-block-header"><span>İlk dosyanızı oluşturma ve gönderme</span></div>
    <pre><code><span class="comment"># Yeni dosya oluştur:</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">"print('Merhaba Dünya!')"</span> > <span class="path">main.py</span>

<span class="comment"># Durumu kontrol et:</span>
<span class="prompt">$</span> <span class="command">git status</span>
On branch main
Untracked files:
  main.py                <span class="comment">← Git bu dosyayı henüz tanımıyor</span>

<span class="comment"># Dosyayı staging'e ekle:</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="path">main.py</span>

<span class="comment"># Commit yap (kaydet):</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"feat: merhaba dünya betiği eklendi"</span>

<span class="comment"># GitHub'a gönder:</span>
<span class="prompt">$</span> <span class="command">git push</span>

<span class="comment"># 🎉 GitHub'da sayfayı yenilediğinizde main.py'yi göreceksiniz!</span></code></pre>
</div>

<!-- ============= GITHUB WEB GUI ============= -->

<h2>GitHub Web Arayüzünden İşlemler (Terminal Kullanmadan)</h2>
<p>Terminal kullanmayı henüz bilmiyorsanız veya hızlıca küçük değişiklikler yapmak istiyorsanız, <strong>GitHub'ın web arayüzü</strong> birçok Git işlemini doğrudan tarayıcıdan yapmanızı sağlar.</p>

<h3>Web'den Dosya Yükleme (Upload)</h3>
<ol>
    <li>Repo sayfanızda <strong>"Add file"</strong> butonuna tıklayın</li>
    <li><strong>"Upload files"</strong> seçin</li>
    <li>Dosyalarınızı <strong>sürükle-bırak (drag & drop)</strong> ile yükleyin veya <strong>"choose your files"</strong> tıklayın</li>
    <li>Commit mesajı yazın (örn: <code>docs: proje raporları eklendi</code>)</li>
    <li><strong>"Commit directly to main"</strong> veya <strong>"Create a new branch"</strong> seçin</li>
    <li><strong>"Commit changes"</strong> butonuna tıklayın ✅</li>
</ol>

<div class="info-box note">
    <div class="info-box-title">📌 Resmi Rehber (Ekran Görüntülü)</div>
    GitHub'ın dosya yükleme rehberini ekran görüntüleriyle görmek için:<br>
    <a href="https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository" target="_blank" rel="noopener">📤 GitHub Docs — Adding a file to a repository</a>
</div>

<h3>Web'den Dosya Düzenleme</h3>
<ol>
    <li>Repo'daki dosyaya tıklayın (örn: <code>main.py</code>)</li>
    <li>Sağ üst köşedeki <strong>kalem (✏️) ikonuna</strong> tıklayın</li>
    <li>GitHub'ın web editörü açılır — değişikliklerinizi yapın</li>
    <li><strong>"Preview"</strong> sekmesiyle önizleme yapabilirsiniz</li>
    <li><strong>"Commit changes"</strong> butonuna tıklayın</li>
    <li>Commit mesajı yazın ve commit edin ✅</li>
</ol>

<div class="info-box tip">
    <div class="info-box-title">💡 "." kısayolu — VS Code Web!</div>
    Herhangi bir GitHub repo sayfasında klavyede <strong>"." (nokta)</strong> tuşuna basın. GitHub, <strong>VS Code'un web versiyonunu</strong> (github.dev) açar! Tam bir editör deneyimi — terminal yok ama çok güçlü düzenleme imkânı. Adres çubuğunda <code>github.com</code> → <code>github.dev</code> olarak değişir.
</div>

<h3>Web'den Yeni Dosya Oluşturma</h3>
<ol>
    <li><strong>"Add file"</strong> → <strong>"Create new file"</strong> tıklayın</li>
    <li>Dosya adını yazın (örn: <code>utils.py</code>). Klasör oluşturmak için <code>src/utils.py</code> yazın — <code>/</code> otomatik klasör oluşturur!</li>
    <li>İçeriği yazın</li>
    <li>Commit mesajı girin ve kaydedin ✅</li>
</ol>

<h3>Web'den Branch ve PR Oluşturma</h3>
<ol>
    <li>Repo sayfasında sol üstteki <strong>dal dropdown'una</strong> tıklayın ("main ▾" yazar)</li>
    <li>Metin kutusuna yeni dal adını yazın (örn: <code>feature/yeni-ozellik</code>)</li>
    <li><strong>"Create branch: feature/yeni-ozellik from main"</strong> tıklayın</li>
    <li>Yeni dalda dosya düzenleyin ve commit edin</li>
    <li>Üstte çıkan <strong>"Compare & pull request"</strong> butonuna tıklayın</li>
    <li>PR başlığı ve açıklaması yazın → <strong>"Create pull request"</strong> ✅</li>
</ol>

<div class="info-box note">
    <div class="info-box-title">📌 Ekran Görüntüleriyle Tam Rehber</div>
    Bu adımların her birini ekran görüntüleriyle görmek için GitHub'ın resmi "Hello World" tutorial'ını takip edin:<br>
    <a href="https://docs.github.com/en/get-started/start-your-journey/hello-world" target="_blank" rel="noopener">🌍 GitHub Hello World — Adım adım ekran görüntülü rehber</a><br><br>
    PR oluşturma ve inceleme süreci için:<br>
    <a href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request" target="_blank" rel="noopener">🔀 GitHub Docs — Creating a Pull Request</a>
</div>

<h3>GitHub Web vs Terminal — Ne Zaman Hangisi?</h3>
<table>
    <tr><th>İşlem</th><th>Web Arayüzü</th><th>Terminal (CLI)</th></tr>
    <tr><td>Küçük düzenleme (typo fix)</td><td><strong>✅ Hızlı ve kolay</strong></td><td>Gereksiz karmaşık</td></tr>
    <tr><td>README güncelleme</td><td><strong>✅ Web editörü yeterli</strong></td><td>Olur</td></tr>
    <tr><td>Birden fazla dosya değiştirme</td><td>Zahmetli</td><td><strong>✅ git add -A ile hızlı</strong></td></tr>
    <tr><td>Büyük proje geliştirme</td><td>Yetersiz</td><td><strong>✅ Kesinlikle terminal</strong></td></tr>
    <tr><td>PR inceleme</td><td><strong>✅ Görsel diff mükemmel</strong></td><td>gh pr view</td></tr>
    <tr><td>Issue yönetimi</td><td><strong>✅ Web GUI en iyisi</strong></td><td>gh issue</td></tr>
    <tr><td>Branch yönetimi</td><td>Basit işler için</td><td><strong>✅ Tam kontrol</strong></td></tr>
</table>

<!-- ============= DOSYA İŞLEMLERİ ============= -->

<h2>Projeye Dosya Ekleme, Silme ve Değiştirme</h2>

<h3>Dosya Ekleme</h3>
<div class="code-block">
    <div class="code-block-header"><span>Yeni dosya ekleme iş akışı</span></div>
    <pre><code><span class="comment"># 1. Dosyayı oluşturun (editörle veya terminalden):</span>
<span class="prompt">$</span> <span class="command">touch</span> <span class="path">utils.py</span>
<span class="prompt">$</span> <span class="command">mkdir</span> <span class="path">src</span> && <span class="command">touch</span> <span class="path">src/app.py</span>

<span class="comment"># 2. İçerik yazın (vscode, vim, nano vs.):</span>
<span class="prompt">$</span> <span class="command">code</span> <span class="path">utils.py</span>

<span class="comment"># 3. Git'e ekleyin:</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="path">utils.py</span> <span class="path">src/app.py</span>     <span class="comment"># Belirli dosyalar</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="path">src/</span>                    <span class="comment"># Tüm klasör</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="flag">-A</span>                      <span class="comment"># HER ŞEY</span>

<span class="comment"># 4. Commit yapın:</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"feat: yardımcı modüller eklendi"</span></code></pre>
</div>

<h3>Dosya Silme</h3>
<div class="code-block">
    <div class="code-block-header"><span>Dosya silme yöntemleri</span></div>
    <pre><code><span class="comment"># Yöntem 1: Git ile sil (disk + staging bir arada):</span>
<span class="prompt">$</span> <span class="command">git rm</span> <span class="path">gereksiz.txt</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"chore: gereksiz dosya silindi"</span>

<span class="comment"># Yöntem 2: Klasik sil, sonra Git'e bildir:</span>
<span class="prompt">$</span> <span class="command">rm</span> <span class="path">gereksiz.txt</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="path">gereksiz.txt</span>    <span class="comment"># silme işlemini stage'le</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"chore: gereksiz dosya silindi"</span>

<span class="comment"># Git'ten sil ama diskte tut (tracking'i kaldır):</span>
<span class="prompt">$</span> <span class="command">git rm</span> <span class="flag">--cached</span> <span class="path">gizli.env</span>
<span class="comment"># Dosya hâlâ klasörde ama Git artık izlemiyor</span>
<span class="comment"># .gitignore'a da ekleyin!</span></code></pre>
</div>

<h3>Dosya Taşıma / Yeniden Adlandırma</h3>
<div class="code-block">
    <div class="code-block-header"><span>Dosya taşıma ve yeniden adlandırma</span></div>
    <pre><code><span class="comment"># Git ile yeniden adlandır:</span>
<span class="prompt">$</span> <span class="command">git mv</span> <span class="path">eski_ad.py</span> <span class="path">yeni_ad.py</span>

<span class="comment"># Dosyayı başka klasöre taşı:</span>
<span class="prompt">$</span> <span class="command">git mv</span> <span class="path">app.py</span> <span class="path">src/app.py</span>

<span class="comment"># Commit:</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"refactor: dosya yapısı düzenlendi"</span></code></pre>
</div>

<!-- ============= TEMEL İŞ AKIŞI ============= -->

<h2>Temel Git İş Akışı</h2>

<h3>git status — En Sık Kullanacağınız Komut</h3>
<p><code>git status</code> size projenizin genel durumunu gösterir. Şüphede kaldığınızda her zaman <code>git status</code> çalıştırın!</p>

<div class="code-block">
    <div class="code-block-header"><span>git status çıktısını okuma</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">git status</span>
On branch main                         <span class="comment">← Hangi daldasınız</span>
Your branch is up to date with 'origin/main'.

Changes to be committed:              <span class="comment">← Staged (commit'e hazır)</span>
  <span style="color:#2a9d8f">new file:   src/helpers.py</span>

Changes not staged for commit:         <span class="comment">← Modified (düzenlendi ama staged değil)</span>
  <span style="color:#e76f51">modified:   main.py</span>

Untracked files:                       <span class="comment">← Yeni dosyalar (Git izlemiyor)</span>
  <span style="color:#e76f51">test_main.py</span>

<span class="comment"># Kısa format (-s | --short) daha okunaklı olabilir:</span>
<span class="prompt">$</span> <span class="command">git status</span> <span class="flag">-s</span>
A  src/helpers.py       <span class="comment"># A = Added (staged)</span>
 M main.py              <span class="comment"># M = Modified (not staged)</span>
?? test_main.py         <span class="comment"># ?? = Untracked</span></code></pre>
</div>

<h3>git add — Değişiklikleri Hazırlama</h3>
<div class="code-block">
    <div class="code-block-header"><span>git add kullanımı</span></div>
    <pre><code><span class="comment"># Belirli dosya:</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="path">index.html</span>

<span class="comment"># Belirli klasör:</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="path">src/</span>

<span class="comment"># Tüm değişiklikler (yeni, düzenlenmiş, silinmiş):</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="flag">-A</span>

<span class="comment"># İnteraktif mod — satır satır seçerek ekleyin:</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="flag">-p</span>
<span class="comment"># Her değişiklik için y (ekle), n (atla), s (böl) sorulur</span>
<span class="comment"># İleri düzey ama çok kullanışlı!</span></code></pre>
</div>

<h3>git diff — Neyi Değiştirdim?</h3>
<div class="code-block">
    <div class="code-block-header"><span>Değişiklikleri görmek</span></div>
    <pre><code><span class="comment"># Henüz stage'lenmemiş değişiklikler:</span>
<span class="prompt">$</span> <span class="command">git diff</span>

<span class="comment"># Staged (commit'e hazır) değişiklikler:</span>
<span class="prompt">$</span> <span class="command">git diff</span> <span class="flag">--staged</span>

<span class="comment"># İki dal arasındaki farklar:</span>
<span class="prompt">$</span> <span class="command">git diff</span> <span class="argument">main..feature/login</span>

<span class="comment"># Belirli dosyanın farkı:</span>
<span class="prompt">$</span> <span class="command">git diff</span> <span class="path">main.py</span></code></pre>
</div>

<!-- ============= COMMIT MESAJLARI ============= -->

<h2>İyi Commit Mesajı Yazma Sanatı</h2>
<p>Commit mesajı "ne yaptığınızı" anlatır. 6 ay sonra koda döndüğünüzde <code>git log</code> ile ne yapıldığını anlayabilmeniz gerekir. Kötü mesajlar projeyi kaosa sürükler.</p>

<img src="img/git_commit_messages.svg" alt="İyi vs Kötü Commit Mesajları" style="max-width:100%; margin: 1.5rem 0; border-radius: 8px;">

<h3>Conventional Commits — Standart Format</h3>
<p>Sektörde yaygın kullanılan standart format:</p>

<div class="code-block">
    <div class="code-block-header"><span>Commit mesajı formatı</span></div>
    <pre><code><span class="comment"># Temel format:</span>
<span class="string">&lt;tür&gt;: &lt;kısa açıklama&gt;</span>

<span class="comment"># Örnekler:</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"feat: kullanıcı kayıt formu eklendi"</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"fix: login sayfası 500 hatası düzeltildi"</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"docs: README kurulum adımları güncellendi"</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"style: header renk düzenlemesi"</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"refactor: veritabanı bağlantı kodu sadeleştirildi"</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"test: login testleri eklendi"</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"chore: eslint ayarları güncellendi"</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Detaylı (çok satırlı) commit mesajı</span></div>
    <pre><code><span class="comment"># -m olmadan yazın, editör açılır:</span>
<span class="prompt">$</span> <span class="command">git commit</span>

<span class="comment"># Editörde şunu yazın:</span>
feat: kullanıcı profil sayfası eklendi

- Avatar yükleme özelliği eklendi
- Bio alanı 300 karaktere sınırlandırıldı
- Profil URL'si otomatik oluşturuluyor

Closes #42</code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Commit Mesajı Kuralları</div>
    <ol>
        <li>İlk satır <strong>50 karakter</strong> veya daha kısa olmalı</li>
        <li>Emir kipi (imperative) kullanın: "eklendi" yerine <strong>"ekle"</strong></li>
        <li>İlk satırdan sonra boş satır, ardından detay</li>
        <li>Büyük harfle başlamayın (conventional commits'te küçük harf)</li>
        <li>Nokta ile bitirmeyin</li>
        <li>"Neden" sorusuna cevap verin, sadece "ne" değil</li>
    </ol>
</div>

<!-- ============= GEÇMİŞİ İNCELEME ============= -->

<h2>Geçmişi İnceleme — git log, show, blame</h2>
<div class="code-block">
    <div class="code-block-header"><span>Git geçmiş komutları</span></div>
    <pre><code><span class="comment"># Commit geçmişi:</span>
<span class="prompt">$</span> <span class="command">git log</span>

<span class="comment"># Kısa format:</span>
<span class="prompt">$</span> <span class="command">git log</span> <span class="flag">--oneline</span>
a1b2c3d feat: Ana sayfa tasarımı güncellendi
e4f5g6h feat: İlk commit

<span class="comment"># Grafik görünüm (dalları gösterir):</span>
<span class="prompt">$</span> <span class="command">git log</span> <span class="flag">--oneline --graph --all</span>
* a1b2c3d (HEAD -> main) Ana sayfa güncellendi
| * d7e8f9g (feature/login) Giriş sayfası
|/
* e4f5g6h İlk commit

<span class="comment"># Son N commit:</span>
<span class="prompt">$</span> <span class="command">git log</span> <span class="flag">-5</span>           <span class="comment"># Son 5 commit</span>

<span class="comment"># Belirli dosyanın geçmişi:</span>
<span class="prompt">$</span> <span class="command">git log</span> <span class="flag">-p</span> <span class="path">index.html</span>       <span class="comment"># Değişikliklerle birlikte</span>

<span class="comment"># Belirli haftadaki commit'ler:</span>
<span class="prompt">$</span> <span class="command">git log</span> <span class="flag">--since="1 week ago"</span>

<span class="comment"># Belirli bir commit'in detayları:</span>
<span class="prompt">$</span> <span class="command">git show</span> <span class="argument">a1b2c3d</span>

<span class="comment"># Kim hangi satırı ne zaman yazdı? (suçlu kim? 😄):</span>
<span class="prompt">$</span> <span class="command">git blame</span> <span class="path">index.html</span>

<span class="comment"># Güzel bir alias tanımlayın (bir kez):</span>
<span class="prompt">$</span> <span class="command">git config</span> <span class="flag">--global</span> alias.lg <span class="string">"log --oneline --graph --all --decorate"</span>
<span class="comment"># Artık sadece:</span>
<span class="prompt">$</span> <span class="command">git lg</span></code></pre>
</div>

<!-- ============= DALLANMA ============= -->

<h2>Dallanma (Branching)</h2>
<p>Branch'lar Git'in en güçlü özelliklerinden biridir. Her branch bağımsız bir geliştirme hattıdır. Branch oluşturmak son derece hafif bir işlemdir — Git sadece 41 byte'lık bir işaretçi (pointer) oluşturur.</p>

<p>Neden branching önemli?</p>
<ul>
    <li>🧪 <strong>Deney:</strong> Yeni özellik denersiniz, işe yaramazsa dalı silersiniz — main zarar görmez.</li>
    <li>👥 <strong>Paralel çalışma:</strong> Ali login sayfasını, Ayşe profil sayfasını ayrı dallarda geliştirir.</li>
    <li>🛡️ <strong>Koruma:</strong> main dalı her zaman çalışır durumda kalır.</li>
</ul>

<img src="img/git_branching.svg" alt="Git Branching Diyagramı" style="max-width:100%; margin: 1.5rem 0; border-radius: 8px;">

<div class="code-block">
    <div class="code-block-header"><span>Branch işlemleri</span></div>
    <pre><code><span class="comment"># Mevcut dalları listele:</span>
<span class="prompt">$</span> <span class="command">git branch</span>
* main
  feature/login

<span class="comment"># Uzak dallar dahil:</span>
<span class="prompt">$</span> <span class="command">git branch</span> <span class="flag">-a</span>

<span class="comment"># Yeni dal oluştur:</span>
<span class="prompt">$</span> <span class="command">git branch</span> <span class="argument">feature/profil</span>

<span class="comment"># Dala geç:</span>
<span class="prompt">$</span> <span class="command">git switch</span> <span class="argument">feature/profil</span>

<span class="comment"># Oluştur ve geç (tek komut):</span>
<span class="prompt">$</span> <span class="command">git switch</span> <span class="flag">-c</span> <span class="argument">feature/ayarlar</span>

<span class="comment"># Dal sil (birleştirilmişse):</span>
<span class="prompt">$</span> <span class="command">git branch</span> <span class="flag">-d</span> <span class="argument">feature/eski</span>

<span class="comment"># Dal sil (zorla — birleştirilmemiş olsa bile):</span>
<span class="prompt">$</span> <span class="command">git branch</span> <span class="flag">-D</span> <span class="argument">feature/deneme</span>

<span class="comment"># Dalı yeniden adlandır:</span>
<span class="prompt">$</span> <span class="command">git branch</span> <span class="flag">-m</span> <span class="argument">eski-ad</span> <span class="argument">yeni-ad</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Dal İsimlendirme Kuralları</div>
    Tutarlı isimlendirme, projeyi düzenli tutar:
    <ul>
        <li><code>feature/</code> → Yeni özellik: <code>feature/login-sayfasi</code></li>
        <li><code>fix/</code> → Hata düzeltme: <code>fix/login-hatasi</code></li>
        <li><code>hotfix/</code> → Acil düzeltme: <code>hotfix/guvenlik-acigi</code></li>
        <li><code>docs/</code> → Belgelendirme: <code>docs/api-dokumantasyonu</code></li>
        <li><code>refactor/</code> → Kod iyileştirme: <code>refactor/veritabani-katmani</code></li>
    </ul>
    Boşluk kullanmayın, tire (-) ile ayırın. Küçük harf kullanın.
</div>

<!-- ============= MERGE VE CONFLICT ============= -->

<h2>Birleştirme (Merge) ve Çakışma Çözümleme</h2>

<h3>Merge — Dalları Birleştirme</h3>
<div class="code-block">
    <div class="code-block-header"><span>Merge işlemi</span></div>
    <pre><code><span class="comment"># Önce hedef dala geç:</span>
<span class="prompt">$</span> <span class="command">git switch</span> <span class="argument">main</span>

<span class="comment"># Feature dalını main'e birleştir:</span>
<span class="prompt">$</span> <span class="command">git merge</span> <span class="argument">feature/login</span>

<span class="comment"># Fast-forward (ileri sar) merge:</span>
<span class="comment"># → main hiç ilerlememiş → Git sadece işaretçiyi ileri taşır</span>
<span class="comment"># → Merge commit oluşturmaz, temiz geçmiş</span>

<span class="comment"># Three-way merge:</span>
<span class="comment"># → Her iki dal da ilerlemiş → Git otomatik merge commit oluşturur</span>

<span class="comment"># Merge'i iptal et (çakışma varsa):</span>
<span class="prompt">$</span> <span class="command">git merge</span> <span class="flag">--abort</span></code></pre>
</div>

<h3>Çakışma (Conflict) Nedir?</h3>
<p>İki dal aynı dosyanın <strong>aynı satırlarını</strong> farklı şekilde değiştirmişse Git hangisini kullanacağını bilemez. Bu duruma <strong>çakışma (conflict)</strong> denir. Korkmayın, çözülmesi kolaydır!</p>

<div class="code-block">
    <div class="code-block-header"><span>Çakışma nasıl görünür?</span></div>
    <pre><code><span class="comment"># Git dosyaya bu işaretçileri ekler:</span>
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
<span style="color:#2a9d8f">Bu satır main dalındaki hali</span>
=======
<span style="color:#e76f51">Bu satır feature dalındaki hali</span>
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/login

<span class="comment"># HEAD (üst)  = Şu an bulunduğunuz dalın versiyonu (main)</span>
<span class="comment"># Alt kısım   = Birleştirmeye çalıştığınız dalın versiyonu</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Çakışma çözümleme — adım adım</span></div>
    <pre><code><span class="comment"># 1. Çakışan dosyaları bul:</span>
<span class="prompt">$</span> <span class="command">git status</span>
both modified:   src/login.py    <span class="comment">← Bu dosyada çakışma var</span>

<span class="comment"># 2. Dosyayı aç ve &lt;&lt;&lt;, ===, &gt;&gt;&gt; işaretlerini bul</span>
<span class="comment"># 3. İstediğiniz hali bırakın, işaretleri silin:</span>
<span class="comment">#    - Sadece main'deki hali tut</span>
<span class="comment">#    - Sadece feature'daki hali tut</span>
<span class="comment">#    - İkisini birleştir</span>
<span class="comment">#    - Tamamen yeni bir şey yaz</span>

<span class="comment"># 4. Çözümlenmiş dosyayı stage'e ekle:</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="path">src/login.py</span>

<span class="comment"># 5. Merge'i tamamla:</span>
<span class="prompt">$</span> <span class="command">git commit</span>  <span class="comment"># Merge commit mesajı otomatik gelir</span>

<span class="comment"># İpucu: VS Code gibi editörler çakışmaları görsel olarak gösterir</span>
<span class="comment"># ve "Accept Current/Incoming/Both" butonları sunar!</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Çakışmayı Azaltmanın Yolları</div>
    <ul>
        <li>Sık sık <code>git pull</code> yaparak main'i güncel tutun</li>
        <li>Küçük, odaklı commit'ler yapın — dev commit'ler çakışma riski taşır</li>
        <li>Takım arası iletişim: "Bu dosya üzerinde çalışıyorum" deyin</li>
        <li>Kısa ömürlü feature dalları kullanın (1-3 gün)</li>
    </ul>
</div>

<!-- ============= REBASE ============= -->

<h3>Rebase — Geçmişi Düzleştirme</h3>
<p>Rebase, dalınızı başka bir dalın <em>ucuna</em> taşır — sanki o daldan yeni ayrılmışsınız gibi. Daha temiz bir geçmiş oluşturur ama dikkatli kullanılmalıdır.</p>

<div class="code-block">
    <div class="code-block-header"><span>Rebase kullanımı</span></div>
    <pre><code><span class="comment"># Feature dalındayken, main'in son halini alarak dalı güncelle:</span>
<span class="prompt">$</span> <span class="command">git switch</span> <span class="argument">feature/login</span>
<span class="prompt">$</span> <span class="command">git rebase</span> <span class="argument">main</span>

<span class="comment"># Sonuç: feature dalınız main'in ucundan devam eder</span>
<span class="comment"># → Temiz, doğrusal bir geçmiş</span>

<span class="comment"># Interactive rebase — commit'leri düzenle:</span>
<span class="prompt">$</span> <span class="command">git rebase</span> <span class="flag">-i</span> <span class="argument">HEAD~3</span>
<span class="comment"># Son 3 commit'i birleştir (squash), düzenle, sırala, sil</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Altın Kural: Paylaşılmış Dalları Rebase Etmeyin!</div>
    <strong>Asla</strong> başkalarının da çalıştığı dalları (main, develop) rebase etmeyin. Rebase geçmişi yeniden yazar — bu, takım arkadaşlarınızın kopyalarıyla çakışma yaratır.<br><br>
    <strong>Kullanım kuralı:</strong> Yerel dalınızı main ile güncellemek için → <code>rebase</code>. Dalları birleştirmek için → <code>merge</code>.
</div>

<!-- ============= UZAK DEPOLAR ============= -->

<h2>Uzak Depolar (Remotes)</h2>
<p>Remote, projenizin GitHub (veya GitLab, Bitbucket) üzerindeki kopyasıdır. Birden fazla remote tanımlayabilirsiniz.</p>

<div class="code-block">
    <div class="code-block-header"><span>Remote işlemleri</span></div>
    <pre><code><span class="comment"># Remote'ları listele:</span>
<span class="prompt">$</span> <span class="command">git remote</span> <span class="flag">-v</span>
origin  git@github.com:ali/proje.git (fetch)
origin  git@github.com:ali/proje.git (push)

<span class="comment"># Yeni remote ekle (fork iş akışında):</span>
<span class="prompt">$</span> <span class="command">git remote add</span> <span class="argument">upstream</span> <span class="argument">https://github.com/orijinal/proje.git</span>

<span class="comment"># Uzaktan değişiklikleri çek:</span>
<span class="prompt">$</span> <span class="command">git fetch</span> <span class="argument">origin</span>          <span class="comment"># İndir ama birleştirme</span>
<span class="prompt">$</span> <span class="command">git pull</span> <span class="argument">origin main</span>     <span class="comment"># fetch + merge</span>
<span class="prompt">$</span> <span class="command">git pull</span> <span class="flag">--rebase</span> <span class="argument">origin main</span>  <span class="comment"># fetch + rebase (daha temiz)</span>

<span class="comment"># Değişiklikleri gönder:</span>
<span class="prompt">$</span> <span class="command">git push</span> <span class="argument">origin main</span>
<span class="prompt">$</span> <span class="command">git push</span> <span class="flag">-u</span> <span class="argument">origin feature/login</span>  <span class="comment"># İlk push + upstream ayarla</span>

<span class="comment"># Uzak dalı sil:</span>
<span class="prompt">$</span> <span class="command">git push</span> <span class="argument">origin</span> <span class="flag">--delete</span> <span class="argument">feature/eski</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 fetch vs pull</div>
    <code>git fetch</code>: Uzaktan değişiklikleri indirir ama birleştirmez. Önce bakmak istiyorsanız güvenli.<br>
    <code>git pull</code>: fetch + merge yapar. Hızlı ama çakışma riski var.<br>
    <strong>Öneri:</strong> Önce <code>git fetch</code>, sonra <code>git log origin/main..main</code> ile farka bakın, sonra birleştirin.
</div>

<!-- ============= GITHUB FORK VE PR ============= -->

<h2>Fork ve Pull Request (PR) — Açık Kaynak Katkısı</h2>
<p>Başkasının projesine katkıda bulunmak isterseniz <strong>Fork + PR</strong> iş akışını kullanırsınız. Bu, açık kaynak dünyasının temel mekanizmasıdır.</p>

<img src="img/git_github_workflow.svg" alt="GitHub Fork ve PR İş Akışı" style="max-width:100%; margin: 1.5rem 0; border-radius: 8px;">

<h3>Adım Adım Fork + PR İş Akışı</h3>

<div class="code-block">
    <div class="code-block-header"><span>Açık kaynak projeye katkıda bulunma</span></div>
    <pre><code><span class="comment"># 1. GitHub'da projeyi Fork'la</span>
<span class="comment">#    → Projenin sayfasında sağ üst köşedeki "Fork" butonuna tıkla</span>
<span class="comment">#    → Kendi hesabında projenin kopyası oluşur</span>

<span class="comment"># 2. Fork'u bilgisayarına klonla:</span>
<span class="prompt">$</span> <span class="command">git clone</span> <span class="argument">git@github.com:ALI/proje.git</span>   <span class="comment"># SENİN fork'un</span>
<span class="prompt">$</span> <span class="command">cd</span> <span class="path">proje</span>

<span class="comment"># 3. Orijinal repoyu upstream olarak ekle:</span>
<span class="prompt">$</span> <span class="command">git remote add</span> <span class="argument">upstream</span> <span class="argument">https://github.com/ORIJINAL-SAHIP/proje.git</span>

<span class="comment"># 4. Yeni dal oluştur (doğrudan main'de çalışmayın!):</span>
<span class="prompt">$</span> <span class="command">git switch</span> <span class="flag">-c</span> <span class="argument">fix/typo-duzelt</span>

<span class="comment"># 5. Değişikliklerinizi yapın ve commit'leyin:</span>
<span class="prompt">$</span> <span class="command">vim</span> <span class="path">README.md</span>   <span class="comment"># Düzenleme yap</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="flag">-A</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"fix: README'deki yazım hatası düzeltildi"</span>

<span class="comment"># 6. Fork'unuza push'layın:</span>
<span class="prompt">$</span> <span class="command">git push</span> <span class="flag">-u</span> <span class="argument">origin fix/typo-duzelt</span>

<span class="comment"># 7. GitHub'da "Compare & Pull Request" butonu gelir → tıklayın</span>
<span class="comment">#    PR başlığı ve açıklaması yazın</span>
<span class="comment">#    "Create Pull Request" tıklayın</span>

<span class="comment"># 8. Proje sahibi PR'ı inceler:</span>
<span class="comment">#    - Onaylarsa → Merge eder ✅</span>
<span class="comment">#    - Değişiklik isterse → Yeni commit yapıp push'larsınız</span>
<span class="comment">#      (PR otomatik güncellenir)</span></code></pre>
</div>

<h3>Fork'unuzu Güncel Tutma</h3>
<div class="code-block">
    <div class="code-block-header"><span>Fork'u orijinal repo ile senkronize etme</span></div>
    <pre><code><span class="comment"># Orijinal repo (upstream) ile senkronize:</span>
<span class="prompt">$</span> <span class="command">git fetch</span> <span class="argument">upstream</span>
<span class="prompt">$</span> <span class="command">git switch</span> <span class="argument">main</span>
<span class="prompt">$</span> <span class="command">git merge</span> <span class="argument">upstream/main</span>
<span class="prompt">$</span> <span class="command">git push</span> <span class="argument">origin main</span>     <span class="comment"># Fork'unuzu da güncelle</span>

<span class="comment"># Veya tek satırda (rebase ile):</span>
<span class="prompt">$</span> <span class="command">git pull</span> <span class="flag">--rebase</span> <span class="argument">upstream main</span></code></pre>
</div>

<h3>İyi Bir Pull Request Nasıl Olmalı?</h3>
<div class="info-box tip">
    <div class="info-box-title">💡 PR Yazma Rehberi</div>
    <ol>
        <li><strong>Başlık:</strong> Kısa ve net. <code>fix: login hatası düzeltildi</code></li>
        <li><strong>Açıklama:</strong>
            <ul>
                <li>Ne değişti ve neden?</li>
                <li>Hangi sorunu çözüyor? (<code>Closes #42</code> yazarak Issue bağlayın)</li>
                <li>Ekran görüntüsü (varsa)</li>
                <li>Nasıl test edilir?</li>
            </ul>
        </li>
        <li><strong>Küçük PR'lar:</strong> Dev PR kimse okumak istemez. 200-400 satır ideal.</li>
        <li><strong>Tek konu:</strong> Her PR tek bir iş yapmalı.</li>
    </ol>
</div>

<!-- ============= GITHUB ISSUES ============= -->

<h2>GitHub Issues — Sorun ve Görev Takibi</h2>
<p>Issues, projedeki hata bildirimlerini, özellik isteklerini ve görev takibini yapmak için kullanılır. Hem açık kaynak hem de takım projelerinde çok kullanılır.</p>

<h3>Issue Nasıl Açılır?</h3>
<ol>
    <li>Projenin GitHub sayfasında <strong>"Issues"</strong> sekmesine tıklayın</li>
    <li><strong>"New issue"</strong> butonuna tıklayın</li>
    <li>Başlık ve açıklama yazın</li>
    <li>Uygun <strong>Label (etiket)</strong> ekleyin: <code>bug</code>, <code>enhancement</code>, <code>documentation</code>, <code>good first issue</code></li>
    <li><strong>Assignee</strong> (sorumlu kişi) atayın (isteğe bağlı)</li>
    <li><strong>"Submit new issue"</strong> tıklayın</li>
</ol>

<h3>İyi Bir Bug Raporu Nasıl Yazılır?</h3>
<div class="code-block">
    <div class="code-block-header"><span>Bug raporu şablonu</span></div>
    <pre><code>## Hata Açıklaması
Login sayfasında "Giriş Yap" butonuna tıklayınca 500 hatası alınıyor.

## Adımlar (Nasıl Tekrarlanır)
1. ana sayfaya git
2. "Giriş Yap" butonuna tıkla
3. E-posta ve şifre gir
4. "Giriş" butonuna tıkla

## Beklenen Davranış
Kullanıcı paneline yönlendirilmeli.

## Gerçekleşen Davranış
500 Internal Server Error sayfası görünüyor.

## Ekran Görüntüsü
[ekran görüntüsü]

## Ortam
- İşletim sistemi: Ubuntu 24.04
- Tarayıcı: Firefox 130
- Versiyon: v2.1.0</code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Issues ile PR Bağlama</div>
    Commit mesajına veya PR açıklamasına <code>Closes #42</code> veya <code>Fixes #42</code> yazarsanız, PR merge edildiğinde Issue <strong>otomatik kapatılır</strong>. Bu çok pratik bir özelliktir!
</div>

<!-- ============= STASH ============= -->

<h2>Stash — Geçici Rafa Kaldırma</h2>
<p>Yarım kalan çalışmanızı commit etmeden geçici olarak saklayıp başka işlere geçebilirsiniz:</p>
<div class="code-block">
    <div class="code-block-header"><span>Stash kullanımı</span></div>
    <pre><code><span class="comment"># Değişiklikleri sakla:</span>
<span class="prompt">$</span> <span class="command">git stash</span>
Saved working directory and index state WIP on main: a1b2c3d

<span class="comment"># Mesajla sakla:</span>
<span class="prompt">$</span> <span class="command">git stash</span> <span class="flag">push -m</span> <span class="string">"Login sayfası yarım kaldı"</span>

<span class="comment"># Saklanan öğeleri listele:</span>
<span class="prompt">$</span> <span class="command">git stash</span> <span class="argument">list</span>
stash@{0}: On main: Login sayfası yarım kaldı
stash@{1}: WIP on main: a1b2c3d

<span class="comment"># Son stash'i geri yükle ve sil:</span>
<span class="prompt">$</span> <span class="command">git stash</span> <span class="argument">pop</span>

<span class="comment"># Geri yükle ama stash'te de tut:</span>
<span class="prompt">$</span> <span class="command">git stash</span> <span class="argument">apply</span>

<span class="comment"># Belirli stash'i uygula:</span>
<span class="prompt">$</span> <span class="command">git stash</span> <span class="argument">apply stash@{1}</span>

<span class="comment"># Stash'i sil:</span>
<span class="prompt">$</span> <span class="command">git stash</span> <span class="argument">drop stash@{0}</span>

<span class="comment"># Tüm stash'leri temizle:</span>
<span class="prompt">$</span> <span class="command">git stash</span> <span class="argument">clear</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Stash Ne Zaman Kullanılır?</div>
    <ul>
        <li>Bir feature üzerinde çalışırken acil bugfix yapmanız gerektiğinde</li>
        <li>Dal değiştirmek isteyip uncommitted değişiklikleriniz olduğunda</li>
        <li>Denemeler yapıp "belki gerekir" dediğiniz kodu saklamak istediğinizde</li>
    </ul>
</div>

<!-- ============= GERİ ALMA ============= -->

<h2>Değişiklikleri Geri Alma</h2>
<p>Hata yaptınız? Panik yok! Git'te neredeyse her şey geri alınabilir:</p>

<div class="code-block">
    <div class="code-block-header"><span>Geri alma yöntemleri</span></div>
    <pre><code><span class="comment"># ━━━ Çalışma Dizinindeki Değişikliği Geri Al ━━━</span>
<span class="prompt">$</span> <span class="command">git restore</span> <span class="path">dosya.txt</span>         <span class="comment"># Son commit'teki haline döndür</span>
<span class="comment"># ⚠️ DİKKAT: Kaydedilmemiş değişiklikler kaybolur!</span>

<span class="comment"># ━━━ Staging'den Çıkar (Unstage) ━━━</span>
<span class="prompt">$</span> <span class="command">git restore</span> <span class="flag">--staged</span> <span class="path">dosya.txt</span>  <span class="comment"># git add'i geri al</span>

<span class="comment"># ━━━ Son Commit'i Düzelt ━━━</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">--amend</span> <span class="flag">-m</span> <span class="string">"Düzeltilmiş mesaj"</span>
<span class="comment"># Dosya da ekleyebilirsiniz: git add unuttugum.py → git commit --amend</span>

<span class="comment"># ━━━ Son Commit'i Geri Al (değişiklikler kalır) ━━━</span>
<span class="prompt">$</span> <span class="command">git reset</span> <span class="flag">--soft</span> HEAD~1

<span class="comment"># ━━━ Son Commit'i Tamamen Geri Al (değişiklikler kaybolur!) ━━━</span>
<span class="prompt">$</span> <span class="command">git reset</span> <span class="flag">--hard</span> HEAD~1

<span class="comment"># ━━━ Güvenli Geri Alma (geçmişi korur) ━━━</span>
<span class="prompt">$</span> <span class="command">git revert</span> <span class="argument">a1b2c3d</span>
<span class="comment"># Belirtilen commit'in tersini yapan yeni commit oluşturur</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 reset vs revert — Ne Zaman Hangisi?</div>
    <table>
        <tr><th></th><th>git reset</th><th>git revert</th></tr>
        <tr><td>Ne yapar?</td><td>Geçmişi siler ↺</td><td>Yeni "geri alma" commit'i oluşturur</td></tr>
        <tr><td>Geçmiş</td><td>Değişir (commit kaybolur)</td><td>Korunur (yeni commit eklenir)</td></tr>
        <tr><td>Ne zaman?</td><td>Henüz push etmemiştiniz</td><td>Push ettiyseniz (başkalarıyla paylaşılan)</td></tr>
        <tr><td>Güvenlik</td><td>⚠️ Tehlikeli (paylaşılan dallarda)</td><td>✅ Güvenli</td></tr>
    </table>
</div>

<!-- ============= .GITIGNORE ============= -->

<h2>.gitignore — Dosyaları Git'ten Gizleme</h2>
<p>Bazı dosyaların Git'te izlenmemesi gerekir: şifreler, derleme çıktıları, bağımlılıklar, log dosyaları... <code>.gitignore</code> dosyası Git'e "bu dosyaları takip etme" der.</p>

<div class="code-block">
    <div class="code-block-header"><span>Kapsamlı .gitignore örneği</span></div>
    <pre><code><span class="comment"># ━━━ Derleme Çıktıları ━━━</span>
*.o
*.class
*.pyc
__pycache__/
build/
dist/
*.egg-info/

<span class="comment"># ━━━ Bağımlılıklar ━━━</span>
node_modules/
vendor/
.venv/
venv/

<span class="comment"># ━━━ IDE / Editör Dosyaları ━━━</span>
.idea/
.vscode/
*.swp
*.swo
*~
.project
.classpath

<span class="comment"># ━━━ Ortam / Gizli Dosyalar (ÇOK ÖNEMLİ!) ━━━</span>
.env
.env.local
.env.production
*.pem
*.key
secrets.json

<span class="comment"># ━━━ İşletim Sistemi Dosyaları ━━━</span>
.DS_Store
Thumbs.db
desktop.ini

<span class="comment"># ━━━ Loglar ve Geçici Dosyalar ━━━</span>
*.log
logs/
tmp/
*.tmp</code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ .env Dosyalarını ASLA Push Etmeyin!</div>
    <code>.env</code> dosyaları şifreler, API anahtarları ve gizli bilgiler içerir. Bunları GitHub'a push etmek <strong>ciddi güvenlik açığıdır</strong>. Hatta botlar GitHub'daki .env dosyalarını tarayarak API anahtarlarını çalar!<br><br>
    <strong>Kural:</strong> <code>.env</code> yerine <code>.env.example</code> dosyası oluşturun (sahte değerlerle) ve bunu commit'leyin. Gerçek değerler sadece yerel <code>.env</code> dosyasında olsun.
</div>

<div class="code-block">
    <div class="code-block-header"><span>.gitignore oluşturma araçları</span></div>
    <pre><code><span class="comment"># gitignore.io — Projenize göre otomatik .gitignore oluşturur:</span>
<span class="comment"># https://www.toptal.com/developers/gitignore</span>

<span class="comment"># Terminalden kullanım:</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-sL</span> <span class="argument">https://www.toptal.com/developers/gitignore/api/python,linux,vscode</span> > <span class="path">.gitignore</span>

<span class="comment"># GitHub da repo oluştururken .gitignore şablonu sunar:</span>
<span class="comment"># New Repository → Add .gitignore → Python/Node/Java vb. seçin</span>

<span class="comment"># Zaten izlenen dosyayı .gitignore'a eklemek yetmez!</span>
<span class="comment"># Önce tracking'den çıkarın:</span>
<span class="prompt">$</span> <span class="command">git rm</span> <span class="flag">--cached</span> <span class="path">.env</span>
<span class="prompt">$</span> <span class="command">echo</span> <span class="string">".env"</span> >> <span class="path">.gitignore</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="path">.gitignore</span> && <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"chore: .env gitignore'a eklendi"</span></code></pre>
</div>

<!-- ============= İŞ AKIŞLARI ============= -->

<h2>Git İş Akışları (Workflows)</h2>

<h3>Feature Branch Workflow</h3>
<p>En yaygın iş akışı. Her yeni özellik için ayrı dal oluşturulur:</p>
<div class="code-block">
    <div class="code-block-header"><span>Feature branch iş akışı</span></div>
    <pre><code><span class="comment"># 1. main dalını güncelle:</span>
<span class="prompt">$</span> <span class="command">git switch</span> main && <span class="command">git pull</span>

<span class="comment"># 2. Yeni feature dalı oluştur:</span>
<span class="prompt">$</span> <span class="command">git switch</span> <span class="flag">-c</span> <span class="argument">feature/yeni-ozellik</span>

<span class="comment"># 3. Geliştirme yap, commit'le:</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="flag">-A</span> && <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"feat: yeni özellik eklendi"</span>

<span class="comment"># 4. Uzağa gönder:</span>
<span class="prompt">$</span> <span class="command">git push</span> <span class="flag">-u</span> <span class="argument">origin feature/yeni-ozellik</span>

<span class="comment"># 5. GitHub'da Pull Request oluştur</span>
<span class="comment"># 6. Kod inceleme (code review) sonrası merge et</span>
<span class="comment"># 7. Feature dalını sil:</span>
<span class="prompt">$</span> <span class="command">git switch</span> main && <span class="command">git pull</span>
<span class="prompt">$</span> <span class="command">git branch</span> <span class="flag">-d</span> <span class="argument">feature/yeni-ozellik</span></code></pre>
</div>

<h3>Git Flow vs GitHub Flow</h3>
<table>
    <tr><th>Özellik</th><th>Git Flow</th><th>GitHub Flow</th></tr>
    <tr><td>Dallar</td><td>main, develop, feature/*, release/*, hotfix/*</td><td>main, feature/*</td></tr>
    <tr><td>Karmaşıklık</td><td>Yüksek</td><td>Düşük</td></tr>
    <tr><td>Uygun olduğu</td><td>Versiyonlu yazılımlar (masaüstü, mobil)</td><td>Sürekli dağıtım (web, SaaS)</td></tr>
    <tr><td>Release</td><td>Planlı release dalları</td><td>main her zaman deploy edilebilir</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Başlangıç İçin Öneri</div>
    <strong>GitHub Flow</strong> kullanın — basit ve etkili. Sadece <code>main</code> ve <code>feature/*</code> dalları yeterli. Feature bitince PR açın, incelenince merge edin. Hepsi bu!
</div>

<!-- ============= GITHUB EKSTRA ============= -->

<h2>GitHub'ın Diğer Faydalı Özellikleri</h2>

<h3>GitHub Pages — Ücretsiz Web Sitesi</h3>
<p>GitHub, statik web sitelerini (<strong>HTML/CSS/JS</strong>) tamamen ücretsiz barındırır. Portfolyo siteniz, proje dokümantasyonunuz veya blogunuz için harika:</p>
<div class="code-block">
    <div class="code-block-header"><span>GitHub Pages kurulumu</span></div>
    <pre><code><span class="comment"># 1. "kullaniciadi.github.io" adlı repo oluştur (public)</span>
<span class="comment"># 2. index.html dosyasını main dalına push'la</span>
<span class="comment"># 3. Settings → Pages → Source: main branch → Save</span>
<span class="comment"># 4. Birkaç dakika sonra:</span>
<span class="comment">#    https://kullaniciadi.github.io adresinde yayında! 🎉</span>

<span class="comment"># Proje bazlı site (her repo için ayrı):</span>
<span class="comment"># Settings → Pages → main branch /docs klasörü seçin</span>
<span class="comment"># → https://kullaniciadi.github.io/repo-adi/</span></code></pre>
</div>

<h3>GitHub Actions — Otomatik Test ve Dağıtım (CI/CD)</h3>
<p>Kod push ettiğinizde otomatik olarak testler çalıştırabilir, projeyi derleyebilir ve dağıtabilirsiniz:</p>
<div class="code-block">
    <div class="code-block-header"><span>.github/workflows/test.yml — Basit CI örneği</span></div>
    <pre><code>name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt
      - run: pytest

<span class="comment"># Bu dosyayı .github/workflows/ klasörüne koyun</span>
<span class="comment"># Her push'ta testler otomatik çalışır!</span></code></pre>
</div>

<h3>README.md — Projenizin Vitrini</h3>
<p>Her repoda mutlaka bir <code>README.md</code> dosyası olmalı. Bu, projenizin "ilk izlenimidir":</p>
<div class="code-block">
    <div class="code-block-header"><span>İyi bir README yapısı</span></div>
    <pre><code># Proje Adı 🚀
Projenin kısa açıklaması.

## Özellikler
- Özellik 1
- Özellik 2

## Kurulum
\`\`\`bash
git clone https://github.com/ali/proje.git
cd proje
pip install -r requirements.txt
\`\`\`

## Kullanım
\`\`\`bash
python main.py
\`\`\`

## Katkıda Bulunma
Pull Request'ler memnuniyetle karşılanır!

## Lisans
MIT</code></pre>
</div>

<!-- ============= GITHUB DESKTOP ============= -->

<h2>GitHub Desktop — Grafik Arayüzlü Git</h2>
<p>Terminalde Git komutları yazmak başlangıçta korkutucu olabilir. <strong>GitHub Desktop</strong>, Git ve GitHub işlemlerini görsel bir arayüzle yapmanızı sağlayan <strong>ücretsiz</strong> bir masaüstü uygulamasıdır.</p>

<div class="info-box note">
    <div class="info-box-title">📌 GitHub Desktop'u Görmek İçin</div>
    Uygulamanın arayüzünü görmek ve indirmek için resmi sayfayı ziyaret edin:<br>
    <a href="https://desktop.github.com/" target="_blank" rel="noopener">🔗 desktop.github.com</a> — Ekran görüntüleri ve indirme linki burada.
</div>

<h3>GitHub Desktop Ne Yapabilir?</h3>
<table>
    <tr><th>Özellik</th><th>Açıklama</th></tr>
    <tr><td>📂 <strong>Clone & Create</strong></td><td>Tek tıklamayla repo klonlama veya yeni repo oluşturma</td></tr>
    <tr><td>✏️ <strong>Görsel Diff</strong></td><td>Değişiklikleri satır satır, renkli olarak görme (yeşil=eklenen, kırmızı=silinen)</td></tr>
    <tr><td>📌 <strong>Kolay Commit</strong></td><td>Checkbox'larla hangi dosyaları dahil edeceğinizi seçin, commit mesajı yazın</td></tr>
    <tr><td>🔀 <strong>Branch İşlemleri</strong></td><td>Dal oluşturma, geçiş yapma, birleştirme — hepsi menüden</td></tr>
    <tr><td>⚡ <strong>Push / Pull</strong></td><td>Tek butonla GitHub'a gönderme veya çekme</td></tr>
    <tr><td>🔧 <strong>Conflict Çözümleme</strong></td><td>Çakışmaları görsel arayüzde çözme</td></tr>
    <tr><td>🔗 <strong>PR Oluşturma</strong></td><td>Doğrudan uygulamadan Pull Request açma</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>GitHub Desktop kurulumu (Linux)</span></div>
    <pre><code><span class="comment"># Linux'ta resmi sürüm yok, topluluk fork'u kullanılır:</span>
<span class="comment"># shiftkey/desktop — GitHub Desktop'un Linux uyumlu fork'u</span>

<span class="comment"># Flatpak ile kurulum (en kolay):</span>
<span class="prompt">$</span> <span class="command">flatpak install</span> <span class="argument">flathub io.github.shiftey.Desktop</span>

<span class="comment"># Veya .deb paketi (Debian/Ubuntu):</span>
<span class="prompt">$</span> <span class="command">wget</span> <span class="argument">https://github.com/shiftkey/desktop/releases/latest/download/GitHubDesktop-linux-amd64-deb.deb</span>
<span class="prompt">$</span> <span class="command">sudo dpkg -i</span> <span class="argument">GitHubDesktop-linux-amd64-deb.deb</span>

<span class="comment"># Windows & macOS: doğrudan desktop.github.com'dan indirin</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Terminal mi, Desktop mı?</div>
    <ul>
        <li><strong>Yeni başlayanlar:</strong> GitHub Desktop ile başlayın, Git kavramlarını görsel olarak öğrenin</li>
        <li><strong>Orta seviye:</strong> Terminal + Desktop birlikte kullanın — karmaşık diff'ler için Desktop, hızlı komutlar için terminal</li>
        <li><strong>İleri düzey:</strong> Terminal yeterli, ama büyük diff inceleme ve conflict çözme için Desktop hâlâ kullanışlı</li>
    </ul>
    <strong>Tavsiye:</strong> İkisini de bilin! Terminali öğrenmek uzun vadede daha güçlü kılar, ama Desktop'u bilmek üretkenliğinizi artırır.
</div>

<!-- ============= GITHUB ORGANIZATIONS ============= -->

<h2>GitHub Organizations — Takım ve Proje Yönetimi</h2>
<p>Bir şirket, açık kaynak topluluk, üniversite kulübü veya takım olarak projeler üzerinde çalışıyorsanız <strong>GitHub Organizations</strong> tam size göre.</p>

<h3>Organization Nedir?</h3>
<p>Organization (Organizasyon), birden fazla kişinin ve reponun tek bir çatı altında yönetilmesini sağlar. Kişisel hesabınızın "takım versiyonu" gibi düşünebilirsiniz.</p>

<table>
    <tr><th>Özellik</th><th>Açıklama</th></tr>
    <tr><td>🏢 <strong>Ortak Çatı</strong></td><td>Tüm projeler tek bir organizasyon altında: <code>github.com/sirket-adi/proje</code></td></tr>
    <tr><td>👥 <strong>Takımlar (Teams)</strong></td><td>Frontend Team, Backend Team, DevOps Team gibi alt gruplar oluşturun</td></tr>
    <tr><td>🔐 <strong>İzin Seviyeleri</strong></td><td><strong>Owner</strong> (tam yetki), <strong>Member</strong> (geliştirici), <strong>Outside Collaborator</strong> (sınırlı erişim)</td></tr>
    <tr><td>📊 <strong>Dashboard</strong></td><td>Organizasyon çapında aktivite takibi, insights, audit log</td></tr>
    <tr><td>🛡️ <strong>Branch Koruması</strong></td><td>Main dalına doğrudan push'u engelleyin, PR zorunluluğu koyun</td></tr>
    <tr><td>💰 <strong>Faturalandırma</strong></td><td>Tek merkezden tüm takım için plan yönetimi</td></tr>
</table>

<h3>Organization Nasıl Oluşturulur?</h3>
<ol>
    <li>GitHub.com → Sağ üst köşe → <strong>"+"</strong> → <strong>"New organization"</strong></li>
    <li>Plan seçin: <strong>Free</strong> (sınırsız public repo, sınırsız üye) başlangıç için yeterli</li>
    <li>Organizasyon adı ve e-posta girin</li>
    <li>Takım üyelerini davet edin (e-posta veya GitHub kullanıcı adı ile)</li>
    <li>Takımlar oluşturun ve repo erişimlerini ayarlayın</li>
</ol>

<div class="info-box note">
    <div class="info-box-title">📌 Gerçek Dünya Örnekleri</div>
    Büyük açık kaynak projelerin hepsi GitHub Organization kullanır:
    <ul>
        <li><a href="https://github.com/facebook" target="_blank" rel="noopener">facebook</a> — React, React Native, PyTorch</li>
        <li><a href="https://github.com/google" target="_blank" rel="noopener">google</a> — TensorFlow, Angular, Go</li>
        <li><a href="https://github.com/microsoft" target="_blank" rel="noopener">microsoft</a> — VS Code, TypeScript, .NET</li>
        <li><a href="https://github.com/torvalds" target="_blank" rel="noopener">torvalds</a> — Linux Kernel</li>
        <li><a href="https://github.com/nodejs" target="_blank" rel="noopener">nodejs</a> — Node.js ekosistemi</li>
    </ul>
    Kendi üniversite kulübünüz veya proje grubunuz için de organizasyon oluşturabilirsiniz!
</div>

<!-- ============= GITHUB ACTIONS DETAYLI ============= -->

<h2>GitHub Actions — CI/CD Detaylı Rehber</h2>
<p><strong>CI/CD (Continuous Integration / Continuous Deployment)</strong>, kod değişikliklerinizin otomatik olarak test edilmesi, derlenmesi ve dağıtılması sürecidir. GitHub Actions bunu doğrudan GitHub üzerinde yapmanızı sağlar — harici bir CI servisi kurmaya gerek yok.</p>

<h3>CI/CD Neden Önemli?</h3>
<ul>
    <li>🐛 <strong>Hataları erken yakala:</strong> Her push'ta testler otomatik çalışır — hatalı kod main'e ulaşamaz</li>
    <li>⚡ <strong>Hızlı geri bildirim:</strong> PR açtığınızda testlerin geçip geçmediğini anında görürsünüz</li>
    <li>🚀 <strong>Otomatik dağıtım:</strong> Main'e merge edince uygulama otomatik deploy olur</li>
    <li>📋 <strong>Tutarlılık:</strong> Her seferinde aynı adımlar çalışır, insan hatası minimuma iner</li>
</ul>

<h3>Workflow Dosyası Yapısı</h3>
<div class="code-block">
    <div class="code-block-header"><span>.github/workflows/ci.yml — Detaylı CI/CD örneği</span></div>
    <pre><code>name: CI Pipeline              <span class="comment"># Workflow adı</span>

on:                             <span class="comment"># Tetikleyiciler (events)</span>
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'         <span class="comment"># Her Pazartesi sabah 06:00 (zamanlanmış)</span>
  workflow_dispatch:             <span class="comment"># Manuel tetikleme butonu</span>

jobs:
  test:
    runs-on: ubuntu-latest      <span class="comment"># Runner (çalışma ortamı)</span>

    strategy:
      matrix:                   <span class="comment"># Birden fazla konfigürasyonda test</span>
        python-version: ['3.10', '3.11', '3.12']
        os: [ubuntu-latest, macos-latest]

    steps:
      - name: Kodu indir
        uses: actions/checkout@v4

      - name: Python kur
        uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}

      - name: Bağımlılıkları yükle
        run: |
          pip install -r requirements.txt
          pip install pytest coverage

      - name: Testleri çalıştır
        run: pytest --coverage

      - name: Lint kontrolü
        run: flake8 src/

  deploy:
    needs: test                 <span class="comment"># Test başarılı olursa çalışır</span>
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: echo "Üretime dağıtım yapılıyor..."
        env:
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}</code></pre>
</div>

<h3>Popüler GitHub Actions</h3>
<table>
    <tr><th>Action</th><th>Ne Yapar</th></tr>
    <tr><td><code>actions/checkout@v4</code></td><td>Repo kodunu runner'a indirir</td></tr>
    <tr><td><code>actions/setup-node@v4</code></td><td>Node.js ortamı kurar</td></tr>
    <tr><td><code>actions/setup-python@v5</code></td><td>Python ortamı kurar</td></tr>
    <tr><td><code>actions/cache@v4</code></td><td>Bağımlılıkları önbelleğe alır (hızlandırır)</td></tr>
    <tr><td><code>softprops/action-gh-release</code></td><td>Otomatik GitHub Release oluşturur</td></tr>
    <tr><td><code>peaceiris/actions-gh-pages</code></td><td>GitHub Pages'e otomatik deploy</td></tr>
</table>

<h3>README'ye CI Badge Ekleme</h3>
<div class="code-block">
    <div class="code-block-header"><span>README.md'ye durum rozeti ekleme</span></div>
    <pre><code><span class="comment"># README.md'nin en üstüne ekleyin:</span>
![CI](https://github.com/KULLANICI/REPO/actions/workflows/ci.yml/badge.svg)

<span class="comment"># Sonuç: README'de yeşil ✅ veya kırmızı ❌ rozet görünür</span>
<span class="comment"># Bu, projenizin testlerinin geçtiğini gösterir — güven verir!</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 GitHub Actions Marketplace</div>
    <a href="https://github.com/marketplace?type=actions" target="_blank" rel="noopener">GitHub Actions Marketplace</a>'te <strong>15.000+</strong> hazır action var. Docker build, AWS deploy, Slack bildirim, kod kalite analizi... Tekerleği yeniden icat etmeyin!
</div>

<!-- ============= GITHUB COPILOT ============= -->

<h2>GitHub Copilot — Yapay Zeka Destekli Kodlama</h2>
<p><strong>GitHub Copilot</strong>, OpenAI modelleri tarafından desteklenen bir AI kod asistanıdır. Gerçek zamanlı olarak kod önerileri sunar, fonksiyon tamamlar ve hatta yorumlardan kod üretir.</p>

<h3>Copilot Ne Yapabilir?</h3>
<table>
    <tr><th>Özellik</th><th>Açıklama</th><th>Örnek</th></tr>
    <tr><td>✨ <strong>Kod Tamamlama</strong></td><td>Yazmaya başladığınız kodu akıllıca tamamlar</td><td>Fonksiyon imzasını yazın → gövdesini önerir</td></tr>
    <tr><td>💬 <strong>Copilot Chat</strong></td><td>Doğal dilde soru sorarak kod üretme</td><td>"Bu fonksiyona birim testi yaz"</td></tr>
    <tr><td>📝 <strong>Yorumdan Kod</strong></td><td>Yorum yazınca ilgili kodu otomatik üretir</td><td><code># listeyi ters çevir</code> → kod gelir</td></tr>
    <tr><td>🐛 <strong>Hata Açıklama</strong></td><td>Hata mesajını yapıştırın, çözüm önerisi alın</td><td>Stack trace → düzeltme önerisi</td></tr>
    <tr><td>📖 <strong>Dokümantasyon</strong></td><td>Fonksiyonlara otomatik docstring ekler</td><td>Fonksiyonu seçin → "Generate docs"</td></tr>
    <tr><td>🔄 <strong>Dil Çevirisi</strong></td><td>Kodu bir dilden diğerine çevirir</td><td>Python → JavaScript dönüşümü</td></tr>
</table>

<h3>Desteklenen Editörler</h3>
<ul>
    <li><strong>VS Code</strong> — En iyi entegrasyon (önerilen)</li>
    <li><strong>JetBrains IDE'ler</strong> — IntelliJ, PyCharm, WebStorm vb.</li>
    <li><strong>Neovim</strong> — Terminal severlere</li>
    <li><strong>Visual Studio</strong> — .NET geliştiricileri için</li>
</ul>

<h3>Fiyatlandırma</h3>
<table>
    <tr><th>Plan</th><th>Fiyat</th><th>Kimler İçin</th></tr>
    <tr><td>🎓 <strong>Öğrenci</strong></td><td><strong>ÜCRETSİZ</strong></td><td>GitHub Student Developer Pack sahibi öğrenciler</td></tr>
    <tr><td>👤 <strong>Individual</strong></td><td>$10/ay</td><td>Bireysel geliştiriciler</td></tr>
    <tr><td>🏢 <strong>Business</strong></td><td>$19/kullanıcı/ay</td><td>Takımlar ve şirketler</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 GitHub Student Developer Pack — Öğrencilere Ücretsiz!</div>
    Öğrenciyseniz <a href="https://education.github.com/pack" target="_blank" rel="noopener">education.github.com/pack</a> adresinden başvurun. Copilot dahil birçok araç ve servis ücretsiz:
    <ul>
        <li>✅ GitHub Copilot (ücretsiz)</li>
        <li>✅ GitHub Pro özellikleri</li>
        <li>✅ JetBrains IDE'ler (ücretsiz lisans)</li>
        <li>✅ .me domain adı (ücretsiz 1 yıl)</li>
        <li>✅ DigitalOcean, Azure kredileri</li>
        <li>✅ Ve 100+ araç daha!</li>
    </ul>
    Tek gereken: <strong>.edu</strong> uzantılı e-posta veya öğrenci belgesi.
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Copilot Kullanırken Dikkat!</div>
    <ul>
        <li>Copilot'un önerdiği kodu <strong>körü körüne kabul etmeyin</strong> — her zaman kontrol edin</li>
        <li>Güvenlik açıkları içerebilir (SQL injection, hardcoded secrets vb.)</li>
        <li>Telif haklı kod üretebilir — özellikle açık kaynak lisanslarına dikkat edin</li>
        <li>AI yardımcı bir araçtır, <strong>programlamayı öğrenmenin yerine geçmez</strong></li>
    </ul>
</div>

<!-- ============= GITHUB CLASSROOM ============= -->

<h2>GitHub Classroom — Eğitimde Git</h2>
<p><strong>GitHub Classroom</strong>, öğretmenlerin GitHub üzerinden ödev oluşturmasını, dağıtmasını ve değerlendirmesini sağlayan ücretsiz bir eğitim platformudur.</p>

<h3>Nasıl Çalışır?</h3>
<ol>
    <li>🏫 Öğretmen <a href="https://classroom.github.com" target="_blank" rel="noopener">classroom.github.com</a>'da sınıf (classroom) oluşturur</li>
    <li>🔗 GitHub Organization'ını sınıfa bağlar</li>
    <li>📝 Ödev (assignment) oluşturur — başlangıç kodu (template repo) ekleyebilir</li>
    <li>📨 Öğrencilere davet linki gönderir</li>
    <li>👩‍💻 Öğrenci linke tıklar → otomatik olarak kişisel repo oluşur</li>
    <li>📤 Öğrenci kodunu yazar, commit eder ve push eder</li>
    <li>✅ GitHub Actions ile <strong>otomatik değerlendirme</strong> (autograding) çalışır</li>
    <li>📊 Öğretmen tüm öğrencilerin ilerlemesini tek panelden takip eder</li>
</ol>

<h3>Ödev Türleri</h3>
<table>
    <tr><th>Tür</th><th>Açıklama</th><th>Örnek</th></tr>
    <tr><td>👤 <strong>Bireysel</strong></td><td>Her öğrenci kendi reposunda çalışır</td><td>Algoritma ödevi, proje teslimi</td></tr>
    <tr><td>👥 <strong>Grup</strong></td><td>Takımlar ortak repoda çalışır</td><td>Dönem projesi, hackathon</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Classroom'un Avantajları</div>
    <ul>
        <li><strong>Öğrenciler için:</strong> Gerçek dünya iş akışını (Git + PR) ödev yaparken öğrenirler</li>
        <li><strong>Öğretmenler için:</strong> Otomatik repo oluşturma, autograding, toplu geri bildirim</li>
        <li><strong>Herkes için:</strong> GitHub'ı eğitim ortamında kullanarak portfolyo oluşturma fırsatı</li>
    </ul>
    Eğer üniversitenizde bir programlama dersi alıyorsanız, hocalarınıza GitHub Classroom'u önerin! 🎓
</div>

<!-- ============= GITHUB CLI ============= -->

<h2>GitHub CLI (gh) — Terminalden GitHub</h2>
<p><strong>GitHub CLI (<code>gh</code>)</strong>, GitHub işlemlerini doğrudan terminalden yapmanızı sağlar. Tarayıcıya geçmeden PR açma, Issue oluşturma, repo klonlama ve daha fazlası:</p>

<div class="code-block">
    <div class="code-block-header"><span>GitHub CLI kurulumu ve temel komutlar</span></div>
    <pre><code><span class="comment"># Kurulum:</span>
<span class="prompt">$</span> <span class="command">sudo apt install</span> <span class="argument">gh</span>           <span class="comment"># Debian/Ubuntu</span>
<span class="prompt">$</span> <span class="command">brew install</span> <span class="argument">gh</span>               <span class="comment"># macOS</span>

<span class="comment"># Giriş yap:</span>
<span class="prompt">$</span> <span class="command">gh auth login</span>

<span class="comment"># ━━━ Repo İşlemleri ━━━</span>
<span class="prompt">$</span> <span class="command">gh repo clone</span> <span class="argument">kullanici/repo</span>   <span class="comment"># Klonla</span>
<span class="prompt">$</span> <span class="command">gh repo create</span> <span class="argument">yeni-proje</span> <span class="flag">--public</span>  <span class="comment"># Yeni repo</span>
<span class="prompt">$</span> <span class="command">gh repo view</span> <span class="flag">--web</span>            <span class="comment"># Tarayıcıda aç</span>

<span class="comment"># ━━━ Pull Request ━━━</span>
<span class="prompt">$</span> <span class="command">gh pr create</span> <span class="flag">--title</span> <span class="string">"feat: yeni özellik"</span> <span class="flag">--body</span> <span class="string">"Açıklama"</span>
<span class="prompt">$</span> <span class="command">gh pr list</span>                     <span class="comment"># PR'ları listele</span>
<span class="prompt">$</span> <span class="command">gh pr checkout</span> <span class="argument">42</span>             <span class="comment"># PR #42'yi yerele çek</span>
<span class="prompt">$</span> <span class="command">gh pr merge</span> <span class="argument">42</span>                <span class="comment"># PR #42'yi merge et</span>

<span class="comment"># ━━━ Issues ━━━</span>
<span class="prompt">$</span> <span class="command">gh issue create</span> <span class="flag">--title</span> <span class="string">"Bug: login hatası"</span>
<span class="prompt">$</span> <span class="command">gh issue list</span>                  <span class="comment"># Issue'ları listele</span>
<span class="prompt">$</span> <span class="command">gh issue close</span> <span class="argument">42</span>             <span class="comment"># Issue #42'yi kapat</span>

<span class="comment"># ━━━ GitHub Actions ━━━</span>
<span class="prompt">$</span> <span class="command">gh run list</span>                    <span class="comment"># Workflow çalıştırmalarını listele</span>
<span class="prompt">$</span> <span class="command">gh run view</span> <span class="argument">12345</span>             <span class="comment"># Detay görüntüle</span>
<span class="prompt">$</span> <span class="command">gh run watch</span>                   <span class="comment"># Canlı takip et</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 gh + git = Süper Güç</div>
    <code>gh</code> komutu Git'in yerini almaz, onu <strong>tamamlar</strong>. Git ile commit/push/pull yaparsınız, <code>gh</code> ile PR açar, Issue yönetir, Actions izlersiniz. İkisi birlikte kullanıldığında tarayıcıya neredeyse hiç gitmenize gerek kalmaz!
</div>

<div class="info-box note">
    <div class="info-box-title">📌 GitHub Education Kaynakları</div>
    <ul>
        <li><a href="https://education.github.com/" target="_blank" rel="noopener">education.github.com</a> — GitHub Education ana sayfası</li>
        <li><a href="https://education.github.com/pack" target="_blank" rel="noopener">Student Developer Pack</a> — Öğrencilere ücretsiz araçlar</li>
        <li><a href="https://education.github.com/teachers" target="_blank" rel="noopener">Teacher Toolbox</a> — Eğitimcilere özel araçlar</li>
        <li><a href="https://skills.github.com/" target="_blank" rel="noopener">GitHub Skills</a> — İnteraktif GitHub öğrenme kursları (uygulamalı)</li>
        <li><a href="https://github.com/readme/guides" target="_blank" rel="noopener">GitHub Guides</a> — GitHub'ı anlatan resimli rehberler</li>
        <li><a href="https://docs.github.com/en" target="_blank" rel="noopener">GitHub Docs</a> — Resmi dokümantasyon (ekran görüntüleriyle)</li>
    </ul>
</div>

<!-- ============= İLERİ DÜZEY KOMUTLAR ============= -->

<h2>Yararlı İleri Düzey Git Komutları</h2>
<div class="code-block">
    <div class="code-block-header"><span>İleri düzey komutlar</span></div>
    <pre><code><span class="comment"># ━━━ Cherry-pick: Belirli commit'i başka dala uygula ━━━</span>
<span class="prompt">$</span> <span class="command">git cherry-pick</span> <span class="argument">a1b2c3d</span>

<span class="comment"># ━━━ Tag: Sürüm etiketleme ━━━</span>
<span class="prompt">$</span> <span class="command">git tag</span> <span class="flag">-a</span> <span class="argument">v1.0.0</span> <span class="flag">-m</span> <span class="string">"İlk kararlı sürüm"</span>
<span class="prompt">$</span> <span class="command">git push</span> <span class="argument">origin</span> <span class="flag">--tags</span>

<span class="comment"># ━━━ Bisect: Hatayı hangi commit ekledi? ━━━</span>
<span class="prompt">$</span> <span class="command">git bisect</span> start
<span class="prompt">$</span> <span class="command">git bisect</span> bad          <span class="comment"># Şu an hatalı</span>
<span class="prompt">$</span> <span class="command">git bisect</span> good <span class="argument">v1.0.0</span>  <span class="comment"># Bu sürüm çalışıyordu</span>
<span class="comment"># Git ikili arama yapar, "good/bad" diye işaretleyin</span>

<span class="comment"># ━━━ Reflog: Git'in "geri dönüşüm kutusu" ━━━</span>
<span class="prompt">$</span> <span class="command">git reflog</span>
<span class="comment"># Yanlışlıkla sildiyseniz bile commit'leri kurtarabilirsiniz:</span>
<span class="prompt">$</span> <span class="command">git reset</span> <span class="flag">--hard</span> <span class="argument">HEAD@{5}</span>

<span class="comment"># ━━━ Katkıda bulunanlar ━━━</span>
<span class="prompt">$</span> <span class="command">git shortlog</span> <span class="flag">-sn</span>  <span class="comment"># Kişi başı commit sayısı</span>

<span class="comment"># ━━━ Alias (kısayol) tanımlama ━━━</span>
<span class="prompt">$</span> <span class="command">git config</span> <span class="flag">--global</span> alias.st <span class="string">"status -s"</span>
<span class="prompt">$</span> <span class="command">git config</span> <span class="flag">--global</span> alias.co <span class="string">"checkout"</span>
<span class="prompt">$</span> <span class="command">git config</span> <span class="flag">--global</span> alias.br <span class="string">"branch"</span>
<span class="prompt">$</span> <span class="command">git config</span> <span class="flag">--global</span> alias.lg <span class="string">"log --oneline --graph --all --decorate"</span>
<span class="comment"># Artık: git st, git co, git br, git lg</span></code></pre>
</div>

<!-- ============= GİT DAHİLİ YAPISI ============= -->

<h2>Git Dahili Yapısı (İç Mimari)</h2>
<p>Git'in altında 4 temel nesne türü vardır. Bunu bilmek zorunlu değil ama Git'in neden bu kadar güçlü olduğunu anlamanıza yardımcı olur:</p>
<table>
    <tr><th>Nesne</th><th>İngilizce</th><th>Açıklama</th></tr>
    <tr><td><strong>Blob</strong></td><td>Binary Large Object</td><td>Dosya içeriği (sadece veri, isim yok)</td></tr>
    <tr><td><strong>Tree</strong></td><td>Ağaç</td><td>Dizin yapısı: blob ve tree referansları + dosya isimleri</td></tr>
    <tr><td><strong>Commit</strong></td><td>İşleme</td><td>Bir tree'ye işaretçi + yazar + mesaj + parent commit</td></tr>
    <tr><td><strong>Tag</strong></td><td>Etiket</td><td>Bir commit'e kalıcı isim (v1.0.0)</td></tr>
</table>
<p>Her nesne SHA-1 hash ile tanımlanır. Bu nedenle Git, veri bütünlüğünü garanti eder — herhangi bir bit değişse hash değişir.</p>

<div class="code-block">
    <div class="code-block-header"><span>Git'in iç yapısını keşfetme</span></div>
    <pre><code><span class="comment"># .git klasörüne bakın:</span>
<span class="prompt">$</span> <span class="command">ls</span> <span class="path">.git/</span>
HEAD  config  hooks/  objects/  refs/

<span class="comment"># HEAD nereyi gösteriyor?</span>
<span class="prompt">$</span> <span class="command">cat</span> <span class="path">.git/HEAD</span>
ref: refs/heads/main

<span class="comment"># Commit nesnesinin içi:</span>
<span class="prompt">$</span> <span class="command">git cat-file</span> <span class="flag">-p</span> <span class="argument">HEAD</span>
tree 4b825dc6...
author Ali Yılmaz ...
committer Ali Yılmaz ...
feat: ilk commit</code></pre>
</div>

<!-- ============= ÖZET TABLO ============= -->

<h2>Hızlı Başvuru — En Sık Kullanılan Komutlar</h2>
<table>
    <tr><th>Komut</th><th>Ne Yapar</th><th>Ne Zaman Kullanılır</th></tr>
    <tr><td><code>git init</code></td><td>Yeni repo başlatır</td><td>Yeni proje oluştururken</td></tr>
    <tr><td><code>git clone URL</code></td><td>Repoyu indirir</td><td>Mevcut projeyle çalışırken</td></tr>
    <tr><td><code>git status</code></td><td>Durumu gösterir</td><td>Her zaman! Şüphede kalınca</td></tr>
    <tr><td><code>git add -A</code></td><td>Tüm değişiklikleri stage'ler</td><td>Commit öncesi</td></tr>
    <tr><td><code>git commit -m "mesaj"</code></td><td>Kalıcı kayıt oluşturur</td><td>Mantıklı bir birim tamamlandığında</td></tr>
    <tr><td><code>git push</code></td><td>GitHub'a gönderir</td><td>Commit sonrası</td></tr>
    <tr><td><code>git pull</code></td><td>GitHub'dan çeker</td><td>Çalışma başlangıcında</td></tr>
    <tr><td><code>git log --oneline</code></td><td>Geçmişi gösterir</td><td>Ne yapıldığını görmek için</td></tr>
    <tr><td><code>git switch -c dal</code></td><td>Yeni dal oluşturur</td><td>Yeni feature başlarken</td></tr>
    <tr><td><code>git merge dal</code></td><td>Dalları birleştirir</td><td>Feature bittiğinde</td></tr>
    <tr><td><code>git stash</code></td><td>Geçici saklar</td><td>Acil dal değişikliğinde</td></tr>
    <tr><td><code>git diff</code></td><td>Farkları gösterir</td><td>Commit öncesi kontrol</td></tr>
</table>

<!-- ============= GÜNLÜK İŞ AKIŞI ============= -->

<h2>Günlük Git Rutini — Pratik Senaryo</h2>
<p>Bir yazılımcının tipik günlük Git kullanımı:</p>

<div class="code-block">
    <div class="code-block-header"><span>Günlük Git rutini</span></div>
    <pre><code><span class="comment"># ☕ Sabah — Güne başla:</span>
<span class="prompt">$</span> <span class="command">cd</span> <span class="path">~/projeler/web-app</span>
<span class="prompt">$</span> <span class="command">git switch</span> main
<span class="prompt">$</span> <span class="command">git pull</span>              <span class="comment"># Takımın son değişikliklerini al</span>

<span class="comment"># 🔨 Yeni özellik geliştir:</span>
<span class="prompt">$</span> <span class="command">git switch</span> <span class="flag">-c</span> <span class="argument">feature/sepet-sayfasi</span>
<span class="comment"># ... kodlama yap ...</span>
<span class="prompt">$</span> <span class="command">git status</span>            <span class="comment"># Neyi değiştirdim?</span>
<span class="prompt">$</span> <span class="command">git diff</span>              <span class="comment"># Detaylı farklar</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="flag">-A</span>
<span class="prompt">$</span> <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"feat: sepet sayfası tasarımı eklendi"</span>

<span class="comment"># 🍽️ Öğleden sonra — birkaç commit daha:</span>
<span class="comment"># ... kodlama ...</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="flag">-A</span> && <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"feat: sepete ürün ekleme fonksiyonu"</span>
<span class="comment"># ... kodlama ...</span>
<span class="prompt">$</span> <span class="command">git add</span> <span class="flag">-A</span> && <span class="command">git commit</span> <span class="flag">-m</span> <span class="string">"test: sepet testleri eklendi"</span>

<span class="comment"># 🚀 Push et ve PR aç:</span>
<span class="prompt">$</span> <span class="command">git push</span> <span class="flag">-u</span> <span class="argument">origin feature/sepet-sayfasi</span>
<span class="comment"># GitHub'da PR aç → Takım arkadaşı inceler → Merge! ✅</span>

<span class="comment"># 🧹 Temizlik:</span>
<span class="prompt">$</span> <span class="command">git switch</span> main && <span class="command">git pull</span>
<span class="prompt">$</span> <span class="command">git branch</span> <span class="flag">-d</span> <span class="argument">feature/sepet-sayfasi</span></code></pre>
</div>

<!-- ============= DIŞ KAYNAKLAR ============= -->

<h2>Dış Kaynaklar ve Faydalı Linkler</h2>

<div class="info-box tip">
    <div class="info-box-title">📚 Git Öğrenme Kaynakları</div>
    <ul>
        <li><a href="https://git-scm.com/book/tr/v2" target="_blank" rel="noopener">Pro Git Kitabı (Türkçe)</a> — Scott Chacon'un ücretsiz, kapsamlı Git kitabı</li>
        <li><a href="https://learngitbranching.js.org/?locale=tr_TR" target="_blank" rel="noopener">Learn Git Branching</a> — İnteraktif, görsel Git eğitimi (Türkçe)</li>
        <li><a href="https://ohshitgit.com/" target="_blank" rel="noopener">Oh Shit, Git!?!</a> — Git'te yapılan hataları düzeltme rehberi</li>
        <li><a href="https://www.atlassian.com/git/tutorials" target="_blank" rel="noopener">Atlassian Git Tutorials</a> — İleri düzey Git kavramları ve iş akışları</li>
        <li><a href="https://missing.csail.mit.edu/2020/version-control/" target="_blank" rel="noopener">MIT Missing Semester — Git</a> — MIT'nin mükemmel Git dersi</li>
        <li><a href="https://www.toptal.com/developers/gitignore" target="_blank" rel="noopener">gitignore.io</a> — Projenize uygun .gitignore oluşturucu</li>
        <li><a href="https://www.conventionalcommits.org/tr/v1.0.0/" target="_blank" rel="noopener">Conventional Commits</a> — Commit mesajı standardı</li>
    </ul>
</div>

<div class="info-box note">
    <div class="info-box-title">🔗 GitHub Resmi Kaynaklar (Ekran Görüntülü Rehberler)</div>
    <ul>
        <li><a href="https://docs.github.com/en/get-started" target="_blank" rel="noopener">GitHub Docs — Getting Started</a> — Resmi başlangıç rehberi (adım adım ekran görüntüleriyle)</li>
        <li><a href="https://docs.github.com/en/get-started/start-your-journey/hello-world" target="_blank" rel="noopener">GitHub Hello World</a> — GitHub'ın kendi "Hello World" tutorial'ı (ekran görüntülü)</li>
        <li><a href="https://skills.github.com/" target="_blank" rel="noopener">GitHub Skills</a> — İnteraktif GitHub öğrenme kursları (uygulamalı repositoryler)</li>
        <li><a href="https://github.com/readme/guides" target="_blank" rel="noopener">GitHub Guides</a> — Adım adım resimli rehberler</li>
        <li><a href="https://docs.github.com/en/repositories" target="_blank" rel="noopener">GitHub Docs — Repositories</a> — Repo yönetimi detaylı rehber</li>
        <li><a href="https://docs.github.com/en/pull-requests" target="_blank" rel="noopener">GitHub Docs — Pull Requests</a> — PR oluşturma ve inceleme rehberi</li>
        <li><a href="https://docs.github.com/en/actions" target="_blank" rel="noopener">GitHub Docs — Actions</a> — CI/CD workflow detayları</li>
        <li><a href="https://docs.github.com/en/organizations" target="_blank" rel="noopener">GitHub Docs — Organizations</a> — Takım yönetimi rehberi</li>
        <li><a href="https://docs.github.com/en/copilot" target="_blank" rel="noopener">GitHub Docs — Copilot</a> — AI asistan kurulum ve kullanım rehberi</li>
    </ul>
</div>

<div class="info-box tip">
    <div class="info-box-title">🛠️ GitHub Araçları ve Platformlar</div>
    <ul>
        <li><a href="https://desktop.github.com/" target="_blank" rel="noopener">GitHub Desktop</a> — Grafik arayüzlü Git istemcisi</li>
        <li><a href="https://cli.github.com/" target="_blank" rel="noopener">GitHub CLI (gh)</a> — Terminalden GitHub: <code>gh pr create</code>, <code>gh issue list</code></li>
        <li><a href="https://github.com/mobile" target="_blank" rel="noopener">GitHub Mobile</a> — iOS ve Android'de GitHub</li>
        <li><a href="https://github.com/features/copilot" target="_blank" rel="noopener">GitHub Copilot</a> — AI destekli kod yazma asistanı</li>
        <li><a href="https://classroom.github.com/" target="_blank" rel="noopener">GitHub Classroom</a> — Eğitimciler için ödev yönetimi</li>
        <li><a href="https://education.github.com/pack" target="_blank" rel="noopener">Student Developer Pack</a> — Öğrencilere ücretsiz araçlar</li>
        <li><a href="https://github.com/marketplace" target="_blank" rel="noopener">GitHub Marketplace</a> — 15.000+ action ve uygulama</li>
        <li><a href="https://gist.github.com/" target="_blank" rel="noopener">GitHub Gist</a> — Kod parçacıkları paylaşma</li>
    </ul>
</div>
`,
    quiz: [
        {
            question: "Git ile GitHub arasındaki temel fark nedir?",
            options: ["İkisi aynı şeydir", "Git bir yazılımdır, GitHub ise bir web platformudur", "GitHub ücretsizdir, Git ücretlidir", "Git sadece Linux'ta çalışır"],
            correct: 1,
            explanation: "Git bilgisayarınızda çalışan bir versiyon kontrol yazılımıdır. GitHub ise Git depolarınızı bulutta barındıran ve iş birliği araçları sunan bir web platformudur."
        },
        {
            question: "Git'i diğer VCS'lerden ayıran en önemli özellik nedir?",
            options: ["Ücretsiz olması", "Dağıtık (distributed) olması", "Grafik arayüzü", "Otomatik yedekleme"],
            correct: 1,
            explanation: "Git dağıtıktır — her geliştirici tüm geçmişin tam kopyasına sahiptir. Merkezi sunucu çökse bile çalışmaya devam edersiniz."
        },
        {
            question: "'git add' ile 'git commit' arasındaki fark nedir?",
            options: ["İkisi aynı şeydir", "add dosyayı staging'e ekler, commit kalıcı olarak kaydeder", "add uzağa gönderir, commit yerelde kaydeder", "add siler, commit geri alır"],
            correct: 1,
            explanation: "git add dosyaları staging area'ya (hazırlık alanı) ekler. git commit staging'deki değişiklikleri kalıcı olarak depoya kaydeder."
        },
        {
            question: "Başkasının GitHub projesine katkıda bulunmak için hangi iş akışı kullanılır?",
            options: ["Doğrudan main'e push etme", "Fork → Branch → Commit → Push → Pull Request", "E-posta ile kod gönderme", "Dosyayı indirip tekrar yükleme"],
            correct: 1,
            explanation: "Açık kaynak katkısı için: Projeyi Fork'la → Klonla → Yeni dal oluştur → Değişiklik yap → Push et → Pull Request aç."
        },
        {
            question: "İki dal aynı dosyanın aynı satırını değiştirmişse ne olur?",
            options: ["Git otomatik çözer", "Merge conflict (çakışma) oluşur", "Dosya silinir", "Son değişiklik kazanır"],
            correct: 1,
            explanation: "Git aynı satırda farklı değişiklikleri otomatik birleştiremediğinde conflict oluşur. Manuel olarak çözmeniz gerekir."
        },
        {
            question: ".env dosyalarını neden .gitignore'a eklemelisiniz?",
            options: ["Dosya boyutu çok büyük olduğu için", "Şifre ve API anahtarı içerdiği için — güvenlik açığı yaratır", "Git .env dosyalarını desteklemediği için", "Sadece gelenek olduğu için"],
            correct: 1,
            explanation: ".env dosyaları şifreler ve API anahtarları içerir. GitHub'a push etmek ciddi güvenlik açığıdır — botlar bu dosyaları tarayarak anahtarları çalar!"
        },
        {
            question: "'git stash' ne işe yarar?",
            options: ["Dosyaları siler", "Yarım kalan çalışmayı geçici saklar", "Uzağa gönderir", "Branch oluşturur"],
            correct: 1,
            explanation: "git stash, commit etmeden önce yarım kalan değişiklikleri geçici olarak rafa kaldırır. Başka işlere geçip sonra geri dönebilirsiniz."
        },
        {
            question: "'git reset --hard HEAD~1' ile 'git revert HEAD' arasındaki fark nedir?",
            options: ["İkisi aynıdır", "reset geçmişi siler, revert geri alma commit'i oluşturur", "revert daha yavaştır", "reset daha güvenlidir"],
            correct: 1,
            explanation: "reset --hard son commit'i siler (tehlikeli). revert ise değişiklikleri geri alan yeni bir commit oluşturur (geçmiş korunur, güvenli)."
        },
        {
            question: "Hangi dosya Git'e hangi dosyaları izlememesi gerektiğini söyler?",
            options: [".gitconfig", ".gitignore", ".gitkeep", ".gitmodules"],
            correct: 1,
            explanation: ".gitignore dosyası, Git'in izlememesi gereken dosya ve dizin kalıplarını tanımlar (node_modules/, *.log, .env vb.)."
        },
        {
            question: "Pull Request (PR) açarken commit mesajına 'Closes #42' yazmak ne işe yarar?",
            options: ["Sadece dekorasyon", "PR merge edildiğinde #42 numaralı Issue otomatik kapatılır", "42. satırı siler", "42. commit'e geri döner"],
            correct: 1,
            explanation: "'Closes #42' veya 'Fixes #42' yazarsanız, PR merge edildiğinde ilgili Issue otomatik olarak kapatılır. Çok pratik bir GitHub özelliğidir!"
        },
        {
            question: "GitHub Pages ne işe yarar?",
            options: ["Veritabanı barındırır", "Statik web sitelerini ücretsiz barındırır", "E-posta gönderir", "Video hosting yapar"],
            correct: 1,
            explanation: "GitHub Pages, HTML/CSS/JS dosyalarınızı ücretsiz olarak web'de yayınlar. Portfolyo siteleri, proje dokümantasyonları ve bloglar için idealdir."
        },
        {
            question: "SSH anahtarını GitHub'a eklemenin faydası nedir?",
            options: ["Kodları şifreler", "Her push/pull'da şifre girmek zorunda kalmazsınız", "Repoyu daha hızlı klonlar", "Otomatik commit yapar"],
            correct: 1,
            explanation: "SSH anahtarı bir kez kurulur ve sonrasında her push/pull işleminde otomatik kimlik doğrulama yapar. Şifre girmenize gerek kalmaz."
        },
        {
            question: "GitHub Desktop ne işe yarar?",
            options: ["GitHub'ın web sitesini açar", "Git işlemlerini grafik arayüzle yapmanızı sağlar", "Sadece Windows'ta çalışır", "Otomatik kod yazar"],
            correct: 1,
            explanation: "GitHub Desktop, commit, branch, push, pull gibi Git işlemlerini görsel arayüzle yapmanızı sağlayan ücretsiz masaüstü uygulamasıdır. Linux'ta topluluk fork'u (shiftkey/desktop) ile kullanılabilir."
        },
        {
            question: "GitHub Organizations ne için kullanılır?",
            options: ["Kişisel blog yazmak için", "Birden fazla kişi ve projeyi tek çatı altında yönetmek için", "Git'i kaldırmak için", "Sadece büyük şirketler kullanabilir"],
            correct: 1,
            explanation: "GitHub Organizations, takımların birden fazla repo ve üyeyi tek bir çatı altında yönetmesini sağlar. Şirketler, açık kaynak topluluklar ve öğrenci kulüpleri tarafından kullanılır."
        },
        {
            question: "GitHub Copilot nedir?",
            options: ["Bir versiyon kontrol sistemi", "Yapay zeka destekli kod yazma asistanı", "GitHub'ın mobil uygulaması", "Bir programlama dili"],
            correct: 1,
            explanation: "GitHub Copilot, OpenAI modelleri tarafından desteklenen bir AI kod asistanıdır. Gerçek zamanlı kod önerileri sunar ve öğrencilere ücretsizdir (Student Developer Pack ile)."
        },
        {
            question: "GitHub Classroom ne amaçla kullanılır?",
            options: ["Online toplantı yapmak için", "Öğretmenlerin GitHub üzerinden ödev oluşturması ve değerlendirmesi için", "Sadece sınav yapmak için", "GitHub hesabı silmek için"],
            correct: 1,
            explanation: "GitHub Classroom, eğitimcilerin ödev oluşturmasını, dağıtmasını ve otomatik değerlendirmesini (autograding) sağlayan ücretsiz bir platformdur."
        },
        {
            question: "GitHub Actions CI/CD pipeline'ında 'matrix strategy' ne işe yarar?",
            options: ["Dosyaları matris şeklinde sıralar", "Birden fazla OS/versiyon kombinasyonunda test çalıştırır", "Sadece gece çalışır", "Branch'ları otomatik siler"],
            correct: 1,
            explanation: "Matrix strategy, testlerinizi birden fazla işletim sistemi ve dil versiyonu kombinasyonunda paralel olarak çalıştırmanızı sağlar (örn: Python 3.10, 3.11, 3.12 + Ubuntu, macOS)."
        },
        {
            question: "'gh pr create' komutu ne yapar?",
            options: ["Git dalı oluşturur", "Terminalden Pull Request açar", "Dosya siler", "Repo klonlar"],
            correct: 1,
            explanation: "'gh' komutu GitHub CLI aracıdır. 'gh pr create' komutu terminalden doğrudan Pull Request oluşturmanızı sağlar — tarayıcıya geçmenize gerek kalmaz."
        },
        {
            question: "GitLab'ın GitHub'dan en belirgin farkı nedir?",
            options: ["Ücretsiz olmaması", "CI/CD'nin doğrudan platforma entegre olması ve self-hosted kurulabilmesi", "Sadece Linux'ta çalışması", "Git kullanmaması"],
            correct: 1,
            explanation: "GitLab'ın en güçlü yönü CI/CD'nin platforma gömülü olması ve Community Edition'ın kendi sunucunuza ücretsiz kurulabilmesidir. GitHub'da CI/CD Actions ile sağlanır."
        },
        {
            question: "GitHub web arayüzünde bir repo sayfasında '.' tuşuna basarsanız ne olur?",
            options: ["Repo silinir", "VS Code'un web versiyonu (github.dev) açılır", "Terminal açılır", "Hiçbir şey olmaz"],
            correct: 1,
            explanation: "GitHub'da herhangi bir repo sayfasında '.' tuşuna basınca github.dev (VS Code web editörü) açılır. Terminal olmadan güçlü düzenleme yapabilirsiniz!"
        }
    ]
});
