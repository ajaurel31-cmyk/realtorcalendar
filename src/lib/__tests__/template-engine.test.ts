import { describe, it, expect } from 'vitest';
import { fillTemplate, getHashtagsForPost, getBestTimeToPost } from '../template-engine';
import { AgentProfile, DEFAULT_PROFILE } from '@/types';

const testProfile: AgentProfile = {
  ...DEFAULT_PROFILE,
  name: 'Jane Smith',
  brokerage: 'Acme Realty',
  city: 'Austin',
  market: 'Central Texas',
  onboardingComplete: true,
  customHashtags: [['#AcmeRealty', '#JaneSmithHomes']],
};

describe('fillTemplate', () => {
  it('replaces [Name] with profile name', () => {
    const result = fillTemplate('Hi, I am [Name]!', testProfile);
    expect(result).toBe('Hi, I am Jane Smith!');
  });

  it('replaces [Brokerage] with profile brokerage', () => {
    const result = fillTemplate('Working at [Brokerage]', testProfile);
    expect(result).toBe('Working at Acme Realty');
  });

  it('replaces [City] and [Market]', () => {
    const result = fillTemplate('Homes in [City], [Market]', testProfile);
    expect(result).toBe('Homes in Austin, Central Texas');
  });

  it('handles multiple placeholders in one string', () => {
    const result = fillTemplate('[Name] at [Brokerage] in [City]', testProfile);
    expect(result).toBe('Jane Smith at Acme Realty in Austin');
  });

  it('uses fallback values for empty profile fields', () => {
    const emptyProfile = { ...DEFAULT_PROFILE };
    const result = fillTemplate('[Name] at [Brokerage]', emptyProfile);
    expect(result).toBe('Your Name at Your Brokerage');
  });

  it('returns original string when no placeholders present', () => {
    const result = fillTemplate('No placeholders here', testProfile);
    expect(result).toBe('No placeholders here');
  });
});

describe('getHashtagsForPost', () => {
  it('returns hashtags for instagram listing posts', () => {
    const tags = getHashtagsForPost('listing', ['instagram'], testProfile);
    expect(tags.length).toBeGreaterThan(0);
    expect(tags.some((t) => t.includes('RealEstate'))).toBe(true);
  });

  it('includes city-based hashtags when city is set', () => {
    const tags = getHashtagsForPost('listing', ['instagram'], testProfile);
    expect(tags).toContain('#AustinRealEstate');
    expect(tags).toContain('#AustinHomes');
  });

  it('includes custom hashtags from profile', () => {
    const tags = getHashtagsForPost('listing', ['instagram'], testProfile);
    expect(tags).toContain('#AcmeRealty');
    expect(tags).toContain('#JaneSmithHomes');
  });

  it('returns unique tags (no duplicates)', () => {
    const tags = getHashtagsForPost('listing', ['instagram'], testProfile);
    const unique = new Set(tags);
    expect(unique.size).toBe(tags.length);
  });

  it('handles unknown platform gracefully', () => {
    const tags = getHashtagsForPost('listing', ['instagram'], {
      ...testProfile,
      city: '',
      customHashtags: [],
    });
    expect(Array.isArray(tags)).toBe(true);
  });
});

describe('getBestTimeToPost', () => {
  it('returns a valid time string for instagram', () => {
    const time = getBestTimeToPost('instagram');
    expect(time).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
  });

  it('returns a valid time string for facebook', () => {
    const time = getBestTimeToPost('facebook');
    expect(time).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
  });

  it('returns a valid time string for linkedin', () => {
    const time = getBestTimeToPost('linkedin');
    expect(time).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
  });

  it('returns a valid time string for tiktok', () => {
    const time = getBestTimeToPost('tiktok');
    expect(time).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
  });
});
