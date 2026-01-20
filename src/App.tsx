import { Routes, Route, useLocation } from "react-router-dom"
import ScrollToTop from './components/ScrollToTop';
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import CalendarPage from './pages/CalendarPage'
import CalendarTablePage from './pages/CalendarTablePage'
import FilmographyPage from './pages/FilmographyPage'
import DiscographyPage from './pages/DiscographyPage'
import PerformancePage from './pages/PerformancePage'
import MagazinePage from './pages/MagazinePage'
import BrandEndorsementPage from './pages/BrandEndorsementPage'
import ContentPage from './pages/ContentPage'
import AwardsPage from './pages/AwardsPage'
import FilmographyDetailPage from './pages/FilmographyDetailPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './admin/pages/AdminDashboard'
import ManagementPage from './admin/pages/ManagementPage'
import { useAuth } from './hooks/useAuth'
import { Navigate } from 'react-router-dom'
import OutfitsPage from "./pages/OutfitsPage";

// Protected Route for Admin
const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      {!isLoginPage && !isAdminPath && <Sidebar />}
      <main className={`flex-1 min-h-screen ${!isLoginPage && !isAdminPath ? "bg-brand-bg lg:ml-64 pt-16 lg:pt-0" : "bg-slate-50"}`}>
        <div className={(isLoginPage || isAdminPath) ? '' : 'max-w-7xl mx-auto'}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

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

            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/calendar-table" element={<CalendarTablePage />} />
            <Route path="/outfits" element={<OutfitsPage />} />
            <Route path="/filmography" element={<FilmographyPage />} />
            <Route path="/filmography/:id" element={<FilmographyDetailPage />} />
            <Route path="/discography" element={<DiscographyPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/magazines" element={<MagazinePage />} />
            <Route path="/endorsements" element={<BrandEndorsementPage />} />
            <Route path="/awards" element={<AwardsPage />} />
            <Route path="/content" element={<ContentPage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App