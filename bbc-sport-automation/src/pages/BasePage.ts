import { Page } from 'playwright';

export class BasePage {
  protected page: Page;
  constructor(page: Page) { this.page = page; }
  async navigate(url: string) { await this.page.goto(url); }
  async screenshot(name: string) { await this.page.screenshot({ path: `screenshots/${name}.png` }); }
}
