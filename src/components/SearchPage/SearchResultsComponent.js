import { expect } from '@playwright/test';
import { BaseComponent } from '../BasePage/BaseComponent.js';

export class SearchResultsComponent extends BaseComponent {
  static SELECTORS = {
    resultsRoot: '._searchResults_mzaal_1',
    tabs: '#search-results-tabs[role="tablist"]',
    grid: '#search-results-grid[role="list"]',
    emptyState: '._emptySearchResults_d06y8_1'
  };

  constructor(root, page) {
    super(root, page);
  }

  container() { return this.root.locator(SearchResultsComponent.SELECTORS.resultsRoot); }
  tabs() { return this.container().locator(SearchResultsComponent.SELECTORS.tabs); }
  grid() { return this.container().locator(SearchResultsComponent.SELECTORS.grid); }
  emptyState() { return this.container().locator(SearchResultsComponent.SELECTORS.emptyState); }

  async waitUntilResolved(timeout = 15000) {
    await expect(this.container()).toHaveAttribute('data-visible', 'true', { timeout });
    
    await expect.poll(async () => {
      const gridVisible = await this.grid().isVisible();
      const emptyVisible = await this.emptyState().isVisible();
      return gridVisible || emptyVisible;
    }, { timeout }).toBe(true);
  }
}