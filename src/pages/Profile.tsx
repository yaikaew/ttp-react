import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram, faTiktok, faWeibo, faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { Star, Sparkles, User, Calendar, Ruler, Weight } from 'lucide-react';

interface ProfileData {
    id: string;
    name: string;
    lastName: string;
    engName: string;
    birth: string;
    hashtag: string;
    icon: string;
    bio: string;
    image: string;
    socials: {
        platform: 'instagram' | 'twitter' | 'tiktok' | 'weibo';
        url: string;
    }[];
}

const profiles: ProfileData[] = [
    {
        id: '101',
        name: 'ตี๋ตี๋',
        lastName: 'วันพิชิต นิมิตภาคภูมิ',
        engName: 'Teetee Wanpichit Nimitparkpoom',
        birth: 'Mar 20, 2005',
        hashtag: '#twnpich',
        icon: '🐶',
        bio: '',
        image: 'https://pbs.twimg.com/media/Gt93Ot5WYAAMRKO?format=jpg&name=4096x4096',
        socials: [
            { platform: 'instagram', url: 'https://www.instagram.com/twnpich/' },
            { platform: 'twitter', url: 'https://x.com/twnpich' },
            { platform: 'tiktok', url: 'https://www.tiktok.com/@teetee.wpc' },
            { platform: 'weibo', url: 'https://weibo.com/u/7978599852' }
        ]
    },
    {
        id: '18',
        name: 'ป๋อ',
        lastName: 'ศุภการ จิรโชติกุล',
        engName: 'Por Suppakarn Jirachotikul',
        birth: 'Oct 17, 2002',
        hashtag: '#porsuppakarn',
        icon: '🐻‍❄️',
        bio: '',
        image: 'https://pbs.twimg.com/media/GuB0uEoWMAAHVIT?format=jpg&name=large',
        socials: [
            { platform: 'instagram', url: 'https://www.instagram.com/porsuppakarn/' },
            { platform: 'twitter', url: 'https://x.com/porsuppakarn' },
            { platform: 'tiktok', url: 'https://www.tiktok.com/@porsuppakarn' },
            { platform: 'weibo', url: 'https://weibo.com/u/7910928995' }
        ]
    }
];

const SocialIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
        case 'instagram': return <FontAwesomeIcon icon={faInstagram} />;
        case 'twitter': return <FontAwesomeIcon icon={faXTwitter} />;
        case 'tiktok': return <FontAwesomeIcon icon={faTiktok} />;
        case 'weibo': return <FontAwesomeIcon icon={faWeibo} />;
        default: return null;
    }
};

const ProfileCard = ({ data, isReversed }: { data: ProfileData; isReversed: boolean }) => {
    return (
        <div className="bg-card-bg rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 mb-12 border border-card-border shadow-xl shadow-brand-primary/5 transition-all duration-500 hover:shadow-brand-primary/10 relative overflow-hidden group">
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center`}>

                {/* Image Section */}
                <div className={`lg:col-span-5 ${isReversed ? 'lg:order-2' : ''}`}>
                    <div className="relative group/img max-w-sm mx-auto">
                        <div className="absolute -inset-1.5 bg-linear-to-tr from-brand-primary to-brand-accent rounded-[2.2rem] blur opacity-10 group-hover/img:opacity-30 transition duration-500"></div>
                        <div className="relative rounded-4xl border-2 border-brand-primary-light overflow-hidden aspect-3/4 shadow-lg">
                            <img src={data.image} alt={data.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className={`lg:col-span-7 ${isReversed ? 'lg:order-1 lg:text-right' : 'lg:text-left'} text-center`}>
                    <div className={`flex items-center gap-3 mb-6 justify-center ${isReversed ? 'lg:justify-end' : 'lg:justify-start'}`}>
                        <span className="bg-brand-primary/10 text-brand-primary px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">ID: {data.id}</span>
                        <div className="h-px w-8 bg-brand-primary/20"></div>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black text-content-text-main mb-3 leading-tight tracking-tight">
                        {data.name} <span className="text-brand-primary">{data.lastName}</span>
                    </h2>
                    <p className="text-brand-accent font-bold mb-8 uppercase tracking-[0.2em] text-[10px] md:text-xs opacity-80">{data.engName}</p>

                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 max-w-md mx-auto lg:mx-0">
                        {[
                            { label: 'Birth', value: data.birth, icon: Calendar },
                            { label: 'Hashtag', value: data.hashtag, icon: Ruler },
                            { label: 'Icon', value: data.icon, icon: Weight },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-brand-primary-light/20 p-3 md:p-4 rounded-2xl border border-brand-primary/5 transition-colors">
                                <stat.icon size={14} className="mx-auto lg:mx-0 mb-1 text-brand-primary opacity-50" />
                                <p className="text-[8px] text-brand-primary uppercase font-black tracking-tighter mb-0.5">{stat.label}</p>
                                <p className="font-extrabold text-content-text-main text-[11px] md:text-sm">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className={`flex flex-wrap gap-3 justify-center ${isReversed ? 'lg:justify-end' : 'lg:justify-start'}`}>
                        {data.socials.map((social, idx) => (
                            <a
                                key={idx}
                                href={social.url}
                                target="_blank"
                                rel="noreferrer"
                                className="w-10 h-10 md:w-12 md:h-12 bg-card-bg border border-brand-primary-light rounded-xl md:rounded-2xl flex items-center justify-center text-brand-primary shadow-sm hover:bg-brand-primary hover:text-white hover:-translate-y-1 transition-all duration-300"
                            >
                                <SocialIcon platform={social.platform} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Profile = () => {
    return (
        <div className="min-h-screen bg-page-bg text-content-text-main font-sans pb-20 transition-colors">

            {/* --- NEW REFINED HEADER --- */}
            <header className="relative h-[40vh] md:h-[50vh] flex items-center justify-center pt-10 px-6 overflow-hidden">
                <div className="relative z-10 w-full max-w-4xl">
                    <div className="bg-card-bg/30 backdrop-blur-xl rounded-[3rem] md:rounded-[5rem] p-8 md:p-12 border border-white/20 shadow-2xl shadow-brand-primary/5 text-center flex flex-col items-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-px w-8 bg-brand-primary"></div>
                            <Sparkles className="text-brand-primary" size={20} />
                            <div className="h-px w-8 bg-brand-primary"></div>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black tracking-[0.3em] uppercase text-brand-primary">
                            The Perfect Match
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 md:px-10">
                {/* --- MASCOT SECTION (Reduced Overlap) --- */}
                <section className="relative bg-card-bg rounded-[3rem] md:rounded-[4rem] shadow-2xl overflow-hidden mb-20 -mt-12 md:-mt-16 border border-card-border z-20">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 p-8 md:p-14">
                        <div className="w-full lg:w-1/2 flex justify-center">
                            <div className="relative group">
                                <div className="absolute bg-brand-primary-light rounded-[3rem] rotate-3 scale-105 opacity-50 blur-xl"></div>
                                <div className="relative bg-white/90 dark:bg-zinc-800 p-6 md:p-8 rounded-[3rem] border border-brand-primary-light/50">
                                    <img
                                        src="https://pbs.twimg.com/media/HG4wkJ8akAAdH5i?format=jpg&name=medium"
                                        alt="Nong Nooong"
                                        className="w-52 h-52 md:w-72 md:h-72 object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-white/90 dark:bg-zinc-900 backdrop-blur-md text-brand-primary px-5 py-2.5 rounded-2xl shadow-lg border border-brand-primary/10 font-black text-[10px] md:text-xs flex items-center gap-2">
                                    <Sparkles size={14} className="text-brand-accent animate-pulse" />
                                    <span className="tracking-widest">BokBear</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary-light text-brand-primary text-[10px] font-black tracking-widest uppercase mb-6 border border-brand-primary/10">
                                <Star size={12} className="fill-brand-primary" /> MY IDEAL FAN
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-content-text-main mb-6 leading-tight tracking-tight">
                                บ้อกแบร์ <br />
                                <span className="text-brand-primary text-2xl font-medium tracking-normal">(BokBear)</span>
                            </h2>
                            <p className="text-sm md:text-lg text-content-text-sub leading-relaxed font-medium italic border-l-4 border-brand-primary/20 lg:pl-6 mb-8">
                                หมาบ้อกแบ้กแสนซน 'ตี๋ตี๋'🐶✨ และ เจ้าชายหมีขาวผู้สง่า 'ป๋อ'🐻‍❄️👑 ส่วนผสมที่ถือกำเนิด ณ ปราสาทน้ำแข็งแห่งนี้ 'บ้อกแบร์' ลูกหมีบ้อกแบร์พร้อมจู่โจมหัวใจหม่ามี๊แล้ว หม่าาามี๋ ~ 💖
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                {[
                                    { icon: faInstagram, label: 'Website', url: 'https://specialofttp.vercel.app/' },
                                    // { icon: faXTwitter, label: 'Twitter', url: 'https://x.com/NONG_NOOONG' },
                                    // { icon: faTiktok, label: 'Tiktok', url: 'https://www.tiktok.com/@nongnooong.gmmtv' },
                                ].map((sc, i) => (
                                    <a key={i} href={sc.url} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-brand-primary-light/50 hover:bg-brand-primary hover:text-white rounded-xl text-brand-primary transition-all font-black text-[10px] uppercase tracking-widest border border-brand-primary/10 shadow-sm">
                                        <FontAwesomeIcon icon={sc.icon} /> {sc.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- ARTISTS SECTION --- */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-10 px-2">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-content-text-main uppercase tracking-tight">Main Artists</h3>
                            <div className="h-1 w-12 bg-brand-primary/20 rounded-full mt-1"></div>
                        </div>
                    </div>

                    {profiles.map((profile, index) => (
                        <ProfileCard
                            key={profile.id}
                            data={profile}
                            isReversed={index % 2 !== 0}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Profile;