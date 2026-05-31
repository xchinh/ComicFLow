import { Link, useSearchParams } from 'react-router';
import { BookOpen, CalendarDays, Eye, MessageCircle, PenLine, Search, Sparkles, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getPublicBlogPosts } from '../lib/blogStore';

export function BlogListPage() {
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get('q') || '';
  const [keyword, setKeyword] = useState(initialKeyword);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const posts = getPublicBlogPosts();

  const categories = useMemo(() => ['Tất cả', ...Array.from(new Set(posts.map((post) => post.category)))], [posts]);

  const filteredPosts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return posts.filter((post) => {
      const matchCategory = activeCategory === 'Tất cả' || post.category === activeCategory;
      const matchKeyword = !normalizedKeyword || [post.title, post.excerpt, post.authorName, post.authorComicTitle, ...post.tags]
        .join(' ')
        .toLowerCase()
        .includes(normalizedKeyword);

      return matchCategory && matchKeyword;
    });
  }, [activeCategory, keyword, posts]);

  const featuredPost = filteredPosts[0] || posts[0];
  const remainingPosts = filteredPosts.filter((post) => post.id !== featuredPost?.id);

  return (
    <div className="min-h-screen pb-16">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/15 via-background to-secondary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_34%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
          <div className="max-w-3xl">
            <Badge variant="premium"><Sparkles className="w-3 h-3 mr-1" /> Author Blog</Badge>
            <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">
              Nhật ký tác giả & hậu trường sáng tác
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-8">
              Nơi độc giả đọc các bài viết từ creator: teaser chương mới, quá trình sáng tác, ghi chú nhân vật và câu chuyện phía sau mỗi bộ truyện.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold">Khám phá blog</h2>
              <p className="text-sm text-muted-foreground mt-1">Tìm theo tiêu đề, tác giả, tag hoặc tên truyện.</p>
            </div>
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm blog, tác giả, tag..."
                className="w-full rounded-2xl border border-border bg-input pl-11 pr-4 py-3 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${activeCategory === category ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted/20 hover:border-primary/40 hover:bg-muted'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </Card>

        {featuredPost && (
          <Card className="p-0 overflow-hidden">
            <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
              <Link to={`/blog/${featuredPost.id}`} className="block min-h-[320px] lg:min-h-[420px]">
                <ImageWithFallback src={featuredPost.coverUrl} alt={featuredPost.title} className="h-full w-full object-cover" />
              </Link>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="primary">Bài nổi bật</Badge>
                  <Badge variant="secondary">{featuredPost.category}</Badge>
                </div>
                <Link to={`/blog/${featuredPost.id}`}>
                  <h2 className="text-3xl font-bold leading-tight hover:text-primary transition-colors">{featuredPost.title}</h2>
                </Link>
                <p className="mt-4 text-muted-foreground leading-7 line-clamp-3">{featuredPost.excerpt}</p>

                <div className="mt-6 flex items-center gap-3">
                  <img src={featuredPost.authorAvatar} alt={featuredPost.authorName} className="h-11 w-11 rounded-xl bg-muted" />
                  <div>
                    <p className="font-semibold">{featuredPost.authorName}</p>
                    <p className="text-xs text-muted-foreground">Tác giả của {featuredPost.authorComicTitle}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {featuredPost.publishedAt}</span>
                  <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {featuredPost.readingTime}</span>
                  <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> {featuredPost.views}</span>
                  <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> {featuredPost.comments}</span>
                </div>

                <Link to={`/blog/${featuredPost.id}`} className="mt-7 inline-flex">
                  <Button>
                    Đọc bài viết
                    <PenLine className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingPosts.map((post) => (
            <Card key={post.id} className="p-0 overflow-hidden flex flex-col">
              <Link to={`/blog/${post.id}`} className="block aspect-[16/10] overflow-hidden bg-muted">
                <ImageWithFallback src={post.coverUrl} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </Link>
              <div className="p-5 flex flex-1 flex-col">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  {post.tags.slice(0, 1).map((tag) => (
                    <span key={tag} className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground">#{tag}</span>
                  ))}
                </div>
                <Link to={`/blog/${post.id}`}>
                  <h3 className="text-xl font-bold leading-snug hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                </Link>
                <p className="mt-3 text-sm text-muted-foreground leading-6 line-clamp-3">{post.excerpt}</p>

                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <img src={post.authorAvatar} alt={post.authorName} className="h-9 w-9 rounded-xl bg-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold flex items-center gap-1"><UserRound className="w-3 h-3" /> {post.authorName}</p>
                    <p className="text-xs text-muted-foreground">{post.readingTime} · {post.views} lượt xem</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <Card className="text-center py-12">
            <h3 className="text-xl font-bold">Chưa tìm thấy blog phù hợp</h3>
            <p className="text-muted-foreground mt-2">Thử đổi từ khóa hoặc chọn danh mục khác.</p>
          </Card>
        )}
      </main>
    </div>
  );
}
