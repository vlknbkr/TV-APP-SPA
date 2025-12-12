const { BasePage } = require('../core/BasePage');

class AppsPage extends BasePage {
    async open() {
        await this.goto('page/499');
    }
}

module.exports = { AppsPage };
