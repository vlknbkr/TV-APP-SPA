import { expect } from '@playwright/test';
import { BasePage } from '../core/BasePage.js';
import { TITAN_OS_LOCATORS } from '../locators/locators.js';

export class ChannelPage extends BasePage {
    constructor(page, options = {}) {
        super(page, options);

        this.menuItem = page.locator(TITAN_OS_LOCATORS.MENU_ITEM('Channels'));
        this.activeChannel = page.locator(TITAN_OS_LOCATORS.CHANNELS_ACTIVE_TITLE);
        this.focusedChannel = page.locator(TITAN_OS_LOCATORS.CHANNELS_FOCUSED_ITEM);
        this.channelContainerReady = page.locator(TITAN_OS_LOCATORS.CHANNELS_CONTAINER_READY);
    }
    async open() {
        await this.goto('channels');
    }

    async verifyChannelsPageIsAvailable() {
        await this.waitUntilChannelsReady();
    }

    async waitUntilChannelsReady() {
        await this.waitForSpaReady();
        await expect(this.menuItem).toHaveAttribute('aria-selected', 'true');

        await expect(
            this.channelContainerReady,
            'Channels container is not ready'
        ).toBeVisible();

        await expect(
            this.activeChannel,
            'Active channel item not rendered'
        ).toBeVisible();

        await expect(
            this.focusedChannel,
            'Active channel is not focused'
        ).toBeVisible();
    }
}