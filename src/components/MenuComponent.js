import { BaseComponent } from './BaseComponent.js';

export class MenuComponent extends BaseComponent {


  items() {
    // return actual clickable/interactive items
    return this.root.locator('[role="menuitem"][aria-label]');
  }

  itemByLabel(label) {
    // aria-label is unique and stable (best choice here)
    return this.root.locator(`[role="menuitem"][aria-label="${label}"]`);
  }

  async getSelectedLabel() {
    // preferred: aria-selected="true" (your DOM has it)
    const selected = this.items().filter({
      has: this.page.locator('[aria-selected="true"]'),
    });

    const selectedItem = (await selected.count())
      ? selected.first()
      : this.items().filter({ has: this.page.locator('[data-focused="focused"]') }).first();

    const aria = await selectedItem.getAttribute('aria-label');
    return aria?.trim() ?? '';
  }

  async selectedIndex() {
    const all = this.items();
    const count = await all.count();

    for (let i = 0; i < count; i++) {
      const item = all.nth(i);

      const ariaSelected = await item.getAttribute('aria-selected');
      const focused = await item.getAttribute('data-focused');
      const isFocused = await item.getAttribute('data-is-focused');

      if (ariaSelected === 'true' || focused === 'focused' || isFocused === 'true') {
        return i;
      }
    }

    return -1;
  }
}