import { Star, Eye, Coins } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Link } from 'react-router';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ComicCardProps {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  views: number;
  pricePerChapter: number;
  genres: string[];
  status?: 'free' | 'premium' | 'hot' | 'new';
}

export function ComicCard({ id, title, author, cover, rating, views, pricePerChapter, genres, status }: ComicCardProps) {
  const formatViews = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Link to={`/comic/${id}`} className="group block">
      <div className="bg-card rounded-2xl border border-border p-3 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
          <ImageWithFallback src={cover} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {status && (
            <div className="absolute top-3 right-3">
              <Badge variant={status}>{status.toUpperCase()}</Badge>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="pt-4 px-1 pb-1 space-y-2">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground">{author}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {genres.slice(0, 2).map((genre) => (
              <span key={genre} className="text-xs px-2 py-1 bg-muted/50 rounded-md text-muted-foreground">
                {genre}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-warning text-warning" />
                {rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatViews(views)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-primary">
              <Coins className="w-4 h-4" />
              {pricePerChapter}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
