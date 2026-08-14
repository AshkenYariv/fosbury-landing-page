# fosbury-landing

The landing page. Static HTML, two endpoints, and the table one of them writes
to.

```bash
npm test
```

The tests need nothing but Node. `test/schema.test.js` additionally wants a
Postgres to talk to and skips itself when there is not one, so `npm test` still
means something on a machine without a database.

## What the page asks for

Two things, and neither of them is an address any more:

* **Open app** — `https://app.fosbury.ai`, in the same tab.
* **Download** — the download section, and from there the app's own stable
  per-platform links. See [Downloads](#downloads).

The waitlist dialog is gone from the page. [`api/waitlist.js`](api/waitlist.js),
[`lib/signups.js`](lib/signups.js) and the `waitlist_signups` table are still
here and still work — **nothing calls them.** They are kept rather than deleted
because the endpoint is the only record of how sign-ups were taken, and putting
it back in front of a button is one commit. Its tests still run.

## Downloads

The three buttons point at the **app's** origin, not at this one:

| | |
|---|---|
| `https://app.fosbury.ai/download/mac` | newest `.dmg` |
| `https://app.fosbury.ai/download/windows` | newest `.exe` |
| `https://app.fosbury.ai/download/linux` | newest `.AppImage` |

Nothing is hosted here and no href names a version, so publishing a build is
putting a file in a directory. The other end is `backend/download.ts` in
`fosbury-app`, and it is **off unless `FOSBURY_DOWNLOADS` names a directory on
that deployment** — with it unset the app's SPA catch-all answers instead, and
every one of these links quietly returns an HTML page rather than a file. That
is a one-variable failure with no visible symptom on this side, so it is worth
checking after any deploy of the app: the links must return
`content-type: application/*`, not `text/html`.

`scripts/download.js` names the machine once, writes it to `data-os` on the
document, and everything else reads it from there — which build is marked yours,
and the `os` dimension on every counted event.

## Email

Two endpoints send mail and **nothing in this repo receives it.** There is no
inbound webhook, no IMAP, no parse hook and no polling, which is worth knowing
before anyone changes an MX record: mail routing can be rearranged without
touching this code.

[`api/download-help.js`](api/download-help.js) is the live one — the
"having problems downloading?" dialog. One letter per report:

| | To | From | Reply-To |
|---|---|---|---|
| **Report**, to us | `EMAIL_SUPPORT` | `EMAIL_FROM` | the person who wrote it |

It goes to the **alias**, which is the opposite of what the waitlist notice
below does and deliberately so: the dialog tells people the address, they will
use it again, and support has to be re-pointable at somebody who is not Yariv
without a deploy.

[`api/waitlist.js`](api/waitlist.js) is the unreachable one described above. Two
letters go out per sign-up, and they point in opposite directions:

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
| `RESEND_KEY` | — | Required to send at all. Without it a download report **fails and says so**, naming the address instead; a waitlist row is still written and the sign-up still succeeds. |
| `DATABASE_URL` | — | The table. `POSTGRES_URL` is also accepted. |
| `EMAIL_FROM` | `Fosbury <hello@fosbury.ai>` | Must be on a domain verified in Resend. |
| `EMAIL_SUPPORT` | `hello@fosbury.ai` | Where download reports land. |
| `EMAIL_REPLY_TO` | `hello@fosbury.ai` | |
| `EMAIL_NOTIFY` | `yariv@fosbury.ai` | |

The four addresses have working defaults and only need setting on a deployment
that should not write to the real inbox. Preview deployments inherit
`RESEND_KEY` and would otherwise send real mail from the real domain.

The two endpoints differ on what a missing `RESEND_KEY` means, and the
difference is the point: a sign-up has a row to fall back on, and a support
report has nothing but the letter. So one carries on and the other refuses
loudly — and the dialog prints `hello@fosbury.ai` in readable text underneath
the form either way, because the failure case of a contact form must never be a
dead end.

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
