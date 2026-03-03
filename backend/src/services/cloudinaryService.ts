import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

// Configure Cloudinary
cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

export type UploadFolder = 'products' | 'kyc' | 'avatars' | 'banners';

/**
 * Upload a file buffer to Cloudinary.
 * Returns the secure URL and public ID.
 */
export async function uploadToCloudinary(
    fileBuffer: Buffer,
    folder: UploadFolder,
    options?: { transformation?: string }
): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `sarvahub/${folder}`,
                resource_type: 'auto',
                transformation: options?.transformation,
            },
            (error, result) => {
                if (error || !result) {
                    return reject(error || new Error('Upload failed'));
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        uploadStream.end(fileBuffer);
    });
}

/**
 * Delete a file from Cloudinary by public ID.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
