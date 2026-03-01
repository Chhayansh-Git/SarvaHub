interface StepProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function BasicDetailsForm({ formData, setFormData }: StepProps) {
    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-heading font-black">Basic Details</h2>
                <p className="text-muted-foreground">Start by telling us the core details of your product.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Product Title <span className="text-rose-500">*</span></label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none font-medium"
                        placeholder="e.g. Royal Oak Selfwinding Chronograph"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Category <span className="text-rose-500">*</span></label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none cursor-pointer"
                        >
                            <option value="" disabled>Select Primary Category</option>
                            <option value="Watches">Luxury Watches</option>
                            <option value="Fashion">Designer Fashion</option>
                            <option value="Electronics">Premium Electronics</option>
                            <option value="Jewelry">Fine Jewelry</option>
                            <option value="Beauty">Beauty & Cosmetics</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Brand <span className="text-rose-500">*</span></label>
                        <input
                            type="text"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none"
                            placeholder="e.g. Audemars Piguet"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Condition <span className="text-rose-500">*</span></label>
                    <div className="grid grid-cols-3 gap-3">
                        {['new', 'refurbished', 'open_box'].map((cond) => (
                            <button
                                key={cond}
                                onClick={() => setFormData({ ...formData, condition: cond })}
                                className={`p-4 rounded-xl border text-sm font-bold capitalize transition-all ${formData.condition === cond
                                        ? 'border-accent bg-accent/10 text-foreground shadow-sm'
                                        : 'border-border glass-panel hover:bg-muted text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {cond.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Short Description <span className="text-rose-500">*</span></label>
                    <textarea
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                        rows={3}
                        className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none resize-none"
                        placeholder="A brief, engaging summary of the product (max 150 characters)"
                    />
                </div>
            </div>
        </div>
    );
}
