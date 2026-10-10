import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Star, Compass, ArrowUpRight } from 'lucide-react';
import { SHOP_INFO, TESTIMONIALS } from '../data';

export default function AboutAndDetails() {
  return (
    <div id="about-details-layout" className="space-y-12">
      
      {/* 2-Column Section (Hours on left, map on right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Contact and Hours */}
        <div id="contact-details" className="space-y-6">
          <div>
            <h3 className="font-serif font-semibold text-2xl md:text-3xl text-slate-100">Location &amp; Hours</h3>
            <p className="text-slate-400 text-xs mt-1">Visit our quiet luxury lounge in Gaithersburg, located convenient to Perry Parkway and I-270.</p>
          </div>

          <div className="space-y-4">
            {/* Address */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-gold-400 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">Address</span>
                <a 
                  id="link-address"
                  href={SHOP_INFO.googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-200 text-xs sm:text-sm font-medium hover:text-gold-400 transition-colors flex items-center gap-1 mt-0.5"
                >
                  {SHOP_INFO.address}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-gold-400 flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">Phone</span>
                <a 
                  href={`tel:${SHOP_INFO.phone.replace(/[^0-9]/g, '')}`} 
                  className="text-slate-200 text-xs sm:text-sm font-mono font-medium hover:text-gold-400 transition-colors mt-0.5 block"
                >
                  {SHOP_INFO.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-gold-400 flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">Email</span>
                <a 
                  href={`mailto:${SHOP_INFO.email}`} 
                  className="text-slate-200 text-xs sm:text-sm font-medium hover:text-gold-400 transition-colors mt-0.5 block"
                >
                  {SHOP_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Operating hours table */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              Official Business Hours
            </h4>
            <div className="space-y-2 text-xs">
              {SHOP_INFO.hours.map((h, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-slate-800/20 last:border-0 text-slate-300">
                  <span>{h.day}</span>
                  <span className="font-medium text-slate-100">{h.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Google Maps Iframe */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 flex flex-col h-[340px] min-h-[300px] md:h-auto bg-slate-950/30">
          <div className="absolute inset-0 w-full h-full">
            <iframe 
              title="Apex & Blade Premium Barbershop Location"
              src="https://maps.google.com/maps?q=202%20Perry%20Pkwy%2C%20Suite%204%2C%20Gaithersburg%2C%20MD%2020877&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              className="w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="relative z-10 p-4 m-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl max-w-[240px] self-start mt-auto shadow-xl">
            <h4 className="font-display font-medium text-gold-300 text-xs uppercase tracking-wider">Perfect Parking</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-light">
              Located off Perry Parkway, we offer plenty of dedicated storefront parking for quick access.
            </p>
          </div>
        </div>

      </div>

      {/* Customer testimonials */}
      <div id="customer-testimonials" className="pt-6 border-t border-slate-800/40">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <h3 className="font-serif font-semibold text-2xl md:text-3xl text-slate-100">Highly Recommended</h3>
          <p className="text-slate-400 text-xs">Read honest feedback from verified Montgomery County residents who've made {SHOP_INFO.name} their home lounge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-4 shadow-sm flex flex-col justify-between">
              
              <div className="space-y-2">
                {/* 5-star rating */}
                <div className="flex gap-1 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                
                <p className="text-slate-300 text-xs leading-relaxed font-light italic">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/40 flex justify-between items-center text-[10px] text-slate-500">
                <div>
                  <h5 className="font-bold text-slate-300">{t.author}</h5>
                  <span className="text-slate-500 font-normal">{t.location}</span>
                </div>
                <span className="font-mono text-[9px]">{t.date}</span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
