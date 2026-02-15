import { AgentProfile, Platform } from '@/types';
import hashtagData from '@/data/hashtags.json';

type HashtagMap = Record<string, Record<string, string[]>>;

const hashtagsByPlatform = hashtagData as HashtagMap;

export function fillTemplate(template: string, profile: AgentProfile): string {
  const now = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  let result = template;

  const replacements: Record<string, string> = {
    '[Name]': profile.name || 'Your Name',
    '[Brokerage]': profile.brokerage || 'Your Brokerage',
    '[City]': profile.city || 'Your City',
    '[Market]': profile.market || profile.city || 'Your Market',
    '[Month]': monthNames[now.getMonth()],
    '[Year]': now.getFullYear().toString(),
    '[Address]': '123 Main Street',
    '[Neighborhood]': 'Downtown',
    '[Price]': '450,000',
    '[Beds]': '3',
    '[Baths]': '2',
    '[SqFt]': '1,850',
    '[Day]': 'Saturday',
    '[Time]': '1:00 PM - 4:00 PM',
    '[Amount]': '15,000',
    '[Features]': 'updated kitchen, hardwood floors, spacious backyard',
    '[Percentage]': '5.2',
    '[Number]': '10',
    '[First name]': 'Sarah',
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.split(placeholder).join(value);
  }

  return result;
}

export function getHashtagsForPost(
  category: string,
  platforms: Platform[],
  profile: AgentProfile
): string[] {
  const tags = new Set<string>();
  const platform = platforms[0] || 'instagram';
  const platformTags = hashtagsByPlatform[platform];

  if (platformTags) {
    const generalTags = platformTags['general'] || [];
    generalTags.slice(0, 5).forEach((t) => tags.add(t));

    let categoryKey = 'general';
    if (category === 'listing') categoryKey = 'listing';
    else if (category === 'educational') categoryKey = 'tips';
    else if (category === 'branding') categoryKey = 'general';
    else if (category === 'engagement') categoryKey = 'general';

    const catTags = platformTags[categoryKey] || [];
    catTags.slice(0, 5).forEach((t) => tags.add(t));
  }

  if (profile.city) {
    tags.add(`#${profile.city.replace(/\s+/g, '')}RealEstate`);
    tags.add(`#${profile.city.replace(/\s+/g, '')}Homes`);
  }

  profile.customHashtags.forEach((group) => {
    group.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags);
}

export function getBestTimeToPost(platform: Platform): string {
  const times: Record<Platform, string[]> = {
    instagram: ['11:00 AM', '2:00 PM', '7:00 PM'],
    facebook: ['9:00 AM', '1:00 PM', '4:00 PM'],
    linkedin: ['7:30 AM', '12:00 PM', '5:00 PM'],
    tiktok: ['10:00 AM', '2:00 PM', '8:00 PM'],
  };

  const platformTimes = times[platform] || times.instagram;
  return platformTimes[Math.floor(Math.random() * platformTimes.length)];
}
