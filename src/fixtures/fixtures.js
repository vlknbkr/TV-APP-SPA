import { test as base, expect } from '@playwright/test';
import { RemoteControl } from '../utils/RemoteControl.js';
import { HomePage } from '../pages/HomePage.js';
import { AppsPage } from '../pages/AppsPage.js';
import { SearchPage } from '../pages/SearchPage.js';
import { ChannelPage } from '../pages/ChannelPage.js';
import { FavoritesFlow } from '../flows/FavoritesFlow.js';

// Extend base test with your page objects
export const test = base.extend({
    /** @type {import('../utils/RemoteControl').RemoteControl} */
    remote: async ({ page }, use) => {
        await use(new RemoteControl(page, { delay: 200, log: true }));
    },

    /** @type {import('../pages/HomePage').HomePage} */
    homePage: async ({ page, remote }, use) => {
        await use(new HomePage(page, { remote }));
    },

    /** @type {import('../pages/AppsPage').AppsPage} */
    appsPage: async ({ page, remote }, use) => {
        await use(new AppsPage(page, { remote }));
    },

    /** @type {import('../pages/SearchPage').SearchPage} */
    searchPage: async ({ page, remote }, use) => {
        await use(new SearchPage(page, { remote }));
    },

    /** @type {import('../pages/ChannelPage').ChannelPage} */
    channelPage: async ({ page, remote }, use) => {
        await use(new ChannelPage(page, { remote }));
    },

    /** @type {import('../flows/FavoritesFlow').FavoritesFlow} */
    favoritesFlow: async ({ homePage, appsPage }, use) => {
        await use(new FavoritesFlow(homePage, appsPage));
    },
});

export { expect };