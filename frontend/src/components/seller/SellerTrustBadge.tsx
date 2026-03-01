import { ShieldCheck, Award, Star } from "lucide-react";

interface SellerTrustBadgeProps {
    tier: 'starter' | 'professional' | 'enterprise';
    score: number;
    verified: boolean;
}

export function SellerTrustBadge({ tier, score, verified }: SellerTrustBadgeProps) {
    return (
        <div className="glass-panel p-6 rounded-2xl border-border/50 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 justify-between group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent pointer-events-none" />

            <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-lg ${tier === 'enterprise' ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-white' :
                        tier === 'professional' ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white' :
                            'bg-muted border border-border text-foreground'
                    }`}>
                    {tier === 'enterprise' ? <Award className="h-8 w-8" /> : <Star className="h-8 w-8" />}
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-black text-xl capitalize">{tier} Seller</h3>
                        {verified && (
                            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                <ShieldCheck className="h-3 w-3" />
                                Verified
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">Top 5% of marketplace performers</p>
                </div>
            </div>

            <div className="relative z-10 w-full md:w-auto text-left md:text-right border-t md:border-t-0 border-border/50 pt-4 md:pt-0">
                <div className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-widest">Trust Score</div>
                <div className="flex items-end gap-2 md:justify-end">
                    <span className="text-4xl font-heading font-black leading-none text-accent">{score}</span>
                    <span className="text-lg font-bold text-muted-foreground mb-0.5">/100</span>
                </div>
            </div>
        </div>
    );
}
