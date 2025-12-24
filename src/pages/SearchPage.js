// src/pages/SearchPage.js
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
    await this.page.goto("search");
    await this.isLoaded();
  }

  async isLoaded() {
    await expect(this.search.bar.input(), 'Search input should be visible').toBeVisible();
    await expect(this.search.genres.list(), 'Genres list should be visible').toBeVisible();
  }

  async openGenre(name) {
    await this.isLoaded();

    const targetIdx = await this.search.genres.indexGenre(name);
    if (targetIdx < 0) throw new Error(`Genre "${name}" not found in genres grid.`);

    await this._ensureGenreGridHasFocus();

    await this._moveFocusInGrid(targetIdx, this.GRID_COLS);

    await this.remote.select();

    await this.search.results.waitUntilResolved();
  }

  async _ensureGenreGridHasFocus() {
    
    for (let i = 0; i < 6; i++) {
      const focusedIdx = await this.search.genres.focusedIndex();
      if (focusedIdx >= 0) return;
      await this.remote.down(1);
    }
    throw new Error('Could not move focus from search bar to genres grid.');
  }

  async _moveFocusInGrid(targetIdx, cols) {
    const currentIdx = await this.search.genres.focusedIndex();
    if (currentIdx < 0) throw new Error('No focused genre tile found.');

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

    const finalIdx = await this.search.genres.focusedIndex();
    if (finalIdx !== targetIdx) {
      throw new Error(`Focus mismatch. Expected index ${targetIdx}, got ${finalIdx}.`);
    }
  }
}