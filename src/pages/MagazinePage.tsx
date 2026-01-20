import { useState, useMemo } from 'react';
import { useMagazines, useArtists } from '../hooks/useArtistData';
import FilterHeader from '../components/FilterHeader';
import { getArtistTheme } from '../utils/theme';
import { ExternalLink, Calendar } from 'lucide-react';
import { LoadingState } from "../components/LoadingState";
import { NoResults } from '../components/NoResults';

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

    if (isLoading) return <LoadingState />;

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
                                <div key={item.id} className="group bg-card-bg rounded-3xl border border-card-border overflow-hidden hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-200 flex flex-col">
                                    <div className="relative aspect-3/4 overflow-hidden bg-brand-primary-light/20">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className={`absolute top-3 left-3 ${artistTheme.bg} ${artistTheme.text} px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border ${artistTheme.border} tracking-widest backdrop-blur-sm bg-opacity-90`}>
                                            {item.artistName}
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[8px] font-black text-brand-primary uppercase tracking-widest">
                                                ISSUE {item.issue || '-'}
                                            </span>
                                            <div className="flex items-center gap-1 text-content-text-muted text-[9px] font-bold">
                                                <Calendar size={10} />
                                                {new Date(item.date).getFullYear()}
                                            </div>
                                        </div>
                                        <h3 className="text-base font-black text-content-text-main leading-snug mb-4 line-clamp-2 group-hover:text-brand-primary transition-colors duration-200">
                                            {item.name}
                                        </h3>
                                        <div className="mt-auto">
                                            <a
                                                href={item.promo_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-center gap-1.5 py-2 bg-brand-primary-light/40 rounded-xl text-[8px] font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-200"
                                            >
                                                <ExternalLink size={12} /> Info
                                            </a>
                                        </div>
                                    </div>
                                </div>
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

export default MagazinePage;