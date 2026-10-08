import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { Navbar } from './components/navigation/Navbar';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { Header } from './components/navigation/Header';
import { SpeakingModal } from './components/assessment/SpeakingModal';
import { PaymentGatewayModal } from './components/subscription/PaymentGatewayModal';
import { SubscriptionLockOverlay } from './components/subscription/SubscriptionLockOverlay';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { DashboardPage } from './pages/DashboardPage';
import { PracticePage } from './pages/PracticePage';
import { AICoachPage } from './pages/AICoachPage';
import { NewspaperPage } from './pages/NewspaperPage';
import { InterviewPage } from './pages/InterviewPage';
import { FearlessPage } from './pages/FearlessPage';
import { GDPage } from './pages/GDPage';
import { MyMistakesPage } from './pages/MyMistakesPage';
import { VocabPage } from './pages/VocabPage';
import { GrammarPage } from './pages/GrammarPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { PwaInstallPrompt } from './components/navigation/PwaInstallPrompt';
import { DAILY_ASSESSMENTS } from './data/mockData';
import { DailyAssessment } from './types';

const MainApp: React.FC = () => {
  const { isAuthenticated, isOnboarded } = useAuth();
  const { isExpired, isPaymentModalOpen, closePaymentModal } = useSubscription();

  const [viewState, setViewState] = useState<'landing' | 'auth' | 'onboarding' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeAssessment, setActiveAssessment] = useState<DailyAssessment | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Admin Access Control
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('speaksure_admin_unlocked') === 'true';
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);

  // Check URL params for direct admin portal link e.g. ?portal=admin or ?admin=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('portal') === 'admin' || params.get('admin') === 'true') {
      if (isAdminUnlocked) {
        setCurrentTab('admin');
      } else {
        setIsAdminAuthModalOpen(true);
      }
    }
  }, [isAdminUnlocked]);

  // Capture PWA install prompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA installation');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleOpenAssessment = (assessment?: DailyAssessment) => {
    if (isExpired) return;
    setActiveAssessment(assessment || DAILY_ASSESSMENTS[0]);
    setIsAssessmentModalOpen(true);
  };

  const handleSelectTab = (tab: string) => {
    if (tab === 'admin' && !isAdminUnlocked) {
      setIsAdminAuthModalOpen(true);
      return;
    }
    setCurrentTab(tab);
  };

  // State transitions based on auth
  useEffect(() => {
    if (isAuthenticated) {
      if (!isOnboarded) {
        setViewState('onboarding');
      } else if (viewState === 'landing' || viewState === 'auth') {
        setViewState('app');
      }
    } else {
      setViewState('auth');
    }
  }, [isAuthenticated, isOnboarded]);

  if (viewState === 'landing') {
    return <LandingPage onStart={() => setViewState('auth')} />;
  }

  if (viewState === 'auth') {
    return <AuthPage onSuccess={() => setViewState('onboarding')} />;
  }

  if (viewState === 'onboarding') {
    return <OnboardingPage onComplete={() => setViewState('app')} />;
  }

  // Check if current tab is locked when 3-month subscription is expired
  const isStudentTabLocked = isExpired && currentTab !== 'admin' && currentTab !== 'profile';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-x-hidden">
      {/* Desktop Sidebar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isAdminUnlocked={isAdminUnlocked}
        onOpenAdminAuth={() => setIsAdminAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-6">
        <PwaInstallPrompt deferredPrompt={deferredPrompt} onInstall={handleInstallPWA} />

        <Header
          onOpenProfile={() => setCurrentTab('profile')}
          deferredPrompt={deferredPrompt}
          onInstallPWA={handleInstallPWA}
          isAdminUnlocked={isAdminUnlocked}
          onOpenAdminPortal={() => setCurrentTab('admin')}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {/* Institutional Subscription Expired Overlay */}
          {isStudentTabLocked ? (
            <SubscriptionLockOverlay />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardPage
                  onSelectTab={handleSelectTab}
                  onOpenAssessment={handleOpenAssessment}
                />
              )}

              {currentTab === 'practice' && (
                <PracticePage onOpenAssessment={handleOpenAssessment} />
              )}

              {currentTab === 'coach' && <AICoachPage />}

              {currentTab === 'newspaper' && <NewspaperPage onOpenSpeakingModal={handleOpenAssessment} />}

              {currentTab === 'interview' && <InterviewPage />}

              {currentTab === 'fearless' && <FearlessPage />}

              {currentTab === 'gd' && <GDPage />}

              {currentTab === 'mistakes' && <MyMistakesPage />}

              {currentTab === 'vocab' && <VocabPage />}

              {currentTab === 'grammar' && <GrammarPage />}

              {currentTab === 'progress' && <ProgressPage />}
            </>
          )}

          {currentTab === 'profile' && <ProfilePage />}

          {currentTab === 'admin' && isAdminUnlocked && <AdminPage />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenSpeakModal={() => handleOpenAssessment()}
      />

      {/* Daily Speaking Modal */}
      {activeAssessment && !isExpired && (
        <SpeakingModal
          assessment={activeAssessment}
          isOpen={isAssessmentModalOpen}
          onClose={() => setIsAssessmentModalOpen(false)}
        />
      )}

      {/* Payment Gateway Modal */}
      <PaymentGatewayModal isOpen={isPaymentModalOpen} onClose={closePaymentModal} />

      {/* Admin Verification Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={() => {
          setIsAdminUnlocked(true);
          setCurrentTab('admin');
        }}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <ThemeProvider>
          <ToastProvider>
            <MainApp />
          </ToastProvider>
        </ThemeProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
