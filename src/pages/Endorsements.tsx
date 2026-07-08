import { useState } from 'react';
import { Calendar, ExternalLink, Sparkles } from 'lucide-react';
import { useEndorsements } from '../hooks/useEndorsements';
import { useFilter } from '../hooks/useFilter';
import FilterHeader from '../components/FilterHeader';
import { LoadingState } from '../components/LoadingState';
import { NoResults } from '../components/NoResults';
import { getArtistTheme } from '../utils/theme';

const Endorsements = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { endorsements, loading } = useEndorsements();

    const {
        state,
        setters,
        handleReset,
        filteredItems,
    } = useFilter(endorsements || []);

    if (loading) return <LoadingState />;

    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-20">
            <FilterHeader
                title="Endorsements"
                subtitle="Brand Collaborations"
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                sortOrder={state.sortOrder}
                setSortOrder={setters.setSortOrder}
                searchTerm={state.searchTerm}
                setSearchTerm={setters.setSearchTerm}
                startDate={state.startDate}
                setStartDate={setters.setStartDate}
                endDate={state.endDate}
                setEndDate={setters.setEndDate}
                onReset={handleReset}
                filterGroups={[
                    {
                        label: 'Artist',
                        selectedValues: state.filterArtist,
                        options: ['All', 'Teetee', 'Por', 'TeeteePor', 'DEXX'],
                        onSelect: setters.setFilterArtist,
                    },
                    {
                        label: 'Category',
                        selectedValues: state.filterType,
                        options: ['All', 'Skincare', 'Cosmetics', 'Fashion', 'Wellness', 'Technology'],
                        onSelect: setters.setFilterType,
                    },
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
                                <div
                                    key={item.id}
                                    className="group flex flex-col overflow-hidden rounded-[2rem] border border-card-border bg-card-bg shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-primary/10"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                                        <img
                                            src={item.img || ''}
                                            alt={item.name}
                                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                        <div className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${artistTheme.bg} ${artistTheme.text} ${artistTheme.border}`}>
                                            {artistName}
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="flex-1 space-y-2.5">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">
                                                <Sparkles size={12} />
                                                {item.category || 'Brand Collaboration'}
                                            </div>

                                            <h3 className="text-[15px] font-black leading-tight text-content-text-main transition-colors group-hover:text-brand-primary">
                                                {item.name}
                                            </h3>

                                            {item.position && (
                                                <p className="text-sm text-content-text-sub">{item.position}</p>
                                            )}

                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-content-text-muted">
                                                <Calendar size={12} className="opacity-70" />
                                                {item.date}
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-center justify-between border-t border-card-border/50 pt-4">
                                            <div className="flex items-center gap-4">
                                                {item.dmd && (
                                                    <a
                                                        href={item.dmd}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="group/link relative text-[10px] font-black uppercase tracking-widest text-content-text-sub transition-colors hover:text-brand-primary"
                                                    >
                                                        Preview
                                                        <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-brand-primary transition-all group-hover/link:w-full" />
                                                    </a>
                                                )}

                                                {item.brand_link && (
                                                    <a
                                                        href={item.brand_link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="group/link relative inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-content-text-sub transition-colors hover:text-brand-primary"
                                                    >
                                                        Brand
                                                        <ExternalLink size={10} />
                                                        <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-brand-primary transition-all group-hover/link:w-full" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
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

export default Endorsements;
