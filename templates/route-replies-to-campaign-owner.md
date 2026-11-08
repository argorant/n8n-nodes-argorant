# Email every campaign reply to the owner of that campaign

Slug: `route-replies-to-campaign-owner`  
File: `templates/route-replies-to-campaign-owner.json`  
Screenshot: `templates/screenshots/route-replies-to-campaign-owner.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams and agencies where different people own different campaigns.

### What it does
When someone replies to an Argorant campaign, the workflow reads the campaign's tags, looks up the owner for that tag in one editable table and emails the reply to that owner with Gmail. Replies without a matching tag go to a default address.

### How to set up
Fill the tag to owner table in the Owners node, add Gmail and Argorant credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, Argorant Pro plan (webhooks), a public HTTPS address for n8n, a Gmail credential.

### Costs
Free: no credits are used.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 200 words.
