import React, { useState } from 'react';
import { Shield, X, ArrowRight, KeyRound, Building2, User, UserCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { CollegeManagementRole } from '../../types';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { subscription, purchase3MonthPass } = useSubscription();
  const { showToast } = useToast();

  const [collegeName, setCollegeName] = useState<string>(subscription.collegeName || 'Coimbatore Institute of Technology');
  const [personName, setPersonName] = useState<string>(subscription.purchasedByName || 'Dr. R. Sundararajan');
  const [designation, setDesignation] = useState<CollegeManagementRole>(subscription.purchasedByRole || 'Principal');
  const [passcode, setPasscode] = useState<string>('');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    if (!collegeName.trim() || !personName.trim()) {
      showToast('Please enter your College Name and Person Name.', 'info');
      return;
    }

    // Valid Admin Passcodes
    if (passcode.trim() === 'ADMIN2026' || passcode.trim() === '123456' || passcode.trim().toLowerCase() === 'admin') {
      localStorage.setItem('speaksure_admin_unlocked', 'true');
      
      // Update subscription context with admin details
      purchase3MonthPass({
        collegeName,
        purchaserName: personName,
        purchaserRole: designation,
        purchaserEmail: subscription.purchasedByEmail || 'management@college.edu.in',
        paymentMethod: subscription.paymentMethod || 'Razorpay UPI (9113811578@upi)',
        amount: subscription.amountPaid || 25000
      });

      showToast(`🔒 Welcome ${personName} (${designation}) - Management Portal Unlocked!`, 'success');
      onSuccess();
      onClose();
    } else {
      showToast('Incorrect Management Passcode. (Try: ADMIN2026)', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">College Management Verification</h3>
              <p className="text-xs text-slate-400">Enter College Details & Passcode</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          
          {/* 1. College Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>College / Institution Name *</span>
            </label>
            <input
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="e.g. Coimbatore Institute of Technology"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* 2. Person Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Person Name *</span>
            </label>
            <input
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="e.g. Dr. R. Sundararajan"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* 3. Designation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Designation *</span>
            </label>
            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value as CollegeManagementRole)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Principal">Principal</option>
              <option value="CEO">CEO</option>
              <option value="Chairman">Chairman</option>
              <option value="Placement Director">Placement Director</option>
              <option value="Management Admin">Management Admin</option>
            </select>
          </div>

          {/* 4. Passcode */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Management Passcode *</span>
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode (e.g. ADMIN2026)"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">Default Demo Passcode: <code className="text-indigo-400">ADMIN2026</code></p>
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <span>Verify & Unlock Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
