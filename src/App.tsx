import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from "./hooks/useAdminAuth"
import { PageLoader } from "./components/PageLoader";
import { FilmDetail } from './pages/FilmDetail';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import Filmography from './pages/Filmography';
import LoginPage from './admin/pages/LoginPage';
import AdminDashboard from './admin/pages/AdminDashboard';
import ManagementPage from './admin/pages/ManagementPage';
import ScrollToTop from './components/ScrollToTop';
import CalendarPage from './pages/Calendar';
import Magazine from './pages/Magazine';
import Content from './pages/Content';
import Performance from './pages/Performance';
import Discography from './pages/Discography';
import HomePage from './pages/HomePage';
import BrandEndorsementPage from './pages/BrandEndorsementPage';
import AwardsPage from './pages/AwardsPage';
import OutfitsPage from './pages/OutfitsPage';

const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAdminAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen">
      {!isLoginPage && !isAdminPath && <Sidebar />}

      <main className={`flex-1 min-h-screen ${!isLoginPage && !isAdminPath
        ? "bg-brand-bg lg:ml-64 pt-16 lg:pt-0"
        : "bg-slate-50"
        }`}>
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/outfits" element={<OutfitsPage />} />
          <Route path="/discography" element={<Discography />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/filmography" element={<Filmography />} />
          <Route path="/filmography/:id" element={<FilmDetail />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/content" element={<Content />} />
          <Route path="/endorsements" element={<BrandEndorsementPage />} />
          <Route path="/awards" element={<AwardsPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedAdmin>
              <AdminDashboard />
            </ProtectedAdmin>
          } />
          <Route path="/admin/:tableName" element={
            <ProtectedAdmin>
              <ManagementPage />
            </ProtectedAdmin>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;