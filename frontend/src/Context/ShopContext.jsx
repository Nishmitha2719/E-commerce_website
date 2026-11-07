import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { API_BASE, getJSON } from '../lib/api';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let i = 0; i <= 300; i++) cart[i] = 0;
  return cart;
};

const readWishlist = () => {
  try {
    const raw = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

const authFetch = (path, token, body = {}) =>
  fetch(API_BASE + path, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [cartItems, setCartItems] = useState(getDefaultCart);
  const [token, setToken] = useState(() => localStorage.getItem('auth-token'));
  const [wishlist, setWishlist] = useState(readWishlist);

  useEffect(() => {
    let alive = true;
    getJSON('/allproducts')
      .then((data) => {
        if (alive && Array.isArray(data)) setAll_Product(data);
      })
      .catch((err) => {
        console.error('Products error:', err);
        if (alive) setProductsError(err);
      })
      .finally(() => alive && setProductsLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!token) return;
    authFetch('/getcart', token)
      .then((data) => {
        // Only accept a real cart object (an expired token returns { errors })
        if (data && typeof data === 'object' && !data.errors) setCartItems(data);
      })
      .catch((err) => console.error('Get cart error:', err));
  }, [token]);

  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch {
      /* storage can be unavailable (private mode) */
    }
  }, [wishlist]);

  const addToCart = useCallback((itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    const t = localStorage.getItem('auth-token');
    if (!t) return;
    authFetch('/addtocart', t, { itemId }).catch((err) => console.error('Add to cart error:', err));
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) - 1) }));
    const t = localStorage.getItem('auth-token');
    if (!t) return;
    authFetch('/removefromcart', t, { itemId }).catch((err) => console.error('Remove from cart error:', err));
  }, []);

  const toggleWishlist = useCallback((itemId) => {
    setWishlist((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  }, []);

  const getTotalCartAmount = useCallback(() => {
    let total = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const product = all_product.find((p) => p.id === Number(item));
        if (product) total += product.new_price * cartItems[item];
      }
    }
    return total;
  }, [cartItems, all_product]);

  const getTotalCartItems = useCallback(() => {
    let total = 0;
    for (const item in cartItems) if (cartItems[item] > 0) total += cartItems[item];
    return total;
  }, [cartItems]);

  const login = useCallback((tokenFromBackend) => {
    localStorage.setItem('auth-token', tokenFromBackend);
    setToken(tokenFromBackend);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth-token');
    setToken(null);
    setCartItems(getDefaultCart());
  }, []);

  const value = useMemo(
    () => ({
      all_product,
      productsLoading,
      productsError,
      cartItems,
      addToCart,
      removeFromCart,
      getTotalCartAmount,
      getTotalCartItems,
      wishlist,
      toggleWishlist,
      token,
      login,
      logout,
    }),
    [
      all_product,
      productsLoading,
      productsError,
      cartItems,
      addToCart,
      removeFromCart,
      getTotalCartAmount,
      getTotalCartItems,
      wishlist,
      toggleWishlist,
      token,
      login,
      logout,
    ]
  );

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
