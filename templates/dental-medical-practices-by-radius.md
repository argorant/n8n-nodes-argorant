# Dental and medical practices near you: owners and practice managers into a campaign

Slug: `dental-medical-practices-by-radius`  
File: `templates/dental-medical-practices-by-radius.json`  
Screenshot: `templates/screenshots/dental-medical-practices-by-radius.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Software, marketing, staffing and supply companies that sell to dental and medical practices.

### What it does
Once a month Argorant reveals up to your cap of owners and practice managers at dental and medical practices within a radius, each with a checked work email, and adds them to your campaign with the practice name and city as variables.

### How to set up
Set the place, radius, keywords and cap in Settings, pick the campaign and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key.

### Costs
1 credit per revealed contact whose email passes the check, at most max_people a month. Adding them to the campaign is free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Reveal live (1 person, Austin, 15 mi); Add with practice and city live (test campaign, entry removed after).

Overview note: 182 words.
