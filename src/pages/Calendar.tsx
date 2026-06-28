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

const Calendar = () => {
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
        setNewEventArtistId(null);
        setNewEventName('');
        setNewEventDatetime(formatToDatetimeLocal(new Date().toISOString()));
        setNewEventLocation('');
        setNewEventLivePlatform('');
        setNewEventPosterUrl('');
        setNewEventKeyword('');
        setNewEventHashtag('');
        setNewEventInfoLink('');
        setNewEventRerunLink('');
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
            setNewEventArtistId(sortedArtists[0]?.id ?? null);
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

            const itemDateObj = new Date(item.datetimetz);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const nowTime = today.getTime();

            const itemDateOnly = new Date(itemDateObj);
            itemDateOnly.setHours(0, 0, 0, 0);
            const itemTime = itemDateOnly.getTime();

            const isDateFiltered = startDate !== '' || endDate !== '';
            const matchUpcoming = isDateFiltered ? true : itemTime >= nowTime;

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

            return matchUpcoming && matchArtist && matchSearch && matchDate;
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
                <div className="px-4 flex justify-end mb-6">
                    <button
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 transition hover:bg-brand-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        เพิ่มข้อมูลจากเว็บ
                    </button>
                </div>
            )}

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4 border-b border-brand-sidebar-border/50 pb-4">
                            <div>
                                <h3 className="text-xl font-black text-content-text-main">เพิ่มข้อมูลใน Calendar</h3>
                                <p className="text-sm text-content-text-sub">สร้างรายการใหม่สำหรับหน้า Calendar ได้ทันที</p>
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

                        <form onSubmit={handleCreateEvent} className="mt-6 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="flex flex-col gap-2 text-sm font-medium text-content-text-main">
                                    <span>Artist</span>
                                    <select
                                        value={newEventArtistId ?? ''}
                                        onChange={(event) => setNewEventArtistId(Number(event.target.value) || null)}
                                        className="rounded-2xl border border-brand-sidebar-border bg-page-bg px-4 py-3 outline-none focus:border-brand-primary"
                                        disabled={createLoading}
                                    >
                                        <option value="">Select Artist</option>
                                        {artistOptions.map((artist) => (
                                            <option key={artist.id} value={artist.id}>{artist.name}</option>
                                        ))}
                                    </select>
                                </label>

                                <label className="flex flex-col gap-2 text-sm font-medium text-content-text-main">
                                    <span>Event Name</span>
                                    <input
                                        type="text"
                                        value={newEventName}
                                        onChange={(event) => setNewEventName(event.target.value)}
                                        className="rounded-2xl border border-brand-sidebar-border bg-page-bg px-4 py-3 outline-none focus:border-brand-primary"
                                        placeholder="เช่น Teetee Por Live"
                                        disabled={createLoading}
                                        required
                                    />
                                </label>

                                <label className="flex flex-col gap-2 text-sm font-medium text-content-text-main">
                                    <span>Date and Time</span>
                                    <input
                                        type="datetime-local"
                                        value={newEventDatetime}
                                        onChange={(event) => setNewEventDatetime(event.target.value)}
                                        className="rounded-2xl border border-brand-sidebar-border bg-page-bg px-4 py-3 outline-none focus:border-brand-primary"
                                        disabled={createLoading}
                                        required
                                    />
                                </label>

                                <label className="flex flex-col gap-2 text-sm font-medium text-content-text-main">
                                    <span>Location</span>
                                    <input
                                        type="text"
                                        value={newEventLocation}
                                        onChange={(event) => setNewEventLocation(event.target.value)}
                                        className="rounded-2xl border border-brand-sidebar-border bg-page-bg px-4 py-3 outline-none focus:border-brand-primary"
                                        placeholder="e.g., Online / Bangkok"
                                        disabled={createLoading}
                                    />
                                </label>

                                <label className="flex flex-col gap-2 text-sm font-medium text-content-text-main">
                                    <span>Live Platform</span>
                                    <input
                                        type="text"
                                        value={newEventLivePlatform}
                                        onChange={(event) => setNewEventLivePlatform(event.target.value)}
                                        className="rounded-2xl border border-brand-sidebar-border bg-page-bg px-4 py-3 outline-none focus:border-brand-primary"
                                        placeholder="e.g., YouTube Live"
                                        disabled={createLoading}
                                    />
                                </label>

                                <label className="flex flex-col gap-2 text-sm font-medium text-content-text-main">
                                    <span>Poster URL</span>
                                    <input
                                        type="url"
                                        value={newEventPosterUrl}
                                        onChange={(event) => setNewEventPosterUrl(event.target.value)}
                                        className="rounded-2xl border border-brand-sidebar-border bg-page-bg px-4 py-3 outline-none focus:border-brand-primary"
                                        placeholder="https://"
                                        disabled={createLoading}
                                    />
                                </label>

                                <label className="flex flex-col gap-2 text-sm font-medium text-content-text-main">
                                    <span>Keyword</span>
                                    <input
                                        type="text"
                                        value={newEventKeyword}
                                        onChange={(event) => setNewEventKeyword(event.target.value)}
                                        className="rounded-2xl border border-brand-sidebar-border bg-page-bg px-4 py-3 outline-none focus:border-brand-primary"
                                        disabled={createLoading}
                                    />
                                </label>

                                <label className="flex flex-col gap-2 text-sm font-medium text-content-text-main">
                                    <span>Hashtag</span>
                                    <input
                                        type="text"
                                        value={newEventHashtag}
                                        onChange={(event) => setNewEventHashtag(event.target.value)}
                                        className="rounded-2xl border border-brand-sidebar-border bg-page-bg px-4 py-3 outline-none focus:border-brand-primary"
                                        disabled={createLoading}
                                    />
                                </label>

                                <label className="flex flex-col gap-2 text-sm font-medium text-content-text-main">
                                    <span>Info Link</span>
                                    <input
                                        type="url"
                                        value={newEventInfoLink}
                                        onChange={(event) => setNewEventInfoLink(event.target.value)}
                                        className="rounded-2xl border border-brand-sidebar-border bg-page-bg px-4 py-3 outline-none focus:border-brand-primary"
                                        placeholder="https://"
                                        disabled={createLoading}
                                    />
                                </label>

                                <label className="flex flex-col gap-2 text-sm font-medium text-content-text-main">
                                    <span>Rerun Link</span>
                                    <input
                                        type="url"
                                        value={newEventRerunLink}
                                        onChange={(event) => setNewEventRerunLink(event.target.value)}
                                        className="rounded-2xl border border-brand-sidebar-border bg-page-bg px-4 py-3 outline-none focus:border-brand-primary"
                                        placeholder="https://"
                                        disabled={createLoading}
                                    />
                                </label>

                                <label className="flex flex-col gap-2 text-sm font-medium text-content-text-main">
                                    <span>DMD</span>
                                    <input
                                        type="text"
                                        value={newEventDMD}
                                        onChange={(event) => setNewEventDMD(event.target.value)}
                                        className="rounded-2xl border border-brand-sidebar-border bg-page-bg px-4 py-3 outline-none focus:border-brand-primary"
                                        placeholder="DMD Link"
                                        disabled={createLoading}
                                    />
                                </label>

                                <label className="flex flex-col gap-2 text-sm font-medium text-content-text-main">
                                    <span>Note</span>
                                    <textarea
                                        value={newEventNote}
                                        onChange={(event) => setNewEventNote(event.target.value)}
                                        className="rounded-2xl border border-brand-sidebar-border bg-page-bg px-4 py-3 outline-none focus:border-brand-primary"
                                        placeholder="Additional details"
                                        disabled={createLoading}
                                    />
                                </label>
                            </div>

                            {createError && (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {createError}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        setCreateError(null);
                                    }}
                                    className="rounded-2xl border border-brand-sidebar-border px-4 py-2.5 text-sm font-semibold text-content-text-sub transition hover:bg-brand-sidebar-border/20"
                                    disabled={createLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                                    disabled={createLoading}
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

export default Calendar;