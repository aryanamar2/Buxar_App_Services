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
  HelpCircle,
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  if (!isOpen) return null;

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : 'https://ais-dev-sg5blupkmuhx4bmyp7grru-654570558182.asia-southeast1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Install Buxar Home Services (Free)
              </h3>
              <p className="text-xs text-emerald-200">
                Native home screen app · Fast & offline enabled
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
          {/* Direct Install Button if supported by current browser context */}
          {isInstallable && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 text-center">
              <div className="font-bold text-emerald-950 text-sm">
                Ready to install on this device!
              </div>
              <p className="text-emerald-800 text-xs">
                Tap below to add Buxar Home Services directly to your phone screen.
              </p>
              <button
                onClick={async () => {
                  const success = await install();
                  if (success) onClose();
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Install Native Android App Now</span>
              </button>
            </div>
          )}

          {/* Quick Copy Link */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-emerald-700" />
              Live URL for Phone
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
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Standard Installation Instructions */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              How to Install in 2 Simple Steps:
            </div>
            <ol className="list-decimal pl-4 space-y-1.5 text-slate-700 text-[11px] leading-relaxed">
              <li>
                Open the link directly in <b>Google Chrome</b> on your Android phone.
              </li>
              <li>
                Tap the <b>three dots menu (⋮)</b> in the top right corner of Chrome.
              </li>
              <li>
                Tap <b>"Install app"</b> or <b>"Add to Home screen"</b>.
              </li>
              <li>
                Tap <b>Add / Install</b>. The Buxar Home Services icon appears on your home screen!
              </li>
            </ol>
          </div>

          {/* Why "App cannot be installed" happens & How to fix it */}
          <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 space-y-2 text-amber-950">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xs flex items-center gap-1.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Fixing &quot;This app cannot be installed&quot;</span>
              </div>
              <button
                onClick={() => setShowTroubleshooting(!showTroubleshooting)}
                className="text-[11px] text-amber-800 underline font-semibold"
              >
                {showTroubleshooting ? 'Hide' : 'Show Solutions'}
              </button>
            </div>

            <p className="text-[11px] text-amber-800 leading-relaxed">
              If your phone shows &quot;This app cannot be installed&quot;, check these 2 common causes:
            </p>

            {(showTroubleshooting || true) && (
              <ul className="space-y-2 text-[11px] text-amber-900 pl-2 border-l-2 border-amber-300">
                <li>
                  <b>1. Opened inside WhatsApp or Facebook browser?</b>
                  <p className="text-amber-800 mt-0.5">
                    WhatsApp&apos;s built-in browser blocks app installation. Tap the <b>three dots (⋮)</b> in the WhatsApp browser and select <b>&quot;Open in Chrome&quot;</b> first.
                  </p>
                </li>
                <li>
                  <b>2. Use &quot;Add to Home Screen&quot; shortcut:</b>
                  <p className="text-amber-800 mt-0.5">
                    In Chrome menu (⋮), tap <b>&quot;Add to Home screen&quot;</b>. This bypasses the Google Play WebAPK verification and installs the standalone app immediately!
                  </p>
                </li>
                <li>
                  <b>3. Updated High-Res Icons:</b>
                  <p className="text-amber-800 mt-0.5">
                    We just generated Android-compliant 192x192 and 512x512 PNG icons and manifest rules, so fresh installation in Chrome works smoothly.
                  </p>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>Works on all Android & iOS devices</span>
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
