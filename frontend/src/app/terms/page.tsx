export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
                    <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-muted-foreground">Effective Date: October 24, 2026</p>
                </div>

                {/* Content */}
                <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-lg animate-in fade-in slide-in-from-bottom-8 delay-100">
                    <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-border/50">

                        <h2>1. Agreement to Terms</h2>
                        <p>
                            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and SarvaHub ("Company", "we", "us", or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
                        </p>
                        <p>
                            You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Service. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
                        </p>

                        <h2>2. Intellectual Property Rights</h2>
                        <p>
                            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
                        </p>

                        <h2>3. User Representations</h2>
                        <p>
                            By using the Site, you represent and warrant that:
                        </p>
                        <ul>
                            <li>All registration information you submit will be true, accurate, current, and complete.</li>
                            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                            <li>You are not a minor in the jurisdiction in which you reside.</li>
                            <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise.</li>
                        </ul>

                        <h2>4. User Registration</h2>
                        <p>
                            You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                        </p>

                        <h2>5. Products</h2>
                        <p>
                            We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors.
                        </p>

                        <div className="mt-12 p-6 bg-muted border border-border/50 rounded-2xl text-center not-prose">
                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Legal Inquiries</p>
                            <a href="mailto:legal@sarvahub.com" className="font-bold text-foreground hover:text-accent transition-colors">legal@sarvahub.com</a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
