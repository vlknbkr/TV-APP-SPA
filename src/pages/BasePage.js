import { RemoteControl } from '../utils/RemoteControl';

export class BasePage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    if (this.constructor === BasePage) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }
    this.page = page;
    this.remote = new RemoteControl(page);
  }

  async navigate(path) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  async isLoaded() {
    throw new Error('Method \'isLoaded()\' must be implemented.');
  }
}

