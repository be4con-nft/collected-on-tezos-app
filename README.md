# Collected on Tezos

Dashboard for marketplace art collected on Tezos. Closed-month counts only.

Live data: [be4con-nft/collected-on-tezos](https://github.com/be4con-nft/collected-on-tezos) (`data/monthly.json`).

This repo is the app. The data repo stays data-only.

## Views

- **YTD** (default) — 2026 Jan–Aug vs the same months in 2025
- **Monthly** — last closed month on the cards; charts and table keep the full 2023–2026 series
- **Full year** — year unions from `json.years` (2026 is YTD, not a fake full year)

Paid marketplace sales only. People = wallets. Monthly uniques are not summed.

Sources: objkt.com public index and TzKT prices. Not Tezos Foundation.

## Run

```bash
npm install
npm run dev
```

Then open the printed local URL. The cockpit fetches `monthly.json` on load (cache-busted), with a snapshot fallback if the main file is short.
