import { BasePage } from './BasePage';
import { MenuComponent } from '../components/MenuComponent';

export class ChannelsPage extends BasePage {
  constructor(page) {
    super(page);
    this.menu = new MenuComponent(this.page.locator('placeholder'));
  }

  async open() { }

  async isLoaded() { }

  async switchChannel(channelName) { }
}
