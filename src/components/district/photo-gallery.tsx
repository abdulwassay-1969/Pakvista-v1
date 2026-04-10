'use client';

import { useState, useEffect, useRef, type RefObject } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

function restoreFocusToOpener(
    returnFocusRef: RefObject<HTMLElement | null>,
    fallback: HTMLElement | null
) {
    const preferred = returnFocusRef.current;
    if (preferred && document.contains(preferred)) {
        preferred.focus();
        return;
    }
    if (fallback && document.contains(fallback)) {
        fallback.focus();
    }
}

type PhotoGalleryProps = {
    images: string[];
    districtName: string;
};

export default function PhotoGallery({ images, districtName }: PhotoGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const lightboxRef = useRef<HTMLDivElement>(null);
    const returnFocusRef = useRef<HTMLElement | null>(null);
    const fallbackFocusRef = useRef<HTMLElement | null>(null);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const prev = () => {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    };

    const next = () => {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex + 1) % images.length);
    };

    useEffect(() => {
        if (lightboxIndex === null) return;
        fallbackFocusRef.current = document.activeElement as HTMLElement | null;
        const root = lightboxRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusables[0]?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
            if (e.key === "Tab") {
                const items = Array.from(
                    root.querySelectorAll<HTMLElement>(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    )
                ).filter((el) => !el.hasAttribute("disabled"));
                if (!items.length) return;
                const first = items[0];
                const last = items[items.length - 1];
                const active = document.activeElement;
                if (e.shiftKey && active === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && active === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            restoreFocusToOpener(returnFocusRef, fallbackFocusRef.current);
        };
    }, [lightboxIndex]);

    if (!images || images.length === 0) return null;

    return (
        <section className="py-12">
            <div className="flex items-center gap-3 mb-6">
                <ImageIcon className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Photo Gallery</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {images.map((url, i) => (
                    <button
                        type="button"
                        key={i}
                        className="relative h-52 w-full overflow-hidden rounded-xl cursor-pointer group shadow-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        onClick={(e) => {
                            returnFocusRef.current = e.currentTarget;
                            openLightbox(i);
                        }}
                        aria-label={`Open ${districtName} photo ${i + 1}`}
                    >
                        <Image
                            src={url}
                            alt={`${districtName} photo ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                                View
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div
                    ref={lightboxRef}
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${districtName} gallery photo viewer`}
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        aria-label="Close photo viewer"
                        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        aria-label="Previous photo"
                        className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div
                        className="relative w-full max-w-4xl h-[75vh] rounded-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[lightboxIndex]}
                            alt={`${districtName} photo ${lightboxIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        aria-label="Next photo"
                        className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-4 text-white/70 text-sm">
                        {lightboxIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </section>
    );
}
