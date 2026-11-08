# Upload a CSV of names and company domains and download it with work emails

Slug: `csv-upload-find-emails-form`  
File: `templates/csv-upload-find-emails-form.json`  
Screenshot: `templates/screenshots/csv-upload-find-emails-form.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Anyone on the team who has a list of people and companies and needs their work emails without logging in to another tool.

### What it does
A simple n8n form takes a CSV with first_name, last_name and domain. Argorant finds the work email for each row, up to your cap, and the form hands back the same CSV with email, status and confidence columns to download.

### How to set up
Set the row cap in Settings, activate and share the form URL with your team.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key.

### Costs
1 credit per email found and 0.25 when nothing is found; bad rows are free. At most max_rows rows per upload.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 174 words.
