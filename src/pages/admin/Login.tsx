import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('token', 'admin-token');
    localStorage.setItem('user', JSON.stringify({ role: 'super_admin' }));
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="card w-full max-w-[400px] mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <img 
              src="https://carwash-h7df.vercel.app/assets/icon.png" 
              alt="Clean Cars 360 Icon" 
              className="h-12 w-12 object-contain"
            />
            <img 
              src="https://i.ibb.co/0VjChkSD/1000071664-removebg-preview.png" 
              alt="360Cars" 
              className="h-12 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Super Admin</h1>
          <p className="text-slate-400 text-sm">Access dashboard instantly</p>
        </div>

        <button 
          onClick={handleLogin}
          className="w-full py-3 mt-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold transition-colors"
        >
          Access Panel
        </button>
      </div>
    </div>
  );
}