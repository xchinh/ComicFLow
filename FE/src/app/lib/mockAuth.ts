// import { demoAccounts, type DemoAccount, type DemoRole } from '../data/mockData';
import { clearToken, type ApiRole } from './api';

// Tạm thời stub mockdata (đã comment). Các hàm phụ thuộc demo accounts sẽ rỗng.
export type DemoRole = 'reader' | 'author' | 'admin';
export interface DemoAccount {
  id: string;
  role: DemoRole;
  name: string;
  email: string;
  password: string;
  avatar: string;
  coins: number;
  premium: boolean;
  creatorStatus?: 'not_registered' | 'pending' | 'approved';
  bio: string;
  permissions: string[];
}
const demoAccounts: DemoAccount[] = [];

const STORAGE_KEY = 'inkverse_mock_session';
export const AUTH_CHANGED_EVENT = 'inkverse_mock_auth_changed';

export type MockSession = Omit<DemoAccount, 'password'>;

function toSession(account: DemoAccount): MockSession {
  const { password: _password, ...session } = account;
  return session;
}

export function getDefaultAccount(role: DemoRole = 'reader') {
  return demoAccounts.find((account) => account.role === role) ?? demoAccounts[0];
}

export function getMockSession(): MockSession | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as MockSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setMockSession(account: DemoAccount): MockSession {
  const session = toSession(account);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  return session;
}

export function clearMockSession() {
  window.localStorage.removeItem(STORAGE_KEY);
  clearToken();
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

// ApiRole (READER/AUTHOR/ADMIN) -> DemoRole dùng trong UI
export function apiRoleToDemoRole(role: ApiRole): DemoRole {
  switch (role) {
    case 'AUTHOR':
      return 'author';
    case 'ADMIN':
      return 'admin';
    default:
      return 'reader';
  }
}

export function demoRoleToApiRole(role: DemoRole): ApiRole {
  switch (role) {
    case 'author':
      return 'AUTHOR';
    case 'admin':
      return 'ADMIN';
    default:
      return 'READER';
  }
}

// Tạo session từ kết quả đăng nhập/đăng ký thật của backend.
// Backend JWT chỉ chứa email nên role/name lấy theo lựa chọn ở form đăng nhập.
export function setRealSession(input: {
  email: string;
  role: DemoRole;
  name?: string;
  coins?: number;
}): MockSession {
  const current = getMockSession();
  const session: MockSession = {
    id: current?.id || `api-${input.role}`,
    role: input.role,
    name: input.name?.trim() || input.email.split('@')[0],
    email: input.email,
    avatar: current?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(input.email)}`,
    coins: input.coins ?? current?.coins ?? 0,
    premium: current?.premium ?? false,
    creatorStatus: input.role === 'author' ? 'approved' : 'not_registered',
    bio: current?.bio || 'Tài khoản đăng nhập qua backend ComicFlow.',
    permissions: current?.permissions || [],
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  return session;
}

export function loginMock(email: string, password: string): MockSession | null {
  const account = demoAccounts.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
  );

  if (!account) return null;
  return setMockSession(account);
}

export function quickLogin(role: DemoRole): MockSession {
  return setMockSession(getDefaultAccount(role));
}

export function roleLabel(role: DemoRole) {
  switch (role) {
    case 'reader':
      return 'Reader';
    case 'author':
      return 'Author';
    case 'admin':
      return 'Admin';
    default:
      return role;
  }
}

export function roleHome(role?: DemoRole) {
  switch (role) {
    case 'author':
      return '/creator';
    case 'admin':
      return '/admin';
    case 'reader':
    default:
      return '/';
  }
}
