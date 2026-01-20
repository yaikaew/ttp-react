import {
    Filter,
    ChevronUp,
    ChevronDown,
    ArrowUpDown,
    RotateCcw,
    Search,
    Calendar
} from 'lucide-react';

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
    title,
    subtitle,
    isFilterOpen,
    setIsFilterOpen,
    sortOrder,
    setSortOrder,
    onReset,
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filterGroups
}: FilterHeaderProps) => {
    return (
        <div className="max-w-7xl mx-auto px-4 pt-12">
            {/* Header */}
            <div className="mb-10 flex items-end justify-between border-b border-card-border pb-6">
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
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-2xl border
                        text-sm font-semibold transition-all shadow-sm active:scale-95
                        ${isFilterOpen
                            ? 'bg-brand-primary text-white border-brand-primary'
                            : 'bg-card-bg text-content-text-sub border-card-border hover:bg-brand-primary-light hover:text-brand-primary'}
                    `}
                >
                    <Filter className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Search & Filter</span>
                    {isFilterOpen
                        ? <ChevronUp className="w-3.5 h-3.5" />
                        : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
            </div>

            {/* Filter Panel */}
            {isFilterOpen && (
                <div className="
                    bg-card-bg
                    border
                    border-card-border
                    rounded-[2.5rem]
                    p-8 md:p-10
                    mb-12
                    shadow-[0_20px_50px_rgba(0,0,0,0.04)]
                    animate-in fade-in slide-in-from-top-4 duration-500
                ">
                    <div className="space-y-10">

                        {/* Search + Date */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                            {/* Search */}
                            <div className="space-y-4">
                                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-content-text-muted">
                                    Search Title
                                </span>
                                <div className="relative group">
                                    <Search className="
                                        absolute left-4 top-1/2 -translate-y-1/2
                                        w-4 h-4 text-content-text-muted
                                        group-focus-within:text-brand-primary
                                    " />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search something special..."
                                        className="
                                            w-full
                                            bg-filter-input-bg
                                            border border-filter-border
                                            rounded-2xl
                                            py-4 pl-12 pr-4
                                            text-sm font-bold
                                            text-content-text-main
                                            placeholder:text-content-text-muted
                                            outline-none
                                            focus:bg-card-bg
                                            focus:border-brand-primary
                                            focus:ring-4 focus:ring-brand-primary-light
                                            transition-all
                                        "
                                    />
                                </div>
                            </div>

                            {/* Date */}
                            <div className="space-y-4">
                                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-content-text-muted">
                                    Date Period
                                </span>
                                <div className="flex items-center gap-3">
                                    {[{
                                        value: startDate,
                                        onChange: setStartDate
                                    }, {
                                        value: endDate,
                                        onChange: setEndDate
                                    }].map((item, idx) => (
                                        <div key={idx} className="relative flex-1">
                                            <Calendar className="
                                                absolute left-4 top-1/2 -translate-y-1/2
                                                w-4 h-4 text-content-text-muted
                                            " />
                                            <input
                                                type="date"
                                                value={item.value}
                                                onChange={(e) => item.onChange(e.target.value)}
                                                className="
                                                    w-full
                                                    bg-filter-input-bg
                                                    border border-filter-border
                                                    rounded-2xl
                                                    py-3.5 pl-11 pr-4
                                                    text-xs font-bold
                                                    text-content-text-main
                                                    outline-none
                                                    focus:bg-card-bg
                                                    focus:border-brand-primary
                                                    transition-all
                                                "
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Filter Groups */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {filterGroups.map((group, idx) => (
                                <div key={idx} className="space-y-4">
                                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-content-text-muted">
                                        {group.label}
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {group.options.map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => group.onSelect(opt)}
                                                className={`
                                                    px-5 py-2 rounded-xl
                                                    text-[10px] font-black uppercase
                                                    transition-all
                                                    ${group.currentValue === opt
                                                        ? 'bg-brand-primary text-white shadow-md'
                                                        : 'bg-filter-input-bg text-content-text-sub border border-filter-border hover:bg-brand-primary-light'}
                                                `}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="pt-6 border-t border-card-border flex justify-between items-center">
                            <button
                                onClick={onReset}
                                className="
                                    group flex items-center gap-2
                                    px-4 py-1.5
                                    text-[10px] font-black uppercase tracking-widest
                                    text-content-text-muted
                                    hover:text-brand-accent
                                    transition-all
                                "
                            >
                                <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform" />
                                Reset Filters
                            </button>

                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="
                                    flex items-center gap-3
                                    px-4 py-1.5
                                    bg-card-bg
                                    text-brand-primary
                                    border border-card-border
                                    rounded-2xl
                                    text-[10px] font-black uppercase tracking-[0.15em]
                                    hover:bg-brand-primary-light
                                    transition-all
                                    shadow-sm active:scale-95
                                "
                            >
                                <div className="p-1.5 bg-brand-primary-light rounded-lg">
                                    <ArrowUpDown className="w-3.5 h-3.5" />
                                </div>
                                <span>
                                    Sort: {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                                </span>
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterHeader;
