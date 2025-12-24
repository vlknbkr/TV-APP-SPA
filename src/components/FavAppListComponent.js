// src/components/FavAppListComponent.js
import { BaseComponent } from './BaseComponent.js';
import { FavAppItemComponent } from './FavAppItemComponent.js';

export class FavAppListComponent extends BaseComponent {

  list() {
    return this.root.locator(
      '#favourite-apps[role="list"][aria-label="Favourite Apps"][aria-hidden="false"]');
  }

  items() {
    return this.list().locator(
      '[role="listitem"][data-testid][aria-hidden="false"]');
  }

  async count() {
    return this.items().count();
  }

  async isContentReady() {
    const ready = await this.list().getAttribute('data-content-ready');
    return ready === 'true';
  }

  appLocator(appName) {
    return this.list().locator(
      `[role="listitem"][data-testid="${appName}"][aria-hidden="false"]`
    );
  }

  async exists(appName) {
    return (await this.appLocator(appName, { visibleOnly: true }).count()) > 0;
  }

  item(appName) {
    const tile = this.list()
      .locator(`[role="listitem"][data-testid="${appName}"][aria-hidden="false"]`)
      .first();
    return new FavAppItemComponent(tile, this.page);
  }

  async focusedIndex() {
    const items = this.items();

    const idx = await items.evaluateAll((els) =>
      els.findIndex((el) => el.getAttribute('data-focused') === 'focused')
    );

    return idx; // -1 if none
  }

  async appIndex(appName) {
    const items = this.items();

    const idx = await items.evaluateAll((els, name) => {
      return els.findIndex((el) => {
        const testId = el.getAttribute('data-testid');
        return testId === name;
      });
    }, appName);

    return idx; // -1 if not found
  }
}