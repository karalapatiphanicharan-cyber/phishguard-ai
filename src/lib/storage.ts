import type { URLAnalysisResponse, EmailAnalysisResponse } from '../types';

export type HistoryEntry = {
  id: string;
  timestamp: number;
  type: 'url' | 'email';
  data: URLAnalysisResponse | EmailAnalysisResponse;
};

const STORAGE_KEY = 'phishguard_history';
const MAX_HISTORY = 50;

export const saveToHistory = (type: 'url' | 'email', data: URLAnalysisResponse | EmailAnalysisResponse) => {
  try {
    const history = getHistory();
    const newEntry: HistoryEntry = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
      type,
      data,
    };

    const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error('Failed to save to history:', e);
  }
};

export const getHistory = (): HistoryEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse history:', e);
    return [];
  }
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
};
