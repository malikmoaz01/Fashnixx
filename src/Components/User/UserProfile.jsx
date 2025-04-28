import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MinePic from "../../assets/TeamLeader.jpg";

const UserProfileManagement = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        street: "",
        city: "",
        profileImage: ""
    });
    const [editField, setEditField] = useState(null);
    const [tempData, setTempData] = useState({ ...profile });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Function to retrieve the user ID and token from local storage
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

    // Fetch user data from backend when the component mounts
    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null);

            const userData = getUserAuth();
            if (!userData || !userData.id) {
                setError("You are not logged in. Please log in to view your profile.");
                setLoading(false);
                return;
            }
            
            try {
                // Use the endpoint from userRoutes.js
                const response = await axios.get(`http://localhost:5000/api/users/${userData.id}/profile`, {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                });
                
                // Transform the data if needed to match your component state
                const profileData = {
                    name: response.data.name || "",
                    email: response.data.email || "",
                    phone: response.data.phone || "",
                    address: response.data.address || "",
                    street: response.data.street || "",
                    city: response.data.city || "",
                    profileImage: response.data.profileImage || ""
                };
                
                setProfile(profileData);
                setTempData(profileData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile data:", error);
                setError("Failed to load profile. Please try again later.");
                setLoading(false);
            }
        };
        
        fetchUserProfile();
    }, []);

    const handleEdit = (field) => setEditField(field);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const userData = getUserAuth();
        if (!userData || !userData.id) {
            setError("You are not logged in. Please log in to upload profile images.");
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            setLoading(true);
            const response = await axios.post(
                `http://localhost:5000/api/users/${userData.id}/upload-profile-image`, 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${userData.token}`
                    }
                }
            );
            
            setTempData(prev => ({
                ...prev,
                profileImage: response.data.profileImage
            }));
            setLoading(false);
        } catch (error) {
            console.error("Error uploading profile image:", error);
            setError("Failed to upload image. Please try again later.");
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        const userData = getUserAuth();
        if (!userData || !userData.id) {
            setError("You are not logged in. Please log in to update your profile.");
            return;
        }

        try {
            setLoading(true);
            
            if (editField === "profile") {
                const profileData = {
                    name: tempData.name,
                    email: tempData.email,
                    phone: tempData.phone,
                    profileImage: tempData.profileImage
                };
                
                await axios.put(
                    `http://localhost:5000/api/users/${userData.id}/profile`, 
                    profileData,
                    {
                        headers: {
                            Authorization: `Bearer ${userData.token}`
                        }
                    }
                );
            } else if (editField === "address") {
                const addressData = {
                    address: tempData.address,
                    street: tempData.street,
                    city: tempData.city
                };
                
                await axios.put(
                    `http://localhost:5000/api/users/${userData.id}/shipping-address`, 
                    addressData,
                    {
                        headers: {
                            Authorization: `Bearer ${userData.token}`
                        }
                    }
                );
            }
            
            setProfile({ ...tempData });
            setEditField(null);
            setLoading(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Failed to update profile. Please try again later.");
            setLoading(false);
            alert("Error updating profile!");
        }
    };

    if (loading && !profile.name) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-pink-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-t-blue-500 border-r-pink-500 border-b-blue-500 border-l-pink-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg font-medium text-blue-800">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error && !profile.name) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-pink-50">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center border border-pink-200 max-w-md">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p className="text-red-600 mb-6 font-medium">{error}</p>
                    <button 
                        className="bg-gradient-to-r from-blue-600 to-pink-500 text-white py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300"
                        onClick={() => navigate('/login')}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const userData = getUserAuth() || {};
    const userName = userData.firstName ? `${userData.firstName} ${userData.lastName || ''}` : profile.name || 'Welcome';

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
                <div className="sticky top-0 flex items-center space-x-4 border-b border-pink-200 pb-4 mb-6">
                    <div className="relative">
                        <img 
                            src={profile.profileImage || MinePic} 
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
                        <p className="text-gray-500 text-sm">{profile.email}</p>
                    </div>
                </div>
                <nav>
                    <ul className="space-y-3">
                        <li>
                            <Link to="/account" className="flex items-center py-3 px-4 rounded-lg bg-gradient-to-r from-blue-100 to-pink-100 border border-pink-200 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Manage Account</span>
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
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 transition-all duration-300">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center md:text-left bg-gradient-to-r from-blue-700 to-pink-600 bg-clip-text text-transparent">
                        Account Details
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

                    {/* Profile Section */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-pink-200 hover:shadow-xl transition-all duration-300 mb-6">
                        <div className="flex items-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <h2 className="text-xl font-bold text-blue-800">Personal Information</h2>
                        </div>

                        {editField === "profile" ? (
                            <div className="space-y-4">
                                <div className="mb-4 flex justify-center">
                                    <div className="relative">
                                        <img 
                                            src={tempData.profileImage || MinePic} 
                                            alt="Profile Avatar" 
                                            className="w-32 h-32 rounded-full object-cover border-4 border-pink-300" 
                                        />
                                        <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-pink-500 text-white p-2 rounded-full cursor-pointer hover:shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </label>
                                        <input 
                                            id="profileImage" 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleFileChange} 
                                            className="hidden" 
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Full Name
                                        </label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            value={tempData.name} 
                                            onChange={handleInputChange} 
                                            className="shadow appearance-none border border-pink-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Email Address
                                        </label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={tempData.email} 
                                            onChange={handleInputChange} 
                                            className="shadow appearance-none border border-pink-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Phone Number
                                        </label>
                                        <input 
                                            type="text" 
                                            name="phone" 
                                            value={tempData.phone} 
                                            onChange={handleInputChange} 
                                            className="shadow appearance-none border border-pink-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center space-x-3 mt-6">
                                    <button 
                                        className="py-2 px-6 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-300 flex items-center"
                                        onClick={handleUpdate}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        className="py-2 px-6 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-all duration-300"
                                        onClick={() => setEditField(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="md:flex items-start">
                                <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
                                    <div className="relative">
                                        <img 
                                            src={profile.profileImage || MinePic} 
                                            alt="Profile Avatar" 
                                            className="w-32 h-32 rounded-full object-cover border-4 border-pink-300" 
                                        />
                                    </div>
                                </div>
                                <div className="md:w-2/3">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Full Name</p>
                                            <p className="font-medium text-blue-800">{profile.name || "Not provided"}</p>
                                        </div>
                                        <div className="bg-pink-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Email Address</p>
                                            <p className="font-medium text-pink-800">{profile.email}</p>
                                        </div>
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Phone Number</p>
                                            <p className="font-medium text-blue-800">{profile.phone || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <button 
                                        className="mt-4 py-2 px-6 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-300 flex items-center mx-auto md:mx-0"
                                        onClick={() => handleEdit("profile")}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Address Section */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-pink-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h2 className="text-xl font-bold text-pink-800">Shipping Address</h2>
                        </div>

                        {editField === "address" ? (
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Address
                                        </label>
                                        <input 
                                            type="text" 
                                            name="address" 
                                            value={tempData.address} 
                                            onChange={handleInputChange} 
                                            className="shadow appearance-none border border-pink-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Street
                                        </label>
                                        <input 
                                            type="text" 
                                            name="street" 
                                            value={tempData.street} 
                                            onChange={handleInputChange} 
                                            className="shadow appearance-none border border-pink-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            City
                                        </label>
                                        <input 
                                            type="text" 
                                            name="city" 
                                            value={tempData.city} 
                                            onChange={handleInputChange} 
                                            className="shadow appearance-none border border-pink-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center space-x-3 mt-6">
                                    <button 
                                        className="py-2 px-6 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-300 flex items-center"
                                        onClick={handleUpdate}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Save Address
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        className="py-2 px-6 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-all duration-300"
                                        onClick={() => setEditField(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="bg-gradient-to-r from-blue-50 to-pink-50 p-4 rounded-lg">
                                    {profile.address || profile.street || profile.city ? (
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Address</p>
                                                <p className="font-medium text-blue-800">{profile.address || "Not provided"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Street</p>
                                                <p className="font-medium text-pink-800">{profile.street || "Not provided"}</p>
                                            </div>
                                            <div>
                                            <p className="font-medium text-blue-800">{profile.city || "Not provided"}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-600 italic">No address information provided yet.</p>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    className="mt-4 py-2 px-6 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-300 flex items-center mx-auto md:mx-0"
                                    onClick={() => handleEdit("address")}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Edit Address
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfileManagement;