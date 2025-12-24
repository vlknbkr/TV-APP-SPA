import { BaseComponent } from './BaseComponent.js';

export class MenuItemComponent extends BaseComponent {


  locator() {
    return this.root;
  }

  async getLabel() {
    // Prefer aria-label (most stable). Fallback to text.
    const aria = await this.root.getAttribute('aria-label');
    if (aria?.trim()) return aria.trim();

    const txt = await this.root.textContent();
    return (txt ?? '').trim();
  }

  async isSelected() {
    // Menu selection is represented by aria-selected="true"
    const selected = await this.root.getAttribute('aria-selected');
    return selected === 'true';
  }

  async isFocused() {
    // Virtual focus system
    const dataFocused = await this.root.getAttribute('data-focused');
    if (dataFocused === 'focused') return true;

    const isFocused = await this.root.getAttribute('data-is-focused');
    return isFocused === 'true';
  }
}