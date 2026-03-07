import mongoose from 'mongoose';
import { User } from './models/User';
import { config } from './config';

async function seedSellers() {
    console.log('Connecting to database...');
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.mongodbUri);

    console.log('Running backfill for existing sellers...');
    const result = await User.updateMany(
        { role: 'seller', 'sellerProfile.status': { $exists: true } },
        {
            $set: {
                'sellerProfile.kycDetails': {
                    documentType: 'pan_card',
                    documentNumber: 'XXXXX1234X',
                    documentUrl: 'https://example.com/doc.pdf',
                    verificationStatus: 'verified',
                    submittedAt: new Date(),
                    verifiedAt: new Date()
                },
                'sellerProfile.bankDetails': {
                    accountName: 'Legacy Seller',
                    accountNumber: '1234567890',
                    last4: '7890',
                    ifsc: 'HDFC0001234',
                    bankName: 'HDFC Bank'
                }
            }
        }
    );

    console.log(`Backfill complete. Modified ${result.modifiedCount} seller documents.`);
    process.exit(0);
}

seedSellers().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
