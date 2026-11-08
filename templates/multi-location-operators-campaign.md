# Multi-location operators: operations and facilities leaders at regional chains

Slug: `multi-location-operators-campaign`  
File: `templates/multi-location-operators-campaign.json`  
Screenshot: `templates/screenshots/multi-location-operators-campaign.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Facility services, equipment, software and staffing providers whose one deal covers many sites.

### What it does
Once a month Argorant counts operations, facilities and regional leaders at mid-size retail, restaurant, clinic and fitness companies in your country. When the number fits your budget, they are saved as a list and added to a new campaign draft with two emails. Slack gets the numbers.

### How to set up
Set country, size bands and budget in Settings, edit the emails, pick the Slack channel and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Slack credential.

### Costs
Count, list and draft are free. Adding the list costs 1 credit per new person with a valid email, only when the count is within max_people.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Count live (36,402); test budget 0, so the run ended at Report: nothing added (Slack mocked). The save, draft, fill wait and add chain is the same as in the real estate template, where it ran live end to end.

Overview note: 198 words.
