import { RemoteControl } from '../utils/RemoteControl';

const MENU_ORDER = ['Search', 'Home', 'TV Guide', 'Channels', 'Gaming', 'Free', 'Apps'];

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
    this.menuBar = this.page.locator('[role="menubar"]');
  }

  async open() {
    throw new Error('Method \'open()\' must be implemented.');
  }

  async isLoaded() {
    throw new Error('Method \'isLoaded()\' must be implemented.');
  }

  async navigate(label) {
    const maxUp = 10;


    for (let i = 0; i < maxUp; i++) {
      if ((await this.menu.focusedItem().count()) > 0) break;
      await this.remote.up();
    }

    const currentLabel = await this.menu.focusedItem().getAttribute('aria-label');
    if (!currentLabel) throw new Error('Focused menu item has no aria-label.');

    const currentIndex = MENU_ORDER.indexOf(currentLabel);
    const targetIndex = MENU_ORDER.indexOf(label);

    if (currentIndex < 0) {
      throw new Error(`Current focused menu label "${currentLabel}" is not in MENU_ORDER: ${MENU_ORDER.join(', ')}`);
    }
    if (targetIndex < 0) {
      throw new Error(`Target menu label "${label}" is not in MENU_ORDER: ${MENU_ORDER.join(', ')}`);
    }

    const count = MENU_ORDER.length;
    const rightSteps = (targetIndex - currentIndex + count) % count;
    const leftSteps = (currentIndex - targetIndex + count) % count;

    const goRight = rightSteps <= leftSteps;
    const steps = goRight ? rightSteps : leftSteps;

    for (let s = 0; s < steps; s++) {
      if (goRight) await this.remote.right();
      else await this.remote.left();
    }

    await this.remote.select(this.menu.focusedItem());
  }
}

