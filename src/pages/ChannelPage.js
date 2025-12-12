const { BasePage } = require('../core/BasePage');

class ChannelPage extends BasePage {
    async open() {
        await this.goto('channels');
    }
}

module.exports = { ChannelPage };
