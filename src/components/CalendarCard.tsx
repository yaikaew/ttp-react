import { useState, useEffect } from 'react';
import { MapPin, Clock, Hash, KeyRoundIcon, PlayCircle, Video, ChevronDown, Edit, Trash2, Megaphone } from 'lucide-react';
import { getArtistTheme, getDOWTheme } from '../utils/theme';
import { getTimeFromDatetimetz } from '../utils/calendarHelpers';
import { Button } from '../components/Button';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { calendarService } from '../services/calendarService';

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
    onEventUpdate?: () => void;
}

const CalendarCard = ({ event, onEventUpdate }: CalendarCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        id: event.id,
        artist_id: event.artist_id,
        name: event.name,
        datetimetz: event.datetimetz,
        location: event.location || '',
        live_platform: event.live_platform || '',
        keyword: event.keyword || '',
        hashtag: event.hashtag || '',
        rerun_link: event.rerun_link || '',
        info_link: event.info_link || '',
        note: event.note || '',
        outfit: event.outfit || '',
        outfit_img: event.outfit_img || '',
        poster_url: event.poster_url || '',
        dmd: event.dmd || '',
    });
    const [artists, setArtists] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        const loadArtists = async () => {
            try {
                const artistData = await calendarService.getArtists();
                setArtists(artistData);
            } catch (error) {
                console.error('Failed to load artists:', error);
            }
        };
        loadArtists();
    }, []);

    // Lock scroll when modal is open
    useEffect(() => {
        if (isEditModalOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        // Cleanup on unmount
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isEditModalOpen]);

    const { user } = useAdminAuth();

    const artistName = Array.isArray(event.artist)
        ? event.artist[0]?.name
        : event.artist?.name;
    const artistTheme = getArtistTheme(artistName || 'Unknown');

    const eventDate = new Date(event.datetimetz);
    const dowTheme = getDOWTheme(event.datetimetz);
    const eventTime = getTimeFromDatetimetz(event.datetimetz);

    const today = new Date();
    
    const isToday = 
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear();

    const hasMoreInfo = event.keyword || event.hashtag || event.rerun_link || event.note;

    const handleEdit = async () => {
        try {
            await calendarService.updateEvent(event.id, editForm);
            setIsEditModalOpen(false);
            onEventUpdate?.();
        } catch (error) {
            console.error('Failed to update event:', error);
            alert('Failed to update event');
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this event?')) {
            try {
                await calendarService.deleteEvent(event.id);
                onEventUpdate?.();
            } catch (error) {
                console.error('Failed to delete event:', error);
                alert('Failed to delete event');
            }
        }
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
                            {eventDate.toLocaleString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black leading-none">
                            {eventDate.getDate()}
                        </span>
                    </div>
                </div>

                {/* ข้อมูลพื้นฐาน */}
                <div className="pt-4 border-t border-brand-sidebar-border/50">
                    <div className="flex flex-row items-start justify-between gap-2">
                        {/* ฝั่งซ้าย: ข้อมูลเรียงลงมาเป็นแนวตั้ง */}
                        <div className="flex flex-col gap-2 flex-grow">
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
                        </div>

                        {/* ฝั่งขวา: ปุ่มลูกศร และปุ่ม admin */}
                        <div className="flex items-start pt-1 gap-2">
                            {user && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditForm({
                                                id: event.id,
                                                artist_id: event.artist_id,
                                                name: event.name,
                                                datetimetz: event.datetimetz,
                                                location: event.location || '',
                                                live_platform: event.live_platform || '',
                                                keyword: event.keyword || '',
                                                hashtag: event.hashtag || '',
                                                rerun_link: event.rerun_link || '',
                                                info_link: event.info_link || '',
                                                note: event.note || '',
                                                outfit: event.outfit || '',
                                                outfit_img: event.outfit_img || '',
                                                poster_url: event.poster_url || '',
                                                dmd: event.dmd || '',
                                            });
                                            setIsEditModalOpen(true);
                                        }}
                                        className="p-1.5 rounded-full bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 transition-all duration-300"
                                        title="Edit event"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete();
                                        }}
                                        className="p-1.5 rounded-full bg-red-500/20 text-red-600 hover:bg-red-500/30 transition-all duration-300"
                                        title="Delete event"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </>
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
                            <div className="flex flex-wrap gap-2">
                                {event.note && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-page-bg/50 rounded-xl text-content-text-sub text-xs font-medium border border-brand-sidebar-border/50">
                                        <Megaphone className="w-3.5 h-3.5 text-brand-primary" />
                                        {event.note}
                                    </div>
                                )}
                            </div>

                            {event.rerun_link && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    href={event.rerun_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    icon={PlayCircle}
                                    className="w-full rounded-2xl h-10"
                                >
                                    รับชมย้อนหลัง
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card-bg rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-brand-sidebar-border">
                        <h2 className="text-xl font-bold text-content-text-main mb-6">Edit Event</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-content-text-main mb-2">Artist *</label>
                                <select
                                    value={editForm.artist_id}
                                    onChange={(e) => setEditForm({...editForm, artist_id: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 bg-page-bg border border-brand-sidebar-border rounded-xl text-content-text-main"
                                    required
                                >
                                    <option value="">Select Artist</option>
                                    {artists.map((artist) => (
                                        <option key={artist.id} value={artist.id}>
                                            {artist.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-content-text-main mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full px-3 py-2 bg-page-bg border border-brand-sidebar-border rounded-xl text-content-text-main"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-content-text-main mb-2">Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    value={editForm.datetimetz.slice(0, 16)}
                                    onChange={(e) => setEditForm({...editForm, datetimetz: e.target.value + ':00+00'})}
                                    className="w-full px-3 py-2 bg-page-bg border border-brand-sidebar-border rounded-xl text-content-text-main"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-content-text-main mb-2">Location</label>
                                <input
                                    type="text"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                    className="w-full px-3 py-2 bg-page-bg border border-brand-sidebar-border rounded-xl text-content-text-main"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-content-text-main mb-2">Live Platform</label>
                                <input
                                    type="text"
                                    value={editForm.live_platform}
                                    onChange={(e) => setEditForm({...editForm, live_platform: e.target.value})}
                                    className="w-full px-3 py-2 bg-page-bg border border-brand-sidebar-border rounded-xl text-content-text-main"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-content-text-main mb-2">Keyword</label>
                                <input
                                    type="text"
                                    value={editForm.keyword}
                                    onChange={(e) => setEditForm({...editForm, keyword: e.target.value})}
                                    className="w-full px-3 py-2 bg-page-bg border border-brand-sidebar-border rounded-xl text-content-text-main"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-content-text-main mb-2">Hashtag</label>
                                <input
                                    type="text"
                                    value={editForm.hashtag}
                                    onChange={(e) => setEditForm({...editForm, hashtag: e.target.value})}
                                    className="w-full px-3 py-2 bg-page-bg border border-brand-sidebar-border rounded-xl text-content-text-main"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-content-text-main mb-2">Rerun Link</label>
                                <input
                                    type="url"
                                    value={editForm.rerun_link}
                                    onChange={(e) => setEditForm({...editForm, rerun_link: e.target.value})}
                                    className="w-full px-3 py-2 bg-page-bg border border-brand-sidebar-border rounded-xl text-content-text-main"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-content-text-main mb-2">Info Link</label>
                                <input
                                    type="url"
                                    value={editForm.info_link}
                                    onChange={(e) => setEditForm({...editForm, info_link: e.target.value})}
                                    className="w-full px-3 py-2 bg-page-bg border border-brand-sidebar-border rounded-xl text-content-text-main"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-content-text-main mb-2">Note</label>
                                <textarea
                                    value={editForm.note}
                                    onChange={(e) => setEditForm({...editForm, note: e.target.value})}
                                    className="w-full px-3 py-2 bg-page-bg border border-brand-sidebar-border rounded-xl text-content-text-main"
                                    rows={3}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-content-text-main mb-2">Outfit</label>
                                <input
                                    type="text"
                                    value={editForm.outfit}
                                    onChange={(e) => setEditForm({...editForm, outfit: e.target.value})}
                                    className="w-full px-3 py-2 bg-page-bg border border-brand-sidebar-border rounded-xl text-content-text-main"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-content-text-main mb-2">Outfit Image URL</label>
                                <input
                                    type="url"
                                    value={editForm.outfit_img}
                                    onChange={(e) => setEditForm({...editForm, outfit_img: e.target.value})}
                                    className="w-full px-3 py-2 bg-page-bg border border-brand-sidebar-border rounded-xl text-content-text-main"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-content-text-main mb-2">Poster URL</label>
                                <input
                                    type="url"
                                    value={editForm.poster_url}
                                    onChange={(e) => setEditForm({...editForm, poster_url: e.target.value})}
                                    className="w-full px-3 py-2 bg-page-bg border border-brand-sidebar-border rounded-xl text-content-text-main"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-content-text-main mb-2">DMD</label>
                                <input
                                    type="text"
                                    value={editForm.dmd}
                                    onChange={(e) => setEditForm({...editForm, dmd: e.target.value})}
                                    className="w-full px-3 py-2 bg-page-bg border border-brand-sidebar-border rounded-xl text-content-text-main"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="secondary"
                                as="button"
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                as="button"
                                onClick={handleEdit}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarCard;