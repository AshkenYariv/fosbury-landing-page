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

One thing, and it is not an address any more: **Open app** —
`https://app.fosbury.ai`, in the same tab. It is the hero button, the corner
button that follows you, the closing button, and what "Make it stop" does.

The waitlist dialog is gone from the page. [`api/waitlist.js`](api/waitlist.js),
[`lib/signups.js`](lib/signups.js) and the `waitlist_signups` table are still
here and still work — **nothing calls them.** They are kept rather than deleted
because the endpoint is the only record of how sign-ups were taken, and putting
it back in front of a button is one commit. Its tests still run.

## What is counted

Two places, one map. [`scripts/track.js`](scripts/track.js) is the only file
that decides what is counted and what it is called; it sends each moment to
**Umami** (`4091c37b-…`, the same site the app's service reports into) and to
**Google Analytics 4** through [`scripts/analytics.js`](scripts/analytics.js),
which is the GA loader and nothing else — ported from the Skipping Stones
landing site.

| Moment | Umami event | GA4 event | GA4 parameters |
|---|---|---|---|
| Landing on a screen, or moving between the two | `Screen — Home` / `Screen — About` (moves only) | `page_view` | `page_location` (`/` or `/about`, no `#section`), `page_title`, `screen`, `os` |
| A section crossing the middle of the window, first time per visit | `Section — <name>` | `section_reached` | `name`, `screen`, `os` |
| A click on anything with `data-track` | the `data-track` value | `ui_click` with `tracked=yes` | below |
| **Any** click on the page, tagged or not | — | `ui_click` | `element`, `label`, `is_control`, `tracked`, `link_url`, `link_outbound`, `screen`, `section`, `os` |
| The download-help dialog (off with downloads) | `Download help — opened` / `closed` / `rejected` / `submitted` / `sent` / `send failed` | `download_help` | `name` (the Umami name), `from`, `sent`, `field`, `reason`, `screen`, `section`, `os` |

`label` on a `ui_click` is the `data-track` name when there is one, then the
`aria-label`, then the words on the control — never an input's value, because
the help dialog's fields are what somebody typed. A click on page furniture has
`label=(none)` and `is_control=no`.

**Sections:** Hero, How it works, Built for, Quiet by default, Closing, About —
and Download, which is commented out with the rest of the download surface.

**Tagged clicks live today:**

| Where | `data-track` |
|---|---|
| Bar | `Nav — Fosbury mark`, `Nav — How it works`, `Nav — Built for`, `Nav — Quiet`, `Nav — About` |
| Open app | `Open app — hero`, `Open app — corner`, `Open app — closing`, `Make it stop` |
| How it works tabs | `How it works — 01 A queue, not a river`, `… 02 It already replied`, `… 03 Hand off the chasing` |
| Off with downloads | `Nav — Download`, `Download — corner` / `hero` / `closing` / `macOS` / `Windows` / `Linux` / `having problems`, `Open app — download section`, `Help — close pressed`, `Help — mailto`, `Help — done pressed` |

A new button is counted in both places by adding `data-track="…"` to it, and
in GA alone without even that.

### GA4 settings that matter

* **The id is one constant**, `ID` at the top of `scripts/analytics.js`:
  `G-98TXZSL290`, property **Fosbury**, stream *Fosbury web (fosbury.ai + app)*.
  The app's `frontend/public/analytics.js` carries the same one. Emptied, nothing
  is loaded and every event is logged to the console instead.
* **Nothing is sent from `localhost` or a `*.vercel.app` preview** — the events
  are logged to the console as `[analytics] …`, which is how to check a payload
  before it ships.
* gtag's own page view is off (`send_page_view: false`): both screens are one
  document, and its history listener would count every `#how` jump as a page.
* Every parameter above is registered in the property as an **event-scoped
  custom dimension** — `label`, `section`, `screen`, `os`, `name` (shown as
  *Umami name*), `element`, `is_control`, `tracked`, plus the app's `role`,
  `region` and `surface`. A new parameter needs registering too (Admin →
  Custom definitions), or it arrives and cannot be reported on.
* The same web stream is used by `app.fosbury.ai`, so the page and the app are
  one journey; *Configure your domains* holds `fosbury.ai`, which covers both.
* The stream's enhanced measurement keeps page loads, scrolls and video only.
  History page views, outbound clicks, site search, form interactions and file
  downloads are **off**: the first would double-count, and in the app the rest
  would read real URLs and link targets out of somebody's workspace.

## Downloads — built, and switched off

The whole download surface is written and **commented out**, because the links
do not work yet. Every piece is marked `OFF UNTIL THERE ARE BUILDS`:

| Where | What |
|---|---|
| `index.html` | the `#download` section, and the four buttons pointing at it — bar, corner, hero, closing |
| `index.html` `<head>` | `styles/help.css` and `scripts/help.js` |

`scripts/download.js` stays loaded. It draws nothing — its whole output is
`data-os` on the document — and that is the dimension every counted event
carries, which is worth having precisely while there is nothing to download.
`api/download-help.js`, its tests and `assets/platforms/` are untouched on disk.

### Why it is off

The buttons point at the **app's** origin, not this one:

| | |
|---|---|
| `https://app.fosbury.ai/download/mac` | newest `.dmg` |
| `https://app.fosbury.ai/download/windows` | newest `.exe` |
| `https://app.fosbury.ai/download/linux` | newest `.AppImage` |

`backend/download.ts` in `fosbury-app` needs two things, and they fail
differently:

| | Symptom at `/download/mac` |
|---|---|
| `FOSBURY_DOWNLOADS` unset | the app's SPA catch-all answers — an HTML login screen |
| set, but no artifacts in it | `302` to `/download`, which says *No build has been published yet* |

**As it stands the variable is set and the directory is empty**, so the links
redirect to a page that admits there is nothing there. Either way somebody
clicking Download gets no file, which is worse than not being offered it.

### Switching it back on

Follow the redirect and look at what actually comes back:

```bash
curl -sL -o /dev/null -w '%{content_type}\n' https://app.fosbury.ai/download/mac
```

Uncomment the blocks above when that says `application/x-apple-diskimage`.
**Anything containing `text/html` means there is still no build** — including a
`302`, which is the empty-directory case and reads like progress if you only
look at the status code. Do not use `curl -I`: a `HEAD` on that path answers
`404 application/json`, which is neither of the states above.

Getting a real answer is two steps in `fosbury-app`, neither of them here: run
the **desktop** workflow for the three artifacts, and put them in the directory
`FOSBURY_DOWNLOADS` names on the Railway volume. See its `DEPLOY.md`.

Nothing here names a version, so once those links work they keep working —
publishing a build is putting a file in a directory, and the aliases resolve to
the newest of each kind at request time with `cache-control: no-store` on the
redirect. **A new app release never needs a change on this side.**

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
