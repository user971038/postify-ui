import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { GoChevronLeft } from "react-icons/go";
import { FaUserPlus } from "react-icons/fa";

const NewProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    lastname: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Error al crear el perfil');
      }

      const newUser = await res.json();
      console.log('User created:', newUser);

      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Ocurrió un error inesperado de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-purple-950/10">
        
        <div className="flex items-center gap-2 mb-6 text-gray-400">
          <GoChevronLeft className="w-6 h-6 cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/')} />
          <span className="text-sm font-semibold tracking-wide uppercase">Nuevo Registro</span>
        </div>

        <header className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2.5 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            <FaUserPlus className="text-blue-400 w-6 h-6" /> Crear Perfil
          </h1>
          <p className="text-xs text-gray-500 mt-1">Regístrate para comenzar a publicar en Postify.</p>
        </header>

        {error && (
          <div className="mb-4 p-3.5 bg-red-950/30 border border-red-800 text-red-400 rounded-xl text-xs">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1.5 pl-1">Username</label>
            <input
              type="text"
              name="username"
              required
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1.5 pl-1">Nombre</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1.5 pl-1">Apellido</label>
              <input
                type="text"
                name="lastname"
                required
                placeholder="Apellido"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1.5 pl-1">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              required
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1.5 pl-1">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-purple-900/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Confirmar Registro'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default NewProfile;