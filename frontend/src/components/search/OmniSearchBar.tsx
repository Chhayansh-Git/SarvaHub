"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Mic, Camera, X, UploadCloud, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useHistoryStore } from "@/store/historyStore";
import { api } from "@/lib/api";
import Link from "next/link";

export function OmniSearchBar() {
    const [query, setQuery] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [showVisualSearch, setShowVisualSearch] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Sync query state with URL — clear when leaving search page
    useEffect(() => {
        if (pathname === '/search') {
            const urlQuery = searchParams.get('q') || '';
            setQuery(urlQuery);
        } else {
            setQuery('');
            setSuggestions([]);
        }
    }, [pathname, searchParams]);

    const { searchedKeywords, recentlyViewedProducts, addSearchKeyword, clearHistory } = useHistoryStore();

    // Web Speech API Reference
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    // Voice Search Logic
    const handleVoiceSearch = () => {
        if (isListening) {
            // Stop if already listening
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsListening(false);
            return;
        }

        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Your browser doesn't support Voice Search.");
            return;
        }

        setIsListening(true);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            setIsListening(false);
            // Auto-submit after slight delay
            setTimeout(() => {
                if (transcript.trim()) {
                    addSearchKeyword(transcript);
                    router.push(`/search?q=${encodeURIComponent(transcript)}`);
                }
            }, 500);
        };

        recognition.onerror = () => {
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const stopListening = () => {
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const handleSearchSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (query.trim()) {
            addSearchKeyword(query);
            setSuggestions([]);
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsFocused(false);
        }
    };

    // ── Live Autocomplete ────────────────────────────────────────────
    const fetchSuggestions = useCallback(async (q: string) => {
        if (q.length < 2) { setSuggestions([]); return; }
        setLoadingSuggestions(true);
        try {
            const res = await api.get<any>(`/products?q=${encodeURIComponent(q)}&limit=6`);
            const items = res?.data || [];
            setSuggestions(items);
        } catch {
            setSuggestions([]);
        } finally {
            setLoadingSuggestions(false);
        }
    }, []);

    const handleQueryChange = (val: string) => {
        setQuery(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
    };

    // Clean up debounce on unmount
    useEffect(() => {
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, []);

    // Drag and Drop Logic
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const processImageFile = async (file: File) => {
        if (!file.type.startsWith('image/')) return;

        setIsUploading(true);
        // Simulate client-side compression & API upload
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsUploading(false);
        setShowVisualSearch(false);

        // Redirect to visual search results
        const fakeRef = Math.random().toString(36).substring(7);
        router.push(`/search?imageRef=${fakeRef}`);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processImageFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processImageFile(e.target.files[0]);
        }
    };

    return (
        <>
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-2xl relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    onFocus={() => { stopListening(); setIsFocused(true); }}
                    onBlur={() => setTimeout(() => setIsFocused(false), 400)}
                    placeholder="Search for premium products, brands, or categories..."
                    className="w-full h-12 pl-12 pr-24 bg-background/50 backdrop-blur-sm border border-border rounded-full outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-inner placeholder:text-muted-foreground/70"
                />

                {/* History Dropdown */}
                <AnimatePresence>
                    {isFocused && (searchedKeywords.length > 0 || recentlyViewedProducts.length > 0) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-14 left-0 w-full glass-panel border border-border rounded-2xl shadow-xl overflow-hidden z-50 p-4"
                        >
                            <div className="flex items-center justify-between mb-3 px-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Recent Activity</span>
                                <button
                                    onClick={(e) => { e.preventDefault(); clearHistory(); }}
                                    className="text-xs text-muted-foreground hover:text-accent transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>

                            {searchedKeywords.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-foreground px-2 mb-2 flex items-center gap-2">
                                        <Search className="h-3 w-3" /> Recent Searches
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {searchedKeywords.map((kw, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setQuery(kw); addSearchKeyword(kw); router.push(`/search?q=${encodeURIComponent(kw)}`); }}
                                                className="px-3 py-1.5 bg-muted/50 hover:bg-muted text-sm rounded-lg transition-colors border border-border/50 text-foreground"
                                            >
                                                {kw}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {recentlyViewedProducts.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-foreground px-2 mb-2">Recently Viewed</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {recentlyViewedProducts.slice(0, 4).map((p) => (
                                            <Link
                                                href={`/product/${p.id}`}
                                                key={p.id}
                                                className="group flex flex-col gap-2 p-2 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                                            >
                                                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={p.image} alt={p.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-foreground line-clamp-1">{p.name}</span>
                                                    <span className="text-[10px] font-bold text-muted-foreground">₹{p.price.toLocaleString()}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Live Autocomplete Suggestions */}
                <AnimatePresence>
                    {isFocused && suggestions.length > 0 && query.length >= 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-14 left-0 w-full glass-panel border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                        >
                            <div className="px-4 py-2 border-b border-border/50">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Suggestions</span>
                            </div>
                            <div className="max-h-[360px] overflow-y-auto">
                                {suggestions.map((item: any) => (
                                    <Link
                                        key={item.id || item.slug}
                                        href={`/products/${item.slug}`}
                                        onClick={() => { setIsFocused(false); setSuggestions([]); }}
                                        className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/20 last:border-0"
                                    >
                                        {item.image && (
                                            <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">{item.brand}</p>
                                        </div>
                                        <span className="text-sm font-bold text-accent flex-shrink-0">₹{(item.price || 0).toLocaleString('en-IN')}</span>
                                    </Link>
                                ))}
                            </div>
                            <button
                                onClick={handleSearchSubmit}
                                className="w-full px-4 py-2.5 text-center text-sm font-semibold text-accent hover:bg-muted/50 transition-colors border-t border-border/50"
                            >
                                See all results for "{query}"
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                    {/* Voice Search Button with Pulse Animation */}
                    <div className="relative">
                        {isListening && (
                            <motion.div
                                className="absolute inset-0 rounded-full bg-accent opacity-50"
                                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            />
                        )}
                        <button
                            type="button"
                            onClick={handleVoiceSearch}
                            className={`p-2 rounded-full transition-colors relative z-10 ${isListening ? 'text-accent' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                            title="Voice Search"
                        >
                            <Mic className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Visual Search Button */}
                    <button
                        type="button"
                        onClick={() => { stopListening(); setShowVisualSearch(true); }}
                        className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                        title="Visual Search"
                    >
                        <Camera className="h-5 w-5" />
                    </button>
                </div>
            </form>

            {/* Visual Search Modal (Drag and Drop) */}
            <AnimatePresence>
                {showVisualSearch && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-border overflow-hidden relative"
                        >
                            <button
                                onClick={() => !isUploading && setShowVisualSearch(false)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground disabled:opacity-50"
                                disabled={isUploading}
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="p-8 text-center space-y-6">
                                <div>
                                    <h3 className="text-2xl font-heading font-bold text-foreground mb-2">Visual Search</h3>
                                    <p className="text-muted-foreground text-sm">Upload an image to find visually similar items.</p>
                                </div>

                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`
                    border-2 border-dashed rounded-2xl p-10 transition-colors flex flex-col items-center justify-center min-h-[200px]
                    ${isDragging ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}
                    ${isUploading ? 'opacity-50 pointer-events-none' : ''}
                  `}
                                >
                                    {isUploading ? (
                                        <div className="flex flex-col items-center gap-4 text-accent">
                                            <Loader2 className="h-10 w-10 animate-spin" />
                                            <span className="font-medium animate-pulse">Analyzing image...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <UploadCloud className={`h-12 w-12 mb-4 ${isDragging ? 'text-accent' : 'text-muted-foreground'}`} />
                                            <p className="text-foreground font-medium mb-1">Drag and drop your image here</p>
                                            <p className="text-muted-foreground text-sm mb-4">or</p>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-6 py-2 bg-foreground text-background rounded-full text-sm font-semibold hover:bg-foreground/90 transition-all shadow-md active:scale-95"
                                            >
                                                Browse Files
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
