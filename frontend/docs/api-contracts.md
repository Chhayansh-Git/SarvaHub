# SarvaHub — Backend API Contracts

> **Version**: 1.0.0  
> **Date**: March 1, 2026  
> **Purpose**: This document defines every REST API endpoint that the SarvaHub frontend expects. Each endpoint includes the HTTP method, URL, request parameters/body, and the **exact JSON response shape** the frontend will parse. Hand this to the backend engineer for seamless integration.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Users & Profiles](#2-users--profiles)
3. [Products](#3-products)
4. [Categories](#4-categories)
5. [Search](#5-search)
6. [Cart](#6-cart)
7. [Checkout & Orders](#7-checkout--orders)
8. [Wishlist](#8-wishlist)
9. [Reviews & Ratings](#9-reviews--ratings)
10. [Returns & Refunds](#10-returns--refunds)
11. [Support & Tickets](#11-support--tickets)
12. [Feedback](#12-feedback)
13. [Notifications](#13-notifications)
14. [Payments](#14-payments)
15. [Seller: Onboarding](#15-seller-onboarding)
16. [Seller: Dashboard & Analytics](#16-seller-dashboard--analytics)
17. [Seller: Product Management](#17-seller-product-management)
18. [Seller: Order Fulfillment](#18-seller-order-fulfillment)
19. [Seller: Returns](#19-seller-returns)
20. [Seller: Settings](#20-seller-settings)
21. [Seller: Support Tickets](#21-seller-support-tickets)
22. [Seller: Compliance](#22-seller-compliance)
23. [Featured & Curated Collections](#23-featured--curated-collections)

---

## Global Conventions

| Convention | Detail |
|---|---|
| **Base URL** | `https://api.sarvahub.com/v1` |
| **Auth** | Bearer token in `Authorization` header. Token obtained from `/auth/login` or `/auth/register`. |
| **Pagination** | Standard `page` (1-indexed) and `limit` query params. Response includes `pagination` object. |
| **Errors** | `{ "error": { "code": "RESOURCE_NOT_FOUND", "message": "..." } }` |
| **Dates** | ISO 8601 (`2026-03-01T12:00:00Z`) |
| **Currency** | All monetary values in **paisa** (integer). Frontend divides by 100 for display. |
| **IDs** | UUID v4 strings (e.g., `"prod_x8922"`) |

### Standard Pagination Response Wrapper

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 342,
    "totalPages": 18,
    "hasNextPage": true
  }
}
```

---

## 1. Authentication

### `POST /auth/register`

**Request Body:**
```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.in",
  "password": "SecureP@ss123",
  "role": "consumer"
}
```
> `role` enum: `"consumer"` | `"seller"`

**Response `201 Created`:**
```json
{
  "user": {
    "id": "usr_a1b2c3d4",
    "name": "Aarav Sharma",
    "email": "aarav@example.in",
    "role": "consumer",
    "avatar": null,
    "createdAt": "2026-03-01T12:00:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g..."
}
```

### `POST /auth/login`

**Request Body:**
```json
{
  "email": "aarav@example.in",
  "password": "SecureP@ss123"
}
```

**Response `200 OK`:**
```json
{
  "user": {
    "id": "usr_a1b2c3d4",
    "name": "Aarav Sharma",
    "email": "aarav@example.in",
    "role": "consumer",
    "avatar": "https://cdn.sarvahub.com/avatars/usr_a1b2c3d4.jpg"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g..."
}
```

### `POST /auth/refresh`

**Request Body:**
```json
{ "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g..." }
```

**Response `200 OK`:**
```json
{
  "accessToken": "eyJuZXdUb2tlbg...",
  "refreshToken": "bmV3UmVmcmVzaA..."
}
```

### `POST /auth/logout`

**Headers:** `Authorization: Bearer <accessToken>`

**Response `204 No Content`**

---

## 2. Users & Profiles

### `GET /users/me`
> Returns the authenticated user's full profile.

**Response `200 OK`:**
```json
{
  "id": "usr_a1b2c3d4",
  "name": "Aarav Sharma",
  "email": "aarav@example.in",
  "phone": "+91-9876543210",
  "role": "consumer",
  "avatar": "https://cdn.sarvahub.com/avatars/usr_a1b2c3d4.jpg",
  "addresses": [
    {
      "id": "addr_001",
      "label": "Home",
      "line1": "123 Luxury Ave, Bandra West",
      "line2": "Apt 42",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400050",
      "isDefault": true
    }
  ],
  "createdAt": "2026-01-15T09:00:00Z"
}
```

### `PATCH /users/me`
> Updates profile fields.

**Request Body (partial):**
```json
{
  "name": "Aarav S.",
  "phone": "+91-9876543210",
  "avatar": "<base64 or multipart upload>"
}
```

**Response `200 OK`:** Returns updated user object (same schema as `GET /users/me`).

### `PUT /users/me/password`

**Request Body:**
```json
{
  "currentPassword": "OldP@ss",
  "newPassword": "NewSecureP@ss"
}
```

**Response `200 OK`:**
```json
{ "message": "Password updated successfully." }
```

---

## 3. Products

### `GET /products/:slug`
> Returns a single product with full detail, seller info, authenticity, and return policy.

**Response `200 OK`:**
```json
{
  "id": "prod_x8922",
  "slug": "chronograph-automatic-42mm",
  "name": "Chronograph Automatic 42mm",
  "brand": "Orion Watch Co.",
  "price": 34500000,
  "originalPrice": 41000000,
  "discount": 16,
  "currency": "INR",
  "rating": 4.9,
  "reviewCount": 124,
  "stock": 12,
  "category": {
    "id": "cat_watches",
    "name": "Luxury Watches",
    "slug": "watches"
  },
  "description": "A masterclass in horological engineering...",
  "features": [
    "Automatic Self-Winding Movement",
    "Scratch-resistant Sapphire Crystal",
    "48-hour Power Reserve",
    "Water Resistant to 100m"
  ],
  "images": [
    { "url": "https://cdn.sarvahub.com/products/prod_x8922/1.jpg", "alt": "Front view" },
    { "url": "https://cdn.sarvahub.com/products/prod_x8922/2.jpg", "alt": "Side view" },
    { "url": "https://cdn.sarvahub.com/products/prod_x8922/3.jpg", "alt": "Back view" }
  ],
  "video": "https://cdn.sarvahub.com/products/prod_x8922/video.mp4",
  "colors": [
    { "name": "Steel", "hex": "#E2E8F0", "sku": "SKU-8922-ST" },
    { "name": "Rose Gold", "hex": "#B76E79", "sku": "SKU-8922-RG" },
    { "name": "Matte Carbon", "hex": "#1F2937", "sku": "SKU-8922-MC" }
  ],
  "sizes": [],
  "authenticity": {
    "verified": true,
    "batchId": "CHRN-8922A",
    "origin": "Mumbai, India",
    "verifiedAt": "2026-02-20T10:00:00Z",
    "inspectionPoints": 12
  },
  "seller": {
    "id": "sel_9x024k",
    "name": "Mumbai Horology Pvt Ltd",
    "rating": 4.9,
    "reviewCount": 428,
    "joinedYear": 2018,
    "location": "Mumbai, MH",
    "verified": true,
    "avatar": "https://cdn.sarvahub.com/sellers/sel_9x024k/avatar.jpg",
    "description": "An authorized dealer of premium chronographs..."
  },
  "returnPolicy": {
    "type": "Conditional Return",
    "windowDays": 7,
    "conditions": "Must remain unworn, with all original factory seals...",
    "eligible": true,
    "restockingFeePercent": 5
  },
  "shipping": {
    "freeShipping": true,
    "estimatedDays": "2-3",
    "provider": "BlueDart Express"
  },
  "createdAt": "2026-01-10T09:00:00Z",
  "updatedAt": "2026-02-28T14:00:00Z"
}
```

### `GET /products`
> List/search products. Used by Search page, Category page, Featured page.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Full-text search query |
| `category` | string | Category slug filter |
| `brand` | string | Brand name filter |
| `minPrice` | number | Minimum price (paisa) |
| `maxPrice` | number | Maximum price (paisa) |
| `rating` | number | Minimum rating (e.g., `4`) |
| `verified` | boolean | Only authenticity-verified items |
| `sort` | enum | `recommended`, `newest`, `price_asc`, `price_desc`, `rating` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `imageRef` | string | Reference ID for visual/image-based search |

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "prod_x8922",
      "slug": "chronograph-automatic-42mm",
      "name": "Chronograph Automatic 42mm",
      "brand": "Orion Watch Co.",
      "price": 34500000,
      "originalPrice": 41000000,
      "rating": 4.9,
      "reviewCount": 124,
      "image": "https://cdn.sarvahub.com/products/prod_x8922/1.jpg",
      "verified": true,
      "category": "Accessories"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 342,
    "totalPages": 18,
    "hasNextPage": true
  },
  "filters": {
    "availableCategories": ["Accessories", "Electronics", "Fashion"],
    "availableBrands": ["Orion Watch Co.", "Acoustica", "Milano Crafted"],
    "priceRange": { "min": 2500000, "max": 41000000 }
  }
}
```

---

## 4. Categories

### `GET /categories`
> Returns all top-level product categories.

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "cat_watches",
      "name": "Luxury Watches",
      "slug": "watches",
      "description": "Premium timepieces from world-renowned manufacturers.",
      "image": "https://cdn.sarvahub.com/categories/watches.jpg",
      "productCount": 245,
      "featured": true
    },
    {
      "id": "cat_electronics",
      "name": "Premium Electronics",
      "slug": "electronics",
      "description": "Cutting-edge gadgets and audio equipment.",
      "image": "https://cdn.sarvahub.com/categories/electronics.jpg",
      "productCount": 189,
      "featured": true
    }
  ]
}
```

### `GET /categories/:slug`
> Returns a single category with metadata. Product listing under category uses `GET /products?category=:slug`.

**Response `200 OK`:**
```json
{
  "id": "cat_watches",
  "name": "Luxury Watches",
  "slug": "watches",
  "description": "Premium timepieces...",
  "image": "https://cdn.sarvahub.com/categories/watches.jpg",
  "bannerImage": "https://cdn.sarvahub.com/categories/watches-banner.jpg",
  "productCount": 245,
  "subcategories": [
    { "id": "cat_auto_watches", "name": "Automatic", "slug": "automatic", "productCount": 120 },
    { "id": "cat_smart_watches", "name": "Smart Watches", "slug": "smart-watches", "productCount": 80 }
  ]
}
```

---

## 5. Search

### `POST /search/visual`
> Performs image-based visual search. The frontend uploads an image and receives matching product IDs.

**Request:** `multipart/form-data` with `image` field.

**Response `200 OK`:**
```json
{
  "referenceId": "vsr_abc123",
  "matchedProductIds": ["prod_x8922", "prod_y1234", "prod_z5678"],
  "confidence": 0.87
}
```
> The frontend then calls `GET /products?imageRef=vsr_abc123` to render results.

### `GET /search/suggestions?q=chron`
> Returns autocomplete suggestions.

**Response `200 OK`:**
```json
{
  "suggestions": [
    { "text": "Chronograph Automatic", "type": "product" },
    { "text": "Chrome Hearts Ring", "type": "product" },
    { "text": "Watches", "type": "category" }
  ]
}
```

---

## 6. Cart

### `GET /cart` 🔒
> Returns the authenticated user's cart contents.

**Response `200 OK`:**
```json
{
  "items": [
    {
      "id": "ci_001",
      "productId": "prod_x8922",
      "name": "Chronograph Automatic 42mm",
      "price": 20580000,
      "quantity": 1,
      "image": "https://cdn.sarvahub.com/products/prod_x8922/1.jpg",
      "attributes": "Rose Gold • Steel Band",
      "color": "Rose Gold",
      "size": null,
      "sku": "SKU-8922-RG",
      "stock": 12,
      "sellerId": "sel_9x024k"
    }
  ],
  "subtotal": 35532000,
  "itemCount": 3
}
```

### `POST /cart/items` 🔒
> Adds an item to the cart.

**Request Body:**
```json
{
  "productId": "prod_x8922",
  "quantity": 1,
  "color": "Rose Gold",
  "size": null
}
```

**Response `201 Created`:** Returns updated cart (same schema as `GET /cart`).

### `PATCH /cart/items/:itemId` 🔒
> Updates quantity of a cart item.

**Request Body:**
```json
{ "quantity": 2 }
```

**Response `200 OK`:** Returns updated cart.

### `DELETE /cart/items/:itemId` 🔒

**Response `200 OK`:** Returns updated cart.

---

## 7. Checkout & Orders

### `POST /orders` 🔒
> Creates an order from the current cart.

**Request Body:**
```json
{
  "shippingAddressId": "addr_001",
  "paymentMethod": {
    "type": "card",
    "cardNumber": "4111111111111111",
    "expiry": "12/28",
    "cvv": "123",
    "nameOnCard": "Aarav Sharma"
  },
  "couponCode": null,
  "notes": null
}
```
> `paymentMethod.type` enum: `"card"`, `"upi"`, `"netbanking"`, `"wallet"`, `"crypto"`

**Response `201 Created`:**
```json
{
  "orderId": "ord_SVH8921X",
  "status": "confirmed",
  "items": [
    {
      "id": "oi_001",
      "productId": "prod_x8922",
      "name": "Chronograph Automatic 42mm",
      "price": 20580000,
      "quantity": 1,
      "image": "https://cdn.sarvahub.com/products/prod_x8922/1.jpg",
      "attributes": "Rose Gold",
      "authenticity": {
        "status": "pending_verification",
        "estimatedCompletionAt": "2026-03-02T12:00:00Z"
      }
    }
  ],
  "subtotal": 35532000,
  "shipping": 0,
  "tax": 6395760,
  "total": 41927760,
  "shippingAddress": { "line1": "123 Luxury Ave...", "city": "Mumbai", "pincode": "400050" },
  "estimatedDelivery": "2026-03-04T18:00:00Z",
  "createdAt": "2026-03-01T12:30:00Z"
}
```

### `GET /orders` 🔒
> Returns the user's order history. Supports filtering by status.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | enum | `all`, `processing`, `shipped`, `delivered`, `returned` |
| `page` | number | Default 1 |
| `limit` | number | Default 10 |

**Response `200 OK`:**
```json
{
  "data": [
    {
      "orderId": "ord_SVH8921X",
      "status": "delivered",
      "statusLabel": "Delivered",
      "total": 41927760,
      "itemCount": 2,
      "items": [
        {
          "id": "oi_001",
          "name": "Chronograph Automatic 42mm",
          "image": "https://cdn.sarvahub.com/products/prod_x8922/1.jpg",
          "price": 20580000,
          "quantity": 1
        }
      ],
      "createdAt": "2026-02-15T10:00:00Z",
      "deliveredAt": "2026-02-18T14:00:00Z",
      "canReturn": true,
      "canReview": true,
      "returnWindowEndsAt": "2026-03-04T14:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "totalItems": 8, "totalPages": 1, "hasNextPage": false }
}
```

### `GET /orders/:orderId` 🔒
> Full single order detail with tracking timeline.

**Response `200 OK`:**
```json
{
  "orderId": "ord_SVH8921X",
  "status": "shipped",
  "items": [ ... ],
  "subtotal": 35532000,
  "shipping": 0,
  "tax": 6395760,
  "total": 41927760,
  "shippingAddress": { ... },
  "paymentMethod": { "type": "card", "last4": "1111", "brand": "Visa" },
  "tracking": {
    "carrier": "BlueDart",
    "trackingNumber": "BD1234567890",
    "trackingUrl": "https://bluedart.com/track/BD1234567890",
    "timeline": [
      { "status": "Order Placed", "timestamp": "2026-03-01T12:30:00Z", "completed": true },
      { "status": "Authenticity Verified", "timestamp": "2026-03-01T18:00:00Z", "completed": true },
      { "status": "Packed & Shipped", "timestamp": "2026-03-02T09:00:00Z", "completed": true },
      { "status": "Out for Delivery", "timestamp": null, "completed": false },
      { "status": "Delivered", "timestamp": null, "completed": false }
    ]
  },
  "createdAt": "2026-03-01T12:30:00Z"
}
```

---

## 8. Wishlist

### `GET /wishlist` 🔒

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "wl_001",
      "productId": "prod_x8922",
      "name": "Chronograph Automatic 42mm",
      "brand": "Orion Watch Co.",
      "price": 34500000,
      "image": "https://cdn.sarvahub.com/products/prod_x8922/1.jpg",
      "inStock": true,
      "addedAt": "2026-02-20T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### `POST /wishlist` 🔒
**Request:** `{ "productId": "prod_x8922" }`  
**Response `201 Created`**

### `DELETE /wishlist/:productId` 🔒
**Response `204 No Content`**

---

## 9. Reviews & Ratings

### `GET /products/:productId/reviews`
> Returns paginated reviews for a product.

**Query Parameters:** `page`, `limit`, `sort` (`newest`, `highest`, `lowest`, `helpful`)

**Response `200 OK`:**
```json
{
  "summary": {
    "averageRating": 4.8,
    "totalReviews": 124,
    "distribution": {
      "5": 80,
      "4": 15,
      "3": 3,
      "2": 2,
      "1": 0
    }
  },
  "data": [
    {
      "id": "rev_001",
      "author": {
        "name": "Eleanor P.",
        "avatar": null
      },
      "rating": 5,
      "title": "Absolutely Exquisite Craftsmanship",
      "content": "The quality of the materials is immediately apparent...",
      "images": [],
      "verified": true,
      "helpfulCount": 12,
      "createdAt": "2026-02-12T08:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### `POST /products/:productId/reviews` 🔒
> Submits a new review. Only allowed if user has a delivered order for this product.

**Request Body:**
```json
{
  "rating": 5,
  "title": "Amazing quality",
  "content": "Exceeded my expectations in every way...",
  "images": ["<base64 string or multipart>"]
}
```

**Response `201 Created`:** Returns the created review object.

### `POST /reviews/:reviewId/helpful` 🔒
**Response `200 OK`:** `{ "helpfulCount": 13 }`

---

## 10. Returns & Refunds

### `POST /orders/:orderId/returns` 🔒
> Initiates a return request.

**Request Body:**
```json
{
  "items": [
    {
      "orderItemId": "oi_001",
      "reason": "Defective / Damaged",
      "subReason": "Scratched upon arrival",
      "resolution": "refund_original",
      "exchangeVariantId": null,
      "proofImages": ["https://cdn.sarvahub.com/uploads/return_proof_1.jpg"],
      "comments": "Visible scratch on dial face."
    }
  ],
  "pickupAddress": "addr_001",
  "preferredPickupDate": "2026-03-05",
  "preferredPickupSlot": "10:00-14:00"
}
```
> `resolution` enum: `"refund_original"` | `"store_credit"` | `"exchange"`

**Response `201 Created`:**
```json
{
  "returnId": "ret_001",
  "status": "pending_approval",
  "items": [ ... ],
  "pickupDetails": {
    "address": { ... },
    "date": "2026-03-05",
    "slot": "10:00-14:00",
    "labelUrl": "https://cdn.sarvahub.com/labels/ret_001.pdf"
  },
  "estimatedRefundDate": "2026-03-12T00:00:00Z",
  "createdAt": "2026-03-01T14:00:00Z"
}
```

### `GET /orders/:orderId/returns` 🔒
> Fetches return status for an order.

**Response `200 OK`:**
```json
{
  "returnId": "ret_001",
  "status": "picked_up",
  "timeline": [
    { "step": "Return Requested", "completedAt": "2026-03-01T14:00:00Z" },
    { "step": "Seller Approved", "completedAt": "2026-03-02T10:00:00Z" },
    { "step": "Pickup Scheduled", "completedAt": "2026-03-03T09:00:00Z" },
    { "step": "Package Picked Up", "completedAt": "2026-03-05T11:30:00Z" },
    { "step": "Inspection in Progress", "completedAt": null },
    { "step": "Refund Processed", "completedAt": null }
  ]
}
```

---

## 11. Support & Tickets

### `GET /support/tickets` 🔒

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "tkt_001",
      "subject": "Order not received after 7 days",
      "status": "open",
      "priority": "high",
      "category": "shipping",
      "lastReply": "2026-02-28T10:00:00Z",
      "createdAt": "2026-02-25T08:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### `POST /support/tickets` 🔒

**Request Body:**
```json
{
  "subject": "Order not received after 7 days",
  "category": "shipping",
  "priority": "high",
  "message": "My order ORD-123 was supposed to arrive on...",
  "orderId": "ord_SVH8921X",
  "attachments": []
}
```

**Response `201 Created`:** Returns the created ticket object.

### `GET /support/tickets/:ticketId` 🔒
> Returns ticket detail with message thread.

**Response `200 OK`:**
```json
{
  "id": "tkt_001",
  "subject": "Order not received after 7 days",
  "status": "awaiting_reply",
  "messages": [
    {
      "id": "msg_001",
      "sender": "user",
      "content": "My order ORD-123 was supposed to...",
      "createdAt": "2026-02-25T08:00:00Z"
    },
    {
      "id": "msg_002",
      "sender": "agent",
      "agentName": "Priya S.",
      "content": "Hi Aarav, I've escalated this with our logistics team...",
      "createdAt": "2026-02-25T09:30:00Z"
    }
  ]
}
```

### `POST /support/tickets/:ticketId/messages` 🔒

**Request Body:**
```json
{
  "content": "Thanks for the update, any ETA?",
  "attachments": []
}
```

---

## 12. Feedback

### `GET /feedback`
> Returns community feedback/feature requests.

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "fb_001",
      "title": "Dark Mode for iOS App",
      "description": "It would be great if the mobile app...",
      "status": "in_progress",
      "upvotes": 1240,
      "userHasUpvoted": false,
      "authorName": "Community",
      "createdAt": "2026-01-10T09:00:00Z"
    }
  ],
  "pagination": { ... }
}
```
> `status` enum: `"under_review"` | `"planned"` | `"in_progress"` | `"completed"` | `"declined"`

### `POST /feedback` 🔒

**Request Body:**
```json
{
  "title": "Ability to filter by seller location",
  "description": "I want to buy only from sellers in my city..."
}
```

### `POST /feedback/:id/upvote` 🔒
**Response `200 OK`:** `{ "upvotes": 1241 }`

---

## 13. Notifications

### `GET /users/me/notification-preferences` 🔒

**Response `200 OK`:**
```json
{
  "orderUpdates": true,
  "promotions": false,
  "priceDropAlerts": true,
  "sellerMessages": true,
  "securityAlerts": true,
  "newsletter": false
}
```

### `PATCH /users/me/notification-preferences` 🔒

**Request Body (partial):**
```json
{ "promotions": true, "newsletter": true }
```

---

## 14. Payments

### `GET /users/me/payment-methods` 🔒

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "pm_001",
      "type": "card",
      "brand": "Visa",
      "last4": "4242",
      "expiryMonth": 12,
      "expiryYear": 2028,
      "isDefault": true,
      "cardholderName": "Aarav Sharma"
    },
    {
      "id": "pm_002",
      "type": "upi",
      "upiId": "aarav@okaxis",
      "isDefault": false
    }
  ]
}
```

### `POST /users/me/payment-methods` 🔒
### `DELETE /users/me/payment-methods/:id` 🔒
### `PATCH /users/me/payment-methods/:id/default` 🔒

---

## 15. Seller: Onboarding

### `POST /sellers/onboarding` 🔒
> Multi-step onboarding submission. The frontend sends all steps at once upon final submission.

**Request Body:**
```json
{
  "businessName": "Mumbai Horology Pvt Ltd",
  "businessType": "pvt_ltd",
  "gstNumber": "27AAACM1234F1Z5",
  "panNumber": "AAACM1234F",
  "registeredAddress": {
    "line1": "45, Nariman Point",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400021"
  },
  "bankDetails": {
    "accountName": "Mumbai Horology Pvt Ltd",
    "accountNumber": "1234567890123456",
    "ifsc": "HDFC0001234",
    "bankName": "HDFC Bank"
  },
  "categories": ["watches", "jewelry"],
  "brandAuthorization": ["<upload URL>"],
  "subscriptionTier": "professional",
  "contactPerson": {
    "name": "Rahul Kapoor",
    "email": "rahul@mumbaihorology.com",
    "phone": "+91-9876543210"
  }
}
```
> `subscriptionTier` enum: `"starter"` | `"professional"` | `"enterprise"`

**Response `201 Created`:**
```json
{
  "sellerId": "sel_9x024k",
  "status": "pending_verification",
  "estimatedApprovalDays": 3,
  "message": "Your application has been submitted. Our team will review it within 3 business days."
}
```

---

## 16. Seller: Dashboard & Analytics

### `GET /sellers/me/dashboard` 🔒

**Response `200 OK`:**
```json
{
  "revenue": {
    "total": 2458000000,
    "percentChange": 12.5,
    "period": "month"
  },
  "orders": {
    "total": 342,
    "pending": 18,
    "shipped": 24,
    "delivered": 290,
    "returned": 10
  },
  "products": {
    "active": 47,
    "outOfStock": 3,
    "drafts": 2
  },
  "conversion": {
    "rate": 3.2,
    "percentChange": 0.4
  },
  "recentOrders": [
    {
      "orderId": "ord_123",
      "customerName": "Aarav S.",
      "total": 20580000,
      "status": "processing",
      "createdAt": "2026-03-01T10:00:00Z"
    }
  ]
}
```

### `GET /sellers/me/analytics` 🔒

**Query Parameters:** `period` (`7d`, `30d`, `90d`, `1y`)

**Response `200 OK`:**
```json
{
  "revenueChart": [
    { "label": "Jan", "value": 180000000 },
    { "label": "Feb", "value": 220000000 },
    { "label": "Mar", "value": 245000000 }
  ],
  "topProducts": [
    { "productId": "prod_x8922", "name": "Chronograph 42mm", "unitsSold": 45, "revenue": 155250000 }
  ],
  "topCategories": [
    { "category": "Watches", "revenue": 120000000, "percentage": 49 }
  ],
  "customerMetrics": {
    "newCustomers": 120,
    "returningCustomers": 85,
    "averageOrderValue": 7180000
  }
}
```

---

## 17. Seller: Product Management

### `GET /sellers/me/products` 🔒

**Query Parameters:** `status` (`active`, `draft`, `out_of_stock`), `page`, `limit`

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "prod_x8922",
      "name": "Chronograph Automatic 42mm",
      "sku": "SKU-8922",
      "price": 34500000,
      "stock": 12,
      "status": "active",
      "category": "Watches",
      "image": "https://cdn.sarvahub.com/products/prod_x8922/1.jpg",
      "rating": 4.9,
      "totalSold": 45,
      "createdAt": "2026-01-10T09:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### `POST /sellers/me/products` 🔒
> Creates a new product listing (multi-step form data).

**Request Body:** `multipart/form-data`
```json
{
  "name": "Diamond Studded Bracelet",
  "brand": "Mumbai Horology",
  "description": "18k white gold...",
  "category": "jewelry",
  "price": 8500000,
  "stock": 5,
  "sku": "SKU-BRCLT-001",
  "images": ["<file uploads>"],
  "video": "<file upload>",
  "colors": [{ "name": "Gold", "hex": "#FFD700" }],
  "sizes": [],
  "features": ["18k White Gold", "VVS1 Diamonds"],
  "authenticityDocs": ["<file upload>"],
  "returnPolicy": {
    "type": "No Returns",
    "windowDays": 0,
    "conditions": "Custom jewelry is non-returnable."
  },
  "shippingWeight": 250,
  "shippingDimensions": { "l": 15, "w": 10, "h": 5 }
}
```

### `PATCH /sellers/me/products/:productId` 🔒
### `DELETE /sellers/me/products/:productId` 🔒

---

## 18. Seller: Order Fulfillment

### `GET /sellers/me/orders` 🔒

**Query Parameters:** `status` (`pending`, `processing`, `shipped`, `delivered`, `returned`), `page`, `limit`

**Response `200 OK`:**
```json
{
  "data": [
    {
      "orderId": "ord_SVH8921X",
      "customerName": "Aarav Sharma",
      "total": 20580000,
      "status": "pending",
      "statusLabel": "Pending Shipment",
      "items": [
        {
          "productId": "prod_x8922",
          "name": "Chronograph Automatic 42mm",
          "quantity": 1,
          "image": "https://cdn.sarvahub.com/products/prod_x8922/1.jpg"
        }
      ],
      "shippingAddress": { "city": "Mumbai", "pincode": "400050" },
      "createdAt": "2026-03-01T10:00:00Z",
      "deadlineAt": "2026-03-03T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### `PATCH /sellers/me/orders/:orderId/status` 🔒
> Moves the order to the next fulfillment stage.

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "BD1234567890",
  "carrier": "BlueDart"
}
```

---

## 19. Seller: Returns

### `GET /sellers/me/returns` 🔒

**Response `200 OK`:**
```json
{
  "data": [
    {
      "returnId": "ret_001",
      "orderId": "ord_SVH8921X",
      "customerName": "Aarav Sharma",
      "reason": "Defective / Damaged",
      "resolution": "refund_original",
      "status": "pending_approval",
      "items": [ ... ],
      "proofImages": ["https://cdn.sarvahub.com/uploads/return_proof_1.jpg"],
      "createdAt": "2026-03-01T14:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### `PATCH /sellers/me/returns/:returnId` 🔒
> Approve or reject a return.

**Request Body:**
```json
{
  "action": "approve",
  "sellerNotes": "Return approved. Please ship back within 3 days."
}
```
> `action` enum: `"approve"` | `"reject"`

---

## 20. Seller: Settings

### `GET /sellers/me/settings` 🔒

**Response `200 OK`:**
```json
{
  "businessName": "Mumbai Horology Pvt Ltd",
  "businessType": "pvt_ltd",
  "gstNumber": "27AAACM1234F1Z5",
  "contactEmail": "rahul@mumbaihorology.com",
  "contactPhone": "+91-9876543210",
  "logo": "https://cdn.sarvahub.com/sellers/sel_9x024k/logo.jpg",
  "bankDetails": {
    "accountName": "Mumbai Horology Pvt Ltd",
    "last4": "3456",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0001234"
  },
  "subscriptionTier": "professional",
  "notificationPreferences": {
    "newOrders": true,
    "returns": true,
    "payouts": true,
    "promotions": false
  }
}
```

### `PATCH /sellers/me/settings` 🔒

---

## 21. Seller: Support Tickets

### `GET /sellers/me/support/tickets` 🔒
> Same schema as consumer tickets (#11), scoped to seller context.

### `POST /sellers/me/support/tickets` 🔒

**Request Body:**
```json
{
  "subject": "Payout delay for Order ORD-992B",
  "category": "payout",
  "message": "My scheduled payout for...",
  "orderId": "ord_992B"
}
```

---

## 22. Seller: Compliance

### `GET /sellers/me/compliance` 🔒

**Response `200 OK`:**
```json
{
  "accountHealth": "good",
  "sellerRating": 4.8,
  "metrics": {
    "lateDispatchRate": 0.5,
    "lateDispatchTarget": 2.0,
    "refundRate": 1.2,
    "refundTarget": 5.0,
    "cancellationRate": 0.3,
    "cancellationTarget": 2.5
  },
  "warnings": [],
  "infractions": [],
  "upcomingAudits": [
    {
      "type": "kyc_reverification",
      "description": "Re-verify your business banking details",
      "deadlineAt": "2026-12-31T23:59:59Z"
    }
  ]
}
```

---

## 23. Featured & Curated Collections

### `GET /collections/featured`
> Returns curated "Editor's Picks" / trending products.

**Response `200 OK`:**
```json
{
  "hero": {
    "title": "Curator's Vault",
    "subtitle": "Handpicked by our editorial team",
    "image": "https://cdn.sarvahub.com/collections/featured-hero.jpg"
  },
  "products": [
    {
      "id": "prod_x8922",
      "slug": "chronograph-automatic-42mm",
      "name": "Chronograph Automatic 42mm",
      "brand": "Orion Watch Co.",
      "price": 34500000,
      "image": "https://cdn.sarvahub.com/products/prod_x8922/1.jpg",
      "verified": true,
      "badge": "Editor's Pick"
    }
  ]
}
```

### `GET /collections/homepage`
> Returns data for the landing page carousels.

**Response `200 OK`:**
```json
{
  "heroCarousel": [
    {
      "id": "slide_001",
      "title": "The Art of Precision",
      "subtitle": "New arrivals from Orion Watch Co.",
      "image": "https://cdn.sarvahub.com/banners/hero_1.jpg",
      "ctaText": "Explore Collection",
      "ctaLink": "/categories"
    }
  ],
  "trendingProducts": [ ... ],
  "featuredCategories": [ ... ],
  "newArrivals": [ ... ]
}
```

---

## Authentication Legend

| Symbol | Meaning |
|--------|---------|
| 🔒 | Requires `Authorization: Bearer <token>` header |
| (no symbol) | Public endpoint, no auth required |

---

> **Note to Backend Engineer**: All `price` values in this document are in **paisa** (1 ₹ = 100 paisa). The frontend performs `price / 100` and formats via `toLocaleString('en-IN')`. Please ensure all monetary values from the database are stored and returned as integers in paisa to avoid floating-point precision issues.
