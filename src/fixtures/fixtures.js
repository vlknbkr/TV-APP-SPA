import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { AppsPage } from "../pages/AppsPage";
import { SearchPage } from "../pages/SearchPage";
import { ChannelPage } from "../pages/ChannelPage";

// Extend base test with your page objects
export const test = base.extend({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    appsPage: async ({ page }, use) => {
        await use(new AppsPage(page));
    },
    searchPage: async ({ page }, use) => {
        await use(new SearchPage(page));
    },
    channelPage: async ({ page }, use) => {
        await use(new ChannelPage(page));
    },
});

export { expect } from "@playwright/test";