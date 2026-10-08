const screenRoot = '/assets/platform-screens'
const actionArrow = '<svg class="ico" data-icon="inline-end" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-arrow-right"/></svg>'

// Screens remain original image files. Only the surrounding device is illustrated.
export function device(kind, screen, alt, extraClass = '') {
  return `<div class="pixel-device pixel-device-${kind} ${extraClass}">
    <div class="pixel-device-shell">
      <div class="pixel-device-top" aria-hidden="true"><span></span></div>
      <img class="pixel-device-screen" src="${screenRoot}/${screen}.png" alt="${alt}" width="${kind === 'phone' ? 390 : kind === 'tablet' ? 820 : 1440}" height="${kind === 'phone' ? 844 : kind === 'tablet' ? 1120 : 1000}" ${extraClass ? 'fetchpriority="high"' : 'loading="lazy"'}>
      <div class="pixel-device-bottom" aria-hidden="true"><span>IMPELO</span><i></i></div>
    </div>
    ${kind === 'desktop' ? '<div class="pixel-device-stand" aria-hidden="true"><span></span></div>' : ''}
  </div>`.replace(/^[ \t]+$/gm, '')
}

const desktop = (extra = '') => device('desktop', 'desktop-health-home', 'Real Impelo desktop screenshot showing Health Home, appointments, queue and records.', extra)
const phone = (extra = '') => device('phone', 'mobile-health-home', 'Real Impelo mobile screenshot showing Health Home, appointment details and queue status.', extra)
const tablet = (extra = '') => device('tablet', 'tablet-profile', 'Real Impelo tablet screenshot showing the patient profile and account details.', extra)

const platformCards = [
  {name: 'Android', number: '01', category: 'Your everyday companion', copy: 'Your health home, appointment details and next step, together on your Android phone.', store: 'Google Play', art: phone(), stage: 'phone', label: 'Mobile'},
  {name: 'iPhone & iPad', number: '02', category: 'A familiar view, big or small', copy: 'The same patient experience across iPhone and iPad, with more space when you need it.', store: 'App Store', art: tablet() + phone(), stage: 'pair', label: 'Mobile & tablet'},
  {name: 'Windows', number: '03', category: 'More room for your day', copy: 'A larger view of the Impelo platform, from health home to appointments and patient records.', store: 'Windows app', art: desktop(), stage: 'desktop', label: 'Desktop'},
  {name: 'macOS', number: '04', category: 'At home on your desktop', copy: 'Bring the familiar Impelo experience to your Mac, with the information you need in one place.', store: 'Mac app', art: desktop(), stage: 'desktop', label: 'Desktop'},
]

export const downloadContent = `<main id="main" class="download-page product-page" lang="en">
  <section class="product-hero download-hero">
    <div class="product-hero-copy">
      <p class="eyebrow">Impelo on every device</p>
      <h1>A clearer view.<br><em>Wherever you are.</em></h1>
      <p class="product-lead">Your phone between visits. Your tablet at home. Your desktop for the bigger picture. One familiar place to find your next step.</p>
      <a class="btn" href="#platforms">Explore the apps ${actionArrow}</a>
      <p class="product-availability"><span class="pixel-status" aria-hidden="true"></span> Mobile and desktop apps Coming Soon</p>
    </div>
    <div class="product-device-scene" aria-label="Real Impelo screens in pixel-art device frames">
      <span class="scene-tag" aria-hidden="true">One platform. Every screen.</span>
      ${desktop('hero-desktop')}${phone('hero-phone')}
      <p class="device-caption">A look inside Impelo</p>
    </div>
  </section>
  <div class="product-strip" aria-label="App availability">
    <span><b>Mobile</b> Android · iPhone · iPad</span><span><b>Desktop</b> Windows · macOS</span><span><span class="pixel-status" aria-hidden="true"></span> Coming Soon</span>
  </div>
  <section class="download-platforms product-section" id="platforms">
    <div class="product-section-heading"><div><p class="eyebrow">Choose your screen</p><h2>Made to fit<br><em>your day.</em></h2></div><p>Explore the platform on the devices you already use. Each preview below shows the actual Impelo interface.</p></div>
    <div class="download-grid">${platformCards.map(p => `<article class="download-card">
      <div class="download-card-top"><span class="product-index">${p.number} / ${p.label}</span><span class="availability-pill">Coming Soon</span></div>
      <div class="download-card-copy"><p class="platform-kicker">${p.category}</p><h3>${p.name}</h3><p>${p.copy}</p></div>
      <div class="device-stage device-stage-${p.stage}">${p.art}</div>
      <div class="download-card-bottom"><span>${p.store}</span><button class="btn" type="button" disabled aria-disabled="true" aria-label="${p.name} app Coming Soon">Coming Soon ${actionArrow}</button></div>
    </article>`).join('')}</div>
  </section>
  <section class="product-cta"><p class="eyebrow">The next step starts here</p><h2>Get to know <em>Impelo.</em></h2><p>Explore the visit experience or talk to us about the apps and early access for your practice.</p><div class="product-actions"><a class="btn cream" href="/how-it-works/">Try the experience ${actionArrow}</a><a class="product-text-link" href="/contact/?topic=practice">Ask about app availability</a></div></section>
</main>`

const plans = [
  {key:'essentials', number:'01', label:'For a smaller practice', name:'Practice Essentials', cents:49900, amount:'R499', copy:'A focused starting point for everyday visits.', scope:['1 location','Up to 5 staff accounts'], features:['Check-in and visit-stage queue','Appointments and visit details','Patient documents and published visits','Daily queue and appointment exports','Self-guided setup and email support'], link:'Explore Essentials', topic:'practice'},
  {key:'team', number:'02', label:'For a growing team', name:'Practice Team', cents:129900, amount:'R1 299', copy:'More coordination for a busy practice and its people.', scope:['1 location','Up to 15 staff accounts'], features:['Everything in Practice Essentials','Multiple practitioner schedules','Separate queues and team handoffs','Filtered operational reports','Guided onboarding and priority support'], link:'Explore Practice Team', topic:'practice'},
  {key:'network', number:'03', label:'For connected clinics', name:'Clinic Network', cents:299900, amount:'R2 999', copy:'A shared operational view across several locations.', scope:['Up to 3 locations','Up to 40 staff accounts total'], features:['Everything in Practice Team','Location-specific roles and queues','Consent-managed record requests','Combined multi-site reporting','Phased rollout and a named support contact'], link:'Explore Clinic Network', topic:'network'},
]

const yes = '<span class="comparison-check" role="img" aria-label="Included">✓</span>'
const no = '<span class="comparison-dash" role="img" aria-label="Not included">—</span>'
const groups = [
  {name:'Practice size & limits', rows:[['Practice locations','1','1','Up to 3'],['Staff accounts','Up to 5','Up to 15','Up to 40 total'],['Patient access','R0','R0','R0'],['Visit & document allowances','To be confirmed','To be confirmed','To be confirmed']]},
  {name:'Everyday visits', rows:[['Check-in & visit-stage queue',yes,yes,yes],['Appointment calendar & visit details',yes,yes,yes],['Patient documents & published visits',yes,yes,yes],['Multiple practitioner schedules',no,yes,yes],['Separate queues & team handoffs',no,yes,yes]]},
  {name:'Reporting & responsible access', rows:[['Operational reporting','Daily exports','Filtered reports','Combined multi-site reports'],['Role permissions & consent controls',yes,yes,yes],['Audit history & assisted-access options',yes,yes,yes],['Location-specific roles & queues',no,no,yes],['Consent-managed record requests',no,no,yes]]},
  {name:'Setup & support', rows:[['Onboarding','Self-guided setup','Guided onboarding','Phased rollout'],['Support','Email support','Priority support','Named support contact']]},
  {name:'Apps & additional services', rows:[['Mobile & desktop apps','Coming Soon','Coming Soon','Coming Soon'],['SMS & WhatsApp usage','Scoped separately','Scoped separately','Scoped separately'],['Migration, integrations & extra capacity','Scoped separately','Scoped separately','Scoped separately']]},
]

const pricingComparison = `<section class="pricing-comparison product-section" id="compare-plans">
  <div class="product-section-heading"><div><p class="eyebrow">The details, side by side</p><h2>See what<br><em>each plan unlocks.</em></h2></div><p>People, places, features and support. A clear view of what’s included, what grows with your plan, and what needs a separate conversation.</p></div>
  <p class="comparison-scroll-note">Swipe or use the arrow keys to compare plans →</p>
  <div class="comparison-table-wrap" tabindex="0" role="region" aria-label="Scrollable Impelo plan comparison">
    <table class="comparison-table"><caption>Proposed Impelo practice features, limits and support by plan</caption>
      <colgroup><col class="comparison-feature-col"><col><col><col></colgroup>
      <thead><tr><th scope="col">Your practice,<br>your priorities.</th>${plans.map(p=>`<th scope="col"${p.key==='team'?' class="featured-column"':''}><span class="comparison-plan-name">${p.name}</span><span class="comparison-price" data-comparison-amount data-monthly-cents="${p.cents}">${p.amount} / month</span><a href="/contact/?topic=${p.topic}&amp;plan=${p.key}" data-comparison-enquiry>Explore plan ↗<span class="sr">: ${p.name}</span></a></th>`).join('')}</tr></thead>
      ${groups.map(g=>`<tbody><tr class="comparison-group"><th colspan="4">${g.name}</th></tr>${g.rows.map(r=>`<tr><th scope="row">${r[0]}</th>${r.slice(1).map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`).join('')}
    </table>
  </div>
  <p class="comparison-disclosure">All features and limits are proposed. Usage allowances and final service terms will be confirmed before launch. <a href="/download/">Explore the upcoming apps ↗</a></p>
</section>`

export const pricingContent = `<main id="main" class="pricing-page product-page" lang="en">
  <section class="product-hero pricing-hero">
    <div class="product-hero-copy"><p class="eyebrow">A plan for your practice</p><h1>Room for care.<br><em>Room to grow.</em></h1><p class="product-lead">Start with the people and places that make your practice yours. Find the right balance of everyday tools, team coordination and support.</p><div class="product-actions"><a class="btn" href="#pricing">Explore plans ${actionArrow}</a><a class="product-text-link" href="#compare-plans">Compare every feature</a></div><p class="product-availability">Proposed packages · Patient access stays R0</p></div>
    <div class="product-device-scene pricing-device-scene"><span class="scene-tag" aria-hidden="true">A clearer picture of the day</span>${desktop('hero-desktop')}<p class="device-caption">Inside the Impelo platform</p></div>
  </section>
  <section class="product-section pricing-packages" id="pricing">
    <div class="product-section-heading"><div><p class="eyebrow">Start here. Grow together.</p><h2>Your team.<br><em>Your next chapter.</em></h2></div><p>Three proposed practice packages. Prices are illustrative, in ZAR, with VAT assumed included. No live subscription is offered.</p></div>
    <div class="pricing-toolbar"><div class="billing-controls"><div class="billing-picker" aria-label="Example billing period"><button type="button" class="tab" data-billing="monthly" aria-pressed="true" data-t="monthly">Monthly</button><button type="button" class="tab" data-billing="annual" aria-pressed="false" data-t="annual">Annual</button></div><span class="billing-saving">10% less annually</span></div><a class="product-text-link" href="#compare-plans">Compare features & limits ↓</a></div>
    <p id="billing-note" class="billing-note" aria-live="polite">Monthly example: the displayed amount would be billed each month. No payment is taken.</p>
    <div class="pricing-tier-grid">${plans.map(p=>`<article class="package-plan pricing-tier${p.key==='team'?' featured':''}" data-plan="${p.key}">
      <div class="tier-label"><span class="product-index">${p.number}</span><span>${p.label}</span></div>
      <h3>${p.name}</h3><p class="plan-desc">${p.copy}</p>
      <div class="package-price"><p class="plan-price"><span data-plan-amount data-monthly-cents="${p.cents}">${p.amount}</span><span class="price-period"> / month</span></p><p class="package-billing" data-plan-total>${p.amount} billed monthly</p></div>
      <ul class="tier-capacity" aria-label="Plan limits">${p.scope.map(s=>`<li>${s}</li>`).join('')}</ul>
      <p class="package-list-label">Planned inclusions</p><ul class="tier-inclusions">${p.features.map(f=>`<li><span aria-hidden="true">✓</span>${f}</li>`).join('')}</ul>
      <a class="btn${p.key==='team'?'':' outline'}" href="/contact/?topic=${p.topic}&amp;plan=${p.key}">${p.link} ${actionArrow}</a>
    </article>`).join('')}</div>
    <p class="pricing-disclosure">Annual examples apply a proposed 10% reduction, paid for 12 months upfront. Final pricing, tax treatment and terms will be confirmed before launch.</p>
  </section>
  <section class="patient-access-band product-section"><div class="patient-access-value"><p class="eyebrow">For the people receiving care</p><span>R0<span>Patient access</span></span></div><div><h2>A clearer visit.<br><em>For every patient.</em></h2><p>The proposed model keeps appointment details, queue stages, published visit information and sharing choices free to patients at participating practices. Consultation fees and mobile data remain separate.</p><a class="product-text-link" href="/how-it-works/?journey=patient">Explore the patient journey ↗</a></div></section>
  ${pricingComparison}
  <section class="pricing-questions product-section"><div><p class="eyebrow">A little more clarity</p><h2>Good questions.<br><em>Clear answers.</em></h2><a class="product-text-link" href="/contact/?topic=practice">Talk to the Impelo team ↗</a></div><div class="pricing-faqs">
    <details><summary>What counts as a staff account?</summary><p>Clinicians, reception staff and administrators count towards the staff allowance. Patient accounts do not. Clinic Network’s 40 staff accounts cover all included locations together.</p></details>
    <details><summary>What if we need more capacity?</summary><p>Discuss additional locations, staff, usage and rollout support with us. Extra capacity, complex migration and custom integrations would be scoped separately.</p></details>
    <details><summary>What is included in the usage allowance?</summary><p>Visit and document allowances are still to be confirmed. SMS and WhatsApp usage would be scoped separately. These example packages do not set an unlimited allowance.</p></details>
    <details><summary>Are mobile and desktop apps available?</summary><p>Android, iOS, Windows and macOS apps are Coming Soon. <a href="/download/">See the app previews and planned platforms.</a></p></details>
    <details><summary>How does annual billing work?</summary><p>The annual example reduces the monthly equivalent by 10%. The full yearly amount would be paid upfront. Select Annual above to see both the monthly equivalent and yearly total.</p></details>
  </div></section>
  <section class="product-cta"><p class="eyebrow">Built around your people</p><h2>Let’s find<br><em>your starting point.</em></h2><p>Tell us about your practice, your team and the way you work. We’ll explore the right next step together.</p><a class="btn cream" href="/contact/?topic=practice">Discuss your practice ${actionArrow}</a></section>
</main>`
