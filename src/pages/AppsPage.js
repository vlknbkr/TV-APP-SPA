import { BasePage } from './BasePage.js';
import { MenuComponent } from '../components/MenuComponent.js';
import { CategoryListComponent } from '../components/CategoryListComponent.js';

export class AppsPage extends BasePage {
  constructor(page) {
    super(page);

    // ✅ stable root: the menubar wrapper
    this.menu = new MenuComponent(this.page.locator('[role="menubar"]'));

    // ✅ your new strategy: lists-container as root
    this.categories = new CategoryListComponent(
      this.page.locator('[data-testid="lists-container"]')
    );
  }

  async open() {
    await this.page.goto(process.env.BASE_URL);
    await this.isLoaded();
  }

  async isLoaded() {
    // menu should exist, lists should be visible
    await this.menu.locator().waitFor({ state: 'visible' });
    await this.categories.locator().waitFor({ state: 'visible' });
    // optional: content ready on first list
    await this.categories.firstList().waitFor({ state: 'visible' });
  }

  async focusCategory(categoryName) {
    const category = this.categories.categoryByName(categoryName);

    // If it’s already focused, do nothing
    if (await category.isFocused()) return;

    // Move until focused (your Remote/keyboard logic likely lives in BasePage or BaseComponent)
    await this.remote.moveTo(async () => category.isFocused(), {
      // these directions depend on your current focus position
      // keep simple: try down a few times
      attempts: 25,
      action: () => this.remote.down(),
    });
  }

  async focusApp(categoryName, addData) {
    const category = this.categories.categoryByName(categoryName);
    await this.focusCategory(categoryName);

    // inside that category row, focus the app item by data-testid (addData)
    const app = category.item(addData);

    if (await app.isFocused()) return;

    await this.remote.moveTo(async () => app.isFocused(), {
      attempts: 40,
      action: () => this.remote.right(),
    });
  }

  async addFocusedAppToFavApps() {
    // Usually: press OK / Enter on focused app
    await this.remote.select();

    // If there is a toast / UI feedback in your app, assert it here.
    // Otherwise keep it generic: wait for network/idle or small stable condition.
    await this.page.waitForTimeout(250);
  }
}