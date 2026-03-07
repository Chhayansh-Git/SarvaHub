/**
 * One-time script: Populate searchEmbedding on all products.
 *
 * Run with:  npx tsx src/scripts/populateEmbeddings.ts
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { generateEmbedding } from '../services/embeddingService';

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI not set in .env');
        process.exit(1);
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected.\n');

    // Fetch all products (including the searchEmbedding field which is select: false)
    const products = await Product.find({}).select('+searchEmbedding').lean();
    console.log(`📦 Found ${products.length} products.\n`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
        // Build a rich text representation for embedding
        const textParts = [
            product.name,
            product.brand,
            product.description,
            ...(product.features || []),
            ...(product.colors?.map((c: any) => c.name) || []),
        ].filter(Boolean);

        const text = textParts.join(' ');

        try {
            const embedding = await generateEmbedding(text);

            await Product.updateOne(
                { _id: product._id },
                { $set: { searchEmbedding: embedding } }
            );

            updated++;
            console.log(`  ✓ [${updated}/${products.length}] ${product.name}`);
        } catch (err) {
            skipped++;
            console.error(`  ✗ Skipped: ${product.name} — ${err}`);
        }
    }

    console.log(`\n🎉 Done! Updated: ${updated}, Skipped: ${skipped}`);
    await mongoose.disconnect();
    process.exit(0);
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
