const { BasePage } = require('../core/BasePage');

class SearchPage extends BasePage {
    async open() {
        await this.goto('search');
    }
}

module.exports = { SearchPage };
