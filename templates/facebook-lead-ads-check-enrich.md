# Check and enrich Facebook lead ad signups, then send them to HubSpot and a nurture campaign

Slug: `facebook-lead-ads-check-enrich`  
File: `templates/facebook-lead-ads-check-enrich.json`  
Screenshot: `templates/screenshots/facebook-lead-ads-check-enrich.png`  
Categories: Marketing, Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Marketing teams that run lead ads and lose time on fake or mistyped emails.

### What it does
Every new lead from your Facebook lead form gets its email checked by Argorant. Valid ones are enriched with title and company, created or updated in HubSpot and added to a nurture campaign; others are logged in HubSpot as not valid.

### How to set up
Pick the page and form, add Facebook, HubSpot and Argorant credentials, pick the nurture campaign and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Facebook Lead Ads credential, a HubSpot private app token.

### Costs
Half a credit per fresh email check. Enrich costs 1 credit per person found whose email passes the check. Adding to the campaign is free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed, both branches. Invalid: Email Check live on the example address, status invalid, HubSpot status UNQUALIFIED mocked. Valid: check mocked as valid, Enrich live, HubSpot upsert mocked, Add to nurture campaign live (test campaign).

Overview note: 216 words.
