import React, { useState, useEffect } from "react";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter out any undefined or null user objects
        const validUsers = Array.isArray(data) ? data.filter(user => user && typeof user === 'object') : [];
        
        // Separate active and blocked users
        const active = validUsers.filter(user => !user.isBlocked);
        const blocked = validUsers.filter(user => user.isBlocked);

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
    if (!userId) {
      console.error("Invalid user ID");
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/block`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !isBlocked })
      });
      
      const data = await response.json();
      
      if (response.ok && data.updatedUser) {
        if (isBlocked) {
          // Move the user from blocked to active
          setBlockedUsers(prevBlocked =>
            prevBlocked.filter(user => user && user._id !== userId)
          );
          setActiveUsers(prevActive => [
            ...prevActive,
            data.updatedUser
          ]);
        } else {
          // Move the user from active to blocked
          setActiveUsers(prevActive =>
            prevActive.filter(user => user && user._id !== userId)
          );
          setBlockedUsers(prevBlocked => [
            ...prevBlocked,
            data.updatedUser
          ]);
        }
      } else {
        alert(data.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
    }
  };

  // Filter users based on search term with null checks
  const filteredActiveUsers = activeUsers.filter(user =>
    user && user._id && user.name && user.email && 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredBlockedUsers = blockedUsers.filter(user =>
    user && user._id && user.name && user.email &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 p-3 bg-[#374151] text-white rounded-md"
          />
        </div>

        {/* Loading Spinner */}
        {loading && <p className="text-center text-[#F9FAFB]">Loading...</p>}

        {/* Active Users Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-[#F9FAFB] mb-4">Manage Users</h3>
          {!loading && filteredActiveUsers.length === 0 && (
            <p className="text-center text-[#F9FAFB]">No active users found</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActiveUsers.map((user) => (
              user && user._id ? (
                <div key={user._id} className="rounded-lg shadow-md p-6 bg-[#374151]">
                  <div className="flex items-center gap-4">
                    <img 
                      src={user.image || "https://via.placeholder.com/150"} 
                      alt={user.name || "User"} 
                      className="w-16 h-16 rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-[#9CA3AF]">{user.name || "Unknown"}</h3>
                      <p className="text-sm text-[#F9FAFB]">{user.email || "No email"}</p>
                      <button
                        onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                        className="mt-4 px-4 py-2 rounded-md bg-red-500 text-white"
                      >
                        Block
                      </button>
                    </div>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        </div>

        {/* Blocked Users Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-[#F9FAFB] mb-4">Blocked Users</h3>
          {!loading && filteredBlockedUsers.length === 0 && (
            <p className="text-center text-[#F9FAFB]">No blocked users found</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlockedUsers.map((user) => (
              user && user._id ? (
                <div key={user._id} className="rounded-lg shadow-md p-6 bg-[#374151]">
                  <div className="flex items-center gap-4">
                    <img 
                      src={user.image || "https://via.placeholder.com/150"} 
                      alt={user.name || "User"} 
                      className="w-16 h-16 rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-[#9CA3AF]">{user.name || "Unknown"}</h3>
                      <p className="text-sm text-[#F9FAFB]">{user.email || "No email"}</p>
                      <button
                        onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                        className="mt-4 px-4 py-2 rounded-md bg-green-500 text-white"
                      >
                        Unblock
                      </button>
                    </div>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        </div>

        {/* If no users found with search term */}
        {searchTerm && !loading && !filteredActiveUsers.length && !filteredBlockedUsers.length && (
          <p className="text-center text-[#F9FAFB] mt-4">No users found matching "{searchTerm}"</p>
        )}
      </div>
    </div>
  );
};

export default UserManagement;