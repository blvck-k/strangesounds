# Aepax Engineering — Authoring Guide

A practical guide to editing the Aepax Engineering website: what each file does, how to add content, change copy, swap images, add new sections, and avoid common mistakes.

This guide assumes basic familiarity with HTML and CSS. You don't need a build step — every change is a plain text edit and a save.

---

## 1. File map

```
aepax-site/
├── index.html      ← all page content (HTML structure)
├── styles.css      ← all visual styling (colors, layout, animations)
├── script.js       ← interactive behaviour (nav, theme, reveals, etc.)
└── assets/         ← images, flyers, and the logo
    ├── aepax-logo.png        ← stamp mark used in the nav (transparent background)
    ├── aepax-favicon.png     ← browser-tab icon
    ├── aepax-icon-180.png    ← iOS home-screen icon (white background)
    ├── aepax-logo-master.jpg ← the full original logo lock-up (mark + wordmark)
    └── …flyer images
```

| File | What goes in it | What does NOT go in it |
|---|---|---|
| `index.html` | Sections, text, links, images, buttons | Colors, spacing, fonts (those live in CSS) |
| `styles.css` | All visual design | Content, copy, or anything users read |
| `script.js` | Behaviour: toggles, scroll effects | Visual design (use CSS) |
| `assets/` | Images, PDFs, downloadable files | Anything not directly served to the browser |

**Rule of thumb:** if you're changing what the page *says*, edit `index.html`. If you're changing how it *looks*, edit `styles.css`.

---

## 2. The design system

### Colors (defined in `styles.css` at the top)

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--bg` | white | near-black | Page background |
| `--bg-alt` | warm grey | dark green-grey | Alternating section backgrounds |
| `--bg-dark` | deep forest | deepest black | Contact section, footer |
| `--bg-elev` | white | lifted dark | Cards, panels, the nav |
| `--forest` | `#14532d` | brightened green | Primary brand color, buttons |
| `--gold` | `#d4a017` | `#e8be3f` | Accent — never overuse |
| `--ink` | near-black | near-white | Headings |
| `--text` | dark grey | light grey | Body copy |
| `--muted` | medium grey | medium grey | Secondary text, labels |
| `--line` | light grey | dark grey | Dividers |

**Always use the tokens, never hardcode colors.** `color: var(--forest)` is right; `color: #14532d` is wrong. Tokens auto-switch with dark mode.

### Typography

- **`IBM Plex Sans`** — body, headings, everything readable.
- **`IBM Plex Mono`** — labels, numbers, IDs, technical metadata. Used via the `.label` and `.section-head-num` classes.

To make text use the mono engineering style: add `class="label"` or wrap in a class that uses `font-family: var(--font-mono)`.

### Spacing

Sections use `padding: clamp(4rem, 8vw, 6.5rem) 0`. This means: 4rem on small screens, growing fluidly to 6.5rem on large screens. Don't fight the system — copy the pattern from existing sections.

### Animation primitives

In `styles.css`:

```css
--ease-out: cubic-bezier(0.22, 0.61, 0.36, 1);
--t-fast: 0.18s;
--t-med:  0.35s;
--t-slow: 0.6s;
```

When adding transitions, use these instead of inventing new durations. Consistency over cleverness.

---

## 3. Daily edits — common changes

### Change a phone number or email

Find in `index.html`:

```html
<a class="contact-row" href="tel:+260967355883">
  ...
  <div class="contact-row-value">+260 967 355 883</div>
```

Update **both** the `href` (machine-readable, no spaces or dashes) **and** the displayed text. Same pattern for `mailto:` links.

### Change body copy

Search for the text in `index.html`, replace it. That's it.

### Update the hero headline

Find:

```html
<h1>Full-spectrum engineering, delivered with <span class="accent">global rigour</span> and deep local understanding.</h1>
```

The `<span class="accent">` styles the wrapped words in brand green. Use it sparingly — one accent per headline.

### Update the at-a-glance stats

Find `<aside class="hero-stats">`. Each stat is a `.stat-row`. The number animates on page load. Update both the label and the `.stat-val` value. Keep numbers short (e.g. `05`, `360°`, `01`) — they're styled large.

### Update the JSON-LD (structured data)

In the `<head>` of `index.html`, there's a `<script type="application/ld+json">` block. Update the phone number, email, URL, and description here whenever they change on the site itself, or Google's knowledge panel will go stale.

---

## 4. Adding content to existing sections

### Add a service line item

In `index.html`, find the relevant `<article class="service">` (Civil, Electrical, etc.). Each bullet is a `<li>` inside the `<ul>`. Add a new one:

```html
<li>Your new service line</li>
```

That's all. The dash bullet, spacing, and color come from CSS automatically.

### Add a principle (About section)

Find `<div class="principles reveal stagger">`. Copy one of the four existing `.principle` blocks and paste it as a new sibling:

```html
<div class="principle">
  <span class="principle-num">05</span>
  <h3>Your principle title</h3>
  <p>One or two sentences describing it.</p>
</div>
```

Update the number. The grid will reflow automatically — 4 columns on wide screens, fewer on narrow ones. Don't add a sixth without checking how it looks; the layout looks best with 3, 4, or 6 (so the rows fill evenly).

### Add a workflow phase (Approach section)

Find `<div class="steps reveal stagger">`. Copy a `<div class="step">` and edit. **Important:** the grid is currently set to `grid-template-columns: repeat(4, 1fr)`. If you add a 5th step, the layout breaks. To allow more steps, change that rule in `styles.css`:

```css
/* Old */
.steps { grid-template-columns: repeat(4, 1fr); }

/* New, for any number */
.steps { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
```

### Add a new downloadable flyer

Three steps. Flyer previews load a **small, low-quality thumbnail** for speed, and open the **full-resolution image in a lightbox** when clicked.

**Step 1 — add the files.** Drop the full-resolution flyer into `assets/`. Use a clear filename, no spaces: `aepax-civil-flyer.jpg`, not `Civil Flyer Final v2.jpg`.

**Step 2 — make a thumbnail.** Create a small JPEG of the same image (roughly 720px on its long edge, quality ~58). This is what visitors see in the card; the full image only loads on click. The repo's thumbnails were generated with this Python snippet (needs `pip install Pillow`):

```python
from PIL import Image
im = Image.open('assets/aepax-civil-flyer.jpg').convert('RGB')
w, h = im.size
s = min(1.0, 720 / max(w, h))
im.resize((int(w*s), int(h*s)), Image.LANCZOS).save(
    'assets/aepax-civil-flyer-thumb.jpg', 'JPEG', quality=58, optimize=True, progressive=True)
```

**Step 3 — add the markup.** Copy an existing `<article class="flyer">` block in the Resources section and edit:

```html
<article class="flyer">
  <button class="flyer-preview flyer-preview-btn" type="button"
          data-hd="assets/aepax-civil-flyer.jpg"
          data-caption="Civil capability brief · A4"
          aria-label="View civil capability brief in HD">
    <span class="flyer-spec">DOC.04 · A4 · JPG</span>
    <img src="assets/aepax-civil-flyer-thumb.jpg" width="480" height="720"
         alt="Civil engineering capability brief preview" loading="lazy" decoding="async" />
    <span class="flyer-hd-badge"><!-- magnify icon SVG --> View HD</span>
  </button>
  <div class="flyer-body">
    <span class="flyer-tag">Civil · Capability brief</span>
    <h3>Civil engineering capabilities</h3>
    <p>Short description of what's in the flyer.</p>
    <div class="flyer-downloads">
      <a class="flyer-dl" href="assets/aepax-civil-flyer.jpg" download="Aepax-Civil-Brief.jpg">
        <!-- download icon SVG -->
        Download
      </a>
    </div>
  </div>
</article>
```

Key things:
- `data-hd` points at the **full-resolution** image (what opens in the lightbox); `<img src>` points at the **thumbnail**. Don't mix them up — that's the whole optimization.
- Always set `width` and `height` on the thumbnail `<img>` to match its real pixel size. This reserves space so the page doesn't jump while images load.
- `download="Aepax-Civil-Brief.jpg"` forces a clean download filename regardless of how the file is stored.
- `loading="lazy"` and `decoding="async"` keep off-screen images from blocking the page. Always include them.

### Add a contact channel

Find `<div class="contact-channels">`. Copy an existing `<a class="contact-row">` and edit. Each row has three parts in this order: a leading **icon** (`.contact-row-icon`), the **label + value**, and a trailing **arrow** (`.contact-row-arrow`). Keep all three. Swap the leading icon SVG to match the channel. Use the right URL scheme:

- Phone: `tel:+260967355883`
- Email: `mailto:hello@aepaxengineeringltd.com`
- WhatsApp: `https://wa.me/260967355883` (international, no `+`)
- Website: `https://...`
- LinkedIn: `https://linkedin.com/company/...`

### Turn on the contact form

The contact section has a working form. Out of the box it **opens the visitor's email app** with their message pre-filled (zero setup). To instead receive submissions silently in your inbox:

1. Get a free access key at [web3forms.com](https://web3forms.com/) (just enter the email where you want messages delivered).
2. In `index.html`, find the form's hidden field `<input type="hidden" name="access_key" value="YOUR_WEB3FORMS_KEY" />` and replace `YOUR_WEB3FORMS_KEY` with your key.

That's it — the form now POSTs to Web3Forms and shows an inline success message. The fallback email used when no key is set lives in the form's `data-fallback-email` attribute.

### Replace the logo / favicon

The logo (the green stamp mark) appears in three wired-up places:

- **Nav brand** — `<img class="brand-mark" src="assets/aepax-logo.png" …>` near the top of `index.html`. Sized by `.brand-mark` in `styles.css` (height only — width scales automatically).
- **Browser tab** — `<link rel="icon" type="image/png" href="assets/aepax-favicon.png" />` in the `<head>`.
- **iOS home screen** — `<link rel="apple-touch-icon" href="assets/aepax-icon-180.png" />`.

The full original artwork (mark + "ÆPax Engineering" wordmark) is kept as `assets/aepax-logo-master.jpg`. The three icons above were cropped from it to **just the stamp** — the nav already shows the wordmark as text next to the mark, so repeating it in the image would be redundant.

To swap in a new logo: replace `aepax-logo.png` (use a **transparent** PNG so it works in dark mode), `aepax-favicon.png` (square), and `aepax-icon-180.png` (180×180, solid background — iOS dislikes transparency). Keep the filenames and everything updates automatically.

---

## 5. Adding a brand new section

The site uses a consistent section pattern. Here's a template you can copy. Place it inside `<main id="main">` between two existing sections.

```html
<!-- NEW SECTION -->
<section class="my-new-section" id="my-section-id">
  <div class="container">
    <div class="section-head">
      <div class="section-head-meta">
        <span class="section-head-num">06 / Section Name</span>
        <span class="label">Subtitle here</span>
      </div>
      <div>
        <h2 class="section-title">The main heading of the section.</h2>
        <p class="section-sub">
          One or two sentences of context.
        </p>
      </div>
    </div>

    <div class="reveal">
      <!-- Section content here -->
    </div>
  </div>
</section>
```

Then add the styling in `styles.css`:

```css
.my-new-section {
  /* Pick an alternating background:
     - var(--bg)     for plain white (or dark grey in dark mode)
     - var(--bg-alt) for subtle off-white  */
  background: var(--bg-alt);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
```

Finally, add the section to the nav in `index.html`:

```html
<li><a href="#my-section-id">My Section</a></li>
```

The scroll-spy in `script.js` will automatically highlight your new link when the section is in view. No code change needed.

**Naming conventions:**
- Section `id` should be lowercase, hyphen-separated: `projects`, `case-studies`, `team`.
- Section number (`06 /`) reflects reading order — update siblings if you insert in the middle.

---

## 6. Common patterns to copy

### A clean two-column block

```html
<section id="something">
  <div class="container">
    <div class="section-head">
      <div class="section-head-meta">
        <span class="section-head-num">XX / Name</span>
        <span class="label">Topic</span>
      </div>
      <div>
        <h2 class="section-title">Heading</h2>
        <p class="section-sub">Description.</p>
      </div>
    </div>
    <!-- ...content... -->
  </div>
</section>
```

### A grid of cards (like services)

```html
<div class="my-grid reveal stagger">
  <article class="my-card">…</article>
  <article class="my-card">…</article>
  <article class="my-card">…</article>
</div>
```

In CSS:

```css
.my-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 0;
  border: 1px solid var(--line);
  background: var(--bg-elev);
}
.my-card {
  padding: 1.75rem 1.6rem 2rem;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
```

The `.stagger` class makes child cards fade in one after the other as you scroll. The `.reveal` class triggers the animation when the container enters the viewport. Use them together on grid containers, individually on standalone elements.

### A call-to-action button

Primary (green, filled):
```html
<a class="btn btn-primary" href="#contact">
  Get in touch
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
</a>
```

Secondary (outlined):
```html
<a class="btn btn-secondary" href="...">…</a>
```

---

## 7. Images

### Where to put them
Always in `assets/`. Reference them with a relative path:
```html
<img src="assets/your-image.jpg" alt="Description" loading="lazy" />
```

### Always add `alt` text
Describe what's in the image, briefly. For decorative images that add no information, use `alt=""`.

### Always add `loading="lazy"`
Tells the browser not to download the image until the user scrolls near it.

### Use the right format
- **Photos** → `.jpg` (compressed)
- **Logos, diagrams, illustrations** → `.svg` (scalable, tiny)
- **Screenshots, mixed content** → `.png` (lossless)
- **Modern alternative** → `.webp` (smaller than JPG/PNG, supported everywhere now)

### Compress before uploading
Big images slow the site. Use [squoosh.app](https://squoosh.app) or [tinypng.com](https://tinypng.com) before adding. A 2 MB photo can usually become 200 KB with no visible quality loss.

---

## 8. Dark mode considerations

Every new element automatically adapts to dark mode **if you use the color tokens**. If you hardcode a color, it stays the same in both modes — which usually looks wrong in dark mode.

Test by clicking the sun/moon icon in the nav. If something looks wrong in dark mode, find the offending CSS rule — it's almost always a hardcoded `#fff`, `#000`, or hex value that should be a `var(--something)`.

---

## 9. Animations — guidelines

The site has these animations built in:
- Hero content fades in on load (cascaded).
- Sections fade in as you scroll (via `.reveal` class).
- Grid children stagger in (via `.stagger` class).
- Buttons lift slightly on hover.
- Cards lift and shadows soften on hover.
- The "Active" status dot pulses gently.
- The scroll-progress bar fills as you scroll.
- The hero stats count up on first load.

**To add animations to your own content:**

| Want | Add this class to | Notes |
|---|---|---|
| Element fades in as you scroll | `class="reveal"` | Single element |
| Container's children stagger in | `class="reveal stagger"` | Add to parent only |
| Element should never animate | Nothing — leave it alone | Default |

**Don't:**
- Animate everything. Less is more.
- Add long durations (> 0.8s). Feels slow.
- Animate on hover and on scroll for the same property — they fight.

Everything respects `prefers-reduced-motion: reduce` automatically. Users who set "Reduce motion" in their OS will see no animations — don't add any that ignore this.

---

## 10. Accessibility checklist for new content

Before publishing any change, run through this:

- [ ] Every image has `alt` text (or `alt=""` if decorative).
- [ ] Every link's text describes where it goes ("Read the case study", not "Click here").
- [ ] Headings step down logically: `<h1>` → `<h2>` → `<h3>`, no skipping.
- [ ] Color isn't the only way you convey information.
- [ ] Buttons are `<button>` or `<a>`, never `<div onclick>`.
- [ ] New interactive elements work with keyboard only (test by tabbing through).
- [ ] Text contrast is sufficient — body text against background must be at least 4.5:1. Use [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/).

---

## 11. Before publishing — pre-flight checklist

1. **Test in light AND dark mode.** Click the toggle.
2. **Test on mobile.** Resize browser narrow, or use DevTools device emulation.
3. **Test the contact links.** Click each — phone opens dialer, email opens mail client, etc.
4. **Test the downloads.** Click each flyer download — does it save with the right filename?
5. **Tab through the page.** Use only the keyboard. Can you reach every link and button? Is the focus ring visible?
6. **Print preview.** `Ctrl/Cmd + P`. Does it print cleanly without the nav, theme toggle, or back-to-top button?
7. **Validate HTML.** Paste your code into [validator.w3.org](https://validator.w3.org/#validate_by_input). Fix any errors.
8. **Check on a real phone.** Looks different from desktop dev tools.

---

## 12. Things to consider adding later

These weren't included in the current site but would be natural next steps:

### High value
- **Projects / Case studies section.** A grid of past projects with one image, a title, location, and capability tags. Major credibility builder.
- **Connect the contact form to your inbox.** The contact section already has a working form (see "Turn on the contact form" in section 3). Until you add a [Web3Forms](https://web3forms.com/) key it falls back to opening the visitor's email app — adding the key (5 minutes) makes submissions land silently in your inbox.
- **Branded email address.** `hello@aepaxengineeringltd.com` reads more professional than a personal gmail. Setup is one-time via your domain registrar.
- **Team section.** Photos and short bios of key engineers. Helps tenders and trust-building.

### Medium value
- **Testimonials / client logos.** Even 3–4 named clients with a one-line quote does a lot.
- **A blog / insights section.** Position the firm as expert; helps SEO. Doesn't need to be huge — one post a month is plenty.
- **Sector-specific landing pages.** `/solar`, `/mining`, `/infrastructure` — each with content tuned to that audience.
- **Multi-language support.** If you serve French-speaking markets (DRC, etc.), an `en` / `fr` toggle.

### Polish
- **A real `404` page.** Currently a missing URL shows the host's default. Adding `404.html` is good practice.
- **A sitemap.xml and robots.txt** for SEO.
- **Web manifest** for "Add to Home Screen" support on mobile.
- **Analytics.** Plausible, Fathom, or GA4 — to understand who visits and which flyers get downloaded.

---

## 13. Where things live — quick reference

| I want to change... | Edit this file | Search for |
|---|---|---|
| The headline | `index.html` | `<h1>` |
| The five services and their bullets | `index.html` | `<article class="service">` |
| Phone numbers and email | `index.html` | `contact-row` |
| Brand colors | `styles.css` | `:root {` |
| Animation speed | `styles.css` | `--t-med` |
| The scroll-progress bar color | `styles.css` | `.scroll-progress` |
| Back-to-top button position | `styles.css` | `.to-top` |
| Theme toggle behaviour | `script.js` | `initTheme` |
| Active nav link behaviour | `script.js` | `initScrollSpy` |
| Stat count-up animation | `script.js` | `initCountUp` |
| Favicon | `index.html` | `rel="icon"` |
| SEO description | `index.html` | `name="description"` |
| Social share card | `index.html` | `property="og:` |
| Search engine data | `index.html` | `application/ld+json` |

---

## 14. Hosting and publishing

The site is fully static — no server, no database, no build step. To put it online, just upload the whole folder (`index.html`, `styles.css`, `script.js`, and `assets/`) to any host.

Recommended options:
- **Netlify** (drag and drop the folder; free; auto-HTTPS).
- **GitHub Pages** (free; commit to a repo and enable Pages in settings).
- **Cloudflare Pages** (free; similar to Netlify).
- **Any web host** with a "public_html" folder.

After uploading:
1. Update the `canonical` and `og:url` and `og:image` URLs in `index.html` to match your actual domain.
2. Update the JSON-LD `url` and `logo` to match.
3. Test the live site — sometimes paths that work locally don't work in production (case sensitivity, etc.).

---

## 15. If something breaks

| Symptom | Likely cause | Where to look |
|---|---|---|
| Whole page is white / blank | HTML syntax error | Open browser DevTools (F12) → Console |
| Styles look broken | CSS syntax error, or wrong file path | Check `<link rel="stylesheet" href="styles.css">` |
| Interactivity (toggles) not working | JS error | Browser DevTools → Console tab |
| Images not loading | Wrong filename or path | Check the `src` attribute matches the actual file in `assets/` |
| Dark mode flashes white on load | Inline theme script was removed | The `<script>` block in `<head>` is critical, leave it alone |
| Nav active state doesn't work | Section `id` doesn't match nav `href` | Both must be lowercase and identical |

When in doubt: **make one change at a time**, save, refresh, see what happened.

---

*Last updated: alongside the site itself. Keep this file in version control next to the website.*
