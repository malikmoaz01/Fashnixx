import React, { useState } from "react";
import { Link } from "react-router-dom";
import MinePic from '../../assets/TeamLeader.jpg';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const PaymentMethod = () => {
    const [paymentMethods, setPaymentMethods] = useState([
        { id: 1, name: "Jazzcash", phone: "03055865381", malik: "Malik Moaz", status: "Saver" },
        { id: 2, name: "Easypaisa", phone: "03055865381", malik: "Malik Moaz", status: "Current" },
        { id: 3, name: "Sadapay", phone: "03055865381", malik: "Malik Moaz", status: "Saver" },
    ]);
    
    const [editField, setEditField] = useState(null);
    const [tempData, setTempData] = useState({ name: "", phone: "", malik: "", status: "" });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleEdit = (id) => {
        const method = paymentMethods.find(m => m.id === id);
        setTempData({ ...method });
        setEditField(id);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = (id) => {
        setPaymentMethods(paymentMethods.map(method =>
            method.id === id ? { ...method, ...tempData } : method
        ));
        setEditField(null);
    };

    const handleDelete = (id) => {
        setPaymentMethods(paymentMethods.filter(method => method.id !== id));
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
                <h1 className="text-2xl font-semibold mb-4 text-center md:text-left">Payment Methods</h1>

                {/* Payment Methods Section */}
                <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                    {paymentMethods.map((method) => (
                        <div key={method.id} className="bg-white p-4 rounded-lg shadow border hover:border-blue-800">
                            <h2 className="text-lg font-semibold mb-2">{method.name}</h2>
                            {editField === method.id ? (
                                <div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={tempData.name}
                                        onChange={handleInputChange}
                                        className="block w-full mb-2 p-2 border rounded"
                                    />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={tempData.phone}
                                        onChange={handleInputChange}
                                        className="block w-full mb-2 p-2 border rounded"
                                    />
                                    <input
                                        type="text"
                                        name="malik"
                                        value={tempData.malik}
                                        onChange={handleInputChange}
                                        className="block w-full mb-2 p-2 border rounded"
                                    />
                                    <select
                                        name="status"
                                        value={tempData.status}
                                        onChange={handleInputChange}
                                        className="block w-full mb-2 p-2 border rounded"
                                    >
                                        <option value="Saver">Saver</option>
                                        <option value="Current">Current</option>
                                    </select>
                                    <button
                                        className="mt-2 py-1 px-4 bg-blue-900 text-white rounded hover:bg-blue-800"
                                        onClick={() => handleUpdate(method.id)}
                                    >
                                        Update
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p className="mb-2"><strong>Phone:</strong> {method.phone}</p>
                                    <p className="mb-2"><strong>Name:</strong> {method.malik}</p>
                                    <p className="mb-2"><strong>Status:</strong> {method.status}</p>
                                    <div className="flex space-x-2 mt-2">
                                        <button
                                            className="text-yellow-600"
                                            onClick={() => handleEdit(method.id)}
                                        >
                                            <FaEdit className="inline mr-1" /> Edit
                                        </button>
                                        <button
                                            className="text-red-600"
                                            onClick={() => handleDelete(method.id)}
                                        >
                                            <FaTrashAlt className="inline mr-1" /> Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default PaymentMethod;
