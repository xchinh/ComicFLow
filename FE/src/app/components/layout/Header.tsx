import { Link, useNavigate } from 'react-router';
import { Coins, User, Menu, LogIn, LogOut, Shield, Crown, ClipboardCheck, BookOpen } from 'lucide-react';
import { SearchBar } from '../ui/SearchBar';
import { Notifications } from './Notifications';
import { useEffect, useState } from 'react';
import { AUTH_CHANGED_EVENT, clearMockSession, getMockSession, roleHome, roleLabel, type MockSession } from '../../lib/mockAuth';
import { Badge } from '../ui/Badge';

export function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [session, setSession] = useState<MockSession | null>(null);

  useEffect(() => {
    const syncSession = () => setSession(getMockSession());
    syncSession();
    window.addEventListener(AUTH_CHANGED_EVENT, syncSession);
    window.addEventListener('storage', syncSession);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  const logout = () => {
    clearMockSession();
    setProfileOpen(false);
    navigate('/login');
  };

  const handleGlobalSearch = (value: string) => {
    setGlobalSearchTerm(value);
    const keyword = value.trim();
    navigate(keyword ? `/explore?q=${encodeURIComponent(keyword)}` : '/explore');
  };

  const userCoins = session?.coins ?? 0;

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">IV</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                InkVerse
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">Trang chủ</Link>
              <Link to="/explore" className="text-foreground hover:text-primary transition-colors">Khám phá</Link>
              <Link to="/trending" className="text-foreground hover:text-primary transition-colors">Thịnh hành</Link>
              <Link to="/blog" className="text-foreground hover:text-primary transition-colors">Blog</Link>
              <Link to="/premium" className="text-primary hover:text-primary/80 transition-colors font-semibold">Premium</Link>
              {/* <Link to="/demo-test" className="text-foreground hover:text-primary transition-colors">Test</Link> */}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block w-64">
              <SearchBar value={globalSearchTerm} onSearch={handleGlobalSearch} placeholder="Tìm truyện, tác giả, danh mục..." />
            </div>

            <Link to={session ? '/wallet' : '/login'} className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-xl border border-primary/30 transition-all">
              <Coins className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">{userCoins}</span>
            </Link>

            <Notifications />

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition-all"
                >
                  <img src={session.avatar} alt={session.name} className="w-9 h-9 rounded-xl bg-muted" />
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-semibold leading-tight max-w-28 truncate">{session.name}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{roleLabel(session.role)}</p>
                  </div>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-12 w-72 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden p-3">
                      <div className="p-4 border border-border bg-muted/20 rounded-xl">
                        <div className="flex items-center gap-3">
                          <img src={session.avatar} alt={session.name} className="w-12 h-12 rounded-xl bg-muted" />
                          <div className="min-w-0">
                            <p className="font-bold truncate">{session.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{session.email}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2 flex-wrap">
                          <Badge variant="primary">{roleLabel(session.role)}</Badge>
                          {session.premium && <Badge variant="premium">Premium</Badge>}
                          <Badge variant="owned">{session.coins} Coin</Badge>
                        </div>
                      </div>

                      <div className="pt-3 space-y-1">
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition-all text-sm">
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        {session.role !== 'reader' && (
                          <Link to={roleHome(session.role)} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition-all text-sm">
                            {session.role === 'admin' ? <Shield className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
                            Quản trị
                          </Link>
                        )}
                        {/* <Link to="/demo-test" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition-all text-sm">
                          <ClipboardCheck className="w-4 h-4" /> Checklist test
                        </Link> */}
                        <Link to="/library" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition-all text-sm">
                          <BookOpen className="w-4 h-4" /> Thư viện
                        </Link>
                        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-error/10 text-error transition-all text-sm">
                          <LogOut className="w-4 h-4" /> Đăng xuất
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:border-primary/40 hover:bg-muted transition-all">
                <LogIn className="w-4 h-4" />
                <span className="text-sm font-semibold">Login</span>
              </Link>
            )}

            <button
              className="md:hidden w-10 h-10 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            <SearchBar className="mb-4" value={globalSearchTerm} onSearch={handleGlobalSearch} placeholder="Tìm truyện, tác giả, danh mục..." />
            <Link to="/" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg">Trang chủ</Link>
            <Link to="/explore" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg">Khám phá</Link>
            <Link to="/trending" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg">Thịnh hành</Link>
            <Link to="/blog" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg">Blog tác giả</Link>
            <Link to="/premium" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg">Premium</Link>
            <Link to="/demo-test" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg">Checklist test</Link>
            {session && session.role !== 'reader' && (
              <Link to={roleHome(session.role)} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-primary hover:bg-muted rounded-lg font-semibold">
                Quản trị
              </Link>
            )}
            <Link to={session ? '/profile' : '/login'} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-primary hover:bg-muted rounded-lg font-semibold">
              {session ? 'Profile' : 'Login demo'}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
