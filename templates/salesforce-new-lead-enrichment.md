# Enrich every new Salesforce lead with title, company size and industry

Slug: `salesforce-new-lead-enrichment`  
File: `templates/salesforce-new-lead-enrichment.json`  
Screenshot: `templates/screenshots/salesforce-new-lead-enrichment.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Sales teams on Salesforce whose web and event leads arrive with an email and little else.

### What it does
Every few minutes the workflow picks up new Salesforce leads, asks Argorant who the person is and what the company looks like, and writes the title, profile URL, industry, headcount, city and website back to the lead. Fields that already have a value are kept.

### How to set up
Add Salesforce and Argorant credentials, set the cap per poll in Settings and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Salesforce credential with edit rights on leads.

### Costs
Enrich costs 1 credit per person found whose email passes the check; misses and repeats are free. The company lookup is free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Salesforce trigger and lead update mocked; Enrich live (example address, no match, 0 credits); company lookup live on the example domain (no data). A second run with the lookup mocked as found checked the field mapping into the update.

Overview note: 182 words.
