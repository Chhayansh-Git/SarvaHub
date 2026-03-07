import { Resend } from 'resend';
import { config } from '../config';

const resend = new Resend(config.resend.apiKey);
const FROM_EMAIL = config.resend.fromEmail;

// ─── Helpers ────────────────────────────────────────────────────────
function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ─── Email Templates ────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: 'Welcome to SarvaHub! 🎉',
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                    <h1 style="color: #B8860B; margin-bottom: 16px;">Welcome to SarvaHub, ${escapeHtml(name)}!</h1>
                    <p style="color: #555; font-size: 16px; line-height: 1.6;">
                        Thank you for joining the premium marketplace. You now have access to curated luxury products
                        with verified authenticity.
                    </p>
                    <a href="${config.frontendUrl}" style="display: inline-block; background: #B8860B; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
                        Start Exploring
                    </a>
                </div>
            `,
        });
    } catch (err) {
        console.error('Failed to send welcome email:', err);
    }
}

export async function sendOrderConfirmation(to: string, orderId: string, total: number) {
    try {
        const formattedTotal = `₹${(total / 100).toLocaleString('en-IN')}`;
        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `Order Confirmed — ${orderId}`,
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                    <h1 style="color: #B8860B;">Order Confirmed! ✅</h1>
                    <p style="font-size: 16px; color: #555;">Your order <strong>${orderId}</strong> has been placed successfully.</p>
                    <p style="font-size: 20px; font-weight: 600; color: #333;">Total: ${formattedTotal}</p>
                    <a href="${config.frontendUrl}/account/orders" style="display: inline-block; background: #B8860B; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
                        Track Your Order
                    </a>
                </div>
            `,
        });
    } catch (err) {
        console.error('Failed to send order confirmation:', err);
    }
}

export async function sendShippingUpdate(to: string, orderId: string, status: string) {
    try {
        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `Order ${orderId} — ${statusLabel}`,
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                    <h1 style="color: #B8860B;">Shipping Update 📦</h1>
                    <p style="font-size: 16px; color: #555;">Your order <strong>${orderId}</strong> is now: <strong>${statusLabel}</strong></p>
                    <a href="${config.frontendUrl}/account/orders" style="display: inline-block; background: #B8860B; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
                        View Order Details
                    </a>
                </div>
            `,
        });
    } catch (err) {
        console.error('Failed to send shipping update:', err);
    }
}

export async function sendSellerOnboardingConfirmation(to: string, businessName: string) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: 'Seller Application Received — SarvaHub',
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                    <h1 style="color: #B8860B;">Application Submitted! 🎉</h1>
                    <p style="font-size: 16px; color: #555;">
                        Your seller application for <strong>${escapeHtml(businessName)}</strong> has been received.
                        Our team will review your documents within 48 hours.
                    </p>
                    <a href="${config.frontendUrl}/seller/dashboard" style="display: inline-block; background: #B8860B; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
                        Go to Seller Dashboard
                    </a>
                </div>
            `,
        });
    } catch (err) {
        console.error('Failed to send seller onboarding email:', err);
    }
}
