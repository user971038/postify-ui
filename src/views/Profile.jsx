import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import useFetch from '../hooks/useFetch';

import { GoHome, GoSearch, GoBell, GoMail, GoCopilot } from "react-icons/go";
import { FaUser } from "react-icons/fa";

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

        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 mb-5">
          
          {userLoading && <p className="text-xs text-gray-500 animate-pulse">Cargando...</p>}
          {userError && <p className="text-xs text-red-400">No se pudo recuperar la información del perfil.</p>}
          
          {user && !userLoading && (
            <div className="space-y-1.5 text-sm text-gray-300">
              <p className="uppercase font-bold"><FaUser className="w-5 h-5 text-gray-500" /> {user.name || 'No se encontró el usuario.'} {user.lastname || ''}</p>
              <p className="text-blue-400 font-medium">@{user.username || ''}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 mb-5">
          
          {postsLoading && <p className="text-xs text-gray-500 animate-pulse">Cargando...</p>}
          {postsError && <p className="text-xs text-red-400">No se pudieron recuperar las publicaciones.</p>}
          
          <div className="max-h-[600px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {posts && !postsLoading && posts.length === 0 && (
              <p className="text-xs text-gray-500 italic text-center py-6">No hay publicaciones.</p>
            )}

            {posts && !postsLoading && posts.length > 0 && (
              <ul className="space-y-3">
                {posts.map((post) => (
                  <li 
                    key={post.id} 
                    className="p-3 bg-gray-900 border border-gray-800/80 rounded-xl space-y-2 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="text-sm text-gray-200 font-medium leading-relaxed">{post.description}</div>
                    
                    {post.images && post.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {post.images.map((img) => (
                          <img 
                            key={img.id || img.url} 
                            src={img.url} 
                            alt="Post Attachment" 
                            className="w-full h-24 object-cover rounded-lg border border-gray-800"
                          />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-950/40 to-purple-950/40 border border-gray-800 rounded-xl p-3 flex justify-around text-gray-400 mb-5 shadow-inner">
          <GoHome className="w-5 h-5 cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/')} />
          <GoSearch className="w-5 h-5 opacity-30 cursor-not-allowed" />
          <GoBell className="w-5 h-5 opacity-30 cursor-not-allowed" />
          <GoMail className="w-5 h-5 opacity-30 cursor-not-allowed" />
          <GoCopilot className="w-5 h-5 opacity-30 cursor-not-allowed" />
        </div>

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

export default Profile;