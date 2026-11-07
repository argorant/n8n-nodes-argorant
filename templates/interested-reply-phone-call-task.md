# Call interested prospects: get their phone number and post a call task to Slack

Slug: `interested-reply-phone-call-task`  
File: `templates/interested-reply-phone-call-task.json`  
Screenshot: `templates/screenshots/interested-reply-phone-call-task.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Sales teams that want to call interested prospects while the reply is fresh.

### What it does
When a reply is marked Interested, Argorant finds the person and their direct or mobile number, and Slack gets a call task with a tap-to-call link and the reply text. Without a number, Slack says so and suggests answering by email.

### How to set up
Add Argorant and Slack credentials, pick the channel and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, Argorant Pro plan or higher (webhooks and phone numbers), a public HTTPS address for n8n, a Slack credential.

### Costs
Phone numbers cost 10 credits each, only when a number is returned; numbers you already have are free. Finding the person costs 1 credit when found with a passing email; misses and people you already have are free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 211 words.
