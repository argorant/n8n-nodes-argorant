# Argorant workflow templates for n8n

10 ready-made workflows that use the Argorant community node (`n8n-nodes-argorant` 0.3.0). Each one does one job: find and check leads, fill and protect campaigns, and handle replies with the tools a team already uses.
Every template has an overview note (how it works, setup, customization), section notes, no credentials and no IDs: you pick your own lists, campaigns, channels and sheets after the import.

## Before submitting to the n8n template library

n8n only accepts templates that use verified community nodes. The order is:

1. Publish `n8n-nodes-argorant` 0.3.0 to npm.
2. Get the node verified in the n8n Creator Portal (creators.n8n.io).
3. Submit the templates. New creators submit one template at a time and wait for approval; after three approved templates the creator is verified and can submit up to four at once.

Each `<slug>.md` file is the submission sheet: title, description (who it's for, what it does, how to set up, requirements), categories, costs and the screenshot path. The Creator Portal writes its own title and description from the workflow, so use the sheet to check and correct them.

Needs beyond the verified node:

- Argorant Pro plan or higher for the 3 templates that start with the Argorant Trigger (webhooks), and a public HTTPS address for n8n.
- The AI templates use the customer's own chat model node (any chat model works). Argorant runs no model for them.

## Templates

| # | Template | For | Argorant credits | Webhooks | Test |
|---|---|---|---|---|---|
| 1 | [One sentence to campaign with your AI agent](one-sentence-campaign-ai-agent.json) | Founders, sales teams and agencies who want to go from an idea for a target market to a ready campaign in one chat. | Counts, previews, lists and drafts are free. Adding people costs 1 credit per new person with a valid email. Campaign emails use the monthly campaign emails of your plan. | no | pass: imported; agent ran with a local model, Count leads tool live (about 42); Preview leads hit the test account's daily search rows (rerun after 00:00 UTC) |
| 2 | [Post interested replies to Slack with the whole thread](interested-reply-to-slack.json) | Sales teams who want to answer interested prospects within minutes. | Free: reading replies and threads uses no credits. | yes | pass: 5 nodes; thread read mocked (test account has no conversations) |
| 3 | [Find work emails for new Google Sheets rows and add them to a campaign](sheet-rows-find-email-add-to-campaign.json) | Teams that collect target accounts in a spreadsheet: names and company websites, but no emails. | Finding an email costs 1 credit when an address is found and 0.25 when nothing is found. Adding your own rows to a campaign is free. | no | pass: both branches; Find work email and Add Leads live |
| 4 | [Stop all outreach to a company when its HubSpot deal is won](hubspot-deal-won-stop-outreach.json) | Sales teams that run Argorant campaigns next to HubSpot and never want to cold email a new customer. | Free: blocking uses no credits. | no | pass: 8 nodes; Blocklist live, HubSpot mocked |
| 5 | [Add each day's new matches of a saved search to a list and a campaign](saved-search-daily-new-leads.json) | Teams that keep one evergreen campaign for a market and want new people added every day without overspending. | Adding people to a list is free. Adding them to the campaign costs 1 credit per new person with a valid email, capped by max_new_per_day. | no | pass: saved search to list live; budget guard branch |
| 6 | [Check the email of every form signup and add valid ones to a nurture campaign](form-signup-check-email-to-campaign.json) | Marketing teams with a website form for demos, guides or webinars. | Half a credit per fresh email check (the first of every two single checks takes 1 credit). Adding the person to the campaign is free. | no | pass: both branches; Check and Add Leads live |
| 7 | [Qualify inbound leads and route them to the right campaign](inbound-lead-qualify-and-route.json) | Revenue teams with inbound signups, trials or contact requests that need a fast, fitting follow-up. | Enrich costs 1 credit when the person is found with a passing email; misses and repeats are free. Company lookups and adding the signup are free. | no | pass: nurture branch live; good-fit branch after 00:00 UTC (company lookup uses daily search rows) |
| 8 | [Block bounced and opted-out addresses everywhere and flag them in HubSpot](bounce-unsubscribe-hygiene.json) | Teams that run several campaigns and a CRM and want one clean list of who not to email. | Free: blocking uses no credits. | yes | pass: Blocklist live; HubSpot and Sheets mocked |
| 9 | [Email a weekly report of every active Argorant campaign](weekly-campaign-report-email.json) | Founders, sales leads and agencies who want the numbers every Monday without logging in. | Free: reading stats uses no credits. | no | pass: Get Many and Get Stats live on 3 campaigns |
| 10 | [Draft answers to interested replies with AI and send them after Slack approval](ai-draft-reply-slack-approval.json) | Founders and sales reps who want fast, good answers but keep the final word. | Free in Argorant: replies use no credits. Your chat model provider bills its own usage. | yes | pass: local model drafted the answer; Slack approval and Send Reply mocked (no conversation, no email sent) |

## How they were tested

On a fresh self-hosted n8n 2.46.6 with `n8n-nodes-argorant` 0.3.0 installed:

1. Every published JSON was imported as is through the n8n API and opened in the editor (the screenshots come from that import).
2. A test copy of each template ran headless against a real Argorant account: the trigger became a manual trigger with sample data, nodes of other apps without test credentials (chat, CRM, sheets, mail) became code nodes with sample answers, the chat model became a local open-weight model, and every Argorant node called the live API. Campaigns were never launched; test addresses were sink addresses; created lists, campaigns and blocklist entries were deleted afterwards.

Note: the Argorant test account has no replies, mailboxes or sent campaigns, so steps that read or change a real conversation (Reply > Get, Set Status, Send Reply) ran with sample answers in the test copies; those operations are covered by the node's own live tests.
