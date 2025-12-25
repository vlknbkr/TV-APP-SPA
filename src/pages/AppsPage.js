import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';
import { MiniBannerComponent } from '../components/AppPage/MiniBannerComponent.js';
import { CategoryListComponent } from '../components/AppPage/CategoryListComponent.js';

export class AppsPage extends BasePage {
  constructor(page) {
    super(page);

    this.categories = new CategoryListComponent(
      this.page.locator('[data-testid="lists-container"]'),
      this.page
    );

    this.miniBanner = new MiniBannerComponent(
      this.page.locator('[data-testid="mini-banner"]'),
      this.page
    );
    this.addToFavoritesButton = this.page.locator('[id="app-fav-button"]');
  }

  async open() {
    await this.navigate('apps');
    await this.isLoaded();
  }

  async isLoaded() {
    await expect(this.categories.root).toBeVisible();
    await this.miniBanner.waitForLoaded();

    const count = await this.miniBanner.getCount();
    expect(count).toBeGreaterThan(0);
  }

  async focusCategory(categoryName) {
    const targetIdx = await this.categories.indexCategory(categoryName);
    if (targetIdx < 0) throw new Error(`Category "${categoryName}" not found.`);

    let currentIdx = await this.categories.focusedIndexCategory();

    for (let i = 0; i < 5 && currentIdx < 0; i++) {
      await this.remote.down();
      currentIdx = await this.categories.focusedIndexCategory();
    }

    const steps = Math.abs(targetIdx - currentIdx);
    const move = targetIdx > currentIdx ? () => this.remote.down() : () => this.remote.up();

    for (let s = 0; s < steps; s++) { await move(); }

    await expect(this.categories.getCategoryLocator(categoryName)).toHaveAttribute('data-focused', 'focused');
  }

  async focusApp(categoryName, appName) {
    await this.focusCategory(categoryName);
    const categoryRow = this.categories.getCategoryByName(categoryName);

    const targetIdx = await categoryRow.indexApp(appName);
    if (targetIdx < 0) throw new Error(`App "${appName}" not found in "${categoryName}".`);

    let currentIdx = await categoryRow.focusedIndexApp();
    const steps = Math.abs(targetIdx - currentIdx);
    const move = targetIdx > currentIdx ? () => this.remote.right() : () => this.remote.left();

    for (let s = 0; s < steps; s++) { await move(); }
    const targetApp = categoryRow.getAppLocator(appName);

    await expect(targetApp).toHaveAttribute('data-focused', 'focused', { timeout: 10000 });
  }

  async addFocusedAppToFavApps(categoryName, appName) {
    const categoryRow = this.categories.getCategoryByName(categoryName);
    const targetAppLocator = categoryRow.getAppLocator(appName);

    await this.remote.select(targetAppLocator);

    await expect(this.addToFavoritesButton).toBeVisible();
    await this.remote.select(this.addToFavoritesButton);

    await Promise.race([
      this.addToFavoritesButton.waitFor({ state: 'detached', timeout: 30000 }),
      expect(this.addToFavoritesButton)
        .toHaveAttribute('data-loading', 'false', { timeout: 30000 }),
    ]);
  }
}