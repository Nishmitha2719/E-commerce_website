import React, { useState, useEffect } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/allproducts');
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await res.json();
      console.log('Fetched products:', data);
      setAllProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    try {
      await fetch('http://localhost:4000/removeproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })
      });
      await fetchInfo();
    } catch (err) {
      console.error("Error removing product:", err);
      alert("Failed to remove product");
    }
  }

  if (loading) return <div className='list-product'>Loading...</div>;
  if (error) return <div className='list-product'>{error}</div>;

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className='listproduct-format-main'>
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      <div className='listproduct-allproducts'>
        <hr />
        {allproducts.length > 0 ? (
          allproducts.map((product) => {
            return (
              <React.Fragment key={product.id || product._id || Math.random()}>
                <div className='listproduct-format-main listproduct-format'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='listproduct-product-icon'
                  />
                  <p>{product.name}</p>
                  <p>${product.old_price}</p>
                  <p>${product.new_price}</p>
                  <p>{product.category}</p>
                  <img onClick={() => { remove_product(product.id) }} className='listproduct-remove-icon' src={cross_icon} alt='remove' />
                </div>
                <hr />
              </React.Fragment>
            );
          })
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );

};

export default ListProduct;
