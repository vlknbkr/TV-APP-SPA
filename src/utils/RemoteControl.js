class RemoteControl {
    constructor(page) {
        this.page = page;
    }

    async left(times = 1) {
        for (let i = 0; i < times; i++) {
            await this.page.keyboard.press('ArrowLeft');
            await this.page.waitForTimeout(200);
        }
    }
    async right(times = 1) {
        for (let i = 0; i < times; i++) {
            await this.page.keyboard.press('ArrowRight');
            await this.page.waitForTimeout(200);
        }
    }
    async down(times = 1) {
        for (let i = 0; i < times; i++) {
            await this.page.keyboard.press('ArrowDown');
            await this.page.waitForTimeout(200);
        }
    }
    async up(times = 1) {
        for (let i = 0; i < times; i++) {
            await this.page.keyboard.press('ArrowUp');
            await this.page.waitForTimeout(200);
        }
    }
    async select() {
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(200);
    }
    async back() {
        await this.page.keyboard.press('Backspace');
        await this.page.waitForTimeout(200);
    }

    async longPressSelect(duration = 2000) {
        await this.page.keyboard.down('Enter');
        await this.page.waitForTimeout(duration);
        await this.page.keyboard.up('Enter');
        await this.page.waitForTimeout(3000);
    }
}

export default { RemoteControl };
