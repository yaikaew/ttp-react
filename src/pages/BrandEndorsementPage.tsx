import { useState } from 'react';
import { useEndorsements } from '../hooks/useArtistData';
import { SearchX, Award } from 'lucide-react';
import FilterHeader from '../components/FilterHeader';
import { getArtistTheme } from '../utils/theme';


const BrandEndorsementPage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterArtist, setFilterArtist] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { data, isLoading } = useEndorsements(sortOrder);

    const handleReset = () => {
        setFilterArtist('All');
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
        setSortOrder('desc');
    };

    const filteredItems = data?.filter(item => {
        const itemDate = new Date(item.date).getTime();
        const start = startDate ? new Date(startDate).getTime() : -Infinity;
        const end = endDate ? new Date(endDate).getTime() : Infinity;

        const matchArtist = filterArtist === 'All' || item.artistName === filterArtist;
        const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDate = itemDate >= start && itemDate <= end;

        return matchArtist && matchSearch && matchDate;
    }) || [];

    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-2 border-indigo-100 border-t-indigo-400 rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Loading Archives</p>
        </div>
    );

    return (
        <div className="min-h-screen pb-20">
            <FilterHeader
                title="Endorsements" subtitle="Official Brand Ambassadors & Partnerships"
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

            <div className="max-w-7xl mx-auto px-4">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.map(item => {
                            const artistTheme = getArtistTheme(item.artistName);

                            return (
                                <div key={item.id} className="group flex flex-col">
                                    <div className="relative aspect-square rounded-4xl overflow-hidden border border-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-indigo-100 group-hover:-translate-y-1">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent" />
                                    </div>
                                    <div className="mt-6 px-2 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex flex-col">
                                                <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-2">
                                                    {item.name}
                                                </h3>
                                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                                                    <span className={`${artistTheme.text}`}>{item.artistName}</span> • {new Date(item.date).getFullYear()}
                                                </p>
                                            </div>
                                            <span className="text-[9px] font-black text-slate-300 uppercase bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                {item.category}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                                            <Award size={14} className="text-slate-300" /> {item.position}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* No Results State */
                    <div className="flex flex-col items-center justify-center py-40 bg-white/40 backdrop-blur-[2px] rounded-[4rem] border border-dashed border-slate-200 animate-in zoom-in-95 duration-500">
                        <div className="bg-indigo-50/50 p-8 rounded-full mb-6 ring-8 ring-indigo-50/30">
                            <SearchX className="w-12 h-12 text-indigo-200" />
                        </div>
                        <h3 className="text-slate-800 font-black text-xl tracking-tight">No Results Found</h3>
                        <p className="text-slate-400 text-xs font-medium italic mt-2 max-w-[240px] text-center leading-relaxed">
                            We couldn't find anything matching your filters. Try adjusting your search or resetting.
                        </p>
                        <button onClick={handleReset} className="mt-8 px-8 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 shadow-sm hover:shadow-indigo-100">
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandEndorsementPage;