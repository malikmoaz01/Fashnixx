import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const categoriesData = {
  Shoes: [
    "Men's Shoes",
    "Women's Shoes",
  ],
  Clothing: [
    "Men's Clothing",
    "Women's Clothing",
    "Kid's Clothing"
  ],
  Watches: [
    "Men's Watches",
    "Women's Watches",
    "Smartwatches",
    "Luxury Watches"
  ],
  Accessories: [
    "Mobile Accessories",
    "Laptop Accessories",
    "Other Accessories"
  ]
};

const subCategoriesData = {
  "Men's Clothing": [
    "T-Shirts",
    "Jeans",
    "Jackets",
    "Formal Wear",
    "Ethnic Wear"
  ],
  "Women's Clothing": [
    "Dresses",
    "Tops",
    "Jeans",
    "Abayas",
    "Kurtis",
    "Ethnic Wear"
  ],
  "Men's Shoes" : [
    "Dress Shoes",
    "Casual Shoes",
    "Slipers",
    "Boots",
    "Sneakers",
    "Sandals",
  ],
  "Women's Shoes": [
    "Heels",
    "Flats",
    "Sneakers",
    "Sandals",
    "Boots",
    "Casual Shoes"
  ],
  "Kid's Clothing": [
    "Dresses",
    "Tops",
    "Jeans",
    "Abayas",
    "Kurtis",
    "Ethnic Wear"
  ],
  "Mobile Accessories": [
    "Covers",
    "Chargers",
    "Headphones",
    "Smart Gadgets"
  ],
  "Laptop Accessories": [
    "Bags",
    "Mouse",
    "Cooling Pads",
    "Keyboards"
  ],
  "Other Accessories": [
    "Sunglasses",
    "Belts",
    "Wallets",
    "Jewelry"
  ]
};

const clothingSizes = ["Standard", "X", "XL", "2XL", "3XL", "4XL", "5XL"];
const shoeSizes = {
  "Men's Shoes": [39, 40, 41, 42, 43, 44, 45],
  "Women's Shoes": [36, 37, 38, 39, 40, 41, 42],
};

const ProductManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showManageProducts, setShowManageProducts] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    subsubcategory: '',
    sizeStock: [],
    price: '',
    discountPrice: '',
    rating: '',
    reviews: '',
    stock: [],
    images: [],
  });
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const formatProductForSubmission = (product) => {
    const formattedProduct = { ...product };
    
    if (formattedProduct.sizeStock && formattedProduct.sizeStock.length > 0) {
      formattedProduct.stock = formattedProduct.sizeStock.map(item => ({
        size: item.size.toString(), 
        quantity: parseInt(item.stock, 10) 
      }));
    } else if (formattedProduct.stock && typeof formattedProduct.stock === 'string') {
      formattedProduct.stock = [{
        size: "Standard",
        quantity: parseInt(formattedProduct.stock, 10)
      }];
    }
    
    delete formattedProduct.sizeStock;
    
    formattedProduct.price = parseFloat(formattedProduct.price);
    if (formattedProduct.discountPrice) {
      formattedProduct.discountPrice = parseFloat(formattedProduct.discountPrice);
    }
    if (formattedProduct.rating) {
      formattedProduct.rating = parseFloat(formattedProduct.rating);
    }
    if (formattedProduct.reviews) {
      formattedProduct.reviews = parseInt(formattedProduct.reviews, 10);
    }
    
    return formattedProduct;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.description || !newProduct.category || 
        !newProduct.subcategory || !newProduct.price || newProduct.images.length < 1) {
      alert('Please fill all required fields and add at least one image.');
      return;
    }
    
    try {
      const formattedProduct = formatProductForSubmission(newProduct);
      
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedProduct),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Failed to add product.');
      } else {
        alert('Product added successfully!');
        setShowAddForm(false);
        setNewProduct({
          name: '',
          description: '',
          category: '',
          subcategory: '',
          subsubcategory: '',
          sizeStock: [],
          price: '',
          discountPrice: '',
          rating: '',
          reviews: '',
          stock: [],
          images: [],
        });
        fetchProducts();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Something went wrong!');
    }
  };

  const handleEditProduct = (product) => {
    const editableProduct = { ...product };
    
    if (product.stock && product.stock.length > 0) {
      editableProduct.sizeStock = product.stock.map(item => ({
        size: item.size,
        stock: item.quantity
      }));
    } else {
      editableProduct.sizeStock = [];
    }
    
    setEditProduct(editableProduct);
    setShowAddForm(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    try {
      const formattedProduct = formatProductForSubmission(editProduct);
      
      const response = await fetch(`http://localhost:5000/api/products/${editProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedProduct),
      });

      if (response.ok) {
        alert('Product updated successfully');
        setEditProduct(null);
        setShowAddForm(false);
        fetchProducts();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert('Something went wrong!');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Product deleted successfully');
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Something went wrong!');
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setNewProduct({
      ...newProduct,
      category: selectedCategory,
      subcategory: '',
      subsubcategory: '',
      sizeStock: [],
    });
  };
  
  const handleSubCategoryChange = (e) => {
    const selectedSubcategory = e.target.value;
    setNewProduct({
      ...newProduct,
      subcategory: selectedSubcategory,
      subsubcategory: '',
      sizeStock: []
    });
  };

  const getSizeOptions = () => {
    if (shoeSizes[newProduct.subcategory]) {
      return shoeSizes[newProduct.subcategory].map(size => size.toString());
    }
    if (subCategoriesData["Men's Clothing"]?.includes(newProduct.subsubcategory) ||
        subCategoriesData["Women's Clothing"]?.includes(newProduct.subsubcategory)) {
      return clothingSizes;
    }
    return [];
  };

  const handleImageChange = (e, index) => {
    const updatedImages = [...(editProduct ? editProduct.images : newProduct.images)];
    updatedImages[index] = e.target.value;

    if (editProduct) {
      setEditProduct({ ...editProduct, images: updatedImages });
    } else {
      setNewProduct({ ...newProduct, images: updatedImages });
    }
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      const updatedImages = [...(editProduct ? editProduct.images : newProduct.images)];
      updatedImages[index] = base64Image;

      if (editProduct) {
        setEditProduct({ ...editProduct, images: updatedImages });
      } else {
        setNewProduct({ ...newProduct, images: updatedImages });
      }
    };
    reader.readAsDataURL(file);
  };

  const addImageField = () => {
    if (editProduct) {
      setEditProduct({ ...editProduct, images: [...editProduct.images, ''] });
    } else {
      setNewProduct({ ...newProduct, images: [...newProduct.images, ''] });
    }
  };

  const highlightText = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-red-500 text-white">{part}</span>
      ) : part
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Product Management</h2>

        <div className="mb-4 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 p-3 bg-[#374151] text-white rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            className="bg-[#374151] rounded-lg shadow-md p-6 cursor-pointer"
            onClick={() => setShowAddForm(true)}
          >
            <h3 className="text-lg font-semibold text-[#9CA3AF]">
              {highlightText("Add New Product")}
            </h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">
              {highlightText("Add a new product to your catalog")}
            </p>
          </div>

          <div
            className="bg-[#374151] rounded-lg shadow-md p-6 cursor-pointer"
            onClick={() => setShowManageProducts(true)}
          >
            <h3 className="text-lg font-semibold text-[#9CA3AF]">
              {highlightText("Manage Products")}
            </h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">
              {highlightText("View and manage existing products")}
            </p>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-[#374151] mt-8 p-6 rounded-lg shadow-md text-white">
            <h3 className="text-xl font-semibold mb-4">{editProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={editProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={editProduct ? editProduct.name : newProduct.name}
                onChange={(e) => editProduct 
                  ? setEditProduct({ ...editProduct, name: e.target.value })
                  : setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="w-full p-3 rounded-md text-black"
                required
              />

              <textarea
                placeholder="Description"
                value={editProduct ? editProduct.description : newProduct.description}
                onChange={(e) => editProduct
                  ? setEditProduct({ ...editProduct, description: e.target.value })
                  : setNewProduct({ ...newProduct, description: e.target.value })
                }
                className="w-full p-3 rounded-md text-black"
                required
              />

              <select
                value={editProduct ? editProduct.category : newProduct.category}
                onChange={handleCategoryChange}
                className="w-full p-3 rounded-md text-black"
                required
              >
                <option value="">Select Category</option>
                {Object.keys(categoriesData).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {(editProduct ? editProduct.category : newProduct.category) && (
                <select
                  value={editProduct ? editProduct.subcategory : newProduct.subcategory}
                  onChange={handleSubCategoryChange}
                  className="w-full p-3 rounded-md text-black"
                  required
                >
                  <option value="">Select Subcategory</option>
                  {categoriesData[editProduct ? editProduct.category : newProduct.category].map((subcategory) => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                  ))}
                </select>
              )}

              {subCategoriesData[editProduct ? editProduct.subcategory : newProduct.subcategory] && (
                <div>
                  <h4 className="mb-2">Select Sub-Sub Category</h4>
                  <select
                    className="w-full p-3 rounded-md text-black"
                    onChange={(e) => editProduct
                      ? setEditProduct({ ...editProduct, subsubcategory: e.target.value })
                      : setNewProduct({ ...newProduct, subsubcategory: e.target.value })
                    }
                    value={editProduct ? editProduct.subsubcategory || '' : newProduct.subsubcategory || ''}
                  >
                    <option value="">Select Item Type</option>
                    {subCategoriesData[editProduct ? editProduct.subcategory : newProduct.subcategory].map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              )}

              {getSizeOptions().length > 0 && (
                <div>
                  <h4 className="mb-2">Sizes & Stock</h4>
                  {getSizeOptions().map((size) => {
                    const existing = (editProduct ? editProduct.sizeStock : newProduct.sizeStock).find(item => item.size === size);
                    return (
                      <div key={size} className="flex items-center gap-2 mb-2">
                        <label className="w-1/3">{size}</label>
                        <input
                          type="number"
                          placeholder="Stock"
                          className="w-2/3 p-2 rounded-md text-black"
                          value={existing ? existing.stock : ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            let updatedSizeStock = [...(editProduct ? editProduct.sizeStock : newProduct.sizeStock)];
                            const index = updatedSizeStock.findIndex(item => item.size === size);

                            if (index > -1) {
                              updatedSizeStock[index].stock = value;
                            } else {
                              updatedSizeStock.push({ size, stock: value });
                            }

                            if (editProduct) {
                              setEditProduct({ ...editProduct, sizeStock: updatedSizeStock });
                            } else {
                              setNewProduct({ ...newProduct, sizeStock: updatedSizeStock });
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Price */}
              <input
                type="number"
                placeholder="Price (Rs)"
                value={editProduct ? editProduct.price : newProduct.price}
                onChange={(e) => (editProduct
                  ? setEditProduct({ ...editProduct, price: e.target.value })
                  : setNewProduct({ ...newProduct, price: e.target.value })
                )}
                className="w-full p-3 rounded-md text-black"
                required
              />
              <input
                type="number"
                placeholder="Discount Price (Rs)"
                value={editProduct ? editProduct.discountPrice : newProduct.discountPrice}
                onChange={(e) => (editProduct 
                  ? setEditProduct({ ...editProduct, discountPrice: e.target.value }) 
                  : setNewProduct({ ...newProduct, discountPrice: e.target.value })
                )}
                className="w-full p-3 rounded-md text-black"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Rating (e.g., 4.6)"
                value={editProduct ? editProduct.rating : newProduct.rating}
                onChange={(e) => (editProduct 
                  ? setEditProduct({ ...editProduct, rating: e.target.value }) 
                  : setNewProduct({ ...newProduct, rating: e.target.value })
                )}
                className="w-full p-3 rounded-md text-black"
              />
              <input
                type="number"
                placeholder="Reviews Count"
                value={editProduct ? editProduct.reviews : newProduct.reviews}
                onChange={(e) => (editProduct 
                  ? setEditProduct({ ...editProduct, reviews: e.target.value }) 
                  : setNewProduct({ ...newProduct, reviews: e.target.value })
                )}
                className="w-full p-3 rounded-md text-black"
              />
              {getSizeOptions().length === 0 && (
                <input
                  type="number"
                  placeholder="Stock"
                  value={editProduct ? editProduct.stock : newProduct.stock}
                  onChange={(e) => (editProduct
                    ? setEditProduct({ ...editProduct, stock: e.target.value })
                    : setNewProduct({ ...newProduct, stock: e.target.value })
                  )}
                  className="w-full p-3 rounded-md text-black"
                  required
                />
              )}

              {/* Images */}
              <div>
                <h4 className="mb-2">Product Images (Add Link or Upload Image)</h4>
                {(editProduct ? editProduct.images : newProduct.images).map((image, index) => (
                  <div key={index} className="mb-4">
                    <input
                      type="text"
                      placeholder={`Image URL ${index + 1}`}
                      value={image.startsWith('data:') ? '' : image}
                      onChange={(e) => handleImageChange(e, index)}
                      className="w-full p-3 rounded-md text-black mb-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, index)}
                      className="w-full p-3 rounded-md bg-white text-black"
                    />
                    {image && (
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="mt-2 w-32 h-32 object-cover rounded-md border"
                      />
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
                >
                  + Add Image
                </button>
              </div>

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md"
              >
                {editProduct ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditProduct(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md ml-4"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {showManageProducts && (
          <div className="mt-8 bg-[#374151] p-6 rounded-lg">
            <h3 className="text-2xl font-semibold text-[#F9FAFB]">Manage Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((product) => (
                  <div key={product._id} className="bg-[#374151] rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-[#9CA3AF]">{highlightText(product.name)}</h3>
                    <p className="text-2xl font-bold text-[#F9FAFB] mt-2">{highlightText(product.description)}</p>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-yellow-600 text-white px-4 py-2 mt-4 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="bg-red-600 text-white px-4 py-2 mt-2 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;