import { useEffect, useState } from 'react';
import {
    Home,
    User,
    Film,
    Heart,
    Menu,
    X,
    Sparkles,
    Disc3,
    PlayCircle,
    Calendar,
    BookOpen,
    Tag,
    Video,
    LogOut,
    Database,
    Trophy,
    Sun,
    Moon,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
    const location = useLocation();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    /* ================= Theme ================= */
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        const html = document.documentElement;
        if (isDark) {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(v => !v);

    /* ================= Logout ================= */
    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    /* ================= Menu ================= */
    const menuItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Calendar', path: '/calendar', icon: Calendar },
        { name: 'Filmography', path: '/filmography', icon: Film },
        { name: 'Discography', path: '/discography', icon: Disc3 },
        { name: 'Performance', path: '/performance', icon: PlayCircle },
        { name: 'Content', path: '/content', icon: Video },
        { name: 'Magazines', path: '/magazines', icon: BookOpen },
        { name: 'Endorsements', path: '/endorsements', icon: Tag },
        { name: 'Awards', path: '/awards', icon: Trophy },
    ];

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const activeClass = 'bg-nav-bg-hover text-brand-primary';
    const inactiveClass = 'text-nav-text hover:bg-nav-bg-hover';

    return (
        <>
            {/* ================= Mobile Header ================= */}
            <div
                className="lg:hidden fixed top-0 w-full z-60 px-4 py-3 flex justify-between items-center
        bg-brand-sidebar-bg/80 backdrop-blur-md
        border-b border-brand-sidebar-border"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-brand-primary">
                        <Sparkles size={16} className="text-white" />
                    </div>

                    <span className="font-black text-lg tracking-tighter">teeteepor</span>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-xl bg-card-bg text-content-text-sub active:scale-95"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* ================= Sidebar ================= */}
            <aside
                className={`fixed inset-y-0 left-0 z-70 w-64
        bg-brand-sidebar-bg
        border-r border-brand-sidebar-border
        transition-transform duration-500
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
            >
                <div className="flex flex-col h-full p-6 overflow-y-auto">

                    {/* ================= Logo + Theme ================= */}
                    <div className="flex items-center justify-between mb-10 px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-brand-primary">
                                <Sparkles size={20} className="text-white" />
                            </div>

                            <div>
                                <div className="font-black text-xl tracking-tighter">
                                    teeteepor
                                </div>
                                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-content-text-muted">
                                    Fan Station
                                </div>
                            </div>
                        </div>

                        {/* Theme Toggle (Desktop – beside logo) */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl
                bg-card-bg text-content-text-sub
                hover:bg-nav-bg-hover transition"
                            title="Toggle theme"
                        >
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                    </div>

                    {/* ================= Navigation ================= */}
                    <nav className="flex-1 space-y-1.5">
                        {menuItems.map(item => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl
                    font-bold text-sm transition-all
                    ${isActive ? activeClass : inactiveClass}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon
                                            size={20}
                                            className={isActive ? 'text-brand-primary' : 'text-nav-icon'}
                                        />
                                        {item.name}
                                    </div>

                                    {isActive && (
                                        <div className="absolute left-0 w-1 h-5 rounded-r-full bg-brand-primary" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* ================= Footer ================= */}
                    <div className="pt-6 space-y-3 border-t border-brand-sidebar-border">
                        {user && (
                            <div className="px-2">
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-3 p-3 rounded-2xl border
                    bg-brand-primary-light border-filter-border"
                                >
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center
                    bg-brand-primary text-white">
                                        <Database size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-content-text-header">
                                            Admin Dashboard
                                        </div>
                                        <div className="text-xs font-bold truncate">
                                            {user.email}
                                        </div>
                                    </div>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-2xl
                    text-xs font-bold text-red-500 hover:bg-red-500/10"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        )}

                        <a
                            href="https://x.com/yorkorrrr"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold
                text-content-text-muted
                hover:text-brand-primary hover:bg-nav-bg-hover"
                        >
                            <Heart size={18} />
                            © Made with love<br />By yorkor
                        </a>
                    </div>
                </div>
            </aside>

            {isOpen && (
                <div
                    className="fixed inset-0 z-65 lg:hidden bg-black/10 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
