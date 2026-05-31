export const mockComics = [
  {
    id: '1',
    title: 'Học Viện Ánh Trăng',
    author: 'An Nhiên Studio',
    cover: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop',
    rating: 4.8,
    views: 1250000,
    pricePerChapter: 15,
    genres: ['Fantasy', 'Học đường'],
    status: 'hot' as const,
    description: 'Câu chuyện về một học viện đào tạo pháp sư dưới ánh trăng, nơi những bí mật về ma thuật cổ đại được hé lộ.',
    followers: 85000,
    chapters: 45
  },
  {
    id: '2',
    title: 'Thành Phố Sau Cơn Mưa',
    author: 'Kira Nguyễn',
    cover: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    rating: 4.6,
    views: 980000,
    pricePerChapter: 15,
    genres: ['Tình cảm', 'Đời thường'],
    status: 'new' as const,
    description: 'Một mối tình lãng mạn khởi đầu từ những ngày mưa trong thành phố. Câu chuyện về việc tìm lại chính mình.',
    followers: 62000,
    chapters: 32
  },
  {
    id: '3',
    title: 'Long Hồn Ký',
    author: 'Lam Comics',
    cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop',
    rating: 4.9,
    views: 2100000,
    pricePerChapter: 30,
    genres: ['Hành động', 'Fantasy'],
    status: 'premium' as const,
    description: 'Hành trình của chàng thiếu niên mang dòng máu rồng, chiến đấu để bảo vệ vương quốc khỏi thế lực hắc ám.',
    followers: 125000,
    chapters: 67
  },
  {
    id: '4',
    title: 'Căn Phòng Số 17',
    author: 'Hạ Vũ',
    cover: 'https://images.unsplash.com/photo-1577866906674-06078312b748?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    rating: 4.7,
    views: 750000,
    pricePerChapter: 15,
    genres: ['Kinh dị', 'Bí ẩn'],
    status: 'hot' as const,
    description: 'Bí ẩn đằng sau căn phòng số 17 trong ký túc xá cũ. Những bí mật kinh hoàng dần được hé lộ.',
    followers: 58000,
    chapters: 28
  },
  {
    id: '5',
    title: 'Mùa Hè Không Trở Lại',
    author: 'Mộc Miên Team',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
    rating: 4.5,
    views: 620000,
    pricePerChapter: 0,
    genres: ['Học đường', 'Thanh xuân'],
    status: 'free' as const,
    description: 'Kỷ niệm tuổi học trò, tình bạn và những giấc mơ thanh xuân chưa bao giờ phai nhạt.',
    followers: 45000,
    chapters: 24
  },
  {
    id: '6',
    title: 'Người Gác Cổng Linh Giới',
    author: 'An Nhiên Studio',
    cover: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=600&fit=crop',
    rating: 4.8,
    views: 1450000,
    pricePerChapter: 15,
    genres: ['Fantasy', 'Hành động'],
    status: 'new' as const,
    description: 'Những người gác cổng bảo vệ ranh giới giữa thế giới người và linh giới. Cuộc chiến sinh tồn bắt đầu.',
    followers: 95000,
    chapters: 38
  },
  {
    id: '7',
    title: 'Siêu Đội Cà Phê',
    author: 'Mèo Ú Comics',
    cover: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=600&fit=crop',
    rating: 4.4,
    views: 410000,
    pricePerChapter: 0,
    genres: ['Hài hước', 'Đời thường'],
    status: 'free' as const,
    description: 'Một nhóm nhân viên quán cà phê vô tình trở thành đội anh hùng chuyên giải quyết các rắc rối rất đời thường bằng sự lầy lội.',
    followers: 28000,
    chapters: 18
  }
];

export const mockChapters = [
  { id: '1', number: 1, title: 'Khởi đầu hành trình', date: '2026-04-15', views: 125000, status: 'free' as const },
  { id: '2', number: 2, title: 'Bước vào học viện', date: '2026-04-18', views: 98000, status: 'free' as const },
  { id: '3', number: 3, title: 'Thử thách đầu tiên', date: '2026-04-21', views: 87000, status: 'free' as const },
  { id: '4', number: 4, title: 'Sức mạnh tiềm ẩn', date: '2026-04-24', views: 76000, status: 'owned' as const },
  { id: '5', number: 5, title: 'Cuộc đối đầu', date: '2026-04-27', views: 68000, status: 'locked' as const, price: 15 },
  { id: '6', number: 6, title: 'Bí mật của ánh trăng', date: '2026-04-30', views: 62000, status: 'locked' as const, price: 15 },
  { id: '7', number: 7, title: 'Người thầy bí ẩn', date: '2026-05-03', views: 58000, status: 'premium' as const, price: 30 }
];

export const demoPanelFallbackUrl = 'https://placehold.co/1200x1600/151221/f8f5ff?text=InkVerse+Panel+Demo';

export const demoChapterPanels: Record<string, string[]> = {
  '1': [
    'https://placehold.co/1200x1600/1b1730/f8f5ff?text=Chapter+01+Panel+01',
    'https://placehold.co/1200x1600/211a3b/f8f5ff?text=Chapter+01+Panel+02',
    'https://placehold.co/1200x1600/281f48/f8f5ff?text=Chapter+01+Panel+03',
    'https://placehold.co/1200x1600/302455/f8f5ff?text=Chapter+01+Panel+04',
    'https://placehold.co/1200x1600/382a63/f8f5ff?text=Chapter+01+Panel+05',
    'https://placehold.co/1200x1600/403071/f8f5ff?text=Chapter+01+Panel+06',
    'https://placehold.co/1200x1600/48367f/f8f5ff?text=Chapter+01+Panel+07',
    'https://placehold.co/1200x1600/503c8d/f8f5ff?text=Chapter+01+Panel+08'
  ],
  '2': [
    'https://picsum.photos/seed/inkverse-ch02-panel01/1200/1600',
    'https://picsum.photos/seed/inkverse-ch02-panel02/1200/1600',
    'https://picsum.photos/seed/inkverse-ch02-panel03/1200/1600',
    'https://picsum.photos/seed/inkverse-ch02-panel04/1200/1600',
    'https://picsum.photos/seed/inkverse-ch02-panel05/1200/1600',
    'https://picsum.photos/seed/inkverse-ch02-panel06/1200/1600'
  ]
};

export const defaultDemoPanels = demoChapterPanels['1'];

export const mockCreators = [
  {
    id: '1',
    name: 'An Nhiên Studio',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An',
    followers: 180000,
    totalWorks: 3,
    verified: true
  },
  {
    id: '2',
    name: 'Kira Nguyễn',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kira',
    followers: 95000,
    totalWorks: 2,
    verified: true
  },
  {
    id: '3',
    name: 'Lam Comics',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lam',
    followers: 150000,
    totalWorks: 1,
    verified: true
  }
];

export const coinPackages = [
  { id: '1', coins: 200, price: 20000, bonus: 0 },
  { id: '2', coins: 550, price: 50000, bonus: 50, popular: true },
  { id: '3', coins: 1150, price: 100000, bonus: 150 },
  { id: '4', coins: 2400, price: 200000, bonus: 400 }
];

export const mockTransactions = [
  { id: '1', type: 'purchase', description: 'Nạp 550 Coin', amount: 550, date: '2026-05-06 10:30', status: 'success' },
  { id: '2', type: 'spend', description: 'Mua Chương 5 - Học Viện Ánh Trăng', amount: -15, date: '2026-05-06 09:15', status: 'success' },
  { id: '3', type: 'spend', description: 'Thuê 24h - Long Hồn Ký', amount: -10, date: '2026-05-05 20:45', status: 'success' },
  { id: '4', type: 'purchase', description: 'Nạp 200 Coin', amount: 200, date: '2026-05-04 14:20', status: 'success' },
  { id: '5', type: 'refund', description: 'Hoàn Coin - Chương lỗi', amount: 15, date: '2026-05-03 11:00', status: 'success' }
];

export const categories = [
  'Tất cả',
  'Hành động',
  'Tình cảm',
  'Fantasy',
  'Học đường',
  'Thanh xuân',
  'Đời thường',
  'Kinh dị',
  'Bí ẩn',
  'Hài hước'
];

export type DemoRole = 'reader' | 'author' | 'admin';

export interface DemoAccount {
  id: string;
  role: DemoRole;
  name: string;
  email: string;
  password: string;
  avatar: string;
  coins: number;
  premium: boolean;
  creatorStatus?: 'not_registered' | 'pending' | 'approved';
  bio: string;
  permissions: string[];
}

export const demoAccounts: DemoAccount[] = [
  {
    id: 'reader-001',
    role: 'reader',
    name: 'Minh Anh Reader',
    email: 'reader@inkverse.demo',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reader-demo',
    coins: 550,
    premium: true,
    creatorStatus: 'not_registered',
    bio: 'Độc giả dùng để test tìm kiếm, đọc chương, mua chương, premium, bình luận, theo dõi và lưu tiến độ đọc.',
    permissions: [
      'search_browse_comics',
      'read_free_chapters',
      'unlock_paid_chapters',
      'buy_coin_packages',
      'subscribe_premium',
      'track_premium_read_quota',
      'audit_coin_purchase_history',
      'comment_interact',
      'follow_notify',
      'save_reading_progress'
    ]
  },
  {
    id: 'author-001',
    role: 'author',
    name: 'An Nhiên Studio',
    email: 'author@inkverse.demo',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author-demo',
    coins: 1200,
    premium: true,
    creatorStatus: 'approved',
    bio: 'Tác giả dùng để test creator dashboard, quản lý truyện, upload chương, analytics, doanh thu, blog, trả lời bình luận và báo cáo bản quyền.',
    permissions: [
      'creator_account_approved',
      'manage_comic_series',
      'upload_chapter',
      'view_creator_analytics',
      'track_revenue_payouts',
      'write_author_blog',
      'reply_reader_comments',
      'report_copyright_violation'
    ]
  },
  {
    id: 'admin-001',
    role: 'admin',
    name: 'Admin Platform',
    email: 'admin@inkverse.demo',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin-demo',
    coins: 0,
    premium: true,
    creatorStatus: 'approved',
    bio: 'Quản trị viên dùng để test duyệt nội dung, quản lý user, xử lý báo cáo, doanh thu, cấu hình hệ thống, thống kê và featured comics.',
    permissions: [
      'review_new_content',
      'manage_users',
      'handle_violation_reports',
      'view_admin_dashboard',
      'manage_revenue_payments',
      'configure_system',
      'view_reports_statistics',
      'manage_featured_comics'
    ]
  }
];

export const mockReadingProgress = [
  { comicId: '1', comicTitle: 'Học Viện Ánh Trăng', chapterId: '4', chapterNumber: 4, percent: 62, updatedAt: '2026-05-09 08:30', status: 'continue' },
  { comicId: '3', comicTitle: 'Long Hồn Ký', chapterId: '12', chapterNumber: 12, percent: 24, updatedAt: '2026-05-08 22:15', status: 'reading' },
  { comicId: '5', comicTitle: 'Mùa Hè Không Trở Lại', chapterId: '8', chapterNumber: 8, percent: 100, updatedAt: '2026-05-07 19:10', status: 'completed' }
];

export const mockFollowedComics = [
  { comicId: '1', title: 'Học Viện Ánh Trăng', notify: true, lastChapter: 46, unreadChapters: 2 },
  { comicId: '3', title: 'Long Hồn Ký', notify: true, lastChapter: 68, unreadChapters: 1 },
  { comicId: '5', title: 'Mùa Hè Không Trở Lại', notify: false, lastChapter: 24, unreadChapters: 0 }
];

export const mockUnlockedChapters = [
  { comicId: '1', chapterId: '4', title: 'Học Viện Ánh Trăng - Chương 4', paidCoin: 15, unlockedAt: '2026-05-06 09:15' },
  { comicId: '3', chapterId: '12', title: 'Long Hồn Ký - Chương 12', paidCoin: 30, unlockedAt: '2026-05-05 20:45' },
  { comicId: '4', chapterId: '15', title: 'Căn Phòng Số 17 - Chương 15', paidCoin: 15, unlockedAt: '2026-05-03 11:20' }
];



export const mockPremiumSubscription = {
  userId: 'reader-001',
  planId: 'basic',
  planName: 'Premium Basic',
  status: 'active' as const,
  billingCycle: 'monthly' as const,
  monthlyReadLimit: 30,
  usedThisMonth: 18,
  remainingReads: 12,
  resetAt: '2026-06-01 00:00',
  startedAt: '2026-05-01 09:00',
  expiredAt: '2026-06-01 00:00',
  autoRenew: true,
  lastPremiumRead: {
    comicTitle: 'Long Hồn Ký',
    chapterNumber: 12,
    readAt: '2026-05-09 22:15'
  },
  usageHistory: [
    { id: 'pu-1', date: '2026-05-09 22:15', comicTitle: 'Long Hồn Ký', chapterNumber: 12, action: 'Đọc bằng Premium', used: 1, remainingAfter: 12 },
    { id: 'pu-2', date: '2026-05-09 20:40', comicTitle: 'Học Viện Ánh Trăng', chapterNumber: 7, action: 'Đọc bằng Premium', used: 1, remainingAfter: 13 },
    { id: 'pu-3', date: '2026-05-08 21:05', comicTitle: 'Căn Phòng Số 17', chapterNumber: 15, action: 'Đọc bằng Premium', used: 1, remainingAfter: 14 }
  ]
};

export const mockCoinPurchaseAuditTrail = [
  {
    id: 'coin-audit-1',
    orderCode: 'IVC-20260506-0008',
    packageName: 'Gói 550 Coin',
    baseCoins: 500,
    bonusCoins: 50,
    totalCoins: 550,
    amountVnd: 50000,
    paymentMethod: 'MoMo',
    providerTransactionId: 'MOMO-9F2K-202605061030',
    status: 'success' as const,
    createdAt: '2026-05-06 10:28',
    paidAt: '2026-05-06 10:30',
    balanceBefore: 15,
    balanceAfter: 565,
    invoiceEmail: 'reader@inkverse.demo',
    channel: 'Web Wallet',
    note: 'Mock trace dùng để demo truy vết nạp coin: đơn hàng, cổng thanh toán, số dư trước/sau.'
  },
  {
    id: 'coin-audit-2',
    orderCode: 'IVC-20260504-0016',
    packageName: 'Gói 200 Coin',
    baseCoins: 200,
    bonusCoins: 0,
    totalCoins: 200,
    amountVnd: 20000,
    paymentMethod: 'VNPay',
    providerTransactionId: 'VNPAY-2A8C-202605041420',
    status: 'success' as const,
    createdAt: '2026-05-04 14:17',
    paidAt: '2026-05-04 14:20',
    balanceBefore: 40,
    balanceAfter: 240,
    invoiceEmail: 'reader@inkverse.demo',
    channel: 'Mobile Web',
    note: 'Đối soát thành công với payment gateway mock.'
  },
  {
    id: 'coin-audit-3',
    orderCode: 'IVC-20260502-0005',
    packageName: 'Gói 1.150 Coin',
    baseCoins: 1000,
    bonusCoins: 150,
    totalCoins: 1150,
    amountVnd: 100000,
    paymentMethod: 'Thẻ ngân hàng',
    providerTransactionId: 'BANK-DEMO-778812',
    status: 'pending' as const,
    createdAt: '2026-05-02 18:02',
    paidAt: '-',
    balanceBefore: 120,
    balanceAfter: 120,
    invoiceEmail: 'reader@inkverse.demo',
    channel: 'Web Wallet',
    note: 'Đơn chưa thanh toán, dùng để demo trạng thái chờ xử lý.'
  }
];

export const mockCreatorSeries = [
  { id: '1', title: 'Học Viện Ánh Trăng', status: 'Đang phát hành', chapters: 46, followers: 85000, monthlyViews: 420000, revenue: 12850000, lastUpdated: '2026-05-08' },
  { id: '6', title: 'Người Gác Cổng Linh Giới', status: 'Đang phát hành', chapters: 38, followers: 95000, monthlyViews: 510000, revenue: 9450000, lastUpdated: '2026-05-07' },
  { id: '7', title: 'Vùng Đất Quên Lãng', status: 'Nháp chờ duyệt', chapters: 3, followers: 0, monthlyViews: 0, revenue: 0, lastUpdated: '2026-05-06' }
];

export const mockCreatorDrafts = [
  { id: 'draft-1', comicTitle: 'Học Viện Ánh Trăng', chapterTitle: 'Chương 47 - Lời nguyền pha lê', progress: 85, status: 'Đang viết', updatedAt: '2026-05-09 07:45' },
  { id: 'draft-2', comicTitle: 'Người Gác Cổng Linh Giới', chapterTitle: 'Chương 39 - Cánh cổng thứ bảy', progress: 40, status: 'Bản nháp', updatedAt: '2026-05-08 23:10' },
  { id: 'draft-3', comicTitle: 'Vùng Đất Quên Lãng', chapterTitle: 'Chương 1 - Thành phố ngủ quên', progress: 100, status: 'Đã gửi duyệt', updatedAt: '2026-05-06 16:30' }
];

export const mockCreatorBlogPosts = [
  { id: 'blog-1', title: 'Vì sao mình chọn ánh trăng làm motif chính?', status: 'Đã đăng', views: 12400, comments: 86, publishedAt: '2026-05-04' },
  { id: 'blog-2', title: 'Nhật ký phác thảo nhân vật mới', status: 'Nháp', views: 0, comments: 0, publishedAt: '-' },
  { id: 'blog-3', title: 'Behind the scene: một chương truyện được sản xuất thế nào', status: 'Lên lịch', views: 0, comments: 0, publishedAt: '2026-05-12' }
];

export const mockCreatorCommentInbox = [
  { id: 'cmt-1', reader: 'Thu Hà', comicTitle: 'Học Viện Ánh Trăng', chapter: 46, message: 'Khi nào có chương 47 vậy tác giả ơi?', status: 'Chưa trả lời', time: '15 phút trước' },
  { id: 'cmt-2', reader: 'Hoàng Long', comicTitle: 'Người Gác Cổng Linh Giới', chapter: 38, message: 'Plot twist rất hay, mong tuyến nhân vật phụ được khai thác thêm.', status: 'Đã trả lời', time: '2 giờ trước' },
  { id: 'cmt-3', reader: 'Minh Anh', comicTitle: 'Học Viện Ánh Trăng', chapter: 45, message: 'Art chương này đẹp quá!', status: 'Chưa trả lời', time: '1 ngày trước' }
];

export const mockCopyrightReports = [
  { id: 'rp-1', target: 'Website reup-truyen-demo.net', comicTitle: 'Học Viện Ánh Trăng', reason: 'Reup chương trả phí không xin phép', status: 'Đã gửi Admin', createdAt: '2026-05-08' },
  { id: 'rp-2', target: 'Fanpage SaoChép Truyện', comicTitle: 'Người Gác Cổng Linh Giới', reason: 'Dùng artwork để chạy quảng cáo', status: 'Đang xử lý', createdAt: '2026-05-06' }
];

export const mockAdminModerationQueue = [
  { id: 'mod-1', contentType: 'Truyện mới', title: 'Vùng Đất Quên Lãng', owner: 'An Nhiên Studio', risk: 'Bản quyền artwork', status: 'Chờ duyệt' },
  { id: 'mod-2', contentType: 'Chương mới', title: 'Long Hồn Ký - Chương 68', owner: 'Lam Comics', risk: 'Bình thường', status: 'Chờ duyệt' },
  { id: 'mod-3', contentType: 'Bình luận', title: 'Bình luận bị report ở Căn Phòng Số 17', owner: 'user_1247', risk: 'Ngôn từ không phù hợp', status: 'Đang xem xét' }
];

export const mockAdminFeaturedSlots = [
  { slot: 'Hero Banner', comicTitle: 'Long Hồn Ký', owner: 'Lam Comics', reason: 'Premium conversion cao', status: 'Đang hiển thị', endDate: '2026-05-12' },
  { slot: 'Trending Top 1', comicTitle: 'Học Viện Ánh Trăng', owner: 'An Nhiên Studio', reason: 'Retention 78%', status: 'Đang hiển thị', endDate: '2026-05-10' },
  { slot: 'New Creator', comicTitle: 'Vùng Đất Quên Lãng', owner: 'An Nhiên Studio', reason: 'Đẩy creator mới', status: 'Nháp', endDate: '-' }
];

export const mockSystemSettings = [
  { key: 'coin_rate', label: 'Tỷ lệ quy đổi Coin', value: '1.000 VND = 10 Coin', scope: 'Billing' },
  { key: 'creator_share', label: 'Tỷ lệ chia sẻ doanh thu Creator', value: '70%', scope: 'Revenue' },
  { key: 'auto_moderation', label: 'Kiểm duyệt tự động', value: 'Bật', scope: 'Moderation' },
  { key: 'premium_monthly_price', label: 'Giá Premium tháng', value: '79.000 VND', scope: 'Subscription' }
];

export const mockFunctionTestMatrix = [
  {
    role: 'reader' as const,
    label: 'Độc giả / Reader',
    accountEmail: 'reader@inkverse.demo',
    route: '/',
    functions: [
      { name: 'Khám phá: tìm kiếm & lọc truyện', route: '/explore', data: 'mockComics, categories, client-side filters' },
      { name: 'Thịnh hành: bảng xếp hạng hot', route: '/trending', data: 'mockComics, trendingScore' },
      { name: 'Đọc chương miễn phí / trả phí', route: '/comic/1', data: 'mockChapters' },
      { name: 'Mua chương bằng coin', route: '/comic/1', data: 'mockUnlockedChapters, mockTransactions, mockCoinPurchaseAuditTrail' },
      { name: 'Đăng ký Premium', route: '/premium', data: 'demoAccounts.reader.premium, mockPremiumSubscription.remainingReads' },
      { name: 'Bình luận & tương tác', route: '/comic/1', data: 'EnhancedComments' },
      { name: 'Theo dõi & thông báo', route: '/comic/1', data: 'mockFollowedComics, Notifications' },
      { name: 'Lưu tiến độ đọc', route: '/library', data: 'mockReadingProgress' }
    ]
  },
  {
    role: 'author' as const,
    label: 'Tác giả / Author',
    accountEmail: 'author@inkverse.demo',
    route: '/creator',
    functions: [
      { name: 'Đăng ký tài khoản Creator', route: '/creator/register', data: 'creatorStatus' },
      { name: 'Tạo & quản lý bộ truyện', route: '/creator', data: 'mockCreatorSeries' },
      { name: 'Upload chương mới', route: '/creator/upload', data: 'mockCreatorDrafts, PDF validation, copyright checklist' },
      { name: 'Xem Analytics', route: '/creator', data: 'creator analytics cards/charts' },
      { name: 'Nhận & theo dõi doanh thu', route: '/creator', data: 'mockCreatorSeries.revenue' },
      { name: 'Viết Blog / Nhật ký tác giả', route: '/creator/blog/new', data: 'Tiptap editor, cover upload preview, blogStore' },
      { name: 'Trả lời bình luận độc giả', route: '/creator', data: 'mockCreatorCommentInbox' },
      { name: 'Báo cáo vi phạm bản quyền', route: '/creator', data: 'mockCopyrightReports' }
    ]
  },
  {
    role: 'admin' as const,
    label: 'Quản trị / Admin',
    accountEmail: 'admin@inkverse.demo',
    route: '/admin',
    functions: [
      { name: 'Duyệt nội dung mới', route: '/admin', data: 'mockAdminModerationQueue' },
      { name: 'Quản lý người dùng', route: '/admin', data: 'demoAccounts, users table' },
      { name: 'Xử lý báo cáo vi phạm', route: '/admin', data: 'reports queue' },
      { name: 'Dashboard quản trị', route: '/admin', data: 'analyticsData' },
      { name: 'Quản lý doanh thu & thanh toán', route: '/admin', data: 'payoutQueue, recentTransactions' },
      { name: 'Cấu hình hệ thống', route: '/admin/settings', data: 'mockSystemSettings' },
      { name: 'Xem báo cáo & thống kê', route: '/admin', data: 'LineChart, BarChart' },
      { name: 'Quản lý truyện Featured', route: '/admin', data: 'mockAdminFeaturedSlots' }
    ]
  }
];
