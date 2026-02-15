import { AgentProfile, CalendarState, DEFAULT_PROFILE } from '@/types';

const STORAGE_KEYS = {
  PROFILE: 'rc_agent_profile',
  CALENDAR: 'rc_calendar_state',
} as const;

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn('Failed to save to localStorage');
  }
}

export function getProfile(): AgentProfile {
  return getItem(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
}

export function saveProfile(profile: AgentProfile): void {
  setItem(STORAGE_KEYS.PROFILE, profile);
}

export function getCalendarState(): CalendarState | null {
  return getItem<CalendarState | null>(STORAGE_KEYS.CALENDAR, null);
}

export function saveCalendarState(state: CalendarState): void {
  setItem(STORAGE_KEYS.CALENDAR, state);
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
