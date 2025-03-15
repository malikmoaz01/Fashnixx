import React, { useState } from "react";
import { Link } from "react-router-dom";
import MinePic from '../../assets/TeamLeader.jpg';

const OrderHistory = () => {
    const [orders] = useState([
        { id: 1, name: "Sneakers", date: "2025-01-05", price: 5000, quantity: 1, status: "Delivered" },
        { id: 2, name: "Casio Watch", date: "2025-01-03", price: 7000, quantity: 1, status: "Shipped" },
        { id: 3, name: "Couple Suit", date: "2025-01-02", price: 15000, quantity: 1, status: "Delivered" },
        { id: 4, name: "Golden Shirt", date: "2025-01-01", price: 3000, quantity: 1, status: "Delivered" },
        { id: 5, name: "Rolex Watch", date: "2025-01-04", price: 25000, quantity: 1, status: "Shipped" },
        { id: 6, name: "Shalwar Qameez", date: "2025-01-03", price: 4000, quantity: 1, status: "Delivered" },
        { id: 7, name: "Jeans", date: "2025-12-11", price: 12000, quantity: 1, status: "Delivered" },
        { id: 8, name: "Bags Pack", date: "2025-11-30", price: 25000, quantity: 1, status: "Shipped" },
        { id: 9, name: "Women Jean", date: "2025-01-03", price: 4000, quantity: 1, status: "Delivered" }
    ]);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const printOrder = (orderId) => {
        const order = orders.find((order) => order.id === orderId);
        const printContent = `
            <h1>Order Details</h1>
            <p>Order ID: ${order.id}</p>
            <p>Name: ${order.name}</p>
            <p>Date: ${order.date}</p>
            <p>Price: ${order.price}</p>
            <p>Quantity: ${order.quantity}</p>
            <p>Status: ${order.status}</p>
        `;
        const printWindow = window.open("", "_blank");
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row relative">
            {/* Sidebar Toggle Button for Mobile */}
            <button
                className="md:hidden bg-blue-900 text-white py-2 px-4 m-2 rounded"
                onClick={() => setSidebarOpen(true)}
            >
                ☰ Menu
            </button>

            {/* Sidebar */}
            <aside
                className={`bg-white w-64 md:w-1/4 p-4 shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform fixed md:relative h-full z-50`}
            >
                <div className="flex items-center space-x-4 border-b pb-4 mb-4">
                    <img src={MinePic} alt="User Avatar" className="w-12 h-12 rounded-full" />
                    <div>
                        <h2 className="text-lg font-semibold">Hello, Malik Moaz</h2>
                    </div>
                </div>
                <nav>
                    <ul className="space-y-2">
                        <li><Link to="/account" className="block py-2 px-4 rounded hover:bg-gray-200">Manage Account</Link></li>
                        <li><Link to="/order-history" className="block py-2 px-4 rounded hover:bg-gray-200">My Order History</Link></li>
                        <li><a href="/payment-methods" className="block py-2 px-4 rounded hover:bg-gray-200">Payment Methods</a></li>
                        <li><a href="/" className="block py-2 px-4 rounded hover:bg-gray-200 text-red-600">Log Out</a></li>
                    </ul>
                </nav>
            </aside>

            {/* Overlay to close sidebar on mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 p-4">
                <h1 className="text-2xl font-semibold mb-4 text-center md:text-left">Order History</h1>

                {/* Orders Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-4 rounded-lg shadow-lg border hover:border-blue-800">
                            <h2 className="font-semibold mb-2">{order.name}</h2>
                            <p>Date: {order.date}</p>
                            <p>Status: <span className={`text-${order.status === "Delivered" ? "green" : "yellow"}-600`}>{order.status}</span></p>
                            <button onClick={() => printOrder(order.id)} className="mt-2 py-1 px-4 bg-blue-900 text-white rounded hover:bg-blue-800">
                                Print Order
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default OrderHistory;
