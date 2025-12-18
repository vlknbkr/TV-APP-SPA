/**
 * FavoritesFlow
 *
 * Orchestrates multi-page "favorites" scenarios.
 * Keeps Page Objects single-responsibility (no page->page dependency).
 */
export class FavoritesFlow {
    /**
     * @param {import('../pages/HomePage.js').HomePage} homePage
     * @param {import('../pages/AppsPage.js').AppsPage} appsPage
     */
    constructor(homePage, appsPage) {
        this.homePage = homePage;
        this.appsPage = appsPage;
    }

    async ensureFavoriteExists(featureName, appName) {
        await this.homePage.open();
        await this.homePage.waitUntilFavListLoad();
        const present = await this.homePage.isFavoritePresent(appName);

        if (!present) {
            await this.appsPage.addAppToFavList(featureName, appName);
        }

        await this.homePage.expectAppExistInFavList(appName);
    }

    async ensureFavoriteNotExists(appName) {
        await this.homePage.open();
        await this.homePage.ensureAppNotExistInFavList(appName);
    }
}
