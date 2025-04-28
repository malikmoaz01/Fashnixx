import React, { useState, useEffect } from "react";

const DiscountManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [discounts, setDiscounts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountType: "percentage",
    value: "",
    startDate: "",
    endDate: "",
    minPurchase: "",
    maxUses: "",
    status: "active"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationMessage, setValidationMessage] = useState(null);

  const cards = [
    { name: "Create Discount", id: "create-discount", description: "Create new discount offers", action: () => setShowAddForm(true) },
    { name: "Manage Discounts", id: "manage-discounts", description: "View and manage active discounts", action: () => setShowAddForm(false) },
    { name: "Discount History", id: "discount-history", description: "Review past discount campaigns", action: () => fetchDiscountHistory() }
  ];

  // Fetch discounts from API on component mount
  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/discounts');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDiscounts(data);
    } catch (err) {
      setError("Failed to fetch discounts: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscountHistory = async () => {
    console.log("View history - Not implemented in backend yet");
    setShowAddForm(false);
  };

  const searchDiscounts = async () => {
    if (!searchTerm.trim()) {
      fetchDiscounts();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/discounts/search?query=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDiscounts(data);
    } catch (err) {
      setError("Failed to search discounts: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationMessage(null);
    
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `http://localhost:5000/api/discounts/${editId}` : 'http://localhost:5000/api/discounts';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      // Refresh discounts list
      fetchDiscounts();
      
      // Reset form
      setFormData({
        name: "",
        code: "",
        discountType: "percentage",
        value: "",
        startDate: "",
        endDate: "",
        minPurchase: "",
        maxUses: "",
        status: "active"
      });
      
      setValidationMessage(isEditing ? "Discount updated successfully!" : "Discount created successfully!");
      setShowAddForm(false);
      setIsEditing(false);
      setEditId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/discounts/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const discount = await response.json();
      
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };
      
      setFormData({
        name: discount.name,
        code: discount.code,
        discountType: discount.discountType,
        value: discount.value,
        startDate: formatDate(discount.startDate),
        endDate: formatDate(discount.endDate),
        minPurchase: discount.minPurchase,
        maxUses: discount.maxUses,
        status: discount.status
      });
      
      setIsEditing(true);
      setEditId(id);
      setShowAddForm(true);
    } catch (err) {
      setError("Failed to load discount data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:5000/api/discounts/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
        
        // Refresh discounts list
        fetchDiscounts();
        setValidationMessage("Discount deleted successfully!");
      } catch (err) {
        setError("Failed to delete discount: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/discounts/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      fetchDiscounts();
      setValidationMessage(`Discount ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      setError("Failed to update discount status: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateDiscount = async (code) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/discounts/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      alert(`Discount code is valid! ${data.discount.discountType === 'percentage' ? data.discount.value + '%' : '$' + data.discount.value}`);
    } catch (err) {
      alert("Invalid discount: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const highlightText = (text) => {
    if (!searchTerm || typeof text !== 'string') return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-red-500 text-white">{part}</span>
      ) : part
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-600 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-100 mb-6">Discount Management</h2>
        
        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search discounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && searchDiscounts()}
          />
          <button 
            onClick={searchDiscounts}
            className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Search
          </button>
          <button 
            onClick={() => {
              setSearchTerm('');
              fetchDiscounts();
            }}
            className="p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Clear
          </button>
        </div>

        {validationMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            <p>{validationMessage}</p>
          </div>
        )}

        {!showAddForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cards.map((card) => (
              <div 
                key={card.id} 
                className="rounded-lg shadow-md p-6 bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors"
                onClick={card.action}
              >
                <h3 className="text-lg font-semibold text-gray-300">
                  {highlightText(card.name)}
                </h3>
                <p className="text-xl font-bold text-gray-100 mt-2">
                  {highlightText(card.description)}
                </p>
              </div>
            ))}
          </div>
        )}

        {showAddForm ? (
          <div className="bg-gray-700 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-100 mb-4">
              {isEditing ? "Edit Discount" : "Create New Discount"}
            </h3>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 mb-1">Discount Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Discount Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Discount Type</label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-800 text-white rounded-md"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">
                    {formData.discountType === "percentage" ? "Percentage (%)" : "Amount"}
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-2 bg-gray-800 text-white rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Minimum Purchase Amount</label>
                  <input
                    type="number"
                    name="minPurchase"
                    value={formData.minPurchase}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-2 bg-gray-800 text-white rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Maximum Uses</label>
                  <input
                    type="number"
                    name="maxUses"
                    value={formData.maxUses}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-2 bg-gray-800 text-white rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-800 text-white rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setIsEditing(false);
                    setEditId(null);
                    setError(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? "Processing..." : isEditing ? "Update Discount" : "Create Discount"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-gray-100 mb-4">Active Discounts</h3>
            
            {loading ? (
              <p className="text-center text-gray-300">Loading discounts...</p>
            ) : error ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p>{error}</p>
              </div>
            ) : discounts.length === 0 ? (
              <p className="text-center text-gray-300">No discounts found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-gray-700 rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="p-3 text-left text-gray-300">Name</th>
                      <th className="p-3 text-left text-gray-300">Code</th>
                      <th className="p-3 text-left text-gray-300">Value</th>
                      <th className="p-3 text-left text-gray-300">Validity</th>
                      <th className="p-3 text-left text-gray-300">Usage</th>
                      <th className="p-3 text-left text-gray-300">Status</th>
                      <th className="p-3 text-left text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discounts.map((discount) => (
                      <tr key={discount._id} className="border-t border-gray-600">
                        <td className="p-3 text-gray-100">{highlightText(discount.name)}</td>
                        <td className="p-3 text-gray-100">{highlightText(discount.code)}</td>
                        <td className="p-3 text-gray-100">
                          {discount.discountType === "percentage" 
                            ? `${discount.value}%` 
                            : `$${discount.value}`}
                        </td>
                        <td className="p-3 text-gray-100">
                          {`${formatDate(discount.startDate)} to ${formatDate(discount.endDate)}`}
                        </td>
                        <td className="p-3 text-gray-100">
                          {discount.usageCount} / {discount.maxUses || "∞"}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            discount.status === "active" 
                              ? "bg-green-200 text-green-800" 
                              : "bg-red-200 text-red-800"
                          }`}>
                            {discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => validateDiscount(discount.code)}
                              className="px-2 py-1 bg-indigo-500 hover:bg-indigo-600 rounded text-xs text-white"
                            >
                              Test
                            </button>
                            <button
                              onClick={() => toggleStatus(discount._id, discount.status)}
                              className={`px-2 py-1 rounded text-xs text-white ${
                                discount.status === "active"
                                  ? "bg-yellow-500 hover:bg-yellow-600" 
                                  : "bg-green-500 hover:bg-green-600"
                              }`}
                            >
                              {discount.status === "active" ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => handleEdit(discount._id)}
                              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded text-xs text-white"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(discount._id)}
                              className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded text-xs text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DiscountManagement;