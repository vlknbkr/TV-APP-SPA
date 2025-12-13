const { BasePage } = require('../core/BasePage');
import { getAppCoordinatesInFavoriteList } from "../utils/AppUtils.js";


class HomePage extends BasePage {
    constructor(page) {
        super(page);
    }

    async open() {
        await this.goto();
    }

    async goToApp(appName) {
        const index = await getAppCoordinatesInFavoriteList(this.page, appName);
        if (index === false) {
            throw new Error(`App not found: ${appName}`);
        }
        let colIndex = index;
        await this.remote.right(colIndex);
    }

    async deleteFromFavorites(appName) {

    }
}

module.exports = { HomePage };
