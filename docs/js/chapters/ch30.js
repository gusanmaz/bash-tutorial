// ===== Bölüm 30: Dockerfile ve Docker Hub — Kendi İmajınızı Oluşturun =====
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 30,
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

<div class="info-box tip">
    <div class="info-box-title">💡 Bu Bölümün Yol Haritası</div>
    <ol>
        <li><strong>İlk Dockerfile</strong>: Üç satırla hayata "Merhaba".</li>
        <li><strong>Talimatları tek tek tanıyalım</strong>: <code>FROM</code>, <code>COPY</code>, <code>RUN</code>, <code>ENV</code>, <code>EXPOSE</code>, vb.</li>
        <li><strong>Gerçek bir örnek</strong>: Flask web uygulamasını imaja koyalım.</li>
        <li><strong>İyi alışkanlıklar</strong>: <code>.dockerignore</code>, katman sırası, multi-stage build.</li>
        <li><strong>Paylaşım</strong>: İmajı Docker Hub'a yükleyip başka makinelerden kullanma.</li>
    </ol>
    <p>Acele etmeyin; her bölümün sonunda terminalinizde örneği gerçekten çalıştırın. Docker'ı okuyarak değil, parmaklarınızla öğrenirsiniz.</p>
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

<div class="info-box note">
    <div class="info-box-title">📌 Önce Bir Kavram: Katman (Layer) Nedir?</div>
    <p>Dockerfile'daki her talimat (<code>FROM</code>, <code>COPY</code>, <code>RUN</code>, vb.) yeni bir <strong>katman</strong> oluşturur. Yani imajınız üst üste yığılmış şeffaf folyolar gibi düşünülebilir: her folyoda bir değişiklik (yeni dosyalar, kurulan paketler, ayarlar) var ve hepsi birleşince son hâli oluşturuyor.</p>
    <p>Bu yapı iki şey için harika:</p>
    <ul>
        <li><strong>Hız:</strong> Bir katman değişmediyse Docker onu yeniden hesaplamaz, önbellekten kullanır. Bir sonraki build saniyeler içinde biter.</li>
        <li><strong>Paylaşım:</strong> İki imajınız aynı temel imajdan türüyorsa, alttaki katmanlar diskte tek kopya tutulur. 100 farklı Python imajı = 1 ortak Python katmanı + farklı üstler.</li>
    </ul>
    <p>İlerleyen bölümlerde "katmana göre sıralama" gibi şeyler göreceksiniz; bu kavramı aklınızda tutmak yardımcı olur.</p>
</div>

<h2>Dockerfile Talimatları — Tam Liste</h2>

<div class="info-box note">
    <div class="info-box-title">📌 Nasıl Okumalısınız?</div>
    <p>Aşağıda Dockerfile'da kullanabileceğiniz tüm talimatlar var. <strong>Hepsini ezberlemek zorunda değilsiniz.</strong> Şöyle düşünün:</p>
    <ul>
        <li><strong>İlk 5 talimat olmazsa olmaz</strong>: <code>FROM</code>, <code>WORKDIR</code>, <code>COPY</code>, <code>RUN</code>, <code>CMD</code>. Bunlar olmadan neredeyse hiçbir Dockerfile yazılamaz.</li>
        <li><strong>Sık kullanılan</strong>: <code>ENV</code>, <code>EXPOSE</code>, <code>USER</code>, <code>ENTRYPOINT</code>. Birçok projede karşınıza çıkar.</li>
        <li><strong>Daha ileri / duruma göre</strong>: <code>ARG</code>, <code>VOLUME</code>, <code>HEALTHCHECK</code>, <code>LABEL</code>, <code>ADD</code>. Önce diğerlerini iyice tanıyın; sonra bunlara ihtiyaç duydukça döneriz.</li>
    </ul>
    <p>Her başlıkta: <em>"Bu ne işe yarıyor?"</em> → <em>"Neden ihtiyacımız var?"</em> → <em>"Pratikte nasıl yazılır?"</em> sırasıyla ilerleyeceğiz.</p>
</div>

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
<p>Bir terminal açtığınızda her zaman bir klasördesiniz (<code>pwd</code> ile görebileceğiniz "current directory"). Konteynerin içi de bir Linux sistemidir ve onun da bir "şu an bulunduğu klasörü" vardır. <code>WORKDIR</code> bunu belirler.</p>
<p><code>cd /app</code> yazıp orada kalmak gibi düşünün — ama bu hem build (imajı oluştururken) hem de runtime (konteyner çalışırken) için kalıcıdır.</p>
<pre><code>WORKDIR /app</code></pre>
<ul>
    <li>Klasör <strong>yoksa otomatik oluşturulur</strong> (önceden <code>mkdir</code> demenize gerek yok).</li>
    <li>Bu satırdan <strong>sonraki</strong> tüm <code>COPY</code>, <code>RUN</code>, <code>CMD</code> komutları artık bu klasörde çalışır.</li>
    <li>Dockerfile içinde birden çok <code>WORKDIR</code> kullanabilirsiniz; her biri o noktadan itibaren yeni "şu anki klasör" olur.</li>
</ul>
<div class="info-box warning">
    <div class="info-box-title">⚠️ WORKDIR Yazmazsanız Ne Olur?</div>
    Komutlarınız konteynerin kök dizininde (<code>/</code>) çalışır. <code>COPY app.py .</code> dediğinizde dosyanız <code>/app.py</code> olarak yerleşir — sistem dosyalarının arasında kaybolur. Bu yüzden her zaman bir <code>WORKDIR</code> belirleyin.
</div>

<h3>COPY ve ADD — Dosya Kopyalama</h3>

<p>İmajınıza dosya nasıl koyarsınız? <code>COPY</code> ile. Ama önce <strong>build context</strong> kavramını anlamamız lazım.</p>

<div class="info-box note">
    <div class="info-box-title">📌 Build Context Nedir?</div>
    <p><code>docker build -t isim .</code> komutundaki <strong>nokta</strong> (<code>.</code>) bulunduğunuz klasörü işaret eder. Docker bu komutu çalıştırdığınızda, o klasördeki <strong>tüm dosyaları</strong> Docker daemon'una gönderir. Buna <em>build context</em> denir. Dockerfile'ınız sadece <strong>bu context içindeki</strong> dosyalara <code>COPY</code> ile erişebilir.</p>
    <p>Yani <code>COPY /home/ahmet/gizli.txt /app/</code> yazamazsınız — bu host'taki bir yol, context dışında. Sadece <code>COPY gizli.txt /app/</code> gibi, Dockerfile'ın yanındaki dosyalara erişebilirsiniz.</p>
</div>

<pre><code><span class="comment"># Genel sözdizimi: COPY kaynak hedef</span>
COPY app.py /app/                       <span class="comment"># Tek dosya</span>
COPY app.py .                           <span class="comment"># . = WORKDIR (varsayılan /)</span>
COPY src/ /app/src/                     <span class="comment"># Tüm klasörü</span>
COPY . /app/                            <span class="comment"># Context'in tamamı</span>
COPY *.py /app/                         <span class="comment"># Glob desenleri</span>
COPY <span class="flag">--chown=app:app</span> src/ /app/      <span class="comment"># Sahipliği değiştirerek</span></code></pre>

<p><strong>ADD nedir, neden çekinmemeli?</strong> <code>ADD</code>, <code>COPY</code>'nin "her şeyi yapan" sürümüdür:</p>
<ul>
    <li>Tar arşivlerini (<code>.tar.gz</code>, <code>.tar.bz2</code>) hedefe <strong>otomatik açar</strong>.</li>
    <li>URL'den dosya indirip kopyalayabilir.</li>
</ul>
<p>Kulağa hoş geliyor ama bu otomatik davranışlar <em>"acaba ne olacak?"</em> diye düşündürür. Çoğu zaman tam ne istediğinizi açıkça yazmak (önce <code>RUN curl ...</code>, sonra <code>RUN tar -xzf</code>) daha güvenli ve okunabilirdir. <strong>Tavsiye: dosyalar için her zaman <code>COPY</code> kullanın, <code>ADD</code>'i sadece o özel davranışlarına ihtiyacınız olduğunda tercih edin.</strong></p>
<pre><code><span class="comment"># ADD'nin yapabildikleri (genelde önerilmez):</span>
ADD app.tar.gz /app/                              <span class="comment"># /app içine açar</span>
ADD https://example.com/dosya.zip /app/           <span class="comment"># URL'den indirir (önerilmez)</span></code></pre>

<h3>RUN — Build Sırasında Komut Çalıştır</h3>

<p>Burada "build" ve "runtime" ayrımını yapmamız lazım. Docker'da iki ayrı an vardır:</p>
<ul>
    <li><strong>Build (inşa) anı</strong>: <code>docker build</code> komutunu çalıştırdığınızda Docker, Dockerfile'daki adımları sırayla işler ve bir imaj üretir. Bu aşamada paketler kurulur, kod derlenir, hazırlıklar yapılır.</li>
    <li><strong>Runtime (çalışma) anı</strong>: <code>docker run</code> ile o imajdan bir konteyner doğduğunda. Bu noktada uygulamanız artık "canlı" çalışıyor.</li>
</ul>
<p><code>RUN</code> talimatı <strong>build aşamasında</strong> çalışır. Sonucu imaja yazılır ve orada kalır. <code>CMD</code> ise <strong>runtime'da</strong> çalışır. İkisini karıştırmamak için: "<em>Bu adım imaj hazırlanırken mi olmalı, yoksa konteyner her başlatıldığında mı?</em>" diye sorun.</p>

<p>Tipik <code>RUN</code> kullanımları: paket kurulumu, kod derleme, dosya düzenlemesi, kullanıcı oluşturma.</p>
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

<div class="info-box tip">
    <div class="info-box-title">💡 Pratikte Hangisini Seçeyim?</div>
    <ul>
        <li><strong>Uygulamayı bir kez kuruyorum, hep aynı şekilde çalışsın:</strong> Sadece <code>CMD</code> yeter. Örn: <code>CMD ["python", "app.py"]</code>.</li>
        <li><strong>İmajım bir komut satırı aracı gibi davransın</strong> (kullanıcı argüman versin): <code>ENTRYPOINT</code> + <code>CMD</code> kombinasyonu. Örn: <code>ENTRYPOINT ["git"]</code>, <code>CMD ["--help"]</code> — kullanıcı <code>docker run img status</code> yazınca <code>git status</code> çalışır.</li>
        <li><strong>Hata ayıklama / serbest mod istiyorum:</strong> Sadece <code>CMD</code> kullanmak <code>docker run img bash</code> ile kolayca shell'e düşmenizi sağlar.</li>
    </ul>
</div>

<h3>ENV — Ortam Değişkenleri (Environment Variables)</h3>
<p><strong>Ortam değişkeni nedir?</strong> Bir programın "etrafına" konulan, açıldığında okuyabileceği isim-değer çiftleridir. Tıpkı bir not gibi: <em>"Veritabanı şifresi şudur"</em>, <em>"Dil Türkçe olsun"</em>, <em>"Hata kayıtları şu seviyede olsun"</em>. Programınız bu notları okuyup davranışını ona göre değiştirir.</p>
<p>Linux terminalinizde de vardır — örneğin terminale <code>echo $HOME</code> yazın, ev dizininizi yazar; bu bir ortam değişkenidir. Tıpkı <code>$USER</code>, <code>$PATH</code> gibi.</p>
<p><strong>Konteynerlerde neden önemli?</strong> Aynı imajı farklı ortamlarda (geliştirme/üretim) farklı ayarlarla çalıştırmanın en temiz yoludur. Şifreyi, dil ayarını, dış servis adreslerini koda gömmeden dışarıdan değiştirebilirsiniz.</p>

<div class="code-block">
    <div class="code-block-header"><span>Dockerfile'da ENV tanımlama</span></div>
    <pre><code>ENV PYTHON_VERSION=3.12
ENV PATH="/app/bin:$PATH"             <span class="comment"># Mevcut PATH'i koruyup başına ekleme</span>

<span class="comment"># Tek satırda birden çok değişken:</span>
ENV NODE_ENV=production \\
    LOG_LEVEL=info \\
    PORT=8080</code></pre>
</div>

<p><strong>Konteyner içinden nasıl okunur?</strong> Uygulamanız hangi dilde yazılmış olursa olsun bir yolu vardır:</p>
<pre><code><span class="comment"># Bash içinde:</span>
echo $LOG_LEVEL

<span class="comment"># Python:</span>
import os
os.getenv("LOG_LEVEL", "default-değer")

<span class="comment"># Node.js:</span>
process.env.LOG_LEVEL

<span class="comment"># Go:</span>
os.Getenv("LOG_LEVEL")</code></pre>

<p><strong>Çalıştırırken üzerine yazmak:</strong> Dockerfile'da varsayılan değer verirsiniz ama <code>docker run</code> sırasında <code>-e</code> bayrağı ile değiştirebilirsiniz:</p>
<pre><code><span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">-e</span> <span class="argument">LOG_LEVEL=debug</span> <span class="flag">-e</span> <span class="argument">PORT=9000 benim-imaj</span>

<span class="comment"># Veya bir dosyadan toplu olarak:</span>
<span class="prompt">$</span> <span class="command">docker run</span> <span class="flag">--env-file</span> <span class="argument">prod.env benim-imaj</span></code></pre>

<div class="info-box warning">
    <div class="info-box-title">⚠️ Sırları (şifre, API anahtarı) ENV'e Hard-Code Etmeyin!</div>
    <code>ENV DB_PASSWORD=12345</code> yazarsanız bu şifre imajın <strong>içinde</strong> kalır; imajı indiren herkes <code>docker history</code> ile görebilir. Bunun yerine: dockerfile'a yazmayın, sadece <code>docker run -e</code> veya <code>--env-file</code> ile çalışma anında verin.
</div>

<h3>EXPOSE — Hangi Portu Dinlediğimizi Belirtmek</h3>

<p><strong>Önce port nedir?</strong> Bir bilgisayarın "kapı numarası" gibi düşünün. Bir web sunucusu çalışırken belirli bir port üzerinden gelen istekleri dinler — örneğin NGINX genelde 80, Flask 5000, Node.js 3000. Aynı anda farklı programlar farklı portları dinleyebilir.</p>

<p>Bir konteyner kendi içinde bir mini sanal makine gibidir. İçinde bir uygulama port 5000'i dinliyor olabilir, ama bu port konteynerin <strong>içine</strong> aittir — sanki uygulamanız ada üzerinde bir evdedir ve sadece o adadaki bağlantıları kabul eder.</p>

<div class="code-block">
    <div class="code-block-header"><span>EXPOSE örnekleri</span></div>
    <pre><code>EXPOSE 8080
EXPOSE 80 443
EXPOSE 53/udp                         <span class="comment"># Protokol de belirtilebilir (varsayılan tcp)</span></code></pre>
</div>

<p><strong>Burada kafa karıştırıcı kısım:</strong> <code>EXPOSE</code> <strong>portu gerçekten açmaz</strong>. Tarayıcınızla konteynere bağlanmaz. Peki ne yapar?</p>

<ul>
    <li><strong>İlan tahtası gibidir:</strong> <em>"Bu imajdaki uygulama 5000 portunu dinler — kullanan kişi bunu bilsin"</em> der. Belgeleme amaçlıdır.</li>
    <li><code>docker inspect imaj</code> komutuyla bu bilgi görünür; başkaları imajınızı nasıl çalıştıracağını anlar.</li>
    <li><code>docker run -P</code> (büyük P) kullanırsanız Docker, <code>EXPOSE</code>'da yazan tüm portları rastgele host portlarına bağlar. <code>-p HOST:KONTEYNER</code> (küçük p) ise siz spesifik söylersiniz.</li>
</ul>

<div class="info-box note">
    <div class="info-box-title">📌 Tipik Bir Senaryo</div>
    <p>Flask uygulamanız konteyner içinde <code>port 5000</code>'i dinliyor:</p>
    <pre><code><span class="comment"># Dockerfile:</span>
EXPOSE 5000                    <span class="comment"># "Bu imaj 5000 dinler" notu</span>

<span class="comment"># Çalıştırma:</span>
docker run -p 8080:5000 ...    <span class="comment"># Host'taki 8080 ↔ konteynerdeki 5000</span>

<span class="comment"># Tarayıcıdan:</span>
http://localhost:8080          <span class="comment"># İstek host:8080 → konteyner:5000'e yönlendirilir</span></code></pre>
    <p>Yani gerçek "kapıyı açan" şey <code>-p</code> bayrağıdır. <code>EXPOSE</code> sadece dökümandır. <code>EXPOSE</code> yazmasanız bile <code>-p</code> ile bağlanabilirsiniz; ama yazmak iyi bir alışkanlıktır.</p>
</div>

<h3>USER — Konteyneri Hangi Kullanıcıyla Çalıştırmalı?</h3>

<p>Linux'ta her işlem bir kullanıcı adına çalışır. <code>root</code> (kök) kullanıcı her şeye yetkili "süper kullanıcı"dır — herhangi bir dosyayı silebilir, herhangi bir port açabilir, sistem ayarlarını değiştirebilir. Normal kullanıcılar daha kısıtlı yetkilere sahiptir.</p>

<p><strong>Sorun:</strong> Docker konteynerleri varsayılan olarak <code>root</code> kullanıcısı ile çalışır. Konteyner izole olsa da, eğer:</p>
<ul>
    <li>Uygulamanızda bir güvenlik açığı varsa,</li>
    <li>Konteynere host'tan bir klasör <code>-v</code> ile bağladıysanız,</li>
    <li>Docker'da kaçış (escape) bir CVE varsa,</li>
</ul>
<p>...saldırgan <code>root</code> yetkisiyle ciddi zarar verebilir. Bu yüzden iyi pratik: <strong>kendi uygulamanız için sınırlı yetkili bir kullanıcı yaratıp ona geçmektir</strong>.</p>

<div class="code-block">
    <div class="code-block-header"><span>Güvenli kullanıcı geçişi</span></div>
    <pre><code>FROM python:3.12-slim

WORKDIR /app
COPY . .
RUN pip install -r requirements.txt

<span class="comment"># Önce kullanıcıyı oluştur (-m ev dizini açar):</span>
RUN useradd -m -u 1000 app && chown -R app:app /app

<span class="comment"># Bundan sonra konteyner "app" kullanıcısıyla çalışır:</span>
USER app

CMD ["python", "server.py"]</code></pre>
</div>

<p><strong>Önemli:</strong> <code>USER</code>'dan sonraki komutlar root olmadığı için artık <code>apt install</code>, <code>chown</code> gibi yetki isteyen şeyleri yapamazsınız. O yüzden önce tüm sistem işlerini bitirin, en sona <code>USER</code> yazın.</p>

<div class="info-box tip">
    <div class="info-box-title">💡 Hazır Hesap: Alpine ve Slim İmajlarında</div>
    Bazı temel imajlar (örn. <code>node:20-alpine</code>) içinde zaten <code>node</code> adında hazır bir kullanıcı vardır. <code>USER node</code> yazıp doğrudan kullanabilirsiniz; her seferinde yeni kullanıcı yaratmaya gerek yok.
</div>

<h3>VOLUME — Veriyi Kalıcı Tutmak İçin Bir Klasörü İşaretle</h3>

<p>Bir konteyner silindiğinde içindeki <strong>tüm dosyalar da yok olur</strong>. Bu çoğu zaman istediğimiz şeydir — uygulamayı yeniden başlatmak demek temiz başlangıç demek. Ama bir veritabanı düşünün: kullanıcı kayıtlarınız, ürünleriniz konteyner her durduğunda silinemez!</p>

<p>Çözüm: konteyner içindeki belirli bir klasörü <strong>dışarıdaki</strong> kalıcı bir alana bağlamak. Buna <em>volume</em> denir. <code>docker run -v</code> ile bunu yapıyorduk. <code>VOLUME</code> talimatı ise Dockerfile yazarının okuyucuya şunu söylemesidir: <em>"Bu klasördeki veri kalıcı olmalı — burayı bir volume ile bağlamayı unutmayın!"</em></p>

<div class="code-block">
    <div class="code-block-header"><span>Volume tanımı</span></div>
    <pre><code>FROM postgres:16

VOLUME ["/var/lib/postgresql/data"]   <span class="comment"># Veritabanı verisinin yaşadığı yer</span>

<span class="comment"># Kullanıcı çalıştırırken:</span>
<span class="comment"># docker run -v db-veri:/var/lib/postgresql/data postgres:16</span></code></pre>
</div>

<ul>
    <li><strong>Hatırlatma niteliğindedir</strong>: <code>EXPOSE</code> gibi, kullanıcı görsün diye yazılır.</li>
    <li>Eğer kullanıcı <code>-v</code> ile bağlamazsa Docker yine de anonim bir volume oluşturup oraya bağlar — yani veri yine kaybolmaz, ama isimsiz olduğu için bulması zorlaşır.</li>
    <li>Resmi imajların çoğunda (postgres, mysql, mongo, redis) bu tanım vardır; veritabanlarının ürettiği veriyi koruma altına alır.</li>
</ul>

<h3>ENTRYPOINT'in Ek Yüzü ve ARG — Build Zamanı Değişkenleri</h3>

<p>Az önce <code>ENV</code>'i gördük; o, <strong>konteyner çalışırken</strong> var olan değişkendi. <code>ARG</code> ise sadece <strong>imaj inşa edilirken</strong> (build) yaşar; konteyner çalıştığında artık yoktur. Build sürecini parametreleştirmek için kullanılır — örneğin "hangi sürümü kuracağım" gibi.</p>

<div class="code-block">
    <div class="code-block-header"><span>ARG örneği</span></div>
    <pre><code>FROM ubuntu:22.04

<span class="comment"># Varsayılan değer; build sırasında değiştirilebilir:</span>
ARG NODE_VERSION=20
ARG BUILD_DATE

RUN echo "Node sürüm: $NODE_VERSION, tarih: $BUILD_DATE"
RUN curl -fsSL https://deb.nodesource.com/setup_\${NODE_VERSION}.x | bash -

<span class="comment"># Build sırasında değiştirmek:</span>
<span class="comment"># docker build --build-arg NODE_VERSION=22 --build-arg BUILD_DATE=2026-01-15 -t app .</span></code></pre>
</div>

<div class="info-box note">
    <div class="info-box-title">📌 ARG vs ENV — Tek Tabloda</div>
    <table>
        <tr><th></th><th>ARG</th><th>ENV</th></tr>
        <tr><td>Build sırasında okunabilir mi?</td><td>✅ Evet</td><td>✅ Evet</td></tr>
        <tr><td>Konteyner çalışırken erişilebilir mi?</td><td>❌ Hayır</td><td>✅ Evet</td></tr>
        <tr><td>Nasıl override edilir?</td><td><code>docker build --build-arg X=...</code></td><td><code>docker run -e X=...</code></td></tr>
        <tr><td>Tipik kullanım</td><td>Build parametreleri (sürüm, mimari)</td><td>Runtime ayarları (log seviyesi, port)</td></tr>
    </table>
</div>

<h3>HEALTHCHECK — Konteyner Sağ mı? (Sağlık Kontrolü)</h3>

<p>Bir konteyner "çalışıyor" görünüp aslında <strong>askıda</strong> olabilir — süreç dönüyor ama yanıt vermiyor olabilir. <code>HEALTHCHECK</code>, Docker'a şunu söyler: <em>"Belirli aralıklarla şu komutu çalıştır; başarılıysa konteyner sağlıklı, değilse hasta say"</em>.</p>

<div class="code-block">
    <div class="code-block-header"><span>HEALTHCHECK örneği</span></div>
    <pre><code>FROM nginx:alpine

<span class="comment"># Her 30 saniyede bir, 3 saniye içinde yanıt almazsa hasta say.</span>
<span class="comment"># 3 üst üste başarısız olunca "unhealthy" durumuna geç:</span>
HEALTHCHECK <span class="flag">--interval=30s --timeout=3s --retries=3</span> \\
    CMD curl <span class="flag">-f</span> http://localhost/ || exit 1</code></pre>
</div>

<p>Bunu kullandığınızda <code>docker ps</code> çıktısında bir kolon belirir: <code>STATUS  Up 2 minutes (healthy)</code> veya <code>(unhealthy)</code>. Docker Swarm, Kubernetes ya da otomatik yeniden başlatma kuralları bu bilgiyi kullanır — hasta konteyneri yeniden başlatabilir.</p>

<h3>LABEL — İmaja Künye Eklemek (Metadata)</h3>

<p>İmajınıza "etiketler" yapıştırmak gibidir. Asıl çalışmayı etkilemez; ama <code>docker inspect</code> ile görünür, kim oluşturmuş, hangi sürüm, hangi kaynak kodu deposundan derlendi gibi bilgileri saklar. CI/CD sistemleri ve otomasyon araçları bu etiketleri sıklıkla okur.</p>

<div class="code-block">
    <div class="code-block-header"><span>Yaygın LABEL örnekleri</span></div>
    <pre><code>LABEL maintainer="ahmet@example.com"
LABEL version="1.0"
LABEL description="Müşteri ödeme servisi"

<span class="comment"># OCI standartı (Open Container Initiative) etiketleri — endüstri standardı:</span>
LABEL org.opencontainers.image.source="https://github.com/ahmet/odeme"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.version="1.4.2"</code></pre>
</div>

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
                "İmajın üzerine inşa edileceği temel imajı",
                "Docker'ın sürümünü belirtir",
                "Port açar — bu davranış beklenmez",
                "Dosyaları kopyalar yerine farklı bir komut"
            ],
            correct: 0,
            explanation: "FROM, her Dockerfile'ın ilk satırındaki (neredeyse) zorunlu talimattır. Üzerine inşa edeceğiniz temel imajı belirler — örn: FROM python:3.12-slim."
        },
        {
            question: "CMD ve ENTRYPOINT arasındaki temel fark nedir?",
            options: [
                "CMD sadece Python imajlarında çalışır yerine farklı bir komut",
                "CMD, docker run sonunda verilen komutla tamamen",
                "ENTRYPOINT eski, CMD modern sürümüdür",
                "Bu senaryoda aynı şeydir ve işlemi sonlandırır"
            ],
            correct: 1,
            explanation: "CMD ile sadece varsayılan komut belirlenir; kullanıcı farklı bir komut verirse CMD tamamen iptal olur. ENTRYPOINT ise her durumda çalışır; kullanıcının verdiği ek argümanlar ENTRYPOINT'e append edilir."
        },
        {
            question: ".dockerignore dosyası ne işe yarar?",
            options: [
                "Build bağlamından",
                "Docker'ı kapatır",
                "Çalışan konteynerleri gizler",
                "Portları engeller"
            ],
            correct: 0,
            explanation: ".dockerignore, .gitignore gibi çalışır. Build sırasında Docker'a hangi dosyaları yoksayacağını söyler. Böylece node_modules, .git, .env gibi dosyalar build context'e girmez; build hızlanır ve imaj boyutu küçülür."
        },
        {
            question: "Neden Dockerfile'da önce COPY requirements.txt, sonra COPY . yapıyoruz?",
            options: [
                "Katman önbelleği (cache) için",
                "Güvenlik için yerine farklı bir komut",
                "Zorunlu bir kural, başka türlü çalışmaz",
                "Yazım kurallarından dolayı"
            ],
            correct: 0,
            explanation: "Her COPY bir katman oluşturur ve Docker önbellekleyebilir. Bağımlılık dosyası nadir değişirken kod sık değişir. Önce bağımlılıkları kopyalayıp kurarsak, kod değiştiğinde pip install katmanı önbellekten kullanılır ve build çok daha hızlı olur."
        },
        {
            question: "EXPOSE talimatı bir portu dışarı açar mı?",
            options: [
                "Hayır, sadece dokümantasyon amaçlıdır",
                "Evet, port otomatik olarak dış dünyaya açılır",
                "Sadece HTTP için açar yerine farklı bir komut",
                "Sadece Linux'ta açar — bu davranış beklenmez"
            ],
            correct: 0,
            explanation: "EXPOSE yalnızca bilgilendirme amaçlıdır; \"bu imaj bu portu kullanır\" demektedir. Portu gerçekten dışa açmak için docker run sırasında -p HOST:CONTAINER kullanılır."
        },
        {
            question: "Multi-stage build neden kullanılır?",
            options: [
                "Güvenlik için ve işlemi sonlandırır",
                "Gizli dosyalar saklamak için",
                "Derleme araçlarını içermeyen",
                "Daha fazla konteyner oluşturmak için"
            ],
            correct: 2,
            explanation: "Multi-stage build ile ilk aşamada büyük bir imajla uygulamayı derler, ikinci aşamada sadece çıkan binary'yi minimal bir imaja kopyalarız. Sonuç MB'lık, saldırı yüzeyi az, taşınması hızlı bir imaj."
        },
        {
            question: "Docker Hub'a imaj yüklemek için imaj adı hangi formatta olmalıdır?",
            options: [
                "KULLANICI_ADI/REPO:TAG",
                "Rastgele bir isim",
                "Sadece repo adı",
                "Sadece tag yerine farklı bir komut"
            ],
            correct: 0,
            explanation: "Docker Hub'a push için imaj adı KULLANICI_ADI/REPO:TAG formatında olmalıdır. Örn: ahmet123/benim-app:1.0. Bu formatta olmayan imajlar Docker Hub'a gönderilemez."
        },
        {
            question: "docker tag mevcut imajı:1.0 yeniisim:2.0 komutu ne yapar?",
            options: [
                "Sadece mevcut imaja yeni bir isim/etiket daha",
                "Docker Hub'a yükler — bu davranış beklenmez",
                "Varsayılan olarak eski imajı siler yerine farklı bir komut",
                "Dosyayı kopyalar ve yeni bir imaj oluşturur"
            ],
            correct: 0,
            explanation: "docker tag yeni bir imaj oluşturmaz, mevcut imajın üzerine bir referans (isim) daha ekler. İki tag de aynı image ID'ye işaret eder. Disk kullanımı artmaz."
        },
        {
            question: "USER talimatı neden önemlidir?",
            options: [
                "Konteynerin root yerine daha sınırlı yetkili bir kullanıcıyla",
                "Docker Hub kullanıcısını değiştirir — bu davranış beklenmez",
                "Bu senaryoda i̇majın sahibini belirler ve işlemi sonlandırır",
                "Varsayılan olarak sadece isimlendirme amaçlıdır yerine farklı bir komut"
            ],
            correct: 0,
            explanation: "Konteyner varsayılan olarak root kullanıcısı ile çalışır. Bu güvenlik riskidir — bir açıkta saldırgan kök yetkisi ile iş görür. USER ile minimum yetkili bir hesaba geçerek \"defense in depth\" prensibini uygularız."
        }
    ]
});
