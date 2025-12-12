const { BasePage } = require('../core/BasePage');

class HomePage extends BasePage {
    async open() {
        await this.goto();
    }
}

module.exports = { HomePage };
