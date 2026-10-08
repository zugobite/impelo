import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import test from 'node:test'
import { canonicalUrl, getPageSeo, injectPublicSeo, PAGE_SEO, SITE_URL, SITEMAP_ROUTES } from '../server/seo/public-seo.mjs'
import { SOCIAL_IMAGES } from '../server/seo/social-images.mjs'

test('all public routes have unique page-specific social images and metadata', async () => {
  const files = (await readdir(new URL('../server/assets/prototype/', import.meta.url))).filter(file => file.endsWith('.html')).sort()
  assert.deepEqual(Object.values(SOCIAL_IMAGES).map(image => image.file).sort(), files)
  assert.deepEqual(Object.keys(SOCIAL_IMAGES).sort(), Object.keys(PAGE_SEO).sort())
  assert.equal(new Set(Object.values(SOCIAL_IMAGES).map(image => image.slug)).size, files.length)
  for (const field of ['title', 'description']) {
    assert.equal(new Set(Object.values(PAGE_SEO).map(seo => seo[field])).size, files.length)
  }
  for (const [route, image] of Object.entries(SOCIAL_IMAGES)) {
    const source = await readFile(new URL(`../server/assets/prototype/${image.file}`, import.meta.url), 'utf8')
    const html = injectPublicSeo(source, route)
    const head = html.split('</head>')[0]
    for (const pattern of [/<title>/g, /name="description"/g, /rel="canonical"/g, /property="og:image"/g, /name="twitter:image"/g]) {
      assert.equal((head.match(pattern) || []).length, 1, `${route}: ${pattern}`)
    }
    assert.ok(head.includes(`href="${canonicalUrl(route)}"`))
    assert.ok(head.includes(`content="${SITE_URL}/assets/seo/${image.slug}.jpg"`))
    assert.ok(head.includes('property="og:image:width" content="1200"'))
    assert.ok(head.includes('property="og:image:height" content="630"'))
    assert.ok(head.includes('property="og:image:alt"'))
    assert.ok(head.includes('name="twitter:image:alt"'))
    assert.ok(head.includes('favicon-32x32.png'))
    assert.ok(head.includes('hreflang="en-ZA"'))
    assert.equal(html.slice(html.indexOf('</head>')), source.slice(source.indexOf('</head>')), 'SEO must not alter the body')
    assert.equal(injectPublicSeo(html, route), html, 'SEO injection is idempotent')
    const schema = JSON.parse(head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
    const page = schema['@graph'].find(item => item['@type'] === 'WebPage')
    assert.equal(page.url, canonicalUrl(route))
    assert.equal(page.primaryImageOfPage.contentUrl, `${SITE_URL}/assets/seo/${image.slug}.jpg`)
    assert.equal(page.primaryImageOfPage.width, 1200)
    assert.equal(page.primaryImageOfPage.height, 630)
  }
})

test('canonicals normalize slashes and corporate placeholders stay out of the sitemap', () => {
  assert.equal(canonicalUrl('/pricing///'), `${SITE_URL}/pricing/`)
  assert.equal(canonicalUrl('/'), `${SITE_URL}/`)
  for (const [route, image] of Object.entries(SOCIAL_IMAGES)) {
    assert.equal(SITEMAP_ROUTES.includes(route === '/' ? '/' : `${route}/`), image.indexable)
    assert.ok(getPageSeo(route).robots.includes(image.indexable ? 'index, follow' : 'noindex, follow'))
  }
})

function jpegDimensions(bytes) {
  assert.equal(bytes.readUInt16BE(0), 0xffd8)
  let offset = 2
  while (offset < bytes.length) {
    assert.equal(bytes[offset], 0xff)
    const marker = bytes[offset + 1]
    const length = bytes.readUInt16BE(offset + 2)
    if ([0xc0, 0xc1, 0xc2].includes(marker)) return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) }
    offset += length + 2
  }
  throw new Error('JPEG dimensions not found')
}

test('all social images exist as optimized 1200 × 630 JPEGs', async () => {
  for (const image of Object.values(SOCIAL_IMAGES)) {
    const bytes = await readFile(new URL(`../public/assets/seo/${image.slug}.jpg`, import.meta.url))
    assert.deepEqual(jpegDimensions(bytes), { width: 1200, height: 630 }, image.slug)
    assert.ok(bytes.length < 500_000, `${image.slug}: keep social previews under 500KB`)
  }
})

test('every social preview has a text-free PNG master and recorded edit prompt', async () => {
  const manifest = JSON.parse(await readFile(new URL('../public/assets/seo/prompts.json', import.meta.url), 'utf8'))
  assert.equal(manifest.textPolicy, 'none')
  assert.equal(manifest.wordmarkPolicy, 'none')
  assert.deepEqual(manifest.assets.map(asset => asset.slug).sort(), Object.values(SOCIAL_IMAGES).map(image => image.slug).sort())
  for (const asset of manifest.assets) {
    const bytes = await readFile(new URL(`../${asset.master}`, import.meta.url))
    assert.equal(bytes.subarray(1, 4).toString(), 'PNG')
    assert.ok(bytes.readUInt32BE(16) >= 1200)
    assert.ok(bytes.readUInt32BE(20) >= 630)
    assert.ok(manifest.prompts[asset.promptId])
  }
})
