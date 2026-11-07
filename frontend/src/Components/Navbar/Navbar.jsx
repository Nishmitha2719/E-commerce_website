import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { Search, Bag, Heart, Menu, Close, User } from '../Icons/Icons';

const LINKS = [
  { to: '/', label: 'Shop' },
  { to: '/mens', label: 'Men' },
  { to: '/womens', label: 'Women' },
  { to: '/kids', label: 'Kids' },
];

const Navbar = () => {
  const { getTotalCartItems, all_product, wishlist, token, logout } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const [bump, setBump] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const cartCount = getTotalCartItems();
  const prevCount = useRef(cartCount);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close overlays on navigation
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Cart badge bump when items are added
  useEffect(() => {
    if (cartCount > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 600);
      prevCount.current = cartCount;
      return () => clearTimeout(t);
    }
    prevCount.current = cartCount;
    return undefined;
  }, [cartCount]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const onDown = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return all_product
      .filter((p) => p.name.toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, all_product]);

  const submitSearch = (e) => {
    e.preventDefault();
    if (activeIdx >= 0 && results[activeIdx]) {
      navigate(`/product/${results[activeIdx].id}`);
    } else if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    setQuery('');
    setActiveIdx(-1);
    setSearchOpen(false);
  };

  const onSearchKey = (e) => {
    if (e.key === 'Escape') {
      setSearchOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(-1, i - 1));
    }
  };

  const isActive = (to) => (to === '/' ? location.pathname === '/' || location.pathname === '/shop' : location.pathname.startsWith(to));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
    <header className={`navbar${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="nav-logo" aria-label="SkyDy home">
          <img src={logo} alt="" width="40" height="40" />
          <span>SkyDy</span>
        </Link>

        <nav aria-label="Main">
          <ul className="nav-menu">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={isActive(l.to) ? 'is-active' : ''} aria-current={isActive(l.to) ? 'page' : undefined}>
                  <span data-text={l.label}>{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <div className={`nav-search${searchOpen ? ' is-open' : ''}`} ref={searchRef}>
            <form onSubmit={submitSearch} role="search">
              <button
                type="button"
                className="icon-btn"
                aria-label={searchOpen ? 'Close search' : 'Search products'}
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen((o) => !o)}
              >
                <Search />
              </button>
              <label htmlFor="nav-search-input" className="sr-only">Search products</label>
              <input
                id="nav-search-input"
                ref={inputRef}
                type="search"
                placeholder="Search products"
                value={query}
                tabIndex={searchOpen ? 0 : -1}
                autoComplete="off"
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(-1);
                }}
                onKeyDown={onSearchKey}
              />
            </form>
            {searchOpen && query.trim() && (
              <div className="search-results glass" role="listbox">
                {results.length === 0 ? (
                  <p className="search-empty">No products match “{query}”.</p>
                ) : (
                  results.map((p, i) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      role="option"
                      aria-selected={i === activeIdx}
                      className={`search-result${i === activeIdx ? ' is-active' : ''}`}
                      style={{ '--i': i }}
                      onClick={() => setQuery('')}
                    >
                      <img src={p.image} alt="" width="44" height="52" loading="lazy" />
                      <span className="search-result__name">{p.name}</span>
                      <span className="search-result__price">${p.new_price}</span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <Link to="/wishlist" className="icon-btn nav-wishlist" aria-label={`Wishlist, ${wishlist.length} items`}>
            <Heart />
            {wishlist.length > 0 && <span className="nav-count nav-count--soft">{wishlist.length}</span>}
          </Link>

          <Link to="/cart" className="icon-btn nav-cart" aria-label={`Cart, ${cartCount} items`}>
            <Bag />
            <span className={`nav-count${bump ? ' is-bump' : ''}`}>{cartCount}</span>
          </Link>

          {token ? (
            <button className="nav-auth" onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login" className="nav-auth">
              <User width={18} height={18} />
              <span>Login</span>
            </Link>
          )}

          <button
            className="icon-btn nav-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <Close /> : <Menu />}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile sheet — outside the header: the header's backdrop-filter would otherwise trap position:fixed */}
    <div className={`nav-sheet${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <ul>
          {LINKS.map((l, i) => (
            <li key={l.to} style={{ '--i': i }}>
              <Link to={l.to} tabIndex={menuOpen ? 0 : -1} className={isActive(l.to) ? 'is-active' : ''}>
                {l.label}
              </Link>
            </li>
          ))}
          <li style={{ '--i': LINKS.length }}>
            <Link to="/wishlist" tabIndex={menuOpen ? 0 : -1}>Wishlist ({wishlist.length})</Link>
          </li>
          <li style={{ '--i': LINKS.length + 1 }}>
            {token ? (
              <button tabIndex={menuOpen ? 0 : -1} onClick={handleLogout}>Logout</button>
            ) : (
              <Link to="/login" tabIndex={menuOpen ? 0 : -1}>Login</Link>
            )}
          </li>
        </ul>
    </div>
    </>
  );
};

export default Navbar;
