// tests/channels.spec.js
import { test, expect } from '../src/fixtures/fixtures.js';

test.describe('Channels', () => {
  test('Verify channels page is available to us', async ({ channelsPage }) => {
    await channelsPage.open();

    const beforeKey = await channelsPage.overlay.channelInfo.currentKey();
    expect(beforeKey, 'Initial channel key should be readable').toBeTruthy();

    await channelsPage.switchChannel('down', 2);

    const afterKey = await channelsPage.overlay.channelInfo.currentKey();
    expect(afterKey, 'Channel should change after switching').not.toBe(beforeKey);

    await channelsPage.openMenu();
    await expect(channelsPage.overlay.menu.backButton(), 'Menu back button should be visible').toBeVisible();

    await channelsPage.closeMenu();
  });
});