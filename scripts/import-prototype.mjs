import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const source = process.argv[2]

if (!source) {
  throw new Error('Usage: node scripts/import-prototype.mjs /path/to/impelo-guide/dist')
}

const project = process.cwd()
const publicDir = join(project, 'public')
const pageDir = join(project, 'server/assets/prototype')

await mkdir(publicDir, { recursive: true })
await mkdir(pageDir, { recursive: true })

const publicEntries = [
  'assets',
  'fonts',
  'brand-refinement.css',
  'expanded-brand.css',
  'experience-polish.css',
  'platform-parity.css',
  'pricing-plans.css',
  'public-expansion.js',
  'public-locales.json',
  'public-mockups.js',
  'public-polish.css',
  'public.css',
  'public.js',
  'refinement.css',
  'story-polish.css',
  'clinic-demo.json',
  'headquarters-maps.json',
  'delivery.html',
  'flows.html',
  'inclusion.html',
  'strategy.html',
]

for (const entry of publicEntries) {
  await cp(join(source, entry), join(publicDir, entry), { recursive: true, force: true })
}

const rewrite = (html) => html
  .replaceAll('/public-website/', '/')
  .replaceAll('/public-website#', '/#')
  .replaceAll('/public-website"', '/"')

const pageSources = {
  'home.html': 'public-website/index.html',
  'how-it-works.html': 'public-website/how-it-works/index.html',
  'about-impelo.html': 'public-website/about-impelo/index.html',
  'pricing.html': 'public-website/pricing/index.html',
  'contact.html': 'public-website/contact/index.html',
  'legal.html': 'public-website/legal/index.html',
  'privacy.html': 'public-website/privacy/index.html',
  'cookies.html': 'public-website/cookies/index.html',
  'terms.html': 'public-website/terms/index.html',
  'information-access.html': 'public-website/information-access/index.html',
}

for (const [target, input] of Object.entries(pageSources)) {
  const html = await readFile(join(source, input), 'utf8')
  await writeFile(join(pageDir, target), rewrite(html))
}

for (const document of ['public-website-plan.html', 'delivery.html', 'flows.html', 'inclusion.html', 'strategy.html']) {
  const html = await readFile(join(source, document), 'utf8')
  await writeFile(join(publicDir, document), rewrite(html))
}

console.log(`Imported ${Object.keys(pageSources).length} website routes from ${source}`)
