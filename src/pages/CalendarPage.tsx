import { useState, useMemo } from 'react';
import { Clock, MapPin, CalendarPlus, PlayCircle, X, Video, Hash, KeyRound, User, SearchX } from 'lucide-react';
import FilterHeader from '../components/FilterHeader';
import { useCalendarEvents, useArtists } from '../hooks/useArtistData';
import { getArtistTheme, getDOWTheme } from '../utils/theme';
import { type CalendarEventUI } from '../utils/mappers';

const CalendarPage = () => {
    // --- States ---
    const [selectedEvent, setSelectedEvent] = useState<CalendarEventUI | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
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
                className="group relative bg-white rounded-4xl overflow-hidden cursor-pointer border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 flex flex-col shadow-sm"
            >
                {isToday && (
                    <div className="absolute top-4 right-4 z-10 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse">
                        TODAY
                    </div>
                )}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    {item.poster ? (
                        <img src={item.poster} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold">No Poster</div>
                    )}
                    <div className={`absolute top-4 left-4 ${dowTheme} text-white rounded-2xl p-2 min-w-[55px] flex flex-col items-center shadow-md backdrop-blur-sm`}>
                        <span className="text-[10px] font-bold leading-none mb-1 opacity-90">{month}</span>
                        <span className="text-2xl font-black leading-none">{day}</span>
                    </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                    <div className="mb-3">
                        <span className={`${artistTheme.text} ${artistTheme.bg} inline-block px-2.5 py-1 text-[9px] font-black tracking-wider uppercase rounded-lg border ${artistTheme.border}`}>
                            {item.artistName}
                        </span>
                    </div>
                    <h3 className="text-slate-800 text-sm font-black leading-tight mb-4 line-clamp-2 group-hover:text-indigo-600 h-9">
                        {item.name}
                    </h3>
                    <div className="mt-auto space-y-2">
                        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                            <Clock size={12} className="text-indigo-400" /> {item.time || 'TBA'}
                        </div>
                        {(item.location || item.live) && (
                            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                                <MapPin size={12} className="text-indigo-400" /> <span className="truncate">{item.location || item.live}</span>
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
                    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                        <div className="w-10 h-10 border-2 border-indigo-100 border-t-indigo-400 rounded-full animate-spin mb-4"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Loading Archives</p>
                    </div>
                ) : categorizedItems.isEmpty ? (
                    <div className="flex flex-col items-center justify-center py-40 bg-white/40 backdrop-blur-[2px] rounded-[4rem] border border-dashed border-slate-200 animate-in zoom-in-95 duration-500">
                        <div className="bg-indigo-50/50 p-8 rounded-full mb-6 ring-8 ring-indigo-50/30">
                            <SearchX className="w-12 h-12 text-indigo-200" />
                        </div>
                        <h3 className="text-slate-800 font-black text-xl tracking-tight">No Results Found</h3>
                        <p className="text-slate-400 text-xs font-medium italic mt-2 max-w-[240px] text-center leading-relaxed">
                            We couldn't find anything matching your filters. Try adjusting your search or resetting.
                        </p>
                        <button onClick={handleReset} className="mt-8 px-8 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 shadow-sm hover:shadow-indigo-100">
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    Object.entries(categorizedItems.groups).map(([month, items]) => (
                        <div key={month} className="mb-16">
                            <div className="flex items-center gap-6 mb-8">
                                <h2 className="text-2xl font-black text-slate-400 tracking-tight uppercase">{month}</h2>
                                <div className="h-px grow bg-linear-to-r from-slate-200 to-transparent" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {items.map((item) => <EventCard key={item.id} item={item} />)}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedEvent && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col border border-slate-100">
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-red-500 hover:text-white transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="overflow-y-auto p-8 md:p-10">
                            {/* Poster Section */}
                            <div className="relative group/poster mb-8">
                                <img
                                    src={selectedEvent.poster}
                                    className="w-full h-auto rounded-3xl shadow-md object-contain max-h-[350px] bg-slate-50"
                                    alt={selectedEvent.name}
                                />
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 mb-8 leading-tight">
                                {selectedEvent.name}
                            </h2>

                            {/* Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
                                {/* Date & Time */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-500 shadow-sm">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Date & Time</p>
                                        <p className="font-bold text-slate-700">{new Date(selectedEvent.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                                        <p className="text-sm font-semibold text-slate-500">{selectedEvent.time || '-'}</p>
                                    </div>
                                </div>

                                {/* Artist */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-500 shadow-sm">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Artist</p>
                                        <p className="font-bold text-slate-700">{selectedEvent.artistName || '-'}</p>
                                    </div>
                                </div>

                                {/* Keyword */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-500 shadow-sm">
                                        <KeyRound className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Keyword</p>
                                        {selectedEvent.key ? (
                                            <a
                                                href={`https://x.com/search?q=%22${encodeURIComponent(selectedEvent.key)}%22&src=typed_query&f=top`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                                            >
                                                {selectedEvent.key}
                                            </a>
                                        ) : <p className="font-bold text-slate-700">-</p>}
                                    </div>
                                </div>

                                {/* Hashtag */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-500 shadow-sm">
                                        <Hash className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Hashtag</p>
                                        {selectedEvent.tag ? (
                                            <a
                                                href={`https://x.com/search?q=${encodeURIComponent(selectedEvent.tag)}&src=typed_query&f=top`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                                            >
                                                {selectedEvent.tag}
                                            </a>
                                        ) : <p className="font-bold text-slate-700">-</p>}
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-500 shadow-sm">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                                        <p className="font-bold text-slate-700 line-clamp-2 leading-snug">{selectedEvent.location || '-'}</p>
                                    </div>
                                </div>

                                {/* Platform */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-500 shadow-sm">
                                        <Video className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Platform</p>
                                        <p className="font-bold text-slate-700">{selectedEvent.live || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedEvent.note && (
                                <div className="mb-8 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Note</p>
                                    <p className="text-slate-600 text-sm font-medium">{selectedEvent.note}</p>
                                </div>
                            )}

                            {/* Footer Actions */}
                            <div className="mt-4 flex gap-4 pt-4 border-t border-rose-50">
                                {selectedEvent.link && (
                                    <a
                                        href={selectedEvent.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="grow flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.15em] hover:bg-indigo-600 hover:text-white transition-all duration-300 border border-indigo-100"
                                    >
                                        <PlayCircle size={16} /> Watch Rerun / Live
                                    </a>
                                )}

                                <a
                                    href={generateGoogleUrl(selectedEvent)} target="_blank" rel="noreferrer"
                                    className="ml-auto flex items-center justify-center gap-2 bg-white text-slate-500 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all border border-slate-200 cursor-pointer"
                                >
                                    <CalendarPlus size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;