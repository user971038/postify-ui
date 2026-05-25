import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import useFetch from '../hooks/useFetch';

import { GoSearch, GoHeart, GoComment, GoPaperAirplane, GoChevronLeft, GoTrash, GoPencil, GoX, GoCheck } from "react-icons/go"; // 👈 Added edit icons
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

  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [updating, setUpdating] = useState(false);

  const currentUserId = "00000000-0000-0000-0000-000000000000"; 

  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUserId, post_id: postId })
      });
      if (res.ok) window.location.reload();
    } catch (error) {
      console.error(error);
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
        body: JSON.stringify({ content: commentText, user_id: currentUserId, post_id: postId })
      });
      if (res.ok) {
        setCommentText('');
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("¿Deseas eliminar esta publicación?");
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const startEditing = () => {
    setEditDescription(post.description);
    setIsEditing(true);
  };

  const handleUpdatePost = async () => {
    if (!editDescription.trim()) return;
    setUpdating(true);

    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: editDescription })
      });

      if (res.ok) {
        setIsEditing(false);
        window.location.reload();
      } else {
        alert("Error al actualizar la publicación");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[85vh] flex flex-col justify-between bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-purple-950/10">
        
        <div className="flex items-center justify-between mb-4 text-gray-400">
          <div className="flex items-center gap-2">
            <GoChevronLeft className="w-6 h-6 cursor-pointer hover:text-white transition-colors" onClick={() => navigate(-1)} />
            <span className="text-sm font-semibold tracking-wide uppercase">Detalles</span>
          </div>
          
          {post && !postLoading && (
            <div className="flex items-center gap-1">
              {!isEditing ? (
                <button 
                  onClick={startEditing}
                  className="text-gray-500 hover:text-blue-400 p-1.5 rounded-lg hover:bg-gray-900 transition-all cursor-pointer"
                  title="Editar Publicación"
                >
                  <GoPencil className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-900 transition-all cursor-pointer"
                  title="Cancelar Edición"
                >
                  <GoX className="w-4 h-4" />
                </button>
              )}

              <button 
                onClick={handleDeletePost}
                disabled={deleting}
                className="text-gray-500 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-950/20 transition-all disabled:opacity-40 cursor-pointer"
              >
                <GoTrash className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
        </div>

        <div className="h-[62vh] overflow-y-auto space-y-4 pr-1 custom-scrollbar flex-1">
          {postLoading && <p className="text-xs text-gray-500 animate-pulse text-center py-6">Cargando...</p>}
          {postError && <p className="text-xs text-red-400 text-center py-6">Error al cargar el post.</p>}
          
          {post && !postLoading && (
            <>
              <div className="p-4 bg-gray-900/60 border border-gray-800/80 rounded-xl space-y-3">
                
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      disabled={updating}
                      rows="3"
                      className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500/50 rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none resize-none leading-relaxed"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleUpdatePost}
                        disabled={updating || !editDescription.trim()}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-all active:scale-98 disabled:opacity-40 cursor-pointer"
                      >
                        <GoCheck className="w-3.5 h-3.5" />
                        {updating ? 'Guardando...' : 'Actualizar'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-200 leading-relaxed font-light">
                    {post.description}
                  </div>
                )}
                
                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {post.images.map((img) => (
                      <img key={img.id || img.url} src={img.url} alt="Post Attachment" className="max-h-[500px] max-w-full object-cover rounded-xl border border-gray-800/80" />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2 border-t border-gray-800/50 text-gray-400 text-xs">
                  <button onClick={handleLike} className="flex items-center gap-1.5 hover:text-red-400 transition-colors group">
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
                {post.comments && post.comments.length === 0 && <p className="text-xs text-gray-500 italic text-center py-4">No hay comentarios.</p>}
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
            <input type="text" placeholder="Escribe un comentario..." value={commentText} onChange={(e) => setCommentText(e.target.value)} disabled={commenting} className="flex-1 bg-transparent border-none text-xs text-gray-200 placeholder-gray-500 focus:outline-none px-2" />
            <button type="submit" disabled={commenting || !commentText.trim()} className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"><GoPaperAirplane className="w-3.5 h-3.5" /></button>
          </form>
        )}

        <div className="bg-gradient-to-r from-blue-950/40 to-purple-950/40 border border-gray-800 rounded-xl p-3 flex justify-around text-gray-400 shadow-inner">
          <FaHome className="w-5 h-5 cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/')} />
          <GoSearch className="w-5 h-5 opacity-30 cursor-not-allowed" />
          <IoIosCreate className="w-5 h-5 cursor-pointer hover:text-white transition-colors" onClick={() => navigate(`/NewPost`)} />
          <FaGithub className="w-5 h-5 cursor-pointer hover:text-white transition-colors" onClick={() => window.open("https://github.com/user971038?tab=repositories", "_blank")} />
        </div>

      </div>
    </div>
  );
};

export default Post;