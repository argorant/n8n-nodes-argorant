# Mention a Slack bot to size and preview prospects in Argorant

Slug: `slack-lead-finder-assistant`  
File: `templates/slack-lead-finder-assistant.json`  
Screenshot: `templates/screenshots/slack-lead-finder-assistant.png`  
Categories: Sales, AI  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Sales teams who live in Slack and want prospect answers without switching tools.

### What it does
Mention your Slack app in a channel with a request. Your own AI model counts and previews matching people in Argorant, saves a list on request and replies in the thread.

### How to set up
Create a Slack app with the app_mention event, add the credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a Slack app credential, a chat model credential.

### Costs
Free in Argorant: counts, previews and lists use no credits. Your chat model provider bills its own usage.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 211 words.
