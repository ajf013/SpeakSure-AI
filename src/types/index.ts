export type EnglishLevel = 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper Intermediate' | 'Advanced';

export type AssessmentCategory =
  | 'Basic Introduction'
  | 'Everyday English'
  | 'College Life'
  | 'Self Introduction'
  | 'HR Interview'
  | 'Technical Interview Communication'
  | 'Behavioral Questions'
  | 'Group Discussion'
  | 'Workplace Communication'
  | 'Situational Questions'
  | 'Presentation Practice'
  | 'Impromptu Speaking'
  | 'Interview Simulation'
  | 'Advanced Fluency';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  college: string;
  course: string; // e.g., BCA, B.Tech CS, MBA, MCA
  graduationYear: number;
  targetRole: string; // e.g., Cloud Engineer, Software Developer, Data Analyst, HR Manager
  englishLevel: EnglishLevel;
  preferredLanguage?: string;
  profilePhoto?: string;
  streakCount: number;
  xpPoints: number;
  currentLevel: number;
  dailyGoalMinutes: number;
  todayMinutesPracticed: number;
  lastActiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CorrectedSentence {
  original: string;
  corrected: string;
  explanation: string;
}

export interface SpeechAnalysisResult {
  overallScore: number;
  fluencyScore: number;
  grammarScore: number;
  vocabularyScore: number;
  pronunciationScore: number;
  confidenceScore: number;
  interviewReadinessScore?: number;
  wordsPerMinute: number;
  fillerWords: number;
  longPauses: number;
  repeatedWords?: number;
  sentenceRestarts?: number;
  strengths: string[];
  improvements: string[];
  correctedSentences: CorrectedSentence[];
  practiceSentences: string[];
  nextExercise: string;
}

export interface DailyAssessment {
  id: string;
  dayNumber: number;
  title: string;
  promptText: string;
  category: AssessmentCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  suggestedDurationSeconds: number;
  tips: string[];
  sampleAnswer?: string;
}

export interface AssessmentAttempt {
  id: string;
  userId: string;
  assessmentId: string;
  mode: 'voice' | 'video' | 'text';
  transcript: string;
  durationSeconds: number;
  analysis: SpeechAnalysisResult;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  audioUrl?: string;
  correctedText?: string;
  grammarTip?: string;
  timestamp: string;
}

export type InterviewType = 'HR Interview' | 'Technical Interview' | 'Campus Placement' | 'Internship' | 'Behavioral Interview' | 'Group Discussion';

export interface InterviewQuestion {
  id: string;
  questionText: string;
  expectedKeywords: string[];
  tipText: string;
  sampleAnswer: string;
}

export interface InterviewAnswer {
  questionId: string;
  questionText: string;
  userTranscript: string;
  audioUrl?: string;
  feedback: {
    score: number;
    clarity: string;
    relevance: string;
    suggestedImprovement: string;
  };
}

export interface InterviewSession {
  id: string;
  userId: string;
  type: InterviewType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  overallScore?: number;
  completed: boolean;
  createdAt: string;
}

export interface FearlessChallenge {
  id: string;
  targetSeconds: number; // 15, 30, 60, 90
  topic: string;
  completed: boolean;
  actualSecondsSpoken: number;
  dateCompleted?: string;
}

export interface GrammarMistake {
  id: string;
  userId: string;
  category: 'Past Tense' | 'Prepositions' | 'Articles' | 'Subject-Verb Agreement' | 'Vocabulary Choice' | 'Sentence Structure';
  incorrectPattern: string;
  correctPattern: string;
  explanation: string;
  occurrences: number;
  mastered: boolean;
  lastPracticed?: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  phonetics: string;
  meaning: string;
  exampleSentence: string;
  category: 'Interview' | 'College' | 'Technology' | 'Workplace' | 'Daily Life' | 'Communication';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export type CollegeManagementRole = 'CEO' | 'Chairman' | 'Principal' | 'Placement Director' | 'Management Admin';

export interface SubscriptionReceipt {
  id: string;
  transactionId: string;
  date: string;
  amount: number;
  currency: string;
  collegeName: string;
  purchaserName: string;
  purchaserRole: CollegeManagementRole;
  purchaserEmail: string;
  planName: string;
  durationMonths: number;
  expiryDate: string;
  paymentMethod: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  licenseKey: string;
}

export interface CollegeSubscription {
  collegeName: string;
  licenseKey: string;
  purchasedByName: string;
  purchasedByRole: CollegeManagementRole;
  purchasedByEmail: string;
  purchasedByPhone?: string;
  planName: string;
  durationMonths: number; // 3 months (1 semester)
  durationDays: number; // 90 days
  amountPaid: number;
  currency: string;
  purchaseDate: string; // ISO date
  expiryDate: string; // ISO date (3 months from purchaseDate)
  status: 'ACTIVE' | 'EXPIRED';
  transactionId: string;
  paymentMethod: string;
  receipts: SubscriptionReceipt[];
}

export interface AdminAnalytics {
  totalStudents: number;
  activeStudentsToday: number;
  assessmentsCompleted: number;
  avgFluency: number;
  avgConfidence: number;
  interviewSessionsTotal: number;
  popularExercises: { name: string; count: number }[];
  retentionRatePercent: number;
  totalSpeakingMinutes: number;
}

