import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrum.css';

const CATEGORY_ROUTE = { men: '/mens', women: '/womens', kid: '/kids' };

const Breadcrum = ({ product }) => {
  if (!product) return null;

  return (
    <nav className="breadcrum container" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      <span aria-hidden="true">/</span>
      <Link to="/">Shop</Link>
      <span aria-hidden="true">/</span>
      <Link to={CATEGORY_ROUTE[product.category] || '/'}>{product.category}</Link>
      <span aria-hidden="true">/</span>
      <span className="breadcrum__current" aria-current="page">{product.name}</span>
    </nav>
  );
};

export default Breadcrum;
