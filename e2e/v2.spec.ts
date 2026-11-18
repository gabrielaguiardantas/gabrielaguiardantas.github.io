import { expect, test } from './fixtures.ts'

// a v2 (página padrão), com o layout novo da Fase 2 (D13)
test.describe('v2', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('identity column', () => {
    test('renders in Portuguese by default', async ({ page }) => {
      const identity = page.locator('aside')
      await expect(identity.getByRole('heading', { level: 1 })).toHaveText('Gabriel Aguiar Dantas')
      await expect(identity).toContainText('Desenvolvedor Full Stack')
      await expect(identity.locator('footer')).toContainText('© 2026 Gabriel A. Dantas - Todos os direitos reservados. v2.0')
      await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
      await expect(page.getByRole('button', { name: 'Português' })).toHaveAttribute('aria-pressed', 'true')
    })

    test('switches the language and back', async ({ page }) => {
      const identity = page.locator('aside')
      await page.getByRole('button', { name: 'English' }).click()
      await expect(identity).toContainText('Full Stack Developer')
      await expect(identity.locator('footer')).toContainText('All rights reserved. v2.0')
      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
      await expect(page.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')

      await page.getByRole('button', { name: 'Português' }).click()
      await expect(identity).toContainText('Desenvolvedor Full Stack')
      await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
    })

    test('links only the official channels', async ({ page }) => {
      const links = page.locator('aside header ul a')
      expect(await links.evaluateAll((elements) => elements.map((element) => element.getAttribute('aria-label')))).toEqual([
        'GitHub',
        'LinkedIn',
        'E-mail',
      ])
      await expect(links.nth(0)).toHaveAttribute('href', 'https://github.com/gabrielaguiardantas')
      await expect(links.nth(1)).toHaveAttribute('href', 'https://www.linkedin.com/in/gabrielaguiardantas')
      for (const external of [links.nth(0), links.nth(1)]) {
        await expect(external).toHaveAttribute('target', '_blank')
        await expect(external).toHaveAttribute('rel', 'noopener noreferrer')
      }
    })

    test('links the tools named in the footer', async ({ page }) => {
      const links = page.locator('aside footer a')
      await expect(links).toHaveText(['Claude', 'TypeScript', 'Visual Studio Code', 'React', 'Vite'])
      expect(await links.evaluateAll((elements) => elements.map((element) => element.getAttribute('href')))).toEqual([
        'https://claude.com/',
        'https://www.typescriptlang.org/',
        'https://code.visualstudio.com/',
        'https://react.dev/',
        'https://vite.dev/',
      ])
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute('target', '_blank')
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      }
    })

    test('loads JetBrains Mono from the site itself', async ({ page }) => {
      const fontFiles = await page.evaluate(async () => {
        await document.fonts.load('16px "JetBrains Mono Variable"')
        return performance
          .getEntriesByType('resource')
          .map((entry) => entry.name)
          .filter((url) => url.includes('jetbrains-mono'))
      })
      expect(fontFiles.length).toBeGreaterThan(0)
      for (const url of fontFiles) expect(new URL(url).origin).toBe(new URL(page.url()).origin)
    })
  })
})
