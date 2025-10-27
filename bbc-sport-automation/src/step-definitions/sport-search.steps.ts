import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import { expect } from 'chai';
import { SportHomePage } from '../pages/SportHomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';

let browser: Browser;
let page: Page;
let homePage: SportHomePage;
let searchPage: SearchResultsPage;

Given('I navigate to the BBC Sport homepage', async function () {
  browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
  const context = await browser.newContext();
  page = await context.newPage();
  homePage = new SportHomePage(page);
  searchPage = new SearchResultsPage(page);
  await homePage.navigate(process.env.BASE_URL || 'https://www.bbc.com/sport');
});

When('I search for {string}', async function (query: string) {
  await page.waitForLoadState('networkidle');
  const searchButton = page.locator('button[aria-label="Search"], button[data-testid="search-button"], text=Search');
  if ((await searchButton.count()) > 0) await searchButton.first().click();
  const input = page.locator('input[type="search"], input[placeholder*="Search"]');
  await input.first().fill(query);
  await input.first().press('Enter');
  await page.waitForTimeout(1000);
});

Then('I should see at least {int} relevant results', async function (count: number) {
  const results = page.locator('h3, h2');
  const resultCount = await results.count();
  expect(resultCount).to.be.at.least(count);
  await browser.close();
});
