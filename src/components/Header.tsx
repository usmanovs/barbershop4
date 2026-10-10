import React, { useState, useEffect } from 'react';
import { Scissors, Phone, MapPin, Clock, Calendar, ShieldCheck } from 'lucide-react';
import { SHOP_INFO } from '../data';

export default function Header() {
  const [isOpenNow, setIsOpenNow] = useState<boolean>(true);
  const [currentTimeText, setCurrentTimeText] = useState<string>('');

  useEffect(() => {
    // Determine opening state based on 2026-06-11 (Thursday) 09:02 AM
    const updateBusinessStatus = () => {
      const now = new Date(); // Browser time
      const day = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
      const hour = now.getHours();

      // Simple open checker
      if (day >= 1 && day <= 5) {
        // Monday - Friday: 9:00 AM - 8:00 PM
        setIsOpenNow(hour >= 9 && hour < 20);
      } else if (day === 6) {
        // Saturday: 9:00 AM - 6:00 PM
        setIsOpenNow(hour >= 9 && hour < 18);
      } else {
        // Sunday: 10:00 AM - 4:00 PM
        setIsOpenNow(hour >= 10 && hour < 16);
      }

      setCurrentTimeText(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    updateBusinessStatus();
    const interval = setInterval(updateBusinessStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-md border-b border-slate-900 px-4 md:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Brand Identity / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center shadow-lg border border-gold-300/20 text-slate-950">
            <Scissors className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-lg md:text-xl tracking-tight text-white leading-none uppercase">
                {SHOP_INFO.name}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isOpenNow 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {isOpenNow ? '● OPEN' : 'CLOSED'}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] md:text-xs mt-0.5 font-sans flex items-center gap-1 font-light">
              <MapPin className="w-3 h-3 text-gold-400" />
              Gaithersburg, MD • Suite 4
            </p>
          </div>
        </div>

        {/* Local Metadata and Fast Contact Details */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 justify-center text-xs">
          {/* Shop Hours Status */}
          <div className="hidden md:flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            <span>Today's Hours: <strong className="text-slate-100 font-medium">9 AM - 8 PM</strong></span>
          </div>

          {/* Clean phone hook */}
          <a
            id="header-call-btn" 
            href={`tel:${SHOP_INFO.phone.replace(/[^0-9]/g, '')}`} 
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-gold-500/30 rounded-xl text-slate-300 font-medium transition-all group"
          >
            <Phone className="w-3.5 h-3.5 text-gold-400 group-hover:scale-110 transition-transform" />
            <span className="font-mono text-slate-100">{SHOP_INFO.phone}</span>
          </a>

          {/* Book Direct Jump */}
          <a 
            id="header-nav-book-btn"
            href="#booking-anchor" 
            className="px-4 py-1.5 md:py-2 bg-gold-600 hover:bg-gold-500 hover:shadow-lg text-slate-950 font-bold uppercase text-[10px] tracking-wider rounded-xl transition-all"
          >
            Book Now
          </a>
        </div>

      </div>
    </header>
  );
}
