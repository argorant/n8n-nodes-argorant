# Email a weekly report of every active Argorant campaign

Slug: `weekly-campaign-report-email`  
File: `templates/weekly-campaign-report-email.json`  
Screenshot: `templates/screenshots/weekly-campaign-report-email.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Founders, sales leads and agencies who want the numbers every Monday without logging in.

### What it does
Every Monday the workflow reads the last 7 days of each active campaign (sent, replies, positive replies, bounces and rates), builds one table and emails it. Campaigns with a bounce rate above 3 percent are flagged.

### How to set up
Set the recipient in Settings, add Gmail and Argorant credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Gmail credential.

### Costs
Free: reading stats uses no credits.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 174 words.
