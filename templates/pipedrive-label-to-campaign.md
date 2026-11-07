# Add Pipedrive people with an Outbound label to an Argorant campaign

Slug: `pipedrive-label-to-campaign`  
File: `templates/pipedrive-label-to-campaign.json`  
Screenshot: `templates/screenshots/pipedrive-label-to-campaign.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams that plan outreach in Pipedrive and send it from Argorant.

### What it does
When a Pipedrive person is updated and carries your Outbound label, Argorant checks their email; valid addresses join the campaign with name and organization, and a note on the person records it.

### How to set up
Set the label ID in Settings, pick the campaign, add Pipedrive and Argorant credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Pipedrive credential.

### Costs
Half a credit per fresh email check. Adding your own contacts to the campaign is free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 185 words.
