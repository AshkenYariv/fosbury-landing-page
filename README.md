# fosbury-landing

The landing page. Static HTML, one endpoint, and the table it writes to.

```bash
npm test
```

The tests need nothing but Node. `test/schema.test.js` additionally wants a
Postgres to talk to and skips itself when there is not one, so `npm test` still
means something on a machine without a database.

## Email

One endpoint sends mail — [`api/waitlist.js`](api/waitlist.js) — and **nothing
in this repo receives it.** There is no inbound webhook, no IMAP, no parse hook
and no polling, which is worth knowing before anyone changes an MX record: mail
routing can be rearranged without touching this code.

Two letters go out per sign-up, and they point in opposite directions:

| | To | From | Reply-To |
|---|---|---|---|
| **Confirmation**, to the person who signed up | them | `EMAIL_FROM` | `EMAIL_REPLY_TO` |
| **Notice**, to us | `EMAIL_NOTIFY` | `EMAIL_FROM` | the person who signed up |

`hello@fosbury.ai` is an alias of `yariv@fosbury.ai`. Replies are pointed at the
alias rather than the mailbox behind it, because that address goes on to live in
strangers' inboxes and Google can be told to land it somewhere else without a
deploy. The notice is the other direction — nobody replies to it and only we
read it — so it goes straight to the mailbox.

### Settings

| Variable | Default | |
|---|---|---|
| `RESEND_KEY` | — | Required to send at all. Without it the row is still written and the sign-up still succeeds. |
| `DATABASE_URL` | — | The table. `POSTGRES_URL` is also accepted. |
| `EMAIL_FROM` | `Fosbury <hello@fosbury.ai>` | Must be on a domain verified in Resend. |
| `EMAIL_REPLY_TO` | `hello@fosbury.ai` | |
| `EMAIL_NOTIFY` | `yariv@fosbury.ai` | |

The three addresses have working defaults and only need setting on a deployment
that should not write to the real inbox. Preview deployments inherit
`RESEND_KEY` and would otherwise send real mail from the real domain.

### DNS

Sending goes through **Resend**, which authenticates on records of its own,
separate from whatever handles inbound mail. Both sets have to exist:

| Record | Whose | Do not delete |
|---|---|---|
| `send.fosbury.ai` `TXT` — `v=spf1 include:amazonses.com ~all` | Resend | SPF for outbound. |
| `send.fosbury.ai` `MX` — `feedback-smtp.eu-west-1.amazonses.com` | Resend | Bounce handling. Not the same thing as the root `MX`. |
| `resend._domainkey.fosbury.ai` `TXT` | Resend | DKIM. Losing this is how confirmation mail silently starts landing in spam. |
| `fosbury.ai` `MX` | Google | Inbound. Without it no `@fosbury.ai` address receives anything. |
| `fosbury.ai` `TXT` — `v=spf1 include:_spf.google.com ~all` | Google | One SPF record only; two is a permanent error and fails SPF outright. |
| `google._domainkey.fosbury.ai` `TXT` | Google | DKIM for mail sent by hand from Workspace. |

Resend deliberately keeps its SPF on the `send.` subdomain rather than the root,
so it does not compete with Google for the single root SPF record. The DKIM
selectors (`resend.` and `google.`) do not collide either.

`_dmarc.fosbury.ai` is `p=quarantine` with relaxed alignment, which both paths
satisfy — but relaxed alignment is what makes `send.fosbury.ai` count as
`fosbury.ai`, so tightening it to `aspf=s` would break Resend.
