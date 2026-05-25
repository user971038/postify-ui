import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import useFetch from '../hooks/useFetch';

import { GoHome, GoSearch, GoBell, GoMail, GoCopilot } from "react-icons/go";

const NewPost = () => {
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
      
      setFiles([]);
      setDescription('');
      e.target.reset();
      
      window.location.reload(); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-purple-950/10">

        <form onSubmit={submitPost} className="border-t border-gray-800 pt-4">
          <input 
            type="text" 
            placeholder="Broadcast a new memory..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl mb-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
          />

          <div className="flex items-center justify-between gap-3">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-gray-800 file:text-xs file:font-medium file:bg-gray-900 file:text-gray-400 hover:file:bg-gray-800 hover:file:text-white transition-all cursor-pointer"
            />
            <input 
              type="submit" 
              value="Publish" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-1.5 px-4 rounded-lg text-xs transition-all cursor-pointer shadow-md shadow-purple-900/20" 
            />
          </div>
        </form>

      </div>
    </div>
  );
};

export default NewPost;