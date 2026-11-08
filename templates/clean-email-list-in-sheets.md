# Check every email address in a Google Sheet and write the result next to it

Slug: `clean-email-list-in-sheets`  
File: `templates/clean-email-list-in-sheets.json`  
Screenshot: `templates/screenshots/clean-email-list-in-sheets.png`  
Categories: Marketing, Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Marketers and sales teams with an older list they want to send to without bounces.

### What it does
On demand, the workflow checks the addresses of your sheet that have no result yet, up to your cap, and writes valid, invalid, catch_all, risky or unknown plus a send recommendation back to each row.

### How to set up
Pick the sheet, set the cap in Settings and click Execute workflow.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Google Sheets credential.

### Costs
Half a credit per fresh check; addresses checked recently are free. At most max_checks checks per run.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 170 words.
