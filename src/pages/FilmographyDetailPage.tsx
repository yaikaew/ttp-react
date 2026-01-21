import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Play, Youtube, Film, Star, BookOpen, Clapperboard, Tv, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { type FilmographyUI } from '../utils/mappers';
import { LoadingState } from "../components/LoadingState";

interface FilmographyDetail {
    id: number;
    filmography_id: number;
    hashtag: string;
    teetee_img: string;
    por_img: string;
    trailer_id: string;
    bts_id: string;
    highlight_id: string;
    synopsis: string;
}
interface Filmographytrends {
    id: number;
    filmography_id: number;
    episode: string;
    air_date: string;
    hashtag: string;
    posts: string;
    rank_th: string;
    rank_ww: string;
    location_count: string;
    source_link: string;
}
/* -------------------- Section Header -------------------- */
const SectionHeader = ({
    icon: Icon,
    title,
    subtitle,
}: {
    icon: LucideIcon;
    title: string;
    subtitle?: string;
}) => (
    <div className="flex items-start gap-4 mb-6 group">
        <div className="p-3 bg-brand-primary-light border border-brand-accent-light rounded-2xl text-brand-primary shadow-sm transition-transform group-hover:scale-105">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <h4 className="text-base font-black text-content-text-main leading-none">
                {title}
            </h4>
            {subtitle && (
                <p className="text-[11px] font-bold text-content-text-muted mt-1.5 leading-relaxed uppercase tracking-wider">
                    {subtitle}
                </p>
            )}
        </div>
    </div>
);
/* -------------------- Video Grid -------------------- */
const VideoGrid = ({
    ids,
    title,
    icon,
}: {
    ids: string[];
    title: string;
    icon: LucideIcon;
}) => {
    if (ids.length === 0) return null;

    return (
        <div>
            <SectionHeader
                icon={icon}
                title={title}
                subtitle={`${ids.length} clips available`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {ids.map((id, index) => (
                    <div key={`${title}-${id}`} className="relative group">
                        <div className="aspect-video rounded-3xl overflow-hidden bg-content-text-main shadow-lg shadow-brand-primary/5 border border-brand-sidebar-border group-hover:border-brand-primary-light transition-all duration-500">
                            <iframe
                                className="w-full h-full opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                                src={`https://www.youtube.com/embed/${id}?modestbranding=1&rel=0`}
                                title={`${title} ${index + 1}`}
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                        <div className="absolute -bottom-3 -right-2 w-8 h-8 bg-card-bg text-[10px] font-black rounded-xl flex items-center justify-center text-brand-primary shadow-lg border border-brand-primary-light transition-transform group-hover:scale-110 group-hover:rotate-6">
                            {String(index + 1).padStart(2, '0')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
const FilmographyDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [film, setFilm] = useState<FilmographyUI | null>(null);
    const [detail, setDetail] = useState<FilmographyDetail | null>(null);
    const [trends, setTrends] = useState<Filmographytrends[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // 1. Fetch main filmography info
                const { data: filmData, error: filmError } = await supabase
                    .from('filmography')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (filmError) throw filmError;
                setFilm(filmData);

                // 2. Fetch deep detail
                const { data: detailData, error: detailError } = await supabase
                    .from('filmographydetail')
                    .select('*')
                    .eq('filmography_id', id)
                    .maybeSingle();
                if (detailError) throw detailError;
                setDetail(detailData);

                const { data: trendsData, error: trendsError } = await supabase
                    .from('filmographytrends')
                    .select('*')
                    .eq('filmography_id', id)
                    .order('episode', { ascending: true });

                if (trendsError) throw trendsError;
                setTrends(trendsData);
            } catch (err) {
                console.error('Error fetching film details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return (<LoadingState />);

    if (!film) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-card-bg rounded-full flex items-center justify-center mb-6">
                <Film size={40} className="text-card-text" />
            </div>
            <h2 className="text-2xl font-black text-card-text mb-2">Film Not Found</h2>
            <p className="text-card-text mb-8 max-w-sm">The filmography data you're looking for might have been moved or deleted.</p>
            <button
                onClick={() => navigate('/filmography')}
                className="px-8 py-3 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-brand-primary/80 transition-all flex items-center gap-2"
            >
                <ArrowLeft size={18} /> Back to Library
            </button>
        </div>
    );

    const parseIds = (input?: string | null) =>
        input ? input.split(',').map((v) => v.trim()).filter(Boolean) : [];

    const btsIds = parseIds(detail?.bts_id);
    const highlightIds = parseIds(detail?.highlight_id);

    // Helper to extract YouTube ID if a full URL was provided
    const getYoutubeEmbedUrl = (idOrUrl: string) => {
        if (!idOrUrl) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = idOrUrl.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : idOrUrl;
        return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
    };

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Header Area */}
            <div className="border-b border-card-border">
                <div className="max-w-7xl mx-auto px-6 py-12">

                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/filmography')}
                        className="group mb-12 flex items-center gap-2 px-4 py-2 bg-surface-soft text-content-text-sub rounded-2xl font-bold hover:bg-brand-primary hover:text-white transition-all border border-card-border active:scale-95">
                        <ArrowLeft
                            size={18}
                            className="group-hover:-translate-x-1 transition-transform"
                        />
                        Explore More
                    </button>

                    <div className="flex flex-col md:flex-row gap-10 items-start md:items-end">

                        {/* Poster */}
                        <div
                            className="w-44 md:w-64 aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white shrink-0 hover:scale-105 transition-transform duration-500 bg-surface">
                            <img
                                src={film.poster}
                                alt={film.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-6">

                                {/* Status */}
                                <span
                                    className="px-4 py-1.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-brand-primary/25">
                                    {film.status}
                                </span>

                                <span className="text-sm font-bold text-content-text-muted">
                                    {new Date(film.date).getFullYear()}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-content-text-main leading-tight mb-8">
                                {film.title}
                            </h1>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">

                                {detail?.hashtag && (
                                    <a
                                        href={`https://x.com/search?q=${encodeURIComponent(detail.hashtag)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center px-5 py-3 bg-card-bg border border-brand-primary-light text-brand-primary rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-sm"
                                    >
                                        {detail.hashtag}
                                    </a>
                                )}

                                {film.rerun_link && (
                                    <a
                                        href={film.rerun_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-xl font-black text-sm shadow-lg shadow-brand-primary/25 hover:bg-brand-primary-hover transition-all active:scale-95"
                                    >
                                        <Play size={14} fill="currentColor" />
                                        Watch Rerun
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer */}
            {detail?.trailer_id && (
                <div className="px-6 py-12">
                    <SectionHeader icon={Youtube} title="Official Trailer" subtitle="Watch the official trailer" />
                    <div className="aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-card-bg">
                        <iframe className="w-full h-full" src={getYoutubeEmbedUrl(detail.trailer_id)} allowFullScreen />
                    </div>
                </div>
            )}

            {/* Actors */}
            <div className="px-6 py-12">
                <div>
                    <SectionHeader icon={Star} title="Main Characters" subtitle="Meet the actors" />
                    {/* ปรับ grid ให้ดูโปร่งขึ้น และใช้ gap ที่เหมาะสม */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
                        {[
                            { name: 'Teetee Wanpichit', role: film.role_teetee, img: detail?.teetee_img },
                            { name: 'Por Suppakarn', role: film.role_por, img: detail?.por_img }
                        ].map((actor, idx) => (
                            <div key={idx} className="flex flex-col p-2 bg-card-bg rounded-4xl border border-card-border hover:border-brand-primary/40 transition-all duration-300 shadow-sm hover:shadow-md group">

                                {/* ส่วนของรูปภาพ: ขยายให้ใหญ่และเด่น (Aspect Ratio 1:1 หรือ 4:5) */}
                                <div className="relative w-full aspect-square overflow-hidden rounded-3xl">
                                    <img
                                        src={actor.img || film.poster}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        alt={actor.name}
                                    />
                                    {/* Overlay ไล่เฉดสีเบาๆ ด้านล่างเพื่อให้ข้อความอ่านง่ายถ้ามีการซ้อนทับ */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                {/* ส่วนของข้อความ: ย้ายมาไว้ด้านล่างรูป */}
                                <div className="p-5 text-center">
                                    <span className="block text-[12px] font-black uppercase tracking-[0.2em] text-brand-primary mb-2">
                                        {actor.name}
                                    </span>
                                    <p className="text-lg font-bold text-content-text-main leading-tight">
                                        as <span className="text-brand-accent">{actor.role}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Story */}
            <div className="px-6 py-12">
                <div className="relative">
                    <SectionHeader icon={BookOpen} title="The Story" subtitle="Synopsis" />
                    <div className="relative overflow-hidden bg-card-bg p-8 md:p-12 rounded-[2.5rem] border border-card-border shadow-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <p className="relative text-sm md:text-lg text-content-text-sub leading-relaxed whitespace-pre-line font-medium">
                            {detail?.synopsis || "Coming soon..."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Trends Section */}
            {trends.length > 0 && (
                <div className="px-6 py-12">
                    <SectionHeader icon={TrendingUp} title="Trend Summary" subtitle="X Engagement Metrics" />
                    <div className="space-y-4">
                        {/* Mobile View */}
                        <div className="block md:hidden space-y-4">
                            {trends.length > 0 ? (
                                trends.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => item.source_link && window.open(item.source_link, '_blank')}
                                        className={`bg-card-bg p-5 rounded-3xl border border-card-border shadow-sm active:scale-[0.98] transition-all ${item.source_link ? 'cursor-pointer' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-black">
                                                {item.episode}
                                            </div>
                                            <div className="text-[11px] font-bold text-content-text-muted uppercase tracking-wider">
                                                {new Date(item.air_date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-10 gap-4 pt-4 border-t border-card-border/50">
                                                {/* Hashtag: 70% (7/10) */}
                                                <div className="col-span-7">
                                                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">Hashtag</p>
                                                    <p className="text-sm font-bold text-content-text-main whitespace-pre-line leading-relaxed">
                                                        {item.hashtag}
                                                    </p>
                                                </div>

                                                {/* Posts: 30% (3/10) */}
                                                <div className="col-span-3">
                                                    <p className="text-[10px] font-black text-content-text-muted uppercase mb-1">Posts</p>
                                                    <p className="text-sm font-bold text-content-text-main whitespace-pre-line">
                                                        {item.posts}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-card-border/50">
                                                <div>
                                                    <p className="text-[10px] font-black text-content-text-muted uppercase mb-1">Rank (TH/WW)</p>
                                                    <p className="text-sm font-bold text-content-text-main">
                                                        {item.rank_th} / {item.rank_ww || '-'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-content-text-muted uppercase mb-1">Location Count</p>
                                                    <p className="text-sm font-bold text-brand-accent">{item.location_count}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-10 bg-card-bg rounded-3xl border border-card-border italic text-content-text-muted">
                                    No trend data available.
                                </div>
                            )}
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block overflow-hidden bg-card-bg rounded-[2.5rem] border border-card-border shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-card-border bg-surface-soft">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-text-muted text-center">Episode</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-text-muted text-center whitespace-nowrap">Date</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-text-muted text-center">Hashtag</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-text-muted text-center">Posts</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-text-muted text-center whitespace-nowrap">Rank (TH/WW)</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-text-muted text-center">Location</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-card-border">
                                    {trends.map((item) => (
                                        <tr
                                            key={item.id}
                                            onClick={() => item.source_link && window.open(item.source_link, '_blank', 'noopener,noreferrer')}
                                            className={`transition-colors ${item.source_link ? 'cursor-pointer hover:bg-brand-primary/5' : ''}`}
                                        >
                                            <td className="px-6 py-4 text-center font-bold text-content-text-main">{item.episode}</td>
                                            <td className="px-6 py-4 text-center text-content-text-sub text-sm font-bold whitespace-nowrap">
                                                {new Date(item.air_date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                            </td>
                                            <td className="px-6 py-4 text-center text-content-text-sub text-sm font-bold whitespace-pre-line leading-relaxed">{item.hashtag}</td>
                                            <td className="px-6 py-4 text-center text-content-text-sub text-sm font-bold whitespace-pre-line leading-relaxed">{item.posts}</td>
                                            <td className="px-6 py-4 text-center text-content-text-sub text-sm font-bold whitespace-nowrap">{item.rank_th} / {item.rank_ww}</td>
                                            <td className="px-6 py-4 text-center text-content-text-sub text-sm font-bold">{item.location_count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Videos (BTS & Highlights) */}
            <div className="px-6 py-12 space-y-20">
                <VideoGrid ids={btsIds} title="Behind The Scenes" icon={Clapperboard} />
                <VideoGrid ids={highlightIds} title="Highlights" icon={Tv} />
            </div>
        </div>
    );
};

export default FilmographyDetailPage;
