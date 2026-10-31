import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Keep the real supplied API, but make random network outcomes deterministic in this browser only.
  await page.addInitScript(() => {
    Math.random = () => 0.5
  })
})

test('list, pagination, search, category and URL reload', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByText('1–10 / 48 məhsul')).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: `tmp/qa-${testInfo.project.name}.png`, fullPage: true })
  await expect(page.getByText('4,50 ₼', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Səhifə 5', exact: true }).click()
  await expect(page.getByText('41–48 / 48 məhsul')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Növbəti səhifə' })).toBeDisabled()
  await page.getByRole('searchbox').fill('soup')
  await expect(page.getByText('1–5 / 5 məhsul')).toBeVisible()
  await page.getByRole('combobox').selectOption('1')
  await expect(page).toHaveURL(/category=1/)
  await page.reload()
  await expect(page.getByRole('searchbox')).toHaveValue('soup')
  await expect(page.getByRole('combobox')).toHaveValue('1')
  await expect(page.getByText('1–5 / 5 məhsul')).toBeVisible()
  expect(errors).toEqual([])
})

test('create, edit and change sale status using the supplied API', async ({ page }) => {
  await page.goto('/')
  const createButton = page.getByRole('button', { name: 'Yeni məhsul', exact: true })
  await expect(createButton).toBeEnabled()
  await createButton.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByLabel(/Ad \(Azərbaycan/)).toBeFocused()
  await page.getByRole('button', { name: 'Yadda saxla', exact: true }).click()
  await expect(page.getByText('Azərbaycan dilində ad məcburidir.')).toBeVisible()
  await page.getByLabel(/Ad \(Azərbaycan/).fill('Yeni sınaq məhsulu')
  await page.getByRole('dialog').getByRole('combobox').selectOption('3')
  await page.getByLabel(/Qiymət/).fill('12,75')
  await page.getByRole('button', { name: 'Yadda saxla', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Yadda saxlanılır...' })).toBeDisabled()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await page.getByRole('searchbox').fill('Yeni sınaq məhsulu')
  await expect(page.getByText('1–1 / 1 məhsul')).toBeVisible()
  await expect(page.getByText('12,75 ₼')).toBeVisible()
  await page.getByRole('button', { name: 'Yeni sınaq məhsulu: düzəlt' }).click()
  await page.getByLabel(/Qiymət/).fill('13.50')
  await page.getByRole('button', { name: 'Yadda saxla', exact: true }).click()
  await expect(page.getByText('13,50 ₼')).toBeVisible()
  const toggle = page.getByRole('switch', { name: 'Yeni sınaq məhsulu: satış statusu' })
  await toggle.click()
  await expect(toggle).toBeDisabled()
  await expect(toggle).toHaveAttribute('aria-checked', 'false')
  await expect(page.getByText('Satışda deyil', { exact: true })).toBeVisible()
})

test('read and write failures remain recoverable', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0
  })
  await page.goto('/')
  await expect(page.getByRole('alert')).toHaveCount(2)
  await page.evaluate(() => {
    Math.random = () => 0.5
  })
  await page
    .getByRole('alert')
    .filter({ hasText: 'Kateqoriyalar yüklənmədi' })
    .getByRole('button')
    .click()
  await page
    .getByRole('alert')
    .filter({ hasNotText: 'Kateqoriyalar yüklənmədi' })
    .getByRole('button')
    .click()
  const toggle = page.getByRole('switch', { name: 'Mərci şorbası: satış statusu' })
  await expect(toggle).toBeVisible()
  await page.evaluate(() => {
    Math.random = () => 0
  })
  await toggle.click()
  await expect(page.getByRole('alert')).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-checked', 'true')
  await page.evaluate(() => {
    Math.random = () => 0.5
  })
  await page.getByRole('button', { name: 'Yenidən cəhd et' }).click()
  await expect(toggle).toHaveAttribute('aria-checked', 'false')
})

test('empty results, malformed URL and responsive layout', async ({ page }) => {
  await page.goto('/?page=-1&category=999')
  await expect(page.getByText('1–10 / 48 məhsul')).toBeVisible()
  await expect(page.getByRole('combobox')).toHaveValue('')
  await page.getByRole('searchbox').fill('mövcud-olmayan-məhsul')
  await expect(page.getByRole('heading', { name: 'Məhsul tapılmadı' })).toBeVisible()
  await page.getByRole('button', { name: 'Filtrləri təmizlə' }).click()
  await expect(page.getByText('1–10 / 48 məhsul')).toBeVisible()
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(overflow).toBe(false)
})

test('dialog keyboard focus, dirty cancel and focus restoration', async ({ page }) => {
  await page.goto('/')
  const createButton = page.getByRole('button', { name: 'Yeni məhsul', exact: true })
  await expect(createButton).toBeEnabled()
  await createButton.click()
  await page.getByLabel(/Ad \(Azərbaycan/).fill('Sınaq')
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press('Tab')
    expect(
      await page.getByRole('dialog').evaluate((dialog) => dialog.contains(document.activeElement)),
    ).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(
    page.getByRole('alert').filter({ hasText: 'Yadda saxlanılmamış dəyişikliklər' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Dəyişiklikləri ləğv et' }).click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(createButton).toBeFocused()
})
