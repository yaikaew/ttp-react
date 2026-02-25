import { useState, useMemo } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import FilterHeader from '../components/FilterHeader'
import { LoadingState } from '../components/LoadingState'
import { NoResults } from '../components/NoResults';

const CalendarTable = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filterArtist, setFilterArtist] = useState('All')
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('asc')
    const [searchTerm, setSearchTerm] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const { schedule, loading } = useCalendar();

    const handleReset = () => {
        setFilterArtist('All');
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
        setSortOrder('asc');
    }

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

            const start = startDate ? new Date(startDate).getTime() : -Infinity;
            const end = endDate ? new Date(endDate + 'T23:59:59').getTime() : Infinity;

            const artistName = Array.isArray(item.artist) ? item.artist[0]?.name : item.artist?.name;
            const matchArtist = filterArtist === 'All' || artistName === filterArtist;
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
                title="Calendar" subtitle="Artist Schedule (Table View)"
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                onReset={handleReset}
                filterGroups={[
                    { label: 'Artist', currentValue: filterArtist, options: ['All', 'Teetee', 'Por', 'TeeteePor', 'DEXX'], onSelect: setFilterArtist },
                ]}
            />

            <div className="px-4">
                {Object.keys(groupedItems).length > 0 ? (
                    Object.keys(groupedItems).map((monthYear) => (
                        <div key={monthYear} className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-brand-primary">
                                    {monthYear}
                                </h2>
                                <div className="h-px grow bg-linear-to-r from-brand-primary to-transparent" />
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-brand-sidebar-border shadow-sm">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-brand-primary/5 border-b border-brand-sidebar-border">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-brand-primary uppercase tracking-wide">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-brand-primary uppercase tracking-wide">
                                                Event Name
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-brand-primary uppercase tracking-wide">
                                                Hashtag
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedItems[monthYear].map((event, index) => (
                                            <tr 
                                                key={event.id}
                                                className={`border-b border-brand-sidebar-border transition-colors hover:bg-brand-primary/5 ${
                                                    index % 2 === 0 ? 'bg-card-bg' : 'bg-card-bg/50'
                                                }`}
                                            >
                                                <td className="px-6 py-4 text-sm text-content-text-main font-medium whitespace-nowrap">
                                                    {new Date(event.datetimetz).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-content-text-main">
                                                    {event.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {event.hashtag ? (
                                                        <span className="inline-block bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full font-medium">
                                                            <a href={`https://x.com/search?q=${encodeURIComponent(event.hashtag)}&src=typed_query&f=top`} target="_blank" rel="noopener noreferrer">{event.hashtag}</a>
                                                        </span>
                                                    ) : (
                                                        <span className="text-content-text-secondary italic">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

export default CalendarTable;
