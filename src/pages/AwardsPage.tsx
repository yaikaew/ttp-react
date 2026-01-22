import { useState } from 'react';
import { useAward } from '../hooks/useAward';
import { useFilter } from '../hooks/useFilter'; // 1. Import hook เข้ามา
import FilterHeader from '../components/FilterHeader'
import { LoadingState } from '../components/LoadingState'
import { NoResults } from '../components/NoResults';
import { getArtistTheme } from '../utils/theme';
import { ExternalLink, Trophy, Star } from 'lucide-react';

const AwardsPage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const { award, loading } = useAward();

    const {
        state,
        setters,
        handleReset,
        filteredItems
    } = useFilter(award || []);

    const getResultBadge = (result: string) => {
        const res = result.toLowerCase();
        const isWon = res === 'won' || res === 'winner' || res === 'received';

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border shadow-sm ${isWon
                ? 'bg-brand-primary text-white border-brand-primary shadow-brand-primary/20'
                : 'bg-card-bg text-content-text-muted border-card-border'
                }`}>
                {isWon ? <Trophy size={10} /> : <Star size={10} />}
                {result}
            </span>
        );
    };

    if (loading) return <LoadingState />

    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-20">
            <FilterHeader
                title="Awards" subtitle="Achievements"
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={state.sortOrder} setSortOrder={setters.setSortOrder}
                searchTerm={state.searchTerm} setSearchTerm={setters.setSearchTerm}
                startDate={state.startDate} setStartDate={setters.setStartDate}
                endDate={state.endDate} setEndDate={setters.setEndDate}
                onReset={handleReset}
                filterGroups={[
                    { label: 'Artist', currentValue: state.filterArtist, options: ['All', 'Teetee', 'Por', 'TeeteePor', 'DEXX'], onSelect: setters.setFilterArtist },
                    { label: 'Result', currentValue: state.filterType, options: ['All', 'Received', 'Nominated'], onSelect: setters.setFilterType }
                ]}
            />

            <div className="px-4">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => {
                            const artistData = Array.isArray(item.artist) ? item.artist[0] : item.artist;
                            const artistName = artistData?.name || 'Unknown';
                            const artistTheme = getArtistTheme(artistName);

                            return (
                                <div key={item.id} className={`group bg-card-bg rounded-4xl border transition-all duration-200 flex flex-col hover:-translate-y-1.5 border-brand-primary/30 shadow-lg shadow-brand-primary/5`}>
                                    {item.img && (
                                        <div className="aspect-video overflow-hidden relative rounded-t-4xl">
                                            <img
                                                src={item.img}
                                                alt={item.award}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            <span className={`${artistTheme.bg} ${artistTheme.text} px-2 py-0.5 rounded-lg border ${artistTheme.border} text-[8px] font-black uppercase tracking-widest`}>
                                                {artistName}
                                            </span>
                                            {getResultBadge(item.result)}
                                        </div>

                                        <h3 className="text-base font-black text-content-text-main leading-snug line-clamp-2 mb-2 group-hover:text-brand-primary transition-colors">
                                            {item.award}
                                        </h3>

                                        {item.category && (
                                            <p className="text-sm text-content-text-sub flex items-center gap-1.5 mb-3">
                                                Category: {item.category}
                                            </p>
                                        )}
                                        <div className="pt-4 mt-4 border-t border-card-border flex items-center justify-between">
                                            <span className="text-sm text-content-text-muted">
                                                {new Date(item.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {item.link && (
                                                    <a href={item.link} target="_blank" rel="noreferrer" className="p-2 bg-brand-primary-light text-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-all duration-200">
                                                        <ExternalLink size={12} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <NoResults onReset={handleReset} />
                )}
            </div>
        </div>
    );
};

export default AwardsPage;