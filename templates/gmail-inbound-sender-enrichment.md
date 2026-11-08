# Know who emails you: enrich new senders and flag decision makers in Slack

Slug: `gmail-inbound-sender-enrichment`  
File: `templates/gmail-inbound-sender-enrichment.json`  
Screenshot: `templates/screenshots/gmail-inbound-sender-enrichment.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Founders and sales teams whose inbox receives inquiries, partner mails and introductions from people they do not know yet.

### What it does
When an email arrives from an unknown outside sender, Argorant finds the person behind the address, the workflow logs them in a Google Sheet, and decision makers are flagged in Slack.

### How to set up
Set your own domain in Settings and in the Gmail search, pick the sheet and channel, add credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, Gmail, Google Sheets and Slack credentials.

### Costs
1 credit per sender found whose email passes the check; misses and senders you already have are free. Each sender is looked up once.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 204 words.
