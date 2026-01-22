import { MapPin, Clock } from 'lucide-react';
import type { CalendarEvent } from './CalendarModal';
import { getArtistTheme, getDOWTheme } from '../utils/theme';

interface CalendarCardProps {
    event: CalendarEvent;
    onClick: (event: CalendarEvent) => void;
}

const CalendarCard = ({ event, onClick }: CalendarCardProps) => {
    // Logic การดึงชื่อศิลปินที่รองรับทั้ง Object และ Array
    const artistName = Array.isArray(event.artist)
        ? event.artist[0]?.name
        : event.artist?.name;
    const artistTheme = getArtistTheme(artistName || 'Unknown');
    const dowTheme = getDOWTheme(event.date);

    return (
        <div
            onClick={() => onClick(event)}
            className="group relative bg-card-bg rounded-4xl overflow-hidden cursor-pointer border border-brand-sidebar-border hover:border-brand-accent-light hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 flex flex-col shadow-sm hover:-translate-y-1"
        >
            <div className="relative aspect-4/3 overflow-hidden">
                <img
                    src={event.poster_url || 'https://via.placeholder.com/400x300'}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <div className={`absolute top-4 left-4 ${dowTheme} text-white rounded-2xl p-2 min-w-[55px] flex flex-col items-center shadow-md backdrop-blur-sm`}>
                    <span className="text-[10px] font-bold uppercase leading-none mb-1 opacity-90">{event.date ? new Date(event.date).toLocaleString('default', { month: 'short' }) : '-'}</span>
                    <span className="text-2xl font-black leading-none">{event.date ? new Date(event.date).getDate() : '-'}</span>
                </div>
            </div>

            <div className="p-5 flex flex-col grow bg-card-bg">
                <div className="mb-2">
                    <span className={`${artistTheme.text} ${artistTheme.border} ${artistTheme.bg} inline-block w-fit px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase border rounded-full`}>
                        {artistName || 'Unknown'}
                    </span>
                </div>
                <h3 className="text-content-text-main text-base font-bold leading-snug mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
                    {event.name}
                </h3>
                <div className="mt-auto flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-page-bg rounded-full text-content-text-sub text-xs font-medium border border-brand-sidebar-border">
                        <Clock className="w-3 h-3 text-brand-primary" /> {event.time || 'TBA'}
                    </div>
                    {(event.location || event.live_platform) && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-page-bg rounded-full text-content-text-sub text-xs font-medium border border-brand-sidebar-border">
                            <MapPin className="w-3 h-3 text-brand-primary" /> {event.location || event.live_platform}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarCard;