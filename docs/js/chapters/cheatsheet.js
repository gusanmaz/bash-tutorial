// ===== Cheat Sheet Verileri =====
window.CHEATSHEET = [
    {
        title: '🧭 Navigasyon',
        items: [
            { cmd: 'pwd', desc: 'Bulunduğun dizini göster (Print Working Directory)' },
            { cmd: 'ls [yol]', desc: 'Dizin içeriğini listele (List)' },
            { cmd: 'ls -l', desc: 'Detaylı liste (Long format)' },
            { cmd: 'ls -a', desc: 'Gizli dosyalar dahil (All)' },
            { cmd: 'ls -lh', desc: 'Okunabilir boyutlarla detaylı liste (Human-readable)' },
            { cmd: 'cd [dizin]', desc: 'Dizin değiştir (Change Directory)' },
            { cmd: 'cd ..', desc: 'Üst dizine git (Parent directory)' },
            { cmd: 'cd ~ veya cd', desc: 'Ev dizinine git (Home)' },
            { cmd: 'cd -', desc: 'Önceki dizine dön' },
            { cmd: 'pushd / popd', desc: 'Dizin yığınına ekle / geri dön' },
            { cmd: 'tree', desc: 'Dizin ağacını göster' },
            { cmd: 'tree -L 2', desc: 'İki seviye derinlikte ağaç göster' },
        ]
    },
    {
        title: '📁 Dosya İşlemleri',
        items: [
            { cmd: 'touch dosya', desc: 'Boş dosya oluştur' },
            { cmd: 'mkdir dizin', desc: 'Dizin oluştur (Make Directory)' },
            { cmd: 'mkdir -p a/b/c', desc: 'İç içe dizin oluştur (Parents)' },
            { cmd: 'cp kaynak hedef', desc: 'Kopyala (Copy)' },
            { cmd: 'cp -r dizin hedef', desc: 'Dizini kopyala (Recursive)' },
            { cmd: 'cp -i kaynak hedef', desc: 'Üzerine yazmadan önce sor (Interactive)' },
            { cmd: 'mv kaynak hedef', desc: 'Taşı/Yeniden adlandır (Move)' },
            { cmd: 'rm dosya', desc: 'Sil (Remove)' },
            { cmd: 'rm -r dizin', desc: 'Dizini sil (Recursive)' },
            { cmd: 'rm -i dosya', desc: 'Onay isteyerek sil (Interactive)' },
            { cmd: 'rmdir dizin', desc: 'Boş dizini sil (Remove Directory)' },
            { cmd: 'ln -s kaynak link', desc: 'Sembolik link oluştur (Symbolic Link)' },
        ]
    },
    {
        title: '📄 Dosya Görüntüleme',
        items: [
            { cmd: 'cat dosya', desc: 'İçeriği göster (Concatenate)' },
            { cmd: 'cat -n dosya', desc: 'Satır numaralı görüntüle' },
            { cmd: 'head -n X dosya', desc: 'İlk X satırı göster (Head)' },
            { cmd: 'tail -n X dosya', desc: 'Son X satırı göster (Tail)' },
            { cmd: 'tail -f dosya', desc: 'Dosyayı canlı izle (Follow)' },
            { cmd: 'less dosya', desc: 'Sayfa sayfa görüntüle (sayfalayıcı)' },
            { cmd: 'wc dosya', desc: 'Satır/kelime/bayt say (Word Count)' },
            { cmd: 'file dosya', desc: 'Dosya türünü belirle' },
            { cmd: 'stat dosya', desc: 'Dosya bilgilerini göster' },
            { cmd: 'diff dosya1 dosya2', desc: 'İki dosya arasındaki farkları göster' },
        ]
    },
    {
        title: '🔍 Arama',
        items: [
            { cmd: 'grep kalıp dosya', desc: 'Dosyada kalıp ara (Global Regular Expression Print)' },
            { cmd: 'grep -i kalıp dosya', desc: 'Harf duyarsız arama (Ignore case)' },
            { cmd: 'grep -n kalıp dosya', desc: 'Satır numaralı (Number)' },
            { cmd: 'grep -r kalıp dizin', desc: 'Özyinelemeli arama (Recursive)' },
            { cmd: 'grep -v kalıp dosya', desc: 'Eşleşmeyenleri göster (Invert)' },
            { cmd: 'grep -E "a|b" dosya', desc: 'Genişletilmiş regex (Extended)' },
            { cmd: 'find yol -name "kalıp"', desc: 'Dosya adına göre bul' },
            { cmd: 'find yol -type f/d', desc: 'Türe göre bul (File/Directory)' },
            { cmd: 'find . -size +10M', desc: '10MB\'den büyük dosyaları bul' },
            { cmd: 'which komut', desc: 'Komutun tam yolunu göster' },
            { cmd: 'type komut', desc: 'Komutun türünü göster' },
        ]
    },
    {
        title: '🔐 İzinler',
        items: [
            { cmd: 'chmod 755 dosya', desc: 'İzin ayarla — sayısal (Change Mode)' },
            { cmd: 'chmod +x dosya', desc: 'Çalıştırma izni ekle' },
            { cmd: 'chmod u+w dosya', desc: 'Sahibine yazma izni ekle' },
            { cmd: 'chmod go-rwx dosya', desc: 'Grup ve diğerlerinin tüm izinlerini kaldır' },
            { cmd: 'chown user:group dosya', desc: 'Sahipliği değiştir (Change Owner)' },
            { cmd: 'chown -R user dizin', desc: 'Dizini özyinelemeli sahiplendir' },
        ]
    },
    {
        title: '🔗 Pipe ve Yönlendirme',
        items: [
            { cmd: 'komut > dosya', desc: 'stdout → dosya (üzerine yaz)' },
            { cmd: 'komut >> dosya', desc: 'stdout → dosya (ekle)' },
            { cmd: 'komut 2> dosya', desc: 'stderr → dosya' },
            { cmd: 'komut &> dosya', desc: 'stdout + stderr → dosya' },
            { cmd: 'komut < dosya', desc: 'dosya → stdin' },
            { cmd: 'komut1 | komut2', desc: 'Pipe — stdout\'u stdin\'e aktar' },
            { cmd: 'komut | tee dosya', desc: 'Çıktıyı dosyaya ve ekrana yaz' },
            { cmd: 'komut | xargs cmd', desc: 'stdin\'i argümana çevir' },
            { cmd: 'komut 2>/dev/null', desc: 'Hata mesajlarını bastır' },
        ]
    },
    {
        title: '🔧 Filtreler',
        items: [
            { cmd: 'sort dosya', desc: 'Satırları sırala (Sort)' },
            { cmd: 'sort -n', desc: 'Sayısal sıralama (Numeric)' },
            { cmd: 'sort -r', desc: 'Ters sıralama (Reverse)' },
            { cmd: 'uniq', desc: 'Ardışık tekrarları kaldır (Unique)' },
            { cmd: 'uniq -c', desc: 'Tekrar sayısını göster (Count)' },
            { cmd: 'cut -d":" -f1', desc: 'Alanları kes (Delimiter, Field)' },
            { cmd: 'tr "a-z" "A-Z"', desc: 'Karakterleri dönüştür (Translate)' },
            { cmd: 'sed "s/eski/yeni/g"', desc: 'Akış düzenleyici (Stream Editor)' },
        ]
    },
    {
        title: '⚙️ Sistem ve Süreçler',
        items: [
            { cmd: 'ps aux', desc: 'Tüm süreçleri listele (Process Status)' },
            { cmd: 'top / htop', desc: 'Canlı süreç izleme' },
            { cmd: 'kill PID', desc: 'Süreci sonlandır — SIGTERM (Kill)' },
            { cmd: 'kill -9 PID', desc: 'Zorla sonlandır — SIGKILL' },
            { cmd: 'killall isim', desc: 'İsimle süreç sonlandır' },
            { cmd: 'jobs', desc: 'Arka plan işlerini listele' },
            { cmd: 'bg / fg', desc: 'Arka plan / ön plana getir' },
            { cmd: 'nohup komut &', desc: 'Terminal kapansa da çalıştır' },
            { cmd: 'whoami', desc: 'Kullanıcı adını göster' },
            { cmd: 'uname -a', desc: 'Sistem bilgisi (Unix Name)' },
            { cmd: 'df -h', desc: 'Disk kullanımı (Disk Free)' },
            { cmd: 'du -sh *', desc: 'Dizin boyutları (Disk Usage)' },
            { cmd: 'free -h', desc: 'Bellek kullanımı' },
            { cmd: 'date', desc: 'Tarih ve saat' },
            { cmd: 'uptime', desc: 'Sistem çalışma süresi' },
            { cmd: 'history', desc: 'Komut geçmişi' },
        ]
    },
    {
        title: '✏️ Metin Editörleri',
        items: [
            { cmd: 'nano dosya', desc: 'Nano editör (en kolay)' },
            { cmd: 'Ctrl+O / Ctrl+X', desc: 'Nano: Kaydet / Çık' },
            { cmd: 'vi dosya / vim dosya', desc: 'Vi/Vim editör' },
            { cmd: 'i', desc: 'Vim: Insert moduna geç' },
            { cmd: 'Esc', desc: 'Vim: Normal moda dön' },
            { cmd: ':w / :q / :wq / :q!', desc: 'Vim: Kaydet / Çık / Kaydet-çık / Çık (zorla)' },
            { cmd: 'dd / yy / p', desc: 'Vim: Satır sil / kopyala / yapıştır' },
            { cmd: 'u / Ctrl+R', desc: 'Vim: Geri al / Yinele' },
            { cmd: '/kelime', desc: 'Vim: Arama yap' },
        ]
    },
    {
        title: '📜 Bash Scripting',
        items: [
            { cmd: '#!/bin/bash', desc: 'Shebang — script başlığı' },
            { cmd: 'DEGISKEN="deger"', desc: 'Değişken tanımla (boşluk yok!)' },
            { cmd: '$DEGISKEN / ${DEGISKEN}', desc: 'Değişkeni kullan' },
            { cmd: '$(komut)', desc: 'Komut çıktısını yakala (Command substitution)' },
            { cmd: 'read -p "mesaj" VAR', desc: 'Kullanıcıdan girdi al' },
            { cmd: 'if [[ koşul ]]; then ... fi', desc: 'Koşullu ifade' },
            { cmd: 'for x in liste; do ... done', desc: 'For döngüsü' },
            { cmd: 'while [[ koşul ]]; do ... done', desc: 'While döngüsü' },
            { cmd: 'case $x in a) ... ;; esac', desc: 'Case ifadesi (çoklu seçim)' },
            { cmd: 'function isim() { ... }', desc: 'Fonksiyon tanımlama' },
            { cmd: '-eq/-ne/-gt/-lt/-ge/-le', desc: 'Sayısal karşılaştırma operatörleri' },
            { cmd: '-e/-f/-d/-r/-w/-x', desc: 'Dosya test operatörleri' },
            { cmd: 'set -euo pipefail', desc: 'Güvenli hata yönetimi' },
            { cmd: '$? / $# / $@ / $0', desc: 'Özel değişkenler (çıkış kodu / argüman sayısı / tümü / script adı)' },
        ]
    },
    {
        title: '⌨️ Kısayollar',
        items: [
            { cmd: 'Tab', desc: 'Otomatik tamamlama' },
            { cmd: 'Tab Tab', desc: 'Olası tamamlamaları listele' },
            { cmd: '↑ / ↓', desc: 'Komut geçmişinde gezinme' },
            { cmd: 'Ctrl+C', desc: 'Çalışan komutu kes (SIGINT)' },
            { cmd: 'Ctrl+Z', desc: 'Süreci askıya al (SIGTSTP)' },
            { cmd: 'Ctrl+D', desc: 'EOF gönder / Shell\'den çık' },
            { cmd: 'Ctrl+L', desc: 'Ekranı temizle (clear)' },
            { cmd: 'Ctrl+A', desc: 'Satır başına git' },
            { cmd: 'Ctrl+E', desc: 'Satır sonuna git' },
            { cmd: 'Ctrl+U', desc: 'İmleçten satır başına kadar sil' },
            { cmd: 'Ctrl+K', desc: 'İmleçten satır sonuna kadar sil' },
            { cmd: 'Ctrl+W', desc: 'Önceki kelimeyi sil' },
            { cmd: 'Ctrl+R', desc: 'Geçmişte arama yap (reverse search)' },
            { cmd: '!!', desc: 'Son komutu tekrarla' },
            { cmd: '!$', desc: 'Son komutun son argümanı' },
        ]
    }
];
