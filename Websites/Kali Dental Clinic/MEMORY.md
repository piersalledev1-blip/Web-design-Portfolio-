# KALI Dental Clinic — Project Memory

Last updated: 2026-10-30

## Goal
Build a polished, responsive multi-page site for KALI Dental Clinic, using
`preview.html` as the visual and structural reference. Shared styling and
behaviour live in `style.css` and `script.js`.

## Source files
- `preview.html` — design reference (do not edit).
- `instructions.txt` — homepage, about, and services requirements.
- `000-info.txt` — Ghana dental booking research; use for trust/content ideas.
- `assets/` — all real image assets. Reference as `assets/<file>` (not `images/`).
- `index.html`, `style.css`, `script.js` — existing shared files to build on.

## Pages
- `index.html` — homepage (required).
- `services.html` — services catalogue (required).
- `about.html` — clinic/about page (required).
- `contact.html` — placeholder page with clinic detail placeholders.
- `track-booking.html` — clearly marked placeholder; no fake tracking.
- `dashboard.html` — clearly marked placeholder; no fake auth/dashboard.

## Design tokens (from preview.html)
- Deep forest green `#173d32`, dark `#102e26`
- Muted sage `#a7bba8`, sage light `#e8eee7`
- Warm ivory `#f8f7f1`, white `#ffffff`
- Text `#26342d`, muted `#6d7770`, border `#e8eae5`
- Headings: Playfair Display, 500–700
- Body: DM Sans, 400–700
- Buttons: 5px radius, green primary, outline secondary
- Cards: 12px radius, subtle borders/shadows
- Keep animations restrained; respect reduced-motion.

## Image usage map (avoid repeating dental photos)
Homepage:
- `assets/hero.png` — hero
- `assets/logo.png` — navbar/footer logo
- `assets/dental-consultation.png` — consultation service card
- `assets/teeth-cleaning.png` — cleaning service card
- `assets/tooth-filling.png` — filling service card
- `assets/teeth-whitening.png` — whitening service card
- `assets/dental-crowns.png` — why-choose-us visual
- `assets/childrens-dental-care.png` — about preview visual

Services page:
- `assets/tooth-extraction.png` — tooth extraction feature card
- `assets/root-canal.png` — root canal feature card
- `assets/braces.png` — braces consultation feature card
- Remaining services use clean icon/text cards (no repeated photos).

About page:
- No procedure photos. Text-led layout with editable team placeholders,
  per the image-reuse rules.

Unused images: none after the above (all 10 service images + hero/logo are used).

## Decisions
- Use `assets/` paths because that is where the real files are.
- Shared navbar/mobile menu/footer across all pages; active link via
  `aria-current="page"`.
- Booking links are placeholders: `href="#"` + `data-booking-link`; JS shows a
  clear "online booking coming soon" toast instead of faking a booking flow.
- Clinic address, phone, hours, team names, qualifications, and testimonials
  remain editable placeholders. Do not invent them.
- No prices, no backend, no auth, no payments.
- Placeholder pages exist so required navigation links do not 404.
- Mobile menu raises the navbar stacking context while open so the close toggle
  stays clickable, and JS returns focus to the toggle when the menu closes.
- Logo PNG has large transparent padding. Nav/footer logos use a wider
  `object-fit: cover` box so the visible mark renders much larger without
  editing the source asset.
- Navbar spans the full viewport width with fluid side padding, so the logo sits
  at the far left instead of inside the centered 1200px content container.
- Image map (all in assets/): tooth-extraction.png, root-canal.png, braces.png,
  dental-consultation.png, teeth-cleaning.png, tooth-filling.png,
  teeth-whitening.png, dental-crowns.png (also used for bridges), childrens-dental-care.png, hero.png, logo.png.
- Services page: editorial sidebar + ordered service rows with images for all 10
  services (bridges reuse dental-crowns with object-position). No duplicate hero
  photo cards.
- About page: dark hero panel with quote + rail of approach steps (1–5) and
  numbered values ledger; experience as a track; less generic card grid.
- Contact page: compact centred hero distinct from other inner pages.
- Footer credit: "Designed by Abrantyie Digital".

## Build status
- Built: `index.html`, `services.html`, `about.html`, `contact.html`,
  `track-booking.html`, `dashboard.html`.
- Shared: `style.css` (full design system + page components), `script.js`
  (mobile menu, toast, smooth anchors, year).
- Homepage uses 6 content images plus the logo. Services uses the 3 remaining
  service images. About is deliberately text-led with no procedure photos.
- All 10 services have descriptions, IDs for deep links, and a Book Appointment
  button. No prices or invented services.

## Verification checklist
- [x] All pages load locally via `python3 -m http.server`.
- [x] All referenced `assets/` images load (naturalWidth > 0) and have alt text.
- [x] No repeated procedure photos across pages; logo repeat is brand only.
- [x] Mobile menu opens/closes; Escape closes; resize resets; toggle remains
  clickable above the open overlay.
- [x] No horizontal overflow at 320px, 360px, 390px, 500px, 768px, 1024px,
  1440px (tested with headless Firefox + same-origin iframe for true mobile
  widths).
- [x] Every internal nav/footer link and cross-page anchor resolves.
- [x] `node --check script.js` passes; no broken images; CSS braces balanced.
- [x] Booking placeholder toast displays the coming-soon message.

## Remaining real-clinic information to supply
- Clinic address and map/directions.
- Phone/WhatsApp number and email.
- Opening hours.
- Dentist/team names, roles, qualifications, photos.
- Genuine patient testimonials.
- Real booking system destination.

