# Hợp đồng dữ liệu

Mọi file trong `data/` là **JSON thuần**: không chứa class CSS, không chứa HTML,
không phụ thuộc trang nào. Giao diện đọc qua `lib/repo.js`, không bao giờ
`fetch` thẳng — nhờ vậy ngày nối backend chỉ đổi một biến trong `repo.js`.

Liên kết giữa các file luôn bằng **`id`**, không bằng tên hiển thị. Đổi cách
viết tên không làm gãy tham chiếu.

---

## `sao.json` — 14 chính tinh

| Trường | Kiểu | Bắt buộc | Nguồn gốc | Ghi chú |
|---|---|---|---|---|
| `id` | string | ✓ | data.js | kebab không dấu: `tu-vi`, `thien-phu` |
| `ten` | string | ✓ | data.js | tên hiển thị |
| `loai` | string | ✓ | — | `chinh-tinh` |
| `nguHanh` | Kim/Mộc/Thủy/Hỏa/Thổ | ✓ | 3 nguồn, đã đối chiếu khớp 14/14 | dùng để tô màu |
| `amDuong` | Âm/Dương | ✓ | data.js `element` | |
| `dauTinh` | string \| null | | note/conguyetdongluong.txt | Nam/Bắc/Trung Đẩu Tinh — 3/14 sao có |
| `bo` | string | ✓ | data.js | Tử Phủ Vũ Tướng Liêm / Sát Phá Tham / … |
| `vongSao` | string \| null | | chinhtinh-chucnang | Vòng Tử Vi / Vòng Thiên Phủ |
| `loaiTinh` | string | ✓ | chinhtinh-chucnang, data.js | Đế Tinh, Kho Tinh… |
| `hoaKhi` | string \| null | | note/HoaKhi.txt | 9/14 sao có |
| `tomTat` | string | ✓ | data.js | một câu |
| `moTa` | string \| null | | chinhtinh-chucnang | |
| `cungTot` | string[] | ✓ | data.js `bestPositions` | **id cung**, không phải tên |
| `cungXau` | string[] | ✓ | data.js `worstPositions` | **id cung** |
| `luanCungTot` | string | ✓ | data.js `bestDetail` | |
| `luanCungXau` | string | ✓ | data.js `worstDetail` | |
| `tuKhoa` | string[] | ✓ | data.js | |
| `kyGap` | string[] | | data.js `worstPositions` | điều kiện kỵ, không phải cung (vd Thiên Phủ kỵ Không vong) |
| `dienMao` | string[] | | note/dienmao-phongthai.txt + conguyetdongluong.txt | 6/14 sao có |
| `phongThai` | string \| null | | note/conguyetdongluong.txt | 6/14 |
| `bieuTuong` | string[] | | note/conguyetdongluong.txt | 6/14 — hình ảnh biểu tượng |
| `luanBoSao` | string \| null | | conguyetdongluong.html | 4 sao Cơ Nguyệt Đồng Lương |
| `nguHanhBatDong` | string \| null | | so khớp nguồn | ghi lại khi tài liệu bất đồng, **không ghi đè** `nguHanh` |
| `ghiChu` | string[] | | note/conguyetdongluong.txt | 3/14 sao có |

**Không có `color` hay `borderBg`.** Màu suy ra từ `nguHanh` qua bảng ánh xạ
trong trang (giai đoạn 3 sẽ gom về token trong `theme.css`).

## `cung.json` — 12 cung chức

`id` · `ten` · `khiaCanh` (tagline ngắn, vd "Bản Ngã & Nền Tảng") · `nguHanh` ·
`cungXungChieu` (id) · `moTa` · `phamVi` (string[])

`khiaCanh` và `moTa` lấy từ note/Kiến thức nền.html, mục "Cung".

## `nhom-cung.json` — 8 nhóm tra cứu

Bản rút gọn cho trang tra cứu: gộp Huynh Đệ + Phụ Mẫu + Tử Tức thành
**Lục Thân**, và cố ý không có Nô Bộc, Thiên Di. Phủ 10/12 cung.
`id` · `ten` · `moTa` · `gomCung` (id[] trỏ vào `cung.json`)

## `do-sang.json` — miếu / vượng / đắc / hãm

`{ "<id-sao>": { "Tý": "V", "Sửu": "M", … } }` — 14 sao × 12 địa chi = 168 ô.
Giá trị: `M` Miếu · `V` Vượng · `Đ` Đắc · `H` Hãm.

## `dia-chi.json` — ngũ hành 12 địa chi

`ten` · `nguHanh`

## `cach-cuc.json` — tam hợp và thế Sát Phá Tham

- `tamHop[]`: `id` · `ten` · `loai` · `cung` (id[]) · `moTa`
- `theSatPhaTham[]`: `cungThatSat` · `cungPhaQuan` · `cungThamLang` (id) ·
  `luanThatSat` / `luanPhaQuan` / `luanThamLang` · `tuKhoa…` · `ngheNghiep` · `loiKhuyen`

## `quan-he-sao.json` — lục hại / nhị hợp / tam hợp

`sao` · `quanHe` · `voiSao` · `luan` (string[]) — từ `note/luchai.txt`.

## `quiz.json`

`hoi` · `luaChon` (string[]) · `dapAn` (chỉ số) · `giaiThich`

---

## Thêm hoặc sửa dữ liệu

Sửa thẳng file JSON, không cần đụng mã. Sau đó chạy `npm test` — bộ kiểm thử
xác nhận cấu trúc vẫn hợp lệ và mọi `id` tham chiếu đều tồn tại.

Hai script trong `tools/` là di trú một lần, giữ lại để truy nguồn:

- `gom-du-lieu.mjs` — gom từ `data.js` và `chinhtinh-chucnang.html`
- `gom-note-cnl.mjs` — bồi thêm từ `note/conguyetdongluong.txt`, và **báo ra khi
  tài liệu bất đồng** thay vì âm thầm ghi đè (xem `nguHanhBatDong`)
