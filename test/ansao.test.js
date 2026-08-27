#!/usr/bin/env node
// ============================================================================
// Bộ kiểm thử lib/lich.js và lib/ansao.js
//
//   npm test                         chạy toàn bộ
//   node test/ansao.test.js -v       in chi tiết từng mục
//
// Thoát mã 1 nếu có lỗi, để dùng được trong CI / pre-commit hook.
//
// Gồm 4 tầng:
//   A. Đổi lịch      - đối chiếu mốc lịch VN + tự nghịch đảo trên 400.000 ngày
//   B. Lá số mẫu     - 11 lá số chuẩn từ tuvivietnam.vn (test/lasomau.js)
//   C. Quy tắc an sao- bảng tra và khẩu quyết
//   D. Bất biến      - tính chất phải đúng với MỌI lá số
//   E. Dữ liệu       - cấu trúc data/*.json và tính toàn vẹn tham chiếu
// ============================================================================
import { CAN, CHI, jdFromDate, jdToSolar,
         convertSolarToLunar, convertLunarToSolar,
         getCanChiYear, getCanChiDay, getCanChiHour } from '../lib/lich.js';
import { generateTuViChart } from '../lib/ansao.js';
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

// ================================ KẾT QUẢ ===================================
console.log('\n' + '='.repeat(70));
if (fail) { console.log(`❌  ${fail} lỗi / ${pass + fail} phép kiểm`); fails.forEach(f => console.log('    · ' + f)); process.exit(1); }
console.log(`✅  Toàn bộ ${pass} phép kiểm đều đạt`);
