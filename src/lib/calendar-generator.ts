import {
  PostCategory,
  PostTemplate,
  CalendarPost,
  AgentProfile,
  PostingCadence,
} from '@/types';
import { fillTemplate, getHashtagsForPost, getBestTimeToPost } from './template-engine';

let listingTemplates: PostTemplate[] = [];
let educationalTemplates: PostTemplate[] = [];
let brandingTemplates: PostTemplate[] = [];
let engagementTemplates: PostTemplate[] = [];
let templatesLoaded = false;

export async function loadTemplates(): Promise<void> {
  if (templatesLoaded) return;
  try {
    const [listings, educational, branding, engagement] = await Promise.all([
      import('@/data/templates/listings.json').then((m) => m.default),
      import('@/data/templates/educational.json').then((m) => m.default),
      import('@/data/templates/branding.json').then((m) => m.default),
      import('@/data/templates/engagement.json').then((m) => m.default),
    ]);
    listingTemplates = listings as PostTemplate[];
    educationalTemplates = educational as PostTemplate[];
    brandingTemplates = branding as PostTemplate[];
    engagementTemplates = engagement as PostTemplate[];
    templatesLoaded = true;
  } catch (e) {
    console.error('Failed to load templates', e);
  }
}

function getTemplatesByCategory(category: PostCategory): PostTemplate[] {
  switch (category) {
    case 'listing':
      return listingTemplates;
    case 'educational':
      return educationalTemplates;
    case 'branding':
      return brandingTemplates;
    case 'engagement':
      return engagementTemplates;
  }
}

export function getAllTemplates(): PostTemplate[] {
  return [
    ...listingTemplates,
    ...educationalTemplates,
    ...brandingTemplates,
    ...engagementTemplates,
  ];
}

export function getTemplateById(id: string): PostTemplate | undefined {
  return getAllTemplates().find((t) => t.id === id);
}

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getPostingDays(year: number, month: number, cadence: PostingCadence): number[] {
  const days: number[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = new Date(year, month, d).getDay();
    let shouldPost = false;

    switch (cadence) {
      case '3x-mwf':
        shouldPost = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
        break;
      case '3x-tts':
        shouldPost = dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6;
        break;
      case '4x':
        shouldPost = dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6;
        break;
      case '5x':
        shouldPost = dayOfWeek >= 1 && dayOfWeek <= 5;
        break;
    }

    if (shouldPost) {
      days.push(d);
    }
  }

  return days;
}

function distributeCategories(count: number): PostCategory[] {
  const distribution: PostCategory[] = [];
  const listingCount = Math.round(count * 0.3);
  const eduCount = Math.round(count * 0.3);
  const brandCount = Math.round(count * 0.2);
  const engageCount = count - listingCount - eduCount - brandCount;

  for (let i = 0; i < listingCount; i++) distribution.push('listing');
  for (let i = 0; i < eduCount; i++) distribution.push('educational');
  for (let i = 0; i < brandCount; i++) distribution.push('branding');
  for (let i = 0; i < engageCount; i++) distribution.push('engagement');

  return shuffle(distribution);
}

export function generateMonth(
  year: number,
  month: number,
  profile: AgentProfile
): CalendarPost[] {
  const postingDays = getPostingDays(year, month, profile.postingCadence);
  const categories = distributeCategories(postingDays.length);

  const usedTemplateIds = new Set<string>();
  const posts: CalendarPost[] = [];

  for (let i = 0; i < postingDays.length; i++) {
    const day = postingDays[i];
    const category = categories[i];
    const templates = getTemplatesByCategory(category);
    const available = templates.filter((t) => !usedTemplateIds.has(t.id));
    const pool = available.length > 0 ? available : templates;
    const template = shuffle(pool)[0];

    if (!template) continue;

    usedTemplateIds.add(template.id);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const platforms = profile.platforms.length > 0 ? profile.platforms : template.platforms;
    const mainPlatform = platforms[0] || 'instagram';

    posts.push({
      id: `post-${dateStr}-${Math.random().toString(36).slice(2, 8)}`,
      date: dateStr,
      templateId: template.id,
      category,
      caption: fillTemplate(template.caption, profile),
      platforms,
      suggestedImageType: template.suggestedImageType,
      bestTimeToPost: getBestTimeToPost(mainPlatform),
      notes: '',
      hashtags: getHashtagsForPost(category, platforms, profile),
    });
  }

  return posts;
}

export function regeneratePost(
  currentPost: CalendarPost,
  profile: AgentProfile
): CalendarPost {
  const templates = getTemplatesByCategory(currentPost.category);
  const otherTemplates = templates.filter((t) => t.id !== currentPost.templateId);
  const pool = otherTemplates.length > 0 ? otherTemplates : templates;
  const template = shuffle(pool)[0];

  if (!template) return currentPost;

  const platforms = profile.platforms.length > 0 ? profile.platforms : template.platforms;
  const mainPlatform = platforms[0] || 'instagram';

  return {
    ...currentPost,
    templateId: template.id,
    caption: fillTemplate(template.caption, profile),
    platforms,
    suggestedImageType: template.suggestedImageType,
    bestTimeToPost: getBestTimeToPost(mainPlatform),
    hashtags: getHashtagsForPost(currentPost.category, platforms, profile),
  };
}
