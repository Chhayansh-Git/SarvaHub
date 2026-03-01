"use client";

import { useState } from "react";
import { MapPin, Calendar, CheckCircle2, Truck, Box } from "lucide-react";

interface ReturnLogisticsProps {
    onBack: () => void;
    onNext: () => void;
}

export function ReturnLogisticsForm({ onBack, onNext }: ReturnLogisticsProps) {
    const [method, setMethod] = useState<'pickup' | 'dropoff'>('pickup');
    const [selectedDate, setSelectedDate] = useState('Tomorrow');

    const DATES = ['Tomorrow', 'Wednesday, 24th', 'Thursday, 25th'];

    // Mock user address
    const address = "14, Brigade Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" /> How should we collect the items?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    onClick={() => setMethod('pickup')}
                    className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${method === 'pickup' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'bg-background hover:bg-muted/50 border-border/50'
                        }`}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Truck className={`h-6 w-6 ${method === 'pickup' ? 'text-accent' : 'text-muted-foreground'}`} />
                        <h3 className={`font-bold ${method === 'pickup' ? 'text-foreground' : 'text-muted-foreground'}`}>Home Pickup</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">A courier will collect the package from your saved address.</p>
                    {method === 'pickup' && <div className="absolute top-4 right-4 text-accent"><CheckCircle2 className="h-5 w-5" /></div>}
                </button>

                <button
                    onClick={() => setMethod('dropoff')}
                    className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${method === 'dropoff' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'bg-background hover:bg-muted/50 border-border/50'
                        }`}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Box className={`h-6 w-6 ${method === 'dropoff' ? 'text-accent' : 'text-muted-foreground'}`} />
                        <h3 className={`font-bold ${method === 'dropoff' ? 'text-foreground' : 'text-muted-foreground'}`}>Drop-off</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Self-drop at a nearby courier partner location.</p>
                    {method === 'dropoff' && <div className="absolute top-4 right-4 text-accent"><CheckCircle2 className="h-5 w-5" /></div>}
                </button>
            </div>

            {method === 'pickup' && (
                <div className="p-6 rounded-2xl border border-border/50 bg-muted/5 animate-in slide-in-from-top-4 fade-in duration-300">
                    <h4 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" /> Choose Pickup Date
                    </h4>
                    <div className="flex flex-wrap gap-3 mb-6">
                        {DATES.map(date => (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`text-sm py-2 px-4 rounded-lg border transition-colors ${selectedDate === date
                                    ? 'bg-foreground text-background font-bold border-foreground'
                                    : 'bg-background text-muted-foreground hover:border-foreground/50 border-border/50'
                                    }`}
                            >
                                {date}
                            </button>
                        ))}
                    </div>

                    <div className="bg-background border border-border/50 rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Pickup Address</p>
                        <p className="text-sm text-foreground font-medium">{address}</p>
                        <button className="text-accent text-sm font-bold mt-2 hover:underline">Change Address</button>
                    </div>
                </div>
            )}

            {method === 'dropoff' && (
                <div className="p-6 rounded-2xl border border-border/50 bg-muted/5 animate-in slide-in-from-top-4 fade-in duration-300 flex items-center justify-between">
                    <div>
                        <p className="font-bold text-foreground text-sm mb-1">Drop-off at any BlueDart or Delhivery location.</p>
                        <p className="text-xs text-muted-foreground max-w-sm">We will email you a prepaid shipping label. Please print it and attach it to the package securely.</p>
                    </div>
                    <button className="text-accent text-sm font-bold whitespace-nowrap hover:underline">Find Nearest Spot &rarr;</button>
                </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
                <button onClick={onBack} className="text-muted-foreground hover:text-foreground font-medium px-4">Back</button>
                <button onClick={onNext} className="bg-accent text-accent-foreground font-bold py-3 px-8 rounded-full hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">Confirm Return</button>
            </div>
        </div>
    );
}
