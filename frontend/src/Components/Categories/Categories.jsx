import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Categories.css';
import banner_women from '../Assets/banner_women.webp';
import banner_mens from '../Assets/banner_mens.webp';
import banner_kids from '../Assets/banner_kids.webp';
import { ShopContext } from '../../Context/ShopContext';
import { useReveal } from '../../lib/motion';
import { ArrowRight } from '../Icons/Icons';

const PANELS = [
  { key: 'women', to: '/womens', title: 'Women', image: banner_women, variant: 'tall' },
  { key: 'men', to: '/mens', title: 'Men', image: banner_mens, variant: 'wide' },
  { key: 'kid', to: '/kids', title: 'Kids', image: banner_kids, variant: 'wide' },
];

const Panel = ({ panel, count, index }) => {
  const ref = useReveal();
  return (
    <Link
      ref={ref}
      to={panel.to}
      className={`cat-panel cat-panel--${panel.variant} reveal`}
      style={{ '--delay': `${index * 90}ms` }}
    >
      <div className="cat-panel__media">
        <img src={panel.image} alt="" loading="lazy" decoding="async" width="1560" height="335" />
      </div>
      <div className="cat-panel__liquid" aria-hidden="true" />
      <span className="cat-panel__index" aria-hidden="true">0{index + 1}</span>
      <div className="cat-panel__content">
        <h3 className="display cat-panel__title" aria-label={panel.title}>
          {panel.title.split('').map((ch, i) => (
            <span key={i} style={{ '--c': i }} aria-hidden="true">{ch}</span>
          ))}
        </h3>
        <span className="cat-panel__meta">
          {count > 0 ? `${count} styles` : 'Explore'} <ArrowRight width={16} height={16} />
        </span>
      </div>
    </Link>
  );
};

const Categories = () => {
  const { all_product } = useContext(ShopContext);
  const headRef = useReveal();

  const counts = useMemo(() => {
    const c = {};
    all_product.forEach((p) => {
      c[p.category] = (c[p.category] || 0) + 1;
    });
    return c;
  }, [all_product]);

  return (
    <section className="categories" id="categories" aria-labelledby="cat-title">
      <div className="container">
        <div className="section-head reveal" ref={headRef}>
          <div>
            <span className="eyebrow">Shop by category</span>
            <h2 id="cat-title" className="display">Find your <em>fit</em></h2>
          </div>
          <p>Browse curated edits for every wardrobe — tap a category to see everything in it.</p>
        </div>
        <div className="cat-grid">
          {PANELS.map((p, i) => (
            <Panel key={p.key} panel={p} index={i} count={counts[p.key] || 0} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
