import React, { Suspense, lazy, useEffect, useLayoutEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import LiquidBackground from './Components/LiquidBackground/LiquidBackground';
import Cursor from './Components/Cursor/Cursor';
import Shop from './Pages/Shop';
import { startGlobalMotionVars } from './lib/motion';
import men_banner from './Components/Assets/banner_mens.webp';
import women_banner from './Components/Assets/banner_women.webp';
import kid_banner from './Components/Assets/banner_kids.webp';

// Only the home page ships in the first bundle; other pages load on demand.
const ShopCategory = lazy(() => import('./Pages/ShopCategory'));
const Product = lazy(() => import('./Pages/Product'));
const Cart = lazy(() => import('./Pages/Cart'));
const LoginSignup = lazy(() => import('./Pages/LoginSignup'));
const SearchResults = lazy(() => import('./Pages/SearchResults'));
const Wishlist = lazy(() => import('./Pages/Wishlist'));

// Warm up the most-visited pages once the home page is idle.
const prefetchPages = () => {
  import('./Pages/ShopCategory');
  import('./Pages/Product');
  import('./Pages/Cart');
};

const RouteFallback = () => (
  <div className="route-loading" role="status" aria-label="Loading">
    <div className="route-loading__orb" />
  </div>
);

// Scroll to top on page change (replaces the old window.scrollTo call that ran on every render)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const AppRoutes = () => {
  const location = useLocation();
  return (
    <main id="main" className="app-main">
      <div key={location.pathname} className="page-enter">
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Shop />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/mens" element={<ShopCategory banner={men_banner} category="men" />} />
            <Route path="/womens" element={<ShopCategory banner={women_banner} category="women" />} />
            <Route path="/kids" element={<ShopCategory banner={kid_banner} category="kid" />} />
            <Route path="/product" element={<Product />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<Shop />} />
          </Routes>
        </Suspense>
      </div>
    </main>
  );
};

function App() {
  useEffect(() => {
    startGlobalMotionVars();
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(prefetchPages, { timeout: 3000 })
      : window.setTimeout(prefetchPages, 2000);
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id) : window.clearTimeout(id));
  }, []);

  return (
    <BrowserRouter>
      <a href="#main" className="skip-link">Skip to content</a>
      <LiquidBackground />
      <Cursor />
      <ScrollToTop />
      <Navbar />
      <AppRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
