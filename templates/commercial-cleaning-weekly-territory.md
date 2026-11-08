# Commercial cleaning: work one territory a week from a sheet of postal codes

Slug: `commercial-cleaning-weekly-territory`  
File: `templates/commercial-cleaning-weekly-territory.json`  
Screenshot: `templates/screenshots/commercial-cleaning-weekly-territory.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Commercial cleaning and facility service companies that win contracts close to their teams.

### What it does
Every Monday the workflow takes the next open postal code from your territory sheet, counts the facility, property and office managers within your radius, adds them to your campaign when the number fits your weekly budget, and marks the territory done with the count.

### How to set up
Fill the territory sheet, pick it and the campaign, set the weekly budget and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Google Sheets credential, a campaign written for your area.

### Costs
Counting is free. Adding people costs 1 credit per new person with a valid email, only when the count is within max_per_week.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 208 words.
