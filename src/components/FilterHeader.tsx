// components/FilterHeader.tsx
import { Filter, ChevronUp, ChevronDown, ArrowUpDown, RotateCcw, Search, Calendar } from 'lucide-react';

interface FilterHeaderProps {
    title: string;
    subtitle: string;
    isFilterOpen: boolean;
    setIsFilterOpen: (open: boolean) => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (order: 'asc' | 'desc') => void;
    onReset: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    filterGroups: {
        label: string;
        currentValue: string;
        options: string[];
        onSelect: (value: string) => void;
    }[];
}

const FilterHeader = ({
    title, subtitle, isFilterOpen, setIsFilterOpen,
    sortOrder, setSortOrder, onReset,
    searchTerm, setSearchTerm,
    startDate, setStartDate,
    endDate, setEndDate,
    filterGroups
}: FilterHeaderProps) => {
    return (
        <div className="max-w-7xl mx-auto px-6 pt-12 transition-all duration-500">
            {/* Header Section - เส้นคั่นหนาขึ้นและเข้มขึ้น */}
            <div className="mb-10 flex items-end justify-between border-b-2 border-brand-primary/20 pb-6">
                <div>
                    <h2 className="text-2xl font-black text-content-text-main tracking-tight">
                        {title}
                    </h2>
                    <p className="text-xs font-medium mt-1 tracking-wide uppercase italic text-content-text-muted">
                        {subtitle}
                    </p>
                </div>

                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl border-2 transition-all duration-300 shadow-sm
                ${isFilterOpen
                            ? 'bg-brand-primary text-white border-brand-primary shadow-brand-primary/20'
                            : 'bg-card-bg text-nav-text border-brand-primary/20 hover:border-brand-primary hover:text-brand-primary'}`}
                >
                    <Filter className={`w-3.5 h-3.5 ${isFilterOpen ? 'text-white' : 'text-brand-primary'}`} />
                    <span className="hidden lg:inline">Filters</span>
                    {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            {/* Expandable Filter Panel */}
            {isFilterOpen && (
                <div className="bg-card-bg/80 backdrop-blur-xl border-2 border-brand-primary/20 rounded-[2.5rem] p-8 md:p-6 mb-6 shadow-xl shadow-brand-primary/5 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="space-y-10">

                        {/* Search & Date Range Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Search Input */}
                            <div className="space-y-3">
                                <span className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-widest">
                                    <Search size={12} /> Search by Title
                                </span>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="What are you looking for?..."
                                        className="w-full bg-filter-input-bg border-2 border-brand-primary/10 rounded-2xl py-3.5 px-5 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all text-content-text-main"
                                    />
                                </div>
                            </div>

                            {/* Date Range Inputs */}
                            <div className="space-y-3">
                                <span className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-widest">
                                    <Calendar size={12} /> Date Range
                                </span>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1 group">
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full bg-filter-input-bg/50 border border-brand-sidebar-border rounded-2xl py-3 px-4 text-xs outline-none focus:border-brand-primary focus:bg-card-bg transition-all text-content-text-main"
                                        />
                                    </div>
                                    <span className="text-brand-primary/30 font-bold">to</span>
                                    <div className="relative flex-1 group">
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full bg-filter-input-bg/50 border border-brand-sidebar-border rounded-2xl py-3 px-4 text-xs outline-none focus:border-brand-primary focus:bg-card-bg transition-all text-content-text-main"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Filter Groups */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {filterGroups.map((group, idx) => (
                                <div key={idx} className="space-y-4">
                                    <span className="block text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">{group.label}</span>
                                    <div className="flex flex-wrap gap-2">
                                        {group.options.map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => group.onSelect(opt)}
                                                className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border-2
                                            ${group.currentValue === opt
                                                        ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20 scale-105'
                                                        : 'bg-transparent text-brand-primary border-brand-primary/10 hover:border-brand-primary/40'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Actions - เส้นคั่นเข้มขึ้น */}
                        <div className="pt-8 border-t-2 border-brand-primary/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <button
                                onClick={onReset}
                                className="flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-brand-accent hover:text-brand-primary transition-colors group"
                            >
                                <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-120deg] transition-transform duration-500" />
                                Reset Filter
                            </button>

                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="flex items-center gap-3 px-6 py-2.5 bg-brand-primary/5 border-2 border-brand-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300"
                            >
                                <ArrowUpDown className="w-3.5 h-3.5" />
                                Sorting: {sortOrder === 'asc' ? 'Oldest' : 'Newest'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterHeader;