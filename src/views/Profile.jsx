import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import useFetch from '../hooks/useFetch';

import { GoSearch, GoBell, GoMail, GoCopilot } from "react-icons/go";
import { FaUser, FaGithub, FaHome } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";

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
      
      <div className="w-full max-w-md h-[85vh] flex flex-col justify-between bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-purple-950/10">

        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 mb-5">
          
          {userLoading && <p className="text-xs text-gray-500 animate-pulse">Cargando...</p>}
          {userError && <p className="text-xs text-red-400">No se pudo recuperar la información del perfil.</p>}
          
          {user && !userLoading && (
            <div className="space-y-1.5 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <FaUser className="w-4 h-4 text-gray-500" />
                <p className="uppercase font-bold"> {user.name || 'No se encontró el usuario.'} {user.lastname || ''}</p>
              </div>
              <p className="text-blue-400 font-medium">@{user.username || ''}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 mb-5">
          
          {postsLoading && <p className="text-xs text-gray-500 animate-pulse">Cargando...</p>}
          {postsError && <p className="text-xs text-red-400">No se pudieron recuperar las publicaciones.</p>}
          
          <div className="h-[54vh] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
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
                    <div className="text-sm text-gray-200 leading-relaxed">{post.description}</div>
                    
                    {post.images && post.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {post.images.map((img) => (
                          <img 
                            key={img.id || img.url} 
                            src={img.url} 
                            alt="Post Attachment" 
                            className="w-[100px] h-[100px] object-cover rounded-lg border border-gray-800"
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
          <FaHome className="w-5 h-5 cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/')} />
          <GoSearch className="w-5 h-5 opacity-30 cursor-not-allowed" />
          <IoIosCreate className="w-5 h-5 cursor-pointer hover:text-white transition-colors" onClick={() => navigate(`/NewPost/${userId}`)} />
          <FaGithub className="w-5 h-5 cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/')} />
        </div>

      </div>
    </div>
  );
};

export default Profile;