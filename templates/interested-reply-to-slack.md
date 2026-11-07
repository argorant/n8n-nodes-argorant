# Post interested replies to Slack with the whole thread

Slug: `interested-reply-to-slack`  
File: `templates/interested-reply-to-slack.json`  
Screenshot: `templates/screenshots/interested-reply-to-slack.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Sales teams who want to answer interested prospects within minutes.

### What it does
When a reply is marked Interested in Argorant, the workflow finds the conversation, reads the whole thread and posts it to a Slack channel with the campaign name and a link, so the right person answers fast.

### How to set up
Pick the Slack channel and your Argorant credential, then activate the workflow.

### Requirements
n8n-nodes-argorant 0.3.0 or later, Argorant Pro plan (webhooks), a public HTTPS address for n8n, a Slack credential.

### Costs
Free: reading replies and threads uses no credits.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 200 words.
