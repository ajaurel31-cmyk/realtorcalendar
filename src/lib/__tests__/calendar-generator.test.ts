import { describe, it, expect, beforeAll } from 'vitest';
import { generateMonth, loadTemplates, getAllTemplates, getTemplateById, regeneratePost } from '../calendar-generator';
import { AgentProfile, DEFAULT_PROFILE } from '@/types';

const testProfile: AgentProfile = {
  ...DEFAULT_PROFILE,
  name: 'Jane Smith',
  brokerage: 'Acme Realty',
  city: 'Austin',
  market: 'Central Texas',
  postingCadence: '3x-mwf',
  platforms: ['instagram', 'facebook'],
  onboardingComplete: true,
};

beforeAll(async () => {
  await loadTemplates();
});

describe('loadTemplates / getAllTemplates', () => {
  it('loads all template categories', () => {
    const all = getAllTemplates();
    expect(all.length).toBeGreaterThan(0);
  });

  it('templates have required fields', () => {
    const all = getAllTemplates();
    for (const t of all.slice(0, 10)) {
      expect(t.id).toBeTruthy();
      expect(t.category).toBeTruthy();
      expect(t.caption).toBeTruthy();
      expect(t.platforms.length).toBeGreaterThan(0);
    }
  });
});

describe('getTemplateById', () => {
  it('returns a template when given a valid id', () => {
    const all = getAllTemplates();
    const first = all[0];
    const found = getTemplateById(first.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(first.id);
  });

  it('returns undefined for unknown id', () => {
    expect(getTemplateById('nonexistent-id')).toBeUndefined();
  });
});

describe('generateMonth', () => {
  it('generates posts for a month with 3x-mwf cadence', () => {
    const posts = generateMonth(2026, 0, testProfile); // January 2026
    expect(posts.length).toBeGreaterThan(0);
    // MWF = 3 days/week, January 2026 has ~13 MWF days
    expect(posts.length).toBeGreaterThanOrEqual(10);
    expect(posts.length).toBeLessThanOrEqual(15);
  });

  it('generates posts for 5x cadence', () => {
    const fiveXProfile = { ...testProfile, postingCadence: '5x' as const };
    const posts = generateMonth(2026, 0, fiveXProfile);
    // 5x = Mon-Fri, ~22 weekdays in January 2026
    expect(posts.length).toBeGreaterThanOrEqual(20);
  });

  it('assigns dates within the correct month', () => {
    const posts = generateMonth(2026, 1, testProfile); // February 2026
    for (const post of posts) {
      expect(post.date).toMatch(/^2026-02-\d{2}$/);
      const day = parseInt(post.date.split('-')[2]);
      expect(day).toBeGreaterThanOrEqual(1);
      expect(day).toBeLessThanOrEqual(28);
    }
  });

  it('includes all four categories in the mix', () => {
    // With enough posts, all categories should be present
    const fiveXProfile = { ...testProfile, postingCadence: '5x' as const };
    const posts = generateMonth(2026, 0, fiveXProfile);
    const categories = new Set(posts.map((p) => p.category));
    expect(categories.has('listing')).toBe(true);
    expect(categories.has('educational')).toBe(true);
    expect(categories.has('branding')).toBe(true);
    expect(categories.has('engagement')).toBe(true);
  });

  it('produces posts with all required fields', () => {
    const posts = generateMonth(2026, 0, testProfile);
    for (const post of posts) {
      expect(post.id).toBeTruthy();
      expect(post.date).toBeTruthy();
      expect(post.templateId).toBeTruthy();
      expect(post.category).toBeTruthy();
      expect(post.caption).toBeTruthy();
      expect(post.platforms.length).toBeGreaterThan(0);
      expect(post.suggestedImageType).toBeTruthy();
      expect(post.bestTimeToPost).toBeTruthy();
      expect(post.hashtags.length).toBeGreaterThan(0);
    }
  });

  it('fills template placeholders in captions', () => {
    const posts = generateMonth(2026, 0, testProfile);
    for (const post of posts) {
      expect(post.caption).not.toContain('[Name]');
      expect(post.caption).not.toContain('[Brokerage]');
      expect(post.caption).not.toContain('[City]');
    }
  });
});

describe('regeneratePost', () => {
  it('returns a post with a different template', () => {
    const posts = generateMonth(2026, 0, testProfile);
    const original = posts[0];
    // Try a few times since it's random
    let gotDifferent = false;
    for (let i = 0; i < 10; i++) {
      const regenerated = regeneratePost(original, testProfile);
      if (regenerated.templateId !== original.templateId) {
        gotDifferent = true;
        break;
      }
    }
    expect(gotDifferent).toBe(true);
  });

  it('preserves the same date and category', () => {
    const posts = generateMonth(2026, 0, testProfile);
    const original = posts[0];
    const regenerated = regeneratePost(original, testProfile);
    expect(regenerated.date).toBe(original.date);
    expect(regenerated.category).toBe(original.category);
    expect(regenerated.id).toBe(original.id);
  });
});
