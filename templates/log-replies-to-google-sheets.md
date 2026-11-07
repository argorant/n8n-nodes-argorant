# Log every campaign reply in Google Sheets, updated when its status changes

Slug: `log-replies-to-google-sheets`  
File: `templates/log-replies-to-google-sheets.json`  
Screenshot: `templates/screenshots/log-replies-to-google-sheets.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams that report on replies in a spreadsheet or share them with clients.

### What it does
Every new reply and every reply marked Interested is written to one Google Sheet row per conversation: date, campaign, person, company, status, subject and the first lines. When a reply is labeled later, the same row is updated instead of a new one.

### How to set up
Create the sheet, add Argorant and Google Sheets credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, Argorant Pro plan (webhooks), a public HTTPS address for n8n, a Google Sheets credential.

### Costs
Free: no credits are used.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 194 words.
