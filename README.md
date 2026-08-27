# Tử Vi Đẩu Số

Bộ công cụ lập lá số và tra cứu Tử Vi. Trang tĩnh thuần, không build step.

```bash
npm run dev     # python3 -m http.server 8000 → mở localhost:8000
npm test        # 209 phép kiểm cho lib/ và data/
```

Phải chạy qua server tĩnh, **không mở trực tiếp bằng `file://`** — trình duyệt
chặn `import` giữa các file JS và `fetch` file JSON khi dùng giao thức đó.

## Ba tầng

Mũi tên chỉ đi xuống. Tầng dưới không biết tầng trên tồn tại.

```
pages/*.html · assets/theme.css        giao diện — chỉ ghép và hiển thị
        ↓ gọi hàm
lib/lich.js · lib/ansao.js · repo.js   logic — JS thuần, không chạm DOM
        ↓ đọc qua repo                 chạy được cả browser lẫn Node
data/*.json                            dữ liệu — không một class CSS nào
```

| Thư mục | Nội dung |
|---|---|
| `lib/` | `lich.js` đổi lịch Âm–Dương · `ansao.js` engine an sao · `repo.js` lớp truy cập dữ liệu |
| `data/` | 8 file JSON + `schema.md` mô tả từng trường và nguồn gốc |
| `assets/` | `theme.css` — 25 token màu và chữ, khai lại cho mặt giấy; dùng chung mọi trang |
| `test/` | 209 phép kiểm, đối chiếu 11 lá số chuẩn tuvivietnam.vn |
| `tools/` | `shot.mjs` chụp ảnh trang · hai script di trú dữ liệu |

## Lộ trình

Ba giai đoạn đầu đã xong:

- **GĐ 1** — rút `lib/lich.js` và `lib/ansao.js` khỏi `ansaotudong.html`
- **GĐ 2** — gom dữ liệu về `data/*.json`, dựng `lib/repo.js`, xoá `data.js`
- **GĐ 3** — gom màu và chữ về `assets/theme.css`

---

## GĐ 4 — Tách `assets/ui.js`

### Vấn đề

**Năm trang cùng vẽ địa bàn 12 cung, theo ba cách khác nhau:**

| Trang | Cách vẽ | Mảng bố cục riêng |
|---|---|---|
| `ansaotudong.html` | template string | lưới 4×4 viết thẳng trong markup |
| `ansaochinhtinh.html` | JSX (React) | `BRANCHES` |
| `ansao14chinhtinh_toigian.html` | JSX (React) | `BRANCHES` |
| `SatPhaTham.html` | template string | `GRID_LAYOUT` + `HOUSES` |
| `chinhtinh-chucnang.html` | Alpine `x-for` | dựng trong `initApp()` |

Sửa một chi tiết của địa bàn — đổi thứ tự chi, thêm nhãn, đổi cách hiển thị
Tứ Hóa — phải làm năm lần theo ba cú pháp. Dựng trang mới có địa bàn thì phải
chép lại từ đầu.

### Việc cần làm

Dựng `assets/ui.js` xuất các hàm thuần, nhận dữ liệu và trả DOM:

```js
veDiaBan(khung, laSo, tuyChon)   // laSo là object từ lib/ansao.js
veTheSao(sao)                    // tên + màu ngũ hành + nhãn Tứ Hóa
moModalCung(cung)                // bảng chi tiết một cung
veThanhTab(muc, dangChon)
```

Thứ tự đề xuất, mỗi bước tự đứng được:

1. **Chốt bố cục địa bàn ở một nơi** — thứ tự 12 chi trên lưới 4×4 và vị trí ô
   Thiên Bàn. Hiện `THU_TU` trong `SatPhaTham.html` và thứ tự cứng trong
   `ansaotudong.html` đang nói cùng một điều bằng hai cách.
2. **Rút `veDiaBan` từ `ansaotudong.html`** — trang này có bản đầy đủ nhất
   (đủ sao, đại hạn, tiểu hạn, vòng Trường Sinh) nên là điểm xuất phát tốt.
   Tuỳ chọn cho phép ẩn bớt lớp thông tin để trang khác dùng lại bản gọn.
3. **Chuyển `SatPhaTham.html`** sang dùng — trang này gần nhất về cách vẽ.
4. **Chuyển hai trang React** — đây là chỗ nặng nhất, xem phần rủi ro.
5. **Chuyển `chinhtinh-chucnang.html`** — Alpine gọi hàm thuần được, nhưng
   phần tương tác (chọn cung, gán sao) phải giữ lại trong component.

### Rủi ro

**Hai trang React là phần khó.** `ansaochinhtinh.html` có 955 dòng JSX với 5
biến trạng thái, `ansao14chinhtinh_toigian.html` có 178 dòng. Hàm thuần trả về
DOM không ghép tự nhiên vào React. Ba lối:

- Bọc bằng `useRef` + `useEffect` gọi `veDiaBan` — nhanh, nhưng React mất
  quyền kiểm soát phần cây đó
- Viết lại hai trang bằng vanilla — sạch nhất, nhưng là dự án riêng
- Để hai trang React ngoài phạm vi GĐ 4, chỉ gom ba trang còn lại

Lối thứ ba là hợp lý nếu bạn chưa muốn động vào React. Ba trang vẫn đủ để
`ui.js` có giá trị, và quyết định về React có thể để đến khi cần thật.

**Không có test nào phủ phần vẽ.** Bộ kiểm thử hiện chỉ phủ `lib/` và `data/`.
Sai sót ở tầng vẽ chỉ thấy được bằng mắt, nên mỗi bước phải chụp ảnh đối chiếu:

```bash
node tools/shot.mjs ansaotudong.html --out truoc.png
# …sửa…
node tools/shot.mjs ansaotudong.html --out sau.png
```

### Coi là xong khi

- Địa bàn 12 cung chỉ còn một chỗ định nghĩa bố cục
- Ít nhất ba trang gọi `veDiaBan`, không trang nào tự dựng lưới
- Ảnh chụp trước/sau của từng trang không đổi ngoài phần cố ý đổi
- `npm test` vẫn 209/209

---

## GĐ 5 — Backend

### Vì sao cần

Lý do rõ ràng và cấp nhất: **API key của Gemini đang nằm trong mã client.**

```
ansaotudong.html       const apiKey = "";
chinhtinh-cathung.html const apiKey = "";
```

Hiện là chuỗi rỗng nên vô hại. Nhưng điền key thật vào rồi deploy là key đó
công khai với mọi người mở trang — xem mã nguồn là thấy. Không có cách nào
giấu key ở phía client, nên đây là việc buộc phải có server.

### Kiến trúc đã sẵn sàng

Ba điểm móc dựng từ GĐ 1 và GĐ 2, không cần đụng giao diện:

| Việc | Hôm nay | Khi có backend |
|---|---|---|
| Đọc dữ liệu | `repo.js` fetch JSON tĩnh | cùng `repo.js` → `GET /api/sao` |
| Lập lá số | `ansao.js` chạy trong trình duyệt | **đúng file đó** chạy trong Node |
| Luận giải AI | key trong mã client | `POST /api/luan-giai`, key ở server |

Đổi nguồn dữ liệu là đổi đúng một hằng số:

```js
// lib/repo.js
const NGUON = new URL('../data/', import.meta.url);
// → new URL('/api/', location.origin)
```

### Ba bước, làm được riêng lẻ

**Bước 1 — proxy AI.** Một endpoint duy nhất. Đây là bước duy nhất thực sự
cần làm sớm.

```
POST /api/luan-giai   { laSo }  →  { html }
```

Server giữ key trong biến môi trường, gọi Gemini, trả kết quả. Thêm được giới
hạn số lần gọi. Hàm serverless là đủ — Vercel, Netlify, Cloudflare Workers đều
có bậc miễn phí, và trang vẫn deploy tĩnh như cũ.

Sau bước này, hai trang bỏ `const apiKey` và gọi `/api/luan-giai` thay cho
`generativelanguage.googleapis.com`.

**Bước 2 — lưu lá số.** Chỉ làm khi thực sự cần chia sẻ hoặc xem lại.

```
POST /api/la-so   { ngaySinh, gioSinh, gioiTinh }  →  { id }
GET  /api/la-so/:id                                →  { laSo }
```

`lib/ansao.js` chạy nguyên trong Node, không phải viết lại. Cân nhắc: tính ở
client vẫn nhanh hơn, backend chỉ cần lưu tham số đầu vào — lá số dựng lại
được từ đó, và như vậy sửa lỗi an sao về sau không làm lá số cũ sai theo.

**Bước 3 — tài khoản.** Chỉ khi có nhu cầu thật. Người dùng lưu nhiều lá số,
đặt tên, ghi chú.

### Cần quyết trước khi bắt đầu

- **Nơi đặt server.** Serverless đủ cho bước 1 và 2. Chỉ cần máy chủ thường
  nếu sau này có tác vụ nền.
- **Cơ sở dữ liệu.** Bước 2 lưu rất ít — SQLite hoặc một bảng KV là đủ. Đừng
  dựng Postgres cho vài trăm dòng.
- **`data/` chuyển sang API hay giữ tĩnh.** Giữ tĩnh nhanh hơn và cache tốt
  hơn. Chỉ chuyển khi cần sửa nội dung mà không deploy lại.

### Coi là xong khi

- Không còn `apiKey` nào trong mã client
- Trang vẫn chạy được ở chế độ tĩnh khi không có backend (tính năng AI tắt,
  phần còn lại nguyên vẹn)
- `npm test` vẫn 209/209 — `lib/` không được phụ thuộc vào mạng

---

## Việc còn treo

**Tứ Hóa can Canh** đang dùng `Nhật Lộc – Vũ Quyền – Âm Khoa – Đồng Kỵ`. Đa số
sách Việt dùng `Đồng Khoa – Âm Kỵ` (hoán đổi Khoa/Kỵ). Can Canh có ít nhất bốn
dị bản giữa các phái nên chưa tự sửa.

**Ngũ hành Thiên Lương** — `data/sao.json` ghi Mộc, `note/conguyetdongluong.txt`
ghi Thổ. Bất đồng được lưu ở trường `nguHanhBatDong` thay vì âm thầm chọn một
bên. `lib/ansao.js` và cả 11 lá số chuẩn đều theo Mộc.

**Sao chưa an:** Tuần, Triệt, vòng Trường Sinh phụ, Thiên Hình – Thiên Riêu mở
rộng.

**Thiệp cưới dùng Marcellus và Great Vibes** — hai font này không có subset
tiếng Việt nên dấu rơi về font dự phòng. Để nguyên vì đó là thế giới hình ảnh
riêng, nhưng nếu chỉnh thì đây là chỗ cần biết.
