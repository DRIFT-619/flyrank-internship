# The Polite Scraper — Books to Scrape

A small scraping pipeline built as part of the FlyRank AI Backend Engineering
internship (Backend Track). Downloads book listings from a public practice
sandbox, extracts clean structured data, and produces a validated JSON
output with an honest report of what happened during the run.

## Target classification

**Site:** [books.toscrape.com](https://books.toscrape.com)

**Why this site is appropriate to scrape:** the site's own homepage
describes it as a "Web Scraping Sandbox" — a fictional bookstore built
specifically for people to practice scraping on and for developers to
validate their scraping tools against. It is not a real business; prices
and ratings are randomly generated and explicitly labeled as having "no
real meaning." The site exists for exactly this purpose.

**Scope:** the site hosts 1000 books across 50 catalogue pages. This
project deliberately limits itself to the **first 3 catalogue pages only**
(60 books) — a practice-sized slice, not the site's actual limit.

**Data collected:** for each of the 60 books — title, price, availability,
star rating, description, and the book's own page URL. No personal data,
no account information, no content outside the public book listings.

**robots.txt result:** `https://books.toscrape.com/robots.txt` returns a
`404 Not Found`. A missing robots.txt is not the same as permission — it
simply means the site has not published automation rules. Given the
site's own explicit self-description as a scraping sandbox, that
description is treated as the actual basis for scraping here, not the
absence of a robots file.

I will not reuse this code on another site without checking its rules and
terms first.

## How to run it

```bash
cd scraper
npm install
node src/index.js
```

This will fetch (or read from cache) the first 3 catalogue pages, discover
all 60 book URLs, visit each book page, clean and validate the data, and
write `output/books.json`, `output/errors.json`, and
`output/run-report.json`.

A first run takes about 40-60 seconds (60 real requests, each 600ms apart,
by design — see Politeness below). Every subsequent run reads from
`cache/` and finishes in under a second, unless the cache is deleted.

## Record schema

Each entry in `output/books.json` has this shape, validated with Zod:

| Field | Type | Notes |
|---|---|---|
| `title` | string | |
| `product_url` | string (URL) | canonical identity of the record |
| `price_text` | string | raw price as shown on the page, e.g. `"£51.77"` |
| `price_gbp` | number | cleaned numeric price, e.g. `51.77` |
| `availability_text` | string | e.g. `"In stock (22 available)"` |
| `rating_text` | string \| null | e.g. `"Three"` |
| `description` | string \| null | `null` when the book has no description |
| `source_page` | string (URL) | which catalogue page this book was found on |
| `fetched_at` | string (ISO datetime) | when this record was scraped |

Records that fail validation are written to `output/errors.json` with the
specific reason, and never appear in `books.json`.

## Politeness rules

- **User-agent**: every request identifies itself as
  `FlyRankInternshipA9/1.0 (+link to this repo)`, so a site owner could
  find out who's making the request.
- **Timeout**: every request gives up after 10 seconds rather than hanging
  indefinitely.
- **Delay**: at least 600ms between real (non-cached) requests to the site.
- **Cache**: every fetched page is saved to `cache/` and read from there on
  subsequent runs, so the real site is only ever hit once per page during
  development.
- **Status check**: only a `200` response is treated as real data. `404`
  and `403` are never retried — a `404` means the page genuinely doesn't
  exist, and retrying a `403` is how a polite scraper becomes a pest.
  `5xx` server errors get exactly one retry, since those can be transient.

## Failure handling

Each book page is fetched independently — one broken page is logged and
skipped without stopping the run. Proven by adding one deliberately fake
book URL to the list: the run still finished, `books.json` still had all
60 real records, and `run-report.json` reported `failed_pages: 1`.

## Example run report

```json
{
  "started_at": "2026-08-27T06:57:19.958Z",
  "finished_at": "2026-08-27T06:57:56.721Z",
  "duration_ms": 36763,
  "pages_fetched": 60,
  "cache_hits": 60,
  "valid_records": 60,
  "invalid_records": 0,
  "failed_pages": 0
}
```

## Why no browser was needed

Every field this scraper needed (title, price, availability, rating,
description) is present directly in the HTML the server sends on first
response — confirmed by viewing the page source directly, without running
any JavaScript. A headless browser like Playwright renders the page,
executes scripts, and waits for network activity before scraping — all
real cost (time, memory, complexity) that buys nothing here, since there's
no client-side rendering standing between the request and the data.

## Ethics note

This project only scrapes a site explicitly built and offered for
scraping practice. In general: prefer an official API when one exists,
never bypass logins, paywalls, or CAPTCHAs, collect only the data
actually needed, and re-check a site's own rules and terms before ever
reusing this code elsewhere.

## Known limitation

The retry logic here is a single, simple retry with a fixed 1-second
wait — not real exponential backoff, and it doesn't read a `Retry-After`
header if a server provides one. That's a deliberate scope decision (the
assignment doc itself calls this out as "don't gold-plate Stage 5"),
since a more complete version of retry/backoff is the explicit subject of
a later assignment.