# Category actions visibility fix

This package fixes the Branch Admin New Category screen (`/categories/new`). It now displays these controls together on the category management screen:

- **Add Category**: available after choosing a gender and a valid parent.
- **Update Category**: enabled after selecting an existing category.
- **Delete Category**: enabled when an active existing category is selected. This is a soft delete/deactivation.
- **Restore Category**: replaces Delete Category when an inactive category is selected.

Both `/categories` and `/categories/new` now show the same complete Category Management component. The top navbar still provides the New Category link for Branch Admin users only. Super Admin is still blocked by the existing role guards. The server's category permission logic is unchanged.

No backend changes are required for this particular UI visibility fix. Use with the backend previously provided. Existing category API endpoints remain necessary.

Before deploying, build the React app and verify Branch Admin vs Super Admin access, action confirmation dialogs, and nested category updates on staging.
