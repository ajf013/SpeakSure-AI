import React from 'react';
import { DailyAssessment } from '../types';
import { ThirtyDayPlanView } from '../components/plan/ThirtyDayPlanView';

interface PracticePageProps {
  onOpenAssessment: (assessment: DailyAssessment) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({ onOpenAssessment }) => {
  return <ThirtyDayPlanView onOpenAssessment={onOpenAssessment} />;
};

