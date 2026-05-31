import { useEffect, useState } from 'react';
import { Coins, CreditCard, Smartphone, Building, ChevronRight, TrendingUp, TrendingDown, Plus, ReceiptText, ShieldCheck, Clock, Copy } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { paymentApi, type PaymentResponse } from '../lib/api';
// import { coinPackages, mockCoinPurchaseAuditTrail, mockTransactions } from '../data/mockData';
const coinPackages: any[] = [];
import { getMockSession } from '../lib/mockAuth';

export function WalletPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userCoins, setUserCoins] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState('momo');
  const [history, setHistory] = useState<PaymentResponse[]>([]);

  useEffect(() => {
    const session = getMockSession();
    if (session) setUserCoins(session.coins);

    paymentApi.getHistory()
      .then(setHistory)
      .catch(console.error);
  }, []);

  const paymentMethods = [
    { id: 'momo', name: 'MoMo', icon: Smartphone, color: 'text-[#D82D8B]' },
    { id: 'bank', name: 'Thẻ ngân hàng', icon: Building, color: 'text-success' }
  ];

  const handlePurchase = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowPaymentModal(true);
  };

  const successAudit = history.filter((item) => item.status === 'SUCCESS');
  const totalPaidVnd = successAudit.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary/20 via-card to-secondary/20 border-primary/30">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center">
            <div className="text-center lg:text-left space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl">
                <Coins className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Số dư Coin hiện tại</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {userCoins}
                </p>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Coin dùng để mua chương, thuê truyện hoặc ủng hộ tác giả. Mỗi lần nạp sẽ có mã đơn, cổng thanh toán, trạng thái thực tế.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-background/60 border border-border p-4">
                <ReceiptText className="w-5 h-5 text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Đơn thành công</p>
                <p className="text-2xl font-bold">{successAudit.length}</p>
              </div>
              <div className="rounded-xl bg-background/60 border border-border p-4">
                <CreditCard className="w-5 h-5 text-success mb-2" />
                <p className="text-xs text-muted-foreground">Tổng đã thanh toán</p>
                <p className="text-2xl font-bold">{totalPaidVnd.toLocaleString()}đ</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Coin Packages (Mocked for UI) */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Gói nạp Coin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: '1', coins: 100, price: 10000, bonus: 0 },
              { id: '2', coins: 550, price: 50000, bonus: 50, popular: true },
              { id: '3', coins: 1150, price: 100000, bonus: 150 },
              { id: '4', coins: 2400, price: 200000, bonus: 400 }
            ].map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative ${pkg.popular ? 'border-primary/50 shadow-xl shadow-primary/20' : ''}`}
                hover
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="hot">PHỔ BIẾN</Badge>
                  </div>
                )}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl">
                    <Coins className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{pkg.coins}</p>
                    <p className="text-sm text-muted-foreground">Coin</p>
                    {pkg.bonus > 0 && (
                      <Badge variant="success" className="mt-2">
                        <Plus className="w-3 h-3 mr-1" />
                        {pkg.bonus} Bonus
                      </Badge>
                    )}
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-2xl font-bold text-primary mb-4">
                      {pkg.price.toLocaleString()}đ
                    </p>
                    <Button
                      variant={pkg.popular ? 'primary' : 'secondary'}
                      className="w-full"
                      onClick={() => handlePurchase(pkg.id)}
                    >
                      Nạp ngay
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Real Payment History */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Lịch sử giao dịch thật</h2>
              <p className="text-sm text-muted-foreground mt-1">Dữ liệu đối soát từ Backend: mã đơn, cổng thanh toán, thời gian.</p>
            </div>
            <Badge variant="primary">Real-time data</Badge>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            {history.map((item) => (
              <Card key={item.id} className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Mã đơn hàng</p>
                    <p className="font-bold text-sm flex items-center gap-2 break-all">{item.orderId}<Copy className="w-3 h-3 text-muted-foreground" /></p>
                  </div>
                  <Badge variant={item.status === 'SUCCESS' ? 'success' : item.status === 'PENDING' ? 'warning' : 'danger'}>
                    {item.status === 'SUCCESS' ? 'Thành công' : item.status === 'PENDING' ? 'Chờ xử lý' : 'Thất bại'}
                  </Badge>
                </div>

                <div className="rounded-xl bg-muted/30 border border-border p-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Loại:</span>
                    <span className="font-semibold text-right">{item.targetName || item.targetType}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Thanh toán:</span>
                    <span className="font-semibold">{item.amount.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Cổng:</span>
                    <span className="font-semibold">{item.paymentMethod}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <p><span className="text-foreground font-semibold">Ngày tạo:</span> {new Date(item.createdAt).toLocaleString()}</p>
                </div>
              </Card>
            ))}
            {history.length === 0 && (
              <div className="lg:col-span-3 py-12 text-center text-muted-foreground">
                Bạn chưa có giao dịch nào trên hệ thống.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-6">Chọn phương thức thanh toán</h3>

            {(() => {
              const pkg = coinPackages.find((p) => p.id === selectedPackage)!;
              const orderCode = `IVC-DEMO-${new Date().getFullYear()}-${pkg.id.padStart(4, '0')}`;
              return (
                <div className="bg-muted/30 rounded-xl p-4 mb-6 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã đơn mock:</span>
                    <span className="font-semibold">{orderCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gói Coin:</span>
                    <span className="font-semibold">{pkg.coins} Coin</span>
                  </div>
                  {pkg.bonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bonus:</span>
                      <span className="font-semibold text-success">+{pkg.bonus} Coin</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số dư sau nạp:</span>
                    <span className="font-semibold text-primary">{userCoins + pkg.coins + pkg.bonus} Coin</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t border-border">
                    <span className="text-muted-foreground">Tổng thanh toán:</span>
                    <span className="font-bold text-primary">{pkg.price.toLocaleString()}đ</span>
                  </div>
                </div>
              );
            })()}

            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedMethod === method.id ? 'bg-primary/10 border-primary/50' : 'bg-muted/30 hover:bg-muted/50 border-border hover:border-primary/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <method.icon className={`w-6 h-6 ${method.color}`} />
                    <span className="font-semibold">{method.name}</span>
                  </div>
                  {selectedMethod === method.id ? <ShieldCheck className="w-5 h-5 text-success" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                </button>
              ))}
            </div>

            {/* <div className="rounded-xl bg-warning/10 border border-warning/30 p-4 mb-6 text-sm text-muted-foreground flex gap-3">
              <Clock className="w-5 h-5 text-warning flex-shrink-0" />
              <p>Sau khi thanh toán thật, backend cần lưu orderCode, providerTransactionId, paymentMethod, số dư trước/sau và trạng thái đối soát.</p>
            </div> */}

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setShowPaymentModal(false)}>
                Hủy
              </Button>
              <Button className="flex-1" onClick={() => setShowPaymentModal(false)}>
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
