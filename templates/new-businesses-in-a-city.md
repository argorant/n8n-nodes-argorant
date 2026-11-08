# New businesses in your city: owners of recently founded companies into a welcome campaign

Slug: `new-businesses-in-a-city`  
File: `templates/new-businesses-in-a-city.json`  
Screenshot: `templates/screenshots/new-businesses-in-a-city.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Banks, accountants, insurers, office and IT providers and agencies that win new companies first.

### What it does
Once a month Argorant counts owners and founders of companies founded since last year within a radius of your city; when the number fits your budget, they are saved as a list and added to your welcome campaign.

### How to set up
Set place, radius, founding year and budget in Settings, pick the welcome campaign and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a campaign written for new companies.

### Costs
Count and list are free. Adding the list costs 1 credit per new person with a valid email, only when the count is within max_people.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed, both branches. Count live (5 owners of companies founded since last year, Austin, 20 mi); test budget 0, run stops. Fill branch: count and save mocked with a known list, wait loop and List progress live, Add to the welcome campaign live (test campaign).

Overview note: 190 words.
