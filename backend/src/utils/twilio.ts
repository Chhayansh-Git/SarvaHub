import twilio from 'twilio';

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// Initialize client only if credentials exist
export const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

/**
 * Send an OTP via Twilio Verify API
 * @param to Phone number with country code (e.g. +1234567890)
 */
export const sendSmsOtp = async (to: string): Promise<boolean> => {
    try {
        if (!twilioClient || !verifyServiceSid) {
            console.warn('⚠️ Twilio credentials missing. Mocking SMS OTP to:', to);
            console.warn(`[MOCK SMS] Your OTP for ${to} is 123456`);
            return true;
        }

        const verification = await twilioClient.verify.v2
            .services(verifyServiceSid)
            .verifications.create({ to, channel: 'sms' });

        return verification.status === 'pending';
    } catch (error) {
        console.error('Twilio Send OTP Error:', error);
        return false;
    }
};

/**
 * Verify an OTP via Twilio Verify API
 * @param to Phone number with country code
 * @param code The 6-digit OTP code
 */
export const verifySmsOtp = async (to: string, code: string): Promise<boolean> => {
    try {
        if (!twilioClient || !verifyServiceSid) {
            console.warn('⚠️ Twilio credentials missing. Mocking OTP verification.');
            return code === '123456';
        }

        const verificationCheck = await twilioClient.verify.v2
            .services(verifyServiceSid)
            .verificationChecks.create({ to, code });

        return verificationCheck.status === 'approved';
    } catch (error) {
        console.error('Twilio Verify OTP Error:', error);
        return false;
    }
};
