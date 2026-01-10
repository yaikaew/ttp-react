import './App.css'
import { Routes, Route } from "react-router-dom"
import ScrollToTop from './components/ScrollToTop';
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import CalendarPage from './pages/CalendarPage'
import FilmographyPage from './pages/FilmographyPage'
import DiscographyPage from './pages/DiscographyPage'
import PerformancePage from './pages/PerformancePage'
import MagazinePage from './pages/MagazinePage'
import BrandEndorsementPage from './pages/BrandEndorsementPage'
import ContentPage from './pages/ContentPage'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-baijamjuree">
      <ScrollToTop />
      <Sidebar />
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/filmography" element={<FilmographyPage />} />
            <Route path="/discography" element={<DiscographyPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/magazines" element={<MagazinePage />} />
            <Route path="/endorsements" element={<BrandEndorsementPage />} />
            <Route path="/content" element={<ContentPage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App