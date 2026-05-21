// ===== Bölüm 42: Kubernetes Örnekleri, Helm ve Kaynaklar =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 42,
    title: 'Kubernetes Örnekleri ve Kaynaklar',
    subtitle: 'Real-World K8s, Helm & Learning Resources',
    icon: '🚀',
    description: 'Gerçek dünya K8s, Helm, güvenlik/performans, Terraform IaC girişi, GitOps ve kaynaklar.',
    content: `
<h2>Teoriden Pratiğe — Gerçek Dünya Senaryoları</h2>
<p>Önceki bölümlerde kavramları, kubectl'ü, YAML'ı ve Service/ConfigMap/Volume'ü öğrendiniz. Bu bölümde "iş hayatında ve hobi projelerinde Kubernetes nasıl kullanılır?" sorusuna cevap vereceğiz.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Bu Bölümün Yol Haritası</div>
    <ol>
        <li><strong>Hazır manifestler</strong> — Tek komutla popüler uygulamalar.</li>
        <li><strong>Helm</strong> — Kubernetes'in "paket yöneticisi".</li>
        <li><strong>kind</strong> — Docker içinde çok node'luk küme.</li>
        <li><strong>Bulut K8s</strong> — GKE, EKS, AKS.</li>
        <li><strong>GitOps</strong> — Argo CD, Flux (kısa giriş).</li>
        <li><strong>Güvenlik ve performans</strong> — RBAC, limitler, tarama, izleme.</li>
        <li><strong>Terraform (IaC)</strong> — Altyapıyı kodla tanımlama girişi.</li>
        <li><strong>Kaynaklar</strong> — Kitap, video, Türkçe içerik.</li>
        <li><strong>Alıştırma projeleri</strong> — Kendi elinizle yapın listesi.</li>
    </ol>
</div>

<h2>1. Tek Komutla Denenebilecek Uygulamalar</h2>
<p>Docker bölümündeki "docker run ile dene" listesinin Kubernetes karşılığı. Minikube çalışırken:</p>

<div class="code-block">
    <div class="code-block-header"><span>Hızlı deployment örnekleri</span></div>
    <pre><code><span class="comment"># 🌐 NGINX web sunucusu:</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">create deployment nginx --image=nginx</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">expose deployment nginx --port=80 --type=NodePort</span>
<span class="prompt">$</span> <span class="command">minikube</span> <span class="argument">service nginx --url</span>

<span class="comment"># 📊 Kubernetes Dashboard (Minikube addon):</span>
<span class="prompt">$</span> <span class="command">minikube</span> <span class="argument">addons enable dashboard</span>
<span class="prompt">$</span> <span class="command">minikube</span> <span class="argument">dashboard</span>

<span class="comment"># 📈 Metrics (kaynak kullanımı):</span>
<span class="prompt">$</span> <span class="command">minikube</span> <span class="argument">addons enable metrics-server</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">top nodes</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">top pods</span>

<span class="comment"># 🗄️ PostgreSQL (basit — öğrenme için):</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">create deployment postgres --image=postgres:16-alpine</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">set env deployment/postgres POSTGRES_PASSWORD=deneme123</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">expose deployment postgres --port=5432</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Öğrenme vs Üretim</div>
    Yukarıdaki postgres örneği kalıcı depolama (PVC) ve Secret best practice kullanmaz — hızlı deneme içindir. Gerçek veritabanı için Bölüm 41'daki PVC + Secret yapısını uygulayın.
</div>

<h2>2. Helm — Kubernetes Paket Yöneticisi</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Helm, chart, values.yaml</div>
    <ul>
        <li><strong>Helm</strong>: Kubernetes uygulamalarını paketleyip tek komutla kuran araç — apt/brew gibi.</li>
        <li><strong>Chart</strong>: Hazır kurulum paketi — WordPress + veritabanı YAML'ları bir arada.</li>
        <li><strong>values.yaml</strong>: Chart'ı özelleştirme — şifre, disk boyutu gibi ayarlar.</li>
    </ul>
</div>
<p>Onlarca YAML dosyası yazmak yerine hazır <strong>chart</strong> kurabilirsiniz:</p>

<div class="code-block">
    <div class="code-block-header"><span>Helm kurulum ve kullanım</span></div>
    <pre><code><span class="comment"># Helm kur (Linux):</span>
<span class="prompt">$</span> <span class="command">curl</span> <span class="flag">https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3</span> <span class="operator">|</span> <span class="command">bash</span>

<span class="prompt">$</span> <span class="command">helm</span> <span class="argument">repo add bitnami https://charts.bitnami.com/bitnami</span>
<span class="prompt">$</span> <span class="command">helm</span> <span class="argument">repo update</span>

<span class="comment"># WordPress + MariaDB tek komutla:</span>
<span class="prompt">$</span> <span class="command">helm</span> <span class="argument">install my-blog bitnami/wordpress</span>

<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get pods</span>
<span class="prompt">$</span> <span class="command">helm</span> <span class="argument">list</span>
<span class="prompt">$</span> <span class="command">helm</span> <span class="argument">uninstall my-blog</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Helm Chart vs Manifest</div>
    <ul>
        <li><strong>Manifest (YAML)</strong>: Her şeyi siz yazarsınız — tam kontrol, öğrenmek için ideal.</li>
        <li><strong>Helm Chart</strong>: Topluluk/şirket hazır paket — hızlı kurulum, values.yaml ile özelleştirme.</li>
    </ul>
    Önce manifest öğrenin, sonra Helm ile hız kazanın. İş ilanlarında ikisi de geçer.
</div>

<h2>3. kind — Docker İçinde Kubernetes Kümesi</h2>
<div class="info-box note">
    <div class="info-box-title">📌 kind (Kubernetes in Docker)</div>
    Minikube tek sunuculuk küme kurar. <strong>kind</strong>, her Kubernetes node'unu bir <em>Docker konteyneri</em> olarak çalıştırır — "Docker içinde Docker içinde K8s". Çok node'lu küme davranışını laptop'ta test etmek için idealdir.
</div>
<p>Minikube tek node'dur. <strong>kind</strong> (Kubernetes in Docker), Docker konteynerlerinin içinde çok node'luk küme oluşturur — Docker biliyorsanız tanıdık gelir:</p>

<div class="code-block">
    <div class="code-block-header"><span>kind ile 3 node'luk küme</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-Lo</span> <span class="argument">./kind https://kind.sigs.k8s.io/dl/v0.23.0/kind-linux-amd64</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">+x ./kind &amp;&amp; sudo mv ./kind /usr/local/bin/kind</span>

<span class="prompt">$</span> <span class="command">kind</span> <span class="argument">create cluster --name ogrenme</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get nodes</span>
<span class="output">NAME                    STATUS   ROLES           AGE
ogrenme-control-plane   Ready    control-plane   2m</span>

<span class="comment"># Küme sil:</span>
<span class="prompt">$</span> <span class="command">kind</span> <span class="argument">delete cluster --name ogrenme</span></code></pre>
</div>

<h2>4. Bulut Kubernetes Servisleri</h2>
<div class="info-box note">
    <div class="info-box-title">📌 GKE, EKS, AKS, Managed Kubernetes</div>
    <ul>
        <li><strong>Managed Kubernetes</strong>: Control plane (API, scheduler, etcd) bulut sağlayıcı tarafından işletilir — siz uygulama YAML'larını deploy edersiniz.</li>
        <li><strong>GKE</strong> (Google), <strong>EKS</strong> (Amazon), <strong>AKS</strong> (Microsoft): Büyük bulut firmalarının yönetilen Kubernetes hizmetleri.</li>
        <li><strong>Worker node</strong>: Uygulama pod'larının çalıştığı gerçek sunucular — bunları siz veya sağlayıcı yönetir.</li>
    </ul>
    Minikube'ta öğrendikleriniz bu servislerde de %80 aynıdır; sadece küme kurulumunu siz yapmazsınız.
</div>
<table>
    <tr><th>Servis</th><th>Sağlayıcı</th><th>Not</th></tr>
    <tr><td><a href="https://cloud.google.com/kubernetes-engine" target="_blank" rel="noopener">GKE</a></td><td>Google</td><td>Kubernetes'in doğduğu ekosistem</td></tr>
    <tr><td><a href="https://aws.amazon.com/eks/" target="_blank" rel="noopener">EKS</a></td><td>Amazon</td><td>AWS ekosistemiyle entegre</td></tr>
    <tr><td><a href="https://azure.microsoft.com/products/kubernetes-service" target="_blank" rel="noopener">AKS</a></td><td>Microsoft</td><td>Azure DevOps ile uyumlu</td></tr>
    <tr><td><a href="https://www.digitalocean.com/products/kubernetes" target="_blank" rel="noopener">DOKS</a></td><td>DigitalOcean</td><td>Başlangıç için uygun fiyat</td></tr>
    <tr><td><a href="https://www.civo.com/kubernetes" target="_blank" rel="noopener">Civo K3s</a></td><td>Civo</td><td>Hızlı, uygun fiyatlı K3s</td></tr>
</table>

<p><strong>Managed Kubernetes</strong> = control plane sağlayıcıda, siz uygulama YAML'larınızı deploy edersiniz.</p>

<h2>5. GitOps — YAML'ları Git'ten Deploy Etmek</h2>
<div class="info-box note">
    <div class="info-box-title">📌 GitOps, Argo CD, Flux</div>
    <ul>
        <li><strong>GitOps</strong>: Sunucu ayarlarının (Kubernetes YAML) Git'te tutulması — "doğru durum" repo'dadır; küme buna uydurulur.</li>
        <li><strong>Argo CD / Flux</strong>: Git'teki YAML ile kümedeki gerçek durumu sürekli karşılaştıran araçlar — fark varsa otomatik düzeltir.</li>
        <li><strong>Manuel apply</strong>: <code>kubectl apply</code>'ı bilgisayarınızdan çalıştırmak — GitOps'ta bunun yerine Git push yeterli olur.</li>
    </ul>
</div>
<p>Modern ekipler manifestleri Git repository'de tutar; küme otomatik senkronize olur:</p>
<ul>
    <li><strong>Argo CD</strong> — Görsel arayüz, popüler GitOps aracı</li>
    <li><strong>Flux</strong> — CNCF projesi, hafif GitOps</li>
</ul>

<div class="info-box note">
    <div class="info-box-title">📌 GitOps Akışı (Basit)</div>
    Git'e push → CI test eder → Argo CD/Flux kümede apply eder → Deployment güncellenir. "Kim ne deploy etti?" sorusunun cevabı Git log'unda.
</div>

<h2>6. Sertifikalar ve Kariyer</h2>
<div class="info-box note">
    <div class="info-box-title">📌 CKA, CKAD, CKS</div>
    Kubernetes sertifikaları — iş ilanlarında aranan belgeler (zorunlu değil, öğrenme hedefi olarak iyi):
    <ul>
        <li><strong>CKA</strong>: Cluster yönetimi — kurulum, sorun giderme.</li>
        <li><strong>CKAD</strong>: Uygulama geliştirici — YAML, deploy.</li>
        <li><strong>CKS</strong>: Güvenlik odaklı — CKA sonrası.</li>
    </ul>
</div>
<p>Sertifika şart değil; ama öğrenme hedefi koymak motivasyon sağlar. <a href="https://killer.sh/" target="_blank" rel="noopener">killer.sh</a> CKA/CKAD simülasyonları meşhurdur.</p>

<h2>7. Resmi ve İngilizce Kaynaklar 📚</h2>
<div class="info-box tip">
    <div class="info-box-title">📖 Resmi Dokümantasyon</div>
    <ul>
        <li><a href="https://kubernetes.io/docs/home/" target="_blank" rel="noopener">kubernetes.io/docs</a> — Resmi belgeler, başlangıç rehberi.</li>
        <li><a href="https://kubernetes.io/docs/tutorials/kubernetes-basics/" target="_blank" rel="noopener">Kubernetes Basics (interaktif)</a> — Resmi interaktif tutorial.</li>
        <li><a href="https://kubernetes.io/docs/reference/kubectl/cheatsheet/" target="_blank" rel="noopener">kubectl Cheatsheet</a> — Hızlı referans.</li>
        <li><a href="https://minikube.sigs.k8s.io/docs/" target="_blank" rel="noopener">Minikube Docs</a> — Yerel küme kurulumu.</li>
        <li><a href="https://helm.sh/docs/" target="_blank" rel="noopener">Helm Docs</a> — Chart yazımı ve kullanımı.</li>
        <li><a href="https://kind.sigs.k8s.io/" target="_blank" rel="noopener">kind Docs</a> — Docker tabanlı test kümeleri.</li>
    </ul>
</div>

<div class="info-box tip">
    <div class="info-box-title">📺 YouTube — Güçlü Tavsiyeler</div>
    <ul>
        <li><a href="https://www.youtube.com/watch?v=X48HP-iPDYU" target="_blank" rel="noopener">TechWorld with Nana — Kubernetes Tutorial for Beginners</a> — Kapsamlı giriş (3+ saat).</li>
        <li><a href="https://www.youtube.com/watch?v=s_o8dwzRlu4" target="_blank" rel="noopener">freeCodeCamp — Kubernetes Course</a> — Ücretsiz tam kurs.</li>
        <li><a href="https://www.youtube.com/c/Bretfisher" target="_blank" rel="noopener">Bret Fisher</a> — Docker + Kubernetes derin konular.</li>
        <li><a href="https://www.youtube.com/watch?v=PH-2FfFD2PU" target="_blank" rel="noopener">Fireship — Kubernetes in 100 Seconds</a> — Hızlı özet.</li>
        <li><a href="https://www.youtube.com/@JustMeAndOpensource" target="_blank" rel="noopener">Just Me and Opensource</a> — Self-hosted + K8s projeleri.</li>
    </ul>
</div>

<h2>8. Türkçe Kaynaklar 🇹🇷</h2>
<div class="info-box tip">
    <div class="info-box-title">🇹🇷 Türkçe İçerikler</div>
    <ul>
        <li><a href="https://www.youtube.com/results?search_query=kubernetes+t%C3%BCrk%C3%A7e" target="_blank" rel="noopener">YouTube: "kubernetes türkçe" araması</a></li>
        <li><a href="https://www.udemy.com/topic/kubernetes/?lang=tr" target="_blank" rel="noopener">Udemy — Türkçe Kubernetes Kursları</a></li>
        <li><a href="https://devops.muhammetbaltaci.com/" target="_blank" rel="noopener">DevOps Türkçe Blog</a> — Docker/K8s yazıları.</li>
        <li><a href="https://www.youtube.com/@Kodluyoruz" target="_blank" rel="noopener">Kodluyoruz</a> — Türkçe yazılım eğitimleri.</li>
        <li><a href="https://medium.com/tag/kubernetes" target="_blank" rel="noopener">Medium — Kubernetes tag</a> — Türkçe/İngilizce makaleler.</li>
    </ul>
</div>

<h2>9. Kitap Önerileri</h2>
<ul>
    <li><strong>The Kubernetes Book</strong> — Nigel Poulton. Docker Book'un devamı niteliğinde; sade dil.</li>
    <li><strong>Kubernetes Up & Running</strong> — Kelsey Hightower et al. Klasik referans.</li>
    <li><strong>Kubernetes Patterns</strong> — Bilgin Ibryam. Gerçek dünya desenleri.</li>
    <li><strong>Cloud Native DevOps with Kubernetes</strong> — John Arundel & Justin Domingus.</li>
</ul>

<h2>10. Faydalı Araçlar 🛠️</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Kustomize nedir?</div>
    <strong>Kustomize</strong>: Aynı temel YAML'a ortam bazlı katman eklemek — örneğin <code>base/</code> ortak manifest, <code>overlays/staging</code> ve <code>overlays/prod</code> farklı ayarlar. Helm kadar karmaşık değil; kubectl ile entegre.
</div>
<table>
    <tr><th>Araç</th><th>Ne işe yarar?</th></tr>
    <tr><td><a href="https://k9scli.io/" target="_blank" rel="noopener">k9s</a></td><td>Terminal UI — pod/service yönetimi (htop gibi)</td></tr>
    <tr><td><a href="https://kubectx.dev/" target="_blank" rel="noopener">kubectx / kubens</a></td><td>Context ve namespace hızlı geçiş</td></tr>
    <tr><td><a href="https://github.com/ahmetb/kubectx" target="_blank" rel="noopener">stern</a></td><td>Birden fazla pod logunu aynı anda</td></tr>
    <tr><td><a href="https://lenshq.io/" target="_blank" rel="noopener">Lens</a></td><td>Desktop GUI — küme görselleştirme</td></tr>
    <tr><td><a href="https://github.com/kubernetes-sigs/kustomize" target="_blank" rel="noopener">Kustomize</a></td><td>YAML overlay — dev/prod ayrımı</td></tr>
    <tr><td><a href="https://www.openpolicyagent.org/docs/latest/kubernetes-admission/" target="_blank" rel="noopener">OPA</a></td><td>Policy — "her deployment resource limit tanımlamalı"</td></tr>
</table>

<h2>11. Alıştırma Projeleri 🧑‍🏫</h2>
<div class="info-box note">
    <div class="info-box-title">📌 HPA (Horizontal Pod Autoscaler)</div>
    CPU veya bellek kullanımı belirli eşiği geçince Deployment'ın pod sayısını otomatik artırır. Örneğin %70 CPU'yu aşınca 3 pod'dan 8 pod'a çıkar — trafik düşünce tekrar azaltır. <code>metrics-server</code> addon'u gerekir (Minikube'ta <code>minikube addons enable metrics-server</code>).
</div>
<p>Kubernetes'i öğrenmenin yolu projedir. Sıfırdan zora:</p>
<ol>
    <li><strong>NGINX + Service + NodePort</strong> — Tarayıcıdan eriş, scale et.</li>
    <li><strong>Flask/Node API + Redis</strong> — ConfigMap ile REDIS_HOST, 2 replica.</li>
    <li><strong>WordPress Helm chart</strong> — Helm kur, values.yaml ile özelleştir.</li>
    <li><strong>PostgreSQL + PVC</strong> — Veri kalıcılığını test et (pod sil, veri kalsın).</li>
    <li><strong>Ingress + 2 farklı uygulama</strong> — <code>app1.local</code> ve <code>app2.local</code> routing.</li>
    <li><strong>Secret ile DB bağlantısı</strong> — Şifreyi YAML'dan ayır.</li>
    <li><strong>Horizontal Pod Autoscaler (HPA)</strong> — CPU artınca pod sayısı artsın.</li>
    <li><strong>kind ile 2 node</strong> — Pod'ların farklı node'lara dağıldığını gör.</li>
    <li><strong>GitOps mini</strong> — Manifestleri GitHub'a koy, manuel apply yerine süreç kur.</li>
    <li><strong>Kendi hobby projenizi K8s'e taşıyın</strong> — Docker imajınız zaten var!</li>
</ol>

<h2>12. kubectl Cheat Sheet — Hızlı Referans</h2>
<div class="code-block">
    <div class="code-block-header"><span>En sık kullanılan komutlar</span></div>
    <pre><code><span class="comment"># Bilgi</span>
kubectl get pods,svc,deploy,ns
kubectl describe pod &lt;ad&gt;
kubectl logs -f deployment/&lt;ad&gt;
kubectl exec -it deployment/&lt;ad&gt; -- sh

<span class="comment"># Deploy</span>
kubectl apply -f .
kubectl delete -f dosya.yaml
kubectl scale deployment &lt;ad&gt; --replicas=5
kubectl rollout status/undo/history deployment/&lt;ad&gt;

<span class="comment"># Debug</span>
kubectl get events --sort-by='.lastTimestamp'
kubectl run tmp --rm -it --image=nicolaka/netshoot -- bash
kubectl port-forward svc/&lt;ad&gt; 8080:80

<span class="comment"># Context</span>
kubectl config get-contexts
kubectl config use-context minikube</code></pre>
</div>

<h2>13. Docker → Kubernetes Yolculuğu Özeti</h2>
<ul>
    <li><strong>Bölüm 38</strong>: K8s nedir, pod, node, deployment, service kavramları.</li>
    <li><strong>Bölüm 39</strong>: kubectl komutları, Minikube, scale, rollout.</li>
    <li><strong>Bölüm 40</strong>: YAML manifestleri, probe'lar, Flask deploy.</li>
    <li><strong>Bölüm 41</strong>: Service türleri, ConfigMap, Secret, PVC, Ingress.</li>
    <li><strong>Bölüm 42</strong>: Helm, güvenlik/performans, Terraform IaC, GitOps, kaynaklar.</li>
</ul>

<div class="info-box tip">
    <div class="info-box-title">💡 Son Söz: Docker + Kubernetes Birlikte</div>
    Docker olmadan Kubernetes öğrenmek eksik kalır — imajlar hâlâ konteyner formatındadır. Kubernetes olmadan Docker öğrenmek de mümkün; ama kariyer ve ölçek söz konusu olduğunda K8s kaçınılmazdır. İkisini birlikte düşünün: Docker paketler, Kubernetes orkestra eder. Mutlu deploy'lar! ☸️
</div>

<h2>14. Güvenlik ve Performans — En İyi Uygulamalar</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Neden ayrı bir konu?</div>
    Üniversite derslerinde (TGO hafta 13) güvenlik ve performans genelde tek başlık altında toplanır. Kubernetes'te "çalışıyor" yetmez — <em>güvenli ve ölçülebilir</em> çalışmalı.
</div>

<h3>Güvenlik</h3>
<table>
    <tr><th>Konu</th><th>Ne yapar?</th><th>Pratik</th></tr>
    <tr>
        <td><strong>Secret yönetimi</strong></td>
        <td>Şifre/API anahtarı YAML'da düz metin olmasın</td>
        <td>K8s Secret, External Secrets, Vault; <code>.env</code> asla Git'e</td>
    </tr>
    <tr>
        <td><strong>RBAC</strong></td>
        <td>Kim hangi kaynağa erişebilir (Role, RoleBinding)</td>
        <td>Prod'da herkese cluster-admin vermeyin; namespace bazlı yetki</td>
    </tr>
    <tr>
        <td><strong>NetworkPolicy</strong></td>
        <td>Pod'lar arası trafiği kısıtlar — "web DB'ye, DB dışarıya kapalı"</td>
        <td>Calico/Cilium gibi CNI destekler; varsayılan K8s'te açık ağ vardır</td>
    </tr>
    <tr>
        <td><strong>İmaj taraması</strong></td>
        <td>CVE (güvenlik açığı) tespiti</td>
        <td>CI'da Trivy, GitHub Dependabot; imaj push öncesi tarayın</td>
    </tr>
    <tr>
        <td><strong>Non-root konteyner</strong></td>
        <td>Konteyner root kullanıcı ile çalışmasın</td>
        <td>Dockerfile'da <code>USER appuser</code>; <code>securityContext</code> in YAML</td>
    </tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>CI'da Trivy ile imaj tarama (GitHub Actions)</span></div>
    <pre><code>      - name: Güvenlik taraması
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: \${{ secrets.DOCKERHUB_USERNAME }}/flask-ci:\${{ github.sha }}
          severity: CRITICAL,HIGH
          exit-code: 1   <span class="comment"># Kritik açık varsa pipeline kır</span></code></pre>
</div>

<h3>Performans ve kaynak yönetimi</h3>
<table>
    <tr><th>Konu</th><th>Açıklama</th></tr>
    <tr><td><strong>requests / limits</strong></td><td>Pod'a min/max CPU ve bellek — kaynak tüketen pod tüm node'u çökertmesin</td></tr>
    <tr><td><strong>HPA</strong></td><td>CPU artınca pod sayısını otomatik artırır (metrics-server gerekir)</td></tr>
    <tr><td><strong>Probe'lar</strong></td><td>liveness/readiness — sağlıksız pod trafik almasın veya yeniden başlasın</td></tr>
    <tr><td><strong>Prometheus + Grafana</strong></td><td>Metrik toplama ve görselleştirme — CPU, bellek, istek sayısı</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>Resource limits örneği (deployment içinde)</span></div>
    <pre><code>resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 256Mi</code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Güvenlik kontrol listesi</div>
    <ul>
        <li>Secret'lar Git'te değil — Secret manager veya sealed-secrets</li>
        <li>Production namespace'te RBAC sınırlı</li>
        <li>İmajlar registry'den imzalı / taranmış</li>
        <li><code>latest</code> tag yerine SHA veya semver tag (geri dönüş için)</li>
        <li>Pod'lar için resource limit tanımlı</li>
    </ul>
</div>

<h2>15. Infrastructure as Code — Terraform Girişi</h2>
<div class="info-box note">
    <div class="info-box-title">📌 IaC, Terraform, Ansible — farklar</div>
    <ul>
        <li><strong>IaC</strong> (Infrastructure as Code): Sunucu, ağ, küme gibi altyapıyı <em>kod dosyasında</em> tanımlamak — elle tıklamak yerine <code>terraform apply</code>.</li>
        <li><strong>Terraform</strong>: HashiCorp aracı; AWS, GCP, Azure, Hetzner kaynaklarını HCL diliyle oluşturur. K8s kümesi bile Terraform ile kurulabilir.</li>
        <li><strong>Ansible</strong>: Sunucuya SSH ile bağlanıp paket kurar, config yazar — "yapılandırma otomasyonu".</li>
        <li><strong>K8s YAML</strong>: Küme <em>içindeki</em> uygulamalar (pod, service). Terraform <em>alttaki</em> altyapıyı (VM, network) kurar; ikisi birlikte kullanılır.</li>
    </ul>
</div>

<table>
    <tr><th>Araç</th><th>Ne yönetir?</th><th>Örnek</th></tr>
    <tr><td><strong>Terraform</strong></td><td>Bulut altyapısı</td><td>EKS kümesi, VPC, load balancer</td></tr>
    <tr><td><strong>Ansible</strong></td><td>Sunucu yapılandırması</td><td>Docker kur, nginx config yaz</td></tr>
    <tr><td><strong>K8s manifest / Helm</strong></td><td>Küme içi uygulama</td><td>Deployment, Service, Ingress</td></tr>
    <tr><td><strong>Kustomize</strong></td><td>YAML overlay (dev/prod)</td><td>base/ + overlays/staging/</td></tr>
</table>

<div class="code-block">
    <div class="code-block-header"><span>main.tf — minimal Terraform örneği (Hetzner sunucu)</span></div>
    <pre><code>terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.45"
    }
  }
}

provider "hcloud" {
  token = var.hcloud_token   <span class="comment"># TF_VAR_hcloud_token ortam değişkeni</span>
}

resource "hcloud_server" "web" {
  name        = "flask-prod"
  image       = "ubuntu-24.04"
  server_type = "cx22"
  location    = "nbg1"
}

output "server_ip" {
  value = hcloud_server.web.ipv4_address
}</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Terraform komutları</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">terraform</span> <span class="argument">init</span>      <span class="comment"># provider indir</span>
<span class="prompt">$</span> <span class="command">terraform</span> <span class="argument">plan</span>      <span class="comment"># ne oluşacak — önizleme</span>
<span class="prompt">$</span> <span class="command">terraform</span> <span class="argument">apply</span>     <span class="comment"># onayla ve oluştur</span>
<span class="prompt">$</span> <span class="command">terraform</span> <span class="argument">destroy</span>   <span class="comment"># kaynakları sil</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 TGO zincirinde yeri</div>
    Terraform ile sunucu/küme kurarsınız → Ansible ile Docker/K8s agent kurabilirsiniz → Uygulama manifestlerini Git + CI/CD ile deploy edersiniz. Hepsi kodda, hepsi tekrarlanabilir — Bölüm 33'deki TGO haritasının altyapı katmanı.
</div>

<h2>16. Sıradaki İleri Hedefler 🎯</h2>
<ul>
    <li><strong>Service Mesh (Istio/Linkerd)</strong> — Mikroservis trafiği, mTLS</li>
    <li><strong>Argo Rollouts</strong> — Canary/Blue-Green K8s native</li>
    <li><strong>Platform Engineering</strong> — Ekiplere self-service K8s platformu</li>
    <li><strong>CKS sertifikası</strong> — K8s güvenlik odaklı</li>
</ul>
`,
    quiz: [
        {
            question: "Helm ne işe yarar?",
            options: [
                "Kubernetes uygulamalarını chart olarak paketler",
                "Linux kernel derler",
                "Docker'ı kaldırır",
                "Sadece log toplar"
            ],
            correct: 0,
            explanation: "Helm, Kubernetes uygulamalarını chart adlı paketler halinde kurmayı, güncellemeyi ve kaldırmayı sağlar."
        },
        {
            question: "Managed Kubernetes (GKE/EKS/AKS) ne sağlar?",
            options: [
                "Control plane'i sağlayıcı yönetir",
                "Hiç YAML yazmazsınız",
                "Sadece Windows destekler",
                "Docker Hub'ı siler"
            ],
            correct: 0,
            explanation: "Managed K8s'te control plane (API server, etcd, scheduler) bulut sağlayıcı tarafından işletilir; siz worker ve uygulamaları yönetirsiniz."
        },
        {
            question: "kind (Kubernetes in Docker) ne avantaj sağlar?",
            options: [
                "Docker konteynerlerinde test kümesi",
                "Sadece macOS'ta çalışır",
                "Helm'in yerine geçer",
                "Pod oluşturamaz"
            ],
            correct: 0,
            explanation: "kind, Docker imajları olarak node'lar oluşturur; CI/CD ve çok node testleri için hafif alternatiftir."
        },
        {
            question: "GitOps'un temel fikri nedir?",
            options: [
                "Manifestler Git'te, küme otomatik senkronize",
                "Git repository silmek",
                "Sadece manuel kubectl",
                "Docker Compose kullanmak"
            ],
            correct: 0,
            explanation: "GitOps'ta istenen durum Git'te tutulur; Argo CD/Flux gibi araçlar küme durumunu repo ile eşitler."
        },
        {
            question: "CKA sertifikası ne odaklıdır?",
            options: [
                "Kubernetes cluster yönetimi (admin)",
                "Sadece frontend geliştirme",
                "Windows Server",
                "Veritabanı SQL"
            ],
            correct: 0,
            explanation: "CKA (Certified Kubernetes Administrator) cluster kurulum, troubleshooting ve yönetim becerilerini ölçer."
        },
        {
            question: "k9s aracı ne sunar?",
            options: [
                "Terminal tabanlı Kubernetes UI",
                "Imaj build servisi",
                "DNS sunucusu",
                "WordPress teması"
            ],
            correct: 0,
            explanation: "k9s, terminalde pod, service, log ve resource yönetimi için görsel TUI sağlar."
        },
        {
            question: "minikube addons enable metrics-server ne sağlar?",
            options: [
                "kubectl top ile CPU/bellek metrikleri",
                "Otomatik Helm kurulumu",
                "Pod silme",
                "Ingress siler"
            ],
            correct: 0,
            explanation: "metrics-server, node ve pod kaynak kullanımını toplar; kubectl top komutu buna dayanır."
        },
        {
            question: "Kustomize ne işe yarar?",
            options: [
                "YAML overlay ile ortam bazlı yapılandırma",
                "Pod CPU hızlandırma",
                "Docker imaj sıkıştırma",
                "Git commit otomasyonu"
            ],
            correct: 0,
            explanation: "Kustomize, base manifestlere overlay ekleyerek dev/staging/prod farklarını yönetir; kubectl ile entegre."
        },
        {
            question: "Helm install my-blog bitnami/wordpress ne yapar?",
            options: [
                "WordPress chart'ını kükeye kurar",
                "WordPress'i siler",
                "Sadece YAML doğrular",
                "Node ekler"
            ],
            correct: 0,
            explanation: "helm install, belirtilen chart'tan gerekli Kubernetes kaynaklarını (deployment, service, pvc...) oluşturur."
        },
        {
            question: "Docker öğrenmeden Kubernetes'e geçmek neden eksik kalır?",
            options: [
                "K8s hâlâ konteyner imajları kullanır",
                "Kubernetes Docker'ın alternatifi değildir, imaj kullanılmaz",
                "kubectl Docker gerektirmez hiç",
                "Pod VM içerir OS ile"
            ],
            correct: 0,
            explanation: "Kubernetes pod'ları konteyner çalıştırır; imaj build/pull mantığı Docker/OCI ekosisteminden gelir. Docker bilgisi temel oluşturur."
        },
        {
            question: "Terraform'un temel amacı nedir?",
            options: [
                "Altyapı kaynaklarını kod ile tanımlayıp oluşturmak",
                "Python unit test yazmak",
                "Git commit mesajı düzenlemek",
                "Pod içine SSH ile girmek"
            ],
            correct: 0,
            explanation: "Terraform (IaC), sunucu, ağ, K8s kümesi gibi altyapıyı main.tf gibi dosyalarla tanımlar; terraform apply ile oluşturur."
        },
        {
            question: "RBAC Kubernetes'te neyi kontrol eder?",
            options: [
                "Kullanıcı/servis hesabının hangi kaynaklara erişebileceğini",
                "Pod CPU hızını otomatik artırır",
                "Docker imajı build eder",
                "FTP bağlantısı kurar"
            ],
            correct: 0,
            explanation: "RBAC (Role-Based Access Control), Role ve RoleBinding ile kim hangi namespace/kaynakta ne yapabilir tanımlar."
        }
    ]
});
