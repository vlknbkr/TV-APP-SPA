import { BaseComponent } from '../BasePage/BaseComponent.js';

export class MiniBannerComponent extends BaseComponent {
    static SELECTORS = {
        item: '[role="listitem"]',
        image: 'img._bannerImage_wa18z_170'
    };

    constructor(root, page) {
        super(root, page);
        this.itemsLocator = this.root.locator(MiniBannerComponent.SELECTORS.item);
    }

    async waitForLoaded() {
        await this.root.waitFor({ state: 'visible' });
        await this.itemsLocator.first().waitFor({ state: 'visible', timeout: 15000 });
        await this.itemsLocator.first().locator(MiniBannerComponent.SELECTORS.image).waitFor({ state: 'attached' });
    }

    async getCount() {
        return this.itemsLocator.count();
    }

    getActiveItem() {
        return this.itemsLocator.filter({ hasText: '' }).filter({ 
            has: this.page.locator('[style*="translateX(0%)"]') 
        });
    }
}