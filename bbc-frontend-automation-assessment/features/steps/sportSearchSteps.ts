import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import { expect } from 'chai';

let browser: Browser;
let page: Page;

Given('I navigate to the BBC Sport homepage', async function () {
  browser = await chromium.launch();
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('https://www.bbc.com/sport');
});

When('I search for {string}', async function (query: string) {
  await page.waitForLoadState('networkidle');
  // BBC search icon / input is dynamic; try common selectors
  const searchButton = page.locator('button[aria-label="Search"], button[data-testid="search-button"], text=Search');
  if (await searchButton.count() > 0) {
    await searchButton.first().click();
  } else {
    // try opening search via keyboard shortcut: '/'
    await page.keyboard.press('/');
  }

  // Try input selectors
  const input = page.locator('input[type="search"], input[placeholder*="Search"]');
  await input.first().fill(query);
  await input.first().press('Enter');
  await page.waitForLoadState('networkidle');
});

Then('I should see at least {int} relevant results', async function (count: number) {
  // common selector for results: articles or list items
  const results = page.locator('a:visible >> text=', { hasText: '' });
  // Fallback: look for headings in results
  const headings = page.locator('h3, h2, .ssrcss-.*-Heading'); // generic
  // Wait a bit to ensure results render
  await page.waitForTimeout(1000);
  const resultCount = await headings.count();
  expect(resultCount, `Expected at least ${count} results, found ${resultCount}`).to.be.at.least(count);
  await browser.close();
});
