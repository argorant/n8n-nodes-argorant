# Law and accounting firm partners in a city, saved and added to a campaign

Slug: `law-accounting-firm-partners-by-city`  
File: `templates/law-accounting-firm-partners-by-city.json`  
Screenshot: `templates/screenshots/law-accounting-firm-partners-by-city.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Legal tech, accounting software, IT and marketing providers that sell to professional services firms.

### What it does
You pick a city, law firms, accounting firms or both, in a form. Argorant counts partners, owners and managing directors at those firms; when the number fits your budget, they are saved as a list and added to your campaign. The form shows the result.

### How to set up
Set the budget in Settings, pick the campaign, activate and open the form.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key.

### Costs
Count and list are free. Adding the list costs 1 credit per new person with a valid email, only when the count is within max_people.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Sample form (Austin, both); industries chosen by code; Count live (4,537); test budget 0, so the form ended with Too many or none. The save, fill wait and add chain is the same as in the real estate template, where it ran live end to end.

Overview note: 192 words.
