# AGENTS.md

Context for any agent (human or AI) working on the Munchmetrics Chrome extension.

## What this is

Munchmetrics is a Chrome extension that turns your Zomato + Swiggy order history into a year-in-review style dashboard. Everything runs locally in the browser - we hit Zomato and Swiggy's own APIs with the user's existing session cookies, crunch the numbers client-side, and render charts. No server, no telemetry, no data leaves the user's machine.

Clicking the toolbar icon opens `options.html` in a new tab. That single page hosts both the **Welcome / login** flow and the **Dashboard**. The popup is no longer used.

## Architecture

```
src/
├── manifest.json              # MV3, action opens options page, no default_popup
├── pages/
│   ├── Background/index.js    # chrome.action.onClicked -> open options.html
│   ├── Options/               # The only page the user actually sees
│   │   ├── Options.jsx        # Orchestrator: checks logins, swaps Welcome <-> Dashboard
│   │   ├── components/
│   │   │   ├── Welcome.jsx          # Hero + 2 platform login cards + status banner
│   │   │   ├── DashboardView.jsx    # Header, CombinedSummary, Zomato/Swiggy tabs
│   │   │   ├── CombinedSummary.jsx  # Dark hero card, lifetime spend, split bar
│   │   │   ├── PlatformPanel.jsx    # Per-platform: year picker, spend block, charts
│   │   │   ├── MetricsGrid.jsx      # 4 stat tiles
│   │   │   ├── MonthlyChart.jsx     # Recharts area chart, Spend / Order toggle
│   │   │   ├── HourlyChart.jsx      # Recharts bar chart, peak hunger hours
│   │   │   └── TopList.jsx          # Top dishes / restaurants list with inline bars
│   │   └── pages/                   # Legacy router-based views (unused, kept for reference)
│   ├── Popup/                 # Legacy, no longer wired to the toolbar
│   ├── Newtab/, Panel/, Devtools/  # Boilerplate, unused
│   └── Content/index.js       # Content script, currently a no-op log
├── hooks/
│   ├── useZomatoScrapper.jsx  # Paginates Zomato user/orders, returns real Promise
│   └── useSwiggyScrapper.jsx  # Walks Swiggy order/all with order_id cursor
├── helpers/
│   ├── zomato.js              # groupByYears, generateYearlyReview, groupOrdersByMonth, readifyTimeSlot
│   ├── swiggy.js              # Same shape as zomato.js but for Swiggy data
│   ├── format.js              # fmtInt, fmtINR, toNumber, orderCost - shared formatting
│   └── formatINR.js           # Legacy, prefer helpers/format.js
└── index.css, tailwind-i.css  # Tailwind entry, Google Fonts (Fraunces + DM Sans)
```

### Render flow

1. User clicks the toolbar icon - `Background/index.js` opens `options.html` in a new tab.
2. `Options.jsx` mounts and in parallel:
   - Checks Zomato login (`GET /webroutes/user/orders`)
   - Checks Swiggy login (`GET /dapi/order/all?order_id=`)
   - Reads any cached orders from `chrome.storage.local`
3. While `step === 'welcome'`, `Welcome.jsx` renders. One of three banner variants shows (neither, one, both logged in).
4. When the user clicks "See my food story":
   - `useZomatoScrapper.getZomatoYearSummary()` and / or `useSwiggyScrapper.getYearSummarySwiggy()` are called in parallel
   - Each writes to `chrome.storage.local` on success
   - `step` flips to `'dashboard'`
5. `DashboardView.jsx` renders:
   - `CombinedSummary` (lifetime Zomato + this-year Swiggy)
   - Tabs switch between two `PlatformPanel` instances
   - Zomato panel has a year picker; Swiggy panel does not (Swiggy API only returns ~current year)

### State + storage

- React state in `Options.jsx` holds `zomatoOrders` and `swiggyOrders` arrays. These are the source of truth for the dashboard render.
- `chrome.storage.local` keys:
  - `zomato` - full Zomato order array
  - `swiggy` - full Swiggy order array
  - `zomatePages` - total page count cached when login is detected (needed for Zomato pagination)
- "Start over" clears storage + local state and bounces back to Welcome.

## External APIs we depend on

These are **unofficial** endpoints. They use the user's existing session cookie - the browser sends it automatically because the fetch goes to the same origin the user is already logged in to. No host_permissions needed in the manifest because we never read the response from a cross-origin extension page - we always go through the user's authenticated browser session.

### Zomato

- `GET https://www.zomato.com/webroutes/user/orders` - login check + first page. Returns `sections.SECTION_USER_ORDER_HISTORY.{count,totalPages}` and `entities.ORDER` keyed by order id.
- `GET https://www.zomato.com/webroutes/user/orders?page=N` - subsequent pages. We fan these out with `Promise.all`.
- Per-order useful fields: `totalCost` (string like `"₹450"`), `orderDate` (string like `"February 16, 2023 at 02:01 PM"`), `dishString` (e.g. `"2 x Biryani, 1 x Coke"`), `resInfo.{id, name, locality.localityName}`.

### Swiggy

- `GET https://www.swiggy.com/dapi/order/all?order_id=` - login check + first page. `statusCode === 0` means signed in. Returns `data.orders[]`.
- `GET https://www.swiggy.com/dapi/order/all?order_id=<last_order_id>` - cursor-based pagination. We chain calls until the response returns an empty `orders` array.
- Per-order useful fields: `order_total` (number), `payment_txn_created_on` (string `"YYYY-MM-DD HH:MM:SS"`, may be missing - fall back to `order_placement_status_updated_at` or `order_time`), `restaurant_name`, `restaurant_city_name`, `order_items[].name`.

### Chrome APIs

- `chrome.action.onClicked` - toolbar icon click handler (background service worker)
- `chrome.tabs.create` - open the options page in a new tab
- `chrome.storage.local` - persisting fetched orders + page counts
- `chrome.runtime.getURL` - building the options page URL

## Stack

- React 18 + Tailwind 3 (custom palette: `cream`, `espresso`, `zomato`, `swiggy`)
- Fonts: Fraunces (display) + DM Sans (body), loaded from Google Fonts
- Recharts for the area + bar charts
- Webpack 5 + Babel (via `utils/build.js`)
- Node 20 required for the build (older Node fails on modern babel-loader). Use `nvm use 20` before `npm run build`.

## Usage

### Local dev

```sh
nvm use 20
npm install      # only once
npm run build    # outputs to build/
```

Then in Chrome: `chrome://extensions` -> Developer mode -> **Load unpacked** -> pick `build/`. After every code change, run `npm run build` again and hit the reload icon on the extension card.

For continuous rebuild + Tailwind watch:

```sh
npm start
```

### Common dev tasks

| Task | How |
|---|---|
| Add a new metric tile | Edit `components/MetricsGrid.jsx`, extend the `review` object in `helpers/{zomato,swiggy}.js` |
| Change colors / theme | `tailwind.config.js` palette + `tailwind-i.css` font imports |
| Add a new platform | New scraper in `hooks/`, new helper in `helpers/`, new `PlatformPanel` instance in `DashboardView.jsx` |
| Debug a calc | Open the options page DevTools console; helpers log nothing by default - add `console.log(analytics)` in `generateYearlyReview` |
| Reset the user's data | The "Start over" button in the dashboard, or manually clear `chrome.storage.local` from DevTools |

### Things to know before changing things

- Both scraper hooks **must** return real Promises that resolve only after all pages are parsed. The old Zomato hook returned `undefined` because the work was inside a `chrome.storage.local.get` callback - don't regress this.
- Every helper / formatter must tolerate missing fields. Real Zomato + Swiggy data has irregular orders (cancelled, gift cards, missing `totalCost`, missing dates). Use `helpers/format.js` `orderCost()` rather than ad-hoc `parseFloat(o.totalCost.replace('₹', ''))` - that pattern breaks on `"₹1,200"` (comma -> `parseFloat` returns `1`).
- Tailwind dynamic class names (`bg-${brand}-500`) don't get picked up by the JIT. Use a static lookup map or two literal strings.

## Repo

[github.com/jaga3421/munchmetrics-chrome-extension](https://github.com/jaga3421/munchmetrics-chrome-extension)

## Versioning

Patch-bump on **every** change before handing back. The extension version is
the single source of truth in `package.json` - `webpack.config.js` injects
`process.env.npm_package_version` into the built `manifest.json` automatically,
so you only edit one file.

- Format: `MAJOR.MINOR.PATCH`. Bump `PATCH` (`x.x.y` -> `x.x.y+1`) for every
  change, big or small. Don't skip versions, don't batch.
- Quick way: `npm run bump` (alias for `npm version patch --no-git-tag-version`).
- Or just edit the `"version"` field in `package.json` by hand.
- The current version flows into the `.zip` filename produced by the build, so
  this also gives you a clear release artifact name.

## Copy / writing style

- **Tone**: chill, fun, food-related, but not obnoxious about it. Plain language. Sound like a smart friend, not a marketing deck. Sparing emoji - never replace a word with one.
- **Dashes**: regular hyphens (`-`) only. **No em-dashes** (`—`) or en-dashes (`–`) anywhere in user-facing copy, comments, or markdown. The build sweeps for `—` are an easy way to catch regressions: `grep -rn "—" src/`.
- **Ellipsis**: write `...` (three dots), not `…`. Same reasoning - keeps copy consistent across fonts and easy to grep.
- **Apostrophes**: straight `'` is fine. Don't fight the keyboard.
- **Voice**: second person ("you", "your"). Active. Short sentences.
- **Avoid**: "seamless", "powerful", "revolutionize", "your food journey", or anything that reads like AI slop. If a sentence could ship from a B2B SaaS landing page, rewrite it.

When in doubt, read the line out loud. If you wouldn't say it to a friend over chai, rewrite it.
