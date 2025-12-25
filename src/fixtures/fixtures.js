import { test as base, expect } from '@playwright/test';
import { AppsPage } from '../pages/AppsPage.js';
import { HomePage } from '../pages/HomePage.js';
import { ChannelsPage } from '../pages/ChannelsPage.js';
import { SearchPage } from '../pages/SearchPage.js';
import { APPS_DATA } from '../test-data/test.data.js';

export const test = base.extend({
  cleanFavState: async ({ homePage }, use) => {
    const app = APPS_DATA.NEWS_APP;

    await homePage.open();

    if (await homePage.isAppInFavorites(app.name)) {
      await homePage.focusFavApp(app.name);
      await homePage.removeFocusedFavApp(app.name);
      await expect
        .poll(async () => await homePage.favAppList.appLocator(app.name).count(), {
          timeout: 15000,
          message: `App ${app.name} should have been removed`
        })
        .toBe(0);
    }
    await use(app);
  },

  readyToDeleteState: async ({ appsPage, homePage }, use) => {
    const app = APPS_DATA.ENTERTAINMENT_APP;
    
    await homePage.open();

    if (!(await homePage.isAppInFavorites(app.name))) {
      await appsPage.open();
      await appsPage.focusApp(app.category, app.name);
      await appsPage.addFocusedAppToFavApps(app.category, app.name);
      await homePage.remote.select();
      await expect
        .poll(async () => await homePage.favAppList.exists(app.name), {
          timeout: 15000,
          message: `App ${app.name} should have appeared in Favorites`
        })
        .toBe(true);
    }
    await use(app);
  },

  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
  appsPage: async ({ page }, use) => { await use(new AppsPage(page)); },
  channelsPage: async ({ page }, use) => { await use(new ChannelsPage(page)); },
  searchPage: async ({ page }, use) => { await use(new SearchPage(page)); }
});

export { expect };