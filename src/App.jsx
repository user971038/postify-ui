import { Routes, Route } from 'react'
import Home from './views/Home'
import Profile from './views/Profile'
import './App.css'

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

//function App() {
  //return (
    //<Routes>
      //<Route path="/" element={<App />} />
      //<Route path="/profile/:userId" element={<Profile />} />
    //</Routes>
  //)
//}

function App() {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    const fetchUsersAndCheckDb = async () => {
      try {
        setLoading(true);
        setDbError(null);

        const res = await fetch('http://localhost:8000/users'); 
        
        if (!res.ok) {
          throw new Error(`Database server responded with status: ${res.status}`);
        }
        
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Connection failed:", error);
        setDbError("Could not connect to the database. Please ensure your backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndCheckDb();
  }, []);

  const handleCreateProfile = () => {
    alert("Create profile functionality coming soon!");
  };

  return (
    <div className="p-6 max-w-xl mx-auto font-sans">
      
      {/* 1. App Title */}
      <header className="border-b pb-4 mb-6 text-center">
        <h1 className="text-4xl font-bold text-indigo-600">Postify</h1>
        <p className="text-gray-500 text-sm">Connect and Share</p>
      </header>

      {/* 2. Profiles Section / Database Error Check */}
      <main className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Explore Profiles</h2>

        {loading && (
          <p className="text-gray-500 animate-pulse">Checking database connection and loading profiles...</p>
        )}

        {dbError && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            <strong>⚠️ Error:</strong> {dbError}
          </div>
        )}

        {!loading && !dbError && users.length === 0 && (
          <p className="text-gray-500 italic">No profiles found in the database yet.</p>
        )}

        {!loading && !dbError && users.length > 0 && (
          <ul className="space-y-2">
            {users.map((user) => (
              <li 
                key={user.id} 
                onClick={() => navigate(`/profile/${user.id}`)}
                className="p-3 border rounded bg-white hover:bg-gray-50 cursor-pointer shadow-xs transition flex justify-between items-center"
              >
                <span className="font-medium text-gray-800">{user.name}</span>
                <span className="text-xs text-gray-400">→ View Profile</span>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* 3. Action Button */}
      <footer className="text-center">
        <button 
          onClick={handleCreateProfile}
          className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded shadow-sm hover:bg-indigo-700 transition"
        >
          ➕ Create New Profile
        </button>
      </footer>

    </div>
  );
}

export default App
