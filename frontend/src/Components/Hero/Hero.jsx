import React, { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import hero_image from '../Assets/hero_image.webp';
import { ArrowRight } from '../Icons/Icons';
import { useMagnetic } from '../../lib/motion';
import { ShopContext } from '../../Context/ShopContext';

const Hero = () => {
  const { all_product } = useContext(ShopContext);
  const primary = useMagnetic(0.25);
  const secondary = useMagnetic(0.25);
  const stageRef = useRef(null);

  // Newest real product for the floating "just in" card
  const latest = all_product.length ? all_product[all_product.length - 1] : null;

  const scrollTo = (id) => (e) => {
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="eyebrow hero__line" style={{ '--d': '0.05s' }}>New arrivals only</p>
          <h1 id="hero-title" className="display hero__title">
            <span className="hero__mask"><span className="hero__line" style={{ '--d': '0.12s' }}>New</span></span>
            <span className="hero__mask"><span className="hero__line" style={{ '--d': '0.22s' }}><em>collections</em></span></span>
            <span className="hero__mask"><span className="hero__line" style={{ '--d': '0.32s' }}>for everyone</span></span>
          </h1>
          <p className="hero__lede hero__line" style={{ '--d': '0.45s' }}>
            Discover this season’s latest styles for women, men and kids — with free shipping on every order.
          </p>
          <div className="hero__ctas hero__line" style={{ '--d': '0.55s' }}>
            <a ref={primary} href="#new-collections" className="btn" onClick={scrollTo('new-collections')}>
              Latest collection <ArrowRight />
            </a>
            <Link ref={secondary} to="/womens" className="btn btn--glass">
              Shop women
            </Link>
          </div>
        </div>

        <div className="hero__stage" ref={stageRef}>
          <div className="hero__halo" />
          <div className="hero__disc" />
          <span className="shape shape--orb" />
          <span className="shape shape--ring" />
          <span className="shape shape--prism" />
          <span className="shape shape--pill" />
          <span className="shape shape--orb-sm" />

          <div className="hero__figure">
            <img
              src={hero_image}
              alt="Model wearing pieces from the new collection"
              width="613"
              height="842"
              fetchPriority="high"
              decoding="async"
            />
            <div className="hero__figure-light" />
          </div>

          {latest && (
            <Link to={`/product/${latest.id}`} className="hero__card glass">
              <img src={latest.image} alt="" width="54" height="64" />
              <span>
                <small>Just in</small>
                <strong>{latest.name}</strong>
                <em>${latest.new_price}</em>
              </span>
            </Link>
          )}
          <div className="hero__chip glass">
            <span className="hero__chip-dot" /> Free shipping
          </div>
        </div>
      </div>

      <a href="#categories" className="hero__scroll" onClick={scrollTo('categories')} aria-label="Scroll to categories">
        <span>Scroll</span>
        <i />
      </a>
    </section>
  );
};

export default Hero;
