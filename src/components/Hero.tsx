import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Award, ShieldCheck, CheckCircle, ThumbsUp } from 'lucide-react';
import { SHOP_INFO } from '../data';

export default function Hero() {
  return (
    <div id="hero-section" className="relative h-[480px] lg:h-[520px] rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl mb-12">
      
      {/* Background Image with Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0 select-none">
        <img 
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80" 
          alt="Apex & Blade Premium Barbershop" 
          className="w-full h-full object-cover scale-105 filter brightness-[0.35]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/70 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-slate-950/40 to-transparent z-10" />
        
        {/* Elegant Sophisticated Dark Watermark Text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-serif font-black text-[120px] md:text-[180px] lg:text-[230px] text-white opacity-[0.03] select-none tracking-widest pointer-events-none z-10">
          MD
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 h-full max-w-4xl mx-auto px-6 md:px-12 flex flex-col justify-center text-left">
        
        {/* Top Gold Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 self-start px-3 py-1 bg-gold-600/10 border border-gold-500/20 rounded-full text-[11px] text-gold-300 font-semibold tracking-wider uppercase mb-5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Award-Winning Shaves &amp; Styles</span>
        </motion.div>

        {/* Catchy Header */}
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif font-semibold text-3xl md:text-5xl lg:text-6xl text-slate-100 leading-tight tracking-tight mb-4"
        >
          Grooming Crafted for the <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-amber-400 to-gold-500 font-serif italic text-amber-200">Modern Gentleman</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-slate-400 text-xs md:text-base leading-relaxed max-w-xl mb-8"
        >
          Experience precise scissor engineering, tailored skin fades, and traditional straight razor shaves at {SHOP_INFO.name}. Nestled in Gaithersburg, MD, we serve as the premier choice for Kentlands, Crown, and Montgomery County locals seeking a refined touch.
        </motion.p>

        {/* Feature Icons Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800/40 pt-6 max-w-2xl text-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-600/10 flex items-center justify-center border border-gold-400/20 text-gold-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">Master Barbers</h4>
              <p className="text-slate-400 text-[10px]">12+ Yrs Average Exp</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-600/10 flex items-center justify-center border border-gold-400/20 text-gold-400">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">Classic Standard</h4>
              <p className="text-slate-400 text-[10px]">Hot Towels &amp; Espresso</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-600/10 flex items-center justify-center border border-gold-400/20 text-gold-400">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">5.0 Star Rated</h4>
              <p className="text-slate-400 text-[10px]">Rated #1 in Gaithersburg</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
