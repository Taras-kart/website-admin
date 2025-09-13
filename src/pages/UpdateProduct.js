import React, { useState, useEffect } from 'react';
import './UpdateProduct.css';

const API_BASE = 'http://localhost:5000'; // Change this to your API URL

const UpdateProduct = () => {
    const [selectedCategory, setSelectedCategory] = useState('Men');
    const [products, setProducts] = useState([]);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');
    const [popupConfirm, setPopupConfirm] = useState(false);
    const [updatedProducts, setUpdatedProducts] = useState([]);

    // Fetch products from backend
    useEffect(() => {
        fetch(`${API_BASE}/api/products?category=${encodeURIComponent(selectedCategory)}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setUpdatedProducts(data); // keep copy for edits
            })
            .catch(err => console.error('Error fetching products:', err));
    }, [selectedCategory]);

    const handleInputChange = (index, field, value) => {
        const updated = [...updatedProducts];
        updated[index][field] = field === 'originalPrice' || field === 'discount' ? parseFloat(value) : value;
        setUpdatedProducts(updated);
    };

    const handleImageChange = (index, file) => {
        const updated = [...updatedProducts];
        if (file) {
            updated[index].image = URL.createObjectURL(file);
            updated[index].newImageFile = file; // store actual file for upload
        }
        setUpdatedProducts(updated);
    };

    const handleUpdateClick = () => {
        const isValid = updatedProducts.every(
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

    const confirmUpdate = async (confirmed) => {
        setPopupConfirm(false);
        if (confirmed) {
            try {
                // send updated products to backend
                for (let product of updatedProducts) {
                    const formData = new FormData();
                    formData.append('brandName', product.brandName);
                    formData.append('productName', product.productName);
                    formData.append('color', product.color);
                    formData.append('size', product.size);
                    formData.append('originalPrice', product.originalPrice);
                    formData.append('discount', product.discount);
                    if (product.newImageFile) {
                        formData.append('image', product.newImageFile);
                    }

                    await fetch(`${API_BASE}/api/products/${product.id}`, {
                        method: 'PUT',
                        body: formData
                    });
                }

                setProducts(updatedProducts); // instantly update table
                setPopupMessage('Product updated successfully.');
                setPopupType('success');
                setTimeout(() => setPopupMessage(''), 2000);
            } catch (err) {
                console.error(err);
                setPopupMessage('Error updating products.');
                setPopupType('error');
                setTimeout(() => setPopupMessage(''), 2000);
            }
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
                            {updatedProducts.map((product, idx) => {
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
