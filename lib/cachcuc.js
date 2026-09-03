// ============================================================================
// lib/cachcuc.js — Engine đối chiếu tự động 94 cách cục cổ điển (data/cach-cuc.json)
// với một lá số đã tính sẵn (output của generateTuViChart() trong lib/ansao.js).
//
// khopCachCuc(chart) -> Promise<Array<cách cục + { khop, doTinCay, lyDo }>>
// Các điều kiện (dieuKien) là văn xuôi tự do, nên engine này chỉ bắt được PHẦN
// KIỂM TRA ĐƯỢC BẰNG DỮ LIỆU (vị trí sao, miếu/vượng, Tứ Hóa, Sát/Không Kiếp,
// tam hợp/xung chiếu/giáp cung). Những phần mang tính chủ quan (trùng điệp,
// ngày/đêm sinh ước lượng từ giờ, v.v.) được đánh dấu doTinCay thấp hơn thay vì
// bỏ qua — vẫn cần đọc lại refs/ trước khi kết luận chắc chắn.
// ============================================================================

import { getDoSang, getSao, getCachCuc } from './repo.js';

const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const CHI_IDX = Object.fromEntries(CHI.map((c, i) => [c, i]));
const CHI_DO_SANG = { "Tỵ": "Tị" }; // data/do-sang.json ghi "Tị", ansao.js/lich.js ghi "Tỵ"

const TU_SAT = ["Kình Dương", "Đà La", "Hỏa Tinh", "Linh Tinh"];
const KHONG_KIEP = ["Địa Không", "Địa Kiếp"];
const LUC_CAT = ["Văn Xương", "Văn Khúc", "Tả Phụ", "Hữu Bật", "Thiên Khôi", "Thiên Việt"];
const CAT_TINH_RONG = [...LUC_CAT, "Lộc Tồn", "Thiên Mã"];
// Lục hợp: Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi
const LUC_HOP = { 0: 1, 1: 0, 2: 11, 11: 2, 3: 10, 10: 3, 4: 9, 9: 4, 5: 8, 8: 5, 6: 7, 7: 6 };

const tamHop = (i) => [i, (i + 4) % 12, (i + 8) % 12];
const xungChieu = (i) => (i + 6) % 12;
const giap = (i) => [(i + 11) % 12, (i + 1) % 12];
const tamPhuong = (i) => tamHop(i).filter((x) => x !== i); // 2 cung tam hợp, không tính chính cung
const tuChinh = (i) => [...tamHop(i), xungChieu(i)]; // 4 cung: chính cung + 2 tam hợp + 1 xung chiếu
const tuChinhKhongTuThan = (i) => [...tamPhuong(i), xungChieu(i)]; // 3 cung, không tính chính cung

const saoTrongO = (o) => [...o.chinhTinh, ...o.phuTinhTot, ...o.phuTinhXau];
const laNguyenCuc = (ten) => !ten.startsWith("L.");
const tenGoc = (ten) => ten.replace(/^L\./, "");
const mieuVuong = (h) => h === "M" || h === "V";
const ham = (h) => h === "H";

function timChinhTinhBiKep(ctx, [tenA, tenB]) {
  const ketQua = [];
  for (const o of ctx.grid) {
    if (!o.chinhTinh.length) continue;
    const [truoc, sau] = giap(o.chiIdx).map((i) => ctx.oTaiChi(i));
    const co = (o2, ten) => !!o2 && saoTrongO(o2).some((s) => tenGoc(s.name) === ten && laNguyenCuc(s.name));
    if ((co(truoc, tenA) && co(sau, tenB)) || (co(truoc, tenB) && co(sau, tenA))) ketQua.push(o);
  }
  return ketQua;
}

function taoBoiCanh(chart, { doSang, saoList }) {
  const { grid, userInfo } = chart;
  const menh = grid.find((c) => c.isMenh);
  const than = grid.find((c) => c.isThan);
  const tenToId = Object.fromEntries(saoList.map((s) => [s.ten, s.id]));

  const tuHoa = {};
  for (const o of grid) {
    for (const s of [...o.chinhTinh, ...o.phuTinhTot]) {
      const m = s.tuHoa && s.tuHoa.match(/H\.(Lộc|Quyền|Khoa|Kỵ)/);
      if (m) tuHoa[m[1]] = { ten: s.name, o };
    }
  }

  const oTaiChi = (i) => grid.find((c) => c.chiIdx === i);
  const oCungChuc = (ten) => grid.find((c) => c.palaceName === ten);

  const timSao = (ten, { choPhepLuu = false } = {}) => {
    const ket = [];
    for (const o of grid) {
      for (const s of saoTrongO(o)) {
        if (tenGoc(s.name) !== ten) continue;
        if (laNguyenCuc(s.name) || choPhepLuu) ket.push({ o, luu: !laNguyenCuc(s.name), tuHoa: s.tuHoa });
      }
    }
    return ket;
  };

  const coSaoTaiCung = (tenSaoList, chiIdxList, { choPhepLuu = false } = {}) =>
    chiIdxList.some((i) => {
      const o = oTaiChi(i);
      return !!o && saoTrongO(o).some((s) => tenSaoList.includes(tenGoc(s.name)) && (laNguyenCuc(s.name) || choPhepLuu));
    });

  const tuSatTaiCung = (chiIdxList, opt) => coSaoTaiCung(TU_SAT, chiIdxList, opt);
  const khongKiepTaiCung = (chiIdxList, opt) => coSaoTaiCung(KHONG_KIEP, chiIdxList, opt);
  const voSatTaiCung = (chiIdxList, opt) => !tuSatTaiCung(chiIdxList, opt) && !khongKiepTaiCung(chiIdxList, opt);
  const catTinhTaiCung = (chiIdxList, opt) =>
    coSaoTaiCung(CAT_TINH_RONG, chiIdxList, opt) ||
    ["Lộc", "Quyền", "Khoa"].some((h) => tuHoa[h] && chiIdxList.includes(tuHoa[h].o.chiIdx));

  const hangSao = (tenSao, chiName) => {
    const id = tenToId[tenSao];
    if (!id || !doSang[id]) return null;
    return doSang[id][CHI_DO_SANG[chiName] || chiName] || null;
  };

  const viTriChinhTinh = (tenSao) =>
    grid.filter((o) => o.chinhTinh.some((s) => s.name === tenSao))
      .map((o) => ({ o, chiIdx: o.chiIdx, hang: hangSao(tenSao, o.chiName) }));

  const namCan = (userInfo.canChiStr || "").split(" - ")[0].split(" ")[0] || null;
  const gioMatch = (userInfo.hourStr || "").match(/^(\d{1,2}):/);
  const gio = gioMatch ? parseInt(gioMatch[1], 10) : null;
  const banNgay = gio === null ? null : gio >= 5 && gio < 19;

  return {
    grid, userInfo, menh, than, tuHoa, namCan, banNgay,
    oTaiChi, oCungChuc, timSao, coSaoTaiCung, tuSatTaiCung, khongKiepTaiCung,
    voSatTaiCung, catTinhTaiCung, hangSao, viTriChinhTinh,
  };
}

/** Mẫu dùng chung cho rất nhiều cách "X tọa Mệnh [tại chi Y] [tuổi Z] [ngày/đêm], vô Sát, có cát". */
function toaMenhVoSatCoCat(ctx, tenChinhTinh, { chi = null, canGomTrong = null, banNgayCanCo = null, boQuaCat = false } = {}) {
  if (!ctx.menh.chinhTinh.some((s) => s.name === tenChinhTinh))
    return { khop: false, doTinCay: "cao", lyDo: `Mệnh không phải ${tenChinhTinh} (Mệnh là ${ctx.menh.chinhTinh.map((s) => s.name).join(", ") || "Vô Chính Diệu"}).` };
  if (chi && ctx.menh.chiName !== chi)
    return { khop: false, doTinCay: "cao", lyDo: `${tenChinhTinh} tọa Mệnh nhưng tại ${ctx.menh.chiName}, không phải ${chi}.` };
  if (canGomTrong && !canGomTrong.includes(ctx.namCan))
    return { khop: false, doTinCay: "cao", lyDo: `Năm sinh Can ${ctx.namCan}, không thuộc nhóm ${canGomTrong.join("/")} mà cách yêu cầu.` };
  if (banNgayCanCo !== null && ctx.banNgay !== banNgayCanCo)
    return { khop: false, doTinCay: "thap", lyDo: `Cách yêu cầu sinh ban ${banNgayCanCo ? "ngày" : "đêm"}, giờ sinh ước lượng không khớp.` };
  const idx = ctx.menh.chiIdx;
  if (!ctx.voSatTaiCung(tuChinh(idx)))
    return { khop: false, doTinCay: "cao", lyDo: `${tenChinhTinh} tọa Mệnh nhưng tứ chính Mệnh có Sát tinh/Không Kiếp nguyên cục.` };
  if (boQuaCat) return { khop: true, doTinCay: "trungbinh", lyDo: `${tenChinhTinh} tọa Mệnh đúng vị trí yêu cầu, vô Sát tại tứ chính.` };
  const coCat = ctx.catTinhTaiCung(tuChinh(idx));
  return coCat
    ? { khop: true, doTinCay: "cao", lyDo: `${tenChinhTinh} tọa Mệnh, vô Sát, có cát tinh/Tứ Hóa tốt tại tứ chính Mệnh.` }
    : { khop: false, doTinCay: "trungbinh", lyDo: `${tenChinhTinh} tọa Mệnh, vô Sát, nhưng chưa thấy cát tinh rõ rệt tại tứ chính Mệnh.` };
}

function khongDu(lyDo) { return { khop: false, doTinCay: "cao", lyDo }; }

const RULES = {
  "tam-ky-giai-hoi": (ctx) => {
    const idxs = ["Mệnh", "Tài Bạch", "Quan Lộc", "Thiên Di"].map((t) => ctx.oCungChuc(t).chiIdx);
    const du = ["Khoa", "Quyền", "Lộc"].every((h) => ctx.tuHoa[h] && idxs.includes(ctx.tuHoa[h].o.chiIdx));
    if (!du) return khongDu("Không đủ cả 3 Hóa Khoa/Quyền/Lộc cùng nằm trong 4 cung Mệnh-Tài-Quan-Di.");
    const vSat = idxs.every((i) => ctx.voSatTaiCung([i]));
    return vSat
      ? { khop: true, doTinCay: "cao", lyDo: "Đủ Tam Hóa trong Mệnh-Tài-Quan-Di, không có Sát tại 4 cung này." }
      : khongDu("Đủ Tam Hóa nhưng có Sát tinh tại một trong 4 cung Mệnh-Tài-Quan-Di.");
  },
  "tam-ky-trieu-dau": (ctx) => {
    if (!ctx.menh.chinhTinh.some((s) => s.name === "Tử Vi")) return khongDu("Mệnh không phải Tử Vi.");
    const cung3 = tuChinhKhongTuThan(ctx.menh.chiIdx);
    const du = ["Khoa", "Quyền", "Lộc"].every((h) => ctx.tuHoa[h] && cung3.includes(ctx.tuHoa[h].o.chiIdx));
    if (!du) return khongDu("Tử Vi tọa Mệnh nhưng tam phương tứ chính không đủ cả 3 Hóa Khoa/Quyền/Lộc.");
    return ctx.voSatTaiCung(tuChinh(ctx.menh.chiIdx))
      ? { khop: true, doTinCay: "cao", lyDo: "Tử Vi tọa Mệnh, tam phương tứ chính đủ Tam Hóa, vô Sát." }
      : khongDu("Đủ điều kiện Tam Hóa nhưng tứ chính Mệnh có Sát tinh.");
  },
  "tu-phu-dong-cung": (ctx) => {
    const co = ctx.menh.chinhTinh.some((s) => s.name === "Tử Vi") && ctx.menh.chinhTinh.some((s) => s.name === "Thiên Phủ");
    if (!co || !["Dần", "Thân"].includes(ctx.menh.chiName)) return khongDu("Mệnh không phải Tử Vi + Thiên Phủ đồng cung tại Dần/Thân.");
    const taHuu = ctx.coSaoTaiCung(["Tả Phụ", "Hữu Bật"], tuChinh(ctx.menh.chiIdx));
    if (!taHuu) return khongDu("Tử Phủ đồng cung đúng vị trí nhưng không thấy Tả Phụ/Hữu Bật thủ chiếu.");
    return ctx.voSatTaiCung(tuChinh(ctx.menh.chiIdx))
      ? { khop: true, doTinCay: "cao", lyDo: "Tử Phủ đồng cung tại Dần/Thân, có Tả Hữu, vô Sát." }
      : khongDu("Có Tả Hữu nhưng tứ chính Mệnh có Sát tinh.");
  },
  "tu-phu-trieu-vien": (ctx) => {
    const viTriTV = ctx.viTriChinhTinh("Tử Vi")[0], viTriTP = ctx.viTriChinhTinh("Thiên Phủ")[0];
    if (!viTriTV || !viTriTP) return khongDu("Không xác định được vị trí Tử Vi/Thiên Phủ.");
    const idx = ctx.menh.chiIdx;
    const trongTamPhuong = tamPhuong(idx).includes(viTriTV.chiIdx) && tamPhuong(idx).includes(viTriTP.chiIdx);
    const [truoc, sau] = giap(idx);
    const kepHaiBenA = viTriTV.chiIdx === truoc && viTriTP.chiIdx === sau;
    const kepHaiBenB = viTriTP.chiIdx === truoc && viTriTV.chiIdx === sau;
    if (!trongTamPhuong && !kepHaiBenA && !kepHaiBenB) return khongDu("Tử Vi, Thiên Phủ không ở tam phương Mệnh và không kẹp hai bên Mệnh.");
    const hangMenh = ctx.menh.chinhTinh[0] ? ctx.hangSao(ctx.menh.chinhTinh[0].name, ctx.menh.chiName) : null;
    if (!mieuVuong(hangMenh)) return khongDu("Tử Phủ hội/kẹp Mệnh đúng nhưng chính tinh cung Mệnh không miếu vượng (hoặc Vô Chính Diệu).");
    return ctx.catTinhTaiCung(tuChinh(idx))
      ? { khop: true, doTinCay: "cao", lyDo: "Tử Phủ hội chiếu/kẹp Mệnh, Mệnh miếu vượng, có cát tinh." }
      : khongDu("Tử Phủ hội/kẹp Mệnh, Mệnh miếu vượng, nhưng chưa thấy cát tinh tại tứ chính.");
  },
  "tu-phu-giap-menh": (ctx) => {
    if (!["Dần", "Thân"].includes(ctx.menh.chiName)) return khongDu("Mệnh không cư Dần/Thân.");
    const idx = ctx.menh.chiIdx;
    const viTriTV = ctx.viTriChinhTinh("Tử Vi")[0], viTriTP = ctx.viTriChinhTinh("Thiên Phủ")[0];
    const [truoc, sau] = giap(idx);
    const kep = viTriTV && viTriTP && ((viTriTV.chiIdx === truoc && viTriTP.chiIdx === sau) || (viTriTP.chiIdx === truoc && viTriTV.chiIdx === sau));
    if (!kep) return khongDu("Mệnh cư Dần/Thân nhưng Tử Vi, Thiên Phủ không đóng ở hai cung kẹp Mệnh.");
    if (!ctx.voSatTaiCung(tuChinh(idx))) return khongDu("Tử Phủ giáp Mệnh đúng vị trí nhưng có Sát tại tứ chính.");
    return ctx.catTinhTaiCung(tuChinh(idx))
      ? { khop: true, doTinCay: "cao", lyDo: "Mệnh cư Dần/Thân được Tử Vi, Thiên Phủ giáp hai bên, vô Sát, có cát." }
      : khongDu("Tử Phủ giáp Mệnh, vô Sát, nhưng chưa thấy cát tinh rõ.");
  },
  "nhat-chieu-loi-mon": (ctx) => {
    const c1 = toaMenhVoSatCoCat(ctx, "Thái Dương", { chi: "Mão", banNgayCanCo: true, boQuaCat: true });
    if (c1.khop) return { ...c1, lyDo: "Thái Dương tọa Mệnh tại Mão, sinh ban ngày (ước lượng theo giờ)." };
    const luuCat = LUC_CAT.every((t) => ctx.coSaoTaiCung([t], tuChinh(ctx.menh.chiIdx)));
    if (luuCat && ["Giáp", "Ất"].includes(ctx.namCan) && ctx.banNgay === false)
      return { khop: true, doTinCay: "thap", lyDo: "Hội đủ lục cát tinh tại tứ chính Mệnh, tuổi Giáp/Ất, ước lượng sinh ban đêm." };
    return khongDu("Không phải Thái Dương tọa Mệnh tại Mão ban ngày, cũng không hội đủ lục cát cho tuổi Giáp/Ất sinh đêm.");
  },
  "tuong-tinh-dac-dia": (ctx) => toaMenhVoSatCoCat(ctx, "Vũ Khúc"),
  "tu-chinh-dong-lam": (ctx) => {
    const co = ctx.menh.chinhTinh.some((s) => s.name === "Tử Vi") && ctx.menh.chinhTinh.some((s) => s.name === "Thiên Phủ");
    if (!co) return khongDu("Mệnh không phải Tử Vi + Thiên Phủ đồng cung.");
    const nhatHoi = ["Thái Dương", "Thái Âm"].some((t) => {
      const vt = ctx.viTriChinhTinh(t)[0];
      return vt && tuChinh(ctx.menh.chiIdx).includes(vt.chiIdx) && mieuVuong(vt.hang);
    });
    return nhatHoi
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Tử Phủ tọa Mệnh, có Nhật hoặc Nguyệt vượng địa hội về tứ chính." }
      : khongDu("Tử Phủ tọa Mệnh nhưng không có Nhật/Nguyệt vượng địa hội về tứ chính Mệnh.");
  },
  "phu-bat-cung-chu": (ctx) => {
    if (!ctx.menh.chinhTinh.some((s) => s.name === "Tử Vi")) return khongDu("Mệnh không phải Tử Vi.");
    const taHuu = ctx.coSaoTaiCung(["Tả Phụ", "Hữu Bật"], tuChinhKhongTuThan(ctx.menh.chiIdx));
    return taHuu
      ? { khop: true, doTinCay: "cao", lyDo: "Tử Vi tọa Mệnh, có Tả Phụ/Hữu Bật hội chiếu hoặc kẹp." }
      : khongDu("Tử Vi tọa Mệnh nhưng không có Tả Hữu hội/kẹp.");
  },
  "cuc-huong-ly-minh": (ctx) => toaMenhVoSatCoCat(ctx, "Tử Vi", { chi: "Ngọ", canGomTrong: ["Giáp", "Đinh", "Kỷ"] }),
  "quan-than-khanh-hoi": (ctx) => {
    if (!ctx.menh.chinhTinh.some((s) => s.name === "Tử Vi")) return khongDu("Mệnh không phải Tử Vi.");
    const dongCung = ctx.coSaoTaiCung(["Tả Phụ", "Hữu Bật"], [ctx.menh.chiIdx]);
    const hoiDu3 = [["Tả Phụ", "Hữu Bật"], ["Văn Xương", "Văn Khúc"], ["Thiên Khôi", "Thiên Việt"]]
      .filter((cap) => ctx.coSaoTaiCung(cap, tuChinh(ctx.menh.chiIdx))).length >= 2;
    if (!dongCung && !hoiDu3) return khongDu("Tử Vi tọa Mệnh nhưng không đồng cung Tả Hữu, cũng chưa hội đủ các cặp phụ tinh yêu cầu.");
    return ctx.voSatTaiCung(tuChinh(ctx.menh.chiIdx))
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Tử Vi tọa Mệnh cùng Tả Hữu hoặc đủ các cặp phụ tinh quý, vô Sát Kị." }
      : khongDu("Đủ tổ hợp phụ tinh nhưng có Sát Kị tại tứ chính.");
  },
  "nhat-nguyet-giap-menh": (ctx) => {
    if (!["Sửu", "Mùi"].includes(ctx.menh.chiName)) return khongDu("Mệnh không cư Sửu/Mùi.");
    const [truoc, sau] = giap(ctx.menh.chiIdx);
    const nhat = ctx.viTriChinhTinh("Thái Dương")[0], nguyet = ctx.viTriChinhTinh("Thái Âm")[0];
    const kep = nhat && nguyet && ((nhat.chiIdx === truoc && nguyet.chiIdx === sau) || (nguyet.chiIdx === truoc && nhat.chiIdx === sau))
      && mieuVuong(nhat.hang) && mieuVuong(nguyet.hang);
    if (!kep) return khongDu("Mệnh cư Sửu/Mùi nhưng Nhật Nguyệt không miếu vượng giáp đúng hai bên.");
    const hangMenh = ctx.menh.chinhTinh[0] ? ctx.hangSao(ctx.menh.chinhTinh[0].name, ctx.menh.chiName) : null;
    return mieuVuong(hangMenh)
      ? { khop: true, doTinCay: "cao", lyDo: "Mệnh cư Sửu/Mùi được Nhật Nguyệt miếu vượng giáp, chính tinh Mệnh vượng cát." }
      : khongDu("Nhật Nguyệt giáp Mệnh đúng nhưng chính tinh Mệnh không vượng cát (hoặc Vô Chính Diệu).");
  },
  "nhat-nguyet-tinh-minh": (ctx) => {
    if (ctx.menh.chiName !== "Sửu") return khongDu("Mệnh không an tại Sửu.");
    const nhat = ctx.viTriChinhTinh("Thái Dương")[0], nguyet = ctx.viTriChinhTinh("Thái Âm")[0];
    const dung = nhat && nguyet && nhat.chiIdx === CHI_IDX["Tỵ"] && nguyet.chiIdx === CHI_IDX["Dậu"];
    if (!dung) return khongDu("Mệnh tại Sửu nhưng Thái Dương/Thái Âm không đúng vị trí Tỵ/Dậu.");
    const hangMenh = ctx.menh.chinhTinh[0] ? ctx.hangSao(ctx.menh.chinhTinh[0].name, ctx.menh.chiName) : null;
    return mieuVuong(hangMenh)
      ? { khop: true, doTinCay: "cao", lyDo: "Mệnh tại Sửu, Thái Dương ở Tỵ, Thái Âm ở Dậu, chính tinh Mệnh vượng cát." }
      : khongDu("Đúng cách Nhật Nguyệt Tịnh Minh nhưng chính tinh Mệnh không vượng cát.");
  },
  "nhat-nguyet-chieu-menh": (ctx) => {
    if (!["Sửu", "Mùi"].includes(ctx.menh.chiName)) return khongDu("Mệnh không an tại Sửu/Mùi.");
    const doi = ctx.oTaiChi(xungChieu(ctx.menh.chiIdx));
    const co = doi && doi.chinhTinh.some((s) => s.name === "Thái Dương") && doi.chinhTinh.some((s) => s.name === "Thái Âm");
    return co
      ? { khop: true, doTinCay: "cao", lyDo: "Nhật Nguyệt đồng cung tại cung đối diện Mệnh, xung chiếu về." }
      : khongDu("Không có Nhật Nguyệt đồng cung tại cung xung chiếu Mệnh.");
  },
  "nhat-le-trung-thien": (ctx) => toaMenhVoSatCoCat(ctx, "Thái Dương", { chi: "Ngọ", canGomTrong: ["Canh", "Tân"], banNgayCanCo: true }),
  "phu-tuong-trieu-vien": (ctx) => {
    const tp = ctx.viTriChinhTinh("Thiên Phủ")[0], tt = ctx.viTriChinhTinh("Thiên Tướng")[0];
    if (!tp || !tt) return khongDu("Không xác định được vị trí Thiên Phủ/Thiên Tướng.");
    const idx = ctx.menh.chiIdx;
    const oTamPhuong = tamPhuong(idx).includes(tp.chiIdx) && tamPhuong(idx).includes(tt.chiIdx);
    if (!oTamPhuong) return khongDu("Thiên Phủ, Thiên Tướng không cùng ở tam phương Mệnh.");
    const hangMenh = ctx.menh.chinhTinh[0] ? ctx.hangSao(ctx.menh.chinhTinh[0].name, ctx.menh.chiName) : null;
    if (!mieuVuong(hangMenh)) return khongDu("Phủ Tướng ở tam phương Mệnh nhưng chính tinh Mệnh không miếu vượng.");
    return ctx.catTinhTaiCung(tuChinh(idx)) && ctx.voSatTaiCung(tuChinh(idx))
      ? { khop: true, doTinCay: "cao", lyDo: "Thiên Phủ, Thiên Tướng ở tam phương Mệnh, Mệnh miếu vượng, có cát vô Sát." }
      : khongDu("Phủ Tướng ở tam phương Mệnh, Mệnh miếu vượng, nhưng thiếu cát tinh hoặc có Sát.");
  },
  "toa-quy-huong-quy": (ctx) => {
    const khoi = ctx.viTriChinhTinh ? ctx.timSao("Thiên Khôi")[0] : null;
    const viet = ctx.timSao("Thiên Việt")[0];
    if (!khoi || !viet) return khongDu("Không thấy đủ Thiên Khôi và Thiên Việt nguyên cục.");
    const idx = ctx.menh.chiIdx;
    const caseA = khoi.o.chiIdx === idx && viet.o.chiIdx === xungChieu(idx);
    const caseB = viet.o.chiIdx === idx && khoi.o.chiIdx === xungChieu(idx);
    const caseC = (khoi.o.chiIdx === idx && viet.o.chiIdx === ctx.than.chiIdx) || (viet.o.chiIdx === idx && khoi.o.chiIdx === ctx.than.chiIdx);
    if (!caseA && !caseB && !caseC) return khongDu("Thiên Khôi, Thiên Việt không tọa Mệnh/xung chiếu, cũng không chia nhau Mệnh-Thân.");
    const hangMenh = ctx.menh.chinhTinh[0] ? ctx.hangSao(ctx.menh.chinhTinh[0].name, ctx.menh.chiName) : null;
    return mieuVuong(hangMenh)
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Thiên Khôi, Thiên Việt tọa Mệnh/xung chiếu hoặc chia Mệnh-Thân, chính tinh Mệnh miếu vượng." }
      : khongDu("Tọa Quý Hướng Quý đúng vị trí nhưng chính tinh Mệnh không miếu vượng.");
  },
  "thach-trung-an-ngoc": (ctx) => {
    if (!["Tý", "Ngọ"].includes(ctx.menh.chiName) || !ctx.menh.chinhTinh.some((s) => s.name === "Cự Môn")) return khongDu("Mệnh không phải Cự Môn tại Tý/Ngọ.");
    const coHoa = ["Khoa", "Quyền", "Lộc"].some((h) => ctx.tuHoa[h] && tuChinh(ctx.menh.chiIdx).includes(ctx.tuHoa[h].o.chiIdx));
    if (!coHoa) return khongDu("Cự Môn tọa Mệnh tại Tý/Ngọ nhưng không có Hóa Khoa/Quyền/Lộc nào hội tại tứ chính.");
    return ctx.voSatTaiCung(tuChinh(ctx.menh.chiIdx))
      ? { khop: true, doTinCay: "cao", lyDo: "Cự Môn tọa Mệnh tại Tý/Ngọ, có 1 trong Tam Hóa hội, vô Sát." }
      : khongDu("Có Hóa tinh hội nhưng tứ chính Mệnh có Sát.");
  },
  "that-sat-trieu-dau": (ctx) => {
    if (!["Dần", "Thân"].includes(ctx.menh.chiName) || !ctx.menh.chinhTinh.some((s) => s.name === "Thất Sát")) return khongDu("Mệnh không phải Thất Sát tại Dần/Thân.");
    const tv = ctx.viTriChinhTinh("Tử Vi")[0];
    if (!tv || tv.chiIdx !== xungChieu(ctx.menh.chiIdx)) return khongDu("Thất Sát tọa Mệnh Dần/Thân nhưng Tử Vi không ở cung xung chiếu.");
    const catDu = LUC_CAT.filter((t) => ctx.coSaoTaiCung([t], tuChinh(ctx.menh.chiIdx))).length >= 3;
    if (!catDu) return khongDu("Tử Vi xung chiếu đúng nhưng chưa hội đủ nhiều lục cát tinh (cần lục cát tinh hội thủ).");
    return ctx.voSatTaiCung(tuChinh(ctx.menh.chiIdx))
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Thất Sát tọa Mệnh Dần/Thân, Tử Vi xung chiếu, nhiều cát tinh hội, vô thêm Sát khác." }
      : khongDu("Đủ Tử Vi triều Đẩu và cát tinh nhưng lại có thêm Sát tinh — theo cách này thì không đúng cách.");
  },
  "song-loc-trieu-vien": (ctx) => {
    const locTon = ctx.timSao("Lộc Tồn")[0];
    if (!locTon || !ctx.tuHoa.Lộc) return khongDu("Thiếu Lộc Tồn nguyên cục hoặc không có Hóa Lộc trong lá số.");
    const idx = ctx.menh.chiIdx;
    const oTamPhuong = tamPhuong(idx).includes(locTon.o.chiIdx) && tamPhuong(idx).includes(ctx.tuHoa.Lộc.o.chiIdx);
    if (!oTamPhuong) return khongDu("Lộc Tồn và Hóa Lộc không cùng ở tam phương Mệnh.");
    const hangMenh = ctx.menh.chinhTinh[0] ? ctx.hangSao(ctx.menh.chinhTinh[0].name, ctx.menh.chiName) : null;
    return mieuVuong(hangMenh)
      ? { khop: true, doTinCay: "cao", lyDo: "Lộc Tồn và Hóa Lộc cùng hội tam phương Mệnh, chính tinh Mệnh vượng cát." }
      : khongDu("Song Lộc hội tam phương đúng nhưng chính tinh Mệnh không vượng cát.");
  },
  "song-loc-phu-menh": (ctx) => {
    const locTon = ctx.timSao("Lộc Tồn")[0];
    if (!locTon || !ctx.tuHoa.Lộc) return khongDu("Thiếu Lộc Tồn nguyên cục hoặc Hóa Lộc.");
    const idx = ctx.menh.chiIdx;
    const dongCung = locTon.o.chiIdx === idx && ctx.tuHoa.Lộc.o.chiIdx === idx;
    const [truoc, sau] = giap(idx);
    const giapCung = (locTon.o.chiIdx === truoc && ctx.tuHoa.Lộc.o.chiIdx === sau) || (ctx.tuHoa.Lộc.o.chiIdx === truoc && locTon.o.chiIdx === sau);
    if (!dongCung && !giapCung) return khongDu("Lộc Tồn, Hóa Lộc không đồng cung Mệnh và không giáp Mệnh.");
    const hangMenh = ctx.menh.chinhTinh[0] ? ctx.hangSao(ctx.menh.chinhTinh[0].name, ctx.menh.chiName) : null;
    return mieuVuong(hangMenh)
      ? { khop: true, doTinCay: "cao", lyDo: "Lộc Tồn, Hóa Lộc đồng cung hoặc giáp Mệnh, chính tinh Mệnh miếu cát." }
      : khongDu("Song Lộc đồng cung/giáp Mệnh đúng nhưng chính tinh Mệnh không miếu cát.");
  },
  "loc-hop-uyen-uong": (ctx) => {
    const locTon = ctx.timSao("Lộc Tồn")[0];
    const cacViTri = [ctx.menh.chiIdx, ctx.than.chiIdx];
    const locTonODo = locTon && cacViTri.includes(locTon.o.chiIdx);
    const hoaLocODo = ctx.tuHoa.Lộc && cacViTri.includes(ctx.tuHoa.Lộc.o.chiIdx);
    if (!locTonODo && !hoaLocODo) return khongDu("Lộc Tồn/Hóa Lộc không thủ tại Mệnh hoặc Thân.");
    const hangMenh = ctx.menh.chinhTinh[0] ? ctx.hangSao(ctx.menh.chinhTinh[0].name, ctx.menh.chiName) : null;
    return mieuVuong(hangMenh)
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Lộc Tồn hoặc Hóa Lộc thủ Mệnh/Thân, chính tinh Mệnh miếu cát." }
      : khongDu("Có Lộc thủ Mệnh/Thân nhưng chính tinh Mệnh không miếu cát.");
  },
  "minh-chau-xuat-hai": (ctx) => {
    if (ctx.menh.chiName !== "Mùi") return khongDu("Mệnh không an tại Mùi.");
    const nhat = ctx.viTriChinhTinh("Thái Dương")[0], nguyet = ctx.viTriChinhTinh("Thái Âm")[0];
    const dung = nhat && nguyet && nhat.chiIdx === CHI_IDX["Mão"] && nguyet.chiIdx === CHI_IDX["Hợi"];
    return dung
      ? { khop: true, doTinCay: "cao", lyDo: "Mệnh tại Mùi, Thái Dương ở Mão, Thái Âm ở Hợi." }
      : khongDu("Mệnh tại Mùi nhưng Thái Dương/Thái Âm không đúng Mão/Hợi.");
  },
  "duong-luong-xuong-loc": (ctx) => {
    const can4 = ["Thái Dương", "Thiên Lương", "Văn Xương", "Lộc Tồn"];
    const idx = ctx.menh.chiIdx;
    const cung4 = tuChinh(idx);
    const du = can4.every((ten) => ctx.coSaoTaiCung([ten], cung4));
    return du
      ? { khop: true, doTinCay: "cao", lyDo: "Thái Dương, Thiên Lương, Văn Xương, Lộc Tồn tụ hội đủ ở tam phương tứ chính Mệnh." }
      : khongDu("Chưa hội đủ cả 4 sao Thái Dương-Thiên Lương-Văn Xương-Lộc Tồn quanh Mệnh.");
  },
  "nguyet-lang-thien-mon": (ctx) => toaMenhVoSatCoCat(ctx, "Thái Âm", { chi: "Hợi", banNgayCanCo: false, boQuaCat: false }),
  "nguyet-sinh-thuong-hai": (ctx) => {
    const dienTrach = ctx.oCungChuc("Điền Trạch");
    const co = dienTrach.chiName === "Tý" && dienTrach.chinhTinh.some((s) => s.name === "Thái Âm");
    if (!co) return khongDu("Điền Trạch không phải Thái Âm tại Tý.");
    return ctx.banNgay === false
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Thái Âm thủ Điền Trạch tại Tý, ước lượng sinh ban đêm." }
      : khongDu("Thái Âm thủ Điền Trạch tại Tý đúng nhưng ước lượng không phải sinh ban đêm.");
  },
  "tai-an-giap-loc": (ctx) => {
    const locTon = ctx.timSao("Lộc Tồn")[0];
    const idxMenh = ctx.menh.chiIdx;
    const locTonThuMenh = locTon && locTon.o.chiIdx === idxMenh;
    if (!locTonThuMenh) return khongDu("Lộc Tồn không thủ Mệnh.");
    const [truoc, sau] = giap(idxMenh);
    const vk = ctx.timSao("Vũ Khúc")[0], tt = ctx.timSao("Thiên Tướng")[0];
    const kep = vk && tt && ((vk.o.chiIdx === truoc && tt.o.chiIdx === sau) || (tt.o.chiIdx === truoc && vk.o.chiIdx === sau));
    if (!kep) return khongDu("Lộc Tồn thủ Mệnh nhưng Vũ Khúc, Thiên Tướng không giáp hai bên Mệnh.");
    return ctx.voSatTaiCung(tuChinh(idxMenh))
      ? { khop: true, doTinCay: "cao", lyDo: "Lộc Tồn thủ Mệnh, Vũ Khúc-Thiên Tướng giáp hai bên, vô Sát Kị." }
      : khongDu("Tài Ấn giáp Lộc đúng vị trí nhưng có Sát Kị tại tứ chính Mệnh.");
  },
  "van-tinh-cung-menh": (ctx) => {
    const vanTinh = ["Văn Xương", "Văn Khúc", "Thiên Khôi", "Thiên Việt"];
    const co = vanTinh.some((t) => ctx.coSaoTaiCung([t], tuChinhKhongTuThan(ctx.menh.chiIdx))) || !!(ctx.tuHoa.Khoa && tuChinhKhongTuThan(ctx.menh.chiIdx).includes(ctx.tuHoa.Khoa.o.chiIdx));
    return co
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Có văn tinh (Xương/Khúc/Khôi/Việt/Hóa Khoa) tại tam phương Mệnh (không tính đồng cung)." }
      : khongDu("Không có văn tinh nào ở tam phương Mệnh (không tính đồng cung).");
  },
  "cu-nhat-dong-cung": (ctx) => {
    if (!["Dần", "Thân"].includes(ctx.menh.chiName)) return khongDu("Mệnh không cư Dần/Thân.");
    const co = ctx.menh.chinhTinh.some((s) => s.name === "Thái Dương") && ctx.menh.chinhTinh.some((s) => s.name === "Cự Môn");
    if (!co) return khongDu("Mệnh không phải Thái Dương + Cự Môn đồng cung.");
    const phuTinh = ["Tả Phụ", "Hữu Bật", "Văn Xương", "Văn Khúc", "Thiên Khôi", "Thiên Việt"];
    const soLuong = phuTinh.filter((t) => ctx.coSaoTaiCung([t], tuChinh(ctx.menh.chiIdx))).length;
    if (soLuong < 2) return khongDu("Cự Nhật đồng cung Dần/Thân nhưng chưa đủ Tả Hữu Xương Khúc Khôi Việt hội/thủ.");
    return ctx.voSatTaiCung(tuChinh(ctx.menh.chiIdx))
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Cự Nhật đồng cung Dần/Thân, có nhiều phụ tinh quý hội, vô thêm Sát." }
      : khongDu("Đủ phụ tinh nhưng có Sát tinh — không đúng cách.");
  },
  "loc-ma-boi-an": (ctx) => {
    const ma = ctx.timSao("Thiên Mã")[0];
    if (!ma) return khongDu("Không có Thiên Mã nguyên cục.");
    const idx = ma.o.chiIdx;
    const coLoc = ctx.coSaoTaiCung(["Lộc Tồn"], [idx]) || (ctx.tuHoa.Lộc && ctx.tuHoa.Lộc.o.chiIdx === idx);
    const coTuong = ctx.coSaoTaiCung(["Thiên Tướng"], [idx]) || ma.o.chinhTinh.some((s) => s.name === "Thiên Tướng");
    const dungCungMenh = idx === ctx.menh.chiIdx;
    return dungCungMenh && coLoc && coTuong
      ? { khop: true, doTinCay: "cao", lyDo: "Thiên Mã, Lộc (Tồn/Hóa) và Thiên Tướng đồng cung thủ Mệnh." }
      : khongDu("Thiên Mã không đồng cung đủ cả Lộc và Thiên Tướng tại Mệnh.");
  },
  "co-nguyet-dong-luong-cach": (ctx) => {
    const bon = ["Thiên Cơ", "Thái Âm", "Thiên Đồng", "Thiên Lương"];
    const cung4 = tuChinh(ctx.menh.chiIdx);
    const soLuong = bon.filter((t) => { const vt = ctx.viTriChinhTinh(t)[0]; return vt && cung4.includes(vt.chiIdx); }).length;
    if (soLuong < 4) return khongDu(`Tứ chính Mệnh chỉ có ${soLuong}/4 sao Thiên Cơ-Thái Âm-Thiên Đồng-Thiên Lương (cách này đòi hỏi đủ cả 4, một điều hiếm khi xảy ra chỉ trong tứ chính của MỘT cung).`);
    return ctx.voSatTaiCung(cung4)
      ? { khop: true, doTinCay: "cao", lyDo: "Tứ chính Mệnh hội đủ Cơ Nguyệt Đồng Lương, vô Sát Kị." }
      : khongDu("Hội đủ 4 sao nhưng có Sát Kị tại tứ chính.");
  },
  "quyen-loc-thu-tai-phuc": (ctx) => {
    const tai = ctx.oCungChuc("Tài Bạch"), phuc = ctx.oCungChuc("Phúc Đức");
    const q = ctx.tuHoa.Quyền, l = ctx.tuHoa.Lộc;
    const dung = q && l && ((q.o.chiIdx === tai.chiIdx && l.o.chiIdx === phuc.chiIdx) || (l.o.chiIdx === tai.chiIdx && q.o.chiIdx === phuc.chiIdx));
    if (!dung) return khongDu("Hóa Quyền, Hóa Lộc không nằm đúng ở Tài Bạch và Phúc Đức.");
    const hangMenh = ctx.menh.chinhTinh[0] ? ctx.hangSao(ctx.menh.chinhTinh[0].name, ctx.menh.chiName) : null;
    return mieuVuong(hangMenh)
      ? { khop: true, doTinCay: "cao", lyDo: "Hóa Quyền, Hóa Lộc đóng đúng Tài Bạch/Phúc Đức, chính tinh Mệnh miếu vượng." }
      : khongDu("Quyền Lộc đúng vị trí nhưng chính tinh Mệnh không miếu vượng.");
  },
  "khoa-minh-loc-am": (ctx) => {
    const k = ctx.tuHoa.Khoa;
    if (!k || k.o.chiIdx !== ctx.menh.chiIdx) return khongDu("Không có Hóa Khoa thủ Mệnh.");
    const locTon = ctx.timSao("Lộc Tồn")[0];
    const dungLucHop = locTon && LUC_HOP[ctx.menh.chiIdx] === locTon.o.chiIdx;
    if (!dungLucHop) return khongDu("Hóa Khoa thủ Mệnh nhưng Lộc Tồn không ở cung lục hợp với Mệnh.");
    const hangMenh = ctx.menh.chinhTinh[0] ? ctx.hangSao(ctx.menh.chinhTinh[0].name, ctx.menh.chiName) : null;
    return mieuVuong(hangMenh)
      ? { khop: true, doTinCay: "cao", lyDo: "Hóa Khoa thủ Mệnh, Lộc Tồn ở cung lục hợp với Mệnh, chính tinh Mệnh miếu vượng." }
      : khongDu("Khoa Minh Lộc Ám đúng vị trí nhưng chính tinh Mệnh không miếu vượng.");
  },
  "tu-phu-nhat-nguyet-vuong-dia": (ctx) => {
    const dung = (ten, chi) => { const v = ctx.viTriChinhTinh(ten)[0]; return v && v.chiIdx === CHI_IDX[chi]; };
    const viTriDu = dung("Tử Vi", "Ngọ") && dung("Thiên Phủ", "Tuất") && dung("Thái Dương", "Mão") && dung("Thái Âm", "Dậu");
    if (!viTriDu) return khongDu("Tử Vi/Thiên Phủ/Thái Dương/Thái Âm không đủ đúng vị trí Ngọ/Tuất/Mão/Dậu.");
    const coHoa = ["Khoa", "Quyền", "Lộc"].some((h) => ctx.tuHoa[h] && [ctx.menh.chiIdx, ctx.than.chiIdx].includes(ctx.tuHoa[h].o.chiIdx));
    if (!coHoa) return khongDu("Đúng vị trí Tứ Chính Đồng Lâm nhưng không có Hóa tinh tọa Mệnh/Thân.");
    return ctx.voSatTaiCung([ctx.menh.chiIdx, ctx.than.chiIdx])
      ? { khop: true, doTinCay: "cao", lyDo: "Tử Phủ Nhật Nguyệt đủ vượng địa, có Hóa tinh tọa Mệnh/Thân, vô Sát Kị Không Vong." }
      : khongDu("Đủ vị trí và Hóa tinh nhưng Mệnh/Thân có Sát Kị hoặc Không Vong.");
  },
  "ta-huu-tu-mo": (ctx) => {
    if (!["Thìn", "Tuất", "Sửu", "Mùi"].includes(ctx.menh.chiName)) {
      const baCung = ["Tài Bạch", "Quan Lộc", "Thiên Di"].map((t) => ctx.oCungChuc(t));
      const oBa = baCung.some((o) => o.chinhTinh.length === 0 ? false : ctx.coSaoTaiCung(["Tả Phụ", "Hữu Bật"], [o.chiIdx]));
      return oBa
        ? { khop: true, doTinCay: "trungbinh", lyDo: "Mệnh không tại Tứ Mộ, nhưng Tả Phụ - Hữu Bật đồng thủ một trong ba cung Tài-Quan-Di." }
        : khongDu("Mệnh không tại Tứ Mộ (Thìn Tuất Sửu Mùi) và Tả Hữu không đồng thủ Tài/Quan/Di.");
    }
    return ctx.coSaoTaiCung(["Tả Phụ", "Hữu Bật"], [ctx.menh.chiIdx])
      ? { khop: true, doTinCay: "cao", lyDo: "Mệnh tại Tứ Mộ, có Tả Phụ - Hữu Bật đồng thủ." }
      : khongDu("Mệnh tại Tứ Mộ nhưng không có Tả Hữu đồng thủ.");
  },
  "nhat-nguyet-xuong-khuc-khoi-viet": (ctx) => {
    const nhat = ctx.viTriChinhTinh("Thái Dương")[0], nguyet = ctx.viTriChinhTinh("Thái Âm")[0];
    const oThanMenh = [ctx.menh.chiIdx, ctx.than.chiIdx];
    const nhatNguyetVuong = (nhat && oThanMenh.includes(nhat.chiIdx) && mieuVuong(nhat.hang)) || (nguyet && oThanMenh.includes(nguyet.chiIdx) && mieuVuong(nguyet.hang));
    const vanTinh = ["Văn Xương", "Văn Khúc", "Thiên Khôi", "Thiên Việt"];
    const soVanTinh = vanTinh.filter((t) => ctx.coSaoTaiCung([t], tuChinhKhongTuThan(ctx.menh.chiIdx))).length;
    return nhatNguyetVuong && soVanTinh >= 2
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Nhật hoặc Nguyệt vượng địa thủ Thân/Mệnh, tam phương có từ 2 văn tinh (Xương/Khúc/Khôi/Việt) trở lên." }
      : khongDu("Chưa đủ điều kiện Nhật/Nguyệt vượng địa thủ Thân Mệnh cùng nhiều văn tinh hội.");
  },
  "phu-bat-ngo-tai-quan": (ctx) => {
    const tai = ctx.oCungChuc("Tài Bạch"), quan = ctx.oCungChuc("Quan Lộc");
    const co = ctx.coSaoTaiCung(["Tả Phụ", "Hữu Bật"], [tai.chiIdx]) || ctx.coSaoTaiCung(["Tả Phụ", "Hữu Bật"], [quan.chiIdx]);
    return co
      ? { khop: true, doTinCay: "cao", lyDo: "Tả Phụ/Hữu Bật đóng tại Tài Bạch hoặc Quan Lộc, tam hợp Mệnh-Tài-Quan nên đến củng Mệnh." }
      : khongDu("Không có Tả Hữu tại Tài Bạch hoặc Quan Lộc.");
  },
  "cu-luong-liem-tham-uyen-uong-hop-loc": (ctx) => {
    const bon = ["Cự Môn", "Thiên Lương", "Liêm Trinh", "Tham Lang"];
    const cung4Menh = tuChinh(ctx.menh.chiIdx);
    const oMenh = bon.filter((t) => { const vt = ctx.viTriChinhTinh(t)[0]; return vt && cung4Menh.includes(vt.chiIdx) && mieuVuong(vt.hang); }).length;
    if (oMenh === 4) {
      return ctx.catTinhTaiCung(cung4Menh)
        ? { khop: true, doTinCay: "cao", lyDo: "Cự-Lương-Liêm-Tham hội đủ tứ chính Thân-Mệnh, đều miếu vượng, có cát tinh." }
        : khongDu("Hội đủ 4 sao miếu vượng nhưng chưa thấy cát tinh.");
    }
    const phuThe = ctx.oCungChuc("Phu Thê");
    const cung4PhuThe = tuChinh(phuThe.chiIdx);
    const oPhuThe = bon.every((t) => { const vt = ctx.viTriChinhTinh(t)[0]; return vt && cung4PhuThe.includes(vt.chiIdx); });
    const locODau = (ctx.tuHoa.Lộc && [ctx.menh.chiIdx, phuThe.chiIdx].includes(ctx.tuHoa.Lộc.o.chiIdx)) || ctx.coSaoTaiCung(["Lộc Tồn"], [ctx.menh.chiIdx, phuThe.chiIdx]);
    return oPhuThe && locODau
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Cự-Lương-Liêm-Tham hội tứ chính Phu Thê, Mệnh hoặc Phu Thê có Lộc Tồn/Hóa Lộc." }
      : khongDu(`Chỉ ${oMenh}/4 sao hội đủ miếu vượng quanh Thân-Mệnh, và không đủ điều kiện thay thế ở Phu Thê + Lộc.`);
  },
  "minh-loc-am-loc": (ctx) => {
    const l = ctx.tuHoa.Lộc;
    if (!l || l.o.chiIdx !== ctx.menh.chiIdx) return khongDu("Không có Hóa Lộc tọa Mệnh.");
    const locTon = ctx.timSao("Lộc Tồn")[0];
    return locTon && LUC_HOP[ctx.menh.chiIdx] === locTon.o.chiIdx
      ? { khop: true, doTinCay: "cao", lyDo: "Mệnh có Hóa Lộc, cung lục hợp với Mệnh lại có Lộc Tồn." }
      : khongDu("Mệnh có Hóa Lộc nhưng Lộc Tồn không ở cung lục hợp với Mệnh.");
  },
  "xuong-khuc-loc-co-am-duong-ta-huu": (ctx) => {
    const co1 = ["Văn Xương", "Văn Khúc", "Lộc Tồn", "Thiên Cơ"].every((t) => ctx.coSaoTaiCung([t], [ctx.menh.chiIdx]));
    const co2 = ["Thái Âm", "Thái Dương", "Tả Phụ", "Hữu Bật"].every((t) => ctx.coSaoTaiCung([t], [ctx.menh.chiIdx]));
    if (!co1 && !co2) return khongDu("Mệnh không hội đủ Xương-Khúc-Lộc-Cơ, cũng không đủ Âm-Dương-Tả-Hữu đồng thủ.");
    return ctx.voSatTaiCung([ctx.menh.chiIdx])
      ? { khop: true, doTinCay: "cao", lyDo: "Mệnh hội đủ một trong hai tổ hợp tứ tinh, không thêm Tứ Sát/Kị." }
      : khongDu("Hội đủ tổ hợp nhưng có thêm Sát Kị tại Mệnh.");
  },
  "nhat-xuong-quan-loc": (ctx) => {
    const quan = ctx.oCungChuc("Quan Lộc");
    const co = quan.chinhTinh.some((s) => s.name === "Thái Dương") && ctx.coSaoTaiCung(["Văn Xương"], [quan.chiIdx]);
    return co && ctx.catTinhTaiCung([quan.chiIdx])
      ? { khop: true, doTinCay: "cao", lyDo: "Thái Dương và Văn Xương đồng thủ Quan Lộc, có thêm cát tinh." }
      : khongDu("Thái Dương và Văn Xương không đồng thủ Quan Lộc (hoặc thiếu cát tinh đi kèm).");
  },
  "nguyet-khuc-phu-the": (ctx) => {
    const pt = ctx.oCungChuc("Phu Thê");
    const co = pt.chinhTinh.some((s) => s.name === "Thái Âm") && ctx.coSaoTaiCung(["Văn Khúc"], [pt.chiIdx]);
    return co && ctx.catTinhTaiCung(tuChinh(pt.chiIdx))
      ? { khop: true, doTinCay: "cao", lyDo: "Thái Âm và Văn Khúc đồng thủ Phu Thê, có cát tinh hội." }
      : khongDu("Thái Âm và Văn Khúc không đồng thủ Phu Thê (hoặc thiếu cát tinh hội).");
  },
  "loc-van-cung-menh": (ctx) => {
    const tai = ctx.oCungChuc("Tài Bạch"), quan = ctx.oCungChuc("Quan Lộc");
    const coLoc = ctx.coSaoTaiCung(["Lộc Tồn"], [tai.chiIdx]) || (ctx.tuHoa.Lộc && ctx.tuHoa.Lộc.o.chiIdx === tai.chiIdx);
    const coXuongKhuc = ctx.coSaoTaiCung(["Văn Xương", "Văn Khúc"], [quan.chiIdx]);
    return coLoc && coXuongKhuc
      ? { khop: true, doTinCay: "cao", lyDo: "Lộc Tồn tại Tài Bạch, Xương/Khúc tại Quan Lộc, cùng củng chiếu Mệnh (tam hợp Mệnh-Tài-Quan)." }
      : khongDu("Không đủ Lộc tại Tài Bạch cùng Xương/Khúc tại Quan Lộc.");
  },
  "tam-hoa-giap-menh": (ctx) => {
    const [truoc, sau] = giap(ctx.menh.chiIdx);
    const oHai = ["Lộc", "Quyền", "Khoa"].filter((h) => ctx.tuHoa[h] && [truoc, sau].includes(ctx.tuHoa[h].o.chiIdx));
    if (oHai.length < 2) return khongDu("Không có ít nhất 2 trong 3 Hóa Lộc/Quyền/Khoa đóng ở hai cung kẹp Mệnh.");
    const hangMenh = ctx.menh.chinhTinh[0] ? ctx.hangSao(ctx.menh.chinhTinh[0].name, ctx.menh.chiName) : null;
    if (!mieuVuong(hangMenh)) return khongDu("Đủ Hóa tinh giáp Mệnh nhưng chính tinh Mệnh không miếu vượng.");
    return ctx.voSatTaiCung([ctx.menh.chiIdx])
      ? { khop: true, doTinCay: "cao", lyDo: "Ít nhất 2 Hóa tinh (Lộc/Quyền/Khoa) giáp Mệnh, Mệnh miếu vượng vô Sát." }
      : khongDu("Đủ điều kiện Hóa tinh và Mệnh vượng nhưng Mệnh có Sát.");
  },
  "trieu-dau-cach": (ctx) => {
    if (!["Tý", "Ngọ"].includes(ctx.menh.chiName)) return khongDu("Mệnh không an tại Tý/Ngọ.");
    const di = ctx.oCungChuc("Thiên Di");
    return ctx.coSaoTaiCung(["Lộc Tồn"], [di.chiIdx])
      ? { khop: true, doTinCay: "cao", lyDo: "Mệnh an Tý/Ngọ, Lộc Tồn đóng tại Thiên Di đối diện." }
      : khongDu("Mệnh an Tý/Ngọ nhưng Lộc Tồn không đóng tại Thiên Di.");
  },
  "khoa-quyen-loc-chu-cach": (ctx) => {
    const co = ctx.tuHoa.Lộc && ctx.tuHoa.Quyền && ctx.tuHoa.Lộc.o.chiIdx === ctx.menh.chiIdx && ctx.tuHoa.Quyền.o.chiIdx === ctx.menh.chiIdx;
    if (!co) return khongDu("Hóa Lộc và Hóa Quyền không cùng đóng tại Mệnh.");
    return ctx.catTinhTaiCung([ctx.menh.chiIdx])
      ? { khop: true, doTinCay: "cao", lyDo: "Hóa Lộc, Hóa Quyền cùng đóng tại Mệnh, có thêm cát tinh." }
      : khongDu("Hóa Lộc, Hóa Quyền cùng đóng Mệnh nhưng chưa thấy thêm cát tinh.");
  },
  "ta-huu-trieu-vien-cach": (ctx) => ctx.coSaoTaiCung(["Tả Phụ", "Hữu Bật"], tuChinh(ctx.menh.chiIdx))
    ? { khop: true, doTinCay: "cao", lyDo: "Tả Phụ, Hữu Bật chầu về Mệnh (tam phương hoặc kẹp hai bên đã tính trong tứ chính)." }
    : khongDu("Tả Phụ, Hữu Bật không hội về tứ chính Mệnh."),
  "van-vu-cach": (ctx) => {
    const co = (o) => o && o.chinhTinh.some((s) => s.name === "Vũ Khúc") && ctx.coSaoTaiCung(["Văn Khúc"], [o.chiIdx]);
    const dung = co(ctx.menh) || co(ctx.than);
    if (!dung) return khongDu("Vũ Khúc, Văn Khúc không đồng thủ Mệnh hoặc Thân.");
    return ctx.voSatTaiCung([ctx.menh.chiIdx, ctx.than.chiIdx])
      ? { khop: true, doTinCay: "cao", lyDo: "Văn Khúc, Vũ Khúc đồng thủ Mệnh/Thân, không có Sát Phá." }
      : khongDu("Đồng thủ đúng vị trí nhưng có Sát/Phá tại Mệnh hoặc Thân.");
  },
  "van-tinh-trieu-menh-cach": (ctx) => {
    const co = ctx.coSaoTaiCung(["Văn Xương"], tuChinhKhongTuThan(ctx.menh.chiIdx)) && ctx.coSaoTaiCung(["Văn Khúc"], tuChinhKhongTuThan(ctx.menh.chiIdx));
    return co && ctx.catTinhTaiCung(tuChinh(ctx.menh.chiIdx))
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Văn Xương, Văn Khúc cùng chầu về Mệnh (tam phương), tam phương có thêm sao tốt." }
      : khongDu("Văn Xương, Văn Khúc không cùng chầu về tam phương Mệnh (không tính đồng cung), hoặc thiếu sao tốt đi kèm.");
  },
  "hoa-quy-cach": (ctx) => {
    const tl = ctx.viTriChinhTinh("Tham Lang")[0];
    if (!tl) return khongDu("Không xác định vị trí Tham Lang.");
    const oThanMenh = [ctx.menh.chiIdx, ctx.than.chiIdx].includes(tl.chiIdx);
    if (!oThanMenh) return khongDu("Tham Lang không tọa Thân/Mệnh.");
    const coHoaTinh = ctx.coSaoTaiCung(["Hỏa Tinh"], tuChinh(tl.chiIdx));
    if (!coHoaTinh) return khongDu("Tham Lang tọa Thân/Mệnh nhưng không gặp Hỏa Tinh ở tam phương tứ chính.");
    const conHungSatKhac = ctx.coSaoTaiCung(["Kình Dương", "Đà La", "Linh Tinh"], tuChinh(tl.chiIdx));
    return !conHungSatKhac
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Tham Lang gặp Hỏa Tinh ở tam phương chiếu Thân/Mệnh, không thêm hung sát khác." }
      : khongDu("Tham Lang gặp Hỏa Tinh nhưng tam phương còn hung sát khác — không đúng cách thuần.");
  },
  "hung-tu-trieu-nguyen-cach": (ctx) => {
    const lt = ctx.viTriChinhTinh("Liêm Trinh")[0];
    return lt && lt.chiIdx === CHI_IDX["Thân"] && mieuVuong(lt.hang)
      ? { khop: true, doTinCay: "cao", lyDo: "Liêm Trinh miếu địa tại cung Thân." }
      : khongDu("Liêm Trinh không đóng miếu địa tại cung Thân (địa chi).");
  },
  "vu-tham-tai-trach": (ctx) => {
    const tai = ctx.oCungChuc("Tài Bạch");
    const co1 = tai.chinhTinh.some((s) => s.name === "Vũ Khúc") && tai.chinhTinh.some((s) => s.name === "Tham Lang");
    const co2 = ["Tử Vi", "Thiên Phủ", "Vũ Khúc"].every((t) => tai.chinhTinh.some((s) => s.name === t))
      && ["Quyền", "Lộc"].some((h) => ctx.tuHoa[h] && ctx.tuHoa[h].o.chiIdx === tai.chiIdx);
    return co1 || co2
      ? { khop: true, doTinCay: "cao", lyDo: co1 ? "Vũ Khúc, Tham Lang đồng thủ Tài Bạch." : "Tử Phủ Vũ đồng thủ Tài Bạch kèm Hóa Quyền/Lộc." }
      : khongDu("Tài Bạch không phải Vũ Tham đồng cung, cũng không phải Tử Phủ Vũ kèm Hóa Quyền/Lộc.");
  },
  "tai-am-giap-an": (ctx) => {
    const tl = ctx.timSao("Thiên Lương", { choPhepLuu: false });
    const dienTrach = ctx.oCungChuc("Điền Trạch");
    const thuMenh = ctx.menh.chinhTinh.some((s) => s.name === "Thiên Lương");
    const thuDien = dienTrach.chinhTinh.some((s) => s.name === "Thiên Lương");
    if (!thuMenh && !thuDien) return khongDu("Thiên Lương không thủ Mệnh cũng không thủ Điền Trạch.");
    const idx = thuMenh ? ctx.menh.chiIdx : dienTrach.chiIdx;
    const [truoc, sau] = giap(idx);
    const vk = ctx.timSao("Vũ Khúc")[0], tt = ctx.timSao("Thiên Tướng")[0];
    const kep = vk && tt && ((vk.o.chiIdx === truoc && tt.o.chiIdx === sau) || (tt.o.chiIdx === truoc && vk.o.chiIdx === sau));
    return kep
      ? { khop: true, doTinCay: "cao", lyDo: `Thiên Lương thủ ${thuMenh ? "Mệnh" : "Điền Trạch"}, Vũ Khúc - Thiên Tướng giáp hai bên.` }
      : khongDu("Thiên Lương thủ đúng cung nhưng Vũ Khúc, Thiên Tướng không giáp hai bên.");
  },
  "nhat-nguyet-giap-tai": (ctx) => {
    const tai = ctx.oCungChuc("Tài Bạch");
    const thuMenh = ["Vũ Khúc", "Thiên Phủ"].some((t) => ctx.menh.chinhTinh.some((s) => s.name === t));
    const thuTai = ["Vũ Khúc", "Thiên Phủ"].some((t) => tai.chinhTinh.some((s) => s.name === t));
    if (!thuMenh && !thuTai) return khongDu("Vũ Khúc/Thiên Phủ không thủ Mệnh cũng không thủ Tài Bạch.");
    const idx = thuMenh ? ctx.menh.chiIdx : tai.chiIdx;
    const [truoc, sau] = giap(idx);
    const nhat = ctx.viTriChinhTinh("Thái Dương")[0], nguyet = ctx.viTriChinhTinh("Thái Âm")[0];
    const kep = nhat && nguyet && ((nhat.chiIdx === truoc && nguyet.chiIdx === sau) || (nguyet.chiIdx === truoc && nhat.chiIdx === sau));
    return kep && ctx.catTinhTaiCung([idx])
      ? { khop: true, doTinCay: "cao", lyDo: `Vũ Khúc/Thiên Phủ thủ ${thuMenh ? "Mệnh" : "Tài Bạch"}, Nhật Nguyệt giáp hai bên, có cát tinh.` }
      : khongDu("Không đủ Nhật Nguyệt giáp đúng vị trí kèm cát tinh.");
  },
  "tai-loc-giap-ma": (ctx) => {
    const ma = ctx.timSao("Thiên Mã")[0];
    if (!ma || ma.o.chiIdx !== ctx.menh.chiIdx) return khongDu("Thiên Mã không thủ Mệnh.");
    const [truoc, sau] = giap(ctx.menh.chiIdx);
    const vk = ctx.timSao("Vũ Khúc")[0];
    const coLoc = (i) => ctx.coSaoTaiCung(["Lộc Tồn"], [i]) || (ctx.tuHoa.Lộc && ctx.tuHoa.Lộc.o.chiIdx === i);
    const kep = vk && ((vk.o.chiIdx === truoc && coLoc(sau)) || (vk.o.chiIdx === sau && coLoc(truoc)));
    return kep
      ? { khop: true, doTinCay: "cao", lyDo: "Thiên Mã thủ Mệnh, Vũ Khúc và Lộc Tồn/Hóa Lộc giáp hai bên." }
      : khongDu("Thiên Mã thủ Mệnh nhưng Vũ Khúc và Lộc không giáp đúng hai bên.");
  },
  "luong-tuong-cung-than": (ctx) => {
    if (ctx.than.palaceName !== "Tài Bạch") return khongDu("Cung Thân không lâm vào Tài Bạch.");
    const cung4 = tuChinhKhongTuThan(ctx.than.chiIdx);
    const co = ["Thiên Lương", "Thiên Tướng"].every((t) => ctx.coSaoTaiCung([t], cung4));
    return co
      ? { khop: true, doTinCay: "cao", lyDo: "Cung Thân lâm Tài Bạch, Thiên Lương - Thiên Tướng ở tam phương củng chiếu." }
      : khongDu("Cung Thân lâm Tài Bạch nhưng Thiên Lương/Thiên Tướng không cùng ở tam phương.");
  },
  "nhat-nguyet-chieu-bich": (ctx) => {
    const dien = ctx.oCungChuc("Điền Trạch");
    const co = dien.chinhTinh.some((s) => s.name === "Thái Dương") && dien.chinhTinh.some((s) => s.name === "Thái Âm");
    return co && ["Thìn", "Tuất", "Sửu", "Mùi"].includes(dien.chiName)
      ? { khop: true, doTinCay: "cao", lyDo: "Nhật Nguyệt đồng lâm Điền Trạch, tại một trong Tứ Mộ." }
      : khongDu("Điền Trạch không phải Nhật Nguyệt đồng cung tại Tứ Mộ.");
  },
  "kim-xan-quang-huy": (ctx) => toaMenhVoSatCoCat(ctx, "Thái Dương", { chi: "Ngọ", canGomTrong: ["Đinh", "Tân", "Giáp"], boQuaCat: true }),
  "loc-ton-thu-dien-tai": (ctx) => {
    const locTon = ctx.timSao("Lộc Tồn")[0];
    if (!locTon) return khongDu("Không có Lộc Tồn nguyên cục.");
    const dien = ctx.oCungChuc("Điền Trạch"), tai = ctx.oCungChuc("Tài Bạch");
    const oDo = locTon.o.chiIdx === dien.chiIdx || locTon.o.chiIdx === tai.chiIdx;
    if (!oDo) return khongDu("Lộc Tồn không thủ Điền Trạch hoặc Tài Bạch.");
    const coKhongVong = ctx.coSaoTaiCung(["Tuần", "Triệt"], [locTon.o.chiIdx]);
    return !coKhongVong
      ? { khop: true, doTinCay: "cao", lyDo: `Lộc Tồn thủ ${locTon.o.chiIdx === dien.chiIdx ? "Điền Trạch" : "Tài Bạch"}, không có Tuần/Triệt phá cách.` }
      : khongDu("Lộc Tồn thủ đúng cung nhưng có Tuần/Triệt (Không Vong) phá cách.");
  },
  "tai-am-toa-thien-di": (ctx) => {
    const di = ctx.oCungChuc("Thiên Di");
    const co = di.chinhTinh.some((s) => s.name === "Vũ Khúc") || di.chinhTinh.some((s) => s.name === "Thiên Lương");
    if (!co) return khongDu("Thiên Di không có Vũ Khúc hoặc Thiên Lương tọa thủ.");
    const coQuyenLoc = ["Quyền", "Lộc"].some((h) => ctx.tuHoa[h] && ctx.tuHoa[h].o.chiIdx === di.chiIdx);
    return coQuyenLoc && ctx.catTinhTaiCung([di.chiIdx])
      ? { khop: true, doTinCay: "cao", lyDo: "Vũ Khúc hoặc Thiên Lương tọa Thiên Di, có Hóa Quyền/Lộc và cát tinh." }
      : khongDu("Vũ Khúc/Thiên Lương tọa Thiên Di nhưng thiếu Hóa Quyền/Lộc hoặc cát tinh đi kèm.");
  },
  "khong-kiep-phan-doat-tai-phuc": (ctx) => {
    const tai = ctx.oCungChuc("Tài Bạch"), phuc = ctx.oCungChuc("Phúc Đức");
    const chiaNhau = (ctx.coSaoTaiCung(["Địa Kiếp"], [tai.chiIdx]) && ctx.coSaoTaiCung(["Địa Không"], [phuc.chiIdx]))
      || (ctx.coSaoTaiCung(["Địa Không"], [tai.chiIdx]) && ctx.coSaoTaiCung(["Địa Kiếp"], [phuc.chiIdx]));
    if (!chiaNhau) return khongDu("Địa Không, Địa Kiếp không chia nhau chiếm đúng Tài Bạch và Phúc Đức.");
    const hangMenh = ctx.menh.chinhTinh[0] ? ctx.hangSao(ctx.menh.chinhTinh[0].name, ctx.menh.chiName) : null;
    return !mieuVuong(hangMenh)
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Địa Kiếp, Địa Không chia nhau Tài Bạch - Phúc Đức, chính tinh Mệnh không miếu vượng." }
      : khongDu("Không Kiếp chia đúng Tài-Phúc nhưng chính tinh Mệnh vẫn miếu vượng — chưa hẳn đúng cách bần cách.");
  },
  "sinh-bat-ngo-thoi": (ctx) => {
    const hangMenh = ctx.menh.chinhTinh[0] ? ctx.hangSao(ctx.menh.chinhTinh[0].name, ctx.menh.chiName) : null;
    if (!ham(hangMenh)) return khongDu("Chính tinh Mệnh không hãm địa (hoặc Vô Chính Diệu không tính được độ sáng).");
    const coKhongVong = ctx.coSaoTaiCung(["Tuần", "Triệt"], [ctx.menh.chiIdx]) || ctx.khongKiepTaiCung([ctx.menh.chiIdx]);
    return coKhongVong
      ? { khop: true, doTinCay: "cao", lyDo: "Chính tinh Mệnh hãm địa, lại gặp Tuần/Triệt hoặc Không Kiếp tại Mệnh." }
      : khongDu("Chính tinh Mệnh hãm địa nhưng không gặp Không Vong/Không Kiếp tại Mệnh.");
  },
  "loc-phung-xung-pha": (ctx) => {
    const oMenhThan = [ctx.menh.chiIdx, ctx.than.chiIdx];
    const coLoc = oMenhThan.some((i) => ctx.coSaoTaiCung(["Lộc Tồn"], [i]) || (ctx.tuHoa.Lộc && ctx.tuHoa.Lộc.o.chiIdx === i));
    if (!coLoc) return khongDu("Không có Lộc Tồn/Hóa Lộc tọa Mệnh hoặc Thân.");
    const idx = (ctx.tuHoa.Lộc && oMenhThan.includes(ctx.tuHoa.Lộc.o.chiIdx)) ? ctx.tuHoa.Lộc.o.chiIdx : ctx.menh.chiIdx;
    const biPha = ctx.coSaoTaiCung(["Địa Không", "Địa Kiếp", "Tuần", "Triệt"], [idx]) || (ctx.tuHoa.Kỵ && ctx.tuHoa.Kỵ.o.chiIdx === idx);
    return biPha
      ? { khop: true, doTinCay: "cao", lyDo: "Lộc Tồn/Hóa Lộc tọa Mệnh hoặc Thân nhưng bị Không Kiếp/Không Vong/Hóa Kị xung phá ngay tại đó." }
      : khongDu("Có Lộc tọa Mệnh/Thân nhưng không bị Không Kiếp/Không Vong/Hóa Kị phá ngay tại cung đó.");
  },
  "ma-lac-khong-vong": (ctx) => {
    const ma = ctx.timSao("Thiên Mã")[0];
    if (!ma) return khongDu("Không có Thiên Mã nguyên cục.");
    return ctx.coSaoTaiCung(["Tuần", "Triệt"], [ma.o.chiIdx])
      ? { khop: true, doTinCay: "cao", lyDo: `Thiên Mã tọa ${ma.o.palaceName} (${ma.o.chiName}) đồng cung với Tuần hoặc Triệt.` }
      : khongDu("Thiên Mã không đồng cung với Tuần/Triệt.");
  },
  "nhat-nguyet-that-ham-ngo-cu-mon": (ctx) => {
    const nhat = ctx.viTriChinhTinh("Thái Dương")[0], nguyet = ctx.viTriChinhTinh("Thái Âm")[0];
    const oMenh = (v) => v && v.chiIdx === ctx.menh.chiIdx && ham(v.hang);
    if (!oMenh(nhat) && !oMenh(nguyet)) return khongDu("Thái Dương/Thái Âm hãm địa không thủ Mệnh.");
    const cuMon = ctx.viTriChinhTinh("Cự Môn")[0];
    const gapCuMon = cuMon && (cuMon.chiIdx === ctx.menh.chiIdx || cuMon.chiIdx === xungChieu(ctx.menh.chiIdx));
    return gapCuMon
      ? { khop: true, doTinCay: "cao", lyDo: "Nhật hoặc Nguyệt hãm địa thủ Mệnh, gặp Cự Môn đồng cung hoặc xung chiếu." }
      : khongDu("Nhật/Nguyệt hãm thủ Mệnh nhưng không gặp Cự Môn đồng cung/xung chiếu.");
  },
  "vu-liem-ham-dia-gia-sat-ky": (ctx) => {
    const check = (ten) => {
      const v = ctx.viTriChinhTinh(ten)[0];
      return v && [ctx.menh.chiIdx, ctx.than.chiIdx].includes(v.chiIdx) && ham(v.hang);
    };
    const dung = check("Vũ Khúc") || check("Liêm Trinh");
    if (!dung) return khongDu("Vũ Khúc/Liêm Trinh không hãm địa tại Mệnh hoặc Thân.");
    return (ctx.tuSatTaiCung([ctx.menh.chiIdx, ctx.than.chiIdx]) || (ctx.tuHoa.Kỵ && [ctx.menh.chiIdx, ctx.than.chiIdx].includes(ctx.tuHoa.Kỵ.o.chiIdx)))
      ? { khop: true, doTinCay: "cao", lyDo: "Vũ Khúc hoặc Liêm Trinh hãm địa tại Mệnh/Thân, thêm Sát hoặc Hóa Kị." }
      : khongDu("Vũ/Liêm hãm địa tại Mệnh-Thân nhưng chưa thêm Sát Kị.");
  },
  "pha-quan-ham-dia-co-ban": (ctx) => {
    const v = ctx.viTriChinhTinh("Phá Quân")[0];
    const hamDiaMenh = v && v.chiIdx === ctx.menh.chiIdx && ham(v.hang);
    const dongMao = v && v.chiIdx === CHI_IDX["Mão"] && ctx.coSaoTaiCung(["Văn Khúc"], [v.chiIdx]);
    return hamDiaMenh || dongMao
      ? { khop: true, doTinCay: "cao", lyDo: hamDiaMenh ? "Phá Quân thủ Mệnh ở hãm địa." : "Phá Quân và Văn Khúc đồng thủ cung Mão." }
      : khongDu("Phá Quân không hãm địa tại Mệnh, cũng không đồng cung Văn Khúc tại Mão.");
  },
  "tu-sat-tham-duong-giao-hoi": (ctx) => {
    const tl = ctx.viTriChinhTinh("Tham Lang")[0];
    const oMenhThan = [ctx.menh.chiIdx, ctx.than.chiIdx];
    if (!ctx.tuSatTaiCung(oMenhThan)) return khongDu("Không có Tứ Sát nào thủ Mệnh hoặc Thân.");
    const gapThamDuong = tl && oMenhThan.includes(tl.chiIdx) && ctx.coSaoTaiCung(["Kình Dương"], oMenhThan);
    if (!gapThamDuong) return khongDu("Có Tứ Sát thủ Mệnh/Thân nhưng không hội đủ Tham Lang + Kình Dương giao hội.");
    const menhThatHam = ["Mệnh", "Thân"].some((_, k) => {
      const o = k === 0 ? ctx.menh : ctx.than;
      return o.chinhTinh.length && o.chinhTinh.every((s) => ham(ctx.hangSao(s.name, o.chiName)));
    });
    return menhThatHam
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Tứ Sát thủ Mệnh/Thân, Tham Lang - Kình Dương giao hội, chính tinh Mệnh hoặc Thân thất hãm." }
      : khongDu("Đủ Tham Lang - Kình Dương - Tứ Sát nhưng chính tinh Mệnh/Thân chưa thất hãm rõ.");
  },
  "dai-hao-ngo-ac-sat": (ctx) => {
    if (ctx.menh.chiName !== "Tý") return khongDu("Mệnh không an tại Tý (điều kiện đại hạn thứ hai không kiểm chứng được tự động, engine chỉ xét gốc Mệnh).");
    return khongDu("Cần dữ liệu đại hạn thứ hai cụ thể (đại hạn hành đến Đại Hao) — engine hiện chưa duyệt được diễn biến đại hạn theo từng giai đoạn tuổi, chỉ dừng ở lá số gốc.");
  },
  "phu-mau-phu-the-tu-tuc-khong-kiep": (ctx) => {
    const baCung = ["Phụ Mẫu", "Phu Thê", "Tử Tức"].map((t) => ctx.oCungChuc(t));
    const du = baCung.every((o) => ctx.tuSatTaiCung([o.chiIdx]) || ctx.khongKiepTaiCung([o.chiIdx]) || (ctx.tuHoa.Kỵ && ctx.tuHoa.Kỵ.o.chiIdx === o.chiIdx));
    return du
      ? { khop: true, doTinCay: "cao", lyDo: "Cả ba cung Phụ Mẫu, Phu Thê, Tử Tức đều có Sát/Không Kiếp/Hóa Kị." }
      : khongDu("Không phải cả ba cung Phụ Mẫu-Phu Thê-Tử Tức đều có Không Kiếp/Sát Kị.");
  },
  "liem-pha-vu-hoa-ky-giap-khong-kiep-kinh-da": (ctx) => {
    const oMenhThan = [ctx.menh.chiIdx, ctx.than.chiIdx];
    const coHoaKy = ["Liêm Trinh", "Phá Quân", "Vũ Khúc"].some((t) => ctx.tuHoa.Kỵ && ctx.tuHoa.Kỵ.ten === t && oMenhThan.includes(ctx.tuHoa.Kỵ.o.chiIdx));
    if (!coHoaKy) return khongDu("Không có Liêm Trinh/Phá Quân/Vũ Khúc Hóa Kị tọa Mệnh hoặc Thân.");
    const idx = ctx.tuHoa.Kỵ.o.chiIdx;
    const [truoc, sau] = giap(idx);
    const kepA = ctx.coSaoTaiCung(["Địa Không", "Địa Kiếp"], [truoc]) && ctx.coSaoTaiCung(["Kình Dương", "Đà La"], [sau]);
    const kepB = ctx.coSaoTaiCung(["Kình Dương", "Đà La"], [truoc]) && ctx.coSaoTaiCung(["Địa Không", "Địa Kiếp"], [sau]);
    return kepA || kepB
      ? { khop: true, doTinCay: "cao", lyDo: "Liêm/Phá/Vũ hóa Kị tọa Mệnh-Thân, bị Không Kiếp và Kình Đà kẹp hai bên." }
      : khongDu("Có Hóa Kị đúng sao nhưng không bị Không Kiếp - Kình Đà kẹp hai bên.");
  },
  "menh-vo-chinh-dieu-khong-kiep": (ctx) => {
    if (ctx.menh.chinhTinh.length !== 0) return khongDu("Mệnh có chính tinh, không phải Vô Chính Diệu.");
    const coKhongKiep = ctx.coSaoTaiCung(["Địa Không", "Địa Kiếp"], [ctx.menh.chiIdx]);
    if (!coKhongKiep) return khongDu("Mệnh Vô Chính Diệu nhưng không có Địa Không/Địa Kiếp tọa thủ.");
    const coCatCuu = ctx.catTinhTaiCung(tuChinhKhongTuThan(ctx.menh.chiIdx));
    return !coCatCuu
      ? { khop: true, doTinCay: "cao", lyDo: "Mệnh Vô Chính Diệu, chỉ có Không Kiếp tọa thủ, tam phương không có cát tinh cứu giải." }
      : khongDu("Mệnh Vô Chính Diệu có Không Kiếp nhưng tam phương vẫn có cát tinh cứu giải.");
  },
  "sinh-gap-bai-dia": (ctx) => {
    const cuc = ctx.userInfo.cuc && ctx.userInfo.cuc.element;
    return cuc === "Thủy" && ctx.menh.chiName === "Ngọ"
      ? { khop: true, doTinCay: "cao", lyDo: "Mệnh Cục Thủy an tại Ngọ — đúng cung Tuyệt của hành Thủy." }
      : khongDu(`Cục là ${cuc || "không rõ"}, Mệnh tại ${ctx.menh.chiName} — không phải Thủy Cục an Mệnh tại Ngọ.`);
  },
  "hao-cu-loc-vi": (ctx) => {
    const quan = ctx.oCungChuc("Quan Lộc");
    const co = quan.chinhTinh.some((s) => s.name === "Phá Quân");
    if (!co) return khongDu("Quan Lộc không phải Phá Quân.");
    const coKinhDaKy = ctx.coSaoTaiCung(["Kình Dương"], [quan.chiIdx]) || (ctx.tuHoa.Kỵ && ctx.tuHoa.Kỵ.o.chiIdx === quan.chiIdx);
    return coKinhDaKy
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Phá Quân cư Quan Lộc, gặp Kình Dương hoặc Hóa Kị (chưa đối chiếu thêm điều kiện tứ cục theo năm sinh)." }
      : khongDu("Phá Quân cư Quan Lộc nhưng không gặp Kình Dương/Hóa Kị.");
  },
  "ki-am-dong-cu-menh-tat": (ctx) => {
    const tat = ctx.oCungChuc("Tật Ách");
    const cacCung = [ctx.menh, ctx.than, tat];
    const co = cacCung.some((o) => {
      const cuMon = o.chinhTinh.some((s) => s.name === "Cự Môn");
      const kinhDa = ctx.coSaoTaiCung(["Kình Dương", "Đà La"], [o.chiIdx]);
      return cuMon && kinhDa;
    });
    return co
      ? { khop: true, doTinCay: "cao", lyDo: "Một trong ba cung Mệnh/Thân/Tật Ách có Cự Môn cùng Kình Dương hoặc Đà La thủ." }
      : khongDu("Không có cung nào trong Mệnh/Thân/Tật Ách hội đủ Cự Môn cùng Kình/Đà.");
  },
  "tu-sat-ham-dia-thu-than-menh": (ctx) => {
    const oMenhThan = [ctx.menh.chiIdx, ctx.than.chiIdx];
    const hamO = oMenhThan.some((i) => TU_SAT.some((t) => {
      const co = ctx.coSaoTaiCung([t], [i]);
      if (!co) return false;
      const chi = ctx.oTaiChi(i).chiName;
      const h = ctx.hangSao(t, chi);
      return h ? ham(h) : co; // sát tinh phụ không luôn có bảng miếu hãm riêng trong do-sang.json — coi như khớp nếu có mặt
    }));
    return hamO
      ? { khop: true, doTinCay: "thap", lyDo: "Có Tứ Sát tinh thủ Mệnh hoặc Thân (độ hãm của sát tinh phụ không tra được đầy đủ từ do-sang.json nên chỉ ước lượng)." }
      : khongDu("Không có Tứ Sát nào thủ Mệnh hoặc Thân.");
  },
  "loc-suy-ma-khon": (ctx) => khongDu("Điều kiện gắn với lưu hạn (\"hạn gặp Thất Sát\") — engine chỉ đối chiếu lá số gốc, chưa duyệt diễn biến từng đại/tiểu hạn nên không tự khớp được."),
  "liem-sat-tham-pha-that-ham": (ctx) => {
    const oMenh = ctx.menh.chinhTinh;
    const boSao = ["Liêm Trinh", "Thất Sát", "Tham Lang", "Phá Quân"];
    const coBo = oMenh.some((s) => boSao.includes(s.name));
    if (!coBo) return khongDu("Mệnh không có sao nào trong bộ Liêm-Sát-Tham-Phá.");
    const thatHam = oMenh.every((s) => ham(ctx.hangSao(s.name, ctx.menh.chiName)));
    const coThemThatSat = oMenh.some((s) => s.name === "Thất Sát");
    return thatHam && coThemThatSat
      ? { khop: true, doTinCay: "trungbinh", lyDo: "Mệnh có sao trong bộ Liêm Sát Tham Phá ở thế thất hãm, lại có thêm Thất Sát." }
      : khongDu("Mệnh có sao trong bộ Liêm-Sát-Tham-Phá nhưng chưa thất hãm rõ hoặc thiếu thêm Thất Sát.");
  },
  "that-sat-duong-da-diet-tinh": (ctx) => {
    const ts = ctx.viTriChinhTinh("Thất Sát")[0];
    if (!ts) return khongDu("Không có Thất Sát trong lá số.");
    const vung = tuChinh(ts.chiIdx);
    const co = ctx.coSaoTaiCung(["Kình Dương"], vung) && ctx.coSaoTaiCung(["Đà La"], vung);
    return co
      ? { khop: true, doTinCay: "cao", lyDo: `Thất Sát (${ts.o.palaceName}) hội đủ Kình Dương và Đà La ở tam phương tứ chính.` }
      : khongDu("Thất Sát không hội đủ cả Kình Dương và Đà La ở tam phương tứ chính.");
  },
  "tam-phuong-sat-tu-hung-cach": (ctx) => {
    const cungCoSat = ctx.grid.filter((o) => {
      const bon = tuChinh(o.chiIdx);
      return bon.every((i) => ctx.tuSatTaiCung([i]));
    });
    return cungCoSat.length
      ? { khop: true, doTinCay: "cao", lyDo: `Tam phương tứ chính của cung ${cungCoSat.map((o) => o.palaceName).join(", ")} đều có Sát tinh ở cả 4 vị trí.` }
      : khongDu("Không có cung nào có Sát tinh phủ kín cả 4 vị trí tam phương tứ chính.");
  },
  "song-ky-kep-sat": (ctx) => khongDu("Điều kiện cần Hóa Kị của cả năm sinh, đại hạn và lưu niên — engine chỉ có Hóa Kị nguyên cục (năm sinh), chưa đối chiếu được đại hạn/lưu niên nên không tự khớp."),
  "linh-xuong-da-vu": (ctx) => {
    const bon = ["Linh Tinh", "Văn Xương", "Đà La", "Vũ Khúc"];
    const cungNao = [ctx.menh, ctx.than].find((o) => {
      const vung = tuChinh(o.chiIdx);
      return bon.every((t) => ctx.coSaoTaiCung([t], vung, { choPhepLuu: t === "Đà La" }));
    });
    return cungNao
      ? { khop: true, doTinCay: "trungbinh", lyDo: `Linh Tinh, Văn Xương, Đà La, Vũ Khúc cùng hội quanh cung ${cungNao.palaceName}.` }
      : khongDu("Không tìm thấy tổ hợp Linh Tinh - Văn Xương - Đà La - Vũ Khúc hội đủ quanh Mệnh hoặc Thân.");
  },
  "co-luong-duong-da-hoi": (ctx) => {
    const cungNao = [ctx.menh, ctx.than].find((o) => {
      const vung = tuChinh(o.chiIdx);
      const coCo = ctx.coSaoTaiCung(["Thiên Cơ"], vung);
      const coLuong = ctx.coSaoTaiCung(["Thiên Lương"], vung);
      const coSat = ctx.coSaoTaiCung(["Kình Dương", "Đà La"], vung);
      return coCo && coLuong && coSat;
    });
    return cungNao
      ? { khop: true, doTinCay: "cao", lyDo: `Thiên Cơ, Thiên Lương, Kình/Đà hội hợp quanh cung ${cungNao.palaceName} (Mệnh/Thân).` }
      : khongDu("Không tìm thấy Thiên Cơ, Thiên Lương, Kình/Đà cùng hội quanh Mệnh hoặc Thân.");
  },
  "hinh-tu-giap-an": (ctx) => {
    const cungNao = ctx.grid.find((o) => o.chinhTinh.some((s) => s.name === "Liêm Trinh") && o.chinhTinh.some((s) => s.name === "Thiên Tướng"));
    if (!cungNao) return khongDu("Không có cung nào Liêm Trinh - Thiên Tướng đồng cung.");
    const [truoc, sau] = giap(cungNao.chiIdx);
    const kep = (ctx.coSaoTaiCung(["Kình Dương"], [truoc]) || ctx.coSaoTaiCung(["Đà La"], [truoc]))
      && (ctx.coSaoTaiCung(["Kình Dương"], [sau]) || ctx.coSaoTaiCung(["Đà La"], [sau]));
    return kep
      ? { khop: true, doTinCay: "cao", lyDo: `Liêm Trinh - Thiên Tướng đồng cung ${cungNao.palaceName} bị Kình Dương/Đà La kẹp hai bên.` }
      : khongDu("Liêm Trinh - Thiên Tướng đồng cung nhưng không bị Kình/Đà kẹp hai bên.");
  },
  "liem-sat-duong-da-lo-thuong-mai-thi": (ctx) => {
    const cungNao = [ctx.menh, ctx.than].find((o) => {
      const vung = tuChinh(o.chiIdx);
      return ctx.coSaoTaiCung(["Liêm Trinh"], vung) && ctx.coSaoTaiCung(["Thất Sát"], vung) && ctx.coSaoTaiCung(["Kình Dương", "Đà La"], vung);
    });
    return cungNao
      ? { khop: true, doTinCay: "cao", lyDo: `Liêm Trinh, Thất Sát, Kình/Đà hội hợp quanh cung ${cungNao.palaceName} (Mệnh/Thân).` }
      : khongDu("Không tìm thấy Liêm Trinh, Thất Sát, Kình/Đà cùng hội quanh Mệnh hoặc Thân.");
  },
  "ma-dau-doi-kiem": (ctx) => ctx.coSaoTaiCung(["Kình Dương"], [CHI_IDX["Ngọ"]])
    ? { khop: true, doTinCay: "cao", lyDo: "Kình Dương đóng một mình tại cung Ngọ." }
    : khongDu("Kình Dương không đóng tại cung Ngọ."),
  "cu-hoa-duong-da": (ctx) => {
    const cuMon = ctx.viTriChinhTinh("Cự Môn")[0];
    if (!cuMon) return khongDu("Không có Cự Môn trong lá số.");
    const kep = timChinhTinhBiKep(ctx, ["Hỏa Tinh", "Kình Dương"]).some((o) => o.chiIdx === cuMon.chiIdx)
      || timChinhTinhBiKep(ctx, ["Hỏa Tinh", "Đà La"]).some((o) => o.chiIdx === cuMon.chiIdx);
    return kep
      ? { khop: true, doTinCay: "cao", lyDo: `Cự Môn (${cuMon.o.palaceName}) bị Hỏa Tinh và Kình Dương/Đà La kẹp hai bên.` }
      : khongDu("Cự Môn không bị kẹp bởi cặp Hỏa Tinh và Kình Dương/Đà La.");
  },
  "cu-linh-duong-da": (ctx) => {
    const cuMon = ctx.viTriChinhTinh("Cự Môn")[0];
    if (!cuMon) return khongDu("Không có Cự Môn trong lá số.");
    const kep = timChinhTinhBiKep(ctx, ["Linh Tinh", "Kình Dương"]).some((o) => o.chiIdx === cuMon.chiIdx)
      || timChinhTinhBiKep(ctx, ["Linh Tinh", "Đà La"]).some((o) => o.chiIdx === cuMon.chiIdx);
    return kep
      ? { khop: true, doTinCay: "cao", lyDo: `Cự Môn (${cuMon.o.palaceName}) bị Linh Tinh và Kình Dương/Đà La kẹp hai bên.` }
      : khongDu("Cự Môn không bị kẹp bởi cặp Linh Tinh và Kình Dương/Đà La.");
  },
  "hiep-sat-cach": (ctx) => {
    const capSat = [["Hỏa Tinh", "Kình Dương"], ["Hỏa Tinh", "Đà La"], ["Linh Tinh", "Kình Dương"], ["Linh Tinh", "Đà La"]];
    const ketQua = capSat.flatMap((cap) => timChinhTinhBiKep(ctx, cap).map((o) => ({ o, cap })));
    return ketQua.length
      ? { khop: true, doTinCay: "cao", lyDo: `Chính tinh tại ${[...new Set(ketQua.map((k) => k.o.palaceName))].join(", ")} bị một trong bốn cặp Hỏa/Linh - Dương/Đà kẹp hai bên.` }
      : khongDu("Không có chính tinh nào bị kẹp bởi bốn nhóm sát tinh Hỏa-Dương/Hỏa-Đà/Linh-Dương/Linh-Đà.");
  },
  "bat-to-hop-hoa-linh-duong-da-gap-khong-kiep": (ctx) => {
    const capSat = [["Hỏa Tinh", "Kình Dương"], ["Hỏa Tinh", "Đà La"], ["Linh Tinh", "Kình Dương"], ["Linh Tinh", "Đà La"]];
    for (const cap of capSat) {
      const oBiKep = timChinhTinhBiKep(ctx, cap);
      for (const o of oBiKep) {
        if (ctx.khongKiepTaiCung(giap(o.chiIdx)) || ctx.khongKiepTaiCung([o.chiIdx])) {
          return { khop: true, doTinCay: "cao", lyDo: `Chính tinh tại ${o.palaceName} bị ${cap.join(" - ")} kẹp, đồng thời có Địa Không/Địa Kiếp tại đó hoặc hai bên.` };
        }
      }
    }
    return khongDu("Không tìm thấy tổ hợp Hỏa/Linh-Dương/Đà kẹp chính tinh mà còn thêm Không Kiếp xung phá.");
  },
  "giap-ky-thanh-ac-cach": (ctx) => {
    if (!ctx.tuHoa.Kỵ) return khongDu("Lá số này không có Hóa Kị.");
    const idx = ctx.tuHoa.Kỵ.o.chiIdx;
    const [truoc, sau] = giap(idx);
    const capThu = [["Kình Dương", "Đà La"], ["Hỏa Tinh", "Linh Tinh"], ["Địa Kiếp", "Địa Không"]];
    const kep = capThu.some((cap) =>
      (ctx.coSaoTaiCung([cap[0]], [truoc]) && ctx.coSaoTaiCung([cap[1]], [sau])) ||
      (ctx.coSaoTaiCung([cap[1]], [truoc]) && ctx.coSaoTaiCung([cap[0]], [sau])));
    return kep
      ? { khop: true, doTinCay: "cao", lyDo: `Hóa Kị tại ${ctx.tuHoa.Kỵ.o.palaceName} bị một cặp Sát/Không Kiếp kẹp hai bên.` }
      : khongDu("Hóa Kị không bị Kình-Đà, Hỏa-Linh hoặc Không-Kiếp kẹp hai bên.");
  },
  "hoa-ky-hiep-sat-thanh-cach": (ctx) => {
    if (!ctx.tuHoa.Kỵ) return khongDu("Lá số này không có Hóa Kị.");
    const idx = ctx.tuHoa.Kỵ.o.chiIdx;
    const vung = tuChinh(idx);
    const capSat = [["Hỏa Tinh", "Kình Dương"], ["Hỏa Tinh", "Đà La"], ["Linh Tinh", "Kình Dương"], ["Linh Tinh", "Đà La"]];
    const hop = capSat.some((cap) => cap.every((t) => ctx.coSaoTaiCung([t], vung)));
    if (!hop) return khongDu("Hóa Kị không hội cùng một trong bốn tổ hợp Hỏa/Linh-Dương/Đà quanh cùng cung.");
    return !ctx.khongKiepTaiCung(vung)
      ? { khop: true, doTinCay: "cao", lyDo: `Hóa Kị tại ${ctx.tuHoa.Kỵ.o.palaceName} hiệp cùng một tổ hợp Hỏa/Linh-Dương/Đà, không có Không Kiếp.` }
      : khongDu("Hóa Kị hiệp sát đúng nhưng lại có thêm Không Kiếp — thuộc cách khác (Giáp Kị Thành Ác/Tám Tổ Hợp).");
  },
  "tam-phuong-ky-sat-cach": (ctx) => {
    if (!ctx.tuHoa.Kỵ) return khongDu("Lá số này không có Hóa Kị.");
    const cungCoDu = ctx.grid.find((o) => {
      const bon = tuChinh(o.chiIdx);
      return bon.every((i) => ctx.tuSatTaiCung([i])) && bon.includes(ctx.tuHoa.Kỵ.o.chiIdx);
    });
    return cungCoDu
      ? { khop: true, doTinCay: "cao", lyDo: `Tam phương tứ chính của cung ${cungCoDu.palaceName} vừa đầy đủ Sát tinh vừa có Hóa Kị.` }
      : khongDu("Không có cung nào tam phương tứ chính vừa đầy đủ Sát tinh vừa có Hóa Kị.");
  },
  "tam-ky-xung-khac": (ctx) => {
    const cungCoDu = ctx.grid.find((o) => ["Kỵ", "Quyền", "Khoa"].every((h) => ctx.tuHoa[h] && ctx.tuHoa[h].o.chiIdx === o.chiIdx));
    return cungCoDu
      ? { khop: true, doTinCay: "cao", lyDo: `Hóa Kị, Hóa Quyền, Hóa Khoa đồng thời hội nhập vào cung ${cungCoDu.palaceName}.` }
      : khongDu("Hóa Kị, Hóa Quyền, Hóa Khoa không cùng đồng thời rơi vào một cung.");
  },
};

export async function khopCachCuc(chart) {
  const [doSang, saoList, cachCucData] = await Promise.all([getDoSang(), getSao(), getCachCuc()]);
  const ctx = taoBoiCanh(chart, { doSang, saoList });
  return cachCucData.cachCuc.map((c) => {
    const luat = RULES[c.id];
    if (!luat) return { ...c, khop: false, doTinCay: "khong_ho_tro", lyDo: "Chưa có luật tự động cho cách này." };
    let ketQua;
    try {
      ketQua = luat(ctx);
    } catch (e) {
      ketQua = { khop: false, doTinCay: "loi", lyDo: "Lỗi khi kiểm tra: " + e.message };
    }
    return { ...c, ...ketQua };
  });
}
