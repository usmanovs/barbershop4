import React from 'react';
import { Star, ShieldCheck, Sparkles, Heart } from 'lucide-react';
import { STYLISTS } from '../data';

interface StylistsProps {
  selectedStylistId: string;
  onSelectStylist: (id: string) => void;
}

export default function Stylists({ selectedStylistId, onSelectStylist }: StylistsProps) {
  return (
    <div id="barber-stylists-layout" className="space-y-6">
      
      <div>
        <h3 className="font-serif font-semibold text-2xl md:text-3xl text-slate-100">Our Master Artisans</h3>
        <p className="text-slate-400 text-xs mt-1">
          Every advisor at {`Apex & Blade`} is fully licensed, holds multi-year specialized training, and is dedicated strictly to client perfection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STYLISTS.map(stylist => {
          const isSelected = selectedStylistId === stylist.id;
          return (
            <div 
              id={`stylist-card-${stylist.id}`}
              key={stylist.id}
              className={`rounded-2xl border overflow-hidden transition-all flex flex-col justify-between ${
                isSelected 
                  ? 'border-gold-500 bg-gold-600/[0.03] shadow-md' 
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
              }`}
            >
              
              {/* Photo Area */}
              <div className="relative h-44 w-full">
                <img 
                  src={stylist.image} 
                  alt={stylist.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151c2d] via-transparent to-transparent opacity-80" />
                
                {/* Rating overlay banner */}
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2 py-1 rounded-lg text-[10px] font-mono text-slate-200 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                  <span>{stylist.rating} ({stylist.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Text Meta info */}
              <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="font-display font-medium text-slate-200 text-sm md:text-base leading-tight">
                      {stylist.name}
                    </h4>
                    <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-amber-500 uppercase tracking-widest leading-none">
                      {stylist.role.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-500/80 italic font-sans mt-0.5">{stylist.role}</p>

                  <p className="text-slate-400 text-xs mt-3 leading-relaxed font-light">
                    {stylist.bio}
                  </p>
                </div>

                {/* Specialties pills list */}
                <div className="space-y-4 pt-3 border-t border-slate-800/40">
                  <div className="flex flex-wrap gap-1.5">
                    {stylist.specialties.map((spec, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-0.5 bg-slate-950/80 border border-slate-800/60 rounded text-[9px] text-slate-300 font-mono font-light"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Fast selection CTA */}
                  <button
                    id={`btn-select-stylist-${stylist.id}`}
                    onClick={() => {
                      onSelectStylist(stylist.id);
                      // Scroll to booking area smoothly
                      const anchor = document.getElementById('booking-anchor');
                      if (anchor) {
                        anchor.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected 
                        ? 'bg-gold-600 text-slate-950 shadow-lg font-bold' 
                        : 'bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-gold-500/30 text-slate-300'
                    }`}
                  >
                    <span>{isSelected ? '★ Selected Barber' : 'Select For Booking'}</span>
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
