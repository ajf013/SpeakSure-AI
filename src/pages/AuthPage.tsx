import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/react';
import { Mic, ArrowRight, Shield, Key, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [localEmail, setLocalEmail] = useState<string>('');
  const [localName, setLocalName] = useState<string>('');

  const handleDevBypass = (e: React.FormEvent) => {
    e.preventDefault();
    login(localEmail, localName);
    showToast(`Signed in as ${localName}`, 'success');
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">SpeakSure AI</h2>
          <p className="text-xs text-slate-400">
            {publishableKey ? 'Authenticate with your Clerk Account' : 'Clerk Authentication Setup'}
          </p>
        </div>

        {publishableKey ? (
          /* Real Clerk Login UI */
          <div className="flex justify-center">
            {isSignUp ? (
              <SignUp
                fallbackRedirectUrl="/"
                signInUrl="#"
                appearance={{
                  elements: {
                    card: 'bg-slate-900 border-none shadow-none text-white',
                    headerTitle: 'text-white font-bold',
                    headerSubtitle: 'text-slate-400',
                    socialButtonsBlockButton: 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700',
                    formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold',
                    formFieldInput: 'bg-slate-950 border-slate-800 text-white',
                    footerActionLink: 'text-indigo-400 font-bold hover:underline',
                  },
                }}
              />
            ) : (
              <SignIn
                fallbackRedirectUrl="/"
                signUpUrl="#"
                appearance={{
                  elements: {
                    card: 'bg-slate-900 border-none shadow-none text-white',
                    headerTitle: 'text-white font-bold',
                    headerSubtitle: 'text-slate-400',
                    socialButtonsBlockButton: 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700',
                    formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold',
                    formFieldInput: 'bg-slate-950 border-slate-800 text-white',
                    footerActionLink: 'text-indigo-400 font-bold hover:underline',
                  },
                }}
              />
            )}
          </div>
        ) : (
          /* Clerk Setup Instructions for Development */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-2">
              <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-indigo-400" />
                <span>How to connect your Clerk App:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                <li>Go to <a href="https://dashboard.clerk.com/apps" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-bold">dashboard.clerk.com/apps</a></li>
                <li>Copy your <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300 font-mono">Publishable Key</code> (starts with <span className="font-mono text-emerald-400">pk_test_...</span>).</li>
                <li>Add it to your <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300 font-mono">.env</code> file:</li>
              </ol>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 select-all overflow-x-auto">
                VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[10px] text-slate-500 uppercase font-bold">Development Fast Sign In</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Quick dev bypass form until key added */}
            <form onSubmit={handleDevBypass} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Student Name:</label>
                <input
                  type="text"
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email:</label>
                <input
                  type="email"
                  value={localEmail}
                  onChange={(e) => setLocalEmail(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to SpeakSure Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
