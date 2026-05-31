// API client cho backend ComicFlow (Spring Boot).
// Mọi response của backend đều bọc trong ApiResponse: { success, message, data, timestamp }.

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8080';

const TOKEN_KEY = 'comicflow_token';
const REFRESH_TOKEN_KEY = 'comicflow_refresh_token';
const AUTH_CHANGED_EVENT = 'inkverse_mock_auth_changed';

// ---- Token storage ----------------------------------------------------------
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function setRefreshToken(token: string) {
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function setAuthTokens(tokens: AuthResponse) {
  setToken(tokens.accessToken);
  if (tokens.refreshToken) {
    setRefreshToken(tokens.refreshToken);
  }
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

// ---- Kiểu dữ liệu khớp backend ----------------------------------------------
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export type ComicStatus = 'ONGOING' | 'COMPLETED' | 'HIATUS';
export type ApiRole = 'READER' | 'AUTHOR' | 'ADMIN';

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface ComicResponse {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  status: ComicStatus;
  authorName: string | null;
  releaseDate: string | null;
}

export interface ChapterResponse {
  id: string;
  title: string;
  chapterNumber: number;
  price: number;
  url: string | null;
  comicId: string;
  createdAt: string | null;
}

export interface UploadResponse {
  fileName: string;
  coverImageUrl: string;
}

export interface UploadChapterResponse {
  url: string;
}

export interface SubscriptionPlanResponse {
  id: string;
  name: string;
  price: number;
  chapterLimit: number;
  durationDays: number;
  unlimitedAccess: boolean;
}

export interface UserSubscriptionResponse {
  id: string;
  planName: string;
  startDate: string;
  endDate: string;
  chaptersRemaining: number;
  isActive: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  role: ApiRole;
  coins: number;
}

export interface DashboardResponse {
  totalUsers: number;
  totalComics: number;
  totalRevenue: number;
  totalSubscriptions: number;
}

export interface ComicStatsResponse {
  comicId: string;
  title: string;
  views: number;
  sales: number;
}

export interface AuthorDashboardResponse {
  totalComics: number;
  totalViews: number;
  totalSales: number;
  comicStats: ComicStatsResponse[];
}

export interface PaymentResponse {
  id: string;
  orderId: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentMethod: string;
  targetType: 'CHAPTER' | 'SUBSCRIPTION';
  targetName: string;
  createdAt: string;
}

export interface MomoCreatePaymentResponse {
  payUrl: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// ---- Lõi fetch --------------------------------------------------------------
interface RequestOptions {
  method?: string;
  body?: unknown; // object -> JSON; FormData -> gửi nguyên
  auth?: boolean; // có gắn Bearer token không
  skipRefresh?: boolean; // nội bộ: tránh loop khi retry sau refresh
}

let refreshTokenRequest: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshTokenRequest) return refreshTokenRequest;

  refreshTokenRequest = (async () => {
    const refreshToken = getRefreshToken();
    const headers: Record<string, string> = {};
    const body = refreshToken ? JSON.stringify({ refreshToken }) : undefined;

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    let res: Response;
    try {
      res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers,
        body,
        credentials: 'include',
      });
    } catch {
      clearToken();
      return null;
    }

    let payload: ApiResponse<AuthResponse> | AuthResponse | null = null;
    try {
      payload = (await res.json()) as ApiResponse<AuthResponse> | AuthResponse;
    } catch {
      // backend có thể trả body rỗng khi refresh fail
    }

    const data =
      payload && 'data' in payload ? payload.data : payload;

    if (!res.ok || !data?.accessToken) {
      clearToken();
      return null;
    }

    setAuthTokens(data);
    return data.accessToken;
  })().finally(() => {
    refreshTokenRequest = null;
  });

  return refreshTokenRequest;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, skipRefresh = false } = options;
  const headers: Record<string, string> = {};

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body !== undefined && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    });
  } catch (err) {
    throw new ApiError('Không kết nối được tới máy chủ. Kiểm tra backend đã chạy chưa.', 0);
  }

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await res.json()) as ApiResponse<T>;
  } catch {
    // body rỗng / không phải JSON
  }

  const shouldTryRefresh =
    auth && !skipRefresh && res.status === 401 && path !== '/auth/refresh';

  if (shouldTryRefresh) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      return request<T>(path, { ...options, skipRefresh: true });
    }
  }

  if (!res.ok || (payload && payload.success === false)) {
    const message = payload?.message || `Yêu cầu thất bại (HTTP ${res.status})`;
    throw new ApiError(message, res.status);
  }

  return (payload ? payload.data : (undefined as unknown)) as T;
}

// ---- Auth -------------------------------------------------------------------
export const authApi = {
  login(email: string, password: string) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      auth: false,
      body: { email, password },
    });
  },
  refresh() {
    return refreshAccessToken();
  },
  register(input: { email: string; username: string; password: string; role: ApiRole }) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      auth: false,
      body: input,
    });
  },
};

// ---- Comics -----------------------------------------------------------------
export const comicApi = {
  // BE SecurityConfig đang yêu cầu auth cho /comics/**. Gắn token nếu có.
  list() {
    return request<ComicResponse[]>('/comics');
  },
  get(comicId: string) {
    return request<ComicResponse>(`/comics/${comicId}`);
  },
  // Yêu cầu role AUTHOR/ADMIN
  listMine() {
    return request<ComicResponse[]>('/author/comics');
  },
  // Yêu cầu role AUTHOR/ADMIN. Backend yêu cầu multipart/form-data.
  create(input: { title: string; description?: string; status: ComicStatus; coverImage?: File }) {
    const form = new FormData();
    // Gửi phần 'comic' dưới dạng Blob application/json để Spring Boot @RequestPart xử lý được
    const comicData = {
      title: input.title,
      description: input.description,
      status: input.status,
    };
    form.append('comic', new Blob([JSON.stringify(comicData)], { type: 'application/json' }));
    
    if (input.coverImage) {
      form.append('coverImage', input.coverImage);
    }
    
    return request<ComicResponse>('/author/comics', { method: 'POST', body: form });
  },
  update(comicId: string, input: { title?: string; description?: string; status?: ComicStatus }) {
    return request<ComicResponse>(`/author/comics/${comicId}`, { method: 'PUT', body: input });
  },
  remove(comicId: string) {
    return request<void>(`/author/comics/${comicId}`, { method: 'DELETE' });
  },
  // Lưu ý: backend dùng PATCH cho cover nhưng CORS hiện chưa cho phép PATCH.
  updateCover(comicId: string, coverImageUrl: string) {
    return request<ComicResponse>(`/author/comics/${comicId}/cover`, {
      method: 'PATCH',
      body: { coverImageUrl },
    });
  },
};

// ---- Chapters ---------------------------------------------------------------
export const chapterApi = {
  listByComic(comicId: string) {
    return request<ChapterResponse[]>(`/comics/${comicId}/chapters`);
  },
  get(chapterId: string) {
    return request<ChapterResponse>(`/chapters/${chapterId}`);
  },
  // multipart/form-data: AUTHOR tạo chương kèm file PDF
  create(input: {
    chapterNumber: number;
    title: string;
    price: number;
    comicId: string;
    isFree: boolean;
    file: File;
  }) {
    const form = new FormData();
    form.append('chapterNumber', String(input.chapterNumber));
    form.append('title', input.title);
    form.append('price', String(input.price));
    form.append('comicId', input.comicId);
    form.append('free', String(input.isFree)); // Backend dùng field 'free'
    form.append('file', input.file);
    return request<ChapterResponse>('/author/chapters', { method: 'POST', body: form });
  },
};

// ---- Subscription -----------------------------------------------------------
export const subscriptionApi = {
  // BE require auth (mặc dù chỉ là list plans).
  listPlans() {
    return request<SubscriptionPlanResponse[]>('/subscriptions/plans');
  },
  getMySubscription() {
    return request<UserSubscriptionResponse>('/subscriptions/me');
  },
};

// ---- Dashboard --------------------------------------------------------------
export const dashboardApi = {
  getAdminStats() {
    return request<DashboardResponse>('/dashboard/admin/stats');
  },
  getAuthorStats() {
    return request<AuthorDashboardResponse>('/dashboard/author/stats');
  },
};

// ---- User -------------------------------------------------------------------
export const userApi = {
  getMe() {
    return request<UserResponse>('/users/me');
  },
  getMyChapters() {
    return request<string[]>('/users/me/chapters');
  },
};

// ---- Payment (MoMo) ---------------------------------------------------------
// FE chỉ tạo payUrl rồi redirect đến MoMo. IPN callback do BE handle.
export const paymentApi = {
  getHistory() {
    return request<PaymentResponse[]>('/payments/history');
  },
  createChapterPayment(chapterId: string) {
    return request<MomoCreatePaymentResponse>(`/payments/momo/chapter/${chapterId}`, {
      method: 'POST',
    });
  },
  createSubscriptionPayment(planId: string) {
    return request<MomoCreatePaymentResponse>(`/payments/momo/subscription/${planId}`, {
      method: 'POST',
    });
  },
};

// ---- Storage ----------------------------------------------------------------
export const storageApi = {
  uploadCover(comicId: string, file: File) {
    const form = new FormData();
    form.append('file', file);
    form.append('comicId', comicId);
    return request<UploadResponse>('/storage/upload', { method: 'POST', body: form });
  },
  uploadChapterPdf(comicId: string, chapterId: string, file: File, isFree: boolean) {
    const form = new FormData();
    form.append('file', file);
    form.append('comicId', comicId);
    form.append('chapterId', chapterId);
    form.append('isFree', String(isFree));
    return request<UploadChapterResponse>('/storage/upload/pdf', { method: 'POST', body: form });
  },
};

// ---- Mappers: ComicFlow -> shape mà UI mock đang dùng -----------------------
const FALLBACK_COVER = 'https://placehold.co/400x600/1b1730/f8f5ff?text=ComicFlow';

export const resolveUrl = (url: string | null | undefined) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export interface UiComic {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  views: number;
  pricePerChapter: number;
  genres: string[];
  status?: 'free' | 'premium' | 'hot' | 'new';
  description: string;
  followers: number;
  chapters: number;
  apiStatus?: ComicStatus;
}

export function mapComic(c: ComicResponse): UiComic {
  return {
    id: c.id,
    title: c.title,
    author: c.authorName ?? 'Không rõ',
    cover: resolveUrl(c.coverImageUrl) || FALLBACK_COVER,
    rating: 0,
    views: 0,
    pricePerChapter: 0,
    genres: [],
    status: undefined,
    description: c.description ?? '',
    followers: 0,
    chapters: 0,
    apiStatus: c.status,
  };
}

export interface UiChapter {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  date: string;
  views: number;
  status: 'free' | 'owned' | 'locked' | 'premium';
  price?: number;
  url?: string;
}

export function mapChapter(c: ChapterResponse): UiChapter {
  const isPaid = (c.price ?? 0) > 0;
  const isUnlocked = (c as any).unlocked === true || !isPaid;
  
  return {
    id: c.id,
    chapterId: c.id,
    number: c.chapterNumber,
    title: c.title,
    date: c.createdAt ? c.createdAt.slice(0, 10) : '',
    views: 0,
    status: isUnlocked ? (isPaid ? 'owned' : 'free') : 'locked',
    price: isPaid ? c.price : undefined,
    url: c.url ?? undefined,
  };
}
