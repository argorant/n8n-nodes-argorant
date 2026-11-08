# Turn identified website visitor companies into campaign contacts

Slug: `website-visitor-company-to-campaign`  
File: `templates/website-visitor-company-to-campaign.json`  
Screenshot: `templates/screenshots/website-visitor-company-to-campaign.png`  
Categories: Marketing, Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
B2B marketers who already identify the companies that visit their pricing or product pages.

### What it does
Your visitor identification tool posts a company domain and the page visited to a webhook. New companies only: Argorant finds up to two buyers with the titles you set at that company and adds them to your campaign.

### How to set up
Set the titles and the number of people per company in Settings, pick the campaign, point your visitor tool at the webhook URL and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a tool that can POST the visiting company's domain.

### Costs
Adding people costs 1 credit per new person with a valid email, at most people_per_company per company. Each company is handled once.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 187 words.
