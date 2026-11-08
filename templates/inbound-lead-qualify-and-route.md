# Qualify inbound leads and route them to the right campaign

Slug: `inbound-lead-qualify-and-route`  
File: `templates/inbound-lead-qualify-and-route.json`  
Screenshot: `templates/screenshots/inbound-lead-qualify-and-route.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Revenue teams with inbound signups, trials or contact requests that need a fast, fitting follow-up.

### What it does
Your website or app posts a new signup's email to a webhook. Argorant finds the person and their company; a scoring step compares title, company size and country with your ideal customer profile. Good fits join the sales campaign, everyone else the nurture campaign, and the caller gets the score back.

### How to set up
Edit the profile in Settings, pick both campaigns, post signups to the webhook URL and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a system that can POST JSON with an email field.

### Costs
Enrich costs 1 credit when the person is found with a passing email; misses and repeats are free. Company lookups and adding the signup are free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 195 words.
