import React, { useState } from 'react';
import { Scissors, Sparkles, Clock, Plus, Minus, Search, ToggleLeft } from 'lucide-react';
import { Service } from '../types';
import { SERVICES } from '../data';

interface ServiceMenuProps {
  selectedServiceIds: string[];
  onToggleService: (id: string) => void;
}

export default function ServiceMenu({ selectedServiceIds, onToggleService }: ServiceMenuProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'haircuts' | 'shaves' | 'treatment'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering services based on selected Category and search queries if any
  const filteredServices = SERVICES.filter(service => {
    const matchesTab = activeTab === 'all' || service.category === activeTab;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div id="services-catalog-menu" className="space-y-6">
      
      {/* Category selector pill and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-semibold text-2xl md:text-3xl text-slate-100">Grooming Menu</h3>
          <p className="text-slate-400 text-xs mt-1">Select from our signature hair architecture, hot towel shaves, or facial treatments.</p>
        </div>

        {/* Mini Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950/60 border border-slate-800 focus:border-gold-500 text-xs px-9 py-2 rounded-xl text-slate-300 w-full sm:w-48 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {(['all', 'haircuts', 'shaves', 'treatment'] as const).map(tab => {
          const lNames = {
            all: 'View All Menu',
            haircuts: '精密 Haircuts',
            shaves: 'Royal Shaves',
            treatment: 'Skin Therapy'
          };
          const isSelected = activeTab === tab;
          return (
            <button
              id={`tab-filter-${tab}`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-display uppercase tracking-wider text-[10px] font-semibold rounded-full border transition-all cursor-pointer flex-shrink-0 ${
                isSelected 
                  ? 'bg-gold-600/10 border-gold-500 text-amber-300' 
                  : 'bg-slate-950/20 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {lNames[tab]}
            </button>
          );
        })}
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.length > 0 ? (
          filteredServices.map(service => {
            const isSelected = selectedServiceIds.includes(service.id);
            return (
              <div 
                id={`service-item-${service.id}`}
                key={service.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between hover:shadow-lg ${
                  isSelected 
                    ? 'border-gold-400/50 bg-gold-600/[0.04]' 
                    : 'border-slate-800 bg-slate-900/40'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="font-display font-medium text-sm md:text-base text-slate-100 flex items-center gap-2">
                      {service.name}
                      {service.price >= 100 && (
                        <span className="bg-gold-600/10 text-gold-300 border border-gold-500/20 text-[9px] uppercase px-1.5 py-0.5 rounded-full font-bold">VIP Pack</span>
                      )}
                    </h4>
                    <span className="font-mono text-sm md:text-base font-bold text-gold-300">${service.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-1">
                    <Clock className="w-3 h-3 text-gold-400/50" />
                    <span>{service.duration} minutes of pampering</span>
                  </div>

                  <p className="text-slate-400 text-xs mt-3 leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/40 flex justify-end">
                  <button
                    id={`add-btn-${service.id}`}
                    onClick={() => onToggleService(service.id)}
                    className={`py-2 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected 
                        ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20' 
                        : 'bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-gold-500/30 text-slate-300'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Minus className="w-3 h-3" />
                        <span>Remove Service</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 text-gold-400" />
                        <span>Add To Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
            <p className="text-slate-500 text-xs">No services match your search or filter.</p>
          </div>
        )}
      </div>

    </div>
  );
}
