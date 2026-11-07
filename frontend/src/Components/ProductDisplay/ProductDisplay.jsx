import React, { useContext, useEffect, useRef, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import { Bag, Check, Heart } from '../Icons/Icons';
import { hasFinePointer, useMagnetic } from '../../lib/motion';

const CATEGORY_LABEL = { women: 'Women', men: 'Men', kid: 'Kids' };
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const ProductDisplay = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useContext(ShopContext);
  const [size, setSize] = useState(null);
  const [added, setAdded] = useState(false);
  const [zoom, setZoom] = useState(false);
  const mediaRef = useRef(null);
  const btnRef = useMagnetic(0.2);

  useEffect(() => {
    if (!added) return undefined;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  if (!product) return <p>Product not found</p>;

  const wished = wishlist.includes(product.id);
  const available = product.available !== false;
  const discount = product.old_price > product.new_price ? Math.round((1 - product.new_price / product.old_price) * 100) : 0;

  const onMove = (e) => {
    if (!hasFinePointer()) return;
    const r = mediaRef.current.getBoundingClientRect();
    mediaRef.current.style.setProperty('--zx', `${((e.clientX - r.left) / r.width) * 100}%`);
    mediaRef.current.style.setProperty('--zy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const onAdd = () => {
    if (!available) return;
    addToCart(product.id);
    setAdded(true);
  };

  return (
    <div className="productdisplay container">
      <div className="productdisplay-left">
        <div
          ref={mediaRef}
          className={`productdisplay-img${zoom ? ' is-zoom' : ''}`}
          onPointerEnter={() => setZoom(true)}
          onPointerLeave={() => setZoom(false)}
          onPointerMove={onMove}
        >
          <img className="productdisplay-main-img" src={product.image} alt={product.name} width="350" height="418" decoding="async" />
          <span className="productdisplay-img__light" aria-hidden="true" />
          {discount > 0 && <span className="badge badge--sale productdisplay-badge">−{discount}%</span>}
        </div>
      </div>

      <div className="productdisplay-right">
        <span className="eyebrow">{CATEGORY_LABEL[product.category] || product.category}</span>
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-new">${product.new_price}</div>
          {product.old_price > product.new_price && (
            <div className="productdisplay-right-price-old">${product.old_price}</div>
          )}
          <span className={`productdisplay-stock${available ? '' : ' is-out'}`}>{available ? 'In stock' : 'Sold out'}</span>
        </div>

        <div className="productdisplay-right-description">
          A lightweight, knotted but good t-shirt.
        </div>

        <div className="productdisplay-right-size">
          <h2>Select size</h2>
          <div className="productdisplay-right-sizes" role="radiogroup" aria-label="Size">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                className={size === s ? 'is-active' : ''}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="productdisplay-actions">
          <button
            ref={btnRef}
            type="button"
            className={`btn productdisplay-add${added ? ' is-added' : ''}`}
            onClick={onAdd}
            disabled={!available}
          >
            {added ? <><Check /> Added to cart</> : <><Bag /> {available ? 'Add to cart' : 'Sold out'}</>}
          </button>
          <button
            type="button"
            className={`productdisplay-wish${wished ? ' is-on' : ''}`}
            aria-pressed={wished}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart filled={wished} />
          </button>
        </div>

        <div className="productdisplay-meta">
          <p className="productdisplay-right-category">
            <span>Category:</span> {CATEGORY_LABEL[product.category] || product.category}
          </p>
          <p className="productdisplay-right-category">
            <span>Tags:</span> Modern, Latest
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
