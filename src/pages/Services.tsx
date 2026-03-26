import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Clock, CheckCircle2, MapPin } from 'lucide-react';

export default function Services() {
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
              <Link to="/services" className="text-sm font-medium text-yellow-400 transition-colors">Our Services</Link>
              <Link to="/contact" className="text-sm font-medium text-white/80 hover:text-yellow-400 transition-colors">Contact Us</Link>
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our <span className="text-yellow-400">Services</span></h1>
          <p className="text-xl text-white/60">
            Comprehensive care packages designed for every vehicle type and need.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {[
            { 
              title: 'Find a Center', 
              desc: 'Browse verified car wash centers near you', 
              icon: MapPin,
              features: ['Verified Centers', 'Location Based', 'User Reviews', 'Real-time Availability']
            },
            { 
              title: 'Book a Service', 
              desc: 'Request exterior wash, interior detailing, ceramic coating, and more', 
              icon: Star,
              features: ['Exterior Wash', 'Interior Detailing', 'Ceramic Coating', 'Engine Bay Cleaning']
            },
            { 
              title: 'Track Your Car', 
              desc: 'Follow your service status in real time', 
              icon: Clock,
              features: ['Live Status', 'Estimated Time', 'Service History', 'Digital Receipts']
            },
            { 
              title: 'Subscriptions & Offers', 
              desc: 'Access exclusive deals from your favorite centers', 
              icon: ShieldCheck,
              features: ['Monthly Plans', 'Loyalty Rewards', 'Special Discounts', 'Gift Cards']
            },
          ].map((service, i) => {
            const Icon = service.icon;
            return (
              <div key={i} className="bg-neutral-900 rounded-[32px] p-8 border border-white/5 hover:border-yellow-400/50 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                    <Icon size={24} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">{service.title}</h3>
                <p className="text-white/60 mb-6">{service.desc}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-white/80">
                      <CheckCircle2 size={16} className="text-yellow-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="block w-full text-center bg-white/10 hover:bg-yellow-400 hover:text-black text-white font-bold py-3 rounded-xl transition-colors">
                  Get Started
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="bg-neutral-900 rounded-[40px] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Ready to <span className="text-yellow-400">Shine?</span>
            </h2>
            <p className="text-lg text-white/60">
              Book your service today and experience the difference.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-yellow-400 text-black px-8 py-4 rounded-full font-bold hover:bg-white transition-colors">
              Get Started <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-yellow-400 text-black py-8 text-center text-sm font-medium opacity-80">
        © 2026 Clean Cars 360. All rights reserved.
      </footer>
    </div>
  );
}
