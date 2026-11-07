# Reach founders and marketing heads of online stores that use a given technology

Slug: `ecommerce-brands-by-technology`  
File: `templates/ecommerce-brands-by-technology.json`  
Screenshot: `templates/screenshots/ecommerce-brands-by-technology.png`  
Categories: Sales, Marketing  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Agencies, app and service providers that sell to online stores built on a specific platform or using a specific tool.

### What it does
Once a month the workflow counts founders, owners and marketing leaders at e-commerce and retail brands that use the technology in Settings. When the number fits your budget, it saves them as a list, creates a campaign draft and adds the list. A Slack message reports the result.

### How to set up
Set the technology, countries and budget in Settings, edit the emails, pick the Slack channel and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Slack credential.

### Costs
Count, list and draft are free. Adding the list costs 1 credit per new person with a valid email, only when the count is within max_people.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Count live (78,781 for the test technology); test budget 0, so the run ended at Report: nothing added (Slack mocked) without spending. The save, draft, fill wait and add chain is the same as in the real estate template, where it ran live end to end.

Overview note: 208 words.
