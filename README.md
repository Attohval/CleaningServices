# Cleaning services website

A responsive, multi-page static website built with HTML, CSS and vanilla JavaScript. It has no build step or application framework.

## Preview locally

You can open `index.html` directly in a browser. For a local HTTP preview, run a static server from this folder, for example:

```powershell
py -m http.server 8000
```

Then open <http://localhost:8000>. Stop the server with `Ctrl+C`.

## Project structure

```text
index.html                 Home
services.html              Domestic and commercial cleaning
about.html                 About and approach
areas.html                 Service-area information
faq.html                    Frequently asked questions
contact.html               Enquiry form and contact details
privacy.html               Draft privacy notice; noindex until reviewed
css/style.css              Shared responsive design system
js/config.js               Central business and form configuration
js/main.js                 Shared navigation and contact configuration
js/contact-form.js         Enquiry validation and provider submission
images/                    Locally stored, licensed photography
assets/favicon.svg         Site favicon
robots.txt                 Crawler guidance
sitemap.xml                Sitemap template
```

## Configure before launch

Edit `js/config.js` to supply verified details:

- Replace `companyName`, `phone`, `email`, `locations`, `address`, `openingHours`, social links and `websiteDomain`.
- Confirm the exact service categories before changing `services`. The enquiry form offers only categories configured there.
- Set `formEndpoint` to the public HTTPS endpoint supplied by the selected form provider (for example, a configured Formspree form endpoint). This endpoint is public configuration, not a secret API key.
- Set `websiteDomain` to the production HTTPS origin (for example, `https://www.example.co.uk`) and set `allowIndexing` to `true` only for production. Pages default to `noindex,nofollow`; the privacy page remains `noindex`.
- Update `robots.txt` and every `YOUR-DOMAIN.example` URL in `sitemap.xml` to the actual canonical domain.
- Canonical and Open Graph URL tags are populated from `websiteDomain`.
- Replace the generic brand mark/name where appropriate and supply approved business imagery if preferred.

The form is intentionally disabled while no valid HTTPS endpoint is configured. It validates required fields, preserves user input on provider/network errors, and only reports success after the provider responds successfully. Requests time out after 20 seconds. Its honeypot is basic spam reduction, not guaranteed bot protection.

The supplied photographs are downloaded from Unsplash and stored locally so the site does not hotlink to image files at runtime. Their Unsplash image IDs are `photo-1600210492486-724fe5c67fb0`, `photo-1600607687939-ce8a6c25118c`, `photo-1497366754035-f200968a6e72` and `photo-1581578731548-c64695cc6952`. Verify each image’s source and licensing before production use; replace any image that cannot be verified or approved. Fonts use local system families; the site does not request fonts from a third party.

### Form provider setup

1. Select a provider and review its current service limits, privacy terms, data location, retention behaviour and any applicable charges.
2. Create the form in that provider and verify that notifications go to the correct business inbox.
3. Put its public form endpoint in `formEndpoint`; never add a private API key to these public files.
4. Deploy to a staging URL, submit a real test enquiry and confirm delivery in the intended inbox.
5. Confirm failure behaviour by temporarily using an invalid endpoint, then restore the correct endpoint.
6. Complete the privacy notice with the business identity, contact details, lawful basis, provider, retention period and data-rights contact before enabling submissions.

## Deployment and domain

The site can be hosted by any static hosting service that serves HTML files and supports custom domains and HTTPS (for example, GitHub Pages, Netlify, Cloudflare Pages or Azure Static Web Apps). No backend is included. Configure the hosting provider with this folder as the site root, connect the client-owned domain using the provider’s instructions, enable HTTPS, and test the deployed pages and form. Update DNS only after confirming the client owns or controls the domain.

The sitemap and on-page metadata provide a technical starting point; they do not guarantee search rankings.

## Before launch

- [ ] Confirm the company’s trading/legal name, approved logo/branding and domain.
- [ ] Confirm phone, email, opening hours, social profiles and service locations.
- [ ] Confirm which specific cleaning services may be advertised.
- [ ] Review all copy, photography rights and image descriptions.
- [ ] Configure and test a real form endpoint and destination inbox.
- [ ] Complete and review the privacy notice with the actual data practices and provider.
- [ ] Replace the sitemap and robots domain placeholders.
- [ ] Set the verified canonical production URL and enable indexing only on production.
- [ ] Test navigation, form validation, focus states, keyboard operation and page layout at 320, 375, 390, 768, 1024 and 1440 pixels.
- [ ] Test mobile menu, HTTPS, deployed links, form delivery, browser console and image loading on the live site.
- [ ] Verify no unsupported claims, unapproved services or development placeholders remain.

## Maintenance and handover

Keep business details and confirmed services in `js/config.js`; page content and service-area explanations live in their respective HTML files. Review provider terms, privacy wording, links, supported browsers and image licensing when making changes. Back up the deployed source and retain access to the domain, hosting and form-provider accounts with the business.

There are no project dependencies or mandatory subscriptions. A selected form provider, hosting plan, domain registration, premium imagery or email service may have its own limits or recurring costs; verify those with the vendor. No deployment, inbox delivery, legal review or performance score has been claimed or tested by this project.
