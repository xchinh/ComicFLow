import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ArrowUp } from 'lucide-react';

function isReaderChapterPath(pathname: string) {
  return pathname.startsWith('/read/');
}

export function ScrollToTop() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const isReaderPage = isReaderChapterPath(location.pathname);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 480);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label="Cuộn lên đầu trang"
      title="Cuộn lên đầu trang"
      onClick={handleClick}
      className={`fixed right-4 sm:right-6 ${isReaderPage ? 'bottom-24 sm:bottom-28' : 'bottom-6'} z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-card/90 text-primary shadow-2xl shadow-primary/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-primary hover:text-primary-foreground ${
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
