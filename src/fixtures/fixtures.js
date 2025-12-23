import { test as base, expect } from '@playwright/test';
import { RemoteControl } from '../utils/RemoteControl.js';

import { HomePage } from '../pages/HomePage.js';
import { AppsPage } from '../pages/AppsPage.js';
import { ChannelPage } from '../pages/ChannelPage.js';
import { SearchPage } from '../pages/SearchPage.js';
import { FavoritesFlow } from '../flows/FavoritesFlow.js';

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

  channelPage: async ({ page, remote }, use) => {
    await use(new ChannelPage(page, { remote }));
  },

  searchPage: async ({ page, remote }, use) => {
    await use(new SearchPage(page, { remote }));
  },

  favoritesFlow: async ({ homePage, appsPage }, use) => {
    await use(new FavoritesFlow(homePage, appsPage));
  },
});

export { expect };