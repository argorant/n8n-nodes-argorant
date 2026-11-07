# n8n-nodes-argorant

This is an n8n community node for [Argorant](https://argorant.com). It lets you find leads, check every email, build lists and campaign drafts, and read replies in your n8n workflows, or hand those actions to an n8n AI agent as a tool.

Argorant is a B2B prospecting app: find the right people, get their work emails checked, write and send campaigns, and sort the replies, from the app or from your own AI.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation) · [Operations](#operations) · [Credentials](#credentials) · [Compatibility](#compatibility) · [Usage](#usage) · [Resources](#resources) · [Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation:

1. In n8n, open **Settings > Community Nodes** and select **Install**.
2. Enter `n8n-nodes-argorant`, confirm, and install.
3. Add the **Argorant** node to a workflow.

## Operations

| Resource | Operation | What it does | Cost |
|---|---|---|---|
| Lead | Count | How many people match your filters | Free |
| Lead | Search | A preview of the people who match: role, seniority, company and place, names masked | Free |
| List | Create | Save a search, or the people you picked, as a list | Free |
| List | Add People | Add people to a saved list, by record ID or by filters; people already in it are skipped | Free |
| Email | Find | A work email from a first name, last name and company domain | 1 credit when found, 0.25 when nothing is found |
| Email | Check | Whether an address can receive mail: valid, invalid, catch_all, risky or unknown | Half a credit per fresh check |
| Campaign | Create Draft | A new campaign as a draft; nothing sends until you launch it in Argorant | Free |
| Campaign | Add Leads | People from a saved list, from search record IDs or your own rows | 1 credit per new person from Argorant data; your own rows are free |
| Reply | Get Many | Replies across your campaigns, newest first, with their status | Free |

Filters for Lead and List: job titles, seniority, departments, industry, keywords, company names and domains, company size, countries, states, cities, free text, and business email only.

## Credentials

1. Sign up at [argorant.com](https://argorant.com).
2. In the Argorant app, open **Profile > API keys** ([app.argorant.com/profile](https://app.argorant.com/profile)) and create a key. It starts with `ag_live_`.
3. In n8n, create an **Argorant API** credential and paste the key. n8n checks it right away.

The key acts as your Argorant account, with its plan, credits and limits. Counts, searches, lists and drafts never use credits.

## Compatibility

Built with the n8n community node CLI (`@n8n/node-cli`) and tested with n8n 2.46.6, self-hosted. The node has no runtime dependencies.

## Usage

**In a workflow.** A common flow: Lead > Count to size a market, List > Create to save it, Campaign > Create Draft, then Campaign > Add Leads with that list. Write the emails and launch in the Argorant app.

**As an AI agent tool.** Connect the Argorant node to the **Tool** input of an **AI Agent** node. Pick the resource and operation, and let the model fill fields such as Job Titles or Countries (the sparkle button next to a field). A good first tool is Lead > Count: it is free, so the agent can size markets as often as it likes. Keep actions that use credits, such as Email > Find or Campaign > Add Leads, behind a human approval step if you want to control spend.

**Picking lists and campaigns.** The List and Campaign fields load your saved lists and campaigns, or take an ID.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Argorant developer docs](https://docs.argorant.com)
* [Argorant API reference](https://docs.argorant.com/docs/reference)

## Version history

* **0.2.0**: rebuilt node with Lead, List, Email, Campaign and Reply operations, usable as an AI agent tool, published with npm provenance. Replaces the 0.1.x preview (its reveal and export operations and the trigger node were removed).
* **0.1.1**: first preview.
