// src/components/CategoryAppItemComponent.js
import { BaseComponent } from './BaseComponent.js';
import { AppItemComponent } from './AppItemComponent.js';

export class CategoryAppItemComponent extends BaseComponent {
    async getCategoryName() {
        const label = await this.root.getAttribute('aria-label');
        return (label ?? '').trim();
    }

    items() {
        return this.root.locator('[role="group"] [role="listitem"][data-testid]');
    }

    async count() {
        return this.items().count();
    }

    async exists(addData) {
        const tile = this.root.locator(
            `[role="group"] [role="listitem"][data-testid="${addData}"]`
        );
        return (await tile.count()) > 0;
    }

    item(addData) {
        const tile = this.root
            .locator(`[role="group"] [role="listitem"][data-testid="${addData}"]`)
            .first();

        return new AppItemComponent(tile, this.page);
    }
}