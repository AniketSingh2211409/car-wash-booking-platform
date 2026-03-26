import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-400 selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
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
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-white/80 hover:text-yellow-400 transition-colors">Home</Link>
              <Link to="/about" className="text-sm font-medium text-white/80 hover:text-yellow-400 transition-colors">About Us</Link>
              <Link to="/services" className="text-sm font-medium text-white/80 hover:text-yellow-400 transition-colors">Our Services</Link>
              <Link to="/contact" className="text-sm font-medium text-yellow-400 transition-colors">Contact Us</Link>
            </div>
            <div className="hidden md:block">
              <Link to="/login" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-yellow-400 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in <span className="text-yellow-400">Touch</span></h1>
          <p className="text-xl text-white/60">
            Have questions? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="bg-neutral-900 p-8 rounded-[32px] border border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email Us</h3>
                  <p className="text-white/60">hello@cleancars360.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Call Us</h3>
                  <p className="text-white/60">+966 50 123 4567</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Visit Us</h3>
                  <p className="text-white/60">Riyadh, Saudi Arabia</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 p-8 rounded-[32px] border border-white/5">
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors">X</a>
                <a href="#" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors">In</a>
                <a href="#" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors">Fb</a>
              </div>
            </div>
          </div>

          <form className="bg-neutral-900 p-8 rounded-[32px] border border-white/5 space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
              <input type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <input type="email" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Message</label>
              <textarea rows={4} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400" placeholder="How can we help?"></textarea>
            </div>
            <button type="submit" className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
              Send Message <Send size={20} />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-yellow-400 text-black py-8 text-center text-sm font-medium opacity-80">
        © 2026 Clean Cars 360. All rights reserved.
      </footer>
    </div>
  );
}
