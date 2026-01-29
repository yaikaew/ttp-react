import { useState } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import FilterHeader from '../components/FilterHeader'
import { LoadingState } from '../components/LoadingState'
import { NoResults } from '../components/NoResults';
import CalendarCard from '../components/CalendarCard';
import CalendarModal, { type CalendarEvent } from '../components/CalendarModal'; // Import Type มาใช้

const Calendar = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filterArtist, setFilterArtist] = useState('All')
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('asc')
    const [searchTerm, setSearchTerm] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const { schedule, loading } = useCalendar();

    // ใช้ Type ที่ Import มาจาก Modal เพื่อความแม่นยำ
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    const handleReset = () => {
        setFilterArtist('All'); setSearchTerm(''); setStartDate(''); setEndDate(''); setSortOrder('asc');
    }

    // --- LOGIC 1: FILTERING ---
    const filteredItems = (schedule || []).filter(item => {
        // ใช้ datetimetz เป็นหลัก
        if (!item.datetimetz) return false; // ถ้าไม่มี datetimetz ให้ข้าม

        const itemDateObj = new Date(item.datetimetz);
        // สร้าง date object สำหรับวันนี้เวลา 00:00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nowTime = today.getTime();

        // เปรียบเทียบเฉพาะวันที่ (ไม่รวมเวลา) สำหรับ upcoming check
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

    const sortedItems = [...filteredItems].sort((a, b) => {
        // ใช้ datetimetz เป็นหลัก
        const dateA = new Date(a.datetimetz).getTime();
        const dateB = new Date(b.datetimetz).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // --- LOGIC 2: GROUPING BY MONTH ---
    const groupedItems: { [key: string]: typeof sortedItems } = {};
    sortedItems.forEach(item => {
        const date = new Date(item.datetimetz);
        const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        if (!groupedItems[monthYear]) groupedItems[monthYear] = [];
        groupedItems[monthYear].push(item);
    });

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
                    { label: 'Artist', currentValue: filterArtist, options: ['All', 'Teetee', 'Por', 'TeeteePor', 'DEXX'], onSelect: setFilterArtist },
                ]}
            />

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

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {groupedItems[monthYear].map((event) => (
                                    <CalendarCard
                                        key={event.id}
                                        event={event}
                                        onClick={(ev) => setSelectedEvent(ev)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <NoResults onReset={handleReset} />
                )}
            </div>

            {/* Modal */}
            <CalendarModal
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        </div>
    );
};

export default Calendar;