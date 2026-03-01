import { CheckCircle2, AlertTriangle } from "lucide-react";

interface StepProps {
    formData: any;
}

export function ListingReview({ formData }: StepProps) {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-heading font-black">Review Listing</h2>
                <p className="text-muted-foreground">Please double-check all details before submitting for Authenticity Verification.</p>
            </div>

            <div className="bg-accent/5 border border-accent/20 p-5 rounded-2xl flex gap-4">
                <AlertTriangle className="h-6 w-6 text-accent shrink-0" />
                <div>
                    <h4 className="font-bold text-sm mb-1">Authenticity Verification Note</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Once submitted, this listing cannot be edited while it is under review. Please ensure all MPNs, serials, and uploaded proofs are accurate to avoid rejection.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">

                {/* Section Summary: Basic Details */}
                <div className="p-6 glass-panel rounded-2xl border-border/50 space-y-4">
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                        <h3 className="font-bold tracking-wide uppercase text-sm text-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Basic Details
                        </h3>
                        <button className="text-xs font-bold text-accent hover:underline">Edit</button>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <div>
                            <span className="text-muted-foreground block text-xs mb-1">Product Title</span>
                            <span className="font-semibold">{formData.name || "—"}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block text-xs mb-1">Brand</span>
                            <span className="font-semibold">{formData.brand || "—"}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block text-xs mb-1">Category</span>
                            <span className="font-semibold">{formData.category || "—"}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block text-xs mb-1">Condition</span>
                            <span className="font-semibold capitalize">{formData.condition.replace('_', ' ')}</span>
                        </div>
                    </div>
                </div>

                {/* Section Summary: Authenticity & Provenance */}
                <div className="p-6 glass-panel rounded-2xl border-border/50 space-y-4">
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                        <h3 className="font-bold tracking-wide uppercase text-sm text-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Provenance
                        </h3>
                        <button className="text-xs font-bold text-accent hover:underline">Edit</button>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <div>
                            <span className="text-muted-foreground block text-xs mb-1">Country of Origin</span>
                            <span className="font-semibold">{formData.countryOfOrigin || "—"}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block text-xs mb-1">Sourcing Model</span>
                            <span className="font-semibold capitalize">{formData.sellerType.replace('_', ' ')}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-muted-foreground block text-xs mb-1">MPN (Manufacturer Part No)</span>
                            <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">{formData.mpn || "—"}</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-emerald-500 font-medium bg-emerald-500/10 px-3 py-2 rounded-xl">
                            <CheckCircle2 className="h-4 w-4" /> Original Invoice Uploaded
                        </div>
                    </div>
                </div>

                {/* Section Summary: Category Attributes (Dynamic) */}
                {formData.attributes && Object.keys(formData.attributes).length > 0 && (
                    <div className="p-6 glass-panel rounded-2xl border-border/50 space-y-4">
                        <div className="flex items-center justify-between border-b border-border/50 pb-3">
                            <h3 className="font-bold tracking-wide uppercase text-sm text-foreground flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Distinctive Attributes
                            </h3>
                            <button className="text-xs font-bold text-accent hover:underline">Edit</button>
                        </div>
                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                            {Object.entries(formData.attributes).map(([key, value]) => {
                                // Basic formatting for camelCase keys
                                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                return (
                                    <div key={key}>
                                        <span className="text-muted-foreground block text-xs mb-1">{label}</span>
                                        <span className="font-semibold">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value || "—")}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Section Summary: Pricing & Shipping */}
                <div className="p-6 glass-panel rounded-2xl border-border/50 space-y-4">
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                        <h3 className="font-bold tracking-wide uppercase text-sm text-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Pricing & Logistics
                        </h3>
                        <button className="text-xs font-bold text-accent hover:underline">Edit</button>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <div>
                            <span className="text-muted-foreground block text-xs mb-1">Selling Price</span>
                            <span className="font-mono font-bold text-lg text-accent">₹{formData.sellingPrice ? Number(formData.sellingPrice).toLocaleString('en-IN') : "0"}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block text-xs mb-1">MRP</span>
                            <span className="font-mono line-through text-muted-foreground">₹{formData.mrp ? Number(formData.mrp).toLocaleString('en-IN') : "0"}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block text-xs mb-1">Inventory Count</span>
                            <span className="font-semibold">{formData.inventory || "0"} Units</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block text-xs mb-1">Return Policy</span>
                            <span className="font-semibold capitalize">{formData.returnPolicy.replace('_', ' ')}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
