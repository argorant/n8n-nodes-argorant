# Find companies that match your market, score them with AI and keep the best in a sheet

Slug: `search-companies-score-to-sheet`  
File: `templates/search-companies-score-to-sheet.json`  
Screenshot: `templates/screenshots/search-companies-score-to-sheet.png`  
Categories: Sales, AI  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Founders and sales leads who build their account list from a market definition.

### What it does
Every Monday Argorant searches companies by industry, country and size, your own AI model scores each one against your ideal customer, and new companies with a high score are appended to a Google Sheet.

### How to set up
Set the market, the ideal customer and the minimum score in Settings, pick the sheet, add credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Google Sheets credential, a chat model credential.

### Costs
Free in Argorant: company search uses no credits. Your model provider bills its own usage, at most max_companies scores per run.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 207 words.
