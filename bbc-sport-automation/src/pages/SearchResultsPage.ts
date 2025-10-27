import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  async getResults() { return this.page.locator('h3, h2'); }
}
