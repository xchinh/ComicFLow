import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { comicApi, chapterApi, ApiError } from '../lib/api';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronDown,
  FileText,
  Info,
  Search,
  Send,
  ShieldCheck,
  Upload,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .trim();

type ComicOption = {
  id: string;
  title: string;
  nextChapter: number;
  price: number;
  cover?: string | null;
  status?: string;
};

type UploadForm = {
  comic: string;
  chapterNumber: string;
  chapterTitle: string;
  price: string;
  releaseTime: string;
  rating: string;
  note: string;
  pdfFileName: string;
};

const initialForm: UploadForm = {
  comic: '',
  chapterNumber: '',
  chapterTitle: '',
  price: '0',
  releaseTime: '',
  rating: '13+',
  note: '',
  pdfFileName: '',
};

const formatComicStatus = (status?: string) => {
  if (!status) return '';
  const labels: Record<string, string> = {
    ONGOING: 'Đang phát hành',
    COMPLETED: 'Hoàn thành',
    HIATUS: 'Tạm dừng',
  };
  return labels[status] || status;
};

export function CreatorUploadChapterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<UploadForm>(initialForm);
  const [notice, setNotice] = useState('');
  const [submitted, setSubmitted] = useState(false);
  // Danh sách truyện thật của tác giả + file PDF thật để upload lên backend.
  const [comics, setComics] = useState<ComicOption[]>([]);
  const [comicId, setComicId] = useState<string>('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [comicSearch, setComicSearch] = useState('');
  const [comicPickerOpen, setComicPickerOpen] = useState(false);
  const [comicLoadState, setComicLoadState] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');

  const filteredComics = useMemo(() => {
    const keyword = normalizeText(comicSearch);
    if (!keyword) return comics;
    return comics.filter((comic) => normalizeText(comic.title).includes(keyword));
  }, [comics, comicSearch]);

  const selectedComic = useMemo(
    () => comics.find((comic) => comic.id === comicId) || null,
    [comics, comicId]
  );

  useEffect(() => {
    let active = true;

    const loadAuthorComics = async () => {
      try {
        const list = await comicApi.listMine();
        if (!active) return;

        if (!list.length) {
          setComics([]);
          setComicId('');
          setForm((current) => ({ ...current, comic: '', chapterNumber: '', price: '0' }));
          setComicLoadState('empty');
          return;
        }

        const chaptersByComic = await Promise.allSettled(
          list.map((comic) => chapterApi.listByComic(comic.id))
        );
        if (!active) return;

        const opts: ComicOption[] = list.map((comic, index) => {
          const chapters =
            chaptersByComic[index].status === 'fulfilled' ? chaptersByComic[index].value : [];
          const sortedChapters = [...chapters].sort((a, b) => b.chapterNumber - a.chapterNumber);
          const latestChapter = sortedChapters[0];
          const maxChapterNumber = sortedChapters.reduce(
            (max, chapter) => Math.max(max, chapter.chapterNumber || 0),
            0
          );

          return {
            id: comic.id,
            title: comic.title,
            nextChapter: maxChapterNumber + 1 || 1,
            price: latestChapter?.price ?? 0,
            cover: comic.coverImageUrl,
            status: comic.status,
          };
        });

        const firstComic = opts[0];
        setComics(opts);
        setComicId(firstComic.id);
        setForm((current) => ({
          ...current,
          comic: firstComic.title,
          chapterNumber: String(firstComic.nextChapter),
          price: String(firstComic.price),
        }));
        setComicLoadState('ready');
      } catch {
        if (!active) return;
        setComics([]);
        setComicId('');
        setForm((current) => ({ ...current, comic: '', chapterNumber: '', price: '0' }));
        setComicLoadState('error');
      }
    };

    void loadAuthorComics();

    return () => {
      active = false;
    };
  }, []);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3600);
  };

  const updateForm = (patch: Partial<UploadForm>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const handleComicChange = (nextId: string) => {
    const selectedComic = comics.find((comic) => comic.id === nextId);
    if (!selectedComic) return;
    setComicId(selectedComic.id);
    setComicPickerOpen(false);
    setComicSearch('');
    updateForm({
      comic: selectedComic.title,
      chapterNumber: String(selectedComic.nextChapter),
      price: String(selectedComic.price),
    });
  };

  const handleChapterPdfChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      updateForm({ pdfFileName: '' });
      return;
    }

    const lowerName = file.name.toLowerCase();
    const isPdf = file.type === 'application/pdf' || lowerName.endsWith('.pdf');

    if (!isPdf) {
      event.target.value = '';
      setPdfFile(null);
      updateForm({ pdfFileName: '' });
      showNotice('Chỉ hỗ trợ upload file PDF. Không nhận ZIP, JPG, PNG, WEBP hoặc file ảnh rời.');
      return;
    }

    setPdfFile(file);
    updateForm({ pdfFileName: file.name });
  };

  const submitUpload = async () => {
    if (!selectedComic) {
      showNotice('Vui lòng chọn bộ truyện trước khi gửi duyệt.');
      return;
    }

    if (!form.chapterTitle.trim()) {
      showNotice('Vui lòng nhập tên chương trước khi gửi duyệt.');
      return;
    }

    if (!form.pdfFileName) {
      showNotice('Vui lòng chọn file PDF của chương. Hệ thống không nhận ZIP hoặc ảnh rời.');
      return;
    }

    if (!pdfFile) {
      showNotice('File PDF không hợp lệ. Vui lòng chọn lại.');
      return;
    }

    const price = Number.parseInt(form.price, 10) || 0;

    setSubmitting(true);
    try {
      await chapterApi.create({
        chapterNumber: Number.parseInt(form.chapterNumber, 10) || 1,
        title: form.chapterTitle.trim(),
        price,
        comicId: selectedComic.id,
        isFree: price === 0,
        file: pdfFile,
      });
      setSubmitted(true);
      showNotice('Đã tạo chương mới thành công.');
    } catch (err) {
      showNotice(err instanceof ApiError ? `Tạo chương thất bại: ${err.message}` : 'Tạo chương thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    const nextComic = selectedComic || comics[0] || null;
    setForm({
      ...initialForm,
      comic: nextComic?.title ?? '',
      chapterNumber: nextComic ? String(nextComic.nextChapter) : '',
      price: nextComic ? String(nextComic.price) : '0',
    });
    setPdfFile(null);
    setSubmitted(false);
    setComicSearch('');
    setComicPickerOpen(false);
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/creator" className="mb-3 inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về Creator Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Upload chương mới</h1>
            <p className="mt-2 text-muted-foreground">
              Chỉ nhận file PDF, kèm thông tin kiểm tra bản quyền trước khi gửi Admin duyệt.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">PDF only</Badge>
            <Badge variant="warning">Kiểm tra bản quyền</Badge>
            <Badge variant="default">Admin review</Badge>
          </div>
        </div>

        {submitted ? (
          <Card className="border-success/30 bg-success/10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/20">
              <CheckCircle className="h-7 w-7 text-success" />
            </div>
            <h2 className="text-2xl font-bold">Chương đã được tải lên thành công</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Nội dung chương mới đã sẵn sàng cho độc giả.
            </p>
            <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-card/70 p-4 text-left sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Truyện</p>
                <p className="font-semibold">{form.comic}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Chương</p>
                <p className="font-semibold">Chương {form.chapterNumber}: {form.chapterTitle}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">File PDF</p>
                <p className="font-semibold">{form.pdfFileName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Trạng thái</p>
                <Badge variant="success" className="mt-1">Đã xuất bản</Badge>
              </div>
            </div>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="secondary" onClick={resetForm}>Upload chương khác</Button>
              <Button onClick={() => navigate('/creator')}>Về Dashboard</Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-6">
              <Card>
                <div className="mb-5 flex items-start gap-3">
                  <FileText className="mt-0.5 h-6 w-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-bold">1. Thông tin chương</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Khai báo metadata để Admin duyệt đúng truyện, đúng chương và đúng lịch phát hành.</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold">Bộ truyện</span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {comicLoadState === 'loading'
                          ? 'Đang tải truyện...'
                          : comicLoadState === 'error'
                            ? 'Không tải được'
                            : `${comics.length} bộ truyện`}
                      </span>
                    </div>

                    {selectedComic ? (
                      <button
                        type="button"
                        onClick={() => setComicPickerOpen((open) => !open)}
                        className="flex w-full items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-3 text-left transition-all hover:border-primary/60 hover:bg-primary/10"
                      >
                        {selectedComic.cover ? (
                          <img
                            src={selectedComic.cover}
                            alt={selectedComic.title}
                            className="h-16 w-12 flex-shrink-0 rounded-lg bg-muted object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="flex h-16 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-bold text-foreground">{selectedComic.title}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            {formatComicStatus(selectedComic.status) && (
                              <span>{formatComicStatus(selectedComic.status)}</span>
                            )}
                            <span>Chương kế tiếp: {selectedComic.nextChapter}</span>
                            <span>{selectedComic.price} coin</span>
                          </div>
                        </div>
                        <ChevronDown className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${comicPickerOpen ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <div className="rounded-2xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                        Chưa có bộ truyện nào để upload chương. Hãy tạo truyện ở Creator Dashboard trước.
                      </div>
                    )}

                    {comicPickerOpen && comics.length > 0 && (
                      <div className="rounded-2xl border border-border bg-card p-3 shadow-lg shadow-primary/5">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            value={comicSearch}
                            onChange={(e) => setComicSearch(e.target.value)}
                            placeholder={`Tìm trong ${comics.length} truyện...`}
                            className="w-full rounded-xl border border-border bg-input py-2.5 pl-9 pr-10 text-sm text-foreground outline-none focus:border-primary/60"
                            autoFocus
                          />
                          {comicSearch && (
                            <button
                              type="button"
                              onClick={() => setComicSearch('')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label="Xóa tìm kiếm"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        {filteredComics.length === 0 ? (
                          <div className="mt-3 rounded-xl border border-border bg-muted/20 p-4 text-center text-sm text-muted-foreground">
                            Không có truyện khớp "<span className="font-semibold text-foreground">{comicSearch}</span>".
                          </div>
                        ) : (
                          <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
                            {filteredComics.map((comic) => {
                              const active = comicId === comic.id;
                              return (
                                <button
                                  key={comic.id}
                                  type="button"
                                  onClick={() => handleComicChange(comic.id)}
                                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                                    active
                                      ? 'border-primary bg-primary/10 shadow-md shadow-primary/10'
                                      : 'border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/30'
                                  }`}
                                >
                                  {comic.cover ? (
                                    <img
                                      src={comic.cover}
                                      alt={comic.title}
                                      className="h-14 w-11 flex-shrink-0 rounded-lg bg-muted object-cover"
                                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                  ) : (
                                    <div className="flex h-14 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                                      <FileText className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className={`truncate font-semibold ${active ? 'text-primary' : 'text-foreground'}`}>
                                      {comic.title}
                                    </p>
                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                      Chương {comic.nextChapter} · {comic.price} coin
                                      {formatComicStatus(comic.status) ? ` · ${formatComicStatus(comic.status)}` : ''}
                                    </p>
                                  </div>
                                  {active && (
                                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">Số chương</span>
                    <input value={form.chapterNumber} onChange={(e) => updateForm({ chapterNumber: e.target.value })} className="w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="46" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">Giá mở khóa / Coin</span>
                    <input value={form.price} onChange={(e) => updateForm({ price: e.target.value })} className="w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="15" />
                  </label>
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-semibold">Tên chương</span>
                    <input value={form.chapterTitle} onChange={(e) => updateForm({ chapterTitle: e.target.value })} className="w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="Ví dụ: Cánh cửa bạc" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">Lịch phát hành</span>
                    <input value={form.releaseTime} onChange={(e) => updateForm({ releaseTime: e.target.value })} className="w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="VD: 20:00, 15/05/2026" />
                  </label>
                  <div className="space-y-2">
                    <span className="text-sm font-semibold">Rating nội dung</span>
                    <div className="grid grid-cols-2 gap-2">
                      {['Phù hợp mọi lứa tuổi', '13+', '16+', '18+'].map((opt) => {
                        const active = form.rating === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => updateForm({ rating: opt })}
                            className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                              active
                                ? 'border-primary bg-primary/10 text-primary shadow-md shadow-primary/10'
                                : 'border-border bg-muted/20 text-foreground hover:border-primary/40 hover:bg-muted/30'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-semibold">Ghi chú cho Admin</span>
                    <textarea value={form.note} onChange={(e) => updateForm({ note: e.target.value })} className="min-h-28 w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="Cảnh báo nội dung, lịch phát hành, ghi chú kiểm duyệt..." />
                  </label>
                </div>
              </Card>

              <Card>
                <div className="mb-5 flex items-start gap-3">
                  <Upload className="mt-0.5 h-6 w-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-bold">2. Upload file PDF</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Không nhận ZIP, JPG, PNG, WEBP hoặc ảnh rời.</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5">
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleChapterPdfChange}
                    className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground"
                  />
                  {form.pdfFileName ? (
                    <div className="mt-4 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-semibold text-success">
                      Đã chọn PDF: {form.pdfFileName}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">Chưa chọn file. File hợp lệ phải có định dạng <strong>.pdf</strong>.</p>
                  )}
                </div>
              </Card>
            </div>

            <aside className="space-y-6">
              <Card className="sticky top-24">
                <div className="mb-5 flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-lg font-bold">Tóm tắt chương</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Kiểm tra thông tin trước khi hoàn tất.</p>
                  </div>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Truyện</p>
                    <p className="font-semibold">{form.comic}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Chương</p>
                    <p className="font-semibold">Chương {form.chapterNumber || '-'} {form.chapterTitle ? `· ${form.chapterTitle}` : ''}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">File</p>
                    <p className="font-semibold">{form.pdfFileName || 'Chưa chọn PDF'}</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <Button onClick={submitUpload} disabled={submitting}>
                    <Send className="h-4 w-4" />
                    {submitting ? 'Đang xử lý...' : 'Hoàn tất upload'}
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/creator')}>Hủy</Button>
                </div>
              </Card>
            </aside>
          </div>
        )}
      </div>

      {notice && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-primary/30 bg-card px-5 py-3 text-sm font-semibold shadow-2xl shadow-primary/20">
          {notice}
        </div>
      )}
    </div>
  );
}
