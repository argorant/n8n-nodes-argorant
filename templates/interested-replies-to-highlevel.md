# Create a HighLevel contact for every interested reply

Slug: `interested-replies-to-highlevel`  
File: `templates/interested-replies-to-highlevel.json`  
Screenshot: `templates/screenshots/interested-replies-to-highlevel.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Agencies and sales teams that run their pipeline in HighLevel and prospect with Argorant.

### What it does
When a reply is marked Interested in Argorant, the workflow reads the conversation and creates or updates the HighLevel contact with name, company, a tag and a note with the reply text.

### How to set up
Add HighLevel and Argorant credentials, set the tag in Settings and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a HighLevel credential. Argorant webhooks come with the Pro plan, and your n8n needs a public HTTPS address.

### Costs
Free: reading replies uses no credits.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Sample reply.positive event on the webhook; Read the conversation (Argorant) mocked, since the review account has no real reply; HighLevel upsert mocked with the tag from Settings.

Overview note: 183 words.
