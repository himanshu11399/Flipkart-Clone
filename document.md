# Flipkart Clone Full-Stack Architecture Documentation

## 📌 1. PROJECT OVERVIEW

### What the Application Does
This project is a premium, full-stack eCommerce web application heavily inspired by Flipkart. It provides a complete end-to-end shopping experience, allowing users to discover products, view detailed specifications, manage a shopping cart, and seamlessly proceed through a multi-step checkout to generate confirmed orders.

### Problem it Solves
Building a performant, SEO-friendly eCommerce platform is a complex challenge. This application solves this by leveraging server-side rendered architectures alongside a robust relational database backend. It delivers a fast, mobile-responsive, and reliable shopping platform capable of maintaining data integrity during concurrent user purchases.

### Key Features
- **Dynamic Product Discovery:** Browse products with advanced filtering and search capabilities.
- **Robust Cart System:** Add, remove, and update quantities with persistent server-side state.
- **Multi-Step Checkout:** A guided "Address > Summary > Payment" flow preventing premature order processing.
- **Order Management:** Detailed order confirmation pages and historical tracking tracking.
- **Dynamic Theming:** Seamless Dark/Light mode utilizing local storage and system preferences.
- **Responsive Design:** A mobile-first UI mimicking native app functionality entirely via web browsers.

### Target Users
- **Shoppers:** Looking for a smooth, glitch-free purchasing journey across both desktop and mobile devices.
- **Evaluators/Recruiters (Scaler):** Looking for deeply architected code, clean separation of concerns, and robust error handling.

---

## 📌 2. TECHNOLOGIES USED

### Frontend
- **Next.js 14:** Utilized heavily for its App Router. It allows hybrid rendering (Server Components for SEO/speed, Client Components for interactivity).
- **React 18:** For building encapsulated, reusable UI pieces.
- **Tailwind CSS:** Selected for utility-first styling. It avoids massive CSS bundle sizes and provides built-in media queries (`md:`, `lg:`) for our mobile-first approach.
- **Framer Motion:** Used to build premium, 60fps micro-animations (e.g., the Theme Toggle sun/moon rotation and smooth layout transitions).
- **Lucide React:** For clean, scalable, and lightweight vector graphics SVG icons.

### Backend
- **Node.js:** JavaScript runtime allowing developer context-switching to remain minimal between frontend and backend.
- **Express.js:** Minimalist web framework to rapidly setup middleware, routing, and HTTP request/response lifecycles.

### Database & ORM
- **PostgreSQL (Supabase):** Chosen as the primary database due to eCommerce requiring strictly relational data (ACID compliance) for transactional safety (e.g., deducting stock).
- **Sequelize ORM:** Prevents SQL injection, abstracts SQL queries into pure JavaScript promises, and manages schema synchronizations efficiently.

### State Management & Communications
- **React Context API:** Used for global non-frequently-mutating state (`ThemeContext`, `FilterContext`). Redux was avoided as server-side cart fetching makes massive client-side data stores redundant.
- **Axios:** For robust HTTP interceptors, allowing global handling of 401/500 errors gracefully instead of failing silently using native `fetch`.

---

## 📌 3. FOLDER STRUCTURE

A clean repository is vital for scalability. The monorepo layout separates concerns optimally.

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── app/                 # Next.js App Router (Pages, Layouts)
│   │   ├── cart/            # /cart route
│   │   ├── checkout/        # /checkout route
│   │   ├── orders/          # /orders route
│   │   ├── product/[id]/    # Dynamic product details page
│   │   ├── globals.css      # Core Tailwind directives
│   │   └── layout.tsx       # Root layout wrapping Context Providers
│   ├── components/          # Reusable UI elements (Navbar, ProductCard)
│   ├── context/             # Global Context Providers (Theme/Filter)
│   └── lib/                 # Utilities (Axios config, external API services)
├── next.config.mjs          # Next.js configuration and image domains
└── tailwind.config.ts       # Tailwind UI Design System
```

### Backend (`/backend`)
```
backend/
├── src/
│   ├── config/              # Database connections (database.js)
│   ├── controllers/         # Core business logic (productController, cartController)
│   ├── models/              # Sequelize schemas (Product, Cart, Order)
│   ├── routes/              # Express Endpoints mapping to Controllers
│   └── server.js            # Express Entry point & Middleware wiring
├── .env                     # Secrets and DB URIs
└── package.json             # Dep tree and startup scripts
```

---

## 📌 4. FRONTEND ARCHITECTURE

### App Router Paradigm
The frontend follows Next.js 14 conventions. `page.tsx` renders the isolated routes. The architecture uses a "Think in Server Components" approach:
- **Server Components (Default):** SEO-heavy pages (like deep product pages) can be rendered on the server.
- **Client Components (`'use client'`):** We delineate interactivity strictly where needed. E.g., `checkout/page.tsx` must be a client component because it manages complex local `useState` for multi-step toggles and `useEffect` for cart pulling.

### Component Structure
- **Atoms:** Icons, raw HTML buttons.
- **Molecules:** `ProductCard.tsx` - combines an image, price, title, and rating badge.
- **Organisms:** `Navbar.tsx` - combines Search, Modals (`LoginDropdown`), and Routing.
- **Templates:** Page layout wrappers isolating the `BannerCarousel` from product grids.

---

## 📌 5. STATE MANAGEMENT

### Dual State Approach
We utilize a mixture of Global state and Local state to optimize performance.

1. **Global State (Context API):**
   - We utilize nested providers in `Providers.tsx`.
   - `ThemeContext` manages active dark/light mode across the DOM.
   - `FilterContext` stores `searchQuery` globally. When a user types in `Navbar.tsx`, it instantly filters the API fetch inside `app/page.tsx`.
   
2. **Local State (`useState`):**
   - Used for UI toggles (e.g., checkout step progress: `currentStep`).

### Data Flow Example (Theme Switching)
`ThemeToggle Button Clicked -> ThemeContext update -> localStorage('theme') updated -> DOM <html> class appended with 'dark' -> Tailwind respects dark: classes -> UI re-renders`.

---

## 📌 6. API INTEGRATION

### Axios Instance
The frontend consolidates all backend requests via `lib/axios.ts`. This acts as an HTTP wrapper:
- **Base URL:** Centralized as `process.env.NEXT_PUBLIC_API_URL` allowing easy toggle between `http://localhost:5001` and production APIs on Render/Vercel.
- **Interceptors:** Every response checks for `.data.success`. If the backend crashes, Axios intercepts the error and throws a normalized Promise rejection ensuring `toast.error()` catches it cleanly in the UI.

---

## 📌 7. BACKEND ARCHITECTURE

The server operates strictly on the **MVC (Model-View-Controller)** pattern, though "View" is replaced by JSON responses.

1. **Routes Layer (`routes/*.js`):** Acts as the traffic cop. Validates URL structures before passing to Controllers.
2. **Controller Layer (`controllers/*.js`):** Contains the business logic. Example: `cartController` analyzes if a product is already in the cart and decides whether to run a `CartItem.update()` or `CartItem.create()`.
3. **Model Layer (`models/*.js`):** Strict structural definitions utilizing Sequelize ORM mapping JavaScript objects directly to PostgreSQL Tables.

---

## 📌 8. API ENDPOINTS

### Products
- **`GET /products`**
  - *Desc:* Fetch all products with optional filters.
  - *Query Vars:* `?category=x&search=y`
  - *Response:* `{ success: true, data: [...], totalPages: 1 }`
- **`GET /products/:id`**
  - *Desc:* Fetch deep definitions for a single product UUID.

### Cart
- **`GET /cart`**
  - *Desc:* Fetch current active cart including joined Product details.
  - *Headers:* `x-user-id`
- **`POST /cart/add`**
  - *Desc:* Add to cart.
  - *Body:* `{ userId, productId, quantity }`
- **`PUT /cart/update`**
  - *Desc:* Update quantities.
  - *Body:* `{ cartItemId, quantity }`
- **`DELETE /cart/remove`**
  - *Desc:* Drop item from cart.
  - *Body:* `{ cartItemId }`

### Orders
- **`POST /orders`**
  - *Desc:* Consumes the active Cart, creates an Order record, moves CartItems into OrderItems, and clears Cart.
  - *Body:* `{ userId, fullName, address, phone, paymentMethod }`
- **`GET /orders/:id`**
  - *Desc:* Validates order success on the `/order-confirmation` page.

---

## 📌 9. DATABASE DESIGN

The normalized SQL setup utilizes Foreign Keys ensuring data integrity.

- **Product Table:** `id (PK)`, `name`, `price (DECIMAL)`, `stock (INT)`, `images (ARRAY)`.
- **Cart Table:** `id (PK)`, `userId (INDEX)`.
- **CartItem Table:** `id (PK)`, `cartId (FK)`, `productId (FK)`, `quantity (INT)`.
- **Order Table:** `id (PK)`, `userId`, `totalAmount`, `status`, `address`.
- **OrderItem Table:** `id (PK)`, `orderId (FK)`, `productId (FK)`, `priceAtPurchase (DECIMAL)`. (Notice `priceAtPurchase` acts as a historical snapshot, protecting past receipts if product prices change later!)

---

## 📌 10. DATA FLOW (END-TO-END)

**Scenario: User adds item to cart and checks out.**
1. **Action:** User clicks "Place Order" in Frontend on the Checkout Page.
2. **Frontend UI:** Changes state to `loading=true` and fires `axios.post('/orders')`.
3. **Express Route:** `/orders` captures POST request, executes `checkout()` within `orderController`.
4. **Backend Logic:** Controller looks up `Cart` by `userId`. Generates a final total price.
5. **Database Transaction:** Creates an `Order` record, dumps `CartItems` to `OrderItems`, deletes original `CartItems`. Sequelize commits the transaction.
6. **Backend Response:** Returns `HTTP 200 { success: true, data: { orderId: 123 } }`.
7. **Frontend State:** Axios resolves. Target `router.push(/order-confirmation?orderId=123)`.
8. **UI Update:** User sees final confirmation page summarizing their snapshot data.

---

## 📌 11. DFD (DATA FLOW DIAGRAM)

```text
[User] 
  │ 
  └── (Clicks Checkout) ───▶ [Frontend UI (Next.js)]
                                  │
                               [Axios POST /orders]
                                  │
                                  ▼
[Express Server Router] ──────▶ [Order Controller]
                                  │
                                  ├─▶ (1) Pull Cart from PostgreSQL
                                  ├─▶ (2) Validate Product Stocks
                                  ├─▶ (3) Create Order Header
                                  ├─▶ (4) Move Line Items to OrderItems
                                  └─▶ (5) Empty Original Cart
                                  │
                                  ▼
[Database (Supabase)] ◀──────── [Sequelize Interface] 
                                  │
[Axios Success 200] ◀────────── [JSON Response]
  │
  ▼
[Frontend UI Update]
  │
  └──▶ (Redirects to /order-confirmation) ──▶ [User Views Success Page]
```

---

## 📌 12. AUTHENTICATION FLOW

### Current Implementation state
To ensure evaluator testing is frictionless without external dependencies crashing, the external `Clerk.dev` dependency was completely decoupled.
- **Handling Mechanism:** A hardcoded `GUEST_USER_ID = '00000000-0000-4000-a000-000000000000'` acts as a persistent JWT placeholder. 
- **DB Mapping:** The backend strictly assigns cart tables and order tables to this single ID, allowing any developer to clone the repo, hit "Add to cart", and test flow immediately without Auth Middleware setup.

---

## 📌 13. ERROR HANDLING

### Frontend Error Management
- **UI Degradation boundaries:** Pages display soft fallback "Empty States" or error boundaries (e.g., `Sorry, no products found!`) avoiding white-screen crashes.
- **Toast Notifications:** The `react-hot-toast` library intercepts Axios rejected promises and flashes non-intrusive warnings to the User if the database sleeps or API fails.

### Backend Error Management
- **Try/Catch Blocks:** All async controllers are wrapped to prevent unhandled node rejections.
- **Unified 500 Responses:** Failsafes return `{ success: false, message: 'Server error detail' }`. This prevents stack traces from leaking to the postman/frontend environments.

---

## 📌 14. DEPLOYMENT ARCHITECTURE

### Frontend Hosting
- **Vercel (Target):** The Next.js app should natively deploy to Vercel to take advantage of edge-rendered Server Components automatically. Requires `NEXT_PUBLIC_API_URL` defined in Vercel Environment variables.

### Backend Hosting
- **Render.com / Railway:** Express APIs map perfectly here. `.env` requires the active `DB_URI`.
- **Database:** Supabase acts as a highly resilient cloud-hosted PostgreSQL DB instance accessed via standard Postgres URI string.

---

## 📌 15. UNIQUE FEATURES / CUSTOM IMPLEMENTATIONS

- **Responsive Micro-Architecture:** Instead of simple breakpoints, intricate elements like the `Navbar` swap properties. The product Detail changes from side-by-side flexbox to swipeable mobile configurations seamlessly beneath `md:` break points.
- **Hydration Syncing Theme:** Advanced LocalStorage handling ensures the Dark Mode preference does not cause "hydration mismatch flashes" natively common in Next.js Server Rendering.
- **Cart Math Sanitization:** Frontend explicitly refetches actual backend prices during checkout, ensuring malicious users cannot manipulate `totalAmount` payloads locally.

---

## 📌 16. CODE EXPLANATION

### `frontend/src/app/checkout/page.tsx`
- **What it does:** Orchestrates the multi-step checkout UI without routing to different pages.
- **Key implementation:** Uses `useState(currentStep)` locally. Instead of rendering huge pages, it visually "locks/greys out" steps visually mimicking Flipkart's UX. It verifies `cartItems` array lengths and bails out back to the store if empty.
- **CSR Wrap:** Wrapped in a `<Suspense>` boundary explicitly as requested by Next 14 documentation when decoding Search Param URL routing attributes natively.

### `backend/src/controllers/cartController.js`
- **What it does:** The heartbeat of eCommerce logic.
- **Key implementation:** Prevents redundant database line items. When you add a product, the ORM runs a `CartItem.findOne()` check. If found, it natively adds `+1` to the `quantity` integer instead of cluttering the database with duplicated item rows.

---

## 📌 17. IMPROVEMENTS & SCALABILITY

### Scalability Weaknesses & Fixes
- **In-Memory Sessions:** As the concurrent connections scale, raw PostgreSQL queries for Cart lookups per-page load will cause high CPU loads.
  - **Improvement:** Introduce **Redis** to cache user's active Cart sessions in memory, strictly offloading writing back to PostgreSQL until Checkout is authorized.
- **Missing Pagination:** Currently, fetching Orders and Products might pull huge datasets into server memory.
  - **Improvement:** Enforce Sequelize `limit: 20` and `offset` limits with Cursor-based pagination scrolling on the Frontend.
- **Strategeic Authentication:** Restore `Clerk App` Provider with Next.js Middleware to protect `/checkout` routes from unauthorized bot scraping. 
