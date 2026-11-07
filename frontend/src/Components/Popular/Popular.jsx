import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Popular.css';
import Item, { ItemSkeleton } from '../Item/Item';
import { getJSON } from '../../lib/api';
import { useReveal } from '../../lib/motion';
import { ArrowRight } from '../Icons/Icons';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const headRef = useReveal();

  useEffect(() => {
    let alive = true;
    getJSON('/popularinwomen')
      .then((data) => alive && Array.isArray(data) && setPopularProducts(data))
      .catch((error) => console.error('Error fetching popular products:', error))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  if (!loading && popularProducts.length === 0) return null;

  return (
    <section className="popular veil-light" id="popular" aria-labelledby="popular-title">
      <div className="container">
        <div className="section-head reveal" ref={headRef}>
          <div>
            <span className="eyebrow">Best sellers</span>
            <h2 id="popular-title" className="display">Popular in <em>women</em></h2>
          </div>
          <Link to="/womens" className="link-arrow">View all women <ArrowRight width={16} height={16} /></Link>
        </div>
        <div className="product-grid">
          {loading
            ? Array.from({ length: 4 }, (_, i) => <ItemSkeleton key={i} />)
            : popularProducts.map((item, i) => (
                <Item
                  key={item.id}
                  index={i}
                  id={item.id}
                  name={item.name}
                  image={item.image}
                  new_price={item.new_price}
                  old_price={item.old_price}
                  category={item.category}
                  available={item.available !== false}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default Popular;
