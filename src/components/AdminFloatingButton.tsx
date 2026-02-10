import { Plus } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

const routeToTable: Record<string, string> = {
    '/calendar': 'calendar',
    '/outfits': 'calendar',
    '/filmography': 'filmography',
    '/discography': 'discography',
    '/performance': 'performance',
    '/magazine': 'magazines',
    '/content': 'contents',
    '/endorsements': 'endorsements',
    '/awards': 'awards',
};

export const AdminFloatingButton = () => {
    const { user, loading } = useAdminAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // ไม่แสดงถ้ากำลังโหลด หรือไม่ได้ล็อกอิน หรืออยู่ในหน้า admin/login
    if (loading || !user || location.pathname.startsWith('/admin') || location.pathname === '/login') {
        return null;
    }

    let tableName = routeToTable[location.pathname];
    let queryParams = `?add=true&redirect=${encodeURIComponent(location.pathname + location.search)}`;

    // กรณีหน้า FilmDetail
    if (location.pathname.startsWith('/filmography/') && id) {
        tableName = 'filmographytrends';
        queryParams += `&filmography_id=${id}`;
    }

    if (!tableName) return null;

    return (
        <button
            onClick={() => navigate(`/admin/${tableName}${queryParams}`)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-brand-primary rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all z-60 hover:scale-105 active:scale-95 group border border-white/20 dark:border-white/10"
            title={`เพิ่มข้อมูล ${tableName}`}
        >
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />

            {/* Minimal Label Tag */}
            <div className="absolute right-full mr-3 px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-brand-primary dark:text-brand-primary-light text-[10px] font-black uppercase tracking-[0.15em] rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-sm border border-brand-primary/10">
                Add {tableName}
            </div>

            {/* Subtle Pulse Effect */}
            <div className="absolute inset-0 rounded-full bg-brand-primary/10 animate-ping group-hover:hidden opacity-40" />
        </button>
    );
};
