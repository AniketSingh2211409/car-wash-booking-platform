import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Car,
  ArrowRight
} from 'lucide-react';
import { NewHero } from '../components/landing/NewHero';
import { CustomerHome } from '../components/landing/CustomerHome';
import { NewFooter } from '../components/landing/NewFooter';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [audience, setAudience] = useState<'INDIVIDUALS' | 'BUSINESSES'>('INDIVIDUALS');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleOpenLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-sans selection:bg-brand-yellow selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="https://carwash-h7df.vercel.app/assets/icon.png" 
                alt="Clean Cars 360 Icon" 
                className="h-10 w-10 object-contain"
              />
              <img 
                src="https://i.ibb.co/0VjChkSD/1000071664-removebg-preview.png" 
                alt="360Cars" 
                className="h-8 object-contain"
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-sm font-medium text-white/80 hover:text-brand-yellow transition-colors">Home</a>
              <a href="#features" className="text-sm font-medium text-white/80 hover:text-brand-yellow transition-colors">Features</a>
              <a href="#centers" className="text-sm font-medium text-white/80 hover:text-brand-yellow transition-colors">Centers</a>
              <Link to="/login" className="text-sm font-medium text-white/80 hover:text-brand-yellow transition-colors">Login</Link>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link 
                to="/register" 
                className="bg-brand-yellow text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black border-t border-white/10 p-4 space-y-4">
            <a href="#home" className="block text-white/80 hover:text-brand-yellow" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#features" className="block text-white/80 hover:text-brand-yellow" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#centers" className="block text-white/80 hover:text-brand-yellow" onClick={() => setIsMenuOpen(false)}>Centers</a>
            <Link to="/login" className="block text-white/80 hover:text-brand-yellow" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link 
              to="/register" 
              className="block w-full text-center bg-brand-yellow text-black px-6 py-3 rounded-full font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>

      <main>
        <ErrorBoundary silent={true}>
          <NewHero 
            audience={audience} 
            setAudience={setAudience} 
            onOpenLogin={handleOpenLogin} 
          />
        </ErrorBoundary>

        <ErrorBoundary silent={true}>
          <CustomerHome 
            audience={audience} 
            setAudience={setAudience} 
            onOpenLogin={handleOpenLogin}
            searchQuery={searchQuery}
          />
        </ErrorBoundary>

        {/* Business CTA Banner */}
        <section className="w-full bg-gradient-to-r from-[#C9A227] via-[#D4B133] to-[#E5C158] py-16 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-950">
                Do you own a car wash? Join 360Cars now
              </h2>
              <p className="text-zinc-800 font-medium">
                Join over 500+ car wash owners across the kingdom.
              </p>
            </div>
            <button 
              onClick={handleOpenLogin}
              className="w-full md:w-auto bg-zinc-950 text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-900 transition-colors group"
            >
              Start Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>

      <NewFooter />
    </div>
  );
}
