import { ChannelInfoComponent } from './ChannelInfoComponent.js';
import { ChannelsMenuComponent } from './ChannelsMenuComponent.js';

export class ChannelsOverlayComponent {
  static SELECTORS = {
    overlay: '[data-testid="player-overlay"]'
  };

  constructor(page) {
    this.page = page;

    this.root = this.page.locator(ChannelsOverlayComponent.SELECTORS.overlay);
    this.channelInfo = new ChannelInfoComponent(this.root, this.page);
    this.menu = new ChannelsMenuComponent(this.root, this.page);
  }

  rootLocator() {
    return this.root;
  }
}