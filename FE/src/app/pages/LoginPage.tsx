import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CheckCircle, Crown, Shield, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import {
  getMockSession,
  roleHome,
  roleLabel,
  setRealSession,
  demoRoleToApiRole,
  apiRoleToDemoRole,
  type MockSession,
  type DemoRole,
} from '../lib/mockAuth';
import { authApi, userApi, setAuthTokens, ApiError } from '../lib/api';

const roleOptions: { id: DemoRole; icon: typeof User }[] = [
  { id: 'reader', icon: User },
  { id: 'author', icon: Crown },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<DemoRole>('reader');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [currentSession, setCurrentSession] = useState<MockSession | null>(null);

  useEffect(() => {
    setCurrentSession(getMockSession());
  }, []);

  const switchTab = (next: 'login' | 'register') => {
    setTab(next);
    setError('');
    setInfo('');
  };

  const submitLogin = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const auth = await authApi.login(email.trim(), password);
      setAuthTokens(auth);
      
      // Sau khi đăng nhập, gọi API getMe để lấy role thực tế
      const user = await userApi.getMe();
      const mappedRole = apiRoleToDemoRole(user.role);
      
      const session = setRealSession({
        email: email.trim(),
        role: mappedRole,
        name: user.username,
        coins: user.coins
      });
      navigate(roleHome(session.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async () => {
    setError('');
    setInfo('');
    if (!username.trim()) {
      setError('Nhập tên hiển thị (username) để đăng ký.');
      return;
    }
    setLoading(true);
    try {
      const auth = await authApi.register({
        email: email.trim(),
        username: username.trim(),
        password,
        role: demoRoleToApiRole(selectedRole),
      });
      setAuthTokens(auth);
      const session = setRealSession({ email: email.trim(), role: selectedRole, name: username.trim() });
      navigate(roleHome(session.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Đăng ký thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <Badge variant="primary" className="mb-4">COMICFLOW</Badge>
          <h1 className="text-4xl font-bold mb-3">
            {tab === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Kết nối backend ComicFlow. {tab === 'login' ? 'Tự động điều hướng theo vai trò sau khi đăng nhập.' : 'Chọn vai trò mong muốn khi đăng ký.'}
          </p>
        </div>

        {currentSession && (
          <Card className="border-primary/30 bg-primary/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={currentSession.avatar} alt={currentSession.name} className="w-14 h-14 rounded-2xl bg-muted" />
                <div>
                  <p className="text-sm text-muted-foreground">Đang có session</p>
                  <h2 className="text-xl font-bold">{currentSession.name}</h2>
                  <p className="text-sm text-muted-foreground">{currentSession.email} · {roleLabel(currentSession.role)}</p>
                </div>
              </div>
              <Link to={roleHome(currentSession.role)}>
                <Button>Vào dashboard hiện tại</Button>
              </Link>
            </div>
          </Card>
        )}

        <Card>
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted/30 rounded-2xl border border-border mb-6">
            <button
              type="button"
              onClick={() => switchTab('login')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                tab === 'login'
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => switchTab('register')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                tab === 'register'
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Đăng ký
            </button>
          </div>

          <div className="space-y-5">
            {tab === 'register' && (
              <div>
                <label className="block text-sm font-semibold mb-2">Bạn đăng ký với vai trò:</label>
                <div className="grid grid-cols-2 gap-2">
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    const active = selectedRole === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedRole(option.id)}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                          active
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-muted/20 border-border text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {roleLabel(option.id)}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Chọn Reader nếu chỉ đọc truyện, Author nếu muốn đăng truyện.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="you@example.com"
              />
            </div>

            {tab === 'register' && (
              <div>
                <label className="block text-sm font-semibold mb-2">Tên hiển thị</label>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="username"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Mật khẩu</label>
              <div className="relative">
                <input
                  value={password}
                  type={showPassword ? 'text' : 'password'}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-error">{error}</p>}
            {info && <p className="text-sm text-warning">{info}</p>}

            {tab === 'login' ? (
              <Button className="w-full" size="lg" onClick={submitLogin} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </Button>
            ) : (
              <Button className="w-full" size="lg" onClick={submitRegister} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
