# Alert the team in Slack when a campaign pauses, with the mailboxes to fix

Slug: `campaign-paused-mailbox-alert`  
File: `templates/campaign-paused-mailbox-alert.json`  
Screenshot: `templates/screenshots/campaign-paused-mailbox-alert.png`  
Categories: Sales, IT Ops  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams that send from many mailboxes and need to react fast when sending stops.

### What it does
When Argorant pauses a campaign (high bounces, mailboxes offline, or the monthly campaign emails used up), Slack gets the reason and the list of mailboxes that need attention. When the campaign resumes, Slack gets a short note.

### How to set up
Add Argorant and Slack credentials, pick the channel and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, Argorant Pro plan (webhooks), a public HTTPS address for n8n, a Slack credential.

### Costs
Free: no credits are used.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 189 words.
