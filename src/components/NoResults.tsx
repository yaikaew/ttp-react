import { SearchX } from 'lucide-react';

interface NoResultsProps {
    onReset: () => void;
}

export const NoResults = ({ onReset }: NoResultsProps) => (
    <div
        className="
            flex flex-col items-center justify-center py-32
            bg-card-bg
            rounded-[3rem]
            border border-dashed border-card-border
            animate-in zoom-in-95 duration-300
        "
    >
        {/* Icon */}
        <div className="bg-brand-primary-light p-6 rounded-full mb-5">
            <SearchX className="w-10 h-10 text-brand-primary" />
        </div>

        {/* Title */}
        <h3 className="text-content-text-header font-semibold text-lg">
            No Results Found
        </h3>

        {/* Description */}
        <p className="text-content-text-sub text-sm mt-2 max-w-xs text-center">
            We couldn&apos;t find anything matching your current filters.
            Try adjusting your search or resetting.
        </p>

        {/* Action */}
        <button
            onClick={onReset}
            className="
                mt-6 text-[11px] font-semibold uppercase tracking-widest
                text-brand-primary
                hover:text-brand-primary-hover
                hover:underline
                transition
            "
        >
            Clear all filters
        </button>
    </div>
);
