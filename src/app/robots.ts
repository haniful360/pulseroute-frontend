import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pulseroute.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/super-admin/', '/reset-password', '/verify-otp', '/otp'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
