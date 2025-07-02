import React, { useState } from 'react';
import './UpdateProduct.css';

const UpdateProduct = () => {
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
    const [popupConfirm, setPopupConfirm] = useState(false);
    /*const [popupMessage, setPopupMessage] = useState(''); */
        const [popupType, setPopupType] = useState('');

    const handleInputChange = (index, field, value) => {
        const updated = [...products];
        updated[index][field] = field === 'originalPrice' || field === 'discount' ? parseFloat(value) : value;
        setProducts(updated);
    };

    const handleImageChange = (index, file) => {
        const updated = [...products];
        if (file) {
            updated[index].image = URL.createObjectURL(file);
        }
        setProducts(updated);
    };

    const handleUpdateClick = () => {
        const isValid = products.every(
            p =>
                p.brandName &&
                p.productName &&
                p.color &&
                p.size &&
                p.originalPrice &&
                p.discount &&
                p.image
        );
        if (!isValid) {
            setPopupMessage('Please fill all the fields.');
            setPopupType('error');
            setTimeout(() => setPopupMessage(''), 2000);
        } else {
            setPopupConfirm(true);
        }
    };

    const confirmUpdate = (confirmed) => {
        setPopupConfirm(false);
        if (confirmed) {
            setPopupMessage('Product updated successfully.');
            setPopupType('success');
            setTimeout(() => setPopupMessage(''), 2000);
        }
    };

    return (
        <div className="update-product-page">
            <div className="update-section1">
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

            <div className="update-section2">
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
                                    <td>
                                        <input
                                            type="text"
                                            value={product.brandName}
                                            onChange={e => handleInputChange(idx, 'brandName', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={product.productName}
                                            onChange={e => handleInputChange(idx, 'productName', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={product.color}
                                            onChange={e => handleInputChange(idx, 'color', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={product.size}
                                            onChange={e => handleInputChange(idx, 'size', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={product.originalPrice}
                                            onChange={e => handleInputChange(idx, 'originalPrice', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={product.discount}
                                            onChange={e => handleInputChange(idx, 'discount', e.target.value)}
                                        />
                                    </td>
                                    <td>{finalPrice}</td>
                                    <td>
                                        <img src={product.image} alt="product" className="table-image" />
                                        <label className="image-upload-btn">
                                            Add New Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={e => handleImageChange(idx, e.target.files[0])}
                                            />
                                        </label>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                </div>
            </div>

            <div className="update-section3">
                <button className="update-product-btn" onClick={handleUpdateClick}>Update Product</button>
            </div>

            {popupMessage && (
                <div className={`popup-card ${popupType}`}>
                    {popupMessage}
                </div>
            )}

            {popupConfirm && (
                <div className="popup-confirm-box centered-popup">
                    <p>Are you sure to update the product?</p>
                    <div className="popup-actions">
                        <button onClick={() => confirmUpdate(true)}>Yes</button>
                        <button onClick={() => confirmUpdate(false)}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateProduct;
