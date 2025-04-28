import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MinePic from "../../assets/TeamLeader.jpg";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Function to retrieve the user data from local storage
    const getUserAuth = () => {
        const userString = localStorage.getItem('user');
        if (!userString) {
            return null;
        }
        try {
            return JSON.parse(userString);
        } catch (e) {
            console.error("Error parsing user data from localStorage", e);
            return null;
        }
    };

    // Format date for better readability
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get status badge color - Updated with blue-pink theme
    const getStatusBadgeColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-pink-100 text-pink-800 border border-pink-300';
            case 'processing':
                return 'bg-blue-100 text-blue-800 border border-blue-300';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 border border-purple-300';
            case 'delivered':
                return 'bg-green-100 text-green-800 border border-green-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-300';
        }
    };

    useEffect(() => {
        const fetchUserOrders = async () => {
            setLoading(true);
            setError(null);

            const userData = getUserAuth();
            if (!userData) {
                setError("You are not logged in. Please log in to view your orders.");
                setLoading(false);
                return;
            }
            
            try {
                const response = await axios.get(`http://localhost:5000/api/orders/user/email/${userData.email}`, {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                });
                
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user orders:", error);
                setError("Failed to load orders. Please try again later.");
                setLoading(false);
            }
        };
        
        fetchUserOrders();
    }, []);

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };

    const userData = getUserAuth() || {};
    const userName = userData.firstName ? `${userData.firstName} ${userData.lastName || ''}` : 'Welcome';

    if (loading && orders.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-pink-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-t-blue-500 border-r-pink-500 border-b-blue-500 border-l-pink-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg font-medium text-blue-800">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row relative bg-gradient-to-r from-blue-50 to-pink-50">
            {/* Sidebar Overlay (Click anywhere to close) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Toggle Button for Mobile */}
            <button
                className="md:hidden bg-gradient-to-r from-blue-600 to-pink-500 text-white py-2 px-4 m-2 rounded-full shadow-lg z-50 fixed top-2 left-2"
                onClick={() => setSidebarOpen(true)}
            >
                ☰ Menu
            </button>

            {/* Sidebar */}
            <aside
                className={`bg-white w-64 md:w-1/4 p-4 shadow-lg fixed md:relative h-full z-50 transform transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 bg-white bg-opacity-90 backdrop-blur-sm`}
            >
                <div className="flex items-center space-x-4 border-b border-pink-200 pb-4 mb-6">
                    <div className="relative">
                        <img 
                            src={getUserAuth()?.profileImage || MinePic} 
                            alt="User Avatar" 
                            className="w-16 h-16 rounded-full object-cover border-4 border-pink-300"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-pink-600 bg-clip-text text-transparent">
                            {userName}
                        </h2>
                        <p className="text-gray-500 text-sm">{userData.email}</p>
                    </div>
                </div>
                <nav>
                    <ul className="space-y-3">
                        <li>
                            <Link to="/account" className="flex items-center py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-100 hover:to-pink-100 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span>Manage Account</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/order-history" className="flex items-center py-3 px-4 rounded-lg bg-gradient-to-r from-blue-100 to-pink-100 border border-pink-200 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">My Order History</span>
                            </Link>
                        </li>

                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 transition-all duration-300">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center md:text-left bg-gradient-to-r from-blue-700 to-pink-600 bg-clip-text text-transparent">
                        My Order History
                    </h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}

                    {orders.length === 0 && !loading ? (
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center border border-pink-200">
                            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold mb-2 text-blue-800">No Orders Found</h2>
                            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                            <Link to="/shop" className="bg-gradient-to-r from-blue-600 to-pink-500 text-white py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 inline-flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {/* Order Cards */}
                            {orders.map((order) => (
                                <div key={order.orderId} className="bg-white p-5 rounded-lg shadow-md border border-pink-200 hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                                    <div className="flex flex-col md:flex-row justify-between">
                                        <div>
                                            <div className="flex items-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                                <h2 className="text-lg font-bold text-blue-800">Order #{order.orderId}</h2>
                                            </div>
                                            <p className="text-gray-600 mb-1 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDate(order.createdAt)}
                                            </p>
                                            <p className="text-gray-600 mb-3 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-medium text-blue-800">Rs {order.total.toFixed(2)}</span>
                                            </p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex items-center">
                                            <button 
                                                className="py-2 px-6 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-300 flex items-center"
                                                onClick={() => viewOrderDetails(order)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Order Details Modal */}
                    {selectedOrder && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-pink-200">
                                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-pink-500 text-white p-4 rounded-t-xl flex justify-between items-center">
                                    <h2 className="text-xl font-bold">Order Details #{selectedOrder.orderId}</h2>
                                    <button 
                                        onClick={closeOrderDetails}
                                        className="text-white hover:text-pink-200 bg-white bg-opacity-20 rounded-full p-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="p-6">
                                    <div className="grid md:grid-cols-2 gap-6 mt-2">
                                        {/* Order Info */}
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h3 className="font-bold text-lg mb-3 text-blue-800 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Order Information
                                            </h3>
                                            <p className="mb-2 flex items-center">
                                                <span className="font-medium w-32">Date:</span> {formatDate(selectedOrder.createdAt)}
                                            </p>
                                            <p className="mb-2 flex items-center">
                                                <span className="font-medium w-32">Status:</span> 
                                                <span className={`ml-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(selectedOrder.status)}`}>
                                                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                                </span>
                                            </p>
                                            {selectedOrder.delivery?.trackingNumber && (
                                                <p className="mb-2 flex items-center">
                                                    <span className="font-medium w-32">Tracking #:</span> {selectedOrder.delivery.trackingNumber}
                                                </p>
                                            )}
                                            {selectedOrder.delivery?.estimatedDelivery && (
                                                <p className="mb-2 flex items-center">
                                                    <span className="font-medium w-32">Est. Delivery:</span> {formatDate(selectedOrder.delivery.estimatedDelivery)}
                                                </p>
                                            )}
                                            {selectedOrder.delivery?.carrier && (
                                                <p className="mb-2 flex items-center">
                                                    <span className="font-medium w-32">Carrier:</span> {selectedOrder.delivery.carrier}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Shipping Address */}
                                        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                                            <h3 className="font-bold text-lg mb-3 text-pink-800 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Shipping Address
                                            </h3>
                                            <p className="mb-2 font-medium">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                                            <p className="mb-1">{selectedOrder.customer.address?.line1}</p>
                                            {selectedOrder.customer.address?.line2 && (
                                                <p className="mb-1">{selectedOrder.customer.address.line2}</p>
                                            )}
                                            <p className="mb-1">
                                                {selectedOrder.customer.address?.city}, {selectedOrder.customer.address?.state} {selectedOrder.customer.address?.postalCode}
                                            </p>
                                            <p className="mb-1">{selectedOrder.customer.address?.country}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Order Items */}
                                    <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                                        <h3 className="font-bold text-lg mb-4 text-blue-800 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            Order Items
                                        </h3>
                                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                                            <table className="min-w-full bg-white">
                                                <thead>
                                                    <tr className="bg-gradient-to-r from-blue-100 to-pink-100">
                                                        <th className="py-3 px-4 text-left text-blue-800">Item</th>
                                                        <th className="py-3 px-4 text-right text-blue-800">Quantity</th>
                                                        <th className="py-3 px-4 text-right text-blue-800">Price</th>
                                                        <th className="py-3 px-4 text-right text-blue-800">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedOrder.items.map((item, index) => (
                                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                            <td className="py-3 px-4">
                                                                <div className="flex items-center">
                                                                    {item.image && (
                                                                        <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 border border-pink-200">
                                                                            <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <p className="font-medium text-blue-800">{item.productName}</p>
                                                                        {item.size && <p className="text-sm text-pink-600">Size: {item.size}</p>}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-4 text-right">{item.quantity}</td>
                                                            <td className="py-3 px-4 text-right">Rs {item.price.toFixed(2)}</td>
                                                            <td className="py-3 px-4 text-right font-medium">Rs {(item.price * item.quantity).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="border-t border-gray-200">
                                                        <td colSpan="3" className="py-3 px-4 text-right font-medium">Subtotal:</td>
                                                        <td className="py-3 px-4 text-right">Rs {selectedOrder.subtotal?.toFixed(2) || (selectedOrder.total - (selectedOrder.deliveryCost || 0)).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="3" className="py-3 px-4 text-right font-medium">Shipping:</td>
                                                        <td className="py-3 px-4 text-right">Rs {selectedOrder.deliveryCost?.toFixed(2) || "0.00"}</td>
                                                    </tr>
                                                    <tr className="border-t border-gray-200 bg-gradient-to-r from-blue-50 to-pink-50">
                                                        <td colSpan="3" className="py-3 px-4 text-right font-bold text-blue-800">Total:</td>
                                                        <td className="py-3 px-4 text-right font-bold text-blue-800">Rs {selectedOrder.total.toFixed(2)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                    
                                    {/* Payment Information */}
                                    <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <h3 className="font-bold text-lg mb-3 text-blue-800 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            Payment Information
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <p className="flex items-center">
                                                <span className="font-medium w-32">Payment Method:</span> 
                                                <span className="px-3 py-1 bg-white rounded-full text-blue-800 border border-blue-300">
                                                    {selectedOrder.payment?.method === 'cod' 
                                                        ? 'Cash on Delivery' 
                                                        : 'Credit Card'}
                                                </span>
                                            </p>
                                            <p className="flex items-center">
                                                <span className="font-medium w-32">Payment Status:</span> 
                                                <span className="px-3 py-1 bg-white rounded-full text-pink-800 border border-pink-300">
                                                    {selectedOrder.payment?.status.charAt(0).toUpperCase() + 
                                                    selectedOrder.payment?.status.slice(1)}
                                                    </span>
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Status History */}
                                    {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                                        <div className="mt-6 bg-pink-50 p-4 rounded-lg border border-pink-200">
                                            <h3 className="font-bold text-lg mb-3 text-pink-800 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Order Status History
                                            </h3>
                                            <ul className="space-y-3">
                                                {selectedOrder.statusHistory.map((history, index) => (
                                                    <li key={index} className="flex items-start bg-white p-2 rounded-lg border border-pink-100">
                                                        <div className={`mr-3 mt-1 w-3 h-3 rounded-full ${getStatusBadgeColor(history.status)}`}></div>
                                                        <div>
                                                            <p className="font-medium text-blue-800">{history.status.charAt(0).toUpperCase() + history.status.slice(1)}</p>
                                                            <p className="text-sm text-gray-600">{formatDate(history.timestamp)} {new Date(history.timestamp).toLocaleTimeString()}</p>
                                                            {history.comment && <p className="text-sm text-gray-700">{history.comment}</p>}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    {/* Action Buttons */}
                                    <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={closeOrderDetails}
                                            className="bg-gray-200 text-gray-800 py-2 px-6 rounded-full hover:bg-gray-300 mr-2 transition-all duration-300"
                                        >
                                            Close
                                        </button>
                                        {selectedOrder.status === "delivered" && (
                                            <button className="bg-gradient-to-r from-blue-600 to-pink-500 text-white py-2 px-6 rounded-full hover:shadow-lg transition-all duration-300 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Write Review
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OrderHistory;