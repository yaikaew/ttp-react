import { useState, useMemo } from 'react';
import { useAwards, useArtists } from '../hooks/useArtistData';
import FilterHeader from '../components/FilterHeader';
import { getArtistTheme } from '../utils/theme';
import { Trophy, Star, ExternalLink } from 'lucide-react';
import { NoResults } from '../components/NoResults';
import { LoadingState } from '../components/LoadingState';

const AwardsPage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterArtist, setFilterArtist] = useState('All');
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

    const resultOptions = useMemo(() => {
        if (!data) return ['All'];
        const results = [...new Set(data.map(item => item.result).filter(Boolean))];
        return ['All', ...results.sort()];
    }, [data]);

    const handleReset = () => {
        setFilterArtist('All');
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
            return (filterArtist === 'All' || item.artistName === filterArtist) &&
                (filterResult === 'All' || item.result === filterResult) &&
                (item.award.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (itemDate >= start && itemDate <= end);
        }) || [];
    }, [data, filterArtist, filterResult, searchTerm, startDate, endDate]);

    const groupedByYear = useMemo(() => {
        const groups: Record<string, typeof filteredItems> = {};
        filteredItems.forEach(item => {
            const year = new Date(item.date).getFullYear().toString();
            if (!groups[year]) groups[year] = [];
            groups[year].push(item);
        });
        return Object.entries(groups).sort((a, b) => sortOrder === 'desc' ? Number(b[0]) - Number(a[0]) : Number(a[0]) - Number(b[0]));
    }, [filteredItems, sortOrder]);

    // Badge Style ที่ Compact และไวขึ้น
    const getResultBadge = (result: string) => {
        const res = result.toLowerCase();
        const isWon = res === 'won' || res === 'winner' || res === 'received';

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border shadow-sm ${isWon
                ? 'bg-brand-primary text-white border-brand-primary shadow-brand-primary/20'
                : 'bg-card-bg text-content-text-muted border-card-border'
                }`}>
                {isWon ? <Trophy size={10} /> : <Star size={10} />}
                {result}
            </span>
        );
    };

    if (isLoading) return <LoadingState />;

    return (
        <div className="min-h-screen pb-20 bg-page-bg transition-colors duration-300">
            <FilterHeader
                title="Awards" subtitle="Achievements"
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

            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                {filteredItems.length > 0 ? (
                    <div className="space-y-16">
                        {groupedByYear.map(([year, items]) => (
                            <div key={year} className="relative">
                                <div className="flex items-end gap-3 mb-8 border-b border-card-border pb-4">
                                    <h2 className="text-4xl font-black text-content-text-main tracking-tighter leading-none">
                                        {year}
                                    </h2>
                                    <div className="flex items-center gap-2 pb-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">
                                            {items.length} Achievements
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {items.map((item) => {
                                        const artistTheme = getArtistTheme(item.artistName);
                                        const isWon = ['won', 'winner', 'received'].includes(item.result.toLowerCase());

                                        return (
                                            <div key={item.id} className={`group bg-card-bg rounded-4xl border transition-all duration-200 flex flex-col hover:-translate-y-1.5 ${isWon ? 'border-brand-primary/30 shadow-lg shadow-brand-primary/5' : 'border-card-border shadow-sm hover:shadow-xl'}`}>
                                                {item.img && (
                                                    <div className="aspect-video overflow-hidden relative rounded-t-4xl">
                                                        <img
                                                            src={item.img}
                                                            alt={item.award}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        {isWon && (
                                                            <div className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-brand-primary text-white shadow-lg shadow-brand-primary/20">
                                                                <Trophy size={14} />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="p-5 flex flex-col flex-1">
                                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                                        <span className={`${artistTheme.bg} ${artistTheme.text} px-2 py-0.5 rounded-lg border ${artistTheme.border} text-[8px] font-black uppercase tracking-widest`}>
                                                            {item.artistName}
                                                        </span>
                                                        {getResultBadge(item.result)}
                                                    </div>

                                                    <h3 className="text-base font-black text-content-text-main leading-snug line-clamp-2 mb-2 group-hover:text-brand-primary transition-colors">
                                                        {item.award}
                                                    </h3>

                                                    {item.category && (
                                                        <p className="text-sm text-content-text-sub flex items-center gap-1.5 mb-3">
                                                            Category: {item.category}
                                                        </p>
                                                    )}
                                                    <div className="pt-4 mt-4 border-t border-card-border flex items-center justify-between">
                                                        <span className="text-sm text-content-text-muted">
                                                            {new Date(item.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            {item.link && (
                                                                <a href={item.link} target="_blank" rel="noreferrer" className="p-2 bg-brand-primary-light text-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-all duration-200">
                                                                    <ExternalLink size={12} />
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
                    <NoResults onReset={handleReset} />
                )}
            </div>
        </div>
    );
};

export default AwardsPage;