import { useState, useMemo } from 'react';
import { usePerformance, useArtists } from '../hooks/useArtistData';
import FilterHeader from '../components/FilterHeader';
import { getArtistTheme, getTypeTheme } from '../utils/theme';
import { SearchX } from 'lucide-react';

const PerformancePage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterArtist, setFilterArtist] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { data, isLoading } = usePerformance(sortOrder);

    const { data: artists = [] } = useArtists();
    const artistOptions = useMemo(() => {
        return ['All', ...artists.map(a => a.name)];
    }, [artists]);

    const handleReset = () => {
        setFilterArtist('All');
        setFilterType('All');
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
        const matchType = filterType === 'All' || item.type === filterType;
        const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDate = itemDate >= start && itemDate <= end;

        return matchArtist && matchType && matchSearch && matchDate;
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
                title="Performance" subtitle="Live Stages & Official Videos"
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                onReset={handleReset}
                filterGroups={[
                    { label: 'Artist', currentValue: filterArtist, options: artistOptions, onSelect: setFilterArtist },
                    { label: 'Type', currentValue: filterType, options: ['All', 'Performance', 'Cover'], onSelect: setFilterType }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredItems.map((item) => {
                            const artistTheme = getArtistTheme(item.artistName);
                            const typeTheme = getTypeTheme(item.type);

                            return (
                                <a
                                    key={item.id}
                                    href={item.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 flex flex-col"
                                >
                                    <div className="aspect-video bg-slate-100 overflow-hidden">
                                        <img
                                            src={item.img || 'https://via.placeholder.com/300'}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition"
                                        />
                                    </div>

                                    <div className="p-4 space-y-2">
                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2 text-[10px]">
                                            <span className={`${artistTheme.bg} ${artistTheme.text} px-2 py-0.5 rounded border ${artistTheme.border} uppercase`}>
                                                {item.artistName}
                                            </span>
                                            <span className={`${typeTheme.bg} ${typeTheme.text} px-2 py-0.5 rounded border ${typeTheme.border} uppercase`}>
                                                {item.type}
                                            </span>
                                            <span className="text-slate-400 ml-auto">
                                                {new Date(item.date).getFullYear()}
                                            </span>
                                        </div>

                                        <h3 className="text-sm font-semibold text-slate-700 line-clamp-2">
                                            {item.title}
                                        </h3>

                                        {item.note && (
                                            <p className="text-xs text-slate-400 line-clamp-1">
                                                {item.note}
                                            </p>
                                        )}
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                ) : (
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

export default PerformancePage;