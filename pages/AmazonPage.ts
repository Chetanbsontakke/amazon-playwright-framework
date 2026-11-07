import { Page, expect } from '@playwright/test';

export class AmazonPage {
  constructor(private page: Page) {}

  async openHomePage() {
    await this.page.goto('/');

    const continuePrompt = this.page.getByText(
      'Click the button below to continue shopping',
      { exact: false }
    );

    if (await continuePrompt.isVisible()) {
      const continueButton = this.page.locator(
        'input.a-button-input[type="submit"][value="Continue shopping"]'
      ).or(this.page.getByRole('button', { name: /^continue shopping$/i }));

      await expect(continueButton.first()).toBeVisible({ timeout: 10_000 });
      await continueButton.first().click();
      await expect(continuePrompt).not.toBeVisible({ timeout: 15_000 });
    }
  }

  async signIn(email: string, password: string) {
    await this.page.locator('#nav-link-accountList').click();
    await this.page.locator('#ap_email').fill(email);
    await this.page.locator('#continue').click();

    await this.page.locator('#ap_password').fill(password);
    await this.page.locator('#signInSubmit').click();

    // Amazon may request an OTP, CAPTCHA, or additional verification.
    // Complete that step manually in the opened browser. This test does not
    // attempt to bypass security checks.
    await expect(this.page.locator('#nav-link-accountList'))
      .toContainText(/Hello/i, { timeout: 120_000 });
  }

  async searchProduct(searchTerm: string) {
    const searchBox = this.page
      .locator('#twotabsearchtextbox')
      .or(this.page.getByRole('textbox', { name: /search amazon/i }));

    await searchBox.first().waitFor({ timeout: 20_000 });
    await searchBox.first().fill(searchTerm);
    await searchBox.first().press('Enter');

    await expect.poll(() => this.page.url(), { timeout: 30_000 }).toContain(searchTerm.toLowerCase());
    await expect(this.page.locator('body')).toContainText(new RegExp(searchTerm, 'i'), { timeout: 30_000 });
  }

  async addProductToCart() {
    const addToCartButton = this.page.locator('#add-to-cart-button');
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    await expect(this.page.locator('#nav-cart-count'))
      .not.toHaveText('0', { timeout: 20_000 });
  }
}