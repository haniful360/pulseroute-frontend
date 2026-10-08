import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pulseroute.com';
  const lastModified = new Date();

  const routes: { path: string; priority: number; changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' }[] = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/how-it-works', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/safety', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/join-driver', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/login', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/register', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/register/driver', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/refund', priority: 0.5, changeFrequency: 'yearly' },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
