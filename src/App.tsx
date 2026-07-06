import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './hooks/useAuth';

const HomePage = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Calendar = lazy(() => import('./pages/Calendar'));
const OutfitsPage = lazy(() => import('./pages/OutfitsPage'));
const Filmography = lazy(() => import('./pages/Filmography'));
const FilmDetail = lazy(() => import('./pages/FilmDetail').then((module) => ({ default: module.FilmDetail })));
const Discography = lazy(() => import('./pages/Discography'));
const PerformancePage = lazy(() => import('./pages/Performance'));
const ContentPage = lazy(() => import('./pages/Content'));
const LoginPage = lazy(() => import('./pages/Login'));

export default function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 min-h-screen bg-brand-bg lg:ml-64 pt-16 lg:pt-0">
          <ScrollToTop />

          <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading...</div>}>
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
          </Suspense>
        </main>
      </div>
    </AuthProvider>
  );
}
