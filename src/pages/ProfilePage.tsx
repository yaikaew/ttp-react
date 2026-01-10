import React from 'react';
import { Calendar, User, Instagram, Twitter, Music2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
    const idols = [
        {
            id: 1,
            name: "ป๋อ",
            realName: "ศุภการ จิรโชติกุล",
            NameEN: "Suppakarn Jirachotikul",
            birthday: "Oct 17, 2002",
            hashtags: "#porsuppakarn",
            hashtagslink: "https://x.com/search?q=%23porsuppakarn&src=hashtag_click",
            color: "bg-sky-50",
            accent: "text-sky-500",
            image: "https://pbs.twimg.com/media/GuB0uEoWMAAHVIT?format=jpg&name=large",
            emoji: "🐻‍❄️",
            socials: {
                instagram: "@porsuppakarn",
                instagramlink: "",
                twitter: "@porsuppakarn",
                twitterlink: "",
                tiktok: "@porsuppakarn",
                tiktoklink: "",
            }
        },
        {
            id: 2,
            name: "ตี๋ตี๋",
            realName: "วันพิชิต นิมิตภาคภูมิ",
            NameEN: "Wanpichit Nimitparkpoom",
            birthday: "Mar 20, 2005",
            hashtags: "#twnpich",
            hashtagslink: "https://x.com/search?q=%23twnpich&src=hashtag_click",
            color: "bg-purple-50",
            accent: "text-purple-500",
            image: "https://pbs.twimg.com/media/Gt93Ot5WYAAMRKO?format=jpg&name=4096x4096",
            emoji: "🐶",
            socials: {
                instagram: "@teetee_official",
                instagramlink: "",
                twitter: "@teetee_tw",
                twitterlink: "",
                tiktok: "@teetee_tt",
                tiktoklink: "",
            }
        }
    ];

    return (
        <div className="min-h-screen overflow-hidden relative py-16">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {idols.map((idol) => (
                        <div key={idol.id} className="relative group">

                            {/* Card Body */}
                            <div className="bg-white rounded-[4rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border-4 border-white relative transition-transform duration-500 hover:-translate-y-2">

                                {/* Profile Image (w-64) */}
                                <div className="flex justify-center mb-8 relative">
                                    <div className={`w-64 h-64 ${idol.color} rounded-[3.5rem] p-2 rotate-2 group-hover:rotate-0 transition-transform duration-500 shadow-inner`}>
                                        <div className="w-full h-full bg-white rounded-[3rem] overflow-hidden border-4 border-white">
                                            <img src={idol.image} alt={idol.name} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl border-4 border-pink-50 scale-110">
                                        {idol.emoji}
                                    </div>
                                </div>

                                {/* Name Header */}
                                <div className="text-center mb-6">
                                    <h2 className="text-4xl font-black text-slate-800 mb-1">{idol.name}</h2>
                                    <div className="flex justify-center gap-2">
                                        <a href={idol.hashtagslink} target="_blank" rel="noopener noreferrer" className={`text-sm font-bold px-2 py-0.5 rounded-full ${idol.color} ${idol.accent}`}>
                                            {idol.hashtags}
                                        </a>
                                    </div>
                                </div>

                                {/* Info List */}
                                <div className="space-y-3 bg-slate-50/70 p-6 rounded-[2.5rem] mb-6 border border-slate-100/50">
                                    <div className="flex items-center gap-4">
                                        <User size={18} className={idol.accent} />
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter text-left">Name</p>
                                            <p className="text-slate-700 font-bold text-sm">{idol.realName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <User size={18} className={idol.accent} />
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter text-left">Name (EN)</p>
                                            <p className="text-slate-700 font-bold text-sm">{idol.NameEN}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Calendar size={18} className={idol.accent} />
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter text-left">Birthday</p>
                                            <p className="text-slate-700 font-bold text-sm">{idol.birthday}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* --- Social Media Section --- */}
                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    <a href={idol.socials.instagramlink} className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-slate-50 hover:border-pink-200 hover:bg-pink-50 transition-all group/social">
                                        <Instagram size={20} className="text-pink-500" />
                                        <span className="text-[10px] font-bold text-slate-500 group-hover/social:text-pink-600 truncate">{idol.socials.instagram}</span>
                                    </a>
                                    <a href={idol.socials.twitterlink} className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-slate-50 hover:border-blue-200 hover:bg-blue-50 transition-all group/social">
                                        <Twitter size={20} className="text-blue-400" />
                                        <span className="text-[10px] font-bold text-slate-500 group-hover/social:text-blue-600 truncate">{idol.socials.twitter}</span>
                                    </a>
                                    <a href={idol.socials.tiktoklink} className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-slate-50 hover:border-slate-200 hover:bg-slate-100 transition-all group/social">
                                        <Music2 size={20} className="text-slate-800" />
                                        <span className="text-[10px] font-bold text-slate-500 group-hover/social:text-slate-900 truncate">{idol.socials.tiktok}</span>
                                    </a>
                                </div>

                            </div>

                            {/* Decorative Sticker */}
                            <div className="absolute -top-4 -right-2 bg-yellow-400 text-white px-4 py-1.5 rounded-full rotate-12 shadow-lg font-black text-xs z-20 border-2 border-white">
                                IDOL
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;