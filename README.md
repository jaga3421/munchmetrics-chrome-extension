# Munchmetrics

> Where did your food money actually go?

A Chrome extension that turns your **Zomato** and **Swiggy** order history into a year-in-review style dashboard. Total spend, top cravings, peak hunger hours, the dish you order way too often.

Everything runs locally in your browser. Your orders never leave your machine - no server, no telemetry, no account needed.

![Munchmetrics dashboard preview](src/assets/img/logo-big.svg)

## Install (for users)

1. Download the latest `munchmetrics-chrome-extension-<version>.zip` from [Releases](https://github.com/jaga3421/munchmetrics-chrome-extension/releases) and unzip it.
2. Open Chrome and go to `chrome://extensions`.
3. Toggle **Developer mode** on (top right).
4. Click **Load unpacked** and pick the unzipped folder.
5. Pin the Munchmetrics icon to your toolbar.
6. Sign in to [zomato.com](https://www.zomato.com/login) and/or [swiggy.com](https://www.swiggy.com/auth) in regular tabs.
7. Click the Munchmetrics icon - your dashboard opens in a new tab.

### How it works

Munchmetrics calls Zomato and Swiggy's own order-history APIs using the session cookie that's already in your browser. Your data is processed entirely in the extension page and cached in `chrome.storage.local`. There is no backend.

## Dev setup

### Requirements

- **Node 20+** (the build uses modern `babel-loader` which needs `fs/promises` and won't run on Node 12/14)
- npm (bundled with Node)
- Chrome / Chromium / Edge

If you use `nvm`:

```sh
nvm install 20
nvm use 20
```

### First time

```sh
git clone https://github.com/jaga3421/munchmetrics-chrome-extension.git
cd munchmetrics-chrome-extension
npm install
```

### Build once

```sh
npm run build
```

Output lands in `build/`. Then in Chrome:

1. `chrome://extensions` -> enable **Developer mode**
2. **Load unpacked** -> select the `build/` folder
3. The icon appears in your toolbar.

After any code change: re-run `npm run build` and click the reload icon on the Munchmetrics card in `chrome://extensions`.

### Watch mode

```sh
npm start
```

Runs Tailwind in watch mode + `webpack-dev-server` with HMR on `:3000`. You still load `build/` as **unpacked**. Popup, options, and content scripts auto-refresh on save. Background-script and `manifest.json` changes still require a manual extension reload.

### Other scripts

| Script | What it does |
|---|---|
| `npm run build` | One-off production build. Outputs `build/` and a versioned `.zip`. |
| `npm start` | Tailwind watch + webpack dev server. |
| `npm run dev` | Just webpack dev server (no CSS watch). |
| `npm run watch:css` | Just Tailwind watch. |
| `npm run bump` | Patch-bump the version in `package.json` (e.g. `3.0.6` -> `3.0.7`). Webpack injects this into the built `manifest.json` automatically. |
| `npm run prettier` | Format all source files. |

## Project layout

```
src/
├── manifest.json              MV3 manifest (action opens options tab)
├── pages/
│   ├── Background/index.js    Service worker - opens options page on icon click
│   ├── Options/               The page the user actually sees (login + dashboard)
│   │   ├── Options.jsx        Orchestrator - login checks, Welcome <-> Dashboard
│   │   └── components/        Welcome, DashboardView, charts, etc.
│   ├── Popup/                 Legacy popup (no longer wired to the toolbar)
│   └── Content/               Content script (no-op today)
├── hooks/
│   ├── useZomatoScrapper.jsx  Paginates Zomato /webroutes/user/orders
│   └── useSwiggyScrapper.jsx  Walks Swiggy /dapi/order/all with cursor pagination
├── helpers/
│   ├── zomato.js              groupByYears, generateYearlyReview, etc.
│   ├── swiggy.js              Same shape, for Swiggy
│   └── format.js              fmtInt, fmtINR, orderCost
└── assets/img/                Icons + logo
```

The deep architecture notes (API shapes, render flow, gotchas, copy style) live in [AGENTS.md](AGENTS.md).

## Stack

- React 18, Tailwind 3
- Framer Motion for animations / parallax / layout transitions
- Recharts for the area + bar charts
- Lucide React for UI icons (brand logos inlined - lucide drops them for trademark reasons)
- Fonts: Fraunces (display), Fredoka (brand wordmark), DM Sans (body) - all from Google Fonts
- Webpack 5 + Babel via `utils/build.js`

## Privacy

Munchmetrics hits Zomato and Swiggy's own APIs from your own browser session. No request ever goes to a Munchmetrics server (there isn't one). Your fetched orders are cached in `chrome.storage.local` only. Hit **Start over** in the dashboard to wipe the cache.

## Contributing

PRs welcome. Read [AGENTS.md](AGENTS.md) first - it has the copy style guide, versioning rule (patch-bump every change), and the API quirks for both platforms.

## License

MIT. Made with hunger by [JJay](https://instagram.com/whereis.the.food).
