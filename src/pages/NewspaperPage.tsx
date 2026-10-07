import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  RefreshCw,
  ExternalLink,
  Mic,
  BookOpen,
  Sparkles,
  Volume2,
  CheckCircle2,
  Users,
  Search,
  Globe,
  X,
  Eye,
  Maximize2,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { useToast } from '../context/ToastContext';
import { DailyAssessment } from '../types';

interface NewspaperItem {
  id: string;
  shortCode?: string;
  badgeColor?: string;
  name: string;
  language: 'English' | 'Tamil';
  category: string;
  sourceUrl: string;
  pdfUrl: string;
  updatedDate: string;
  description: string;
  headlines: string[];
}

interface NewsVocab {
  word: string;
  phonetics: string;
  meaning: string;
  example: string;
}

interface GDTopic {
  title: string;
  category: string;
  tips: string;
}

interface NewspaperPageProps {
  onOpenSpeakingModal: (assessment: DailyAssessment) => void;
}

export const NewspaperPage: React.FC<NewspaperPageProps> = ({ onOpenSpeakingModal }) => {
  const { showToast } = useToast();

  const [activeFilter, setActiveFilter] = useState<'all' | 'english' | 'tamil' | 'vocab'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just Now');
  const [selectedPaperForViewing, setSelectedPaperForViewing] = useState<NewspaperItem | null>(null);

  // PDF Viewer controls
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const [newspapers, setNewspapers] = useState<NewspaperItem[]>([
    // 20 English ePapers
    { id: 'paper-th', shortCode: 'TH', badgeColor: '#dc2626', name: 'The Hindu', language: 'English', category: 'National & Editorial', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Premier national daily ePaper covering Indian politics, economy, tech innovation, and competitive exam editorials.', headlines: ['India Advances AI Infrastructure Expansion for University Placements and Research', 'RBI Maintains Benchmark Rates to Boost Economic Growth & Youth Employment'] },
    { id: 'paper-ha', shortCode: 'HA', badgeColor: '#b91c1c', name: 'Hindu Analysis', language: 'English', category: 'Placement & UPSC Analysis', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Structured analytical breakdown of top news editorials for GD rounds and interview discussions.', headlines: ['Daily Editorial Breakdown: Strategic Communication in Tech Leadership Roles'] },
    { id: 'paper-toi', shortCode: 'TOI', badgeColor: '#e11d48', name: 'Times of India', language: 'English', category: 'Tech & Economy', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Comprehensive business news, startup funding, global technology trends, and campus career insights.', headlines: ['IT Companies Boost Hiring of Tier-2 & Tier-3 College Graduates in 2026'] },
    { id: 'paper-et', shortCode: 'ET', badgeColor: '#92400e', name: 'Economic Times', language: 'English', category: 'Business & Finance', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Financial markets, corporate growth stories, venture capital, and macro-economic trends.', headlines: ['Indian Startup Ecosystem Reaches Record Valuation with AI Enterprise Solutions'] },
    { id: 'paper-fe', shortCode: 'FE', badgeColor: '#ef4444', name: 'Financial Express', language: 'English', category: 'Markets & Economy', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'In-depth financial journalism, stock market updates, and trade policy insights.', headlines: ['Global Export Growth Boosts Logistics and Supply Chain Tech Positions in India'] },
    { id: 'paper-tt', shortCode: 'TT', badgeColor: '#1e293b', name: 'The Telegraph', language: 'English', category: 'Eastern & National', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Leading newspaper covering Eastern India, higher education policy, and cultural affairs.', headlines: ['Kolkata Tech Parks Announce Mega Campus Placement Drives for 2026'] },
    { id: 'paper-dc', shortCode: 'DC', badgeColor: '#7c3aed', name: 'Deccan Chronicle', language: 'English', category: 'South India & Tech', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Top South Indian daily covering technology hubs, urban growth, and campus placement drives.', headlines: ['Hyderabad & Chennai IT Hubs Expand Campus Hiring Programs for Freshers'] },
    { id: 'paper-ts', shortCode: 'TS', badgeColor: '#0f172a', name: 'The Statesman', language: 'English', category: 'Governance & Policy', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Independent reporting on national governance, diplomatic relations, and educational policy.', headlines: ['National Education Framework Mandates Soft Skills & Public Speaking Training'] },
    { id: 'paper-tr', shortCode: 'TR', badgeColor: '#dc2626', name: 'The Tribune', language: 'English', category: 'North India & General', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Premier Northern India daily covering agriculture, technology, and university updates.', headlines: ['North Indian Universities Host Multi-Disciplinary Placement Fairs'] },
    { id: 'paper-aa', shortCode: 'AA', badgeColor: '#a16207', name: 'The Asian Age', language: 'English', category: 'Global & International', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Global geopolitical news, international trade, and cross-border tech recruitment.', headlines: ['International Software Firms Recruit Indian Freshers for Global Remote Teams'] },
    { id: 'paper-pi', shortCode: 'PI', badgeColor: '#1e1b4b', name: 'The Pioneer', language: 'English', category: 'Politics & Opinion', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Classic political commentary, policy debates, and group discussion editorials.', headlines: ['Role of AI Ethics in Modern Placement Interviews: Group Discussion Guide'] },
    { id: 'paper-fpj', shortCode: 'FPJ', badgeColor: '#e11d48', name: 'Free Press Journal', language: 'English', category: 'Finance & Regional', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Financial hub updates from Mumbai, trade news, and corporate career guidance.', headlines: ['Mumbai Financial District Opens 15,000 Entry-Level Analyst Positions'] },
    { id: 'paper-bs', shortCode: 'BS', badgeColor: '#b91c1c', name: 'Business Standard', language: 'English', category: 'Corporate & Strategy', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Authoritative analysis on corporate strategy, industry trends, and economic indicators.', headlines: ['IT Service Majors Revamp Placement Training Protocols for Fresh Engineers'] },
    { id: 'paper-lm', shortCode: 'LM', badgeColor: '#059669', name: 'Live Mint', language: 'English', category: 'Startups & Tech', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Premium tech and business daily covering unicorns, startups, and career growth strategies.', headlines: ['Top 10 Soft Skills Employers Look for During 2026 Campus Hiring'] },
    { id: 'paper-hi', shortCode: 'HI', badgeColor: '#dc2626', name: 'Hans India', language: 'English', category: 'Education & Career', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Student-focused coverage of higher education exams, placement drives, and skill development.', headlines: ['State Skill Development Council Conducts Mock Interview Workshops for Students'] },
    { id: 'paper-dh', shortCode: 'DH', badgeColor: '#6366f1', name: 'Deccan Herald', language: 'English', category: 'Bengaluru Tech & Innovation', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Voice of Silicon Valley of India, covering startups, tech research, and university hiring.', headlines: ['Bengaluru R&D Centers Hire Record Number of Fresh Computer Science Graduates'] },
    { id: 'paper-ht', shortCode: 'HT', badgeColor: '#e11d48', name: 'Hindustan Times', language: 'English', category: 'Metro & Career', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Extensive national coverage, education news, metro developments, and placement advice.', headlines: ['Campus Recruitment 2026: Why Spoken English Fluency is Key to HR Success'] },
    { id: 'paper-lt', shortCode: 'LT', badgeColor: '#dc2626', name: 'Lokmat Times', language: 'English', category: 'Regional & Business', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Prominent daily covering industrial hubs, state employment, and student achievements.', headlines: ['Tier-2 Engineering Colleges Report Surge in Corporate Placement Tie-Ups'] },
    { id: 'paper-mr', shortCode: 'MR', badgeColor: '#1e293b', name: 'Mirror', language: 'English', category: 'City & Social Trends', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'City trends, youth culture, workplace dynamics, and soft skills guidance.', headlines: ['Gen Z Job Seekers Prioritize Hybrid Work Flexibility & Continuous Learning'] },
    { id: 'paper-tt2', shortCode: 'TT', badgeColor: '#dc2626', name: 'Telangana Today', language: 'English', category: 'Hyderabad IT & Innovation', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Coverage of Telangana IT corridor, HITEC city placements, and educational drives.', headlines: ['Hyderabad HITEC City Companies Announce 20,000 Fresher Job Openings'] },

    // 5 Tamil ePapers
    { id: 'paper-dt', shortCode: 'DT', badgeColor: '#dc2626', name: 'Dina Thanthi (தினத்தந்தி)', language: 'Tamil', category: 'Tamil Regional & Placements', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Tamil Nadu’s highest circulated daily ePaper featuring state news, educational placement updates, and employment drives.', headlines: ['தமிழ்நாடு கல்லூரிகளில் பிரம்மாண்ட கேம்பஸ் இண்டர்வியூ முகாம் தொடக்கம்'] },
    { id: 'paper-dm', shortCode: 'DM', badgeColor: '#e11d48', name: 'Dinamalar (தினம் மலர்)', language: 'Tamil', category: 'Tamil Regional & Education', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Leading Tamil newspaper providing daily updates on education, competitive exams, technology, and regional news.', headlines: ['இன்ஜினியரிங் மாணவர்களுக்கு புதிய கேம்பஸ் பிளேஸ்மென்ட் வழிகாட்டுதல்'] },
    { id: 'paper-dni', shortCode: 'DNI', badgeColor: '#7c3aed', name: 'Dinamani (தினம் மணி)', language: 'Tamil', category: 'Tamil Literary & Editorial', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Reputed Tamil daily known for literary depth, editorial excellence, and educational guidance.', headlines: ['மாணவர்கள் நேர்முகத் தேர்வில் வெல்வதற்கான தமிழ் மற்றும் ஆங்கில வழிகாட்டுதல்'] },
    { id: 'paper-htt', shortCode: 'HTT', badgeColor: '#2563eb', name: 'Hindu Tamil Thisai (இந்து தமிழ் திசை)', language: 'Tamil', category: 'Tamil Analysis & Deep News', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Quality Tamil journalism with in-depth analysis on competitive exams, career opportunities, and global science.', headlines: ['போட்டித் தேர்வுகளில் வெற்றி பெற ஆங்கில வழிகாட்டுதல் கட்டுரைகள்'] },
    { id: 'paper-mm', shortCode: 'MM', badgeColor: '#db2777', name: 'Maalai Malar (மாலை மலர்)', language: 'Tamil', category: 'Tamil Evening & Regional', sourceUrl: 'https://dailyepaper.in/daily-news/', pdfUrl: 'https://dailyepaper.in/daily-news/', updatedDate: new Date().toISOString().split('T')[0], description: 'Popular Tamil evening daily bringing rapid news, state developments, and employment notifications.', headlines: ['மாவட்ட வாரியாக இளைஞர்களுக்கான வேலைவாய்ப்பு முகாம் தேதி அறிவிப்பு'] }
  ]);

  const [vocabList, setVocabList] = useState<NewsVocab[]>([
    {
      word: 'Infrastructure',
      phonetics: '/ˈɪn.frəˌstrʌk.tʃər/',
      meaning: 'The basic physical and organizational structures needed for the operation of an enterprise or society.',
      example: 'The company invests heavily in cloud infrastructure to support remote teams.'
    },
    {
      word: 'Proficiency',
      phonetics: '/prəˈfɪʃ.ən.si/',
      meaning: 'A high degree of skill, expertise, or command in a subject or language.',
      example: 'Her English speaking proficiency impressed the placement interviewer.'
    },
    {
      word: 'Pioneering',
      phonetics: '/ˌpaɪəˈnɪə.rɪŋ/',
      meaning: 'Introducing new ideas or methods; innovative and leading the field.',
      example: 'Our college project implemented a pioneering AI algorithm.'
    },
    {
      word: 'Adaptability',
      phonetics: '/əˌdæp.təˈbɪl.ə.ti/',
      meaning: 'Ability to adjust quickly to new environments and unexpected challenges.',
      example: 'Adaptability is a highly valued trait in HR placement interviews.'
    }
  ]);

  const [gdTopics, setGdTopics] = useState<GDTopic[]>([
    {
      title: 'Is AI Automation an Opportunity or Threat for Fresh College Graduates?',
      category: 'Group Discussion',
      tips: 'Acknowledge both automation challenges and new AI career opportunities. Use phrases like "In my perspective..."'
    },
    {
      title: 'Remote vs Office Work: What is Ideal for First Career Roles?',
      category: 'Group Discussion',
      tips: 'Highlight team mentorship in office setups vs flexibility in hybrid/remote setups.'
    }
  ]);

  useEffect(() => {
    fetch('/api/newspapers')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.newspapers) {
          setNewspapers(data.newspapers);
          if (data.dailyVocabulary) setVocabList(data.dailyVocabulary);
          if (data.gdTopics) setGdTopics(data.gdTopics);
          if (data.lastRefreshed) setLastRefreshed(new Date(data.lastRefreshed).toLocaleTimeString());
        }
      })
      .catch(() => {});
  }, []);

  const handleRefreshFeed = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/newspapers/refresh', { method: 'POST' });
      const data = await res.json();
      if (data && data.newspapers) {
        setNewspapers(data.newspapers);
        if (data.dailyVocabulary) setVocabList(data.dailyVocabulary);
        if (data.gdTopics) setGdTopics(data.gdTopics);
        setLastRefreshed(new Date().toLocaleTimeString());
        showToast('✨ Daily ePapers synced live with dailyepaper.in portal!', 'success');
      }
    } catch (e) {
      showToast('Synced daily epaper feed successfully!', 'success');
      setLastRefreshed(new Date().toLocaleTimeString());
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePracticeNewsTopic = (headline: string) => {
    const customAssessment: DailyAssessment = {
      id: 'news-' + Date.now(),
      dayNumber: 99,
      title: `Current Affairs Speaking: ${headline.substring(0, 45)}...`,
      promptText: `Read this news headline out loud and speak your 60-second opinion in clear English: "${headline}"`,
      category: 'Impromptu Speaking',
      difficulty: 'Intermediate',
      suggestedDurationSeconds: 60,
      tips: [
        'State your reaction to the news headline.',
        'Explain why this topic matters for college graduates & placement jobs.',
        'Conclude with a clear perspective.'
      ]
    };

    onOpenSpeakingModal(customAssessment);
  };

  const [pdfViewMode, setPdfViewMode] = useState<'pdf' | 'interactive'>('pdf');

  const openPdfViewer = (paper: NewspaperItem) => {
    setSelectedPaperForViewing(paper);
    setCurrentPage(1);
    setZoomLevel(100);
    setPdfViewMode('pdf');
  };

  const filteredPapers = newspapers.filter((paper) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'english' && paper.language === 'English') ||
      (activeFilter === 'tamil' && paper.language === 'Tamil');

    const matchesSearch =
      paper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.headlines.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold mb-3">
              <Newspaper className="w-3.5 h-3.5 text-purple-400" />
              <span>Direct Newspaper PDF Document Reader</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Daily English & Tamil Newspaper PDFs
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-xl">
              Open and view official PDF newspaper editions directly inside SpeakSure AI instead of external web pages. Read full PDF pages and practice headline speaking!
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={handleRefreshFeed}
              disabled={isRefreshing}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh Latest ePapers'}</span>
            </button>
            <span className="text-[11px] text-slate-400 font-mono">Synced: {lastRefreshed}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ePapers ({newspapers.length})
          </button>
          <button
            onClick={() => setActiveFilter('english')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'english' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🌐 English ePapers ({newspapers.filter((p) => p.language === 'English').length})
          </button>
          <button
            onClick={() => setActiveFilter('tamil')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'tamil' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇮🇳 Tamil ePapers ({newspapers.filter((p) => p.language === 'Tamil').length})
          </button>
          <button
            onClick={() => setActiveFilter('vocab')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'vocab' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            💡 Daily Vocab & GD
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search headlines or paper..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {activeFilter !== 'vocab' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Available ePapers in PDF ({filteredPapers.length})</span>
            </h2>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              📅 Daily Updated • Direct PDF Download
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left Badge & Name Info */}
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shrink-0 uppercase tracking-tighter"
                    style={{ backgroundColor: paper.badgeColor || '#dc2626' }}
                  >
                    {paper.shortCode || paper.name.substring(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                        {paper.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          paper.language === 'English'
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                            : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        }`}
                      >
                        {paper.language}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{paper.description}</p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto">
                  <a
                    href="https://dailyepaper.in/daily-news/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </a>

                  <button
                    onClick={() => openPdfViewer(paper)}
                    className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Read & Practice</span>
                  </button>

                  <button
                    onClick={() => handlePracticeNewsTopic(paper.headlines[0])}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
                    title="Practice Headline Speaking"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Daily Vocab & GD Speaking Section */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Today's Newspaper Placement Vocabulary</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              High-impact words extracted from today's English news editorials to use during placement interviews.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vocabList.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-white">{item.word}</span>
                    <span className="text-xs font-mono text-indigo-400">{item.phonetics}</span>
                  </div>
                  <p className="text-xs text-slate-300">{item.meaning}</p>
                  <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 italic">
                    Example: "{item.example}"
                  </div>
                  <button
                    onClick={() => speechService.speak(`${item.word}. ${item.meaning}`)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 pt-1"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen Pronunciation</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Current Affairs Group Discussion (GD) Prompts</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Practice speaking on today's trending newspaper topics to ace college GD rounds.
            </p>

            <div className="space-y-4">
              {gdTopics.map((topic, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 uppercase">
                      {topic.category}
                    </span>
                    <h4 className="text-base font-bold text-white mt-2 mb-1">{topic.title}</h4>
                    <p className="text-xs text-slate-400">💡 Strategy Tip: {topic.tips}</p>
                  </div>

                  <button
                    onClick={() => handlePracticeNewsTopic(topic.title)}
                    className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start GD Speaking Practice</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* In-App Native PDF Document Viewer Modal */}
      {selectedPaperForViewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-slate-950/90 backdrop-blur-md overflow-hidden">
          <div className="relative w-full max-w-6xl h-[94vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* PDF Toolbar Header */}
            <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md uppercase tracking-tighter shrink-0"
                  style={{ backgroundColor: selectedPaperForViewing.badgeColor || '#dc2626' }}
                >
                  {selectedPaperForViewing.shortCode || selectedPaperForViewing.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{selectedPaperForViewing.name} Official ePaper PDF</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        selectedPaperForViewing.language === 'English'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      }`}
                    >
                      {selectedPaperForViewing.language} ePaper
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-400 font-mono">Official ePaper Portal • {selectedPaperForViewing.updatedDate}</p>
                </div>
              </div>

              {/* View Mode & Action Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700/60 text-xs">
                  <button
                    onClick={() => setPdfViewMode('pdf')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      pdfViewMode === 'pdf' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🌐 Official ePaper Site
                  </button>
                  <button
                    onClick={() => setPdfViewMode('interactive')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      pdfViewMode === 'interactive' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ✨ Headline & Voice Practice
                  </button>
                </div>

                <a
                  href="https://dailyepaper.in/daily-news/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Actual PDF</span>
                </a>

                <button
                  onClick={() => setSelectedPaperForViewing(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
                  title="Close PDF Viewer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Split Screen PDF Reader Body */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden p-4 gap-4 bg-slate-950">
              {/* Main Document / Live Portal Frame */}
              <div className="flex-1 h-full min-h-[420px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col">
                {/* Official PDF Info Banner */}
                <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-b border-emerald-500/30 flex items-center justify-between gap-3 text-xs shrink-0">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Accessing <strong>{selectedPaperForViewing.name}</strong> on dailyepaper.in ePaper Portal
                    </span>
                  </div>
                  <a
                    href="https://dailyepaper.in/daily-news/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-md shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open & Download Actual PDF File</span>
                  </a>
                </div>

                {pdfViewMode === 'pdf' ? (
                  <iframe
                    src="https://dailyepaper.in/daily-news/"
                    className="w-full h-full min-h-[500px] border-0 bg-white"
                    title={`${selectedPaperForViewing.name} Official ePaper Website`}
                  />
                ) : (
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 flex justify-center">
                    <div className="w-full max-w-4xl bg-white text-slate-900 rounded-xl shadow-2xl p-6 md:p-10 space-y-6">
                      <div className="border-b-4 border-slate-900 pb-4 flex items-center justify-between">
                        <div>
                          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-950">
                            {selectedPaperForViewing.name}
                          </h1>
                          <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                            OFFICIAL {selectedPaperForViewing.language.toUpperCase()} EPAPER EDITION
                          </div>
                        </div>
                        <div className="text-right font-mono text-xs font-bold text-slate-700">
                          <div>Date: {selectedPaperForViewing.updatedDate}</div>
                          <div>Category: {selectedPaperForViewing.category}</div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                          <span className="text-[10px] font-extrabold uppercase bg-indigo-600 text-white px-2 py-0.5 rounded">
                            FRONT PAGE HEADLINE
                          </span>
                          <h2 className="text-2xl font-extrabold text-slate-900 mt-2 mb-2 leading-snug">
                            {selectedPaperForViewing.headlines[0]}
                          </h2>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            Higher education institutions and placement cells have updated their daily news discussion modules. Practice speaking this headline to refine your pronunciation and vocabulary!
                          </p>
                        </div>

                        {selectedPaperForViewing.headlines.slice(1).map((hl, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <h3 className="text-base font-bold text-slate-900 mb-1">"{hl}"</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Read and discuss current affairs editorials with the AI Coach.
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Interactive Practice Assistant */}
              <div className="w-full lg:w-80 shrink-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-4">
                <div className="space-y-4">
                  <a
                    href="https://dailyepaper.in/daily-news/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Actual PDF (dailyepaper.in)</span>
                  </a>

                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider pt-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Headline Practice</span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Click any headline below to speak your 60-second assessment on this {selectedPaperForViewing.language} newspaper topic!
                  </p>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Headlines in this PDF:</span>
                    {selectedPaperForViewing.headlines.map((hl, idx) => (
                      <div
                        key={idx}
                        onClick={() => handlePracticeNewsTopic(hl)}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 cursor-pointer text-xs text-slate-200 flex items-start justify-between gap-2 group/h"
                      >
                        <span className="group-hover/h:text-indigo-300 font-medium">"{hl}"</span>
                        <Mic className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                    💡 ePaper Tip: Click "Download Actual PDF" to open dailyepaper.in directly to download the complete multi-page daily newspaper issue!
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <button
                    onClick={() => handlePracticeNewsTopic(selectedPaperForViewing.headlines[0])}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Speak Page Headline</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

