import { useMemo, useState } from 'react';
import { useCalendarEvents, useArtists } from '../hooks/useArtistData';
import FilterHeader from '../components/FilterHeader';
import { NoResults } from '../components/NoResults';
import { LoadingState } from '../components/LoadingState';

const OutfitsPage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterArtist, setFilterArtist] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { data, isLoading } = useCalendarEvents(sortOrder);

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

        const hasOutfitImage = !!item.outfit_img;

        return hasOutfitImage && matchArtist && matchType && matchSearch && matchDate;
    }) || [];

    if (isLoading) return <LoadingState />;

    return (
        <div className="min-h-screen pb-20">
            <FilterHeader
                title="Outfits Archive"
                subtitle="Fashion & Styles Collection"
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                onReset={handleReset}
                filterGroups={[{ label: 'Artist', currentValue: filterArtist, options: artistOptions, onSelect: setFilterArtist }]}
            />

            <div className="max-w-7xl mx-auto px-4">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.map(item => {
                            return (
                                <div key={item.id} className="group flex flex-col bg-card-bg rounded-3xl overflow-hidden border border-card-border hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-300">
                                    {/* Image Container - เร่งความเร็วการขยายภาพ */}
                                    <div className="relative aspect-square overflow-hidden bg-brand-primary-light/20">
                                        <img
                                            src={item.outfit_img}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {/* Overlay จางๆ ตอน Hover ให้ภาพดูมีมิติ */}
                                        <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Content Info - ปรับให้กระชับและตัวอักษรเล็กลง */}
                                    <div className="p-3 flex flex-col items-center text-center space-y-0.5">
                                        {/* บรรทัดที่ 1: วันที่ - ใช้สี Muted และตัวเล็กเน้นความเนี๊ยบ */}
                                        <div className="text-[9px] font-black text-content-text-muted uppercase tracking-[0.2em]">
                                            {item.date.replace(/-/g, '')}
                                        </div>

                                        {/* บรรทัดที่ 2: Hashtag - เปลี่ยนจาก Indigo เป็น Brand Color */}
                                        {item.tag ? (
                                            <a
                                                href={`https://x.com/search?q=${encodeURIComponent(item.tag)}&src=typed_query&f=top`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[12px] font-bold text-brand-primary hover:text-brand-primary-hover transition-colors duration-200 truncate max-w-full px-2"
                                            >
                                                {item.tag}
                                            </a>
                                        ) : (
                                            <div className="text-[11px] font-bold text-content-text-muted/40 italic">
                                                #NoHashtag
                                            </div>
                                        )}
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

export default OutfitsPage;