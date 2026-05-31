import { Lock, CheckCircle, Coins, Eye } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Link } from 'react-router';

interface ChapterRowProps {
  id?: string;
  chapterId?: string;
  comicId: string;
  number: number;
  title: string;
  date: string;
  views: number;
  status: 'free' | 'owned' | 'locked' | 'premium';
  price?: number;
}

export function ChapterRow({ id, chapterId, comicId, number, title, date, views, status, price }: ChapterRowProps) {
  const targetChapterId = chapterId ?? id ?? String(number);
  const statusIcons = {
    free: <CheckCircle className="w-4 h-4 text-success" />,
    owned: <CheckCircle className="w-4 h-4 text-secondary" />,
    locked: <Lock className="w-4 h-4 text-muted-foreground" />,
    premium: <Lock className="w-4 h-4 text-primary" />
  };

  const statusLabels = {
    free: 'MIỄN PHÍ',
    owned: 'ĐÃ MUA',
    locked: 'TRẢ COIN',
    premium: 'PREMIUM'
  };

  const isClickable = status === 'free' || status === 'owned';

  const content = (
    <div className={`flex items-center justify-between p-4 bg-card border border-border rounded-xl ${isClickable ? 'hover:border-primary/50 hover:bg-card/80 cursor-pointer' : 'opacity-70'} transition-all`}>
      <div className="flex items-center gap-4 flex-1">
        {statusIcons[status]}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Chương {number}</span>
            <Badge variant={status}>{statusLabels[status]}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{title}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {views.toLocaleString()}
        </span>
        <span className="hidden sm:inline">{date}</span>
        {(status === 'locked' || status === 'premium') && price && (
          <span className="flex items-center gap-1 text-primary font-semibold">
            <Coins className="w-4 h-4" />
            {price}
          </span>
        )}
      </div>
    </div>
  );

  if (isClickable) {
    return <Link to={`/read/${comicId}/${targetChapterId}`}>{content}</Link>;
  }

  return content;
}
