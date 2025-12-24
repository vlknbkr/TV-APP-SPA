import { BasePage } from './BasePage';
import { MenuComponent } from '../components/MenuComponent';

export class SearchPage extends BasePage {
  constructor(page) {
    super(page);
    this.menu = new MenuComponent(this.page.locator('[role="menubar"]'));
  }

  async open() { }

  async isLoaded() { }

  async focusCategory(categoryName) { }
}
