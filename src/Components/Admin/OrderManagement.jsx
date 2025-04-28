import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const ordersPerPage = 10;

  // Dashboard stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      // Using the new API endpoint format that matches our backend
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // Add authentication token
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      
      // Handle the new response format from our backend
      const ordersList = data.orders || [];
      setOrders(ordersList);
      
      // Calculate stats manually if they're not provided by the API
      if (!data.stats || !data.stats.counts) {
        // Count orders by status manually
        const statusCounts = {
          total: ordersList.length,
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0
        };
        
        // Count orders by status
        ordersList.forEach(order => {
          if (order.status && statusCounts.hasOwnProperty(order.status)) {
            statusCounts[order.status]++;
          }
        });
        
        setStats(statusCounts);
      } else {
        setStats({
          total: data.stats.counts.total || 0,
          pending: data.stats.counts.pending || 0,
          processing: data.stats.counts.processing || 0,
          shipped: data.stats.counts.shipped || 0,
          delivered: data.stats.counts.delivered || 0,
          cancelled: data.stats.counts.cancelled || 0,
        });
      }
      
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
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.orderId?.toLowerCase().includes(term) || 
        order.customer?.email?.toLowerCase().includes(term) ||
        `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.toLowerCase().includes(term) ||
        order.customer?.phone?.toLowerCase().includes(term)
      );
    }
    
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter]);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Update order status - Fixed to match the API endpoint format
  const handleUpdateStatus = async () => {
    if (!orderToUpdate || !newStatus) return;
    
    try {
      setUpdating(true);
      // Updated endpoint to match our backend
      const response = await fetch(`http://localhost:5000/api/orders/${orderToUpdate}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // Add authentication token
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      const updatedOrder = await response.json();
      
      // Update local state
      setOrders(orders.map(order => 
        order.orderId === orderToUpdate 
          ? updatedOrder 
          : order
      ));
      
      // Reset form
      setOrderToUpdate(null);
      setNewStatus('');
      setUpdating(false);
      
      // Refresh orders to ensure we have the latest data
      fetchOrders();
    } catch (err) {
      setError(err.message);
      setUpdating(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);
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

  // Get status badge class
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
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Order Management</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
          <div className="rounded-lg shadow-md p-4 bg-[#374151]">
            <h3 className="text-sm font-semibold text-[#9CA3AF]">Cancelled</h3>
            <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
          </div>
        </div>
        <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by order ID, customer name, email or phone..."
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
              <option value="cancelled">Cancelled</option>
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

        {/* Update Order Status Modal */}
        {orderToUpdate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1F2937] rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Update Order Status</h3>
              <p className="text-gray-300 mb-4">Order ID: {orderToUpdate}</p>
              
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-3 bg-[#374151] text-white rounded-md mb-4"
              >
                <option value="">Select new status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => {
                    setOrderToUpdate(null);
                    setNewStatus('');
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={!newStatus || updating}
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-[#1F2937] rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="bg-[#111827] text-[#9CA3AF]">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment</th>
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
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-[#F9FAFB] font-medium">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#F9FAFB]">
                        {order.payment?.method === "cod" ? "Cash on Delivery" : "Card"}
                      </td>
                      <td className="px-6 py-4 text-right text-sm space-x-2 whitespace-nowrap">
                        <Link
                          to={`/orders/${order.orderId}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => setOrderToUpdate(order.orderId)}
                          className="text-green-400 hover:text-green-300"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-[#F9FAFB]">
                      {searchTerm || statusFilter !== 'all' 
                        ? "No orders found matching your filters." 
                        : "No orders available."}
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
              Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-[#374151] text-white rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number + 1}
                  onClick={() => setCurrentPage(number + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === number + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#374151] text-white'
                  }`}
                >
                  {number + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
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

export default OrderManagement;