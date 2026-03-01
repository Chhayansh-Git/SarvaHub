"use client";

import { Star, ThumbsUp, CheckCircle2 } from "lucide-react";
import Image from "next/image";

// Dummy review data
const reviews = [
    {
        id: 1,
        author: "Eleanor P.",
        rating: 5,
        date: "February 12, 2026",
        verified: true,
        title: "Absolutely Exquisite Craftsmanship",
        content: "The quality of the materials is immediately apparent when you hold it. The stitching is perfect and it feels like it will last a lifetime. Highly recommend for anyone looking for true luxury.",
    },
    {
        id: 2,
        author: "James M.",
        rating: 4,
        date: "January 28, 2026",
        verified: true,
        title: "Very good, slightly darker than pictured",
        content: "The item is phenomenal, though the color is a shade darker than what appears on my monitor. Still, the authenticity and build quality are undeniable. Will purchase from this brand again.",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80"],
    },
];

export function ReviewSection() {
    return (
        <div className="mt-20 pt-16 border-t border-border/50">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Rating Summary Breakdown */}
                <div className="w-full lg:w-1/3 flex-shrink-0">
                    <h2 className="text-3xl font-heading font-bold mb-6">Customer Reviews</h2>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="text-5xl font-black tracking-tighter">4.8</div>
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className={`h-5 w-5 ${star <= 4.8 ? 'fill-accent text-accent' : 'fill-muted text-muted'}`} />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">Based on 124 reviews</p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-8">
                        {[5, 4, 3, 2, 1].map((rating, idx) => {
                            const percentages = [80, 15, 3, 2, 0];
                            const pct = percentages[idx];
                            return (
                                <div key={rating} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-12 text-sm text-muted-foreground font-medium">
                                        {rating} <Star className="h-3 w-3 fill-current text-current" />
                                    </div>
                                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                        <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className="w-10 text-right text-sm text-muted-foreground">{pct}%</div>
                                </div>
                            );
                        })}
                    </div>
                    <button className="w-full py-4 glass-panel border border-glass-border rounded-xl font-semibold hover:bg-white/5 transition-all text-center">
                        Write a Review
                    </button>
                </div>

                {/* Review List */}
                <div className="flex-1 space-y-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="pb-8 border-b border-border/50 last:border-0">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className={`h-3 w-3 ${star <= review.rating ? 'fill-accent text-accent' : 'fill-muted text-muted'}`} />
                                        ))}
                                    </div>
                                    <h3 className="font-semibold text-lg">{review.title}</h3>
                                </div>
                                <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-4 text-sm">
                                <span className="font-bold">{review.author}</span>
                                {review.verified && (
                                    <span className="flex items-center gap-1 text-emerald-500 font-medium text-xs">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified Purchase
                                    </span>
                                )}
                            </div>

                            <p className="text-muted-foreground leading-relaxed mb-6">{review.content}</p>

                            {review.images && (
                                <div className="flex items-center gap-3 mb-6">
                                    {review.images.map((img, i) => (
                                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                                            <Image src={img} alt="Customer upload" fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="font-medium">Was this review helpful?</span>
                                <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                    <ThumbsUp className="h-4 w-4" /> Yes (12)
                                </button>
                            </div>
                        </div>
                    ))}

                    <button className="text-accent font-semibold hover:underline">
                        See all 124 reviews
                    </button>
                </div>
            </div>
        </div>
    );
}
