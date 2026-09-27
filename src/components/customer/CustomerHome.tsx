import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CategoryIcon } from '../common/IconHelper';
import { BookingModal } from './BookingModal';

export const CustomerHome: React.FC = () => {
  const { categories, technicians, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [targetTechId, setTargetTechId] = useState<string | undefined>(undefined);

  const filteredCategories = categories.filter(
    (c) =>
      c.active &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.commonProblems.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const onlineTechnicians = technicians.filter(
    (t) => t.verificationStatus === 'APPROVED'
  );

  const openBookingFor = (cat: ServiceCategory, techId?: string) => {
    setSelectedCategory(cat);
    setTargetTechId(techId);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Banner / Location */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between text-xs text-emerald-200">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium text-white">Charitravan, Buxar</span>
              <span className="text-emerald-300">· 802101</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] bg-emerald-800/80 px-2 py-0.5 rounded-full text-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              48 Pros Active
            </div>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
              Namaste, {currentUser.name.split(' ')[0]} 👋
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-sm">
              Verified local plumbers, electricians, AC technicians & carpenters at your doorstep in Buxar.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative pt-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 'pipe leak', 'inverter wire', 'AC cooling'..."
              className="w-full pl-9 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 text-xs rounded-xl shadow-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Ambient subtle decoration */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Services Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-slate-900">
            What service do you need today?
          </h3>
          <span className="text-xs text-slate-500">Fixed visiting rates</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => openBookingFor(cat)}
              className="group cursor-pointer bg-white rounded-xl border border-slate-200 hover:border-emerald-600/50 hover:shadow-md transition-all p-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="relative h-24 rounded-lg overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 w-7 h-7 rounded-md bg-white/90 backdrop-blur-xs flex items-center justify-center text-emerald-800 shadow-xs">
                    <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {cat.commonProblems[0]}
                  </p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Visiting fee</span>
                <span className="font-bold text-emerald-800 tabular-nums">₹{cat.basePrice}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Verified Technicians */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900">
              Top Rated Local Professionals
            </h3>
            <p className="text-[11px] text-slate-500">
              Aadhaar-verified with police check in Buxar district
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {onlineTechnicians.slice(0, 3).map((tech) => {
            const cat = categories.find((c) => c.id === tech.categoryId);
            return (
              <div
                key={tech.id}
                className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-sm">
                      {tech.name.charAt(0)}
                    </div>
                    {tech.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-slate-900">{tech.name}</h4>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {tech.categoryName} · {tech.baseArea}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5">
                      <span className="flex items-center text-amber-600 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                        {tech.rating}
                      </span>
                      <span>·</span>
                      <span className="tabular-nums">{tech.completedJobsCount} jobs</span>
                      <span>·</span>
                      <span>{tech.experienceYears} yrs exp</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => cat && openBookingFor(cat, tech.id)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  Book Pro
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <div className="bg-slate-100/80 rounded-xl p-3.5 border border-slate-200/80 text-xs space-y-2">
        <div className="font-bold text-slate-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          The Buxar Home Services Assurance
        </div>
        <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600">
          <div>✓ No Advance Deposit</div>
          <div>✓ Transparent Rates</div>
          <div>✓ Post-Service OTP Bill</div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedCategory && (
        <BookingModal
          category={selectedCategory}
          targetTechnicianId={targetTechId}
          onClose={() => {
            setSelectedCategory(null);
            setTargetTechId(undefined);
          }}
        />
      )}
    </div>
  );
};
