import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServiceMenu from './components/ServiceMenu';
import Stylists from './components/Stylists';
import AboutAndDetails from './components/AboutAndDetails';
import BookingWizard from './components/BookingWizard';
import Chatbot from './components/Chatbot';
import HaircutVisualizer from './components/HaircutVisualizer';
import { Sparkles, Scissors, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedStylistId, setSelectedStylistId] = useState<string>('');

  const handleToggleService = (id: string) => {
    setSelectedServiceIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleClearServices = () => {
    setSelectedServiceIds([]);
  };

  const handleSelectStylist = (id: string | null) => {
    setSelectedStylistId(id || '');
  };

  return (
    <div id="apex-blade-app" className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] flex flex-col font-sans selection:bg-gold-500 selection:text-slate-950">
      
      {/* Top sticky branding navigation header and status */}
      <Header />

      {/* Main viewport */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-16">
        
        {/* Full-width brand experience and hero banner */}
        <Hero />

        {/* 2-Column Split Layout for exploration vs reservation scheduler */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
          
          {/* LEFT 7/12: Product showcases, stylists catalog, location & guidelines */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Interactive Haircut AI Lens Visualizer */}
            <section id="ai-lens-section" className="scroll-mt-24 transition-all">
              <HaircutVisualizer 
                selectedServiceIds={selectedServiceIds}
                onToggleService={handleToggleService}
              />
            </section>

            {/* Dynamic Service Catalog Menu */}
            <section id="menu-section" className="scroll-mt-24 transition-all">
              <ServiceMenu 
                selectedServiceIds={selectedServiceIds} 
                onToggleService={handleToggleService} 
              />
            </section>

            {/* Stylists and Professional Profiles */}
            <section id="stylists-section" className="scroll-mt-24 transition-all">
              <Stylists 
                selectedStylistId={selectedStylistId}
                onSelectStylist={handleSelectStylist}
              />
            </section>

            {/* Testimonials, Hours and Location Details */}
            <section id="about-section" className="scroll-mt-24 transition-all">
              <AboutAndDetails />
            </section>

          </div>

          {/* RIGHT 5/12: Sticky booking desk and transaction builder */}
          <div className="lg:col-span-5">
            <div id="booking-anchor" className="lg:sticky lg:top-28 scroll-mt-28 space-y-6">
              
              {/* Gold Title */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                  <Sparkles className="w-3.5 h-3.5" /> Fast Desk Reservation
                </span>
                <span className="text-[10px] text-slate-500">Gaithersburg, MD</span>
              </div>

              {/* Dynamic Interactive checkout booking desk card */}
              <BookingWizard 
                selectedServiceIds={selectedServiceIds}
                onToggleService={handleToggleService}
                onClearServices={handleClearServices}
                selectedStylistId={selectedStylistId}
                onSelectStylist={handleSelectStylist}
              />

            </div>
          </div>

        </div>

      </main>

      {/* Footer Details */}
      <footer id="main-footer" className="bg-slate-950/80 border-t border-slate-900 py-12 px-6 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1">
            <h4 className="font-display font-bold text-slate-300 text-sm tracking-wide uppercase">APEX &amp; BLADE</h4>
            <p className="text-slate-500 text-[11px] font-light">Gaithersburg's Premier Grooming Lounge • License #M3199923</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-slate-400 font-medium">
            <a href="#menu-section" className="hover:text-gold-400 transition-colors">Grooming Menu</a>
            <a href="#stylists-section" className="hover:text-gold-400 transition-colors">Our Barbers</a>
            <a href="#about-section" className="hover:text-gold-400 transition-colors">About &amp; Map</a>
          </div>
          <div className="text-center md:text-right space-y-0.5">
            <p>© 2026 Apex &amp; Blade. All rights reserved.</p>
            <p className="text-[10px] text-slate-600 font-light font-mono">Precision Grooming Parlor, Gaithersburg MD</p>
          </div>
        </div>
      </footer>

      {/* Floating Concierge Chatbot */}
      <Chatbot />

    </div>
  );
}
