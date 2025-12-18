export class RemoteControl {
    constructor(page, options = {}) {
        this.page = page;
        this.delay = options.delay ?? 200;
        this.log = options.log ?? true;
    }

    async press(key, times = 1) {
        for (let i = 0; i < times; i++) {
            await this.page.keyboard.press(key, { delay: this.delay });
        }
        this._log(`${key} pressed ${times} times`);
    }

    async left(times = 1) {
        await this.press('ArrowLeft', times);
    }

    async right(times = 1) {
        await this.press('ArrowRight', times);
    }

    async up(times = 1) {
        await this.press('ArrowUp', times);
    }

    async down(times = 1) {
        await this.press('ArrowDown', times);
    }

    async select() {
        await this.page.keyboard.press('Enter', { delay: this.delay });
        this._log('SELECT button pressed');
    }

    async back() {
        await this.page.keyboard.press('Backspace', { delay: this.delay });
        this._log('BACK button pressed');
    }

    async longPressSelect(duration = 2000) {
        await this.page.keyboard.down('Enter');
        await this.page.waitForTimeout(duration);
        await this.page.keyboard.up('Enter');
        this._log(`SELECT button long pressed (${duration}ms)`);
    }

    _log(message) {
        if (this.log) {
            console.log(message);
        }
    }
}