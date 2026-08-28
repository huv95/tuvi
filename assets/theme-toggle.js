// Chuyển đổi giao diện sáng/tối, dùng chung cho mọi trang.
//
// Cơ chế: đặt/xoá class "giay" trên <html> — assets/theme.css đã định nghĩa
// lại toàn bộ token màu dưới class đó (trước đây chỉ dùng cho khung lá số in
// giấy, nay dùng luôn cho cả trang). Lựa chọn được lưu vào localStorage để
// lần sau vào lại giữ nguyên.
//
// Để tránh chớp giao diện tối trước khi JS này chạy (trang có sẵn <html
// class="dark">, không có "giay"), mỗi trang cần một script đồng bộ nhỏ đặt
// NGAY ĐẦU <head>, trước khi CSS tính toán:
//   <script>if (localStorage.getItem('tuvi-giao-dien') === 'sang') document.documentElement.classList.add('giay');</script>
// File này chỉ lo phần còn lại: vẽ icon đúng trạng thái và gắn sự kiện bấm.

const KHOA_LUU = 'tuvi-giao-dien';

export function initThemeToggle(nutBamId = 'nutChuyenGiaoDien') {
  const nut = document.getElementById(nutBamId);
  if (!nut) return;

  const capNhatIcon = () => {
    const sang = document.documentElement.classList.contains('giay');
    nut.innerHTML = sang ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    const nhan = sang ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng';
    nut.setAttribute('aria-label', nhan);
    nut.title = nhan;
  };
  capNhatIcon();

  nut.addEventListener('click', () => {
    const sang = document.documentElement.classList.toggle('giay');
    localStorage.setItem(KHOA_LUU, sang ? 'sang' : 'toi');
    capNhatIcon();
  });
}
