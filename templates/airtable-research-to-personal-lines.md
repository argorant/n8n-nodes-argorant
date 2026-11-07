# Send personal first lines researched in Airtable with an Argorant campaign

Slug: `airtable-research-to-personal-lines`  
File: `templates/airtable-research-to-personal-lines.json`  
Screenshot: `templates/screenshots/airtable-research-to-personal-lines.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams and agencies that research a personal opening line for each prospect in an Airtable base.

### What it does
Every hour the workflow picks the Airtable records marked Ready, saves each opener as the person's personal line in the Argorant campaign and marks the record Synced. A one-time branch sets up the {{custom_opener}} variable with a fallback.

### How to set up
Run the setup branch once, put {{custom_opener}} into your campaign email, connect Airtable and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, an Airtable base with the fields Email, Opener and Status, an Airtable token.

### Costs
Free: personal lines use no credits.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 211 words.
