export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
                    <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground">Last Updated: October 24, 2026</p>
                </div>

                {/* Content */}
                <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-lg animate-in fade-in slide-in-from-bottom-8 delay-100">
                    <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-border/50">

                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to <strong>SarvaHub</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                        </p>

                        <h2>2. The Data We Collect About You</h2>
                        <p>
                            Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                        </p>
                        <ul>
                            <li><strong>Identity Data</strong> includes first name, maiden name, last name, username or similar identifier, marital status, title, date of birth and gender.</li>
                            <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                            <li><strong>Financial Data</strong> includes bank account and payment card details.</li>
                            <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                        </ul>

                        <h2>3. How We Use Your Personal Data</h2>
                        <p>
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul>
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal or regulatory obligation.</li>
                        </ul>

                        <h2>4. Data Security</h2>
                        <p>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                        </p>

                        <div className="mt-12 p-6 bg-accent/5 border border-accent/20 rounded-2xl text-center not-prose">
                            <h3 className="text-xl font-bold mb-2">Have a question about your data?</h3>
                            <p className="text-muted-foreground mb-4">Our Data Protection Officer can be reached directly.</p>
                            <a href="mailto:privacy@sarvahub.com" className="font-bold text-accent hover:underline">privacy@sarvahub.com</a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
