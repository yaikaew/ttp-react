// components/VideoCard.tsx
import type { ThemeOption } from '../utils/theme';

interface VideoCardProps {
    link: string;
    img: string;
    title: string;
    date: string;
    artistName: string;
    type: string;
    note?: string;
    variant: 'performance' | 'content' | 'discography';
    artistTheme: ThemeOption;
    typeTheme?: ThemeOption;
}

export const VideoCard = ({
    link, img, title, date, artistName, type, note, variant, artistTheme, typeTheme
}: VideoCardProps) => {
    const isPerformance = variant === 'performance';
    const isDiscography = variant === 'discography';

    const styles = {
        cardBase: `group bg-card-bg rounded-3xl border border-card-border overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-primary-light/50 transition-all duration-500 flex flex-col`,
        imageContainer: "aspect-video bg-slate-100 overflow-hidden",
        image: "w-full h-full object-cover group-hover:scale-105 transition",
        type: "px-2 py-0.5 rounded-lg border"
    };

    return (
        <a
            href={link || "#"}
            target="_blank"
            rel="noreferrer"
            className={`${styles.cardBase}`}
        >
            {/* Image Section */}
            <div className={styles.imageContainer}>
                <img
                    src={img || 'https://via.placeholder.com/300'}
                    alt={title || "thumbnail"}
                    className={styles.image}
                />
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col grow space-y-2">
                <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className={`uppercase ${styles.type} ${artistTheme.border} ${artistTheme.bg} ${artistTheme.text}`}>
                        {artistName}
                    </span>
                    <span className={`${styles.type} ${typeTheme?.border || 'border-slate-100'} ${typeTheme?.bg || 'bg-white/90'} ${typeTheme?.text || 'text-slate-700'}`}>
                        {type}
                    </span>
                    <span className="text-content-text-muted ml-auto">
                        {date ? new Date(date).getFullYear() : 'N/A'}
                    </span>
                </div>

                <h3 className={`text-sm text-content-text-main line-clamp-2 ${(isPerformance || isDiscography) ? 'font-bold' : ''}`}>
                    {title}
                </h3>

                {note && (
                    <p className="text-xs text-content-text-sub line-clamp-1">
                        {note}
                    </p>
                )}
            </div>
        </a>
    );
};