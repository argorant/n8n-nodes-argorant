# Find the decision makers of your target accounts and write them to Google Sheets

Slug: `target-accounts-decision-makers-to-sheets`  
File: `templates/target-accounts-decision-makers-to-sheets.json`  
Screenshot: `templates/screenshots/target-accounts-decision-makers-to-sheets.png`  
Categories: Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Account-based sales teams that keep their target account list in a spreadsheet.

### What it does
You run it on a sheet of company domains with the job titles you want. For each open account Argorant previews matching people, reveals up to your per-account cap with checked emails, writes them to a contacts tab and marks the account done.

### How to set up
Prepare the two tabs, set the titles and caps in Settings and click Execute workflow.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Google Sheets credential.

### Costs
Previews are free. Reveal costs 1 credit per contact whose email passes the check: at most per_account per account and max_accounts accounts per run.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 208 words.
