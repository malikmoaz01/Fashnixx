import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();

  // Check user from localStorage on mount
  useEffect(() => {
    // Clear any existing user data first to prevent automatic login
    const checkStoredUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        // If user is blocked, clear storage and show message
        if (parsedUser.isBlocked === true) {
          setIsBlocked(true);
          localStorage.removeItem("user");
          return;
        }
        
        // Only set user and navigate if not blocked
        setUser(parsedUser);
        navigate("/");
      }
    };
    
    checkStoredUser();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsBlocked(false);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // CRITICAL: Check if user is blocked before proceeding
      if (data.user && data.user.isBlocked === true) {
        setIsBlocked(true);
        setErrorMessage("Your account has been blocked due to excessive order cancellations. Please contact admin.");
        // Clear any existing user data to prevent auto-login
        localStorage.removeItem("user");
        return;
      }

      if (!response.ok) {
        setErrorMessage(data.message || "Login failed!");
        return;
      }

      // Double-check isBlocked flag again to be extra safe
      if (data.user && data.user.isBlocked === true) {
        setIsBlocked(true);
        setErrorMessage("Your account has been blocked due to excessive order cancellations. Please contact admin.");
        return;
      }

      // Only proceed with login if user is not blocked
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Dispatch storage updated event for Navbar to detect
      window.dispatchEvent(new Event('storageUpdated'));

      // Navigate to home/dashboard
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };
  
  const handleGoogleLogin = async (credentialResponse) => {
    setErrorMessage("");
    setIsBlocked(false);
    
    try {
      // Decode the credential to get user info
      const decodedToken = jwtDecode(credentialResponse.credential);
      
      // Send Google token to your backend
      const response = await fetch("http://localhost:5000/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          googleToken: credentialResponse.credential,
          email: decodedToken.email,
          name: decodedToken.name,
          profileImage: decodedToken.picture
        }),
      });

      const data = await response.json();

      // CRITICAL: Check if user is blocked before proceeding
      if (data.user && data.user.isBlocked === true) {
        setIsBlocked(true);
        setErrorMessage("Your account has been blocked due to excessive order cancellations. Please contact admin.");
        // Clear any existing user data
        localStorage.removeItem("user");
        return;
      }

      if (!response.ok) {
        setErrorMessage(data.message || "Google login failed!");
        return;
      }

      // Double-check isBlocked flag again to be extra safe
      if (data.user && data.user.isBlocked === true) {
        setIsBlocked(true);
        setErrorMessage("Your account has been blocked due to excessive order cancellations. Please contact admin.");
        return;
      }

      // Only proceed with login if user is not blocked
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Dispatch storage updated event for Navbar to detect
      window.dispatchEvent(new Event('storageUpdated'));

      // Navigate to home/dashboard
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMessage("Something went wrong with Google login. Please try again later.");
    }
  };

  // Function to check for blocked users that might still be in localStorage
  const checkAndClearBlockedUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.isBlocked === true) {
        localStorage.removeItem("user");
        setIsBlocked(true);
        setErrorMessage("Your account has been blocked due to excessive order cancellations. Please contact admin.");
        return true;
      }
    }
    return false;
  };

  // Call this function on component mount
  useEffect(() => {
    checkAndClearBlockedUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-pink-900 p-4 sm:p-6 lg:p-10">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-pink-500 to-pink-500"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 opacity-20 blur-xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-tr from-blue-400 to-blue-500 opacity-20 blur-xl"></div>

        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600 text-center mb-6">
          Welcome Back
        </h1>

        {/* Blocked user message */}
        {isBlocked && (
          <div className="mb-6 p-4 text-white bg-red-600 rounded-lg">
            <p className="font-bold mb-1">Account Blocked</p>
            <p>You cannot log in because you've cancelled more than 5 orders in the past month.</p>
            <p className="mt-2">Please contact admin to restore your account access.</p>
          </div>
        )}

        {/* General error message */}
        {errorMessage && !isBlocked && (
          <div className="mb-6 p-3 text-red-700 bg-red-100 rounded-lg border-l-4 border-red-500">
            {errorMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* Login Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold rounded-lg group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-pink-600 to-blue-800"></span>
              <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 opacity-30 group-hover:rotate-90 ease"></span>
              <span className="relative text-white">Sign In</span>
            </button>
          </div>

          {/* Google Button */}
          <div className="w-full flex justify-center pt-4">
            <GoogleLogin
              clientId="123922841654-i1jujo69c525uji333d5q2v8rksq5est.apps.googleusercontent.com"
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.error('Google Login Failed');
                setErrorMessage("Google login failed. Please try again.");
              }}
              useOneTap={true}
              theme="filled_blue"
              text="continue_with"
              shape="rectangular"
              locale="en"
              logo_alignment="center"
            />
          </div>
        </form>

        {/* Don't have an account link */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;