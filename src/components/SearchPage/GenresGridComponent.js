// src/components/GenresGridComponent.js
import { expect } from '@playwright/test';

export class GenresGridComponent {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    list() {
        // Stable and matches your DOM snapshot
        return this.page.locator('#search-genres[role="list"][aria-label="Genre"]');
    }

    tiles() {
        return this.list().locator('[role="listitem"][aria-label]');
    }

    tileByName(name) {
        // In DOM: <div role="listitem" aria-label="Action" ...>
        return this.list().locator(`[role="listitem"][aria-label="${name}"]`).first();
    }

    tileCardByName(name) {
        // Focus is on inner card: [data-focused="focused"]
        return this.tileByName(name).locator('[data-testid][data-focused]').first();
    }

    async indexGenre(name) {
        await expect(this.list(), 'Genre grid is not visible').toBeVisible();
        await expect(async () => {
            const count = await this.tiles().count();
            expect(count).toBeGreaterThan(0);
        }).toPass();

        const labels = await this.tiles().evaluateAll((els) => {
            return els.map(el => (el.getAttribute('aria-label') || '').trim());
        });

        const idx = labels.indexOf(name);
        if (idx === -1) {
            throw new Error(`Genre "${name}" not found. Available: ${labels.join(', ')}`);
        }
        return idx;
    }

    async focusedIndex() {
        await expect(this.list(), 'Genre grid is not visible').toBeVisible();

        return this.tiles().evaluateAll((els) => {
            return els.findIndex((tile) => !!tile.querySelector('[data-focused="focused"]'));
        });
    }
}