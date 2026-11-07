import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import { Close, Minus, Plus, ArrowRight } from '../Icons/Icons';

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart, productsLoading } = useContext(ShopContext);
  const lines = all_product.filter((e) => cartItems[e.id] > 0);
  const total = getTotalCartAmount();

  const removeAll = (id) => {
    for (let i = 0; i < cartItems[id]; i++) removeFromCart(id);
  };

  return (
    <div className="cartitems container">
      <header className="cartitems-head">
        <span className="eyebrow">Your bag</span>
        <h1 className="display">Shopping <em>cart</em></h1>
      </header>

      {!productsLoading && lines.length === 0 ? (
        <div className="cartitems-empty glass">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn">Continue shopping <ArrowRight /></Link>
        </div>
      ) : (
        <div className="cartitems-layout">
          <div className="cartitems-list">
            <div className="cartitems-format-main cartitems-labels" aria-hidden="true">
              <p>Product</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p />
            </div>
            {lines.map((e) => (
              <div className="cartitems-format cartitems-format-main" key={e.id}>
                <Link to={`/product/${e.id}`} className="carticon-product-link">
                  <img src={e.image} alt="" className="carticon-product-icon" width="72" height="86" loading="lazy" />
                </Link>
                <Link to={`/product/${e.id}`} className="cartitems-name">{e.name}</Link>
                <p className="cartitems-price">${e.new_price}</p>
                <div className="cartitems-quantity" role="group" aria-label={`Quantity for ${e.name}`}>
                  <button type="button" aria-label="Decrease quantity" onClick={() => removeFromCart(e.id)}><Minus width={16} height={16} /></button>
                  <span aria-live="polite">{cartItems[e.id]}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => addToCart(e.id)}><Plus width={16} height={16} /></button>
                </div>
                <p className="cartitems-line-total">${e.new_price * cartItems[e.id]}</p>
                <button type="button" className="cartItems-remove-icon" aria-label={`Remove ${e.name} from cart`} onClick={() => removeAll(e.id)}>
                  <Close width={16} height={16} />
                </button>
              </div>
            ))}
          </div>

          <aside className="cartitems-down">
            <div className="cartitems-total glass">
              <h2>Cart totals</h2>
              <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>${total}</p>
              </div>
              <div className="cartitems-total-item">
                <p>Shipping fee</p>
                <p>Free</p>
              </div>
              <div className="cartitems-total-item cartitems-total-item--grand">
                <h3>Total</h3>
                <h3>${total}</h3>
              </div>
              <button type="button" className="btn cartitems-checkout">Proceed to checkout <ArrowRight /></button>
            </div>
            <form className="cartitems-promocode" onSubmit={(ev) => ev.preventDefault()}>
              <label htmlFor="promo">If you have a promo code, enter it here</label>
              <div className="cartitems-promobox">
                <input id="promo" type="text" placeholder="Promo code" />
                <button type="submit">Submit</button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartItems;
