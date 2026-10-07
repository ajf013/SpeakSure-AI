import React from 'react';
import {
  Building2,
  Clock,
  ShieldCheck,
  CreditCard,
  Key,
  Users,
  RefreshCw,
  CheckCircle2,
  Copy,
  ExternalLink,
  Mail,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useToast } from '../../context/ToastContext';

export const CollegeManagementPortal: React.FC = () => {
  const {
    subscription,
    daysRemaining,
    isExpired,
    isRenewalWindow,
    isDemoExpiredOverride,
    toggleDemoExpiryOverride,
    openPaymentModal
  } = useSubscription();

  const { showToast } = useToast();

  const handleCopyLicenseKey = () => {
    navigator.clipboard.writeText(subscription.licenseKey || 'CIT-2026-SEM1-8932');
    showToast('🔑 Institutional License Key copied to clipboard!', 'success');
  };

  const handleCopyStudentLink = () => {
    const link = `${window.location.origin}/join?license=${subscription.licenseKey || 'CIT-2026-SEM1-8932'}`;
    navigator.clipboard.writeText(link);
    showToast('🔗 Student Onboarding Link copied to clipboard!', 'success');
  };

  const daysPassed = 90 - daysRemaining;
  const progressPercent = Math.min(100, Math.max(0, Math.round((daysPassed / 90) * 100)));

  return (
    <div className="space-y-6">

      {/* Top Banner / License Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">

          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${
                isExpired
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : isRenewalWindow
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {isExpired
                  ? 'License Expired'
                  : isRenewalWindow
                  ? 'Renewal Window Open (Final 30 Days)'
                  : 'Active Institutional Pass'}
              </span>
              <span className="text-xs text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                50% OFF Offer
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Building2 className="w-8 h-8 text-indigo-400" />
              <span>{subscription.collegeName}</span>
            </h2>

            <p className="text-xs md:text-sm text-slate-300 flex items-center gap-2 flex-wrap">
              <span>Purchased by: <strong>{subscription.purchasedByName}</strong> ({subscription.purchasedByRole})</span>
              <span>•</span>
              <span>Email: <strong>{subscription.purchasedByEmail}</strong></span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            {/* Demo Toggle */}
            <button
              onClick={() => toggleDemoExpiryOverride()}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                isDemoExpiredOverride
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
              }`}
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              <span>{isDemoExpiredOverride ? 'Demo: Reset to Active State' : 'Demo: Simulate 3-Month Expiry'}</span>
            </button>

            {/* Buy Pass vs Renew Pass Button */}
            <button
              onClick={openPaymentModal}
              className={`px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 ${
                isRenewalWindow
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 shadow-amber-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isRenewalWindow ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Renew Pass (Final 30 Days Window)</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Pass</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 90-Day Semester Progress Ticker & Renewal Window Notice */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>3-Month Semester Duration (90 Days Total)</span>
            </span>
            <span className={`font-extrabold ${isExpired ? 'text-rose-400' : isRenewalWindow ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isExpired
                ? '0 Days Remaining (Expired)'
                : `${daysRemaining} Days Remaining ${isRenewalWindow ? '(Renewal Window Open)' : ''}`}
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isExpired
                  ? 'bg-rose-500'
                  : isRenewalWindow
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
              }`}
              style={{ width: isExpired ? '100%' : `${progressPercent}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
            <span>Purchase Date: {new Date(subscription.purchaseDate).toLocaleDateString()}</span>
            <span>Renewal Window: Active 1 Month (30 Days) before expiry</span>
            <span>Expiry Date: {new Date(subscription.expiryDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Institutional License Key Box */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Key className="w-4 h-4" />
            <span>Institutional License Key</span>
          </div>
          <div>
            <div className="text-xl font-mono font-extrabold text-white tracking-widest bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
              <span>{subscription.licenseKey || 'CIT-2026-SEM1-8932'}</span>
              <button
                onClick={handleCopyLicenseKey}
                className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 transition-colors"
                title="Copy License Key"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Share this license key or URL link with students to grant unlimited 90-day access under your college subscription.
          </p>
          <button
            onClick={handleCopyStudentLink}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700"
          >
            <ExternalLink className="w-4 h-4 text-indigo-400" />
            <span>Copy Student Portal Link</span>
          </button>
        </div>

        {/* Access Capacity Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Student Access Capacity</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">UNLIMITED</div>
            <div className="text-xs text-emerald-400 mt-1 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Any Student • Any Department
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Purchased for the entire institution. BCA, B.Tech, MCA, MBA, and placement aspirants can practice freely.
          </p>
        </div>

        {/* Pricing Plan Details (50% OFF Strikethrough ₹50,000 -> ₹25,000) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Subscription Rate</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold">
              50% OFF
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">₹25,000</span>
              <span className="text-base text-slate-500 line-through font-bold">₹50,000</span>
            </div>
            <div className="text-xs text-slate-300 font-semibold mt-1">Per 1 Semester (3 Months / 90 Days)</div>
          </div>
          <p className="text-xs text-slate-400">
            Includes AI Voice Coach, Interview Simulator, Group Discussions, Newspaper Speech, and placement telemetry.
          </p>
        </div>
      </div>

      {/* Official Email Receipt Notice (Replaces Invoices Table) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Official Email Payment Receipts & Invoices</span>
              <span className="text-xs text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                Direct Email Dispatch
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Upon payment completion, formal payment receipts & tax invoices are automatically dispatched directly to the purchaser's official email address (<strong>{subscription.purchasedByEmail}</strong>).
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>Default Payment UPI ID for Scans:</span>
            <span className="font-mono text-emerald-400 font-bold">9113811578@upi</span>
          </div>
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>Renewal Policy:</span>
            <span className="text-amber-300">Active 1 Month (30 Days) before 3-month expiry</span>
          </div>
        </div>
      </div>

    </div>
  );
};
