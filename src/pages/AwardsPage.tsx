import { useState, useMemo } from 'react';
import { useAwards, useArtists } from '../hooks/useArtistData';
import FilterHeader from '../components/FilterHeader';
import { getArtistTheme } from '../utils/theme';
import { SearchX, Trophy, Star, ExternalLink } from 'lucide-react';

const AwardsPage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterArtist, setFilterArtist] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterResult, setFilterResult] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { data, isLoading } = useAwards(sortOrder);

    const { data: artists = [] } = useArtists();
    const artistOptions = useMemo(() => {
        return ['All', ...artists.map(a => a.name)];
    }, [artists]);

    // Get unique results from data
    const resultOptions = useMemo(() => {
        if (!data) return ['All'];
        const results = [...new Set(data.map(item => item.result).filter(Boolean))];
        return ['All', ...results.sort()];
    }, [data]);

    const handleReset = () => {
        setFilterArtist('All');
        setFilterCategory('All');
        setFilterResult('All');
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
        setSortOrder('desc');
    };

    const filteredItems = useMemo(() => {
        return data?.filter(item => {
            const itemDate = new Date(item.date).getTime();
            const start = startDate ? new Date(startDate).getTime() : -Infinity;
            const end = endDate ? new Date(endDate).getTime() : Infinity;
            const matchArtist = filterArtist === 'All' || item.artistName === filterArtist;
            const matchCategory = filterCategory === 'All' || item.category === filterCategory;
            const matchResult = filterResult === 'All' || item.result === filterResult;
            const matchSearch = item.award.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.note.toLowerCase().includes(searchTerm.toLowerCase());
            const matchDate = itemDate >= start && itemDate <= end;

            return matchArtist && matchCategory && matchResult && matchSearch && matchDate;
        }) || [];
    }, [data, filterArtist, filterCategory, filterResult, searchTerm, startDate, endDate]);

    // Group awards by year
    const groupedByYear = useMemo(() => {
        const groups: Record<string, typeof filteredItems> = {};
        filteredItems.forEach(item => {
            const year = new Date(item.date).getFullYear().toString();
            if (!groups[year]) groups[year] = [];
            groups[year].push(item);
        });
        return Object.entries(groups).sort((a, b) =>
            sortOrder === 'desc' ? Number(b[0]) - Number(a[0]) : Number(a[0]) - Number(b[0])
        );
    }, [filteredItems, sortOrder]);

    const getResultBadge = (result: string) => {
        const resultLower = result.toLowerCase();
        const isWon = resultLower === 'won' || resultLower === 'winner';
        const isReceived = resultLower === 'received';
        const isNominated = resultLower === 'nominated';

        if (isWon) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-linear-to-r from-amber-400 to-yellow-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-amber-200/50">
                    <Trophy className="w-3 h-3" />
                    {result}
                </span>
            );
        }
        if (isReceived) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-linear-to-r from-emerald-400 to-green-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-200/50">
                    <Trophy className="w-3 h-3" />
                    {result}
                </span>
            );
        }
        if (isNominated) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-linear-to-r from-sky-400 to-blue-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-sky-200/50">
                    <Star className="w-3 h-3" />
                    {result}
                </span>
            );
        }
        // Default fallback
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-linear-to-r from-slate-100 to-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                <Star className="w-3 h-3" />
                {result}
            </span>
        );
    };

    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-2 border-indigo-100 border-t-indigo-400 rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Loading Archives</p>
        </div>
    );

    return (
        <div className="min-h-screen pb-20">
            <FilterHeader
                title="Awards" subtitle="Achievements & Recognitions"
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                onReset={handleReset}
                filterGroups={[
                    { label: 'Artist', currentValue: filterArtist, options: artistOptions, onSelect: setFilterArtist },
                    { label: 'Result', currentValue: filterResult, options: resultOptions, onSelect: setFilterResult }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4">
                {filteredItems.length > 0 ? (
                    <div className="space-y-10">
                        {groupedByYear.map(([year, items]) => (
                            <div key={year} className="relative">
                                {/* Year Header */}
                                <div className="sticky top-20 lg:top-0 z-10 mb-6">
                                    <div className="inline-flex items-center gap-3 bg-linear-to-r from-amber-500 via-yellow-500 to-amber-500 text-white px-6 py-2.5 rounded-full shadow-lg shadow-amber-200/50">
                                        <Trophy className="w-5 h-5" />
                                        <span className="text-lg font-black tracking-wide">{year}</span>
                                        <span className="text-xs font-medium opacity-80">({items.length} awards)</span>
                                    </div>
                                </div>

                                {/* Awards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {items.map((item) => {
                                        const artistTheme = getArtistTheme(item.artistName);
                                        const isWon = item.result.toLowerCase() === 'won' || item.result.toLowerCase() === 'winner';

                                        return (
                                            <div
                                                key={item.id}
                                                className={`group relative bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col ${isWon
                                                    ? 'border-amber-200 hover:shadow-amber-100/50 ring-1 ring-amber-100'
                                                    : 'border-slate-100 hover:shadow-indigo-100/30'
                                                    }`}
                                            >
                                                {/* Image Section */}
                                                {item.img && (
                                                    <div className="aspect-video bg-slate-100 overflow-hidden relative">
                                                        <img
                                                            src={item.img}
                                                            alt={item.award}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                        />
                                                        {isWon && (
                                                            <div className="absolute top-3 right-3">
                                                                <div className="p-2 rounded-full bg-linear-to-br from-amber-400 to-yellow-500 shadow-lg animate-pulse">
                                                                    <Trophy className="w-4 h-4 text-white" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Content Section */}
                                                <div className="p-5 space-y-3 flex-1 flex flex-col">
                                                    {/* Top Badges */}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className={`${artistTheme.bg} ${artistTheme.text} px-2 py-0.5 rounded border ${artistTheme.border} text-[10px] uppercase font-semibold`}>
                                                            {item.artistName}
                                                        </span>
                                                        {getResultBadge(item.result)}
                                                    </div>

                                                    {/* Award Name */}
                                                    <h3 className="text-base font-bold text-slate-800 leading-snug">
                                                        {item.award}
                                                    </h3>

                                                    {/* Category */}
                                                    {item.category && (
                                                        <p className="text-sm text-slate-500">
                                                            <span className="font-medium text-slate-400">Category:</span> {item.category}
                                                        </p>
                                                    )}

                                                    {/* Note */}
                                                    {item.note && (
                                                        <p className="text-xs text-slate-400 italic line-clamp-2 flex-1">
                                                            {item.note}
                                                        </p>
                                                    )}

                                                    {/* Date and Links */}
                                                    <div className="pt-3 mt-auto border-t border-slate-100 flex items-center justify-between">
                                                        <span className="text-xs text-slate-400">
                                                            {new Date(item.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            {item.link && (
                                                                <a
                                                                    href={item.link}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                                                                >
                                                                    <ExternalLink className="w-3 h-3" />
                                                                    Source
                                                                </a>
                                                            )}
                                                            {item.link2 && (
                                                                <a
                                                                    href={item.link2}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                                                >
                                                                    <ExternalLink className="w-3 h-3" />
                                                                    More
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 bg-white/40 backdrop-blur-[2px] rounded-[4rem] border border-dashed border-slate-200 animate-in zoom-in-95 duration-500">
                        <div className="bg-amber-50/50 p-8 rounded-full mb-6 ring-8 ring-amber-50/30">
                            <SearchX className="w-12 h-12 text-amber-200" />
                        </div>
                        <h3 className="text-slate-800 font-black text-xl tracking-tight">No Awards Found</h3>
                        <p className="text-slate-400 text-xs font-medium italic mt-2 max-w-[240px] text-center leading-relaxed">
                            We couldn't find any awards matching your filters. Try adjusting your search or resetting.
                        </p>
                        <button onClick={handleReset} className="mt-8 px-8 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-300 shadow-sm hover:shadow-amber-100">
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AwardsPage;
