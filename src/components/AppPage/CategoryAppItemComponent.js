// src/components/CategoryAppItemComponent.js
import { BaseComponent } from '../BasePage/BaseComponent.js';
import { AppItemComponent } from './AppItemComponent.js';

export class CategoryAppItemComponent extends BaseComponent {
    async getCategoryName() {
        const label = await this.root.getAttribute('aria-label');
        return (label ?? '').trim();
    }

    group() {
        return this.root.locator('[role="group"]').first();
    }

    items() {
        return this.group().locator('[role="listitem"][data-testid]');
    }

    getAppLocator(appName) {
        return this.root.locator(
            `[role="group"] [role="listitem"][data-testid="${appName}"]`
        ).first();
    }

    item(appName) {
        const tile = this.group()
            .locator(`[role="listitem"][data-testid="${appName}"][aria-hidden="false"]`)
            .first();

        return new AppItemComponent(tile, this.page);
    }

    async count() {
        return this.items().count();
    }

    async exists(appName) {
        return (await this.group()
            .locator(`[role="listitem"][data-testid="${appName}"][aria-hidden="false"]`)
            .count()) > 0;
    }

    async isFocused() {
        const focused = await this.root.getAttribute('data-focused');
        const isFocused = await this.root.getAttribute('data-is-focused');
        return focused === 'focused' || isFocused === 'true';
    }

    async indexApp(appName) {
        return this.items().evaluateAll((els, name) => {
            const n = String(name);
            return els.findIndex((el) => {
                const tid = el.getAttribute('data-testid');
                const label = el.getAttribute('aria-label');
                return tid === n || label === n;
            });
        }, appName);
    }

    async focusedIndexApp() {
        return this.items().evaluateAll((els) => {
            return els.findIndex((el) => el.getAttribute('data-focused') === 'focused');
        });
    }
}