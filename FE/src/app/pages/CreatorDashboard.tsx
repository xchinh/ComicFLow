import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { comicApi, dashboardApi, ApiError, type ComicResponse, type AuthorDashboardResponse } from '../lib/api';
import {
  DollarSign,
  Eye,
  ShoppingCart,
  Users,
  Upload,
  Plus,
  AlertCircle,
  BarChart3,
  BookOpen,
  FileText,
  MessageCircle,
  ShieldAlert,
  Wallet,
  PencilLine,
  Reply,
  Send
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { StatCard } from '../components/dashboard/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const CHAPTER_UPLOAD_STORAGE_KEY = 'inkverse.creator.chapterUploads';
const BLOG_STORAGE_KEY = 'inkverse.creator.blogPosts';

function readDemoUploadedChapters() {
  try {
    const raw = localStorage.getItem(CHAPTER_UPLOAD_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readDemoBlogPosts() {
  try {
    const raw = localStorage.getItem(BLOG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((post) => ({
      title: post.title || 'Blog chưa có tiêu đề',
      status: post.status || 'Bản nháp',
      views: post.views || '-',
      comments: Number(post.comments || 0),
      excerpt: post.excerpt || '',
      updatedAt: post.updatedAt || '',
      readingTime: post.readingTime || ''
    }));
  } catch {
    return [];
  }
}


export function CreatorDashboard() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<'comic' | null>(null);
  const [notice, setNotice] = useState('');
  const [comicForm, setComicForm] = useState<{ title: string; description: string; coverImage: File | null }>({ title: '', description: '', coverImage: null });
  const [stats, setStats] = useState<AuthorDashboardResponse | null>(null);

  const revenueData = [
    { date: '30/4', revenue: 450000, views: 82000 },
    { date: '1/5', revenue: 520000, views: 91000 },
    { date: '2/5', revenue: 380000, views: 76000 },
    { date: '3/5', revenue: 680000, views: 128000 },
    { date: '4/5', revenue: 590000, views: 110000 },
    { date: '5/5', revenue: 750000, views: 146000 },
    { date: '6/5', revenue: 820000, views: 158000 }
  ];

  const [myComics, setMyComics] = useState<any[]>([]);

  // Tải truyện thật của tác giả (cần đăng nhập role AUTHOR).
  useEffect(() => {
    let active = true;

    async function fetchData() {
      // 1. Tải thống kê
      dashboardApi.getAuthorStats()
        .then(statsData => {
          if (active) setStats(statsData);
          return statsData;
        })
        .catch(err => {
          console.error('Lỗi khi tải thống kê dashboard:', err);
          return null;
        })
        .then(async (statsData) => {
          // 2. Tải danh sách truyện (không phụ thuộc việc tải stats thành công hay không)
          try {
            const list = await comicApi.listMine();
            if (!active) return;
            
            setMyComics(
              list.map((c: ComicResponse) => {
                const s = statsData?.comicStats?.find(cs => cs.comicId === c.id);
                return {
                  id: c.id,
                  title: c.title,
                  status: c.status === 'COMPLETED' ? 'published' : c.status === 'HIATUS' ? 'pending' : 'published',
                  chapters: 0,
                  revenue: s ? s.sales : 0,
                  views: s ? s.views : 0,
                  purchases: 0,
                  price: 0,
                  pending: 0,
                };
              })
            );
          } catch (err) {
            console.error('Lỗi khi tải danh sách truyện của tôi:', err);
            if (active) setMyComics([]);
          }
        });
    }

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const chapterPerformance = [
    { chapter: 'Chương 45', views: 125000, purchases: 850, revenue: 12750000, dropOff: '12%' },
    { chapter: 'Chương 44', views: 132000, purchases: 920, revenue: 13800000, dropOff: '10%' },
    { chapter: 'Chương 43', views: 145000, purchases: 1050, revenue: 15750000, dropOff: '8%' },
    { chapter: 'Chương 42', views: 138000, purchases: 980, revenue: 14700000, dropOff: '11%' }
  ];

  const [drafts] = useState(() => [
    ...readDemoUploadedChapters(),
    { title: 'Chương 46: Cánh cửa bạc', comic: 'Học Viện Ánh Trăng', status: 'Bản nháp', updated: '10 phút trước', fileName: 'hoc-vien-anh-trang-chuong-46.pdf', copyright: 'Chưa gửi kiểm tra' },
    { title: 'Chương 6: Bản đồ cổ', comic: 'Vùng Đất Quên Lãng', status: 'Đang duyệt', updated: '2 giờ trước', fileName: 'vung-dat-quen-lang-chuong-6.pdf', copyright: 'Đã gửi kiểm tra' }
  ]);

  const [blogPosts, setBlogPosts] = useState(() => [
    ...readDemoBlogPosts(),
    { title: 'Hậu trường tạo hình nhân vật Luna', status: 'Đã đăng', views: '12.4K', comments: 86, excerpt: 'Quá trình xây dựng tạo hình Luna từ bản phác thảo đầu tiên đến phiên bản cuối.', updatedAt: '09/05/2026', readingTime: '3 phút đọc' },
    { title: 'Nhật ký tác giả: Vì sao arc mới tối hơn?', status: 'Bản nháp', views: '-', comments: 0, excerpt: 'Ghi chú định hướng cảm xúc cho arc tiếp theo.', updatedAt: '08/05/2026', readingTime: '2 phút đọc' }
  ]);

  const commentInbox = [
    { reader: 'Minh Anh', comic: 'Học Viện Ánh Trăng', comment: 'Chương này có twist rất hay, tác giả ra chương mới nhanh nha!', time: '5 phút trước' },
    { reader: 'Hoàng Long', comic: 'Người Gác Cổng Linh Giới', comment: 'Mình muốn biết thêm về bối cảnh linh giới.', time: '1 giờ trước' },
    { reader: 'Thu Hà', comic: 'Học Viện Ánh Trăng', comment: 'Panel cuối đẹp quá!', time: '3 giờ trước' }
  ];

  const payoutHistory = [
    { period: 'Tháng 05/2026', gross: 22300000, platformFee: 6690000, net: 15610000, status: 'Sẵn sàng rút' },
    { period: 'Tháng 04/2026', gross: 18400000, platformFee: 5520000, net: 12880000, status: 'Đã thanh toán' }
  ];

  const copyrightReports = [
    { title: 'Website reup Chương 41', proof: '3 ảnh chụp + link nguồn', status: 'Đang xử lý' },
    { title: 'Tài khoản sao chép artwork', proof: 'So sánh panel', status: 'Cần bổ sung bằng chứng' }
  ];

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3200);
  };

  const openUploadModal = () => {
    navigate('/creator/upload');
  };

  const openBlogModal = () => {
    navigate('/creator/blog/new');
  };

  const openComicModal = () => {
    setComicForm({ title: '', description: '', coverImage: null });
    setActiveModal('comic');
  };



  const submitComic = async (status: 'draft' | 'pending' = 'pending') => {
    if (!comicForm.title.trim()) {
      showNotice('Vui lòng nhập tên bộ truyện.');
      return;
    }

    // Thử tạo truyện thật trên backend (backend yêu cầu multipart/form-data).
    try {
      const created = await comicApi.create({
        title: comicForm.title.trim(),
        description: comicForm.description.trim() || undefined,
        status: 'ONGOING',
        coverImage: comicForm.coverImage || undefined,
      });
      setMyComics((current) => [
        {
          id: created.id,
          title: created.title,
          status: 'published',
          chapters: 0,
          revenue: 0,
          views: 0,
          purchases: 0,
          price: 0,
          pending: 0,
        },
        ...current,
      ]);
      setActiveModal(null);
      showNotice('Đã tạo bộ truyện mới trên backend.');
      return;
    } catch (err) {
      // Chưa đăng nhập author / backend chưa chạy -> fallback demo
      if (!(err instanceof ApiError && err.status === 0)) {
        showNotice(err instanceof ApiError ? `Tạo truyện thất bại: ${err.message}` : 'Tạo truyện thất bại.');
        return;
      }
    }

    setMyComics((current) => [
      {
        id: `demo-${Date.now()}`,
        title: comicForm.title.trim(),
        status: status === 'pending' ? 'pending' : 'draft',
        chapters: 0,
        revenue: 0,
        views: 0,
        purchases: 0,
        price: 0,
        pending: status === 'pending' ? 1 : 0
      },
      ...current
    ]);

    setActiveModal(null);
    showNotice('Đã lưu bộ truyện ở chế độ demo (chưa kết nối backend author).');
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
            <p className="text-muted-foreground">Quản lý tác phẩm, upload chương, tương tác độc giả và theo dõi doanh thu</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="ghost" onClick={openBlogModal}>
              <PencilLine className="w-5 h-5 mr-2" />
              Viết blog
            </Button>
            <Button variant="secondary" onClick={openUploadModal}>
              <Upload className="w-5 h-5 mr-2" />
              Upload chương
            </Button>
            <Button onClick={openComicModal}>
              <Plus className="w-5 h-5 mr-2" />
              Đăng truyện mới
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Tổng doanh thu" value={stats ? `${stats.totalSales.toLocaleString()}đ` : "..."} icon={DollarSign} color="primary" />
          <StatCard title="Lượt đọc" value={stats ? stats.totalViews.toLocaleString() : "..."} icon={Eye} color="secondary" />
          <StatCard title="Số truyện" value={stats ? stats.totalComics.toString() : "..."} icon={ShoppingCart} color="success" />
        </div>

        {/* My Comics */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Tác phẩm của tôi</h2>
            <Button size="sm" onClick={openComicModal}><Plus className="w-4 h-4 mr-2" /> Đăng truyện mới</Button>
          </div>
          <div className="space-y-4">
            {myComics.length > 0 ? myComics.map((comic) => (
              <Card key={comic.id} hover>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{comic.title}</h3>
                      <Badge variant={comic.status === 'published' ? 'success' : 'warning'}>
                        {comic.status === 'published' ? 'Đã xuất bản' : 'Đang phát triển'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{comic.chapters} chương</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{comic.revenue.toLocaleString()}đ</p>
                      <p className="text-xs text-muted-foreground">Doanh thu</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{comic.views.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Lượt đọc</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/creator/comic/${comic.id}`)}>Quản lý</Button>
                </div>
              </Card>
            )) : (
              <Card className="p-8 text-center text-muted-foreground">
                Bạn chưa có truyện nào. Hãy đăng truyện mới ngay!
              </Card>
            )}
          </div>
        </section>

      </div>

      {notice && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-primary/30 bg-card px-5 py-3 text-sm font-semibold shadow-2xl shadow-primary/20">
          {notice}
        </div>
      )}

      {activeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-5 md:p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">
Đăng truyện mới
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
Khai báo bộ truyện mới và gửi duyệt trước khi xuất bản.
                </p>
              </div>
              <button className="rounded-full px-3 py-1 text-sm text-muted-foreground hover:bg-muted" onClick={() => setActiveModal(null)}>
                Đóng
              </button>
            </div>

            {activeModal === 'comic' && (
              <div className="space-y-4">
                <input value={comicForm.title} onChange={(e) => setComicForm({ ...comicForm, title: e.target.value })} className="w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="Tên bộ truyện" />
                <textarea value={comicForm.description} onChange={(e) => setComicForm({ ...comicForm, description: e.target.value })} className="min-h-32 w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="Mô tả truyện, đối tượng độc giả, cam kết bản quyền..." />
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Ảnh bìa (Cover Image)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setComicForm({ ...comicForm, coverImage: e.target.files?.[0] || null })}
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => submitComic('draft')}>Lưu nháp</Button>
                  <Button onClick={() => submitComic('pending')}><Plus className="w-4 h-4 mr-2" />Gửi duyệt truyện</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
