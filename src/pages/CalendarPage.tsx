import { useState, useMemo, useEffect } from 'react';
import { Clock, MapPin, CalendarPlus, PlayCircle, X, Video, Hash, KeyRound, User } from 'lucide-react';
import FilterHeader from '../components/FilterHeader';
import { useCalendarEvents, useArtists } from '../hooks/useArtistData';
import { getArtistTheme, getDOWTheme } from '../utils/theme';
import { type CalendarEventUI } from '../utils/mappers';
import { LoadingState } from "../components/LoadingState";
import { NoResults } from '../components/NoResults';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';

const CalendarPage = () => {
    // --- States ---
    const [selectedEvent, setSelectedEvent] = useState<CalendarEventUI | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // --- Effects ---
    // Prevent background scroll when popup is open
    useEffect(() => {
        if (selectedEvent) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedEvent]);
    const [filterArtist, setFilterArtist] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // --- Data Fetching ---
    const { data: events = [], isLoading: isLoadingEvents } = useCalendarEvents(sortOrder);
    const { data: artists = [] } = useArtists();

    const handleReset = () => {
        setFilterArtist('All');
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
        setSortOrder('asc');
    };

    // --- Filter & Grouping Logic ---

    const categorizedItems = useMemo(() => {
        const isDateFilteringActive = !!(startDate || endDate);
        const todayDate = new Date().setHours(0, 0, 0, 0);

        const filtered = events.filter(item => {
            const itemDate = new Date(item.date).getTime();
            const start = startDate ? new Date(startDate).getTime() : -Infinity;
            const end = endDate ? new Date(endDate).getTime() : Infinity;
            const matchArtist = filterArtist === 'All' || item.artistName === filterArtist;
            const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchDate = itemDate >= start && itemDate <= end;
            return matchArtist && matchSearch && matchDate;
        });

        const displayItems = filtered
            .filter(item => {
                if (isDateFilteringActive) return true;
                return new Date(item.date).setHours(0, 0, 0, 0) >= todayDate;
            })
            .sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                if (dateA !== dateB) {
                    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
                }
                const timeA = a.time || "00.00";
                const timeB = b.time || "00.00";
                return sortOrder === 'asc'
                    ? timeA.localeCompare(timeB)
                    : timeB.localeCompare(timeA);
            });

        const groupByMonth = (items: CalendarEventUI[]) => {
            const groups: { [key: string]: CalendarEventUI[] } = {};
            items.forEach(item => {
                const date = new Date(item.date);
                const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
                if (!groups[monthYear]) groups[monthYear] = [];
                groups[monthYear].push(item);
            });
            return groups;
        };

        return {
            groups: groupByMonth(displayItems),
            isEmpty: displayItems.length === 0,
            isFiltered: isDateFilteringActive
        };
    }, [events, filterArtist, searchTerm, startDate, endDate, sortOrder]);
    // --- Helpers ---
    const getEventDescription = (item: CalendarEventUI) => {
        const lines = [];
        if (item.artistName) lines.push(`🙋🏻‍♂️ : ${item.artistName}`);
        if (item.location) lines.push(`📍 : ${item.location}`);
        if (item.live) lines.push(`🎥 : ${item.live}`);
        if (item.note) lines.push(`📢 : ${item.note}`);
        if (item.key || item.tag) lines.push("");
        if (item.key) lines.push(`🔑 : ${item.key}`);
        if (item.tag) lines.push(`#️⃣ : ${item.tag}`);
        if (item.link) lines.push("");
        if (item.link) lines.push(`🔗 : ${item.link}`);
        return lines.join('\n');
    };
    const generateGoogleUrl = (item: CalendarEventUI) => {
        const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
        const desc = encodeURIComponent(getEventDescription(item));
        const title = encodeURIComponent(item.name);
        const loc = encodeURIComponent(item.location || '');
        const dateStr = item.date.replace(/-/g, '');
        let dates = "";
        if (item.time && item.time.trim() !== "") {
            const cleanTime = item.time.replace(/[.:]/g, '');
            const timeStr = `T${cleanTime}00`;
            dates = `${dateStr}${timeStr}/${dateStr}${timeStr}`;
        } else {
            const startDate = new Date(item.date);
            const endDate = new Date(item.date);
            endDate.setDate(startDate.getDate() + 1);
            const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '');
            dates = `${dateStr}/${endDateStr}`;
        }
        return `${baseUrl}&text=${title}&details=${desc}&location=${loc}&dates=${dates}&ctz=Asia/Bangkok`;
    };

    const artistOptions = useMemo(() => {
        return ['All', ...artists.map(a => a.name)];
    }, [artists]);

    // --- Sub-components ---
    const EventCard = ({ item }: { item: CalendarEventUI }) => {
        const dateObj = new Date(item.date);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const isToday = new Date().toDateString() === dateObj.toDateString();
        const dowTheme = getDOWTheme(item.date);

        // ดึง Theme จากไฟล์ theme.ts ที่คุณทำไว้
        const artistTheme = getArtistTheme(item.artistName);

        return (
            <div
                onClick={() => setSelectedEvent(item)}
                className="
                    group relative
                    bg-card-bg
                    rounded-4xl
                    overflow-hidden
                    cursor-pointer
                    border border-card-border
                    shadow-sm
                    flex flex-col
                    transition-all duration-500
                    hover:-translate-y-1
                    hover:shadow-2xl hover:shadow-brand-primary/10
                "
            >
                {isToday && (
                    <div
                        className="
                absolute top-4 right-4 z-10
                bg-brand-accent
                text-white
                text-[10px] font-black
                px-3 py-1 rounded-full
                shadow-lg
                animate-pulse
            "
                    >
                        TODAY
                    </div>
                )}

                {/* poster */}
                <div className="relative aspect-4/3 overflow-hidden bg-brand-primary-light/30">
                    {item.poster ? (
                        <img
                            src={item.poster}
                            alt={item.name}
                            className="
                    w-full h-full object-cover
                    transition-transform duration-700
                    group-hover:scale-105
                "
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-content-text-muted font-bold">
                            No Poster
                        </div>
                    )}

                    {/* date badge */}
                    <div
                        className={`
                absolute top-4 left-4
                ${dowTheme}
                text-white
                rounded-2xl
                p-2 min-w-[56px]
                flex flex-col items-center
                shadow-md backdrop-blur-sm
            `}
                    >
                        <span className="text-[10px] font-bold mb-1 opacity-90 leading-none">
                            {month}
                        </span>
                        <span className="text-2xl font-black leading-none">
                            {day}
                        </span>
                    </div>
                </div>

                {/* content */}
                <div className="p-5 flex flex-col flex-1">
                    {/* artist */}
                    <div className="mb-3">
                        <span
                            className={`
                    ${artistTheme.text}
                    ${artistTheme.bg}
                    ${artistTheme.border}
                    inline-block
                    px-2.5 py-1
                    text-[9px] font-black uppercase tracking-wider
                    rounded-lg border
                `}
                        >
                            {item.artistName}
                        </span>
                    </div>

                    {/* title */}
                    <h3
                        className="
                text-content-text-main
                text-sm font-black leading-tight
                mb-4 h-9 line-clamp-2
                transition-colors
                group-hover:text-brand-primary
            "
                    >
                        {item.name}
                    </h3>

                    {/* meta */}
                    <div className="mt-auto space-y-2 text-[11px] font-bold text-content-text-sub">
                        <div className="flex items-center gap-2">
                            <Clock size={12} className="text-brand-primary" />
                            {item.time || 'TBA'}
                        </div>

                        {(item.location || item.live) && (
                            <div className="flex items-center gap-2">
                                <MapPin size={12} className="text-brand-primary" />
                                <span className="truncate">
                                    {item.location || item.live}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>


        );
    };

    return (
        <div className="min-h-screen pb-20">
            <FilterHeader
                title="Event Calendar"
                subtitle={categorizedItems.isFiltered ? "Filtered Results" : "Schedule & Live Streaming"}
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                onReset={handleReset}
                filterGroups={[{ label: 'Artist', currentValue: filterArtist, options: artistOptions, onSelect: setFilterArtist }]}
            />

            <div className="max-w-7xl mx-auto px-4">
                {isLoadingEvents ? (
                    <LoadingState />
                ) : categorizedItems.isEmpty ? (
                    <NoResults onReset={handleReset} />
                ) : (
                    Object.entries(categorizedItems.groups).map(([month, items]) => (
                        <div key={month} className="mb-16">
                            <div className="flex items-center gap-6 mb-8">
                                <h2
                                    className="
                                        text-2xl font-black uppercase tracking-tight
                                        text-brand-primary
                                    "
                                >
                                    {month}
                                </h2>

                                <div
                                    className="
                                        h-px grow
                                        bg-linear-to-r
                                        from-brand-primary
                                        to-transparent
                                    "
                                />
                            </div>

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-2
                                    lg:grid-cols-3
                                    xl:grid-cols-4
                                    gap-6
                                "
                            >
                                {items.map(item => (
                                    <EventCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>

                    ))
                )}
            </div>

            {selectedEvent && (
                <div
                    className="
        fixed inset-0 z-100
        flex items-center justify-center
        p-4
        bg-overlay-bg
        backdrop-blur-sm
    "
                >
                    <div
                        className="
            bg-card-bg
            w-full max-w-2xl max-h-[90vh]
            rounded-[2.5rem]
            overflow-hidden
            relative
            shadow-2xl
            flex flex-col
            border border-card-border
        "
                    >
                        {/* Close */}
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="
                absolute top-6 right-6 z-10
                w-10 h-10
                flex items-center justify-center
                rounded-full
                bg-page-bg text-content-text-muted hover:bg-brand-primary hover:text-white
                transition-all
            "
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="overflow-y-auto p-8 md:p-10">
                            {/* Poster */}
                            <div className="relative mb-8">
                                <img
                                    src={selectedEvent.poster}
                                    alt={selectedEvent.name}
                                    className="
                        w-full max-h-[350px]
                        object-contain
                        rounded-3xl
                        shadow-md
                        bg-surface-soft
                    "
                                />
                            </div>

                            {/* Title */}
                            <h2
                                className="
                    text-2xl font-black
                    text-content-text-main
                    mb-8 leading-tight
                "
                            >
                                {selectedEvent.name}
                            </h2>

                            {/* Info grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
                                {/* Date */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-brand-primary-soft text-brand-primary rounded-2xl shadow-sm">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="label-meta">Date & Time</p>
                                        <p className="font-bold text-content-text-main">
                                            {new Date(selectedEvent.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                        </p>
                                        <p className="text-sm font-semibold text-content-text-sub">
                                            {selectedEvent.time || '-'}
                                        </p>
                                    </div>
                                </div>

                                {/* Artist */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-brand-primary-soft text-brand-primary rounded-2xl shadow-sm">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="label-meta">Artist</p>
                                        <p className="font-bold text-content-text-main">
                                            {selectedEvent.artistName || '-'}
                                        </p>
                                    </div>
                                </div>

                                {/* Keyword */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-brand-primary-soft text-brand-primary rounded-2xl shadow-sm">
                                        <KeyRound className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="label-meta">Keyword</p>
                                        {selectedEvent.key ? (
                                            <a
                                                href={`https://x.com/search?q=%22${encodeURIComponent(selectedEvent.key)}%22`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-brand-primary hover:opacity-80 transition-opacity"
                                            >
                                                {selectedEvent.key}
                                            </a>
                                        ) : (
                                            <p className="font-bold text-content-text-main">-</p>
                                        )}
                                    </div>
                                </div>

                                {/* Hashtag */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-brand-primary-soft text-brand-primary rounded-2xl shadow-sm">
                                        <Hash className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="label-meta">Hashtag</p>
                                        {selectedEvent.tag ? (
                                            <a
                                                href={`https://x.com/search?q=${encodeURIComponent(selectedEvent.tag)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-brand-primary hover:opacity-80 transition-opacity"
                                            >
                                                {selectedEvent.tag}
                                            </a>
                                        ) : (
                                            <p className="font-bold text-content-text-main">-</p>
                                        )}
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-brand-primary-soft text-brand-primary rounded-2xl shadow-sm">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="label-meta">Location</p>
                                        <p className="font-bold text-content-text-main line-clamp-2">
                                            {selectedEvent.location || '-'}
                                        </p>
                                    </div>
                                </div>

                                {/* Platform */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-brand-primary-soft text-brand-primary rounded-2xl shadow-sm">
                                        <Video className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="label-meta">Platform</p>
                                        <p className="font-bold text-content-text-main">
                                            {selectedEvent.live || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Note */}
                            {selectedEvent.note && (
                                <div className="md:col-span-2 p-4 bg-note-bg rounded-2xl border border-note-border italic text-sm text-note-text flex items-start gap-3 mt-2">
                                    <span className="leading-relaxed">{selectedEvent.note}</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-4 flex gap-4 pt-4 border-t border-card-border">
                                {selectedEvent.link && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        href={selectedEvent.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        icon={PlayCircle}
                                        className="grow rounded-full h-11 uppercase"
                                    >
                                        Watch Rerun / Live
                                    </Button>
                                )}

                                <IconButton
                                    href={generateGoogleUrl(selectedEvent)}
                                    icon={CalendarPlus}
                                    className="ml-auto gap-2 hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
};

export default CalendarPage;