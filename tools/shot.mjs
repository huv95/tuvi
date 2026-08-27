#!/usr/bin/env node
// ============================================================================
// tools/shot.mjs — Chụp ảnh một trang của project bằng Chrome/Edge của Windows
//
//   node tools/shot.mjs ansaotudong.html
//   node tools/shot.mjs ansaotudong.html --out lasoi.png --size 1400x1200
//   node tools/shot.mjs index.html --dom            # in DOM sau khi JS chạy
//
// Chạy được nhờ WSL2: Windows thấy localhost của WSL, còn WSL đọc được ổ C:
// qua /mnt/c. Không cài gì thêm — dùng luôn browser đã có trên Windows.
// ============================================================================
import { spawn, execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

const BROWSERS = [
  '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
  '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/mnt/c/Program Files/Microsoft/Edge/Application/msedge.exe',
];

const MIME = {
  '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript',
  '.json':'application/json', '.css':'text/css', '.png':'image/png',
  '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.txt':'text/plain',
};

// ---- đọc tham số ----------------------------------------------------------
const argv = process.argv.slice(2);
const page = argv.find(a => !a.startsWith('--'));
const flag = (n, d) => { const i = argv.indexOf('--' + n); return i < 0 ? d : argv[i + 1]; };
const domOnly = argv.includes('--dom');

if (!page) {
  console.error('Dùng: node tools/shot.mjs <trang.html> [--out ten.png] [--size RxC] [--dom]');
  process.exit(1);
}
if (!existsSync(join(ROOT, page))) { console.error('Không thấy file: ' + page); process.exit(1); }

const [w, h] = (flag('size', '1400x1400')).split('x').map(Number);
const outName = flag('out', page.replace(/\.html$/, '') + '.png');
const outPath = join(ROOT, 'tools', 'shots', outName);

const browser = BROWSERS.find(existsSync);
if (!browser) {
  console.error('Không tìm thấy Chrome hoặc Edge trong /mnt/c.');
  console.error('Môi trường này cần WSL2 với Windows có sẵn một trong hai browser đó.');
  process.exit(1);
}

// ---- server tĩnh tạm thời -------------------------------------------------
const server = createServer(async (req, res) => {
  const path = join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!path.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type': MIME[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404).end('404'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://localhost:${server.address().port}/${page}`;

// ---- gọi browser ----------------------------------------------------------
const winTmp = execSync('cmd.exe /c "echo %TEMP%"', { cwd: '/mnt/c' }).toString().trim();
const winShot = `${winTmp}\\__tuvi_shot.png`;
const wslShot = '/mnt/c' + winShot.slice(2).replace(/\\/g, '/');

// --virtual-time-budget: chờ trang tải xong (kể cả font ngoài) rồi chốt, thay
// vì để Chrome giữ kết nối mở mãi.
const args = ['--headless', '--disable-gpu', '--hide-scrollbars',
              '--virtual-time-budget=8000', '--no-sandbox', `--window-size=${w},${h}`];
args.push(domOnly ? '--dump-dom' : `--screenshot=${winShot}`, url);

const out = await new Promise((ok, no) => {
  const p = spawn(browser, args, { stdio: ['ignore', 'pipe', 'ignore'] });
  let buf = '';
  p.stdout.on('data', d => buf += d);
  p.on('close', () => ok(buf));
  p.on('error', no);
  setTimeout(() => { p.kill(); no(new Error('browser quá 90 giây không phản hồi')); }, 90_000);
});
server.close();

if (domOnly) { process.stdout.write(out); process.exit(0); }

if (!existsSync(wslShot)) { console.error('Browser không tạo được ảnh.'); process.exit(1); }
await mkdir(join(ROOT, 'tools', 'shots'), { recursive: true });
await copyFile(wslShot, outPath);
const kb = Math.round((await readFile(outPath)).length / 1024);
console.log(`${outPath.replace(ROOT + '/', '')}  ${w}×${h}  ${kb} KB`);
// Chrome đôi khi còn giữ kết nối mạng khiến Node không tự thoát.
process.exit(0);
