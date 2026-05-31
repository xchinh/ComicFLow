import { Link, useParams } from 'react-router';
import { ArrowLeft, BookOpen, CalendarDays, Eye, Heart, MessageCircle, PenLine, Share2, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getPublicBlogPostById, getPublicBlogPosts } from '../lib/blogStore';

export function BlogDetailPage() {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const post = getPublicBlogPostById(id);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return getPublicBlogPosts()
      .filter((item) => item.id !== post.id && (item.authorName === post.authorName || item.category === post.category))
      .slice(0, 3);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center py-12">
            <h1 className="text-2xl font-bold">Không tìm thấy bài viết</h1>
            <p className="mt-2 text-muted-foreground">Bài blog có thể đã bị xóa hoặc chưa được đăng công khai.</p>
            <Link to="/blog" className="mt-6 inline-flex">
              <Button>Quay lại Blog</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const likeCount = post.likes + (liked ? 1 : 0);

  return (
    <div className="min-h-screen pb-16">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Quay lại Blog
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setLiked((current) => !current)}>
              <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current text-error' : ''}`} />
              {likeCount.toLocaleString('vi-VN')}
            </Button>
            <Button variant="ghost">
              <Share2 className="w-4 h-4 mr-2" />
              Chia sẻ
            </Button>
          </div>
        </div>

        <article className="space-y-8">
          <header className="text-center max-w-4xl mx-auto">
            <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="secondary">{post.category}</Badge>
              {post.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-lg border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground">#{tag}</span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{post.title}</h1>
            <p className="mt-5 text-lg text-muted-foreground leading-8">{post.excerpt}</p>

            <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <img src={post.authorAvatar} alt={post.authorName} className="h-14 w-14 rounded-2xl bg-muted" />
              <div className="text-center sm:text-left">
                <p className="font-bold flex items-center justify-center gap-2 sm:justify-start"><UserRound className="w-4 h-4" /> {post.authorName}</p>
                <p className="text-sm text-muted-foreground">{post.authorBio}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {post.publishedAt}</span>
              <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {post.readingTime}</span>
              <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> {post.views} lượt xem</span>
              <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> {post.comments} bình luận</span>
            </div>
          </header>

          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-primary/5">
            <div className="aspect-[16/8] min-h-[280px] bg-muted">
              <ImageWithFallback src={post.coverUrl} alt={post.title} className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <Card>
              <div
                className="blog-public-content prose prose-invert max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            </Card>

            <aside className="space-y-5 lg:sticky lg:top-24">
              <Card>
                <h2 className="text-lg font-bold mb-4">Thông tin bài viết</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3 rounded-xl bg-muted/30 px-4 py-3">
                    <span className="text-muted-foreground">Tác giả</span>
                    <span className="font-semibold text-right">{post.authorName}</span>
                  </div>
                  <div className="flex justify-between gap-3 rounded-xl bg-muted/30 px-4 py-3">
                    <span className="text-muted-foreground">Bộ truyện</span>
                    <Link to={`/comic/${post.authorComicId}`} className="font-semibold text-primary text-right hover:underline">{post.authorComicTitle}</Link>
                  </div>
                  <div className="flex justify-between gap-3 rounded-xl bg-muted/30 px-4 py-3">
                    <span className="text-muted-foreground">Lượt thích</span>
                    <span className="font-semibold">{likeCount.toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between gap-3 rounded-xl bg-muted/30 px-4 py-3">
                    <span className="text-muted-foreground">Trạng thái</span>
                    <Badge variant="success">Đã đăng</Badge>
                  </div>
                </div>
                <Link to={`/comic/${post.authorComicId}`} className="mt-5 flex">
                  <Button variant="secondary" className="w-full">
                    Xem truyện liên quan
                  </Button>
                </Link>
              </Card>

              <Card>
                <h2 className="text-lg font-bold mb-3">Tương tác độc giả</h2>
                <p className="text-sm text-muted-foreground leading-6">Khu vực bình luận blog sẽ kết nối backend thật sau này. Bản demo hiện hiển thị số bình luận và lượt thích mock.</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button variant={liked ? 'secondary' : 'ghost'} onClick={() => setLiked((current) => !current)}>
                    <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} /> Thích
                  </Button>
                  <Button variant="ghost">
                    <MessageCircle className="w-4 h-4 mr-2" /> Bình luận
                  </Button>
                </div>
              </Card>
            </aside>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">Bài viết liên quan</h2>
              <Link to="/blog" className="text-sm font-semibold text-primary hover:underline">Xem tất cả</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((item) => (
                <Card key={item.id} className="p-0 overflow-hidden">
                  <Link to={`/blog/${item.id}`} className="block aspect-[16/10] bg-muted">
                    <ImageWithFallback src={item.coverUrl} alt={item.title} className="h-full w-full object-cover" />
                  </Link>
                  <div className="p-5">
                    <Badge variant="secondary">{item.category}</Badge>
                    <Link to={`/blog/${item.id}`}>
                      <h3 className="mt-3 text-lg font-bold leading-snug hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                    </Link>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
