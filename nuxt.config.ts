export default defineNuxtConfig({
  compatibilityDate: '2026-10-08',
  devtools: { enabled: true },
  ssr: true,
  nitro: {
    compressPublicAssets: true,
  },
  routeRules: {
    '/**': { headers: { 'x-content-type-options': 'nosniff' } },
  },
  typescript: {
    typeCheck: true,
  },
})
