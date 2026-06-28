import { useEffect, useState } from "react";
import { Star, Play } from "lucide-react";
import { timelineService } from "../services/timelineService";
import type { TimelineItem } from "../services/timelineService";

const RECOMMENDED_LIST = [
    {
        id: 1,
        title: "Duang With You",
        desc: "",
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

export default function HomePage() {
    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
    const [loadingTimeline, setLoadingTimeline] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoadingTimeline(true);

        timelineService
            .getTimeline()
            .then((items) => {
                if (mounted) setTimelineItems(items);
            })
            .catch((error) => {
                console.error("Failed to load timeline", error);
            })
            .finally(() => {
                if (mounted) setLoadingTimeline(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen space-y-16">
            {/* ================= Header ================= */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-card-border pb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-content-text-main">
                        TeeteePor <span className="text-brand-primary">Club</span>
                    </h1>
                    {/* <p className="text-content-text-muted text-sm font-bold mt-1 tracking-wide uppercase italic">
                        Official Artist Monitoring Dashboard
                    </p> */}
                </div>

                {/* <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 rounded-2xl border flex items-center gap-2 bg-card-bg border-card-border">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-content-text-muted uppercase tracking-widest">
                            Live Updates
                        </span>
                    </div>
                </div> */}
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

            {/* ================= Timeline ================= */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-badge-bg text-badge-text">
                        <Star className="w-5 h-5 fill-current" />
                    </div>
                    <h2 className="text-xl font-black text-content-text-main">
                        Timeline
                    </h2>
                </div>

                {loadingTimeline ? (
                    <div className="rounded-3xl border border-card-border bg-card-bg p-8 text-center text-content-text-muted">
                        Loading timeline...
                    </div>
                ) : (
                    <div className="space-y-8">
                        {timelineItems.map((item) => (
                            <div
                                key={item.id}
                                className="grid gap-6 rounded-[2rem] border border-card-border bg-card-bg p-6 shadow-sm md:grid-cols-[1.2fr_1.8fr]"
                            >
                                <div className="space-y-4">
                                    {item.imgs.length === 1 && (
                                        <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-card-border">
                                            <img
                                                src={item.imgs[0]}
                                                alt={item.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {item.imgs.length === 2 && (
                                        <div className="grid grid-cols-2 gap-2">
                                            {item.imgs.map((src, i) => (
                                                <div key={i} className="aspect-square overflow-hidden rounded-3xl border border-card-border">
                                                    <img
                                                        src={src}
                                                        alt={`${item.title}-${i}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {item.imgs.length === 3 && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="col-span-2 aspect-[4/3] overflow-hidden rounded-3xl border border-card-border">
                                                <img
                                                    src={item.imgs[0]}
                                                    alt={`${item.title}-0`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="aspect-square overflow-hidden rounded-3xl border border-card-border">
                                                <img
                                                    src={item.imgs[1]}
                                                    alt={`${item.title}-1`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="aspect-square overflow-hidden rounded-3xl border border-card-border">
                                                <img
                                                    src={item.imgs[2]}
                                                    alt={`${item.title}-2`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {item.imgs.length >= 4 && (
                                        <div className="grid grid-cols-2 gap-2">
                                            {item.imgs.slice(0, 4).map((src, i) => (
                                                <div key={i} className="aspect-square overflow-hidden rounded-3xl border border-card-border">
                                                    <img
                                                        src={src}
                                                        alt={`${item.title}-${i}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col justify-between">
                                    <div>
                                        <div className="text-content-text-muted text-sm font-bold uppercase tracking-wide">
                                            {item.date}
                                        </div>
                                        <h3 className="text-xl font-black text-content-text-main mt-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-content-text-muted mt-4 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}