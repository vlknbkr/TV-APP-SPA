import { BaseComponent } from './BaseComponent.js';

export class AppItemComponent extends BaseComponent {
  /**
   * @param {import('@playwright/test').Locator} root
   */
  constructor(root) {
    super(root);
  }

  /**
   * In TitanOS DOM, the most stable "name" signal is aria-label.
   * Fallback to data-testid, then textContent.
   */
  async getName() {
    const aria = await this.root.getAttribute('aria-label');
    if (aria?.trim()) return aria.trim();

    const testId = await this.root.getAttribute('data-testid');
    if (testId?.trim()) return testId.trim();

    const txt = await this.root.textContent();
    return (txt || '').trim();
  }

  async getTestId() {
    return (await this.root.getAttribute('data-testid'))?.trim() || '';
  }

  /**
   * TitanOS uses data-focused="focused" on focused elements.
   * Some containers may use "true". Support both.
   */
  async isFocused() {
    const v = (await this.root.getAttribute('data-focused'))?.trim();
    return v === 'focused' || v === 'true';
  }

  locator() {
    return this.root;
  }
}