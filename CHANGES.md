# SkyDy — speed fixes + liquid-chrome redesign

Unzip this over your `E-commerce/` folder. It replaces or adds only the files listed below.
**No new npm packages are needed.** Then run `npm start` in `frontend/` and restart the backend.

## 1. Why the home page wasn't showing / felt broken

| Problem | Cause | Fix |
|---|---|---|
| Opening the site showed only navbar + footer | No route for `/` — home was only at `/shop` (login/logout also sent you to `/`) | `/` (and `/shop`) now render the home page; unknown URLs fall back to home |
| Page kept jumping back to the top / sections cut off | `Item.jsx` had `onClick={window.scrollTo(0,0)}`, which **runs on every render** of every product card (on load, on every cart change) | Removed; a `ScrollToTop` runs once per page change |
| Mobile: menu permanently covered the top of the hero | `.nav-menu` was always `display:flex` under 800px | New mobile menu sheet that only opens on tap |
| Horizontal scroll / overflow | `Offers` (65% width + 280px padding + margins), `NewsLetter` (fixed 730px), `Popular` (fixed 90vh height) | Rebuilt with fluid, responsive layouts |
| Hero taller than the screen | `height:100vh` under a sticky navbar | `min-height: calc(100svh - navbar)` so the full hero fits on open |

## 2. Why things loaded slowly

- **Fonts:** 18 Poppins styles + all of Roboto → now Poppins 400/500/600/700 + Instrument Serif (`display=swap`).
- **Images:** hero 430 KB → 57 KB, banners ~570 KB → ~120 KB each, offer image 210 KB → 29 KB (WebP). Product images now `loading="lazy"` with fixed sizes (no layout shift).
- **Code splitting:** only the home page is in the first bundle; Category/Product/Cart/Login/Search/Wishlist load on demand (and are prefetched when the browser is idle).
- **API:** an in-memory cache, so going back to a page doesn't refetch. Skeleton placeholders while data loads.
- **Backend (`Backend/index.js`)**, same endpoints and responses:
  - `.lean()` on read queries (much faster than full Mongoose documents)
  - `/newcollections` and `/popularinwomen` let MongoDB return 8 / 4 products instead of loading every product
  - `/addproduct` fetches only the highest id
  - indexes on `id` and `category`
  - product images served with a 30-day cache (file names are timestamped, so this is safe)
  - **bug fix:** cart changes weren't saved to MongoDB — `cartData` is a Mixed type and needed `markModified('cartData')`

## 3. Redesign (no new dependencies)

- **Liquid chrome background:** one hand-written WebGL shader (`Components/LiquidBackground`) instead of Three.js. It reacts to the cursor (light + ripple) and scroll (palette shifts pearl → lavender → blue). It renders at reduced resolution, caps at 30 fps on phones, pauses in background tabs and starts only after first paint. Without WebGL it falls back to a CSS gradient; with reduced motion it shows a still frame.
- **Hero:** editorial headline with masked text reveal, your real `hero_image`, floating glass/chrome shapes with mouse parallax, magnetic CTAs, a "Just in" card that shows your newest real product, and a scroll cue.
- **Shop by category:** asymmetric panels built from your banners, with a hover zoom and liquid wash; each shows a real product count.
- **Product cards:** 3D tilt + moving light, wishlist heart, animated add-to-cart, category and discount badges, "Sold out" state (uses the `available` field).
- **Navbar:** glass bar, animated search with live results (Enter → `/search` page, arrow keys + Esc), wishlist and cart counters (the cart badge bumps when you add), mobile sheet menu.
- **Category pages:** real filter chips (on sale, price bands, in stock), a working sort dropdown, an accurate "Showing x of y" and a working "Explore more".
- **Product page:** hover zoom, selectable sizes, wishlist, stock status. Related products now come from the real catalogue (same category) instead of static demo data.
- **Cart:** quantity +/−, remove line, empty state, sticky totals.
- **Login:** inline errors, no full page reload, lands on the (now visible) home page.
- **New pages:** `/search?q=` and `/wishlist`. The wishlist is saved in localStorage.
- **Microinteractions:** desktop cursor ring, page transitions, scroll reveals, smooth dropdowns.
- **Accessibility:** skip link, focus rings, aria labels, `prefers-reduced-motion` respected everywhere, native cursor kept.

## Files

New: `src/lib/api.js`, `src/lib/motion.js`, `Components/LiquidBackground/*`, `Components/Categories/*`,
`Components/Cursor/*`, `Components/Dropdown/*`, `Components/Icons/Icons.jsx`, `Pages/SearchResults.jsx`,
`Pages/Wishlist.jsx`, `Pages/CSS/ListPage.css`, 5 `.webp` images in `Components/Assets/`.

Replaced: `public/index.html`, `src/index.js`, `src/index.css`, `src/App.js`, `src/App.css`, `Context/ShopContext.jsx`,
every component in `Components/` you had, all `Pages/*`, and `Backend/index.js`.

Unchanged: admin panel, your original PNGs (still used for the logo, icons and stars), `all_product.js`, `data.js`, and all backend endpoints and their responses.

## Config

The API URL can now be set in `frontend/.env`: `REACT_APP_API_URL=https://your-api`. The default is `http://localhost:4000`, as before.
If you change it, also update the `preconnect` line in `public/index.html`.
