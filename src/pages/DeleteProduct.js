import React, { useState } from 'react';
import './DeleteProduct.css';

const DeleteProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState('Men');
  const [products, setProducts] = useState([
    {
      id: 1,
      brandName: 'Nike',
      productName: 'Men Urban Style',
      color: 'Black',
      size: 'M',
      originalPrice: 2000,
      discount: 10,
      image: 'https://via.placeholder.com/80'
    },
    {
      id: 2,
      brandName: 'Adidas',
      productName: 'Casual Shirt',
      color: 'Blue',
      size: 'L',
      originalPrice: 1500,
      discount: 5,
      image: 'https://via.placeholder.com/80'
    }
  ]);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupConfirmDelete, setPopupConfirmDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleDeleteRequest = (index) => {
    setPopupConfirmDelete(true);
    setDeleteIndex(index);
  };

  const confirmDelete = (confirmed) => {
    setPopupConfirmDelete(false);
    if (confirmed && deleteIndex !== null) {
      const updated = [...products];
      updated.splice(deleteIndex, 1);
      setProducts(updated);
      setPopupMessage('Selected product deleted successfully.');
      setTimeout(() => setPopupMessage(''), 2000);
    }
    setDeleteIndex(null);
  };

  return (
    <div className="delete-product-page">
      <div className="delete-section1">
        <h2>Select Category</h2>
        <div className="category-buttons">
          {['Men', 'Women', 'Kids - Boys', 'Kids - Girls'].map(category => (
            <button
              key={category}
              className={selectedCategory === category ? 'active' : ''}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="delete-section2">
        <h2>Product Table</h2>
        <div className="table-scroll-wrapper">
          <table>
            <thead>
              <tr>
                <th>Sl. No</th>
                <th>Brand Name</th>
                <th>Product Name</th>
                <th>Color</th>
                <th>Size</th>
                <th>Original Price</th>
                <th>Discount (%)</th>
                <th>Final Price</th>
                <th>Image</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => {
                const finalPrice = (
                  product.originalPrice -
                  (product.originalPrice * product.discount) / 100
                ).toFixed(2);
                return (
                  <tr key={product.id}>
                    <td>{idx + 1}</td>
                    <td>{product.brandName}</td>
                    <td>{product.productName}</td>
                    <td>{product.color}</td>
                    <td>{product.size}</td>
                    <td>{product.originalPrice}</td>
                    <td>{product.discount}</td>
                    <td>{finalPrice}</td>
                    <td>
                      <img src={product.image} alt="product" className="table-image" />
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteRequest(idx)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {popupMessage && (
        <div className="popup-card success">{popupMessage}</div>
      )}

      {popupConfirmDelete && (
        <div className="popup-confirm-box centered-popup">
          <p>Are you sure you want to delete this product?</p>
          <div className="popup-actions">
            <button onClick={() => confirmDelete(true)}>Yes</button>
            <button onClick={() => confirmDelete(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteProduct;
