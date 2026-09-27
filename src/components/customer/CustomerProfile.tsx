import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  RotateCcw,
  LogOut,
  HelpCircle,
  Clock,
  HeartHandshake,
} from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { currentUser, bookings, resetAllDemoData, showToast, loginAsRole } = useApp();
  const [address, setAddress] = useState('House #42, Ganga Darshan Lane, Charitravan, Buxar');

  const myBookings = bookings.filter((b) => b.customerId === currentUser.id);
  const completedCount = myBookings.filter((b) => b.status === 'COMPLETED').length;

  return (
    <div className="space-y-4 pb-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xl flex items-center justify-center border-2 border-emerald-300">
          {currentUser.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-base text-slate-900">
              {currentUser.name}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              Customer
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{currentUser.phone}</p>
          <p className="text-xs text-slate-400">{currentUser.email}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 text-center">
          <div className="text-xl font-extrabold text-slate-900 tabular-nums">
            {myBookings.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Total Requests</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 text-center">
          <div className="text-xl font-extrabold text-emerald-800 tabular-nums">
            {completedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Services Completed</div>
        </div>
      </div>

      {/* Saved Address */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Default Service Address in Buxar
          </h4>
        </div>
        <textarea
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
        />
        <button
          onClick={() => showToast('Address saved successfully!')}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors"
        >
          Save Address
        </button>
      </div>

      {/* Quick Switch to Technician */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
        <div className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-amber-700" />
          Are you a local technician or electrician?
        </div>
        <p className="text-[11px] text-amber-900/80">
          Switch to technician mode to accept incoming service requests in Buxar.
        </p>
        <button
          onClick={() => loginAsRole('TECHNICIAN')}
          className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs transition-colors"
        >
          Switch to Rahul Kumar (Technician)
        </button>
      </div>

      {/* Support & Helpline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
        <div className="font-bold text-slate-900 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          Buxar Local Helpline
        </div>
        <p className="text-slate-500 text-[11px]">
          Operating 8:00 AM – 9:00 PM for complaints, urgent water leaks, or electric breakdowns.
        </p>
        <div className="font-semibold text-emerald-800 text-sm">
          📞 1800-890-BUXAR / +91 94310 99887
        </div>
      </div>
    </div>
  );
};
