# SarvaHub — Feature-Wise Implementation Plan & API Contracts

Premium e-commerce platform (glassmorphism + gradient mesh aesthetic) built with **Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Zustand, Zod**.

---

## Architecture Overview

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (fonts, theme provider, navbar)
│   ├── page.tsx                # Landing page
│   ├── search/page.tsx         # Search results
│   ├── products/
│   │   ├── page.tsx            # PLP (Product Listing)
│   │   └── [slug]/page.tsx     # PDP (Product Detail)
│   ├── checkout/page.tsx       # Multi-step checkout
│   ├── seller/
│   │   ├── layout.tsx          # Seller sidebar layout
│   │   ├── dashboard/page.tsx  # KPI dashboard
│   │   └── listing/
│   │       └── new/page.tsx    # Product listing form
│   └── api/                    # Next.js API routes (proxy to backend)
│       ├── visual-search/route.ts
│       └── qr/route.ts
├── components/
│   ├── layout/                 # Navbar, Footer, Sidebar, ThemeToggle
│   ├── search/                 # OmniSearchBar, VisualSearchModal
│   ├── product/                # ProductCard, ProductCarousel, ShareProduct
│   ├── cart/                   # CartDrawer
│   ├── checkout/               # CheckoutSteps, ShippingForm, PaymentForm
│   ├── seller/                 # KPICard, RevenueChart, ListingForm
│   └── ui/                     # GlassPanel, GradientBg, AnimatedButton
├── store/                      # Zustand stores
│   ├── cartStore.ts
│   ├── userStore.ts
│   ├── searchStore.ts
│   └── themeStore.ts
├── lib/                        # Utilities, API client, types
│   ├── api.ts                  # Centralized fetch wrapper
│   ├── types.ts                # All TypeScript interfaces
│   └── constants.ts            # Theme colors, config
└── styles/
    └── globals.css             # Design tokens, glassmorphism, gradients
```

---

## Phase 1: Project Foundation

### Features
- Next.js 14 App Router + TypeScript + Tailwind CSS
- Glassmorphism design system (`.glass-panel`, `.glass-panel-light`)
- Animated gradient mesh backgrounds (CSS `@keyframes`)
- Light/Dark mode with `ThemeProvider` (Zustand + `prefers-color-scheme`)
- Google Fonts: Manrope (display) + Inter (body)
- Floating orb particles background component

### Files

#### [NEW] globals.css
- CSS custom properties for light/dark themes
- `.glass-panel` / `.glass-panel-light` utilities
- Gradient mesh keyframe animations
- Gold (#C9A96E) accent + full color palette
- Custom cursor glow trail

#### [NEW] ThemeToggle.tsx
- Sun/Moon icon toggle
- Zustand `themeStore` sync + `<html>` class toggle
- Smooth icon rotation animation (Framer Motion)

#### [NEW] themeStore.ts
- State: `mode: 'light' | 'dark'`
- Actions: `toggle()`, `setMode()`
- Persistence: `localStorage` + initial `prefers-color-scheme`

---

## Phase 2: Shared Layout Components

### Features
- Frosted glass navbar (consistent across all consumer pages)
- Seller sidebar layout (separate from consumer nav)
- Footer with glassmorphism social links

### Files

#### [NEW] Navbar.tsx
- SarvaHub logo (diamond icon + gradient text)
- Embedded `OmniSearchBar` (voice mic + camera icons)
- ThemeToggle, Account, Wishlist, Cart (with badge) icons
- Glassmorphism: `backdrop-blur-xl bg-white/70 dark:bg-slate-900/70`
- Mobile responsive: collapsible search on small screens

#### [NEW] Footer.tsx
- 5-column grid: brand, shop links, help, about, social icons
- Dark gradient background with gold accent line
- Floating orb effects

#### [NEW] SellerSidebar.tsx
- Dark glassmorphism panel
- Nav links: Dashboard, Products, Orders, Analytics, Settings
- Gold "New Listing +" CTA button
- User profile card at bottom

---

## Phase 3: Landing Page (`/`)

### Features
- Hero section with gradient overlay + "THE NEW COLLECTION" typography
- Category pills (glassmorphism)
- "Trending Now" product carousel (Amazon-style horizontal scroll)
- "Just Dropped" editorial grid (2-col + sidebar)
- "Sustainable Luxury" editorial section with stats
- Floating orb particles throughout

### Files

#### [NEW] page.tsx (app root)
- Server Component fetching featured products + categories
- Renders Hero, CategoryPills, ProductCarousel sections

#### [NEW] ProductCarousel.tsx
- Horizontal scrollable container with custom arrow overlays
- Snap-to-card behavior, hidden scrollbar
- Framer Motion hover scale on cards

#### [NEW] ProductCard.tsx
- Glass card surface, image with hover scale
- Wishlist heart (opacity transition), "ADD TO BAG" slide-up
- Price display, sale badge, bestseller tag

#### Backend Endpoints Required

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `GET` | `/api/v1/products/featured` | `?section=trending\|just_dropped\|bestsellers&limit=8` | `{ products: Product[], total: number }` |
| `GET` | `/api/v1/categories` | `?parent_id=null` (top-level) | `{ categories: Category[] }` |
| `GET` | `/api/v1/banners` | `?placement=hero\|promo` | `{ banners: Banner[] }` |

---

## Phase 4: Omni-Search Flow (`/search`)

### Features
- Text search with auto-suggestions
- **Voice Search**: Web Speech API → "Listening..." pulse animation → auto-submit
- **Visual Search**: Drag-and-drop image → client-side compression → upload → results
- Search results page with filters

### Files

#### [NEW] OmniSearchBar.tsx
- Text input with glass styling
- Mic icon → triggers `SpeechRecognition` API
- Camera icon → opens `VisualSearchModal`
- Auto-suggestion dropdown (glass panel)

#### [NEW] VisualSearchModal.tsx
- Framer Motion `AnimatePresence` entry/exit
- Drag-and-drop zone with dashed border
- Canvas-based image compression before upload
- Skeleton loader while waiting for results
- POST to `/api/visual-search` → redirect to `/search?imageRef=xyz`

#### [NEW] search/page.tsx
- Reads `?q=` or `?imageRef=` from URL params
- Product grid + FilterSidebar
- Sort dropdown (Price low/high, Newest, Rating)

#### Backend Endpoints Required

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `GET` | `/api/v1/search` | `?q=string&page=1&limit=20&sort=price_asc` | `{ products: Product[], total: number, facets: Facet[] }` |
| `GET` | `/api/v1/search/suggestions` | `?q=string&limit=5` | `{ suggestions: string[] }` |
| `POST` | `/api/v1/search/visual` | `FormData: { image: File }` | `{ imageRef: string, products: Product[] }` |

---

## Phase 5: Product Listing Page (`/products`)

### Features
- Dynamic faceted filter sidebar (category, brand, size, price, color, rating)
- 3-column product grid with glassmorphism cards
- Pagination (glass-pill buttons)
- URL query param sync (bookmarkable filters)
- Sort dropdown

### Files

#### [NEW] products/page.tsx
- Server Component fetching paginated products with filters
- Renders FilterSidebar + product grid + Pagination

#### [NEW] FilterSidebar.tsx
- Receives facets from API → renders checkboxes, range sliders, color swatches
- Zustand `searchStore` state ↔ URL query params sync (shallow routing)
- Glass card container, gold active states

#### [NEW] Pagination.tsx
- Glass-pill page buttons, gold active indicator
- Prev/Next arrows

#### Backend Endpoints Required

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `GET` | `/api/v1/products` | `?category=string&brand=string[]&size=string[]&price_min=num&price_max=num&color=string[]&rating=num&page=1&limit=20&sort=string` | `{ products: Product[], total: number, facets: Facet[], page: number, totalPages: number }` |
| `GET` | `/api/v1/products/filters` | `?category=string` | `{ facets: Facet[] }` |

---

## Phase 6: Product Detail Page (`/products/[slug]`)

### Features
- Split-screen: sticky image gallery (left) + purchase panel (right)
- Image gallery with thumbnails + video play button
- Color swatches + size selector (gold active state)
- "ADD TO BAG" (shimmer CTA) + "WISHLIST"
- **Share Product**: social icons (WhatsApp, IG, X, FB, Email, Copy Link) + "Share via QR" modal
- QR code glassmorphism modal with "Download QR" button
- Accordion sections (Product Details, Shipping, Care Instructions)
- Customer reviews section (rating bars, verified reviews)
- "You May Also Like" carousel

### Files

#### [NEW] products/[slug]/page.tsx
- Server Component fetching product by slug + reviews + related
- Renders gallery, purchase panel, reviews, related carousel

#### [NEW] ShareProduct.tsx
- Row of social share icons (with deep links for WA, email `mailto:`, twitter intent)
- "Share via QR" button → toggles QR modal
- QR modal: glassmorphism card, canvas-generated QR, "Download QR" saves as PNG
- Copy link → clipboard API + toast notification

#### [NEW] ReviewSection.tsx
- Rating breakdown bar chart
- Individual review cards (glass panel)
- "Write a Review" button
- Pagination for reviews

#### Backend Endpoints Required

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `GET` | `/api/v1/products/:slug` | — | `{ product: ProductDetail }` |
| `GET` | `/api/v1/products/:slug/reviews` | `?page=1&limit=10&sort=newest` | `{ reviews: Review[], average: number, distribution: RatingDist, total: number }` |
| `POST` | `/api/v1/products/:slug/reviews` | `{ rating: number, title: string, body: string, images?: string[] }` | `{ review: Review }` |
| `GET` | `/api/v1/products/:slug/related` | `?limit=8` | `{ products: Product[] }` |
| `POST` | `/api/v1/products/:slug/share/qr` | `{ format: 'png'\|'svg', size: number }` | `{ qrCodeUrl: string }` |
| `POST` | `/api/v1/wishlist` | `{ productId: string }` | `{ success: boolean }` |
| `DELETE` | `/api/v1/wishlist/:productId` | — | `{ success: boolean }` |

---

## Phase 7: Cart & Checkout (`/checkout`)

### Features

#### Cart Drawer
- Glassmorphism slide-out panel (Framer Motion)
- Product thumbnails, quantity ±, "Remove" links
- Subtotal / Shipping / Total breakdown
- Gold "Proceed to Checkout" CTA

#### Checkout Page (Multi-Step)
- **Step 1 — Account**: Login/Sign-up or continue as guest
- **Step 2 — Shipping**: Address form (Zod validation, react-hook-form)
- **Step 3 — Payment**: Stripe Elements or Razorpay integration stub
- Progress stepper with glass-pill styling
- Order summary sidebar (glass card)
- Discount code input with "Apply" button

### Files

#### [NEW] CartDrawer.tsx
- Framer Motion `AnimatePresence` slide from right
- Zustand `cartStore` connection for items + totals
- Quantity controls (glass-pill ± buttons)
- Background backdrop dim + gradient bleed-through

#### [NEW] checkout/page.tsx
- Multi-step wizard component managing step state
- Redirects to login if unauthenticated (Step 1)

#### [NEW] ShippingForm.tsx
- Fields: firstName, lastName, email, phone, address, city, state, zip, country
- Zod schema validation, react-hook-form integration
- "Save this address" checkbox
- Glass input styling with gold focus glow

#### [NEW] PaymentForm.tsx
- Stripe `CardElement` or Razorpay button integration stub
- Glass card container for card input
- "Place Order" gold CTA

#### [NEW] cartStore.ts
- State: `items: CartItem[]`, `isOpen: boolean`
- Computed: `totalItems`, `subtotal`, `shipping`, `total`
- Actions: `addItem`, `removeItem`, `updateQuantity`, `toggleDrawer`, `clearCart`
- `localStorage` persistence via Zustand `persist` middleware

#### Backend Endpoints Required

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `GET` | `/api/v1/cart` | — | `{ items: CartItem[], subtotal: number, shipping: number, tax: number, total: number }` |
| `POST` | `/api/v1/cart/items` | `{ productId: string, variantId: string, quantity: number }` | `{ cart: Cart }` |
| `PATCH` | `/api/v1/cart/items/:itemId` | `{ quantity: number }` | `{ cart: Cart }` |
| `DELETE` | `/api/v1/cart/items/:itemId` | — | `{ cart: Cart }` |
| `POST` | `/api/v1/cart/discount` | `{ code: string }` | `{ valid: boolean, discount: Discount, newTotal: number }` |
| `POST` | `/api/v1/orders` | `{ shippingAddress: Address, paymentMethodId: string, cartId: string }` | `{ order: Order, paymentIntent: { clientSecret: string } }` |
| `GET` | `/api/v1/orders/:orderId` | — | `{ order: OrderDetail }` |
| `POST` | `/api/v1/payments/create-intent` | `{ amount: number, currency: string }` | `{ clientSecret: string }` |

---

## Phase 8A: Seller Onboarding & Verification (`/seller/onboarding`)

> Modeled after Amazon Seller Central, Flipkart Seller Hub, and Myntra Partner flows. Ensures only verified, trusted sellers operate on SarvaHub.

### Seller Registration Tiers & Fees

| Tier | Monthly Fee | Commission | Features |
|------|------------|------------|----------|
| **Starter** | Free trial (30 days) → ₹999/mo | 15% per sale | Up to 50 products, basic analytics |
| **Professional** | ₹2,499/mo | 10% per sale | Unlimited products, advanced analytics, priority support |
| **Enterprise** | ₹9,999/mo | 7% per sale | Dedicated account manager, API access, bulk tools, featured placement |

### Multi-Step Onboarding Flow (8 Steps)

**Step 1 — Seller Type Selection**
- Choose: `Brand Owner / Manufacturer` | `Authorized Reseller / Distributor` | `Retailer`
- Each type triggers different verification requirements downstream
- Glass card selection UI with icons

**Step 2 — Business Information**
- Legal business name, trade name (DBA)
- Business type: Sole Proprietorship | Partnership | LLP | Pvt Ltd | OPC
- Business registration number (CIN / LLPIN / Shop Act)
- Date of incorporation
- Business address (with PIN code → auto-detect state)
- GSTIN (mandatory, validated via GST API)
- PAN number (individual or business)

**Step 3 — Owner/Contact KYC**
- Primary contact: Full name, designation, email, phone (OTP verified)
- Government ID upload: Aadhaar / Passport / Driving License / Voter ID
- Live selfie verification or video KYC (facial match against ID)
- Address proof: Utility bill / bank statement (last 90 days)

**Step 4 — Bank Account Verification**
- Account holder name, account number, IFSC code
- Cancelled cheque upload or bank statement
- Penny-drop verification (₹1 test credit to confirm account)
- Only current/business accounts accepted (no savings)

**Step 5 — Brand Authorization**
- **Brand Owners**: Trademark certificate (™/®) upload, brand logo
- **Resellers/Distributors**: Brand authorization letter / NOC from brand, authorized distributor invoices (last 6 months)
- **Retailers**: Purchase invoices from authorized sources, MRP tag photos
- Brand name + category mapping

**Step 6 — Warehouse & Fulfillment Setup**
- Primary pickup address (PIN + Google Maps location)
- Warehouse operating hours
- Fulfillment model: Self-ship | SarvaHub Fulfilled | Hybrid
- Return address (can differ from pickup)
- Packaging standards agreement (checkbox)

**Step 7 — Support & Contact Information**
- Customer support email, phone number, working hours
- Return/exchange policy text (or use SarvaHub default template)
- Dispute resolution contact
- Social media handles (optional)

**Step 8 — Subscription Plan & Payment**
- Choose tier: Starter / Professional / Enterprise
- Payment via Razorpay (card, UPI, net banking)
- Auto-renewal toggle, billing cycle selection (monthly/annual)
- Terms & conditions acceptance + digital signature

### Verification Pipeline (Backend)
After submission, the application goes through:
1. **Auto-checks**: GSTIN validation (GST API), PAN verification, bank penny-drop
2. **Document review**: Admin team reviews uploaded KYC docs (1-3 business days)
3. **Status states**: `pending` → `under_review` → `approved` | `rejected` | `action_required`
4. **Notification**: Email + SMS at each status change
5. On approval → seller redirected to `/seller/dashboard`

### Files

#### [NEW] seller/onboarding/page.tsx
- Multi-step wizard with 8 steps, progress bar
- Framer Motion step transitions, glass card containers

#### [NEW] SellerTypeSelector.tsx — Step 1 card selection
#### [NEW] BusinessInfoForm.tsx — Step 2 (Zod validation for GSTIN, PAN format)
#### [NEW] KYCForm.tsx — Step 3 (ID upload + selfie capture via webcam)
#### [NEW] BankVerificationForm.tsx — Step 4 (IFSC lookup + penny-drop trigger)
#### [NEW] BrandAuthForm.tsx — Step 5 (conditional fields by seller type)
#### [NEW] WarehouseForm.tsx — Step 6 (address + map + fulfillment model)
#### [NEW] SupportInfoForm.tsx — Step 7 (support details + policy editor)
#### [NEW] SubscriptionPlanSelector.tsx — Step 8 (pricing cards + Razorpay checkout)
#### [NEW] OnboardingStatusPage.tsx — Post-submission tracking page

#### Backend Endpoints — Seller Onboarding

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `POST` | `/api/v1/seller/register` | `{ sellerType, businessInfo, ownerKYC }` | `{ applicationId: string, status: 'pending' }` |
| `POST` | `/api/v1/seller/kyc/upload` | `FormData: { documentType, file }` | `{ documentId: string, url: string }` |
| `POST` | `/api/v1/seller/kyc/selfie` | `FormData: { selfie: File }` | `{ matched: boolean, confidence: number }` |
| `POST` | `/api/v1/seller/bank/verify` | `{ accountNumber, ifsc, holderName }` | `{ verified: boolean, pennyDropRef: string }` |
| `GET` | `/api/v1/seller/bank/ifsc/:code` | — | `{ bank: string, branch: string, address: string }` |
| `POST` | `/api/v1/seller/brand/authorize` | `FormData: { brandName, authType, documents[] }` | `{ brandAuthId: string, status: 'pending' }` |
| `POST` | `/api/v1/seller/warehouse` | `{ address, hours, fulfillmentModel, returnAddress }` | `{ warehouseId: string }` |
| `POST` | `/api/v1/seller/subscription` | `{ planId, paymentMethodId, billingCycle }` | `{ subscriptionId: string, razorpayOrderId: string }` |
| `GET` | `/api/v1/seller/onboarding/status` | — | `{ status, steps: StepStatus[], remarks?: string }` |
| `POST` | `/api/v1/seller/gstin/validate` | `{ gstin: string }` | `{ valid: boolean, legalName: string, state: string }` |
| `POST` | `/api/v1/seller/pan/validate` | `{ pan: string }` | `{ valid: boolean, name: string }` |

---

## Phase 8B: Seller Dashboard (`/seller/dashboard`)

### Features
- Dark glassmorphism theme with gradient mesh
- 4 KPI cards: Revenue, Orders, Products Listed, Conversion
- Revenue trend line chart, recent orders table with status badges
- Seller trust score badge
- Quick actions: New Listing, View Orders, Analytics

### Files

#### [NEW] seller/dashboard/page.tsx — KPI cards + chart + orders table
#### [NEW] KPICard.tsx — Glass card, trend arrow, hover glow
#### [NEW] RevenueChart.tsx — SVG line chart with gold gradient fill
#### [NEW] SellerTrustBadge.tsx — Verified/Pro/Enterprise badge display

#### Backend Endpoints — Dashboard

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `GET` | `/api/v1/seller/dashboard` | — | `{ revenue: KPI, orders: KPI, products: KPI, conversion: KPI, trustScore: number }` |
| `GET` | `/api/v1/seller/revenue` | `?period=7d\|30d\|90d` | `{ data: { date: string, amount: number }[] }` |
| `GET` | `/api/v1/seller/orders` | `?page=1&limit=10&status=all` | `{ orders: SellerOrder[], total: number }` |

---

## Phase 8C: Product Listing with Authenticity Tracking (`/seller/listing/new`)

> Every product on SarvaHub must carry provenance data. This prevents counterfeit goods and ensures only authentic, traceable products are sold.

### Multi-Step Listing Form (7 Steps)

**Step 1 — Basic Details**
- Product name, short description, long description (rich text)
- Primary category → sub-category → product type (3-level hierarchy)
- Brand (auto-complete from verified brands, or request new brand approval)
- Product condition: `New` | `Refurbished` | `Open Box`

**Step 2 — Authenticity & Sourcing (CRITICAL)**
This step changes based on seller type:

**For Brand Owners / Manufacturers:**
- Manufacturing unit name & address
- Manufacturing license number (if applicable, e.g. FSSAI for food, BIS for electronics)
- Batch/lot number
- Date of manufacture
- Shelf life / expiry date (if applicable)
- Country of origin
- Raw material sourcing details (optional but encouraged):
  - Primary material source country
  - Ethical sourcing certification (Fair Trade, GOTS, OEKO-TEX, etc.)

**For Authorized Resellers / Distributors:**
- Authorized distributor invoice upload (mandatory)
- Invoice date + invoice number
- Brand authorization letter reference (linked from onboarding)
- Product code / MPN (Manufacturer Part Number)
- GTIN / UPC / EAN barcode number
- Date of manufacture (from product label)
- Best before / expiry date (from product label)
- MRP as printed on product

**For Retailers:**
- Purchase invoice upload (mandatory — proves legitimate sourcing)
- Supplier name + GSTIN
- Product code / MPN / model number
- GTIN / UPC / EAN barcode scan
- Date of manufacture (from product packaging)
- Best before / expiry (from product label)
- MRP printed on product vs. selling price
- Serial number (for electronics, luxury goods)
- Import details (if imported): Bill of Entry number, customs clearance date

**Step 3 — Category-Specific Attributes**
Dynamic fields that appear based on the selected category:

| Category | Required Fields |
|----------|----------------|
| **Fashion/Apparel** | Fabric composition (%), care instructions, fit type (Regular/Slim/Relaxed), neckline, sleeve, pattern, occasion, wash care symbols |
| **Electronics** | Model number, serial number, power rating (W), voltage, warranty months, BIS certification number, SAR value (phones) |
| **Beauty/Cosmetics** | Ingredients list (INCI), skin type, allergen warnings, dermatologist tested (Y/N), cruelty-free certification, PAO (Period After Opening) |
| **Food/Grocery** | FSSAI license number, nutritional info (calories, fat, protein, carbs per serving), allergen declaration, veg/non-veg symbol, storage instructions |
| **Watches/Jewelry** | Hallmark/purity certification (BIS Hallmark), karat, gemstone type + weight, movement type (automatic/quartz), water resistance rating |
| **Home/Furniture** | Dimensions (L×W×H), weight capacity, material, assembly required (Y/N), safety certifications (BIFMA, ISO) |
| **Toys** | Age group, safety certification (EN 71, ASTM F963, BIS), small parts choking hazard warning, battery requirements |
| **Books/Media** | ISBN, author, publisher, edition, language, page count, binding type |

**Step 4 — Images & Media**
- Drag-and-drop multi-upload (min 3, max 10 images)
- Primary image selection (used as thumbnail)
- Image guidelines overlay (white background, no watermarks, min 1000×1000px)
- 360° view upload (optional)
- Video upload (optional, max 60s product demo)
- Authenticity proof images: MRP tag photo, barcode scan, certification sticker

**Step 5 — Pricing & Inventory**
- MRP (Maximum Retail Price — as printed on product)
- Selling price (must be ≤ MRP)
- Cost price (for seller's internal P&L, not shown to consumers)
- SKU (Stock Keeping Unit — seller's internal code)
- Inventory count
- Low stock alert threshold
- Tax category (GST slab: 0% / 5% / 12% / 18% / 28%)
- HSN/SAC code (Harmonized System Nomenclature for GST)

**Step 6 — Shipping & Returns**
- Product weight (grams)
- Package dimensions (L × W × H in cm)
- Fragile flag (Y/N → special handling)
- Shipping class: Standard | Express | Same-day eligible
- Return policy: SarvaHub default | Custom (days, conditions)
- Replacement available: Y/N
- COD (Cash on Delivery) available: Y/N

**Step 7 — Review & Submit**
- Summary of all entered data in organized sections
- Edit links per section (jump back to any step)
- "Submit for Review" → product enters moderation queue
- Product status: `draft` → `under_review` → `approved` → `live` | `rejected`
- On approval → Success Modal with QR code + social share

### Files

#### [NEW] seller/listing/new/page.tsx — 7-step form manager with Framer Motion
#### [NEW] BasicDetailsForm.tsx — Step 1 (category cascade dropdown)
#### [NEW] AuthenticityForm.tsx — Step 2 (conditional by seller type, invoice upload, batch/MPN)
#### [NEW] CategoryAttributesForm.tsx — Step 3 (dynamic fields config per category)
#### [NEW] ProductMediaUpload.tsx — Step 4 (drag-drop, preview grid, guidelines)
#### [NEW] PricingInventoryForm.tsx — Step 5 (MRP vs selling price validation, HSN code)
#### [NEW] ShippingReturnsForm.tsx — Step 6 (weight/dimensions, shipping class)
#### [NEW] ListingReview.tsx — Step 7 (read-only summary, edit links)
#### [NEW] SuccessModal.tsx — QR code + share icons + "View Product" links
#### [NEW] categoryFieldsConfig.ts — JSON config mapping category → required fields

#### Backend Endpoints — Product Listing

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `POST` | `/api/v1/seller/products` | Full listing payload (see below) | `{ product: Product, qrCodeUrl: string }` |
| `PUT` | `/api/v1/seller/products/:id` | Same as POST | `{ product: Product }` |
| `DELETE` | `/api/v1/seller/products/:id` | — | `{ success: boolean }` |
| `GET` | `/api/v1/seller/products/:id/status` | — | `{ status, moderationRemarks?: string }` |
| `POST` | `/api/v1/upload/images` | `FormData: { files: File[] }` | `{ urls: string[] }` |
| `POST` | `/api/v1/upload/documents` | `FormData: { type, file }` | `{ documentUrl: string }` |
| `GET` | `/api/v1/categories/tree` | — | `{ categories: CategoryTree[] }` (3-level) |
| `GET` | `/api/v1/categories/:id/attributes` | — | `{ requiredFields: FieldConfig[] }` |
| `GET` | `/api/v1/hsn/lookup` | `?query=string` | `{ results: { code: string, description: string, gstRate: number }[] }` |
| `POST` | `/api/v1/barcode/validate` | `{ code: string, type: 'UPC'\|'EAN'\|'GTIN' }` | `{ valid: boolean, product?: { name: string, brand: string } }` |

**Full Product Listing Payload:**
```typescript
{
  // Step 1
  name: string; shortDescription: string; longDescription: string;
  categoryId: string; subCategoryId: string; productTypeId: string;
  brandId: string; condition: 'new' | 'refurbished' | 'open_box';

  // Step 2 — Authenticity
  authenticity: {
    sellerType: 'brand_owner' | 'reseller' | 'retailer';
    manufacturerName?: string; manufacturerAddress?: string;
    manufacturingLicense?: string; batchNumber?: string;
    dateOfManufacture: string; expiryDate?: string;
    countryOfOrigin: string; mpn?: string;
    gtin?: string; serialNumber?: string;
    invoiceUrl?: string; invoiceNumber?: string; invoiceDate?: string;
    authorizationLetterRef?: string;
    mrpPrinted?: number;
    importDetails?: {
      billOfEntryNumber: string; customsClearanceDate: string;
    };
    sourcing?: {
      materialSourceCountry?: string;
      certifications?: string[]; // e.g. ['Fair Trade', 'GOTS']
    };
  };

  // Step 3 — Category-specific (dynamic key-value)
  attributes: Record<string, string | number | boolean>;

  // Step 4
  images: string[]; primaryImageIndex: number;
  video?: string; threeSixtyView?: string;
  authenticityProofImages?: string[];

  // Step 5
  mrp: number; sellingPrice: number; costPrice: number;
  sku: string; inventory: number; lowStockThreshold: number;
  taxCategory: string; hsnCode: string;

  // Step 6
  weight: number; dimensions: { l: number; w: number; h: number };
  fragile: boolean; shippingClass: string;
  returnPolicy: 'default' | 'custom'; returnDays?: number;
  replacementAvailable: boolean; codAvailable: boolean;
}
```

---

## Phase 9: Auth

### Features
- Login/Register modals (glassmorphism)
- JWT token storage + refresh
- Role-based redirects (consumer → home, seller → onboarding or dashboard)
- Consumer registration is simple (name + email + password)
- Seller registration redirects to the onboarding flow (Phase 8A)

### Backend Endpoints

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `POST` | `/api/v1/auth/register` | `{ name, email, password, role }` | `{ user: User, accessToken, refreshToken }` |
| `POST` | `/api/v1/auth/login` | `{ email, password }` | `{ user: User, accessToken, refreshToken }` |
| `POST` | `/api/v1/auth/refresh` | `{ refreshToken }` | `{ accessToken }` |
| `GET` | `/api/v1/auth/me` | Bearer token | `{ user: User }` |
| `POST` | `/api/v1/auth/logout` | `{ refreshToken }` | `{ success: true }` |

---

## TypeScript Interfaces (Key Types)

```typescript
interface Product {
  id: string; slug: string; name: string; brand: string;
  price: number; comparePrice?: number; discount?: number;
  images: string[]; category: string; rating: number;
  reviewCount: number; tags: string[]; inStock: boolean;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  authenticity?: ProductAuthenticity;
}

interface ProductAuthenticity {
  sellerType: 'brand_owner' | 'reseller' | 'retailer';
  countryOfOrigin: string;
  dateOfManufacture: string;
  mpn?: string; gtin?: string;
  batchNumber?: string;
  verified: boolean;
  trustScore: number; // 0-100
}

interface SellerProfile {
  id: string; businessName: string; tradeName: string;
  sellerType: 'brand_owner' | 'reseller' | 'retailer';
  gstin: string; pan: string; tier: 'starter' | 'professional' | 'enterprise';
  verificationStatus: 'pending' | 'under_review' | 'approved' | 'rejected';
  trustScore: number; supportEmail: string; supportPhone: string;
  warehouse: { address: string; fulfillmentModel: string };
  brandAuthorizations: BrandAuth[];
}

interface BrandAuth {
  brandName: string; authType: 'owner' | 'authorized' | 'retailer';
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
}

interface CartItem {
  id: string; productId: string; name: string; image: string;
  price: number; quantity: number; color?: string; size?: string;
}

interface Review {
  id: string; userId: string; userName: string; rating: number;
  title: string; body: string; images?: string[];
  verified: boolean; createdAt: string; helpfulCount: number;
}

interface Facet {
  key: string; label: string;
  type: 'checkbox' | 'range' | 'color' | 'rating';
  options?: { value: string; label: string; count: number }[];
  range?: { min: number; max: number };
}

interface User {
  id: string; name: string; email: string;
  role: 'consumer' | 'seller' | 'admin'; avatar?: string;
  sellerProfile?: SellerProfile;
}

interface Order {
  id: string; items: CartItem[]; status: string;
  total: number; createdAt: string;
  shippingAddress: Address; trackingNumber?: string;
}

interface CategoryFieldConfig {
  category: string;
  fields: {
    key: string; label: string; type: 'text' | 'number' | 'select' | 'boolean' | 'textarea';
    required: boolean; options?: string[]; placeholder?: string;
    validation?: { min?: number; max?: number; pattern?: string };
  }[];
}
---

## Phase 10: Returns, Refunds & Exchanges (`/account/orders/:id/return`)

> Self-service return portal enabling customers to initiate returns, exchanges, and track refund status — reducing support load while keeping the experience premium.

### Return/Exchange Flow (Customer Side)

**Step 1 — Select Order & Items**
- Customer goes to "My Orders" → clicks "Return/Exchange" on an eligible order
- Selects specific items to return (checkboxes)
- System checks return eligibility (within return window, item condition rules)
- Non-returnable items shown greyed out with reason tooltip

**Step 2 — Reason & Type**
- Return reason (required): `Wrong size/fit` | `Defective/Damaged` | `Not as described` | `Changed mind` | `Better price elsewhere` | `Other`
- Optional: Upload photos of issue (damaged item, wrong product)
- Choose resolution: `Refund to original payment` | `Store Credit (instant)` | `Exchange for different size/color`
- If exchange → show available variants to swap

**Step 3 — Pickup / Drop-off**
- Pickup scheduling: select date + time slot (powered by logistics partner)
- Or drop-off at nearest partner location (PIN code → location list)
- Packaging instructions ("Use original packaging if available")
- Prepaid shipping label auto-generated (PDF download)

**Step 4 — Confirmation & Tracking**
- Return request summary with expected refund timeline
- Return status tracking: `Requested` → `Pickup Scheduled` → `Picked Up` → `Received at Warehouse` → `Quality Check` → `Refund Initiated` → `Refund Completed`
- Email + SMS notifications at each status change
- Estimated refund: 5-7 business days (original payment) / Instant (store credit)

### Seller Return Dashboard
- Sellers see incoming returns in `/seller/dashboard` → "Returns" tab
- Accept/Reject return with remarks
- Quality inspection results (if SarvaHub Fulfilled)
- Return analytics: return rate %, top reasons, category breakdown

### Refund Rules Engine
| Condition | Refund % | Timeline |
|-----------|----------|----------|
| Within 7 days, unused, tags intact | 100% | 5-7 days |
| 7-15 days, unused | 100% | 7-10 days |
| Defective/damaged (any time within warranty) | 100% + return shipping | 3-5 days |
| Used/washed (fashion) | 0% — rejected | N/A |
| Store credit chosen | 100% + 5% bonus credit | Instant |
| Exchange | No refund — direct swap | Ship within 2-3 days |

### Files

#### [NEW] account/orders/[id]/return/page.tsx — 4-step return wizard
#### [NEW] ReturnItemSelector.tsx — Order items with eligibility check
#### [NEW] ReturnReasonForm.tsx — Reason + photo upload + resolution choice
#### [NEW] PickupScheduler.tsx — Date/time slot selector + drop-off location map
#### [NEW] ReturnTracker.tsx — Status timeline with step indicators
#### [NEW] ExchangeVariantPicker.tsx — Size/color swap selector
#### [NEW] seller/returns/page.tsx — Seller return management dashboard
#### [NEW] returnStore.ts — Zustand store for return flow state

#### Backend Endpoints — Returns & Refunds

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `GET` | `/api/v1/orders/:id/return-eligibility` | — | `{ eligible: boolean, items: ReturnEligibleItem[], returnWindow: string }` |
| `POST` | `/api/v1/returns` | `{ orderId, items: [{ itemId, reason, resolution, photos?[] }] }` | `{ returnId: string, status: 'requested' }` |
| `GET` | `/api/v1/returns/:id` | — | `{ return: ReturnRequest }` (full details with timeline) |
| `GET` | `/api/v1/returns` | `?page=1&status=all` | `{ returns: ReturnRequest[], total: number }` |
| `PATCH` | `/api/v1/returns/:id/pickup` | `{ date: string, timeSlot: string, address: Address }` | `{ pickupId: string, estimatedPickup: string }` |
| `GET` | `/api/v1/returns/:id/label` | — | `{ labelUrl: string }` (prepaid shipping label PDF) |
| `POST` | `/api/v1/returns/:id/exchange` | `{ newVariantId: string }` | `{ exchangeOrderId: string }` |
| `GET` | `/api/v1/seller/returns` 🔒 | `?page=1&status=pending` | `{ returns: SellerReturnItem[], total: number }` |
| `PATCH` | `/api/v1/seller/returns/:id` 🔒 | `{ action: 'accept'\|'reject', remarks?: string }` | `{ status: string }` |
| `GET` | `/api/v1/refunds/:returnId` | — | `{ refund: Refund }` |

---

## Phase 11: Customer Support & Help Center (`/support`)

> Comprehensive support system with FAQ knowledge base, live chat, ticket system, and dedicated sections for both consumers and sellers.

### Help Center / FAQ Hub (`/support`)
Glassmorphism page with categorized FAQ sections.

**Consumer FAQ Categories:**
| Category | Example Questions |
|----------|-------------------|
| **Orders & Shipping** | Where is my order? How to track? Shipping charges? Delivery time? |
| **Returns & Exchanges** | How to return? Return window? Exchange process? Non-returnable items? |
| **Refunds** | When will I get my refund? Refund to store credit? Partial refund? |
| **Payments** | Payment methods accepted? COD? EMI options? Payment failed? |
| **Account** | How to reset password? Delete account? Update address? |
| **Product Authenticity** | How to verify product? What is trust score? Counterfeit policy? |

**Seller FAQ Categories:**
| Category | Example Questions |
|----------|-------------------|
| **Onboarding** | Registration steps? KYC documents? Approval timeline? |
| **Listing** | How to list products? Category-specific requirements? Image guidelines? |
| **Payments & Fees** | Commission rates? Payout schedule? Subscription plans? |
| **Returns** | How are returns handled? Seller return policy? Quality inspection? |
| **Account & Compliance** | GSTIN update? Brand authorization? Account suspension? |
| **Dashboard & Analytics** | Revenue reports? Export data? Trust score improvement? |

### Live Chat & Ticket System
- **AI Chatbot** (first line): Answers common FAQs, guides returns, checks order status
- **Escalation**: "Talk to a human" → creates a support ticket
- **Ticket system**: Subject, category, priority, description, attachments
- **Ticket tracking**: `Open` → `In Progress` → `Awaiting Customer` → `Resolved` → `Closed`
- Email notification at each status change

### Contact Us Page (`/support/contact`)
- Phone support: business hours display
- Email support: auto-response with ticket ID
- WhatsApp support (deep link)
- Social media links

### Files

#### [NEW] support/page.tsx — Help center hub with search + category cards
#### [NEW] FAQSection.tsx — Accordion-style Q&A (glass panels, animated expand)
#### [NEW] FAQSearch.tsx — Search across all FAQs with instant results
#### [NEW] support/contact/page.tsx — Contact form + channels
#### [NEW] ChatWidget.tsx — Floating chat bubble (bottom-right), glassmorphism chat panel
#### [NEW] ChatBot.tsx — AI chatbot logic + escalation flow
#### [NEW] TicketForm.tsx — Support ticket creation form (Zod validated)
#### [NEW] TicketTracker.tsx — Ticket status timeline
#### [NEW] support/tickets/page.tsx — My support tickets list
#### [NEW] seller/support/page.tsx — Seller-specific FAQ + ticket dashboard

#### Backend Endpoints — Support

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `GET` | `/api/v1/support/faqs` | `?category=returns&role=consumer\|seller&q=search` | `{ faqs: FAQ[], total: number }` |
| `GET` | `/api/v1/support/faqs/categories` | `?role=consumer\|seller` | `{ categories: { slug, name, count, icon }[] }` |
| `POST` | `/api/v1/support/chat` | `{ message: string, sessionId?: string }` | `{ reply: string, sessionId: string, escalated: boolean }` |
| `POST` | `/api/v1/support/tickets` 🔒 | `{ subject, category, priority, description, attachments?[] }` | `{ ticketId: string, status: 'open' }` |
| `GET` | `/api/v1/support/tickets` 🔒 | `?page=1&status=all` | `{ tickets: Ticket[], total: number }` |
| `GET` | `/api/v1/support/tickets/:id` 🔒 | — | `{ ticket: TicketDetail }` (with message thread) |
| `POST` | `/api/v1/support/tickets/:id/reply` 🔒 | `{ message: string, attachments?[] }` | `{ message: TicketMessage }` |
| `PATCH` | `/api/v1/support/tickets/:id/close` 🔒 | — | `{ status: 'closed' }` |

---

## Phase 12: Feedback & Improvement System (`/feedback`)

> Collect actionable feedback from both consumers and sellers to continuously improve the platform.

### Feedback Collection Points

**Post-Purchase Feedback** (triggered after delivery)
- Star rating (1-5) for: Product quality, Delivery speed, Packaging, Overall experience
- Optional text comment
- Would you recommend SarvaHub? (NPS — Net Promoter Score: 0-10)

**Post-Return Feedback** (triggered after return is completed)
- Was the return process easy? (1-5)
- Were you satisfied with the resolution?
- What could we improve?

**General Platform Feedback** (`/feedback` page)
- Category: `Feature suggestion` | `Bug report` | `UI/UX improvement` | `General praise` | `Complaint`
- Description (rich text)
- Screenshot upload (optional)
- Priority: `Low` | `Medium` | `High`
- Upvote/downvote existing suggestions (public feedback board)

**Seller Feedback**
- Rate seller dashboard usability (1-5)
- Listing process ease of use
- Payout transparency
- Support responsiveness
- Feature requests for seller tools

### Public Feedback Board (`/feedback/board`)
- Community-visible suggestions, sorted by upvotes
- Status badges: `Under Review` | `Planned` | `In Progress` | `Shipped` | `Declined`
- Admin responses on each suggestion
- Filter by category, status, most upvoted

### Files

#### [NEW] feedback/page.tsx — Feedback submission form (glass card)
#### [NEW] feedback/board/page.tsx — Public suggestion board
#### [NEW] FeedbackForm.tsx — Category + description + screenshot upload
#### [NEW] PostPurchaseSurvey.tsx — Modal shown after delivery (star ratings + NPS)
#### [NEW] PostReturnSurvey.tsx — Modal shown after return completed
#### [NEW] FeedbackCard.tsx — Individual suggestion card with upvote, status badge
#### [NEW] NPSWidget.tsx — Net Promoter Score slider (0-10)

#### Backend Endpoints — Feedback

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `POST` | `/api/v1/feedback` 🔒 | `{ category, description, screenshots?[], priority }` | `{ feedbackId: string }` |
| `GET` | `/api/v1/feedback/board` | `?page=1&category=all&sort=upvotes\|newest&status=all` | `{ suggestions: Feedback[], total: number }` |
| `POST` | `/api/v1/feedback/:id/vote` 🔒 | `{ direction: 'up'\|'down' }` | `{ voteCount: number }` |
| `POST` | `/api/v1/feedback/survey/purchase` 🔒 | `{ orderId, ratings: { quality, delivery, packaging, overall }, nps, comment? }` | `{ success: true }` |
| `POST` | `/api/v1/feedback/survey/return` 🔒 | `{ returnId, easeRating, satisfied, comment? }` | `{ success: true }` |
| `POST` | `/api/v1/feedback/seller` 🔒 | `{ dashboardRating, listingEase, payoutTransparency, supportRating, featureRequest? }` | `{ success: true }` |

---

## TypeScript Interfaces (Key Types)

```typescript
interface Product {
  id: string; slug: string; name: string; brand: string;
  price: number; comparePrice?: number; discount?: number;
  images: string[]; category: string; rating: number;
  reviewCount: number; tags: string[]; inStock: boolean;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  authenticity?: ProductAuthenticity;
}

interface ProductAuthenticity {
  sellerType: 'brand_owner' | 'reseller' | 'retailer';
  countryOfOrigin: string;
  dateOfManufacture: string;
  mpn?: string; gtin?: string;
  batchNumber?: string;
  verified: boolean;
  trustScore: number;
}

interface SellerProfile {
  id: string; businessName: string; tradeName: string;
  sellerType: 'brand_owner' | 'reseller' | 'retailer';
  gstin: string; pan: string; tier: 'starter' | 'professional' | 'enterprise';
  verificationStatus: 'pending' | 'under_review' | 'approved' | 'rejected';
  trustScore: number; supportEmail: string; supportPhone: string;
  warehouse: { address: string; fulfillmentModel: string };
  brandAuthorizations: BrandAuth[];
}

interface BrandAuth {
  brandName: string; authType: 'owner' | 'authorized' | 'retailer';
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
}

interface ReturnRequest {
  id: string; orderId: string; items: ReturnItem[];
  reason: string; resolution: 'refund' | 'store_credit' | 'exchange';
  status: 'requested' | 'pickup_scheduled' | 'picked_up' | 'received' | 'quality_check' | 'refund_initiated' | 'completed' | 'rejected';
  photos?: string[]; pickupDate?: string; pickupSlot?: string;
  refund?: Refund; exchangeOrderId?: string;
  createdAt: string; updatedAt: string;
  timeline: { status: string; timestamp: string; note?: string }[];
}

interface ReturnItem {
  itemId: string; productName: string; image: string;
  quantity: number; price: number; reason: string;
}

interface Refund {
  id: string; returnId: string; amount: number;
  method: 'original_payment' | 'store_credit';
  status: 'pending' | 'processing' | 'completed';
  estimatedDate: string; completedDate?: string;
}

interface Ticket {
  id: string; subject: string; category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'awaiting_customer' | 'resolved' | 'closed';
  messages: TicketMessage[]; createdAt: string; updatedAt: string;
}

interface TicketMessage {
  id: string; sender: 'customer' | 'agent' | 'bot';
  message: string; attachments?: string[]; createdAt: string;
}

interface FAQ {
  id: string; question: string; answer: string;
  category: string; role: 'consumer' | 'seller' | 'both';
  helpful: number; unhelpful: number;
}

interface Feedback {
  id: string; userId: string; userName: string;
  category: 'feature' | 'bug' | 'ux' | 'praise' | 'complaint';
  description: string; screenshots?: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'under_review' | 'planned' | 'in_progress' | 'shipped' | 'declined';
  upvotes: number; downvotes: number;
  adminResponse?: string; createdAt: string;
}

interface CartItem {
  id: string; productId: string; name: string; image: string;
  price: number; quantity: number; color?: string; size?: string;
}

interface Review {
  id: string; userId: string; userName: string; rating: number;
  title: string; body: string; images?: string[];
  verified: boolean; createdAt: string; helpfulCount: number;
}

interface Facet {
  key: string; label: string;
  type: 'checkbox' | 'range' | 'color' | 'rating';
  options?: { value: string; label: string; count: number }[];
  range?: { min: number; max: number };
}

interface User {
  id: string; name: string; email: string;
  role: 'consumer' | 'seller' | 'admin'; avatar?: string;
  sellerProfile?: SellerProfile;
}

interface Order {
  id: string; items: CartItem[]; status: string;
  total: number; createdAt: string;
  shippingAddress: Address; trackingNumber?: string;
}

interface CategoryFieldConfig {
  category: string;
  fields: {
    key: string; label: string; type: 'text' | 'number' | 'select' | 'boolean' | 'textarea';
    required: boolean; options?: string[]; placeholder?: string;
    validation?: { min?: number; max?: number; pattern?: string };
  }[];
}
```

---

## Implementation Order

| Phase | What | Est. Files |
|-------|------|------------|
| 1 | Scaffolding + Design System + Theme | ~6 |
| 2 | Navbar + Footer + Sidebar + Stores | ~8 |
| 3 | Landing Page + Carousels + Cards | ~5 |
| 4 | Omni-Search (Voice + Visual) | ~4 |
| 5 | PLP (Filters + Grid + Pagination) | ~4 |
| 6 | PDP (Gallery + Share + QR + Reviews) | ~5 |
| 7 | Cart Drawer + Checkout Flow | ~5 |
| 8A | Seller Onboarding (8-step KYC + verification) | ~12 |
| 8B | Seller Dashboard | ~4 |
| 8C | Product Listing (7-step with authenticity) | ~11 |
| 9 | Auth Modals + Guards | ~4 |
| 10 | Returns / Refunds / Exchanges | ~8 |
| 11 | Customer Support + FAQs + Tickets | ~10 |
| 12 | Feedback & Improvement System | ~7 |
| **Total** | | **~93 files** |

---

## Verification Plan

### Automated (Browser Testing)
- `npm run dev` → verify each route renders
- Test voice search mic interaction
- Test visual search modal upload flow
- Test filter sidebar URL sync
- Test cart add/remove/quantity
- Test checkout form Zod validation
- **Test seller onboarding: complete all 8 steps**
- **Test product listing: 7 steps with category-specific fields**
- Test listing form → success modal → QR + share
- **Test return flow: initiate return → pick reason → schedule pickup**
- **Test support: FAQ search + ticket creation + chat widget**
- **Test feedback: submit suggestion + upvote on board**
- Test light/dark mode toggle on every page

### Manual (by user)
- Review glassmorphism + gradient consistency per page
- Verify Framer Motion animations are smooth
- Walk through seller onboarding end-to-end
- Verify category-specific fields render correctly
- Test return/refund flow from order history
- Test FAQ categories for consumer and seller
- Test responsive breakpoints (desktop focus)

