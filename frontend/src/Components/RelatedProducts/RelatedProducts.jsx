import React, { useContext, useMemo } from 'react';
import './RelatedProducts.css';
import Item from '../Item/Item';
import { ShopContext } from '../../Context/ShopContext';
import { useReveal } from '../../lib/motion';

// Real related products: same category as the current product (was static demo data before).
const RelatedProducts = ({ product }) => {
  const { all_product } = useContext(ShopContext);
  const headRef = useReveal();

  const related = useMemo(() => {
    if (!product) return [];
    return all_product.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [all_product, product]);

  if (related.length === 0) return null;

  return (
    <section className="relatedproducts veil-pearl" aria-labelledby="related-title">
      <div className="container">
        <div className="section-head reveal" ref={headRef}>
          <div>
            <span className="eyebrow">You may also like</span>
            <h2 id="related-title" className="display">Related <em>products</em></h2>
          </div>
        </div>
        <div className="product-grid">
          {related.map((item, i) => (
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

export default RelatedProducts;
