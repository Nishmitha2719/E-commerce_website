import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams, Link } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => {
  const { all_product, productsLoading } = useContext(ShopContext);
  const { productId } = useParams();
  const product = all_product?.find((e) => e.id === Number(productId));

  if (productsLoading) {
    return (
      <div className="container product-page-loading" style={{ padding: '48px var(--gutter)' }}>
        <div className="skeleton" style={{ height: 16, width: 280, marginBottom: 32 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 48 }}>
          <div className="skeleton" style={{ aspectRatio: '350 / 418', borderRadius: 32 }} />
          <div>
            <div className="skeleton" style={{ height: 48, width: '80%' }} />
            <div className="skeleton" style={{ height: 24, width: '30%', marginTop: 24 }} />
            <div className="skeleton" style={{ height: 120, marginTop: 32 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '120px var(--gutter)', textAlign: 'center' }}>
        <h1 className="display" style={{ fontSize: 'clamp(40px,6vw,72px)' }}>Product not found</h1>
        <p style={{ color: 'var(--muted)', margin: '16px 0 32px' }}>It may have been removed or the link is incorrect.</p>
        <Link to="/" className="btn">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="product-page">
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts product={product} />
    </div>
  );
};

export default Product;
