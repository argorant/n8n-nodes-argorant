# Trade show booth leads: upload the scans, check every email and start the follow-up

Slug: `trade-show-booth-leads-csv`  
File: `templates/trade-show-booth-leads-csv.json`  
Screenshot: `templates/screenshots/trade-show-booth-leads-csv.png`  
Categories: Marketing, Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Event and field marketing teams that come back from a trade show with a CSV of badge scans.

### What it does
You upload the booth scans as a CSV in an n8n form with the event name. Argorant checks every email; valid ones are enriched with a job title when it is missing and added to your post-event campaign with the event name as a variable. The form shows how many joined.

### How to set up
Pick the campaign, set the row cap in Settings, activate and open the form after the event.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a CSV with at least an email column (first_name, last_name, company, title optional).

### Costs
Half a credit per fresh email check, at most max_rows. Enrich costs 1 credit per person found whose email passes the check, only when the title is missing. Adding your own contacts to the campaign is free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed, both branches. Sample CSV with two rows, the malformed address filtered out before the check. Not valid: Email Check live, run stops for that row. Valid: check mocked as valid, Enrich live, merge, Add to the post-event campaign live (test campaign), result page.

Overview note: 195 words.
