import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';
import { BUXAR_AREAS } from '../../data/mockData';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CategoryIcon } from '../common/IconHelper';

interface BookingModalProps {
  category: ServiceCategory;
  onClose: () => void;
  targetTechnicianId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  category,
  onClose,
  targetTechnicianId,
}) => {
  const { currentUser, createBooking, technicians, setMobileCustomerTab } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedIssue, setSelectedIssue] = useState<string>(category.commonProblems[0] || '');
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [buxarArea, setBuxarArea] = useState<string>(BUXAR_AREAS[0]);
  const [customerAddress, setCustomerAddress] = useState<string>('House #42, Ganga Darshan Lane, Charitravan');
  const [preferredDate, setPreferredDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>('5:00 PM – 6:30 PM');
  const [urgency, setUrgency] = useState<'STANDARD' | 'URGENT'>('STANDARD');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_AFTER_SERVICE' | 'UPI_ONLINE'>('CASH_AFTER_SERVICE');
  const [photoUrl, setPhotoUrl] = useState<string>(category.image);

  const targetTech = targetTechnicianId
    ? technicians.find((t) => t.id === targetTechnicianId)
    : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemDescription.trim()) {
      return;
    }

    createBooking({
      serviceCategoryId: category.id,
      specificIssue: selectedIssue,
      problemDescription,
      buxarArea,
      customerAddress,
      preferredDate,
      preferredTimeSlot,
      urgency,
      paymentMethod,
      photoUrl,
      targetTechnicianId,
    });

    setMobileCustomerTab('bookings');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CategoryIcon name={category.iconName} className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Book {category.name}
              </h3>
              <p className="text-xs text-slate-500">
                Inspection & Visiting base fee: <span className="font-semibold text-emerald-700">₹{category.basePrice}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {targetTech && (
            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center">
                {targetTech.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900">{targetTech.name}</div>
                <div className="text-[11px] text-slate-600">
                  Direct assignment · ⭐ {targetTech.rating} ({targetTech.completedJobsCount} jobs completed)
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Common Issue or Requirement
                </label>
                <div className="space-y-1.5">
                  {category.commonProblems.map((prob) => {
                    const isSelected = selectedIssue === prob;
                    return (
                      <button
                        type="button"
                        key={prob}
                        onClick={() => setSelectedIssue(prob)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/60 font-medium text-emerald-950'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>{prob}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Describe Problem in Detail *
                </label>
                <textarea
                  required
                  rows={2}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="e.g. Water dripping continuously from bathroom shower valve, need washer or valve replacement..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Problem Photo (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={photoUrl}
                    alt="Problem attachment"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1.5 flex-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold cursor-pointer transition-colors">
                      <Camera className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Take Photo / Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (reader.result) {
                                setPhotoUrl(reader.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <div className="text-[10px] text-slate-400">
                      Helps the technician bring exact valves, wires, or parts.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!problemDescription) {
                      setProblemDescription(`Issue with ${selectedIssue}. Need home visit in Buxar.`);
                    }
                    setStep(2);
                  }}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  Continue to Address & Schedule →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Locality in Buxar
                </label>
                <select
                  value={buxarArea}
                  onChange={(e) => setBuxarArea(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-xs bg-white text-slate-800"
                >
                  {BUXAR_AREAS.map((area) => (
                    <option key={area} value={area}>
                      📍 {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full House / Landmark Address
                </label>
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="e.g. Near Shiv Mandir, Ward 8, Charitravan, Buxar"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-xs bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-xs bg-white text-slate-800"
                  >
                    <option>9:00 AM – 10:30 AM</option>
                    <option>11:00 AM – 12:30 PM</option>
                    <option>2:00 PM – 3:30 PM</option>
                    <option>5:00 PM – 6:30 PM</option>
                    <option>7:00 PM – 8:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urgency
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setUrgency('STANDARD')}
                      className={`flex-1 p-2 rounded-xl border text-center text-xs font-medium transition-all ${
                        urgency === 'STANDARD'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgency('URGENT')}
                      className={`flex-1 p-2 rounded-xl border text-center text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                        urgency === 'URGENT'
                          ? 'border-amber-600 bg-amber-50 text-amber-900'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <Zap className="w-3 h-3 text-amber-600" />
                      Urgent (60m)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:outline-emerald-600 text-xs bg-white text-slate-800"
                  >
                    <option value="CASH_AFTER_SERVICE">💵 Cash After Service</option>
                    <option value="UPI_ONLINE">📱 UPI / QR on Completion</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex justify-between text-slate-800 font-semibold">
                  <span>Standard Visiting & Inspection:</span>
                  <span>₹{category.basePrice}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  * Spare parts (valves, wires, filters) quoted transparently on site before installation.
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Confirm & Send Request to Technicians
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
