/**
 * SarvaHub Database Seed Script
 *
 * Seeds the database with:
 * - 1 Admin user
 * - 1 Seller (with full verified profile)
 * - 1 Consumer (for organic reviews/orders)
 * - 8 Categories
 * - 40+ premium products across ALL categories
 *
 * Field mapping is carefully matched to the Product schema.
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
import { Order } from '../models/Order';

const makeSlug = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sarvahub';

// ─── Categories ─────────────────────────────────────────────────────
const categories = [
    { name: 'Luxury Watches', slug: 'luxury-watches', description: 'Curated collection of Swiss and haute horlogerie timepieces', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800', subcategories: [{ name: 'Automatic', slug: 'automatic' }, { name: 'Chronograph', slug: 'chronograph' }, { name: 'Dress Watch', slug: 'dress-watch' }] },
    { name: 'Fine Jewelry', slug: 'fine-jewelry', description: 'Handcrafted pieces featuring precious stones and metals', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', subcategories: [{ name: 'Rings', slug: 'rings' }, { name: 'Necklaces', slug: 'necklaces' }, { name: 'Bracelets', slug: 'bracelets' }] },
    { name: 'Designer Bags', slug: 'designer-bags', description: 'Iconic designer handbags and leather goods', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', subcategories: [{ name: 'Tote', slug: 'tote' }, { name: 'Crossbody', slug: 'crossbody' }, { name: 'Clutch', slug: 'clutch' }] },
    { name: 'Premium Audio', slug: 'premium-audio', description: 'High-fidelity audio equipment for audiophiles', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', subcategories: [{ name: 'Headphones', slug: 'headphones' }, { name: 'Earbuds', slug: 'earbuds' }, { name: 'Speakers', slug: 'speakers' }] },
    { name: 'Fragrances', slug: 'fragrances', description: 'Luxury perfumes and niche fragrances', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800', subcategories: [{ name: 'Eau de Parfum', slug: 'edp' }, { name: 'Eau de Toilette', slug: 'edt' }, { name: 'Attars', slug: 'attars' }] },
    { name: 'Sunglasses', slug: 'sunglasses', description: 'Designer eyewear from top luxury brands', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', subcategories: [{ name: 'Aviator', slug: 'aviator' }, { name: 'Wayfarer', slug: 'wayfarer' }, { name: 'Round', slug: 'round' }] },
    { name: 'Luxury Pens', slug: 'luxury-pens', description: 'Fine writing instruments from prestigious brands', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800', subcategories: [{ name: 'Fountain', slug: 'fountain' }, { name: 'Ballpoint', slug: 'ballpoint' }, { name: 'Rollerball', slug: 'rollerball' }] },
    { name: 'Home Décor', slug: 'home-decor', description: 'Curated luxury items for your living space', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', subcategories: [{ name: 'Vases', slug: 'vases' }, { name: 'Art', slug: 'art' }, { name: 'Candles', slug: 'candles' }] },
];

// ─── Product Data ───────────────────────────────────────────────────
// Each product has: name, brand, price (INR), originalPrice, category slug,
// image URL, description, features[], colors[], rating, reviewCount, stock
const products = [
    // ── Luxury Watches (6) ──────────────────────────────────────────
    { name: 'Rolex Submariner Date 41mm', brand: 'Rolex', price: 1150000, originalPrice: 1250000, cat: 'luxury-watches', image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800', description: 'The Oyster Perpetual Submariner Date in Oystersteel with a Cerachrom bezel insert in black ceramic and a black dial. Water-resistant to 300 metres.', features: ['Calibre 3235 Movement', '70-Hour Power Reserve', 'Cerachrom Bezel', 'Oystersteel Case', 'Swiss Chronometer Certified'], colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'Blue', hex: '#003153' }], rating: 4.9, reviewCount: 127, stock: 3 },
    { name: 'Omega Speedmaster Moonwatch', brand: 'Omega', price: 545000, originalPrice: 595000, cat: 'luxury-watches', image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800', description: 'Professional Moonwatch Co-Axial Master Chronometer Chronograph 42 mm. The legendary watch worn on all six lunar missions.', features: ['Calibre 3861 Movement', 'Hesalite Crystal', 'Moonwatch Heritage', '50m Water Resistance', 'METAS Certified'], colors: [{ name: 'Classic Black', hex: '#0d0d0d' }], rating: 4.8, reviewCount: 89, stock: 5 },
    { name: 'Patek Philippe Calatrava', brand: 'Patek Philippe', price: 3200000, originalPrice: 3500000, cat: 'luxury-watches', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800', description: 'Calatrava 5227R-001 in 18K rose gold with ebony black lacquered dial. The epitome of dress watches.', features: ['Calibre 324 SC', '18K Rose Gold Case', 'Sapphire Case Back', 'Hand-Guilloché Hobnail Pattern', 'Geneva Seal'], colors: [{ name: 'Rose Gold', hex: '#b76e79' }], rating: 5.0, reviewCount: 34, stock: 1 },
    { name: 'TAG Heuer Carrera Chronograph', brand: 'TAG Heuer', price: 285000, originalPrice: 320000, cat: 'luxury-watches', image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=800', description: 'Carrera Chronograph 44mm with the in-house Heuer 02 automatic movement offering 80 hours of power reserve.', features: ['Heuer 02 Automatic', '80-Hour Power Reserve', 'Ceramic Bezel', '100m Water Resistance', 'Sapphire Crystal'], colors: [{ name: 'Silver', hex: '#c0c0c0' }, { name: 'Black', hex: '#1a1a1a' }], rating: 4.6, reviewCount: 201, stock: 8 },
    { name: 'Audemars Piguet Royal Oak', brand: 'Audemars Piguet', price: 4500000, originalPrice: 4800000, cat: 'luxury-watches', image: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800', description: 'Royal Oak Selfwinding 41mm in stainless steel with iconic "Grande Tapisserie" blue dial designed by Gérald Genta.', features: ['Calibre 4302', 'Integrated Bracelet', 'Grande Tapisserie Dial', '50m Water Resistance', '70-Hour Power Reserve'], colors: [{ name: 'Royal Blue', hex: '#002366' }], rating: 4.9, reviewCount: 56, stock: 2 },
    { name: 'Cartier Tank Française', brand: 'Cartier', price: 728000, originalPrice: 780000, cat: 'luxury-watches', image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800', description: 'Medium model in steel with silvered dial and steel bracelet. A timeless Art Deco masterpiece since 1917.', features: ['Quartz Movement', 'Steel Bracelet', 'Roman Numeral Dial', 'Sapphire Cabochon Crown', 'Water Resistant 30m'], colors: [{ name: 'Steel Silver', hex: '#d4d4d4' }], rating: 4.7, reviewCount: 142, stock: 4 },

    // ── Fine Jewelry (5) ────────────────────────────────────────────
    { name: 'Tiffany Soleste Engagement Ring', brand: 'Tiffany & Co.', price: 850000, originalPrice: 920000, cat: 'fine-jewelry', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', description: 'Cushion-cut diamond in platinum with a brilliant halo of round diamonds. The quintessential symbol of everlasting love.', features: ['1.5 Carat Center Stone', 'Platinum Setting', 'GIA Certified', 'Halo Design', 'Lifetime Warranty'], colors: [{ name: 'Platinum', hex: '#e5e4e2' }], rating: 4.9, reviewCount: 78, stock: 3 },
    { name: 'Cartier Love Bracelet', brand: 'Cartier', price: 620000, originalPrice: 650000, cat: 'fine-jewelry', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', description: '18K yellow gold bracelet with the iconic screw motif design. Comes with a special screwdriver for a truly personal gesture.', features: ['18K Yellow Gold', 'Iconic Screw Motif', 'Screwdriver Included', 'Certificate of Authenticity', 'Red Maison Box'], colors: [{ name: 'Yellow Gold', hex: '#ffd700' }, { name: 'Rose Gold', hex: '#b76e79' }], rating: 4.8, reviewCount: 215, stock: 6 },
    { name: 'Van Cleef Alhambra Necklace', brand: 'Van Cleef & Arpels', price: 380000, originalPrice: 410000, cat: 'fine-jewelry', image: 'https://images.unsplash.com/photo-1515562141589-67f0d936c5d5?w=800', description: 'Vintage Alhambra pendant in 18K yellow gold with mother-of-pearl. The four-leaf clover has symbolised luck since 1968.', features: ['18K Yellow Gold', 'Mother-of-Pearl', 'Adjustable Chain', 'Signature Clover Motif', 'Maison Certificate'], colors: [{ name: 'Gold', hex: '#ffd700' }], rating: 4.7, reviewCount: 93, stock: 4 },
    { name: 'Bulgari Serpenti Viper Necklace', brand: 'Bulgari', price: 1200000, originalPrice: 1350000, cat: 'fine-jewelry', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', description: 'Serpenti Viper necklace in 18K rose gold set with full pavé diamonds. Bold, sensual, and unmistakably Italian.', features: ['18K Rose Gold', 'Full Pavé Diamonds', 'Serpenti Design', 'Italian Craftsmanship', 'Signature Green Box'], colors: [{ name: 'Rose Gold', hex: '#b76e79' }], rating: 4.8, reviewCount: 45, stock: 2 },
    { name: 'Chopard Happy Diamonds Ring', brand: 'Chopard', price: 295000, originalPrice: 330000, cat: 'fine-jewelry', image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800', description: 'Happy Diamonds ring in 18K ethical white gold with 3 freely moving diamonds dancing between two sapphire crystals.', features: ['18K Ethical White Gold', '3 Mobile Diamonds', 'Sapphire Crystal Sandwich', 'Ethical Sourcing', 'Swiss Made'], colors: [{ name: 'White Gold', hex: '#e8e8e8' }], rating: 4.6, reviewCount: 67, stock: 5 },

    // ── Designer Bags (6) ───────────────────────────────────────────
    { name: 'Hermès Birkin 25', brand: 'Hermès', price: 1500000, originalPrice: 1650000, cat: 'designer-bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', description: 'Birkin 25 in Togo calfskin with palladium hardware. Each bag is entirely hand-stitched by a single artisan over 18 hours.', features: ['Togo Calfskin', 'Palladium Hardware', 'Hand-Stitched', 'Turn-Lock Closure', 'Padlock & Keys'], colors: [{ name: 'Noir', hex: '#1a1a1a' }, { name: 'Gold', hex: '#c5a258' }, { name: 'Etoupe', hex: '#8b7d6b' }], rating: 5.0, reviewCount: 31, stock: 1 },
    { name: 'Chanel Classic Flap Medium', brand: 'Chanel', price: 850000, originalPrice: 920000, cat: 'designer-bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', description: 'Classic Flap in caviar calfskin with gold-tone metal CC turn-lock closure. The most coveted handbag in fashion history.', features: ['Caviar Calfskin', 'Interlocking CC Lock', 'Chain-Link Strap', 'Burgundy Leather Interior', 'Dust Bag Included'], colors: [{ name: 'Classic Black', hex: '#0d0d0d' }], rating: 4.9, reviewCount: 156, stock: 2 },
    { name: 'Louis Vuitton Capucines BB', brand: 'Louis Vuitton', price: 450000, originalPrice: 490000, cat: 'designer-bags', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800', description: 'Capucines BB in supple Taurillon leather with the iconic LV initials inspired by the Maison\'s historic Parisian address.', features: ['Taurillon Leather', 'LV Signature Flap', 'Microfiber Lining', 'Removable Strap', 'Made in France'], colors: [{ name: 'Magnolia', hex: '#f4e1d2' }, { name: 'Noir', hex: '#1a1a1a' }], rating: 4.7, reviewCount: 98, stock: 4 },
    { name: 'Bottega Veneta Pouch', brand: 'Bottega Veneta', price: 280000, originalPrice: 310000, cat: 'designer-bags', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800', description: 'The Pouch in butter calfskin with the signature oversized clutch silhouette that defined a new era for the house.', features: ['Butter Calfskin', 'Oversized Silhouette', 'Suede Lining', 'Magnetic Frame Closure', 'Italian Craftsmanship'], colors: [{ name: 'Almond', hex: '#eed9c4' }, { name: 'Thunder', hex: '#4d4d4d' }], rating: 4.5, reviewCount: 73, stock: 6 },
    { name: 'Gucci Dionysus Small', brand: 'Gucci', price: 195000, originalPrice: 215000, cat: 'designer-bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', description: 'Dionysus GG Supreme small shoulder bag with the hand-painted tiger head closure inspired by the Greek god.', features: ['GG Supreme Canvas', 'Tiger Head Spur', 'Suede Lining', 'Adjustable Strap', 'Made in Italy'], colors: [{ name: 'GG Beige', hex: '#c4a35a' }], rating: 4.6, reviewCount: 184, stock: 7 },
    { name: 'Dior Lady Dior Mini', brand: 'Dior', price: 420000, originalPrice: 460000, cat: 'designer-bags', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800', description: 'Lady Dior mini bag in Cannage lambskin with gold-finish D-I-O-R charms. Originally created for Princess Diana.', features: ['Cannage Lambskin', 'DIOR Letter Charms', 'Removable Chain Strap', 'Zip Closure', 'Suede Interior'], colors: [{ name: 'Black', hex: '#0d0d0d' }, { name: 'Rose Des Vents', hex: '#e8c4c4' }], rating: 4.8, reviewCount: 112, stock: 3 },

    // ── Premium Audio (6) ───────────────────────────────────────────
    { name: 'Apple AirPods Max', brand: 'Apple', price: 59900, originalPrice: 65900, cat: 'premium-audio', image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800', description: 'Over-ear headphones with Active Noise Cancellation, Transparency mode, and spatial audio with dynamic head tracking.', features: ['H1 Chip', 'Active Noise Cancellation', 'Spatial Audio', '20-Hour Battery', 'Digital Crown Controls'], colors: [{ name: 'Space Gray', hex: '#4a4a4a' }, { name: 'Silver', hex: '#e3e3e3' }, { name: 'Sky Blue', hex: '#87ceeb' }], rating: 4.5, reviewCount: 342, stock: 15 },
    { name: 'Sony WH-1000XM5', brand: 'Sony', price: 29990, originalPrice: 34990, cat: 'premium-audio', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800', description: 'Industry-leading noise canceling headphones with Auto NC Optimizer, 30-hour battery, and Speak-to-Chat technology.', features: ['QN1 Processor', '30-Hour Battery', 'Multipoint Connection', 'LDAC Support', 'Touch Sensor Controls'], colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'Platinum Silver', hex: '#d4d4d4' }], rating: 4.7, reviewCount: 567, stock: 20 },
    { name: 'Bose QuietComfort Ultra Earbuds', brand: 'Bose', price: 32900, originalPrice: 36900, cat: 'premium-audio', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800', description: 'World-class noise cancellation with Immersive Audio spatial sound in custom-fit earbuds. IPX4 water resistant.', features: ['CustomTune Technology', 'Immersive Audio', 'IPX4 Rated', '6-Hour Battery', 'Touch Controls'], colors: [{ name: 'Black', hex: '#0d0d0d' }, { name: 'White Smoke', hex: '#f5f5f5' }], rating: 4.6, reviewCount: 289, stock: 12 },
    { name: 'Bang & Olufsen Beoplay A9', brand: 'Bang & Olufsen', price: 325000, originalPrice: 350000, cat: 'premium-audio', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800', description: 'Iconic multiroom speaker with powerful 480-watt amplifier, room adaptation, and Airplay 2 & Chromecast built-in.', features: ['480W Amplifier', 'Room Adaptation', 'AirPlay 2 & Chromecast', 'Oak Legs', 'Touch Interface'], colors: [{ name: 'Natural Oak', hex: '#d2b48c' }, { name: 'Black Anthracite', hex: '#2b2b2b' }], rating: 4.8, reviewCount: 42, stock: 3 },
    { name: 'Sennheiser HD 800 S', brand: 'Sennheiser', price: 149000, originalPrice: 169000, cat: 'premium-audio', image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', description: 'Open-back reference headphones with patented 56mm ring radiator drivers for the widest soundstage in its class.', features: ['56mm Ring Radiator', 'Open-Back Design', 'Absorber Technology', '300Ω Impedance', 'Handmade in Germany'], colors: [{ name: 'Matte Black', hex: '#2b2b2b' }], rating: 4.9, reviewCount: 178, stock: 5 },
    { name: 'Apple AirPods Pro 2', brand: 'Apple', price: 24900, originalPrice: 26900, cat: 'premium-audio', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800', description: '2nd gen with H2 chip, Active Noise Cancellation, Adaptive Transparency, and Personalised Spatial Audio.', features: ['H2 Chip', 'Adaptive Transparency', 'MagSafe Charging Case', 'Up to 6 Hours Playback', 'IPX4 Rated'], colors: [{ name: 'White', hex: '#ffffff' }], rating: 4.7, reviewCount: 891, stock: 25 },

    // ── Fragrances (6) ──────────────────────────────────────────────
    { name: 'Tom Ford Tobacco Vanille', brand: 'Tom Ford', price: 28500, originalPrice: 32000, cat: 'fragrances', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800', description: 'An opulent, warm oriental fragrance. Rich tobacco leaf and aromatic spices are softened with creamy tonka bean and vanilla.', features: ['50ml EDP', 'Oriental Spicy', 'Tobacco & Vanilla Notes', 'Long Lasting 8+ Hours', 'Signature Private Blend'], colors: [], rating: 4.8, reviewCount: 234, stock: 10 },
    { name: 'Creed Aventus', brand: 'Creed', price: 35000, originalPrice: 38000, cat: 'fragrances', image: 'https://images.unsplash.com/photo-1594035910387-fea081e66ef6?w=800', description: 'A bold, masculine fragrance celebrating strength, power, and success. Smoky pineapple and birch over a bed of musk.', features: ['100ml EDP', 'Fruity Chypre', 'Pineapple & Birch Accord', 'Batch-Coded', 'Hand-Finished Bottle'], colors: [], rating: 4.9, reviewCount: 312, stock: 8 },
    { name: 'MFK Baccarat Rouge 540', brand: 'Maison Francis Kurkdjian', price: 32000, originalPrice: 35000, cat: 'fragrances', image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800', description: 'An alchemy of saffron and jasmine, illuminated by ambergris and freshly cut cedar. Luminous, addictive, and hypnotic.', features: ['70ml EDP', 'Amber Floral', 'Saffron & Jasmine', 'Crystal Cap', 'Individually Numbered'], colors: [], rating: 4.9, reviewCount: 198, stock: 6 },
    { name: 'Dior Sauvage Elixir', brand: 'Dior', price: 12500, originalPrice: 14000, cat: 'fragrances', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800', description: 'An ultra-concentrated elixir: raw, noble ingredients like grapefruit, cinnamon, nutmeg, and sandalwood.', features: ['60ml Elixir', 'Aromatic Woody', 'Ultra-Concentrated', 'Grapefruit & Cinnamon', 'Magnetic Cap'], colors: [], rating: 4.6, reviewCount: 445, stock: 18 },
    { name: 'Chanel No. 5 L\'Eau', brand: 'Chanel', price: 15800, originalPrice: 17500, cat: 'fragrances', image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800', description: 'A modern interpretation of the legendary No. 5. Sparkling citrus and ylang-ylang over a clean cedar base.', features: ['100ml EDT', 'Floral Aldehyde', 'Citrus & Ylang-Ylang', 'Iconic Bottle Design', 'Signature Fragrance'], colors: [], rating: 4.7, reviewCount: 367, stock: 14 },
    { name: 'Ajmal Dahn Al Oud Moattaq', brand: 'Ajmal', price: 18500, originalPrice: 21000, cat: 'fragrances', image: 'https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=800', description: 'Premium aged oud oil attar. Rich, woody, and deeply traditional — distilled from sustainably sourced agarwood.', features: ['3ml Pure Attar', 'Aged Oud Oil', 'No Alcohol', 'Traditional Distillation', 'Handcrafted Bottle'], colors: [], rating: 4.5, reviewCount: 56, stock: 7 },

    // ── Sunglasses (4) ──────────────────────────────────────────────
    { name: 'Ray-Ban Aviator Classic', brand: 'Ray-Ban', price: 15900, originalPrice: 17900, cat: 'sunglasses', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', description: 'Iconic aviator sunglasses with gold frame and green G-15 polarized lenses. Originally designed for U.S. Air Force pilots.', features: ['G-15 Polarized Lenses', 'Gold Metal Frame', 'UV400 Protection', 'Teardrop Shape', 'Italian Made'], colors: [{ name: 'Gold/Green', hex: '#c5a258' }, { name: 'Gunmetal/Grey', hex: '#8c8c8c' }], rating: 4.6, reviewCount: 1023, stock: 30 },
    { name: 'Gucci GG0956S Round', brand: 'Gucci', price: 38500, originalPrice: 42000, cat: 'sunglasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', description: 'Round frame sunglasses with the interlocking GG logo at the temples and gradient brown lenses.', features: ['GG Logo Temples', 'Gradient Lenses', 'Acetate Frame', 'UV Protection', 'Italian Craftsmanship'], colors: [{ name: 'Havana', hex: '#8b4513' }], rating: 4.5, reviewCount: 87, stock: 9 },
    { name: 'Tom Ford FT0752 Square', brand: 'Tom Ford', price: 42000, originalPrice: 46000, cat: 'sunglasses', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800', description: 'Bold square acetate frame in dark havana with gradient brown lenses. The T-logo at the temple defines contemporary luxury.', features: ['Acetate Frame', 'T-Logo Hardware', 'Gradient Lenses', 'Full Coverage', 'Velvet-Lined Case'], colors: [{ name: 'Dark Havana', hex: '#4a3222' }], rating: 4.7, reviewCount: 65, stock: 6 },
    { name: 'Prada PR 17WS Runway', brand: 'Prada', price: 35000, originalPrice: 39000, cat: 'sunglasses', image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800', description: 'Runway sunglasses with the distinctive Prada lettering logo and oversized round frame for a statement look.', features: ['Oversized Round Frame', 'Prada Logo', 'Nylon Lenses', 'Metal Bridge', 'Made in Italy'], colors: [{ name: 'Black', hex: '#0d0d0d' }, { name: 'Tortoise', hex: '#7b3f00' }], rating: 4.4, reviewCount: 112, stock: 8 },

    // ── Luxury Pens (4) ─────────────────────────────────────────────
    { name: 'Montblanc Meisterstück 149', brand: 'Montblanc', price: 82000, originalPrice: 92000, cat: 'luxury-pens', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800', description: 'The iconic Meisterstück 149 fountain pen with handcrafted 18K gold nib and piston filling mechanism. The benchmark of fine writing.', features: ['18K Gold Nib', 'Piston Filling', 'Precious Resin Body', 'Platinum-Coated Fittings', 'Serial Number Engraved'], colors: [{ name: 'Classic Black', hex: '#0d0d0d' }], rating: 4.9, reviewCount: 156, stock: 4 },
    { name: 'Parker Duofold Centennial', brand: 'Parker', price: 45000, originalPrice: 52000, cat: 'luxury-pens', image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800', description: 'Big Red lacquer with 18K solid gold nib, celebrating 100 years of the Duofold legacy. Converter and cartridge compatible.', features: ['18K Gold Nib', 'Lacquered Barrel', 'Converter Included', 'Gilt Trim', 'Presentation Box'], colors: [{ name: 'Big Red', hex: '#cc0000' }, { name: 'Classic Black', hex: '#1a1a1a' }], rating: 4.7, reviewCount: 89, stock: 6 },
    { name: 'Cross Townsend Rollerball', brand: 'Cross', price: 28000, originalPrice: 32000, cat: 'luxury-pens', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800', description: 'Premium rollerball pen in lustrous matte black lacquer with 23K gold-plated appointments. Effortlessly smooth writing.', features: ['Rollerball Mechanism', '23K Gold Plating', 'Spring-Loaded Clip', 'Lifetime Warranty', 'Gift Box'], colors: [{ name: 'Matte Black', hex: '#2b2b2b' }], rating: 4.5, reviewCount: 67, stock: 9 },
    { name: 'Lamy 2000 Fountain Pen', brand: 'Lamy', price: 18500, originalPrice: 21000, cat: 'luxury-pens', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800', description: 'Bauhaus-inspired fountain pen from 1966. Makrolon body with brushed stainless steel, piston filler, 14K gold nib.', features: ['14K Gold Nib', 'Piston Filler', 'Makrolon Body', 'Bauhaus Design', 'Snap Cap'], colors: [{ name: 'Black Makrolon', hex: '#1a1a1a' }], rating: 4.8, reviewCount: 234, stock: 11 },

    // ── Home Décor (4) ──────────────────────────────────────────────
    { name: 'Lalique Bacchantes Vase', brand: 'Lalique', price: 285000, originalPrice: 320000, cat: 'home-decor', image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800', description: 'Clear crystal vase featuring female figures in classical relief. Entirely hand-crafted in the Wingen-sur-Moder workshop in France.', features: ['Hand-Blown Crystal', 'Relief Sculpture', 'Signed by Lalique', 'Made in France', '24cm Height'], colors: [{ name: 'Clear Crystal', hex: '#e8e8e8' }], rating: 4.9, reviewCount: 23, stock: 2 },
    { name: 'Diptyque Baies Candle 600g', brand: 'Diptyque', price: 12500, originalPrice: 14000, cat: 'home-decor', image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800', description: 'Iconic blackcurrant and Bulgarian roses scented candle in the signature hand-decorated oval glass. Burns for 90 hours.', features: ['90-Hour Burn Time', 'Natural Wax Blend', 'Hand-Decorated Glass', 'Blackcurrant & Roses', 'Made in France'], colors: [], rating: 4.7, reviewCount: 345, stock: 15 },
    { name: 'Jo Malone Lime Basil & Mandarin Candle', brand: 'Jo Malone', price: 8500, originalPrice: 9500, cat: 'home-decor', image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800', description: 'Peppery basil, aromatic white thyme, and zesty lime in a luxury scented candle encased in the signature cream jar.', features: ['45-Hour Burn Time', 'Soy Wax Blend', 'Signature Cream Jar', 'Lime & Basil Accord', 'British Heritage'], colors: [], rating: 4.6, reviewCount: 213, stock: 12 },
    { name: 'Banksy Girl with Balloon Print', brand: 'Banksy Editions', price: 45000, originalPrice: 55000, cat: 'home-decor', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800', description: 'Licensed museum-quality giclée print of the iconic street art masterpiece. Archival inks on 310gsm cotton rag paper.', features: ['Museum-Quality Giclée', 'Archival Inks', '310gsm Cotton Rag', 'Certificate of Authenticity', 'Limited Edition'], colors: [], rating: 4.4, reviewCount: 78, stock: 8 },
];

// ─── Seed Function ──────────────────────────────────────────────────
async function seed() {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected.');

    // Clear ALL existing data
    console.log('🧹 Clearing ALL existing data...');
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
    console.log('   ✓ All collections cleared.');

    // ── Create Users ────────────────────────────────────────────────
    console.log('👤 Creating users...');
    const passwordHash = await bcrypt.hash('SarvaHub@123', 10);

    await User.create({
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
            businessName: 'Luxury Curations India Pvt Ltd',
            businessType: 'pvt_ltd',
            gstNumber: '27AABCU9603R1ZP',
            panNumber: 'AABCU9603R',
            description: 'An authorized dealer of premium luxury goods since 2018. We pride ourselves on rigorous provenance tracking, concierge-level customer service, and lifetime authenticity guarantees for every item in our collection. All products are sourced directly from manufacturers or authorized distributors.',
            status: 'active',
            location: 'Mumbai, Maharashtra',
            verified: true,
            contactEmail: 'support@luxurycurations.in',
            contactPhone: '+919876543210',
            logo: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200',
            compliance: {
                accountHealth: 'good',
                sellerRating: 4.9,
                warnings: [],
                infractions: [],
                upcomingAudits: [],
            },
        },
    });

    const consumer = await User.create({
        name: 'Arjun Mehta',
        email: 'user@sarvahub.com',
        password: passwordHash,
        role: 'consumer',
        phone: '+919123456789',
    });

    console.log('   Admin  : admin@sarvahub.com  / SarvaHub@123');
    console.log('   Seller : seller@sarvahub.com / SarvaHub@123');
    console.log('   Consumer: user@sarvahub.com  / SarvaHub@123');

    // ── Create Categories ───────────────────────────────────────────
    console.log('📂 Creating categories...');
    const categoryDocs = await Category.insertMany(categories);
    const categoryMap = new Map(categoryDocs.map(c => [c.slug, c._id]));
    console.log(`   ✓ ${categoryDocs.length} categories created.`);

    // ── Create Products ─────────────────────────────────────────────
    console.log('🛍️  Creating products...');
    const now = new Date();
    const productDocs = products.map((p, idx) => {
        const discount = p.originalPrice > p.price
            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
            : 0;
        return {
            name: p.name,
            slug: makeSlug(p.name),
            brand: p.brand,
            price: p.price,
            originalPrice: p.originalPrice,
            discount,
            category: categoryMap.get(p.cat),    // ← Correct field: "category", value: ObjectId
            description: p.description,
            features: p.features,
            images: [{ url: p.image, alt: p.name }],
            colors: p.colors,
            seller: seller._id,
            status: 'active' as const,
            stock: p.stock,
            rating: p.rating,
            reviewCount: p.reviewCount,
            totalSold: Math.floor(p.reviewCount * 1.5),
            authenticity: {
                verified: true,
                batchId: `SVH-${(2024000 + idx).toString()}`,
                origin: 'Authorized Distributor',
                verifiedAt: now,
                inspectionPoints: 12,
            },
            returnPolicy: {
                type: 'Conditional Return',
                windowDays: 7,
                conditions: 'Must remain unused with all original packaging, tags, and authenticity cards intact.',
                eligible: true,
                restockingFeePercent: 0,
            },
            shipping: {
                freeShipping: p.price >= 50000,
                estimatedDays: p.price >= 100000 ? '2-3' : '3-5',
                provider: 'Blue Dart Premium',
            },
        };
    });
    await Product.insertMany(productDocs);
    console.log(`   ✓ ${productDocs.length} products created across ${categoryDocs.length} categories.`);

    // ── Create a sample order for the consumer ──────────────────────
    console.log('📦 Creating sample order...');
    const sampleProduct = productDocs[7]; // Sony WH-1000XM5
    try {
        await Order.create({
            user: consumer._id,
            items: [{
                product: sampleProduct.slug ? await Product.findOne({ slug: sampleProduct.slug }).then(p => p?._id) : undefined,
                name: sampleProduct.name,
                price: sampleProduct.price,
                quantity: 1,
                image: sampleProduct.images[0]?.url || '',
            }],
            shipping: {
                fullName: 'Arjun Mehta',
                phone: '+919123456789',
                addressLine1: '42, Marine Drive',
                addressLine2: 'Apt 14B, Heritage Tower',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400002',
                country: 'India',
            },
            payment: {
                method: 'card',
                status: 'paid',
                transactionId: 'pi_demo_' + Date.now(),
                paidAt: now,
            },
            subtotal: sampleProduct.price,
            tax: Math.round(sampleProduct.price * 0.18),
            shippingCost: 0,
            total: Math.round(sampleProduct.price * 1.18),
            status: 'delivered',
            deliveredAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        });
        console.log('   ✓ 1 sample order created (delivered).');
    } catch (err) {
        console.log('   ⚠ Order creation skipped (model may differ):', (err as Error).message);
    }

    // ── Summary ─────────────────────────────────────────────────────
    console.log('\n🎉 Seed complete!');
    console.log(`   ${categoryDocs.length} categories`);
    console.log(`   ${productDocs.length} products`);
    console.log(`   3 users (admin, seller, consumer)`);
    console.log(`   1 sample order`);

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
