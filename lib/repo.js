// ============================================================================
// lib/repo.js — Lớp truy cập dữ liệu duy nhất của project
//
// Giao diện KHÔNG bao giờ gọi thẳng fetch('data/sao.json'), mà gọi getSao().
// Hôm nay hàm đó đọc file JSON tĩnh; ngày nối backend chỉ đổi biến NGUON bên
// dưới thành '/api' — không trang nào phải sửa. Đây là bản lề duy nhất giữa
// "chạy bằng file tĩnh" và "chạy có server".
//
// Chạy được cả trong trình duyệt (fetch) lẫn Node (đọc thẳng từ đĩa).
// ============================================================================

/** Đổi thành new URL('/api/', location.origin) khi có backend. */
const NGUON = new URL('../data/', import.meta.url);

const bo_nho = new Map();

async function tai(ten) {
  if (bo_nho.has(ten)) return bo_nho.get(ten);
  const dia_chi = new URL(ten + '.json', NGUON);
  const p = dia_chi.protocol === 'file:'
    ? import('node:fs/promises').then(fs => fs.readFile(dia_chi, 'utf8')).then(JSON.parse)
    : fetch(dia_chi).then(r => {
        if (!r.ok) throw new Error(`Không tải được ${ten}.json — HTTP ${r.status}`);
        return r.json();
      });
  bo_nho.set(ten, p);
  return p;
}

/** 14 chính tinh: ngũ hành, hoá khí, cung tốt/xấu, từ khoá… */
export const getSao = () => tai('sao');

/** 12 cung chức: ngũ hành, cung xung chiếu, phạm vi quản hạt. */
export const getCung = () => tai('cung');

/** 8 nhóm cung dùng để tra cứu (Lục Thân gộp Huynh Đệ + Phụ Mẫu + Tử Tức). */
export const getNhomCung = () => tai('nhom-cung');

/** Độ sáng (Miếu M / Vượng V / Đắc Đ / Hãm H) của 14 chính tinh trên 12 địa chi. */
export const getDoSang = () => tai('do-sang');

/** Ngũ hành của 12 địa chi. */
export const getDiaChi = () => tai('dia-chi');

/** Tam hợp và 12 thế Sát Phá Tham. */
export const getCachCuc = () => tai('cach-cuc');

/** Quan hệ lục hại / nhị hợp / tam hợp giữa các sao. */
export const getQuanHeSao = () => tai('quan-he-sao');

/** Câu hỏi trắc nghiệm. */
export const getQuiz = () => tai('quiz');

/** Tra một sao theo id, ví dụ 'tu-vi'. */
export async function saoTheoId(id) {
  return (await getSao()).find(s => s.id === id) || null;
}

/** Tra một cung theo id, ví dụ 'quan-loc'. */
export async function cungTheoId(id) {
  return (await getCung()).find(c => c.id === id) || null;
}

/** Các sao đắc địa tại một cung. */
export async function saoTotTaiCung(cungId) {
  return (await getSao()).filter(s => s.cungTot.includes(cungId));
}

/** Các sao hãm địa tại một cung. */
export async function saoXauTaiCung(cungId) {
  return (await getSao()).filter(s => s.cungXau.includes(cungId));
}

/** Xoá bộ nhớ đệm — dùng khi dữ liệu đổi lúc đang chạy. */
export const xoaBoNho = () => bo_nho.clear();
