import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CheckCircle, ClipboardCheck, LogIn, PlayCircle, Shield, User, Crown, Database, Compass, TrendingUp, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
// import { demoAccounts, mockFunctionTestMatrix } from '../data/mockData';
const demoAccounts: any[] = [];
const mockFunctionTestMatrix: any[] = [];
import { getMockSession, quickLogin, roleLabel, type MockSession } from '../lib/mockAuth';

const iconByRole = {
  reader: User,
  author: Crown,
  admin: Shield
};

export function DemoTestCenterPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<MockSession | null>(null);

  useEffect(() => {
    setSession(getMockSession());
  }, []);

  const loginAndOpen = (role: 'reader' | 'author' | 'admin', route: string) => {
    const nextSession = quickLogin(role);
    setSession(nextSession);
    navigate(route);
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <Badge variant="success" className="mb-4"><ClipboardCheck className="w-3 h-3 mr-1" /> TEST CENTER</Badge>
            <h1 className="text-4xl font-bold mb-3">Checklist kiểm thử chức năng với mock data</h1>
            <p className="text-muted-foreground max-w-3xl">
              Trang này gom toàn bộ account, route và dữ liệu test để kiểm tra nhanh từng module Reader, Author và Admin.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/login"><Button variant="ghost"><LogIn className="w-5 h-5 mr-2" />Đăng nhập demo</Button></Link>
            {session && <Link to="/profile"><Button>Profile hiện tại</Button></Link>}
          </div>
        </div>

        <Card className="bg-muted/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Session hiện tại</h2>
              {session ? (
                <p className="text-muted-foreground">{session.name} · {session.email} · {roleLabel(session.role)}</p>
              ) : (
                <p className="text-muted-foreground">Chưa đăng nhập. Có thể bấm “Login & mở” ở từng vai trò bên dưới.</p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {demoAccounts.map((account) => (
                <Button key={account.id} variant="ghost" size="sm" onClick={() => loginAndOpen(account.role, '/')}>Login {roleLabel(account.role)}</Button>
              ))}
            </div>
          </div>
        </Card>


        <Card className="border-primary/30 bg-primary/5">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
              <Filter className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Checklist test mới: Khám phá, Thịnh hành, Danh mục</h2>
              <p className="text-sm text-muted-foreground">
                Mục tiêu là kiểm tra 2 trang có chức năng khác nhau và đảm bảo lọc danh mục chạy client-side, không tải lại trang.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/explore" className="rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Compass className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Khám phá</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Test search, lọc danh mục, lọc trạng thái và sort toàn bộ kho truyện.</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li>Click Fantasy/Hài hước không reload trang.</li>
                <li>Search “Long” giữ kết quả đúng.</li>
                <li>Sort theo views/rating/chapters.</li>
              </ul>
            </Link>
            <Link to="/trending" className="rounded-2xl border border-border bg-card p-4 hover:border-warning/40 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-warning" />
                <h3 className="font-bold">Thịnh hành</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Test bảng xếp hạng hot theo điểm thịnh hành demo.</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li>Có Top #1 và thứ hạng #1, #2, #3.</li>
                <li>Lọc theo 24h/7d/30d.</li>
                <li>Lọc danh mục không reload trang.</li>
              </ul>
            </Link>
          </div>
        </Card>

        <div className="grid gap-6">
          {mockFunctionTestMatrix.map((group) => {
            const Icon = iconByRole[group.role];
            const account = demoAccounts.find((item) => item.role === group.role)!;
            return (
              <Card key={group.role} className="overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h2 className="text-2xl font-bold">{group.label}</h2>
                        <Badge variant="primary">{account.email}</Badge>
                        <Badge variant="owned">password: {account.password}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{account.bio}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <Button variant="ghost" onClick={() => loginAndOpen(group.role, group.route)}>
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Login & mở dashboard
                    </Button>
                    <Link to={group.route}><Button>Đi tới màn hình</Button></Link>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {group.functions.map((item) => (
                    <Link key={item.name} to={item.route} className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-all block">
                      <div className="flex items-start gap-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                      </div>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <p>Route: <span className="font-semibold text-foreground">{item.route}</span></p>
                        <p className="flex items-center gap-1"><Database className="w-3 h-3" /> {item.data}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        <Card>
          <h2 className="text-xl font-bold mb-4">Gợi ý kịch bản test nhanh</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-muted/20 border border-border">
              <h3 className="font-bold mb-2">1. Test Reader</h3>
              <p className="text-muted-foreground">Login Reader → tìm “Long” → vào detail → mở chương lock → kiểm tra coin/premium → đọc chương → bình luận → về Library xem tiến độ.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/20 border border-border">
              <h3 className="font-bold mb-2">2. Test Author</h3>
              <p className="text-muted-foreground">Login Author → vào Creator Dashboard → kiểm tra series, draft upload, analytics, doanh thu, blog, inbox bình luận và báo cáo bản quyền.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/20 border border-border">
              <h3 className="font-bold mb-2">3. Test Admin</h3>
              <p className="text-muted-foreground">Login Admin → duyệt nội dung → xử lý report → quản lý user → kiểm tra payout → featured → vào cấu hình hệ thống.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
