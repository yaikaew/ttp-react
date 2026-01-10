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
        <div className="max-w-7xl mx-auto px-4 pt-12 font-baijamjuree">
            <div className="mb-10 flex items-end justify-between border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
                    <p className="text-xs text-slate-400 font-medium mt-1 tracking-wide uppercase italic">{subtitle}</p>

                </div>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 text-sm font-semibold transition-all px-4 py-2 rounded-2xl border shadow-sm active:scale-95
                        ${isFilterOpen
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
                >
                    <Filter className={isFilterOpen ? "w-3.5 h-3.5 text-white" : "w-3.5 h-3.5 text-indigo-500"} />
                    <span className="hidden lg:inline">Search & Filter</span>
                    {isFilterOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
            </div>

            {/* --- Expandable Filter Panel --- */}
            {isFilterOpen && (
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Search Title</span>
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search something special..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all text-slate-800 font-bold placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date Period</span>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs outline-none focus:border-indigo-300 focus:bg-white transition-all text-slate-700 font-bold"
                                        />
                                    </div>
                                    <div className="w-2 h-[2px] bg-slate-200" />
                                    <div className="relative flex-1">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs outline-none focus:border-indigo-300 focus:bg-white transition-all text-slate-700 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {filterGroups.map((group, idx) => (
                                <div key={idx} className="space-y-4">
                                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{group.label}</span>
                                    <div className="flex flex-wrap gap-2">
                                        {group.options.map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => group.onSelect(opt)}
                                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all
                                                    ${group.currentValue === opt
                                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                                                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                            <button onClick={onReset} className="group flex items-center gap-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all">
                                <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform" />
                                Reset Filters
                            </button>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="flex items-center gap-3 px-4 py-1.5 bg-white text-indigo-600 border border-indigo-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm active:scale-95"
                            >
                                <div className="p-1.5 bg-indigo-100/50 rounded-lg">
                                    <ArrowUpDown className="w-3.5 h-3.5" />
                                </div>
                                <span>Sort: {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterHeader;