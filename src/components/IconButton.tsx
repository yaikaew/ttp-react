// components/IconButton.tsx
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

type IconButtonProps = {
    icon: LucideIcon;
    href: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    className?: string;
};

export function IconButton({
    icon: Icon,
    href,
    target = '_blank',
    className,
}: IconButtonProps) {
    return (
        <a
            href={href}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            className={clsx(
                `
                flex items-center justify-center
                w-12 h-12 rounded-2xl
                transition-all duration-300
                active:scale-90
                
                bg-card-bg 
                border border-card-border
                text-content-text-sub
                
                hover:bg-brand-primary-light
                hover:text-brand-primary
                hover:border-brand-primary/30
                hover:shadow-md
                `,
                className
            )}
        >
            <Icon className="w-5 h-5" />
        </a>
    );
}