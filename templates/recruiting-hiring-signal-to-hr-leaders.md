# Recruiting agencies: reach HR leaders at companies that are hiring

Slug: `recruiting-hiring-signal-to-hr-leaders`  
File: `templates/recruiting-hiring-signal-to-hr-leaders.json`  
Screenshot: `templates/screenshots/recruiting-hiring-signal-to-hr-leaders.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Recruiting and staffing agencies that track open roles at target companies.

### What it does
Each new row in your hiring sheet (company domain and the open role) makes Argorant find the HR and talent leaders at that company, reveal up to two of them with checked emails, add them to your campaign with the open role as a variable, and write the result back.

### How to set up
Pick the sheet and the campaign, set the titles and the number per company, add credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Google Sheets credential, a sheet with company_domain, open_role, status and contacts.

### Costs
Reveal costs 1 credit per contact whose email passes the check, at most people_per_company per row. Adding revealed people to the campaign is free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 197 words.
