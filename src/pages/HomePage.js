import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { FavAppListComponent } from '../components/HomePage/FavAppListComponent.js';

export class HomePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.favAppList = new FavAppListComponent(this.page.locator('[data-testid="user-apps"]'));
    this.favList = this.favAppList.locator('[role="list"][aria-label="Favourite Apps"]');
    this.watchTV = this.favList.locator('[role="listitem"][aria-label="Watch TV"]');
    this.targetApp = (addData) => this.favList.locator(`[role="listitem"][data-testid="${addData}"]`);
    this.focusedItem = this.page.locator(
      '[data-testid="user-apps"] [role="list"][aria-label="Favourite Apps"] [role="listitem"][data-focused="focused"]'
    );

  }

  async open() {
    await this.page.goto("");
    await this.isLoaded();
  }

  async isLoaded() {
    await expect(this.favList).toBeVisible();
    await expect(this.watchTV).toBeVisible();
  }

  async focusFavApp(addData) {
    const list = this.favList;

    const count = await this.favAppList.count();
    if (count === 0) throw new Error('Favourite Apps row is empty.');

    const current = await this.favAppList.focusedIndex();
    if (current < 0) throw new Error('No focused item found in Favourite Apps row.');

    const target = await this.favAppList.appIndex(addData);
    if (target < 0) throw new Error(`Fav app "${addData}" not found in Favourite Apps row.`);

    if (current === target) {
      await expect(this.favAppList.items().nth(target)).toHaveAttribute('data-focused', 'focused');
      return;
    }

    const steps = Math.abs(target - current);
    const move = target > current ? () => this.remote.right() : () => this.remote.left();

    for (let s = 0; s < steps; s++) {
      await move();
    }

    await expect(this.favAppList.items().nth(target)).toHaveAttribute('data-focused', 'focused');
  }

  async openEditModeOnFavApp(addData) {
    await this.focusFavApp(addData);

    const target = this.targetApp(addData);

    await this.remote.longPressSelect(target);

    await expect(this.focusedItem).toBeVisible();

    await expect(
      this.focusedItem.locator('[data-testid="editmode-remove-app"]'),
      'Edit mode delete button did not appear'
    ).toBeVisible();
  }

  async removeFocusedFavApp() {
    const removeBtn = this.focusedItem.locator('[data-testid="editmode-remove-app"]');

    await expect(removeBtn, 'Remove button not visible (are you in edit mode?)').toBeVisible();
    await this.remote.down();

    // If disabled, fail with a clear message (tests can catch this for Watch TV)
    const btnFocusState = await removeBtn.getAttribute('data-focused');
    if (btnFocusState === 'disabled') {
      const label = await this.focusedItem.getAttribute('aria-label');
      throw new Error(`Remove is disabled for "${label}" (expected for non-removable apps like Watch TV).`);
    }

    await this.remote.select(removeBtn);

    // Optional: wait for UI to settle after removal
    await this.page.waitForTimeout(3000);
  }
}