const routeFiles: Record<string, string> = {
  '/': 'home.html',
  '/how-it-works': 'how-it-works.html',
  '/about-impelo': 'about-impelo.html',
  '/pricing': 'pricing.html',
  '/contact': 'contact.html',
  '/legal': 'legal.html',
  '/privacy': 'privacy.html',
  '/cookies': 'cookies.html',
  '/terms': 'terms.html',
  '/information-access': 'information-access.html',
  '/careers': 'careers.html',
  '/partners': 'partners.html',
  '/newsroom': 'newsroom.html',
  '/help-centre': 'help-centre.html',
}

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  const filename = routeFiles[normalized]

  if (!filename) return

  const html = await useStorage('assets:server').getItem<string>(`prototype/${filename}`)

  if (!html) {
    throw createError({ statusCode: 500, statusMessage: `Missing prototype page: ${filename}` })
  }

  setHeader(event, 'content-type', 'text/html; charset=utf-8')
  return html
})
