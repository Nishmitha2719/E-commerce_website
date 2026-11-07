import React, { useContext, useEffect, useRef, useState } from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { Heart, Plus, Check } from '../Icons/Icons';
import { hasFinePointer, prefersReducedMotion, useReveal } from '../../lib/motion';

const CATEGORY_LABEL = { women: 'Women', men: 'Men', kid: 'Kids' };

const Item = ({ id, name, image, new_price, old_price, category, available = true, index = 0 }) => {
  const { addToCart, toggleWishlist, wishlist } = useContext(ShopContext);
  const [added, setAdded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const cardRef = useRef(null);
  const revealRef = useReveal();
  const wished = wishlist.includes(id);

  const discount = old_price > new_price ? Math.round((1 - new_price / old_price) * 100) : 0;

  // 3D tilt + moving light (desktop only, skipped for reduced motion)
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return undefined;
    let frame = 0;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${(0.5 - y) * 7}deg`);
        el.style.setProperty('--ry', `${(x - 0.5) * 9}deg`);
        el.style.setProperty('--lx', `${x * 100}%`);
        el.style.setProperty('--ly', `${y * 100}%`);
      });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  useEffect(() => {
    if (!added) return undefined;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  const onAdd = () => {
    if (!available) return;
    addToCart(id);
    setAdded(true);
  };

  return (
    <article className="item reveal" ref={revealRef} style={{ '--delay': `${(index % 4) * 70}ms` }}>
      <div className="item__card" ref={cardRef}>
        <Link to={`/product/${id}`} className="item__media" aria-label={name}>
          <img
            src={image}
            alt={name}
            width="350"
            height="418"
            loading="lazy"
            decoding="async"
            className={loaded ? 'is-loaded' : ''}
            onLoad={() => setLoaded(true)}
          />
          <span className="item__light" aria-hidden="true" />
        </Link>

        <div className="item__badges">
          {category && CATEGORY_LABEL[category] && <span className="badge">{CATEGORY_LABEL[category]}</span>}
          {discount > 0 && <span className="badge badge--sale">−{discount}%</span>}
          {!available && <span className="badge badge--dark">Sold out</span>}
        </div>

        <button
          type="button"
          className={`item__wish${wished ? ' is-on' : ''}`}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          onClick={() => toggleWishlist(id)}
        >
          <Heart filled={wished} width={18} height={18} />
        </button>

        <button
          type="button"
          className={`item__add${added ? ' is-added' : ''}`}
          onClick={onAdd}
          disabled={!available}
          aria-label={available ? `Add ${name} to cart` : `${name} is sold out`}
        >
          <span className="item__add-icon">{added ? <Check width={18} height={18} /> : <Plus width={18} height={18} />}</span>
          <span className="item__add-label" aria-live="polite">{added ? 'Added to cart' : 'Add to cart'}</span>
        </button>
      </div>

      <Link to={`/product/${id}`} className="item__info">
        <p className="item__name">{name}</p>
        <div className="item-prices">
          <span className="item-price-new">${new_price}</span>
          {old_price > new_price && <span className="item-price-old">${old_price}</span>}
        </div>
      </Link>
    </article>
  );
};

export const ItemSkeleton = () => (
  <div className="item item--skeleton" aria-hidden="true">
    <div className="item__card skeleton" />
    <div className="skeleton" style={{ height: 14, marginTop: 16, width: '85%' }} />
    <div className="skeleton" style={{ height: 14, marginTop: 10, width: '40%' }} />
  </div>
);

export default Item;
