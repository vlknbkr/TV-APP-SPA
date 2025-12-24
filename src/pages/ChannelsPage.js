// src/pages/ChannelsPage.js
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { ChannelsOverlayComponent } from '../components/ChannelsOverlayComponent.js';

export class ChannelsPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.overlay = new ChannelsOverlayComponent(page);
  }

  async open() {
    await this.page.goto('Channels');
    await this.isLoaded();
  }

  async isLoaded() {
    await expect(this.overlay.root(), 'Channels overlay should be visible').toBeVisible();

    await expect(
      this.overlay.channelInfo.root(),
      'Channel info container should be visible'
    ).toBeVisible();

    await expect
      .poll(() => this.overlay.channelInfo.isContentReady(), { timeout: 15000 })
      .toBe(true);

    await expect(this.overlay.channelInfo.switcher(), 'Channels switcher should be visible')
      .toBeVisible();

    await expect
      .poll(async () => {
        const key = await this.overlay.channelInfo.currentKey();
        return !!key;
      }, { timeout: 15000 })
      .toBe(true);
  }

  /**
   * @param {'up'|'down'} direction
   * @param {number} steps
   */
  async switchChannel(direction = 'down', steps = 1) {
    if (!['up', 'down'].includes(direction)) {
      throw new Error(`switchChannel: direction must be "up" or "down", got "${direction}"`);
    }
    if (!Number.isInteger(steps) || steps < 1) {
      throw new Error(`switchChannel: steps must be a positive integer, got "${steps}"`);
    }

    await this.isLoaded();

    const beforeKey = await this.overlay.channelInfo.currentKey();

    if (direction === 'down') await this.remote.down(steps);
    else await this.remote.up(steps);

    await this.assertChannelChanged(beforeKey);
  }

  async openMenu() {
    await this.isLoaded();

    await this.remote.longPressSelect();

    await this.overlay.menu.waitUntilOpen();
    await expect(this.overlay.menu.backButton(), 'Menu back button should be visible').toBeVisible();
  }

  async closeMenu() {
    // Only try closing if it’s actually open/visible.
    if (await this.overlay.menu.backButton().count() === 0) return;

    await this.remote.back();
    await this.overlay.menu.waitUntilClosed();
  }

  async assertChannelChanged(prevKey) {
    await expect
      .poll(async () => {
        const now = await this.overlay.channelInfo.currentKey();
        return !!now && now !== prevKey;
      }, { timeout: 15000 })
      .toBe(true);
  }
}