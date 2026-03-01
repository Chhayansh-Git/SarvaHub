import { Terminal, Code2, Database, Key } from "lucide-react";

export default function SellerApiDocsPage() {
    return (
        <div className="p-8 max-w-5xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="mb-10 text-center">
                <span className="px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Developer Solutions</span>
                <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4">
                    Merchant API Documentation
                </h1>
                <p className="text-muted-foreground text-sm max-w-2xl mx-auto text-balance">
                    Integrate your ERP or inventory management systems directly with SarvaHub to automate listings, order fulfillment, and pricing adjustments.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="glass-panel p-6 border border-border/50 rounded-2xl flex flex-col items-center text-center">
                    <Key className="h-8 w-8 text-foreground mb-4" />
                    <h3 className="font-bold mb-2">Generate API Keys</h3>
                    <p className="text-sm text-muted-foreground mb-6">Create OAuth2 tokens for secure, scoped access to your merchant data.</p>
                    <button className="mt-auto px-6 py-2 bg-foreground text-background font-bold rounded-lg text-sm transition-colors hover:bg-primary">Manage Keys</button>
                </div>
                <div className="glass-panel p-6 border border-border/50 rounded-2xl flex flex-col items-center text-center">
                    <Terminal className="h-8 w-8 text-foreground mb-4" />
                    <h3 className="font-bold mb-2">API Reference</h3>
                    <p className="text-sm text-muted-foreground mb-6">Explore our REST endpoints, request parameters, and JSON response models.</p>
                    <button className="mt-auto px-6 py-2 bg-background border border-border/50 text-foreground font-bold rounded-lg text-sm transition-colors hover:border-accent">View Endpoints</button>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-border/50 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 filter blur-sm pointer-events-none">
                    <Code2 className="h-48 w-48 text-foreground" />
                </div>

                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10">
                    <Database className="h-5 w-5 text-accent" />
                    Webhooks & Events
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl relative z-10">
                    Listen for real-time state changes on your account instead of polling the API. Available events include:
                </p>

                <ul className="space-y-3 font-mono text-sm relative z-10">
                    <li className="flex items-center gap-4 bg-muted/50 p-3 rounded-xl border border-border/50">
                        <span className="text-blue-500 font-bold w-48">order.created</span>
                        <span className="text-muted-foreground">Fired when a new order is placed and payment is secured.</span>
                    </li>
                    <li className="flex items-center gap-4 bg-muted/50 p-3 rounded-xl border border-border/50">
                        <span className="text-orange-500 font-bold w-48">order.shipped</span>
                        <span className="text-muted-foreground">Fired when the carrier scans the tracking slip.</span>
                    </li>
                    <li className="flex items-center gap-4 bg-muted/50 p-3 rounded-xl border border-border/50">
                        <span className="text-green-500 font-bold w-48">inventory.updated</span>
                        <span className="text-muted-foreground">Fired when stock levels drop below the defined minimum threshold.</span>
                    </li>
                    <li className="flex items-center gap-4 bg-muted/50 p-3 rounded-xl border border-border/50">
                        <span className="text-red-500 font-bold w-48">payout.failed</span>
                        <span className="text-muted-foreground">Fired if a scheduled transfer to your bank account is rejected.</span>
                    </li>
                </ul>
            </div>

        </div>
    );
}
