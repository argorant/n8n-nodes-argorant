# Send a morning digest of interested replies to a Teams channel

Slug: `interested-replies-daily-teams-digest`  
File: `templates/interested-replies-daily-teams-digest.json`  
Screenshot: `templates/screenshots/interested-replies-daily-teams-digest.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Sales managers who review interested replies once a day instead of chasing alerts.

### What it does
Every weekday morning the workflow collects the interested replies of the last 24 hours across all Argorant campaigns and posts one table to a Microsoft Teams channel. Days without replies post nothing.

### How to set up
Pick the Teams team and channel and your Argorant credential, set the time and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Microsoft Teams credential.

### Costs
Free: reading replies uses no credits.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 182 words.
