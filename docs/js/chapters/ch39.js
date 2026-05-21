// ===== Bölüm 39: kubectl Komutları — Adım Adım Yolculuk =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 39,
    title: 'kubectl Komutları — Adım Adım',
    subtitle: 'Kubernetes CLI: Step by Step',
    icon: '🎛️',
    description: 'Minikube kurulumu, kubectl get/apply/describe/logs/exec komutları ve ilk deployment\'ınızı adım adım oluşturun.',
    content: `
<h2>Bu Bölümün Mantığı</h2>
<p>Docker bölümünde <code>docker pull → run → ps → logs → exec</code> yolunu izledik. Kubernetes'te de aynı disiplinle gideceğiz: önce kümenin ayakta olduğunu doğrulayacağız, sonra ilk deployment'ı oluşturacağız, pod'ları gözlemleyeceğiz, log okuyacağız, içine gireceğiz.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Bu Bölümü Nasıl Okumalısınız?</div>
    Her adımı terminalinizde <strong>gerçekten yazın</strong>. Kubernetes soyut görünür; komutları çalıştırdıkça somutlaşır. Minikube kurulu değilse önce Adım 0'ı tamamlayın — geri kalan adımlar birkaç dakika sürer.
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Bu Bölümün Yol Haritası</div>
    <ol>
        <li><strong>Adım 0</strong>: Minikube + kubectl kurulumu ve küme başlatma.</li>
        <li><strong>Adım 1–3</strong>: Küme bilgisi, node'lar, namespace'ler.</li>
        <li><strong>Adım 4–7</strong>: Deployment oluşturma, pod listeleme, detay görme.</li>
        <li><strong>Adım 8–10</strong>: Loglar, exec, port-forward ile tarayıcıdan erişim.</li>
        <li><strong>Adım 11–14</strong>: Ölçekleme, güncelleme, silme, imperative vs declarative.</li>
        <li><strong>Mini Proje</strong>: NGINX deployment + Service + tarayıcı testi.</li>
    </ol>
</div>

<h2>Adım 0: Minikube ve kubectl Kurulumu</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Minikube, kubectl, context</div>
    <ul>
        <li><strong>kubectl</strong>: Kubernetes'e komut verdiğiniz CLI aracı — <code>docker</code> komutunun K8s karşılığı.</li>
        <li><strong>Minikube</strong>: Laptop'ta tek sunuculu "oyuncak" Kubernetes kümesi — öğrenmek için ideal.</li>
        <li><strong>Context</strong>: Hangi küme ile konuştuğunuz — Minikube veya bulut kümesi arasında geçiş.</li>
    </ul>
</div>
<p><strong>kubectl</strong> = Kubernetes'e konuştuğunuz CLI. <strong>Minikube</strong> = bilgisayarınızda tek node'luk bir küme.</p>

<h3>Linux (Ubuntu/Debian)</h3>
<div class="code-block">
    <div class="code-block-header"><span>kubectl kurulumu</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-LO</span> <span class="string">"https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"</span>
<span class="prompt">$</span> <span class="command">chmod</span> <span class="argument">+x kubectl</span>
<span class="prompt">$</span> <span class="command">sudo mv</span> <span class="argument">kubectl /usr/local/bin/</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">version --client</span>
<span class="output">Client Version: v1.30.x</span></code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Minikube kurulumu</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">curl</span> <span class="flag">-LO</span> <span class="string">https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64</span>
<span class="prompt">$</span> <span class="command">sudo install</span> <span class="argument">minikube-linux-amd64 /usr/local/bin/minikube</span>

<span class="comment"># Minikube, konteyner runtime olarak Docker kullanır — Docker kurulu olmalı:</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">--version</span>

<span class="prompt">$</span> <span class="command">minikube</span> <span class="argument">start --driver=docker</span>
<span class="output">😄  minikube v1.33.x on Ubuntu 24.04
✨  Using the docker driver
🏃  Starting control plane node minikube in cluster minikube
🔥  Creating docker container (CPUs=2, Memory=3900MB) ...
🐳  Preparing Kubernetes v1.30.x on Docker ...
✅  kubectl is now configured to use "minikube" cluster</span></code></pre>
</div>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Docker Servisi ve İzinler</div>
    Minikube Docker sürücüsü kullanıyorsa Docker daemon çalışır olmalıdır:
    <pre><code><span class="prompt">$</span> <span class="command">sudo systemctl start docker</span>
<span class="prompt">$</span> <span class="command">sudo usermod</span> <span class="flag">-aG</span> <span class="argument">docker $USER</span>   <span class="comment"># sonra oturumu yenileyin</span></code></pre>
    <code>minikube start</code> hata verirse <code>minikube logs</code> ile detay bakın. RAM yetersizse <code>minikube start --memory=4096</code> deneyin.
</div>

<h3>macOS / Windows</h3>
<ul>
    <li><strong>macOS</strong>: <code>brew install minikube kubectl</code></li>
    <li><strong>Windows</strong>: <a href="https://minikube.sigs.k8s.io/docs/start/" target="_blank" rel="noopener">Minikube resmi kurulum</a> veya Docker Desktop içinde "Enable Kubernetes"</li>
</ul>

<h2>Adım 1: Küme Ayakta mı? — <code>kubectl cluster-info</code></h2>
<div class="code-block">
    <div class="code-block-header"><span>Küme durumu</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">cluster-info</span>
<span class="output">Kubernetes control plane is running at https://192.168.49.2:8443
CoreDNS is running at https://192.168.49.2:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy</span>

<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get nodes</span>
<span class="output">NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   5m    v1.30.x</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Minikube'ta Tek Node Normaldir</div>
    Öğrenme kümesinde control plane ve worker aynı makinede olabilir. Üretimde onlarca worker node olur; mantık aynıdır.
</div>

<h2>Adım 2: kubectl Komut Yapısı</h2>
<p>Genel format:</p>
<pre><code>kubectl [komut] [kaynak-türü] [isim] [bayraklar]

<span class="comment"># Örnekler:</span>
kubectl get pods
kubectl describe pod nginx-abc123
kubectl logs deployment/hello
kubectl delete deployment hello</code></pre>

<div class="eng-box">
    <div class="eng-title">🔤 Sık Kullanılan kubectl Komutları</div>
    <div class="eng-content">
        <span class="eng-word">get</span> = <span class="eng-meaning">Listele</span> — Kaynakları tablo halinde göster.<br>
        <span class="eng-word">describe</span> = <span class="eng-meaning">Detaylandır</span> — Olaylar, hatalar, yapılandırma detayı.<br>
        <span class="eng-word">create</span> = <span class="eng-meaning">Oluştur</span> — Hızlı imperative oluşturma.<br>
        <span class="eng-word">apply</span> = <span class="eng-meaning">Uygula</span> — YAML dosyasını kükeye uygula (declarative).<br>
        <span class="eng-word">delete</span> = <span class="eng-meaning">Sil</span> — Kaynağı kaldır.<br>
        <span class="eng-word">logs</span> = <span class="eng-meaning">Loglar</span> — Pod stdout/stderr çıktısı.<br>
        <span class="eng-word">exec</span> = <span class="eng-meaning">Çalıştır</span> — Pod içinde komut/shell.<br>
        <span class="eng-word">port-forward</span> = <span class="eng-meaning">Port yönlendir</span> — Pod portunu localhost'a bağla.
    </div>
</div>

<h2>Adım 3: Namespace'leri Görelim</h2>
<div class="code-block">
    <div class="code-block-header"><span>Namespace listesi</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get namespaces</span>
<span class="output">NAME              STATUS   AGE
default           Active   10m
kube-node-lease   Active   10m
kube-public       Active   10m
kube-system       Active   10m</span>

<span class="comment"># Varsayılan namespace'te çalışırsınız. Belirtmek için:</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get pods -n kube-system</span></code></pre>
</div>

<h2>Adım 4: İlk Deployment — <code>kubectl create deployment</code></h2>
<p>Docker'daki <code>docker run nginx</code> karşılığı:</p>

<div class="code-block">
    <div class="code-block-header"><span>NGINX deployment oluştur</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">create deployment web --image=nginx</span>
<span class="output">deployment.apps/web created</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Ne Oldu?</div>
    <ol>
        <li>Kubernetes bir <strong>Deployment</strong> oluşturdu (adı: web).</li>
        <li>Deployment, varsayılan olarak <strong>1 replica</strong> pod başlattı.</li>
        <li>Pod, <code>nginx</code> imajını kullanan bir konteyner çalıştırıyor.</li>
        <li>İmaj yerelde yoksa node imajı registry'den (Docker Hub) çeker — tıpkı Docker gibi.</li>
    </ol>
</div>

<h2>Adım 5: Pod'ları Listele — <code>kubectl get pods</code></h2>
<div class="code-block">
    <div class="code-block-header"><span>Pod durumu</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get pods</span>
<span class="output">NAME                   READY   STATUS    RESTARTS   AGE
web-7f8b9c6d5-xk2pq    1/1     Running   0          45s</span>

<span class="comment"># Daha fazla bilgi (node, IP):</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get pods -o wide</span>

<span class="comment"># Canlı izleme (pod durumu değişince yenilenir):</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get pods -w</span></code></pre>
</div>

<p>STATUS sütunu kritiktir:</p>

<div class="info-box note">
    <div class="info-box-title">📌 Pod durumları — ne anlama gelir?</div>
    <ul>
        <li><strong>Pending</strong>: Henüz başlamadı — imaj indiriliyor veya sunucu bekleniyor.</li>
        <li><strong>Running</strong>: Pod çalışıyor, sorun yok.</li>
        <li><strong>CrashLoopBackOff</strong>: Konteyner açılıp hemen çöküyor, Kubernetes tekrar deniyor — loglara bakın.</li>
        <li><strong>ImagePullBackOff</strong>: İmaj indirilemedi — isim yanlış veya internet/registry sorunu.</li>
    </ul>
</div>
<table>
    <tr><th>STATUS</th><th>Anlam</th></tr>
    <tr><td><code>Pending</code></td><td>Henüz node'a atanmadı veya imaj indiriliyor</td></tr>
    <tr><td><code>Running</code></td><td>Pod çalışıyor</td></tr>
    <tr><td><code>CrashLoopBackOff</code></td><td>Konteyner başlayıp çöküyor, tekrar deniyor</td></tr>
    <tr><td><code>Error</code></td><td>Pod oluşturulamadı</td></tr>
    <tr><td><code>ImagePullBackOff</code></td><td>İmaj indirilemedi (isim yanlış, ağ yok)</td></tr>
</table>

<h2>Adım 6: Detaylı İnceleme — <code>kubectl describe</code></h2>
<p>Pod sorunluysa ilk bakılacak yer:</p>

<div class="code-block">
    <div class="code-block-header"><span>Pod detayı</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">describe pod web-7f8b9c6d5-xk2pq</span>
<span class="comment"># ... Events bölümüne dikkat:
#   Normal  Scheduled  ...  Successfully assigned default/web-... to minikube
#   Normal  Pulled     ...  Container image "nginx" already present
#   Normal  Created    ...  Created container
#   Normal  Started    ...  Started container</span></code></pre>
</div>

<p><strong>Events</strong> bölümü, Docker'daki <code>docker logs</code> + hata mesajlarının birleşimi gibidir. "Neden Pending'de kaldı?" sorusunun cevabı genelde burada.</p>

<h2>Adım 7: Deployment ve ReplicaSet</h2>
<div class="code-block">
    <div class="code-block-header"><span>İlişkili kaynaklar</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get deployments</span>
<span class="output">NAME   READY   UP-TO-DATE   AVAILABLE   AGE
web    1/1     1            1           3m</span>

<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get replicasets</span>
<span class="output">NAME             DESIRED   CURRENT   READY   AGE
web-7f8b9c6d5    1         1         1       3m</span></code></pre>
</div>

<p>Hiyerarşi: <strong>Deployment → ReplicaSet → Pod</strong>.</p>

<div class="info-box note">
    <div class="info-box-title">📌 ReplicaSet nedir?</div>
    <strong>ReplicaSet</strong>, Deployment'ın "kaç kopya pod olsun" kuralını uygulayan ara katmandır. Siz Deployment'a konuşursunuz; ReplicaSet pod sayısını korur — doğrudan yönetmeniz gerekmez.
</div>

<h2>Adım 8: Logları Okuyalım — <code>kubectl logs</code></h2>
<div class="code-block">
    <div class="code-block-header"><span>Pod logları</span></div>
    <pre><code><span class="comment"># Pod adıyla:</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">logs web-7f8b9c6d5-xk2pq</span>

<span class="comment"># Deployment adıyla (rastgele bir pod'un logu):</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">logs deployment/web</span>

<span class="comment"># Canlı takip (docker logs -f gibi):</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">logs -f deployment/web</span></code></pre>
</div>

<h2>Adım 9: Pod İçine Gir — <code>kubectl exec</code></h2>
<div class="code-block">
    <div class="code-block-header"><span>Pod içinde shell</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">exec -it deployment/web -- bash</span>
<span class="comment"># NGINX imajında bash yoksa sh kullanın:</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">exec -it deployment/web -- sh</span>

<span class="output">/ # nginx -v
nginx version: nginx/1.25.x
/ # exit</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 docker exec vs kubectl exec</div>
    <code>docker exec -it konteyner bash</code> → tek konteynere girersiniz.<br>
    <code>kubectl exec -it deployment/web -- sh</code> → deployment'ın bir pod'una girersiniz. Birden fazla pod varsa <code>-l app=web</code> ile seçim yapabilirsiniz.
</div>

<h2>Adım 10: Tarayıcıdan Erişim — <code>port-forward</code></h2>
<div class="info-box note">
    <div class="info-box-title">📌 port-forward vs NodePort vs Service</div>
    <ul>
        <li><strong>port-forward</strong>: Geçici — sadece sizin bilgisayarınızdan test için (kubectl kapandığında biter).</li>
        <li><strong>Service / NodePort</strong>: Kalıcı ağ erişimi — uygulamaya sürekli kapı.</li>
    </ul>
</div>
<p>Henüz Service oluşturmadık. Geçici olarak pod portunu bilgisayarınıza yönlendirebilirsiniz:</p>

<div class="code-block">
    <div class="code-block-header"><span>Port yönlendirme</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">port-forward deployment/web 8080:80</span>
<span class="output">Forwarding from 127.0.0.1:8080 -&gt; 80
Forwarding from [::1]:8080 -&gt; 80</span>
<span class="comment"># Başka terminalde veya tarayıcıda: http://localhost:8080</span></code></pre>
</div>

<p>Bu, Docker'daki <code>-p 8080:80</code> ile aynı mantık; fakat geçicidir (kubectl kapandığında biter). Kalıcı erişim için sonraki bölümlerde <strong>Service</strong> kullanacağız.</p>

<h2>Adım 11: Ölçekleme — <code>kubectl scale</code></h2>
<div class="code-block">
    <div class="code-block-header"><span>Replica sayısını artır</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">scale deployment web --replicas=3</span>
<span class="output">deployment.apps/web scaled</span>

<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get pods</span>
<span class="output">NAME                   READY   STATUS    RESTARTS   AGE
web-7f8b9c6d5-aaa      1/1     Running   0          10m
web-7f8b9c6d5-bbb      1/1     Running   0          15s
web-7f8b9c6d5-ccc      1/1     Running   0          15s</span></code></pre>
</div>

<p>Üç pod aynı deployment'a bağlı. Biri silinse Kubernetes yeniden oluşturur:</p>
<pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">delete pod web-7f8b9c6d5-aaa</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get pods -w</span>
<span class="comment"># Yeni bir pod otomatik oluşur — replica 3'te kalır</span></code></pre>

<h2>Adım 12: İmaj Güncelleme — <code>kubectl set image</code></h2>
<div class="code-block">
    <div class="code-block-header"><span>Rolling update</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">set image deployment/web nginx=nginx:1.25-alpine</span>
<span class="output">deployment.apps/web image updated</span>

<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">rollout status deployment/web</span>
<span class="output">Waiting for deployment "web" rollout to finish: 1 out of 3 new replicas have been updated...
deployment "web" successfully rolled out</span></code></pre>
</div>

<p>Kubernetes pod'ları tek tek günceller — site kesintisiz kalır. Geri almak için:</p>
<pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">rollout undo deployment/web</span></code></pre>

<h2>Adım 13: Silme — <code>kubectl delete</code></h2>
<div class="code-block">
    <div class="code-block-header"><span>Kaynak silme</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">delete deployment web</span>
<span class="output">deployment.apps "web" deleted</span>
<span class="comment"># Bağlı pod'lar da silinir</span>

<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get pods</span>
<span class="output">No resources found in default namespace.</span></code></pre>
</div>

<h2>Adım 14: Imperative vs Declarative</h2>
<div class="info-box note">
    <div class="info-box-title">📌 Imperative vs Declarative</div>
    <ul>
        <li><strong>Imperative</strong> (<em>emir kipi</em>): <code>kubectl create deployment web --image=nginx</code> — "şunu yap" dersiniz.</li>
        <li><strong>Declarative</strong> (<em>bildirimsel</em>): <code>kubectl apply -f deployment.yaml</code> — "hedef durum bu olsun" dersiniz; dosya Git'te kalır.</li>
    </ul>
    Üretimde YAML + Git standarttır — kim ne deploy etti takip edilir.
</div>
<table>
    <tr><th>Yaklaşım</th><th>Örnek</th><th>Ne zaman?</th></tr>
    <tr><td><strong>Imperative</strong> (emir)</td><td><code>kubectl create deployment web --image=nginx</code></td><td>Hızlı deneme, öğrenme</td></tr>
    <tr><td><strong>Declarative</strong> (bildirimsel)</td><td><code>kubectl apply -f deployment.yaml</code></td><td>Üretim, GitOps, ekip çalışması</td></tr>
</table>

<div class="info-box tip">
    <div class="info-box-title">💡 Üretimde YAML Kazanır</div>
    <code>create deployment</code> hızlıdır ama yapılandırma Git'te kalmaz. Sonraki bölümde YAML manifestleri yazacağız — ekipler genelde tüm yapılandırmayı versiyon kontrolünde tutar.
</div>

<h2>Mini Proje: NGINX + Service</h2>
<p>Deployment'ı yeniden oluşturup kalıcı erişim için basit bir Service ekleyelim:</p>

<div class="code-block">
    <div class="code-block-header"><span>Tam akış</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">create deployment web --image=nginx</span>
<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">expose deployment web --port=80 --type=NodePort</span>
<span class="output">service/web exposed</span>

<span class="prompt">$</span> <span class="command">kubectl</span> <span class="argument">get svc web</span>
<span class="output">NAME   TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
web    NodePort   10.96.123.45    &lt;none&gt;        80:31234/TCP   10s</span>

<span class="comment"># Minikube'ta tarayıcı URL'si:</span>
<span class="prompt">$</span> <span class="command">minikube</span> <span class="argument">service web --url</span>
<span class="output">http://192.168.49.2:31234</span></code></pre>
</div>

<p>Service türlerini (ClusterIP, NodePort, LoadBalancer) bir sonraki bölümde detaylı göreceğiz. Şimdilik "pod'lara sabit kapı" olduğunu bilin yeter.</p>

<h2>Sorun Giderme Tablosu</h2>
<table>
    <tr><th>Belirti</th><th>Olası neden</th><th>Ne yapmalı?</th></tr>
    <tr><td><code>connection refused</code></td><td>Minikube kapalı</td><td><code>minikube start</code></td></tr>
    <tr><td><code>ImagePullBackOff</code></td><td>İmaj adı yanlış / ağ yok</td><td><code>kubectl describe pod</code></td></tr>
    <tr><td><code>CrashLoopBackOff</code></td><td>Uygulama hemen çöküyor</td><td><code>kubectl logs</code></td></tr>
    <tr><td>Pod <code>Pending</code></td><td>CPU/RAM yetmiyor</td><td><code>kubectl describe pod</code>, Minikube RAM artır</td></tr>
    <tr><td>Yanlış küme</td><td>context karışıklığı</td><td><code>kubectl config get-contexts</code></td></tr>
</table>

<h2>Minikube Yaşam Döngüsü</h2>
<pre><code><span class="prompt">$</span> <span class="command">minikube</span> <span class="argument">stop</span>      <span class="comment"># Küme durur, veri kalır</span>
<span class="prompt">$</span> <span class="command">minikube</span> <span class="argument">start</span>     <span class="comment"># Tekrar başlat</span>
<span class="prompt">$</span> <span class="command">minikube</span> <span class="argument">delete</span>    <span class="comment"># Küme tamamen silinir</span>
<span class="prompt">$</span> <span class="command">minikube</span> <span class="argument">dashboard</span> <span class="comment"># Web arayüzü (opsiyonel)</span></code></pre>

<div class="info-box tip">
    <div class="info-box-title">💡 Dashboard Yeni Başlayanlara Yardımcı Olur</div>
    <code>minikube dashboard</code> tarayıcıda görsel bir arayüz açar. Pod, deployment, log — hepsini tıklayarak görebilirsiniz. CLI öğrenirken yan panel olarak kullanın.
</div>

<h2>Özet</h2>
<ul>
    <li><code>kubectl get/describe/logs/exec</code> günlük araçlarınızdır.</li>
    <li>Deployment oluşturur, scale eder, güncellersiniz — pod'ları tek tek yönetmezsiniz.</li>
    <li><code>port-forward</code> geçici erişim; <code>expose</code> / Service kalıcı erişim.</li>
    <li>Hata ayıklamada <strong>describe + events + logs</strong> üçlüsünü kullanın.</li>
</ul>
<p>Sonraki bölümde aynı kaynakları YAML dosyalarıyla tanımlayacağız.</p>
`,
    quiz: [
        {
            question: "kubectl'in temel görevi nedir?",
            options: [
                "Kubernetes API ile konuşmak",
                "Docker imajı derlemek",
                "Linux kernel güncellemek",
                "Veritabanı yedeklemek"
            ],
            correct: 0,
            explanation: "kubectl, Kubernetes kümesine komut gönderen resmi CLI aracıdır."
        },
        {
            question: "Pod STATUS 'CrashLoopBackOff' ne anlama gelir?",
            options: [
                "Pod başarıyla çalışıyor",
                "Konteyner çöküp yeniden başlatılıyor",
                "Imaj indiriliyor",
                "Pod silinmiş"
            ],
            correct: 1,
            explanation: "CrashLoopBackOff, konteynerin başlayıp hemen çöktüğü ve Kubernetes'in tekrar denediği durumdur. logs ve describe ile neden bulunur."
        },
        {
            question: "kubectl scale deployment web --replicas=3 ne yapar?",
            options: [
                "3 farklı deployment oluşturur",
                "Web deployment'ının pod sayısını 3 yapar",
                "3 node ekler",
                "3 namespace oluşturur"
            ],
            correct: 1,
            explanation: "scale komutu deployment'ın replica sayısını değiştirir; Kubernetes gerekli pod'ları oluşturur veya fazlaları siler."
        },
        {
            question: "kubectl port-forward deployment/web 8080:80 ne sağlar?",
            options: [
                "Pod'un 80 portunu localhost 8080'e yönlendirir",
                "80 pod oluşturur",
                "Deployment'ı siler",
                "Sadece log gösterir"
            ],
            correct: 0,
            explanation: "port-forward, pod/deployment portunu yerel makinenize geçici olarak bağlar; tarayıcıdan test için idealdir."
        },
        {
            question: "Hata ayıklamada Events bölümü hangi komutta görünür?",
            options: [
                "kubectl describe",
                "kubectl version",
                "kubectl config",
                "kubectl api-resources"
            ],
            correct: 0,
            explanation: "kubectl describe pod/deployment çıktısındaki Events, scheduling, imaj çekme ve başlatma hatalarını gösterir."
        },
        {
            question: "Deployment → ReplicaSet → Pod ilişkisi doğru mu?",
            options: [
                "Evet, bu hiyerarşi doğrudur",
                "Hayır, Pod Deployment'ın üstüdür",
                "ReplicaSet yoktur",
                "Sadece Docker Compose'da vardır"
            ],
            correct: 0,
            explanation: "Deployment replica ve güncelleme yönetir; ReplicaSet pod sayısını korur; Pod'lar gerçek konteynerleri çalıştırır."
        },
        {
            question: "Minikube ne işe yarar?",
            options: [
                "Laptop'ta öğrenme kümesi sağlar",
                "Sadece Docker imajı tarar",
                "Windows'u Linux'a çevirir",
                "Git repository oluşturur"
            ],
            correct: 0,
            explanation: "Minikube, geliştiricilerin tek makinede Kubernetes kümesi çalıştırmasını sağlar."
        },
        {
            question: "kubectl apply ile kubectl create arasındaki fark?",
            options: [
                "apply YAML ile declarative güncelleme yapar",
                "create sadece pod siler",
                "Fark yoktur",
                "apply sadece Windows'ta çalışır"
            ],
            correct: 0,
            explanation: "create imperative tek seferlik oluşturur; apply manifest dosyasını kükeye uygular ve değişiklikleri günceller (idempotent)."
        },
        {
            question: "rollout undo deployment/web ne yapar?",
            options: [
                "Önceki sürüme geri döner",
                "Tüm küme silinir",
                "Pod sayısını sıfırlar",
                "Minikube'u kapatır"
            ],
            correct: 0,
            explanation: "rollout undo, deployment'ın önceki ReplicaSet'ine döner — bozuk güncelleme sonrası kurtarma aracıdır."
        },
        {
            question: "kubectl get pods -n kube-system ne listeler?",
            options: [
                "kube-system namespace'indeki pod'ları",
                "Sadece default pod'ları",
                "Tüm node'ları",
                "Silinen pod'ları"
            ],
            correct: 0,
            explanation: "-n (namespace) bayrağı hangi namespace'te listeleme yapılacağını belirtir. kube-system, Kubernetes sistem bileşenlerini içerir."
        }
    ]
});
