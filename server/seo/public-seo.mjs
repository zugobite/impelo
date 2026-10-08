import { SOCIAL_IMAGES } from './social-images.mjs'

/** @typedef {{ title: string, description: string, ogType?: string, robots?: string, softwareApp?: boolean, breadcrumb?: string[], ogImage?: string, ogImageAlt?: string }} PageSeo */

export const SITE_URL = (process.env.NUXT_PUBLIC_SITE_URL || 'https://impelo.org.za').replace(/\/+$/, '')

export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/seo/home.jpg`

/** Routes included in sitemap.xml (trailing slash canonical on site). */
export const SITEMAP_ROUTES = [
  '/',
  '/how-it-works/',
  '/about-impelo/',
  '/pricing/',
  '/contact/',
  '/download/',
  '/legal/',
  '/privacy/',
  '/terms/',
  '/cookies/',
  '/information-access/',
]

/** @type {Record<string, PageSeo>} */
export const PAGE_SEO = {
  '/': {
    title: 'Impelo | Healthcare Queue & Practice Software for South Africa',
    description:
      'Impelo connects clinic queues, appointments, and patient visit information for South African practices. Explore the interactive prototype — not a live medical service.',
    ogType: 'website',
    softwareApp: true,
  },
  '/how-it-works': {
    title: 'How Impelo Works | Patient & Clinic Visit Demo',
    description:
      'See how Impelo could guide patients and clinic teams through queue visibility, appointments, permissions, and handoffs. South African healthtech demo.',
    softwareApp: true,
    breadcrumb: ['Home', 'How it works'],
  },
  '/about-impelo': {
    title: 'About Impelo | South African Healthtech Mission & Research',
    description:
      'Meet Impelo: research-led healthcare software rooted in South Africa, focused on clearer clinic visits, accessibility, and trustworthy information.',
    breadcrumb: ['Home', 'About Impelo'],
  },
  '/pricing': {
    title: 'Impelo Pricing | Plans for Clinics & Practices (South Africa)',
    description:
      'Compare proposed Impelo practice plans, staff and location limits, features, and support for healthcare teams in South Africa.',
    softwareApp: true,
    breadcrumb: ['Home', 'Pricing'],
  },
  '/contact': {
    title: 'Contact Impelo | Practice, Partnership & Media Enquiries',
    description:
      'Contact Impelo about clinic workflows, partnerships, accessibility, or media. Demo enquiry form on this prototype site.',
    breadcrumb: ['Home', 'Contact'],
  },
  '/download': {
    title: 'Download Impelo Apps | Android, iOS, Windows & macOS',
    description:
      'Planned Impelo apps for patients and clinic teams on Android, iOS, Windows, and macOS. Downloads coming soon.',
    softwareApp: true,
    breadcrumb: ['Home', 'Download apps'],
  },
  '/help-centre': {
    title: 'Impelo Help Centre | Support & Accessibility',
    description:
      'Future home for Impelo account help, clinic onboarding, accessibility support, and common questions.',
    breadcrumb: ['Home', 'Help centre'],
  },
  '/careers': {
    title: 'Careers at Impelo | Healthtech Jobs (Coming Soon)',
    description:
      'Future roles in product, engineering, design, and clinical operations at Impelo. Not recruiting through this demo site yet.',
    breadcrumb: ['Home', 'Careers'],
  },
  '/partners': {
    title: 'Impelo Partners | Practices, Community & Technology',
    description:
      'Partner with Impelo: healthcare practices, community organisations, accessibility specialists, and responsible technology partners.',
    breadcrumb: ['Home', 'Partners'],
  },
  '/newsroom': {
    title: 'Impelo Newsroom | Company & Product Updates',
    description:
      'Company news, product milestones, and media resources from Impelo. Updates published here as the platform launches.',
    breadcrumb: ['Home', 'Newsroom'],
  },
  '/legal': {
    title: 'Legal & Privacy Overview | Impelo',
    description:
      'Legal information hub for the Impelo public website, including links to privacy, terms, cookies, and information access.',
    robots: 'index, follow',
    breadcrumb: ['Home', 'Legal & privacy'],
  },
  '/privacy': {
    title: 'Privacy Notice | Impelo Public Website',
    description:
      'How the Impelo public website and prototype handle personal information, with POPIA-aware transparency for South African visitors.',
    breadcrumb: ['Home', 'Privacy notice'],
  },
  '/terms': {
    title: 'Website Terms | Impelo',
    description: 'Terms of use for the Impelo public website and interactive prototype experiences.',
    breadcrumb: ['Home', 'Website terms'],
  },
  '/cookies': {
    title: 'Cookies & Preferences | Impelo',
    description:
      'How Impelo uses cookies and browser preferences on the public website, and how to manage your choices.',
    breadcrumb: ['Home', 'Cookies & preferences'],
  },
  '/information-access': {
    title: 'Information Access | Impelo (POPIA & PAIA)',
    description:
      'How to request access to information held by Impelo, in line with South African POPIA and PAIA principles.',
    breadcrumb: ['Home', 'Information access'],
  },
}

/**
 * @param {string} pathname
 * @returns {string}
 */
export function normalizePublicPath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '') || '/'
}

/**
 * @param {string} pathname
 * @returns {PageSeo | undefined}
 */
export function getPageSeo(pathname) {
  const path = normalizePublicPath(pathname)
  const seo = PAGE_SEO[path]
  if (!seo) return undefined
  const image = SOCIAL_IMAGES[path]
  return {
    ...seo,
    robots: seo.robots || (image?.indexable === false ? 'noindex, follow' : 'index, follow, max-image-preview:large'),
    ogImage: image ? `${SITE_URL}/assets/seo/${image.slug}.jpg` : DEFAULT_OG_IMAGE,
    ogImageAlt: image?.alt || '',
  }
}

/**
 * @param {string} pathname
 * @returns {string}
 */
export function canonicalUrl(pathname) {
  const path = normalizePublicPath(pathname)
  if (path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path}/`
}

/**
 * @param {string} text
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * @param {unknown} data
 */
function jsonLdScript(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`
}

/**
 * @param {PageSeo} seo
 * @param {string} pathname
 */
function buildStructuredData(seo, pathname) {
  const url = canonicalUrl(pathname)
  const graph = []

  graph.push({
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Impelo',
    url: SITE_URL,
    logo: `${SITE_URL}/assets/mark.svg`,
    areaServed: {
      '@type': 'Country',
      name: 'South Africa',
    },
    description:
      'South African healthtech building clearer clinic visits through queue visibility, appointments, and patient information.',
  })

  graph.push({
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Impelo',
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-ZA',
  })

  graph.push({
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: seo.title,
    description: seo.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      contentUrl: seo.ogImage || DEFAULT_OG_IMAGE,
      width: 1200,
      height: 630,
      caption: seo.ogImageAlt || '',
    },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-ZA',
  })

  if (seo.softwareApp) {
    graph.push({
      '@type': 'SoftwareApplication',
      name: 'Impelo',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web, Android, iOS, Windows, macOS',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'ZAR',
        description: 'Patient access tier proposed; practice plans vary.',
      },
      description: seo.description,
      url: SITE_URL,
      areaServed: { '@type': 'Country', name: 'South Africa' },
      provider: { '@id': `${SITE_URL}/#organization` },
    })
  }

  if (seo.breadcrumb?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: seo.breadcrumb.map((name, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: index === 0 ? `${SITE_URL}/` : url,
      })),
    })
  }

  return jsonLdScript({
    '@context': 'https://schema.org',
    '@graph': graph,
  })
}

/**
 * @param {string} html
 * @param {string} pathname
 * @returns {string}
 */
export function injectPublicSeo(html, pathname) {
  const seo = getPageSeo(pathname)
  if (!seo) return html

  const url = canonicalUrl(pathname)
  const robots = seo.robots || 'index, follow'
  const ogType = seo.ogType || 'website'

  let out = html
    .replace(/<!-- impelo-seo-start -->[\s\S]*?<!-- impelo-seo-end -->\r?\n?/g, '')
    .replace(/<link rel="(?:icon|shortcut icon|apple-touch-icon)"[^>]*>\s*/gi, '')
    .replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*">/i,
      `<meta name="description" content="${escapeHtml(seo.description)}">`,
    )

  const block = `<!-- impelo-seo-start -->
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32">
<link rel="icon" href="/assets/mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="canonical" href="${escapeHtml(url)}">
<link rel="alternate" hreflang="en-ZA" href="${escapeHtml(url)}">
<link rel="alternate" hreflang="x-default" href="${escapeHtml(url)}">
<meta name="robots" content="${escapeHtml(robots)}">
<meta name="author" content="Impelo">
<meta property="og:site_name" content="Impelo">
<meta property="og:title" content="${escapeHtml(seo.title)}">
<meta property="og:description" content="${escapeHtml(seo.description)}">
<meta property="og:url" content="${escapeHtml(url)}">
<meta property="og:type" content="${escapeHtml(ogType)}">
<meta property="og:locale" content="en_ZA">
<meta property="og:image" content="${escapeHtml(seo.ogImage || DEFAULT_OG_IMAGE)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escapeHtml(seo.ogImageAlt || '')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(seo.title)}">
<meta name="twitter:description" content="${escapeHtml(seo.description)}">
<meta name="twitter:image" content="${escapeHtml(seo.ogImage || DEFAULT_OG_IMAGE)}">
<meta name="twitter:image:alt" content="${escapeHtml(seo.ogImageAlt || '')}">
${buildStructuredData(seo, pathname)}
<!-- impelo-seo-end -->`

  out = out.replace('</head>', `${block}\n</head>`)
  return out
}
