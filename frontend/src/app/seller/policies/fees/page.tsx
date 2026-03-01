export default function SellerFeesPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="mb-10 text-center">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Pricing</span>
                <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4">
                    Fee Schedule
                </h1>
                <p className="text-muted-foreground text-sm">Transparent pricing for selling on SarvaHub.</p>
            </div>

            <div className="glass-panel p-8 md:p-12 rounded-3xl border border-border/50">
                <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-muted-foreground">

                    <p className="lead">
                        SarvaHub charges a straightforward commission structure only when your item successfully sells. There are no monthly subscription fees or hidden listing charges.
                    </p>

                    <h2>Commission Rates</h2>
                    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border/50">
                        <table className="w-full text-left bg-background">
                            <thead className="bg-muted text-sm uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="p-4 font-bold border-b border-border/50">Category</th>
                                    <th className="p-4 font-bold border-b border-border/50 text-right">Commission Fee</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50 text-sm">
                                <tr><td className="p-4 font-medium">Watches & Fine Jewelry</td><td className="p-4 font-bold text-right text-accent">9.5%</td></tr>
                                <tr><td className="p-4 font-medium">Designer Handbags & Shoes</td><td className="p-4 font-bold text-right text-accent">12.0%</td></tr>
                                <tr><td className="p-4 font-medium">Electronics & Audio</td><td className="p-4 font-bold text-right text-accent">8.0%</td></tr>
                                <tr><td className="p-4 font-medium">Men's & Women's Fashion</td><td className="p-4 font-bold text-right text-accent">15.0%</td></tr>
                                <tr><td className="p-4 font-medium">Beauty & Fragrances</td><td className="p-4 font-bold text-right text-accent">10.0%</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h2>Payment Processing Fees</h2>
                    <p>
                        In addition to the commission, a standard payment processing fee of <strong>2.9% + ₹30</strong> applies to the total transaction amount (including taxes and shipping) to cover credit card processing costs.
                    </p>

                    <h2>Authentication Service</h2>
                    <p>
                        For high-risk items requiring physical inspection by our experts at HQ before reaching the buyer, a flat <strong>₹2,500 Authentication Fee</strong> is deducted from the payout. This ensures buyer trust and dramatically reduces the risk of returns.
                    </p>

                </div>
            </div>

        </div>
    );
}
