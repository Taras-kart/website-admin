# Updated Admin Portal — 13 October 2026

## Delivered

- Black **top** navigation only. No left sidebar or company logo. Horizontal navigation links can scroll on narrow phones; “All links” expands them without opening a left drawer.
- Light ivory/lavender backgrounds, white cards, plum action accents and softer table borders. No font-weight above 700.
- Dedicated navigation/pages for **Add Product** (`/products`), **Update Products** (`/products/update`) and **Delete Products** (`/products/delete`).
- **Categories** (`/categories`) still supports update, restore and child-category deactivation. **Add Category** (`/categories/new`) uses the existing dynamic gender > category > subcategory selector and POST `/api/categories`.
- Product delete page includes search, table, paging and a barcode-typing confirmation. Deleting a product calls `DELETE /api/manage/products/:id`.
- Mobile forms and tables reflow or scroll horizontally rather than causing full-page overflow. Action button groups remain in one row with horizontal scrolling when necessary.
- Added `public/index.html`, which was not present in the supplied frontend ZIP, so a standard Create React App deployment can locate an HTML shell.

## Deployment

1. Update and deploy the **backend ZIP first**. The old backend does not implement barcode-releasing product deletion.
2. In Vercel (or your deployment environment), set `REACT_APP_API_BASE` to the deployed backend's base URL when needed. The provided `src/pages/api.js` defaults to the existing production API URL; review it before deployment.
3. Run `npm ci`, then `npm run build` in `tara-admin/` and deploy the production build. No `node_modules` directory is bundled.
4. Sign in as a super admin and test Add, Update, Delete, reupload and Categories on a staging database before using production inventory.
5. Existing styles not linked into current `App.js` were retained for compatibility; the portal routes shown above are the active implementation.

## Product deletion behavior

The confirmation dialog clearly states that **variant deletion is global across all branches**, not just a stock-row hide. The backend checks for active reservations and requires super admin permission when a variant belongs to multiple branches. In a transaction it posts a removal movement, clears stock and deactivates the variant; it physically removes the variant's `barcodes` rows. Existing order and stock movement history remains intact. A re-upload can use the same barcode again after successful deletion. If a transaction fails, it is rolled back and the barcode is **not** released.

**A stock Hide button is not the same as Delete Product.** Hide only changes one branch's stock visibility and keeps the barcode reserved.

## Validation and notes

- TypeScript JSX parser successfully checked frontend JS syntax and local imports.
- Backend product-retirement unit tests passed.
- Full API integration test suite and browser/device testing require installing dependencies and a staging database; they were not run in this environment.
