import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { GoChevronLeft, GoPlus } from "react-icons/go";
import { IoImageOutline } from "react-icons/io5";

const NewPost = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [userExists, setUserExists] = useState(true);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch(`http://localhost:8000/users/${userId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setUserExists(false);
            throw new Error("El usuario que intenta publicar no existe.");
          }
          throw new Error("Error al verificar la identidad del usuario.");
        }
        const userData = await res.json();
        setUsername(userData.username);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    if (userId) verifyUser();
  }, [userId]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const localPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(localPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userExists) {
      setError("No se puede publicar. Este perfil de usuario no es válido.");
      return;
    }

    if (!description.trim() && files.length === 0) {
      setError("La publicación no puede estar completamente vacía.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('description', description);
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const res = await fetch('http://localhost:8000/posts', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Error al guardar la publicación.');
      }

      const newPost = await res.json();
      console.log('Post created successfully:', newPost);

      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-purple-950/10">
        
        <div className="flex items-center gap-2 mb-6 text-gray-400">
          <GoChevronLeft className="w-6 h-6 cursor-pointer hover:text-white transition-colors" onClick={() => navigate(-1)} />
          <span className="text-sm font-semibold tracking-wide uppercase">Nueva Publicación</span>
        </div>

        {username && !error && (
          <div className="mb-4 text-xs text-purple-400 font-medium pl-1">
            Publicando como: <span className="text-white font-bold">@{username}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3.5 bg-red-950/30 border border-red-800 text-red-400 rounded-xl text-xs">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2 pl-1">¿Qué estás pensando?</label>
            <textarea
              required
              disabled={!userExists}
              rows="4"
              placeholder={userExists ? "Escribe el contenido de tu publicación aquí..." : "Acción deshabilitada - Usuario inválido"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none leading-relaxed disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2 pl-1">Adjuntar Imágenes</label>
            
            <div className={`relative border border-dashed border-gray-800 rounded-xl p-4 transition-colors flex flex-col items-center justify-center group ${userExists ? 'hover:border-purple-500/40 bg-gray-900/30 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}>
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={!userExists}
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10 disabled:cursor-not-allowed"
              />
              <IoImageOutline className="w-6 h-6 text-gray-500 group-hover:text-purple-400 transition-colors mb-1.5" />
              <span className="text-xs text-gray-400 font-medium">Seleccionar archivos</span>
              <span className="text-[10px] text-gray-600 mt-0.5">Sube una o varias imágenes</span>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3 p-2 bg-gray-900/40 border border-gray-900 rounded-xl">
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Preview allocation"
                    className="w-full h-20 object-cover rounded-lg border border-gray-800"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !userExists}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-purple-900/20 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <GoPlus className="w-4 h-4" />
            {loading ? 'Subiendo contenido...' : 'Publicar'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default NewPost;