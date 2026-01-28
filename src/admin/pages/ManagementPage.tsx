import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { TABLE_CONFIGS } from '../config/tableConfig';
import {
    ArrowLeft,
    Plus,
    Search,
    Trash2,
    Edit3,
    Loader2,
    Filter,
    Download,
    AlertCircle,
    Database as DatabaseIcon,
    X,
    Save,
    CheckCircle2,
    Calendar as CalendarIcon,
    ArrowUpDown
} from 'lucide-react';
import type { Database } from '../../types/supabase';

const ManagementPage = () => {
    const { tableName } = useParams<{ tableName: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<Record<string, unknown>[]>([]);
    const [artists, setArtists] = useState<{ id: number, name: string }[]>([]);
    const [filmographies, setFilmographies] = useState<{ id: number, title: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter states
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [filterArtist, setFilterArtist] = useState<string>('');
    const [filterStartDate, setFilterStartDate] = useState<string>('');
    const [filterEndDate, setFilterEndDate] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);
    const [editData, setEditData] = useState<Record<string, unknown>>({});
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const config = tableName ? TABLE_CONFIGS[tableName] : null;

    const fetchData = async () => {
        if (!tableName) return;
        setLoading(true);
        setError(null);

        try {
            // Build dynamic select string based on available columns in the table
            let selectStr = '*';

            // Check if table has artist relation
            const tablesWithArtist = ['calendar', 'filmography', 'discography', 'performance', 'magazine', 'contents', 'awards'];
            // Check if table has filmography relation
            const tablesWithFilm = ['filmographydetail', 'filmographytrends'];

            if (tableName && tablesWithArtist.includes(tableName)) {
                selectStr += ', artist:artist_id(name)';
            }

            if (tableName && tablesWithFilm.includes(tableName)) {
                selectStr += ', filmography:filmography_id(title)';
            }

            let query = supabase
                .from(tableName as unknown as keyof Database['public']['Tables'])
                .select(selectStr);

            // Explicit list of tables that have a 'date' column for sorting
            const dateTables = ['filmography', 'discography', 'calendar', 'performance', 'magazine', 'contents'];
            const isDateTable = tableName && dateTables.includes(tableName);

            if (isDateTable) {
                query = query.order('date', { ascending: sortOrder === 'asc', nullsFirst: false });
                query = query.order('id', { ascending: sortOrder === 'asc' });
            } else {
                // For tables like 'artist' and 'filmographydetail' (or fallback), sort by ID
                query = query.order('id', { ascending: sortOrder === 'asc' });
            }

            const { data: result, error: fetchError } = await query;

            if (fetchError) {
                // Fallback attempt if date sort fails
                const { data: fallbackResult, error: fallbackError } = await supabase
                    .from(tableName as unknown as keyof Database['public']['Tables'])
                    .select('*')
                    .order('id', { ascending: sortOrder === 'asc' });

                if (fallbackError) throw fallbackError;
                setData((fallbackResult as unknown as Record<string, unknown>[]) || []);
            } else {
                setData((result as unknown as Record<string, unknown>[]) || []);
            }

            const { data: artistData } = await supabase.from('artist').select('id, name').order('name');
            setArtists((artistData as { id: number, name: string }[]) || []);

            const { data: filmData } = await supabase.from('filmography').select('id, title').order('title');
            setFilmographies((filmData as { id: number, title: string }[]) || []);

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableName, sortOrder]);

    const handleDelete = async (e: React.MouseEvent, id: string | number) => {
        e.stopPropagation();
        if (!tableName || !confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) return;

        try {
            const { error: deleteError } = await supabase
                .from(tableName as unknown as keyof Database['public']['Tables'])
                .delete()
                .eq('id', Number(id));

            if (deleteError) throw deleteError;
            setData(data.filter(item => (item.id as string | number) !== id));
        } catch (err: unknown) {
            alert('ลบไม่สำเร็จ: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const handleSave = async () => {
        if (!tableName) return;
        setSaving(true);

        try {
            // Create a copy and remove non-database fields
            const payload = { ...editData as Record<string, unknown> };
            delete payload.artist;
            delete payload.filmography;
            delete payload.id;

            if (isAddMode) {
                const { error: insertError } = await supabase.from(tableName as unknown as keyof Database['public']['Tables']).insert(payload);
                if (insertError) throw insertError;
            } else {
                const rowId = selectedRow?.id;
                if (rowId === undefined || rowId === null) throw new Error('ไม่พบ ID สำหรับการแก้ไข');

                const { error: updateError } = await supabase
                    .from(tableName as unknown as keyof Database['public']['Tables'])
                    .update(payload)
                    .eq('id', Number(rowId));
                if (updateError) throw updateError;
            }

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            fetchData();
            setIsDrawerOpen(false);
            document.body.style.overflow = ""; // Ensure scroll is restored
        } catch (err: unknown) {
            alert('บันทึกไม่สำเร็จ: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setSaving(false);
        }
    };

    const handleAddNew = () => {
        setIsAddMode(true);
        setSelectedRow(null);
        document.body.style.overflow = "hidden"; // Lock scroll when drawer opens
        const template: Record<string, unknown> = {};
        const columnsToUse = data.length > 0 ? Object.keys(data[0]) : config?.importantColumns || [];

        columnsToUse.forEach(col => {
            if (col === 'id' || col === 'artist' || col === 'filmography' || col === 'performance') return;
            const firstRowValue = data[0]?.[col];
            if (typeof firstRowValue === 'boolean') {
                template[col] = false;
            } else if (tableName === 'contents' && col === 'img') {
                template[col] = 'https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg';
            } else {
                template[col] = '';
            }
        });

        setEditData(template);
        setIsDrawerOpen(true);
    };

    const handleEdit = (row: Record<string, unknown>) => {
        setIsAddMode(false);
        setSelectedRow(row);
        setEditData({ ...row });
        setIsDrawerOpen(true);
        document.body.style.overflow = "hidden"; // Lock scroll
    };

    const handleInputChange = (key: string, value: unknown) => {
        setEditData(prev => ({ ...prev, [key]: value }));
    };

    const filteredData = data.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesArtist = !filterArtist || String(item.artist_id) === filterArtist;

        let matchesDate = true;
        const itemDate = item.date as string;
        if (itemDate) {
            if (filterStartDate && itemDate < filterStartDate) matchesDate = false;
            if (filterEndDate && itemDate > filterEndDate) matchesDate = false;
        } else if (filterStartDate || filterEndDate) {
            matchesDate = false;
        }

        return matchesSearch && matchesArtist && matchesDate;
    });

    const resetFilters = () => {
        setFilterArtist('');
        setFilterStartDate('');
        setFilterEndDate('');
    };

    const handleDownloadCSV = () => {
        if (filteredData.length === 0) return;

        // Get headers from the first row (excluding joined objects)
        const headers = Object.keys(filteredData[0]).filter(k => k !== 'artist' && k !== 'filmography');

        // Header row
        const csvRows = [headers.join(',')];

        // Content rows
        for (const row of filteredData) {
            const values = headers.map(header => {
                const val = row[header];
                const escaped = String(val ?? '').replace(/"/g, '""'); // Escape double quotes
                return `"${escaped}"`; // Wrap in quotes
            });
            csvRows.push(values.join(','));
        }

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${tableName}_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getVisibleColumns = () => {
        if (config?.importantColumns) return config.importantColumns;
        if (data.length > 0) return Object.keys(data[0]).filter(k => k !== 'artist' && k !== 'filmography');
        return [];
    };

    const renderCellValue = (row: Record<string, unknown>, col: string, isToday: boolean = false) => {
        if (col === 'artist_id' && row.artist) {
            const artist = Array.isArray(row.artist) ? row.artist[0] : row.artist;
            const name = (artist as { name: string })?.name || String(row[col] ?? '-');
            return (
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold whitespace-nowrap">
                    {name}
                </span>
            );
        }

        if (col === 'filmography_id' && row.filmography) {
            const film = Array.isArray(row.filmography) ? row.filmography[0] : row.filmography;
            const title = (film as { title: string })?.title || String(row[col] ?? '-');
            return (
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold whitespace-nowrap">
                    {title}
                </span>
            );
        }

        const value = row[col];
        if (typeof value === 'boolean') {
            return (
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${value ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {value ? 'True' : 'False'}
                </span>
            );
        }

        if (col === 'image_url' || (typeof value === 'string' && (value.startsWith('http') && (value.includes('.jpg') || value.includes('.png') || value.includes('.webp'))))) {
            return (
                <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                    {value ? <img src={value as string} alt="" className="w-full h-full object-cover" /> : null}
                </div>
            );
        }

        const isNameColumn = col === 'name' || col === 'title' || col === 'event';

        return (
            <div className="flex items-center gap-2">
                <span className={`text-sm font-medium truncate max-w-[150px] md:max-w-[200px] block ${isToday && isNameColumn ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                    {String(value ?? '-')}
                </span>
                {isToday && isNameColumn && (
                    <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-black rounded-md uppercase tracking-wide animate-pulse shadow-sm shadow-red-200">
                        Today
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 font-baijamjuree relative min-h-screen">
            {showSuccess && (
                <div className="fixed top-8 right-8 z-200 animate-in slide-in-from-top duration-300">
                    <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                        <CheckCircle2 size={24} />
                        <span className="font-bold">บันทึกข้อมูลเรียบร้อยแล้ว!</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm mb-4 transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                            <ArrowLeft size={16} />
                        </div>
                        กลับไปยัง Dashboard
                    </button>
                    <h1 className="text-3xl font-black text-slate-800 capitalize">จัดการข้อมูล {config?.name || tableName}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownloadCSV}
                        className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
                    >
                        <Download size={18} />
                        CSV
                    </button>
                    <button
                        onClick={handleAddNew}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 transform active:scale-95"
                    >
                        <Plus size={20} />
                        เพิ่มข้อมูลใหม่
                    </button>
                </div>
            </div>

            <div className="mb-8 space-y-4 text-slate-800">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-3 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder={`ค้นหาในตาราง ${config?.name || tableName}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-medium text-slate-600"
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        className={`flex items-center justify-center gap-2 border rounded-2xl py-3.5 px-4 font-bold transition-all ${isFilterVisible ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Filter size={18} />
                        ตัวกรอง {(filterArtist || filterStartDate || filterEndDate) ? '(1+)' : ''}
                    </button>
                </div>

                {isFilterVisible && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">กรองด้วยศิลปิน</label>
                            <select
                                value={filterArtist}
                                onChange={(e) => setFilterArtist(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 font-bold text-slate-700 transition-all"
                            >
                                <option value="">ทั้งหมด</option>
                                {artists.map(a => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ช่วงวันที่ (เริ่มต้น - สิ้นสุด)</label>
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="date"
                                        value={filterStartDate}
                                        onChange={(e) => setFilterStartDate(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 pl-11 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 font-bold text-slate-700 text-xs transition-all"
                                    />
                                </div>
                                <span className="text-slate-300">-</span>
                                <div className="relative flex-1">
                                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="date"
                                        value={filterEndDate}
                                        onChange={(e) => setFilterEndDate(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 pl-11 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 font-bold text-slate-700 text-xs transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {(() => {
                                const dateTables = ['calendar', 'filmography', 'discography', 'performance', 'magazines', 'endorsements', 'contents', 'awards', 'filmographydetail', 'filmographytrends'];
                                const isDateTable = tableName && dateTables.includes(tableName);
                                return (
                                    <>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                            เรียงลำดับ ({isDateTable ? 'วันที่' : 'ID'})
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    const nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                                                    setSortOrder(nextOrder);
                                                }}
                                                className="flex-1 flex items-center justify-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                                            >
                                                <ArrowUpDown size={18} className="text-indigo-500" />
                                                {sortOrder === 'asc'
                                                    ? (isDateTable ? 'เก่า → ใหม่' : 'ID น้อย → มาก')
                                                    : (isDateTable ? 'ใหม่ → เก่า' : 'ID มาก → น้อย')}
                                            </button>
                                            <button
                                                onClick={resetFilters}
                                                className="p-3.5 bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                                title="ล้างตัวกรอง"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>

            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        <p className="text-slate-400 font-bold animate-pulse">กำลังโหลดข้อมูล...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4 text-center px-4">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                            <AlertCircle size={32} />
                        </div>
                        <p className="text-red-500 font-bold">{error}</p>
                        <button onClick={fetchData} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">ลองใหม่อีกครั้ง</button>
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4 text-center px-4">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                            <DatabaseIcon size={32} />
                        </div>
                        <p className="text-slate-400 font-bold">ไม่พบข้อมูลในตารางนี้</p>
                        <button onClick={handleAddNew} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">เริ่มเพิ่มข้อมูลชิ้นแรก</button>
                    </div>
                ) : (
                    <>
                        {/* Mobile Card View */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {filteredData.map((row) => {
                                const isToday = tableName === 'calendar' &&
                                    typeof row.date === 'string' &&
                                    new Date(row.date).toDateString() === new Date().toDateString();

                                const visibleCols = getVisibleColumns();
                                const nameCol = visibleCols.find(col => ['name', 'title', 'song', 'event', 'hashtag'].includes(col)) || visibleCols[0];
                                const artistCol = visibleCols.find(col => col === 'artist_id');
                                const filmCol = visibleCols.find(col => col === 'filmography_id');
                                const dateCol = visibleCols.find(col => col.includes('date') || col === 'date');

                                return (
                                    <div
                                        key={String(row.id)}
                                        className={`p-5 rounded-3xl border transition-all ${isToday ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-100 shadow-sm'}`}
                                    >
                                        {/* Badge & Date Section */}
                                        <div className="flex items-center justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-2">
                                                {isToday && (
                                                    <span className="px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-black rounded uppercase animate-pulse">Today</span>
                                                )}
                                                {dateCol && !!row[dateCol] && (
                                                    <span className="text-[10px] font-bold text-slate-400">{String(row[dateCol])}</span>
                                                )}
                                            </div>
                                            {artistCol && !!row.artist && (
                                                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black whitespace-nowrap">
                                                    {(row.artist as { name: string }).name}
                                                </span>
                                            )}
                                            {filmCol && !!row.filmography && (
                                                <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black whitespace-nowrap">
                                                    {(row.filmography as { title: string }).title}
                                                </span>
                                            )}
                                        </div>

                                        {/* Content Section */}
                                        <div className="mb-5">
                                            <h3 className={`text-base font-bold leading-tight ${isToday ? 'text-red-700' : 'text-slate-800'}`}>
                                                {String(row[nameCol] ?? '-')}
                                            </h3>
                                            <span className="text-[10px] font-bold text-slate-300">ID: {String(row.id)}</span>
                                        </div>

                                        {/* Action Buttons - แสดงตลอดเวลา */}
                                        <div className="flex gap-2 pt-4 border-t border-slate-50">
                                            <button
                                                onClick={() => handleEdit(row)}
                                                className="flex-1 h-12 flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 active:scale-95 transition-transform"
                                            >
                                                <Edit3 size={18} />
                                                แก้ไข
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, row.id as string | number)}
                                                className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl active:scale-95 transition-transform border border-red-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                            <div className="overflow-x-auto relative">
                                <table className="w-full text-left border-collapse md:min-w-full">
                                    <thead>
                                        <tr className="bg-slate-50/80 border-b border-slate-100">
                                            {getVisibleColumns().map(col => (
                                                <th key={col} className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
                                                    {col === 'artist_id' ? 'ศิลปิน' : col === 'filmography_id' ? 'ผลงาน' : col.replace('_', ' ')}
                                                </th>
                                            ))}
                                            <th className="sticky right-0 bg-slate-50/80 px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none text-right z-10 shadow-[-12px_0_12px_-12px_rgba(0,0,0,0.1)]">
                                                จัดการ
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredData.map((row) => {
                                            const isToday = tableName === 'calendar' &&
                                                typeof row.date === 'string' &&
                                                new Date(row.date).toDateString() === new Date().toDateString();

                                            return (
                                                <tr
                                                    key={String(row.id)}
                                                    className={`transition-colors group cursor-pointer ${isToday ? 'bg-red-50/70 hover:bg-red-100' : 'hover:bg-indigo-50/50'}`}
                                                >
                                                    {getVisibleColumns().map(col => (
                                                        <td key={col} className="px-6 py-5" onClick={() => handleEdit(row)}>
                                                            {renderCellValue(row, col, isToday)}
                                                        </td>
                                                    ))}
                                                    <td className="sticky right-0 bg-white group-hover:bg-indigo-50/50 px-6 py-5 text-right z-10 shadow-[-12px_0_12px_-12px_rgba(0,0,0,0.1)] transition-colors">
                                                        {/* ลบ md:opacity-0 ออกเพื่อให้แสดงผลตลอดเวลา */}
                                                        <div className="flex items-center justify-end gap-2 transition-opacity">
                                                            <button
                                                                onClick={() => handleEdit(row)}
                                                                className="p-2 text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                                                            >
                                                                <Edit3 size={18} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(e, row.id as string | number);
                                                                }}
                                                                className="p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {filteredData.length === 0 && (
                            <div className="py-20 text-center text-slate-400 font-bold">
                                ไม่พบข้อมูลที่ตรงตามตัวกรอง
                            </div>
                        )}
                    </>
                )}
            </div>

            {isDrawerOpen && (
                <div className="fixed inset-0 z-100 flex justify-end text-slate-800">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => {
                        setIsDrawerOpen(false);
                        document.body.style.overflow = "";
                    }} />
                    <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div className="min-w-0">
                                <h2 className="text-xl md:text-2xl font-black text-slate-800 truncate">{isAddMode ? 'เพิ่มข้อมูลใหม่' : 'แก้ไขข้อมูล'}</h2>
                                {!isAddMode && <p className="text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-wider">Record ID: {String(selectedRow?.id ?? '')}</p>}
                            </div>
                            <button
                                onClick={() => {
                                    setIsDrawerOpen(false);
                                    document.body.style.overflow = "";
                                }}
                                className="p-2 md:p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-600 transition-all border border-slate-100 shadow-sm shrink-0"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                            {(() => {
                                const entries = Object.entries(editData).filter(([key]) => key !== 'artist' && key !== 'filmography');

                                if (tableName === 'filmographydetail') {
                                    const getSortScore = (key: string) => {
                                        if (key === 'artist_id') return -2;
                                        if (key === 'id') return -3;
                                        if (key === 'filmography_id') return -1;

                                        const match = key.match(/^(tag|engage|link|tagtrailer|engagetrailer|linktrailer|tagspecial|engagespecial|linkspecial)(\d+)?$/);
                                        if (!match) return 999;

                                        const prefix = match[1];
                                        const numStr = match[2];

                                        let base = 0;
                                        if (prefix.includes('trailer')) {
                                            base = 10;
                                        } else if (prefix.includes('special')) {
                                            base = 15;
                                        } else if (numStr) {
                                            base = (parseInt(numStr) * 10) + 10;
                                        }
                                        return base;
                                    };

                                    entries.sort((a, b) => getSortScore(a[0]) - getSortScore(b[0]));
                                } else if (tableName === 'filmographytrends') {
                                    const getSortScore = (key: string) => {
                                        if (key === 'artist_id') return -2;
                                        if (key === 'id') return -3;
                                        if (key === 'filmography_id') return -1;

                                        const match = key.match(/^(tag|engage|link|tagtrailer|engagetrailer|linktrailer|tagspecial|engagespecial|linkspecial)(\d+)?$/);
                                        if (!match) return 999;

                                        const prefix = match[1];
                                        const numStr = match[2];

                                        let base = 0;
                                        if (prefix.includes('trailer')) {
                                            base = 10;
                                        } else if (prefix.includes('special')) {
                                            base = 15;
                                        } else if (numStr) {
                                            base = (parseInt(numStr) * 10) + 10;
                                        }
                                        return base;
                                    };

                                    entries.sort((a, b) => getSortScore(a[0]) - getSortScore(b[0]));
                                } else {
                                    // For other tables, prioritize artist_id
                                    entries.sort((a, b) => {
                                        if (a[0] === 'artist_id') return -1;
                                        if (b[0] === 'artist_id') return 1;
                                        return 0;
                                    });
                                }

                                return entries.map(([key, value], index) => {
                                    const isId = key === 'id';
                                    const isArtistId = key === 'artist_id';
                                    const isFilmographyId = key === 'filmography_id';
                                    const isDate = key.includes('date');
                                    const isImageUrl = key.includes('url') || key.includes('image');

                                    // Special Header for Filmography Detail Groups
                                    let sectionHeader = null;
                                    if (tableName === 'filmographydetail') {
                                        const currentMatch = key.match(/\d+$/);
                                        const currentNum = currentMatch ? currentMatch[0] : (key.includes('trailer') ? 'Trailer' : (key.includes('special') ? 'Special' : null));

                                        const prevKey = index > 0 ? entries[index - 1][0] : null;
                                        const prevMatch = prevKey?.match(/\d+$/);
                                        const prevNum = prevMatch ? prevMatch[0] : (prevKey?.includes('trailer') ? 'Trailer' : (prevKey?.includes('special') ? 'Special' : null));

                                        if (currentNum && currentNum !== prevNum) {
                                            sectionHeader = (
                                                <div className="pt-6 pb-2 border-b border-slate-100 mb-4 first:pt-0">
                                                    <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest">
                                                        {currentNum === 'Trailer' ? 'Official Trailer Section' : (currentNum === 'Special' ? 'Special Section' : `Episode ${currentNum} Section`)}
                                                    </h3>
                                                </div>
                                            );
                                        }
                                    }

                                    return (
                                        <div key={key}>
                                            {sectionHeader}
                                            <div className="space-y-2 mb-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                                    {key.replace('_', ' ')}
                                                </label>

                                                {isArtistId ? (
                                                    <select
                                                        value={String(value ?? '')}
                                                        onChange={(e) => handleInputChange(key, e.target.value ? Number(e.target.value) : null)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold text-slate-700"
                                                    >
                                                        <option value="">เลือกศิลปิน</option>
                                                        {artists.map(a => (
                                                            <option key={a.id} value={a.id}>{a.name}</option>
                                                        ))}
                                                    </select>
                                                ) : isFilmographyId ? (
                                                    <select
                                                        value={String(value ?? '')}
                                                        onChange={(e) => handleInputChange(key, e.target.value ? Number(e.target.value) : null)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold text-slate-700"
                                                    >
                                                        <option value="">เลือกผลงาน</option>
                                                        {filmographies.map(f => (
                                                            <option key={f.id} value={f.id}>{f.title}</option>
                                                        ))}
                                                    </select>
                                                ) : typeof value === 'boolean' ? (
                                                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                                        <input
                                                            type="checkbox"
                                                            id={key}
                                                            checked={value}
                                                            onChange={(e) => handleInputChange(key, e.target.checked)}
                                                            className="w-6 h-6 rounded-lg text-indigo-600 focus:ring-indigo-600 border-slate-300 transition-all"
                                                        />
                                                        <label htmlFor={key} className="font-bold text-slate-700 select-none cursor-pointer">
                                                            {value ? 'เปิดใช้งาน (Enabled)' : 'ปิดใช้งาน (Disabled)'}
                                                        </label>
                                                    </div>
                                                ) : (tableName === 'contents' && key === 'type') ? (
                                                    <div className="relative group">
                                                        <select
                                                            value={String(value ?? '')}
                                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold text-slate-700"
                                                        >
                                                            <option value="">เลือกประเภทคอนเทนต์</option>
                                                            {['Online Shows', 'Special', 'BTS', 'Press Tour', 'Press Cons', 'Reaction', 'Live', 'Live Event', 'Interview'].map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ) : (tableName === 'performance' && key === 'type') ? (
                                                    <div className="relative group">
                                                        <select
                                                            value={String(value ?? '')}
                                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold text-slate-700"
                                                        >
                                                            <option value="">เลือกประเภทคอนเทนต์</option>
                                                            {['Performance', 'Cover', 'Music Video'].map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ) : (tableName === 'awards' && key === 'result') ? (
                                                    <div className="relative group">
                                                        <select
                                                            value={String(value ?? '')}
                                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold text-slate-700"
                                                        >
                                                            <option value="">เลือกผลรางวัล</option>
                                                            {['Nominated', 'Received'].map(opt => (
                                                                <option key={opt} value={opt}>{opt === 'Nominated' ? '🌟 Nominated (เข้าชิง)' : '🏆 Received (ได้รับ)'}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ) : isDate ? (
                                                    <div className="relative group">
                                                        <input
                                                            type="date"
                                                            value={String(value ?? '').split('T')[0]}
                                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold text-slate-700"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="relative group">
                                                        {isImageUrl && value ? (
                                                            <div className="mb-4">
                                                                <img src={value as string} alt="" className="max-h-48 w-full object-cover rounded-2xl border border-slate-200 shadow-md" />
                                                            </div>
                                                        ) : null}
                                                        <textarea
                                                            value={String(value ?? '')}
                                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                                            disabled={isId}
                                                            rows={isImageUrl || key === 'description' ? 3 : 1}
                                                            className={`w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-medium text-slate-700 ${isId ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}`}
                                                            placeholder={`ระบุ ${key}...`}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-white flex gap-4">
                            <button
                                onClick={() => {
                                    setIsDrawerOpen(false);
                                    document.body.style.overflow = "";
                                }}
                                className="flex-1 py-4 px-6 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-2 py-4 px-6 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 transform active:scale-95"
                            >
                                {saving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Save size={20} />
                                        {isAddMode ? 'สร้างข้อมูลใหม่' : 'บันทึกการแก้ไข'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagementPage;
