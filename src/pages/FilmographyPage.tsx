import { useMemo, useState } from 'react';
import { Tv, CirclePlay, Layout } from 'lucide-react';
import FilterHeader from '../components/FilterHeader';
import { useFilmography, useArtists } from '../hooks/useArtistData';
import { LoadingState } from "../components/LoadingState";
import { NoResults } from '../components/NoResults';
import { Button } from '../components/Button';

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

    if (isLoading) return (<LoadingState />);

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
                                    className="group flex flex-col bg-card-bg rounded-2xl p-3 border border-card-border shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-brand-primary/10"
                                >
                                    {/* Image Section */}
                                    <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-card-bg mb-4">
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
                                            <span className="text-[9px] font-bold text-content-text-muted uppercase tracking-widest">
                                                {new Date(item.date).getFullYear()}
                                            </span>
                                            <div className="flex items-center gap-1 text-content-text-muted">
                                                <Tv size={10} />
                                                <span className="text-[8px] font-medium uppercase tracking-tighter">{item.note || 'series'}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-base font-bold text-content-text-main leading-snug mb-4 group-hover:text-brand-primary transition-colors line-clamp-2 min-h-10">
                                            {item.title}
                                        </h3>

                                        {/* Roles Info */}
                                        <div className="flex items-start gap-3 mb-5 pb-4 border-b border-blue-50/50">
                                            <div className="flex-1 min-w-0 border-l-2 border-purple-100 pl-2">
                                                <span className="text-xs font-bold text-purple-400 uppercase block mb-0.5">Teetee</span>
                                                <p className="text-sm text-content-text-sub truncate">{item.role_teetee}</p>
                                            </div>
                                            <div className="flex-1 min-w-0 border-l-2 border-sky-100 pl-2">
                                                <span className="text-xs font-bold text-sky-400 uppercase block mb-0.5">Por</span>
                                                <p className="text-sm text-content-text-sub truncate">{item.role_por}</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-auto grid grid-cols-2 gap-2">
                                            <Button
                                                href={`/filmography/${item.id}`}
                                                target=""
                                                rel="noreferrer"
                                                size="sm"
                                                icon={Layout}
                                            >
                                                Detail
                                            </Button>
                                            <Button
                                                variant="primary"
                                                href={item.rerun_link1}
                                                target="_blank"
                                                rel="noreferrer"
                                                size="sm"
                                                icon={CirclePlay}
                                            >
                                                Watch
                                            </Button>
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

export default FilmographyPage;