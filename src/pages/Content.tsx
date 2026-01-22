import { useState } from 'react';
import { useContent } from '../hooks/useContent'; // สมมติว่ามี hook สำหรับ fetch ข้อมูล content
import { useFilter } from '../hooks/useFilter';
import FilterHeader from '../components/FilterHeader';
import { LoadingState } from '../components/LoadingState';
import { NoResults } from '../components/NoResults';
import { getArtistTheme, getTypeTheme } from '../utils/theme';
import { VideoCard } from '../components/VideoCard';

const Content = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { contents, loading } = useContent();

    const {
        state,
        setters,
        handleReset,
        filteredItems
    } = useFilter(contents || []);

    if (loading) return <LoadingState />;

    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-20">
            <FilterHeader
                title="Contents" subtitle="Media Appearances"
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                sortOrder={state.sortOrder} setSortOrder={setters.setSortOrder}
                searchTerm={state.searchTerm} setSearchTerm={setters.setSearchTerm}
                startDate={state.startDate} setStartDate={setters.setStartDate}
                endDate={state.endDate} setEndDate={setters.setEndDate}
                onReset={handleReset}
                filterGroups={[
                    { label: 'Artist', currentValue: state.filterArtist, options: ['All', 'Teetee', 'Por', 'TeeteePor', 'DEXX'], onSelect: setters.setFilterArtist },
                    { label: 'Type', currentValue: state.filterType, options: ['All', 'Online Shows', 'Special', 'BTS', 'Press Tour', 'Press Cons', 'Reaction', 'Live', 'Interview'], onSelect: setters.setFilterType }
                ]}
            />

            <div className="px-4">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredItems.map((item) => {
                            const artistData = Array.isArray(item.artist) ? item.artist[0] : item.artist;
                            const artistName = artistData?.name || 'Unknown';
                            const artistTheme = getArtistTheme(artistName);
                            const typeTheme = getTypeTheme ? getTypeTheme(item.type || '') : undefined;

                            return (
                                <VideoCard
                                    key={item.id}
                                    link={item.link || "#"}
                                    img={item.img || ""}
                                    title={item.name || ""}
                                    date={item.date ? String(item.date) : ""}
                                    artistName={artistName}
                                    type={item.type || "Content"}
                                    variant="content"
                                    artistTheme={artistTheme}
                                    typeTheme={typeTheme}
                                    note={""}
                                />
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

export default Content;