import { useMemo, useState } from 'react';
import { Tv, CirclePlay, SearchX, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import FilterHeader from '../components/FilterHeader';
import { useFilmography, useArtists } from '../hooks/useArtistData';

const FilmographyPage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterArtist, setFilterArtist] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { data, isLoading } = useFilmography(sortOrder);

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
                title="Filmography" subtitle="Acting History"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                        {filteredItems.map(item => {
                            return (
                                <div
                                    key={item.id}
                                    className="group flex flex-col bg-white rounded-2xl p-3 border border-blue-50 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/30"
                                >
                                    {/* Image Section */}
                                    <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-slate-50 mb-4">
                                        <img
                                            src={item.poster}
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

                                    {/* Content Section */}
                                    <div className="px-1 flex flex-col grow">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[9px] font-bold text-blue-300 uppercase tracking-widest">
                                                {new Date(item.date).getFullYear()}
                                            </span>
                                            <div className="flex items-center gap-1 text-slate-300">
                                                <Tv size={10} />
                                                <span className="text-[8px] font-medium uppercase tracking-tighter">{item.note || 'series'}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-base font-bold text-slate-900 leading-snug mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-10">
                                            {item.title}
                                        </h3>

                                        {/* Roles Info */}
                                        <div className="flex items-start gap-3 mb-5 pb-4 border-b border-blue-50/50">
                                            <div className="flex-1 min-w-0 border-l-2 border-purple-100 pl-2">
                                                <span className="text-xs font-bold text-purple-400 uppercase block mb-0.5">Teetee</span>
                                                <p className="text-sm text-slate-500 truncate">{item.role_teetee}</p>
                                            </div>
                                            <div className="flex-1 min-w-0 border-l-2 border-sky-100 pl-2">
                                                <span className="text-xs font-bold text-sky-400 uppercase block mb-0.5">Por</span>
                                                <p className="text-sm text-slate-500 truncate">{item.role_por}</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-auto grid grid-cols-2 gap-2">
                                            <Link
                                                to={`/filmography/${item.id}`}
                                                className="flex items-center justify-center gap-1.5 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
                                            >
                                                <Layout size={14} /> Detail
                                            </Link>
                                            <a
                                                href={item.rerun_link1}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-blue-100 text-blue-400 hover:bg-blue-50 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
                                            >
                                                <CirclePlay size={14} /> Watch
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

export default FilmographyPage;