import React, { useState } from 'react';
import { User, Shield, Save, Trash2, Download, AlertTriangle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storageService';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, logout } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone || '',
    college: profile.college,
    course: profile.course,
    graduationYear: profile.graduationYear,
    targetRole: profile.targetRole,
    englishLevel: profile.englishLevel,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    showToast('✨ Student profile updated successfully!', 'success');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete your local conversation history and practice data?')) {
      storageService.clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Student Profile & Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize your college details, target role, and privacy settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white mb-4">Academic & Placement Profile</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Full Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Email Address:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">College Name:</label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Degree & Branch:</label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              placeholder="e.g. BCA, B.Tech CS, MCA, MBA"
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Graduation Year:</label>
            <input
              type="number"
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2027 })}
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Target Job Role:</label>
            <input
              type="text"
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              placeholder="e.g. Cloud Engineer, Software Developer"
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>

      {/* Privacy & Data Controls */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          <span>Privacy & Account Controls</span>
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed">
          Your privacy is sacred. SpeakSure AI processes audio locally or via encrypted cloud APIs. We never permanently store audio recordings or share video feeds.
        </p>

        <div className="pt-4 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold flex items-center gap-2"
          >
            <LogOut className="w-4 h-4 text-indigo-400" />
            <span>Sign Out of Account</span>
          </button>

          <button
            type="button"
            onClick={handleClearData}
            className="px-5 py-2.5 rounded-xl bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/40 text-xs font-bold flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete My Data & Reset History</span>
          </button>
        </div>
      </div>
    </div>
  );
};
