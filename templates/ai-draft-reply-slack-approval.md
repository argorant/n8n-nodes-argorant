# Draft answers to interested replies with AI and send them after Slack approval

Slug: `ai-draft-reply-slack-approval`  
File: `templates/ai-draft-reply-slack-approval.json`  
Screenshot: `templates/screenshots/ai-draft-reply-slack-approval.png`  
Categories: Sales, AI  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Founders and sales reps who want fast, good answers but keep the final word.

### What it does
When a reply is marked Interested, your own AI model drafts an answer from the whole thread. The draft goes to Slack with Send and Don't send buttons. Only an approved draft is sent from Argorant, in the same thread and from the mailbox that received the reply.

### How to set up
Add your chat model, Argorant and Slack credentials, write your calendar link into Settings and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, Argorant Pro plan (webhooks), a public HTTPS address for n8n, a chat model credential, a Slack credential.

### Costs
Free in Argorant: replies use no credits. Your chat model provider bills its own usage.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 231 words.
