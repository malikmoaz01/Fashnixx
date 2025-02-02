import React from "react";

const SupportFeedback = () => {
  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Support & Feedback</h2>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Queries */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Customer Queries</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">View and resolve customer queries</p>
          </div>

          {/* Feedback Management */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Feedback Management</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">Manage customer feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportFeedback;
