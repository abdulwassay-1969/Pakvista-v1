'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

type Review = {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
};

type ReviewsSectionProps = {
    districtSlug: string;
    districtName: string;
};

function StarRating({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1" role={interactive ? "radiogroup" : undefined} aria-label={interactive ? "Select a rating from 1 to 5 stars" : undefined}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`${interactive ? "cursor-pointer" : "cursor-default"} rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                    onMouseEnter={() => interactive && setHovered(star)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    onClick={() => interactive && onRate?.(star)}
                    onKeyDown={(e) => {
                        if (!interactive) return;
                        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                            e.preventDefault();
                            onRate?.(Math.min(5, rating + 1));
                        }
                        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                            e.preventDefault();
                            onRate?.(Math.max(1, rating - 1));
                        }
                    }}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    aria-checked={interactive ? rating === star : undefined}
                    role={interactive ? "radio" : undefined}
                >
                    <Star
                        className={`w-5 h-5 transition-colors ${star <= (interactive ? hovered || rating : rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}

export default function ReviewsSection({ districtSlug, districtName }: ReviewsSectionProps) {
    const storageKey = `reviews-${districtSlug}`;
    const [reviews, setReviews] = useState<Review[]>([]);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) setReviews(JSON.parse(stored));
        } catch { }
    }, [storageKey]);

    const avgRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { setError('Please enter your name.'); return; }
        if (!comment.trim()) { setError('Please write a comment.'); return; }
        if (rating === 0) { setError('Please select a star rating.'); return; }
        setError('');

        const newReview: Review = {
            id: Date.now().toString(),
            name: name.trim(),
            rating,
            comment: comment.trim(),
            date: new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }),
        };

        const updated = [newReview, ...reviews];
        setReviews(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setName('');
        setComment('');
        setRating(0);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <section className="py-12 border-t border-border">
            <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Reviews & Ratings</h2>
            </div>

            {avgRating && (
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl font-extrabold text-primary">{avgRating}</span>
                    <div>
                        <StarRating rating={Math.round(Number(avgRating))} />
                        <p className="text-sm text-muted-foreground mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            )}

            {/* Review Form */}
            <div className="bg-secondary/50 rounded-2xl p-6 mb-8 border border-border">
                <h3 className="text-lg font-semibold mb-4">Share your experience in {districtName}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Your Rating</label>
                        <StarRating rating={rating} onRate={setRating} interactive />
                    </div>
                    <Input
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-background"
                    />
                    <Textarea
                        placeholder="Write your review..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="bg-background resize-none"
                    />
                    {error && <p className="text-destructive text-sm">{error}</p>}
                    {submitted && (
                        <p className="text-green-600 text-sm font-medium">✅ Review submitted! Thank you.</p>
                    )}
                    <Button type="submit" className="w-full sm:w-auto">Submit Review</Button>
                </form>
            </div>

            {/* Review List */}
            {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                    No reviews yet. Be the first to share your experience!
                </p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-background rounded-xl p-5 border border-border shadow-sm">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{review.name}</p>
                                        <p className="text-xs text-muted-foreground">{review.date}</p>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} />
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
