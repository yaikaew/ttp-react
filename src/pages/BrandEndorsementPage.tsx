import { useState } from 'react';
import { useEndorsement } from '../hooks/useEndorsement';
import { useFilter } from '../hooks/useFilter'; // 1. Import hook เข้ามา
import FilterHeader from '../components/FilterHeader'
import { LoadingState } from '../components/LoadingState'
import { NoResults } from '../components/NoResults';
import { getArtistTheme } from '../utils/theme';
import { Award } from 'lucide-react';

const BrandEndorsementPage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const { endorsement, loading } = useEndorsement();

    const {
        state,
        setters,
        handleReset,
        filteredItems
    } = useFilter(endorsement || []);

    if (loading) return <LoadingState />

    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-20">
            <FilterHeader
                title="Endorsements" subtitle="Official Brand Ambassadors & Partnerships"
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
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredItems.map((item) => {
                            const artistData = Array.isArray(item.artist) ? item.artist[0] : item.artist;
                            const artistName = artistData?.name || 'Unknown';
                            const artistTheme = getArtistTheme(artistName);

                            return (
                                <div key={item.id} className="group flex flex-col">
                                    <div className="relative aspect-square rounded-4xl overflow-hidden border border-card-border shadow-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-brand-primary/20 group-hover:-translate-y-1.5">
                                        <img
                                            src={item.img || ''}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-brand-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <div className="mt-5 px-1 flex flex-col flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex flex-col min-w-0">
                                                <h3 className="text-xl font-black text-content-text-main tracking-tight leading-tight mb-1.5 truncate group-hover:text-brand-primary transition-colors duration-200">
                                                    {item.name}
                                                </h3>
                                                <p className="text-[9px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5">
                                                    <span className={`${artistTheme.text}`}>{artistName}</span>
                                                    <span className="text-content-text-muted opacity-40">•</span>
                                                    <span className="text-content-text-muted">{new Date(item.date).getFullYear()}</span>
                                                </p>
                                            </div>
                                            <span className="shrink-0 text-[8px] font-black text-brand-primary uppercase bg-brand-primary-light/50 px-2 py-1 rounded-lg border border-brand-primary/10 tracking-widest">
                                                {item.category}
                                            </span>
                                        </div>
                                        <p className="text-[11px] font-bold text-content-text-sub mt-3 flex items-center gap-1.5">
                                            <div className="p-1 bg-brand-accent-light rounded-md">
                                                <Award size={12} className="text-brand-accent" />
                                            </div>
                                            {item.position}
                                        </p>
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

export default BrandEndorsementPage;