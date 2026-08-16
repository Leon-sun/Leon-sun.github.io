# Personal site — Leon Sun

Static HTML/CSS/JS. No build step, no dependencies. Open `index.html` in a
browser and it works. Trilingual: English at the root, French under `fr/`,
Simplified Chinese under `zh/`. Live at https://leon-sun.github.io

## Structure

```
index.html          Home — hero, 3 featured projects, 3 recent posts, short bio
work.html           All case studies
writing.html        Post index
about.html          Long bio, experience/education timelines, toolkit
work/*.html         One page per case study (6)
posts/*.html        One page per post (3 drafts)
posts/_template.html   Copy this to start a new post

fr/                 Full French mirror — same filenames, same structure
zh/                 Full Simplified Chinese mirror — likewise
<lang>/index.html   <lang>/work.html  <lang>/writing.html  <lang>/about.html
<lang>/work/*.html  <lang>/posts/*.html

css/style.css       The entire design system — all tokens at the top
js/main.js          Theme toggle, active nav, scroll reveals, footer year
assets/             Images, résumé PDFs
```

**All three languages use identical filenames.** `about.html` ↔ `fr/about.html`
↔ `zh/about.html`. That is what makes the switcher and the `hreflang` tags
mechanical: every href is derived from the page's own path, so a new page needs
no per-language link table. Keep it that way.

Chinese typography is scoped under `html[lang="zh-Hans"]` in `css/style.css` —
Latin faces stay first in each font stack so embedded English (SQL, Power BI)
keeps the site's Latin type, with looser leading and no negative tracking for
the CJK text.

## Adding a post

1. `cp posts/_template.html posts/my-new-post.html`
2. Edit the `<title>`, the `<meta name="description">`, the `article__meta`
   line, the `<h1>`, and the body.
3. Add an `<li>` at the **top** of the `.post-list` in `writing.html` — copy an
   existing one.
4. Optionally add the same `<li>` to "Recent writing" on `index.html` and drop
   the oldest.
5. Repeat in `fr/` and `zh/` with the same filename, or that page's switcher
   will 404.

### Adding to the four-part series

`programming-the-algorithm` → `what-a-customer-cost` → `nobody-uses-a-black-box`
→ `work-that-leaves-no-artifact` are one series. Each page carries a
`.series-nav` block at the bottom with hand-written prev/next links, so if you
reorder or insert a part you must update the neighbours' links too — there is no
build step to do it for you. The part numbers appear in three places per page:
the `<title>`-adjacent `.article__meta`, the `.series-note` under the `<h1>`,
and the `.series-nav__label`.

## Adding a project

Same pattern: copy any file in `work/`, then add a `.card` block to `work.html`
(and to `index.html` if it should be featured). The `01` / `02` numbering on the
cards is a CSS counter — it renumbers itself, don't hardcode it.

## Restyling

Every colour, font, radius, and spacing value is a CSS custom property in the
`:root` blocks at the top of `css/style.css`. Change `--accent` to change the
site's personality.

The type system is three tokens, and the split is deliberate:

- `--font-display` / `--font-body` — the serif. Headings and all reading text.
- `--font-ui` — the sans. Interface chrome only: nav, wordmark, language
  switch, and the `.kw` keywords in the homepage statement. The keywords are
  sans *because* everything around them is serif — that contrast is the effect,
  so don't unify them.
- `--font-mono` — meta and labels: dates, tags, card numbering, buttons.

To go back to an all-sans site, point `--font-display` and `--font-body` at the
same stack as `--font-ui`.

The homepage opener is `.statement`, not `.hero` — one centred sentence with the
load-bearing words wrapped in `<span class="kw">`. Card placeholders are a warm
tonal plate with the label in serif and a short accent rule; drop in an `<img>`
and `:has(img)` strips the placeholder styling automatically.

Dark-mode values live in **three** places that must stay in sync:
`@media (prefers-color-scheme: dark)`, `:root[data-theme="dark"]`, and
`:root[data-theme="light"]`.

### How the header adapts

One row at every width, with the content that matters most kept visible:

| Width | Behaviour |
| --- | --- |
| > 760px | Everything on one row: wordmark, nav links, EN/FR, GitHub, LinkedIn, theme |
| ≤ 760px | Nav links collapse behind the menu button and drop to a second row when opened. EN/FR and the social icons **stay in the bar** |
| ≤ 420px | Same, with the icons and type stepped down. Verified down to 320px |

The breakpoints are sized against the **French** labels, which are longer than
the English ones — if you test only the English pages you will not see the
tight case.

Three structural gotchas worth knowing before you edit CSS:

- The header breakpoint rules must stay **after** the base `.nav-toggle`
  declaration in the file. Same specificity, so whichever comes last wins — put
  them earlier and the menu button silently disappears on mobile.

- `.article` shares an element with `.wrap` (`class="article wrap"`). It must
  use `padding-block`, never the `padding` shorthand — the shorthand resets the
  horizontal gutter and the text goes flush to the window edge.
- The active-nav script targets `.nav > a` (direct children only) so the
  wrapped `.lang-switch` links aren't mistaken for page links. If you unwrap
  them, EN pages will mark the FR link as the current page.

## Still to do

- [ ] `assets/leon-sun-resume.pdf` — the EN footer links to it on every page
- [ ] `assets/leon-sun-cv-fr.pdf` — same for the FR footer (a French CV is a
      different document, not just a translated filename)
- [ ] Replace the `card__media` placeholders with real cover images
      (`assets/*.jpg`, then uncomment the `<img>` in each card)
- [ ] `assets/portrait.jpg` — swap the placeholder box in both `about.html` files
- [ ] `assets/og-image.png` — then uncomment the `og:image` meta
- [ ] Finish the three post drafts (EN and FR) — each has an outline in place.
      `search-as-a-router` is the one finished piece; the rest still say "Draft"
- [ ] Decide whether to name the company in `search-as-a-router`. The essay says
      "an automotive services platform", but `work/search-relevance.html` and
      `about.html` both name Tuhu — a reader moving between them connects the
      two immediately, so the anonymity is already thin
- [ ] Have a native French speaker read the `fr/` copy before you publish it

## Publishing

Any static host works.

**GitHub Pages** — push to a repo, then Settings → Pages → deploy from `main`.

```bash
git init && git add -A && git commit -m "Personal site" && git branch -M main
```

**Netlify / Vercel / Cloudflare Pages** — drag the folder onto their dashboard,
or connect the repo. No build command; publish directory is the repo root.

Note: the folder name contains a space. Rename it to `personal-site` before you
add a git remote.

## Local preview

```bash
python3 -m http.server 8000
```
