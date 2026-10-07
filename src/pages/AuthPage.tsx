import React, { useState, useEffect } from 'react';
import { SignIn, SignUp } from '@clerk/react';
import { Mic, ArrowRight, Key, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  const [isSignUp, setIsSignUp] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get('auth') || params.get('mode');
      return authParam === 'signup' || window.location.hash.includes('signup');
    }
    return false;
  });

  const [localEmail, setLocalEmail] = useState<string>('');
  const [localName, setLocalName] = useState<string>('');

  // Sync mode with URL query params & popstate
  useEffect(() => {
    const handleUrlSync = () => {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get('auth') || params.get('mode');
      if (authParam === 'signup' || window.location.hash.includes('signup')) {
        setIsSignUp(true);
      } else if (authParam === 'signin' || window.location.hash.includes('signin')) {
        setIsSignUp(false);
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, []);

  const toggleAuthMode = (signUpMode: boolean) => {
    setIsSignUp(signUpMode);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('auth', signUpMode ? 'signup' : 'signin');
    window.history.pushState({}, '', newUrl.toString());
  };

  // Intercept click on Clerk footer links ("Don't have an account? Sign up")
  const handleClerkContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const linkEl = target.closest('a') || target.closest('button') || target;
    const href = linkEl.getAttribute('href') || '';
    const text = (linkEl.textContent || '').toLowerCase();

    if (href.includes('signup') || href.includes('sign-up') || text.includes('sign up')) {
      e.preventDefault();
      e.stopPropagation();
      toggleAuthMode(true);
    } else if (href.includes('signin') || href.includes('sign-in') || text.includes('sign in')) {
      e.preventDefault();
      e.stopPropagation();
      toggleAuthMode(false);
    }
  };

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
            {publishableKey
              ? isSignUp
                ? 'Create your SpeakSure AI Account'
                : 'Sign in to your SpeakSure AI Account'
              : 'Clerk Authentication Setup'}
          </p>

          {/* Mode Switcher Buttons */}
          {publishableKey && (
            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold mt-3">
              <button
                type="button"
                onClick={() => toggleAuthMode(false)}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  !isSignUp ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => toggleAuthMode(true)}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  isSignUp ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>

        {publishableKey ? (
          /* Real Clerk Login & Signup UI with Intercepted Footer Links */
          <div className="flex justify-center cursor-pointer" onClick={handleClerkContainerClick}>
            {isSignUp ? (
              <SignUp
                fallbackRedirectUrl="/"
                signInUrl="?auth=signin"
                appearance={{
                  elements: {
                    card: 'bg-slate-900 border-none shadow-none text-white w-full',
                    headerTitle: 'text-white font-bold text-center',
                    headerSubtitle: 'text-slate-400 text-center',
                    socialButtonsBlockButton: 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700',
                    formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold',
                    formFieldInput: 'bg-slate-950 border-slate-800 text-white',
                    footerActionLink: 'text-indigo-400 font-bold hover:underline cursor-pointer',
                  },
                }}
              />
            ) : (
              <SignIn
                fallbackRedirectUrl="/"
                signUpUrl="?auth=signup"
                appearance={{
                  elements: {
                    card: 'bg-slate-900 border-none shadow-none text-white w-full',
                    headerTitle: 'text-white font-bold text-center',
                    headerSubtitle: 'text-slate-400 text-center',
                    socialButtonsBlockButton: 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700',
                    formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold',
                    formFieldInput: 'bg-slate-950 border-slate-800 text-white',
                    footerActionLink: 'text-indigo-400 font-bold hover:underline cursor-pointer',
                  },
                }}
              />
            )}
          </div>
        ) : (
          /* Clerk Setup Instructions */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-2">
              <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-indigo-400" />
                <span>How to connect your Clerk App:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                <li>Go to <a href="https://dashboard.clerk.com/apps" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-bold">dashboard.clerk.com/apps</a></li>
                <li>Copy your <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300 font-mono">Publishable Key</code> (starts with <span className="font-mono text-emerald-400">pk_live_...</span> or <span className="font-mono text-emerald-400">pk_test_...</span>).</li>
                <li>Add it to your Netlify Environment Variables as <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300 font-mono">VITE_CLERK_PUBLISHABLE_KEY</code>.</li>
              </ol>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[10px] text-slate-500 uppercase font-bold">Development Fast Sign In</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

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
