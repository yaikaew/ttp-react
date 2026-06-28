import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFilmography } from '../hooks/useFilmography';
import { useFilter } from '../hooks/useFilter';
import FilterHeader from '../components/FilterHeader';
import { LoadingState } from '../components/LoadingState';
import { NoResults } from '../components/NoResults';

const Filmography = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { filmography, loading } = useFilmography();

    const {
        state,
        setters,
        handleReset,
        filteredItems
    } = useFilter(filmography || []);

    if (loading) return <LoadingState />;

    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-20">
            <FilterHeader
                title="Filmography" subtitle="Acting History"
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={state.sortOrder} setSortOrder={setters.setSortOrder}
                searchTerm={state.searchTerm} setSearchTerm={setters.setSearchTerm}
                startDate={state.startDate} setStartDate={setters.setStartDate}
                endDate={state.endDate} setEndDate={setters.setEndDate}
                onReset={handleReset}
                filterGroups={[
                    { label: 'Artist', selectedValues: state.filterArtist, options: ['All', 'Teetee', 'Por', 'TeeteePor', 'DEXX'], onSelect: setters.setFilterArtist },
                    { label: 'Status', selectedValues: state.filterType, options: ['All', 'Main Role', 'Guest Role', 'Support Role'], onSelect: setters.setFilterType }
                ]}
            />

            <div className="px-4">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredItems.map((item) => {
                            return (
                                <div key={item.id} className="group flex flex-col bg-card-bg rounded-2xl p-3 border border-card-border shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-brand-primary/10">
                                    <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-card-bg mb-4">
                                        <img
                                            src={item.poster || ''}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-2.5 py-1 rounded-full text-[7px] font-black uppercase tracking-widest shadow-sm border ${item.status === 'Main Role'
                                                ? 'bg-amber-400 text-white border-amber-300'
                                                : 'bg-white text-slate-400 border-slate-100'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="px-1 flex flex-col grow">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[9px] font-bold text-content-text-muted uppercase tracking-widest">
                                                {new Date(item.date).getFullYear()}
                                            </span>
                                        </div>

                                        <h3 className="text-base font-bold text-content-text-main leading-snug mb-4 group-hover:text-brand-primary transition-colors line-clamp-2 min-h-10">
                                            {item.title}
                                        </h3>

                                        <div className="flex items-start gap-3 mb-5 pb-4 border-b border-blue-50/50">
                                            <div className="flex-1 min-w-0 border-l-2 border-purple-100 pl-2">
                                                <span className="text-xs font-bold text-purple-400 uppercase block mb-0.5">Teetee</span>
                                                <p className="text-sm text-content-text-sub truncate">{item.role_teetee}</p>
                                            </div>
                                            <div className="flex-1 min-w-0 border-l-2 border-sky-100 pl-2">
                                                <span className="text-xs font-bold text-sky-400 uppercase block mb-0.5">Por</span>
                                                <p className="text-sm text-content-text-sub truncate">{item.role_por}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto grid grid-cols-2 gap-2">
                                        <Link
                                            to={`/filmography/${item.id}`}
                                            className="inline-flex items-center justify-center gap-2
                                                        rounded-xl font-bold
                                                        transition-all duration-300
                                                        active:scale-95 disabled:opacity-50 disabled:pointer-events-none
                                                        py-2 px-4 text-[10px] uppercase tracking-widest
                                                        bg-brand-primary-light/80 backdrop-blur-sm border border-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white hover:shadow-lg hover:shadow-brand-primary/20"
                                        >
                                            Detail
                                        </Link>
                                        <a
                                            href={item.rerun_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2
                                                        rounded-xl font-bold
                                                        transition-all duration-300
                                                        active:scale-95 disabled:opacity-50 disabled:pointer-events-none
                                                        py-2 px-4 text-[10px] uppercase tracking-widest
                                                        bg-brand-primary text-white border border-brand-primary/10 hover:bg-brand-primary-light/80 backdrop-blur-sm hover:text-brand-primary"
                                        >
                                            Watch
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

export default Filmography;