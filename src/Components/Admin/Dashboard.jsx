import React, { useState } from "react";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const cards = [
    { name: "Total Users", value: "10" },
    { name: "Total Orders", value: "52" },
    { name: "Sales Stats", value: "Rs 18000" },
    { name: "Products in Stock", value: "39" },
    { name: "Pending Orders", value: "2" },
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
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Overview</h2>

        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 p-3 bg-[#374151] text-white rounded-md"
          />
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.name}
              className="bg-[#374151] rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-[#9CA3AF]">
                {highlightText(card.name)}
              </h3>
              <p className="text-3xl font-bold text-[#F9FAFB] mt-2">
                {highlightText(card.value)}
              </p>
            </div>
          ))}
        </div>

        {/* No Found Message */}
        {searchTerm && !cards.some(card =>
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.value.toLowerCase().includes(searchTerm.toLowerCase())
        ) && (
          <p className="text-center text-[#F9FAFB] mt-4">No Found</p>
        )}

        {/* Additional Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-[#F9FAFB] mb-4">Recent Activity</h3>
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <p className="text-[#9CA3AF]">No recent activities to show.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
