import { UserProfile, AssessmentAttempt, GrammarMistake, Achievement, CollegeSubscription, SubscriptionReceipt } from '../types';
import { INITIAL_MISTAKES, ACHIEVEMENTS } from '../data/mockData';

const PROFILE_KEY = 'speaksure_user_profile';
const ATTEMPTS_KEY = 'speaksure_attempts';
const MISTAKES_KEY = 'speaksure_mistakes';
const ACHIEVEMENTS_KEY = 'speaksure_achievements';
const DARK_MODE_KEY = 'speaksure_dark_mode';
const SUBSCRIPTION_KEY = 'speaksure_college_subscription';
const DEMO_EXPIRED_KEY = 'speaksure_demo_expired';

export const DEFAULT_COLLEGE_SUBSCRIPTION: CollegeSubscription = {
  collegeName: 'Coimbatore Institute of Technology',
  licenseKey: 'CIT-2026-SEM1-8932',
  purchasedByName: 'Dr. R. Sundararajan',
  purchasedByRole: 'Principal',
  purchasedByEmail: 'principal@cit.edu.in',
  purchasedByPhone: '+91 98422 12345',
  planName: 'Institutional 1-Semester Pass (3 Months)',
  durationMonths: 3,
  durationDays: 90,
  amountPaid: 25000,
  currency: '₹',
  purchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  expiryDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'ACTIVE',
  transactionId: 'TXN-CIT-884920',
  paymentMethod: 'Razorpay UPI (9113811578@upi)',
  receipts: [
    {
      id: 'rcpt-cit-001',
      transactionId: 'TXN-CIT-884920',
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 25000,
      currency: '₹',
      collegeName: 'Coimbatore Institute of Technology',
      purchaserName: 'Dr. R. Sundararajan',
      purchaserRole: 'Principal',
      purchaserEmail: 'principal@cit.edu.in',
      planName: 'Institutional 1-Semester Pass (3 Months - Unlimited Access)',
      durationMonths: 3,
      expiryDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: 'Razorpay UPI (9113811578@upi)',
      status: 'SUCCESS',
      licenseKey: 'CIT-2026-SEM1-8932',
    },
  ],
};


export const EMPTY_PROFILE: UserProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  college: '',
  course: '',
  graduationYear: new Date().getFullYear() + 1,
  targetRole: '',
  englishLevel: 'Intermediate',
  preferredLanguage: 'English',
  streakCount: 1,
  xpPoints: 50,
  currentLevel: 1,
  dailyGoalMinutes: 10,
  todayMinutesPracticed: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

class StorageService {
  public getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && parsed.email) return parsed;
      }
    } catch (e) {
      console.error('Error reading user profile from localStorage:', e);
    }
    return EMPTY_PROFILE;
  }

  public saveUserProfile(profile: UserProfile) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving user profile:', e);
    }
  }

  public getAttempts(): AssessmentAttempt[] {
    try {
      const data = localStorage.getItem(ATTEMPTS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading attempts:', e);
    }
    return [];
  }

  public saveAttempt(attempt: AssessmentAttempt) {
    const attempts = this.getAttempts();
    attempts.unshift(attempt);
    try {
      localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));

      const profile = this.getUserProfile();
      profile.todayMinutesPracticed += Math.ceil(attempt.durationSeconds / 60);
      profile.xpPoints += 50;
      if (profile.xpPoints >= profile.currentLevel * 250) {
        profile.currentLevel += 1;
      }
      this.saveUserProfile(profile);

      // Dynamically unlock achievements
      const achievements = this.getAchievements();
      let updatedAchievements = false;
      const nowStr = new Date().toISOString().split('T')[0];

      if (attempts.length >= 1) {
        const ach1 = achievements.find((a) => a.id === 'ach-1');
        if (ach1 && !ach1.unlocked) {
          ach1.unlocked = true;
          ach1.unlockedAt = nowStr;
          updatedAchievements = true;
        }
      }

      if (profile.streakCount >= 7) {
        const ach2 = achievements.find((a) => a.id === 'ach-2');
        if (ach2 && !ach2.unlocked) {
          ach2.unlocked = true;
          ach2.unlockedAt = nowStr;
          updatedAchievements = true;
        }
      }

      if (attempt.durationSeconds >= 60) {
        const ach3 = achievements.find((a) => a.id === 'ach-3');
        if (ach3 && !ach3.unlocked) {
          ach3.unlocked = true;
          ach3.unlockedAt = nowStr;
          updatedAchievements = true;
        }
      }

      if (attempt.analysis.overallScore >= 80) {
        const ach4 = achievements.find((a) => a.id === 'ach-4');
        if (ach4 && !ach4.unlocked) {
          ach4.unlocked = true;
          ach4.unlockedAt = nowStr;
          updatedAchievements = true;
        }
      }

      if (updatedAchievements) {
        this.saveAchievements(achievements);
      }

      // Add detected corrected sentences to mistakes store
      if (attempt.analysis.correctedSentences && attempt.analysis.correctedSentences.length > 0) {
        const mistakes = this.getMistakes();
        let mistakesUpdated = false;

        for (const cs of attempt.analysis.correctedSentences) {
          if (cs.original && cs.corrected && cs.original !== cs.corrected) {
            const existing = mistakes.find((m) => m.incorrectPattern === cs.original);
            if (existing) {
              existing.occurrences += 1;
              mistakesUpdated = true;
            } else {
              mistakes.push({
                id: 'm-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                userId: profile.id || 'usr-1',
                category: 'Sentence Structure',
                incorrectPattern: cs.original,
                correctPattern: cs.corrected,
                explanation: cs.explanation,
                occurrences: 1,
                mastered: false,
              });
              mistakesUpdated = true;
            }
          }
        }

        if (mistakesUpdated) {
          this.saveMistakes(mistakes);
        }
      }
    } catch (e) {
      console.error('Error saving attempt:', e);
    }
  }

  public getMistakes(): GrammarMistake[] {
    try {
      const data = localStorage.getItem(MISTAKES_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading mistakes:', e);
    }
    return [];
  }

  public saveMistakes(mistakes: GrammarMistake[]) {
    try {
      localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
    } catch (e) {
      console.error('Error saving mistakes:', e);
    }
  }

  public getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading achievements:', e);
    }
    return ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: false,
      unlockedAt: undefined,
    }));
  }

  public saveAchievements(achievements: Achievement[]) {
    try {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    } catch (e) {
      console.error('Error saving achievements:', e);
    }
  }

  public getDarkMode(): boolean {
    const data = localStorage.getItem(DARK_MODE_KEY);
    return data !== null ? JSON.parse(data) : true;
  }

  public setDarkMode(enabled: boolean) {
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(enabled));
  }

  public getCollegeSubscription(): CollegeSubscription {
    try {
      const data = localStorage.getItem(SUBSCRIPTION_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading college subscription from localStorage:', e);
    }
    return DEFAULT_COLLEGE_SUBSCRIPTION;
  }

  public saveCollegeSubscription(subscription: CollegeSubscription) {
    try {
      localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    } catch (e) {
      console.error('Error saving college subscription:', e);
    }
  }

  public getDemoExpiredState(): boolean {
    try {
      const data = localStorage.getItem(DEMO_EXPIRED_KEY);
      return data === 'true';
    } catch (e) {
      return false;
    }
  }

  public setDemoExpiredState(expired: boolean) {
    try {
      localStorage.setItem(DEMO_EXPIRED_KEY, expired ? 'true' : 'false');
    } catch (e) {
      console.error('Error setting demo expired state:', e);
    }
  }

  public clearAllData() {
    localStorage.clear();
  }
}

export const storageService = new StorageService();

