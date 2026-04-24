// ===== Bölüm 25: Dockerfile ve Docker Hub — Kendi İmajınızı Oluşturun =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 25,
    title: 'Dockerfile ve Docker Hub',
    subtitle: 'Building Images & Sharing on Docker Hub',
    icon: '🏗️',
    description: 'Kendi imajınızı Dockerfile ile sıfırdan oluşturmayı, katman mantığını, .dockerignore kullanımını ve imajınızı Docker Hub üzerinde paylaşmayı öğrenin.',
    content: `
<h2>Neden Kendi İmajımız?</h2>
<p>Hazır imajlar harika — Python, NGINX, PostgreSQL ve binlerce başkası Docker Hub'da hazır. Ama sizin uygulamanız? Onu bir imaj haline getirmek, başkalarının (veya gelecekteki siz) bir komutla çalıştırabilmesi demek. İşte burada <strong>Dockerfile</strong> devreye girer.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Dockerfile Nedir?</div>
    Dockerfile, Docker'a <em>"şöyle bir imaj oluşturmanı istiyorum"</em> diye tarif veren düz metin dosyasıdır. Her satırı Docker adım adım çalıştırır ve sonuç olarak bir imaj üretir. Bu imajı sonra istediğiniz makinede konteyner olarak çalıştırabilirsiniz.
</div>

<h2>İlk Dockerfile — Merhaba Dünya</h2>
<p>En basit başlangıç: küçük bir Python scripti konteyner haline getirelim.</p>

<div class="code-block">
    <div class="code-block-header"><span>Proje yapısı</span></div>
    <pre><code>selam/
├── Dockerfile
└── app.py</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>app.py</span></div>
    <pre><code>print("Merhaba, Docker dünyası!")</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Dockerfile</span></div>
    <pre><code>FROM python:3.12-slim
WORKDIR /app
COPY app.py .
CMD ["python", "app.py"]</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>İmajı oluştur ve çalıştır</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">cd</span> <span class="argument">selam</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">build</span> <span class="flag">-t</span> <span class="argument">selam:1.0 .</span>
<span class="comment"># -t: tag (isim:sürüm)
# . : Dockerfile'ın bulunduğu dizin (build context)</span>

<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">run</span> <span class="flag">--rm</span> <span class="argument">selam:1.0</span>
<span class="output">Merhaba, Docker dünyası!</span></code></pre>
</div>

<p>Üç Dockerfile satırını açıklayalım:</p>
<ul>
    <li><code>FROM python:3.12-slim</code>: "Temel olarak Python 3.12'nin slim versiyonunu kullan." Her Dockerfile genelde <code>FROM</code> ile başlar. Sıfırdan değil, var olan bir imajın üstüne inşa edersiniz.</li>
    <li><code>WORKDIR /app</code>: "Konteyner içindeki çalışma dizini <code>/app</code> olsun." Sonraki komutlar (COPY, RUN, CMD) bu dizinde çalışır.</li>
    <li><code>COPY app.py .</code>: "Build bağlamından (hostta bulunduğum klasör) app.py dosyasını, konteynerin çalışma dizinine kopyala." Nokta <code>.</code> burada <em>/app</em>'i temsil eder.</li>
    <li><code>CMD ["python", "app.py"]</code>: "Konteyner başlatıldığında şu komutu çalıştır."</li>
</ul>

<h2>Dockerfile Talimatları — Tam Liste</h2>

<h3>FROM — Temel İmaj</h3>
<p>Her Dockerfile <code>FROM</code> ile başlar (çok nadir durumlar hariç). Bu, üzerine inşa edeceğiniz imajdır.</p>
<div class="code-block">
    <div class="code-block-header"><span>Farklı temel imaj seçimleri</span></div>
    <pre><code>FROM ubuntu:22.04
FROM python:3.12
FROM python:3.12-slim       <span class="comment"># Debian slim — küçük</span>
FROM python:3.12-alpine     <span class="comment"># Alpine Linux — çok küçük (~50MB)</span>
FROM node:20-alpine
FROM golang:1.22 AS builder <span class="comment"># İsim verilmiş aşama (multi-stage build)</span>
FROM scratch                <span class="comment"># Tamamen boş — sadece ileri seviye kullanımlar için</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Hangi Tag'i Seçmeli?</div>
    <ul>
        <li><strong>Deneme/öğrenme</strong>: <code>python:3.12</code> — büyük ama her şey hazır</li>
        <li><strong>Üretim (genel)</strong>: <code>python:3.12-slim</code> — küçük, çoğu gereksiz araç yok</li>
        <li><strong>Minimum boyut</strong>: <code>python:3.12-alpine</code> — en küçük, ama bazı paketler Alpine'da sorun çıkarabilir (musl libc farklılığı)</li>
        <li><strong>Daima spesifik sürüm</strong>: <code>:3.12.1</code> gibi kesin numara tercih edin</li>
    </ul>
</div>

<h3>WORKDIR — Çalışma Dizini</h3>
<p>Konteyner içindeki "current directory". <code>cd</code> gibi düşünün ama kalıcı.</p>
<pre><code>WORKDIR /app
<span class="comment"># Klasör yoksa otomatik oluşturulur. Sonraki tüm komutlar burada çalışır.</span></code></pre>

<h3>COPY ve ADD — Dosya Kopyalama</h3>
<pre><code>COPY kaynak hedef
COPY app.py /app/
COPY . /app/                <span class="comment"># Tüm build bağlamını</span>
COPY requirements.txt .     <span class="comment"># . = WORKDIR</span>
COPY <span class="flag">--chown=user:user</span> ./src /app/src

<span class="comment"># ADD, COPY'nin süper gücü olan versiyonu:
# - Tar arşivlerini otomatik açar (.tar.gz vs.)
# - URL'den indirebilir
# Ama BU ÖZELLİKLER GENELDE İSTENMEZ. En iyi pratik: hep COPY kullanın.</span>
ADD https://example.com/dosya.tar.gz /app/   <span class="comment"># Genelde önerilmez</span></code></pre>

<h3>RUN — Build Sırasında Komut Çalıştır</h3>
<p>İmajı oluştururken (build aşaması) çalışacak komutlar. Paket kurmak, dosya düzenlemek, derlemek için.</p>
<pre><code>RUN apt-get update && apt-get install -y curl git
RUN pip install --no-cache-dir flask
RUN mkdir -p /app/data && chown app:app /app/data
RUN echo "merhaba" &gt; /dev/null</code></pre>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Her RUN Yeni Bir Katmandır</div>
    Her <code>RUN</code> satırı imajda ayrı bir katman (layer) oluşturur. Çok sayıda küçük RUN yerine bunları <code>&&</code> ile birleştirmek imaj boyutunu düşürür. Yan yana yazılan şu kural önemlidir:
    <pre><code><span class="comment"># Kötü (3 katman, 3 MB gereksiz):</span>
RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*

<span class="comment"># İyi (tek katman, temiz):</span>
RUN apt-get update && apt-get install -y \\
    curl \\
    git \\
 && rm -rf /var/lib/apt/lists/*</code></pre>
</div>

<h3>CMD ve ENTRYPOINT — Konteyner Başlarken Çalışan</h3>
<p>İmaj hazır olduğunda, <code>docker run</code> ile başlatıldığında hangi komut çalışır? İki seçenek:</p>
<ul>
    <li><strong>CMD</strong>: Varsayılan komut. Kullanıcı <code>docker run</code> sonuna farklı bir komut yazarsa, CMD <strong>tamamen değiştirilir</strong>.</li>
    <li><strong>ENTRYPOINT</strong>: Her durumda çalışan komut. Kullanıcının yazdığı ek argümanlar ENTRYPOINT'e <strong>eklenir</strong> (append).</li>
</ul>

<div class="code-block">
    <div class="code-block-header"><span>CMD ile ENTRYPOINT farkı</span></div>
    <pre><code><span class="comment"># ÖRNEK 1 — Sadece CMD</span>
CMD ["python", "app.py"]

<span class="prompt">$</span> <span class="command">docker run benim-imaj</span>            <span class="comment"># python app.py çalışır</span>
<span class="prompt">$</span> <span class="command">docker run benim-imaj echo hi</span>    <span class="comment"># CMD iptal, echo hi çalışır</span>

<span class="comment"># ÖRNEK 2 — Sadece ENTRYPOINT</span>
ENTRYPOINT ["python", "app.py"]

<span class="prompt">$</span> <span class="command">docker run benim-imaj</span>            <span class="comment"># python app.py</span>
<span class="prompt">$</span> <span class="command">docker run benim-imaj --help</span>     <span class="comment"># python app.py --help</span>

<span class="comment"># ÖRNEK 3 — İkisi Birlikte (en esnek)</span>
ENTRYPOINT ["python"]
CMD ["app.py"]

<span class="prompt">$</span> <span class="command">docker run benim-imaj</span>            <span class="comment"># python app.py</span>
<span class="prompt">$</span> <span class="command">docker run benim-imaj test.py</span>    <span class="comment"># python test.py</span>
<span class="prompt">$</span> <span class="command">docker run benim-imaj -c</span> <span class="string">"print(1)"</span>  <span class="comment"># python -c "print(1)"</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Liste mi String mi?</div>
    <p>İki yazım şekli var:</p>
    <ul>
        <li><strong>Exec form</strong> (tavsiye): <code>CMD ["python", "app.py"]</code> — JSON dizi. Doğrudan komutu çalıştırır, <code>sh</code> aracılığı olmaz.</li>
        <li><strong>Shell form</strong>: <code>CMD python app.py</code> — <code>/bin/sh -c "python app.py"</code> olarak çalışır.</li>
    </ul>
    <p>Exec form daha iyidir çünkü sinyalleri (SIGTERM vb.) doğrudan alır. Shell form'da sinyaller <code>sh</code>'ye gider, uygulamaya ulaşmaz.</p>
</div>

<h3>ENV — Ortam Değişkenleri</h3>
<pre><code>ENV PYTHON_VERSION=3.12
ENV PATH="/app/bin:$PATH"
ENV NODE_ENV=production \\
    LOG_LEVEL=info</code></pre>

<h3>EXPOSE — Dokümantasyon Amaçlı Port</h3>
<pre><code>EXPOSE 8080
EXPOSE 80 443/tcp 53/udp</code></pre>
<p><code>EXPOSE</code> sadece <strong>belgeleme</strong> amaçlıdır — "bu imaj bu portu dinler" der. Portu dışarı gerçekten açmaz; onu <code>docker run -p</code> yapar.</p>

<h3>VOLUME — Mount Noktası Belirtme</h3>
<pre><code>VOLUME ["/data"]
<span class="comment"># "Bu klasör volume olmalı" der. docker run sırasında -v ile bağlanması gerektiğini işaret eder.</span></code></pre>

<h3>USER — Hangi Kullanıcıyla</h3>
<pre><code>RUN useradd -m app
USER app
<span class="comment"># Sonraki komutlar ve konteyner, "app" kullanıcısı olarak çalışır.
# Üretimde root'ta çalıştırmak güvenlik riskidir — USER kullanın.</span></code></pre>

<h3>ARG — Build Zamanı Değişkeni</h3>
<pre><code>ARG VERSION=1.0
ARG BUILD_DATE
RUN echo "Sürüm: $VERSION, Tarih: $BUILD_DATE"

<span class="comment"># Build sırasında:
# docker build --build-arg VERSION=2.0 --build-arg BUILD_DATE=2026-01-01 -t x .</span></code></pre>

<p><strong>ARG vs ENV farkı</strong>: ARG sadece build sırasında var, konteyner içinde yok. ENV ise konteyner çalışırken de vardır.</p>

<h3>HEALTHCHECK — Sağlık Kontrolü</h3>
<pre><code>HEALTHCHECK <span class="flag">--interval=30s</span> <span class="flag">--timeout=3s</span> \\
    CMD curl -f http://localhost/ || exit 1
<span class="comment"># Docker her 30sn'de uygulamanın yaşadığını kontrol eder.</span></code></pre>

<h3>LABEL — Etiket/Metadata</h3>
<pre><code>LABEL maintainer="ahmet@example.com"
LABEL version="1.0"
LABEL description="Benim harika uygulamam"</code></pre>

<h2>Gerçek Bir Örnek — Flask Web Uygulaması</h2>

<div class="code-block">
    <div class="code-block-header"><span>Proje yapısı</span></div>
    <pre><code>flask-ornegi/
├── Dockerfile
├── .dockerignore
├── requirements.txt
└── app.py</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>app.py</span></div>
    <pre><code>from flask import Flask
import os
app = Flask(__name__)

@app.route("/")
def index():
    return f"Selam {os.getenv('USER_NAME', 'yabancı')}!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>requirements.txt</span></div>
    <pre><code>flask==3.0.0</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Dockerfile</span></div>
    <pre><code>FROM python:3.12-slim

WORKDIR /app

<span class="comment"># Bağımlılıkları önce kur — katman önbelleğinden yararlanalım</span>
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

<span class="comment"># Kodu sonra kopyala (değişiklikler pip kurulumunu tetiklemez)</span>
COPY . .

<span class="comment"># Kök olmayan kullanıcı</span>
RUN useradd -m app && chown -R app /app
USER app

ENV USER_NAME=Dünya
EXPOSE 5000

CMD ["python", "app.py"]</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>.dockerignore</span></div>
    <pre><code>__pycache__
*.pyc
.git
.env
node_modules
.venv
*.log
README.md</code></pre>
</div>

<div class="code-block">
    <div class="code-block-header"><span>Build ve çalıştırma</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker</span> <span class="argument">build</span> <span class="flag">-t</span> <span class="argument">flask-ornek:1.0 .</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">run</span> <span class="flag">-d -p</span> <span class="argument">8080:5000</span> \\
    <span class="flag">-e</span> <span class="argument">USER_NAME=Ahmet</span> \\
    <span class="flag">--name</span> <span class="argument">web flask-ornek:1.0</span>

<span class="prompt">$</span> <span class="command">curl</span> <span class="argument">http://localhost:8080</span>
<span class="output">Selam Ahmet!</span></code></pre>
</div>

<h2>.dockerignore Dosyası</h2>
<p><code>COPY . .</code> yaptığınızda, klasörünüzde bulunan <strong>her şey</strong> (node_modules, .git, .env, build çıktıları, 500MB videolar...) build bağlamına dahil edilir. Bu hem yavaşlatır hem imaj boyutunu şişirir. Çözüm: <code>.dockerignore</code>.</p>

<p>Tıpkı <code>.gitignore</code> gibi çalışır — eşleşen dosyalar Docker tarafından <strong>görmezden gelinir</strong>.</p>

<div class="code-block">
    <div class="code-block-header"><span>Örnek .dockerignore</span></div>
    <pre><code># Versiyon kontrol
.git
.gitignore
.github

# Ortam dosyaları
.env
.env.*

# Dil-spesifik
__pycache__/
*.pyc
.venv
venv
node_modules
dist
build

# Sistem
.DS_Store
Thumbs.db

# Geliştirme araçları
.vscode
.idea
*.log</code></pre>
</div>

<h2>Katman (Layer) Mantığı ve Önbellek</h2>
<p>Dockerfile'daki her talimat (FROM, COPY, RUN, vb.) bir <strong>katman</strong> oluşturur. Docker bu katmanları önbellekler — bir sonraki build'de değişmeyen katmanları tekrar hesaplamaz, anında kullanır. Bu yüzden Dockerfile'ınızın sırası önemlidir.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 En Çok Değişenleri En Sona Koyun</div>
    <p>Şu örneğe bakın:</p>
    <pre><code><span class="comment"># KÖTÜ SIRA</span>
FROM node:20
WORKDIR /app
COPY . .                    <span class="comment"># Tüm kod (SIK değişir)</span>
RUN npm install            <span class="comment"># Her değişiklikte yeniden çalışır!</span>
CMD ["node", "server.js"]

<span class="comment"># İYİ SIRA</span>
FROM node:20
WORKDIR /app
COPY package*.json ./       <span class="comment"># Sadece bağımlılık dosyası (NADİR değişir)</span>
RUN npm install            <span class="comment"># Önbellekten kullanılır</span>
COPY . .                    <span class="comment"># Kodu en sona</span>
CMD ["node", "server.js"]</code></pre>
    <p>Bu sıra sayesinde, kodunuzu her değiştirdiğinizde <code>npm install</code> tekrar çalışmaz — build 10x hızlanır.</p>
</div>

<h2>Multi-Stage Build — İnce İmajlar</h2>
<p>Bir Go uygulamasını derlemek için büyük bir Go imajı gerekir (~900 MB). Ama ortaya çıkan binary tek başına ~10 MB'tır. İmajı neden 900 MB yaptıralım? <strong>Multi-stage build</strong> bunun için var.</p>

<div class="code-block">
    <div class="code-block-header"><span>Multi-stage Dockerfile örneği (Go)</span></div>
    <pre><code><span class="comment"># AŞAMA 1 — Derleme</span>
FROM golang:1.22 AS builder
WORKDIR /src
COPY . .
RUN go build -o /app/server ./cmd/server

<span class="comment"># AŞAMA 2 — Çalıştırma (sadece binary)</span>
FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/server .
EXPOSE 8080
CMD ["./server"]</code></pre>
</div>

<p>Sonuç: ~15 MB'lık minik bir imaj. Saldırı yüzeyi çok az, push/pull çok hızlı. Aynı mantık Java, Rust, C++, TypeScript gibi derlenen dillerde uygulanır.</p>

<h2>docker build İpuçları</h2>
<div class="code-block">
    <div class="code-block-header"><span>build komut varyasyonları</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker</span> <span class="argument">build</span> <span class="flag">-t</span> <span class="argument">isim:tag .</span>

<span class="comment"># Farklı dosyadan build:</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">build</span> <span class="flag">-f</span> <span class="argument">Dockerfile.prod</span> <span class="flag">-t</span> <span class="argument">isim:prod .</span>

<span class="comment"># Build argümanı geçme:</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">build</span> <span class="flag">--build-arg</span> <span class="argument">VERSION=2.0</span> <span class="flag">-t</span> <span class="argument">x .</span>

<span class="comment"># Önbelleği kullanmadan sıfırdan:</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">build</span> <span class="flag">--no-cache</span> <span class="flag">-t</span> <span class="argument">x .</span>

<span class="comment"># Çoklu platform (ARM + x86 aynı anda):</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">buildx build</span> <span class="flag">--platform</span> <span class="argument">linux/amd64,linux/arm64</span> \\
    <span class="flag">-t</span> <span class="argument">kullanici/app:1.0</span> <span class="flag">--push</span> <span class="argument">.</span></code></pre>
</div>

<h2>İmajı Etiketleme (Tag) ve Yeniden Adlandırma</h2>
<div class="code-block">
    <div class="code-block-header"><span>Tag yönetimi</span></div>
    <pre><code><span class="comment"># Var olan imaja yeni tag ekle:</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">tag selam:1.0 kullanici/selam:1.0</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">tag selam:1.0 kullanici/selam:latest</span>

<span class="comment"># Farklı registry için:</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">tag selam:1.0 ghcr.io/kullanici/selam:1.0</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 Semantik Versiyonlama</div>
    Tag'ler için <strong>semver</strong> (semantic versioning) tavsiye edilir: <code>MAJOR.MINOR.PATCH</code>. Örn: <code>2.3.1</code>. Ayrıca genelde iki tag birden kullanılır:
    <ul>
        <li><code>kullanici/app:2.3.1</code> — kesin sürüm</li>
        <li><code>kullanici/app:latest</code> — en son stabil</li>
    </ul>
</div>

<h2>Docker Hub — İmajı Dünya ile Paylaşın</h2>
<p>İmajınız hazır, yerelde çalışıyor. Peki başkalarına nasıl veririz? Veya sunucunuza nasıl taşırız? <strong>Docker Hub</strong> — imajlar için GitHub.</p>

<h3>1. Hesap Açın</h3>
<p><a href="https://hub.docker.com" target="_blank" rel="noopener">hub.docker.com</a> adresine gidin, ücretsiz bir hesap açın. Kullanıcı adınızı seçin (örn: <code>ahmet123</code>).</p>

<h3>2. Terminalden Giriş Yapın</h3>
<div class="code-block">
    <div class="code-block-header"><span>docker login</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker</span> <span class="argument">login</span>
<span class="output">Username: ahmet123
Password: ********
Login Succeeded</span>

<span class="comment"># Access Token (önerilen — şifreden daha güvenli):</span>
<span class="comment"># Docker Hub → Account Settings → Security → New Access Token</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">login</span> <span class="flag">-u</span> <span class="argument">ahmet123</span>
<span class="comment"># Password alanına token'ı yapıştırın</span></code></pre>
</div>

<h3>3. İmajı Uygun Şekilde Etiketleyin</h3>
<p>Docker Hub'a göndermek için imaj adı <code>KULLANICI_ADI/REPO:TAG</code> formatında olmalı:</p>
<div class="code-block">
    <div class="code-block-header"><span>Doğru tag</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker</span> <span class="argument">build</span> <span class="flag">-t</span> <span class="argument">ahmet123/selam:1.0 .</span>
<span class="comment"># ya da var olan imajı yeniden etiketleyin:</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">tag selam:1.0 ahmet123/selam:1.0</span></code></pre>
</div>

<h3>4. Push ile Gönderin</h3>
<div class="code-block">
    <div class="code-block-header"><span>docker push</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker</span> <span class="argument">push ahmet123/selam:1.0</span>
<span class="output">The push refers to repository [docker.io/ahmet123/selam]
5f70bf18a086: Pushed
b3c0c5c86091: Pushed
...
1.0: digest: sha256:abc... size: 1234</span></code></pre>
</div>
<p>Artık imajınız Docker Hub'da! <code>https://hub.docker.com/r/ahmet123/selam</code> adresinde herkese açıktır.</p>

<h3>5. Başka Bir Makineden Kullanın</h3>
<div class="code-block">
    <div class="code-block-header"><span>docker pull</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker</span> <span class="argument">pull ahmet123/selam:1.0</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">run</span> <span class="flag">--rm</span> <span class="argument">ahmet123/selam:1.0</span>

<span class="comment"># Hatta pull bile yapmayabilirsiniz — docker run yoksa otomatik indirir:</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">run</span> <span class="flag">--rm</span> <span class="argument">ahmet123/selam:1.0</span></code></pre>
</div>

<div class="info-box tip">
    <div class="info-box-title">💡 Özel (Private) Repo</div>
    Docker Hub'da ücretsiz hesapla 1 özel (private) repo açabilirsiniz. Diğerleri herkese açıktır. Kurumsal senaryolarda genelde kendi registry'nizi (Harbor, AWS ECR, GitLab Registry, GitHub Container Registry) kullanırsınız.
</div>

<h2>Alternatif Registry'ler</h2>
<table>
    <tr><th>Registry</th><th>Adres formatı</th><th>Not</th></tr>
    <tr><td>Docker Hub</td><td><code>kullanici/repo</code></td><td>Varsayılan, en popüler</td></tr>
    <tr><td>GitHub Container Registry</td><td><code>ghcr.io/kullanici/repo</code></td><td>GitHub hesabınızla, ücretsiz özel repo bol</td></tr>
    <tr><td>GitLab Registry</td><td><code>registry.gitlab.com/grup/proje</code></td><td>GitLab CI/CD ile entegre</td></tr>
    <tr><td>AWS ECR</td><td><code>xxx.dkr.ecr.bolge.amazonaws.com/repo</code></td><td>Amazon bulutu</td></tr>
    <tr><td>Google Artifact Registry</td><td><code>bolge-docker.pkg.dev/proje/repo</code></td><td>GCP</td></tr>
    <tr><td>Azure Container Registry</td><td><code>xxx.azurecr.io/repo</code></td><td>Microsoft bulutu</td></tr>
    <tr><td>Harbor (self-hosted)</td><td><code>kendi-registry.firma.com/repo</code></td><td>Kendi kurduğunuz özel registry</td></tr>
</table>

<h2>Örnek Docker Hub İmajlarını Keşfetmek</h2>
<p>Docker Hub'da milyonlarca hazır imaj var. Özellikle <strong>Official Images</strong> (resmi imajlar, mavi rozetli) ve <strong>Verified Publisher</strong> olanlar güvenlidir.</p>

<div class="code-block">
    <div class="code-block-header"><span>Popüler resmi imajları denemek</span></div>
    <pre><code><span class="comment"># Ubuntu interaktif:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm -it</span> <span class="argument">ubuntu:22.04 bash</span>

<span class="comment"># Alpine (çok küçük Linux):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm -it</span> <span class="argument">alpine:3.19 sh</span>

<span class="comment"># NGINX (web sunucusu):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">8080:80 nginx</span>

<span class="comment"># Python REPL:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm -it</span> <span class="argument">python:3.12</span>

<span class="comment"># Node.js REPL:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--rm -it</span> <span class="argument">node:20</span>

<span class="comment"># PostgreSQL:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name</span> <span class="argument">db</span> <span class="flag">-e</span> <span class="argument">POSTGRES_PASSWORD=s3cret postgres:16</span>

<span class="comment"># MySQL:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d --name</span> <span class="argument">db</span> <span class="flag">-e</span> <span class="argument">MYSQL_ROOT_PASSWORD=s3cret mysql:8</span>

<span class="comment"># MongoDB:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">27017:27017 mongo:7</span>

<span class="comment"># Redis:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">6379:6379 redis:7</span>

<span class="comment"># WordPress (hızlıca CMS denemek):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">8080:80 wordpress</span>

<span class="comment"># RabbitMQ (mesaj kuyruğu) — yönetim paneli dahil:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">15672:15672 -p 5672:5672 rabbitmq:management</span>

<span class="comment"># Elasticsearch:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">9200:9200</span> <span class="flag">-e</span> <span class="string">"discovery.type=single-node"</span> \\
    <span class="argument">docker.elastic.co/elasticsearch/elasticsearch:8.11.0</span>

<span class="comment"># Portainer (Docker için güzel bir web arayüzü!):</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-d -p</span> <span class="argument">9000:9000</span> \\
    <span class="flag">-v</span> <span class="argument">/var/run/docker.sock:/var/run/docker.sock</span> \\
    <span class="flag">-v</span> <span class="argument">portainer_data:/data</span> \\
    <span class="argument">portainer/portainer-ce</span></code></pre>
</div>

<h2>Güvenlik İpuçları</h2>
<ul>
    <li><strong>Root kullanmayın</strong>: Dockerfile'da <code>USER</code> ile kök olmayan bir kullanıcıya geçin.</li>
    <li><strong>Küçük imajlar</strong>: Alpine veya slim tabanlı imajlar daha az güvenlik açığı taşır.</li>
    <li><strong>Sabit sürüm tag</strong>: <code>python:3.12.1</code>, <code>python:latest</code> değil.</li>
    <li><strong>Sırları (secrets) imaja gömmeyin</strong>: API anahtarını <code>ENV</code> ile Dockerfile'a yazmayın — çalışma zamanında <code>-e</code> veya <code>--env-file</code> ile verin.</li>
    <li><strong>Güvenlik taraması</strong>: <code>docker scout cves imaj:tag</code> ile bilinen açıkları tarayın.</li>
    <li><strong>.dockerignore</strong>: Hassas dosyaları (<code>.env</code>, <code>.git</code>, <code>id_rsa</code>) dahil etmeyin.</li>
</ul>

<div class="code-block">
    <div class="code-block-header"><span>Güvenlik taraması örneği</span></div>
    <pre><code><span class="prompt">$</span> <span class="command">docker</span> <span class="argument">scout cves nginx:latest</span>
<span class="comment"># Bilinen CVE (Common Vulnerabilities and Exposures) listesi</span>

<span class="comment"># Alternatif: trivy</span>
<span class="prompt">$</span> <span class="command">docker</span> <span class="argument">run</span> <span class="flag">--rm -v</span> <span class="argument">/var/run/docker.sock:/var/run/docker.sock</span> \\
    <span class="argument">aquasec/trivy image nginx:latest</span></code></pre>
</div>

<h2>Özet</h2>
<ul>
    <li><strong>Dockerfile</strong>: İmajınızı oluşturmak için tarif metni.</li>
    <li>En önemli talimatlar: <code>FROM</code>, <code>WORKDIR</code>, <code>COPY</code>, <code>RUN</code>, <code>CMD</code>, <code>ENTRYPOINT</code>, <code>EXPOSE</code>, <code>ENV</code>, <code>USER</code>.</li>
    <li>Her talimat bir katman oluşturur — <strong>nadir değişenler önce, sık değişenler sonra</strong>.</li>
    <li><code>.dockerignore</code> build'i hızlandırır ve imajı küçültür.</li>
    <li><strong>Multi-stage build</strong> ile imajları inceltebilirsiniz (derleme aşaması ayrı, çalıştırma aşaması ayrı).</li>
    <li><code>docker tag</code> + <code>docker login</code> + <code>docker push</code> ile imajınızı Docker Hub'a yükleyin.</li>
    <li>Başkaları <code>docker pull</code> veya direkt <code>docker run</code> ile sizin imajınızı kullanabilir.</li>
</ul>
<p>Bir sonraki bölümde <strong>Docker Compose</strong> ile çok konteynerli uygulamalar ve gerçek dünya örneklerini göreceğiz.</p>
`,
    quiz: [
        {
            question: "Dockerfile'daki FROM talimatı ne işe yarar?",
            options: [
                "Docker'ın sürümünü belirtir",
                "İmajın üzerine inşa edileceği temel imajı belirler",
                "Dosyaları kopyalar",
                "Port açar"
            ],
            correct: 1,
            explanation: "FROM, her Dockerfile'ın ilk satırındaki (neredeyse) zorunlu talimattır. Üzerine inşa edeceğiniz temel imajı belirler — örn: FROM python:3.12-slim."
        },
        {
            question: "CMD ve ENTRYPOINT arasındaki temel fark nedir?",
            options: [
                "Aynı şeydir",
                "CMD, docker run sonunda verilen komutla tamamen değiştirilir; ENTRYPOINT'e ek argüman olarak eklenir",
                "CMD sadece Python imajlarında çalışır",
                "ENTRYPOINT eski, CMD modern sürümüdür"
            ],
            correct: 1,
            explanation: "CMD ile sadece varsayılan komut belirlenir; kullanıcı farklı bir komut verirse CMD tamamen iptal olur. ENTRYPOINT ise her durumda çalışır; kullanıcının verdiği ek argümanlar ENTRYPOINT'e append edilir."
        },
        {
            question: ".dockerignore dosyası ne işe yarar?",
            options: [
                "Docker'ı kapatır",
                "Build bağlamından (build context) hariç tutulacak dosyaları belirler",
                "Çalışan konteynerleri gizler",
                "Portları engeller"
            ],
            correct: 1,
            explanation: ".dockerignore, .gitignore gibi çalışır. Build sırasında Docker'a hangi dosyaları yoksayacağını söyler. Böylece node_modules, .git, .env gibi dosyalar build context'e girmez; build hızlanır ve imaj boyutu küçülür."
        },
        {
            question: "Neden Dockerfile'da önce COPY requirements.txt, sonra COPY . yapıyoruz?",
            options: [
                "Zorunlu bir kural, başka türlü çalışmaz",
                "Katman önbelleği (cache) için — requirements.txt değişmediği sürece pip install yeniden çalışmaz",
                "Güvenlik için",
                "Yazım kurallarından dolayı"
            ],
            correct: 1,
            explanation: "Her COPY bir katman oluşturur ve Docker önbellekleyebilir. Bağımlılık dosyası nadir değişirken kod sık değişir. Önce bağımlılıkları kopyalayıp kurarsak, kod değiştiğinde pip install katmanı önbellekten kullanılır ve build çok daha hızlı olur."
        },
        {
            question: "EXPOSE talimatı bir portu dışarı açar mı?",
            options: [
                "Evet, port otomatik olarak dış dünyaya açılır",
                "Hayır, sadece dokümantasyon amaçlıdır; portu açmak için docker run -p gerekir",
                "Sadece HTTP için açar",
                "Sadece Linux'ta açar"
            ],
            correct: 1,
            explanation: "EXPOSE yalnızca bilgilendirme amaçlıdır; \"bu imaj bu portu kullanır\" demektedir. Portu gerçekten dışa açmak için docker run sırasında -p HOST:CONTAINER kullanılır."
        },
        {
            question: "Multi-stage build neden kullanılır?",
            options: [
                "Güvenlik için",
                "Derleme araçlarını içermeyen, sadece son ürünü içeren küçük imajlar üretmek için",
                "Daha fazla konteyner oluşturmak için",
                "Gizli dosyalar saklamak için"
            ],
            correct: 1,
            explanation: "Multi-stage build ile ilk aşamada büyük bir imajla uygulamayı derler, ikinci aşamada sadece çıkan binary'yi minimal bir imaja kopyalarız. Sonuç MB'lık, saldırı yüzeyi az, taşınması hızlı bir imaj."
        },
        {
            question: "Docker Hub'a imaj yüklemek için imaj adı hangi formatta olmalıdır?",
            options: [
                "Sadece repo adı",
                "KULLANICI_ADI/REPO:TAG",
                "Sadece tag",
                "Rastgele bir isim"
            ],
            correct: 1,
            explanation: "Docker Hub'a push için imaj adı KULLANICI_ADI/REPO:TAG formatında olmalıdır. Örn: ahmet123/benim-app:1.0. Bu formatta olmayan imajlar Docker Hub'a gönderilemez."
        },
        {
            question: "docker tag mevcut imajı:1.0 yeniisim:2.0 komutu ne yapar?",
            options: [
                "Dosyayı kopyalar ve yeni bir imaj oluşturur",
                "Sadece mevcut imaja yeni bir isim/etiket daha ekler (kopya yaratmaz)",
                "Eski imajı siler",
                "Docker Hub'a yükler"
            ],
            correct: 1,
            explanation: "docker tag yeni bir imaj oluşturmaz, mevcut imajın üzerine bir referans (isim) daha ekler. İki tag de aynı image ID'ye işaret eder. Disk kullanımı artmaz."
        },
        {
            question: "USER talimatı neden önemlidir?",
            options: [
                "İmajın sahibini belirler",
                "Konteynerin root yerine daha sınırlı yetkili bir kullanıcıyla çalışmasını sağlar; güvenlik için kritik",
                "Sadece isimlendirme amaçlıdır",
                "Docker Hub kullanıcısını değiştirir"
            ],
            correct: 1,
            explanation: "Konteyner varsayılan olarak root kullanıcısı ile çalışır. Bu güvenlik riskidir — bir açıkta saldırgan kök yetkisi ile iş görür. USER ile minimum yetkili bir hesaba geçerek \"defense in depth\" prensibini uygularız."
        }
    ]
});
