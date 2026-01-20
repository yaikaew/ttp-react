import { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import FilterHeader from '../components/FilterHeader';
import { useDiscography, useArtists } from '../hooks/useArtistData';
import { getArtistTheme } from '../utils/theme';
import { LoadingState } from "../components/LoadingState";
import { NoResults } from '../components/NoResults';

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

    if (isLoading) return <LoadingState />;

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
                                <div key={item.id} className="group relative bg-card-bg rounded-3xl border border-card-border overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brand-primary/10 hover:-translate-y-1 transition-all duration-500 flex flex-col">

                                    {/* Album Cover Section */}
                                    <div className="aspect-square overflow-hidden relative">
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />

                                        {/* Overlay ไล่เฉดสีดำจากล่างขึ้นบนเพื่อให้ Artist Name และ Title ดูเด่นขึ้น */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Artist Tag - ปรับให้ดูเป็น Glassmorphism */}
                                        <div className={`absolute top-3 left-3 ${artistTheme.bg} ${artistTheme.text} px-2.5 py-1 rounded-full border ${artistTheme.border} text-[10px] font-black uppercase tracking-widest backdrop-blur-md bg-opacity-80 shadow-lg`}>
                                            {item.artistName}
                                        </div>
                                    </div>

                                    {/* Song Info Content */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex-1 space-y-1.5">
                                            <h3 className="text-[15px] font-black text-content-text-main line-clamp-2 group-hover:text-brand-primary transition-colors leading-tight min-h-[40px]">
                                                {item.title}
                                            </h3>

                                            <div className="flex items-center gap-1.5 text-[11px] text-content-text-muted font-medium">
                                                <Calendar size={12} className="opacity-70" />
                                                {new Date(item.date).getFullYear()}
                                            </div>
                                        </div>

                                        {/* Action Buttons - ปรับให้เป็นแนว Button Group ที่ดูสะอาดตา */}
                                        <div className="mt-5 pt-4 border-t border-card-border/50 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <a href={item.mv} target="_blank" rel="noreferrer"
                                                    className="group/link flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-content-text-sub hover:text-brand-primary transition-colors">
                                                    <span className="relative">
                                                        MV
                                                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-primary transition-all group-hover/link:w-full" />
                                                    </span>
                                                </a>

                                                <a href={item.streaming} target="_blank" rel="noreferrer"
                                                    className="group/link flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-content-text-sub hover:text-brand-primary transition-colors">
                                                    <span className="relative">
                                                        Streaming
                                                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-primary transition-all group-hover/link:w-full" />
                                                    </span>
                                                </a>
                                            </div>
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

export default DiscographyPage;