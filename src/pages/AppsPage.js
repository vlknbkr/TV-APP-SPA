import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';
import { CategoryListComponent } from '../components/AppPage/CategoryListComponent.js';

export class AppsPage extends BasePage {
  constructor(page) {
    super(page);

    this.categories = new CategoryListComponent(
      this.page.locator('[data-testid="lists-container"]')
    );
    this.category = (categoryName) => this.categories.getCategoryByName(categoryName);
    this.miniBanner = page.locator('[data-testid="mini-banner"]');
    this.miniBannerItems = this.miniBanner.locator('[role="listitem"]');
    this.addToFavoritesButton = page.locator('[id="app-fav-button"]');
  }

  async open() {
    await this.page.goto("apps");
    await this.isLoaded();
  }


  async isLoaded() {
    await expect(this.categories.locator()).toBeVisible();
    await this.miniBanner.waitFor({ state: 'visible' });
    expect(await this.miniBannerItems.count()).toBeGreaterThan(0);
  }

  async focusCategory(categoryName) {

    const rows = this.categories.getAllCategories();

    await expect(rows.first(), 'Categories not visible / not loaded').toBeVisible();

    const targetIdx = await this.categories.indexCategory(categoryName);
    if (targetIdx < 0) throw new Error(`Category "${categoryName}" not found.`);

    // Ensure focus is INSIDE the categories list (sometimes you start on menu/header)
    let currentIdx = await this.categories.focusedIndexCategory();
    for (let i = 0; i < 8 && currentIdx < 0; i++) {
      await this.remote.down();
      currentIdx = await this.categories.focusedIndexCategory();
    }
    if (currentIdx < 0) throw new Error('Could not bring focus into the categories list.');

    // abs-diff steps (your preferred style)
    const steps = Math.abs(targetIdx - currentIdx);
    const move = targetIdx > currentIdx ? () => this.remote.down() : () => this.remote.up();

    for (let s = 0; s < steps; s++) {
      await move();
    }
    await expect(this.categories.getCategoryLocator(categoryName)).toHaveAttribute('data-focused', 'focused');
  }

  async focusApp(categoryName, appName) {
    await this.focusCategory(categoryName);



    const targetIdx = await this.category(categoryName).indexApp(appName);
    if (targetIdx < 0) {
      throw new Error(`App "${appName}" not found under category "${categoryName}".`);
    }

    let currentIdx = await this.category(categoryName).focusedIndexApp();

    const steps = Math.abs(targetIdx - currentIdx);
    const move = targetIdx > currentIdx ? () => this.remote.right() : () => this.remote.left();

    for (let s = 0; s < steps; s++) {
      await move();
    }
    await expect(this.category(categoryName).getAppLocator(appName)).toHaveAttribute('data-focused', 'focused');
  }

  async addFocusedAppToFavApps(categoryName, appName) {
    await this.remote.select(this.category(categoryName).getAppLocator(appName));

    await this.remote.select(this.addToFavoritesButton);

    await Promise.race([
      this.addToFavoritesButton.waitFor({ state: 'detached', timeout: 15000 }),
      expect(this.addToFavoritesButton)
        .toHaveAttribute('data-loading', 'false', { timeout: 15000 }),
    ]);
  }
}