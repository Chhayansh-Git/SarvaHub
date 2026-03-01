"use client";

import { useState } from "react";
import { Check, ChevronDown, SlidersHorizontal, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All Products", "Electronics", "Fashion", "Home & Design", "Beauty", "Sports"];
const brands = ["Acoustica", "Heritage Tailors", "Milano Crafted", "Swiss Precision", "Nike", "Sony"];

export function FilterSidebar() {
    const [expandedSection, setExpandedSection] = useState<string | null>("Category");
    const [selectedCategory, setSelectedCategory] = useState("All Products");
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState([0, 5000]);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    return (
        <div className="w-full lg:w-72 flex-shrink-0">
            <div className="glass-panel p-6 sticky top-28 border border-glass-border">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5 text-accent" />
                        Filters
                    </h2>
                    <button className="text-sm text-muted-foreground hover:text-accent transition-colors">
                        Clear all
                    </button>
                </div>

                {/* Categories */}
                <div className="mb-6 pb-6 border-b border-border/50">
                    <button
                        onClick={() => toggleSection("Category")}
                        className="flex items-center justify-between w-full text-left font-medium mb-4"
                    >
                        Category
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === "Category" ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {expandedSection === "Category" && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-2"
                            >
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`block w-full text-left text-sm py-1.5 transition-colors ${selectedCategory === category ? "text-accent font-medium" : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Price Range */}
                <div className="mb-6 pb-6 border-b border-border/50">
                    <button
                        onClick={() => toggleSection("Price")}
                        className="flex items-center justify-between w-full text-left font-medium mb-4"
                    >
                        Price Range
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === "Price" ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {expandedSection === "Price" && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-4"
                            >
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                                    <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="500000"
                                    step="5000"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full accent-accent bg-border h-1 rounded-full appearance-none outline-none"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Brands */}
                <div className="mb-6 pb-6 border-b border-border/50">
                    <button
                        onClick={() => toggleSection("Brand")}
                        className="flex items-center justify-between w-full text-left font-medium mb-4"
                    >
                        Brand
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === "Brand" ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {expandedSection === "Brand" && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-3"
                            >
                                {brands.map((brand) => (
                                    <label key={brand} onClick={() => toggleBrand(brand)} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand) ? 'bg-accent border-accent text-accent-foreground' : 'border-border group-hover:border-accent'
                                            }`}>
                                            {selectedBrands.includes(brand) && <Check className="h-3 w-3" />}
                                        </div>
                                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{brand}</span>
                                    </label>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Ratings */}
                <div>
                    <button
                        onClick={() => toggleSection("Rating")}
                        className="flex items-center justify-between w-full text-left font-medium mb-4"
                    >
                        Customer Rating
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === "Rating" ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {expandedSection === "Rating" && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-3"
                            >
                                {[4, 3, 2, 1].map((rating) => (
                                    <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                                        <input type="radio" name="rating" className="hidden" />
                                        <div className="w-4 h-4 rounded-full border border-border group-hover:border-accent flex items-center justify-center transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-transparent transition-colors group-active:bg-accent" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-yellow-500 text-yellow-500' : 'fill-muted text-muted'}`} />
                                            ))}
                                            <span className="text-sm text-muted-foreground ml-1">& Up</span>
                                        </div>
                                    </label>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
