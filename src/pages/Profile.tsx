import React from 'react';
import {
    Twitter,
    Music2,
    Instagram,
    Star,
    Globe
} from 'lucide-react';

// --- Configuration ---
const mascotImageUrl = "https://pbs.twimg.com/media/HG4wkJ8akAAdH5i?format=jpg&name=medium";

// --- Types ---
interface Artist {
    id: number;
    nameEn: string;
    nameTh: string;
    roleEn: string;
    roleTh: string;
    birthday: string;
    hashtag: string;
    bioEn: string;
    bioTh: string;
    avatarColor: string;
    avatarUrl: string;
    icon: string;     // เปลี่ยนเป็น emoji string
    socials: { platform: string; url: string; icon: React.ReactNode; color: string }[];
}

// --- Mock Data ---
const artists: Artist[] = [
    {
        id: 1,
        nameEn: "Teetee",
        nameTh: "ตี๋ตี๋",
        roleEn: "Wanpichit Nimitparkpoom",
        roleTh: "วันพิชิต นิมิตภาคภูมิ",
        birthday: "Mar 20, 2005",
        hashtag: "#twnpich",
        bioEn: "Specializing in dreamy pastel illustrations and character design that warms the heart.",
        bioTh: "เชี่ยวชาญด้านภาพวาดพาสเทลชวนฝัน และการออกแบบตัวละครที่ช่วยเติมเต็มความอบอุ่นให้หัวใจ",
        avatarColor: "bg-[#C6BBFF]",
        avatarUrl: "https://pbs.twimg.com/media/Gt93Ot5WYAAMRKO?format=jpg&name=4096x4096",
        icon: "🐶",
        socials: [
            { platform: "Instagram", url: "https://www.instagram.com/twnpich/", icon: <Instagram size={18} />, color: "bg-[#C6BBFF]" },
            { platform: "Twitter", url: "https://x.com/twnpich", icon: <Twitter size={18} />, color: "bg-[#C6BBFF]" },
            { platform: "TikTok", url: "https://www.tiktok.com/@teetee.wpc", icon: <Music2 size={18} />, color: "bg-[#C6BBFF]" },
        ]
    },
    {
        id: 2,
        nameEn: "Por",
        nameTh: "ป๋อ",
        roleEn: "Suppakarn Jirachotikul",
        roleTh: "ศุภการ จิรโชติกุล",
        birthday: "Oct 17, 2002",
        hashtag: "#porsuppakarn",
        bioEn: "Creating lo-fi beats and graphic layouts that bridge the gap between sight and sound.",
        bioTh: "สร้างสรรค์จังหวะ Lo-fi และงานกราฟิกที่เชื่อมประสานระหว่างการมองเห็นและเสียงเพลง",
        avatarColor: "bg-[#94DDFF]",
        avatarUrl: "https://pbs.twimg.com/media/GuB0uEoWMAAHVIT?format=jpg&name=large",
        icon: "🐻‍❄️",
        socials: [
            { platform: "Instagram", url: "https://www.instagram.com/porsuppakarn", icon: <Instagram size={18} />, color: "bg-[#94DDFF]" },
            { platform: "Twitter", url: "https://x.com/porsuppakarn", icon: <Twitter size={18} />, color: "bg-[#94DDFF]" },
            { platform: "TikTok", url: "https://www.tiktok.com/@porsuppakarn", icon: <Music2 size={18} />, color: "bg-[#94DDFF]" },
        ]
    }
];

// --- Components ---

const ArtistCard = ({ artist }: { artist: Artist }) => {
    const borderColor = artist.id === 1 ? 'border-[#C6BBFF]/30' : 'border-[#94DDFF]/30';
    const textColor = artist.id === 1 ? 'text-[#A29BFE]' : 'text-[#6BCBFF]';
    const tagBg = artist.id === 1 ? 'bg-[#C6BBFF]/10' : 'bg-[#94DDFF]/10';

    return (
        <div className="relative group">
            <div className="absolute inset-0 bg-card-bg rounded-[3rem] rotate-2 scale-105 group-hover:rotate-0 transition-transform duration-500 shadow-sm border border-gray-50"></div>
            <div className={`relative bg-card-bg border-2 ${borderColor} rounded-[3rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col`}>
                <div className="flex flex-col items-center text-center flex-grow">
                    {/* Avatar Area */}
                    <div className={`w-40 h-40 ${artist.avatarColor} rounded-[2.5rem] mb-6 flex items-center justify-center relative overflow-hidden ring-4 ring-white shadow-inner`}>
                        {artist.avatarUrl ? (
                            <img
                                src={artist.avatarUrl}
                                alt={artist.nameEn}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white text-5xl font-black">{artist.nameEn[0]}</span>
                        )}
                        {/* Emoji icon overlay */}
                        <div className="absolute bottom-2 right-2 bg-white w-8 h-8 rounded-full shadow-md flex items-center justify-center text-lg z-10">
                            {artist.icon}
                        </div>
                    </div>

                    {/* Identity */}
                    <div className="mb-4">
                        <h3 className="text-2xl font-black text-content-text-main flex items-center justify-center gap-2">
                            {artist.nameEn} <span className="text-content-text-sub text-lg font-medium">({artist.nameTh})</span>
                        </h3>
                        <p className={`text-sm font-bold ${textColor} uppercase tracking-widest mt-1`}>
                            {artist.roleEn}
                        </p>
                        {/* Added Birthday & Hashtag */}
                        <div className="flex gap-2 justify-center mt-3">
                            <span className={`${tagBg} ${textColor} px-3 py-1 rounded-full text-[10px] font-bold`}>
                                🎂 {artist.birthday}
                            </span>
                            <span className={`${tagBg} ${textColor} px-3 py-1 rounded-full text-[10px] font-bold`}>
                                ✨ {artist.hashtag}
                            </span>
                        </div>
                    </div>

                    {/* Bio */}
                    {/* <div className="space-y-3 mb-8">
                        <p className="text-gray-500 text-sm leading-relaxed italic">"{artist.bioEn}"</p>
                        <p className="text-gray-400 text-xs leading-relaxed">({artist.bioTh})</p>
                    </div> */}

                    {/* Social Links */}
                    <div className="flex gap-3 mt-auto">
                        {artist.socials.map((social, idx) => (
                            <a
                                key={idx}
                                href={social.url}
                                target="_blank" rel="noopener noreferrer"
                                className={`${social.color} w-10 h-10 rounded-2xl flex items-center justify-center text-white hover:scale-110 hover:-rotate-6 transition-all shadow-md`}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Profile() {
    return (
        <div className="min-h-screen bg-page-bg text-slate-800 font-sans selection:bg-[#E0F7FF] overflow-x-hidden">
            <main className="relative max-w-5xl mx-auto px-6 py-16">

                {/* Header Section */}
                {/* <header className="text-center mb-24">
                    <div className="mt-4 inline-block">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-[#94DDFF]/20 text-[#6BCBFF] font-bold text-xs uppercase tracking-tighter mb-4">
                            <Sparkles size={14} />
                            Welcome to our tiny world
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 drop-shadow-sm">
                        <span className="text-[#94DDFF]">Soft</span> & <span className="text-[#C6BBFF]">Creative</span>
                    </h1>

                    <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base font-medium leading-relaxed">
                        A collaboration between two dreamers and a star mascot. <br />
                        <span className="text-gray-400 font-normal">การร่วมมือกันของสองนักฝันและมาสคอตดาวดวงน้อย</span>
                    </p>
                </header> */}

                {/* Artists Section */}
                <div className="grid md:grid-cols-2 gap-12 mb-28">
                    {artists.map(artist => (
                        <ArtistCard key={artist.id} artist={artist} />
                    ))}
                </div>

                {/* Mascot Details Section (Updated to 4:3) */}
                <section className="bg-card-bg border-4 border-dashed border-[#94DDFF]/20 rounded-[3.5rem] p-10 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-[#94DDFF]/10">
                        <Star size={120} fill="currentColor" />
                    </div>

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-1 bg-[#94DDFF] text-white rounded-lg font-black text-sm rotate-[-2deg]">
                                MEET THE MASCOT
                            </div>
                            <h2 className="text-4xl font-black text-content-text-main">
                                BokBear <br />
                                <span className="text-[#6BCBFF]">(น้องบ้อกแบร์)</span>
                            </h2>
                            <p className="text-content-text-sub leading-relaxed">
                                หมาบ้อกแบ้กแสนซน 'ตี๋ตี๋'🐶✨ และ เจ้าชายหมีขาวผู้สง่า 'ป๋อ'🐻‍❄️👑 ส่วนผสมที่ถือกำเนิด ณ ปราสาทน้ำแข็งแห่งนี้ 'บ้อกแบร์' ลูกหมีบ้อกแบร์พร้อมจู่โจมหัวใจหม่ามี๊แล้ว หม่าาามี๋ ~ 💖
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="bg-white px-5 py-2 rounded-2xl shadow-sm border border-[#94DDFF]/20 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#94DDFF]"></span>
                                    <span className="text-xs font-bold text-gray-500">พิ่ปิ๊ป</span>
                                </div>
                                <div className="bg-white px-5 py-2 rounded-2xl shadow-sm border border-[#C6BBFF]/20 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#C6BBFF]"></span>
                                    <span className="text-xs font-bold text-gray-500">พิ่จี๋จี๋</span>
                                </div>
                            </div>

                            {/* Mascot Social Media */}
                            <div className="pt-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Follow BokBear</p>
                                <div className="flex gap-3">
                                    {/* <a href="#" target="_blank" rel="noopener noreferrer" className="bg-[#94DDFF] w-10 h-10 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform shadow-sm">
                                        <Twitter size={18} />
                                    </a>
                                    <a href="#" target="_blank" rel="noopener noreferrer" className="bg-[#C6BBFF] w-10 h-10 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform shadow-sm">
                                        <Instagram size={18} />
                                    </a> */}
                                    <a href="https://specialofttp.vercel.app/" target="_blank" rel="noopener noreferrer" className="bg-[#FFB7B7] w-10 h-10 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform shadow-sm">
                                        <Globe size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Mascot Image Box with 4:3 Aspect Ratio */}
                        <div className="bg-color-card-bg backdrop-blur-sm rounded-[2.5rem] p-4 border-2 border-white shadow-xl rotate-1">
                            <div className="aspect-[3/4] bg-[#94DDFF]/5 rounded-2xl flex items-center justify-center border-2 border-dashed border-[#94DDFF]/20 overflow-hidden">
                                {mascotImageUrl ? (
                                    <img src={mascotImageUrl} alt="Mascot Gallery" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center">
                                        <p className="text-[#6BCBFF] font-black text-xl mb-1">Mascot Gallery</p>
                                        <p className="text-[#94DDFF] text-xs">[ พื้นที่แปะรูปมาสคอตเพิ่ม ]</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                {/* <footer className="mt-28 text-center border-t border-gray-50 pt-10">
                    <div className="flex justify-center gap-6 mb-4 text-gray-300">
                        <Palette size={20} className="hover:text-[#94DDFF] cursor-pointer transition-colors" />
                        <Music size={20} className="hover:text-[#C6BBFF] cursor-pointer transition-colors" />
                    </div>
                    <p className="text-xs font-bold text-gray-200 uppercase tracking-[0.2em]">
                        © 2024 Artist Duo Studio • Made with Pastel Dreams
                    </p>
                </footer> */}
            </main>
        </div>
    );
}