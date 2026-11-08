# Find local business owners near a place and save them with checked emails to Google Sheets

Slug: `local-businesses-by-radius-to-sheets`  
File: `templates/local-businesses-by-radius-to-sheets.json`  
Screenshot: `templates/screenshots/local-businesses-by-radius-to-sheets.png`  
Categories: Sales, Marketing  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Agencies, suppliers and service companies that sell to local businesses in one area.

### What it does
You fill a short form with a business type, a city or postal code and a radius. Argorant previews the owners and founders of matching businesses nearby, reveals up to your cap with checked work emails, and the workflow appends them to a Google Sheet.

### How to set up
Set the caps in Settings, pick the sheet, open the form and run a search.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Google Sheets credential.

### Costs
Previews are free. Reveal costs 1 credit per contact whose email passes the check, at most max_reveal per search; people you revealed before are free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 220 words.
