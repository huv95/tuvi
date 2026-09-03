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
  if (tuyChon.onCungClick) el.addEventListener('click', () => tuyChon.onCungClick(cung.gridIdx));

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
      <span class="text-[10px] text-slate-400 font-mono font-semibold">${cung.chiName}</span>
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

function veThienBan(userInfo) {
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
      <span>Xem Hạn Năm: <strong class="text-amber-400">${userInfo.viewYear}</strong></span>
      <span class="text-amber-300 font-bold">Năm ${userInfo.viewYearCanChi}</span>
    </div>
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
    taoTam: () => veThienBan(laSo.userInfo),
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
