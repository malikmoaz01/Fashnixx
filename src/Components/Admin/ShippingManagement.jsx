import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const ShippingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [orderToTrack, setOrderToTrack] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);
  const ordersPerPage = 10;

  // Dashboard stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0
  });

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      
      // Handle the response format
      const ordersList = data.orders || [];
      setOrders(ordersList);
      
      // Calculate shipping stats manually
      const shippingStats = {
        total: ordersList.length,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0
      };
      
      // Count orders by shipping status
      ordersList.forEach(order => {
        if (order.status && shippingStats.hasOwnProperty(order.status)) {
          shippingStats[order.status]++;
        }
      });
      
      setStats(shippingStats);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter orders based on search term and status
  useEffect(() => {
    let result = orders;
    
    // Filter by shipping status
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Filter by search term (orderId, customer name, email, tracking number)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.orderId?.toLowerCase().includes(term) || 
        order.customer?.email?.toLowerCase().includes(term) ||
        `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.toLowerCase().includes(term) ||
        order.delivery?.trackingNumber?.toLowerCase().includes(term)
      );
    }
    
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter]);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Update tracking number
  const handleUpdateTracking = async () => {
    if (!orderToTrack) return;
    
    try {
      setUpdating(true);
      const response = await fetch(`http://localhost:5000/api/orders/${orderToTrack}/tracking`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ 
          trackingNumber,
          status: 'shipped' // Update status to shipped when adding tracking
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update tracking information');
      }
      
      const updatedOrder = await response.json();
      
      // Update local state
      setOrders(orders.map(order => 
        order.orderId === orderToTrack 
          ? updatedOrder 
          : order
      ));
      
      // Reset form
      setOrderToTrack(null);
      setTrackingNumber('');
      setUpdating(false);
      
      // Refresh orders
      fetchOrders();
    } catch (err) {
      setError(err.message);
      setUpdating(false);
    }
  };

  // Highlight search term in text
  const highlightText = (text) => {
    if (!searchTerm || typeof text !== 'string') return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi'); 
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-red-500 text-white">{part}</span>
      ) : part
    );
  };

  // Get shipping status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Shipping Management</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="rounded-lg shadow-md p-4 bg-[#374151]">
            <h3 className="text-sm font-semibold text-[#9CA3AF]">Total Orders</h3>
            <p className="text-2xl font-bold text-[#F9FAFB]">{stats.total}</p>
          </div>
          <div className="rounded-lg shadow-md p-4 bg-[#374151]">
            <h3 className="text-sm font-semibold text-[#9CA3AF]">Pending</h3>
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
          </div>
          <div className="rounded-lg shadow-md p-4 bg-[#374151]">
            <h3 className="text-sm font-semibold text-[#9CA3AF]">Processing</h3>
            <p className="text-2xl font-bold text-blue-400">{stats.processing}</p>
          </div>
          <div className="rounded-lg shadow-md p-4 bg-[#374151]">
            <h3 className="text-sm font-semibold text-[#9CA3AF]">Shipped</h3>
            <p className="text-2xl font-bold text-purple-400">{stats.shipped}</p>
          </div>
          <div className="rounded-lg shadow-md p-4 bg-[#374151]">
            <h3 className="text-sm font-semibold text-[#9CA3AF]">Delivered</h3>
            <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by order ID, customer name, email or tracking number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 bg-[#374151] text-white rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-3 bg-[#374151] text-white rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="p-3 bg-[#374151] text-white rounded-md hover:bg-[#4B5563]"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="ml-2 text-red-700 hover:text-red-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Update Tracking Modal */}
        {orderToTrack && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1F2937] rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Update Tracking Information</h3>
              <p className="text-gray-300 mb-4">Order ID: {orderToTrack}</p>
              
              <input
                type="text"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full p-3 bg-[#374151] text-white rounded-md mb-4"
              />
              
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => {
                    setOrderToTrack(null);
                    setTrackingNumber('');
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateTracking}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={!trackingNumber || updating}
                >
                  {updating ? 'Updating...' : 'Update Tracking'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shipments Table */}
        <div className="bg-[#1F2937] rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="bg-[#111827] text-[#9CA3AF]">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Shipping Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tracking Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#374151]">
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-[#374151]">
                      <td className="px-6 py-4">
                        <span className="text-[#F9FAFB] font-medium">
                          {highlightText(order.orderId)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[#F9FAFB]">
                          {highlightText(`${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`)}
                        </div>
                        <div className="text-[#9CA3AF] text-sm">
                          {highlightText(order.customer?.email || '')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#F9FAFB]">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-[#F9FAFB]">
                        {order.delivery?.method === "standard" ? "Standard Delivery" : 
                          order.delivery?.method === "express" ? "Express Delivery" : 
                          "Not specified"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#F9FAFB]">
                        {order.delivery?.trackingNumber ? 
                          highlightText(order.delivery.trackingNumber) : 
                          <span className="text-gray-500">Not assigned</span>}
                      </td>
                      <td className="px-6 py-4 text-right text-sm space-x-2 whitespace-nowrap">
                        <Link
                          to={`/orders/${order.orderId}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View
                        </Link>
                        {(order.status === 'processing' || !order.delivery?.trackingNumber) && (
                          <button
                            onClick={() => setOrderToTrack(order.orderId)}
                            className="text-green-400 hover:text-green-300"
                          >
                            Add Tracking
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => {
                              // Mark as delivered functionality could go here
                              console.log("Mark as delivered", order.orderId);
                            }}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-[#F9FAFB]">
                      {searchTerm || statusFilter !== 'all' 
                        ? "No shipments found matching your filters." 
                        : "No shipments available."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex justify-between items-center">
            <div className="text-[#9CA3AF]">
              Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} shipments
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-[#374151] text-white rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              {/* Show only 5 page buttons at a time */}
              {[...Array(Math.min(5, totalPages)).keys()].map(number => {
                // Calculate the actual page number to display
                const pageToShow = currentPage > 3 ? 
                  // If we're past page 3, show a window of pages centered on current page
                  number + Math.max(currentPage - 2, 1) : 
                  // Otherwise just show the first 5 pages
                  number + 1;
                
                // Only show the button if it's a valid page
                if (pageToShow <= totalPages) {
                  return (
                    <button
                      key={pageToShow}
                      onClick={() => setCurrentPage(pageToShow)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageToShow
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#374151] text-white'
                      }`}
                    >
                      {pageToShow}
                    </button>
                  );
                }
                return null;
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 bg-[#374151] text-white rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingManagement;