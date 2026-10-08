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

The HTML is served through Nuxt's Nitro middleware so the prototype markup and browser behavior remain byte-for-byte close to the approved source. Shared visual assets, fonts, CSS, and client controllers live in `public/`.
