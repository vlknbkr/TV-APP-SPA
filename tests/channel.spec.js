import { test } from '../src/fixtures/fixtures.js';

test.describe('Channels Feature', () => {
  test('Add current channel to favorites via sidebar menu', async ({ channelsPage }) => {
    await channelsPage.open();

    await channelsPage.testFavoriteFullCycle();

    await channelsPage.switchChannel('down', 1);
  });
});