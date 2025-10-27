export class HomePage {
  constructor(private page: any) {}
  async goto() {
    await this.page.goto('https://www.bbc.com/sport');
  }
}
