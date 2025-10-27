import { BasePage } from './BasePage';

export class SportHomePage extends BasePage {
  async goToFormula1() { await this.navigate('https://www.bbc.com/sport/formula1'); }
}
