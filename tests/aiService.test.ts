import { describe, it, expect } from 'vitest';
import { aiService } from '../src/services/aiService';

describe('aiService Speech Analyzer', () => {
  it('should accurately calculate words per minute and filler words', () => {
    const transcript = 'Hello my name is Arun and I am basically studying computer science um like for my BCA degree.';
    const durationSeconds = 30;

    const result = aiService.analyzeSpeaking(transcript, durationSeconds);

    expect(result.wordsPerMinute).toBeGreaterThan(0);
    expect(result.fillerWords).toBeGreaterThanOrEqual(2); // "basically", "um", "like"
    expect(result.overallScore).toBeGreaterThan(50);
    expect(result.strengths.length).toBeGreaterThan(0);
    expect(result.correctedSentences.length).toBeGreaterThan(0);
  });

  it('should handle empty transcripts gracefully without crashing', () => {
    const result = aiService.analyzeSpeaking('', 10);
    expect(result.overallScore).toBe(50);
    expect(result.wordsPerMinute).toBe(0);
    expect(result.strengths[0]).toContain('initiative');
  });

  it('should generate personalized interview answers based on student profile', () => {
    const mockProfile = {
      id: '1',
      name: 'Arun Kumar',
      email: 'arun@test.com',
      college: 'CIT Coimbatore',
      course: 'BCA',
      graduationYear: 2027,
      targetRole: 'Cloud Engineer',
      englishLevel: 'Intermediate' as const,
      streakCount: 5,
      xpPoints: 300,
      currentLevel: 2,
      dailyGoalMinutes: 10,
      todayMinutesPracticed: 5,
      lastActiveDate: '2026-10-06',
      createdAt: '2026-09-01',
      updatedAt: '2026-10-06',
    };

    const res = aiService.generateInterviewAnswer('Tell me about yourself', mockProfile);
    expect(res.simple).toContain('Arun Kumar');
    expect(res.natural).toContain('CIT Coimbatore');
    expect(res.professional).toContain('Cloud Engineer');
  });
});
