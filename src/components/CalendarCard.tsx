import { useState, useEffect } from 'react';
import { MapPin, Clock, Hash, KeyRoundIcon, PlayCircle, Video, ChevronDown, Megaphone, CalendarPlus, Edit } from 'lucide-react';
import { getArtistTheme, getDOWTheme } from '../utils/theme';
import { calendarService } from '../services/calendarService';

const parseDatetimetz = (value: string) => {
    const normalized = value.replace(' ', 'T');
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? new Date(value) : date;
};

const getTimeFromDatetimetz = (value: string) => {
    const date = parseDatetimetz(value);
    const rawTime = date.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Bangkok',
    });
    return rawTime === '00:00' ? 'TBA' : rawTime;
};

const formatToDatetimeLocal = (value: string) => {
    const date = new Date(value);
    const offsetMinutes = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offsetMinutes * 60000);
    return local.toISOString().slice(0, 16);
};

const parseFromDatetimeLocal = (value: string) => {
    return new Date(value).toISOString();
};

export interface CalendarEvent {
    artist_id: number;
    datetimetz: string;
    dmd: string | null;
    hashtag: string | null;
    id: number;
    info_link: string | null;
    keyword: string | null;
    live_platform: string | null;
    location: string | null;
    name: string;
    note: string | null;
    outfit: string | null;
    outfit_img: string | null;
    poster_url: string | null;
    rerun_link: string | null;
    type: string | null;
    artist: { name: string } | { name: string }[] | null;
}

interface CalendarCardProps {
    event: CalendarEvent;
    isEditable?: boolean;
    onUpdated?: () => void;
}

const CalendarCard = ({ event, isEditable = false, onUpdated }: CalendarCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventDetails, setEventDetails] = useState<CalendarEvent | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);
    const [artistOptions, setArtistOptions] = useState<Array<{ id: number; name: string }>>([]);
    const [editedArtistId, setEditedArtistId] = useState<number>(event.artist_id);
    const [editedName, setEditedName] = useState(event.name);
    const [editedDatetimetz, setEditedDatetimetz] = useState(formatToDatetimeLocal(event.datetimetz));
    const [editedLocation, setEditedLocation] = useState(event.location ?? '');
    const [editedLivePlatform, setEditedLivePlatform] = useState(event.live_platform ?? '');
    const [editedPosterUrl, setEditedPosterUrl] = useState(event.poster_url ?? '');
    const [editedKeyword, setEditedKeyword] = useState(event.keyword ?? '');
    const [editedHashtag, setEditedHashtag] = useState(event.hashtag ?? '');
    const [editedInfoLink, setEditedInfoLink] = useState(event.info_link ?? '');
    const [editedRerunLink, setEditedRerunLink] = useState(event.rerun_link ?? '');
    const [editedNote, setEditedNote] = useState(event.note ?? '');
    const [editedDmd, setEditedDmd] = useState(event.dmd ?? '');
    const [editedOutfit, setEditedOutfit] = useState(event.outfit ?? '');
    const [editedOutfitImg, setEditedOutfitImg] = useState(event.outfit_img ?? '');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    const artistName = Array.isArray(event.artist)
        ? event.artist[0]?.name
        : event.artist?.name;
    const artistTheme = getArtistTheme(artistName || 'Unknown');

    const dowTheme = getDOWTheme(event.datetimetz);
    const eventTime = getTimeFromDatetimetz(event.datetimetz);

    const eventMonth = new Date(event.datetimetz).toLocaleString('en-US', {
        month: 'short',
        timeZone: 'Asia/Bangkok',
    });
    const eventDay = new Date(event.datetimetz).toLocaleString('en-US', {
        day: '2-digit',
        timeZone: 'Asia/Bangkok',
    });

    const todayBangkok = new Date().toLocaleString('en-GB', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const eventBangkok = new Date(event.datetimetz).toLocaleString('en-GB', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    const isToday = eventBangkok === todayBangkok;

    const hasMoreInfo = event.keyword || event.hashtag || event.rerun_link;

    const handleOpenEditModal = async () => {
        setIsModalOpen(true);
        setDetailsError(null);
        setDetailsLoading(true);

        try {
            const [details, artists] = await Promise.all([
                calendarService.getEventById(event.id),
                calendarService.getArtists(),
            ]);
            setEventDetails(details);
            setArtistOptions(artists.sort((a, b) => a.name.localeCompare(b.name)));
            setEditedArtistId(details.artist_id);
            setEditedName(details.name);
            setEditedDatetimetz(formatToDatetimeLocal(details.datetimetz));
            setEditedLocation(details.location ?? '');
            setEditedLivePlatform(details.live_platform ?? '');
            setEditedPosterUrl(details.poster_url ?? '');
            setEditedKeyword(details.keyword ?? '');
            setEditedHashtag(details.hashtag ?? '');
            setEditedInfoLink(details.info_link ?? '');
            setEditedRerunLink(details.rerun_link ?? '');
            setEditedNote(details.note ?? '');
            setEditedDmd(details.dmd ?? '');
            setEditedOutfit(details.outfit ?? '');
            setEditedOutfitImg(details.outfit_img ?? '');
        } catch (err) {
            setDetailsError((err as Error).message);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleSave = async () => {
        setUpdateLoading(true);
        setUpdateError(null);

        try {
            await calendarService.updateEvent(event.id, {
                artist_id: editedArtistId,
                name: editedName,
                location: editedLocation || null,
                live_platform: editedLivePlatform || null,
                poster_url: editedPosterUrl || null,
                keyword: editedKeyword || null,
                hashtag: editedHashtag || null,
                info_link: editedInfoLink || null,
                rerun_link: editedRerunLink || null,
                note: editedNote || null,
                dmd: editedDmd || null,
                outfit: editedOutfit || null,
                outfit_img: editedOutfitImg || null,
                datetimetz: parseFromDatetimeLocal(editedDatetimetz),
            });
            setIsModalOpen(false);
            onUpdated?.();
        } catch (err) {
            setUpdateError((err as Error).message);
        } finally {
            setUpdateLoading(false);
        }
    };

    const getGoogleCalendarUrl = () => {
        const detailsParts: string[] = [];

        const displayArtistName = artistName === 'TeeteePor' ? 'Teetee Por' : artistName;
        if (displayArtistName) detailsParts.push(`🙋🏻‍♂️ : ${displayArtistName}`);
        if (event.location) detailsParts.push(`📍 : ${event.location}`);
        if (event.live_platform) detailsParts.push(`🎥 : ${event.live_platform}`);
        if (event.note) detailsParts.push(`📢 : ${event.note}`);

        const group2: string[] = [];
        if (event.keyword) group2.push(`🔑 : ${event.keyword}`);
        if (event.hashtag) group2.push(`#️⃣ : ${event.hashtag}`);
        if (group2.length > 0) {
            if (detailsParts.length > 0) detailsParts.push('');
            detailsParts.push(...group2);
        }

        if (event.rerun_link) {
            if (detailsParts.length > 0) detailsParts.push('');
            detailsParts.push(`🔗 : ${event.rerun_link}`);
        }

        const details = detailsParts.join('\n');

        const startDate = new Date(event.datetimetz);
        // Set duration to be the same as start time
        const endDate = new Date(startDate.getTime());

        const formatToGoogleCalendarDate = (date: Date) => {
            return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
        };

        const dates = `${formatToGoogleCalendarDate(startDate)}/${formatToGoogleCalendarDate(endDate)}`;

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${dates}&details=${encodeURIComponent(details)}${event.location ? `&location=${encodeURIComponent(event.location)}` : ''}`;
    };

    return (
        <div
            className=
            {`self-start group relative bg-card-bg rounded-3xl overflow-hidden border border-brand-sidebar-border hover:border-brand-accent-light hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-500 flex flex-col shadow-sm
                    ${isToday
                    ? 'border-red-500 shadow-md shadow-red-500/10' // ถ้าเป็นวันนี้: กรอบแดง
                    : 'border-brand-sidebar-border hover:border-brand-accent-light' // ถ้าไม่ใช่: กรอบปกติ
                }
                    ${isExpanded ? 'shadow-xl' : ''}
                `}
        >
            <div className="p-5 flex flex-col gap-4">

                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col min-h-[80px]"> {/* กำหนด min-h เพื่อให้ชื่อสั้น/ยาวดูไม่ต่างกันมาก */}
                        <span className={`${artistTheme.text} ${artistTheme.border} ${artistTheme.bg} inline-block w-fit px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase border rounded-full mb-2`}>
                            {artistName || 'Unknown'}
                        </span>
                        <h3 className="text-content-text-main text-lg font-bold leading-tight group-hover:text-brand-primary transition-colors">
                            {event.name}
                        </h3>
                    </div>

                    <div className={`${dowTheme} text-white rounded-2xl p-2 min-w-[55px] flex flex-col items-center shadow-md shrink-0`}>
                        <span className="text-[10px] font-bold uppercase leading-none mb-1 opacity-90">
                            {eventMonth}
                        </span>
                        <span className="text-xl font-black leading-none">
                            {eventDay}
                        </span>
                    </div>
                </div>

                {/* ข้อมูลพื้นฐาน */}
                <div className="pt-4 border-t border-brand-sidebar-border/50">
                    <div className="flex flex-row items-start justify-between gap-2">
                        {/* ฝั่งซ้าย: ข้อมูลเรียงลงมาเป็นแนวตั้ง */}
                        <div className="flex flex-col gap-2 grow">
                            {/* เวลา */}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 w-fit bg-page-bg/50 rounded-xl text-content-text-sub text-xs font-medium border border-brand-sidebar-border/50">
                                <Clock className="w-3.5 h-3.5 text-brand-primary" />
                                <span>{eventTime || 'TBA'}</span>
                            </div>

                            {/* สถานที่ */}
                            {event.location && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 w-fit bg-page-bg/50 rounded-xl text-content-text-sub text-xs font-medium border border-brand-sidebar-border/50">
                                    <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                                    <span>{event.location}</span>
                                </div>
                            )}

                            {/* แพลตฟอร์มไลฟ์ */}
                            {event.live_platform && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 w-fit bg-page-bg/50 rounded-xl text-content-text-sub text-xs font-medium border border-brand-sidebar-border/50">
                                    <Video className="w-3.5 h-3.5 text-brand-primary" />
                                    <span>{event.live_platform}</span>
                                </div>
                            )}

                            {event.note && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 w-fit bg-page-bg/50 rounded-xl text-content-text-sub text-xs font-medium border border-brand-sidebar-border/50">
                                    <Megaphone className="w-3.5 h-3.5 text-brand-primary" />
                                    {event.note}
                                </div>
                            )}
                        </div>

                        {/* ฝั่งขวา: ปุ่มลูกศร และปุ่ม admin */}
                        <div className="flex items-start pt-1 gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(getGoogleCalendarUrl(), '_blank');
                                }}
                                className="p-1.5 rounded-full bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all duration-300"
                                title="Add to Calendar"
                            >
                                <CalendarPlus className="w-4 h-4" />
                            </button>
                            {isEditable && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenEditModal();
                                    }}
                                    className="p-1.5 rounded-full bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 transition-all duration-300"
                                    title="Edit event"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                            )}
                            {hasMoreInfo && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsExpanded(!isExpanded);
                                    }}
                                    className={`p-1.5 rounded-full transition-all duration-300 ${isExpanded
                                        ? 'bg-brand-primary text-white rotate-180'
                                        : 'bg-brand-sidebar-border/30 text-content-text-sub hover:bg-brand-primary/20'
                                        }`}
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ข้อมูลเพิ่มเติม: เมื่อกางออก ความสูงของ div นี้จะดันขอบล่างของ Card ลงไปจริงๆ */}
                    {isExpanded && (
                        <div className="mt-4 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex flex-wrap gap-2">
                                {event.keyword && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-page-bg/50 rounded-xl text-content-text-sub text-xs font-medium border border-brand-sidebar-border/50">
                                        <KeyRoundIcon className="w-3.5 h-3.5 text-brand-primary" />
                                        <a href={`https://x.com/search?q=%22${encodeURIComponent(event.keyword)}%22&f=top`} target="_blank" rel="noreferrer" className="hover:underline text-brand-primary font-bold">
                                            {event.keyword}
                                        </a>
                                    </div>
                                )}
                                {event.hashtag && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-page-bg/50 rounded-xl text-content-text-sub text-xs font-medium border border-brand-sidebar-border/50">
                                        <Hash className="w-3.5 h-3.5 text-brand-primary" />
                                        <a href={`https://x.com/search?q=${encodeURIComponent(event.hashtag)}&f=top`} target="_blank" rel="noreferrer" className="hover:underline text-brand-primary font-bold">
                                            {event.hashtag}
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {event.rerun_link && (
                                    <a
                                        href={event.rerun_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all duration-300 text-xs font-medium"
                                        title="Watch rerun"
                                    >
                                        <PlayCircle className="w-4 h-4" />
                                        <span>รับชมย้อนหลัง</span>
                                    </a>
                                )}

                                {/* {event.info_link && (
                                    <a
                                        href={event.info_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all duration-300 text-xs font-medium"
                                        title="Info"
                                    >
                                        <InfoIcon className="w-4 h-4" />
                                        <span>รายละเอียดเพิ่มเติม</span>
                                    </a>
                                )} */}
                            </div>
                        </div>
                    )}

                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                            <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10">
                                <div className="flex items-center justify-between border-b border-brand-sidebar-border/50 px-6 py-4">
                                    <div>
                                        <div className="text-lg font-bold">Edit Event</div>
                                        <div className="text-xs text-content-text-sub">{event.name}</div>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-xl font-black text-content-text-sub hover:text-content-text-main"
                                        title="Close"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="max-h-[70vh] overflow-y-auto p-6 space-y-5">
                                    {detailsLoading ? (
                                        <div className="text-sm text-content-text-sub">Loading event details...</div>
                                    ) : detailsError ? (
                                        <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
                                            {detailsError}
                                        </div>
                                    ) : eventDetails ? (
                                        <div className="space-y-5">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Artist</label>
                                                    <select
                                                        value={editedArtistId}
                                                        onChange={(e) => setEditedArtistId(Number(e.target.value))}
                                                        className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                                    >
                                                        {artistOptions.map((artist) => (
                                                            <option key={artist.id} value={artist.id}>
                                                                {artist.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Name</label>
                                                    <input
                                                        value={editedName}
                                                        onChange={(e) => setEditedName(e.target.value)}
                                                        className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Date / Time</label>
                                                    <input
                                                        type="datetime-local"
                                                        value={editedDatetimetz}
                                                        onChange={(e) => setEditedDatetimetz(e.target.value)}
                                                        className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Location</label>
                                                    <input
                                                        value={editedLocation}
                                                        onChange={(e) => setEditedLocation(e.target.value)}
                                                        className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Live platform</label>
                                                    <input
                                                        value={editedLivePlatform}
                                                        onChange={(e) => setEditedLivePlatform(e.target.value)}
                                                        className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Poster URL</label>
                                                    <input
                                                        value={editedPosterUrl}
                                                        onChange={(e) => setEditedPosterUrl(e.target.value)}
                                                        className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Keyword</label>
                                                    <input
                                                        value={editedKeyword}
                                                        onChange={(e) => setEditedKeyword(e.target.value)}
                                                        className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Hashtag</label>
                                                    <input
                                                        value={editedHashtag}
                                                        onChange={(e) => setEditedHashtag(e.target.value)}
                                                        className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Info link</label>
                                                    <input
                                                        value={editedInfoLink}
                                                        onChange={(e) => setEditedInfoLink(e.target.value)}
                                                        className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Rerun link</label>
                                                    <input
                                                        value={editedRerunLink}
                                                        onChange={(e) => setEditedRerunLink(e.target.value)}
                                                        className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Outfit</label>
                                                    <input
                                                        value={editedOutfit}
                                                        onChange={(e) => setEditedOutfit(e.target.value)}
                                                        className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Outfit Image URL</label>
                                                    <input
                                                        value={editedOutfitImg}
                                                        onChange={(e) => setEditedOutfitImg(e.target.value)}
                                                        className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">DMD</label>
                                                    <input
                                                        value={editedDmd}
                                                        onChange={(e) => setEditedDmd(e.target.value)}
                                                        className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.24em] text-content-text-muted">Note</label>
                                                    <textarea
                                                        value={editedNote}
                                                        onChange={(e) => setEditedNote(e.target.value)}
                                                        className="mt-2 w-full rounded-2xl border border-brand-sidebar-border/60 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                                    />
                                                </div>
                                            </div>

                                            {updateError && <div className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{updateError}</div>}

                                            <div className="flex flex-wrap justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsModalOpen(false)}
                                                    className="rounded-2xl border border-brand-sidebar-border/70 px-5 py-3 text-xs uppercase tracking-widest font-bold text-content-text-main hover:bg-brand-sidebar-border/20 transition"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSave}
                                                    disabled={updateLoading}
                                                    className="rounded-2xl bg-brand-primary px-3 py-3 text-xs uppercase tracking-widest font-bold text-white hover:bg-brand-primary/90 transition disabled:opacity-60"
                                                >
                                                    {updateLoading ? 'Saving...' : 'Save changes'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarCard;