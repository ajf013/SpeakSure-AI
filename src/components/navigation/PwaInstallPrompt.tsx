import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface PwaInstallPromptProps {
  deferredPrompt: any;
  onInstall: () => void;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ deferredPrompt, onInstall }) => {
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(() => {
    return localStorage.getItem('speaksure_pwa_banner_dismissed') === 'true';
  });

  useEffect(() => {
    // Check if app is already installed & running in Standalone PWA mode
    const inStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(inStandalone);

    // Detect iOS (iPhone / iPad / iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleIOS = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleIOS);
  }, []);

  if (isStandalone) return null; // Already running as PWA app

  const handleDismiss = () => {
    setBannerDismissed(true);
    localStorage.setItem('speaksure_pwa_banner_dismissed', 'true');
  };

  const handleTriggerInstall = () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else if (deferredPrompt) {
      onInstall();
    } else {
      // Fallback modal for Android / Desktop if beforeinstallprompt is waiting
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {/* Top Smart PWA Install Banner */}
      {!bannerDismissed && (
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border-b border-indigo-500/30 px-4 py-3 text-white sticky top-0 z-30 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs md:text-sm font-extrabold text-white">Install SpeakSure AI App</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Fast & Offline
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {isIOS
                    ? 'Install SpeakSure on your iPhone / iPad home screen for mobile voice practice.'
                    : 'Get the native app experience on Android & Desktop with fast voice practice.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleTriggerInstall}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isIOS ? 'How to Install' : 'Install App'}</span>
              </button>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS & Mobile PWA Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-extrabold text-white">Install SpeakSure AI App</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              /* iOS Safari Installation Steps */
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Apple Safari requires a quick 2-step setup to add SpeakSure AI to your iPhone or iPad home screen:
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>Tap the Share Button</span>
                        <Share className="w-4 h-4 text-indigo-400 inline" />
                      </div>
                      <p className="text-slate-400 mt-0.5">
                        Look at the bottom toolbar in Safari and tap the square Share icon.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>Select 'Add to Home Screen'</span>
                        <PlusSquare className="w-4 h-4 text-purple-400 inline" />
                      </div>
                      <p className="text-slate-400 mt-0.5">
                        Scroll down the menu and tap <strong>Add to Home Screen</strong>, then tap <strong>Add</strong> in top right.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300 text-center font-medium">
                  🎉 SpeakSure AI will launch as a native full-screen app from your home screen!
                </div>
              </div>
            ) : (
              /* Android & Chrome Installation Guidance */
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  To install SpeakSure AI on Android Chrome or Desktop Browser:
                </p>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-white mb-1">Option 1: Chrome Menu</div>
                    <p className="text-slate-400">
                      Tap the 3 dots menu (⋮) in the top right of Chrome ➔ select <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
