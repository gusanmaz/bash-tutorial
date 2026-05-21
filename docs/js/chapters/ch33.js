// ===== Bölüm 33: CI/CD — Felsefe ve Temel Kavramlar =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 33,
    title: 'CI/CD: Felsefe ve Temel Kavramlar',
    subtitle: 'Continuous Integration & Delivery Explained',
    icon: '🔄',
    description: 'TGO (tümleşik geliştirme ortamı) haritası, CI/CD felsefesi, CD stratejileri ve Docker ile uyum. DevOps dünyasına sıfırdan giriş.',
    content: `
<h2>Her Push'ta Panik Mi Yaşıyorsunuz?</h2>
<div class="info-box tip">
    <div class="info-box-title">💡 Bu bölümde 📌 kutuları</div>
    Staging, migration, FTP, pipeline gibi terimler ilk geçtiğinde <strong>📌 not kutularında</strong> sade Türkçe ile açıklanır. Teknik geçmişiniz az olsa da takip edebilmeniz için yazıldı.
</div>
<p>Bir özellik yazdınız, test ettiniz, "çalışıyor" dediniz ve <code>git push</code> yaptınız (kodu GitHub'a gönderdiniz). Sonra işler ters gitti:</p>
<ul>
    <li>Arkadaşınızın bilgisayarında otomatik testler başarısız oldu.</li>
    <li>Deneme sunucusunda sizin bilgisayarınızdan farklı bir Python sürümü vardı.</li>
    <li>Yeni sürümü kurarken veritabanı güncellemesi atlandı — uygulama açılmadı.</li>
    <li>Canlı siteye dosya yüklerken yanlış klasöre kopyalandı — site çöktü.</li>
</ul>

<div class="info-box note">
    <div class="info-box-title">📌 Bu maddelerdeki terimler ne demek?</div>
    <ul>
        <li><strong>Push</strong>: Yerel bilgisayarınızdaki kod değişikliklerini uzaktaki Git deposuna (ör. GitHub) göndermek.</li>
        <li><strong>Testler kırıldı</strong>: Yazdığınız küçük otomatik kontroller (ör. "sayfa 200 mü dönüyor?") hata verdi — kod beklediğiniz gibi çalışmıyor demektir.</li>
        <li><strong>Staging sunucusu</strong> (<em>deneme / sahne ortamı</em>): Gerçek kullanıcıya açılmadan <em>önce</em> kodun denendiği sunucu. Tiyatroda "genel prova" gibidir — hata burada çıkarsa canlı site etkilenmez.</li>
        <li><strong>Production</strong> (<em>canlı ortam / prod</em>): Gerçek kullanıcıların girdiği site veya uygulama. <code>sirketim.com</code> adresindeki canlı hizmet budur.</li>
        <li><strong>Veritabanı migration</strong> (<em>veritabanı göçü</em>): Uygulama kodunu güncellediğinizde veritabanı tablolarının da uyumlu hale getirilmesi. Örneğin yeni bir "telefon numarası" alanı eklediyseniz, veritabanına da o sütun eklenmelidir — unutulursa uygulama hata verir.</li>
        <li><strong>FTP</strong> (<em>File Transfer Protocol</em>): İnternet üzerinden dosya yüklemenin eski yöntemi. Günümüzde yerine genelde Git + otomatik kurulum (CI/CD) tercih edilir; elle FTP ile dosya atmak hataya açıktır.</li>
        <li><strong>Deploy</strong> (<em>dağıtım / yayına alma</em>): Yazdığınız yeni kod sürümünü sunucuya kurup kullanıcıların erişebileceği hale getirmek.</li>
    </ul>
</div>

<p>Bu kaos, yazılım ekiplerinin yıllardır yaşadığı gerçek. Çözüm: <strong>CI/CD</strong> — kodunuz her değiştiğinde belirli adımlar (test, paketleme, kurulum) <strong>insan eli değmeden</strong> otomatik çalışır.</p>

<h2>Tümleşik Geliştirme Ortamı (TGO) Nedir?</h2>
<div class="info-box note">
    <div class="info-box-title">📌 TGO = tek zincirde birleşen araçlar</div>
    Üniversite derslerinde ve iş hayatında <strong>Tümleşik Geliştirme Ortamları (TGO)</strong> denince genelde sadece VS Code gibi bir editör değil, <em>geliştirmeden canlıya kadar</em> tüm araçların birlikte çalışması kastedilir:
    <ul>
        <li><strong>Git</strong> — Kod versiyonlama (Bölüm 16)</li>
        <li><strong>CI/CD</strong> — Otomatik test, build, deploy (Bölüm 33–37)</li>
        <li><strong>Docker</strong> — Paketleme, taşınabilir imaj (Bölüm 28–32)</li>
        <li><strong>Kubernetes</strong> — Ölçekleme, orkestrasyon (Bölüm 38–42)</li>
        <li><strong>IaC</strong> (Infrastructure as Code) — Sunucu/küme ayarlarını kodla tanımlama (Bölüm 42)</li>
    </ul>
    Amaç: "Benim bilgisayarımda çalışıyordu" derdini azaltmak ve her değişikliği güvenle canlıya taşımak.
</div>

<div class="code-block">
    <div class="code-block-header"><span>TGO zinciri — uçtan uca</span></div>
    <pre><code>Geliştirici (IDE + terminal)
        │
        ▼  git commit / push
┌───────────────────┐
│  Git (GitHub)     │  ← Kaynak kod, PR, code review
└─────────┬─────────┘
          ▼  webhook tetikler
┌───────────────────┐
│  CI/CD Pipeline   │  ← lint, test, docker build
│  (GitHub Actions) │
└─────────┬─────────┘
          ▼  imaj push
┌───────────────────┐
│  Registry         │  ← Docker Hub / GHCR
│  (imaj deposu)    │
└─────────┬─────────┘
          ▼  deploy
    ┌─────┴─────┐
    ▼           ▼
┌────────┐  ┌────────────┐
│ VPS /  │  │ Kubernetes │  ← Bölüm 36: SSH deploy | K8s deploy
│ Docker │  │ kümesi     │
└────────┘  └────────────┘
          ▼
   Canlı kullanıcı (production)</code></pre>
</div>

<p>Bu eğitimde TGO'yu parça parça kuruyoruz: önce Bash ve Git, sonra Docker, ardından CI/CD, en son Kubernetes. Her parça bir sonrakinin temelidir.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 CI/CD'nin Tek Cümlelik Tanımı</div>
    Kodunuzu Git'e her gönderdiğinizde, önceden tanımladığınız adımların (test, build, deploy) <strong>insan müdahalesi olmadan</strong> otomatik çalışmasıdır. "Push et, kahveni iç, yeşil tik gelsin."
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Ortam isimleri: dev, staging, production</div>
    Yazılım ekipleri sunucuları genelde üç seviyede ayırır:
    <ul>
        <li><strong>Development (dev)</strong>: Geliştiricinin kendi bilgisayarı veya deneme alanı — "burada kırılması normal".</li>
        <li><strong>Staging</strong>: Canlıya çok benzeyen test sunucusu — "son prova".</li>
        <li><strong>Production (prod)</strong>: Gerçek kullanıcıların kullandığı canlı sistem.</li>
    </ul>
    CI/CD ile kod önce test edilir, sonra staging'e, en son production'a gider — böylece FTP ile yanlış yere dosya atma derdi azalır.
</div>

<h2>CI ve CD — İki Farklı Harf, İki Farklı İş</h2>

<table>
    <tr><th>Kısaltma</th><th>Açılım</th><th>Ne yapar?</th></tr>
    <tr><td><strong>CI</strong></td><td>Continuous Integration (Sürekli Entegrasyon)</td><td>Her commit/PR'da kod birleştirilir, test edilir, build alınır</td></tr>
    <tr><td><strong>CD</strong></td><td>Continuous Delivery / Deployment (Sürekli Teslimat / Dağıtım)</td><td>Test geçen kod otomatik olarak staging veya production'a kurulur</td></tr>
</table>

<div class="info-box note">
    <div class="info-box-title">📌 Commit ve PR nedir?</div>
    <ul>
        <li><strong>Commit</strong>: Kodda yaptığınız değişikliğin Git'te kaydedilmiş anlık görüntüsü — "şu noktaya geri dönebilirim" demek.</li>
        <li><strong>PR (Pull Request)</strong>: "Benim değişikliğimi ana koda eklemeden önce inceleyin" talebi. Ekip arkadaşınız kodu görür; CI testleri de otomatik koşar.</li>
    </ul>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Delivery vs Deployment — basitçe</div>
    <ul>
        <li><strong>Continuous Delivery</strong>: Kod deploy'a <em>hazır</em> hale gelir; canlıya almak için birinin onaylaması gerekir (butona basarsınız).</li>
        <li><strong>Continuous Deployment</strong>: Testler geçtiyse kod <em>otomatik</em> canlı siteye gider — tam otomasyon.</li>
    </ul>
    Çoğu ekip önce CI + Delivery ile başlar; güven arttıkça tam Deployment'a geçer.
</div>

<h2>CD Stratejileri — Canlıya Nasıl Alınır?</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Deploy stratejisi nedir?</div>
    Yeni sürümü kullanıcıya ulaştırma <em>yöntemi</em>. Amaç: site çökmeden, mümkünse geri dönüş yolu açık kalsın.
</div>

<table>
    <tr><th>Strateji</th><th>Nasıl çalışır?</th><th>Ne zaman?</th></tr>
    <tr>
        <td><strong>Rolling update</strong></td>
        <td>Eski sürüm kademeli kapanır, yenisi açılır — Kubernetes varsayılanı</td>
        <td>Web uygulamaları, sıfır kesinti hedefi</td>
    </tr>
    <tr>
        <td><strong>Blue-Green</strong></td>
        <td>İki ortam: <em>Mavi</em> (canlı), <em>Yeşil</em> (yeni). Yeşil test edilince trafik anında yeşile kayar</td>
        <td>Hızlı geri dönüş, iki ortam maliyeti kabul edilebilirse</td>
    </tr>
    <tr>
        <td><strong>Canary</strong></td>
        <td>Önce trafiğin %5–10'u yeni sürüme gider; sorun yoksa %100'e çıkar</td>
        <td>Riskli büyük değişiklikler, A/B test</td>
    </tr>
    <tr>
        <td><strong>Recreate</strong></td>
        <td>Eski sürüm tamamen durur, yenisi başlar — kısa kesinti olur</td>
        <td>Bakım penceresi, tek instance, basit projeler</td>
    </tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>Stratejileri hayal edin</span></div>
    <pre><code><span class="comment"># Rolling (K8s Deployment varsayılan):</span>
Pod v1 → Pod v1 + Pod v2 → Pod v2

<span class="comment"># Blue-Green:</span>
Load Balancer ──→ Mavi (v1 canlı)
                  Yeşil (v2 test) → test OK → trafik Yeşile

<span class="comment"># Canary:</span>
100 istek → 95 v1, 5 v2 → metrikler iyi → 50/50 → 100% v2</code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Bu eğitimde nerede görürsünüz?</div>
    <ul>
        <li><strong>Rolling update</strong> — Bölüm 40 (Deployment stratejisi), Bölüm 39 (<code>kubectl rollout</code>)</li>
        <li><strong>Blue-Green / Canary</strong> — Kubernetes Ingress + iki Deployment veya Argo Rollouts (ileri seviye); mantık burada</li>
        <li><strong>SSH + docker run</strong> — Bölüm 36 (basit recreate benzeri: eski konteyner durur, yenisi başlar)</li>
    </ul>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Pipeline diyagramındaki adımlar</div>
    <ul>
        <li><strong>Checkout</strong>: Runner'a (aşağıda) proje kodunu indirmek.</li>
        <li><strong>Lint</strong>: Kod yazım kuralları kontrolü — noktalı virgül unutulmuş mu, isimlendirme tutarlı mı?</li>
        <li><strong>Test</strong>: Otomatik kontroller — uygulama beklenen gibi çalışıyor mu?</li>
        <li><strong>Build</strong>: Dağıtılabilir paket oluşturmak (Docker imajı, derlenmiş uygulama).</li>
        <li><strong>Push (registry)</strong>: Oluşan imajı depoya yüklemek — sunucu oradan çeker.</li>
        <li><strong>Deploy</strong>: Paketi sunucuya kurup çalıştırmak.</li>
    </ul>
</div>

<h2>Pipeline (Boru Hattı) Nedir?</h2>
<p>CI/CD sisteminizde tanımladığınız adımların zincirine <strong>pipeline</strong> denir. Fabrikadaki montaj hattı gibi: her istasyon bir iş yapar, sonraki istasyona geçer.</p>

<div class="code-block">
    <div class="code-block-header"><span>Tipik bir pipeline akışı</span></div>
    <pre><code>Git Push / Pull Request
        │
        ▼
┌───────────────┐
│  1. Checkout  │  ← Kodu runner'a indir
└───────┬───────┘
        ▼
┌───────────────┐
│  2. Lint      │  ← Kod stili, format kontrolü
└───────┬───────┘
        ▼
┌───────────────┐
│  3. Test      │  ← pytest, jest, go test...
└───────┬───────┘
        ▼
┌───────────────┐
│  4. Build     │  ← docker build, npm run build
└───────┬───────┘
        ▼
┌───────────────┐
│  5. Push      │  ← İmajı registry'ye yükle
└───────┬───────┘
        ▼
┌───────────────┐
│  6. Deploy    │  ← Sunucuya / K8s'e gönder
└───────────────┘</code></pre>
</div>

<p>Bir adım kırılırsa pipeline durur — bozuk kod production'a ulaşmaz. Bu, <strong>fail fast</strong> (hata erken çıksın, canlı siteye gitmesin) prensibidir.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Registry (kayıt deposu) nedir?</div>
    Docker <strong>imajlarının saklandığı depo</strong> — Docker Hub veya GitHub Container Registry (GHCR) gibi. CI imajı buraya yükler; sunucu <code>docker pull</code> ile aynı imajı indirir. FTP ile tek tek dosya atmak yerine <em>tek paket (imaj)</em> taşınır.
</div>

<h2>Neden Docker CI/CD'nin Kalbidir?</h2>
<p>Bölüm 28'te Docker'ın CI/CD'deki rolünden bahsettik. Burada derinleşelim:</p>

<table>
    <tr><th>CI/CD sorunu</th><th>Docker çözümü</th></tr>
    <tr><td>"Benim makinemde çalışıyordu"</td><td>Her CI koşusu aynı imajda — tutarlı ortam</td></tr>
    <tr><td>Eski test kalıntıları</td><td>Her job temiz konteyner — sıfırdan başlar</td></tr>
    <tr><td>Farklı dil sürümleri testi</td><td>python:3.10, python:3.11, python:3.12 imajları paralel</td></tr>
    <tr><td>Build vs runtime farkı</td><td>Multi-stage Dockerfile — build bir yerde, çalışma başka</td></tr>
    <tr><td>Deploy tutarlılığı</td><td>Aynı imaj dev → staging → prod</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Altın Kural</div>
    CI'da build ettiğiniz imaj, production'da çalışan imajın <strong>aynısı</strong> olmalıdır. "CI'da farklı, sunucuda farklı" derdin tekrar başlar.
</div>

<h2>CI/CD Platformları — Hangisi Ne?</h2>
<table>
    <tr><th>Platform</th><th>Config dosyası</th><th>Not</th></tr>
    <tr><td><strong>GitHub Actions</strong></td><td><code>.github/workflows/*.yml</code></td><td>GitHub repo'da gömülü, en popüler açık kaynak projelerde</td></tr>
    <tr><td><strong>GitLab CI</strong></td><td><code>.gitlab-ci.yml</code></td><td>GitLab'a gömülü, self-hosted seçeneği</td></tr>
    <tr><td><strong>Jenkins</strong></td><td>Jenkinsfile (Groovy)</td><td>Klasik, kendi sunucunuzda kurulum</td></tr>
    <tr><td><strong>CircleCI</strong></td><td><code>.circleci/config.yml</code></td><td>Bulut tabanlı, hızlı kurulum</td></tr>
    <tr><td><strong>Bitbucket Pipelines</strong></td><td><code>bitbucket-pipelines.yml</code></td><td>Atlassian ekosistemi</td></tr>
</table>

<p>Bu eğitimde odak <strong>GitHub Actions</strong> — çünkü ücretsiz, yaygın ve Docker ile mükemmel entegre. Son bölümde GitLab CI ve Jenkins'e de değineceğiz.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Bölüm 16 ile İlişki</div>
    Git/GitHub temellerini ve GitHub Actions'a ilk girişi <strong>Bölüm 16</strong>'da görmüştünüz. Bu CI/CD serisi (28–32), Docker bilginizle birleşerek <strong>gerçek production pipeline'ları</strong> kurmaya odaklanır.
</div>

<h2>Pipeline Bileşenleri — Ortak Kelimeler</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Runner, Secret, Cache — günlük dilde</div>
    <ul>
        <li><strong>Runner</strong>: Pipeline'ın çalıştığı geçici bilgisayar. GitHub size uzaktan bir Linux makine verir; iş bitince silinir.</li>
        <li><strong>Secret</strong>: Şifre, API anahtarı gibi gizli bilgi — workflow dosyasına yazılmaz, GitHub'ın kasasında tutulur.</li>
        <li><strong>Artifact</strong> (<em>yapıt</em>): Pipeline'ın ürettiği dosya — test raporu, log arşivi. Sonradan indirip inceleyebilirsiniz.</li>
        <li><strong>Cache</strong> (<em>önbellek</em>): Bir önceki koşudan kalan indirilmiş paketler — her seferinde internetten indirmeyi atlayıp hızlanırsınız.</li>
        <li><strong>Trigger</strong> (<em>tetikleyici</em>): Pipeline'ı ne başlatır? Push, PR açılması, gece yarısı cron, manuel buton...</li>
    </ul>
</div>
<div class="eng-box">
    <div class="eng-title">🔤 CI/CD Terimleri</div>
    <div class="eng-content">
        <span class="eng-word">Workflow</span> = <span class="eng-meaning">İş akışı</span> — Tetikleyici + job'ların tanımı (GitHub Actions).<br>
        <span class="eng-word">Job</span> = <span class="eng-meaning">Görev</span> — Paralel veya sıralı çalışan iş birimi.<br>
        <span class="eng-word">Step</span> = <span class="eng-meaning">Adım</span> — Job içindeki tek komut veya action.<br>
        <span class="eng-word">Runner</span> = <span class="eng-meaning">Koşucu</span> — Pipeline'ın çalıştığı makine (GitHub hosted veya self-hosted).<br>
        <span class="eng-word">Trigger</span> = <span class="eng-meaning">Tetikleyici</span> — push, pull_request, schedule, manual...<br>
        <span class="eng-word">Artifact</span> = <span class="eng-meaning">Yapıt</span> — Job'ların bıraktığı dosyalar (test raporu, build çıktısı).<br>
        <span class="eng-word">Secret</span> = <span class="eng-meaning">Gizli</span> — API key, şifre — loglarda görünmez.<br>
        <span class="eng-word">Cache</span> = <span class="eng-meaning">Önbellek</span> — pip/npm bağımlılıklarını tekrar indirmemek için.
    </div>
</div>

<h2>Manuel Deploy vs Otomatik — Gerçek Fark</h2>
<div class="info-box note">
    <div class="info-box-title">📌 SSH ve systemctl nedir?</div>
    <ul>
        <li><strong>SSH</strong>: Uzak sunucuya terminalden güvenli bağlanma — ev bilgisayarınızdan Hetzner/DigitalOcean sunucusuna <code>ssh kullanici@sunucu</code> ile girersiniz.</li>
        <li><strong>git pull</strong>: Sunucudaki kodu GitHub'dan güncellemek.</li>
        <li><strong>systemctl restart</strong>: Linux'ta bir servisi (web uygulaması, nginx) yeniden başlatmak.</li>
    </ul>
    Manuel deploy'da bu adımları elle yaparsınız; birini unutmak veya yanlış sunucuda çalıştırmak kolaydır.
</div>
<div class="code-block">
    <div class="code-block-header"><span>Manuel (eski yöntem)</span></div>
    <pre><code>1. SSH ile sunucuya bağlan
2. git pull
3. pip install -r requirements.txt   <span class="comment"># belki unutulur</span>
4. systemctl restart app           <span class="comment"># belki yanlış servis</span>
5. "Çalışıyor mu?" diye dua et
<span class="comment"># Süre: 15–30 dk, hata riski: yüksek</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Otomatik (CI/CD)</span></div>
    <pre><code>1. git push origin main
2. Pipeline otomatik: test → build → push imaj → deploy
3. Slack/email: "Deploy başarılı ✅"
<span class="comment"># Süre: 3–5 dk, tekrarlanabilir, loglanmış</span></code></pre>
</div>

<h2>Pull Request (PR) ve CI — Erken Yakalama</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Branch, merge, branch protection</div>
    <ul>
        <li><strong>Branch (dal)</strong>: Kodun paralel kopyası — yeni özelliği ana koddan ayırarak geliştirirsiniz.</li>
        <li><strong>Main branch</strong>: Projenin "resmi" ana kodu — genelde canlı site buradan deploy edilir.</li>
        <li><strong>Merge</strong>: PR onaylandığında feature branch'teki değişiklikler main'e birleştirilir.</li>
        <li><strong>Branch protection</strong>: GitHub ayarı — "main'e doğrudan push yasak, PR + yeşil CI şart" kuralı.</li>
    </ul>
</div>
<p>En değerli CI kullanımı: kod <strong>main branch'e merge edilmeden önce</strong> test edilir.</p>
<ol>
    <li>Feature branch açarsınız.</li>
    <li>PR oluşturursunuz.</li>
    <li>CI otomatik koşar — testler, lint, build.</li>
    <li>Yeşil tik ✅ olmadan merge edilmez (branch protection).</li>
</ol>

<p>Bu sayede main branch her zaman deploy edilebilir durumda kalır.</p>

<h2>DevOps Kültürü — Kısa Bir Not</h2>
<div class="info-box note">
    <div class="info-box-title">📌 DevOps, rollback, gözlemlenebilirlik</div>
    <ul>
        <li><strong>DevOps</strong>: "Geliştirme (Dev) + Operasyon (Ops)" — yazılımı yazanlar ile sunucuyu işletenlerin aynı otomasyon kültürünü paylaşması.</li>
        <li><strong>Rollback</strong> (<em>geri alma</em>): Yeni sürüm bozulduysa bir önceki çalışan sürüme dönmek.</li>
        <li><strong>Gözlemlenebilirlik</strong>: Kim, ne zaman, hangi sürümü kurdu — loglardan takip edilebilmesi.</li>
    </ul>
</div>
<p>CI/CD sadece araç değil, <strong>kültür</strong> değişimidir:</p>
<ul>
    <li><strong>Küçük, sık commit</strong> — büyük "big bang" release yerine.</li>
    <li><strong>Otomasyon güven</strong> — elle deploy azalır, hata azalır.</li>
    <li><strong>Geri alınabilirlik</strong> — deploy bozuksa rollback pipeline'ı.</li>
    <li><strong>Gözlemlenebilirlik</strong> — her deploy loglanır, kim ne zaman ne gönderdi belli.</li>
</ul>

<h2>İlk Workflow Önizlemesi</h2>
<p>Sonraki bölümde adım adım yazacağız; şimdilik gözünüzü alıştırın:</p>

<div class="code-block">
    <div class="code-block-header"><span>.github/workflows/ci.yml (basit)</span></div>
    <pre><code>name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Python kur
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt
      - run: pytest</code></pre>
</div>

<p>Push veya PR olduğunda GitHub bu dosyayı okur, Ubuntu runner'da testleri koşturur. Bu kadar.</p>

<h2>Ne Zaman CI/CD Kurmalısınız?</h2>
<table>
    <tr><th>Durum</th><th>Öneri</th></tr>
    <tr><td>Tek kişilik hobby proje</td><td>Basit test workflow yeterli</td></tr>
    <tr><td>2+ kişi ekip</td><td>PR'da CI şart</td></tr>
    <tr><td>Docker imajınız var</td><td>Build + push pipeline ekleyin</td></tr>
    <tr><td>Production deploy</td><td>Staging → prod aşamalı CD</td></tr>
    <tr><td>Henüz test yok</td><td>Önce birkaç test yazın, sonra CI</td></tr>
</table>

<h2>Özet</h2>
<ul>
    <li><strong>TGO</strong> = Git + CI/CD + Docker + K8s + IaC zinciri.</li>
    <li><strong>CI</strong> = otomatik test ve build; <strong>CD</strong> = otomatik dağıtım.</li>
    <li><strong>Pipeline</strong> = adım adım otomasyon zinciri.</li>
    <li><strong>Docker</strong> = CI'da tutarlı ortam ve deploy edilebilir artefakt.</li>
    <li><strong>GitHub Actions</strong> = bu eğitimde odak platform.</li>
    <li>PR + CI = bozuk kodu erken yakalama.</li>
</ul>
<p>Sonraki bölümde GitHub Actions'ı sıfırdan, terminalden değil ama gerçek workflow dosyalarıyla adım adım kuracağız.</p>
`,
    quiz: [
        {
            question: "CI (Continuous Integration) ne yapar?",
            options: [
                "Her değişiklikte otomatik test ve build",
                "Sadece manuel FTP upload",
                "Veritabanını siler",
                "Git repository oluşturur"
            ],
            correct: 0,
            explanation: "CI, kod her commit/PR'da otomatik birleştirilir, test edilir ve build alınır — entegrasyon sorunları erken yakalanır."
        },
        {
            question: "Pipeline'da bir adım başarısız olursa ne olur?",
            options: [
                "Genelde pipeline durur, sonraki adımlar çalışmaz",
                "Tüm adımlar yine de koşar",
                "Git repository silinir",
                "Docker otomatik kaldırılır"
            ],
            correct: 0,
            explanation: "Fail fast prensibi: test veya build kırılırsa deploy'a geçilmez; bozuk kod production'a ulaşmaz."
        },
        {
            question: "Docker CI/CD'de neden kritiktir?",
            options: [
                "Her koşuda tutarlı, temiz ortam sağlar",
                "Git commit mesajı yazar",
                "SSH anahtarı üretir",
                "Sadece Windows'ta çalışır"
            ],
            correct: 0,
            explanation: "Docker imajları sayesinde CI runner'da ve production'da aynı ortam kullanılır; 'benim makinemde çalışıyordu' sorunu azalır."
        },
        {
            question: "GitHub Actions workflow dosyası nerede durur?",
            options: [
                ".github/workflows/ klasöründe",
                "Dockerfile içinde",
                "/etc/ci.conf",
                "package.json'da zorunlu"
            ],
            correct: 0,
            explanation: "GitHub Actions workflow'ları .github/workflows/*.yml dosyalarında tanımlanır ve repo ile versiyonlanır."
        },
        {
            question: "Continuous Delivery ile Continuous Deployment farkı?",
            options: [
                "Delivery'de deploy onaylı, Deployment'ta otomatik",
                "İkisi tamamen aynı",
                "Deployment sadece test yapar",
                "Delivery Git kullanmaz"
            ],
            correct: 0,
            explanation: "Continuous Delivery deploy'a hazır kod sunar (manuel/onaylı tetik); Continuous Deployment test geçince otomatik prod'a gider."
        },
        {
            question: "PR'da CI çalıştırmanın ana faydası?",
            options: [
                "Merge öncesi hataları yakalamak",
                "Repo boyutunu artırmak",
                "Docker Hub'ı silmek",
                "Commit sayısını azaltmak"
            ],
            correct: 0,
            explanation: "PR pipeline'ı main'e merge edilmeden test/lint/build yapar; bozuk kod ana dala girmez."
        },
        {
            question: "Runner ne demektir?",
            options: [
                "Pipeline'ın çalıştığı makine",
                "Test framework adı",
                "Git branch türü",
                "Docker imaj tag'i"
            ],
            correct: 0,
            explanation: "Runner, workflow job'larının koştuğu ortamdır — GitHub hosted (ubuntu-latest) veya self-hosted sunucu."
        },
        {
            question: "Secret'lar CI/CD'de neden önemli?",
            options: [
                "API key ve şifreleri loglarda göstermeden kullanmak",
                "Kod hızını artırmak",
                "Test sayısını azaltmak",
                "Dockerfile oluşturmak"
            ],
            correct: 0,
            explanation: "Secret'lar platformda şifreli saklanır; workflow'da referans edilir ama log çıktısında maskelenir."
        },
        {
            question: "Artifact ne işe yarar?",
            options: [
                "Job çıktılarını sonraki job'lara veya indirmeye saklar",
                "Git branch siler",
                "Runner'ı kapatır",
                "Sadece email gönderir"
            ],
            correct: 0,
            explanation: "Artifact, build çıktısı, test raporu veya imaj gibi dosyaları pipeline adımları arasında taşır."
        },
        {
            question: "Bu eğitimde odak CI/CD platformu hangisi?",
            options: [
                "GitHub Actions",
                "Microsoft Word",
                "cPanel",
                "Wireshark"
            ],
            correct: 0,
            explanation: "Docker entegrasyonu ve yaygınlık nedeniyle GitHub Actions ana platform; GitLab CI ve Jenkins son bölümde."
        },
        {
            question: "TGO (Tümleşik Geliştirme Ortamı) neyi ifade eder?",
            options: [
                "Git, CI/CD, Docker ve K8s gibi araçların uçtan uca zinciri",
                "Sadece bir kod editörü (IDE)",
                "Yalnızca veritabanı yönetimi",
                "FTP ile dosya yükleme"
            ],
            correct: 0,
            explanation: "TGO, geliştirmeden dağıtıma kadar araçların entegre çalışmasını ifade eder — Git, pipeline, konteyner, orkestrasyon."
        },
        {
            question: "Canary deploy stratejisinin amacı nedir?",
            options: [
                "Trafiğin küçük bir kısmını yeni sürüme yönlendirip riski azaltmak",
                "Tüm sunucuları aynı anda kapatmak",
                "Git geçmişini silmek",
                "Sadece gece deploy yapmak"
            ],
            correct: 0,
            explanation: "Canary'de önce %5–10 trafik yeni sürüme gider; metrikler iyiyse kademeli %100'e çıkılır."
        }
    ]
});
