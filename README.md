# ShopSphere

ShopSphere is a modular-monolith e-commerce portfolio application featuring an editorial minimalist storefront built with React 19, TypeScript, and Vite, coupled with a Java 21 / Spring Boot 3 backend.

## Workspace Structure

- `shopsphere-frontend/` - React 19, TypeScript, Vite, React Router 7, Lucide Icons, Context API state management, and custom CSS design system.
- `shopsphere-backend/` - Spring Boot 3.5, Java 21, Spring Security, JPA/Hibernate, Flyway, MySQL 8, JWT, and OpenAPI.

## Enhanced Application Architecture & Components

The application has been modularized from a single monolithic file into a scalable, component-driven design:

### Common Components (`src/components/common/`)
- **`Header.tsx`**: Sticky blur header with live search & autocomplete suggestions, category links with active route indicators, wishlist count badge, cart drawer trigger with counter, user profile dropdown with avatar/role badge, and mobile drawer menu.
- **`CartDrawer.tsx`**: Slide-out quick cart drawer with dynamic free shipping progress meter, item counter, quantity modifiers, promo code input, subtotal, and checkout trigger.
- **`Footer.tsx`**: Editorial brand statement, newsletter subscription form with instant validation, company/catalog links, and payment method badges.
- **`Toast.tsx`**: Animated floating notifications for actions (added to bag, saved to wishlist, coupon applied, errors).
- **`Modal.tsx`**: Accessible dialog component with backdrop blur and ESC key listener.
- **`StarRating.tsx`**: Render stars with score or interactive star picker for customer reviews.
- **`Badge.tsx`**: Color-coded badges for discounts, new arrivals, and order statuses.

### Product Components (`src/components/product/`)
- **`ProductCard.tsx`**: Aspect-ratio image showcase, subtle hover zoom, wishlist toggle heart, stock warning badge, Quick View button, and Add to Bag button.
- **`ProductGrid.tsx`**: Responsive multi-column grid with loading skeleton states and empty state with filter reset.
- **`ProductFilters.tsx`**: Category pills, keyword search input, price range filter dropdown, in-stock toggle switch, sorting dropdown (Featured, Price Low/High, Rating, Alphabetical), and removable active filter tags.
- **`QuickViewModal.tsx`**: Modal preview with multi-angle image gallery, detailed specifications, stock indicator, quantity picker, and instant Add to Bag.
- **`ProductReviews.tsx`**: Score distribution bars, verified buyer badges, and collapsible "Write a Review" form with star selector.

### Admin Portal Components (`src/components/admin/`)
- **`AdminSidebar.tsx`**: Dedicated admin navigation with active indicators and exit link.
- **`AdminOverview.tsx`**: Revenue, orders, catalog count, and customer metrics, interactive weekly sales bar chart with hover tooltips, low-stock warnings, and recent transactions.
- **`AdminProducts.tsx`**: Product catalog table, search & category filtering, Add New Piece modal form, Edit Piece modal form, and deletion confirmation.
- **`AdminOrders.tsx`**: Complete customer orders table with search, status filtering, order details modal, and inline fulfillment status updater (`CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- **`AdminInventory.tsx`**: Stock replenishment table with health status pills, visual stock level progress bar, and quick adjustments (`-5`, `-1`, `+1`, `+10`, `Restock to 40`).

### Dedicated Pages (`src/pages/`)
- **`HomePage.tsx`**: Hero editorial banner, category mood strip, brand value pillars, trending now pieces, sustainability promo banner, and fresh arrivals.
- **`ProductsPage.tsx`**: Full collection catalog with multi-facet filtering and sorting synchronized with URL search params.
- **`ProductDetailPage.tsx`**: Image showcase with thumbnail angles, stock alerts, specifications table, customer reviews tab, and related pieces recommendations.
- **`CartPage.tsx`**: Full bag review, free shipping threshold meter, quantity controls, promo discounts (`WELCOME10`, `SPHERE20`, `FREESHIP`), and checkout redirect.
- **`WishlistPage.tsx`**: Dedicated saved pieces curation with "Move all to bag" and individual bag transfers.
- **`CheckoutPage.tsx`**: Multi-step checkout with contact details, address autofill, shipping speed selection (Standard vs Express), card/digital wallet payment methods, and simulation toggles (Success vs Declined).
- **`ConfirmationPage.tsx`**: Order confirmed screen with visual logistics tracking stepper (Placed -> Paid -> Packing -> Shipped -> Delivered) and printable receipt.
- **`AccountPage.tsx`**: Customer profile management, edit profile modal, address book management with add/delete/set default address modal.
- **`OrdersPage.tsx`**: Order history cards with tracking milestones, receipt viewer, and "Buy Again" re-ordering.
- **`AboutPage.tsx`**: Brand story, 4 manifesto pillars, sustainable sourcing philosophy, and zero-plastic shipping guarantees.
- **`ContactPage.tsx`**: Concierge inquiry form, response time windows, direct support channels, and expandable FAQ accordion.
- **`LoginPage.tsx`**: Member sign-in / registration with password visibility toggle and 1-click evaluation demo buttons for Customer and Admin.
- **`AdminPage.tsx`**: Role-protected full-screen admin control center.

## Local Setup

### Frontend

```powershell
Set-Location shopsphere-frontend
npm install
npm run dev
```

The Vite development server runs at `http://localhost:5173`.

### Backend

```powershell
Set-Location shopsphere-backend
mvn spring-boot:run
```

Swagger UI will be available at `http://localhost:8080/swagger-ui.html` after the API is running.

## Validation & Code Quality

```powershell
Set-Location shopsphere-frontend
npm run lint
npm run build
```

Both build and lint check pass with 0 errors and 0 warnings.

## Demo Credentials & Evaluation

- **One-Click Demo Customer**: Click the "Sign in as Customer (Alex)" button on the `/login` page.
- **One-Click Demo Admin**: Click the "Sign in as Admin" button on the `/login` page.
- Or sign in with any email containing `admin` for full admin console access.
- Promo codes to test in cart/checkout:
  - `WELCOME10`: 10% off entire order
  - `SPHERE20`: 20% off orders over $100
  - `FREESHIP`: Guaranteed free shipping
