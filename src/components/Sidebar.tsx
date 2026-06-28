import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
    Menu, X, Sparkles, Heart, Home, Video, PlayCircle, User, Calendar, Disc3, Film
} from "lucide-react"
import { useAuth } from '../hooks/useAuth'

const MENUS = [
    { name: 'Home', path: '/', icon: Home },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Outfits", path: "/outfits", icon: Heart },
    { name: "Filmography", path: "/filmography", icon: Film },
    { name: "Discography", path: "/discography", icon: Disc3 },
    { name: "Performance", path: "/performance", icon: PlayCircle },
    { name: "Content", path: "/content", icon: Video },
]

const Sidebar = () => {
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)

    // Handle Body Scroll & Resize
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : ""
    }, [isOpen])

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 1024) setIsOpen(false)
        }
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])

    const { session, signOut } = useAuth();

    // Styles from Template
    const activeClass = 'bg-nav-bg-hover text-brand-primary';
    const inactiveClass = 'text-nav-text hover:bg-nav-bg-hover';

    const handleLogout = async () => {
        try {
            await signOut();
        } catch {
            // ignore errors here
        }
    };

    return (
        <>
            {/* ================= Mobile Header ================= */}
            <div
                className="lg:hidden fixed top-0 w-full z-50 px-4 py-3 flex justify-between items-center
                            bg-brand-sidebar-bg/80 backdrop-blur-md
                            border-b border-brand-sidebar-border"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-brand-primary shadow-lg shadow-brand-primary/20">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <span className="font-black text-lg tracking-tighter">teeteepor</span>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-xl bg-card-bg text-content-text-sub active:scale-95 transition-transform"
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
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-brand-primary shadow-lg shadow-brand-primary/20">
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
                    </div>

                    {/* ================= Navigation ================= */}
                    <nav className="flex-1 space-y-1.5">
                        {MENUS.map(item => {
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
                        {session ? (
                            <div className="space-y-3">
                                <div className="px-4 py-3 rounded-2xl bg-nav-bg-hover text-xs font-semibold text-content-text-main">
                                    Signed in as
                                    <div className="font-bold text-sm text-brand-primary truncate">
                                        {session.user?.email ?? 'User'}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 rounded-2xl bg-brand-primary text-white text-sm font-bold hover:bg-brand-primary/90 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : null}

                        <a
                            href="https://x.com/yorkorrrr"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold
                            text-content-text-muted
                            hover:text-brand-primary hover:bg-nav-bg-hover transition-all"
                        >
                            <Heart size={18} className="text-red-400" />
                            <div className="leading-tight">
                                © Made with love<br />
                                <span className="opacity-70">By yorkor</span>
                            </div>
                        </a>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-65 lg:hidden bg-black/10 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}

export default Sidebar