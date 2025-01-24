import { test, expect } from "@playwright/test";

test("ChatModal opens and closes", async ({ page }) => {
  await page.goto("http://localhost:6006/?path=/story/components-chatmodal--default");

  // Check if the floating button is visible
  const button = page.locator('button[aria-label="add"]');
  await expect(button).toBeVisible();

  // Click the button to open the modal
  await button.click();

  // Check if the modal is visible
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible();

  // Click the close button to close the modal
  const closeButton = page.locator('button[aria-label="close"]');
  await closeButton.click();

  // Check if the modal is closed
  await expect(modal).not.toBeVisible();
});
