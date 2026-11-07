# Insurance brokers: a monthly CSV of owners of newly founded companies

Slug: `insurance-broker-new-companies-export`  
File: `templates/insurance-broker-new-companies-export.json`  
Screenshot: `templates/screenshots/insurance-broker-new-companies-export.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Commercial insurance brokers who want to be first with companies that need their first policies.

### What it does
On the first of each month Argorant exports the owners, founders and finance heads of companies founded since last year in the industries you insure, checks every email while it builds the file, and the workflow emails you the CSV.

### How to set up
Set the recipient, the rows cap and the industries, add Gmail and Argorant credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Gmail credential.

### Costs
1 credit per contact whose email passes the check, at most max_rows a month. People exported before are left out, so you never pay twice.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 186 words.
