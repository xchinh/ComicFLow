-- File khởi tạo dữ liệu mẫu cho ComicFlow (PostgreSQL)

-- 1. Subscription Plans (Basic, Pro, Ultimate)
INSERT INTO subscription_plans (id, name, price, chapter_limit, duration_days, unlimited_access, "created_at", "updated_at")
VALUES 
('770e8400-e29b-41d4-a716-446655440001', 'Basic', 49000, 30, 30, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440002', 'Pro', 99000, 120, 30, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440003', 'Ultimate', 199000, 300, 30, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 2. Users (Mật khẩu mặc định: password123)
-- Hash: $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2
INSERT INTO users (id, email, username, password, role, user_status, "created_at", "updated_at")
VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'admin@comicflow.com', 'admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'ADMIN', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440001', 'author@comicflow.com', 'author_test', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'AUTHOR', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440002', 'reader@comicflow.com', 'reader_test', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'READER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 3. Comics
INSERT INTO comics (id, title, description, cover_image_url, status, "author_id", "created_at", "updated_at")
VALUES 
('990e8400-e29b-41d4-a716-446655440001', 'Võ Luyện Đỉnh Phong', 'Hành trình tu luyện đỉnh cao của Dương Khai.', 'https://example.com/cover-vo-luyen.jpg', 'ONGOING', '550e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('990e8400-e29b-41d4-a716-446655440002', 'Đấu Phá Thương Khung', 'Tiêu Viêm và hành trình chinh phục Dị Hỏa.', 'https://example.com/cover-dau-pha.jpg', 'COMPLETED', '550e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 4. Chapters
INSERT INTO chapters (id, chapter_number, title, price, is_free, "pdf_url", "comic_id", "created_at", "updated_at")
VALUES 
('aa0e8400-e29b-41d4-a716-446655440001', 1, 'Chương 1: Khởi đầu mới', 0, true, 'https://example.com/pdf/voluyen-c1.pdf', '990e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('aa0e8400-e29b-41d4-a716-446655440002', 2, 'Chương 2: Khám phá bí mật', 5000, false, 'https://example.com/pdf/voluyen-c2.pdf', '990e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('aa0e8400-e29b-41d4-a716-446655440003', 3, 'Chương 3: Đối mặt thử thách', 5000, false, 'https://example.com/pdf/voluyen-c3.pdf', '990e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('aa0e8400-e29b-41d4-a716-446655440004', 1, 'Chương 1: Thiên tài ngã xuống', 0, true, 'https://example.com/pdf/daupha-c1.pdf', '990e8400-e29b-41d4-a716-446655440002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
