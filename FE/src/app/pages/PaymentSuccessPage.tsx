import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { userApi } from '../lib/api';
import { apiRoleToDemoRole, setRealSession } from '../lib/mockAuth';

// MoMo redirect về kèm các query: partnerCode, orderId, requestId, amount,
export function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const [now, setNow] = useState(Date.now());
  const [isSyncing, setIsSyncing] = useState(false);

  const resultCode = params.get('resultCode');
  const status = useMemo<'success' | 'fail' | 'pending'>(() => {
    if (resultCode === null) return 'pending';
    return resultCode === '0' ? 'success' : 'fail';
  }, [resultCode]);

  // Đồng bộ lại thông tin user khi thanh toán thành công
  useEffect(() => {
    if (status === 'success') {
      setIsSyncing(true);
      const sync = async () => {
        try {
          const user = await userApi.getMe();
          setRealSession({
            email: user.email,
            role: apiRoleToDemoRole(user.role),
            name: user.username,
            coins: user.coins
          });
          // Gọi thêm getMyChapters để warm up backend/cache nếu cần
          await userApi.getMyChapters();
        } catch (err) {
          console.error('Lỗi đồng bộ sau thanh toán:', err);
        } finally {
          setIsSyncing(false);
        }
      };
      sync();
    }
  }, [status]);

  const amount = params.get('amount');
  const orderId = params.get('orderId');
  const orderInfo = params.get('orderInfo');
  const message = params.get('message');

  const config = {
    success: {
      title: 'Thanh toán thành công',
      desc: 'MoMo đã ghi nhận giao dịch. Hệ thống sẽ kích hoạt gói/chương ngay sau khi nhận IPN.',
      icon: CheckCircle,
      tone: 'success' as const,
    },
    fail: {
      title: 'Thanh toán thất bại',
      desc: message || 'Giao dịch không hoàn tất hoặc đã bị hủy. Bạn có thể thử lại hoặc chọn một gói khác.',
      icon: XCircle,
      tone: 'error' as const,
    },
    pending: {
      title: 'Đang chờ kết quả',
      desc: 'Không tìm thấy thông tin giao dịch trong URL. Nếu vừa thanh toán xong, vui lòng chờ vài giây hoặc kiểm tra lại trên ứng dụng MoMo.',
      icon: Clock,
      tone: 'warning' as const,
    },
  }[status];

  const Icon = config.icon;
  const returnUrl = localStorage.getItem('payment_return_url');

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <Card className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-${config.tone}/10 mb-6`}>
            <Icon className={`w-12 h-12 text-${config.tone}`} />
          </div>
          <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
          <p className="text-muted-foreground">{config.desc}</p>

          {isSyncing && (
            <div className="mt-4 flex items-center justify-center gap-2 text-primary animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Đang cập nhật số dư và nội dung...</span>
            </div>
          )}

          {(amount || orderId || orderInfo) && (
            <div className="mt-6 text-left bg-muted/30 rounded-xl p-4 space-y-2 text-sm">
              {orderInfo && (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Nội dung:</span>
                  <span className="font-semibold text-right">{orderInfo}</span>
                </div>
              )}
              {amount && (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Số tiền:</span>
                  <span className="font-semibold">{Number(amount).toLocaleString()}đ</span>
                </div>
              )}
              {orderId && (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Mã đơn:</span>
                  <span className="font-mono text-xs break-all text-right">{orderId}</span>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Trạng thái:</span>
                <Badge variant={config.tone}>{status.toUpperCase()}</Badge>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {returnUrl && status === 'success' && (
              <Link to={returnUrl}>
                <Button className="w-full sm:w-auto">Tiếp tục xem truyện</Button>
              </Link>
            )}
            
            {(status === 'fail' || status === 'pending') && (
              <Link to="/premium">
                <Button className="w-full sm:w-auto">Thử lại / Chọn gói khác</Button>
              </Link>
            )}

            {status === 'success' && (
              <Link to="/premium">
                <Button variant="ghost" className="w-full sm:w-auto">Xem gói Premium</Button>
              </Link>
            )}

            <Link to="/">
              <Button variant={(returnUrl && status === 'success') || status === 'fail' ? "ghost" : "default"} className="w-full sm:w-auto">
                Về trang chủ
              </Button>
            </Link>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Trang hiển thị tại {new Date(now).toLocaleString('vi-VN')}. Nếu giao dịch chưa được ghi nhận sau vài phút, liên hệ hỗ trợ.
        </p>
      </div>
    </div>
  );
}
