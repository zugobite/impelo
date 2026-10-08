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
