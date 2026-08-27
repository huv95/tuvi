# Bộ kiểm thử lá số Tử Vi

```bash
npm test                       # chạy toàn bộ
node test/ansao.test.js -v     # in chi tiết từng phép kiểm
```

Thoát mã `1` nếu có lỗi → dùng được trong CI hoặc pre-commit hook.

## Cấu trúc

| File | Nội dung |
|---|---|
| `ansao.test.js` | Bộ chạy. `import` thẳng từ `lib/lich.js` và `lib/ansao.js`, không cần build. |
| `lasomau.js` | Dữ liệu 11 lá số chuẩn lấy từ tuvivietnam.vn. |

## 4 tầng kiểm tra

**A. Đổi lịch** — 16 mốc lịch Việt Nam (Tết 2015/2023/2024/2025/2026, tháng nhuận 2/2023 · 4/2020 · 4/1982, 2/9/1945), `jdToSolar ↔ jdFromDate` nghịch đảo trên 400.000 ngày, round-trip Dương→Âm→Dương 73.049 ngày (1900-2100), chi giờ sinh 24/24, trụ ngày.

**B. 11 lá số chuẩn** — mỗi lá đối chiếu 7 mục thông tin gốc + 7 mục × 12 cung: tên cung chức, đại hạn, tiểu hạn, vòng Trường Sinh, chính tinh (đúng thứ tự), Tứ Hóa, phụ tinh (thiếu/thừa).

**C. Quy tắc an sao** — bảng tra Thiên Khôi/Việt, Lộc Tồn–Kình–Đà, Thiên Mã, vòng Thái Tuế, Tứ Hóa (10 can), vòng Trường Sinh theo Cục.

**D. Bất biến** — 500 lá số sinh ngẫu nhiên: đủ 14 chính tinh không trùng, Thân lệch Mệnh số chẵn cung, Tử Vi–Thiên Phủ đối xứng qua trục Dần–Thân, 12 cung chức và 12 mốc đại hạn không trùng, vòng Trường Sinh phủ đủ 12 cung.

## Độ phủ của 11 lá số

10/10 Thiên Can · 5/5 Ngũ Hành Cục · 4/4 Âm Dương Nam Nữ · tháng thường lẫn tháng nhuận · 5 giờ sinh · Mệnh ở 5 vị trí · có/không Vô Chính Diệu · Thân cư 4 cung khác nhau.

## Thêm lá số mới

Chép một lá số từ tuvivietnam.vn vào `lasomau.js` theo đúng khuôn có sẵn. Lưu ý khi đọc ảnh: site viết **"Tí" = Tý** còn **"Ty" = Tỵ** — đây là chỗ dễ chép nhầm nhất.

Khi bộ test báo đỏ, **kiểm chứng độc lập bằng quy tắc trước khi kết luận là lỗi code**. Nếu một vòng 12 sao chỉ sai đúng 1 ô thì gần như chắc chắn là chép nhầm, vì lỗi công thức sẽ dịch cả vòng.

## Lịch sử

Bộ test này được dựng trong lúc sửa `ansaotudong.html` và đã phát hiện **11 lỗi thật** ở tầng an sao (Thiên Phủ lệch 4 cung kéo theo 8/14 chính tinh, bảng Khôi/Việt sai 10/10 dòng, Tứ Hóa Bính & Mậu, Tứ Hóa không bám phụ tinh, thứ tự 12 cung bị đảo, Chủ Mệnh tra sai chỉ số, Tiểu Hạn vô nghĩa, Giải Thần sai cơ sở an sao, Thiên Trù can Quý, Lưu Hà can Đinh, sai chính tả "Thái Tế"), cộng 3 lỗi tầng đổi lịch và 4 lỗi tầng thiên văn.
