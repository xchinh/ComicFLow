import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { BookOpen, Coins, LogOut, Shield, User, CheckCircle, Clock, Bell, BookmarkCheck, Crown, ReceiptText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { userApi, subscriptionApi, paymentApi, type UserResponse, type UserSubscriptionResponse, type PaymentResponse } from '../lib/api';
// import { demoAccounts, mockCoinPurchaseAuditTrail, mockFollowedComics, mockPremiumSubscription, mockReadingProgress, mockUnlockedChapters } from '../data/mockData';
const demoAccounts: any[] = [];
const mockFollowedComics: any[] = [];
const mockReadingProgress: any[] = [];
const mockPremiumSubscription: any = {
  planName: '',
  remainingReads: 0,
  usedThisMonth: 0,
  monthlyReadLimit: 1,
  resetAt: '',
  lastPremiumRead: { comicTitle: '', chapterNumber: 0 },
};
import { clearMockSession, getMockSession, quickLogin, roleHome, roleLabel, type MockSession } from '../lib/mockAuth';

const routeByRole = {
  reader: '/',
  author: '/creator',
  admin: '/admin'
} as const;

export function ProfilePage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<MockSession | null>(null);
  const [realUser, setRealUser] = useState<UserResponse | null>(null);
  const [realSub, setRealSub] = useState<UserSubscriptionResponse | null>(null);
  const [history, setHistory] = useState<PaymentResponse[]>([]);
  const [myChapters, setMyChapters] = useState<string[]>([]);

  useEffect(() => {
    setSession(getMockSession());
    
    userApi.getMe()
      .then(setRealUser)
      .catch(() => {});

    subscriptionApi.getMySubscription()
      .then(setRealSub)
      .catch(() => {});

    paymentApi.getHistory()
      .then(setHistory)
      .catch(() => {});

    userApi.getMyChapters()
      .then(setMyChapters)
      .catch(() => {});
  }, []);

  const logout = () => {
    clearMockSession();
    setSession(null);
    navigate('/login');
  };

  const switchRole = (role: 'reader' | 'author' | 'admin') => {
    const nextSession = quickLogin(role);
    setSession(nextSession);
  };

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Card>
          <User className="w-14 h-14 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3">Chưa đăng nhập mock</h1>
          <p className="text-muted-foreground mb-6">Hãy đăng nhập demo để kiểm tra dữ liệu theo từng vai trò.</p>
          <Link to="/login"><Button>Đăng nhập demo</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img src={session.avatar} alt={session.name} className="w-20 h-20 rounded-2xl bg-muted" />
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h1 className="text-3xl font-bold">{realUser ? realUser.username : session.name}</h1>
                  <Badge variant="primary">{realUser ? realUser.role : roleLabel(session.role)}</Badge>
                  {(session.premium || realSub?.isActive) && <Badge variant="premium">Premium</Badge>}
                </div>
                <p className="text-muted-foreground">{realUser ? realUser.email : session.email}</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-3xl">{session.bio}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={roleHome(session.role)}><Button>Vào khu vực chức năng</Button></Link>
              <Button variant="ghost" onClick={logout}><LogOut className="w-5 h-5 mr-2" />Đăng xuất</Button>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <Coins className="w-6 h-6 text-warning mb-3" />
            <p className="text-sm text-muted-foreground">Coin khả dụng</p>
            <p className="text-3xl font-bold">{session.coins}</p>
          </Card>
          <Card>
            <Shield className="w-6 h-6 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Vai trò hiện tại</p>
            <p className="text-3xl font-bold">{realUser ? realUser.role : roleLabel(session.role)}</p>
          </Card>
          <Card>
            <CheckCircle className="w-6 h-6 text-success mb-3" />
            <p className="text-sm text-muted-foreground">Trạng thái Sub</p>
            <p className="text-3xl font-bold">{realSub?.isActive ? 'ACTIVE' : 'NONE'}</p>
          </Card>
          <Card>
            <Crown className="w-6 h-6 text-warning mb-3" />
            <p className="text-sm text-muted-foreground">Lượt Premium còn lại</p>
            <p className="text-3xl font-bold">{realSub ? realSub.chaptersRemaining : mockPremiumSubscription.remainingReads}</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.4fr] gap-6">
          <Card>
            <h2 className="text-xl font-bold mb-4">Chuyển nhanh vai trò</h2>
            <div className="space-y-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => switchRole(account.role)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${session.role === account.role ? 'border-primary bg-primary/10' : 'border-border bg-muted/20 hover:border-primary/40'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{account.name}</p>
                      <p className="text-xs text-muted-foreground">{account.email}</p>
                    </div>
                    <Badge variant={session.role === account.role ? 'primary' : 'default'}>{roleLabel(account.role)}</Badge>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-4">Checklist quyền của session hiện tại</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {session.permissions.map((permission) => (
                <div key={permission} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-sm font-medium">{permission}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <Card className="bg-gradient-to-br from-warning/10 to-primary/10 border-warning/30">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Crown className="w-5 h-5 text-warning" /> Quota Premium Reader</h2>
                <p className="text-sm text-muted-foreground mt-1">Hiển thị rõ số lượt đọc còn lại khi gói Premium bị giới hạn lượt xem.</p>
              </div>
              <Badge variant="premium">{mockPremiumSubscription.planName}</Badge>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="rounded-xl bg-background/60 border border-border p-3">
                <p className="text-xs text-muted-foreground">Còn lại</p>
                <p className="text-2xl font-bold text-primary">{mockPremiumSubscription.remainingReads}</p>
              </div>
              <div className="rounded-xl bg-background/60 border border-border p-3">
                <p className="text-xs text-muted-foreground">Đã dùng</p>
                <p className="text-2xl font-bold">{mockPremiumSubscription.usedThisMonth}</p>
              </div>
              <div className="rounded-xl bg-background/60 border border-border p-3">
                <p className="text-xs text-muted-foreground">Giới hạn</p>
                <p className="text-2xl font-bold">{mockPremiumSubscription.monthlyReadLimit}</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-background/60 overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-primary to-warning" style={{ width: `${Math.round((mockPremiumSubscription.usedThisMonth / mockPremiumSubscription.monthlyReadLimit) * 100)}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">Reset vào {mockPremiumSubscription.resetAt}. Lần đọc Premium gần nhất: {mockPremiumSubscription.lastPremiumRead.comicTitle} chương {mockPremiumSubscription.lastPremiumRead.chapterNumber}.</p>
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><ReceiptText className="w-5 h-5 text-primary" /> Lịch sử thanh toán</h2>
                <p className="text-sm text-muted-foreground mt-1">Thông tin phục vụ đối soát giao dịch và hỗ trợ người dùng.</p>
              </div>
              <Link to="/wallet"><Button size="sm" variant="secondary">Xem ví</Button></Link>
            </div>
            <div className="space-y-3">
              {history.slice(0, 5).map((item) => (
                <div key={item.id} className="rounded-xl bg-muted/30 border border-border p-3">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="font-semibold text-sm">{item.targetName || item.targetType}</p>
                    <Badge variant={item.status === 'SUCCESS' ? 'success' : item.status === 'PENDING' ? 'warning' : 'danger'}>
                      {item.status === 'SUCCESS' ? 'Thành công' : item.status === 'PENDING' ? 'Chờ xử lý' : 'Thất bại'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.paymentMethod} · {item.amount.toLocaleString()}đ</p>
                  <p className="text-xs text-muted-foreground">Mã đơn: {item.orderId} · {new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))}
              {history.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Chưa có giao dịch nào.</p>}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-4"><BookmarkCheck className="w-5 h-5 text-primary" /><h2 className="font-bold">Tiến độ đọc</h2></div>
            <div className="space-y-3">
              {mockReadingProgress.map((item) => (
                <Link key={`${item.comicId}-${item.chapterId}`} to={`/read/${item.comicId}/${item.chapterId}`} className="block p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/40">
                  <p className="font-semibold text-sm">{item.comicTitle}</p>
                  <p className="text-xs text-muted-foreground">Chương {item.chapterNumber} · {item.percent}%</p>
                </Link>
              ))}
              {mockReadingProgress.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Chưa có dữ liệu.</p>}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4"><Bell className="w-5 h-5 text-warning" /><h2 className="font-bold">Theo dõi & thông báo</h2></div>
            <div className="space-y-3">
              {mockFollowedComics.map((item) => (
                <Link key={item.comicId} to={`/comic/${item.comicId}`} className="block p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/40">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-sm">{item.title}</p>
                    <Badge variant={item.notify ? 'success' : 'default'}>{item.notify ? 'Bật' : 'Tắt'}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.unreadChapters} chương chưa đọc</p>
                </Link>
              ))}
              {mockFollowedComics.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Chưa theo dõi truyện nào.</p>}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4"><BookOpen className="w-5 h-5 text-secondary" /><h2 className="font-bold">Chương đã mở khóa</h2></div>
            <div className="space-y-3">
              <div className="p-4 bg-muted/30 rounded-xl border border-border text-center">
                <p className="text-2xl font-bold text-primary">{myChapters.length}</p>
                <p className="text-xs text-muted-foreground">Tổng số chương đã mua</p>
              </div>
              <p className="text-xs text-muted-foreground text-center italic">Danh sách chi tiết sẽ được cập nhật trong bản update tới.</p>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold mb-4">Đi nhanh đến luồng kiểm thử</h2>
          <div className="flex flex-wrap gap-3">
            <Link to={routeByRole[session.role]}><Button>Trang chính của vai trò</Button></Link>
            <Link to="/wallet"><Button variant="ghost">Wallet / Coin</Button></Link>
            <Link to="/premium"><Button variant="ghost">Premium</Button></Link>
            <Link to="/demo-test"><Button variant="ghost"><Clock className="w-5 h-5 mr-2" />Checklist test</Button></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
