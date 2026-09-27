import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';
import { BUXAR_AREAS } from '../../data/mockData';
import {
  Wrench,
  Zap,
  Wind,
  Hammer,
  Sparkles,
  Tv,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  MapPin,
  Search,
  Phone,
  ArrowRight,
  KeyRound,
} from 'lucide-react';
import { CategoryIcon } from '../common/IconHelper';
import { BookingModal } from '../customer/BookingModal';

export const CustomerWebPortal: React.FC = () => {
  const { categories, technicians, bookings, currentUser, loginAsRole } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('BXR-2026-081');

  const trackedBooking = bookings.find(
    (b) => b.bookingNumber.toLowerCase() === trackingNumber.trim().toLowerCase()
  );

  const filteredCategories = categories.filter(
    (c) =>
      c.active &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.commonProblems.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[460px] flex items-center shadow-xl">
        <img
          src="/src/assets/images/hero_buxar_service_1790519661096.jpg"
          alt="Buxar home technician"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />

        <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-10 space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Serving All Municipal Wards in Buxar, Bihar</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-white leading-tight">
            Reliable Home Services, Right at Your Doorstep in Buxar.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl">
            Book background-verified local plumbers, electricians, AC technicians and carpenters. Transparent visiting rates with zero advance deposit.
          </p>

          {/* Quick Search & Select bar */}
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex flex-col sm:flex-row gap-2 max-w-lg">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white rounded-xl text-slate-900">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What service do you need? (e.g. plumbing)"
                className="w-full text-xs font-medium focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                if (categories.length > 0) setSelectedCategory(categories[0]);
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors whitespace-nowrap"
            >
              Book Service Now
            </button>
          </div>

          {/* Trust stats */}
          <div className="flex items-center gap-6 pt-2 text-xs text-slate-300">
            <div>
              <span className="font-bold text-white text-sm">4.8/5</span> Average Rating
            </div>
            <div>
              <span className="font-bold text-white text-sm">60-Min</span> Rapid Dispatch
            </div>
            <div>
              <span className="font-bold text-white text-sm">100%</span> Verified Technicians
            </div>
          </div>
        </div>
      </section>

      {/* Services Directory */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Categories & Solutions
            </span>
            <h2 className="font-display font-extrabold text-2xl text-slate-900">
              Our Professional Home Services
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            All services include standard diagnostic inspection by certified local technicians with genuine spare parts warranty.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs text-emerald-900 font-semibold text-xs flex items-center gap-1.5 shadow-xs">
                    <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-bold text-base text-slate-900">{cat.name}</h3>
                    <div className="text-xs font-semibold text-emerald-800">
                      From ₹{cat.basePrice}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {cat.description}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Popular Repairs:
                    </div>
                    {cat.commonProblems.slice(0, 3).map((prob) => (
                      <div
                        key={prob}
                        className="text-xs text-slate-700 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{prob}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Book {cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Booking Tracker Widget */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Transparency & Real-Time Tracking
            </span>
            <h3 className="font-display font-extrabold text-xl text-slate-900">
              Track Your Buxar Service Booking
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your booking ID to track technician dispatch, schedule, and completion state.
            </p>
          </div>

          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. BXR-2026-081"
              className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-emerald-600 uppercase"
            />
            <button
              onClick={() => {
                /* updates tracked booking */
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs whitespace-nowrap transition-colors"
            >
              Check Status
            </button>
          </div>
        </div>

        {trackedBooking ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {trackedBooking.bookingNumber}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="font-bold text-sm text-slate-900">
                    {trackedBooking.serviceCategoryName}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  "{trackedBooking.specificIssue}"
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {trackedBooking.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-slate-400 font-medium">Customer & Location:</div>
                <div className="font-semibold text-slate-900">{trackedBooking.customerName}</div>
                <div className="text-slate-600 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {trackedBooking.customerAddress} ({trackedBooking.buxarArea})
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-400 font-medium">Assigned Professional:</div>
                <div className="font-semibold text-slate-900">
                  {trackedBooking.technicianName || 'Awaiting acceptance'}
                </div>
                <div className="text-slate-600 text-[11px]">
                  {trackedBooking.technicianPhone || 'Dispatching nearby in Buxar'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-400 font-medium">Schedule & Security OTP:</div>
                <div className="font-semibold text-slate-900">
                  {trackedBooking.preferredDate} · {trackedBooking.preferredTimeSlot}
                </div>
                {trackedBooking.otpCode && (
                  <div className="flex items-center gap-1.5 text-indigo-700 font-mono font-bold text-xs pt-0.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>OTP: {trackedBooking.otpCode}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 bg-white p-4 rounded-xl border border-slate-200">
            Booking ID not found. Try searching for <b>BXR-2026-081</b> or <b>BXR-2026-080</b>.
          </div>
        )}
      </section>

      {/* Local Areas in Buxar */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="font-display font-extrabold text-xl text-slate-900">
            Coverage Across Buxar District
          </h3>
          <p className="text-xs text-slate-500">
            Active technician hubs positioned across major residential and commercial sectors.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
          {BUXAR_AREAS.map((area) => (
            <div
              key={area}
              className="bg-white p-3 rounded-xl border border-slate-200 text-center font-medium text-slate-700 shadow-2xs hover:border-emerald-600 transition-colors"
            >
              📍 {area.split('(')[0]}
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      {selectedCategory && (
        <BookingModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
};
