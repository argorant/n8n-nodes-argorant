# Score new leads in Google Sheets against your ideal customer with your own AI model

Slug: `score-sheet-leads-with-ai`  
File: `templates/score-sheet-leads-with-ai.json`  
Screenshot: `templates/screenshots/score-sheet-leads-with-ai.png`  
Categories: Sales, AI  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams that collect leads in a spreadsheet and want to work the best ones first.

### What it does
When a row with a company domain is added, Argorant reads the company profile, your own AI model scores the fit from 1 to 10 against your ideal customer description with a one-line reason, and the score is written back to the row.

### How to set up
Describe your ideal customer in Settings, pick the sheet, add credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Google Sheets credential, a chat model credential.

### Costs
Free in Argorant: company lookups use no credits. Your model provider bills its own usage.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 204 words.
