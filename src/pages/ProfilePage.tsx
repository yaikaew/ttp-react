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
                instagram: "porsuppakarn",
                instagramlink: "https://www.instagram.com/porsuppakarn",
                twitter: "@porsuppakarn",
                twitterlink: "https://x.com/porsuppakarn",
                tiktok: "porsuppakarn",
                tiktoklink: "https://www.tiktok.com/@porsuppakarn",
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
                instagram: "twnpich",
                instagramlink: "https://www.instagram.com/twnpich/",
                twitter: "@twnpich",
                twitterlink: "https://x.com/twnpich",
                tiktok: "@teetee.wpc",
                tiktoklink: "https://www.tiktok.com/@teetee.wpc",
            }
        }
    ];

    return (
        <div className="min-h-screen py-16 bg-page-bg">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {idols.map((idol) => (
                        <div key={idol.id} className="relative group">

                            {/* Card */}
                            <div className="
                                bg-card-bg
                                rounded-[4rem]
                                p-10
                                border
                                border-card-border
                                shadow-[0_20px_50px_rgba(0,0,0,0.06)]
                                transition-all
                                duration-500
                                hover:-translate-y-2
                            ">

                                {/* Image */}
                                <div className="flex justify-center mb-8 relative">
                                    <div className={`w-64 h-64 ${idol.color} rounded-[3.5rem] p-2 rotate-2 group-hover:rotate-0 transition-transform duration-500 shadow-inner`}>
                                        <div className="w-full h-full bg-card-bg rounded-[3rem] overflow-hidden border-4 border-card-bg">
                                            <img
                                                src={idol.image}
                                                alt={idol.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="
                                        absolute -bottom-2 -right-2
                                        w-16 h-16
                                        bg-card-bg
                                        rounded-full
                                        border
                                        border-card-border
                                        shadow-lg
                                        flex items-center justify-center
                                        text-3xl
                                    ">
                                        {idol.emoji}
                                    </div>
                                </div>

                                {/* Name */}
                                <div className="text-center mb-6">
                                    <h2 className="text-4xl font-black text-content-text-main mb-1">
                                        {idol.name}
                                    </h2>
                                    <a
                                        href={idol.hashtagslink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`
                                            inline-block
                                            text-xs
                                            font-bold
                                            px-3 py-1
                                            rounded-full
                                            ${idol.color}
                                            ${idol.accent}
                                        `}
                                    >
                                        {idol.hashtags}
                                    </a>
                                </div>

                                {/* Info */}
                                <div className="
                                    space-y-4
                                    bg-filter-input-bg
                                    p-6
                                    rounded-[2.5rem]
                                    border
                                    border-filter-border
                                    mb-6
                                ">
                                    <InfoRow icon={<User size={18} className={idol.accent} />} label="Name" value={idol.realName} />
                                    <InfoRow icon={<User size={18} className={idol.accent} />} label="Name (EN)" value={idol.NameEN} />
                                    <InfoRow icon={<Calendar size={18} className={idol.accent} />} label="Birthday" value={idol.birthday} />
                                </div>

                                {/* Social (ไม่แตะสี) */}
                                <div className="grid grid-cols-3 gap-3">
                                    <a href={idol.socials.instagramlink} className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-slate-50 hover:border-pink-200 hover:bg-pink-50 transition-all">
                                        <Instagram size={20} className="text-pink-500" />
                                        <span className="text-[10px] font-bold text-slate-500 truncate">{idol.socials.instagram}</span>
                                    </a>
                                    <a href={idol.socials.twitterlink} className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-slate-50 hover:border-blue-200 hover:bg-blue-50 transition-all">
                                        <Twitter size={20} className="text-blue-400" />
                                        <span className="text-[10px] font-bold text-slate-500 truncate">{idol.socials.twitter}</span>
                                    </a>
                                    <a href={idol.socials.tiktoklink} className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-slate-50 hover:border-slate-200 hover:bg-slate-100 transition-all">
                                        <Music2 size={20} className="text-slate-800" />
                                        <span className="text-[10px] font-bold text-slate-500 truncate">{idol.socials.tiktok}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-center gap-4">
        {icon}
        <div>
            <p className="text-xs font-bold text-content-text-muted uppercase tracking-tight">
                {label}
            </p>
            <p className="text-sm font-bold text-content-text-main">
                {value}
            </p>
        </div>
    </div>
);

export default ProfilePage;
