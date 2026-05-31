import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  MessageCircle,
  Home,
  Settings,
  Award,
  BookmarkCheck,
  Bell,
  Type,
  Coins,
  Lock,
  Crown,
  CalendarClock,
  ExternalLink,
  FileWarning,
  RefreshCcw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/Badge';
import { chapterApi, paymentApi, ApiError, resolveUrl, mapChapter, userApi, comicApi } from '../lib/api';

type PdfLoadState = 'idle' | 'loading' | 'ready' | 'needsAction' | 'failed';

const getPdfUrlProblem = (url: string) => {
  if (!url) return 'Không tìm thấy liên kết nội dung.';
  try {
    const fullUrl = resolveUrl(url);
    const parsedUrl = new URL(fullUrl);
    if (parsedUrl.hostname === 'example.com') {
      return 'File đọc của chương này chưa sẵn sàng. Vui lòng quay lại sau ít phút.';
    }
  } catch {
    return 'Liên kết nội dung không hợp lệ.';
  }
  return '';
};

const toPdfViewerUrl = (url: string) => `${resolveUrl(url)}#toolbar=0&navpanes=0&view=FitH`;

export function ReaderPage() {
  const { comicId, chapterId } = useParams();
  const [showUI, setShowUI] = useState(true);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  
  // States cho dữ liệu thật
  const [chapters, setChapters] = useState<any[]>([]);
  const [comicData, setComicData] = useState<any>(null);
  const [apiChapter, setApiChapter] = useState<{ url: string | null; title: string; number: number } | null>(null);
  
  // States cho trạng thái UI
  const [loading, setLoading] = useState(true);
  const [paywall, setPaywall] = useState<{ message: string } | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState('');
  const [pdfLoadState, setPdfLoadState] = useState<PdfLoadState>('idle');
  const [pdfViewerKey, setPdfViewerKey] = useState(0);

  const comic = comicData || { id: comicId ?? '', title: 'Đang tải...', author: '', cover: '', genres: [], chapters: 0 };
  
  const currentIndex = Array.isArray(chapters) ? chapters.findIndex((c) => c.id === chapterId) : -1;
  const currentChapterData = currentIndex !== -1 ? chapters[currentIndex] : null;
  const nextChapter = currentIndex !== -1 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  
  const isNextLocked = nextChapter?.status === 'locked' || nextChapter?.status === 'premium';

  useEffect(() => {
    setProgress(0);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [comicId, chapterId]);

  // Tải toàn bộ dữ liệu cần thiết
  useEffect(() => {
    if (!comicId || !chapterId) return;
    let active = true;
    setLoading(true);
    setApiChapter(null);
    setPaywall(null);

    async function initReader() {
      try {
        // 1. Tải thông tin truyện & danh sách chương (để có data điều hướng)
        const [cData, chapterList] = await Promise.all([
          comicApi.get(comicId).catch(() => null),
          chapterApi.listByComic(comicId).catch(() => [])
        ]);

        if (!active) return;
        if (cData) setComicData(cData);
        if (Array.isArray(chapterList)) {
          setChapters(chapterList.map(mapChapter));
        }

        // 2. Tải nội dung chương
        try {
          const chap = await chapterApi.get(chapterId);
          if (active) setApiChapter({ url: chap.url, title: chap.title, number: chap.chapterNumber });
        } catch (err) {
          if (active && err instanceof ApiError && err.status === 400) {
            setPaywall({ message: err.message });
          }
        }
      } catch (err) {
        console.error('Lỗi khởi tạo trình đọc:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    initReader();
    return () => { active = false; };
  }, [comicId, chapterId]);

  useEffect(() => {
    const url = apiChapter?.url?.trim();
    if (!url) {
      setPdfLoadState('idle');
      return;
    }

    const problem = getPdfUrlProblem(url);
    if (problem) {
      setPdfLoadState('failed');
      return;
    }

    setPdfLoadState('loading');
    const timer = window.setTimeout(() => {
      setPdfLoadState((current) => (current === 'loading' ? 'needsAction' : current));
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [apiChapter?.url, pdfViewerKey]);

  const handleBuyChapter = async () => {
    if (!chapterId) return;
    setPayError('');
    setPayLoading(true);
    try {
      // Lưu lại URL hiện tại để quay lại sau khi thanh toán
      localStorage.setItem('payment_return_url', window.location.pathname);

      const { payUrl } = await paymentApi.createChapterPayment(chapterId);
      window.location.href = payUrl;
    } catch (err) {
      setPayError(err instanceof ApiError ? err.message : 'Tạo thanh toán thất bại.');
    } finally {
      setPayLoading(false);
    }
  };

  const chapterTitle = apiChapter?.title ?? currentChapterData?.title ?? '';
  const chapterNumber = apiChapter?.number ?? currentChapterData?.number ?? 0;
  const rawUrl = apiChapter?.url?.trim() || '';
  const pdfUrlProblem = rawUrl ? getPdfUrlProblem(rawUrl) : '';
  const pdfViewerUrl = rawUrl && !pdfUrlProblem ? toPdfViewerUrl(rawUrl) : '';
  const isImage = rawUrl && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(rawUrl);

  const mockComments = [
    { id: '1', user: 'Minh Anh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', text: 'Chương này hay quá! 🔥', likes: 23, time: '5 phút trước' },
    { id: '2', user: 'Hoàng Long', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', text: 'Plot twist cực đỉnh, không ngờ được!', likes: 18, time: '12 phút trước' },
    { id: '3', user: 'Thu Hà', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', text: 'Chờ chương sau mỏi mòn 😭', likes: 31, time: '1 giờ trước' }
  ];

  return (
    <div className="min-h-screen bg-background relative" onClick={() => setShowUI(!showUI)}>
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
          <div className="text-center">
            <RefreshCcw className="mx-auto h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground animate-pulse">Đang chuẩn bị nội dung...</p>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm transition-all duration-300 ${showUI ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={`/comic/${comicId}`} onClick={(e) => e.stopPropagation()}>
            <button className="flex items-center gap-2 text-white hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>
          </Link>

          <div className="text-center min-w-0 px-4">
            <h1 className="text-white font-semibold text-sm sm:text-base truncate">{comic.title}</h1>
            <p className="text-white/60 text-xs sm:text-sm truncate">Chương {chapterNumber}: {chapterTitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setAutoSave(!autoSave); }}
              className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${autoSave ? 'bg-success/20 border-success/40 text-success' : 'bg-white/10 border-white/20 text-white/70'}`}
            >
              <BookmarkCheck className="w-4 h-4" />
              {autoSave ? 'Đã bật lưu' : 'Tắt lưu'}
            </button>
            <Link to="/" onClick={(e) => e.stopPropagation()}>
              <button className="w-10 h-10 flex items-center justify-center text-white hover:text-primary transition-colors">
                <Home className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        <div className="h-1 bg-white/10">
          <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto pt-24 pb-32">
        {paywall ? (
          <div className="mx-4 my-8 rounded-2xl border border-primary/30 bg-card/95 p-8 text-center space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Chương này cần mở khoá</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">{paywall.message}</p>
            {payError && <p className="text-sm text-error">{payError}</p>}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button onClick={handleBuyChapter} disabled={payLoading} size="lg">
                <Coins className="w-5 h-5 mr-2" />
                {payLoading ? 'Đang tạo đơn...' : 'Mua chương'}
              </Button>
              <Link to="/premium" onClick={(e) => e.stopPropagation()}>
                <Button variant="secondary" size="lg" className="w-full">
                  <Crown className="w-5 h-5 mr-2" /> Mua gói Premium
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-0" onClick={(e) => e.stopPropagation()}>
            {rawUrl ? (
              <div className="mx-4 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10">
                <div className="flex flex-col gap-3 border-b border-border bg-card/95 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">Chương {chapterNumber}: {chapterTitle}</p>
                    <p className="mt-1 text-xs text-muted-foreground truncate">Nguồn: {isImage ? 'Hình ảnh' : 'File PDF'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href={resolveUrl(rawUrl)} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="secondary">
                        <ExternalLink className="w-4 h-4 mr-2" /> Xem toàn màn hình
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="relative min-h-[85vh] bg-muted flex items-center justify-center">
                  {pdfUrlProblem ? (
                    <div className="text-center p-8">
                      <FileWarning className="w-12 h-12 text-warning mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">{pdfUrlProblem}</p>
                    </div>
                  ) : isImage ? (
                    <img src={resolveUrl(rawUrl)} alt={chapterTitle} className="w-full h-auto" onLoad={() => setProgress(100)} />
                  ) : (
                    <iframe
                      key={pdfViewerKey}
                      src={`${resolveUrl(rawUrl)}#toolbar=0`}
                      className="w-full h-[85vh] border-none"
                      title="PDF Reader"
                      onLoad={() => { setPdfLoadState('ready'); setProgress(100); }}
                      onError={() => setPdfLoadState('failed')}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="mx-4 py-32 text-center border-2 border-dashed border-border rounded-2xl">
                <FileWarning className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-bold">Nội dung chưa sẵn sàng</h2>
                <p className="text-sm text-muted-foreground mt-2">Vui lòng quay lại sau.</p>
              </div>
            )}
          </div>
        )}

        {/* End of Chapter */}
        <div className="px-4 py-16 text-center space-y-8">
          <h2 className="text-2xl font-bold">Hết chương {chapterNumber}</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant={liked ? 'secondary' : 'ghost'} onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}>
              <Heart className={`w-5 h-5 mr-2 ${liked ? 'fill-current' : ''}`} /> {liked ? 'Đã thích' : 'Thả tim'}
            </Button>
            <Button variant="ghost" onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}>
              <MessageCircle className="w-5 h-5 mr-2" /> Bình luận
            </Button>
          </div>

          {nextChapter && (
            <div className="pt-8">
              {isNextLocked ? (
                <div className="max-w-md mx-auto bg-card border border-primary/30 rounded-2xl p-6 text-left">
                  <h3 className="font-bold mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-primary" /> Chương kế tiếp cần mở khóa</h3>
                  <Link to={`/comic/${comicId}`} onClick={(e) => e.stopPropagation()}><Button className="w-full">Xem danh sách chương</Button></Link>
                </div>
              ) : (
                <Link to={`/read/${comicId}/${nextChapter.id}`} onClick={(e) => e.stopPropagation()}>
                  <Button size="lg" className="px-8 py-6 text-lg rounded-2xl">
                    Chương tiếp theo <ChevronRight className="w-6 h-6 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 to-transparent backdrop-blur-sm transition-all duration-300 ${showUI ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {prevChapter ? (
            <Link to={`/read/${comicId}/${prevChapter.id}`} onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" className="text-white hover:text-primary"><ChevronLeft className="w-5 h-5 mr-2" /> Chương trước</Button>
            </Link>
          ) : <div />}
          <button className="text-white hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}><Settings className="w-6 h-6" /></button>
          {nextChapter && !isNextLocked ? (
            <Link to={`/read/${comicId}/${nextChapter.id}`} onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" className="text-white hover:text-primary">Chương sau <ChevronRight className="w-5 h-5 ml-2" /></Button>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
