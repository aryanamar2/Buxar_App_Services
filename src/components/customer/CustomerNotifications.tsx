import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, Clock } from 'lucide-react';

export const CustomerNotifications: React.FC = () => {
  const { notifications, currentUser, markAllNotificationsRead, setMobileCustomerTab } = useApp();

  const userNotifs = notifications.filter(
    (n) => n.targetRole === 'CUSTOMER' && n.targetUserId === currentUser.id
  );

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-base text-slate-900">Notifications</h3>
          <p className="text-xs text-slate-500">Live service updates for your requests</p>
        </div>
        {userNotifs.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
          >
            Mark all read
          </button>
        )}
      </div>

      {userNotifs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500">No new notifications.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {userNotifs.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.bookingId) setMobileCustomerTab('bookings');
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                item.read
                  ? 'bg-white border-slate-200 text-slate-700'
                  : 'bg-emerald-50/60 border-emerald-200 text-slate-900 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-xs">{item.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
