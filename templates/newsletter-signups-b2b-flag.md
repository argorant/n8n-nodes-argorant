# Flag decision makers among newsletter signups and add them to a nurture campaign

Slug: `newsletter-signups-b2b-flag`  
File: `templates/newsletter-signups-b2b-flag.json`  
Screenshot: `templates/screenshots/newsletter-signups-b2b-flag.png`  
Categories: Marketing, Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
B2B marketers whose newsletter or content signups hide buyers among students, peers and competitors.

### What it does
Every signup through the n8n form is looked up in Argorant. Owners, founders, C-level, VPs and directors are posted to Slack for sales and join a nurture campaign; everyone else just stays a subscriber.

### How to set up
Share the form, pick the Slack channel and the nurture campaign, add credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Slack credential.

### Costs
1 credit per signup found whose email passes the check; misses are free. Adding them to the campaign is free (your own rows); only valid emails join.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 193 words.
