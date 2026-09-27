import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TechnicianVerificationStatus,
  BookingStatus,
  ServiceCategory,
} from '../../types';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Star,
  Settings,
  DollarSign,
  FileText,
  MapPin,
  Clock,
  Phone,
  Power,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { CategoryIcon } from '../common/IconHelper';

export const AdminMobileView: React.FC = () => {
  const {
    users,
    technicians,
    categories,
    bookings,
    updateTechnicianStatus,
    toggleCategoryStatus,
    updateCategoryPrice,
    addCategory,
    mobileAdminTab,
    setMobileAdminTab,
    showToast,
  } = useApp();

  const [bookingFilter, setBookingFilter] = useState<string>('ALL');
  const [techFilter, setTechFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Category State
  const [catName, setCatName] = useState('');
  const [catPrice, setCatPrice] = useState(249);
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('Wrench');

  // KPI Computations
  const totalCustomers = users.filter((u) => u.role === 'CUSTOMER').length;
  const totalTechnicians = technicians.length;
  const pendingApprovals = technicians.filter(
    (t) => t.verificationStatus === 'PENDING'
  ).length;
  const activeBookings = bookings.filter((b) =>
    ['REQUESTED', 'ACCEPTED', 'CONFIRMED', 'ON_THE_WAY', 'STARTED'].includes(b.status)
  ).length;
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED').length;
  const totalPlatformGross = bookings
    .filter((b) => b.status === 'COMPLETED')
    .reduce((acc, b) => acc + b.price, 0);

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'ALL') return true;
    return b.status === bookingFilter;
  });

  const filteredTechs = technicians.filter((t) => {
    if (techFilter === 'ALL') return true;
    return t.verificationStatus === techFilter;
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    addCategory({
      name: catName,
      slug: catName.toLowerCase().replace(/\s+/g, '-'),
      basePrice: Number(catPrice),
      description: catDesc || 'Professional home service for Buxar residents.',
      iconName: catIcon,
      commonProblems: ['General repair & inspection', 'Parts replacement', 'Routine service'],
      image: '/src/assets/images/hero_buxar_service_1790519661096.jpg',
      active: true,
    });

    setShowAddModal(false);
    setCatName('');
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Admin Header Card */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
            <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider">
              Buxar Central Admin
            </span>
          </div>
          <span className="text-[10px] font-mono bg-purple-800/80 px-2 py-0.5 rounded-full text-purple-200">
            District Ops
          </span>
        </div>
        <div>
          <h3 className="font-display font-extrabold text-base text-white">
            Operations & Dispatch Control
          </h3>
          <p className="text-[11px] text-purple-200/80">
            Full administrator control inside Android mobile application.
          </p>
        </div>
      </div>

      {/* 1. OVERVIEW TAB */}
      {mobileAdminTab === 'overview' && (
        <div className="space-y-3.5">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Bookings</span>
              <div className="text-xl font-extrabold text-slate-900 tabular-nums">
                {bookings.length}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">{activeBookings} active now</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Pending KYC</span>
              <div className="text-xl font-extrabold text-amber-700 tabular-nums">
                {pendingApprovals}
              </div>
              <span className="text-[10px] text-amber-600 font-semibold">Awaiting review</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Technicians</span>
              <div className="text-xl font-extrabold text-emerald-800 tabular-nums">
                {totalTechnicians}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Verified pros</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Platform GMV</span>
              <div className="text-xl font-extrabold text-slate-900 tabular-nums">
                ₹{totalPlatformGross}
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">{completedBookings} jobs completed</span>
            </div>
          </div>

          {/* Pending KYC Alert Banner */}
          {pendingApprovals > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-950 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{pendingApprovals} New Partner Application(s)</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Technicians registered in Buxar are waiting for your Aadhaar KYC approval to receive customer bookings.
              </p>
              <button
                onClick={() => setMobileAdminTab('technicians')}
                className="w-full py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold text-xs transition-colors"
              >
                Review & Approve Applications →
              </button>
            </div>
          )}

          {/* Live Recent Dispatches */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-900">Live Dispatches in Buxar</h4>
              <button
                onClick={() => setMobileAdminTab('bookings')}
                className="text-[11px] text-purple-700 font-semibold"
              >
                View all ({bookings.length})
              </button>
            </div>

            <div className="space-y-2">
              {bookings.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{b.bookingNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                      {b.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="font-medium text-slate-800 text-[11px]">{b.specificIssue}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>{b.customerName} · {b.buxarArea.split('(')[0]}</span>
                    <span className="font-bold text-emerald-800 tabular-nums">₹{b.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ALL BOOKINGS TAB */}
      {mobileAdminTab === 'bookings' && (
        <div className="space-y-3">
          {/* Status filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['ALL', 'REQUESTED', 'CONFIRMED', 'ON_THE_WAY', 'STARTED', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setBookingFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] whitespace-nowrap transition-colors ${
                  bookingFilter === st
                    ? 'bg-purple-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-400 text-[10px]">{b.bookingNumber}</span>
                    <h5 className="font-bold text-slate-900 text-xs">{b.serviceCategoryName}</h5>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                    {b.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg space-y-1">
                  <div><b>Issue:</b> "{b.specificIssue}"</div>
                  <div><b>Customer:</b> {b.customerName} ({b.customerPhone})</div>
                  <div><b>Locality:</b> {b.buxarArea}</div>
                  <div>
                    <b>Assigned Pro:</b> {b.technicianName || <span className="text-amber-600">Pending</span>}
                  </div>
                  <div><b>Slot:</b> {b.preferredDate} · {b.preferredTimeSlot}</div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400">Visiting Fee:</span>
                  <span className="font-bold text-emerald-800 tabular-nums">₹{b.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TECHNICIANS & KYC TAB */}
      {mobileAdminTab === 'technicians' && (
        <div className="space-y-3">
          {/* Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['ALL', 'PENDING', 'APPROVED', 'SUSPENDED'].map((st) => (
              <button
                key={st}
                onClick={() => setTechFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] whitespace-nowrap transition-colors ${
                  techFilter === st
                    ? 'bg-purple-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filteredTechs.map((tech) => (
              <div
                key={tech.id}
                className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2.5 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-slate-100 font-bold text-slate-800 flex items-center justify-center text-xs">
                      {tech.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        {tech.name}
                        {tech.verificationStatus === 'APPROVED' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">{tech.categoryName}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      tech.verificationStatus === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : tech.verificationStatus === 'PENDING'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {tech.verificationStatus}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg space-y-0.5">
                  <div><b>Aadhaar ID:</b> {tech.aadhaarNumber}</div>
                  <div><b>Base Area:</b> {tech.baseArea}</div>
                  <div><b>Experience:</b> {tech.experienceYears} Years</div>
                  <div className="flex items-center gap-2 text-slate-800 pt-0.5">
                    <span className="flex items-center text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                      {tech.rating}
                    </span>
                    <span>·</span>
                    <span>{tech.completedJobsCount} Jobs Completed</span>
                  </div>
                </div>

                {/* KYC Actions */}
                <div className="flex gap-1.5 pt-0.5">
                  {tech.verificationStatus === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => updateTechnicianStatus(tech.id, 'APPROVED')}
                        className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs"
                      >
                        ✓ Approve KYC
                      </button>
                      <button
                        onClick={() => updateTechnicianStatus(tech.id, 'REJECTED')}
                        className="px-3 py-1.5 border border-slate-200 text-rose-700 rounded-lg font-bold text-xs"
                      >
                        Reject
                      </button>
                    </>
                  ) : tech.verificationStatus === 'APPROVED' ? (
                    <button
                      onClick={() => updateTechnicianStatus(tech.id, 'SUSPENDED')}
                      className="w-full py-1.5 border border-slate-200 text-rose-700 hover:bg-rose-50 rounded-lg font-medium text-xs"
                    >
                      Suspend / Disable Partner
                    </button>
                  ) : (
                    <button
                      onClick={() => updateTechnicianStatus(tech.id, 'APPROVED')}
                      className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs"
                    >
                      Re-Instate Partner
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SERVICES & PRICING TAB */}
      {mobileAdminTab === 'services' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-900">Service Categories & Fees</h4>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">{cat.name}</h5>
                      <span className="text-[10px] text-slate-400">
                        {cat.commonProblems.length} Problem Templates
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      cat.active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat.active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-slate-500 text-[11px]">Visiting Fee:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-900">₹</span>
                    <input
                      type="number"
                      defaultValue={cat.basePrice}
                      onBlur={(e) => updateCategoryPrice(cat.id, Number(e.target.value))}
                      className="w-16 p-1 border border-slate-200 rounded-lg text-xs font-bold tabular-nums text-slate-900 text-right"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => toggleCategoryStatus(cat.id)}
                    className="text-xs font-semibold text-purple-700"
                  >
                    {cat.active ? 'Disable in Buxar' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MORE TAB (USERS & REVIEWS) */}
      {mobileAdminTab === 'more' && (
        <div className="space-y-4 text-xs">
          {/* Users List */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2 shadow-2xs">
            <h4 className="font-bold text-slate-900 text-xs">Registered Platform Users ({users.length})</h4>
            <div className="space-y-1.5">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[10px] text-slate-500">{u.phone}</div>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      u.role === 'CUSTOMER'
                        ? 'bg-blue-50 text-blue-700'
                        : u.role === 'TECHNICIAN'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-purple-50 text-purple-700'
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2 shadow-2xs">
            <h4 className="font-bold text-slate-900 text-xs">Customer Reviews & Feedback</h4>
            <div className="space-y-2">
              {bookings
                .filter((b) => b.review)
                .map((b) => (
                  <div key={b.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{b.customerName}</span>
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                        {b.review?.rating} / 5
                      </div>
                    </div>
                    <p className="italic text-slate-700 text-[11px]">"{b.review?.comment}"</p>
                    <div className="text-[10px] text-slate-400">
                      Tech: {b.technicianName} · #{b.bookingNumber}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm p-4 shadow-2xl space-y-3 border border-slate-200 text-xs">
            <h4 className="font-bold text-sm text-slate-900">Add New Category in Buxar</h4>
            <form onSubmit={handleCreateCategory} className="space-y-2.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Solar Panel Service"
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Base Visiting Fee (₹)</label>
                <input
                  type="number"
                  required
                  value={catPrice}
                  onChange={(e) => setCatPrice(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Service description..."
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
