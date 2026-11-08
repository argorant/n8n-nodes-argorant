# Log every campaign reply as a Salesforce task

Slug: `salesforce-log-replies-as-tasks`  
File: `templates/salesforce-log-replies-as-tasks.json`  
Screenshot: `templates/screenshots/salesforce-log-replies-as-tasks.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Sales teams that keep the full history of every prospect in Salesforce.

### What it does
When someone replies to an Argorant campaign, the workflow finds the Salesforce contact or lead by email, creates one if none exists, and logs the reply as a completed task with the subject and text.

### How to set up
Add Salesforce and Argorant credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, Argorant Pro plan (webhooks), a public HTTPS address for n8n, a Salesforce credential.

### Costs
Free: no credits are used.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 186 words.
