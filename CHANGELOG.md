# Changelog

## 0.3.1 (2026-11-12)

- The note about the public HTTPS address is no longer on the Argorant Trigger form. It is now in the README and in the description of the Events field.

## 0.3.0 (2026-11-08)

The whole outbound workflow, not only data.

- 54 operations across 10 resources: Account, Lead (count, search, reveal, enrich, phone numbers), Company (count, search, get), Email (find, check), List (create, get, get many, get people, add and remove people, rename, delete, export), Export (create, get, get many, download), Campaign (create with emails, schedule and mailboxes; get, get many, update, write emails, set mailboxes, add, get and remove leads, personal lines, launch, pause, resume, stop, stats, test email, duplicate, delete), Reply (get many, get, statuses, set status, send reply, forward), Mailbox (get many, update), Blocklist (add, get many, remove).
- New Argorant Trigger: new reply, reply marked interested, bounce, unsubscribe, campaign paused or resumed, export ready, list ready, email checked, new matches for a saved search. Webhooks are registered on activation, removed on deactivation, and every call's signature is checked.
- Safe launches: Launch and Resume send only with Confirm Launch on; without it the node returns a readiness check and sends nothing. Campaigns take only people with a valid email.
- Every operation that spends credits or sends email says so in the node.
- Pickers for lists, saved searches, campaigns and mailboxes (from a list, by URL or by ID); dropdowns for industries, countries and regions, seniority, departments, company sizes, revenue and reply statuses.
- Return All or Limit with paging on every list and search, and a Simplify switch for clean flat output.
- Bulk: input items are combined and sent in batches; busy answers are retried with backoff under one idempotency key.
- Clear errors for missing credits (how many, where to add them), missing key scopes (which one), blocked launches (what is missing) and daily limits.
- Workflow templates in `templates/`.
- Upgrading from 0.1.x (the last version on npm): workflows built with 0.1.x need the new operations. Reveal and export are back as Lead > Reveal, List > Export and Export > Create, and the trigger is back as Argorant Trigger.
- Against 0.2.0 (never published): Campaign > Create Draft is now Campaign > Create; Lead > Search returns up to Limit people across pages; Email > Check returns the result without the quota block.

## 0.2.0 (2026-11-06, not published)

A new node, rebuilt with n8n's community node tooling.

- Resources and operations: Lead (count, search), List (create, add people), Email (find, check), Campaign (create draft, add leads), Reply (get many).
- Lists and campaigns can be picked from a searchable list.
- Usable as a tool by the n8n AI Agent.
- Breaking: the 0.1.x operations (reveal, export) and the Argorant Trigger node are gone. Workflows built with 0.1.x need the new operations.

## 0.1.1 (2026-06-17)

First preview release.
