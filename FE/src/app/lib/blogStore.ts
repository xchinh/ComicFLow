const BLOG_STORAGE_KEY = 'inkverse.creator.blogPosts';

export interface PublicBlogPost {
  id: string;
  title: string;
  status: 'Bản nháp' | 'Đã đăng' | 'Lên lịch';
  category: string;
  excerpt: string;
  coverUrl: string;
  coverFileName?: string;
  tags: string[];
  contentHtml: string;
  authorName: string;
  authorAvatar: string;
  authorBio: string;
  authorComicId: string;
  authorComicTitle: string;
  views: string;
  comments: number;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  likes: number;
}

export const staticPublicBlogPosts: PublicBlogPost[] = [
  {
    id: 'blog-1',
    title: 'Vì sao mình chọn ánh trăng làm motif chính?',
    status: 'Đã đăng',
    category: 'Hậu trường sáng tác',
    excerpt: 'Một ghi chú ngắn về cách ánh trăng trở thành biểu tượng dẫn dắt thế giới quan, cảm xúc và tuyến phát triển nhân vật trong Học Viện Ánh Trăng.',
    coverUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1200&q=80',
    coverFileName: 'moonlight-writing-desk.jpg',
    tags: ['hậu trường', 'ánh trăng', 'worldbuilding'],
    contentHtml: `
      <h2>Ánh trăng không chỉ là bối cảnh</h2>
      <p>Khi xây dựng <strong>Học Viện Ánh Trăng</strong>, mình không muốn ánh trăng chỉ là một hình ảnh đẹp đặt ở phần nền. Nó phải là một quy luật cảm xúc: khi trăng sáng, nhân vật nhìn rõ hơn những điều mình đang né tránh.</p>
      <p>Vì vậy, những cảnh quan trọng thường diễn ra vào ban đêm, nơi ánh sáng không quá rực rỡ nhưng đủ để soi ra lựa chọn của nhân vật.</p>
      <blockquote>Ánh trăng trong truyện là ranh giới giữa điều nhân vật muốn giấu và điều họ buộc phải đối diện.</blockquote>
      <h3>Cách motif này ảnh hưởng đến thiết kế chương</h3>
      <ul>
        <li>Màu sắc nghiêng về xanh tím, bạc và vàng nhạt.</li>
        <li>Các khung truyện cao hơn, tạo cảm giác nhân vật nhỏ trước thế giới phép thuật.</li>
        <li>Các đoạn thoại quan trọng thường ngắn, có khoảng thở.</li>
      </ul>
      <p>Ở các chương tiếp theo, motif ánh trăng sẽ không chỉ là biểu tượng của sự lãng mạn, mà còn mở ra những bí mật cũ của học viện.</p>
    `,
    authorName: 'An Nhiên Studio',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author-demo',
    authorBio: 'Creator của Học Viện Ánh Trăng và Người Gác Cổng Linh Giới.',
    authorComicId: '1',
    authorComicTitle: 'Học Viện Ánh Trăng',
    views: '12.4K',
    comments: 86,
    publishedAt: '2026-05-04',
    updatedAt: '2026-05-04',
    readingTime: '4 phút đọc',
    likes: 1240
  },
  {
    id: 'blog-2',
    title: 'Behind the scene: một chương truyện được sản xuất thế nào',
    status: 'Đã đăng',
    category: 'Nhật ký tác giả',
    excerpt: 'Từ outline, thumbnail, line art đến kiểm tra bản quyền file PDF trước khi gửi duyệt: đây là quy trình sản xuất một chương truyện mẫu.',
    coverUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    coverFileName: 'creator-workflow.jpg',
    tags: ['quy trình', 'sản xuất', 'upload'],
    contentHtml: `
      <h2>Một chương truyện bắt đầu từ bản nháp rất thô</h2>
      <p>Thông thường, mình bắt đầu bằng một outline 8-12 dòng. Sau đó mới chia thành nhịp cảnh, chọn điểm dừng chương và xác định cảm xúc chính.</p>
      <h3>Quy trình demo</h3>
      <ol>
        <li>Viết outline và beat chính.</li>
        <li>Dựng thumbnail panel để kiểm tra nhịp đọc.</li>
        <li>Hoàn thiện line art, màu và thoại.</li>
        <li>Xuất file PDF theo chuẩn platform.</li>
        <li>Gửi duyệt kèm xác nhận bản quyền.</li>
      </ol>
      <p>Phần kiểm tra bản quyền rất quan trọng vì nó bảo vệ cả tác giả, độc giả và nền tảng. Khi chương được duyệt, tác giả có thể theo dõi lượt đọc, lượt mua và doanh thu ngay trong Creator Dashboard.</p>
    `,
    authorName: 'An Nhiên Studio',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author-demo',
    authorBio: 'Creator của Học Viện Ánh Trăng và Người Gác Cổng Linh Giới.',
    authorComicId: '1',
    authorComicTitle: 'Học Viện Ánh Trăng',
    views: '8.7K',
    comments: 42,
    publishedAt: '2026-05-06',
    updatedAt: '2026-05-06',
    readingTime: '3 phút đọc',
    likes: 860
  },
  {
    id: 'blog-3',
    title: 'Ghi chú nhân vật: người gác cổng không chỉ canh giữ cánh cửa',
    status: 'Đã đăng',
    category: 'Teaser chương mới',
    excerpt: 'Một vài ghi chú không spoiler về vai trò của người gác cổng trong arc mới của Người Gác Cổng Linh Giới.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1200&q=80',
    coverFileName: 'spirit-gate-note.jpg',
    tags: ['teaser', 'nhân vật', 'linh giới'],
    contentHtml: `
      <h2>Người gác cổng là người hiểu cái giá của ranh giới</h2>
      <p>Trong arc mới, mình muốn nhân vật chính không chỉ mạnh hơn, mà còn hiểu rõ hơn trách nhiệm của việc đứng giữa hai thế giới.</p>
      <p>Không phải cánh cửa nào cũng nên mở. Và không phải bí mật nào cũng nên được nói ra ngay lập tức.</p>
      <blockquote>Đôi khi người bảo vệ ranh giới cũng là người cô đơn nhất.</blockquote>
      <p>Bài viết này chỉ là một teaser nhẹ, nhưng độc giả sẽ thấy các chi tiết này quay lại trong những chương sắp tới.</p>
    `,
    authorName: 'An Nhiên Studio',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author-demo',
    authorBio: 'Creator của Học Viện Ánh Trăng và Người Gác Cổng Linh Giới.',
    authorComicId: '6',
    authorComicTitle: 'Người Gác Cổng Linh Giới',
    views: '6.1K',
    comments: 33,
    publishedAt: '2026-05-08',
    updatedAt: '2026-05-08',
    readingTime: '2 phút đọc',
    likes: 540
  }
];

function normalizeSavedPost(post: any): PublicBlogPost | null {
  if (!post || post.status !== 'Đã đăng') return null;

  return {
    id: String(post.id || `blog-${Date.now()}`),
    title: post.title || 'Blog chưa có tiêu đề',
    status: 'Đã đăng',
    category: post.category || 'Nhật ký tác giả',
    excerpt: post.excerpt || 'Bài viết mới từ tác giả.',
    coverUrl: post.coverUrl || staticPublicBlogPosts[0].coverUrl,
    coverFileName: post.coverFileName || 'cover-demo.jpg',
    tags: Array.isArray(post.tags) ? post.tags : [],
    contentHtml: post.contentHtml || '<p>Nội dung blog đang được cập nhật.</p>',
    authorName: post.authorName || 'An Nhiên Studio',
    authorAvatar: post.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=author-demo',
    authorBio: post.authorBio || 'Creator của Học Viện Ánh Trăng và Người Gác Cổng Linh Giới.',
    authorComicId: post.authorComicId || '1',
    authorComicTitle: post.authorComicTitle || 'Học Viện Ánh Trăng',
    views: post.views || '0',
    comments: Number(post.comments || 0),
    publishedAt: post.publishedAt || post.updatedAt || new Date().toLocaleDateString('vi-VN'),
    updatedAt: post.updatedAt || post.publishedAt || new Date().toLocaleDateString('vi-VN'),
    readingTime: post.readingTime || '1 phút đọc',
    likes: Number(post.likes || 0)
  };
}

export function getSavedPublicBlogPosts(): PublicBlogPost[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(BLOG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeSavedPost).filter(Boolean) as PublicBlogPost[];
  } catch {
    return [];
  }
}

export function getPublicBlogPosts(): PublicBlogPost[] {
  const saved = getSavedPublicBlogPosts();
  const savedIds = new Set(saved.map((post) => post.id));
  return [...saved, ...staticPublicBlogPosts.filter((post) => !savedIds.has(post.id))];
}

export function getPublicBlogPostById(id?: string): PublicBlogPost | undefined {
  return getPublicBlogPosts().find((post) => post.id === id);
}

export { BLOG_STORAGE_KEY };
