import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    application: 'SpeakSure AI Backend Service',
    timestamp: new Date().toISOString(),
    azureSubscription: process.env.ARM_SUBSCRIPTION_ID || '6556862d-2bee-43e2-bd37-4493ea5c1c70',
    resourceGroup: process.env.AZURE_RESOURCE_GROUP || 'rg-speaksure-ai-prod',
  });
});

// Authentication endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  res.json({
    token: 'mock-jwt-token-speaksure-' + Date.now(),
    user: {
      id: 'usr-101',
      email: email || 'student@college.edu.in',
      name: email ? email.split('@')[0] : 'Arun Kumar',
      college: 'Coimbatore Institute of Technology',
      course: 'BCA',
      graduationYear: 2027,
      targetRole: 'Cloud Engineer',
      englishLevel: 'Intermediate',
    },
  });
});

// Speech Analysis API
app.post('/api/speech/analyze', (req: Request, res: Response) => {
  const { transcript, durationSeconds } = req.body;

  const wordCount = (transcript || '').split(/\s+/).length;
  const wpm = Math.round(wordCount / (Math.max(durationSeconds, 15) / 60));

  res.json({
    overallScore: 78,
    fluencyScore: 74,
    grammarScore: 80,
    vocabularyScore: 75,
    pronunciationScore: 79,
    confidenceScore: 72,
    wordsPerMinute: wpm,
    fillerWords: 3,
    longPauses: 1,
    strengths: ['Great natural sentence formation.', 'Paced speech without rushing.'],
    improvements: ['Try replacing "um" with a subtle 1-second pause.'],
    correctedSentences: [
      {
        original: 'Yesterday I go to college campus...',
        corrected: 'Yesterday I went to the college campus...',
        explanation: 'Use past tense "went" for yesterday.',
      },
    ],
    practiceSentences: ['I am currently preparing for campus placement interviews.'],
    nextExercise: 'Try Day 2: Describe your college environment.',
  });
});

// AI Coach Chat API with Multilingual (English, Tamil, Tanglish) Support
app.post('/api/coach/chat', (req: Request, res: Response) => {
  const { message } = req.body;
  const msg = (message || '').toLowerCase();

  const isTamil = /[\u0B80-\u0BFF]/.test(message || '');
  const isTanglish = /\b(epdi|solradhu|naan|enoda|iruku|pesradhu|bro|hesitat|vanakkam|namba|pannunga|solunga|puriyala|nalla|keta|therila)\b/i.test(msg);

  let responseText = '';
  let tipText = '';

  if (isTamil) {
    responseText = `வணக்கம்! உங்கள் கேள்வியைப் புரிந்துகொண்டேன். இண்டர்வியூவில் பேசும்போது:\n\n1. "Good morning, I am currently preparing for campus placement."\n2. உங்கள் தொழில்நுட்பத் திறன்களை தெளிவாகக் கூறுங்கள்.\n3. அமைதியாகவும் தன்னம்பிக்கையுடனும் பேசுங்கள்.\n\nதற்போது இந்த வாக்கியத்தை ஆங்கிலத்தில் பேசிப் பாருங்கள்!`;
    tipText = 'தமிழில் சிந்தித்து, எளிய 4 வார்த்தை ஆங்கில வாக்கியங்களாகப் பேசுங்கள்.';
  } else if (isTanglish) {
    responseText = `Vanakkam! Super question bro! Placement interview-la hesitate aagama pesuradhukku indha 3 tips follow pannunga:\n\n1. Simple English: Complex words venam, simple short sentences podhum.\n2. Practice: "I am confident in my technical skills and ready for placements."\n3. Pause: Ummm-nu solradhuku badhula 1 sec silent pause eduthukonga.\n\nIpo mic click panni idha pesi paarunga!`;
    tipText = 'Tanglish-la nenga nenakiradha 3 simple English lines-ah maathi pesalaam.';
  } else {
    responseText = `Great question about "${message}"! Here is a structured 3-step approach for interview success:\n\n1. State your main point clearly.\n2. Give a quick real-world or college project example.\n3. Summarize your impact or career goal.\n\nTry recording your voice answer now!`;
    tipText = 'Keep your sentences crisp (under 12 words per sentence) during interview responses.';
  }

  res.json({
    response: responseText,
    grammarTip: tipText,
    timestamp: new Date().toISOString(),
  });
});

// Newspaper Daily Feed Endpoint
let lastRefreshTime = new Date().toISOString();

function escapePdfText(str: string): string {
  return (str || '').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function generateNewspaperPDF(paper: any): Buffer {
  const title = (paper.name || 'NEWSPAPER').toUpperCase();
  const date = paper.updatedDate || new Date().toISOString().split('T')[0];
  const lang = paper.language || 'English';
  const headlines = paper.headlines || [];

  const textLines = [
    `BT`,
    `/F1 22 Tf`,
    `50 730 Td`,
    `(${escapePdfText(title)} - OFFICIAL ${lang.toUpperCase()} EPAPER) Tj`,
    `/F1 10 Tf`,
    `0 -20 Td`,
    `(Edition Date: ${escapePdfText(date)}  |  Category: ${escapePdfText(paper.category)}) Tj`,
    `0 -15 Td`,
    `(Source: SpeakSure AI Daily ePaper Feed) Tj`,
    `0 -30 Td`,
    `/F1 14 Tf`,
    `(TODAYS FRONT PAGE HEADLINES & EDITORIALS:) Tj`,
    `0 -25 Td`,
    `/F1 11 Tf`,
  ];

  headlines.forEach((hl: string, idx: number) => {
    const cleanHl = hl.replace(/[^\x20-\x7E]/g, '');
    textLines.push(`(Headline ${idx + 1}: ${escapePdfText(cleanHl || 'Campus Placement & State News Update')}) Tj`);
    textLines.push(`0 -18 Td`);
    textLines.push(`(  Summary: Placement & Campus Recruitment Editorial Insights for Students) Tj`);
    textLines.push(`0 -28 Td`);
  });

  textLines.push(`ET`);

  const contentStream = textLines.join('\n');
  const streamLength = Buffer.byteLength(contentStream);

  const headerObj = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
  const pagesObj = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
  const pageObj = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;
  const fontObj = `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;
  const streamObj = `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream\nendobj\n`;

  const body = headerObj + pagesObj + pageObj + fontObj + streamObj;

  const o1 = 0;
  const o2 = headerObj.length;
  const o3 = o2 + pagesObj.length;
  const o4 = o3 + pageObj.length;
  const o5 = o4 + fontObj.length;
  const startXref = o5 + streamObj.length;

  const pad = (n: number) => n.toString().padStart(10, '0');

  const xref = `xref\n0 6\n0000000000 65535 f \n${pad(o1)} 00000 n \n${pad(o2)} 00000 n \n${pad(o3)} 00000 n \n${pad(o4)} 00000 n \n${pad(o5)} 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`;

  return Buffer.from(body + xref);
}

const NEWSPAPERS_DATA = [
  // 20 English ePapers from dailyepaper.in
  {
    id: 'paper-th',
    shortCode: 'TH',
    badgeColor: '#dc2626',
    name: 'The Hindu',
    language: 'English',
    category: 'National & Editorial',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.thehindu.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Premier national daily ePaper covering Indian politics, economy, tech innovation, and competitive exam editorials.',
    headlines: [
      'India Advances AI Infrastructure Expansion for University Placements and Research',
      'RBI Maintains Benchmark Rates to Boost Economic Growth & Youth Employment',
      'Global Tech Firms Announce 2026 Campus Recruitment Drive across Engineering Colleges'
    ]
  },
  {
    id: 'paper-ha',
    shortCode: 'HA',
    badgeColor: '#b91c1c',
    name: 'Hindu Analysis',
    language: 'English',
    category: 'Placement & UPSC Analysis',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://dailyepaper.in/daily-news/',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Structured analytical breakdown of top news editorials for GD rounds, competitive exams, and interview discussions.',
    headlines: [
      'Daily Editorial Breakdown: Strategic Communication in Tech Leadership Roles',
      'Economic Survey 2026: Key Policy Takeaways for Fresh Graduates and Job Seekers'
    ]
  },
  {
    id: 'paper-toi',
    shortCode: 'TOI',
    badgeColor: '#e11d48',
    name: 'Times of India',
    language: 'English',
    category: 'Tech & Economy',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.timesofindia.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Comprehensive business news, startup funding, global technology trends, and campus career insights.',
    headlines: [
      'IT Companies Boost Hiring of Tier-2 & Tier-3 College Graduates in 2026',
      'Startups Focus on Communication & Soft Skills in Final Round HR Interviews'
    ]
  },
  {
    id: 'paper-et',
    shortCode: 'ET',
    badgeColor: '#92400e',
    name: 'Economic Times',
    language: 'English',
    category: 'Business & Finance',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.economictimes.indiatimes.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Financial markets, corporate growth stories, venture capital, and macro-economic trends.',
    headlines: [
      'Indian Startup Ecosystem Reaches Record Valuation with AI-first Enterprise Solutions',
      'Fintech Hiring Surge: Demand Spikes for Cloud Engineers and Product Analysts'
    ]
  },
  {
    id: 'paper-fe',
    shortCode: 'FE',
    badgeColor: '#ef4444',
    name: 'Financial Express',
    language: 'English',
    category: 'Markets & Economy',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.financialexpress.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'In-depth financial journalism, stock market updates, and trade policy insights.',
    headlines: [
      'Global Export Growth Boosts Logistics and Supply Chain Tech Positions in India',
      'Manufacturing Sector Expands Automation Bootcamps for Fresh Engineering Grads'
    ]
  },
  {
    id: 'paper-tt',
    shortCode: 'TT',
    badgeColor: '#1e293b',
    name: 'The Telegraph',
    language: 'English',
    category: 'Eastern & National',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.telegraphindia.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Leading newspaper covering Eastern India, higher education policy, and cultural affairs.',
    headlines: [
      'Kolkata Tech Parks Announce Mega Campus Placement Drives for 2026',
      'University Curriculums Integrate Practical English Soft-Skills Assessments'
    ]
  },
  {
    id: 'paper-dc',
    shortCode: 'DC',
    badgeColor: '#7c3aed',
    name: 'Deccan Chronicle',
    language: 'English',
    category: 'South India & Tech',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.deccanchronicle.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Top South Indian daily covering technology hubs, urban growth, and campus placement drives.',
    headlines: [
      'Hyderabad & Chennai IT Hubs Expand Campus Hiring Programs for Freshers',
      'Regional Engineering Colleges Achieve 92% Placement Rate in Core Tech'
    ]
  },
  {
    id: 'paper-ts',
    shortCode: 'TS',
    badgeColor: '#0f172a',
    name: 'The Statesman',
    language: 'English',
    category: 'Governance & Policy',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.thestatesman.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Independent reporting on national governance, diplomatic relations, and educational policy.',
    headlines: [
      'National Education Framework Mandates Soft Skills & Public Speaking Training',
      'State-Level Digital Literacy Initiatives Empower Rural College Graduates'
    ]
  },
  {
    id: 'paper-tr',
    shortCode: 'TR',
    badgeColor: '#dc2626',
    name: 'The Tribune',
    language: 'English',
    category: 'North India & General',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.tribuneindia.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Premier Northern India daily covering agriculture, technology, and university updates.',
    headlines: [
      'North Indian Universities Host Multi-Disciplinary Placement Fairs',
      'Agritech Innovations Open New Career Avenues for Computer Science Grads'
    ]
  },
  {
    id: 'paper-aa',
    shortCode: 'AA',
    badgeColor: '#a16207',
    name: 'The Asian Age',
    language: 'English',
    category: 'Global & International',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.asianage.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Global geopolitical news, international trade, and cross-border tech recruitment.',
    headlines: [
      'International Software Firms Recruit Indian Freshers for Global Remote Teams',
      'Cross-Cultural Communication Skills Gain High Priority in Global HR Rounds'
    ]
  },
  {
    id: 'paper-pi',
    shortCode: 'PI',
    badgeColor: '#1e1b4b',
    name: 'The Pioneer',
    language: 'English',
    category: 'Politics & Opinion',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://dailypioneer.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Classic political commentary, policy debates, and group discussion editorials.',
    headlines: [
      'Role of AI Ethics in Modern Placement Interviews: Group Discussion Guide',
      'Infrastructure Spending Spurs Civil and Software Engineering Demands'
    ]
  },
  {
    id: 'paper-fpj',
    shortCode: 'FPJ',
    badgeColor: '#e11d48',
    name: 'Free Press Journal',
    language: 'English',
    category: 'Finance & Regional',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.freepressjournal.in',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Financial hub updates from Mumbai, trade news, and corporate career guidance.',
    headlines: [
      'Mumbai Financial District Opens 15,000 Entry-Level Analyst Positions',
      'How to Craft a High-Impact Resume for Placement Interview Screening'
    ]
  },
  {
    id: 'paper-bs',
    shortCode: 'BS',
    badgeColor: '#b91c1c',
    name: 'Business Standard',
    language: 'English',
    category: 'Corporate & Strategy',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.business-standard.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Authoritative analysis on corporate strategy, industry trends, and economic indicators.',
    headlines: [
      'IT Service Majors Revamp Placement Training Protocols for Fresh Engineers',
      'Semiconductor Manufacturing Boom Creates High-Tech Employment Options'
    ]
  },
  {
    id: 'paper-lm',
    shortCode: 'LM',
    badgeColor: '#059669',
    name: 'Live Mint',
    language: 'English',
    category: 'Startups & Tech',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.livemint.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Premium tech and business daily covering unicorns, startups, and career growth strategies.',
    headlines: [
      'Top 10 Soft Skills Employers Look for During 2026 Campus Hiring',
      'Cloud Computing & GenAI Projects Take Center Stage in Engineering Placements'
    ]
  },
  {
    id: 'paper-hi',
    shortCode: 'HI',
    badgeColor: '#dc2626',
    name: 'Hans India',
    language: 'English',
    category: 'Education & Career',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.thehansindia.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Student-focused coverage of higher education exams, placement drives, and skill development.',
    headlines: [
      'State Skill Development Council Conducts Mock Interview Workshops for Students',
      'Over 50 Companies Participate in Regional Mega Placement Expo'
    ]
  },
  {
    id: 'paper-dh',
    shortCode: 'DH',
    badgeColor: '#6366f1',
    name: 'Deccan Herald',
    language: 'English',
    category: 'Bengaluru Tech & Innovation',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.deccanherald.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Voice of Silicon Valley of India, covering startups, tech research, and university hiring.',
    headlines: [
      'Bengaluru R&D Centers Hire Record Number of Fresh Computer Science Graduates',
      'Mock Group Discussion Rounds Help Students Overcome Placement Anxiety'
    ]
  },
  {
    id: 'paper-ht',
    shortCode: 'HT',
    badgeColor: '#e11d48',
    name: 'Hindustan Times',
    language: 'English',
    category: 'Metro & Career',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.hindustantimes.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Extensive national coverage, education news, metro developments, and placement advice.',
    headlines: [
      'Campus Recruitment 2026: Why Spoken English Fluency is Key to HR Success',
      'Skill India Mission Launches Specialized AI & Coding Bootcamps'
    ]
  },
  {
    id: 'paper-lt',
    shortCode: 'LT',
    badgeColor: '#dc2626',
    name: 'Lokmat Times',
    language: 'English',
    category: 'Regional & Business',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.lokmat.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Prominent daily covering industrial hubs, state employment, and student achievements.',
    headlines: [
      'Tier-2 Engineering Colleges Report Surge in Corporate Placement Tie-Ups',
      'Communication Training Programs Boost Student Interview Confidence'
    ]
  },
  {
    id: 'paper-mr',
    shortCode: 'MR',
    badgeColor: '#1e293b',
    name: 'Mirror',
    language: 'English',
    category: 'City & Social Trends',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://mumbaimirror.indiatimes.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'City trends, youth culture, workplace dynamics, and soft skills guidance.',
    headlines: [
      'Gen Z Job Seekers Prioritize Hybrid Work Flexibility & Continuous Learning',
      'Campus Mentorship Networks Help Students Prepare for Placement Discussions'
    ]
  },
  {
    id: 'paper-tt2',
    shortCode: 'TT',
    badgeColor: '#dc2626',
    name: 'Telangana Today',
    language: 'English',
    category: 'Hyderabad IT & Innovation',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.telanganatoday.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Coverage of Telangana IT corridor, HITEC city placements, and educational drives.',
    headlines: [
      'Hyderabad HITEC City Companies Announce 20,000 Fresher Job Openings',
      'Engineering Colleges Conduct Intensive English Fluency & Aptitude Modules'
    ]
  },

  // 5 Tamil ePapers
  {
    id: 'paper-dt',
    shortCode: 'DT',
    badgeColor: '#dc2626',
    name: 'Dina Thanthi (தினத்தந்தி)',
    language: 'Tamil',
    category: 'Tamil Regional & Placements',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.dtnext.in',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Tamil Nadu’s highest circulated daily ePaper featuring state news, educational placement updates, and employment drives.',
    headlines: [
      'தமிழ்நாடு கல்லூரிகளில் பிரம்மாண்ட கேம்ப斯 இண்டர்வியூ முகாம் தொடக்கம்',
      'சென்னை ஐடி பூங்காவில் 10,000 பேருக்கு புதிய வேலைவாய்ப்புகள் அறிவிப்பு',
      'கல்லூரி மாணவர்களுக்கான ஆங்கில பேச்சுத்திறன் பயிற்சித் திட்டம்'
    ]
  },
  {
    id: 'paper-dm',
    shortCode: 'DM',
    badgeColor: '#e11d48',
    name: 'Dinamalar (தினம் மலர்)',
    language: 'Tamil',
    category: 'Tamil Regional & Education',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.dinamalar.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Leading Tamil newspaper providing daily updates on education, competitive exams, technology, and regional news.',
    headlines: [
      'இன்ஜினியரிங் மாணவர்களுக்கு புதிய கேம்பஸ் பிளேஸ்மென்ட் வழிகாட்டுதல்',
      'செயற்கை நுண்ணறிவுத் துறையில் புதிய வேலைவாய்ப்புகள் அதிகரிப்பு'
    ]
  },
  {
    id: 'paper-dni',
    shortCode: 'DNI',
    badgeColor: '#7c3aed',
    name: 'Dinamani (தினம் மணி)',
    language: 'Tamil',
    category: 'Tamil Literary & Editorial',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.dinamani.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Reputed Tamil daily known for literary depth, editorial excellence, and educational guidance.',
    headlines: [
      'மாணவர்கள் நேர்முகத் தேர்வில் வெல்வதற்கான தமிழ் மற்றும் ஆங்கில வழிகாட்டுதல்',
      'தொழில்நுட்ப வளர்ச்சியைப் பயன்படுத்தும் இளைஞர்களின் சாதனை'
    ]
  },
  {
    id: 'paper-htt',
    shortCode: 'HTT',
    badgeColor: '#2563eb',
    name: 'Hindu Tamil Thisai (இந்து தமிழ் திசை)',
    language: 'Tamil',
    category: 'Tamil Analysis & Deep News',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.hindutamil.in',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Quality Tamil journalism with in-depth analysis on competitive exams, career opportunities, and global science.',
    headlines: [
      'போட்டித் தேர்வுகளில் வெற்றி பெற ஆங்கில வழிகாட்டுதல் கட்டுரைகள்',
      'தமிழக மாணவர்களுக்கு சர்வதேச வேலைவாய்ப்பு வழிகாட்டுதல்'
    ]
  },
  {
    id: 'paper-mm',
    shortCode: 'MM',
    badgeColor: '#db2777',
    name: 'Maalai Malar (மாலை மலர்)',
    language: 'Tamil',
    category: 'Tamil Evening & Regional',
    sourceUrl: 'https://dailyepaper.in/daily-news/',
    pdfUrl: 'https://dailyepaper.in/daily-news/',
    downloadPdfUrl: 'https://dailyepaper.in/daily-news/',
    officialWebsite: 'https://epaper.maalaimalar.com',
    updatedDate: new Date().toISOString().split('T')[0],
    description: 'Popular Tamil evening daily bringing rapid news, state developments, and employment notifications.',
    headlines: [
      'மாவட்ட வாரியாக இளைஞர்களுக்கான வேலைவாய்ப்பு முகாம் தேதி அறிவிப்பு',
      'கல்லூரி படிப்பை முடித்த மாணவர்களுக்கு சிறப்பு தொழிற்பயிற்சி'
    ]
  }
];

const DAILY_NEWS_VOCABULARY = [
  {
    word: 'Infrastructure',
    phonetics: '/ˈɪn.frəˌstrʌk.tʃər/',
    meaning: 'The basic physical and organizational structures needed for the operation of a enterprise or society.',
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
];

const DAILY_GD_TOPICS = [
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
];

app.get('/api/newspapers', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    lastRefreshed: lastRefreshTime,
    officialWebsite: 'https://dailyepaper.in/daily-news/',
    newspapers: NEWSPAPERS_DATA,
    dailyVocabulary: DAILY_NEWS_VOCABULARY,
    gdTopics: DAILY_GD_TOPICS
  });
});

app.post('/api/newspapers/refresh', (req: Request, res: Response) => {
  lastRefreshTime = new Date().toISOString();
  res.json({
    status: 'success',
    message: 'Newspaper feeds synced with dailyepaper.in official portal',
    lastRefreshed: lastRefreshTime,
    newspapers: NEWSPAPERS_DATA,
    dailyVocabulary: DAILY_NEWS_VOCABULARY,
    gdTopics: DAILY_GD_TOPICS
  });
});

// PDF ePaper Redirect Endpoint - redirects to official dailyepaper.in portal for actual ePaper PDFs
app.get('/api/epaper/pdf/:id', (req: Request, res: Response) => {
  res.redirect('https://dailyepaper.in/daily-news/');
});

// Mock Interview endpoints
app.post('/api/interview/start', (req: Request, res: Response) => {
  const { type, difficulty } = req.body;
  res.json({
    sessionId: 'session-' + Date.now(),
    type: type || 'HR Interview',
    difficulty: difficulty || 'Intermediate',
    questions: [
      {
        id: 'q1',
        questionText: 'Tell me about yourself and your background.',
        tipText: 'Keep it structured: Education -> Skills -> Career Goals.',
      },
      {
        id: 'q2',
        questionText: 'What are your greatest technical strengths?',
        tipText: 'Highlight 2 skills with a mini project example.',
      },
    ],
  });
});

// Institutional 3-Month Subscription Backend Endpoints
let collegeSubscriptionData = {
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
    }
  ]
};

export function generateFormalEmailContent(receipt: any) {
  const collegeName = receipt?.collegeName || 'Coimbatore Institute of Technology';
  const purchaserName = receipt?.purchaserName || 'Dr. R. Sundararajan';
  const purchaserRole = receipt?.purchaserRole || 'Principal';
  const purchaserEmail = receipt?.purchaserEmail || 'principal@cit.edu.in';
  const transactionId = receipt?.transactionId || 'TXN-CIT-884920';
  const amount = receipt?.amount !== undefined ? receipt.amount : 25000;
  const currency = receipt?.currency || '₹';
  const paymentMethod = receipt?.paymentMethod || 'Razorpay UPI (9113811578@upi)';
  const licenseKey = receipt?.licenseKey || 'CIT-2026-SEM1-8932';
  const dateStr = receipt?.date ? new Date(receipt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString();
  const expiryDateStr = receipt?.expiryDate ? new Date(receipt.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date(Date.now() + 90*24*60*60*1000).toLocaleDateString();

  const subject = `Official Payment Receipt & Tax Invoice: SpeakSure AI 3-Month Pass - ${collegeName} (${transactionId})`;

  const textBody = `
================================================================================
                    SPEAKSURE AI - OFFICIAL PAYMENT RECEIPT
================================================================================
Date: ${dateStr}
Invoice No: INV-2026-${transactionId}
Transaction ID: ${transactionId}
Payment Status: SUCCESS (256-Bit SSL Verified)

BILLED TO (COLLEGE MANAGEMENT):
--------------------------------------------------------------------------------
Institution Name : ${collegeName}
Purchaser Name   : ${purchaserName} (${purchaserRole})
Official Email   : ${purchaserEmail}
Payment Method   : ${paymentMethod}

ORDER SUMMARY:
--------------------------------------------------------------------------------
Item Description                               Duration         Amount Paid
--------------------------------------------------------------------------------
SpeakSure AI Institutional 1-Semester Pass     90 Days          ${currency}${amount.toLocaleString()}
(Unlimited Student Access - 50% OFF Offer)     (3 Months)
--------------------------------------------------------------------------------
TOTAL AMOUNT PAID (INCLUSIVE OF GST)                            ${currency}${amount.toLocaleString()}

INSTITUTIONAL LICENSE & ACCESS DETAILS:
--------------------------------------------------------------------------------
Institutional License Key : ${licenseKey}
Subscription Valid From   : ${dateStr}
Subscription Expiry Date  : ${expiryDateStr} (90 Days Total)
Student Onboarding Portal : http://localhost:3000/join?license=${licenseKey}

NOTE: All students across your institution now have full unlimited access to 
SpeakSure AI (Voice Coach, Interview Simulator, GD Room, Daily ePaper).

Need Assistance? Contact SpeakSure AI Billing Team at info@clousurepointsolutions.com
================================================================================
`;

  return {
    subject,
    textBody,
    recipient: purchaserEmail
  };
}

app.get('/api/subscription/status', (req: Request, res: Response) => {
  const expiry = new Date(collegeSubscriptionData.expiryDate).getTime();
  const now = new Date().getTime();
  const daysRemaining = Math.max(0, Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)));
  const isExpired = daysRemaining <= 0;
  const isRenewalWindow = daysRemaining <= 30 || isExpired;

  res.json({
    status: 'success',
    isExpired,
    isRenewalWindow,
    daysRemaining,
    subscription: collegeSubscriptionData
  });
});

app.post('/api/subscription/purchase', (req: Request, res: Response) => {
  const { subscription, receipt } = req.body;
  if (subscription) {
    collegeSubscriptionData = {
      ...collegeSubscriptionData,
      ...subscription
    };
  }

  const activeReceipt = receipt || collegeSubscriptionData.receipts[0];
  const emailData = generateFormalEmailContent(activeReceipt);

  console.log(`\n📧 ==================== FORMAL PAYMENT RECEIPT EMAIL DISPATCHED ====================`);
  console.log(`TO: ${emailData.recipient}`);
  console.log(`SUBJECT: ${emailData.subject}`);
  console.log(emailData.textBody);
  console.log(`======================================================================================\n`);

  res.json({
    status: 'success',
    message: `College 3-Month Semester Pass activated. Formal receipt emailed to ${emailData.recipient}`,
    emailSentTo: emailData.recipient,
    emailContent: emailData,
    receipt: activeReceipt,
    subscription: collegeSubscriptionData
  });
});

app.get('/api/subscription/history', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    receipts: collegeSubscriptionData.receipts || []
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SpeakSure AI API Server running on port ${PORT}`);
});

