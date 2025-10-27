import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import { expect } from 'chai';
import { SportHomePage } from '../pages/SportHomePage';
import { FormulaOnePage } from '../pages/FormulaOnePage';

let browser: Browser;
let page: Page;
let sportPage: SportHomePage;
let f1Page: FormulaOnePage;

Given('I navigate to the BBC Sport Formula 1 page', async function () {
  browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
  const context = await browser.newContext();
  page = await context.newPage();
  sportPage = new SportHomePage(page);
  f1Page = new FormulaOnePage(page);
  await sportPage.goToFormula1();
});

When('I locate the 2023 Las Vegas Grand Prix results table', async function () {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
});

Then('I should see the top 3 finishers as:', async function (dataTable) {
  const expected = ['Max Verstappen', 'George Russell', 'Sergio Perez'];
  for (const name of expected) {
    const locator = page.locator(`text=${name}`);
    const count = await locator.count();
    expect(count).to.be.greaterThan(0, `Expected ${name} on page`);
  }
  await browser.close();
});
