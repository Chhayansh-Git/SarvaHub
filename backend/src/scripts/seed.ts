/**
 * SarvaHub Database Seed Script
 *
 * Seeds the database with:
 * - 1 Admin user
 * - 1 Demo seller
 * - 1 Demo consumer
 * - 8 Categories
 * - 50+ products across categories
 *
 * Run: npx tsx src/scripts/seed.ts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

import { User } from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

/**
 * Normalizes title for slug creation using JS matching
 */
const makeSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sarvahub';

const categories = [
    {
        name: 'Luxury Watches',
        slug: 'luxury-watches',
        description: 'Curated collection of Swiss and haute horlogerie timepieces',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
        subcategories: [
            { name: 'Automatic', slug: 'automatic' },
            { name: 'Chronograph', slug: 'chronograph' },
            { name: 'Dress Watch', slug: 'dress-watch' },
        ],
    },
    {
        name: 'Fine Jewelry',
        slug: 'fine-jewelry',
        description: 'Handcrafted pieces featuring precious stones and metals',
        image: 'https://images.unsplash.com/photo-1515562141589-67f0d362c36c?w=800',
        subcategories: [
            { name: 'Rings', slug: 'rings' },
            { name: 'Necklaces', slug: 'necklaces' },
            { name: 'Bracelets', slug: 'bracelets' },
        ],
    },
    {
        name: 'Designer Bags',
        slug: 'designer-bags',
        description: 'Iconic designer handbags and leather goods',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
        subcategories: [
            { name: 'Tote', slug: 'tote' },
            { name: 'Crossbody', slug: 'crossbody' },
            { name: 'Clutch', slug: 'clutch' },
        ],
    },
    {
        name: 'Premium Audio',
        slug: 'premium-audio',
        description: 'High-fidelity audio equipment for audiophiles',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        subcategories: [
            { name: 'Headphones', slug: 'headphones' },
            { name: 'Earbuds', slug: 'earbuds' },
            { name: 'Speakers', slug: 'speakers' },
        ],
    },
    {
        name: 'Fragrances',
        slug: 'fragrances',
        description: 'Luxury perfumes and niche fragrances',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
        subcategories: [
            { name: 'Eau de Parfum', slug: 'edp' },
            { name: 'Eau de Toilette', slug: 'edt' },
            { name: 'Attars', slug: 'attars' },
        ],
    },
    {
        name: 'Sunglasses',
        slug: 'sunglasses',
        description: 'Designer eyewear from top luxury brands',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
        subcategories: [
            { name: 'Aviator', slug: 'aviator' },
            { name: 'Wayfarer', slug: 'wayfarer' },
            { name: 'Round', slug: 'round' },
        ],
    },
    {
        name: 'Luxury Pens',
        slug: 'luxury-pens',
        description: 'Fine writing instruments from prestigious brands',
        image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800',
        subcategories: [
            { name: 'Fountain', slug: 'fountain' },
            { name: 'Ballpoint', slug: 'ballpoint' },
            { name: 'Rollerball', slug: 'rollerball' },
        ],
    },
    {
        name: 'Home Décor',
        slug: 'home-decor',
        description: 'Curated luxury items for your living space',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        subcategories: [
            { name: 'Vases', slug: 'vases' },
            { name: 'Art', slug: 'art' },
            { name: 'Candles', slug: 'candles' },
        ],
    },
];

const products = [
    // Watches
    { name: 'Rolex Submariner Date 41mm', brand: 'Rolex', price: 1150000_00, category: 'luxury-watches', subcategory: 'automatic', image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800', description: 'The Oyster Perpetual Submariner Date in Oystersteel with a Cerachrom bezel insert in black ceramic.' },
    { name: 'Omega Speedmaster Moonwatch', brand: 'Omega', price: 545000_00, category: 'luxury-watches', subcategory: 'chronograph', image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800', description: 'Professional Moonwatch Co-Axial Master Chronometer Chronograph 42 mm.' },
    { name: 'Patek Philippe Calatrava', brand: 'Patek Philippe', price: 3200000_00, category: 'luxury-watches', subcategory: 'dress-watch', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800', description: 'Calatrava 5227R-001 in 18K rose gold with ebony black lacquered dial.' },
    { name: 'TAG Heuer Carrera', brand: 'TAG Heuer', price: 285000_00, category: 'luxury-watches', subcategory: 'chronograph', image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=800', description: 'Carrera Chronograph 44mm with Heuer 02 automatic movement.' },
    { name: 'Audemars Piguet Royal Oak', brand: 'Audemars Piguet', price: 4500000_00, category: 'luxury-watches', subcategory: 'automatic', image: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800', description: 'Royal Oak Selfwinding 41mm Stainless Steel with blue dial.' },
    { name: 'Cartier Tank Française', brand: 'Cartier', price: 728000_00, category: 'luxury-watches', subcategory: 'dress-watch', image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800', description: 'Medium model, steel, steel bracelet with silvered dial.' },

    // Jewelry
    { name: 'Tiffany Soleste Engagement Ring', brand: 'Tiffany & Co.', price: 850000_00, category: 'fine-jewelry', subcategory: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', description: 'Cushion-cut diamond in platinum with a halo of round brilliant diamonds.' },
    { name: 'Cartier Love Bracelet', brand: 'Cartier', price: 620000_00, category: 'fine-jewelry', subcategory: 'bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', description: '18K yellow gold bracelet with the iconic screw motif design.' },
    { name: 'Van Cleef Alhambra Necklace', brand: 'Van Cleef & Arpels', price: 380000_00, category: 'fine-jewelry', subcategory: 'necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', description: 'Vintage Alhambra pendant in 18K yellow gold with mother-of-pearl.' },
    { name: 'Bulgari Serpenti Necklace', brand: 'Bulgari', price: 1200000_00, category: 'fine-jewelry', subcategory: 'necklaces', image: 'https://images.unsplash.com/photo-1515562141589-67f0d362c36c?w=800', description: 'Serpenti Viper necklace in 18 kt rose gold set with full pavé diamonds.' },
    { name: 'Chopard Happy Diamonds Ring', brand: 'Chopard', price: 295000_00, category: 'fine-jewelry', subcategory: 'rings', image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800', description: 'Happy Diamonds ring in 18K ethical white gold with 3 mobile diamonds.' },

    // Bags
    { name: 'Hermès Birkin 25', brand: 'Hermès', price: 1500000_00, category: 'designer-bags', subcategory: 'tote', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', description: 'Birkin 25 in Togo calfskin with gold hardware, hand-stitched.' },
    { name: 'Chanel Classic Flap Medium', brand: 'Chanel', price: 850000_00, category: 'designer-bags', subcategory: 'crossbody', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', description: 'Classic Flap in caviar calfskin with gold-tone metal CC turn-lock closure.' },
    { name: 'Louis Vuitton Capucines BB', brand: 'Louis Vuitton', price: 450000_00, category: 'designer-bags', subcategory: 'crossbody', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800', description: 'Capucines BB in Taurillon leather with the iconic LV initials.' },
    { name: 'Bottega Veneta Pouch', brand: 'Bottega Veneta', price: 280000_00, category: 'designer-bags', subcategory: 'clutch', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800', description: 'The Pouch in butter calfskin with the signature oversized clutch silhouette.' },
    { name: 'Gucci Dionysus Small', brand: 'Gucci', price: 195000_00, category: 'designer-bags', subcategory: 'crossbody', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', description: 'Dionysus GG Supreme small shoulder bag with tiger head closure.' },
    { name: 'Dior Lady Dior Mini', brand: 'Dior', price: 420000_00, category: 'designer-bags', subcategory: 'crossbody', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800', description: 'Lady Dior mini bag in Cannage lambskin with gold-finish metal charms.' },

    // Audio
    { name: 'Apple AirPods Max', brand: 'Apple', price: 59900_00, category: 'premium-audio', subcategory: 'headphones', image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800', description: 'Over-ear headphones with Active Noise Cancellation, spatial audio with dynamic head tracking.' },
    { name: 'Sony WH-1000XM5', brand: 'Sony', price: 29990_00, category: 'premium-audio', subcategory: 'headphones', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800', description: 'Industry-leading noise canceling headphones with Auto NC Optimizer.' },
    { name: 'Bose QuietComfort Ultra Earbuds', brand: 'Bose', price: 32900_00, category: 'premium-audio', subcategory: 'earbuds', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800', description: 'World-class noise cancellation with Immersive Audio in custom-fit earbuds.' },
    { name: 'Bang & Olufsen Beoplay A9', brand: 'Bang & Olufsen', price: 325000_00, category: 'premium-audio', subcategory: 'speakers', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800', description: 'Iconic multiroom speaker with powerful 480-watt amplifier and room adaptation.' },
    { name: 'Sennheiser HD 800 S', brand: 'Sennheiser', price: 149000_00, category: 'premium-audio', subcategory: 'headphones', image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', description: 'Open-back reference headphones with 56mm ring radiator drivers.' },
    { name: 'Apple AirPods Pro 2', brand: 'Apple', price: 24900_00, category: 'premium-audio', subcategory: 'earbuds', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800', description: '2nd gen with H2 chip, Active Noise Cancellation, and Adaptive Transparency.' },

    // Fragrances
    { name: 'Tom Ford Tobacco Vanille', brand: 'Tom Ford', price: 28500_00, category: 'fragrances', subcategory: 'edp', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800', description: 'Opulent, warm, and iconic. Notes of tobacco leaf, vanilla, and cocoa.' },
    { name: 'Creed Aventus', brand: 'Creed', price: 35000_00, category: 'fragrances', subcategory: 'edp', image: 'https://images.unsplash.com/photo-1594035910387-fea081de22ce?w=800', description: 'A bold, masculine fragrance with notes of pineapple, birch, and musk.' },
    { name: 'Maison Francis Kurkdjian Baccarat Rouge 540', brand: 'MFK', price: 32000_00, category: 'fragrances', subcategory: 'edp', image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800', description: 'An alchemy of jasmine, saffron, and ambergris — luminous and addictive.' },
    { name: 'Dior Sauvage Elixir', brand: 'Dior', price: 12500_00, category: 'fragrances', subcategory: 'edp', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800', description: 'An ultra-concentrated elixir of grapefruit, cinnamon, and sandalwood.' },
    { name: 'Chanel No. 5 L\'Eau', brand: 'Chanel', price: 15800_00, category: 'fragrances', subcategory: 'edt', image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800', description: 'A modern interpretation of the legendary No. 5 with citrus and cedar.' },
    { name: 'Ajmal Dahn Al Oud Moattaq', brand: 'Ajmal', price: 18500_00, category: 'fragrances', subcategory: 'attars', image: 'https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=800', description: 'Premium aged oud oil attar — rich, woody, and deeply traditional.' },

    // Sunglasses
    { name: 'Ray-Ban Aviator Classic', brand: 'Ray-Ban', price: 15900_00, category: 'sunglasses', subcategory: 'aviator', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', description: 'Iconic aviator sunglasses with gold frame and green G-15 polarized lenses.' },
    { name: 'Gucci GG0956S', brand: 'Gucci', price: 38500_00, category: 'sunglasses', subcategory: 'round', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', description: 'Round frame sunglasses with interlocking GG logo and gradient lenses.' },
    { name: 'Tom Ford FT0752', brand: 'Tom Ford', price: 42000_00, category: 'sunglasses', subcategory: 'wayfarer', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800', description: 'Bold square acetate frame in dark havana with gradient brown lenses.' },
    { name: 'Prada PR 17WS', brand: 'Prada', price: 35000_00, category: 'sunglasses', subcategory: 'round', image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800', description: 'Runway sunglasses with distinctive Prada logo and oversized round frame.' },

    // Pens
    { name: 'Montblanc Meisterstück 149', brand: 'Montblanc', price: 82000_00, category: 'luxury-pens', subcategory: 'fountain', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800', description: 'The iconic Meisterstück 149 fountain pen with 18K gold nib and piston filling.' },
    { name: 'Parker Duofold Centennial', brand: 'Parker', price: 45000_00, category: 'luxury-pens', subcategory: 'fountain', image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800', description: 'Big Red lacquer with 18K solid gold nib, celebrating 100 years of Duofold.' },
    { name: 'Cross Townsend Star Wars', brand: 'Cross', price: 28000_00, category: 'luxury-pens', subcategory: 'rollerball', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800', description: 'Limited edition rollerball pen with Star Wars motif in matte black.' },

    // Home Décor
    { name: 'Lalique Bacchantes Vase', brand: 'Lalique', price: 285000_00, category: 'home-decor', subcategory: 'vases', image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800', description: 'Clear crystal vase featuring female figures in relief, handcrafted in France.' },
    { name: 'Diptyque Baies Candle 600g', brand: 'Diptyque', price: 12500_00, category: 'home-decor', subcategory: 'candles', image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800', description: 'Iconic blackcurrant and roses scented candle in signature oval glass.' },
    { name: 'Jo Malone Lime Basil & Mandarin Candle', brand: 'Jo Malone', price: 8500_00, category: 'home-decor', subcategory: 'candles', image: 'https://images.unsplash.com/photo-1603905179682-32a44f640698?w=800', description: 'Peppery basil and aromatic white thyme with zesty lime in luxury candle.' },
    { name: 'Banksy Girl with Balloon Print', brand: 'Banksy Editions', price: 45000_00, category: 'home-decor', subcategory: 'art', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800', description: 'Licensed museum-quality print of the iconic street art masterpiece.' },
];

async function seed() {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected.');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
        User.deleteMany({}),
        Product.deleteMany({}),
        Category.deleteMany({}),
    ]);

    // Create users
    console.log('👤 Creating demo users...');
    const passwordHash = await bcrypt.hash('SarvaHub@123', 10);

    const admin = await User.create({
        name: 'SarvaHub Admin',
        email: 'admin@sarvahub.com',
        password: passwordHash,
        role: 'admin',
    });

    const seller = await User.create({
        name: 'Luxury Curations India',
        email: 'seller@sarvahub.com',
        password: passwordHash,
        role: 'seller',
        sellerProfile: {
            businessName: 'Luxury Curations India',
            businessType: 'pvt_ltd',
            gstNumber: '27AABCU9603R1ZP',
            panNumber: 'AABCU9603R',
            description: 'Premium curated luxury goods from top international brands.',
            status: 'active',
            compliance: {
                listingsRemoved: 0,
                warningsReceived: 0,
            },
        },
    });

    const consumer = await User.create({
        name: 'Arjun Mehta',
        email: 'user@sarvahub.com',
        password: passwordHash,
        role: 'consumer',
    });

    console.log(`   Admin: admin@sarvahub.com / SarvaHub@123`);
    console.log(`   Seller: seller@sarvahub.com / SarvaHub@123`);
    console.log(`   Consumer: user@sarvahub.com / SarvaHub@123`);

    // Create categories
    console.log('📂 Creating categories...');
    const categoryDocs = await Category.insertMany(categories);
    const categoryMap = new Map(categoryDocs.map(c => [c.slug, c._id]));

    // Create products
    console.log('🛍️ Seeding products...');
    const productDocs = products.map((p) => ({
        name: p.name,
        slug: makeSlug(p.name),
        brand: p.brand,
        price: p.price,
        categoryId: categoryMap.get(p.category),
        subcategory: p.subcategory,
        images: [{ url: p.image, alt: p.name }],
        description: p.description,
        seller: seller._id,
        status: 'active',
        stock: Math.floor(Math.random() * 10) + 1,
        authenticity: {
            isVerified: true,
            verifiedAt: new Date(),
            method: 'manual_review',
        },
    }));
    await Product.insertMany(productDocs);

    console.log(`\n🎉 Seed complete!`);
    console.log(`   ${categoryDocs.length} categories`);
    console.log(`   ${productDocs.length} products`);
    console.log(`   3 users (admin, seller, consumer)`);

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
