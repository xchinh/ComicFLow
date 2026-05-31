# ComicFlow - Nền tảng đọc truyện tranh trực tuyến

ComicFlow là một hệ thống quản lý và cung cấp truyện tranh trực tuyến hiện đại, hỗ trợ người dùng đọc truyện, đăng ký gói thành viên, thanh toán qua MoMo và các tính năng tương tác cộng đồng.

## 🏗 Kiến trúc hệ thống (Architecture)

Dự án được xây dựng theo mô hình **Modular Monolith**, giúp tối ưu hóa sự cân bằng giữa tính linh hoạt của Microservices và sự đơn giản trong triển khai của Monolith.

### Backend (Java/Spring Boot)
- **Kiến trúc Modular Monolith:** Toàn bộ hệ thống được chia thành các module chức năng độc lập (`auth`, `comic`, `chapter`, `payment`, `user`, ...). Mỗi module đóng gói toàn bộ logic liên quan, giúp giảm thiểu sự phụ thuộc chéo (tight coupling).
- **Kiến trúc Layered (Lớp) bên trong mỗi module:**
  - **Controller Layer:** Tiếp nhận yêu cầu HTTP và điều hướng.
  - **Service Layer:** Xử lý logic nghiệp vụ chính của module.
  - **Repository Layer (Spring Data JPA):** Tương tác với cơ sở dữ liệu.
  - **Entity/DTO:** Định nghĩa cấu trúc dữ liệu và chuyển đổi dữ liệu (Mapping).
- **Công nghệ sử dụng:**
  - Java 21, Spring Boot 3.4.
  - Cơ sở dữ liệu: PostgreSQL.
  - Caching & Session: Redis.
  - Lưu trữ hình ảnh: MinIO (S3 compatible).
  - Thanh toán: Tích hợp MoMo API.
  - Bảo mật: Spring Security & JWT.

### Frontend (React/TypeScript)
- **Framework:** Vite + React 18.
- **Styling:** Tailwind CSS, Radix UI.
- **Quản lý trạng thái:** React Hooks, Context API.
- **Icon:** Lucide React.

---

## 🚀 Hướng dẫn chạy dự án

### 1. Yêu cầu hệ thống
- Java 21 trở lên.
- Node.js 20.x trở lên.
- Docker & Docker Compose.

### 2. Chạy hạ tầng (Database, Redis, Minio)
Sử dụng Docker Compose để khởi chạy các dịch vụ cần thiết:
```bash
cd BE/ComicFlow
docker-compose up -d
```
Sau khi chạy, các dịch vụ sẽ sẵn sàng tại:
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- MinIO: `localhost:9000` (Console: `localhost:9001`, user: `admin`, pass: `password123`)

### 3. Chạy Backend (Spring Boot)
Di chuyển vào thư mục backend và khởi chạy ứng dụng:
```bash
cd BE/ComicFlow
./gradlew bootRun
```
Ứng dụng sẽ chạy tại `http://localhost:8080`. Bạn có thể xem tài liệu API tại `http://localhost:8080/swagger-ui.html`.

**Lưu ý:** Hệ thống đã được cấu hình sẵn dữ liệu mẫu (`data.sql`). Một số tài khoản dùng thử:
- **Admin:** `admin@comicflow.com` / `password123`
- **Tác giả:** `author@comicflow.com` / `password123`
- **Người đọc:** `reader@comicflow.com` / `password123`

### 4. Chạy Frontend (React)
Di chuyển vào thư mục frontend, cài đặt dependencies và khởi chạy:
```bash
cd FE
npm install  # hoặc pnpm install
npm run dev
```
Ứng dụng web sẽ chạy tại `http://localhost:5173` (hoặc cổng khác tùy cấu hình Vite).

---

## 📁 Cấu trúc thư mục chính
- `BE/ComicFlow`: Mã nguồn backend Spring Boot.
- `FE`: Mã nguồn frontend React.
- `report`: Các tài liệu báo cáo và sơ đồ kiến trúc (Latex).
- `report/images/Diagram`: Chứa các hình ảnh ERD, Use Case, Architecture.
