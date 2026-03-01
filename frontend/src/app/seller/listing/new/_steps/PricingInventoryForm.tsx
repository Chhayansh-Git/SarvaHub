interface StepProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function PricingInventoryForm({ formData, setFormData }: StepProps) {
    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-heading font-black">Pricing & Inventory</h2>
                <p className="text-muted-foreground">Configure pricing details in line with Legal Metrology rules.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                <div className="space-y-2">
                    <label className="text-sm font-semibold">MRP (₹) <span className="text-rose-500">*</span></label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
                        <input
                            type="number"
                            value={formData.mrp}
                            onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                            className="w-full pl-8 pr-4 py-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none font-mono text-lg font-bold"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Selling Price (₹) <span className="text-rose-500">*</span></label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
                        <input
                            type="number"
                            value={formData.sellingPrice}
                            onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                            className="w-full pl-8 pr-4 py-4 rounded-xl border border-accent/50 focus:ring-2 focus:ring-accent outline-none font-mono text-lg font-bold shadow-sm shadow-accent/10"
                            placeholder="0"
                            style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)', opacity: 0.1 }}
                        />
                        <input
                            type="number"
                            value={formData.sellingPrice}
                            onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                            className="w-full pl-8 pr-4 py-4 rounded-xl bg-transparent border-transparent outline-none font-mono text-lg font-bold absolute inset-0 text-foreground"
                            placeholder="0"
                        />
                    </div>
                    {(Number(formData.sellingPrice) > Number(formData.mrp)) && (
                        <p className="text-xs text-rose-500 font-bold mt-1">Selling price cannot exceed MRP.</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Available Inventory <span className="text-rose-500">*</span></label>
                    <input
                        type="number"
                        value={formData.inventory}
                        onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                        className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none font-mono text-lg font-bold"
                        placeholder="0"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">SKU (Stock Keeping Unit)</label>
                    <input
                        type="text"
                        className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none font-mono tracking-wider"
                        placeholder="e.g. RO-CHRONO-STEEL-01"
                    />
                </div>

            </div>

            <div className="mt-8 pt-8 border-t border-border/50 grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold">GST Tax Slab <span className="text-rose-500">*</span></label>
                    <select
                        value={formData.taxCategory}
                        onChange={(e) => setFormData({ ...formData, taxCategory: e.target.value })}
                        className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none cursor-pointer"
                    >
                        <option value="0">0% (GST Exempt)</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">HSN / SAC Code <span className="text-rose-500">*</span></label>
                    <input
                        type="text"
                        value={formData.hsnCode}
                        onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                        className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none font-mono tracking-widest"
                        placeholder="e.g. 9101"
                    />
                    <p className="text-xs text-blue-500 hover:underline cursor-pointer">Find my HSN code</p>
                </div>
            </div>
        </div>
    );
}
