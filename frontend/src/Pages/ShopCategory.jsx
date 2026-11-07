import React, { useContext, useEffect, useMemo, useState } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import Item, { ItemSkeleton } from '../Components/Item/Item';
import Dropdown from '../Components/Dropdown/Dropdown';

const TITLES = { men: 'Men', women: 'Women', kid: 'Kids' };
const PAGE = 12;

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'discount', label: 'Biggest discount' },
];

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'sale', label: 'On sale', test: (p) => p.old_price > p.new_price },
  { value: 'under50', label: 'Under $50', test: (p) => p.new_price < 50 },
  { value: '50to100', label: '$50 – $100', test: (p) => p.new_price >= 50 && p.new_price <= 100 },
  { value: 'over100', label: 'Over $100', test: (p) => p.new_price > 100 },
  { value: 'instock', label: 'In stock', test: (p) => p.available !== false },
];

const discountOf = (p) => (p.old_price > 0 ? 1 - p.new_price / p.old_price : 0);
const timeOf = (p) => (p.date ? new Date(p.date).getTime() : p.id);

const ShopCategory = (props) => {
  const { all_product, productsLoading } = useContext(ShopContext);
  const [sort, setSort] = useState('featured');
  const [filter, setFilter] = useState('all');
  const [visible, setVisible] = useState(PAGE);

  // reset when switching category
  useEffect(() => {
    setSort('featured');
    setFilter('all');
    setVisible(PAGE);
  }, [props.category]);

  const inCategory = useMemo(() => all_product.filter((p) => p.category === props.category), [all_product, props.category]);

  const products = useMemo(() => {
    const f = FILTERS.find((x) => x.value === filter);
    let list = f && f.test ? inCategory.filter(f.test) : [...inCategory];
    switch (sort) {
      case 'newest':
        list.sort((a, b) => timeOf(b) - timeOf(a));
        break;
      case 'price-asc':
        list.sort((a, b) => a.new_price - b.new_price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.new_price - a.new_price);
        break;
      case 'discount':
        list.sort((a, b) => discountOf(b) - discountOf(a));
        break;
      default:
        break;
    }
    return list;
  }, [inCategory, filter, sort]);

  const shown = products.slice(0, visible);
  const title = TITLES[props.category] || props.category;

  return (
    <div className="shop-category">
      <div className="container">
        <header className="shopcategory-hero">
          <div className="shopcategory-hero__copy">
            <span className="eyebrow">Collection</span>
            <h1 className="display">{title}<em>.</em></h1>
          </div>
          <div className="shopcategory-banner">
            <img src={props.banner} alt={`${title} collection`} width="1560" height="335" decoding="async" fetchPriority="high" />
          </div>
        </header>

        <div className="shopcategory-toolbar">
          <div className="shopcategory-filters" role="group" aria-label="Filter products">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`chip${filter === f.value ? ' is-active' : ''}`}
                aria-pressed={filter === f.value}
                onClick={() => {
                  setFilter(f.value);
                  setVisible(PAGE);
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Dropdown label="Sort by" value={sort} options={SORTS} onChange={setSort} />
        </div>

        <p className="shopcategory-count" aria-live="polite">
          {productsLoading ? (
            'Loading products…'
          ) : (
            <>
              <span>Showing {products.length === 0 ? 0 : 1}–{shown.length}</span> of {products.length} products
            </>
          )}
        </p>

        <div className="product-grid shopcategory-products">
          {productsLoading
            ? Array.from({ length: 8 }, (_, i) => <ItemSkeleton key={i} />)
            : shown.map((item, i) => (
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

        {!productsLoading && products.length === 0 && (
          <div className="shopcategory-empty">
            <p>No products match this filter.</p>
            <button type="button" className="btn btn--glass btn--sm" onClick={() => setFilter('all')}>Clear filter</button>
          </div>
        )}

        {visible < products.length && (
          <div className="shopcategory-loadmore">
            <button type="button" className="btn btn--glass" onClick={() => setVisible((v) => v + 8)}>
              Explore more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopCategory;
