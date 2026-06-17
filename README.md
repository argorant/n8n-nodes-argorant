# n8n-nodes-argorant

n8n community node for [Argorant](https://argorant.com) — search, count, reveal, and export verified B2B contacts. 614M contacts, 184 countries, verified at export time.

## Install

In n8n: **Settings → Community nodes → Install** → `n8n-nodes-argorant`

Or on self-hosted: `npm install n8n-nodes-argorant`

## Credentials

Create an API key at [app.argorant.com/profile](https://app.argorant.com/profile) (API keys section), then add an **Argorant API** credential in n8n.

## Operations

| Resource | Operation | Cost | Notes |
|---|---|---|---|
| People | Count | Free | Segment size for any filter combination |
| People | Search | Free | Redacted preview of matches |
| People | Reveal | Credits | Full details incl. verified email, phone, LinkedIn |
| Export | Create | Credits | Async job; rows verified at export time |
| Export | Get Status | Free | Poll until `status = completed` |
| Export | Download | Free | CSV of the finished job |

Filters: free-text query, title, seniority, department, industry, country/state/city, company name/domain, has-phone, has-LinkedIn. (Deliverability isn't a browse filter — every revealed/exported contact is verified live at that moment.)

## AI agents

All operations work as tools for n8n AI Agent nodes. Counts and searches are free, so agents can explore markets without consuming credits.

## Build

```bash
npm install
npm run build
```

## Release

Publishing is automated via `.github/workflows/release.yml` (npm publish with provenance on `v*` tags). One-time setup: push this directory to `github.com/argorant/n8n-nodes-argorant`, add an npm automation token as repo secret `NPM_TOKEN`. Then:

```bash
npm version patch   # bumps package.json + tags
git push && git push --tags
```

After the first npm publish, submit for n8n verification (community node registry) — the `n8n-community-node-package` keyword is already set.

Docs: [argorant.com/docs/integrations/n8n](https://argorant.com/docs/integrations/n8n)
