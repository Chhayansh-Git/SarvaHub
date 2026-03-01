"use client";

import { CreditCard, Wallet, RefreshCw, AlertCircle, ImagePlus, X } from "lucide-react";
import { useReturnStore, ReturnItem, ResolutionType } from "@/store/returnStore";

interface ReturnReasonFormProps {
    items: any[];
    onBack: () => void;
    onNext: () => void;
}

const REASONS = [
    "Wrong size/fit",
    "Defective/Damaged",
    "Not as described",
    "Changed mind",
    "Better price elsewhere",
    "Other"
];

export function ReturnReasonForm({ items, onBack, onNext }: ReturnReasonFormProps) {
    const { itemDetails, setItemDetails, addProofImage, removeProofImage } = useReturnStore();

    // Ensure all items have a reason/resolution before proceeding
    const canProceed = items.every(item => {
        const details = itemDetails[item.id];
        return details?.reason && details?.resolution;
    });

    const handleImageUpload = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Mocking an image upload with a local object URL for UI
            const url = URL.createObjectURL(file);
            addProofImage(itemId, url);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-accent" /> Configure Return Options
            </h2>

            <div className="space-y-12">
                {items.map(item => {
                    const details = itemDetails[item.id] || {} as ReturnItem;

                    return (
                        <div key={item.id} className="p-6 rounded-2xl border border-border/50 bg-muted/5 relative overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded shadow-sm border border-border/50" />
                                <div>
                                    <h3 className="font-bold text-foreground text-sm">{item.name}</h3>
                                    <p className="text-muted-foreground text-xs">SKU: {item.sku}</p>
                                </div>
                            </div>

                            {/* Reason Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-foreground mb-3">1. Why are you returning this?</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {REASONS.map(reason => (
                                        <button
                                            key={reason}
                                            onClick={() => setItemDetails(item.id, { reason })}
                                            className={`text-sm py-2 px-3 rounded-lg border text-left transition-all ${details.reason === reason
                                                ? 'bg-accent/10 border-accent text-accent-foreground font-semibold ring-1 ring-accent'
                                                : 'bg-background hover:border-border text-muted-foreground hover:bg-muted/50 border-border/50'
                                                }`}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Optional Comments & Photos */}
                            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-foreground mb-2">Additional Comments (Optional)</label>
                                    <textarea
                                        placeholder="Tell us what went wrong..."
                                        value={details.comments || ''}
                                        onChange={(e) => setItemDetails(item.id, { comments: e.target.value })}
                                        className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent min-h-[#100px] resize-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-foreground mb-2">Upload Photos (Optional)</label>
                                    <div className="flex gap-3 flex-wrap">
                                        {(details.proofImages || []).map((imgUrl, idx) => (
                                            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border/50 group">
                                                <img src={imgUrl} alt="Proof" className="w-full h-full object-cover" />
                                                <button onClick={() => removeProofImage(item.id, idx)} className="absolute top-1 right-1 bg-rose-500/90 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}

                                        {(details.proofImages?.length || 0) < 3 && (
                                            <label className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-accent hover:text-accent cursor-pointer transition-colors">
                                                <ImagePlus className="h-6 w-6 mb-1" />
                                                <span className="text-[10px] font-medium uppercase tracking-wider">Add</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(item.id, e)} />
                                            </label>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Max 3 images. Useful for damage claims.</p>
                                </div>
                            </div>

                            {/* Resolution Selection */}
                            <div>
                                <label className="block text-sm font-bold text-foreground mb-3">2. How would you like us to resolve this?</label>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setItemDetails(item.id, { resolution: 'store_credit' })}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${details.resolution === 'store_credit' ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500' : 'bg-background hover:bg-muted/50 border-border/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Wallet className={`h-5 w-5 ${details.resolution === 'store_credit' ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                                            <div className="text-left">
                                                <h4 className={`font-bold text-sm ${details.resolution === 'store_credit' ? 'text-emerald-500' : 'text-foreground'}`}>Store Credit (Instant)</h4>
                                                <p className="text-xs text-muted-foreground">Get your refund instantly + a 5% bonus credit.</p>
                                            </div>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border flex-shrink-0 ${details.resolution === 'store_credit' ? 'border-4 border-emerald-500' : 'border-border'}`}></div>
                                    </button>

                                    <button
                                        onClick={() => setItemDetails(item.id, { resolution: 'refund_original' })}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${details.resolution === 'refund_original' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'bg-background hover:bg-muted/50 border-border/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CreditCard className={`h-5 w-5 ${details.resolution === 'refund_original' ? 'text-accent' : 'text-muted-foreground'}`} />
                                            <div className="text-left">
                                                <h4 className={`font-bold text-sm ${details.resolution === 'refund_original' ? 'text-accent' : 'text-foreground'}`}>Refund to Original Payment</h4>
                                                <p className="text-xs text-muted-foreground">Money will be credited back in 5-7 business days.</p>
                                            </div>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border flex-shrink-0 ${details.resolution === 'refund_original' ? 'border-4 border-accent' : 'border-border'}`}></div>
                                    </button>

                                    <button
                                        onClick={() => setItemDetails(item.id, { resolution: 'exchange' })}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${details.resolution === 'exchange' ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500' : 'bg-background hover:bg-muted/50 border-border/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <RefreshCw className={`h-5 w-5 ${details.resolution === 'exchange' ? 'text-blue-500' : 'text-muted-foreground'}`} />
                                            <div className="text-left">
                                                <h4 className={`font-bold text-sm ${details.resolution === 'exchange' ? 'text-blue-500' : 'text-foreground'}`}>Exchange Item</h4>
                                                <p className="text-xs text-muted-foreground">Swap for a different size or color.</p>
                                            </div>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border flex-shrink-0 ${details.resolution === 'exchange' ? 'border-4 border-blue-500' : 'border-border'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
                <button onClick={onBack} className="text-muted-foreground hover:text-foreground font-medium px-4">Back</button>
                <button
                    onClick={onNext}
                    disabled={!canProceed}
                    className="bg-foreground text-background font-bold py-3 px-8 rounded-full hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue to Logistics
                </button>
            </div>
        </div>
    );
}
