# Permanent Delete Products

Open **Products → Delete Products**. Search by product name, category, or barcode.

**Delete Variant** permanently removes the selected SKU. If the parent has no other variants, it also deletes the parent product row.

**Delete Entire Product** permanently deletes the product and all its SKUs, barcodes and branch stock in one transaction.

The confirmation dialog requires a typed code before the Delete button becomes enabled. Product deletions are blocked for historical sale references, reserved inventory, cross-branch access violations and unknown dependent records. A blocked deletion does not change the database.

The backend must be deployed before using this page. For previously soft-deleted CHARAK/ESSA products, use the backend's read-only-first `ONE_TIME_CHARAK_ESSA_PERMANENT_CLEANUP.sql` database script after taking a full backup. Historical import jobs and financial records are intentionally retained.
