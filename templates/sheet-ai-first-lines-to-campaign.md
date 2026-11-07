# Write a personal first line with your own AI for each sheet row and add the person to a campaign

Slug: `sheet-ai-first-lines-to-campaign`  
File: `templates/sheet-ai-first-lines-to-campaign.json`  
Screenshot: `templates/screenshots/sheet-ai-first-lines-to-campaign.png`  
Categories: Sales, AI  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Sales teams and agencies that research prospects in a sheet and want every email to open with something specific.

### What it does
When a row with an email, a first name, a company and your research notes is added, your own AI model writes one opening line from the notes, and the person joins your Argorant campaign with that line as the {{first_line}} variable.

### How to set up
Put {{first_line|...}} in your first email, pick the sheet and the campaign, add credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Google Sheets credential, a chat model credential.

### Costs
Free in Argorant: your own rows cost no credits; only valid emails join. Your model provider bills its own usage.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 229 words.
