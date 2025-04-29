import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MinePic from "../../assets/TeamLeader.jpg";

const TrackOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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

    const getDeliveryMessage = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'Your order will be delivered within 7 working days';
            case 'processing':
                return 'Your order is being processed and will delivered within 4-5 days';
            case 'shipped':
                return 'Your order is on its way and will be delivered in 2-3 days';
            case 'delivered':
                return 'Your order has been delivered';
            case 'cancelled':
                return 'Your order has been cancelled';
            default:
                return 'Status update not available';
        }
    };

    useEffect(() => {
        const fetchUserOrders = async () => {
            setLoading(true);
            setError(null);

            const userData = getUserAuth();
            if (!userData) {
                setError("You are not logged in. Please log in to track your orders.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`https://fashnix-backend.onrender.com/api/orders/user/email/${userData.email}`, {
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

    const trackOrder = (order) => {
        setSelectedOrder(order);
    };

    const closeTrackingDetails = () => {
        setSelectedOrder(null);
        setShowCancelConfirm(false);
    };

    const handleCancelOrder = async () => {
        if (!selectedOrder) return;

        const userData = getUserAuth();

        try {
            await axios.put(
                `https://fashnix-backend.onrender.com/api/orders/${selectedOrder.orderId}`,
                { status: 'cancelled' },
                {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                }
            );

            // Update the order in local state
            const updatedOrders = orders.map(order =>
                order.orderId === selectedOrder.orderId
                    ? { ...order, status: 'cancelled' }
                    : order
            );

            setOrders(updatedOrders);
            setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
            setShowCancelConfirm(false);

            // Refresh the page
            window.location.reload();
        } catch (error) {
            console.error("Error cancelling order:", error);
        }
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
                className={`bg-white w-64 md:w-1/4 p-4 shadow-lg fixed md:relative h-full z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
                            <Link to="/order-history" className="flex items-center py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-100 hover:to-pink-100 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                                <span>My Order History</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/trackorder" className="flex items-center py-3 px-4 rounded-lg bg-gradient-to-r from-blue-100 to-pink-100 border border-pink-200 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Track Order</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 transition-all duration-300">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center md:text-left bg-gradient-to-r from-blue-700 to-pink-600 bg-clip-text text-transparent">
                        Track Your Order
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
                            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to track your orders here!</p>
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
                                <div key={order.orderId} className="bg-white p-5 rounded-lg shadow-md border border-pink-200 hover:shadow-lg transition duration-300">
                                    <div className="flex flex-col md:flex-row justify-between">
                                        <div className="mb-4 md:mb-0">
                                            <div className="flex items-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                                <h2 className="text-lg font-bold text-blue-800">Order #{order.orderId}</h2>
                                            </div>
                                            <p className="text-gray-600 mb-2 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Ordered on: {formatDate(order.createdAt)}
                                            </p>
                                            <p className="mb-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </p>
                                            <p className="text-gray-700">{getDeliveryMessage(order.status)}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                className="py-2 px-6 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-300 flex items-center"
                                                onClick={() => trackOrder(order)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                                Track Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tracking Details Modal */}
                    {selectedOrder && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-pink-200">
                                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-pink-500 text-white p-4 rounded-t-xl flex justify-between items-center">
                                    <h2 className="text-xl font-bold">Track Order #{selectedOrder.orderId}</h2>
                                    <button
                                        onClick={closeTrackingDetails}
                                        className="text-white hover:text-pink-200 bg-white bg-opacity-20 rounded-full p-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="p-6">
                                    {/* Order Status */}
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                                        <h3 className="font-bold text-lg mb-3 text-blue-800 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            Order Status
                                        </h3>
                                        <div className="flex items-center mb-2">
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(selectedOrder.status)}`}>
                                                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 mt-2">{getDeliveryMessage(selectedOrder.status)}</p>
                                    </div>

                                    {/* Tracking Timeline */}
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                                        <h3 className="font-bold text-lg mb-4 text-blue-800 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            Tracking Timeline
                                        </h3>

                                        <div className="relative">
                                            {/* Timeline line */}
                                            <div className="absolute left-3 top-0 bottom-0 w-1 bg-gray-200"></div>

                                            {/* Timeline steps */}
                                            <div className="space-y-8 relative">
                                                {/* Order Placed */}
                                                <div className="flex items-start">
                                                    <div className={`z-10 flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 border-2 border-white mr-4`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-medium text-blue-800">Order Placed</h4>
                                                        <p className="text-sm text-gray-600">{formatDate(selectedOrder.createdAt)}</p>
                                                        <p className="text-gray-700 mt-1">Your order has been received and is being processed.</p>
                                                    </div>
                                                </div>

                                                {/* Processing */}
                                                <div className="flex items-start">
                                                    <div className={`z-10 flex items-center justify-center w-7 h-7 rounded-full 
                                                        ${['processing', 'shipped', 'delivered'].includes(selectedOrder.status.toLowerCase())
                                                            ? 'bg-blue-500'
                                                            : 'bg-gray-300'} 
                                                        border-2 border-white mr-4`}>
                                                        {['processing', 'shipped', 'delivered'].includes(selectedOrder.status.toLowerCase()) ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : (
                                                            <span className="text-white text-xs">2</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-lg font-medium ${['processing', 'shipped', 'delivered'].includes(selectedOrder.status.toLowerCase()) ? 'text-blue-800' : 'text-gray-500'}`}>Processing</h4>
                                                        <p className="text-sm text-gray-600">{selectedOrder.status === 'processing' ? 'In Progress' : ((['shipped', 'delivered'].includes(selectedOrder.status.toLowerCase())) ? 'Completed' : 'Pending')}</p>
                                                        <p className={`mt-1 ${['processing', 'shipped', 'delivered'].includes(selectedOrder.status.toLowerCase()) ? 'text-gray-700' : 'text-gray-400'}`}>
                                                            Your order is being processed and will delivered within 4-5 days
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Shipped */}
                                                <div className="flex items-start">
                                                    <div className={`z-10 flex items-center justify-center w-7 h-7 rounded-full 
                                                        ${['shipped', 'delivered'].includes(selectedOrder.status.toLowerCase())
                                                            ? 'bg-blue-500'
                                                            : 'bg-gray-300'} 
                                                        border-2 border-white mr-4`}>
                                                        {['shipped', 'delivered'].includes(selectedOrder.status.toLowerCase()) ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : (
                                                            <span className="text-white text-xs">3</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-lg font-medium ${['shipped', 'delivered'].includes(selectedOrder.status.toLowerCase()) ? 'text-blue-800' : 'text-gray-500'}`}>Shipped</h4>
                                                        <p className="text-sm text-gray-600">{selectedOrder.status === 'shipped' ? 'In Transit' : (selectedOrder.status === 'delivered' ? 'Completed' : 'Pending')}</p>
                                                        <p className={`mt-1 ${['shipped', 'delivered'].includes(selectedOrder.status.toLowerCase()) ? 'text-gray-700' : 'text-gray-400'}`}>
                                                            Your order is on the way to you.
                                                            {selectedOrder.delivery?.trackingNumber &&
                                                                ` Tracking #: ${selectedOrder.delivery.trackingNumber}`
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Delivered */}
                                                <div className="flex items-start">
                                                    <div className={`z-10 flex items-center justify-center w-7 h-7 rounded-full 
                                                        ${selectedOrder.status.toLowerCase() === 'delivered'
                                                            ? 'bg-blue-500'
                                                            : 'bg-gray-300'} 
                                                        border-2 border-white mr-4`}>
                                                        {selectedOrder.status.toLowerCase() === 'delivered' ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : (
                                                            <span className="text-white text-xs">4</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-lg font-medium ${selectedOrder.status.toLowerCase() === 'delivered' ? 'text-blue-800' : 'text-gray-500'}`}>Delivered</h4>
                                                        <p className="text-sm text-gray-600">{selectedOrder.status === 'delivered' ? 'Completed' : 'Pending'}</p>
                                                        <p className={`mt-1 ${selectedOrder.status.toLowerCase() === 'delivered' ? 'text-gray-700' : 'text-gray-400'}`}>
                                                            Your order has been delivered to the destination address.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Cancelled (only shown if order is cancelled) */}
                                                {selectedOrder.status.toLowerCase() === 'cancelled' && (
                                                    <div className="flex items-start">
                                                        <div className="z-10 flex items-center justify-center w-7 h-7 rounded-full bg-red-500 border-2 border-white mr-4">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-medium text-red-800">Order Cancelled</h4>
                                                            <p className="text-sm text-gray-600">Cancelled</p>
                                                            <p className="mt-1 text-gray-700">
                                                                Your order has been cancelled.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <div className="mb-6">
                                        <h3 className="font-bold text-lg mb-4 text-blue-800 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Order Details
                                        </h3>

                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Order ID</h4>
                                                    <p className="text-gray-800 font-semibold">#{selectedOrder.orderId}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Order Date</h4>
                                                    <p className="text-gray-800">{formatDate(selectedOrder.createdAt)}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                                                    <p className="text-gray-800">
                                                        {selectedOrder.payment?.method === 'cod' ? 'Cash on Delivery' :
                                                            selectedOrder.payment?.method || 'Credit Card'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Total Amount</h4>
                                                    <p className="text-gray-800 font-semibold">Rs {selectedOrder.total?.toFixed(2) || '0.00'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-between pt-4 border-t border-gray-200">
                                        <button
                                            onClick={closeTrackingDetails}
                                            className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                            Back
                                        </button>

                                        {['pending', 'processing'].includes(selectedOrder.status.toLowerCase()) && (
                                            <button
                                                onClick={() => setShowCancelConfirm(true)}
                                                className="py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cancel Confirmation Modal */}
                    {showCancelConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-pink-200">
                                <div className="flex items-center justify-center mb-4 text-red-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-center mb-2">Cancel Order</h3>
                                <p className="text-gray-600 text-center mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setShowCancelConfirm(false)}
                                        className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
                                    >
                                        Keep Order
                                    </button>
                                    <button
                                        onClick={handleCancelOrder}
                                        className="py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                                    >
                                        Yes, Cancel Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TrackOrder;