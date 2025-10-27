import { Before, After, Status } from '@cucumber/cucumber';

Before(async function () {});

After(async function ({ result, pickle }) {
  if (result?.status === Status.FAILED) {
    if (process.env.SCREENSHOT_ON_FAILURE === 'true') {
      await this.page.screenshot({ path: `screenshots/${pickle.name.replace(/ /g,'_')}.png` });
    }
  }
});
