import React, { useState, useEffect } from "react";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);  // State to hold active users (not blocked)
  const [blockedUsers, setBlockedUsers] = useState([]);  // State to hold blocked users
  const [loading, setLoading] = useState(true);  // Loading state for fetching data

  // Fetch users from the API when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");  // Update with your API endpoint
        const data = await response.json();

        // Separate active and blocked users
        const active = data.filter(user => user && !user.isBlocked); // Added check for undefined
        const blocked = data.filter(user => user && user.isBlocked); // Added check for undefined

        setActiveUsers(active);  
        setBlockedUsers(blocked);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBlockUnblock = async (userId, isBlocked) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/block`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !isBlocked })  // Toggle block status
      });
      const data = await response.json();
      if (response.ok) {
        // Update the state after blocking/unblocking
        if (isBlocked) {
          // Move the user from blocked to active
          setBlockedUsers(prevBlocked =>
            prevBlocked.filter(user => user._id !== userId)
          );
          setActiveUsers(prevActive => [
            ...prevActive,
            data.updatedUser
          ]);
        } else {
          // Move the user from active to blocked
          setActiveUsers(prevActive =>
            prevActive.filter(user => user._id !== userId)
          );
          setBlockedUsers(prevBlocked => [
            ...prevBlocked,
            data.updatedUser
          ]);
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
    }
  };

  // Filter users based on search term
  const filteredActiveUsers = activeUsers.filter(user =>
    user && (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredBlockedUsers = blockedUsers.filter(user =>
    user && (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">User Management</h2>

        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}  // Update search term as user types
            className="w-1/2 p-3 bg-[#374151] text-white rounded-md"
          />
        </div>

        {/* Loading Spinner */}
        {loading && <p className="text-center text-[#F9FAFB]">Loading...</p>}

        {/* Active Users Section (Manage Users) */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-[#F9FAFB] mb-4">Manage Users</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActiveUsers.map((user) => (
              <div key={user._id} className="rounded-lg shadow-md p-6 bg-[#374151]">
                <div className="flex items-center gap-4">
                  <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#9CA3AF]">{user.name}</h3>
                    <p className="text-sm text-[#F9FAFB]">{user.email}</p>
                    {/* Block/Unblock button */}
                    <button
                      onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                      className="mt-4 px-4 py-2 rounded-md bg-red-500"
                    >
                      Block
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blocked Users Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-[#F9FAFB] mb-4">Blocked Users</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlockedUsers.map((user) => (
              <div key={user._id} className="rounded-lg shadow-md p-6 bg-[#374151]">
                <div className="flex items-center gap-4">
                  <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#9CA3AF]">{user.name}</h3>
                    <p className="text-sm text-[#F9FAFB]">{user.email}</p>
                    {/* Unblock button */}
                    <button
                      onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                      className="mt-4 px-4 py-2 rounded-md bg-green-500"
                    >
                      Unblock
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* If no users found */}
        {searchTerm && !filteredActiveUsers.length && !filteredBlockedUsers.length && (
          <p className="text-center text-[#F9FAFB] mt-4">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
