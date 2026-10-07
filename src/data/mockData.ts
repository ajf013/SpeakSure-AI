import { DailyAssessment, VocabularyWord, GrammarMistake, Achievement, InterviewQuestion } from '../types';

export const DAILY_ASSESSMENTS: DailyAssessment[] = [
  {
    id: 'day-1',
    dayNumber: 1,
    title: 'Tell me about yourself',
    promptText: 'Introduce yourself confidently to a recruiter. Highlight your name, college, course, key skills, and career passion.',
    category: 'Self Introduction',
    difficulty: 'Beginner',
    suggestedDurationSeconds: 75,
    tips: [
      'Start with a warm greeting: "Good morning/afternoon, thank you for this opportunity..."',
      'Mention your degree and college clearly.',
      'Highlight 2 key technical or interpersonal skills.',
      'State what kind of role you are aspiring for.'
    ],
    sampleAnswer: "Hello! Thank you for this opportunity. I am currently in my final year pursuing my degree. I am passionate about technology and software development, and I look forward to starting my career."
  },
  {
    id: 'day-2',
    dayNumber: 2,
    title: 'Tell me about your college',
    promptText: 'Describe your college campus, academic environment, favorite events, or what you enjoy most about studying there.',
    category: 'College Life',
    difficulty: 'Beginner',
    suggestedDurationSeconds: 60,
    tips: [
      'Mention your college name and location.',
      'Talk about faculty support, practical labs, or student clubs.',
      'Keep your tone positive and appreciative.'
    ]
  },
  {
    id: 'day-3',
    dayNumber: 3,
    title: 'What are your strengths?',
    promptText: 'Explain 2-3 of your biggest strengths with practical real-life or academic examples.',
    category: 'HR Interview',
    difficulty: 'Beginner',
    suggestedDurationSeconds: 60,
    tips: [
      'Pick qualities like adaptability, quick learner, problem solving, or team coordination.',
      'Support each strength with a brief example (e.g., hackathon, mini-project, college event).'
    ]
  },
  {
    id: 'day-4',
    dayNumber: 4,
    title: 'What are your weaknesses?',
    promptText: 'Share a genuine area of improvement and explain how you are actively working to overcome it.',
    category: 'HR Interview',
    difficulty: 'Intermediate',
    suggestedDurationSeconds: 60,
    tips: [
      'Choose a non-critical weakness (e.g., hesitating to delegate tasks or public speaking anxiety).',
      'Always focus on your action step: "However, I have started practicing daily speaking on SpeakSure AI..."'
    ]
  },
  {
    id: 'day-5',
    dayNumber: 5,
    title: 'Why should we hire you?',
    promptText: 'Convince an interviewer why you are the ideal fit for a graduate role at their company.',
    category: 'HR Interview',
    difficulty: 'Intermediate',
    suggestedDurationSeconds: 75,
    tips: [
      'Connect your technical foundation with your enthusiasm to learn.',
      'Highlight your problem-solving mindset and dedication.'
    ]
  },
  {
    id: 'day-6',
    dayNumber: 6,
    title: 'Tell me about your final-year project',
    promptText: 'Explain the problem your project solves, technologies used, your specific contribution, and the final outcome.',
    category: 'Technical Interview Communication',
    difficulty: 'Intermediate',
    suggestedDurationSeconds: 90,
    tips: [
      'Use the Problem-Solution-Tech Stack structure.',
      'Clearly state: "My role in the project was..."',
      'Mention any challenges you overcame.'
    ]
  },
  {
    id: 'day-7',
    dayNumber: 7,
    title: 'Where do you see yourself in five years?',
    promptText: 'Describe your professional growth goals and aspirations for the next 5 years.',
    category: 'HR Interview',
    difficulty: 'Intermediate',
    suggestedDurationSeconds: 60,
    tips: [
      'Focus on skill mastery, taking on leadership responsibility, and adding value to the organization.'
    ]
  },
  {
    id: 'day-8',
    dayNumber: 8,
    title: 'Tell me about a challenge you faced',
    promptText: 'Use the STAR method (Situation, Task, Action, Result) to describe how you tackled a tough situation.',
    category: 'Behavioral Questions',
    difficulty: 'Intermediate',
    suggestedDurationSeconds: 90,
    tips: ['Keep focus on your positive actions and the positive outcome achieved.']
  },
  {
    id: 'day-9',
    dayNumber: 9,
    title: 'Describe your favorite technology',
    promptText: 'Talk enthusiastically about a technology tool, framework, or trend that excites you and why.',
    category: 'Impromptu Speaking',
    difficulty: 'Beginner',
    suggestedDurationSeconds: 60,
    tips: ['Explain what it is, why it is innovative, and how you have experimented with it.']
  },
  {
    id: 'day-10',
    dayNumber: 10,
    title: 'Why do you want to join our company?',
    promptText: 'Explain what attracts you to the company\'s work culture, projects, or industry standing.',
    category: 'HR Interview',
    difficulty: 'Intermediate',
    suggestedDurationSeconds: 75,
    tips: ['Show that you have researched the company\'s values and recent technology work.']
  },
  {
    id: 'day-11',
    dayNumber: 11,
    title: 'Tell me about your hometown',
    promptText: 'Describe your hometown, its unique culture, food, or famous landmarks in clear everyday English.',
    category: 'Everyday English',
    difficulty: 'Beginner',
    suggestedDurationSeconds: 60,
    tips: ['Focus on smooth description and friendly tone.']
  },
  {
    id: 'day-12',
    dayNumber: 12,
    title: 'Describe your daily routine',
    promptText: 'Walk through your typical day as a college student from morning to night.',
    category: 'Everyday English',
    difficulty: 'Beginner',
    suggestedDurationSeconds: 60,
    tips: ['Use time transition words: First, then, after that, around noon, finally.']
  },
  {
    id: 'day-13',
    dayNumber: 13,
    title: 'Tell me about your achievements',
    promptText: 'Share an academic, co-curricular, or personal achievement you are proud of.',
    category: 'Self Introduction',
    difficulty: 'Intermediate',
    suggestedDurationSeconds: 75,
    tips: ['Be proud without bragging. Focus on hard work and team effort.']
  },
  {
    id: 'day-14',
    dayNumber: 14,
    title: 'What motivates you?',
    promptText: 'Share what drives you to perform your best every day in college and life.',
    category: 'Situational Questions',
    difficulty: 'Intermediate',
    suggestedDurationSeconds: 60,
    tips: ['Common motivators: solving complex problems, learning new concepts, helping others.']
  },
  {
    id: 'day-15',
    dayNumber: 15,
    title: 'Group Discussion: Is AI a threat to jobs or an opportunity?',
    promptText: 'Present your opinion on AI in workplace automation clearly and politely in a GD context.',
    category: 'Group Discussion',
    difficulty: 'Advanced',
    suggestedDurationSeconds: 90,
    tips: ['Use phrases like: "In my opinion...", "While I understand that perspective, I believe..."']
  }
];

export const VOCABULARY_WORDS: VocabularyWord[] = [
  {
    id: 'v1',
    word: 'Adaptability',
    phonetics: '/əˌdæp.təˈbɪl.ə.ti/',
    meaning: 'The quality of being able to adjust quickly to new conditions or technologies.',
    exampleSentence: 'My adaptability helped me quickly learn React during my internship project.',
    category: 'Interview',
    difficulty: 'Beginner'
  },
  {
    id: 'v2',
    word: 'Collaboration',
    phonetics: '/kəˈlæb.ə.reɪt/',
    meaning: 'Working together with one or more people to produce or achieve something.',
    exampleSentence: 'Effective collaboration among team members ensured on-time submission of our project.',
    category: 'Workplace',
    difficulty: 'Beginner'
  },
  {
    id: 'v3',
    word: 'Meticulous',
    phonetics: '/məˈtɪk.jə.ləs/',
    meaning: 'Showing great attention to detail; very careful and precise.',
    exampleSentence: 'He was meticulous in debugging the database API routes.',
    category: 'Interview',
    difficulty: 'Intermediate'
  },
  {
    id: 'v4',
    word: 'Articulate',
    phonetics: '/ɑːrˈtɪk.jə.leɪt/',
    meaning: 'Expressing ideas clearly and fluently in spoken words.',
    exampleSentence: 'She gave an articulate presentation during the campus placement drive.',
    category: 'Communication',
    difficulty: 'Intermediate'
  },
  {
    id: 'v5',
    word: 'Scalability',
    phonetics: '/ˌskeɪ.ləˈbɪl.ə.ti/',
    meaning: 'The capacity of a system or application to handle growing workload seamlessly.',
    exampleSentence: 'We deployed our microservices on Azure to ensure high availability and scalability.',
    category: 'Technology',
    difficulty: 'Advanced'
  },
  {
    id: 'v6',
    word: 'Proactive',
    phonetics: '/proʊˈæk.tɪv/',
    meaning: 'Taking action in advance to handle a expected difficulty rather than reacting after.',
    exampleSentence: 'I took a proactive approach by taking up online certifications in cloud architecture.',
    category: 'Interview',
    difficulty: 'Intermediate'
  }
];

export const INITIAL_MISTAKES: GrammarMistake[] = [
  {
    id: 'm1',
    userId: 'u1',
    category: 'Past Tense',
    incorrectPattern: 'Yesterday I go to college',
    correctPattern: 'Yesterday I went to college',
    explanation: 'Use the past tense form "went" instead of present tense "go" when referring to past time.',
    occurrences: 4,
    mastered: false
  },
  {
    id: 'm2',
    userId: 'u1',
    category: 'Vocabulary Choice',
    incorrectPattern: 'I am coming from Coimbatore',
    correctPattern: 'I am from Coimbatore',
    explanation: '"I am from..." is the standard natural phrasing when introducing your hometown.',
    occurrences: 3,
    mastered: false
  },
  {
    id: 'm3',
    userId: 'u1',
    category: 'Subject-Verb Agreement',
    incorrectPattern: 'I didn\'t went there',
    correctPattern: 'I didn\'t go there',
    explanation: 'After auxiliary verb "didn\'t", always use the base form of the verb ("go", not "went").',
    occurrences: 5,
    mastered: false
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Step',
    description: 'Completed your first AI English speaking assessment.',
    iconName: 'Mic',
    unlocked: true,
    unlockedAt: '2026-10-01'
  },
  {
    id: 'ach-2',
    title: '7-Day Speaker',
    description: 'Maintained a 7-day daily practice streak.',
    iconName: 'Flame',
    unlocked: true,
    unlockedAt: '2026-10-06'
  },
  {
    id: 'ach-3',
    title: 'Fearless Speaker',
    description: 'Spoke continuously for 60 seconds without long pauses.',
    iconName: 'Zap',
    unlocked: false
  },
  {
    id: 'ach-4',
    title: 'Interview Ready',
    description: 'Scored 80+ on a mock placement interview simulation.',
    iconName: 'Award',
    unlocked: false
  },
  {
    id: 'ach-5',
    title: 'Vocab Master',
    description: 'Practiced and mastered 25 interview vocabulary words.',
    iconName: 'BookOpen',
    unlocked: false
  }
];

export const MOCK_INTERVIEW_QUESTIONS: Record<string, InterviewQuestion[]> = {
  'HR Interview': [
    {
      id: 'hr-1',
      questionText: 'Tell me about yourself and your academic journey.',
      expectedKeywords: ['education', 'skills', 'passion', 'projects', 'career goal'],
      tipText: 'Keep it structured: Background -> Skills & Projects -> Career Ambition.',
      sampleAnswer: 'I am currently pursuing my B.Tech in Computer Science at XYZ College. Over the past 3 years, I have built a solid foundation in programming and web applications...'
    },
    {
      id: 'hr-2',
      questionText: 'What are your key strengths and how will they benefit our team?',
      expectedKeywords: ['adaptability', 'teamwork', 'learning attitude', 'problem solving'],
      tipText: 'Align your strength with corporate performance expectations.',
      sampleAnswer: 'My main strength is my quick learning ability and adaptability...'
    },
    {
      id: 'hr-3',
      questionText: 'Why do you want to join our organization?',
      expectedKeywords: ['innovation', 'culture', 'growth', 'tech stack'],
      tipText: 'Show company research and enthusiasm.',
      sampleAnswer: 'I am inspired by your company\'s pioneering work in AI and cloud solutions...'
    }
  ],
  'Technical Interview': [
    {
      id: 'tech-1',
      questionText: 'Explain your most challenging college project and the architecture behind it.',
      expectedKeywords: ['frontend', 'backend', 'database', 'API', 'optimization'],
      tipText: 'Walk through your technical architecture logically.',
      sampleAnswer: 'Our project was a web application using React and Node.js...'
    },
    {
      id: 'tech-2',
      questionText: 'How do you handle debugging when code fails unexpectedly in production?',
      expectedKeywords: ['logs', 'root cause', 'breakpoints', 'testing', 'isolation'],
      tipText: 'Emphasize systematic debugging over guessing.',
      sampleAnswer: 'First, I inspect the application logs to identify the exact error stack trace...'
    }
  ]
};
