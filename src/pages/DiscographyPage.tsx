import { useMemo, useState } from 'react';
import { Music2, Calendar, SearchX } from 'lucide-react';
import FilterHeader from '../components/FilterHeader';
import { useDiscography, useArtists } from '../hooks/useArtistData';
import { getArtistTheme } from '../utils/theme';


const DiscographyPage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterArtist, setFilterArtist] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { data, isLoading } = useDiscography(sortOrder);

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
        const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
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
                title="Discography" subtitle="Music & Original Soundtracks"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredItems.map((item) => {
                            const artistTheme = getArtistTheme(item.artistName);
                            return (
                                <div key={item.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 flex flex-col">

                                    {/* Album Cover */}
                                    <div className="aspect-square bg-slate-100 overflow-hidden relative">
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className={`absolute top-2 left-2 ${artistTheme.bg} ${artistTheme.text} px-2 py-0.5 rounded-lg border ${artistTheme.border} text-[9px] font-black uppercase tracking-wider backdrop-blur-sm bg-opacity-90`}>
                                            {item.artistName}
                                        </div>
                                    </div>

                                    {/* Song Info */}
                                    <div className="p-4 flex flex-col flex-1 justify-between">
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-black text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight h-10">
                                                {item.title}
                                            </h3>

                                            {/* Meta Info */}
                                            <div className="flex items-center justify-between pt-1">
                                                <div className="flex items-center gap-1 text-[10px] text-slate-300 font-bold">
                                                    <Calendar size={10} />
                                                    {new Date(item.date).getFullYear()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Action - Links */}
                                        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-indigo-400 group-hover:text-indigo-600 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <a href={item.mv} target="_blank" rel="noreferrer" className="text-[9px] font-black uppercase tracking-widest hover:text-emerald-500 transition-colors">
                                                    MV
                                                </a>
                                                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                                <a href={item.streaming} target="_blank" rel="noreferrer" className="text-[9px] font-black uppercase tracking-widest hover:text-rose-500 transition-colors">
                                                    Streaming
                                                </a>
                                            </div>
                                            <Music2 size={12} className="opacity-70" />
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

export default DiscographyPage;