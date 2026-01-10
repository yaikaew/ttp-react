import { useEffect, useState } from 'react';
import { Home, User, Film, Heart, Menu, X, ChevronRight, Sparkles, Disc3, PlayCircle, Calendar, BookOpen, Tag, Video, LogOut, Database } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

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
    ];

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const activeClass = "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50";
    const inactiveClass = "text-slate-500 hover:bg-slate-50 hover:text-slate-900";

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-60 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <span className="font-black text-lg text-slate-800 tracking-tighter">teeteepor</span>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-500 bg-slate-50 rounded-xl active:scale-95 transition-transform">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Container */}
            <aside className={`fixed inset-y-0 left-0 z-70 w-64 bg-white border-r border-slate-100 transform transition-transform duration-500 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full p-6">

                    {/* Logo Section */}
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xl tracking-tighter text-slate-800 leading-none">teeteepor</span>
                            <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">Fan Station</span>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 space-y-1.5">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${isActive ? activeClass : inactiveClass}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
                                        <span className="text-sm">{item.name}</span>
                                    </div>

                                    {/* Indicator เส้นแนวตั้ง */}
                                    {isActive ? (
                                        <ChevronRight size={14} className="opacity-50" />
                                    ) : (
                                        <div className="w-1 h-1 rounded-full bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}

                                    {/* เส้นสี Indigo ด้านหน้าเวลา Active */}
                                    {isActive && (
                                        <div className="absolute left-0 w-1 h-5 bg-indigo-600 rounded-r-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer Sidebar */}
                    <div className="pt-6 space-y-2 border-t border-slate-50">
                        {user && (
                            <div className="px-2 mb-4">
                                <Link to="/admin" className="flex items-center gap-3 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 mb-2 hover:bg-indigo-50 transition-all group/admin">
                                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-lg shadow-indigo-200 group-hover/admin:scale-110 transition-transform">
                                        <Database size={16} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Admin Dashboard</span>
                                        <span className="text-xs font-bold text-slate-700 truncate">{user.email}</span>
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-xs"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}

                        <a
                            href="https://x.com/yorkorrrr"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all font-bold text-xs"
                        >
                            <Heart size={18} />
                            <span>© Made with love<br />By yorkor</span>
                        </a>
                    </div>
                </div>
            </aside>

            {/* Overlay สำหรับมือถือ */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-65 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;