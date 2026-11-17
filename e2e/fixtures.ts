import { test as base, expect, type FrameLocator, type Page } from '@playwright/test'

export { expect }

export const SECTIONS = ['about', 'stacks', 'projects', 'versions', 'contact']
export const PORTUGUESE = {
  nav: ['sobre', 'stacks', 'projetos', 'versões', 'contato'],
  headings: ['Sobre', 'Stacks', 'Projetos', 'Versões', 'Contato'],
  footer: 'Desenvolvido por mim',
}
export const ENGLISH = {
  nav: SECTIONS,
  headings: ['About', 'Stacks', 'Projects', 'Versions', 'Contact'],
  footer: 'Developed by me',
}

// falha qualquer teste que gere erro de console, exceção ou requisição com problema
// (inclusive dentro do iframe da v1)
export const test = base.extend<{ pageErrors: void }>({
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

// aceita a página ou o iframe da v1 (frameLocator)
export async function expectLanguage(scope: Page | FrameLocator, language: typeof PORTUGUESE) {
  await expect(scope.locator('nav a')).toHaveText(language.nav)
  await expect(scope.locator('main h1')).toHaveText(language.headings)
  await expect(scope.locator('footer')).toContainText(language.footer)
}

// o site usa scroll-behavior: smooth; espera o scrollY ficar parado por 500ms
export async function waitForScrollEnd(page: Page) {
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
