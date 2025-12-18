import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { AppsPage } from '../pages/AppsPage.js';
import { SearchPage } from '../pages/SearchPage.js';
import { ChannelPage } from '../pages/ChannelPage.js';

// Extend base test with your page objects
export const test = base.extend({
    /** @type {import('../pages/HomePage').HomePage} */
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    /** @type {import('../pages/AppsPage').AppsPage} */
    appsPage: async ({ page }, use) => {
        await use(new AppsPage(page));
    },

    /** @type {import('../pages/SearchPage').SearchPage} */
    searchPage: async ({ page }, use) => {
        await use(new SearchPage(page));
    },

    /** @type {import('../pages/ChannelPage').ChannelPage} */
    channelPage: async ({ page }, use) => {
        await use(new ChannelPage(page));
    },
});

export { expect };