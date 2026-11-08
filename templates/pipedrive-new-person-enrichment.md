# Enrich new Pipedrive people with title, company and profile in a note

Slug: `pipedrive-new-person-enrichment`  
File: `templates/pipedrive-new-person-enrichment.json`  
Screenshot: `templates/screenshots/pipedrive-new-person-enrichment.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams using Pipedrive whose new people arrive from forms, imports or the inbox with little context.

### What it does
When a person is added in Pipedrive, Argorant finds the person behind their email, and the workflow adds a pinned note with job title, seniority, company, location and profile URL, and fills the name when it is missing.

### How to set up
Add Pipedrive and Argorant credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Pipedrive credential.

### Costs
1 credit per person found whose email passes the check; misses and people you already have are free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 168 words.
