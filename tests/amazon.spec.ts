import { test } from '@playwright/test';
import { AmazonPage } from '../pages/AmazonPage';

test('Amazon: search Television items on Amazon', async ({ page }) => {
  const searchTerm = process.env.AMAZON_SEARCH_TERM || 'television';

  const amazon = new AmazonPage(page);

  await amazon.openHomePage();
  await amazon.searchProduct(searchTerm);
});