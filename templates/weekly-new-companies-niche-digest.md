# Post a weekly Slack digest of new companies in your niche

Slug: `weekly-new-companies-niche-digest`  
File: `templates/weekly-new-companies-niche-digest.json`  
Screenshot: `templates/screenshots/weekly-new-companies-niche-digest.png`  
Categories: Sales, Marketing  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Founders, agencies and sales teams that want to know which new companies enter their market.

### What it does
Every Monday Argorant searches companies founded recently that match your keywords and country, the workflow drops the ones it showed before and posts the new names with domain, size and city to a Slack channel.

### How to set up
Set keywords, country and how recent in Settings, pick the channel and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Slack credential.

### Costs
Free: company searches use no credits.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Company Search live (solar, battery storage, Germany, founded in the last three years, limit 5): 3 companies; dedupe, digest built, Slack post mocked.

Overview note: 166 words.
