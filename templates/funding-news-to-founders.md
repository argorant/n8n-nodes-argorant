# Save the founders and finance leaders of newly funded companies as a list

Slug: `funding-news-to-founders`  
File: `templates/funding-news-to-founders.json`  
Screenshot: `templates/screenshots/funding-news-to-founders.png`  
Categories: Sales, AI  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Sellers whose offer fits a company right after a funding round: agencies, recruiters, finance and software vendors.

### What it does
An RSS feed of funding news is read every hour. Your own AI model extracts the company and its domain from each announcement; Argorant finds the founders and finance leaders there and saves them in one list per run, and a Slack message names the companies.

### How to set up
Paste your feed URL, pick the chat model, set the titles and caps, pick the Slack channel and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a chat model credential, a Slack credential, an RSS feed with funding announcements.

### Costs
Free in Argorant: previews and lists use no credits. Revealing or adding the people later costs 1 credit per person. Your model provider bills its own usage.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

## Test result

Published JSON imported as is: ok. Test copy run headless with sample trigger data: passed. Sample RSS item; the extractor ran on a local open model in place of the OpenAI node and returned Linfield, linfield.example, Series A; Lead Search live (nobody at the example domain, so the run stops). A second run with the search mocked: Save as a list live (list deleted after), Slack mocked.

Overview note: 202 words.
