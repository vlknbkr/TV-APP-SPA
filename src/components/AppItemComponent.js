// src/components/AppItemComponent.js
import { BaseComponent } from './BaseComponent';

export class AppItemComponent extends BaseComponent {
    async getName() {
        // Prefer stable contract: aria-label (matches app name in your DOM)
        const aria = await this.root.getAttribute('aria-label');
        if (aria && aria.trim()) return aria.trim();

        // Fallbacks
        const testId = await this.getDataTestId();
        if (testId && testId.trim()) return testId.trim();

        const txt = await this.root.textContent();
        return (txt ?? '').trim();
    }

    async getDataTestId() {
        return this.root.getAttribute('data-testid');
    }

    async isFocused() {
        const focused = await this.root.getAttribute('data-focused');
        return focused === 'focused' || focused === 'true';
    }

    locator() {
        return this.root;
    }
}