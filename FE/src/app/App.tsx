import { BrowserRouter, Routes, Route } from 'react-router';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { TrendingPage } from './pages/TrendingPage';
import { ComicDetailPage } from './pages/ComicDetailPage';
import { ReaderPage } from './pages/ReaderPage';
import { WalletPage } from './pages/WalletPage';
import { CreatorDashboard } from './pages/CreatorDashboard';
import { CreatorUploadChapterPage } from './pages/CreatorUploadChapterPage';
import { CreatorBlogEditorPage } from './pages/CreatorBlogEditorPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { PremiumPage } from './pages/PremiumPage';
import { LibraryPage } from './pages/LibraryPage';
import { CreatorRegistrationPage } from './pages/CreatorRegistrationPage';
import { SystemSettingsPage } from './pages/SystemSettingsPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { DemoTestCenterPage } from './pages/DemoTestCenterPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { ScrollToTop } from './components/layout/ScrollToTop';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground dark">
        <ScrollToTop />
        <Routes>
          <Route path="/read/:comicId/:chapterId" element={<ReaderPage />} />
          <Route
            path="*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/comic/:id" element={<ComicDetailPage />} />
                  <Route path="/wallet" element={<WalletPage />} />
                  <Route path="/premium" element={<PremiumPage />} />
                  <Route path="/library" element={<LibraryPage />} />
                  <Route path="/creator" element={<CreatorDashboard />} />
                  <Route path="/creator/upload" element={<CreatorUploadChapterPage />} />
                  <Route path="/creator/blog/new" element={<CreatorBlogEditorPage />} />
                  <Route path="/blog" element={<BlogListPage />} />
                  <Route path="/blog/:id" element={<BlogDetailPage />} />
                  <Route path="/creator/register" element={<CreatorRegistrationPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/settings" element={<SystemSettingsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/payment-success" element={<PaymentSuccessPage />} />
                  <Route path="/demo-test" element={<DemoTestCenterPage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/new" element={<ExplorePage />} />
                  <Route path="/category/:categoryName" element={<ExplorePage />} />
                  <Route path="/trending" element={<TrendingPage />} />

                </Routes>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}