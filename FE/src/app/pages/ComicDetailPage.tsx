import { useParams, Link } from 'react-router';
import { Star, Eye, Heart, Share2, BookOpen, Users, ChevronLeft, Bell, Bookmark, Coins, Crown, CalendarClock, Newspaper, MessageCircle, PenLine } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/Badge';
import { ChapterRow } from '../components/comic/ChapterRow';
import { ComicCard } from '../components/comic/ComicCard';
import { EnhancedComments } from '../components/comic/EnhancedComments';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
// import { mockComics, mockChapters, mockPremiumSubscription } from '../data/mockData';
const mockComics: any[] = [];
const mockChapters: any[] = [];
const mockPremiumSubscription: any = {
  planName: '',
  remainingReads: 0,
  usedThisMonth: 0,
  monthlyReadLimit: 1,
  resetAt: '',
};
import { getPublicBlogPosts } from '../lib/blogStore';
import { getMockSession } from '../lib/mockAuth';
import { useEffect, useMemo, useState } from 'react';
import { comicApi, chapterApi, userApi, paymentApi, ApiError, mapComic, mapChapter, type UiComic, type UiChapter, resolveUrl } from '../lib/api';

export function ComicDetailPage() {
  const { id } = useParams();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<UiChapter | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [notifyNewChapter, setNotifyNewChapter] = useState(true);
  const [coinBalance, setCoinBalance] = useState(550);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState('');

  const handleBuyChapter = async () => {
    if (!selectedChapter) return;
    setPayError('');
    setPayLoading(true);
    try {
      // Lưu lại URL hiện tại để quay lại sau khi thanh toán
      localStorage.setItem('payment_return_url', window.location.pathname);
      
      const { payUrl } = await paymentApi.createChapterPayment(selectedChapter.id);
      window.location.href = payUrl;
    } catch (err) {
      setPayError(err instanceof ApiError ? err.message : 'Tạo thanh toán thất bại.');
      alert(err instanceof ApiError ? err.message : 'Tạo thanh toán thất bại.');
    } finally {
      setPayLoading(false);
    }
  };

  useEffect(() => {
    const session = getMockSession();
    if (session) setCoinBalance(session.coins);
  }, []);
  const savedProgress = { chapter: 4, percent: 62, updatedAt: '2 giờ trước' };
  const premiumUsagePercent = Math.round((mockPremiumSubscription.usedThisMonth / mockPremiumSubscription.monthlyReadLimit) * 100);

  // Dữ liệu thật từ backend (fallback mock khi chưa có).
  const [comicData, setComicData] = useState<UiComic | null>(null);
  const [chapters, setChapters] = useState<UiChapter[]>(
    mockChapters as unknown as UiChapter[]
  );

  useEffect(() => {
    if (!id) return;
    let active = true;

    async function loadData() {
      try {
        // 1. Lấy danh sách ID chương đã sở hữu (nếu lỗi thì coi như chưa có)
        let ownedIds: string[] = [];
        try {
          ownedIds = await userApi.getMyChapters();
        } catch { /* ignore */ }
        
        if (!active) return;

        // 2. Lấy thông tin truyện
        try {
          const c = await comicApi.get(id);
          if (active) setComicData(mapComic(c));
        } catch {
          if (active) setComicData(null);
        }

        // 3. Lấy danh sách chương
        try {
          const list = await chapterApi.listByComic(id);
          if (active && list.length) {
            const mapped = list.map(mapChapter);
            const updated = mapped.map(ch => {
              if (ownedIds.includes(ch.id)) {
                return { ...ch, status: 'owned' as const };
              }
              return ch;
            });
            setChapters(updated);
          }
        } catch { /* giữ mock */ }

      } catch (err) {
        console.error('Lỗi khi tải dữ liệu trang chi tiết:', err);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [id]);

  const comic: any = comicData ?? mockComics.find((c) => c.id === id) ?? mockComics[0] ?? { id: '', title: '', author: '', cover: '', genres: [], rating: 0, views: 0, followers: 0, description: '', chapters: 0 };
  const similarComics = mockComics.filter((c) => c.id !== id).slice(0, 4);
  const authorBlogPosts = useMemo(() => getPublicBlogPosts()
    .filter((post) => post.authorComicId === comic.id || post.authorName === comic.author)
    .slice(0, 3), [comic.id, comic.author]);

  const handleChapterClick = (chapter: UiChapter) => {
    if (chapter.status === 'locked' || chapter.status === 'premium') {
      setSelectedChapter(chapter);
      setShowPurchaseModal(true);
    }
  };

  console.log(comic.cover)
  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Quay lại
        </Link>

        {/* Comic Info */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border shadow-2xl">
              <img src={comic.cover} alt={comic.title} className="w-full aspect-[3/4] object-cover rounded-xl bg-muted hidden md:block" />
              {comic.status && (
                <div className="absolute top-4 right-4">
                  <Badge variant={comic.status}>{comic.status.toUpperCase()}</Badge>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{comic.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">{comic.author}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {comic.genres.map((genre) => (
                  <Badge key={genre} variant="default">{genre}</Badge>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-warning text-warning" />
                  <span className="font-semibold">{comic.rating}</span>
                  <span className="text-muted-foreground">(12.5K đánh giá)</span>
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">{(comic.views / 1000000).toFixed(1)}M</span>
                  <span className="text-muted-foreground">lượt đọc</span>
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">{(comic.followers / 1000).toFixed(0)}K</span>
                  <span className="text-muted-foreground">theo dõi</span>
                </span>
              </div>
            </div>

            <p className="text-foreground leading-relaxed">{comic.description}</p>

            <div className="flex flex-wrap gap-4">
              <Link to={`/read/${comic.id}/${chapters[0]?.chapterId ?? chapters[0]?.id ?? '1'}`}>
                <Button size="lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Đọc chương đầu
                </Button>
              </Link>
              <Button variant={isFollowing ? 'secondary' : 'ghost'} size="lg" onClick={() => setIsFollowing(!isFollowing)}>
                <Heart className={`w-5 h-5 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
              </Button>
              <Button variant="ghost" size="lg">
                <Share2 className="w-5 h-5 mr-2" />
                Chia sẻ
              </Button>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2"><Bookmark className="w-4 h-4 text-primary" /> Tiến độ đọc đã lưu</h3>
                    <p className="text-sm text-muted-foreground mt-1">Đọc tiếp từ chương {savedProgress.chapter} · {savedProgress.updatedAt}</p>
                  </div>
                  <Badge variant="owned">{savedProgress.percent}%</Badge>
                </div>
                <div className="h-2 bg-background/60 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${savedProgress.percent}%` }} />
                </div>
                <Link to={`/read/${comic.id}/${savedProgress.chapter}`}>
                  <Button variant="secondary" size="sm">Đọc tiếp</Button>
                </Link>
              </div>

              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <h3 className="font-semibold flex items-center gap-2 mb-3"><Bell className="w-4 h-4 text-warning" /> Theo dõi & thông báo</h3>
                <p className="text-sm text-muted-foreground mb-4">Theo dõi truyện để không bỏ lỡ chương mới.</p>
                <button
                  onClick={() => setNotifyNewChapter(!notifyNewChapter)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all text-left ${notifyNewChapter ? 'border-primary/40 bg-primary/10' : 'border-border bg-background/40'}`}
                >
                  <span className="font-semibold">{notifyNewChapter ? 'Đã bật nhắc chương mới' : 'Nhắc chương mới đang tắt'}</span>
                  <span className="block text-xs text-muted-foreground mt-1">
                    {notifyNewChapter ? 'Bạn sẽ được báo khi truyện có chương mới.' : 'Bật lại bất cứ lúc nào khi muốn theo dõi tiếp.'}
                  </span>
                </button>
              </div>

              <div className="bg-gradient-to-br from-warning/10 to-primary/10 rounded-xl p-4 border border-warning/30">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2"><Crown className="w-4 h-4 text-warning" /> Lượt đọc Premium</h3>
                    <p className="text-sm text-muted-foreground mt-1">Còn {mockPremiumSubscription.remainingReads}/{mockPremiumSubscription.monthlyReadLimit} lượt trong tháng này.</p>
                  </div>
                  <Badge variant="premium">Premium</Badge>
                </div>
                <div className="h-2 bg-background/60 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-primary to-warning" style={{ width: `${premiumUsagePercent}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Đã dùng {mockPremiumSubscription.usedThisMonth} lượt</span>
                  <span className="flex items-center gap-1"><CalendarClock className="w-3 h-3" /> Reset {mockPremiumSubscription.resetAt.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <h3 className="font-semibold mb-2">Thông tin</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổng chương:</span>
                  <span className="font-semibold">{comic.chapters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá mỗi chương:</span>
                  <span className="font-semibold text-primary">{comic.pricePerChapter} Coin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge variant="success">Đang cập nhật</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Danh sách chương</h2>
            <span className="text-sm text-muted-foreground">{chapters.length} chương</span>
          </div>
          <div className="space-y-3">
            {chapters.map((chapter) => (
              <div key={chapter.id} onClick={() => handleChapterClick(chapter)}>
                <ChapterRow {...chapter} comicId={comic.id} />
              </div>
            ))}
            {chapters.length === 0 && (
              <div className="bg-card rounded-xl border border-border p-6 text-center text-muted-foreground">
                Truyện chưa có chương nào.
              </div>
            )}
          </div>
        </section>


        {/* Author Blog Section */}
        {authorBlogPosts.length > 0 && (
          <section className="mb-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Newspaper className="w-4 h-4 text-primary" />
                  Blog / Nhật ký tác giả
                </div>
                <h2 className="text-2xl font-bold">Bài viết mới từ {comic.author}</h2>
                <p className="text-sm text-muted-foreground mt-1">Độc giả có thể xem hậu trường sáng tác, teaser chương mới và ghi chú nhân vật từ tác giả.</p>
              </div>
              <Link to="/blog">
                <Button variant="ghost">Xem tất cả blog</Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {authorBlogPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="group block rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                  <div className="aspect-[16/10] overflow-hidden rounded-xl bg-muted mb-4">
                    <ImageWithFallback src={post.coverUrl} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="inline-flex items-center rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground">{post.readingTime}</span>
                  </div>
                  <h3 className="font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {post.views}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {post.comments}</span>
                    <span className="flex items-center gap-1 text-primary"><PenLine className="w-3.5 h-3.5" /> Đọc blog</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Comments Section */}
        <section className="mb-12">
          <EnhancedComments comicId={comic.id} />
        </section>

        {/* Similar Comics */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Truyện tương tự</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similarComics.map((comic) => (
              <ComicCard key={comic.id} {...comic} />
            ))}
          </div>
        </section>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedChapter && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPurchaseModal(false)}>
          <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Mua chương</h3>
              <Badge variant="primary"><Coins className="w-3 h-3 mr-1" /> {coinBalance} Coin</Badge>
            </div>
            <p className="text-muted-foreground mb-6">
              Bạn có thể mở khóa chương bằng Coin để sở hữu vĩnh viễn, hoặc dùng 1 lượt đọc Premium nếu gói còn quota.
            </p>
            <div className="bg-muted/30 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between gap-3">
                <span>Chương {selectedChapter.number}</span>
                <span className="font-semibold text-right">{selectedChapter.title}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Giá mua vĩnh viễn:</span>
                <span className="font-bold text-primary">{selectedChapter.price} Coin</span>
              </div>
            </div>

            <div className="grid gap-3 mb-6">
              <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="font-semibold flex items-center gap-2"><Crown className="w-4 h-4 text-warning" /> Đọc bằng Premium</span>
                  <Badge variant="premium">Còn {mockPremiumSubscription.remainingReads} lượt</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Sẽ trừ 1 lượt Premium. Lượt còn lại sau khi đọc: {Math.max(mockPremiumSubscription.remainingReads - 1, 0)}.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="font-semibold flex items-center gap-2"><Coins className="w-4 h-4 text-primary" /> Mua bằng Coin</span>
                  <Badge variant="primary">{coinBalance} Coin</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Sở hữu vĩnh viễn chương này và không trừ lượt đọc Premium.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <Button variant="ghost" className="w-full" onClick={() => setShowPurchaseModal(false)} disabled={payLoading}>
                Hủy
              </Button>
              <Link to={`/read/${comic.id}/${selectedChapter.id}`} className="w-full">
                <Button variant="secondary" className="w-full" disabled={payLoading}>
                  Dùng Premium
                </Button>
              </Link>
              <Button className="w-full" onClick={handleBuyChapter} disabled={payLoading}>
                {payLoading ? 'Đang tạo...' : 'Mua Coin'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
