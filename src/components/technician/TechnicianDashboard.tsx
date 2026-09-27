import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceBooking, BookingStatus } from '../../types';
import {
  Power,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Star,
  KeyRound,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { CategoryIcon } from '../common/IconHelper';

export const TechnicianDashboard: React.FC = () => {
  const {
    currentUser,
    currentTechnicianProfile,
    technicians,
    bookings,
    acceptBooking,
    rejectBooking,
    markOnTheWay,
    startJob,
    completeJob,
    toggleAvailability,
    mobileTechnicianTab,
    setMobileTechnicianTab,
    showToast,
  } = useApp();

  // Find tech profile or default to Rahul
  const tech = currentTechnicianProfile || technicians[0];
  const [rejectReasonModalId, setRejectReasonModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Already on another job');

  // Bookings relevant to this technician:
  // 1. Pending requests in tech's category or directly targeted
  const pendingRequests = bookings.filter(
    (b) =>
      b.status === 'REQUESTED' &&
      (b.serviceCategoryId === tech.categoryId || b.technicianId === tech.id)
  );

  // 2. Active jobs accepted/in-progress by this tech
  const activeJobs = bookings.filter(
    (b) =>
      ['ACCEPTED', 'CONFIRMED', 'ON_THE_WAY', 'STARTED'].includes(b.status) &&
      b.technicianId === tech.id
  );

  // 3. Completed history
  const historyJobs = bookings.filter(
    (b) => ['COMPLETED', 'REJECTED'].includes(b.status) && b.technicianId === tech.id
  );

  const totalEarnings = historyJobs
    .filter((b) => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="space-y-4 pb-6">
      {/* Availability Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-950 font-extrabold flex items-center justify-center text-base border-2 border-emerald-300">
                {tech.name.charAt(0)}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  tech.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-sm text-slate-900">
                  {tech.name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500">
                {tech.categoryName} · {tech.baseArea}
              </p>
            </div>
          </div>

          {/* Online Toggle Switch */}
          <button
            onClick={() => toggleAvailability(tech.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tech.isOnline
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{tech.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-100 text-center">
          <div className="p-1.5 rounded-lg bg-slate-50">
            <div className="text-xs font-extrabold text-amber-700 tabular-nums">
              {pendingRequests.length}
            </div>
            <div className="text-[10px] text-slate-400">New Req</div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-50">
            <div className="text-xs font-extrabold text-blue-700 tabular-nums">
              {activeJobs.length}
            </div>
            <div className="text-[10px] text-slate-400">Active</div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-50">
            <div className="text-xs font-extrabold text-emerald-800 tabular-nums">
              {tech.completedJobsCount}
            </div>
            <div className="text-[10px] text-slate-400">Jobs Done</div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-50">
            <div className="text-xs font-extrabold text-amber-600 tabular-nums flex items-center justify-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              {tech.rating}
            </div>
            <div className="text-[10px] text-slate-400">Rating</div>
          </div>
        </div>
      </div>

      {/* Technician Navigation Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setMobileTechnicianTab('requests')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            mobileTechnicianTab === 'requests'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Incoming Requests</span>
          {pendingRequests.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setMobileTechnicianTab('active_jobs')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            mobileTechnicianTab === 'active_jobs'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Active Jobs</span>
          {activeJobs.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
              {activeJobs.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setMobileTechnicianTab('history')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            mobileTechnicianTab === 'history'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          History & Earnings
        </button>
      </div>

      {/* 1. INCOMING REQUESTS TAB */}
      {mobileTechnicianTab === 'requests' && (
        <div className="space-y-3">
          {!tech.isOnline && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>You are currently <b>OFFLINE</b>. Switch to ONLINE to receive incoming bookings from Buxar customers.</span>
            </div>
          )}

          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-sm text-slate-800">
                No Pending Requests
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                New customer bookings in Buxar matching {tech.categoryName} will appear here instantly.
              </p>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border-2 border-amber-200/80 p-4 shadow-sm space-y-3.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      NEW SERVICE REQUEST
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">
                      {req.specificIssue}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-emerald-800">₹{req.price}</span>
                    <div className="text-[10px] text-slate-400">Visiting Fee</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-2 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                      {req.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{req.customerName}</div>
                      <div className="text-[11px] text-slate-500">
                        📍 {req.buxarArea} (Approx. 2.1 km away)
                      </div>
                    </div>
                  </div>

                  <p className="italic text-slate-700 bg-white p-2 rounded-lg border border-slate-200 text-[11px]">
                    "{req.problemDescription}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Preferred: {req.preferredDate} · {req.preferredTimeSlot}
                    </span>
                    <span
                      className={`font-semibold ${
                        req.urgency === 'URGENT' ? 'text-amber-700' : 'text-slate-600'
                      }`}
                    >
                      {req.urgency === 'URGENT' ? '⚡ Urgent (60 mins)' : 'Standard'}
                    </span>
                  </div>
                </div>

                {/* Photo if present */}
                {req.photoUrl && (
                  <div className="flex items-center gap-2">
                    <img
                      src={req.photoUrl}
                      alt="Customer issue"
                      className="w-16 h-12 rounded-lg object-cover border border-slate-200"
                    />
                    <span className="text-[11px] text-slate-500">
                      Customer attached reference photo of the issue
                    </span>
                  </div>
                )}

                {/* Action Buttons: Accept / Reject */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setRejectReasonModalId(req.id);
                    }}
                    className="flex-1 py-2.5 border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => acceptBooking(req.id)}
                    className="flex-2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Accept Request
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. ACTIVE JOBS TAB */}
      {mobileTechnicianTab === 'active_jobs' && (
        <div className="space-y-3">
          {activeJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-sm text-slate-800">
                No Active Jobs Right Now
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Accept incoming requests to start managing and progressing your service jobs.
              </p>
            </div>
          ) : (
            activeJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {job.bookingNumber}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                      {job.specificIssue}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      job.status === 'ON_THE_WAY'
                        ? 'bg-indigo-100 text-indigo-800'
                        : job.status === 'STARTED'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {job.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Customer Details */}
                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{job.customerName}</span>
                    <a
                      href={`tel:${job.customerPhone}`}
                      onClick={(e) => {
                        e.preventDefault();
                        showToast(`Dialing customer ${job.customerPhone}...`);
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-[11px] flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      Call Customer
                    </a>
                  </div>
                  <div className="flex items-start gap-1 text-[11px] text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{job.customerAddress} ({job.buxarArea})</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Scheduled: {job.preferredDate} · {job.preferredTimeSlot}</span>
                  </div>
                </div>

                {/* Status Progression Controls */}
                <div className="pt-1">
                  {['ACCEPTED', 'CONFIRMED'].includes(job.status) && (
                    <button
                      onClick={() => markOnTheWay(job.id)}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      🛵 Mark "On The Way" to Customer
                    </button>
                  )}

                  {job.status === 'ON_THE_WAY' && (
                    <div className="space-y-2">
                      <div className="text-[11px] text-slate-500 text-center">
                        Arrived at customer location? Ask customer for OTP <b>{job.otpCode}</b> to start.
                      </div>
                      <button
                        onClick={() => startJob(job.id)}
                        className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        ⏱️ Verify OTP & Start Service Job
                      </button>
                    </div>
                  )}

                  {job.status === 'STARTED' && (
                    <div className="space-y-2">
                      <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-[11px] text-teal-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                        <span>Job in progress. Carry out repair cleanly and test work.</span>
                      </div>
                      <button
                        onClick={() => completeJob(job.id)}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        ✅ Service Finished · Mark COMPLETED
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. HISTORY & EARNINGS TAB */}
      {mobileTechnicianTab === 'history' && (
        <div className="space-y-3">
          {/* Earnings summary card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-xs space-y-2">
            <div className="text-xs text-slate-400">Total Buxar Earnings</div>
            <div className="text-2xl font-extrabold font-display tabular-nums text-emerald-400">
              ₹{totalEarnings}
            </div>
            <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1 border-t border-slate-700/60">
              <span>{historyJobs.filter((b) => b.status === 'COMPLETED').length} Jobs Completed</span>
              <span>Next payout every Monday</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-xs text-slate-700">Completed Service Log</h4>
            {historyJobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-xs text-slate-500">
                No past jobs recorded yet.
              </div>
            ) : (
              historyJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl border border-slate-200 p-3 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{job.specificIssue}</span>
                      <div className="text-[11px] text-slate-500">
                        {job.customerName} · {job.buxarArea}
                      </div>
                    </div>
                    <span className="font-bold text-emerald-800 tabular-nums">
                      +₹{job.price}
                    </span>
                  </div>

                  {job.review && (
                    <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200 text-[11px] space-y-1">
                      <div className="flex items-center gap-1 text-amber-700 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>Customer rated {job.review.rating} / 5</span>
                      </div>
                      <p className="italic text-slate-700">"{job.review.comment}"</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectReasonModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-display font-bold text-base text-slate-900">
              Reject Request
            </h3>
            <p className="text-xs text-slate-500">
              The customer will be notified and this request will be re-routed to other technicians in Buxar.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Rejection
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option>Already on another job</option>
                <option>Location too far for immediate visit</option>
                <option>Required specialized tool not available today</option>
                <option>Customer time slot not suitable</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRejectReasonModalId(null)}
                className="flex-1 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectBooking(rejectReasonModalId, rejectReason);
                  setRejectReasonModalId(null);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
