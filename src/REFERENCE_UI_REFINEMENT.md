# Admin UI refinement (October 2026)

## Top navigation & access
- Horizontal black top navbar, no logo.
- Branch admins see New Category, Sales, Transactions, POS, Stocks, Customers, Products in that order.
- Super admins do NOT see New Category and cannot open category creation or edits.
- Product area has Add Product, Update Product, Delete Product and Bulk Upload tabs.
- Secondary links live behind **More** and remain available on narrow screens.
- Header text/controls max font-weight: 700. Non-navbar surfaces use lavender, mint, white and cool slate.

## Filters
- Products: name/EAN search, gender, nested category, stock status and sorting (SQL-backed).
- Stocks: search, gender, stock status, sorting, low-stock toggle (SQL-backed, CSV shares filters).
- Sales: date range, search, status, payment, channel (SQL-backed, CSV shares filters).
- Transactions: payment/order analytics, customer-paid and pending totals, and server-backed status, COD/prepaid, channel, email/mobile and date filters. Bank settlements are explicitly not tracked. Stock movements remain accessible from More.
- Customers: branch admins see only customers with orders at their branch (server-side search/order count/sort); super admins retain the global directory with client-side city/contact/name/recent filters.

## Safety
- Category mutations (POST/PUT/PATCH /api/categories) require authenticated branch admin on server (403 for super admin).
- Product deletion remains transactional: retire variant/stock, delete barcode mapping for reuse, keep sales & stock movement history. Multi-branch products require super admin; reserved products are blocked.
- Test against staging before deploying. Both frontend and backend must be deployed together.
