# Impelo customer website

Nuxt 4 project for the Impelo customer-facing website. The current implementation preserves the approved `impelo-guide` public prototype at root-level customer routes while it is migrated into native Nuxt components.

## Development

```bash
pnpm install
pnpm dev
```

## Checks

```bash
pnpm typecheck
pnpm build
```

## Routes

- `/`
- `/how-it-works/`
- `/about-impelo/`
- `/pricing/`
- `/contact/`
- `/legal/`
- `/privacy/`
- `/cookies/`
- `/terms/`
- `/information-access/`
- `/careers/`
- `/partners/`
- `/newsroom/`
- `/help-centre/`
- `/download/`

The HTML is served through Nuxt's Nitro middleware so the prototype markup and browser behavior remain byte-for-byte close to the approved source. Shared visual assets, fonts, CSS, and client controllers live in `public/`.

## Product pages

Download and pricing content lives in `scripts/product-pages.mjs`. After editing it, run `node scripts/clean-customer-footer.mjs` to regenerate the served HTML. This also keeps the customer footers and corporate placeholder pages consistent.

The pages share `public/product-pages.css`, with route-specific download and pricing styles. They use the existing `--font-sans` / `--font-mono` typography and shared brand/component colour tokens, rather than a separate palette. Buttons and billing tabs use the shared platform components without page-specific appearance overrides; route CSS only controls their placement. Pixel-style device frames are rendered in HTML/CSS around the original screenshots in `public/assets/platform-screens/`; the screen images remain uncropped and unrounded. Proposed pricing, limits and availability are defined together in the content module, and `public/public.js` synchronizes monthly/annual amounts across plan cards and the comparison table.

Download and plan cards use the platform's Card slot markup and utility classes for their surfaces, headers, content and footers. The comparison table shares the same card surface. Both product mastheads reuse Contact's shared scenic page-intro dimensions, padding, heading and lead styles, with the existing artwork and feathered wash treatment. Actions and availability notes sit below the mastheads so they do not stretch the headers; device previews remain in the download cards.

## SEO and social previews

`server/seo/public-seo.mjs` supplies page-specific metadata to the initial Nitro HTML response and static export. `server/seo/social-images.mjs` maps all 15 customer URLs to their artwork and alt text. Open Graph and Twitter cards specify page-specific images, dimensions and alt text while preserving the shared favicon, language, canonical and structured-data setup. Regenerating the prototype does not remove SEO coverage.

The canonical production origin is `https://impelo.org.za`. Override it with `NUXT_PUBLIC_SITE_URL` if needed. Corporate placeholders (careers, partners, newsroom and help centre) have share cards but remain `noindex, follow` and are excluded from the generated sitemap until their content is ready.

Each route has a unique artwork-only pixel-art JPEG in `public/assets/seo/`, sized 1200 × 630 with no cropping. There is no baked-in text or wordmark; titles remain in the HTML metadata. High-resolution text-free PNG masters for manual editing live in `artwork/seo/`. Exact built-in image-generation/edit prompts and source filenames are recorded in `public/assets/seo/prompts.json`. Run `node scripts/prepare-social-images.mjs` after editing the masters to update the optimized JPEGs without changing the artwork. Images are social previews, not interface screenshots; page-level platform screenshots remain unchanged.

Run `pnpm test:seo` to check route coverage, metadata uniqueness, canonical URLs, structured data, index controls, sitemap membership, image dimensions and image budgets. Validate deployed HTTP responses as well before submitting the production sitemap to search engines.
