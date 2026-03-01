import { Info } from "lucide-react";

interface StepProps {
    formData: any;
    setFormData: (data: any) => void;
}

// Define the dynamic schema mapping for top-level categories
const CATEGORY_SCHEMA: Record<string, any[]> = {
    'Watches': [
        { name: 'movementType', label: 'Movement Type', type: 'select', options: ['Automatic / Self-Winding', 'Mechanical (Hand-Winding)', 'Quartz', 'Spring Drive'], required: true },
        { name: 'dialColor', label: 'Dial Color', type: 'text', placeholder: 'e.g. Cobalt Blue' },
        { name: 'caseMaterial', label: 'Case Material', type: 'select', options: ['Stainless Steel', '18k Rose Gold', '18k Yellow Gold', 'Titanium', 'Carbon / Ceramic', 'Platinum'], required: true },
        { name: 'caseDiameter', label: 'Case Diameter (mm)', type: 'number', placeholder: 'e.g. 41', required: true },
        { name: 'waterResistance', label: 'Water Resistance (ATM)', type: 'number', placeholder: 'e.g. 10' },
        { name: 'hasPapers', label: 'Includes Original Box & Papers', type: 'checkbox' }
    ],
    'Fashion': [
        { name: 'gender', label: 'Target Gender', type: 'select', options: ['Men', 'Women', 'Unisex', 'Kids'], required: true },
        { name: 'size', label: 'Size', type: 'text', placeholder: 'e.g. M, L, 42, US 10', required: true },
        { name: 'material', label: 'Primary Fabric / Material (%)', type: 'text', placeholder: 'e.g. 100% Cashmere', required: true },
        { name: 'careInstructions', label: 'Care Instructions', type: 'text', placeholder: 'e.g. Dry Clean Only' },
        { name: 'fitType', label: 'Fit Type', type: 'select', options: ['Regular', 'Slim', 'Relaxed', 'Oversized'] }
    ],
    'Electronics': [
        { name: 'modelName', label: 'Model Name / Number', type: 'text', required: true },
        { name: 'warranty', label: 'Warranty Period (Months)', type: 'number', placeholder: 'e.g. 24', required: true },
        { name: 'color', label: 'Color Variant', type: 'text', placeholder: 'e.g. Space Black' },
        { name: 'storageCapacity', label: 'Storage Capacity', type: 'text', placeholder: 'e.g. 256GB' }
    ],
    'Jewelry': [
        { name: 'metalType', label: 'Metal Type', type: 'select', options: ['Gold', 'Silver', 'Platinum', 'Rose Gold', 'White Gold'], required: true },
        { name: 'metalPurity', label: 'Metal Purity / Karat', type: 'select', options: ['24K', '22K', '18K', '14K', '925 Sterling'], required: true },
        { name: 'gemstone', label: 'Primary Gemstone', type: 'text', placeholder: 'e.g. Diamond, Emerald' },
        { name: 'weight', label: 'Total Weight (grams)', type: 'number', placeholder: 'e.g. 12.5', required: true }
    ],
    'Beauty': [
        { name: 'itemForm', label: 'Item Form', type: 'select', options: ['Liquid', 'Cream', 'Powder', 'Gel', 'Spray'], required: true },
        { name: 'volume', label: 'Volume / Weight', type: 'text', placeholder: 'e.g. 50ml or 100g', required: true },
        { name: 'skinType', label: 'Suitable Skin Type', type: 'text', placeholder: 'e.g. Sensitive, All Types' },
        { name: 'pao', label: 'Period After Opening (PAO)', type: 'text', placeholder: 'e.g. 12M' }
    ]
};

export function CategoryAttributesForm({ formData, setFormData }: StepProps) {
    const category = formData.category || '';
    const fieldsToRender = CATEGORY_SCHEMA[category] || [];

    const handleAttributeChange = (name: string, value: any) => {
        setFormData({
            ...formData,
            attributes: {
                ...(formData.attributes || {}),
                [name]: value
            }
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-heading font-black">Category Attributes</h2>
                <p className="text-muted-foreground">Provide specific details to help buyers find your {category ? category.toLowerCase() : 'product'}.</p>
            </div>

            <div className="bg-accent/5 border border-accent/20 p-5 rounded-2xl flex gap-4 mb-6">
                <Info className="h-6 w-6 text-accent shrink-0" />
                <div>
                    <h4 className="font-bold text-sm mb-1">Why are these required?</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Search filters rely heavily on these attributes. Complete and accurate attributes increase product visibility by 60%.
                    </p>
                </div>
            </div>

            {fieldsToRender.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {fieldsToRender.map((field) => {
                        // Ensure we safely access the nested attributes value
                        const value = formData.attributes?.[field.name] || '';

                        if (field.type === 'checkbox') {
                            return (
                                <div key={field.name} className="flex items-center gap-3 p-4 border border-border rounded-xl bg-muted/30 col-span-1 md:col-span-2">
                                    <input
                                        type="checkbox"
                                        id={field.name}
                                        checked={value === true}
                                        onChange={(e) => handleAttributeChange(field.name, e.target.checked)}
                                        className="w-5 h-5 rounded border-border text-accent focus:ring-accent accent-accent cursor-pointer"
                                    />
                                    <label htmlFor={field.name} className="text-sm font-medium cursor-pointer">{field.label}</label>
                                </div>
                            );
                        }

                        return (
                            <div key={field.name} className="space-y-2">
                                <label className="text-sm font-semibold">
                                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                                </label>

                                {field.type === 'select' ? (
                                    <select
                                        value={value}
                                        onChange={(e) => handleAttributeChange(field.name, e.target.value)}
                                        className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select {field.label}</option>
                                        {field.options?.map((opt: string) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        value={value}
                                        onChange={(e) => handleAttributeChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="p-8 border-2 border-dashed border-border rounded-2xl text-center bg-muted/20">
                    <p className="text-muted-foreground">Select a primary category in the <strong>Basic Details</strong> step to view dynamic attributes.</p>
                </div>
            )}
        </div>
    );
}
