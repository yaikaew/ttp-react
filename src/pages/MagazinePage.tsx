import { useState, useMemo } from 'react';
import { useMagazines, useArtists } from '../hooks/useArtistData';
import FilterHeader from '../components/FilterHeader';
import { getArtistTheme } from '../utils/theme';
import { ExternalLink, Calendar, SearchX } from 'lucide-react';

const MagazinePage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterArtist, setFilterArtist] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { data, isLoading } = useMagazines(sortOrder);

    const { data: artists = [] } = useArtists();
    const artistOptions = useMemo(() => {
        return ['All', ...artists.map(a => a.name)];
    }, [artists]);

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
                title="Magazines" subtitle="Editorial Features"
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                onReset={handleReset}
                filterGroups={[
                    { label: 'Artist', currentValue: filterArtist, options: artistOptions, onSelect: setFilterArtist },
                ]}
            />

            <div className="max-w-7xl mx-auto px-4">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map((item) => {
                            const artistTheme = getArtistTheme(item.artistName);

                            return (
                                <div key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 flex flex-col">

                                    {/* Image Container (Portrait 3:4) */}
                                    <div className="relative aspect-3/4 overflow-hidden bg-slate-100">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Artist Badge */}
                                        <div className={`absolute top-4 left-4 ${artistTheme.bg} ${artistTheme.text} px-3 py-1 rounded-xl text-[9px] font-black uppercase border ${artistTheme.border} tracking-widest`}>
                                            {item.artistName}
                                        </div>
                                    </div>

                                    {/* Content Details */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                                                {item.issue || '-'}
                                            </span>
                                            <div className="flex items-center gap-1 text-slate-300 text-[10px] font-bold">
                                                <Calendar size={12} />
                                                {new Date(item.date).getFullYear()}
                                            </div>
                                        </div>

                                        <h3 className="text-base font-black text-slate-800 leading-snug mb-6 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                            {item.name}
                                        </h3>

                                        {/* Double Action Buttons (Soft Style) */}
                                        <div className="mt-auto">
                                            <a
                                                href={item.promo_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-center gap-2 py-3 bg-slate-50 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100"
                                            >
                                                <ExternalLink size={14} /> Info
                                            </a>
                                        </div>
                                    </div>
                                </div>
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

export default MagazinePage;