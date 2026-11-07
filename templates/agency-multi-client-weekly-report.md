# Agency report: weekly results of every client's Argorant workspace in one sheet

Slug: `agency-multi-client-weekly-report`  
File: `templates/agency-multi-client-weekly-report.json`  
Screenshot: `templates/screenshots/agency-multi-client-weekly-report.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Agencies and partners that run outbound for several clients, each in its own Argorant workspace.

### What it does
Every Monday the workflow reads the active campaigns of each client workspace with that client's own API key, takes the last 7 days of results and appends one row per campaign to a shared Google Sheet with the client name.

### How to set up
Create one Argorant credential per client, pick it in that client's two nodes, pick the sheet and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, one Argorant API key per client workspace, a Google Sheets credential.

### Costs
Free: reading campaigns and stats uses no credits.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 204 words.
