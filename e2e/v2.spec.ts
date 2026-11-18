import type { Locator, Page } from '@playwright/test'
import { expect, test } from './fixtures.ts'

const SECTIONS = [
  { id: 'about', portuguese: 'Sobre', english: 'About' },
  { id: 'stacks', portuguese: 'Stacks', english: 'Stacks' },
  { id: 'projects', portuguese: 'Projetos', english: 'Projects' },
  { id: 'versions', portuguese: 'Versões', english: 'Versions' },
  { id: 'contact', portuguese: 'Contato', english: 'Contact' },
]

const core = (page: Page) => page.locator('main > button[aria-controls="orbit"]')
const satellite = (page: Page, name: string) => page.locator('#orbit').getByRole('button', { name, exact: true })
const panelSection = (page: Page, id: string) => page.locator(`main [data-section="${id}"]`)
const browserBack = (page: Page) => page.evaluate(() => history.back())

// a órbita está aberta quando todas as seções podem ser clicadas
async function expectOrbit(page: Page) {
  await expect(page).toHaveURL(/#explore$/)
  await expect(core(page)).toHaveAttribute('aria-expanded', 'true')
  for (const { portuguese } of SECTIONS) await expect(satellite(page, portuguese)).toBeVisible()
}

async function expectIdle(page: Page) {
  await expect(page).toHaveURL(/\/$/)
  await expect(core(page)).toHaveAccessibleName('Explorar as seções')
  await expect(page.locator('#orbit')).toHaveAttribute('inert')
}

async function expectSection(page: Page, id: string) {
  await expect(page).toHaveURL(new RegExp(`#${id}$`))
  await expect(core(page)).toHaveAccessibleName('Voltar às seções')
  await expect(panelSection(page, id)).toBeVisible()
}

const box = async (locator: Locator) => (await locator.boundingBox())!
const overlaps = (a: { x: number; y: number; width: number; height: number }, b: typeof a) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

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

  test.describe('navigation', () => {
    test('opens the orbit, a section, and goes back one step at a time', async ({ page }) => {
      await expectIdle(page)
      await core(page).click()
      await expectOrbit(page)

      await satellite(page, 'Projetos').click()
      await expectSection(page, 'projects')

      // o <GAD /> no canto volta para a órbita
      await core(page).click()
      await expectOrbit(page)
      await satellite(page, 'Contato').click()
      await expectSection(page, 'contact')

      // o "Voltar" desfaz uma ação por vez (D10)
      await browserBack(page)
      await expectOrbit(page)
      await browserBack(page)
      await expectSection(page, 'projects')
      await browserBack(page)
      await expectOrbit(page)
      await browserBack(page)
      await expectIdle(page)
    })

    test('closes the orbit with a second click on <GAD />', async ({ page }) => {
      await core(page).click()
      await expectOrbit(page)
      await core(page).click()
      await expectIdle(page)
    })

    test('Escape goes up one level', async ({ page }) => {
      await core(page).click()
      await satellite(page, 'Sobre').click()
      await expectSection(page, 'about')

      await page.keyboard.press('Escape')
      await expectOrbit(page)
      await page.keyboard.press('Escape')
      await expectIdle(page)
    })

    test('opens a section straight from its address', async ({ page }) => {
      for (const { id } of SECTIONS) {
        await page.goto(`/#${id}`)
        await expectSection(page, id)
      }
    })

    test('an unknown address shows the start', async ({ page }) => {
      await page.goto('/#nowhere')
      await expect(core(page)).toHaveAccessibleName('Explorar as seções')
      await expect(page.locator('#orbit')).toHaveAttribute('inert')
    })

    test('the email icon opens the contact section', async ({ page }) => {
      await page.locator('aside').getByRole('link', { name: 'E-mail' }).click()
      await expectSection(page, 'contact')
    })

    test('the section names follow the language', async ({ page }) => {
      await page.getByRole('button', { name: 'English' }).click()
      await page.getByRole('button', { name: 'Explore the sections' }).click()
      for (const { english } of SECTIONS) await expect(satellite(page, english)).toBeVisible()
    })
  })

  test.describe('orbit layout', () => {
    test.skip(({ viewport }) => viewport!.width <= 820, 'on mobile the orbit is a tree')

    // a órbita nunca cobre o texto nem os ícones da coluna de identidade, e cabe na tela
    for (const size of [
      { width: 1024, height: 768 },
      { width: 1280, height: 800 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 },
    ]) {
      test(`fits beside the identity column at ${size.width}x${size.height}`, async ({ page }) => {
        await page.setViewportSize(size)
        await page.evaluate(() => document.fonts.ready)
        await core(page).click()
        await expectOrbit(page)
        // espera as seções chegarem ao lugar
        await page.waitForTimeout(1200)

        // texto: só onde há letras (Range), não a caixa do parágrafo; ícones: a caixa inteira
        const obstacles = await page.locator('[data-orbit-avoid]').evaluateAll((elements) =>
          elements.map((element) => {
            const range = document.createRange()
            range.selectNodeContents(element)
            const rect =
              (element as HTMLElement).dataset.orbitAvoid === 'ink'
                ? range.getBoundingClientRect()
                : element.getBoundingClientRect()
            return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
          }),
        )
        for (const { portuguese } of SECTIONS) {
          const sat = await box(satellite(page, portuguese))
          expect(sat.x + sat.width).toBeLessThanOrEqual(size.width)
          expect(sat.y).toBeGreaterThanOrEqual(0)
          expect(sat.y + sat.height).toBeLessThanOrEqual(size.height)
          for (const obstacle of obstacles) expect(overlaps(sat, obstacle), portuguese).toBe(false)
        }
      })
    }
  })

  test.describe('sections', () => {
    test('types the section title in, with the full name for screen readers', async ({ page }) => {
      await page.goto('/#projects')
      const title = panelSection(page, 'projects').getByRole('heading', { level: 2 })
      await expect(title).toHaveAccessibleName('Projetos')
      // o texto visível termina com o nome inteiro
      await expect(title.locator('[aria-hidden="true"]')).toHaveText('<Projetos />')
    })

    test('shows the title at once with reduced motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/#stacks')
      await expect(panelSection(page, 'stacks').getByRole('heading', { level: 2 }).locator('[aria-hidden="true"]')).toHaveText(
        '<Stacks />',
        { timeout: 100 },
      )
    })

    test('each section has its content, in both languages', async ({ page }) => {
      await page.goto('/#about')
      await expect(panelSection(page, 'about').locator('ol li')).toHaveCount(5)
      await expect(panelSection(page, 'about')).toContainText('// trajetória')

      await page.goto('/#stacks')
      await expect(panelSection(page, 'stacks').locator('dt')).toHaveText(['frontEnd', 'backEnd', 'dados', 'testes', 'ferramentas'])

      await page.goto('/#projects')
      await expect(panelSection(page, 'projects').getByRole('link')).toHaveCount(6)

      await page.goto('/#contact')
      await expect(panelSection(page, 'contact').getByRole('link', { name: 'gabrielaguiardantas@gmail.com' })).toHaveAttribute(
        'href',
        'mailto:gabrielaguiardantas@gmail.com',
      )

      await page.goto('/#versions')
      await expect(panelSection(page, 'versions').getByRole('button', { name: 'Atual' })).toBeDisabled()

      await page.getByRole('button', { name: 'English' }).click()
      await expect(panelSection(page, 'versions').getByRole('heading', { level: 2 })).toHaveAccessibleName('Versions')
      await expect(panelSection(page, 'versions').getByRole('button', { name: 'Back to 2023' })).toBeEnabled()
      await expect(panelSection(page, 'versions').getByRole('button', { name: 'Current' })).toBeDisabled()
    })

    test('every section opens scrolled to the top', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 500 })
      await page.goto('/#projects')
      const panel = panelSection(page, 'projects').locator('..')
      await panel.evaluate((element) => element.scrollTo(0, element.scrollHeight))
      await core(page).click()
      await satellite(page, 'Sobre').click()
      await expectSection(page, 'about')
      expect(await panelSection(page, 'about').locator('..').evaluate((element) => element.scrollTop)).toBe(0)
    })
  })
})
