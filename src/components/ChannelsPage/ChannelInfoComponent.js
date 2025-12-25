import { expect } from '@playwright/test';

export class ChannelInfoComponent {
  static SELECTORS = {
    container: '#channel-info[role="list"][aria-label="Channels"]',
    switcher: '[data-testid="channels-switcher"][role="listitem"]',
    meta: '[data-channel-id][data-channel-title][data-channel-number]'
  };

  constructor(root, page) {
    this.root = root;
    this.page = page;
  }

  panel() { return this.root.locator(ChannelInfoComponent.SELECTORS.container); }
  switcher() { return this.panel().locator(ChannelInfoComponent.SELECTORS.switcher); }
  meta() { return this.switcher().locator(ChannelInfoComponent.SELECTORS.meta); }

  async isContentReady() {
    return (await this.panel().getAttribute('data-content-ready')) === 'true';
  }

  async currentKey() {
    const id = (await this.meta().getAttribute('data-channel-id'))?.trim() ?? '';
    const num = (await this.meta().getAttribute('data-channel-number'))?.trim() ?? '';
    const title = (await this.meta().getAttribute('data-channel-title'))?.trim() ?? '';
    const key = `${id}|${num}|${title}`;
    return key === '||' ? '' : key;
  }

  async waitForChannelChange(previousKey, { timeout = 15000 } = {}) {
    await expect
      .poll(async () => await this.currentKey(), { timeout })
      .not.toBe(previousKey);
  }
}