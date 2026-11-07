# Local agency prospecting: a weekly batch of business owners into HighLevel

Slug: `local-agency-prospecting-to-highlevel`  
File: `templates/local-agency-prospecting-to-highlevel.json`  
Screenshot: `templates/screenshots/local-agency-prospecting-to-highlevel.png`  
Categories: Sales, Marketing  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Local marketing agencies that prospect business owners in their own city and work their pipeline in HighLevel.

### What it does
Every Monday Argorant reveals up to your weekly cap of owners in your niche around your city, with checked work emails, and the workflow creates or updates each one as a HighLevel contact with a tag and the source.

### How to set up
Set niche keywords, place, radius, cap and tag in Settings, add HighLevel and Argorant credentials, activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a HighLevel credential.

### Costs
1 credit per revealed contact whose email passes the check, at most max_people a week. People revealed before are free.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Reveal live (1 person); HighLevel upsert mocked.

Overview note: 194 words.
