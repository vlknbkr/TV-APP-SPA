import { BasePage } from './BasePage.js';
import { MenuComponent } from '../components/MenuComponent.js';
import { CategoryListComponent } from '../components/CategoryListComponent.js';

export class AppsPage extends BasePage {
  constructor(page) {
    super(page);

    this.categories = new CategoryListComponent(
      this.page.locator('[data-testid="lists-container"]')
    );
  }

  async open() {
    await this.page.goto(process.env.BASE_URL);
    await this.isLoaded();
  }


  async isLoaded() {
    await expect(this.menuBar).toBeVisible();
    await expect(this.categories.locator()).toBeVisible();
    await this.categories.firstList().waitFor({ state: 'visible' });
  }

  async focusCategory(categoryName) {
    const category = this.categories.categoryByName(categoryName);

    if (await category.isFocused()) return;

    await this.remote.moveTo(async () => category.isFocused(), {
      attempts: 25,
      action: () => this.remote.down(),
    });
  }

  async focusApp(categoryName, addData) {
    const category = this.categories.categoryByName(categoryName);
    await this.focusCategory(categoryName);

    const app = category.item(addData);

    if (await app.isFocused()) return;

    await this.remote.moveTo(async () => app.isFocused(), {
      attempts: 40,
      action: () => this.remote.right(),
    });
  }

  async addFocusedAppToFavApps() {
    await this.remote.select();
    await this.page.waitForTimeout(250);
  }
}