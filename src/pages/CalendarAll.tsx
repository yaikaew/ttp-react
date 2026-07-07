import { useState, useMemo, useEffect, type FormEvent } from 'react';
import { Plus, X, LoaderCircle } from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar';
import { useAuth } from '../hooks/useAuth';
import FilterHeader from '../components/FilterHeader'
import { LoadingState } from '../components/LoadingState'
import { NoResults } from '../components/NoResults';
import CalendarCard, { type CalendarEvent } from '../components/CalendarCard';
import { calendarService } from '../services/calendarService';

const formatToDatetimeLocal = (value: string) => {
    const date = new Date(value);
    const offsetMinutes = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offsetMinutes * 60000);
    return local.toISOString().slice(0, 16);
};

const parseFromDatetimeLocal = (value: string) => new Date(value).toISOString();

const CalendarAll = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filterArtist, setFilterArtist] = useState<string[]>(['All'])
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('asc')
    const [searchTerm, setSearchTerm] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [artistOptions, setArtistOptions] = useState<Array<{ id: number; name: string }>>([])
    const [createLoading, setCreateLoading] = useState(false)
    const [createError, setCreateError] = useState<string | null>(null)
    const [newEventArtistId, setNewEventArtistId] = useState<number | null>(null)
    const [newEventName, setNewEventName] = useState('')
    const [newEventDatetime, setNewEventDatetime] = useState(formatToDatetimeLocal(new Date().toISOString()))
    const [newEventLocation, setNewEventLocation] = useState('')
    const [newEventLivePlatform, setNewEventLivePlatform] = useState('')
    const [newEventPosterUrl, setNewEventPosterUrl] = useState('')
    const [newEventKeyword, setNewEventKeyword] = useState('')
    const [newEventHashtag, setNewEventHashtag] = useState('')
    const [newEventInfoLink, setNewEventInfoLink] = useState('')
    const [newEventRerunLink, setNewEventRerunLink] = useState('')
    const [newEventOutfit, setNewOutfit] = useState('')
    const [newEventOutfitImg, setNewOutfitImg] = useState('')
    const [newEventNote, setNewEventNote] = useState('')
    const [newEventDMD, setNewEventDMD] = useState('')

    const handleFilterArtistChange = (artist: string) => {
        setFilterArtist(prev => {
            if (prev.includes(artist)) {
                return prev.filter(a => a !== artist);
            } else {
                const newFilters = prev.filter(a => a !== 'All');
                return [...newFilters, artist];
            }
        });
    };

    const { schedule, loading, refreshSchedule } = useCalendar();
    const { session } = useAuth();

    useEffect(() => {
        document.body.style.overflow = isCreateModalOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCreateModalOpen]);

    const handleReset = () => {
        setFilterArtist(['All']); setSearchTerm(''); setStartDate(''); setEndDate(''); setSortOrder('asc');
    }

    const resetCreateForm = () => {
        setNewEventArtistId(artistOptions.find((artist) => artist.name === 'TeeteePor')?.id ?? artistOptions[0]?.id ?? null);
        setNewEventName('');
        setNewEventDatetime(formatToDatetimeLocal(new Date().toISOString()));
        setNewEventLocation('');
        setNewEventLivePlatform('');
        setNewEventPosterUrl('');
        setNewEventKeyword('');
        setNewEventHashtag('');
        setNewEventInfoLink('');
        setNewEventRerunLink('');
        setNewOutfit('');
        setNewOutfitImg('');
        setNewEventNote('');
        setNewEventDMD('');
    };

    const handleOpenCreateModal = async () => {
        setIsCreateModalOpen(true);
        setCreateError(null);
        setCreateLoading(true);

        try {
            const artists = await calendarService.getArtists();
            const sortedArtists = [...artists].sort((a, b) => a.name.localeCompare(b.name));
            setArtistOptions(sortedArtists);
            setNewEventArtistId(sortedArtists.find((artist) => artist.name === 'TeeteePor')?.id ?? sortedArtists[0]?.id ?? null);
            setNewEventDatetime(formatToDatetimeLocal(new Date().toISOString()));
        } catch (err) {
            setCreateError((err as Error).message);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCreateEvent = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!newEventArtistId || !newEventName.trim() || !newEventDatetime) {
            setCreateError('กรุณากรอกชื่อเหตุการณ์และเลือกศิลปินก่อน');
            return;
        }

        setCreateLoading(true);
        setCreateError(null);

        try {
            await calendarService.createEvent({
                artist_id: newEventArtistId,
                name: newEventName.trim(),
                datetimetz: parseFromDatetimeLocal(newEventDatetime),
                location: newEventLocation || null,
                live_platform: newEventLivePlatform || null,
                poster_url: newEventPosterUrl || null,
                keyword: newEventKeyword || null,
                hashtag: newEventHashtag || null,
                info_link: newEventInfoLink || null,
                rerun_link: newEventRerunLink || null,
                outfit: newEventOutfit || null,
                outfit_img: newEventOutfitImg || null,
                note: newEventNote || null,
                dmd: newEventDMD || null,
            });
            setIsCreateModalOpen(false);
            resetCreateForm();
            await refreshSchedule();
        } catch (err) {
            setCreateError((err as Error).message);
        } finally {
            setCreateLoading(false);
        }
    };

    // --- LOGIC 1: FILTERING & SORTING ---
    const sortedItems = useMemo(() => {
        const filtered = (schedule || []).filter(item => {
            if (!item.datetimetz) return false;

            const itemDateOnly = new Date(item.datetimetz);
            itemDateOnly.setHours(0, 0, 0, 0);
            const itemTime = itemDateOnly.getTime();

            const parseLocalDate = (dateString: string) => {
                const [year, month, day] = dateString.split('-').map(Number);
                return new Date(year, month - 1, day).getTime();
            };

            const start = startDate ? parseLocalDate(startDate) : -Infinity;
            const end = endDate ? new Date(parseLocalDate(endDate) + 24 * 60 * 60 * 1000 - 1).getTime() : Infinity;

            const artistName = Array.isArray(item.artist) ? item.artist[0]?.name : item.artist?.name;
            const matchArtist = filterArtist.includes('All') || (artistName && filterArtist.includes(artistName));
            const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchDate = itemTime >= start && itemTime <= end;

            return matchArtist && matchSearch && matchDate;
        });

        return [...filtered].sort((a, b) => {
            const dateA = new Date(a.datetimetz).getTime();
            const dateB = new Date(b.datetimetz).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [schedule, filterArtist, searchTerm, startDate, endDate, sortOrder]);

    // --- LOGIC 2: GROUPING BY MONTH ---
    const groupedItems = useMemo(() => {
        const groups: { [key: string]: typeof sortedItems } = {};
        sortedItems.forEach((item) => {
            const date = new Date(item.datetimetz);
            const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
            if (!groups[monthYear]) groups[monthYear] = [];
            groups[monthYear].push(item);
        });
        return groups;
    }, [sortedItems]);

    if (loading) return <LoadingState />

    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-20">
            <FilterHeader
                title="Calendar" subtitle="Artist Schedule"
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                onReset={handleReset}
                filterGroups={[
                    { label: 'Artist', selectedValues: filterArtist, options: ['All', 'Teetee', 'Por', 'TeeteePor', 'DEXX', 'BokBear'], onSelect: handleFilterArtistChange },
                ]}
            />

            {Boolean(session) && (
                <button
                    type="button"
                    onClick={handleOpenCreateModal}
                    className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-brand-primary/40 transition hover:bg-brand-primary/90"
                >
                    <Plus className="h-4 w-4" />
                </button>
            )}

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4 border-b border-brand-sidebar-border/50 pb-4">
                            <div>
                                <h3 className="text-lg font-bold">เพิ่มข้อมูลใน Calendar</h3>
                                <p className="text-xs text-content-text-sub">สร้างรายการใหม่สำหรับหน้า Calendar ได้ทันที</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setCreateError(null);
                                }}
                                className="rounded-full p-2 text-content-text-sub transition hover:bg-brand-primary/10 hover:text-brand-primary"
                                title="Cancel"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto p-6">
                            <form onSubmit={handleCreateEvent} className="space-y-5">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Artist</label>
                                        <select
                                            value={newEventArtistId ?? ''}
                                            onChange={(e) => setNewEventArtistId(Number(e.target.value) || null)}
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
                                            value={newEventName}
                                            onChange={(e) => setNewEventName(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            placeholder="เช่น Teetee Por Live"
                                            disabled={createLoading}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Date / Time</label>
                                        <input
                                            type="datetime-local"
                                            value={newEventDatetime}
                                            onChange={(e) => setNewEventDatetime(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            disabled={createLoading}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Location</label>
                                        <input
                                            type="text"
                                            value={newEventLocation}
                                            onChange={(e) => setNewEventLocation(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            placeholder="e.g., Online / Bangkok"
                                            disabled={createLoading}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Live platform</label>
                                        <input
                                            type="text"
                                            value={newEventLivePlatform}
                                            onChange={(e) => setNewEventLivePlatform(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            placeholder="e.g., YouTube Live"
                                            disabled={createLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Poster URL</label>
                                        <input
                                            type="url"
                                            value={newEventPosterUrl}
                                            onChange={(e) => setNewEventPosterUrl(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            placeholder="https://"
                                            disabled={createLoading}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Keyword</label>
                                        <input
                                            type="text"
                                            value={newEventKeyword}
                                            onChange={(e) => setNewEventKeyword(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            disabled={createLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Hashtag</label>
                                        <input
                                            type="text"
                                            value={newEventHashtag}
                                            onChange={(e) => setNewEventHashtag(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            disabled={createLoading}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Info link</label>
                                        <input
                                            type="url"
                                            value={newEventInfoLink}
                                            onChange={(e) => setNewEventInfoLink(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            placeholder="https://"
                                            disabled={createLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Rerun link</label>
                                        <input
                                            type="url"
                                            value={newEventRerunLink}
                                            onChange={(e) => setNewEventRerunLink(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            placeholder="https://"
                                            disabled={createLoading}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Outfit</label>
                                        <input
                                            type="url"
                                            value={newEventOutfit}
                                            onChange={(e) => setNewOutfit(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            disabled={createLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Outfit Image URL</label>
                                        <input
                                            type="url"
                                            value={newEventOutfitImg}
                                            onChange={(e) => setNewOutfitImg(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            disabled={createLoading}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">

                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">DMD</label>
                                        <input
                                            type="url"
                                            value={newEventDMD}
                                            onChange={(e) => setNewEventDMD(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            placeholder="DMD Link"
                                            disabled={createLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Note</label>
                                        <textarea
                                            value={newEventNote}
                                            onChange={(e) => setNewEventNote(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                            placeholder="Additional details"
                                            disabled={createLoading}
                                        />
                                    </div>
                                </div>

                                {createError && (
                                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {createError}
                                    </div>
                                )}

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

            <div className="px-4">
                {Object.keys(groupedItems).length > 0 ? (
                    Object.keys(groupedItems).map((monthYear) => (
                        <div key={monthYear} className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-brand-primary">
                                    {monthYear}
                                </h2>
                                <div className="h-px grow bg-linear-to-r from-brand-primary to-transparent" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                                {groupedItems[monthYear].map((event: CalendarEvent) => (
                                    <CalendarCard
                                        key={event.id}
                                        event={event}
                                        isEditable={Boolean(session)}
                                        onUpdated={refreshSchedule}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <NoResults onReset={handleReset} />
                )}
            </div>
        </div>
    );
};

export default CalendarAll;