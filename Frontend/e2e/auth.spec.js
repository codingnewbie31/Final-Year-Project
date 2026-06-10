import { test, expect } from '@playwright/test';

// ── Reusable helper to fill and submit login form ────────────────────
async function fillLoginForm(page, email, password) {
  await page.fill('input[placeholder="Enter your email"]', email)
  await page.fill('input[placeholder="Enter your password"]', password)
  await page.click('button:has-text("Sign In")')
}

// ── Reusable helper to fill and submit signup form ───────────────────
async function fillSignupForm(page, { name, email, password, role }) {
  await page.fill('input[placeholder="Enter your full name"]', name)
  await page.fill('input[placeholder="Enter your email"]', email)
  await page.fill('input[placeholder="Create a strong password"]', password)
  await page.click(`text=${role === 'employer' ? 'Employer' : 'Job Seeker'}`)
}

// ────────────────────────────────────────────────────────────────────
test.describe('Login Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  // ✅ Test 1: Login page loads correctly
  test('should load login page with all fields', async ({ page }) => {
    await expect(page.locator('input[placeholder="Enter your email"]')).toBeVisible()
    await expect(page.locator('input[placeholder="Enter your password"]')).toBeVisible()
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible()
    await expect(page.locator('text=Welcome Back')).toBeVisible()
  })

  // ✅ Test 2: Shows validation errors on empty submit
  test('should show validation errors on empty submit', async ({ page }) => {
    await page.click('button:has-text("Sign In")')
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  // ✅ Test 3: Password visibility toggle
  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[placeholder="Enter your password"]')
    await expect(passwordInput).toHaveAttribute('type', 'password')

    await page.click('button[type="button"]')
    await expect(passwordInput).toHaveAttribute('type', 'text')

    await page.click('button[type="button"]')
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  // ✅ Test 4: Shows error for invalid credentials
  test('should show error for invalid credentials', async ({ page }) => {
    await fillLoginForm(page, 'wrong@example.com', 'wrongpassword')
    await expect(page.locator('text=/invalid|failed|credentials/i')).toBeVisible({ timeout: 8000 })
  })

  // ✅ Test 5: Link to signup page works
  test('should navigate to signup page', async ({ page }) => {
    await page.click('text=Create one here')
    await expect(page).toHaveURL(/signup/)
  })

})

// ────────────────────────────────────────────────────────────────────
test.describe('Signup Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/signup')
  })

  // ✅ Test 6: Signup page loads correctly
  test('should load signup page with all fields', async ({ page }) => {
    await expect(page.locator('input[placeholder="Enter your full name"]')).toBeVisible()
    await expect(page.locator('input[placeholder="Enter your email"]')).toBeVisible()
    await expect(page.locator('input[placeholder="Create a strong password"]')).toBeVisible()
    await expect(page.locator('text=Job Seeker')).toBeVisible()
    await expect(page.locator('text=Employer')).toBeVisible()
    await expect(page.locator('button:has-text("Create Account")')).toBeVisible()
  })

  // ✅ Test 7: Shows validation errors on empty submit
  test('should show validation errors on empty submit', async ({ page }) => {
    await page.click('button:has-text("Create Account")')
    await expect(page.locator('text=Enter full name')).toBeVisible()
    await expect(page.locator('text=Please select a role')).toBeVisible()
  })

  // ✅ Test 8: Role selection highlights correctly
  test('should highlight selected role', async ({ page }) => {
    await page.click('text=Job Seeker')
    await expect(page.locator('button:has-text("Job Seeker")')).toHaveClass(/border-blue-500/)

    await page.click('text=Employer')
    await expect(page.locator('button:has-text("Employer")')).toHaveClass(/border-blue-500/)
  })

  // ✅ Test 9: Password visibility toggle on signup
  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[placeholder="Create a strong password"]')
    await expect(passwordInput).toHaveAttribute('type', 'password')

    await page.click('button[type="button"]:near(input[placeholder="Create a strong password"])')
    await expect(passwordInput).toHaveAttribute('type', 'text')
  })

  // ✅ Test 10: Link to login page works
  test('should navigate to login page', async ({ page }) => {
    await page.click('text=Sign in here')
    await expect(page).toHaveURL(/login/)
  })

})