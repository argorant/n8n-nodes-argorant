# When a prospect books a meeting, stop the sequence and update HubSpot

Slug: `calendly-meeting-booked-to-hubspot`  
File: `templates/calendly-meeting-booked-to-hubspot.json`  
Screenshot: `templates/screenshots/calendly-meeting-booked-to-hubspot.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Sales teams that use a booking link in their campaigns and HubSpot as CRM.

### What it does
When someone books through Calendly, the workflow finds their Argorant conversation, sets its status to meeting booked, takes them out of the campaign so no follow-up goes out, and creates or updates the contact in HubSpot as a sales qualified lead.

### How to set up
Add Calendly, HubSpot and Argorant credentials, check the status key in Settings and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Calendly credential, a HubSpot private app token with contacts write access.

### Costs
Free: no credits are used.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 190 words.
