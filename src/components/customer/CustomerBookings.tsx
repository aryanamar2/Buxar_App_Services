import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceBooking, BookingStatus } from '../../types';
import {
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { CategoryIcon } from '../common/IconHelper';

export const CustomerBookings: React.FC = () => {
  const { bookings, currentUser, cancelBooking, confirmBooking, submitReview, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const myBookings = bookings.filter((b) => b.customerId === currentUser.id);

  const activeBookings = myBookings.filter((b) =>
    ['REQUESTED', 'ACCEPTED', 'CONFIRMED', 'ON_THE_WAY', 'STARTED'].includes(b.status)
  );

  const historyBookings = myBookings.filter((b) =>
    ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(b.status)
  );

  const currentList = activeTab === 'ACTIVE' ? activeBookings : historyBookings;

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'REQUESTED':
        return {
          text: 'Request Sent · Awaiting Technician',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'ACCEPTED':
        return {
          text: 'Technician Accepted!',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'CONFIRMED':
        return {
          text: 'Appointment Confirmed',
          color: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'ON_THE_WAY':
        return {
          text: 'Technician On The Way',
          color: 'bg-indigo-50 text-indigo-800 border-indigo-200 animate-pulse',
        };
      case 'STARTED':
        return {
          text: 'Service In Progress',
          color: 'bg-teal-50 text-teal-800 border-teal-200',
        };
      case 'COMPLETED':
        return {
          text: 'Service Completed',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'CANCELLED':
        return {
          text: 'Cancelled',
          color: 'bg-slate-100 text-slate-600 border-slate-200',
        };
      case 'REJECTED':
        return {
          text: 'Technician Unavailable',
          color: 'bg-rose-50 text-rose-700 border-rose-200',
        };
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBookingId) return;
    submitReview(reviewBookingId, rating, comment);
    setReviewBookingId(null);
    setComment('');
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Segmented Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'ACTIVE'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active Services ({activeBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'HISTORY'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Past History ({historyBookings.length})
        </button>
      </div>

      {currentList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-slate-800">
              No {activeTab.toLowerCase()} bookings found
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {activeTab === 'ACTIVE'
                ? 'Select a service from Home to book your first verified local technician in Buxar.'
                : 'Your completed or past bookings will appear here.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((booking) => {
            const badge = getStatusBadge(booking.status);
            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3.5"
              >
                {/* Header line */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-slate-400">
                        {booking.bookingNumber}
                      </span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="font-semibold text-xs text-slate-900">
                        {booking.serviceCategoryName}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                      {booking.specificIssue}
                    </h4>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}
                  >
                    {badge.text}
                  </span>
                </div>

                {/* Problem description & Address */}
                <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 space-y-1.5 border border-slate-100">
                  <p className="line-clamp-2 italic text-slate-700">
                    "{booking.problemDescription}"
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{booking.customerAddress} ({booking.buxarArea})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Slot: {booking.preferredDate} · {booking.preferredTimeSlot}</span>
                  </div>
                </div>

                {/* Workflow Status Timeline */}
                <div className="py-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
                    <span className={booking.status === 'REQUESTED' ? 'font-bold text-emerald-800' : ''}>
                      1. Requested
                    </span>
                    <span
                      className={
                        ['ACCEPTED', 'CONFIRMED'].includes(booking.status) ? 'font-bold text-emerald-800' : ''
                      }
                    >
                      2. Confirmed
                    </span>
                    <span className={booking.status === 'ON_THE_WAY' ? 'font-bold text-indigo-700' : ''}>
                      3. On Way
                    </span>
                    <span className={booking.status === 'STARTED' ? 'font-bold text-teal-700' : ''}>
                      4. Working
                    </span>
                    <span className={booking.status === 'COMPLETED' ? 'font-bold text-emerald-800' : ''}>
                      5. Completed
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-500 ${
                        booking.status === 'REQUESTED'
                          ? 'w-1/5 bg-amber-500'
                          : ['ACCEPTED', 'CONFIRMED'].includes(booking.status)
                          ? 'w-2/5 bg-emerald-600'
                          : booking.status === 'ON_THE_WAY'
                          ? 'w-3/5 bg-indigo-600'
                          : booking.status === 'STARTED'
                          ? 'w-4/5 bg-teal-600'
                          : booking.status === 'COMPLETED'
                          ? 'w-full bg-emerald-600'
                          : 'w-full bg-slate-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Assigned Technician Card if assigned */}
                {booking.technicianName && (
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center text-xs">
                        {booking.technicianName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                          {booking.technicianName}
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Assigned Technician · {booking.technicianPhone}
                        </div>
                      </div>
                    </div>

                    <a
                      href={`tel:${booking.technicianPhone}`}
                      onClick={(e) => {
                        e.preventDefault();
                        showToast(`Calling ${booking.technicianName} (${booking.technicianPhone})...`);
                      }}
                      className="w-8 h-8 rounded-full bg-white text-emerald-800 shadow-xs flex items-center justify-center hover:bg-emerald-100 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* OTP Security Notice when technician is on the way or started */}
                {['ON_THE_WAY', 'STARTED'].includes(booking.status) && (
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-indigo-700" />
                      <div>
                        <div className="font-semibold text-indigo-950">Security Work OTP</div>
                        <div className="text-[11px] text-indigo-700">
                          Share with technician when they arrive
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-base font-extrabold tracking-widest text-indigo-900 bg-white px-3 py-1 rounded-lg border border-indigo-200">
                      {booking.otpCode}
                    </span>
                  </div>
                )}

                {/* Existing Review */}
                {booking.review && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-950">Your Rating</span>
                      <div className="flex items-center text-amber-600">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < booking.review!.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-700 italic">
                      "{booking.review.comment}"
                    </p>
                  </div>
                )}

                {/* Contextual Action Buttons */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="font-bold text-slate-900">
                    Est. Base Fee: <span className="text-emerald-800">₹{booking.price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.status === 'ACCEPTED' && (
                      <button
                        onClick={() => confirmBooking(booking.id)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs transition-colors"
                      >
                        Confirm Slot
                      </button>
                    )}

                    {['REQUESTED', 'ACCEPTED', 'CONFIRMED'].includes(booking.status) && (
                      <button
                        onClick={() => cancelBooking(booking.id, 'Cancelled by customer')}
                        className="px-3 py-1.5 text-slate-500 hover:text-rose-600 text-xs font-medium hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    {booking.status === 'COMPLETED' && !booking.review && (
                      <button
                        onClick={() => {
                          setReviewBookingId(booking.id);
                          setRating(5);
                          setComment('');
                        }}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        Rate & Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900">
                Rate Your Service
              </h3>
              <button
                onClick={() => setReviewBookingId(null)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div className="text-center space-y-2">
                <div className="text-xs text-slate-500">How was the technician's work?</div>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="font-bold text-slate-800 text-sm">
                  {rating === 5
                    ? 'Excellent ⭐⭐⭐⭐⭐'
                    : rating === 4
                    ? 'Very Good ⭐⭐⭐⭐'
                    : rating === 3
                    ? 'Average ⭐⭐⭐'
                    : 'Needs Improvement'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Comments & Feedback
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Rahul arrived on time, diagnosed the bathroom leakage quickly, and fixed it neatly."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReviewBookingId(null)}
                  className="flex-1 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
