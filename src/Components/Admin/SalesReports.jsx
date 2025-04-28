import React, { useState, useEffect, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const SimpleSalesAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30'); // Default 30 days
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [salesData, setSalesData] = useState([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0
  });
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [productsList, setProductsList] = useState({}); // Store products by ID
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch products data first to have names
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      // Create a lookup object with product ID as key
      const productsById = {};
      data.forEach(product => {
        productsById[product._id] = product;
      });
      
      setProductsList(productsById);
      return productsById;
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load product data");
      return {};
    }
  }, []);

  // Fetch orders data
  const fetchOrdersData = useCallback(async () => {
    try {
      setLoading(true);
      
      // First fetch products to have their names
      const productsData = await fetchProducts();
      
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      const orders = data.orders || [];
      
      // Process orders data with products information
      processOrdersData(orders, productsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [timeRange, fetchProducts]);

  // Process orders data to generate analytics
  const processOrdersData = (orders, productsData) => {
    if (!orders || !orders.length) {
      setError("No order data available");
      return;
    }
    
    // Filter orders by time range
    const now = new Date();
    const rangeStart = new Date();
    rangeStart.setDate(now.getDate() - parseInt(timeRange));
    
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= rangeStart;
    });

    // Daily sales data
    const salesByDay = {};
    // Category sales data
    const categorySales = {};
    // Product sales tracking
    const productSales = {};
    
    // Process each order
    filteredOrders.forEach(order => {
      // Format date as YYYY-MM-DD
      const orderDate = new Date(order.createdAt);
      const dateKey = orderDate.toISOString().split('T')[0];
      
      // Aggregate daily sales
      if (!salesByDay[dateKey]) {
        salesByDay[dateKey] = {
          date: dateKey,
          sales: 0,
          orders: 0
        };
      }
      salesByDay[dateKey].sales += order.total || 0;
      salesByDay[dateKey].orders += 1;
      
      // Process items in order
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          // Get product details from our products list
          const productDetails = productsData[item.productId] || {};
          
          // Track product sales with proper name
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              id: item.productId,
              name: productDetails.name || item.name || 'Unknown Product',
              sales: 0,
              quantity: 0
            };
          }
          productSales[item.productId].sales += (item.price * item.quantity) || 0;
          productSales[item.productId].quantity += item.quantity || 0;
          
          // Track category sales using product details if available
          const category = productDetails.category || item.category || 'Uncategorized';
          if (!categorySales[category]) {
            categorySales[category] = {
              name: category,
              sales: 0,
              quantity: 0
            };
          }
          categorySales[category].sales += (item.price * item.quantity) || 0;
          categorySales[category].quantity += item.quantity || 0;
        });
      }
    });
    
    // Convert daily sales object to array and sort by date
    const salesArray = Object.values(salesByDay).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    // Get top selling products
    const topProductsArray = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
    
    // Get top categories
    const topCategoriesArray = Object.values(categorySales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
    
    // Calculate order statistics
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Update state with processed data
    setSalesData(salesArray);
    setTopProducts(topProductsArray);
    setTopCategories(topCategoriesArray);
    setOrderStats({
      totalOrders,
      totalRevenue,
      avgOrderValue
    });
  };
  
  useEffect(() => {
    fetchOrdersData();
  }, [fetchOrdersData, timeRange]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Sales Report</h2>
      
      {/* Time Range Selector */}
      <div className="mb-6">
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:text-white"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
        </select>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{orderStats.totalOrders}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{formatCurrency(orderStats.totalRevenue)}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200">Avg. Order Value</h3>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{formatCurrency(orderStats.avgOrderValue)}</p>
        </div>
      </div>
      
      {/* Sales Trend Chart */}
      <div className="mb-8 bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sales Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#0088FE" strokeWidth={2} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Top Products and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top Selling Products</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-300">Product</th>
                <th className="text-right py-2 px-2 text-gray-600 dark:text-gray-300">Units</th>
                <th className="text-right py-2 px-2 text-gray-600 dark:text-gray-300">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-2 px-2 font-medium">{product.name}</td>
                  <td className="py-2 px-2 text-right">{product.quantity}</td>
                  <td className="py-2 px-2 text-right text-green-600 dark:text-green-400 font-medium">{formatCurrency(product.sales)}</td>
                </tr>
              ))}
              {topProducts.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500">No product data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Category Sales */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sales by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="sales"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleSalesAnalytics;