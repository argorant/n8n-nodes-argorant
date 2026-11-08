# Real estate: property managers and brokers in a metro, ready as a campaign draft

Slug: `real-estate-property-managers-metro`  
File: `templates/real-estate-property-managers-metro.json`  
Screenshot: `templates/screenshots/real-estate-property-managers-metro.png`  
Categories: Sales, Marketing  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Proptech, maintenance, cleaning and service companies that sell to property management and brokerage firms.

### What it does
You enter a city or postal code and a radius in a form. Argorant counts property managers, brokers and owners at real estate companies nearby; when the number fits your budget, they are saved as a list and added to a new campaign draft, and the form shows the result.

### How to set up
Set the budget in Settings, edit the emails, activate and open the form.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key.

### Costs
Count, list and draft are free. Adding the list costs 1 credit per new person with a valid email, only when the count is within max_people.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed, both branches. Over budget: Count live (8,001 in Austin, 15 mi), form ends with Narrow the area. Within budget (Marfa, Texas, 2 mi, budget 5): Count 4, list saved and filled (4), campaign draft created, fill wait loop, list added to the draft, form ends with Draft ready. List and draft deleted after the test.

Overview note: 208 words.
