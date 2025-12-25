import { expect } from '@playwright/test';
import { BaseComponent } from '../BasePage/BaseComponent.js';

export class GenresGridComponent extends BaseComponent {
  static SELECTORS = {
    list: '#search-genres[role="list"]',
    tile: '[role="listitem"]',
    card: '._mediaCard_10koe_1',
    focused: '[data-focused="focused"]'
  };

  constructor(root, page) {
    super(root, page);
  }

  list() { return this.root.locator(GenresGridComponent.SELECTORS.list); }
  tiles() { return this.list().locator(GenresGridComponent.SELECTORS.tile); }

  tileByName(name) {
    return this.list().locator(`[role="listitem"][aria-label="${name}"]`).first();
  }

  tileCardByName(name) {
    return this.tileByName(name).locator(GenresGridComponent.SELECTORS.card);
  }


  async focusedIndex() {
    return this.tiles().evaluateAll((els, sel) =>
      els.findIndex(tile => !!tile.querySelector(sel)),
      GenresGridComponent.SELECTORS.focused
    );
  }

  async indexGenre(name) {
    await expect(this.list(), 'Genres grid list should be visible').toBeVisible();

    await expect.poll(async () => {
      const labels = await this.tiles().evaluateAll(els =>
        els.map(el => (el.getAttribute('aria-label') || '').trim())
      );
      return labels.indexOf(name);
    }, {
      timeout: 10000,
      message: `Genre "${name}" did not appear in the grid within timeout.`
    }).toBeGreaterThanOrEqual(0);

    const labels = await this.tiles().evaluateAll(els =>
      els.map(el => (el.getAttribute('aria-label') || '').trim())
    );
    return labels.indexOf(name);
  }
}