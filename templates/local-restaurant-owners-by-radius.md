# Restaurant owners near you: a sheet of checked contacts and a campaign

Slug: `local-restaurant-owners-by-radius`  
File: `templates/local-restaurant-owners-by-radius.json`  
Screenshot: `templates/screenshots/local-restaurant-owners-by-radius.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Suppliers, POS and delivery providers, marketing agencies and anyone who sells to restaurants in a city.

### What it does
You enter a city or postal code, a radius and a number of people in a form. Argorant counts restaurant and hospitality owners nearby, reveals up to that number with checked work emails, the workflow appends them to a Google Sheet and adds them to your campaign.

### How to set up
Pick the sheet and the campaign, check the per-run limit in Settings, activate and open the form.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Google Sheets credential.

### Costs
1 credit per revealed contact whose email passes the check, at most the number you ask for and never more than 100 per run (the limit in Settings). Adding revealed people to the campaign is free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Sample form (Austin, 10 mi, 1 person); Count live (6,324); Reveal live (1 person); sheet append mocked; Add to the campaign live (test campaign, entry removed after).

Overview note: 235 words.
