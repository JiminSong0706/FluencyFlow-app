/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Strategy {
  id: string;
  name: string;
  description: string;
  koreanName: string;
  starters: string[];
  whenToUse: string;
  koreanWhenToUse: string;
  examples: { english: string; korean: string }[];
}

export interface Scenario {
  id: string;
  title: string;
  koreanTitle: string;
  description: string;
  strategyId: string;
  icon: string;
  imageUrl?: string;
  characterName: string;
  characterRole: string;
  characterImageUrl: string;
  tags?: string[];
  openingLines: {
    Beginner: string;
    Intermediate: string;
    Advanced: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
  strategyUsed?: string[];
  isIntervention?: boolean;
}

export type UserRole = 'student' | 'teacher';

export type Stage = 'Lobby' | 'LevelSelect' | 'VoiceSettings' | 'Dashboard' | 'AdminDashboard' | 'StrategyIntro' | 'StrategyLearning' | 'StrategyGame' | 'Stage1' | 'Stage2' | 'FreeSpeaking' | 'Results' | 'History' | 'Tree';

export interface SessionResult {
  id: string;
  timestamp: number;
  turns: number;
  strategiesUsed: string[];
  pauseTime?: number;
  translanguagingCount?: number;
  audioUrl?: string;
  overview: {
    title: string;
    summary: string;
    scores: {
      flow: number;
      strategyUse: number;
      recovery: number;
    };
    comment: string;
  };
  strategyPerformance: {
    targetStrategy: string;
    usedCount: number;
    successfulCount: number;
    missedChances: number;
    qualityAnalysis: string;
  };
  moments: {
    type: 'breakdown' | 'recovery';
    timestamp: string;
    situation: string;
    analysis: string;
    suggestion: string;
  }[];
  alternatives: {
    original: string;
    better: string;
    reason: string;
  }[];
  nextGoals: string[];
  transcript: Message[];
  scenarioTitle: string;
  level: Level;
}
