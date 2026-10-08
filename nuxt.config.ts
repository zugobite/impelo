export default defineNuxtConfig({
  compatibilityDate: '2026-10-08',
  devtools: { enabled: true },
  ssr: true,
  runtimeConfig: {
    public: {
      siteUrl: 'https://impelo.org.za',
    },
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/how-it-works',
        '/about-impelo',
        '/pricing',
        '/contact',
        '/download',
        '/help-centre',
        '/careers',
        '/partners',
        '/newsroom',
        '/legal',
        '/privacy',
        '/terms',
        '/cookies',
        '/information-access',
      ],
    },
  },
  routeRules: {
    '/**': { headers: { 'x-content-type-options': 'nosniff' } },
  },
  typescript: {
    typeCheck: true,
  },
})
