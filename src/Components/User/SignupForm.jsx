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
        alert(data.message || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong!");
    }
  };

  const blinkingStyle = {
    animation: "blink 1s infinite",
    border: "4px solid rgba(255, 106, 250, 0.24)",
  };

  const styles = `
    @keyframes blink {
      0%, 100% {
        box-shadow: 0 0 10px 2px rgba(59, 130, 246, 0.8);
      }
      50% {
        box-shadow: 0 0 20px 5px rgba(59, 130, 246, 1);
      }
    }
  `;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      {/* Style for blinking animation */}
      <style>{styles}</style>

      <div
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800 dark:border-gray-700 border border-gray-300"
        style={blinkingStyle}
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          Create an account
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Profile Picture Upload */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Upload Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm border p-2 rounded"
              required
            />
            {profileImage && (
              <img
                src={profileImage}
                alt="Preview"
                className="w-24 h-24 mt-2 rounded-full object-cover border"
              />
            )}
          </div>

          {/* Name Input */}
          <div>
            <label className="block mb-2 text-sm font-medium">Your Name</label>
            <input
              type="text"
              id="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block mb-2 text-sm font-medium">Your Email</label>
            <input
              type="email"
              id="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              id="password"
              value={userData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {passwordError && (
              <p className="text-sm text-red-600 mt-1">{passwordError}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Create an account
          </button>

          {/* Continue with Google */}
          <button
            type="button"
            className="w-full text-gray-900 bg-white border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 sm:px-5 sm:py-2.5 text-center flex items-center justify-center"
          >
            <svg
              className="mr-2 -ml-1 w-4 h-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 
                   110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 
                   166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 
                   86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 
                   140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 
                   3.9 41.4z"
              ></path>
            </svg>
            Continue with Google
          </button>

          {/* Navigate to Login */}
          <p className="text-sm mt-3">
            Have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
