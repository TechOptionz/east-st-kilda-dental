# Conversion tracking

How patient-intent actions on eaststkildadental.com.au are measured, what is
live in the code, and what still has to be done in Google Tag Manager, GA4 and
the booking platform before the numbers can be trusted.

Last updated 6 October 2026.

## Status

| Part | State |
| --- | --- |
| Website events (this repo) | Done. Tested on desktop and mobile; see [Test evidence](#test-evidence). |
| GTM container | **Not done.** The published container has no tags. Import file provided. |
| GA4 key events, dimensions, settings | **Not done.** Needs GA4 admin access. Steps below. |
| `appointment_booked` | **Blocked** on the booking platform (Centaur). See [Completed bookings](#completed-bookings-appointment_booked). |
| Search Console and Business Profile checks | **Not done.** Needs account access. Steps below. |
| End-to-end test into GA4 DebugView | **Not done.** Cannot happen until the container is published. |

The task is not complete until the last row is.

## What the audit found

1. **The GTM container is empty.** The site loads `GTM-MQ9RNSZP` and nothing
   else: no GA4 snippet, no second tag. The published version of that
   container, fetched on 6 October 2026, contains zero tags, zero triggers and
   no GA4 measurement ID. The site has been pushing conversion events into a
   container that forwards none of them. That alone explains "0 key events".

   It does not explain where September's 223 sessions came from. Nothing on
   the site as deployed today can send a hit to GA4. Check GA4 Realtime: if it
   is empty now, the container was changed or the data came from a tag that
   has since been removed.

2. **The one `form_start` GA4 recorded was not ours.** It came from GA4's
   Enhanced measurement, which guesses at form activity. It has to be switched
   off (step 4 below) or it will double-count against the real events.

3. **Event names did not match the brief.** The site fired `call_click`,
   `generate_lead` and `booking_widget_open`. They are now the names requested.
   Because the container was empty, nothing depended on the old names.

4. **UTMs survive every redirect.** Tested against production: `www` → bare
   domain, `/book/` → `/online-booking`, and `http://…/contact-us/` →
   `/contact` all arrive with `utm_source`, `utm_medium` and `utm_campaign`
   intact. No change was needed.

5. **No duplicate tracking sources.** There is one tag on the site (GTM), no
   hardcoded gtag, and no plugin. The only duplicate was the emergency sticky
   bar, which pushed two events per tap; it now pushes one.

## Events

Every event is pushed to `window.dataLayer` by `lib/analytics.ts`. One patient
action produces exactly one event.

| Event | Fires when | Not when |
| --- | --- | --- |
| `phone_click` | A click or tap on any `tel:` link, anywhere on the site (header, sticky mobile bar, footer, contact, emergency, service and suburb pages). | — |
| `email_click` | A click or tap on any `mailto:` link. | — |
| `booking_click` | A click or tap on any link to `/online-booking`. Every "Book online", "Book your visit", "Book with Dr …" and similar button on the site is such a link. | The link opens the booking system directly (that is `booking_start`). |
| `booking_start` | The visitor's first click, tap or keystroke **inside** the embedded booking widget, or a click on "open it in a new tab". At most once per page view. `booking_method` is `widget` or `new_tab`. | The page loads, or the widget is merely scrolled into view. |
| `external_booking_click` | A click on a link to a third-party booking platform listed in `EXTERNAL_BOOKING_PROVIDERS` (`lib/business.ts`). `provider` names it, e.g. `healthengine`. | — |
| `form_start` | The first time a field in a form receives focus. Once per form per page view. | The page loads or the form scrolls into view. |
| `form_submit` | `/api/contact` has accepted the enquiry (HTTP 200). | The Submit button is clicked but browser validation fails, or the API rejects the submission (that is `form_error`). |
| `appointment_booked` | Not implemented. See below. | |

Supporting events, not conversions: `booking_widget_view` (widget scrolled
30% into view, once), `form_error`, `form_abandon`, `spa_page_view`
(client-side route change) and `page_engagement` (not forwarded to GA4).

The site has no links to HealthEngine today, so `external_booking_click` will
not fire until one is added. Any other platform needs its domain added to
`EXTERNAL_BOOKING_PROVIDERS`.

### Parameters

| Parameter | On | Value |
| --- | --- | --- |
| `page_path` | all | Path of the page the action happened on. |
| `page_location` | all | Origin plus path. No query string. |
| `landing_page` | all | Path of the first page of this visit. See [Landing page](#landing-page-attribution). |
| `link_url` | click events | The link's `href`. |
| `link_text` | click events | The link's visible text, first 80 characters. |
| `link_location` | click events | Where on the page: `header`, `footer`, `sticky-call-bar`, or the nearest section id. |
| `form_name` | form events | `get-in-touch` or `callback`. |
| `booking_method` | `booking_start` | `widget` or `new_tab`. |
| `provider` | `external_booking_click` | e.g. `healthengine`. |

### What is never sent

Nothing a patient types or selects. No name, email, phone number, message,
treatment interest, or patient type. `link_url` on a `phone_click` is the
practice's own number, and on an `email_click` the practice's own address.

`form_submit` previously carried `patient_type` (new/returning) and
`form_intent` (enquire/book). Both were form contents, so both were removed.
If new-versus-returning is wanted in GA4, that is a decision for whoever owns
the privacy policy; it is a two-line change in `components/GetInTouch.tsx`.

The test suite types marker values into every form field and then searches
the whole dataLayer for them. None appear.

## Setup still required

### 1. Import the GTM container

`docs/gtm-container-import.json` contains one Google tag, one page-view tag
for client-side navigation, one event tag covering every event above, and the
variables they need.

1. GTM → Admin → Import Container → choose the file → workspace: new →
   **Merge**, rename conflicting.
2. Open the variable **GA4 Measurement ID** and replace `G-XXXXXXXXXX` with
   the ID from GA4 → Admin → Data streams.
3. Preview against the live site, run the tests in step 6, then Publish.

The file was written by hand to GTM's export format and has **not** been run
through GTM's importer. If it is rejected, the equivalent manual setup is:

- Trigger *Initialization*, condition `site_env` equals `production` → tag
  *Google tag* with the measurement ID.
- Trigger *Custom Event* `spa_page_view` → GA4 Event tag, event name
  `page_view`, parameters `page_location`, `page_title`.
- Trigger *Custom Event*, regex
  `^(phone_click|email_click|booking_click|booking_start|external_booking_click|booking_widget_view|form_start|form_submit|form_error|form_abandon)$`
  → GA4 Event tag, event name `{{Event}}`, one parameter per row in the
  parameters table above, each read from a Data Layer Variable of the same name.

Every trigger carries `site_env equals production`, so preview deployments
and local development never reach GA4.

### 2. GA4: register custom dimensions

Admin → Data display → Custom definitions → Create custom dimension, event
scope, for each of: `landing_page`, `link_url`, `link_text`, `link_location`,
`form_name`, `booking_method`, `provider`.

Without this the parameters are collected but cannot be used in reports.
Dimensions only apply to data collected after they are created.

### 3. GA4: key events

Admin → Data display → Events. An event appears in the list up to 24 hours
after it is first received; it can be added as a key event before that with
**New key event**.

| Mark as key event | Leave as ordinary events |
| --- | --- |
| `form_submit` | `phone_click` |
| `appointment_booked` (once it exists) | `booking_click` |
| | `booking_start` |
| | `email_click` |
| | `external_booking_click` |

This keeps "Key events" in every standard report meaning confirmed enquiries
and bookings only. The secondary actions are reported as event counts.

### 4. GA4: settings that would otherwise double-count

Admin → Data streams → the web stream → Enhanced measurement → gear icon:

- **Form interactions: off.** It fires its own `form_start` and `form_submit`
  on the browser's submit event, before the server has accepted anything.
- **Page views → "Page changes based on browser history events": off.** The
  site announces its own route changes with the correct title.

Same stream → Configure tag settings → List unwanted referrals → add
`centaurportal.com`, so a patient returning from the booking system is not
re-attributed to it.

### 5. Search Console and Business Profile

- GA4 → Admin → Product links → Search Console links: confirm the linked
  property is `sc-domain:eaststkildadental.com.au` and it is linked to the web
  stream above.
- Business Profile → Edit profile → Website: confirm it is
  `https://eaststkildadental.com.au/?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile`.
  The canonical tag on the home page already points at the bare URL, so the
  tagged URL is not indexed separately.
- Business Profile → Booking / appointment link, where Google allows a URL:
  `https://eaststkildadental.com.au/online-booking?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile&utm_content=appointment_link`.
  `utm_content` separates it from the main website button without changing
  the campaign.

### 6. Test into GA4

With GTM Preview open and GA4 → Admin → DebugView alongside, repeat each
action in [Test evidence](#test-evidence) on a desktop browser and a phone,
and confirm for each: the tag fired once, the event name and parameters
arrived in DebugView, and no second event with a similar name appeared.
Screenshots of both panes per event are the evidence the brief asks for.

## Completed bookings (`appointment_booked`)

**The site cannot detect a completed booking, and no change to this site alone
can fix that.**

The booking system is Centaur's D4W portal (`centaurportal.com`), embedded as
an iframe. What its public code does, read on 6 October 2026:

- Inside an iframe, choosing a time does not continue in the iframe. The
  portal shows "continue in a new tab" and the rest of the booking — patient
  details, SMS code, confirmation — happens in a new top-level tab on
  `centaurportal.com`.
- The portal never posts a message to the parent page. There is no
  `postMessage` out, no callback, and no success URL on our domain.
- A browser will not let our page read anything inside a frame or tab on
  another domain.

So the last thing this site can observe is the first interaction with the
widget. That is `booking_start`.

### What Centaur would need to provide

Any one of these. They are listed best first.

1. **A post-booking redirect to our site.** The portal asks its server where
   to send the patient after a confirmed booking and will follow a full URL.
   If Centaur can set that to a confirmation page on eaststkildadental.com.au,
   `appointment_booked` fires on our own domain, in the same browser, with the
   original source and landing page intact and no cross-domain setup. It needs
   a new, non-indexed confirmation URL on the site, which is outside this
   task's scope and needs sign-off. One of the portal's two booking flows
   appears to ignore the redirect; Centaur must confirm it applies to both.

2. **The practice's GA4 ID on the portal.** The portal already sends its own
   events to Google Analytics — `needTime` (time chosen), `booking-try`,
   `booking-ok` (booking saved), `signup-try`, `signup-success` — and has a
   slot for a second, practice-owned measurement ID (it appears in portal URLs
   as `ga4second`). It is currently Centaur's own ID, which suggests none has
   been set for this practice. With ours set, `booking-ok` would arrive in our
   GA4 and can be renamed to `appointment_booked` under Admin → Events →
   Create event.

   Two cautions before asking for this:

   - **It would send patient details to GA4 unless redacted first.** The
     portal's success page URL is
     `easybookingSuccess?data=…`, where `data` is an encoded copy of the
     patient's name, date of birth, mobile, email and notes. GA4 records page
     URLs. Before the ID is set, add `data` under Data streams → Redact data →
     URL query parameters, and verify in DebugView.
   - **Attribution will be weak.** The booking completes in a new tab on
     another domain, where our GA4 cookie does not exist. GA4 will count the
     booking but usually as a new, direct visitor. It answers "how many", not
     "from which page".

3. **A webhook or API** from D4W on appointment creation. None is visible
   publicly. It would give an exact count but no link to a website visit.

Also worth asking: the portal carries a `sourceID` on every booking and it is
currently `null` for ours. If D4W can report bookings by source, a fixed value
on the embed URL would at least separate website bookings inside the practice
software.

### Cross-domain measurement

Not configured, and not recommended as things stand. GA4 cross-domain linking
works by passing an identifier on a link the visitor clicks from one domain to
the other. Here the handover is an iframe, then a new tab opened by the
portal's own code, so there is no link of ours to decorate. It also requires
our GA4 tag on the portal, which is option 2 above with the same cautions.
Option 1 makes it unnecessary.

Until one of these is in place, report the funnel as
`booking_click → booking_start`, and take confirmed online bookings from D4W.

## Landing-page attribution

Two independent mechanisms:

- **GA4's own "Landing page + query string" dimension**, session-scoped. This
  is the primary one and needs no setup.
- **`landing_page` on every event**, set by the site: the path of the first
  page of the visit, kept in `sessionStorage` (per tab, cleared when the tab
  closes, reset after 30 minutes of inactivity). It holds a path only.

A `phone_click` on `/contact` by someone who arrived on `/dentist-elwood`
carries `page_path=/contact` and `landing_page=/dentist-elwood`.

## UTM conventions

Lowercase, no spaces, same three keys every time.

| Source | `utm_source` | `utm_medium` | `utm_campaign` |
| --- | --- | --- | --- |
| Google Business Profile | `google` | `organic` | `google_business_profile` |
| HealthEngine profile | `healthengine` | `referral` | `profile` |
| Instagram bio / posts | `instagram` | `social` | `profile` or the post's campaign name |
| Facebook page / posts | `facebook` | `social` | as above |
| TikTok | `tiktok` | `social` | as above |
| YouTube | `youtube` | `social` | as above |

`medium=social` is what GA4 files under Organic Social; `paid_social` and
`cpc` put paid activity under Paid Social and Paid Search. AI assistants
(ChatGPT, Perplexity, Gemini, Copilot) arrive as Referral with their own
domain as source; a custom channel group in GA4 → Admin → Channel groups,
matching source against those domains, separates them.

## The acquisition report

GA4 → Explore → Free form, once data is flowing:

- **Rows:** Session source / medium, then Landing page + query string.
- **Columns:** Event name, filtered to `phone_click`, `booking_click`,
  `booking_start`, `appointment_booked`, `form_submit`.
- **Values:** Sessions, Engaged sessions, Event count.
- **Filters / segments:** Session default channel group, Session campaign
  (`google_business_profile`), Device category, Landing page.

For the suburb and service comparison, filter Landing page to
`^/(dentist-|emergency-dentist|services/|nervous-patients)`.

To report by the site's own `landing_page` instead, use it as the row
dimension with Event count as the value.

## Test evidence

Run on 6 October 2026 against this code, in Chrome, in two profiles: desktop
(1366×900, mouse) and mobile (390×844, touch, iPhone user agent). Each
profile landed on `/dentist-elwood` with the Business Profile UTMs and worked
through the site. Full output: `docs/conversion-tracking-test-output.txt`.

**56 of 56 checks passed, 27 desktop and 29 mobile.** In both profiles:

| Action | Result |
| --- | --- |
| Load landing page | No conversion events. UTMs still in the address bar. |
| Tap phone number | One `phone_click`, `page_path=/dentist-elwood`. |
| Tap "Book your visit" | One `booking_click` credited to `/dentist-elwood`; one `spa_page_view` for `/online-booking`. |
| Load `/online-booking`, scroll to widget | One `booking_widget_view`. No `booking_start`. |
| Click inside the widget | One `booking_start`, `booking_method=widget`. |
| Use the widget again, then "open in a new tab" | Still one `booking_start`. |
| Tap email address | One `email_click`. |
| Focus a form field | One `form_start`. |
| Submit with a required field empty | No `form_submit`. No request sent. |
| Submit, server rejects | No `form_submit`. One `form_error`. |
| Submit, server accepts | One `form_submit`. Both forms tested. |
| Search dataLayer for the typed name, email, phone, message | Not found. |
| Sticky call bar on `/emergency-dentist` (mobile) | Visible. One `phone_click`, `link_location=sticky-call-bar`. |
| Full page load later in the visit | `landing_page` still `/dentist-elwood`. |
| "Open it in a new tab" on the new-patient page | One `booking_start`, `booking_method=new_tab`. No `booking_click`. |

Limits of this test:

- It verifies what the site pushes to the dataLayer. It does **not** verify
  that GA4 received anything; GTM was disabled for the run so no test hits
  reached production. That is step 6 above.
- Mobile was Chrome emulating a phone, not a physical device. Detecting
  interaction inside the booking widget relies on browser focus behaviour that
  varies on iOS Safari; `booking_start` should be confirmed on a real iPhone.
- Form submissions were intercepted, so no test enquiry reached the front
  desk.

## Not changed

No URL, redirect, canonical tag, title, heading, schema or page content was
touched.
