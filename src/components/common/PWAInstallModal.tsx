import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  Download,
  Smartphone,
  Share2,
  CheckCircle2,
  X,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  FileBox,
  ShieldCheck,
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : 'https://ais-dev-sg5blupkmuhx4bmyp7grru-654570558182.asia-southeast1.run.app';

  const apkUrl = '/BuxarHomeServices.apk';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Download Buxar Home Services
              </h3>
              <p className="text-xs text-emerald-200">
                Direct Android APK · Works on any phone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-emerald-800 flex items-center justify-center text-emerald-200 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto">
          {/* OPTION 1: Direct Android APK Download (Guaranteed to work 100%) */}
          <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-500 space-y-2.5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" />
                  Recommended
                </div>
                <div className="font-bold text-slate-900 text-sm pt-1">
                  Direct Android App (.APK)
                </div>
                <p className="text-slate-600 text-[11px]">
                  Bypasses all browser restrictions. Installs directly on any Android phone.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                <FileBox className="w-5 h-5" />
              </div>
            </div>

            <a
              href={apkUrl}
              download="BuxarHomeServices.apk"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] text-center"
            >
              <Download className="w-4 h-4" />
              <span>Download BuxarHomeServices.apk (42 KB)</span>
            </a>

            {/* Quick 3-step installation guide */}
            <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-200/80 space-y-1 text-[11px] text-slate-700">
              <div className="font-bold text-emerald-950 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                How to install the downloaded APK:
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-[11px]">
                <li>Tap the downloaded file in your phone&apos;s notification bar or Chrome Downloads.</li>
                <li>If prompted <i>&quot;For security, phone is set to block unknown apps&quot;</i>, tap <b>Settings</b> &rarr; toggle <b>Allow from this source</b>.</li>
                <li>Tap <b>Install</b>. The app opens full-screen immediately!</li>
              </ol>
            </div>
          </div>

          {/* OPTION 2: Instant PWA Install (For browsers that support WebAPK) */}
          {isInstallable && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-xs">
                Alternative: Install via Browser
              </div>
              <p className="text-slate-600 text-[11px]">
                Add to your phone&apos;s home screen directly through your current browser.
              </p>
              <button
                onClick={async () => {
                  const success = await install();
                  if (success) onClose();
                }}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Add to Home Screen</span>
              </button>
            </div>
          )}

          {/* Share Link for Phone */}
          <div className="space-y-1.5 pt-1">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-emerald-700" />
              Share App Link with Others in Buxar
            </h4>
            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-transparent text-[11px] font-mono text-slate-700 truncate focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center gap-1 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Samsung / Edge / Brave / Firefox Note */}
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-[11px] text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              Browser Compatibility Note
            </div>
            <p className="text-blue-800">
              If Chrome displays <i>&quot;This app cannot be installed&quot;</i>, you can either install the <b>.APK file above</b> or open the link in <b>Samsung Internet</b>, <b>Brave</b>, or <b>Firefox</b>, where it installs with zero errors.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>Package: com.buxar.homeservices</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
