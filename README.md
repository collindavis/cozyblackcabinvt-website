# cozyblackcabin-website

Static marketing & direct-booking site for **Cozy Black Cabin VT** — a modern black cabin near Mount Ascutney in Brownsville (West Windsor), Vermont.

No build step. Plain HTML/CSS/JS, deployed on Cloudflare Pages.

## Structure
```
.
├── index.html      # home page
├── gallery.html    # full photo gallery (lightbox)
├── styles.css      # all styles (design tokens at top)
├── main.js         # nav toggle, year, scroll reveals
├── assets/         # local images, favicon (to be added)
├── _headers        # Cloudflare Pages caching + security headers
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

## Deploy (Cloudflare Pages)
1. Push this repo to GitHub (`cozyblackcabin-website`).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick this repo. **Build command:** *(leave blank)* · **Output directory:** `/` (root).
4. Deploy. Cloudflare gives you a `*.pages.dev` URL.
5. Add the custom domain `www.cozyblackcabinvt.com` under the project's **Custom domains** tab and follow the DNS prompt.

Every `git push` to the main branch auto-redeploys.

## To do before go-live
- [ ] Curate which photo goes in each homepage slot (current picks are placeholders).
- [ ] Download original photos into `assets/` and switch image URLs off the old CDN.
- [ ] Drop in 3 real guest reviews on the home page.
- [ ] Add a favicon + an `og:image` hosted in this repo.
- [ ] (Later) Swap the Airbnb button for a direct-booking widget once VT lodging tax is registered.
