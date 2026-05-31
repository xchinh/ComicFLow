import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  Eye,
  FileText,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Upload,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Save,
  Send,
  Sparkles,
  Tags,
  Trash2,
  Underline,
  Undo2,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const BLOG_STORAGE_KEY = 'inkverse.creator.blogPosts';

const DEFAULT_EDITOR_CONTENT = `
  <h2>Ý tưởng chính</h2>
  <p>Viết câu chuyện hậu trường, cảm hứng sáng tác hoặc ghi chú dành cho độc giả...</p>
  <blockquote>Gợi ý: hãy mở đầu bằng một khoảnh khắc thú vị trong quá trình sáng tác.</blockquote>
`;

const DEFAULT_COVER_URL = 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?auto=format&fit=crop&w=1200&q=80';
const MAX_COVER_SIZE_MB = 5;
const ALLOWED_COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface SavedBlogPost {
  id: string;
  title: string;
  status: 'Bản nháp' | 'Đã đăng';
  category: string;
  excerpt: string;
  coverUrl: string;
  coverFileName?: string;
  tags: string[];
  contentHtml: string;
  views: string;
  comments: number;
  updatedAt: string;
  readingTime: string;
  authorName?: string;
  authorAvatar?: string;
  authorBio?: string;
  authorComicId?: string;
  authorComicTitle?: string;
  publishedAt?: string;
  likes?: number;
}

function readSavedBlogPosts(): SavedBlogPost[] {
  try {
    const raw = localStorage.getItem(BLOG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSavedBlogPost(post: SavedBlogPost) {
  const current = readSavedBlogPosts();
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify([post, ...current]));
}

function isValidUrl(value: string) {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function CreatorBlogEditorPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Nhật ký tác giả');
  const [coverUrl, setCoverUrl] = useState(DEFAULT_COVER_URL);
  const [coverFileName, setCoverFileName] = useState('cover-demo-unsplash.jpg');
  const [coverError, setCoverError] = useState('');
  const [tags, setTags] = useState('hậu trường, sáng tác, nhân vật');
  const [excerpt, setExcerpt] = useState('');
  const [contentHtml, setContentHtml] = useState(DEFAULT_EDITOR_CONTENT);
  const [notice, setNotice] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3]
        }
      }),
      UnderlineExtension,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4'
        }
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-2xl border border-border my-4 max-h-[420px] w-full object-cover'
        }
      }),
      Placeholder.configure({
        placeholder: 'Viết nội dung blog / nhật ký tác giả tại đây...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
    content: DEFAULT_EDITOR_CONTENT,
    editorProps: {
      attributes: {
        class: 'blog-editor-prose min-h-[440px] rounded-2xl border border-border bg-background/50 px-5 py-5 text-base leading-8 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20'
      }
    },
    onUpdate: ({ editor }) => {
      setContentHtml(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor) {
      setContentHtml(editor.getHTML());
    }
  }, [editor]);

  const plainText = useMemo(() => editor?.getText().trim() || '', [editor, contentHtml]);
  const wordCount = useMemo(() => plainText.split(/\s+/).filter(Boolean).length, [plainText]);
  const readingTime = `${Math.max(1, Math.ceil(wordCount / 220))} phút đọc`;
  const tagList = tags.split(',').map((tag) => tag.trim()).filter(Boolean);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3200);
  };

  const handleCoverFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setCoverError('');

    if (!file) return;

    if (!ALLOWED_COVER_TYPES.includes(file.type)) {
      event.target.value = '';
      setCoverError('Chỉ hỗ trợ ảnh cover dạng JPG, PNG hoặc WEBP.');
      showNotice('Ảnh cover chưa đúng định dạng. Vui lòng chọn JPG, PNG hoặc WEBP.');
      return;
    }

    const maxBytes = MAX_COVER_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      event.target.value = '';
      setCoverError(`Ảnh cover tối đa ${MAX_COVER_SIZE_MB}MB để demo tải nhanh hơn.`);
      showNotice(`Ảnh cover tối đa ${MAX_COVER_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        setCoverError('Không đọc được file ảnh. Vui lòng chọn ảnh khác.');
        return;
      }

      setCoverUrl(result);
      setCoverFileName(file.name);
      showNotice('Đã cập nhật ảnh cover và Preview bài viết.');
    };
    reader.onerror = () => {
      setCoverError('Không đọc được file ảnh. Vui lòng chọn ảnh khác.');
    };
    reader.readAsDataURL(file);
  };

  const resetCoverImage = () => {
    setCoverUrl(DEFAULT_COVER_URL);
    setCoverFileName('cover-demo-unsplash.jpg');
    setCoverError('');
    showNotice('Đã khôi phục ảnh cover demo.');
  };

  const insertLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Dán link muốn chèn vào bài viết:', previousUrl || 'https://');

    if (url === null) return;

    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    if (!isValidUrl(url)) {
      showNotice('Link chưa hợp lệ. Vui lòng nhập URL bắt đầu bằng http hoặc https.');
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertImage = () => {
    if (!editor) return;
    const url = window.prompt('Dán URL ảnh muốn chèn vào nội dung blog:', 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?auto=format&fit=crop&w=1200&q=80');
    if (!url) return;

    if (!isValidUrl(url)) {
      showNotice('URL ảnh chưa hợp lệ. Vui lòng nhập URL bắt đầu bằng http hoặc https.');
      return;
    }

    editor.chain().focus().setImage({ src: url }).run();
  };

  const clearFormatting = () => {
    editor?.chain().focus().clearNodes().unsetAllMarks().run();
  };

  const savePost = (status: 'Bản nháp' | 'Đã đăng') => {
    if (!editor) {
      showNotice('Editor chưa sẵn sàng. Vui lòng thử lại.');
      return;
    }

    const html = editor.getHTML();
    const text = editor.getText().trim();

    if (!title.trim()) {
      showNotice('Vui lòng nhập tiêu đề blog trước khi lưu.');
      return;
    }

    if (text.length < 40) {
      showNotice('Nội dung blog còn quá ngắn. Hãy viết thêm trước khi lưu.');
      return;
    }

    const now = new Date();
    const post: SavedBlogPost = {
      id: `blog-${Date.now()}`,
      title: title.trim(),
      status,
      category,
      excerpt: excerpt.trim() || text.slice(0, 180),
      coverUrl: coverUrl.trim(),
      coverFileName,
      tags: tagList,
      contentHtml: html,
      views: status === 'Đã đăng' ? '0' : '-',
      comments: 0,
      updatedAt: now.toLocaleString('vi-VN'),
      readingTime,
      authorName: 'An Nhiên Studio',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author-demo',
      authorBio: 'Creator của Học Viện Ánh Trăng và Người Gác Cổng Linh Giới.',
      authorComicId: '1',
      authorComicTitle: 'Học Viện Ánh Trăng',
      publishedAt: status === 'Đã đăng' ? now.toLocaleDateString('vi-VN') : undefined,
      likes: 0
    };

    writeSavedBlogPost(post);
    showNotice(status === 'Đã đăng' ? 'Đã đăng blog demo thành công.' : 'Đã lưu blog vào bản nháp demo.');
    window.setTimeout(() => navigate('/creator'), 650);
  };

  const toolbarButtonClass = (active?: boolean) => active ? 'bg-primary text-primary-foreground hover:bg-primary/90' : '';

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/creator')} aria-label="Quay lại Creator Dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-2">
                {/* <Badge variant="premium"><Sparkles className="w-3 h-3 mr-1" />Tiptap Editor</Badge> */}
                <span className="text-sm text-muted-foreground">Blog / Nhật ký tác giả</span>
              </div>
              <h1 className="text-3xl font-bold">Viết blog </h1>
              {/* <p className="text-muted-foreground mt-2">
                Editor dùng Tiptap để viết rich text, chèn link, chèn ảnh, định dạng tiêu đề, quote và danh sách.
              </p> */}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" onClick={() => savePost('Bản nháp')}>
              <Save className="w-4 h-4 mr-2" />
              Lưu nháp
            </Button>
            <Button onClick={() => savePost('Đã đăng')}>
              <Send className="w-4 h-4 mr-2" />
              Đăng bài
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
          <div className="space-y-6">
            <Card>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Tiêu đề bài viết</label>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-border bg-input px-4 py-4 text-2xl font-bold outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                    placeholder="Ví dụ: Hậu trường tạo hình nhân vật Luna"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Chuyên mục</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {['Nhật ký tác giả', 'Hậu trường sáng tác', 'Teaser chương mới', 'Thông báo cộng đồng', 'Q&A cùng độc giả'].map((opt) => {
                        const active = category === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setCategory(opt)}
                            className={`rounded-xl border px-3 py-2.5 text-sm font-medium text-left transition-all ${
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
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Tag</label>
                    <div className="relative mt-2">
                      <Tags className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={tags}
                        onChange={(event) => setTags(event.target.value)}
                        className="w-full rounded-xl border border-border bg-input pl-10 pr-4 py-3 outline-none focus:border-primary/60"
                        placeholder="Nhập tag, cách nhau bằng dấu phẩy"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Ảnh cover bài blog</label>
                  <div className="mt-2 rounded-2xl border border-dashed border-border bg-muted/20 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold">Chọn file ảnh cover từ máy</p>
                          <p className="text-xs text-muted-foreground">Hỗ trợ JPG, PNG, WEBP · tối đa {MAX_COVER_SIZE_MB}MB · hiển thị ngay ở Preview.</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
                          <Upload className="mr-2 h-4 w-4" />
                          Chọn ảnh
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                            onChange={handleCoverFileChange}
                            className="sr-only"
                          />
                        </label>
                        <Button type="button" variant="ghost" onClick={resetCoverImage}>Ảnh demo</Button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-[180px,1fr] md:items-center">
                      <div className="overflow-hidden rounded-xl border border-border bg-background">
                        <div className="aspect-[16/9]">
                          <ImageWithFallback src={coverUrl} alt="Ảnh cover đã chọn" className="h-full w-full object-cover" />
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="font-semibold">{coverFileName}</p>
                        <p className="text-muted-foreground">Ảnh này sẽ được dùng làm cover và sẽ hiển thị trong Preview bài viết bên phải.</p>
                        {coverError && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">{coverError}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Mô tả ngắn</label>
                  <textarea
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    className="mt-2 min-h-24 w-full rounded-xl border border-border bg-input px-4 py-3 outline-none focus:border-primary/60"
                    placeholder="Tóm tắt ngắn hiển thị ở danh sách blog..."
                  />
                </div>
              </div>
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="border-b border-border bg-muted/30 p-3 md:p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="ghost" size="sm" className={toolbarButtonClass(editor?.isActive('heading', { level: 2 }))} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="w-4 h-4" />H2</Button>
                  <Button type="button" variant="ghost" size="sm" className={toolbarButtonClass(editor?.isActive('heading', { level: 3 }))} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="w-4 h-4" />H3</Button>
                  <Button type="button" variant="ghost" size="sm" className={toolbarButtonClass(editor?.isActive('bold'))} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" />Đậm</Button>
                  <Button type="button" variant="ghost" size="sm" className={toolbarButtonClass(editor?.isActive('italic'))} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" />Nghiêng</Button>
                  <Button type="button" variant="ghost" size="sm" className={toolbarButtonClass(editor?.isActive('underline'))} onClick={() => editor?.chain().focus().toggleUnderline().run()}><Underline className="w-4 h-4" />Gạch chân</Button>
                  <Button type="button" variant="ghost" size="sm" className={toolbarButtonClass(editor?.isActive('blockquote'))} onClick={() => editor?.chain().focus().toggleBlockquote().run()}><Quote className="w-4 h-4" />Quote</Button>
                  <Button type="button" variant="ghost" size="sm" className={toolbarButtonClass(editor?.isActive('bulletList'))} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List className="w-4 h-4" />Bullet</Button>
                  <Button type="button" variant="ghost" size="sm" className={toolbarButtonClass(editor?.isActive('orderedList'))} onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-4 h-4" />Số thứ tự</Button>
                  <Button type="button" variant="ghost" size="sm" className={toolbarButtonClass(editor?.isActive('link'))} onClick={insertLink}><LinkIcon className="w-4 h-4" />Link</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={insertImage}><ImageIcon className="w-4 h-4" />Ảnh</Button>
                  <Button type="button" variant="ghost" size="sm" className={toolbarButtonClass(editor?.isActive({ textAlign: 'left' }))} onClick={() => editor?.chain().focus().setTextAlign('left').run()}><AlignLeft className="w-4 h-4" /></Button>
                  <Button type="button" variant="ghost" size="sm" className={toolbarButtonClass(editor?.isActive({ textAlign: 'center' }))} onClick={() => editor?.chain().focus().setTextAlign('center').run()}><AlignCenter className="w-4 h-4" /></Button>
                  <Button type="button" variant="ghost" size="sm" className={toolbarButtonClass(editor?.isActive({ textAlign: 'right' }))} onClick={() => editor?.chain().focus().setTextAlign('right').run()}><AlignRight className="w-4 h-4" /></Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()}><Undo2 className="w-4 h-4" />Undo</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()}><Redo2 className="w-4 h-4" />Redo</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={clearFormatting}><X className="w-4 h-4" />Xóa format</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => editor?.chain().focus().clearContent().run()}><Trash2 className="w-4 h-4" />Xóa nội dung</Button>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    Nội dung bài viết
                  </div>
                  <Badge variant="secondary">Plugin: Tiptap</Badge>
                </div>
                <EditorContent editor={editor} />
                <p className="mt-3 text-xs text-muted-foreground">
                  Editor hỗ trợ định dạng rich text, heading, quote, bullet/number list, link, ảnh, căn lề, undo/redo và lưu HTML vào mock data.
                </p>
              </div>
            </Card>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">Preview bài viết</h2>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-muted/20">
                <div className="aspect-[16/9] bg-muted">
                  <ImageWithFallback src={coverUrl} alt="Blog cover preview" className="h-full w-full object-cover" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="secondary">{category}</Badge>
                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">{coverFileName}</span>
                  </div>
                  <h3 className="text-xl font-bold leading-snug">{title || 'Tiêu đề blog sẽ hiển thị tại đây'}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {excerpt || plainText || 'Mô tả ngắn hoặc đoạn đầu bài viết sẽ hiển thị tại đây.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tagList.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-success" />
                <h2 className="text-lg font-bold">Thông tin xuất bản</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3 rounded-xl bg-muted/30 px-4 py-3">
                  <span className="text-muted-foreground">Số từ</span>
                  <span className="font-semibold">{wordCount}</span>
                </div>
                <div className="flex justify-between gap-3 rounded-xl bg-muted/30 px-4 py-3">
                  <span className="text-muted-foreground">Thời gian đọc</span>
                  <span className="font-semibold">{readingTime}</span>
                </div>
                <div className="flex justify-between gap-3 rounded-xl bg-muted/30 px-4 py-3">
                  <span className="text-muted-foreground">Cover</span>
                  <span className="max-w-[160px] truncate font-semibold">{coverFileName}</span>
                </div>
                <div className="flex justify-between gap-3 rounded-xl bg-muted/30 px-4 py-3">
                  <span className="text-muted-foreground">Định dạng lưu</span>
                  <Badge variant="secondary">HTML</Badge>
                </div>
                <div className="flex justify-between gap-3 rounded-xl bg-muted/30 px-4 py-3">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <Badge variant="warning">Chưa lưu</Badge>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button variant="ghost" onClick={() => savePost('Bản nháp')}>
                  <Save className="w-4 h-4 mr-2" />
                  Nháp
                </Button>
                <Button onClick={() => savePost('Đã đăng')}>
                  <Send className="w-4 h-4 mr-2" />
                  Đăng
                </Button>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {notice && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-primary/30 bg-card px-5 py-3 text-sm font-semibold shadow-2xl shadow-primary/20">
          {notice}
        </div>
      )}
    </div>
  );
}
