import React, { useContext, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './CSS/ListPage.css';
import { ShopContext } from '../Context/ShopContext';
import Item, { ItemSkeleton } from '../Components/Item/Item';

const SearchResults = () => {
  const { all_product, productsLoading } = useContext(ShopContext);
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim();

  const results = useMemo(() => {
    const needle = q.toLowerCase();
    if (!needle) return [];
    return all_product.filter(
      (p) => p.name.toLowerCase().includes(needle) || (p.category || '').toLowerCase().includes(needle)
    );
  }, [all_product, q]);

  return (
    <div className="list-page container">
      <header className="list-page__head">
        <span className="eyebrow">Search</span>
        <h1 className="display">“{q || '…'}”</h1>
        <p>{productsLoading ? 'Searching…' : `${results.length} product${results.length === 1 ? '' : 's'} found`}</p>
      </header>
      <div className="product-grid">
        {productsLoading
          ? Array.from({ length: 4 }, (_, i) => <ItemSkeleton key={i} />)
          : results.map((item, i) => (
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
      {!productsLoading && results.length === 0 && (
        <div className="list-page__empty">
          <p>Try another word, or browse a category.</p>
          <div>
            <Link className="btn btn--glass btn--sm" to="/womens">Women</Link>
            <Link className="btn btn--glass btn--sm" to="/mens">Men</Link>
            <Link className="btn btn--glass btn--sm" to="/kids">Kids</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
