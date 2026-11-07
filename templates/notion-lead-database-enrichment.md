# Enrich new leads in a Notion database with title, company and profile URL

Slug: `notion-lead-database-enrichment`  
File: `templates/notion-lead-database-enrichment.json`  
Screenshot: `templates/screenshots/notion-lead-database-enrichment.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Founders and small teams who keep their leads in a Notion database.

### What it does
When a page with an email is added to your Notion lead database, Argorant finds the person behind the address and the workflow fills in the title, company, profile URL and an Enriched checkbox on that page.

### How to set up
Share the database with your Notion integration, pick it, match the property names, set the cap and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Notion integration with access to the database (properties Email, Title, Company, Profile URL, Enriched).

### Costs
1 credit per person found whose email passes the check; misses and repeats are free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Notion trigger and page update mocked; Enrich live (no match for the example address, nothing charged); the page update received the mapped fields.

Overview note: 205 words.
