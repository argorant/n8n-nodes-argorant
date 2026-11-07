# Enrich spreadsheet rows with work email, job title and profile URL

Slug: `enrich-sheet-rows-work-email-title`  
File: `templates/enrich-sheet-rows-work-email-title.json`  
Screenshot: `templates/screenshots/enrich-sheet-rows-work-email-title.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams with lists of names and companies from events, partners or old exports that miss emails and titles.

### What it does
On demand, the workflow takes the rows of your sheet that have a name and a company domain but no email yet, asks Argorant to find each person, and writes the checked work email, job title, seniority and profile URL back to the same row.

### How to set up
Pick the sheet, set the per-run cap in Settings and click Execute workflow.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Google Sheets credential.

### Costs
1 credit per person found whose email passes the check; misses and people you already have are free. At most max_rows rows per run.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 185 words.
