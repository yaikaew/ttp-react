import { useNavigate } from 'react-router-dom';
import {
    Users,
    Film,
    Disc3,
    ArrowRight,
    Database,
    ExternalLink,
    ArrowLeft,
    Calendar,
    PlayCircle,
    BookOpen,
    Video,
    Trophy,
    Tag,
} from 'lucide-react';

const tables = [
    { id: 'artist', name: 'ศิลปิน (Artists)', icon: Users, color: 'bg-blue-500' },
    { id: 'calendar', name: 'ตารางงาน (Calendar)', icon: Calendar, color: 'bg-indigo-500' },
    { id: 'filmography', name: 'ผลงานการแสดง (Film)', icon: Film, color: 'bg-purple-500' },
    { id: 'discography', name: 'ผลงานเพลง (Music)', icon: Disc3, color: 'bg-pink-500' },
    { id: 'performance', name: 'การแสดง (Performance)', icon: PlayCircle, color: 'bg-red-500' },
    { id: 'magazines', name: 'นิตยสาร (Magazines)', icon: BookOpen, color: 'bg-orange-500' },
    { id: 'endorsements', name: 'แบรนด์ (Endorsements)', icon: Tag, color: 'bg-emerald-500' },
    { id: 'contents', name: 'คอนเทนต์ (Contents)', icon: Video, color: 'bg-cyan-500' },
    { id: 'awards', name: 'รางวัล (Awards)', icon: Trophy, color: 'bg-amber-500' },
    { id: 'filmographydetail', name: 'รายละเอียดซีรีส์ (Film Detail)', icon: Database, color: 'bg-slate-700' },
    { id: 'filmographytrends', name: 'เทรนด์ (Trends)', icon: Database, color: 'bg-slate-700' },
];

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        /* เพิ่ม Wrapper หลักเพื่อให้แน่ใจว่า Scroll ได้ทุกอุปกรณ์ */
        <div className="min-h-screen w-full bg-slate-50 overflow-y-auto">
            <div className="p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-800 flex items-center gap-4">
                            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200 shrink-0">
                                <Database size={32} />
                            </div>
                            <span>Admin Dashboard</span>
                        </h1>
                        <p className="text-slate-500 mt-4 text-base md:text-lg leading-relaxed">
                            เลือกตารางข้อมูลที่ต้องการจัดการเพื่อ เริ่มต้นแก้ไข เพิ่ม หรือลบข้อมูล
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <ArrowLeft size={16} /> กลับไปยังหน้าเว็บไซต์
                    </button>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-12">
                    {tables.map((table) => (
                        <button
                            key={table.id}
                            onClick={() => navigate(`/admin/${table.id}`)}
                            className="group relative bg-white p-6 rounded-3xl md:rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 text-left overflow-hidden flex flex-col h-full"
                        >
                            {/* Background Accent */}
                            <div className={`absolute top-0 right-0 w-32 h-32 ${table.color} opacity-[0.03] rounded-bl-full group-hover:opacity-[0.06] transition-opacity`} />

                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-4 ${table.color} rounded-2xl text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-500`}>
                                    <table.icon size={24} />
                                </div>
                                <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <ExternalLink size={16} />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-2">{table.name}</h3>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Manage Data</span>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;