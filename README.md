# Amazon Playwright Framework: End-to-End Guide

This project is a small **TypeScript + Playwright Test** example. Its active test opens Amazon India and searches for a product (by default, `television`). It does not sign in, open a product, add anything to the cart, place an order, or make a payment.

## How the project works

The test flow is:

1. Playwright starts Chromium using the settings in `playwright.config.ts`.
2. The test in `tests/amazon.spec.ts` reads `AMAZON_SEARCH_TERM` from `.env`. If it is unset, it uses `television`.
3. `AmazonPage.openHomePage()` navigates to the configured base URL, `https://www.amazon.in/`.
4. If Amazon displays its “Click the button below to continue shopping” interstitial, the page object clicks the “Continue shopping” button and waits for that prompt to disappear.
5. `AmazonPage.searchProduct()` finds Amazon's search textbox, enters the search term, and presses Enter.
6. The test checks that the resulting URL includes the search term and that the page body contains it.

The page object keeps Amazon-specific actions and selectors separate from the test scenario. The test describes the flow; `AmazonPage` implements the interactions.

## Project layout

```text
amazon-playwright-framework/
├── pages/
│   └── AmazonPage.ts       # Page object: navigation and Amazon interactions
├── tests/
│   └── amazon.spec.ts      # Active test scenario: search for a product
├── .env.example            # Optional search-term configuration template
├── .gitignore              # Excludes .env, generated reports and dependencies
├── package.json            # Dependencies and npm commands
├── package-lock.json       # Locked dependency versions
├── playwright.config.ts    # Browser, URL, timeouts and reports
└── README.md               # This guide
```

`signIn()` and `addProductToCart()` are also defined in `pages/AmazonPage.ts`, but the current test does not call them.

## Setup

Prerequisites: Node.js and npm.

From the project directory, install the packages and Chromium:

```powershell
npm install
npx playwright install chromium
```

## Search configuration

The search term is configurable and does not require credentials. To use the example file, copy it to `.env`:

```powershell
Copy-Item .env.example .env
```

Set the term in `.env`:

```env
AMAZON_SEARCH_TERM=television
```

If `.env` is absent or `AMAZON_SEARCH_TERM` is not set, the test still searches for `television`. Keep `.env` private; it is excluded by `.gitignore`.

## Run and inspect the test

Run all tests:

```powershell
npm test
```

Run only the search scenario:

```powershell
npm test -- --grep "search Television"
```

The configured browser is headed (visible), so Chromium opens while the test runs. To run with Playwright's interactive debugger:

```powershell
npm run test:debug
```

Check TypeScript types:

```powershell
npx tsc --noEmit
```

Playwright writes an HTML report to `playwright-report/` and failure artifacts, including traces and screenshots, to `test-results/`. Both folders are ignored by Git. Open the report with:

```powershell
npm run report
```

## Important implementation details

### Playwright configuration

`playwright.config.ts` loads `.env` with `dotenv/config`. It sets the base URL to `https://www.amazon.in/`, uses Chromium, runs headed, sets a 180-second test timeout, and enables a list reporter plus a saved HTML report. Screenshots are captured on failure and traces are retained on failure.

### Test scenario

`tests/amazon.spec.ts` creates an `AmazonPage`, opens the home page, and searches for the configured/default term. It currently does not use email/password credentials or perform purchase-related actions.

### Amazon page object

`pages/AmazonPage.ts` contains:

- `openHomePage()` — opens Amazon India and handles the visible Continue shopping interstitial.
- `searchProduct(searchTerm)` — fills the search field and submits the query, then verifies the URL and page text.
- `signIn(email, password)` and `addProductToCart()` — available methods for other flows, not used by the current test.

## Troubleshooting

- **Continue shopping is displayed:** the page object looks for Amazon's prompt and clicks the submit input or button named “Continue shopping.” If the wording or markup changes, inspect the page and update the locator.
- **Search box is not found:** Amazon may have presented a different page instead of its normal home page. Check the visible browser and the trace in `test-results/` to see which page loaded.
- **Amazon shows “Oops” or a traffic message:** the test cannot verify search results while Amazon is returning a temporary error/interstitial page. Wait and try again later; the test does not bypass Amazon's access controls.
- **A selector no longer works:** Amazon can change its page structure. Use the Playwright trace or failure screenshot to inspect the current UI, then update the relevant page-object locator.

Amazon's live site may show temporary traffic pages or additional verification, so results can vary between runs. This project is a learning example, not a production-ready test suite.

# This is my first commit in git----------------*