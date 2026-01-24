import { useState } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { useFilter } from '../hooks/useFilter';
import FilterHeader from '../components/FilterHeader';
import { NoResults } from '../components/NoResults';
import { LoadingState } from '../components/LoadingState';

const OutfitsPage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const { schedule, loading } = useCalendar();
    const {
        state,
        setters,
        handleReset,
        filteredItems
    } = useFilter(schedule || []);

    if (loading) return <LoadingState />;

    return (
        <div className="min-h-screen pb-20">
            <FilterHeader
                title="Outfits Archive" subtitle="Fashion & Styles Collection"
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

            <div className="max-w-7xl mx-auto px-4">
                {filteredItems.filter(item => item.outfit_img).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.filter(item => item.outfit_img).map(item => {
                            return (
                                <div key={item.id} className="group flex flex-col bg-card-bg rounded-3xl overflow-hidden border border-card-border hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-300">
                                    <div className="relative aspect-square overflow-hidden bg-brand-primary-light/20">
                                        <img
                                            src={item.outfit_img}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    <div className="p-3 flex flex-col items-center text-center space-y-0.5">
                                        <div className="text-[9px] font-black text-content-text-muted uppercase tracking-[0.2em]">
                                            {item.date.replace(/-/g, '')}
                                        </div>
                                        <a
                                            href={`https://x.com/search?q=${encodeURIComponent(item.tag)}&src=typed_query&f=top`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[12px] font-bold text-brand-primary hover:text-brand-primary-hover transition-colors duration-200 truncate max-w-full px-2"
                                        >
                                            {item.hashtag || item.keyword }
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <NoResults onReset={handleReset} />
                )}
            </div>
        </div>
    );
};

export default OutfitsPage;