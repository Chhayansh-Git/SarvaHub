"use client";

import { useState, useMemo, use } from "react";
import { Package, RefreshCw, CreditCard, Camera, MapPin, CheckCircle2 } from "lucide-react";
import { ReturnReasonForm } from "@/components/returns/ReturnReasonForm";
import { ReturnLogisticsForm } from "@/components/returns/ReturnLogisticsForm";
import { useReturnStore } from "@/store/returnStore";

export default function ReturnPortalPage({ params }: { params: Promise<{ id: string }> }) {
    const [step, setStep] = useState(1);
    const { selectedItemIds, toggleSelection } = useReturnStore();

    // Unwrap the params promise (Next 15+ requirement)
    const unwrappedParams = use(params);
    const orderId = unwrappedParams.id;

    // Mock Order Data for UI Context
    const orderItems = [
        { id: "item_1", name: "Royal Oak Automatic 41mm", sku: "RO-41-ST", price: 840000, condition: "New", returnable: true, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=200" },
        { id: "item_2", name: "Silk Kanjeevaram Saree", sku: "SK-GLD-01", price: 45000, condition: "New", returnable: false, nonReturnReason: "Category not eligible for returns", image: "https://images.unsplash.com/photo-1583391733958-6c0b39dc1e77?auto=format&fit=crop&q=80&w=200" }
    ];

    const toggleItemSelection = (id: string, returnable: boolean) => {
        toggleSelection(id, returnable);
    };

    const selectedOrderItems = useMemo(() => {
        return orderItems.filter(item => selectedItemIds.includes(item.id));
    }, [selectedItemIds, orderItems]);

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
            <h1 className="text-3xl font-heading font-black tracking-tighter mb-2 text-foreground">Initiate Return or Exchange</h1>
            <p className="text-muted-foreground mb-8">Order REF-{orderId.slice(0, 8).toUpperCase()}</p>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted/50 -z-10 rounded-full"></div>

                {['Select Items', 'Reason & Resolution', 'Logistics', 'Confirmation'].map((label, idx) => {
                    const stepNum = idx + 1;
                    const isActive = step === stepNum;
                    const isCompleted = step > stepNum;
                    return (
                        <div key={label} className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-4 
                                ${isActive ? 'bg-accent text-accent-foreground border-background ring-2 ring-accent' :
                                    isCompleted ? 'bg-emerald-500 text-white border-background' :
                                        'bg-muted text-muted-foreground border-background'}`}>
                                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : stepNum}
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-widest hidden sm:block ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
                        </div>
                    );
                })}
            </div>

            <div className="glass-panel p-6 sm:p-8">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5 text-accent" /> Select Items to Return
                        </h2>

                        <div className="space-y-4">
                            {orderItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${item.returnable ? 'cursor-pointer hover:border-accent/50 hover:bg-accent/5' : 'opacity-60 grayscale bg-muted/20 border-transparent'} ${selectedItemIds.includes(item.id) ? 'border-accent bg-accent/10 ring-1 ring-accent' : 'border-border/50'}`}
                                    onClick={() => toggleItemSelection(item.id, item.returnable)}
                                >
                                    {/* Custom Checkbox */}
                                    {item.returnable && (
                                        <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${selectedItemIds.includes(item.id) ? 'bg-accent border-accent text-accent-foreground' : 'border-muted-foreground'}`}>
                                            {selectedItemIds.includes(item.id) && <CheckCircle2 className="h-3.5 w-3.5" />}
                                        </div>
                                    )}

                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-border/50" />

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm text-foreground truncate">{item.name}</h3>
                                        <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                                        <p className="font-semibold text-sm mt-1">₹{item.price.toLocaleString('en-IN')}</p>

                                        {!item.returnable && (
                                            <p className="text-xs text-rose-500 bg-rose-500/10 inline-block px-2 py-0.5 rounded mt-2 border border-rose-500/20">
                                                {item.nonReturnReason}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-6 border-t border-border mt-8">
                            <button
                                onClick={() => setStep(2)}
                                disabled={selectedItemIds.length === 0}
                                className="bg-foreground text-background font-bold py-3 px-8 rounded-full hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue to Reason
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <ReturnReasonForm
                            items={selectedOrderItems}
                            onBack={() => setStep(1)}
                            onNext={() => setStep(3)}
                        />
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <ReturnLogisticsForm
                            onBack={() => setStep(2)}
                            onNext={() => setStep(4)}
                        />
                    </div>
                )}

                {step === 4 && (
                    <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-500/10">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-black font-heading mb-2">Return Initiated Successfully</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-8">We've arranged a pickup. You will receive an email shortly with your return label and tracking details.</p>

                        <div className="glass-panel-light inline-block p-4 rounded-2xl border border-emerald-500/20 text-left w-full max-w-sm mx-auto mb-8">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Return ID</p>
                            <p className="font-mono font-bold text-foreground">RET-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                            <div className="h-px bg-border my-3"></div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Expected Refund</p>
                            <p className="font-bold text-foreground text-lg text-emerald-500">Store Credit (Instant)</p>
                        </div>

                        <button className="bg-foreground text-background font-bold py-3 px-8 rounded-full hover:bg-foreground/90 transition-all">Track Return Status</button>
                    </div>
                )}
            </div>
        </div>
    );
}
