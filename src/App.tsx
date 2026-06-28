import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/Home';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import OutfitsPage from './pages/OutfitsPage';
import Filmography from './pages/Filmography';
import { FilmDetail } from './pages/FilmDetail';
import Discography from './pages/Discography';
import PerformancePage from './pages/Performance';
import ContentPage from './pages/Content';
import LoginPage from './pages/Login';
import { AuthProvider } from './hooks/useAuth';

export default function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 min-h-screen bg-brand-bg lg:ml-64 pt-16 lg:pt-0">
          <ScrollToTop />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/outfits" element={<OutfitsPage />} />
            <Route path="/filmography" element={<Filmography />} />
            <Route path="/filmography/:id" element={<FilmDetail />} />
            <Route path="/discography" element={<Discography />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
