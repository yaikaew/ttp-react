import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Database } from '../types/supabase';
import { CirclePlay, Layout } from 'lucide-react';
import FilterHeader from '../components/FilterHeader'
import { LoadingState } from '../components/LoadingState'
import { NoResults } from '../components/NoResults';
import { Button } from '../components/Button';

type FilmWithArtist = Database['public']['Tables']['filmography']['Row'] & {
    artist: { name: string } | null;
};
const Filmography = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filterArtist, setFilterArtist] = useState('All')
    const [filterRole, setFilterRole] = useState('All')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [searchTerm, setSearchTerm] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const [films, setFilms] = useState<FilmWithArtist[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFilms = async () => {
            try {
                const { data, error } = await supabase
                    .from('filmography')
                    .select(`
                    *,
                    artist (name) 
                `) // Join ตาราง artist เพื่อเอา name มาใช้
                    .order('date', { ascending: false });
                if (data) {
                    console.log("Sample Data:", data[0]); // ดูว่า artist name มาในรูปแบบไหน
                    setFilms(data);
                }
                if (error) throw error;
                setFilms(data || []);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFilms();
    }, []);

    const handleReset = () => {
        setFilterArtist('All')
        setFilterRole('All')
        setSearchTerm('')
        setStartDate('')
        setEndDate('')
        setSortOrder('desc')
    }

    const filteredItems = films.filter(item => {
        const itemDate = item.date ? new Date(item.date).getTime() : 0;
        const start = startDate ? new Date(startDate).getTime() : -Infinity;
        const end = endDate ? new Date(endDate).getTime() : Infinity;
        const matchArtist = filterArtist === 'All' ||
            (item.artist && (
                (typeof item.artist === 'object' && !Array.isArray(item.artist) && item.artist.name === filterArtist) ||
                (Array.isArray(item.artist) && item.artist[0]?.name === filterArtist)
            ));
        const matchRole = filterRole === 'All' || item.status === filterRole;
        const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDate = itemDate >= start && itemDate <= end;

        return matchArtist && matchRole && matchSearch && matchDate;
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    if (isLoading) return <LoadingState />

    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-20">
            <FilterHeader
                title="Filmography" subtitle="Acting History"
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                onReset={handleReset}
                filterGroups={[
                    { label: 'Artist', currentValue: filterArtist, options: ['All', 'Teetee', 'Por', 'TeeteePor', 'DEXX'], onSelect: setFilterArtist },
                    { label: 'Status', currentValue: filterRole, options: ['All', 'Main Role', 'Guest Role', 'Support Role'], onSelect: setFilterRole },
                ]}
            />

            {/* Grid Layout */}
            <div className="px-4">
                {sortedItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                        {sortedItems.map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    className="group flex flex-col bg-card-bg rounded-2xl p-3 border border-card-border shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-brand-primary/10"
                                >
                                    {/* Image Section */}
                                    <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-card-bg mb-4">
                                        <img
                                            src={item.poster || ''}
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
                                                href={item.rerun_link || ''}
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
                            )
                        })}
                    </div>
                ) : (
                    <NoResults onReset={handleReset} />
                )}
            </div>
        </div>
    );
};

export default Filmography;