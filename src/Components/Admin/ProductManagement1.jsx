import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showManageProducts, setShowManageProducts] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '',
    rating: '',
    reviews: '',
    stock: '',
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Failed to add product.');
      } else {
        alert('Product added successfully!');
        setShowAddForm(false);
        fetchProducts(); // Fetch the updated list of products
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Something went wrong!');
    }
  };

  const handleImageChange = (e, index) => {
    const updatedImages = [...newProduct.images];
    updatedImages[index] = e.target.value;
    setNewProduct({ ...newProduct, images: updatedImages });
  };

  const addImageField = () => {
    setNewProduct({ ...newProduct, images: [...newProduct.images, ''] });
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setShowAddForm(true); // Show the add form for editing
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/products/${editProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProduct),
      });

      if (response.ok) {
        alert('Product updated successfully');
        setEditProduct(null);
        fetchProducts();
        setShowAddForm(false);
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert('Something went wrong!');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const highlightText = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-red-500 text-white">{part}</span>
      ) : part
    );
  };

  const cards = [
    { name: "Add New Product", value: "Add a new product to your catalog", action: () => setShowAddForm(true) },
    { name: "Manage Products", value: "View and manage existing products", action: () => setShowManageProducts(true) },
    { name: "Edit, Delete, View Products", value: "Edit, delete, or view product details", action: () => setShowManageProducts(true) },
  ];

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

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.name}
              className="bg-[#374151] rounded-lg shadow-md p-6 cursor-pointer"
              onClick={card.action}
            >
              <h3 className="text-lg font-semibold text-[#9CA3AF]">{highlightText(card.name)}</h3>
              <p className="text-2xl font-bold text-[#F9FAFB] mt-2">{highlightText(card.value)}</p>
            </div>
          ))}
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-[#374151] mt-8 p-6 rounded-lg shadow-md text-white">
            <h3 className="text-xl font-semibold mb-4">{editProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={editProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={editProduct ? editProduct.name : newProduct.name}
                onChange={(e) => (editProduct ? setEditProduct({ ...editProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value }))}
                className="w-full p-3 rounded-md text-black"
                required
              />
              <textarea
                placeholder="Description"
                value={editProduct ? editProduct.description : newProduct.description}
                onChange={(e) => (editProduct ? setEditProduct({ ...editProduct, description: e.target.value }) : setNewProduct({ ...newProduct, description: e.target.value }))}
                className="w-full p-3 rounded-md text-black"
                required
              />
              <input
                type="text"
                placeholder="Product Category"
                value={editProduct ? editProduct.category : newProduct.category}
                onChange={(e) => (editProduct ? setEditProduct({ ...editProduct, category: e.target.value }) : setNewProduct({ ...newProduct, category: e.target.value }))}
                className="w-full p-3 rounded-md text-black"
                required
              />
              <input
                type="number"
                placeholder="Price (Rs)"
                value={editProduct ? editProduct.price : newProduct.price}
                onChange={(e) => (editProduct ? setEditProduct({ ...editProduct, price: e.target.value }) : setNewProduct({ ...newProduct, price: e.target.value }))}
                className="w-full p-3 rounded-md text-black"
                required
              />
              <input
                type="number"
                placeholder="Discount Price (Rs)"
                value={editProduct ? editProduct.discountPrice : newProduct.discountPrice}
                onChange={(e) => (editProduct ? setEditProduct({ ...editProduct, discountPrice: e.target.value }) : setNewProduct({ ...newProduct, discountPrice: e.target.value }))}
                className="w-full p-3 rounded-md text-black"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Rating (e.g., 4.6)"
                value={editProduct ? editProduct.rating : newProduct.rating}
                onChange={(e) => (editProduct ? setEditProduct({ ...editProduct, rating: e.target.value }) : setNewProduct({ ...newProduct, rating: e.target.value }))}
                className="w-full p-3 rounded-md text-black"
              />
              <input
                type="number"
                placeholder="Reviews Count"
                value={editProduct ? editProduct.reviews : newProduct.reviews}
                onChange={(e) => (editProduct ? setEditProduct({ ...editProduct, reviews: e.target.value }) : setNewProduct({ ...newProduct, reviews: e.target.value }))}
                className="w-full p-3 rounded-md text-black"
              />
              <input
                type="number"
                placeholder="Stock"
                value={editProduct ? editProduct.stock : newProduct.stock}
                onChange={(e) => (editProduct ? setEditProduct({ ...editProduct, stock: e.target.value }) : setNewProduct({ ...newProduct, stock: e.target.value }))}
                className="w-full p-3 rounded-md text-black"
              />
              {/* Images Section */}
              <div>
                <h4 className="mb-2">Product Images (Add at least 3)</h4>
                {(editProduct ? editProduct.images : newProduct.images).map((image, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Image URL ${index + 1}`}
                    value={image}
                    onChange={(e) => (editProduct ? setEditProduct({ ...editProduct, images: e.target.value }) : handleImageChange(e, index))}
                    className="w-full p-3 rounded-md text-black mb-2"
                    required
                  />
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
                onClick={() => setShowAddForm(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md ml-4"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Manage Products Section */}
        {showManageProducts && (
          <div className="mt-8 bg-[#374151] p-6 rounded-lg">
            <h3 className="text-2xl font-semibold text-[#F9FAFB]">Manage Products</h3>
            {/* Products in Card Format */}
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

            {/* Products in Table Format */}
            <table className="min-w-full mt-4">
              <thead>
                <tr>
                  <th className="text-left text-white p-3">Name</th>
                  <th className="text-left text-white p-3">Category</th>
                  <th className="text-left text-white p-3">Price</th>
                  <th className="text-left text-white p-3">Stock</th>
                  <th className="text-left text-white p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((product) => (
                    <tr key={product._id} className="text-white">
                      <td className="p-3">{highlightText(product.name)}</td>
                      <td className="p-3">{highlightText(product.category)}</td>
                      <td className="p-3">{highlightText(product.price)} Rs</td>
                      <td className="p-3">{highlightText(product.stock)}</td>
                      <td className="p-3">
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
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
