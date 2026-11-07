# Reach newly appointed leaders from a news feed

Slug: `leadership-hire-news-to-campaign`  
File: `templates/leadership-hire-news-to-campaign.json`  
Screenshot: `templates/screenshots/leadership-hire-news-to-campaign.png`  
Categories: Sales, AI  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Sellers whose offer fits a new leader's first 90 days: consultants, agencies, software vendors.

### What it does
An RSS feed of press releases or industry news is checked every hour. Your own AI model extracts the newly appointed person, title and company domain; Argorant finds their work email, and confirmed emails join a campaign with the new title and the news link as variables.

### How to set up
Paste your feed URL, pick the chat model and the campaign, set the per-run cap and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a chat model credential, an RSS feed that covers appointments in your market.

### Costs
Finding an email costs 1 credit when an address is found and 0.25 when nothing is found. A cap per run limits the spend. Your model provider bills its own usage.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 192 words.
