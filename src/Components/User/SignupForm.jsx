import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });

    if (e.target.id === "confirmPassword") {
      setPasswordError(
        e.target.value !== userData.password ? "Passwords do not match!" : ""
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password !== userData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData, profileImage }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        setErrorMessage(data.message || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("Something went wrong! Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-pink-900 p-4 sm:p-6 lg:p-10">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-pink-500 to-pink-500"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 opacity-20 blur-xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-tr from-blue-400 to-blue-500 opacity-20 blur-xl"></div>

        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600 text-center mb-6">
          Join Us Today
        </h1>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-3 text-red-700 bg-red-100 rounded-lg border-l-4 border-red-500">
            {errorMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Profile Picture Upload */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <div className="flex flex-col items-center">
              {profileImage ? (
                <div className="mb-3 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={profileImage}
                    alt="Profile Preview"
                    className="relative w-24 h-24 rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 mb-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                </div>
              )}
              <div className="relative w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0 file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div className="relative">
            <input
              type="text"
              id="name"
              value={userData.name}
              onChange={handleChange}
              className="peer w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600 py-2 px-1"
              placeholder="Name"
              required
            />
            <label 
              htmlFor="name" 
              className="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all 
              peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
              peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm"
            >
              Your Name
            </label>
          </div>

          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={userData.email}
              onChange={handleChange}
              className="peer w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600 py-2 px-1"
              placeholder="Email"
              required
            />
            <label 
              htmlFor="email" 
              className="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all 
              peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
              peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm"
            >
              Your Email
            </label>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              id="password"
              value={userData.password}
              onChange={handleChange}
              className="peer w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600 py-2 px-1"
              placeholder="Password"
              required
            />
            <label 
              htmlFor="password" 
              className="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all 
              peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
              peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm"
            >
              Password
            </label>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              className="peer w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600 py-2 px-1"
              placeholder="Confirm Password"
              required
            />
            <label 
              htmlFor="confirmPassword" 
              className="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all 
              peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
              peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm"
            >
              Confirm Password
            </label>
            {passwordError && (
              <p className="text-sm text-red-600 mt-1">{passwordError}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold rounded-lg group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-pink-600 to-blue-800"></span>
              <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 opacity-30 group-hover:rotate-90 ease"></span>
              <span className="relative text-white">Create Account</span>
            </button>
          </div>
        </form>

        {/* Already have an account link */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;