import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      // Updated API endpoint to match our routes
      const response = await axios.get("http://localhost:5000/api/complaints");
      setComplaints(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      // Updated API endpoint to match our routes
      await axios.put(`http://localhost:5000/api/complaints/${id}`, { status: newStatus });
      fetchComplaints(); // Refresh complaints list
    } catch (error) {
      console.error("Error updating complaint status:", error);
    }
  };

  const viewComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const closeModal = () => {
    setSelectedComplaint(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    // Filter by status
    if (filter !== 'all' && complaint.status !== filter) {
      return false;
    }
    
    // Filter by search term in message, name, email or order number
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (complaint.message && complaint.message.toLowerCase().includes(searchLower)) ||
        (complaint.customerName && complaint.customerName.toLowerCase().includes(searchLower)) ||
        (complaint.email && complaint.email.toLowerCase().includes(searchLower)) ||
        (complaint.orderNumber && complaint.orderNumber.toString().includes(searchLower))
      );
    }
    
    return true;
  });

  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Customer Complaints</h2>

        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search complaints, customers, emails, or orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 p-3 bg-[#374151] text-white rounded-md"
          />
          
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-[#374151] text-[#9CA3AF]'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('new')} 
              className={`px-4 py-2 rounded-md ${filter === 'new' ? 'bg-blue-600 text-white' : 'bg-[#374151] text-[#9CA3AF]'}`}
            >
              New
            </button>
            <button 
              onClick={() => setFilter('in-progress')} 
              className={`px-4 py-2 rounded-md ${filter === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-[#374151] text-[#9CA3AF]'}`}
            >
              In Progress
            </button>
            <button 
              onClick={() => setFilter('resolved')} 
              className={`px-4 py-2 rounded-md ${filter === 'resolved' ? 'bg-blue-600 text-white' : 'bg-[#374151] text-[#9CA3AF]'}`}
            >
              Resolved
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {filteredComplaints.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-[#374151] rounded-lg overflow-hidden">
                  <thead className="bg-[#1F2937] text-[#9CA3AF]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Complaint</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4B5563]">
                    {filteredComplaints.map((complaint) => (
                      <tr key={complaint._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F9FAFB]">
                          {complaint._id.substring(0, 8)}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#F9FAFB]">
                          {complaint.customerName || 'Anonymous'}
                          {complaint.email && <div className="text-xs text-[#9CA3AF]">{complaint.email}</div>}
                          {complaint.orderNumber && <div className="text-xs text-[#9CA3AF]">Order: #{complaint.orderNumber}</div>}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#F9FAFB]">
                          <div className="truncate max-w-xs">
                            {complaint.message}
                          </div>
                          <button 
                            onClick={() => viewComplaintDetails(complaint)}
                            className="text-xs text-blue-400 hover:text-blue-300 mt-1"
                          >
                            View details
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F9FAFB]">
                          {new Date(complaint.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            {complaint.status !== 'in-progress' && (
                              <button 
                                onClick={() => updateStatus(complaint._id, 'in-progress')}
                                className="px-3 py-1 bg-yellow-500 text-white rounded-md text-xs"
                              >
                                In Progress
                              </button>
                            )}
                            {complaint.status !== 'resolved' && (
                              <button 
                                onClick={() => updateStatus(complaint._id, 'resolved')}
                                className="px-3 py-1 bg-green-500 text-white rounded-md text-xs"
                              >
                                Resolve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-[#374151] rounded-lg p-8 text-center text-[#9CA3AF]">
                {searchTerm || filter !== 'all' ? 
                  'No complaints match your search criteria.' : 
                  'No complaints received yet.'}
              </div>
            )}
          </>
        )}
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1F2937] rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-[#4B5563]">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-white">Complaint Details</h3>
                <button 
                  onClick={closeModal}
                  className="text-[#9CA3AF] hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[#9CA3AF] text-sm">Customer Name</p>
                  <p className="text-white">{selectedComplaint.customerName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-[#9CA3AF] text-sm">Email</p>
                  <p className="text-white">{selectedComplaint.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-[#9CA3AF] text-sm">Order Number</p>
                  <p className="text-white">{selectedComplaint.orderNumber || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-[#9CA3AF] text-sm">Status</p>
                  <p>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[#9CA3AF] text-sm">Date</p>
                  <p className="text-white">{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[#9CA3AF] text-sm">ID</p>
                  <p className="text-white">{selectedComplaint._id}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-[#9CA3AF] text-sm">Complaint Message</p>
                <div className="mt-2 p-4 bg-[#374151] rounded-lg text-white">
                  {selectedComplaint.message}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {selectedComplaint.status !== 'in-progress' && (
                  <button 
                    onClick={() => {
                      updateStatus(selectedComplaint._id, 'in-progress');
                      closeModal();
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md text-sm"
                  >
                    Mark In Progress
                  </button>
                )}
                {selectedComplaint.status !== 'resolved' && (
                  <button 
                    onClick={() => {
                      updateStatus(selectedComplaint._id, 'resolved');
                      closeModal();
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-md text-sm"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;