export class FavoritesFlow {
    /**
     * @param {import('../pages/HomePage.js').HomePage} homePage
     * @param {import('../pages/AppsPage.js').AppsPage} appsPage
     */
    constructor(homePage, appsPage) {
        this.homePage = homePage;
        this.appsPage = appsPage;
    }

    /**
     * @param {string} appId
     * @param {string} [categoryName]
     */
    async ensureFavoriteExists(appId, categoryName) {
        await this.homePage.open();

        // Check if already exists
        if (await this.homePage.favRow.exists(appId)) {
            return;
        }

        if (!categoryName) {
            throw new Error(`Category name is required to add app "${appId}" to favorites`);
        }

        await this.appsPage.open();
        await this.appsPage.focusApp(categoryName, appId);
        await this.appsPage.addFocusedAppToFavorites();

        await this.homePage.open();
        if (!(await this.homePage.favRow.exists(appId))) {
            throw new Error(`Failed to add app "${appId}" to favorites`);
        }
    }

    /**
     * @param {string} appId
     */
    async ensureFavoriteRemoved(appId) {
        await this.homePage.open();

        if (await this.homePage.favRow.exists(appId)) {
            await this.homePage.openEditModeOnFavorite(appId);
            await this.homePage.removeFocusedFavorite();

            // Verify removal
            // Ideally wait for it to disappear.
            // basic check:
            if (await this.homePage.favRow.exists(appId)) {
                throw new Error(`Failed to remove app "${appId}" from favorites`);
            }
        }
    }
}
