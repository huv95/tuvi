#!/usr/bin/env node
// ============================================================================
// tools/gom-note-cnl.mjs — Bồi thêm dữ kiện từ note/conguyetdongluong.txt
// vào data/sao.json. File note viết dạng markdown, mỗi sao một mục:
//   *   **Thiên Cơ (Cơ):**
//       *   *Ngũ hành:* **Âm Mộc**.
//       *   *Hóa khí:* **Thiện**.
// Chạy được nhiều lần, luôn cho cùng kết quả.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';

const note = readFileSync('note/conguyetdongluong.txt', 'utf8');
const sao  = JSON.parse(readFileSync('data/sao.json', 'utf8'));
const tenSao = sao.map(s => s.ten);

const dam = (t) => (t.match(/\*\*(.+?)\*\*/g) || []).map(x => x.slice(2, -2));
const sach = (t) => t.replace(/\*\*|\*/g, '').replace(/\s+/g, ' ').trim().replace(/\.$/, '');

// Tách theo từng mục sao: "*   **Tên Sao ...:**"
const muc = {};
let hienTai = null;
for (const dong of note.split('\n')) {
  const dau = dong.match(/^\*\s+\*\*([^*(:]+?)\s*(?:\([^)]*\))?:?\*\*/);
  if (dau) {
    const ten = tenSao.find(t => dau[1].trim().startsWith(t));
    hienTai = ten || null;
    if (ten) (muc[ten] ||= []);
    continue;
  }
  const y = dong.match(/^\s+\*\s+\*([^*]+)\*[:：]?\s*(.*)$/);
  if (y && hienTai) muc[hienTai].push([y[1].replace(/:$/, '').trim(), y[2]]);
}

const HANH = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
let boi = 0, lech = [];
for (const s of sao) {
  const y = muc[s.ten];
  if (!y || !y.length) continue;
  const lay = (k) => (y.find(([n]) => n.toLowerCase().startsWith(k)) || [])[1];

  const nh = lay('ngũ hành');
  if (nh) {
    const d = dam(nh)[0] || '';
    const hanh = HANH.find(h => d.includes(h));
    const am = d.includes('Âm') ? 'Âm' : d.includes('Dương') ? 'Dương' : null;
    if (hanh && hanh !== s.nguHanh) {
      // Không âm thầm ghi đè: giữ giá trị đang dùng (lib/ansao.js và 11 lá số
      // chuẩn đều theo nó) và ghi lại bất đồng để người đọc tự quyết.
      s.nguHanhBatDong = `Tài liệu Cơ Nguyệt Đồng Lương ghi ${hanh}`;
      lech.push(`${s.ten}: data=${s.nguHanh} note=${hanh}`);
    }
    if (am && am !== s.amDuong)     lech.push(`${s.ten}: data=${s.amDuong} note=${am}`);
    const dt = nh.match(/(Nam|Bắc|Trung) Đẩu/);
    if (dt && !s.dauTinh) s.dauTinh = dt[0] + ' Tinh';
  }
  const hk = lay('hóa khí');
  if (hk && !s.hoaKhi) s.hoaKhi = sach(hk);

  const bt = lay('hình ảnh');
  if (bt) s.bieuTuong = dam(bt);

  const dm = lay('diện mạo');
  if (dm && !s.dienMao.length) s.dienMao = [sach(dm)];

  const pt = lay('phong thái');
  if (pt) s.phongThai = sach(pt);

  boi++;
}

writeFileSync('data/sao.json', JSON.stringify(sao, null, 2) + '\n');
console.log(`  bồi thêm dữ kiện cho ${boi} sao`);
if (lech.length) {
  console.log('  ⚠ note ghi khác data — cần người quyết:');
  for (const l of [...new Set(lech)]) console.log('     ', l);
}
