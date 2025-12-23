import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { MenuComponent } from '../components/MenuComponent.js';
import { FavAppListComponent } from '../components/FavAppListComponent.js';

export class HomePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ✅ Root locators based on stable attributes (your requested strategy)
    this.menu = new MenuComponent(this.page.locator('[role="menubar"]'));
    this.favApps = new FavAppListComponent(this.page.locator('[data-testid="user-apps"]'));
  }

  async open() {
    await this.page.goto(process.env.BASE_URL);
    await this.isLoaded();
  }

  async isLoaded() {
    await expect(this.page.locator('[role="menubar"]')).toBeVisible();

    await expect(this.page.locator('[data-testid="user-apps"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="user-apps"] [role="list"][aria-label="Watch TV"]'))
      .toBeVisible();
  }

  /**
   * Focus a favourite app item by data-testid / aria-label (they match)
   * @param {string} addData e.g. "Netflix"
   */
  async focusFavApp(addData) {
    const list = this.favApps.locator().locator('[role="list"][aria-label="Favourite Apps"]');
    await expect(list).toBeVisible();

    const target = list.locator(`[role="listitem"][data-testid="${addData}"]`);
    await expect(target, `Fav app "${addData}" not found in Favourite Apps row`).toHaveCount(1);

    // Try a bounded navigation loop: move right until focused
    // (Assumes focus starts somewhere in the row after Home is opened)
    for (let i = 0; i < 30; i++) {
      const focused = await target.getAttribute('data-focused');
      if (focused === 'focused') return;

      await this.pressRight();
    }

    // If not found by moving right, try left as fallback
    for (let i = 0; i < 30; i++) {
      const focused = await target.getAttribute('data-focused');
      if (focused === 'focused') return;

      await this.pressLeft();
    }

    throw new Error(`Could not focus fav app "${addData}" after navigating left/right.`);
  }

  /**
   * Enter edit mode on a favourite app (long OK)
   * @param {string} addData e.g. "Netflix"
   */
  async openEditModeOnFavApp(addData) {
    await this.focusFavApp(addData);

    // Long press OK to open edit controls (delete/move)
    await this.longSelect(800);

    // Verify delete button exists for the focused item
    const focusedItem = this.page.locator(
      '[data-testid="user-apps"] [role="list"][aria-label="Favourite Apps"] [role="listitem"][data-focused="focused"]'
    );

    await expect(focusedItem).toBeVisible();
    await expect(
      focusedItem.locator('[data-testid="editmode-remove-app"]'),
      'Edit mode delete button did not appear'
    ).toBeVisible();
  }

  /**
   * Removes the currently focused favourite app (in edit mode)
   * NOTE: "Watch TV" should be non-removable - your test should assert disabled state separately.
   */
  async removeFocusedFavApp() {
    const focusedItem = this.page.locator(
      '[data-testid="user-apps"] [role="list"][aria-label="Favourite Apps"] [role="listitem"][data-focused="focused"]'
    );

    await expect(focusedItem, 'No focused favourite app item').toBeVisible();

    const removeBtn = focusedItem.locator('[data-testid="editmode-remove-app"]');
    await expect(removeBtn, 'Remove button not visible (are you in edit mode?)').toBeVisible();

    // If disabled, fail with a clear message (tests can catch this for Watch TV)
    const btnFocusState = await removeBtn.getAttribute('data-focused');
    if (btnFocusState === 'disabled') {
      const label = await focusedItem.getAttribute('aria-label');
      throw new Error(`Remove is disabled for "${label}" (expected for non-removable apps like Watch TV).`);
    }

    // Ensure button is focused (some UIs require navigating down into edit controls)
    if (btnFocusState !== 'focused') {
      // often edit controls appear "above" item, try up/down a bit
      await this.pressUp();
      await this.pressDown();
    }

    await this.select();

    // Optional: wait for UI to settle after removal
    await this.page.waitForTimeout(400);
  }
}