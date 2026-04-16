import { useState, useMemo } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { useFilter } from '../hooks/useFilter';
import FilterHeader from '../components/FilterHeader'
import { LoadingState } from '../components/LoadingState'
import { NoResults } from '../components/NoResults';
import CalendarCard, { type CalendarEvent } from '../components/CalendarCard';

const CalendarAll = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const { schedule, loading, refreshSchedule } = useCalendar();

    const {
        state,
        setters,
        handleReset,
        filteredItems: baseFilteredItems
    } = useFilter(schedule || []);

    // Custom filtering for all events
    const sortedItems = useMemo(() => {
        const filtered = baseFilteredItems.filter(item => {
            if (!item.datetimetz) return false;

            return true;
        });

        return [...filtered].sort((a, b) => {
            const dateA = new Date(a.datetimetz).getTime();
            const dateB = new Date(b.datetimetz).getTime();
            return state.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [baseFilteredItems, state.startDate, state.endDate, state.sortOrder]);

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
                sortOrder={state.sortOrder} setSortOrder={setters.setSortOrder}
                searchTerm={state.searchTerm} setSearchTerm={setters.setSearchTerm}
                startDate={state.startDate} setStartDate={setters.setStartDate}
                endDate={state.endDate} setEndDate={setters.setEndDate}
                onReset={handleReset}
                filterGroups={[
                    { label: 'Artist', currentValue: state.filterArtist, options: ['All', 'Teetee', 'Por', 'TeeteePor', 'DEXX'], onSelect: setters.setFilterArtist },
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

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                                {groupedItems[monthYear].map((event: CalendarEvent) => (
                                    <CalendarCard
                                        key={event.id}
                                        event={event}
                                        onEventUpdate={refreshSchedule}
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