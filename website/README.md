# Jivan Urja redesign

Next.js App Router, TypeScript, Tailwind CSS 4, and Lucide icons. All six existing public routes are retained, with original service information, testimonials, doctor credentials, contact details, and legal text.

## Run

Node.js 22 or newer is recommended.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. `npm run build` creates the static production website in `out/`. Serve this directory with any static web host. `npm start` is not used for a static export.

## Enquiries

The original website uses `/send-email.php`; its backend source and credentials were not provided. By default, forms validate input and prepare an explicit WhatsApp handoff to the clinic’s existing number. Nothing is sent until the visitor reviews and sends it in WhatsApp. No appointment confirmation is fabricated. No health details are stored in browser storage.

To restore API delivery, configure `NEXT_PUBLIC_ENQUIRY_ENDPOINT` before building. The API must accept JSON, allow the deployed origin, validate input, enforce rate limits, deliver the enquiry, and return `{"success":true}` only after receipt. Map the descriptive form keys to the clinic’s backend schema. Do not connect an endpoint without checking that schema.

## Content & assets

Existing public content and clinic imagery were copied from https://www.jivanurja.com/ on 3 October 2026. Legal HTML is stored locally in `lib/imported-content.json`, with original styling and scripts removed. The source site’s claims, testimonials, dates, and credentials are preserved; this redesign does not independently verify them.

Routes: `/`, `/about-us/`, `/contact-us/`, `/request-consultation/`, `/privacy-policy/`, `/terms-and-conditions/`.

Accessibility includes semantic landmarks, a skip link, labelled controls, visible keyboard focus, keyboard-operable FAQs, responsive mobile navigation, and reduced-motion support.
