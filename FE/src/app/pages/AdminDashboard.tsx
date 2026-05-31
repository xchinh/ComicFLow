import {
  Users,
  BookOpen,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Settings,
  CreditCard,
  Star,
  BarChart3,
  SlidersHorizontal,
  UserCog,
  TrendingUp,
  Eye,
  Wallet,
  Flag
} from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { StatCard } from '../components/dashboard/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useEffect, useState } from 'react';
import { dashboardApi, type DashboardResponse } from '../lib/api';

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getAdminStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pendingContent = [
    { id: '1', type: 'comic', title: 'Vùng Đất Quên Lãng', creator: 'An Nhiên Studio', submittedAt: '2026-05-06 08:30', chapters: 1, risk: 'Bản quyền artwork' },
    { id: '2', type: 'chapter', title: 'Long Hồn Ký - Chương 68', creator: 'Lam Comics', submittedAt: '2026-05-06 10:15', chapters: 1, risk: 'Bình thường' },
    { id: '3', type: 'comic', title: 'Ma Cảnh Kinh Thành', creator: 'Kira Nguyễn', submittedAt: '2026-05-05 22:45', chapters: 3, risk: 'Giới hạn độ tuổi' }
  ];

  const reports = [
    { id: '1', type: 'copyright', title: 'Học Viện Ánh Trăng - Chương 42', reporter: 'user_8429', reason: 'Nghi vấn vi phạm bản quyền artwork', status: 'pending', date: '2026-05-06 09:20' },
    { id: '2', type: 'content', title: 'Căn Phòng Số 17 - Chương 15', reporter: 'user_1247', reason: 'Nội dung không phù hợp độ tuổi', status: 'investigating', date: '2026-05-06 07:15' },
    { id: '3', type: 'copyright', title: 'Thành Phố Sau Cơn Mưa - Chương 8', reporter: 'user_9631', reason: 'Copy từ tác phẩm khác', status: 'resolved', date: '2026-05-05 18:30' }
  ];

  const recentTransactions = [
    { id: '1', user: 'Minh Anh', type: 'purchase', amount: 50000, coins: 550, method: 'MoMo', status: 'success', date: '2026-05-06 11:25' },
    { id: '2', user: 'Hoàng Long', type: 'spend', description: 'Mua chương', amount: 15, status: 'success', date: '2026-05-06 11:18' },
    { id: '3', user: 'Thu Hà', type: 'purchase', amount: 100000, coins: 1150, method: 'VNPay', status: 'success', date: '2026-05-06 10:55' },
    { id: '4', user: 'Đức Anh', type: 'refund', description: 'Hoàn Coin', amount: 30, status: 'pending', date: '2026-05-06 10:30' }
  ];

  const users = [
    { id: '1', name: 'Minh Anh', email: 'minh***@gmail.com', role: 'reader', joined: '2026-01-15', spent: 2500000, status: 'active' },
    { id: '2', name: 'An Nhiên Studio', email: 'an***@studio.com', role: 'creator', joined: '2025-08-20', earned: 22300000, status: 'active' },
    { id: '3', name: 'Hoàng Long', email: 'hoang***@gmail.com', role: 'reader', joined: '2026-03-10', spent: 850000, status: 'active' },
    { id: '4', name: 'Mộc Miên Team', email: 'team***@comic.vn', role: 'creator', joined: '2025-12-02', earned: 5200000, status: 'review' }
  ];

  const featuredComics = [
    { slot: 'Hero', title: 'Long Hồn Ký', reason: 'Premium conversion cao', status: 'Đang featured', until: '2026-05-12' },
    { slot: 'Trending', title: 'Học Viện Ánh Trăng', reason: 'Retention 78%', status: 'Đang featured', until: '2026-05-10' },
    { slot: 'New Creator', title: 'Vùng Đất Quên Lãng', reason: 'Chờ duyệt', status: 'Nháp', until: '-' }
  ];

  const payoutQueue = [
    { creator: 'An Nhiên Studio', amount: 15610000, method: 'Bank Transfer', status: 'Sẵn sàng duyệt' },
    { creator: 'Lam Comics', amount: 8410000, method: 'Bank Transfer', status: 'Chờ đối soát' },
    { creator: 'Kira Nguyễn', amount: 3920000, method: 'MoMo Business', status: 'Đã thanh toán' }
  ];

  const analyticsData = [
    { date: '30/4', users: 12000, revenue: 6200000 },
    { date: '1/5', users: 13200, revenue: 7100000 },
    { date: '2/5', users: 12800, revenue: 6900000 },
    { date: '3/5', users: 15600, revenue: 8800000 },
    { date: '4/5', users: 14900, revenue: 8200000 },
    { date: '5/5', users: 17100, revenue: 9400000 },
    { date: '6/5', users: 18400, revenue: 10200000 }
  ];

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-error to-warning rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Quản trị nội dung, người dùng, doanh thu và cấu hình nền tảng InkVerse</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="ghost"><BarChart3 className="w-5 h-5 mr-2" />Xuất báo cáo</Button>
            <Link to="/admin/settings">
              <Button variant="secondary"><Settings className="w-5 h-5 mr-2" />Cấu hình hệ thống</Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Người dùng" value={stats ? stats.totalUsers.toLocaleString() : "..."} icon={Users} color="primary" />
          <StatCard title="Truyện" value={stats ? stats.totalComics.toLocaleString() : "..."} icon={BookOpen} color="secondary" />
          <StatCard title="Gói đăng ký" value={stats ? stats.totalSubscriptions.toLocaleString() : "..."} icon={Clock} color="warning" />
          <StatCard title="Doanh thu" value={stats ? `${stats.totalRevenue.toLocaleString()}đ` : "..."} icon={DollarSign} color="success" />
        </div>

        {/* Admin quick modules */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: UserCog, title: 'Quản lý người dùng', desc: 'Khóa/mở, đổi vai trò, kiểm tra lịch sử' },
            { icon: CreditCard, title: 'Doanh thu & thanh toán', desc: 'Nạp coin, hoàn tiền, payout creator' },
          ].map((item) => (
            <Card key={item.title} hover className="p-5">
              <item.icon className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
