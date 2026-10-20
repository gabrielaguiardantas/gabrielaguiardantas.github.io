import { test as base, expect, type Page } from '@playwright/test'

const SECTIONS = ['about', 'stacks', 'projects', 'versions', 'contact']
const PORTUGUESE = {
  nav: ['sobre', 'stacks', 'projetos', 'versões', 'contato'],
  headings: ['Sobre', 'Stacks', 'Projetos', 'Versões', 'Contato'],
  footer: 'Desenvolvido por mim',
}
const ENGLISH = {
  nav: SECTIONS,
  headings: ['About', 'Stacks', 'Projects', 'Versions', 'Contact'],
  footer: 'Developed by me',
}

// falha qualquer teste que gere erro de console, exceção ou requisição com problema
const test = base.extend<{ pageErrors: void }>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(`console: ${message.text()}`)
      })
      page.on('requestfailed', (request) => errors.push(`requestfailed: ${request.url()}`))
      page.on('response', (response) => {
        if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`)
      })
      await use()
      expect(errors).toEqual([])
    },
    { auto: true },
  ],
})

const layout = (page: Page) => page.locator('#root > div')

async function expectLanguage(page: Page, language: typeof PORTUGUESE) {
  await expect(page.locator('nav a')).toHaveText(language.nav)
  await expect(page.locator('main h1')).toHaveText(language.headings)
  await expect(page.locator('footer')).toContainText(language.footer)
}

// o site usa scroll-behavior: smooth; espera o scrollY ficar parado por 500ms
async function waitForScrollEnd(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let last = -1
        let stableSince = performance.now()
        const tick = () => {
          if (scrollY !== last) {
            last = scrollY
            stableSince = performance.now()
          }
          if (performance.now() - stableSince >= 500) return resolve()
          requestAnimationFrame(tick)
        }
        tick()
      }),
  )
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
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
