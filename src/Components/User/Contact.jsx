import React, { useState } from "react";
import axios from "axios";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/send-email", formData);
      alert("Message sent successfully!");
      // Reset form fields after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      alert("Failed to send message.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-900 text-white p-8 md:p-16">
      <div className="md:w-1/2 p-4">
        <h2 className="text-4xl font-bold mb-4">Get in touch</h2>
        <p className="text-lg mb-6">
          If you have any questions or need assistance, feel free to reach out to us.
        </p>
        <div className="space-y-4">
          <p>
            <strong>Address:</strong> Pu Hostel 17 Lahore
          </p>
          <p>
            <strong>Phone:</strong> <a href="tel:00923055865381" className="text-blue-400">00923055865381</a>
          </p>
          <p>
            <strong>Email:</strong> <a href="mailto:mlkmoaz01@gmail.com" className="text-blue-400">mlkmoaz01@gmail.com</a>
          </p>
        </div>
      </div>
      <div className="md:w-1/2 p-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              className="w-full md:w-1/2 p-3 bg-gray-800 border border-gray-700 rounded text-white"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              className="w-full md:w-1/2 p-3 bg-gray-800 border border-gray-700 rounded text-white"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone number"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
            value={formData.phone}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Message"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white h-32"
            value={formData.message}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 hover:bg-blue-700 rounded text-white"
          >
            Send message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;