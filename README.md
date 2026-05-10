# DataBulge Web

Public web app for DataBulge — buy mobile data on installment.

**Live at:** https://www.databulge.com

## Pages

| File | Purpose |
|---|---|
| `index.html` | Main app (protected — requires login) |
| `databulge-auth.html` | Login / signup |
| `reset-password.html` | Password reset landing |
| `landing.html` | Public SEO landing page |
| `buy-data-on-installment-nigeria.html` | SEO page |
| `pay-small-small-data.html` | SEO page |

## Deployment

Push to `main` → GitHub Actions deploys automatically to GitHub Pages.

## Important

- `index.html` and `databulge-auth.html` are blocked in `robots.txt`
- Only SEO pages are crawlable by search engines
- No Android / Gradle files in this repo — see `databulge-native` (private)

## Supabase

Project: `dplxnpxxztkjczaoyetl`
Redirect URLs must include: `https://www.databulge.com/reset-password.html`
