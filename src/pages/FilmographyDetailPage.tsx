import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
    ArrowLeft,
    Play,
    Youtube,
    TrendingUp,
    Info,
    Film,
    Sparkles
} from 'lucide-react';
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

    // Helper to extract YouTube ID if a full URL was provided
    const getYoutubeEmbedUrl = (idOrUrl: string) => {
        if (!idOrUrl) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = idOrUrl.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : idOrUrl;
        return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
    };

    return (
        <div className="min-h-screen pb-32">
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
                                        className="px-4 py-2 bg-surface-soft border border-card-border text-brand-primary rounded-xl font-black text-sm"
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

                                {film.rerun_link2 && (
                                    <a
                                        href={film.rerun_link2}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-2 bg-accent-warning text-white rounded-xl font-black text-sm shadow-lg shadow-accent-warning/25 hover:bg-accent-warning-hover transition-all active:scale-95"
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


            <div className="max-w-7xl mx-auto px-6 py-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Trailer Section */}
                        {detail?.trailerid && (
                            <section className="bg-card-bg rounded-4xl p-6 md:p-10 border border-card-border shadow-xl shadow-card-shadow/50">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-brand-primary text-content-text-main rounded-2xl flex items-center justify-center">
                                        <Youtube size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black text-content-text-main">Official Trailer</h2>
                                </div>
                                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-card-border">
                                    <iframe
                                        className="w-full h-full"
                                        src={getYoutubeEmbedUrl(detail.trailerid)}
                                        title="Trailer"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </section>
                        )}

                        {/* Synopsis */}
                        <section className="bg-card-bg rounded-4xl p-10 border border-card-border shadow-xl shadow-card-shadow/50">
                            <div className="flex items-center gap-3 mb-6 font-bold text-content-text-muted">
                                <Info size={18} />
                                <span className="uppercase text-[10px] tracking-widest">About this Work</span>
                            </div>
                            <h2 className="text-2xl font-black text-content-text-main mb-6">เรื่องย่อ (Synopsis)</h2>
                            <p className="text-lg text-content-text-muted leading-relaxed font-medium">
                                {film.synopsis || "Coming soon..."}
                            </p>
                        </section>

                        {/* Multi Video Sections (BTS & Highlights) */}
                        <div className="space-y-12">
                            {/* BTS Videos */}
                            {detail?.bts_link && (
                                <section className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                                <Film size={20} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-content-text-main tracking-tight">Behind The Scenes</h2>
                                                <p className="text-[10px] font-bold text-content-text-muted uppercase tracking-[0.2em]">Exclusive Footage</p>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex gap-2 text-[10px] font-black text-content-text-muted uppercase">
                                            <span>Scroll to explore</span>
                                            <div className="w-4 h-4 rounded-full border border-card-border flex items-center justify-center animate-pulse">→</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto pb-6 -mx-2 px-2 scrollbar-none snap-x snap-mandatory lg:gap-6">
                                        {detail.bts_link.split(',').map((id, index) => (
                                            <div key={index} className="flex-none w-[280px] md:w-[360px] snap-start">
                                                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl bg-black border-2 border-white group hover:border-indigo-600 transition-all duration-500">
                                                    <iframe
                                                        className="w-full h-full"
                                                        src={getYoutubeEmbedUrl(id.trim())}
                                                        title={`BTS ${index + 1}`}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                                <p className="mt-3 text-[10px] font-black text-content-text-muted uppercase tracking-widest pl-2">Part {index + 1}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Highlight Videos */}
                            {detail?.highlight_link && (
                                <section className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                                                <Sparkles size={20} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-content-text-main tracking-tight">Highlights</h2>
                                                <p className="text-[10px] font-bold text-content-text-muted uppercase tracking-[0.2em]">Best Moments</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto pb-6 -mx-2 px-2 scrollbar-none snap-x snap-mandatory lg:gap-6">
                                        {detail.highlight_link.split(',').map((id, index) => (
                                            <div key={index} className="flex-none w-[280px] md:w-[360px] snap-start">
                                                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl bg-black border-2 border-white group hover:border-amber-500 transition-all duration-500">
                                                    <iframe
                                                        className="w-full h-full"
                                                        src={getYoutubeEmbedUrl(id.trim())}
                                                        title={`Highlight ${index + 1}`}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                                <p className="mt-3 text-[10px] font-black text-content-text-muted uppercase tracking-widest pl-2">Moment {index + 1}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Characters & Trends */}
                    <div className="space-y-8">
                        {/* Character Cards */}
                        <div className="bg-card-bg rounded-4xl p-8 border border-card-border shadow-xl shadow-card-shadow/50">
                            <h3 className="text-xl font-black text-content-text-main mb-8 border-b border-card-border pb-4">
                                {film.status.toLowerCase().includes('support') ? 'Support Characters' : 'Main Characters'}
                            </h3>

                            <div className="space-y-8">
                                <div className="flex items-center gap-5 group">
                                    <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-card-border shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                                        <img src={detail?.teeteeimg || film.poster} alt="Teetee" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block mb-1">Teetee</span>
                                        <h4 className="text-lg font-black text-content-text-main">{film.role_teetee}</h4>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 group">
                                    <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-card-border shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                                        <img src={detail?.porimg || film.poster} alt="Por" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block mb-1">Por</span>
                                        <h4 className="text-lg font-black text-content-text-main">{film.role_por}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trend Summary */}
                        {trendTags.length > 0 && (
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                                <TrendingUp className="absolute -top-6 -right-6 text-white/5 w-32 h-32 -rotate-12" />
                                <div className="relative z-10 flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
                                        <TrendingUp size={20} />
                                    </div>
                                    <h3 className="text-xl font-black text-white">Trend Summary</h3>
                                </div>
                                <div className="relative z-10 space-y-3">
                                    {trendTags.map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={item.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mb-1">{item.label}</span>
                                                    <span className="text-slate-200 font-bold group-hover:text-white transition-colors">{item.tag}</span>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="font-black text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                                        {item.engage}
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilmographyDetailPage;
