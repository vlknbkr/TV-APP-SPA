import { BaseComponent } from '../BasePage/BaseComponent';

export class AppItemComponent extends BaseComponent {
    static SELECTORS = {
        focusedAttr: 'data-focused',
        focusedValue: 'focused'
    };

    async getName() {
        const aria = await this.root.getAttribute('aria-label');
        return (aria ?? '').trim();
    }

    async isFocused() {
        const focused = await this.root.getAttribute(AppItemComponent.SELECTORS.focusedAttr);
        return focused === AppItemComponent.SELECTORS.focusedValue;
    }

    locator() {
        return this.root;
    }
}