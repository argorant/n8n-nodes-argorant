# Add interested repliers to Attio with a note

Slug: `attio-sync-interested-replies`  
File: `templates/attio-sync-interested-replies.json`  
Screenshot: `templates/screenshots/attio-sync-interested-replies.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams that run their pipeline in Attio and prospect with Argorant.

### What it does
When a reply is marked Interested in Argorant, the company is created or updated in Attio by domain, the person by email and linked to it, and the person gets a note with the reply text and the campaign.

### How to set up
Create an Attio access token, add it as a Header Auth credential, add your Argorant credential and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, Argorant Pro plan (webhooks), a public HTTPS address for n8n, an Attio access token with record and note write access.

### Costs
Free: no credits are used.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 212 words.
