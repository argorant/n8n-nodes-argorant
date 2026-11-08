# Follow up webinar attendees and no-shows with two different campaigns

Slug: `webinar-follow-up-attendees-no-shows`  
File: `templates/webinar-follow-up-attendees-no-shows.json`  
Screenshot: `templates/screenshots/webinar-follow-up-attendees-no-shows.png`  
Categories: Marketing, Sales  
Community node: `n8n-nodes-argorant` 0.3.0 (tested on n8n 2.46.6)

## Description

### Who it's for
Marketing and sales teams that run webinars or events and want the follow-up to match what each person saw.

### What it does
After the event, your webinar tool or a script posts the attendee list. People who attended join a follow-up campaign with the minutes they watched; people who registered but missed it join a replay campaign with the recording link.

### How to set up
Pick the two campaigns, post the attendee list to the webhook URL and activate.

### Requirements
n8n-nodes-argorant 0.3.0 or later, an Argorant API key, a webinar tool or script that can POST the attendee list as JSON.

### Costs
Free when the attendees are your own contacts: your own rows cost no credits. Only valid emails join.

### Community node
This template uses the Argorant community node `n8n-nodes-argorant` (version 0.3.0). On n8n Cloud and self-hosted n8n: Settings > Community nodes > Install > `n8n-nodes-argorant`. Guide: https://github.com/argorant/n8n-nodes-argorant

Overview note: 177 words.
