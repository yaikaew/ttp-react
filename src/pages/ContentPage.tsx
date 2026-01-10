import { useState, useMemo } from 'react';
import { useContents, useArtists } from '../hooks/useArtistData';
import FilterHeader from '../components/FilterHeader';
import { getArtistTheme } from '../utils/theme';
import { SearchX, Calendar, Play } from 'lucide-react';

const ContentPage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterArtist, setFilterArtist] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { data, isLoading } = useContents(sortOrder);

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
        const matchType = filterType === 'All' || item.type === filterType;
        const matchArtist = filterArtist === 'All' || item.artistName === filterArtist;
        const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
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
                title="Content" subtitle="Media Appearances"
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                onReset={handleReset}
                filterGroups={[
                    { label: 'Artist', currentValue: filterArtist, options: artistOptions, onSelect: setFilterArtist },
                    { label: 'Type', currentValue: filterType, options: ['All', 'Online Shows', 'Special', 'BTS', 'Press Tour', 'Press Cons', 'Reaction', 'Live', 'Live Event', 'Interview'], onSelect: setFilterType }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map(item => {
                            const artistTheme = getArtistTheme(item.artistName);

                            return (
                                <a
                                    key={item.id}
                                    href={item.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 flex flex-col"
                                >
                                    {/* Thumbnail Area */}
                                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {/* Type Badge - Floating */}
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-700 text-[8px] font-black px-2.5 py-1.5 rounded-xl uppercase tracking-widest border border-white shadow-sm">
                                            {item.type}
                                        </div>
                                        {/* Play Icon Overlay on Hover */}
                                        <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white p-3 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                <Play size={20} className="text-indigo-600 fill-indigo-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="p-5 flex flex-col grow">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                                <Calendar className="w-3 h-3 text-indigo-400" /> {item.date}
                                            </div>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                            <div className={`${artistTheme.bg} ${artistTheme.text} text-[9px] font-black px-2.5 py-0.5 rounded-lg border ${artistTheme.border} uppercase tracking-wider`}>
                                                {item.artistName}
                                            </div>
                                        </div>

                                        <h3 className="text-sm font-black text-slate-700 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors min-h-[40px]">
                                            {item.name}
                                        </h3>
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

export default ContentPage;