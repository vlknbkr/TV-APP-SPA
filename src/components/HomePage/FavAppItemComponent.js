import { AppItemComponent } from '../AppPage/AppItemComponent.js';

export class FavAppItemComponent extends AppItemComponent {
  static SELECTORS = {
    removeButton: '[data-testid="editmode-remove-app"]',
    focusedAttr: 'data-focused',
    disabledValue: 'disabled'
  };

  constructor(root, page) {
    super(root, page);
    this.removeButtonLocator = this.root.locator(
      FavAppItemComponent.SELECTORS.removeButton);
  }

  removeButton() {
    return this.removeButtonLocator;
  }

  async isRemoveDisabled() {
    const focusState = await this.removeButtonLocator
      .getAttribute(FavAppItemComponent.SELECTORS.focusedAttr);

    if (focusState?.toLowerCase() === FavAppItemComponent
      .SELECTORS.disabledValue) {
      return true;
    }

    return await this.removeButtonLocator.isDisabled();
  }
}