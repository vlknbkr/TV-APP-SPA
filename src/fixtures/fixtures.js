import { test as base, expect } from '@playwright/test';
import { RemoteControl } from '../utils/RemoteControl.js';

import { HomePage } from '../pages/HomePage.js';
import { AppsPage } from '../pages/AppsPage.js';
import { ChannelsPage } from '../pages/ChannelsPage.js';
import { SearchPage } from '../pages/SearchPage.js';

/**
 * Keep fixtures minimal + useful:
 * - one shared RemoteControl instance
 * - page objects created with the same remote
 * - one flow that orchestrates shared favorites behavior
 */
export const test = base.extend({
  remote: async ({ page }, use) => {
    await use(new RemoteControl(page));
  },

  homePage: async ({ page, remote }, use) => {
    await use(new HomePage(page, { remote }));
  },

  appsPage: async ({ page, remote }, use) => {
    await use(new AppsPage(page, { remote }));
  },

  channelsPage: async ({ page, remote }, use) => {
    await use(new ChannelsPage(page, { remote }));
  },

  searchPage: async ({ page, remote }, use) => {
    await use(new SearchPage(page, { remote }));
  },
});

export { expect };