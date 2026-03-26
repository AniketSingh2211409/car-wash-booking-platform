import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export default function About() {
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
              <Link to="/about" className="text-sm font-medium text-yellow-400 transition-colors">About Us</Link>
              <Link to="/services" className="text-sm font-medium text-white/80 hover:text-yellow-400 transition-colors">Our Services</Link>
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About <span className="text-yellow-400">Us</span></h1>
          <p className="text-xl text-white/60">
            We are redefining car care with convenience, quality, and passion.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2300&auto=format&fit=crop" 
              alt="Our Story" 
              className="rounded-[32px] w-full object-cover aspect-[4/3]"
            />
            <div className="absolute -bottom-8 -right-8 bg-yellow-400 text-black p-8 rounded-[32px] hidden md:block">
              <p className="text-4xl font-bold mb-1">10+</p>
              <p className="font-medium text-sm uppercase tracking-wider">Years Experience</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Driven by Passion, <br />
              Defined by <span className="text-yellow-400">Quality</span>
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">
              Clean Cars 360 started with a simple mission: to make premium car detailing accessible and convenient for everyone. We understand that your car is more than just a vehicle; it's an investment and a reflection of your lifestyle.
            </p>
            <p className="text-lg text-white/60 leading-relaxed">
              Our team of certified professionals uses industry-leading techniques and eco-friendly products to ensure your vehicle receives the best care possible, right at your doorstep.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-neutral-900 p-6 rounded-[24px] border border-white/5">
                <ShieldCheck size={32} className="text-yellow-400 mb-4" />
                <h3 className="font-bold mb-2">Trusted & Vetted</h3>
                <p className="text-sm text-white/50">Every detailer undergoes rigorous background checks and training.</p>
              </div>
              <div className="bg-neutral-900 p-6 rounded-[24px] border border-white/5">
                <Clock size={32} className="text-yellow-400 mb-4" />
                <h3 className="font-bold mb-2">On Your Schedule</h3>
                <p className="text-sm text-white/50">Book instantly and get service at your preferred time and location.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Excellence', desc: 'We never compromise on quality. Every wash is a masterpiece.' },
            { title: 'Convenience', desc: 'We bring the service to you, saving you time and hassle.' },
            { title: 'Sustainability', desc: 'We use water-efficient methods and eco-friendly products.' },
          ].map((value, i) => (
            <div key={i} className="bg-neutral-900 p-8 rounded-[32px] border border-white/5 hover:border-yellow-400/50 transition-colors">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black mb-6">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
              <p className="text-white/60">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="bg-neutral-900 rounded-[40px] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Experience the <span className="text-yellow-400">Difference</span>
            </h2>
            <p className="text-lg text-white/60">
              Join thousands of satisfied customers who trust Clean Cars 360.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-yellow-400 text-black px-8 py-4 rounded-full font-bold hover:bg-white transition-colors">
              Book Now <ArrowRight size={20} />
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
