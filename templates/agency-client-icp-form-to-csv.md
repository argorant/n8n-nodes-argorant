# Agency: turn a client's ICP form into a checked CSV in their Drive folder

Slug: `agency-client-icp-form-to-csv`  
File: `templates/agency-client-icp-form-to-csv.json`  
Screenshot: `templates/screenshots/agency-client-icp-form-to-csv.png`  
Categories: Sales, Marketing  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Lead generation agencies that deliver prospect lists to clients.

### What it does
A client fills a short form with titles, industry, country and how many rows they want. Argorant exports a CSV of the matching people in which every email is checked; the file lands in a Google Drive folder and your team gets an email.

### How to set up
Pick the Drive folder, set the row cap and the team address in Settings, share the form URL with your client.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, Google Drive and Gmail credentials.

### Costs
The export costs 1 credit per contact whose email passes the check, at most the requested rows and never more than max_rows. People exported before are left out.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Sample form submission; Export > Create from filters live (capped at 2 rows in the test, job done, 2 rows checked); Download live (file with the rows that passed); Drive upload and Gmail mocked.

Overview note: 200 words.
