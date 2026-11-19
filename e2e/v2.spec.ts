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
const stage = (page: Page) => page.locator('main')
const hint = (page: Page) => page.getByText('// clique para explorar')
const guide = (page: Page) => page.locator('aside p[data-orbit-avoid="box"]')
// o texto digitado (o que se vê), sem as tags <p> decorativas
const guideTyped = (page: Page) => guide(page).locator('span[aria-hidden="true"]').nth(1)
const nb = (text: string) => text.replaceAll('-', '‑')
const GUIDE = {
  idle: nb('Bem-vindo ao meu portfólio. Tudo aqui orbita o <GAD />: clique nele para explorar.'),
  orbit: 'Cinco seções, cada uma um componente. Aponte para uma delas para saber o que tem lá.',
  projects: 'Uma seleção do que já construí, das APIs às aplicações em React, com o link para o código de cada um.',
  contact: nb('Os canais para conversarmos sobre oportunidades, projetos ou código: LinkedIn, GitHub e e-mail.'),
}

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
      await expect(identity.locator('footer')).toContainText('© 2026 Gabriel A. Dantas – Todos os direitos reservados. v2.0')
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

    test('has a share preview', async ({ page, request }) => {
      const meta = (selector: string) => page.locator(`head meta[${selector}]`)
      await expect(meta('name="description"')).toHaveAttribute('content', /^Desenvolvedor Full Stack \| Node\.js/)
      await expect(meta('property="og:title"')).toHaveAttribute('content', 'Gabriel Aguiar Dantas · Portfólio de Desenvolvedor Full Stack')
      await expect(meta('name="author"')).toHaveAttribute('content', 'Gabriel Aguiar Dantas')
      await expect(meta('property="og:image"')).toHaveAttribute('content', 'https://gabrielaguiardantas.github.io/og-image-v2.png')
      await expect(meta('name="twitter:card"')).toHaveAttribute('content', 'summary_large_image')
      // a imagem está publicada junto com o site
      const image = await request.get('/og-image-v2.png')
      expect(image.ok()).toBe(true)
      expect(image.headers()['content-type']).toBe('image/png')
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

    // a órbita nunca cobre o texto nem os ícones da coluna de identidade, e cabe na tela;
    // inclui notebooks de tela baixa, em que a coluna fica compacta
    for (const size of [
      { width: 1024, height: 600 },
      { width: 1024, height: 768 },
      { width: 1366, height: 650 },
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
        // a coluna de identidade inteira cabe na tela, sem rolagem
        expect((await box(page.locator('aside footer'))).y + (await box(page.locator('aside footer'))).height).toBeLessThanOrEqual(
          size.height,
        )
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(size.width)
      })
    }

    // celular deitado: não cabe a órbita, então vale a coluna única do celular, com a árvore
    test('a landscape phone gets the single column with the tree', async ({ page }) => {
      await page.setViewportSize({ width: 844, height: 390 })
      await core(page).click()
      await expectOrbit(page)
      // espera a entrada da árvore, em que cada item desliza da esquerda (o cursor pisca sem fim, e fica de fora)
      await page.evaluate(() =>
        Promise.all(
          document
            .getAnimations()
            .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
            .map((animation) => animation.finished),
        ),
      )
      const items = await Promise.all(SECTIONS.map(({ portuguese }) => box(satellite(page, portuguese))))
      // na árvore, as seções ficam uma embaixo da outra, alinhadas à esquerda
      for (let i = 1; i < items.length; i++) {
        expect(items[i].y).toBeGreaterThan(items[i - 1].y)
        expect(items[i].x).toBe(items[0].x)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(844)
    })
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
      const typed = panelSection(page, 'stacks').getByRole('heading', { level: 2 }).locator('[aria-hidden="true"]')
      await expect(typed).toBeVisible()
      // já na primeira leitura o título está inteiro: digitado, levaria mais de 300 ms
      expect(await typed.textContent()).toBe('<Stacks />')
    })

    test('each section has its content, in both languages', async ({ page }) => {
      await page.goto('/#about')
      await expect(panelSection(page, 'about').locator('ol li')).toHaveCount(5)
      await expect(panelSection(page, 'about')).toContainText('// trajetória')

      await page.goto('/#stacks')
      await expect(panelSection(page, 'stacks').locator('dt')).toHaveText([
        'frontEnd',
        'backEnd',
        'dados',
        'testes',
        'devOps',
        'práticas',
        'ia',
      ])

      await page.goto('/#projects')
      await expect(panelSection(page, 'projects').getByRole('link', { name: /^Código de .* no GitHub$/ })).toHaveCount(6)
      await expect(panelSection(page, 'projects')).toContainText('O código do meu trabalho na Fitinsur é privado')
      // depois da seleção, o link para todos os repositórios
      await expect(panelSection(page, 'projects').getByRole('link', { name: 'todos os repositórios no GitHub', exact: true })).toHaveAttribute(
        'href',
        'https://github.com/gabrielaguiardantas?tab=repositories',
      )

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

  test.describe('invitation', () => {
    test('types <GAD /> on load, then shows the hint', async ({ page }) => {
      await expect(stage(page)).toHaveAttribute('data-intro', 'typing')
      await expect(hint(page)).toHaveCSS('opacity', '0')
      await expect(stage(page)).not.toHaveAttribute('data-intro', 'typing', { timeout: 4000 })
      await expect(hint(page)).toHaveCSS('opacity', '1')
    })

    test('a click while typing completes <GAD /> and opens the orbit', async ({ page }) => {
      await expect(stage(page)).toHaveAttribute('data-intro', 'typing')
      await core(page).click()
      await expectOrbit(page)
      await expect(stage(page)).not.toHaveAttribute('data-intro')
    })

    test('skips the typing when the page opens on a section', async ({ page }) => {
      await page.goto('/#projects')
      await expectSection(page, 'projects')
      await expect(stage(page)).not.toHaveAttribute('data-intro')
    })

    test('skips the typing with reduced motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/')
      await expect(stage(page)).not.toHaveAttribute('data-intro')
      await expect(hint(page)).toBeVisible()
    })
  })

  test.describe('guide', () => {
    test.skip(({ viewport }) => viewport!.width <= 820, 'the guide is hidden on mobile')

    test('waits for <GAD />, then types the welcome', async ({ page }) => {
      await expect(stage(page)).toHaveAttribute('data-intro', 'typing')
      await expect(guide(page)).toHaveCSS('opacity', '0')
      await expect(guideTyped(page)).toHaveText(GUIDE.idle, { timeout: 6000 })
      await expect(guide(page)).toHaveCSS('opacity', '1')
    })

    test('explains the orbit, the pointed section and the open section', async ({ page }) => {
      await core(page).click()
      await expectOrbit(page)
      await expect(guideTyped(page)).toHaveText(GUIDE.orbit)

      await satellite(page, 'Projetos').hover()
      await expect(guideTyped(page)).toHaveText(GUIDE.projects)
      // tirar o mouse volta ao texto da órbita
      await page.mouse.move(5, 5)
      await expect(guideTyped(page)).toHaveText(GUIDE.orbit)

      // o foco pelo teclado também aponta
      await satellite(page, 'Contato').focus()
      await expect(guideTyped(page)).toHaveText(GUIDE.contact)
      await page.keyboard.press('Enter')
      await expectSection(page, 'contact')
      await expect(guideTyped(page)).toHaveText(GUIDE.contact)
    })

    test('gives screen readers the whole text at once', async ({ page }) => {
      await page.goto('/#projects')
      await expect(guide(page)).toContainText(GUIDE.projects)
    })

    test('follows the language', async ({ page }) => {
      await page.goto('/#explore')
      await page.getByRole('button', { name: 'English' }).click()
      await expect(guideTyped(page)).toHaveText("Five sections, each one a component. Point at one to see what's inside.")
    })

    test('shows the text at once with reduced motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/')
      await expect(guide(page)).toBeVisible()
      // já na primeira leitura o texto está inteiro: digitado, levaria mais de 600 ms
      expect(await guideTyped(page).textContent()).toBe(GUIDE.idle)
    })
  })

  test('the guide is hidden on mobile', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile only')
    await expect(guide(page)).toBeHidden()
  })

  test.describe('about', () => {
    const about = (page: Page) => panelSection(page, 'about')
    const familyButton = (page: Page) => about(page).getByRole('button', { name: 'minha família' })
    // a miniatura é decorativa (o botão já diz o que é); a foto ampliada abre num diálogo
    const thumbnail = (page: Page) => about(page).locator('button[aria-hidden="true"] img')
    const lightbox = (page: Page) => page.getByRole('dialog', { name: 'Foto da minha família' })

    test.beforeEach(async ({ page }) => {
      await page.goto('/#about')
      await expectSection(page, 'about')
    })

    test('has the achievements, the journey with links and how it started', async ({ page }) => {
      await expect(about(page).locator('ul li')).toHaveCount(4)
      await expect(about(page)).toContainText('Mais de 150 tickets entregues')
      const places = about(page).locator('ol a')
      await expect(places).toHaveText(['UFES', 'IBGE', 'Trybe', 'Fitinsur', 'UVV'])
      expect(await places.evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
        'https://www.ufes.br/',
        'https://www.ibge.gov.br/',
        'https://www.betrybe.com/',
        'https://www.fitinsur.com.br/',
        'https://www.uvv.br/',
      ])
      for (const link of await places.all()) await expect(link).toHaveAttribute('target', '_blank')
      await expect(about(page)).toContainText('// como comecei')
    })

    test('the mouse shows the thumbnail, and a click enlarges the photo', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name === 'mobile', 'no mouse on mobile')
      await expect(thumbnail(page)).toHaveCount(0)
      await familyButton(page).hover()
      await expect(thumbnail(page)).toBeVisible()
      await page.mouse.move(5, 5)
      await expect(thumbnail(page)).toHaveCount(0)

      await familyButton(page).hover()
      await familyButton(page).click()
      await expect(lightbox(page)).toBeVisible()
      // ampliada: o tamanho original, até o limite da tela (medido depois da animação de entrada)
      await lightbox(page).evaluate((dialog) => Promise.all(dialog.getAnimations().map((animation) => animation.finished)))
      const size = await lightbox(page).getByRole('img').evaluate((img) => {
        const rect = img.getBoundingClientRect()
        return { width: rect.width, height: rect.height }
      })
      const viewport = page.viewportSize()!
      expect(size.width <= 2048 && size.height <= viewport.height).toBe(true)
      expect(Math.max(size.width / (viewport.width - 48), size.height / (viewport.height - 48))).toBeGreaterThan(0.98)

      // um clique em qualquer lugar fecha, e a seção continua aberta
      await page.mouse.click(5, 5)
      await expect(lightbox(page)).toHaveCount(0)
      await expectSection(page, 'about')
    })

    test('a tap shows the thumbnail, and a tap on it enlarges the photo', async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
      const page = await context.newPage()
      await page.goto('/#about')
      await familyButton(page).tap()
      await expect(thumbnail(page)).toBeVisible()
      await thumbnail(page).tap()
      await expect(lightbox(page)).toBeVisible()
      await lightbox(page).tap()
      await expect(lightbox(page)).toHaveCount(0)
      await familyButton(page).tap()
      await expect(thumbnail(page)).toHaveCount(0)
      await context.close()
    })

    // a palavra cai em pontos diferentes da linha conforme a largura e a fonte do aparelho
    // (no Redmi Note 11S, 393px com Roboto, ela ficava no fim da linha e a miniatura saía cortada)
    test('the thumbnail stays inside the screen at any phone width', async ({ browser }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile', 'one run is enough')
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
      const page = await context.newPage()
      await page.goto('/#about')
      for (let width = 340; width <= 430; width += 6) {
        await page.setViewportSize({ width, height: 844 })
        await familyButton(page).scrollIntoViewIfNeeded()
        await familyButton(page).tap()
        await expect(thumbnail(page)).toBeVisible()
        const frame = about(page).locator('button[aria-hidden="true"]')
        await frame.evaluate((element) => Promise.all(element.parentElement!.getAnimations().map((a) => a.finished)))
        const box = (await frame.boundingBox())!
        expect(box.x, `left edge at ${width}px`).toBeGreaterThanOrEqual(15.5)
        expect(box.x + box.width, `right edge at ${width}px`).toBeLessThanOrEqual(width - 15.5)
        await familyButton(page).tap()
        await expect(thumbnail(page)).toHaveCount(0)
      }
      await context.close()
    })

    test('the keyboard opens and closes it all, one Escape at a time', async ({ page }) => {
      // chega ao botão pelo Tab, a partir do último link da trajetória
      await about(page).locator('ol a').last().focus()
      await page.keyboard.press('Tab')
      await expect(familyButton(page)).toBeFocused()
      await expect(thumbnail(page)).toBeVisible()
      await expect(familyButton(page)).toHaveAttribute('aria-expanded', 'true')

      await page.keyboard.press('Enter')
      await expect(lightbox(page)).toBeVisible()
      await expect(lightbox(page).getByRole('button', { name: 'Fechar a foto' })).toBeFocused()

      // 1º Esc: fecha a foto ampliada e devolve o foco ao botão
      await page.keyboard.press('Escape')
      await expect(lightbox(page)).toHaveCount(0)
      await expect(familyButton(page)).toBeFocused()
      await expectSection(page, 'about')
      // 2º Esc: fecha a miniatura; 3º: volta para a órbita, como sempre
      await page.keyboard.press('Escape')
      await expect(thumbnail(page)).toHaveCount(0)
      await expectSection(page, 'about')
      await page.keyboard.press('Escape')
      await expectOrbit(page)
    })
  })

  test.describe('keyboard and screen readers', () => {
    const title = (page: Page, id: string) => panelSection(page, id).getByRole('heading', { level: 2 })

    test('the focus follows the navigation', async ({ page }) => {
      await core(page).focus()
      await page.keyboard.press('Enter')
      await expectOrbit(page)
      await expect(core(page)).toBeFocused()

      await page.keyboard.press('Tab')
      await expect(satellite(page, 'Sobre')).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(satellite(page, 'Stacks')).toBeFocused()
      await page.keyboard.press('Enter')
      await expectSection(page, 'stacks')
      // o título recebe o foco, e o leitor de tela anuncia a seção
      await expect(title(page, 'stacks')).toBeFocused()

      // ao voltar, o foco vai para a seção de onde se veio e, depois, para o <GAD />
      await page.keyboard.press('Escape')
      await expectOrbit(page)
      await expect(satellite(page, 'Stacks')).toBeFocused()
      await page.keyboard.press('Escape')
      await expectIdle(page)
      await expect(core(page)).toBeFocused()
    })

    test('the browser Back also brings the focus back to the orbit', async ({ page }) => {
      await core(page).click()
      await satellite(page, 'Projetos').click()
      await expect(title(page, 'projects')).toBeFocused()
      await browserBack(page)
      await expectOrbit(page)
      await expect(satellite(page, 'Projetos')).toBeFocused()
    })

    test('opening the page on a section leaves the focus alone', async ({ page }) => {
      // um carregamento de verdade: o goto para '/#projects' a partir de '/' só trocaria o #
      await page.goto('/#projects')
      await page.reload()
      await expectSection(page, 'projects')
      expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true)
    })

    // o que o leitor de tela recebe, conferido com o NVDA: palavras, sem a decoração de código
    test('screen readers hear words, not code decoration', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name === 'mobile', 'the same markup; the guide is hidden on mobile')
      // o guia diz "GAD", e não "menor GAD barra maior"
      await expect(guide(page).locator('span').last()).toHaveText(
        nb('Bem-vindo ao meu portfólio. Tudo aqui orbita o GAD: clique nele para explorar.'),
        { timeout: 6000 },
      )
      // as bandeiras são decorativas: o nome está no botão, sem "gráfico"
      await expect(page.getByRole('group', { name: 'Idioma' }).getByRole('img')).toHaveCount(0)
      await expect(page.getByRole('button', { name: 'Português' })).toHaveAttribute('aria-pressed', 'true')
      // nenhuma seção tem "//" (barra barra) nem "↗" (seta para cima e para a direita) para o
      // leitor; as linhas /url ficam de fora, porque o "https://" dos links não é lido
      for (const id of ['about', 'stacks', 'projects', 'versions', 'contact']) {
        await page.goto(`/#${id}`)
        await expectSection(page, id)
        const spoken = (await panelSection(page, id).ariaSnapshot())
          .split('\n')
          .filter((line) => !line.includes('/url:'))
          .join('\n')
        expect(spoken, id).not.toMatch(/\/\/|↗/)
      }
      // os chips são itens de lista, lidos um a um ("HTML", "CSS", e não "HTMLCSS")
      await page.goto('/#stacks')
      for (const chip of ['HTML', 'CSS', 'POO', 'SOLID']) {
        await expect(panelSection(page, 'stacks').getByRole('listitem').filter({ hasText: new RegExp(`^${chip}$`) })).toHaveCount(1)
      }
    })

    test('the tab title says where you are, in the current language', async ({ page }) => {
      await expect(page).toHaveTitle('Gabriel Aguiar Dantas')
      await page.goto('/#projects')
      await expect(page).toHaveTitle('Projetos · Gabriel Aguiar Dantas')
      await page.getByRole('button', { name: 'English' }).click()
      await expect(page).toHaveTitle('Projects · Gabriel Aguiar Dantas')
      await page.keyboard.press('Escape')
      await expect(page).toHaveTitle('Gabriel Aguiar Dantas')
    })

    // percorre os controles com Tab e confere que cada um mostra o contorno de foco
    for (const address of ['/#explore', '/#projects', '/#versions', '/#contact']) {
      test(`every control shows a focus ring (${address})`, async ({ page }) => {
        // carregamento de verdade, para o Tab começar do topo da página
        await page.goto(address)
        await page.reload()
        await page.waitForTimeout(1000)
        let count = 0
        for (let i = 0; i < 40; i++) {
          await page.keyboard.press('Tab')
          const focused = await page.evaluate(() => {
            const element = document.activeElement as HTMLElement
            // o fim da página, ou a volta ao primeiro controle
            if (element === document.body || element.dataset.tabbed) return null
            element.dataset.tabbed = 'yes'
            const style = getComputedStyle(element)
            return {
              name: element.getAttribute('aria-label') || element.title || element.textContent?.trim().slice(0, 40),
              outline: style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0,
            }
          })
          if (!focused) break
          count += 1
          expect(focused.outline, focused.name).toBe(true)
        }
        expect(count).toBeGreaterThan(5)
      })
    }
  })
})
