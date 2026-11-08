# Check the email of every form signup and add valid ones to a nurture campaign

Slug: `form-signup-check-email-to-campaign`  
File: `templates/form-signup-check-email-to-campaign.json`  
Screenshot: `templates/screenshots/form-signup-check-email-to-campaign.png`  
Categories: Marketing, Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Marketing teams with a website form for demos, guides or webinars.

### What it does
People fill in an n8n form with name, work email and company. Argorant checks the address at once: valid addresses join your nurture campaign and see a thank you page; invalid or free mail addresses are asked for a work email instead.

### How to set up
Share the form URL or embed it, pick the campaign and your Argorant credential, activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key.

### Costs
Half a credit per fresh email check (the first of every two single checks takes 1 credit). Adding the person to the campaign is free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 193 words.
