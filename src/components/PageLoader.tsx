// src/components/PageLoader.tsx
export const PageLoader = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-page-bg">
        <div className="w-10 h-10 border-2 border-brand-primary-light/80 border-t-brand-primary rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-content-text-muted">Loading page</p>
    </div>
);