
/**
 * Finds the coordinates (row and column index) of an app within a specific category.
 * Performs a case-insensitive search for both category and app name.
 * 
 * @param {import('@playwright/test').Page} page - The Playwright Page object.
 * @param {string} categoryName - The name of the category (e.g., "Sports").
 * @param {string} appName - The name of the app (e.g., "Red Bull TV").
 * @returns {Promise<{rowIndex: number, colIndex: number} | null>} The coordinates or null if not found.
 */
async function getAppCoordinates(listContainer, categoryName, appName) {
    const lists = listContainer.locator('[data-testid^="list-item-"]');

    const listsCount = await lists.count();
    console.log("number of features : ", listsCount);
    const targetCategory = categoryName.trim().toLowerCase();
    const targetApp = appName.trim().toLowerCase();

    for (let rIndex = 0; rIndex < listsCount; rIndex++) {
        const list = lists.nth(rIndex);
        const label = await list.getAttribute('aria-label');

        if (label && label.trim().toLowerCase() === targetCategory) {
            const items = list.locator('div[role="listitem"]');
            const itemsCount = await items.count();
            console.log("items : ", items);

            for (let cIndex = 0; cIndex < itemsCount; cIndex++) {
                const item = items.nth(cIndex);
                const testId = await item.getAttribute('data-testid');

                if (testId && testId.trim().toLowerCase() === targetApp) {
                    console.log("Found app: ", targetApp);
                    console.log("rowIndex: ", rIndex);
                    console.log("colIndex: ", cIndex);
                    return { rowIndex: rIndex, colIndex: cIndex };
                }
            }
        }
    }
    return false;
}

async function getAppCoordinatesInFavoriteList(page, appName) {
    const favoriteList = page.locator('[id^="favourite-apps"]');
    const lists = favoriteList.locator('[role="listitem"]');
    const targetApp = appName.trim().toLowerCase();
    const count = await lists.count();

    for (let colIndex = 0; colIndex < count; colIndex++) {
        const element = lists.nth(colIndex);
        const label = await element.getAttribute('aria-label');

        if (label && label.trim().toLowerCase() === targetApp) {
            console.log("App Found inside favorite List: ", appName);
            return colIndex;
        }
    }
    return false;
}


module.exports = { getAppCoordinates, getAppCoordinatesInFavoriteList };
