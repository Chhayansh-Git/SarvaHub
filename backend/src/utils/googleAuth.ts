import { OAuth2Client } from 'google-auth-library';
import { config } from '../config';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (idToken: string) => {
    try {
        if (!process.env.GOOGLE_CLIENT_ID) {
            console.warn('⚠️ Google Client ID missing. Mocking verification for:', idToken);
            // Mock response for testing when keys are absent
            return {
                email: 'mockuser@sarvahub.com',
                name: 'Mock Google User',
                sub: '12345mockgoogleid67890',
            };
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        console.error('Error verifying Google Token:', error);
        return null;
    }
};
