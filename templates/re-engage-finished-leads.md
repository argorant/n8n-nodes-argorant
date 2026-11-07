# Re-engage people who finished a campaign months ago without replying

Slug: `re-engage-finished-leads`  
File: `templates/re-engage-finished-leads.json`  
Screenshot: `templates/screenshots/re-engage-finished-leads.png`  
Categories: Sales, Marketing  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams with older campaigns whose silent contacts deserve a second, different message after a pause.

### What it does
On the first of each month the workflow takes the people who completed an old campaign without replying, keeps those last emailed more than 90 days ago, caps the batch and adds them to a re-engagement campaign with the old campaign's name as a variable.

### How to set up
Pick the old and the new campaign, set the pause and the cap in Settings and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a second campaign written for re-engagement.

### Costs
Free for people your account already has. Every address is checked again and only valid emails join.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 185 words.
