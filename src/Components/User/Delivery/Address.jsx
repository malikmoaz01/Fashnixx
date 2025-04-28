import React, { useState, useEffect } from "react";

const AddressForm = ({ customerData, updateCustomerData, onNext }) => {
  const [errors, setErrors] = useState({});
  
  // Get user data from localStorage on component mount
  useEffect(() => {
    const getUserData = () => {
      const userString = localStorage.getItem('user');
      if (!userString) return null;
      
      try {
        const userData = JSON.parse(userString);
        return userData;
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
        return null;
      }
    };
    
    // Fetch profile data if available
    const fetchUserProfile = async () => {
      const userData = getUserData();
      if (!userData || !userData.id) return;
      
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userData.id}/profile`, {
          headers: {
            Authorization: `Bearer ${userData.token}`
          }
        });
        
        if (response.ok) {
          const profileData = await response.json();
          
          // Update customer data with profile information
          updateCustomerData({
            email: profileData.email,
            firstName: customerData.firstName || profileData.name?.split(' ')[0] || '',
            lastName: customerData.lastName || profileData.name?.split(' ').slice(1).join(' ') || '',
            phone: customerData.phone || profileData.phone || '',
            address: {
              ...customerData.address,
              line1: customerData.address.line1 || profileData.address || '',
              line2: customerData.address.line2 || profileData.street || '',
              city: customerData.address.city || profileData.city || '',
            }
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Skip email field changes - email cannot be modified
    if (name === "email") return;
    
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      updateCustomerData({
        address: {
          ...customerData.address,
          [addressField]: value,
        },
      });
    } else {
      updateCustomerData({ [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!customerData.firstName) newErrors.firstName = "First name is required";
    if (!customerData.lastName) newErrors.lastName = "Last name is required";
    
    // Email validation with regex - should already be valid since it's from user profile
    if (!customerData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(customerData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Phone validation
    if (!customerData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(customerData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    // Address validation
    if (!customerData.address.line1) newErrors["address.line1"] = "Address line 1 is required";
    if (!customerData.address.city) newErrors["address.city"] = "City is required";
    if (!customerData.address.state) newErrors["address.state"] = "State is required";
    if (!customerData.address.postalCode) {
      newErrors["address.postalCode"] = "Postal code is required";
    } else if (!/^\d{6}$/.test(customerData.address.postalCode)) {
      newErrors["address.postalCode"] = "Please enter a valid 6-digit postal code";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onNext();
    } else {
      // Scroll to first error
      const firstErrorField = document.querySelector(".error-message");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const states = [
    "Karachi",
    "Lahore",
    "Faisalabad",
    "Rawalpindi",
    "Gujranwala",
    "Multan",
    "Peshawar",
    "Quetta",
    "Islamabad",
    "Sargodha",
    "Sialkot",
    "Bahawalpur",
    "Sukkur",
    "Larkana",
    "Sheikhupura",
    "Jhang",
    "Dera Ghazi Khan",
    "Hyderabad",
    "Mardan",
    "Gujrat",
    "Kasur",
    "Rahim Yar Khan",
    "Sahiwal",
    "Okara",
    "Wah Cantonment",
    "Mingora",
    "Nawabshah",
    "Burewala",
    "Jhelum",
    "Sadiqabad",
    "Khanewal",
    "Hafizabad",
    "Kohat",
    "Jacobabad",
    "Shikarpur",
    "Muzaffargarh",
    "Khanpur",
    "Gojra",
    "Bahawalnagar",
    "Abbottabad",
    "Muridke",
    "Pakpattan",
    "Khuzdar",
    "Jaranwala",
    "Chiniot",
    "Daska",
    "Mandi Bahauddin",
    "Ahmadpur East",
    "Kamalia",
    "Tando Adam",
    "Khairpur",
    "Dera Ismail Khan",
    "Vehari",
    "Nowshera",
    "Dadu",
    "Wazirabad",
    "Khushab",
    "Charsadda",
    "Swabi",
    "Chakwal",
    "Mianwali",
    "Tando Allahyar",
    "Kot Adu",
    "Farooka",
    "Chichawatni",
    "Mansehra"
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={customerData.firstName}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1 error-message">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={customerData.lastName}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1 error-message">{errors.lastName}</p>
            )}
          </div>

          {/* Email - Disabled and shows user's email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address (From Your Account) *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={customerData.email}
              disabled
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed as it's linked to your account</p>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={customerData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className={`w-full p-2 border rounded-md ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 error-message">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Address Line 1 */}
        <div>
          <label htmlFor="address.line1" className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 1 *
          </label>
          <input
            type="text"
            id="address.line1"
            name="address.line1"
            value={customerData.address.line1}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors["address.line1"] ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors["address.line1"] && (
            <p className="text-red-500 text-xs mt-1 error-message">{errors["address.line1"]}</p>
          )}
        </div>

        {/* Address Line 2 (Optional) */}
        <div>
          <label htmlFor="address.line2" className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 2 (Optional)
          </label>
          <input
            type="text"
            id="address.line2"
            name="address.line2"
            value={customerData.address.line2}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* City */}
          <div>
            <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              id="address.city"
              name="address.city"
              value={customerData.address.city}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors["address.city"] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors["address.city"] && (
              <p className="text-red-500 text-xs mt-1 error-message">{errors["address.city"]}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <select
              id="address.state"
              name="address.state"
              value={customerData.address.state}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors["address.state"] ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors["address.state"] && (
              <p className="text-red-500 text-xs mt-1 error-message">{errors["address.state"]}</p>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code *
            </label>
            <input
              type="text"
              id="address.postalCode"
              name="address.postalCode"
              value={customerData.address.postalCode}
              onChange={handleChange}
              placeholder="6-digit PIN code"
              className={`w-full p-2 border rounded-md ${
                errors["address.postalCode"] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors["address.postalCode"] && (
              <p className="text-red-500 text-xs mt-1 error-message">
                {errors["address.postalCode"]}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to Cart
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition"
          >
            Continue to Delivery
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;