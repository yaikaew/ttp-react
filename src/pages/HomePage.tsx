import { useMemo } from 'react';
import { Calendar, Clock, MapPin, Star, Video, ArrowUpRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCalendarEvents } from '../hooks/useArtistData';

const RECOMMENDED_LIST = [
    {
        id: 1,
        title: "Duang With You",
        desc: "ซีรีส์ที่กำลังออนแอร์อยู่ตอนนี้",
        tag: "On-Air",
        img: "https://img.youtube.com/vi/oyzFXVWqotQ/maxresdefault.jpg",
        link: "https://youtu.be/oyzFXVWqotQ"
    },
    {
        id: 2,
        title: "จันทร์ไรจรรโลง EP14 | ป๋อ ศุภการ",
        desc: "",
        tag: "Highlight",
        img: "https://img.youtube.com/vi/FaMLbEolDRo/maxresdefault.jpg",
        link: "https://youtu.be/FaMLbEolDRo"
    },
    {
        id: 3,
        title: "จันทร์ไรจรรโลง EP27 | ตี๋ตี๋ วันพิชิต",
        desc: "",
        tag: "Highlight",
        img: "https://img.youtube.com/vi/Kp35vGWMSkI/maxresdefault.jpg",
        link: "https://youtu.be/Kp35vGWMSkI"
    }
];

const HomePage = () => {
    const { data: allSchedules, isLoading: isCalendarLoading } = useCalendarEvents('asc');

    const upcomingEvents = useMemo(() => {
        if (!allSchedules) return [];
        const today = new Date().setHours(0, 0, 0, 0);
        return allSchedules
            .filter(item => new Date(item.date).setHours(0, 0, 0, 0) >= today)
            .slice(0, 3);
    }, [allSchedules]);

    if (isCalendarLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-2 border-indigo-100 border-t-indigo-400 rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Loading Archives</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-baijamjuree pb-20">
            <div className="max-w-[1400px] mx-auto px-6 pt-10 space-y-16">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">
                            TeeteePor <span className="text-indigo-600">Hub</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-bold mt-1 tracking-wide uppercase italic opacity-70">
                            Official Artist Monitoring Dashboard
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 flex items-center gap-2 shadow-sm">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Updates</span>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 1: RECOMMENDED --- */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-xl">
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Highlight Content</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {RECOMMENDED_LIST.map((item) => (
                            <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer"
                                className="group relative h-64 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 border border-white">
                                <img src={item.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent p-8 flex flex-col justify-end">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[9px] font-black bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full tracking-widest border border-white/20 uppercase">
                                            {item.tag}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-black text-xl leading-tight group-hover:text-indigo-300 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-white/60 text-xs mt-2 font-medium line-clamp-1 italic">
                                        {item.desc}
                                    </p>
                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full text-indigo-600">
                                            <Play size={18} fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                {/* --- SECTION 2: UPCOMING SCHEDULES --- */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Upcoming Schedules</h2>
                        </div>
                        <Link to="/calendar" className="group flex items-center gap-2 text-[11px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors">
                            Full Calendar <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                        {upcomingEvents.length > 0 ? upcomingEvents.map((item, idx) => (
                            <div key={item.id} className={`group relative bg-white rounded-4xl p-6 border transition-all duration-500 hover:shadow-xl hover:shadow-indigo-100/30 ${idx === 0 ? 'border-indigo-100 ring-4 ring-indigo-50/50' : 'border-slate-100 hover:border-indigo-100'}`}>
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    {/* Date Column */}
                                    <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-3xl shrink-0 shadow-sm border ${idx === 0 ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                        <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">{new Date(item.date).toLocaleString('en-US', { month: 'short' })}</span>
                                        <span className="text-2xl font-black leading-none">{new Date(item.date).getDate()}</span>
                                    </div>

                                    {/* Info Column */}
                                    <div className="grow">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="px-2.5 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-black rounded-lg border border-slate-100 uppercase tracking-widest">
                                                {item.artistName}
                                            </span>
                                            {idx === 0 && (
                                                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-lg border border-indigo-100 uppercase tracking-widest animate-pulse">
                                                    Next Priority
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={`font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors ${idx === 0 ? 'text-xl' : 'text-lg'}`}>
                                            {item.name}
                                        </h3>

                                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                                <Clock className="w-3.5 h-3.5 text-indigo-400" /> {item.time || 'TBA'}
                                            </div>
                                            {item.location && (
                                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {item.location}
                                                </div>
                                            )}
                                            {item.live && (
                                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                                    <Video className="w-3.5 h-3.5 text-indigo-400" /> {item.live}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Column */}
                                    <div className="md:ml-auto">
                                        <Link to="/calendar">
                                            <button className="w-full md:w-auto px-6 py-3 bg-slate-50 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300">
                                                View Detail
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
                                <p className="text-slate-400 text-sm italic font-medium">No schedules available right now.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;