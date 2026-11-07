# Add each day's new matches of a saved search to a list and a campaign

Slug: `saved-search-daily-new-leads`  
File: `templates/saved-search-daily-new-leads.json`  
Screenshot: `templates/screenshots/saved-search-daily-new-leads.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams that keep one evergreen campaign for a market and want new people added every day without overspending.

### What it does
Every morning the workflow adds the people who newly match a saved search to a list. If the number of new people stays under your daily budget, it adds them to the campaign; if not, it holds them and tells you in Slack.

### How to set up
Pick the saved search, the target list, the campaign and the Slack channel, set the daily budget in Settings and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Slack credential.

### Costs
Adding people to a list is free. Adding them to the campaign costs 1 credit per new person with a valid email, capped by max_new_per_day.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 214 words.
