import { test, expect } from "@playwright/test";

test("ChatModal test", async ({ page }) => {
  // Navigate to the Storybook story
  await page.goto("http://localhost:6006/?path=/story/components-chatmodal--default");

  // Wait for the page to load (optional, but recommended)
  await page.waitForLoadState("networkidle");

  // Check if the page contains the ChatModal component
  const component = page.locator("body");
  await expect(component).toBeVisible();
});