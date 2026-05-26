# Align Admin Dashboard UI with Storefront Design System

Currently, the admin dashboard uses a distinct dark theme (slate/indigo/dark aesthetic) which deviates from the Minaliya brand identity. This plan outlines the comprehensive UI/UX overhaul required to unify the admin panel's design with the store website's premium, natural aesthetic (Forest Green, Cream, and Amber palettes).

## User Review Required

> [!WARNING]
> This is a massive UI overhaul that touches almost every component in the `admin` folder. 
> The dark mode will be completely removed in favor of a light, clean, and earthy design matching the storefront. Please review the changes below and confirm if you are happy to proceed!

## Proposed Changes

We will systematically replace all dark-themed Tailwind utility classes (e.g., `bg-slate-900`, `text-slate-300`, `border-slate-800`, `text-indigo-400`) with the CSS variables defined in `src/app/globals.css` (e.g., `var(--color-cream-50)`, `var(--color-forest-600)`, `var(--color-stone-800)`).

### Admin Login Page
- Change the background from a dark linear gradient to a clean cream/forest-green aesthetic.
- Update the login card to use the `glass-card` styling or a clean white card with subtle shadows (`--shadow-card`).
- Update button colors to use `var(--color-forest-600)` with hover effects matching the `btn-primary` class.
#### [MODIFY] [page.tsx](file:///Users/ambrish/Downloads/minaliya-main/src/app/admin/login/page.tsx)

### Core Layout Components
- **AdminLayoutClient**: Change the global background from `bg-slate-950` to `var(--color-cream-50)` and the text to `var(--color-stone-800)`.
- **AdminSidebar**: Change the sidebar background to `white` or `var(--color-cream-100)`. Update active link highlights to use a soft forest green background (`var(--color-forest-50)`) with `var(--color-forest-600)` text and an accent left-border. Remove dark borders.
- **AdminHeader**: Change the header to a clean white background with a soft bottom border (`var(--color-stone-200)`). Update the user avatar and logout button to match the light theme.
#### [MODIFY] [AdminLayoutClient.tsx](file:///Users/ambrish/Downloads/minaliya-main/src/components/admin/AdminLayoutClient.tsx)
#### [MODIFY] [AdminSidebar.tsx](file:///Users/ambrish/Downloads/minaliya-main/src/components/admin/AdminSidebar.tsx)
#### [MODIFY] [AdminHeader.tsx](file:///Users/ambrish/Downloads/minaliya-main/src/components/admin/AdminHeader.tsx)

### Dashboard Elements & Components
- **StatCard**: Change the dark glassmorphism cards to clean white cards (`bg-white`) with `border-stone-200` and subtle hover shadows (`var(--shadow-card-hover)`). Update the icon background circles to use soft earthy colors (e.g., amber, forest, terra).
- **OrderStatusBadge**: Redefine the color mapping for order statuses to fit the light theme (e.g., using `text-amber-700` and `bg-amber-50` for Pending, instead of dark mode colors).
#### [MODIFY] [StatCard.tsx](file:///Users/ambrish/Downloads/minaliya-main/src/components/admin/StatCard.tsx)
#### [MODIFY] [OrderStatusBadge.tsx](file:///Users/ambrish/Downloads/minaliya-main/src/components/admin/OrderStatusBadge.tsx)

### Data Tables (Orders & Inquiries)
- Replace dark backgrounds (`bg-slate-900`/`bg-slate-800`) with white backgrounds.
- Update table headers to use `bg-stone-50` and `text-stone-600`.
- Update text colors from white/slate-300 to `text-stone-800` and `text-stone-500`.
- Remove glowing hover effects and replace them with a soft `bg-stone-50` row hover.
#### [MODIFY] [OrdersTable.tsx](file:///Users/ambrish/Downloads/minaliya-main/src/components/admin/OrdersTable.tsx)
#### [MODIFY] [InquiriesTable.tsx](file:///Users/ambrish/Downloads/minaliya-main/src/components/admin/InquiriesTable.tsx)

### Page Views (Products, Dashboard Home, etc.)
- Update typography to use the `--font-heading` variable for page titles to ensure consistency with the storefront.
- Update the embedded product tables and grids to the light theme.
#### [MODIFY] [page.tsx (Dashboard Home)](file:///Users/ambrish/Downloads/minaliya-main/src/app/admin/(dashboard)/page.tsx)
#### [MODIFY] [page.tsx (Products View)](file:///Users/ambrish/Downloads/minaliya-main/src/app/admin/(dashboard)/products/page.tsx)
#### [MODIFY] [page.tsx (Orders View)](file:///Users/ambrish/Downloads/minaliya-main/src/app/admin/(dashboard)/orders/page.tsx)
#### [MODIFY] [page.tsx (Inquiries View)](file:///Users/ambrish/Downloads/minaliya-main/src/app/admin/(dashboard)/inquiries/page.tsx)

## Verification Plan

### Manual Verification
- We will visually inspect the Admin Login page and the Dashboard pages via the browser to ensure all dark-mode artifacts are removed and the UI feels identical to the storefront.
- We will check text contrast on the white/cream backgrounds to ensure readability.
