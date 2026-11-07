# Contractors by metro: roofing, HVAC, plumbing and electrical owners into a campaign

Slug: `local-contractors-owners-by-metro`  
File: `templates/local-contractors-owners-by-metro.json`  
Screenshot: `templates/screenshots/local-contractors-owners-by-metro.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Agencies, software and supply companies that sell to home-services contractors.

### What it does
Every Monday the workflow takes the metros in Settings, counts owners of roofing, HVAC, plumbing and electrical contractors around each one, saves one list per metro and adds it to your campaign when it fits the weekly budget. A Slack message sums it up.

### How to set up
Set metros, radius, trades and budget in Settings, pick the campaign and the Slack channel, activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Slack credential.

### Costs
Counts and lists are free. Adding a list costs 1 credit per new person with a valid email, only for metros within max_per_metro.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Two metros from Settings; Count live per metro (822 and 1,781); both above the test budget, so nothing was saved; Slack summary mocked.

Overview note: 196 words.
