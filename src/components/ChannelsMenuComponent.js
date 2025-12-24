import { expect } from '@playwright/test';

export class ChannelsMenuComponent {
  /**
   * @param {import('@playwright/test').Locator} root
   * @param {import('@playwright/test').Page} page
   */
  constructor(root, page) {
    this._root = root;
    this.page = page;

    this.menu = this._root.locator('#channels-menu[role="menu"]');
    this.group = this.menu.locator('[role="group"][aria-label="Channels menu"]');

    this._backButton = this.menu.locator('[data-testid="channels-back-button"][role="menuitem"]');
    this._myChannelsButton = this.menu.locator('[data-testid="channels-open-my-channels-button"][role="menuitem"]');
    this._addToMyChannelsButton = this.menu.locator('[data-testid="channels-delete-from-my-channels-button"][role="menuitem"]');
    this._allChannelsButton = this.menu.locator('[data-testid="channels-open-epg-button"][role="menuitem"]');
  }

  root() {
    return this.menu;
  }
  backButton() {
    return this._backButton;
  }

  async waitUntilReady() {
    await expect(this.menu, 'Channels menu container should exist').toBeAttached();
    await expect(this.group, 'Channels menu group should exist').toBeAttached();
    await expect(this.menu, 'Channels menu content-ready should be true')
      .toHaveAttribute('data-content-ready', 'true');
  }

  async isClosed() {
    const transform = await this.group.evaluate(el => el.style.transform || '');
    return transform.includes('translateX(-100%');
  }

  async waitUntilOpen() {
    await this.waitUntilReady();
    await expect
      .poll(() => this.isClosed(), { timeout: 15000, message: 'Channels menu did not open' })
      .toBe(false);
  }

  async waitUntilClosed() {
    await this.waitUntilReady();
    await expect
      .poll(() => this.isClosed(), { timeout: 15000, message: 'Channels menu did not close' })
      .toBe(true);
  }
}