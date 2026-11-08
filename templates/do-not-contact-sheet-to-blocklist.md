# Sync a do-not-contact sheet to the Argorant blocklist every day

Slug: `do-not-contact-sheet-to-blocklist`  
File: `templates/do-not-contact-sheet-to-blocklist.json`  
Screenshot: `templates/screenshots/do-not-contact-sheet-to-blocklist.png`  
Categories: Sales, Marketing  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams where sales, legal or customer success keep a shared do-not-contact list.

### What it does
Every morning the workflow reads the new rows of your do-not-contact sheet (addresses or whole domains), adds each one to the Argorant blocklist so no campaign of your workspace emails it, and marks the row synced.

### How to set up
Pick the sheet, set the per-run cap, add credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Google Sheets credential.

### Costs
Free: blocking uses no credits.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 170 words.
