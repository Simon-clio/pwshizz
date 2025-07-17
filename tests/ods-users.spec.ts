import { test, expect } from '@playwright/test';
import { credentials } from './.credentials';

const baseUrl = 'https://core1-release.sharedo.co.uk/';

test('ODS Users: Add a new person with a funny name', async ({ page }) => {
  // Go to login page
  await page.goto(baseUrl);

  // Fill in username and password
  await page.getByLabel('Username').fill(credentials.username);
  await page.getByLabel('Password').fill(credentials.password);

  // Click login
  await page.getByRole('button', { name: 'Login' }).click();

  // Wait for dashboard (wait for baseUrl and check title contains 'My Worklist')
  await page.waitForURL(baseUrl);
  await expect(page).toHaveTitle(/My Worklist/i);

  // Click the button with the 'fa-plus' class
  await page.locator('.fa-plus').first().click();

  // Click 'Open Admin'
  await page.getByRole('menuitem', { name: /Open Admin/i }).click();

  // Wait for admin dashboard
  await expect(page.getByText('Dashboard · Administration')).toBeVisible();

  // Click 'Operational Data Store'
  await page.getByRole('link', { name: /Operational Data Store/i }).click();

  // Wait for ODS People section
  await expect(page.getByText('ODS MANAGEMENT: People')).toBeVisible();

  // Click 'Add New' button
  await page.getByRole('button', { name: /Add New/i }).first().click();

  // Fill in first and second name
  await page.getByLabel('First Name').fill('Basil');
  await page.getByLabel('Second Name').fill('Wigglesworth');

  // Click 'Save and Close'
  await page.getByRole('button', { name: /Save & Close/i }).click();

  // Verify the new entry appears in the list
  await expect(page.getByText('Basil Wigglesworth')).toBeVisible();
}); 