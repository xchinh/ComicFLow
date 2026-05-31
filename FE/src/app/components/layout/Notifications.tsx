import { useState } from 'react';
import { Bell, BellOff, X, BookOpen, Coins, Crown, AlertCircle, Heart, MessageCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';
import { Card } from '../ui/Card';

interface Notification {
  id: string;
  type: 'update' | 'coin' | 'premium' | 'like' | 'comment' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'update',
      title: 'Chương mới đã ra!',
      message: 'Học Viện Ánh Trăng - Chương 46 vừa được cập nhật',
      time: '5 phút trước',
      read: false,
      link: '/comic/1'
    },
    {
      id: '2',
      type: 'coin',
      title: 'Nhận thưởng Coin',
      message: 'Bạn đã hoàn thành nhiệm vụ đọc 3 chương. Nhận +10 Coin',
      time: '2 giờ trước',
      read: false
    },
    {
      id: '3',
      type: 'premium',
      title: 'Ưu đãi Premium',
      message: 'Giảm 30% cho gói Premium tháng đầu. Chỉ còn 3 ngày!',
      time: '1 ngày trước',
      read: false,
      link: '/premium'
    },
    {
      id: '4',
      type: 'like',
      title: 'Bình luận của bạn được thích',
      message: 'Minh Anh và 15 người khác đã thích bình luận của bạn',
      time: '2 ngày trước',
      read: true
    },
    {
      id: '5',
      type: 'comment',
      title: 'Tác giả trả lời bình luận',
      message: 'An Nhiên Studio đã trả lời bình luận của bạn trong "Học Viện Ánh Trăng"',
      time: '3 ngày trước',
      read: true
    },
    {
      id: '6',
      type: 'system',
      title: 'Bảo trì hệ thống',
      message: 'Hệ thống sẽ bảo trì vào 02:00 - 04:00 ngày 10/05/2026',
      time: '4 ngày trước',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'update': return BookOpen;
      case 'coin': return Coins;
      case 'premium': return Crown;
      case 'like': return Heart;
      case 'comment': return MessageCircle;
      case 'system': return AlertCircle;
      default: return Bell;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'update': return 'text-primary bg-primary/10';
      case 'coin': return 'text-warning bg-warning/10';
      case 'premium': return 'text-secondary bg-secondary/10';
      case 'like': return 'text-error bg-error/10';
      case 'comment': return 'text-success bg-success/10';
      case 'system': return 'text-muted-foreground bg-muted/50';
      default: return 'text-foreground bg-muted';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center hover:bg-muted rounded-xl transition-all"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 w-96 max-h-[600px] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden p-3">
            {/* Header */}
            <div className="sticky top-0 bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold">Thông báo</h3>
                {unreadCount > 0 && (
                  <Badge variant="hot">{unreadCount} mới</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[500px] py-3">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Không có thông báo nào</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => {
                    const Icon = getIcon(notification.type);
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all cursor-pointer group ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => {
                          markAsRead(notification.id);
                          if (notification.link) {
                            window.location.href = notification.link;
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getColor(notification.type)}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-sm line-clamp-1">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {notification.time}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-error hover:text-error/80 transition-all"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="sticky bottom-0 bg-card border border-border rounded-xl p-3">
                <button className="w-full text-sm text-primary hover:underline font-semibold">
                  Xem tất cả thông báo
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
