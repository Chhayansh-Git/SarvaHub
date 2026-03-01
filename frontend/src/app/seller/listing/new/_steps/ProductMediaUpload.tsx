import { UploadCloud, Image as ImageIcon, X } from "lucide-react";

interface StepProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function ProductMediaUpload({ formData, setFormData }: StepProps) {
    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-heading font-black">Product Media</h2>
                <p className="text-muted-foreground">High-quality media increases conversion rates by up to 40%.</p>
            </div>

            {/* Primary Image Upload Area */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold">Product Images <span className="text-rose-500">*</span></label>
                    <span className="text-xs text-muted-foreground">Upload 3 to 10 images</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Primary Image Slot (Thumbnail) */}
                    <div className="col-span-2 md:col-span-2 aspect-square rounded-2xl border-2 border-dashed border-accent/50 bg-accent/5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent/10 transition-colors relative group">
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-3">
                            <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <UploadCloud className="h-8 w-8 text-accent" />
                            </div>
                            <div>
                                <p className="font-bold text-lg text-accent">Primary Image</p>
                                <p className="text-xs text-muted-foreground mt-1">Drag & drop or click to browse</p>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Image Slots */}
                    <div className="aspect-square rounded-2xl border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <ImageIcon className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="text-xs font-semibold text-muted-foreground">Add File</span>
                    </div>

                    <div className="aspect-square rounded-2xl border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <ImageIcon className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="text-xs font-semibold text-muted-foreground">Add File</span>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                    Must be at least 1000x1000px. White background preferred. No watermarks or text overlays.
                </p>
            </div>

            {/* Premium Media Options */}
            <div className="grid md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-border/50">
                <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        Product Video <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Premium</span>
                    </label>
                    <div className="border border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                        <UploadCloud className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium">Upload .MP4 (Max 60s)</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        360° View Asset <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Premium</span>
                    </label>
                    <div className="border border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                        <UploadCloud className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium">Upload .GLB/.GLTF Model</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
