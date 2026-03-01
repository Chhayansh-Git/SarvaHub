import { Info, UploadCloud } from "lucide-react";

interface StepProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function AuthenticityForm({ formData, setFormData }: StepProps) {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div>
                <h2 className="text-2xl font-heading font-black flex items-center gap-2">
                    Authenticity Verification
                </h2>
                <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
                    SarvaHub maintains a zero-tolerance policy for counterfeits. Prove the provenance of your item by providing accurate sourcing details.
                </p>
            </div>

            {/* Seller Type Context */}
            <div className="bg-accent/5 border border-accent/20 p-5 rounded-2xl flex gap-4">
                <Info className="h-6 w-6 text-accent shrink-0" />
                <div>
                    <h4 className="font-bold text-sm mb-1">Required proof for <span className="capitalize">{formData.sellerType.replace('_', ' ')}s</span></h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {formData.sellerType === 'brand_owner'
                            ? "Please provide manufacturing details like your license number, batch/lot ID, and ethical sourcing certificates if applicable."
                            : formData.sellerType === 'reseller'
                                ? "You must upload the authorized distributor invoice and provide the Manufacturer Part Number (MPN)."
                                : "As a retailer, you must upload your original purchase invoice proving legitimate sourcing of the product."
                        }
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Conditional Fields based on Seller Type */}
                {formData.sellerType !== 'brand_owner' && (
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-sm font-semibold">Upload Invoice Proof <span className="text-rose-500">*</span></label>
                        <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <UploadCloud className="h-6 w-6 text-accent" />
                            </div>
                            <p className="font-medium">Upload PDF/JPG of Original Invoice</p>
                            <p className="text-xs text-muted-foreground mt-1">Pricing details can be redacted. Max size 5MB.</p>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Country of Origin <span className="text-rose-500">*</span></label>
                    <select
                        value={formData.countryOfOrigin}
                        onChange={(e) => setFormData({ ...formData, countryOfOrigin: e.target.value })}
                        className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none cursor-pointer"
                    >
                        <option value="India">India</option>
                        <option value="Italy">Italy</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="France">France</option>
                        <option value="USA">United States</option>
                        <option value="Japan">Japan</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Date of Manufacture <span className="text-rose-500">*</span></label>
                    <input
                        type="month"
                        value={formData.manufactureDate}
                        onChange={(e) => setFormData({ ...formData, manufactureDate: e.target.value })}
                        className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Manufacturer Part Number (MPN)</label>
                    <input
                        type="text"
                        value={formData.mpn}
                        onChange={(e) => setFormData({ ...formData, mpn: e.target.value })}
                        className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none font-mono text-sm"
                        placeholder="e.g. 15400ST.OO.1220ST.01"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">GTIN / UPC / EAN</label>
                    <input
                        type="text"
                        className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none font-mono text-sm tracking-wider"
                        placeholder="000 0000 00000"
                    />
                </div>

            </div>
        </div>
    );
}
