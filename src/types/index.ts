export type PostCategory = 'listing' | 'educational' | 'branding' | 'engagement';

export type Platform = 'instagram' | 'facebook' | 'linkedin' | 'tiktok';

export type PostingCadence = '3x-mwf' | '3x-tts' | '4x' | '5x';

export interface PostTemplate {
  id: string;
  category: PostCategory;
  caption: string;
  suggestedImageType: string;
  tone: string;
  platforms: Platform[];
}

export interface CalendarPost {
  id: string;
  date: string; // YYYY-MM-DD
  templateId: string;
  category: PostCategory;
  caption: string;
  platforms: Platform[];
  suggestedImageType: string;
  bestTimeToPost: string;
  notes: string;
  hashtags: string[];
}

export interface AgentProfile {
  name: string;
  brokerage: string;
  city: string;
  market: string;
  postingCadence: PostingCadence;
  platforms: Platform[];
  brandColors: {
    primary: string;
    accent: string;
  };
  profilePhoto: string | null;
  customHashtags: string[][];
  onboardingComplete: boolean;
}

export interface CalendarState {
  currentMonth: number; // 0-11
  currentYear: number;
  posts: CalendarPost[];
}

export interface AppState {
  profile: AgentProfile;
  calendar: CalendarState;
}

export const DEFAULT_PROFILE: AgentProfile = {
  name: '',
  brokerage: '',
  city: '',
  market: '',
  postingCadence: '3x-mwf',
  platforms: ['instagram', 'facebook'],
  brandColors: {
    primary: '#6366f1',
    accent: '#8b5cf6',
  },
  profilePhoto: null,
  customHashtags: [],
  onboardingComplete: false,
};

export const CATEGORY_COLORS: Record<PostCategory, string> = {
  listing: '#22c55e',
  educational: '#3b82f6',
  branding: '#f59e0b',
  engagement: '#a855f7',
};

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  listing: 'Listing',
  educational: 'Educational',
  branding: 'Personal Branding',
  engagement: 'Engagement',
};

export const CATEGORY_EMOJIS: Record<PostCategory, string> = {
  listing: '🟢',
  educational: '🔵',
  branding: '🟡',
  engagement: '🟣',
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
};
