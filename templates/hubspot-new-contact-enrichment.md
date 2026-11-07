# Enrich every new HubSpot contact with job title, company and profile URL

Slug: `hubspot-new-contact-enrichment`  
File: `templates/hubspot-new-contact-enrichment.json`  
Screenshot: `templates/screenshots/hubspot-new-contact-enrichment.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams whose HubSpot contacts arrive with an email and little else (forms, imports, meetings).

### What it does
When a contact is created in HubSpot, Argorant finds the person behind the email and the workflow fills job title, company name, seniority, city, country and profile URL on the contact.

### How to set up
Add a HubSpot developer app for the trigger and a private app token for the other HubSpot nodes, add your Argorant credential and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a HubSpot developer app (trigger) and a HubSpot private app token with contacts read and write.

### Costs
1 credit per contact found whose email passes the check; misses and people you already have are free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 184 words.
