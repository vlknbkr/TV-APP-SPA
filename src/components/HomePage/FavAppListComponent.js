// src/components/HomePage/FavAppListComponent.js
import { BaseComponent } from '../BasePage/BaseComponent.js';
import { FavAppItemComponent } from './FavAppItemComponent.js';

export class FavAppListComponent extends BaseComponent {
  static SELECTORS = {
    list: '#favourite-apps[role="list"]',
    item: '[role="listitem"][data-testid]',
    visible: '[aria-hidden="false"]',
    ready: '[data-content-ready="true"]',
    focusedAttr: 'data-focused',
    focusedValue: 'focused',
  };

  constructor(root, page) {
    super(root, page);
    
    this.listRoot = this.root.locator('#favourite-apps[role="list"]');
    // 1. Initialize core locators in constructor to avoid undefined errors
    this.listLocator = this.root.locator(FavAppListComponent.SELECTORS.list);

    // We chain from this.listLocator to ensure we only find items inside this list
    this.visibleListLocator = this.listLocator.filter({
      has: page.locator(FavAppListComponent.SELECTORS.visible)
    });

    this.itemsLocator = this.visibleListLocator.locator(FavAppListComponent.SELECTORS.item);
  }

  list() {
    return this.listLocator;
  }

  items() {
    return this.itemsLocator;
  }

  item(appName) {
    const tile = this.appLocator(appName);
    return new FavAppItemComponent(tile, this.page);
  }

  editItem(appName) {
    return this.listRoot.locator(`[role="listitem"][data-testid="${appName}"]`);
  }

  appLocator(appName) {
    return this.visibleListLocator.locator(`[role="listitem"][data-testid="${appName}"]`).first();
  }

  /**
   * Waits for the list to be visible and for the app to signal content is ready.
   */
  async waitForReady() {
    await this.visibleListLocator.waitFor({ state: 'visible' });
  }

  async exists(appName) {
    return (await this.appLocator(appName).count()) > 0;
  }


  async focusedIndex() {
    return this.itemsLocator.evaluateAll((els, attr) =>
      els.findIndex((el) => el.getAttribute(attr) === 'focused'),
      FavAppListComponent.SELECTORS.focusedAttr
    );
  }

  async count() {
    return this.itemsLocator.count();
  }

  async appIndex(appName) {
    return this.itemsLocator.evaluateAll((els, name) =>
      els.findIndex((el) => el.getAttribute('data-testid') === name),
      appName
    );
  }
}