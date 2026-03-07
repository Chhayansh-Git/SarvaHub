import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { config } from '../config';

// ─── Ensure uploads directory exists ────────────────────────────────
const UPLOAD_DIR = path.resolve(__dirname, '../../uploads/qrcodes');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Details to embed inside the QR code payload.
 */
export interface QrProductDetails {
    productName: string;
    brand: string;
    price: number;
    originalPrice?: number;
    category?: string;
    sellerName: string;
    sellerId: string;
    authenticity: string;
    productUrl: string;
}

/**
 * QR Code Engine Service.
 *
 * Generates a QR code image that embeds full product+seller details
 * as a JSON payload. This makes each QR code self-contained for
 * authenticity verification when scanned.
 */
export class QrCodeService {
    /**
     * Builds the JSON data string to encode inside the QR.
     */
    private static buildPayload(details: QrProductDetails): string {
        return JSON.stringify({
            platform: 'SarvaHub',
            product: details.productName,
            brand: details.brand,
            price: details.price,
            originalPrice: details.originalPrice,
            category: details.category,
            seller: details.sellerName,
            sellerId: details.sellerId,
            authenticity: details.authenticity,
            url: details.productUrl,
            generatedAt: new Date().toISOString(),
        });
    }

    /**
     * Generates a QR code PNG image buffer from product details.
     */
    static async generateBuffer(details: QrProductDetails): Promise<Buffer> {
        const payload = this.buildPayload(details);
        const buffer = await QRCode.toBuffer(payload, {
            type: 'png',
            width: 512,
            margin: 2,
            color: {
                dark: '#1F2937',
                light: '#FFFFFF',
            },
            errorCorrectionLevel: 'H',
        });
        return buffer;
    }

    /**
     * Generates a QR code and uploads it.
     * Tries Cloudinary first; falls back to local filesystem.
     */
    static async generateAndUpload(productId: string, details: QrProductDetails): Promise<string> {
        const buffer = await this.generateBuffer(details);

        // Try Cloudinary upload
        try {
            const cloudinary = (await import('cloudinary')).v2;
            const result: any = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'sarvahub/qrcodes', public_id: `${productId}_qr`, format: 'png' },
                    (err: any, result: any) => (err ? reject(err) : resolve(result))
                );
                stream.end(buffer);
            });
            return result.secure_url;
        } catch {
            // Cloudinary not configured — fall back to local filesystem
        }

        // Fallback: local filesystem
        const filename = `${productId}_qr.png`;
        const filePath = path.join(UPLOAD_DIR, filename);
        await fs.promises.writeFile(filePath, buffer);
        return `${config.cdnBaseUrl}/qr/${filename}`;
    }

    /**
     * Generates a QR code as a Base64 data URL string.
     */
    static async generateDataUrl(details: QrProductDetails): Promise<string> {
        const payload = this.buildPayload(details);
        const dataUrl = await QRCode.toDataURL(payload, {
            width: 512,
            margin: 2,
            color: {
                dark: '#1F2937',
                light: '#FFFFFF',
            },
            errorCorrectionLevel: 'H',
        });
        return dataUrl;
    }
}

