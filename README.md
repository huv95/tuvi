# Tử Vi Đẩu Số

Bộ công cụ lập lá số và tra cứu Tử Vi. Trang tĩnh thuần, không build step.

```bash
npm run dev     # python3 -m http.server 8000 → mở localhost:8000
npm test        # 209 phép kiểm cho lib/ và data/
```

Phải chạy qua server tĩnh, **không mở trực tiếp bằng `file://`** — trình duyệt
chặn `import` giữa các file JS và `fetch` file JSON khi dùng giao thức đó.

Nếu 8000 đang bận (server cũ chưa tắt): `lsof -ti:8000 | xargs kill` rồi chạy
lại `npm run dev`. Máy không có `shot.mjs`/WSL thì chụp ảnh đối chiếu bằng
Chrome/Edge cài sẵn ở chế độ headless, ví dụ trên macOS:

```bash
"/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
  --headless --disable-gpu --window-size=1400,1300 \
  --screenshot=out.png http://localhost:8000/ansaotudong.html
```

### Các trang, mở sau khi `npm run dev`

| Trang | Nội dung |
|---|---|
| `index.html` | Mục lục, cũng là nơi lập lá số nhanh |
| `ansaotudong.html` | Lập lá số đầy đủ (đại/tiểu hạn, luận giải AI) |
| `SatPhaTham.html` | Khám phá tam hợp Sát Phá Tham |
| `ansaothucong.html` | Tự tay lập lá số từng bước, an 14 chính tinh |
| `chinhtinh-chucnang.html` | Tra cứu 14 chính tinh với các cung chức năng |
| `chinhtinh-cathung.html` | 14 chính tinh & quy luật cát hung |
| `conguyetdongluong.html` | Cơ Nguyệt Đồng Lương |
| `amduongnguhanh.html` | Âm Dương Ngũ Hành — kiến thức nền |
| `thiepcuoi-nhagai.html` / `thiepcuoi-nhatrai.html` | Thiệp cưới, ngoài phạm vi lá số |

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

Bốn giai đoạn đầu đã xong:

- **GĐ 1** — rút `lib/lich.js` và `lib/ansao.js` khỏi `ansaotudong.html`
- **GĐ 2** — gom dữ liệu về `data/*.json`, dựng `lib/repo.js`, xoá `data.js`
- **GĐ 3** — gom màu và chữ về `assets/theme.css`
- **GĐ 4** — gom bố cục địa bàn 12 cung về `assets/ui.js`, chi tiết bên dưới

---

## GĐ 4 — Tách `assets/ui.js` ✅ xong

### Vấn đề

**Năm trang cùng vẽ địa bàn 12 cung, theo ba cách khác nhau:**

| Trang | Cách vẽ | Mảng bố cục riêng |
|---|---|---|
| `ansaotudong.html` | template string | lưới 4×4 viết thẳng trong markup |
| `ansaochinhtinh.html` | JSX (React) | `BRANCHES` + `getGridStyle` |
| `ansao14chinhtinh_toigian.html` | JSX (React) | `BRANCHES` + `getGridStyle` |
| `SatPhaTham.html` | template string | `GRID_LAYOUT` + `HOUSES` |
| `chinhtinh-chucnang.html` | Alpine `x-for` | CSS class `pos-*` theo tên Chi |

Sửa một chi tiết của địa bàn — đổi thứ tự chi, thêm nhãn, đổi cách hiển thị
Tứ Hóa — phải làm năm lần theo ba cú pháp. Dựng trang mới có địa bàn thì phải
chép lại từ đầu.

### Đã làm

`assets/ui.js` xuất các hàm thuần:

```js
export const O_LUOI                        // toạ độ 12 ô viền lưới 4×4, xem chú thích trong file
veKhungLuoi(khung, { taoO, taoTam })        // dựng khung lưới, gọi taoO(k)/taoTam() lấy nội dung
veDiaBan(khung, laSo, tuyChon)              // laSo là object từ lib/ansao.js; tuyChon: onCungClick, rutGon
veTheSao(sao)                               // tên + màu ngũ hành + nhãn Tứ Hóa
moModalCung(cung)                           // bảng chi tiết một cung
```

Thực tế không phải 5 trang nào cũng dùng `veDiaBan` được — chỉ trang nào có
**dữ liệu lá số thật** (chính tinh, phụ tinh, đại/tiểu hạn theo Chi cụ thể của
một người) mới khớp shape của nó. Ba trang còn lại chỉ có "vị trí trên lưới",
không có lá số, nên dùng `O_LUOI`/`veKhungLuoi` ở mức thấp hơn:

1. **`ansaotudong.html`** — gọi thẳng `veDiaBan` + `moModalCung`, bỏ ~170 dòng
   markup và logic vẽ tay. Trang duy nhất có lá số thật.
2. **`SatPhaTham.html`** — không có lá số, chỉ có tên cung + badge sao gán
   động. Dùng `veKhungLuoi` để dựng khung, tự lo nội dung ô. Tiện thể sửa một
   lỗi có sẵn: `onclick="onHouseClick(...)"` gắn qua thuộc tính HTML nhưng hàm
   không có trên `window` (script là module) — bấm vào cung sẽ lỗi. Chuyển
   sang `addEventListener`.
3. **`ansaochinhtinh.html`, `ansao14chinhtinh_toigian.html`** (React/JSX) —
   không dùng `veDiaBan` được vì đây là công cụ minh hoạ vị trí 14 chính tinh
   theo Chi (không có Mệnh/Thân/đại-tiểu hạn), và hàm thuần trả DOM không ghép
   tự nhiên vào JSX (xem "Rủi ro" cũ). Chỉ thay `getGridStyle` — bảng 12 dòng
   hard-code trùng nhau ở cả hai file — bằng công thức tra `O_LUOI`. Bật được
   nhờ `data-type="module"` trên `<script type="text/babel">`, tính năng có
   sẵn của babel-standalone cho phép `import` ES module trong JSX inline.
   (Về sau hai file này bị xoá hẳn, gộp vào `ansaothucong.html` — xem mục
   "An Sao Thủ Công" bên dưới.)
4. **`chinhtinh-chucnang.html`** (Alpine) — cũng chỉ lấy vị trí lưới từ
   `O_LUOI` qua `:style`, không gọi `veDiaBan`. Phát hiện thêm khi sửa: class
   động `pos-${palace.chi}` build ra tên **có dấu** (`pos-Tị`) nhưng CSS chỉ
   định nghĩa tên **không dấu** (`.pos-Ti`) — không khớp bao giờ, nên bàn cờ
   thực tế chạy theo CSS Grid auto-placement lấy thứ tự `data/cung.json`,
   không theo Chi thật. Đã sửa cùng lúc với việc chuyển sang `O_LUOI` (đối
   chiếu xác nhận bằng git, lỗi có sẵn từ trước, không phải do đợt này gây
   ra). Sửa luôn chính tả "Tị" → "Tỵ" cho khớp `lib/lich.js`.

### Rủi ro (đã xử lý)

Hai trang React từng lo hàm thuần trả DOM không ghép tự nhiên vào JSX. Thực
tế không cần giải quyết — vì chỉ phần **vị trí lưới** (dữ liệu thuần, không
phải DOM) là thứ trùng lặp thật giữa các trang, nên chỉ cần chia sẻ `O_LUOI`
là đủ, JSX vẫn tự render như cũ.

**Không có test nào phủ phần vẽ**, đúng như lo ngại ban đầu. Máy phát triển
không có WSL/`shot.mjs` nên đối chiếu bằng Chrome/Edge cài sẵn ở chế độ
headless — xem mục "Chạy local" ở đầu file.

### Coi là xong khi

- Địa bàn 12 cung chỉ còn một chỗ định nghĩa bố cục (`O_LUOI`) — ✅
- ~~Ít nhất ba trang gọi `veDiaBan`~~ — chỉnh lại: chỉ 1 trang gọi được
  `veDiaBan` (trang có lá số thật), 4 trang còn lại dùng `O_LUOI`/`veKhungLuoi`
  vì không có dữ liệu lá số để khớp shape của `veDiaBan`. Không trang nào còn
  tự dựng lưới — ✅ theo tinh thần, không theo đúng chữ tiêu chí gốc
- Ảnh chụp trước/sau của từng trang không đổi ngoài phần cố ý đổi — ✅ (trừ
  `chinhtinh-chucnang.html`, đổi có chủ đích để sửa lỗi bố cục)
- `npm test` vẫn 209/209 — ✅

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

## An Sao Thủ Công

Gộp `ansaochinhtinh.html` và `ansao14chinhtinh_toigian.html` (hai công cụ minh
hoạ vị trí 14 chính tinh theo Chi, không có dữ liệu sinh thật) cùng nội dung
tính tay trong `note/An sao.html` và `note/Bảng tra cứu.html` thành
`ansaothucong.html` — nhập ngày giờ sinh thật, xem từng bước tính lá số thay
vì chỉ ra kết quả cuối như `ansaotudong.html`.

Hai chặng:
1. **Thiết lập lá số** — Âm Dương, Cung Mệnh/Cung Thân, Cục, Chủ Mệnh/Chủ Thân
2. **An 14 chính tinh** — vị trí Tử Vi, vị trí Thiên Phủ, vòng Tử Vi (6 sao,
   nghịch), vòng Thiên Phủ (8 sao, thuận), rồi vẽ bàn cờ bằng `veDiaBan`

Mỗi bước gọi thẳng hàm thuần trong `lib/ansao.js` (`calculateMenhThan`,
`calculateNgocHanhCuc`, `calculateTuViPosition`, `MENH_CHU`, `THAN_CHU`) — tính
lại giá trị trung gian bằng đúng công thức của engine, không suy luận riêng,
nên không lệch với bàn cờ cuối cùng. Hai việc phải sửa `lib/ansao.js` để lộ ra
được:
- `TU_VI_GROUP`/`THIEN_PHU_GROUP` (offset 6 sao vòng Tử Vi, 8 sao vòng Thiên
  Phủ) trước đây khai cục bộ trong `generateTuViChart`, giờ xuất ra module để
  trang hiển thị bảng offset. Đổi `push(s)` thành `push({...s})` khi gắn vào
  cung — nếu không, `tuHoa` gắn lên object dùng chung sẽ rò rỉ giữa các lần
  gọi hàm khác nhau.
- `calculateNgocHanhCuc` trả thêm `canChi`/`napAm` của cung Mệnh (bước trung
  gian để ra Cục) — chỉ thêm trường, không đổi trường cũ nên không ảnh hưởng
  chỗ gọi khác.

Đối chiếu kết quả trang với đúng ví dụ tính tay trong `note/An sao.html`
(Ất Hợi 1995, Âm Nam, giờ Dần) — khớp hoàn toàn từng bước: Cục, Chủ Mệnh, Chủ
Thân, vị trí Tử Vi/Thiên Phủ.

---

## Việc còn treo

~~**Tứ Hóa can Canh** đang dùng `Nhật Lộc – Vũ Quyền – Âm Khoa – Đồng Kỵ`. Đa
số sách Việt dùng `Đồng Khoa – Âm Kỵ` (hoán đổi Khoa/Kỵ). Can Canh có ít nhất
bốn dị bản giữa các phái nên chưa tự sửa.~~ Đã chốt: giữ nguyên
`Nhật Lộc – Vũ Quyền – Âm Khoa – Đồng Kỵ` — khớp sẵn với `tuHoaMap` trong
`lib/ansao.js` (`["Thái Dương","Vũ Khúc","Thái Âm","Thiên Đồng"]`), không cần
sửa code.

~~**Ngũ hành Thiên Lương** — bất đồng giữa `data/sao.json` (Mộc) và
`note/conguyetdongluong.txt` (Thổ).~~ Đã chốt: **Dương Mộc**. `data/sao.json`
(`nguHanh`/`amDuong`) và `lib/ansao.js` vốn đã đúng, chỉ xoá trường
`nguHanhBatDong` (hết bất đồng) và sửa chú thích màu sai trong
`conguyetdongluong.html`. `note/conguyetdongluong.txt` là ghi chép tham khảo
gốc, tự nó cũng mâu thuẫn nội bộ (dòng 7 ghi Dương Mộc, dòng 62 ghi Dương Thổ)
— để nguyên, không sửa file ghi chép cá nhân.

~~**Sao chưa an:** Tuần, Triệt, vòng Trường Sinh phụ, Thiên Hình – Thiên Diêu
mở rộng.~~

- **Tuần, Triệt** — đã an. Triệt cố định theo Can năm sinh; Tuần theo tuần
  Giáp (lục thập hoa giáp) của Can-Chi năm sinh. Cả hai khoanh 2 cung liền
  nhau, đẩy vào `phuTinhXau` như phụ tinh thường. 11 lá số mẫu không liệt hai
  sao này (tuvivietnam.vn vẽ viền chéo riêng, không đưa vào danh sách phụ
  tinh) nên xác minh bằng bảng tra độc lập ở `test/ansao.test.js` mục C, đối
  chiếu tay với khẩu quyết chuẩn — không suy từ chính công thức vừa viết.
- **Thiên Hình – Thiên Diêu** — hoá ra đã an sẵn từ trước (khởi Sửu, theo
  tháng sinh), khớp dữ liệu 11 lá số chuẩn. Thống nhất gọi là "Thiên Diêu"
  trong toàn bộ project (tên khác của cùng một sao ở một số tài liệu là
  "Thiên Riêu"). Không cần sửa gì.
~~- **Vòng Trường Sinh phụ** — vẫn treo, cần biết rõ cách tính (thường theo
  Chi năm sinh, khác vòng chính đang có theo Cục) trước khi làm.~~ Đã chốt:
  không cần làm gì thêm. Vòng Bác Sĩ (khởi theo Lộc Tồn/Can năm sinh) và vòng
  Thái Tuế (khởi theo Chi năm sinh) đã có sẵn trong `lib/ansao.js` — về cấu
  trúc đây chính là các vòng Trường Sinh phụ, chỉ đổi tên 12 vị trí.

**Thiệp cưới dùng Marcellus và Great Vibes** — hai font này không có subset
tiếng Việt nên dấu rơi về font dự phòng. Để nguyên vì đó là thế giới hình ảnh
riêng, nhưng nếu chỉnh thì đây là chỗ cần biết.
