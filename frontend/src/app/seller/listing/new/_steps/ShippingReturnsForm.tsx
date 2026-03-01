import { AlertCircle } from "lucide-react";

interface StepProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function ShippingReturnsForm({ formData, setFormData }: StepProps) {
    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-heading font-black">Shipping & Returns</h2>
                <p className="text-muted-foreground">Define logistics rules and post-purchase policies.</p>
            </div>

            {/* Package Dimensions & Weight */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">Package Information</h3>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Package Weight (grams) <span className="text-rose-500">*</span></label>
                        <input
                            type="number"
                            className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none"
                            placeholder="e.g. 500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Dimensions (cm) <span className="text-rose-500">*</span></label>
                        <div className="flex items-center gap-2">
                            <input type="number" placeholder="L" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none text-center" />
                            <span className="text-muted-foreground">×</span>
                            <input type="number" placeholder="W" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none text-center" />
                            <span className="text-muted-foreground">×</span>
                            <input type="number" placeholder="H" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none text-center" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 border border-border rounded-xl bg-muted/30">
                    <input type="checkbox" id="fragile" className="w-5 h-5 rounded border-border text-accent focus:ring-accent accent-accent cursor-pointer" />
                    <label htmlFor="fragile" className="text-sm font-medium cursor-pointer">This package contains fragile items and requires special tracking/handling.</label>
                </div>
            </div>

            {/* Return Policy Context */}
            <div className="space-y-4 pt-6 mt-6 border-t border-border/50">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">Return & Refund Policy</h3>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Select Return Policy <span className="text-rose-500">*</span></label>
                    <select
                        value={formData.returnPolicy}
                        onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
                        className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none cursor-pointer"
                    >
                        <option value="default">SarvaHub Default (7-Day Replacement)</option>
                        <option value="no_returns">Non-returnable (Final Sale)</option>
                        <option value="conditional">14-Day Conditional Return (Tags Intact)</option>
                        <option value="luxury">Luxury Escrow Return (Requires Inspection)</option>
                    </select>
                </div>

                {formData.returnPolicy === 'no_returns' && (
                    <div className="flex gap-3 items-start p-4 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20 text-sm font-medium mt-2">
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                        <p>Non-returnable items must still be refunded or replaced if delivered damaged, defective, or incorrect as per Indian Consumer Protection (E-Commerce) Rules, 2020.</p>
                    </div>
                )}
            </div>

        </div>
    );
}
