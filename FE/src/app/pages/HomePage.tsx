import { Link, useParams, useSearchParams } from 'react-router';
import { ArrowRight, TrendingUp, Clock, Star, Sparkles, X, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ComicCard } from '../components/comic/ComicCard';
import { Badge } from '../components/ui/Badge';
import { SearchBar } from '../components/ui/SearchBar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
// import { mockComics, mockCreators, categories } from '../data/mockData';
const mockComics: any[] = [];
const mockCreators: any[] = [];
const categories: string[] = [];
import { useEffect, useMemo, useState } from 'react';
import { comicApi, mapComic, type UiComic } from '../lib/api';

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();

const buildExploreUrl = (category: string, keyword = '') => {
  const params = new URLSearchParams();
  const trimmedKeyword = keyword.trim();

  if (trimmedKeyword) params.set('q', trimmedKeyword);
  if (category !== 'Tất cả') params.set('category', category);

  const query = params.toString();
  return query ? `/explore?${query}` : '/explore';
};

export function HomePage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const categoryFromRoute = params.categoryName ? decodeURIComponent(params.categoryName) : '';
  const categoryFromQuery = searchParams.get('category') || '';
  const categoryFromUrl = categoryFromRoute || categoryFromQuery || 'Tất cả';
  const searchFromUrl = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  // Danh sách truyện: tải từ backend, fallback về mock nếu lỗi/không có dữ liệu.
  const [comics, setComics] = useState<UiComic[]>(mockComics as unknown as UiComic[]);
  const featuredComic = comics[2] ?? comics[0];
  // featuredComic có thể undefined khi backend chưa load — JSX phía dưới có guard.

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
    setSearchTerm(searchFromUrl);
  }, [categoryFromUrl, searchFromUrl]);

  useEffect(() => {
    let active = true;
    comicApi
      .list()
      .then((data) => {
        if (active && data.length) setComics(data.map(mapComic));
      })
      .catch(() => {
        /* giữ nguyên mock khi backend chưa sẵn sàng */
      });
    return () => {
      active = false;
    };
  }, []);

  const categoryCounts = useMemo(() => {
    return categories.reduce<Record<string, number>>((acc, category) => {
      acc[category] = category === 'Tất cả'
        ? comics.length
        : comics.filter((comic) => comic.genres.some((genre) => normalizeText(genre) === normalizeText(category))).length;
      return acc;
    }, {});
  }, [comics]);

  const filteredComics = useMemo(() => {
    const normalizedCategory = normalizeText(selectedCategory);
    const keyword = normalizeText(searchTerm);

    return comics.filter((comic) => {
      const matchCategory = selectedCategory === 'Tất cả' || comic.genres.some((genre) => normalizeText(genre) === normalizedCategory);
      const searchableText = normalizeText([
        comic.title,
        comic.author,
        comic.description,
        ...comic.genres
      ].join(' '));
      const matchSearch = !keyword || searchableText.includes(keyword);
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchTerm, comics]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const clearFilters = () => {
    setSelectedCategory('Tất cả');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-background to-secondary/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920')] opacity-5 bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="hot" className="inline-flex">
                <Sparkles className="w-3 h-3 mr-1" />
                Nền tảng webtoon hàng đầu
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Đọc truyện bản quyền theo cách{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  linh hoạt hơn
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Mua chương lẻ, thuê truyện 24h, ủng hộ tác giả và tận hưởng cộng đồng đọc truyện tương tác.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/explore">
                  <Button size="lg">
                    Khám phá truyện
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/creator/register">
                  <Button variant="ghost" size="lg">
                    Trở thành tác giả
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl rounded-full" />
              {featuredComic && (
              <Link to={`/comic/${featuredComic.id}`}>
                <div className="relative bg-card border border-border rounded-3xl p-3 overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all hover:-translate-y-2 group">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl">
                    <ImageWithFallback
                      src={featuredComic.cover}
                      alt={featuredComic.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-3 rounded-2xl bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 p-5 space-y-2">
                    <Badge variant="premium">PREMIUM</Badge>
                    <h3 className="text-2xl font-bold text-white">{featuredComic.title}</h3>
                    <p className="text-white/80">{featuredComic.author}</p>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        {featuredComic.rating}
                      </span>
                      <span>{featuredComic.chapters} chương</span>
                    </div>
                  </div>
                </div>
              </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Search & Categories */}
        <section className="grid lg:grid-cols-[1fr_2fr] gap-6 items-start">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">Tìm kiếm & duyệt truyện</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Tìm theo tên truyện, tác giả hoặc thể loại. Bộ lọc chạy trực tiếp trên client, click danh mục không tải lại trang.
            </p>
            <SearchBar value={searchTerm} onSearch={handleSearch} placeholder="Tìm truyện, tác giả, thể loại..." />

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="free">Miễn phí</Badge>
              <Badge variant="premium">Premium</Badge>
              <Badge variant="locked">Trả coin</Badge>
            </div>

            <div className="mt-5 rounded-xl bg-muted/30 border border-border p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Đang lọc</p>
                  <p className="font-semibold text-foreground">
                    {selectedCategory}{searchTerm ? ` · “${searchTerm}”` : ''}
                  </p>
                </div>
                {(selectedCategory !== 'Tất cả' || searchTerm) && (
                  <button onClick={clearFilters} className="text-xs inline-flex items-center gap-1 text-primary hover:underline">
                    <X className="w-3 h-3" /> Xóa lọc
                  </button>
                )}
              </div>
              <div className="h-2 bg-background/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${Math.max(8, (filteredComics.length / Math.max(comics.length, 1)) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Tìm thấy {filteredComics.length}/{comics.length} truyện phù hợp.</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold">Danh mục</h2>
              <span className="text-sm text-muted-foreground hidden sm:inline">Click danh mục để lọc ngay, không reload trang</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-5 py-4 rounded-xl font-semibold transition-all text-left border ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-primary'
                      : 'bg-card border-border text-foreground hover:border-primary/50 hover:bg-muted/30'
                  }`}
                >
                  <span className="block">{category}</span>
                  <span className={`text-xs ${selectedCategory === category ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {categoryCounts[category] || 0} truyện
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Comics */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">
                {selectedCategory === 'Tất cả' ? 'Đang thịnh hành' : `Truyện thuộc danh mục ${selectedCategory}`}
              </h2>
            </div>
            <Link to={buildExploreUrl(selectedCategory, searchTerm)} className="text-primary hover:underline">Xem tất cả</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredComics.map((comic) => (
              <ComicCard key={comic.id} {...comic} />
            ))}
          </div>
          {filteredComics.length === 0 && (
            <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
              Không tìm thấy truyện phù hợp. Hãy thử từ khóa hoặc danh mục khác.
            </div>
          )}
        </section>

        {/* New Updates */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-bold">Truyện mới cập nhật theo bộ lọc</h2>
            </div>
            <Link to="/new" className="text-primary hover:underline">Xem tất cả</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredComics.slice(0, 6).map((comic) => (
              <ComicCard key={comic.id} {...comic} />
            ))}
          </div>
        </section>

        {/* Featured Creators */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-warning" />
              <h2 className="text-2xl font-bold">Creator nổi bật</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {mockCreators.map((creator) => (
              <div key={creator.id} className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <img src={creator.avatar} alt={creator.name} className="w-16 h-16 rounded-full bg-muted" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{creator.name}</h3>
                      {creator.verified && (
                        <Badge variant="success" className="text-xs">✓</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{creator.followers.toLocaleString()} người theo dõi</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">{creator.totalWorks} tác phẩm</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
