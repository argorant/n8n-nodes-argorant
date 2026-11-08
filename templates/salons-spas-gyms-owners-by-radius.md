# Salon, spa and gym owners: one city a week from a sheet into checked contacts

Slug: `salons-spas-gyms-owners-by-radius`  
File: `templates/salons-spas-gyms-owners-by-radius.json`  
Screenshot: `templates/screenshots/salons-spas-gyms-owners-by-radius.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Booking software, product suppliers and local marketing agencies that sell to salons, spas and gyms.

### What it does
Every Monday the workflow takes the next open city from your sheet, reveals up to your weekly cap of salon, spa and gym owners within its radius with checked work emails, appends them to a leads sheet and marks the city done.

### How to set up
Fill a cities sheet, pick it and the leads sheet, set the cap and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Google Sheets credential.

### Costs
1 credit per revealed contact whose email passes the check, at most max_people a week.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Next open city mocked (sheet); Reveal live (1 person); sheet append and city mark mocked.

Overview note: 206 words.
