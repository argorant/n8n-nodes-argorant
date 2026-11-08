# Find work emails for new Google Sheets rows and add them to a campaign

Slug: `sheet-rows-find-email-add-to-campaign`  
File: `templates/sheet-rows-find-email-add-to-campaign.json`  
Screenshot: `templates/screenshots/sheet-rows-find-email-add-to-campaign.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams that collect target accounts in a spreadsheet: names and company websites, but no emails.

### What it does
Each new row with a first name, last name and company domain gets its work email found by Argorant. Rows with a confirmed email join the campaign you pick; every row gets its result written back to the sheet.

### How to set up
Pick the spreadsheet in both Google Sheets nodes, the campaign in Add to campaign, add credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Google Sheets credential, a sheet with the columns first_name, last_name, domain, email and status.

### Costs
Finding an email costs 1 credit when an address is found and 0.25 when nothing is found. Adding your own rows to a campaign is free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 201 words.
