import { useState, useEffect, type FormEvent } from 'react';
import { LoaderCircle, Plus, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useContent } from '../hooks/useContent';
import { useFilter } from '../hooks/useFilter';
import FilterHeader from '../components/FilterHeader';
import { LoadingState } from '../components/LoadingState';
import { NoResults } from '../components/NoResults';
import { contentService } from '../services/AllService';
import { getArtistTheme, getTypeTheme } from '../utils/theme';

const Content = () => {
    const DEFAULT_CONTENT_IMG_URL = 'https://img.youtube.com/vi//maxresdefault.jpg';

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [artistOptions, setArtistOptions] = useState<Array<{ id: number; name: string }>>([]);
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [newContentArtistId, setNewContentArtistId] = useState<number | null>(null);
    const [newContentName, setNewContentName] = useState('');
    const [newContentType, setNewContentType] = useState('');
    const [newContentDate, setNewContentDate] = useState(new Date().toISOString().slice(0, 10));
    const [newContentImg, setNewContentImg] = useState(DEFAULT_CONTENT_IMG_URL);
    const [newContentLink, setNewContentLink] = useState('');

    const { session } = useAuth();
    const { contents, loading, refreshContent } = useContent();

    const {
        state,
        setters,
        handleReset,
        filteredItems
    } = useFilter(contents || []);

    useEffect(() => {
        document.body.style.overflow = isCreateModalOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCreateModalOpen]);

    const resetCreateForm = () => {
        setNewContentArtistId(artistOptions.find((artist) => artist.name === 'TeeteePor')?.id ?? artistOptions[0]?.id ?? null);
        setNewContentName('');
        setNewContentType('');
        setNewContentDate(new Date().toISOString().slice(0, 10));
        setNewContentImg(DEFAULT_CONTENT_IMG_URL);
        setNewContentLink('');
        setCreateError(null);
    };

    const openCreateModal = async () => {
        setIsCreateModalOpen(true);
        setCreateError(null);
        setCreateLoading(true);

        try {
            const artists = await contentService.getArtists();
            const sortedArtists = [...artists].sort((a, b) => a.name.localeCompare(b.name));
            setArtistOptions(sortedArtists);
            setNewContentArtistId(sortedArtists.find((artist) => artist.name === 'TeeteePor')?.id ?? sortedArtists[0]?.id ?? null);
            setNewContentName('');
            setNewContentType('');
            setNewContentDate(new Date().toISOString().slice(0, 10));
            setNewContentImg(DEFAULT_CONTENT_IMG_URL);
            setNewContentLink('');
        } catch (err) {
            setCreateError((err as Error).message);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCreateContent = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!newContentArtistId || !newContentName.trim() || !newContentDate) {
            setCreateError('กรุณากรอก Artist, ชื่อ Content และวันที่ให้ครบถ้วน');
            return;
        }

        setCreateLoading(true);
        setCreateError(null);

        try {
            await contentService.createContent({
                artist_id: newContentArtistId,
                name: newContentName.trim(),
                type: newContentType.trim() || null,
                date: newContentDate,
                img: newContentImg.trim() || null,
                link: newContentLink.trim() || null,
            });

            setIsCreateModalOpen(false);
            resetCreateForm();
            await refreshContent();
        } catch (err) {
            setCreateError((err as Error).message);
        } finally {
            setCreateLoading(false);
        }
    };

    if (loading) return <LoadingState />;

    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-20">
            <FilterHeader
                title="Contents" subtitle="Media Appearances"
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={state.sortOrder} setSortOrder={setters.setSortOrder}
                searchTerm={state.searchTerm} setSearchTerm={setters.setSearchTerm}
                startDate={state.startDate} setStartDate={setters.setStartDate}
                endDate={state.endDate} setEndDate={setters.setEndDate}
                onReset={handleReset}
                filterGroups={[
                    { label: 'Artist', selectedValues: state.filterArtist, options: ['All', 'Teetee', 'Por', 'TeeteePor', 'DEXX'], onSelect: setters.setFilterArtist },
                    { label: 'Type', selectedValues: state.filterType, options: ['All', 'Online Shows', 'Special', 'BTS', 'Press Tour', 'Press Cons', 'Reaction', 'Live', 'Interview', 'Live Event'], onSelect: setters.setFilterType }
                ]}
            />

            {session && (
                <button
                    type="button"
                    onClick={openCreateModal}
                    className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-brand-primary/40 transition hover:bg-brand-primary/90"
                >
                    <Plus className="h-4 w-4" />
                </button>
            )}

            <div className="px-4">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredItems.map((item) => {
                            const artistData = Array.isArray(item.artist) ? item.artist[0] : item.artist;
                            const artistName = artistData?.name || 'Unknown';
                            const artistTheme = getArtistTheme(artistName);
                            const typeTheme = getTypeTheme ? getTypeTheme(item.type || '') : undefined;

                            return (
                                <a
                                    key={item.id}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-card-bg rounded-3xl border border-card-border overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-primary-light/50 transition-all duration-500 flex flex-col"
                                >
                                    <div className="aspect-video bg-slate-100 overflow-hidden">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition"
                                        />
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-4 flex flex-col grow space-y-2">
                                        <div className="flex flex-wrap gap-2 text-[10px]">
                                            <span className={`uppercase px-2 py-0.5 rounded-lg border ${artistTheme.border} ${artistTheme.bg} ${artistTheme.text}`}>
                                                {artistName}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-lg border ${typeTheme?.border || 'border-slate-100'} ${typeTheme?.bg || 'bg-white/90'} ${typeTheme?.text || 'text-slate-700'}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-content-text-muted ml-auto">
                                                {item.date}
                                            </span>
                                        </div>

                                        <h3 className="text-sm text-content-text-main line-clamp-2">
                                            {item.name}
                                        </h3>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                ) : (
                    <NoResults onReset={handleReset} />
                )}
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4 border-b border-brand-sidebar-border/50 pb-4">
                            <div>
                                <h3 className="text-lg font-bold">เพิ่มข้อมูลใน Contents</h3>
                                <p className="text-xs text-content-text-sub">เพิ่มข้อมูล Contents ใหม่ไปยังฐานข้อมูล</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setCreateError(null);
                                }}
                                className="rounded-full p-2 text-content-text-sub transition hover:bg-brand-primary/10 hover:text-brand-primary"
                                title="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto p-6">
                            <form onSubmit={handleCreateContent} className="space-y-5">
                                {createError && (
                                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {createError}
                                    </div>
                                )}

                                <div className="grid gap-4 sm:grid-cols-2">

                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Artist</label>
                                        <select
                                            value={newContentArtistId ?? ''}
                                            onChange={(e) => setNewContentArtistId(Number(e.target.value) || null)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                        >
                                            {artistOptions.map((artist) => (
                                                <option key={artist.id} value={artist.id}>
                                                    {artist.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Name</label>
                                        <input
                                            type="text"
                                            value={newContentName}
                                            onChange={(e) => setNewContentName(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            disabled={createLoading}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Type</label>
                                        <select
                                            value={newContentType}
                                            onChange={(e) => setNewContentType(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            disabled={createLoading}
                                        >
                                            <option value="">เลือกประเภท</option>
                                            <option value="Online Shows">Online Shows</option>
                                            <option value="Special">Special</option>
                                            <option value="BTS">BTS</option>
                                            <option value="Press Tour">Press Tour</option>
                                            <option value="Press Cons">Press Cons</option>
                                            <option value="Reaction">Reaction</option>
                                            <option value="Live">Live</option>
                                            <option value="Interview">Interview</option>
                                            <option value="Live Event">Live Event</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Date</label>
                                        <input
                                            type="date"
                                            value={newContentDate}
                                            onChange={(e) => setNewContentDate(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            disabled={createLoading}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">IMG URL</label>
                                        <input
                                            type="text"
                                            value={newContentImg}
                                            placeholder="https://img.youtube.com/vi//maxresdefault.jpg"
                                            onChange={(e) => setNewContentImg(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            disabled={createLoading}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">URL</label>
                                        <input
                                            type="text"
                                            value={newContentLink}
                                            onChange={(e) => setNewContentLink(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            disabled={createLoading}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreateModalOpen(false);
                                            setCreateError(null);
                                        }}
                                        className="rounded-2xl border border-brand-sidebar-border/70 px-5 py-3 text-xs uppercase tracking-widest font-bold text-content-text-main hover:bg-brand-sidebar-border/20 transition"
                                        disabled={createLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createLoading}
                                        className="rounded-2xl bg-brand-primary px-3 py-3 text-xs uppercase tracking-widest font-bold text-white hover:bg-brand-primary/90 transition disabled:opacity-60"
                                    >
                                        {createLoading ? (
                                            <><LoaderCircle className="h-4 w-4 animate-spin" /> Saving...</>
                                        ) : (
                                            <>Save Data</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Content;