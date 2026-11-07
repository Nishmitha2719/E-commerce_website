import React, { useState, useEffect } from 'react';
import './NewCollections.css';
import Item, { ItemSkeleton } from '../Item/Item';
import { getJSON } from '../../lib/api';
import { useReveal } from '../../lib/motion';

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);
  const [loading, setLoading] = useState(true);
  const headRef = useReveal();

  useEffect(() => {
    let alive = true;
    getJSON('/newcollections')
      .then((data) => alive && Array.isArray(data) && setNew_collection(data))
      .catch((error) => console.error('Error fetching new collections:', error))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="new-collections veil-pearl" id="new-collections" aria-labelledby="new-title">
      <div className="container">
        <div className="section-head reveal" ref={headRef}>
          <div>
            <span className="eyebrow">Just landed</span>
            <h2 id="new-title" className="display">New <em>collections</em></h2>
          </div>
          <p>The latest pieces added to the store — fresh styles across every category.</p>
        </div>
        <div className="product-grid">
          {loading
            ? Array.from({ length: 8 }, (_, i) => <ItemSkeleton key={i} />)
            : new_collection.map((item, i) => (
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
        {!loading && new_collection.length === 0 && (
          <p className="empty-note">New products will appear here as soon as they’re added.</p>
        )}
      </div>
    </section>
  );
};

export default NewCollections;
