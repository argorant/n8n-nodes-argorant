# Find lookalikes of your won customers every week

Slug: `lookalike-companies-from-won-deals`  
File: `templates/lookalike-companies-from-won-deals.json`  
Screenshot: `templates/screenshots/lookalike-companies-from-won-deals.png`  
Categories: Sales, Marketing  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Sales and marketing teams that want more accounts like the ones that already bought.

### What it does
Every Monday the workflow reads the domains of your won customers from a sheet, looks up their industry and size in Argorant, finds companies with the most common profile in your country and appends new ones to a lookalikes sheet.

### How to set up
Fill a sheet with customer domains, pick it and the lookalikes sheet, set the country and the number of results and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Google Sheets credential.

### Costs
Free: company lookups and searches use no credits.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Won customers sheet mocked (example domain); company lookup live, no data for the example domain, so the run stops cleanly. A second run with the lookup mocked (Transportation & Logistics, 51-200): Company Search live (3 lookalikes in the United States), customer filter and dedupe, sheet append mocked.

Overview note: 192 words.
