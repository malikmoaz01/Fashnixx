import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalSales: 0,
    productsInStock: 0,
    pendingOrders: 0,
    totalProducts: 0,
    outOfStockProducts: 0,
    complaints: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const validUsers = Array.isArray(data) ? data.filter(user => user && typeof user === 'object') : [];
      
      return {
        totalUsers: validUsers.length,
        activeUsers: validUsers.filter(user => !user.isBlocked).length,
        blockedUsers: validUsers.filter(user => user.isBlocked).length
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { totalUsers: 0, activeUsers: 0, blockedUsers: 0 };
    }
  }, []);

  // Fetch orders data
  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      const ordersList = data.orders || [];
      
      // Calculate order statistics
      const totalOrders = ordersList.length;
      const totalSales = ordersList.reduce((sum, order) => sum + (order.total || 0), 0);
      
      // Count orders by status
      const pendingOrders = ordersList.filter(order => order.status === 'pending').length;
      const processingOrders = ordersList.filter(order => order.status === 'processing').length;
      const shippedOrders = ordersList.filter(order => order.status === 'shipped').length;
      
      // Get recent orders (last 5)
      const recent = ordersList
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
        
      return {
        totalOrders,
        totalSales,
        pendingOrders,
        processingOrders,
        shippedOrders,
        recentOrders: recent
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { 
        totalOrders: 0, 
        totalSales: 0, 
        pendingOrders: 0, 
        processingOrders: 0,
        shippedOrders: 0,
        recentOrders: []
      };
    }
  }, []);

  // Fetch products data
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      const productsList = Array.isArray(data) ? data : [];
      
      // Calculate product statistics
      const totalProducts = productsList.length;
      const outOfStock = productsList.filter(product => product.countInStock === 0);
      const lowStock = productsList.filter(product => product.countInStock > 0 && product.countInStock <= 5);
      
      return {
        totalProducts,
        productsInStock: totalProducts - outOfStock.length,
        outOfStockProducts: outOfStock.length,
        lowStockProducts: lowStock.length,
        outOfStockItems: outOfStock.slice(0, 5) // Just get first 5 for display
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { 
        totalProducts: 0, 
        productsInStock: 0, 
        outOfStockProducts: 0,
        lowStockProducts: 0,
        outOfStockItems: []
      };
    }
  }, []);

  // Fetch complaints data
  const fetchComplaints = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/complaints");
      
      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }
      
      const data = await response.json();
      const complaintsList = Array.isArray(data) ? data : [];
      
      // Calculate complaint statistics
      const totalComplaints = complaintsList.length;
      const newComplaints = complaintsList.filter(complaint => complaint.status === 'new').length;
      const inProgressComplaints = complaintsList.filter(complaint => complaint.status === 'in-progress').length;
      
      // Get recent complaints (last 3)
      const recent = complaintsList
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
        
      return {
        totalComplaints,
        newComplaints,
        inProgressComplaints,
        recentComplaints: recent
      };
    } catch (error) {
      console.error("Error fetching complaints:", error);
      return { 
        totalComplaints: 0, 
        newComplaints: 0, 
        inProgressComplaints: 0,
        recentComplaints: []
      };
    }
  }, []);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Run all fetch operations in parallel
        const [usersData, ordersData, productsData, complaintsData] = await Promise.all([
          fetchUsers(),
          fetchOrders(),
          fetchProducts(),
          fetchComplaints()
        ]);
        
        // Update stats state with combined data
        setStats({
          totalUsers: usersData.totalUsers,
          totalOrders: ordersData.totalOrders,
          totalSales: ordersData.totalSales,
          productsInStock: productsData.productsInStock,
          pendingOrders: ordersData.pendingOrders,
          totalProducts: productsData.totalProducts,
          outOfStockProducts: productsData.outOfStockProducts,
          complaints: complaintsData.totalComplaints
        });
        
        // Set recent orders
        setRecentOrders(ordersData.recentOrders);
        
        // Set out of stock items
        setOutOfStockItems(productsData.outOfStockItems);
        
        // Set recent complaints
        setRecentComplaints(complaintsData.recentComplaints);
        
        // Create activity feed from various sources
        const activities = [];
        
        // Add recent orders to activity feed
        ordersData.recentOrders.forEach(order => {
          activities.push({
            id: `order-${order.orderId || order._id}`,
            type: 'order',
            message: `New order #${order.orderId || order._id} received`,
            time: new Date(order.createdAt).toLocaleString()
          });
        });
        
        // Add recent complaints to activity feed
        complaintsData.recentComplaints.forEach(complaint => {
          activities.push({
            id: `complaint-${complaint._id}`,
            type: 'complaint',
            message: `New complaint from ${complaint.customerName || 'a customer'}`,
            time: new Date(complaint.createdAt).toLocaleString()
          });
        });
        
        // Sort activities by time (newest first) and limit to 5
        const sortedActivities = activities
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 5);
          
        setRecentActivity(sortedActivities);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [fetchUsers, fetchOrders, fetchProducts, fetchComplaints]);

  // Dashboard cards
  const cards = [
    { name: "Total Users", value: stats.totalUsers, icon: "👥", color: "bg-blue-500" },
    { name: "Total Orders", value: stats.totalOrders, icon: "📦", color: "bg-green-500" },
    { name: "Total Sales", value: formatCurrency(stats.totalSales), icon: "💰", color: "bg-purple-500" },
    { name: "Products in Stock", value: stats.productsInStock, icon: "📊", color: "bg-yellow-500" },
    { name: "Pending Orders", value: stats.pendingOrders, icon: "⏳", color: "bg-orange-500" },
    { name: "Total Products", value: stats.totalProducts, icon: "🏷️", color: "bg-indigo-500" },
    { name: "Out of Stock", value: stats.outOfStockProducts, icon: "⚠️", color: "bg-red-500" },
    { name: "Complaints", value: stats.complaints, icon: "📝", color: "bg-pink-500" }
  ];

  // Filter cards based on search term
  const filteredCards = cards.filter(card => 
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(card.value).toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Get status badge class (reused from OrderManagement)
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
      case 'new':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Dashboard Overview</h2>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search dashboard..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 p-3 bg-[#374151] text-white rounded-md"
          />
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {filteredCards.map((card, index) => (
                <div key={index} className={`${card.color} rounded-lg shadow-md p-6 flex flex-col`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {highlightText(card.name)}
                    </h3>
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {typeof card.value === 'string' ? highlightText(card.value) : card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* No Results Message */}
            {searchTerm && filteredCards.length === 0 && (
              <div className="bg-[#374151] rounded-lg p-6 text-center mb-8">
                <p className="text-[#F9FAFB]">No results found for "{searchTerm}"</p>
              </div>
            )}

            {/* Second Row: Recent Activity and Out of Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Activity */}
              <div className="bg-[#374151] rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-[#F9FAFB] mb-4">Recent Activity</h3>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-1">
                        <p className="text-[#F9FAFB]">{activity.message}</p>
                        <p className="text-sm text-[#9CA3AF]">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#9CA3AF] text-center py-4">No recent activities to show.</p>
                )}
              </div>

              {/* Out of Stock Products */}
              <div className="bg-[#374151] rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-[#F9FAFB] mb-4">Out of Stock Products</h3>
                {outOfStockItems.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#4B5563] text-[#9CA3AF]">
                          <th className="text-left py-2 px-2">Product</th>
                          <th className="text-left py-2 px-2">SKU</th>
                          <th className="text-left py-2 px-2">Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {outOfStockItems.map((item) => (
                          <tr key={item._id || item.id} className="border-b border-[#4B5563] hover:bg-[#4B5563]">
                            <td className="py-2 px-2 text-[#F9FAFB]">{item.name}</td>
                            <td className="py-2 px-2 text-[#F9FAFB]">{item.sku}</td>
                            <td className="py-2 px-2 text-[#F9FAFB]">{item.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[#9CA3AF] text-center py-4">No out of stock products.</p>
                )}
              </div>
            </div>

            {/* Third Row: Recent Orders and Complaints */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-[#374151] rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#F9FAFB]">Recent Orders</h3>
                  <Link to="/admin/order_management" className="text-blue-400 hover:text-blue-300 text-sm">View All</Link>
                </div>
                {recentOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#4B5563] text-[#9CA3AF]">
                          <th className="text-left py-2 px-2">ID</th>
                          <th className="text-left py-2 px-2">Customer</th>
                          <th className="text-right py-2 px-2">Amount</th>
                          <th className="text-left py-2 px-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.orderId || order._id} className="border-b border-[#4B5563] hover:bg-[#4B5563]">
                            <td className="py-2 px-2 text-[#F9FAFB]">#{order.orderId?.substring(0, 8) || order._id?.substring(0, 8)}</td>
                            <td className="py-2 px-2 text-[#F9FAFB]">
                              {order.customer?.firstName} {order.customer?.lastName}
                            </td>
                            <td className="py-2 px-2 text-right text-green-400 font-medium">{formatCurrency(order.total)}</td>
                            <td className="py-2 px-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[#9CA3AF] text-center py-4">No recent orders to show.</p>
                )}
              </div>

              {/* Recent Complaints */}
              <div className="bg-[#374151] rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#F9FAFB]">Recent Complaints</h3>
                  <Link to="/admin/admin_complain" className="text-blue-400 hover:text-blue-300 text-sm">View All</Link>
                </div>
                {recentComplaints.length > 0 ? (
                  <div className="space-y-4">
                    {recentComplaints.map((complaint) => (
                      <div key={complaint._id} className="bg-[#1F2937] rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <p className="text-[#F9FAFB] font-medium">{complaint.customerName || 'Anonymous'}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(complaint.status)}`}>
                            {complaint.status}
                          </span>
                        </div>
                        <p className="text-[#9CA3AF] text-sm mb-2 line-clamp-2">{complaint.message}</p>
                        <p className="text-xs text-[#9CA3AF]">{new Date(complaint.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#9CA3AF] text-center py-4">No recent complaints to show.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;