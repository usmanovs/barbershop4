import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, Clock, User, Calendar as CalendarIcon, 
  CheckCircle2, Plus, ArrowRight, CornerDownRight, 
  Sparkles, Coffee, Phone, PhoneCall, Trash2 
} from 'lucide-react';
import { Service, Stylist, Booking } from '../types';
import { STYLISTS, TIME_SLOTS, SERVICES, SHOP_INFO } from '../data';

interface BookingWizardProps {
  selectedServiceIds: string[];
  onToggleService: (id: string) => void;
  onClearServices: () => void;
  selectedStylistId: string;
  onSelectStylist: (id: string | null) => void;
}

export default function BookingWizard({
  selectedServiceIds,
  onToggleService,
  onClearServices,
  selectedStylistId,
  onSelectStylist
}: BookingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Schedule, 2: Details, 3: Confirmed
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  
  const [recentBooking, setRecentBooking] = useState<Booking | null>(null);
  const [availableDates, setAvailableDates] = useState<{ dateString: string; dayName: string; dayNum: number; dayOfMonth: number }[]>([]);

  // Calculate dynamic pricing and duration details
  const selectedServices = SERVICES.filter(s => selectedServiceIds.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  // Initialize dates: Next 7 days starting today (June 11, 2026 based on metadata)
  useEffect(() => {
    const dates = [];
    // Start from local metadata time: June 11, 2026
    const baseDate = new Date("2026-06-11T09:02:54-07:00");
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dayVal = String(d.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${dayVal}`;

      dates.push({
        dateString,
        dayName: days[d.getDay()],
        dayNum: d.getDay(),
        dayOfMonth: d.getDate()
      });
    }
    
    setAvailableDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0].dateString);
    }
  }, []);

  // Sync stylist availability based on chosen date's day of week
  const matchedStylist = STYLISTS.find(s => s.id === selectedStylistId);
  const activeDateInfo = availableDates.find(d => d.dateString === selectedDate);
  const isStylistAvailableOnDay = matchedStylist && activeDateInfo 
    ? matchedStylist.availableDays.includes(activeDateInfo.dayNum) 
    : true;

  // Load existing booking from localStorage if any
  useEffect(() => {
    const saved = localStorage.getItem('apex_blade_last_booking');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentBooking(parsed);
        setStep(3);
      } catch (err) {
        console.error("Failed to restore booking", err);
      }
    }
  }, []);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedDate || !selectedTime || selectedServiceIds.length === 0) {
      return;
    }

    const newBooking: Booking = {
      id: "AB-" + Math.floor(100000 + Math.random() * 900000),
      customerName,
      customerEmail,
      customerPhone,
      stylistId: selectedStylistId || STYLISTS[0].id, // fallback to first
      serviceIds: selectedServiceIds,
      date: selectedDate,
      time: selectedTime,
      notes: customerNotes,
      totalAmount: totalPrice,
      totalDuration: totalDuration,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('apex_blade_last_booking', JSON.stringify(newBooking));
    setRecentBooking(newBooking);
    setStep(3);
  };

  const handleCancelBooking = () => {
    localStorage.removeItem('apex_blade_last_booking');
    setRecentBooking(null);
    setStep(1);
    onClearServices();
    onSelectStylist(null);
    setSelectedTime('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCustomerNotes('');
  };

  // Render Confirmed booking pass (Ticket UI)
  if (step === 3 && recentBooking) {
    const barber = STYLISTS.find(s => s.id === recentBooking.stylistId) || STYLISTS[0];
    const bServices = SERVICES.filter(s => recentBooking.serviceIds.includes(s.id));
    
    // Format date beautifully
    const dateParts = recentBooking.date.split('-');
    const formattedDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]))
      .toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

    return (
      <motion.div 
        id="booking-ticket shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full bg-slate-900 border-2 border-gold-400/40 rounded-3xl overflow-hidden shadow-2xl text-slate-100"
      >
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-gold-600 to-gold-800 px-6 py-6 text-center border-b border-gold-500/20">
          <div className="inline-flex p-3 bg-slate-950/40 rounded-full mb-3 text-gold-200">
            <CheckCircle2 className="w-8 h-8 text-gold-300 animate-pulse" />
          </div>
          <h3 className="font-display font-semibold text-2xl tracking-wide text-slate-50">Reservation Confirmed</h3>
          <p className="text-gold-200 text-xs mt-1 font-mono uppercase tracking-widest">Pass Code: {recentBooking.id}</p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-6 relative">
          {/* Aesthetic punch hole circles for movie ticket effect */}
          <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-[#0b0c10] rounded-full border-r border-gold-400/20"></div>
          <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-[#0b0c10] rounded-full border-l border-gold-400/20"></div>

          {/* Customer Greeting */}
          <div className="text-center pb-4 border-b border-slate-800/60">
            <p className="text-slate-400 text-sm">We're excited to see you,</p>
            <h4 className="font-display text-xl font-medium text-amber-100 mt-1">{recentBooking.customerName}</h4>
            <div className="flex justify-center items-center gap-1 mt-2 text-xs text-amber-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complimentary organic espresso or beverage included</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs sm:text-sm font-sans">
            <div>
              <span className="text-slate-500 block text-xs uppercase tracking-wider font-medium">Barber / Stylist</span>
              <div className="flex items-center gap-2 mt-1">
                <img 
                  src={barber.image} 
                  alt={barber.name} 
                  className="w-7 h-7 rounded-full object-cover border border-gold-400/40"
                  referrerPolicy="no-referrer"
                />
                <span className="font-medium text-slate-200">{barber.name}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 block text-xs uppercase tracking-wider font-medium">Time Window</span>
              <div className="mt-1">
                <span className="font-medium text-slate-200 block">{recentBooking.time}</span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {recentBooking.totalDuration} mins
                </span>
              </div>
            </div>

            <div className="col-span-2">
              <span className="text-slate-500 block text-xs uppercase tracking-wider font-medium">Date Selected</span>
              <span className="font-medium text-slate-100 mt-0.5 block">{formattedDate}</span>
            </div>

            <div className="col-span-2 pb-4 border-b border-slate-800/60">
              <span className="text-slate-500 block text-xs uppercase tracking-wider font-medium mb-1">Services Curated</span>
              <div className="space-y-1">
                {bServices.map(s => (
                  <div key={s.id} className="flex justify-between items-center text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-200">
                      <Scissors className="w-3 h-3 text-gold-400" />
                      {s.name}
                    </span>
                    <span className="text-gold-300 font-mono">${s.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Totals Pin */}
          <div className="flex justify-between items-center bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 text-xs block">Estimated Price</span>
              <span className="text-slate-500 text-[10px] block font-light">Pay at shop after service</span>
            </div>
            <span className="text-2xl font-mono text-gold-400 font-bold">${recentBooking.totalAmount}</span>
          </div>

          {/* Barcode representation */}
          <div className="text-center pt-2 space-y-2">
            <div className="inline-block bg-white p-2 rounded-lg opacity-80 select-none">
              {/* Custom barcode pattern visual */}
              <div className="flex gap-[2px] items-center h-10 w-44 bg-white">
                {[1,3,1,2,4,2,1,3,2,1,4,1,2,3,1,2,1,4,2,3,1,2,1,3].map((w, index) => (
                  <div 
                    key={index} 
                    className="bg-black h-full" 
                    style={{ width: `${w * 1.5}px` }}
                  />
                ))}
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{SHOP_INFO.address}</p>
          </div>
        </div>

        {/* Ticket Footer Action */}
        <div className="bg-slate-950/80 p-4 flex gap-2 border-t border-slate-800/80">
          <button 
            id="btn-cancel-reservation"
            onClick={handleCancelBooking}
            className="flex-1 py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-all text-xs font-medium uppercase tracking-wider cursor-pointer"
          >
            Cancel Appointment
          </button>
          <a 
            id="btn-directions-link"
            href={SHOP_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 rounded-xl bg-gold-600 hover:bg-gold-500 text-slate-950 transition-all text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-1"
          >
            Get Route
          </a>
        </div>
      </motion.div>
    );
  }

  // Fallback: If no services are selected yet, render a gorgeous prompt
  if (selectedServiceIds.length === 0) {
    return (
      <div 
        id="wizard-empty-state"
        className="w-full bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 text-center space-y-6 flex flex-col justify-center items-center min-h-[400px] shadow-lg"
      >
        <div className="w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center border border-gold-400/20 text-gold-400">
          <Scissors className="w-7 h-7" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="font-display font-medium text-lg text-slate-200">Start Your Reservation</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Select one or more services from our premium menu to begin curating your custom styling experience.
          </p>
        </div>
        <div className="border border-gold-400/10 rounded-2xl p-4 bg-slate-950/30 max-w-xs space-y-3">
          <p className="text-xs text-amber-500 font-medium flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3.5 h-3.5" /> Fast Wash Included
          </p>
          <p className="text-[11px] text-slate-500 leading-normal text-center">
            Every booking includes our legendary hair wash, scalp revitalization, and espresso service with your chosen master.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="booking-active-dock"
      className="w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
    >
      {/* Dock Header */}
      <div className="bg-slate-950 p-6 border-b border-slate-800/80 flex justify-between items-center">
        <div>
          <h3 className="font-display font-medium text-sm uppercase tracking-wider text-amber-400">Your Selection</h3>
          <p className="text-slate-400 text-xs mt-0.5">{selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} added</p>
        </div>
        <button 
          id="btn-clear-selection"
          onClick={onClearServices}
          className="text-slate-500 hover:text-rose-400 cursor-pointer p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
          title="Clear all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Items List */}
      <div className="p-6 border-b border-slate-800/60 max-h-[160px] overflow-y-auto custom-scrollbar space-y-3 bg-slate-950/20">
        {selectedServices.map(s => (
          <div key={s.id} className="flex justify-between items-start gap-4">
            <div className="flex gap-2">
              <CornerDownRight className="w-4 h-4 text-amber-500/50 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-slate-200">{s.name}</h4>
                <p className="text-[11px] text-slate-500">{s.duration} mins</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gold-300 font-mono">${s.price}</span>
              <button 
                id={`remove-service-${s.id}`}
                onClick={() => onToggleService(s.id)}
                className="text-slate-600 hover:text-rose-400 cursor-pointer p-0.5 rounded transition-colors"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats bar */}
      <div className="px-6 py-4 bg-slate-950/40 border-b border-slate-800/60 flex justify-between items-center text-xs">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="w-3.5 h-3.5 text-gold-400" />
          <span>Total: <strong className="text-slate-200">{totalDuration} mins</strong></span>
        </div>
        <div className="text-right">
          <span className="text-slate-400">Estimated Price: </span>
          <span className="text-sm font-bold text-amber-400 font-mono">${totalPrice}</span>
        </div>
      </div>

      {/* Step Views */}
      <div className="p-6">
        {step === 1 ? (
          /* STEP 1: SELECT BARBER & SLOTS */
          <div className="space-y-6">
            {/* Choose Stylist dropdown/scroller */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Select Your Barber</label>
              <div className="grid grid-cols-3 gap-2">
                {STYLISTS.map(barber => (
                  <button
                    id={`barber-select-${barber.id}`}
                    key={barber.id}
                    type="button"
                    onClick={() => {
                      onSelectStylist(selectedStylistId === barber.id ? null : barber.id);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      selectedStylistId === barber.id 
                        ? 'border-gold-500 bg-gold-600/10' 
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    <img 
                      src={barber.image} 
                      alt={barber.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-[10px] font-bold text-slate-200 leading-tight truncate max-w-full">
                      {barber.name.split(' ')[0]}
                    </div>
                    <div className="text-[9px] text-slate-400 leading-none">
                      ★ {barber.rating}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Scroller */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Select Date</label>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {availableDates.map(d => {
                  const isSelected = selectedDate === d.dateString;
                  return (
                    <button
                      id={`date-select-${d.dateString}`}
                      key={d.dateString}
                      type="button"
                      onClick={() => setSelectedDate(d.dateString)}
                      className={`flex-shrink-0 w-12 py-2 rounded-xl text-center border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-gold-600 border-gold-500 text-slate-950' 
                          : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wider block font-bold leading-tight">
                        {d.dayName}
                      </span>
                      <span className="text-sm font-bold block mt-0.5">
                        {d.dayOfMonth}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Availability Warning */}
            {matchedStylist && !isStylistAvailableOnDay && (
              <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200">
                ⚠️ <span className="font-semibold">{matchedStylist.name.split(' ')[0]}</span> is normally off on this day. Walk-in or waitlist options may apply, or feel free to book with Julian or Sarah!
              </div>
            )}

            {/* Time Slot Picker */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Available Times</label>
              <div className="grid grid-cols-4 gap-1.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                {TIME_SLOTS.map(t => {
                  const isSelected = selectedTime === t;
                  return (
                    <button
                      id={`time-select-${t}`}
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`py-1.5 rounded-lg border text-[11px] font-mono text-center transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-gold-600 border-gold-500 text-slate-950 font-semibold' 
                          : 'bg-slate-950/30 border-slate-800 text-slate-300 hover:border-slate-800 hover:bg-slate-900/60'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next Button */}
            <button
              id="btn-step-1-next"
              type="button"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(2)}
              className="w-full py-3 px-4 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Provide Customer Details</span>
              <ArrowRight className="w-4 h-4 animate-bounce-horizontal" />
            </button>
          </div>
        ) : (
          /* STEP 2: CUSTOMER CONTACT DETAILS */
          <form onSubmit={handleCreateBooking} className="space-y-4">
            <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-2xl flex flex-col gap-2 mb-4">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Selected Time:</span>
                <span className="font-semibold text-slate-200">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Total Charge:</span>
                <span className="font-semibold text-gold-300 font-mono">${totalPrice}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="customer-name" className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Your Full Name *</label>
              <input
                id="customer-name"
                type="text"
                required
                placeholder="e.g. John Doe"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-gold-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label htmlFor="customer-phone" className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Phone Number *</label>
                <input
                  id="customer-phone"
                  type="tel"
                  required
                  placeholder="(301) 555-0199"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="customer-email" className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Email Address</label>
                <input
                  id="customer-email"
                  type="email"
                  placeholder="john@example.com"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="customer-notes" className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Special Notes / Requests</label>
              <textarea
                id="customer-notes"
                placeholder="Let your stylist know if you have any preferred hair products, scalp sensitivities, or specific styling cuts..."
                value={customerNotes}
                onChange={e => setCustomerNotes(e.target.value)}
                rows={2}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-gold-500 transition-all resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                id="btn-back-to-schedule"
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 px-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                id="btn-submit-booking"
                type="submit"
                className="w-2/3 py-3 px-4 bg-gold-600 hover:bg-gold-500 text-slate-950 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Book</span>
              </button>
            </div>
            
            <p className="text-[10px] text-slate-500 text-center leading-normal">
              No pre-payment required. You'll complete payment at the lounge via cash, card, or Apple Pay after being pampered.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
