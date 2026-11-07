# Upload a CSV of email addresses and download it with a check result per address

Slug: `csv-upload-check-emails-form`  
File: `templates/csv-upload-check-emails-form.json`  
Screenshot: `templates/screenshots/csv-upload-check-emails-form.png`  
Categories: Marketing, Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams that receive lists from events, partners or old tools and want to know which addresses still work.

### What it does
A simple n8n form takes a CSV with an email column. Argorant checks each address, up to your cap, and the form hands back the CSV with status and a send recommendation per address.

### How to set up
Set the cap in Settings, activate and share the form URL.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key.

### Costs
Half a credit per fresh check; addresses checked recently are free. At most max_rows checks per upload.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 169 words.
