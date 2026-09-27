import React from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerHome } from '../customer/CustomerHome';
import { CustomerBookings } from '../customer/CustomerBookings';
import { CustomerNotifications } from '../customer/CustomerNotifications';
import { CustomerProfile } from '../customer/CustomerProfile';
import { TechnicianDashboard } from '../technician/TechnicianDashboard';
import { AdminMobileView } from '../admin/AdminMobileView';
import {
  Home,
  CalendarCheck,
  Bell,
  User,
  Wrench,
  FileCheck2,
  Inbox,
  History,
  Smartphone,
  Maximize2,
  ShieldCheck,
  LayoutDashboard,
  FileText,
  SlidersHorizontal,
  Users,
} from 'lucide-react';

export const MobileAppShell: React.FC = () => {
  const {
    currentUser,
    activeRole,
    mobileCustomerTab,
    setMobileCustomerTab,
    mobileTechnicianTab,
    setMobileTechnicianTab,
    mobileAdminTab,
    setMobileAdminTab,
    showPhoneBezel,
    setShowPhoneBezel,
    loginAsRole,
    unreadNotificationsCount,
    bookings,
    technicians,
  } = useApp();

  const isCustomer = activeRole === 'CUSTOMER';
  const isTechnician = activeRole === 'TECHNICIAN';
  const isAdmin = activeRole === 'ADMIN';

  // Customer active count
  const customerActiveCount = bookings.filter(
    (b) =>
      b.customerId === currentUser.id &&
      ['REQUESTED', 'ACCEPTED', 'CONFIRMED', 'ON_THE_WAY', 'STARTED'].includes(b.status)
  ).length;

  const pendingApprovalsCount = technicians.filter(
    (t) => t.verificationStatus === 'PENDING'
  ).length;

  return (
    <div className="py-4 sm:py-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      {/* Top Controls Bar */}
      <div className="w-full max-w-md mb-3 px-2 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 pl-1">Role:</span>
          <button
            onClick={() => loginAsRole('CUSTOMER')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
              isCustomer
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👤 Customer
          </button>
          <button
            onClick={() => loginAsRole('TECHNICIAN')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
              isTechnician
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧑‍🔧 Tech
          </button>
          <button
            onClick={() => loginAsRole('ADMIN')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
              isAdmin
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛡️ Admin
          </button>
        </div>

        <button
          onClick={() => setShowPhoneBezel(!showPhoneBezel)}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
          title="Toggle phone bezel frame"
        >
          {showPhoneBezel ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="text-[11px]">Fluid</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px]">Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Android Device Container */}
      <div
        className={`w-full transition-all duration-300 ${
          showPhoneBezel
            ? 'max-w-[410px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800'
            : 'max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm'
        }`}
      >
        <div className="bg-[#f8fafc] rounded-[34px] overflow-hidden flex flex-col h-[740px] relative border border-slate-200/50">
          {/* Android Status Bar */}
          <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-700 select-none z-20">
            <span>09:41</span>
            {/* Camera cutout */}
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700/50" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono">5G</span>
              <span className="w-3.5 h-2 border border-slate-600 rounded-[2px] inline-block relative before:absolute before:inset-0.5 before:bg-slate-700" />
            </div>
          </div>

          {/* App Header Inside Android */}
          <div className="px-4 py-2 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg text-white flex items-center justify-center font-display font-black text-xs ${
                  isAdmin ? 'bg-purple-900' : 'bg-emerald-800'
                }`}
              >
                B
              </div>
              <div>
                <div className="font-display font-bold text-xs text-slate-900 leading-tight">
                  Buxar Home Services
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {isCustomer
                    ? 'Customer App'
                    : isTechnician
                    ? 'Technician App'
                    : 'Admin Console · District Ops'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isCustomer
                    ? 'bg-blue-500'
                    : isTechnician
                    ? 'bg-emerald-500'
                    : 'bg-purple-600'
                }`}
              />
              <span className="font-semibold text-slate-700 text-xs">
                {currentUser.name.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Scrollable Main Content Area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 pb-20">
            {isCustomer && (
              <>
                {mobileCustomerTab === 'home' && <CustomerHome />}
                {mobileCustomerTab === 'bookings' && <CustomerBookings />}
                {mobileCustomerTab === 'notifications' && <CustomerNotifications />}
                {mobileCustomerTab === 'profile' && <CustomerProfile />}
              </>
            )}

            {isTechnician && (
              <>
                {mobileTechnicianTab === 'profile' ? (
                  <CustomerProfile />
                ) : (
                  <TechnicianDashboard />
                )}
              </>
            )}

            {isAdmin && <AdminMobileView />}
          </div>

          {/* Android Bottom Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-2 py-1.5">
            {isCustomer && (
              <div className="grid grid-cols-4 items-center h-14">
                <button
                  onClick={() => setMobileCustomerTab('home')}
                  className={`flex flex-col items-center justify-center py-1 transition-colors ${
                    mobileCustomerTab === 'home'
                      ? 'text-emerald-800 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5">Home</span>
                </button>

                <button
                  onClick={() => setMobileCustomerTab('bookings')}
                  className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
                    mobileCustomerTab === 'bookings'
                      ? 'text-emerald-800 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <CalendarCheck className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5">Bookings</span>
                  {customerActiveCount > 0 && (
                    <span className="absolute top-0.5 right-4 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                      {customerActiveCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setMobileCustomerTab('notifications')}
                  className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
                    mobileCustomerTab === 'notifications'
                      ? 'text-emerald-800 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5">Alerts</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-0.5 right-4 w-2 h-2 bg-rose-500 rounded-full" />
                  )}
                </button>

                <button
                  onClick={() => setMobileCustomerTab('profile')}
                  className={`flex flex-col items-center justify-center py-1 transition-colors ${
                    mobileCustomerTab === 'profile'
                      ? 'text-emerald-800 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5">Profile</span>
                </button>
              </div>
            )}

            {isTechnician && (
              <div className="grid grid-cols-4 items-center h-14">
                <button
                  onClick={() => setMobileTechnicianTab('requests')}
                  className={`flex flex-col items-center justify-center py-1 transition-colors ${
                    mobileTechnicianTab === 'requests'
                      ? 'text-emerald-800 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Inbox className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5">Requests</span>
                </button>

                <button
                  onClick={() => setMobileTechnicianTab('active_jobs')}
                  className={`flex flex-col items-center justify-center py-1 transition-colors ${
                    mobileTechnicianTab === 'active_jobs'
                      ? 'text-emerald-800 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileCheck2 className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5">Active Jobs</span>
                </button>

                <button
                  onClick={() => setMobileTechnicianTab('history')}
                  className={`flex flex-col items-center justify-center py-1 transition-colors ${
                    mobileTechnicianTab === 'history'
                      ? 'text-emerald-800 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <History className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5">Earnings</span>
                </button>

                <button
                  onClick={() => setMobileTechnicianTab('profile')}
                  className={`flex flex-col items-center justify-center py-1 transition-colors ${
                    mobileTechnicianTab === 'profile'
                      ? 'text-emerald-800 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5">Profile</span>
                </button>
              </div>
            )}

            {isAdmin && (
              <div className="grid grid-cols-5 items-center h-14">
                <button
                  onClick={() => setMobileAdminTab('overview')}
                  className={`flex flex-col items-center justify-center py-1 transition-colors ${
                    mobileAdminTab === 'overview'
                      ? 'text-purple-900 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="text-[9px] mt-0.5">Overview</span>
                </button>

                <button
                  onClick={() => setMobileAdminTab('bookings')}
                  className={`flex flex-col items-center justify-center py-1 transition-colors ${
                    mobileAdminTab === 'bookings'
                      ? 'text-purple-900 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-[9px] mt-0.5">Bookings</span>
                </button>

                <button
                  onClick={() => setMobileAdminTab('technicians')}
                  className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
                    mobileAdminTab === 'technicians'
                      ? 'text-purple-900 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[9px] mt-0.5">KYC</span>
                  {pendingApprovalsCount > 0 && (
                    <span className="absolute top-0.5 right-2 w-3.5 h-3.5 bg-amber-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                      {pendingApprovalsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setMobileAdminTab('services')}
                  className={`flex flex-col items-center justify-center py-1 transition-colors ${
                    mobileAdminTab === 'services'
                      ? 'text-purple-900 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="text-[9px] mt-0.5">Rates</span>
                </button>

                <button
                  onClick={() => setMobileAdminTab('more')}
                  className={`flex flex-col items-center justify-center py-1 transition-colors ${
                    mobileAdminTab === 'more'
                      ? 'text-purple-900 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="text-[9px] mt-0.5">Users</span>
                </button>
              </div>
            )}

            {/* Android Navigation Bar Pill / Home Indicator */}
            <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
