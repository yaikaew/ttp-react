import { useEffect } from 'react';
import { X, MapPin, Clock, Video, Megaphone, KeyRound, User, Hash, PlayCircle, CalendarPlus } from 'lucide-react';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';
// ประกาศ Interface สำหรับใช้งานร่วมกัน
export interface CalendarEvent {
    datetimetz: string  // timestamp with time zone (ใช้แทน date และ time)
    dmd: string | null
    hashtag: string | null
    id: number
    info_link: string | null
    keyword: string | null
    live_platform: string | null
    location: string | null
    name: string
    note: string | null
    outfit: string | null
    outfit_img: string | null
    poster_url: string | null
    rerun_link: string | null
    type: string | null
    artist: { name: string } | { name: string }[] | null;
}



interface CalendarModalProps {
    event: CalendarEvent | null;
    onClose: () => void;
}

const getEventDescription = (item: CalendarEvent) => {
    const lines = [];
    const artistName = Array.isArray(item.artist)
        ? item.artist[0]?.name
        : item.artist?.name;

    if (artistName) lines.push(`🙋🏻‍♂️ : ${artistName}`);
    if (item.location) lines.push(`📍 : ${item.location}`);
    if (item.live_platform) lines.push(`🎥 : ${item.live_platform}`);
    if (item.note) lines.push(`📢 : ${item.note}`);

    if (item.keyword || item.hashtag) lines.push("");

    if (item.keyword) lines.push(`🔑 : ${item.keyword}`);
    if (item.hashtag) lines.push(`#️⃣ : ${item.hashtag}`);

    if (item.rerun_link) lines.push("");
    if (item.rerun_link) lines.push(`🔗 : ${item.rerun_link}`);

    return lines.join('\n');
};

const generateGoogleUrl = (item: CalendarEvent) => {
    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const desc = encodeURIComponent(getEventDescription(item));
    const title = encodeURIComponent(item.name);
    const loc = encodeURIComponent(item.location || '');

    const dt = new Date(item.datetimetz);
    const hours = dt.getHours();
    const minutes = dt.getMinutes();
    const hasTime = !(hours === 0 && minutes === 0);

    let dates = "";
    if (hasTime) {
        // มีเวลา - ใช้ timestamp โดยตรง
        const dateStr = dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        dates = `${dateStr}/${dateStr}`;
    } else {
        // ไม่มีเวลา - ใช้เป็น all-day event
        const endDate = new Date(dt);
        endDate.setDate(dt.getDate() + 1);
        const startStr = dt.toISOString().split('T')[0].replace(/-/g, '');
        const endStr = endDate.toISOString().split('T')[0].replace(/-/g, '');
        dates = `${startStr}/${endStr}`;
    }

    return `${baseUrl}&text=${title}&details=${desc}&location=${loc}&dates=${dates}&ctz=Asia/Bangkok`;
};

const CalendarModal = ({ event, onClose }: CalendarModalProps) => {
    useEffect(() => {
        if (event) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [event]);

    if (!event) return null;

    const artistName = Array.isArray(event.artist)
        ? event.artist[0]?.name
        : event.artist?.name;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-brand-secondary/30 backdrop-blur-md animate-in fade-in duration-300">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            {/* Modal Content */}
            <div className="bg-card-bg w-full max-w-2xl max-h-[90vh] rounded-4xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">

                <button
                    onClick={onClose}
                    className="absolute top-10 right-10 w-10 h-10 flex items-center justify-center rounded-full bg-page-bg text-content-text-muted hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-sm hover:rotate-90"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="overflow-y-auto">
                    {/* Poster Image - กว้างเต็มและความสูงตามรูปภาพ */}
                    {event.poster_url && (
                        <div className="w-full"> {/* ขยับรูปขึ้นไปแทนที่ช่องว่างของปุ่ม Close */}
                            <img
                                src={event.poster_url}
                                alt={event.name}
                                className="w-full h-auto block object-contain"
                            />
                        </div>
                    )}

                    <div className="p-8 sm:p-10">
                        <div className="mb-6">
                            <h2 className="text-xl md:text-2xl font-black text-content-text-main leading-tight">
                                {event.name}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-slate-600">
                            <div className="flex items-center gap-3 font-medium">
                                <div className="p-2 bg-brand-primary-light rounded-xl text-brand-primary">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-content-text-muted font-black">
                                        Date & Time
                                    </p>
                                    <p className="text-content-text-main font-bold">
                                        {new Date(event.datetimetz).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                    </p>
                                    <p className="text-sm text-content-text-sub">
                                        {(() => {
                                            const dt = new Date(event.datetimetz);
                                            const hours = dt.getHours();
                                            const minutes = dt.getMinutes();
                                            // ถ้าเวลาเป็น 00:00 ถือว่าไม่มีเวลา (TBA)
                                            if (hours === 0 && minutes === 0) return 'TBA';
                                            return dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                                        })()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-medium">
                                <div className="p-2 bg-brand-primary-light rounded-xl text-brand-primary">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-content-text-muted font-black">Artist</p>
                                    <p className="text-content-text-main font-bold">{artistName || ''}</p>
                                </div>
                            </div>

                            {/* Keyword - เปลี่ยนสี Link ให้เข้ากับแบรนด์ */}
                            <div className="flex items-center gap-3 font-medium">
                                <div className="p-2 bg-brand-primary-light rounded-xl text-brand-primary">
                                    <KeyRound className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-content-text-muted font-black">Keyword</p>
                                    {event.keyword ? (
                                        <a
                                            href={`https://x.com/search?q=%22${encodeURIComponent(event.keyword)}%22&src=typed_query&f=top`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline text-brand-primary font-bold"
                                        >
                                            {event.keyword}
                                        </a>
                                    ) : <p className="text-content-text-main">-</p>}
                                </div>
                            </div>

                            {/* Hashtag */}
                            <div className="flex items-center gap-3 font-medium">
                                <div className="p-2 bg-brand-primary-light rounded-xl text-brand-primary">
                                    <Hash className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-content-text-muted font-black">Hashtag</p>
                                    {event.hashtag ? (
                                        <a
                                            href={`https://x.com/search?q=${encodeURIComponent(event.hashtag)}&src=typed_query&f=top`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline text-brand-primary font-bold"
                                        >
                                            {event.hashtag}
                                        </a>
                                    ) : <p className="text-content-text-main">-</p>}
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-3 font-medium">
                                <div className="p-2 bg-brand-primary-light rounded-xl text-brand-primary">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-content-text-muted font-black">Location</p>
                                    <p className="text-content-text-main font-bold">{event.location || '-'}</p>
                                </div>
                            </div>

                            {/* Platform */}
                            <div className="flex items-center gap-3 font-medium">
                                <div className="p-2 bg-brand-primary-light rounded-xl text-brand-primary">
                                    <Video className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-content-text-muted font-black">Platform</p>
                                    <p className="text-content-text-main font-bold">{event.live_platform || '-'}</p>
                                </div>
                            </div>
                            {event.note && (
                                <div className="md:col-span-2 p-4 bg-note-bg rounded-2xl border border-note-border italic text-sm text-note-text flex items-start gap-3 mt-2">
                                    <Megaphone className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                                    <span className="leading-relaxed">{event.note}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex gap-4 pt-4 border-t border-brand-primary-light">
                            {event.rerun_link && (
                                <Button
                                    variant="primary"
                                    size="lg"
                                    href={event.rerun_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    icon={PlayCircle}
                                    className="grow rounded-full h-11"
                                >
                                    รับชมย้อนหลัง
                                </Button>
                            )}

                            <IconButton
                                href={generateGoogleUrl(event)}
                                icon={CalendarPlus}
                                className="ml-auto w-11 h-11 rounded-xl hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;