// ============================================================================
// lib/lich.js — Đổi lịch Âm - Dương, Can Chi, Nạp Âm
//
// Thuật toán Hồ Ngọc Đức (dựa trên Astronomical Algorithms - Jean Meeus).
// JavaScript thuần, không chạm DOM: dùng được cả trong trình duyệt lẫn Node.
// Được test/ansao.test.js kiểm chứng trên 400.000 ngày.
// ============================================================================

export const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
export const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

export const NAP_AM_TABLE = {
  "Giáp Tý": "Hải Trung Kim", "Ất Sửu": "Hải Trung Kim",
  "Bính Dần": "Lư Trung Hỏa", "Đinh Mão": "Lư Trung Hỏa",
  "Mậu Thìn": "Đại Lâm Mộc", "Kỷ Tỵ": "Đại Lâm Mộc",
  "Canh Ngọ": "Lộ Bàng Thổ", "Tân Mùi": "Lộ Bàng Thổ",
  "Nhâm Thân": "Kiếm Phong Kim", "Quý Dậu": "Kiếm Phong Kim",
  "Giáp Tuất": "Sơn Đầu Hỏa", "Ất Hợi": "Sơn Đầu Hỏa",
  "Bính Tý": "Giản Hạ Thủy", "Đinh Sửu": "Giản Hạ Thủy",
  "Mậu Dần": "Thành Đầu Thổ", "Kỷ Mão": "Thành Đầu Thổ",
  "Canh Thìn": "Bạch Lạp Kim", "Tân Tỵ": "Bạch Lạp Kim",
  "Nhâm Ngọ": "Dương Liễu Mộc", "Quý Mùi": "Dương Liễu Mộc",
  "Giáp Thân": "Tuyền Trung Thủy", "Ất Dậu": "Tuyền Trung Thủy",
  "Bính Tuất": "Ốc Thượng Thổ", "Đinh Hợi": "Ốc Thượng Thổ",
  "Mậu Tý": "Tích Lịch Hỏa", "Kỷ Sửu": "Tích Lịch Hỏa",
  "Canh Dần": "Tùng Bách Mộc", "Tân Mão": "Tùng Bách Mộc",
  "Nhâm Thìn": "Trường Lưu Thủy", "Quý Tỵ": "Trường Lưu Thủy",
  "Giáp Ngọ": "Sa Trung Kim", "Ất Mùi": "Sa Trung Kim",
  "Bính Thân": "Sơn Hạ Hỏa", "Đinh Dậu": "Sơn Hạ Hỏa",
  "Mậu Tuất": "Bình Địa Mộc", "Kỷ Hợi": "Bình Địa Mộc",
  "Canh Tý": "Bích Thượng Thổ", "Tân Sửu": "Bích Thượng Thổ",
  "Nhâm Dần": "Kim Bạc Kim", "Quý Mão": "Kim Bạc Kim",
  "Giáp Thìn": "Phúc Đăng Hỏa", "Ất Tỵ": "Phúc Đăng Hỏa",
  "Bính Ngọ": "Thiên Hà Thủy", "Đinh Mùi": "Thiên Hà Thủy",
  "Mậu Thân": "Đại Trạch Thổ", "Kỷ Dậu": "Đại Trạch Thổ",
  "Canh Tuất": "Thoa Xuyên Kim", "Tân Hợi": "Thoa Xuyên Kim",
  "Nhâm Tý": "Tang Đố Mộc", "Quý Sửu": "Tang Đố Mộc",
  "Giáp Dần": "Đại Khê Thủy", "Ất Mão": "Đại Khê Thủy",
  "Bính Thìn": "Sa Trung Thổ", "Đinh Tỵ": "Sa Trung Thổ",
  "Mậu Ngọ": "Thiên Thượng Hỏa", "Kỷ Mùi": "Thiên Thượng Hỏa",
  "Canh Thân": "Thạch Lựu Mộc", "Tân Dậu": "Thạch Lựu Mộc",
  "Nhâm Tuất": "Đại Hải Thủy", "Quý Hợi": "Đại Hải Thủy"
};

// ==========================================================
// Lõi lịch âm - thuật toán Hồ Ngọc Đức (dựa trên Astronomical
// Algorithms - Jean Meeus). Múi giờ mặc định GMT+7.
// ==========================================================

// Dương lịch -> số ngày Julian (JDN)
export function jdFromDate(dd, mm, yyyy) {
  let a = Math.floor((14 - mm) / 12);
  let y = yyyy + 4800 - a;
  let m = mm + 12 * a - 3;
  let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jd;
}

// JDN -> dương lịch
export function jdToSolar(jd) {
  let a, b, c;
  if (jd > 2299160) {
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  let d = Math.floor((4 * c + 3) / 1461);
  let e = c - Math.floor((1461 * d) / 4);
  let m = Math.floor((5 * e + 2) / 153);
  let day = e - Math.floor((153 * m + 2) / 5) + 1;
  let month = m + 3 - 12 * Math.floor(m / 10);
  let year = b * 100 + d - 4800 + Math.floor(m / 10);
  return { day, month, year };
}

// Thời điểm Sóc (trăng mới) thứ k tính từ 1/1/1900, trả về JD thực
export function newMoonJd(k) {
  let T = k / 1236.85;
  let T2 = T * T;
  let T3 = T2 * T;
  let dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;   // dị thường Mặt Trời
  let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3; // dị thường Mặt Trăng
  let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;    // đối số vĩ độ Mặt Trăng
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  return Jd1 + C1 - deltat;
}

// Ngày (JDN theo múi giờ địa phương) chứa điểm Sóc thứ k
export function getNewMoonDay(k, timeZone) {
  return Math.floor(newMoonJd(k) + 0.5 + timeZone / 24);
}

// Kinh độ Mặt Trời (radian) tại thời điểm jdn
export function sunLongitudeRad(jdn) {
  let T = (jdn - 2451545.0) / 36525;
  let T2 = T * T;
  let dr = Math.PI / 180;
  let M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  let L = (L0 + DL) * dr;
  L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
  return L;
}

// Kinh độ Mặt Trời quy về cung 30 độ (0..11) lúc 0h địa phương của ngày jdn
export function getSunLongitude(jdn, timeZone) {
  return Math.floor(sunLongitudeRad(jdn - 0.5 - timeZone / 24) / Math.PI * 6);
}

// Ngày Sóc của tháng 11 âm lịch (tháng chứa Đông chí) của năm dương yy
export function getLunarMonth11(yy, timeZone) {
  let off = jdFromDate(31, 12, yy) - 2415021;
  let k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  let sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

// Offset của tháng nhuận so với tháng 11: tháng nhuận là tháng
// KHÔNG chứa Trung khí (kinh độ Mặt Trời không sang cung mới)
export function getLeapMonthOffset(a11, timeZone) {
  let k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc != last && i < 14);
  return i - 1;
}

export function convertSolarToLunar(dd, mm, yyyy, timeZone = 7) {
  let dayNumber = jdFromDate(dd, mm, yyyy);
  let k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }

  let a11 = getLunarMonth11(yyyy, timeZone);
  let b11 = a11;
  let lunarYear;
  if (a11 >= monthStart) {
    lunarYear = yyyy;
    a11 = getLunarMonth11(yyyy - 1, timeZone);
  } else {
    lunarYear = yyyy + 1;
    b11 = getLunarMonth11(yyyy + 1, timeZone);
  }

  let lunarDay = dayNumber - monthStart + 1;
  let diff = Math.floor((monthStart - a11) / 29);
  let isLeap = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    let leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff == leapMonthDiff) isLeap = true;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;

  return { day: lunarDay, month: lunarMonth, year: lunarYear, isLeap, jd: dayNumber };
}

export function convertLunarToSolar(lunarDay, lunarMonth, lunarYear, isLeap = false, timeZone = 7) {
  let a11, b11;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }

  let off = lunarMonth - 11;
  if (off < 0) off += 12;

  if (b11 - a11 > 365) {
    let leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    // Năm không nhuận đúng tháng người dùng chọn -> coi như tháng thường
    if (isLeap && lunarMonth != leapMonth) isLeap = false;
    if (isLeap || off >= leapOff) off += 1;
  }

  let k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + off, timeZone);
  let targetJd = monthStart + lunarDay - 1;
  let solar = jdToSolar(targetJd);
  return { day: solar.day, month: solar.month, year: solar.year, jd: targetJd };
}

export function getCanChiYear(year) {
  let canIdx = (year - 4) % 10;
  if (canIdx < 0) canIdx += 10;
  let chiIdx = (year - 4) % 12;
  if (chiIdx < 0) chiIdx += 12;
  return { can: CAN[canIdx], chi: CHI[chiIdx], canIdx, chiIdx };
}

export function getCanChiMonth(lunarMonth, yearCanIdx) {
  let monthCanStart = (yearCanIdx % 5) * 2 + 2;
  let monthCanIdx = (monthCanStart + (lunarMonth - 1)) % 10;
  let monthChiIdx = (lunarMonth + 1) % 12;
  return { can: CAN[monthCanIdx], chi: CHI[monthChiIdx], canIdx: monthCanIdx, chiIdx: monthChiIdx };
}

export function getCanChiDay(jd) {
  let canIdx = (jd + 9) % 10;
  let chiIdx = (jd + 1) % 12;
  return { can: CAN[canIdx], chi: CHI[chiIdx], canIdx, chiIdx };
}

export function getCanChiHour(hour, dayCanIdx) {
  let hourChiIdx = Math.floor((hour + 1) / 2) % 12;
  let hourCanStart = (dayCanIdx % 5) * 2;
  let hourCanIdx = (hourCanStart + hourChiIdx) % 10;
  return { can: CAN[hourCanIdx], chi: CHI[hourChiIdx], canIdx: hourCanIdx, chiIdx: hourChiIdx };
}

export function getNapAm(canStr, chiStr) {
  let key = `${canStr} ${chiStr}`;
  return NAP_AM_TABLE[key] || "Kim Bạc Kim";
}

export function getNapAmElement(napAmStr) {
  if (napAmStr.includes("Kim")) return "Kim";
  if (napAmStr.includes("Mộc")) return "Mộc";
  if (napAmStr.includes("Thủy")) return "Thủy";
  if (napAmStr.includes("Hỏa")) return "Hỏa";
  return "Thổ";
}
