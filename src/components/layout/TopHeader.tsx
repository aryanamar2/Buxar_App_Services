import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';
import {
  Smartphone,
  Globe,
  ShieldAlert,
  Code2,
  RotateCcw,
  UserCheck,
  ChevronDown,
  UserPlus,
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';

export const TopHeader: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    currentUser,
    users,
    switchUser,
    loginAsRole,
    resetAllDemoData,
    unreadNotificationsCount,
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navItems: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'MOBILE_APP', label: 'Android App', icon: <Smartphone className="w-4 h-4" /> },
    { mode: 'WEB_CUSTOMER', label: 'Web Portal', icon: <Globe className="w-4 h-4" /> },
    { mode: 'ADMIN_PORTAL', label: 'Admin Console', icon: <ShieldAlert className="w-4 h-4" /> },
    { mode: 'CODE_ARCHITECTURE', label: 'Spring & Android Code', icon: <Code2 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('MOBILE_APP')}
            className="text-left font-display font-extrabold text-lg sm:text-xl tracking-tight text-emerald-900 hover:text-emerald-800 transition-colors"
          >
            Buxar Home Services
          </button>
          <span className="hidden lg:inline text-xs text-slate-400 font-normal">
            · Buxar, Bihar
          </span>
        </div>

        {/* Zone 2: Navigation Modes */}
        <nav className="flex items-center gap-1 sm:gap-1.5 p-1 bg-slate-100 rounded-xl">
          {navItems.map((item) => {
            const isActive = viewMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => setViewMode(item.mode)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: User Profile & Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => setShowAuthModal(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up / Register</span>
          </button>

          {/* Quick User Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-700 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-900 truncate max-w-[100px] sm:max-w-[130px]">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                {currentUser.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role
                </div>
                <div className="space-y-0.5 px-1.5">
                  {users.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg text-left transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            u.role === 'CUSTOMER'
                              ? 'bg-blue-50 text-blue-700'
                              : u.role === 'TECHNICIAN'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-purple-50 text-purple-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 my-1 pt-1 px-1.5">
                  <button
                    onClick={() => {
                      resetAllDemoData();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset All Demo Bookings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
};
