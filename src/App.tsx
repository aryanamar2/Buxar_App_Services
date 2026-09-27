import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopHeader } from './components/layout/TopHeader';
import { MobileAppShell } from './components/mobile/MobileAppShell';
import { CustomerWebPortal } from './components/web/CustomerWebPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { BackendArchitectureViewer } from './components/code/BackendArchitectureViewer';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { viewMode, toastMessage } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header conforming to the 3-zone contract */}
      <TopHeader />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {viewMode === 'MOBILE_APP' && <MobileAppShell />}
        {viewMode === 'WEB_CUSTOMER' && <CustomerWebPortal />}
        {viewMode === 'ADMIN_PORTAL' && <AdminPortal />}
        {viewMode === 'CODE_ARCHITECTURE' && <BackendArchitectureViewer />}
      </main>

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500 space-y-1">
        <div className="font-semibold text-slate-700">
          Buxar Home Services Platform · Charitravan, Station Road, Golambar & Civil Lines
        </div>
        <p className="text-[11px] text-slate-400">
          Connecting verified local plumbers, electricians, AC technicians and carpenters in Buxar district, Bihar.
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
