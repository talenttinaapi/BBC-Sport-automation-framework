export class SportPage {
  constructor(private page: any) {}
  async gotoFormula1() {
    await this.page.goto('https://www.bbc.com/sport/formula1');
  }
}
