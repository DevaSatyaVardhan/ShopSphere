# ShopSphere

ShopSphere is a modular-monolith e-commerce portfolio project with a React/Vite storefront and a Java 21/Spring Boot backend.

## Workspace

- `shopsphere-frontend/` - React, TypeScript, Vite, Tailwind-ready UI, React Router, Axios, TanStack Query, and Lucide icons.
- `shopsphere-backend/` - Spring Boot 3.5, Java 21, Spring Security, JPA/Hibernate, Flyway, MySQL 8, JWT, and OpenAPI.

## Included application surface

- Customer home, product catalog, product detail, cart, simulated checkout, confirmation, account, and order history routes.
- Persistent browser cart and wishlist state for a ready-to-run demo experience.
- Customer registration/login flow and a role-aware admin dashboard route.
- Admin overview with revenue, order, customer, product, sales-chart, and low-stock views.
- Spring Security JWT authentication endpoints, role authorization, catalog, cart, checkout/order, and admin dashboard APIs.
- Versioned Flyway schema for the MySQL 8 persistence model.
- OpenAPI/Swagger configuration and a health endpoint at `GET /api/v1/health`.

## Local setup

### Frontend

```powershell
Set-Location shopsphere-frontend
npm install
npm run dev
```

The Vite development server runs at `http://localhost:5173`.

### Backend

Create a MySQL 8 database and user, then set these optional environment variables when they differ from the development defaults:

```powershell
$env:DB_URL = 'jdbc:mysql://localhost:3306/shopsphere?createDatabaseIfNotExist=true&serverTimezone=UTC'
$env:DB_USERNAME = 'shopsphere'
$env:DB_PASSWORD = 'replace-me'
$env:JWT_SECRET = 'use-a-long-random-development-secret'
```

Run the backend with:

```powershell
Set-Location shopsphere-backend
mvn spring-boot:run
```

Flyway applies `src/main/resources/db/migration/V1__create_core_schema.sql` on startup. Swagger UI will be available at `http://localhost:8080/swagger-ui.html` after the API is running.

## Validation

```powershell
Set-Location shopsphere-frontend
npm run lint
npm run build

Set-Location ..\shopsphere-backend
mvn test
```

## Demo credentials

- Customer: register any account from `/login`.
- Admin API: `admin@shopsphere.com` / `admin123`.
- Frontend demo admin: sign in with any email containing `admin`.
