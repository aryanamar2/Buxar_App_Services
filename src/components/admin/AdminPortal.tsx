import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TechnicianVerificationStatus,
  BookingStatus,
  ServiceCategory,
} from '../../types';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  DollarSign,
  Star,
  Settings,
  Plus,
  Search,
  Filter,
  Eye,
  Sliders,
} from 'lucide-react';
import { CategoryIcon } from '../common/IconHelper';

export const AdminPortal: React.FC = () => {
  const {
    users,
    technicians,
    categories,
    bookings,
    updateTechnicianStatus,
    toggleCategoryStatus,
    updateCategoryPrice,
    addCategory,
    showToast,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'OVERVIEW' | 'TECHNICIANS' | 'BOOKINGS' | 'CUSTOMERS' | 'SERVICES' | 'REVIEWS'
  >('OVERVIEW');

  const [bookingFilter, setBookingFilter] = useState<string>('ALL');
  const [techFilter, setTechFilter] = useState<string>('ALL');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatPrice, setNewCatPrice] = useState(249);
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Wrench');

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
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      basePrice: Number(newCatPrice),
      description: newCatDesc || 'Professional home service for Buxar residents.',
      iconName: newCatIcon,
      commonProblems: ['General repair & inspection', 'Parts replacement', 'Routine service'],
      image: '/src/assets/images/hero_buxar_service_1790519661096.jpg',
      active: true,
    });

    setShowAddCategoryModal(false);
    setNewCatName('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Admin Title & Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <h2 className="font-display font-extrabold text-2xl text-slate-900">
              Buxar Central Operations Console
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin oversight for Buxar Home Services marketplace · Municipal District Ops
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          {[
            { id: 'OVERVIEW', label: 'Overview' },
            { id: 'BOOKINGS', label: `Bookings (${bookings.length})` },
            { id: 'TECHNICIANS', label: `Technicians (${technicians.length})` },
            { id: 'SERVICES', label: 'Services & Pricing' },
            { id: 'CUSTOMERS', label: 'Users' },
            { id: 'REVIEWS', label: 'Reviews' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeAdminTab === tab.id
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeAdminTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Total Bookings</span>
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {bookings.length}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Live in Buxar</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Active In-Flight</span>
              <div className="text-2xl font-extrabold text-indigo-700 tabular-nums">
                {activeBookings}
              </div>
              <span className="text-[10px] text-indigo-600 font-semibold">On-duty now</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Pending Approvals</span>
              <div className="text-2xl font-extrabold text-amber-700 tabular-nums">
                {pendingApprovals}
              </div>
              <span className="text-[10px] text-amber-600 font-semibold">KYC Verification</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Active Pros</span>
              <div className="text-2xl font-extrabold text-emerald-800 tabular-nums">
                {totalTechnicians}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Across all trades</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Completed Jobs</span>
              <div className="text-2xl font-extrabold text-emerald-700 tabular-nums">
                {completedBookings}
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">100% verified</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Platform Gross</span>
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                ₹{totalPlatformGross}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Buxar GMV</span>
            </div>
          </div>

          {/* Pending Verification Notice */}
          {pendingApprovals > 0 && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <div className="font-bold text-amber-950">
                    {pendingApprovals} Technician Application(s) Awaiting Aadhaar Verification
                  </div>
                  <div className="text-amber-800 text-[11px]">
                    Verify applicant identity, trade background, and base location before granting access to customer requests.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveAdminTab('TECHNICIANS')}
                className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-semibold whitespace-nowrap transition-colors"
              >
                Review Applications →
              </button>
            </div>
          )}

          {/* Recent Live Dispatch Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">
                Recent Service Dispatches in Buxar
              </h3>
              <button
                onClick={() => setActiveAdminTab('BOOKINGS')}
                className="text-xs text-purple-700 font-semibold hover:underline"
              >
                View all ({bookings.length}) →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="pb-2">Booking #</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Service</th>
                    <th className="pb-2">Buxar Locality</th>
                    <th className="pb-2">Assigned Pro</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 font-mono font-semibold text-slate-900">
                        {b.bookingNumber}
                      </td>
                      <td className="py-2.5">
                        <div className="font-semibold text-slate-800">{b.customerName}</div>
                        <div className="text-[10px] text-slate-400">{b.customerPhone}</div>
                      </td>
                      <td className="py-2.5">
                        <span className="font-medium text-slate-800">{b.serviceCategoryName}</span>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                          {b.specificIssue}
                        </div>
                      </td>
                      <td className="py-2.5 text-slate-600">{b.buxarArea}</td>
                      <td className="py-2.5 font-medium text-slate-800">
                        {b.technicianName || <span className="text-amber-600 italic">Unassigned</span>}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : b.status === 'REQUESTED'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-bold tabular-nums text-slate-900">
                        ₹{b.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. TECHNICIANS MANAGEMENT TAB */}
      {activeAdminTab === 'TECHNICIANS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Filter:</span>
              {['ALL', 'PENDING', 'APPROVED', 'SUSPENDED'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTechFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    techFilter === filter
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTechs.map((tech) => (
              <div
                key={tech.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-slate-100 font-extrabold text-slate-800 flex items-center justify-center">
                        {tech.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1">
                          {tech.name}
                        </h4>
                        <div className="text-xs text-slate-500">{tech.categoryName}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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

                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
                    <div><b>Aadhaar ID:</b> {tech.aadhaarNumber}</div>
                    <div><b>Phone:</b> {tech.phone}</div>
                    <div><b>Base Area:</b> {tech.baseArea}</div>
                    <div><b>Experience:</b> {tech.experienceYears} Years</div>
                    <div className="flex items-center gap-2 text-slate-800 font-semibold pt-1">
                      <span className="flex items-center text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                        {tech.rating}
                      </span>
                      <span>·</span>
                      <span>{tech.completedJobsCount} Jobs Completed</span>
                    </div>
                  </div>
                </div>

                {/* Verification Actions */}
                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  {tech.verificationStatus === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => updateTechnicianStatus(tech.id, 'APPROVED')}
                        className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                      >
                        ✓ Approve KYC
                      </button>
                      <button
                        onClick={() => updateTechnicianStatus(tech.id, 'REJECTED')}
                        className="py-1.5 px-3 border border-slate-200 hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold"
                      >
                        Reject
                      </button>
                    </>
                  ) : tech.verificationStatus === 'APPROVED' ? (
                    <button
                      onClick={() => updateTechnicianStatus(tech.id, 'SUSPENDED')}
                      className="w-full py-1.5 border border-slate-200 hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold"
                    >
                      Suspend / Disable Partner
                    </button>
                  ) : (
                    <button
                      onClick={() => updateTechnicianStatus(tech.id, 'APPROVED')}
                      className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
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

      {/* 3. ALL BOOKINGS TAB */}
      {activeAdminTab === 'BOOKINGS' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-semibold shrink-0">Filter Status:</span>
            {['ALL', 'REQUESTED', 'ACCEPTED', 'CONFIRMED', 'ON_THE_WAY', 'STARTED', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setBookingFilter(st)}
                className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  bookingFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3">Booking #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Service & Issue</th>
                    <th className="p-3">Buxar Locality</th>
                    <th className="p-3">Assigned Pro</th>
                    <th className="p-3">Scheduled Slot</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Visiting Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono font-bold text-slate-900">{b.bookingNumber}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{b.customerName}</div>
                        <div className="text-[10px] text-slate-500">{b.customerPhone}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-slate-800">{b.serviceCategoryName}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{b.specificIssue}</div>
                      </td>
                      <td className="p-3 text-slate-600">{b.buxarArea}</td>
                      <td className="p-3 font-medium text-slate-800">
                        {b.technicianName || <span className="text-amber-600 italic">Unassigned</span>}
                      </td>
                      <td className="p-3 text-slate-600">
                        {b.preferredDate} · {b.preferredTimeSlot}
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold tabular-nums text-slate-900">
                        ₹{b.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. SERVICES & PRICING TAB */}
      {activeAdminTab === 'SERVICES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Service Catalog & Visiting Inspection Rates
              </h3>
              <p className="text-xs text-slate-500">
                Configure base call-out fees for Buxar household clients
              </p>
            </div>
            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add New Service
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                        <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{cat.name}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cat.active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.active ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Base Visiting Fee:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-900">₹</span>
                      <input
                        type="number"
                        defaultValue={cat.basePrice}
                        onBlur={(e) => updateCategoryPrice(cat.id, Number(e.target.value))}
                        className="w-20 p-1 border border-slate-200 rounded-lg text-xs font-bold tabular-nums text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {cat.commonProblems.length} Problem Templates
                  </span>
                  <button
                    onClick={() => toggleCategoryStatus(cat.id)}
                    className="text-xs font-semibold text-purple-700 hover:text-purple-900"
                  >
                    {cat.active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CUSTOMERS & USERS TAB */}
      {activeAdminTab === 'CUSTOMERS' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900">Registered Platform Users</h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">{u.name}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.role === 'CUSTOMER'
                          ? 'bg-blue-50 text-blue-800'
                          : u.role === 'TECHNICIAN'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-purple-50 text-purple-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">
                    {u.phone} · {u.email}
                  </td>
                  <td className="p-3 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-emerald-700 font-semibold">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. REVIEWS TAB */}
      {activeAdminTab === 'REVIEWS' && (
        <div className="space-y-3">
          <h3 className="font-bold text-base text-slate-900">Customer Ratings & Service Quality</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookings
              .filter((b) => b.review)
              .map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{b.customerName}</div>
                      <div className="text-[11px] text-slate-500">
                        Technician: <b>{b.technicianName}</b> · {b.serviceCategoryName}
                      </div>
                    </div>
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                      {b.review?.rating} / 5
                    </div>
                  </div>
                  <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic text-slate-700">
                    "{b.review?.comment}"
                  </p>
                  <div className="text-[10px] text-slate-400">
                    Booking #{b.bookingNumber} · {b.buxarArea}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-display font-bold text-base text-slate-900">
              Add New Service Category
            </h3>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Solar Panel Cleaning & Maintenance"
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Base Inspection Fee (₹)</label>
                <input
                  type="number"
                  required
                  value={newCatPrice}
                  onChange={(e) => setNewCatPrice(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Description of service for Buxar residents..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="flex-1 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
