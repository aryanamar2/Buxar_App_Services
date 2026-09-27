import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { BUXAR_AREAS } from '../../data/mockData';
import {
  X,
  User,
  ShieldCheck,
  Wrench,
  Lock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: Role;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'CUSTOMER',
}) => {
  const { registerUser, loginAsRole, categories, showToast } = useApp();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('REGISTER');
  const [role, setRole] = useState<Role>(initialRole);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat_plumbing');
  const [experienceYears, setExperienceYears] = useState(4);
  const [baseArea, setBaseArea] = useState(BUXAR_AREAS[0]);
  const [aadhaarNumber, setAadhaarNumber] = useState('XXXX-XXXX-8921');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Please fill in required fields');
      return;
    }

    registerUser({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@buxar.in`,
      phone,
      role,
      categoryId: role === 'TECHNICIAN' ? categoryId : undefined,
      experienceYears: role === 'TECHNICIAN' ? experienceYears : undefined,
      baseArea: role === 'TECHNICIAN' ? baseArea : undefined,
    });

    onClose();
  };

  const handleQuickLogin = (targetRole: Role) => {
    loginAsRole(targetRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">
              {mode === 'REGISTER' ? 'Create Buxar Account' : 'Welcome Back'}
            </h3>
            <p className="text-xs text-slate-500">
              {mode === 'REGISTER'
                ? 'Join as Customer or Local Service Technician'
                : 'Select your registered profile'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher: Customer vs Technician */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                role === 'CUSTOMER'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('TECHNICIAN')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                role === 'TECHNICIAN'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Technician / Partner</span>
            </button>
          </div>

          {/* Quick Demo Logins for rapid testing */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="font-semibold text-slate-700 flex items-center justify-between">
              <span>Quick 1-Click Role Login:</span>
              <span className="text-[10px] text-emerald-700 font-bold">Instant Switch</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('CUSTOMER')}
                className="py-1.5 px-2 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg text-slate-800 text-[11px] font-medium text-center truncate"
              >
                👤 Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('TECHNICIAN')}
                className="py-1.5 px-2 bg-white hover:bg-amber-50 border border-slate-200 rounded-lg text-slate-800 text-[11px] font-medium text-center truncate"
              >
                🧑‍🔧 Technician
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="py-1.5 px-2 bg-white hover:bg-purple-50 border border-slate-200 rounded-lg text-slate-800 text-[11px] font-medium text-center truncate"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2 text-[10px] text-slate-400 font-medium uppercase absolute">
              Or Register New Account
            </span>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'CUSTOMER' ? 'e.g. Amarjeet Kumar' : 'e.g. Rahul Kumar'}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98351..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@buxar.in"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-xs"
                />
              </div>
            </div>

            {/* Technician specific fields */}
            {role === 'TECHNICIAN' && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2.5">
                <div className="font-semibold text-amber-950 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-amber-700" />
                  Technician Skill & Verification Profile
                </div>

                <div>
                  <label className="block text-amber-900 font-medium mb-1">
                    Primary Trade / Skill
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2 rounded-lg border border-amber-200 bg-white text-slate-800 text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-amber-900 font-medium mb-1">
                      Years of Exp
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-amber-200 bg-white text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-900 font-medium mb-1">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full p-2 rounded-lg border border-amber-200 bg-white text-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-amber-900 font-medium mb-1">
                    Base Operational Area in Buxar
                  </label>
                  <select
                    value={baseArea}
                    onChange={(e) => setBaseArea(e.target.value)}
                    className="w-full p-2 rounded-lg border border-amber-200 bg-white text-slate-800 text-xs"
                  >
                    {BUXAR_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-[10px] text-amber-800/80 italic">
                  * Note: New technicians enter "PENDING" status until Admin reviews Aadhaar KYC.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              Complete Registration & Start
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
