import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Award, BarChart3, Clock3, Flame, Star, TrendingUp, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/Badge';
import { comicApi, mapComic, ApiError, type UiComic } from '../lib/api';

const periodOptions = [
  { id: '24h', label: '24 giờ' },
  { id: '7d', label: '7 ngày' },
  { id: '30d', label: '30 ngày' },
];

// BE chưa có views/rating/followers/genres. Trending score tạm dùng độ dài title +
// thứ tự id để cho ra ranking ổn định. Khi BE có metrics thật thì thay công thức.
const computeScore = (comic: UiComic, indexFromNewest: number) => {
  const titleWeight = comic.title.length * 4;
  const recencyWeight = Math.max(0, 100 - indexFromNewest * 8);
  return titleWeight + recencyWeight;
};

const apiStatusBadge = (status?: string) => {
  if (status === 'ONGOING') return <Badge variant="new">Đang tiến hành</Badge>;
  if (status === 'COMPLETED') return <Badge variant="primary">Hoàn thành</Badge>;
  if (status === 'HIATUS') return <Badge variant="warning">Tạm ngưng</Badge>;
  return null;
};

const updateTrendingUrl = (period: string) => {
  const params = new URLSearchParams();
  if (period !== '7d') params.set('period', period);
  const query = params.toString();
  window.history.replaceState(null, '', query ? `/trending?${query}` : '/trending');
};

export function TrendingPage() {
  const initialParams = new URLSearchParams(window.location.search);
  const [period, setPeriod] = useState(initialParams.get('period') || '7d');

  const [comics, setComics] = useState<UiComic[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    comicApi
      .list()
      .then((data) => {
        if (active) setComics(data.map(mapComic));
      })
      .catch((err) => {
        if (active) setErrorMsg(err instanceof ApiError ? err.message : 'Không tải được danh sách truyện.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const rankedComics = useMemo(() => {
    const newestFirst = [...comics].sort((a, b) => b.id.localeCompare(a.id));
    return newestFirst
      .map((comic, idx) => ({ ...comic, trendingScore: computeScore(comic, idx) }))
      .sort((a, b) => b.trendingScore - a.trendingScore);
  }, [comics]);

  const topComic = rankedComics[0];

  const applyPeriod = (value: string) => {
    setPeriod(value);
    updateTrendingUrl(value);
  };

  return (
    <div className="min-h-screen pb-16">
      <section className="border-b border-border bg-gradient-to-br from-warning/15 via-background to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Badge variant="hot" className="mb-4 inline-flex">
            <Flame className="w-3 h-3 mr-1" /> THỊNH HÀNH
          </Badge>
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Bảng xếp hạng truyện đang hot</h1>
              <p className="text-muted-foreground max-w-3xl">
                Thịnh hành xếp hạng truyện theo điểm hot tổng hợp. Hiện tại điểm dựa trên độ mới
                và thông tin cơ bản; khi tích hợp lượt xem/đánh giá thực, công thức sẽ cập nhật tự động.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm font-semibold mb-3">Tín hiệu xếp hạng</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-muted/30 p-3"><BarChart3 className="w-4 h-4 text-primary mb-1" /> Views (sắp có)</div>
                <div className="rounded-xl bg-muted/30 p-3"><Star className="w-4 h-4 text-warning mb-1" /> Rating (sắp có)</div>
                <div className="rounded-xl bg-muted/30 p-3"><Users className="w-4 h-4 text-secondary mb-1" /> Followers (sắp có)</div>
                <div className="rounded-xl bg-muted/30 p-3"><Clock3 className="w-4 h-4 text-primary mb-1" /> Recency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="grid lg:grid-cols-[360px_1fr] gap-6 items-start">
          <aside className="bg-card border border-border rounded-2xl p-5 lg:sticky lg:top-24 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-warning" />
                <h2 className="font-bold text-xl">Bộ lọc bảng xếp hạng</h2>
              </div>
              <p className="text-sm text-muted-foreground">Bộ lọc thời gian là UI tham khảo, dữ liệu sẽ áp dụng khi BE cung cấp metrics theo chu kỳ.</p>
            </div>

            <div>
              <h3 className="font-bold mb-3">Khoảng thời gian</h3>
              <div className="grid grid-cols-3 gap-2">
                {periodOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => applyPeriod(option.id)}
                    className={`px-3 py-2 rounded-xl border text-sm transition-all ${
                      period === option.id
                        ? 'bg-warning text-black border-warning'
                        : 'bg-muted/20 border-border hover:border-warning/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-muted/30 border border-border p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Thịnh hành khác Khám phá ở đâu?</p>
              <p>Khám phá là công cụ tìm truyện. Thịnh hành là bảng xếp hạng truyện hot nhất theo tín hiệu tương tác.</p>
            </div>
          </aside>

          <main className="space-y-6">
            {errorMsg && <p className="text-error">{errorMsg}</p>}

            {topComic && (
              <Link to={`/comic/${topComic.id}`} className="block bg-card border border-warning/40 rounded-3xl p-5 hover:shadow-2xl hover:shadow-warning/10 transition-all">
                <div className="grid md:grid-cols-[180px_1fr] gap-5 items-center">
                  <div className="relative">
                    <img src={topComic.cover} alt={topComic.title} className="w-full aspect-[3/4] object-cover rounded-2xl bg-muted" />
                    <div className="absolute -top-3 -left-3 w-12 h-12 rounded-2xl bg-warning text-black font-black flex items-center justify-center shadow-lg">#1</div>
                  </div>
                  <div>
                    <Badge variant="hot" className="mb-3"><Award className="w-3 h-3 mr-1" /> Top thịnh hành</Badge>
                    <h2 className="text-3xl font-bold mb-2">{topComic.title}</h2>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{topComic.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="rounded-xl bg-muted/30 p-3"><p className="text-muted-foreground">Điểm hot</p><p className="font-bold text-xl">{topComic.trendingScore}</p></div>
                      <div className="rounded-xl bg-muted/30 p-3"><p className="text-muted-foreground">Tác giả</p><p className="font-bold">{topComic.author}</p></div>
                      {apiStatusBadge(topComic.apiStatus) && (
                        <div className="rounded-xl bg-muted/30 p-3"><p className="text-muted-foreground">Trạng thái</p><div className="mt-1">{apiStatusBadge(topComic.apiStatus)}</div></div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )}

            <div className="bg-card rounded-2xl border border-border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Bảng xếp hạng · {periodOptions.find((item) => item.id === period)?.label}</p>
                <h2 className="text-2xl font-bold">
                  {loading ? 'Đang tải...' : `${rankedComics.length} truyện đang thịnh hành`}
                </h2>
              </div>
              <Link to="/explore"><Button variant="outline">Sang Khám phá</Button></Link>
            </div>

            <div className="space-y-3">
              {rankedComics.map((comic, index) => (
                <Link key={comic.id} to={`/comic/${comic.id}`} className="bg-card border border-border rounded-2xl p-4 hover:border-warning/50 transition-all grid md:grid-cols-[70px_110px_1fr_auto] gap-4 items-center">
                  <div className="text-3xl font-black text-warning">#{index + 1}</div>
                  <img src={comic.cover} alt={comic.title} className="w-full aspect-[3/4] object-cover rounded-xl bg-muted hidden md:block" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-bold text-lg">{comic.title}</h3>
                      {apiStatusBadge(comic.apiStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{comic.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">Tác giả: {comic.author}</p>
                  </div>
                  <div className="text-sm md:text-right">
                    <p><span className="text-muted-foreground">Hot score</span><br /><span className="font-bold text-warning">{comic.trendingScore}</span></p>
                  </div>
                </Link>
              ))}
            </div>

            {!loading && !errorMsg && rankedComics.length === 0 && (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <h3 className="font-bold text-lg mb-2">Chưa có truyện nào để xếp hạng</h3>
                <p className="text-muted-foreground">Khi có thêm truyện, bảng xếp hạng sẽ cập nhật ngay.</p>
              </div>
            )}
          </main>
        </section>
      </div>
    </div>
  );
}
