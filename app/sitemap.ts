import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const SITE = 'https://boredmaster.com';
  const today = new Date().toISOString().split('T')[0];
  
  const pages = [
    '',
    'games/connect4/',
    'games/tictactoe/',
    'games/soap-carver/',
    'games/lawn-mower/',
    'games/bubble-pop/',
    'activities/home/',
    'activities/school/',
    'activities/work/',
    'activities/night/',
    'activities/friends/',
    'boredom-activity-finder/'
  ];

  return pages.map(slug => ({
    url: `${SITE}/${slug}`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: slug === '' ? 1.0 : 0.8,
  }));
}
