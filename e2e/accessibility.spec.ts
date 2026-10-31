import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('page and form expose accessible names, landmarks and relationships', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.5
  })
  await page.goto('/')
  await expect(page.getByText('1–10 / 48 məhsul')).toBeVisible()
  // The supplied palette has known contrast exceptions; keep exact reference colors in default mode.
  const list = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .disableRules(['color-contrast'])
    .analyze()
  expect(list.violations).toEqual([])
  await page.emulateMedia({ contrast: 'more' })
  const highContrastList = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(highContrastList.violations).toEqual([])
  await page.getByRole('button', { name: 'Yeni məhsul', exact: true }).click()
  const form = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(form.violations).toEqual([])
})

test('production headers and local assets work without policy violations', async ({ page }) => {
  const errors: string[] = []
  const externalRequests: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173')
      externalRequests.push(request.url())
  })
  await page.addInitScript(() => {
    Math.random = () => 0.5
  })
  const response = await page.goto('/')
  expect(response?.headers()['content-security-policy']).toContain("script-src 'self'")
  expect(response?.headers()['x-content-type-options']).toBe('nosniff')
  expect(response?.headers()['x-frame-options']).toBe('DENY')
  await expect(page.getByText('1–10 / 48 məhsul')).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  await page.getByRole('button', { name: 'Yeni məhsul', exact: true }).click()
  await expect(page.getByLabel(/Ad \(Azərbaycan/)).toBeFocused()
  expect(errors).toEqual([])
  expect(externalRequests).toEqual([])
})

test('layout fits small phones, tablets and desktop widths', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.5
  })
  await page.goto('/')
  await expect(page.getByText('1–10 / 48 məhsul')).toBeVisible()
  for (const width of [320, 375, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  }
})
