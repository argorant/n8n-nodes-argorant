# Block bounced and opted-out addresses everywhere and flag them in HubSpot

Slug: `bounce-unsubscribe-hygiene`  
File: `templates/bounce-unsubscribe-hygiene.json`  
Screenshot: `templates/screenshots/bounce-unsubscribe-hygiene.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams that run several campaigns and a CRM and want one clean list of who not to email.

### What it does
When an Argorant email bounces or a person unsubscribes, the address is added to the Argorant blocklist (so no other campaign emails it), the HubSpot contact is flagged with the reason, and the event is logged in a Google Sheet.

### How to set up
Create the HubSpot property and the sheet, add credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, Argorant Pro plan (webhooks), a public HTTPS address for n8n, HubSpot and Google Sheets credentials.

### Costs
Free: blocking uses no credits.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 196 words.
