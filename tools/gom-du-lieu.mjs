#!/usr/bin/env node
// ============================================================================
// tools/gom-du-lieu.mjs — Gom dữ liệu rải rác về data/*.json  (chạy một lần)
//
// Nguồn:
//   data.js                      starsData (14 sao) · palacesData (8) · quiz (5)
//   chinhtinh-chucnang.html      starsData (14 sao) · palacesData (12 cung)
//   note/HoaKhi.txt              hoá khí từng sao
//   note/dienmao-phongthai.txt   diện mạo, phong thái
//   note/conguyetdongluong.txt   âm dương, đẩu tinh, hoá khí mở rộng
//   note/luchai.txt              quan hệ lục hại / nhị hợp / tam hợp
//
// Giữ lại để truy nguồn: mỗi trường trong data/ đến từ đâu đều đọc được ở đây.
//
// LƯU Ý: đây là script di trú CHẠY MỘT LẦN. data.js đã bị xoá sau khi gom, nên
// muốn chạy lại phải khôi phục nguồn cũ trước:
//     git show <commit-truoc-GD2>:data.js > data.js && node tools/gom-du-lieu.mjs && rm data.js
// Từ giờ sửa dữ liệu là sửa thẳng data/*.json, không sửa qua script này.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';

const R = (f) => readFileSync(f, 'utf8');
const KHONG_DAU = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim().replace(/\s+/g, '-');

// ---- 1. data.js -----------------------------------------------------------
const ctxA = {};
new Function('c', R('data.js') + ';c.S=starsData;c.P=palacesData;c.Q=quizQuestions;')(ctxA);

// ---- 2. chinhtinh-chucnang.html (object literal lồng trong Alpine) --------
const js = [...R('chinh' + 'tinh-chucnang.html').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('');
function layObject(ten) {
  const i = js.indexOf(ten + ': {'), a = js.indexOf('{', i);
  let d = 0, b = a;
  for (let k = a; k < js.length; k++) { if (js[k] === '{') d++; if (js[k] === '}' && !--d) { b = k; break; } }
  return new Function('return (' + js.slice(a, b + 1) + ')')();
}
const saoB = layObject('starsData'), cungB = layObject('palacesData');
const theoTen = {}; for (const v of Object.values(saoB)) theoTen[v.name] = v;

// ---- 3. note/ -------------------------------------------------------------
const hoaKhi = {};
for (const m of R('note/HoaKhi.txt').matchAll(/^\+\s*([^:]+):\s*(.+)$/gm)) hoaKhi[m[1].trim()] = m[2].trim();

const khoiNote = (file) => {
  const out = {}; let ten = null;
  for (const d of R(file).split('\n')) {
    const h = d.match(/^([A-ZÀ-Ỹ][^:\-]{2,20}):\s*$/);
    if (h) { ten = h[1].trim(); out[ten] = []; continue; }
    const b = d.match(/^-\s*(.+?)\s*$/);
    if (b && ten && b[1]) out[ten].push(b[1]);
  }
  return out;
};
const dienMao = khoiNote('note/dienmao-phongthai.txt');
const cnDl    = khoiNote('note/conguyetdongluong.txt');

const quanHe = [];
for (const kh of R('note/luchai.txt').split(/\n\s*\n/)) {
  const m = kh.match(/^(\S+(?:\s\S+)?)\s+(lục hại|nhị hợp|tam hợp)\s+(\S+(?:\s\S+)?)/);
  if (!m) continue;
  const y = [...kh.matchAll(/^-\s*(.+?)\s*$/gm)].map(x => x[1]).filter(Boolean);
  if (y.length) quanHe.push({ sao: m[1], quanHe: m[2], voiSao: m[3], luan: y });
}

// ---- 4. gộp thành data/sao.json -------------------------------------------
const CUNG_ID = {
  'Mệnh':'menh','Phụ Mẫu':'phu-mau','Phúc Đức':'phuc-duc','Điền Trạch':'dien-trach',
  'Quan Lộc':'quan-loc','Nô Bộc':'no-boc','Thiên Di':'thien-di','Tật Ách':'tat-ach',
  'Tài Bạch':'tai-bach','Tử Tức':'tu-tuc','Phu Thê':'phu-the','Huynh Đệ':'huynh-de',
};
const sangCungId = (arr) => (arr || []).flatMap(t => {
  const hits = Object.keys(CUNG_ID).filter(k => t.includes(k));
  return hits.length ? hits.map(k => CUNG_ID[k]) : [];
});
/** Mục nào trong bestPositions/worstPositions không nêu tên cung nào thì đó là
    điều kiện (vd "Đồng cung Không vong"), tách riêng chứ không ép thành cung. */
const layDieuKien = (arr) => (arr || []).filter(t =>
  !Object.keys(CUNG_ID).some(k => t.includes(k)));

const sao = ctxA.S.map(a => {
  const b = theoTen[a.name] || {};
  const [amDuong, nguHanh] = a.element.split(' ');
  const cn = cnDl[a.name] || [];
  const dauTinh = (cn.find(x => /Đẩu Tinh/i.test(x)) || '').match(/(Nam|Bắc|Trung) Đẩu Tinh/)?.[0] || null;
  return {
    id: a.id, ten: a.name, loai: 'chinh-tinh',
    nguHanh, amDuong, dauTinh,
    bo: a.group, vongSao: b.group || null, loaiTinh: b.type || a.essence,
    hoaKhi: hoaKhi[a.name] || null,
    tomTat: a.summary,
    moTa: b.desc || null,
    cungTot: sangCungId(a.bestPositions),
    cungXau: sangCungId(a.worstPositions),
    kyGap: layDieuKien(a.worstPositions),
    luanCungTot: a.bestDetail,
    luanCungXau: a.worstDetail,
    tuKhoa: a.keywords,
    dienMao: dienMao[a.name] || [],
    ghiChu: cn.filter(x => !/Đẩu Tinh/i.test(x)),
  };
});

// ---- 5. data/cung.json (bản 12 cung đầy đủ của chinhtinh-chucnang) --------
// Nguồn chinhtinh-chucnang bỏ trống opposite của Quan Lộc; cặp xung chiếu đúng
// là Quan Lộc <-> Phu Thê. Vá tại đây để 12 cung thành đủ 6 cặp đối nhau.
const VA_XUNG_CHIEU = { 'quan-loc': 'phu-the' };
const cung = Object.entries(cungB).map(([k, v]) => {
  const ten = v.name.replace(/^Cung\s+/, '');
  return { id: CUNG_ID[ten] || KHONG_DAU(ten), ten, nguHanh: v.element,
           cungXungChieu: CUNG_ID[v.opposite] || VA_XUNG_CHIEU[CUNG_ID[ten]] || null, moTa: v.description, phamVi: v.domains || [] };
});

// ---- 6. ghi ---------------------------------------------------------------
const ghi = (f, o) => { writeFileSync('data/' + f, JSON.stringify(o, null, 2) + '\n'); 
  console.log(`  data/${f.padEnd(18)} ${JSON.stringify(o).length.toLocaleString('vi')} byte`); };
ghi('sao.json', sao);
ghi('cung.json', cung);
ghi('quan-he-sao.json', quanHe);
ghi('quiz.json', ctxA.Q.map(q => ({ hoi: q.q, luaChon: q.options, dapAn: q.answer, giaiThich: q.explain })));
