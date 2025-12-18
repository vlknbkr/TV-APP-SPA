import { expect } from '@playwright/test';


export class RemoteControl {
    /**
     * @param {import('@playwright/test').Page} page
     * @param {{ delay?: number, log?: boolean }} [options]
     */
    constructor(page, options = {}) {
        this.page = page;
        this.delay = options.delay ?? 200;
        this.log = options.log ?? true;
        this.focusedSelector = '[data-focused="focused"], [data-focused="true"]';
    }

    _log(message) {
        if (this.log) console.log(message);
    }

    async press(key, times = 1) {
        for (let i = 0; i < times; i++) {
            await this.page.keyboard.press(key, { delay: this.delay });
            this._log(`[Remote] ${key}`);
        }
    }

    /**
     * Returns a best-effort "signature" for the currently focused element.
     * Useful for asserting focus moved after a key press.
     */
    async getFocusedSignature() {
        const focused = this.page.locator(this.focusedSelector).first();
        if ((await focused.count()) === 0) return null;
        return await focused.evaluate((el) => {
            const dt = el.getAttribute('data-testid');
            const al = el.getAttribute('aria-label');
            const id = el.getAttribute('id');
            const role = el.getAttribute('role');
            return dt || al || id || role || el.tagName;
        });
    }

    async pressAndWaitForFocusChange(key, { times = 1, timeout = 8000 } = {}) {
        const before = await this.getFocusedSignature();
        await this.press(key, times);

        await expect
            .poll(async () => await this.getFocusedSignature(), { timeout })
            .not.toBe(before);
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
        await this.press('Enter', 1);
        this._log('[Remote] SELECT');
    }

    async back() {
        await this.press('Backspace', 1);
        this._log('[Remote] BACK');
    }

    async longPressSelect(duration = 2000) {
        this._log(`[Remote] LONG SELECT (${duration}ms)`);
        //const before = await this.getFocusedSignature();
        await this.page.keyboard.down('Enter');
        await this.page.waitForTimeout(duration);
        await this.page.keyboard.up('Enter');
        // After long press, focus often moves to a context menu; try to detect a change.
        //await expect
        //    .poll(async () => await this.getFocusedSignature(), { timeout: 8000 })
        //    .not.toBe(before);
    }
}
