// ============================================================================
// lib/ansao.js — Engine an sao Tử Vi Đẩu Số
//
// generateTuViChart(data) -> { userInfo, grid }  — dữ liệu thuần, không HTML.
// Không chạm DOM: dùng được cả trong trình duyệt lẫn Node, nên backend sau này
// dùng lại nguyên file này. Được test/ansao.test.js đối chiếu 11 lá số chuẩn.
// ============================================================================

import {
  CAN, CHI, NAP_AM_TABLE,
  jdFromDate, convertSolarToLunar, convertLunarToSolar,
  getCanChiYear, getCanChiMonth, getCanChiDay, getCanChiHour,
  getNapAm, getNapAmElement
} from './lich.js';

// Ngũ hành của từng sao - dùng để tô màu (Kim trắng, Mộc xanh lá, Thủy xanh dương, Hỏa đỏ, Thổ vàng)
export const STAR_EL = {
  "Lộc Tồn": "Thổ", "Kình Dương": "Kim", "Đà La": "Kim", "Quốc Ấn": "Thổ", "Đường Phù": "Mộc",
  "Bác Sĩ": "Thủy", "Lực Sĩ": "Hỏa", "Thanh Long": "Thủy", "Tiểu Hao": "Hỏa", "Tướng Quân": "Mộc",
  "Tấu Thư": "Kim", "Phi Liêm": "Hỏa", "Hỉ Thần": "Hỏa", "Bệnh Phù": "Thủy", "Đại Hao": "Hỏa",
  "Phục Binh": "Hỏa", "Quan Phù": "Hỏa",
  "Văn Xương": "Kim", "Văn Khúc": "Thủy", "Tả Phụ": "Thổ", "Hữu Bật": "Thủy",
  "Thiên Khôi": "Hỏa", "Thiên Việt": "Hỏa", "Địa Không": "Hỏa", "Địa Kiếp": "Hỏa",
  "Hỏa Tinh": "Hỏa", "Linh Tinh": "Hỏa", "Thiên Mã": "Hỏa",
  "Thái Tuế": "Hỏa", "Thiếu Dương": "Hỏa", "Tang Môn": "Mộc", "Thiếu Âm": "Thủy",
  "Tử Phù": "Kim", "Tuế Phá": "Hỏa", "Long Đức": "Thủy", "Bạch Hổ": "Kim",
  "Phúc Đức": "Thổ", "Điếu Khách": "Hỏa", "Trực Phù": "Kim", "Thiên Không": "Hỏa",
  "Thiên Khốc": "Thủy", "Thiên Hư": "Thủy", "Long Trì": "Thủy", "Phượng Các": "Thổ",
  "Hồng Loan": "Thủy", "Thiên Hỷ": "Thủy", "Cô Thần": "Hỏa", "Quả Tú": "Hỏa",
  "Đào Hoa": "Mộc", "Hoa Cái": "Kim", "Kiếp Sát": "Hỏa", "Phá Toái": "Hỏa",
  "Thiên Hình": "Hỏa", "Thiên Diêu": "Thủy", "Thiên Y": "Thủy",
  "Tam Thai": "Thổ", "Bát Tọa": "Thổ", "Ân Quang": "Thổ", "Thiên Quý": "Thổ",
  "Thai Phụ": "Thổ", "Phong Cáo": "Thổ", "Thiên Quan": "Hỏa", "Thiên Phúc": "Thổ",
  "Thiên Trù": "Thổ", "Thiên Giải": "Hỏa", "Địa Giải": "Thổ", "Giải Thần": "Mộc",
  "Thiên Thọ": "Thổ", "Thiên Tài": "Thổ", "Nguyệt Đức": "Thổ", "Thiên Đức": "Hỏa",
  "Lưu Hà": "Thủy", "Thiên Thương": "Thủy", "Thiên Sứ": "Thủy", "Đẩu Quân": "Hỏa",
  "Thiên La": "Thổ", "Địa Võng": "Thổ", "Lưu Niên Văn Tinh": "Kim",
  "Tuần": "Hỏa", "Triệt": "Hỏa"
};

// Mệnh Chủ tra theo chi của CUNG MỆNH (Tý Tham Lang | Sửu Hợi Cự Môn | Dần Tuất Lộc Tồn
// | Mão Dậu Văn Khúc | Thìn Thân Liêm Trinh | Tỵ Mùi Vũ Khúc | Ngọ Phá Quân)

export const MENH_CHU = ["Tham Lang", "Cự Môn", "Lộc Tồn", "Văn Khúc", "Liêm Trinh", "Vũ Khúc", "Phá Quân", "Vũ Khúc", "Liêm Trinh", "Văn Khúc", "Lộc Tồn", "Cự Môn"];
// Thân Chủ tra theo chi NĂM SINH
export const THAN_CHU = ["Linh Tinh", "Thiên Tướng", "Thiên Lương", "Thiên Đồng", "Văn Xương", "Thiên Cơ", "Hỏa Tinh", "Thiên Tướng", "Thiên Lương", "Thiên Đồng", "Văn Xương", "Thiên Cơ"];

export function calculateMenhThan(lunarMonth, hourChiIdx) {
  let menhIdx = (lunarMonth - 1 - hourChiIdx + 1200) % 12;
  let thanIdx = (lunarMonth - 1 + hourChiIdx) % 12;
  return { menhIdx, thanIdx };
}

export function calculateNgocHanhCuc(menhGridIdx, yearCanIdx) {
  // Chi of Cung Mệnh (grid 0 corresponds to Dần = Chi idx 2)
  let menhChiIdx = (menhGridIdx + 2) % 12;
  
  // Can of Cung Dần (grid 0) based on Year Can
  let danCanIdx = (yearCanIdx % 5) * 2 + 2;
  
  // Can of Cung Mệnh
  let menhCanIdx = (danCanIdx + menhGridIdx) % 10;
  let menhCanChiStr = `${CAN[menhCanIdx]} ${CHI[menhChiIdx]}`;
  
  // Get Nạp Âm of Mệnh Palace
  let napAmMenh = NAP_AM_TABLE[menhCanChiStr] || "Hải Trung Kim";
  
  // canChi/napAm của cung Mệnh: bước trung gian, ansaotudong.html không cần
  // nhưng trang an-sao-thủ-công hiển thị lại để giải thích cách ra Cục.
  const trungGian = { canChi: menhCanChiStr, napAm: napAmMenh };
  if (napAmMenh.includes("Thủy")) {
    return { name: "Thủy Nhị Cục", num: 2, element: "Thủy", ...trungGian };
  } else if (napAmMenh.includes("Mộc")) {
    return { name: "Mộc Tam Cục", num: 3, element: "Mộc", ...trungGian };
  } else if (napAmMenh.includes("Kim")) {
    return { name: "Kim Tứ Cục", num: 4, element: "Kim", ...trungGian };
  } else if (napAmMenh.includes("Thổ")) {
    return { name: "Thổ Ngũ Cục", num: 5, element: "Thổ", ...trungGian };
  } else {
    return { name: "Hỏa Lục Cục", num: 6, element: "Hỏa", ...trungGian };
  }
}

export function calculateTuViPosition(lunarDay, cucNum) {
  let remainder = lunarDay % cucNum;
  let quotient = Math.floor(lunarDay / cucNum);
  let add = 0;
  if (remainder !== 0) {
    add = cucNum - remainder;
    quotient = Math.floor((lunarDay + add) / cucNum);
  }
  let pos = quotient - 1;
  if (add > 0) {
    pos = (add % 2 === 1) ? pos - add : pos + add;
  }
  return (pos + 1200) % 12;
}

export function evaluateTuongSinh(menhEl, cucEl) {
  if (menhEl === cucEl) return "Mệnh Cục Bình Hòa";
  
  const sinh = { "Thủy": "Mộc", "Mộc": "Hỏa", "Hỏa": "Thổ", "Thổ": "Kim", "Kim": "Thủy" };
  const khac = { "Thủy": "Hỏa", "Hỏa": "Kim", "Kim": "Mộc", "Mộc": "Thổ", "Thổ": "Thủy" };

  if (sinh[cucEl] === menhEl) return "Cục Sinh Mệnh (Rất Tốt)";
  if (sinh[menhEl] === cucEl) return "Mệnh Sinh Cục";
  if (khac[cucEl] === menhEl) return "Cục Khắc Mệnh (Xấu)";
  if (khac[menhEl] === cucEl) return "Mệnh Khắc Cục";
  return "Bình Hòa";
}

// Vòng Tử Vi (6 sao, đi nghịch) và vòng Thiên Phủ (8 sao, đi thuận) — offset
// tính từ vị trí Tử Vi / Thiên Phủ. Xuất ra để trang an-sao-thủ-công hiển thị
// công thức, không phải chỉ dùng nội bộ nên không khai cục bộ trong hàm nữa.
export const TU_VI_GROUP = [
  { name: "Tử Vi", offset: 0, el: "Thổ" },
  { name: "Thiên Cơ", offset: -1, el: "Mộc" },
  { name: "Thái Dương", offset: -3, el: "Hỏa" },
  { name: "Vũ Khúc", offset: -4, el: "Kim" },
  { name: "Thiên Đồng", offset: -5, el: "Thủy" },
  { name: "Liêm Trinh", offset: -8, el: "Hỏa" }
];
export const THIEN_PHU_GROUP = [
  { name: "Thiên Phủ", offset: 0, el: "Thổ" },
  { name: "Thái Âm", offset: 1, el: "Thủy" },
  { name: "Tham Lang", offset: 2, el: "Thủy" },
  { name: "Cự Môn", offset: 3, el: "Thủy" },
  { name: "Thiên Tướng", offset: 4, el: "Thủy" },
  { name: "Thiên Lương", offset: 5, el: "Mộc" },
  { name: "Thất Sát", offset: 6, el: "Kim" },
  { name: "Phá Quân", offset: 10, el: "Thủy" }
];

export function generateTuViChart(data) {
  let { name, gender, isSolar, day, month, year, hour, minute, viewYear, isLeapMonth } = data;
  
  let viewYearCanChi = getCanChiYear(viewYear);
  let solar, lunar;
  if (isSolar) {
    solar = { day, month, year, jd: jdFromDate(day, month, year) };
    lunar = convertSolarToLunar(day, month, year);
  } else {
    solar = convertLunarToSolar(day, month, year, isLeapMonth);
    // Quy chiếu lại từ dương lịch để tháng nhuận / số ngày luôn khớp thực tế
    // (phòng khi năm đó không nhuận đúng tháng người dùng chọn)
    lunar = convertSolarToLunar(solar.day, solar.month, solar.year);
  }
  
  let yearCanChi = getCanChiYear(lunar.year);
  let monthCanChi = getCanChiMonth(lunar.month, yearCanChi.canIdx);
  let dayCanChi = getCanChiDay(lunar.jd);
  let hourCanChi = getCanChiHour(hour, dayCanChi.canIdx);

  let isYangYear = (yearCanChi.canIdx % 2 === 0);
  let isMale = (parseInt(gender) === 1);
  let amDuongNamNu = (isYangYear ? "Dương " : "Âm ") + (isMale ? "Nam" : "Nữ");
  let isThuanLy = (isYangYear && isMale) || (!isYangYear && !isMale);

  let { menhIdx, thanIdx } = calculateMenhThan(lunar.month, hourCanChi.chiIdx);
  let cuc = calculateNgocHanhCuc(menhIdx, yearCanChi.canIdx);
  let napAm = getNapAm(yearCanChi.can, yearCanChi.chi);
  let napAmEl = getNapAmElement(napAm);
  let tuongSinhText = evaluateTuongSinh(napAmEl, cuc.element);

  let tuViIdx = calculateTuViPosition(lunar.day, cuc.num);
  // Thiên Phủ đối xứng Tử Vi qua trục Dần - Thân (Tử Vi ở Dần thì Thiên Phủ cũng ở Dần)
  let thienPhuIdx = (12 - tuViIdx) % 12;

  // Từ cung Mệnh đếm nghịch: Huynh Đệ, Phu Thê, Tử Tức, Tài Bạch, Tật Ách,
  // Thiên Di, Nô Bộc, Quan Lộc, Điền Trạch, Phúc Đức, Phụ Mẫu
  const CUNG_NAMES = ["Mệnh", "Huynh Đệ", "Phu Thê", "Tử Tức", "Tài Bạch", "Tật Ách", "Thiên Di", "Nô Bộc", "Quan Lộc", "Điền Trạch", "Phúc Đức", "Phụ Mẫu"];

  // Tiểu Hạn: 1 tuổi khởi tại cung theo tam hợp chi năm sinh, nam đi thuận / nữ đi nghịch.
  // Thân Tý Thìn khởi Tuất | Tỵ Dậu Sửu khởi Mùi | Dần Ngọ Tuất khởi Thìn | Hợi Mão Mùi khởi Sửu
  const tieuHanStartGrid = [8, 5, 2, 11][yearCanChi.chiIdx % 4];

  let grid = [];

  for (let i = 0; i < 12; i++) {
    let chiIdx = (i + 2) % 12;
    let palaceNameIdx = (menhIdx - i + 12) % 12;
    
    grid.push({
      gridIdx: i,
      chiName: CHI[chiIdx],
      chiIdx: chiIdx,
      palaceName: CUNG_NAMES[palaceNameIdx],
      isMenh: i === menhIdx,
      isThan: i === thanIdx,
      chinhTinh: [],
      phuTinhTot: [],
      phuTinhXau: [],
      daiHan: 0,
      trangSinh: '',
      tieuHan: CHI[(yearCanChi.chiIdx + (isMale ? i - tieuHanStartGrid : tieuHanStartGrid - i) + 1200) % 12]
    });
  }

  // ===== Ngũ hành của sao (dùng để tô màu, theo lối lá số truyền thống) =====
  const push = (idx, name, xau) => {
    (xau ? grid[(idx + 1200) % 12].phuTinhXau : grid[(idx + 1200) % 12].phuTinhTot)
      .push({ name, el: STAR_EL[name.replace(/^L\./, "")] || "Thổ" });   // sao lưu niên "L.X" mang ngũ hành của X
  };
  const T = (chi) => (CHI.indexOf(chi) - 2 + 12) % 12;   // chi -> chỉ số lưới
  const yChi = yearCanChi.chiIdx, yCan = yearCanChi.canIdx;
  const hChi = hourCanChi.chiIdx, lMonth = lunar.month, lDay = lunar.day;
  const tamHop = yChi % 4;        // 0: Thân Tý Thìn | 1: Tỵ Dậu Sửu | 2: Dần Ngọ Tuất | 3: Hợi Mão Mùi

  // Nhân bản object của từng sao (không dùng chung tham chiếu với
  // TU_VI_GROUP/THIEN_PHU_GROUP) vì Tứ Hóa bên dưới sẽ gắn thêm thuộc tính
  // tuHoa lên đây — dùng chung tham chiếu sẽ rò rỉ giữa các lần gọi hàm.
  TU_VI_GROUP.forEach(s => grid[(tuViIdx + s.offset + 1200) % 12].chinhTinh.push({ ...s }));
  THIEN_PHU_GROUP.forEach(s => grid[(thienPhuIdx + s.offset) % 12].chinhTinh.push({ ...s }));

  // ===== Vòng Lộc Tồn: Lộc Tồn - Kình Dương - Đà La - Quốc Ấn - Đường Phù =====
  const locTonPosByCan = [0, 1, 3, 4, 3, 4, 6, 7, 9, 10];
  let locTonIdx = locTonPosByCan[yCan];
  push(locTonIdx, "Lộc Tồn");
  push(locTonIdx + 1, "Kình Dương", true);       // liền sau Lộc Tồn
  push(locTonIdx - 1, "Đà La", true);            // liền trước Lộc Tồn
  push(locTonIdx + 8, "Quốc Ấn");
  push(locTonIdx + 5, "Đường Phù");

  // ===== Vòng Bác Sĩ (12 sao): khởi Bác Sĩ tại Lộc Tồn, thuận/nghịch theo âm dương nam nữ =====
  const bacSiStars = ["Bác Sĩ", "Lực Sĩ", "Thanh Long", "Tiểu Hao", "Tướng Quân", "Tấu Thư",
                      "Phi Liêm", "Hỉ Thần", "Bệnh Phù", "Đại Hao", "Phục Binh", "Quan Phù"];
  const bacSiHung = new Set(["Tiểu Hao", "Đại Hao", "Phục Binh", "Quan Phù", "Bệnh Phù", "Phi Liêm"]);
  bacSiStars.forEach((n, i) => push(locTonIdx + (isThuanLy ? i : -i), n, bacSiHung.has(n)));

  // ===== Vòng Trường Sinh (12 sao): khởi theo Cục, thuận/nghịch theo âm dương nam nữ =====
  const truongSinhStart = { 2: T("Thân"), 3: T("Hợi"), 4: T("Tỵ"), 5: T("Thân"), 6: T("Dần") }[cuc.num];
  const truongSinhStars = ["Trường Sinh", "Mộc Dục", "Quan Đới", "Lâm Quan", "Đế Vượng", "Suy",
                           "Bệnh", "Tử", "Mộ", "Tuyệt", "Thai", "Dưỡng"];
  truongSinhStars.forEach((n, i) => {
    grid[(truongSinhStart + (isThuanLy ? i : -i) + 1200) % 12].trangSinh = n;
  });

  // ===== Sao theo giờ sinh =====
  push(8 - hChi, "Văn Xương");                   // khởi Tuất, nghịch
  push(2 + hChi, "Văn Khúc");                    // khởi Thìn, thuận
  push(9 - hChi, "Địa Không", true);             // khởi Hợi, nghịch
  push(9 + hChi, "Địa Kiếp", true);              // khởi Hợi, thuận
  push(T("Ngọ") + hChi, "Thai Phụ");             // khởi Ngọ, thuận
  push(T("Dần") + hChi, "Phong Cáo");            // khởi Dần, thuận

  // ===== Sao theo tháng sinh =====
  push(2 + (lMonth - 1), "Tả Phụ");              // khởi Thìn, thuận
  push(8 - (lMonth - 1), "Hữu Bật");             // khởi Tuất, nghịch
  push(T("Dậu") + (lMonth - 1), "Thiên Hình", true);
  push(T("Sửu") + (lMonth - 1), "Thiên Diêu", true);
  push(T("Sửu") + (lMonth - 1), "Thiên Y");
  push(T("Thân") + (lMonth - 1), "Thiên Giải");
  push(T("Mùi") + (lMonth - 1), "Địa Giải");


  // ===== Sao theo ngày sinh =====
  let taPhuIdx = (2 + (lMonth - 1)) % 12, huuBatIdx = (8 - (lMonth - 1) + 12) % 12;
  let vanXuongIdx = (8 - hChi + 12) % 12, vanKhucIdx = (2 + hChi) % 12;
  push(taPhuIdx + (lDay - 1), "Tam Thai");
  push(huuBatIdx - (lDay - 1), "Bát Tọa");
  push(vanXuongIdx + lDay - 2, "Ân Quang");      // thuận tới ngày rồi lùi 1
  push(vanKhucIdx - lDay + 2, "Thiên Quý");      // nghịch tới ngày rồi lùi 1

  // ===== Sao theo Can năm sinh =====
  // Giáp Mậu: Ngưu(Sửu)/Dương(Mùi) | Ất Kỷ: Thử(Tý)/Hầu(Thân) | Bính Đinh: Trư(Hợi)/Kê(Dậu)
  // Canh Tân: Hổ(Dần)/Mã(Ngọ)       | Nhâm Quý: Thỏ(Mão)/Xà(Tỵ)   [Dần0 Mão1 ... Tý10 Sửu11]
  const khoiVietPos = [
    { khoi: 11, viet: 5 }, { khoi: 10, viet: 6 }, { khoi: 9, viet: 7 }, { khoi: 9, viet: 7 },
    { khoi: 11, viet: 5 }, { khoi: 10, viet: 6 }, { khoi: 0, viet: 4 },  { khoi: 0, viet: 4 },
    { khoi: 1, viet: 3 }, { khoi: 1, viet: 3 }
  ];
  push(khoiVietPos[yCan].khoi, "Thiên Khôi");
  push(khoiVietPos[yCan].viet, "Thiên Việt");
  push(T(["Mùi","Thìn","Tỵ","Dần","Mão","Dậu","Hợi","Dậu","Tuất","Ngọ"][yCan]), "Thiên Quan");
  push(T(["Dậu","Thân","Tý","Hợi","Mão","Dần","Ngọ","Tỵ","Ngọ","Tỵ"][yCan]), "Thiên Phúc");
  push(T(["Tỵ","Ngọ","Tý","Tỵ","Ngọ","Thân","Dần","Ngọ","Dậu","Tuất"][yCan]), "Thiên Trù");
  push(T(["Dậu","Tuất","Mùi","Thân","Tỵ","Ngọ","Thìn","Mão","Hợi","Dần"][yCan]), "Lưu Hà", true);
  push(T(["Tỵ","Ngọ","Thân","Dậu","Thân","Dậu","Hợi","Tý","Dần","Mão"][yCan]), "Lưu Niên Văn Tinh");

  // ===== Sao theo Chi năm sinh =====
  push(T("Ngọ") - yChi, "Thiên Khốc", true);     // khởi Ngọ, nghịch
  push(T("Ngọ") + yChi, "Thiên Hư", true);       // khởi Ngọ, thuận
  push(T("Thìn") + yChi, "Long Trì");            // khởi Thìn, thuận
  push(T("Tuất") - yChi, "Phượng Các");          // khởi Tuất, nghịch
  let hongLoanIdx = (T("Mão") - yChi + 1200) % 12;
  push(hongLoanIdx, "Hồng Loan");                // khởi Mão, nghịch
  push(hongLoanIdx + 6, "Thiên Hỷ");             // xung chiếu Hồng Loan
  push(T("Tuất") - yChi, "Giải Thần");           // khởi Tuất tại tuổi Tý, đếm nghịch
  push(T("Tỵ") + yChi, "Nguyệt Đức");
  push(T("Dậu") + yChi, "Thiên Đức");
  push([T("Dậu"), T("Ngọ"), T("Mão"), T("Tý")][tamHop], "Đào Hoa");
  push([T("Thìn"), T("Sửu"), T("Tuất"), T("Mùi")][tamHop], "Hoa Cái");
  push([T("Tỵ"), T("Dần"), T("Hợi"), T("Thân")][tamHop], "Kiếp Sát", true);
  push([T("Dần"), T("Hợi"), T("Thân"), T("Tỵ")][tamHop], "Thiên Mã");
  // Cô Thần / Quả Tú theo tam hội phương (Hợi Tý Sửu | Dần Mão Thìn | Tỵ Ngọ Mùi | Thân Dậu Tuất)
  const tamHoi = Math.floor(((yChi + 1) % 12) / 3);
  push([T("Dần"), T("Tỵ"), T("Thân"), T("Hợi")][tamHoi], "Cô Thần", true);
  push([T("Tuất"), T("Sửu"), T("Thìn"), T("Mùi")][tamHoi], "Quả Tú", true);
  push(T(["Tỵ","Sửu","Dậu"][yChi % 3]), "Phá Toái", true);

  // ===== Tuần Không / Triệt Không: khoanh 2 cung liền nhau, không phải sao lẻ =====
  // Triệt cố định theo Can năm sinh: Giáp/Kỷ Thân-Dậu | Ất/Canh Ngọ-Mùi |
  // Bính/Tân Thìn-Tỵ | Đinh/Nhâm Dần-Mão | Mậu/Quý Tý-Sửu
  const trietChi = [[8, 9], [6, 7], [4, 5], [2, 3], [0, 1]][yCan % 5];
  trietChi.forEach(ci => push(ci - 2, "Triệt", true));

  // Tuần theo lục thập hoa giáp của năm sinh: 2 chi "dư" không ghép được với
  // Can trong tuần Giáp đó chính là Tuần Không.
  const tuanChi1 = (yChi - yCan + 10 + 1200) % 12;
  [tuanChi1, (tuanChi1 + 1) % 12].forEach(ci => push(ci - 2, "Tuần", true));

  // ===== Vòng Thái Tuế: khởi Thái Tuế tại cung có chi trùng chi năm sinh, đi thuận =====
  const thaiTueStars = ["Thái Tuế", "Thiếu Dương", "Tang Môn", "Thiếu Âm", "Quan Phù", "Tử Phù",
                        "Tuế Phá", "Long Đức", "Bạch Hổ", "Phúc Đức", "Điếu Khách", "Trực Phù"];
  const thaiTueHung = new Set(["Tang Môn", "Quan Phù", "Tử Phù", "Tuế Phá", "Bạch Hổ", "Điếu Khách", "Trực Phù"]);
  thaiTueStars.forEach((n, i) => push(yChi - 2 + i, n, thaiTueHung.has(n)));
  push(yChi - 2 + 1, "Thiên Không", true);       // cung liền sau Thái Tuế

  // ===== Sao theo cung =====
  push(menhIdx + yChi, "Thiên Tài");             // từ cung Mệnh đếm thuận theo chi năm
  push(thanIdx + yChi, "Thiên Thọ");             // từ cung Thân đếm thuận theo chi năm
  push(grid.findIndex(c => c.palaceName === "Nô Bộc"), "Thiên Thương", true);
  push(grid.findIndex(c => c.palaceName === "Tật Ách"), "Thiên Sứ", true);
  push(T("Thìn"), "Thiên La", true);             // cố định
  push(T("Tuất"), "Địa Võng", true);             // cố định
  push(yChi - 2 - (lMonth - 1) + hChi, "Đẩu Quân");  // Thái Tuế -> nghịch tháng -> thuận giờ

  // ===== Hỏa Tinh / Linh Tinh: khởi theo tam hợp tuổi, đếm theo giờ sinh =====
  // Dương nam âm nữ: Hỏa thuận Linh nghịch | Âm nam dương nữ: Hỏa nghịch Linh thuận
  const hoaStart = [T("Dần"), T("Mão"), T("Sửu"), T("Dậu")][tamHop];
  const linhStart = [T("Tuất"), T("Tuất"), T("Mão"), T("Tuất")][tamHop];
  push(hoaStart + (isThuanLy ? hChi : -hChi), "Hỏa Tinh", true);
  push(linhStart + (isThuanLy ? -hChi : hChi), "Linh Tinh", true);

  // ===== Tứ Hóa theo Can năm sinh =====
  const tuHoaMap = [
    ["Liêm Trinh", "Phá Quân", "Vũ Khúc", "Thái Dương"],     // Giáp
    ["Thiên Cơ", "Thiên Lương", "Tử Vi", "Thái Âm"],         // Ất
    ["Thiên Đồng", "Thiên Cơ", "Văn Xương", "Liêm Trinh"],   // Bính
    ["Thái Âm", "Thiên Đồng", "Thiên Cơ", "Cự Môn"],         // Đinh
    ["Tham Lang", "Thái Âm", "Hữu Bật", "Thiên Cơ"],         // Mậu
    ["Vũ Khúc", "Tham Lang", "Thiên Lương", "Văn Khúc"],     // Kỷ
    ["Thái Dương", "Vũ Khúc", "Thái Âm", "Thiên Đồng"],      // Canh
    ["Cự Môn", "Thái Dương", "Văn Khúc", "Văn Xương"],       // Tân
    ["Thiên Lương", "Tử Vi", "Tả Phụ", "Vũ Khúc"],           // Nhâm
    ["Phá Quân", "Cự Môn", "Thái Âm", "Tham Lang"]           // Quý
  ];
  let tuHoaStars = tuHoaMap[yCan];
  const tuHoaSuffixes = [" [H.Lộc]", " [H.Quyền]", " [H.Khoa]", " [H.Kỵ]"];
  grid.forEach(cell => {
    [cell.chinhTinh, cell.phuTinhTot, cell.phuTinhXau].forEach(group => {
      group.forEach(star => {
        let hIdx = tuHoaStars.indexOf(star.name);
        if (hIdx !== -1) star.tuHoa = tuHoaSuffixes[hIdx];
      });
    });
  });

  // ===== Sao lưu niên theo NĂM XEM HẠN (tiền tố "L.") =====
  let vCan = viewYearCanChi.canIdx, vChi = viewYearCanChi.chiIdx;
  let luuLocTon = locTonPosByCan[vCan];
  let luuThaiTue = vChi - 2;
  push(luuLocTon, "L.Lộc Tồn");
  push(luuLocTon + 1, "L.Kình Dương", true);
  push(luuLocTon - 1, "L.Đà La", true);
  push(luuThaiTue, "L.Thái Tuế");
  push(luuThaiTue + 2, "L.Tang Môn", true);
  push(luuThaiTue + 8, "L.Bạch Hổ", true);
  push([T("Dần"), T("Hợi"), T("Thân"), T("Tỵ")][vChi % 4], "L.Thiên Mã");
  push(T("Ngọ") - vChi, "L.Thiên Khốc", true);
  push(T("Ngọ") + vChi, "L.Thiên Hư", true);

  // Calculate Đại Hạn
  let startAge = cuc.num;
  for (let i = 0; i < 12; i++) {
    let step = isThuanLy ? i : (12 - i) % 12;
    let cellIdx = (menhIdx + step) % 12;
    grid[cellIdx].daiHan = startAge + i * 10;
  }

  return {
    userInfo: {
      name, 
      gender: isMale ? "Nam" : "Nữ", 
      amDuongNamNu, 
      isThuanLy,                                    // chiều an Đại Hạn / vòng sao
      amDuongThuanLy: (isYangYear === ((menhIdx + 2) % 12 % 2 === 0)),  // tuổi hợp âm dương với cung Mệnh
      solarJd: solar.jd,
      solarStr: `${solar.day}/${solar.month}/${solar.year}`,
      lunarStr: `Ngày ${lunar.day}/${lunar.month}/${lunar.year} (${lunar.isLeap ? 'Nhuận' : 'Thường'})`,
      canChiStr: `${yearCanChi.can} ${yearCanChi.chi} - ${monthCanChi.can} ${monthCanChi.chi} - ${dayCanChi.can} ${dayCanChi.chi} - ${hourCanChi.can} ${hourCanChi.chi}`,
      hourStr: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} (Giờ ${hourCanChi.can} ${hourCanChi.chi})`,
      napAm, 
      napAmEl, 
      cuc, 
      tuongSinhText,
      menhChu: MENH_CHU[(menhIdx + 2) % 12],
      thanChu: THAN_CHU[yearCanChi.chiIdx],
      viewYear,
      viewYearCanChi: `${viewYearCanChi.can} ${viewYearCanChi.chi}`
    },
    grid
  };
}
