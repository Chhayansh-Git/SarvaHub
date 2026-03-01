import { ReactNode } from "react";

interface KPICardProps {
    title: string;
    value: string;
    trend: number;
    icon: ReactNode;
}

export function KPICard({ title, value, trend, icon }: KPICardProps) {
    const isPositive = trend >= 0;

    return (
        <div className="glass-panel p-6 rounded-2xl border-border/50 relative overflow-hidden group hover:border-accent/50 transition-colors">
            {/* Background Glow on Hover */}
            <div className="absolute -inset-1 bg-gradient-to-br from-accent/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-muted rounded-xl text-foreground">
                    {icon}
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                    {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-muted-foreground text-sm font-medium mb-1 tracking-wide">{title}</h3>
                <p className="text-3xl font-heading font-black tracking-tight">{value}</p>
            </div>
        </div>
    );
}
