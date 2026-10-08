import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const pagesDirectory = join(process.cwd(), 'server/assets/prototype')
const pageFiles = (await readdir(pagesDirectory)).filter(file => file.endsWith('.html'))

const projectLinks = '<nav aria-label="Project"><h3 data-t="footerProject">Project</h3><a href="/about-impelo/" data-t="team">About Impelo</a><a href="/contact/" data-t="contact">Contact</a><a href="/about-impelo/#research">Our Research</a></nav>'
const companyLinks = '<nav aria-label="Company"><h3 lang="en">Company</h3><a href="/careers/">Careers</a><a href="/partners/">Partners</a><a href="/newsroom/">Newsroom</a><a href="/help-centre/">Help Centre</a></nav>'

function cleanFooter(html) {
  return html
    .replace(/<nav aria-label="Project"><h3[^>]*>Project<\/h3>.*?<\/nav>/, projectLinks)
    .replace(/<nav aria-label="Resources"><h3[^>]*>Resources<\/h3>.*?<\/nav>/, companyLinks)
    .replace(/(<div class="footer-bottom"><p[^>]*>.*?<\/p>)<a href="\/delivery\.html"[^>]*>.*?<\/a>/, '$1<a href="/newsroom/">Company Updates · 2026</a>')
    .replace(/<a class="btn" href="\/inclusion\.html#language-coverage" data-t="learnInclusion">.*?<\/a>/, '<a class="btn" href="/help-centre/#accessibility">Explore Accessibility Support</a>')
}

for (const filename of pageFiles) {
  const path = join(pagesDirectory, filename)
  const html = await readFile(path, 'utf8')
  await writeFile(path, cleanFooter(html))
}

const companyPages = {
  'careers.html': {
    title: 'Careers',
    eyebrow: 'Work With Impelo',
    heading: 'Build A Clearer Future For Care.',
    description: 'Explore future opportunities to help Impelo make healthcare journeys more understandable.',
    body: '<h2>Opportunities Are Coming.</h2><p>Impelo is not recruiting through this demonstration website yet. Future product, engineering, design, clinical operations and community roles will be published here.</p><p><a class="btn" href="/contact/?topic=partnership">Introduce Yourself</a></p>',
  },
  'partners.html': {
    title: 'Partners',
    eyebrow: 'Work With Us',
    heading: 'Partnerships Built Around Better Care.',
    description: 'Learn how practices, community organisations and technology partners could work with Impelo.',
    body: '<h2>Let’s Explore The Fit.</h2><p>We welcome early conversations with healthcare practices, community organisations, accessibility specialists and responsible technology partners.</p><p><a class="btn" href="/contact/?topic=partnership">Start A Partnership Conversation</a></p>',
  },
  'newsroom.html': {
    title: 'Newsroom',
    eyebrow: 'Company Updates',
    heading: 'The Latest From Impelo.',
    description: 'A placeholder for company news, product updates and media resources from Impelo.',
    body: '<h2>Updates Will Live Here.</h2><p>This demonstration page is reserved for company announcements, product milestones, research updates and media resources.</p><p><a class="btn" href="/about-impelo/">Meet Impelo</a></p>',
  },
  'help-centre.html': {
    title: 'Help Centre',
    eyebrow: 'Help & Support',
    heading: 'A Clear Place To Find Help.',
    description: 'Find future support, accessibility and account guidance for Impelo.',
    body: '<h2>Support Is Being Prepared.</h2><p>This demonstration page will become the home for account guidance, clinic onboarding help, accessibility support and common questions.</p><div id="accessibility" class="legal-status"><strong>Accessibility Support</strong><p>For accessibility feedback or assisted access questions, use the contact experience and select accessibility as your enquiry topic.</p></div><p><a class="btn" href="/contact/?topic=accessibility">Contact Support</a></p>',
  },
}

const template = await readFile(join(pagesDirectory, 'legal.html'), 'utf8')

for (const [filename, page] of Object.entries(companyPages)) {
  const content = `<main id="main"><section class="legal-intro" lang="en"><p class="eyebrow">${page.eyebrow}</p><h1>${page.heading}</h1><p>${page.description}</p></section><section class="section" lang="en"><div class="legal-copy">${page.body}<p class="small-note">Illustrative Corporate Page · Details To Be Confirmed Before Launch</p></div></section></main>`
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${page.title} — Impelo</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${page.description}">`)
    .replace(/data-public-page="[^"]*"/, 'data-public-page="company"')
    .replace(/<main id="main">.*?<\/main>/s, content)
  await writeFile(join(pagesDirectory, filename), cleanFooter(html))
}

console.log(`Updated ${pageFiles.length} customer footers and created ${Object.keys(companyPages).length} company pages.`)
