# Get a prep brief for every new external meeting in Google Calendar

Slug: `meeting-prep-brief-from-calendar`  
File: `templates/meeting-prep-brief-from-calendar.json`  
Screenshot: `templates/screenshots/meeting-prep-brief-from-calendar.png`  
Categories: Sales, AI  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Founders, account executives and consultants who meet new people every week.

### What it does
When a meeting with someone outside your company lands in Google Calendar, Argorant looks up each external attendee and their company, your own AI model writes a short brief, and the brief arrives by email before the call.

### How to set up
Set your own domain in Settings, pick the calendar, add credentials and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, Google Calendar and Gmail credentials, a chat model credential.

### Costs
1 credit per attendee found whose email passes the check (people you already have are free), at most max_attendees per meeting. Company lookups are free. Your model provider bills its own usage.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 210 words.
