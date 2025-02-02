import React, { useState } from "react";

const Settings = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const cards = [
    { name: "General Settings", id: "Manage website logo, name, and other general configurations." },
    { name: "Payment Settings", id: "Configure payment gateways and integrate with third-party providers." },
    { name: "Email/SMS Notifications", id: "Customize notification settings for user communications." },
  ];

  const highlightText = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-red-500 text-white">{part}</span>
      ) : part
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Settings</h2>

        <div className="mb-4 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 p-3 bg-[#374151] text-white rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="rounded-lg shadow-md p-6 bg-[#374151]">
              <h3 className="text-lg font-semibold text-[#9CA3AF]">
                {highlightText(card.name)}
              </h3>
              <p className="text-sm text-[#F9FAFB] mt-2">
                {highlightText(card.id)}
              </p>
            </div>
          ))}
        </div>

        {searchTerm && !cards.some(card => 
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          card.id.toLowerCase().includes(searchTerm.toLowerCase())
        ) && (
          <p className="text-center text-[#F9FAFB] mt-4">No Found</p>
        )}
      </div>
    </div>
  );
};

export default Settings;
