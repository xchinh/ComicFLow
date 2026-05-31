import { useState } from 'react';
import { Link } from 'react-router';
import { BookOpen, Clock, Heart, Download, Filter, Trash2, Eye, Crown, CalendarClock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
// import { mockComics, mockPremiumSubscription } from '../data/mockData';
const mockComics: any[] = [];
const mockPremiumSubscription: any = {
  planName: '',
  remainingReads: 0,
  usedThisMonth: 0,
  monthlyReadLimit: 1,
  resetAt: '',
};
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'reading' | 'bookmarks' | 'downloaded' | 'history'>('reading');

  const readingList = [
    { ...mockComics[0], lastRead: 'Chương 5', progress: 11, total: 45, lastReadTime: '2 giờ trước', bookmark: true },
    { ...mockComics[2], lastRead: 'Chương 15', progress: 15, total: 67, lastReadTime: '1 ngày trước', bookmark: true },
    { ...mockComics[3], lastRead: 'Chương 8', progress: 8, total: 28, lastReadTime: '3 ngày trước', bookmark: false }
  ];

  const bookmarks = [
    { ...mockComics[1], addedAt: '2026-05-05', note: 'Cảnh cuối chương 12 quá đẹp!' },
    { ...mockComics[4], addedAt: '2026-05-03', note: '' },
    { ...mockComics[5], addedAt: '2026-05-01', note: 'Đợi update chương mới' }
  ];

  const downloadedComics = [
    { ...mockComics[0], chaptersDownloaded: 10, downloadDate: '2026-05-06', size: '125 MB' },
    { ...mockComics[2], chaptersDownloaded: 5, downloadDate: '2026-05-04', size: '68 MB' }
  ];

  const readingHistory = [
    { ...mockComics[0], chapter: 5, title: 'Chương 5: Cuộc đối đầu', readAt: '2026-05-06 14:30' },
    { ...mockComics[2], chapter: 15, title: 'Chương 15: Bí mật hắc ám', readAt: '2026-05-05 22:15' },
    { ...mockComics[3], chapter: 8, title: 'Chương 8: Sự thật kinh hoàng', readAt: '2026-05-03 18:45' },
    { ...mockComics[1], chapter: 10, title: 'Chương 10: Tạm biệt', readAt: '2026-05-02 09:20' }
  ];

  const tabs = [
    { id: 'reading' as const, label: 'Đang đọc', icon: BookOpen, count: readingList.length },
    { id: 'bookmarks' as const, label: 'Đã lưu', icon: Heart, count: bookmarks.length },
    { id: 'downloaded' as const, label: 'Đã tải', icon: Download, count: downloadedComics.length },
    { id: 'history' as const, label: 'Lịch sử', icon: Clock, count: readingHistory.length }
  ];

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Thư viện</h1>
            <p className="text-muted-foreground">Quản lý truyện đang đọc và đã lưu</p>
          </div>
          <Button variant="ghost">
            <Filter className="w-5 h-5 mr-2" />
            Bộ lọc
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-warning/10 to-primary/10 border-warning/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="premium"><Crown className="w-3 h-3 mr-1" /> {mockPremiumSubscription.planName}</Badge>
                <Badge variant="success">Đang hoạt động</Badge>
              </div>
              <h2 className="text-xl font-bold">Bạn còn {mockPremiumSubscription.remainingReads} lượt đọc Premium trong tháng này</h2>
              <p className="text-sm text-muted-foreground mt-1">Đã dùng {mockPremiumSubscription.usedThisMonth}/{mockPremiumSubscription.monthlyReadLimit} lượt. Reset vào {mockPremiumSubscription.resetAt}.</p>
            </div>
            <div className="min-w-[220px]">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Quota tháng</span>
                <span className="flex items-center gap-1"><CalendarClock className="w-3 h-3" /> còn {mockPremiumSubscription.remainingReads}</span>
              </div>
              <div className="h-3 rounded-full bg-background/60 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-warning" style={{ width: `${Math.round((mockPremiumSubscription.usedThisMonth / mockPremiumSubscription.monthlyReadLimit) * 100)}%` }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-card border border-border text-foreground hover:border-primary/50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                <Badge variant={activeTab === tab.id ? 'free' : 'default'} className="ml-1">
                  {tab.count}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          {/* Reading List */}
          {activeTab === 'reading' && (
            <div className="space-y-4">
              {readingList.map((comic) => (
                <Card key={comic.id} hover>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <Link to={`/comic/${comic.id}`} className="lg:w-32 flex-shrink-0">
                      <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border">
                        <ImageWithFallback src={comic.cover} alt={comic.title} className="w-full h-full object-cover" />
                      </div>
                    </Link>
                    <div className="flex-1 space-y-4">
                      <div>
                        <Link to={`/comic/${comic.id}`}>
                          <h3 className="text-xl font-bold mb-1 hover:text-primary transition-colors">{comic.title}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{comic.author}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tiến độ</span>
                          <span className="font-semibold">
                            {comic.progress}/{comic.total} chương ({Math.round((comic.progress / comic.total) * 100)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                            style={{ width: `${(comic.progress / comic.total) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <Link to={`/read/${comic.id}/${comic.progress + 1}`}>
                          <Button>
                            <BookOpen className="w-4 h-4 mr-2" />
                            Đọc tiếp {comic.lastRead}
                          </Button>
                        </Link>
                        <span className="text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {comic.lastReadTime}
                        </span>
                        {comic.bookmark && (
                          <Badge variant="hot">
                            <Heart className="w-3 h-3 mr-1 fill-current" />
                            Đã lưu
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Bookmarks */}
          {activeTab === 'bookmarks' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((comic) => (
                <Card key={comic.id} hover>
                  <Link to={`/comic/${comic.id}`}>
                    <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border mb-4">
                      <ImageWithFallback src={comic.cover} alt={comic.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  </Link>
                  <div className="space-y-2">
                    <Link to={`/comic/${comic.id}`}>
                      <h3 className="font-bold hover:text-primary transition-colors line-clamp-1">{comic.title}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{comic.author}</p>
                    {comic.note && (
                      <p className="text-sm text-foreground bg-muted/30 rounded-lg p-2 italic">
                        "{comic.note}"
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">Lưu {comic.addedAt}</span>
                      <button className="text-error hover:text-error/80 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Downloaded */}
          {activeTab === 'downloaded' && (
            <div className="space-y-4">
              {downloadedComics.map((comic) => (
                <Card key={comic.id} hover>
                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                    <Link to={`/comic/${comic.id}`} className="lg:w-24 flex-shrink-0">
                      <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border">
                        <ImageWithFallback src={comic.cover} alt={comic.title} className="w-full h-full object-cover" />
                      </div>
                    </Link>
                    <div className="flex-1 space-y-2">
                      <Link to={`/comic/${comic.id}`}>
                        <h3 className="text-lg font-bold hover:text-primary transition-colors">{comic.title}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{comic.author}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <Badge variant="success">{comic.chaptersDownloaded} chương</Badge>
                        <span className="text-muted-foreground">{comic.size}</span>
                        <span className="text-muted-foreground">Tải {comic.downloadDate}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Xem offline
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              <Card className="bg-muted/30 border-dashed">
                <div className="text-center py-8">
                  <Download className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">Tính năng tải offline chỉ dành cho thành viên Premium</p>
                  <Link to="/premium">
                    <Button>Nâng cấp Premium</Button>
                  </Link>
                </div>
              </Card>
            </div>
          )}

          {/* History */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {readingHistory.map((item, index) => (
                <Link key={index} to={`/read/${item.id}/${item.chapter}`}>
                  <Card hover className="transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 rounded-lg overflow-hidden border border-border flex-shrink-0">
                        <ImageWithFallback src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {item.readAt}
                        </p>
                      </div>
                      <Badge variant="secondary">Chương {item.chapter}</Badge>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
