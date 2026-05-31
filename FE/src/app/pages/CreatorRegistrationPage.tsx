import { useState } from 'react';
import { Upload, Check, FileText, Image, User, Mail, Phone, Shield, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function CreatorRegistrationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    portfolioUrl: '',
    bio: '',
    idCard: null as File | null,
    portfolioFile: null as File | null,
    agreeTerms: false,
    agreeCopyright: false
  });

  const steps = [
    { number: 1, title: 'Thông tin cá nhân', icon: User },
    { number: 2, title: 'Portfolio & Tác phẩm', icon: FileText },
    { number: 3, title: 'Xác minh danh tính', icon: Shield },
    { number: 4, title: 'Hoàn tất', icon: Check }
  ];

  const benefits = [
    'Kiếm tiền từ tác phẩm của bạn',
    'Quản lý & phân tích doanh thu',
    'Tương tác trực tiếp với độc giả',
    'Hỗ trợ marketing từ InkVerse',
    'Bảo vệ bản quyền tác phẩm',
    'Tham gia cộng đồng creator'
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    alert('Đăng ký thành công! Chúng tôi sẽ xem xét hồ sơ của bạn trong 24-48 giờ.');
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="primary" className="inline-flex">
            Trở thành Creator
          </Badge>
          <h1 className="text-4xl font-bold">Đăng ký tài khoản Tác giả</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chia sẻ tác phẩm của bạn với hàng triệu độc giả và kiếm tiền từ đam mê sáng tạo
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isActive = step >= s.number;
            const isCurrent = step === s.number;

            return (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-muted text-muted-foreground'
                  } ${isCurrent ? 'scale-110' : ''}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-semibold text-center ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                    step > s.number ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <Card className="max-w-3xl mx-auto">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Thông tin cá nhân</h2>
                <p className="text-muted-foreground">Vui lòng cung cấp thông tin chính xác để chúng tôi có thể liên hệ với bạn</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Họ và tên *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Số điện thoại *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912345678"
                    className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Giới thiệu ngắn về bạn</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tôi là một họa sĩ truyện tranh với 5 năm kinh nghiệm..."
                    rows={4}
                    className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Portfolio */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Portfolio & Tác phẩm</h2>
                <p className="text-muted-foreground">Chia sẻ tác phẩm của bạn để chúng tôi đánh giá</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Link Portfolio (nếu có)</label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://behance.net/yourname hoặc https://instagram.com/yourname"
                    className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Upload tác phẩm mẫu *</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.zip,.jpg,.png"
                      className="hidden"
                      id="portfolio-upload"
                      onChange={(e) => setFormData({ ...formData, portfolioFile: e.target.files?.[0] || null })}
                    />
                    <label htmlFor="portfolio-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      {formData.portfolioFile ? (
                        <p className="text-sm font-semibold text-success">
                          ✓ {formData.portfolioFile.name}
                        </p>
                      ) : (
                        <>
                          <p className="text-sm font-semibold mb-1">Click để upload tác phẩm</p>
                          <p className="text-xs text-muted-foreground">
                            Chấp nhận PDF, ZIP, JPG, PNG (tối đa 50MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Gợi ý: Upload 3-5 trang truyện mẫu hoặc illustrations để chúng tôi đánh giá chất lượng
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Xác minh danh tính</h2>
                <p className="text-muted-foreground">Để bảo vệ bản quyền và thanh toán, chúng tôi cần xác minh danh tính của bạn</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">CMND/CCCD/Hộ chiếu *</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept=".jpg,.png,.pdf"
                      className="hidden"
                      id="id-upload"
                      onChange={(e) => setFormData({ ...formData, idCard: e.target.files?.[0] || null })}
                    />
                    <label htmlFor="id-upload" className="cursor-pointer">
                      <Image className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      {formData.idCard ? (
                        <p className="text-sm font-semibold text-success">
                          ✓ {formData.idCard.name}
                        </p>
                      ) : (
                        <>
                          <p className="text-sm font-semibold mb-1">Upload ảnh CMND/CCCD</p>
                          <p className="text-xs text-muted-foreground">
                            Chụp 2 mặt rõ nét (JPG, PNG, PDF - tối đa 10MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <Card className="bg-warning/10 border-warning/30">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-foreground mb-1">Bảo mật thông tin</p>
                      <p className="text-muted-foreground">
                        Thông tin cá nhân của bạn được mã hóa và chỉ sử dụng cho mục đích xác minh.
                        Chúng tôi cam kết không chia sẻ với bên thứ ba.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      className="mt-1 w-5 h-5 accent-primary"
                    />
                    <span className="text-sm">
                      Tôi đồng ý với{' '}
                      <a href="#" className="text-primary hover:underline">Điều khoản dịch vụ</a>
                      {' '}và{' '}
                      <a href="#" className="text-primary hover:underline">Chính sách quyền riêng tư</a>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeCopyright}
                      onChange={(e) => setFormData({ ...formData, agreeCopyright: e.target.checked })}
                      className="mt-1 w-5 h-5 accent-primary"
                    />
                    <span className="text-sm">
                      Tôi cam kết tất cả tác phẩm tải lên là của tôi sáng tạo và không vi phạm bản quyền
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-success" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Đăng ký thành công!</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Cảm ơn bạn đã đăng ký. Chúng tôi sẽ xem xét hồ sơ và liên hệ qua email trong vòng 24-48 giờ.
                </p>
              </div>

              <div className="bg-muted/30 rounded-xl p-6 max-w-md mx-auto space-y-3 text-left">
                <h3 className="font-semibold">Các bước tiếp theo:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Kiểm tra email để xác nhận tài khoản</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Chúng tôi sẽ xem xét hồ sơ trong 24-48 giờ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Nhận thông báo kết quả qua email & SMS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Bắt đầu đăng truyện và kiếm tiền!</span>
                  </li>
                </ul>
              </div>

              <Button size="lg" onClick={() => window.location.href = '/'}>
                Về trang chủ
              </Button>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex gap-3 pt-6 border-t border-border">
              {step > 1 && (
                <Button variant="ghost" onClick={handleBack} className="flex-1">
                  Quay lại
                </Button>
              )}
              <Button
                onClick={step === 3 ? handleSubmit : handleNext}
                className="flex-1"
                disabled={
                  (step === 1 && (!formData.fullName || !formData.email || !formData.phone)) ||
                  (step === 2 && !formData.portfolioFile) ||
                  (step === 3 && (!formData.idCard || !formData.agreeTerms || !formData.agreeCopyright))
                }
              >
                {step === 3 ? 'Gửi đăng ký' : 'Tiếp tục'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </Card>

        {/* Benefits */}
        {step < 4 && (
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center">Quyền lợi Creator</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
