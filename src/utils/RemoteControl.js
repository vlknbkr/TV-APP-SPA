class RemoteControl {
    constructor(page) {
        this.page = page;
    }

    async left(times = 1) {
        await this.page.keyboard.press('ArrowLeft');
    }
    async right(times = 1) {
        await this.page.keyboard.press('ArrowRight');
    }
    async down(times = 1) {
        await this.page.keyboard.press('ArrowDown');
    }
    async up(times = 1) {
        await this.page.keyboard.press('ArrowUp');
    }
    async select() {
        await this.page.keyboard.press('Enter');
    }
    async back() {
        await this.page.keyboard.press('Backspace');
    }

    async longPressOk(duration = 2000) {
        await this.page.keyboard.down('Enter');
        await this.page.waitForTimeout(duration);
        await this.page.keyboard.up('Enter');
        await this.page.waitForTimeout(500);
    }
}

module.exports = { RemoteControl };
