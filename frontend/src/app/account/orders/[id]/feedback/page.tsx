"use client";

import { useState } from "react";
import { Star, Upload, ChevronRight, CheckCircle, PackageSearch, Store, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/BackgroundBeams";

export default function OrderFeedbackPage({ params }: { params: { id: string } }) {
    const [step, setStep] = useState(1);

    // Form State
    const [productRating, setProductRating] = useState(0);
    const [productReview, setProductReview] = useState("");
    const [photos, setPhotos] = useState<string[]>([]);

    const [sellerRating, setSellerRating] = useState(0);
    const [sellerFeedback, setSellerFeedback] = useState("");

    const [npsScore, setNpsScore] = useState<number | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Mock Order Data
    const orderItem = {
        id: "ITEM-A89",
        name: "Rolex Submariner Date - 2023 Unworn",
        seller: "LuxuryTimepiece Co.",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=300&h=300"
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Mock upload - in reality, you'd upload to S3/Cloudinary here
            const newPhotos = Array.from(e.target.files).map(() =>
                `https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=300&h=300&rnd=${Math.random()}`
            );
            setPhotos(prev => [...prev, ...newPhotos]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
                <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8">
                    <CheckCircle className="h-12 w-12 text-emerald-500" />
                </div>
                <h1 className="text-4xl font-heading font-black text-foreground mb-4">Thank you for your feedback!</h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-md">
                    Your reviews help other buyers make informed decisions and help us maintain the highest quality standards on SarvaHub.
                </p>
                <Link
                    href="/account/orders"
                    className="bg-foreground text-background px-8 py-3 rounded-full font-bold hover:bg-foreground/90 transition-transform active:scale-95"
                >
                    Back to My Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6">
            <BackgroundBeams className="opacity-20 hidden dark:block" />

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-3xl font-heading font-black tracking-tight text-foreground mb-2">
                        Rate Your Experience
                    </h1>
                    <p className="text-muted-foreground">Order #{params.id || "ORD-001"}</p>
                </div>

                {/* Progress Tracker */}
                <div className="flex items-center justify-center gap-2 mb-12 animate-in fade-in duration-700 delay-100">
                    <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= 1 ? 'border-accent bg-accent text-accent-foreground' : 'border-border'}`}>
                            <PackageSearch className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Product</span>
                    </div>
                    <div className={`h-1 w-16 rounded-full transition-colors ${step >= 2 ? 'bg-accent' : 'bg-border'}`} />
                    <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= 2 ? 'border-accent bg-accent text-accent-foreground' : 'border-border'}`}>
                            <Store className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Seller</span>
                    </div>
                    <div className={`h-1 w-16 rounded-full transition-colors ${step >= 3 ? 'bg-accent' : 'bg-border'}`} />
                    <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= 3 ? 'border-accent bg-accent text-accent-foreground' : 'border-border'}`}>
                            <Smartphone className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Platform</span>
                    </div>
                </div>

                {/* Steps Container */}
                <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-border/50 shadow-xl ml-auto mr-auto overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 delay-200">

                    {/* Step 1: Product Review */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                                <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0">
                                    <Image src={orderItem.image} alt={orderItem.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground line-clamp-2">{orderItem.name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Sold by {orderItem.seller}</p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-4">How was the product?</h2>
                                <div className="flex items-center gap-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setProductRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-10 w-10 ${star <= productRating
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-muted-foreground/30 hover:text-amber-400/50"
                                                    } transition-colors duration-200`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Write a review</h3>
                                <textarea
                                    placeholder="What did you like or dislike? How is the authenticity and quality?"
                                    value={productReview}
                                    onChange={(e) => setProductReview(e.target.value)}
                                    className="w-full h-32 bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-shadow resize-none"
                                />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Add Photos</h3>
                                <div className="flex flex-wrap gap-4">
                                    {photos.map((url, i) => (
                                        <div key={i} className="relative h-24 w-24 rounded-xl border border-border overflow-hidden group">
                                            <Image src={url} alt={`Review photo ${i}`} fill className="object-cover transition-transform group-hover:scale-110" />
                                        </div>
                                    ))}
                                    <label className="h-24 w-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors group">
                                        <Upload className="h-6 w-6 text-muted-foreground group-hover:text-accent mb-2" />
                                        <span className="text-[10px] font-medium text-muted-foreground group-hover:text-accent">Upload</span>
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={productRating === 0}
                                    className="flex items-center gap-2 bg-foreground text-background px-8 py-3 rounded-full font-bold text-sm disabled:opacity-50 hover:bg-foreground/90 transition-transform active:scale-95"
                                >
                                    Next: Rate Seller <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Seller Rating */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div>
                                <h2 className="text-xl font-bold mb-2">How was the seller?</h2>
                                <p className="text-muted-foreground mb-6">Rate {orderItem.seller}'s communication, packaging, and shipping speed.</p>

                                <div className="flex items-center gap-2 mb-8">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setSellerRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-10 w-10 ${star <= sellerRating
                                                        ? "fill-indigo-500 text-indigo-500"
                                                        : "text-muted-foreground/30 hover:text-indigo-500/50"
                                                    } transition-colors duration-200`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Leave Public Feedback for the Seller</h3>
                                <textarea
                                    placeholder="e.g., 'Item was securely authenticated and packaged perfectly. Fast shipping!'"
                                    value={sellerFeedback}
                                    onChange={(e) => setSellerFeedback(e.target.value)}
                                    className="w-full h-32 bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
                                />
                            </div>

                            <div className="pt-4 border-t border-border flex justify-between">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 rounded-full font-bold text-sm hover:bg-muted transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={sellerRating === 0}
                                    className="flex items-center gap-2 bg-foreground text-background px-8 py-3 rounded-full font-bold text-sm disabled:opacity-50 hover:bg-foreground/90 transition-transform active:scale-95"
                                >
                                    Next: Final Step <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Platform NPS */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div>
                                <h2 className="text-xl font-bold mb-2">How likely are you to recommend SarvaHub to a friend?</h2>
                                <p className="text-muted-foreground mb-8">0 means highly unlikely, 10 means highly likely.</p>

                                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4">
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                                        <button
                                            key={score}
                                            onClick={() => setNpsScore(score)}
                                            className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full font-bold text-sm sm:text-base border-2 transition-all duration-200 ${npsScore === score
                                                    ? "border-emerald-500 bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/20"
                                                    : "border-border/50 bg-background/50 hover:border-emerald-500 hover:text-emerald-500"
                                                }`}
                                        >
                                            {score}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    <span>Not Likely</span>
                                    <span>Very Likely</span>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-border flex justify-between">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 rounded-full font-bold text-sm hover:bg-muted transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={npsScore === null || isSubmitting}
                                    className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-3 rounded-full font-bold text-sm disabled:opacity-50 hover:bg-emerald-600 transition-transform active:scale-95 shadow-xl shadow-emerald-500/20"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Submitting...
                                        </span>
                                    ) : (
                                        "Submit Feedback"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

