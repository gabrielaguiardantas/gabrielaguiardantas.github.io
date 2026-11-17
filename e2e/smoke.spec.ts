import type { Page } from '@playwright/test'
import { ENGLISH, PORTUGUESE, SECTIONS, expect, expectLanguage, test, waitForScrollEnd } from './fixtures.ts'

const layout = (page: Page) => page.locator('#root > div')

// a v2 (página padrão) e a v1 aberta direto ainda compartilham o layout,
// então os mesmos testes valem para as duas
const PAGES = [
  ['v2', '/'],
  ['v1', '/v1.html'],
] as const

for (const [version, path] of PAGES) {
  test.describe(version, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path)
    })

    test('renders the layout for the viewport, in Portuguese', async ({ page }, testInfo) => {
      await expect(layout(page)).toHaveClass(testInfo.project.name)
      await expectLanguage(page, PORTUGUESE)
    })

    test('switches the language and back', async ({ page }) => {
      await page.getByRole('button', { name: 'english' }).click()
      await expectLanguage(page, ENGLISH)

      await page.getByRole('button', { name: 'portuguese' }).click()
      await expectLanguage(page, PORTUGUESE)
    })

    test('switches the layout when the window is resized', async ({ page }, testInfo) => {
      const isDesktop = testInfo.project.name === 'desktop'
      const initialViewport = page.viewportSize()!

      await page.setViewportSize(isDesktop ? { width: 800, height: 900 } : { width: 1280, height: 800 })
      await expect(layout(page)).toHaveClass(isDesktop ? 'mobile' : 'desktop')

      await page.setViewportSize(initialViewport)
      await expect(layout(page)).toHaveClass(testInfo.project.name)
    })

    test('highlights the nav item of the clicked section', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name === 'mobile', 'the nav is hidden on mobile')

      for (const section of SECTIONS) {
        await page.locator(`#a_${section}`).click()
        await waitForScrollEnd(page)
        await expect(page.locator('nav a.active')).toHaveId(`a_${section}`)
      }
    })
  })
}
