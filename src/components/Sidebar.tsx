import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
    Menu, X, Sparkles, Database, LogOut, Sun, Moon, Heart,
    Home, BookOpen, Tag, Trophy,
    User,
    Calendar,
    Film,
    Disc3,
    PlayCircle,
    Video
} from "lucide-react"
import { useAdminAuth } from "../hooks/useAdminAuth"
import { supabase } from "../lib/supabaseClient"

/* -------------------------------------------------------------------------- */
/* Types & Constants                                                           */
/* -------------------------------------------------------------------------- */

const MENUS = [
    { name: 'Home', path: '/', icon: Home },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Filmography", path: "/filmography", icon: Film },
    { name: "Discography", path: "/discography", icon: Disc3 },
    { name: "Performance", path: "/performance", icon: PlayCircle },
    { name: "Content", path: "/content", icon: Video },
    { name: "Magazine", path: "/magazine", icon: BookOpen },
    { name: 'Endorsements', path: '/endorsements', icon: Tag },
    { name: 'Awards', path: '/awards', icon: Trophy },
]

const Sidebar = () => {
    const { user } = useAdminAuth()
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)

    // Theme Logic
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof window === "undefined") return false
        return localStorage.getItem("theme") === "dark"
    })

    useEffect(() => {
        const root = document.documentElement
        if (isDark) {
            root.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            root.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }, [isDark])

    const toggleTheme = () => setIsDark(!isDark)

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

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) alert(error.message)
        else window.location.reload()
    }

    // Styles from Template
    const activeClass = 'bg-nav-bg-hover text-brand-primary';
    const inactiveClass = 'text-nav-text hover:bg-nav-bg-hover';

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

                        {/* Theme Toggle */}
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
                        {user && (
                            <div className="px-2">
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-2xl border
                                    bg-brand-primary-light border-brand-sidebar-border hover:opacity-90 transition"
                                >
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center
                                    bg-brand-primary text-white shadow-sm">
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
                                    text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
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