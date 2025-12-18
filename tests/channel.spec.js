import { test } from "../src/fixtures/fixtures.js"; // Adjust path to your fixtures

test.describe('Channels Page Verification', () => {

    test('should verify channels page is available to use', async ({ channelPage }) => {
        // Pre-condition
        await channelPage.open();
        
        // Assertion
        await channelPage.verifyChannelsPageIsAvailable();
    });
});