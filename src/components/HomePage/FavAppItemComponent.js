import { AppItemComponent } from '../AppPage/AppItemComponent.js';

export class FavAppItemComponent extends AppItemComponent {
  removeButton() {
    // Visible only in edit mode (after long press)
    return this.root.locator('[data-testid="editmode-remove-app"]');
  }

  async isRemoveDisabled() {
    const btn = this.removeButton();

    // TitanOS often encodes disabled state via data-focused="disabled"
    const focusState = (await btn.getAttribute('data-focused'))?.toLowerCase();
    if (focusState === 'disabled') return true;

    // Fallbacks (defensive)
    const ariaDisabled = (await btn.getAttribute('aria-disabled'))?.toLowerCase();
    if (ariaDisabled === 'true') return true;

    const disabledAttr = await btn.getAttribute('disabled');
    if (disabledAttr !== null) return true;

    return false;
  }
}