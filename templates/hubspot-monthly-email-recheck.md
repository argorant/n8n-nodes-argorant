# Recheck HubSpot contact emails every month and flag the ones that stopped working

Slug: `hubspot-monthly-email-recheck`  
File: `templates/hubspot-monthly-email-recheck.json`  
Screenshot: `templates/screenshots/hubspot-monthly-email-recheck.png`  
Categories: Sales, Marketing  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams with a large HubSpot database whose emails go stale as people change jobs.

### What it does
On the first of each month the workflow checks the emails of up to max_checks HubSpot contacts with Argorant and writes the result to a contact property, so you can exclude invalid addresses from sequences and lists.

### How to set up
Create the property, set the cap in Settings, add credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a HubSpot private app token with contacts read and write.

### Costs
Half a credit per fresh check; addresses checked recently are free. At most max_checks checks a month.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 186 words.
