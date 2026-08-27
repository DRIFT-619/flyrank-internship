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