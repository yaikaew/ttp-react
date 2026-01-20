import { useState, useMemo } from 'react';
import { usePerformance, useArtists } from '../hooks/useArtistData';
import FilterHeader from '../components/FilterHeader';
import { getArtistTheme, getTypeTheme } from '../utils/theme';
import { LoadingState } from "../components/LoadingState";
import { NoResults } from '../components/NoResults';

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

    if (isLoading) return <LoadingState />;

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
                                    className="group bg-card-bg rounded-3xl border border-card-border overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brand-primary/10 hover:-translate-y-1.5 transition-all duration-500 flex flex-col"
                                >
                                    <div className="aspect-video bg-brand-primary-light overflow-hidden relative">
                                        <img
                                            src={item.img || 'https://via.placeholder.com/300'}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {/* Overlay จางๆ ตอน Hover */}
                                        <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col space-y-3">
                                        {/* Badges & Year */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`${artistTheme.bg} ${artistTheme.text} px-2.5 py-0.5 rounded-lg border ${artistTheme.border} text-[9px] font-black uppercase tracking-wider shadow-sm`}>
                                                {item.artistName}
                                            </span>
                                            <span className={`${typeTheme.bg} ${typeTheme.text} px-2.5 py-0.5 rounded-lg border ${typeTheme.border} text-[9px] font-black uppercase tracking-wider`}>
                                                {item.type}
                                            </span>
                                            <span className="text-[10px] font-bold text-content-text-muted ml-auto flex items-center gap-1">
                                                <span className="w-1 h-1 bg-brand-primary rounded-full animate-pulse" />
                                                {new Date(item.date).getFullYear()}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-1.5 flex-1">
                                            <h3 className="text-[15px] font-black text-content-text-main line-clamp-2 leading-tight group-hover:text-brand-primary transition-colors">
                                                {item.title}
                                            </h3>

                                            {item.note && (
                                                <p className="text-xs text-content-text-muted line-clamp-1">
                                                    {item.note}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </a>
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

export default PerformancePage;