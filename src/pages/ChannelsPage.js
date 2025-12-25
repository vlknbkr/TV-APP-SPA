import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { ChannelsOverlayComponent } from '../components/ChannelsPage/ChannelsOverlayComponent.js';

export class ChannelsPage extends BasePage {
  constructor(page) {
    super(page);
    this.overlay = new ChannelsOverlayComponent(page);
  }

  async open() {
    await this.navigate('channels');
    await this.isLoaded();
  }

  async isLoaded() {
    await expect(this.overlay.rootLocator()).toBeVisible();
    await expect.poll(() => this.overlay.channelInfo.isContentReady(), { timeout: 15000 }).toBe(true);
  }

  async openMenu() {
    await this.isLoaded();
    await this.remote.select();

    await this.overlay.menu.waitUntilOpen();

    await this.remote.left();
    await this.remote.up();

    await this.remote.select(this.overlay.menu.backButton());
  }

  async testFavoriteFullCycle() {
    await this.openMenu();

    await this.remote.down(2);
    const toggleBtn = this.overlay.menu.favoriteToggleButton();

    const initialState = await this.overlay.menu.getToggleAction();

    await this.remote.select(toggleBtn);

    await expect.poll(async () => await this.overlay.menu.getToggleAction(), {
      timeout: 8000,
      message: "Button ID should have flipped after first selection"
    }).not.toBe(initialState);

    await this.remote.select(toggleBtn);

    await expect.poll(async () => await this.overlay.menu.getToggleAction(), {
      timeout: 8000,
      message: "Button ID should have returned to initial state"
    }).toBe(initialState);

    await this.overlay.menu.waitUntilClosed();
  }


  async switchChannel(direction = 'down', steps = 2) {
    await this.remote.select();

    const beforeKey = await this.overlay.channelInfo.currentKey();
    if (direction === 'down') await this.remote.down(steps);
    else await this.remote.up(steps);
    await this.overlay.channelInfo.waitForChannelChange(beforeKey);
  }
}