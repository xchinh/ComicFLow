# InkVerse / Truyen Tranh Online — Project Review

## 1. Tổng quan dự án

Đây là dự án **UI/UX demo cho nền tảng truyện tranh online theo mô hình thương mại điện tử nội dung số**. Sản phẩm mô phỏng hệ sinh thái gồm 3 nhóm người dùng chính:

- **Reader / Độc giả**: tìm truyện, đọc chương, mua chương bằng coin, đăng ký Premium, bình luận, theo dõi và lưu tiến độ đọc.
- **Author / Creator / Tác giả**: đăng ký Creator, quản lý bộ truyện, upload chương PDF, viết blog bằng editor, xem analytics, doanh thu và tương tác với độc giả.
- **Admin / Quản trị**: duyệt nội dung, quản lý người dùng, xử lý báo cáo vi phạm, quản lý doanh thu, payout, cấu hình hệ thống và truyện featured.

Dự án hiện tại phù hợp để:

- demo ý tưởng sản phẩm,
- trình bày UI/UX với sếp/khách hàng,
- kiểm thử flow Reader / Author / Admin,
- làm nền để phát triển backend thật sau này.

> Lưu ý: Đây là frontend demo dùng mock data/localStorage. Chưa phải production app hoàn chỉnh.

---

## 2. Tech stack

- **React 18**
- **Vite 6**
- **TypeScript / TSX**
- **Tailwind CSS 4**
- **React Router**
- **Lucide React** cho icon
- **Recharts** cho biểu đồ dashboard
- **Radix UI / shadcn-style components**
- **Tiptap Editor** cho chức năng viết blog của tác giả
- **localStorage** để mô phỏng session, bài blog, upload chương và dữ liệu demo

---

## 3. Cài đặt và chạy local

### Yêu cầu môi trường

Nên dùng Node.js 20.x để đồng bộ với cấu hình deploy Vercel.

### Cài dependency

```bash
npm install
```

### Chạy development server

```bash
npm run dev
```

Sau đó mở URL Vite hiển thị trong terminal, thường là:

```text
http://localhost:5173
```

### Build production

```bash
npm run build
```

### Preview build production

```bash
npm run preview
```

---

## 4. Tài khoản demo

| Vai trò | Email | Password |
|---|---|---|
| Reader | `reader@inkverse.demo` | `123456` |
| Author | `author@inkverse.demo` | `123456` |
| Admin | `admin@inkverse.demo` | `123456` |

Đăng nhập tại:

```text
/login
```

Sau khi đăng nhập, dropdown tài khoản sẽ hiển thị các mục phù hợp theo vai trò. Với tài khoản Reader, không hiển thị mục Quản trị.

---

## 5. Route chính trong dự án

| Route | Mục đích |
|---|---|
| `/` | Trang chủ |
| `/explore` | Khám phá truyện, tìm kiếm, lọc danh mục, lọc trạng thái, sắp xếp |
| `/trending` | Trang thịnh hành, ranking truyện theo độ hot |
| `/new` | Trang truyện mới, hiện dùng Explore Page |
| `/category/:categoryName` | Deep link danh mục, mở Explore Page với category tương ứng |
| `/comic/:id` | Chi tiết truyện |
| `/read/:comicId/:chapterId` | Trang đọc chương |
| `/wallet` | Ví coin và lịch sử giao dịch |
| `/premium` | Gói Premium và quota lượt đọc |
| `/library` | Thư viện của độc giả |
| `/profile` | Hồ sơ và dữ liệu mock theo tài khoản |
| `/blog` | Danh sách blog public của tác giả |
| `/blog/:id` | Chi tiết bài blog public |
| `/creator/register` | Đăng ký Creator |
| `/creator` | Dashboard tác giả |
| `/creator/upload` | Upload chương mới bằng PDF và checklist bản quyền |
| `/creator/blog/new` | Viết blog bằng Tiptap Editor |
| `/admin` | Dashboard quản trị |
| `/admin/settings` | Cấu hình hệ thống |
| `/demo-test` | Trung tâm checklist test demo |
| `/login` | Đăng nhập mock |

---

## 6. Review chức năng theo vai trò

## 6.1 Reader / Độc giả

### Đã có

- Tìm kiếm truyện.
- Duyệt truyện theo danh mục.
- Lọc truyện không cần reload toàn trang.
- Phân biệt **Khám phá** và **Thịnh hành**.
- Xem chi tiết truyện.
- Đọc chương miễn phí.
- Đọc chương trả phí.
- Mở khóa chương bằng coin.
- Đăng ký / xem gói Premium.
- Hiển thị quota Premium:
  - tổng lượt đọc Premium/tháng,
  - đã dùng,
  - còn lại,
  - ngày reset quota.
- Ví coin.
- Truy vết lịch sử mua coin:
  - mã đơn hàng,
  - phương thức thanh toán,
  - trạng thái,
  - số dư trước/sau,
  - email nhận hóa đơn,
  - mã giao dịch cổng thanh toán.
- Theo dõi truyện.
- Nhận thông báo mock.
- Lưu tiến độ đọc.
- Bình luận và tương tác trong chương.
- Scroll to top.
- Tự động scroll lên đầu khi đổi chương.
- Thư viện cá nhân chỉ hiện trong menu tài khoản sau khi đăng nhập.

### Luồng demo đề xuất

```text
Login Reader
→ Khám phá / Thịnh hành
→ Lọc danh mục
→ Vào chi tiết truyện
→ Đọc chương miễn phí
→ Gặp chương khóa
→ Mở bằng Coin hoặc Premium quota
→ Bình luận
→ Kiểm tra Library / Wallet / Premium
```

---

## 6.2 Author / Creator / Tác giả

### Đã có

- Đăng ký tài khoản Creator.
- Creator Dashboard.
- Quản lý bộ truyện.
- Đăng truyện mới bằng form demo.
- Upload chương mới bằng page riêng `/creator/upload`.
- Chỉ cho upload file PDF.
- Chặn ZIP và ảnh rời như JPG/PNG/WEBP ở form upload chương.
- Checklist bản quyền trước khi gửi duyệt.
- Lưu submission upload chương vào localStorage.
- Xem analytics tác phẩm.
- Xem doanh thu.
- Theo dõi payout.
- Viết blog / nhật ký tác giả bằng plugin editor Tiptap.
- Chọn file ảnh cover blog từ máy và hiển thị trong preview bài viết.
- Lưu nháp blog.
- Đăng blog public ra trang `/blog`.
- Trả lời bình luận độc giả ở mức UI demo.
- Báo cáo vi phạm bản quyền.

### Luồng demo đề xuất

```text
Login Author
→ Vào Quản trị
→ Đăng truyện mới
→ Upload chương PDF
→ Xác nhận checklist bản quyền
→ Gửi duyệt
→ Viết blog bằng Tiptap Editor
→ Đăng bài
→ Xem bài ở trang Blog public
→ Kiểm tra analytics / doanh thu / payout
```

---

## 6.3 Admin / Quản trị

### Đã có

- Dashboard quản trị.
- Duyệt nội dung mới.
- Quản lý người dùng.
- Xử lý báo cáo vi phạm.
- Quản lý doanh thu.
- Quản lý thanh toán / payout.
- Cấu hình hệ thống.
- Xem báo cáo thống kê.
- Quản lý truyện Featured.
- Hiển thị nhãn risk cho nội dung cần duyệt.
- Menu tài khoản Author/Admin hiển thị chung nhãn **Quản trị**.

### Luồng demo đề xuất

```text
Login Admin
→ Vào Quản trị
→ Xem dashboard
→ Kiểm tra content queue
→ Duyệt / từ chối nội dung demo
→ Xem user management
→ Xem revenue / payout
→ Cấu hình hệ thống
→ Quản lý featured comics
```

---

## 7. Khác nhau giữa Khám phá và Thịnh hành

### Khám phá `/explore`

Trang này phục vụ nhu cầu **tìm và duyệt toàn bộ kho truyện**.

Tập trung vào:

- search,
- category filter,
- status filter,
- sort,
- tìm truyện phù hợp sở thích.

Ví dụ người dùng vào Khám phá khi họ muốn tìm truyện Fantasy, Romance, Hài hước, truyện miễn phí hoặc truyện mới cập nhật.

### Thịnh hành `/trending`

Trang này phục vụ nhu cầu **xem bảng xếp hạng truyện đang hot**.

Tập trung vào:

- ranking,
- top truyện,
- độ hot theo khoảng thời gian,
- lọc trend theo danh mục,
- chỉ số views/rating/followers.

Ví dụ người dùng vào Thịnh hành khi muốn xem truyện nào đang được đọc nhiều nhất trong 24 giờ, 7 ngày hoặc 30 ngày.

---

## 8. Blog của tác giả

Dự án đã có cả 2 phía:

### Phía tác giả

```text
/creator/blog/new
```

Tác giả viết blog bằng Tiptap Editor, chọn cover từ file, lưu nháp hoặc đăng bài.

### Phía độc giả

```text
/blog
/blog/:id
```

Độc giả có thể xem danh sách blog public và đọc chi tiết từng bài.

Ngoài ra, trang chi tiết truyện cũng có block **Blog / Nhật ký tác giả** để kéo độc giả từ truyện sang nội dung hậu trường của tác giả.

---

## 9. Premium và Coin

### Premium

Gói Premium không chỉ hiển thị trạng thái đăng ký, mà có quota lượt đọc.

Thông tin hiển thị gồm:

- tên gói,
- tổng lượt đọc/tháng,
- số lượt đã dùng,
- số lượt còn lại,
- ngày reset quota.

Khi đọc chương khóa, người dùng có thể chọn:

```text
Dùng Premium quota
hoặc
Mua chương bằng Coin
```

### Coin

Ví Coin có mock audit trail cho giao dịch mua coin, gồm:

- order ID,
- package,
- coin gốc,
- coin bonus,
- tổng coin nhận,
- số tiền,
- payment method,
- gateway transaction ID,
- trạng thái,
- thời gian tạo đơn,
- thời gian thanh toán,
- số dư trước/sau.

---

## 10. Checklist test nhanh

### Reader

- [ ] Login bằng tài khoản Reader.
- [ ] Vào `/explore`, tìm kiếm truyện.
- [ ] Click danh mục và xác nhận không reload trang.
- [ ] Vào `/trending`, kiểm tra ranking.
- [ ] Vào chi tiết truyện `/comic/1`.
- [ ] Đọc chương miễn phí.
- [ ] Mở chương khóa bằng Coin hoặc Premium.
- [ ] Kiểm tra quota Premium.
- [ ] Kiểm tra Wallet và lịch sử mua Coin.
- [ ] Kiểm tra Library.
- [ ] Kiểm tra Blog public.

### Author

- [ ] Login bằng tài khoản Author.
- [ ] Vào Quản trị / Creator Dashboard.
- [ ] Click Đăng truyện mới.
- [ ] Click Upload chương.
- [ ] Kiểm tra chỉ cho PDF.
- [ ] Tick checklist bản quyền.
- [ ] Gửi duyệt chương.
- [ ] Click Viết blog.
- [ ] Chọn ảnh cover blog từ file.
- [ ] Viết nội dung bằng Tiptap.
- [ ] Lưu nháp.
- [ ] Đăng bài.
- [ ] Kiểm tra bài xuất hiện ở `/blog`.

### Admin

- [ ] Login bằng tài khoản Admin.
- [ ] Vào Quản trị.
- [ ] Kiểm tra Dashboard.
- [ ] Kiểm tra content queue.
- [ ] Kiểm tra user management.
- [ ] Kiểm tra report vi phạm.
- [ ] Kiểm tra revenue/payout.
- [ ] Kiểm tra system settings.
- [ ] Kiểm tra featured comics.

---

## 11. Deploy Vercel

Dự án đã có `vercel.json` để build và hỗ trợ SPA routing.

Cấu hình Vercel đề xuất:

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
Node.js: 20.x
```

File `vercel.json` có rewrite để refresh các route như `/login`, `/comic/1`, `/read/1/1` không bị 404.

---

## 12. Trạng thái hiện tại

Đánh giá nhanh:

```text
UI/UX demo: 90%+
Frontend mock interaction: 70%+
Production readiness: 20–30%
```

Dự án hiện đã đủ tốt để:

- publish demo lên Vercel,
- gửi link cho stakeholder xem,
- dùng làm prototype sản phẩm,
- làm nền cho giai đoạn backend/API/database.

---

## 13. Các phần còn là mock, chưa phải thật

Hiện các phần sau vẫn là mock/localStorage/UI demo:

- Đăng nhập và phân quyền.
- Mua coin.
- Thanh toán Premium.
- Mở khóa chương.
- Upload file PDF thật lên server.
- Kiểm tra bản quyền thật.
- Duyệt nội dung thật.
- Payout thật cho tác giả.
- Notification thật.
- Comment realtime.
- Search server-side.
- Analytics thật.
- Database người dùng/truyện/chương/giao dịch.

---

## 14. Roadmap đề xuất để phát triển production

### Giai đoạn 1 — Backend nền tảng

- Thiết kế database.
- Auth thật: email/password, JWT/session, role-based access control.
- API cho comics, chapters, users, wallet, premium, comments, blogs.
- Upload file lên object storage.

### Giai đoạn 2 — Commerce

- Tích hợp payment gateway.
- Wallet ledger thật.
- Coin purchase transaction audit.
- Premium subscription lifecycle.
- Chapter unlock ownership.

### Giai đoạn 3 — Creator platform

- Upload PDF và xử lý nội dung.
- Content moderation queue.
- Copyright report workflow.
- Revenue sharing.
- Payout management.
- Creator analytics.

### Giai đoạn 4 — Reader engagement

- Notification thật.
- Follow system.
- Reading progress sync.
- Recommendation engine.
- Ranking/trending thật.
- Blog/comment engagement.

### Giai đoạn 5 — Admin & vận hành

- Admin audit log.
- Fraud/risk management.
- Revenue reporting.
- System configuration.
- Featured content scheduling.
- Moderation SLA.

---

## 15. Ghi chú dành cho reviewer

Khi review demo, nên đánh giá dự án theo góc nhìn **prototype sản phẩm**, không đánh giá như hệ thống production.

Các điểm mạnh hiện tại:

- Đủ 3 vai trò Reader / Author / Admin.
- Có flow thương mại nội dung số: Coin, Premium, khóa chương, quota đọc.
- Có creator economy: upload chương, doanh thu, payout, blog tác giả.
- Có admin vận hành: duyệt nội dung, report, featured, revenue.
- UI dark modern, phù hợp sản phẩm truyện tranh số.
- Có dữ liệu mock đủ để demo nhiều kịch bản.

Điểm cần phát triển tiếp:

- Backend thật.
- Database thật.
- Payment thật.
- Auth/role thật.
- Upload/copyright processing thật.
- State management và API integration.

---

## 16. Kết luận

Dự án hiện là một **frontend prototype khá đầy đủ cho nền tảng đọc truyện tranh online có thương mại hóa nội dung**. Sản phẩm đã thể hiện được mô hình vận hành chính:

```text
Reader đọc và trả tiền
→ Author sáng tạo và nhận doanh thu
→ Admin kiểm duyệt và vận hành nền tảng
```

Đây là nền tốt để chuyển sang giai đoạn tiếp theo: thiết kế database, API backend, authentication, payment, upload file và triển khai production MVP.
