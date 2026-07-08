import { useState } from 'react';
import { usePerformance } from '../hooks/usePerformance';
import { useFilter } from '../hooks/useFilter';
import FilterHeader from '../components/FilterHeader';
import { LoadingState } from '../components/LoadingState';
import { NoResults } from '../components/NoResults';
import { getArtistTheme, getTypeTheme } from '../utils/theme';

const Performance = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { perf, loading } = usePerformance();

    const {
        state,
        setters,
        handleReset,
        filteredItems
    } = useFilter(perf || []);

    if (loading) return <LoadingState />;

    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-20">
            <FilterHeader
                title="Performance" subtitle="Live Stages & Official Videos"
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={state.sortOrder} setSortOrder={setters.setSortOrder}
                searchTerm={state.searchTerm} setSearchTerm={setters.setSearchTerm}
                startDate={state.startDate} setStartDate={setters.setStartDate}
                endDate={state.endDate} setEndDate={setters.setEndDate}
                onReset={handleReset}
                filterGroups={[
                    { label: 'Artist', selectedValues: state.filterArtist, options: ['All', 'Teetee', 'Por', 'TeeteePor', 'DEXX'], onSelect: setters.setFilterArtist },
                    { label: 'Type', selectedValues: state.filterType, options: ['All', 'Performance', 'Music Video', 'Cover'], onSelect: setters.setFilterType }
                ]}
            />

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
                                            alt={item.title}
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

                                        <h3 className="text-sm text-content-text-main line-clamp-2 font-bold">
                                            {item.title}
                                        </h3>

                                        {item.note && (
                                            <p className="text-xs text-content-text-sub line-clamp-1">
                                                {item.note}
                                            </p>
                                        )}
                                    </div>
                                </a>
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

export default Performance;