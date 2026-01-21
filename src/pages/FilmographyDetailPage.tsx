import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Play, Youtube, TrendingUp, Film, Star, BookOpen, Clapperboard, Tv } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { type FilmographyUI } from '../utils/mappers';
import { LoadingState } from "../components/LoadingState";

interface FilmographyDetail {
    id: number;
    filmography_id: number;
    hashtag: string;
    teeteeimg: string;
    porimg: string;
    trailerid: string;
    bts_link: string;
    highlight_link: string;
    [key: string]: string | number;
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch main filmography info
                const { data: filmData, error: filmError } = await supabase
                    .from('filmography')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (filmError) throw filmError;
                setFilm(filmData);

                // Fetch deep detail
                const { data: detailData, error: detailError } = await supabase
                    .from('filmographydetail')
                    .select('*')
                    .eq('filmography_id', id)
                    .maybeSingle();

                if (detailError) throw detailError;
                setDetail(detailData);
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

    // Extract trend tags from detail
    const trendTags = [];
    if (detail) {
        // Add Trailer Tag first if it exists
        if (detail.tagtrailer) {
            const trailerHashtagLink = `${String(detail.linktrailer)}`;
            trendTags.push({
                label: "Official Trailer",
                tag: String(detail.tagtrailer),
                engage: String(detail.engagetrailer || '-'),
                link: trailerHashtagLink
            });
        }

        // Add Episode Tags
        for (let i = 1; i <= 12; i++) {
            const tag = detail[`tag${i}`];
            const engage = detail[`engage${i}`];
            const link = detail[`link${i}`];
            if (tag) {
                const hashtagLink = link ? String(link) : `https://x.com/hashtag/${String(tag).replace('#', '')}?src=hashtag_click`;
                trendTags.push({
                    label: `Episode ${i}`,
                    tag: String(tag),
                    engage: String(engage || '-'),
                    link: hashtagLink
                });
            }
        }
    }

    const parseIds = (input?: string | null) =>
        input ? input.split(',').map((v) => v.trim()).filter(Boolean) : [];

    const btsIds = parseIds(detail?.bts_link);
    const highlightIds = parseIds(detail?.highlight_link);

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
                                    {new Date(film.date).getFullYear()} • {film.note || 'TV Series'}
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

                                {film.rerun_link1 && (
                                    <a
                                        href={film.rerun_link1}
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

            {/* Trailer + Actors */}
            <div className="px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {detail?.trailerid && (
                    <div className="lg:col-span-2">
                        <SectionHeader icon={Youtube} title="Official Trailer" subtitle="Watch the official trailer" />
                        <div className="aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-card-bg">
                            <iframe className="w-full h-full" src={getYoutubeEmbedUrl(detail.trailerid)} allowFullScreen />
                        </div>
                    </div>
                )}
                <div>
                    <SectionHeader icon={Star} title="Main Characters" subtitle="Meet the actors" />
                    <div className="space-y-4">
                        {[
                            { name: 'Teetee', role: film.role_teetee, img: detail?.teeteeimg },
                            { name: 'Por', role: film.role_por, img: detail?.porimg }
                        ].map((actor, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-card-bg rounded-3xl border border-card-border hover:border-brand-primary/30 transition-colors shadow-sm group">
                                <div className="relative w-20 h-20 shrink-0">
                                    <img src={actor.img || film.poster} className="w-full h-full rounded-2xl object-cover border border-brand-primary-light" alt={actor.name} />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary mb-1">{actor.name}</span>
                                    <p className="text-sm font-bold text-content-text-main">as <span className="text-brand-accent">{actor.role}</span></p>
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
                            {film.synopsis || "Coming soon..."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Trend Summary */}
            {trendTags.length > 0 && (
                <div className="px-6 py-12">
                    <div className="relative">
                        <SectionHeader icon={TrendingUp} title="Trend Summary" subtitle="X Engagement Metrics" />
                        <div className="relative overflow-hidden bg-card-bg p-8 md:p-12 rounded-[2.5rem] border border-card-border shadow-sm">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {trendTags.map((item, idx) => (
                                    <a
                                        key={idx}
                                        href={item.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group block p-5 bg-page-bg border border-card-border rounded-3xl hover:border-brand-primary/40 transition-all duration-300 shadow-xs"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                <span className="text-[9px] font-black text-content-text-muted uppercase tracking-widest block mb-1.5 group-hover:text-brand-primary transition-colors">
                                                    {item.label}
                                                </span>
                                                <span className="text-content-text-main font-bold truncate block group-hover:text-brand-primary transition-colors">
                                                    {item.tag}
                                                </span>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-[8px] font-bold text-content-text-muted uppercase block mb-1">Engage</span>
                                                <span className="text-lg font-black text-brand-primary">
                                                    {item.engage}
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
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
