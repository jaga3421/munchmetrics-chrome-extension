# 🍔 Munchmetrics

> **Where did your food money actually go?**
> A Chrome extension that turns your **Zomato** and **Swiggy** order history into a year-in-review style dashboard.

- 💸 Total spend, average order, top dishes, peak hunger hours
- 📈 Year-by-year breakdown for Zomato, this-year for Swiggy
- 🔒 100% local - your orders never leave your browser
- 🆓 No account, no signup, no backend

---

## Install (for everyone)

1. Go to [**Releases**](https://github.com/jaga3421/munchmetrics-chrome-extension/releases) and download the latest `munchmetrics-chrome-extension-x.x.x.zip`.
2. **Unzip** it somewhere you won't accidentally delete (e.g. `~/Documents/munchmetrics`).
3. In Chrome, open `chrome://extensions`.
4. Toggle **Developer mode** on (top-right corner).
5. Click **Load unpacked** and pick the folder you just unzipped.
6. The Munchmetrics 🍔 icon shows up in your toolbar. Click the puzzle 🧩 icon if you want to pin it.

> Works on any Chromium browser - Chrome, Brave, Edge, Arc, Opera.

## How to use it

1. **Sign in** to [zomato.com](https://www.zomato.com/login) and/or [swiggy.com](https://www.swiggy.com/auth) in normal browser tabs.
2. **Click the Munchmetrics icon** in your toolbar. Your dashboard opens in a new tab.
3. The Welcome page shows your connection status:
   - **Both connected** → hit "See my food story"
   - **One connected** → you'll see that one's story; log in to the other for the full picture
   - **Neither** → log in to either site, come back, click "Check again"
4. Pick the year you want to look at on Zomato. Swiggy only goes back to the current year (their API doesn't expose older data).
5. Use the **Share** button on the dashboard to download a snapshot card of your year as a PNG.

## Privacy, in one paragraph

Munchmetrics calls Zomato and Swiggy's own order-history APIs **from your own browser**, using the same login cookie you'd use to view your orders manually. The numbers are crunched right inside the extension page and cached in `chrome.storage.local`. There is no Munchmetrics server. There is no analytics. There is no third party. To wipe everything: hit **Start over** in the dashboard, or uninstall the extension.

## Common questions

**Is my login info safe?** Yes - Munchmetrics never sees your password. It only piggybacks on your existing browser session.

**Why does Swiggy only show this year?** Their order-history API stops there. We can't paginate past the current year. Zomato exposes everything, so we can.

**The numbers look wrong / are missing.** Some orders (cancelled ones, gift cards, malformed timestamps) are skipped. Open the dashboard's browser DevTools console and file an issue with what you see.

**Can I use it on Firefox?** Not yet - it's a Chromium MV3 extension. A Firefox port is welcome as a PR.

---

## For developers

### Prerequisites

- **Node 20+** (the build uses modern `babel-loader` which won't run on Node 12/14)
- npm (bundled with Node)
- Chromium-based browser

Using nvm? `nvm install 20 && nvm use 20`.

### Setup

```sh
git clone https://github.com/jaga3421/munchmetrics-chrome-extension.git
cd munchmetrics-chrome-extension
npm install
```

### Build once

```sh
npm run build
```

Output lands in `build/`. Load it in Chrome via **chrome://extensions → Load unpacked → pick `build/`**. After every code change, run `npm run build` again and hit the reload icon on the Munchmetrics card.

### Watch mode

```sh
npm start
```

Runs Tailwind in watch mode + the webpack dev server with HMR. You still load `build/` as unpacked. Popup / options scripts auto-refresh on save. Background-script or `manifest.json` changes still require a manual extension reload.

### Scripts

| Script | What |
|---|---|
| `npm run build` | One-off production build. Outputs `build/` + a versioned `.zip`. |
| `npm start` | Tailwind watch + webpack dev server. |
| `npm run dev` | Just the webpack dev server. |
| `npm run watch:css` | Just Tailwind watch. |
| `npm run bump` | Patch-bump the version in `package.json`. Webpack auto-injects it into the built `manifest.json`. |
| `npm run prettier` | Format all source files. |

### Project layout

```
src/
├── manifest.json              MV3 manifest (action opens options tab)
├── pages/
│   ├── Background/index.js    Service worker - opens options page on icon click
│   └── Options/               The page the user sees (Welcome + Dashboard)
│       ├── Options.jsx        Login checks, Welcome <-> Dashboard switching
│       └── components/        Welcome, DashboardView, charts, etc.
├── hooks/
│   ├── useZomatoScrapper.jsx  Paginates /webroutes/user/orders
│   └── useSwiggyScrapper.jsx  Walks /dapi/order/all
├── helpers/
│   ├── zomato.js              groupByYears, generateYearlyReview, etc.
│   ├── swiggy.js              Same shape for Swiggy
│   └── format.js              fmtInt, fmtINR, orderCost
└── assets/img/                Icons + logo
```

Deep notes (API shapes, render flow, copy style, versioning rule) live in [AGENTS.md](AGENTS.md). Read it before opening a PR.

### Stack

React 18 · Tailwind 3 · Framer Motion · Recharts · Lucide icons · html2canvas · Fraunces + Fredoka + DM Sans · Webpack 5 + Babel.

## License + credit

MIT. Made with hunger by [JJay](https://instagram.com/whereis.the.food). PRs welcome.
