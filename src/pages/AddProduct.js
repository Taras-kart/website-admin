import React, { useState } from 'react';
import './AddProduct.css';

const AddProduct = () => {
    const [brandList, setBrandList] = useState([
        'Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'New Balance',
        'Asics', 'Skechers', 'Fila', 'Converse', 'Vans', 'Jordan',
        'Levi\'s', 'Zara', 'H&M', 'Gucci', 'Prada', 'Balenciaga',
        'Chanel', 'Burberry', 'Lacoste', 'Tommy Hilfiger', 'Diesel',
        'Armani', 'Calvin Klein', 'Versace', 'Louis Vuitton', 'Guess',
        'Hugo Boss', 'Patagonia'
    ]);

    const [productList, setProductList] = useState([
        'Indian Women Fashion', 'Men Urban Style', 'Kids Wear', 'Office Formal Wear',
        'Ethnic Kurti', 'Designer Saree', 'Traditional Sherwani', 'Boy T-Shirts',
        'Girl Party Dresses', 'Activewear', 'Winter Jackets', 'Summer Shorts',
        'Casual Shirts', 'Denim Jeans', 'Churidar Set', 'Printed Dupatta',
        'Skater Skirts', 'Floral Blouses', 'Co-ord Sets', 'Athleisure Track',
        'Sports Tees', 'Sweatshirts', 'School Uniforms', 'Gowns',
        'Daily Cotton Wear', 'Festive Lehenga', 'Jumpsuits', 'Cargo Pants',
        'Graphic Tees', 'Layered Hoodies'
    ]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [brandInput, setBrandInput] = useState('');
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [showDropdownBrand, setShowDropdownBrand] = useState(false);
    const [showPopupBrand, setShowPopupBrand] = useState(false);
    const [newBrand, setNewBrand] = useState('');

    const [productInput, setProductInput] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showDropdownProduct, setShowDropdownProduct] = useState(false);
    const [showPopupProduct, setShowPopupProduct] = useState(false);
    const [newProduct, setNewProduct] = useState('');

    /* section 4 */
    const [originalPriceB2B, setOriginalPriceB2B] = useState('');
    const [discountB2B, setDiscountB2B] = useState('');
    const [finalPriceB2B, setFinalPriceB2B] = useState('');

    const [originalPriceB2C, setOriginalPriceB2C] = useState('');
    const [discountB2C, setDiscountB2C] = useState('');
    const [finalPriceB2C, setFinalPriceB2C] = useState('');

    const [b2bPrice, setB2bPrice] = useState('');
    const [b2cPrice, setB2cPrice] = useState('');
    const [totalCount, setTotalCount] = useState('');

    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);

    const handlePriceChangeB2B = (value) => {
        setOriginalPriceB2B(value);
        const price = parseFloat(value);
        const disc = parseFloat(discountB2B);
        if (!isNaN(price) && !isNaN(disc)) {
            setFinalPriceB2B((price - (price * disc) / 100).toFixed(2));
        }
    };

    const handleDiscountChangeB2B = (value) => {
        setDiscountB2B(value);
        const price = parseFloat(originalPriceB2B);
        const disc = parseFloat(value);
        if (!isNaN(price) && !isNaN(disc)) {
            setFinalPriceB2B((price - (price * disc) / 100).toFixed(2));
        }
    };

    const handlePriceChangeB2C = (value) => {
        setOriginalPriceB2C(value);
        const price = parseFloat(value);
        const disc = parseFloat(discountB2C);
        if (!isNaN(price) && !isNaN(disc)) {
            setFinalPriceB2C((price - (price * disc) / 100).toFixed(2));
        }
    };

    const handleDiscountChangeB2C = (value) => {
        setDiscountB2C(value);
        const price = parseFloat(originalPriceB2C);
        const disc = parseFloat(value);
        if (!isNaN(price) && !isNaN(disc)) {
            setFinalPriceB2C((price - (price * disc) / 100).toFixed(2));
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            setUploadedImage(data.imageUrl);
        } catch (error) {
            console.error('Image upload failed:', error);
        }
    };

    const colors = [
        'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple', 'Pink', 'Orange', 'Brown',
        'Grey', 'Maroon', 'Navy', 'Olive', 'Teal', 'Cyan', 'Magenta', 'Beige', 'Lavender', 'Gold'
    ];

    const colorMap = {
        Red: '#FF0000', Blue: '#0000FF', Green: '#008000', Yellow: '#FFFF00',
        Black: '#000000', White: '#FFFFFF', Purple: '#800080', Pink: '#FFC0CB',
        Orange: '#FFA500', Brown: '#A52A2A', Grey: '#808080', Maroon: '#800000',
        Navy: '#000080', Olive: '#808000', Teal: '#008080', Cyan: '#00FFFF',
        Magenta: '#FF00FF', Beige: '#F5F5DC', Lavender: '#E6E6FA', Gold: '#FFD700'
    };

    const kidsSizes = [
        'Below 1 year', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9',
        '9-10', '10-11', '11-12', '12-13', '13-14', '14-15'
    ];

    const adultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXLL'];
    /* end of section 4 */



    /* section 5 */
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');

    const handleAddProduct = async () => {
        if (
            !selectedCategory ||
            !brandInput ||
            !productInput ||
            !selectedColor ||
            !selectedSize ||
            !originalPriceB2B ||
            !discountB2B ||
            !finalPriceB2B ||
            !originalPriceB2C ||
            !discountB2C ||
            !finalPriceB2C ||

            !uploadedImage
        ) {
            setPopupMessage('Please fill all the required fields.');
            setPopupType('error');
        } else {
            const productData = {
                category: selectedCategory,
                brand: brandInput,
                product_name: productInput,
                color: selectedColor,
                size: selectedSize,
                original_price_b2b: parseFloat(originalPriceB2B),
                discount_b2b: parseFloat(discountB2B),
                final_price_b2b: parseFloat(finalPriceB2B),
                original_price_b2c: parseFloat(originalPriceB2C),
                discount_b2c: parseFloat(discountB2C),
                final_price_b2c: parseFloat(finalPriceB2C),
                total_count: parseInt(totalCount),
                image_url: uploadedImage
            };


            try {
                const response = await fetch('http://localhost:5000/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ Product added:', result);

                    setPopupMessage('Product added successfully!');
                    setPopupType('success');

                    setSelectedCategory('');
                    setBrandInput('');
                    setProductInput('');
                    setSelectedColor('');
                    setSelectedSize('');
                    setOriginalPriceB2B('');
                    setDiscountB2B('');
                    setFinalPriceB2B('');
                    setOriginalPriceB2C('');
                    setDiscountB2C('');
                    setFinalPriceB2C('');

                    setUploadedImage(null);
                } else {
                    setPopupMessage('Failed to add product. Try again.');
                    setPopupType('error');
                }
            } catch (error) {
                console.error('Error:', error);
                setPopupMessage('Something went wrong!');
                setPopupType('error');
            }
        }

        setTimeout(() => {
            setPopupMessage('');
            setPopupType('');
        }, 3000);
    };











    /* end of section 5 */

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleBrandSearch = (e) => {
        const value = e.target.value;
        setBrandInput(value);
        setShowDropdownBrand(true);
        const filtered = brandList.filter((brand) =>
            brand.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredBrands(filtered);
    };

    const handleBrandSelect = (brand) => {
        setBrandInput(brand);
        setShowDropdownBrand(false);
    };

    const handleAddNewBrand = () => {
        if (newBrand.trim() && !brandList.includes(newBrand)) {
            const updatedList = [...brandList, newBrand];
            setBrandList(updatedList);
            setFilteredBrands(updatedList);
            setBrandInput(newBrand);
        }
        setNewBrand('');
        setShowPopupBrand(false);
        setShowDropdownBrand(false);
    };

    const handleProductSearch = (e) => {
        const value = e.target.value;
        setProductInput(value);
        setShowDropdownProduct(true);
        const filtered = productList.filter((product) =>
            product.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleProductSelect = (product) => {
        setProductInput(product);
        setShowDropdownProduct(false);
    };

    const handleAddNewProduct = () => {
        if (newProduct.trim() && !productList.includes(newProduct)) {
            const updatedList = [...productList, newProduct];
            setProductList(updatedList);
            setFilteredProducts(updatedList);
            setProductInput(newProduct);
        }
        setNewProduct('');
        setShowPopupProduct(false);
        setShowDropdownProduct(false);
    };

    return (
        <div className="add-product-page">
            <div className="admin-section1">
                <h2>Category</h2>
                <div className="category-buttons">
                    {['Men', 'Women', 'Kids - Boys', 'Kids - Girls'].map((category) => (
                        <button key={category}
                            className={selectedCategory === category ? 'active' : ''} onClick={() => handleCategorySelect(category)} >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="admin-section2">
                <h2>Add Brand</h2>
                <input
                    type="text"
                    placeholder="Search brand"
                    value={brandInput}
                    onChange={handleBrandSearch}
                    onFocus={() => {
                        const filtered = brandList.filter((brand) =>
                            brand.toLowerCase().includes(brandInput.toLowerCase()));
                        setFilteredBrands(filtered);
                        setShowDropdownBrand(true);
                    }} className="brand-search" />
                {showDropdownBrand && (
                    <div className="brand-dropdown">
                        {filteredBrands.map((brand) => (
                            <div key={brand} className="brand-item"
                                onClick={() => handleBrandSelect(brand)} >
                                {brand}
                            </div>
                        ))}
                    </div>
                )}
                <button className="add-new-brand-button" onClick={() => setShowPopupBrand(true)}>
                    Add New Brand
                </button>
            </div>

            <div className="admin-section3">
                <h2>Add Product Name</h2>
                <input
                    type="text"
                    placeholder="Search product"
                    value={productInput}
                    onChange={handleProductSearch}
                    onFocus={() => {
                        const filtered = productList.filter((product) =>
                            product.toLowerCase().includes(productInput.toLowerCase())
                        );
                        setFilteredProducts(filtered);
                        setShowDropdownProduct(true);
                    }} className="brand-search" />
                {showDropdownProduct && (
                    <div className="brand-dropdown">
                        {filteredProducts.map((product) => (
                            <div key={product} className="brand-item" onClick={() => handleProductSelect(product)} >
                                {product}
                            </div>
                        ))}
                    </div>
                )}
                <button className="add-new-brand-button" onClick={() => setShowPopupProduct(true)}>
                    Add New Product
                </button>
            </div>

            {showPopupBrand && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h3>Add a New Brand</h3>
                        <input type="text"
                            placeholder="Enter new brand name" value={newBrand}
                            onChange={(e) => setNewBrand(e.target.value)} />
                        <div className="popup-actions">
                            <button onClick={handleAddNewBrand}>Add Brand</button>
                            <button onClick={() => setShowPopupBrand(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showPopupProduct && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h3>Add a New Product</h3>
                        <input type="text" placeholder="Enter new product name"
                            value={newProduct} onChange={(e) => setNewProduct(e.target.value)} />
                        <div className="popup-actions">
                            <button onClick={handleAddNewProduct}>Add Product</button>
                            <button onClick={() => setShowPopupProduct(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="admin-section4">
                <div className="section4-left">
                    <div className="section4-heading">Color</div>
                    <div className="color-grid">
                        {colors.map(color => (
                            <div className={`color-item ${selectedColor === color ? 'active' : ''}`}
                                key={color} onClick={() => setSelectedColor(color)} >
                                <div className="color-swatch" style={{ backgroundColor: colorMap[color] }}></div>
                                {color}
                            </div>
                        ))}
                    </div>

                    <div className="section4-heading">Size</div>
                    <div className="size-section">
                        <div className="sub-heading">Kids</div>
                        <div className="size-grid">
                            {kidsSizes.map(size => (
                                <div className={`size-box ${selectedSize === size ? 'active' : ''}`}
                                    key={size} onClick={() => setSelectedSize(size)} >
                                    {size}
                                </div>
                            ))}
                        </div>
                        <div className="sub-heading">Adults</div>
                        <div className="size-grid">
                            {adultSizes.map(size => (
                                <div className={`size-box ${selectedSize === size ? 'active' : ''}`}
                                    key={size} onClick={() => setSelectedSize(size)} >
                                    {size}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="price-inputs">
                        <table className="price-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>B2B</th>
                                    <th>B2C</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Original Price</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={originalPriceB2B}
                                            onChange={(e) => handlePriceChangeB2B(e.target.value)}
                                        />

                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={originalPriceB2C}
                                            onChange={(e) => handlePriceChangeB2C(e.target.value)}
                                        />

                                    </td>
                                </tr>
                                <tr>
                                    <td>Discount (%)</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={discountB2B}
                                            onChange={(e) => handleDiscountChangeB2B(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={discountB2C}
                                            onChange={(e) => handleDiscountChangeB2C(e.target.value)}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>Final Price</td>
                                    <td>
                                        <input type="number" value={finalPriceB2B} readOnly />
                                    </td>
                                    <td>
                                        <input type="number" value={finalPriceB2C} readOnly />
                                    </td>
                                </tr>


                                <tr>
                                    <td>Total Count</td>
                                    <td colSpan="2" className="centered-input">
                                        <input
                                            type="number"
                                            value={totalCount}
                                            onChange={(e) => setTotalCount(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                </div>

                <div className="section4-right">
                    <div className="image-upload-container">
                        <label className="upload-btn">
                            Upload Image
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                        </label>
                        {uploadedImage && (
                            <img src={uploadedImage} alt="Uploaded" className="preview-image" />
                        )}
                    </div>
                </div>
            </div>


            <div className="admin-section5">
                <button className="add-product-final-btn" onClick={handleAddProduct}>Add Product</button>
            </div>

            {popupMessage && (
                <div className={`popup-card ${popupType}`}>
                    {popupMessage}
                </div>
            )}



        </div>
    );
};

export default AddProduct;
