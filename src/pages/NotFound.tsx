import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-black">
      <div className="w-20 h-20 bg-neutral-900 text-yellow-400 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
        <Car size={40} />
      </div>
      <h1 className="text-4xl font-black mb-2 text-white">404</h1>
      <p className="text-slate-400 mb-8 max-w-xs">Oops! The page you're looking for has been washed away.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
