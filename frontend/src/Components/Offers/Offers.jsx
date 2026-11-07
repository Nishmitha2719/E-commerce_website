import React from 'react';
import './Offers.css';
import exclusive_image from '../Assets/exclusive_image.webp';
import { useMagnetic, useReveal } from '../../lib/motion';
import { ArrowRight } from '../Icons/Icons';

const Offers = () => {
  const ref = useReveal();
  const btn = useMagnetic(0.3);

  const goToBestSellers = (e) => {
    const el = document.getElementById('popular');
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="offers-wrap" aria-labelledby="offers-title">
      <div className="container">
        <div className="offers reveal" ref={ref}>
          <div className="offers__chrome" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div className="offers-left">
            <span className="eyebrow offers__eyebrow">Only on best seller products</span>
            <h2 id="offers-title" className="display">
              Exclusive <em>offers</em> for you
            </h2>
            <a ref={btn} href="/#popular" onClick={goToBestSellers} className="btn btn--light">
              Check now <ArrowRight />
            </a>
          </div>
          <div className="offers-right">
            <div className="offers__ring" aria-hidden="true" />
            <img src={exclusive_image} alt="Model wearing a best-selling outfit" loading="lazy" decoding="async" width="375" height="548" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offers;
