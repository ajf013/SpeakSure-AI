import React from 'react';
import { ShieldAlert, Lock, Clock, Building2, CreditCard, Sparkles, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';

export const SubscriptionLockOverlay: React.FC = () => {
  const { subscription, openPaymentModal, toggleDemoExpiryOverride } = useSubscription();
  const { profile } = useAuth();

  const handleNotifyManagement = () => {
    const subject = encodeURIComponent(`Renewal Request: SpeakSure AI 3-Month License for ${profile.college || subscription.collegeName}`);
    const body = encodeURIComponent(
      `Respected Management / Principal / Placement Officer,\n\nOur college 3-month (1 semester) institutional subscription for SpeakSure AI has expired. Please renew the license so students can continue placement interview preparation.\n\nThank you,\n${profile.name} (${profile.course})`
    );
    window.open(`mailto:${subscription.purchasedByEmail || 'management@college.edu.in'}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="w-full my-6 p-6 md:p-10 rounded-3xl bg-slate-900/95 border-2 border-rose-500/40 shadow-2xl backdrop-blur-xl relative overflow-hidden text-slate-100 space-y-6">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-rose-600/10 blur-3xl pointer-events-none"></div>

      {/* Lock Banner Icon & Headline */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20 animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                Institutional Subscription Expired
              </span>
              <span className="text-xs font-semibold text-slate-400">1 Semester (3 Months) Limit Reached</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1">
              College Access Pass Expired – Renewal Required
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              This application was purchased by college management for <strong className="text-amber-300 font-bold">1 Semester (3 Months)</strong> for {subscription.collegeName || profile.college || 'your college'}. The 90-day access period has completed.
            </p>
          </div>
        </div>

        <button
          onClick={openPaymentModal}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-indigo-600 to-purple-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-rose-600/30 shrink-0 hover:scale-105 transition-transform"
        >
          <CreditCard className="w-4 h-4" />
          <span>Renew 3-Month License</span>
        </button>
      </div>

      {/* Subscription Breakdown Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>Target Institution</span>
          </div>
          <div className="text-base font-extrabold text-white truncate">{subscription.collegeName || profile.college || 'College Management'}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Purchased by: {subscription.purchasedByName} ({subscription.purchasedByRole})</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Semester Duration</span>
          </div>
          <div className="text-base font-extrabold text-rose-400">0 Days Remaining</div>
          <div className="text-[11px] text-slate-400 mt-0.5">3 Months / 90 Days Completed</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span>Renewal Option</span>
          </div>
          <div className="text-base font-extrabold text-emerald-400">₹25,000 / 3 Months</div>
          <div className="text-[11px] text-slate-400 mt-0.5">50% OFF • Unlimited Students Access</div>
        </div>
      </div>

      {/* Action Buttons & Management Directives */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Are you a student or College Principal / CEO?</span>
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            College Management can renew immediately using UPI, Card, NetBanking or Purchase Order via the Payment Gateway.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleNotifyManagement}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
          >
            <Send className="w-3.5 h-3.5 text-indigo-400" />
            <span>Notify Placement Cell</span>
          </button>

          <button
            onClick={openPaymentModal}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Management Payment</span>
          </button>

          {/* Quick Demo Mode Switcher for presentation */}
          <button
            onClick={() => toggleDemoExpiryOverride(false)}
            className="px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-500/20"
            title="Toggle Demo Mode to Active Access"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Demo: Unlock Active Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
