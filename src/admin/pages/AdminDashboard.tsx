import { useNavigate } from 'react-router-dom';
import {
    Users,
    Calendar,
    Film,
    Disc3,
    PlayCircle,
    BookOpen,
    Tag,
    Video,
    ArrowRight,
    Database,
    ExternalLink,
    ArrowLeft,
    Trophy
} from 'lucide-react';

const tables = [
    { id: 'artist', name: 'ศิลปิน (Artists)', icon: Users, color: 'bg-blue-500', count: '...', description: 'จัดการรายชื่อและข้อมูลศิลปิน' },
    { id: 'calendar', name: 'ตารางงาน (Calendar)', icon: Calendar, color: 'bg-indigo-500', count: '...', description: 'จัดการตารางงาน กิจกรรมต่าง ๆ' },
    { id: 'filmography', name: 'ผลงานการแสดง (Film)', icon: Film, color: 'bg-purple-500', count: '...', description: 'จัดการข้อมูลภาพยนตร์และซีรีส์' },
    { id: 'discography', name: 'ผลงานเพลง (Music)', icon: Disc3, color: 'bg-pink-500', count: '...', description: 'จัดการข้อมูลอัลบั้มและซิงเกิล' },
    { id: 'performance', name: 'การแสดง (Performance)', icon: PlayCircle, color: 'bg-red-500', count: '...', description: 'จัดการข้อมูลการขึ้นเวทีโชว์' },
    { id: 'magazines', name: 'นิตยสาร (Magazines)', icon: BookOpen, color: 'bg-orange-500', count: '...', description: 'จัดการข้อมูลนิตยสารที่ขึ้นปก' },
    { id: 'endorsements', name: 'แบรนด์ (Endorsements)', icon: Tag, color: 'bg-emerald-500', count: '...', description: 'จัดการรายชื่อแบรนด์ที่เป็นพรีเซนเตอร์' },
    { id: 'contents', name: 'คอนเทนต์ (Contents)', icon: Video, color: 'bg-cyan-500', count: '...', description: 'จัดการวิดีโอและคอนเทนต์ต่าง ๆ' },
    { id: 'awards', name: 'รางวัล (Awards)', icon: Trophy, color: 'bg-amber-500', count: '...', description: 'จัดการรางวัลและการเสนอชื่อเข้าชิง' },
    { id: 'filmographydetail', name: 'รายละเอียดซีรีส์ (Film Detail)', icon: Database, color: 'bg-slate-700', count: '...', description: 'จัดการข้อมูลเชิงลึก พิกัดเทรน และ Trailer' },
];

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200">
                            <Database size={32} />
                        </div>
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-500 mt-4 text-lg">เลือกตารางข้อมูลที่ต้องการจัดการเพื่อ เริ่มต้นแก้ไข เพิ่ม หรือลบข้อมูล</p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                >
                    <ArrowLeft size={16} /> กลับไปยังหน้าเว็บไซต์
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tables.map((table) => (
                    <button
                        key={table.id}
                        onClick={() => navigate(`/admin/${table.id}`)}
                        className="group relative bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
                    >
                        {/* Background Accent */}
                        <div className={`absolute top-0 right-0 w-32 h-32 ${table.color} opacity-[0.03] rounded-bl-full group-hover:opacity-[0.06] transition-opacity`} />

                        <div className="flex items-start justify-between mb-6">
                            <div className={`p-4 ${table.color} rounded-2xl text-white shadow-lg shadow-${table.color.split('-')[1]}-200 group-hover:scale-110 transition-transform duration-500`}>
                                <table.icon size={24} />
                            </div>
                            <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <ExternalLink size={16} />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mb-2">{table.name}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">{table.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Manage Data</span>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
