import mongoose from 'mongoose';
import { Product, User } from '../src/models';
import { QrCodeService } from '../src/services/qrCodeService';
import { generateSlug } from '../src/utils/slugify';
import { config } from '../src/config';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

async function run() {
    try {
        await mongoose.connect(config.mongodbUri);
        console.log('Connected to DB');

        // Find any seller
        const seller = await User.findOne({ role: 'seller' });
        if (!seller) {
            console.log('No seller found to simulate with.');
            process.exit(1);
        }

        const body = {
            name: "Test Smart Watch " + Date.now(),
            brand: "TechCorp",
            description: "A premium smart watch with health tracking.",
            price: 5999,
            originalPrice: 7999,
            category: "Electronics",
            stock: 50,
            features: ["Heart Rate", "GPS", "Waterproof"],
            images: [
                { url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800", alt: "Watch View 1" }
            ],
            authenticity: {
                verified: true,
                batch: "TC-SW-" + Date.now(),
                origin: "Bangalore, India"
            }
        };

        const slug = generateSlug(body.name);

        const productData = {
            ...body,
            slug,
            seller: seller._id,
            discount: Math.round(((body.originalPrice - body.price) / body.originalPrice) * 100)
        };

        const product = new Product(productData);
        await product.save();
        console.log('Product created:', product.name, product._id);

        const productUrl = `http://localhost:3000/products/${slug}`;
        const sellerName = seller.sellerProfile?.businessName || seller.name || 'Unknown';

        console.log('Generating QR Code...');
        const qrCodeUrl = await QrCodeService.generateAndUpload(product._id as string, {
            productName: body.name,
            brand: body.brand,
            price: productData.price,
            originalPrice: productData.originalPrice,
            category: body.category,
            sellerName,
            sellerId: String(seller._id),
            authenticity: 'verified',
            productUrl,
        });

        product.qrCodeUrl = qrCodeUrl;
        await product.save();
        console.log('QR Code generated and saved:', qrCodeUrl);
        console.log('Frontend URL to verify:', productUrl);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
