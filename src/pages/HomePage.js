import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { FavAppListComponent } from '../components/HomePage/FavAppListComponent.js';

export class HomePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.favAppList = new FavAppListComponent(
      this.page.locator('[data-testid="user-apps"]'),
      this.page
    );
  }

  async open() {
    await this.navigate('');
    await this.isLoaded();
  }

  async isLoaded() {
    await expect(this.favAppList.list()).toBeAttached();
    await this.favAppList.waitForReady();
    await expect(this.favAppList.appLocator('Watch TV')).toBeVisible();
  }

  async isAppInFavorites(appName) {
    return await this.favAppList.exists(appName);
  }

  async focusFavApp(appName) {
    const count = await this.favAppList.count();
    if (count === 0) throw new Error('Favourite Apps row is empty.');

    const current = await this.favAppList.focusedIndex();
    if (current < 0) throw new Error('No focused item found in Favourite Apps row.');

    const target = await this.favAppList.appIndex(appName);
    if (target < 0) throw new Error(`Fav app "${appName}" not found in Favourite Apps row.`);

    if (current === target) return;

    const steps = Math.abs(target - current);
    const move = target > current ? () => this.remote.right() : () => this.remote.left();

    for (let s = 0; s < steps; s++) {
      await move();
    }

    await expect(this.favAppList.items().nth(target)).toHaveAttribute('data-focused', 'focused');
  }

  async removeFocusedFavApp(appName) {
    const listRoot = this.favAppList.list();
    const appItemRoot = listRoot.locator(`[role="listitem"][data-testid="${appName}"]`);
    const removeBtn = appItemRoot.locator('[data-testid="editmode-remove-app"]');

    await this.remote.longPressSelect(appItemRoot);

    await expect(removeBtn).toBeAttached({ timeout: 5000 });

    await this.remote.down();

    await expect(removeBtn).toHaveAttribute('data-focused', 'focused', { timeout: 3000 });
    await this.remote.select(removeBtn);
  }
}