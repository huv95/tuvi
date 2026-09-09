// Bố cục địa bàn 12 cung — một nơi duy nhất định nghĩa lưới 4×4.
//
// 12 cung nằm trên viền lưới 4×4, khối 2×2 giữa dành cho Thiên Bàn. O_LUOI
// liệt kê toạ độ [hàng, cột] (0-indexed) của 12 ô viền, đi thuận chiều kim
// đồng hồ bắt đầu từ góc trên-trái:
//
//   k=0  k=1  k=2  k=3
//   k=11 ..   ..   k=4
//   k=10 ..   ..   k=5
//   k=9  k=8  k=7  k=6
//
// k chỉ là thứ tự vị trí trên lưới, không mang ý nghĩa Chi hay tên cung.
// Mỗi trang tự quy đổi chỉ số ngữ nghĩa của mình sang k:
//   - lib/ansao.js: gridIdx i có chiIdx = (i+2)%12, i=3 (Tỵ) rơi vào góc
//     trên-trái → k = (i - 3 + 12) % 12
//   - SatPhaTham.html: houseIdx 0 (Mệnh) đã đứng ở góc trên-trái → k = houseIdx
export const O_LUOI = [
  [0, 0], [0, 1], [0, 2], [0, 3],
  [1, 3], [2, 3],
  [3, 3], [3, 2], [3, 1], [3, 0],
  [2, 0], [1, 0],
];

// vị trí k trên O_LUOI -> gridIdx (0..11 của lib/ansao.js), xem chú thích trên.
const GRID_IDX_TU_K = (k) => (k + 3) % 12;

// Dựng khung lưới 4×4 dùng chung cho mọi trang có địa bàn: gọi taoO(k) cho
// từng ô trong 12 ô viền (thứ tự theo O_LUOI) và taoTam() một lần cho khối
// 2×2 giữa, tự đặt gridRowStart/gridColumnStart cho cả hai. khung phải sẵn
// class lưới (grid-cols-4 grid-rows-4 hoặc tương đương).
export function veKhungLuoi(khung, { taoO, taoTam }) {
  khung.innerHTML = '';
  if (taoTam) {
    const tam = taoTam();
    tam.style.gridRowStart = 2;
    tam.style.gridColumnStart = 2;
    khung.appendChild(tam);
  }
  O_LUOI.forEach(([r, c], k) => {
    const el = taoO(k);
    el.style.gridRowStart = r + 1;
    el.style.gridColumnStart = c + 1;
    khung.appendChild(el);
  });
}

const EL_CLASS = { "Kim": "hanh-kim", "Mộc": "hanh-moc", "Thủy": "hanh-thuy", "Hỏa": "hanh-hoa", "Thổ": "hanh-tho" };
const lopHanh = (el) => EL_CLASS[el] || "hanh-tho";

// Thẻ một sao: tên tô màu theo ngũ hành + nhãn Tứ Hóa nếu có.
export function veTheSao(sao) {
  const el = document.createElement('span');
  el.className = lopHanh(sao.el);
  el.innerHTML = `${sao.name}<span class="star-tuhoa">${sao.tuHoa || ''}</span>`;
  return el;
}

function veOCung(cung, tuyChon) {
  const el = document.createElement('div');
  el.id = `cung-${cung.gridIdx}`;
  el.className = 'cung-box bg-slate-900/90 border border-slate-800 rounded-lg p-2 flex flex-col justify-between hover:border-amber-500/80 cursor-pointer transition-all overflow-hidden';
  // Cung đang đi hạn của năm xem. Ba loại hạn có thể rơi cùng một cung nên viền
  // được ghép thành nhiều lớp lồng nhau (2px, 5px, 8px) theo thứ tự Đại Hạn ->
  // Lưu Niên -> Tiểu Hạn; màu lấy từ token trong assets/theme.css nên vẫn đọc
  // đúng trên cả nền tối và nền giấy.
  const HAN = [
    ['isDaiHan', 'cung-dai-han', 'nhan-han-dai', 'Đại Hạn', 'var(--han-dai)'],
    ['isLuuNienDaiHan', 'cung-luu-han', 'nhan-han-luu', 'Lưu Niên', 'var(--han-luu)'],
    ['isTieuHan', 'cung-tieu-han', 'nhan-han-tieu', 'Tiểu Hạn', 'var(--han-tieu)'],
    ['isNguyetHan', 'cung-nguyet-han', 'nhan-han-nguyet', 'Nguyệt Hạn', 'var(--han-nguyet)'],
  ].filter(([co]) => cung[co]);
  HAN.forEach(([, lop]) => el.classList.add(lop));
  if (HAN.length) el.style.boxShadow = HAN.map(([, , , , mau], i) => `inset 0 0 0 ${2 + i * 3}px ${mau}`).join(', ');
  if (tuyChon.onCungClick) el.addEventListener('click', () => tuyChon.onCungClick(cung.gridIdx));

  const nhanHan = HAN.map(([, , lopNhan, ten]) => `<span class="nhan-han ${lopNhan}">${ten}</span>`).join('');

  const chinhTinhHTML = cung.chinhTinh.map(s => `
    <div class="font-bold text-[11px] ${lopHanh(s.el)} flex items-center justify-between">
      <span>${s.name}<span class="star-tuhoa">${s.tuHoa || ''}</span></span>
      <span class="text-[9px] text-slate-500 font-mono">(${s.el})</span>
    </div>
  `).join('') || '<div class="text-[10px] text-slate-500 italic">Vô Chính Diệu</div>';

  const phuTag = (list) => list.map(s => {
    const the = veTheSao(s);
    the.classList.add('mr-1', 'inline-block');
    return the.outerHTML;
  }).join('');

  el.innerHTML = `
    <div class="flex items-center justify-between border-b border-slate-800 pb-1">
      <span class="font-serif font-bold text-xs ${cung.isMenh ? 'text-amber-400 underline decoration-amber-500' : 'text-slate-100'}">
        ${cung.palaceName} ${cung.isThan ? '<span class="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded ml-0.5">Thân</span>' : ''}
      </span>
      <span class="flex items-center gap-1">
        ${nhanHan}
        <span class="text-[10px] text-slate-400 font-mono font-semibold">${cung.chiName}</span>
      </span>
    </div>
    <div class="my-1.5 space-y-0.5">${chinhTinhHTML}</div>
    ${tuyChon.rutGon ? '' : `
    <div class="text-[9px] leading-tight my-1 grid grid-cols-2 gap-x-1 overflow-hidden">
      <div>${phuTag(cung.phuTinhTot)}</div>
      <div class="text-right">${phuTag(cung.phuTinhXau)}</div>
    </div>
    <div class="border-t border-slate-800/80 pt-1 flex justify-between items-center text-[9px] text-slate-400 font-mono">
      <span>Đ.Hạn: <strong class="text-slate-200">${cung.daiHan}</strong></span>
      <span class="text-slate-500">${cung.trangSinh}</span>
      <span>T.Hạn: <strong class="text-amber-400">${cung.tieuHan}</strong></span>
    </div>`}
  `;
  return el;
}

function veThienBan(userInfo, han) {
  const el = document.createElement('div');
  el.id = 'thien-ban';
  el.className = 'col-span-2 row-span-2 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/60 rounded-xl p-3 flex flex-col justify-between items-center text-center shadow-inner relative overflow-y-auto';
  el.innerHTML = `
    <div class="space-y-1 w-full border-b border-amber-500/20 pb-2">
      <div class="text-amber-400 font-serif font-bold text-base md:text-xl tracking-wider">LÁ SỐ TỬ VI</div>
      <div class="text-slate-100 font-bold text-sm md:text-base">${userInfo.name}</div>
      <div class="text-[11px] text-amber-200/90 font-semibold">${userInfo.gender} Mạng • ${userInfo.amDuongNamNu} • Âm Dương ${userInfo.amDuongThuanLy ? 'thuận lý' : 'nghịch lý'}</div>
    </div>

    <div class="w-full my-1.5 py-1.5 border-y border-amber-500/20 text-[11px] space-y-1 bg-slate-900/70 rounded-lg px-2 text-left">
      <div class="flex justify-between items-center">
        <span class="text-slate-400">Dương lịch:</span>
        <span class="text-slate-100 font-semibold">${userInfo.solarStr}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-slate-400">Âm lịch:</span>
        <span class="text-amber-300 font-semibold">${userInfo.lunarStr}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-slate-400">Giờ sinh:</span>
        <span class="text-amber-200 font-medium">${userInfo.hourStr}</span>
      </div>
    </div>

    <div class="w-full text-[11px] space-y-1 text-left">
      <div class="flex justify-between items-center bg-slate-800/50 px-2 py-1 rounded">
        <span class="text-slate-300">Bản Mệnh: <strong class="text-emerald-400">${userInfo.napAm}</strong></span>
        <span class="text-slate-300">Cục: <strong class="text-amber-400">${userInfo.cuc.name}</strong></span>
      </div>
      <div class="flex justify-between items-center bg-slate-800/30 px-2 py-0.5 rounded">
        <span class="text-slate-300">Âm Dương Mệnh: <strong class="text-slate-100">${userInfo.amDuongNamNu}</strong></span>
        <span class="text-slate-300">Mệnh / Cục: <strong class="text-amber-300">${userInfo.tuongSinhText}</strong></span>
      </div>
      <div class="flex justify-between items-center bg-slate-800/50 px-2 py-1 rounded">
        <span class="text-slate-300">Mệnh Chủ: <strong class="text-amber-300">${userInfo.menhChu}</strong></span>
        <span class="text-slate-300">Thân Chủ: <strong class="text-amber-300">${userInfo.thanChu}</strong></span>
      </div>
    </div>

    <div class="text-[10px] text-slate-400 mt-1 border-t border-slate-800 pt-1 w-full flex justify-between">
      <span>Xem Hạn Năm: <strong class="text-amber-400">${userInfo.viewYear}</strong>
        ${han && han.tuoi > 0 ? `<span class="font-mono">· ${han.tuoi} tuổi</span>` : ''}</span>
      <span class="text-amber-300 font-bold">Năm ${userInfo.viewYearCanChi}</span>
    </div>
    ${han ? `
    <div class="text-[10px] w-full flex justify-between gap-1 border-t border-slate-800 pt-1">
      <span class="nhan-han nhan-han-dai">ĐH: ${han.daiHan ? `${han.daiHan.palaceName} · ${han.daiHan.tuTuoi}-${han.daiHan.denTuoi}t` : '—'}</span>
      <span class="nhan-han nhan-han-luu">LN: ${han.luuNienDaiHan ? `${han.luuNienDaiHan.palaceName} · năm ${han.luuNienDaiHan.namThu}/10` : '—'}</span>
      <span class="nhan-han nhan-han-tieu">TH: ${han.tieuHan ? han.tieuHan.palaceName : '—'}</span>
    </div>` : ''}
  `;
  return el;
}

// Vẽ địa bàn 12 cung + Thiên Bàn giữa vào khung (container đã có class lưới
// grid-cols-4 grid-rows-4). laSo là object trả về từ generateTuViChart trong
// lib/ansao.js ({ userInfo, grid }). tuyChon:
//   onCungClick(gridIdx)  gọi khi bấm vào một cung
//   rutGon                true: chỉ hiện chính tinh, ẩn phụ tinh và đại/tiểu hạn
export function veDiaBan(khung, laSo, tuyChon = {}) {
  veKhungLuoi(khung, {
    taoTam: () => veThienBan(laSo.userInfo, laSo.han),
    taoO: (k) => veOCung(laSo.grid[GRID_IDX_TU_K(k)], tuyChon),
  });
  return khung;
}

// Nội dung chi tiết một cung (chính tinh, cát tinh, hung tinh) cho modal/panel.
export function moModalCung(cung) {
  const starChip = (s) => `<span class="the-sao-chip px-2 py-0.5 rounded text-[11px] ${lopHanh(s.el)}">${s.name}${s.tuHoa || ''}</span>`;
  const chinhStarsText = cung.chinhTinh.map(s => `<li class="font-bold ${lopHanh(s.el)}">${s.name} (${s.el})${s.tuHoa || ''}</li>`).join('') || '<li class="text-slate-500">Vô Chính Diệu</li>';
  const phuTotText = cung.phuTinhTot.map(starChip).join(' ') || '<span class="text-slate-500">Không có</span>';
  const phuXauText = cung.phuTinhXau.map(starChip).join(' ') || '<span class="text-slate-500">Không có</span>';

  const el = document.createElement('div');
  el.className = 'space-y-3';
  el.innerHTML = `
    <div>
      <h4 class="text-amber-400 font-semibold mb-1">Chính Tinh Tọa Thủ:</h4>
      <ul class="list-disc list-inside space-y-1 pl-1">${chinhStarsText}</ul>
    </div>
    <div>
      <h4 class="text-emerald-400 font-semibold mb-1">Cát Tinh & Phụ Tinh Cát:</h4>
      <div class="flex flex-wrap gap-1.5">${phuTotText}</div>
    </div>
    <div>
      <h4 class="text-rose-400 font-semibold mb-1">Hung Tinh & Sát Tinh:</h4>
      <div class="flex flex-wrap gap-1.5">${phuXauText}</div>
    </div>
  `;
  return el;
}

// Bảng tóm tắt hạn của năm xem: cung Đại Hạn, cung Tiểu Hạn và các sao đáng
// chú ý trong hai cung đó. laSo là object trả về từ generateTuViChart (cần
// laSo.han — có sẵn từ khi lib/ansao.js tính hạn). Trả về DOM element, trang
// tự đặt vào đâu thì tuỳ.
export function veTomTatHan(laSo) {
  const { han, userInfo, grid } = laSo;
  // Nguyệt hạn chỉ hiện khi trang có chọn tháng xem (viewMonth), xem tinhHan.
  const coNguyet = !!(han.nguyetHan && han.nguyetHan.thangXem);
  const el = document.createElement('div');
  el.className = 'space-y-2';

  // Sao lưu niên mang tiền tố "L." (an theo năm xem, xem lib/ansao.js)
  const saoLuu = (cung) => [...cung.phuTinhTot, ...cung.phuTinhXau].filter(s => s.name.startsWith('L.'));

  const the = (nhan, lopNhan, cung, phu) => {
    if (!cung) return `
      <div class="the-han rounded-xl p-3">
        <span class="nhan-han ${lopNhan}">${nhan}</span>
        <p class="text-[11px] text-slate-400 mt-2">${han.ghiChu || 'Không xác định'}</p>
      </div>`;
    const o = grid[cung.gridIdx];
    const chinh = o.chinhTinh.map(s => veTheSao(s).outerHTML).join(' · ')
      || '<span class="text-slate-500 italic">Vô Chính Diệu</span>';
    const luu = saoLuu(o).map(s => `<span class="the-sao-chip px-1.5 py-0.5 rounded text-[10px] ${lopHanh(s.el)}">${s.name}</span>`).join(' ')
      || '<span class="text-slate-500">không có</span>';
    return `
      <div class="the-han rounded-xl p-3 space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="nhan-han ${lopNhan}">${nhan}</span>
          <span class="text-[10px] text-slate-400 font-mono">${phu}</span>
        </div>
        <div class="font-serif font-bold text-amber-300 text-sm">
          Cung ${o.palaceName}
          <span class="text-slate-400 font-mono text-[11px] font-normal">(${o.chiName})</span>
          ${o.isMenh ? '<span class="text-[9px] text-amber-400">· Mệnh</span>' : ''}
          ${o.isThan ? '<span class="text-[9px] text-amber-400">· Thân</span>' : ''}
        </div>
        <div class="text-[11px] leading-relaxed">${chinh}</div>
        <div class="text-[10px] text-slate-400">Sao lưu niên: ${luu}</div>
      </div>`;
  };

  el.innerHTML = `
    <div class="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
      <span class="text-xs uppercase tracking-wider font-semibold text-slate-400">
        Hạn năm <strong class="text-amber-400">${userInfo.viewYear}</strong>
        <span class="text-amber-300">(${userInfo.viewYearCanChi})</span>
      </span>
      <span class="text-[11px] text-slate-300 font-mono">${han.tuoi > 0 ? han.tuoi + ' tuổi âm' : 'chưa sinh'}</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 ${coNguyet ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-2">
      ${the('Đại Hạn', 'nhan-han-dai', han.daiHan,
            han.daiHan ? `${han.daiHan.tuTuoi}-${han.daiHan.denTuoi} tuổi · ${han.daiHan.tuNam}-${han.daiHan.denNam}` : '')}
      ${the('Lưu Niên Đại Hạn', 'nhan-han-luu', han.luuNienDaiHan,
            han.luuNienDaiHan ? `năm thứ ${han.luuNienDaiHan.namThu}/10 của đại vận` : '')}
      ${the('Tiểu Hạn', 'nhan-han-tieu', han.tieuHan, `năm ${userInfo.viewYearCanChi.split(' ')[1]}`)}
      ${coNguyet ? the('Nguyệt Hạn', 'nhan-han-nguyet', han.nguyetHan, `tháng ${han.nguyetHan.thangXem} âm lịch`) : ''}
    </div>
    ${han.ghiChu && han.daiHan ? `<p class="text-[10px] text-amber-200/80">${han.ghiChu}</p>` : ''}
  `;
  return el;
}

// Bảng lộ trình hạn: mỗi dòng một chặng, chặng đang xem được tô sáng.
//   loai = 'luuNien'  10 năm của đại vận đang đi (Lưu Niên Đại Hạn)
//   loai = 'nguyet'   12 tháng của năm xem (Nguyệt Hạn)
// Trả về null nếu lá số không có chặng đó (chưa vào đại hạn, hoặc trang không
// chọn tháng xem) — xem tinhHan trong lib/ansao.js.
export function veLoTrinhHan(laSo, loai = 'luuNien') {
  const { han, grid } = laSo;
  const CAU_HINH = {
    luuNien: {
      nguon: han.luuNienDaiHan,
      cot: ['Năm thứ', 'Tuổi', 'Năm âm'],
      o: (r) => [r.namThu, r.tuoi, r.nam],
      dangXem: (r) => r.namThu === han.luuNienDaiHan.namThu,
      lop: '',
    },
    nguyet: {
      nguon: han.nguyetHan && han.nguyetHan.thangXem ? han.nguyetHan : null,
      cot: ['Tháng âm'],
      o: (r) => [r.thang],
      dangXem: (r) => r.thang === han.nguyetHan.thangXem,
      lop: 'lo-trinh-nguyet',
    },
  }[loai];
  if (!CAU_HINH || !CAU_HINH.nguon) return null;

  const el = document.createElement('div');
  el.className = 'bang-han';
  const dong = (r) => {
    const o = grid[r.gridIdx];
    return `
      <tr class="${CAU_HINH.dangXem(r) ? 'dang-xem' : ''}">
        ${CAU_HINH.o(r).map(v => `<td class="text-center font-mono">${v}</td>`).join('')}
        <td class="font-mono">${r.chiName}</td>
        <td class="font-semibold">${r.palaceName}</td>
        <td class="text-[10px]">${o.chinhTinh.map(s => veTheSao(s).outerHTML).join(' · ')
          || '<span class="text-slate-500 italic">Vô Chính Diệu</span>'}</td>
      </tr>`;
  };

  el.innerHTML = `
    <table class="bang-lo-trinh ${CAU_HINH.lop} w-full text-[11px]">
      <thead>
        <tr>
          ${CAU_HINH.cot.map(c => `<th class="text-center">${c}</th>`).join('')}
          <th>Chi</th><th>Cung</th><th>Chính tinh</th>
        </tr>
      </thead>
      <tbody>${CAU_HINH.nguon.loTrinh.map(dong).join('')}</tbody>
    </table>
  `;
  return el;
}
