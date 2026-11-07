import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './CSS/ListPage.css';
import { ShopContext } from '../Context/ShopContext';
import Item, { ItemSkeleton } from '../Components/Item/Item';
import { ArrowRight } from '../Components/Icons/Icons';

const Wishlist = () => {
  const { all_product, productsLoading, wishlist } = useContext(ShopContext);
  const items = all_product.filter((p) => wishlist.includes(p.id));

  return (
    <div className="list-page container">
      <header className="list-page__head">
        <span className="eyebrow">Saved for later</span>
        <h1 className="display">Wish<em>list</em></h1>
        <p>{items.length} saved item{items.length === 1 ? '' : 's'}</p>
      </header>
      <div className="product-grid">
        {productsLoading && wishlist.length > 0
          ? Array.from({ length: Math.min(4, wishlist.length) }, (_, i) => <ItemSkeleton key={i} />)
          : items.map((item, i) => (
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
      {!productsLoading && items.length === 0 && (
        <div className="list-page__empty">
          <p>Tap the heart on any product to save it here.</p>
          <div>
            <Link className="btn" to="/">Start shopping <ArrowRight /></Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
