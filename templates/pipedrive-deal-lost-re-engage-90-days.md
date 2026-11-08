# When a Pipedrive deal is lost, re-engage the contact 90 days later

Slug: `pipedrive-deal-lost-re-engage-90-days`  
File: `templates/pipedrive-deal-lost-re-engage-90-days.json`  
Screenshot: `templates/screenshots/pipedrive-deal-lost-re-engage-90-days.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Sales teams on Pipedrive that want a second, well-timed try with prospects who said not now.

### What it does
When a deal is marked lost, the workflow waits the number of days in Settings, reads the deal's contact person and adds them to an Argorant re-engagement campaign with the lost reason and the deal title as variables, then notes it on the deal.

### How to set up
Add Pipedrive and Argorant credentials, set the wait, pick the campaign and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Pipedrive credential, a campaign written for re-engagement.

### Costs
Free: your own contacts cost no credits. Every address is checked and only valid emails join.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Sample lost deal event; Wait shortened in the test copy; Get the contact and the deal note mocked; Add to re-engagement campaign live (test campaign, entry removed after).

Overview note: 194 words.
