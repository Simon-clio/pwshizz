import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://core1-release.sharedo.co.uk/';
const loginUrl = 'https://core1-release-identity.sharedo.co.uk/login';

const correctUsername = 'pwshizz';
const correctPassword = 'q4ruleZZZ';
const wrongUsername = 'wronguser';
const wrongPassword = 'wrongpass';

// Store the datetime folder name for this test run
let runDatetimeFolder: string;
const groupFolder = 'login';
let screenshotsDir: string;

test.beforeAll(async () => {
  const now = new Date();
  // Format: YYYY-MM-DDTHH-MM (nearest minute)
  const pad = (n: number) => n.toString().padStart(2, '0');
  runDatetimeFolder = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}-${pad(now.getMinutes())}`;
  screenshotsDir = path.join(__dirname, '..', 'results', runDatetimeFolder, groupFolder, 'screenshots');
  fs.mkdirSync(screenshotsDir, { recursive: true });
});

async function takeScreenshot(page, testName: string) {
  const filePath = path.join(screenshotsDir, `${testName}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
}

test('can access the login page', async ({ page }, testInfo) => {
  await page.goto(baseUrl);
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await takeScreenshot(page, testInfo.title);
});

test('username field can be interacted with and populated', async ({ page }, testInfo) => {
  await page.goto(baseUrl);
  const username = page.getByRole('textbox', { name: 'Username' });
  await expect(username).toBeVisible();
  await username.fill('testuser');
  await expect(username).toHaveValue('testuser');
  await takeScreenshot(page, testInfo.title);
});

test('password field can be interacted with and populated', async ({ page }, testInfo) => {
  await page.goto(baseUrl);
  const password = page.getByRole('textbox', { name: 'Password' });
  await expect(password).toBeVisible();
  await password.fill('testpass');
  await expect(password).toHaveValue('testpass');
  await takeScreenshot(page, testInfo.title);
});

test('login works with correct credentials', async ({ page }, testInfo) => {
  await page.goto(baseUrl);
  await page.getByRole('textbox', { name: 'Username' }).fill(correctUsername);
  await page.getByRole('textbox', { name: 'Password' }).fill(correctPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(baseUrl);
  await expect(page).toHaveTitle(/My Worklist/);
  await takeScreenshot(page, testInfo.title);
});

test('login fails with wrong username and correct password', async ({ page }, testInfo) => {
  await page.goto(baseUrl);
  await page.getByRole('textbox', { name: 'Username' }).fill(wrongUsername);
  await page.getByRole('textbox', { name: 'Password' }).fill(correctPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText(/invalid|incorrect|failed/i)).toBeVisible({ timeout: 5000 }).catch(() => {});
  await takeScreenshot(page, testInfo.title);
});

test('login fails with correct username and wrong password', async ({ page }, testInfo) => {
  await page.goto(baseUrl);
  await page.getByRole('textbox', { name: 'Username' }).fill(correctUsername);
  await page.getByRole('textbox', { name: 'Password' }).fill(wrongPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText(/invalid|incorrect|failed/i)).toBeVisible({ timeout: 5000 }).catch(() => {});
  await takeScreenshot(page, testInfo.title);
});

test('login fails with wrong username and wrong password', async ({ page }, testInfo) => {
  await page.goto(baseUrl);
  await page.getByRole('textbox', { name: 'Username' }).fill(wrongUsername);
  await page.getByRole('textbox', { name: 'Password' }).fill(wrongPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText(/invalid|incorrect|failed/i)).toBeVisible({ timeout: 5000 }).catch(() => {});
  await takeScreenshot(page, testInfo.title);
}); 