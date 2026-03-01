import Image from "next/image";

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-background">

            {/* Hero Section */}
            <div className="pt-32 pb-24 border-b border-border/50">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6">
                        Redefining Luxury Commerce
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        SarvaHub is a premier global marketplace dedicated to curating the finest electronics, fashion, and lifestyle products, bridging the gap between world-class creators and discerning connoisseurs.
                    </p>
                </div>
            </div>

            {/* Image Grid */}
            <div className="container mx-auto px-4 py-20 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 aspect-video rounded-3xl overflow-hidden bg-muted">
                        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200" alt="Boutique Store" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-square md:aspect-auto rounded-3xl overflow-hidden bg-muted">
                        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600" alt="Product Detail" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Stats & Vision */}
            <div className="bg-muted pb-24 pt-24 mt-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="uppercase text-accent font-bold tracking-widest text-xs mb-4 block">Our Vision</span>
                            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-6">
                                Quality Without Compromise
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                Founded in 2026, SarvaHub was built on a singular belief: shopping online for premium goods should feel as luxurious and secure as walking into a flagship boutique.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We meticulously verify every seller and authenticate products to guarantee that what you see is what you experience. Our platform is not just a marketplace; it is an ecosystem of trust.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="glass-panel p-8 rounded-3xl bg-background border border-border/50">
                                <h3 className="text-4xl font-black mb-2 text-foreground text-center">2M+</h3>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider text-center font-bold">Active Members</p>
                            </div>
                            <div className="glass-panel p-8 rounded-3xl bg-background border border-border/50">
                                <h3 className="text-4xl font-black mb-2 text-foreground text-center">45+</h3>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider text-center font-bold">Countries</p>
                            </div>
                            <div className="glass-panel p-8 rounded-3xl border border-accent/20 bg-accent/5">
                                <h3 className="text-4xl font-black mb-2 text-accent text-center">100%</h3>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider text-center font-bold">Authentic</p>
                            </div>
                            <div className="glass-panel p-8 rounded-3xl bg-background border border-border/50">
                                <h3 className="text-4xl font-black mb-2 text-foreground text-center">24/7</h3>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider text-center font-bold">Support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
