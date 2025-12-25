import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { FavAppListComponent } from '../components/HomePage/FavAppListComponent.js';
import { FavAppItemComponent } from '../components/HomePage/FavAppItemComponent.js';

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
    await this.page.goto("");
    await this.isLoaded();
  }

  async isLoaded() {
    // 1. Wait for the list container to exist
    await expect(this.favAppList.list()).toBeAttached();

    // 2. Wait for data-content-ready="true" and aria-hidden="false"
    await this.favAppList.waitForReady();

    // 3. Confirm target app is visible (Watch TV is a good smoke test)
    await expect(this.favAppList.appLocator('Watch TV')).toBeVisible();
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
    // Use a locator that ignores the aria-hidden state of the list
    const listRoot = this.favAppList.list(); // locator('#favourite-apps')
    const appItemRoot = listRoot.locator(`[role="listitem"][data-testid="${appName}"]`);
    const removeBtn = appItemRoot.locator('[data-testid="editmode-remove-app"]');

    // 1. Enter Edit Mode
    await this.remote.longPressSelect(appItemRoot);

    // 2. Wait for the button to attach (it exists now because we aren't filtering out aria-hidden="true")
    await expect(removeBtn).toBeAttached({ timeout: 5000 });

    // 3. Navigate and Select
    await this.remote.down();
    await expect(removeBtn).toHaveAttribute('data-focused', 'focused', { timeout: 3000 });
    await this.remote.select(removeBtn);

  }
}