import { useMemo } from "react";
import { Calendar, Clock, MapPin, Star, Video, ArrowUpRight, Play, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useCalendar } from '../hooks/useCalendar';
import { useAdminAuth } from "../hooks/useAdminAuth";
import { supabase } from "../lib/supabaseClient";
import { LoadingState } from "../components/LoadingState";

const RECOMMENDED_LIST = [
    {
        id: 1,
        title: "Duang With You",
        desc: "ซีรีส์ที่กำลังออนแอร์อยู่ตอนนี้",
        tag: "On-Air",
        img: "https://img.youtube.com/vi/oyzFXVWqotQ/maxresdefault.jpg",
        link: "https://youtu.be/oyzFXVWqotQ",
    },
    {
        id: 2,
        title: "จันทร์ไรจรรโลง EP14 | ป๋อ ศุภการ",
        desc: "",
        tag: "Highlight",
        img: "https://img.youtube.com/vi/FaMLbEolDRo/maxresdefault.jpg",
        link: "https://youtu.be/FaMLbEolDRo",
    },
    {
        id: 3,
        title: "จันทร์ไรจรรโลง EP27 | ตี๋ตี๋ วันพิชิต",
        desc: "",
        tag: "Highlight",
        img: "https://img.youtube.com/vi/Kp35vGWMSkI/maxresdefault.jpg",
        link: "https://youtu.be/Kp35vGWMSkI",
    },
];

const HomePage = () => {
    const { user } = useAdminAuth();
    const { schedule, loading } = useCalendar();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const upcomingEvents = useMemo(() => {
        if (!schedule) return [];
        const today = new Date().setHours(0, 0, 0, 0);
        return schedule
            .filter((item) => new Date(item.date).setHours(0, 0, 0, 0) >= today)
            .slice(0, 3);
    }, [schedule]);

    if (loading) return <LoadingState />;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen space-y-16">
            {/* ================= Header ================= */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-card-border pb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-content-text-main">
                        TeeteePor <span className="text-brand-primary">Hub</span>
                    </h1>
                    <p className="text-content-text-muted text-sm font-bold mt-1 tracking-wide uppercase italic">
                        Official Artist Monitoring Dashboard
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {user && (
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-2xl border flex items-center gap-2 bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-bold text-xs"
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    )}

                    <div className="px-4 py-2 rounded-2xl border flex items-center gap-2 bg-card-bg border-card-border">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-content-text-muted uppercase tracking-widest">
                            Live Updates
                        </span>
                    </div>
                </div>
            </div>

            {/* ================= Highlight ================= */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-badge-bg text-badge-text">
                        <Star className="w-5 h-5 fill-current" />
                    </div>
                    <h2 className="text-xl font-black text-content-text-main">
                        Highlight Content
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {RECOMMENDED_LIST.map((item) => (
                        <a
                            key={item.id}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative h-64 rounded-[2.5rem] overflow-hidden border border-card-border shadow-sm hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500"
                        >
                            <img
                                src={item.img}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />

                            <div
                                className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent
                                p-8 flex flex-col justify-end"
                            >
                                <span
                                    className="inline-flex items-center justify-center
                                    text-[9px] font-black uppercase tracking-wider
                                    px-2 py-0.5 rounded-full
                                    bg-white/20 backdrop-blur border border-white/20 text-white
                                    w-fit leading-none"
                                >
                                    {item.tag}
                                </span>

                                <h3
                                    className="text-white font-black text-xl leading-tight
                                    group-hover:text-brand-primary transition-colors"
                                >
                                    {item.title}
                                </h3>

                                {item.desc && (
                                    <p className="text-white/60 text-xs mt-2 italic line-clamp-1">
                                        {item.desc}
                                    </p>
                                )}

                                <div
                                    className="absolute top-6 right-6 opacity-0
                                    group-hover:opacity-100 transition-all translate-x-2
                                    group-hover:translate-x-0"
                                >
                                    <div className="bg-white/90 p-3 rounded-full text-brand-primary">
                                        <Play size={18} fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* ================= Upcoming ================= */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-brand-primary-light text-brand-primary">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-black text-content-text-main">
                            Upcoming Schedules
                        </h2>
                    </div>

                    <Link
                        to="/calendar"
                        className="group flex items-center gap-2 text-[11px] font-black text-brand-primary uppercase tracking-widest hover:text-brand-primary-hover transition"
                    >
                        Full Calendar
                        <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {upcomingEvents.length > 0 ? (
                        upcomingEvents.map((item, idx) => {
                            const artistData = Array.isArray(item.artist) ? item.artist[0] : item.artist;
                            const artistName = artistData?.name || 'Unknown';
                            return (
                                <div
                                    key={item.id}
                                    className={`group rounded-4xl p-6 border transition-all duration-500
                                                bg-card-bg border-card-border
                                                hover:shadow-xl hover:shadow-brand-primary/10
                                                ${idx === 0 ? "ring-4 ring-brand-primary/10" : ""}`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                        {/* Date */}
                                        <div
                                            className={`w-16 h-16 rounded-3xl flex flex-col items-center justify-center
                                                font-black shrink-0 border
                                                ${idx === 0
                                                    ? "bg-brand-primary text-white border-brand-primary"
                                                    : "bg-filter-input-bg text-content-text-muted border-card-border"
                                                }`}
                                        >
                                            <span className="text-[10px] uppercase opacity-80">
                                                {new Date(item.date).toLocaleString("en-US", {
                                                    month: "short",
                                                })}
                                            </span>
                                            <span className="text-2xl leading-none">
                                                {new Date(item.date).getDate()}
                                            </span>
                                        </div>

                                        {/* Info */}
                                        <div className="grow">
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                <span
                                                    className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest
                                                            bg-filter-input-bg border border-card-border rounded-lg
                                                            text-content-text-muted"
                                                >
                                                    {artistName}
                                                </span>

                                                {idx === 0 && (
                                                    <span
                                                        className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest
                                                                bg-brand-primary-light text-brand-primary border border-brand-primary/20
                                                                rounded-lg animate-pulse"
                                                    >
                                                        Next Priority
                                                    </span>
                                                )}
                                            </div>

                                            <h3
                                                className={`font-black leading-tight
                                                ${idx === 0 ? "text-xl" : "text-lg"}
                                                text-content-text-main group-hover:text-brand-primary transition-colors`}
                                            >
                                                {item.name}
                                            </h3>

                                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-[11px] font-bold text-content-text-muted">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-brand-primary" />
                                                    {item.time || "TBA"}
                                                </div>

                                                {item.location && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                                                        {item.location}
                                                    </div>
                                                )}

                                                {item.live_platform && (
                                                    <div className="flex items-center gap-2">
                                                        <Video className="w-3.5 h-3.5 text-brand-primary" />
                                                        {item.live_platform}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <Link to="/calendar" className="md:ml-auto">
                                            <button
                                                className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest
                                                bg-filter-input-bg text-content-text-muted
                                                hover:bg-brand-primary hover:text-white transition"
                                            >
                                                View Detail
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="rounded-[3rem] p-20 text-center border border-dashed border-card-border bg-card-bg">
                            <p className="text-content-text-muted italic">
                                No schedules available right now.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
