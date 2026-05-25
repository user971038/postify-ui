import { Routes, Route } from 'react'
import Home from './views/Home'
import Profile from './views/Profile'
import './App.css'

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

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
          throw new Error(`Status: ${res.status}`);
        }
        
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error de conexión:", error);
        setDbError("No se pudo conectar a la base de datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndCheckDb();
  }, []);

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-purple-950/20">
        
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Postify
          </h1>
        </header>

        <main className="mb-8">
          <h2 className="text-sm font-semibold text-gray-400 mb-4 tracking-wide uppercase">Perfiles Disponibles</h2>

          {loading && (
            <div className="space-y-2">
              <div className="h-12 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
              <div className="h-12 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
            </div>
          )}

          {dbError && (
            <div className="p-4 bg-red-950/30 border border-red-800 text-red-400 rounded-xl text-sm">
              <strong>⚠️ Error de Conexión:</strong> {dbError}
            </div>
          )}

          {!loading && !dbError && users.length === 0 && (
            <p className="text-sm text-gray-500 italic text-center py-4">No hay perfiles disponibles.</p>
          )}

          {!loading && !dbError && users.length > 0 && (
            <ul className="space-y-2.5">
              {users.map((user) => (
                <li 
                  key={user.id} 
                  onClick={() => navigate(`/profile/${user.id}`)}
                  className="p-3.5 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-purple-500/50 hover:bg-gray-900 cursor-pointer transition-all duration-200 flex justify-between items-center group"
                >
                  <span className="font-medium text-gray-200 group-hover:text-white transition-colors">{user.username}</span>
                  <span className="text-xs text-blue-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">Ver Perfil →</span>
                </li>
              ))}
            </ul>
          )}
        </main>

        <footer>
          <button 
            onClick={() => navigate('/NewProfile')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-purple-900/30 active:scale-[0.99]"
          >
            ➕ Crear Nuevo Perfil
          </button>
        </footer>

      </div>
    </div>
  );
}

export default App;