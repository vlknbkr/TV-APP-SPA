// src/components/SearchBarComponent.js
import { BaseComponent } from '../BasePage/BaseComponent.js';

export class SearchBarComponent extends BaseComponent {
  /**
   * @param {import('@playwright/test').Locator} root
   * @param {import('@playwright/test').Page} page
   */
  constructor(root, page) {
    super(root, page);
  }

  inputBox() {
    return this.root.locator('#search-input');
  }

  input() {
    return this.inputBox().locator('input');
  }

  clearButton() {
    return this.root.locator('#search-input-clear');
  }
}