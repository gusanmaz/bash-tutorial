// ===== Sandboxed Linux Terminal Emulator =====
// Simulates a basic Linux filesystem and common commands

class LinuxTerminal {
    constructor() {
        this.history = [];
        this.historyIndex = -1;
        this.env = {
            USER: 'kullanici',
            HOME: '/home/kullanici',
            PATH: '/usr/local/bin:/usr/bin:/bin',
            SHELL: '/bin/bash',
            LANG: 'tr_TR.UTF-8',
            PWD: '/home/kullanici',
            HOSTNAME: 'linux',
            EDITOR: 'vi',
            TERM: 'xterm-256color'
        };
        this.cwd = '/home/kullanici';
        this.previousDir = '/home/kullanici';
        this.aliases = {
            'll': 'ls -l',
            'la': 'ls -a',
            'cls': 'clear',
            '..': 'cd ..'
        };

        // Virtual filesystem
        this.fs = {
            '/': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: ['home', 'etc', 'var', 'usr', 'tmp', 'bin', 'sbin', 'opt', 'root', 'dev', 'proc', 'mnt', 'media'] },
            '/home': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: ['kullanici'] },
            '/home/kullanici': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'kullanici', group: 'kullanici', children: ['Belgeler', 'Indirmeler', 'Masaustu', 'Muzik', 'Resimler', 'Videolar', '.bashrc', '.profile', 'notlar.txt', 'merhaba.sh', 'projeler'] },
            '/home/kullanici/Belgeler': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'kullanici', group: 'kullanici', children: ['rapor.txt', 'ozgecmis.pdf', 'notlar'] },
            '/home/kullanici/Belgeler/notlar': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'kullanici', group: 'kullanici', children: ['linux.txt', 'bash.txt'] },
            '/home/kullanici/Belgeler/rapor.txt': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 2048, content: 'Bu bir örnek rapor dosyasıdır.\nLinux komut satırını öğreniyoruz.\nBash kabuğu çok güçlü bir araçtır.\n\nÖnemli Notlar:\n- Komutlar büyük/küçük harfe duyarlıdır\n- Dosya uzantıları Linux\'ta zorunlu değildir\n- Her şey bir dosyadır!' },
            '/home/kullanici/Belgeler/ozgecmis.pdf': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 15360, content: '[PDF Binary Content]' },
            '/home/kullanici/Belgeler/notlar/linux.txt': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 512, content: 'Linux Temel Komutlar:\n\nls  - Dizin içeriğini listele (list)\ncd  - Dizin değiştir (change directory)\npwd - Bulunduğun dizini göster (print working directory)\ncp  - Kopyala (copy)\nmv  - Taşı/yeniden adlandır (move)\nrm  - Sil (remove)\nmkdir - Dizin oluştur (make directory)\ncat - Dosya içeriğini göster (concatenate)\n' },
            '/home/kullanici/Belgeler/notlar/bash.txt': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 256, content: 'Bash Kısayolları:\n\nTab - Otomatik tamamlama\nYukarı Ok - Önceki komut\nCtrl+C - Komutu iptal et\nCtrl+L - Ekranı temizle\nCtrl+A - Satır başı\nCtrl+E - Satır sonu\n' },
            '/home/kullanici/Indirmeler': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'kullanici', group: 'kullanici', children: ['setup.tar.gz', 'resim.jpg'] },
            '/home/kullanici/Indirmeler/setup.tar.gz': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 52428800, content: '[Binary Content]' },
            '/home/kullanici/Indirmeler/resim.jpg': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 2097152, content: '[Binary Content]' },
            '/home/kullanici/Masaustu': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'kullanici', group: 'kullanici', children: ['kısayol.desktop'] },
            '/home/kullanici/Masaustu/kısayol.desktop': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 128, content: '[Desktop Entry]\nName=Terminal\nExec=/usr/bin/bash\nType=Application' },
            '/home/kullanici/Muzik': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'kullanici', group: 'kullanici', children: [] },
            '/home/kullanici/Resimler': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'kullanici', group: 'kullanici', children: ['tatil.jpg', 'ekran_goruntusu.png'] },
            '/home/kullanici/Resimler/tatil.jpg': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 3145728, content: '[Binary Content]' },
            '/home/kullanici/Resimler/ekran_goruntusu.png': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 1048576, content: '[Binary Content]' },
            '/home/kullanici/Videolar': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'kullanici', group: 'kullanici', children: [] },
            '/home/kullanici/.bashrc': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 512, content: '# ~/.bashrc\n\n# If not running interactively, don\'t do anything\ncase $- in\n    *i*) ;;\n      *) return;;\nesac\n\n# Alias tanımlamaları\nalias ll=\'ls -l\'\nalias la=\'ls -a\'\nalias cls=\'clear\'\n\n# Prompt ayarı\nexport PS1=\'\\u@\\h:\\w$ \'\n' },
            '/home/kullanici/.profile': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 256, content: '# ~/.profile\n# Bu dosya giriş kabuğu başlatıldığında çalışır\n\nif [ -f "$HOME/.bashrc" ]; then\n    . "$HOME/.bashrc"\nfi\n\nexport PATH="$HOME/bin:$PATH"\n' },
            '/home/kullanici/notlar.txt': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 156, content: 'Linux öğrenmeye bugün başladım!\n\nYapılacaklar:\n1. Temel komutları öğren\n2. Dosya sistemi yapısını anla\n3. Bash scripting öğren\n4. Bol bol pratik yap!\n' },
            '/home/kullanici/merhaba.sh': { type: 'file', permissions: '-rwxr-xr-x', owner: 'kullanici', group: 'kullanici', size: 128, content: '#!/bin/bash\n# İlk bash scriptim\n\necho "Merhaba Dünya!"\necho "Bugünün tarihi: $(date)"\necho "Kullanıcı: $USER"\necho "Dizin: $PWD"\n' },
            '/home/kullanici/projeler': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'kullanici', group: 'kullanici', children: ['web-sitesi', 'script.sh'] },
            '/home/kullanici/projeler/web-sitesi': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'kullanici', group: 'kullanici', children: ['index.html', 'stil.css'] },
            '/home/kullanici/projeler/web-sitesi/index.html': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 256, content: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Benim Sitem</title>\n    <link rel="stylesheet" href="stil.css">\n</head>\n<body>\n    <h1>Merhaba Dünya!</h1>\n</body>\n</html>' },
            '/home/kullanici/projeler/web-sitesi/stil.css': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 128, content: 'body {\n    font-family: Arial, sans-serif;\n    margin: 20px;\n    background: #f0f0f0;\n}\n\nh1 {\n    color: #333;\n}\n' },
            '/home/kullanici/projeler/script.sh': { type: 'file', permissions: '-rwxr-xr-x', owner: 'kullanici', group: 'kullanici', size: 256, content: '#!/bin/bash\n# Dosya yedekleme scripti\n\nKAYNAK="/home/kullanici/Belgeler"\nHEDEF="/home/kullanici/yedek"\nTARIH=$(date +%Y%m%d)\n\necho "Yedekleme başlıyor..."\necho "Kaynak: $KAYNAK"\necho "Hedef: $HEDEF/$TARIH"\necho "Yedekleme tamamlandı!"\n' },
            '/etc': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: ['hostname', 'passwd', 'hosts', 'fstab', 'resolv.conf'] },
            '/etc/hostname': { type: 'file', permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 6, content: 'linux\n' },
            '/etc/passwd': { type: 'file', permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 512, content: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nkullanici:x:1000:1000:Kullanıcı:/home/kullanici:/bin/bash\n' },
            '/etc/hosts': { type: 'file', permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 128, content: '127.0.0.1\tlocalhost\n127.0.1.1\tlinux\n\n# IPv6\n::1\tlocalhost ip6-localhost ip6-loopback\n' },
            '/etc/fstab': { type: 'file', permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 256, content: '# /etc/fstab: static file system information.\n#\n# <file system>\t<mount point>\t<type>\t<options>\t<dump>\t<pass>\nUUID=xxxx-xxxx\t/\text4\terrors=remount-ro\t0\t1\n/swapfile\tnone\tswap\tsw\t0\t0\n' },
            '/etc/resolv.conf': { type: 'file', permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 64, content: 'nameserver 8.8.8.8\nnameserver 8.8.4.4\n' },
            '/var': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: ['log', 'tmp'] },
            '/var/log': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: ['syslog', 'auth.log'] },
            '/var/log/syslog': { type: 'file', permissions: '-rw-r-----', owner: 'root', group: 'adm', size: 102400, content: 'Feb 26 10:00:01 linux systemd[1]: Started Daily apt download activities.\nFeb 26 10:15:32 linux kernel: [12345.678] CPU0: Core temperature above threshold\nFeb 26 10:30:00 linux cron[1234]: (root) CMD (test -x /usr/sbin/anacron)\n' },
            '/var/log/auth.log': { type: 'file', permissions: '-rw-r-----', owner: 'root', group: 'adm', size: 51200, content: 'Feb 26 09:00:01 linux sshd[1234]: Accepted password for kullanici\nFeb 26 09:00:01 linux systemd-logind[456]: New session 1 of user kullanici.\n' },
            '/var/tmp': { type: 'dir', permissions: 'drwxrwxrwt', owner: 'root', group: 'root', children: [] },
            '/usr': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: ['bin', 'local', 'share'] },
            '/usr/bin': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: ['bash', 'ls', 'cat', 'grep', 'find', 'vim', 'python3'] },
            '/usr/local': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: ['bin'] },
            '/usr/local/bin': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: [] },
            '/usr/share': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: ['doc', 'man'] },
            '/usr/share/doc': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: [] },
            '/usr/share/man': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: [] },
            '/tmp': { type: 'dir', permissions: 'drwxrwxrwt', owner: 'root', group: 'root', children: ['gecici.txt'] },
            '/tmp/gecici.txt': { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 32, content: 'Bu geçici bir dosyadır.\n' },
            '/bin': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: ['bash', 'ls', 'cat', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'pwd', 'echo', 'grep', 'chmod', 'chown'] },
            '/sbin': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: ['init', 'shutdown', 'reboot'] },
            '/opt': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: [] },
            '/root': { type: 'dir', permissions: 'drwx------', owner: 'root', group: 'root', children: [] },
            '/dev': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: ['null', 'zero', 'random', 'sda', 'sda1'] },
            '/proc': { type: 'dir', permissions: 'dr-xr-xr-x', owner: 'root', group: 'root', children: ['cpuinfo', 'meminfo', 'version'] },
            '/proc/cpuinfo': { type: 'file', permissions: '-r--r--r--', owner: 'root', group: 'root', size: 256, content: 'processor\t: 0\nvendor_id\t: GenuineIntel\nmodel name\t: Intel(R) Core(TM) i7-9700K\ncpu MHz\t\t: 3600.000\ncache size\t: 12288 KB\ncpu cores\t: 8\n' },
            '/proc/meminfo': { type: 'file', permissions: '-r--r--r--', owner: 'root', group: 'root', size: 128, content: 'MemTotal:       16384000 kB\nMemFree:         8192000 kB\nMemAvailable:   12288000 kB\nBuffers:          512000 kB\nCached:          2048000 kB\nSwapTotal:       4096000 kB\nSwapFree:        4096000 kB\n' },
            '/proc/version': { type: 'file', permissions: '-r--r--r--', owner: 'root', group: 'root', size: 128, content: 'Linux version 5.15.0-generic (builder@linux) (gcc 11.3.0) #1 SMP Fri Feb 26 10:00:00 UTC 2026\n' },
            '/mnt': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: [] },
            '/media': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: [] },
        };

        // Add file entries for all executables
        ['/usr/bin/bash', '/usr/bin/ls', '/usr/bin/cat', '/usr/bin/grep', '/usr/bin/find', '/usr/bin/vim', '/usr/bin/python3',
         '/bin/bash', '/bin/ls', '/bin/cat', '/bin/cp', '/bin/mv', '/bin/rm', '/bin/mkdir', '/bin/rmdir', '/bin/pwd', '/bin/echo', '/bin/grep', '/bin/chmod', '/bin/chown',
         '/sbin/init', '/sbin/shutdown', '/sbin/reboot'].forEach(p => {
            if (!this.fs[p]) this.fs[p] = { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 1024, content: '[ELF Binary]' };
        });
        ['/dev/null', '/dev/zero', '/dev/random', '/dev/sda', '/dev/sda1'].forEach(p => {
            if (!this.fs[p]) this.fs[p] = { type: 'device', permissions: 'crw-rw-rw-', owner: 'root', group: 'root', size: 0, content: '' };
        });
    }

    resolvePath(path) {
        if (!path) return this.cwd;
        
        // Handle ~
        path = path.replace(/^~/, this.env.HOME);
        
        // Handle -
        if (path === '-') return this.previousDir;
        
        // Handle relative paths
        if (!path.startsWith('/')) {
            path = this.cwd + '/' + path;
        }
        
        // Normalize path
        const parts = path.split('/').filter(Boolean);
        const resolved = [];
        for (const part of parts) {
            if (part === '.') continue;
            if (part === '..') { resolved.pop(); continue; }
            resolved.push(part);
        }
        return '/' + resolved.join('/') || '/';
    }

    getNode(path) {
        const resolved = this.resolvePath(path);
        return this.fs[resolved] ? { ...this.fs[resolved], path: resolved } : null;
    }

    getParentPath(path) {
        const parts = path.split('/').filter(Boolean);
        parts.pop();
        return '/' + parts.join('/') || '/';
    }

    getBasename(path) {
        const parts = path.split('/').filter(Boolean);
        return parts[parts.length - 1] || '/';
    }

    formatSize(bytes) {
        if (bytes < 1024) return bytes + '';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'K';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + 'M';
        return (bytes / (1024 * 1024 * 1024)).toFixed(1) + 'G';
    }

    execute(input) {
        const trimmed = input.trim();
        if (!trimmed) return '';

        // Add to history
        this.history.push(trimmed);
        this.historyIndex = this.history.length;

        // Check aliases
        let command = trimmed;
        const firstWord = trimmed.split(/\s+/)[0];
        if (this.aliases[firstWord]) {
            command = this.aliases[firstWord] + trimmed.slice(firstWord.length);
        }

        // Parse command & args
        const tokens = this.parseTokens(command);
        const cmd = tokens[0];
        const args = tokens.slice(1);

        // Handle pipe (basic)
        if (command.includes('|')) {
            return this.handlePipe(command);
        }

        // Handle redirection (basic)
        if (command.includes('>')) {
            return this.handleRedirect(command);
        }

        const commands = {
            'help': () => this.cmdHelp(),
            'ls': () => this.cmdLs(args),
            'cd': () => this.cmdCd(args),
            'pwd': () => this.cmdPwd(),
            'cat': () => this.cmdCat(args),
            'echo': () => this.cmdEcho(args),
            'mkdir': () => this.cmdMkdir(args),
            'rmdir': () => this.cmdRmdir(args),
            'touch': () => this.cmdTouch(args),
            'rm': () => this.cmdRm(args),
            'cp': () => this.cmdCp(args),
            'mv': () => this.cmdMv(args),
            'head': () => this.cmdHead(args),
            'tail': () => this.cmdTail(args),
            'wc': () => this.cmdWc(args),
            'grep': () => this.cmdGrep(args),
            'find': () => this.cmdFind(args),
            'chmod': () => this.cmdChmod(args),
            'man': () => this.cmdMan(args),
            'which': () => this.cmdWhich(args),
            'whoami': () => this.env.USER,
            'hostname': () => this.env.HOSTNAME,
            'date': () => new Date().toLocaleString('tr-TR', { dateStyle: 'full', timeStyle: 'medium' }),
            'cal': () => this.cmdCal(),
            'clear': () => '__CLEAR__',
            'env': () => Object.entries(this.env).map(([k,v]) => `${k}=${v}`).join('\n'),
            'export': () => this.cmdExport(args),
            'history': () => this.history.map((h, i) => `  ${(i+1).toString().padStart(4)}  ${h}`).join('\n'),
            'file': () => this.cmdFile(args),
            'stat': () => this.cmdStat(args),
            'tree': () => this.cmdTree(args),
            'uname': () => this.cmdUname(args),
            'uptime': () => ' 10:30:00 up 5 days, 3:42,  1 user,  load average: 0.15, 0.10, 0.05',
            'df': () => this.cmdDf(),
            'du': () => this.cmdDu(args),
            'free': () => this.cmdFree(),
            'ps': () => this.cmdPs(),
            'top': () => '<span class="term-info">top komutu interaktiftir. Bu sandbox ortamında \'ps\' komutunu kullanabilirsiniz.</span>',
            'kill': () => '<span class="term-info">kill: Bu sandbox ortamında process yönetimi desteklenmez.</span>',
            'id': () => `uid=1000(kullanici) gid=1000(kullanici) groups=1000(kullanici),27(sudo)`,
            'sort': () => this.cmdSort(args),
            'uniq': () => this.cmdUniq(args),
            'diff': () => '<span class="term-info">diff: Bu sandbox ortamında diff komutu desteklenmez.</span>',
            'tar': () => '<span class="term-info">tar: Bu sandbox ortamında arşiv işlemleri desteklenmez.</span>',
            'vi': () => '<span class="term-info">vi/vim: Bu sandbox ortamında metin editörü desteklenmez.\nDosya oluşturmak için "touch dosya.txt" veya "echo \'içerik\' > dosya.txt" kullanın.</span>',
            'vim': () => '<span class="term-info">vi/vim: Bu sandbox ortamında metin editörü desteklenmez.\nDosya oluşturmak için "touch dosya.txt" veya "echo \'içerik\' > dosya.txt" kullanın.</span>',
            'nano': () => '<span class="term-info">nano: Bu sandbox ortamında metin editörü desteklenmez.\nDosya oluşturmak için "touch dosya.txt" veya "echo \'içerik\' > dosya.txt" kullanın.</span>',
            'sudo': () => '<span class="term-info">[sudo] kullanici için parola: \nsudo: Bu sandbox ortamında sudo desteklenmez.</span>',
            'apt': () => '<span class="term-info">apt: Bu sandbox ortamında paket yönetimi desteklenmez.</span>',
            'exit': () => '<span class="term-info">Bu terminal sandbox ortamındadır ve kapatılamaz. 😊</span>',
            'bash': () => '<span class="term-info">Zaten bir bash kabuğu içindesiniz!</span>',
            'cowsay': () => this.cmdCowsay(args),
            'seq': () => this.cmdSeq(args),
            'cut': () => this.cmdCut(args),
            'tr': () => this.cmdTr(args),
            'tee': () => this.cmdTee(args),
            'ln': () => this.cmdLn(args),
            'type': () => this.cmdType(args),
            'basename': () => this.cmdBasename(args),
            'dirname': () => this.cmdDirname(args),
            'less': () => this.cmdLess(args),
            'more': () => this.cmdLess(args),
            'sed': () => this.cmdSed(args),
            'xargs': () => '<span class="term-info">xargs: Bu sandbox ortamında xargs desteklenmez. Pipe ile diğer komutları kullanabilirsiniz.</span>',
            'chown': () => this.cmdChown(args),
        };

        if (commands[cmd]) {
            return commands[cmd]();
        }

        // Try running as a script
        const scriptPath = this.resolvePath(cmd);
        const scriptNode = this.fs[scriptPath];
        if (scriptNode && scriptNode.type === 'file' && scriptNode.permissions.includes('x')) {
            return this.cmdRunScript(scriptNode);
        }

        return `<span class="term-error">bash: ${cmd}: komut bulunamadı</span>`;
    }

    parseTokens(input) {
        const tokens = [];
        let current = '';
        let inSingle = false;
        let inDouble = false;

        for (let i = 0; i < input.length; i++) {
            const c = input[i];
            if (c === "'" && !inDouble) { inSingle = !inSingle; continue; }
            if (c === '"' && !inSingle) { inDouble = !inDouble; continue; }
            if (c === ' ' && !inSingle && !inDouble) {
                if (current) { tokens.push(current); current = ''; }
                continue;
            }
            current += c;
        }
        if (current) tokens.push(current);

        // Expand env vars in double-quoted or unquoted
        return tokens.map(t => {
            return t.replace(/\$(\w+)/g, (_, name) => this.env[name] || '');
        });
    }

    handlePipe(command) {
        const parts = command.split('|').map(s => s.trim());
        let output = '';
        for (const part of parts) {
            const tokens = this.parseTokens(part);
            const cmd = tokens[0];
            const args = [...tokens.slice(1)];
            
            // If output from previous command, simulate piping
            if (output && (cmd === 'grep' || cmd === 'sort' || cmd === 'uniq' || cmd === 'head' || cmd === 'tail' || cmd === 'wc' || cmd === 'cut' || cmd === 'tr' || cmd === 'sed' || cmd === 'tee')) {
                args.push('__PIPE__');
                this._pipeData = output;
            }
            
            output = this.execute(part) || '';
        }
        return output;
    }

    handleRedirect(command) {
        const append = command.includes('>>');
        const parts = command.split(append ? '>>' : '>');
        const cmd = parts[0].trim();
        const filePath = this.resolvePath(parts[1].trim());
        
        const output = this.execute(cmd);
        if (typeof output === 'string' && output !== '__CLEAR__') {
            // Strip HTML tags for file content
            const plainOutput = output.replace(/<[^>]+>/g, '');
            const parentPath = this.getParentPath(filePath);
            const parentNode = this.fs[parentPath];
            
            if (!parentNode || parentNode.type !== 'dir') {
                return `<span class="term-error">bash: ${parts[1].trim()}: Böyle bir dizin yok</span>`;
            }
            
            if (this.fs[filePath] && this.fs[filePath].type === 'file') {
                if (append) {
                    this.fs[filePath].content += plainOutput + '\n';
                } else {
                    this.fs[filePath].content = plainOutput + '\n';
                }
                this.fs[filePath].size = this.fs[filePath].content.length;
            } else {
                const name = this.getBasename(filePath);
                if (!parentNode.children.includes(name)) {
                    parentNode.children.push(name);
                }
                this.fs[filePath] = {
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'kullanici',
                    group: 'kullanici',
                    size: plainOutput.length,
                    content: plainOutput + '\n'
                };
            }
            return '';
        }
        return output;
    }

    cmdHelp() {
        return `<span class="term-info">Desteklenen komutlar:</span>

<span class="term-success">Navigasyon:</span>     ls, cd, pwd, tree, find, basename, dirname
<span class="term-success">Dosya İşlem:</span>    cat, head, tail, less, touch, cp, mv, rm, mkdir, rmdir, ln
<span class="term-success">Metin İşlem:</span>    echo, grep, sort, uniq, wc, cut, tr, sed, seq
<span class="term-success">Bilgi:</span>          man, which, type, file, stat, uname, whoami, hostname
<span class="term-success">Sistem:</span>         date, cal, uptime, df, du, free, ps, env, history, id
<span class="term-success">Diğer:</span>          chmod, chown, export, tee, clear, help, cowsay

<span class="term-info">İpuçları:</span>
  • Yönlendirme:  echo "test" > dosya.txt  veya  >> (ekle)
  • Pipe:         ls | grep txt
  • Değişkenler:  echo $HOME  veya  export ISIM=deger`;
    }

    cmdLs(args) {
        let showHidden = false;
        let longFormat = false;
        let targetPath = this.cwd;
        
        for (const arg of args) {
            if (arg.startsWith('-')) {
                if (arg.includes('a')) showHidden = true;
                if (arg.includes('l')) longFormat = true;
            } else {
                targetPath = this.resolvePath(arg);
            }
        }

        const node = this.fs[targetPath];
        if (!node) return `<span class="term-error">ls: '${args.find(a => !a.startsWith('-')) || targetPath}' dizinine erişilemiyor: Böyle bir dosya veya dizin yok</span>`;
        if (node.type !== 'dir') {
            if (longFormat) {
                return `${node.permissions} 1 ${node.owner} ${node.group} ${(node.size||0).toString().padStart(8)} Şub 26 10:00 ${this.getBasename(targetPath)}`;
            }
            return this.getBasename(targetPath);
        }

        let items = [...node.children];
        if (!showHidden) {
            items = items.filter(i => !i.startsWith('.'));
        } else {
            items = ['.', '..', ...items];
        }

        if (longFormat) {
            let total = 0;
            const lines = items.map(name => {
                if (name === '.') {
                    return `${node.permissions} ${node.children.length + 2} ${node.owner} ${node.group}     4096 Şub 26 10:00 <span class="term-dir">.</span>`;
                }
                if (name === '..') {
                    return `drwxr-xr-x ${3} root root     4096 Şub 26 10:00 <span class="term-dir">..</span>`;
                }
                const childPath = targetPath === '/' ? '/' + name : targetPath + '/' + name;
                const child = this.fs[childPath];
                if (!child) return '';
                total += (child.size || 4096);
                const isDir = child.type === 'dir';
                const isExec = !isDir && child.permissions.includes('x');
                const displayName = isDir ? `<span class="term-dir">${name}</span>` : 
                                    isExec ? `<span class="term-exec">${name}</span>` : name;
                const links = isDir ? (child.children ? child.children.length + 2 : 2) : 1;
                const size = (child.size || 4096).toString().padStart(8);
                return `${child.permissions} ${links.toString().padStart(2)} ${child.owner.padEnd(10)} ${child.group.padEnd(10)} ${size} Şub 26 10:00 ${displayName}`;
            }).filter(Boolean);
            return `toplam ${Math.ceil(total / 1024)}\n` + lines.join('\n');
        }

        // Short format
        return items.map(name => {
            const childPath = targetPath === '/' ? '/' + name : targetPath + '/' + name;
            const child = this.fs[childPath];
            if (name === '.' || name === '..') return `<span class="term-dir">${name}</span>`;
            if (!child) return name;
            if (child.type === 'dir') return `<span class="term-dir">${name}</span>`;
            if (child.permissions.includes('x') && child.type === 'file') return `<span class="term-exec">${name}</span>`;
            return name;
        }).join('  ');
    }

    cmdCd(args) {
        const target = args[0] || this.env.HOME;
        const newPath = this.resolvePath(target);
        const node = this.fs[newPath];
        
        if (!node) return `<span class="term-error">bash: cd: ${target}: Böyle bir dosya veya dizin yok</span>`;
        if (node.type !== 'dir') return `<span class="term-error">bash: cd: ${target}: Dizin değil</span>`;
        
        this.previousDir = this.cwd;
        this.cwd = newPath;
        this.env.PWD = newPath;
        
        if (target === '-') return newPath;
        return '';
    }

    cmdPwd() {
        return this.cwd;
    }

    cmdCat(args) {
        if (args.length === 0) return '<span class="term-error">cat: dosya adı belirtilmedi</span>';
        
        const outputs = [];
        let showLineNumbers = false;
        const files = [];
        
        for (const arg of args) {
            if (arg === '-n') { showLineNumbers = true; continue; }
            files.push(arg);
        }
        
        for (const file of files) {
            const path = this.resolvePath(file);
            const node = this.fs[path];
            if (!node) { outputs.push(`<span class="term-error">cat: ${file}: Böyle bir dosya veya dizin yok</span>`); continue; }
            if (node.type === 'dir') { outputs.push(`<span class="term-error">cat: ${file}: Bir dizin</span>`); continue; }
            
            let content = node.content || '';
            if (showLineNumbers) {
                content = content.split('\n').map((line, i) => `     ${(i+1).toString().padStart(3)}\t${line}`).join('\n');
            }
            outputs.push(content);
        }
        return outputs.join('\n');
    }

    cmdEcho(args) {
        let noNewline = false;
        let startIdx = 0;
        if (args[0] === '-n') { noNewline = true; startIdx = 1; }
        return args.slice(startIdx).join(' ');
    }

    cmdMkdir(args) {
        let createParents = false;
        const dirs = [];
        
        for (const arg of args) {
            if (arg === '-p') { createParents = true; continue; }
            dirs.push(arg);
        }
        
        if (dirs.length === 0) return '<span class="term-error">mkdir: eksik operand</span>';
        
        const results = [];
        for (const dir of dirs) {
            const path = this.resolvePath(dir);
            if (this.fs[path]) {
                results.push(`<span class="term-error">mkdir: '${dir}' dizini oluşturulamıyor: Dosya mevcut</span>`);
                continue;
            }
            
            const parentPath = this.getParentPath(path);
            const parentNode = this.fs[parentPath];
            
            if (!parentNode && !createParents) {
                results.push(`<span class="term-error">mkdir: '${dir}' dizini oluşturulamıyor: Böyle bir dosya veya dizin yok</span>`);
                continue;
            }
            
            if (createParents) {
                // Create parent directories as needed
                const parts = path.split('/').filter(Boolean);
                let currentPath = '';
                for (const part of parts) {
                    currentPath += '/' + part;
                    if (!this.fs[currentPath]) {
                        const pp = this.getParentPath(currentPath);
                        if (this.fs[pp] && this.fs[pp].children) {
                            this.fs[pp].children.push(part);
                        }
                        this.fs[currentPath] = { type: 'dir', permissions: 'drwxr-xr-x', owner: 'kullanici', group: 'kullanici', children: [] };
                    }
                }
            } else {
                const name = this.getBasename(path);
                parentNode.children.push(name);
                this.fs[path] = { type: 'dir', permissions: 'drwxr-xr-x', owner: 'kullanici', group: 'kullanici', children: [] };
            }
        }
        return results.join('\n');
    }

    cmdRmdir(args) {
        if (args.length === 0) return '<span class="term-error">rmdir: eksik operand</span>';
        
        const results = [];
        for (const arg of args) {
            const path = this.resolvePath(arg);
            const node = this.fs[path];
            if (!node) { results.push(`<span class="term-error">rmdir: '${arg}' silme başarısız: Böyle bir dosya veya dizin yok</span>`); continue; }
            if (node.type !== 'dir') { results.push(`<span class="term-error">rmdir: '${arg}' silme başarısız: Dizin değil</span>`); continue; }
            if (node.children && node.children.length > 0) { results.push(`<span class="term-error">rmdir: '${arg}' silme başarısız: Dizin boş değil</span>`); continue; }
            
            const parentPath = this.getParentPath(path);
            const parentNode = this.fs[parentPath];
            if (parentNode && parentNode.children) {
                parentNode.children = parentNode.children.filter(c => c !== this.getBasename(path));
            }
            delete this.fs[path];
        }
        return results.join('\n');
    }

    cmdTouch(args) {
        if (args.length === 0) return '<span class="term-error">touch: eksik operand</span>';
        
        for (const arg of args) {
            const path = this.resolvePath(arg);
            if (this.fs[path]) continue; // Just update timestamp (noop in our sim)
            
            const parentPath = this.getParentPath(path);
            const parentNode = this.fs[parentPath];
            if (!parentNode || parentNode.type !== 'dir') {
                return `<span class="term-error">touch: '${arg}' oluşturulamıyor: Böyle bir dosya veya dizin yok</span>`;
            }
            
            const name = this.getBasename(path);
            parentNode.children.push(name);
            this.fs[path] = { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: 0, content: '' };
        }
        return '';
    }

    cmdRm(args) {
        let recursive = false;
        let force = false;
        const files = [];
        
        for (const arg of args) {
            if (arg.startsWith('-')) {
                if (arg.includes('r') || arg.includes('R')) recursive = true;
                if (arg.includes('f')) force = true;
                continue;
            }
            files.push(arg);
        }
        
        if (files.length === 0) return '<span class="term-error">rm: eksik operand</span>';
        
        const results = [];
        for (const file of files) {
            const path = this.resolvePath(file);
            const node = this.fs[path];
            
            if (!node) {
                if (!force) results.push(`<span class="term-error">rm: '${file}' kaldırılamıyor: Böyle bir dosya veya dizin yok</span>`);
                continue;
            }
            
            if (node.type === 'dir' && !recursive) {
                results.push(`<span class="term-error">rm: '${file}' kaldırılamıyor: Bir dizin</span>`);
                continue;
            }
            
            // Remove recursively
            if (node.type === 'dir') {
                this.removeRecursive(path);
            }
            
            const parentPath = this.getParentPath(path);
            const parentNode = this.fs[parentPath];
            if (parentNode && parentNode.children) {
                parentNode.children = parentNode.children.filter(c => c !== this.getBasename(path));
            }
            delete this.fs[path];
        }
        return results.join('\n');
    }

    removeRecursive(path) {
        const node = this.fs[path];
        if (node && node.type === 'dir' && node.children) {
            for (const child of [...node.children]) {
                const childPath = path === '/' ? '/' + child : path + '/' + child;
                this.removeRecursive(childPath);
                delete this.fs[childPath];
            }
        }
    }

    cmdCp(args) {
        if (args.length < 2) return '<span class="term-error">cp: eksik operand</span>';
        
        const src = this.resolvePath(args[args.length - 2]);
        const dest = this.resolvePath(args[args.length - 1]);
        const srcNode = this.fs[src];
        
        if (!srcNode) return `<span class="term-error">cp: '${args[0]}' stat edilemiyor: Böyle bir dosya veya dizin yok</span>`;
        if (srcNode.type === 'dir') return `<span class="term-error">cp: -r belirtilmeden '${args[0]}' dizini atlanıyor</span>`;
        
        let destPath = dest;
        const destNode = this.fs[dest];
        if (destNode && destNode.type === 'dir') {
            destPath = dest + '/' + this.getBasename(src);
        }
        
        const parentPath = this.getParentPath(destPath);
        const parentNode = this.fs[parentPath];
        if (!parentNode) return `<span class="term-error">cp: hedef dizin yok</span>`;
        
        const name = this.getBasename(destPath);
        if (!parentNode.children.includes(name)) {
            parentNode.children.push(name);
        }
        this.fs[destPath] = { ...srcNode, content: srcNode.content };
        return '';
    }

    cmdMv(args) {
        if (args.length < 2) return '<span class="term-error">mv: eksik operand</span>';
        
        const src = this.resolvePath(args[0]);
        const dest = this.resolvePath(args[1]);
        const srcNode = this.fs[src];
        
        if (!srcNode) return `<span class="term-error">mv: '${args[0]}' stat edilemiyor: Böyle bir dosya veya dizin yok</span>`;
        
        let destPath = dest;
        const destNode = this.fs[dest];
        if (destNode && destNode.type === 'dir') {
            destPath = dest + '/' + this.getBasename(src);
        }
        
        const parentPath = this.getParentPath(destPath);
        const parentNode = this.fs[parentPath];
        if (!parentNode) return `<span class="term-error">mv: hedef dizin yok</span>`;
        
        // Add to destination
        const name = this.getBasename(destPath);
        if (!parentNode.children.includes(name)) {
            parentNode.children.push(name);
        }
        this.fs[destPath] = { ...srcNode };
        
        // Remove from source
        const srcParent = this.getParentPath(src);
        const srcParentNode = this.fs[srcParent];
        if (srcParentNode && srcParentNode.children) {
            srcParentNode.children = srcParentNode.children.filter(c => c !== this.getBasename(src));
        }
        delete this.fs[src];
        
        return '';
    }

    cmdHead(args) {
        let lines = 10;
        const files = [];
        let piped = false;
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-n' && args[i+1]) { lines = parseInt(args[i+1]); i++; continue; }
            if (args[i].startsWith('-') && !isNaN(args[i].slice(1))) { lines = parseInt(args[i].slice(1)); continue; }
            if (args[i] === '__PIPE__') { piped = true; continue; }
            files.push(args[i]);
        }
        if (piped && files.length === 0 && this._pipeData) {
            const result = this._pipeData.replace(/<[^>]+>/g, '').split('\n').slice(0, lines).join('\n');
            this._pipeData = null;
            return result;
        }
        if (files.length === 0) return '<span class="term-error">head: dosya adı belirtilmedi</span>';
        
        return files.map(f => {
            const node = this.getNode(f);
            if (!node) return `<span class="term-error">head: '${f}' açılamadı: Böyle bir dosya veya dizin yok</span>`;
            return (node.content || '').split('\n').slice(0, lines).join('\n');
        }).join('\n');
    }

    cmdTail(args) {
        let lines = 10;
        const files = [];
        let piped = false;
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-n' && args[i+1]) { lines = parseInt(args[i+1]); i++; continue; }
            if (args[i].startsWith('-') && !isNaN(args[i].slice(1))) { lines = parseInt(args[i].slice(1)); continue; }
            if (args[i] === '__PIPE__') { piped = true; continue; }
            files.push(args[i]);
        }
        if (piped && files.length === 0 && this._pipeData) {
            const allLines = this._pipeData.replace(/<[^>]+>/g, '').split('\n');
            this._pipeData = null;
            return allLines.slice(Math.max(0, allLines.length - lines)).join('\n');
        }
        if (files.length === 0) return '<span class="term-error">tail: dosya adı belirtilmedi</span>';
        
        return files.map(f => {
            const node = this.getNode(f);
            if (!node) return `<span class="term-error">tail: '${f}' açılamadı: Böyle bir dosya veya dizin yok</span>`;
            const allLines = (node.content || '').split('\n');
            return allLines.slice(Math.max(0, allLines.length - lines)).join('\n');
        }).join('\n');
    }

    cmdWc(args) {
        let showLines = true, showWords = true, showBytes = true;
        const files = [];
        
        for (const arg of args) {
            if (arg === '-l') { showLines = true; showWords = false; showBytes = false; continue; }
            if (arg === '-w') { showLines = false; showWords = true; showBytes = false; continue; }
            if (arg === '-c') { showLines = false; showWords = false; showBytes = true; continue; }
            if (arg === '__PIPE__') continue;
            files.push(arg);
        }
        
        if (files.length === 0 && this._pipeData) {
            const content = this._pipeData.replace(/<[^>]+>/g, '');
            this._pipeData = null;
            const l = content.split('\n').filter(Boolean).length;
            const w = content.split(/\s+/).filter(Boolean).length;
            const c = content.length;
            let result = '';
            if (showLines) result += l.toString().padStart(6);
            if (showWords) result += w.toString().padStart(6);
            if (showBytes) result += c.toString().padStart(6);
            return result;
        }
        if (files.length === 0) return '<span class="term-error">wc: dosya adı belirtilmedi</span>';
        
        return files.map(f => {
            const node = this.getNode(f);
            if (!node) return `<span class="term-error">wc: ${f}: Böyle bir dosya veya dizin yok</span>`;
            const content = node.content || '';
            const l = content.split('\n').length;
            const w = content.split(/\s+/).filter(Boolean).length;
            const c = content.length;
            let result = '';
            if (showLines) result += l.toString().padStart(6);
            if (showWords) result += w.toString().padStart(6);
            if (showBytes) result += c.toString().padStart(6);
            return result + ' ' + f;
        }).join('\n');
    }

    cmdGrep(args) {
        if (args.length < 1) return '<span class="term-error">grep: kullanım: grep [seçenek] desen dosya</span>';
        
        let caseInsensitive = false;
        let showLineNums = false;
        let count = false;
        let pattern = '';
        const files = [];
        
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-i') { caseInsensitive = true; continue; }
            if (args[i] === '-n') { showLineNums = true; continue; }
            if (args[i] === '-c') { count = true; continue; }
            if (args[i] === '__PIPE__') continue;
            if (!pattern) { pattern = args[i]; continue; }
            files.push(args[i]);
        }
        
        if (!pattern) return '<span class="term-error">grep: desen belirtilmedi</span>';
        
        // Handle pipe input
        if (files.length === 0 && this._pipeData) {
            const content = this._pipeData.replace(/<[^>]+>/g, '');
            this._pipeData = null;
            const lines = content.split('\n');
            const regex = new RegExp(pattern, caseInsensitive ? 'gi' : 'g');
            const results = [];
            let matchCount = 0;
            for (let i = 0; i < lines.length; i++) {
                const testRegex = new RegExp(pattern, caseInsensitive ? 'i' : '');
                if (testRegex.test(lines[i])) {
                    matchCount++;
                    if (!count) {
                        const highlighted = lines[i].replace(regex, m => `<span class="term-error">${m}</span>`);
                        results.push((showLineNums ? `<span class="term-success">${i+1}</span>:` : '') + highlighted);
                    }
                }
            }
            if (count) return matchCount.toString();
            return results.join('\n');
        }

        const results = [];
        for (const f of files) {
            const node = this.getNode(f);
            if (!node) { results.push(`<span class="term-error">grep: ${f}: Böyle bir dosya veya dizin yok</span>`); continue; }
            
            const content = node.content || '';
            const lines = content.split('\n');
            const regex = new RegExp(pattern, caseInsensitive ? 'gi' : 'g');
            let matchCount = 0;
            
            for (let i = 0; i < lines.length; i++) {
                const testRegex = new RegExp(pattern, caseInsensitive ? 'i' : '');
                if (testRegex.test(lines[i])) {
                    matchCount++;
                    if (!count) {
                        const highlighted = lines[i].replace(regex, m => `<span class="term-error">${m}</span>`);
                        const prefix = (files.length > 1 ? `<span class="term-link">${f}</span>:` : '') + (showLineNums ? `<span class="term-success">${i+1}</span>:` : '');
                        results.push(prefix + highlighted);
                    }
                }
            }
            if (count) results.push((files.length > 1 ? `${f}:` : '') + matchCount);
        }
        return results.join('\n');
    }

    cmdFind(args) {
        let startPath = this.cwd;
        let namePattern = null;
        let typeFilter = null;
        
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-name' && args[i+1]) { namePattern = args[i+1]; i++; continue; }
            if (args[i] === '-type' && args[i+1]) { typeFilter = args[i+1]; i++; continue; }
            if (!args[i].startsWith('-')) { startPath = this.resolvePath(args[i]); }
        }
        
        const results = [];
        const search = (path) => {
            const node = this.fs[path];
            if (!node) return;
            
            const basename = this.getBasename(path);
            let matches = true;
            
            if (namePattern) {
                const regex = new RegExp('^' + namePattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
                matches = regex.test(basename);
            }
            if (typeFilter) {
                if (typeFilter === 'f' && node.type !== 'file') matches = false;
                if (typeFilter === 'd' && node.type !== 'dir') matches = false;
            }
            
            if (matches) results.push(path);
            
            if (node.type === 'dir' && node.children) {
                for (const child of node.children) {
                    if (!child.startsWith('.')) {
                        search(path === '/' ? '/' + child : path + '/' + child);
                    }
                }
            }
        };
        
        search(startPath);
        return results.join('\n');
    }

    cmdChmod(args) {
        if (args.length < 2) return '<span class="term-error">chmod: eksik operand</span>';
        
        const mode = args[0];
        const filePath = this.resolvePath(args[1]);
        const node = this.fs[filePath];
        
        if (!node) return `<span class="term-error">chmod: '${args[1]}' erişilemiyor: Böyle bir dosya veya dizin yok</span>`;
        
        // Simple octal mode handling
        if (/^\d{3,4}$/.test(mode)) {
            const octal = mode.length === 4 ? mode.slice(1) : mode;
            const perms = { '0': '---', '1': '--x', '2': '-w-', '3': '-wx', '4': 'r--', '5': 'r-x', '6': 'rw-', '7': 'rwx' };
            const prefix = node.type === 'dir' ? 'd' : '-';
            node.permissions = prefix + (perms[octal[0]] || '---') + (perms[octal[1]] || '---') + (perms[octal[2]] || '---');
        }
        // Symbolic mode (basic: +x, -x, +r, etc.)
        else if (/^[ugoa]*[+-][rwx]+$/.test(mode)) {
            const add = mode.includes('+');
            const chars = mode.split(/[+-]/)[1];
            let p = node.permissions.split('');
            // Apply to owner for simplicity
            chars.split('').forEach(c => {
                const idx = c === 'r' ? 1 : c === 'w' ? 2 : c === 'x' ? 3 : -1;
                if (idx > 0) p[idx] = add ? c : '-';
            });
            node.permissions = p.join('');
        }
        
        return '';
    }

    cmdMan(args) {
        if (args.length === 0) return '<span class="term-error">Hangi kılavuz sayfası istiyorsunuz?\nÖrnek: man ls</span>';
        
        const manPages = {
            'ls': `<span class="term-info">LS(1)                           Kullanıcı Komutları                          LS(1)</span>

<span class="term-success">İSİM</span>
       ls - dizin içeriklerini listele (list directory contents)

<span class="term-success">KULLANIM</span>
       ls [SEÇENEK]... [DOSYA]...

<span class="term-success">AÇIKLAMA</span>
       DOSYA hakkında bilgi listeler (varsayılan olarak bulunulan dizin).

       <span class="term-info">-a, --all</span>       . ile başlayan gizli dosyaları göster
       <span class="term-info">-l</span>              uzun liste biçimini kullan
       <span class="term-info">-h</span>              okunabilir dosya boyutları göster
       <span class="term-info">-R</span>              alt dizinleri özyinelemeli listele
       <span class="term-info">-t</span>              değiştirilme zamanına göre sırala
       <span class="term-info">-S</span>              dosya boyutuna göre sırala`,
            'cd': `<span class="term-info">CD(1)                           Kabuk Yerleşik Komutu                       CD(1)</span>

<span class="term-success">İSİM</span>
       cd - çalışma dizinini değiştir (change directory)

<span class="term-success">KULLANIM</span>
       cd [dizin]

<span class="term-success">AÇIKLAMA</span>
       Çalışma dizinini belirtilen dizine değiştirir.
       Dizin belirtilmezse HOME dizinine gider.
       
       <span class="term-info">cd ..</span>    bir üst dizine git
       <span class="term-info">cd ~</span>     ev dizinine git
       <span class="term-info">cd -</span>     önceki dizine git`,
            'cat': `<span class="term-info">CAT(1)                          Kullanıcı Komutları                         CAT(1)</span>

<span class="term-success">İSİM</span>
       cat - dosyaları birleştir ve çıktıla (concatenate)

<span class="term-success">KULLANIM</span>
       cat [SEÇENEK]... [DOSYA]...

<span class="term-success">AÇIKLAMA</span>
       DOSYA(ları) birleştirip standart çıktıya yazar.

       <span class="term-info">-n</span>              satır numaralarını göster`,
            'grep': `<span class="term-info">GREP(1)                         Kullanıcı Komutları                        GREP(1)</span>

<span class="term-success">İSİM</span>
       grep - desen eşleyen satırları yazdır (global regular expression print)

<span class="term-success">KULLANIM</span>
       grep [SEÇENEK]... DESEN [DOSYA]...

<span class="term-success">AÇIKLAMA</span>
       Her DOSYA'da DESEN'i arar.

       <span class="term-info">-i</span>              büyük/küçük harf duyarsız
       <span class="term-info">-n</span>              satır numarası göster
       <span class="term-info">-c</span>              eşleşen satır sayısını göster
       <span class="term-info">-r</span>              dizinlerde özyinelemeli ara`,
            'chmod': `<span class="term-info">CHMOD(1)                        Kullanıcı Komutları                       CHMOD(1)</span>

<span class="term-success">İSİM</span>
       chmod - dosya izinlerini değiştir (change mode)

<span class="term-success">KULLANIM</span>
       chmod [SEÇENEK]... MOD DOSYA...

<span class="term-success">AÇIKLAMA</span>
       Dosyanın erişim izinlerini değiştirir.
       
       İzin numaraları: r=4, w=2, x=1
       Örnek: chmod 755 dosya  →  rwxr-xr-x`,
        };
        
        const page = manPages[args[0]];
        if (page) return page;
        return `<span class="term-error">man: ${args[0]} için kılavuz sayfası bulunamadı</span>\n<span class="term-info">İpucu: Bu sandbox'ta ls, cd, cat, grep, chmod kılavuzları mevcuttur.</span>`;
    }

    cmdWhich(args) {
        if (args.length === 0) return '';
        const found = { 'ls': '/usr/bin/ls', 'cat': '/usr/bin/cat', 'grep': '/usr/bin/grep', 'bash': '/usr/bin/bash',
            'find': '/usr/bin/find', 'vim': '/usr/bin/vim', 'python3': '/usr/bin/python3', 'cp': '/bin/cp',
            'mv': '/bin/mv', 'rm': '/bin/rm', 'mkdir': '/bin/mkdir', 'rmdir': '/bin/rmdir', 'pwd': '/bin/pwd',
            'echo': '/bin/echo', 'chmod': '/bin/chmod', 'chown': '/bin/chown', 'sort': '/usr/bin/sort',
            'uniq': '/usr/bin/uniq', 'cut': '/usr/bin/cut', 'tr': '/usr/bin/tr', 'sed': '/usr/bin/sed',
            'head': '/usr/bin/head', 'tail': '/usr/bin/tail', 'wc': '/usr/bin/wc', 'tee': '/usr/bin/tee',
            'xargs': '/usr/bin/xargs', 'less': '/usr/bin/less', 'more': '/usr/bin/more', 'seq': '/usr/bin/seq',
            'ln': '/bin/ln', 'basename': '/usr/bin/basename', 'dirname': '/usr/bin/dirname',
            'nano': '/usr/bin/nano', 'touch': '/usr/bin/touch', 'date': '/bin/date', 'cal': '/usr/bin/cal',
            'tree': '/usr/bin/tree', 'file': '/usr/bin/file', 'stat': '/usr/bin/stat', 'df': '/bin/df',
            'du': '/usr/bin/du', 'free': '/usr/bin/free', 'ps': '/bin/ps', 'kill': '/bin/kill',
            'whoami': '/usr/bin/whoami', 'hostname': '/bin/hostname', 'uname': '/bin/uname' };
        return args.map(a => found[a] || `${a} bulunamadı`).join('\n');
    }

    cmdFile(args) {
        if (args.length === 0) return '<span class="term-error">file: eksik operand</span>';
        return args.map(f => {
            const node = this.getNode(f);
            if (!node) return `${f}: açılamıyor (Böyle bir dosya veya dizin yok)`;
            if (node.type === 'dir') return `${f}: directory`;
            if (f.endsWith('.txt')) return `${f}: UTF-8 Unicode text`;
            if (f.endsWith('.sh')) return `${f}: Bourne-Again shell script, ASCII text executable`;
            if (f.endsWith('.html')) return `${f}: HTML document, ASCII text`;
            if (f.endsWith('.css')) return `${f}: CSS source, ASCII text`;
            if (f.endsWith('.jpg') || f.endsWith('.jpeg')) return `${f}: JPEG image data`;
            if (f.endsWith('.png')) return `${f}: PNG image data`;
            if (f.endsWith('.pdf')) return `${f}: PDF document, version 1.5`;
            if (f.endsWith('.tar.gz')) return `${f}: gzip compressed data`;
            return `${f}: data`;
        }).join('\n');
    }

    cmdStat(args) {
        if (args.length === 0) return '<span class="term-error">stat: eksik operand</span>';
        const path = this.resolvePath(args[0]);
        const node = this.fs[path];
        if (!node) return `<span class="term-error">stat: '${args[0]}' erişilemiyor: Böyle bir dosya veya dizin yok</span>`;
        
        return `  Dosya: ${path}
  Boyut: ${(node.size || 4096).toString().padEnd(12)} Bloklar: ${Math.ceil((node.size || 4096) / 512).toString().padEnd(8)} ${node.type === 'dir' ? 'dizin' : 'düzenli dosya'}
Erişim: (${node.permissions})  Uid: ( 1000/ ${node.owner.padEnd(8)})   Gid: ( 1000/ ${node.group.padEnd(8)})
Erişim: 2026-02-26 10:00:00.000000000 +0300
Değştrm: 2026-02-26 10:00:00.000000000 +0300
Değişim: 2026-02-26 10:00:00.000000000 +0300`;
    }

    cmdTree(args) {
        let targetPath = this.cwd;
        let maxDepth = 3;
        
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-L' && args[i+1]) { maxDepth = parseInt(args[i+1]); i++; continue; }
            if (!args[i].startsWith('-')) targetPath = this.resolvePath(args[i]);
        }
        
        const lines = [];
        let dirCount = 0, fileCount = 0;
        
        const walk = (path, prefix, depth) => {
            if (depth > maxDepth) return;
            const node = this.fs[path];
            if (!node || node.type !== 'dir') return;
            
            const children = (node.children || []).filter(c => !c.startsWith('.'));
            children.forEach((child, idx) => {
                const isLast = idx === children.length - 1;
                const connector = isLast ? '└── ' : '├── ';
                const childPath = path === '/' ? '/' + child : path + '/' + child;
                const childNode = this.fs[childPath];
                
                if (childNode && childNode.type === 'dir') {
                    lines.push(prefix + connector + `<span class="term-dir">${child}</span>`);
                    dirCount++;
                    walk(childPath, prefix + (isLast ? '    ' : '│   '), depth + 1);
                } else {
                    lines.push(prefix + connector + child);
                    fileCount++;
                }
            });
        };
        
        lines.push(`<span class="term-dir">${targetPath === this.env.HOME ? '~' : this.getBasename(targetPath) || '/'}</span>`);
        walk(targetPath, '', 1);
        lines.push(`\n${dirCount} dizin, ${fileCount} dosya`);
        
        return lines.join('\n');
    }

    cmdUname(args) {
        if (args.length === 0) return 'Linux';
        if (args.includes('-a')) return 'Linux linux 5.15.0-generic #1 SMP Fri Feb 26 10:00:00 UTC 2026 x86_64 GNU/Linux';
        if (args.includes('-r')) return '5.15.0-generic';
        if (args.includes('-s')) return 'Linux';
        if (args.includes('-m')) return 'x86_64';
        return 'Linux';
    }

    cmdCal() {
        const now = new Date();
        const month = now.toLocaleString('tr-TR', { month: 'long' });
        const year = now.getFullYear();
        const firstDay = new Date(year, now.getMonth(), 1).getDay();
        const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
        const today = now.getDate();
        
        let cal = `     ${month} ${year}\n`;
        cal += 'Pzt Sal Çar Per Cum Cmt Paz\n';
        
        let dayOfWeek = firstDay === 0 ? 6 : firstDay - 1; // Monday start
        cal += '    '.repeat(dayOfWeek);
        
        for (let d = 1; d <= daysInMonth; d++) {
            const dayStr = d === today ? `<span class="term-error">${d.toString().padStart(3)}</span>` : d.toString().padStart(3);
            cal += dayStr + ' ';
            dayOfWeek++;
            if (dayOfWeek >= 7) { cal += '\n'; dayOfWeek = 0; }
        }
        return cal;
    }

    cmdDf() {
        return `Dosya Sistemi    1K-blok    Kullanılan  Boş        Kul%  Bağlantı
/dev/sda1       51200000   15360000   35840000   30%   /
tmpfs            8192000      0        8192000    0%   /dev/shm
/dev/sda2      102400000   40960000   61440000   40%   /home`;
    }

    cmdDu(args) {
        let path = this.cwd;
        let summary = false;
        let humanReadable = false;
        
        for (const arg of args) {
            if (arg === '-s') summary = true;
            else if (arg === '-h') humanReadable = true;
            else if (!arg.startsWith('-')) path = this.resolvePath(arg);
        }
        
        const node = this.fs[path];
        if (!node) return `<span class="term-error">du: '${args.find(a => !a.startsWith('-'))}' erişilemiyor: Böyle bir dosya veya dizin yok</span>`;
        
        if (summary) {
            return `${humanReadable ? '4.2M' : '4200'}\t${path === this.env.HOME ? '~' : path}`;
        }
        return `${humanReadable ? '4.2M' : '4200'}\t${path === this.env.HOME ? '~' : path}`;
    }

    cmdFree() {
        return `              toplam     kullanılan    boş        paylaşılan arabellek   müsait
Bellek:    16384000     4096000    8192000     512000     2048000   12288000
Takas:      4096000           0    4096000`;
    }

    cmdPs() {
        return `  PID TTY          SÜRE KOMUT
 1234 pts/0    00:00:00 bash
 1235 pts/0    00:00:00 ps`;
    }

    cmdExport(args) {
        for (const arg of args) {
            const eqIdx = arg.indexOf('=');
            if (eqIdx > 0) {
                const key = arg.slice(0, eqIdx);
                const val = arg.slice(eqIdx + 1);
                this.env[key] = val;
            }
        }
        return '';
    }

    cmdSort(args) {
        let reverse = false;
        let numeric = false;
        const files = [];
        
        for (const arg of args) {
            if (arg === '-r') reverse = true;
            else if (arg === '-n') numeric = true;
            else if (arg === '__PIPE__') continue;
            else files.push(arg);
        }
        
        const sortLines = (content) => {
            let lines = content.replace(/<[^>]+>/g, '').split('\n').filter(Boolean);
            if (numeric) lines.sort((a, b) => parseFloat(a) - parseFloat(b));
            else lines.sort();
            if (reverse) lines.reverse();
            return lines.join('\n');
        };
        
        if (files.length === 0 && this._pipeData) {
            const result = sortLines(this._pipeData);
            this._pipeData = null;
            return result;
        }
        if (files.length === 0) return '';
        
        return files.map(f => {
            const node = this.getNode(f);
            if (!node) return `<span class="term-error">sort: ${f}: Böyle bir dosya veya dizin yok</span>`;
            return sortLines(node.content || '');
        }).join('\n');
    }

    cmdUniq(args) {
        let countMode = false;
        const files = [];
        for (const a of args) {
            if (a === '__PIPE__') continue;
            if (a === '-c') { countMode = true; continue; }
            if (a === '-d') continue; // duplicate-only mode not fully implemented
            if (!a.startsWith('-')) files.push(a);
        }
        
        const uniqLines = (content) => {
            const lines = content.replace(/<[^>]+>/g, '').split('\n');
            const result = [];
            for (let i = 0; i < lines.length; i++) {
                if (i === 0 || lines[i] !== lines[i-1]) {
                    if (countMode) {
                        let cnt = 1;
                        while (i + cnt < lines.length && lines[i + cnt] === lines[i]) cnt++;
                        result.push(`${cnt.toString().padStart(7)} ${lines[i]}`);
                    } else {
                        result.push(lines[i]);
                    }
                }
            }
            return result.join('\n');
        };

        if (files.length === 0 && this._pipeData) {
            const result = uniqLines(this._pipeData);
            this._pipeData = null;
            return result;
        }
        if (files.length === 0) return '';
        
        return files.map(f => {
            const node = this.getNode(f);
            if (!node) return `<span class="term-error">uniq: ${f}: Böyle bir dosya veya dizin yok</span>`;
            return uniqLines(node.content || '');
        }).join('\n');
    }

    cmdRunScript(node) {
        if (!node.content) return '';
        const lines = node.content.split('\n');
        const output = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('#!/')) continue;
            if (trimmed.startsWith('echo ')) {
                const text = trimmed.slice(5).replace(/^["']|["']$/g, '');
                const expanded = text.replace(/\$\((\w+)\)/g, (_, cmd) => {
                    if (cmd === 'date') return new Date().toLocaleString('tr-TR');
                    return `$(${cmd})`;
                }).replace(/\$(\w+)/g, (_, name) => this.env[name] || '');
                output.push(expanded);
            }
        }
        return output.join('\n');
    }

    cmdCowsay(args) {
        const msg = args.join(' ') || 'Moo!';
        const border = '_'.repeat(msg.length + 2);
        return ` ${border}
< ${msg} >
 ${'-'.repeat(msg.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
    }

    // ===== New Commands =====

    cmdSeq(args) {
        let start = 1, end = 1, step = 1;
        const nums = args.filter(a => !a.startsWith('-') || !isNaN(a));
        if (nums.length === 1) { end = parseInt(nums[0]); }
        else if (nums.length === 2) { start = parseInt(nums[0]); end = parseInt(nums[1]); }
        else if (nums.length >= 3) { start = parseInt(nums[0]); step = parseInt(nums[1]); end = parseInt(nums[2]); }
        if (isNaN(start) || isNaN(end) || isNaN(step) || step === 0) return '<span class="term-error">seq: geçersiz argüman</span>';
        const result = [];
        if (step > 0) { for (let i = start; i <= end; i += step) result.push(i); }
        else { for (let i = start; i >= end; i += step) result.push(i); }
        return result.join('\n');
    }

    cmdCut(args) {
        let delimiter = '\t', fields = null;
        const files = [];
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-d' && args[i+1]) { delimiter = args[i+1]; i++; continue; }
            if (args[i].startsWith('-d') && args[i].length > 2) { delimiter = args[i].slice(2); continue; }
            if (args[i] === '-f' && args[i+1]) { fields = args[i+1]; i++; continue; }
            if (args[i].startsWith('-f') && args[i].length > 2) { fields = args[i].slice(2); continue; }
            if (args[i] === '__PIPE__') continue;
            files.push(args[i]);
        }
        if (!fields) return '<span class="term-error">cut: alan belirtilmedi (-f gerekli)</span>';
        const fieldNums = fields.split(',').map(f => parseInt(f)).filter(n => !isNaN(n));
        
        const processContent = (content) => {
            return content.split('\n').map(line => {
                const parts = line.split(delimiter);
                return fieldNums.map(f => parts[f-1] || '').join(delimiter);
            }).join('\n');
        };

        if (this._pipeData && files.length === 0) {
            const result = processContent(this._pipeData);
            this._pipeData = null;
            return result;
        }
        if (files.length === 0) return '<span class="term-error">cut: dosya adı belirtilmedi</span>';
        return files.map(f => {
            const node = this.getNode(f);
            if (!node) return `<span class="term-error">cut: ${f}: Böyle bir dosya veya dizin yok</span>`;
            return processContent(node.content || '');
        }).join('\n');
    }

    cmdTr(args) {
        if (args.length < 1) return '<span class="term-error">tr: eksik operand</span>';
        let deleteMode = false;
        let squeezeMode = false;
        const sets = [];
        for (const a of args) {
            if (a === '-d') { deleteMode = true; continue; }
            if (a === '-s') { squeezeMode = true; continue; }
            if (a === '__PIPE__') continue;
            sets.push(a);
        }

        const expandRange = (s) => {
            let result = '';
            for (let i = 0; i < s.length; i++) {
                if (s[i+1] === '-' && s[i+2]) {
                    const start = s.charCodeAt(i), end = s.charCodeAt(i+2);
                    for (let c = start; c <= end; c++) result += String.fromCharCode(c);
                    i += 2;
                } else { result += s[i]; }
            }
            return result;
        };

        const processContent = (content) => {
            if (deleteMode && sets.length >= 1) {
                const chars = expandRange(sets[0]);
                return content.split('').filter(c => !chars.includes(c)).join('');
            }
            if (sets.length >= 2) {
                const from = expandRange(sets[0]);
                const to = expandRange(sets[1]);
                let result = content.split('').map(c => {
                    const idx = from.indexOf(c);
                    return idx >= 0 ? (to[Math.min(idx, to.length-1)] || '') : c;
                }).join('');
                if (squeezeMode) {
                    const toChars = expandRange(sets[1]);
                    toChars.split('').forEach(tc => {
                        result = result.replace(new RegExp(tc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '+', 'g'), tc);
                    });
                }
                return result;
            }
            return content;
        };

        if (this._pipeData) {
            const result = processContent(this._pipeData);
            this._pipeData = null;
            return result;
        }
        return '<span class="term-error">tr: girdi pipe ile sağlanmalıdır. Örnek: echo "merhaba" | tr "a-z" "A-Z"</span>';
    }

    cmdTee(args) {
        let appendMode = false;
        const files = [];
        for (const a of args) {
            if (a === '-a') { appendMode = true; continue; }
            if (a === '__PIPE__') continue;
            files.push(a);
        }
        const data = this._pipeData || '';
        this._pipeData = null;
        
        // Write to each file
        for (const f of files) {
            const filePath = this.resolvePath(f);
            const parentPath = this.getParentPath(filePath);
            const parentNode = this.fs[parentPath];
            if (!parentNode || parentNode.type !== 'dir') continue;
            const name = this.getBasename(filePath);
            if (this.fs[filePath] && this.fs[filePath].type === 'file') {
                if (appendMode) { this.fs[filePath].content += data; }
                else { this.fs[filePath].content = data; }
                this.fs[filePath].size = this.fs[filePath].content.length;
            } else {
                if (!parentNode.children.includes(name)) parentNode.children.push(name);
                this.fs[filePath] = { type: 'file', permissions: '-rw-r--r--', owner: 'kullanici', group: 'kullanici', size: data.length, content: data };
            }
        }
        return data; // tee also outputs to stdout
    }

    cmdLn(args) {
        let symbolic = false;
        const paths = [];
        for (const a of args) {
            if (a === '-s') { symbolic = true; continue; }
            if (a.startsWith('-')) continue;
            paths.push(a);
        }
        if (paths.length < 2) return '<span class="term-error">ln: hedef belirtilmedi</span>';
        const target = this.resolvePath(paths[0]);
        const linkPath = this.resolvePath(paths[1]);
        const targetNode = this.fs[target];
        if (!targetNode) return `<span class="term-error">ln: '${paths[0]}' erişilemedi: Böyle bir dosya veya dizin yok</span>`;
        if (this.fs[linkPath]) return `<span class="term-error">ln: '${paths[1]}' oluşturulamadı: Dosya mevcut</span>`;
        const parentPath = this.getParentPath(linkPath);
        const parentNode = this.fs[parentPath];
        if (!parentNode) return `<span class="term-error">ln: '${paths[1]}' oluşturulamadı: Böyle bir dizin yok</span>`;
        const name = this.getBasename(linkPath);
        if (!parentNode.children.includes(name)) parentNode.children.push(name);
        if (symbolic) {
            this.fs[linkPath] = { type: 'file', permissions: 'lrwxrwxrwx', owner: 'kullanici', group: 'kullanici', size: target.length, content: targetNode.content, linkTo: target };
        } else {
            this.fs[linkPath] = { ...targetNode };
        }
        return '';
    }

    cmdType(args) {
        if (args.length === 0) return '<span class="term-error">type: argüman gerekli</span>';
        const builtins = ['cd', 'echo', 'export', 'history', 'alias', 'type', 'pwd', 'exit', 'help'];
        const found = { 'ls': '/usr/bin/ls', 'cat': '/usr/bin/cat', 'grep': '/usr/bin/grep', 'bash': '/usr/bin/bash',
            'find': '/usr/bin/find', 'vim': '/usr/bin/vim', 'sort': '/usr/bin/sort', 'uniq': '/usr/bin/uniq',
            'cut': '/usr/bin/cut', 'tr': '/usr/bin/tr', 'sed': '/usr/bin/sed', 'head': '/usr/bin/head',
            'tail': '/usr/bin/tail', 'wc': '/usr/bin/wc', 'chmod': '/bin/chmod', 'chown': '/bin/chown',
            'cp': '/bin/cp', 'mv': '/bin/mv', 'rm': '/bin/rm', 'mkdir': '/bin/mkdir', 'touch': '/usr/bin/touch' };
        return args.map(a => {
            if (this.aliases[a]) return `${a} \u015fu komutun takma ad\u0131d\u0131r: '${this.aliases[a]}'`;
            if (builtins.includes(a)) return `${a} bir kabuk yerleşik komutudur (shell builtin)`;
            if (found[a]) return `${a} ${found[a]} konumundadır`;
            return `bash: type: ${a}: bulunamadı`;
        }).join('\n');
    }

    cmdBasename(args) {
        if (args.length === 0) return '<span class="term-error">basename: eksik operand</span>';
        const path = args[0];
        return path.split('/').filter(Boolean).pop() || path;
    }

    cmdDirname(args) {
        if (args.length === 0) return '<span class="term-error">dirname: eksik operand</span>';
        const path = args[0];
        const parts = path.split('/');
        parts.pop();
        return parts.join('/') || (path.startsWith('/') ? '/' : '.');
    }

    cmdLess(args) {
        const files = args.filter(a => !a.startsWith('-'));
        if (files.length === 0) return '<span class="term-info">less: Bu sandbox\'ta less yerine cat kullanabilirsiniz.</span>';
        const node = this.getNode(files[0]);
        if (!node) return `<span class="term-error">less: ${files[0]}: Böyle bir dosya veya dizin yok</span>`;
        return `${node.content || ''}\n<span class="term-info">(END - sandbox: tüm içerik gösterildi)</span>`;
    }

    cmdSed(args) {
        let expression = null, inPlace = false;
        const files = [];
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-i') { inPlace = true; continue; }
            if (args[i] === '-e' && args[i+1]) { expression = args[i+1]; i++; continue; }
            if (args[i] === '__PIPE__') continue;
            if (!expression && !args[i].startsWith('-')) { expression = args[i]; continue; }
            files.push(args[i]);
        }
        if (!expression) return '<span class="term-error">sed: ifade belirtilmedi</span>';

        // Parse s/pattern/replacement/flags
        const match = expression.match(/^s([/|,])(.+?)\1(.*?)\1([gi]*)$/);
        if (!match) {
            // Handle line deletion: Nd
            const delMatch = expression.match(/^(\d+)d$/);
            if (delMatch) {
                const lineNum = parseInt(delMatch[1]);
                const processContent = (c) => c.split('\n').filter((_, i) => i !== lineNum - 1).join('\n');
                if (this._pipeData && files.length === 0) { const r = processContent(this._pipeData); this._pipeData = null; return r; }
                if (files.length === 0) return '<span class="term-error">sed: dosya belirtilmedi</span>';
                return files.map(f => { const n = this.getNode(f); if (!n) return `<span class="term-error">sed: ${f}: Böyle bir dosya yok</span>`; return processContent(n.content || ''); }).join('\n');
            }
            return '<span class="term-error">sed: geçersiz ifade. Örnek: sed "s/eski/yeni/g" dosya.txt</span>';
        }

        const [, , pattern, replacement, flags] = match;
        const regex = new RegExp(pattern, flags || '');
        const processContent = (content) => {
            return content.split('\n').map(line => line.replace(regex, replacement)).join('\n');
        };

        if (this._pipeData && files.length === 0) {
            const result = processContent(this._pipeData);
            this._pipeData = null;
            return result;
        }
        if (files.length === 0) return '<span class="term-error">sed: dosya belirtilmedi</span>';
        return files.map(f => {
            const node = this.getNode(f);
            if (!node) return `<span class="term-error">sed: ${f}: Böyle bir dosya veya dizin yok</span>`;
            const result = processContent(node.content || '');
            if (inPlace) { node.content = result; node.size = result.length; return ''; }
            return result;
        }).join('\n');
    }

    cmdChown(args) {
        if (args.length < 2) return '<span class="term-error">chown: eksik operand. Kullanım: chown kullanıcı:grup dosya</span>';
        const ownership = args[0];
        const filePath = this.resolvePath(args[1]);
        const node = this.fs[filePath];
        if (!node) return `<span class="term-error">chown: '${args[1]}' erişilemiyor: Böyle bir dosya veya dizin yok</span>`;
        const parts = ownership.split(':');
        if (parts[0]) node.owner = parts[0];
        if (parts[1]) node.group = parts[1];
        return '';
    }

    getDisplayPath() {
        if (this.cwd === this.env.HOME) return '~';
        if (this.cwd.startsWith(this.env.HOME)) return '~' + this.cwd.slice(this.env.HOME.length);
        return this.cwd;
    }

    getPreviousCommand() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            return this.history[this.historyIndex];
        }
        return null;
    }

    getNextCommand() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            return this.history[this.historyIndex];
        }
        this.historyIndex = this.history.length;
        return '';
    }

    tabComplete(partial) {
        if (!partial) return [];
        
        const parts = partial.split(/\s+/);
        const lastPart = parts[parts.length - 1];
        
        // If it's the first word, complete commands
        if (parts.length === 1) {
            const cmds = ['ls', 'cd', 'pwd', 'cat', 'echo', 'mkdir', 'rmdir', 'touch', 'rm', 'cp', 'mv',
                'head', 'tail', 'wc', 'grep', 'find', 'chmod', 'chown', 'man', 'which', 'type', 'whoami', 'hostname',
                'date', 'cal', 'clear', 'env', 'export', 'history', 'file', 'stat', 'tree', 'uname',
                'uptime', 'df', 'du', 'free', 'ps', 'sort', 'uniq', 'cut', 'tr', 'sed', 'seq',
                'less', 'more', 'ln', 'tee', 'basename', 'dirname', 'help', 'cowsay', 'id'];
            return cmds.filter(c => c.startsWith(lastPart));
        }
        
        // Complete file/directory names
        let dir = this.cwd;
        let prefix = lastPart;
        
        if (lastPart.includes('/')) {
            const lastSlash = lastPart.lastIndexOf('/');
            dir = this.resolvePath(lastPart.substring(0, lastSlash + 1));
            prefix = lastPart.substring(lastSlash + 1);
        }
        
        const node = this.fs[dir];
        if (!node || node.type !== 'dir') return [];
        
        return (node.children || []).filter(c => c.startsWith(prefix));
    }
}

// Global terminal instance
let terminal = new LinuxTerminal();

function initTerminal() {
    const input = document.getElementById('terminalInput');
    const output = document.getElementById('terminalOutput');
    const promptPath = document.getElementById('promptPath');
    
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const cmd = input.value;
            
            // Echo the command
            const promptHtml = `<span class="prompt-user">${terminal.env.USER}</span>@<span class="prompt-host">${terminal.env.HOSTNAME}</span>:<span class="prompt-path">${terminal.getDisplayPath()}</span>$ `;
            output.innerHTML += `\n<span class="term-prompt-echo">${promptHtml}</span>${escapeHtml(cmd)}`;
            
            // Execute
            const result = terminal.execute(cmd);
            
            if (result === '__CLEAR__') {
                output.innerHTML = '';
            } else if (result) {
                output.innerHTML += '\n' + result;
            }
            
            // Update prompt path
            promptPath.textContent = terminal.getDisplayPath();
            
            // Clear input and scroll
            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = terminal.getPreviousCommand();
            if (prev !== null) input.value = prev;
        }
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            input.value = terminal.getNextCommand();
        }
        else if (e.key === 'Tab') {
            e.preventDefault();
            const completions = terminal.tabComplete(input.value);
            if (completions.length === 1) {
                const parts = input.value.split(/\s+/);
                parts[parts.length - 1] = parts.length === 1 ? completions[0] : 
                    (parts[parts.length - 1].includes('/') ? 
                        parts[parts.length - 1].substring(0, parts[parts.length - 1].lastIndexOf('/') + 1) + completions[0] : 
                        completions[0]);
                input.value = parts.join(' ');
            } else if (completions.length > 1) {
                output.innerHTML += '\n' + completions.join('  ');
                output.scrollTop = output.scrollHeight;
            }
        }
        else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            output.innerHTML = '';
        }
    });
    
    // Click terminal body to focus input
    document.getElementById('terminalBody').addEventListener('click', () => input.focus());
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function clearTerminal() {
    document.getElementById('terminalOutput').innerHTML = '';
    document.getElementById('terminalInput').focus();
}

function toggleTerminal() {
    const term = document.getElementById('floatingTerminal');
    const fab = document.getElementById('terminalFab');
    term.classList.toggle('open');
    fab.classList.toggle('hidden', term.classList.contains('open'));
    if (term.classList.contains('open')) {
        document.getElementById('terminalInput').focus();
    }
}

function toggleTerminalSize() {
    const term = document.getElementById('floatingTerminal');
    term.classList.toggle('expanded');
    document.getElementById('termResizeBtn').textContent = term.classList.contains('expanded') ? '⬇️' : '⬆️';
}

// Run command from lesson (try button)
function runInTerminal(cmd) {
    const term = document.getElementById('floatingTerminal');
    if (!term.classList.contains('open')) toggleTerminal();
    
    const input = document.getElementById('terminalInput');
    input.value = cmd;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
}
