import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import useFetch from '../hooks/useFetch';

import { GoHome, GoSearch, GoBell, GoMail, GoCopilot } from "react-icons/go";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const urlUserInfo = `http://localhost:8000/users/${userId}`;
  const urlPosts = `http://localhost:8000/users/${userId}/posts`;
  
  const { data: user, loading: userLoading, error: userError } = useFetch(urlUserInfo);
  const { data: posts, loading: postsLoading, error: postsError } = useFetch(urlPosts);

  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');

  const handleFileChange = (e) => {
    const f = Array.from(e.target.files);
    setFiles(f);
  };

  const submitPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description || 'Nuevo post');
    formData.append('user_id', userId);

    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const res = await fetch('http://localhost:8000/posts', {
        method: 'POST',
        body: formData
      });
      const newPost = await res.json();
      console.log("Post created:", newPost);
      
      // Clean up inputs
      setFiles([]);
      setDescription('');
      e.target.reset();
      
      // Optional: Refresh the page or force-update posts here to show the new item
      window.location.reload(); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto font-sans bg-white shadow-md rounded-lg my-6">
      
      {/* App Header / Navigation back to Main Page */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer" onClick={() => navigate('/')}>
          Postify
        </h1>
        <span className="text-gray-400 text-sm">Profile View</span>
      </div>

      {/* 1. User Info Header */}
      <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
        <h2 className="text-lg font-bold text-green-800 mb-2">👤 User Profile Details</h2>
        {userLoading && <p className="text-sm text-green-600 animate-pulse">Loading user details...</p>}
        {userError && <p className="text-sm text-red-600">Error loading user info</p>}
        
        {user && !userLoading && (
          <div className="space-y-1 text-sm text-gray-700">
            <p><strong>ID:</strong> <code className="bg-green-100 px-1 rounded text-xs">{userId}</code></p>
            <p><strong>Username:</strong> @{user.username || 'username_not_found'}</p>
            <p><strong>First Name:</strong> {user.name || 'N/A'}</p>
            <p><strong>Last Name:</strong> {user.lastname || 'N/A'}</p>
          </div>
        )}
      </div>

      {/* 2. Posts Associated to that ID */}
      <div className="bg-pink-50 border border-pink-200 rounded p-4 mb-6">
        <h2 className="text-lg font-bold text-pink-800 mb-2">📝 Associated Posts</h2>
        {postsLoading && <p className="text-sm text-pink-600 animate-pulse">Loading posts...</p>}
        {postsError && <p className="text-sm text-red-600">Error loading posts</p>}
        
        {posts && !postsLoading && posts.length === 0 && (
          <p className="text-sm text-gray-500 italic">This user hasn't posted anything yet.</p>
        )}

        {posts && !postsLoading && posts.length > 0 && (
          <ul className="space-y-2">
            {posts.map((post) => (
              <li 
                key={post.id} 
                className="p-3 bg-white border border-pink-100 rounded shadow-xs flex flex-col gap-1 hover:border-pink-300 transition"
              >
                <div className="text-xs text-gray-400 font-mono">Post ID: {post.id}</div>
                <div className="text-gray-800 font-medium">{post.description}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 3. Global Navigation Bar Simulator */}
      <div className="bg-blue-600 rounded p-3 flex justify-around text-white mb-6 shadow-sm">
        <GoHome className="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100" onClick={() => navigate('/')} />
        <GoSearch className="w-6 h-6 opacity-50" />
        <GoBell className="w-6 h-6 opacity-50" />
        <GoMail className="w-6 h-6 opacity-50" />
        <GoCopilot className="w-6 h-6 opacity-50" />
      </div>

      {/* 4. Create Post Form */}
      <form onSubmit={submitPost} className="border-t pt-4">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Create a new post for this user:</h3>
        
        <input 
          type="text" 
          placeholder="What's on your mind?" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-3 text-sm focus:outline-indigo-500"
        />

        <div className="flex items-center justify-between gap-2">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          />
          <input 
            type="submit" 
            value="Send Post" 
            className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded text-xs hover:bg-indigo-700 cursor-pointer transition shadow-xs" 
          />
        </div>
      </form>

    </div>
  );
};

export default Profile;