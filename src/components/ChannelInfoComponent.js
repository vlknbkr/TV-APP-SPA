// src/components/ChannelInfoComponent.js
import { expect } from '@playwright/test';

export class ChannelInfoComponent {
  /**
   * @param {import('@playwright/test').Locator} root
   * @param {import('@playwright/test').Page} page
   */
  constructor(root, page) {
    this._root = root;
    this.page = page;

    this.panel = this._root.locator('#channel-info[role="list"][aria-label="Channels"]');
    this._switcher = this.panel.locator('[data-testid="channels-switcher"][role="listitem"]');
    this.meta = this._switcher.locator('[data-channel-id][data-channel-title][data-channel-number]');
  }

  root() { return this.panel; }
  switcher() { return this._switcher; }

  async isContentReady() {
    return (await this.panel.getAttribute('data-content-ready')) === 'true';
  }

  async waitUntilReady() {
    await expect(this.panel, 'Channel info panel should be visible').toBeVisible();
    await expect(this.panel, 'Channel info should be content-ready')
      .toHaveAttribute('data-content-ready', 'true');
    await expect(this._switcher, 'Channels switcher should exist').toBeVisible();
  }

  async currentLabel() {
    return (await this._switcher.getAttribute('aria-label'))?.trim() ?? '';
  }

  async currentKey() {
    // Stronger “channel changed” signal than label alone
    const id = (await this.meta.getAttribute('data-channel-id'))?.trim() ?? '';
    const num = (await this.meta.getAttribute('data-channel-number'))?.trim() ?? '';
    const title = (await this.meta.getAttribute('data-channel-title'))?.trim() ?? '';
    const key = `${id}|${num}|${title}`;
    return key === '||' ? '' : key;
  }

  async waitForChannelChange(previousKey, { timeout = 15000 } = {}) {
    await this.waitUntilReady();
    await expect
      .poll(() => this.currentKey(), { timeout })
      .not.toBe(previousKey);
  }
}