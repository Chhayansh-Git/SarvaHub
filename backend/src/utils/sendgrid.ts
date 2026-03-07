import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@sarvahub.com';

if (apiKey) {
    sgMail.setApiKey(apiKey);
}

/**
 * Send an email using SendGrid
 * @param to Recipient email
 * @param subject Email subject
 * @param text Email plain text content
 * @param html Email HTML content (optional)
 */
export const sendEmail = async (to: string, subject: string, text: string, html?: string): Promise<boolean> => {
    try {
        if (!apiKey) {
            console.warn('⚠️ SendGrid API Key missing. Mocking email to:', to);
            console.warn(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Text: ${text}`);
            return true;
        }

        const msg = {
            to,
            from: fromEmail,
            subject,
            text,
            html: html || text,
        };

        await sgMail.send(msg);
        return true;
    } catch (error) {
        console.error('SendGrid Error:', error);
        return false;
    }
};

// Generates a random 6-digit OTP
export const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
