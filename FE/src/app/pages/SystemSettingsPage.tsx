import { Save, AlertCircle, DollarSign, Mail, Bell, Shield, Database, Palette } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';

export function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'InkVerse',
    siteDescription: 'Nền tảng webtoon bản quyền hàng đầu',
    contactEmail: 'support@inkverse.com',
    maintenanceMode: false,
    registrationEnabled: true,
    commentsEnabled: true,

    coinPriceRate: 100,
    creatorRevenueShare: 70,
    premiumMonthlyPrice: 99000,
    premiumYearlyPrice: 990000,

    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,

    maxUploadSize: 50,
    allowedFileTypes: '.pdf,.zip,.jpg,.png',
    autoApproveCreators: false,
    contentModerationLevel: 'medium'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Cấu hình hệ thống</h1>
              <p className="text-muted-foreground">Quản lý các cài đặt toàn cục của nền tảng</p>
            </div>
          </div>
          <Button onClick={handleSave}>
            <Save className="w-5 h-5 mr-2" />
            {saved ? 'Đã lưu!' : 'Lưu thay đổi'}
          </Button>
        </div>

        {saved && (
          <Card className="bg-success/10 border-success/30">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-success" />
              <p className="font-semibold text-success">Đã lưu thay đổi thành công!</p>
            </div>
          </Card>
        )}

        {/* General Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Thông tin chung</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Tên website</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Mô tả website</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email liên hệ</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-border">
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-muted/30 rounded-xl">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-5 h-5 accent-primary"
                />
                <div>
                  <p className="font-semibold text-sm">Chế độ bảo trì</p>
                  <p className="text-xs text-muted-foreground">Tắt website tạm thời</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 bg-muted/30 rounded-xl">
                <input
                  type="checkbox"
                  checked={settings.registrationEnabled}
                  onChange={(e) => setSettings({ ...settings, registrationEnabled: e.target.checked })}
                  className="w-5 h-5 accent-primary"
                />
                <div>
                  <p className="font-semibold text-sm">Cho phép đăng ký</p>
                  <p className="text-xs text-muted-foreground">User mới đăng ký</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 bg-muted/30 rounded-xl">
                <input
                  type="checkbox"
                  checked={settings.commentsEnabled}
                  onChange={(e) => setSettings({ ...settings, commentsEnabled: e.target.checked })}
                  className="w-5 h-5 accent-primary"
                />
                <div>
                  <p className="font-semibold text-sm">Cho phép bình luận</p>
                  <p className="text-xs text-muted-foreground">User có thể comment</p>
                </div>
              </label>
            </div>
          </div>
        </Card>

        {/* Financial Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-success" />
            <h2 className="text-xl font-bold">Cài đặt tài chính</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Tỷ giá Coin (1 Coin = ? VNĐ)</label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.coinPriceRate}
                  onChange={(e) => setSettings({ ...settings, coinPriceRate: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">đ</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Chia sẻ doanh thu cho Creator (%)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.creatorRevenueShare}
                  onChange={(e) => setSettings({ ...settings, creatorRevenueShare: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Giá Premium tháng</label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.premiumMonthlyPrice}
                  onChange={(e) => setSettings({ ...settings, premiumMonthlyPrice: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">đ</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Giá Premium năm</label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.premiumYearlyPrice}
                  onChange={(e) => setSettings({ ...settings, premiumYearlyPrice: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">đ</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-warning" />
            <h2 className="text-xl font-bold">Cài đặt thông báo</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-muted/30 rounded-xl">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5 accent-primary"
              />
              <div>
                <Mail className="w-5 h-5 text-primary mb-1" />
                <p className="font-semibold text-sm">Email</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-4 bg-muted/30 rounded-xl">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                className="w-5 h-5 accent-primary"
              />
              <div>
                <Mail className="w-5 h-5 text-secondary mb-1" />
                <p className="font-semibold text-sm">SMS</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-4 bg-muted/30 rounded-xl">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                className="w-5 h-5 accent-primary"
              />
              <div>
                <Bell className="w-5 h-5 text-warning mb-1" />
                <p className="font-semibold text-sm">Push</p>
              </div>
            </label>
          </div>
        </Card>

        {/* Content Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-secondary" />
            <h2 className="text-xl font-bold">Cài đặt nội dung</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Kích thước upload tối đa (MB)</label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => setSettings({ ...settings, maxUploadSize: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Định dạng file cho phép</label>
              <input
                type="text"
                value={settings.allowedFileTypes}
                onChange={(e) => setSettings({ ...settings, allowedFileTypes: e.target.value })}
                className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground mt-1">Cách nhau bởi dấu phẩy</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Mức độ kiểm duyệt</label>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { id: 'low', label: 'Thấp', desc: 'Tự động duyệt hầu hết' },
                  { id: 'medium', label: 'Trung bình', desc: 'Kiểm tra một số' },
                  { id: 'high', label: 'Cao', desc: 'Kiểm tra tất cả' },
                ].map((opt) => {
                  const active = settings.contentModerationLevel === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSettings({ ...settings, contentModerationLevel: opt.id })}
                      className={`rounded-xl border p-3 text-left transition-all ${
                        active
                          ? 'border-primary bg-primary/10 text-primary shadow-md shadow-primary/10'
                          : 'border-border bg-muted/20 text-foreground hover:border-primary/40 hover:bg-muted/30'
                      }`}
                    >
                      <p className="font-semibold">{opt.label}</p>
                      <p className={`text-xs mt-1 ${active ? 'text-primary/80' : 'text-muted-foreground'}`}>{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-4 bg-muted/30 rounded-xl">
              <input
                type="checkbox"
                checked={settings.autoApproveCreators}
                onChange={(e) => setSettings({ ...settings, autoApproveCreators: e.target.checked })}
                className="w-5 h-5 accent-primary"
              />
              <div>
                <p className="font-semibold text-sm">Tự động duyệt Creator</p>
                <p className="text-xs text-muted-foreground">Không khuyến khích - nên kiểm tra thủ công</p>
              </div>
            </label>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-error/30 bg-error/5">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-error" />
            <h2 className="text-xl font-bold text-error">Vùng nguy hiểm</h2>
          </div>
          <div className="space-y-3">
            <Button variant="danger" className="w-full sm:w-auto">
              Xóa cache hệ thống
            </Button>
            <Button variant="danger" className="w-full sm:w-auto ml-0 sm:ml-3">
              Khởi động lại server
            </Button>
            <Button variant="danger" className="w-full sm:w-auto ml-0 sm:ml-3">
              Xuất database backup
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
