import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { SearchComponent } from '../components/SearchPage/SearchComponent.js';

export class SearchPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.search = new SearchComponent(page);
    this.GRID_COLS = 6;
  }

  async open() {
    await this.navigate('search');
    await this.isLoaded();
  }

  async isLoaded() {
    await expect(this.search.bar.input(), 'Search input should be visible').toBeVisible();
    await expect(this.search.genres.list(), 'Genres list should be visible').toBeVisible();
  }

  async openGenre(name) {
    await this.isLoaded();

    const targetIdx = await this.search.genres.indexGenre(name);

    await expect.poll(async () => {
      const idx = await this.search.genres.focusedIndex();
      if (idx >= 0) return true;
      await this.remote.down();
      return false;
    }, {
      timeout: 5000,
      message: 'Could not move focus from search bar to genres grid.'
    }).toBe(true);

    await this._moveFocusInGrid(targetIdx, this.GRID_COLS);

    await this.remote.select();
    await this.search.results.waitUntilResolved();
  }

  async _moveFocusInGrid(targetIdx, cols) {
    const currentIdx = await this.search.genres.focusedIndex();

    const curRow = Math.floor(currentIdx / cols);
    const curCol = currentIdx % cols;
    const tgtRow = Math.floor(targetIdx / cols);
    const tgtCol = targetIdx % cols;

    const rowDiff = tgtRow - curRow;
    const colDiff = tgtCol - curCol;

    if (rowDiff > 0) await this.remote.down(rowDiff);
    if (rowDiff < 0) await this.remote.up(Math.abs(rowDiff));

    if (colDiff > 0) await this.remote.right(colDiff);
    if (colDiff < 0) await this.remote.left(Math.abs(colDiff));

    await expect.poll(() => this.search.genres.focusedIndex()).toBe(targetIdx);
  }
}