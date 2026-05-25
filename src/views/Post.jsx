import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import useFetch from '../hooks/useFetch';

import { GoSearch, GoHeart, GoComment, GoPaperAirplane, GoChevronLeft, GoTrash } from "react-icons/go";
import { FaUser, FaHome, FaGithub } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";

const Post = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  const urlPostDetails = `http://localhost:8000/posts/${postId}`;
  const { data: post, loading: postLoading, error: postError } = useFetch(urlPostDetails);

  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const currentUserId = "00000000-0000-0000-0000-000000000000"; 

  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUserId, post_id: postId })
      });
      
      if (res.ok) {
        window.location.reload();
      } else {
        const errData = await res.json();
        alert(errData.detail || "Ya le diste like a esta publicación");
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommenting(true);
    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentText,
          user_id: currentUserId,
          post_id: postId
        })
      });

      if (res.ok) {
        setCommentText('');
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.");
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        console.log("Post deleted successfully");
        navigate('/');
      } else {
        const errData = await res.json();
        alert(errData.detail || "No se pudo eliminar la publicación.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error de conexión con el servidor.");
    } finally {
      setDeleting(false);
    }
  };

  const handleEditPost = () => {
    
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      
      <div className="w-full max-w-md h-[85vh] flex flex-col justify-between bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-purple-950/10">
        
        {/* Top Header Row with Back Button and Delete Action */}
        <div className="flex items-center justify-between mb-4 text-gray-400">
          <div className="flex items-center gap-2">
            <GoChevronLeft className="w-6 h-6 cursor-pointer hover:text-white transition-colors" onClick={() => navigate(-1)} />
            <span className="text-sm font-semibold tracking-wide uppercase">Detalles de Publicación</span>
          </div>
          
          {/* Render delete button only if the post data exists successfully */}
          {post && !postLoading && (
            <button 
              onClick={handleDeletePost}
              disabled={deleting}
              className="text-gray-500 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-950/20 transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
              title="Eliminar Publicación"
            >
              <GoTrash className="w-4.5 h-4.5" />
            </button>
          )}
        </div>

        <div className="h-[62vh] overflow-y-auto space-y-4 pr-1 custom-scrollbar flex-1">
          
          {postLoading && <p className="text-xs text-gray-500 animate-pulse text-center py-6">Cargando publicación...</p>}
          {postError && <p className="text-xs text-red-400 text-center py-6">No se pudo recuperar la información del post.</p>}
          
          {post && !postLoading && (
            <>
              <div className="p-4 bg-gray-900/60 border border-gray-800/80 rounded-xl space-y-3">
                <div className="text-sm text-gray-200 leading-relaxed font-light">
                  {post.description}
                </div>
                
                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {post.images.map((img) => (
                      <img 
                        key={img.id || img.url} 
                        src={img.url} 
                        alt="Post Attachment" 
                        className="w-full max-h-[220px] object-cover rounded-xl border border-gray-800/80"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2 border-t border-gray-800/50 text-gray-400 text-xs">
                  <button 
                    onClick={handleLike}
                    className="flex items-center gap-1.5 hover:text-red-400 transition-colors group"
                  >
                    <GoHeart className="w-4 h-4 group-active:scale-120 transition-transform" />
                    <span>{post.likes ? post.likes.length : 0} Likes</span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <GoComment className="w-4 h-4" />
                    <span>{post.comments ? post.comments.length : 0} Comentarios</span>
                  </div>
                </div>
              </div>

              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                Comentarios ({post.comments ? post.comments.length : 0})
              </div>

              <div className="space-y-2">
                {post.comments && post.comments.length === 0 && (
                  <p className="text-xs text-gray-500 italic text-center py-4">No hay comentarios.</p>
                )}

                {post.comments && post.comments.length > 0 && (
                  <ul className="space-y-2">
                    {post.comments.map((comment) => (
                      <li key={comment.id} className="p-3 bg-gray-900/30 border border-gray-800 rounded-xl space-y-1">
                        <div className="flex justify-between items-center text-[11px] text-blue-400">
                          <span className="font-mono">User ID: {comment.user_id.substring(0, 8)}...</span>
                          <span className="text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-normal">{comment.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        {post && (
          <form onSubmit={submitComment} className="mt-3 mb-4 flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl p-2 focus-within:border-purple-500/50 transition-colors">
            <input 
              type="text" 
              placeholder="Escribe un comentario..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={commenting}
              className="flex-1 bg-transparent border-none text-xs text-gray-200 placeholder-gray-500 focus:outline-none px-2"
            />
            <button 
              type="submit" 
              disabled={commenting || !commentText.trim()}
              className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-purple-600 cursor-pointer disabled:cursor-not-allowed"
            >
              <GoPaperAirplane className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="bg-gradient-to-r from-blue-950/40 to-purple-950/40 border border-gray-800 rounded-xl p-3 flex justify-around text-gray-400 shadow-inner">
          <FaHome className="w-5 h-5 cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/')} />
          <GoSearch className="w-5 h-5 opacity-30 cursor-not-allowed" />
          <IoIosCreate className="w-5 h-5 cursor-pointer hover:text-white transition-colors" onClick={() => navigate(`/NewPost`)} />
          <FaGithub className="w-5 h-5 cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/')} />
        </div>

      </div>
    </div>
  );
};

export default Post;