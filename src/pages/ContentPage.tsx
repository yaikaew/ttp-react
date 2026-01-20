import { useState, useMemo } from 'react';
import { useContents, useArtists } from '../hooks/useArtistData';
import FilterHeader from '../components/FilterHeader';
import { getArtistTheme } from '../utils/theme';
import { Calendar, Play } from 'lucide-react';
import { LoadingState } from "../components/LoadingState";
import { NoResults } from '../components/NoResults';

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

    if (isLoading) return <LoadingState />;

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
                                    className="group bg-card-bg rounded-3xl overflow-hidden border border-card-border shadow-sm hover:shadow-2xl hover:shadow-brand-primary/20 transition-all duration-500 flex flex-col"
                                >
                                    <div className="relative aspect-video overflow-hidden bg-brand-primary-light">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-3 left-3 bg-card-bg/80 backdrop-blur-md text-content-text-main text-[8px] font-black px-3 py-1.5 rounded-xl uppercase tracking-[0.15em] border border-card-border shadow-md z-10">
                                            {item.type}
                                        </div>
                                        <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="bg-brand-primary p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                                                <Play size={24} className="text-white fill-white ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col grow">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-content-text-muted">
                                                <Calendar size={12} className="text-brand-primary opacity-70" />
                                                {item.date}
                                            </div>

                                            <span className="w-1 h-1 bg-card-border rounded-full" />
                                            <div className={`${artistTheme.bg} ${artistTheme.text} text-[9px] font-black px-2.5 py-0.5 rounded-lg border ${artistTheme.border} uppercase tracking-widest shadow-sm`}>
                                                {item.artistName}
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-black text-content-text-main leading-tight line-clamp-2 group-hover:text-brand-primary transition-colors min-h-[40px]">
                                            {item.name}
                                        </h3>
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

export default ContentPage;