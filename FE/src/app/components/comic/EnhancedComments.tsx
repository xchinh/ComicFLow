import { useState } from 'react';
import { Heart, MessageCircle, MoreVertical, Flag, Trash2, Edit2, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/Badge';

interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
  isAuthor?: boolean;
  isLiked?: boolean;
  replies?: Comment[];
}

interface EnhancedCommentsProps {
  comicId: string;
  chapterId?: string;
}

export function EnhancedComments({ comicId, chapterId }: EnhancedCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: 'Minh Anh',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      text: 'Chương này hay quá! Plot twist cực đỉnh 🔥',
      likes: 23,
      time: '5 phút trước',
      isLiked: false,
      replies: [
        {
          id: '1-1',
          user: 'An Nhiên Studio',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An',
          text: 'Cảm ơn bạn rất nhiều! Mình sẽ cố gắng giữ chất lượng trong các chương tiếp theo 💜',
          likes: 8,
          time: '3 phút trước',
          isAuthor: true,
          isLiked: true
        }
      ]
    },
    {
      id: '2',
      user: 'Hoàng Long',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      text: 'Không ngờ nhân vật chính lại làm vậy, ông tác giả quá tàn nhẫn 😭',
      likes: 18,
      time: '12 phút trước',
      isLiked: false
    },
    {
      id: '3',
      user: 'Thu Hà',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      text: 'Ai biết khi nào chương sau ra không? Chờ mỏi mòn quá 🥺',
      likes: 31,
      time: '1 giờ trước',
      isLiked: true,
      replies: [
        {
          id: '3-1',
          user: 'An Nhiên Studio',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An',
          text: 'Chương 47 sẽ ra vào thứ 6 tuần này nha bạn! ❤️',
          likes: 12,
          time: '45 phút trước',
          isAuthor: true,
          isLiked: false
        },
        {
          id: '3-2',
          user: 'Thu Hà',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
          text: 'Yayyy cảm ơn tác giả! 🎉',
          likes: 5,
          time: '30 phút trước',
          isLiked: false
        }
      ]
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

  const handleLike = (commentId: string, parentId?: string) => {
    setComments(comments.map(comment => {
      if (parentId) {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies?.map(reply =>
              reply.id === commentId
                ? { ...reply, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1, isLiked: !reply.isLiked }
                : reply
            )
          };
        }
        return comment;
      } else {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          };
        }
        return comment;
      }
    }));
  };

  const handleReply = (commentId: string) => {
    if (!replyText.trim()) return;

    const newReply: Comment = {
      id: `${commentId}-${Date.now()}`,
      user: 'Bạn',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      text: replyText,
      likes: 0,
      time: 'Vừa xong',
      isLiked: false
    };

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      return comment;
    }));

    setReplyText('');
    setReplyingTo(null);
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: 'Bạn',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      text: newComment,
      likes: 0,
      time: 'Vừa xong',
      isLiked: false
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return 0;
  });

  const CommentItem = ({ comment, parentId }: { comment: Comment; parentId?: string }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);

    return (
      <div className="space-y-3">
        <div className="flex gap-3">
          <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-sm">{comment.user}</span>
              {comment.isAuthor && (
                <Badge variant="primary" className="text-xs">TÁC GIẢ</Badge>
              )}
              <span className="text-xs text-muted-foreground">{comment.time}</span>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-3 py-2 bg-input rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setIsEditing(false)}>
                    <Check className="w-4 h-4 mr-1" />
                    Lưu
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-foreground mb-2">{comment.text}</p>
            )}

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLike(comment.id, parentId)}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  comment.isLiked ? 'text-error' : 'text-muted-foreground hover:text-error'
                }`}
              >
                <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                {comment.likes > 0 && <span>{comment.likes}</span>}
              </button>

              {!parentId && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Trả lời
                </button>
              )}

              <div className="relative ml-auto">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-6 w-48 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden p-2">
                      {comment.user === 'Bạn' && (
                        <>
                          <button
                            onClick={() => { setIsEditing(true); setShowMenu(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm"
                          >
                            <Edit2 className="w-4 h-4" />
                            Chỉnh sửa
                          </button>
                          <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm text-error"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa
                          </button>
                        </>
                      )}
                      {comment.user !== 'Bạn' && (
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm">
                          <Flag className="w-4 h-4" />
                          Báo cáo
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reply Input */}
        {replyingTo === comment.id && (
          <div className="ml-13 space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Trả lời ${comment.user}...`}
              className="w-full px-3 py-2 bg-input rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
              rows={2}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleReply(comment.id)}>
                Gửi
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setReplyingTo(null); setReplyText(''); }}>
                Hủy
              </Button>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-13 space-y-4 pt-2 border-l-2 border-border pl-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} parentId={comment.id} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          Bình luận ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
        </h3>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'newest' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('newest')}
          >
            Mới nhất
          </Button>
          <Button
            variant={sortBy === 'popular' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('popular')}
          >
            Phổ biến
          </Button>
        </div>
      </div>

      {/* New Comment Input */}
      <div className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          rows={3}
        />
        <div className="flex justify-end">
          <Button onClick={handlePostComment} disabled={!newComment.trim()}>
            Đăng bình luận
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {sortedComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
