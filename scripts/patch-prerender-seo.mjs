import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { injectPublicSeo, PAGE_SEO, normalizePublicPath } from '../server/seo/public-seo.mjs'

const outDir = process.env.SEO_OUTPUT_DIR || join(process.cwd(), '.output/public')

/** @type {Record<string, string>} */
const pathToFile = {
  '/': join(outDir, 'index.html'),
}

for (const route of Object.keys(PAGE_SEO)) {
  if (route === '/') continue
  pathToFile[route] = join(outDir, route.slice(1), 'index.html')
}

for (const [route, file] of Object.entries(pathToFile)) {
  try {
    const html = await readFile(file, 'utf8')
    const patched = injectPublicSeo(html, normalizePublicPath(route))
    if (patched !== html) {
      await writeFile(file, patched, 'utf8')
      console.log(`Patched SEO: ${route}`)
    }
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'ENOENT') {
      console.warn(`Skip missing prerender file for ${route}`)
      continue
    }
    throw err
  }
}

for (const stub of ['login', 'register']) {
  const file = join(outDir, stub, 'index.html')
  try {
    let html = await readFile(file, 'utf8')
    if (!html.includes('name="robots"')) {
      html = html.replace(
        '</head>',
        '<meta name="robots" content="noindex, nofollow">\n<link rel="canonical" href="https://portal.impelo.org.za/">\n</head>',
      )
      await writeFile(file, html, 'utf8')
      console.log(`Patched noindex: /${stub}/`)
    }
  } catch {
    /* stub may not exist */
  }
}
