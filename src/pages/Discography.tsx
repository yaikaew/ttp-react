import { useState } from 'react';
import { useDiscography } from '../hooks/useDiscography';
import { useFilter } from '../hooks/useFilter';
import FilterHeader from '../components/FilterHeader';
import { LoadingState } from '../components/LoadingState';
import { NoResults } from '../components/NoResults';
import { getArtistTheme } from '../utils/theme';
import { Calendar } from 'lucide-react';

const Discography = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { discography, loading } = useDiscography();

    const {
        state,
        setters,
        handleReset,
        filteredItems
    } = useFilter(discography || []);

    if (loading) return <LoadingState />;

    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-20">
            <FilterHeader
                title="Discography" subtitle="Music & Releases"
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={state.sortOrder} setSortOrder={setters.setSortOrder}
                searchTerm={state.searchTerm} setSearchTerm={setters.setSearchTerm}
                startDate={state.startDate} setStartDate={setters.setStartDate}
                endDate={state.endDate} setEndDate={setters.setEndDate}
                onReset={handleReset}
                filterGroups={[
                    { label: 'Artist', selectedValues: state.filterArtist, options: ['All', 'Teetee', 'Por', 'TeeteePor', 'DEXX'], onSelect: setters.setFilterArtist },
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
                                <div key={item.id} className="group relative flex flex-col overflow-hidden rounded-3xl border border-card-border bg-card-bg shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-primary/10">

                                    {/* Album Cover Section */}
                                    <div className="relative aspect-square overflow-hidden">
                                        <img
                                            src={item.img || ""}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />

                                        {/* Overlay ไล่เฉดสีดำเมื่อ Hover */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                        {/* Artist Tag (Glassmorphism) */}
                                        <div className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md bg-opacity-80 rounded-full border ${artistTheme.bg} ${artistTheme.text} ${artistTheme.border}`}>
                                            {artistName}
                                        </div>
                                    </div>

                                    {/* Song Info Content */}
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-[15px] font-black leading-tight text-content-text-main transition-colors group-hover:text-brand-primary">
                                                {item.title}
                                            </h3>

                                            {item.note && (
                                                <p className="text-xs text-content-text-sub">
                                                    {item.note}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-content-text-muted">
                                                <Calendar size={12} className="opacity-70" />
                                                {item.date}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-5 flex items-center justify-between border-t border-card-border/50 pt-4">
                                            <div className="flex items-center gap-5">
                                                {/* MV Link */}
                                                {item.mv && (
                                                    <a href={item.mv} target="_blank" rel="noreferrer" className="group/link relative text-[10px] font-black uppercase tracking-widest text-content-text-sub transition-colors hover:text-brand-primary">
                                                        MV
                                                        <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-brand-primary transition-all group-hover/link:w-full" />
                                                    </a>
                                                )}

                                                {/* Streaming Link */}
                                                {item.streaming && (
                                                    <a href={item.streaming} target="_blank" rel="noreferrer" className="group/link relative text-[10px] font-black uppercase tracking-widest text-content-text-sub transition-colors hover:text-brand-primary">
                                                        Streaming
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

export default Discography;