import { BasePage } from './BasePage';

export class FormulaOnePage extends BasePage {
  async getResultsTable() { return this.page.locator('table'); }
}
