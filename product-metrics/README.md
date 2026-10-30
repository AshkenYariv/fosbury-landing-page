# Product metrics — the landing page

fosbury.ai is counted twice, on purpose, by [`scripts/track.js`](../scripts/track.js), which is the
only file that decides what is counted:

| | Umami | Google Analytics 4 |
| -- | -- | -- |
| **Where** | [cloud.umami.is](https://cloud.umami.is) → website `4091c37b-0667-4e75-afd2-15874c002962` (the events without `[APP] `) | [analytics.google.com](https://analytics.google.com/analytics/web/#/a359885858p559447105/reports/intelligenthome) → property **Fosbury** (559447105) |
| **Id** | `data-website-id` on the Umami script in `index.html` | `G-98TXZSL290`, `ID` in [`scripts/analytics.js`](../scripts/analytics.js) |
| **Events** | Readable names: `Screen — Home`, `Section — Hero`, `Open app — hero` | `page_view`, `section_reached`, `ui_click`, `download_help`, with the readable name as a parameter |
| **Off when** | — | `localhost`, a `*.vercel.app` preview, or the id is empty |

The same GA4 stream is used by app.fosbury.ai, so a visitor who presses **Open app** stays one
journey. What happens *inside* the app, and the full funnel from here to a message sent, is mapped
in the app repo's
[`product-metrics/`](https://github.com/AshkenYariv/fosbury-app/tree/main/product-metrics), and
that is also where each review is written down.

## Every event and parameter

[`README.md` → What is counted](../README.md#what-is-counted) is the full map: every moment, its
Umami name, its GA4 event, the parameters, the sections and every live `data-track`.
[`metrics.test.js`](metrics.test.js) fails when a `data-track` is added to the page without being
added to that map, or when the GA id there stops being the one the page loads.

## What to look at

| Question | Where |
| -- | -- |
| How many came, and from where | GA4 — *Reports snapshot*, *Traffic acquisition* |
| How far down the page they got | GA4 — `section_reached` by `section`; Umami — `Section — …` |
| Did they press Open app | GA4 — `ui_click` where `label` starts `Open app —`; Umami — the same names |
| Which machines | the `os` parameter on every event |
| What else they pressed | GA4 — `ui_click` where `tracked` = `no`: clicks on things nobody named yet |
