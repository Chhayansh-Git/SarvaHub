export default function SellerTermsPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="mb-10 text-center">
                <span className="px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Seller Policy</span>
                <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4">
                    Merchant Terms of Service
                </h1>
                <p className="text-muted-foreground text-sm">Last Updated: October 2026</p>
            </div>

            <div className="glass-panel p-8 md:p-12 rounded-3xl border border-border/50">
                <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-muted-foreground">
                    <h2>1. Master Service Agreement</h2>
                    <p>
                        By registering as a seller on SarvaHub, you ("Merchant") enter into a legally binding agreement with SarvaHub Inc. These terms govern your use of the seller portal, product listing capabilities, and payout mechanisms.
                    </p>

                    <h2>2. Listing Requirements</h2>
                    <p>
                        Merchants must ensure that all product listings are accurate, up-to-date, and do not infringe on any intellectual property rights. High-resolution imagery (minimum 1080x1080px) and detailed descriptions are mandatory. We reserve the right to unpublish listings that do not meet our editorial standards.
                    </p>

                    <h2>3. Fulfillment SLA</h2>
                    <p>
                        Merchants are expected to pack and dispatch orders within 48 hours of order confirmation. Failure to meet the Service Level Agreement (SLA) for three consecutive orders will result in a temporary suspension of seller privileges and an account health review.
                    </p>

                    <h2>4. Payouts & Holds</h2>
                    <p>
                        Earnings are disbursed on a rolling 7-day schedule to your verified bank account, minus applicable platform fees and taxes. SarvaHub reserves the right to place a hold on funds in the event of a significant spike in chargebacks or buyer disputes until an investigation is concluded.
                    </p>

                    <div className="mt-12 p-6 bg-accent/5 border border-accent/20 rounded-2xl text-center not-prose">
                        <h3 className="text-xl font-bold mb-2">Policy Questions?</h3>
                        <p className="text-muted-foreground text-sm mb-4">Please reach out to the Merchant Compliance team.</p>
                        <a href="mailto:compliance@sarvahub.com" className="font-bold text-accent hover:underline">compliance@sarvahub.com</a>
                    </div>
                </div>
            </div>

        </div>
    );
}
