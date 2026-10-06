# cozyblackcabin-website

Static marketing & direct-booking site for **Cozy Black Cabin VT** — a modern black cabin near Mount Ascutney in Brownsville (West Windsor), Vermont.

No build step. Plain HTML/CSS/JS, deployed as a Cloudflare Worker (static assets).

## Structure
```
.
├── index.html      # home page
├── gallery.html    # full photo gallery (lightbox)
├── styles.css      # all styles (design tokens at top)
├── main.js         # nav toggle, year, scroll reveals
├── assets/         # local images, favicon (to be added)
├── _headers        # Cloudflare caching + security headers
├── .assetsignore   # files kept out of the deployed Worker assets
├── robots.txt
└── sitemap.xml
```

## Edit the text
Open `index.html` and change the words between the tags — no tools needed.
Brand colors and fonts live at the top of `styles.css` under `:root`.

## Preview locally
Any static server works, e.g.:
```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy (Cloudflare Workers)
The Cloudflare Worker `cozyblackcabinvt-website` is connected to this GitHub repo, so every push to `main` auto-redeploys.
It serves the repo root as static assets; `.assetsignore` keeps `.git`, `tools/`, etc. from being published.
The canonical site is `https://cozyblackcabinvt.com`; `www` redirects to it (Cloudflare Redirect Rule). Domains are set under the Worker's **Settings → Domains & Routes**.

## To do before go-live
- [ ] Curate which photo goes in each homepage slot (current picks are placeholders).
- [ ] Download original photos into `assets/` and switch image URLs off the old CDN.
- [ ] Drop in 3 real guest reviews on the home page.
- [ ] Add a favicon + an `og:image` hosted in this repo.
- [ ] (Later) Swap the Airbnb button for a direct-booking widget once VT lodging tax is registered.
