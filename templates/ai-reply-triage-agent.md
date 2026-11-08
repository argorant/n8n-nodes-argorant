# Triage campaign replies with your own AI agent

Slug: `ai-reply-triage-agent`  
File: `templates/ai-reply-triage-agent.json`  
Screenshot: `templates/screenshots/ai-reply-triage-agent.png`  
Categories: Sales, AI  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Teams with many replies a day who want each one labeled and handled the same way.

### What it does
Every new reply is read in full by your own AI model. The agent labels it with one of your reply statuses, blocks people who ask to stop, takes wrong contacts out of the campaign and posts a short summary to Slack. It never sends email.

### How to set up
Add your chat model, Argorant and Slack credentials, review the rules in the agent's system message and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, Argorant Pro plan (webhooks), a public HTTPS address for n8n, a chat model credential, a Slack credential.

### Costs
Free in Argorant: labeling, blocking and removing use no credits. Your chat model provider bills its own usage.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 227 words.
