import { ShieldAlert, CheckCircle2 } from "lucide-react";

export default function SellerAuthenticityPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="mb-10 text-center">
                <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Strictly Enforced</span>
                <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4">
                    Zero-Tolerance Authenticity Policy
                </h1>
                <p className="text-muted-foreground text-sm">Our commitment to 100% genuine luxury goods.</p>
            </div>

            <div className="glass-panel p-8 md:p-12 rounded-3xl border border-border/50">

                <div className="flex items-center gap-4 mb-8 p-6 bg-red-500/10 rounded-2xl border border-red-500/20">
                    <ShieldAlert className="h-10 w-10 text-red-500 shrink-0" />
                    <div>
                        <h3 className="font-bold text-red-500 mb-1">Counterfeit Ban</h3>
                        <p className="text-sm text-red-500/80">Selling fake, replica, or unauthorized items will result in immediate and permanent account termination, forfeiture of funds, and potential legal action.</p>
                    </div>
                </div>

                <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-muted-foreground mt-8">
                    <h2>Verification Process</h2>
                    <p>
                        All high-value items (&gt;$1000) are subject to mandatory digital and physical authentication checks before customer delivery. As a merchant, you must supply original purchase receipts, certificates of authenticity, and serial numbers upon request.
                    </p>

                    <h2>Seller Requirements</h2>
                    <ul className="list-none space-y-4 not-prose mt-6 mb-8">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                            <div>
                                <strong className="block text-foreground mb-1">Source Traceability</strong>
                                <p className="text-sm text-muted-foreground">You must maintain records of your supply chain for up to 5 years.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                            <div>
                                <strong className="block text-foreground mb-1">Accurate Condition Grading</strong>
                                <p className="text-sm text-muted-foreground">Used items must be accurately described without hiding flaws or damage.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                            <div>
                                <strong className="block text-foreground mb-1">Cooperation with Experts</strong>
                                <p className="text-sm text-muted-foreground">If an item is flagged, you must cooperate with our third-party brand authenticators within 48 hours.</p>
                            </div>
                        </li>
                    </ul>

                    <h2>Dispute Resolution</h2>
                    <p>
                        If a buyer claims an item is counterfeit, funds will be immediately held. The item must be returned to our headquarters for independent inspection. If proven fake, the buyer receives a full refund, and you are charged a $500 inspection penalty fee on top of potential account suspension.
                    </p>
                </div>
            </div>

        </div>
    );
}
