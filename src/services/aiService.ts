import { SpeechAnalysisResult, CorrectedSentence, UserProfile } from '../types';

class AIService {
  // Analyze spoken transcript to generate a comprehensive, structured evaluation
  public analyzeSpeaking(transcript: string, durationSeconds: number): SpeechAnalysisResult {
    const cleaned = transcript.trim();
    if (!cleaned) {
      return {
        overallScore: 50,
        fluencyScore: 50,
        grammarScore: 50,
        vocabularyScore: 50,
        pronunciationScore: 50,
        confidenceScore: 50,
        wordsPerMinute: 0,
        fillerWords: 0,
        longPauses: 0,
        strengths: ['You took the initiative to start speaking today!'],
        improvements: ['Try speaking a complete sentence of at least 20-30 seconds.'],
        correctedSentences: [],
        practiceSentences: ['I am excited to improve my English communication skills every day.'],
        nextExercise: 'Try the Day 1 Introduction exercise again in Voice mode.'
      };
    }

    const words = cleaned.split(/\s+/);
    const wordCount = words.length;
    const durationMinutes = Math.max(durationSeconds / 60, 0.2);
    const wordsPerMinute = Math.round(wordCount / durationMinutes);

    // Detect filler words (e.g., um, ah, like, you know, basically, actually, err)
    const fillerRegex = /\b(um|uh|ah|like|basically|actually|you know|err|mean)\b/gi;
    const fillerMatches = cleaned.match(fillerRegex) || [];
    const fillerWordsCount = fillerMatches.length;

    // Detect repeated words or restarts
    const repeatRegex = /\b(\w+)\s+\1\b/gi;
    const repeatMatches = cleaned.match(repeatRegex) || [];
    const repeatedWordsCount = repeatMatches.length;

    // Estimate long pauses based on ellipses or punctuation density
    const longPauses = (cleaned.match(/\.{3,}|\?{2,}|!{2,}/g) || []).length + Math.max(0, Math.floor((durationSeconds - wordCount * 0.4) / 8));

    // Common grammar mistakes checking in Indian English context
    const correctedSentences: CorrectedSentence[] = [];

    if (/\b(yesterday|last week|ago)\b.*?\b(go|come|do|see|buy|is)\b/i.test(cleaned)) {
      correctedSentences.push({
        original: 'Yesterday I go to college and see my friends...',
        corrected: 'Yesterday I went to college and saw my friends...',
        explanation: 'When talking about past events (yesterday), use past tense verbs ("went", "saw").'
      });
    }

    if (/\b(i am coming from|i am belong to)\b/i.test(cleaned)) {
      correctedSentences.push({
        original: 'I am coming from Coimbatore.',
        corrected: 'I am from Coimbatore.',
        explanation: 'Use "I am from..." or "I hail from..." for a more natural professional introduction.'
      });
    }

    if (/\b(didn't|did not)\s+(\w+ed|\w+went|\w+came)\b/i.test(cleaned)) {
      correctedSentences.push({
        original: 'I didn\'t went to the lecture.',
        corrected: 'I didn\'t go to the lecture.',
        explanation: 'Always use the base verb form after "didn\'t".'
      });
    }

    if (/\b(having|have)\s+(knowledge in|experience in)\b/i.test(cleaned)) {
      correctedSentences.push({
        original: 'I am having knowledge in Azure and Python.',
        corrected: 'I have practical knowledge of Azure and Python.',
        explanation: 'Use "I have" instead of "I am having" when referring to skills and facts.'
      });
    }

    // Default polite correction if none caught specifically
    if (correctedSentences.length === 0 && wordCount > 5) {
      correctedSentences.push({
        original: cleaned.length > 60 ? cleaned.substring(0, 60) + '...' : cleaned,
        corrected: cleaned.length > 60 ? cleaned.substring(0, 60) + '...' : cleaned,
        explanation: 'Your sentence structure was clear and understandable. Keep up the good momentum!'
      });
    }

    // Score calculations
    // WPM ideal range: 110 - 150
    let fluencyScore = 75;
    if (wordsPerMinute >= 100 && wordsPerMinute <= 160) fluencyScore += 15;
    else if (wordsPerMinute < 80) fluencyScore -= 15;

    if (fillerWordsCount > 4) fluencyScore -= 10;
    if (longPauses > 3) fluencyScore -= 10;
    fluencyScore = Math.min(Math.max(fluencyScore, 45), 98);

    let grammarScore = 80 - correctedSentences.length * 8;
    grammarScore = Math.min(Math.max(grammarScore, 50), 96);

    // Vocabulary variety score
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const vocabDiversity = uniqueWords.size / Math.max(wordCount, 1);
    let vocabularyScore = Math.round(55 + vocabDiversity * 40);
    vocabularyScore = Math.min(Math.max(vocabularyScore, 50), 95);

    let confidenceScore = Math.round((fluencyScore + (100 - fillerWordsCount * 5)) / 2);
    confidenceScore = Math.min(Math.max(confidenceScore, 45), 98);

    let pronunciationScore = Math.round((grammarScore + fluencyScore) / 2 + 3);
    pronunciationScore = Math.min(Math.max(pronunciationScore, 50), 95);

    const overallScore = Math.round((fluencyScore * 0.25) + (grammarScore * 0.25) + (vocabularyScore * 0.2) + (pronunciationScore * 0.15) + (confidenceScore * 0.15));

    // Dynamic Strengths & Improvements
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (wordCount >= 25) {
      strengths.push('Great job speaking continuously and sharing detailed thoughts.');
    } else {
      strengths.push('Good attempt! You voiced your thoughts clearly.');
    }

    if (fillerWordsCount <= 2) {
      strengths.push('Minimal use of filler words (um/ah), which projects confidence.');
    } else {
      improvements.push(`Try to reduce filler words like "um" or "like" (detected ${fillerWordsCount} times). Pause silently instead.`);
    }

    if (wordsPerMinute < 90) {
      improvements.push('Your pace was a bit slow. Try to connect your phrases smoothly.');
    } else if (wordsPerMinute > 165) {
      improvements.push('You spoke very fast. Slow down slightly so the interviewer can absorb every key point.');
    } else {
      strengths.push(`Excellent speaking rate of ${wordsPerMinute} words per minute!`);
    }

    if (longPauses > 2) {
      improvements.push('We noticed long pauses between thoughts. Try framing your next idea in short 4-5 word phrases.');
    }

    const practiceSentences = [
      'I am pursuing my degree with a focus on practical software engineering.',
      'During my college projects, I enjoyed collaborating with my teammates to solve complex bugs.',
      'I look forward to contributing my technical skills to real-world projects.'
    ];

    return {
      overallScore,
      fluencyScore,
      grammarScore,
      vocabularyScore,
      pronunciationScore,
      confidenceScore,
      interviewReadinessScore: Math.min(overallScore + 2, 98),
      wordsPerMinute,
      fillerWords: fillerWordsCount,
      longPauses,
      repeatedWords: repeatedWordsCount,
      sentenceRestarts: Math.min(longPauses, 2),
      strengths,
      improvements,
      correctedSentences,
      practiceSentences,
      nextExercise: overallScore > 75 ? 'Advance to Day 6: Project Explanation practice.' : 'Retry this exercise to boost fluency above 75%!'
    };
  }

  // SpeakSure AI Coach Chat response generator (Supports English, Tamil, and Tanglish)
  public generateCoachResponse(userMessage: string, profile: UserProfile): { text: string; grammarTip?: string } {
    const raw = userMessage || '';
    const msg = raw.toLowerCase();

    const isTamil = /[\u0B80-\u0BFF]/.test(raw);
    const isTanglish = /\b(epdi|solradhu|naan|enoda|iruku|pesradhu|bro|hesitat|vanakkam|namba|pannunga|solunga|puriyala|nalla|keta|therila|ennode|hesitation|interviewla)\b/i.test(msg);

    const userName = profile.name ? profile.name.split(' ')[0] : 'Student';
    const userRole = profile.targetRole || 'Software Developer';
    const userCollege = profile.college || 'our college';
    const userCourse = profile.course || 'degree';

    // 1. Tanglish Input Handling
    if (isTanglish) {
      if (msg.includes('project') || msg.includes('final year')) {
        return {
          text: `Vanakkam ${userName}! Project pathi interview-la explain panna indha 3-step English formula use pannunga:\n\n1. Project & Tech: "In my ${userCourse} at ${userCollege}, I developed a hands-on project focused on software solutions."\n2. Your Role: "My key responsibility was developing API features and database queries."\n3. Outcome: "We completed the project on time and achieved high accuracy."\n\nNenga ipo mic click panni indha 3 lines-ah English-la pesi paarunga!`,
          grammarTip: 'Project explain pannumbodhu always past tense ("developed", "implemented") use pannunga.'
        };
      }

      if (msg.includes('introduce') || msg.includes('tell me about') || msg.includes('yourself') || msg.includes('solradhu')) {
        return {
          text: `Hi ${userName}! Self introduction-kaaga super-aana formula idho:\n\n1. "Good morning, I am ${profile.name || userName}."\n2. "I am pursuing my ${userCourse} at ${userCollege}."\n3. "I am passionate about technology and eager to join as a ${userRole}."\n\nIdha apdiye mic click panni voice-la solli practice pannunga!`,
          grammarTip: 'Greeting ("Good morning/afternoon") oda start pannungana interviewers-ku energetic-ah irukum.'
        };
      }

      if (msg.includes('hesitat') || msg.includes('fear') || msg.includes('bayadhu') || msg.includes('nervous') || msg.includes('tension')) {
        return {
          text: `Kavalaiye padadhinga ${userName}! Hesitation irukradhu rumba normal. Placement-la fearless-ah pesa indha 3 tips:\n\n1. Simple English: Complex vocabulary venam, simple short sentences podhum.\n2. Silent Pause: Ummm/Ahhh-nu solradhuku badhula 1 sec silent pause eduthukonga.\n3. Chunking: 4-word short chunks-ah pesunga.\n\nLet's try a quick 15-second practice together!`,
          grammarTip: 'Don\'t worry about small grammar mistakes while speaking. Fluency comes with daily practice.'
        };
      }

      return {
        text: `Super query ${userName}! Tanglish-la nenga ketadhukaana English practice formula idho:\n\n"I am actively practicing daily English communication to perform confidently in campus placement interviews for ${userRole} roles."\n\nIndha sentence-ah nenga voice-la pesi record pannunga!`,
        grammarTip: 'Tanglish thoughts-ah 3-4 word simple English sentences-ah convert panni pesunga.'
      };
    }

    // 2. Tamil Script Input Handling
    if (isTamil) {
      if (msg.includes('திட்டம்') || msg.includes('ப்ராஜெக்ட்') || msg.includes('project')) {
        return {
          text: `வணக்கம் ${userName}! உங்கள் கல்லூரியின் ஃபைனல் இயர் ப்ராஜெக்ட் பற்றி ஆங்கிலத்தில் பேச:\n\n1. "In my final year project, I developed a web solution for real-world problems."\n2. "My main contribution was writing core backend and database logic."\n3. "This project improved my problem-solving ability."\n\nஇப்போது மைக் பொத்தானை அழுத்தி இதை ஆங்கிலத்தில் பேசிப் பாருங்கள்!`,
          grammarTip: 'முடித்த திட்டங்களைப் பற்றிப் பேசும்போது எப்போதும் ' + '"developed", "built"' + ' போன்ற இறந்தகால வினைச்சொற்களைப் பயன்படுத்துங்கள்.'
        };
      }

      return {
        text: `வணக்கம் ${userName}! உங்கள் கேள்வியைப் புரிந்துகொண்டேன். கேம்பஸ் இண்டர்வியூவில் வெற்றி பெற:\n\n1. "Good morning, I am excited for this placement opportunity."\n2. "I am pursuing my ${userCourse} at ${userCollege}."\n3. "I look forward to contributing my technical skills."\n\nஇப்போது இந்த ஆங்கில வாக்கியங்களை உங்கள் குரலில் பேசிப் பாருங்கள்!`,
        grammarTip: 'எளிய ஆங்கில வாக்கியங்களாகப் பேசி உங்கள் தன்னம்பிக்கையை உயர்த்துங்கள்.'
      };
    }

    // 3. English Standard Input Handling
    if (msg.includes('introduce') || msg.includes('tell me about yourself')) {
      return {
        text: `Here is a winning 3-step formula for college placement introductions:\n\n1. Greeting & Name: "Good morning, I am ${profile.name || userName}."\n2. College & Major: "I am pursuing my ${userCourse} at ${userCollege}, graduating in ${profile.graduationYear || 2027}."\n3. Passion & Role: "I specialize in web development and cloud tech, and I am excited to apply for ${userRole} roles."\n\nWould you like to try speaking this intro to me right now?`,
        grammarTip: 'Use present continuous ("pursuing") for your ongoing degree.'
      };
    }

    if (msg.includes('pronunciation') || msg.includes('pronounce')) {
      return {
        text: 'Great focus! High-impact words for interview success:\n- Comfortable (kum-fer-tuh-bul)\n- Development (dih-vel-uhp-munt)\n- Technology (tek-nol-uh-jee)\n- Opportunity (op-er-tyoo-nuh-tee)\n\nHead over to the Pronunciation tab to practice recording each word!',
      };
    }

    if (msg.includes('weakness')) {
      return {
        text: 'When asked about weaknesses in an HR interview:\n- Never say "I have no weakness".\n- Choose a soft technical or organizational skill (e.g., "I used to get nervous during public speaking").\n- Always end with your solution: "However, I joined SpeakSure AI and practice 10 minutes every day to build confidence."\n\nTry giving me your answer!',
        grammarTip: 'Use past tense for the weakness and present tense for your current improvement habit.'
      };
    }

    if (msg.includes('hesitat') || msg.includes('stammer') || msg.includes('afraid')) {
      return {
        text: `It is completely normal to feel hesitant, ${userName}! Remember: every good speaker started where you are.\n\nHere are 3 Fearless Speaking tips:\n1. Speak in short 4-word chunks.\n2. Take a deep breath before answering.\n3. It is okay to take a silent 2-second pause instead of saying "ummm".\n\nLet's try a 15-second Fearless challenge together!`,
      };
    }

    // Default friendly response
    return {
      text: `Good point, ${userName}! You are doing great by practicing daily. A natural way to express your thoughts is to speak steadily without worrying about perfection. What topic would you like to practice speaking about next — your project, your strengths, or an HR interview question?`,
      grammarTip: 'Keep your sentences short and crisp during interview responses.'
    };
  }

  // Generate customized STAR Interview Answers based on student profile
  public generateInterviewAnswer(questionText: string, profile: UserProfile): { simple: string; natural: string; professional: string } {
    const role = profile.targetRole || 'Software Developer';
    const course = profile.course || 'B.Tech CS';
    const college = profile.college || 'our institution';

    if (questionText.toLowerCase().includes('tell me about yourself')) {
      return {
        simple: `My name is ${profile.name}. I am studying ${course} at ${college}. I like coding and problem solving. I want to work as a ${role}.`,
        natural: `Hi, I am ${profile.name}. I am currently in my final year of ${course} at ${college}. During my college years, I built a strong passion for technology and hands-on projects. I am eager to kickstart my career as a ${role} where I can learn and contribute.`,
        professional: `Good morning. My name is ${profile.name}, and I am pursuing my ${course} at ${college}, graduating in ${profile.graduationYear}. Throughout my academic journey, I have developed technical proficiency in software development, data structures, and cloud fundamentals. I have completed practical hands-on projects and co-curricular workshops. I am highly motivated to join your organization as a ${role} to deliver impact from day one.`
      };
    }

    return {
      simple: `In my ${course} at ${college}, I faced several academic deadlines. I worked hard with my teammates to complete everything on time.`,
      natural: `During my final year project at ${college}, our team encountered a difficult bug right before submission. I stayed calm, researched the solution online, and guided the team to fix it.`,
      professional: `In my project work at ${college}, we were tasked with building a web solution under a tight deadline. As a key contributor, I analyzed the requirements, breakdown tasks, and implemented robust API modules. This experience enhanced my problem-solving ability and technical collaboration.`
    };
  }
}

export const aiService = new AIService();
