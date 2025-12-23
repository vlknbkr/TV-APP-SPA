// src/components/FavAppListComponent.js
import { BaseComponent } from './BaseComponent.js';
import { FavAppItemComponent } from './FavAppItemComponent.js';

export class FavAppListComponent extends BaseComponent {
  // root of this component MUST be: page.locator('[data-testid="user-apps"]')

  list() {
    return this.root.locator('#favourite-apps[role="list"][aria-label="Favourite Apps"]');
  }

  items() {
    return this.list().locator('[role="listitem"][data-testid]');
  }

  async count() {
    return this.items().count();
  }

  async isContentReady() {
    const ready = await this.list().getAttribute('data-content-ready');
    return ready === 'true';
  }

  async exists(appName) {
    return (await this.list().locator(`[role="listitem"][data-testid="${appName}"]`).count()) > 0;
  }

  item(appName) {
    const tile = this.list().locator(`[role="listitem"][data-testid="${appName}"]`).first();
    return new FavAppItemComponent(tile, this.page);
  }
}