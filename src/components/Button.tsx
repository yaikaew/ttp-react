// components/Button.tsx
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

type BaseProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: LucideIcon;
    children: React.ReactNode;
    className?: string;
};

type AnchorProps = BaseProps & { as?: 'a'; href: string; target?: string; rel?: string; onClick?: never };
type LinkProps = BaseProps & { as: 'link'; to: string; onClick?: never };
type NativeButtonProps = BaseProps & { as: 'button'; onClick?: () => void; type?: 'button' | 'submit' | 'reset' };

type ButtonProps = AnchorProps | LinkProps | NativeButtonProps;

const baseStyle = `
    inline-flex items-center justify-center gap-2
    rounded-xl font-bold
    transition-all duration-300
    active:scale-95 disabled:opacity-50 disabled:pointer-events-none
`;

const sizes: Record<ButtonSize, string> = {
    sm: 'py-2 px-4 text-[10px] uppercase tracking-widest',
    md: 'py-2.5 px-5 text-xs uppercase tracking-widest',
    lg: 'py-4 px-6 text-base tracking-wide rounded-2xl',
};

const variants: Record<ButtonVariant, string> = {
    primary: `
        bg-gradient-to-r from-brand-primary to-brand-accent 
        text-white border border-white/10
        shadow-[0_4px_14px_0_rgba(99,102,241,0.4)] 
        hover:shadow-[0_6px_20px_rgba(99,102,241,0.3)]
        hover:opacity-95 hover:-translate-y-0.5
        dark:from-brand-primary dark:to-brand-secondary
    `,
    secondary: `
        bg-brand-primary-light/80 backdrop-blur-sm
        border border-brand-primary/10
        text-brand-primary
        hover:bg-brand-primary
        hover:text-white
        hover:shadow-lg hover:shadow-brand-primary/20
        dark:bg-brand-primary-light/5 dark:text-brand-primary dark:border-brand-primary/20
        dark:hover:bg-brand-primary dark:hover:text-white
    `,
};

export function Button(props: ButtonProps) {
    const { variant = 'secondary', size = 'md', icon: Icon, children, className } = props;

    const classes = clsx(baseStyle, sizes[size], variants[variant], className);

    const content = (
        <>
            {Icon && (
                <Icon
                    className={clsx(
                        size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5',
                        "transition-transform group-hover:scale-110"
                    )}
                />
            )}
            <span>{children}</span>
        </>
    );

    if (props.as === 'link') {
        return <Link to={props.to} className={classes}>{content}</Link>;
    }

    if (props.as === 'button') {
        return <button type={props.type || 'button'} onClick={props.onClick} className={classes}>{content}</button>;
    }

    return (
        <a href={props.href} target={props.target} rel={props.rel} className={classes}>
            {content}
        </a>
    );
}