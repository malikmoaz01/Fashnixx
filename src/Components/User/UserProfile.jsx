import React, { useState } from "react";
import { Link } from "react-router-dom";
import MinePic from '../../assets/TeamLeader.jpg';

const UserProfileManagement = () => {
    const [profile, setProfile] = useState({
        name: "Malik Moaz",
        email: "mlkmoaz01@gmail.com",
        phone: "923055865381",
        password: "malikmoaz",
        address: "Punjab University",
        street: "Hostel 17",
        city: "Lahore",
        bill: "PUCIT New Campus",
        billStreet: "Building A",
        billCity: "Lahore",
    });

    const [editField, setEditField] = useState(null);
    const [tempData, setTempData] = useState({ ...profile });

    const handleEdit = (field) => setEditField(field);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempData((prev) => ({ ...prev, [name]: value }));
    };
    const handleUpdate = () => {
        setProfile({ ...tempData });
        setEditField(null);
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="bg-white w-1/4 p-4 shadow-lg flex-shrink-0">
                <div className="flex items-center space-x-4 border-b pb-4 mb-4">
                    <img src={MinePic} alt="User Avatar" className="w-12 h-12 rounded-full" />
                    <div>
                        <h2 className="text-lg font-semibold">Hello, {profile.name}</h2>
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

            {/* Main Content */}
            <main className="flex-1 p-4">
                <h1 className="text-2xl font-semibold mb-4">Account Details</h1>

                {/* Profile Card */}
                <div className="bg-white p-4 rounded-lg shadow-lg border hover:border-blue-900 mb-4">
                    <h2 className="text-lg font-semibold mb-4 text-center">Profile</h2>
                    {editField === "profile" ? (
                        <div>
                            <input type="text" name="name" value={tempData.name} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                            <input type="email" name="email" value={tempData.email} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                            <input type="text" name="phone" value={tempData.phone} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                            <label className="block mb-2 font-semibold">Upload Profile Picture:</label>
                            <input type="file" accept="image/*" className="block w-full mb-4 p-2 border rounded" />
                            <button className="mt-2 py-1 px-4 bg-blue-900 text-white rounded hover:bg-blue-800" onClick={handleUpdate}>Update</button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <img src={MinePic} alt="Profile Avatar" className="w-24 h-24 rounded-full mx-auto mb-4" />
                            <p className="mb-2">Name: {profile.name}</p>
                            <p className="mb-2">Email: {profile.email}</p>
                            <p className="mb-2">Phone: {profile.phone}</p>
                            <button className="mt-2 py-1 px-4 bg-blue-900 text-white rounded hover:bg-blue-800" onClick={() => handleEdit("profile")}>Edit</button>
                        </div>
                    )}
                </div>

                {/* Address Cards */}
                <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Shipping Address */}
                    <div className="bg-white p-4 rounded-lg shadow border hover:border-blue-800">
                        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
                        {editField === "address" ? (
                            <div>
                                <input type="text" name="address" value={tempData.address} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                                <input type="text" name="street" value={tempData.street} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                                <input type="text" name="city" value={tempData.city} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                                <button className="mt-2 py-1 px-4 bg-blue-900 text-white rounded hover:bg-blue-800" onClick={handleUpdate}>Update</button>
                            </div>
                        ) : (
                            <div>
                                <p className="mb-2">Address: {profile.address}</p>
                                <p className="mb-2">Street: {profile.street}</p>
                                <p className="mb-2">City: {profile.city}</p>
                                <button className="mt-2 py-1 px-4 bg-blue-900 text-white rounded hover:bg-blue-800" onClick={() => handleEdit("address")}>Edit</button>
                            </div>
                        )}
                    </div>

                    {/* Billing Address */}
                    <div className="bg-white p-4 rounded-lg shadow border hover:border-blue-800">
                        <h2 className="text-lg font-semibold mb-2">Billing Address</h2>
                        {editField === "bill" ? (
                            <div>
                                <input type="text" name="bill" value={tempData.bill} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                                <input type="text" name="billStreet" value={tempData.billStreet} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                                <input type="text" name="billCity" value={tempData.billCity} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                                <button className="mt-2 py-1 px-4 bg-blue-900 text-white rounded hover:bg-blue-800" onClick={handleUpdate}>Update</button>
                            </div>
                        ) : (
                            <div>
                                <p className="mb-2">Bill: {profile.bill}</p>
                                <p className="mb-2">Street: {profile.billStreet}</p>
                                <p className="mb-2">City: {profile.billCity}</p>
                                <button className="mt-2 py-1 px-4 bg-blue-900 text-white rounded hover:bg-blue-800" onClick={() => handleEdit("bill")}>Edit</button>
                            </div>
                        )}
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border hover:border-blue-800">
                        <h2 className="text-lg font-semibold mb-2">Billing Address</h2>
                        {editField === "bill" ? (
                            <div>
                                <input type="text" name="bill" value={tempData.bill} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                                <input type="text" name="billStreet" value={tempData.billStreet} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                                <input type="text" name="billCity" value={tempData.billCity} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                                <button className="mt-2 py-1 px-4 bg-blue-900 text-white rounded hover:bg-blue-800" onClick={handleUpdate}>Update</button>
                            </div>
                        ) : (
                            <div>
                                <p className="mb-2">Bill: {profile.bill}</p>
                                <p className="mb-2">Street: {profile.billStreet}</p>
                                <p className="mb-2">City: {profile.billCity}</p>
                                <button className="mt-2 py-1 px-4 bg-blue-900 text-white rounded hover:bg-blue-800" onClick={() => handleEdit("bill")}>Edit</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfileManagement ;
