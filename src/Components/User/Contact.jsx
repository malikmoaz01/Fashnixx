import React from 'react';

const ContactForm = () => {
  return (
    <div className="flex flex-col md:flex-row bg-gray-900 text-white p-8 md:p-16">
      <div className="md:w-1/2 p-4">
        <h2 className="text-4xl font-bold mb-4">Get in touch</h2>
        <p className="text-lg mb-6">
          If you have any questions or need assistance with our products, feel free to reach out to us.
        </p>
        <div className="space-y-4">
          <p>
            <strong>Address:</strong> Pu Hostel 17 Lahore
          </p>
          <p>
            <strong>Phone:</strong> <a href="tel:00923055865381" className="text-blue-400">00923055865381</a>
          </p>
          <p>
            <strong>Email:</strong> <a href="mailto:hello@ecom.com" className="text-blue-400">mlkmoaz01@gmail.com</a>
          </p>
        </div>
      </div>
      <div className="md:w-1/2 p-4">
        <form className="space-y-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="text"
              placeholder="First name"
              className="w-full md:w-1/2 p-3 bg-gray-800 border border-gray-700 rounded text-white"
            />
            <input
              type="text"
              placeholder="Last name"
              className="w-full md:w-1/2 p-3 bg-gray-800 border border-gray-700 rounded text-white"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
          />
          <input
            type="text"
            placeholder="Phone number"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
          />
          <textarea
            placeholder="Message"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white h-32"
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
