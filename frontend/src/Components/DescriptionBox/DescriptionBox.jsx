import React from 'react';
import './DescriptionBox.css';
import { useReveal } from '../../lib/motion';

const DescriptionBox = () => {
  const ref = useReveal();
  return (
    <section className="descriptionbox container reveal" ref={ref}>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box is-active">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description glass">
        <p>
          An e-commerce website is an online platform that facilitates buying and selling of products or services over
          the internet. It serves as a virtual marketplace where businesses and individuals showcase their products,
          interact with customers, and conduct transactions without the need for a physical presence. E-commerce
          websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.
        </p>
      </div>
    </section>
  );
};

export default DescriptionBox;
