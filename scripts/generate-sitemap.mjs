import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { SITE_URL, SITEMAP_ROUTES } from '../server/seo/public-seo.mjs'

const outDir = process.env.SEO_OUTPUT_DIR || join(process.cwd(), '.output/public')
const lastmod = new Date().toISOString().slice(0, 10)

const urls = SITEMAP_ROUTES.map((path) => {
  const loc = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
  const priority = path === '/' ? '1.0' : path === '/pricing/' || path === '/how-it-works/' ? '0.9' : '0.7'
  const changefreq = path === '/newsroom/' ? 'weekly' : 'monthly'
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

await writeFile(join(outDir, 'sitemap.xml'), xml, 'utf8')
console.log(`Wrote sitemap.xml (${SITEMAP_ROUTES.length} URLs) to ${outDir}`)
