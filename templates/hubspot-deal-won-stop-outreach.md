# Stop all outreach to a company when its HubSpot deal is won

Slug: `hubspot-deal-won-stop-outreach`  
File: `templates/hubspot-deal-won-stop-outreach.json`  
Screenshot: `templates/screenshots/hubspot-deal-won-stop-outreach.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Sales teams that run Argorant campaigns next to HubSpot and never want to cold email a new customer.

### What it does
When a HubSpot deal moves to Closed won, the workflow reads the deal's contacts and blocks their addresses in Argorant, which takes them out of every campaign. Optionally it blocks the whole company domain.

### How to set up
Add HubSpot and Argorant credentials, check the stage name and the domain switch in Settings, activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a HubSpot developer app (for the HubSpot Trigger) and a HubSpot private app token with read access to deals and contacts.

### Costs
Free: blocking uses no credits.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 192 words.
