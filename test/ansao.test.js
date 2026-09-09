#!/usr/bin/env node
// ============================================================================
// Bộ kiểm thử lib/lich.js và lib/ansao.js
//
//   npm test                         chạy toàn bộ
//   node test/ansao.test.js -v       in chi tiết từng mục
//
// Thoát mã 1 nếu có lỗi, để dùng được trong CI / pre-commit hook.
//
// Gồm 6 tầng:
//   A. Đổi lịch      - đối chiếu mốc lịch VN + tự nghịch đảo trên 400.000 ngày
//   B. Lá số mẫu     - 11 lá số chuẩn từ tuvivietnam.vn (test/lasomau.js)
//   C. Quy tắc an sao- bảng tra và khẩu quyết
//   D. Bất biến      - tính chất phải đúng với MỌI lá số
//   E. Dữ liệu       - cấu trúc data/*.json và tính toàn vẹn tham chiếu
//   F. Hạn           - 4 loại hạn: đại hạn, lưu niên đại hạn, tiểu hạn, nguyệt hạn
// ============================================================================
import { CAN, CHI, jdFromDate, jdToSolar,
         convertSolarToLunar, convertLunarToSolar,
         getCanChiYear, getCanChiDay, getCanChiHour } from '../lib/lich.js';
import { generateTuViChart, viTriDauQuan } from '../lib/ansao.js';
import LA_SO_MAU from './lasomau.js';
import * as repo from '../lib/repo.js';

const VERBOSE = process.argv.includes('-v');

// ---- Khung test ------------------------------------------------------------
let pass = 0, fail = 0;
const fails = [];
function ck(name, ok, detail) {
  if (ok) { pass++; if (VERBOSE) console.log('  OK   ' + name); }
  else { fail++; fails.push(name + (detail ? ' — ' + detail : '')); console.log('  ❌   ' + name + (detail ? ' — ' + detail : '')); }
}
const head = t => console.log('\n' + t);
const G = chi => (CHI.indexOf(chi) - 2 + 12) % 12;   // chi -> chỉ số lưới
const nm = g => CHI[(((g % 12) + 12) % 12 + 2) % 12]; // chỉ số lưới -> chi

// ============================== A. ĐỔI LỊCH =================================
head('A. Đổi lịch Dương - Âm');
// Mốc lịch Việt Nam đã biết (Tết, ngày nhuận, sự kiện lịch sử)
[[22,1,2023,'1/1/2023'],   [20,2,2023,'1/2/2023'],  [22,3,2023,'1/2N/2023'], [20,4,2023,'1/3/2023'],
 [10,2,2024,'1/1/2024'],   [29,1,2025,'1/1/2025'],  [19,2,2015,'1/1/2015'],  [17,2,2026,'1/1/2026'],
 [23,5,2020,'1/4N/2020'],  [22,6,2020,'2/5/2020'],  [1,1,2024,'20/11/2023'], [6,6,1982,'15/4N/1982'],
 [17,3,1995,'17/2/1995'],  [2,9,1945,'26/7/1945'],  [7,5,1954,'5/4/1954'],   [1,1,2000,'25/11/1999'],
].forEach(([d,m,y,exp]) => {
  const r = convertSolarToLunar(d, m, y);
  const got = `${r.day}/${r.month}${r.isLeap ? 'N' : ''}/${r.year}`;
  ck(`${d}/${m}/${y} -> ${exp}`, got === exp, got !== exp ? `ra ${got}` : '');
});
{ let bad = 0;
  for (let jd = 2200000; jd < 2600000; jd++) { const s = jdToSolar(jd); if (jdFromDate(s.day, s.month, s.year) !== jd) bad++; }
  ck('jdToSolar ↔ jdFromDate nghịch đảo trên 400.000 ngày (1550-2645)', bad === 0, `${bad} ngày sai`); }
{ let bad = 0, leaps = 0;
  for (let jd = 2415021; jd < 2488070; jd++) {           // 1900 - 2100
    const s = jdToSolar(jd), l = convertSolarToLunar(s.day, s.month, s.year);
    if (l.isLeap) leaps++;
    if (convertLunarToSolar(l.day, l.month, l.year, l.isLeap).jd !== jd) bad++;
  }
  ck(`Round-trip Dương→Âm→Dương 73.049 ngày (1900-2100), ${leaps} ngày thuộc tháng nhuận`, bad === 0, `${bad} ngày sai`); }
// Giờ Tý trải 23:00-00:59; Sửu 01:00-02:59; ...
{ const want = ['Tý','Sửu','Sửu','Dần','Dần','Mão','Mão','Thìn','Thìn','Tỵ','Tỵ','Ngọ','Ngọ',
                'Mùi','Mùi','Thân','Thân','Dậu','Dậu','Tuất','Tuất','Hợi','Hợi','Tý'];
  let bad = 0;
  for (let h = 0; h < 24; h++) if (getCanChiHour(h, 0).chi !== want[h]) bad++;
  ck('Chi giờ sinh đúng cả 24 giờ (Tý = 23:00-00:59)', bad === 0, `${bad} giờ sai`); }
// Trụ ngày: neo bằng 2 mốc tra cứu được, phần còn lại suy ra bằng chu kỳ 60
[[1,1,2000,'Mậu Ngọ'], [10,2,2024,'Giáp Thìn']].forEach(([d,m,y,exp]) => {
  const c = getCanChiDay(jdFromDate(d, m, y));
  ck(`Trụ ngày ${d}/${m}/${y} = ${exp}`, c.can + ' ' + c.chi === exp, `ra ${c.can} ${c.chi}`);
});

// ============================== B. LÁ SỐ MẪU ================================
head('B. 11 lá số chuẩn từ tuvivietnam.vn');
const HOA = { ' [H.Lộc]':'Lộc', ' [H.Quyền]':'Quyền', ' [H.Khoa]':'Khoa', ' [H.Kỵ]':'Kỵ' };
const norm = o => Object.keys(o).sort().map(k => k + '=' + o[k]).join(',');
for (const C of LA_SO_MAU) {
  const c = generateTuViChart(C.birth), u = c.userInfo, I = C.info;
  const by = {}; c.grid.forEach(g => by[g.chiName] = g);
  const before = fail;
  const sub = (k, ok, d) => ck(`${C.label} · ${k}`, ok, d);
  sub('âm lịch', u.lunarStr === I.lunar, `ra ${u.lunarStr}, mẫu ${I.lunar}`);
  sub('tứ trụ Can Chi', u.canChiStr === I.cc, `ra ${u.canChiStr}`);
  sub('Nạp Âm & Cục', u.napAm === I.nap && u.cuc.name === I.cuc, `ra ${u.napAm}·${u.cuc.name}`);
  sub('Mệnh - Cục tương sinh', u.tuongSinhText.startsWith(I.ts), `ra ${u.tuongSinhText}`);
  sub('âm dương nam nữ & thuận nghịch lý', u.amDuongNamNu === I.adnn && u.amDuongThuanLy === I.thuanLy,
      `ra ${u.amDuongNamNu}/${u.amDuongThuanLy}`);
  sub('Chủ Mệnh & Chủ Thân', u.menhChu === I.mc && u.thanChu === I.tc, `ra ${u.menhChu}/${u.thanChu}`);
  sub('Thân cư cung', c.grid.find(g => g.isThan).palaceName === I.than,
      `ra ${c.grid.find(g => g.isThan).palaceName}`);
  const acc = {};
  for (const [chi, r] of Object.entries(C.P)) {
    const g = by[chi], put = (k, ok, d) => { (acc[k] = acc[k] || []).push([ok, chi, d]); };
    put('tên 12 cung', g.palaceName === r.cung, `${chi}: ${g.palaceName}≠${r.cung}`);
    put('đại hạn', g.daiHan === r.dh, `${chi}: ${g.daiHan}≠${r.dh}`);
    put('tiểu hạn', g.tieuHan === r.th, `${chi}: ${g.tieuHan}≠${r.th}`);
    put('vòng Trường Sinh', g.trangSinh === r.ts, `${chi}: ${g.trangSinh}≠${r.ts}`);
    put('chính tinh', JSON.stringify(g.chinhTinh.map(s => s.name)) === JSON.stringify(r.chinh),
        `${chi}: [${g.chinhTinh.map(s => s.name)}]≠[${r.chinh}]`);
    const h = {}; [...g.chinhTinh, ...g.phuTinhTot, ...g.phuTinhXau].forEach(s => { if (s.tuHoa) h[s.name] = HOA[s.tuHoa]; });
    put('Tứ Hóa', norm(h) === norm(r.hoa || {}), `${chi}: ${norm(h)}≠${norm(r.hoa || {})}`);
    // tuvivietnam.vn vẽ Tuần/Triệt riêng (viền chéo trên ô), không liệt trong
    // danh sách phụ tinh — nên loại 2 sao này khỏi phép so khớp ở đây; có bộ
    // test riêng theo bảng tra ở mục C.
    const got = new Set([...g.phuTinhTot, ...g.phuTinhXau].map(s => s.name).filter(n => n !== 'Tuần' && n !== 'Triệt'));
    const miss = r.phu.filter(n => !got.has(n)), ex = [...got].filter(n => !r.phu.includes(n));
    put('phụ tinh', !miss.length && !ex.length,
        `${chi}:${miss.length ? ' thiếu ' + miss.join(',') : ''}${ex.length ? ' thừa ' + ex.join(',') : ''}`);
  }
  for (const [k, rows] of Object.entries(acc)) {
    const bad = rows.filter(r => !r[0]);
    sub(`${k} (12 cung)`, bad.length === 0, bad.map(r => r[2]).join(' | '));
  }
  if (!VERBOSE && fail === before) console.log(`  OK   ${C.label} — khớp hoàn toàn`);
}

// ============================ C. QUY TẮC AN SAO =============================
head('C. Quy tắc an sao theo bảng tra');
const chartOf = o => generateTuViChart(Object.assign(
  { name:'t', gender:1, isSolar:true, day:20, month:6, year:1990, hour:10, minute:0, viewYear:2026, isLeapMonth:false }, o));
const at = (grid, star) => nm(grid.findIndex(c => [...c.chinhTinh, ...c.phuTinhTot, ...c.phuTinhXau].some(s => s.name === star)));
const atAll = (grid, star) => grid.filter(c => [...c.chinhTinh, ...c.phuTinhTot, ...c.phuTinhXau].some(s => s.name === star))
  .map(c => c.chiName).sort();
const yearOfCan = can => 1984 + CAN.indexOf(can);   // 1984 = Giáp Tý

// Giáp Mậu Ngưu Dương | Ất Kỷ Thử Hầu | Bính Đinh Trư Kê | Canh Tân Hổ Mã | Nhâm Quý Thỏ Xà
{ const T = { 'Giáp':['Sửu','Mùi'], 'Ất':['Tý','Thân'], 'Bính':['Hợi','Dậu'], 'Đinh':['Hợi','Dậu'],
              'Mậu':['Sửu','Mùi'],  'Kỷ':['Tý','Thân'], 'Canh':['Dần','Ngọ'], 'Tân':['Dần','Ngọ'],
              'Nhâm':['Mão','Tỵ'],  'Quý':['Mão','Tỵ'] };
  let bad = [];
  for (const can of CAN) { const g = chartOf({ year: yearOfCan(can) }).grid;
    if (at(g,'Thiên Khôi') !== T[can][0] || at(g,'Thiên Việt') !== T[can][1])
      bad.push(`${can}:${at(g,'Thiên Khôi')}/${at(g,'Thiên Việt')}≠${T[can].join('/')}`); }
  ck('Thiên Khôi / Thiên Việt — 10 can', bad.length === 0, bad.join(' ')); }
// Lộc Tồn theo can; Kình Dương liền sau, Đà La liền trước
{ const T = { 'Giáp':'Dần','Ất':'Mão','Bính':'Tỵ','Đinh':'Ngọ','Mậu':'Tỵ','Kỷ':'Ngọ','Canh':'Thân','Tân':'Dậu','Nhâm':'Hợi','Quý':'Tý' };
  let bad = [];
  for (const can of CAN) { const g = chartOf({ year: yearOfCan(can) }).grid;
    const l = G(at(g,'Lộc Tồn'));
    if (at(g,'Lộc Tồn') !== T[can] || G(at(g,'Kình Dương')) !== (l+1)%12 || G(at(g,'Đà La')) !== (l+11)%12) bad.push(can); }
  ck('Lộc Tồn / Kình Dương / Đà La — 10 can', bad.length === 0, bad.join(' ')); }
// Thiên Mã theo tam hợp chi năm
{ const T = { 'Thân':'Dần','Tý':'Dần','Thìn':'Dần','Tỵ':'Hợi','Dậu':'Hợi','Sửu':'Hợi',
              'Dần':'Thân','Ngọ':'Thân','Tuất':'Thân','Hợi':'Tỵ','Mão':'Tỵ','Mùi':'Tỵ' };
  let bad = [];
  for (let y = 1984; y < 1996; y++) { const chi = CHI[(y-4)%12];
    if (at(chartOf({ year: y }).grid, 'Thiên Mã') !== T[chi]) bad.push(chi); }
  ck('Thiên Mã — 12 chi', bad.length === 0, bad.join(' ')); }
// Vòng Thái Tuế khởi tại cung có chi trùng chi năm sinh
{ let bad = [];
  for (let y = 1984; y < 1996; y++) { const chi = CHI[(y-4)%12], g = chartOf({ year: y }).grid;
    if (at(g,'Thái Tuế') !== chi) bad.push(chi);
    if (G(at(g,'Tuế Phá')) !== (G(chi)+6)%12) bad.push(chi + '/TuếPhá'); }
  ck('Vòng Thái Tuế khởi đúng cung, Tuế Phá xung chiếu', bad.length === 0, bad.join(' ')); }
// Tứ Hóa - 10 can
{ const T = { 'Giáp':['Liêm Trinh','Phá Quân','Vũ Khúc','Thái Dương'], 'Ất':['Thiên Cơ','Thiên Lương','Tử Vi','Thái Âm'],
              'Bính':['Thiên Đồng','Thiên Cơ','Văn Xương','Liêm Trinh'], 'Đinh':['Thái Âm','Thiên Đồng','Thiên Cơ','Cự Môn'],
              'Mậu':['Tham Lang','Thái Âm','Hữu Bật','Thiên Cơ'], 'Kỷ':['Vũ Khúc','Tham Lang','Thiên Lương','Văn Khúc'],
              'Canh':['Thái Dương','Vũ Khúc','Thái Âm','Thiên Đồng'], 'Tân':['Cự Môn','Thái Dương','Văn Khúc','Văn Xương'],
              'Nhâm':['Thiên Lương','Tử Vi','Tả Phụ','Vũ Khúc'], 'Quý':['Phá Quân','Cự Môn','Thái Âm','Tham Lang'] };
  const SUF = [' [H.Lộc]',' [H.Quyền]',' [H.Khoa]',' [H.Kỵ]'];
  let bad = [];
  for (const can of CAN) { const g = chartOf({ year: yearOfCan(can) }).grid;
    T[can].forEach((n, i) => { if (!g.some(c => [...c.chinhTinh,...c.phuTinhTot,...c.phuTinhXau]
        .some(s => s.name === n && s.tuHoa === SUF[i]))) bad.push(`${can}/${n}`); }); }
  ck('Tứ Hóa (Lộc-Quyền-Khoa-Kỵ) — 10 can, bám cả chính tinh lẫn phụ tinh', bad.length === 0, bad.join(' ')); }
// Vòng Trường Sinh khởi theo Cục
{ const T = { 'Thủy Nhị Cục':'Thân', 'Mộc Tam Cục':'Hợi', 'Kim Tứ Cục':'Tỵ', 'Thổ Ngũ Cục':'Thân', 'Hỏa Lục Cục':'Dần' };
  const seen = {}, bad = [];
  for (let i = 0; i < 400; i++) {
    const c = chartOf({ year:1950+i%70, month:1+i%12, day:1+i%28, hour:i%24, gender:1+i%2 });
    const start = c.grid.find(g => g.trangSinh === 'Trường Sinh');
    seen[c.userInfo.cuc.name] = true;
    if (!start || start.chiName !== T[c.userInfo.cuc.name]) bad.push(c.userInfo.cuc.name);
  }
  ck(`Vòng Trường Sinh khởi đúng cung cho ${Object.keys(seen).length}/5 cục gặp được`, bad.length === 0, bad.slice(0,3).join(' ')); }
// Triệt cố định theo can: Giáp/Kỷ Thân-Dậu | Ất/Canh Ngọ-Mùi | Bính/Tân Thìn-Tỵ
// | Đinh/Nhâm Dần-Mão | Mậu/Quý Tý-Sửu
{ const T = { 'Giáp':['Thân','Dậu'], 'Kỷ':['Thân','Dậu'], 'Ất':['Ngọ','Mùi'], 'Canh':['Ngọ','Mùi'],
              'Bính':['Thìn','Tỵ'], 'Tân':['Thìn','Tỵ'], 'Đinh':['Dần','Mão'], 'Nhâm':['Dần','Mão'],
              'Mậu':['Tý','Sửu'], 'Quý':['Tý','Sửu'] };
  let bad = [];
  for (const can of CAN) { const g = chartOf({ year: yearOfCan(can) }).grid;
    const got = atAll(g, 'Triệt'), exp = [...T[can]].sort();
    if (JSON.stringify(got) !== JSON.stringify(exp)) bad.push(`${can}:${got.join('/')}≠${exp.join('/')}`); }
  ck('Triệt Không — 10 can', bad.length === 0, bad.join(' ')); }
// Tuần theo tuần Giáp (lục thập hoa giáp): thử năm Giáp của cả 6 nhóm, cách nhau 10 năm
{ const T = { 1984:['Tuất','Hợi'], 1994:['Thân','Dậu'], 2004:['Ngọ','Mùi'],
              2014:['Thìn','Tỵ'], 2024:['Dần','Mão'], 2034:['Tý','Sửu'] };
  let bad = [];
  for (const y of Object.keys(T)) { const g = chartOf({ year: +y }).grid;
    const got = atAll(g, 'Tuần'), exp = [...T[y]].sort();
    if (JSON.stringify(got) !== JSON.stringify(exp)) bad.push(`${y}:${got.join('/')}≠${exp.join('/')}`); }
  ck('Tuần Không — 6 nhóm lục thập hoa giáp', bad.length === 0, bad.join(' ')); }

// ============================== D. BẤT BIẾN =================================
head('D. Bất biến trên 500 lá số sinh ngẫu nhiên (1900-2100)');
{ const errs = { star14:0, dup:0, thanMenh:0, doiXung:0, cung12:0, daiHan:0, ring:0 };
  for (let i = 0; i < 500; i++) {
    const g = chartOf({ year:1900+(i*7)%200, month:1+(i*5)%12, day:1+(i*11)%28, hour:(i*13)%24, gender:1+i%2 }).grid;
    const chinh = g.flatMap(c => c.chinhTinh.map(s => s.name));
    if (chinh.length !== 14) errs.star14++;
    if (new Set(chinh).size !== 14) errs.dup++;
    const menh = g.findIndex(c => c.isMenh), than = g.findIndex(c => c.isThan);
    if ((than - menh + 12) % 12 % 2 !== 0) errs.thanMenh++;               // Thân lệch Mệnh số chẵn cung
    const tv = g.findIndex(c => c.chinhTinh.some(s => s.name === 'Tử Vi'));
    const tp = g.findIndex(c => c.chinhTinh.some(s => s.name === 'Thiên Phủ'));
    if ((tv + tp) % 12 !== 0) errs.doiXung++;                             // đối xứng qua trục Dần-Thân
    if (new Set(g.map(c => c.palaceName)).size !== 12) errs.cung12++;
    if (new Set(g.map(c => c.daiHan)).size !== 12) errs.daiHan++;
    if (new Set(g.map(c => c.trangSinh)).size !== 12) errs.ring++;        // 12 sao Trường Sinh, mỗi cung một
  }
  ck('đủ 14 chính tinh, không trùng lặp', errs.star14 === 0 && errs.dup === 0, JSON.stringify(errs));
  ck('Thân lệch Mệnh số chẵn cung', errs.thanMenh === 0);
  ck('Tử Vi - Thiên Phủ luôn đối xứng qua trục Dần - Thân', errs.doiXung === 0);
  ck('12 cung chức không trùng, 12 mốc đại hạn không trùng', errs.cung12 === 0 && errs.daiHan === 0);
  ck('vòng Trường Sinh phủ đủ 12 cung', errs.ring === 0); }

// =============================== E. DỮ LIỆU =================================
head('E. Cấu trúc và toàn vẹn của data/*.json');
{
  const [sao, cung, nhom, quanHe, quiz] = await Promise.all(
    [repo.getSao(), repo.getCung(), repo.getNhomCung(), repo.getQuanHeSao(), repo.getQuiz()]);

  ck('sao.json có đủ 14 chính tinh', sao.length === 14, `có ${sao.length}`);
  ck('cung.json có đủ 12 cung chức', cung.length === 12, `có ${cung.length}`);
  ck('nhom-cung.json có 8 nhóm tra cứu', nhom.length === 8, `có ${nhom.length}`);

  const BUOC = { sao: ['id','ten','loai','nguHanh','amDuong','bo','loaiTinh','tomTat','cungTot','luanCungTot','luanCungXau','tuKhoa'],
                 cung: ['id','ten','nguHanh','moTa','phamVi'] };
  const thieu = (ds, truong) => ds.flatMap(x => truong.filter(t =>
    x[t] === undefined || x[t] === null || (Array.isArray(x[t]) && !x[t].length) || x[t] === '')
    .map(t => `${x.id}.${t}`));
  ck('mọi sao đủ trường bắt buộc', thieu(sao, BUOC.sao).length === 0, thieu(sao, BUOC.sao).join(' '));
  ck('sao nào không có cung xấu thì phải nêu điều kiện kỵ',
     sao.every(s => s.cungXau.length || s.kyGap.length),
     sao.filter(s => !s.cungXau.length && !s.kyGap.length).map(s => s.id).join(' '));
  ck('mọi cung đủ trường bắt buộc', thieu(cung, BUOC.cung).length === 0, thieu(cung, BUOC.cung).join(' '));

  const idCung = new Set(cung.map(c => c.id));
  const hong = [
    ...sao.flatMap(s => [...s.cungTot, ...s.cungXau].filter(id => !idCung.has(id)).map(id => `${s.id}→${id}`)),
    ...nhom.flatMap(n => n.gomCung.filter(id => !idCung.has(id)).map(id => `${n.id}→${id}`)),
    ...cung.filter(c => c.cungXungChieu && !idCung.has(c.cungXungChieu)).map(c => `${c.id}→${c.cungXungChieu}`),
  ];
  ck('mọi id cung được tham chiếu đều tồn tại', hong.length === 0, hong.join(' '));
  ck('id sao và id cung không trùng lặp',
     new Set(sao.map(s => s.id)).size === 14 && idCung.size === 12);

  const HANH = new Set(['Kim','Mộc','Thủy','Hỏa','Thổ']);
  const saiHanh = [...sao, ...cung].filter(x => !HANH.has(x.nguHanh)).map(x => x.id);
  ck('ngũ hành chỉ nhận 5 giá trị hợp lệ', saiHanh.length === 0, saiHanh.join(' '));
  ck('âm dương chỉ nhận Âm hoặc Dương',
     sao.every(s => s.amDuong === 'Âm' || s.amDuong === 'Dương'));

  ck('12 cung xung chiếu thành 6 cặp đối nhau',
     cung.every(c => cung.find(x => x.id === c.cungXungChieu)?.cungXungChieu === c.id));
  // 8 nhóm là bản tra cứu rút gọn: cố ý bỏ Nô Bộc và Thiên Di, gộp Lục Thân.
  ck('8 nhóm tra cứu không gộp trùng cung nào',
     new Set(nhom.flatMap(n => n.gomCung)).size === nhom.reduce((a, n) => a + n.gomCung.length, 0));

  ck('dữ liệu không lẫn class CSS',
     !/\b(text|bg|border)-(slate|amber|rose|emerald|sky|yellow)-\d/.test(JSON.stringify(sao) + JSON.stringify(cung)));

  ck('quiz có đáp án nằm trong danh sách lựa chọn',
     quiz.every(q => q.dapAn >= 0 && q.dapAn < q.luaChon.length), `${quiz.length} câu`);

  const tenSao = new Set(sao.map(s => s.ten));
  const laSao = quanHe.flatMap(q => [q.sao, q.voiSao].filter(t => !tenSao.has(t)));
  ck('quan-he-sao trỏ đúng tên sao', laSao.length === 0, 'sai chính tả trong note: ' + [...new Set(laSao)].join(', '));

  const [doSang, diaChi, cachCuc] = await Promise.all(
    [repo.getDoSang(), repo.getDiaChi(), repo.getCachCuc()]);
  const tenChi = new Set(diaChi.map(c => c.ten));

  ck('do-sang phủ đủ 14 sao × 12 chi = 168 ô',
     Object.keys(doSang).length === 14 &&
     Object.values(doSang).every(r => Object.keys(r).length === 12),
     `${Object.keys(doSang).length} sao`);
  ck('do-sang chỉ nhận M / V / Đ / H',
     Object.values(doSang).flatMap(Object.values).every(v => 'MVĐH'.includes(v)));
  ck('do-sang trỏ đúng id sao',
     Object.keys(doSang).every(id => sao.some(s => s.id === id)),
     Object.keys(doSang).filter(id => !sao.some(s => s.id === id)).join(' '));
  ck('do-sang dùng đúng 12 địa chi',
     Object.values(doSang).every(r => Object.keys(r).every(c => tenChi.has(c))));
  ck('dia-chi có đủ 12 chi, ngũ hành hợp lệ',
     diaChi.length === 12 && diaChi.every(c => HANH.has(c.nguHanh)));

  const cungHong = [
    ...cachCuc.tamHop.flatMap(t => t.cung.filter(id => !idCung.has(id))),
    ...cachCuc.theSatPhaTham.flatMap(t =>
        [t.cungThatSat, t.cungPhaQuan, t.cungThamLang].filter(id => !idCung.has(id))),
  ];
  ck('cach-cuc trỏ đúng id cung', cungHong.length === 0, cungHong.join(' '));
  ck('12 thế Sát Phá Tham, ba sao luôn cách nhau 4 cung (tam hợp)',
     cachCuc.theSatPhaTham.length === 12 &&
     cachCuc.theSatPhaTham.every(t => new Set([t.cungThatSat, t.cungPhaQuan, t.cungThamLang]).size === 3));

  ck('bất đồng tài liệu được ghi lại chứ không ghi đè',
     sao.filter(s => s.nguHanhBatDong).every(s => HANH.has(s.nguHanh)),
     sao.filter(s => s.nguHanhBatDong).map(s => `${s.ten}: ${s.nguHanhBatDong}`).join(' | '));
}

// ================================ F. HẠN ====================================
head('F. Hạn của năm xem — đối chiếu với bảng đại/tiểu hạn của 11 lá số chuẩn');
// Mỗi lá số mẫu đã ghi sẵn dh (mốc tuổi đại hạn) và th (Chi năm tiểu hạn) cho
// cả 12 cung, và mục B đã kiểm hai bảng đó khớp tuvivietnam.vn. Ở đây suy kỳ
// vọng TỪ hai bảng ấy rồi so với tinhHan() — không suy từ chính công thức
// đang kiểm:
//   cung Đại Hạn  = cung có dh <= tuổi <= dh+9
//   cung Tiểu Hạn = cung có th trùng Chi của năm xem
{ const NAM_XEM = [1996, 2010, 2026, 2060, 2100];
  let bad = [], soCa = 0;
  for (const C of LA_SO_MAU) {
    const namAm = +generateTuViChart(C.birth).userInfo.lunarStr.match(/\/(\d+)\s*\(/)[1];
    for (const viewYear of NAM_XEM) {
      const c = generateTuViChart({ ...C.birth, viewYear });
      const { han } = c, tuoi = viewYear - namAm + 1;
      soCa++;
      if (han.tuoi !== tuoi) { bad.push(`${C.label}/${viewYear}: tuổi ${han.tuoi}≠${tuoi}`); continue; }

      const dhChi = Object.entries(C.P).find(([, r]) => tuoi >= r.dh && tuoi <= r.dh + 9)?.[0];
      const dhRa = han.daiHan?.chiName ?? null;
      if (dhRa !== (dhChi ?? null)) bad.push(`${C.label}/${viewYear} (${tuoi}t): ĐH ${dhRa}≠${dhChi ?? 'null'}`);
      if (han.daiHan && han.daiHan.tuTuoi !== C.P[dhChi].dh)
        bad.push(`${C.label}/${viewYear}: mốc ĐH ${han.daiHan.tuTuoi}≠${C.P[dhChi].dh}`);

      const thChi = Object.entries(C.P).find(([, r]) => r.th === getCanChiYear(viewYear).chi)?.[0];
      const thRa = han.tieuHan?.chiName ?? null;
      if (tuoi >= 1 && thRa !== thChi) bad.push(`${C.label}/${viewYear}: TH ${thRa}≠${thChi}`);
    }
  }
  ck(`cung Đại Hạn & Tiểu Hạn đúng trên ${soCa} cặp (lá số × năm xem)`, bad.length === 0, bad.slice(0, 4).join(' | ')); }

// Cờ trên lưới phải trùng với object han, và chỉ đúng một cung mỗi loại
{ let bad = [];
  for (const C of LA_SO_MAU) for (const viewYear of [2026, 2071]) {
    const c = generateTuViChart({ ...C.birth, viewYear });
    const dh = c.grid.filter(g => g.isDaiHan), th = c.grid.filter(g => g.isTieuHan);
    if (dh.length !== 1 || th.length !== 1) bad.push(`${C.label}/${viewYear}: ${dh.length} cờ ĐH, ${th.length} cờ TH`);
    else if (dh[0].chiName !== c.han.daiHan.chiName || th[0].chiName !== c.han.tieuHan.chiName)
      bad.push(`${C.label}/${viewYear}: cờ lệch han`);
    else if (dh[0].daiHan !== c.han.daiHan.tuTuoi) bad.push(`${C.label}/${viewYear}: cờ ĐH sai mốc tuổi`);
  }
  ck('cờ isDaiHan / isTieuHan trên lưới khớp object han, mỗi loại đúng 1 cung', bad.length === 0, bad.slice(0, 3).join(' | ')); }

// Chưa tới tuổi khởi hạn, và năm xem trước năm sinh
{ const c = chartOf({ year: 1990, viewYear: 1991 });      // cục >= 2 nên 2 tuổi có thể chưa vào hạn
  const cucNum = c.userInfo.cuc.num;
  ck('trước tuổi khởi Đại Hạn thì daiHan = null, có ghi chú',
     cucNum <= 2 ? true : (c.han.daiHan === null && /Chưa vào Đại Hạn/.test(c.han.ghiChu)),
     `cục ${cucNum}, tuổi ${c.han.tuoi}, ra ${JSON.stringify(c.han.daiHan)}`);
  const c2 = chartOf({ year: 1990, viewYear: 1985 });
  ck('năm xem trước năm sinh thì không có hạn nào',
     c2.han.daiHan === null && c2.han.tieuHan === null && /trước năm sinh/.test(c2.han.ghiChu),
     JSON.stringify(c2.han)); }

// Vòng thứ hai: quá 120 năm thì lặp lại cung cũ nhưng tuổi vẫn chạy tiếp
{ const C = LA_SO_MAU[0];
  const namAm = +generateTuViChart(C.birth).userInfo.lunarStr.match(/\/(\d+)\s*\(/)[1];
  const c = generateTuViChart({ ...C.birth, viewYear: namAm + 130 });   // 131 tuổi
  const cucNum = c.userInfo.cuc.num, i = Math.floor((131 - cucNum) / 10);
  const chiCungCu = Object.entries(C.P).find(([, r]) => r.dh === cucNum + (i % 12) * 10)?.[0];
  ck('đại hạn vòng 2 lặp lại cung của vòng 1, tuổi không quay về đầu',
     c.han.daiHan.vong === 2 && c.han.daiHan.chiName === chiCungCu && c.han.daiHan.tuTuoi === cucNum + i * 10,
     JSON.stringify(c.han.daiHan)); }

// ---- Lưu Niên Đại Hạn ------------------------------------------------------
// Mốc đối chiếu duy nhất tìm được trong refs: refs/tu-vi-tong-hop/
// quyen2-19-giai-doan-la-so-dien-hinh.md ("SỐ BỊ ÁM HẠI") — Âm Nam, Kim tứ cục,
// Mệnh ở Dậu, "chết vào năm Hợi 43 tuổi. Tiểu hạn tại Quan, lưu niên đại hạn
// tại tử". 10/2/1929 giờ Tỵ là một lá số thật khớp đủ 4 điều kiện đầu bài
// (Kỷ Tỵ · Âm Nam · Kim Tứ Cục · Mệnh Dậu), và 43 tuổi âm của nó rơi đúng năm
// Tân Hợi 1971 như sách nói.
{ const c = chartOf({ day:10, month:2, year:1929, gender:1, viewYear:1971 });
  const u = c.userInfo, menh = c.grid.find(g => g.isMenh);
  ck('ví dụ sách — lá số đối chiếu đúng đầu bài (Âm Nam · Kim tứ cục · Mệnh Dậu · năm Hợi 43 tuổi)',
     u.amDuongNamNu === 'Âm Nam' && u.cuc.num === 4 && menh.chiName === 'Dậu'
       && u.viewYearCanChi === 'Tân Hợi' && c.han.tuoi === 43,
     `${u.amDuongNamNu}/${u.cuc.name}/Mệnh ${menh.chiName}/${u.viewYearCanChi}/${c.han.tuoi}t`);
  ck('ví dụ sách — tiểu hạn tại Quan Lộc', c.han.tieuHan.palaceName === 'Quan Lộc', c.han.tieuHan.palaceName);
  ck('ví dụ sách — lưu niên đại hạn tại Tử Tức', c.han.luuNienDaiHan.palaceName === 'Tử Tức',
     c.han.luuNienDaiHan.palaceName); }

// Khẩu quyết: Gốc -> xung chiếu -> lùi 1 cung -> tiến liên tiếp, đếm theo chiều
// đi của đại hạn. Kiểm trên cả 11 lá số mẫu, mọi năm của đại vận đang đi.
{ let bad = [], soCa = 0;
  for (const C of LA_SO_MAU) {
    const c0 = generateTuViChart(C.birth);
    const namAm = +c0.userInfo.lunarStr.match(/\/(\d+)\s*\(/)[1];
    const d = c0.userInfo.isThuanLy ? 1 : -1;
    const G = c0.han.daiHan.gridIdx;
    const mong = (k) => (G + (k === 1 ? 0 : k === 2 ? 6 : 6 + (k - 4) * d) + 120) % 12;
    for (let k = 1; k <= 10; k++) {
      const viewYear = c0.han.daiHan.tuNam + k - 1;
      const { han } = generateTuViChart({ ...C.birth, viewYear });
      soCa++;
      if (han.luuNienDaiHan.namThu !== k) bad.push(`${C.label}/${viewYear}: năm thứ ${han.luuNienDaiHan.namThu}≠${k}`);
      if (han.luuNienDaiHan.gridIdx !== mong(k))
        bad.push(`${C.label}/năm ${k}: ${nm(han.luuNienDaiHan.gridIdx)}≠${nm(mong(k))}`);
      if (han.tuoi !== viewYear - namAm + 1) bad.push(`${C.label}/${viewYear}: tuổi ${han.tuoi}≠${viewYear - namAm + 1}`);
    }
  }
  ck(`lộ trình Gốc/xung chiếu/lùi 1/tiến liên tiếp đúng trên ${soCa} năm`, bad.length === 0, bad.slice(0, 3).join(' | ')); }

// Tính chất tự kiểm mà khẩu quyết đòi: năm thứ 10 về đúng Gốc, nên bước tiếp
// theo (năm đầu đại vận sau) chạm đúng cung đại vận kế tiếp — lộ trình cũ giao
// lại cho lộ trình mới, không hở.
{ let bad = [], soCa = 0;
  for (const C of LA_SO_MAU) for (const lech of [0, 10, 20, 30]) {
    const c0 = generateTuViChart(C.birth);
    const namCuoi = c0.han.daiHan.tuNam + 9 + lech;      // năm thứ 10 của một đại vận
    const cuoi = generateTuViChart({ ...C.birth, viewYear: namCuoi });
    const sau = generateTuViChart({ ...C.birth, viewYear: namCuoi + 1 });
    soCa++;
    if (cuoi.han.luuNienDaiHan.namThu !== 10) { bad.push(`${C.label}: năm cuối không phải năm thứ 10`); continue; }
    if (cuoi.han.luuNienDaiHan.gridIdx !== cuoi.han.daiHan.gridIdx)
      bad.push(`${C.label}/${namCuoi}: năm thứ 10 ở ${nm(cuoi.han.luuNienDaiHan.gridIdx)}, Gốc ở ${nm(cuoi.han.daiHan.gridIdx)}`);
    if (sau.han.daiHan.gridIdx === cuoi.han.daiHan.gridIdx)
      bad.push(`${C.label}/${namCuoi + 1}: chưa sang đại vận mới`);
    if (sau.han.luuNienDaiHan.gridIdx !== sau.han.daiHan.gridIdx || sau.han.luuNienDaiHan.namThu !== 1)
      bad.push(`${C.label}/${namCuoi + 1}: lộ trình mới không khởi tại cung đại vận kế tiếp`);
  }
  ck(`năm thứ 10 về Gốc và giao đúng cho đại vận kế tiếp (${soCa} lần chuyển hạn)`, bad.length === 0, bad.slice(0, 3).join(' | ')); }

// Cờ trên lưới + không có lưu niên đại hạn khi chưa vào đại hạn nào
{ let bad = [];
  for (const C of LA_SO_MAU) {
    const c = generateTuViChart({ ...C.birth, viewYear: 2026 });
    const co = c.grid.filter(g => g.isLuuNienDaiHan);
    if (co.length !== 1 || co[0].gridIdx !== c.han.luuNienDaiHan.gridIdx) bad.push(C.label);
  }
  ck('cờ isLuuNienDaiHan đúng 1 cung và khớp object han', bad.length === 0, bad.join(' | '));
  const c2 = chartOf({ year: 1990, viewYear: 1991 });
  ck('chưa vào đại hạn thì không có lưu niên đại hạn',
     c2.userInfo.cuc.num <= 2 ? true : c2.han.luuNienDaiHan === null,
     `cục ${c2.userInfo.cuc.num}, ${JSON.stringify(c2.han.luuNienDaiHan)}`); }

// ---- Nguyệt Hạn (lưu Nguyệt, phái Đẩu Số) ----------------------------------
// Khẩu quyết: tháng Giêng tại Đẩu Quân của năm xem, mỗi tháng thuận một cung;
// Đẩu Quân an từ Thái Tuế năm xem, nghịch tới tháng sinh rồi thuận tới giờ sinh
// (refs/dau-so-tinh-thanh/chuong-10-van-the-hau-thien-nien-han.md mục 134).
//
// Mốc kiểm không nằm ở công thức mới mà ở SAO Đẩu Quân vốn có trên lá số — sao
// này đã khớp cả 11 lá số chuẩn ở mục B. Lấy năm xem = năm sinh thì Đẩu Quân
// của nguyệt hạn phải rơi đúng vị trí sao đó.
{ let bad = [];
  for (const C of LA_SO_MAU) {
    const c0 = generateTuViChart(C.birth);
    const namAm = +c0.userInfo.lunarStr.match(/\/(\d+)\s*\(/)[1];
    const c = generateTuViChart({ ...C.birth, viewYear: namAm });
    const sao = c.grid.findIndex(g => [...g.phuTinhTot, ...g.phuTinhXau].some(s => s.name === 'Đẩu Quân'));
    if (c.han.nguyetHan.dauQuan.gridIdx !== sao)
      bad.push(`${C.label}: ${nm(c.han.nguyetHan.dauQuan.gridIdx)}≠${nm(sao)}`);
  }
  ck('Đẩu Quân của năm sinh trùng vị trí sao Đẩu Quân trên lá số', bad.length === 0, bad.join(' | ')); }

// "Đấu quân năm sinh định ra, về sau từng năm thuận bàn mà đẩy, một năm một cung"
{ let bad = [];
  for (const C of LA_SO_MAU) {
    const namAm = +generateTuViChart(C.birth).userInfo.lunarStr.match(/\/(\d+)\s*\(/)[1];
    const goc = generateTuViChart({ ...C.birth, viewYear: namAm }).han.nguyetHan.dauQuan.gridIdx;
    for (const k of [1, 5, 12, 31, 40]) {
      const ra = generateTuViChart({ ...C.birth, viewYear: namAm + k }).han.nguyetHan.dauQuan.gridIdx;
      if (ra !== (goc + k) % 12) bad.push(`${C.label}/+${k} năm: ${nm(ra)}≠${nm(goc + k)}`);
    }
  }
  ck('Đẩu Quân đẩy thuận đúng 1 cung mỗi năm', bad.length === 0, bad.slice(0, 3).join(' | ')); }

// Lộ trình 12 tháng: tháng Giêng tại Đẩu Quân, thuận một cung mỗi tháng, đi đủ
// 12 cung khác nhau (khác lưu niên đại hạn — lộ trình đó chỉ qua 8 cung).
{ let bad = [];
  for (const C of LA_SO_MAU) for (const viewYear of [2026, 2044]) {
    const { han } = generateTuViChart({ ...C.birth, viewYear });
    const dq = han.nguyetHan.dauQuan.gridIdx, lt = han.nguyetHan.loTrinh;
    if (lt.length !== 12) bad.push(`${C.label}: ${lt.length} dòng`);
    if (new Set(lt.map(r => r.gridIdx)).size !== 12) bad.push(`${C.label}: không đủ 12 cung`);
    lt.forEach(r => { if (r.gridIdx !== (dq + r.thang - 1) % 12) bad.push(`${C.label}/T${r.thang}`); });
  }
  ck('lộ trình 12 tháng khởi tại Đẩu Quân, thuận 1 cung mỗi tháng', bad.length === 0, bad.slice(0, 3).join(' | ')); }

// Tháng xem: không truyền thì chỉ có lộ trình, không gán cờ lên lưới
{ const khong = generateTuViChart({ ...LA_SO_MAU[0].birth, viewYear: 2026 });
  ck('không chọn tháng xem thì thangXem = null và không cung nào mang cờ nguyệt hạn',
     khong.han.nguyetHan.thangXem === null && khong.grid.every(g => !g.isNguyetHan)
       && khong.han.nguyetHan.loTrinh.length === 12,
     JSON.stringify(khong.han.nguyetHan.thangXem));
  let bad = [];
  for (let t = 1; t <= 12; t++) {
    const c = generateTuViChart({ ...LA_SO_MAU[0].birth, viewYear: 2026, viewMonth: t });
    const co = c.grid.filter(g => g.isNguyetHan);
    if (co.length !== 1 || co[0].gridIdx !== c.han.nguyetHan.gridIdx
        || c.han.nguyetHan.gridIdx !== c.han.nguyetHan.loTrinh[t - 1].gridIdx)
      bad.push(`T${t}`);
  }
  ck('chọn tháng xem thì đúng 1 cung mang cờ nguyệt hạn, khớp lộ trình', bad.length === 0, bad.join(' ')); }

// Hàm viTriDauQuan dùng chung cho cả an sao và nguyệt hạn — kiểm trực tiếp
// bằng khẩu quyết trên vài trường hợp tự tính tay.
{ const G = (chi) => (CHI.indexOf(chi) - 2 + 12) % 12;
  // Thái Tuế năm Tý ở cung Tý; sinh tháng 1 giờ Tý -> Đẩu Quân ngay tại Tý
  ck('viTriDauQuan — năm Tý, tháng 1, giờ Tý: Đẩu Quân tại Tý',
     viTriDauQuan(CHI.indexOf('Tý'), 1, CHI.indexOf('Tý')) === G('Tý'),
     nm(viTriDauQuan(0, 1, 0)));
  // sinh tháng 3 giờ Tý: nghịch 2 cung từ Tý -> Tuất
  ck('viTriDauQuan — năm Tý, tháng 3, giờ Tý: nghịch 2 cung tới Tuất',
     viTriDauQuan(CHI.indexOf('Tý'), 3, CHI.indexOf('Tý')) === G('Tuất'),
     nm(viTriDauQuan(0, 3, 0)));
  // sinh tháng 3 giờ Dần (thuận 2): Tuất -> Tý
  ck('viTriDauQuan — năm Tý, tháng 3, giờ Dần: thuận 2 cung về Tý',
     viTriDauQuan(CHI.indexOf('Tý'), 3, CHI.indexOf('Dần')) === G('Tý'),
     nm(viTriDauQuan(0, 3, 2))); }

// ================================ KẾT QUẢ ===================================
console.log('\n' + '='.repeat(70));
if (fail) { console.log(`❌  ${fail} lỗi / ${pass + fail} phép kiểm`); fails.forEach(f => console.log('    · ' + f)); process.exit(1); }
console.log(`✅  Toàn bộ ${pass} phép kiểm đều đạt`);
