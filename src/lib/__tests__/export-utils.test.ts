import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalendarPost, AgentProfile, DEFAULT_PROFILE } from '@/types';

// Mock the DOM download mechanism before importing
const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = vi.fn();
const mockClick = vi.fn();

Object.defineProperty(globalThis, 'URL', {
  value: {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  },
  writable: true,
});

// Mock document.createElement for anchor tags
const mockAnchor = {
  href: '',
  download: '',
  click: mockClick,
};

vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
  if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
  return document.createElement(tag);
});
vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);

import { exportToCSV, exportToICS } from '../export-utils';

const testProfile: AgentProfile = {
  ...DEFAULT_PROFILE,
  name: 'Jane Smith',
  brokerage: 'Acme Realty',
  city: 'Austin',
  onboardingComplete: true,
};

const testPosts: CalendarPost[] = [
  {
    id: 'post-1',
    date: '2026-01-05',
    templateId: 'tmpl-1',
    category: 'listing',
    caption: 'Check out this amazing home!',
    platforms: ['instagram', 'facebook'],
    suggestedImageType: 'Photo of front exterior',
    bestTimeToPost: '11:00 AM',
    notes: 'Remember to add address',
    hashtags: ['#JustListed', '#RealEstate'],
  },
  {
    id: 'post-2',
    date: '2026-01-07',
    templateId: 'tmpl-2',
    category: 'educational',
    caption: 'Top 5 tips for first-time buyers',
    platforms: ['linkedin'],
    suggestedImageType: 'Infographic',
    bestTimeToPost: '7:30 AM',
    notes: '',
    hashtags: ['#HomeBuyerTips'],
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockAnchor.href = '';
  mockAnchor.download = '';
});

describe('exportToCSV', () => {
  it('creates a downloadable CSV file', () => {
    exportToCSV(testPosts, testProfile);

    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob;
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.type).toBe('text/csv');
  });

  it('sets the correct filename', () => {
    exportToCSV(testPosts, testProfile);
    expect(mockAnchor.download).toBe('content-calendar-Jane Smith.csv');
  });

  it('triggers a download click', () => {
    exportToCSV(testPosts, testProfile);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('cleans up the object URL after download', () => {
    exportToCSV(testPosts, testProfile);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});

describe('exportToICS', () => {
  it('creates a downloadable ICS file', () => {
    exportToICS(testPosts, testProfile);

    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob;
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.type).toBe('text/calendar');
  });

  it('sets the correct filename', () => {
    exportToICS(testPosts, testProfile);
    expect(mockAnchor.download).toBe('content-calendar-Jane Smith.ics');
  });

  it('triggers a download click', () => {
    exportToICS(testPosts, testProfile);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
