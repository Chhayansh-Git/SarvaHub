export default function SellerReturnsPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="mb-10 text-center">
                <span className="px-3 py-1 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Fulfillment</span>
                <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4">
                    Returns & Disputes
                </h1>
                <p className="text-muted-foreground text-sm">Understanding your obligations in the event of a buyer return.</p>
            </div>

            <div className="glass-panel p-8 md:p-12 rounded-3xl border border-border/50">
                <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-muted-foreground">

                    <h2>1. Standard Return Window</h2>
                    <p>
                        SarvaHub mandates a 14-day return policy for all buyers to build platform trust. As a seller, you must accept returns initiated within this window if the item is returned in its original, unworn, and unaltered condition.
                    </p>

                    <h2>2. Inspection and Refunds</h2>
                    <p>
                        Once a returned item is received back at your registered warehouse address, you have <strong>48 hours to inspect</strong> the item and process the refund via your dashboard. If the item is damaged or missing components, you must open a "Buyer Dispute" before issuing a partial refund.
                    </p>

                    <h2>3. Return Shipping Costs</h2>
                    <ul>
                        <li><strong>Buyer Remorse:</strong> The buyer covers return shipping costs.</li>
                        <li><strong>"Not As Described" / Damaged:</strong> If the item sent was materially different from the listing or damaged upon arrival, the merchant is responsible for round-trip shipping costs.</li>
                    </ul>

                    <h2>4. Final Sale Items</h2>
                    <p>
                        Items marked explicitly as "Final Sale" (such as customized goods or highly sterile beauty items) are exempt from the standard return window, barring claims of counterfeit or severe damage upon transit.
                    </p>

                </div>
            </div>

        </div>
    );
}
